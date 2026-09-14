'use client';

import React from 'react';
import type { InsightCategorySlug } from '../types';

export interface FilterCategoryOption {
  slug: InsightCategorySlug;
  label: {
    en: string;
    ar: string;
  };
}

export const INSIGHT_FILTER_CATEGORIES: FilterCategoryOption[] = [
  {
    slug: 'all',
    label: {
      en: 'All',
      ar: 'الكل',
    },
  },
  {
    slug: 'article',
    label: {
      en: 'Article',
      ar: 'المقالات',
    },
  },
  {
    slug: 'research',
    label: {
      en: 'Research',
      ar: 'الأبحاث والدراسات',
    },
  },
];

export interface InsightsFilterBarProps {
  activeCategory: InsightCategorySlug;
  onSelectCategory: (slug: InsightCategorySlug) => void;
  counts?: Partial<Record<InsightCategorySlug, number>>;
  lang: string;
  className?: string;
}

export function InsightsFilterBar({
  activeCategory,
  onSelectCategory,
  counts = {},
  lang,
  className = '',
}: InsightsFilterBarProps) {
  const isRtl = lang === 'ar';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`w-full overflow-x-auto scrollbar-none py-2 flex justify-center ${className}`}
    >
      <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 pb-1">
        {INSIGHT_FILTER_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.slug;
          const label = isRtl ? cat.label.ar : cat.label.en;
          const count = counts[cat.slug];

          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`group relative inline-flex items-center gap-2 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? 'bg-persici-crimson text-white shadow-md shadow-persici-crimson/20'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              <span>{label}</span>
              {typeof count === 'number' && (
                <span
                  className={`inline-flex items-center justify-center rounded-full text-[11px] font-mono px-2 py-0.5 min-w-[20px] transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/90 text-slate-600 group-hover:bg-slate-300'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
