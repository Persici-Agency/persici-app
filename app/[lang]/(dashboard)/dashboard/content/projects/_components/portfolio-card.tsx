'use client';

import React from 'react';
import Image from 'next/image';
import {
  TbEdit,
  TbTrash,
  TbExternalLink,
  TbStar,
  TbStarFilled,
  TbDeviceDesktop,
  TbDeviceMobile,
  TbMovie,
  TbPhoto,
} from 'react-icons/tb';
import type { ClientStoryDetail, StoryTemplateType } from '@/app/[lang]/(site)/client-stories/_client-stories/types';

interface PortfolioCardProps {
  story: ClientStoryDetail;
  lang: string;
  onEdit: (story: ClientStoryDetail) => void;
  onDelete: (slug: string) => void;
  onToggleFeatured: (story: ClientStoryDetail) => void;
}

const TEMPLATE_CONFIG: Record<
  StoryTemplateType,
  { labelEn: string; labelAr: string; icon: React.ElementType; color: string }
> = {
  'software-web-app-showcase': {
    labelEn: 'Web App',
    labelAr: 'تطبيق ويب',
    icon: TbDeviceDesktop,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'mobile-app-showcase': {
    labelEn: 'Mobile App',
    labelAr: 'تطبيق جوال',
    icon: TbDeviceMobile,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  'marketing-video-showcase': {
    labelEn: 'Marketing Video',
    labelAr: 'فيديو ترويجي',
    icon: TbMovie,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  'image-gallery-showcase': {
    labelEn: 'Image Gallery',
    labelAr: 'معرض صور',
    icon: TbPhoto,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};

export function PortfolioCard({
  story,
  lang,
  onEdit,
  onDelete,
  onToggleFeatured,
}: PortfolioCardProps) {
  const isRtl = lang === 'ar';
  const title = story.title[lang as 'en' | 'ar'] || story.title.en;
  const summary = story.executiveSummary[lang as 'en' | 'ar'] || story.executiveSummary.en;
  const clientName =
    typeof story.client === 'string'
      ? story.client
      : String(
          (story.client as Record<string, string>)?.[lang] ||
            (story.client as Record<string, string>)?.en ||
            'Client'
        );

  const template = TEMPLATE_CONFIG[story.templateType] || TEMPLATE_CONFIG['marketing-video-showcase'];
  const TemplateIcon = template.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Cover Media Preview */}
        <div className="relative aspect-video bg-slate-900 overflow-hidden">
          {story.heroImage ? (
            <Image
              src={story.heroImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-102 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <TbPhoto className="w-8 h-8 opacity-40" />
            </div>
          )}

          {/* Top Overlay Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold backdrop-blur-md border shadow-xs ${template.color}`}
            >
              <TemplateIcon className="w-3.5 h-3.5" />
              <span>{isRtl ? template.labelAr : template.labelEn}</span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFeatured(story);
              }}
              className={`pointer-events-auto p-1.5 rounded-lg backdrop-blur-md border transition-all ${
                story.featured
                  ? 'bg-amber-500/90 text-white border-amber-400 shadow-xs'
                  : 'bg-black/40 text-white/70 hover:text-white border-white/20 hover:bg-black/60'
              }`}
              title={story.featured ? 'Featured story' : 'Mark as featured'}
            >
              {story.featured ? (
                <TbStarFilled className="w-4 h-4 text-amber-200" />
              ) : (
                <TbStar className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Category Pill at Bottom-Left of Cover */}
          <div className="absolute bottom-2.5 start-3 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/60 text-white/90 backdrop-blur-md border border-white/10">
              {story.category[lang as 'en' | 'ar'] || story.category.en}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-persici-crimson">{clientName}</span>
            <span className="font-mono text-[11px] text-slate-400">/{story.slug}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
            {title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {summary}
          </p>

          {/* Impact Metrics Preview */}
          {story.metrics && story.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              {story.metrics.slice(0, 2).map((m, mi) => (
                <div key={mi} className="bg-slate-50/80 p-2 rounded-xl text-center border border-slate-100">
                  <p className="text-sm font-bold font-mono text-slate-900 leading-tight">
                    {m.value}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {m.label[lang as 'en' | 'ar'] || m.label.en}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
        <a
          href={`/${lang}/client-stories/${story.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-persici-crimson transition-colors"
        >
          <TbExternalLink className="w-3.5 h-3.5" />
          <span>{isRtl ? 'عرض القصة المباشرة' : 'View Live Story'}</span>
        </a>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(story)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-none hover:shadow-xs"
            title={isRtl ? 'تعديل دراسة الحالة' : 'Edit Story'}
          >
            <TbEdit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(story.slug)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
            title={isRtl ? 'حذف دراسة الحالة' : 'Delete Story'}
          >
            <TbTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
