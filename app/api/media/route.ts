import { NextRequest, NextResponse } from 'next/server';
import {
  uploadOptimizedImageToR2,
  uploadGenericFileToR2,
  uploadThumbnailToR2,
  deleteFileFromR2,
  listFilesFromR2,
  renameFileInR2,
  copyFileInR2,
  checkFileExistsInR2,
  toSeoFilename,
  isR2Configured,
  getR2PublicUrl,
  type ImageQualityMode,
} from '@/lib/storage';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import {
  syncMediaUrlAcrossDatabase,
  findMediaUrlUsages,
} from '@/lib/media-url-sync';
import { buildMergedFoldersList } from '@/lib/media-folders';
import {
  normalizeFolderPath,
  type MediaItem,
  type MediaType,
  type MediaUrlSyncReport,
} from '@/app/[lang]/(dashboard)/_shared/components/media/types';
import path from 'node:path';

export const runtime = 'nodejs';

interface MediaDbRecord {
  _id?: unknown;
  key?: string;
  url?: string;
  filename?: string;
  size?: number;
  lastModified?: Date | string;
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

function detectMediaType(keyOrFilename: string, mime?: string): MediaType {
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

function extractFolderFromKey(key: string): string {
  return key.includes('/') ? key.substring(0, key.lastIndexOf('/')) : '';
}

function buildHydratedMediaItem(
  key: string,
  url: string,
  size: number,
  lastModified: Date | string | undefined,
  meta: MediaDbRecord = {}
): MediaItem {
  const detected = detectMediaType(key);
  const ext = path.extname(key).toLowerCase().replace(/^\./, '');
  const filename = path.basename(key);
  const physicalFolder = extractFolderFromKey(key);
  const effectiveFolder =
    typeof meta.folder === 'string' && meta.folder !== '' ? meta.folder : physicalFolder;

  return {
    key,
    url,
    filename: (meta.filename || filename) as string,
    size,
    lastModified,
    mediaType: meta.mediaType || detected,
    format: meta.format || ext || 'file',
    thumbnailUrl: meta.thumbnailUrl || (detected === 'image' ? url : null),
    alt: (meta.alt || '') as string,
    title: (meta.title || '') as string,
    caption: (meta.caption || '') as string,
    folder: effectiveFolder,
    physicalFolder,
    isVirtualFolder: Boolean(meta.folder && meta.folder !== physicalFolder),
    uploadedBy: (meta.uploadedBy || '') as string,
    width: meta.width || undefined,
    height: meta.height || undefined,
  };
}

function mergeSyncReports(reports: MediaUrlSyncReport[]): {
  updatedDocumentsCount: number;
  totalReplacements: number;
  updatedCollections: Array<{ collection: string; count: number }>;
} {
  const colCounts = new Map<string, number>();
  let updatedDocumentsCount = 0;
  let totalReplacements = 0;

  for (const r of reports) {
    updatedDocumentsCount += r.updatedDocumentsCount;
    totalReplacements += r.totalReplacements;
    for (const c of r.updatedCollections) {
      colCounts.set(c.collection, (colCounts.get(c.collection) || 0) + c.count);
    }
  }

  return {
    updatedDocumentsCount,
    totalReplacements,
    updatedCollections: Array.from(colCounts.entries()).map(([collection, count]) => ({
      collection,
      count,
    })),
  };
}

/**
 * GET /api/media
 * Lists media items from Cloudflare R2 merged with MongoDB records.
 * Supports query params: `folder`, `includeSubfolders`, `type`, `sort`, `search`, `limit`, `usagesFor`.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const usagesFor = searchParams.get('usagesFor');

    // Usage check inspection branch
    if (usagesFor) {
      const user = await getSessionUser();
      if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'author', 'hr'])) {
        return NextResponse.json(
          { error: 'Unauthorized to inspect asset usages.' },
          { status: 403 }
        );
      }
      const usageSummary = await findMediaUrlUsages(usagesFor);
      return NextResponse.json({
        success: true,
        ...usageSummary,
      });
    }

    const folder = normalizeFolderPath(searchParams.get('folder') || '');
    const includeSubfolders = searchParams.get('includeSubfolders') === 'true';
    const typeFilter = (searchParams.get('type') || 'all').toLowerCase();
    const sort = searchParams.get('sort') || 'newest';
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '500', 10), 1000);

    // If requesting resumes folder, require authenticated Admin or HR session
    if (folder === 'resumes' || folder.startsWith('resumes/')) {
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
        folders: [],
      });
    }

    // Fetch full R2 listing (up to max 1000) so virtual-moved items appear accurately inside target folders
    const allR2Items = await listFilesFromR2('', Math.max(limit, 1000));

    // Safety: Resumes are hidden from unauthenticated callers
    const user = await getSessionUser();
    const canSeeResumes = Boolean(user && isRoleAllowed(user.role, ['admin', 'hr']));

    // Fetch MongoDB records to enrich items with custom thumbnails, alt text, title, caption, virtual folder, etc.
    const dbMap: Record<string, MediaDbRecord> = {};
    const db = await getDb();
    if (db) {
      try {
        const records = await db.collection(COLLECTIONS.MEDIA).find({}).toArray();
        for (const rec of records) {
          if (rec.key) {
            dbMap[String(rec.key)] = rec as unknown as MediaDbRecord;
          }
        }
      } catch (dbErr) {
        console.warn('[API /api/media GET] MongoDB lookup warning:', dbErr);
      }
    }

    // Merge R2 items + DB metadata
    const allMergedItems: MediaItem[] = allR2Items
      .map((item) =>
        buildHydratedMediaItem(
          item.key,
          item.url,
          item.size,
          item.lastModified,
          dbMap[item.key] || {}
        )
      )
      .filter((item) => {
        if (canSeeResumes) return true;
        const f = item.folder || '';
        return (
          !item.key.startsWith('resumes/') &&
          f !== 'resumes' &&
          !f.startsWith('resumes/')
        );
      });

    // Build complete merged hierarchical folder tree with accurate counts
    const allFolders = await buildMergedFoldersList(allMergedItems);
    const visibleFolders = canSeeResumes
      ? allFolders
      : allFolders.filter((f) => f.id !== 'resumes' && !f.id.startsWith('resumes/'));

    // Apply folder filter (honoring nested subfolders when includeSubfolders is true)
    let items = folder
      ? allMergedItems.filter((item) => {
          const itemFld = item.folder || '';
          if (includeSubfolders) {
            return itemFld === folder || itemFld.startsWith(`${folder}/`);
          }
          return itemFld === folder;
        })
      : allMergedItems;

    // Apply type filter if requested
    if (typeFilter && typeFilter !== 'all') {
      items = items.filter((item) => item.mediaType === typeFilter);
    }

    // Apply search filter if requested
    if (search) {
      items = items.filter(
        (item) =>
          item.key.toLowerCase().includes(search) ||
          item.filename.toLowerCase().includes(search) ||
          (item.alt || '').toLowerCase().includes(search) ||
          (item.title || '').toLowerCase().includes(search) ||
          (item.folder || '').toLowerCase().includes(search)
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

    if (items.length > limit) {
      items = items.slice(0, limit);
    }

    return NextResponse.json({
      configured: true,
      count: items.length,
      items,
      folders: visibleFolders,
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
 * Uploads media assets (Images, Videos, Documents, Archives) to any root or nested folder.
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
    const rawFolder = (formData.get('folder') as string) || 'general';
    const normalizedFolder = normalizeFolderPath(rawFolder) || 'general';
    const folder =
      normalizedFolder === 'thumbnails' || normalizedFolder.startsWith('thumbnails/')
        ? 'general'
        : normalizedFolder;

    const alt = (formData.get('alt') as string) || '';
    const title = (formData.get('title') as string) || '';
    const caption = (formData.get('caption') as string) || '';
    const rawQualityMode = (formData.get('qualityMode') as string) || 'high-webp';
    const qualityMode: ImageQualityMode =
      rawQualityMode === 'reduced-webp' ? 'reduced-webp' : 'high-webp';
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
      uploadResult = await uploadOptimizedImageToR2(fileBuffer, file.name, folder, {
        qualityMode,
      });
    } else {
      uploadResult = await uploadGenericFileToR2(
        fileBuffer,
        file.name,
        file.type || 'application/octet-stream',
        folder
      );
    }

    let thumbnailUrl: string | null = mediaType === 'image' ? uploadResult.url : null;

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
          physicalFolder: folder,
          isVirtualFolder: false,
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
 * 1. `action: 'move'` — Move single or bulk assets to a target root folder or nested subfolder.
 *    - Option B (default, `keepOriginalUrl: false`): Physical R2 move + automatic sitewide MongoDB URL sync.
 *    - Option A (`keepOriginalUrl: true`): Virtual folder reassignment in MongoDB without changing R2 URL.
 * 2. `action: 'copy'` — Copy single or bulk assets into a target folder via Cloudflare R2 CopyObjectCommand.
 * 3. `action: 'rename'` — Rename file slug (and optional target folder) in R2 + auto-sync DB URLs.
 * 4. Metadata & video poster thumbnail updates.
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
    let keys: string[] = [];
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
    let keepOriginalUrl = false;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      key = body.key || body.oldKey || '';
      if (Array.isArray(body.keys)) {
        keys = body.keys.filter((k: unknown): k is string => typeof k === 'string' && k.trim().length > 0);
      }
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
      keepOriginalUrl = Boolean(body.keepOriginalUrl);
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
      keepOriginalUrl = formData.get('keepOriginalUrl') === 'true';

      const thumbFile = formData.get('thumbnailFile') as File | null;
      if (thumbFile && key) {
        const ab = await thumbFile.arrayBuffer();
        const buf = Buffer.from(ab);
        const thumbRes = await uploadThumbnailToR2(buf, key);
        thumbnailUrl = thumbRes.url;
      }
    }

    const db = await getDb();
    const publicBase = getR2PublicUrl();

    // -------------------------------------------------------------
    // ACTION A: MOVE SINGLE OR MULTIPLE ASSETS TO FOLDER / SUBFOLDER
    // -------------------------------------------------------------
    if (action === 'move') {
      const targetKeys = (keys.length > 0 ? keys : key ? [key] : []).map((k) =>
        k.replace(/^\/+/, '')
      );
      if (targetKeys.length === 0) {
        return NextResponse.json({ error: 'Missing asset key(s) to move.' }, { status: 400 });
      }

      const destFolder = normalizeFolderPath(targetFolder ?? folder ?? '');
      if (!destFolder) {
        return NextResponse.json(
          { error: 'Please choose a destination folder (cannot move to "All Folders").' },
          { status: 400 }
        );
      }
      if (destFolder === 'thumbnails' || destFolder.startsWith('thumbnails/')) {
        return NextResponse.json(
          { error: 'Cannot move assets into the internal thumbnails folder.' },
          { status: 400 }
        );
      }

      const movedItems: Array<{ oldKey: string; item: MediaItem }> = [];
      const syncReports: MediaUrlSyncReport[] = [];

      for (const cleanOldKey of targetKeys) {
        const existingDoc = db
          ? ((await db
              .collection(COLLECTIONS.MEDIA)
              .findOne({ key: cleanOldKey })) as MediaDbRecord | null)
          : null;

        const baseFilename = path.basename(cleanOldKey);
        const currentPhysicalFolder = extractFolderFromKey(cleanOldKey);
        const currentUrl = existingDoc?.url || `${publicBase}/${cleanOldKey}`;
        const detectedType = existingDoc?.mediaType || detectMediaType(cleanOldKey);

        if (keepOriginalUrl) {
          // Option A: Keep exact CDN URL unchanged, organize virtually in MongoDB
          if (!db) {
            return NextResponse.json(
              { error: 'Database connection unavailable for virtual folder assignment.' },
              { status: 503 }
            );
          }

          await db.collection(COLLECTIONS.MEDIA).updateOne(
            { key: cleanOldKey },
            {
              $set: {
                key: cleanOldKey,
                url: currentUrl,
                filename: existingDoc?.filename || baseFilename,
                folder: destFolder,
                mediaType: detectedType,
                updatedAt: new Date(),
                updatedBy: user.email,
              },
              $setOnInsert: {
                createdAt: new Date(),
              },
            },
            { upsert: true }
          );

          movedItems.push({
            oldKey: cleanOldKey,
            item: buildHydratedMediaItem(
              cleanOldKey,
              currentUrl,
              existingDoc?.size || 0,
              existingDoc?.lastModified,
              {
                ...(existingDoc || {}),
                folder: destFolder,
              }
            ),
          });
        } else {
          // Option B (Default): Physical Cloudflare R2 move + Automatic Sitewide URL Sync
          if (!isR2Configured()) {
            return NextResponse.json(
              { error: 'Cloudflare R2 is not configured.' },
              { status: 503 }
            );
          }

          let nextKey = `${destFolder}/${baseFilename}`;

          if (nextKey !== cleanOldKey) {
            const exists = await checkFileExistsInR2(nextKey);
            if (exists) {
              const ext = path.extname(baseFilename);
              const baseNameNoExt = path.basename(baseFilename, ext);
              nextKey = `${destFolder}/${baseNameNoExt}-${Date.now()}${ext}`;
            }

            const renameRes = await renameFileInR2(cleanOldKey, nextKey);
            const nextThumbUrl =
              detectedType === 'image' ? renameRes.newUrl : existingDoc?.thumbnailUrl || null;

            if (db) {
              await db.collection(COLLECTIONS.MEDIA).updateOne(
                { key: cleanOldKey },
                {
                  $set: {
                    key: renameRes.newKey,
                    url: renameRes.newUrl,
                    filename: renameRes.newFilename,
                    folder: destFolder,
                    mediaType: detectedType,
                    ...(nextThumbUrl ? { thumbnailUrl: nextThumbUrl } : {}),
                    updatedAt: new Date(),
                    updatedBy: user.email,
                  },
                  $setOnInsert: {
                    createdAt: new Date(),
                  },
                },
                { upsert: true }
              );
            }

            const report = await syncMediaUrlAcrossDatabase(currentUrl, renameRes.newUrl);
            syncReports.push(report);

            movedItems.push({
              oldKey: cleanOldKey,
              item: buildHydratedMediaItem(
                renameRes.newKey,
                renameRes.newUrl,
                existingDoc?.size || 0,
                existingDoc?.lastModified,
                {
                  ...(existingDoc || {}),
                  key: renameRes.newKey,
                  url: renameRes.newUrl,
                  filename: renameRes.newFilename,
                  thumbnailUrl: nextThumbUrl,
                  folder: destFolder,
                }
              ),
            });
          } else {
            // Already at that physical R2 path (e.g., syncing virtual folder back to R2 path)
            if (db && existingDoc?.folder !== destFolder && currentPhysicalFolder === destFolder) {
              await db.collection(COLLECTIONS.MEDIA).updateOne(
                { key: cleanOldKey },
                {
                  $set: {
                    folder: destFolder,
                    updatedAt: new Date(),
                    updatedBy: user.email,
                  },
                }
              );
            }

            movedItems.push({
              oldKey: cleanOldKey,
              item: buildHydratedMediaItem(
                cleanOldKey,
                currentUrl,
                existingDoc?.size || 0,
                existingDoc?.lastModified,
                {
                  ...(existingDoc || {}),
                  folder: destFolder,
                }
              ),
            });
          }
        }
      }

      const syncSummary = mergeSyncReports(syncReports);
      const folders = await buildMergedFoldersList();

      return NextResponse.json({
        success: true,
        mode: keepOriginalUrl ? 'virtual' : 'physical-sync',
        message: keepOriginalUrl
          ? `Organized ${movedItems.length} asset(s) into "${destFolder}" while keeping exact CDN URLs.`
          : `Moved ${movedItems.length} asset(s) in Cloudflare R2 to "${destFolder}" and synced ${syncSummary.totalReplacements} website link(s).`,
        moved: movedItems,
        totalMoved: movedItems.length,
        syncSummary,
        folders,
      });
    }

    // -------------------------------------------------------------
    // ACTION B: COPY SINGLE OR MULTIPLE ASSETS TO ANOTHER FOLDER IN R2
    // -------------------------------------------------------------
    if (action === 'copy') {
      const sourceKeys = (keys.length > 0 ? keys : key ? [key] : []).map((k) =>
        k.replace(/^\/+/, '')
      );
      if (sourceKeys.length === 0) {
        return NextResponse.json({ error: 'Missing asset key(s) to copy.' }, { status: 400 });
      }
      if (!isR2Configured()) {
        return NextResponse.json(
          { error: 'Cloudflare R2 is not configured.' },
          { status: 503 }
        );
      }

      const destFolder = normalizeFolderPath(targetFolder ?? folder ?? '');
      if (!destFolder) {
        return NextResponse.json(
          { error: 'Please choose a destination folder to copy into.' },
          { status: 400 }
        );
      }
      if (destFolder === 'thumbnails' || destFolder.startsWith('thumbnails/')) {
        return NextResponse.json(
          { error: 'Cannot copy assets into the internal thumbnails folder.' },
          { status: 400 }
        );
      }

      const copiedItems: MediaItem[] = [];

      for (const cleanSourceKey of sourceKeys) {
        const existingDoc = db
          ? ((await db
              .collection(COLLECTIONS.MEDIA)
              .findOne({ key: cleanSourceKey })) as MediaDbRecord | null)
          : null;

        const baseFilename = path.basename(cleanSourceKey);
        const candidateTargetKey = `${destFolder}/${baseFilename}`;
        const copyRes = await copyFileInR2(cleanSourceKey, candidateTargetKey);

        const detectedType = existingDoc?.mediaType || detectMediaType(copyRes.targetKey);
        const copiedThumbUrl =
          detectedType === 'image' ? copyRes.targetUrl : existingDoc?.thumbnailUrl || null;

        const cloneFields: Record<string, unknown> = {
          key: copyRes.targetKey,
          url: copyRes.targetUrl,
          filename: copyRes.targetFilename,
          folder: destFolder,
          mediaType: detectedType,
          format:
            existingDoc?.format ||
            path.extname(copyRes.targetKey).toLowerCase().replace(/^\./, '') ||
            'file',
          thumbnailUrl: copiedThumbUrl,
          alt: existingDoc?.alt || '',
          title: existingDoc?.title ? `${existingDoc.title} (Copy)` : '',
          caption: existingDoc?.caption || '',
          ...(existingDoc?.size !== undefined ? { size: existingDoc.size } : {}),
          ...(existingDoc?.width !== undefined ? { width: existingDoc.width } : {}),
          ...(existingDoc?.height !== undefined ? { height: existingDoc.height } : {}),
          uploadedBy: user.email,
          updatedAt: new Date(),
          createdAt: new Date(),
        };

        if (db) {
          await db.collection(COLLECTIONS.MEDIA).updateOne(
            { key: copyRes.targetKey },
            { $set: cloneFields },
            { upsert: true }
          );
        }

        copiedItems.push(
          buildHydratedMediaItem(
            copyRes.targetKey,
            copyRes.targetUrl,
            existingDoc?.size || 0,
            new Date(),
            cloneFields as unknown as MediaDbRecord
          )
        );
      }

      const folders = await buildMergedFoldersList();

      return NextResponse.json({
        success: true,
        message: `Copied ${copiedItems.length} asset(s) into "${destFolder}". Original files remain unchanged.`,
        copied: copiedItems,
        totalCopied: copiedItems.length,
        folders,
      });
    }

    if (!key) {
      return NextResponse.json({ error: 'Missing asset key.' }, { status: 400 });
    }

    const cleanOldKey = key.replace(/^\/+/, '');

    // -------------------------------------------------------------
    // ACTION 1: RENAME FILE / SLUG IN CLOUDFLARE R2 + AUTO-SYNC DB URLS
    // -------------------------------------------------------------
    if (action === 'rename' || newSlug || newName) {
      const candidateName = (newSlug || newName || '').trim();
      if (!candidateName) {
        return NextResponse.json(
          { error: 'New name or slug is required for renaming.' },
          { status: 400 }
        );
      }

      const oldFolder = extractFolderFromKey(cleanOldKey);
      const oldExt = path.extname(cleanOldKey); // includes dot e.g. .webp
      const rawTargetFolder =
        targetFolder !== undefined ? targetFolder : folder !== undefined ? folder : oldFolder;
      const activeFolder = normalizeFolderPath(rawTargetFolder);

      const inputExt = path.extname(candidateName);
      const effectiveExt = (inputExt ? inputExt : oldExt).toLowerCase();
      const rawBase = inputExt ? path.basename(candidateName, inputExt) : candidateName;
      const cleanSlug = toSeoFilename(rawBase);

      let targetKey = activeFolder
        ? `${activeFolder}/${cleanSlug}${effectiveExt}`
        : `${cleanSlug}${effectiveExt}`;

      const existingDoc = db
        ? ((await db
            .collection(COLLECTIONS.MEDIA)
            .findOne({ key: cleanOldKey })) as MediaDbRecord | null)
        : null;
      const oldUrl = existingDoc?.url || `${publicBase}/${cleanOldKey}`;
      const detectedType = existingDoc?.mediaType || detectMediaType(cleanOldKey);

      if (targetKey === cleanOldKey) {
        if (db) {
          await db.collection(COLLECTIONS.MEDIA).updateOne(
            { key: cleanOldKey },
            {
              $set: {
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

        const currentUrl = `${publicBase}/${cleanOldKey}`;
        return NextResponse.json({
          success: true,
          message: 'Metadata saved (filename is already identical).',
          oldKey: cleanOldKey,
          newKey: cleanOldKey,
          newUrl: currentUrl,
          newFilename: path.basename(cleanOldKey),
          syncReport: {
            oldUrl: currentUrl,
            newUrl: currentUrl,
            updatedCollections: [],
            updatedDocumentsCount: 0,
            totalReplacements: 0,
          },
          media: buildHydratedMediaItem(
            cleanOldKey,
            currentUrl,
            existingDoc?.size || 0,
            existingDoc?.lastModified,
            {
              ...(existingDoc || {}),
              folder: activeFolder,
              alt: alt ?? existingDoc?.alt,
              title: title ?? existingDoc?.title,
              caption: caption ?? existingDoc?.caption,
            }
          ),
        });
      }

      const exists = await checkFileExistsInR2(targetKey);
      if (exists) {
        targetKey = activeFolder
          ? `${activeFolder}/${cleanSlug}-${Date.now()}${effectiveExt}`
          : `${cleanSlug}-${Date.now()}${effectiveExt}`;
      }

      const renameRes = await renameFileInR2(cleanOldKey, targetKey);
      const updatedThumbUrl =
        detectedType === 'image' ? renameRes.newUrl : existingDoc?.thumbnailUrl || null;

      if (db) {
        await db.collection(COLLECTIONS.MEDIA).updateOne(
          { key: cleanOldKey },
          {
            $set: {
              key: renameRes.newKey,
              url: renameRes.newUrl,
              filename: renameRes.newFilename,
              folder: activeFolder,
              mediaType: detectedType,
              ...(updatedThumbUrl ? { thumbnailUrl: updatedThumbUrl } : {}),
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

      const syncReport = await syncMediaUrlAcrossDatabase(oldUrl, renameRes.newUrl);
      const folders = await buildMergedFoldersList();

      return NextResponse.json({
        success: true,
        message: 'Asset successfully renamed in Cloudflare R2 and synchronized across the website.',
        oldKey: renameRes.oldKey,
        newKey: renameRes.newKey,
        newUrl: renameRes.newUrl,
        filename: renameRes.newFilename,
        syncReport,
        folders,
        media: buildHydratedMediaItem(
          renameRes.newKey,
          renameRes.newUrl,
          existingDoc?.size || 0,
          existingDoc?.lastModified,
          {
            ...(existingDoc || {}),
            key: renameRes.newKey,
            url: renameRes.newUrl,
            filename: renameRes.newFilename,
            thumbnailUrl: updatedThumbUrl,
            folder: activeFolder,
            alt: alt ?? existingDoc?.alt,
            title: title ?? existingDoc?.title,
            caption: caption ?? existingDoc?.caption,
          }
        ),
      });
    }

    // -------------------------------------------------------------
    // ACTION 2: METADATA & THUMBNAIL UPDATES
    // -------------------------------------------------------------
    if (thumbnailDataUrl && thumbnailDataUrl.includes('base64,')) {
      const base64Data = thumbnailDataUrl.split('base64,')[1];
      const thumbBuf = Buffer.from(base64Data, 'base64');
      const thumbRes = await uploadThumbnailToR2(thumbBuf, cleanOldKey);
      thumbnailUrl = thumbRes.url;
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Database connection unavailable.' },
        { status: 503 }
      );
    }

    const normalizedMetaFolder =
      folder !== undefined ? normalizeFolderPath(folder) : undefined;

    const updateFields: Record<string, unknown> = {
      updatedAt: new Date(),
      updatedBy: user.email,
    };
    if (thumbnailUrl !== undefined) updateFields.thumbnailUrl = thumbnailUrl;
    if (alt !== undefined) updateFields.alt = alt;
    if (title !== undefined) updateFields.title = title;
    if (caption !== undefined) updateFields.caption = caption;
    if (normalizedMetaFolder !== undefined) updateFields.folder = normalizedMetaFolder;

    await db.collection(COLLECTIONS.MEDIA).updateOne(
      { key: cleanOldKey },
      { $set: updateFields },
      { upsert: true }
    );

    const folders = await buildMergedFoldersList();

    return NextResponse.json({
      success: true,
      message: 'Media metadata updated successfully.',
      key: cleanOldKey,
      thumbnailUrl,
      alt,
      title,
      caption,
      folder: normalizedMetaFolder,
      folders,
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

    const result = await deleteFileFromR2(key);

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
