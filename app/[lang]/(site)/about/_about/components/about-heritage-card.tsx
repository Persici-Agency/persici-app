'use client';

import React from 'react';
import Image from 'next/image';
import { sectionContainer } from '@shared/constants';
import { FadeUp, HomeButton } from '@shared';
import type { AboutHeritageData } from '../data/about.data';

export interface AboutHeritageCardProps {
  data: AboutHeritageData;
  lang: string;
}

export function AboutHeritageCard({ data, lang }: AboutHeritageCardProps) {
  const title = data.title[lang as 'en' | 'ar'] || data.title.en;
  const description = data.description[lang as 'en' | 'ar'] || data.description.en;
  const ctaLabel = data.cta[lang as 'en' | 'ar'] || data.cta.en;

  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      {/* High-Impact Architectural Background matching Publicis Sapient reference */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/about/heritage-bg.jpg"
          alt="Architectural background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className={`relative z-10 ${sectionContainer}`}>
        {/* Elevated Floating White Card */}
        <FadeUp delay={100} duration={800} distance={28}>
          <div className="relative bg-white text-slate-900 rounded-3xl sm:rounded-[32px] p-8 sm:p-12 lg:p-14 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-black/5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Title, Narrative, Divider, 3 Clean Metrics, and End-Aligned Home Button */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                {/* Title */}
                <h2 className="font-primary text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-tight text-persici-black leading-[1.18] mb-4">
                  {title}
                </h2>

                {/* Narrative Description */}
                <p className="font-secondary text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl mb-10">
                  {description}
                </p>

                {/* Thin Full-Width Divider Line */}
                <div className="border-t border-slate-200/90 w-full mb-8 sm:mb-10" />

                {/* 3 Metrics: Pure Clean Typography directly on the card (No boxes) */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                  {data.metrics.map((metric, idx) => {
                    const label = metric.label[lang as 'en' | 'ar'] || metric.label.en;
                    return (
                      <div key={idx}>
                        <div className="font-primary text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight text-persici-black mb-1">
                          {metric.value}
                        </div>
                        <div className="font-secondary text-xs sm:text-sm text-slate-500 font-normal leading-snug">
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Home Button placed at the END of the container */}
                <div className="flex justify-end rtl:justify-start pt-2">
                  <HomeButton
                    href={`/${lang}${data.cta.href}`}
                    title={ctaLabel}
                    currentLang={lang}
                    isLangEffectIcon
                    className="bg-white hover:bg-persici-black text-persici-black hover:text-white border border-persici-black/80 px-7 py-2.5 text-xs font-semibold shadow-none transition-all"
                    iconClassName="bg-black/5 group-hover:bg-white text-black"
                  />
                </div>
              </div>

              {/* Right Column: Portrait Collaboration Photography in Rounded Chassis */}
              <div className="lg:col-span-5">
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-black/5 bg-slate-100">
                  <Image
                    src={data.image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
