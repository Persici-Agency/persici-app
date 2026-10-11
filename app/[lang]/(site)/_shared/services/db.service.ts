import 'server-only';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import {
  homePageContent,
  servicesPageContent,
  workPageContent,
  solutionsPageContent,
  solutionsOfferingsList,
  industriesPageContent,
  industriesOfferingsList,
  howWeDoItPageContent,
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
export type { ContactPageData };
import type {
  SharedContactContent,
  HomePageContent,
  ServicesPageContent,
  WorkPageContent,
  SolutionsPageContent,
  SolutionOfferingItem,
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

export async function getSolutionsPageData(): Promise<SolutionsPageContent> {
  return getPageContent<SolutionsPageContent>('solutions', solutionsPageContent);
}

export async function getIndustriesPageData(): Promise<IndustriesPageContent> {
  return getPageContent<IndustriesPageContent>('industries', industriesPageContent);
}

export async function getHowWeDoItPageData(): Promise<HowWeDoItPageContent> {
  return getPageContent<HowWeDoItPageContent>('how-we-do-it', howWeDoItPageContent);
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
      return { ...rest, id: _id?.toString() } as unknown as ReviewItem;
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

