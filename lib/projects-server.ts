import 'server-only';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import {
  clientStoriesData,
  getAllClientStories,
  getClientStoryBySlug,
  getRelatedClientStories,
} from '@/app/[lang]/(site)/client-stories/_client-stories/data/client-stories.data';
import type { ClientStoryDetail } from '@/app/[lang]/(site)/client-stories/_client-stories/types';

/**
 * Ensures initial default client stories are seeded into MongoDB Atlas if collection is empty.
 */
async function ensureProjectsSeeded() {
  try {
    const db = await getDb();
    if (!db) return;

    const count = await db.collection(COLLECTIONS.PROJECTS).countDocuments();
    if (count === 0 && clientStoriesData.length > 0) {
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

    return docs.map((d) => ({
      id: d.id || String(d._id),
      slug: d.slug,
      templateType: d.templateType || 'marketing-video-showcase',
      category: d.category || { en: 'Growth & Multi-Channel', ar: 'الحملات ونمو العلامة' },
      categorySlug: d.categorySlug || 'marketing',
      featured: Boolean(d.featured),
      featuredOrder: d.featuredOrder || 1,
      title: d.title,
      leadSubtitle: d.leadSubtitle || d.subtitle || { en: '', ar: '' },
      executiveSummary: d.executiveSummary || d.summary || { en: '', ar: '' },
      client: d.client || 'Persici Enterprise Partner',
      topic: d.topic || { en: 'Brand Transformation', ar: 'تحول العلامة التجارية' },
      services: d.services || [],
      region: d.region || { en: 'GCC & MENA', ar: 'الخليج والشرق الأوسط' },
      date: d.date || '2025',
      heroImage: d.heroImage || d.featuredImage || '/images/hero/hero-poster.webp',
      heroVideo: d.heroVideo || d.videoUrl,
      metrics: d.metrics || [],
      challenge: d.challenge || { en: '', ar: '' },
      solution: d.solution || { en: '', ar: '' },
      results: d.results || { en: '', ar: '' },
      testimonial: d.testimonial,
    })) as unknown as ClientStoryDetail[];
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

    return {
      id: doc.id || String(doc._id),
      slug: doc.slug,
      templateType: doc.templateType || 'marketing-video-showcase',
      category: doc.category || { en: 'Growth & Multi-Channel', ar: 'الحملات ونمو العلامة' },
      categorySlug: doc.categorySlug || 'marketing',
      featured: Boolean(doc.featured),
      featuredOrder: doc.featuredOrder || 1,
      title: doc.title,
      leadSubtitle: doc.leadSubtitle || doc.subtitle || { en: '', ar: '' },
      executiveSummary: doc.executiveSummary || doc.summary || { en: '', ar: '' },
      client: doc.client || 'Persici Enterprise Partner',
      topic: doc.topic || { en: 'Brand Transformation', ar: 'تحول العلامة التجارية' },
      services: doc.services || [],
      region: doc.region || { en: 'GCC & MENA', ar: 'الخليج والشرق الأوسط' },
      date: doc.date || '2025',
      heroImage: doc.heroImage || doc.featuredImage || '/images/hero/hero-poster.webp',
      heroVideo: doc.heroVideo || doc.videoUrl,
      metrics: doc.metrics || [],
      challenge: doc.challenge || { en: '', ar: '' },
      solution: doc.solution || { en: '', ar: '' },
      results: doc.results || { en: '', ar: '' },
      testimonial: doc.testimonial,
    } as unknown as ClientStoryDetail;
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
