'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { CrmManagementOfferingItem } from '../data/crm-management.data';
import { SolutionsVectorDiagram } from '../../../_solutions/components/solutions-vector-diagram';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';

interface CrmOfferingsGridProps {
  offerings: CrmManagementOfferingItem[];
  title: string;
  subtitle: string;
  lang: string;
}

export function CrmOfferingsGrid({
  offerings,
  title,
  subtitle,
  lang,
}: CrmOfferingsGridProps) {
  const isRtl = lang === 'ar';
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section id="offerings" className="py-20 sm:py-28 lg:py-32 bg-white relative scroll-mt-24">
      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'القدرات والحلول المتخصصة' : 'Core Capabilities'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {subtitle}
          </p>
        </FadeUp>

        {/* 6 Cards: Responsive 3-Column Grid with Centered Alignment */}
        <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
          {offerings.map((item, idx) => {
            const itemTitle = item.title[lang as 'en' | 'ar'] || item.title.en;
            const itemDesc = item.description[lang as 'en' | 'ar'] || item.description.en;
            const itemTag = item.tag[lang as 'en' | 'ar'] || item.tag.en;
            const highlights = item.highlights[lang as 'en' | 'ar'] || item.highlights.en;
            const isImageIcon = item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http'));

            return (
              <div
                key={item.slug}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(33.333%-16px)] max-w-[380px] flex"
              >
                <FadeUp
                  delay={idx * 70}
                  duration={650}
                  distance={24}
                  blur={true}
                  className="w-full flex"
                >
                  <div className="group relative flex flex-col justify-between rounded-2xl bg-persici-black-20 border-0 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg w-full">
                    {/* Top: Tag + Dedicated Dual-Tone SVG Icon */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-[11px] font-bold tracking-wider uppercase text-persici-crimson bg-persici-crimson/5 px-2.5 py-1 rounded-md">
                          {itemTag}
                        </span>
                        {item.icon && (
                          <div className="h-7 w-7 shrink-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                            {isImageIcon ? (
                              <Image
                                src={item.icon}
                                alt={itemTitle}
                                width={28}
                                height={28}
                                className="w-7 h-7 object-contain"
                                unoptimized={item.icon.endsWith('.svg')}
                              />
                            ) : (
                              <span className="text-base" aria-hidden="true">
                                {item.icon}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <h3 className="font-primary text-lg sm:text-xl font-bold text-slate-900 transition-colors group-hover:text-persici-crimson leading-snug">
                        {itemTitle}
                      </h3>
                    </div>

                    {/* Center: Unique Animated Vector Diagram with Freeze State */}
                    <div className="my-6 flex items-center justify-center py-3 bg-white/70 rounded-xl border border-black/[0.03] group-hover:bg-white transition-colors">
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        <SolutionsVectorDiagram
                          type={item.diagramType}
                          className="h-16 w-16 text-slate-700 transition-colors"
                          isPaused={isPaused}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
                      {itemDesc}
                    </p>

                    {/* Bullet Highlights */}
                    <div className="border-t border-persici-black/5 pt-4 mt-auto">
                      <ul className="space-y-2">
                        {highlights.map((bullet, bIdx) => (
                          <li key={bIdx} className="text-xs text-slate-600 flex items-start gap-2 leading-tight">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-persici-crimson shrink-0 mt-1" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </FadeUp>
              </div>
            );
          })}
        </div>

        {/* Minimal Icon-Only Pause / Resume Button at the bottom-right */}
        <div className="mt-10 flex justify-end max-w-7xl mx-auto px-4">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="group relative flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            title={isPaused ? (isRtl ? 'تشغيل الرسوم المتحركة' : 'Resume animations') : (isRtl ? 'إيقاف الرسوم المتحركة مؤقتاً' : 'Pause animations')}
            aria-label={isPaused ? 'Resume animations' : 'Pause animations'}
          >
            {isPaused ? (
              <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-persici-crimson transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-persici-crimson transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
