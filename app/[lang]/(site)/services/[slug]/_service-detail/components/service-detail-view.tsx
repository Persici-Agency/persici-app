import { ServiceDetailHeroSection } from './service-detail-hero-section';
import { ServiceDetailCtaSection } from './service-detail-cta-section';

export type ServiceDetailViewProps = {
  slug: string;
  lang: string;
};

export function ServiceDetailView({ slug, lang }: ServiceDetailViewProps) {
  return (
    <div>
      <ServiceDetailHeroSection slug={slug} />
      <ServiceDetailCtaSection lang={lang} />
    </div>
  );
}
