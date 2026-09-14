'use client';

import React, { useState } from 'react';
import { sectionContainer, sectionPaddingY, badgePill } from '@shared/constants';
import { FadeUp } from '@shared';
import type { ContactChannelItem, LocalizedString } from '../data/contact.data';

export interface ContactDirectChannelsSectionProps {
  channels: ContactChannelItem[];
  title: LocalizedString;
  subtitle: LocalizedString;
  lang: string;
}

export function ContactDirectChannelsSection({
  channels,
  title,
  subtitle,
  lang,
}: ContactDirectChannelsSectionProps) {
  const isAr = lang === 'ar';
  const sectionTitle = title[isAr ? 'ar' : 'en'] || title.en;
  const sectionSubtitle = subtitle[isAr ? 'ar' : 'en'] || subtitle.en;
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2000);
  };

  return (
    <section className={`${sectionPaddingY} bg-white relative overflow-hidden border-b border-black/[0.04]`} id="channels">
      <div className={sectionContainer}>
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <FadeUp delay={0} duration={600} distance={16}>
            <span className={`${badgePill} mb-4 tracking-wide uppercase text-[11px] font-mono font-semibold`}>
              {isAr ? 'قنوات تواصل سريعة ومباشرة' : 'Direct Inquiries'}
            </span>
          </FadeUp>

          <FadeUp delay={100} duration={750} distance={20}>
            <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-persici-black leading-[1.15] rtl:leading-[1.25] mb-4">
              {sectionTitle}
            </h2>
          </FadeUp>

          <FadeUp delay={180} duration={750} distance={20}>
            <p className="font-secondary text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {sectionSubtitle}
            </p>
          </FadeUp>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {channels.map((ch, idx) => {
            const chCategory = ch.category[isAr ? 'ar' : 'en'] || ch.category.en;
            const chTitle = ch.title[isAr ? 'ar' : 'en'] || ch.title.en;
            const chDesc = ch.description[isAr ? 'ar' : 'en'] || ch.description.en;
            const chSla = ch.sla[isAr ? 'ar' : 'en'] || ch.sla.en;
            const isCopied = copiedEmail === ch.email;

            return (
              <FadeUp
                key={ch.id}
                delay={100 + idx * 80}
                duration={750}
                distance={20}
                className="h-full"
              >
                <div className="group relative h-full flex flex-col justify-between rounded-3xl border border-black/10 bg-[#F9F8F6] p-7 transition-all duration-300 hover:border-persici-crimson/30 hover:bg-white hover:shadow-lg">
                  {/* Top indicator bar */}
                  <div className="w-10 h-1 bg-persici-crimson/20 group-hover:bg-persici-crimson rounded-full mb-5 transition-colors" />

                  {/* Content */}
                  <div>
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                      {chCategory}
                    </span>

                    <h3 className="font-primary text-lg font-bold text-persici-black leading-snug mb-3 group-hover:text-persici-crimson transition-colors">
                      {chTitle}
                    </h3>

                    <p className="font-secondary text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                      {chDesc}
                    </p>
                  </div>

                  {/* Bottom Action Box */}
                  <div className="pt-4 border-t border-black/5 space-y-3">
                    {/* SLA commitment */}
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{chSla}</span>
                    </div>

                    {/* Email + Copy button */}
                    <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                      <a
                        href={`mailto:${ch.email}`}
                        className="text-xs font-semibold text-slate-900 hover:text-persici-crimson truncate transition-colors"
                      >
                        {ch.email}
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopy(ch.email)}
                        className="text-[11px] font-medium text-slate-500 hover:text-persici-crimson shrink-0 px-2 py-0.5 rounded-md hover:bg-slate-100 transition-all cursor-pointer"
                        title={isAr ? 'نسخ البريد الإلكتروني' : 'Copy email address'}
                      >
                        {isCopied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ' : 'Copy')}
                      </button>
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
