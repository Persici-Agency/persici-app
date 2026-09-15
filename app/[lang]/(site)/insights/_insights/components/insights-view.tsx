import type { Dictionary } from '@dictionaries';
import { getAllInsights } from '../data/insights.data';
import { InsightsHubView } from './insights-hub-view';

export type InsightsViewProps = {
  lang: string;
  dict: Dictionary;
};

export function InsightsView({ lang, dict }: InsightsViewProps) {
  const insights = getAllInsights();
  return <InsightsHubView insights={insights} lang={lang} dict={dict} />;
}
