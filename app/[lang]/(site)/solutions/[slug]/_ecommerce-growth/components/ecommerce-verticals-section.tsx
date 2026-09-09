'use client';

import React from 'react';
import type { EcommerceVerticalItem } from '../data/ecommerce-growth.data';
import { SolutionsVerticalCard } from '../../../_solutions/components';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';
import {
  TbSparkles,
  TbShoppingBag,
  TbShieldCheck,
  TbTruck,
  TbBolt,
} from 'react-icons/tb';

interface EcommerceVerticalsSectionProps {
  verticals: EcommerceVerticalItem[];
  title: string;
  subtitle: string;
  lang: string;
}

const iconMap: Record<string, React.ElementType> = {
  Sparkles: TbSparkles,
  ShoppingBag: TbShoppingBag,
  ShieldCheck: TbShieldCheck,
  Truck: TbTruck,
  Zap: TbBolt,
};

export function EcommerceVerticalsSection({
  verticals,
  title,
  subtitle,
  lang,
}: EcommerceVerticalsSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section id="verticals" className="py-20 sm:py-28 lg:py-32 bg-[#F9F8F6] border-y border-black/[0.04] scroll-mt-24">
      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'القطاعات والأسواق المتخصصة' : 'Domain Verticals'}
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
            const capabilities = vert.capabilities[lang as 'en' | 'ar'] || vert.capabilities.en;
            const IconComponent = iconMap[vert.iconName] || TbSparkles;

            return (
              <FadeUp
                key={vert.id}
                delay={idx * 80}
                duration={650}
                distance={24}
                className="flex"
              >
                <SolutionsVerticalCard
                  number={vert.number}
                  tag={vertTag}
                  title={vertTitle}
                  description={vertDesc}
                  capabilities={capabilities}
                  icon={IconComponent}
                  iconStyle="badge"
                />
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
