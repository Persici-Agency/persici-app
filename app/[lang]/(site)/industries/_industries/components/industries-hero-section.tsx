import React from 'react';
import Image from 'next/image';
import type { IndustriesPageContent } from '@shared/types';
import { sectionContainer } from '@shared/constants';
import { HomeButton } from '@shared';

export interface IndustriesHeroSectionProps {
  content?: IndustriesPageContent;
  title?: string | { en: string; ar: string };
  subtitle?: string | { en: string; ar: string };
  tag?: string | { en: string; ar: string };
  secondaryTag?: string | { en: string; ar: string };
  image?: string;
  ctaText?: string | { en: string; ar: string };
  ctaHref?: string;
  lang: string;
  className?: string;
}

export function IndustriesHeroSection({
  content,
  title,
  subtitle,
  tag,
  secondaryTag,
  image,
  ctaText,
  ctaHref,
  lang,
  className,
}: IndustriesHeroSectionProps) {
  const isRtl = lang === 'ar';

  const heroTitle =
    (typeof title === 'string'
      ? title
      : title?.[lang as 'en' | 'ar'] || title?.en) ||
    (content?.heroTitle
      ? content.heroTitle[lang as 'en' | 'ar'] || content.heroTitle.en
      : '');

  const heroSubtitle =
    (typeof subtitle === 'string'
      ? subtitle
      : subtitle?.[lang as 'en' | 'ar'] || subtitle?.en) ||
    (content?.heroSubtitle
      ? content.heroSubtitle[lang as 'en' | 'ar'] || content.heroSubtitle.en
      : '');

  const heroCtaPrimary =
    (typeof ctaText === 'string'
      ? ctaText
      : ctaText?.[lang as 'en' | 'ar'] || ctaText?.en) ||
    (content?.heroCtaPrimary
      ? content.heroCtaPrimary[lang as 'en' | 'ar'] || content.heroCtaPrimary.en
      : isRtl ? 'استكشف القطاعات' : 'Explore Industries');

  const heroHref = ctaHref || '#industries-grid';

  const heroImageSrc =
    image ||
    content?.heroImage ||
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85';

  const tagText =
    typeof tag === 'string'
      ? tag
      : tag?.[lang as 'en' | 'ar'] || tag?.en || (content?.heroBadge ? content.heroBadge[lang as 'en' | 'ar'] || content.heroBadge.en : '');

  const secTagText =
    typeof secondaryTag === 'string'
      ? secondaryTag
      : secondaryTag?.[lang as 'en' | 'ar'] || secondaryTag?.en;

  return (
    <section className={`relative w-full overflow-hidden bg-[#F6F3EE] pt-36 pb-16 sm:pt-44 sm:pb-24 lg:pt-48 lg:pb-32 min-h-[580px] lg:min-h-[660px] flex items-center border-b border-black/[0.04] ${className || ''}`}>
      {/* Right Side: Editorial Panoramic Visual seamlessly integrated into background */}
      <div
        className={`absolute top-0 bottom-0 ${isRtl ? 'left-0' : 'right-0'} w-full lg:w-[52%] pointer-events-none overflow-hidden select-none`}
        aria-hidden="true"
      >
        <div className="relative h-full w-full">
          <Image
            src={heroImageSrc}
            alt={heroTitle}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className={`object-cover ${isRtl ? 'object-left-bottom' : 'object-right-bottom'} opacity-85 sm:opacity-90 lg:opacity-100`}
          />
          {/* Subtle directional gradient wash ensuring typography contrast */}
          <div
            className={`absolute inset-0 hidden lg:block ${
              isRtl
                ? 'bg-gradient-to-l from-transparent via-[#F6F3EE]/50 to-[#F6F3EE]'
                : 'bg-gradient-to-r from-[#F6F3EE] via-[#F6F3EE]/50 to-transparent'
            }`}
          />
          {/* Mobile wash */}
          <div className="absolute inset-0 bg-[#F6F3EE]/85 lg:hidden" />
        </div>
      </div>

      {/* Left Side: Typography & CTA */}
      <div className={`${sectionContainer} relative z-10 w-full`}>
        <div className="max-w-xl lg:max-w-2xl">
          {tagText && (
            <div className="flex items-center gap-2.5 mb-5">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson">
                {tagText}
              </span>
              {secTagText && (
                <>
                  <span className="text-slate-300 font-light">/</span>
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-400">
                    {secTagText}
                  </span>
                </>
              )}
            </div>
          )}

          <h1 className="font-primary text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-extrabold tracking-tight text-slate-900 leading-[1.1] sm:leading-[1.08]">
            {heroTitle}
          </h1>

          <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 max-w-xl">
            {heroSubtitle}
          </p>

          <div className="mt-8 sm:mt-10 flex items-center">
            <HomeButton
              href={heroHref}
              title={heroCtaPrimary}
              className="bg-persici-crimson text-white hover:bg-persici-crimson/90"
              currentLang={lang}
              isLangEffectIcon={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export const IndustryHero = IndustriesHeroSection;
