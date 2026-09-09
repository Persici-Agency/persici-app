'use client';

import React from 'react';
import type { DigitalEngineeringVerticalItem } from '../data/digital-engineering.data';
import { IndustryCard } from '@shared';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';
import {
  TbCreditCard,
  TbServer2,
  TbHeartRateMonitor,
  TbTruckDelivery,
  TbBolt,
  TbBuildingStore,
} from 'react-icons/tb';

interface DigitalEngineeringVerticalsSectionProps {
  verticals: DigitalEngineeringVerticalItem[];
  title: string;
  subtitle: string;
  lang: string;
}

const verticalIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'high-frequency-fintech-banking': TbCreditCard,
  'telecommunications-5g-edge': TbServer2,
  'healthcare-informatics-iomt': TbHeartRateMonitor,
  'mobility-automotive-logistics': TbTruckDelivery,
  'energy-iot-commodities': TbBolt,
};

export function DigitalEngineeringVerticalsSection({
  verticals,
  title,
  subtitle,
  lang,
}: DigitalEngineeringVerticalsSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section className={`${sectionPaddingY} bg-[#FAFAFA] relative border-y border-slate-100`}>
      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'القطاعات والصناعات الحيوية' : 'Industry Architectures'}
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
                <IndustryCard
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
