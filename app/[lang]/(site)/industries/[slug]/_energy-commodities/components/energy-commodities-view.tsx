'use client';

import React from 'react';
import type { Dictionary } from '@dictionaries';
import {
  getDefaultIndustryFeatureCmsData,
  type IndustryFeatureCmsData,
} from '../../../_industries/data/industries-cms.data';
import {
  SolutionsHeroSection,
  SolutionsWhyItMatters,
  SolutionsBenefitsStrip,
  SolutionsDeliveryEngine,
} from '@/app/[lang]/(site)/solutions/_solutions';
import {
  FeaturedClientStories,
  InsightsSection,
  ClientReviewSection,
  FaqSection,
  IndustryRealitiesCarousel,
  IndustryAgileFoundationSection,
} from '@shared';
import { HomeContactSection } from '../../../../_home/components/home-contact-section';
import { EnergyCommoditiesOfferingsGrid } from './energy-commodities-offerings-grid';
import { EnergyCommoditiesVerticalsSection } from './energy-commodities-verticals-section';
import { EnergyCommoditiesTechStackSection } from './energy-commodities-tech-stack-section';

interface EnergyCommoditiesViewProps {
  data?: IndustryFeatureCmsData;
  lang: string;
  dict: Dictionary;
}

export function EnergyCommoditiesView({
  data: propData,
  lang,
  dict,
}: EnergyCommoditiesViewProps) {
  const data = propData || getDefaultIndustryFeatureCmsData('energy-commodities');
  const l = lang as 'en' | 'ar';
  const isRtl = l === 'ar';

  const realitiesBadge =
    data.realities?.badge?.[l] ||
    data.realities?.badge?.en ||
    (isRtl ? 'واقع السوق والتحديات' : 'Market Realities');
  const realitiesTitle =
    data.realities?.title?.[l] ||
    data.realities?.title?.en ||
    (isRtl ? 'واقع قطاع الطاقة وتجارة السلع' : 'The realities of energy and commodities');
  const realitiesSubtitle =
    data.realities?.subtitle?.[l] ||
    data.realities?.subtitle?.en ||
    (isRtl
      ? 'تواجه شركات الطاقة وتجارة السلع أسواقاً متقلبة، وأهداف إزالة الكربون، وسلاسل توريد معقدة، بينما تعتمد على أنظمة قديمة تحد من الرؤية والسرعة والمرونة التشغيلية.'
      : 'Energy and commodities companies are navigating volatile markets, decarbonization goals and complex supply chains while relying on legacy systems that limit visibility, speed and operational resilience.');

  const offeringsBadge = data.offeringsBadge?.[l] || data.offeringsBadge?.en;
  const offeringsTitle = data.offeringsTitle[l] || data.offeringsTitle.en;
  const offeringsSubtitle = data.offeringsSubtitle[l] || data.offeringsSubtitle.en;

  const whyTitle = data.whyItMatters.title[l] || data.whyItMatters.title.en;
  const whyText = data.whyItMatters.text[l] || data.whyItMatters.text.en;

  const benefitsTitle = data.benefitsStrip.title[l] || data.benefitsStrip.title.en;

  const verticalsBadge = data.verticalsBadge?.[l] || data.verticalsBadge?.en;
  const verticalsTitle = data.verticalsTitle[l] || data.verticalsTitle.en;
  const verticalsSubtitle = data.verticalsSubtitle[l] || data.verticalsSubtitle.en;

  const techBadge = data.techStackBadge?.[l] || data.techStackBadge?.en;
  const techTitle = data.techStackTitle[l] || data.techStackTitle.en;
  const techSubtitle = data.techStackSubtitle[l] || data.techStackSubtitle.en;

  const deliveryTitle = data.delivery.title[l] || data.delivery.title.en;
  const deliverySubtitle = data.delivery.subtitle[l] || data.delivery.subtitle.en;

  const faqsTitle = data.faqsTitle[l] || data.faqsTitle.en;
  const faqsSubtitle = data.faqsSubtitle[l] || data.faqsSubtitle.en;

  const csCfg = data.clientStoriesConfig;
  const insCfg = data.insightsConfig;

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Split Hero Section */}
      {data.hero.enabled !== false && (
        <SolutionsHeroSection
          tag={data.hero.tag}
          secondaryTag={data.hero.secondaryTag}
          title={data.hero.title}
          subtitle={data.hero.subtitle}
          ctaText={data.hero.ctaText}
          ctaHref={data.hero.ctaHref}
          image={data.hero.image}
          lang={lang}
        />
      )}

      {/* 2. Industry Realities Panoramic Carousel */}
      {data.realities?.enabled !== false && (
        <IndustryRealitiesCarousel
          badge={realitiesBadge}
          title={realitiesTitle}
          subtitle={realitiesSubtitle}
          items={data.futureStrip}
          lang={lang}
        />
      )}

      {/* 3. Architectural Blueprint: Agile Foundation */}
      {data.agileFoundation?.enabled !== false && (
        <IndustryAgileFoundationSection
          foundation={data.agileFoundation}
          sectionBadge={data.agileFoundation.sectionBadge}
          lang={lang}
        />
      )}

      {/* 4. 6-Card Capability Grid */}
      {data.offeringsEnabled !== false && (
        <EnergyCommoditiesOfferingsGrid
          offerings={data.offerings}
          badge={offeringsBadge}
          title={offeringsTitle}
          subtitle={offeringsSubtitle}
          lang={lang}
        />
      )}

      {/* 5. Why It Matters Split Section */}
      {data.whyItMatters.enabled !== false && (
        <SolutionsWhyItMatters
          title={whyTitle}
          text={whyText}
          image={data.whyItMatters.image}
          metric1Val={data.whyItMatters.metric1Val}
          metric1Label={data.whyItMatters.metric1Label}
          metric2Val={data.whyItMatters.metric2Val}
          metric2Label={data.whyItMatters.metric2Label}
          lang={lang}
        />
      )}

      {/* 6. 3-Column Strategic Benefits Strip */}
      {data.benefitsStrip.enabled !== false && (
        <SolutionsBenefitsStrip
          title={benefitsTitle}
          image={data.benefitsStrip.image}
          benefits={data.benefitsStrip.benefits}
          lang={lang}
        />
      )}

      {/* 7. Domain Verticals Showcase */}
      {data.verticalsEnabled !== false && (
        <EnergyCommoditiesVerticalsSection
          verticals={data.verticals}
          badge={verticalsBadge}
          title={verticalsTitle}
          subtitle={verticalsSubtitle}
          lang={lang}
        />
      )}

      {/* 8. 4-Pod Technology & Platform Stack */}
      {data.techStackEnabled !== false && (
        <EnergyCommoditiesTechStackSection
          pods={data.techStackPods}
          badge={techBadge}
          title={techTitle}
          subtitle={techSubtitle}
          lang={lang}
        />
      )}

      {/* 9. Featured Client Stories */}
      {csCfg?.enabled !== false && (
        <FeaturedClientStories
          stories={data.clientStories}
          lang={lang}
          sectionBadge={
            csCfg?.badge?.[l] ||
            csCfg?.badge?.en ||
            (isRtl ? 'قصص النجاح المميزة' : 'Featured Client Stories')
          }
          sectionTitle={
            csCfg?.title?.[l] ||
            csCfg?.title?.en ||
            (isRtl
              ? 'بنية تحتية مرنة وعمليات تداول طاقة عالية الموثوقية'
              : 'Mission-Critical Energy & Industrial Resilience')
          }
          sectionSubtitle={
            csCfg?.subtitle?.[l] ||
            csCfg?.subtitle?.en ||
            (isRtl
              ? 'اكتشف كيف ساهمت معماريات بيرسيشي في استقرار شبكات الكهرباء وحماية هوامش تجارة السلع الإقليمية.'
              : 'Explore how our SCADA telemetry, quantitative trading hubs, and IoT predictive platforms transform energy enterprises.')
          }
        />
      )}

      {/* 10. 4-Phase Delivery Engine */}
      {data.delivery.enabled !== false && (
        <SolutionsDeliveryEngine
          badge={data.delivery.badge}
          title={deliveryTitle}
          subtitle={deliverySubtitle}
          image={data.delivery.image}
          pillars={data.delivery.pillars}
          lang={lang}
        />
      )}

      {/* 11. Insights Section */}
      {insCfg?.enabled !== false && (
        <InsightsSection
          title={
            insCfg?.title || {
              en: 'Energy & Commodities Insights',
              ar: 'رؤى وأبحاث الطاقة وتجارة السلع',
            }
          }
          subtitle={
            insCfg?.subtitle || {
              en: 'Technical playbooks on renewable integration, quantitative trading risk models, and Scope 1-3 carbon tracking.',
              ar: 'أحدث التحليلات الميدانية حول استقرار الشبكات الذكية، وتجارة السلع بالأقمار الصناعية، وإزالة الكربون.',
            }
          }
          ctaText={insCfg?.ctaText}
          ctaHref={insCfg?.ctaHref || '/insights'}
          items={data.insights}
          lang={lang}
        />
      )}

      {/* 12. Client Review / Executive Quote */}
      {data.clientReview.enabled !== false && (
        <ClientReviewSection
          quoteText={data.clientReview.quote}
          quoteAuthor={data.clientReview.author}
          quoteRole={data.clientReview.role}
          badge={data.clientReview.badge}
          quoteAvatar={data.clientReview.avatar}
          lang={lang}
        />
      )}

      {/* 13. FAQs Section */}
      {data.faqsEnabled !== false && (
        <FaqSection
          title={faqsTitle}
          subtitle={faqsSubtitle}
          faqs={data.faqs}
          lang={lang}
        />
      )}

      {/* 14. Shared Contact Section */}
      {data.contactEnabled !== false && <HomeContactSection dict={dict} lang={lang} />}
    </main>
  );
}
