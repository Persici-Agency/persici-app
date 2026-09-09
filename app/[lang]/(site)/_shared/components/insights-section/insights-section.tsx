'use client';

import React, { useRef, useEffect } from 'react';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp, HomeButton } from '@shared';
import { type ContentCardItem } from '@shared/components/content-card';
import { ContentCarousel, type ContentCarouselOrderBy } from '@shared/components/content-carousel';

export interface InsightsSectionProps {
  /**
   * Main section heading (defaults to "Our latest thinking")
   */
  title?: string | { en: string; ar: string };
  /**
   * Section descriptive subtitle
   */
  subtitle?: string | { en: string; ar: string };
  /**
   * Action link text (defaults to "Learn more")
   */
  ctaText?: string | { en: string; ar: string };
  /**
   * Action link destination URL (defaults to "/insights")
   */
  ctaHref?: string;
  /**
   * List of items from any system: insights, blogs, client stories, or projects.
   */
  items?: (ContentCardItem | Record<string, unknown>)[];
  /**
   * Number of cards visible simultaneously on desktop (defaults to 2)
   */
  visibleItems?: number;
  /**
   * Ordering attribute: 'default' | 'random' | 'name' | 'title' | 'category' | 'date'
   */
  orderBy?: ContentCarouselOrderBy;
  /**
   * Filter category string
   */
  category?: string;
  /**
   * Transition speed in ms
   */
  speed?: number;
  /**
   * Autoplay slides automatically
   */
  autoplay?: boolean;
  /**
   * Autoplay cycle interval in ms
   */
  autoplayInterval?: number;
  /**
   * Pause autoplay on hover
   */
  pauseOnHover?: boolean;
  /**
   * Enable loop navigation
   */
  loop?: boolean;
  /**
   * Background options (matching StackedFeaturedClientStories)
   */
  backgroundType?: 'default' | 'image' | 'code';
  backgroundImage?: string;
  isCodeBackground?: boolean;
  backgroundCode?: string | React.ReactNode;
  /**
   * Language code
   */
  lang: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function InsightsSection({
  title,
  subtitle,
  ctaText,
  ctaHref,
  items,
  visibleItems = 2,
  orderBy = 'default',
  category,
  speed = 450,
  autoplay = false,
  autoplayInterval = 4500,
  pauseOnHover = true,
  loop = true,
  backgroundType,
  backgroundImage,
  isCodeBackground,
  backgroundCode,
  lang,
  className,
}: InsightsSectionProps) {
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

  // Section Typography Texts
  const headingText =
    (typeof title === 'string'
      ? title
      : title?.[lang as 'en' | 'ar'] || title?.en) ||
    (isRtl ? 'أحدث رؤانا وأفكارنا' : 'Our latest thinking');

  const descText =
    (typeof subtitle === 'string'
      ? subtitle
      : subtitle?.[lang as 'en' | 'ar'] || subtitle?.en) ||
    (isRtl
      ? 'رؤى حديثة حول كيفية بناء الفرق لأعمالها وتشغيلها والتوسع عبر الذكاء الاصطناعي.'
      : 'Fresh perspectives on how teams can build, run and scale with AI.');

  const actionLabel =
    (typeof ctaText === 'string'
      ? ctaText
      : ctaText?.[lang as 'en' | 'ar'] || ctaText?.en) ||
    (isRtl ? 'اعرف المزيد' : 'Learn more');

  const rawHref = ctaHref || '/insights';
  const finalHref = rawHref.startsWith(`/${lang}`)
    ? rawHref
    : rawHref.startsWith('/')
    ? `/${lang}${rawHref}`
    : `/${lang}/${rawHref}`;

  // Default curated insights matching the reference design if no custom items are passed
  const defaultItems: ContentCardItem[] = [
    {
      id: 'insight-1',
      category: { en: 'Article', ar: 'مقال' },
      title: {
        en: 'Can Gen AI Help Agile Teams Improve Delivery Clarity?',
        ar: 'هل يمكن للذكاء الاصطناعي التوليدي مساعدة فرق أجايل في تحسين وضوح التسليم؟',
      },
      date: { en: 'September 02, 2026', ar: '٢ سبتمبر ٢٠٢٦' },
      href: '/insights/scaling-meta-ads-2026',
    },
    {
      id: 'insight-2',
      category: { en: 'Article', ar: 'مقال' },
      title: {
        en: 'What Star Formation Taught Me About Solving Business Problems',
        ar: 'ماذا تعلمت من تكوين النجوم حول حل المشكلات التجارية المعقدة',
      },
      date: { en: 'August 21, 2026', ar: '٢١ أغسطس ٢٠٢٦' },
      href: '/insights/shopify-headless-cro',
    },
  ];

  const resolvedItems = items && items.length > 0 ? items : defaultItems;

  const bgBaseClass =
    resolvedBgType === 'default'
      ? 'bg-gradient-to-b from-[#F5F6F9] via-[#EAECEF] to-[#F2F4F7]'
      : resolvedBgType === 'image'
      ? 'bg-slate-900'
      : 'bg-transparent';

  return (
    <section
      className={`${className || sectionPaddingY} ${bgBaseClass} relative overflow-hidden border-y border-slate-200/60`}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, Subtitle & Action Button */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full">
            <FadeUp direction={isRtl ? 'left' : 'right'} distance={20} duration={700}>
              <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
                {headingText}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal mb-8 max-w-sm">
                {descText}
              </p>
              <div>
                <HomeButton
                  href={finalHref}
                  title={actionLabel}
                  className="bg-persici-black text-white hover:bg-black"
                  currentLang={lang}
                  isLangEffectIcon={true}
                />
              </div>
            </FadeUp>
          </div>

          {/* Right Column: Dynamic Content Carousel (2 visible cards, interactive sliding) */}
          <div className="lg:col-span-8">
            <FadeUp direction={isRtl ? 'right' : 'left'} distance={20} duration={700}>
              <ContentCarousel
                items={resolvedItems}
                visibleItems={visibleItems}
                orderBy={orderBy}
                category={category}
                speed={speed}
                autoplay={autoplay}
                autoplayInterval={autoplayInterval}
                pauseOnHover={pauseOnHover}
                loop={loop}
                lang={lang}
              />
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

// Reusable aliases
export const SolutionsInsightsSection = InsightsSection;
export type SolutionsInsightsSectionProps = InsightsSectionProps;
export const SolutionsLatestThinking = InsightsSection;
export const LatestThinkingSection = InsightsSection;
