'use client';

import React from 'react';
import type { TechStackPod } from '../data/marketing-communications.data';
import { SolutionsTechStackCard } from '../../../_solutions/components';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';

interface MarketingTechStackSectionProps {
  pods: TechStackPod[];
  title: string;
  subtitle: string;
  lang: string;
}

export function MarketingTechStackSection({
  pods,
  title,
  subtitle,
  lang,
}: MarketingTechStackSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section id="technology" className="py-20 sm:py-28 lg:py-32 bg-[#0E121B] relative overflow-hidden scroll-mt-24">
      {/* Background radial crimson glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-persici-crimson/10 rounded-full blur-[120px] pointer-events-none" />

      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'المنظومة التقنية' : 'Technology & Stack'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            {subtitle}
          </p>
        </FadeUp>

        {/* 4 Tech Pods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {pods.map((pod, pIdx) => {
            const podTitle = pod.title[lang as 'en' | 'ar'] || pod.title.en;
            const podDesc = pod.description[lang as 'en' | 'ar'] || pod.description.en;
            const podBadge = pod.badge[lang as 'en' | 'ar'] || pod.badge.en;

            return (
              <FadeUp
                key={pIdx}
                delay={pIdx * 90}
                duration={650}
                distance={24}
                blur={true}
                className="flex"
              >
                <SolutionsTechStackCard
                  badge={podBadge}
                  title={podTitle}
                  description={podDesc}
                  technologies={pod.technologies}
                  variant="pills"
                />
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
