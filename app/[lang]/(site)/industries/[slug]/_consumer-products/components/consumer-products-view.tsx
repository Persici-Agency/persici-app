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
import { ConsumerProductsOfferingsGrid } from './consumer-products-offerings-grid';
import { ConsumerProductsVerticalsSection } from './consumer-products-verticals-section';
import { ConsumerProductsTechStackSection } from './consumer-products-tech-stack-section';

interface ConsumerProductsViewProps {
  data?: IndustryFeatureCmsData;
  lang: string;
  dict: Dictionary;
}

export function ConsumerProductsView({
  data: propData,
  lang,
  dict,
}: ConsumerProductsViewProps) {
  const data = propData || getDefaultIndustryFeatureCmsData('consumer-products');
  const l = lang as 'en' | 'ar';
  const isRtl = l === 'ar';

  const realitiesBadge =
    data.realities?.badge?.[l] ||
    data.realities?.badge?.en ||
    (isRtl ? 'واقع السوق والتحديات' : 'Market Realities');
  const realitiesTitle =
    data.realities?.title?.[l] ||
    data.realities?.title?.en ||
    (isRtl ? 'واقع قطاع المنتجات الاستهلاكية' : 'The realities of consumer products');
  const realitiesSubtitle =
    data.realities?.subtitle?.[l] ||
    data.realities?.subtitle?.en ||
    (isRtl
      ? 'تواجه العلامات الاستهلاكية تشتتاً في بيانات العملاء وتقلبات متسارعة في سلاسل التوريد، بينما تتطلب المنافسة تجارب استثنائية متصلة واستدامة موثقة.'
      : 'Consumer products enterprises are navigating shifting consumer behaviors, omnichannel fragmentation, and volatile supply networks while striving to deliver personalized, sustainable brand experiences.');

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
        <ConsumerProductsOfferingsGrid
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
        <ConsumerProductsVerticalsSection
          verticals={data.verticals}
          badge={verticalsBadge}
          title={verticalsTitle}
          subtitle={verticalsSubtitle}
          lang={lang}
        />
      )}

      {/* 8. 4-Pod Technology & Platform Stack */}
      {data.techStackEnabled !== false && (
        <ConsumerProductsTechStackSection
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
              ? 'نمو قياسي وهوامش ربحية استثنائية في قطاع التجزئة'
              : 'Transforming Consumer Brands Across Regional Markets')
          }
          sectionSubtitle={
            csCfg?.subtitle?.[l] ||
            csCfg?.subtitle?.en ||
            (isRtl
              ? 'تعرف على كيفية مساهمة معماريات بيرسيشي في مضاعفة المبيعات المباشرة وولاء المستهلكين لعلامات كبرى.'
              : 'Explore how our commerce, inventory, and retention architectures power sustained commercial growth for premier consumer enterprises.')
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
              en: 'Consumer Industry Insights',
              ar: 'رؤى وأبحاث المنتجات الاستهلاكية',
            }
          }
          subtitle={
            insCfg?.subtitle || {
              en: 'Executive perspectives on omnichannel retail velocity, D2C margins, and sustainable supply chains.',
              ar: 'أحدث التحليلات الميدانية حول استراتيجيات البيع المباشر، وتنبؤ الطلب، والامتثال البيئي للمنتجات.',
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
