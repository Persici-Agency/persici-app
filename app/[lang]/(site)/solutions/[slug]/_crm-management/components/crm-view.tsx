'use client';

import React from 'react';
import { FeaturedClientStories, InsightsSection, FaqSection, ClientReviewSection } from '@shared';
import type { Dictionary } from '@dictionaries';
import { crmManagementData } from '../data/crm-management.data';

import { SolutionsHeroSection } from '../../../_solutions/components/solutions-hero-section';
import { CrmOfferingsGrid } from './crm-offerings-grid';
import { SolutionsWhyItMatters } from '../../../_solutions/components/solutions-why-it-matters';
import { SolutionsBenefitsStrip } from '../../../_solutions/components/solutions-benefits-strip';
import { CrmVerticalsSection } from './crm-verticals-section';
import { CrmTechStackSection } from './crm-tech-stack-section';
import { SolutionsDeliveryEngine } from '../../../_solutions/components/solutions-delivery-engine';
import { HomeContactSection } from '../../../../_home/components/home-contact-section';

interface CrmManagementViewProps {
  lang: string;
  dict: Dictionary;
}

export function CrmManagementView({
  lang,
  dict,
}: CrmManagementViewProps) {
  const isRtl = lang === 'ar';
  const data = crmManagementData;

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
      <CrmOfferingsGrid
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
      <CrmVerticalsSection
        verticals={data.verticals}
        title={verticalsTitle}
        subtitle={verticalsSubtitle}
        lang={lang}
      />

      {/* 6. Technology Stack Matrix */}
      <CrmTechStackSection
        pods={data.techStackPods}
        title={techStackTitle}
        subtitle={techStackSubtitle}
        lang={lang}
      />

      {/* 7. Featured Client Stories: Stacked Sticky Cards */}
      <FeaturedClientStories
        stories={data.clientStories}
        sectionBadge={isRtl ? 'قصص النجاح التسويقية المميزة' : 'Featured CRM Client Stories'}
        sectionTitle={isRtl ? 'عائد استثماري فائق وتجارب عملاء تضاعف ولاء العلامة' : 'Proven Marketing ROI & Compounding Customer Lifetime Value'}
        sectionSubtitle={isRtl ? 'اكتشف كيف ساهمت استراتيجيات بيرسيكي في إدارة علاقات العملاء في مضاعفة تكرار الشراء وخفض تكاليف الاستحواذ.' : 'See how automated Braze Canvas journeys, WhatsApp Business API, and predictive RFM cohorts drive exponential enterprise growth.'}
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
        title={isRtl ? 'رؤى واستراتيجيات إدارة علاقات العملاء' : 'Insights & CRM Architecture'}
        subtitle={isRtl ? 'أحدث الأبحاث العملية لأتمتة دورة حياة العميل، وواتساب للأعمال، وتوقيت الإرسال الأمثل بالذكاء الاصطناعي.' : 'Actionable playbooks on Braze Canvas architecture, WhatsApp Cloud API, and AI send-time optimization.'}
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
