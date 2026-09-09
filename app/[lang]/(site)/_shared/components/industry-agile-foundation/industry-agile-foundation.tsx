'use client';

import React from 'react';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';
import type { IndustryAgileFoundation } from '@shared/types';

export interface IndustryAgileFoundationProps {
  foundation: IndustryAgileFoundation;
  lang: string;
  className?: string;
}

export function IndustryAgileFoundationSection({
  foundation,
  lang,
  className = '',
}: IndustryAgileFoundationProps) {
  const isRtl = lang === 'ar';
  const title = foundation.title[lang as 'en' | 'ar'] || foundation.title.en;
  const subtitle = foundation.subtitle[lang as 'en' | 'ar'] || foundation.subtitle.en;
  const diagramBadge = foundation.diagramBadge[lang as 'en' | 'ar'] || foundation.diagramBadge.en;

  return (
    <section className={`${sectionPaddingY} bg-[#F9F8F6] relative border-b border-black/[0.04] ${className}`}>
      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-persici-crimson/10 text-persici-crimson text-xs font-semibold uppercase tracking-wider mb-4">
            {isRtl ? 'الأساس المعماري الرشيق' : 'Architectural Blueprint'}
          </div>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {subtitle}
          </p>
        </FadeUp>

        {/* Architectural Blueprint Diagram Card */}
        <FadeUp delay={100} duration={750} distance={24} className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-white border border-black/5 p-8 sm:p-12 lg:p-14 shadow-xs">
            {/* SVG Transformation Arc / Architectural Matrix */}
            <div className="relative flex flex-col items-center justify-center py-6 sm:py-8 overflow-hidden">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full mb-6">
                {diagramBadge}
              </span>

              {/* Vector Concentric Arcs Blueprint */}
              <div className="w-full max-w-2xl h-44 sm:h-56 relative flex items-center justify-center">
                <svg
                  viewBox="0 0 600 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Outer Ring */}
                  <path
                    d="M 50 230 A 250 250 0 0 1 550 230"
                    stroke="#E2E8F0"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Middle Ring */}
                  <path
                    d="M 120 230 A 180 180 0 0 1 480 230"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                  />
                  {/* Inner Ring */}
                  <path
                    d="M 190 230 A 110 110 0 0 1 410 230"
                    stroke="#D83427"
                    strokeWidth="2.5"
                  />

                  {/* Core Hub */}
                  <circle cx="300" cy="230" r="32" fill="#FEF7F6" stroke="#D83427" strokeWidth="2" />
                  <circle cx="300" cy="230" r="12" fill="#D83427" />

                  {/* Nodes on Rings */}
                  <circle cx="120" cy="230" r="6" fill="#121212" />
                  <circle cx="480" cy="230" r="6" fill="#121212" />
                  <circle cx="190" cy="230" r="7" fill="#D83427" />
                  <circle cx="410" cy="230" r="7" fill="#D83427" />
                  <circle cx="300" cy="120" r="8" fill="#D83427" />
                  <circle cx="300" cy="50" r="7" fill="#121212" />

                  {/* Labels on SVG */}
                  <text x="300" y="32" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {isRtl ? 'الابتكار والتوسع' : 'SCALE & INNOVATION'}
                  </text>
                  <text x="300" y="102" textAnchor="middle" fill="#D83427" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {isRtl ? 'البيانات والأتمتة' : 'DATA & AUTOMATION'}
                  </text>
                  <text x="300" y="195" textAnchor="middle" fill="#0F172A" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {isRtl ? 'المنصة السيادية' : 'SOVEREIGN CORE'}
                  </text>
                </svg>
              </div>
            </div>

            {/* 3 Core Pillars Underneath the Blueprint */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-8 sm:pt-10 border-t border-black/[0.06] mt-6">
              {foundation.pillars.map((pillar, pIdx) => {
                const pTitle = pillar.title[lang as 'en' | 'ar'] || pillar.title.en;
                const pDesc = pillar.description[lang as 'en' | 'ar'] || pillar.description.en;

                return (
                  <div key={pIdx} className="flex flex-col">
                    <span className="font-mono text-sm font-bold text-persici-crimson mb-3 tracking-wider">
                      {pillar.number}
                    </span>
                    <h3 className="font-primary text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug">
                      {pTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {pDesc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

