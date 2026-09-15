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
import { careersHubData, getAllCareers, type CareerJobOpening } from '../data/careers.data';

export interface CareersViewProps {
  lang: string;
  dict?: Dictionary;
  initialOpenings?: CareerJobOpening[];
}

export function CareersView({ lang, initialOpenings }: CareersViewProps) {
  const openings = initialOpenings && initialOpenings.length > 0 ? initialOpenings : getAllCareers();

  return (
    <main className="flex flex-col min-h-screen bg-[#FFFAFA]">
      {/* 1. Hero: Bold Agency Mission & Impact Stats */}
      <CareersHeroSection data={careersHubData.hero} lang={lang} />

      {/* 2. Culture: Asymmetric Photo Bento of Dubai, Riyadh & Amman Labs */}
      <CareersCultureSection data={careersHubData.culture} lang={lang} />

      {/* 3. Perks & Benefits: 6 Modern Tech Bento Cards */}
      <CareersPerksSection data={careersHubData.perks} lang={lang} />

      {/* 4. Hiring Process: 4-Stage Transparent Recruitment Journey */}
      <CareersProcessSection data={careersHubData.process} lang={lang} />

      {/* 5. Filter Board: Real-time Search, Department & Location Filter Pills */}
      <CareersFilterBoard openings={openings} lang={lang} />

      {/* 6. Spontaneous Application CTA: Deep Obsidian Card */}
      <CareersSpontaneousCta data={careersHubData.spontaneous} lang={lang} />

      {/* 7. Candidate FAQs: Pre-application Questions */}
      <CareersFaqSection data={careersHubData.faqs} lang={lang} />
    </main>
  );
}
