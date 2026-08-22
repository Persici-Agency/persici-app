import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { sectionContainer, sectionPaddingY, HomeButton, FadeUp } from '@shared';
import { getHomeApproachTeam } from '../services';

export type ApproachSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function ApproachSection({ lang, dict }: ApproachSectionProps) {
  const teamAvatars = getHomeApproachTeam();

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
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt="Persici eCommerce growth team"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Floating "Team Persici / Your team of specialists" Card with Avatar Stack */}
          <div className="absolute bottom-4 sm:bottom-6 start-4 sm:start-6 end-4 sm:end-6 rounded-2xl sm:rounded-3xl border border-black/10 bg-white/95 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col gap-3">
              <div>
                <span className="block text-[11px] font-semibold tracking-wider uppercase text-persici-crimson">
                  {dict.approach.teamBadgeLabel || 'Team Persici'}
                </span>
                <h4 className="font-primary text-sm sm:text-base font-bold text-foreground mt-0.5">
                  {dict.approach.teamBadgeTitle || 'Your team of specialists'}
                </h4>
              </div>

              {/* Stacked Specialist Avatars Row */}
              <div className="flex items-center justify-center -space-x-2 rtl:space-x-reverse overflow-hidden pt-0.5">
                {teamAvatars.map((member, idx) => (
                  <div
                    key={member.id || idx}
                    className="group relative h-8 w-8 sm:h-13 sm:w-13 shrink-0 overflow-hidden rounded-full border-3 border-white bg-white shadow-xs transition-transform duration-300 hover:scale-115 hover:z-20 cursor-pointer"
                    title={member.role ? `${member.name ? member.name + ' - ' : ''}${member.role}` : member.alt || `Specialist ${idx + 1}`}
                  >
                    <Image
                      src={member.avatar}
                      alt={member.alt || member.name || `Specialist avatar ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Right Column: Approach Copy & CTAs */}
        <FadeUp delay={200} duration={800} distance={24} className="relative lg:col-span-6">
          <h2 className="font-primary text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.15]">
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
              className="bg-persici-crimson text-white px-7 py-3 text-sm font-semibold"
              iconClassName="bg-white text-persici-crimson"
              currentLang={lang}
              isLangEffectIcon={true}
            />
            <HomeButton
              href={`/${lang}/about`}
              title={dict.approach.ctaSecondary}
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

