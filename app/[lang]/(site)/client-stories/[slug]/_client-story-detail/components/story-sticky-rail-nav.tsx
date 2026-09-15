'use client';

import React, { useState, useEffect } from 'react';

export interface RailNavItem {
  id: string;
  label: {
    en: string;
    ar: string;
  };
}

export const STORY_NAV_ITEMS: RailNavItem[] = [
  {
    id: 'intro',
    label: {
      en: 'Overview',
      ar: 'نظرة عامة',
    },
  },
  {
    id: 'the-problem',
    label: {
      en: 'The Challenge',
      ar: 'التحدي والمشكلة',
    },
  },
  {
    id: 'the-solution',
    label: {
      en: 'The Solution',
      ar: 'الحل والنهج المتبع',
    },
  },
  {
    id: 'the-impact',
    label: {
      en: 'The Impact',
      ar: 'الأثر والنتائج',
    },
  },
  {
    id: 'media-showcase',
    label: {
      en: 'Showcase',
      ar: 'معرض الأعمال',
    },
  },
];

export interface StoryStickyRailNavProps {
  lang: string;
  className?: string;
}

export function StoryStickyRailNav({ lang, className = '' }: StoryStickyRailNavProps) {
  const isRtl = lang === 'ar';
  const [activeSection, setActiveSection] = useState<string>('intro');

  useEffect(() => {
    const sectionIds = STORY_NAV_ITEMS.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Mobile Top Sticky Bar */}
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="lg:hidden sticky top-16 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center gap-2 min-w-max">
          {STORY_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const label = isRtl ? item.label.ar : item.label.en;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-persici-crimson text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sticky Rail */}
      <aside
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`hidden lg:block sticky top-28 self-start w-64 shrink-0 py-6 pe-6 ${className}`}
      >
        <div className="border-s-2 border-slate-200 flex flex-col space-y-1 py-1">
          {STORY_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const label = isRtl ? item.label.ar : item.label.en;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`text-start px-4 py-2 text-sm transition-all duration-200 cursor-pointer -ms-0.5 border-s-2 ${
                  isActive
                    ? 'border-persici-crimson font-semibold text-persici-crimson bg-persici-crimson/5 rounded-e-lg'
                    : 'border-transparent font-medium text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
