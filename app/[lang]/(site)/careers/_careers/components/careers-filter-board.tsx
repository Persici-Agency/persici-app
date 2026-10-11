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
import {
  careersHubData,
  type CareerJobOpening,
  type CareersHubData,
} from '../data/careers.data';

export interface CareersFilterBoardProps {
  openings: CareerJobOpening[];
  data?: CareersHubData['openPositions'];
  lang: string;
}

export function CareersFilterBoard({ openings, data, lang }: CareersFilterBoardProps) {
  const isAr = lang === 'ar';
  const board = data || careersHubData.openPositions;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const departments = useMemo(() => {
    const base =
      Array.isArray(board.departments) && board.departments.length > 0
        ? [...board.departments]
        : [...careersHubData.openPositions.departments];
    const knownSlugs = new Set(base.map((d) => d.slug));

    for (const job of openings) {
      if (job.departmentSlug && !knownSlugs.has(job.departmentSlug)) {
        knownSlugs.add(job.departmentSlug);
        base.push({
          slug: job.departmentSlug,
          label: job.department || { en: job.departmentSlug, ar: job.departmentSlug },
        });
      }
    }
    return base;
  }, [board.departments, openings]);

  const locations = useMemo(() => {
    const base =
      Array.isArray(board.locations) && board.locations.length > 0
        ? [...board.locations]
        : [...careersHubData.openPositions.locations];
    const knownSlugs = new Set(base.map((l) => l.slug));

    for (const job of openings) {
      if (job.locationSlug && !knownSlugs.has(job.locationSlug)) {
        knownSlugs.add(job.locationSlug);
        base.push({
          slug: job.locationSlug,
          label: job.location || { en: job.locationSlug, ar: job.locationSlug },
        });
      }
    }
    return base;
  }, [board.locations, openings]);

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

  const subtitleText = board.subtitle[isAr ? 'ar' : 'en'] || '';

  return (
    <section id="open-positions" className={`bg-[#FFFAFA] ${sectionPaddingY} relative scroll-mt-20`}>
      <div className={sectionContainer}>
        {/* Board Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <FadeUp delay={100} duration={600}>
            <span className="inline-block font-mono text-[9.5px] sm:text-xs font-semibold uppercase tracking-wider text-persici-crimson bg-persici-crimson/10 px-3.5 py-1 rounded-full mb-3">
              {board.badge[isAr ? 'ar' : 'en']}
            </span>
          </FadeUp>
          <FadeUp delay={200} duration={700}>
            <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mb-4">
              {board.title[isAr ? 'ar' : 'en']}
            </h2>
          </FadeUp>
          <FadeUp delay={300} duration={700}>
            {/<[a-z][\s\S]*>/i.test(subtitleText) ? (
              <div
                className="font-secondary text-base sm:text-lg text-foreground/70 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: subtitleText }}
              />
            ) : (
              <p className="font-secondary text-base sm:text-lg text-foreground/70 leading-relaxed">
                {subtitleText}
              </p>
            )}
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
                placeholder={board.searchPlaceholder[isAr ? 'ar' : 'en']}
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
                {board.departmentLabel[isAr ? 'ar' : 'en']}
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
                {board.locationLabel[isAr ? 'ar' : 'en']}
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
            {filteredJobs.map((job, idx) => {
              const vis = job.sectionVisibility || {};
              const jobSummary = job.summary[isAr ? 'ar' : 'en'] || '';

              return (
                <FadeUp key={job.slug} delay={100 + idx * 50} duration={600}>
                  <div className="group relative flex flex-col lg:flex-row lg:items-center justify-between p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-black/8 shadow-xs hover:border-persici-crimson/40 hover:shadow-xl transition-all duration-300">
                    {/* Subtle top indicator on hover */}
                    <div className="absolute top-0 inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-persici-crimson to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

                    <div className="flex-1 pe-0 lg:pe-8">
                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-3.5">
                        {vis.showDepartmentBadge !== false && (
                          <span className="font-mono text-[9.5px] font-semibold text-persici-crimson bg-persici-crimson/10 px-3 py-0.5 rounded-full">
                            {job.department[isAr ? 'ar' : 'en']}
                          </span>
                        )}
                        {vis.showLocationBadge !== false && (
                          <span className="inline-flex items-center gap-1 font-secondary text-xs text-foreground/60 bg-black/5 px-2.5 py-0.5 rounded-full">
                            <TbMapPin className="w-3 h-3 text-persici-blush" />
                            <span>{job.location[isAr ? 'ar' : 'en']}</span>
                          </span>
                        )}
                        {vis.showTypeBadge !== false && (
                          <span className="font-secondary text-xs text-foreground/60 bg-black/5 px-2.5 py-0.5 rounded-full">
                            {job.type[isAr ? 'ar' : 'en']}
                          </span>
                        )}
                        {vis.showExperienceBadge !== false && (
                          <span className="font-secondary text-xs text-foreground/60 bg-black/5 px-2.5 py-0.5 rounded-full">
                            {job.experience[isAr ? 'ar' : 'en']}
                          </span>
                        )}
                        {job.featured && (
                          <span className="font-mono text-[9.5px] uppercase font-semibold text-amber-700 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                            {board.highPriorityBadge[isAr ? 'ar' : 'en']}
                          </span>
                        )}
                      </div>

                      {/* Role Title */}
                      <h3 className="font-primary text-xl sm:text-2xl font-medium text-foreground mb-2 group-hover:text-persici-crimson transition-colors">
                        <Link href={`/${lang}/careers/${job.slug}`} className="hover:underline">
                          {job.title[isAr ? 'ar' : 'en']}
                        </Link>
                      </h3>

                      {/* Summary */}
                      {vis.showSummary !== false && (
                        /<[a-z][\s\S]*>/i.test(jobSummary) ? (
                          <div
                            className="font-secondary text-xs sm:text-sm text-foreground/70 leading-relaxed mb-4 line-clamp-2 max-w-4xl"
                            dangerouslySetInnerHTML={{ __html: jobSummary }}
                          />
                        ) : (
                          <p className="font-secondary text-xs sm:text-sm text-foreground/70 leading-relaxed mb-4 line-clamp-2 max-w-4xl">
                            {jobSummary}
                          </p>
                        )
                      )}

                      {/* Tech Stack Pills & Compensation Preview */}
                      {(vis.showTechStack !== false || vis.showSalary !== false) && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/5">
                          {vis.showTechStack !== false && job.techStack.length > 0 && (
                            <>
                              <span className="text-[9.5px] font-semibold text-foreground/50">
                                {board.stackLabel[isAr ? 'ar' : 'en']}
                              </span>
                              {job.techStack.slice(0, 5).map((tech: string) => (
                                <span
                                  key={tech}
                                  className="font-mono text-[9.5px] px-2 py-0.5 rounded-md bg-black/[0.03] text-foreground/75 border border-black/5"
                                >
                                  {tech}
                                </span>
                              ))}
                              {job.techStack.length > 5 && (
                                <span className="font-mono text-[9.5px] text-foreground/50">
                                  +{job.techStack.length - 5}
                                </span>
                              )}
                            </>
                          )}

                          {vis.showSalary !== false && job.salaryRange?.[isAr ? 'ar' : 'en'] && (
                            <span className="ms-auto font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              {job.salaryRange[isAr ? 'ar' : 'en']}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-5 lg:mt-0 shrink-0 flex items-center justify-end">
                      <HomeButton
                        href={`/${lang}/careers/${job.slug}`}
                        title={board.applyCtaText[isAr ? 'ar' : 'en']}
                        isLangEffectIcon
                        currentLang={lang}
                        className="bg-persici-black group-hover:bg-persici-crimson text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors duration-300"
                        iconClassName="h-7 w-7 text-xs"
                      />
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-black/8 shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-persici-crimson/10 text-persici-crimson flex items-center justify-center mx-auto mb-4">
              <TbBriefcase className="w-8 h-8" />
            </div>
            <h3 className="font-primary text-xl font-medium text-foreground mb-2">
              {board.emptyTitle[isAr ? 'ar' : 'en']}
            </h3>
            <p className="font-secondary text-sm text-foreground/60 max-w-md mx-auto mb-6">
              {board.emptySubtitle[isAr ? 'ar' : 'en']}
            </p>
            <HomeButton
              type="button"
              onClick={resetFilters}
              title={board.resetButtonText[isAr ? 'ar' : 'en']}
              icon={<TbRotateClockwise className="w-4 h-4" />}
              className="bg-persici-crimson hover:bg-persici-crimson-80 text-white shadow-lg shadow-persici-crimson/25 px-7 py-3 text-xs sm:text-sm font-semibold"
            />
          </div>
        )}
      </div>
    </section>
  );
}
