'use client';

import React from 'react';
import type { TechStackPod } from '../data/supply-chain.data';
import { SolutionsTechStackCard } from '../../../_solutions/components';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';
import { TbBrain, TbLayersLinked, TbRobot, TbRadar2 } from 'react-icons/tb';

interface SupplyChainTechStackSectionProps {
  pods: TechStackPod[];
  title: string;
  subtitle: string;
  lang: string;
}

const podIcons = [
  TbBrain,
  TbLayersLinked,
  TbRobot,
  TbRadar2,
];

export function SupplyChainTechStackSection({
  pods,
  title,
  subtitle,
  lang,
}: SupplyChainTechStackSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <section className={`${sectionPaddingY} bg-[#0E121B] relative overflow-hidden text-white`}>
      {/* Ambient Crimson Glow Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-persici-crimson/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-persici-blush/5 rounded-full blur-3xl pointer-events-none" />

      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 relative z-10">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'المنظومة التقنية لسلاسل الإمداد' : 'Supply Chain Technology Matrix'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            {subtitle}
          </p>
        </FadeUp>

        {/* 4 Tech Pods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto relative z-10">
          {pods.map((pod, idx) => {
            const Icon = podIcons[idx % podIcons.length];
            const podTitle = pod.title[lang as 'en' | 'ar'] || pod.title.en;
            const podBadge = pod.badge[lang as 'en' | 'ar'] || pod.badge.en;
            const podDesc = pod.description[lang as 'en' | 'ar'] || pod.description.en;

            return (
              <FadeUp
                key={idx}
                delay={idx * 100}
                duration={700}
                distance={24}
                className="flex"
              >
                <SolutionsTechStackCard
                  badge={podBadge}
                  title={podTitle}
                  description={podDesc}
                  technologies={pod.technologies}
                  icon={Icon}
                  headerLayout="stacked"
                  variant="pills"
                />
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
