'use client';

import React from 'react';
import { TbMail } from 'react-icons/tb';
import { sectionContainer, sectionPaddingBottom } from '@shared/constants';
import { FadeUp, HomeButton } from '@shared';
import type { CareersHubData } from '../data/careers.data';

export interface CareersSpontaneousCtaProps {
  data: CareersHubData['spontaneous'];
  lang: string;
}

export function CareersSpontaneousCta({ data, lang }: CareersSpontaneousCtaProps) {
  const isAr = lang === 'ar';

  return (
    <section className={`bg-[#FFFAFA] ${sectionPaddingBottom} relative overflow-hidden`}>
      <div className={sectionContainer}>
        <FadeUp delay={100} duration={800}>
          <div className="relative overflow-hidden rounded-3xl bg-[#0E121B] p-8 sm:p-12 lg:p-16 text-white border border-white/10 shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -top-32 -end-32 w-96 h-96 bg-persici-crimson/20 blur-3xl rounded-full" />
            <div className="pointer-events-none absolute -bottom-32 -start-32 w-96 h-96 bg-persici-blush/10 blur-3xl rounded-full" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[9.5px] font-mono font-semibold uppercase tracking-wider text-persici-blush mb-6">
                <span>{data.badge[isAr ? 'ar' : 'en']}</span>
              </div>

              <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white mb-6 leading-tight">
                {data.title[isAr ? 'ar' : 'en']}
              </h2>

              <p className="font-secondary text-base sm:text-lg text-white/75 leading-relaxed mb-8 sm:mb-10">
                {data.description[isAr ? 'ar' : 'en']}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <HomeButton
                  href={`mailto:hr@persiciagency.com?subject=${encodeURIComponent(
                    isAr ? 'طلب انضمام عام لنخبة برسيسي' : 'Spontaneous Application — Persici Talent Collective'
                  )}`}
                  title={data.ctaText[isAr ? 'ar' : 'en']}
                  icon={<TbMail className="w-4 h-4" />}
                  isLangEffectIcon={false}
                  className="bg-persici-crimson hover:bg-persici-crimson-80 text-white shadow-lg shadow-persici-crimson/30 px-7 py-3 text-xs sm:text-sm font-semibold"
                />

                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono">
                  <span>hr@persiciagency.com</span>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
