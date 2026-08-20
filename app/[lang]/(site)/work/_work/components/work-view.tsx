import type { Dictionary } from '../../../../dictionaries';
import { WorkHeroSection } from './work-hero-section';
import { WorkGridSection } from './work-grid-section';
import { WorkCtaSection } from './work-cta-section';

export type WorkViewProps = {
  lang: string;
  dict: Dictionary;
};

export function WorkView({ lang, dict }: WorkViewProps) {
  return (
    <div>
      <WorkHeroSection dict={dict} />
      <WorkGridSection lang={lang} />
      <WorkCtaSection lang={lang} dict={dict} />
    </div>
  );
}
