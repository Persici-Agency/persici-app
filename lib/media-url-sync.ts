import 'server-only';
import { revalidatePath } from 'next/cache';
import { COLLECTIONS, getDb } from '@/lib/mongodb';
import type {
  MediaUrlSyncReport,
  MediaUrlUsageItem,
  MediaUrlUsageSummary,
} from '@/app/[lang]/(dashboard)/_shared/components/media/types';

const CONTENT_COLLECTIONS: string[] = [
  COLLECTIONS.PAGES,
  COLLECTIONS.PROJECTS,
  COLLECTIONS.TEAM_MEMBERS,
  COLLECTIONS.INSIGHTS,
  COLLECTIONS.REVIEWS,
  COLLECTIONS.TESTIMONIALS,
  COLLECTIONS.CLIENT_LOGOS,
  COLLECTIONS.SERVICES,
  COLLECTIONS.SOLUTIONS,
  COLLECTIONS.INDUSTRIES,
  COLLECTIONS.CAREERS,
  COLLECTIONS.USERS,
  COLLECTIONS.NAVIGATION,
  COLLECTIONS.SETTINGS,
];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Recursively replaces every literal occurrence of `oldUrl` with `newUrl`
 * inside strings (exact or inside HTML), arrays, and plain objects.
 */
export function replaceUrlInValue(
  value: unknown,
  oldUrl: string,
  newUrl: string
): { nextValue: unknown; count: number } {
  if (!oldUrl || oldUrl === newUrl) {
    return { nextValue: value, count: 0 };
  }

  if (typeof value === 'string') {
    if (!value.includes(oldUrl)) {
      return { nextValue: value, count: 0 };
    }
    const parts = value.split(oldUrl);
    return {
      nextValue: parts.join(newUrl),
      count: parts.length - 1,
    };
  }

  if (Array.isArray(value)) {
    let totalCount = 0;
    let mutated = false;
    const nextArr = value.map((item) => {
      const res = replaceUrlInValue(item, oldUrl, newUrl);
      if (res.count > 0) {
        totalCount += res.count;
        mutated = true;
      }
      return res.nextValue;
    });
    return { nextValue: mutated ? nextArr : value, count: totalCount };
  }

  if (isPlainObject(value)) {
    let totalCount = 0;
    let mutated = false;
    const nextObj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === '_id') {
        nextObj[k] = v;
        continue;
      }
      const res = replaceUrlInValue(v, oldUrl, newUrl);
      if (res.count > 0) {
        totalCount += res.count;
        mutated = true;
      }
      nextObj[k] = res.nextValue;
    }
    return { nextValue: mutated ? nextObj : value, count: totalCount };
  }

  return { nextValue: value, count: 0 };
}

function countOccurrencesInValue(value: unknown, targetUrl: string): number {
  if (!targetUrl) return 0;

  if (typeof value === 'string') {
    if (!value.includes(targetUrl)) return 0;
    return value.split(targetUrl).length - 1;
  }

  if (Array.isArray(value)) {
    let count = 0;
    for (const item of value) {
      count += countOccurrencesInValue(item, targetUrl);
    }
    return count;
  }

  if (isPlainObject(value)) {
    let count = 0;
    for (const [k, v] of Object.entries(value)) {
      if (k === '_id') continue;
      count += countOccurrencesInValue(v, targetUrl);
    }
    return count;
  }

  return 0;
}

function extractDocumentLabel(doc: Record<string, unknown>, collectionName: string): string {
  const tryLocalized = (field: unknown): string => {
    if (typeof field === 'string' && field.trim()) return field.trim();
    if (isPlainObject(field)) {
      const en = typeof field.en === 'string' ? field.en.trim() : '';
      const ar = typeof field.ar === 'string' ? field.ar.trim() : '';
      return en || ar;
    }
    return '';
  };

  if (doc.firstName || doc.lastName) {
    const fn = tryLocalized(doc.firstName);
    const ln = tryLocalized(doc.lastName);
    const combined = `${fn} ${ln}`.trim();
    if (combined) return combined;
  }

  const candidates = [
    doc.title,
    doc.name,
    doc.companyName,
    doc.clientName,
    doc.slug,
    doc.pageSlug,
    doc.key,
    doc.email,
  ];

  for (const candidate of candidates) {
    const text = tryLocalized(candidate);
    if (text) return text;
  }

  return `${collectionName} (${String(doc._id || 'doc')})`;
}

/**
 * Synchronizes a changed CDN URL across all 14 MongoDB content collections
 * plus companion `media_items.thumbnailUrl` references, and revalidates Next.js cache.
 */
