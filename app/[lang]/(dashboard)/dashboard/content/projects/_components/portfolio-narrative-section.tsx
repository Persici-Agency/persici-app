'use client';

import React from 'react';
import {
  TbPlus,
  TbTrash,
  TbQuote,
  TbListCheck,
  TbAlignLeft,
} from 'react-icons/tb';
import type {
  StoryNarrativeSection,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';

interface PortfolioNarrativeSectionProps {
  id: string;
  stepNumber: string;
  sectionTitleEn: string;
  sectionTitleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  sectionData?: StoryNarrativeSection;
  onChange: (updated: StoryNarrativeSection) => void;
  lang: string;
}

export function PortfolioNarrativeSection({
  id,
  stepNumber,
  sectionTitleEn,
  sectionTitleAr,
  descriptionEn,
  descriptionAr,
  sectionData,
  onChange,
  lang,
}: PortfolioNarrativeSectionProps) {
  const isRtl = lang === 'ar';

  const data: StoryNarrativeSection = sectionData || {
    id,
    title: { en: sectionTitleEn, ar: sectionTitleAr },
    paragraphs: [{ en: '', ar: '' }],
    bullets: [],
  };

  // Title update
  const handleTitleChange = (field: 'en' | 'ar', val: string) => {
    onChange({
      ...data,
      title: { ...data.title, [field]: val },
    });
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
      <div className="border-b border-slate-200 pb-3">
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

      {/* 1. Section Title (EN & AR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
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
          <label className="block text-xs font-semibold text-slate-700 mb-1">
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
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{isRtl ? `فقرة 0${pIdx + 1}` : `Paragraph #${pIdx + 1}`}</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <textarea
                  rows={3}
                  value={p.en}
                  onChange={(e) => handleUpdateParagraph(pIdx, 'en', e.target.value)}
                  placeholder="Paragraph content in English..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-persici-crimson outline-none leading-relaxed"
                />
                <textarea
                  rows={3}
                  dir="rtl"
                  value={p.ar}
                  onChange={(e) => handleUpdateParagraph(pIdx, 'ar', e.target.value)}
                  placeholder="محتوى الفقرة باللغة العربية..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-persici-crimson outline-none leading-relaxed font-arabic"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bullet Points Checklist Repeater */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <TbListCheck className="w-4 h-4 text-emerald-600" />
            <span>{isRtl ? 'نقاط القائمة المرجعية (Key Highlights)' : 'Key Highlights / Bullets'}</span>
          </div>
          <button
            type="button"
            onClick={handleAddBullet}
            className="inline-flex items-center gap-1 text-xs font-semibold text-persici-crimson hover:underline cursor-pointer"
          >
            <TbPlus className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إضافة نقطة' : 'Add Highlight'}</span>
          </button>
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

      {/* 4. Pull Quote Editor (Optional) */}
      <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <TbQuote className="w-4 h-4 text-persici-crimson" />
            <span>{isRtl ? 'اقتباس تنفيذي مميز (Pull Quote)' : 'Executive Pull Quote (Optional)'}</span>
          </div>
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

        {quote && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isRtl ? 'نص الاقتباس (EN)' : 'Quote Text (EN)'}
                </label>
                <textarea
                  rows={2}
                  value={quote.text.en}
                  onChange={(e) => handleUpdateQuote('textEn', e.target.value)}
                  placeholder="Persici turned our vision into reality..."
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-persici-crimson outline-none italic"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isRtl ? 'نص الاقتباس (AR)' : 'Quote Text (AR)'}
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={quote.text.ar}
                  onChange={(e) => handleUpdateQuote('textAr', e.target.value)}
                  placeholder="حولت بيرسيشي رؤيتنا إلى واقع ملموس..."
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-persici-crimson outline-none italic font-arabic"
                />
              </div>
            </div>

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
