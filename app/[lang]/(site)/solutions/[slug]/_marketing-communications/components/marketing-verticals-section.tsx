'use client';

import React from 'react';
import type { MarketingVerticalItem } from '../data/marketing-communications.data';
import { IndustryCard } from '@shared';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';
import {
  TbDiamond,
  TbBuildingSkyscraper,
  TbShoppingBag,
  TbCoffee,
  TbBuildingBank,
} from 'react-icons/tb';

interface MarketingVerticalsSectionProps {
  verticals: MarketingVerticalItem[];
  title: string;
  subtitle: string;
  lang: string;
}

const iconMap: Record<string, React.ElementType> = {
  TbDiamond,
  TbBuildingSkyscraper,
  TbShoppingBag,
  TbCoffee,
  TbBuildingBank,
};

export function MarketingVerticalsSection({
  verticals,
  title,
  subtitle,
  lang,
}: MarketingVerticalsSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section id="verticals" className="py-20 sm:py-28 lg:py-32 bg-[#F9F8F6] border-y border-black/[0.04] scroll-mt-24">
      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'القطاعات والصناعات' : 'Domain Verticals'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {subtitle}
          </p>
        </FadeUp>

        {/* 5 Verticals Grid with Monospace Numeral Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {verticals.map((vert, idx) => {
            const vertTitle = vert.title[lang as 'en' | 'ar'] || vert.title.en;
            const vertDesc = vert.description[lang as 'en' | 'ar'] || vert.description.en;
            const vertTag = vert.tag[lang as 'en' | 'ar'] || vert.tag.en;
            const caps = vert.capabilities[lang as 'en' | 'ar'] || vert.capabilities.en;
            const IconComponent = iconMap[vert.iconName] || TbDiamond;

            return (
              <FadeUp
                key={vert.id}
                delay={idx * 80}
                duration={650}
                distance={24}
                blur={true}
                className={idx === 4 ? 'md:col-span-2 lg:col-span-1 flex' : 'flex'}
              >
                <IndustryCard
                  number={vert.number}
                  tag={vertTag}
                  title={vertTitle}
                  description={vertDesc}
                  capabilities={caps}
                  icon={IconComponent}
                  iconStyle="box"
                />
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
