import type { SolutionOfferingItem, SolutionsPageContent } from '@shared/types';
import { solutionsOfferingsList, solutionsPageContent } from '@shared/data';
import {
  getSolutionsPageData,
  getSolutionFeaturePageData,
  getDbSolutions,
  getDbSolutionBySlug,
  type SolutionsHubCmsData,
  type SolutionFeatureCmsData,
} from '@shared/services/db.service';

export type {
  SolutionOfferingItem,
  SolutionsPageContent,
  SolutionsHubCmsData,
  SolutionFeatureCmsData,
};
export { solutionsOfferingsList, solutionsPageContent };

/**
 * Returns static solutions list synchronously.
 */
export function getSolutionsList(): SolutionOfferingItem[] {
  return solutionsOfferingsList;
}

/**
 * Fetches solutions list from MongoDB with automatic fallback.
 */
export async function fetchSolutionsList(): Promise<SolutionOfferingItem[]> {
  return getDbSolutions();
}

/**
 * Fetches full solutions page CMS data with MongoDB priority and fallback.
 */
export async function fetchSolutionsPageData(): Promise<SolutionsHubCmsData> {
  return getSolutionsPageData();
}

/**
 * Fetches full solution feature page CMS data by slug with MongoDB priority and fallback.
 */
export async function fetchSolutionFeaturePageData(
  slug: string
): Promise<SolutionFeatureCmsData> {
  return getSolutionFeaturePageData(slug);
}

/**
 * Fetches single solution by slug.
 */
export async function fetchSolutionBySlug(slug: string): Promise<SolutionOfferingItem | null> {
  return getDbSolutionBySlug(slug);
}
