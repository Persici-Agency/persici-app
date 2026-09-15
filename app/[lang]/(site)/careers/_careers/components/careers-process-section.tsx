'use client';

import React from 'react';
import { TbClock } from 'react-icons/tb';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';
import type { CareersHubData, CareerProcessStep } from '../data/careers.data';

export interface CareersProcessSectionProps {
  data: CareersHubData['process'];
  lang: string;
}

export function CareersProcessSection({ data, lang }: CareersProcessSectionProps) {
  const isAr = lang === 'ar';

  return (
    <section className={`bg-white ${sectionPaddingY} relative overflow-hidden border-b border-black/5`}>
      <div className={sectionContainer}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <FadeUp delay={100} duration={600}>
            <span className="inline-block font-mono text-[9.5px] sm:text-xs font-semibold uppercase tracking-wider text-persici-crimson bg-persici-crimson/10 px-3.5 py-1 rounded-full mb-3">
              {data.badge[isAr ? 'ar' : 'en']}
            </span>
          </FadeUp>
          <FadeUp delay={200} duration={700}>
            <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mb-4">
              {data.title[isAr ? 'ar' : 'en']}
            </h2>
          </FadeUp>
          <FadeUp delay={300} duration={700}>
            <p className="font-secondary text-base sm:text-lg text-foreground/70 leading-relaxed">
              {data.subtitle[isAr ? 'ar' : 'en']}
            </p>
          </FadeUp>
        </div>

        {/* 4-Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {data.steps.map((step: CareerProcessStep, idx: number) => (
            <FadeUp key={step.step} delay={150 + idx * 100} duration={700}>
              <div className="relative flex flex-col justify-between h-full p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#FFFAFA] border border-black/8 shadow-xs hover:border-persici-crimson/30 hover:shadow-md transition-all duration-300 group">
                <div>
                  {/* Step Number & Duration */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl sm:text-3xl font-semibold text-persici-crimson">
                      {step.step}
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/5 text-[9.5px] sm:text-[9.5px] font-medium text-foreground/70">
                      <TbClock className="w-3.5 h-3.5 text-persici-crimson" />
                      <span>{step.duration[isAr ? 'ar' : 'en']}</span>
                    </div>
                  </div>

                  <h3 className="font-primary text-base sm:text-lg font-medium text-foreground mb-2 leading-snug group-hover:text-persici-crimson transition-colors">
                    {step.title[isAr ? 'ar' : 'en']}
                  </h3>

                  <p className="font-secondary text-xs sm:text-sm text-foreground/65 leading-relaxed">
                    {step.description[isAr ? 'ar' : 'en']}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
