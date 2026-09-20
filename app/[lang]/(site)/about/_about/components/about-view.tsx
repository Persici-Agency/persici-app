'use client';

import React from 'react';
import type { Dictionary } from '@dictionaries';
import type { AboutPageData } from '../data/about.data';
import { AboutHeroSection } from './about-hero-section';
import { AboutPurposeSection } from './about-purpose-section';
import { AboutHeritageCard } from './about-heritage-card';
import { AboutPartnershipSection } from './about-partnership-section';
import { AboutMilestonesTimeline } from './about-milestones-timeline';
import { AboutExecutiveQuote } from './about-executive-quote';
import { AboutCultureMosaic } from './about-culture-mosaic';
import { AboutPillarsCarousel } from './about-pillars-carousel';
import { AboutValuesSection } from './about-values-section';
import { HomeContactSection } from '../../../_home/components/home-contact-section';

export interface AboutViewProps {
  content: AboutPageData;
  lang: string;
  dict: Dictionary;
}

export function AboutView({ content, lang, dict }: AboutViewProps) {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Banner: Bold agency statement & 3D geometric wireframe */}
      <AboutHeroSection data={content.hero} lang={lang} />

      {/* 2. Purpose & Overview Metrics: Team collaboration image & CountUp impact metrics */}
      <AboutPurposeSection data={content.purpose} lang={lang} />

      {/* 3. Heritage & Strategic Reach: Full-bleed rich crimson gradient with floating elevated white card */}
      <AboutHeritageCard data={content.heritage} lang={lang} />

      {/* 4. Asymmetric Partnership Showcase: "How We Partner" copy & Publicis Sapient ShapedImageContainer */}
      <AboutPartnershipSection data={content.partnership} lang={lang} />

      {/* 5. Chronological Milestone History: 7-stage alternating innovation timeline (2018-2026) */}
      <AboutMilestonesTimeline data={content.milestones} lang={lang} />

      {/* 6. Executive Leadership Vision: Verified leadership quote with crimson border */}
      <AboutExecutiveQuote data={content.quote} lang={lang} />

      {/* 7. Team & Culture Mosaic: 4-image asymmetric bento gallery */}
      <AboutCultureMosaic data={content.culture} lang={lang} />

      {/* 8. Core Capability Pillars: Signature PanoramicCarousel matching features/industries sub-navbar section */}
      <AboutPillarsCarousel data={content.pillars} lang={lang} />

      {/* 9. Core Values Dual Cards: Wide dual cards with organic wave accents */}
      <AboutValuesSection data={content.values} lang={lang} />

      {/* 10. Global Contact & Discovery: Interactive discovery dispatching with animated waves */}
      <div id="contact">
        <HomeContactSection lang={lang} dict={dict} />
      </div>
    </main>
  );
}
