import type { Dictionary } from '../../../dictionaries';
import { HeroSection } from './hero-section';
import { PartnerShowcaseSection } from './partner-showcase-section';
import { HeritageSection } from './heritage-section';
import { GrowthServicesSection } from './growth-services-section';
import { ClientsVideoSection } from './clients-video-section';
import { ApproachSection } from './approach-section';
import { ReviewsSection } from './reviews-section';
import { DiscoverySection } from './discovery-section';

export type HomeViewProps = {
  lang: string;
  dict: Dictionary;
};

export function HomeView({ lang, dict }: HomeViewProps) {
  return (
    <div className="relative overflow-hidden">
      {/* 1. Hero Section */}
      <HeroSection lang={lang} dict={dict} />

      {/* 2. Featured Showcase ("Your online growth partner") */}
      <PartnerShowcaseSection dict={dict} />

      {/* 3. Heritage & Agency Story ("Rooted in excellence. Built for growth.") */}
      <HeritageSection lang={lang} dict={dict} />

      {/* 4. Our Growth Services (Paid Social, Google Ads, Shopify & CRO) */}
      <GrowthServicesSection lang={lang} dict={dict} />

      {/* 5. Meet Clients We Scale (Dark Video Testimonials Carousel) */}
      <ClientsVideoSection dict={dict} />

      {/* 6. Our Approach to eCommerce Growth */}
      <ApproachSection lang={lang} dict={dict} />

      {/* 7. Words from Those We Scale (Reviews Wall) */}
      <ReviewsSection lang={lang} dict={dict} />

      {/* 8. Schedule 30-Minute Discovery Call */}
      <DiscoverySection dict={dict} />
    </div>
  );
}
