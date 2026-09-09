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
import { healthData } from '../data/health.data';
import { HealthOfferingsGrid } from './health-offerings-grid';
import { HealthVerticalsSection } from './health-verticals-section';
import { HealthTechStackSection } from './health-tech-stack-section';
import { IndustrySubNavbar } from '../../_components/industry-sub-navbar';
import { SolutionsHeroSection } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-hero-section';
import { SolutionsWhyItMatters } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-why-it-matters';
import { SolutionsBenefitsStrip } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-benefits-strip';
import { SolutionsDeliveryEngine } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-delivery-engine';
import { HomeContactSection } from '@/app/[lang]/(site)/_home/components/home-contact-section';

interface HealthViewProps {
  lang: string;
  dict: Dictionary;
}

export function HealthView({ lang, dict }: HealthViewProps) {
  const isRtl = lang === 'ar';
  const data = healthData;

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

      {/* 2. The Realities of Health & Life Sciences (Carousel matching media_1788983489687.png) */}
      <IndustryRealitiesCarousel
        id="realities"
        items={data.futureStrip}
        title={isRtl ? 'واقع قطاع الرعاية الصحية وعلوم الحياة' : 'The realities of healthcare and life sciences'}
        subtitle={
          isRtl
            ? 'تواجه مؤسسات الرعاية الصحية تشتتاً في السجلات السريرية وإجهاداً متزايداً للكوادر الطبية، بينما تتطلب سلامة المرضى وخصوصيتهم امتثالاً لا يقبل التهاون.'
            : 'Healthcare systems are navigating disconnected clinical architectures, clinician cognitive overload, and strict sovereign privacy mandates while striving to deliver continuous, patient-centric care.'
        }
        lang={lang}
      />

      {/* 3. An Agile Foundation for Health (3-Pillar Architecture Diagram) */}
      <div id="platforms">
        <IndustryAgileFoundationSection
          foundation={data.agileFoundation}
          lang={lang}
        />
      </div>

      {/* 4. Core Capabilities Grid (6 Cards, Unique Vector Diagrams, Pause Button) */}
      <div id="capabilities">
        <HealthOfferingsGrid
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
        <HealthVerticalsSection
          verticals={data.verticals}
          title={verticalsTitle}
          subtitle={verticalsSubtitle}
          lang={lang}
        />
      </div>

      {/* 8. Technology Stack (Dark #0E121B Matrix, Card Titles Remain White on Hover) */}
      <div id="tech-stack">
        <HealthTechStackSection
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
              ? 'أثر سريري ملموس وأنظمة رعاية صحية رقمية موثوقة'
              : 'Validated Clinical Impact & Healthcare Scalability'
          }
          sectionSubtitle={
            isRtl
              ? 'اكتشف كيف ساهمت منصات بيرسيكي للطب الاتصالي والسجلات الطبية الموحدة في خدمة مئات الآلاف من المرضى.'
              : 'Explore how our telehealth, FHIR interoperability, and clinical AI platforms transform regional healthcare systems.'
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
          title={isRtl ? 'رؤى وأبحاث الرعاية الصحية' : 'Healthcare & Life Sciences Insights'}
          subtitle={
            isRtl
              ? 'أحدث التحليلات الميدانية حول معايير FHIR، والمتابعة الحيوية للأمراض المزمنة، والسحب الصحية السيادية.'
              : 'Clinical whitepapers on FHIR R4 interoperability, ambient remote patient telemetry, and sovereign health clouds.'
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
