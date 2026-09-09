import React from 'react';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { ShapedImageContainer, FadeUp, CountUp } from '@shared';

interface SolutionsWhyItMattersProps {
  title: string;
  text: string;
  image: string;
  lang: string;
}

export function SolutionsWhyItMatters({
  title,
  text,
  image,
  lang,
}: SolutionsWhyItMattersProps) {
  const isRtl = lang === 'ar';

  return (
    <section className={`${sectionPaddingY} bg-slate-50/60 border-y border-slate-100 overflow-hidden`}>
      <div className={sectionContainer}>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Visual / Mockup Column with Publicis Sapient Signature Shaped Container */}
          <div className="lg:col-span-6 relative">
            <FadeUp
              direction={isRtl ? 'left' : 'right'}
              distance={28}
              duration={800}
              className="relative"
            >
              <ShapedImageContainer
                shape="sapient-tab-tl"
                src={image}
                alt={title}
                aspectRatio="aspect-16/10"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="drop-shadow-xl"
              />
            </FadeUp>
          </div>

          {/* Narrative Column with FadeUp */}
          <div className="lg:col-span-6">
            <FadeUp
              direction={isRtl ? 'right' : 'left'}
              delay={150}
              distance={28}
              duration={800}
            >
              <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
                {title}
              </h2>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600">
                {text}
              </p>

              {/* Micro-proof points */}
              <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-slate-200/70">
                <div>
                  <div className="font-primary text-2xl sm:text-3xl font-extrabold text-persici-crimson">
                    <CountUp value="3.4x" />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">
                    {isRtl ? 'تسارع وتيرة الإيرادات' : 'Average Revenue Velocity'}
                  </div>
                </div>
                <div>
                  <div className="font-primary text-2xl sm:text-3xl font-extrabold text-slate-900">
                    <CountUp value="-38%" />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">
                    {isRtl ? 'انخفاض تكلفة الاستحواذ' : 'Customer Acquisition Cost'}
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
