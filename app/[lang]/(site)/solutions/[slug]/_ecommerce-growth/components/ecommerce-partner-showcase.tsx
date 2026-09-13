'use client';

import React from 'react';
import Image from 'next/image';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';
import { VideoPlayer } from '@shared/components/video-player';

interface EcommercePartnerItem {
  name: string;
  role: { en: string; ar: string };
  logo: string;
}

interface EcommercePartnerShowcaseProps {
  badge: string;
  title: string;
  description: string;
  video: {
    src: string;
    poster?: string;
    title?: { en: string; ar: string };
    caption?: { en: string; ar: string };
    partnerBadge?: { en: string; ar: string };
  };
  partners: EcommercePartnerItem[];
  lang: string;
}

export function EcommercePartnerShowcase({
  badge,
  title,
  description,
  video,
  partners,
  lang,
}: EcommercePartnerShowcaseProps) {
  const isRtl = lang === 'ar';

  return (
    <section className="relative py-20 sm:py-28 bg-white overflow-hidden border-t border-slate-100">
      <div className={sectionContainer}>
        {/* Header Title & Subtitle */}
        <FadeUp delay={0} duration={700} distance={20} className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-red-50 text-persici-crimson border border-red-100 mb-4">
            {badge}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {description}
          </p>
        </FadeUp>

        {/* Featured Video Card */}
        <FadeUp delay={100} duration={750} distance={24} className="max-w-5xl mx-auto mb-16 sm:mb-20">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black border border-slate-200/80 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)]">
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              <VideoPlayer
                src={video.src}
                poster={video.poster || '/videos/solutions/e-commerce/salla-logeria-store-story-video-poster.jpg'}
                title={video.title ? (video.title[lang as 'en' | 'ar'] || video.title.en) : undefined}
                lang={lang as 'en' | 'ar'}
                className="w-full h-full"
                objectFit="contain"
              />
            </div>
          </div>
        </FadeUp>

        {/* 8 Official Partners Grid (Logo-only, borderless, light shadow, grayscale to color on hover) */}
        <FadeUp delay={180} duration={700} distance={20} className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              {isRtl ? 'الشركاء والمنصات التكنولوجية المعتمدة' : 'Certified Platform & Media Partners'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="group relative flex items-center justify-center p-4 sm:p-6 rounded-2xl bg-white border-0 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
              >
                {/* Partner Logo Only (Enlarged for high visual clarity) */}
                <div className="relative w-full h-20 sm:h-24 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={260}
                    height={156}
                    className="max-h-full w-auto max-w-[85%] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
