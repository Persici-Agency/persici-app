import type { Dictionary } from '@dictionaries';
import {
  sectionContainer,
  sectionPaddingY,
  sectionHeading,
  HomeButton,
  FadeUp,
  AvatarSocialProof,
  GrowthServiceCard,
  socialProofAvatars,
} from '@shared';
import { getHomeGrowthServices } from '../services';

export type GrowthServicesSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function GrowthServicesSection({ lang, dict }: GrowthServicesSectionProps) {
  const baseServices = getHomeGrowthServices();

  const services = baseServices.map((svc) => {
    const dictData = svc.key && dict.growthServices[svc.key as keyof typeof dict.growthServices];
    const localized =
      typeof dictData === 'object' && dictData !== null
        ? (dictData as { tag?: string; title?: string; description?: string })
        : {};
    return {
      ...svc,
      tag: localized.tag || svc.tag,
      title: localized.title || svc.title,
      description: localized.description || svc.description,
    };
  });

  return (
    <section className={`${sectionContainer} ${sectionPaddingY}`}>
      {/* Header Row */}
      <FadeUp delay={0} duration={750} distance={20}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className={sectionHeading}>
              {dict.growthServices.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <AvatarSocialProof
              avatars={socialProofAvatars}
              ratingLabel={dict.hero.ratingLabel}
              size="lg"
              starsClassName="text-xl"
            />
          </div>
        </div>
      </FadeUp>

      {/* Dynamic Growth Service Cards Grid driven by each service's width attribute */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {services.map((svc, index) => (
          <GrowthServiceCard
            key={svc.id || index}
            title={svc.title}
            description={svc.description}
            platforms={svc.platforms}
            width={svc.width}
            iconColor={svc.iconColor}
            iconBg={svc.iconBg}
            tag={svc.tag}
            tagColor={svc.tagColor}
            dotColor={svc.dotColor}
            delay={100 + index * 100}
          />
        ))}
      </div>

      {/* Bottom Banner Strip with Dual Action Buttons */}
      <FadeUp delay={450} duration={750} distance={20}>
        <div className="mt-8 flex flex-col items-center justify-between gap-6 rounded-3xl border border-black/10 bg-persici-black/[0.02] p-6 sm:px-8 sm:py-6 shadow-sm md:flex-row">
          <p className="font-primary text-base font-bold text-foreground sm:text-lg">
            {dict.growthServices.bannerText}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <HomeButton
              href={`/${lang}/work`}
              title={
                (dict.growthServices as unknown as { bannerSecondaryCta?: string })
                  .bannerSecondaryCta || dict.nav.work
              }
              className="border border-black/15 bg-light/30 text-dark"
              iconClassName="bg-dark text-light"
              currentLang={lang}
              isLangEffectIcon={true}
            />
            <HomeButton
              href={`/${lang}/contact`}
              title={dict.growthServices.bannerCta}
              className="bg-persici-crimson text-white shadow-md shadow-persici-crimson/25"
              currentLang={lang}
              isLangEffectIcon={true}
            />
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
