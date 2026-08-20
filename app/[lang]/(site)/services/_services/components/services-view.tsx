import type { Dictionary } from '../../../../dictionaries';
import { ServicesHeroSection } from './services-hero-section';
import { ServicesGridSection } from './services-grid-section';
import { ServicesCtaSection } from './services-cta-section';

export type ServicesViewProps = {
  lang: string;
  dict: Dictionary;
};

export function ServicesView({ lang, dict }: ServicesViewProps) {
  return (
    <div>
      <ServicesHeroSection dict={dict} />
      <ServicesGridSection lang={lang} />
      <ServicesCtaSection lang={lang} dict={dict} />
    </div>
  );
}
