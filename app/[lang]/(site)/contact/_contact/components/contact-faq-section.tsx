'use client';

import React from 'react';
import { FaqSection } from '@shared';
import type { ContactFaqItem, LocalizedString } from '../data/contact.data';

export interface ContactFaqSectionProps {
  faqs: ContactFaqItem[];
  title: LocalizedString;
  subtitle: LocalizedString;
  lang: string;
}

export function ContactFaqSection({
  faqs,
  title,
  subtitle,
  lang,
}: ContactFaqSectionProps) {
  return (
    <div id="faqs" className="scroll-mt-20">
      <FaqSection
        title={title}
        subtitle={subtitle}
        faqs={faqs}
        lang={lang}
        className="py-16 sm:py-20 lg:py-28 bg-[#FBFBFB] border-b border-black/[0.04]"
      />
    </div>
  );
}
