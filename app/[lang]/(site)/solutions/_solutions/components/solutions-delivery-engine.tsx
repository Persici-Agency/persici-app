import React from 'react';
import type { SolutionExecutionPillar } from '@shared/types';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { ShapedImageContainer, FadeUp } from '@shared';

interface SolutionsDeliveryEngineProps {
  title: string;
  subtitle: string;
  image: string;
  pillars: SolutionExecutionPillar[];
  lang: string;
}

export function SolutionsDeliveryEngine({
  title,
  subtitle,
  image,
  pillars,
  lang,
}: SolutionsDeliveryEngineProps) {
  const isRtl = lang === 'ar';

  return (
    <section className={`${sectionPaddingY} bg-gradient-to-br from-persici-crimson via-[#E04537] to-persici-blush text-white relative overflow-hidden`}>
      {/* Subtle ambient lighting highlights */}
      <div
        className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-black/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className={sectionContainer}>
        {/* Section Header with FadeUp */}
        <FadeUp delay={0} duration={700} distance={20} className="max-w-3xl mb-12 sm:mb-16">
          <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white bg-white/15 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full mb-3">
            {isRtl ? 'إطار العمل التنفيذي' : 'Execution Framework'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed font-normal">
            {subtitle}
          </p>
        </FadeUp>

        {/* Two-Column Grid: Mockup + Pillars */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Visual / Mockup Column with ShapedImageContainer */}
          <div className="lg:col-span-5 relative">
            <FadeUp
              direction={isRtl ? 'left' : 'right'}
              distance={28}
              duration={800}
              className="relative"
            >
              <ShapedImageContainer
                shape="sapient-tab-tr"
                src={image}
                alt={title}
                aspectRatio="aspect-4/3"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="drop-shadow-2xl"
              />
            </FadeUp>
          </div>

          {/* Pillars Column with FadeUp */}
          <div className="lg:col-span-7">
            <FadeUp
              direction={isRtl ? 'right' : 'left'}
              delay={150}
              distance={28}
              duration={800}
            >
              <div className="space-y-6 sm:space-y-8 divide-y divide-white/20">
                {pillars.map((pillar, idx) => {
                  const pillarTitle = pillar.title[lang as 'en' | 'ar'] || pillar.title.en;
                  const pillarDesc = pillar.description[lang as 'en' | 'ar'] || pillar.description.en;

                  return (
                    <div key={idx} className={idx > 0 ? 'pt-6 sm:pt-8' : ''}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-persici-crimson text-xs font-extrabold shadow-sm">
                          0{idx + 1}
                        </span>
                        <h3 className="font-primary text-xl font-bold text-white tracking-tight">
                          {pillarTitle}
                        </h3>
                      </div>
                      <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-white/90 pl-10 rtl:pl-0 rtl:pr-10">
                        {pillarDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
