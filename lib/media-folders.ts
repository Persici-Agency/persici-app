import 'server-only';
import path from 'node:path';
import { COLLECTIONS, getDb } from '@/lib/mongodb';
import {
  checkFileExistsInR2,
  getR2PublicUrl,
  isR2Configured,
  listFilesFromR2,
  renameFileInR2,
} from '@/lib/storage';
import { syncMediaUrlAcrossDatabase } from '@/lib/media-url-sync';
import {
  DEFAULT_FOLDERS,
  FolderOption,
  MAX_FOLDER_DEPTH,
  getFolderDepth,
  getParentFolderPath,
  normalizeFolderPath,
  sanitizeFolderSegment,
} from '@/app/[lang]/(dashboard)/_shared/components/media/types';

export const MEDIA_CUSTOM_FOLDERS_SETTINGS_KEY = 'media_custom_folders';
const RESERVED_FOLDER_PREFIXES = new Set(['thumbnails']);

interface FolderCountSourceItem {
  folder?: string;
}

function isReservedFolder(folderId: string): boolean {
  if (!folderId) return false;
  const firstSegment = folderId.split('/')[0];
  return RESERVED_FOLDER_PREFIXES.has(firstSegment);
}

function humanizeSegment(seg: string): string {
  return seg
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Reads user-created custom folders & nested subfolders from MongoDB `system_settings`.
 */
export async function getCustomFoldersFromDb(): Promise<FolderOption[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const doc = await db
      .collection(COLLECTIONS.SETTINGS)
      .findOne({ key: MEDIA_CUSTOM_FOLDERS_SETTINGS_KEY });

    const rawList = Array.isArray(doc?.value) ? doc.value : [];
    const normalized: FolderOption[] = [];

    for (const entry of rawList) {
      if (!entry || typeof entry !== 'object') continue;
      const rec = entry as Partial<FolderOption>;
      const cleanId = normalizeFolderPath(String(rec.id || ''));
      if (!cleanId || isReservedFolder(cleanId)) continue;

      const leaf = cleanId.split('/').pop() || cleanId;
      normalized.push({
        id: cleanId,
        labelEn: String(rec.labelEn || humanizeSegment(leaf)).trim(),
        labelAr: String(rec.labelAr || rec.labelEn || humanizeSegment(leaf)).trim(),
        parentId: getParentFolderPath(cleanId),
        isCustom: true,
      });
    }

    return normalized;
  } catch (err) {
    console.warn('[media-folders] Failed to read custom folders:', err);
    return [];
  }
}

async function saveCustomFoldersToDb(
  folders: FolderOption[],
  updatedBy?: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error('Database connection unavailable.');
  }

  await db.collection(COLLECTIONS.SETTINGS).updateOne(
    { key: MEDIA_CUSTOM_FOLDERS_SETTINGS_KEY },
    {
      $set: {
        key: MEDIA_CUSTOM_FOLDERS_SETTINGS_KEY,
        value: folders.map((f) => ({
          id: f.id,
          labelEn: f.labelEn,
          labelAr: f.labelAr,
          parentId: f.parentId || '',
          isCustom: true,
        })),
        updatedAt: new Date(),
        ...(updatedBy ? { updatedBy } : {}),
      },
    },
    { upsert: true }
  );
}

/**
 * Builds the complete, hierarchically ordered list of folders (Default + Custom + Auto-Discovered),
 * ensuring parent chain materialization and computing direct & cumulative item counts.
 */
