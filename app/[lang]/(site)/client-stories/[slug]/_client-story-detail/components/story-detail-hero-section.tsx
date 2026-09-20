import React from 'react';
import Link from 'next/link';
import type { ClientStoryDetail } from '../../../_client-stories/types';
import { sectionContainer } from '@shared/constants';
import { TbChevronRight, TbChevronLeft, TbBriefcase } from 'react-icons/tb';

export interface StoryDetailHeroSectionProps {
  story: ClientStoryDetail;
  lang: string;
}

export function StoryDetailHeroSection({ story, lang }: StoryDetailHeroSectionProps) {
  const isRtl = lang === 'ar';
  const ChevronIcon = isRtl ? TbChevronLeft : TbChevronRight;

  const title = story.title[lang as 'en' | 'ar'] || story.title.en;
  const category = story.category[lang as 'en' | 'ar'] || story.category.en;
  const lead = story.leadSubtitle[lang as 'en' | 'ar'] || story.leadSubtitle.en;

  return (
    <section
      data-header-luminance="light"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full overflow-hidden bg-linear-to-b from-white via-slate-50/50 to-white pt-32 pb-12 sm:pt-40 sm:pb-16 lg:pt-44 lg:pb-20 border-b border-black/[0.05]"
    >
      {/* Background architectural grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className={`relative z-10 ${sectionContainer}`}>
        <div className="max-w-6xl w-full">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono rtl:font-primary text-slate-500 mb-6 sm:mb-8"
          >
            <Link
              href={`/${lang}`}
              className="hover:text-slate-900 transition-colors shrink-0"
            >
              {isRtl ? 'الرئيسية' : 'Home'}
            </Link>
            <ChevronIcon className="h-3 w-3 text-slate-400 shrink-0" />
            <Link
              href={`/${lang}/client-stories`}
              className="hover:text-slate-900 transition-colors shrink-0"
            >
              {isRtl ? 'قصص العملاء' : 'Client Stories'}
            </Link>
            <ChevronIcon className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {story.client}
            </span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5 sm:mb-6">
            <span className="inline-flex items-center rounded-full bg-persici-crimson/10 border border-persici-crimson/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rtl:tracking-normal rtl:normal-case text-persici-crimson">
              {category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3.5 py-1 text-xs font-medium text-slate-700">
              <TbBriefcase className="h-3.5 w-3.5 text-slate-500" />
              <span>{story.client}</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-primary text-3xl font-medium tracking-tight rtl:tracking-normal text-slate-900 sm:text-5xl lg:text-6xl sm:leading-[1.12] rtl:leading-[1.25] rtl:sm:leading-[1.2]">
            {title}
          </h1>

          {/* Lead Subtitle */}
          {lead && (
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-4xl">
              {lead}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
