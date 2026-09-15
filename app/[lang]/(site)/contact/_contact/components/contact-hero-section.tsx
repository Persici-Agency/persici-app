'use client';

import React from 'react';
import { sectionContainer, badgePill } from '@shared/constants';
import { FadeUp } from '@shared';
import type { ContactPageData } from '../data/contact.data';

export interface ContactHeroSectionProps {
  data: ContactPageData['hero'];
  lang: string;
}

export function ContactHeroSection({ data, lang }: ContactHeroSectionProps) {
  const isAr = lang === 'ar';
  const badge = data.badge[isAr ? 'ar' : 'en'] || data.badge.en;
  const title = data.title[isAr ? 'ar' : 'en'] || data.title.en;
  const subtitle = data.subtitle[isAr ? 'ar' : 'en'] || data.subtitle.en;

  const quickLinks = [
    {
      id: 'offices',
      label: isAr ? 'مكاتبنا العالمية' : 'Global Hubs',
      href: '#offices',
      icon: (
        <svg className="w-3.5 h-3.5 text-persici-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'channels',
      label: isAr ? 'قنوات مباشرة' : 'Direct Channels',
      href: '#channels',
      icon: (
        <svg className="w-3.5 h-3.5 text-persici-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: 'faqs',
      label: isAr ? 'الأسئلة الشائعة' : 'Engagement FAQs',
      href: '#faqs',
      icon: (
        <svg className="w-3.5 h-3.5 text-persici-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'form',
      label: isAr ? 'نموذج التواصل السريع' : 'Inquiry Form',
      href: '#contact-form',
      icon: (
        <svg className="w-3.5 h-3.5 text-persici-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section data-header-luminance="light" className="relative pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 lg:pb-20 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden border-b border-black/[0.04]">
      {/* Ambient background decoration */}
      <div className="absolute top-0 inset-x-0 h-64 bg-radial from-persici-crimson/[0.04] to-transparent pointer-events-none" />

      <div className={sectionContainer}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <FadeUp delay={0} duration={600} distance={16}>
            <span className={`${badgePill} mb-4 tracking-wide uppercase text-[9.5px] font-mono font-semibold`}>
              {badge}
            </span>
          </FadeUp>

          {/* Heading */}
          <FadeUp delay={100} duration={750} distance={20}>
            <h1 className="font-primary text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-persici-black leading-[1.12] rtl:leading-[1.25] mb-6">
              {title}
            </h1>
          </FadeUp>

          {/* Subtitle */}
          <FadeUp delay={180} duration={750} distance={20}>
            <p className="font-secondary text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto mb-8">
              {subtitle}
            </p>
          </FadeUp>

          {/* Quick Anchor Navigation Chips */}
          <FadeUp delay={250} duration={750} distance={20}>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {quickLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs hover:border-persici-crimson hover:text-persici-crimson hover:bg-persici-crimson/[0.03] transition-all duration-200 cursor-pointer"
                >
                  <span className="p-1 rounded-full bg-slate-100 group-hover:bg-persici-crimson/10 transition-colors">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
