'use client';

import React from 'react';
import type { Dictionary } from '@dictionaries';
import { ecommerceGrowthData } from '../data/ecommerce-growth.data';
import { EcommercePartnerShowcase } from './ecommerce-partner-showcase';
import { EcommerceOfferingsGrid } from './ecommerce-offerings-grid';
import { EcommerceVerticalsSection } from './ecommerce-verticals-section';
import { EcommerceTechStackSection } from './ecommerce-tech-stack-section';
import { SolutionsHeroSection } from '../../../_solutions/components/solutions-hero-section';
import { SolutionsWhyItMatters } from '../../../_solutions/components/solutions-why-it-matters';
import { SolutionsBenefitsStrip } from '../../../_solutions/components/solutions-benefits-strip';
import { StackedFeaturedClientStories } from '../../../_solutions/components/stacked-featured-client-stories';
import { SolutionsDeliveryEngine } from '../../../_solutions/components/solutions-delivery-engine';
import { SolutionsInsightsSection } from '../../../_solutions/components/solutions-insights-section';
import { SolutionsClientReview } from '../../../_solutions/components/solutions-client-review';
import { SolutionsFaqSection } from '../../../_solutions/components/solutions-faq-section';
import { HomeContactSection } from '../../../../_home/components/home-contact-section';

interface EcommerceGrowthViewProps {
  lang: string;
  dict: Dictionary;
}

export function EcommerceGrowthView({ lang, dict }: EcommerceGrowthViewProps) {
  const isRtl = lang === 'ar';
  const data = ecommerceGrowthData;

  const offeringsTitle = data.offeringsTitle[lang as 'en' | 'ar'] || data.offeringsTitle.en;
  const offeringsSubtitle = data.offeringsSubtitle[lang as 'en' | 'ar'] || data.offeringsSubtitle.en;

  const whyTitle = data.whyItMatters.title[lang as 'en' | 'ar'] || data.whyItMatters.title.en;
  const whyText = data.whyItMatters.text[lang as 'en' | 'ar'] || data.whyItMatters.text.en;

  const benefitsTitle = data.benefitsStrip.title[lang as 'en' | 'ar'] || data.benefitsStrip.title.en;

  const verticalsTitle = data.verticalsTitle[lang as 'en' | 'ar'] || data.verticalsTitle.en;
  const verticalsSubtitle = data.verticalsSubtitle[lang as 'en' | 'ar'] || data.verticalsSubtitle.en;

  const techTitle = data.techStackTitle[lang as 'en' | 'ar'] || data.techStackTitle.en;
  const techSubtitle = data.techStackSubtitle[lang as 'en' | 'ar'] || data.techStackSubtitle.en;

  const deliveryTitle = data.delivery.title[lang as 'en' | 'ar'] || data.delivery.title.en;
  const deliverySubtitle = data.delivery.subtitle[lang as 'en' | 'ar'] || data.delivery.subtitle.en;

  const faqsTitle = data.faqsTitle[lang as 'en' | 'ar'] || data.faqsTitle.en;
  const faqsSubtitle = data.faqsSubtitle[lang as 'en' | 'ar'] || data.faqsSubtitle.en;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner */}
      <SolutionsHeroSection
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        tag={data.hero.tag}
        secondaryTag={data.hero.secondaryTag}
        image={data.hero.image}
        ctaText={data.hero.ctaText}
        ctaHref={data.hero.ctaHref}
        lang={lang}
      />

      {/* 2. Official Platforms & Partner Showcase with Video */}
      <EcommercePartnerShowcase
        badge={data.partnerShowcase.badge[lang as 'en' | 'ar'] || data.partnerShowcase.badge.en}
        title={data.partnerShowcase.title[lang as 'en' | 'ar'] || data.partnerShowcase.title.en}
        description={data.partnerShowcase.description[lang as 'en' | 'ar'] || data.partnerShowcase.description.en}
        video={data.partnerShowcase.video}
        partners={data.partnerShowcase.partners}
        lang={lang}
      />

      {/* 3. Core Capabilities Grid (6 Cards, 4-col with Centered Remainder) */}
      <EcommerceOfferingsGrid
        offerings={data.offerings}
        title={offeringsTitle}
        subtitle={offeringsSubtitle}
        lang={lang}
      />

      {/* 4. Why It Matters (Split Layout + sapient-tab-tl Image) */}
      <SolutionsWhyItMatters
        title={whyTitle}
        text={whyText}
        image={data.whyItMatters.image}
        lang={lang}
      />

      {/* 5. Strategic Benefits Strip (sapient-wide-strip Banner) */}
      <SolutionsBenefitsStrip
        title={benefitsTitle}
        image={data.benefitsStrip.image}
        benefits={data.benefitsStrip.benefits}
        lang={lang}
      />

      {/* 6. Domain Verticals (01-05 Monospace Badges & Checklists) */}
      <EcommerceVerticalsSection
        verticals={data.verticals}
        title={verticalsTitle}
        subtitle={verticalsSubtitle}
        lang={lang}
      />

      {/* 7. Technology Stack (Dark #0E121B Matrix) */}
      <EcommerceTechStackSection
        pods={data.techStackPods}
        title={techTitle}
        subtitle={techSubtitle}
        lang={lang}
      />

      {/* 8. Featured Client Stories (Stacked Sticky Cards + Scroll Scale-Out) */}
      <StackedFeaturedClientStories
        stories={data.clientStories}
        sectionBadge={isRtl ? 'قصص النجاح المميزة' : 'Featured Client Stories'}
        sectionTitle={isRtl ? 'نتائج أعمال استثنائية ونمو متسارع في المبيعات' : 'Transformative E-Commerce Growth & Proven Scalability'}
        sectionSubtitle={isRtl ? 'اكتشف كيف قادت استراتيجيات بيرسيكي كبرى المتاجر الخليجية إلى مضاعفة الإيرادات وهوامش الأرباح.' : 'See how our full-funnel commerce architecture scales top GCC and global retail brands.'}
        lang={lang}
      />

      {/* 9. How We Deliver Differently (Diagonal Brand Gradient) */}
      <SolutionsDeliveryEngine
        title={deliveryTitle}
        subtitle={deliverySubtitle}
        image={data.delivery.image}
        pillars={data.delivery.pillars}
        lang={lang}
      />

      {/* 10. Solutions Insights (Dynamic 2-Card ContentCarousel) */}
      <SolutionsInsightsSection
        items={data.insights}
        title={isRtl ? 'رؤى وأفكار في التجارة الرقمية والنمو' : 'Insights & Strategic Commerce Architecture'}
        subtitle={isRtl ? 'أحدث الدراسات والتحليلات العملية لهندسة المتاجر، وتحسين معدلات التحويل، ومضاعفة ولاء العملاء.' : 'Tactical playbooks and cutting-edge perspectives on headless commerce, CRO, and compounding retention.'}
        lang={lang}
      />

      {/* 11. Executive Client Review */}
      <SolutionsClientReview
        quoteText={data.clientReview.quote}
        quoteAuthor={data.clientReview.author}
        quoteRole={data.clientReview.role}
        badge={data.clientReview.badge}
        lang={lang}
      />

      {/* 12. Enterprise FAQs Accordion */}
      <SolutionsFaqSection
        faqs={data.faqs}
        title={faqsTitle}
        subtitle={faqsSubtitle}
        lang={lang}
      />

      {/* 13. Global Contact Section */}
      <div id="contact">
        <HomeContactSection dict={dict} lang={lang} />
      </div>
    </div>
  );
}
