'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { InsightDetail } from '../../../_insights/types';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared/components';
import {
  TbChevronRight,
  TbChevronLeft,
  TbHome,
  TbShare,
  TbCopy,
  TbCheck,
  TbMail,
  TbBrandLinkedin,
  TbBrandReddit,
  TbBrandX,
  TbBrandFacebook,
} from 'react-icons/tb';

export interface InsightDetailHeaderSectionProps {
  insight: InsightDetail;
  lang: string;
}

const monthsEnToAr: Record<string, string> = {
  January: 'يناير',
  February: 'فبراير',
  March: 'مارس',
  April: 'أبريل',
  May: 'مايو',
  June: 'يونيو',
  July: 'يوليو',
  August: 'أغسطس',
  September: 'سبتمبر',
  October: 'أكتوبر',
  November: 'نوفمبر',
  December: 'ديسمبر',
};

function formatDisplayDate(dateStr: string | undefined, isRtl: boolean): string {
  if (!dateStr) return '';
  if (!isRtl) return dateStr;

  let localized = dateStr;
  for (const [en, ar] of Object.entries(monthsEnToAr)) {
    if (localized.includes(en)) {
      localized = localized.replace(en, ar);
      break;
    }
  }
  return localized;
}

export function InsightDetailHeaderSection({ insight, lang }: InsightDetailHeaderSectionProps) {
  const isRtl = lang === 'ar';
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const title = insight.title[lang as 'en' | 'ar'] || insight.title.en;
  const subtitle = insight.subtitle
    ? insight.subtitle[lang as 'en' | 'ar'] || insight.subtitle.en
    : null;
  const categoryLabel = insight.category[lang as 'en' | 'ar'] || insight.category.en;

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [dropdownOpen]);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `https://persici.com/${lang}/insights/${insight.slug}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setDropdownOpen(false);
      }, 1800);
    } catch {
      // Fallback
    }
  };

  const handleEmailShare = () => {
    const url = getShareUrl();
    const mailto = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
      (isRtl ? 'اقرأ هذه الرؤية من بيرسيكي:\n' : 'Check out this insight from Persici:\n') + url
    )}`;
    window.location.href = mailto;
    setDropdownOpen(false);
  };

  const handleSocialShare = (platform: 'linkedin' | 'reddit' | 'x' | 'facebook') => {
    const url = encodeURIComponent(getShareUrl());
    const encodedTitle = encodeURIComponent(title);
    let shareLink = '';

    switch (platform) {
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'reddit':
        shareLink = `https://reddit.com/submit?url=${url}&title=${encodedTitle}`;
        break;
      case 'x':
        shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
    }

    if (shareLink && typeof window !== 'undefined') {
      window.open(shareLink, '_blank', 'noopener,noreferrer,width=600,height=500');
      setDropdownOpen(false);
    }
  };

  return (
    <header
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative z-40 w-full pt-32 sm:pt-36 lg:pt-40 pb-8 sm:pb-12 bg-white border-b border-slate-200/80"
    >
      <div className={sectionContainer}>
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation Sequence */}
          <FadeUp delay={0} duration={600} distance={12}>
            <nav aria-label={isRtl ? 'مسار التنقل' : 'Breadcrumb'} className="mb-6">
              <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-[12px] font-medium text-slate-500">
                {/* 1. Home */}
                <li className="inline-flex items-center">
                  <Link
                    href={`/${lang}`}
                    className="inline-flex items-center gap-1.5 hover:text-persici-crimson transition-colors cursor-pointer"
                  >
                    <TbHome className="h-3.5 w-3.5 shrink-0" />
                    <span>{isRtl ? 'الرئيسية' : 'Home'}</span>
                  </Link>
                </li>

                {/* Separator */}
                <li aria-hidden="true" className="text-slate-300 select-none">
                  {isRtl ? (
                    <TbChevronLeft className="h-3.5 w-3.5" />
                  ) : (
                    <TbChevronRight className="h-3.5 w-3.5" />
                  )}
                </li>

                {/* 2. Insights */}
                <li className="inline-flex items-center">
                  <Link
                    href={`/${lang}/insights`}
                    className="hover:text-persici-crimson transition-colors cursor-pointer"
                  >
                    {isRtl ? 'الرؤى والدراسات' : 'Insights'}
                  </Link>
                </li>

                {/* Separator */}
                <li aria-hidden="true" className="text-slate-300 select-none">
                  {isRtl ? (
                    <TbChevronLeft className="h-3.5 w-3.5" />
                  ) : (
                    <TbChevronRight className="h-3.5 w-3.5" />
                  )}
                </li>

                {/* 3. Category */}
                <li className="inline-flex items-center">
                  <Link
                    href={`/${lang}/insights#explore`}
                    className="hover:text-persici-crimson transition-colors cursor-pointer"
                  >
                    {categoryLabel}
                  </Link>
                </li>

                {/* Separator */}
                <li aria-hidden="true" className="text-slate-300 select-none">
                  {isRtl ? (
                    <TbChevronLeft className="h-3.5 w-3.5" />
                  ) : (
                    <TbChevronRight className="h-3.5 w-3.5" />
                  )}
                </li>

                {/* 4. Current Article Title */}
                <li
                  aria-current="page"
                  className="inline-flex items-center font-semibold text-slate-900 max-w-[180px] sm:max-w-[320px] md:max-w-[420px] truncate"
                >
                  <span className="truncate">{title}</span>
                </li>
              </ol>
            </nav>
          </FadeUp>

          {/* Main Title H1 */}
          <FadeUp delay={100} duration={750} distance={20} blur={true}>
            <h1 className="font-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight leading-[1.15]">
              {title}
            </h1>
          </FadeUp>

          {/* Subtitle */}
          {subtitle && (
            <FadeUp delay={200} duration={750} distance={16}>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
                {subtitle}
              </p>
            </FadeUp>
          )}

          {/* Metadata Row: Date, Category Pill, Share Button with Dropdown */}
          <FadeUp delay={300} duration={700} distance={14}>
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 font-mono">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="font-medium text-slate-700 tabular-nums">
                  {formatDisplayDate(insight.date, isRtl)}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center rounded-full bg-persici-crimson/10 text-persici-crimson font-sans font-semibold px-3 py-1 text-xs">
                  {categoryLabel}
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-sans text-slate-500">{insight.readTime}</span>
              </div>

              {/* Clean Share Button Link (Without Border or Background) with Dropdown */}
              <div className="relative z-50" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 font-sans text-xs sm:text-sm font-semibold text-slate-600 hover:text-persici-crimson transition-colors bg-transparent border-0 p-0 shadow-none cursor-pointer select-none focus:outline-none"
                  aria-label={isRtl ? 'مشاركة الرؤية' : 'Share this insight'}
                  aria-expanded={dropdownOpen}
                >
                  <TbShare className="h-4 w-4" />
                  <span>{isRtl ? 'مشاركة' : 'Share'}</span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className={`absolute top-full mt-2.5 z-50 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-200/90 backdrop-blur-md transition-all duration-150 ${
                      isRtl ? 'start-0 text-right' : 'end-0 text-left'
                    }`}
                  >
                    <div className="space-y-0.5 font-sans">
                      {/* 1. Copy Link */}
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <TbCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                          <TbCopy className="h-4 w-4 text-slate-500 shrink-0" />
                        )}
                        <span className={copied ? 'text-emerald-700 font-semibold' : ''}>
                          {isRtl
                            ? copied
                              ? 'تم النسخ بنجاح!'
                              : 'نسخ الرابط'
                            : copied
                            ? 'Copied to clipboard!'
                            : 'Copy link'}
                        </span>
                      </button>

                      {/* 2. Email */}
                      <button
                        type="button"
                        onClick={handleEmailShare}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <TbMail className="h-4 w-4 text-slate-500 shrink-0" />
                        <span>{isRtl ? 'مشاركة عبر البريد' : 'Share via Email'}</span>
                      </button>

                      <div className="my-1 border-t border-slate-100" />

                      {/* 3. LinkedIn */}
                      <button
                        type="button"
                        onClick={() => handleSocialShare('linkedin')}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        <TbBrandLinkedin className="h-4 w-4 text-[#0A66C2] shrink-0" />
                        <span>{isRtl ? 'لينكد إن (LinkedIn)' : 'LinkedIn'}</span>
                      </button>

                      {/* 4. Reddit */}
                      <button
                        type="button"
                        onClick={() => handleSocialShare('reddit')}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-pointer"
                      >
                        <TbBrandReddit className="h-4 w-4 text-[#FF4500] shrink-0" />
                        <span>{isRtl ? 'ريديت (Reddit)' : 'Reddit'}</span>
                      </button>

                      {/* 5. X (Twitter) */}
                      <button
                        type="button"
                        onClick={() => handleSocialShare('x')}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <TbBrandX className="h-4 w-4 text-slate-900 shrink-0" />
                        <span>{isRtl ? 'إكس (تويتر)' : 'X (Twitter)'}</span>
                      </button>

                      {/* 6. Facebook */}
                      <button
                        type="button"
                        onClick={() => handleSocialShare('facebook')}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition-colors cursor-pointer"
                      >
                        <TbBrandFacebook className="h-4 w-4 text-[#1877F2] shrink-0" />
                        <span>{isRtl ? 'فيسبوك (Facebook)' : 'Facebook'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </header>
  );
}
