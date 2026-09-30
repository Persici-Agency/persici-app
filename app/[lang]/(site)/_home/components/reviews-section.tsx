import type { Dictionary } from '@dictionaries';
import { sectionContainer, sectionPaddingY, sectionHeading, bannerStrip, HomeButton, FadeUp, SwiperWrapper, cn } from '@shared';
import { getHomeReviews } from '../services';
import type { ReviewItem } from '@shared/types';

export type ReviewsSectionProps = {
  lang: string;
  dict: Dictionary;
  content?: any;
  reviews?: ReviewItem[];
};

export function ReviewsSection({ lang, dict, content, reviews: customReviews }: ReviewsSectionProps) {
  const isAr = lang === 'ar';
  const baseReviews =
    (content?.reviews && content.reviews.length > 0)
      ? content.reviews
      : customReviews || getHomeReviews();

  const score = content?.score || '5.0';
  const scoreLabel =
    content?.scoreLabel?.[lang] ||
    (isAr ? (content?.scoreLabelAr || content?.reviewsScoreTextAr) : (content?.scoreLabelEn || content?.reviewsScoreTextEn)) ||
    content?.scoreLabel ||
    dict.reviews.scoreLabel;

  const title =
    content?.title?.[lang] ||
    (isAr ? content?.titleAr : content?.titleEn) ||
    content?.title ||
    dict.reviews.title;

  const bannerText =
    content?.bannerText?.[lang] ||
    (isAr ? content?.bannerTextAr : content?.bannerTextEn) ||
    content?.bannerText ||
    dict.reviews.bannerText;

  const bannerCta =
    content?.bannerCtaText?.[lang] ||
    content?.bannerCta?.[lang] ||
    (isAr ? content?.bannerCtaAr : content?.bannerCtaEn) ||
    content?.bannerCtaText ||
    dict.reviews.bannerCta;

  const rawCtaHref = content?.bannerCtaHref || '/contact';
  const bannerCtaHref = rawCtaHref.startsWith(`/${lang}`)
    ? rawCtaHref
    : rawCtaHref.startsWith('/')
    ? `/${lang}${rawCtaHref}`
    : rawCtaHref;

  const reviewsList: ReviewItem[] = baseReviews.map((rev: any, index: number) => {
    const dictKey = `r${index + 1}` as keyof typeof dict.reviews;
    const localized = (dict.reviews[dictKey] || {}) as Partial<ReviewItem>;

    const name =
      rev.name?.[isAr ? 'ar' : 'en'] ||
      (isAr ? rev.nameAr : rev.nameEn) ||
      rev.name ||
      localized.name;

    const role =
      rev.role?.[isAr ? 'ar' : 'en'] ||
      (isAr ? rev.roleAr : rev.roleEn) ||
      rev.role ||
      localized.role;

    const company =
      rev.company?.[isAr ? 'ar' : 'en'] ||
      (isAr ? rev.companyAr : rev.companyEn) ||
      rev.company ||
      localized.company;

    const review =
      rev.review?.[isAr ? 'ar' : 'en'] ||
      (isAr ? rev.reviewAr : rev.reviewEn) ||
      rev.review ||
      localized.review;

    const verified =
      rev.verified?.[isAr ? 'ar' : 'en'] ||
      (isAr ? rev.verifiedAr : rev.verifiedEn) ||
      rev.verified ||
      localized.verified;

    return {
      ...rev,
      id: rev.id || `rev-${index}`,
      name,
      role,
      company,
      review,
      verified,
    };
  });

  const mid = Math.ceil(reviewsList.length / 2);
  const row1Reviews = reviewsList.length > 2 ? reviewsList.slice(0, mid) : reviewsList;
  const row2Reviews = reviewsList.length > 2 ? reviewsList.slice(mid) : [...reviewsList].reverse();

  const renderReviewCard = (rev: ReviewItem) => {
    const cardRating =
      typeof rev.rating === 'number'
        ? rev.rating
        : parseFloat(String(rev.rating || '')) || parseFloat(score) || 5.0;

    return (
      <div
        key={rev.id || rev.name}
        className="group flex h-[240px] w-[310px] sm:h-[250px] sm:w-[380px] md:h-[260px] md:w-[420px] flex-col justify-between rounded-3xl bg-white p-6 shadow-xs transition-all duration-300 hover:border-black/20 hover:shadow-lg text-start select-none"
      >
        <div>
          {/* Author Details */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-primary text-sm sm:text-base font-medium text-foreground tracking-tight">
                {rev.name}
              </h4>
              <p className="text-xs font-medium text-foreground/60 mt-0.5">
                {rev.role ? `${rev.role} • ${rev.company}` : rev.company}
              </p>
            </div>
            {rev.verified && (
              <span className="rounded-full bg-black/5 px-2 py-0.5 text-[9.5px] font-medium text-foreground/60 shrink-0">
                {rev.verified}
              </span>
            )}
          </div>

          {/* Review Quote */}
          <blockquote className="mt-3.5 text-xs sm:text-sm leading-relaxed text-foreground/80 font-normal line-clamp-4">
            &ldquo;{rev.review}&rdquo;
          </blockquote>
        </div>

        {/* 5 Dynamic Green Star Rating Blocks & Numeric Rating */}
        <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3.5">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const isFilled = cardRating >= i + 0.8;
              const isPartial = !isFilled && cardRating >= i + 0.3;
              return (
                <span
                  key={i}
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded text-[9.5px] transition-transform duration-200 group-hover:scale-105',
                    isFilled
                      ? 'bg-primary text-white shadow-2xs'
                      : isPartial
                      ? 'bg-primary/70 text-white'
                      : 'bg-black/5 text-black/30'
                  )}
                >
                  ★
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-primary">
            <span>★</span>
            <span>{cardRating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={`relative bg-persici-black/[0.02] ${sectionPaddingY} overflow-hidden`}>
      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={750} distance={20}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700">
              <span className="flex text-emerald-600">{'★★★★★'}</span>
              <span>{scoreLabel}</span>
            </div>
            <h2 className={`mt-4 ${sectionHeading}`}>
              {title}
            </h2>
          </div>
        </FadeUp>
      </div>

      {/* Dual Swiper / Marquee Rows with Edge Fade Gradients */}
      <div className={sectionContainer}>
        <div className="mt-12 w-full space-y-5 sm:space-y-6">
          {/* Row 1: Forward Direction */}
          <FadeUp delay={100} duration={800} distance={24}>
            <SwiperWrapper
              speed={55}
              direction="left"
              draggable={true}
              stopOnDrag={true}
              enableMomentum={true}
              friction={0.94}
              pauseOnHover={false}
              gap="md"
              fadeMask={true}
              fadeWidthClass="w-24 sm:w-44 md:w-64"
            >
              {row1Reviews.map((rev) => renderReviewCard(rev))}
            </SwiperWrapper>
          </FadeUp>

          {/* Row 2: Reverse Direction */}
          <FadeUp delay={200} duration={800} distance={24}>
            <SwiperWrapper
              speed={50}
              direction="right"
              draggable={true}
              stopOnDrag={true}
              enableMomentum={true}
              friction={0.94}
              pauseOnHover={false}
              gap="md"
              fadeMask={true}
              fadeWidthClass="w-24 sm:w-44 md:w-64"
            >
              {row2Reviews.map((rev) => renderReviewCard(rev))}
            </SwiperWrapper>
          </FadeUp>
        </div>
      </div>

      {/* Bottom Conversion Banner Strip */}
      <div className={sectionContainer}>
        <FadeUp delay={300} duration={750} distance={20}>
          <div className={`mt-12 sm:mt-16 ${bannerStrip}`}>
            <p className="font-primary text-sm font-semibold text-foreground">
              {bannerText}
            </p>
            <HomeButton
              href={bannerCtaHref}
              title={bannerCta}
              className="bg-persici-crimson text-white shadow-sm shadow-persici-crimson/20 px-7 py-3 text-sm font-semibold"
              iconClassName="bg-white text-persici-crimson"
              currentLang={lang}
              isLangEffectIcon={true}
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

