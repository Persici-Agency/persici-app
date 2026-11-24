import 'server-only';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import {
  clientStoriesData,
  getAllClientStories,
  getClientStoryBySlug,
  getRelatedClientStories,
} from '@/app/[lang]/(site)/client-stories/_client-stories/data/client-stories.data';
import {
  DEFAULT_CLIENT_STORY_CATEGORIES,
  DEFAULT_CLIENT_STORY_DETAIL_SPACING,
  DEFAULT_GALLERY_CAROUSEL_CONFIG,
  hasAnyBilingualText,
  normalizeBilingualInput,
  resolveBilingualText,
  slugifyCategorySlug,
  DEFAULT_GALLERY_ROWS_CONFIG,
  type ClientStoryCategory,
  type ClientStoryDetail,
  type ClientStoryDetailSpacingConfig,
  type StoryGalleryCarouselConfig,
  type StoryGalleryHorizontalPos,
  type StoryGalleryRowFit,
  type StoryGalleryRowsConfig,
  type StoryGalleryVerticalPos,
  type StoryHeroSliderConfig,
  type StoryHeroSliderImage,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';

import type { Document } from 'mongodb';

function clampNumber(val: unknown, min: number, max: number, fallback: number): number {
  const n = typeof val === 'number' ? val : Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

const VALID_ROW_FITS = new Set<StoryGalleryRowFit>(['cover', 'contain', 'scale-down', 'fill']);
const VALID_V_POS = new Set<StoryGalleryVerticalPos>(['top', 'center', 'bottom']);
const VALID_H_POS = new Set<StoryGalleryHorizontalPos>(['left', 'center', 'right']);

function normalizeGalleryRowsConfig(raw: unknown): StoryGalleryRowsConfig | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const obj = raw as Record<string, unknown>;
  const objectFit =
    typeof obj.objectFit === 'string' && VALID_ROW_FITS.has(obj.objectFit as StoryGalleryRowFit)
      ? (obj.objectFit as StoryGalleryRowFit)
      : DEFAULT_GALLERY_ROWS_CONFIG.objectFit;
  const verticalPosition =
    typeof obj.verticalPosition === 'string' &&
    VALID_V_POS.has(obj.verticalPosition as StoryGalleryVerticalPos)
      ? (obj.verticalPosition as StoryGalleryVerticalPos)
      : DEFAULT_GALLERY_ROWS_CONFIG.verticalPosition;
  const horizontalPosition =
    typeof obj.horizontalPosition === 'string' &&
    VALID_H_POS.has(obj.horizontalPosition as StoryGalleryHorizontalPos)
      ? (obj.horizontalPosition as StoryGalleryHorizontalPos)
      : DEFAULT_GALLERY_ROWS_CONFIG.horizontalPosition;

  return {
    height: clampNumber(obj.height, 160, 2200, DEFAULT_GALLERY_ROWS_CONFIG.height),
    objectFit,
    verticalPosition,
    horizontalPosition,
  };
}

function normalizeGalleryCarouselConfig(raw: unknown): StoryGalleryCarouselConfig | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const obj = raw as Record<string, unknown>;
  return {
    autoPlay:
      obj.autoPlay !== undefined
        ? Boolean(obj.autoPlay)
        : DEFAULT_GALLERY_CAROUSEL_CONFIG.autoPlay,
    intervalMs: clampNumber(
      obj.intervalMs,
      1000,
      20000,
      DEFAULT_GALLERY_CAROUSEL_CONFIG.intervalMs
    ),
    speedMs: clampNumber(
      obj.speedMs,
      150,
      3000,
      DEFAULT_GALLERY_CAROUSEL_CONFIG.speedMs
    ),
    slidesPerMove: clampNumber(
      obj.slidesPerMove,
      1,
      6,
      DEFAULT_GALLERY_CAROUSEL_CONFIG.slidesPerMove
    ),
    infinite:
      obj.infinite !== undefined
        ? Boolean(obj.infinite)
        : DEFAULT_GALLERY_CAROUSEL_CONFIG.infinite,
  };
}

