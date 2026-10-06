'use client';

import React from 'react';
import {
  TbSettings,
  TbSparkles,
  TbChartBar,
  TbFileText,
  TbAlertCircle,
  TbBulb,
  TbTrendingUp,
  TbMovie,
  TbSend,
} from 'react-icons/tb';

export interface TocItem {
  id: string;
  number: string;
  titleEn: string;
  titleAr: string;
  icon: React.ElementType;
}

export const PORTFOLIO_TOC_ITEMS: TocItem[] = [
  {
    id: 'sec-meta',
    number: '01',
    titleEn: 'General & Showcase Type',
    titleAr: 'البيانات ونوع العرض',
    icon: TbSettings,
  },
  {
    id: 'sec-hero',
    number: '02',
    titleEn: 'Hero Header & Summary',
    titleAr: 'واجهة المشروع والملخص',
    icon: TbSparkles,
  },
  {
    id: 'sec-metrics',
    number: '03',
    titleEn: 'Impact Metrics (CountUp)',
    titleAr: 'مؤشرات الأداء والأرقام',
    icon: TbChartBar,
  },
  {
    id: 'sec-intro',
    number: '04',
    titleEn: 'Section: Project Overview',
    titleAr: 'القسم الأول: نظرة عامة',
    icon: TbFileText,
  },
  {
    id: 'sec-problem',
    number: '05',
    titleEn: 'Section: The Challenge',
    titleAr: 'القسم الثاني: التحدي والمشكلة',
    icon: TbAlertCircle,
  },
  {
    id: 'sec-solution',
    number: '06',
    titleEn: 'Section: The Solution',
    titleAr: 'القسم الثالث: الحل المعماري',
    icon: TbBulb,
  },
  {
    id: 'sec-impact',
    number: '07',
    titleEn: 'Section: Business Impact',
    titleAr: 'القسم الرابع: الأثر والنتائج',
    icon: TbTrendingUp,
  },
  {
    id: 'sec-media',
    number: '08',
    titleEn: 'Deliverables & Media Showcase',
    titleAr: 'معرض المخرجات والوسائط',
    icon: TbMovie,
  },
  {
    id: 'sec-publish',
    number: '09',
    titleEn: 'Related Stories & Publish',
    titleAr: 'المشاريع ذات الصلة والنشر',
    icon: TbSend,
  },
];

interface PortfolioTocRailProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  lang: string;
}

export function PortfolioTocRail({
  activeSection,
  onSelectSection,
  lang,
}: PortfolioTocRailProps) {
  const isRtl = lang === 'ar';

  return (
    <aside
      className="w-full lg:w-64 shrink-0 bg-slate-50/70 p-3 sm:p-4 rounded-2xl border border-slate-200/80 sticky top-4 self-start"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mb-3 px-2 flex items-center justify-between">
        <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400">
          {isRtl ? 'فهرس أقسام دراسة الحالة' : 'Story Table of Contents'}
        </span>
        <span className="w-2 h-2 rounded-full bg-persici-crimson animate-pulse" />
      </div>

      <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
        {PORTFOLIO_TOC_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          const title = isRtl ? item.titleAr : item.titleEn;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-start whitespace-nowrap lg:whitespace-normal cursor-pointer shrink-0 lg:shrink ${
                isActive
                  ? 'bg-persici-crimson text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span
                className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {item.number}
              </span>
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
