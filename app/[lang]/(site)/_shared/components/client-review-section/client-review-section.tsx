'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import type { SolutionsPageContent, ReviewItem } from '@shared/types';
import { sectionContainer } from '@shared/constants';
import { reviewsList } from '@shared/data';
import { FadeUp } from '@shared';

export interface ClientReviewSectionProps {
  content?: SolutionsPageContent;
  quoteText?: string | { en: string; ar: string };
  quoteAuthor?: string;
  quoteRole?: string | { en: string; ar: string };
  quoteAvatar?: string;
  avatar?: string;
  avatarClassName?: string;
  avatarImageClassName?: string;
  authorClassName?: string;
  roleClassName?: string;
  badge?: string | { en: string; ar: string };
  /** 'random' (default) picks a random active review from /api/reviews; or pass a specific review ID */
  reviewId?: string;
  /** Default true for all client review sections; set false only for dedicated executive quotes like founder note */
  useLiveReviews?: boolean;
  lang: string;
  className?: string;
}

interface NormalizedLiveReview {
  id: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  companyEn: string;
  companyAr: string;
  reviewEn: string;
  reviewAr: string;
  avatar?: string;
  active: boolean;
}

function normalizeLiveReview(raw: Record<string, unknown> | ReviewItem): NormalizedLiveReview {
  const rec = raw as Record<string, unknown>;
  const str = (val: unknown) => (typeof val === 'string' ? val.trim() : '');
  const bi = (obj: unknown, explicitEn: unknown, explicitAr: unknown) => {
    const o = typeof obj === 'object' && obj !== null ? (obj as Record<string, unknown>) : null;
    const s = typeof obj === 'string' ? obj.trim() : '';
    const en = str(explicitEn) || str(o?.en) || s;
    const ar = str(explicitAr) || str(o?.ar) || en;
    return { en, ar };
  };

  const name = bi(rec.name, rec.nameEn, rec.nameAr);
  const role = bi(rec.role, rec.roleEn, rec.roleAr);
  const company = bi(rec.company, rec.companyEn, rec.companyAr);
  const review = bi(rec.review, rec.reviewEn, rec.reviewAr);

  return {
    id: str(rec.id) || (rec._id ? String(rec._id) : ''),
    nameEn: name.en,
    nameAr: name.ar,
    roleEn: role.en,
    roleAr: role.ar,
    companyEn: company.en,
    companyAr: company.ar,
    reviewEn: review.en,
    reviewAr: review.ar,
    avatar: str(rec.avatar) || str(rec.photo) || undefined,
    active: rec.active !== false,
  };
}

const FALLBACK_LIVE_REVIEWS: NormalizedLiveReview[] = reviewsList.map((r) =>
  normalizeLiveReview(r)
);

let cachedLiveReviews: NormalizedLiveReview[] | null = null;
let inflightReviewsPromise: Promise<NormalizedLiveReview[]> | null = null;

function pickLiveReview(
  pool: NormalizedLiveReview[],
  reviewId?: string,
  randomize = false
): NormalizedLiveReview | null {
  const activePool = pool.filter((r) => r.active && (r.reviewEn || r.reviewAr));
  if (activePool.length === 0) return null;

  if (reviewId && reviewId !== 'random') {
    const matched = activePool.find((r) => r.id === reviewId);
    if (matched) return matched;
  }

  if (randomize) {
    return activePool[Math.floor(Math.random() * activePool.length)] || activePool[0];
  }

  return activePool[0];
}

async function fetchLiveReviewsCached(): Promise<NormalizedLiveReview[]> {
  if (cachedLiveReviews && cachedLiveReviews.length > 0) {
    return cachedLiveReviews;
  }
  if (!inflightReviewsPromise) {
    inflightReviewsPromise = fetch('/api/reviews', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const items = Array.isArray(data?.reviews)
          ? data.reviews.map((item: Record<string, unknown>) => normalizeLiveReview(item))
          : [];
        const resolved = items.length > 0 ? items : FALLBACK_LIVE_REVIEWS;
        cachedLiveReviews = resolved;
        return resolved;
      })
      .catch(() => FALLBACK_LIVE_REVIEWS)
      .finally(() => {
        inflightReviewsPromise = null;
      });
  }
  return inflightReviewsPromise;
}

/**
 * ClientReviewSection
 * Standalone client testimonial quotation section featuring an eyebrow badge,
 * monospaced typographic quote with brand crimson border accent, and author attribution.
 * Syncs live from /api/reviews by default (random or selected ID) in Arabic or English matching page locale.
 */
