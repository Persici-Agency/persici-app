'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { InsightAuthor, InsightTocItem } from '../../../_insights/types';

export interface InsightStickyRailNavProps {
  author: InsightAuthor;
  tableOfContents: InsightTocItem[];
  lang: string;
  className?: string;
}

export function InsightStickyRailNav({
  author,
  tableOfContents,
  lang,
  className = '',
}: InsightStickyRailNavProps) {
  const isRtl = lang === 'ar';
  const [activeSection, setActiveSection] = useState<string>(
    tableOfContents[0]?.id || ''
  );

  const authorRole = author.role[lang as 'en' | 'ar'] || author.role.en;

  useEffect(() => {
    if (tableOfContents.length === 0) return;

    const sectionIds = tableOfContents.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-15% 0px -65% 0px',
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
  }, [tableOfContents]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
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
        className="lg:hidden sticky top-16 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center gap-2 min-w-max">
          {tableOfContents.map((item) => {
            const isActive = activeSection === item.id;
            const label = item.title[lang as 'en' | 'ar'] || item.title.en;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
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

      {/* Desktop Sticky Sidebar Rail */}
      <aside
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`hidden lg:block sticky top-28 self-start w-72 shrink-0 pe-6 ${className}`}
      >
        {/* 1. Author Profile Card */}
        <div className="mb-8 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3.5">
            {author.avatar ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {author.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <h4 className="font-primary text-sm font-bold text-slate-900 truncate">
                {author.name}
              </h4>
              <p className="text-xs text-slate-500 leading-snug mt-0.5 line-clamp-2">
                {authorRole}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Table of Contents */}
        <div className="p-1">
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-3">
            {isRtl ? 'جدول المحتويات' : 'Table of Contents'}
          </h3>

          <div className="border-s-2 border-slate-200 flex flex-col space-y-1 py-1">
            {tableOfContents.map((item) => {
              const isActive = activeSection === item.id;
              const label = item.title[lang as 'en' | 'ar'] || item.title.en;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={`text-start px-4 py-2 text-xs sm:text-[13px] leading-relaxed transition-all duration-200 cursor-pointer -ms-0.5 border-s-2 ${
                    isActive
                      ? 'border-persici-crimson font-bold text-persici-crimson bg-persici-crimson/5 rounded-e-lg'
                      : 'border-transparent font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
