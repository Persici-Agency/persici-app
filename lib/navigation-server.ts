import 'server-only';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { siteNavLinks } from '@shared/data';

export interface HeaderNavData {
  links?: any[];
  ctaButton?: {
    text: { en: string; ar: string };
    href: string;
    enabled: boolean;
  };
}

export interface FooterNavData {
  tagline?: { en: string; ar: string };
  hubs?: any[];
  socialLinks?: any[];
}

export async function getHeaderNavigationFromDb(): Promise<HeaderNavData | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const doc = await db.collection(COLLECTIONS.NAVIGATION).findOne({ type: 'header' });
    if (!doc) return null;

    return {
      links: doc.links || siteNavLinks,
      ctaButton: doc.ctaButton,
    };
  } catch {
    return null;
  }
}

export async function getFooterNavigationFromDb(): Promise<FooterNavData | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const doc = await db.collection(COLLECTIONS.NAVIGATION).findOne({ type: 'footer' });
    if (!doc) return null;

    return {
      tagline: doc.tagline,
      hubs: doc.hubs,
      socialLinks: doc.socialLinks,
    };
  } catch {
    return null;
  }
}
