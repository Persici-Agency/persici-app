'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { sectionContainer, sectionPaddingY, HomeButton, FadeUp } from '@shared';
import { getHomeApproachTeam } from '../services';

export type ApproachSectionProps = {
  lang: string;
  dict: Dictionary;
  content?: any;
};

export function TeamSpecialistsTrack({ teamAvatars }: { teamAvatars: any[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch swipe support
  const touchStartXRef = useRef(0);
  const touchScrollLeftRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    touchStartXRef.current = e.touches[0].pageX - trackRef.current.offsetLeft;
    touchScrollLeftRef.current = trackRef.current.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - touchStartXRef.current) * 1.5;
    trackRef.current.scrollLeft = touchScrollLeftRef.current - walk;
  };

  return (
    <div
      ref={trackRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="w-full overflow-x-auto select-none pt-1 pb-1 cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="min-w-full w-max flex items-center justify-center -space-x-2.5 rtl:space-x-reverse px-2">
        {teamAvatars.map((member: any, idx: number) => (
          <div
            key={member.id || idx}
            className="group relative h-9 w-9 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full border-2 sm:border-3 border-white bg-white shadow-xs transition-transform duration-300 hover:scale-115 hover:z-20 cursor-pointer pointer-events-auto"
            title={member.role ? `${member.name ? member.name + ' - ' : ''}${member.role}` : member.alt || `Specialist ${idx + 1}`}
          >
            <Image
              src={member.avatar || member.src}
              alt={member.alt || member.name || `Specialist avatar ${idx + 1}`}
              fill
              sizes="64px"
              className="object-cover pointer-events-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ApproachSection({ lang, dict, content }: ApproachSectionProps) {
  const isAr = lang === 'ar';
  const defaultTeamAvatars = getHomeApproachTeam();
  const teamAvatars =
    (content?.teamMembers && content.teamMembers.length > 0)
      ? content.teamMembers
      : defaultTeamAvatars;

  const teamImage =
    content?.teamImage ||
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';

  const badgeLabel =
    content?.badgeLabel?.[lang] ||
    content?.teamBadgeLabel?.[lang] ||
    (isAr ? (content?.teamBadgeLabelAr || content?.badgeLabelAr) : (content?.teamBadgeLabelEn || content?.badgeLabelEn)) ||
    content?.badgeLabel ||
    content?.teamBadgeLabel ||
    dict.approach.teamBadgeLabel ||
    'Team Persici';

  const badgeTitle =
    content?.badgeTitle?.[lang] ||
    content?.teamBadgeTitle?.[lang] ||
    (isAr ? (content?.teamBadgeTitleAr || content?.badgeTitleAr) : (content?.teamBadgeTitleEn || content?.badgeTitleEn)) ||
    content?.badgeTitle ||
    content?.teamBadgeTitle ||
    dict.approach.teamBadgeTitle ||
    'Your team of specialists';

  const title =
    content?.title?.[lang] ||
    (isAr ? content?.titleAr : content?.titleEn) ||
    content?.title ||
    dict.approach.title;

  const desc1 =
    content?.desc1?.[lang] ||
    (isAr ? content?.desc1Ar : content?.desc1En) ||
    content?.desc1 ||
    dict.approach.desc1;

  const desc2 =
    content?.desc2?.[lang] ||
    (isAr ? content?.desc2Ar : content?.desc2En) ||
    content?.desc2 ||
    dict.approach.desc2;

  const ctaPrimary =
    content?.ctaPrimaryText?.[lang] ||
    content?.ctaPrimary?.[lang] ||
    (isAr ? content?.ctaPrimaryAr : content?.ctaPrimaryEn) ||
    content?.ctaPrimaryText ||
    dict.approach.ctaPrimary;

  const rawPrimaryHref = content?.ctaPrimaryHref || '/contact';
  const ctaPrimaryHref = rawPrimaryHref.startsWith(`/${lang}`)
    ? rawPrimaryHref
    : rawPrimaryHref.startsWith('/')
    ? `/${lang}${rawPrimaryHref}`
    : rawPrimaryHref;

  const ctaSecondary =
    content?.ctaSecondaryText?.[lang] ||
    content?.ctaSecondary?.[lang] ||
    (isAr ? content?.ctaSecondaryAr : content?.ctaSecondaryEn) ||
    content?.ctaSecondaryText ||
    dict.approach.ctaSecondary;

  const rawSecondaryHref = content?.ctaSecondaryHref || '/about';
  const ctaSecondaryHref = rawSecondaryHref.startsWith(`/${lang}`)
    ? rawSecondaryHref
    : rawSecondaryHref.startsWith('/')
    ? `/${lang}${rawSecondaryHref}`
    : rawSecondaryHref;

  return (
    <section className={`relative ${sectionContainer} ${sectionPaddingY}`}>
      {/* Subtle Right Background Polygon Accent from the reference design */}
      <div className="pointer-events-none absolute -top-12 -end-10 -bottom-12 -z-10 hidden w-1/2 overflow-hidden lg:block opacity-60">
        <div className="h-full w-full bg-gradient-to-bl from-persici-crimson/[0.04] via-black/[0.02] to-transparent [clip-path:polygon(30%_0%,100%_0%,100%_100%,0%_75%)] rounded-3xl" />
      </div>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Team Image with Floating Badge Card */}
        <FadeUp delay={0} duration={800} distance={28} className="relative lg:col-span-6">
          <div className="relative aspect-[4/3] sm:aspect-[1.15/1] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-black/5 shadow-2xl bg-black/5">
            <Image
              src={teamImage}
              alt="Persici eCommerce growth team"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Floating "Team Persici / Your team of specialists" Card with Avatar Stack */}
          <div className="absolute bottom-4 sm:bottom-6 start-4 sm:start-6 end-4 sm:end-6 rounded-2xl sm:rounded-3xl border border-black/10 bg-white/95 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col gap-2.5">
              <div>
                <span className="block text-[9.5px] font-semibold tracking-wider uppercase text-persici-crimson">
                  {badgeLabel}
                </span>
                <h4 className="font-primary text-sm sm:text-base font-medium text-foreground mt-0.5">
                  {badgeTitle}
                </h4>
              </div>

              {/* Horizontal Drag-To-Scroll Track for Specialists Avatars */}
              <TeamSpecialistsTrack teamAvatars={teamAvatars} />
            </div>
          </div>
        </FadeUp>

        {/* Right Column: Approach Copy & CTAs */}
        <FadeUp delay={200} duration={800} distance={24} className="relative lg:col-span-6">
          <h2 className="font-primary text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.15]">
            {title}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-foreground/75 sm:text-base">
            {desc1}
          </p>
          {desc2 && (
            <p className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base">
              {desc2}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <HomeButton
              href={ctaPrimaryHref}
              title={ctaPrimary}
              className="bg-persici-crimson text-white px-7 py-3 text-sm font-semibold"
              iconClassName="bg-white text-persici-crimson"
              currentLang={lang}
              isLangEffectIcon={true}
            />
            <HomeButton
              href={ctaSecondaryHref}
              title={ctaSecondary}
              className="border border-black/15 bg-black/[0.04] text-foreground px-7 py-3 text-sm font-semibold"
              iconClassName="bg-black text-white"
              currentLang={lang}
              isLangEffectIcon={true}
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

