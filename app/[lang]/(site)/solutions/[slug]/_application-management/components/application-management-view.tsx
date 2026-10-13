'use client';

import React from 'react';
import { FeaturedClientStories, InsightsSection, FaqSection, ClientReviewSection } from '@shared';
import type { Dictionary } from '@dictionaries';
import {
  getDefaultSolutionFeatureCmsData,
  type SolutionFeatureCmsData,
} from '../../../_solutions/data/solutions-cms.data';
import { ApplicationOfferingsGrid } from './application-offerings-grid';
import { ApplicationVerticalsSection } from './application-verticals-section';
import { ApplicationTechStackSection } from './application-tech-stack-section';
import { SolutionsHeroSection } from '../../../_solutions/components/solutions-hero-section';
import { SolutionsWhyItMatters } from '../../../_solutions/components/solutions-why-it-matters';
import { SolutionsBenefitsStrip } from '../../../_solutions/components/solutions-benefits-strip';
import { SolutionsDeliveryEngine } from '../../../_solutions/components/solutions-delivery-engine';
import { HomeContactSection } from '../../../../_home/components/home-contact-section';

export interface ApplicationManagementViewProps {
  lang: string;
  dict: Dictionary;
  data?: SolutionFeatureCmsData;
}

export function ApplicationManagementView({ lang, dict, data: propData }: ApplicationManagementViewProps) {
  const l = lang as 'en' | 'ar';
  const data = propData || getDefaultSolutionFeatureCmsData('application-management');

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

  const csConfig = data.clientStoriesConfig;
  const insConfig = data.insightsConfig;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner */}
      {data.hero.enabled !== false && (
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
      )}

      {/* 2. Core Capabilities Grid */}
      {data.offeringsEnabled !== false && (
        <ApplicationOfferingsGrid
          badge={offeringsBadge}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          offerings={data.offerings as any}
          title={offeringsTitle}
          subtitle={offeringsSubtitle}
          lang={lang}
        />
      )}

      {/* 3. Why It Matters */}
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

      {/* 4. Strategic Benefits Strip */}
      {data.benefitsStrip.enabled !== false && (
        <SolutionsBenefitsStrip
          title={benefitsTitle}
          image={data.benefitsStrip.image}
          benefits={data.benefitsStrip.benefits}
          lang={lang}
        />
      )}

      {/* 5. Domain Verticals */}
      {data.verticalsEnabled !== false && (
        <ApplicationVerticalsSection
          badge={verticalsBadge}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          verticals={data.verticals as any}
          title={verticalsTitle}
          subtitle={verticalsSubtitle}
          lang={lang}
        />
      )}

      {/* 6. Technology Stack */}
      {data.techStackEnabled !== false && (
        <ApplicationTechStackSection
          badge={techBadge}
          pods={data.techStackPods}
          title={techTitle}
          subtitle={techSubtitle}
          lang={lang}
        />
      )}

      {/* 7. Featured Client Stories */}
      {csConfig?.enabled !== false && (
        <FeaturedClientStories
          stories={data.clientStories}
          sectionBadge={csConfig?.badge}
          sectionTitle={csConfig?.title}
          sectionSubtitle={csConfig?.subtitle}
          lang={lang}
        />
      )}

      {/* 8. How We Deliver Differently */}
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

      {/* 9. Solutions Insights */}
      {insConfig?.enabled !== false && (
        <InsightsSection
          items={data.insights}
          title={insConfig?.title}
          subtitle={insConfig?.subtitle}
          ctaText={insConfig?.ctaText}
          ctaHref={insConfig?.ctaHref}
          lang={lang}
        />
      )}

      {/* 10. Executive Client Review */}
      {data.clientReview.enabled !== false && (
        <ClientReviewSection
          quoteText={data.clientReview.quote}
          quoteAuthor={data.clientReview.author}
          quoteRole={data.clientReview.role}
          quoteAvatar={data.clientReview.avatar}
          badge={data.clientReview.badge}
          lang={lang}
        />
      )}

      {/* 11. Enterprise FAQs Accordion */}
      {data.faqsEnabled !== false && (
        <FaqSection
          faqs={data.faqs}
          title={faqsTitle}
          subtitle={faqsSubtitle}
          lang={lang}
        />
      )}

      {/* 12. Global Contact Section */}
      {data.contactEnabled !== false && (
        <div id="contact">
          <HomeContactSection dict={dict} lang={lang} />
        </div>
      )}
    </div>
  );
}
