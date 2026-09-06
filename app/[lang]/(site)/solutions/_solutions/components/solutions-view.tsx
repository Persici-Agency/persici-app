import React from 'react';
import type { Dictionary } from '@dictionaries';
import type { SolutionsPageContent } from '@shared/types';
import { HomeContactSection } from '../../../_home/components/home-contact-section';
import { SolutionsHeroSection } from './solutions-hero-section';
import { SolutionsOfferingsGrid } from './solutions-offerings-grid';
import { SolutionsWhyItMatters } from './solutions-why-it-matters';
import { SolutionsBenefitsStrip } from './solutions-benefits-strip';
import { SolutionsDeliveryEngine } from './solutions-delivery-engine';
import { SolutionsStorySpotlight } from './solutions-story-spotlight';
import { SolutionsClientReview } from './solutions-client-review';
import { SolutionsFaqSection } from './solutions-faq-section';

export type SolutionsViewProps = {
  content: SolutionsPageContent;
  lang: string;
  dict: Dictionary;
};

export function SolutionsView({ content, lang, dict }: SolutionsViewProps) {
  const offeringsTitle = content.offeringsTitle[lang as 'en' | 'ar'] || content.offeringsTitle.en;
  const offeringsSubtitle = content.offeringsSubtitle[lang as 'en' | 'ar'] || content.offeringsSubtitle.en;
  const whyItMattersTitle = content.whyItMattersTitle[lang as 'en' | 'ar'] || content.whyItMattersTitle.en;
  const whyItMattersText = content.whyItMattersText[lang as 'en' | 'ar'] || content.whyItMattersText.en;
  const benefitsTitle = content.benefitsTitle[lang as 'en' | 'ar'] || content.benefitsTitle.en;
  const deliveryTitle = content.deliveryTitle[lang as 'en' | 'ar'] || content.deliveryTitle.en;
  const deliverySubtitle = content.deliverySubtitle[lang as 'en' | 'ar'] || content.deliverySubtitle.en;
  const faqsTitle = content.faqsTitle[lang as 'en' | 'ar'] || content.faqsTitle.en;
  const faqsSubtitle = content.faqsSubtitle[lang as 'en' | 'ar'] || content.faqsSubtitle.en;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <SolutionsHeroSection content={content} lang={lang} />

      {/* 2. "Our Offerings" 9 Solutions Grid from Challenges Section */}
      <SolutionsOfferingsGrid
        offerings={content.offeringsList}
        title={offeringsTitle}
        subtitle={offeringsSubtitle}
        lang={lang}
      />

      {/* 3. Why It Matters Context */}
      <SolutionsWhyItMatters
        title={whyItMattersTitle}
        text={whyItMattersText}
        image={content.whyItMattersImage}
        lang={lang}
      />

      {/* 4. Benefits of Growth Architecture Strip */}
      <SolutionsBenefitsStrip
        title={benefitsTitle}
        image={content.benefitsImage}
        benefits={content.benefits}
        lang={lang}
      />

      {/* 5. Customer Stories / Spotlight Card */}
      <SolutionsStorySpotlight content={content} lang={lang} />

      {/* 6. "How We Deliver Differently" / Cut Dev Time Platform */}
      <SolutionsDeliveryEngine
        title={deliveryTitle}
        subtitle={deliverySubtitle}
        image={content.deliveryImage}
        pillars={content.deliveryPillars}
        lang={lang}
      />

      {/* 7. Client Review Standalone Monospace Quote */}
      <SolutionsClientReview content={content} lang={lang} />

      {/* 8. FAQs Accordion */}
      <SolutionsFaqSection
        title={faqsTitle}
        subtitle={faqsSubtitle}
        faqs={content.faqs}
        lang={lang}
      />

      {/* 9. Static Home Contact Section (Required on all Solution Pages) */}
      <HomeContactSection lang={lang} dict={dict} />
    </div>
  );
}
