import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { HomeButton, ClientLogosMarquee, FadeUp } from '@shared/components';

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
              className="bg-persici-crimson text-white shadow-lg shadow-persici-crimson/25 px-7 py-3.5 sm:text-sm"
              currentLang={lang}
              isLangEffectIcon={true}
            />

            {/* Rating / Avatar Social Proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Client avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                    alt="Client avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                    alt="Client avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                    alt="Client avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="text-start">
                <div className="flex items-center text-amber-500 text-xs">
                  {'★★★★★'}
                </div>
                <span className="text-[11px] font-medium text-foreground/70">
                  {dict.hero.ratingLabel}
                </span>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* Animated Infinite Client Logos Marquee */}
      <FadeUp delay={450} duration={800} distance={20}>
        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <ClientLogosMarquee title={dict.hero.trustedBy} />
        </div>
      </FadeUp>
    </section>
  );
}


