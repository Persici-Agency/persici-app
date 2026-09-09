'use client';

import React from 'react';
import type { DigitalEngineeringVerticalItem } from '../data/digital-engineering.data';
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
                <div className="group relative w-full h-full flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div>
                    {/* Top Row: Monospace Numeral Badge + Sector Icon */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <span className="font-mono text-2xl sm:text-3xl font-extrabold text-persici-crimson/80 group-hover:text-persici-crimson transition-colors">
                        {vert.number}
                      </span>
                      <div className="h-10 w-10 rounded-xl bg-persici-crimson/5 flex items-center justify-center text-persici-crimson transition-transform duration-300 group-hover:scale-110">
                        <IconComponent className="h-5 w-5" />
                      </div>
                    </div>

                    <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 block mb-2">
                      {vertTag}
                    </span>

                    <h3 className="font-primary text-xl font-bold text-slate-900 group-hover:text-persici-crimson transition-colors mb-3">
                      {vertTitle}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
                      {vertDesc}
                    </p>
                  </div>

                  {/* Capability Checklist */}
                  <div className="pt-4 border-t border-slate-100 mt-auto">
                    <ul className="space-y-2">
                      {capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-persici-crimson shrink-0 mt-1.5" />
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
