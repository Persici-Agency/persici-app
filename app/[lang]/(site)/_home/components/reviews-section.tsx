import type { Dictionary } from '@dictionaries';
import { sectionContainer, sectionPaddingY, sectionHeading, baseCard, bannerStrip, HomeButton, FadeUp } from '@shared';
import { getHomeReviews } from '../services';
import type { ReviewItem } from '@shared/types';

export type ReviewsSectionProps = {
  lang: string;
  dict: Dictionary;
  reviews?: ReviewItem[];
};

export function ReviewsSection({ lang, dict, reviews: customReviews }: ReviewsSectionProps) {
  const baseReviews = customReviews || getHomeReviews();

  const reviewsList = baseReviews.map((rev, index) => {
    const dictKey = `r${index + 1}` as keyof typeof dict.reviews;
    const localized = (dict.reviews[dictKey] || {}) as Partial<ReviewItem>;
    return {
      ...rev,
      name: localized.name || rev.name,
      company: localized.company || rev.company,
      review: localized.review || rev.review,
      verified: localized.verified || rev.verified,
    };
  });

  return (
    <section className={`bg-persici-black/[0.02] ${sectionPaddingY}`}>
      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={750} distance={20}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700">
              <span className="flex text-emerald-600">{'★★★★★'}</span>
              <span>{dict.reviews.scoreLabel}</span>
            </div>
            <h2 className={`mt-4 ${sectionHeading}`}>
              {dict.reviews.title}
            </h2>
          </div>
        </FadeUp>

        {/* 6 Review Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviewsList.map((rev, index) => (
            <FadeUp key={rev.id || index} delay={80 * index} duration={750} distance={24} className="h-full">
              <div
                className={`h-full flex flex-col justify-between ${baseCard}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex text-emerald-500 text-xs">{'★★★★★'}</div>
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-foreground/60">
                      {rev.verified}
                    </span>
                  </div>
                  <blockquote className="mt-4 text-xs leading-relaxed text-foreground/80 sm:text-sm">
                    &ldquo;{rev.review}&rdquo;
                  </blockquote>
                </div>
                <div className="mt-6 border-t border-black/5 pt-4">
                  <div className="text-xs font-bold text-foreground">{rev.name}</div>
                  <div className="text-[11px] text-persici-crimson font-medium">
                    {rev.company}
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Banner Strip */}
        <FadeUp delay={480} duration={750} distance={20}>
          <div className={`mt-12 ${bannerStrip}`}>
            <p className="font-primary text-sm font-semibold text-foreground">
              {dict.reviews.bannerText}
            </p>
            <HomeButton
              href={`/${lang}/contact`}
              title={dict.reviews.bannerCta}
              className="bg-persici-crimson text-white shadow-sm shadow-persici-crimson/20"
              currentLang={lang}
              isLangEffectIcon={true}
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
