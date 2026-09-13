'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TbArrowRight, TbArrowLeft } from 'react-icons/tb';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import type { HowWeDoItOfferingItem } from '@shared/types';
import { SolutionsVectorDiagram } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-vector-diagram';

interface MethodologyPillarsGridProps {
  offerings: HowWeDoItOfferingItem[];
  title: string;
  subtitle: string;
  lang: string;
}

export function MethodologyPillarsGrid({
  offerings,
  title,
  subtitle,
  lang,
}: MethodologyPillarsGridProps) {
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? TbArrowLeft : TbArrowRight;
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section id="pillars" className={`w-full bg-[#FFFAFA] ${sectionPaddingY}`}>
      <div className={sectionContainer}>
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-persici-crimson/10 border border-persici-crimson/20 text-persici-crimson text-xs font-semibold uppercase tracking-wider mb-4">
            {isRtl ? 'ركائز المنهجية الخمس' : 'The 5 Core Methodology Pillars'}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-primary font-bold text-slate-900 tracking-tight leading-tight mb-5">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-secondary leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {offerings.map((item, index) => {
            const itemTitle = item.title[lang as 'en' | 'ar'] || item.title.en;
            const itemDesc = item.description[lang as 'en' | 'ar'] || item.description.en;
            const itemTag = item.tag[lang as 'en' | 'ar'] || item.tag.en;
            const numStr = `0${index + 1}`;

            return (
              <Link
                key={item.slug}
                href={`/${lang}${item.href}`}
                className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#F7F7F7] border border-slate-200/80 hover:border-persici-crimson/40 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-300 overflow-hidden"
              >
                {/* Top Crimson Accent Line on Hover */}
                <div className="absolute top-0 inset-x-0 h-1 bg-persici-crimson opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Header Row: Index Number & Tag */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-300 group-hover:text-persici-crimson transition-colors duration-300">
                      {numStr}
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200/70 text-slate-700 group-hover:bg-persici-crimson/10 group-hover:text-persici-crimson transition-colors duration-300">
                      {itemTag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-primary font-bold text-slate-900 mb-3 group-hover:text-persici-crimson transition-colors duration-200">
                    {itemTitle}
                  </h3>

                  {/* Animated Vector Diagram */}
                  {item.diagramType && (
                    <div className="my-5 flex items-center justify-center py-4 bg-white/80 rounded-xl border border-black/[0.04] group-hover:bg-white transition-colors">
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        <SolutionsVectorDiagram
                          type={item.diagramType}
                          isPaused={isPaused}
                          className="h-16 w-16 drop-shadow-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-600 font-secondary leading-relaxed mb-6">
                    {itemDesc}
                  </p>
                </div>

                {/* Footer Link Action */}
                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-persici-crimson transition-colors duration-200">
                    {isRtl ? 'استكشف المنهجية' : 'Explore Methodology'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-persici-crimson group-hover:text-white group-hover:border-persici-crimson transition-all duration-300 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Minimal Icon-Only Pause / Resume Button at bottom right */}
        <div className="mt-8 sm:mt-10 flex justify-end max-w-7xl mx-auto px-2">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-2xs hover:text-persici-crimson hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
            aria-label={
              isPaused
                ? isRtl
                  ? 'استئناف حركة المخططات'
                  : 'Resume animations'
                : isRtl
                  ? 'إيقاف مؤقت للحركة'
                  : 'Pause animations'
            }
            title={
              isPaused
                ? isRtl
                  ? 'استئناف حركة المخططات'
                  : 'Resume animations'
                : isRtl
                  ? 'إيقاف مؤقت للحركة'
                  : 'Pause animations'
            }
          >
            {isPaused ? (
              <svg className="h-4 w-4 fill-current ml-0.5 rtl:ml-0 rtl:mr-0.5" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            ) : (
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <rect x="5" y="4" width="4" height="16" rx="1" />
                <rect x="15" y="4" width="4" height="16" rx="1" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
