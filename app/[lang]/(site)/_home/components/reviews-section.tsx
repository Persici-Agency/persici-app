import type { Dictionary } from '@dictionaries';
import { sectionContainer, sectionPaddingY, sectionHeading, bannerStrip, HomeButton, FadeUp, SwiperWrapper, cn } from '@shared';
import { getHomeReviews } from '../services';
import type { ReviewItem } from '@shared/types';

export type ReviewsSectionProps = {
  lang: string;
  dict: Dictionary;
  content?: Record<string, unknown>;
  reviews?: ReviewItem[];
};

export function ReviewsSection({ lang, dict, content, reviews: customReviews }: ReviewsSectionProps) {
  const isAr = lang === 'ar';
  const contentReviews = content?.reviews as ReviewItem[] | undefined;
  const baseReviews =
    (contentReviews && contentReviews.length > 0)
      ? contentReviews
      : (customReviews && customReviews.length > 0)
        ? customReviews
        : getHomeReviews();

  const score = (content?.score as string | undefined) || '5.0';
  const scoreLabelObj = content?.scoreLabel as Record<string, string> | string | undefined;
  const scoreLabel =
    (typeof scoreLabelObj === 'object' ? scoreLabelObj[lang] : scoreLabelObj) ||
    (isAr ? (content?.scoreLabelAr as string || content?.reviewsScoreTextAr as string) : (content?.scoreLabelEn as string || content?.reviewsScoreTextEn as string)) ||
    dict.reviews.scoreLabel;

  const titleObj = content?.title as Record<string, string> | string | undefined;
  const title =
    (typeof titleObj === 'object' ? titleObj[lang] : titleObj) ||
    (isAr ? (content?.titleAr as string) : (content?.titleEn as string)) ||
    dict.reviews.title;

  const bannerTextObj = content?.bannerText as Record<string, string> | string | undefined;
  const bannerText =
    (typeof bannerTextObj === 'object' ? bannerTextObj[lang] : bannerTextObj) ||
    (isAr ? (content?.bannerTextAr as string) : (content?.bannerTextEn as string)) ||
    dict.reviews.bannerText;

  const bannerCtaObj = (content?.bannerCtaText || content?.bannerCta) as Record<string, string> | string | undefined;
  const bannerCta =
    (typeof bannerCtaObj === 'object' ? bannerCtaObj[lang] : bannerCtaObj) ||
    (isAr ? (content?.bannerCtaAr as string) : (content?.bannerCtaEn as string)) ||
    dict.reviews.bannerCta;

  const rawCtaHref = (content?.bannerCtaHref as string) || '/contact';
  const bannerCtaHref = rawCtaHref.startsWith(`/${lang}`)
    ? rawCtaHref
    : rawCtaHref.startsWith('/')
      ? `/${lang}${rawCtaHref}`
      : rawCtaHref;

  const reviewsList: ReviewItem[] = baseReviews.map((rev: ReviewItem, index: number) => {
    const dictKey = `r${index + 1}` as keyof typeof dict.reviews;
    const localized = (dict.reviews[dictKey] || {}) as Partial<ReviewItem>;

    const name =
      (isAr
        ? (rev.nameAr || (typeof rev.name === 'object' ? rev.name?.ar : '') || localized.name || rev.nameEn || (typeof rev.name === 'string' ? rev.name : ''))
        : (rev.nameEn || (typeof rev.name === 'object' ? rev.name?.en : '') || (typeof rev.name === 'string' ? rev.name : '') || localized.name || rev.nameAr)
      );

    const role =
      (isAr
        ? (rev.roleAr || (typeof rev.role === 'object' ? rev.role?.ar : '') || localized.role || rev.roleEn || (typeof rev.role === 'string' ? rev.role : ''))
        : (rev.roleEn || (typeof rev.role === 'object' ? rev.role?.en : '') || (typeof rev.role === 'string' ? rev.role : '') || localized.role || rev.roleAr)
      );

    const company =
      (isAr
        ? (rev.companyAr || (typeof rev.company === 'object' ? rev.company?.ar : '') || localized.company || rev.companyEn || (typeof rev.company === 'string' ? rev.company : ''))
        : (rev.companyEn || (typeof rev.company === 'object' ? rev.company?.en : '') || (typeof rev.company === 'string' ? rev.company : '') || localized.company || rev.companyAr)
      );

    const review =
      (isAr
        ? (rev.reviewAr || (typeof rev.review === 'object' ? rev.review?.ar : '') || localized.review || rev.reviewEn || (typeof rev.review === 'string' ? rev.review : ''))
        : (rev.reviewEn || (typeof rev.review === 'object' ? rev.review?.en : '') || (typeof rev.review === 'string' ? rev.review : '') || localized.review || rev.reviewAr)
      );

    const verified =
      (isAr
        ? (rev.verifiedAr || (typeof rev.verified === 'object' ? rev.verified?.ar : '') || localized.verified || rev.verifiedEn || (typeof rev.verified === 'string' ? rev.verified : '') || 'عميل موثق')
        : (rev.verifiedEn || (typeof rev.verified === 'object' ? rev.verified?.en : '') || (typeof rev.verified === 'string' ? rev.verified : '') || localized.verified || 'Verified Client')
      );

    return {
      ...rev,
      id: rev.id || `rev-${index}`,
      name: name || '',
      role: role || '',
      company: company || '',
      review: review || '',
      verified: verified || '',
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

    const resolvedName = (typeof rev.name === 'string' ? rev.name : (isAr ? rev.name?.ar : rev.name?.en)) || '';
    const resolvedRole = (typeof rev.role === 'string' ? rev.role : (isAr ? rev.role?.ar : rev.role?.en)) || '';
    const resolvedCompany = (typeof rev.company === 'string' ? rev.company : (isAr ? rev.company?.ar : rev.company?.en)) || '';
    const resolvedReview = (typeof rev.review === 'string' ? rev.review : (isAr ? rev.review?.ar : rev.review?.en)) || '';
    const resolvedVerified = (typeof rev.verified === 'string' ? rev.verified : (isAr ? rev.verified?.ar : rev.verified?.en)) || '';

    return (
      <div
        key={rev.id || resolvedName}
        dir={isAr ? 'rtl' : 'ltr'}
        className="group flex h-[240px] w-[310px] sm:h-[250px] sm:w-[380px] md:h-[260px] md:w-[420px] flex-col justify-between rounded-3xl bg-white p-6 shadow-xs transition-all duration-300 hover:border-black/20 hover:shadow-lg text-start select-none"
      >
        <div>
          {/* Author Details */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-primary text-sm sm:text-base font-medium text-foreground tracking-tight">
                {resolvedName}
              </h4>
              <p className="text-xs font-medium text-foreground/60 mt-0.5">
                {resolvedRole ? `${resolvedRole} • ${resolvedCompany}` : resolvedCompany}
              </p>
            </div>
            {resolvedVerified && (
              <span className="rounded-full bg-black/5 px-2 py-0.5 text-[9.5px] font-medium text-foreground/60 shrink-0">
                {resolvedVerified}
              </span>
            )}
          </div>

          {/* Review Quote */}
          <blockquote className="mt-3.5 text-xs sm:text-sm leading-relaxed text-foreground/80 font-normal line-clamp-4">
            &ldquo;{resolvedReview}&rdquo;
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