function normalizeHeroSlider(
  raw: unknown,
  fallback?: StoryHeroSliderConfig
): StoryHeroSliderConfig | undefined {
  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const s = raw as Record<string, unknown>;
  const rawImages = Array.isArray(s.images) ? s.images : fallback?.images || [];
  const images: StoryHeroSliderImage[] = rawImages
    .map((item): StoryHeroSliderImage | null => {
      if (typeof item === 'string') {
        const src = item.trim();
        return src ? { src } : null;
      }
      if (!item || typeof item !== 'object') return null;
      const obj = item as Record<string, unknown>;
      const src = typeof obj.src === 'string' ? obj.src.trim() : '';
      if (!src) return null;

      const rawAlt =
        obj.alt && typeof obj.alt === 'object'
          ? (obj.alt as Record<string, unknown>)
          : undefined;
      const altEn = typeof rawAlt?.en === 'string' ? rawAlt.en.trim() : '';
      const altAr = typeof rawAlt?.ar === 'string' ? rawAlt.ar.trim() : '';

      return {
        src,
        ...(altEn || altAr ? { alt: { en: altEn, ar: altAr } } : {}),
      };
    })
    .filter((item): item is StoryHeroSliderImage => item !== null);

  return {
    enabled: Boolean(s.enabled),
    autoScroll: s.autoScroll !== undefined ? Boolean(s.autoScroll) : true,
    infinite: s.infinite !== undefined ? Boolean(s.infinite) : true,
    intervalMs: clampNumber(s.intervalMs, 1000, 15000, fallback?.intervalMs ?? 4000),
    transitionMs: clampNumber(s.transitionMs, 200, 2000, fallback?.transitionMs ?? 650),
    showArrows: s.showArrows !== undefined ? Boolean(s.showArrows) : true,
    images,
  };
}

/**
 * Maps raw MongoDB document to fully typed ClientStoryDetail with fallbacks.
 */
