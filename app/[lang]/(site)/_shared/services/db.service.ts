import 'server-only';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import {
  homePageContent,
  servicesPageContent,
  workPageContent,
  solutionsOfferingsList,
  industriesOfferingsList,
  howWeDoItOfferingsList,
  projectsList,
  servicesList,
  insightsArticles,
  clientLogos,
  reviewsList,
  defaultSharedContactData,
} from '@shared/data';
import { aboutPageData, type AboutPageData } from '@/app/[lang]/(site)/about/_about/data/about.data';
import { contactPageData, type ContactPageData } from '@/app/[lang]/(site)/contact/_contact/data/contact.data';
import { clientStoriesHubPageData } from '@/app/[lang]/(site)/client-stories/_client-stories/data/client-stories.data';
import type { ClientStoriesHubPageData } from '@/app/[lang]/(site)/client-stories/_client-stories/types';
import { careersHubData, type CareersHubData } from '@/app/[lang]/(site)/careers/_careers/data/careers.data';
import { insightsHubPageData } from '@/app/[lang]/(site)/insights/_insights/data/insights.data';
import type { InsightsHubPageData, InsightDetail } from '@/app/[lang]/(site)/insights/_insights/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { getAllProjectsFromDb } from '@/lib/projects-server';
import { getAllInsightsFromDb } from '@/lib/insights-server';
import {
  clientStoryToFeaturedItem,
  getSolutionsOverviewFeaturedClientStories,
} from '@shared/data/featured-client-stories.data';
import {
  SOLUTION_FEATURE_SLUGS,
  isSolutionPageSlug,
  extractSolutionFeatureSlug,
  defaultSolutionsHubCmsData,
  getDefaultSolutionFeatureCmsData,
  normalizeSolutionsHubPageData,
  normalizeSolutionFeaturePageData,
  type SolutionsHubCmsData,
  type SolutionFeatureCmsData,
  type SolutionClientStoriesSectionConfig,
  type SolutionInsightsSectionConfig,
} from '@/app/[lang]/(site)/solutions/_solutions/data/solutions-cms.data';
import {
  INDUSTRY_FEATURE_SLUGS,
  isIndustryPageSlug,
  extractIndustryFeatureSlug,
  defaultIndustriesHubCmsData,
  getDefaultIndustryFeatureCmsData,
  normalizeIndustriesHubPageData,
  normalizeIndustryFeaturePageData,
  type IndustriesHubCmsData,
  type IndustryFeatureCmsData,
  type IndustryClientStoriesSectionConfig,
  type IndustryInsightsSectionConfig,
} from '@/app/[lang]/(site)/industries/_industries/data/industries-cms.data';
import {
  HOW_WE_DO_IT_FEATURE_SLUGS,
  isHowWeDoItPageSlug,
  extractHowWeDoItFeatureSlug,
  defaultHowWeDoItHubCmsData,
  getDefaultHowWeDoItFeatureCmsData,
  normalizeHowWeDoItHubPageData,
  normalizeHowWeDoItFeaturePageData,
  type HowWeDoItHubCmsData,
  type HowWeDoItFeatureCmsData,
  type HowWeDoItClientStoriesSectionConfig,
  type HowWeDoItInsightsSectionConfig,
  type HowWeDoItFeatureSlug,
} from '@/app/[lang]/(site)/how-we-do-it/_how-we-do-it/data/how-we-do-it-cms.data';
export type {
  ContactPageData,
  ClientStoriesHubPageData,
  CareersHubData,
  InsightsHubPageData,
  SolutionsHubCmsData,
  SolutionFeatureCmsData,
  SolutionClientStoriesSectionConfig,
  SolutionInsightsSectionConfig,
  IndustriesHubCmsData,
  IndustryFeatureCmsData,
  IndustryClientStoriesSectionConfig,
  IndustryInsightsSectionConfig,
  HowWeDoItHubCmsData,
  HowWeDoItFeatureCmsData,
  HowWeDoItClientStoriesSectionConfig,
  HowWeDoItInsightsSectionConfig,
  HowWeDoItFeatureSlug,
};
export {
  SOLUTION_FEATURE_SLUGS,
  isSolutionPageSlug,
  extractSolutionFeatureSlug,
  normalizeSolutionsHubPageData,
  normalizeSolutionFeaturePageData,
  INDUSTRY_FEATURE_SLUGS,
  isIndustryPageSlug,
  extractIndustryFeatureSlug,
  normalizeIndustriesHubPageData,
  normalizeIndustryFeaturePageData,
  HOW_WE_DO_IT_FEATURE_SLUGS,
  isHowWeDoItPageSlug,
  extractHowWeDoItFeatureSlug,
  normalizeHowWeDoItHubPageData,
  normalizeHowWeDoItFeaturePageData,
};
import type {
  SharedContactContent,
  HomePageContent,
  ServicesPageContent,
  WorkPageContent,
  SolutionOfferingItem,
  FeaturedClientStoryItem,
  IndustriesPageContent,
  IndustryOfferingItem,
  HowWeDoItPageContent,
  HowWeDoItOfferingItem,
  ProjectItem,
  ServiceItem,
  InsightArticle,
  ClientLogo,
  ReviewItem,
  ContactFormData,
  ContactSubmission,
  DiscoveryFormData,
  DiscoverySubmission,
  AppointmentFormData,
  AppointmentSubmission,
  JobApplicationFormData,
  JobApplicationSubmission,
} from '@shared/types';

/**
 * Generic page content fetcher.
 * Queries MongoDB collection 'page_contents'; falls back to static dataset if MongoDB is unconfigured or unreachable.
 */
export async function getPageContent<T>(pageSlug: string, fallbackData: T): Promise<T> {
  try {
    const db = await getDb();
    if (!db) return fallbackData;

    const doc = await db.collection(COLLECTIONS.PAGES).findOne({ page: pageSlug });
    if (!doc) return fallbackData;

    // Remove MongoDB _id before returning to avoid serialization issues
    const { _id, ...rest } = doc;
    return { ...fallbackData, ...rest, id: _id?.toString() } as unknown as T;
  } catch (err) {
    console.warn(`[db.service] getPageContent failed for ${pageSlug}, using fallback.`, err);
    return fallbackData;
  }
}

/**
 * Updates or creates page content in MongoDB.
 */
