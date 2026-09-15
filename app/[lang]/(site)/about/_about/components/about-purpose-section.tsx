'use client';

import React from 'react';
import Image from 'next/image';
import { sectionContainer, sectionPaddingY, badgePill } from '@shared/constants';
import { FadeUp, CountUp } from '@shared';
import type { AboutPurposeData } from '../data/about.data';

export interface AboutPurposeSectionProps {
  data: AboutPurposeData;
  lang: string;
}

export function AboutPurposeSection({ data, lang }: AboutPurposeSectionProps) {
  const badge = data.badge[lang as 'en' | 'ar'] || data.badge.en;
  const title = data.title[lang as 'en' | 'ar'] || data.title.en;
  const desc1 = data.description1[lang as 'en' | 'ar'] || data.description1.en;
  const desc2 = data.description2[lang as 'en' | 'ar'] || data.description2.en;

  return (
    <section className={`${sectionPaddingY} bg-white relative overflow-hidden`} id="purpose">
      <div className={sectionContainer}>
        {/* Top Header: Centered Narrative & Purpose (Matching Publicis Sapient) */}
        <div className="max-w-4xl mx-auto text-center mb-14 sm:mb-20">
          <FadeUp delay={0} duration={600} distance={16}>
            <span className={`${badgePill} mb-4 tracking-wide uppercase text-[9.5px] font-mono font-semibold`}>
              {badge}
            </span>
          </FadeUp>

          <FadeUp delay={100} duration={750} distance={20}>
            <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-persici-black leading-[1.15] rtl:leading-[1.25] mb-6">
              {title}
            </h2>
          </FadeUp>

          <FadeUp delay={180} duration={750} distance={20}>
            <p className="font-secondary text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed font-normal max-w-3xl mx-auto mb-4">
              {desc1}
            </p>
          </FadeUp>

          {desc2 && (
            <FadeUp delay={260} duration={750} distance={20}>
              <p className="font-secondary text-sm sm:text-base text-slate-500 leading-relaxed font-normal max-w-2xl mx-auto">
                {desc2}
              </p>
            </FadeUp>
          )}
        </div>

        {/* Wide High-Resolution Team Collaboration Image */}
        <FadeUp delay={200} duration={800} distance={24} className="mb-14 sm:mb-20">
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-black/[0.06] bg-slate-100">
            <Image
              src={data.image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
            {/* Subtle bottom gradient tint */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </FadeUp>

        {/* Minimalist Typographic Stats Strip (Matching Publicis Sapient reference) */}
        <div className="mt-14 sm:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
            {data.stats.map((stat, idx) => {
              const label = stat.label[lang as 'en' | 'ar'] || stat.label.en;
              return (
                <FadeUp
                  key={stat.code || idx}
                  delay={150 + idx * 100}
                  duration={700}
                  distance={20}
                  className="relative py-2 pl-6 sm:pl-8 lg:pl-12 rtl:pl-0 rtl:pr-6 rtl:sm:pr-8 rtl:lg:pr-12 border-l border-dashed border-neutral-300 rtl:border-l-0 rtl:border-r rtl:border-dashed rtl:border-neutral-300"
                >
                  {/* Clean Monospace / Geometric Counter Number */}
                  <div className="font-mono text-5xl sm:text-6xl lg:text-[64px] font-normal tracking-tight text-black leading-none mb-3 sm:mb-4 tabular-nums">
                    <CountUp
                      end={stat.number}
                      suffix={stat.suffix}
                      thousandsSeparator={stat.thousandsSeparator || ''}
                      duration={2000}
                      viewportTrigger
                    />
                  </div>

                  {/* Clean Lowercase Label */}
                  <p className="font-secondary text-sm sm:text-[13px] text-slate-500 font-normal leading-normal">
                    {label}
                  </p>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