function mapDocToClientStory(
  d: Document | Record<string, unknown>,
  includeDraftMeta = false
): ClientStoryDetail {
  const slug = String(d.slug || '');
  const fallback = getClientStoryBySlug(slug);

  const rawTitle = d.title as { en?: string; ar?: string } | undefined;
  const rawLead = (d.leadSubtitle || d.subtitle) as { en?: string; ar?: string } | undefined;
  const rawExec = (d.executiveSummary || d.summary) as { en?: string; ar?: string } | undefined;
  const rawCat = d.category as { en?: string; ar?: string } | undefined;
  const rawTopic = d.topic as { en?: string; ar?: string } | undefined;
  const rawRegion = d.region as { en?: string; ar?: string } | undefined;

  const title = {
    en: rawTitle?.en !== undefined ? rawTitle.en : (fallback?.title?.en || ''),
    ar: rawTitle?.ar !== undefined ? rawTitle.ar : (fallback?.title?.ar || rawTitle?.en || ''),
  };

  const leadSubtitle = {
    en: rawLead?.en !== undefined ? rawLead.en : (fallback?.leadSubtitle?.en || ''),
    ar: rawLead?.ar !== undefined ? rawLead.ar : (fallback?.leadSubtitle?.ar || rawLead?.en || ''),
  };

  const executiveSummary = {
    en: rawExec?.en !== undefined ? rawExec.en : (fallback?.executiveSummary?.en || ''),
    ar: rawExec?.ar !== undefined ? rawExec.ar : (fallback?.executiveSummary?.ar || rawExec?.en || ''),
  };

  const category = {
    en: rawCat?.en !== undefined ? rawCat.en : (fallback?.category?.en || 'Growth & Multi-Channel'),
    ar: rawCat?.ar !== undefined ? rawCat.ar : (fallback?.category?.ar || 'الحملات ونمو العلامة'),
  };

  const topic = {
    en: rawTopic?.en !== undefined ? rawTopic.en : (fallback?.topic?.en || 'Brand Transformation'),
    ar: rawTopic?.ar !== undefined ? rawTopic.ar : (fallback?.topic?.ar || 'تحول العلامة التجارية'),
  };

  const region = {
    en: rawRegion?.en !== undefined ? rawRegion.en : (fallback?.region?.en || 'GCC & MENA'),
    ar: rawRegion?.ar !== undefined ? rawRegion.ar : (fallback?.region?.ar || 'الخليج والشرق الأوسط'),
  };

  const metrics = Array.isArray(d.metrics)
    ? d.metrics
    : (fallback?.metrics || []);

  const intro = (d.intro && typeof d.intro === 'object')
    ? (d.intro as unknown as ClientStoryDetail['intro'])
    : (fallback?.intro || {
        id: 'intro',
        title: { en: 'Project Overview', ar: 'نظرة عامة على المشروع' },
        paragraphs: [{ en: executiveSummary.en, ar: executiveSummary.ar }],
      });

  const problem = (d.problem && typeof d.problem === 'object')
    ? (d.problem as unknown as ClientStoryDetail['problem'])
    : (fallback?.problem || {
        id: 'the-problem',
        title: { en: 'The Challenge', ar: 'التحدي والمشكلة' },
        paragraphs: [{ en: (d.challenge as Record<string, string>)?.en || '', ar: (d.challenge as Record<string, string>)?.ar || '' }],
      });

  const solution = (d.solution && typeof d.solution === 'object')
    ? (d.solution as unknown as ClientStoryDetail['solution'])
    : (fallback?.solution || {
        id: 'the-solution',
        title: { en: 'The Solution', ar: 'الحل والنهج المتبع' },
        paragraphs: [{
          en: typeof d.solution === 'object' && d.solution && 'en' in d.solution ? String((d.solution as Record<string, unknown>).en) : '',
          ar: typeof d.solution === 'object' && d.solution && 'ar' in d.solution ? String((d.solution as Record<string, unknown>).ar) : '',
        }],
      });

  const impact = (d.impact && typeof d.impact === 'object')
    ? (d.impact as unknown as ClientStoryDetail['impact'])
    : (fallback?.impact || {
        id: 'the-impact',
        title: { en: 'The Impact', ar: 'الأثر والنتائج' },
        paragraphs: [{ en: (d.results as Record<string, string>)?.en || '', ar: (d.results as Record<string, string>)?.ar || '' }],
      });

  const rawShowcase =
    d.mediaShowcase && typeof d.mediaShowcase === 'object'
      ? (d.mediaShowcase as unknown as ClientStoryDetail['mediaShowcase'])
      : fallback?.mediaShowcase || {
          title: { en: 'Deliverables & Production', ar: 'معرض المخرجات والإنتاج' },
          description: { en: '', ar: '' },
        };
  const normalizedRowsCfg = normalizeGalleryRowsConfig(rawShowcase.galleryRowsConfig);
  const normalizedCarouselCfg = normalizeGalleryCarouselConfig(
    rawShowcase.galleryCarouselConfig
  );
  const mediaShowcase: ClientStoryDetail['mediaShowcase'] = {
    ...rawShowcase,
    ...(normalizedRowsCfg ? { galleryRowsConfig: normalizedRowsCfg } : {}),
    ...(normalizedCarouselCfg ? { galleryCarouselConfig: normalizedCarouselCfg } : {}),
  };

  const rawPartner =
    d.partner !== undefined
      ? normalizeBilingualInput(d.partner)
      : fallback?.partner
      ? normalizeBilingualInput(fallback.partner)
      : { en: '', ar: '' };
  const partner = {
    en: rawPartner.en.trim(),
    ar: rawPartner.ar.trim(),
  };

  const client = (() => {
    if (typeof d.client === 'string') {
      const trimmed = d.client.trim();
      if (trimmed) {
        if (
          fallback?.client?.en &&
          trimmed.toLowerCase() === fallback.client.en.trim().toLowerCase()
        ) {
          return {
            en: trimmed,
            ar: fallback.client.ar || '',
          };
        }
        return { en: trimmed, ar: '' };
      }
    } else if (d.client && typeof d.client === 'object') {
      const obj = d.client as Record<string, unknown>;
      const en = typeof obj.en === 'string' ? obj.en.trim() : '';
      const ar = typeof obj.ar === 'string' ? obj.ar.trim() : '';
      if (en || ar) {
        return { en, ar };
      }
    }
    return (
      fallback?.client || {
        en: 'Persici Enterprise Partner',
        ar: 'شريك بيرسيشي المؤسسي',
      }
    );
  })();

  const heroSlider = normalizeHeroSlider(d.heroSlider, fallback?.heroSlider);
  const status: ClientStoryDetail['status'] =
    d.status === 'draft' || d.isActive === false ? 'draft' : 'published';
  const mappedDraftData =
    includeDraftMeta && d.draftData && typeof d.draftData === 'object'
      ? mapDocToClientStory(d.draftData as Record<string, unknown>, false)
      : undefined;
  const draftUpdatedAt =
    includeDraftMeta && d.draftUpdatedAt
      ? new Date(d.draftUpdatedAt as string | Date).toISOString()
      : undefined;

  return {
    id: (d.id as string) || String(d._id),
    slug: d.slug as string,
    templateType: (d.templateType as ClientStoryDetail['templateType']) || fallback?.templateType || 'marketing-video-showcase',
    category,
    categorySlug: (d.categorySlug as ClientStoryDetail['categorySlug']) || fallback?.categorySlug || 'marketing',
    featured: Boolean(d.featured !== undefined ? d.featured : fallback?.featured),
    featuredOrder: (d.featuredOrder as number) ?? fallback?.featuredOrder ?? 1,
    title,
    leadSubtitle,
    executiveSummary,
    ...(hasAnyBilingualText(partner) ? { partner } : {}),
    client,
    topic,
    services: Array.isArray(d.services) ? (d.services as ClientStoryDetail['services']) : (fallback?.services || []),
    region,
    date: (d.date as string) || fallback?.date || '2025',
    link: (d.link as string) || fallback?.link,
    heroImage: (d.heroImage as string) || (d.featuredImage as string) || fallback?.heroImage || '/images/hero/hero-poster.webp',
    ...(heroSlider ? { heroSlider } : {}),
    heroVideo: (d.heroVideo as string) || (d.videoUrl as string) || fallback?.heroVideo,
    heroVideoPoster: (d.heroVideoPoster as string) || fallback?.heroVideoPoster,
    metrics: metrics as ClientStoryDetail['metrics'],
    intro,
    problem,
    solution,
    impact,
    mediaShowcase,
    relatedSlugs: Array.isArray(d.relatedSlugs) ? (d.relatedSlugs as string[]) : (fallback?.relatedSlugs || []),
    aiReferences: Array.isArray(d.aiReferences)
      ? (d.aiReferences as ClientStoryDetail['aiReferences'])
      : (fallback?.aiReferences || []),
    ...(includeDraftMeta ? { status } : {}),
    ...(mappedDraftData ? { draftData: mappedDraftData } : {}),
    ...(draftUpdatedAt ? { draftUpdatedAt } : {}),
  };
}

