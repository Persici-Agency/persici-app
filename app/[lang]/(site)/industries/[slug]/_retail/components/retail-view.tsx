'use client';

import React from 'react';
import {
  FeaturedClientStories,
  InsightsSection,
  FaqSection,
  ClientReviewSection,
  IndustryAgileFoundationSection,
  IndustryRealitiesCarousel,
} from '@shared';
import type { Dictionary } from '@dictionaries';
import { retailData } from '../data/retail.data';
import { RetailOfferingsGrid } from './retail-offerings-grid';
import { RetailVerticalsSection } from './retail-verticals-section';
import { RetailTechStackSection } from './retail-tech-stack-section';
import { IndustrySubNavbar } from '../../_components/industry-sub-navbar';
import { SolutionsHeroSection } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-hero-section';
import { SolutionsWhyItMatters } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-why-it-matters';
import { SolutionsBenefitsStrip } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-benefits-strip';
import { SolutionsDeliveryEngine } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-delivery-engine';
import { HomeContactSection } from '@/app/[lang]/(site)/_home/components/home-contact-section';

interface RetailViewProps {
  lang: string;
  dict: Dictionary;
}

export function RetailView({ lang, dict }: RetailViewProps) {
  const isRtl = lang === 'ar';
  const data = retailData;

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

      {/* Dedicated Sticky Industry Sub-Navbar (media_1788983591126.png) */}
      <IndustrySubNavbar lang={lang} />

      {/* 2. The Realities of Retail (Carousel matching media_1788983489687.png) */}
      <IndustryRealitiesCarousel
        id="realities"
        items={data.futureStrip}
        title={isRtl ? 'واقع قطاع تجارة التجزئة' : 'The realities of retail'}
        subtitle={
          isRtl
            ? 'تواجه شركات التجزئة انفصال القنوات المادية عن الرقمية وتوقعات متزايدة للعملاء وسرعات توصيل قياسية، بينما تتطلب الهوامش الربحية بيانات مباشرة دقيقة.'
            : 'Retailers must overcome disparate channel architectures, rising consumer immediacy, and complex inventory routing to maintain relevance and protect operating margins.'
        }
        lang={lang}
      />

      {/* 3. An Agile Foundation for Retail (3-Pillar Architecture Diagram) */}
      <div id="platforms">
        <IndustryAgileFoundationSection
          foundation={data.agileFoundation}
          lang={lang}
        />
      </div>

      {/* 4. Core Capabilities Grid (6 Cards, Unique Vector Diagrams, Pause Button) */}
      <div id="capabilities">
        <RetailOfferingsGrid
          offerings={data.offerings}
          title={offeringsTitle}
          subtitle={offeringsSubtitle}
          lang={lang}
        />
      </div>

      {/* 5. Why It Matters (Split Layout + Image) */}
      <div id="why-it-matters">
        <SolutionsWhyItMatters
          title={whyTitle}
          text={whyText}
          image={data.whyItMatters.image}
          lang={lang}
        />
      </div>

      {/* 6. Strategic Benefits Strip (Banner with 4 Strategic Pillars) */}
      <SolutionsBenefitsStrip
        title={benefitsTitle}
        image={data.benefitsStrip.image}
        benefits={data.benefitsStrip.benefits}
        lang={lang}
      />

      {/* 7. Sub-Sectors / Domain Verticals (01-04 Monospace Badges) */}
      <div id="use-cases">
        <RetailVerticalsSection
          verticals={data.verticals}
          title={verticalsTitle}
          subtitle={verticalsSubtitle}
          lang={lang}
        />
      </div>

      {/* 8. Technology Stack (Dark #0E121B Matrix, Card Titles Remain White on Hover) */}
      <div id="tech-stack">
        <RetailTechStackSection
          pods={data.techStackPods}
          title={techTitle}
          subtitle={techSubtitle}
          lang={lang}
        />
      </div>

      {/* 9. Featured Client Stories (Stacked Sticky Cards + Scroll Scale-Out) */}
      <div id="customer-stories">
        <FeaturedClientStories
          stories={data.clientStories}
          sectionBadge={isRtl ? 'قصص النجاح المميزة' : 'Featured Client Stories'}
          sectionTitle={
            isRtl
              ? 'نجاحات تجارية استثنائية ونمو متسارع في قطاع التجزئة'
              : 'Transforming Retail Experiences Across Physical & Digital'
          }
          sectionSubtitle={
            isRtl
              ? 'اكتشف كيف ساهمت معماريات بيرسيكي في القضاء على نفاد المخزون ومضاعفة مبيعات كبرى سلاسل المتاجر.'
              : 'Explore how our composable commerce, mobile clienteling, and distributed order management engines drive retail profitability.'
          }
          lang={lang}
        />
      </div>

      {/* 10. How We Deliver Differently (Diagonal Brand Gradient) */}
      <SolutionsDeliveryEngine
        title={deliveryTitle}
        subtitle={deliverySubtitle}
        image={data.delivery.image}
        pillars={data.delivery.pillars}
        lang={lang}
      />

      {/* 11. Industry Insights (Dynamic 2-Card ContentCarousel) */}
      <div id="research">
        <InsightsSection
          items={data.insights}
          title={isRtl ? 'رؤى وأبحاث قطاع التجزئة' : 'Omnichannel Retail Insights'}
          subtitle={
            isRtl
              ? 'أحدث التحليلات الميدانية حول التجارة الموحدة، وتحويل المتاجر لمراكز شحن، وتحسين اللوجستيات العكسية.'
              : 'Executive playbooks on unified retail architectures, ship-from-store economics, and reverse logistics.'
          }
          lang={lang}
        />
      </div>

      {/* 12. Executive Client Review */}
      <ClientReviewSection
        quoteText={data.clientReview.quote}
        quoteAuthor={data.clientReview.author}
        quoteRole={data.clientReview.role}
        badge={data.clientReview.badge}
        lang={lang}
      />

      {/* 13. Enterprise FAQs Accordion */}
      <FaqSection
        faqs={data.faqs}
        title={faqsTitle}
        subtitle={faqsSubtitle}
        lang={lang}
      />

      {/* 14. Global Contact Section */}
      <div id="contact">
        <HomeContactSection dict={dict} lang={lang} />
      </div>
    </div>
  );
}
