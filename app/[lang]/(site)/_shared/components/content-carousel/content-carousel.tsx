'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ContentCard, type ContentCardItem } from '../content-card';
import { cn } from '@shared/utils';

export type ContentCarouselOrderBy = 'default' | 'random' | 'name' | 'title' | 'category' | 'date';

export interface ContentCarouselProps {
  /**
   * Universal items array (articles, insights, case studies, or generic records)
   */
  items: (ContentCardItem | Record<string, unknown>)[];
  /**
   * Number of cards visible simultaneously on desktop (defaults to 2)
   */
  visibleItems?: number;
  /**
   * Ordering attribute:
   * - 'default': preserves input order
   * - 'random': shuffles items
   * - 'title' | 'name': sorts alphabetically by title
   * - 'category': sorts alphabetically by category
   * - 'date': sorts chronologically
   */
  orderBy?: ContentCarouselOrderBy;
  /**
   * Filter to only include items matching this category name or slug
   */
  category?: string;
  /**
   * Autoplay slides automatically (defaults to false)
   */
  autoplay?: boolean;
  /**
   * Autoplay cycle interval in milliseconds (defaults to 4500ms)
   */
  autoplayInterval?: number;
  /**
   * Transition speed in milliseconds (defaults to 450ms)
   */
  speed?: number;
  /**
   * Pause autoplay when hovering over carousel (defaults to true)
   */
  pauseOnHover?: boolean;
  /**
   * Enable infinite wrapping navigation (defaults to true)
   */
  loop?: boolean;
  /**
   * Show next/prev navigation buttons (defaults to true)
   */
  showArrows?: boolean;
  /**
   * Show pagination indicators / dots (defaults to true)
   */
  showDots?: boolean;
  /**
   * Current language for localization and RTL awareness
   */
  lang: string;
  /**
   * Custom wrapper styling
   */
  className?: string;
}

/**
 * Universal Dynamic Content Carousel
 * Designed specifically for ContentCard items with responsive views (2 cards on desktop, 1 on mobile).
 * Supports ordering (random, name, category, date), category filtering, custom speed, and touch swipe.
 */
