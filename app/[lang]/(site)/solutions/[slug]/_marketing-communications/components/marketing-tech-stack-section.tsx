'use client';

import React from 'react';
import type { TechStackPod } from '../data/marketing-communications.data';
import { TechInfrastructureCard } from '@shared';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';

interface MarketingTechStackSectionProps {
  pods: TechStackPod[];
  badge?: string;
  title: string;
  subtitle: string;
  lang: string;
}

export function MarketingTechStackSection({
  pods,
  badge,
  title,
  subtitle,
  lang,
}: MarketingTechStackSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section id="technology" className="py-20 sm:py-28 lg:py-32 bg-gradient-to-br from-[#FFF7F6] via-[#FDF6F4] to-[#F5EFEA] border-y border-persici-crimson/10 relative overflow-hidden scroll-mt-24">
      {/* Subtle Low-Opacity Background Image & Architectural Grid */}
      <div
        className="absolute inset-0 bg-[url('/images/about/heritage-card-bg.webp')] bg-cover bg-center opacity-[0.045] mix-blend-multiply pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(#c8102e_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none"
        aria-hidden="true"
      />
      {/* Background radial crimson glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-persici-crimson/5 rounded-full blur-[120px] pointer-events-none" />

      <div className={`${sectionContainer} relative z-10`}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-persici-crimson block mb-3">
            {badge || (isRtl ? 'المنظومة التقنية' : 'Technology & Stack')}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-slate-900">
            {title}
          </h2>
          {/<[a-z][\s\S]*>/i.test(subtitle || "") ? (
            <div
              className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal [&_p]:mb-2 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          ) : (
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
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
                <TechInfrastructureCard
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