export function ClientReviewSection({
  content,
  quoteText,
  quoteAuthor,
  quoteRole,
  quoteAvatar,
  avatar: propAvatar,
  avatarClassName,
  avatarImageClassName,
  authorClassName,
  roleClassName,
  badge,
  reviewId = 'random',
  useLiveReviews = true,
  lang,
  className,
}: ClientReviewSectionProps) {
  const isRtl = lang === 'ar';

  // SSR-safe deterministic initial review from real fallback catalog so SSR matches initial hydration cleanly
  const ssrFallbackReview = useLiveReviews
    ? pickLiveReview(FALLBACK_LIVE_REVIEWS, reviewId, false)
    : null;

  const [mountedReview, setMountedReview] = useState<NormalizedLiveReview | null>(null);

  useEffect(() => {
    if (!useLiveReviews) return;
    let active = true;

    fetchLiveReviewsCached().then((pool) => {
      if (!active) return;
      const chosen = pickLiveReview(pool, reviewId, true);
      if (chosen) {
        setMountedReview(chosen);
      }
    });

    return () => {
      active = false;
    };
  }, [useLiveReviews, reviewId]);

  const activeLiveReview = useLiveReviews ? mountedReview || ssrFallbackReview : null;

  const avatar = useLiveReviews
    ? activeLiveReview?.avatar || ''
    : quoteAvatar || propAvatar || '';

  const liveQuote = activeLiveReview
    ? isRtl
      ? activeLiveReview.reviewAr || activeLiveReview.reviewEn
      : activeLiveReview.reviewEn || activeLiveReview.reviewAr
    : '';

  const propQuote =
    (typeof quoteText === 'string'
      ? quoteText
      : quoteText?.[lang as 'en' | 'ar'] || quoteText?.en) ||
    (content?.quoteText
      ? content.quoteText[lang as 'en' | 'ar'] || content.quoteText.en
      : '');

  const rawQuote = (useLiveReviews ? liveQuote : '') || propQuote;
  const cleanQuoteText = rawQuote.replace(/^["'“\s]+|["'”\s]+$/g, '');

  const liveAuthor = activeLiveReview
    ? isRtl
      ? activeLiveReview.nameAr || activeLiveReview.nameEn
      : activeLiveReview.nameEn || activeLiveReview.nameAr
    : '';
  const propAuthor = quoteAuthor || content?.quoteAuthor || '';
  const author = (useLiveReviews ? liveAuthor : '') || propAuthor;

  const liveRole = activeLiveReview
    ? isRtl
      ? [activeLiveReview.roleAr || activeLiveReview.roleEn, activeLiveReview.companyAr || activeLiveReview.companyEn]
          .filter(Boolean)
          .join('، ')
      : [activeLiveReview.roleEn || activeLiveReview.roleAr, activeLiveReview.companyEn || activeLiveReview.companyAr]
          .filter(Boolean)
          .join(', ')
    : '';
  const propRole =
    (typeof quoteRole === 'string'
      ? quoteRole
      : quoteRole?.[lang as 'en' | 'ar'] || quoteRole?.en) ||
    (content?.quoteRole
      ? content.quoteRole[lang as 'en' | 'ar'] || content.quoteRole.en
      : '');
  const role = (useLiveReviews ? liveRole : '') || propRole;

  const badgeText =
    (typeof badge === 'string'
      ? badge
      : badge?.[lang as 'en' | 'ar'] || badge?.en) ||
    (isRtl ? 'آراء العملاء' : 'What our clients say');

  if (!cleanQuoteText) return null;

  return (
    <section className={`${className || 'py-14 sm:py-16 lg:py-20'} bg-white relative overflow-hidden`}>
      <div className={sectionContainer}>
        <FadeUp delay={0} duration={800} distance={24} className="max-w-5xl mx-auto">
          {/* Subtitle / Eyebrow (No background, brand primary color distinct from heading) */}
          <span className="text-xs font-semibold uppercase tracking-widest text-persici-crimson block mb-6">
            {badgeText}
          </span>

          {/* Monospaced Typographic Client Quotation */}
          {/<[a-z][\s\S]*>/i.test(cleanQuoteText) ? (
            <blockquote
              className="font-mono ltr:border-l-4 rtl:border-r-4 border-persici-crimson ltr:pl-4 rtl:pr-4 text-xl sm:text-2xl lg:text-2xl font-normal sm:font-medium tracking-tight text-slate-900 leading-relaxed text-left rtl:text-right"
              dangerouslySetInnerHTML={{ __html: `&ldquo;${cleanQuoteText}&rdquo;` }}
            />
          ) : (
            <blockquote className="font-mono ltr:border-l-4 rtl:border-r-4 border-persici-crimson ltr:pl-4 rtl:pr-4 text-xl sm:text-2xl lg:text-2xl font-normal sm:font-medium tracking-tight text-slate-900 leading-relaxed text-left rtl:text-right">
              &ldquo;{cleanQuoteText}&rdquo;
            </blockquote>
          )}

          {/* Author Details with optional Avatar beside it */}
          {(author || role) && (
            <div className="mt-8 pt-4 text-left rtl:text-right flex items-center gap-4 sm:gap-5">
              {avatar && (
                <div
                  className={`relative rounded-full overflow-hidden shrink-0 border border-slate-200/80 shadow-xs ${
                    avatarClassName || 'w-10 h-10 sm:w-11 sm:h-11'
                  }`}
                >
                  <Image
                    src={avatar}
                    alt={author || 'Author'}
                    fill
                    className={`object-cover ${avatarImageClassName || ''}`}
                    sizes="(max-width: 640px) 72px, 96px"
                  />
                </div>
              )}
              <div>
                {author && (
                  <div
                    className={
                      authorClassName ||
                      'font-semibold text-slate-900 text-sm sm:text-[13px] flex items-center gap-1.5'
                    }
                  >
                    <span className="text-slate-400 font-normal">—</span>
                    <span>{author}</span>
                  </div>
                )}
                {role && (
                  <div
                    className={
                      roleClassName ||
                      'text-xs sm:text-[12px] text-slate-500 mt-0.5'
                    }
                  >
                    {role}
                  </div>
                )}
              </div>
            </div>
          )}
        </FadeUp>
      </div>
    </section>
  );
}

// Reusable aliases
export const ClientReview = ClientReviewSection;
export type ClientReviewProps = ClientReviewSectionProps;
export const SolutionsClientReview = ClientReviewSection;
export type SolutionsClientReviewProps = ClientReviewSectionProps;
