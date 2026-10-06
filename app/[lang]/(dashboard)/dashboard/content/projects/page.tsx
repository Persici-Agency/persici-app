'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  TbBriefcase,
  TbPlus,
  TbRefresh,
  TbX,
  TbSearch,
  TbDeviceFloppy,
  TbExternalLink,
  TbSparkles,
  TbDatabaseImport,
} from 'react-icons/tb';
import { MediaPickerModal } from '@dashboard-shared/components';
import type {
  ClientStoryDetail,
  StoryCategorySlug,
  StoryTemplateType,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';
import {
  PortfolioStatsBar,
  PortfolioCard,
  PortfolioTocRail,
  PortfolioMetaSection,
  PortfolioHeroSection,
  PortfolioMetricsSection,
  PortfolioNarrativeSection,
  PortfolioMediaShowcaseSection,
} from './_components';

const DEFAULT_NEW_STORY: ClientStoryDetail = {
  id: '',
  slug: '',
  templateType: 'software-web-app-showcase',
  category: {
    en: 'Software & Web Apps',
    ar: 'البرمجيات والتطبيقات الرقمية',
  },
  categorySlug: 'software',
  featured: false,
  featuredOrder: 1,
  title: {
    en: 'New Enterprise Case Study',
    ar: 'دراسة حالة مؤسسية جديدة',
  },
  leadSubtitle: {
    en: 'Architecting digital transformation and high-performance engineering.',
    ar: 'هندسة التحول الرقمي والتطوير التقني عالي الأداء.',
  },
  executiveSummary: {
    en: 'Persici partnered with the enterprise leadership to engineer scalable digital systems, resulting in measurable business growth.',
    ar: 'شاركت بيرسيشي القيادة المؤسسية في بناء منظومة برمجية متطورة، محققة قفزات نوعية في نمو الأعمال.',
  },
  client: 'Enterprise Client',
  topic: {
    en: 'Enterprise Software & Cloud',
    ar: 'البرمجيات السحابية والمؤسسية',
  },
  services: [
    { en: 'Digital Architecture', ar: 'الهندسة المعمارية الرقمية' },
    { en: 'UI/UX Design', ar: 'تصميم تجربة المستخدم' },
  ],
  region: {
    en: 'Saudi Arabia & GCC',
    ar: 'المملكة العربية السعودية والخليج',
  },
  date: '2025',
  heroImage: '/images/hero/hero-poster.webp',
  metrics: [
    {
      value: '+240%',
      label: { en: 'Performance Lift', ar: 'ارتفاع كفاءة الأداء' },
    },
    {
      value: '99.99%',
      label: { en: 'System Availability', ar: 'موثوقية النظام' },
    },
  ],
  intro: {
    id: 'intro',
    title: {
      en: 'Overview & Cultural Background',
      ar: 'نظرة عامة وسياق المشروع',
    },
    paragraphs: [
      {
        en: 'The organization required a modern digital infrastructure to match its growing customer base and operational complexity.',
        ar: 'احتاجت المؤسسة إلى بنية تحتية رقمية حديثة تواكب التوسع السريع في قاعدة عملائها وتلبي متطلبات عملياتها التشغيلية.',
      },
    ],
    bullets: [
      {
        en: 'High market competition demanding modern user experiences',
        ar: 'تنافسية سوقية متصاعدة تتطلب تجارب مستخدم استثنائية',
      },
    ],
  },
  problem: {
    id: 'the-problem',
    title: {
      en: 'The Strategic Challenge',
      ar: 'التحدي والمشكلة الاستراتيجية',
    },
    paragraphs: [
      {
        en: 'Legacy systems and fragmented architectures were bottlenecking release cycles and impacting conversion rates across platforms.',
        ar: 'كانت الأنظمة القديمة والبنية المجزأة تعيق سرعة إطلاق التحديثات وتؤثر سلباً على معدلات التحويل والمبيعات.',
      },
    ],
    bullets: [
      {
        en: 'Legacy architectural technical debt across touchpoints',
        ar: 'تراكم الديون التقنية للأنظمة القديمة في مختلف القنوات',
      },
    ],
  },
  solution: {
    id: 'the-solution',
    title: {
      en: 'The Engineered Solution',
      ar: 'الحل المعماري والتنفيذ',
    },
    paragraphs: [
      {
        en: 'Persici engineered a headless cloud-native architecture with optimized data pipelines and ultra-fast page experiences.',
        ar: 'طورت بيرسيشي بنية سحابية حديثة قائمة على أحدث معايير الأداء ومسارات البيانات السريعة مع تجربة تصفح فائقة السلاسة.',
      },
    ],
    bullets: [
      {
        en: 'Headless Next.js App Router engineering with sub-second latency',
        ar: 'بنية برمجية فائقة السرعة مع زمن استجابة لا يتعدى أجزاء من الثانية',
      },
    ],
  },
  impact: {
    id: 'the-impact',
    title: {
      en: 'The Measurable Impact',
      ar: 'الأثر والنتائج وعائد الاستثمار',
    },
    paragraphs: [
      {
        en: 'The deployment drove a measurable increase in conversion velocity and secured award-winning industry recognition.',
        ar: 'حقق الإطلاق قفزة نوعية في سرعة التحويل ونمواً مباشراً في الإيرادات مع إشادة واسعة في السوق الإقليمي.',
      },
    ],
  },
  mediaShowcase: {
    title: {
      en: 'Deliverables & Production',
      ar: 'معرض المخرجات والإنتاج',
    },
    description: {
      en: 'Explore the responsive digital platform deliverables engineered by Persici.',
      ar: 'استكشف مخرجات المنصة الرقمية التي تم تطويرها بالكامل من قبل بيرسيشي.',
    },
    mockups: [
      {
        type: 'desktop',
        image: '/images/hero/hero-poster.webp',
        title: { en: 'Executive Dashboard', ar: 'لوحة التحكم التنفيذية' },
        mediaType: 'image',
      },
    ],
    techStack: [
      { name: 'Next.js', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Tailwind CSS', category: 'frontend' },
      { name: 'MongoDB', category: 'database' },
    ],
  },
  relatedSlugs: [],
};

export default function ProjectsManagerPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  const [stories, setStories] = useState<ClientStoryDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Editor State
  const [editingStory, setEditingStory] = useState<ClientStoryDetail | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTocSection, setActiveTocSection] = useState('sec-meta');

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | StoryCategorySlug>('all');
  const [templateFilter, setTemplateFilter] = useState<'all' | StoryTemplateType>('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Media Picker Modal State
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerType, setMediaPickerType] = useState<'image' | 'video' | 'all'>('image');
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);

  const loadStories = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      const data = await res.json();
      if (data.projects) {
        setStories(data.projects);
      }
    } catch (err) {
      console.error('Failed to load portfolio stories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/projects', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (active && data.projects) {
          setStories(data.projects);
        }
      })
      .catch((err) => {
        console.error('Failed to load portfolio stories:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Open Media Picker helper
  const handleOpenMediaPicker = (
    callbackOrTarget: ((url: string) => void) | 'heroImage' | 'heroVideo' | 'heroVideoPoster',
    type: 'image' | 'video' | 'all' = 'image'
  ) => {
    setMediaPickerType(type);
    if (typeof callbackOrTarget === 'function') {
      setMediaPickerCallback(() => callbackOrTarget);
    } else {
      setMediaPickerCallback(() => (url: string) => {
        if (editingStory) {
          setEditingStory((prev) => (prev ? { ...prev, [callbackOrTarget]: url } : null));
        }
      });
    }
    setMediaPickerOpen(true);
  };

  const handleMediaPickerSelect = (url: string) => {
    if (mediaPickerCallback) {
      mediaPickerCallback(url);
    }
    setMediaPickerOpen(false);
    setMediaPickerCallback(null);
  };

  // Open Create Modal
  const openNewProject = () => {
    setIsCreating(true);
    setActiveTocSection('sec-meta');
    setEditingStory({
      ...DEFAULT_NEW_STORY,
      id: `story-${Date.now()}`,
      slug: `case-study-${Date.now()}`,
    });
  };

  // Open Edit Modal
  const openEditStory = (story: ClientStoryDetail) => {
    setIsCreating(false);
    setActiveTocSection('sec-meta');
    setEditingStory({ ...story });
  };

  // Save Story (POST or PUT)
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingStory) return;

    if (!editingStory.slug || !editingStory.title?.en) {
      alert(isRtl ? 'يرجى إدخال المعرف (Slug) وعنوان المشروع بالإنجليزية على الأقل.' : 'Please provide at least a slug and English title.');
      return;
    }

    setSaving(true);
    try {
      const url = '/api/projects';
      const method = isCreating ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStory),
      });

      if (res.ok) {
        setEditingStory(null);
        setIsCreating(false);
        loadStories(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Error saving story: ${errorData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Failed to save story:', err);
      alert('Network error while saving case study.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Story
  const handleDelete = async (slug: string) => {
    const confirmMsg = isRtl
      ? `هل أنت متأكد من رغبتك في حذف دراسة الحالة "${slug}" نهائياً؟`
      : `Are you sure you want to permanently delete case study "${slug}"?`;
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/projects?slug=${slug}&id=${slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setStories((prev) => prev.filter((p) => p.slug !== slug));
      } else {
        alert('Failed to delete story');
      }
    } catch (err) {
      console.error('Failed to delete story:', err);
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (story: ClientStoryDetail) => {
    const updated = { ...story, featured: !story.featured };
    setStories((prev) => prev.map((s) => (s.slug === story.slug ? updated : s)));

    try {
      await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
      loadStories();
    }
  };

  // Sync / Seed Default Master Stories
  const handleSeedDefaults = async () => {
    const confirmMsg = isRtl
      ? 'هل ترغب في مزامنة واستعادة 16 دراسة حالة قياسية إلى قاعدة البيانات؟'
      : 'Sync/restore the 16 standard Persici case studies into MongoDB Atlas?';
    if (!confirm(confirmMsg)) return;

    setSeeding(true);
    try {
      const res = await fetch('/api/projects?seed=true', { cache: 'no-store' });
      if (res.ok) {
        loadStories();
      }
    } catch (err) {
      console.error('Failed to seed projects:', err);
    } finally {
      setSeeding(false);
    }
  };

  // Filtered stories calculation
  const filteredStories = stories.filter((story) => {
    const q = searchQuery.toLowerCase().trim();
    const titleEn = story.title?.en?.toLowerCase() || '';
    const titleAr = story.title?.ar?.toLowerCase() || '';
    const clientName = typeof story.client === 'string' ? story.client.toLowerCase() : '';
    const slug = story.slug?.toLowerCase() || '';

    const matchesQuery = !q || titleEn.includes(q) || titleAr.includes(q) || clientName.includes(q) || slug.includes(q);
    const matchesCategory = categoryFilter === 'all' || story.categorySlug === categoryFilter;
    const matchesTemplate = templateFilter === 'all' || story.templateType === templateFilter;
    const matchesFeatured = !featuredOnly || Boolean(story.featured);

    return matchesQuery && matchesCategory && matchesTemplate && matchesFeatured;
  });

  return (
    <div className="space-y-6 max-w-7xl pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. Page Master Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-persici-crimson mb-1.5">
            <TbSparkles className="w-4 h-4" />
            <span>{isRtl ? 'معرض الأعمال ودراسات الحالة' : 'Portfolio & Client Stories CMS'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isRtl ? 'إدارة مشاريع وقصص نجاح العملاء' : 'Portfolio Projects & Case Studies'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            {isRtl
              ? 'إنشاء وتعديل دراسات الحالة المتكاملة، وتحديد نوع القالب المناسب (تطبيقات ويب، تطبيقات جوال، حملات فيديو)، وإدارة مقاييس الأداء ومكتبة الوسائط.'
              : 'Create, edit, and style enterprise case studies. Configure specialized showcase templates (Web Apps, Mobile Apps, Video Reels), metrics, and Cloudflare R2 media assets.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={openNewProject}
            className="flex items-center gap-2 px-5 py-2.5 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-persici-crimson/20 transition-all cursor-pointer"
          >
            <TbPlus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة دراسة حالة جديدة' : 'Create Case Study'}</span>
          </button>

          <button
            type="button"
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            title="Sync/Restore Default Master Stories"
          >
            <TbDatabaseImport className="w-4 h-4 text-slate-500" />
            <span>{seeding ? (isRtl ? 'جارٍ المزامنة...' : 'Syncing...') : (isRtl ? 'مزامنة الافتراضي' : 'Sync Defaults')}</span>
          </button>

          <button
            type="button"
            onClick={() => loadStories(true)}
            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Refresh list"
          >
            <TbRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Portfolio Stats Bar */}
      <PortfolioStatsBar stories={stories} lang={lang} />

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <TbSearch className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'البحث بالاسم، العميل، أو المعرف...' : 'Search by title, client, or slug...'}
              className="w-full ps-9 pe-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none"
            />
          </div>

          {/* Template Filter & Featured Checkbox */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={templateFilter}
              onChange={(e) =>
                setTemplateFilter(e.target.value as StoryTemplateType | 'all')
              }
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:border-persici-crimson outline-none cursor-pointer"
            >
              <option value="all">{isRtl ? 'جميع القوالب' : 'All Showcase Templates'}</option>
              <option value="software-web-app-showcase">{isRtl ? 'تطبيقات الويب (Web App)' : 'Web App & Platform'}</option>
              <option value="mobile-app-showcase">{isRtl ? 'تطبيقات الجوال (Mobile App)' : 'Native Mobile App'}</option>
              <option value="marketing-video-showcase">{isRtl ? 'فيديو وحملات (Marketing Video)' : 'Marketing Video Reel'}</option>
              <option value="image-gallery-showcase">{isRtl ? 'معرض صور (Image Gallery)' : 'Branding Image Gallery'}</option>
            </select>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="rounded text-persici-crimson cursor-pointer"
              />
              <span>{isRtl ? 'المميزة فقط' : 'Featured Only'}</span>
            </label>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
          <span className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider shrink-0 me-1">
            {isRtl ? 'التصنيف:' : 'Category:'}
          </span>
          {[
            { id: 'all' as const, labelEn: 'All Categories', labelAr: 'الكل' },
            { id: 'software' as const, labelEn: 'Software & Web Apps', labelAr: 'البرمجيات والتطبيقات' },
            { id: 'branding' as const, labelEn: 'Branding & Identity', labelAr: 'الهوية البصرية' },
            { id: 'marketing' as const, labelEn: 'Marketing & Performance', labelAr: 'الحملات ونمو العلامة' },
            { id: 'video-production' as const, labelEn: 'Media Production & Films', labelAr: 'الإنتاج المرئي' },
          ].map((cat) => {
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isRtl ? cat.labelAr : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Stories Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-persici-crimson border-t-transparent mb-3" />
          <p className="text-sm font-medium">{isRtl ? 'جارٍ تحميل دراسات الحالة...' : 'Loading portfolio case studies...'}</p>
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center text-slate-400 space-y-3">
          <TbBriefcase className="w-12 h-12 mx-auto opacity-30 text-slate-400" />
          <h3 className="text-base font-bold text-slate-800">
            {isRtl ? 'لم يتم العثور على دراسات حالة' : 'No Case Studies Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isRtl
              ? 'جرّب تعديل عبارة البحث أو الفلاتر، أو قم بإضافة دراسة حالة جديدة الآن.'
              : 'Try adjusting your search criteria or create a new case study to get started.'}
          </p>
          <button
            type="button"
            onClick={openNewProject}
            className="inline-flex items-center gap-2 px-4 py-2 bg-persici-crimson text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            <TbPlus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة دراسة حالة جديدة' : 'Create Case Study'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <PortfolioCard
              key={story.slug}
              story={story}
              lang={lang}
              onEdit={openEditStory}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DEEP PORTFOLIO STORY EDITOR DRAWER / MODAL                             */}
      {/* ========================================================================= */}
      {editingStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-6xl w-full my-4 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Top Header Bar */}
            <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/80 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                  <span className="font-bold text-persici-crimson uppercase">
                    {isCreating ? (isRtl ? 'إضافة مشروع جديد' : 'New Case Study') : (isRtl ? 'تعديل دراسة الحالة' : 'Edit Story')}
                  </span>
                  <span>•</span>
                  <span className="truncate">/{editingStory.slug}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate mt-0.5">
                  {editingStory.title?.en || 'Untitled Story'}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!isCreating && (
                  <a
                    href={`/${lang}/client-stories/${editingStory.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors shadow-xs"
                  >
                    <TbExternalLink className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'معاينة حية' : 'Live Preview'}</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <TbDeviceFloppy className="w-4 h-4" />
                  <span>{saving ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') : (isRtl ? 'حفظ ونشر' : 'Save & Publish')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  <TbX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Left Table of Contents Rail + Right Scrollable Sections */}
            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row p-4 sm:p-6 gap-6">
              {/* Left Sticky Table of Contents Navigator */}
              <PortfolioTocRail
                activeSection={activeTocSection}
                onSelectSection={(id) => {
                  setActiveTocSection(id);
                  const el = document.getElementById(id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                lang={lang}
              />

              {/* Right Content Editor Form */}
              <div className="flex-1 min-w-0 space-y-10 pb-8">
                {/* Section 01: Meta & General */}
                <PortfolioMetaSection
                  story={editingStory}
                  onChange={setEditingStory}
                  lang={lang}
                />

                {/* Section 02: Hero & Summary */}
                <PortfolioHeroSection
                  story={editingStory}
                  onChange={setEditingStory}
                  lang={lang}
                  onOpenMediaPicker={handleOpenMediaPicker}
                />

                {/* Section 03: Key Impact Metrics */}
                <PortfolioMetricsSection
                  story={editingStory}
                  onChange={setEditingStory}
                  lang={lang}
                />

                {/* Section 04: Narrative - Overview */}
                <PortfolioNarrativeSection
                  id="sec-intro"
                  stepNumber="04"
                  sectionTitleEn="Section 1: Project Overview"
                  sectionTitleAr="القسم الأول: نظرة عامة وسياق المشروع"
                  descriptionEn="Initial agency context, client background, and strategic alignment."
                  descriptionAr="سياق التدخل الاستشاري، خلفية العميل، ومواءمة الأهداف الاستراتيجية."
                  sectionData={editingStory.intro}
                  onChange={(updated) =>
                    setEditingStory({ ...editingStory, intro: updated })
                  }
                  lang={lang}
                />

                {/* Section 05: Narrative - Problem */}
                <PortfolioNarrativeSection
                  id="sec-problem"
                  stepNumber="05"
                  sectionTitleEn="Section 2: The Challenge"
                  sectionTitleAr="القسم الثاني: التحدي والمشكلة الاستراتيجية"
                  descriptionEn="Core business bottlenecks, technical debt, or market obstacles faced."
                  descriptionAr="العقبات الرئيسية، القيود التقنية السابقة، والتحديات التسويقية المعقدة."
                  sectionData={editingStory.problem}
                  onChange={(updated) =>
                    setEditingStory({ ...editingStory, problem: updated })
                  }
                  lang={lang}
                />

                {/* Section 06: Narrative - Solution */}
                <PortfolioNarrativeSection
                  id="sec-solution"
                  stepNumber="06"
                  sectionTitleEn="Section 3: The Engineered Solution"
                  sectionTitleAr="القسم الثالث: الحل المعماري والتنفيذ"
                  descriptionEn="Strategic architecture, software engineering, or campaigns delivered by Persici."
                  descriptionAr="الهندسة المعمارية المطورة، البرمجيات المتقدمة، أو الحملات الإبداعية المنفذة."
                  sectionData={editingStory.solution}
                  onChange={(updated) =>
                    setEditingStory({ ...editingStory, solution: updated })
                  }
                  lang={lang}
                />

                {/* Section 07: Narrative - Impact */}
                <PortfolioNarrativeSection
                  id="sec-impact"
                  stepNumber="07"
                  sectionTitleEn="Section 4: The Measurable Impact"
                  sectionTitleAr="القسم الرابع: الأثر والنتائج وعائد الاستثمار"
                  descriptionEn="Quantifiable growth, customer feedback, and long-term business value generated."
                  descriptionAr="العائد الملموس على الاستثمار، نمو المبيعات، والأثر المستدام على أعمال العميل."
                  sectionData={editingStory.impact}
                  onChange={(updated) =>
                    setEditingStory({ ...editingStory, impact: updated })
                  }
                  lang={lang}
                />

                {/* Section 08: Media Showcase & Deliverables */}
                <PortfolioMediaShowcaseSection
                  story={editingStory}
                  onChange={setEditingStory}
                  lang={lang}
                  onOpenMediaPicker={handleOpenMediaPicker}
                />

                {/* Section 09: Related Stories & Final Publish Bar */}
                <div id="sec-publish" className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="border-b border-slate-200 pb-2">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-persici-crimson/10 text-persici-crimson text-xs font-mono font-bold flex items-center justify-center">
                        09
                      </span>
                      <span>{isRtl ? 'المشاريع ذات الصلة وإتمام النشر' : 'Related Stories & Publishing'}</span>
                    </h4>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isRtl ? 'معرفات المشاريع ذات الصلة (Slugs مفصولة بفواصل)' : 'Related Story Slugs (comma separated)'}
                    </label>
                    <input
                      type="text"
                      value={(editingStory.relatedSlugs || []).join(', ')}
                      onChange={(e) =>
                        setEditingStory({
                          ...editingStory,
                          relatedSlugs: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="e.g. khazan-crafting-alz-al-lahzat, hala-food-mobile-app"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 outline-none"
                    />
                  </div>

                  <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h5 className="text-sm font-bold">
                        {isRtl ? 'جاهز لنشر دراسة الحالة؟' : 'Ready to Publish Changes?'}
                      </h5>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isRtl
                          ? 'يتم تحديث الموقع فوراً وإعادة بناء التخزين المؤقت (ISR) لكافة اللغات.'
                          : 'Saves directly to MongoDB Atlas and triggers on-demand multi-locale ISR cache revalidation.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingStory(null)}
                        className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                      >
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="px-6 py-2.5 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-persici-crimson/30 cursor-pointer disabled:opacity-50"
                      >
                        {saving ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') : (isRtl ? 'تأكيد الحفظ والنشر' : 'Confirm & Publish')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={mediaPickerOpen}
          allowedType={mediaPickerType}
          onClose={() => {
            setMediaPickerOpen(false);
            setMediaPickerCallback(null);
          }}
          onSelect={handleMediaPickerSelect}
          defaultFolder="projects"
        />
      )}
    </div>
  );
}
