'use client';

import React from 'react';
import { FeaturedClientStories, InsightsSection, FaqSection, ClientReviewSection } from '@shared';
import type { Dictionary } from '@dictionaries';
import { supplyChainData } from '../data/supply-chain.data';

import { SolutionsHeroSection } from '../../../_solutions/components/solutions-hero-section';
import { SupplyChainOfferingsGrid } from './supply-chain-offerings-grid';
import { SolutionsWhyItMatters } from '../../../_solutions/components/solutions-why-it-matters';
import { SolutionsBenefitsStrip } from '../../../_solutions/components/solutions-benefits-strip';
import { SupplyChainVerticalsSection } from './supply-chain-verticals-section';
import { SupplyChainTechStackSection } from './supply-chain-tech-stack-section';

import { SolutionsDeliveryEngine } from '../../../_solutions/components/solutions-delivery-engine';


import { HomeContactSection } from '../../../../_home/components/home-contact-section';

interface SupplyChainViewProps {
  lang: string;
  dict: Dictionary;
}

export function SupplyChainView({
  lang,
  dict,
}: SupplyChainViewProps) {
  const isRtl = lang === 'ar';
  const data = supplyChainData;

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
      <SupplyChainOfferingsGrid
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
      <SupplyChainVerticalsSection
        verticals={data.verticals}
        title={verticalsTitle}
        subtitle={verticalsSubtitle}
        lang={lang}
      />

      {/* 6. Technology Stack Matrix */}
      <SupplyChainTechStackSection
        pods={data.techStackPods}
        title={techStackTitle}
        subtitle={techStackSubtitle}
        lang={lang}
      />

      {/* 7. Featured Client Stories: Stacked Sticky Cards */}
      <FeaturedClientStories
        stories={data.clientStories}
        sectionBadge={isRtl ? 'قصص النجاح اللوجستية المميزة' : 'Featured Supply Chain Stories'}
        sectionTitle={isRtl ? 'تحول لوجستي رائد وشبكات إمداد فائقة الصمود' : 'Transformative Supply Chain & High-Velocity Logistics'}
        sectionSubtitle={isRtl ? 'اكتشف كيف ساهمت حلول بيرسيكي لسلاسل الإمداد في خفض تكاليف التشغيل ومضاعفة سرعة الوفاء بالطلبات.' : 'See how automated order routing, IoT cold-chains, and AI demand sensing power resilient logistics across the region.'}
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
        title={isRtl ? 'رؤى واستراتيجيات سلاسل الإمداد' : 'Insights & Logistics Architecture'}
        subtitle={isRtl ? 'أحدث الأبحاث العملية لأبراج المراقبة المستقلة، والمتاجر المظلمة، والتنبؤ بالطلب بالذكاء الاصطناعي.' : 'Actionable playbooks on autonomous control towers, dark stores, and AI demand sensing across the Middle East.'}
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
