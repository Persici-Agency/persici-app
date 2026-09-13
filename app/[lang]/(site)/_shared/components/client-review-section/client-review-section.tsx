'use client';

import React from 'react';
import type { SolutionsPageContent } from '@shared/types';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';

export interface ClientReviewSectionProps {
  content?: SolutionsPageContent;
  quoteText?: string | { en: string; ar: string };
  quoteAuthor?: string;
  quoteRole?: string | { en: string; ar: string };
  badge?: string | { en: string; ar: string };
  lang: string;
  className?: string;
}

/**
 * ClientReviewSection
 * Standalone client testimonial quotation section featuring an eyebrow badge,
 * monospaced typographic quote with brand crimson border accent, and author attribution.
 * Usable across any page on the site (solutions, services, about, client stories, work).
 */
export function ClientReviewSection({
  content,
  quoteText,
  quoteAuthor,
  quoteRole,
  badge,
  lang,
  className,
}: ClientReviewSectionProps) {
  const isRtl = lang === 'ar';

  const rawQuote =
    (typeof quoteText === 'string'
      ? quoteText
      : quoteText?.[lang as 'en' | 'ar'] || quoteText?.en) ||
    (content?.quoteText
      ? content.quoteText[lang as 'en' | 'ar'] || content.quoteText.en
      : '');

  const cleanQuoteText = rawQuote.replace(/^["'“\s]+|["'”\s]+$/g, '');

  const author = quoteAuthor || content?.quoteAuthor || '';

  const role =
    (typeof quoteRole === 'string'
      ? quoteRole
      : quoteRole?.[lang as 'en' | 'ar'] || quoteRole?.en) ||
    (content?.quoteRole
      ? content.quoteRole[lang as 'en' | 'ar'] || content.quoteRole.en
      : '');

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
          <span className="text-xs font-bold uppercase tracking-widest text-persici-crimson block mb-6">
            {badgeText}
          </span>

          {/* Monospaced Typographic Client Quotation */}
          <blockquote className="font-mono ltr:border-l-4 rtl:border-r-4 border-persici-crimson ltr:pl-4 rtl:pr-4 text-xl sm:text-2xl lg:text-2xl font-normal sm:font-medium tracking-tight text-slate-900 leading-relaxed text-left rtl:text-right">
            &ldquo;{cleanQuoteText}&rdquo;
          </blockquote>

          {/* Author Details */}
          {(author || role) && (
            <div className="mt-8 pt-4 text-left rtl:text-right">
              {author && (
                <div className="font-semibold text-slate-900 text-sm">
                  {author}
                </div>
              )}
              {role && (
                <div className="text-xs text-slate-500 mt-1">
                  {role}
                </div>
              )}
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
