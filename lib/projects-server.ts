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
  return {
    id: d.id || String(d._id),
    slug: d.slug,
    templateType: d.templateType || fallback?.templateType || 'marketing-video-showcase',
    category: d.category || fallback?.category || { en: 'Growth & Multi-Channel', ar: 'الحملات ونمو العلامة' },
    categorySlug: d.categorySlug || fallback?.categorySlug || 'marketing',
    featured: Boolean(d.featured !== undefined ? d.featured : fallback?.featured),
    featuredOrder: d.featuredOrder ?? fallback?.featuredOrder ?? 1,
    title: d.title || fallback?.title || { en: '', ar: '' },
    leadSubtitle: d.leadSubtitle || d.subtitle || fallback?.leadSubtitle || { en: '', ar: '' },
    executiveSummary: d.executiveSummary || d.summary || fallback?.executiveSummary || { en: '', ar: '' },
    client: d.client || fallback?.client || 'Persici Enterprise Partner',
    topic: d.topic || fallback?.topic || { en: 'Brand Transformation', ar: 'تحول العلامة التجارية' },
    services: d.services || fallback?.services || [],
    region: d.region || fallback?.region || { en: 'GCC & MENA', ar: 'الخليج والشرق الأوسط' },
    date: d.date || fallback?.date || '2025',
    link: d.link || fallback?.link,
    heroImage: d.heroImage || d.featuredImage || fallback?.heroImage || '/images/hero/hero-poster.webp',
    heroVideo: d.heroVideo || d.videoUrl || fallback?.heroVideo,
    heroVideoPoster: d.heroVideoPoster || fallback?.heroVideoPoster,
    metrics: d.metrics && d.metrics.length > 0 ? d.metrics : (fallback?.metrics || []),

    // Core Narrative Sections
    intro: d.intro || fallback?.intro || {
      id: 'intro',
      title: { en: 'Project Overview', ar: 'نظرة عامة على المشروع' },
      paragraphs: [{ en: d.executiveSummary?.en || d.summary?.en || '', ar: d.executiveSummary?.ar || d.summary?.ar || '' }],
    },
    problem: d.problem || fallback?.problem || {
      id: 'the-problem',
      title: { en: 'The Challenge', ar: 'التحدي والمشكلة' },
      paragraphs: [{ en: d.challenge?.en || '', ar: d.challenge?.ar || '' }],
    },
    solution: d.solution && typeof d.solution === 'object' && 'title' in d.solution
      ? d.solution
      : fallback?.solution || {
          id: 'the-solution',
          title: { en: 'The Solution', ar: 'الحل والنهج المتبع' },
          paragraphs: [{ en: typeof d.solution === 'object' && 'en' in d.solution ? d.solution.en : '', ar: typeof d.solution === 'object' && 'ar' in d.solution ? d.solution.ar : '' }],
        },
    impact: d.impact || fallback?.impact || {
      id: 'the-impact',
      title: { en: 'The Impact', ar: 'الأثر والنتائج' },
      paragraphs: [{ en: d.results?.en || '', ar: d.results?.ar || '' }],
    },

    // Adaptive Media Showcase
    mediaShowcase: d.mediaShowcase || fallback?.mediaShowcase || {
      title: { en: 'Deliverables & Production', ar: 'معرض المخرجات والإنتاج' },
      description: { en: '', ar: '' },
    },

    relatedSlugs: d.relatedSlugs || fallback?.relatedSlugs || [],
  };
}

/**
 * Ensures initial default client stories are seeded into MongoDB Atlas if collection is empty.
 */
export async function ensureProjectsSeeded(force = false) {
  try {
    const db = await getDb();
    if (!db) return;

    const count = await db.collection(COLLECTIONS.PROJECTS).countDocuments();
    if ((count === 0 || force) && clientStoriesData.length > 0) {
      if (force && count > 0) {
        await db.collection(COLLECTIONS.PROJECTS).deleteMany({});
      }
      const docs = clientStoriesData.map((project) => ({
        ...project,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await db.collection(COLLECTIONS.PROJECTS).insertMany(docs);
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
