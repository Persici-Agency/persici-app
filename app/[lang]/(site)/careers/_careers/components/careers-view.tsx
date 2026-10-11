'use client';

import React from 'react';
import type { Dictionary } from '@dictionaries';
import { CareersHeroSection } from './careers-hero-section';
import { CareersCultureSection } from './careers-culture-section';
import { CareersPerksSection } from './careers-perks-section';
import { CareersProcessSection } from './careers-process-section';
import { CareersFilterBoard } from './careers-filter-board';
import { CareersSpontaneousCta } from './careers-spontaneous-cta';
import { CareersFaqSection } from './careers-faq-section';
import {
  careersHubData,
  getAllCareers,
  type CareerJobOpening,
  type CareersHubData,
} from '../data/careers.data';

export interface CareersViewProps {
  lang: string;
  dict?: Dictionary;
  initialOpenings?: CareerJobOpening[];
  content?: CareersHubData;
}

export function CareersView({ lang, initialOpenings, content }: CareersViewProps) {
  const openings = initialOpenings !== undefined ? initialOpenings : getAllCareers();
  const hub = content || careersHubData;

  return (
    <main className="flex flex-col min-h-screen bg-[#FFFAFA]">
      {/* 1. Hero: Bold Agency Mission & Impact Stats */}
      {hub.hero?.enabled !== false && <CareersHeroSection data={hub.hero} lang={lang} />}

      {/* 2. Culture: Asymmetric Photo Bento of Dubai, Riyadh & Amman Labs */}
      {hub.culture?.enabled !== false && <CareersCultureSection data={hub.culture} lang={lang} />}

      {/* 3. Perks & Benefits: 6 Modern Tech Bento Cards */}
      {hub.perks?.enabled !== false && <CareersPerksSection data={hub.perks} lang={lang} />}

      {/* 4. Hiring Process: 4-Stage Transparent Recruitment Journey */}
      {hub.process?.enabled !== false && <CareersProcessSection data={hub.process} lang={lang} />}

      {/* 5. Filter Board: Real-time Search, Department & Location Filter Pills */}
      {hub.openPositions?.enabled !== false && (
        <CareersFilterBoard openings={openings} data={hub.openPositions} lang={lang} />
      )}

      {/* 6. Spontaneous Application CTA: Deep Obsidian Card */}
      {hub.spontaneous?.enabled !== false && (
        <CareersSpontaneousCta data={hub.spontaneous} lang={lang} />
      )}

      {/* 7. Candidate FAQs: Pre-application Questions */}
      {hub.faqs?.enabled !== false && <CareersFaqSection data={hub.faqs} lang={lang} />}
    </main>
  );
}