export function ContentCarousel({
  items,
  visibleItems = 2,
  orderBy = 'default',
  category,
  autoplay = false,
  autoplayInterval = 4500,
  speed = 450,
  pauseOnHover = true,
  loop = true,
  showArrows = true,
  showDots = true,
  lang = 'en',
  className = '',
}: ContentCarouselProps) {
  const isRtl = lang === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  // Detect mobile viewport (breakpoint < 640px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. Filter by category if specified
  const filteredItems = useMemo(() => {
    if (!category || !category.trim()) return items;
    const catQuery = category.trim().toLowerCase();

    return items.filter((item) => {
      const rawCat =
        (item as Record<string, unknown>).category ||
        (item as Record<string, unknown>).type ||
        (item as Record<string, unknown>).tag;

      if (!rawCat) return false;
      if (typeof rawCat === 'string') {
        return rawCat.toLowerCase().includes(catQuery);
      }
      if (typeof rawCat === 'object') {
        const catObj = rawCat as { en?: string; ar?: string };
        return (
          (catObj.en && catObj.en.toLowerCase().includes(catQuery)) ||
          (catObj.ar && catObj.ar.toLowerCase().includes(catQuery))
        );
      }
      return false;
    });
  }, [items, category]);

  // 2. Order items based on orderBy attribute
  const orderedItems = useMemo(() => {
    if (filteredItems.length <= 1) return filteredItems;
    const list = [...filteredItems];

    if (orderBy === 'random') {
      // Fisher-Yates deterministic shuffle
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
      return list;
    }

    if (orderBy === 'title' || orderBy === 'name') {
      return list.sort((a, b) => {
        const getTitle = (it: Record<string, unknown>) => {
          const t = it.title || it.headline || it.name;
          if (typeof t === 'string') return t;
          if (typeof t === 'object' && t) {
            return (t as Record<string, string>)[lang] || (t as Record<string, string>).en || '';
          }
          return '';
        };
        return getTitle(a as Record<string, unknown>).localeCompare(
          getTitle(b as Record<string, unknown>),
          lang
        );
      });
    }

    if (orderBy === 'category') {
      return list.sort((a, b) => {
        const getCat = (it: Record<string, unknown>) => {
          const c = it.category || it.type;
          if (typeof c === 'string') return c;
          if (typeof c === 'object' && c) {
            return (c as Record<string, string>)[lang] || (c as Record<string, string>).en || '';
          }
          return '';
        };
        return getCat(a as Record<string, unknown>).localeCompare(
          getCat(b as Record<string, unknown>),
          lang
        );
      });
    }

    if (orderBy === 'date') {
      return list.sort((a, b) => {
        const getDate = (it: Record<string, unknown>) => {
          const d = (it.date || it.publishedAt || it.createdAt) as string;
          return d ? new Date(d).getTime() : 0;
        };
        return getDate(b as Record<string, unknown>) - getDate(a as Record<string, unknown>);
      });
    }

    return list;
  }, [filteredItems, orderBy, lang]);

  const totalItems = orderedItems.length;
  const effectiveVisible = isMobile ? 1 : Math.min(visibleItems, totalItems);
  const maxIndex = Math.max(0, totalItems - effectiveVisible);
  const isCarouselActive = totalItems > effectiveVisible;

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev > 0) return prev - 1;
      return loop ? maxIndex : 0;
    });
  }, [loop, maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < maxIndex) return prev + 1;
      return loop ? 0 : prev;
    });
  }, [loop, maxIndex]);

  // Autoplay cycle
  useEffect(() => {
    if (!autoplay || !isCarouselActive || (pauseOnHover && isHovered)) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, isCarouselActive, pauseOnHover, isHovered, autoplayInterval, handleNext]);

  // Touch Swipe Handlers for Mobile
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
    const swipeThreshold = 50;

    if (isRtl) {
      if (touchDeltaX.current > swipeThreshold) {
        handleNext();
      } else if (touchDeltaX.current < -swipeThreshold) {
        handlePrev();
      }
    } else {
      if (touchDeltaX.current < -swipeThreshold) {
        handleNext();
      } else if (touchDeltaX.current > swipeThreshold) {
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // If there are no items to render
  if (totalItems === 0) return null;

  // If total items fits completely inside visible view, render as clean static grid
  if (!isCarouselActive) {
    return (
      <div
        className={cn(
          'grid gap-6 pt-6 pb-8 -mt-5 -mb-6 px-2 -mx-2',
          totalItems === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 sm:grid-cols-2',
          className
        )}
      >
        {orderedItems.map((item, idx) => (
          <div key={(item as Record<string, unknown>).id as string || idx} className="relative hover:z-20">
            <ContentCard
              item={item}
              lang={lang}
            />
          </div>
        ))}
      </div>
    );
  }

  // Active Carousel View
  // Calculate percentage shift based on effectiveVisible count
  const slideWidthPercent = 100 / effectiveVisible;
  const translateX = currentIndex * slideWidthPercent;

  return (
    <div
      className={cn('relative w-full select-none', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Outer Viewport: Generous vertical headroom & negative margin offsets prevent card hover elevation and shadows from being clipped by overflow-hidden */}
      <div
        className="overflow-hidden w-full pt-7 pb-9 -mt-6 -mb-7 px-2 -mx-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform ease-out"
          style={{
            transform: isRtl
              ? `translateX(${translateX}%)`
              : `translateX(-${translateX}%)`,
            transitionDuration: `${speed}ms`,
          }}
        >
          {orderedItems.map((item, idx) => (
            <div
              key={(item as Record<string, unknown>).id as string || idx}
              className="shrink-0 px-3 relative hover:z-20 transition-all duration-300"
              style={{ width: `${slideWidthPercent}%` }}
            >
              <div className="h-full">
                <ContentCard item={item} lang={lang} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Controls: Navigation Arrows & Pagination Dots */}
      <div className="mt-6 flex items-center justify-between gap-4 pt-2">
        {/* Pagination Dots */}
        {showDots && maxIndex > 0 ? (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => {
              const isActive = dotIdx === currentIndex;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300 cursor-pointer',
                    isActive
                      ? 'w-6 bg-persici-crimson'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  )}
                  aria-label={`Slide ${dotIdx + 1}`}
                />
              );
            })}
          </div>
        ) : (
          <div />
        )}

        {/* Next / Previous Navigation Buttons */}
        {showArrows && isCarouselActive && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!loop && currentIndex === 0}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all duration-200 hover:border-persici-crimson hover:text-persici-crimson hover:shadow-md active:scale-95 cursor-pointer disabled:opacity-40 disabled:pointer-events-none'
              )}
              aria-label={isRtl ? 'السابق' : 'Previous'}
              title={isRtl ? 'السابق' : 'Previous'}
            >
              <span className="text-sm font-bold" aria-hidden="true">
                {isRtl ? '→' : '←'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!loop && currentIndex === maxIndex}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all duration-200 hover:border-persici-crimson hover:text-persici-crimson hover:shadow-md active:scale-95 cursor-pointer disabled:opacity-40 disabled:pointer-events-none'
              )}
              aria-label={isRtl ? 'التالي' : 'Next'}
              title={isRtl ? 'التالي' : 'Next'}
            >
              <span className="text-sm font-bold" aria-hidden="true">
                {isRtl ? '←' : '→'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