const LEGACY_PLACEHOLDER_SLUGS = [
  'nordic-living',
  'lumina-beauty',
  'urban-pulse',
  'atelier-chic',
];

/**
 * Ensures initial default client stories are seeded into MongoDB Atlas if collection is empty
 * or still contains legacy placeholder records.
 */
export async function ensureProjectsSeeded(force = false) {
  try {
    const db = await getDb();
    if (!db) return;

    const col = db.collection(COLLECTIONS.PROJECTS);

    // Purge legacy 4 dummy placeholder records if present
    await col.deleteMany({ slug: { $in: LEGACY_PLACEHOLDER_SLUGS } });

    const count = await col.countDocuments();
    if ((count === 0 || force) && clientStoriesData.length > 0) {
      if (force && count > 0) {
        await col.deleteMany({});
      }
      const now = Date.now();
      const docs = clientStoriesData.map((project, idx) => ({
        ...project,
        isActive: true,
        sortOrder: idx + 1,
        createdAt: new Date(now - idx * 1000),
        updatedAt: new Date(now - idx * 1000),
      }));
      await col.insertMany(docs);
    }
  } catch (err) {
    console.warn('[Projects DB] Seed check warning:', err);
  }
}

/**
 * Retrieves all client stories / projects from MongoDB Atlas (falls back to static dataset).
 */
