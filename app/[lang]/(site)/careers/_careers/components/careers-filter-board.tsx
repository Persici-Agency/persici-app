'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TbSearch,
  TbMapPin,
  TbBriefcase,
  TbRotateClockwise,
} from 'react-icons/tb';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp, HomeButton } from '@shared';
import type { CareerJobOpening } from '../data/careers.data';

export interface CareersFilterBoardProps {
  openings: CareerJobOpening[];
  lang: string;
}

export function CareersFilterBoard({ openings, lang }: CareersFilterBoardProps) {
  const isAr = lang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const departments = useMemo(() => [
    { slug: 'all', label: { en: 'All Departments', ar: 'كافة الأقسام' } },
    { slug: 'engineering', label: { en: 'Engineering & AI', ar: 'الهندسة والذكاء الاصطناعي' } },
    { slug: 'growth', label: { en: 'Growth Marketing', ar: 'التسويق الأدائي والنمو' } },
    { slug: 'creative', label: { en: 'Creative & Brand', ar: 'الإبداع والهوية' } },
    { slug: 'strategy', label: { en: 'Client Strategy', ar: 'استراتيجيات العملاء' } },
    { slug: 'data', label: { en: 'AI & Data', ar: 'البيانات والذكاء الاصطناعي' } },
  ], []);

  const locations = useMemo(() => [
    { slug: 'all', label: { en: 'All Hubs', ar: 'كافة المقرات' } },
    { slug: 'dubai', label: { en: 'Dubai HQ', ar: 'مقر دبي' } },
    { slug: 'riyadh', label: { en: 'Riyadh Hub', ar: 'مقر الرياض' } },
    { slug: 'amman', label: { en: 'Amman Hub', ar: 'مقر عمّان' } },
    { slug: 'remote', label: { en: 'Global Remote', ar: 'عن بُعد' } },
  ], []);

  const filteredJobs = useMemo(() => {
    return openings.filter((job) => {
      // 1. Department filter
      if (selectedDept !== 'all' && job.departmentSlug !== selectedDept) {
        return false;
      }
      // 2. Location filter
      if (selectedLocation !== 'all' && job.locationSlug !== selectedLocation) {
        return false;
      }
      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = job.title.en.toLowerCase().includes(q) || job.title.ar.toLowerCase().includes(q);
        const deptMatch = job.department.en.toLowerCase().includes(q) || job.department.ar.toLowerCase().includes(q);
        const locMatch = job.location.en.toLowerCase().includes(q) || job.location.ar.toLowerCase().includes(q);
        const summaryMatch = job.summary.en.toLowerCase().includes(q) || job.summary.ar.toLowerCase().includes(q);
        const techMatch = job.techStack.some((t) => t.toLowerCase().includes(q));

        if (!titleMatch && !deptMatch && !locMatch && !summaryMatch && !techMatch) {
          return false;
        }
      }
      return true;
    });
  }, [openings, selectedDept, selectedLocation, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('all');
    setSelectedLocation('all');
  };

  return (
    <section id="open-positions" className={`bg-[#FFFAFA] ${sectionPaddingY} relative scroll-mt-20`}>
      <div className={sectionContainer}>
        {/* Board Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <FadeUp delay={100} duration={600}>
            <span className="inline-block font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-persici-crimson bg-persici-crimson/10 px-3.5 py-1 rounded-full mb-3">
              {isAr ? 'فرص العمل الحالية' : 'Open Positions'}
            </span>
          </FadeUp>
          <FadeUp delay={200} duration={700}>
            <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              {isAr ? 'انضم إلى نخبة البناة والمبتكرين' : 'Find Your Role in the Collective'}
            </h2>
          </FadeUp>
          <FadeUp delay={300} duration={700}>
            <p className="font-secondary text-base sm:text-lg text-foreground/70 leading-relaxed">
              {isAr
                ? 'استكشف الوظائف المتاحة في مقراتنا العالمية بدبي والرياض وعمّان وعن بُعد.'
                : 'Explore active openings across our innovation hubs in Dubai, Riyadh, Amman, and global remote.'}
            </p>
          </FadeUp>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/8 shadow-xs mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <TbSearch className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isAr
                    ? 'ابحث بالمسمى الوظيفي، التقنية، أو القسم...'
                    : 'Search by role title, tech stack, or keyword...'
                }
                className="w-full ps-11 pe-4 py-3 text-xs sm:text-sm rounded-xl sm:rounded-2xl border border-black/10 bg-black/[0.02] text-foreground placeholder:text-foreground/40 outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-foreground/40 hover:text-foreground p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results Count & Reset */}
            <div className="flex items-center justify-between lg:justify-end gap-3 text-xs text-foreground/60">
              <span className="font-mono">
                {isAr
                  ? `عرض ${filteredJobs.length} من أصل ${openings.length} وظيفة`
                  : `Showing ${filteredJobs.length} of ${openings.length} positions`}
              </span>
              {(selectedDept !== 'all' || selectedLocation !== 'all' || searchQuery) && (
                <HomeButton
                  type="button"
                  onClick={resetFilters}
                  title={isAr ? 'إعادة ضبط' : 'Reset'}
                  icon={<TbRotateClockwise className="w-3.5 h-3.5" />}
                  className="bg-black/5 hover:bg-black/10 text-foreground text-xs py-1.5 px-3.5 font-semibold shadow-none border border-black/5"
                  iconClassName="h-6 w-6 text-xs bg-white text-foreground"
                />
              )}
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="mt-5 pt-5 border-t border-black/5">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-semibold text-foreground/50 shrink-0 me-2">
                {isAr ? 'القسم:' : 'Department:'}
              </span>
              {departments.map((dept) => {
                const isActive = selectedDept === dept.slug;
                return (
                  <button
                    key={dept.slug}
                    type="button"
                    onClick={() => setSelectedDept(dept.slug)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-persici-crimson text-white shadow-xs'
                        : 'bg-black/5 text-foreground/70 hover:bg-black/10'
                    }`}
                  >
                    {dept.label[isAr ? 'ar' : 'en']}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Filter Pills */}
          <div className="mt-3 pt-3 border-t border-black/5">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-semibold text-foreground/50 shrink-0 me-2">
                {isAr ? 'المقر:' : 'Location:'}
              </span>
              {locations.map((loc) => {
                const isActive = selectedLocation === loc.slug;
                return (
                  <button
                    key={loc.slug}
                    type="button"
                    onClick={() => setSelectedLocation(loc.slug)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-foreground text-white shadow-xs'
                        : 'bg-black/5 text-foreground/70 hover:bg-black/10'
                    }`}
                  >
                    {loc.label[isAr ? 'ar' : 'en']}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:gap-6">
            {filteredJobs.map((job, idx) => (
              <FadeUp key={job.slug} delay={100 + idx * 50} duration={600}>
                <div className="group relative flex flex-col lg:flex-row lg:items-center justify-between p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-black/8 shadow-xs hover:border-persici-crimson/40 hover:shadow-xl transition-all duration-300">
                  {/* Subtle top indicator on hover */}
                  <div className="absolute top-0 inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-persici-crimson to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

                  <div className="flex-1 pe-0 lg:pe-8">
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3.5">
                      <span className="font-mono text-[11px] font-semibold text-persici-crimson bg-persici-crimson/10 px-3 py-0.5 rounded-full">
                        {job.department[isAr ? 'ar' : 'en']}
                      </span>
                      <span className="inline-flex items-center gap-1 font-secondary text-xs text-foreground/60 bg-black/5 px-2.5 py-0.5 rounded-full">
                        <TbMapPin className="w-3 h-3 text-persici-blush" />
                        <span>{job.location[isAr ? 'ar' : 'en']}</span>
                      </span>
                      <span className="font-secondary text-xs text-foreground/60 bg-black/5 px-2.5 py-0.5 rounded-full">
                        {job.type[isAr ? 'ar' : 'en']}
                      </span>
                      <span className="font-secondary text-xs text-foreground/60 bg-black/5 px-2.5 py-0.5 rounded-full">
                        {job.experience[isAr ? 'ar' : 'en']}
                      </span>
                      {job.featured && (
                        <span className="font-mono text-[10px] uppercase font-bold text-amber-700 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                          {isAr ? 'مطلوبة بشدة' : 'High Priority'}
                        </span>
                      )}
                    </div>

                    {/* Role Title */}
                    <h3 className="font-primary text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-persici-crimson transition-colors">
                      <Link href={`/${lang}/careers/${job.slug}`} className="hover:underline">
                        {job.title[isAr ? 'ar' : 'en']}
                      </Link>
                    </h3>

                    {/* Summary */}
                    <p className="font-secondary text-xs sm:text-sm text-foreground/70 leading-relaxed mb-4 line-clamp-2 max-w-4xl">
                      {job.summary[isAr ? 'ar' : 'en']}
                    </p>

                    {/* Tech Stack Pills & Compensation Preview */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/5">
                      <span className="text-[11px] font-semibold text-foreground/50">
                        {isAr ? 'التقنيات:' : 'Stack:'}
                      </span>
                      {job.techStack.slice(0, 5).map((tech: string) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-black/[0.03] text-foreground/75 border border-black/5"
                        >
                          {tech}
                        </span>
                      ))}
                      {job.techStack.length > 5 && (
                        <span className="font-mono text-[10px] text-foreground/50">
                          +{job.techStack.length - 5}
                        </span>
                      )}

                      <span className="ms-auto font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {job.salaryRange[isAr ? 'ar' : 'en']}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 lg:mt-0 shrink-0 flex items-center justify-end">
                    <HomeButton
                      href={`/${lang}/careers/${job.slug}`}
                      title={isAr ? 'تفاصيل الوظيفة والتقديم' : 'View Role & Apply'}
                      isLangEffectIcon
                      currentLang={lang}
                      className="bg-persici-black group-hover:bg-persici-crimson text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors duration-300"
                      iconClassName="h-7 w-7 text-xs"
                    />
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-black/8 shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-persici-crimson/10 text-persici-crimson flex items-center justify-center mx-auto mb-4">
              <TbBriefcase className="w-8 h-8" />
            </div>
            <h3 className="font-primary text-xl font-bold text-foreground mb-2">
              {isAr ? 'لم نجد وظائف مطابقة للبحث' : 'No Matching Openings Found'}
            </h3>
            <p className="font-secondary text-sm text-foreground/60 max-w-md mx-auto mb-6">
              {isAr
                ? 'جرّب تغيير مرشحات القسم أو المقر، أو أرسل لنا طلباً عاماً وسنتواصل معك فور توفر فرصة مناسبة.'
                : 'Try adjusting your department or location filters, or submit a spontaneous application to join our talent network.'}
            </p>
            <HomeButton
              type="button"
              onClick={resetFilters}
              title={isAr ? 'إعادة ضبط كافة المرشحات' : 'Reset All Filters'}
              icon={<TbRotateClockwise className="w-4 h-4" />}
              className="bg-persici-crimson hover:bg-persici-crimson-80 text-white shadow-lg shadow-persici-crimson/25 px-7 py-3 text-xs sm:text-sm font-semibold"
            />
          </div>
        )}
      </div>
    </section>
  );
}
