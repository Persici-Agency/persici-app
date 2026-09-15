'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { InsightDetail, InsightCategorySlug } from '../types';
import { InsightMinimalCard } from './insight-minimal-card';
import { InsightsFilterBar } from './insights-filter-bar';
import { TbLoader2, TbFolderOff } from 'react-icons/tb';

export interface InsightsInfiniteGridProps {
  initialInsights: InsightDetail[];
  lang: string;
  initialCategory?: InsightCategorySlug;
}

const PAGE_SIZE = 9;

export function InsightsInfiniteGrid({
  initialInsights,
  lang,
  initialCategory = 'all',
}: InsightsInfiniteGridProps) {
  const isRtl = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<InsightCategorySlug>(initialCategory);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Filter insights based on selected category
  const filteredInsights = useMemo(() => {
    if (selectedCategory === 'all') return initialInsights;
    return initialInsights.filter((item) => item.categorySlug === selectedCategory);
  }, [initialInsights, selectedCategory]);

  // Calculate counts per category
  const counts = useMemo(() => {
    const map: Partial<Record<InsightCategorySlug, number>> = {
      all: initialInsights.length,
      article: 0,
      research: 0,
    };
    initialInsights.forEach((item) => {
      if (item.categorySlug && map[item.categorySlug] !== undefined) {
        map[item.categorySlug] = (map[item.categorySlug] || 0) + 1;
      }
    });
    return map;
  }, [initialInsights]);

  // Reset visible count on category change
  const handleCategoryChange = (slug: InsightCategorySlug) => {
    setSelectedCategory(slug);
    setVisibleCount(PAGE_SIZE);
  };

  // Currently rendered slice
  const renderedInsights = useMemo(() => {
    return filteredInsights.slice(0, visibleCount);
  }, [filteredInsights, visibleCount]);

  const hasMore = visibleCount < filteredInsights.length;

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredInsights.length));
        }
      },
      { rootMargin: '200px' }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, filteredInsights.length]);

  return (
    <div className="w-full">
      {/* Category Filter Pills */}
      <div className="mb-10 sm:mb-14 flex justify-center">
        <InsightsFilterBar
          activeCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
          counts={counts}
          lang={lang}
        />
      </div>

      {/* Insight Grid */}
      {renderedInsights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {renderedInsights.map((insight, idx) => (
            <InsightMinimalCard
              key={`${selectedCategory}-${insight.id || insight.slug}`}
              insight={insight}
              lang={lang}
              index={idx}
              columns={3}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50">
          <TbFolderOff className="h-12 w-12 text-slate-400 mb-3" />
          <h4 className="text-lg font-medium text-slate-800">
            {isRtl ? 'لا توجد محتويات في هذا التصنيف' : 'No insights in this category'}
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            {isRtl
              ? 'يرجى اختيار تصنيف آخر للاطلاع على مقالاتنا وأبحاثنا'
              : 'Please select another category to view our articles and research'}
          </p>
        </div>
      )}

      {/* Sentinel / Load more indicator */}
      {hasMore && (
        <div ref={sentinelRef} className="mt-12 flex justify-center py-4">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredInsights.length))}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer"
          >
            <TbLoader2 className="h-4 w-4 animate-spin text-persici-crimson" />
            <span>
              {isRtl
                ? `عرض المزيد (${visibleCount} من ${filteredInsights.length})`
                : `Load more insights (${visibleCount} of ${filteredInsights.length})`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
