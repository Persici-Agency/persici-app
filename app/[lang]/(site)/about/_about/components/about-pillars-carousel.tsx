'use client';

import React, { useMemo } from 'react';
import { PanoramicCarousel, type PanoramicCarouselItem } from '@shared';
import type { AboutPillarsData } from '../data/about.data';

export interface AboutPillarsCarouselProps {
  data: AboutPillarsData;
  lang: string;
}

export function AboutPillarsCarousel({ data, lang }: AboutPillarsCarouselProps) {
  const isAr = lang === 'ar';
  const badge = data.badge[isAr ? 'ar' : 'en'] || data.badge.en;
  const title = data.title[isAr ? 'ar' : 'en'] || data.title.en;
  const subtitle = data.subtitle[isAr ? 'ar' : 'en'] || data.subtitle.en;

  const carouselItems: PanoramicCarouselItem[] = useMemo(() => {
    return data.items.map((item) => ({
      id: item.id,
      image:
        item.image ||
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
      title: item.title,
      description: item.summary,
      badge: item.category,
      href: item.href,
    }));
  }, [data.items]);

  return (
    <PanoramicCarousel
      id="pillars"
      badge={badge}
      title={title}
      subtitle={subtitle}
      items={carouselItems}
      lang={lang}
    />
  );
}
