import type { IndustryOfferingItem, IndustriesPageContent } from '@shared/types';
import { industriesOfferingsList, industriesPageContent } from '@shared/data';
import {
  getIndustriesPageData,
  getDbIndustries,
  getDbIndustryBySlug,
} from '@shared/services/db.service';

export type { IndustryOfferingItem, IndustriesPageContent };
export { industriesOfferingsList, industriesPageContent };

export async function fetchIndustriesList(): Promise<IndustryOfferingItem[]> {
  try {
    return await getDbIndustries();
  } catch {
    return industriesOfferingsList;
  }
}

export async function fetchIndustryBySlug(slug: string): Promise<IndustryOfferingItem | null> {
  try {
    return await getDbIndustryBySlug(slug);
  } catch {
    const item = industriesOfferingsList.find((ind) => ind.slug === slug);
    return item || null;
  }
}

export async function fetchIndustriesPageData(): Promise<IndustriesPageContent> {
  try {
    return await getIndustriesPageData();
  } catch (error) {
    console.error('[fetchIndustriesPageData] Error fetching, falling back to static data:', error);
    return industriesPageContent;
  }
}
