import type { InsightArticle } from '@shared/types';
import { insightsArticles } from '@shared/data';

export type { InsightArticle };
export { insightsArticles };

export function getInsightsArticles(): InsightArticle[] {
  return insightsArticles;
}
