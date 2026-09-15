'use client';

import React from 'react';
import type { IconType } from 'react-icons';
import {
  TbWorld,
  TbTrendingUp,
  TbSchool,
  TbHeartHandshake,
  TbDeviceLaptop,
  TbSun,
} from 'react-icons/tb';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';
import type { CareersHubData, CareerPerk } from '../data/careers.data';

export interface CareersPerksSectionProps {
  data: CareersHubData['perks'];
  lang: string;
}

const iconMap: Record<string, IconType> = {
  Globe: TbWorld,
  TrendingUp: TbTrendingUp,
  GraduationCap: TbSchool,
  HeartHandshake: TbHeartHandshake,
  Laptop: TbDeviceLaptop,
  Sun: TbSun,
};

export function CareersPerksSection({ data, lang }: CareersPerksSectionProps) {
  const isAr = lang === 'ar';

  return (
    <section className={`bg-[#F9F8F6] ${sectionPaddingY} relative overflow-hidden`}>
      <div className={sectionContainer}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <FadeUp delay={100} duration={600}>
            <span className="inline-block font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-persici-crimson bg-persici-crimson/10 px-3.5 py-1 rounded-full mb-3">
              {data.badge[isAr ? 'ar' : 'en']}
            </span>
          </FadeUp>
          <FadeUp delay={200} duration={700}>
            <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              {data.title[isAr ? 'ar' : 'en']}
            </h2>
          </FadeUp>
          <FadeUp delay={300} duration={700}>
            <p className="font-secondary text-base sm:text-lg text-foreground/70 leading-relaxed">
              {data.subtitle[isAr ? 'ar' : 'en']}
            </p>
          </FadeUp>
        </div>

        {/* 6-Card Perks Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {data.items.map((perk: CareerPerk, idx: number) => {
            const IconComp = iconMap[perk.iconName] || TbWorld;

            return (
              <FadeUp key={perk.id} delay={150 + idx * 80} duration={700}>
                <div className="group relative flex flex-col justify-between h-full p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-black/8 shadow-xs hover:shadow-xl hover:border-persici-crimson/30 transition-all duration-300">
                  {/* Subtle top indicator on hover */}
                  <div className="absolute top-0 inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-persici-crimson to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-persici-crimson/10 flex items-center justify-center text-persici-crimson transition-transform duration-300 group-hover:scale-110 group-hover:bg-persici-crimson group-hover:text-white">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-black/5 text-foreground/70">
                        {perk.tag[isAr ? 'ar' : 'en']}
                      </span>
                    </div>

                    <h3 className="font-primary text-lg sm:text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-persici-crimson transition-colors">
                      {perk.title[isAr ? 'ar' : 'en']}
                    </h3>

                    <p className="font-secondary text-xs sm:text-sm text-foreground/65 leading-relaxed">
                      {perk.description[isAr ? 'ar' : 'en']}
                    </p>
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
