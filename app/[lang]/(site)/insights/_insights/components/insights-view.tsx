import type { Dictionary } from '../../../../dictionaries';
import { InsightsHeroSection } from './insights-hero-section';
import { InsightsGridSection } from './insights-grid-section';

export type InsightsViewProps = {
  lang: string;
  dict: Dictionary;
};

export function InsightsView({ lang, dict }: InsightsViewProps) {
  return (
    <div>
      <InsightsHeroSection dict={dict} />
      <InsightsGridSection lang={lang} />
    </div>
  );
}