export async function getAllProjectsFromDb(onlyActive = true): Promise<ClientStoryDetail[]> {
  try {
    await ensureProjectsSeeded();
    const db = await getDb();
    if (!db) return getAllClientStories();

    const query = onlyActive ? { isActive: { $ne: false }, status: { $ne: 'draft' } } : {};
    const docs = await db.collection(COLLECTIONS.PROJECTS).find(query).toArray();

    if (!docs || docs.length === 0) {
      return getAllClientStories();
    }

    return docs.map((doc) => mapDocToClientStory(doc, !onlyActive));
  } catch (err) {
    console.warn('[Projects DB] Failed to fetch from DB, falling back to static:', err);
    return getAllClientStories();
  }
}

/**
 * Retrieves a single client story / project by slug from MongoDB Atlas (falls back to static dataset).
 */
export async function getProjectBySlugFromDb(slug: string): Promise<ClientStoryDetail | null> {
  try {
    await ensureProjectsSeeded();
    const db = await getDb();
    if (!db) return getClientStoryBySlug(slug) || null;

    const doc = await db.collection(COLLECTIONS.PROJECTS).findOne({ slug });
    if (!doc) {
      return getClientStoryBySlug(slug) || null;
    }

    if (doc.isActive === false || doc.status === 'draft') {
      return null;
    }

    return mapDocToClientStory(doc, false);
  } catch (err) {
    console.warn('[Projects DB] Failed to fetch project by slug, falling back to static:', err);
    return getClientStoryBySlug(slug) || null;
  }
}

/**
 * Retrieves related client stories prioritizing `relatedSlugs`, then same category, excluding the current slug.
 */
export async function getRelatedProjectsFromDb(
  currentSlug: string,
  limitCount = 3
): Promise<ClientStoryDetail[]> {
  try {
    const all = await getAllProjectsFromDb(true);
    const current = all.find((s) => s.slug === currentSlug);
    const others = all.filter((s) => s.slug !== currentSlug);
    if (!current) return others.slice(0, limitCount);

    const bySlug = new Map(others.map((s) => [s.slug, s]));
    const picked: ClientStoryDetail[] = [];
    const seen = new Set<string>();

    for (const relSlug of current.relatedSlugs || []) {
      const match = bySlug.get(relSlug);
      if (match && !seen.has(match.slug)) {
        seen.add(match.slug);
        picked.push(match);
      }
    }

    if (picked.length < limitCount) {
      const sameCategory = others.filter(
        (s) => !seen.has(s.slug) && s.categorySlug === current.categorySlug
      );
      for (const s of sameCategory) {
        if (picked.length >= limitCount) break;
        seen.add(s.slug);
        picked.push(s);
      }
    }

    if (picked.length < limitCount) {
      for (const s of others) {
        if (picked.length >= limitCount) break;
        if (!seen.has(s.slug)) {
          seen.add(s.slug);
          picked.push(s);
        }
      }
    }

    return picked.slice(0, limitCount);
  } catch {
    return getRelatedClientStories(currentSlug, limitCount);
  }
}

