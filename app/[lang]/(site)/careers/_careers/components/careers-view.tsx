import type { Dictionary } from '@dictionaries';
import { CareersHeroSection } from './careers-hero-section';
import { CareersOpeningsSection } from './careers-openings-section';

export type CareersViewProps = {
  lang: string;
  dict: Dictionary;
};

export function CareersView({ lang, dict }: CareersViewProps) {
  return (
    <div>
      <CareersHeroSection dict={dict} />
      <CareersOpeningsSection lang={lang} />
    </div>
  );
}
