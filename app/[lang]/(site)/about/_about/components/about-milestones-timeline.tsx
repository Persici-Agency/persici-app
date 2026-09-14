'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { sectionContainer, sectionPaddingY, badgePill } from '@shared/constants';
import { FadeUp } from '@shared';
import type { AboutMilestonesData } from '../data/about.data';

export interface AboutMilestonesTimelineProps {
  data: AboutMilestonesData;
  lang: string;
}

export function AboutMilestonesTimeline({ data, lang }: AboutMilestonesTimelineProps) {
  const isRtl = lang === 'ar';
  const badge = data.badge[lang as 'en' | 'ar'] || data.badge.en;
  const title = data.title[lang as 'en' | 'ar'] || data.title.en;
  const subtitle = data.subtitle[lang as 'en' | 'ar'] || data.subtitle.en;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dynamic scroll listener with requestAnimationFrame for smooth 60fps/120fps progress tracking
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start filling when timeline enters bottom half of screen (65% viewport height)
      // and complete 100% when timeline finishes scrolling past upper center (35% viewport height)
      const startPoint = windowHeight * 0.65;
      const totalDistance = rect.height - windowHeight * 0.2;
      const currentScrolled = startPoint - rect.top;

      const progress = Math.min(Math.max(currentScrolled / (totalDistance || 1), 0), 1);
      setScrollProgress(progress);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section className={`${sectionPaddingY} bg-white relative overflow-hidden`} id="milestones">
      <div className={sectionContainer}>
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24">
          <FadeUp delay={0} duration={600} distance={16}>
            <span className={`${badgePill} mb-4 tracking-wide uppercase text-[11px] font-mono font-semibold`}>
              {badge}
            </span>
          </FadeUp>

          <FadeUp delay={100} duration={750} distance={20}>
            <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-persici-black leading-[1.15] rtl:leading-[1.25] mb-4">
              {title}
            </h2>
          </FadeUp>

          <FadeUp delay={180} duration={750} distance={20}>
            <p className="font-secondary text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {subtitle}
            </p>
          </FadeUp>
        </div>

        {/* Timeline Container with Dynamic Central Rail */}
        <div ref={containerRef} className="relative max-w-6xl mx-auto">
          {/* Central Vertical Base Rail (Desktop) */}
          <div
            className="hidden md:block absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-[2px] bg-slate-200"
            aria-hidden="true"
          />

          {/* Central Vertical Dynamic Progress Bar (Desktop) - Fills down smoothly as you scroll */}
          <div
            style={{ height: `${scrollProgress * 100}%` }}
            className="hidden md:block absolute top-8 left-1/2 -translate-x-1/2 w-[2px] bg-persici-crimson transition-[height] duration-150 ease-out shadow-[0_0_10px_rgba(216,52,39,0.5)] z-10"
            aria-hidden="true"
          />

          {/* Mobile Vertical Base Rail */}
          <div
            className={`md:hidden absolute top-8 bottom-8 ${
              isRtl ? 'right-4' : 'left-4'
            } w-[2px] bg-slate-200`}
            aria-hidden="true"
          />

          {/* Mobile Vertical Dynamic Progress Bar */}
          <div
            style={{ height: `${scrollProgress * 100}%` }}
            className={`md:hidden absolute top-8 ${
              isRtl ? 'right-4' : 'left-4'
            } w-[2px] bg-persici-crimson transition-[height] duration-150 ease-out shadow-[0_0_10px_rgba(216,52,39,0.5)] z-10`}
            aria-hidden="true"
          />

          {/* Milestones Alternating Rows */}
          <div className="space-y-20 sm:space-y-28 lg:space-y-36">
            {data.items.map((item, idx) => {
              const itemTitle = item.title[lang as 'en' | 'ar'] || item.title.en;
              const itemDesc = item.description[lang as 'en' | 'ar'] || item.description.en;

              // Alternation: Even items have photo on Left, Content on Right; Odd items have Content on Left, Photo on Right
              const isEven = idx % 2 === 0;

              // Node active threshold: when scroll progress reaches or passes this item's proportion
              const itemThreshold = (idx + 0.3) / data.items.length;
              const isPassed = scrollProgress >= itemThreshold;

              // Inward slide directions:
              // Left column moves right towards center (in RTL: moves left towards center)
              const leftDirection = isRtl ? 'left' : 'right';
              // Right column moves left towards center (in RTL: moves right towards center)
              const rightDirection = isRtl ? 'right' : 'left';

              const photoElement = (
                <div className="relative w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-black/5 bg-slate-100">
                  <Image
                    src={item.image}
                    alt={itemTitle}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={idx < 2}
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl sm:rounded-3xl pointer-events-none" />
                </div>
              );

              const contentElement = (
                <div className="flex flex-col justify-center">
                  {/* Huge Monospace Year matching Publicis Sapient reference */}
                  <div className="font-mono text-5xl sm:text-6xl lg:text-7xl font-normal text-black tracking-tight mb-3 sm:mb-4">
                    {item.year}
                  </div>

                  {/* Title */}
                  <h3 className="font-primary text-2xl sm:text-3xl lg:text-4xl font-bold text-persici-black tracking-tight leading-snug mb-4">
                    {itemTitle}
                  </h3>

                  {/* Narrative Description */}
                  <p className="font-secondary text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                    {itemDesc}
                  </p>
                </div>
              );

              return (
                <div key={item.year} className="relative">
                  {/* Central Node Indicator (Desktop) */}
                  <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                        isPassed
                          ? 'bg-persici-crimson border-white ring-4 ring-persici-crimson/25 scale-110 shadow-md'
                          : 'bg-slate-300 border-white ring-2 ring-slate-100 scale-90'
                      }`}
                    />
                  </div>

                  {/* Mobile Leading Node */}
                  <div
                    className={`md:hidden absolute top-8 ${
                      isRtl ? 'right-[9px]' : 'left-[9px]'
                    } z-20 flex items-center justify-center pointer-events-none`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                        isPassed
                          ? 'bg-persici-crimson border-white ring-2 ring-persici-crimson/30 scale-105'
                          : 'bg-slate-300 border-white'
                      }`}
                    />
                  </div>

                  {/* Desktop Grid (2 Equal Columns with Inward Converging FadeUp) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center pl-10 md:pl-0 rtl:pl-0 rtl:pr-10 rtl:md:pr-0">
                    {isEven ? (
                      <>
                        {/* Left: Photo sliding inwards towards center */}
                        <FadeUp
                          delay={100}
                          duration={750}
                          distance={50}
                          direction={leftDirection}
                          className="w-full"
                        >
                          {photoElement}
                        </FadeUp>

                        {/* Right: Content sliding inwards towards center */}
                        <FadeUp
                          delay={150}
                          duration={750}
                          distance={50}
                          direction={rightDirection}
                          className="w-full"
                        >
                          {contentElement}
                        </FadeUp>
                      </>
                    ) : (
                      <>
                        {/* Left: Content sliding inwards towards center (Desktop) */}
                        <FadeUp
                          delay={150}
                          duration={750}
                          distance={50}
                          direction={leftDirection}
                          className="w-full order-2 md:order-1"
                        >
                          {contentElement}
                        </FadeUp>

                        {/* Right: Photo sliding inwards towards center (Desktop) */}
                        <FadeUp
                          delay={100}
                          duration={750}
                          distance={50}
                          direction={rightDirection}
                          className="w-full order-1 md:order-2"
                        >
                          {photoElement}
                        </FadeUp>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
