'use client';

import React from 'react';
import Link from 'next/link';
import { sectionContainer, badgePill } from '@shared/constants';
import { FadeUp, HomeButton } from '@shared';
import type { AboutHeroData } from '../data/about.data';

export interface AboutHeroSectionProps {
  data: AboutHeroData;
  lang: string;
}

export function AboutHeroSection({ data, lang }: AboutHeroSectionProps) {
  const isRtl = lang === 'ar';
  const badge = data.badge[lang as 'en' | 'ar'] || data.badge.en;
  const title = data.title[lang as 'en' | 'ar'] || data.title.en;
  const subtitle = data.subtitle[lang as 'en' | 'ar'] || data.subtitle.en;
  const primaryCta = data.primaryCta[lang as 'en' | 'ar'] || data.primaryCta.en;
  const secondaryCta = data.secondaryCta[lang as 'en' | 'ar'] || data.secondaryCta.en;

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-44 lg:pb-36 bg-gradient-to-b from-[#F9F8F6] via-[#FFFAFA] to-white overflow-hidden border-b border-black/[0.04]">
      {/* Ambient background glow & 3D geometric abstract accent */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[520px] h-[520px] rounded-full bg-persici-crimson/[0.06] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[420px] h-[420px] rounded-full bg-persici-blush/[0.08] blur-3xl pointer-events-none" />

      {/* Decorative 3D Polyhedron / Geometric Wireframe (Publicis Sapient visual cue) */}
      <div
        className={`hidden lg:block absolute top-1/2 -translate-y-1/2 ${
          isRtl ? 'left-8 xl:left-16' : 'right-8 xl:right-16'
        } pointer-events-none opacity-85 select-none`}
        aria-hidden="true"
      >
        <svg
          width="360"
          height="360"
          viewBox="0 0 360 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-pulse duration-[8000ms]"
        >
          <defs>
            <linearGradient id="persiciCrimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D83427" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#EF8C7D" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#D83427" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="persiciFacetGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D83427" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          {/* 3D Polyhedral Origami Facets */}
          <polygon points="180,30 310,110 240,260" fill="url(#persiciFacetGrad)" stroke="#D83427" strokeWidth="1.2" strokeOpacity="0.4" />
          <polygon points="180,30 240,260 100,210" fill="url(#persiciCrimsonGrad)" fillOpacity="0.2" stroke="#D83427" strokeWidth="1.2" strokeOpacity="0.5" />
          <polygon points="180,30 50,110 100,210" fill="url(#persiciFacetGrad)" stroke="#D83427" strokeWidth="1.2" strokeOpacity="0.3" />
          <polygon points="100,210 240,260 190,330" fill="url(#persiciCrimsonGrad)" fillOpacity="0.35" stroke="#D83427" strokeWidth="1.2" strokeOpacity="0.6" />
          <polygon points="100,210 190,330 60,290" fill="url(#persiciFacetGrad)" stroke="#D83427" strokeWidth="1.2" strokeOpacity="0.3" />
          <polygon points="240,260 310,110 320,240" fill="url(#persiciFacetGrad)" stroke="#D83427" strokeWidth="1.2" strokeOpacity="0.25" />
          <circle cx="180" cy="30" r="4" fill="#D83427" />
          <circle cx="310" cy="110" r="3.5" fill="#D83427" />
          <circle cx="240" cy="260" r="4" fill="#D83427" />
          <circle cx="100" cy="210" r="3.5" fill="#D83427" />
          <circle cx="190" cy="330" r="4" fill="#D83427" />
        </svg>
      </div>

      <div className={sectionContainer}>
        <div className="max-w-4xl relative z-10">
          {/* Eyebrow badge */}
          <FadeUp delay={0} duration={600} distance={16}>
            <span className={`${badgePill} mb-6 tracking-wide uppercase text-[11px] font-mono font-semibold`}>
              {badge}
            </span>
          </FadeUp>

          {/* Main Title H1 */}
          <FadeUp delay={100} duration={750} distance={24}>
            <h1 className="font-primary text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-extrabold tracking-tight text-persici-black leading-[1.08] rtl:leading-[1.18] mb-8">
              {title}
            </h1>
          </FadeUp>

          {/* Subtitle / Purpose narrative */}
          <FadeUp delay={200} duration={750} distance={24}>
            <p className="font-secondary text-lg sm:text-xl lg:text-2xl text-slate-600 leading-relaxed font-normal max-w-3xl mb-10">
              {subtitle}
            </p>
          </FadeUp>

          {/* CTA Group */}
          <FadeUp delay={300} duration={700} distance={20}>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              <HomeButton
                href={data.primaryCta.href}
                title={primaryCta}
                currentLang={lang}
                isLangEffectIcon
                className="bg-persici-crimson hover:bg-persici-crimson-80 text-white shadow-lg shadow-persici-crimson/25 px-8 py-3 text-sm font-semibold"
              />

              <Link
                href={data.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/80 px-7 py-3 text-sm font-medium text-slate-800 backdrop-blur-xs transition-all hover:bg-black/5 hover:border-black/25 active:scale-98"
              >
                <span>{secondaryCta}</span>
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
