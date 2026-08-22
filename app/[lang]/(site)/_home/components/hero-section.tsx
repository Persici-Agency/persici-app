import type { Dictionary } from '@dictionaries';
import { HomeButton, SwiperWrapper, FadeUp, AvatarSocialProof } from '@shared/components';
import { socialProofAvatars } from '@shared/data';

export type HeroSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function HeroSection({ lang, dict }: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-20 sm:pt-55 sm:pb-28">
      {/* Subtle Ambient Radial Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
        <div className="h-[480px] w-[800px] rounded-full bg-gradient-to-b from-persici-blush/25 via-persici-crimson/10 to-transparent blur-3xl opacity-70" />
      </div>

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Main Headline */}
        <FadeUp delay={0} duration={800} distance={28} blur={true}>
          <h1 className="font-primary text-5xl font-extrabold leading-30 tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            {dict.hero.title}
          </h1>
        </FadeUp>

        {/* Subtitle */}
        <FadeUp delay={150} duration={800} distance={24}>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base lg:text-lg">
            {dict.hero.subtitle}
          </p>
        </FadeUp>

        {/* CTA & Rating Row */}
        <FadeUp delay={300} duration={800} distance={20}>
          <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
            <HomeButton
              href={`/${lang}/contact`}
              title={dict.hero.cta}
              className="bg-persici-crimson text-white"
              currentLang={lang}
              isLangEffectIcon={true}
            />

            {/* Rating / Avatar Social Proof */}
            <AvatarSocialProof
              avatars={socialProofAvatars}
              ratingLabel={dict.hero.ratingLabel}
              size="lg"
              starsClassName="text-xl"
            />
          </div>
        </FadeUp>
      </div>

      {/* Animated Infinite Client Logos Marquee */}
      <FadeUp delay={450} duration={800} distance={20}>
        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <SwiperWrapper title={dict.hero.trustedBy} />
        </div>
      </FadeUp>
    </section>
  );
}


