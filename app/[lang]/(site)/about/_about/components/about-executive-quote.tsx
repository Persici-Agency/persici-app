'use client';

import React from 'react';
import { ClientReviewSection } from '@shared';
import type { AboutExecutiveQuoteData } from '../data/about.data';

export interface AboutExecutiveQuoteProps {
  data: AboutExecutiveQuoteData;
  lang: string;
}

export function AboutExecutiveQuote({ data, lang }: AboutExecutiveQuoteProps) {
  const author = data.author[lang as 'en' | 'ar'] || data.author.en;
  const role = data.role[lang as 'en' | 'ar'] || data.role.en;

  return (
    <ClientReviewSection
      badge={data.badge}
      quoteText={data.quote}
      quoteAuthor={author}
      quoteRole={role}
      quoteAvatar={data.avatar}
      avatarClassName="w-16 h-16 sm:w-20 sm:h-20 ring-2 ring-persici-crimson/25 shadow-md ring-offset-2 ring-offset-[#F9F8F6]"
      avatarImageClassName="scale-105"
      authorClassName="font-semibold text-slate-900 text-base sm:text-lg flex items-center gap-2"
      roleClassName="text-xs sm:text-sm text-slate-500 mt-1 font-medium"
      lang={lang}
      className="pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 lg:pb-12 bg-[#F9F8F6] border-t border-black/[0.04]"
    />
  );
}