export function mapDocToProjectCategory(
  d: Document | Record<string, unknown>,
  idx = 0
): ClientStoryCategory {
  const rawSlug = typeof d.slug === 'string' ? d.slug.trim() : '';
  const slug = slugifyCategorySlug(rawSlug) || `category-${idx + 1}`;
  const rawName = normalizeBilingualInput(d.name ?? d.label);
  const name = {
    en: rawName.en.trim(),
    ar: rawName.ar.trim(),
  };
  const rawDesc = normalizeBilingualInput(d.description);
  const desc = {
    en: rawDesc.en.trim(),
    ar: rawDesc.ar.trim(),
  };

  return {
    id: (typeof d.id === 'string' && d.id.trim()) || slug,
    slug,
    name: hasAnyBilingualText(name) ? name : { en: slug, ar: slug },
    ...(hasAnyBilingualText(desc) ? { description: desc } : {}),
    order: typeof d.order === 'number' && Number.isFinite(d.order) ? d.order : idx + 1,
    ...(d.createdAt ? { createdAt: new Date(d.createdAt as string | Date).toISOString() } : {}),
    ...(d.updatedAt ? { updatedAt: new Date(d.updatedAt as string | Date).toISOString() } : {}),
  };
}

let categoriesSeedPromise: Promise<void> | null = null;

async function runEnsureProjectCategoriesSeeded(): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    const col = db.collection(COLLECTIONS.PROJECT_CATEGORIES);
    const existingDocs = await col
      .find({})
      .sort({ updatedAt: -1, createdAt: 1 })
      .toArray();

    if (existingDocs.length > 0) {
      const seenSlugs = new Set<string>();
      const duplicateIds: Document['_id'][] = [];

      for (const doc of existingDocs) {
        const slug =
          typeof doc.slug === 'string' ? slugifyCategorySlug(doc.slug) : '';
        if (!slug || slug === 'all' || seenSlugs.has(slug)) {
          duplicateIds.push(doc._id);
          continue;
        }
        seenSlugs.add(slug);
      }

      if (duplicateIds.length > 0) {
        await col.deleteMany({ _id: { $in: duplicateIds } });
        const cleaned = await col
          .find({})
          .sort({ order: 1, createdAt: 1 })
          .toArray();
        if (cleaned.length > 0) {
          await col.bulkWrite(
            cleaned.map((doc, idx) => ({
              updateOne: {
                filter: { _id: doc._id },
                update: { $set: { order: idx + 1 } },
              },
            }))
          );
        }
      }

      await col.createIndex({ slug: 1 }, { unique: true }).catch(() => {});
      return;
    }

    await col.createIndex({ slug: 1 }, { unique: true }).catch(() => {});

    const now = new Date();
    const seededMap = new Map<string, Record<string, unknown>>();

    DEFAULT_CLIENT_STORY_CATEGORIES.forEach((cat, idx) => {
      seededMap.set(cat.slug, {
        id: cat.slug,
        slug: cat.slug,
        name: cat.name,
        order: cat.order ?? idx + 1,
        createdAt: now,
        updatedAt: now,
      });
    });

    const projectDocs = await db
      .collection(COLLECTIONS.PROJECTS)
      .find({}, { projection: { categorySlug: 1, category: 1 } })
      .toArray();

    for (const p of projectDocs) {
      const rawSlug =
        typeof p.categorySlug === 'string'
          ? slugifyCategorySlug(p.categorySlug)
          : '';
      if (!rawSlug || rawSlug === 'all' || seededMap.has(rawSlug)) continue;
      const pName = normalizeBilingualInput(p.category);
      seededMap.set(rawSlug, {
        id: rawSlug,
        slug: rawSlug,
        name: hasAnyBilingualText(pName)
          ? { en: pName.en.trim(), ar: pName.ar.trim() }
          : { en: rawSlug, ar: rawSlug },
        order: seededMap.size + 1,
        createdAt: now,
        updatedAt: now,
      });
    }

    const docs = Array.from(seededMap.values());
    if (docs.length > 0) {
      await col.bulkWrite(
        docs.map((doc) => ({
          updateOne: {
            filter: { slug: doc.slug },
            update: { $setOnInsert: doc },
            upsert: true,
          },
        })),
        { ordered: false }
      );
    }
  } catch (err) {
    console.warn('[ProjectCategories DB] Seed check warning:', err);
  }
}

/**
 * Ensures initial Client Story categories are seeded idempotently in MongoDB Atlas
 * and prevents concurrent request races or duplicate slug entries.
 */
