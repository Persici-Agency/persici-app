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
    <section
      data-header-luminance="light"
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`relative w-full overflow-hidden bg-[#F6F3EE] pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-32 min-h-[540px] lg:min-h-[620px] flex items-center border-b border-black/[0.04] ${className || ''}`}
    >
      {/* Editorial Panoramic Visual */}
      <div
        className={`absolute top-0 bottom-0 ${
          isRtl ? 'left-0' : 'right-0'
        } w-full lg:w-[50%] xl:w-[52%] pointer-events-none overflow-hidden select-none`}
        aria-hidden="true"
      >
        <div className="relative h-full w-full">
          <Image
            src={heroImageSrc}
            alt={heroTitle}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className={`object-cover ${
              isRtl ? 'object-center lg:object-left' : 'object-center lg:object-right'
            } opacity-90 sm:opacity-95 lg:opacity-100`}
          />
          {/* Directional gradient wash ensuring seamless transition to background and high text contrast */}
          <div
            className={`absolute inset-0 hidden lg:block ${
              isRtl
                ? 'bg-gradient-to-l from-[#F6F3EE] via-[#F6F3EE]/60 to-transparent'
                : 'bg-gradient-to-r from-[#F6F3EE] via-[#F6F3EE]/60 to-transparent'
            }`}
          />
          {/* Mobile wash */}
          <div className="absolute inset-0 bg-[#F6F3EE]/85 lg:hidden" />
        </div>
      </div>

      {/* Typography & CTA Container */}
      <div className={`${sectionContainer} relative z-10 w-full`}>
        <div
          className={`w-full max-w-xl lg:max-w-xl xl:max-w-2xl lg:w-[48%] xl:w-[50%] ${
            isRtl ? 'mr-0 ml-auto text-start' : 'ml-0 mr-auto text-start'
          }`}
        >
          {tagText && (
            <div className="flex items-center gap-2.5 mb-5">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest rtl:tracking-normal rtl:normal-case text-persici-crimson">
                {tagText}
              </span>
              {secTagText && (
                <>
                  <span className="text-slate-300 font-light">/</span>
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest rtl:tracking-normal rtl:normal-case text-slate-400">
                    {secTagText}
                  </span>
                </>
              )}
            </div>
          )}

          <h1 className="font-primary text-4xl sm:text-5xl lg:text-[48px] xl:text-[56px] font-medium tracking-tight rtl:tracking-normal text-slate-900 leading-[1.12] sm:leading-[1.1] rtl:leading-[1.25] rtl:sm:leading-[1.2]">
            {heroTitle}
          </h1>

          <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl leading-relaxed rtl:leading-relaxed text-slate-600 max-w-xl">
            {heroSubtitle}
          </p>

          <div className="mt-8 sm:mt-10 flex items-center rtl:justify-start">
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
