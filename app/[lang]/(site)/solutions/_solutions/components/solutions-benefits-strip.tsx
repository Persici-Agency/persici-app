import React from 'react';
import type { SolutionBenefitItem } from '@shared/types';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { ShapedImageContainer, FadeUp } from '@shared';

interface SolutionsBenefitsStripProps {
  title: string;
  image: string;
  benefits: SolutionBenefitItem[];
  lang: string;
}

export function SolutionsBenefitsStrip({
  title,
  image,
  benefits,
  lang,
}: SolutionsBenefitsStripProps) {
  const isRtl = lang === 'ar';

  return (
    <section className={`${sectionPaddingY} bg-white relative overflow-hidden`}>
      <div className={sectionContainer}>
        {/* Section Title with FadeUp */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
        </FadeUp>

        {/* Hero Visual Banner with Signature Shaped Silhouette */}
        <FadeUp delay={100} duration={800} distance={24} className="relative w-full">
          <ShapedImageContainer
            shape="sapient-wide-strip"
            src={image}
            alt={title}
            aspectRatio="aspect-21/9"
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="drop-shadow-lg"
          />
        </FadeUp>

        {/* 3-Column Horizontal Benefits Strip with Colored Top Accent Lines & Staggered Reveal */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((item, idx) => {
            const itemTitle = item.title[lang as 'en' | 'ar'] || item.title.en;
            const itemDesc = item.description[lang as 'en' | 'ar'] || item.description.en;
            const accentColor = item.accentColor || (idx === 0 ? '#D83427' : idx === 1 ? '#EF8C7D' : '#121212');

            return (
              <FadeUp key={idx} delay={150 + idx * 80} duration={700} distance={20} className="relative pt-6">
                {/* Colored Top Indicator Bar */}
                <div
                  className={`absolute top-0 ${isRtl ? 'right-0' : 'left-0'} h-1 w-16 rounded-full`}
                  style={{ backgroundColor: accentColor }}
                />

                <h3 className="font-primary text-xl font-bold text-slate-900 mb-3">
                  {itemTitle}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600">
                  {itemDesc}
                </p>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
