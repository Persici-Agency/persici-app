'use client';

import React from 'react';
import { sectionContainer } from '@shared/constants';
import { FadeUp, CountUp, HomeButton } from '@shared';
import type { CareersHubData } from '../data/careers.data';

export interface CareersHeroSectionProps {
  data: CareersHubData['hero'];
  lang: string;
}

export function CareersHeroSection({ data, lang }: CareersHeroSectionProps) {
  const isAr = lang === 'ar';

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-28 bg-[#FFFAFA]">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 start-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-persici-crimson/10 via-persici-blush/5 to-transparent blur-3xl rounded-full" />
      <div className="pointer-events-none absolute top-1/3 -start-32 w-80 h-80 bg-persici-crimson/5 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute top-1/2 -end-32 w-80 h-80 bg-persici-blush/5 blur-3xl rounded-full" />

      <div className={sectionContainer}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge Pill */}
          <FadeUp delay={100} duration={600}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/10 shadow-xs backdrop-blur-xs mb-6 sm:mb-8">
              <span className="flex h-2 w-2 rounded-full bg-persici-crimson animate-pulse" />
              <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-foreground/80">
                {data.badge[isAr ? 'ar' : 'en']}
              </span>
            </div>
          </FadeUp>

          {/* Master Heading */}
          <FadeUp delay={200} duration={700}>
            <h1 className="font-primary text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.12] sm:leading-[1.1] mb-6 sm:mb-8">
              {data.title[isAr ? 'ar' : 'en']}
            </h1>
          </FadeUp>

          {/* Subtitle Description */}
          <FadeUp delay={300} duration={700}>
            <p className="font-secondary text-base sm:text-lg lg:text-xl text-foreground/70 leading-relaxed max-w-3xl mx-auto mb-10 sm:mb-12">
              {data.description[isAr ? 'ar' : 'en']}
            </p>
          </FadeUp>

          {/* Action Buttons with HomeButton */}
          <FadeUp delay={400} duration={700}>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16 sm:mb-20">
              <HomeButton
                href="#open-positions"
                title={isAr ? 'استكشف الوظائف الشاغرة' : 'Explore Open Positions'}
                iconDirection="down"
                isLangEffectIcon
                currentLang={lang}
                className="bg-persici-crimson hover:bg-persici-crimson-80 text-white shadow-lg shadow-persici-crimson/25 px-8 py-3.5 text-sm font-semibold"
              />
              <HomeButton
                href="#culture"
                title={isAr ? 'ثقافة العمل والمزايا' : 'Culture & Total Rewards'}
                icon={null}
                className="border border-black/15 bg-white/70 backdrop-blur-xs text-foreground hover:bg-black/5 px-7 py-3.5 text-sm font-medium"
              />
            </div>
          </FadeUp>
        </div>

        {/* Minimalist Typographic Stats Strip (Cardless / Seamless) */}
        <FadeUp delay={500} duration={800}>
          <div className="pt-12 sm:pt-16 border-t border-black/10 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
              {data.stats.map((stat, idx) => {
                const label = stat.label[isAr ? 'ar' : 'en'];
                const suffix = stat.suffix ? stat.suffix[isAr ? 'ar' : 'en'] : '';
                return (
                  <div
                    key={idx}
                    className="relative py-2 px-4 sm:px-6 lg:px-8 border-s border-dashed border-neutral-300 first:border-s-0 rtl:border-s-0 rtl:border-e rtl:first:border-e-0"
                  >
                    {/* Clean Monospace / Geometric Counter preserving current font size */}
                    <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight mb-2 tabular-nums">
                      {stat.number !== undefined ? (
                        <CountUp
                          end={stat.number}
                          suffix={suffix}
                          decimals={stat.decimals || 0}
                          duration={2000}
                          viewportTrigger
                        />
                      ) : (
                        stat.value
                      )}
                    </div>

                    {/* Clean Title / Description under it */}
                    <p className="font-secondary text-xs sm:text-sm text-foreground/60 leading-normal">
                      {label}
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
