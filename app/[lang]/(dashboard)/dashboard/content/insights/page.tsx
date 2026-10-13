'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  TbArticle,
  TbPlus,
  TbTrash,
  TbEdit,
  TbRefresh,
  TbDeviceFloppy,
  TbX,
  TbSparkles,
  TbPhoto,
  TbExternalLink,
  TbClock,
  TbTag,
  TbEye,
  TbEyeOff,
  TbStar,
  TbStarFilled,
  TbArrowUp,
  TbArrowDown,
  TbLayoutDistributeHorizontal,
  TbListCheck,
  TbUser,
  TbAdjustmentsHorizontal,
  TbSearch,
  TbCheck,
  TbCategory,
} from 'react-icons/tb';
import { RichTextEditor, MediaPickerModal } from '@dashboard-shared/components';
import type {
  InsightDetail,
  InsightSection,
  InsightTocItem,
  InsightSectionVisibility,
  InsightsHubCategoryFilter,
} from '../../../../(site)/insights/_insights/types';
import {
  DEFAULT_INSIGHT_SECTION_VISIBILITY,
  insightsHubPageData,
} from '../../../../(site)/insights/_insights/data/insights.data';

type EditorTab = 'basics' | 'author' | 'sections' | 'ai' | 'visibility';

interface VisibilityControlMeta {
  key: keyof InsightSectionVisibility;
  label: string;
  description: string;
  group: 'header' | 'rail' | 'body';
}

