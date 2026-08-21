import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { sectionContainer, HomeButton, FadeUp } from '@shared';

export type ApproachSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function ApproachSection({ lang, dict }: ApproachSectionProps) {
  return (
    <section className={`${sectionContainer} py-20`}>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left Column: Team Image with Floating Badge */}
        <FadeUp delay={0} duration={800} distance={28} className="relative lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-black/5 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
              alt="Persici growth team"
              fill
              className="object-cover"
            />
          </div>

          {/* Floating "Your Dedicated Growth Team" Badge */}
          <div className="absolute -bottom-6 inset-x-6 rounded-2xl border border-black/10 bg-white/95 p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-primary text-xs font-bold text-foreground">
                  {dict.approach.teamBadgeTitle}
                </h4>
                <p className="text-[10px] text-foreground/60">
                  {dict.approach.teamBadgeSubtitle}
                </p>
              </div>
              <div className="flex -space-x-1.5 rtl:space-x-reverse">
                <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Team avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                    alt="Team avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                    alt="Team avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Right Column: Approach Copy & CTAs */}
        <FadeUp delay={200} duration={800} distance={24} className="mt-8 lg:mt-0 lg:col-span-6">
          <h2 className="font-primary text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {dict.approach.title}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-foreground/75 sm:text-base">
            {dict.approach.desc1}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base">
            {dict.approach.desc2}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <HomeButton
              href={`/${lang}/contact`}
              title={dict.approach.ctaPrimary}
              className="bg-persici-crimson text-white shadow-md shadow-persici-crimson/25 px-6 py-3 text-xs"
              currentLang={lang}
              isLangEffectIcon={true}
            />
            <HomeButton
              href={`/${lang}/work`}
              title={dict.approach.ctaSecondary}
              className="border border-black/15 bg-white/60 text-foreground px-6 py-3 text-xs"
              iconClassName="bg-black/10 text-black"
              currentLang={lang}
              isLangEffectIcon={true}
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}


