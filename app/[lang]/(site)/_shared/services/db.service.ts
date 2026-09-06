import 'server-only';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import {
  homePageContent,
  servicesPageContent,
  workPageContent,
  contactPageContent,
  solutionsPageContent,
  solutionsOfferingsList,
  projectsList,
  servicesList,
  insightsArticles,
  clientLogos,
  reviewsList,
} from '@shared/data';
import type {
  HomePageContent,
  ServicesPageContent,
  WorkPageContent,
  ContactPageContent,
  SolutionsPageContent,
  SolutionOfferingItem,
  ProjectItem,
  ServiceItem,
  InsightArticle,
  ClientLogo,
  ReviewItem,
  ContactFormData,
  ContactSubmission,
  DiscoveryFormData,
  DiscoverySubmission,
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

export async function getContactPageData(): Promise<ContactPageContent> {
  return getPageContent<ContactPageContent>('contact', contactPageContent);
}

export async function getSolutionsPageData(): Promise<SolutionsPageContent> {
  return getPageContent<SolutionsPageContent>('solutions', solutionsPageContent);
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
