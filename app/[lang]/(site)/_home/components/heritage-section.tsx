import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { sectionContainer, HomeButton, FadeUp } from '@shared';
import { getHomeHeritageCollage } from '../services';

export type HeritageSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function HeritageSection({ lang, dict }: HeritageSectionProps) {
  const collage = getHomeHeritageCollage();

  return (
    <section className={`relative ${sectionContainer} py-20`}>
      {/* Geometric Angular Background Accent */}
      <div className="pointer-events-none absolute inset-y-0 start-0 -z-10 w-1/2 opacity-30">
        <div className="h-full w-full bg-[radial-gradient(#d83427_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left Column: Copy & CTAs */}
        <FadeUp delay={0} duration={800} distance={24} className="lg:col-span-6">
          <h2 className="font-primary text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {dict.heritage.title}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-foreground/75 sm:text-base">
            {dict.heritage.desc1}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base">
            {dict.heritage.desc2}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <HomeButton
              href={`/${lang}/contact`}
              title={dict.heritage.ctaPrimary}
              className="bg-persici-crimson text-white"
              currentLang={lang}
              isLangEffectIcon={true}
            />
            <HomeButton
              href={`/${lang}/about`}
              title={dict.heritage.ctaSecondary}
              className="border border-black/15 bg-dark/5 text-dark"
              iconClassName="bg-dark text-light"
              currentLang={lang}
              isLangEffectIcon={true}
            />
          </div>
        </FadeUp>

        {/* Right Column: 3-Photo Collage Grid with Central Badge */}
        <FadeUp delay={200} duration={800} distance={28} className="relative lg:col-span-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Top Wide Photo */}
            {collage[0] && (
              <div className="col-span-2 relative aspect-[16/9] overflow-hidden rounded-3xl border border-black/5 shadow-md">
                <Image
                  src={collage[0].src}
                  alt={collage[0].alt}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Bottom Photos */}
            {collage.slice(1, 3).map((item) => (
              <div
                key={item.id || item.src}
                className="relative aspect-square overflow-hidden rounded-3xl border border-black/5 shadow-md"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Central Floating Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-persici-crimson text-white shadow-xl shadow-persici-crimson/30 border-4 border-white transition-transform duration-500 hover:scale-110">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