export async function updatePageContent<T extends object>(
  pageSlug: string,
  content: Partial<T>
): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    await db.collection(COLLECTIONS.PAGES).updateOne(
      { page: pageSlug },
      {
        $set: {
          ...content,
          page: pageSlug,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    return true;
  } catch (err) {
    console.error(`[db.service] updatePageContent failed for ${pageSlug}:`, err);
    return false;
  }
}

export async function getHomePageData(): Promise<HomePageContent> {
  return getPageContent<HomePageContent>('home', homePageContent);
}

export async function getServicesPageData(): Promise<ServicesPageContent> {
  return getPageContent<ServicesPageContent>('services', servicesPageContent);
}

export async function getWorkPageData(): Promise<WorkPageContent> {
  return getPageContent<WorkPageContent>('work', workPageContent);
}

export function normalizeClientStoriesPageData(
  raw?: Partial<ClientStoriesHubPageData> | null
): ClientStoriesHubPageData {
  const src = raw || {};
  const defaultCategories = clientStoriesHubPageData.allStoriesSection.categories;
  const hasValidCategories =
    Array.isArray(src.allStoriesSection?.categories) &&
    src.allStoriesSection!.categories.length > 0 &&
    typeof src.allStoriesSection!.categories[0]?.label === 'object';

  return {
    ...clientStoriesHubPageData,
    ...src,
    hero: {
      ...clientStoriesHubPageData.hero,
      ...(src.hero || {}),
      badge: { ...clientStoriesHubPageData.hero.badge, ...(src.hero?.badge || {}) },
      title: { ...clientStoriesHubPageData.hero.title, ...(src.hero?.title || {}) },
      titleHighlight: {
        ...clientStoriesHubPageData.hero.titleHighlight,
        ...(src.hero?.titleHighlight || {}),
      },
      subtitle: { ...clientStoriesHubPageData.hero.subtitle, ...(src.hero?.subtitle || {}) },
      primaryCtaLabel: {
        ...clientStoriesHubPageData.hero.primaryCtaLabel,
        ...(src.hero?.primaryCtaLabel || {}),
      },
      primaryCtaHref: src.hero?.primaryCtaHref || clientStoriesHubPageData.hero.primaryCtaHref,
      secondaryCtaLabel: {
        ...clientStoriesHubPageData.hero.secondaryCtaLabel,
        ...(src.hero?.secondaryCtaLabel || {}),
      },
      secondaryCtaHref: src.hero?.secondaryCtaHref || clientStoriesHubPageData.hero.secondaryCtaHref,
    },
    featuredSection: {
      ...clientStoriesHubPageData.featuredSection,
      ...(src.featuredSection || {}),
      badge: {
        ...clientStoriesHubPageData.featuredSection.badge,
        ...(src.featuredSection?.badge || {}),
      },
      title: {
        ...clientStoriesHubPageData.featuredSection.title,
        ...(src.featuredSection?.title || {}),
      },
      subtitle: {
        ...clientStoriesHubPageData.featuredSection.subtitle,
        ...(src.featuredSection?.subtitle || {}),
      },
      ctaLabel: {
        ...clientStoriesHubPageData.featuredSection.ctaLabel,
        ...(src.featuredSection?.ctaLabel || {}),
      },
    },
    allStoriesSection: {
      ...clientStoriesHubPageData.allStoriesSection,
      ...(src.allStoriesSection || {}),
      badge: {
        ...clientStoriesHubPageData.allStoriesSection.badge,
        ...(src.allStoriesSection?.badge || {}),
      },
      title: {
        ...clientStoriesHubPageData.allStoriesSection.title,
        ...(src.allStoriesSection?.title || {}),
      },
      subtitle: {
        ...clientStoriesHubPageData.allStoriesSection.subtitle,
        ...(src.allStoriesSection?.subtitle || {}),
      },
      emptyTitle: {
        ...clientStoriesHubPageData.allStoriesSection.emptyTitle,
        ...(src.allStoriesSection?.emptyTitle || {}),
      },
      emptySubtitle: {
        ...clientStoriesHubPageData.allStoriesSection.emptySubtitle,
        ...(src.allStoriesSection?.emptySubtitle || {}),
      },
      categories: hasValidCategories
        ? src.allStoriesSection!.categories.map((cat, idx) => {
            const defCat = defaultCategories[idx] || defaultCategories[0];
            return {
              ...defCat,
              ...cat,
              label: {
                ...(defCat?.label || { en: '', ar: '' }),
                ...(cat?.label || {}),
              },
            };
          })
        : defaultCategories,
    },
  };
}

export async function getClientStoriesPageData(): Promise<ClientStoriesHubPageData> {
  const raw = await getPageContent<ClientStoriesHubPageData>(
    'client-stories',
    clientStoriesHubPageData
  );
  return normalizeClientStoriesPageData(raw);
}

export function normalizeContactPageData(raw?: Partial<ContactPageData> | null): ContactPageData {
  const src = raw || {};
  const defaultQuickLinks = contactPageData.hero.quickLinks || [];
  const defaultOfficesBadge = contactPageData.officesBadge || {
    en: 'Global Presence',
    ar: 'حضور استراتيجي عالمي',
  };
  const defaultChannelsBadge = contactPageData.channelsBadge || {
    en: 'Direct Inquiries',
    ar: 'قنوات تواصل سريعة ومباشرة',
  };

  const hasValidOffices =
    Array.isArray(src.offices) &&
    src.offices.length > 0 &&
    typeof src.offices[0]?.city === 'object' &&
    Boolean(src.offices[0]?.country);

  const hasValidChannels =
    Array.isArray(src.channels) &&
    src.channels.length > 0 &&
    typeof src.channels[0]?.title === 'object';

  const hasValidFaqs =
    Array.isArray(src.faqs) &&
    src.faqs.length > 0 &&
    typeof src.faqs[0]?.question === 'object';

  return {
    ...contactPageData,
    ...src,
    hero: {
      ...contactPageData.hero,
      ...(src.hero || {}),
      badge: { ...contactPageData.hero.badge, ...(src.hero?.badge || {}) },
      title: { ...contactPageData.hero.title, ...(src.hero?.title || {}) },
      subtitle: { ...contactPageData.hero.subtitle, ...(src.hero?.subtitle || {}) },
      quickLinks:
        Array.isArray(src.hero?.quickLinks) && src.hero.quickLinks.length > 0
          ? src.hero.quickLinks.map((ql, idx) => ({
              ...(defaultQuickLinks[idx] || defaultQuickLinks[0] || { id: `ql-${idx + 1}`, href: '#contact-form', enabled: true }),
              ...ql,
              label: {
                ...(defaultQuickLinks[idx]?.label || { en: '', ar: '' }),
                ...(ql?.label || {}),
              },
              enabled: ql?.enabled !== false,
            }))
          : defaultQuickLinks,
    },
    officesBadge: {
      ...defaultOfficesBadge,
      ...(src.officesBadge || {}),
    },
    officesTitle: {
      ...contactPageData.officesTitle,
      ...(src.officesTitle || {}),
    },
    officesSubtitle: {
      ...contactPageData.officesSubtitle,
      ...(src.officesSubtitle || {}),
    },
    offices: hasValidOffices
      ? src.offices!.map((off, idx) => {
          const defOff = contactPageData.offices[idx] || contactPageData.offices[0];
          return {
            ...defOff,
            ...off,
            city: { ...(defOff?.city || { en: '', ar: '' }), ...(off?.city || {}) },
            country: { ...(defOff?.country || { en: '', ar: '' }), ...(off?.country || {}) },
            badge: { ...(defOff?.badge || { en: '', ar: '' }), ...(off?.badge || {}) },
            address: { ...(defOff?.address || { en: '', ar: '' }), ...(off?.address || {}) },
            hours: { ...(defOff?.hours || { en: '', ar: '' }), ...(off?.hours || {}) },
            directionsLabel: {
              ...(defOff?.directionsLabel || { en: 'Get Directions', ar: 'الاتجاهات عبر خرائط جوجل' }),
              ...(off?.directionsLabel || {}),
            },
          };
        })
      : contactPageData.offices,
    channelsBadge: {
      ...defaultChannelsBadge,
      ...(src.channelsBadge || {}),
    },
    channelsTitle: {
      ...contactPageData.channelsTitle,
      ...(src.channelsTitle || {}),
    },
    channelsSubtitle: {
      ...contactPageData.channelsSubtitle,
      ...(src.channelsSubtitle || {}),
    },
    channels: hasValidChannels
      ? src.channels!.map((ch, idx) => {
          const defCh = contactPageData.channels[idx] || contactPageData.channels[0];
          return {
            ...defCh,
            ...ch,
            category: { ...(defCh?.category || { en: '', ar: '' }), ...(ch?.category || {}) },
            title: { ...(defCh?.title || { en: '', ar: '' }), ...(ch?.title || {}) },
            description: { ...(defCh?.description || { en: '', ar: '' }), ...(ch?.description || {}) },
            sla: { ...(defCh?.sla || { en: '', ar: '' }), ...(ch?.sla || {}) },
          };
        })
      : contactPageData.channels,
    faqsTitle: {
      ...contactPageData.faqsTitle,
      ...(src.faqsTitle || {}),
    },
    faqsSubtitle: {
      ...contactPageData.faqsSubtitle,
      ...(src.faqsSubtitle || {}),
    },
    faqs: hasValidFaqs
      ? src.faqs!.map((fq, idx) => {
          const defFq = contactPageData.faqs[idx] || contactPageData.faqs[0];
          return {
            ...defFq,
            ...fq,
            question: { ...(defFq?.question || { en: '', ar: '' }), ...(fq?.question || {}) },
            answer: { ...(defFq?.answer || { en: '', ar: '' }), ...(fq?.answer || {}) },
          };
        })
      : contactPageData.faqs,
  };
}

export async function getContactPageData(): Promise<ContactPageData> {
  const raw = await getPageContent<ContactPageData>('contact', contactPageData);
  return normalizeContactPageData(raw);
}

export async function getSharedContactData(): Promise<SharedContactContent> {
  return getPageContent<SharedContactContent>('shared-contact', defaultSharedContactData);
}

export function insightDetailToInsightItem(detail: InsightDetail): ContentCardItem {
  return {
    id: detail.slug || detail.id,
    slug: detail.slug,
    category: detail.category || { en: 'Article', ar: 'مقال' },
    badge: detail.category || { en: 'Article', ar: 'مقال' },
    title: detail.title,
    excerpt: detail.excerpt || detail.subtitle || { en: '', ar: '' },
    date: detail.date || { en: '2026', ar: '٢٠٢٦' },
    image:
      detail.coverImage ||
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1000&q=85',
    href: `/insights/${detail.slug}`,
  };
}

export async function resolveSolutionClientStories(
  config: SolutionClientStoriesSectionConfig | undefined,
  fallbackStories: FeaturedClientStoryItem[]
): Promise<FeaturedClientStoryItem[]> {
  const maxCount = Math.max(1, Math.min(24, Number(config?.maxCount) || fallbackStories.length || 4));
  const mode = config?.selectionMode || 'custom';

  try {
    const allProjects = await getAllProjectsFromDb(true);
    if (!allProjects || allProjects.length === 0) {
      return fallbackStories.slice(0, maxCount);
    }

    if (mode === 'featured') {
      const featuredProjects = [...allProjects]
        .filter((p) => p.featured)
        .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
      const pool = featuredProjects.length > 0 ? featuredProjects : allProjects;
      return pool.slice(0, maxCount).map(clientStoryToFeaturedItem);
    }

    if (mode === 'category') {
      const rawCat =
        config?.categorySlug ||
        (config as unknown as { selectedCategory?: string })?.selectedCategory ||
        'all';
      const catSlug = rawCat.trim().toLowerCase();
      const filtered =
        catSlug === 'all' || !catSlug
          ? allProjects
          : allProjects.filter(
              (p) =>
                p.categorySlug?.toLowerCase() === catSlug ||
                p.category?.en?.toLowerCase() === catSlug
            );
      const pool = filtered.length > 0 ? filtered : allProjects;
      return pool.slice(0, maxCount).map(clientStoryToFeaturedItem);
    }

    // 'custom' mode
    const selectedSlugs = Array.isArray(config?.selectedSlugs) ? config!.selectedSlugs : [];
    if (selectedSlugs.length > 0) {
      const resolved: FeaturedClientStoryItem[] = [];
      for (const slug of selectedSlugs) {
        const dbMatch = allProjects.find((p) => p.slug === slug || p.id === slug);
        if (dbMatch) {
          resolved.push(clientStoryToFeaturedItem(dbMatch));
          continue;
        }
        const fbMatch = fallbackStories.find((s) => s.slug === slug || s.id === slug);
        if (fbMatch) {
          resolved.push(fbMatch);
        }
      }
      if (resolved.length > 0) {
        return resolved.slice(0, maxCount);
      }
    }

    return fallbackStories.slice(0, maxCount);
  } catch (err) {
    console.warn('[db.service] resolveSolutionClientStories fallback:', err);
    return fallbackStories.slice(0, maxCount);
  }
}

export async function resolveSolutionInsights(
  config: SolutionInsightsSectionConfig | undefined,
  fallbackInsights: ContentCardItem[]
): Promise<ContentCardItem[]> {
  const maxCount = Math.max(1, Math.min(24, Number(config?.maxCount) || fallbackInsights.length || 3));
  const mode = config?.selectionMode || 'custom';

  try {
    const allInsights = await getAllInsightsFromDb(true);

    if (mode === 'featured') {
      if (!allInsights || allInsights.length === 0) {
        return fallbackInsights.slice(0, maxCount);
      }
      const featuredList = allInsights.filter((ins) => ins.featured);
      const pool = featuredList.length > 0 ? featuredList : allInsights;
      return pool.slice(0, maxCount).map(insightDetailToInsightItem);
    }

    if (mode === 'category') {
      if (!allInsights || allInsights.length === 0) {
        return fallbackInsights.slice(0, maxCount);
      }
      const rawCat =
        config?.categorySlug ||
        (config as unknown as { selectedCategory?: string })?.selectedCategory ||
        'all';
      const catSlug = rawCat.trim().toLowerCase();
      const filtered =
        catSlug === 'all' || !catSlug
          ? allInsights
          : allInsights.filter(
              (ins) =>
                ins.categorySlug?.toLowerCase() === catSlug ||
                ins.category?.en?.toLowerCase() === catSlug
            );
      const pool = filtered.length > 0 ? filtered : allInsights;
      return pool.slice(0, maxCount).map(insightDetailToInsightItem);
    }

    // 'custom' mode
    const selectedSlugs = Array.isArray(config?.selectedSlugs) ? config!.selectedSlugs : [];
    if (selectedSlugs.length > 0) {
      const resolved: ContentCardItem[] = [];
      for (const slug of selectedSlugs) {
        const dbMatch = allInsights?.find((ins) => ins.slug === slug || ins.id === slug);
        if (dbMatch) {
          resolved.push(insightDetailToInsightItem(dbMatch));
          continue;
        }
        const fbMatch = fallbackInsights.find(
          (ins) =>
            ins.slug === slug ||
            ins.id === slug ||
            ins.href === `/insights/${slug}` ||
            ins.href?.endsWith(`/${slug}`)
        );
        if (fbMatch) {
          resolved.push(fbMatch);
        }
      }
      if (resolved.length > 0) {
        return resolved.slice(0, maxCount);
      }
    }

    return fallbackInsights.slice(0, maxCount);
  } catch (err) {
    console.warn('[db.service] resolveSolutionInsights fallback:', err);
    return fallbackInsights.slice(0, maxCount);
  }
}

export async function getSolutionsPageData(): Promise<SolutionsHubCmsData> {
  try {
    const db = await getDb();
    let doc: Record<string, unknown> | null = null;
    if (db) {
      doc = (await db.collection(COLLECTIONS.PAGES).findOne({ page: 'solutions' })) as Record<
        string,
        unknown
      > | null;
    }

    const normalized = normalizeSolutionsHubPageData(doc as Partial<SolutionsHubCmsData> | null);

    // Ensure complete normalized document is persisted in MongoDB if missing or lacking new CMS fields
    if (
      db &&
      (!doc ||
        !doc.heroTitle ||
        !doc.clientStoriesConfig ||
        !doc.insightsConfig ||
        !Array.isArray(doc.faqs) ||
        doc.faqs.length === 0)
    ) {
      await db.collection(COLLECTIONS.PAGES).updateOne(
        { page: 'solutions' },
        {
          $set: {
            ...normalized,
            page: 'solutions',
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    const fallbackHubStories =
      normalized.spotlightStories && normalized.spotlightStories.length > 0
        ? normalized.spotlightStories
        : getSolutionsOverviewFeaturedClientStories();

    const [resolvedStories, resolvedInsights] = await Promise.all([
      resolveSolutionClientStories(normalized.clientStoriesConfig, fallbackHubStories),
      resolveSolutionInsights(normalized.insightsConfig, normalized.insightsList),
    ]);

    return {
      ...normalized,
      spotlightStories: resolvedStories,
      insightsList: resolvedInsights,
    };
  } catch (err) {
    console.warn('[db.service] getSolutionsPageData fallback:', err);
    return normalizeSolutionsHubPageData(defaultSolutionsHubCmsData);
  }
}

export async function getSolutionFeaturePageData(
  slugOrPage: string
): Promise<SolutionFeatureCmsData> {
  const featureSlug = extractSolutionFeatureSlug(slugOrPage) || 'application-management';
  const pageKey = `solutions-${featureSlug}`;
  const defaultData = getDefaultSolutionFeatureCmsData(featureSlug);

  try {
    const db = await getDb();
    let doc: Record<string, unknown> | null = null;
    if (db) {
      doc = (await db.collection(COLLECTIONS.PAGES).findOne({ page: pageKey })) as Record<
        string,
        unknown
      > | null;
    }

    const normalized = normalizeSolutionFeaturePageData(
      featureSlug,
      doc as Partial<SolutionFeatureCmsData> | null
    );

    // Auto-persist complete normalized document into MongoDB if missing or incomplete
    if (
      db &&
      (!doc ||
        !doc.hero ||
        !doc.clientStoriesConfig ||
        !doc.insightsConfig ||
        !Array.isArray(doc.offerings) ||
        doc.offerings.length === 0)
    ) {
      await db.collection(COLLECTIONS.PAGES).updateOne(
        { page: pageKey },
        {
          $set: {
            ...normalized,
            page: pageKey,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    const [resolvedStories, resolvedInsights] = await Promise.all([
      resolveSolutionClientStories(normalized.clientStoriesConfig, normalized.clientStories),
      resolveSolutionInsights(normalized.insightsConfig, normalized.insights),
    ]);

    return {
      ...normalized,
      clientStories: resolvedStories,
      insights: resolvedInsights,
    };
  } catch (err) {
    console.warn(`[db.service] getSolutionFeaturePageData fallback for ${pageKey}:`, err);
    return normalizeSolutionFeaturePageData(featureSlug, defaultData);
  }
}

/**
 * Ensures the Solutions Overview Hub ('solutions') and all 9 Solution Feature pages
 * ('solutions-<slug>') are seeded and normalized in MongoDB 'page_contents'.
 */
export async function ensureAllSolutionsPagesSeeded(): Promise<void> {
  try {
    await getSolutionsPageData();
    for (const slug of SOLUTION_FEATURE_SLUGS) {
      await getSolutionFeaturePageData(slug);
    }
  } catch (err) {
    console.warn('[db.service] ensureAllSolutionsPagesSeeded warning:', err);
  }
}

export async function getIndustriesPageData(): Promise<IndustriesHubCmsData> {
  try {
    const db = await getDb();
    let doc: Record<string, unknown> | null = null;
    if (db) {
      doc = (await db.collection(COLLECTIONS.PAGES).findOne({ page: 'industries' })) as Record<
        string,
        unknown
      > | null;
    }

    const normalized = normalizeIndustriesHubPageData(
      doc as Partial<IndustriesHubCmsData> | null
    );

    // Ensure complete normalized document is persisted in MongoDB if missing or lacking new CMS fields
    if (
      db &&
      (!doc ||
        !doc.heroTitle ||
        !doc.clientStoriesConfig ||
        !doc.insightsConfig ||
        !Array.isArray(doc.faqs) ||
        doc.faqs.length === 0)
    ) {
      const { _id: _nId, createdAt: _nCreatedAt, ...normSet } = normalized as unknown as Record<string, unknown>;
      await db.collection(COLLECTIONS.PAGES).updateOne(
        { page: 'industries' },
        {
          $set: {
            ...normSet,
            page: 'industries',
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: (doc?.createdAt as Date) || new Date(),
          },
        },
        { upsert: true }
      );
    }

    const fallbackHubStories =
      normalized.spotlightStories && normalized.spotlightStories.length > 0
        ? normalized.spotlightStories
        : getSolutionsOverviewFeaturedClientStories();

    const [resolvedStories, resolvedInsights] = await Promise.all([
      resolveSolutionClientStories(normalized.clientStoriesConfig, fallbackHubStories),
      resolveSolutionInsights(normalized.insightsConfig, normalized.insightsList),
    ]);

    return {
      ...normalized,
      spotlightStories: resolvedStories,
      insightsList: resolvedInsights,
    };
  } catch (err) {
    console.warn('[db.service] getIndustriesPageData fallback:', err);
    return normalizeIndustriesHubPageData(defaultIndustriesHubCmsData);
  }
}

export async function getIndustryFeaturePageData(
  slugOrPage: string
): Promise<IndustryFeatureCmsData> {
  const featureSlug = extractIndustryFeatureSlug(slugOrPage) || 'consumer-products';
  const pageKey = `industries-${featureSlug}`;
  const defaultData = getDefaultIndustryFeatureCmsData(featureSlug);

  try {
    const db = await getDb();
    let doc: Record<string, unknown> | null = null;
    if (db) {
      doc = (await db.collection(COLLECTIONS.PAGES).findOne({ page: pageKey })) as Record<
        string,
        unknown
      > | null;
    }

    const normalized = normalizeIndustryFeaturePageData(
      featureSlug,
      doc as Partial<IndustryFeatureCmsData> | null
    );

    // Auto-persist complete normalized document into MongoDB if missing or incomplete
    if (
      db &&
      (!doc ||
        !doc.hero ||
        !doc.realities ||
        !doc.agileFoundation ||
        !doc.clientStoriesConfig ||
        !doc.insightsConfig ||
        !Array.isArray(doc.offerings) ||
        doc.offerings.length === 0)
    ) {
      const { _id: _fId, createdAt: _fCreatedAt, ...featSet } = normalized as unknown as Record<string, unknown>;
      await db.collection(COLLECTIONS.PAGES).updateOne(
        { page: pageKey },
        {
          $set: {
            ...featSet,
            page: pageKey,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: (doc?.createdAt as Date) || new Date(),
          },
        },
        { upsert: true }
      );
    }

    const [resolvedStories, resolvedInsights] = await Promise.all([
      resolveSolutionClientStories(normalized.clientStoriesConfig, normalized.clientStories),
      resolveSolutionInsights(normalized.insightsConfig, normalized.insights),
    ]);

    return {
      ...normalized,
      clientStories: resolvedStories,
      insights: resolvedInsights,
    };
  } catch (err) {
    console.warn(`[db.service] getIndustryFeaturePageData fallback for ${pageKey}:`, err);
    return normalizeIndustryFeaturePageData(featureSlug, defaultData);
  }
}

/**
 * Ensures the Industries Overview Hub ('industries') and all 6 Industry Feature pages
 * ('industries-<slug>') are seeded and normalized in MongoDB 'page_contents'.
 */
export async function ensureAllIndustriesPagesSeeded(): Promise<void> {
  try {
    await getIndustriesPageData();
    for (const slug of INDUSTRY_FEATURE_SLUGS) {
      await getIndustryFeaturePageData(slug);
    }
  } catch (err) {
    console.warn('[db.service] ensureAllIndustriesPagesSeeded warning:', err);
  }
}

export async function getHowWeDoItPageData(): Promise<HowWeDoItHubCmsData> {
  try {
    const db = await getDb();
    let doc: Record<string, unknown> | null = null;
    if (db) {
      doc = (await db.collection(COLLECTIONS.PAGES).findOne({ page: 'how-we-do-it' })) as Record<
        string,
        unknown
      > | null;
    }

    const normalized = normalizeHowWeDoItHubPageData(
      doc as Partial<HowWeDoItHubCmsData> | null
    );

    // Auto-persist complete normalized document into MongoDB if missing or incomplete
    if (
      db &&
      (!doc ||
        !doc.heroTitle ||
        !doc.clientStoriesConfig ||
        !doc.insightsConfig ||
        !Array.isArray(doc.offeringsList) ||
        doc.offeringsList.length === 0)
    ) {
      const docToSave: Record<string, unknown> = {
        ...(normalized as unknown as Record<string, unknown>),
      };
      delete docToSave.createdAt;
      delete docToSave._id;
      await db.collection(COLLECTIONS.PAGES).updateOne(
        { page: 'how-we-do-it' },
        {
          $set: {
            ...docToSave,
            page: 'how-we-do-it',
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    const fallbackHubStories =
      normalized.clientStories && normalized.clientStories.length > 0
        ? normalized.clientStories
        : getSolutionsOverviewFeaturedClientStories();

    const [resolvedStories, resolvedInsights] = await Promise.all([
      resolveSolutionClientStories(normalized.clientStoriesConfig, fallbackHubStories),
      resolveSolutionInsights(normalized.insightsConfig, normalized.insightsList),
    ]);

    return {
      ...normalized,
      clientStories: resolvedStories,
      insightsList: resolvedInsights,
    };
  } catch (err) {
    console.warn('[db.service] getHowWeDoItPageData fallback:', err);
    return normalizeHowWeDoItHubPageData(defaultHowWeDoItHubCmsData);
  }
}

export async function getHowWeDoItFeaturePageData(
  slugOrPage: string
): Promise<HowWeDoItFeatureCmsData> {
  const featureSlug = extractHowWeDoItFeatureSlug(slugOrPage) || 'strategy-consulting';
  const pageKey = `how-we-do-it-${featureSlug}`;
  const defaultData = getDefaultHowWeDoItFeatureCmsData(featureSlug);

  try {
    const db = await getDb();
    let doc: Record<string, unknown> | null = null;
    if (db) {
      doc = (await db.collection(COLLECTIONS.PAGES).findOne({ page: pageKey })) as Record<
        string,
        unknown
      > | null;
    }

    const normalized = normalizeHowWeDoItFeaturePageData(
      featureSlug,
      doc as Partial<HowWeDoItFeatureCmsData> | null
    );

    // Auto-persist complete normalized document into MongoDB if missing or incomplete
    if (
      db &&
      (!doc ||
        !doc.hero ||
        !doc.clientStoriesConfig ||
        !doc.insightsConfig ||
        !Array.isArray(doc.offerings) ||
        doc.offerings.length === 0)
    ) {
      const docToSave: Record<string, unknown> = {
        ...(normalized as unknown as Record<string, unknown>),
      };
      delete docToSave.createdAt;
      delete docToSave._id;
      await db.collection(COLLECTIONS.PAGES).updateOne(
        { page: pageKey },
        {
          $set: {
            ...docToSave,
            page: pageKey,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    const [resolvedStories, resolvedInsights] = await Promise.all([
      resolveSolutionClientStories(normalized.clientStoriesConfig, normalized.clientStories),
      resolveSolutionInsights(normalized.insightsConfig, normalized.insights),
    ]);

    return {
      ...normalized,
      clientStories: resolvedStories,
      insights: resolvedInsights,
    };
  } catch (err) {
    console.warn(`[db.service] getHowWeDoItFeaturePageData fallback for ${pageKey}:`, err);
    return normalizeHowWeDoItFeaturePageData(featureSlug, defaultData);
  }
}

/**
 * Ensures the How We Do It Overview Hub ('how-we-do-it') and all 5 Feature methodology pages
 * ('how-we-do-it-<slug>') are seeded and normalized in MongoDB 'page_contents'.
 */
export async function ensureAllHowWeDoItPagesSeeded(): Promise<void> {
  try {
    await getHowWeDoItPageData();
    for (const slug of HOW_WE_DO_IT_FEATURE_SLUGS) {
      await getHowWeDoItFeaturePageData(slug);
    }
  } catch (err) {
    console.warn('[db.service] ensureAllHowWeDoItPagesSeeded warning:', err);
  }
}

export type { AboutPageData };

export function normalizeAboutPageData(raw?: Partial<AboutPageData> | null): AboutPageData {
  const src = raw || {};
  return {
    ...aboutPageData,
    ...src,
    hero: {
      ...aboutPageData.hero,
      ...(src.hero || {}),
      badge: { ...aboutPageData.hero.badge, ...(src.hero?.badge || {}) },
      title: { ...aboutPageData.hero.title, ...(src.hero?.title || {}) },
      subtitle: { ...aboutPageData.hero.subtitle, ...(src.hero?.subtitle || {}) },
      primaryCta: { ...aboutPageData.hero.primaryCta, ...(src.hero?.primaryCta || {}) },
      secondaryCta: { ...aboutPageData.hero.secondaryCta, ...(src.hero?.secondaryCta || {}) },
    },
    purpose: {
      ...aboutPageData.purpose,
      ...(src.purpose || {}),
      badge: { ...aboutPageData.purpose.badge, ...(src.purpose?.badge || {}) },
      title: { ...aboutPageData.purpose.title, ...(src.purpose?.title || {}) },
      description1: { ...aboutPageData.purpose.description1, ...(src.purpose?.description1 || {}) },
      description2: { ...aboutPageData.purpose.description2, ...(src.purpose?.description2 || {}) },
      image: src.purpose?.image || aboutPageData.purpose.image,
      stats: Array.isArray(src.purpose?.stats) && src.purpose.stats.length > 0
        ? src.purpose.stats.map((st, idx) => ({
            ...(aboutPageData.purpose.stats[idx] || aboutPageData.purpose.stats[0]),
            ...st,
            label: {
              ...(aboutPageData.purpose.stats[idx]?.label || { en: '', ar: '' }),
              ...(st?.label || {}),
            },
          }))
        : aboutPageData.purpose.stats,
    },
    heritage: {
      ...aboutPageData.heritage,
      ...(src.heritage || {}),
      badge: { ...aboutPageData.heritage.badge, ...(src.heritage?.badge || {}) },
      title: { ...aboutPageData.heritage.title, ...(src.heritage?.title || {}) },
      description: { ...aboutPageData.heritage.description, ...(src.heritage?.description || {}) },
      cta: { ...aboutPageData.heritage.cta, ...(src.heritage?.cta || {}) },
      image: src.heritage?.image || aboutPageData.heritage.image,
      bgImage: src.heritage?.bgImage || aboutPageData.heritage.bgImage || '/about/heritage-bg.jpg',
      metrics: Array.isArray(src.heritage?.metrics) && src.heritage.metrics.length > 0
        ? src.heritage.metrics.map((m, idx) => ({
            ...(aboutPageData.heritage.metrics[idx] || aboutPageData.heritage.metrics[0]),
            ...m,
            label: {
              ...(aboutPageData.heritage.metrics[idx]?.label || { en: '', ar: '' }),
              ...(m?.label || {}),
            },
          }))
        : aboutPageData.heritage.metrics,
    },
    partnership: {
      ...aboutPageData.partnership,
      ...(src.partnership || {}),
      badge: { ...aboutPageData.partnership.badge, ...(src.partnership?.badge || {}) },
      title: { ...aboutPageData.partnership.title, ...(src.partnership?.title || {}) },
      quote: { ...aboutPageData.partnership.quote, ...(src.partnership?.quote || {}) },
      cta: { ...aboutPageData.partnership.cta, ...(src.partnership?.cta || {}) },
      image: src.partnership?.image || aboutPageData.partnership.image,
      floatingBadge: {
        ...(aboutPageData.partnership.floatingBadge || {
          en: 'Active Strategic Squads',
          ar: 'تحالفات استراتيجية نشطة',
        }),
        ...(src.partnership?.floatingBadge || {}),
      },
      paragraphs: Array.isArray(src.partnership?.paragraphs) && src.partnership.paragraphs.length > 0
        ? src.partnership.paragraphs.map((p, idx) => ({
            ...(aboutPageData.partnership.paragraphs[idx] || { en: '', ar: '' }),
            ...(p || {}),
          }))
        : aboutPageData.partnership.paragraphs,
    },
    milestones: {
      ...aboutPageData.milestones,
      ...(src.milestones || {}),
      badge: { ...aboutPageData.milestones.badge, ...(src.milestones?.badge || {}) },
      title: { ...aboutPageData.milestones.title, ...(src.milestones?.title || {}) },
      subtitle: { ...aboutPageData.milestones.subtitle, ...(src.milestones?.subtitle || {}) },
      items: Array.isArray(src.milestones?.items) && src.milestones.items.length > 0
        ? src.milestones.items.map((it, idx) => ({
            ...(aboutPageData.milestones.items[idx] || aboutPageData.milestones.items[0]),
            ...it,
            title: {
              ...(aboutPageData.milestones.items[idx]?.title || { en: '', ar: '' }),
              ...(it?.title || {}),
            },
            description: {
              ...(aboutPageData.milestones.items[idx]?.description || { en: '', ar: '' }),
              ...(it?.description || {}),
            },
          }))
        : aboutPageData.milestones.items,
    },
    quote: {
      ...aboutPageData.quote,
      ...(src.quote || {}),
      badge: { ...aboutPageData.quote.badge, ...(src.quote?.badge || {}) },
      quote: { ...aboutPageData.quote.quote, ...(src.quote?.quote || {}) },
      author: { ...aboutPageData.quote.author, ...(src.quote?.author || {}) },
      role: { ...aboutPageData.quote.role, ...(src.quote?.role || {}) },
      avatar: src.quote?.avatar ?? aboutPageData.quote.avatar,
    },
    culture: {
      ...aboutPageData.culture,
      ...(src.culture || {}),
      badge: { ...aboutPageData.culture.badge, ...(src.culture?.badge || {}) },
      title: { ...aboutPageData.culture.title, ...(src.culture?.title || {}) },
      subtitle: { ...aboutPageData.culture.subtitle, ...(src.culture?.subtitle || {}) },
      photos: Array.isArray(src.culture?.photos) && src.culture.photos.length >= 4
        ? src.culture.photos.map((ph, idx) => ({
            ...(aboutPageData.culture.photos[idx] || aboutPageData.culture.photos[0]),
            ...ph,
            title: {
              ...(aboutPageData.culture.photos[idx]?.title || { en: '', ar: '' }),
              ...(ph?.title || {}),
            },
            caption: {
              ...(aboutPageData.culture.photos[idx]?.caption || { en: '', ar: '' }),
              ...(ph?.caption || {}),
            },
          }))
        : aboutPageData.culture.photos,
    },
    pillars: {
      ...aboutPageData.pillars,
      ...(src.pillars || {}),
      badge: { ...aboutPageData.pillars.badge, ...(src.pillars?.badge || {}) },
      title: { ...aboutPageData.pillars.title, ...(src.pillars?.title || {}) },
      subtitle: { ...aboutPageData.pillars.subtitle, ...(src.pillars?.subtitle || {}) },
      items: Array.isArray(src.pillars?.items) && src.pillars.items.length > 0
        ? src.pillars.items.map((it, idx) => ({
            ...(aboutPageData.pillars.items[idx] || aboutPageData.pillars.items[0]),
            ...it,
            title: {
              ...(aboutPageData.pillars.items[idx]?.title || { en: '', ar: '' }),
              ...(it?.title || {}),
            },
            category: {
              ...(aboutPageData.pillars.items[idx]?.category || { en: '', ar: '' }),
              ...(it?.category || {}),
            },
            date: {
              ...(aboutPageData.pillars.items[idx]?.date || { en: '', ar: '' }),
              ...(it?.date || {}),
            },
            summary: {
              ...(aboutPageData.pillars.items[idx]?.summary || { en: '', ar: '' }),
              ...(it?.summary || {}),
            },
          }))
        : aboutPageData.pillars.items,
    },
    values: {
      ...aboutPageData.values,
      ...(src.values || {}),
      badge: { ...aboutPageData.values.badge, ...(src.values?.badge || {}) },
      title: { ...aboutPageData.values.title, ...(src.values?.title || {}) },
      subtitle: { ...aboutPageData.values.subtitle, ...(src.values?.subtitle || {}) },
      card1: {
        ...aboutPageData.values.card1,
        ...(src.values?.card1 || {}),
        badge: { ...aboutPageData.values.card1.badge, ...(src.values?.card1?.badge || {}) },
        title: { ...aboutPageData.values.card1.title, ...(src.values?.card1?.title || {}) },
        description: { ...aboutPageData.values.card1.description, ...(src.values?.card1?.description || {}) },
        cta: { ...aboutPageData.values.card1.cta, ...(src.values?.card1?.cta || {}) },
      },
      card2: {
        ...aboutPageData.values.card2,
        ...(src.values?.card2 || {}),
        badge: { ...aboutPageData.values.card2.badge, ...(src.values?.card2?.badge || {}) },
        title: { ...aboutPageData.values.card2.title, ...(src.values?.card2?.title || {}) },
        description: { ...aboutPageData.values.card2.description, ...(src.values?.card2?.description || {}) },
        cta: { ...aboutPageData.values.card2.cta, ...(src.values?.card2?.cta || {}) },
      },
    },
  };
}

export async function getAboutPageData(): Promise<AboutPageData> {
  const raw = await getPageContent<AboutPageData>('about', aboutPageData);
  return normalizeAboutPageData(raw);
}

/**
 * Deeply normalizes Careers Hub page data against `careersHubData` defaults
 * so every single section, title, badge, rich-text description, CTA, stat counter,
 * photo, perk, process step, filter board category/location, spontaneous CTA, and FAQ
 * is guaranteed to be populated without ever losing or altering existing content.
 */
export function normalizeCareersPageData(raw?: Partial<CareersHubData> | null): CareersHubData {
  const src = raw && typeof raw === 'object' ? raw : {};

  return {
    ...careersHubData,
    ...src,
    hero: {
      ...careersHubData.hero,
      ...(src.hero || {}),
      enabled: src.hero?.enabled !== false,
      badge: { ...careersHubData.hero.badge, ...(src.hero?.badge || {}) },
      title: { ...careersHubData.hero.title, ...(src.hero?.title || {}) },
      description: { ...careersHubData.hero.description, ...(src.hero?.description || {}) },
      primaryCta: {
        ...careersHubData.hero.primaryCta!,
        ...(src.hero?.primaryCta || {}),
        text: {
          ...careersHubData.hero.primaryCta!.text,
          ...(src.hero?.primaryCta?.text || {}),
        },
        href: src.hero?.primaryCta?.href || careersHubData.hero.primaryCta!.href,
        enabled: src.hero?.primaryCta?.enabled !== false,
      },
      secondaryCta: {
        ...careersHubData.hero.secondaryCta!,
        ...(src.hero?.secondaryCta || {}),
        text: {
          ...careersHubData.hero.secondaryCta!.text,
          ...(src.hero?.secondaryCta?.text || {}),
        },
        href: src.hero?.secondaryCta?.href || careersHubData.hero.secondaryCta!.href,
        enabled: src.hero?.secondaryCta?.enabled !== false,
      },
      stats:
        Array.isArray(src.hero?.stats) && src.hero.stats.length > 0
          ? src.hero.stats.map((st, idx) => ({
              ...(careersHubData.hero.stats[idx] || careersHubData.hero.stats[0]),
              ...st,
              suffix: {
                ...(careersHubData.hero.stats[idx]?.suffix || { en: '', ar: '' }),
                ...(st?.suffix || {}),
              },
              label: {
                ...(careersHubData.hero.stats[idx]?.label || { en: '', ar: '' }),
                ...(st?.label || {}),
              },
            }))
          : careersHubData.hero.stats,
    },
    culture: {
      ...careersHubData.culture,
      ...(src.culture || {}),
      enabled: src.culture?.enabled !== false,
      badge: { ...careersHubData.culture.badge, ...(src.culture?.badge || {}) },
      title: { ...careersHubData.culture.title, ...(src.culture?.title || {}) },
      description: { ...careersHubData.culture.description, ...(src.culture?.description || {}) },
      photos:
        Array.isArray(src.culture?.photos) && src.culture.photos.length > 0
          ? src.culture.photos.map((ph, idx) => ({
              ...(careersHubData.culture.photos[idx] || careersHubData.culture.photos[0]),
              ...ph,
              title: {
                ...(careersHubData.culture.photos[idx]?.title || { en: '', ar: '' }),
                ...(ph?.title || {}),
              },
              location: {
                ...(careersHubData.culture.photos[idx]?.location || { en: '', ar: '' }),
                ...(ph?.location || {}),
              },
            }))
          : careersHubData.culture.photos,
    },
    perks: {
      ...careersHubData.perks,
      ...(src.perks || {}),
      enabled: src.perks?.enabled !== false,
      badge: { ...careersHubData.perks.badge, ...(src.perks?.badge || {}) },
      title: { ...careersHubData.perks.title, ...(src.perks?.title || {}) },
      subtitle: { ...careersHubData.perks.subtitle, ...(src.perks?.subtitle || {}) },
      items:
        Array.isArray(src.perks?.items) && src.perks.items.length > 0
          ? src.perks.items.map((pk, idx) => ({
              ...(careersHubData.perks.items[idx] || careersHubData.perks.items[0]),
              ...pk,
              id: pk?.id || `perk-${idx + 1}`,
              title: {
                ...(careersHubData.perks.items[idx]?.title || { en: '', ar: '' }),
                ...(pk?.title || {}),
              },
              description: {
                ...(careersHubData.perks.items[idx]?.description || { en: '', ar: '' }),
                ...(pk?.description || {}),
              },
              tag: {
                ...(careersHubData.perks.items[idx]?.tag || { en: '', ar: '' }),
                ...(pk?.tag || {}),
              },
            }))
          : careersHubData.perks.items,
    },
    process: {
      ...careersHubData.process,
      ...(src.process || {}),
      enabled: src.process?.enabled !== false,
      badge: { ...careersHubData.process.badge, ...(src.process?.badge || {}) },
      title: { ...careersHubData.process.title, ...(src.process?.title || {}) },
      subtitle: { ...careersHubData.process.subtitle, ...(src.process?.subtitle || {}) },
      steps:
        Array.isArray(src.process?.steps) && src.process.steps.length > 0
          ? src.process.steps.map((st, idx) => ({
              ...(careersHubData.process.steps[idx] || careersHubData.process.steps[0]),
              ...st,
              step: st?.step || String(idx + 1).padStart(2, '0'),
              title: {
                ...(careersHubData.process.steps[idx]?.title || { en: '', ar: '' }),
                ...(st?.title || {}),
              },
              duration: {
                ...(careersHubData.process.steps[idx]?.duration || { en: '', ar: '' }),
                ...(st?.duration || {}),
              },
              description: {
                ...(careersHubData.process.steps[idx]?.description || { en: '', ar: '' }),
                ...(st?.description || {}),
              },
            }))
          : careersHubData.process.steps,
    },
    openPositions: {
      ...careersHubData.openPositions,
      ...(src.openPositions || {}),
      enabled: src.openPositions?.enabled !== false,
      badge: { ...careersHubData.openPositions.badge, ...(src.openPositions?.badge || {}) },
      title: { ...careersHubData.openPositions.title, ...(src.openPositions?.title || {}) },
      subtitle: { ...careersHubData.openPositions.subtitle, ...(src.openPositions?.subtitle || {}) },
      searchPlaceholder: {
        ...careersHubData.openPositions.searchPlaceholder,
        ...(src.openPositions?.searchPlaceholder || {}),
      },
      departmentLabel: {
        ...careersHubData.openPositions.departmentLabel,
        ...(src.openPositions?.departmentLabel || {}),
      },
      locationLabel: {
        ...careersHubData.openPositions.locationLabel,
        ...(src.openPositions?.locationLabel || {}),
      },
      stackLabel: {
        ...careersHubData.openPositions.stackLabel,
        ...(src.openPositions?.stackLabel || {}),
      },
      highPriorityBadge: {
        ...careersHubData.openPositions.highPriorityBadge,
        ...(src.openPositions?.highPriorityBadge || {}),
      },
      applyCtaText: {
        ...careersHubData.openPositions.applyCtaText,
        ...(src.openPositions?.applyCtaText || {}),
      },
      emptyTitle: {
        ...careersHubData.openPositions.emptyTitle,
        ...(src.openPositions?.emptyTitle || {}),
      },
      emptySubtitle: {
        ...careersHubData.openPositions.emptySubtitle,
        ...(src.openPositions?.emptySubtitle || {}),
      },
      resetButtonText: {
        ...careersHubData.openPositions.resetButtonText,
        ...(src.openPositions?.resetButtonText || {}),
      },
      departments:
        Array.isArray(src.openPositions?.departments) && src.openPositions.departments.length > 0
          ? src.openPositions.departments.map((d, idx) => ({
              slug: d?.slug || careersHubData.openPositions.departments[idx]?.slug || `dept-${idx}`,
              label: {
                ...(careersHubData.openPositions.departments[idx]?.label || { en: '', ar: '' }),
                ...(d?.label || {}),
              },
            }))
          : careersHubData.openPositions.departments,
      locations:
        Array.isArray(src.openPositions?.locations) && src.openPositions.locations.length > 0
          ? src.openPositions.locations.map((l, idx) => ({
              slug: l?.slug || careersHubData.openPositions.locations[idx]?.slug || `loc-${idx}`,
              label: {
                ...(careersHubData.openPositions.locations[idx]?.label || { en: '', ar: '' }),
                ...(l?.label || {}),
              },
            }))
          : careersHubData.openPositions.locations,
    },
    spontaneous: {
      ...careersHubData.spontaneous,
      ...(src.spontaneous || {}),
      enabled: src.spontaneous?.enabled !== false,
      badge: { ...careersHubData.spontaneous.badge, ...(src.spontaneous?.badge || {}) },
      title: { ...careersHubData.spontaneous.title, ...(src.spontaneous?.title || {}) },
      description: { ...careersHubData.spontaneous.description, ...(src.spontaneous?.description || {}) },
      ctaText: { ...careersHubData.spontaneous.ctaText, ...(src.spontaneous?.ctaText || {}) },
      email: src.spontaneous?.email || careersHubData.spontaneous.email || 'hr@persiciagency.com',
      emailSubject: {
        ...(careersHubData.spontaneous.emailSubject || { en: '', ar: '' }),
        ...(src.spontaneous?.emailSubject || {}),
      },
    },
    faqs: {
      ...careersHubData.faqs,
      ...(src.faqs || {}),
      enabled: src.faqs?.enabled !== false,
      badge: { ...careersHubData.faqs.badge, ...(src.faqs?.badge || {}) },
      title: { ...careersHubData.faqs.title, ...(src.faqs?.title || {}) },
      subtitle: { ...careersHubData.faqs.subtitle, ...(src.faqs?.subtitle || {}) },
      items:
        Array.isArray(src.faqs?.items) && src.faqs.items.length > 0
          ? src.faqs.items.map((fq, idx) => ({
              ...(careersHubData.faqs.items[idx] || careersHubData.faqs.items[0]),
              ...fq,
              id: fq?.id || `faq-${idx + 1}`,
              question: {
                ...(careersHubData.faqs.items[idx]?.question || { en: '', ar: '' }),
                ...(fq?.question || {}),
              },
              answer: {
                ...(careersHubData.faqs.items[idx]?.answer || { en: '', ar: '' }),
                ...(fq?.answer || {}),
              },
            }))
          : careersHubData.faqs.items,
    },
  };
}

export async function getCareersPageData(): Promise<CareersHubData> {
  const raw = await getPageContent<CareersHubData>('careers', careersHubData);
  return normalizeCareersPageData(raw);
}

/**
 * Normalizes the Insights Hub Page content from MongoDB, merging with static canonical defaults
 * so no section or field is ever undefined or empty.
 */
export function normalizeInsightsPageData(raw?: Partial<InsightsHubPageData> | null): InsightsHubPageData {
  const src = raw && typeof raw === 'object' ? raw : {};

  const pickBi = (
    custom: { en?: string; ar?: string } | undefined | null,
    fallback: { en: string; ar: string }
  ): { en: string; ar: string } => ({
    en:
      custom && typeof custom.en === 'string' && custom.en.trim()
        ? custom.en
        : fallback.en,
    ar:
      custom && typeof custom.ar === 'string' && custom.ar.trim()
        ? custom.ar
        : fallback.ar,
  });

  const pickStr = (custom: string | undefined | null, fallback: string): string =>
    typeof custom === 'string' && custom.trim() ? custom.trim() : fallback;

  return {
    hero: {
      ...insightsHubPageData.hero,
      ...(src.hero || {}),
      enabled: src.hero?.enabled !== false,
      badge: pickBi(src.hero?.badge, insightsHubPageData.hero.badge),
      title: pickBi(src.hero?.title, insightsHubPageData.hero.title),
      titleHighlight: pickBi(src.hero?.titleHighlight, insightsHubPageData.hero.titleHighlight),
      description: pickBi(src.hero?.description, insightsHubPageData.hero.description),
      primaryCtaLabel: pickBi(src.hero?.primaryCtaLabel, insightsHubPageData.hero.primaryCtaLabel),
      primaryCtaHref: pickStr(src.hero?.primaryCtaHref, insightsHubPageData.hero.primaryCtaHref),
      secondaryCtaLabel: pickBi(
        src.hero?.secondaryCtaLabel,
        insightsHubPageData.hero.secondaryCtaLabel
      ),
      secondaryCtaHref: pickStr(
        src.hero?.secondaryCtaHref,
        insightsHubPageData.hero.secondaryCtaHref
      ),
      heroImage: pickStr(src.hero?.heroImage, insightsHubPageData.hero.heroImage),
      heroImageAlt: pickBi(src.hero?.heroImageAlt, insightsHubPageData.hero.heroImageAlt),
    },
    exploreSection: {
      ...insightsHubPageData.exploreSection,
      ...(src.exploreSection || {}),
      enabled: src.exploreSection?.enabled !== false,
      badge: pickBi(src.exploreSection?.badge, insightsHubPageData.exploreSection.badge),
      title: pickBi(src.exploreSection?.title, insightsHubPageData.exploreSection.title),
      subtitle: pickBi(src.exploreSection?.subtitle, insightsHubPageData.exploreSection.subtitle),
      categories:
        Array.isArray(src.exploreSection?.categories) && src.exploreSection.categories.length > 0
          ? src.exploreSection.categories.map((cat, idx) => {
              const fbCat =
                insightsHubPageData.exploreSection.categories.find(
                  (c) => c.slug === cat?.slug
                ) || insightsHubPageData.exploreSection.categories[idx];
              const slugVal = pickStr(cat?.slug, fbCat?.slug || `category-${idx + 1}`);
              return {
                slug: slugVal,
                label: pickBi(
                  cat?.label,
                  fbCat?.label || { en: slugVal, ar: slugVal }
                ),
              };
            })
          : insightsHubPageData.exploreSection.categories,
      emptyTitle: pickBi(
        src.exploreSection?.emptyTitle,
        insightsHubPageData.exploreSection.emptyTitle
      ),
      emptySubtitle: pickBi(
        src.exploreSection?.emptySubtitle,
        insightsHubPageData.exploreSection.emptySubtitle
      ),
      loadMoreText: pickBi(
        src.exploreSection?.loadMoreText,
        insightsHubPageData.exploreSection.loadMoreText
      ),
    },
    newsletterSection: {
      ...insightsHubPageData.newsletterSection,
      ...(src.newsletterSection || {}),
      enabled: src.newsletterSection?.enabled !== false,
      badge: pickBi(
        src.newsletterSection?.badge,
        insightsHubPageData.newsletterSection.badge
      ),
      title: pickBi(
        src.newsletterSection?.title,
        insightsHubPageData.newsletterSection.title
      ),
      subtitle: pickBi(
        src.newsletterSection?.subtitle,
        insightsHubPageData.newsletterSection.subtitle
      ),
      emailPlaceholder: pickBi(
        src.newsletterSection?.emailPlaceholder,
        insightsHubPageData.newsletterSection.emailPlaceholder
      ),
      submitButtonText: pickBi(
        src.newsletterSection?.submitButtonText,
        insightsHubPageData.newsletterSection.submitButtonText
      ),
      successMessage: pickBi(
        src.newsletterSection?.successMessage,
        insightsHubPageData.newsletterSection.successMessage
      ),
      privacyDisclaimer: pickBi(
        src.newsletterSection?.privacyDisclaimer,
        insightsHubPageData.newsletterSection.privacyDisclaimer
      ),
      image: pickStr(
        src.newsletterSection?.image,
        insightsHubPageData.newsletterSection.image
      ),
      imageAlt: pickBi(
        src.newsletterSection?.imageAlt,
        insightsHubPageData.newsletterSection.imageAlt
      ),
    },
    contactSection: {
      ...insightsHubPageData.contactSection,
      ...(src.contactSection || {}),
      enabled: src.contactSection?.enabled !== false,
    },
  };
}

export async function getInsightsPageData(): Promise<InsightsHubPageData> {
  try {
    const db = await getDb();
    if (!db) return normalizeInsightsPageData(insightsHubPageData);

    const doc = await db.collection(COLLECTIONS.PAGES).findOne({ page: 'insights' });
    const normalized = normalizeInsightsPageData(doc as Partial<InsightsHubPageData> | null);

    // Ensure the complete normalized page document is persisted in MongoDB if missing or incomplete
    if (
      !doc ||
      !doc.hero?.title?.en ||
      !doc.exploreSection?.title?.en ||
      !doc.newsletterSection?.title?.en
    ) {
      await db.collection(COLLECTIONS.PAGES).updateOne(
        { page: 'insights' },
        {
          $set: {
            ...normalized,
            page: 'insights',
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    return normalized;
  } catch (err) {
    console.warn('[db.service] getInsightsPageData fallback:', err);
    return normalizeInsightsPageData(insightsHubPageData);
  }
}


export async function getDbHowWeDoItOfferings(): Promise<HowWeDoItOfferingItem[]> {
  try {
    const db = await getDb();
    if (!db) return howWeDoItOfferingsList;

    const items = await db
      .collection(COLLECTIONS.PAGES)
      .find({ type: 'how-we-do-it-offering' })
      .sort({ order: 1 })
      .toArray();

    if (items.length === 0) return howWeDoItOfferingsList;
    return items.map((doc) => {
      const { _id, ...rest } = doc;
      return { ...rest, id: _id?.toString() } as unknown as HowWeDoItOfferingItem;
    });
  } catch {
    return howWeDoItOfferingsList;
  }
}

export async function getDbSolutions(): Promise<SolutionOfferingItem[]> {
  try {
    const db = await getDb();
    if (!db) return solutionsOfferingsList;

    const items = await db
      .collection(COLLECTIONS.SOLUTIONS)
      .find({})
      .sort({ order: 1 })
      .toArray();

    if (items.length === 0) return solutionsOfferingsList;
    return items.map((doc) => {
      const { _id, ...rest } = doc;
      return { ...rest, id: _id?.toString() } as unknown as SolutionOfferingItem;
    });
  } catch {
    return solutionsOfferingsList;
  }
}

export async function getDbSolutionBySlug(slug: string): Promise<SolutionOfferingItem | null> {
  try {
    const all = await getDbSolutions();
    const found = all.find((s) => s.slug === slug);
    return found || null;
  } catch {
    const fallback = solutionsOfferingsList.find((s) => s.slug === slug);
    return fallback || null;
  }
}

export async function getDbIndustries(): Promise<IndustryOfferingItem[]> {
  try {
    const db = await getDb();
    if (!db) return industriesOfferingsList;

    const items = await db
      .collection(COLLECTIONS.INDUSTRIES)
      .find({})
      .sort({ order: 1 })
      .toArray();

    if (items.length === 0) return industriesOfferingsList;
    return items.map((doc) => {
      const { _id, ...rest } = doc;
      return { ...rest, id: _id?.toString() } as unknown as IndustryOfferingItem;
    });
  } catch {
    return industriesOfferingsList;
  }
}

export async function getDbIndustryBySlug(slug: string): Promise<IndustryOfferingItem | null> {
  try {
    const all = await getDbIndustries();
    const found = all.find((s) => s.slug === slug);
    return found || null;
  } catch {
    const fallback = industriesOfferingsList.find((s) => s.slug === slug);
    return fallback || null;
  }
}

export async function getDbProjects(): Promise<ProjectItem[]> {
  try {
    const db = await getDb();
    if (!db) return projectsList;

    const items = await db
      .collection(COLLECTIONS.PROJECTS)
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    if (items.length === 0) return projectsList;
    return items.map((doc) => {
      const { _id, ...rest } = doc;
      return { ...rest, id: _id?.toString() } as unknown as ProjectItem;
    });
  } catch {
    return projectsList;
  }
}

export async function getDbServices(): Promise<ServiceItem[]> {
  try {
    const db = await getDb();
    if (!db) return servicesList;

    const items = await db
      .collection(COLLECTIONS.SERVICES)
      .find({})
      .sort({ order: 1 })
      .toArray();

    if (items.length === 0) return servicesList;
    return items.map((doc) => {
      const { _id, ...rest } = doc;
      return { ...rest, id: _id?.toString() } as unknown as ServiceItem;
    });
  } catch {
    return servicesList;
  }
}

export async function getDbInsights(): Promise<InsightArticle[]> {
  try {
    const db = await getDb();
    if (!db) return insightsArticles;

    const items = await db
      .collection(COLLECTIONS.INSIGHTS)
      .find({ isActive: { $ne: false } })
      .sort({ date: -1 })
      .toArray();

    if (items.length === 0) return insightsArticles;
    return items.map((doc) => {
      const { _id, ...rest } = doc;
      return { ...rest, id: _id?.toString() } as unknown as InsightArticle;
    });
  } catch {
    return insightsArticles;
  }
}

export async function getDbClientLogos(): Promise<ClientLogo[]> {
  try {
    const db = await getDb();
    if (!db) return clientLogos;

    const items = await db
      .collection(COLLECTIONS.CLIENT_LOGOS)
      .find({ isActive: { $ne: false } })
      .sort({ order: 1 })
      .toArray();

    if (items.length === 0) return clientLogos;
    return items.map((doc) => {
      const { _id, ...rest } = doc;
      return { ...rest, id: _id?.toString() } as unknown as ClientLogo;
    });
  } catch {
    return clientLogos;
  }
}

export async function getDbReviews(): Promise<ReviewItem[]> {
  try {
    const db = await getDb();
    if (!db) return reviewsList;

    const items = await db
      .collection(COLLECTIONS.REVIEWS)
      .find({})
      .sort({ order: 1 })
      .toArray();

    if (items.length === 0) return reviewsList;
    return items.map((doc) => {
      const { _id, ...rest } = doc;
      const rawNameEn = String(rest.nameEn || (typeof rest.name === 'object' ? rest.name?.en : rest.name) || '').trim();
      const rawNameAr = String(rest.nameAr || (typeof rest.name === 'object' ? rest.name?.ar : '') || '').trim();
      const nameEn = rawNameEn || rawNameAr;
      const nameAr = rawNameAr || rawNameEn;

      const rawRoleEn = String(rest.roleEn || (typeof rest.role === 'object' ? rest.role?.en : rest.role) || '').trim();
      const rawRoleAr = String(rest.roleAr || (typeof rest.role === 'object' ? rest.role?.ar : '') || '').trim();
      const roleEn = rawRoleEn || rawRoleAr;
      const roleAr = rawRoleAr || rawRoleEn;

      const rawCompanyEn = String(rest.companyEn || (typeof rest.company === 'object' ? rest.company?.en : rest.company) || '').trim();
      const rawCompanyAr = String(rest.companyAr || (typeof rest.company === 'object' ? rest.company?.ar : '') || '').trim();
      const companyEn = rawCompanyEn || rawCompanyAr;
      const companyAr = rawCompanyAr || rawCompanyEn;

      const rawReviewEn = String(rest.reviewEn || (typeof rest.review === 'object' ? rest.review?.en : rest.review) || '').trim();
      const rawReviewAr = String(rest.reviewAr || (typeof rest.review === 'object' ? rest.review?.ar : '') || '').trim();
      const reviewEn = rawReviewEn || rawReviewAr;
      const reviewAr = rawReviewAr || rawReviewEn;

      const rawVerifiedEn = String(rest.verifiedEn || (typeof rest.verified === 'object' ? rest.verified?.en : rest.verified) || '').trim();
      const rawVerifiedAr = String(rest.verifiedAr || (typeof rest.verified === 'object' ? rest.verified?.ar : '') || '').trim();
      const verifiedEn = rawVerifiedEn || (rawVerifiedAr === 'عميل موثق' ? 'Verified Client' : rawVerifiedAr) || 'Verified Client';
      const verifiedAr = rawVerifiedAr || (rawVerifiedEn === 'Verified Client' ? 'عميل موثق' : rawVerifiedEn) || 'عميل موثق';

      return {
        ...rest,
        id: _id?.toString(),
        name: { en: nameEn, ar: nameAr },
        nameEn,
        nameAr,
        role: { en: roleEn, ar: roleAr },
        roleEn,
        roleAr,
        company: { en: companyEn, ar: companyAr },
        companyEn,
        companyAr,
        review: { en: reviewEn, ar: reviewAr },
        reviewEn,
        reviewAr,
        verified: { en: verifiedEn, ar: verifiedAr },
        verifiedEn,
        verifiedAr,
        rating: typeof rest.rating === 'number' ? rest.rating : (parseFloat(rest.rating) || 5),
        active: rest.active !== false,
      } as unknown as ReviewItem;
    });
  } catch {
    return reviewsList;
  }
}

export async function saveContactSubmission(
  data: ContactFormData
): Promise<{ success: boolean; id?: string }> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn('[db.service] MongoDB not connected, simulated submission success.');
      return { success: true, id: 'simulated-' + Date.now() };
    }

    const submission: ContactSubmission = {
      ...data,
      status: 'unread',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).insertOne(submission as unknown as Document);
    return { success: true, id: res.insertedId.toString() };
  } catch (err) {
    console.error('[db.service] saveContactSubmission error:', err);
    return { success: false };
  }
}

export async function saveDiscoverySubmission(
  data: DiscoveryFormData
): Promise<{ success: boolean; id?: string }> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn('[db.service] MongoDB not connected, simulated discovery submission.');
      return { success: true, id: 'simulated-' + Date.now() };
    }

    const submission: DiscoverySubmission = {
      ...data,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection(COLLECTIONS.DISCOVERY_SUBMISSIONS).insertOne(submission as unknown as Document);
    return { success: true, id: res.insertedId.toString() };
  } catch (err) {
    console.error('[db.service] saveDiscoverySubmission error:', err);
    return { success: false };
  }
}

export async function saveAppointmentSubmission(
  data: AppointmentFormData
): Promise<{ success: boolean; id?: string }> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn('[db.service] MongoDB not connected, simulated appointment submission.');
      return { success: true, id: 'simulated-' + Date.now() };
    }

    const submission: AppointmentSubmission = {
      ...data,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection(COLLECTIONS.APPOINTMENTS).insertOne(submission as unknown as Document);
    return { success: true, id: res.insertedId.toString() };
  } catch (err) {
    console.error('[db.service] saveAppointmentSubmission error:', err);
    return { success: false };
  }
}

export async function saveJobApplicationSubmission(
  data: JobApplicationFormData
): Promise<{ success: boolean; id?: string }> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn('[db.service] MongoDB not connected, simulated job application submission.');
      return { success: true, id: 'simulated-job-' + Date.now() };
    }

    const submission: JobApplicationSubmission = {
      ...data,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection(COLLECTIONS.JOB_APPLICATIONS).insertOne(submission as unknown as Document);
    return { success: true, id: res.insertedId.toString() };
  } catch (err) {
    console.error('[db.service] saveJobApplicationSubmission error:', err);
    return { success: false };
  }
}

