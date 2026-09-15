'use client';

import React from 'react';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import type { LocalizedString } from '@shared/types';

interface SpeedPillar {
  letter: string;
  name: LocalizedString;
  description: LocalizedString;
}

interface SpeedEngineSectionProps {
  title: string;
  subtitle: string;
  pillars: SpeedPillar[];
  lang: string;
}

export function SpeedEngineSection({
  title,
  subtitle,
  pillars,
  lang,
}: SpeedEngineSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section className={`w-full bg-[#0E121B] text-white ${sectionPaddingY} relative overflow-hidden`}>
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-persici-crimson/10 blur-[140px] pointer-events-none rounded-full" />

      <div className={`${sectionContainer} relative z-10`}>
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-persici-crimson/20 border border-persici-crimson/30 text-persici-crimson text-xs font-semibold uppercase tracking-wider mb-4">
            {isRtl ? 'محرك التحول الرقمي' : 'SPEED Transformation Engine'}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-primary font-medium text-white tracking-tight leading-tight mb-5">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-secondary leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 5 Pillars Horizontal / Grid Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {pillars.map((pillar) => {
            const pName = pillar.name[lang as 'en' | 'ar'] || pillar.name.en;
            const pDesc = pillar.description[lang as 'en' | 'ar'] || pillar.description.en;

            return (
              <div
                key={pillar.letter + pName}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-persici-crimson/50 hover:bg-white/[0.07] transition-all duration-300"
              >
                {/* Top Accent line */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-persici-crimson opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Large Stylized Letter */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-4xl sm:text-5xl font-semibold text-white/20 group-hover:text-persici-crimson transition-colors duration-300">
                      {pillar.letter}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-persici-crimson/40 group-hover:bg-persici-crimson transition-colors duration-300" />
                  </div>

                  {/* Title (Stays White per engineering rules) */}
                  <h3 className="text-lg sm:text-xl font-primary font-medium text-white mb-3">
                    {pName}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 font-secondary leading-relaxed">
                    {pDesc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors">
                    {isRtl ? 'قدرة متكاملة' : 'Integrated Pillar'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
