'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SolutionsPageContent, FeaturedClientStoryItem, StoryMetricItem } from '@shared/types';
import { FadeUp, CountUp } from '@shared';
import { extractStoryMetrics } from '../featured-client-stories';

export interface FeaturedClientStoryCardProps {
  /**
   * Main story data object (supports both structured FeaturedClientStoryItem or generic record)
   */
  story?: FeaturedClientStoryItem | Record<string, unknown>;

  /**
   * Direct prop overrides if not using a story object
   */
  badge?: string | { en: string; ar: string };
  category?: string | { en: string; ar: string };
  subtitle?: string | { en: string; ar: string };
  title?: string | { en: string; ar: string };
  description?: string | { en: string; ar: string };
  metrics?: StoryMetricItem[];
  metric1Val?: string;
  metric1Label?: string | { en: string; ar: string };
  metric2Val?: string;
  metric2Label?: string | { en: string; ar: string };
  metric3Val?: string;
  metric3Label?: string | { en: string; ar: string };
  image?: string;
  ctaText?: string | { en: string; ar: string };
  ctaHref?: string;

  /**
   * Optional fallback content object for solutions integration
   */
  content?: SolutionsPageContent | Record<string, unknown> | null;

  /**
   * Language code (e.g. 'en', 'ar')
   */
  lang?: string;

  /**
   * Stacking configuration when used within a sticky stacked layout
   */
  isStacked?: boolean;
  stackIndex?: number;

  /**
   * Refs for external scroll animation orchestrators
   */
  wrapperRef?: React.Ref<HTMLDivElement>;
  innerRef?: React.Ref<HTMLDivElement>;

  /**
   * Custom classes & styles
   */
  className?: string;
  wrapperClassName?: string;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
}

/**
 * FeaturedClientStoryCard
 * Standalone client story card featuring a high-impact headline, eyebrow badge,
 * dynamic metrics with CountUp animations, feathered image background, and action link.
 * Can be used standalone, in a carousel, in a grid, or within stacked sticky scroll layouts.
 */
