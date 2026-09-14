'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { ClientStoryDetail } from '../../../_client-stories/types';
import { sectionContainer } from '@shared/constants';
import { TbBriefcase, TbWorld, TbBolt, TbMapPin } from 'react-icons/tb';

export interface StoryMetadataStripProps {
  story: ClientStoryDetail;
  lang: string;
}

export function StoryMetadataStrip({ story, lang }: StoryMetadataStripProps) {
  const isRtl = lang === 'ar';
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const topic = story.topic[lang as 'en' | 'ar'] || story.topic.en;
  const region = story.region[lang as 'en' | 'ar'] || story.region.en;
  const servicesList = story.services || [];
  const servicesText = servicesList
    .map((s) => s[lang as 'en' | 'ar'] || s.en)
    .join(', ');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const items = [
    {
      id: 'client',
      icon: TbBriefcase,
      label: isRtl ? 'العميل' : 'Client',
      value: story.client,
    },
    {
      id: 'topic',
      icon: TbWorld,
      label: isRtl ? 'المجال' : 'Topic',
      value: topic,
    },
    {
      id: 'services',
      icon: TbBolt,
      label: isRtl ? 'الخدمات' : 'Services',
      value: servicesText,
    },
    {
      id: 'region',
      icon: TbMapPin,
      label: isRtl ? 'المنطقة' : 'Region',
      value: region,
    },
  ];

  return (
    <section
      data-header-luminance="light"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full bg-white border-b border-slate-200/80 py-8 sm:py-10"
    >
      <div ref={containerRef} className={sectionContainer}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x rtl:lg:divide-x-reverse divide-slate-200/70">
          {items.map((item, idx) => {
            const Icon = item.icon;
            // Wave animation: each item cascades in sequence
            const waveDelay = idx * 130;

            return (
              <div
                key={item.id}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                  transitionProperty: 'opacity, transform',
                  transitionDuration: '650ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${waveDelay}ms`,
                }}
                className="flex items-center gap-3.5 px-0 lg:px-6 first:lg:ps-0 last:lg:pe-0 will-change-transform"
              >
                {/* Clean Icon Container */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 shadow-2xs">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Text: Label on top, Value underneath */}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-900 tracking-tight">
                    {item.label}
                  </span>
                  <span
                    className="text-sm text-slate-600 font-medium truncate mt-0.5"
                    title={item.value}
                  >
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
