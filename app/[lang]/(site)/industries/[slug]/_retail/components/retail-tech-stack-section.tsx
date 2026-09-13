'use client';

import React from 'react';
import type { TechStackPod } from '../data/retail.data';
import { TechInfrastructureCard } from '@shared';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';

interface RetailTechStackSectionProps {
  pods: TechStackPod[];
  title: string;
  subtitle: string;
  lang: string;
}

export function RetailTechStackSection({
  pods,
  title,
  subtitle,
  lang,
}: RetailTechStackSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section id="tech-stack" className="py-20 sm:py-28 lg:py-36 bg-[#0E121B] relative overflow-hidden scroll-mt-24">
      {/* Soft Ambient Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-persici-crimson/10 rounded-full blur-[140px] pointer-events-none" />

      <div className={`${sectionContainer} relative z-10`}>
        {/* Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'البنية التقنية المتطورة' : 'Infrastructure & Platforms'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {subtitle}
          </p>
        </FadeUp>

        {/* 4 Pods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {pods.map((pod, idx) => {
            const podTitle = pod.title[lang as 'en' | 'ar'] || pod.title.en;
            const podBadge = pod.badge[lang as 'en' | 'ar'] || pod.badge.en;
            const podDesc = pod.description[lang as 'en' | 'ar'] || pod.description.en;

            return (
              <FadeUp
                key={idx}
                delay={idx * 90}
                duration={700}
                distance={24}
                className="flex"
              >
                <TechInfrastructureCard
                  badge={podBadge}
                  title={podTitle}
                  description={podDesc}
                  technologies={pod.technologies}
                  headerLayout="split"
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
