import { WorkDetailHeroSection } from './work-detail-hero-section';
import { WorkDetailCtaSection } from './work-detail-cta-section';

export type WorkDetailViewProps = {
  slug: string;
  lang: string;
};

export function WorkDetailView({ slug, lang }: WorkDetailViewProps) {
  return (
    <div>
      <WorkDetailHeroSection slug={slug} />
      <WorkDetailCtaSection lang={lang} />
    </div>
  );
}
