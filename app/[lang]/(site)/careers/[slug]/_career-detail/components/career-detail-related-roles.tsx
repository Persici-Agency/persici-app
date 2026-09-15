'use client';

import React from 'react';
import Link from 'next/link';
import { TbMapPin } from 'react-icons/tb';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { HomeButton } from '@shared';
import type { CareerJobOpening } from '../../../_careers/data/careers.data';

export interface CareerDetailRelatedRolesProps {
  relatedJobs: CareerJobOpening[];
  lang: string;
}

export function CareerDetailRelatedRoles({ relatedJobs, lang }: CareerDetailRelatedRolesProps) {
  const isAr = lang === 'ar';

  if (!relatedJobs || relatedJobs.length === 0) return null;

  return (
    <section className={`bg-white border-t border-black/5 ${sectionPaddingY} relative overflow-hidden`}>
      <div className={sectionContainer}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-wider text-persici-crimson bg-persici-crimson/10 px-3.5 py-1 rounded-full mb-3">
              {isAr ? 'فرص أخرى ذات صلة' : 'Explore More Opportunities'}
            </span>
            <h2 className="font-primary text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">
              {isAr ? 'وظائف شاغرة إضافية في المجموعة' : 'Similar Roles in the Collective'}
            </h2>
          </div>

          <HomeButton
            href={`/${lang}/careers#open-positions`}
            title={isAr ? 'عرض كافة الوظائف المتاحة' : 'View All Open Positions'}
            isLangEffectIcon
            currentLang={lang}
            className="bg-persici-black hover:bg-persici-crimson text-white text-xs sm:text-sm px-5 py-2.5 font-semibold transition-colors duration-300"
            iconClassName="h-7 w-7 text-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedJobs.map((job) => (
            <div
              key={job.slug}
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#FFFAFA] border border-black/8 hover:border-persici-crimson/40 hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="font-mono text-[10px] font-semibold text-persici-crimson bg-persici-crimson/10 px-2.5 py-0.5 rounded-full">
                    {job.department[isAr ? 'ar' : 'en']}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-foreground/60 bg-black/5 px-2 py-0.5 rounded-full">
                    <TbMapPin className="w-3 h-3 text-persici-blush" />
                    <span>{job.location[isAr ? 'ar' : 'en']}</span>
                  </span>
                  <span className="text-[11px] text-foreground/60 bg-black/5 px-2 py-0.5 rounded-full">
                    {job.type[isAr ? 'ar' : 'en']}
                  </span>
                </div>

                <h3 className="font-primary text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-persici-crimson transition-colors">
                  <Link href={`/${lang}/careers/${job.slug}`} className="hover:underline">
                    {job.title[isAr ? 'ar' : 'en']}
                  </Link>
                </h3>

                <p className="font-secondary text-xs sm:text-sm text-foreground/70 line-clamp-2 mb-4 leading-relaxed">
                  {job.summary[isAr ? 'ar' : 'en']}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/5 text-xs">
                <span className="font-mono font-semibold text-emerald-700">
                  {job.salaryRange[isAr ? 'ar' : 'en']}
                </span>
                <HomeButton
                  href={`/${lang}/careers/${job.slug}`}
                  title={isAr ? 'عرض الوظيفة' : 'View Role'}
                  isLangEffectIcon
                  currentLang={lang}
                  className="bg-black/5 hover:bg-persici-crimson hover:text-white text-foreground text-xs px-4 py-1.5 font-semibold transition-colors duration-300"
                  iconClassName="h-6 w-6 text-xs bg-white text-black"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
