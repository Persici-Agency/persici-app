'use client';

import React from 'react';
import type { TechStackPod } from '../data/health.data';
import { TechInfrastructureCard } from '@shared';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';

interface HealthTechStackSectionProps {
  pods: TechStackPod[];
  title: string;
  subtitle: string;
  badge?: string;
  lang: string;
}

export function HealthTechStackSection({
  pods,
  title,
  subtitle,
  badge,
  lang,
}: HealthTechStackSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section id="tech-stack" className="py-20 sm:py-28 lg:py-36 bg-gradient-to-br from-[#FFF7F6] via-[#FDF6F4] to-[#F5EFEA] border-y border-persici-crimson/10 relative overflow-hidden scroll-mt-24">
      {/* Subtle Low-Opacity Background Image & Architectural Grid */}
      <div
        className="absolute inset-0 bg-[url('/images/about/heritage-card-bg.webp')] bg-cover bg-center opacity-[0.045] mix-blend-multiply pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(#c8102e_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none"
        aria-hidden="true"
      />
      {/* Soft Ambient Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-persici-crimson/5 rounded-full blur-[140px] pointer-events-none" />

      <div className={`${sectionContainer} relative z-10`}>
        {/* Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-persici-crimson block mb-3">
            {badge || (isRtl ? 'البنية التقنية المتطورة' : 'Infrastructure & Platforms')}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle.includes('<') && subtitle.includes('>') ? (
            <div
              className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal [&_p]:inline [&_strong]:font-semibold [&_b]:font-semibold [&_em]:italic [&_i]:italic"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          ) : (
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
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
