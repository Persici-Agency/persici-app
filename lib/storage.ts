import 'server-only';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import path from 'node:path';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim();
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME?.trim() || 'persici-media';
const publicUrl = (
  process.env.CLOUDFLARE_R2_PUBLIC_URL?.trim() || 'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev'
).replace(/\/$/, '');

let s3ClientInstance: S3Client | null = null;

export function isR2Configured(): boolean {
  return Boolean(accountId && accessKeyId && secretAccessKey && bucketName);
}

export function getS3Client(): S3Client | null {
  if (!isR2Configured()) return null;

  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    });
  }
  return s3ClientInstance;
}

/**
 * Converts a raw filename into an SEO-friendly slug:
 * lowercase, hyphens instead of spaces/special chars, no duplicate hyphens.
 */
export function toSeoFilename(filename: string): string {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  const sanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return sanitized || 'persici-asset';
}

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  originalSize: number;
  optimizedSize: number;
  savingsPercentage: number;
  format: string;
  width?: number;
  height?: number;
}

/**
 * Compresses an image in-flight using sharp:
 * - Resizes to max dimensions (default 2048px)
 * - Converts to optimized WebP format (default quality 80)
 * - Retains metadata orientation
 */
export async function optimizeImageBuffer(
  inputBuffer: Buffer,
  options: OptimizationOptions = {}
): Promise<{
  buffer: Buffer;
  optimizedSize: number;
  format: string;
  width?: number;
  height?: number;
}> {
  const { maxWidth = 2048, maxHeight = 2048, quality = 80 } = options;

  let pipeline = sharp(inputBuffer).rotate(); // auto-orient based on EXIF

  if (maxWidth || maxHeight) {
    pipeline = pipeline.resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const outputBuffer = await pipeline
    .webp({ quality, effort: 6 })
    .toBuffer();

  const metadata = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    optimizedSize: outputBuffer.length,
    format: 'webp',
    width: metadata.width,
    height: metadata.height,
  };
}

/**
 * Optimizes an image and uploads it directly to Cloudflare R2.
 */
export async function uploadOptimizedImageToR2(
  fileBuffer: Buffer,
  originalFilename: string,
  folder = 'uploads',
  options: OptimizationOptions = {}
): Promise<UploadResult> {
  const s3 = getS3Client();
  if (!s3) {
    throw new Error('Cloudflare R2 is not configured. Please check your environment variables.');
  }

  const originalSize = fileBuffer.length;
  const { buffer: optimizedBuffer, optimizedSize, width, height } =
    await optimizeImageBuffer(fileBuffer, options);

  const seoBase = toSeoFilename(originalFilename);
  const uniqueKey = `${folder}/${seoBase}-${Date.now()}.webp`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueKey,
    Body: optimizedBuffer,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await s3.send(command);

  const savings = Math.max(0, originalSize - optimizedSize);
  const savingsPercentage = originalSize > 0 ? Math.round((savings / originalSize) * 100) : 0;

  return {
    url: `${publicUrl}/${uniqueKey}`,
    key: uniqueKey,
    filename: path.basename(uniqueKey),
    originalSize,
    optimizedSize,
    savingsPercentage,
    format: 'webp',
    width,
    height,
  };
}

/**
 * Deletes a file from Cloudflare R2 by its storage key.
 */
export async function deleteFileFromR2(key: string): Promise<{ success: boolean; key: string }> {
  const s3 = getS3Client();
  if (!s3) {
    throw new Error('Cloudflare R2 is not configured.');
  }

  const cleanKey = key.replace(new RegExp(`^${publicUrl}/?`), '').replace(/^\/+/, '');

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: cleanKey,
  });

  await s3.send(command);
  return { success: true, key: cleanKey };
}

export interface R2FileItem {
  key: string;
  url: string;
  size: number;
  lastModified?: Date;
}

/**
 * Lists files in Cloudflare R2 with optional prefix (folder).
 */
export async function listFilesFromR2(prefix = '', maxKeys = 100): Promise<R2FileItem[]> {
  const s3 = getS3Client();
  if (!s3) return [];

  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
    MaxKeys: maxKeys,
  });

  const response = await s3.send(command);
  if (!response.Contents) return [];

  return response.Contents.filter((item) => Boolean(item.Key)).map((item) => ({
    key: item.Key!,
    url: `${publicUrl}/${item.Key}`,
    size: item.Size || 0,
    lastModified: item.LastModified,
  }));
}

/**
 * Uploads a document (PDF, DOC, DOCX) directly to Cloudflare R2 without image compression.
 */
export async function uploadDocumentToR2(
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string,
  folder = 'resumes'
): Promise<{ url: string; key: string; filename: string }> {
  const s3 = getS3Client();
  if (!s3) {
    throw new Error('Cloudflare R2 is not configured. Please check your environment variables.');
  }

  const ext = path.extname(originalFilename);
  const baseName = toSeoFilename(originalFilename);
  const uniqueKey = `${folder}/${baseName}-${Date.now()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueKey,
    Body: fileBuffer,
    ContentType: mimeType,
    CacheControl: 'private, max-age=31536000',
  });

  await s3.send(command);

  return {
    url: `${publicUrl}/${uniqueKey}`,
    key: uniqueKey,
    filename: path.basename(uniqueKey),
  };
}

/**
 * Uploads any non-image asset (Video, Document, Archive) directly to Cloudflare R2.
 */
export async function uploadGenericFileToR2(
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string,
  folder = 'media'
): Promise<UploadResult> {
  const s3 = getS3Client();
  if (!s3) {
    throw new Error('Cloudflare R2 is not configured.');
  }

  const ext = path.extname(originalFilename);
  const baseName = toSeoFilename(originalFilename);
  const uniqueKey = `${folder}/${baseName}-${Date.now()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueKey,
    Body: fileBuffer,
    ContentType: mimeType || 'application/octet-stream',
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await s3.send(command);

  return {
    url: `${publicUrl}/${uniqueKey}`,
    key: uniqueKey,
    filename: path.basename(uniqueKey),
    originalSize: fileBuffer.length,
    optimizedSize: fileBuffer.length,
    savingsPercentage: 0,
    format: ext.replace(/^\./, '').toLowerCase(),
  };
}

/**
 * Uploads a WebP video thumbnail to Cloudflare R2.
 */
export async function uploadThumbnailToR2(
  imageBuffer: Buffer,
  videoKey: string
): Promise<{ url: string; key: string }> {
  const s3 = getS3Client();
  if (!s3) throw new Error('Cloudflare R2 not configured.');

  const videoBase = path.basename(videoKey, path.extname(videoKey));
  const thumbKey = `thumbnails/${videoBase}-thumb-${Date.now()}.webp`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: thumbKey,
    Body: imageBuffer,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await s3.send(command);

  return {
    url: `${publicUrl}/${thumbKey}`,
    key: thumbKey,
  };
}


