import { NextRequest, NextResponse } from 'next/server';
import {
  uploadOptimizedImageToR2,
  uploadGenericFileToR2,
  uploadThumbnailToR2,
  deleteFileFromR2,
  listFilesFromR2,
  isR2Configured,
} from '@/lib/storage';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import path from 'node:path';

export const runtime = 'nodejs';

export type MediaType = 'image' | 'video' | 'document' | 'archive' | 'other';

export function detectMediaType(keyOrFilename: string, mime?: string): MediaType {
  if (mime) {
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (
      mime.includes('pdf') ||
      mime.includes('word') ||
      mime.includes('officedocument') ||
      mime.includes('text') ||
      mime.includes('sheet') ||
      mime.includes('presentation')
    ) {
      return 'document';
    }
    if (mime.includes('zip') || mime.includes('compressed') || mime.includes('tar') || mime.includes('archive')) {
      return 'archive';
    }
  }

  const ext = path.extname(keyOrFilename).toLowerCase().replace(/^\./, '');
  if (['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg', 'gif', 'bmp', 'ico'].includes(ext)) {
    return 'image';
  }
  if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogv', 'm4v'].includes(ext)) {
    return 'video';
  }
  if (['pdf', 'doc', 'docx', 'txt', 'csv', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf'].includes(ext)) {
    return 'document';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
    return 'archive';
  }
  return 'other';
}

