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
  TbCpu,
  TbPalette,
  TbFilePencil,
  TbRotateClockwise2,
} from 'react-icons/tb';
import {
  resolveBilingualText,
  type ClientStoryDetail,
  type StoryTemplateType,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';

interface PortfolioCardProps {
  story: ClientStoryDetail;
  displayStory?: ClientStoryDetail;
  lang: string;
  draftStatus?: 'none' | 'unpublished-draft' | 'unsaved-edits';
  draftUpdatedAt?: string;
  onEdit: (story: ClientStoryDetail) => void;
  onDelete: (slug: string) => void;
  onToggleFeatured: (story: ClientStoryDetail) => void;
  onDiscardDraft?: (story: ClientStoryDetail) => void;
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
  'ai-platform-showcase': {
    labelEn: 'AI Platform',
    labelAr: 'منصة ذكاء اصطناعي',
    icon: TbCpu,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
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
  'marketing-branding-showcase': {
    labelEn: 'Marketing & Branding',
    labelAr: 'تسويق وهوية بصرية',
    icon: TbPalette,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
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
  displayStory,
  lang,
  draftStatus = 'none',
  draftUpdatedAt,
  onEdit,
  onDelete,
  onToggleFeatured,
  onDiscardDraft,
}: PortfolioCardProps) {
  const isRtl = lang === 'ar';
  const cardStory = displayStory || story;
  const title = resolveBilingualText(cardStory.title, lang);
  const summary = resolveBilingualText(cardStory.executiveSummary, lang);
  const partnerName = resolveBilingualText(cardStory.partner, lang);
  const clientName = resolveBilingualText(cardStory.client, lang) || 'Client';
  const isDrafted = draftStatus === 'unpublished-draft' || draftStatus === 'unsaved-edits';

  const template =
    TEMPLATE_CONFIG[cardStory.templateType] || TEMPLATE_CONFIG['marketing-video-showcase'];
  const TemplateIcon = template.icon;

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${
        isDrafted
          ? 'border-amber-300/90 ring-1 ring-amber-200/60'
          : 'border-slate-200/90'
      }`}
    >
      <div>
        {/* Cover Media Preview */}
        <div className="relative aspect-video bg-slate-900 overflow-hidden">
          {cardStory.heroImage ? (
            <Image
              src={cardStory.heroImage}
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

          {/* Category Pill & Draft Badge at Bottom of Cover */}
          <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider rtl:normal-case rtl:tracking-normal bg-black/60 text-white/90 backdrop-blur-md border border-white/10 truncate">
              {resolveBilingualText(cardStory.category, lang)}
            </span>

            {isDrafted && (
              <span
                title={
                  draftUpdatedAt
                    ? `Draft updated ${new Date(draftUpdatedAt).toLocaleString()}`
                    : undefined
                }
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-sm shrink-0"
              >
                <TbFilePencil className="w-3 h-3" />
                <span>
                  {draftStatus === 'unpublished-draft'
                    ? isRtl
                      ? 'مسودة غير منشورة'
                      : 'Draft (Unpublished)'
                    : isRtl
                    ? 'مسودة • غير منشور'
                    : 'Drafted • Unsaved Edits'}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              {partnerName && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold truncate max-w-[110px]" title={partnerName}>
                  {partnerName}
                </span>
              )}
              <span className="font-semibold text-persici-crimson truncate">{clientName}</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400 shrink-0">/{cardStory.slug}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
            {title}
          </h3>

          {(() => {
            const normalizedSummary = (summary || '').replace(
              /&lt;(\/?(?:b|strong|i|em|u|p|br)(?:\s+[^&]*?)?)&gt;/gi,
              '<$1>'
            );
            if (normalizedSummary.includes('<') && normalizedSummary.includes('>')) {
              return (
                <div
                  className="text-xs text-slate-600 line-clamp-2 leading-relaxed [&_p]:inline [&_strong]:font-semibold [&_b]:font-semibold [&_em]:italic [&_i]:italic [&_u]:underline"
                  dangerouslySetInnerHTML={{ __html: normalizedSummary }}
                />
              );
            }
            return (
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {normalizedSummary}
              </p>
            );
          })()}

          {/* Impact Metrics Preview */}
          {cardStory.metrics && cardStory.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              {cardStory.metrics.slice(0, 2).map((m, mi) => (
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
      <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/40">
        {draftStatus === 'unpublished-draft' ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <TbFilePencil className="w-3.5 h-3.5" />
            <span>{isRtl ? 'مسودة — غير منشورة بعد' : 'Draft — Not Published'}</span>
          </span>
        ) : (
          <a
            href={`/${lang}/client-stories/${story.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-persici-crimson transition-colors"
          >
            <TbExternalLink className="w-3.5 h-3.5" />
            <span>{isRtl ? 'عرض القصة المباشرة' : 'View Live Story'}</span>
          </a>
        )}

        <div className="flex items-center gap-1">
          {isDrafted && onDiscardDraft && (
            <button
              type="button"
              onClick={() => onDiscardDraft(story)}
              className="p-2 text-amber-700 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
              title={isRtl ? 'حذف المسودة والعودة لآخر نسخة منشورة' : 'Discard Draft'}
            >
              <TbRotateClockwise2 className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(story)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-none hover:shadow-xs cursor-pointer"
            title={isRtl ? 'تعديل دراسة الحالة' : 'Edit Story'}
          >
            <TbEdit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(story.slug)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
            title={isRtl ? 'حذف دراسة الحالة' : 'Delete Story'}
          >
            <TbTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
