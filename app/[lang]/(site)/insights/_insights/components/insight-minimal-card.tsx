'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { InsightDetail } from '../types';

export interface InsightMinimalCardProps {
  insight: InsightDetail;
  lang: string;
  className?: string;
  index?: number;
  columns?: number;
}

const monthsEnToAr: Record<string, string> = {
  January: 'يناير',
  February: 'فبراير',
  March: 'مارس',
  April: 'أبريل',
  May: 'مايو',
  June: 'يونيو',
  July: 'يوليو',
  August: 'أغسطس',
  September: 'سبتمبر',
  October: 'أكتوبر',
  November: 'نوفمبر',
  December: 'ديسمبر',
};

function formatDisplayDate(dateStr: string | undefined, isRtl: boolean): string {
  if (!dateStr) return '';
  if (!isRtl) return dateStr;

  let localized = dateStr;
  for (const [en, ar] of Object.entries(monthsEnToAr)) {
    if (localized.includes(en)) {
      localized = localized.replace(en, ar);
      break;
    }
  }
  return localized;
}

export function InsightMinimalCard({
  insight,
  lang,
  className = '',
  index = 0,
  columns = 3,
}: InsightMinimalCardProps) {
  const isRtl = lang === 'ar';
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Staggered diagonal wave cascade delay
  const colIndex = index % columns;
  const rowIndex = Math.floor((index % 6) / columns);
  const waveDelay = colIndex * 90 + rowIndex * 120;

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const title = insight.title[lang as 'en' | 'ar'] || insight.title.en;
  const categoryLabel = insight.category[lang as 'en' | 'ar'] || insight.category.en;

  // Gradient IDs unique to avoid collisions
  const safeId = (insight.id || insight.slug || 'card').replace(/[^a-zA-Z0-9-_]/g, '-');
  const normId = `norm-grad-insight-${safeId}-${index}`;
  const hovId = `hov-grad-insight-${safeId}-${index}`;

  return (
    <div
      ref={cardRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.97)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '700ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${waveDelay}ms`,
      }}
      className="w-full h-full will-change-transform"
    >
      <Link
        href={`/${lang}/insights/${insight.slug}`}
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`group relative flex flex-col justify-between h-full min-h-[260px] sm:min-h-[280px] p-6 sm:p-7 md:p-8 rounded-2xl overflow-hidden shadow-[0_10px_30px_-5px_rgba(0,0,0,0.07),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_-10px_rgba(180,30,25,0.22),0_8px_20px_-4px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 ease-out select-none cursor-pointer ${className}`}
      >
        {/* ========================================================================= */}
        {/* LAYER 1: NORMAL STATE FACETED BACKGROUND (Cross-fades on hover)            */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-300">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`${normId}-top`} x1="0%" y1="0%" x2="100%" y2="40%">
                <stop offset="0%" stopColor="#ECEFF3" />
                <stop offset="100%" stopColor="#F5F7FA" />
              </linearGradient>
              <linearGradient id={`${normId}-btm`} x1="0%" y1="60%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FAFBFD" />
              </linearGradient>
            </defs>
            {/* Top-Left Piece (Grayer facet) */}
            <polygon points="0,0 100,0 100,36 0,70" fill={`url(#${normId}-top)`} />
            {/* Bottom-Right Piece (Crisp White facet) */}
            <polygon points="0,70 100,36 100,100 0,100" fill={`url(#${normId}-btm)`} />
          </svg>
        </div>

        {/* ========================================================================= */}
        {/* LAYER 2: HOVER STATE BRAND CRIMSON FACETED BACKGROUND                     */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`${hovId}-top`} x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#7B1814" />
                <stop offset="100%" stopColor="#8F2323" />
              </linearGradient>
              <linearGradient id={`${hovId}-btm`} x1="0%" y1="40%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EE3A38" />
                <stop offset="40%" stopColor="#C82B28" />
                <stop offset="100%" stopColor="#B32420" />
              </linearGradient>
            </defs>
            {/* Top-Left Piece (Darker Crimson facet) */}
            <polygon points="0,0 100,0 100,36 0,70" fill={`url(#${hovId}-top)`} />
            {/* Bottom-Right Piece (Vibrant Brand Crimson facet) */}
            <polygon points="0,70 100,36 100,100 0,100" fill={`url(#${hovId}-btm)`} />
          </svg>
        </div>

        {/* ========================================================================= */}
        {/* CARD CONTENT                                                              */}
        {/* ========================================================================= */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top Section: Title */}
          <div className="pt-1">
            <h3 className="font-primary text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-white transition-colors duration-300 leading-snug line-clamp-3">
              {title}
            </h3>
          </div>

          {/* Bottom Section: Divider line + Metadata Row */}
          <div className="mt-8 sm:mt-10">
            {/* Thin Horizontal Divider */}
            <div className="w-full border-t border-slate-300/80 group-hover:border-white/25 transition-colors duration-300 mb-4 sm:mb-4.5" />

            {/* Bottom Row: Icon + Category on start, Full Date on end with space between */}
            <div className="flex items-center justify-between font-mono text-xs sm:text-[13px] tracking-wide text-slate-700 group-hover:text-white transition-colors duration-300">
              {/* Start: Icon + Category ("Article" or "Research") */}
              <div className="flex items-center gap-2 font-medium">
                {insight.categorySlug === 'research' ? (
                  <svg
                    className="w-4 h-4 shrink-0 transition-colors duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 shrink-0 transition-colors duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                )}
                <span>{categoryLabel}</span>
              </div>

              {/* End: Full Date */}
              <span className="font-medium tabular-nums opacity-90 group-hover:opacity-100">
                {formatDisplayDate(insight.date, isRtl)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
