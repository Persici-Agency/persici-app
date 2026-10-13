import 'server-only';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import {
  insightsData,
  getAllInsights,
  getInsightBySlug,
  DEFAULT_INSIGHT_SECTION_VISIBILITY,
} from '@/app/[lang]/(site)/insights/_insights/data/insights.data';
import type {
  InsightDetail,
  InsightSection,
  InsightTocItem,
} from '@/app/[lang]/(site)/insights/_insights/types';

export { DEFAULT_INSIGHT_SECTION_VISIBILITY };

const LEGACY_FAKE_INSIGHT_SLUGS = [
  'scaling-meta-ads-2026',
  'shopify-headless-cro',
  'first-party-data-retention',
];

function pickLocalizedText(
  raw: unknown,
  fallback?: { en: string; ar: string },
  defaultVal: { en: string; ar: string } = { en: '', ar: '' }
): { en: string; ar: string } {
  const fbEn = fallback?.en || defaultVal.en;
  const fbAr = fallback?.ar || defaultVal.ar;

  if (raw && typeof raw === 'object') {
    const obj = raw as { en?: unknown; ar?: unknown };
    const enStr = typeof obj.en === 'string' && obj.en.trim() ? obj.en : fbEn;
    const arStr = typeof obj.ar === 'string' && obj.ar.trim() ? obj.ar : fbAr;
    return { en: enStr, ar: arStr };
  }

  if (typeof raw === 'string' && raw.trim()) {
    return {
      en: raw.trim(),
      ar: fbAr || raw.trim(),
    };
  }

  return { en: fbEn, ar: fbAr };
}

