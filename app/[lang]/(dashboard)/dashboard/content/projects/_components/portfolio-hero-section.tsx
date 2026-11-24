'use client';

import React from 'react';
import Image from 'next/image';
import {
  TbPhoto,
  TbVideo,
  TbCarouselHorizontal,
  TbLibraryPhoto,
  TbPlus,
  TbTrash,
  TbArrowUp,
  TbArrowDown,
  TbPlayerPlay,
  TbInfinity,
  TbArrowsLeftRight,
  TbGauge,
} from 'react-icons/tb';
import { RichTextEditor } from '@dashboard-shared/components';
import type { MediaItem } from '@dashboard-shared/components/media/types';
import type {
  ClientStoryDetail,
  StoryHeroSliderConfig,
  StoryHeroSliderImage,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';
import {
  AiFieldTrigger,
  AiTranslateTrigger,
  type StoryAiFieldControls,
} from './ai-field-trigger';

const DEFAULT_HERO_SLIDER: StoryHeroSliderConfig = {
  enabled: false,
  autoScroll: true,
  infinite: true,
  intervalMs: 4000,
  transitionMs: 650,
  showArrows: true,
  images: [],
};

const SPEED_PRESETS = [
  { id: 'fast', labelEn: 'Fast', labelAr: 'سريع', intervalMs: 2500, transitionMs: 450 },
  { id: 'normal', labelEn: 'Normal', labelAr: 'متوسط', intervalMs: 4000, transitionMs: 650 },
  { id: 'slow', labelEn: 'Slow', labelAr: 'بطيء', intervalMs: 6500, transitionMs: 900 },
] as const;

function isRenderableImageSrc(src?: string): boolean {
  const s = (src || '').trim();
  return Boolean(s && (s.startsWith('/') || s.startsWith('http://') || s.startsWith('https://')));
}

interface PortfolioHeroSectionProps {
  story: ClientStoryDetail;
  onChange: (updated: ClientStoryDetail) => void;
  lang: string;
  onOpenMediaPicker: (
    callbackOrTarget: ((url: string) => void) | 'heroImage' | 'heroVideo' | 'heroVideoPoster',
    type: 'image' | 'video'
  ) => void;
  onOpenMultiMediaPicker?: (
    callback: (urls: string[], items: MediaItem[]) => void,
    type?: 'image' | 'video' | 'all'
  ) => void;
  aiControls?: StoryAiFieldControls;
}

export function PortfolioHeroSection({
  story,
  onChange,
  lang,
  onOpenMediaPicker,
  onOpenMultiMediaPicker,
  aiControls,
}: PortfolioHeroSectionProps) {
  const isRtl = lang === 'ar';

  const slider: StoryHeroSliderConfig = {
    ...DEFAULT_HERO_SLIDER,
    ...(story.heroSlider || {}),
    images: story.heroSlider?.images || [],
  };

  const updateSlider = (patch: Partial<StoryHeroSliderConfig>) => {
    onChange({
      ...story,
      heroSlider: {
        ...slider,
        ...patch,
      },
    });
  };

  const handleToggleSlider = () => {
    updateSlider({ enabled: !slider.enabled });
  };

  const handleAddSliderImage = () => {
    const newSlide: StoryHeroSliderImage = {
      src: '',
      alt: { en: '', ar: '' },
    };
    updateSlider({ images: [...slider.images, newSlide] });
  };

  const handleBulkAddSliderImages = (urls: string[], pickedItems?: MediaItem[]) => {
    if (!urls || urls.length === 0) return;

    const itemByUrl = new Map<string, MediaItem>();
    for (const mi of pickedItems || []) {
      itemByUrl.set(mi.url, mi);
    }

    const heroUrl = (story.heroImage || '').trim();
    const existingNonEmpty = slider.images.filter((img) => Boolean(img.src.trim()));
    const existingUrls = new Set(
      [heroUrl, ...existingNonEmpty.map((img) => img.src.trim())].filter(Boolean)
    );

    const added: StoryHeroSliderImage[] = [];
    for (const rawUrl of urls) {
      const url = rawUrl.trim();
      if (!url || existingUrls.has(url)) continue;
      existingUrls.add(url);

      const meta = itemByUrl.get(rawUrl);
      const altText = meta?.alt?.trim() || meta?.title?.trim() || '';
      added.push({
        src: url,
        ...(altText ? { alt: { en: altText, ar: altText } } : {}),
      });
    }

    if (added.length === 0) return;
    updateSlider({ images: [...existingNonEmpty, ...added] });
  };

  const handleUpdateSliderImage = (
    idx: number,
    field: 'src' | 'altEn' | 'altAr',
    value: string
  ) => {
    const updated = [...slider.images];
    const current = updated[idx];
    if (!current) return;

    if (field === 'src') {
      updated[idx] = { ...current, src: value };
    } else if (field === 'altEn') {
      updated[idx] = {
        ...current,
        alt: { en: value, ar: current.alt?.ar || '' },
      };
    } else {
      updated[idx] = {
        ...current,
        alt: { en: current.alt?.en || '', ar: value },
      };
    }
    updateSlider({ images: updated });
  };

  const handleMoveSliderImage = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= slider.images.length) return;
    const updated = [...slider.images];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    updateSlider({ images: updated });
  };

  const handleRemoveSliderImage = (idx: number) => {
    const updated = [...slider.images];
    updated.splice(idx, 1);
    updateSlider({ images: updated });
  };

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
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isRtl ? 'العنوان الرئيسي للمشروع (H1 SEO Title)' : 'Primary SEO Title (EN / AR)'}
          </span>
          {aiControls && (
            <AiFieldTrigger
              lang={lang}
              hasReference={aiControls.hasReference}
              onMissingReference={aiControls.onMissingReference}
              isLoading={aiControls.generatingFieldKey === 'title'}
              onGenerate={() => aiControls.onGenerateField('title', { keyLabel: 'title' })}
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <label className="block text-[11px] font-semibold text-slate-600">
                {isRtl ? 'العنوان الرئيسي (English)' : 'Primary Title (English)'}
              </label>
              {aiControls?.onTranslate && (
                <AiTranslateTrigger
                  size="xs"
                  lang={lang}
                  targetLang="en"
                  sourceText={story.title?.ar || ''}
                  isLoading={Boolean(aiControls.translatingKeys?.['title:en'])}
                  onTranslate={() =>
                    aiControls.onTranslate!({
                      key: 'title:en',
                      text: story.title?.ar || '',
                      sourceLang: 'ar',
                      targetLang: 'en',
                      fieldHint: 'Primary SEO Title',
                      updateStory: (prev, translated) => ({
                        ...prev,
                        title: { en: translated, ar: prev.title?.ar || '' },
                      }),
                    })
                  }
                />
              )}
            </div>
            <input
              type="text"
              required={!story.title?.ar?.trim()}
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
            <div className="flex items-center justify-between gap-2 mb-1">
              <label className="block text-[11px] font-semibold text-slate-600">
                {isRtl ? 'العنوان الرئيسي (العربية)' : 'Primary Title (Arabic)'}
              </label>
              {aiControls?.onTranslate && (
                <AiTranslateTrigger
                  size="xs"
                  lang={lang}
                  targetLang="ar"
                  sourceText={story.title?.en || ''}
                  isLoading={Boolean(aiControls.translatingKeys?.['title:ar'])}
                  onTranslate={() =>
                    aiControls.onTranslate!({
                      key: 'title:ar',
                      text: story.title?.en || '',
                      sourceLang: 'en',
                      targetLang: 'ar',
                      fieldHint: 'Primary SEO Title',
                      updateStory: (prev, translated) => ({
                        ...prev,
                        title: { en: prev.title?.en || '', ar: translated },
                      }),
                    })
                  }
                />
              )}
            </div>
            <input
              type="text"
              dir="rtl"
              required={!story.title?.en?.trim()}
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
      </div>

      {/* 2. Lead Subtitle (EN & AR) */}
      <div className="space-y-1.5">
        {aiControls && (
          <div className="flex justify-end">
            <AiFieldTrigger
              lang={lang}
              hasReference={aiControls.hasReference}
              onMissingReference={aiControls.onMissingReference}
              isLoading={aiControls.generatingFieldKey === 'leadSubtitle'}
              onGenerate={() =>
                aiControls.onGenerateField('leadSubtitle', { keyLabel: 'leadSubtitle' })
              }
            />
          </div>
        )}
        <RichTextEditor
          label={isRtl ? 'العبارة التقديمية الفرعية (Lead Subtitle Hook)' : 'Lead Subtitle Hook (EN / AR)'}
          rows={3}
          uiLang={lang}
          valueEn={story.leadSubtitle?.en || ''}
          valueAr={story.leadSubtitle?.ar || ''}
          onChangeEn={(val) =>
            onChange({
              ...story,
              leadSubtitle: { en: val, ar: story.leadSubtitle?.ar || '' },
            })
          }
          onChangeAr={(val) =>
            onChange({
              ...story,
              leadSubtitle: { en: story.leadSubtitle?.en || '', ar: val },
            })
          }
          isTranslating={Boolean(aiControls?.translatingKeys?.['leadSubtitle:rte'])}
          onTranslate={
            aiControls?.onTranslate
              ? ({ sourceLang, targetLang, text }) =>
                  aiControls.onTranslate!({
                    key: 'leadSubtitle:rte',
                    text,
                    sourceLang,
                    targetLang,
                    isHtml: true,
                    fieldHint: 'Lead Subtitle Hook',
                    updateStory: (prev, translated) => ({
                      ...prev,
                      leadSubtitle: {
                        en: targetLang === 'en' ? translated : prev.leadSubtitle?.en || '',
                        ar: targetLang === 'ar' ? translated : prev.leadSubtitle?.ar || '',
                      },
                    }),
                  })
              : undefined
          }
        />
      </div>

      {/* 3. Executive Summary (EN & AR) */}
      <div className="space-y-1.5">
        {aiControls && (
          <div className="flex justify-end">
            <AiFieldTrigger
              lang={lang}
              hasReference={aiControls.hasReference}
              onMissingReference={aiControls.onMissingReference}
              isLoading={aiControls.generatingFieldKey === 'executiveSummary'}
              onGenerate={() =>
                aiControls.onGenerateField('executiveSummary', { keyLabel: 'executiveSummary' })
              }
            />
          </div>
        )}
        <RichTextEditor
          label={isRtl ? 'الملخص التنفيذي الشامل (Executive Summary)' : 'Executive Summary (EN / AR)'}
          rows={4}
          uiLang={lang}
          valueEn={story.executiveSummary?.en || ''}
          valueAr={story.executiveSummary?.ar || ''}
          onChangeEn={(val) =>
            onChange({
              ...story,
              executiveSummary: { en: val, ar: story.executiveSummary?.ar || '' },
            })
          }
          onChangeAr={(val) =>
            onChange({
              ...story,
              executiveSummary: { en: story.executiveSummary?.en || '', ar: val },
            })
          }
          isTranslating={Boolean(aiControls?.translatingKeys?.['executiveSummary:rte'])}
          onTranslate={
            aiControls?.onTranslate
              ? ({ sourceLang, targetLang, text }) =>
                  aiControls.onTranslate!({
                    key: 'executiveSummary:rte',
                    text,
                    sourceLang,
                    targetLang,
                    isHtml: true,
                    fieldHint: 'Executive Summary',
                    updateStory: (prev, translated) => ({
                      ...prev,
                      executiveSummary: {
                        en:
                          targetLang === 'en' ? translated : prev.executiveSummary?.en || '',
                        ar:
                          targetLang === 'ar' ? translated : prev.executiveSummary?.ar || '',
                      },
                    }),
                  })
              : undefined
          }
        />
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

        {/* 4B. Feature Image Slider Toggle & Settings */}
        <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                  slider.enabled
                    ? 'bg-persici-crimson text-white border-persici-crimson shadow-xs'
                    : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                <TbCarouselHorizontal className="w-4 h-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    {isRtl ? 'شريط صور متحرك للغلاف (Feature Image Slider)' : 'Feature Image Slider'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      slider.enabled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {slider.enabled
                      ? isRtl
                        ? 'مفعّل'
                        : 'Active'
                      : isRtl
                      ? 'صورة ثابتة'
                      : 'Single Image'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {isRtl
                    ? 'عند التفعيل، تبقى الصورة أعلاه هي الصورة الرئيسية للقصة والشريحة #1، وتظهر الصور الإضافية كشريط عرض تفاعلي في قسم الملخص.'
                    : 'When enabled, the cover image above stays the main story feature image and Slide #1, while extra slider images play as an interactive slider in the Summary section.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={slider.enabled}
              onClick={handleToggleSlider}
              className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 self-start sm:self-auto ${
                slider.enabled
                  ? 'bg-white border-persici-crimson/35 text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>
                {slider.enabled
                  ? isRtl
                    ? 'إيقاف السلايدر'
                    : 'Slider Enabled'
                  : isRtl
                  ? 'تفعيل السلايدر'
                  : 'Add Image Slider'}
              </span>
              <span
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  slider.enabled ? 'bg-persici-crimson' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                    slider.enabled
                      ? isRtl
                        ? '-translate-x-4'
                        : 'translate-x-4'
                      : isRtl
                      ? '-translate-x-0.5'
                      : 'translate-x-0.5'
                  }`}
                />
              </span>
            </button>
          </div>

          {slider.enabled && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-4 shadow-2xs">
              {/* Slider Behavior Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Auto-Scrolling Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={slider.autoScroll}
                  onClick={() => updateSlider({ autoScroll: !slider.autoScroll })}
                  className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                    slider.autoScroll
                      ? 'border-persici-crimson/40 bg-persici-crimson/[0.03]'
                      : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <TbPlayerPlay
                      className={`w-4 h-4 shrink-0 ${
                        slider.autoScroll ? 'text-persici-crimson' : 'text-slate-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800 truncate">
                        {isRtl ? 'التمرير التلقائي' : 'Auto-Scrolling'}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {slider.autoScroll
                          ? isRtl
                            ? 'يتحرك تلقائياً'
                            : 'Slides advance auto'
                          : isRtl
                          ? 'تحكم يدوي فقط'
                          : 'Manual swipe/click'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`relative inline-flex h-4.5 w-8 shrink-0 items-center rounded-full transition-colors ${
                      slider.autoScroll ? 'bg-persici-crimson' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        slider.autoScroll
                          ? isRtl
                            ? '-translate-x-4'
                            : 'translate-x-4'
                          : isRtl
                          ? '-translate-x-0.5'
                          : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                </button>

                {/* Infinite Scroll Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={slider.infinite}
                  onClick={() => updateSlider({ infinite: !slider.infinite })}
                  className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                    slider.infinite
                      ? 'border-persici-crimson/40 bg-persici-crimson/[0.03]'
                      : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <TbInfinity
                      className={`w-4 h-4 shrink-0 ${
                        slider.infinite ? 'text-persici-crimson' : 'text-slate-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800 truncate">
                        {isRtl ? 'التمرير اللانهائي' : 'Infinite Scroll'}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {slider.infinite
                          ? isRtl
                            ? 'تكرار مستمر بلا توقف'
                            : 'Seamless loop'
                          : isRtl
                          ? 'يتوقف عند آخر صورة'
                          : 'Stops at ends'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`relative inline-flex h-4.5 w-8 shrink-0 items-center rounded-full transition-colors ${
                      slider.infinite ? 'bg-persici-crimson' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        slider.infinite
                          ? isRtl
                            ? '-translate-x-4'
                            : 'translate-x-4'
                          : isRtl
                          ? '-translate-x-0.5'
                          : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                </button>

                {/* Pagination Arrows Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={slider.showArrows}
                  onClick={() => updateSlider({ showArrows: !slider.showArrows })}
                  className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                    slider.showArrows
                      ? 'border-persici-crimson/40 bg-persici-crimson/[0.03]'
                      : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <TbArrowsLeftRight
                      className={`w-4 h-4 shrink-0 ${
                        slider.showArrows ? 'text-persici-crimson' : 'text-slate-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800 truncate">
                        {isRtl ? 'أسهم التنقل' : 'Pagination Arrows'}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {slider.showArrows
                          ? isRtl
                            ? 'الأسهم ظاهرة على الصور'
                            : 'Prev / Next shown'
                          : isRtl
                          ? 'نقاط وسحب فقط'
                          : 'Dots & swipe only'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`relative inline-flex h-4.5 w-8 shrink-0 items-center rounded-full transition-colors ${
                      slider.showArrows ? 'bg-persici-crimson' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        slider.showArrows
                          ? isRtl
                            ? '-translate-x-4'
                            : 'translate-x-4'
                          : isRtl
                          ? '-translate-x-0.5'
                          : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                </button>
              </div>

              {/* Speed Controls */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <TbGauge className="w-4 h-4 text-persici-crimson" />
                    <span>{isRtl ? 'سرعة التمرير والانتقال' : 'Scrolling & Transition Speed'}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                    {SPEED_PRESETS.map((preset) => {
                      const isActive =
                        slider.intervalMs === preset.intervalMs &&
                        slider.transitionMs === preset.transitionMs;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() =>
                            updateSlider({
                              intervalMs: preset.intervalMs,
                              transitionMs: preset.transitionMs,
                            })
                          }
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {isRtl ? preset.labelAr : preset.labelEn}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-600">
                        {isRtl ? 'مدة التوقف لكل شريحة' : 'Auto-Scroll Delay'}
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {(slider.intervalMs / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1500}
                      max={10000}
                      step={500}
                      disabled={!slider.autoScroll}
                      value={slider.intervalMs}
                      onChange={(e) =>
                        updateSlider({ intervalMs: Number(e.target.value) })
                      }
                      className="w-full accent-persici-crimson disabled:opacity-40 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-600">
                        {isRtl ? 'سرعة حركة الانزلاق' : 'Slide Glide Speed'}
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {slider.transitionMs}ms
                      </span>
                    </div>
                    <input
                      type="range"
                      min={250}
                      max={1500}
                      step={50}
                      value={slider.transitionMs}
                      onChange={(e) =>
                        updateSlider({ transitionMs: Number(e.target.value) })
                      }
                      className="w-full accent-persici-crimson cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Slider Images Manager */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {isRtl ? 'صور السلايدر الإضافية' : 'Hero Slider Images'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono font-semibold text-slate-600">
                      {isRtl
                        ? `1 رئيسية + ${slider.images.length} إضافية`
                        : `1 Main + ${slider.images.length} Extra`}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {onOpenMultiMediaPicker && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenMultiMediaPicker(handleBulkAddSliderImages, 'image')
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-[11px] font-semibold transition-colors cursor-pointer shadow-xs"
                      >
                        <TbLibraryPhoto className="w-3.5 h-3.5" />
                        <span>
                          {isRtl ? 'تحديد / رفع صور متعددة' : 'Bulk Select / Upload'}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleAddSliderImage}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <TbPlus className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إضافة شريحة' : 'Add Slide'}</span>
                    </button>
                  </div>
                </div>

                {/* Pinned Slide #1 (Main Feature Image) */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                  <div className="relative w-14 h-9 rounded-lg overflow-hidden bg-slate-200 border border-emerald-200 shrink-0 flex items-center justify-center">
                    {isRenderableImageSrc(story.heroImage) ? (
                      <Image
                        src={story.heroImage}
                        alt="Main Feature Slide #1"
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <TbPhoto className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-mono font-bold">
                        {isRtl ? 'الشريحة #1' : 'Slide #1'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-800 truncate">
                        {isRtl
                          ? 'صورة الغلاف الرئيسية للقصة (Main Feature Image)'
                          : 'Main Story Feature Image (Hero Cover)'}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                      {story.heroImage || (isRtl ? 'لم يتم اختيار صورة بعد' : 'No cover image selected yet')}
                    </p>
                  </div>
                </div>

                {/* Additional Slider Image Items */}
                {slider.images.length === 0 ? (
                  <div className="p-5 bg-slate-50/80 rounded-xl border border-dashed border-slate-300 text-center space-y-1.5">
                    <TbCarouselHorizontal className="w-7 h-7 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">
                      {isRtl
                        ? 'لم تتم إضافة صور سلايدر إضافية بعد.'
                        : 'No additional slider images added yet.'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {isRtl
                        ? 'أضف صورة واحدة على الأقل لتشغيل السلايدر التلقائي بجانب صورة الغلاف الرئيسية.'
                        : 'Add at least one extra slider image to activate multi-slide cycling alongside the main feature image.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {slider.images.map((img, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                          <span className="font-bold text-slate-700">
                            {isRtl ? `الشريحة #${sIdx + 2}` : `Slide #${sIdx + 2}`}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={sIdx === 0}
                              onClick={() => handleMoveSliderImage(sIdx, 'up')}
                              className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-white disabled:opacity-30 cursor-pointer"
                              title={isRtl ? 'تحريك لأعلى' : 'Move earlier'}
                            >
                              <TbArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={sIdx === slider.images.length - 1}
                              onClick={() => handleMoveSliderImage(sIdx, 'down')}
                              className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-white disabled:opacity-30 cursor-pointer"
                              title={isRtl ? 'تحريك لأسفل' : 'Move later'}
                            >
                              <TbArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveSliderImage(sIdx)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-white cursor-pointer"
                              title={isRtl ? 'حذف الشريحة' : 'Remove slide'}
                            >
                              <TbTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-slate-200 border border-slate-200 shrink-0 flex items-center justify-center">
                            {isRenderableImageSrc(img.src) ? (
                              <Image
                                src={img.src}
                                alt={img.alt?.en || `Slide ${sIdx + 2}`}
                                fill
                                unoptimized
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <TbPhoto className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <input
                            type="text"
                            value={img.src}
                            onChange={(e) =>
                              handleUpdateSliderImage(sIdx, 'src', e.target.value)
                            }
                            placeholder="https://pub-...r2.dev/.../slide.webp"
                            className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono min-w-0 focus:border-persici-crimson outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              onOpenMediaPicker(
                                (url) => handleUpdateSliderImage(sIdx, 'src', url),
                                'image'
                              )
                            }
                            className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                            title={isRtl ? 'اختيار من مكتبة R2' : 'Pick from Media Library'}
                          >
                            <TbPhoto className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <label className="text-[10px] font-semibold text-slate-600">
                                {isRtl ? 'النص البديل (EN)' : 'Alt Text (EN)'}
                              </label>
                              {aiControls?.onTranslate && (
                                <AiTranslateTrigger
                                  size="xs"
                                  lang={lang}
                                  targetLang="en"
                                  sourceText={img.alt?.ar || ''}
                                  isLoading={Boolean(
                                    aiControls.translatingKeys?.[`heroSlide:${sIdx}:alt:en`]
                                  )}
                                  onTranslate={() =>
                                    aiControls.onTranslate!({
                                      key: `heroSlide:${sIdx}:alt:en`,
                                      text: img.alt?.ar || '',
                                      sourceLang: 'ar',
                                      targetLang: 'en',
                                      fieldHint: 'Hero Slider Image Alt Text',
                                      updateStory: (prev, translated) => {
                                        const currentSlider = prev.heroSlider || DEFAULT_HERO_SLIDER;
                                        const nextImgs = [...(currentSlider.images || [])];
                                        if (nextImgs[sIdx]) {
                                          nextImgs[sIdx] = {
                                            ...nextImgs[sIdx],
                                            alt: {
                                              en: translated,
                                              ar: nextImgs[sIdx].alt?.ar || '',
                                            },
                                          };
                                        }
                                        return {
                                          ...prev,
                                          heroSlider: { ...currentSlider, images: nextImgs },
                                        };
                                      },
                                    })
                                  }
                                />
                              )}
                            </div>
                            <input
                              type="text"
                              value={img.alt?.en || ''}
                              onChange={(e) =>
                                handleUpdateSliderImage(sIdx, 'altEn', e.target.value)
                              }
                              placeholder="Alt Text (EN - optional)"
                              className="w-full px-2 py-1 text-[11px] bg-white border border-slate-200 rounded-md focus:border-persici-crimson outline-none"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <label className="text-[10px] font-semibold text-slate-600">
                                {isRtl ? 'النص البديل (AR)' : 'Alt Text (AR)'}
                              </label>
                              {aiControls?.onTranslate && (
                                <AiTranslateTrigger
                                  size="xs"
                                  lang={lang}
                                  targetLang="ar"
                                  sourceText={img.alt?.en || ''}
                                  isLoading={Boolean(
                                    aiControls.translatingKeys?.[`heroSlide:${sIdx}:alt:ar`]
                                  )}
                                  onTranslate={() =>
                                    aiControls.onTranslate!({
                                      key: `heroSlide:${sIdx}:alt:ar`,
                                      text: img.alt?.en || '',
                                      sourceLang: 'en',
                                      targetLang: 'ar',
                                      fieldHint: 'Hero Slider Image Alt Text',
                                      updateStory: (prev, translated) => {
                                        const currentSlider = prev.heroSlider || DEFAULT_HERO_SLIDER;
                                        const nextImgs = [...(currentSlider.images || [])];
                                        if (nextImgs[sIdx]) {
                                          nextImgs[sIdx] = {
                                            ...nextImgs[sIdx],
                                            alt: {
                                              en: nextImgs[sIdx].alt?.en || '',
                                              ar: translated,
                                            },
                                          };
                                        }
                                        return {
                                          ...prev,
                                          heroSlider: { ...currentSlider, images: nextImgs },
                                        };
                                      },
                                    })
                                  }
                                />
                              )}
                            </div>
                            <input
                              type="text"
                              dir="rtl"
                              value={img.alt?.ar || ''}
                              onChange={(e) =>
                                handleUpdateSliderImage(sIdx, 'altAr', e.target.value)
                              }
                              placeholder="النص البديل (AR - اختياري)"
                              className="w-full px-2 py-1 text-[11px] bg-white border border-slate-200 rounded-md font-arabic focus:border-persici-crimson outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
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
