'use client';

import React from 'react';
import type { Dictionary } from '@dictionaries';
import { HomeContactSection } from '../../../../_home/components/home-contact-section';
import { SolutionsHeroSection } from '../../../_solutions/components/solutions-hero-section';
import { SolutionsWhyItMatters } from '../../../_solutions/components/solutions-why-it-matters';
import { SolutionsBenefitsStrip } from '../../../_solutions/components/solutions-benefits-strip';
import { StackedFeaturedClientStories } from '../../../_solutions/components/stacked-featured-client-stories';
import { SolutionsDeliveryEngine } from '../../../_solutions/components/solutions-delivery-engine';
import { SolutionsInsightsSection } from '../../../_solutions/components/solutions-insights-section';
import { SolutionsClientReview } from '../../../_solutions/components/solutions-client-review';
import { SolutionsFaqSection } from '../../../_solutions/components/solutions-faq-section';

import { applicationManagementData } from '../data/application-management.data';
import { ApplicationOfferingsGrid } from './application-offerings-grid';
import { ApplicationVerticalsSection } from './application-verticals-section';
import { ApplicationTechStackSection } from './application-tech-stack-section';

export interface ApplicationManagementViewProps {
  lang: string;
  dict: Dictionary;
}

export function ApplicationManagementView({ lang, dict }: ApplicationManagementViewProps) {
  const isRtl = lang === 'ar';
  const data = applicationManagementData;

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
      {/* 1. Dynamic Hero Section */}
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

      {/* 2. 5 Core Engineering Pillars */}
      <ApplicationOfferingsGrid
        offerings={data.offerings}
        title={offeringsTitle}
        subtitle={offeringsSubtitle}
        lang={lang}
      />

      {/* 3. Why It Matters Context */}
      <SolutionsWhyItMatters
        title={whyTitle}
        text={whyText}
        image={data.whyItMatters.image}
        lang={lang}
      />

      {/* 4. Benefits Strip */}
      <SolutionsBenefitsStrip
        title={benefitsTitle}
        image={data.benefitsStrip.image}
        benefits={data.benefitsStrip.benefits}
        lang={lang}
      />

      {/* 5. 5 Industry Verticals */}
      <ApplicationVerticalsSection
        verticals={data.verticals}
        title={verticalsTitle}
        subtitle={verticalsSubtitle}
        lang={lang}
      />

      {/* 6. Modern Tech Stack Matrix */}
      <ApplicationTechStackSection
        pods={data.techStackPods}
        title={techTitle}
        subtitle={techSubtitle}
        lang={lang}
      />

      {/* 7. Featured Client Stories (Hala Food & FinVibe in 3D Stacked Sticky Cards) */}
      <StackedFeaturedClientStories
        stories={data.clientStories}
        sectionBadge={isRtl ? 'قصص النجاح المميزة' : 'Featured Case Studies'}
        sectionTitle={
          isRtl
            ? 'تطبيقات صنعت فارقاً حقيقياً في السوق'
            : 'Applications engineered for measurable enterprise impact'
        }
        sectionSubtitle={
          isRtl
            ? 'اكتشف كيف ساهمت تطبيقات بيرسيكي في تسريع وتيرة النمو ومضاعفة الإيرادات لعملائنا.'
            : 'Explore how our high-velocity mobile engineering drives customer retention and commercial scale.'
        }
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

      {/* 9. Standalone Insights Section */}
      <SolutionsInsightsSection
        items={data.insights}
        title={isRtl ? 'أحدث الرؤى والأفكار' : 'Our Latest Thinking'}
        subtitle={
          isRtl
            ? 'استكشف أحدث المقالات والتحليلات المعمارية في هندسة وتطوير التطبيقات.'
            : 'Architectural blueprints, technical deep dives, and product leadership perspectives.'
        }
        lang={lang}
      />

      {/* 10. Client Review Standalone Monospace Quote */}
      <SolutionsClientReview
        quoteText={data.clientReview.quote}
        quoteAuthor={data.clientReview.author}
        quoteRole={data.clientReview.role}
        badge={data.clientReview.badge}
        lang={lang}
      />

      {/* 11. FAQs Accordion */}
      <SolutionsFaqSection
        title={faqsTitle}
        subtitle={faqsSubtitle}
        faqs={data.faqs}
        lang={lang}
      />

      {/* 12. Global Contact Section */}
      <div id="contact">
        <HomeContactSection lang={lang} dict={dict} />
      </div>
    </div>
  );
}
