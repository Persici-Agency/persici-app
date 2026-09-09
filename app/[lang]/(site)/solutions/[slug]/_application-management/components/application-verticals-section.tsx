'use client';

import React from 'react';
import type { ApplicationVerticalItem } from '../data/application-management.data';
import { SolutionsVerticalCard } from '../../../_solutions/components';
import { sectionContainer } from '@shared/constants';
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
                className={idx === 4 ? 'md:col-span-2 lg:col-span-1 flex' : 'flex'}
              >
                <SolutionsVerticalCard
                  number={item.number}
                  tag={itemTag}
                  title={itemTitle}
                  description={itemDesc}
                  capabilities={capabilities}
                />
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