/**
 * Normalizes a MongoDB document into a complete InsightDetail, merging with static canonical fallback
 * when fields are missing so zero existing insight data is ever lost.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDocToInsightDetail(d: Record<string, any>): InsightDetail {
  const slug = String(d.slug || d.id || '');
  const fallback = getInsightBySlug(slug);

  const rawCategorySlug =
    typeof d.categorySlug === 'string' && d.categorySlug.trim()
      ? d.categorySlug.trim()
      : fallback?.categorySlug || 'article';
  const defaultCategoryLabel =
    rawCategorySlug === 'research'
      ? { en: 'Research', ar: 'بحث ودراسة' }
      : { en: 'Article', ar: 'مقال' };

  const normalizedRole = pickLocalizedText(d.author?.role, fallback?.author?.role, {
    en: 'Strategic Advisory',
    ar: 'الاستشارات الاستراتيجية',
  });

  let sections: InsightSection[] = [];
  if (Array.isArray(d.sections) && d.sections.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections = d.sections.map((sec: Record<string, any>, idx: number) => {
      const fbSec = fallback?.sections?.[idx];
      return {
        id: String(sec.id || fbSec?.id || `section-${idx + 1}`),
        heading: pickLocalizedText(sec.heading, fbSec?.heading),
        paragraphs: {
          en:
            Array.isArray(sec.paragraphs?.en) && sec.paragraphs.en.length > 0
              ? sec.paragraphs.en.map(String)
              : typeof sec.paragraphs?.en === 'string' && sec.paragraphs.en.trim()
              ? [sec.paragraphs.en]
              : fbSec?.paragraphs?.en || [],
          ar:
            Array.isArray(sec.paragraphs?.ar) && sec.paragraphs.ar.length > 0
              ? sec.paragraphs.ar.map(String)
              : typeof sec.paragraphs?.ar === 'string' && sec.paragraphs.ar.trim()
              ? [sec.paragraphs.ar]
              : fbSec?.paragraphs?.ar || [],
        },
        ...(sec.callout && (sec.callout.en || sec.callout.ar)
          ? {
              callout: {
                en: String(sec.callout.en ?? ''),
                ar: String(sec.callout.ar ?? ''),
              },
            }
          : fbSec?.callout
          ? { callout: fbSec.callout }
          : {}),
        ...(sec.list &&
        ((Array.isArray(sec.list.en) && sec.list.en.length > 0) ||
          (Array.isArray(sec.list.ar) && sec.list.ar.length > 0))
          ? {
              list: {
                en: Array.isArray(sec.list.en) ? sec.list.en.map(String) : [],
                ar: Array.isArray(sec.list.ar) ? sec.list.ar.map(String) : [],
              },
            }
          : fbSec?.list
          ? { list: fbSec.list }
          : {}),
      };
    });
  } else if (fallback?.sections && fallback.sections.length > 0) {
    sections = fallback.sections;
  } else if (d.content && (d.content.en || d.content.ar)) {
    sections = [
      {
        id: 'overview',
        heading: { en: 'Overview', ar: 'نظرة عامة' },
        paragraphs: {
          en: typeof d.content?.en === 'string' ? [d.content.en] : [],
          ar: typeof d.content?.ar === 'string' ? [d.content.ar] : [],
        },
      },
    ];
  }

  let tableOfContents: InsightTocItem[] = [];
  if (Array.isArray(d.tableOfContents) && d.tableOfContents.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tableOfContents = d.tableOfContents.map((t: Record<string, any>, idx: number) => ({
      id: String(t.id || sections[idx]?.id || `section-${idx + 1}`),
      title: {
        en: String(t.title?.en || sections[idx]?.heading?.en || ''),
        ar: String(t.title?.ar || sections[idx]?.heading?.ar || ''),
      },
    }));
  } else if (
    fallback?.tableOfContents &&
    fallback.tableOfContents.length > 0 &&
    sections === fallback.sections
  ) {
    tableOfContents = fallback.tableOfContents;
  } else if (sections.length > 0) {
    tableOfContents = sections.map((sec) => ({
      id: sec.id,
      title: {
        en: sec.heading.en,
        ar: sec.heading.ar,
      },
    }));
  }

  const rawCoverImage =
    typeof d.coverImage === 'string' &&
    d.coverImage.trim() &&
    d.coverImage !== '/images/insights/cover-pm-slack.webp'
      ? d.coverImage.trim()
      : fallback?.coverImage || '/images/insights/data-into-value-office.jpg';

  const rawAvatar =
    typeof d.author?.avatar === 'string' &&
    d.author.avatar.trim() &&
    d.author.avatar !== '/images/insights/author-1.webp'
      ? d.author.avatar.trim()
      : fallback?.author?.avatar ||
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80';

  return {
    id: String(d.id || d._id || fallback?.id || slug),
    slug,
    categorySlug: rawCategorySlug,
    category: pickLocalizedText(d.category, fallback?.category, defaultCategoryLabel),
    title: pickLocalizedText(d.title, fallback?.title),
    subtitle: pickLocalizedText(
      d.subtitle,
      fallback?.subtitle || fallback?.excerpt
    ),
    excerpt: pickLocalizedText(
      d.excerpt,
      fallback?.excerpt || fallback?.subtitle
    ),
    readTime: String(
      (typeof d.readTime === 'string' && d.readTime.trim()) ||
        fallback?.readTime ||
        '5 min read'
    ),
    date: String(
      (typeof d.date === 'string' && d.date.trim()) ||
        fallback?.date ||
        new Date(d.createdAt || Date.now()).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
    ),
    author: {
      name: String(
        (typeof d.author?.name === 'string' && d.author.name.trim()) ||
          fallback?.author?.name ||
          'Persici Intelligence'
      ),
      role: normalizedRole,
      avatar: rawAvatar,
    },
    tableOfContents,
    sections,
    coverImage: rawCoverImage,
    featured: d.featured !== undefined ? Boolean(d.featured) : Boolean(fallback?.featured),
    isActive: d.isActive !== false,
    aiOverview: d.aiOverview?.summary?.en ? d.aiOverview : fallback?.aiOverview || d.aiOverview,
    sectionVisibility: {
      ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
      ...(fallback?.sectionVisibility || {}),
      ...(d.sectionVisibility || {}),
    },
  };
}

/**
 * Ensures all 9 canonical insight articles from insightsData are seeded into MongoDB Atlas
 * without overwriting any user customizations. Also purges legacy placeholder records and
 * backfills any partial documents lacking sections, cover images, or localized titles.
 */
