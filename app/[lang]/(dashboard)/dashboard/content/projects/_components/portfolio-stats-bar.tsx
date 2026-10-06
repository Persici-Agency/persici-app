'use client';

import React from 'react';
import {
  TbBriefcase,
  TbDeviceDesktop,
  TbDeviceMobile,
  TbMovie,
  TbStar,
} from 'react-icons/tb';
import type { ClientStoryDetail } from '@/app/[lang]/(site)/client-stories/_client-stories/types';

interface PortfolioStatsBarProps {
  stories: ClientStoryDetail[];
  lang: string;
}

export function PortfolioStatsBar({ stories, lang }: PortfolioStatsBarProps) {
  const isRtl = lang === 'ar';

  const total = stories.length;
  const webApps = stories.filter(
    (s) => s.templateType === 'software-web-app-showcase'
  ).length;
  const mobileApps = stories.filter(
    (s) => s.templateType === 'mobile-app-showcase'
  ).length;
  const marketingVideos = stories.filter(
    (s) => s.templateType === 'marketing-video-showcase' || s.categorySlug === 'video-production'
  ).length;
  const featuredCount = stories.filter((s) => s.featured).length;

  const stats = [
    {
      label: isRtl ? 'إجمالي المشاريع' : 'Total Stories',
      value: total,
      icon: TbBriefcase,
      color: 'text-persici-crimson bg-persici-crimson/10 border-persici-crimson/20',
    },
    {
      label: isRtl ? 'تطبيقات الويب' : 'Web & Platforms',
      value: webApps,
      icon: TbDeviceDesktop,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      label: isRtl ? 'تطبيقات الجوال' : 'Mobile Apps',
      value: mobileApps,
      icon: TbDeviceMobile,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      label: isRtl ? 'حملات وإنتاج مرئي' : 'Marketing & Reels',
      value: marketingVideos,
      icon: TbMovie,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      label: isRtl ? 'قصص مميزة' : 'Featured Flagships',
      value: featuredCount,
      icon: TbStar,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-shadow"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold font-mono text-slate-900 leading-none">
                {item.value}
              </p>
              <p className="text-xs text-slate-500 font-medium truncate mt-1">
                {item.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
