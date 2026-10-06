'use client';

import React from 'react';
import Image from 'next/image';
import {
  TbPhoto,
  TbVideo,
} from 'react-icons/tb';
import type { ClientStoryDetail } from '@/app/[lang]/(site)/client-stories/_client-stories/types';

interface PortfolioHeroSectionProps {
  story: ClientStoryDetail;
  onChange: (updated: ClientStoryDetail) => void;
  lang: string;
  onOpenMediaPicker: (target: 'heroImage' | 'heroVideo' | 'heroVideoPoster', type: 'image' | 'video') => void;
}

export function PortfolioHeroSection({
  story,
  onChange,
  lang,
  onOpenMediaPicker,
}: PortfolioHeroSectionProps) {
  const isRtl = lang === 'ar';

  return (
    <div id="sec-hero" className="space-y-6 pt-2">
      <div className="border-b border-slate-200 pb-3">
        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-persici-crimson/10 text-persici-crimson text-xs font-mono font-bold flex items-center justify-center">
            02
          </span>
          <span>{isRtl ? 'واجهة المشروع والملخص التنفيذي' : 'Hero Header & Executive Overview'}</span>
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          {isRtl
            ? 'عنوان المشروع الرئيسي، العبارة التقديمية، الملخص الشامل، وصورة وفيديو الغلاف عالي الدقة.'
            : 'Primary headline, introductory hook, executive summary, high-resolution cover image, and showcase video.'}
        </p>
      </div>

      {/* 1. Title (EN & AR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {isRtl ? 'العنوان الرئيسي (English)' : 'Primary Title (English)'}
          </label>
          <input
            type="text"
            required
            value={story.title?.en || ''}
            onChange={(e) =>
              onChange({
                ...story,
                title: { en: e.target.value, ar: story.title?.ar || '' },
              })
            }
            placeholder="e.g. Khazan: Crafting 'Alz Al-Lahzat' Campaign"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {isRtl ? 'العنوان الرئيسي (العربية)' : 'Primary Title (Arabic)'}
          </label>
          <input
            type="text"
            dir="rtl"
            required
            value={story.title?.ar || ''}
            onChange={(e) =>
              onChange({
                ...story,
                title: { en: story.title?.en || '', ar: e.target.value },
              })
            }
            placeholder="خزان: صياغة حملة 'ألذ اللحظات' لترسيخ أسعد الأوقات"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none font-medium font-arabic"
          />
        </div>
      </div>

      {/* 2. Lead Subtitle (EN & AR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'العبارة التقديمية الفرعية (EN)' : 'Lead Subtitle Hook (EN)'}
          </label>
          <textarea
            rows={2}
            value={story.leadSubtitle?.en || ''}
            onChange={(e) =>
              onChange({
                ...story,
                leadSubtitle: { en: e.target.value, ar: story.leadSubtitle?.ar || '' },
              })
            }
            placeholder="Connecting a generational legacy of premium halal foods..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'العبارة التقديمية الفرعية (AR)' : 'Lead Subtitle Hook (AR)'}
          </label>
          <textarea
            rows={2}
            dir="rtl"
            value={story.leadSubtitle?.ar || ''}
            onChange={(e) =>
              onChange({
                ...story,
                leadSubtitle: { en: story.leadSubtitle?.en || '', ar: e.target.value },
              })
            }
            placeholder="ربط إرث عريق من المنتجات الحلال المتميزة بدفء اللقاءات العائلية..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none font-arabic"
          />
        </div>
      </div>

      {/* 3. Executive Summary (EN & AR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'الملخص التنفيذي الشامل (EN)' : 'Executive Summary (EN)'}
          </label>
          <textarea
            rows={3}
            value={story.executiveSummary?.en || ''}
            onChange={(e) =>
              onChange({
                ...story,
                executiveSummary: { en: e.target.value, ar: story.executiveSummary?.ar || '' },
              })
            }
            placeholder="Persici engineered an end-to-end transformation..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none leading-relaxed"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'الملخص التنفيذي الشامل (AR)' : 'Executive Summary (AR)'}
          </label>
          <textarea
            rows={3}
            dir="rtl"
            value={story.executiveSummary?.ar || ''}
            onChange={(e) =>
              onChange({
                ...story,
                executiveSummary: { en: story.executiveSummary?.en || '', ar: e.target.value },
              })
            }
            placeholder="طوّرت بيرسيشي بنية رقمية واستراتيجية تحول متكاملة..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none leading-relaxed font-arabic"
          />
        </div>
      </div>

      {/* 4. Cover Hero Image (R2 Media Picker + Live Preview) */}
      <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {isRtl ? 'صورة الغلاف الرئيسية (Hero Cover Image)' : 'Hero Cover Image (Cloudflare R2)'}
        </label>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="relative w-full sm:w-48 aspect-video rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200 shadow-xs">
            {story.heroImage ? (
              <Image
                src={story.heroImage}
                alt="Hero Cover"
                fill
                className="object-cover"
                sizes="192px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <TbPhoto className="w-8 h-8 opacity-40" />
              </div>
            )}
          </div>

          <div className="flex-1 w-full space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={story.heroImage || ''}
                onChange={(e) => onChange({ ...story, heroImage: e.target.value })}
                placeholder="https://pub-...r2.dev/client-stories/.../cover.webp"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:border-persici-crimson outline-none"
              />
              <button
                type="button"
                onClick={() => onOpenMediaPicker('heroImage', 'image')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <TbPhoto className="w-4 h-4" />
                <span>{isRtl ? 'اختيار من R2' : 'Pick Image'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              {isRtl
                ? 'يفضل استخدام صيغة WebP بأبعاد 1920x1080 لضمان السرعة وتفادي بطء التحميل.'
                : 'Recommended: WebP format at 1920x1080 (q85, effort 6) for optimal Core Web Vitals.'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Hero Video & Poster (Optional Video Showcase) */}
      <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {isRtl ? 'فيديو واجهة المشروع (Hero Video Reel - Optional)' : 'Hero Video Reel (Optional)'}
        </label>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {isRtl ? 'رابط الفيديو (MP4 / WebM)' : 'Video URL (MP4 / WebM)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={story.heroVideo || ''}
                  onChange={(e) => onChange({ ...story, heroVideo: e.target.value })}
                  placeholder="https://pub-...r2.dev/.../video.mp4"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:border-persici-crimson outline-none"
                />
                <button
                  type="button"
                  onClick={() => onOpenMediaPicker('heroVideo', 'video')}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 border border-amber-200 transition-colors cursor-pointer"
                >
                  <TbVideo className="w-4 h-4 text-amber-600" />
                  <span>{isRtl ? 'فيديو R2' : 'Pick Video'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {isRtl ? 'صورة بوستر الفيديو (Poster Image)' : 'Video Poster Image'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={story.heroVideoPoster || ''}
                  onChange={(e) => onChange({ ...story, heroVideoPoster: e.target.value })}
                  placeholder="https://pub-...r2.dev/.../poster.webp"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:border-persici-crimson outline-none"
                />
                <button
                  type="button"
                  onClick={() => onOpenMediaPicker('heroVideoPoster', 'image')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <TbPhoto className="w-4 h-4" />
                  <span>{isRtl ? 'بوستر' : 'Pick Poster'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
