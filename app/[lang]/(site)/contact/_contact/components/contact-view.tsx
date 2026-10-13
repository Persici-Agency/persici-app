'use client';

import React from 'react';
import type { Dictionary } from '@dictionaries';
import type { ContactPageData } from '../data/contact.data';
import { contactPageData } from '../data/contact.data';
import { ContactHeroSection } from './contact-hero-section';
import { HomeContactSection } from '../../../_home/components/home-contact-section';
import { ContactOfficesSection } from './contact-offices-section';
import { ContactDirectChannelsSection } from './contact-direct-channels';
import { ContactFaqSection } from './contact-faq-section';

export interface ContactViewProps {
  lang: string;
  dict: Dictionary;
  content?: ContactPageData;
}

export function ContactView({ lang, dict, content }: ContactViewProps) {
  const activeData = content || contactPageData;

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Banner: Bold agency statement & quick anchor navigation chips */}
      <ContactHeroSection data={activeData.hero || contactPageData.hero} lang={lang} />

      {/* 2. Global Growth Hubs Grid: Dubai (HQ), Riyadh, and Amman with architectural photos & local details */}
      <ContactOfficesSection
        offices={activeData.offices || contactPageData.offices}
        badge={activeData.officesBadge || contactPageData.officesBadge}
        title={activeData.officesTitle || contactPageData.officesTitle}
        subtitle={activeData.officesSubtitle || contactPageData.officesSubtitle}
        lang={lang}
      />

      {/* 3. Direct Segmented Channels & Concierge Inquiries (New Business, Partnerships, Careers, Press) */}
      <ContactDirectChannelsSection
        channels={activeData.channels || contactPageData.channels}
        badge={activeData.channelsBadge || contactPageData.channelsBadge}
        title={activeData.channelsTitle || contactPageData.channelsTitle}
        subtitle={activeData.channelsSubtitle || contactPageData.channelsSubtitle}
        lang={lang}
      />

      {/* 4. Pre-Engagement Agency FAQs: Addressing kickoffs, engagement models, and enterprise RFPs */}
      <ContactFaqSection
        faqs={activeData.faqs || contactPageData.faqs}
        title={activeData.faqsTitle || contactPageData.faqsTitle}
        subtitle={activeData.faqsSubtitle || contactPageData.faqsSubtitle}
        lang={lang}
      />

      {/* 5. Primary Interactive Contact Engine: Multi-field enterprise inquiry with reCAPTCHA & video backdrop */}
      <div id="contact-form" className="scroll-mt-20">
        <HomeContactSection lang={lang} dict={dict} />
      </div>
    </main>
  );
}
