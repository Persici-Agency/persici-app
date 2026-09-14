'use client';

import React from 'react';
import { sectionContainer, sectionPaddingY, badgePill } from '@shared/constants';
import { FadeUp, ShapedImageContainer, HomeButton } from '@shared';
import type { AboutPartnershipData } from '../data/about.data';

export interface AboutPartnershipSectionProps {
  data: AboutPartnershipData;
  lang: string;
}

export function AboutPartnershipSection({ data, lang }: AboutPartnershipSectionProps) {
  const isRtl = lang === 'ar';
  const badge = data.badge[lang as 'en' | 'ar'] || data.badge.en;
  const title = data.title[lang as 'en' | 'ar'] || data.title.en;
  const quote = data.quote[lang as 'en' | 'ar'] || data.quote.en;
  const ctaLabel = data.cta[lang as 'en' | 'ar'] || data.cta.en;

  return (
    <section className={`${sectionPaddingY} bg-[#FBFBFB] relative overflow-hidden border-b border-black/[0.04]`}>
      <div className={sectionContainer}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Partnership Narrative & Philosophy */}
          <div className="lg:col-span-6">
            <FadeUp delay={0} duration={600} distance={16}>
              <span className={`${badgePill} mb-4 tracking-wide uppercase text-[11px] font-mono font-semibold`}>
                {badge}
              </span>
            </FadeUp>

            <FadeUp delay={100} duration={750} distance={20}>
              <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-persici-black leading-[1.15] rtl:leading-[1.25] mb-6">
                {title}
              </h2>
            </FadeUp>

            {/* Standout Quote Callout */}
            <FadeUp delay={150} duration={750} distance={20}>
              <div className="border-l-2 rtl:border-l-0 rtl:border-r-2 border-persici-crimson pl-4 rtl:pl-0 rtl:pr-4 mb-6">
                <p className="font-primary text-lg sm:text-xl font-bold text-persici-black leading-snug">
                  {quote}
                </p>
              </div>
            </FadeUp>

            {/* Paragraphs */}
            <div className="space-y-4 mb-8">
              {data.paragraphs.map((p, idx) => {
                const text = p[lang as 'en' | 'ar'] || p.en;
                return (
                  <FadeUp key={idx} delay={200 + idx * 80} duration={700} distance={18}>
                    <p className="font-secondary text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                      {text}
                    </p>
                  </FadeUp>
                );
              })}
            </div>

            {/* CTA Button */}
            <FadeUp delay={350} duration={650} distance={16}>
              <HomeButton
                href={`/${lang}${data.cta.href}`}
                title={ctaLabel}
                currentLang={lang}
                isLangEffectIcon
                className="bg-persici-black hover:bg-persici-crimson text-white px-7 py-3 text-sm font-semibold transition-colors duration-300"
              />
            </FadeUp>
          </div>

          {/* Right Column: Publicis Sapient Signature Shaped Tab Container */}
          <div className="lg:col-span-6 relative">
            <FadeUp
              delay={200}
              duration={800}
              distance={28}
              direction={isRtl ? 'left' : 'right'}
            >
              <div className="relative">
                <ShapedImageContainer
                  shape="sapient-tab-tl"
                  src={data.image}
                  alt={title}
                  aspectRatio="aspect-[4/3]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="drop-shadow-2xl"
                />

                {/* Subtle floating branding chip */}
                <div
                  className={`absolute bottom-6 ${
                    isRtl ? 'right-6' : 'left-6'
                  } bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full border border-black/10 shadow-lg hidden sm:flex items-center gap-2.5`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-semibold text-slate-800 tracking-wide">
                    {isRtl ? 'تحالفات استراتيجية نشطة' : 'Active Strategic Squads'}
                  </span>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
