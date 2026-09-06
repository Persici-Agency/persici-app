import React from 'react';
import type { SolutionsPageContent } from '@shared/types';
import { sectionContainer, sectionPaddingY, badgePill } from '@shared/constants';
import { HomeButton, ShapedImageContainer, FadeUp, CountUp } from '@shared';

interface SolutionsStorySpotlightProps {
  content: SolutionsPageContent;
  lang: string;
}

export function SolutionsStorySpotlight({
  content,
  lang,
}: SolutionsStorySpotlightProps) {
  const isRtl = lang === 'ar';
  const badge = content.spotlightBadge[lang as 'en' | 'ar'] || content.spotlightBadge.en;
  const title = content.spotlightTitle[lang as 'en' | 'ar'] || content.spotlightTitle.en;
  const desc = content.spotlightDescription[lang as 'en' | 'ar'] || content.spotlightDescription.en;
  const metric1Label = content.spotlightMetric1Label[lang as 'en' | 'ar'] || content.spotlightMetric1Label.en;
  const metric2Label = content.spotlightMetric2Label[lang as 'en' | 'ar'] || content.spotlightMetric2Label.en;
  const ctaText = content.spotlightCtaText[lang as 'en' | 'ar'] || content.spotlightCtaText.en;
  const quoteText = content.quoteText[lang as 'en' | 'ar'] || content.quoteText.en;
  const quoteRole = content.quoteRole[lang as 'en' | 'ar'] || content.quoteRole.en;

  return (
    <section className={`${sectionPaddingY} bg-white relative overflow-hidden`}>
      <div className={sectionContainer}>
        {/* Floating Spotlight Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-linear-to-br from-white via-persici-white to-slate-50/60 p-8 sm:p-12 lg:p-14 shadow-xl">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Story Details Column (7 cols) with FadeUp */}
            <div className="lg:col-span-7">
              <FadeUp
                direction={isRtl ? 'left' : 'right'}
                distance={24}
                duration={750}
              >
                <span className={badgePill}>
                  {badge}
                </span>

                <h2 className="mt-4 font-primary text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                  {title}
                </h2>

                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {desc}
                </p>

                {/* Side-by-side Metrics */}
                <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-slate-200/80">
                  <div>
                    <div className="font-primary text-3xl sm:text-4xl font-extrabold text-persici-crimson">
                      <CountUp value={content.spotlightMetric1Val} />
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                      {metric1Label}
                    </div>
                  </div>

                  <div>
                    <div className="font-primary text-3xl sm:text-4xl font-extrabold text-slate-900">
                      <CountUp value={content.spotlightMetric2Val} />
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                      {metric2Label}
                    </div>
                  </div>
                </div>

                {/* Action with HomeButton */}
                <div className="mt-8">
                  <HomeButton
                    href={`/${lang}${content.spotlightCtaHref}`}
                    title={ctaText}
                    className="bg-persici-crimson text-white hover:bg-persici-crimson/90"
                    currentLang={lang}
                    isLangEffectIcon={true}
                  />
                </div>
              </FadeUp>
            </div>

            {/* Story Image Column with ShapedImageContainer */}
            <div className="lg:col-span-5 relative">
              <FadeUp
                direction={isRtl ? 'right' : 'left'}
                delay={100}
                distance={24}
                duration={750}
                className="relative"
              >
                <ShapedImageContainer
                  shape="sapient-stepped-diagonal"
                  src={content.spotlightImage}
                  alt={title}
                  aspectRatio="aspect-4/5"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="drop-shadow-xl"
                />
              </FadeUp>
            </div>
          </div>
        </div>

        {/* Executive Quote Section with FadeUp */}
        <FadeUp delay={150} duration={800} distance={20} className="mt-16 sm:mt-24 max-w-4xl mx-auto text-center px-4">
          <blockquote className="font-primary text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
            {quoteText}
          </blockquote>
          <div className="mt-6">
            <div className="font-semibold text-slate-900 text-base">
              {content.quoteAuthor}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {quoteRole}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
