import type { Dictionary } from '@dictionaries';
import { AboutHeroSection } from './about-hero-section';
import { AboutValuesSection } from './about-values-section';
import { AboutCtaSection } from './about-cta-section';

export type AboutViewProps = {
  lang: string;
  dict: Dictionary;
};

export function AboutView({ lang, dict }: AboutViewProps) {
  return (
    <div>
      <AboutHeroSection dict={dict} />
      <AboutValuesSection />
      <AboutCtaSection lang={lang} dict={dict} />
    </div>
  );
}
