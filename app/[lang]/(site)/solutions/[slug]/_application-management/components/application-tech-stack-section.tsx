'use client';

import React from 'react';
import type { TechStackPod } from '../data/application-management.data';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
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
                <div className="w-full flex flex-col justify-between rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.18] p-6 sm:p-8 backdrop-blur-xs transition-all duration-300 hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-persici-blush bg-persici-blush/10 px-2.5 py-1 rounded-md">
                        {podBadge}
                      </span>
                    </div>

                    <h3 className="font-primary text-xl sm:text-2xl font-bold text-white mb-2">
                      {podTitle}
                    </h3>

                    <p className="text-sm text-slate-400 leading-relaxed mb-6 font-normal">
                      {podDesc}
                    </p>
                  </div>

                  {/* Tech Badges Grid */}
                  <div className="pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-3">
                    {pod.technologies.map((tech, tIdx) => (
                      <div
                        key={tIdx}
                        className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-white">
                            {tech.name}
                          </span>
                          {tech.badge && (
                            <span className="text-[10px] font-mono text-slate-400 bg-white/[0.06] px-1.5 py-0.5 rounded">
                              {tech.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1">
                          {tech.category}
                        </span>
                      </div>
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
