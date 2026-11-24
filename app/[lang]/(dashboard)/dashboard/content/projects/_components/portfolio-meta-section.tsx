'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  TbDeviceDesktop,
  TbDeviceMobile,
  TbMovie,
  TbPhoto,
  TbPlus,
  TbTrash,
  TbSparkles,
  TbCpu,
  TbPalette,
  TbCheck,
  TbChevronDown,
  TbExternalLink,
  TbX,
} from 'react-icons/tb';
import {
  DEFAULT_CLIENT_STORY_CATEGORIES,
  hasAnyBilingualText,
  normalizeBilingualInput,
  resolveBilingualText,
  slugifyCategorySlug,
  type ClientStoryCategory,
  type ClientStoryDetail,
  type StoryTemplateType,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';
import { AiFieldTrigger, type StoryAiFieldControls } from './ai-field-trigger';

interface PortfolioMetaSectionProps {
  story: ClientStoryDetail;
  onChange: (updated: ClientStoryDetail) => void;
  lang: string;
  categories?: ClientStoryCategory[];
  onCategoryCreated?: (cat: ClientStoryCategory) => void;
  aiControls?: StoryAiFieldControls;
}

const TEMPLATE_OPTIONS: {
  id: StoryTemplateType;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  icon: React.ElementType;
}[] = [
  {
    id: 'software-web-app-showcase',
    titleEn: 'Web App & Platform',
    titleAr: 'منصة وتطبيق ويب',
    descEn: 'macOS browser frame, tablet, mobile mockups, and tech stack badges',
    descAr: 'إطار متصفح ماك، أجهزة لوحية، شاشات جوال، وشارات التقنيات البرمجية',
    icon: TbDeviceDesktop,
  },
  {
    id: 'ai-platform-showcase',
    titleEn: 'AI Platforms',
    titleAr: 'منصات الذكاء الاصطناعي',
    descEn: 'Dedicated AI system & LLM platform showcase with interactive device frames and AI architecture stack',
    descAr: 'عرض مخصص لمنصات وأنظمة الذكاء الاصطناعي مع معاينات تفاعلية ومنظومة نماذج الذكاء الاصطناعي',
    icon: TbCpu,
  },
  {
    id: 'mobile-app-showcase',
    titleEn: 'Native Mobile App',
    titleAr: 'تطبيق جوال أصيل',
    descEn: 'Dedicated 660px smartphone chassis, animated GIFs, and portrait videos',
    descAr: 'هيكل هاتف ذكي مخصص 660px، ملفات GIF متحركة، وفيديوهات طولية',
    icon: TbDeviceMobile,
  },
  {
    id: 'marketing-video-showcase',
    titleEn: 'Marketing Video Campaign',
    titleAr: 'حملة تسويقية وفيديوهات',
    descEn: 'Master VideoPlayer with episode cuts tabs and high-res stills lightbox',
    descAr: 'مشغل فيديو متطور مع حلقات متعددة ومعرض لقطات بدقة عالية',
    icon: TbMovie,
  },
  {
    id: 'marketing-branding-showcase',
    titleEn: 'Marketing & Branding',
    titleAr: 'التسويق والهوية البصرية',
    descEn: 'Focused layout for projects with 1–2 videos and/or 1–2 key branding visuals without large galleries',
    descAr: 'تصميم مخصص للمشاريع التي تضم فيديو أو اثنين و/أو صورة أو صورتين رئيسيتين للهوية البصرية',
    icon: TbPalette,
  },
  {
    id: 'image-gallery-showcase',
    titleEn: 'Branding & Gallery',
    titleAr: 'هوية بصرية ومعرض صور',
    descEn: 'High-res image gallery with interactive full-screen lightbox modal',
    descAr: 'معرض بصري للعلامة التجارية مع استعراض صور عالي الجودة',
    icon: TbPhoto,
  },
];

export function PortfolioMetaSection({
  story,
  onChange,
  lang,
  categories,
  onCategoryCreated,
  aiControls,
}: PortfolioMetaSectionProps) {
  const isRtl = lang === 'ar';

  const [quickCatOpen, setQuickCatOpen] = useState(false);
  const [quickCatNameEn, setQuickCatNameEn] = useState('');
  const [quickCatNameAr, setQuickCatNameAr] = useState('');
  const [quickCatSlug, setQuickCatSlug] = useState('');
  const [quickCatSlugTouched, setQuickCatSlugTouched] = useState(false);
  const [quickCatSaving, setQuickCatSaving] = useState(false);
  const [quickCatError, setQuickCatError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'category' | 'template' | null>(null);
  const catDropdownRef = useRef<HTMLDivElement | null>(null);
  const tmplDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openDropdown) return;
    const handlePointerDown = (e: MouseEvent) => {
      const activeEl =
        openDropdown === 'category' ? catDropdownRef.current : tmplDropdownRef.current;
      if (activeEl && !activeEl.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openDropdown]);

  const availableCategories: ClientStoryCategory[] = (() => {
    const base =
      categories && categories.length > 0
        ? categories
        : DEFAULT_CLIENT_STORY_CATEGORIES;
    const currentSlug = story.categorySlug?.trim();
    if (currentSlug && currentSlug !== 'all' && !base.some((c) => c.slug === currentSlug)) {
      return [
        ...base,
        {
          id: currentSlug,
          slug: currentSlug,
          name: {
            en: resolveBilingualText(story.category, 'en') || currentSlug,
            ar: resolveBilingualText(story.category, 'ar') || currentSlug,
          },
          order: base.length + 1,
        },
      ];
    }
    return base;
  })();

  const partnerVal = normalizeBilingualInput(story.partner);
  const partnerEn = partnerVal.en;
  const partnerAr = partnerVal.ar;
  const hasPartnerEn = Boolean(partnerEn.trim());
  const hasPartnerAr = Boolean(partnerAr.trim());

  const clientVal = normalizeBilingualInput(story.client);
  const clientEn = clientVal.en;
  const clientAr = clientVal.ar;
  const hasClientEn = Boolean(clientEn.trim());
  const hasClientAr = Boolean(clientAr.trim());

  const handleSlugify = () => {
    if (!story.title?.en) return;
    const generated = story.title.en
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    onChange({ ...story, slug: generated });
  };

  const handleCategorySelect = (cat: ClientStoryCategory) => {
    onChange({
      ...story,
      categorySlug: cat.slug,
      category: {
        en: resolveBilingualText(cat.name, 'en'),
        ar: resolveBilingualText(cat.name, 'ar'),
      },
    });
  };

  const handleQuickCreateCategory = async () => {
    setQuickCatError(null);
    const trimmedName = { en: quickCatNameEn.trim(), ar: quickCatNameAr.trim() };
    if (!hasAnyBilingualText(trimmedName)) {
      setQuickCatError(
        isRtl
          ? 'يرجى إدخال اسم التصنيف بلغة واحدة على الأقل.'
          : 'Please enter a category name in at least one language.'
      );
      return;
    }

    const cleanSlug = slugifyCategorySlug(quickCatSlug || trimmedName.en);
    if (!cleanSlug || cleanSlug === 'all') {
      setQuickCatError(
        isRtl
          ? 'يرجى إدخال معرف Slug بالإنجليزية (مثال: fintech).'
          : 'Please enter a valid ASCII slug (e.g. fintech).'
      );
      return;
    }

    setQuickCatSaving(true);
    try {
      const res = await fetch('/api/projects/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: cleanSlug, name: trimmedName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.category) {
        setQuickCatError(data.error || 'Failed to create category');
        return;
      }

      const created = data.category as ClientStoryCategory;
      onCategoryCreated?.(created);
      onChange({
        ...story,
        categorySlug: created.slug,
        category: {
          en: resolveBilingualText(created.name, 'en'),
          ar: resolveBilingualText(created.name, 'ar'),
        },
      });
      setQuickCatOpen(false);
      setQuickCatNameEn('');
      setQuickCatNameAr('');
      setQuickCatSlug('');
      setQuickCatSlugTouched(false);
    } catch {
      setQuickCatError('Network error creating category.');
    } finally {
      setQuickCatSaving(false);
    }
  };

  const handleAddService = () => {
    const current = story.services || [];
    onChange({
      ...story,
      services: [...current, { en: 'New Service', ar: 'خدمة جديدة' }],
    });
  };

  const handleUpdateService = (
    index: number,
    field: 'en' | 'ar',
    val: string
  ) => {
    const current = [...(story.services || [])];
    current[index] = { ...current[index], [field]: val };
    onChange({ ...story, services: current });
  };

  const handleRemoveService = (index: number) => {
    const current = [...(story.services || [])];
    current.splice(index, 1);
    onChange({ ...story, services: current });
  };

  return (
    <div id="sec-meta" className="space-y-6 pt-2">
      <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-persici-crimson/10 text-persici-crimson text-xs font-mono font-bold flex items-center justify-center">
              01
            </span>
            <span>{isRtl ? 'البيانات الأساسية ونوع العرض' : 'General Settings & Showcase Type'}</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {isRtl
              ? 'تحديد المعرف (Slug)، اسم الشريك (اختياري قبل العميل)، اسم العميل، التصنيف، ونوع القالب التفاعلي المناسب للمشروع.'
              : 'Configure the unique URL slug, optional partner, client name, category, and showcase template.'}
          </p>
        </div>

        {aiControls && (
          <AiFieldTrigger
            variant="pill"
            lang={lang}
            hasReference={aiControls.hasReference}
            onMissingReference={aiControls.onMissingReference}
            isLoading={aiControls.generatingFieldKey === 'meta'}
            onGenerate={() => aiControls.onGenerateField('meta', { keyLabel: 'meta' })}
            labelEn="Auto-Fill Meta from Reference"
            labelAr="تعبئة البيانات الأساسية بالذكاء الاصطناعي"
          />
        )}
      </div>

      {/* 1. Client Story Category & Layout Template (Side-by-Side Modern Dropdowns) */}
      {(() => {
        const selectedCategory =
          availableCategories.find((c) => c.slug === story.categorySlug) ||
          availableCategories[0];
        const selectedTemplate =
          TEMPLATE_OPTIONS.find((t) => t.id === story.templateType) ||
          TEMPLATE_OPTIONS[0];
        const SelectedTemplateIcon = selectedTemplate.icon;

        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* Column 1: Client Story Category Dropdown (Name Only) */}
              <div ref={catDropdownRef} className="relative">
                <div className="flex items-center justify-between gap-2 mb-1.5 min-h-[22px]">
                  <label className="text-xs font-semibold text-slate-700">
                    {isRtl ? 'تصنيف القصة (Category)' : 'Client Story Category'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setQuickCatError(null);
                        setQuickCatOpen((prev) => !prev);
                      }}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      {quickCatOpen ? (
                        <TbX className="w-3 h-3" />
                      ) : (
                        <TbPlus className="w-3 h-3" />
                      )}
                      <span>{isRtl ? 'جديد' : 'New'}</span>
                    </button>
                    <Link
                      href={`/${lang}/dashboard/content/projects/categories`}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-persici-crimson transition-colors"
                      title={isRtl ? 'إدارة التصنيفات' : 'Manage Categories'}
                    >
                      <TbExternalLink className="w-3 h-3" />
                      <span>{isRtl ? 'إدارة' : 'Manage'}</span>
                    </Link>
                  </div>
                </div>

                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown === 'category'}
                  onClick={() =>
                    setOpenDropdown((prev) => (prev === 'category' ? null : 'category'))
                  }
                  className={`w-full h-10 px-3.5 rounded-xl border text-xs font-semibold text-slate-800 flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    openDropdown === 'category'
                      ? 'bg-white border-persici-crimson ring-2 ring-persici-crimson/15 shadow-xs'
                      : 'bg-slate-50 hover:bg-white border-slate-200'
                  }`}
                >
                  <span className="truncate">
                    {selectedCategory
                      ? resolveBilingualText(selectedCategory.name, lang)
                      : isRtl
                      ? 'اختر التصنيف'
                      : 'Select category'}
                  </span>
                  <TbChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openDropdown === 'category' ? 'rotate-180 text-persici-crimson' : ''
                    }`}
                  />
                </button>

                {openDropdown === 'category' && (
                  <div
                    role="listbox"
                    className="absolute z-30 mt-1.5 inset-x-0 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 max-h-64 overflow-y-auto"
                  >
                    {availableCategories.map((cat) => {
                      const isSelected = story.categorySlug === cat.slug;
                      const catLabel = resolveBilingualText(cat.name, lang);
                      return (
                        <button
                          key={cat.slug}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            handleCategorySelect(cat);
                            setOpenDropdown(null);
                          }}
                          className={`w-full px-3.5 py-2 text-start text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-persici-crimson/8 text-persici-crimson font-bold'
                              : 'text-slate-700 font-medium hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate">{catLabel}</span>
                          {isSelected && <TbCheck className="w-4 h-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Column 2: Layout Template Dropdown (Icon + Title) */}
              <div ref={tmplDropdownRef} className="relative">
                <div className="flex items-center justify-between gap-2 mb-1.5 min-h-[22px]">
                  <label className="text-xs font-semibold text-slate-700">
                    {isRtl ? 'قالب العرض (Layout Template)' : 'Layout Template'}
                  </label>
                </div>

                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown === 'template'}
                  onClick={() =>
                    setOpenDropdown((prev) => (prev === 'template' ? null : 'template'))
                  }
                  className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold text-slate-800 flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                    openDropdown === 'template'
                      ? 'bg-white border-persici-crimson ring-2 ring-persici-crimson/15 shadow-xs'
                      : 'bg-slate-50 hover:bg-white border-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-persici-crimson/10 text-persici-crimson flex items-center justify-center shrink-0">
                      <SelectedTemplateIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">
                      {isRtl ? selectedTemplate.titleAr : selectedTemplate.titleEn}
                    </span>
                  </span>
                  <TbChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openDropdown === 'template' ? 'rotate-180 text-persici-crimson' : ''
                    }`}
                  />
                </button>

                {openDropdown === 'template' && (
                  <div
                    role="listbox"
                    className="absolute z-30 mt-1.5 inset-x-0 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 max-h-72 overflow-y-auto"
                  >
                    {TEMPLATE_OPTIONS.map((tmpl) => {
                      const isSelected = story.templateType === tmpl.id;
                      const Icon = tmpl.icon;
                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            onChange({ ...story, templateType: tmpl.id });
                            setOpenDropdown(null);
                          }}
                          className={`w-full px-3 py-2 text-start text-xs flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-persici-crimson/8 text-persici-crimson font-bold'
                              : 'text-slate-700 font-medium hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-persici-crimson text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="truncate">
                              {isRtl ? tmpl.titleAr : tmpl.titleEn}
                            </span>
                          </span>
                          {isSelected && <TbCheck className="w-4 h-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Inline Quick-Add Category Drawer */}
            {quickCatOpen && (
              <div className="p-3.5 rounded-xl bg-slate-50/90 border border-persici-crimson/25 space-y-3 shadow-2xs">
                <div className="text-xs font-bold text-slate-800">
                  {isRtl ? 'إنشاء وتحديد تصنيف جديد فوراً' : 'Create & Select New Category'}
                </div>
                {quickCatError && (
                  <div className="text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg">
                    {quickCatError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={quickCatNameEn}
                    onChange={(e) => {
                      const val = e.target.value;
                      setQuickCatNameEn(val);
                      if (!quickCatSlugTouched) {
                        setQuickCatSlug(slugifyCategorySlug(val));
                      }
                    }}
                    placeholder={isRtl ? 'اسم التصنيف (EN)' : 'Category Name (EN)'}
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-persici-crimson outline-none"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    value={quickCatNameAr}
                    onChange={(e) => setQuickCatNameAr(e.target.value)}
                    placeholder={isRtl ? 'اسم التصنيف (AR)' : 'اسم التصنيف (AR)'}
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-persici-crimson outline-none font-arabic"
                  />
                  <input
                    type="text"
                    value={quickCatSlug}
                    onChange={(e) => {
                      setQuickCatSlugTouched(true);
                      setQuickCatSlug(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                      );
                    }}
                    placeholder="slug (e.g. fintech)"
                    className="px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:border-persici-crimson outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickCatOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:bg-white cursor-pointer"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    disabled={quickCatSaving}
                    onClick={() => void handleQuickCreateCategory()}
                    className="px-3.5 py-1.5 rounded-lg bg-persici-crimson hover:bg-red-700 text-white text-[11px] font-bold cursor-pointer disabled:opacity-50"
                  >
                    {quickCatSaving
                      ? isRtl
                        ? 'جارٍ الحفظ...'
                        : 'Creating...'
                      : isRtl
                      ? 'إنشاء وتحديد'
                      : 'Create & Select'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* 2. Slug, Partner (before Client) & Client Name */}
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              {isRtl ? 'المعرف الفريد (URL Slug)' : 'Story URL Slug'}
            </label>
            <div className="flex items-center gap-2">
              {aiControls && (
                <AiFieldTrigger
                  lang={lang}
                  hasReference={aiControls.hasReference}
                  onMissingReference={aiControls.onMissingReference}
                  isLoading={aiControls.generatingFieldKey === 'slug'}
                  onGenerate={() => aiControls.onGenerateField('slug', { keyLabel: 'slug' })}
                />
              )}
              <button
                type="button"
                onClick={handleSlugify}
                className="text-[11px] text-persici-crimson hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <TbSparkles className="w-3 h-3" />
                <span>{isRtl ? 'من العنوان' : 'From Title'}</span>
              </button>
            </div>
          </div>
          <input
            type="text"
            required
            value={story.slug}
            onChange={(e) => onChange({ ...story, slug: e.target.value })}
            placeholder="my-case-study-slug"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-persici-crimson outline-none"
          />
        </div>

        {/* 2B. Partner Name (Optional — EN & AR, Before Client) */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {isRtl
                  ? 'اسم الشريك (اختياري — بالإنجليزية والعربية، قبل العميل)'
                  : 'Partner Name (Optional — EN & AR, Before Client)'}
              </span>
              {hasPartnerEn && !hasPartnerAr && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600">
                  {isRtl
                    ? 'العربية تستخدم الإنجليزية تلقائياً حتى إدخالها'
                    : 'AR uses EN until filled'}
                </span>
              )}
              {!hasPartnerEn && hasPartnerAr && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600">
                  {isRtl
                    ? 'الإنجليزية تستخدم العربية تلقائياً حتى إدخالها'
                    : 'EN uses AR until filled'}
                </span>
              )}
            </div>
            {aiControls && (
              <AiFieldTrigger
                lang={lang}
                hasReference={aiControls.hasReference}
                onMissingReference={aiControls.onMissingReference}
                isLoading={aiControls.generatingFieldKey === 'partner'}
                onGenerate={() => aiControls.onGenerateField('partner', { keyLabel: 'partner' })}
              />
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isRtl ? 'اسم الشريك (English)' : 'Partner Name (EN)'}
              </label>
              <input
                type="text"
                value={partnerEn}
                onChange={(e) =>
                  onChange({
                    ...story,
                    partner: { en: e.target.value, ar: partnerAr },
                  })
                }
                placeholder={
                  !hasPartnerEn && hasPartnerAr
                    ? isRtl
                      ? `تلقائياً: "${partnerAr.trim()}" (أدخل بالإنجليزية لاستبداله)`
                      : `Uses "${partnerAr.trim()}" until English is entered`
                    : isRtl
                    ? 'اختياري: اتركه فارغاً إن لم يوجد شريك'
                    : 'Optional: e.g. Co-Partner or Tech Partner (leave blank if none)'
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-persici-crimson outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isRtl ? 'اسم الشريك (العربية)' : 'Partner Name (AR)'}
              </label>
              <input
                type="text"
                dir="rtl"
                value={partnerAr}
                onChange={(e) =>
                  onChange({
                    ...story,
                    partner: { en: partnerEn, ar: e.target.value },
                  })
                }
                placeholder={
                  !hasPartnerAr && hasPartnerEn
                    ? `تلقائياً: "${partnerEn.trim()}" (أدخل الاسم بالعربية لاستبداله)`
                    : 'اختياري: اتركه فارغاً إن لم يوجد شريك'
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-persici-crimson outline-none font-arabic"
              />
            </div>
          </div>
        </div>

        {/* 2C. Client Organization Name (EN & AR — At Least One Language Required) */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {isRtl
                  ? 'اسم العميل / المؤسسة (بالإنجليزية والعربية)'
                  : 'Client Organization Name (EN & AR)'}
              </span>
              {!hasClientEn && !hasClientAr ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-semibold text-amber-800">
                  {isRtl ? 'لغة واحدة مطلوبة على الأقل' : 'At least 1 language required'}
                </span>
              ) : hasClientEn && !hasClientAr ? (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600">
                  {isRtl
                    ? 'العربية تستخدم الإنجليزية تلقائياً حتى إدخالها'
                    : 'AR uses EN until filled'}
                </span>
              ) : !hasClientEn && hasClientAr ? (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600">
                  {isRtl
                    ? 'الإنجليزية تستخدم العربية تلقائياً حتى إدخالها'
                    : 'EN uses AR until filled'}
                </span>
              ) : null}
            </div>
            {aiControls && (
              <AiFieldTrigger
                lang={lang}
                hasReference={aiControls.hasReference}
                onMissingReference={aiControls.onMissingReference}
                isLoading={aiControls.generatingFieldKey === 'client'}
                onGenerate={() => aiControls.onGenerateField('client', { keyLabel: 'client' })}
              />
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isRtl ? 'اسم العميل / المؤسسة (English)' : 'Client Organization Name (EN)'}
              </label>
              <input
                type="text"
                required={!hasClientAr}
                value={clientEn}
                onChange={(e) =>
                  onChange({
                    ...story,
                    client: { en: e.target.value, ar: clientAr },
                  })
                }
                placeholder={
                  !hasClientEn && hasClientAr
                    ? isRtl
                      ? `تلقائياً: "${clientAr.trim()}" (أدخل بالإنجليزية لاستبداله)`
                      : `Uses "${clientAr.trim()}" until English is entered`
                    : 'e.g. Khazan, Hala Food, Meraas'
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-persici-crimson outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isRtl ? 'اسم العميل / المؤسسة (العربية)' : 'Client Organization Name (AR)'}
              </label>
              <input
                type="text"
                dir="rtl"
                required={!hasClientEn}
                value={clientAr}
                onChange={(e) =>
                  onChange({
                    ...story,
                    client: { en: clientEn, ar: e.target.value },
                  })
                }
                placeholder={
                  !hasClientAr && hasClientEn
                    ? `تلقائياً: "${clientEn.trim()}" (أدخل الاسم بالعربية لاستبداله)`
                    : 'مثال: خزان، هلا فود، مِراس'
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-persici-crimson outline-none font-arabic"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. External URL */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {isRtl ? 'الرابط المباشر للمشروع (إن وجد)' : 'Live External URL (Optional)'}
        </label>
        <input
          type="url"
          value={story.link || ''}
          onChange={(e) => onChange({ ...story, link: e.target.value })}
          placeholder="https://..."
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:border-persici-crimson outline-none"
        />
      </div>

      {/* 4. Topic/Industry (EN & AR) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isRtl ? 'المجال والصناعة (Topic / Industry)' : 'Topic / Industry (EN & AR)'}
          </span>
          {aiControls && (
            <AiFieldTrigger
              lang={lang}
              hasReference={aiControls.hasReference}
              onMissingReference={aiControls.onMissingReference}
              isLoading={aiControls.generatingFieldKey === 'topic'}
              onGenerate={() => aiControls.onGenerateField('topic', { keyLabel: 'topic' })}
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'المجال / الصناعة (English)' : 'Topic / Industry (EN)'}
          </label>
          <input
            type="text"
            value={story.topic?.en || ''}
            onChange={(e) =>
              onChange({
                ...story,
                topic: { en: e.target.value, ar: story.topic?.ar || '' },
              })
            }
            placeholder="e.g. Food & Beverage / FMCG Marketing"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'المجال / الصناعة (العربية)' : 'Topic / Industry (AR)'}
          </label>
          <input
            type="text"
            dir="rtl"
            value={story.topic?.ar || ''}
            onChange={(e) =>
              onChange({
                ...story,
                topic: { en: story.topic?.en || '', ar: e.target.value },
              })
            }
            placeholder="مثال: الأغذية والمنتجات الاستهلاكية"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none font-arabic"
          />
        </div>
      </div>
      </div>

      {/* 5. Region (EN & AR) + Date */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isRtl ? 'المنطقة والتاريخ (Region & Date)' : 'Geographic Region & Date'}
          </span>
          {aiControls && (
            <AiFieldTrigger
              lang={lang}
              hasReference={aiControls.hasReference}
              onMissingReference={aiControls.onMissingReference}
              isLoading={aiControls.generatingFieldKey === 'region'}
              onGenerate={() => aiControls.onGenerateField('region', { keyLabel: 'region' })}
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'المنطقة الجغرافية (EN)' : 'Region (EN)'}
          </label>
          <input
            type="text"
            value={story.region?.en || ''}
            onChange={(e) =>
              onChange({
                ...story,
                region: { en: e.target.value, ar: story.region?.ar || '' },
              })
            }
            placeholder="Saudi Arabia & GCC"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'المنطقة الجغرافية (AR)' : 'Region (AR)'}
          </label>
          <input
            type="text"
            dir="rtl"
            value={story.region?.ar || ''}
            onChange={(e) =>
              onChange({
                ...story,
                region: { en: story.region?.en || '', ar: e.target.value },
              })
            }
            placeholder="المملكة العربية السعودية والخليج"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none font-arabic"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'تاريخ الإنجاز (Date/Year)' : 'Delivery Date / Year'}
          </label>
          <input
            type="text"
            value={story.date || ''}
            onChange={(e) => onChange({ ...story, date: e.target.value })}
            placeholder="August 2025"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none"
          />
        </div>
      </div>
      </div>

      {/* 6. Featured Toggle & Priority Order */}
      <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200/90">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(story.featured)}
            onChange={(e) => onChange({ ...story, featured: e.target.checked })}
            className="w-4 h-4 rounded text-persici-crimson focus:ring-persici-crimson cursor-pointer"
          />
          <span className="text-xs font-semibold text-slate-900">
            {isRtl ? 'تمييز كدراسة حالة رئيسية (Featured Story)' : 'Featured Flagship Story'}
          </span>
        </label>

        {story.featured && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              {isRtl ? 'ترتيب الظهور:' : 'Display Priority:'}
            </span>
            <input
              type="number"
              min={1}
              max={99}
              value={story.featuredOrder || 1}
              onChange={(e) =>
                onChange({ ...story, featuredOrder: parseInt(e.target.value, 10) || 1 })
              }
              className="w-16 px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg font-mono text-center"
            />
          </div>
        )}
      </div>

      {/* 7. Services Delivered Repeater */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isRtl ? 'الخدمات المقدمة (Services Delivered)' : 'Services Delivered'}
          </label>
          <div className="flex items-center gap-2">
            {aiControls && (
              <AiFieldTrigger
                lang={lang}
                hasReference={aiControls.hasReference}
                onMissingReference={aiControls.onMissingReference}
                isLoading={aiControls.generatingFieldKey === 'services'}
                onGenerate={() => aiControls.onGenerateField('services', { keyLabel: 'services' })}
                labelEn="Generate Services List"
                labelAr="استخراج الخدمات"
              />
            )}
            <button
              type="button"
              onClick={handleAddService}
              className="inline-flex items-center gap-1 text-xs font-semibold text-persici-crimson hover:underline cursor-pointer"
            >
              <TbPlus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة خدمة' : 'Add Service'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {(story.services || []).map((srv, sIdx) => (
            <div
              key={sIdx}
              className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200"
            >
              <input
                type="text"
                value={srv.en}
                onChange={(e) => handleUpdateService(sIdx, 'en', e.target.value)}
                placeholder="Service (English)"
                className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                dir="rtl"
                value={srv.ar}
                onChange={(e) => handleUpdateService(sIdx, 'ar', e.target.value)}
                placeholder="الخدمة (بالعربية)"
                className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
              />
              <button
                type="button"
                onClick={() => handleRemoveService(sIdx)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white"
              >
                <TbTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
