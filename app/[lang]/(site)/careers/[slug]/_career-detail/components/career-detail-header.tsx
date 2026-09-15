'use client';

import React from 'react';
import Link from 'next/link';
import {
  TbArrowLeft,
  TbArrowRight,
  TbMapPin,
  TbBriefcase,
  TbCalendar,
} from 'react-icons/tb';
import { sectionContainer } from '@shared/constants';
import { FadeUp, HomeButton } from '@shared';
import type { CareerJobOpening } from '../../../_careers/data/careers.data';

export interface CareerDetailHeaderProps {
  job: CareerJobOpening;
  lang: string;
}

export function CareerDetailHeader({ job, lang }: CareerDetailHeaderProps) {
  const isAr = lang === 'ar';

  return (
    <section className="relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20 bg-[#FFFAFA] border-b border-black/5">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 start-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-persici-crimson/10 via-persici-blush/5 to-transparent blur-3xl rounded-full" />

      <div className={sectionContainer}>
        {/* Breadcrumb Navigation */}
        <FadeUp delay={100} duration={600}>
          <div className="flex items-center gap-2 text-xs text-foreground/60 mb-6 sm:mb-8 font-secondary">
            <Link
              href={`/${lang}/careers`}
              className="inline-flex items-center gap-1 hover:text-persici-crimson transition-colors font-medium"
            >
              {isAr ? (
                <>
                  <span>الوظائف وثقافة العمل</span>
                  <TbArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <TbArrowLeft className="w-3.5 h-3.5" />
                  <span>Careers</span>
                </>
              )}
            </Link>
            <span>/</span>
            <span className="text-foreground/80 font-medium">
              {job.department[isAr ? 'ar' : 'en']}
            </span>
            <span>/</span>
            <span className="text-persici-crimson font-semibold truncate max-w-[200px] sm:max-w-none">
              {job.title[isAr ? 'ar' : 'en']}
            </span>
          </div>
        </FadeUp>

        {/* Badges Row */}
        <FadeUp delay={150} duration={600}>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-5">
            <span className="font-mono text-xs font-semibold text-persici-crimson bg-persici-crimson/10 px-3.5 py-1 rounded-full">
              {job.department[isAr ? 'ar' : 'en']}
            </span>
            <span className="inline-flex items-center gap-1.5 font-secondary text-xs text-foreground/70 bg-white border border-black/8 px-3 py-1 rounded-full shadow-2xs">
              <TbMapPin className="w-3.5 h-3.5 text-persici-blush" />
              <span>{job.location[isAr ? 'ar' : 'en']}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-secondary text-xs text-foreground/70 bg-white border border-black/8 px-3 py-1 rounded-full shadow-2xs">
              <TbBriefcase className="w-3.5 h-3.5 text-persici-blush" />
              <span>{job.workPolicy[isAr ? 'ar' : 'en']}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-secondary text-xs text-foreground/70 bg-white border border-black/8 px-3 py-1 rounded-full shadow-2xs">
              <span>{job.type[isAr ? 'ar' : 'en']}</span>
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              {job.salaryRange[isAr ? 'ar' : 'en']}
            </span>
          </div>
        </FadeUp>

        {/* Main Job Title */}
        <FadeUp delay={200} duration={700}>
          <div className="max-w-4xl">
            <h1 className="font-primary text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
              {job.title[isAr ? 'ar' : 'en']}
            </h1>

            <p className="font-secondary text-base sm:text-lg lg:text-xl text-foreground/75 leading-relaxed mb-8">
              {job.summary[isAr ? 'ar' : 'en']}
            </p>

            {/* Direct Quick Action Anchor */}
            <div className="flex flex-wrap items-center gap-4">
              <HomeButton
                href="#apply-now"
                title={isAr ? 'التقديم على هذه الوظيفة' : 'Apply for this Role'}
                iconDirection="down"
                isLangEffectIcon
                currentLang={lang}
                className="bg-persici-crimson hover:bg-persici-crimson-80 text-white shadow-lg shadow-persici-crimson/25 px-8 py-3.5 text-sm font-semibold"
              />
              <div className="inline-flex items-center gap-1.5 text-xs text-foreground/50 font-mono">
                <TbCalendar className="w-3.5 h-3.5 text-foreground/40" />
                <span>{isAr ? `نُشرت: ${job.postedDate}` : `Posted: ${job.postedDate}`}</span>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
