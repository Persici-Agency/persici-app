import type { Dictionary } from '@dictionaries';
import { sectionContainer, sectionHeading, featureCard, bannerStrip, HomeButton, FadeUp } from '@shared';

export type GrowthServicesSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function GrowthServicesSection({ lang, dict }: GrowthServicesSectionProps) {
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
        {/* Card 1: Paid Social */}
        <FadeUp delay={100} duration={750} distance={24} className="h-full">
          <div className={`h-full ${featureCard}`}>
            <div className="flex items-center gap-2 text-xs font-semibold text-persici-crimson">
              <span className="inline-block h-2 w-2 rounded-full bg-persici-crimson" />
              {dict.growthServices.paidSocial.tag}
            </div>
            <h3 className="mt-4 font-primary text-xl font-bold text-foreground">
              {dict.growthServices.paidSocial.title}
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-foreground/70 sm:text-sm">
              {dict.growthServices.paidSocial.description}
            </p>
          </div>
        </FadeUp>

        {/* Card 2: Google Ads */}
        <FadeUp delay={220} duration={750} distance={24} className="h-full">
          <div className={`h-full ${featureCard}`}>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
              {dict.growthServices.googleAds.tag}
            </div>
            <h3 className="mt-4 font-primary text-xl font-bold text-foreground">
              {dict.growthServices.googleAds.title}
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-foreground/70 sm:text-sm">
              {dict.growthServices.googleAds.description}
            </p>
          </div>
        </FadeUp>

        {/* Card 3: Shopify & CRO */}
        <FadeUp delay={340} duration={750} distance={24} className="h-full">
          <div className={`h-full ${featureCard}`}>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              {dict.growthServices.shopify.tag}
            </div>
            <h3 className="mt-4 font-primary text-xl font-bold text-foreground">
              {dict.growthServices.shopify.title}
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-foreground/70 sm:text-sm">
              {dict.growthServices.shopify.description}
            </p>
          </div>
        </FadeUp>
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
            className="bg-persici-black text-white px-5 py-2.5 text-xs"
            currentLang={lang}
            isLangEffectIcon={true}
          />
        </div>
      </FadeUp>
    </section>
  );
}


