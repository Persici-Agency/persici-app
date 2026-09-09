'use client';

import React from 'react';
import type { TechStackPod } from '../data/application-management.data';
import { TechInfrastructureCard } from '@shared';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';

interface ApplicationTechStackSectionProps {
  pods: TechStackPod[];
  title: string;
  subtitle: string;
  lang: string;
}

export function ApplicationTechStackSection({
  pods,
  title,
  subtitle,
  lang,
}: ApplicationTechStackSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-[#0D0D11] text-white relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-persici-crimson/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-persici-blush/10 rounded-full blur-3xl pointer-events-none" />

      <div className={`${sectionContainer} relative z-10`}>
        {/* Section Heading */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-blush block mb-3">
            {isRtl ? 'الأدوات والبنية التحتية' : 'Technology Infrastructure'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            {subtitle}
          </p>
        </FadeUp>

        {/* 4 Pods Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {pods.map((pod, idx) => {
            const podTitle = pod.title[lang as 'en' | 'ar'] || pod.title.en;
            const podBadge = pod.badge[lang as 'en' | 'ar'] || pod.badge.en;
            const podDesc = pod.description[lang as 'en' | 'ar'] || pod.description.en;

            return (
              <FadeUp
                key={idx}
                delay={idx * 80}
                duration={700}
                distance={24}
                className="flex"
              >
                <TechInfrastructureCard
                  badge={podBadge}
                  title={podTitle}
                  description={podDesc}
                  technologies={pod.technologies}
                  variant="grid"
                />
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
