'use client';

import React from 'react';
import type { Dictionary } from '@dictionaries';
import type { HowWeDoItPageContent } from '@shared/types';
import { SolutionsHeroSection } from '../../solutions/_solutions/components/solutions-hero-section';
import { MethodologyPillarsGrid } from './methodology-pillars-grid';
import { SpeedEngineSection } from './speed-engine-section';
import { DeliveryVelocitySection } from './delivery-velocity-section';
import { FeaturedClientStories, FaqSection, ClientReviewSection } from '@shared';
import { HomeContactSection } from '../../_home/components/home-contact-section';

interface HowWeDoItHubViewProps {
  content: HowWeDoItPageContent;
  lang: string;
  dict: Dictionary;
}

export function HowWeDoItHubView({
  content,
  lang,
  dict,
}: HowWeDoItHubViewProps) {
  const isAr = lang === 'ar';

  const offeringsTitle = content.offeringsTitle[isAr ? 'ar' : 'en'];
  const offeringsSubtitle = content.offeringsSubtitle[isAr ? 'ar' : 'en'];

  const frameworkTitle = content.frameworkTitle[isAr ? 'ar' : 'en'];
  const frameworkSubtitle = content.frameworkSubtitle[isAr ? 'ar' : 'en'];

  const deliveryTitle = content.deliveryTitle[isAr ? 'ar' : 'en'];
  const deliverySubtitle = content.deliverySubtitle[isAr ? 'ar' : 'en'];

  const quoteText = content.quoteText[isAr ? 'ar' : 'en'];
  const quoteRole = content.quoteRole[isAr ? 'ar' : 'en'];

  const faqsTitle = content.faqsTitle[isAr ? 'ar' : 'en'];
  const faqsSubtitle = content.faqsSubtitle[isAr ? 'ar' : 'en'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Methodology Hero Banner */}
      <SolutionsHeroSection
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        tag={content.heroBadge}
        secondaryTag={{ en: 'Agile Delivery', ar: 'التنفيذ الرشيق' }}
        image={content.heroImage}
        ctaText={content.heroCtaPrimary}
        ctaHref="#pillars"
        lang={lang}
      />

      {/* 2. The 5 Core Methodology Pillars */}
      <MethodologyPillarsGrid
        offerings={content.offeringsList}
        title={offeringsTitle}
        subtitle={offeringsSubtitle}
        lang={lang}
      />

      {/* 3. The SPEED Transformation Engine */}
      <SpeedEngineSection
        title={frameworkTitle}
        subtitle={frameworkSubtitle}
        pillars={content.frameworkPillars}
        lang={lang}
      />

      {/* 4. High-Velocity Engineering & Agile Delivery */}
      <DeliveryVelocitySection
        title={deliveryTitle}
        subtitle={deliverySubtitle}
        image={content.deliveryImage}
        pillars={content.deliveryPillars}
        lang={lang}
      />

      {/* 5. Featured Enterprise Client Stories */}
      <FeaturedClientStories lang={lang} />

      {/* 6. Executive Client Review */}
      <ClientReviewSection
        quoteText={quoteText}
        quoteAuthor={content.quoteAuthor}
        quoteRole={quoteRole}
        lang={lang}
      />

      {/* 7. Enterprise Delivery FAQs */}
      <FaqSection
        title={faqsTitle}
        subtitle={faqsSubtitle}
        faqs={content.faqs}
        lang={lang}
      />

      {/* 8. Global Discovery & Contact Section */}
      <HomeContactSection lang={lang} dict={dict} />
    </div>
  );
}
