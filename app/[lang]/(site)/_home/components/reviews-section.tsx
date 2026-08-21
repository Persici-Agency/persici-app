import type { Dictionary } from '@dictionaries';
import { sectionContainer, sectionHeading, baseCard, bannerStrip, HomeButton } from '@shared';

export type ReviewsSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function ReviewsSection({ lang, dict }: ReviewsSectionProps) {
  const reviewsList = [
    dict.reviews.r1,
    dict.reviews.r2,
    dict.reviews.r3,
    dict.reviews.r4,
    dict.reviews.r5,
    dict.reviews.r6,
  ];

  return (
    <section className="bg-persici-black/[0.02] py-20">
      <div className={sectionContainer}>
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="flex text-emerald-600">{'★★★★★'}</span>
            <span>{dict.reviews.scoreLabel}</span>
          </div>
          <h2 className={`mt-4 ${sectionHeading}`}>
            {dict.reviews.title}
          </h2>
        </div>

        {/* 6 Review Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviewsList.map((rev, index) => (
            <div
              key={index}
              className={`flex flex-col justify-between ${baseCard}`}
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
          ))}
        </div>

        {/* Banner Strip */}
        <div className={`mt-12 ${bannerStrip}`}>
          <p className="font-primary text-sm font-semibold text-foreground">
            {dict.reviews.bannerText}
          </p>
          <HomeButton
            href={`/${lang}/contact`}
            title={dict.reviews.bannerCta}
            className="bg-persici-crimson text-white shadow-sm shadow-persici-crimson/20 px-5 py-2.5 text-xs"
            currentLang={lang}
            isLangEffectIcon={true}
          />
        </div>
      </div>
    </section>
  );
}

