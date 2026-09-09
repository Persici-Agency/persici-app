'use client';

import React from 'react';
import type { TechStackPod } from '../data/ai-integration.data';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';

interface AiTechStackSectionProps {
  pods: TechStackPod[];
  title: string;
  subtitle: string;
  lang: string;
}

export function AiTechStackSection({
  pods,
  title,
  subtitle,
  lang,
}: AiTechStackSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section id="tech-stack" className="py-20 sm:py-28 lg:py-36 bg-[#0E121B] relative overflow-hidden scroll-mt-24">
      {/* Soft Ambient Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-persici-crimson/10 rounded-full blur-[140px] pointer-events-none" />

      <div className={[sectionContainer, 'relative z-10'].join(' ')}>
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
                <div className="w-full h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/25 hover:bg-white/[0.05] p-7 sm:p-9 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h3 className="font-primary text-xl font-bold text-white">
                        {podTitle}
                      </h3>
                      <span className="text-[11px] font-mono font-medium text-persici-crimson bg-persici-crimson/10 border border-persici-crimson/20 px-2.5 py-0.5 rounded-full">
                        {podBadge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-normal">
                      {podDesc}
                    </p>
                  </div>

                  {/* Technology Pills */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 mt-auto">
                    {pod.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 bg-white/[0.06] border border-white/10 px-3 py-1 rounded-lg hover:bg-white/10 hover:border-white/20 transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-persici-crimson" />
                        <span>{tech.name}</span>
                        {tech.badge && (
                          <span className="text-[10px] font-mono text-persici-crimson/90 bg-persici-crimson/15 px-1.5 py-0.5 rounded">
                            {tech.badge}
                          </span>
                        )}
                      </span>
                    ))}
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