export async function buildMergedFoldersList(
  items?: FolderCountSourceItem[]
): Promise<FolderOption[]> {
  let sourceItems = items;

  if (!sourceItems) {
    const fallbackItems: FolderCountSourceItem[] = [];
    const seenKeys = new Set<string>();

    if (isR2Configured()) {
      try {
        const r2Items = await listFilesFromR2('', 1000);
        for (const r2 of r2Items) {
          seenKeys.add(r2.key);
          const r2Folder = r2.key.includes('/')
            ? r2.key.substring(0, r2.key.lastIndexOf('/'))
            : '';
          fallbackItems.push({ folder: r2Folder });
        }
      } catch (err) {
        console.warn('[media-folders] R2 folder discovery warning:', err);
      }
    }

    const db = await getDb();
    if (db) {
      try {
        const dbDocs = await db
          .collection(COLLECTIONS.MEDIA)
          .find({}, { projection: { key: 1, folder: 1 } })
          .toArray();
        for (const doc of dbDocs) {
          if (typeof doc.folder === 'string' && doc.folder) {
            if (!doc.key || !seenKeys.has(String(doc.key))) {
              fallbackItems.push({ folder: doc.folder });
            }
          }
        }
      } catch (err) {
        console.warn('[media-folders] MongoDB folder discovery warning:', err);
      }
    }

    sourceItems = fallbackItems;
  }

  const folderMap = new Map<string, FolderOption>();

  const ensureHierarchyNode = (
    rawId: string,
    overrideLabels?: { labelEn?: string; labelAr?: string; isCustom?: boolean }
  ) => {
    const cleanId = normalizeFolderPath(rawId);
    if (!cleanId || isReservedFolder(cleanId)) return;

    // Ensure all ancestors exist
    const segments = cleanId.split('/');
    let acc = '';
    for (let idx = 0; idx < segments.length; idx++) {
      const seg = segments[idx];
      acc = acc ? `${acc}/${seg}` : seg;
      const isLeaf = idx === segments.length - 1;
      const parentId = getParentFolderPath(acc);

      if (!folderMap.has(acc)) {
        const fallbackLabel = humanizeSegment(seg);
        folderMap.set(acc, {
          id: acc,
          labelEn: isLeaf && overrideLabels?.labelEn ? overrideLabels.labelEn : fallbackLabel,
          labelAr:
            isLeaf && overrideLabels?.labelAr
              ? overrideLabels.labelAr
              : isLeaf && overrideLabels?.labelEn
              ? overrideLabels.labelEn
              : fallbackLabel,
          parentId,
          isCustom: isLeaf ? (overrideLabels?.isCustom ?? true) : true,
          count: 0,
          directCount: 0,
        });
      } else if (isLeaf && overrideLabels) {
        const existing = folderMap.get(acc)!;
        // Do not override built-in default labels
        if (existing.isCustom) {
          existing.labelEn = overrideLabels.labelEn || existing.labelEn;
          existing.labelAr = overrideLabels.labelAr || existing.labelAr;
        }
      }
    }
  };

  // 1. Seed default built-in folders
  for (const def of DEFAULT_FOLDERS) {
    folderMap.set(def.id, {
      ...def,
      parentId: def.parentId || '',
      isCustom: false,
      count: 0,
      directCount: 0,
    });
  }

  // 2. Merge persisted custom folders & nested subfolders
  const customFolders = await getCustomFoldersFromDb();
  for (const custom of customFolders) {
    ensureHierarchyNode(custom.id, {
      labelEn: custom.labelEn,
      labelAr: custom.labelAr,
      isCustom: true,
    });
  }

  // 3. Discover any folders used on items in R2 or MongoDB
  for (const item of sourceItems) {
    const f = normalizeFolderPath(item.folder || '');
    if (f) {
      ensureHierarchyNode(f);
    }
  }

  // 4. Compute direct & cumulative item counts
  const directCounts = new Map<string, number>();
  for (const item of sourceItems) {
    const clean = normalizeFolderPath(item.folder || '');
    if (isReservedFolder(clean)) continue;
    directCounts.set(clean, (directCounts.get(clean) || 0) + 1);
  }

  for (const folder of folderMap.values()) {
    if (folder.id === '') {
      folder.directCount = directCounts.get('') || 0;
      folder.count = sourceItems.filter((i) => !isReservedFolder(normalizeFolderPath(i.folder || ''))).length;
    } else {
      folder.directCount = directCounts.get(folder.id) || 0;
      let cumulative = 0;
      for (const [itemFolderId, cnt] of directCounts.entries()) {
        if (itemFolderId === folder.id || itemFolderId.startsWith(`${folder.id}/`)) {
          cumulative += cnt;
        }
      }
      folder.count = cumulative;
    }
  }

  // 5. Flatten hierarchically (DFS): All Folders first, then each root folder immediately followed by its nested children
  const allEntries = Array.from(folderMap.values());
  const defaultOrderIndex = new Map<string, number>();
  DEFAULT_FOLDERS.forEach((f, idx) => defaultOrderIndex.set(f.id, idx));

  const childrenByParent = new Map<string, FolderOption[]>();
  for (const entry of allEntries) {
    if (entry.id === '') continue;
    const pid = entry.parentId || '';
    const arr = childrenByParent.get(pid) || [];
    arr.push(entry);
    childrenByParent.set(pid, arr);
  }

  for (const [pid, siblings] of childrenByParent.entries()) {
    siblings.sort((a, b) => {
      if (pid === '') {
        const idxA = defaultOrderIndex.get(a.id);
        const idxB = defaultOrderIndex.get(b.id);
        if (idxA !== undefined && idxB !== undefined) return idxA - idxB;
        if (idxA !== undefined) {
          // Place custom root folders before 'general'
          return a.id === 'general' ? 1 : -1;
        }
        if (idxB !== undefined) {
          return b.id === 'general' ? -1 : 1;
        }
      }
      return a.labelEn.localeCompare(b.labelEn);
    });
  }

  const ordered: FolderOption[] = [];
  const rootAll = folderMap.get('');
  if (rootAll) ordered.push(rootAll);

  const visit = (parentId: string) => {
    const kids = childrenByParent.get(parentId) || [];
    for (const kid of kids) {
      ordered.push(kid);
      visit(kid.id);
    }
  };
  visit('');

  return ordered;
}

