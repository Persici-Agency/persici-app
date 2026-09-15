'use client';

import React from 'react';
import type { Dictionary } from '@dictionaries';
import { contactPageData } from '../data/contact.data';
import { ContactHeroSection } from './contact-hero-section';
import { HomeContactSection } from '../../../_home/components/home-contact-section';
import { ContactOfficesSection } from './contact-offices-section';
import { ContactDirectChannelsSection } from './contact-direct-channels';
import { ContactFaqSection } from './contact-faq-section';

export interface ContactViewProps {
  lang: string;
  dict: Dictionary;
}

export function ContactView({ lang, dict }: ContactViewProps) {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Banner: Bold agency statement & quick anchor navigation chips */}
      <ContactHeroSection data={contactPageData.hero} lang={lang} />

      {/* 2. Global Growth Hubs Grid: Dubai (HQ), Riyadh, and Amman with architectural photos & local details */}
      <ContactOfficesSection
        offices={contactPageData.offices}
        title={contactPageData.officesTitle}
        subtitle={contactPageData.officesSubtitle}
        lang={lang}
      />

      {/* 3. Direct Segmented Channels & Concierge Inquiries (New Business, Partnerships, Careers, Press) */}
      <ContactDirectChannelsSection
        channels={contactPageData.channels}
        title={contactPageData.channelsTitle}
        subtitle={contactPageData.channelsSubtitle}
        lang={lang}
      />

      {/* 4. Pre-Engagement Agency FAQs: Addressing kickoffs, engagement models, and enterprise RFPs */}
      <ContactFaqSection
        faqs={contactPageData.faqs}
        title={contactPageData.faqsTitle}
        subtitle={contactPageData.faqsSubtitle}
        lang={lang}
      />

      {/* 5. Primary Interactive Contact Engine: Multi-field enterprise inquiry with reCAPTCHA & video backdrop */}
      <div id="contact-form" className="scroll-mt-20">
        <HomeContactSection lang={lang} dict={dict} />
      </div>
    </main>
  );
}
