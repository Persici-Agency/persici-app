'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SolutionsPageContent, FeaturedClientStoryItem, StoryMetricItem } from '@shared/types';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp, CountUp } from '@shared';

export type { StoryMetricItem, FeaturedClientStoryItem };

export interface StackedFeaturedClientStoriesProps {
  // Background options
  backgroundType?: 'default' | 'image' | 'code';
  backgroundImage?: string;
  isCodeBackground?: boolean;
  backgroundCode?: string | React.ReactNode;

  // Optional Section Header
  sectionBadge?: string | { en: string; ar: string };
  sectionTitle?: string | { en: string; ar: string };
  sectionSubtitle?: string | { en: string; ar: string };

  // Multiple Stories (triggers stacked sticky behavior when length > 1)
  stories?: FeaturedClientStoryItem[];

  // Fallback single story props (backward compatibility)
  content?: SolutionsPageContent;
  badge?: string | { en: string; ar: string };
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

  // Base props
  lang: string;
  className?: string;
}

/**
 * Dynamically extracts and counts static numbers / metrics from incoming story data or CMS content.
 * Inspects arrays (`metrics`, `stats`, `kpis`), indexed fields (`metric1Val`, `metric2Val`, etc.),
 * and dynamic keys so the component knows exactly how many CountUp elements to render.
 */
export function extractStoryMetrics(
  story?: FeaturedClientStoryItem | Record<string, unknown> | null,
  content?: SolutionsPageContent | Record<string, unknown> | null,
  lang: string = 'en'
): StoryMetricItem[] {
  const results: StoryMetricItem[] = [];
  const seenValues = new Set<string>();

  const storyObj = story as Record<string, unknown> | undefined | null;
  const contentObj = content as Record<string, unknown> | undefined | null;

  const addMetric = (val: unknown, lbl: unknown, id?: string) => {
    if (val === undefined || val === null) return;
    const strVal = String(val).trim();
    if (!strVal) return;

    let labelStr = '';
    if (typeof lbl === 'string') {
      labelStr = lbl;
    } else if (typeof lbl === 'object' && lbl !== null) {
      const loc = lbl as { en?: string; ar?: string };
      labelStr = (lang === 'ar' ? loc.ar : loc.en) || loc.en || loc.ar || '';
    }

    const key = `${strVal}_${labelStr}`;
    if (seenValues.has(key)) return;
    seenValues.add(key);

    results.push({
      id: id || `metric-${results.length}`,
      value: strVal,
      label: (lbl as string | { en: string; ar: string }) || undefined,
    });
  };

  if (!story && !content) return results;

  // 1. If story is provided, extract its metrics first
  if (storyObj) {
    // Array of metrics on story (e.g. story.metrics, story.stats, story.kpis)
    const explicitArray =
      (storyObj.metrics as unknown[]) ||
      (storyObj.stats as unknown[]) ||
      (storyObj.kpis as unknown[]);
    if (Array.isArray(explicitArray) && explicitArray.length > 0) {
      for (const item of explicitArray) {
        if (typeof item === 'object' && item !== null) {
          const itemObj = item as Record<string, unknown>;
          const val = itemObj.value ?? itemObj.val ?? itemObj.number ?? itemObj.stat;
          const lbl = itemObj.label ?? itemObj.text ?? itemObj.title ?? itemObj.description;
          addMetric(val, lbl, typeof itemObj.id === 'string' ? itemObj.id : undefined);
        } else if (typeof item === 'string' || typeof item === 'number') {
          addMetric(item, '');
        }
      }
      if (results.length > 0) return results;
    }

    // Sequential indexed properties on story (e.g. metric1Val..metric10Val)
    for (let i = 1; i <= 10; i++) {
      const val =
        storyObj[`metric${i}Val`] ??
        storyObj[`metric${i}Value`] ??
        storyObj[`metric${i}`] ??
        storyObj[`stat${i}Val`] ??
        storyObj[`stat${i}`] ??
        storyObj[`kpi${i}Val`];

      const lbl =
        storyObj[`metric${i}Label`] ??
        storyObj[`metric${i}Text`] ??
        storyObj[`metric${i}Title`] ??
        storyObj[`stat${i}Label`] ??
        storyObj[`kpi${i}Label`];

      if (val !== undefined && val !== null && String(val).trim() !== '') {
        addMetric(val, lbl, `story-idx-${i}`);
      }
    }
    if (results.length > 0) return results;

    // Dynamic key scanning for any static number/percentage patterns in story
    const metricValuePattern = /^(?:metric|stat|kpi|number|count)(\d+)?(?:val|value)?$/i;
    for (const key of Object.keys(storyObj)) {
      if (metricValuePattern.test(key)) {
        const val = storyObj[key];
        const baseName = key.replace(/(?:val|value)$/i, '');
        const labelKey = Object.keys(storyObj).find(
          (k) =>
            k.toLowerCase() === `${baseName.toLowerCase()}label` ||
            k.toLowerCase() === `${baseName.toLowerCase()}text`
        );
        const lbl = labelKey ? storyObj[labelKey] : undefined;
        addMetric(val, lbl, key);
      }
    }
    if (results.length > 0) return results;
  }

  // 2. Fallback to CMS content-level metrics if story had none
  if (contentObj) {
    if (Array.isArray(contentObj.spotlightMetrics) && contentObj.spotlightMetrics.length > 0) {
      for (const item of contentObj.spotlightMetrics as unknown[]) {
        if (typeof item === 'object' && item !== null) {
          const itemObj = item as Record<string, unknown>;
          addMetric(
            itemObj.value ?? itemObj.val,
            itemObj.label ?? itemObj.text,
            typeof itemObj.id === 'string' ? itemObj.id : undefined
          );
        }
      }
      if (results.length > 0) return results;
    }

    for (let i = 1; i <= 10; i++) {
      const val =
        contentObj[`spotlightMetric${i}Val`] ??
        contentObj[`spotlightMetric${i}Value`] ??
        contentObj[`spotlightMetric${i}`];

      const lbl =
        contentObj[`spotlightMetric${i}Label`] ??
        contentObj[`spotlightMetric${i}Text`] ??
        contentObj[`spotlightMetric${i}Title`];

      if (val !== undefined && val !== null && String(val).trim() !== '') {
        addMetric(val, lbl, `content-idx-${i}`);
      }
    }
  }

  return results;
}

