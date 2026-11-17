'use client';

import React, { useRef, useState } from 'react';
import {
  TbPlus,
  TbTrash,
  TbQuote,
  TbListCheck,
  TbAlignLeft,
  TbPhoto,
  TbUpload,
  TbCode,
  TbSparkles,
  TbLoader2,
} from 'react-icons/tb';
import { RichTextEditor } from '@dashboard-shared/components';
import type { ImageUploadQualityMode } from '@dashboard-shared/components/media/types';
import type {
  StoryCodeBlock,
  StoryNarrativeSection,
  StorySectionImage,
  StorySectionImageSize,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';
import {
  CODE_LANGUAGES,
  CodeShowcaseBlock,
  getCodeLanguageMeta,
} from '@/app/[lang]/_shared/components/code-showcase-block';
import { AiFieldTrigger, type StoryAiFieldControls } from './ai-field-trigger';
import type { NarrativeSectionRole } from '@/app/api/ai/generate-story-field/route';

interface PortfolioNarrativeSectionProps {
  id: string;
  sectionRole: NarrativeSectionRole;
  stepNumber: string;
  sectionTitleEn: string;
  sectionTitleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  sectionData?: StoryNarrativeSection;
  onChange: (updated: StoryNarrativeSection) => void;
  lang: string;
  aiControls?: StoryAiFieldControls;
  onOpenMediaPicker?: (
    callback: (url: string) => void,
    type: 'image' | 'video' | 'all'
  ) => void;
  uploadQualityMode?: ImageUploadQualityMode;
  onUploadQualityModeChange?: (mode: ImageUploadQualityMode) => void;
}

const IMAGE_SIZE_PRESETS: Array<{
  id: StorySectionImageSize;
  percent: number;
  labelEn: string;
  labelAr: string;
}> = [
  { id: 'sm', percent: 50, labelEn: 'Small (50%)', labelAr: 'صغير (50%)' },
  { id: 'md', percent: 70, labelEn: 'Medium (70%)', labelAr: 'متوسط (70%)' },
  { id: 'lg', percent: 85, labelEn: 'Large (85%)', labelAr: 'كبير (85%)' },
  { id: 'full', percent: 100, labelEn: 'Full (100%)', labelAr: 'كامل (100%)' },
];

export function PortfolioNarrativeSection({
  id,
  sectionRole,
  stepNumber,
  sectionTitleEn,
  sectionTitleAr,
  descriptionEn,
  descriptionAr,
  sectionData,
  onChange,
  lang,
  aiControls,
  onOpenMediaPicker,
  uploadQualityMode = 'high-webp',
  onUploadQualityModeChange,
}: PortfolioNarrativeSectionProps) {
  const isRtl = lang === 'ar';
  const sectionImgInputRef = useRef<HTMLInputElement>(null);
  const [uploadingSectionImg, setUploadingSectionImg] = useState(false);

  const data: StoryNarrativeSection = sectionData || {
    id,
    title: { en: sectionTitleEn, ar: sectionTitleAr },
    paragraphs: [{ en: '', ar: '' }],
    bullets: [],
    codeBlocks: [],
  };

  // Title update
  const handleTitleChange = (field: 'en' | 'ar', val: string) => {
    onChange({
      ...data,
      title: { ...data.title, [field]: val },
    });
  };

  // Optional Section Main Image (after Title, before Paragraphs)
  const sectionImage = data.image;

  const ensureSectionImage = (patch: Partial<StorySectionImage>) => {
    const base: StorySectionImage = sectionImage || {
      src: '',
      alt: { en: '', ar: '' },
      caption: { en: '', ar: '' },
      size: 'full',
      widthPercent: 100,
      maxHeight: 0,
      objectFit: 'contain',
    };
    onChange({
      ...data,
      image: { ...base, ...patch },
    });
  };

  const handleEnableSectionImage = () => {
    if (sectionImage) return;
    ensureSectionImage({
      src: '',
      size: 'full',
      widthPercent: 100,
      maxHeight: 0,
      objectFit: 'contain',
    });
  };

  const handleRemoveSectionImage = () => {
    const rest = { ...data };
    delete rest.image;
    onChange(rest);
  };

  const handleDirectSectionImageUpload = async (file: File) => {
    if (!file) return;
    setUploadingSectionImg(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'projects');
      formData.append('qualityMode', uploadQualityMode);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const payload = await res.json();
      if (!res.ok || !payload.media?.url) {
        throw new Error(payload.error || 'Failed to upload image');
      }
      ensureSectionImage({ src: payload.media.url });
    } catch (err) {
      console.error('Direct section image upload error:', err);
      alert(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingSectionImg(false);
      if (sectionImgInputRef.current) {
        sectionImgInputRef.current.value = '';
      }
    }
  };

  // Paragraphs
  const paragraphs = data.paragraphs || [];

  const handleAddParagraph = () => {
    onChange({
      ...data,
      paragraphs: [...paragraphs, { en: '', ar: '' }],
    });
  };

  const handleUpdateParagraph = (
    index: number,
    field: 'en' | 'ar',
    val: string
  ) => {
    const updated = [...paragraphs];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...data, paragraphs: updated });
  };

  const handleRemoveParagraph = (index: number) => {
    const updated = [...paragraphs];
    updated.splice(index, 1);
    onChange({ ...data, paragraphs: updated });
  };

  // Bullets
  const bullets = data.bullets || [];

  const handleAddBullet = () => {
    onChange({
      ...data,
      bullets: [...bullets, { en: 'Strategic point...', ar: 'نقطة استراتيجية...' }],
    });
  };

  const handleUpdateBullet = (
    index: number,
    field: 'en' | 'ar',
    val: string
  ) => {
    const updated = [...bullets];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...data, bullets: updated });
  };

  const handleRemoveBullet = (index: number) => {
    const updated = [...bullets];
    updated.splice(index, 1);
    onChange({ ...data, bullets: updated });
  };

  // Code Samples Repeater (after Key Highlights / Bullets)
  const codeBlocks = data.codeBlocks || [];

  const handleAddCodeBlock = (defaultLang = 'html') => {
    const meta = getCodeLanguageMeta(defaultLang);
    const nextBlock: StoryCodeBlock = {
      id: `code-${Date.now()}-${codeBlocks.length + 1}`,
      title: { en: meta.defaultTitleEn, ar: meta.defaultTitleAr },
      language: meta.id,
      code: meta.placeholder,
    };
    onChange({
      ...data,
      codeBlocks: [...codeBlocks, nextBlock],
    });
  };

  const handleUpdateCodeBlock = (
    index: number,
    patch: Partial<StoryCodeBlock> | { titleEn?: string; titleAr?: string }
  ) => {
    const updated = [...codeBlocks];
    const current = updated[index];
    if (!current) return;

    if ('titleEn' in patch || 'titleAr' in patch) {
      updated[index] = {
        ...current,
        title: {
          en: 'titleEn' in patch ? patch.titleEn || '' : current.title?.en || '',
          ar: 'titleAr' in patch ? patch.titleAr || '' : current.title?.ar || '',
        },
      };
    } else {
      const nextItem: StoryCodeBlock = { ...current, ...patch };
      if ('language' in patch && patch.language && patch.language !== current.language) {
        const oldMeta = getCodeLanguageMeta(current.language);
        const newMeta = getCodeLanguageMeta(String(patch.language));
        const isDefaultTitleEn =
          !current.title?.en || current.title.en === oldMeta.defaultTitleEn;
        const isDefaultTitleAr =
          !current.title?.ar || current.title.ar === oldMeta.defaultTitleAr;
        nextItem.title = {
          en: isDefaultTitleEn ? newMeta.defaultTitleEn : current.title.en,
          ar: isDefaultTitleAr ? newMeta.defaultTitleAr : current.title.ar,
        };
      }
      updated[index] = nextItem;
    }

    onChange({ ...data, codeBlocks: updated });
  };

  const handleRemoveCodeBlock = (index: number) => {
    const updated = [...codeBlocks];
    updated.splice(index, 1);
    onChange({ ...data, codeBlocks: updated });
  };

  // Pull Quote
  const quote = data.quote;

  const handleToggleQuote = () => {
    if (quote) {
      const rest = { ...data };
      delete rest.quote;
      onChange(rest);
    } else {
      onChange({
        ...data,
        quote: {
          text: { en: 'Executive insight or client quote...', ar: 'اقتباس تنفيذي أو رأي العميل...' },
          author: 'Leadership Name',
          role: { en: 'Executive Director', ar: 'المدير التنفيذي' },
        },
      });
    }
  };

  const handleUpdateQuote = (field: 'textEn' | 'textAr' | 'author' | 'roleEn' | 'roleAr', val: string) => {
    if (!quote) return;
    const current = { ...quote };

    if (field === 'textEn') {
      current.text = { ...current.text, en: val };
    } else if (field === 'textAr') {
      current.text = { ...current.text, ar: val };
    } else if (field === 'author') {
      current.author = val;
    } else if (field === 'roleEn') {
      current.role = { ...(current.role || { en: '', ar: '' }), en: val };
    } else if (field === 'roleAr') {
      current.role = { ...(current.role || { en: '', ar: '' }), ar: val };
    }

    onChange({ ...data, quote: current });
  };

  return (
    <div id={id} className="space-y-6 pt-2">
      <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-persici-crimson/10 text-persici-crimson text-xs font-mono font-bold flex items-center justify-center">
              {stepNumber}
            </span>
            <span>{isRtl ? sectionTitleAr : sectionTitleEn}</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {isRtl ? descriptionAr : descriptionEn}
          </p>
        </div>

        {aiControls && (
          <AiFieldTrigger
            variant="pill"
            lang={lang}
            hasReference={aiControls.hasReference}
            onMissingReference={aiControls.onMissingReference}
            isLoading={aiControls.generatingFieldKey === sectionRole}
            onGenerate={() =>
              aiControls.onGenerateField(sectionRole, {
                sectionContext: sectionRole,
                keyLabel: sectionRole,
              })
            }
            labelEn="Generate Entire Section with AI"
            labelAr="توليد القسم كاملاً بالذكاء الاصطناعي"
          />
        )}
      </div>

      {/* 1. Section Title (EN & AR) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isRtl ? 'عنوان القسم (SEO Heading)' : 'Section Heading (EN / AR)'}
          </span>
          {aiControls && (
            <AiFieldTrigger
              lang={lang}
              hasReference={aiControls.hasReference}
              onMissingReference={aiControls.onMissingReference}
              isLoading={aiControls.generatingFieldKey === `${sectionRole}:heading`}
              onGenerate={() =>
                aiControls.onGenerateField('section_heading', {
                  sectionContext: sectionRole,
                  keyLabel: `${sectionRole}:heading`,
                })
              }
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {isRtl ? 'عنوان القسم (English)' : 'Section Heading (English)'}
            </label>
            <input
              type="text"
              required
              value={data.title?.en || ''}
              onChange={(e) => handleTitleChange('en', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none font-medium"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {isRtl ? 'عنوان القسم (العربية)' : 'Section Heading (Arabic)'}
            </label>
            <input
              type="text"
              dir="rtl"
              required
              value={data.title?.ar || ''}
              onChange={(e) => handleTitleChange('ar', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none font-medium font-arabic"
            />
          </div>
        </div>
      </div>

      {/* 1.5 Optional Resizable Section Main Image (After Title, Before Paragraphs) */}
      <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
        <input
          ref={sectionImgInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleDirectSectionImageUpload(file);
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <TbPhoto className="w-4 h-4 text-persici-crimson" />
            <span>
              {isRtl
                ? 'الصورة الرئيسية للقسم (اختياري - قابلة لتغيير الحجم)'
                : 'Section Main Image (Optional & Resizable)'}
            </span>
          </div>

          {sectionImage ? (
            <button
              type="button"
              onClick={handleRemoveSectionImage}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <TbTrash className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إزالة الصورة' : 'Remove Image'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEnableSectionImage}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <TbPlus className="w-3.5 h-3.5 text-persici-crimson" />
              <span>{isRtl ? 'إضافة صورة للقسم' : 'Add Section Image'}</span>
            </button>
          )}
        </div>

        {sectionImage && (
          <div className="space-y-4 pt-2 border-t border-slate-200/80">
            {/* Quality Mode Toggle Before Direct Upload */}
            {onUploadQualityModeChange && (
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600">
                  {isRtl
                    ? 'جودة التحويل إلى WebP قبل الرفع:'
                    : 'Before Upload — WebP Image Compression Mode:'}
                </span>
                <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => onUploadQualityModeChange('high-webp')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      uploadQualityMode === 'high-webp'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TbSparkles className="w-3 h-3" />
                    <span>
                      {isRtl
                        ? 'جودة عالية WebP (لقطات الشاشة الكاملة)'
                        : 'High Quality WebP (Full-Screen Safe)'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUploadQualityModeChange('reduced-webp')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      uploadQualityMode === 'reduced-webp'
                        ? 'bg-slate-800 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{isRtl ? 'تقليل الجودة والحجم' : 'Reduced Quality WebP'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Image URL + Direct Upload + R2 Picker */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={sectionImage.src || ''}
                onChange={(e) => ensureSectionImage({ src: e.target.value })}
                placeholder="https://pub-...r2.dev/projects/screen-capture.webp"
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:border-persici-crimson outline-none"
              />
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={uploadingSectionImg}
                  onClick={() => sectionImgInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploadingSectionImg ? (
                    <TbLoader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <TbUpload className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {uploadingSectionImg
                      ? isRtl
                        ? 'جارٍ الرفع...'
                        : 'Uploading...'
                      : isRtl
                      ? 'رفع مباشر'
                      : 'Upload Image'}
                  </span>
                </button>
                {onOpenMediaPicker && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenMediaPicker(
                        (url) => ensureSectionImage({ src: url }),
                        'image'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <TbPhoto className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'اختيار من R2' : 'Pick from R2'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Resize Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-slate-200">
              {/* Width Presets & Slider */}
              <div className="lg:col-span-2 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  <span>{isRtl ? 'حجم وعرض الصورة:' : 'Display Width Resize:'}</span>
                  <span className="font-mono text-persici-crimson font-bold">
                    {sectionImage.widthPercent ?? 100}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {IMAGE_SIZE_PRESETS.map((preset) => {
                    const isActive = (sectionImage.widthPercent ?? 100) === preset.percent;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() =>
                          ensureSectionImage({
                            size: preset.id,
                            widthPercent: preset.percent,
                          })
                        }
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isRtl ? preset.labelAr : preset.labelEn}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="range"
                  min={30}
                  max={100}
                  step={5}
                  value={sectionImage.widthPercent ?? 100}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const matchedSize: StorySectionImageSize =
                      val <= 55 ? 'sm' : val <= 75 ? 'md' : val <= 90 ? 'lg' : 'full';
                    ensureSectionImage({ widthPercent: val, size: matchedSize });
                  }}
                  className="w-full accent-persici-crimson cursor-pointer"
                />
              </div>

              {/* Max Height & Object Fit */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {isRtl ? 'الارتفاع الأقصى:' : 'Height Behavior:'}
                  </label>
                  <select
                    value={String(sectionImage.maxHeight || 0)}
                    onChange={(e) =>
                      ensureSectionImage({ maxHeight: Number(e.target.value) || 0 })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium outline-none"
                  >
                    <option value="0">
                      {isRtl
                        ? 'ارتفاع تلقائي كامل (للشاشات الطويلة)'
                        : 'Full Auto Height (Full-Screen Safe)'}
                    </option>
                    <option value="360">Max 360px</option>
                    <option value="520">Max 520px</option>
                    <option value="760">Max 760px</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {isRtl ? 'طريقة الاحتواء:' : 'Scaling Fit:'}
                  </label>
                  <select
                    value={sectionImage.objectFit || 'contain'}
                    onChange={(e) =>
                      ensureSectionImage({
                        objectFit: e.target.value === 'cover' ? 'cover' : 'contain',
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium outline-none"
                  >
                    <option value="contain">
                      {isRtl ? 'احتواء كامل بدون قص (Contain)' : 'Contain (Uncropped Full Image)'}
                    </option>
                    <option value="cover">
                      {isRtl ? 'ملء الإطار مع القص (Cover)' : 'Cover (Fill Frame)'}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bilingual Alt & Caption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={sectionImage.caption?.en || ''}
                onChange={(e) =>
                  ensureSectionImage({
                    caption: { en: e.target.value, ar: sectionImage.caption?.ar || '' },
                    alt: {
                      en: e.target.value || sectionImage.alt?.en || '',
                      ar: sectionImage.alt?.ar || '',
                    },
                  })
                }
                placeholder="Optional Image Caption / Alt (English)"
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                dir="rtl"
                value={sectionImage.caption?.ar || ''}
                onChange={(e) =>
                  ensureSectionImage({
                    caption: { en: sectionImage.caption?.en || '', ar: e.target.value },
                    alt: {
                      en: sectionImage.alt?.en || '',
                      ar: e.target.value || sectionImage.alt?.ar || '',
                    },
                  })
                }
                placeholder="تسمية أو وصف توضيحي للصورة (اختياري - العربية)"
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
              />
            </div>

            {/* Live Resized Image Preview */}
            {sectionImage.src && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                <span className="block text-[10px] font-mono uppercase text-slate-400">
                  {isRtl
                    ? `معاينة الحجم (${sectionImage.widthPercent ?? 100}%)`
                    : `Live Width Preview (${sectionImage.widthPercent ?? 100}%)`}
                </span>
                <div
                  className="mx-auto rounded-xl overflow-hidden border border-slate-200 bg-slate-100 transition-all"
                  style={{ width: `${sectionImage.widthPercent ?? 100}%` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sectionImage.src}
                    alt={sectionImage.alt?.en || sectionTitleEn}
                    style={{
                      maxHeight: sectionImage.maxHeight ? `${sectionImage.maxHeight}px` : undefined,
                    }}
                    className={`w-full h-auto ${
                      sectionImage.objectFit === 'cover' ? 'object-cover' : 'object-contain'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Paragraphs Repeater */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <TbAlignLeft className="w-4 h-4 text-persici-crimson" />
            <span>{isRtl ? 'الفقرات النصية (Paragraphs)' : 'Body Paragraphs'}</span>
          </div>
          <button
            type="button"
            onClick={handleAddParagraph}
            className="inline-flex items-center gap-1 text-xs font-semibold text-persici-crimson hover:underline cursor-pointer"
          >
            <TbPlus className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إضافة فقرة' : 'Add Paragraph'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {paragraphs.map((p, pIdx) => (
            <div
              key={pIdx}
              className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2 relative"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                <span>{isRtl ? `فقرة 0${pIdx + 1}` : `Paragraph #${pIdx + 1}`}</span>
                <div className="flex items-center gap-2">
                  {aiControls && (
                    <AiFieldTrigger
                      lang={lang}
                      hasReference={aiControls.hasReference}
                      onMissingReference={aiControls.onMissingReference}
                      isLoading={
                        aiControls.generatingFieldKey === `${sectionRole}:paragraph:${pIdx}`
                      }
                      onGenerate={() =>
                        aiControls.onGenerateField('paragraph', {
                          sectionContext: sectionRole,
                          paragraphIndex: pIdx,
                          keyLabel: `${sectionRole}:paragraph:${pIdx}`,
                        })
                      }
                    />
                  )}
                  {paragraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParagraph(pIdx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-white"
                    >
                      <TbTrash className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <RichTextEditor
                label={isRtl ? `محتوى الفقرة 0${pIdx + 1}` : `Paragraph #${pIdx + 1} Content (EN / AR)`}
                rows={4}
                valueEn={p.en}
                valueAr={p.ar}
                onChangeEn={(val) => handleUpdateParagraph(pIdx, 'en', val)}
                onChangeAr={(val) => handleUpdateParagraph(pIdx, 'ar', val)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bullet Points Checklist Repeater */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <TbListCheck className="w-4 h-4 text-emerald-600" />
            <span>{isRtl ? 'نقاط القائمة المرجعية (Key Highlights)' : 'Key Highlights / Bullets'}</span>
          </div>
          <div className="flex items-center gap-2">
            {aiControls && (
              <AiFieldTrigger
                lang={lang}
                hasReference={aiControls.hasReference}
                onMissingReference={aiControls.onMissingReference}
                isLoading={aiControls.generatingFieldKey === `${sectionRole}:bullets`}
                onGenerate={() =>
                  aiControls.onGenerateField('bullets', {
                    sectionContext: sectionRole,
                    keyLabel: `${sectionRole}:bullets`,
                  })
                }
                labelEn="Generate Highlights"
                labelAr="توليد النقاط"
              />
            )}
            <button
              type="button"
              onClick={handleAddBullet}
              className="inline-flex items-center gap-1 text-xs font-semibold text-persici-crimson hover:underline cursor-pointer"
            >
              <TbPlus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة نقطة' : 'Add Highlight'}</span>
            </button>
          </div>
        </div>

        {bullets.length > 0 && (
          <div className="space-y-2">
            {bullets.map((b, bIdx) => (
              <div
                key={bIdx}
                className="flex items-center gap-2 p-2 bg-slate-50/70 rounded-xl border border-slate-200"
              >
                <input
                  type="text"
                  value={b.en}
                  onChange={(e) => handleUpdateBullet(bIdx, 'en', e.target.value)}
                  placeholder="Bullet highlight (English)"
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
                <input
                  type="text"
                  dir="rtl"
                  value={b.ar}
                  onChange={(e) => handleUpdateBullet(bIdx, 'ar', e.target.value)}
                  placeholder="نقطة الإبراز (بالعربية)"
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBullet(bIdx)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white"
                >
                  <TbTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3.5 Code Samples Repeater (After Key Highlights, Syntax Colored & AI Enabled) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <TbCode className="w-4 h-4 text-indigo-600" />
            <span>
              {isRtl ? 'نماذج الأكواد البرمجية (Code Samples)' : 'Code Samples & Snippets'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {aiControls && (
              <AiFieldTrigger
                lang={lang}
                hasReference={aiControls.hasReference}
                allowWithoutReference
                onMissingReference={aiControls.onMissingReference}
                isLoading={aiControls.generatingFieldKey === `${sectionRole}:code_blocks`}
                onGenerate={() =>
                  aiControls.onGenerateField('code_blocks', {
                    sectionContext: sectionRole,
                    keyLabel: `${sectionRole}:code_blocks`,
                  })
                }
                labelEn="Generate Code Samples with AI"
                labelAr="توليد نماذج كود بالذكاء الاصطناعي"
              />
            )}
            <button
              type="button"
              onClick={() => handleAddCodeBlock('html')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-persici-crimson hover:underline cursor-pointer"
            >
              <TbPlus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة كود برمجي' : 'Add Code Sample'}</span>
            </button>
          </div>
        </div>

        {codeBlocks.length > 0 && (
          <div className="space-y-4">
            {codeBlocks.map((block, cIdx) => {
              const langMeta = getCodeLanguageMeta(block.language);
              return (
                <div
                  key={block.id || cIdx}
                  className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3"
                >
                  {/* Top Bar: Index + Language Selector + AI Trigger + Delete */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {isRtl ? `كود #0${cIdx + 1}` : `Code #${cIdx + 1}`}
                      </span>
                      <select
                        value={block.language || 'typescript'}
                        onChange={(e) =>
                          handleUpdateCodeBlock(cIdx, { language: e.target.value })
                        }
                        className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-mono font-semibold text-slate-800 outline-none focus:border-persici-crimson cursor-pointer"
                      >
                        {CODE_LANGUAGES.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      {aiControls && (
                        <AiFieldTrigger
                          lang={lang}
                          hasReference={aiControls.hasReference}
                          allowWithoutReference
                          onMissingReference={aiControls.onMissingReference}
                          isLoading={
                            aiControls.generatingFieldKey === `${sectionRole}:code_block:${cIdx}`
                          }
                          onGenerate={() =>
                            aiControls.onGenerateField('code_block', {
                              sectionContext: sectionRole,
                              codeBlockIndex: cIdx,
                              codeLanguage: block.language || 'typescript',
                              keyLabel: `${sectionRole}:code_block:${cIdx}`,
                            })
                          }
                          labelEn={`Generate ${langMeta.label} Code`}
                          labelAr={`توليد كود ${langMeta.label}`}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveCodeBlock(cIdx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white cursor-pointer"
                        title={isRtl ? 'حذف الكود' : 'Remove Code Sample'}
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bilingual Title Before Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                        {isRtl ? 'عنوان قبل الكود (EN)' : 'Code Heading Before Block (English)'}
                      </label>
                      <input
                        type="text"
                        value={block.title?.en || ''}
                        onChange={(e) =>
                          handleUpdateCodeBlock(cIdx, { titleEn: e.target.value })
                        }
                        placeholder={langMeta.defaultTitleEn}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                        {isRtl ? 'عنوان قبل الكود (AR)' : 'Code Heading Before Block (Arabic)'}
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={block.title?.ar || ''}
                        onChange={(e) =>
                          handleUpdateCodeBlock(cIdx, { titleAr: e.target.value })
                        }
                        placeholder={langMeta.defaultTitleAr}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                  </div>

                  {/* Raw Code Input */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                      {isRtl ? 'محتوى الكود البرمجي' : 'Code Content'}
                    </label>
                    <textarea
                      dir="ltr"
                      rows={6}
                      spellCheck={false}
                      value={block.code || ''}
                      onChange={(e) =>
                        handleUpdateCodeBlock(cIdx, { code: e.target.value })
                      }
                      placeholder={langMeta.placeholder}
                      className="w-full p-3 text-xs font-mono bg-slate-900 text-slate-100 border border-slate-700 rounded-xl focus:border-persici-crimson outline-none leading-5"
                    />
                  </div>

                  {/* Live Syntax-Highlighted IDE Preview */}
                  {block.code && (
                    <CodeShowcaseBlock
                      title={
                        isRtl
                          ? block.title?.ar || block.title?.en
                          : block.title?.en || block.title?.ar
                      }
                      language={block.language}
                      code={block.code}
                      compact
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Pull Quote Editor (Optional) */}
      <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <TbQuote className="w-4 h-4 text-persici-crimson" />
            <span>{isRtl ? 'اقتباس تنفيذي مميز (Pull Quote)' : 'Executive Pull Quote (Optional)'}</span>
          </div>
          <div className="flex items-center gap-2">
            {aiControls && (
              <AiFieldTrigger
                lang={lang}
                hasReference={aiControls.hasReference}
                onMissingReference={aiControls.onMissingReference}
                isLoading={aiControls.generatingFieldKey === `${sectionRole}:quote`}
                onGenerate={() =>
                  aiControls.onGenerateField('quote', {
                    sectionContext: sectionRole,
                    keyLabel: `${sectionRole}:quote`,
                  })
                }
                labelEn="Generate Quote with AI"
                labelAr="توليد اقتباس"
              />
            )}
            <button
              type="button"
              onClick={handleToggleQuote}
              className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                quote
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {quote
                ? (isRtl ? 'إزالة الاقتباس' : 'Remove Quote')
                : (isRtl ? 'تفعيل اقتباس' : 'Enable Quote')}
            </button>
          </div>
        </div>

        {quote && (
          <div className="space-y-3 pt-2">
            <RichTextEditor
              label={isRtl ? 'نص الاقتباس (Quote Text)' : 'Quote Text (EN / AR)'}
              rows={3}
              valueEn={quote.text.en}
              valueAr={quote.text.ar}
              onChangeEn={(val) => handleUpdateQuote('textEn', val)}
              onChangeAr={(val) => handleUpdateQuote('textAr', val)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  {isRtl ? 'اسم القائل' : 'Author Name'}
                </label>
                <input
                  type="text"
                  value={quote.author}
                  onChange={(e) => handleUpdateQuote('author', e.target.value)}
                  placeholder="e.g. John Doe, Leadership"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  {isRtl ? 'المسمى الوظيفي (EN)' : 'Author Role (EN)'}
                </label>
                <input
                  type="text"
                  value={quote.role?.en || ''}
                  onChange={(e) => handleUpdateQuote('roleEn', e.target.value)}
                  placeholder="VP of Digital Marketing"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  {isRtl ? 'المسمى الوظيفي (AR)' : 'Author Role (AR)'}
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={quote.role?.ar || ''}
                  onChange={(e) => handleUpdateQuote('roleAr', e.target.value)}
                  placeholder="نائب رئيس التسويق الرقمي"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
