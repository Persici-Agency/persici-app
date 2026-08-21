import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { sectionContainer, HomeButton, FadeUp } from '@shared';

export type HeritageSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function HeritageSection({ lang, dict }: HeritageSectionProps) {
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
              className="bg-persici-crimson text-white shadow-md shadow-persici-crimson/25 px-6 py-3 text-xs"
              currentLang={lang}
              isLangEffectIcon={true}
            />
            <HomeButton
              href={`/${lang}/about`}
              title={dict.heritage.ctaSecondary}
              className="border border-black/15 bg-white/60 text-foreground px-6 py-3 text-xs"
              iconClassName="bg-black/10 text-black"
              currentLang={lang}
              isLangEffectIcon={true}
            />
          </div>
        </FadeUp>

        {/* Right Column: 3-Photo Collage Grid with Central Badge */}
        <FadeUp delay={200} duration={800} distance={28} className="relative lg:col-span-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Top Wide Photo */}
            <div className="col-span-2 relative aspect-[16/9] overflow-hidden rounded-3xl border border-black/5 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
                alt="Team strategy workshop"
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom Left Photo */}
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-black/5 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80"
                alt="Growth discussion"
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom Right Photo */}
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-black/5 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80"
                alt="Engineering & sprint review"
                fill
                className="object-cover"
              />
            </div>
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

