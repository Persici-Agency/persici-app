import type { Dictionary } from '@dictionaries';
import {
  sectionContainer,
  sectionHeading,
  HomeButton,
  FadeUp,
  AvatarSocialProof,
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

  const paidSocial = services.find((s) => s.key === 'paidSocial') || services[0];
  const googleAds = services.find((s) => s.key === 'googleAds') || services[1];
  const shopify = services.find((s) => s.key === 'shopify') || services[2];

  return (
    <section className={`${sectionContainer} py-16`}>
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

      {/* Growth Services Cards Grid (2 Top + 1 Full-Width Bottom) */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Card 1: Paid Social */}
        {paidSocial && (
          <FadeUp delay={100} duration={750} distance={24} className="h-full">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition-all duration-300 hover:border-persici-crimson/30 hover:shadow-xl sm:p-10">
              <div>
                {/* Platform Badges: Meta, TikTok, Snapchat */}
                <div className="flex items-center gap-2.5">
                  {/* Meta Badge */}
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#0866FF] shadow-xs transition-transform hover:scale-105"
                    title="Meta"
                  >
                    <svg className="h-5 w-5 fill-[#0866FF]" viewBox="0 0 24 24">
                      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                    </svg>
                  </div>

                  {/* TikTok Badge */}
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEECEC] text-black shadow-xs transition-transform hover:scale-105"
                    title="TikTok"
                  >
                    <svg className="h-5 w-5 fill-black" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.9c0 1.94-.53 3.93-1.66 5.51-1.42 1.99-3.79 3.25-6.26 3.29-2.72.04-5.38-1.28-6.9-3.52-1.5-2.22-1.66-5.18-.41-7.55 1.23-2.33 3.66-3.88 6.29-3.95.4-.01.81 0 1.21.05v4.1c-.34-.08-.7-.11-1.05-.09-1.24.06-2.42.75-2.99 1.85-.58 1.11-.47 2.52.26 3.52.73.99 1.99 1.53 3.22 1.41 1.26-.12 2.37-.99 2.75-2.2.14-.46.2-.94.2-1.42V.02z" />
                    </svg>
                  </div>

                  {/* Snapchat Badge */}
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF9CC] text-black shadow-xs transition-transform hover:scale-105"
                    title="Snapchat"
                  >
                    <svg className="h-5 w-5 fill-black" viewBox="0 0 24 24">
                      <path d="M12 2.5c-3.9 0-6.1 2.8-6.1 5.8 0 1.4.6 2.7 1.2 3.6-.3.6-.8 1.2-1.5 1.5-.4.2-.6.5-.4.8.2.3.6.4 1 .3.7-.1 1.4-.4 2-.8.8.5 1.8.8 2.8.8s2-.3 2.8-.8c.6.4 1.3.7 2 .8.4.1.8 0 1-.3.2-.3 0-.6-.4-.8-.7-.3-1.2-.9-1.5-1.5.6-.9 1.2-2.2 1.2-3.6 0-3-2.2-5.8-6.1-5.8zm-1.8 14.7c-.5.3-1.1.5-1.7.5-.4 0-.8-.1-1.2-.2-.5-.1-.9.1-1.1.5-.2.4 0 .9.4 1.1.7.4 1.5.6 2.3.5.7 0 1.4-.2 2-.5.5-.3.8-.8.6-1.4-.2-.4-.7-.6-1.3-.5zm3.6 0c-.6-.1-1.1.1-1.3.5-.2.6.1 1.1.6 1.4.6.3 1.3.5 2 .5.8.1 1.6-.1 2.3-.5.4-.2.6-.7.4-1.1-.2-.4-.6-.6-1.1-.5-.4.1-.8.2-1.2.2-.6 0-1.2-.2-1.7-.5z" />
                    </svg>
                  </div>
                </div>

                <h3 className="mt-6 font-primary text-2xl font-bold text-foreground sm:text-3xl">
                  {paidSocial.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base">
                  {paidSocial.description}
                </p>
              </div>
            </div>
          </FadeUp>
        )}

        {/* Card 2: Google Ads */}
        {googleAds && (
          <FadeUp delay={200} duration={750} distance={24} className="h-full">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition-all duration-300 hover:border-persici-crimson/30 hover:shadow-xl sm:p-10">
              <div>
                {/* Google Ads Badge */}
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] shadow-xs transition-transform hover:scale-105"
                  title="Google Ads"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M12.2 2.5a3.8 3.8 0 00-5.3.7L2.7 9.8a3.8 3.8 0 00.7 5.3 3.8 3.8 0 005.3-.7l4.2-6.6a3.8 3.8 0 00-.7-5.3z"
                    />
                    <path
                      fill="#FBBC04"
                      d="M21.3 14.2l-4.2-6.6a3.8 3.8 0 00-5.3-.7 3.8 3.8 0 00-.7 5.3l4.2 6.6a3.8 3.8 0 005.3.7 3.8 3.8 0 00.7-5.3z"
                    />
                    <circle fill="#34A853" cx="5.4" cy="18.6" r="3.4" />
                  </svg>
                </div>

                <h3 className="mt-6 font-primary text-2xl font-bold text-foreground sm:text-3xl">
                  {googleAds.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base">
                  {googleAds.description}
                </p>
              </div>
            </div>
          </FadeUp>
        )}

        {/* Card 3: Shopify (Full-Width Bottom Card) */}
        {shopify && (
          <FadeUp delay={300} duration={750} distance={24} className="h-full md:col-span-2">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition-all duration-300 hover:border-persici-crimson/30 hover:shadow-xl sm:p-10">
              <div>
                {/* Shopify Badge */}
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7EE] shadow-xs transition-transform hover:scale-105"
                  title="Shopify"
                >
                  <svg className="h-6 w-6 fill-[#95BF47]" viewBox="0 0 24 24">
                    <path d="M19.5 7.2l-3.2-1c-.1 0-.3 0-.4.1l-1.3 1.3c-.2.2-.5.3-.8.2L9.2 6.4c-.3-.1-.6.1-.7.3L5 14.5c-.1.2 0 .5.2.6l9.6 4.6c.2.1.5 0 .6-.2l4.3-11.8c.1-.2 0-.4-.2-.5zM12 4.5c.8 0 1.5.7 1.5 1.5v.5l-3-.9V6c0-.8.7-1.5 1.5-1.5z" />
                    <path d="M14.5 10.3l-1.8 5.4c-.1.3-.4.5-.7.5-.1 0-.2 0-.3-.1l-1.5-.7-1.4 1.3c-.2.2-.5.2-.7.1-.2-.1-.3-.3-.3-.5v-4.8l-1.7-.8c-.3-.1-.4-.4-.3-.7.1-.3.4-.4.7-.3l7 3.3c.3.1.4.4.3.7-.1.2-.3.4-.6.4z" />
                  </svg>
                </div>

                <h3 className="mt-6 font-primary text-2xl font-bold text-foreground sm:text-3xl">
                  {shopify.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base">
                  {shopify.description}
                </p>
              </div>
            </div>
          </FadeUp>
        )}
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
