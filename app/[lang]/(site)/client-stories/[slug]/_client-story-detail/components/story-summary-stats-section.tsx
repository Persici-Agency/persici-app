'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { ClientStoryDetail } from '../../../_client-stories/types';
import { sectionContainer } from '@shared/constants';
import { CountUp } from '@shared/components/count-up';

export interface StorySummaryStatsSectionProps {
  story: ClientStoryDetail;
  lang: string;
}

export function StorySummaryStatsSection({ story, lang }: StorySummaryStatsSectionProps) {
  const isRtl = lang === 'ar';
  const [isExpanded, setIsExpanded] = useState(false);

  const summary = story.executiveSummary[lang as 'en' | 'ar'] || story.executiveSummary.en;
  const metrics = story.metrics || [];

  // Threshold for truncation
  const CHAR_LIMIT = 180;
  const isLong = summary.length > CHAR_LIMIT;
  const displaySummary = isLong && !isExpanded ? `${summary.slice(0, CHAR_LIMIT).trim()}...` : summary;

  return (
    <section
      data-header-luminance="light"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full bg-white py-12 sm:py-16 lg:py-20 border-b border-slate-200/80"
    >
      <div className={sectionContainer}>
        {/* Two-Column Grid: Left Content (Summary + Metrics), Right Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Summary heading + normal text with read more + metrics row */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Summary Heading */}
              <h2 className="font-primary text-3xl sm:text-4xl font-normal tracking-tight text-slate-900 mb-4">
                {isRtl ? 'الملخص' : 'Summary'}
              </h2>

              {/* Normal Size Paragraph with Read More */}
              <div className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                <span>{displaySummary}</span>
                {isLong && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center font-semibold text-persici-crimson hover:text-persici-crimson/80 hover:underline ms-1.5 transition-colors cursor-pointer text-sm sm:text-base select-none"
                  >
                    {isExpanded ? (isRtl ? 'عرض أقل' : 'Read less') : (isRtl ? 'اقرأ المزيد' : 'Read more')}
                  </button>
                )}
              </div>
            </div>

            {/* Metrics Row (placed at the bottom of the left column) */}
            {metrics.length > 0 && (
              <div className="mt-10 sm:mt-14 lg:mt-16 pt-6 border-t border-slate-100">
                <div
                  className={`grid gap-6 sm:gap-8 items-start ${
                    metrics.length === 2
                      ? 'grid-cols-2 max-w-md'
                      : metrics.length === 3
                      ? 'grid-cols-2 sm:grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-4'
                  }`}
                >
                  {metrics.map((metric, idx) => {
                    const label = metric.label[lang as 'en' | 'ar'] || metric.label.en;
                    return (
                      <div key={idx} className="flex flex-col">
                        <div className="font-primary text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-slate-900 tracking-tight leading-none">
                          <CountUp value={metric.value} />
                        </div>
                        <span className="mt-2 text-xs sm:text-sm font-normal text-slate-600 leading-snug max-w-[150px]">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Featured Image */}
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full aspect-16/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100">
              <Image
                src={story.heroImage}
                alt={story.title[lang as 'en' | 'ar'] || story.title.en}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
