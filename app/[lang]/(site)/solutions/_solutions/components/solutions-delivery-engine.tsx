import React from 'react';
import type { SolutionExecutionPillar } from '@shared/types';
import { sectionContainer } from '@shared/constants';
import { ShapedImageContainer, FadeUp } from '@shared';

interface SolutionsDeliveryEngineProps {
  title: string;
  subtitle: string;
  image: string;
  pillars: SolutionExecutionPillar[];
  lang: string;
  className?: string;
}

export function SolutionsDeliveryEngine({
  title,
  subtitle,
  image,
  pillars,
  lang,
  className,
}: SolutionsDeliveryEngineProps) {
  const isRtl = lang === 'ar';

  return (
    <section className={`${className || 'pt-16 pb-14 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20'} bg-white text-slate-900 relative overflow-hidden`}>
      <div className={sectionContainer}>
        {/* Section Header with FadeUp */}
        <FadeUp delay={0} duration={700} distance={20} className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {isRtl ? 'إطار العمل التنفيذي' : 'Execution Framework'}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
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
              <div className="space-y-6 sm:space-y-8 divide-y divide-slate-100">
                {pillars.map((pillar, idx) => {
                  const pillarTitle = pillar.title[lang as 'en' | 'ar'] || pillar.title.en;
                  const pillarDesc = pillar.description[lang as 'en' | 'ar'] || pillar.description.en;

                  return (
                    <div key={idx} className={idx > 0 ? 'pt-6 sm:pt-8' : ''}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-persici-crimson text-white text-xs font-extrabold shadow-sm">
                          0{idx + 1}
                        </span>
                        <h3 className="font-primary text-xl font-bold text-slate-900 tracking-tight">
                          {pillarTitle}
                        </h3>
                      </div>
                      <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600 pl-10 rtl:pl-0 rtl:pr-10">
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
