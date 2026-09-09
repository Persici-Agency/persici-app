'use client';

import React, { useRef, useEffect } from 'react';
import type { SolutionsPageContent, FeaturedClientStoryItem, StoryMetricItem } from '@shared/types';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FeaturedClientStoryCard } from '../featured-client-story-card';

export type { StoryMetricItem, FeaturedClientStoryItem };

export interface FeaturedClientStoriesProps {
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

  const addMetric = (
    val: unknown,
    label: unknown,
    id?: string
  ) => {
    if (val === undefined || val === null) return;
    const strVal = String(val).trim();
    if (!strVal) return;

    const labelKey =
      typeof label === 'string'
        ? label
        : typeof label === 'object' && label !== null
        ? (label as { en?: string; ar?: string })[lang as 'en' | 'ar'] ||
          (label as { en?: string; ar?: string }).en ||
          JSON.stringify(label)
        : '';

    const dedupKey = `${strVal}:::${labelKey}`;
    if (seenValues.has(dedupKey)) return;
    seenValues.add(dedupKey);

    results.push({
      id: id || `metric-${results.length + 1}-${strVal}`,
      value: strVal,
      label:
        typeof label === 'string'
          ? label
          : typeof label === 'object' && label !== null
          ? {
              en: (label as { en?: string; ar?: string }).en || (label as { en?: string; ar?: string }).ar || '',
              ar: (label as { en?: string; ar?: string }).ar || (label as { en?: string; ar?: string }).en || '',
            }
          : undefined,
    });
  };

  const storyObj = story as Record<string, unknown> | undefined;
  const contentObj = content as Record<string, unknown> | undefined;

