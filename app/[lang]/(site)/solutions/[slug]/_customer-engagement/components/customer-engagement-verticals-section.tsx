'use client';

import React from 'react';
import type { CustomerEngagementVerticalItem } from '../data/customer-engagement.data';
import { SolutionsVerticalCard } from '../../../_solutions/components';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';
import {
  TbBuildingStore,
  TbCreditCard,
  TbHeartRateMonitor,
  TbDeviceGamepad2,
  TbPlaneTilt,
} from 'react-icons/tb';

interface CustomerEngagementVerticalsSectionProps {
  verticals: CustomerEngagementVerticalItem[];
  title: string;
  subtitle: string;
  lang: string;
}

const verticalIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'luxury-omnichannel-retail': TbBuildingStore,
  'financial-services-banking': TbCreditCard,
  'digital-health-wellness': TbHeartRateMonitor,
  'media-entertainment-streaming': TbDeviceGamepad2,
  'aviation-travel-hospitality': TbPlaneTilt,
};

export function CustomerEngagementVerticalsSection({
  verticals,
  title,
  subtitle,
  lang,
}: CustomerEngagementVerticalsSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section className={`${sectionPaddingY} bg-[#FAFAFA] relative border-y border-slate-100`}>
      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'القطاعات والصناعات' : 'Industry Architectures'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {subtitle}
          </p>
        </FadeUp>

        {/* 5 Vertical Markets Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {verticals.map((vert, idx) => {
            const IconComponent = verticalIcons[vert.id] || TbBuildingStore;
            const vertTitle = vert.title[lang as 'en' | 'ar'] || vert.title.en;
            const vertDesc = vert.description[lang as 'en' | 'ar'] || vert.description.en;
            const vertTag = vert.tag[lang as 'en' | 'ar'] || vert.tag.en;
            const capabilities = vert.capabilities[lang as 'en' | 'ar'] || vert.capabilities.en;

            return (
              <FadeUp
                key={vert.id}
                delay={idx * 80}
                duration={700}
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