'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { MarketingOfferingItem } from '../data/marketing-communications.data';
import { SolutionsVectorDiagram } from '../../../_solutions/components/solutions-vector-diagram';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';

interface MarketingOfferingsGridProps {
  offerings: MarketingOfferingItem[];
  title: string;
  subtitle: string;
  lang: string;
}

export function MarketingOfferingsGrid({
  offerings,
  title,
  subtitle,
  lang,
}: MarketingOfferingsGridProps) {
  const isRtl = lang === 'ar';
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section id="offerings" className="py-20 sm:py-28 lg:py-32 bg-white relative scroll-mt-24">
      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'القدرات والحلول' : 'Core Capabilities'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {subtitle}
          </p>
        </FadeUp>

        {/* 6 Cards: Responsive 4-Column Grid on Wide Screens with Centered Remainder */}
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
                    {/* Top: Tag + Dedicated SVG Icon */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-[11px] font-bold tracking-wider uppercase text-persici-crimson bg-persici-crimson/5 px-2.5 py-1 rounded-md">
                          {itemTag}
                        </span>
                        {item.icon && (
                          <div className="relative h-7 w-7 shrink-0 overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity">
                            {isImageIcon ? (
                              <Image
                                src={item.icon}
                                alt={itemTitle}
                                fill
                                sizes="28px"
                                className="object-contain"
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
                          isPaused={isPaused}
                          className="h-16 w-16 drop-shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Bottom: Narrative + Capability Pills + Learn More Underline Link */}
                    <div>
                      <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 mb-5">
                        {itemDesc}
                      </p>

                      <div className="pt-4 border-t border-persici-black/5">
                        <div className="flex flex-wrap gap-1.5">
                          {highlights.map((h, hIdx) => (
                            <span
                              key={hIdx}
                              className="text-[11px] font-medium text-slate-600 bg-white/90 border border-black/[0.04] px-2 py-0.5 rounded-md"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              </div>
            );
          })}
        </div>

        {/* Minimal Icon-Only Pause/Resume Animation Toggle on the side */}
        <div className="mt-8 flex justify-end max-w-7xl mx-auto px-2">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-persici-crimson hover:bg-black/5 active:scale-95 cursor-pointer"
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
