'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';
import type { IndustryFutureTrendItem } from '@shared/types';

export interface IndustryFutureStripProps {
  title: string;
  subtitle: string;
  badge?: string;
  trends: IndustryFutureTrendItem[];
  lang: string;
  className?: string;
}

export function IndustryFutureStrip({
  title,
  subtitle,
  badge,
  trends,
  lang,
  className = '',
}: IndustryFutureStripProps) {
  const isRtl = lang === 'ar';

  return (
    <section className={`${sectionPaddingY} bg-white relative border-b border-black/[0.04] ${className}`}>
      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="max-w-3xl mb-12 sm:mb-16">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-persici-crimson/10 text-persici-crimson text-xs font-semibold uppercase tracking-wider mb-3">
              {badge}
            </div>
          )}
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {subtitle}
          </p>
        </FadeUp>

        {/* 2-Card Visual Trend Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {trends.slice(0, 2).map((item, idx) => {
            const cardTitle = item.title[lang as 'en' | 'ar'] || item.title.en;
            const cardDesc = item.description[lang as 'en' | 'ar'] || item.description.en;
            const cardBadge = item.badge[lang as 'en' | 'ar'] || item.badge.en;

            return (
              <FadeUp
                key={idx}
                delay={idx * 100}
                duration={700}
                distance={24}
                className="h-full"
              >
                <div className="group relative h-[360px] sm:h-[420px] lg:h-[460px] w-full rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-6 sm:p-8 lg:p-10 border border-black/5">
                  {/* Background Photographic Asset with Zoom Effect */}
                  <Image
                    src={item.image}
                    alt={cardTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Multi-tier Gradient Wash for Text Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-persici-crimson/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card Content at Bottom */}
                  <div className="relative z-10">
                    <span className="inline-block text-[11px] font-mono font-semibold tracking-wider uppercase text-white/90 bg-white/15 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-3">
                      {cardBadge}
                    </span>

                    <h3 className="font-primary text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-snug mb-3 transition-colors group-hover:text-white">
                      {cardTitle}
                    </h3>

                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-3 font-normal mb-4">
                      {cardDesc}
                    </p>

                    {item.href && (
                      <Link
                        href={`/${lang}${item.href}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-white/90 hover:text-white group/link"
                      >
                        <span className="relative py-0.5 after:absolute after:bottom-0 after:h-[1.5px] after:w-full after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out group-hover/link:after:scale-x-100">
                          {isRtl ? 'اكتشف التحول' : 'Explore Shift'}
                        </span>
                        <span className={`transition-transform duration-300 ${isRtl ? 'group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'}`}>
                          {isRtl ? '←' : '→'}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