const VISIBILITY_CONTROLS: VisibilityControlMeta[] = [
  {
    key: 'showBreadcrumbs',
    label: 'Breadcrumb Navigation Trail',
    description: 'Home > Insights > Article breadcrumb bar at top of detail header',
    group: 'header',
  },
  {
    key: 'showCategoryBadge',
    label: 'Category Pill Badge',
    description: 'Crimson category pill (e.g. Article, Research) above the headline',
    group: 'header',
  },
  {
    key: 'showSubtitle',
    label: 'Hero Subtitle / Lead Paragraph',
    description: 'Introductory lead subtitle underneath the main article title',
    group: 'header',
  },
  {
    key: 'showDate',
    label: 'Publication Date',
    description: 'Formatted publication date in the header metadata bar',
    group: 'header',
  },
  {
    key: 'showReadTime',
    label: 'Read Time Indicator',
    description: 'Estimated reading time badge (e.g. 5 min read)',
    group: 'header',
  },
  {
    key: 'showShareMenu',
    label: 'Social Share & Copy Link Button',
    description: 'Interactive Share dropdown (Copy Link, LinkedIn, X)',
    group: 'header',
  },
  {
    key: 'showAuthorCard',
    label: 'Author Attribution Block',
    description: 'Author card in the left sticky rail and mobile header bar',
    group: 'rail',
  },
  {
    key: 'showAuthorAvatar',
    label: 'Author Avatar Portrait',
    description: 'Circular author photo inside the attribution block',
    group: 'rail',
  },
  {
    key: 'showAuthorRole',
    label: 'Author Role / Job Title',
    description: 'Bilingual role title underneath the author name',
    group: 'rail',
  },
  {
    key: 'showTableOfContents',
    label: 'Sticky Table of Contents ("In this article")',
    description: 'Scroll-spy section navigation rail on desktop',
    group: 'rail',
  },
  {
    key: 'showAiOverview',
    label: 'Interactive AI Overview Generator Card',
    description: 'Collapsible Gemini AI synthesis & key takeaways box above body sections',
    group: 'body',
  },
  {
    key: 'showCallouts',
    label: 'Section Callout / Pull-Quote Boxes',
    description: 'Highlighted crimson-border executive callout boxes inside sections',
    group: 'body',
  },
  {
    key: 'showBulletLists',
    label: 'Section Structured Bullet Lists',
    description: 'Crimson-dot key takeaway lists inside individual body sections',
    group: 'body',
  },
  {
    key: 'showFeedbackWidget',
    label: '"Was this article helpful?" Feedback Bar',
    description: 'Interactive thumbs-up / thumbs-down reader feedback widget at article footer',
    group: 'body',
  },
  {
    key: 'showContactSection',
    label: 'Bottom Lead-Gen Contact Section',
    description: 'Shared Persici consultation & contact section at the bottom of the article',
    group: 'body',
  },
];

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function InsightsManagerPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';

  const [insights, setInsights] = useState<InsightDetail[]>([]);
  const [hubCategories, setHubCategories] = useState<InsightsHubCategoryFilter[]>(
    insightsHubPageData.exploreSection.categories
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'drafts' | 'featured'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editor modal state
  const [editingInsight, setEditingInsight] = useState<InsightDetail | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>('basics');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [applyingCategoryVisibility, setApplyingCategoryVisibility] = useState(false);

  // Category manager modal state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [savingCategories, setSavingCategories] = useState(false);

  // Media picker callback state
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  }>({
    isOpen: false,
    onSelect: () => {},
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPickerConfig({ isOpen: true, onSelect });
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [insightsRes, hubRes] = await Promise.all([
        fetch('/api/insights?includeInactive=true', { cache: 'no-store' }),
        fetch('/api/content/insights', { cache: 'no-store' }),
      ]);

      if (insightsRes.ok) {
        const data = await insightsRes.json();
        if (Array.isArray(data.articles)) {
          setInsights(data.articles);
        }
      }

      if (hubRes.ok) {
        const hubJson = await hubRes.json();
        const cats = hubJson?.content?.exploreSection?.categories;
        if (Array.isArray(cats) && cats.length > 0) {
          setHubCategories(cats);
        }
      }
    } catch (err) {
      console.error('Failed to load insights data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchAllData();
    });
  }, [fetchAllData]);

  // Build unified list of available categories (excluding 'all')
  const availableCategories = React.useMemo(() => {
    const map = new Map<string, { slug: string; label: { en: string; ar: string } }>();
    map.set('article', { slug: 'article', label: { en: 'Article', ar: 'مقال' } });
    map.set('research', { slug: 'research', label: { en: 'Research', ar: 'بحث' } });

    for (const c of hubCategories) {
      if (c.slug && c.slug !== 'all') {
        map.set(c.slug, {
          slug: c.slug,
          label: {
            en: c.label?.en || c.slug,
            ar: c.label?.ar || c.label?.en || c.slug,
          },
        });
      }
    }

    for (const item of insights) {
      if (item.categorySlug && item.categorySlug !== 'all' && !map.has(item.categorySlug)) {
        map.set(item.categorySlug, {
          slug: item.categorySlug,
          label: {
            en: item.category?.en || item.categorySlug,
            ar: item.category?.ar || item.category?.en || item.categorySlug,
          },
        });
      }
    }

    return Array.from(map.values());
  }, [hubCategories, insights]);

  const openEditor = (insight: InsightDetail, tab: EditorTab = 'basics') => {
    setIsCreating(false);
    setActiveTab(tab);
    setEditingInsight({
      ...insight,
      originalSlug: insight.slug,
      isActive: insight.isActive !== false,
      featured: Boolean(insight.featured),
      subtitle: {
        en: insight.subtitle?.en || insight.excerpt?.en || '',
        ar: insight.subtitle?.ar || insight.excerpt?.ar || '',
      },
      excerpt: {
        en: insight.excerpt?.en || insight.subtitle?.en || '',
        ar: insight.excerpt?.ar || insight.subtitle?.ar || '',
      },
      author: {
        name: insight.author?.name || 'Persici Editorial Team',
        role: {
          en: insight.author?.role?.en || 'Thought Leadership',
          ar: insight.author?.role?.ar || 'القيادة الفكرية',
        },
        avatar:
          insight.author?.avatar &&
          insight.author.avatar !== '/images/insights/author-1.webp'
            ? insight.author.avatar
            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      },
      tableOfContents: Array.isArray(insight.tableOfContents) ? insight.tableOfContents : [],
      sections: Array.isArray(insight.sections) ? insight.sections : [],
      aiOverview: {
        summary: {
          en: insight.aiOverview?.summary?.en || '',
          ar: insight.aiOverview?.summary?.ar || '',
        },
        keyTakeaways: Array.isArray(insight.aiOverview?.keyTakeaways)
          ? insight.aiOverview.keyTakeaways
          : [],
      },
      sectionVisibility: {
        ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
        ...(insight.sectionVisibility || {}),
      },
    });
  };

  const openNewInsight = () => {
    const defaultSecId = 'executive-context';
    setIsCreating(true);
    setActiveTab('basics');
    setEditingInsight({
      id: '',
      slug: `strategic-insight-${Date.now().toString().slice(-5)}`,
      categorySlug: 'article',
      category: { en: 'Article', ar: 'مقال' },
      title: {
        en: 'New Strategic Insight',
        ar: 'رؤية استراتيجية جديدة',
      },
      subtitle: {
        en: 'A practical executive guide to architecting resilient digital products and autonomous workflows.',
        ar: 'دليل تنفيذي عملي لهندسة المنتجات الرقمية المرنة وسير العمل الذكي.',
      },
      excerpt: {
        en: 'A practical executive guide to architecting resilient digital products and autonomous workflows.',
        ar: 'دليل تنفيذي عملي لهندسة المنتجات الرقمية المرنة وسير العمل الذكي.',
      },
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: '5 min read',
      coverImage: '/images/insights/data-into-value-office.jpg',
      featured: false,
      isActive: true,
      author: {
        name: 'Persici Editorial Team',
        role: { en: 'Strategic Intelligence', ar: 'الذكاء الاستراتيجي' },
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      },
      tableOfContents: [
        {
          id: defaultSecId,
          title: { en: 'Executive Context', ar: 'السياق التنفيذي' },
        },
      ],
      sections: [
        {
          id: defaultSecId,
          heading: { en: 'Executive Context', ar: 'السياق التنفيذي' },
          paragraphs: {
            en: [
              'Enter the opening narrative paragraph of your insight here. You can format text, align paragraphs, or add callouts and bullet lists below.',
            ],
            ar: [
              'أدخل الفقرة الافتتاحية للمقال هنا. يمكنك تنسيق النصوص ومحاذاة الفقرات أو إضافة الاقتباسات والنقاط الرئيسية أدناه.',
            ],
          },
        },
      ],
      aiOverview: {
        summary: { en: '', ar: '' },
        keyTakeaways: [],
      },
      sectionVisibility: { ...DEFAULT_INSIGHT_SECTION_VISIBILITY },
    });
  };

  const handleSaveInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInsight) return;

    setSaving(true);
    try {
      const method = isCreating ? 'POST' : 'PUT';
      const res = await fetch('/api/insights', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingInsight),
      });

      if (res.ok) {
        showToast(
          isCreating
            ? 'New insight created & published to database!'
            : 'Insight changes saved & live site revalidated!'
        );
        setEditingInsight(null);
        setIsCreating(false);
        await fetchAllData();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to save insight');
      }
    } catch (err) {
      console.error('Error saving insight:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickUpdate = async (updated: InsightDetail, successMsg: string) => {
    try {
      const res = await fetch('/api/insights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updated,
          originalSlug: updated.slug,
        }),
      });
      if (res.ok) {
        setInsights((prev) =>
          prev.map((item) => (item.slug === updated.slug ? updated : item))
        );
        showToast(successMsg);
      }
    } catch (err) {
      console.error('Quick update failed:', err);
    }
  };

  const handleDelete = async (insight: InsightDetail) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete "${insight.title.en}"? If you only want to hide it from the public site, switch it to Draft instead.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `/api/insights?slug=${encodeURIComponent(insight.slug)}&id=${encodeURIComponent(
          insight.id || insight.slug
        )}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setInsights((prev) => prev.filter((a) => a.slug !== insight.slug));
        showToast('Insight deleted.');
      }
    } catch (err) {
      console.error('Failed to delete insight:', err);
    }
  };

  const handleSyncTocFromSections = () => {
    if (!editingInsight) return;
    const syncedToc: InsightTocItem[] = (editingInsight.sections || []).map((sec, idx) => ({
      id: sec.id || `section-${idx + 1}`,
      title: {
        en: sec.heading?.en || `Section ${idx + 1}`,
        ar: sec.heading?.ar || `القسم ${idx + 1}`,
      },
    }));
    setEditingInsight({
      ...editingInsight,
      tableOfContents: syncedToc,
    });
    showToast('Table of Contents synchronized with section headings!');
  };

  const handleGenerateAiOverview = async () => {
    if (!editingInsight) return;
    setGeneratingAi(true);
    try {
      const compiledEn = [
        editingInsight.subtitle?.en || '',
        editingInsight.excerpt?.en || '',
        ...(editingInsight.sections || []).map(
          (s) =>
            `## ${s.heading?.en || ''}\n${(s.paragraphs?.en || [])
              .map(stripHtmlTags)
              .join('\n')}`
        ),
      ]
        .filter(Boolean)
        .join('\n\n');

      const compiledAr = [
        editingInsight.subtitle?.ar || '',
        editingInsight.excerpt?.ar || '',
        ...(editingInsight.sections || []).map(
          (s) =>
            `## ${s.heading?.ar || ''}\n${(s.paragraphs?.ar || [])
              .map(stripHtmlTags)
              .join('\n')}`
        ),
      ]
        .filter(Boolean)
        .join('\n\n');

      const [resEn, resAr] = await Promise.all([
        fetch('/api/insights/ai-overview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editingInsight.title.en,
            content: compiledEn || editingInsight.title.en,
            lang: 'en',
          }),
        }),
        fetch('/api/insights/ai-overview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editingInsight.title.ar || editingInsight.title.en,
            content: compiledAr || compiledEn || editingInsight.title.en,
            lang: 'ar',
          }),
        }),
      ]);

      const dataEn = await resEn.json().catch(() => ({}));
      const dataAr = await resAr.json().catch(() => ({}));

      const takeawaysEn: string[] = Array.isArray(dataEn.keyTakeaways) ? dataEn.keyTakeaways : [];
      const takeawaysAr: string[] = Array.isArray(dataAr.keyTakeaways) ? dataAr.keyTakeaways : [];
      const maxLen = Math.max(takeawaysEn.length, takeawaysAr.length);

      const mergedTakeaways = Array.from({ length: maxLen }, (_, i) => ({
        en: takeawaysEn[i] || takeawaysAr[i] || '',
        ar: takeawaysAr[i] || takeawaysEn[i] || '',
      }));

      setEditingInsight((prev) =>
        prev
          ? {
              ...prev,
              aiOverview: {
                summary: {
                  en: dataEn.summary || prev.aiOverview?.summary?.en || '',
                  ar: dataAr.summary || prev.aiOverview?.summary?.ar || '',
                },
                keyTakeaways:
                  mergedTakeaways.length > 0
                    ? mergedTakeaways
                    : prev.aiOverview?.keyTakeaways || [],
              },
            }
          : null
      );
      showToast('Bilingual AI Overview & Takeaways synthesized!');
    } catch (err) {
      console.error('Failed to generate AI overview:', err);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleApplyVisibilityToCategory = async (targetCategorySlug: string) => {
    if (!editingInsight?.sectionVisibility) return;
    setApplyingCategoryVisibility(true);
    try {
      const matching = insights.filter((item) =>
        targetCategorySlug === 'all' ? true : item.categorySlug === targetCategorySlug
      );

      await Promise.all(
        matching.map((item) =>
          fetch('/api/insights', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...item,
              originalSlug: item.slug,
              sectionVisibility: editingInsight.sectionVisibility,
            }),
          })
        )
      );

      await fetchAllData();
      showToast(
        targetCategorySlug === 'all'
          ? `Design On/Off settings applied to all ${matching.length} insights!`
          : `Design On/Off settings applied to all ${matching.length} "${targetCategorySlug}" insights!`
      );
    } catch (err) {
      console.error('Failed to apply category visibility:', err);
    } finally {
      setApplyingCategoryVisibility(false);
    }
  };

  const handleSaveHubCategories = async () => {
    setSavingCategories(true);
    try {
      const getRes = await fetch('/api/content/insights', { cache: 'no-store' });
      const currentDoc = await getRes.json().catch(() => ({}));
      const existingContent = currentDoc?.content || insightsHubPageData;

      const updatedContent = {
        ...existingContent,
        exploreSection: {
          ...(existingContent.exploreSection || insightsHubPageData.exploreSection),
          categories: hubCategories,
        },
      };

      const saveRes = await fetch('/api/content/insights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedContent, page: 'insights' }),
      });

      if (saveRes.ok) {
        showToast('Insights Hub filter categories updated & saved!');
        setCategoryModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to save hub categories:', err);
    } finally {
      setSavingCategories(false);
    }
  };

  // Filtered insights
  const filteredInsights = insights.filter((item) => {
    const isPub = item.isActive !== false;
    if (statusFilter === 'published' && !isPub) return false;
    if (statusFilter === 'drafts' && isPub) return false;
    if (statusFilter === 'featured' && !item.featured) return false;

    if (categoryFilter !== 'all' && item.categorySlug !== categoryFilter) {
      return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitleEn = item.title?.en?.toLowerCase().includes(q);
      const matchTitleAr = item.title?.ar?.toLowerCase().includes(q);
      const matchSlug = item.slug?.toLowerCase().includes(q);
      const matchAuthor = item.author?.name?.toLowerCase().includes(q);
      return matchTitleEn || matchTitleAr || matchSlug || matchAuthor;
    }

    return true;
  });

  const totalCount = insights.length;
  const publishedCount = insights.filter((i) => i.isActive !== false).length;
  const draftCount = insights.filter((i) => i.isActive === false).length;
  const featuredCount = insights.filter((i) => Boolean(i.featured)).length;

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[80] flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <TbCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-persici-crimson mb-1">
            <TbArticle className="w-4 h-4" />
            <span>Blogs &amp; Insights Content Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Published Insights, Blogs &amp; Detail Page Design Controls
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Create, edit, publish, or draft insights and blogs. Manage categories, full multi-section articles, Table of Contents, AI Overviews, and toggle frontend detail page elements ON/OFF per article or category.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setCategoryModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <TbCategory className="w-4 h-4 text-persici-crimson" />
            <span>Categories &amp; Filter Tabs</span>
          </button>

          <Link
            href={`/${lang}/dashboard/pages/insights`}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <TbLayoutDistributeHorizontal className="w-4 h-4" />
            <span>Edit Insights Hub Page</span>
          </Link>

          <button
            type="button"
            onClick={openNewInsight}
            className="flex items-center gap-2 px-4 py-2.5 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm"
          >
            <TbPlus className="w-4 h-4" />
            <span>New Insight / Blog</span>
          </button>

          <button
            type="button"
            onClick={fetchAllData}
            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Refresh insights from database"
          >
            <TbRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Summary Strip + Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Insights ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === 'published'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('drafts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === 'drafts'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Drafts ({draftCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('featured')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === 'featured'
                  ? 'bg-persici-crimson text-white'
                  : 'bg-red-50 text-persici-crimson hover:bg-red-100'
              }`}
            >
              Featured ({featuredCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <TbSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, slug, or author..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Category / Type:
            </span>
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-persici-crimson text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {availableCategories.map((cat) => {
              const count = insights.filter((i) => i.categorySlug === cat.slug).length;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setCategoryFilter(cat.slug)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    categoryFilter === cat.slug
                      ? 'bg-persici-crimson text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label.en} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 rounded-2xl bg-white border border-slate-200 p-4 animate-pulse flex flex-col justify-between"
            >
              <div className="h-44 rounded-xl bg-slate-100" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-5 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-full" />
              </div>
              <div className="h-9 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredInsights.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <TbArticle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Matching Insights Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try clearing your search filter or click &ldquo;New Insight / Blog&rdquo; to create a new article.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInsights.map((article) => {
            const isPublished = article.isActive !== false;
            const secCount = Array.isArray(article.sections) ? article.sections.length : 0;
            const vis = {
              ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
              ...(article.sectionVisibility || {}),
            };
            const enabledVisCount = Object.values(vis).filter(Boolean).length;

            return (
              <div
                key={article.slug}
                className={`group bg-white rounded-2xl border transition-all flex flex-col overflow-hidden shadow-sm hover:shadow-md ${
                  isPublished ? 'border-slate-200' : 'border-amber-300 bg-amber-50/10'
                }`}
              >
                {/* Cover Image & Quick Status Controls */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  {article.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.coverImage}
                      alt={article.title?.en || ''}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      <TbArticle className="w-10 h-10" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Top Left: Category Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-persici-crimson text-white shadow-sm">
                      {article.category?.en || article.categorySlug || 'Article'}
                    </span>
                    <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm font-arabic">
                      {article.category?.ar || ''}
                    </span>
                  </div>

                  {/* Top Right: 1-Click Published/Draft & Featured Toggles */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickUpdate(
                          { ...article, featured: !article.featured },
                          article.featured
                            ? 'Removed from Featured insights'
                            : 'Marked as Featured insight!'
                        )
                      }
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                        article.featured
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-black/50 text-white/80 hover:text-white'
                      }`}
                      title={article.featured ? 'Featured Insight (Click to unfeature)' : 'Mark as Featured'}
                    >
                      {article.featured ? (
                        <TbStarFilled className="w-3.5 h-3.5" />
                      ) : (
                        <TbStar className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleQuickUpdate(
                          { ...article, isActive: !isPublished },
                          !isPublished
                            ? `"${article.title.en}" is now Published!`
                            : `"${article.title.en}" moved to Drafts.`
                        )
                      }
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md transition-colors ${
                        isPublished
                          ? 'bg-emerald-500/95 text-white hover:bg-emerald-600'
                          : 'bg-amber-500/95 text-white hover:bg-amber-600'
                      }`}
                      title="Click to toggle Published / Draft status"
                    >
                      {isPublished ? (
                        <>
                          <TbEye className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <TbEyeOff className="w-3.5 h-3.5" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bottom Meta inside Cover */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          article.author?.avatar &&
                          article.author.avatar !== '/images/insights/author-1.webp'
                            ? article.author.avatar
                            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
                        }
                        alt={article.author?.name || ''}
                        className="w-5 h-5 rounded-full object-cover border border-white/40"
                      />
                      <span className="font-semibold truncate max-w-[140px]">
                        {article.author?.name || 'Persici Editorial'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <TbClock className="w-3 h-3" />
                        {article.readTime || '5 min read'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {article.title?.en}
                    </h3>
                    <p
                      dir="rtl"
                      className="text-xs font-semibold text-slate-600 font-arabic line-clamp-1"
                    >
                      {article.title?.ar}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {stripHtmlTags(article.subtitle?.en || article.excerpt?.en || '')}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    {/* Diagnostics pills */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-mono truncate max-w-[150px]" title={article.slug}>
                        /{article.slug}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {secCount} Sections
                        </span>
                        <span
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold"
                          title="Active detail page UI components"
                        >
                          {enabledVisCount}/15 UI On
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-12 gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditor(article, 'basics')}
                        className="col-span-5 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                      >
                        <TbEdit className="w-3.5 h-3.5" />
                        <span>Edit Content</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditor(article, 'visibility')}
                        className="col-span-4 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                        title="Toggle Frontend Detail Page Design Elements On/Off"
                      >
                        <TbAdjustmentsHorizontal className="w-3.5 h-3.5 text-persici-crimson" />
                        <span>Design On/Off</span>
                      </button>

                      <a
                        href={`/${lang}/insights/${article.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="col-span-2 flex items-center justify-center py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="View Live Detail Page"
                      >
                        <TbExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDelete(article)}
                        className="col-span-1 flex items-center justify-center py-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete Insight"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* FULL 5-TAB INSIGHT CONTENT & DESIGN EDITOR MODAL                    */}
      {/* =================================================================== */}
      {editingInsight && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-persici-crimson text-white">
                    {isCreating ? 'New Insight / Blog' : editingInsight.category?.en || 'Insight'}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    /{editingInsight.slug}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
                  {editingInsight.title?.en || 'Untitled Insight'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {/* Quick Published / Draft Switch in Modal Header */}
                <button
                  type="button"
                  onClick={() =>
                    setEditingInsight({
                      ...editingInsight,
                      isActive: editingInsight.isActive === false ? true : false,
                    })
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    editingInsight.isActive !== false
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {editingInsight.isActive !== false ? (
                    <>
                      <TbEye className="w-4 h-4" />
                      <span>Published (Live)</span>
                    </>
                  ) : (
                    <>
                      <TbEyeOff className="w-4 h-4" />
                      <span>Draft (Hidden)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setEditingInsight(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60"
                >
                  <TbX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 5-Tab Navigation Bar */}
            <div className="flex flex-wrap items-center gap-1 px-6 py-2.5 bg-white border-b border-slate-200">
              {[
                { id: 'basics', label: '1. Overview, Category & Status', icon: TbTag },
                { id: 'author', label: '2. Author & Excerpt', icon: TbUser },
                {
                  id: 'sections',
                  label: `3. Content Sections & TOC (${editingInsight.sections?.length || 0})`,
                  icon: TbListCheck,
                },
                { id: 'ai', label: '4. AI Overview & Takeaways', icon: TbSparkles },
                { id: 'visibility', label: '5. Frontend Design On/Off', icon: TbAdjustmentsHorizontal },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as EditorTab)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                      active
                        ? 'bg-persici-crimson text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveInsight} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* =============================================================== */}
              {/* TAB 1: BASICS, CATEGORY, SLUG, TITLE, SUBTITLE, COVER IMAGE     */}
              {/* =============================================================== */}
              {activeTab === 'basics' && (
                <div className="space-y-5">
                  {/* Status, Featured & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        required
                        value={editingInsight.slug}
                        onChange={(e) =>
                          setEditingInsight({ ...editingInsight, slug: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Publication Date
                      </label>
                      <input
                        type="text"
                        value={editingInsight.date || ''}
                        onChange={(e) =>
                          setEditingInsight({ ...editingInsight, date: e.target.value })
                        }
                        placeholder="Oct 16, 2025"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={editingInsight.readTime || ''}
                        onChange={(e) =>
                          setEditingInsight({ ...editingInsight, readTime: e.target.value })
                        }
                        placeholder="5 min read"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Category / Insight Type Selection & Custom Category Builder */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Insight Category / Type
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Select an existing category or type a custom category slug &amp; bilingual label below.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {availableCategories.map((cat) => (
                          <button
                            key={cat.slug}
                            type="button"
                            onClick={() =>
                              setEditingInsight({
                                ...editingInsight,
                                categorySlug: cat.slug,
                                category: { en: cat.label.en, ar: cat.label.ar },
                              })
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              editingInsight.categorySlug === cat.slug
                                ? 'bg-persici-crimson text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {cat.label.en} ({cat.slug})
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Category Slug (Filter Key)
                        </label>
                        <input
                          type="text"
                          value={editingInsight.categorySlug || ''}
                          onChange={(e) =>
                            setEditingInsight({
                              ...editingInsight,
                              categorySlug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                            })
                          }
                          placeholder="article, research, case-study..."
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Category Display Label (EN)
                        </label>
                        <input
                          type="text"
                          value={editingInsight.category?.en || ''}
                          onChange={(e) =>
                            setEditingInsight({
                              ...editingInsight,
                              category: {
                                ...(editingInsight.category || { en: '', ar: '' }),
                                en: e.target.value,
                              },
                            })
                          }
                          placeholder="Article / Research"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          اسم التصنيف (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={editingInsight.category?.ar || ''}
                          onChange={(e) =>
                            setEditingInsight({
                              ...editingInsight,
                              category: {
                                ...(editingInsight.category || { en: '', ar: '' }),
                                ar: e.target.value,
                              },
                            })
                          }
                          placeholder="مقال / بحث"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Main Title EN & AR */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Article Headline (English)
                      </label>
                      <input
                        type="text"
                        required
                        value={editingInsight.title?.en || ''}
                        onChange={(e) =>
                          setEditingInsight({
                            ...editingInsight,
                            title: { ...editingInsight.title, en: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        عنوان المقال (العربية)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        required
                        value={editingInsight.title?.ar || ''}
                        onChange={(e) =>
                          setEditingInsight({
                            ...editingInsight,
                            title: { ...editingInsight.title, ar: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-arabic font-bold"
                      />
                    </div>
                  </div>

                  {/* Hero Subtitle RichTextEditor */}
                  <RichTextEditor
                    label="Article Hero Subtitle / Lead Paragraph (Supports Alignment & Rich Text)"
                    valueEn={editingInsight.subtitle?.en || ''}
                    valueAr={editingInsight.subtitle?.ar || ''}
                    onChangeEn={(val) =>
                      setEditingInsight((prev) =>
                        prev
                          ? {
                              ...prev,
                              subtitle: { ...(prev.subtitle || { en: '', ar: '' }), en: val },
                            }
                          : null
                      )
                    }
                    onChangeAr={(val) =>
                      setEditingInsight((prev) =>
                        prev
                          ? {
                              ...prev,
                              subtitle: { ...(prev.subtitle || { en: '', ar: '' }), ar: val },
                            }
                          : null
                      )
                    }
                  />

                  {/* Cover Image with R2 Media Picker */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Cover Image (Shown on Insights Hub Cards)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={editingInsight.coverImage || ''}
                        onChange={(e) =>
                          setEditingInsight({ ...editingInsight, coverImage: e.target.value })
                        }
                        className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker((url) =>
                            setEditingInsight((prev) =>
                              prev ? { ...prev, coverImage: url } : null
                            )
                          )
                        }
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0"
                      >
                        <TbPhoto className="w-4 h-4" />
                        <span>Select R2 Image</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* TAB 2: AUTHOR PROFILE & CARD EXCERPT                            */}
              {/* =============================================================== */}
              {activeTab === 'author' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Author Attribution Details
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Author Full Name
                        </label>
                        <input
                          type="text"
                          value={editingInsight.author?.name || ''}
                          onChange={(e) =>
                            setEditingInsight({
                              ...editingInsight,
                              author: {
                                ...(editingInsight.author || {
                                  name: '',
                                  role: { en: '', ar: '' },
                                  avatar: '',
                                }),
                                name: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Author Role / Title (EN)
                        </label>
                        <input
                          type="text"
                          value={editingInsight.author?.role?.en || ''}
                          onChange={(e) =>
                            setEditingInsight({
                              ...editingInsight,
                              author: {
                                ...(editingInsight.author || {
                                  name: '',
                                  role: { en: '', ar: '' },
                                  avatar: '',
                                }),
                                role: {
                                  ...(editingInsight.author?.role || { en: '', ar: '' }),
                                  en: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          المسمى الوظيفي للكاتب (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={editingInsight.author?.role?.ar || ''}
                          onChange={(e) =>
                            setEditingInsight({
                              ...editingInsight,
                              author: {
                                ...(editingInsight.author || {
                                  name: '',
                                  role: { en: '', ar: '' },
                                  avatar: '',
                                }),
                                role: {
                                  ...(editingInsight.author?.role || { en: '', ar: '' }),
                                  ar: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-arabic"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Author Avatar Image URL
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={editingInsight.author?.avatar || ''}
                          onChange={(e) =>
                            setEditingInsight({
                              ...editingInsight,
                              author: {
                                ...(editingInsight.author || {
                                  name: '',
                                  role: { en: '', ar: '' },
                                  avatar: '',
                                }),
                                avatar: e.target.value,
                              },
                            })
                          }
                          className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            openMediaPicker((url) =>
                              setEditingInsight((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      author: { ...prev.author, avatar: url },
                                    }
                                  : null
                              )
                            )
                          }
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0"
                        >
                          <TbPhoto className="w-4 h-4" />
                          <span>Select Avatar</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Excerpt RichTextEditor */}
                  <RichTextEditor
                    label="Insights Hub Card Excerpt / Summary (Shown on Grid Cards & Meta Description)"
                    valueEn={editingInsight.excerpt?.en || ''}
                    valueAr={editingInsight.excerpt?.ar || ''}
                    onChangeEn={(val) =>
                      setEditingInsight((prev) =>
                        prev
                          ? {
                              ...prev,
                              excerpt: { ...(prev.excerpt || { en: '', ar: '' }), en: val },
                            }
                          : null
                      )
                    }
                    onChangeAr={(val) =>
                      setEditingInsight((prev) =>
                        prev
                          ? {
                              ...prev,
                              excerpt: { ...(prev.excerpt || { en: '', ar: '' }), ar: val },
                            }
                          : null
                      )
                    }
                  />
                </div>
              )}

              {/* =============================================================== */}
              {/* TAB 3: FULL ARTICLE SECTIONS & TABLE OF CONTENTS BUILDER        */}
              {/* =============================================================== */}
              {activeTab === 'sections' && (
                <div className="space-y-6">
                  {/* Table of Contents Editor */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Sticky Rail Table of Contents (&ldquo;In this article&rdquo;)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Each TOC item links to a section anchor ID below. Click &ldquo;Sync TOC from Sections&rdquo; to update automatically.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleSyncTocFromSections}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0"
                      >
                        Sync TOC from Section Headings
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(editingInsight.tableOfContents || []).map((toc, tIdx) => (
                        <div
                          key={tIdx}
                          className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-slate-200"
                        >
                          <div className="md:col-span-3">
                            <input
                              type="text"
                              value={toc.id}
                              onChange={(e) => {
                                const updated = [...(editingInsight.tableOfContents || [])];
                                updated[tIdx] = { ...updated[tIdx], id: e.target.value };
                                setEditingInsight({
                                  ...editingInsight,
                                  tableOfContents: updated,
                                });
                              }}
                              placeholder="section-id"
                              className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded"
                            />
                          </div>
                          <div className="md:col-span-4">
                            <input
                              type="text"
                              value={toc.title?.en || ''}
                              onChange={(e) => {
                                const updated = [...(editingInsight.tableOfContents || [])];
                                updated[tIdx] = {
                                  ...updated[tIdx],
                                  title: { ...(updated[tIdx].title || { en: '', ar: '' }), en: e.target.value },
                                };
                                setEditingInsight({
                                  ...editingInsight,
                                  tableOfContents: updated,
                                });
                              }}
                              placeholder="TOC Label (EN)"
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded"
                            />
                          </div>
                          <div className="md:col-span-4">
                            <input
                              type="text"
                              dir="rtl"
                              value={toc.title?.ar || ''}
                              onChange={(e) => {
                                const updated = [...(editingInsight.tableOfContents || [])];
                                updated[tIdx] = {
                                  ...updated[tIdx],
                                  title: { ...(updated[tIdx].title || { en: '', ar: '' }), ar: e.target.value },
                                };
                                setEditingInsight({
                                  ...editingInsight,
                                  tableOfContents: updated,
                                });
                              }}
                              placeholder="عنوان الفهرس (AR)"
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded font-arabic"
                            />
                          </div>
                          <div className="md:col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (editingInsight.tableOfContents || []).filter(
                                  (_, i) => i !== tIdx
                                );
                                setEditingInsight({
                                  ...editingInsight,
                                  tableOfContents: updated,
                                });
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <TbTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Article Body Sections Repeater */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Article Body Sections ({editingInsight.sections?.length || 0})
                        </h4>
                        <p className="text-xs text-slate-500">
                          Edit the real headings, paragraphs, callout quotes, and bullet lists for each section of this insight.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextNum = (editingInsight.sections?.length || 0) + 1;
                          const newSec: InsightSection = {
                            id: `section-${nextNum}`,
                            heading: {
                              en: `Section ${nextNum} Heading`,
                              ar: `عنوان القسم ${nextNum}`,
                            },
                            paragraphs: {
                              en: ['Write section paragraph here...'],
                              ar: ['اكتب فقرة القسم هنا...'],
                            },
                          };
                          setEditingInsight({
                            ...editingInsight,
                            sections: [...(editingInsight.sections || []), newSec],
                            tableOfContents: [
                              ...(editingInsight.tableOfContents || []),
                              { id: newSec.id, title: newSec.heading },
                            ],
                          });
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-persici-crimson text-white text-xs font-semibold hover:bg-red-700"
                      >
                        <TbPlus className="w-4 h-4" />
                        <span>Add Article Section</span>
                      </button>
                    </div>

                    {(editingInsight.sections || []).map((sec, sIdx) => {
                      const maxParagraphs = Math.max(
                        sec.paragraphs?.en?.length || 0,
                        sec.paragraphs?.ar?.length || 0,
                        1
                      );
                      const maxBullets = Math.max(
                        sec.list?.en?.length || 0,
                        sec.list?.ar?.length || 0
                      );

                      const updateSection = (patch: Partial<InsightSection>) => {
                        const updated = [...(editingInsight.sections || [])];
                        updated[sIdx] = { ...updated[sIdx], ...patch };
                        setEditingInsight({ ...editingInsight, sections: updated });
                      };

                      return (
                        <div
                          key={sIdx}
                          className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                        >
                          {/* Section Header Toolbar */}
                          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                                {sIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-900">
                                {sec.heading?.en || `Section ${sIdx + 1}`}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                #{sec.id}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={sIdx === 0}
                                onClick={() => {
                                  const arr = [...(editingInsight.sections || [])];
                                  const temp = arr[sIdx - 1];
                                  arr[sIdx - 1] = arr[sIdx];
                                  arr[sIdx] = temp;
                                  setEditingInsight({ ...editingInsight, sections: arr });
                                }}
                                className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg disabled:opacity-30"
                                title="Move Section Up"
                              >
                                <TbArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={sIdx === (editingInsight.sections?.length || 1) - 1}
                                onClick={() => {
                                  const arr = [...(editingInsight.sections || [])];
                                  const temp = arr[sIdx + 1];
                                  arr[sIdx + 1] = arr[sIdx];
                                  arr[sIdx] = temp;
                                  setEditingInsight({ ...editingInsight, sections: arr });
                                }}
                                className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg disabled:opacity-30"
                                title="Move Section Down"
                              >
                                <TbArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (editingInsight.sections || []).filter(
                                    (_, i) => i !== sIdx
                                  );
                                  setEditingInsight({ ...editingInsight, sections: updated });
                                }}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                title="Delete Section"
                              >
                                <TbTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Section Anchor ID & Headings */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <div className="md:col-span-3">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                Section Anchor ID
                              </label>
                              <input
                                type="text"
                                value={sec.id}
                                onChange={(e) => updateSection({ id: e.target.value })}
                                className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                              />
                            </div>
                            <div className="md:col-span-4">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                Section Heading (EN)
                              </label>
                              <input
                                type="text"
                                value={sec.heading?.en || ''}
                                onChange={(e) =>
                                  updateSection({
                                    heading: { ...(sec.heading || { en: '', ar: '' }), en: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                              />
                            </div>
                            <div className="md:col-span-5">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                عنوان القسم (AR)
                              </label>
                              <input
                                type="text"
                                dir="rtl"
                                value={sec.heading?.ar || ''}
                                onChange={(e) =>
                                  updateSection({
                                    heading: { ...(sec.heading || { en: '', ar: '' }), ar: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg font-arabic"
                              />
                            </div>
                          </div>

                          {/* Rich Text Paragraphs inside Section */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-slate-700 uppercase">
                                Section Paragraphs ({maxParagraphs})
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const enArr = [...(sec.paragraphs?.en || [])];
                                  const arArr = [...(sec.paragraphs?.ar || [])];
                                  enArr.push('');
                                  arArr.push('');
                                  updateSection({
                                    paragraphs: { en: enArr, ar: arArr },
                                  });
                                }}
                                className="text-xs font-semibold text-persici-crimson hover:underline flex items-center gap-1"
                              >
                                <TbPlus className="w-3.5 h-3.5" />
                                <span>Add Paragraph</span>
                              </button>
                            </div>

                            {Array.from({ length: maxParagraphs }).map((_, pIdx) => (
                              <div
                                key={pIdx}
                                className="bg-white p-3 rounded-xl border border-slate-200 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold text-slate-500">
                                    Paragraph #{pIdx + 1}
                                  </span>
                                  {maxParagraphs > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const enArr = (sec.paragraphs?.en || []).filter(
                                          (_, i) => i !== pIdx
                                        );
                                        const arArr = (sec.paragraphs?.ar || []).filter(
                                          (_, i) => i !== pIdx
                                        );
                                        updateSection({
                                          paragraphs: { en: enArr, ar: arArr },
                                        });
                                      }}
                                      className="text-[11px] text-red-500 hover:underline"
                                    >
                                      Remove Paragraph
                                    </button>
                                  )}
                                </div>

                                <RichTextEditor
                                  label={`Paragraph ${pIdx + 1} Content`}
                                  valueEn={sec.paragraphs?.en?.[pIdx] || ''}
                                  valueAr={sec.paragraphs?.ar?.[pIdx] || ''}
                                  onChangeEn={(val) => {
                                    const enArr = [...(sec.paragraphs?.en || [])];
                                    enArr[pIdx] = val;
                                    updateSection({
                                      paragraphs: {
                                        en: enArr,
                                        ar: sec.paragraphs?.ar || [],
                                      },
                                    });
                                  }}
                                  onChangeAr={(val) => {
                                    const arArr = [...(sec.paragraphs?.ar || [])];
                                    arArr[pIdx] = val;
                                    updateSection({
                                      paragraphs: {
                                        en: sec.paragraphs?.en || [],
                                        ar: arArr,
                                      },
                                    });
                                  }}
                                />
                              </div>
                            ))}
                          </div>

                          {/* Optional Section Callout Box */}
                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                            <RichTextEditor
                              label="Optional Highlight Callout / Pull-Quote Box (Leave empty to hide)"
                              valueEn={sec.callout?.en || ''}
                              valueAr={sec.callout?.ar || ''}
                              onChangeEn={(val) =>
                                updateSection({
                                  callout: {
                                    en: val,
                                    ar: sec.callout?.ar || '',
                                  },
                                })
                              }
                              onChangeAr={(val) =>
                                updateSection({
                                  callout: {
                                    en: sec.callout?.en || '',
                                    ar: val,
                                  },
                                })
                              }
                            />
                          </div>

                          {/* Optional Section Bullet List */}
                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-slate-700 uppercase">
                                Optional Section Bullet List ({maxBullets})
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const enList = [...(sec.list?.en || []), ''];
                                  const arList = [...(sec.list?.ar || []), ''];
                                  updateSection({ list: { en: enList, ar: arList } });
                                }}
                                className="text-xs font-semibold text-persici-crimson hover:underline flex items-center gap-1"
                              >
                                <TbPlus className="w-3.5 h-3.5" />
                                <span>Add Bullet Item</span>
                              </button>
                            </div>

                            {Array.from({ length: maxBullets }).map((_, bIdx) => (
                              <div key={bIdx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                                <div className="md:col-span-5">
                                  <input
                                    type="text"
                                    value={sec.list?.en?.[bIdx] || ''}
                                    onChange={(e) => {
                                      const enList = [...(sec.list?.en || [])];
                                      enList[bIdx] = e.target.value;
                                      updateSection({
                                        list: { en: enList, ar: sec.list?.ar || [] },
                                      });
                                    }}
                                    placeholder="Bullet item (EN)"
                                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                                  />
                                </div>
                                <div className="md:col-span-6">
                                  <input
                                    type="text"
                                    dir="rtl"
                                    value={sec.list?.ar?.[bIdx] || ''}
                                    onChange={(e) => {
                                      const arList = [...(sec.list?.ar || [])];
                                      arList[bIdx] = e.target.value;
                                      updateSection({
                                        list: { en: sec.list?.en || [], ar: arList },
                                      });
                                    }}
                                    placeholder="النقطة بالعربية (AR)"
                                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                                  />
                                </div>
                                <div className="md:col-span-1 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const enList = (sec.list?.en || []).filter(
                                        (_, i) => i !== bIdx
                                      );
                                      const arList = (sec.list?.ar || []).filter(
                                        (_, i) => i !== bIdx
                                      );
                                      updateSection({
                                        list:
                                          enList.length > 0 || arList.length > 0
                                            ? { en: enList, ar: arList }
                                            : undefined,
                                      });
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                  >
                                    <TbTrash className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* TAB 4: AI OVERVIEW & KEY TAKEAWAYS                              */}
              {/* =============================================================== */}
              {activeTab === 'ai' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-purple-50 border border-purple-200">
                    <div>
                      <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                        Executive AI Synthesis &amp; Key Takeaways
                      </h4>
                      <p className="text-xs text-purple-800 mt-0.5">
                        Pre-curate the Executive AI Overview shown when readers click &ldquo;Generate AI Overview&rdquo; on the article page, or synthesize it automatically from your sections with Gemini.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={generatingAi}
                      onClick={handleGenerateAiOverview}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-colors shrink-0 disabled:opacity-50"
                    >
                      <TbSparkles className="w-4 h-4" />
                      <span>
                        {generatingAi
                          ? 'Synthesizing Bilingual Overview...'
                          : 'Synthesize with Gemini AI'}
                      </span>
                    </button>
                  </div>

                  <RichTextEditor
                    label="AI Overview Executive Summary (EN / AR)"
                    valueEn={editingInsight.aiOverview?.summary?.en || ''}
                    valueAr={editingInsight.aiOverview?.summary?.ar || ''}
                    onChangeEn={(val) =>
                      setEditingInsight((prev) =>
                        prev
                          ? {
                              ...prev,
                              aiOverview: {
                                summary: {
                                  en: val,
                                  ar: prev.aiOverview?.summary?.ar || '',
                                },
                                keyTakeaways: prev.aiOverview?.keyTakeaways || [],
                              },
                            }
                          : null
                      )
                    }
                    onChangeAr={(val) =>
                      setEditingInsight((prev) =>
                        prev
                          ? {
                              ...prev,
                              aiOverview: {
                                summary: {
                                  en: prev.aiOverview?.summary?.en || '',
                                  ar: val,
                                },
                                keyTakeaways: prev.aiOverview?.keyTakeaways || [],
                              },
                            }
                          : null
                      )
                    }
                  />

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 uppercase">
                        Key Takeaways ({editingInsight.aiOverview?.keyTakeaways?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const current = editingInsight.aiOverview?.keyTakeaways || [];
                          setEditingInsight({
                            ...editingInsight,
                            aiOverview: {
                              summary: editingInsight.aiOverview?.summary || { en: '', ar: '' },
                              keyTakeaways: [...current, { en: '', ar: '' }],
                            },
                          });
                        }}
                        className="flex items-center gap-1 text-xs font-semibold text-persici-crimson hover:underline"
                      >
                        <TbPlus className="w-3.5 h-3.5" />
                        <span>Add Key Takeaway</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(editingInsight.aiOverview?.keyTakeaways || []).map((item, kIdx) => (
                        <div
                          key={kIdx}
                          className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-white p-3 rounded-xl border border-slate-200"
                        >
                          <div className="md:col-span-5">
                            <input
                              type="text"
                              value={item.en || ''}
                              onChange={(e) => {
                                const updated = [
                                  ...(editingInsight.aiOverview?.keyTakeaways || []),
                                ];
                                updated[kIdx] = { ...updated[kIdx], en: e.target.value };
                                setEditingInsight({
                                  ...editingInsight,
                                  aiOverview: {
                                    summary: editingInsight.aiOverview?.summary || {
                                      en: '',
                                      ar: '',
                                    },
                                    keyTakeaways: updated,
                                  },
                                });
                              }}
                              placeholder="Key Takeaway (EN)"
                              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                            />
                          </div>
                          <div className="md:col-span-6">
                            <input
                              type="text"
                              dir="rtl"
                              value={item.ar || ''}
                              onChange={(e) => {
                                const updated = [
                                  ...(editingInsight.aiOverview?.keyTakeaways || []),
                                ];
                                updated[kIdx] = { ...updated[kIdx], ar: e.target.value };
                                setEditingInsight({
                                  ...editingInsight,
                                  aiOverview: {
                                    summary: editingInsight.aiOverview?.summary || {
                                      en: '',
                                      ar: '',
                                    },
                                    keyTakeaways: updated,
                                  },
                                });
                              }}
                              placeholder="النقطة المستخلصة (AR)"
                              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                            />
                          </div>
                          <div className="md:col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (
                                  editingInsight.aiOverview?.keyTakeaways || []
                                ).filter((_, i) => i !== kIdx);
                                setEditingInsight({
                                  ...editingInsight,
                                  aiOverview: {
                                    summary: editingInsight.aiOverview?.summary || {
                                      en: '',
                                      ar: '',
                                    },
                                    keyTakeaways: updated,
                                  },
                                });
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <TbTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* TAB 5: FRONTEND DETAIL PAGE DESIGN ON/OFF CONTROLS              */}
              {/* =============================================================== */}
              {activeTab === 'visibility' && (
                <div className="space-y-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 text-white">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
                        Frontend Detail Page Design On/Off Controls
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Turn any section or UI component ON or OFF on the public insight detail page (<code className="font-mono text-white">/{lang}/insights/{editingInsight.slug}</code>), or apply this exact layout to every insight in the <strong>{editingInsight.category?.en || editingInsight.categorySlug}</strong> category.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingInsight({
                            ...editingInsight,
                            sectionVisibility: { ...DEFAULT_INSIGHT_SECTION_VISIBILITY },
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                      >
                        Enable All (15/15)
                      </button>

                      <button
                        type="button"
                        disabled={applyingCategoryVisibility}
                        onClick={() =>
                          handleApplyVisibilityToCategory(editingInsight.categorySlug || 'article')
                        }
                        className="px-3 py-1.5 rounded-lg bg-persici-crimson hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-50"
                      >
                        {applyingCategoryVisibility
                          ? 'Applying...'
                          : `Apply to All "${editingInsight.category?.en || editingInsight.categorySlug}" Insights`}
                      </button>
                    </div>
                  </div>

                  {(['header', 'rail', 'body'] as const).map((groupKey) => {
                    const groupTitle =
                      groupKey === 'header'
                        ? 'Hero Header & Metadata Bar Elements'
                        : groupKey === 'rail'
                        ? 'Left Sticky Rail (Author & Table of Contents)'
                        : 'Article Body, AI Overview & Footer Widgets';

                    const items = VISIBILITY_CONTROLS.filter((c) => c.group === groupKey);

                    return (
                      <div
                        key={groupKey}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                      >
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          {groupTitle}
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {items.map((ctrl) => {
                            const isEnabled =
                              editingInsight.sectionVisibility?.[ctrl.key] !== false;
                            return (
                              <label
                                key={ctrl.key}
                                className={`flex items-start justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                                  isEnabled
                                    ? 'bg-white border-slate-200'
                                    : 'bg-slate-100/70 border-slate-200 opacity-75'
                                }`}
                              >
                                <div>
                                  <div className="text-xs font-bold text-slate-900">
                                    {ctrl.label}
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {ctrl.description}
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={isEnabled}
                                  onChange={(e) =>
                                    setEditingInsight({
                                      ...editingInsight,
                                      sectionVisibility: {
                                        ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
                                        ...(editingInsight.sectionVisibility || {}),
                                        [ctrl.key]: e.target.checked,
                                      },
                                    })
                                  }
                                  className="mt-1 h-4 w-4 rounded border-slate-300 text-persici-crimson focus:ring-persici-crimson"
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingInsight.isActive !== false}
                      onChange={(e) =>
                        setEditingInsight({ ...editingInsight, isActive: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                    />
                    <span>Published on Insights Hub</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingInsight.featured)}
                      onChange={(e) =>
                        setEditingInsight({ ...editingInsight, featured: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-slate-300 text-persici-crimson"
                    />
                    <span>Featured Insight</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingInsight(null)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-persici-crimson text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <TbDeviceFloppy className="w-4 h-4" />
                    <span>
                      {saving
                        ? 'Saving to Database...'
                        : isCreating
                        ? 'Create & Save Insight'
                        : 'Save Insight Changes'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* CATEGORIES & HUB FILTER TABS MODAL                                  */}
      {/* =================================================================== */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Manage Insight Categories &amp; Hub Filter Tabs
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add, rename, or reorder the category filter tabs displayed on the public Insights Hub page and inside the Insight Editor.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {hubCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-slate-50 p-3 rounded-xl border border-slate-200"
                >
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={cat.slug}
                      onChange={(e) => {
                        const updated = [...hubCategories];
                        updated[idx] = {
                          ...updated[idx],
                          slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                        };
                        setHubCategories(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Label (English)
                    </label>
                    <input
                      type="text"
                      value={cat.label?.en || ''}
                      onChange={(e) => {
                        const updated = [...hubCategories];
                        updated[idx] = {
                          ...updated[idx],
                          label: { ...(updated[idx].label || { en: '', ar: '' }), en: e.target.value },
                        };
                        setHubCategories(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      الاسم (العربية)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={cat.label?.ar || ''}
                      onChange={(e) => {
                        const updated = [...hubCategories];
                        updated[idx] = {
                          ...updated[idx],
                          label: { ...(updated[idx].label || { en: '', ar: '' }), ar: e.target.value },
                        };
                        setHubCategories(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end pt-4">
                    {cat.slug !== 'all' && (
                      <button
                        type="button"
                        onClick={() =>
                          setHubCategories(hubCategories.filter((_, i) => i !== idx))
                        }
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  setHubCategories([
                    ...hubCategories,
                    {
                      slug: `category-${hubCategories.length}`,
                      label: { en: 'New Category', ar: 'تصنيف جديد' },
                    },
                  ])
                }
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
              >
                <TbPlus className="w-4 h-4" />
                <span>Add Category Filter</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={savingCategories}
                  onClick={handleSaveHubCategories}
                  className="px-5 py-2 rounded-xl bg-persici-crimson hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50"
                >
                  {savingCategories ? 'Saving...' : 'Save Categories'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* R2 Media Picker Modal */}
      {mediaPickerConfig.isOpen && (
        <MediaPickerModal
          isOpen={mediaPickerConfig.isOpen}
          allowedType="image"
          onClose={() => setMediaPickerConfig({ isOpen: false, onSelect: () => {} })}
          onSelect={(url: string) => {
            mediaPickerConfig.onSelect(url);
            setMediaPickerConfig({ isOpen: false, onSelect: () => {} });
          }}
        />
      )}
    </div>
  );
}
