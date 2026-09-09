import type { InsightArticle } from '@shared/types';
import { insightsArticles } from '@shared/data';
import { getDbInsights } from '@shared/services/db.service';

export type { InsightArticle };
export { insightsArticles };

/**
 * Returns static insight articles synchronously.
 */
export function getInsightsArticles(): InsightArticle[] {
  return insightsArticles;
}

/**
 * Fetches insight articles from MongoDB with automatic fallback to static insightsArticles.
 */
export async function fetchInsightsArticles(): Promise<InsightArticle[]> {
  return getDbInsights();
}
