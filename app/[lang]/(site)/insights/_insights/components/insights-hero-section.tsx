'use client';

import React from 'react';
import Image from 'next/image';
import { sectionContainer } from '@shared/constants';
import { HomeButton, FadeUp } from '@shared/components';
import { TbSparkles } from 'react-icons/tb';
import type { Dictionary } from '@dictionaries';
import type { InsightsHubPageData } from '../types';
import { insightsHubPageData } from '../data/insights.data';

export interface InsightsHeroSectionProps {
  lang: string;
  dict?: Dictionary;
  hero?: InsightsHubPageData['hero'];
}

export function InsightsHeroSection({ lang, hero }: InsightsHeroSectionProps) {
  const isRtl = lang === 'ar';
  const locale = (lang === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
  const data = hero || insightsHubPageData.hero;

  const badgeText = data.badge?.[locale] || data.badge?.en || '';
  const titleText = data.title?.[locale] || data.title?.en || '';
  const titleHighlightText = data.titleHighlight?.[locale] || data.titleHighlight?.en || '';
  const descriptionText = data.description?.[locale] || data.description?.en || '';
  const isDescriptionHtml = /<[a-z][\s\S]*>/i.test(descriptionText);

  const primaryCtaLabel = data.primaryCtaLabel?.[locale] || data.primaryCtaLabel?.en || '';
  const rawPrimaryHref = data.primaryCtaHref || '/insights/can-gen-ai-help-agile-teams-improve-delivery-clarity';
  const primaryHref =
    rawPrimaryHref.startsWith('http') || rawPrimaryHref.startsWith('#') || rawPrimaryHref.startsWith(`/${lang}`)
      ? rawPrimaryHref
      : `/${lang}${rawPrimaryHref.startsWith('/') ? '' : '/'}${rawPrimaryHref}`;

  const secondaryCtaLabel = data.secondaryCtaLabel?.[locale] || data.secondaryCtaLabel?.en || '';
  const rawSecondaryHref = data.secondaryCtaHref || '#explore';
  const secondaryHref =
    rawSecondaryHref.startsWith('http') || rawSecondaryHref.startsWith('#') || rawSecondaryHref.startsWith(`/${lang}`)
      ? rawSecondaryHref
      : `/${lang}${rawSecondaryHref.startsWith('/') ? '' : '/'}${rawSecondaryHref}`;

  const heroImageSrc = data.heroImage || '/images/insights/insights-hero-award.webp';
  const heroImageAlt = data.heroImageAlt?.[locale] || data.heroImageAlt?.en || 'Insights Hero';

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Headline, Narrative & HomeButtons */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            {/* Badge */}
            {badgeText && (
              <FadeUp delay={0} duration={750} distance={16}>
                <div className="inline-flex items-center gap-2 rounded-full border border-persici-crimson/20 bg-persici-crimson/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rtl:tracking-normal rtl:normal-case text-persici-crimson mb-6 backdrop-blur-xs">
                  <TbSparkles className="h-3.5 w-3.5 shrink-0" />
                  <span>{badgeText}</span>
                </div>
              </FadeUp>
            )}

            {/* Main Headline */}
            <FadeUp delay={120} duration={850} distance={24} blur={true}>
              <h1 className="font-primary text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight rtl:tracking-normal text-slate-900 leading-[1.12] rtl:leading-[1.25]">
                {titleText}{' '}
                {titleHighlightText && (
                  <span className="text-persici-crimson">{titleHighlightText}</span>
                )}
              </h1>
            </FadeUp>

            {/* Descriptive Body Copy */}
            {descriptionText && (
              <FadeUp delay={240} duration={800} distance={20}>
                {isDescriptionHtml ? (
                  <div
                    className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl [&_p]:mb-3 [&_p:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: descriptionText }}
                  />
                ) : (
                  <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                    {descriptionText}
                  </p>
                )}
              </FadeUp>
            )}

            {/* HomeButtons */}
            <FadeUp delay={360} duration={750} distance={18}>
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                {primaryCtaLabel && (
                  <HomeButton
                    href={primaryHref}
                    title={primaryCtaLabel}
                    className="bg-persici-crimson text-white hover:bg-persici-crimson/90"
                    currentLang={lang}
                    isLangEffectIcon={true}
                  />
                )}

                {secondaryCtaLabel && (
                  <HomeButton
                    href={secondaryHref}
                    title={secondaryCtaLabel}
                    className="bg-slate-900 text-white hover:bg-slate-800"
                    currentLang={lang}
                    isLangEffectIcon={true}
                  />
                )}
              </div>
            </FadeUp>
          </div>

          {/* Right Column: High Quality Hero Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <FadeUp delay={200} duration={900} distance={30}>
              <div className="relative group">
                {/* Decorative glowing ambient rings */}
                <div className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-persici-crimson/25 via-persici-crimson/10 to-amber-500/20 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Hero Award Image Container */}
                <div className="relative w-[280px] h-[360px] sm:w-[340px] sm:h-[430px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-950 group-hover:scale-[1.01] transition-transform duration-500">
                  <Image
                    src={heroImageSrc}
                    alt={heroImageAlt}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 300px, 400px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

