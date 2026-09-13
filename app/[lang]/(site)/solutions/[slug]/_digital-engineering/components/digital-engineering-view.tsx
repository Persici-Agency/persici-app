'use client';

import React from 'react';
import { FeaturedClientStories, InsightsSection, FaqSection, ClientReviewSection } from '@shared';
import type { Dictionary } from '@dictionaries';
import { digitalEngineeringData } from '../data/digital-engineering.data';

import { SolutionsHeroSection } from '../../../_solutions/components/solutions-hero-section';
import { DigitalEngineeringOfferingsGrid } from './digital-engineering-offerings-grid';
import { SolutionsWhyItMatters } from '../../../_solutions/components/solutions-why-it-matters';
import { SolutionsBenefitsStrip } from '../../../_solutions/components/solutions-benefits-strip';
import { DigitalEngineeringVerticalsSection } from './digital-engineering-verticals-section';
import { DigitalEngineeringTechStackSection } from './digital-engineering-tech-stack-section';

import { SolutionsDeliveryEngine } from '../../../_solutions/components/solutions-delivery-engine';


import { HomeContactSection } from '../../../../_home/components/home-contact-section';

interface DigitalEngineeringViewProps {
  lang: string;
  dict: Dictionary;
}

export function DigitalEngineeringView({
  lang,
  dict,
}: DigitalEngineeringViewProps) {
  const isRtl = lang === 'ar';
  const data = digitalEngineeringData;

  const offeringsTitle = data.offeringsTitle[lang as 'en' | 'ar'] || data.offeringsTitle.en;
  const offeringsSubtitle = data.offeringsSubtitle[lang as 'en' | 'ar'] || data.offeringsSubtitle.en;

  const whyItMattersTitle = data.whyItMatters.title[lang as 'en' | 'ar'] || data.whyItMatters.title.en;
  const whyItMattersText = data.whyItMatters.text[lang as 'en' | 'ar'] || data.whyItMatters.text.en;

  const benefitsTitle = data.benefitsStrip.title[lang as 'en' | 'ar'] || data.benefitsStrip.title.en;
  const verticalsTitle = data.verticalsTitle[lang as 'en' | 'ar'] || data.verticalsTitle.en;
  const verticalsSubtitle = data.verticalsSubtitle[lang as 'en' | 'ar'] || data.verticalsSubtitle.en;

  const techStackTitle = data.techStackTitle[lang as 'en' | 'ar'] || data.techStackTitle.en;
  const techStackSubtitle = data.techStackSubtitle[lang as 'en' | 'ar'] || data.techStackSubtitle.en;

  const deliveryTitle = data.delivery.title[lang as 'en' | 'ar'] || data.delivery.title.en;
  const deliverySubtitle = data.delivery.subtitle[lang as 'en' | 'ar'] || data.delivery.subtitle.en;

  const faqsTitle = data.faqsTitle[lang as 'en' | 'ar'] || data.faqsTitle.en;
  const faqsSubtitle = data.faqsSubtitle[lang as 'en' | 'ar'] || data.faqsSubtitle.en;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
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

      {/* 2. Core Capabilities: 6 Cards with No Learn More Button */}
      <DigitalEngineeringOfferingsGrid
        offerings={data.offerings}
        title={offeringsTitle}
        subtitle={offeringsSubtitle}
        lang={lang}
      />

      {/* 3. Why It Matters Context */}
      <SolutionsWhyItMatters
        title={whyItMattersTitle}
        text={whyItMattersText}
        image={data.whyItMatters.image}
        lang={lang}
      />

      {/* 4. Strategic Benefits Strip */}
      <SolutionsBenefitsStrip
        title={benefitsTitle}
        image={data.benefitsStrip.image}
        benefits={data.benefitsStrip.benefits}
        lang={lang}
      />

      {/* 5. Domain Verticals (5 Markets) */}
      <DigitalEngineeringVerticalsSection
        verticals={data.verticals}
        title={verticalsTitle}
        subtitle={verticalsSubtitle}
        lang={lang}
      />

      {/* 6. Technology Stack Matrix */}
      <DigitalEngineeringTechStackSection
        pods={data.techStackPods}
        title={techStackTitle}
        subtitle={techStackSubtitle}
        lang={lang}
      />

      {/* 7. Featured Client Stories: Stacked Sticky Cards */}
      <FeaturedClientStories
        stories={data.clientStories}
        sectionBadge={isRtl ? 'قصص النجاح المميزة' : 'Featured Client Stories'}
        sectionTitle={isRtl ? 'هندسة برمجية تحويلية وأنظمة سحابية فائقة الأداء' : 'Transformative Digital Engineering & Proven Scale'}
        sectionSubtitle={isRtl ? 'اكتشف كيف ساهمت استراتيجيات بيرسيكي الهندسية في تحديث النظم الحيوية ومضاعفة سرعة التسليم للشركات الرائدة.' : 'See how event-driven distributed architectures and automated cloud platforms power mission-critical resilience across the region.'}
        lang={lang}
      />

      {/* 8. How We Deliver Differently */}
      <SolutionsDeliveryEngine
        title={deliveryTitle}
        subtitle={deliverySubtitle}
        image={data.delivery.image}
        pillars={data.delivery.pillars}
        lang={lang}
      />

      {/* 9. Solutions Insights: 2-Card Dynamic Carousel */}
      <InsightsSection
        items={data.insights}
        title={isRtl ? 'رؤى واستراتيجيات الهندسة الرقمية' : 'Insights & Engineering Architecture'}
        subtitle={isRtl ? 'أحدث الأبحاث العملية لتفكيك الأنظمة القديمة، ومعالجة الأحداث اللحظية، وهندسة موثوقية المواقع (SRE).' : 'Actionable playbooks on Strangler Fig modernization, petabyte-scale Kafka streams, and site reliability engineering.'}
        lang={lang}
      />

      {/* 10. Executive Client Review */}
      <ClientReviewSection
        quoteText={data.clientReview.quote}
        quoteAuthor={data.clientReview.author}
        quoteRole={data.clientReview.role}
        badge={data.clientReview.badge}
        lang={lang}
      />

      {/* 11. Solutions FAQs */}
      <FaqSection
        faqs={data.faqs}
        title={faqsTitle}
        subtitle={faqsSubtitle}
        lang={lang}
      />

      {/* 12. Full-Width Sticky Action Drawer */}
      <HomeContactSection dict={dict} lang={lang} />
    </div>
  );
}
