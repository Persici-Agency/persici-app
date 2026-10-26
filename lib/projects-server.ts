import 'server-only';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import {
  clientStoriesData,
  getAllClientStories,
  getClientStoryBySlug,
  getRelatedClientStories,
} from '@/app/[lang]/(site)/client-stories/_client-stories/data/client-stories.data';
import type { ClientStoryDetail } from '@/app/[lang]/(site)/client-stories/_client-stories/types';

import type { Document } from 'mongodb';

/**
 * Maps raw MongoDB document to fully typed ClientStoryDetail with fallbacks.
 */
function mapDocToClientStory(d: Document | Record<string, unknown>): ClientStoryDetail {
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

  const mediaShowcase = (d.mediaShowcase && typeof d.mediaShowcase === 'object')
    ? (d.mediaShowcase as unknown as ClientStoryDetail['mediaShowcase'])
    : (fallback?.mediaShowcase || {
        title: { en: 'Deliverables & Production', ar: 'معرض المخرجات والإنتاج' },
        description: { en: '', ar: '' },
      });

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
    client: (d.client as string) || fallback?.client || 'Persici Enterprise Partner',
    topic,
    services: Array.isArray(d.services) ? (d.services as ClientStoryDetail['services']) : (fallback?.services || []),
    region,
    date: (d.date as string) || fallback?.date || '2025',
    link: (d.link as string) || fallback?.link,
    heroImage: (d.heroImage as string) || (d.featuredImage as string) || fallback?.heroImage || '/images/hero/hero-poster.webp',
    heroVideo: (d.heroVideo as string) || (d.videoUrl as string) || fallback?.heroVideo,
    heroVideoPoster: (d.heroVideoPoster as string) || fallback?.heroVideoPoster,
    metrics: metrics as ClientStoryDetail['metrics'],
    intro,
    problem,
    solution,
    impact,
    mediaShowcase,
    relatedSlugs: Array.isArray(d.relatedSlugs) ? (d.relatedSlugs as string[]) : (fallback?.relatedSlugs || []),
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

    const query = onlyActive ? { isActive: { $ne: false } } : {};
    const docs = await db.collection(COLLECTIONS.PROJECTS).find(query).toArray();

    if (!docs || docs.length === 0) {
      return getAllClientStories();
    }

    return docs.map(mapDocToClientStory);
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

    return mapDocToClientStory(doc);
  } catch (err) {
    console.warn('[Projects DB] Failed to fetch project by slug, falling back to static:', err);
    return getClientStoryBySlug(slug) || null;
  }
}

/**
 * Retrieves related client stories excluding the current slug.
 */
export async function getRelatedProjectsFromDb(
  currentSlug: string,
  limitCount = 3
): Promise<ClientStoryDetail[]> {
  try {
    const all = await getAllProjectsFromDb(true);
    const filtered = all.filter((s) => s.slug !== currentSlug);
    return filtered.slice(0, limitCount);
  } catch {
    return getRelatedClientStories(currentSlug, limitCount);
  }
}
