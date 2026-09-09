'use client';

import React from 'react';
import Link from 'next/link';
import { TbArticle, TbBriefcase, TbFileText, TbCode, TbTrendingUp } from 'react-icons/tb';

export interface ContentCardItem {
  id?: string;
  slug?: string;
  title: string | { en: string; ar: string };
  category?: string | { en: string; ar: string };
  date?: string | { en: string; ar: string };
  href?: string;
  type?: 'article' | 'insight' | 'case-study' | 'project' | 'blog' | 'news' | string;
  icon?: React.ReactNode;
  [key: string]: unknown;
}

export interface ContentCardProps {
  /**
   * Universal item object. Can be an InsightArticle, ProjectItem, Blog post,
   * Client Story, or generic record.
   */
  item?: ContentCardItem | Record<string, unknown>;
  /**
   * Overrides or standalone props
   */
  title?: string | { en: string; ar: string };
  category?: string | { en: string; ar: string };
  date?: string | { en: string; ar: string };
  href?: string;
  type?: string;
  icon?: React.ReactNode;
  lang?: string;
  className?: string;
}

/**
 * Standalone Universal Content Card
 * Displays category, title, thin divider, and date.
 * Adapts dynamically to data from insights, blogs, client stories, and projects.
 */
export function ContentCard({
  item,
  title,
  category,
  date,
  href,
  type,
  icon,
  lang = 'en',
  className = '',
}: ContentCardProps) {
  const isRtl = lang === 'ar';
  const itemObj = item as Record<string, unknown> | undefined;

  // 1. Resolve Title
  const rawTitle =
    title ??
    itemObj?.title ??
    itemObj?.headline ??
    itemObj?.name ??
    '';
  const resolvedTitle =
    typeof rawTitle === 'string'
      ? rawTitle
      : (rawTitle as { en?: string; ar?: string })?.[lang as 'en' | 'ar'] ||
        (rawTitle as { en?: string; ar?: string })?.en ||
        '';

  // 2. Resolve Category
  const rawCategory =
    category ??
    itemObj?.category ??
    itemObj?.type ??
    itemObj?.tag ??
    (itemObj?.client ? 'Case Study' : 'Article');
  const resolvedCategory =
    typeof rawCategory === 'string'
      ? rawCategory
      : (rawCategory as { en?: string; ar?: string })?.[lang as 'en' | 'ar'] ||
        (rawCategory as { en?: string; ar?: string })?.en ||
        'Article';

  // 3. Resolve Date
  const rawDate =
    date ??
    itemObj?.date ??
    itemObj?.publishedAt ??
    itemObj?.createdAt ??
    itemObj?.year ??
    '';
  const resolvedDate =
    typeof rawDate === 'string'
      ? rawDate
      : (rawDate as { en?: string; ar?: string })?.[lang as 'en' | 'ar'] ||
        (rawDate as { en?: string; ar?: string })?.en ||
        '';

  // 4. Resolve Href Link
  const rawSlug = typeof itemObj?.slug === 'string' ? itemObj.slug : '';
  const itemType = String(type || itemObj?.type || '').toLowerCase();
  const catLower = String(resolvedCategory || '').toLowerCase();

  let fallbackPath = '/insights';
  if (
    itemType.includes('project') ||
    itemType.includes('portfolio') ||
    catLower.includes('case') ||
    catLower.includes('project')
  ) {
    fallbackPath = rawSlug ? `/work/${rawSlug}` : '/work';
  } else if (rawSlug) {
    fallbackPath = `/insights/${rawSlug}`;
  }

  const rawHref = href || (itemObj?.href as string) || fallbackPath;
  const finalHref = rawHref.startsWith(`/${lang}`)
    ? rawHref
    : rawHref.startsWith('/')
    ? `/${lang}${rawHref}`
    : `/${lang}/${rawHref}`;

  // 5. Resolve Icon
  const resolveIcon = () => {
    if (icon) return icon;
    if (itemObj?.icon && React.isValidElement(itemObj.icon)) return itemObj.icon;

    if (
      itemType.includes('project') ||
      catLower.includes('case') ||
      catLower.includes('project')
    ) {
      return <TbBriefcase className="h-4 w-4 shrink-0 text-slate-700" />;
    }
    if (catLower.includes('tech') || catLower.includes('engineering')) {
      return <TbCode className="h-4 w-4 shrink-0 text-slate-700" />;
    }
    if (catLower.includes('growth') || catLower.includes('media')) {
      return <TbTrendingUp className="h-4 w-4 shrink-0 text-slate-700" />;
    }
    if (catLower.includes('whitepaper') || catLower.includes('research')) {
      return <TbFileText className="h-4 w-4 shrink-0 text-slate-700" />;
    }
    // Default document/article icon matching screenshot
    return <TbArticle className="h-4 w-4 shrink-0 text-slate-700" />;
  };

  const cardContent = (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`relative flex flex-col justify-between h-full min-h-[260px] sm:min-h-[280px] rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-2.5 hover:shadow-[0_22px_45px_-12px_rgba(0,0,0,0.14),0_8px_18px_-6px_rgba(216,52,39,0.08)] hover:border-slate-300 hover:z-20 transition-all duration-300 ease-out will-change-transform group select-none ${className}`}
    >
      {/* Top: Icon + Category */}
      <div className="flex items-center gap-2 text-slate-700 mb-4 sm:mb-5">
        <span className="text-slate-600 transition-colors group-hover:text-persici-crimson">
          {resolveIcon()}
        </span>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-700">
          {resolvedCategory}
        </span>
      </div>

      {/* Middle: Title */}
      <div className="flex-1">
        <h3 className="font-primary text-xl sm:text-2xl font-bold text-slate-900 leading-snug transition-colors group-hover:text-persici-crimson">
          {resolvedTitle}
        </h3>
      </div>

      {/* Bottom: Thin Divider Line + Date */}
      <div className="mt-auto pt-6">
        <hr className="border-t border-slate-200/90 w-full mb-4" />
        {resolvedDate && (
          <time className="font-mono text-xs text-slate-500 block">
            {resolvedDate}
          </time>
        )}
      </div>
    </div>
  );

  if (finalHref) {
    return (
      <Link href={finalHref} className="block h-full relative hover:z-20">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
