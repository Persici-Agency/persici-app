'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { TbChevronLeft, TbChevronRight, TbUser } from 'react-icons/tb';
import { FadeUp } from '@shared';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { getMemberFullName, type TeamMemberDetail } from '@/lib/team-types';
import type { HomeTeamSectionContent } from '@shared/types';

export interface HomeTeamCarouselSectionProps {
  lang: string;
  content?: HomeTeamSectionContent;
  members: TeamMemberDetail[];
}

export function HomeTeamCarouselSection({
  lang,
  content,
  members,
}: HomeTeamCarouselSectionProps) {
  const isAr = lang === 'ar';
  const l = isAr ? 'ar' : 'en';
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const momentumRafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (momentumRafRef.current !== null) {
        cancelAnimationFrame(momentumRafRef.current);
      }
    };
  }, []);

  if (content?.enabled === false) return null;

  const activeMembers = [...(members || [])]
    .filter((m) => m.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (activeMembers.length === 0) return null;

  const badge =
    content?.badge?.[l] ||
    content?.badge?.en ||
    (isAr ? 'قيادات وخبراء التحول الرقمي' : 'Leadership & Engineering Specialists');

  const title =
    content?.title?.[l] ||
    content?.title?.en ||
    (isAr
      ? 'العقول الهندسية والاستراتيجية خلف نجاحات بيرسيشي'
      : 'The Strategists, Architects & Engineers Behind Persici');

  const subtitle =
    content?.subtitle?.[l] ||
    content?.subtitle?.en ||
    (isAr
      ? 'تعرّف على نخبة المديرين ومهندسي الذكاء الاصطناعي ومعماريّي النمو الذين يقودون مشاريع التحول الرقمي لشركائنا.'
      : 'Meet the multidisciplinary directors, AI engineers, and growth architects driving measurable digital transformation across global enterprise partners.');

  const stopMomentum = () => {
    if (momentumRafRef.current !== null) {
      cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = null;
    }
  };

  const handleScrollByCard = (direction: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    stopMomentum();
    const step = Math.max(el.clientWidth * 0.72, 300);
    const factor = isAr ? -1 : 1;
    const delta = (direction === 'next' ? step : -step) * factor;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || e.button !== 0) return;
    stopMomentum();
    setIsDragging(true);
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    scrollStartRef.current = trackRef.current.scrollLeft;
    velocityRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 1);
    const dx = e.clientX - lastXRef.current;

    velocityRef.current = (dx / dt) * 16;
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;

    const totalWalk = e.clientX - startXRef.current;
    trackRef.current.scrollLeft = scrollStartRef.current - totalWalk;
  };

  const stopDragging = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const el = trackRef.current;
    if (!el) return;

    // Gentle momentum glide after releasing drag (strictly panning carousel, never reordering cards)
    let v = velocityRef.current;
    if (Math.abs(v) < 0.8) return;

    const stepMomentum = () => {
      if (!trackRef.current || Math.abs(v) < 0.4) {
        momentumRafRef.current = null;
        return;
      }
      trackRef.current.scrollLeft -= v;
      v *= 0.92;
      momentumRafRef.current = requestAnimationFrame(stepMomentum);
    };

    momentumRafRef.current = requestAnimationFrame(stepMomentum);
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    numberOfItems: activeMembers.length,
    itemListElement: activeMembers.map((m, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Person',
        name: getMemberFullName(m, l) || getMemberFullName(m, 'en'),
        jobTitle: m.title?.[l] || m.title?.en,
        ...(m.avatar ? { image: m.avatar } : {}),
        worksFor: {
          '@type': 'Organization',
          name: 'Persici',
        },
      },
    })),
  };

  return (
    <section
      id="team"
      aria-labelledby="home-team-heading"
      className={`relative bg-gradient-to-br from-[#FFF9F8] via-white to-[#F9F5F2] border-y border-black/[0.06] ${sectionPaddingY} overflow-hidden`}
    >
      {/* SEO Structured Data for Persici Team Specialists */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Subtle Ambient Decoration */}
      <div
        className="pointer-events-none absolute -top-24 end-1/4 h-72 w-72 rounded-full bg-persici-crimson/[0.04] blur-3xl"
        aria-hidden="true"
      />

      <div className={sectionContainer}>
        {/* Header Row + Carousel Navigation Controls */}
        <FadeUp delay={0} duration={700} distance={20}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-persici-crimson/10 border border-persici-crimson/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-persici-crimson mb-4">
                <span>{badge}</span>
              </div>
              <h2
                id="home-team-heading"
                className="font-primary text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-slate-900 leading-[1.15]"
              >
                {title}
              </h2>
              {/<[a-z][\s\S]*>/i.test(subtitle) ? (
                <div
                  className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl [&_p]:mb-1.5 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: subtitle }}
                />
              ) : (
                <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-3 self-start lg:self-end shrink-0">
              <span className="text-xs font-mono font-semibold text-slate-500 me-1">
                {activeMembers.length} {isAr ? 'خبير ومتخصص' : 'Specialists'}
              </span>
              <button
                type="button"
                onClick={() => handleScrollByCard('prev')}
                aria-label={isAr ? 'العضو السابق' : 'Previous team members'}
                className="h-11 w-11 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-persici-crimson hover:text-persici-crimson shadow-xs flex items-center justify-center transition-all cursor-pointer"
              >
                {isAr ? (
                  <TbChevronRight className="w-5 h-5" />
                ) : (
                  <TbChevronLeft className="w-5 h-5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleScrollByCard('next')}
                aria-label={isAr ? 'العضو التالي' : 'Next team members'}
                className="h-11 w-11 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-persici-crimson hover:text-persici-crimson shadow-xs flex items-center justify-center transition-all cursor-pointer"
              >
                {isAr ? (
                  <TbChevronLeft className="w-5 h-5" />
                ) : (
                  <TbChevronRight className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </FadeUp>

        {/* Horizontal Carousel Track (Swiper-style drag-to-scroll; strictly non-clickable & non-reorderable) */}
        <div
          ref={trackRef}
          role="region"
          aria-label={isAr ? 'فريق عمل بيرسيشي' : 'Persici team members carousel'}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          className={`flex gap-5 sm:gap-6 overflow-x-auto pb-4 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-proximity'
          }`}
        >
          {activeMembers.map((member) => {
            const fullName = getMemberFullName(member, l) || getMemberFullName(member, 'en');
            const roleTitle = member.title?.[l] || member.title?.en;

            return (
              <article
                key={member.id}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="group snap-start shrink-0 w-[76%] sm:w-[46%] md:w-[31%] lg:w-[23.5%] rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col select-none transition-all duration-300 hover:border-persici-crimson/35 hover:shadow-xl hover:shadow-slate-900/5"
              >
                {/* Portrait Container */}
                <div className="relative w-full aspect-[4/5] bg-slate-100 overflow-hidden">
                  {member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt={`${fullName} — ${roleTitle}`}
                      fill
                      draggable={false}
                      sizes="(max-width: 640px) 76vw, (max-width: 1024px) 46vw, 24vw"
                      unoptimized
                      className="object-cover object-top pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <TbUser className="w-16 h-16" />
                    </div>
                  )}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent"
                    aria-hidden="true"
                  />
                </div>

                {/* Member Identity: Strictly Full Name & Title */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <div className="w-8 h-0.5 bg-persici-crimson/80 mb-3 rounded-full" />
                    <h3 className="font-primary text-lg sm:text-xl font-medium text-slate-900 leading-snug">
                      {fullName}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                      {roleTitle}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
