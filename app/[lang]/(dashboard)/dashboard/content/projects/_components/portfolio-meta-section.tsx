'use client';

import React from 'react';
import {
  TbDeviceDesktop,
  TbDeviceMobile,
  TbMovie,
  TbPhoto,
  TbPlus,
  TbTrash,
  TbSparkles,
} from 'react-icons/tb';
import type {
  ClientStoryDetail,
  StoryTemplateType,
  StoryCategorySlug,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';

interface PortfolioMetaSectionProps {
  story: ClientStoryDetail;
  onChange: (updated: ClientStoryDetail) => void;
  lang: string;
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
    id: 'image-gallery-showcase',
    titleEn: 'Branding & Gallery',
    titleAr: 'هوية بصرية ومعرض صور',
    descEn: 'High-res image gallery with interactive full-screen lightbox modal',
    descAr: 'معرض بصري للعلامة التجارية مع استعراض صور عالي الجودة',
    icon: TbPhoto,
  },
];

const CATEGORY_OPTIONS: {
  slug: StoryCategorySlug;
  labelEn: string;
  labelAr: string;
}[] = [
  {
    slug: 'software',
    labelEn: 'Software & Web Apps',
    labelAr: 'البرمجيات والتطبيقات الرقمية',
  },
  {
    slug: 'branding',
    labelEn: 'Branding & Identity',
    labelAr: 'الهوية البصرية والعلامة التجارية',
  },
  {
    slug: 'marketing',
    labelEn: 'Marketing & Performance',
    labelAr: 'الحملات ونمو العلامة التجارية',
  },
  {
    slug: 'video-production',
    labelEn: 'Media Production & Films',
    labelAr: 'الإنتاج المرئي والسينمائي',
  },
];

export function PortfolioMetaSection({
  story,
  onChange,
  lang,
}: PortfolioMetaSectionProps) {
  const isRtl = lang === 'ar';

  const handleSlugify = () => {
    if (!story.title?.en) return;
    const generated = story.title.en
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    onChange({ ...story, slug: generated });
  };

  const handleCategoryChange = (slug: StoryCategorySlug) => {
    const selected = CATEGORY_OPTIONS.find((c) => c.slug === slug);
    if (!selected) return;
    onChange({
      ...story,
      categorySlug: slug,
      category: { en: selected.labelEn, ar: selected.labelAr },
    });
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
      <div className="border-b border-slate-200 pb-3">
        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-persici-crimson/10 text-persici-crimson text-xs font-mono font-bold flex items-center justify-center">
            01
          </span>
          <span>{isRtl ? 'البيانات الأساسية ونوع العرض' : 'General Settings & Showcase Type'}</span>
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          {isRtl
            ? 'تحديد المعرف (Slug)، اسم العميل، التصنيف، ونوع القالب التفاعلي المناسب للمشروع.'
            : 'Configure the unique URL slug, client name, category, and target showcase template.'}
        </p>
      </div>

      {/* 1. Template Type Selector (Interactive Card Selector) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {isRtl ? 'نوع قالب العرض (Showcase Template)' : 'Showcase Template Type'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATE_OPTIONS.map((tmpl) => {
            const isSelected = story.templateType === tmpl.id;
            const Icon = tmpl.icon;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onChange({ ...story, templateType: tmpl.id })}
                className={`p-4 rounded-xl border text-start transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'border-persici-crimson bg-persici-crimson/5 ring-2 ring-persici-crimson/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-persici-crimson text-white border-persici-crimson'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900">
                    {isRtl ? tmpl.titleAr : tmpl.titleEn}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {isRtl ? tmpl.descAr : tmpl.descEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Slug & Client Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              {isRtl ? 'المعرف الفريد (URL Slug)' : 'Story URL Slug'}
            </label>
            <button
              type="button"
              onClick={handleSlugify}
              className="text-[11px] text-persici-crimson hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <TbSparkles className="w-3 h-3" />
              <span>{isRtl ? 'توليد من العنوان' : 'Generate from Title'}</span>
            </button>
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'اسم العميل / المؤسسة' : 'Client Organization Name'}
          </label>
          <input
            type="text"
            required
            value={story.client || ''}
            onChange={(e) => onChange({ ...story, client: e.target.value })}
            placeholder="e.g. Khazan, Hala Food, Meraas"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-persici-crimson outline-none"
          />
        </div>
      </div>

      {/* 3. Category & External Link */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isRtl ? 'التصنيف الرئيسي (Category)' : 'Primary Category'}
          </label>
          <select
            value={story.categorySlug || 'software'}
            onChange={(e) => handleCategoryChange(e.target.value as StoryCategorySlug)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-persici-crimson outline-none cursor-pointer"
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.labelEn} - {cat.labelAr}
              </option>
            ))}
          </select>
        </div>

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
      </div>

      {/* 4. Topic/Industry (EN & AR) */}
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

      {/* 5. Region (EN & AR) + Date */}
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
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isRtl ? 'الخدمات المقدمة (Services Delivered)' : 'Services Delivered'}
          </label>
          <button
            type="button"
            onClick={handleAddService}
            className="inline-flex items-center gap-1 text-xs font-semibold text-persici-crimson hover:underline cursor-pointer"
          >
            <TbPlus className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إضافة خدمة' : 'Add Service'}</span>
          </button>
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