/**
 * Helper to return the exact count of static numbers / metrics in a client story.
 */
export function getStoryMetricsCount(
  story?: FeaturedClientStoryItem | Record<string, unknown> | null,
  content?: SolutionsPageContent | Record<string, unknown> | null
): number {
  return extractStoryMetrics(story, content).length;
}

export function StackedFeaturedClientStories({
  backgroundType,
  backgroundImage,
  isCodeBackground,
  backgroundCode,
  sectionBadge,
  sectionTitle,
  sectionSubtitle,
  stories,
  content,
  badge,
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
  lang,
  className,
}: StackedFeaturedClientStoriesProps) {
  const isRtl = lang === 'ar';
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // Determine active background mode
  const resolvedBgType =
    isCodeBackground || backgroundType === 'code'
      ? 'code'
      : backgroundImage || backgroundType === 'image'
      ? 'image'
      : 'default';

  // Execute scripts if dynamic code background contains <script> tags
  useEffect(() => {
    if (resolvedBgType === 'code' && typeof backgroundCode === 'string' && codeContainerRef.current) {
      const scripts = codeContainerRef.current.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [resolvedBgType, backgroundCode]);

  // Resolve stories array (support multiple stories or fallback to single story from props/content)
  const resolvedStories: FeaturedClientStoryItem[] =
    stories && stories.length > 0
      ? stories
      : content?.spotlightStories && content.spotlightStories.length > 0
      ? content.spotlightStories
      : [
          {
            badge:
              (typeof badge === 'string'
                ? badge
                : badge?.[lang as 'en' | 'ar'] || badge?.en) ||
              (content?.spotlightBadge
                ? content.spotlightBadge[lang as 'en' | 'ar'] || content.spotlightBadge.en
                : isRtl ? 'قصة نجاح مميزة' : 'Featured Client Story'),
            title:
              (typeof title === 'string'
                ? title
                : title?.[lang as 'en' | 'ar'] || title?.en) ||
              (content?.spotlightTitle
                ? content.spotlightTitle[lang as 'en' | 'ar'] || content.spotlightTitle.en
                : ''),
            description:
              (typeof description === 'string'
                ? description
                : description?.[lang as 'en' | 'ar'] || description?.en) ||
              (content?.spotlightDescription
                ? content.spotlightDescription[lang as 'en' | 'ar'] || content.spotlightDescription.en
                : ''),
            metrics: metrics || content?.spotlightMetrics,
            metric1Val: metric1Val || content?.spotlightMetric1Val || '',
            metric1Label:
              (typeof metric1Label === 'string'
                ? metric1Label
                : metric1Label?.[lang as 'en' | 'ar'] || metric1Label?.en) ||
              (content?.spotlightMetric1Label
                ? content.spotlightMetric1Label[lang as 'en' | 'ar'] || content.spotlightMetric1Label.en
                : ''),
            metric2Val: metric2Val || content?.spotlightMetric2Val || '',
            metric2Label:
              (typeof metric2Label === 'string'
                ? metric2Label
                : metric2Label?.[lang as 'en' | 'ar'] || metric2Label?.en) ||
              (content?.spotlightMetric2Label
                ? content.spotlightMetric2Label[lang as 'en' | 'ar'] || content.spotlightMetric2Label.en
                : ''),
            metric3Val: metric3Val || content?.spotlightMetric3Val || '',
            metric3Label:
              (typeof metric3Label === 'string'
                ? metric3Label
                : metric3Label?.[lang as 'en' | 'ar'] || metric3Label?.en) ||
              (content?.spotlightMetric3Label
                ? content.spotlightMetric3Label[lang as 'en' | 'ar'] || content.spotlightMetric3Label.en
                : ''),
            image: image || content?.spotlightImage || '',
            ctaText:
              (typeof ctaText === 'string'
                ? ctaText
                : ctaText?.[lang as 'en' | 'ar'] || ctaText?.en) ||
              (content?.spotlightCtaText
                ? content.spotlightCtaText[lang as 'en' | 'ar'] || content.spotlightCtaText.en
                : isRtl ? 'اعرف المزيد' : 'Learn more'),
            ctaHref: ctaHref || content?.spotlightCtaHref || '/client-stories',
          },
        ];

  const isStacked = resolvedStories.length > 1;

  // Optional Section Header Strings
  const secBadge =
    typeof sectionBadge === 'string'
      ? sectionBadge
      : sectionBadge?.[lang as 'en' | 'ar'] || sectionBadge?.en;
  const secTitle =
    typeof sectionTitle === 'string'
      ? sectionTitle
      : sectionTitle?.[lang as 'en' | 'ar'] || sectionTitle?.en;
  const secSubtitle =
    typeof sectionSubtitle === 'string'
      ? sectionSubtitle
      : sectionSubtitle?.[lang as 'en' | 'ar'] || sectionSubtitle?.en;

  const bgBaseClass =
    resolvedBgType === 'default'
      ? 'bg-gradient-to-b from-[#F5F6F9] via-[#EAECEF] to-[#F2F4F7]'
      : resolvedBgType === 'image'
      ? 'bg-slate-900'
      : 'bg-transparent';

  return (
    <section
      className={`${className || sectionPaddingY} ${bgBaseClass} relative overflow-clip border-y border-slate-200/60`}
    >
      {/* 1. Code Background Mode */}
      {resolvedBgType === 'code' && (
        <div
          ref={codeContainerRef}
          className="absolute inset-0 overflow-hidden pointer-events-none z-0"
        >
          {typeof backgroundCode === 'string' ? (
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: backgroundCode }}
            />
          ) : (
            backgroundCode
          )}
        </div>
      )}

      {/* 2. Image Background Mode */}
      {resolvedBgType === 'image' && backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-0 pointer-events-none" />
        </>
      )}

      {/* 3. Default Architectural Waves Background Mode */}
      {resolvedBgType === 'default' && (
        <>
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
              <path
                d="M-200 900 C 150 750, 450 850, 800 650 C 1050 500, 1150 350, 1300 200"
                stroke="currentColor"
                strokeWidth="55"
                strokeOpacity="0.25"
              />
              <path
                d="M-200 800 C 150 650, 450 750, 800 550 C 1050 400, 1150 250, 1300 100"
                stroke="currentColor"
                strokeWidth="65"
                strokeOpacity="0.3"
              />
              <path
                d="M-200 700 C 150 550, 450 650, 800 450 C 1050 300, 1150 150, 1300 0"
                stroke="currentColor"
                strokeWidth="75"
                strokeOpacity="0.35"
              />
              <path
                d="M-200 600 C 150 450, 450 550, 800 350 C 1050 200, 1150 50, 1300 -100"
                stroke="currentColor"
                strokeWidth="85"
                strokeOpacity="0.3"
              />
              <path
                d="M-200 500 C 150 350, 450 450, 800 250 C 1050 100, 1150 -50, 1300 -200"
                stroke="currentColor"
                strokeWidth="95"
                strokeOpacity="0.2"
              />
            </svg>
          </div>

          <div
            className="absolute -top-32 right-1/4 h-[500px] w-[500px] rounded-full bg-white/70 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-32 left-1/4 h-[500px] w-[500px] rounded-full bg-persici-crimson/[0.04] blur-3xl pointer-events-none"
            aria-hidden="true"
          />
        </>
      )}

      <div className={`${sectionContainer} relative z-10`}>
        {/* Optional Section Header */}
        {secTitle && (
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            {secBadge && (
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
                {secBadge}
              </span>
            )}
            <h2 className="font-primary text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {secTitle}
            </h2>
            {secSubtitle && (
              <p className="mt-4 text-base sm:text-lg text-slate-600">
                {secSubtitle}
              </p>
            )}
          </div>
        )}

        {/* Stories Cards Container */}
        <div
          className={
            isStacked
              ? 'space-y-12 sm:space-y-16 lg:space-y-24 relative pb-12'
              : 'relative'
          }
        >
          {resolvedStories.map((story, idx) => {
            const itemBadge =
              typeof story.badge === 'string'
                ? story.badge
                : story.badge?.[lang as 'en' | 'ar'] || story.badge?.en;
            const itemTitle =
              typeof story.title === 'string'
                ? story.title
                : story.title?.[lang as 'en' | 'ar'] || story.title?.en || '';
            const itemDesc =
              typeof story.description === 'string'
                ? story.description
                : story.description?.[lang as 'en' | 'ar'] || story.description?.en;
            const itemCta =
              typeof story.ctaText === 'string'
                ? story.ctaText
                : story.ctaText?.[lang as 'en' | 'ar'] || story.ctaText?.en;
            const rawHref = story.ctaHref || '/client-stories';
            const finalHref = rawHref.startsWith('/')
              ? `/${lang}${rawHref}`
              : `/${lang}/${rawHref}`;

            // Extract all static numbers / metrics dynamically
            const storyMetrics = extractStoryMetrics(story, content, lang);
            const metricCount = storyMetrics.length;

            const storyImage = story.image || content?.spotlightImage || '';

            return (
              <div
                key={story.id || idx}
                style={
                  isStacked
                    ? {
                        top: `calc(5.5rem + ${idx * 1.5}rem)`,
                        zIndex: 10 + idx,
                      }
                    : undefined
                }
                className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 lg:p-12 xl:p-14 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] ${
                  isStacked ? 'sticky transition-all duration-300' : ''
                }`}
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
                          {storyMetrics.map((m, mIdx) => {
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

                    {/* Action Link with Arrow matching screenshot */}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Backward-compatible aliases
export const SolutionsStorySpotlight = StackedFeaturedClientStories;
export const FeaturedClientStory = StackedFeaturedClientStories;
export type SolutionsStorySpotlightProps = StackedFeaturedClientStoriesProps;