export function FeaturedClientStoryCard({
  story,
  badge,
  category,
  subtitle,
  title,
  description,
  metrics,
  metric1Val,
  metric1Label,
  metric2Val,
  metric2Label,
  metric3Val,
  metric3Label,
  image,
  ctaText,
  ctaHref,
  content,
  lang = 'en',
  isStacked = false,
  stackIndex = 0,
  wrapperRef,
  innerRef,
  className = '',
  wrapperClassName = '',
  style,
  innerStyle,
}: FeaturedClientStoryCardProps) {
  const isRtl = lang === 'ar';

  const storyObj = (story || {}) as Record<string, unknown>;

  const resolveStringOrLoc = (val: unknown): string | undefined => {
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null) {
      const loc = val as { en?: string; ar?: string };
      return (lang === 'ar' ? loc.ar : loc.en) || loc.en || loc.ar;
    }
    return undefined;
  };

  // 1. Resolve Badge / Category
  const itemBadge =
    resolveStringOrLoc(badge) ||
    resolveStringOrLoc(category) ||
    resolveStringOrLoc(subtitle) ||
    resolveStringOrLoc(storyObj.badge) ||
    resolveStringOrLoc(storyObj.category) ||
    resolveStringOrLoc(storyObj.subtitle);

  // 2. Resolve Title
  const itemTitle =
    resolveStringOrLoc(title) ||
    resolveStringOrLoc(storyObj.title) ||
    '';

  // 3. Resolve Description
  const itemDesc =
    resolveStringOrLoc(description) ||
    resolveStringOrLoc(storyObj.description) ||
    resolveStringOrLoc(storyObj.summary) ||
    resolveStringOrLoc(storyObj.overview);

  // 4. Resolve CTA
  const rawCta = ctaText || (storyObj.ctaText as string | { en?: string; ar?: string }) || 'Explore Story';
  const itemCta =
    typeof rawCta === 'string'
      ? rawCta
      : (rawCta as { en?: string; ar?: string })[lang as 'en' | 'ar'] || (rawCta as { en?: string; ar?: string }).en;

  const rawHref = ctaHref || (storyObj.ctaHref as string) || '/client-stories';
  const finalHref = rawHref.startsWith(`/${lang}`)
    ? rawHref
    : rawHref.startsWith('/')
    ? `/${lang}${rawHref}`
    : `/${lang}/${rawHref}`;

  // 5. Resolve Metrics
  const resolvedMetrics: StoryMetricItem[] =
    metrics ||
    extractStoryMetrics(
      {
        ...storyObj,
        metric1Val: metric1Val ?? storyObj.metric1Val,
        metric1Label: metric1Label ?? storyObj.metric1Label,
        metric2Val: metric2Val ?? storyObj.metric2Val,
        metric2Label: metric2Label ?? storyObj.metric2Label,
        metric3Val: metric3Val ?? storyObj.metric3Val,
        metric3Label: metric3Label ?? storyObj.metric3Label,
      } as FeaturedClientStoryItem,
      content,
      lang
    );
  const metricCount = resolvedMetrics.length;

  // 6. Resolve Image
  const storyImage =
    image ||
    (storyObj.image as string) ||
    (content as SolutionsPageContent)?.spotlightImage ||
    '';

  const defaultWrapperStyle: React.CSSProperties = isStacked
    ? {
        top: `calc(5.5rem + ${stackIndex * 1.5}rem)`,
        zIndex: 10 + stackIndex,
        ...style,
      }
    : style || {};

  return (
    <div
      ref={wrapperRef}
      style={defaultWrapperStyle}
      className={`${isStacked ? 'sticky' : 'relative'} ${wrapperClassName}`}
    >
      <div
        ref={innerRef}
        style={{
          transformOrigin: 'top center',
          ...innerStyle,
        }}
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 lg:p-12 xl:p-14 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] will-change-transform transition-[transform,filter] duration-100 ease-out ${className}`}
      >
        {/* Right-aligned featured image with seamless gradient feather into white card */}
        {storyImage && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-[58%] lg:w-[60%] xl:w-[64%] pointer-events-none select-none overflow-hidden rtl:right-auto rtl:left-0">
            <Image
              src={storyImage}
              alt={typeof itemTitle === 'string' ? itemTitle : ''}
              fill
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover object-center lg:object-right"
            />
            {/* Seamless gradient mask / overlay fading into white on the left (or right in RTL) */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-30% to-transparent rtl:bg-gradient-to-l rtl:from-white rtl:via-white/80 rtl:via-30% rtl:to-transparent z-1" />
            {/* Mobile vertical fade to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-transparent lg:hidden z-1" />
          </div>
        )}

        {/* Left Content Column */}
        <div className="relative z-10 max-w-xl lg:max-w-2xl flex flex-col justify-between">
          <FadeUp
            direction={isRtl ? 'left' : 'right'}
            distance={20}
            duration={700}
          >
            {/* Eyebrow badge capsule */}
            {itemBadge && (
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-medium text-slate-700 bg-slate-100/90 border border-slate-200/60 shadow-2xs mb-6 sm:mb-8 w-fit">
                {itemBadge}
              </span>
            )}

            {/* Main Story Headline */}
            <h2 className="font-primary text-2xl sm:text-3xl lg:text-[2.2rem] font-normal sm:font-medium text-slate-950 leading-[1.25] tracking-tight mb-4">
              {itemTitle}
            </h2>

            {/* Story Description */}
            {itemDesc && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-lg mb-8 sm:mb-10">
                {itemDesc}
              </p>
            )}

            {/* Dynamic Metrics Section with Divider */}
            {metricCount > 0 && (
              <div className="w-full mb-8 sm:mb-10">
                {/* Clean thin horizontal line right above metrics */}
                <hr className="border-t border-slate-200/90 w-full mb-6 sm:mb-8" />

                {/* Dynamic grid automatically sizing based on metric count */}
                <div
                  className={`grid gap-6 sm:gap-8 ${
                    metricCount === 1
                      ? 'grid-cols-1 max-w-xs'
                      : metricCount === 2
                      ? 'grid-cols-2 max-w-md'
                      : metricCount === 3
                      ? 'grid-cols-2 sm:grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-4'
                  }`}
                >
                  {resolvedMetrics.map((m, mIdx) => {
                    const labelText =
                      typeof m.label === 'string'
                        ? m.label
                        : m.label?.[lang as 'en' | 'ar'] || m.label?.en || '';
                    return (
                      <div key={m.id || mIdx} className="flex flex-col">
                        <div className="font-primary text-3xl sm:text-4xl lg:text-[2.5rem] font-normal sm:font-medium text-slate-950 tracking-tight leading-none">
                          <CountUp value={m.value} />
                        </div>
                        {labelText && (
                          <div className="mt-2 text-xs sm:text-sm font-normal text-slate-500 lowercase leading-snug max-w-[150px]">
                            {labelText}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Link with Arrow */}
            {itemCta && (
              <div className="pt-2">
                <Link
                  href={finalHref}
                  className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-950 group select-none w-fit"
                >
                  <span
                    className={`relative py-0.5 after:absolute after:bottom-0 after:h-[1.5px] after:w-full after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out group-hover:after:scale-x-100 ${
                      isRtl
                        ? 'after:right-0 after:origin-bottom-right'
                        : 'after:left-0 after:origin-bottom-left'
                    }`}
                  >
                    {itemCta}
                  </span>
                  <span className="text-base font-bold transition-transform duration-300 ease-in-out group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 rtl:rotate-180 shrink-0">
                    →
                  </span>
                </Link>
              </div>
            )}
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

// Reusable aliases
export const ClientStoryCard = FeaturedClientStoryCard;
export type ClientStoryCardProps = FeaturedClientStoryCardProps;
export const StoryCard = FeaturedClientStoryCard;
export type StoryCardProps = FeaturedClientStoryCardProps;
