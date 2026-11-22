'use client';

import React from 'react';
import type { TechStackPod } from '../data/application-management.data';
import { TechInfrastructureCard } from '@shared';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';

interface ApplicationTechStackSectionProps {
  pods: TechStackPod[];
  badge?: string;
  title: string;
  subtitle: string;
  lang: string;
}

export function ApplicationTechStackSection({
  pods,
  badge,
  title,
  subtitle,
  lang,
}: ApplicationTechStackSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-gradient-to-br from-[#FFF7F6] via-[#FDF6F4] to-[#F5EFEA] border-y border-persici-crimson/10 text-slate-900 relative overflow-hidden">
      {/* Subtle Low-Opacity Background Image & Architectural Grid */}
      <div
        className="absolute inset-0 bg-[url('/images/about/heritage-card-bg.webp')] bg-cover bg-center opacity-[0.045] mix-blend-multiply pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(#c8102e_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none"
        aria-hidden="true"
      />
      {/* Subtle ambient lighting */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-persici-crimson/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-persici-blush/10 rounded-full blur-3xl pointer-events-none" />

      <div className={`${sectionContainer} relative z-10`}>
        {/* Section Heading */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-persici-crimson block mb-3">
            {badge || (isRtl ? 'الأدوات والبنية التحتية' : 'Technology Infrastructure')}
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
