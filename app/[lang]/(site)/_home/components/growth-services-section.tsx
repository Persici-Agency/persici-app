import type { Dictionary } from '@dictionaries';
import { sectionContainer, sectionHeading, featureCard, bannerStrip, HomeButton, FadeUp } from '@shared';
import { getHomeGrowthServices } from '../services';

export type GrowthServicesSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function GrowthServicesSection({ lang, dict }: GrowthServicesSectionProps) {
  const baseServices = getHomeGrowthServices();

  const services = baseServices.map((svc) => {
    const dictData = svc.key && dict.growthServices[svc.key as keyof typeof dict.growthServices];
    const localized = typeof dictData === 'object' && dictData !== null ? dictData as { tag?: string; title?: string; description?: string } : {};
    return {
      ...svc,
      tag: localized.tag || svc.tag,
      title: localized.title || svc.title,
      description: localized.description || svc.description,
    };
  });

  return (
    <section className={`${sectionContainer} py-16`}>
      <FadeUp delay={0} duration={750} distance={20}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className={sectionHeading}>
              {dict.growthServices.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500 text-sm">{'★★★★★'}</div>
            <span className="text-xs font-semibold text-foreground/70">
              {dict.growthServices.rating}
            </span>
          </div>
        </div>
      </FadeUp>

      {/* 3 Service Cards */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {services.map((svc, index) => (
          <FadeUp key={svc.id || index} delay={100 + index * 120} duration={750} distance={24} className="h-full">
            <div className={`h-full ${featureCard}`}>
              <div className={`flex items-center gap-2 text-xs font-semibold ${svc.tagColor || 'text-persici-crimson'}`}>
                <span className={`inline-block h-2 w-2 rounded-full ${svc.dotColor || 'bg-persici-crimson'}`} />
                {svc.tag}
              </div>
              <h3 className="mt-4 font-primary text-xl font-bold text-foreground">
                {svc.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-foreground/70 sm:text-sm">
                {svc.description}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Bottom Banner Strip */}
      <FadeUp delay={450} duration={750} distance={20}>
        <div className={`mt-8 ${bannerStrip}`}>
          <p className="font-primary text-sm font-semibold text-foreground">
            {dict.growthServices.bannerText}
          </p>
          <HomeButton
            href={`/${lang}/contact`}
            title={dict.growthServices.bannerCta}
            currentLang={lang}
            isLangEffectIcon={true}
          />
        </div>
      </FadeUp>
    </section>
  );
}
