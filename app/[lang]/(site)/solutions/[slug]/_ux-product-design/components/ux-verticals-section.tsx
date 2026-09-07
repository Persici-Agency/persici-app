'use client';

import React from 'react';
import type { UxVerticalItem } from '../data/ux-product-design.data';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';
import {
  TbCreditCard,
  TbShoppingBag,
  TbLayoutGrid,
  TbHeartRateMonitor,
  TbTruck,
  TbCircleCheck,
  TbDeviceMobile,
} from 'react-icons/tb';

interface UxVerticalsSectionProps {
  verticals: UxVerticalItem[];
  title: string;
  subtitle: string;
  lang: string;
}

const verticalIconMap: Record<string, React.ElementType> = {
  'fintech-wealth': TbCreditCard,
  'ecommerce-luxury': TbShoppingBag,
  'b2b-saas': TbLayoutGrid,
  'healthcare-clinical': TbHeartRateMonitor,
  'govtech-smart-cities': TbTruck,
};

export function UxVerticalsSection({
  verticals,
  title,
  subtitle,
  lang,
}: UxVerticalsSectionProps) {
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
            const IconComponent = verticalIconMap[vert.id] || TbDeviceMobile;

            return (
              <FadeUp
                key={vert.id}
                delay={idx * 80}
                duration={650}
                distance={24}
                className="flex"
              >
                <div className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 p-7 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full">
                  <div>
                    {/* Monospace Number & Tag */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-persici-crimson transition-colors tracking-widest">
                        {vert.number}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-persici-crimson bg-persici-crimson/5 px-2.5 py-0.5 rounded-full">
                        <IconComponent className="text-xs" />
                        {vertTag}
                      </span>
                    </div>

                    <h3 className="font-primary text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-persici-crimson transition-colors">
                      {vertTitle}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                      {vertDesc}
                    </p>
                  </div>

                  {/* Capabilities Checklist */}
                  <div className="border-t border-slate-100 pt-5 mt-auto">
                    <ul className="space-y-2.5">
                      {capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="text-xs text-slate-600 flex items-start gap-2 leading-snug">
                          <TbCircleCheck className="text-persici-crimson shrink-0 text-sm mt-0.5" />
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
