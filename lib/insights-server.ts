import 'server-only';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import {
  insightsData,
  getAllInsights,
  getInsightBySlug,
} from '@/app/[lang]/(site)/insights/_insights/data/insights.data';
import type { InsightDetail } from '@/app/[lang]/(site)/insights/_insights/types';

/**
 * Ensures initial default insight articles are seeded into MongoDB Atlas if collection is empty.
 */
async function ensureInsightsSeeded() {
  try {
    const db = await getDb();
    if (!db) return;

    const count = await db.collection(COLLECTIONS.INSIGHTS).countDocuments();
    if (count === 0 && insightsData.length > 0) {
      const docs = insightsData.map((article) => ({
        ...article,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await db.collection(COLLECTIONS.INSIGHTS).insertMany(docs);
    }
  } catch (err) {
    console.warn('[Insights DB] Seed check warning:', err);
  }
}

/**
 * Retrieves all insight articles from MongoDB Atlas (falls back to static dataset).
 */
export async function getAllInsightsFromDb(onlyActive = true): Promise<InsightDetail[]> {
  try {
    await ensureInsightsSeeded();
    const db = await getDb();
    if (!db) return getAllInsights();

    const query = onlyActive ? { isActive: { $ne: false } } : {};
    const docs = await db.collection(COLLECTIONS.INSIGHTS).find(query).toArray();

    if (!docs || docs.length === 0) {
      return getAllInsights();
    }

    return docs.map((d) => ({
      id: d.id || String(d._id),
      slug: d.slug,
      categorySlug: d.categorySlug || 'article',
      category: d.category || { en: 'Article', ar: 'مقال' },
      title: d.title,
      subtitle: d.subtitle,
      excerpt: d.excerpt,
      readTime: d.readTime || '5 min read',
      date: d.date || new Date(d.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: d.author || {
        name: 'Persici Intelligence',
        role: { en: 'Strategic Advisory', ar: 'الاستشارات الاستراتيجية' },
      },
      tableOfContents: d.tableOfContents || [],
      sections: d.sections || (d.content ? [
        {
          id: 'overview',
          heading: { en: 'Overview', ar: 'نظرة عامة' },
          paragraphs: {
            en: typeof d.content?.en === 'string' ? [d.content.en] : [],
            ar: typeof d.content?.ar === 'string' ? [d.content.ar] : [],
          },
        },
      ] : []),
      coverImage: d.coverImage || '/images/insights/data-into-value-office.jpg',
      featured: Boolean(d.featured),
      aiOverview: d.aiOverview,
    })) as InsightDetail[];
  } catch (err) {
    console.warn('[Insights DB] Failed to fetch from DB, falling back to static:', err);
    return getAllInsights();
  }
}

/**
 * Retrieves a single insight article by slug from MongoDB Atlas (falls back to static dataset).
 */
export async function getInsightBySlugFromDb(slug: string): Promise<InsightDetail | null> {
  try {
    await ensureInsightsSeeded();
    const db = await getDb();
    if (!db) return getInsightBySlug(slug) || null;

    const doc = await db.collection(COLLECTIONS.INSIGHTS).findOne({ slug });
    if (!doc) {
      return getInsightBySlug(slug) || null;
    }

    return {
      id: doc.id || String(doc._id),
      slug: doc.slug,
      categorySlug: doc.categorySlug || 'article',
      category: doc.category || { en: 'Article', ar: 'مقال' },
      title: doc.title,
      subtitle: doc.subtitle,
      excerpt: doc.excerpt,
      readTime: doc.readTime || '5 min read',
      date: doc.date || new Date(doc.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: doc.author || {
        name: 'Persici Intelligence',
        role: { en: 'Strategic Advisory', ar: 'الاستشارات الاستراتيجية' },
      },
      tableOfContents: doc.tableOfContents || [],
      sections: doc.sections || (doc.content ? [
        {
          id: 'overview',
          heading: { en: 'Overview', ar: 'نظرة عامة' },
          paragraphs: {
            en: typeof doc.content?.en === 'string' ? [doc.content.en] : [],
            ar: typeof doc.content?.ar === 'string' ? [doc.content.ar] : [],
          },
        },
      ] : []),
      coverImage: doc.coverImage || '/images/insights/data-into-value-office.jpg',
      featured: Boolean(doc.featured),
      aiOverview: doc.aiOverview,
    } as InsightDetail;
  } catch (err) {
    console.warn('[Insights DB] Failed to fetch insight by slug, falling back to static:', err);
    return getInsightBySlug(slug) || null;
  }
}
