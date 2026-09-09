'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { SolutionOfferingItem } from '@shared/types';
import { SolutionsVectorDiagram } from './solutions-vector-diagram';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';

interface SolutionsOfferingsGridProps {
  offerings: SolutionOfferingItem[];
  title: string;
  subtitle: string;
  lang: string;
}

export function SolutionsOfferingsGrid({
  offerings,
  title,
  subtitle,
  lang,
}: SolutionsOfferingsGridProps) {
  const isRtl = lang === 'ar';
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section id="offerings" className={`${sectionPaddingY} bg-white relative scroll-mt-24`}>
      <div className={sectionContainer}>
        {/* Section Header with FadeUp */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {subtitle}
          </p>
        </FadeUp>

        {/* 4 Cards Per Row on Wide Screens, Compact Sizing & Center Justification */}
        <div className="flex flex-wrap justify-center gap-5 sm:gap-6 max-w-7xl mx-auto">
          {offerings.map((item, idx) => {
            const itemTitle = item.title[lang as 'en' | 'ar'] || item.title.en;
            const itemDesc = item.description[lang as 'en' | 'ar'] || item.description.en;
            const itemTag = item.tag[lang as 'en' | 'ar'] || item.tag.en;
            const detailHref = `/${lang}${item.href}`;
            const isImageIcon = item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http'));

            return (
              <div
                key={item.slug}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-[320px] flex"
              >
                <FadeUp
                  delay={idx * 65}
                  duration={650}
                  distance={24}
                  blur={true}
                  className="w-full flex"
                >
                  <div className="group relative flex flex-col justify-between rounded-2xl bg-persici-black-20 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md w-full">
                    {/* Top: Tag + Custom Icon from public/icons/solutions/ */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                          {itemTag}
                        </span>
                        {item.icon && (
                          <div className="relative h-6 w-6 shrink-0 overflow-hidden">
                            {isImageIcon ? (
                              <Image
                                src={item.icon}
                                alt={itemTitle}
                                fill
                                sizes="24px"
                                className="object-contain"
                              />
                            ) : (
                              <span className="text-base" aria-hidden="true">
                                {item.icon}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <h3 className="font-primary text-base sm:text-lg font-bold text-slate-900 transition-colors group-hover:text-persici-crimson leading-snug">
                        {itemTitle}
                      </h3>
                    </div>

                    {/* Center: Animated Vector Diagram (Freezes in place on pause) */}
                    <div className="my-6 flex items-center justify-center py-2">
                      <div className="transition-transform duration-300 group-hover:scale-105">
                        <SolutionsVectorDiagram
                          type={item.diagramType}
                          isPaused={isPaused}
                          className="h-16 w-16 sm:h-18 sm:w-18 drop-shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Bottom: Description + Kinetic Link */}
                    <div>
                      <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 line-clamp-3 mb-5">
                        {itemDesc}
                      </p>

                      <div className="pt-3 border-t border-persici-black/5">
                        <Link
                          href={detailHref}
                          className="group/link inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 transition-colors hover:text-persici-crimson"
                        >
                          <span
                            className={`relative py-0.5 after:absolute after:bottom-0 after:h-[1.5px] after:w-full after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out group-hover/link:after:scale-x-100 ${
                              isRtl
                                ? 'after:right-0 after:origin-bottom-right'
                                : 'after:left-0 after:origin-bottom-left'
                            }`}
                          >
                            {isRtl ? 'استكشف الحل' : 'Explore Solution'}
                          </span>
                          <span
                            className={`transition-transform duration-300 ease-in-out ${
                              isRtl
                                ? 'group-hover/link:-translate-x-1'
                                : 'group-hover/link:translate-x-1'
                            }`}
                          >
                            {isRtl ? '←' : '→'}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              </div>
            );
          })}
        </div>

        {/* Minimal Icon-Only Pause/Resume Animation Toggle on the side (no borders, no text labels) */}
        <div className="mt-4 flex justify-end max-w-7xl mx-auto px-2">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-persici-crimson hover:bg-black/5 active:scale-95 cursor-pointer"
            aria-label={
              isPaused
                ? isRtl
                  ? 'استئناف حركة المخططات'
                  : 'Resume animations'
                : isRtl
                  ? 'إيقاف مؤقت للحركة'
                  : 'Pause animations'
            }
            title={
              isPaused
                ? isRtl
                  ? 'استئناف حركة المخططات'
                  : 'Resume animations'
                : isRtl
                  ? 'إيقاف مؤقت للحركة'
                  : 'Pause animations'
            }
          >
            {isPaused ? (
              <svg className="h-4 w-4 fill-current ml-0.5 rtl:ml-0 rtl:mr-0.5" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            ) : (
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <rect x="5" y="4" width="4" height="16" rx="1" />
                <rect x="15" y="4" width="4" height="16" rx="1" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
