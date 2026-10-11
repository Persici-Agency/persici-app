'use client';

import React from 'react';
import { sectionContainer } from '@shared/constants';
import { HomeButton, FadeUp } from '@shared/components';
import { TbSparkles } from 'react-icons/tb';
import type { ClientStoriesHubPageData } from '../types';

export interface ClientStoriesHeroSectionProps {
  lang: string;
  hero?: ClientStoriesHubPageData['hero'];
}

export function ClientStoriesHeroSection({ lang, hero }: ClientStoriesHeroSectionProps) {
  const isRtl = lang === 'ar';

  const badgeText = isRtl
    ? hero?.badge?.ar || 'قصص نجاح عملائنا وشركائنا'
    : hero?.badge?.en || 'Client Stories & Impact';
  const titleText = isRtl
    ? hero?.title?.ar || 'أعمال تحولية تصنع الفارق'
    : hero?.title?.en || 'Transformative work for visionary';
  const titleHighlightText = isRtl
    ? hero?.titleHighlight?.ar ?? 'لرواد الأعمال'
    : hero?.titleHighlight?.en ?? 'market leaders';
  const subtitleText = isRtl
    ? hero?.subtitle?.ar ||
      'اكتشف كيف تشارك بيرسيشي المؤسسات الطموحة في دول الخليج والعالم لهندسة علامات استثنائية، وبناء منصات برمجية متطورة، وتحقيق قفزات نوعية في النمو والإيرادات.'
    : hero?.subtitle?.en ||
      'Explore how Persici partners with forward-thinking enterprises across the GCC and beyond to engineer iconic brands, robust software platforms, and high-velocity digital growth.';

  const primaryCtaLabel = isRtl
    ? hero?.primaryCtaLabel?.ar || 'استكشف جميع القصص'
    : hero?.primaryCtaLabel?.en || 'Explore All Stories';
  const primaryCtaHref = hero?.primaryCtaHref || '#explore';

  const secondaryCtaLabel = isRtl
    ? hero?.secondaryCtaLabel?.ar || 'ناقش مشروعك معنا'
    : hero?.secondaryCtaLabel?.en || 'Discuss Your Project';
  const rawSecondaryHref = hero?.secondaryCtaHref || '#contact';
  const secondaryCtaHref =
    rawSecondaryHref === '#contact' ? `/${lang}#contact` : rawSecondaryHref;

  const isHtmlSubtitle = subtitleText.includes('<') && subtitleText.includes('>');

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
            <div className="inline-flex items-center gap-2 rounded-full border border-persici-crimson/20 bg-persici-crimson/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rtl:tracking-normal rtl:normal-case text-persici-crimson mb-6 sm:mb-8 backdrop-blur-xs">
              <TbSparkles className="h-3.5 w-3.5 shrink-0" />
              <span>{badgeText}</span>
            </div>
          </FadeUp>

          {/* Main Title */}
          <FadeUp delay={120} duration={850} distance={24} blur={true}>
            <h1 className="font-primary text-4xl font-medium tracking-tight rtl:tracking-normal text-slate-900 sm:text-5xl lg:text-6xl sm:leading-[1.12] rtl:leading-[1.25] rtl:sm:leading-[1.2]">
              {titleText}{' '}
              {titleHighlightText && (
                <span className="text-persici-crimson">{titleHighlightText}</span>
              )}
            </h1>
          </FadeUp>

          {/* Subtitle */}
          <FadeUp delay={240} duration={800} distance={20}>
            {isHtmlSubtitle ? (
              <div
                className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: subtitleText }}
              />
            ) : (
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                {subtitleText}
              </p>
            )}
          </FadeUp>

          {/* Action CTAs */}
          <FadeUp delay={360} duration={750} distance={18}>
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
              <HomeButton
                href={primaryCtaHref}
                title={primaryCtaLabel}
                className="bg-persici-crimson text-white hover:bg-persici-crimson/90"
                currentLang={lang}
                isLangEffectIcon={true}
              />

              <HomeButton
                href={secondaryCtaHref}
                title={secondaryCtaLabel}
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