/**
 * GET /api/media
 * Lists media items from Cloudflare R2 merged with MongoDB records.
 * Supports query params: `folder`, `type` (all | image | video | document | archive), `limit`.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';
    const typeFilter = (searchParams.get('type') || 'all').toLowerCase();
    const limit = Math.min(parseInt(searchParams.get('limit') || '150', 10), 300);

    // If requesting resumes folder, require authenticated Admin or HR session
    if (folder.startsWith('resumes')) {
      const user = await getSessionUser();
      if (!user || !isRoleAllowed(user.role, ['admin', 'hr'])) {
        return NextResponse.json(
          { error: 'Unauthorized to view resume documents.' },
          { status: 403 }
        );
      }
    }

    if (!isR2Configured()) {
      return NextResponse.json({
        configured: false,
        message: 'Cloudflare R2 is not configured.',
        items: [],
      });
    }

    const allR2Items = await listFilesFromR2(folder, limit);

    // Safety: Resumes are hidden from unauthenticated callers
    const user = await getSessionUser();
    const canSeeResumes = user && isRoleAllowed(user.role, ['admin', 'hr']);
    const accessibleItems = canSeeResumes
      ? allR2Items
      : allR2Items.filter((i) => !i.key.startsWith('resumes/'));

    // Fetch MongoDB records to enrich items with custom thumbnails, alt text, and metadata
    let dbMap: Record<string, Record<string, any>> = {};
    const db = await getDb();
    if (db) {
      try {
        const records = await db
          .collection(COLLECTIONS.MEDIA)
          .find({
            ...(folder ? { folder } : {}),
          })
          .toArray();

        for (const rec of records) {
          if (rec.key) {
            dbMap[rec.key] = rec;
          }
        }
      } catch (dbErr) {
        console.warn('[API /api/media GET] MongoDB lookup warning:', dbErr);
      }
    }

    // Merge and classify media items
    let items = accessibleItems.map((item) => {
      const meta = dbMap[item.key] || {};
      const detected = detectMediaType(item.key);
      const ext = path.extname(item.key).toLowerCase().replace(/^\./, '');

      return {
        key: item.key,
        url: item.url,
        size: item.size,
        lastModified: item.lastModified,
        mediaType: meta.mediaType || detected,
        format: meta.format || ext || 'file',
        thumbnailUrl: meta.thumbnailUrl || (detected === 'image' ? item.url : null),
        alt: meta.alt || '',
        width: meta.width || undefined,
        height: meta.height || undefined,
      };
    });

    // Apply type filter if requested
    if (typeFilter && typeFilter !== 'all') {
      items = items.filter((item) => item.mediaType === typeFilter);
    }

    return NextResponse.json({
      configured: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error('[API /api/media GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve media items', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/media
 * Uploads media assets (Images, Videos, Documents, Archives).
 * - Images are automatically compressed to WebP using Sharp.
 * - Videos and other assets are uploaded directly without crashing Sharp.
 * - Auto-generates or uploads video poster thumbnails if provided.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'author', 'hr'])) {
      return NextResponse.json(
        { error: 'Unauthorized. You must have editor, author, or admin permissions.' },
        { status: 403 }
      );
    }

    if (!isR2Configured()) {
      return NextResponse.json(
        { error: 'Cloudflare R2 storage is not configured.' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';
    const alt = (formData.get('alt') as string) || '';
    const thumbnailFile = formData.get('thumbnail') as File | null;
    const thumbnailDataUrl = formData.get('thumbnailDataUrl') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file was provided in the request.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const mediaType = detectMediaType(file.name, file.type);

    let uploadResult: {
      url: string;
      key: string;
      filename: string;
      originalSize: number;
      optimizedSize: number;
      savingsPercentage?: number;
      format: string;
      width?: number;
      height?: number;
    };

    if (mediaType === 'image' && !file.name.toLowerCase().endsWith('.svg')) {
      // Process image through Sharp to convert to high-efficiency WebP
      uploadResult = await uploadOptimizedImageToR2(fileBuffer, file.name, folder);
    } else {
      // Direct stream upload for videos, documents, SVG, archives
      uploadResult = await uploadGenericFileToR2(
        fileBuffer,
        file.name,
        file.type || 'application/octet-stream',
        folder
      );
    }

    let thumbnailUrl: string | null = mediaType === 'image' ? uploadResult.url : null;

    // Handle companion thumbnail for videos if passed
    if (mediaType === 'video') {
      if (thumbnailFile) {
        const thumbAb = await thumbnailFile.arrayBuffer();
        const thumbBuf = Buffer.from(thumbAb);
        const thumbRes = await uploadThumbnailToR2(thumbBuf, uploadResult.key);
        thumbnailUrl = thumbRes.url;
      } else if (thumbnailDataUrl && thumbnailDataUrl.includes('base64,')) {
        const base64Data = thumbnailDataUrl.split('base64,')[1];
        const thumbBuf = Buffer.from(base64Data, 'base64');
        const thumbRes = await uploadThumbnailToR2(thumbBuf, uploadResult.key);
        thumbnailUrl = thumbRes.url;
      }
    }

    // Persist into MongoDB media collection
    const db = await getDb();
    if (db) {
      await db.collection(COLLECTIONS.MEDIA).updateOne(
        { key: uploadResult.key },
        {
          $set: {
            ...uploadResult,
            mediaType,
            thumbnailUrl,
            alt,
            folder,
            uploadedBy: user.email,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Asset successfully uploaded to Cloudflare R2.',
        media: {
          ...uploadResult,
          mediaType,
          thumbnailUrl,
          alt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /api/media POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process and upload asset', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/media
 * Updates media item metadata (thumbnailUrl, alt, folder) in MongoDB.
 * Also supports capturing/uploading a new video thumbnail via `thumbnailDataUrl` (base64).
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'author'])) {
      return NextResponse.json(
        { error: 'Unauthorized to edit media assets.' },
        { status: 403 }
      );
    }

    let key = '';
    let alt: string | undefined;
    let folder: string | undefined;
    let thumbnailUrl: string | undefined;
    let thumbnailDataUrl: string | undefined;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      key = body.key;
      alt = body.alt;
      folder = body.folder;
      thumbnailUrl = body.thumbnailUrl;
      thumbnailDataUrl = body.thumbnailDataUrl;
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      key = (formData.get('key') as string) || '';
      alt = (formData.get('alt') as string) || undefined;
      folder = (formData.get('folder') as string) || undefined;
      thumbnailUrl = (formData.get('thumbnailUrl') as string) || undefined;
      thumbnailDataUrl = (formData.get('thumbnailDataUrl') as string) || undefined;

      const thumbFile = formData.get('thumbnailFile') as File | null;
      if (thumbFile) {
        const ab = await thumbFile.arrayBuffer();
        const buf = Buffer.from(ab);
        const thumbRes = await uploadThumbnailToR2(buf, key);
        thumbnailUrl = thumbRes.url;
      }
    }

    if (!key) {
      return NextResponse.json({ error: 'Missing asset key.' }, { status: 400 });
    }

    // If client supplied a captured frame in base64 data URL, upload to R2 thumbnail folder
    if (thumbnailDataUrl && thumbnailDataUrl.includes('base64,')) {
      const base64Data = thumbnailDataUrl.split('base64,')[1];
      const thumbBuf = Buffer.from(base64Data, 'base64');
      const thumbRes = await uploadThumbnailToR2(thumbBuf, key);
      thumbnailUrl = thumbRes.url;
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection unavailable.' },
        { status: 503 }
      );
    }

    const updateFields: Record<string, any> = {
      updatedAt: new Date(),
    };
    if (thumbnailUrl !== undefined) updateFields.thumbnailUrl = thumbnailUrl;
    if (alt !== undefined) updateFields.alt = alt;
    if (folder !== undefined) updateFields.folder = folder;

    await db.collection(COLLECTIONS.MEDIA).updateOne(
      { key },
      { $set: updateFields },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Media item updated successfully.',
      key,
      thumbnailUrl,
    });
  } catch (error) {
    console.error('[API /api/media PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update media item', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/media
 * Deletes a media file from Cloudflare R2 and removes its MongoDB record.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Only Admins and Editors can delete media.' },
        { status: 403 }
      );
    }

    if (!isR2Configured()) {
      return NextResponse.json(
        { error: 'Cloudflare R2 is not configured.' },
        { status: 503 }
      );
    }

    let key = '';
    const { searchParams } = new URL(request.url);
    const keyParam = searchParams.get('key');

    if (keyParam) {
      key = keyParam;
    } else {
      const body = await request.json().catch(() => ({}));
      key = body.key || '';
    }

    if (!key) {
      return NextResponse.json(
        { error: 'Missing file key to delete.' },
        { status: 400 }
      );
    }

    // Delete from Cloudflare R2
    const result = await deleteFileFromR2(key);

    // Delete record from MongoDB if available
    const db = await getDb();
    if (db) {
      await db.collection(COLLECTIONS.MEDIA).deleteOne({ key: result.key });
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully from Cloudflare R2.',
      key: result.key,
    });
  } catch (error) {
    console.error('[API /api/media DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file from storage' },
      { status: 500 }
    );
  }
}
