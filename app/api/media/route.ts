import { NextRequest, NextResponse } from 'next/server';
import {
  uploadOptimizedImageToR2,
  uploadGenericFileToR2,
  uploadThumbnailToR2,
  deleteFileFromR2,
  listFilesFromR2,
  renameFileInR2,
  checkFileExistsInR2,
  toSeoFilename,
  isR2Configured,
} from '@/lib/storage';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import path from 'node:path';

export const runtime = 'nodejs';

export type MediaType = 'image' | 'video' | 'document' | 'audio' | 'archive' | 'other';

export function detectMediaType(keyOrFilename: string, mime?: string): MediaType {
  if (mime) {
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('audio/')) return 'audio';
    if (
      mime.includes('pdf') ||
      mime.includes('word') ||
      mime.includes('officedocument') ||
      mime.includes('text') ||
      mime.includes('sheet') ||
      mime.includes('presentation') ||
      mime.includes('document')
    ) {
      return 'document';
    }
    if (mime.includes('zip') || mime.includes('compressed') || mime.includes('tar') || mime.includes('archive')) {
      return 'archive';
    }
  }

  const ext = path.extname(keyOrFilename).toLowerCase().replace(/^\./, '');
  if (['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg', 'gif', 'bmp', 'ico', 'tif', 'tiff'].includes(ext)) {
    return 'image';
  }
  if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogv', 'm4v', '3gp'].includes(ext)) {
    return 'video';
  }
  if (['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac', 'wma', 'aiff'].includes(ext)) {
    return 'audio';
  }
  if (['pdf', 'doc', 'docx', 'txt', 'csv', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'odt', 'ods', 'odp'].includes(ext)) {
    return 'document';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)) {
    return 'archive';
  }
  return 'other';
}

