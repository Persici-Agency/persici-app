'use client';

import React from 'react';
import type { ApplicationVerticalItem } from '../data/application-management.data';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';

interface ApplicationVerticalsSectionProps {
  verticals: ApplicationVerticalItem[];
  title: string;
  subtitle: string;
  lang: string;
}

export function ApplicationVerticalsSection({
  verticals,
  title,
  subtitle,
  lang,
}: ApplicationVerticalsSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#F9F8F6] relative overflow-hidden border-t border-black/[0.05]">
      <div className={sectionContainer}>
        {/* Section Heading */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'حلول القطاعات المتخصصة' : 'Domain Architectures'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {subtitle}
          </p>
        </FadeUp>

        {/* 5 Vertical Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {verticals.map((item, idx) => {
            const itemTitle = item.title[lang as 'en' | 'ar'] || item.title.en;
            const itemDesc = item.description[lang as 'en' | 'ar'] || item.description.en;
            const itemTag = item.tag[lang as 'en' | 'ar'] || item.tag.en;
            const capabilities = item.capabilities[lang as 'en' | 'ar'] || item.capabilities.en;

            return (
              <FadeUp
                key={item.id}
                delay={idx * 80}
                duration={700}
                distance={24}
                className={idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''}
              >
                <div className="group h-full flex flex-col justify-between rounded-2xl bg-[#FAFAF8] border border-black/[0.05] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-black/[0.1] relative">
                  <div>
                    {/* Monospace Index + Tag */}
                    <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-black/[0.05]">
                      <span className="font-mono text-xl sm:text-2xl font-bold text-slate-400 group-hover:text-persici-crimson transition-colors">
                        {item.number}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-black/[0.03] px-2.5 py-1 rounded-md">
                        {itemTag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-primary text-xl sm:text-2xl font-bold text-slate-900 mb-3 group-hover:text-persici-crimson transition-colors">
                      {itemTitle}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-slate-600 mb-6 font-normal">
                      {itemDesc}
                    </p>
                  </div>

                  {/* Key Capabilities Checklist */}
                  <div className="pt-4 border-t border-black/[0.05]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                      {isRtl ? 'أبرز الإمكانيات المدمجة' : 'Core Capabilities'}
                    </span>
                    <ul className="space-y-2">
                      {capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-persici-crimson shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
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
