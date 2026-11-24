'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  TbX,
  TbRotate,
  TbDeviceFloppy,
  TbCheck,
  TbSpacingVertical,
  TbLayoutList,
  TbFileText,
  TbPresentation,
  TbLoader2,
  TbAlertCircle,
} from 'react-icons/tb';
import {
  DEFAULT_CLIENT_STORY_DETAIL_SPACING,
  type ClientStoryDetailSpacingConfig,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';

export interface StoryDetailSpacingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

type SpacingGroupKey = 'section' | 'page' | 'showcase';

interface SpacingFieldDef {
  key: keyof ClientStoryDetailSpacingConfig;
  group: SpacingGroupKey;
  min: number;
  max: number;
  step: number;
  labelEn: string;
  labelAr: string;
  descEn: string;
  descAr: string;
}

const SPACING_FIELDS: SpacingFieldDef[] = [
  // Group 1: Inside Section Elements
  {
    key: 'titleToContentGap',
    group: 'section',
    min: 0,
    max: 100,
    step: 2,
    labelEn: 'Title → Content / Paragraph',
    labelAr: 'المسافة بين عنوان القسم والمحتوى',
    descEn: 'Space below each section title before its image or first paragraph.',
    descAr: 'المسافة أسفل عنوان كل قسم قبل الصورة أو الفقرة الأولى.',
  },
  {
    key: 'imageToContentGap',
    group: 'section',
    min: 0,
    max: 120,
    step: 2,
    labelEn: 'Section Image → Content',
    labelAr: 'المسافة بين صورة القسم والنص',
    descEn: 'Space below the optional in-section image before section paragraphs.',
    descAr: 'المسافة أسفل الصورة داخل القسم وقبل فقرات المحتوى.',
  },
  {
    key: 'paragraphToParagraphGap',
    group: 'section',
    min: 0,
    max: 80,
    step: 2,
    labelEn: 'Paragraph → Paragraph',
    labelAr: 'المسافة بين الفقرات داخل القسم',
    descEn: 'Vertical gap between consecutive paragraphs in the same section.',
    descAr: 'المسافة الرأسية بين كل فقرة والتي تليها في نفس القسم.',
  },
  {
    key: 'contentToBulletsGap',
    group: 'section',
    min: 0,
    max: 100,
    step: 2,
    labelEn: 'Content → Key Highlights List',
    labelAr: 'المسافة قبل قائمة النقاط البارزة',
    descEn: 'Space between paragraphs and the bullet highlights list.',
    descAr: 'المسافة بين الفقرات وقائمة النقاط المميزة (Bullets).',
  },
  {
    key: 'bulletToBulletGap',
    group: 'section',
    min: 0,
    max: 48,
    step: 2,
    labelEn: 'Bullet Item → Bullet Item',
    labelAr: 'المسافة بين كل نقطة وأخرى',
    descEn: 'Vertical spacing between individual bullet points.',
    descAr: 'المسافة بين عناصر النقاط المميزة داخل القائمة.',
  },
  {
    key: 'contentToCodeGap',
    group: 'section',
    min: 0,
    max: 120,
    step: 2,
    labelEn: 'Content / Highlights → Code Block',
    labelAr: 'المسافة قبل صناديق الأكواد (Code)',
    descEn: 'Space between section content/highlights and code samples.',
    descAr: 'المسافة بين نص أو نقاط القسم وعينات الكود البرمجي.',
  },
  {
    key: 'codeToCodeGap',
    group: 'section',
    min: 0,
    max: 96,
    step: 2,
    labelEn: 'Code Block → Next Code Block',
    labelAr: 'المسافة بين صناديق الأكواد المتتالية',
    descEn: 'Space separating multiple code sample blocks in the same section.',
    descAr: 'المسافة الفاصلة بين كل صندوق كود والذي يليه في نفس القسم.',
  },
  {
    key: 'contentToQuoteGap',
    group: 'section',
    min: 0,
    max: 120,
    step: 2,
    labelEn: 'Content / Code → Pull Quote',
    labelAr: 'المسافة قبل الاقتباس (Pull Quote)',
    descEn: 'Space above the testimonial / pull quote box inside a section.',
    descAr: 'المسافة أعلى صندوق الاقتباس في نهاية القسم.',
  },

  // Group 2: Section-to-Section & Main Body
  {
    key: 'sectionToSectionGap',
    group: 'page',
    min: 16,
    max: 200,
    step: 4,
    labelEn: 'Section → Next Section',
    labelAr: 'المسافة بين كل قسم والقسم التالي',
    descEn: 'Total space separating one narrative section from the next (Overview, Challenge, Solution, Impact).',
    descAr: 'إجمالي المسافة الفاصلة بين أقسام القصة الرئيسية (النظرة العامة، التحدي، الحل، الأثر).',
  },
  {
    key: 'bodyContainerPaddingY',
    group: 'page',
    min: 16,
    max: 160,
    step: 4,
    labelEn: 'Main Body Top & Bottom Padding',
    labelAr: 'الهامش العلوي والسفلي لجسم القصة',
    descEn: 'Outer vertical padding framing the sticky sidebar and narrative sections.',
    descAr: 'الحشوة الرأسية المحيطة بقسم السرد والشريط الجانبي الثابت.',
  },

  // Group 3: Summary & Deliverables Showcase
  {
    key: 'summarySectionPaddingY',
    group: 'showcase',
    min: 16,
    max: 160,
    step: 4,
    labelEn: 'Summary Band Vertical Padding',
    labelAr: 'الهامش الرأسي لقسم الملخص والنتائج',
    descEn: 'Top & bottom padding of the Executive Summary and Stats band.',
    descAr: 'الحشوة العلوية والسفلية لقسم الملخص التنفيذي والإحصائيات.',
  },
  {
    key: 'summaryTitleGap',
    group: 'showcase',
    min: 0,
    max: 80,
    step: 2,
    labelEn: 'Summary Title → Summary Text',
    labelAr: 'المسافة بين عنوان الملخص والنص',
    descEn: 'Space between the Summary heading and its paragraph.',
    descAr: 'المسافة بين كلمة الملخص ونص الملخص التنفيذي.',
  },
  {
    key: 'summaryToMetricsGap',
    group: 'showcase',
    min: 8,
    max: 120,
    step: 4,
    labelEn: 'Summary Text → Metrics Strip',
    labelAr: 'المسافة بين نص الملخص والأرقام',
    descEn: 'Space above the KPI numbers row inside the Summary section.',
    descAr: 'المسافة بين فقرة الملخص وصف الأرقام والإحصائيات.',
  },
  {
    key: 'deliverablesTopGap',
    group: 'showcase',
    min: 12,
    max: 160,
    step: 4,
    labelEn: 'Last Section → Deliverables Showcase',
    labelAr: 'المسافة قبل قسم المخرجات والمعرض',
    descEn: 'Top spacing separating the Impact section from Deliverables & Production.',
    descAr: 'المسافة بين آخر قسم سردي وبداية معرض المخرجات والإنتاج.',
  },
  {
    key: 'deliverablesTitleToDescGap',
    group: 'showcase',
    min: 0,
    max: 60,
    step: 2,
    labelEn: 'Deliverables Title → Description',
    labelAr: 'المسافة بين عنوان المعرض والوصف',
    descEn: 'Space between the Deliverables heading and its description paragraph.',
    descAr: 'المسافة بين عنوان قسم المخرجات ونص الوصف الخاص به.',
  },
  {
    key: 'deliverablesHeaderGap',
    group: 'showcase',
    min: 8,
    max: 120,
    step: 4,
    labelEn: 'Deliverables Header → Media / Mockups',
    labelAr: 'المسافة بين مقدمة المعرض والوسائط',
    descEn: 'Space below the Deliverables header before videos, device mockups, or gallery.',
    descAr: 'المسافة بين ترويسة معرض المخرجات وعرض الفيديوهات أو الأجهزة أو الصور.',
  },
  {
    key: 'showcaseBlockGap',
    group: 'showcase',
    min: 12,
    max: 140,
    step: 4,
    labelEn: 'Mockups / Video / Tech Stack / Gallery Gap',
    labelAr: 'المسافة بين عناصر معرض المخرجات',
    descEn: 'Vertical gap between device frames, demo videos, tech stack badges, and visual gallery.',
    descAr: 'المسافة بين إطارات الأجهزة وفيديو العرض والتقنيات المستخدمة ومعرض الصور.',
  },
];

export function StoryDetailSpacingModal({
  isOpen,
  onClose,
  lang,
}: StoryDetailSpacingModalProps) {
  const isRtl = lang === 'ar';
  const [spacing, setSpacing] = useState<ClientStoryDetailSpacingConfig>(
    DEFAULT_CLIENT_STORY_DETAIL_SPACING
  );
  const [savedBaseline, setSavedBaseline] = useState<ClientStoryDetailSpacingConfig>(
    DEFAULT_CLIENT_STORY_DETAIL_SPACING
  );
  const [activeTab, setActiveTab] = useState<SpacingGroupKey>('section');
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    fetch('/api/projects/detail-spacing', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data?.spacing) {
          setSpacing(data.spacing);
          setSavedBaseline(data.spacing);
        }
        setFetching(false);
      })
      .catch(() => {
        if (active) setFetching(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen]);

  const modifiedCount = useMemo(() => {
    return (Object.keys(DEFAULT_CLIENT_STORY_DETAIL_SPACING) as Array<
      keyof ClientStoryDetailSpacingConfig
    >).filter((k) => spacing[k] !== DEFAULT_CLIENT_STORY_DETAIL_SPACING[k]).length;
  }, [spacing]);

  const isDirty = useMemo(() => {
    return (Object.keys(DEFAULT_CLIENT_STORY_DETAIL_SPACING) as Array<
      keyof ClientStoryDetailSpacingConfig
    >).some((k) => spacing[k] !== savedBaseline[k]);
  }, [spacing, savedBaseline]);

  if (!isOpen) return null;

  const visibleFields = SPACING_FIELDS.filter((f) => f.group === activeTab);

  const handleFieldChange = (
    field: SpacingFieldDef,
    rawVal: number
  ) => {
    const safeVal = Number.isFinite(rawVal)
      ? Math.min(field.max, Math.max(field.min, Math.round(rawVal)))
      : DEFAULT_CLIENT_STORY_DETAIL_SPACING[field.key];
    setStatusMessage(null);
    setSpacing((prev) => ({
      ...prev,
      [field.key]: safeVal,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/projects/detail-spacing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spacing }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save spacing settings');
      }
      if (data.spacing) {
        setSpacing(data.spacing);
        setSavedBaseline(data.spacing);
      }
      setStatusMessage({
        type: 'success',
        text: isRtl
          ? 'تم حفظ مسافات صفحات قصص العملاء وتطبيقها على جميع القصص.'
          : 'Spacing saved and applied globally across all Client Story Detail pages.',
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Save failed',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    setResetting(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/projects/detail-spacing', {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset spacing settings');
      }
      const next = data.spacing || DEFAULT_CLIENT_STORY_DETAIL_SPACING;
      setSpacing(next);
      setSavedBaseline(next);
      setStatusMessage({
        type: 'success',
        text: isRtl
          ? 'تمت إعادة جميع المسافات إلى القيم الافتراضية وحفظها بنجاح.'
          : 'All spacing values have been reset to defaults and saved globally.',
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Reset failed',
      });
    } finally {
      setResetting(false);
    }
  };

  // Scale down px proportionally for mini diagram preview (~0.45x)
  const previewScale = (px: number) => Math.max(2, Math.round(px * 0.42));

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-persici-crimson/10 text-persici-crimson flex items-center justify-center shrink-0">
              <TbSpacingVertical className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {isRtl
                    ? 'إعدادات المسافات لجميع صفحات تفاصيل قصص العملاء'
                    : 'Global Client Story Detail Page Spacing'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-mono font-bold">
                  {isRtl ? 'يطبق على جميع القصص' : 'Applies to All Stories'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {isRtl
                  ? 'اضبط التباعد بين العناوين والفقرات والصور والأكواد والأقسام لجميع صفحات قصص العملاء.'
                  : 'Customize spacing between headings, paragraphs, images, highlights, code blocks, and sections across all stories.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
          >
            <TbX className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                key: 'section' as SpacingGroupKey,
                icon: <TbFileText className="w-4 h-4" />,
                labelEn: 'Inside Section Spacing',
                labelAr: 'التباعد داخل القسم',
              },
              {
                key: 'page' as SpacingGroupKey,
                icon: <TbLayoutList className="w-4 h-4" />,
                labelEn: 'Section-to-Section & Body',
                labelAr: 'بين الأقسام والصفحة',
              },
              {
                key: 'showcase' as SpacingGroupKey,
                icon: <TbPresentation className="w-4 h-4" />,
                labelEn: 'Summary & Deliverables',
                labelAr: 'الملخص ومعرض المخرجات',
              },
            ].map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            {fetching && <TbLoader2 className="w-3.5 h-3.5 animate-spin text-persici-crimson" />}
            <span>
              {modifiedCount === 0
                ? isRtl
                  ? 'جميع القيم على الإعداد الافتراضي'
                  : 'All values at defaults'
                : isRtl
                ? `${modifiedCount} قيم معدّلة`
                : `${modifiedCount} customized value(s)`}
            </span>
          </div>
        </div>

        {/* Body: Left Controls + Right Live Visual Blueprint */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-3.5">
            {visibleFields.map((field) => {
              const current = spacing[field.key];
              const defVal = DEFAULT_CLIENT_STORY_DETAIL_SPACING[field.key];
              const isCustom = current !== defVal;
              return (
                <div
                  key={field.key}
                  className={`p-4 rounded-2xl border bg-white transition-colors space-y-2.5 ${
                    isCustom ? 'border-persici-crimson/35 shadow-2xs' : 'border-slate-200/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <label
                          htmlFor={`spacing-${field.key}`}
                          className="text-xs font-bold text-slate-900"
                        >
                          {isRtl ? field.labelAr : field.labelEn}
                        </label>
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange(field, defVal)}
                            className="px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-mono font-semibold cursor-pointer transition-colors"
                            title={isRtl ? 'إرجاع هذا الحقل للافتراضي' : 'Reset this field to default'}
                          >
                            {isRtl ? `افتراضي: ${defVal}px` : `Reset (${defVal}px)`}
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {isRtl ? field.descAr : field.descEn}
                      </p>
                    </div>

                    <div className="flex items-center h-9 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-persici-crimson focus-within:bg-white shrink-0 w-24">
                      <input
                        id={`spacing-${field.key}`}
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={current}
                        onChange={(e) => handleFieldChange(field, Number(e.target.value))}
                        className="w-full px-2 text-xs font-mono font-bold text-slate-900 outline-none bg-transparent text-end"
                      />
                      <span className="px-2 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 h-full flex items-center border-s border-slate-200">
                        px
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400 w-8">
                      {field.min}
                    </span>
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={current}
                      onChange={(e) => handleFieldChange(field, Number(e.target.value))}
                      className="flex-1 accent-persici-crimson cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-400 w-10 text-end">
                      {field.max}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Proportional Visual Wireframe Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-0 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {isRtl ? 'معاينة حية لهيكل المسافات' : 'Live Spacing Blueprint'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {isRtl ? 'مقياس تناسبي' : 'Scaled Preview'}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-[10px]">
                {/* Section 1 Preview */}
                <div
                  style={{
                    paddingBottom: `${previewScale(spacing.sectionToSectionGap * 0.55)}px`,
                  }}
                  className="border-b border-slate-200"
                >
                  {/* Title */}
                  <div
                    style={{ marginBottom: `${previewScale(spacing.titleToContentGap)}px` }}
                    className="h-3.5 w-32 rounded bg-slate-800 flex items-center px-1.5 text-[8px] font-bold text-white"
                  >
                    {isRtl ? 'عنوان القسم' : 'Section Title'}
                  </div>

                  {/* Image */}
                  <div
                    style={{ marginBottom: `${previewScale(spacing.imageToContentGap)}px` }}
                    className="h-10 w-full rounded-lg bg-slate-200/80 border border-slate-300/70 flex items-center justify-center font-mono text-[9px] text-slate-500"
                  >
                    {isRtl ? 'صورة القسم' : 'Section Image'} ({spacing.imageToContentGap}px below)
                  </div>

                  {/* Paragraphs */}
                  <div
                    style={{ rowGap: `${previewScale(spacing.paragraphToParagraphGap)}px` }}
                    className="flex flex-col"
                  >
                    <div className="h-2.5 w-full rounded bg-slate-300" />
                    <div className="h-2.5 w-5/6 rounded bg-slate-300" />
                  </div>

                  {/* Bullets */}
                  <div
                    style={{
                      marginTop: `${previewScale(spacing.contentToBulletsGap)}px`,
                      rowGap: `${previewScale(spacing.bulletToBulletGap)}px`,
                    }}
                    className="flex flex-col"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-persici-crimson shrink-0" />
                      <span className="h-2 w-3/4 rounded bg-slate-300" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-persici-crimson shrink-0" />
                      <span className="h-2 w-2/3 rounded bg-slate-300" />
                    </div>
                  </div>

                  {/* Code Blocks */}
                  <div
                    style={{
                      marginTop: `${previewScale(spacing.contentToCodeGap)}px`,
                      rowGap: `${previewScale(spacing.codeToCodeGap)}px`,
                    }}
                    className="flex flex-col"
                  >
                    <div className="h-5 rounded bg-slate-900/90 px-2 flex items-center font-mono text-[8px] text-emerald-400">
                      {'<code>Sample #1</code>'}
                    </div>
                    <div className="h-5 rounded bg-slate-900/90 px-2 flex items-center font-mono text-[8px] text-emerald-400">
                      {'<code>Sample #2</code>'}
                    </div>
                  </div>

                  {/* Pull Quote */}
                  <div
                    style={{ marginTop: `${previewScale(spacing.contentToQuoteGap)}px` }}
                    className="h-6 rounded-md border-s-2 border-persici-crimson bg-white px-2 flex items-center font-mono text-[8px] text-slate-600 shadow-2xs"
                  >
                    {isRtl ? 'اقتباس تنفيذي' : 'Pull Quote'} ({spacing.contentToQuoteGap}px top)
                  </div>
                </div>

                {/* Next Section / Deliverables indicator */}
                <div
                  style={{
                    paddingTop: `${previewScale(spacing.sectionToSectionGap * 0.45)}px`,
                  }}
                  className="space-y-1.5"
                >
                  <div className="h-3 w-28 rounded bg-slate-700/80" />
                  <div className="text-[9px] font-mono text-slate-500">
                    {isRtl
                      ? `الفجوة بين القسمين: ${spacing.sectionToSectionGap}px`
                      : `Gap between sections: ${spacing.sectionToSectionGap}px`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {statusMessage ? (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <TbCheck className="w-4 h-4 shrink-0" />
                ) : (
                  <TbAlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-500">
                {isDirty
                  ? isRtl
                    ? 'لديك تغييرات غير محفوظة'
                    : 'You have unsaved spacing adjustments'
                  : isRtl
                  ? 'جميع التغييرات محفوظة.'
                  : 'All changes synced globally.'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              disabled={saving || resetting}
              onClick={handleResetToDefaults}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              {resetting ? (
                <TbLoader2 className="w-4 h-4 animate-spin" />
              ) : (
                <TbRotate className="w-4 h-4 text-slate-500" />
              )}
              <span>
                {resetting
                  ? isRtl
                    ? 'جارٍ الاستعادة...'
                    : 'Resetting...'
                  : isRtl
                  ? 'إعادة التعيين للقيم الافتراضية'
                  : 'Reset to Defaults'}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              {isRtl ? 'إغلاق' : 'Close'}
            </button>

            <button
              type="button"
              disabled={saving || resetting}
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-persici-crimson hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-persici-crimson/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <TbLoader2 className="w-4 h-4 animate-spin" />
              ) : (
                <TbDeviceFloppy className="w-4 h-4" />
              )}
              <span>
                {saving
                  ? isRtl
                    ? 'جارٍ الحفظ...'
                    : 'Saving...'
                  : isRtl
                  ? 'حفظ إعدادات المسافات'
                  : 'Save Spacing Settings'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