export async function ensureProjectCategoriesSeeded(): Promise<void> {
  if (!categoriesSeedPromise) {
    categoriesSeedPromise = runEnsureProjectCategoriesSeeded().finally(() => {
      categoriesSeedPromise = null;
    });
  }
  return categoriesSeedPromise;
}

/**
 * Fetches ordered Client Story categories from MongoDB Atlas (with default fallback).
 */
export async function getAllProjectCategoriesFromDb(): Promise<ClientStoryCategory[]> {
  try {
    await ensureProjectCategoriesSeeded();
    const db = await getDb();
    if (!db) return DEFAULT_CLIENT_STORY_CATEGORIES;

    const docs = await db
      .collection(COLLECTIONS.PROJECT_CATEGORIES)
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    if (!docs || docs.length === 0) {
      return DEFAULT_CLIENT_STORY_CATEGORIES;
    }

    const seen = new Set<string>();
    const result: ClientStoryCategory[] = [];
    for (const doc of docs) {
      const mapped = mapDocToProjectCategory(doc, result.length);
      if (seen.has(mapped.slug)) continue;
      seen.add(mapped.slug);
      result.push(mapped);
    }
    return result;
  } catch (err) {
    console.warn('[ProjectCategories DB] Failed to fetch from DB, falling back to defaults:', err);
    return DEFAULT_CLIENT_STORY_CATEGORIES;
  }
}

export interface ClientStoryCategoryWithCount extends ClientStoryCategory {
  storyCount: number;
}

/**
 * Fetches all categories along with live story counts across all projects.
 */
export async function getProjectCategoriesWithCounts(): Promise<{
  categories: ClientStoryCategoryWithCount[];
  totalStories: number;
}> {
  const [dbCategories, stories] = await Promise.all([
    getAllProjectCategoriesFromDb(),
    getAllProjectsFromDb(false),
  ]);

  const countsBySlug = new Map<string, number>();
  const sampleLabelBySlug = new Map<string, ClientStoryDetail['category']>();

  for (const s of stories) {
    const slug = slugifyCategorySlug(String(s.categorySlug || ''));
    if (!slug || slug === 'all') continue;
    countsBySlug.set(slug, (countsBySlug.get(slug) || 0) + 1);
    if (!sampleLabelBySlug.has(slug) && s.category) {
      sampleLabelBySlug.set(slug, s.category);
    }
  }

  const seenSlugs = new Set<string>();
  const categories: ClientStoryCategoryWithCount[] = dbCategories.map((cat) => {
    seenSlugs.add(cat.slug);
    return {
      ...cat,
      storyCount: countsBySlug.get(cat.slug) || 0,
    };
  });

  // Include any legacy/ad-hoc categorySlug still used on stories so zero stories are orphaned
  for (const [slug, count] of countsBySlug.entries()) {
    if (seenSlugs.has(slug)) continue;
    const sample = sampleLabelBySlug.get(slug);
    const nameEn = resolveBilingualText(sample, 'en') || slug;
    const nameAr = resolveBilingualText(sample, 'ar') || nameEn;
    categories.push({
      id: slug,
      slug,
      name: { en: nameEn, ar: nameAr },
      order: categories.length + 1,
      storyCount: count,
    });
  }

  return {
    categories,
    totalStories: stories.length,
  };
}

const DETAIL_SPACING_SETTINGS_KEY = 'client_story_detail_spacing';

