'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@shared/utils';

export interface PanoramicCardProps {
  image: string;
  title: string;
  description: string;
  badge?: string;
  href?: string;
  lang?: string;
  className?: string;
}

/**
 * Universal Panoramic Card with Frosted Glass Overlay
 * Directly modeled on the signature Publicis Sapient panoramic trend cards (media_1788984559145.png).
 * Reusable across any section or page in the application.
 */
export function PanoramicCard({
  image,
  title,
  description,
  badge,
  href,
  lang = 'en',
  className = '',
}: PanoramicCardProps) {
  const isRtl = lang === 'ar';

  const cardContent = (
    <div
      className={cn(
        'group relative w-full h-[380px] sm:h-[440px] md:h-[460px] lg:h-[490px] xl:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-6 sm:p-8 lg:p-10 select-none border border-black/5 bg-slate-900',
        className
      )}
    >
      {/* Background Photographic Asset */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 95vw, (max-width: 1280px) 70vw, 850px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Very subtle bottom vignette for ambient depth without darkening the content box */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

      {/* Floating Frosted Glassmorphic Badge (Refined border radius & decreased opacity matching reference media_1788984559145.png) */}
      <div className="relative z-10 max-w-md sm:max-w-lg w-full rounded-xl p-6 sm:p-7 bg-slate-600/28 backdrop-blur-xl border border-white/25 text-white shadow-lg transition-all duration-300 group-hover:bg-slate-600/38">
        {badge && (
          <span className="inline-block text-[11px] font-mono font-semibold tracking-wider uppercase text-white/95 bg-white/20 border border-white/25 px-2.5 py-0.5 rounded-full mb-2.5">
            {badge}
          </span>
        )}

        <h3 className="font-primary text-xl sm:text-2xl font-bold text-white mb-2 leading-tight drop-shadow-xs">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal line-clamp-4 drop-shadow-xs">
          {description}
        </p>

        {href && (
          <div className="mt-3.5 flex items-center gap-1.5 text-xs font-semibold text-white hover:text-persici-crimson transition-colors">
            <span>{isRtl ? 'اكتشف المزيد' : 'Learn more'}</span>
            <span className={`transition-transform duration-300 ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
              {isRtl ? '←' : '→'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full focus:outline-none focus:ring-2 focus:ring-persici-crimson rounded-xl sm:rounded-2xl">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
