'use client';

import React from 'react';
import { sectionContainer, sectionPaddingY, badgePill } from '@shared/constants';
import { FadeUp, HomeButton } from '@shared';
import type { AboutValuesData } from '../data/about.data';

export interface AboutValuesSectionProps {
  data: AboutValuesData;
  lang: string;
}

export function AboutValuesSection({ data, lang }: AboutValuesSectionProps) {
  const badge = data.badge[lang as 'en' | 'ar'] || data.badge.en;
  const title = data.title[lang as 'en' | 'ar'] || data.title.en;
  const subtitle = data.subtitle[lang as 'en' | 'ar'] || data.subtitle.en;

  const cards = [data.card1, data.card2];

  return (
    <section className={`${sectionPaddingY} bg-white relative overflow-hidden`} id="values">
      <div className={sectionContainer}>
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <FadeUp delay={0} duration={600} distance={16}>
            <span className={`${badgePill} mb-4 tracking-wide uppercase text-[11px] font-mono font-semibold`}>
              {badge}
            </span>
          </FadeUp>

          <FadeUp delay={100} duration={750} distance={20}>
            <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-persici-black leading-[1.15] rtl:leading-[1.25] mb-4">
              {title}
            </h2>
          </FadeUp>

          <FadeUp delay={180} duration={750} distance={20}>
            <p className="font-secondary text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {subtitle}
            </p>
          </FadeUp>
        </div>

        {/* Dual Cards Matching Reference Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {cards.map((card, idx) => {
            const cardBadge = card.badge[lang as 'en' | 'ar'] || card.badge.en;
            const cardTitle = card.title[lang as 'en' | 'ar'] || card.title.en;
            const cardDesc = card.description[lang as 'en' | 'ar'] || card.description.en;
            const cardCta = card.cta[lang as 'en' | 'ar'] || card.cta.en;

            return (
              <FadeUp
                key={idx}
                delay={150 + idx * 120}
                duration={750}
                distance={24}
                className="h-full"
              >
                <div className="group relative h-full min-h-[380px] sm:min-h-[420px] flex flex-col justify-between rounded-3xl border border-black/10 bg-[#F9F8F6] p-8 sm:p-10 lg:p-12 overflow-hidden transition-all duration-300 hover:border-persici-crimson/30 hover:bg-white hover:shadow-xl">
                  {/* Subtle background curved wave lines */}
                  <div
                    className="absolute -bottom-12 -right-12 w-96 h-96 opacity-15 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 200 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full text-persici-crimson"
                    >
                      <path
                        d="M10 180 C 60 120, 140 220, 190 140 C 210 100, 160 40, 190 10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <path
                        d="M25 190 C 75 130, 155 230, 205 150 C 225 110, 175 50, 205 20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <path
                        d="M40 200 C 90 140, 170 240, 220 160 C 240 120, 190 60, 220 30"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {/* Top: Icon + Badge + Title (Matching Reference Structure) */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-4 mb-5">
                      {/* Line Icon matching reference image */}
                      <div className="w-10 h-10 rounded-xl bg-white border border-black/5 shadow-2xs flex items-center justify-center text-slate-800 group-hover:text-persici-crimson group-hover:border-persici-crimson/20 transition-all duration-300">
                        {idx === 0 ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>

                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-white border border-black/10 text-slate-600 group-hover:border-persici-crimson/30 group-hover:text-persici-crimson transition-colors">
                        {cardBadge}
                      </span>
                    </div>

                    <h3 className="font-primary text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-persici-black leading-tight group-hover:text-persici-crimson transition-colors max-w-xl">
                      {cardTitle}
                    </h3>
                  </div>

                  {/* Bottom: Horizontal Split (Description on start, Button on end) */}
                  <div className="relative z-10 pt-10 sm:pt-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <p className="font-secondary text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-sm sm:max-w-md">
                      {cardDesc}
                    </p>

                    <div className="shrink-0 flex justify-end rtl:justify-start">
                      <HomeButton
                        href={`/${lang}${card.cta.href}`}
                        title={cardCta}
                        currentLang={lang}
                        isLangEffectIcon
                        className="bg-persici-black hover:bg-persici-crimson text-white px-6 py-2.5 text-xs font-semibold shadow-xs transition-all"
                        iconClassName="bg-white/20 group-hover:bg-white text-white group-hover:text-persici-crimson"
                      />
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