export interface CreateCustomFolderInput {
  nameEn: string;
  nameAr?: string;
  parentFolder?: string;
  slug?: string;
  userEmail?: string;
}

/**
 * Creates a new custom root folder or nested subfolder and persists it in MongoDB.
 */
export async function createCustomFolderInDb(
  input: CreateCustomFolderInput
): Promise<FolderOption> {
  const labelEn = (input.nameEn || '').trim();
  const labelAr = (input.nameAr || labelEn).trim();
  if (!labelEn) {
    throw new Error('Folder name is required.');
  }

  const parentId = normalizeFolderPath(input.parentFolder || '');
  if (isReservedFolder(parentId)) {
    throw new Error('Cannot create subfolders inside reserved system folder.');
  }

  if (parentId && getFolderDepth(parentId) >= MAX_FOLDER_DEPTH) {
    throw new Error(`Maximum folder nesting depth is ${MAX_FOLDER_DEPTH} levels.`);
  }

  const leafSlug = sanitizeFolderSegment(input.slug || labelEn);
  if (!leafSlug) {
    throw new Error('Folder slug must contain at least one English letter or number (a-z, 0-9).');
  }

  const newId = parentId ? `${parentId}/${leafSlug}` : leafSlug;
  if (isReservedFolder(newId)) {
    throw new Error('This folder name is reserved for internal system thumbnails.');
  }

  const existingMerged = await buildMergedFoldersList();
  if (existingMerged.some((f) => f.id === newId)) {
    throw new Error(`A folder with path "${newId}" already exists.`);
  }

  const newFolder: FolderOption = {
    id: newId,
    labelEn,
    labelAr: labelAr || labelEn,
    parentId,
    isCustom: true,
    count: 0,
    directCount: 0,
  };

  const currentCustom = await getCustomFoldersFromDb();
  const nextCustom = [...currentCustom, newFolder];
  await saveCustomFoldersToDb(nextCustom, input.userEmail);

  return newFolder;
}

