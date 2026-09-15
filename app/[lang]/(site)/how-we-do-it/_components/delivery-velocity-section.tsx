'use client';

import React from 'react';
import Image from 'next/image';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import type { SolutionExecutionPillar } from '@shared/types';

interface DeliveryVelocitySectionProps {
  title: string;
  subtitle: string;
  image: string;
  pillars: SolutionExecutionPillar[];
  lang: string;
}

export function DeliveryVelocitySection({
  title,
  subtitle,
  image,
  pillars,
  lang,
}: DeliveryVelocitySectionProps) {
  const isRtl = lang === 'ar';

  const metrics = [
    {
      value: '6',
      unit: isRtl ? 'أسابيع' : 'Weeks',
      label: isRtl ? 'متوسط إطلاق أول نسخة تشغيلية (MVP)' : 'Average MVP Production Launch',
    },
    {
      value: '10x',
      unit: '',
      label: isRtl ? 'تسريع وتيرة دورات النشر والتحديث' : 'Deployment Velocity Acceleration',
    },
    {
      value: '-38%',
      unit: '',
      label: isRtl ? 'خفض تكلفة اكتساب العملاء والهدر التقني' : 'Reduction in CAC & Overhead Waste',
    },
    {
      value: '99.98%',
      unit: '',
      label: isRtl ? 'استقرار وتشغيل مستمر للأنظمة السحابية' : 'Platform Availability & Uptime',
    },
  ];

  return (
    <section className={`w-full bg-[#F9F8F6] ${sectionPaddingY}`}>
      <div className={sectionContainer}>
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-persici-crimson/10 border border-persici-crimson/20 text-persici-crimson text-xs font-semibold uppercase tracking-wider mb-4">
            {isRtl ? 'السرعة والفاعلية التنفيذية' : 'Velocity & Engineering Execution'}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-primary font-medium text-slate-900 tracking-tight leading-tight mb-5">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-secondary leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="font-mono text-3xl sm:text-4xl font-semibold text-persici-crimson">
                  {m.value}
                </span>
                {m.unit && (
                  <span className="font-primary text-sm font-semibold text-slate-700">
                    {m.unit}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-secondary leading-normal">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {/* Image & Execution Pillars Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual Container with Sapient styled tab shape */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80">
              <Image
                src={image}
                alt="Agile Engineering Velocity"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 inset-x-6 text-white">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-persici-crimson text-white mb-2">
                  {isRtl ? 'فرق عمل مستقلة' : 'Autonomous Squads'}
                </span>
                <p className="text-sm font-secondary text-slate-200">
                  {isRtl
                    ? 'نختصر دورات التنفيذ من أشهر إلى أيام عبر نماذج عمل متكاملة.'
                    : 'Cutting development cycles from months to days with high-velocity pods.'}
                </p>
              </div>
            </div>
          </div>

          {/* Pillars List */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {pillars.map((pillar, idx) => {
              const pTitle = pillar.title[lang as 'en' | 'ar'] || pillar.title.en;
              const pDesc = pillar.description[lang as 'en' | 'ar'] || pillar.description.en;
              const numStr = pillar.number || `0${idx + 1}`;

              return (
                <div
                  key={numStr}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-persici-crimson/40 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start"
                >
                  <span className="font-mono text-2xl font-semibold text-persici-crimson bg-persici-crimson/10 px-3 py-1.5 rounded-xl shrink-0">
                    {numStr}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-primary font-medium text-slate-900 mb-2">
                      {pTitle}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 font-secondary leading-relaxed">
                      {pDesc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
