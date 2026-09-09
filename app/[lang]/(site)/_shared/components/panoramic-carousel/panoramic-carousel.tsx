'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';
import { PanoramicCard } from '../panoramic-card';

export interface PanoramicCarouselItem {
  id?: string;
  image: string;
  title: string | { en: string; ar: string };
  description: string | { en: string; ar: string };
  badge?: string | { en: string; ar: string };
  href?: string;
}

export interface PanoramicCarouselProps {
  id?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  items: PanoramicCarouselItem[];
  lang: string;
  className?: string;
  loop?: boolean;
}

/**
 * Panoramic Card Carousel Component
 * Directly modeled on the signature Publicis Sapient "Realities" carousel section (media_1788984559145.png).
 * - Wider cards extending to the end of the section without a right container restriction
 * - First card starts aligned with the header container margin
 * - Sleek circular navigation controls and touch drag support
 */
export function PanoramicCarousel({
  id,
  title,
  subtitle,
  badge,
  items,
  lang,
  className = '',
  loop = false,
}: PanoramicCarouselProps) {
  const isRtl = lang === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerPadding, setContainerPadding] = useState(24);
  const [cardWidth, setCardWidth] = useState(720);
  const [viewportWidth, setViewportWidth] = useState(1440);

  const headerContainerRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  // Measure container alignment & card dimensions dynamically
  useEffect(() => {
    const updateDimensions = () => {
      setViewportWidth(window.innerWidth);

      if (firstCardRef.current) {
        setCardWidth(firstCardRef.current.offsetWidth);
      }

      if (headerContainerRef.current) {
        const rect = headerContainerRef.current.getBoundingClientRect();
        // In LTR, left of container is rect.left
        // In RTL, right of container is window.innerWidth - rect.right
        const offset = isRtl
          ? Math.max(16, window.innerWidth - rect.right)
          : Math.max(16, rect.left);
        setContainerPadding(offset);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions, { passive: true });
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isRtl]);

  const gap = viewportWidth >= 640 ? 32 : 24;
  const stepSize = cardWidth + gap;

  // Calculate maximum sliding steps before reaching end of content
  const totalContentWidth = items.length * stepSize - gap;
  const availableViewport = viewportWidth - containerPadding;
  const maxScroll = Math.max(0, totalContentWidth - availableViewport);
  const maxIndex = Math.max(0, Math.ceil(maxScroll / stepSize));
  const clampedIndex = Math.min(currentIndex, maxIndex);

  const canPrev = loop || clampedIndex > 0;
  const canNext = loop || clampedIndex < maxIndex;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const current = Math.min(prev, maxIndex);
      if (current > 0) return current - 1;
      if (loop) return maxIndex;
      return 0;
    });
  }, [loop, maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const current = Math.min(prev, maxIndex);
      if (current < maxIndex) return current + 1;
      if (loop) return 0;
      return current;
    });
  }, [loop, maxIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      if (isRtl) handleNext();
      else handlePrev();
    } else if (e.key === 'ArrowRight') {
      if (isRtl) handlePrev();
      else handleNext();
    }
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    const threshold = 40;
    if (touchDeltaX.current > threshold) {
      if (isRtl) handleNext();
      else handlePrev();
    } else if (touchDeltaX.current < -threshold) {
      if (isRtl) handlePrev();
      else handleNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // Pixel-exact horizontal translation
  const translatePx = clampedIndex * stepSize;
  const transformStyle = isRtl
    ? `translateX(${translatePx}px)`
    : `translateX(-${translatePx}px)`;

  return (
    <section
      id={id}
      className={`${sectionPaddingY} bg-white relative border-b border-black/[0.04] scroll-mt-24 overflow-hidden ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={title}
    >
      {/* 1. Aligned Header Container */}
      <div ref={headerContainerRef} className={`${sectionContainer} mb-8 sm:mb-12`}>
        <FadeUp delay={0} duration={600} distance={20}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              {badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-persici-crimson/10 text-persici-crimson text-xs font-semibold uppercase tracking-wider mb-3">
                  {badge}
                </div>
              )}
              <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-slate-900 leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Circular Arrow Navigation Controls matching user screenshot */}
            {items.length > 1 && (
              <div className="flex items-center gap-3 shrink-0 self-start lg:self-end">
                <button
                  type="button"
                  onClick={isRtl ? handleNext : handlePrev}
                  disabled={isRtl ? !canNext : !canPrev}
                  aria-label={isRtl ? 'التالي' : 'Previous slide'}
                  className="w-11 h-11 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:border-persici-crimson hover:text-persici-crimson hover:bg-persici-crimson/5 transition-all disabled:opacity-25 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-persici-crimson/30"
                >
                  <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={isRtl ? handlePrev : handleNext}
                  disabled={isRtl ? !canPrev : !canNext}
                  aria-label={isRtl ? 'السابق' : 'Next slide'}
                  className="w-11 h-11 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:border-persici-crimson hover:text-persici-crimson hover:bg-persici-crimson/5 transition-all disabled:opacity-25 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-persici-crimson/30"
                >
                  <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </FadeUp>
      </div>

      {/* 2. Full-Bleed Carousel Track: Starts aligned with container, extends to the edge of the section */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          paddingLeft: isRtl ? 0 : `${containerPadding}px`,
          paddingRight: isRtl ? `${containerPadding}px` : 0,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex gap-6 sm:gap-8 transition-transform duration-500 ease-out"
          style={{
            transform: transformStyle,
          }}
        >
          {items.map((item, idx) => {
            const cardTitle = typeof item.title === 'string'
              ? item.title
              : item.title[lang as 'en' | 'ar'] || item.title.en;

            const cardDesc = typeof item.description === 'string'
              ? item.description
              : item.description[lang as 'en' | 'ar'] || item.description.en;

            const cardBadge = item.badge
              ? typeof item.badge === 'string'
                ? item.badge
                : item.badge[lang as 'en' | 'ar'] || item.badge.en
              : undefined;

            return (
              <div
                key={item.id || idx}
                ref={idx === 0 ? firstCardRef : undefined}
                className="w-[85vw] sm:w-[75vw] md:w-[620px] lg:w-[700px] xl:w-[760px] 2xl:w-[820px] shrink-0"
              >
                <PanoramicCard
                  image={item.image}
                  title={cardTitle}
                  description={cardDesc}
                  badge={cardBadge}
                  href={item.href ? `/${lang}${item.href}` : undefined}
                  lang={lang}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots on Mobile for Clear Affordance */}
      {items.length > 1 && (
        <div className="flex sm:hidden justify-center items-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Slide ${dotIdx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                clampedIndex === dotIdx
                  ? 'w-6 bg-persici-crimson'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Semantic alias for Industry pages
 */
export const IndustryRealitiesCarousel = PanoramicCarousel;