/**
 * Deletes a custom folder (and any nested custom subfolders underneath it) from MongoDB.
 */
export async function deleteCustomFolderFromDb(
  folderId: string,
  options: { moveItemsToParent?: boolean; userEmail?: string } = {}
): Promise<{ deletedIds: string[]; movedItemsCount: number }> {
  const cleanId = normalizeFolderPath(folderId);
  if (!cleanId) {
    throw new Error('Folder ID is required.');
  }

  const isBuiltIn = DEFAULT_FOLDERS.some((f) => f.id === cleanId);
  if (isBuiltIn) {
    throw new Error('Built-in system folders cannot be deleted.');
  }

  const db = await getDb();
  if (!db) {
    throw new Error('Database connection unavailable.');
  }

  let movedItemsCount = 0;

  // Check if any media items currently belong to this folder or its children
  const merged = await buildMergedFoldersList();
  const targetMeta = merged.find((f) => f.id === cleanId);
  const itemCount = targetMeta?.count || 0;

  if (itemCount > 0) {
    if (!options.moveItemsToParent) {
      throw new Error(
        `Folder "${cleanId}" contains ${itemCount} item(s). Move files out first or enable "move to parent".`
      );
    }

    const fallbackDest = getParentFolderPath(cleanId) || 'general';
    const publicBase = getR2PublicUrl();
    const escapedId = cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Move any physical R2 files inside this folder/subfolders to fallbackDest via Option B
    if (isR2Configured()) {
      const physicalItems = await listFilesFromR2(`${cleanId}/`, 1000);
      for (const r2Item of physicalItems) {
        const filename = path.basename(r2Item.key);
        let targetKey = `${fallbackDest}/${filename}`;
        if (await checkFileExistsInR2(targetKey)) {
          const ext = path.extname(filename);
          const base = path.basename(filename, ext);
          targetKey = `${fallbackDest}/${base}-${Date.now()}${ext}`;
        }
        const renameRes = await renameFileInR2(r2Item.key, targetKey);
        const oldUrl = r2Item.url || `${publicBase}/${r2Item.key}`;
        await db.collection(COLLECTIONS.MEDIA).updateOne(
          { key: r2Item.key },
          {
            $set: {
              key: renameRes.newKey,
              url: renameRes.newUrl,
              filename: renameRes.newFilename,
              folder: fallbackDest,
              updatedAt: new Date(),
              ...(options.userEmail ? { updatedBy: options.userEmail } : {}),
            },
          },
          { upsert: true }
        );
        await syncMediaUrlAcrossDatabase(oldUrl, renameRes.newUrl);
        movedItemsCount += 1;
      }
    }

    // Reassign any remaining virtual-folder DB docs pointing to cleanId or cleanId/*
    const matchingDocs = await db
      .collection(COLLECTIONS.MEDIA)
      .find({
        $or: [{ folder: cleanId }, { folder: { $regex: `^${escapedId}/` } }],
      })
      .toArray();

    for (const doc of matchingDocs) {
      await db.collection(COLLECTIONS.MEDIA).updateOne(
        { _id: doc._id },
        {
          $set: {
            folder: fallbackDest,
            updatedAt: new Date(),
            ...(options.userEmail ? { updatedBy: options.userEmail } : {}),
          },
        }
      );
      movedItemsCount += 1;
    }
  }

  const currentCustom = await getCustomFoldersFromDb();
  const deletedIds: string[] = [];
  const remaining = currentCustom.filter((f) => {
    const match = f.id === cleanId || f.id.startsWith(`${cleanId}/`);
    if (match) deletedIds.push(f.id);
    return !match;
  });

  if (!deletedIds.includes(cleanId)) {
    deletedIds.push(cleanId);
  }

  await saveCustomFoldersToDb(remaining, options.userEmail);

  return { deletedIds, movedItemsCount };
}