  // 1. Inspect story metrics array
  if (storyObj) {
    const arrCandidates = [storyObj.metrics, storyObj.stats, storyObj.kpis, storyObj.highlights];
    for (const cand of arrCandidates) {
      if (Array.isArray(cand) && cand.length > 0) {
        for (const item of cand as unknown[]) {
          if (typeof item === 'object' && item !== null) {
            const itemObj = item as Record<string, unknown>;
            addMetric(
              itemObj.value ?? itemObj.val ?? itemObj.number ?? itemObj.stat,
              itemObj.label ?? itemObj.text ?? itemObj.title ?? itemObj.name,
              typeof itemObj.id === 'string' ? itemObj.id : undefined
            );
          }
        }
        if (results.length > 0) return results;
      }
    }

    // Inspect indexed story metric fields
    for (let i = 1; i <= 10; i++) {
      const val =
        storyObj[`metric${i}Val`] ??
        storyObj[`metric${i}Value`] ??
        storyObj[`stat${i}Val`] ??
        storyObj[`metric${i}`] ??
        storyObj[`kpi${i}Val`];

      const lbl =
        storyObj[`metric${i}Label`] ??
        storyObj[`metric${i}Text`] ??
        storyObj[`stat${i}Label`] ??
        storyObj[`metric${i}Title`] ??
        storyObj[`kpi${i}Label`];

      if (val !== undefined && val !== null && String(val).trim() !== '') {
        addMetric(val, lbl, `story-idx-${i}`);
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

export function FeaturedClientStories({
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
}: FeaturedClientStoriesProps) {
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const cardWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardInnerRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Construct resolved stories array
  const resolvedStories: FeaturedClientStoryItem[] =
    stories && stories.length > 0
      ? stories
      : [
          {
            badge: badge || content?.spotlightBadge,
            title: title || content?.spotlightTitle || {
              en: 'Delivering Measurable Impact',
              ar: 'تحقيق أثر ملموس وقابل للقياس',
            },
            description: description || content?.spotlightDescription || {
              en: 'Engineering transformative solutions that scale customer experiences and compound business returns.',
              ar: 'هندسة حلول تحويلية ترتقي بتجارب العملاء وتضاعف العوائد الاستثمارية للشركات.',
            },
            metrics:
              metrics ||
              extractStoryMetrics(
                {
                  metric1Val,
                  metric1Label,
                  metric2Val,
                  metric2Label,
                  metric3Val,
                  metric3Label,
                } as FeaturedClientStoryItem,
                content,
                lang
              ),
            image: image || content?.spotlightImage,
            ctaText: ctaText || content?.spotlightCtaText || {
              en: 'Explore Client Stories',
              ar: 'استكشف قصص النجاح',
            },
            ctaHref: ctaHref || content?.spotlightCtaHref || '/client-stories',
          },
        ];

  const isStacked = resolvedStories.length > 1;

  // Stacking dynamic scale & brightness transform calculation
  useEffect(() => {
    if (!isStacked) return;

    let rafId: number | null = null;

    const updateTransforms = () => {
      const wrappers = cardWrapperRefs.current;
      const inners = cardInnerRefs.current;
      const totalCards = wrappers.length;
      if (totalCards <= 1) return;

      const rem =
        typeof window !== 'undefined'
          ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
          : 16;
      const baseTopPx = 5.5 * rem;
      const offsetPx = 1.5 * rem;

      for (let i = 0; i < totalCards; i++) {
        const inner = inners[i];
        if (!inner) continue;

        // Front-most card always stays at scale 1.0 and full brightness
        if (i === totalCards - 1) {
          inner.style.transform = 'scale(1)';
          inner.style.filter = 'none';
          continue;
        }

        let totalScaleDrop = 0;
        let totalDimming = 0;

        for (let k = i + 1; k < totalCards; k++) {
          const nextWrapper = wrappers[k];
          if (!nextWrapper) continue;

          const nextRect = nextWrapper.getBoundingClientRect();
          const nextTargetTop = baseTopPx + k * offsetPx;

          const buffer = Math.max(nextRect.height * 0.85, 320);
          const distanceToSticky = nextRect.top - nextTargetTop;

          // Progress from 0 (next card far below) to 1 (next card reached sticky top)
          const progress = Math.min(
            Math.max((buffer - distanceToSticky) / buffer, 0),
            1
          );

          // Immediate next card creates primary scale drop (0.055), subsequent cards add incremental depth (0.035)
          const maxScaleDrop = k === i + 1 ? 0.055 : 0.035;
          totalScaleDrop += progress * maxScaleDrop;
          totalDimming += progress * 0.08;
        }

        const scale = Math.max(1 - totalScaleDrop, 0.88);
        const brightness = Math.max(1 - totalDimming, 0.85);

        inner.style.transform = `scale(${scale.toFixed(4)})`;
        inner.style.filter =
          brightness < 0.99 ? `brightness(${brightness.toFixed(3)})` : 'none';
      }
    };

    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateTransforms();
        rafId = null;
      });
    };

    // Run initial update once mounted
    updateTransforms();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isStacked, resolvedStories.length]);

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
              ? 'space-y-16 sm:space-y-24 lg:space-y-32 relative pb-20 sm:pb-28 lg:pb-36'
              : 'relative'
          }
        >
          {resolvedStories.map((story, idx) => (
            <FeaturedClientStoryCard
              key={story.id || idx}
              story={story}
              content={content}
              lang={lang}
              isStacked={isStacked}
              stackIndex={idx}
              wrapperRef={(el) => {
                cardWrapperRefs.current[idx] = el;
              }}
              innerRef={(el) => {
                cardInnerRefs.current[idx] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Reusable aliases
export const StackedFeaturedClientStories = FeaturedClientStories;
export type StackedFeaturedClientStoriesProps = FeaturedClientStoriesProps;
export const FeaturedClientStory = FeaturedClientStories;
export const StorySpotlight = FeaturedClientStories;
export const SolutionsStorySpotlight = FeaturedClientStories;
export type SolutionsStorySpotlightProps = FeaturedClientStoriesProps;
