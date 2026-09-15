'use client';

import React from 'react';
import Image from 'next/image';
import { TbMapPin } from 'react-icons/tb';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';
import type { CareersHubData } from '../data/careers.data';

export interface CareersCultureSectionProps {
  data: CareersHubData['culture'];
  lang: string;
}

export function CareersCultureSection({ data, lang }: CareersCultureSectionProps) {
  const isAr = lang === 'ar';
  const photos = data.photos;

  return (
    <section id="culture" className={`bg-white border-y border-black/5 ${sectionPaddingY} relative overflow-hidden`}>
      <div className={sectionContainer}>
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <FadeUp delay={100} duration={600}>
            <span className="inline-block font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-persici-crimson bg-persici-crimson/10 px-3.5 py-1 rounded-full mb-3">
              {data.badge[isAr ? 'ar' : 'en']}
            </span>
          </FadeUp>
          <FadeUp delay={200} duration={700}>
            <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              {data.title[isAr ? 'ar' : 'en']}
            </h2>
          </FadeUp>
          <FadeUp delay={300} duration={700}>
            <p className="font-secondary text-base sm:text-lg text-foreground/70 leading-relaxed">
              {data.description[isAr ? 'ar' : 'en']}
            </p>
          </FadeUp>
        </div>

        {/* Asymmetric 4-Photo Bento Grid */}
        <FadeUp delay={400} duration={800}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
            {/* Photo 1: Large Featured Portrait (5 cols) */}
            {photos[0] && (
              <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[480px] lg:min-h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-black/8 group shadow-xs">
                <Image
                  src={photos[0].image}
                  alt={photos[0].title[isAr ? 'ar' : 'en']}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium text-white mb-2">
                    <TbMapPin className="w-3.5 h-3.5 text-persici-blush" />
                    <span>{photos[0].location[isAr ? 'ar' : 'en']}</span>
                  </div>
                  <h3 className="font-primary text-lg sm:text-xl font-bold leading-snug">
                    {photos[0].title[isAr ? 'ar' : 'en']}
                  </h3>
                </div>
              </div>
            )}

            {/* Photos 2, 3, 4: Right Grid (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
              {/* Row 1: 2 Photos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1">
                {photos[1] && (
                  <div className="relative min-h-[240px] sm:min-h-[270px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-black/8 group shadow-xs">
                    <Image
                      src={photos[1].image}
                      alt={photos[1].title[isAr ? 'ar' : 'en']}
                      fill
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-medium text-white mb-1.5">
                        <TbMapPin className="w-3 h-3 text-persici-blush" />
                        <span>{photos[1].location[isAr ? 'ar' : 'en']}</span>
                      </div>
                      <h4 className="font-primary text-sm sm:text-base font-bold leading-snug">
                        {photos[1].title[isAr ? 'ar' : 'en']}
                      </h4>
                    </div>
                  </div>
                )}

                {photos[2] && (
                  <div className="relative min-h-[240px] sm:min-h-[270px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-black/8 group shadow-xs">
                    <Image
                      src={photos[2].image}
                      alt={photos[2].title[isAr ? 'ar' : 'en']}
                      fill
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-medium text-white mb-1.5">
                        <TbMapPin className="w-3 h-3 text-persici-blush" />
                        <span>{photos[2].location[isAr ? 'ar' : 'en']}</span>
                      </div>
                      <h4 className="font-primary text-sm sm:text-base font-bold leading-snug">
                        {photos[2].title[isAr ? 'ar' : 'en']}
                      </h4>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 2: Wide Panoramic Photo */}
              {photos[3] && (
                <div className="relative min-h-[240px] sm:min-h-[280px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-black/8 group shadow-xs">
                  <Image
                    src={photos[3].image}
                    alt={photos[3].title[isAr ? 'ar' : 'en']}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 text-white">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium text-white mb-2">
                      <TbMapPin className="w-3.5 h-3.5 text-persici-blush" />
                      <span>{photos[3].location[isAr ? 'ar' : 'en']}</span>
                    </div>
                    <h3 className="font-primary text-base sm:text-lg font-bold leading-snug">
                      {photos[3].title[isAr ? 'ar' : 'en']}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
