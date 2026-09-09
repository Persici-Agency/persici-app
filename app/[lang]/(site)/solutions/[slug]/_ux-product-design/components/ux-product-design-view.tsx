'use client';

import React from 'react';
import { FeaturedClientStories, InsightsSection, FaqSection, ClientReviewSection } from '@shared';
import type { Dictionary } from '@dictionaries';
import { uxProductDesignData } from '../data/ux-product-design.data';
import { UxOfferingsGrid } from './ux-offerings-grid';
import { UxVerticalsSection } from './ux-verticals-section';
import { UxTechStackSection } from './ux-tech-stack-section';
import { SolutionsHeroSection } from '../../../_solutions/components/solutions-hero-section';
import { SolutionsWhyItMatters } from '../../../_solutions/components/solutions-why-it-matters';
import { SolutionsBenefitsStrip } from '../../../_solutions/components/solutions-benefits-strip';

import { SolutionsDeliveryEngine } from '../../../_solutions/components/solutions-delivery-engine';


import { HomeContactSection } from '../../../../_home/components/home-contact-section';

interface UxProductDesignViewProps {
  lang: string;
  dict: Dictionary;
}

export function UxProductDesignView({ lang, dict }: UxProductDesignViewProps) {
  const isRtl = lang === 'ar';
  const data = uxProductDesignData;

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

      {/* 2. Core Capabilities Grid (6 Cards, Responsive 3-col with Centered Remainder) */}
      <UxOfferingsGrid
        offerings={data.offerings}
        title={offeringsTitle}
        subtitle={offeringsSubtitle}
        lang={lang}
      />

      {/* 3. Why It Matters (Split Layout + Image) */}
      <SolutionsWhyItMatters
        title={whyTitle}
        text={whyText}
        image={data.whyItMatters.image}
        lang={lang}
      />

      {/* 4. Strategic Benefits Strip (Banner with 4 Strategic Pillars) */}
      <SolutionsBenefitsStrip
        title={benefitsTitle}
        image={data.benefitsStrip.image}
        benefits={data.benefitsStrip.benefits}
        lang={lang}
      />

      {/* 5. Domain Verticals (01-05 Monospace Badges & Checklists) */}
      <UxVerticalsSection
        verticals={data.verticals}
        title={verticalsTitle}
        subtitle={verticalsSubtitle}
        lang={lang}
      />

      {/* 6. Technology Stack (Dark #0E121B Matrix) */}
      <UxTechStackSection
        pods={data.techStackPods}
        title={techTitle}
        subtitle={techSubtitle}
        lang={lang}
      />

      {/* 7. Featured Client Stories (Stacked Sticky Cards + Scroll Scale-Out) */}
      <FeaturedClientStories
        stories={data.clientStories}
        sectionBadge={isRtl ? 'قصص النجاح المميزة' : 'Featured Client Stories'}
        sectionTitle={isRtl ? 'تجارب رقمية استثنائية ونمو متسارع في التحويل' : 'Transformative Digital Products & Proven User Growth'}
        sectionSubtitle={isRtl ? 'اكتشف كيف ساهمت منهجية بيرسيكي في تصميم المنتجات في مضاعفة تحويلات كبرى المنصات والعلامات الإقليمية.' : 'See how human-centered UX architecture and living design systems scale top regional and global digital brands.'}
        lang={lang}
      />

      {/* 8. How We Deliver Differently (Diagonal Brand Gradient) */}
      <SolutionsDeliveryEngine
        title={deliveryTitle}
        subtitle={deliverySubtitle}
        image={data.delivery.image}
        pillars={data.delivery.pillars}
        lang={lang}
      />

      {/* 9. Solutions Insights (Dynamic 2-Card ContentCarousel) */}
      <InsightsSection
        items={data.insights}
        title={isRtl ? 'رؤى وأفكار في تصميم المنتجات وتجربة المستخدم' : 'Insights & Strategic Product Architecture'}
        subtitle={isRtl ? 'أحدث الدراسات العملية لمنهجيات التصميم، وتقليل الإرهاق المعرفي، وربط فيجما بكود الواجهات.' : 'Actionable playbooks on living design systems, cognitive friction elimination, and Figma-to-code architectures.'}
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

      {/* 11. Enterprise FAQs Accordion */}
      <FaqSection
        faqs={data.faqs}
        title={faqsTitle}
        subtitle={faqsSubtitle}
        lang={lang}
      />

      {/* 12. Global Contact Section */}
      <div id="contact">
        <HomeContactSection dict={dict} lang={lang} />
      </div>
    </div>
  );
}
