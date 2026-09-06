import React from 'react';
import type { SolutionsPageContent } from '@shared/types';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { HomeButton, ShapedImageContainer, FadeUp, CountUp } from '@shared';

export interface SolutionsStorySpotlightProps {
  content?: SolutionsPageContent;
  badge?: string | { en: string; ar: string };
  title?: string | { en: string; ar: string };
  description?: string | { en: string; ar: string };
  metric1Val?: string;
  metric1Label?: string | { en: string; ar: string };
  metric2Val?: string;
  metric2Label?: string | { en: string; ar: string };
  image?: string;
  ctaText?: string | { en: string; ar: string };
  ctaHref?: string;
  lang: string;
  className?: string;
}

export function SolutionsStorySpotlight({
  content,
  badge,
  title,
  description,
  metric1Val,
  metric1Label,
  metric2Val,
  metric2Label,
  image,
  ctaText,
  ctaHref,
  lang,
  className,
}: SolutionsStorySpotlightProps) {
  const isRtl = lang === 'ar';

  const badgeText =
    (typeof badge === 'string'
      ? badge
      : badge?.[lang as 'en' | 'ar'] || badge?.en) ||
    (content?.spotlightBadge
      ? content.spotlightBadge[lang as 'en' | 'ar'] || content.spotlightBadge.en
      : isRtl ? 'قصة نجاح مميزة' : 'Featured Client Story');

  const titleText =
    (typeof title === 'string'
      ? title
      : title?.[lang as 'en' | 'ar'] || title?.en) ||
    (content?.spotlightTitle
      ? content.spotlightTitle[lang as 'en' | 'ar'] || content.spotlightTitle.en
      : '');

  const descText =
    (typeof description === 'string'
      ? description
      : description?.[lang as 'en' | 'ar'] || description?.en) ||
    (content?.spotlightDescription
      ? content.spotlightDescription[lang as 'en' | 'ar'] || content.spotlightDescription.en
      : '');

  const m1Val = metric1Val || content?.spotlightMetric1Val || '';
  const m1Label =
    (typeof metric1Label === 'string'
      ? metric1Label
      : metric1Label?.[lang as 'en' | 'ar'] || metric1Label?.en) ||
    (content?.spotlightMetric1Label
      ? content.spotlightMetric1Label[lang as 'en' | 'ar'] || content.spotlightMetric1Label.en
      : '');

  const m2Val = metric2Val || content?.spotlightMetric2Val || '';
  const m2Label =
    (typeof metric2Label === 'string'
      ? metric2Label
      : metric2Label?.[lang as 'en' | 'ar'] || metric2Label?.en) ||
    (content?.spotlightMetric2Label
      ? content.spotlightMetric2Label[lang as 'en' | 'ar'] || content.spotlightMetric2Label.en
      : '');

  const storyImage = image || content?.spotlightImage || '';

  const actionText =
    (typeof ctaText === 'string'
      ? ctaText
      : ctaText?.[lang as 'en' | 'ar'] || ctaText?.en) ||
    (content?.spotlightCtaText
      ? content.spotlightCtaText[lang as 'en' | 'ar'] || content.spotlightCtaText.en
      : isRtl ? 'اقرأ قصة النجاح' : 'Read Client Story');

  const rawHref = ctaHref || content?.spotlightCtaHref || '/client-stories';
  const finalHref = rawHref.startsWith('/') ? `/${lang}${rawHref}` : `/${lang}/${rawHref}`;

  return (
    <section className={`${className || sectionPaddingY} bg-gradient-to-b from-[#F5F6F9] via-[#EAECEF] to-[#F2F4F7] relative overflow-hidden border-y border-slate-200/60`}>
      {/* Modern architectural fluted waves texture matching reference */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 select-none overflow-hidden"
        aria-hidden="true"
      >
        <svg
          className="absolute w-[160%] h-[160%] -top-[30%] -left-[30%] text-slate-400/40"
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M-200 900 C 150 750, 450 850, 800 650 C 1050 500, 1150 350, 1300 200" stroke="currentColor" strokeWidth="55" strokeOpacity="0.25" />
          <path d="M-200 800 C 150 650, 450 750, 800 550 C 1050 400, 1150 250, 1300 100" stroke="currentColor" strokeWidth="65" strokeOpacity="0.3" />
          <path d="M-200 700 C 150 550, 450 650, 800 450 C 1050 300, 1150 150, 1300 0" stroke="currentColor" strokeWidth="75" strokeOpacity="0.35" />
          <path d="M-200 600 C 150 450, 450 550, 800 350 C 1050 200, 1150 50, 1300 -100" stroke="currentColor" strokeWidth="85" strokeOpacity="0.3" />
          <path d="M-200 500 C 150 350, 450 450, 800 250 C 1050 100, 1150 -50, 1300 -200" stroke="currentColor" strokeWidth="95" strokeOpacity="0.2" />
        </svg>
      </div>

      {/* Subtle modern ambient illumination */}
      <div
        className="absolute -top-32 right-1/4 h-[500px] w-[500px] rounded-full bg-white/70 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 left-1/4 h-[500px] w-[500px] rounded-full bg-persici-crimson/[0.04] blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className={`${sectionContainer} relative z-10`}>
        {/* Floating Spotlight Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-8 sm:p-12 lg:p-14 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] backdrop-blur-xs">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Story Details Column (7 cols) with FadeUp */}
            <div className="lg:col-span-7">
              <FadeUp
                direction={isRtl ? 'left' : 'right'}
                distance={24}
                duration={750}
              >
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
                  {badgeText}
                </span>

                <h2 className="mt-4 font-primary text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                  {titleText}
                </h2>

                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {descText}
                </p>

                {/* Side-by-side Metrics */}
                {(m1Val || m2Val) && (
                  <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-slate-200/80">
                    {m1Val && (
                      <div>
                        <div className="font-primary text-3xl sm:text-4xl font-extrabold text-persici-crimson">
                          <CountUp value={m1Val} />
                        </div>
                        {m1Label && (
                          <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                            {m1Label}
                          </div>
                        )}
                      </div>
                    )}

                    {m2Val && (
                      <div>
                        <div className="font-primary text-3xl sm:text-4xl font-extrabold text-slate-900">
                          <CountUp value={m2Val} />
                        </div>
                        {m2Label && (
                          <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                            {m2Label}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Action with HomeButton */}
                {actionText && (
                  <div className="mt-8">
                    <HomeButton
                      href={finalHref}
                      title={actionText}
                      className="bg-persici-crimson text-white hover:bg-persici-crimson/90"
                      currentLang={lang}
                      isLangEffectIcon={true}
                    />
                  </div>
                )}
              </FadeUp>
            </div>

            {/* Story Image Column with ShapedImageContainer */}
            {storyImage && (
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
                    src={storyImage}
                    alt={titleText}
                    aspectRatio="aspect-4/5"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="drop-shadow-xl"
                  />
                </FadeUp>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Reusable alias
export const FeaturedClientStory = SolutionsStorySpotlight;
