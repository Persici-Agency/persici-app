'use client';

import React from 'react';
import Image from 'next/image';
import { sectionContainer, sectionPaddingY, badgePill } from '@shared/constants';
import { FadeUp } from '@shared';
import type { ContactOfficeItem, LocalizedString } from '../data/contact.data';

export interface ContactOfficesSectionProps {
  offices: ContactOfficeItem[];
  title: LocalizedString;
  subtitle: LocalizedString;
  lang: string;
}

export function ContactOfficesSection({
  offices,
  title,
  subtitle,
  lang,
}: ContactOfficesSectionProps) {
  const isAr = lang === 'ar';
  const sectionTitle = title[isAr ? 'ar' : 'en'] || title.en;
  const sectionSubtitle = subtitle[isAr ? 'ar' : 'en'] || subtitle.en;

  return (
    <section className={`${sectionPaddingY} bg-[#FBFBFB] relative overflow-hidden border-b border-black/[0.04]`} id="offices">
      <div className={sectionContainer}>
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <FadeUp delay={0} duration={600} distance={16}>
            <span className={`${badgePill} mb-4 tracking-wide uppercase text-[11px] font-mono font-semibold`}>
              {isAr ? 'حضور استراتيجي عالمي' : 'Global Presence'}
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

        {/* 3-Column Office Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {offices.map((office, idx) => {
            const city = office.city[isAr ? 'ar' : 'en'] || office.city.en;
            const country = office.country[isAr ? 'ar' : 'en'] || office.country.en;
            const badge = office.badge ? (office.badge[isAr ? 'ar' : 'en'] || office.badge.en) : undefined;
            const address = office.address[isAr ? 'ar' : 'en'] || office.address.en;
            const hours = office.hours[isAr ? 'ar' : 'en'] || office.hours.en;

            return (
              <FadeUp
                key={office.id}
                delay={100 + idx * 100}
                duration={750}
                distance={20}
                className="h-full"
              >
                <div className="group relative h-full flex flex-col justify-between rounded-3xl border border-black/10 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-persici-crimson/30 transition-all duration-300">
                  {/* Card Top: Photography Chassis with Pill Badge */}
                  <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-slate-100">
                    <Image
                      src={office.image}
                      alt={`${city}, ${country}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                    {/* Floating Badge */}
                    {badge && (
                      <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-md text-persici-black border border-white/40 shadow-xs">
                          {badge}
                        </span>
                      </div>
                    )}

                    {/* City Heading on Image bottom */}
                    <div className="absolute bottom-4 left-5 right-5 z-10 text-white">
                      <h3 className="font-primary text-2xl font-bold tracking-tight">
                        {city}
                      </h3>
                      <p className="text-xs text-white/85 font-secondary">
                        {country}
                      </p>
                    </div>
                  </div>

                  {/* Card Body: Address, Hours, Contact Details */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Address */}
                      <div className="flex items-start gap-3 text-slate-700">
                        <svg className="w-4 h-4 text-persici-crimson shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="font-secondary text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {address}
                        </p>
                      </div>

                      {/* Working Hours & Timezone */}
                      <div className="flex items-start gap-3 text-slate-700">
                        <svg className="w-4 h-4 text-persici-crimson shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="font-secondary text-xs text-slate-500 leading-normal">
                          <div>{hours}</div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">{office.timezone}</div>
                        </div>
                      </div>

                      {/* Phone & Direct Email */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <a
                          href={`tel:${office.phone.replace(/\s+/g, '')}`}
                          className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-700 hover:text-persici-crimson transition-colors"
                        >
                          <svg className="w-4 h-4 text-slate-400 group-hover:text-persici-crimson transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span dir="ltr">{office.phone}</span>
                        </a>

                        <a
                          href={`mailto:${office.email}`}
                          className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-700 hover:text-persici-crimson transition-colors"
                        >
                          <svg className="w-4 h-4 text-slate-400 group-hover:text-persici-crimson transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{office.email}</span>
                        </a>
                      </div>
                    </div>

                    {/* Directions Link */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={office.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-persici-crimson hover:text-persici-black transition-colors"
                      >
                        <span>{isAr ? 'الاتجاهات عبر خرائط جوجل' : 'Get Directions'}</span>
                        <span className={`transition-transform duration-200 ${isAr ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                          {isAr ? '←' : '→'}
                        </span>
                      </a>
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