export async function ensureInsightsSeeded(force = false) {
  try {
    const db = await getDb();
    if (!db) return;

    const collection = db.collection(COLLECTIONS.INSIGHTS);

    // 1. Remove legacy fake placeholder records seeded from old _shared/data.ts
    await collection.deleteMany({ slug: { $in: LEGACY_FAKE_INSIGHT_SLUGS } });

    const existingDocs = await collection.find({}).toArray();
    const existingMap = new Map(existingDocs.map((doc) => [String(doc.slug), doc]));

    for (const article of insightsData) {
      const existing = existingMap.get(article.slug);
      if (!existing) {
        await collection.insertOne({
          ...article,
          isActive: true,
          sectionVisibility: {
            ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
            ...(article.sectionVisibility || {}),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        const needsBackfill =
          force ||
          !Array.isArray(existing.sections) ||
          existing.sections.length === 0 ||
          typeof existing.title !== 'object' ||
          !existing.title?.en ||
          !existing.coverImage ||
          existing.coverImage === '/images/insights/cover-pm-slack.webp' ||
          !existing.author?.name;

        if (needsBackfill) {
          const normalized = mapDocToInsightDetail(existing);
          await collection.updateOne(
            { slug: article.slug },
            {
              $set: {
                categorySlug: normalized.categorySlug,
                category: normalized.category,
                title: normalized.title,
                subtitle: normalized.subtitle,
                excerpt: normalized.excerpt,
                readTime: normalized.readTime,
                date: normalized.date,
                coverImage: normalized.coverImage,
                author: normalized.author,
                sections: normalized.sections,
                tableOfContents: normalized.tableOfContents,
                ...(normalized.aiOverview ? { aiOverview: normalized.aiOverview } : {}),
                sectionVisibility: normalized.sectionVisibility,
                updatedAt: new Date(),
              },
            }
          );
        }
      }
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
    if (!db) {
      return getAllInsights().map((item) => ({
        ...item,
        isActive: item.isActive !== false,
        sectionVisibility: {
          ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
          ...(item.sectionVisibility || {}),
        },
      }));
    }

    const query = onlyActive ? { isActive: { $ne: false } } : {};
    const docs = await db.collection(COLLECTIONS.INSIGHTS).find(query).toArray();

    if (!docs || docs.length === 0) {
      if (!onlyActive) {
        return getAllInsights().map((item) => ({
          ...item,
          isActive: item.isActive !== false,
          sectionVisibility: {
            ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
            ...(item.sectionVisibility || {}),
          },
        }));
      }
      return [];
    }

    return docs.map((d) => mapDocToInsightDetail(d));
  } catch (err) {
    console.warn('[Insights DB] Failed to fetch from DB, falling back to static:', err);
    return getAllInsights().map((item) => ({
      ...item,
      isActive: item.isActive !== false,
      sectionVisibility: {
        ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
        ...(item.sectionVisibility || {}),
      },
    }));
  }
}

/**
 * Retrieves a single insight article by slug from MongoDB Atlas (falls back to static dataset).
 */
export async function getInsightBySlugFromDb(
  slug: string,
  includeInactive = false
): Promise<InsightDetail | null> {
  try {
    await ensureInsightsSeeded();
    const db = await getDb();
    if (!db) {
      const staticItem = getInsightBySlug(slug);
      if (!staticItem) return null;
      return {
        ...staticItem,
        isActive: staticItem.isActive !== false,
        sectionVisibility: {
          ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
          ...(staticItem.sectionVisibility || {}),
        },
      };
    }

    const doc = await db.collection(COLLECTIONS.INSIGHTS).findOne({ slug });
    if (!doc) {
      const staticItem = getInsightBySlug(slug);
      if (!staticItem) return null;
      return {
        ...staticItem,
        isActive: staticItem.isActive !== false,
        sectionVisibility: {
          ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
          ...(staticItem.sectionVisibility || {}),
        },
      };
    }

    if (!includeInactive && doc.isActive === false) {
      return null;
    }

    return mapDocToInsightDetail(doc);
  } catch (err) {
    console.warn('[Insights DB] Failed to fetch insight by slug, falling back to static:', err);
    const staticItem = getInsightBySlug(slug);
    if (!staticItem) return null;
    return {
      ...staticItem,
      isActive: staticItem.isActive !== false,
      sectionVisibility: {
        ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
        ...(staticItem.sectionVisibility || {}),
      },
    };
  }
}