export async function syncMediaUrlAcrossDatabase(
  oldUrl: string,
  newUrl: string
): Promise<MediaUrlSyncReport> {
  const emptyReport: MediaUrlSyncReport = {
    oldUrl,
    newUrl,
    updatedCollections: [],
    updatedDocumentsCount: 0,
    totalReplacements: 0,
  };

  if (!oldUrl || !newUrl || oldUrl === newUrl) {
    return emptyReport;
  }

  const db = await getDb();
  if (!db) {
    return emptyReport;
  }

  const updatedCollections: Array<{ collection: string; count: number }> = [];
  let updatedDocumentsCount = 0;
  let totalReplacements = 0;

  for (const collectionName of CONTENT_COLLECTIONS) {
    try {
      const docs = await db.collection(collectionName).find({}).toArray();
      let collectionUpdatedCount = 0;

      for (const doc of docs) {
        const plainDoc = doc as Record<string, unknown>;
        const setFields: Record<string, unknown> = {};
        let docReplacements = 0;

        for (const [fieldKey, fieldValue] of Object.entries(plainDoc)) {
          if (fieldKey === '_id') continue;
          const res = replaceUrlInValue(fieldValue, oldUrl, newUrl);
          if (res.count > 0) {
            setFields[fieldKey] = res.nextValue;
            docReplacements += res.count;
          }
        }

        if (docReplacements > 0) {
          setFields.updatedAt = new Date();
          await db
            .collection(collectionName)
            .updateOne({ _id: doc._id }, { $set: setFields });

          collectionUpdatedCount += 1;
          updatedDocumentsCount += 1;
          totalReplacements += docReplacements;
        }
      }

      if (collectionUpdatedCount > 0) {
        updatedCollections.push({
          collection: collectionName,
          count: collectionUpdatedCount,
        });
      }
    } catch (err) {
      console.warn(`[media-url-sync] Skipping collection ${collectionName}:`, err);
    }
  }

  // Also sync companion thumbnailUrl pointers inside media_items if any reference oldUrl
  try {
    const thumbResult = await db.collection(COLLECTIONS.MEDIA).updateMany(
      { thumbnailUrl: oldUrl },
      { $set: { thumbnailUrl: newUrl, updatedAt: new Date() } }
    );
    if (thumbResult.modifiedCount > 0) {
      updatedCollections.push({
        collection: COLLECTIONS.MEDIA,
        count: thumbResult.modifiedCount,
      });
      updatedDocumentsCount += thumbResult.modifiedCount;
      totalReplacements += thumbResult.modifiedCount;
    }
  } catch (err) {
    console.warn('[media-url-sync] Thumbnail sync warning:', err);
  }

  if (totalReplacements > 0) {
    try {
      revalidatePath('/', 'layout');
    } catch (revalErr) {
      console.warn('[media-url-sync] Revalidate warning:', revalErr);
    }
  }

  return {
    oldUrl,
    newUrl,
    updatedCollections,
    updatedDocumentsCount,
    totalReplacements,
  };
}

/**
 * Finds all documents across content collections currently linking to `targetUrl`.
 */
export async function findMediaUrlUsages(
  targetUrl: string
): Promise<MediaUrlUsageSummary> {
  const empty: MediaUrlUsageSummary = {
    url: targetUrl,
    totalUsages: 0,
    usages: [],
  };

  if (!targetUrl) return empty;
  const db = await getDb();
  if (!db) return empty;

  const usages: MediaUrlUsageItem[] = [];
  let totalUsages = 0;

  for (const collectionName of CONTENT_COLLECTIONS) {
    try {
      const docs = await db.collection(collectionName).find({}).toArray();
      for (const doc of docs) {
        const plainDoc = doc as Record<string, unknown>;
        let docOccurrences = 0;
        for (const [k, v] of Object.entries(plainDoc)) {
          if (k === '_id') continue;
          docOccurrences += countOccurrencesInValue(v, targetUrl);
        }
        if (docOccurrences > 0) {
          totalUsages += docOccurrences;
          usages.push({
            collection: collectionName,
            documentId: String(doc._id || ''),
            label: extractDocumentLabel(plainDoc, collectionName),
            occurrences: docOccurrences,
          });
        }
      }
    } catch (err) {
      console.warn(`[findMediaUrlUsages] Skipping ${collectionName}:`, err);
    }
  }

  return {
    url: targetUrl,
    totalUsages,
    usages,
  };
}
