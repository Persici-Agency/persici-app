'use client';

import React, { useState } from 'react';
import type { SolutionFaqItem } from '@shared/types';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';
import { FaqItem } from '../faq-item';

export interface FaqSectionProps {
  faqs: SolutionFaqItem[];
  lang: string;
  title?: string | { en: string; ar: string };
  subtitle?: string | { en: string; ar: string };
  className?: string;
}

export function FaqSection({
  title,
  subtitle,
  faqs,
  lang,
  className,
}: FaqSectionProps) {
  const isRtl = lang === 'ar';
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const displayTitle =
    (typeof title === 'string'
      ? title
      : title?.[lang as 'en' | 'ar'] || title?.en) ||
    (isRtl ? 'الأسئلة الشائعة' : 'FAQ');

  const displaySubtitle =
    typeof subtitle === 'string'
      ? subtitle
      : subtitle?.[lang as 'en' | 'ar'] || subtitle?.en;

  return (
    <section className={`${className || 'pt-14 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28'} bg-white overflow-hidden`}>
      <div className={sectionContainer}>
        {/* Section Heading with FadeUp */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {displaySubtitle}
            </p>
          )}
        </FadeUp>

        {/* FAQs Accordion with Staggered FadeUp */}
        <div className="max-w-4xl mx-auto space-y-3.5 sm:space-y-4">
          {faqs.map((faq, idx) => (
            <FadeUp
              key={idx}
              delay={idx * 60}
              duration={600}
              distance={16}
              className="w-full"
            >
              <FaqItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIdx === idx}
                onToggle={() => toggleFaq(idx)}
                lang={lang}
                index={idx}
              />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// Reusable aliases
export const SolutionsFaqSection = FaqSection;
export type SolutionsFaqSectionProps = FaqSectionProps;
export const SolutionFaq = FaqSection;
export const SolutionsFaq = FaqSection;
export const Faq = FaqSection;
