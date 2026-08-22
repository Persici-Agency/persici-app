import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { sectionContainer, sectionPaddingY, HomeButton, FadeUp, sectionHeading } from '@shared';
import { getHomeHeritageCollage } from '../services';

export type HeritageSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function HeritageSection({ lang, dict }: HeritageSectionProps) {
  const collage = getHomeHeritageCollage();

  return (
    <section className={`relative ${sectionContainer} ${sectionPaddingY}`}>
      {/* Geometric Angular Background Accent */}
      <div className="pointer-events-none absolute inset-y-0 start-0 -z-10 w-1/2 opacity-30">
        <div className="h-full w-full bg-[radial-gradient(#d83427_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left Column: Copy & CTAs */}
        <FadeUp delay={0} duration={800} distance={24} className="lg:col-span-6">
          <h2 className={sectionHeading}>
            {dict.heritage.title}
          </h2>
          <p className="pt-5 mt-6 text-sm leading-relaxed text-foreground/75 sm:text-base">
            {dict.heritage.desc1}
          </p>
          <p className="p-2 mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base">
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
              className="border border-black/15 bg-light/30 text-dark"
              iconClassName="bg-dark text-light"
              currentLang={lang}
              isLangEffectIcon={true}
            />
          </div>
        </FadeUp>

        {/* Right Column: 3-Photo Collage Grid with Central Brand Badge */}
        <FadeUp delay={200} duration={800} distance={28} className="relative lg:col-span-6">
          <div className="relative grid grid-cols-2 gap-3.5 sm:gap-4.5">
            {/* Top Wide Photo */}
            {collage[0] && (
              <div className="col-span-2 relative aspect-[16/9] sm:aspect-[16/8.5] overflow-hidden rounded-2xl sm:rounded-3xl border border-black/5 shadow-md">
                <Image
                  src={collage[0].src}
                  alt={collage[0].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}

            {/* Bottom Left & Right Photos */}
            {collage.slice(1, 3).map((item, idx) => (
              <div
                key={item.id || item.src || idx}
                className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl sm:rounded-3xl border border-black/5 shadow-md"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}

            {/* Central Floating Brand Badge */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-16 w-16 sm:h-20 sm:w-20 md:h-22 md:w-22 items-center justify-center rounded-full border-[6px] sm:border-[8px] border-white bg-persici-crimson transition-transform duration-500 hover:scale-110"
              aria-hidden="true"
            >
              <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                <svg viewBox="0 0 100 100" fill="none" className="h-full w-full">
                  <circle cx="38" cy="52" r="32" fill="#EF8C7D" />
                  <circle cx="58" cy="46" r="34" fill="#FFFFFF" />
                </svg>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
