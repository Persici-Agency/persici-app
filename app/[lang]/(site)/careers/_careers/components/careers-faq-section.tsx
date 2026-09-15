'use client';

import React from 'react';
import { FaqSection } from '@shared';
import type { CareersHubData } from '../data/careers.data';

export interface CareersFaqSectionProps {
  data: CareersHubData['faqs'];
  lang: string;
}

export function CareersFaqSection({ data, lang }: CareersFaqSectionProps) {
  return (
    <div id="faqs" className="scroll-mt-20">
      <FaqSection
        title={data.title}
        subtitle={data.subtitle}
        faqs={data.items}
        lang={lang}
        className="py-16 sm:py-20 lg:py-28 bg-white border-t border-black/5"
      />
    </div>
  );
}
