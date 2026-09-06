'use client';

import React, { useState } from 'react';
import type { SolutionFaqItem } from '@shared/types';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';

interface SolutionsFaqSectionProps {
  title: string;
  subtitle: string;
  faqs: SolutionFaqItem[];
  lang: string;
}

export function SolutionsFaqSection({
  title,
  subtitle,
  faqs,
  lang,
}: SolutionsFaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className={`${sectionPaddingY} bg-slate-50/50 border-t border-slate-100 overflow-hidden`}>
      <div className={sectionContainer}>
        {/* Section Heading with FadeUp */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-primary text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            {subtitle}
          </p>
        </FadeUp>

        {/* FAQs Accordion with Staggered FadeUp */}
        <div className="max-w-3xl mx-auto space-y-4">
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
                  className="rounded-2xl border border-slate-200/80 bg-white transition-all duration-200 shadow-2xs overflow-hidden"
                >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left rtl:text-right cursor-pointer gap-4 transition-colors hover:bg-slate-50/50"
                  aria-expanded={isOpen}
                >
                  <span className="font-primary text-base sm:text-lg font-bold text-slate-900">
                    {question}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 font-bold text-sm ${
                      isOpen
                        ? 'rotate-45 border-persici-crimson/40 bg-slate-50 text-persici-crimson'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base leading-relaxed text-slate-600 border-t border-slate-100 pt-4 animate-in fade-in duration-200">
                    {answer}
                  </div>
                )}
              </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
