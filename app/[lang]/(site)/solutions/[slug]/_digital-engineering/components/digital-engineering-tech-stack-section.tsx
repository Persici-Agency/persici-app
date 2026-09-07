'use client';

import React from 'react';
import type { TechStackPod } from '../data/digital-engineering.data';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';
import { TbLayersLinked, TbBrandDocker, TbBolt, TbShieldLock } from 'react-icons/tb';

interface DigitalEngineeringTechStackSectionProps {
  pods: TechStackPod[];
  title: string;
  subtitle: string;
  lang: string;
}

const podIcons = [
  TbLayersLinked,
  TbBrandDocker,
  TbBolt,
  TbShieldLock,
];

export function DigitalEngineeringTechStackSection({
  pods,
  title,
  subtitle,
  lang,
}: DigitalEngineeringTechStackSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section className={`${sectionPaddingY} bg-[#0E121B] relative overflow-hidden text-white`}>
      {/* Ambient Crimson Glow Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-persici-crimson/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-persici-blush/5 rounded-full blur-3xl pointer-events-none" />

      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 relative z-10">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'المنظومة التقنية والهندسية' : 'Engineering Technology Matrix'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            {subtitle}
          </p>
        </FadeUp>

        {/* 4 Tech Pods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto relative z-10">
          {pods.map((pod, idx) => {
            const Icon = podIcons[idx % podIcons.length];
            const podTitle = pod.title[lang as 'en' | 'ar'] || pod.title.en;
            const podBadge = pod.badge[lang as 'en' | 'ar'] || pod.badge.en;
            const podDesc = pod.description[lang as 'en' | 'ar'] || pod.description.en;

            return (
              <FadeUp
                key={idx}
                delay={idx * 100}
                duration={700}
                distance={24}
                className="flex"
              >
                <div className="group relative flex flex-col justify-between rounded-2xl bg-[#151B28] border border-white/10 p-6 sm:p-8 transition-all duration-300 hover:border-persici-crimson/40 hover:bg-[#181F2E] w-full">
                  <div>
                    {/* Header: Icon + Badge */}
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div className="h-11 w-11 rounded-xl bg-persici-crimson/15 text-persici-crimson flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        {podBadge}
                      </span>
                    </div>

                    <h3 className="font-primary text-xl font-bold text-white group-hover:text-persici-crimson transition-colors mb-3">
                      {podTitle}
                    </h3>

                    <p className="text-sm text-slate-400 leading-relaxed font-normal mb-6">
                      {podDesc}
                    </p>
                  </div>

                  {/* Technologies Pills */}
                  <div className="pt-5 border-t border-white/10 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {pod.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs font-medium text-slate-200 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:border-persici-crimson/50 transition-colors"
                        >
                          {tech.name}
                          {tech.badge && (
                            <span className="ml-1.5 text-[9px] text-persici-crimson font-bold uppercase">
                              • {tech.badge}
                            </span>
                          )}
                        </span>
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
