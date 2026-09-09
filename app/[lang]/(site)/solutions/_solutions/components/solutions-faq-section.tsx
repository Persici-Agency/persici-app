'use client';

import React, { useState } from 'react';
import type { SolutionFaqItem } from '@shared/types';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';

export interface SolutionsFaqSectionProps {
  faqs: SolutionFaqItem[];
  lang: string;
  title?: string | { en: string; ar: string };
  subtitle?: string | { en: string; ar: string };
  className?: string;
}

export function SolutionsFaqSection({
  title,
  subtitle,
  faqs,
  lang,
  className,
}: SolutionsFaqSectionProps) {
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
          {faqs.map((faq, idx) => {
            const question = faq.question[lang as 'en' | 'ar'] || faq.question.en;
            const answer = faq.answer[lang as 'en' | 'ar'] || faq.answer.en;
            const isOpen = openIdx === idx;

            return (
              <FadeUp
                key={idx}
                delay={idx * 60}
                duration={600}
                distance={16}
                className="w-full"
              >
                <div
                  className="rounded-2xl sm:rounded-3xl border-0 bg-persici-black-20 shadow-none overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    id={`faq-btn-${idx}`}
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-5 sm:p-6 text-left rtl:text-right cursor-pointer gap-4 transition-colors hover:bg-black/[0.02]"
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${idx}`}
                  >
                    <span className="font-primary text-md font-semibold text-slate-900">
                      {question}
                    </span>
                    <span
                      className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-2xs font-bold text-sm sm:text-base transition-transform duration-300 ${isOpen
                        ? 'rotate-45 text-persici-crimson'
                        : 'text-slate-700'
                        }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  <div
                    id={`faq-content-${idx}`}
                    role="region"
                    aria-labelledby={`faq-btn-${idx}`}
                    className={`grid transition-all duration-300 ease-in-out ${isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base leading-relaxed text-slate-600 border-t border-black/5 pt-4">
                        {answer}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Reusable aliases
export const SolutionFaq = SolutionsFaqSection;
export const SolutionsFaq = SolutionsFaqSection;
