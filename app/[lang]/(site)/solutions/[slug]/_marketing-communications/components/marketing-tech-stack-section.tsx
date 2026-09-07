'use client';

import React from 'react';
import type { TechStackPod } from '../data/marketing-communications.data';
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
    <section id="tech-stack" className="py-20 sm:py-28 lg:py-36 bg-[#0E121B] text-white relative overflow-hidden scroll-mt-24">
      {/* Soft Ambient Brand Glow Blur */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-persici-crimson/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-persici-crimson/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'الأدوات والبنية التحتية' : 'Technology & Tooling'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {subtitle}
          </p>
        </FadeUp>

        {/* 4 Pods Matrix */}
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
              >
                <div className="group relative flex flex-col justify-between h-full rounded-2xl bg-white/[0.03] border border-white/10 p-7 sm:p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-persici-crimson bg-persici-crimson/10 px-2.5 py-1 rounded-md">
                        {podBadge}
                      </span>
                    </div>

                    <h3 className="font-primary text-xl sm:text-2xl font-bold text-white mb-3">
                      {podTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                      {podDesc}
                    </p>
                  </div>

                  {/* Technology Badges List */}
                  <div className="pt-5 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {pod.technologies.map((tech, tIdx) => (
                        <div
                          key={tIdx}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-200 transition-colors group-hover:border-white/20"
                        >
                          <span>{tech.name}</span>
                          {tech.badge && (
                            <span className="text-[9px] uppercase font-bold text-persici-crimson bg-persici-crimson/15 px-1.5 py-0.5 rounded">
                              {tech.badge}
                            </span>
                          )}
                        </div>
                      ))}
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
