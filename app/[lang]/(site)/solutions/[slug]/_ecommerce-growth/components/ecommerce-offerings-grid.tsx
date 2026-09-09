'use client';

import React, { useState } from 'react';
import type { EcommerceOfferingItem } from '../data/ecommerce-growth.data';
import { CapabilityCard } from '@shared';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';

interface EcommerceOfferingsGridProps {
  offerings: EcommerceOfferingItem[];
  title: string;
  subtitle: string;
  lang: string;
}

export function EcommerceOfferingsGrid({
  offerings,
  title,
  subtitle,
  lang,
}: EcommerceOfferingsGridProps) {
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

        {/* 6 Cards */}
        <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
          {offerings.map((item, idx) => {
            const itemTitle = item.title[lang as 'en' | 'ar'] || item.title.en;
            const itemDesc = item.description[lang as 'en' | 'ar'] || item.description.en;
            const itemTag = item.tag[lang as 'en' | 'ar'] || item.tag.en;
            const highlights = item.highlights[lang as 'en' | 'ar'] || item.highlights.en;

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
                  <CapabilityCard
                    title={itemTitle}
                    tag={itemTag}
                    description={itemDesc}
                    icon={item.icon}
                    diagramType={item.diagramType}
                    highlights={highlights}
                    highlightsVariant="bullets"
                    isPaused={isPaused}
                  />
                </FadeUp>
              </div>
            );
          })}
        </div>

        {/* Minimal Icon-Only Pause / Resume Button at the side bottom */}
        <div className="mt-10 flex justify-end max-w-7xl mx-auto px-4">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="group relative flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer"
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
