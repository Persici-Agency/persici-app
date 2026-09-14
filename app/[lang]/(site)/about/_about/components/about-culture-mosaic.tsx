'use client';

import React from 'react';
import Image from 'next/image';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';
import type { AboutCultureData } from '../data/about.data';

export interface AboutCultureMosaicProps {
  data: AboutCultureData;
  lang: string;
}

export function AboutCultureMosaic({ data, lang }: AboutCultureMosaicProps) {
  const isAr = lang === 'ar';
  const photo1 = data.photos[0];
  const photo2 = data.photos[1];
  const photo3 = data.photos[2];
  const photo4 = data.photos[3];

  if (!photo1 || !photo2 || !photo3 || !photo4) return null;

  return (
    <section className="pt-2 sm:pt-4 lg:pt-6 pb-14 sm:pb-20 lg:pb-24 bg-white relative overflow-hidden" id="culture">
      <div className={sectionContainer}>
        <FadeUp delay={100} duration={800} distance={20}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-4 items-stretch">
            {/* Column 1: 1 Tall Portrait Photo (Spans 5 of 12 columns, full height) */}
            <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-xs border border-black/5 group">
              <Image
                src={photo1.image}
                alt={photo1.title ? (photo1.title[isAr ? 'ar' : 'en'] || photo1.title.en) : 'Persici workspace'}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>

            {/* Column 2: 2 Rows (Spans 7 of 12 columns) */}
            <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4 lg:gap-4">
              {/* Top Row: 2 Photos (Colleague collaboration & Tech sprint) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 lg:gap-4 flex-1">
                {/* Photo 2: 7 columns width */}
                <div className="sm:col-span-7 relative min-h-[220px] sm:min-h-[260px] lg:min-h-[285px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-xs border border-black/5 group">
                  <Image
                    src={photo2.image}
                    alt={photo2.title ? (photo2.title[isAr ? 'ar' : 'en'] || photo2.title.en) : 'Persici co-workers'}
                    fill
                    sizes="(max-width: 640px) 100vw, 35vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </div>

                {/* Photo 3: 5 columns width */}
                <div className="sm:col-span-5 relative min-h-[220px] sm:min-h-[260px] lg:min-h-[285px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-xs border border-black/5 group">
                  <Image
                    src={photo3.image}
                    alt={photo3.title ? (photo3.title[isAr ? 'ar' : 'en'] || photo3.title.en) : 'Persici engineering'}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Bottom Row: 1 Panoramic Photo spanning full width */}
              <div className="relative min-h-[220px] sm:min-h-[260px] lg:min-h-[285px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-xs border border-black/5 flex-1 group">
                <Image
                  src={photo4.image}
                  alt={photo4.title ? (photo4.title[isAr ? 'ar' : 'en'] || photo4.title.en) : 'Persici community hub'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
