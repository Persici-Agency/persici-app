import React from 'react';
import { FeaturedClientStories, InsightsSection, FaqSection, ClientReviewSection } from '@shared';
import type { Dictionary } from '@dictionaries';
import type { IndustriesPageContent } from '@shared/types';
import { HomeContactSection } from '../../../_home/components/home-contact-section';
import { IndustriesHeroSection } from './industries-hero-section';
import { IndustriesOfferingsGrid } from './industries-offerings-grid';
import { SolutionsWhyItMatters } from '../../../solutions/_solutions/components/solutions-why-it-matters';
import { SolutionsBenefitsStrip } from '../../../solutions/_solutions/components/solutions-benefits-strip';
import { SolutionsDeliveryEngine } from '../../../solutions/_solutions/components/solutions-delivery-engine';

export type IndustriesViewProps = {
  content: IndustriesPageContent;
  lang: string;
  dict: Dictionary;
};

export function IndustriesView({ content, lang, dict }: IndustriesViewProps) {
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
      {/* 1. Dynamic Hero Section */}
      <IndustriesHeroSection content={content} lang={lang} />

      {/* 2. 6-Industry Hub Grid with Pause/Resume Vector Diagrams */}
      <IndustriesOfferingsGrid
        offerings={content.offeringsList}
        title={offeringsTitle}
        subtitle={offeringsSubtitle}
        lang={lang}
      />

      {/* 3. Why Industry-Specific Engineering Matters */}
      <SolutionsWhyItMatters
        title={whyItMattersTitle}
        text={whyItMattersText}
        image={content.whyItMattersImage}
        lang={lang}
      />

      {/* 4. Strategic Benefits Strip */}
      <SolutionsBenefitsStrip
        title={benefitsTitle}
        image={content.benefitsImage}
        benefits={content.benefits}
        lang={lang}
      />

      {/* 5. Cross-Industry Featured Client Stories */}
      <FeaturedClientStories
        sectionBadge={lang === 'ar' ? 'قصص النجاح عبر القطاعات' : 'Cross-Industry Client Stories'}
        sectionTitle={
          lang === 'ar'
            ? 'منصات صنعت أثراً ملموساً في كبرى الصناعات'
            : 'Enterprise platforms engineered for measurable sector impact'
        }
        sectionSubtitle={
          lang === 'ar'
            ? 'اكتشف كيف ساهمت الحلول المخصصة لبيرسيكي في قيادة التحول وتنمية الأرباح لعملائنا.'
            : 'Explore how our domain-aligned software engineering drives compounding enterprise scale.'
        }
        lang={lang}
      />

      {/* 6. How We Deliver Differently / Platform Engine */}
      <SolutionsDeliveryEngine
        title={deliveryTitle}
        subtitle={deliverySubtitle}
        image={content.deliveryImage}
        pillars={content.deliveryPillars}
        lang={lang}
      />

      {/* 7. Industry Insights Carousel (2 cards visible on desktop) */}
      <InsightsSection
        title={lang === 'ar' ? 'أحدث الدراسات والرؤى القطاعية' : 'Latest Industry Insights & Research'}
        subtitle={
          lang === 'ar'
            ? 'أوراق بحثية ومخططات معمارية حول مستقبل الرقمنة والذكاء الاصطناعي في مختلف القطاعات.'
            : 'Architectural blueprints, regulatory roadmaps, and domain leadership perspectives.'
        }
        lang={lang}
      />

      {/* 8. Executive Client Review Standalone Quote */}
      <ClientReviewSection
        quoteText={content.quoteText}
        quoteAuthor={content.quoteAuthor}
        quoteRole={content.quoteRole}
        badge={{
          en: 'Verified Enterprise Partner',
          ar: 'شريك مؤسسي معتمد',
        }}
        lang={lang}
      />

      {/* 9. FAQs Accordion */}
      <FaqSection
        title={faqsTitle}
        subtitle={faqsSubtitle}
        faqs={content.faqs}
        lang={lang}
      />

      {/* 10. Global Contact Section */}
      <div id="contact">
        <HomeContactSection lang={lang} dict={dict} />
      </div>
    </div>
  );
}
