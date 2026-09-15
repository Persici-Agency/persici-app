'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { ClientStoryDetail, StoryCategorySlug } from '../types';
import { ClientStoriesCard } from './client-stories-card';
import { ClientStoryMinimalCard } from './client-story-minimal-card';
import { ClientStoriesFilterBar } from './client-stories-filter-bar';
import { TbLoader2, TbFolderOff } from 'react-icons/tb';

export interface ClientStoriesInfiniteGridProps {
  initialStories: ClientStoryDetail[];
  lang: string;
  initialCategory?: StoryCategorySlug;
}

const PAGE_SIZE = 6;

export function ClientStoriesInfiniteGrid({
  initialStories,
  lang,
  initialCategory = 'all',
}: ClientStoriesInfiniteGridProps) {
  const isRtl = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<StoryCategorySlug>(initialCategory);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Filter stories based on selected category
  const filteredStories = useMemo(() => {
    if (selectedCategory === 'all') return initialStories;
    return initialStories.filter((s) => s.categorySlug === selectedCategory);
  }, [initialStories, selectedCategory]);

  // Calculate counts per category
  const counts = useMemo(() => {
    const map: Partial<Record<StoryCategorySlug, number>> = {
      all: initialStories.length,
      software: 0,
      branding: 0,
      marketing: 0,
      'video-production': 0,
    };
    initialStories.forEach((s) => {
      if (s.categorySlug && map[s.categorySlug] !== undefined) {
        map[s.categorySlug] = (map[s.categorySlug] || 0) + 1;
      }
    });
    return map;
  }, [initialStories]);

  // Reset visible count on category change
  const handleCategoryChange = (slug: StoryCategorySlug) => {
    setSelectedCategory(slug);
    setVisibleCount(PAGE_SIZE);
  };

  // Currently rendered slice
  const renderedStories = useMemo(() => {
    return filteredStories.slice(0, visibleCount);
  }, [filteredStories, visibleCount]);

  const hasMore = visibleCount < filteredStories.length;

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredStories.length));
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
  }, [hasMore, filteredStories.length]);

  return (
    <div className="w-full">
      {/* Category Filter Pills */}
      <div className="mb-10 sm:mb-14 flex justify-center">
        <ClientStoriesFilterBar
          activeCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
          counts={counts}
          lang={lang}
        />
      </div>

      {/* Story Grid */}
      {renderedStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {renderedStories.map((story, idx) => (
            <ClientStoryMinimalCard
              key={`${selectedCategory}-${story.id || story.slug}`}
              story={story}
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
            {isRtl ? 'لا توجد قصص نجاح في هذا التصنيف' : 'No client stories in this category'}
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            {isRtl
              ? 'يرجى اختيار تصنيف آخر للاطلاع على أعمالنا'
              : 'Please select another category to view our client stories'}
          </p>
        </div>
      )}

      {/* Sentinel / Load more indicator */}
      {hasMore && (
        <div ref={sentinelRef} className="mt-12 flex justify-center py-4">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredStories.length))}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer"
          >
            <TbLoader2 className="h-4 w-4 animate-spin text-persici-crimson" />
            <span>
              {isRtl
                ? `عرض المزيد (${visibleCount} من ${filteredStories.length})`
                : `Load more stories (${visibleCount} of ${filteredStories.length})`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
