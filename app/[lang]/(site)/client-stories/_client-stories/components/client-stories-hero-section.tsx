'use client';

import React from 'react';
import { sectionContainer } from '@shared/constants';
import { HomeButton, FadeUp } from '@shared/components';
import { TbSparkles } from 'react-icons/tb';

export interface ClientStoriesHeroSectionProps {
  lang: string;
}

export function ClientStoriesHeroSection({ lang }: ClientStoriesHeroSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section
      data-header-luminance="light"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full overflow-hidden bg-linear-to-b from-white via-slate-50/40 to-white pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-44 lg:pb-24 border-b border-black/[0.05]"
    >
      {/* Subtle architectural background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/4 -start-32 h-96 w-96 rounded-full bg-persici-crimson/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -end-32 h-96 w-96 rounded-full bg-persici-crimson/5 blur-3xl" />

      <div className={`relative z-10 ${sectionContainer}`}>
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <FadeUp delay={0} duration={750} distance={16}>
            <div className="inline-flex items-center gap-2 rounded-full border border-persici-crimson/20 bg-persici-crimson/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-6 sm:mb-8 backdrop-blur-xs">
              <TbSparkles className="h-3.5 w-3.5 shrink-0" />
              <span>
                {isRtl ? 'قصص نجاح عملائنا وشركائنا' : 'Client Stories & Impact'}
              </span>
            </div>
          </FadeUp>

          {/* Main Title */}
          <FadeUp delay={120} duration={850} distance={24} blur={true}>
            <h1 className="font-primary text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl lg:text-6xl sm:leading-[1.12]">
              {isRtl ? (
                <>
                  أعمال تحولية تصنع الفارق{' '}
                  <span className="text-persici-crimson">لرواد الأعمال</span>
                </>
              ) : (
                <>
                  Transformative work for visionary{' '}
                  <span className="text-persici-crimson">market leaders</span>
                </>
              )}
            </h1>
          </FadeUp>

          {/* Subtitle */}
          <FadeUp delay={240} duration={800} distance={20}>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              {isRtl
                ? 'اكتشف كيف تشارك بيرسيكي المؤسسات الطموحة في دول الخليج والعالم لهندسة علامات استثنائية، وبناء منصات برمجية متطورة، وتحقيق قفزات نوعية في النمو والإيرادات.'
                : 'Explore how Persici partners with forward-thinking enterprises across the GCC and beyond to engineer iconic brands, robust software platforms, and high-velocity digital growth.'}
            </p>
          </FadeUp>

          {/* Action CTAs */}
          <FadeUp delay={360} duration={750} distance={18}>
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
              <HomeButton
                href="#explore"
                title={isRtl ? 'استكشف جميع القصص' : 'Explore All Stories'}
                className="bg-persici-crimson text-white hover:bg-persici-crimson/90"
                currentLang={lang}
                isLangEffectIcon={true}
              />

              <HomeButton
                href={`/${lang}#contact`}
                title={isRtl ? 'ناقش مشروعك معنا' : 'Discuss Your Project'}
                className="bg-slate-900 text-white hover:bg-slate-800"
                currentLang={lang}
                isLangEffectIcon={true}
              />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
