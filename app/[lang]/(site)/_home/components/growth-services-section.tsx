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
  content?: any;
};

export function GrowthServicesSection({ lang, dict, content }: GrowthServicesSectionProps) {
  const isArabic = lang === 'ar';
  const baseServices =
    (content?.services && content.services.length > 0)
      ? content.services
      : getHomeGrowthServices();

  const title =
    content?.title?.[lang] ||
    (isArabic
      ? (content?.titleAr || content?.growthServicesTitleAr)
      : (content?.titleEn || content?.growthServicesTitleEn)) ||
    content?.title ||
    dict.growthServices.title;

  const ratingText =
    content?.ratingText?.[lang] ||
    (isArabic ? content?.ratingTextAr : content?.ratingTextEn) ||
    content?.ratingText ||
    dict.hero.ratingLabel;

  const bannerText =
    content?.bannerText?.[lang] ||
    (isArabic
      ? (content?.bannerTextAr || content?.servicesBannerAr)
      : (content?.bannerTextEn || content?.servicesBannerEn)) ||
    content?.bannerText ||
    dict.growthServices.bannerText;

  const bannerCta =
    content?.bannerCtaText?.[lang] ||
    content?.bannerCta?.[lang] ||
    (isArabic ? content?.bannerCtaAr : content?.bannerCtaEn) ||
    content?.bannerCtaText ||
    dict.growthServices.bannerCta;

  const rawCtaHref = content?.bannerCtaHref || '/contact';
  const bannerCtaHref = rawCtaHref.startsWith(`/${lang}`)
    ? rawCtaHref
    : rawCtaHref.startsWith('/')
    ? `/${lang}${rawCtaHref}`
    : rawCtaHref;

  const bannerSecondaryCta =
    content?.bannerSecondaryCtaText?.[lang] ||
    content?.bannerSecondaryCta?.[lang] ||
    (isArabic ? content?.bannerSecondaryCtaAr : content?.bannerSecondaryCtaEn) ||
    (dict.growthServices as unknown as { bannerSecondaryCta?: string }).bannerSecondaryCta ||
    dict.nav.work;

  const rawSecondaryHref = content?.bannerSecondaryCtaHref || '/work';
  const bannerSecondaryHref = rawSecondaryHref.startsWith(`/${lang}`)
    ? rawSecondaryHref
    : rawSecondaryHref.startsWith('/')
    ? `/${lang}${rawSecondaryHref}`
    : rawSecondaryHref;

  const services = baseServices.map((svc: any) => {
    const dictData = svc.key && dict.growthServices[svc.key as keyof typeof dict.growthServices];
    const localized =
      typeof dictData === 'object' && dictData !== null
        ? (dictData as { tag?: string; title?: string; description?: string })
        : {};

    const dynamicTag =
      svc.tag?.[lang] ||
      (isArabic ? (svc.arSubService || svc.tagAr) : (svc.enSubService || svc.tagEn)) ||
      (typeof svc.tag === 'string' ? svc.tag : undefined);

    const dynamicTitle =
      svc.title?.[lang] ||
      (isArabic ? (svc.arTitle || svc.titleAr) : (svc.enTitle || svc.titleEn)) ||
      (typeof svc.title === 'string' ? svc.title : undefined);

    const dynamicDescription =
      svc.description?.[lang] ||
      (isArabic ? (svc.arDescription || svc.descAr) : (svc.enDescription || svc.descEn)) ||
      (typeof svc.description === 'string' ? svc.description : undefined);

    const isFeatured = svc.isFeatured || svc.width === 'full';
    const effectiveWidth = isFeatured ? 'full' : (svc.width || '1/2');

    return {
      ...svc,
      isFeatured,
      width: effectiveWidth,
      tag: dynamicTag || localized.tag || (isArabic ? svc.arSubService || svc.enSubService || '' : svc.enSubService || ''),
      title: dynamicTitle || localized.title || (isArabic ? svc.arTitle || svc.enTitle || '' : svc.enTitle || ''),
      description: dynamicDescription || localized.description || (isArabic ? svc.arDescription || svc.enDescription || '' : svc.enDescription || ''),
    };
  });

  // Sort so featured / full-width card is at the top of the section
  const sortedServices = [...services].sort((a: any, b: any) => {
    const aFeatured = Boolean(a.isFeatured || a.width === 'full');
    const bFeatured = Boolean(b.isFeatured || b.width === 'full');
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    return (a.order ?? 0) - (b.order ?? 0);
  });

  return (
    <section className={`${sectionContainer} ${sectionPaddingY}`}>
      {/* Header Row */}
      <FadeUp delay={0} duration={750} distance={20}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className={sectionHeading}>
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <AvatarSocialProof
              avatars={socialProofAvatars}
              ratingLabel={ratingText}
              size="lg"
              starsClassName="text-xl"
            />
          </div>
        </div>
      </FadeUp>

      {/* Dynamic Growth Service Cards Grid driven by each service's width attribute */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {sortedServices.map((svc: any, index: number) => (
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
          <p className="font-primary text-base font-semibold text-foreground sm:text-lg">
            {bannerText}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <HomeButton
              href={bannerSecondaryHref}
              title={bannerSecondaryCta}
              className="border border-black/15 bg-light/30 text-dark"
              iconClassName="bg-dark text-light"
              currentLang={lang}
              isLangEffectIcon={true}
            />
            <HomeButton
              href={bannerCtaHref}
              title={bannerCta}
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