export function normalizeClientStoryDetailSpacing(
  raw: unknown
): ClientStoryDetailSpacingConfig {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const d = DEFAULT_CLIENT_STORY_DETAIL_SPACING;
  return {
    summarySectionPaddingY: clampNumber(obj.summarySectionPaddingY, 16, 160, d.summarySectionPaddingY),
    summaryTitleGap: clampNumber(obj.summaryTitleGap, 0, 80, d.summaryTitleGap),
    summaryToMetricsGap: clampNumber(obj.summaryToMetricsGap, 8, 120, d.summaryToMetricsGap),
    bodyContainerPaddingY: clampNumber(obj.bodyContainerPaddingY, 16, 160, d.bodyContainerPaddingY),
    sectionToSectionGap: clampNumber(obj.sectionToSectionGap, 16, 200, d.sectionToSectionGap),
    titleToContentGap: clampNumber(obj.titleToContentGap, 0, 100, d.titleToContentGap),
    imageToContentGap: clampNumber(obj.imageToContentGap, 0, 120, d.imageToContentGap),
    paragraphToParagraphGap: clampNumber(obj.paragraphToParagraphGap, 0, 80, d.paragraphToParagraphGap),
    contentToBulletsGap: clampNumber(obj.contentToBulletsGap, 0, 100, d.contentToBulletsGap),
    bulletToBulletGap: clampNumber(obj.bulletToBulletGap, 0, 48, d.bulletToBulletGap),
    contentToCodeGap: clampNumber(obj.contentToCodeGap, 0, 120, d.contentToCodeGap),
    codeToCodeGap: clampNumber(obj.codeToCodeGap, 0, 96, d.codeToCodeGap),
    contentToQuoteGap: clampNumber(obj.contentToQuoteGap, 0, 120, d.contentToQuoteGap),
    deliverablesTopGap: clampNumber(obj.deliverablesTopGap, 12, 160, d.deliverablesTopGap),
    deliverablesTitleToDescGap: clampNumber(
      obj.deliverablesTitleToDescGap,
      0,
      60,
      d.deliverablesTitleToDescGap
    ),
    deliverablesHeaderGap: clampNumber(obj.deliverablesHeaderGap, 8, 120, d.deliverablesHeaderGap),
    showcaseBlockGap: clampNumber(obj.showcaseBlockGap, 12, 140, d.showcaseBlockGap),
  };
}

/**
 * Fetches global Client Story Detail spacing settings from MongoDB Atlas (with defaults fallback).
 */
export async function getClientStoryDetailSpacingFromDb(): Promise<ClientStoryDetailSpacingConfig> {
  try {
    const db = await getDb();
    if (!db) return DEFAULT_CLIENT_STORY_DETAIL_SPACING;

    const doc = await db
      .collection(COLLECTIONS.SETTINGS)
      .findOne({ key: DETAIL_SPACING_SETTINGS_KEY });

    if (!doc || !doc.spacing) {
      return DEFAULT_CLIENT_STORY_DETAIL_SPACING;
    }

    return normalizeClientStoryDetailSpacing(doc.spacing);
  } catch (err) {
    console.warn('[ClientStoryDetailSpacing DB] Failed to fetch spacing config, using defaults:', err);
    return DEFAULT_CLIENT_STORY_DETAIL_SPACING;
  }
}

/**
 * Persists global Client Story Detail spacing settings in MongoDB Atlas.
 */
export async function saveClientStoryDetailSpacingToDb(
  raw: unknown
): Promise<ClientStoryDetailSpacingConfig> {
  const normalized = normalizeClientStoryDetailSpacing(raw);
  const db = await getDb();
  if (!db) {
    throw new Error('Database unavailable');
  }

  await db.collection(COLLECTIONS.SETTINGS).updateOne(
    { key: DETAIL_SPACING_SETTINGS_KEY },
    {
      $set: {
        key: DETAIL_SPACING_SETTINGS_KEY,
        spacing: normalized,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return normalized;
}

/**
 * Resets global Client Story Detail spacing settings back to system defaults.
 */
export async function resetClientStoryDetailSpacingInDb(): Promise<ClientStoryDetailSpacingConfig> {
  const db = await getDb();
  if (!db) {
    throw new Error('Database unavailable');
  }

  await db.collection(COLLECTIONS.SETTINGS).updateOne(
    { key: DETAIL_SPACING_SETTINGS_KEY },
    {
      $set: {
        key: DETAIL_SPACING_SETTINGS_KEY,
        spacing: DEFAULT_CLIENT_STORY_DETAIL_SPACING,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return DEFAULT_CLIENT_STORY_DETAIL_SPACING;
}
