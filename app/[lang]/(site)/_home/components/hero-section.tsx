import type { Dictionary } from '@dictionaries';
import { HomeButton, SwiperWrapper, FadeUp, AvatarSocialProof } from '@shared/components';
import { socialProofAvatars } from '@shared/data';
import { cn, heroHeading } from '@shared';

export type HeroSectionProps = {
  lang: string;
  dict: Dictionary;
  content?: any;
  className?: string;
};

export function HeroSection({ lang, dict, content, className }: HeroSectionProps) {
  const isAr = lang === 'ar';

  const title = (isAr ? content?.heroTitleAr : content?.heroTitle) ||
    content?.hero?.title?.[isAr ? 'ar' : 'en'] ||
    dict.hero.title;

  const subtitle = (isAr ? content?.heroDescriptionAr : (content?.heroDescriptionEn || content?.heroDescription)) ||
    content?.hero?.subtitle?.[isAr ? 'ar' : 'en'] ||
    dict.hero.subtitle;

  const ctaLabel = (isAr ? content?.heroCtaLabelAr : content?.heroCtaLabelEn) ||
    content?.hero?.cta?.[isAr ? 'ar' : 'en'] ||
    dict.hero.cta;

  const ctaHref = content?.heroCtaHref || `/${lang}/contact`;

  const ratingLabel = (isAr ? content?.heroScoreTextAr : content?.heroScoreTextEn) ||
    content?.hero?.ratingLabel?.[isAr ? 'ar' : 'en'] ||
    dict.hero.ratingLabel;

  const trustedBy = (isAr ? content?.partnersTitleAr : content?.partnersTitleEn) ||
    dict.hero.trustedBy;

  const customLogos = content?.clientLogos && content.clientLogos.length > 0 ? content.clientLogos : undefined;

  return (
    <section className={cn('relative pt-30 pb-20 sm:pt-55 sm:pb-30', className)}>
      {/* Subtle Ambient Radial Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
        <div className="h-[480px] w-[800px] rounded-full bg-gradient-to-b from-persici-blush/25 via-persici-crimson/10 to-transparent blur-3xl opacity-70" />
      </div>

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Main Headline */}
        <FadeUp delay={0} duration={800} distance={28} blur={true}>
          <h1 className={heroHeading}>
            {title}
          </h1>
        </FadeUp>

        {/* Subtitle */}
        <FadeUp delay={150} duration={800} distance={24}>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base lg:text-lg">
            {subtitle}
          </p>
        </FadeUp>

        {/* CTA & Rating Row */}
        <FadeUp delay={300} duration={800} distance={20}>
          <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
            <HomeButton
              href={ctaHref}
              title={ctaLabel}
              className="bg-persici-crimson text-white"
              currentLang={lang}
              isLangEffectIcon={true}
            />

            {/* Rating / Avatar Social Proof */}
            <AvatarSocialProof
              avatars={content?.heroAvatars || socialProofAvatars}
              ratingLabel={ratingLabel}
              size="lg"
              starsClassName="text-xl"
            />
          </div>
        </FadeUp>
      </div>

      {/* Animated Infinite Client Logos Marquee */}
      <FadeUp delay={450} duration={800} distance={20}>
        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <SwiperWrapper
            logoHeight={45}
            gap="lg"
            pauseOnHover={false}
            title={trustedBy}
            logos={customLogos}
            logoWhiteAndBlackColor={false}
            hoverOnRealColor={false}
            loopClassName="mt-10"
          />
        </div>
      </FadeUp>
    </section>
  );
}


