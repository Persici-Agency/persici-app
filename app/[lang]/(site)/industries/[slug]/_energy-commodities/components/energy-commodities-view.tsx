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
import { energyCommoditiesData } from '../data/energy-commodities.data';
import { EnergyCommoditiesOfferingsGrid } from './energy-commodities-offerings-grid';
import { EnergyCommoditiesVerticalsSection } from './energy-commodities-verticals-section';
import { EnergyCommoditiesTechStackSection } from './energy-commodities-tech-stack-section';
import { IndustrySubNavbar } from '../../_components/industry-sub-navbar';
import { SolutionsHeroSection } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-hero-section';
import { SolutionsWhyItMatters } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-why-it-matters';
import { SolutionsBenefitsStrip } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-benefits-strip';
import { SolutionsDeliveryEngine } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-delivery-engine';
import { HomeContactSection } from '@/app/[lang]/(site)/_home/components/home-contact-section';

interface EnergyCommoditiesViewProps {
  lang: string;
  dict: Dictionary;
}

export function EnergyCommoditiesView({ lang, dict }: EnergyCommoditiesViewProps) {
  const isRtl = lang === 'ar';
  const data = energyCommoditiesData;

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

      {/* 2. The Realities of Energy & Commodities (Carousel matching media_1788983489687.png) */}
      <IndustryRealitiesCarousel
        id="realities"
        items={data.futureStrip}
        title={isRtl ? 'واقع قطاع الطاقة وتجارة السلع' : 'The realities of energy and commodities'}
        subtitle={
          isRtl
            ? 'تواجه شركات الطاقة وتجارة السلع أسواقاً متقلبة، وأهداف إزالة الكربون، وسلاسل توريد معقدة، بينما تعتمد على أنظمة قديمة تحد من الرؤية والسرعة والمرونة التشغيلية.'
            : 'Energy and commodities companies are navigating volatile markets, decarbonization goals and complex supply chains while relying on legacy systems that limit visibility, speed and operational resilience.'
        }
        lang={lang}
      />

      {/* 3. An Agile Foundation for Energy & Commodities (3-Pillar Architecture Diagram) */}
      <div id="platforms">
        <IndustryAgileFoundationSection
          foundation={data.agileFoundation}
          lang={lang}
        />
      </div>

      {/* 4. Core Capabilities Grid (6 Cards, Unique Vector Diagrams, Pause Button) */}
      <div id="capabilities">
        <EnergyCommoditiesOfferingsGrid
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
        <EnergyCommoditiesVerticalsSection
          verticals={data.verticals}
          title={verticalsTitle}
          subtitle={verticalsSubtitle}
          lang={lang}
        />
      </div>

      {/* 8. Technology Stack (Dark #0E121B Matrix, Card Titles Remain White on Hover) */}
      <div id="tech-stack">
        <EnergyCommoditiesTechStackSection
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
              ? 'بنية تحتية مرنة وعمليات تداول طاقة عالية الموثوقية'
              : 'Mission-Critical Energy & Industrial Resilience'
          }
          sectionSubtitle={
            isRtl
              ? 'اكتشف كيف ساهمت معماريات بيرسيكي في استقرار شبكات الكهرباء وحماية هوامش تجارة السلع الإقليمية.'
              : 'Explore how our SCADA telemetry, quantitative trading hubs, and IoT predictive platforms transform energy enterprises.'
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
          title={isRtl ? 'رؤى وأبحاث الطاقة وتجارة السلع' : 'Energy & Commodities Insights'}
          subtitle={
            isRtl
              ? 'أحدث التحليلات الميدانية حول استقرار الشبكات الذكية، وتجارة السلع بالأقمار الصناعية، وإزالة الكربون.'
              : 'Technical playbooks on renewable integration, quantitative trading risk models, and Scope 1-3 carbon tracking.'
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
