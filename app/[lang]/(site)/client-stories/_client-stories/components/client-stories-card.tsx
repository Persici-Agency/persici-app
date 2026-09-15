import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ClientStoryDetail } from '../types';
import { TbArrowRight, TbArrowLeft, TbTrendingUp } from 'react-icons/tb';

export interface ClientStoriesCardProps {
  story: ClientStoryDetail;
  lang: string;
  className?: string;
}

export function ClientStoriesCard({ story, lang, className = '' }: ClientStoriesCardProps) {
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? TbArrowLeft : TbArrowRight;

  const title = story.title[lang as 'en' | 'ar'] || story.title.en;
  const category = story.category[lang as 'en' | 'ar'] || story.category.en;
  const summary = story.executiveSummary[lang as 'en' | 'ar'] || story.executiveSummary.en;
  const primaryMetric = story.metrics?.[0];

  return (
    <Link
      href={`/${lang}/client-stories/${story.slug}`}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`group relative flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.12),0_6px_16px_-4px_rgba(216,52,39,0.08)] hover:border-slate-300 transition-all duration-300 ease-out will-change-transform ${className}`}
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-16/10 overflow-hidden bg-slate-100">
        <Image
          src={story.heroImage}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Client Tag on Image */}
        <div className="absolute top-4 start-4 z-10">
          <span className="inline-flex items-center rounded-full bg-slate-900/75 backdrop-blur-md px-3 py-1 text-[9.5px] font-semibold uppercase tracking-wider text-white">
            {story.client}
          </span>
        </div>

        {/* Primary Metric Badge */}
        {primaryMetric && (
          <div className="absolute bottom-3 end-3 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-persici-crimson/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white shadow-md">
              <TbTrendingUp className="h-3.5 w-3.5" />
              <span>{primaryMetric.value}</span>
            </span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="flex flex-col flex-1 p-6 sm:p-7">
        {/* Category */}
        <div className="mb-2.5">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-persici-crimson">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-primary text-xl sm:text-2xl font-medium text-slate-900 leading-snug group-hover:text-persici-crimson transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Executive summary */}
        <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
          {summary}
        </p>

        {/* Bottom CTA Strip */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-persici-crimson transition-colors">
          <span>{isRtl ? 'اقرأ قصة النجاح' : 'Explore Case Study'}</span>
          <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
