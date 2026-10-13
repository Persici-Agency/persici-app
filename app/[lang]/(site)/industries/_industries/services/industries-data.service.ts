import type { IndustryOfferingItem, IndustriesPageContent } from '@shared/types';
import { industriesOfferingsList, industriesPageContent } from '@shared/data';
import {
  getIndustriesPageData,
  getIndustryFeaturePageData,
  getDbIndustries,
  getDbIndustryBySlug,
  type IndustriesHubCmsData,
  type IndustryFeatureCmsData,
} from '@shared/services/db.service';
import {
  defaultIndustriesHubCmsData,
  getDefaultIndustryFeatureCmsData,
} from '../data/industries-cms.data';

export type {
  IndustryOfferingItem,
  IndustriesPageContent,
  IndustriesHubCmsData,
  IndustryFeatureCmsData,
};
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

export async function fetchIndustriesPageData(): Promise<IndustriesHubCmsData> {
  try {
    return await getIndustriesPageData();
  } catch (error) {
    console.error('[fetchIndustriesPageData] Error fetching, falling back to static data:', error);
    return defaultIndustriesHubCmsData;
  }
}

export async function fetchIndustryFeaturePageData(
  slug: string
): Promise<IndustryFeatureCmsData> {
  try {
    return await getIndustryFeaturePageData(slug);
  } catch (error) {
    console.error(
      `[fetchIndustryFeaturePageData] Error fetching '${slug}', falling back to static data:`,
      error
    );
    return (
      getDefaultIndustryFeatureCmsData(slug) ||
      getDefaultIndustryFeatureCmsData('consumer-products')!
    );
  }
}