/**
 * GET /api/media
 * Lists media items from Cloudflare R2 merged with MongoDB records.
 * Supports query params: `folder`, `type` (all | image | video | document | audio | archive), `sort`, `search`, `limit`.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';
    const typeFilter = (searchParams.get('type') || 'all').toLowerCase();
    const sort = searchParams.get('sort') || 'newest';
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '500', 10), 1000);

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

    // Fetch MongoDB records to enrich items with custom thumbnails, alt text, title, caption, folder, etc.
    interface MediaDbRecord {
      key?: string;
      filename?: string;
      mediaType?: MediaType;
      format?: string;
      thumbnailUrl?: string | null;
      alt?: string;
      title?: string;
      caption?: string;
      folder?: string;
      uploadedBy?: string;
      width?: number;
      height?: number;
    }

    const dbMap: Record<string, MediaDbRecord> = {};
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
            dbMap[rec.key] = rec as unknown as MediaDbRecord;
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
      const filename = path.basename(item.key);
      const itemFolder = item.key.includes('/') ? item.key.substring(0, item.key.lastIndexOf('/')) : '';

      return {
        key: item.key,
        url: item.url,
        filename: (meta.filename || filename) as string,
        size: item.size,
        lastModified: item.lastModified,
        mediaType: meta.mediaType || detected,
        format: meta.format || ext || 'file',
        thumbnailUrl: meta.thumbnailUrl || (detected === 'image' ? item.url : null),
        alt: (meta.alt || '') as string,
        title: (meta.title || '') as string,
        caption: (meta.caption || '') as string,
        folder: (meta.folder || itemFolder) as string,
        uploadedBy: (meta.uploadedBy || '') as string,
        width: meta.width || undefined,
        height: meta.height || undefined,
      };
    });

    // Apply type filter if requested
    if (typeFilter && typeFilter !== 'all') {
      items = items.filter((item) => item.mediaType === typeFilter);
    }

    // Apply search filter if requested
    if (search) {
      items = items.filter((item) =>
        item.key.toLowerCase().includes(search) ||
        item.filename.toLowerCase().includes(search) ||
        item.alt.toLowerCase().includes(search) ||
        item.title.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    items.sort((a, b) => {
      if (sort === 'newest') {
        const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
        const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
        return dateB - dateA;
      }
      if (sort === 'oldest') {
        const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
        const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
        return dateA - dateB;
      }
      if (sort === 'size-desc') {
        return (b.size || 0) - (a.size || 0);
      }
      if (sort === 'size-asc') {
        return (a.size || 0) - (b.size || 0);
      }
      if (sort === 'name-asc') {
        return a.filename.localeCompare(b.filename);
      }
      if (sort === 'name-desc') {
        return b.filename.localeCompare(a.filename);
      }
      return 0;
    });

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
    const title = (formData.get('title') as string) || '';
    const caption = (formData.get('caption') as string) || '';
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
      // Direct stream upload for videos, documents, audio, SVG, archives
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
            title,
            caption,
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
          title,
          caption,
          folder,
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
 * Supports:
 * 1. Renaming file & slug in Cloudflare R2 + MongoDB:
 *    { action: 'rename', key: string, newSlug?: string, newName?: string, targetFolder?: string }
 * 2. Updating media item metadata (title, caption, alt, folder, thumbnailUrl):
 *    { key: string, title?: string, caption?: string, alt?: string, folder?: string }
 * 3. Capturing/uploading a new video thumbnail via `thumbnailDataUrl` (base64) or `thumbnailFile`.
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
    let title: string | undefined;
    let caption: string | undefined;
    let folder: string | undefined;
    let thumbnailUrl: string | undefined;
    let thumbnailDataUrl: string | undefined;
    let action: string | undefined;
    let newSlug: string | undefined;
    let newName: string | undefined;
    let targetFolder: string | undefined;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      key = body.key || body.oldKey || '';
      alt = body.alt;
      title = body.title;
      caption = body.caption;
      folder = body.folder;
      thumbnailUrl = body.thumbnailUrl;
      thumbnailDataUrl = body.thumbnailDataUrl;
      action = body.action;
      newSlug = body.newSlug;
      newName = body.newName;
      targetFolder = body.targetFolder;
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      key = (formData.get('key') as string) || (formData.get('oldKey') as string) || '';
      alt = (formData.get('alt') as string) || undefined;
      title = (formData.get('title') as string) || undefined;
      caption = (formData.get('caption') as string) || undefined;
      folder = (formData.get('folder') as string) || undefined;
      thumbnailUrl = (formData.get('thumbnailUrl') as string) || undefined;
      thumbnailDataUrl = (formData.get('thumbnailDataUrl') as string) || undefined;
      action = (formData.get('action') as string) || undefined;
      newSlug = (formData.get('newSlug') as string) || undefined;
      newName = (formData.get('newName') as string) || undefined;
      targetFolder = (formData.get('targetFolder') as string) || undefined;

      const thumbFile = formData.get('thumbnailFile') as File | null;
      if (thumbFile && key) {
        const ab = await thumbFile.arrayBuffer();
        const buf = Buffer.from(ab);
        const thumbRes = await uploadThumbnailToR2(buf, key);
        thumbnailUrl = thumbRes.url;
      }
    }

    if (!key) {
      return NextResponse.json({ error: 'Missing asset key.' }, { status: 400 });
    }

    const cleanOldKey = key.replace(/^\/+/, '');

    // -------------------------------------------------------------
    // ACTION 1: RENAME FILE / SLUG IN CLOUDFLARE R2 AND DATABASE
    // -------------------------------------------------------------
    if (action === 'rename' || newSlug || newName) {
      const candidateName = (newSlug || newName || '').trim();
      if (!candidateName) {
        return NextResponse.json({ error: 'New name or slug is required for renaming.' }, { status: 400 });
      }

      const oldFolder = cleanOldKey.includes('/')
        ? cleanOldKey.substring(0, cleanOldKey.lastIndexOf('/'))
        : '';
      const oldExt = path.extname(cleanOldKey); // includes dot e.g. .webp
      const activeFolder = targetFolder !== undefined ? targetFolder.replace(/^\/+|\/+$/g, '') : (folder !== undefined ? folder : oldFolder);

      // Parse candidate name
      const inputExt = path.extname(candidateName);
      const effectiveExt = (inputExt ? inputExt : oldExt).toLowerCase();
      const rawBase = inputExt ? path.basename(candidateName, inputExt) : candidateName;
      const cleanSlug = toSeoFilename(rawBase);

      let targetKey = activeFolder ? `${activeFolder}/${cleanSlug}${effectiveExt}` : `${cleanSlug}${effectiveExt}`;

      if (targetKey === cleanOldKey) {
        return NextResponse.json({
          success: true,
          message: 'Filename is already identical.',
          oldKey: cleanOldKey,
          newKey: cleanOldKey,
          newUrl: `${(process.env.CLOUDFLARE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/${cleanOldKey}`,
          newFilename: path.basename(cleanOldKey),
        });
      }

      // Check collision in R2
      const exists = await checkFileExistsInR2(targetKey);
      if (exists) {
        targetKey = activeFolder
          ? `${activeFolder}/${cleanSlug}-${Date.now()}${effectiveExt}`
          : `${cleanSlug}-${Date.now()}${effectiveExt}`;
      }

      // Execute rename in Cloudflare R2
      const renameRes = await renameFileInR2(cleanOldKey, targetKey);

      // Synchronize in MongoDB
      const db = await getDb();
      if (db) {
        await db.collection(COLLECTIONS.MEDIA).updateOne(
          { key: cleanOldKey },
          {
            $set: {
              key: renameRes.newKey,
              url: renameRes.newUrl,
              filename: renameRes.newFilename,
              folder: activeFolder,
              ...(alt !== undefined ? { alt } : {}),
              ...(title !== undefined ? { title } : {}),
              ...(caption !== undefined ? { caption } : {}),
              updatedAt: new Date(),
              updatedBy: user.email,
            },
          },
          { upsert: true }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Asset successfully renamed in Cloudflare R2 and database.',
        oldKey: renameRes.oldKey,
        newKey: renameRes.newKey,
        newUrl: renameRes.newUrl,
        filename: renameRes.newFilename,
        media: {
          key: renameRes.newKey,
          url: renameRes.newUrl,
          filename: renameRes.newFilename,
          folder: activeFolder,
          alt,
          title,
          caption,
        },
      });
    }

    // -------------------------------------------------------------
    // ACTION 2: METADATA & THUMBNAIL UPDATES
    // -------------------------------------------------------------
    // If client supplied a captured frame in base64 data URL, upload to R2 thumbnail folder
    if (thumbnailDataUrl && thumbnailDataUrl.includes('base64,')) {
      const base64Data = thumbnailDataUrl.split('base64,')[1];
      const thumbBuf = Buffer.from(base64Data, 'base64');
      const thumbRes = await uploadThumbnailToR2(thumbBuf, cleanOldKey);
      thumbnailUrl = thumbRes.url;
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection unavailable.' },
        { status: 503 }
      );
    }

    const updateFields: Record<string, unknown> = {
      updatedAt: new Date(),
      updatedBy: user.email,
    };
    if (thumbnailUrl !== undefined) updateFields.thumbnailUrl = thumbnailUrl;
    if (alt !== undefined) updateFields.alt = alt;
    if (title !== undefined) updateFields.title = title;
    if (caption !== undefined) updateFields.caption = caption;
    if (folder !== undefined) updateFields.folder = folder;

    await db.collection(COLLECTIONS.MEDIA).updateOne(
      { key: cleanOldKey },
      { $set: updateFields },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Media metadata updated successfully.',
      key: cleanOldKey,
      thumbnailUrl,
      alt,
      title,
      caption,
      folder,
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
