'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TbSparkles,
  TbLayersSubtract,
  TbBriefcase,
  TbArticle,
  TbCheck,
  TbPlus,
  TbTrash,
  TbArrowUp,
  TbArrowDown,
  TbPhoto,
  TbExternalLink,
  TbCategory,
  TbStar,
  TbListCheck,
  TbFilter,
  TbForms,
  TbChevronRight,
  TbCpu,
  TbWorld,
} from 'react-icons/tb';
import { SectionAccordion } from './section-accordion';
import { RichTextEditor } from './rich-text-editor';
import {
  IndustriesHubCmsData,
  IndustryFeatureCmsData,
  IndustryClientStoriesSectionConfig,
  IndustryInsightsSectionConfig,
  IndustryDynamicSelectionMode,
  extractIndustryFeatureSlug,
  normalizeIndustriesHubPageData,
  normalizeIndustryFeaturePageData,
} from '@/app/[lang]/(site)/industries/_industries/data/industries-cms.data';
import type { LocalizedString, SolutionDiagramType } from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { clientStoriesData } from '@/app/[lang]/(site)/client-stories/_client-stories/data/client-stories.data';
import { insightsData } from '@/app/[lang]/(site)/insights/_insights/data/insights.data';

type SolutionClientStoriesSectionConfig = IndustryClientStoriesSectionConfig;
type SolutionInsightsSectionConfig = IndustryInsightsSectionConfig;
type SolutionSelectionMode = IndustryDynamicSelectionMode;

interface AvailableStoryOption {
  slug: string;
  title: LocalizedString;
  client: string;
  categorySlug: string;
  categoryLabel: LocalizedString;
  featured: boolean;
  heroImage: string;
}

interface AvailableInsightOption {
  slug: string;
  title: LocalizedString;
  categorySlug: string;
  categoryLabel: LocalizedString;
  featured: boolean;
  date: string;
  heroImage: string;
}

interface CategoryOption {
  slug: string;
  label: LocalizedString;
}

export interface IndustriesPageCmsEditorProps {
  slug: string;
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageData: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPageData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  onSave: () => void;
  openMediaPicker: (onSelect: (url: string) => void, accept?: 'image' | 'video' | 'all') => void;
}

const DIAGRAM_TYPES: SolutionDiagramType[] = [
  'grid-dots',
  'concentric-nodes',
  'circuit-flow',
  'matrix-intersect',
  'nested-squares',
  'orbital-radar',
  'triad-mesh',
  'lattice-loop',
  'flow-funnel',
  'app-dual-stack',
  'bezier-curv-engine',
  'api-cluster-gateway',
  'automated-test-grid',
  'store-launch-trajectory',
  'helix-data-strand',
  'quantum-core-cube',
  'cyber-shield-lock',
  'neural-synapse-web',
  'wave-frequency-stream',
  'hexagonal-honeycomb-hive',
  'prism-refraction-beam',
  'compass-spatial-reticle',
  'infinity-pulse-exchange',
  'bar-spectrum-analyzer',
  'creative-story-lens',
  'omnichannel-radial-mesh',
  'social-resonance-echo',
  'media-production-timeline',
  'growth-trajectory-engine',
  'storefront-render-matrix',
  'ad-targeting-matrix',
  'cart-checkout-funnel',
  'omnichannel-inventory-sync',
  'retention-loop-orbit',
];

const INDUSTRY_NAV_ITEMS: { slug: string; label: string }[] = [
  { slug: 'industries', label: 'Overview Hub (/industries)' },
  { slug: 'industries-consumer-products', label: '01. Consumer Products' },
  { slug: 'industries-telecom-media-technology', label: '02. Telecom, Media & Tech' },
  { slug: 'industries-public-sector', label: '03. Public Sector' },
  { slug: 'industries-retail', label: '04. Retail' },
  { slug: 'industries-health', label: '05. Health' },
  { slug: 'industries-energy-commodities', label: '06. Energy & Commodities' },
];

function mapStoryOption(s: Record<string, unknown>): AvailableStoryOption {
  const catSlug = String(s.categorySlug || '');
  const catObj = (s.categoryLabel || s.category) as LocalizedString | undefined;
  return {
    slug: String(s.slug || ''),
    title: (s.title as LocalizedString) || { en: String(s.slug || ''), ar: '' },
    client: String(s.client || ''),
    categorySlug: catSlug,
    categoryLabel: catObj || { en: catSlug || 'Enterprise', ar: catSlug || 'مؤسسي' },
    featured: Boolean(s.featured),
    heroImage: String(s.heroImage || s.image || ''),
  };
}

function mapInsightOption(a: Record<string, unknown>): AvailableInsightOption {
  const catSlug = String(a.categorySlug || '');
  const catObj = (a.categoryLabel || a.category) as LocalizedString | undefined;
  return {
    slug: String(a.slug || ''),
    title: (a.title as LocalizedString) || { en: String(a.slug || ''), ar: '' },
    categorySlug: catSlug,
    categoryLabel: catObj || { en: catSlug || 'Insights', ar: catSlug || 'رؤى' },
    featured: Boolean(a.featured),
    date: String(a.date || ''),
    heroImage: String(a.heroImage || a.image || ''),
  };
}

function deriveCategories<T extends { categorySlug: string; categoryLabel: LocalizedString }>(
  items: T[]
): CategoryOption[] {
  const seen = new Set<string>();
  const cats: CategoryOption[] = [];
  items.forEach((item) => {
    if (item.categorySlug && !seen.has(item.categorySlug)) {
      seen.add(item.categorySlug);
      cats.push({
        slug: item.categorySlug,
        label: item.categoryLabel,
      });
    }
  });
  return cats;
}

export function IndustriesPageCmsEditor({
  slug,
  lang,
  pageData,
  setPageData,
  onSave,
  openMediaPicker,
}: IndustriesPageCmsEditorProps) {
  const isHub = slug === 'industries';
  const featureSlug = useMemo(() => extractIndustryFeatureSlug(slug), [slug]);

  const initialStories = useMemo(
    () =>
      (clientStoriesData as unknown as Record<string, unknown>[]).map(mapStoryOption),
    []
  );
  const initialInsights = useMemo(
    () =>
      (insightsData as unknown as Record<string, unknown>[]).map(mapInsightOption),
    []
  );

  const [storiesOptions, setStoriesOptions] = useState<AvailableStoryOption[]>(initialStories);
  const [storyCategories, setStoryCategories] = useState<CategoryOption[]>(() =>
    deriveCategories(initialStories)
  );
  const [insightsOptions, setInsightsOptions] =
    useState<AvailableInsightOption[]>(initialInsights);
  const [insightCategories, setInsightCategories] = useState<CategoryOption[]>(() =>
    deriveCategories(initialInsights)
  );
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  // Load Client Stories & Blogs catalogs from live DB API so the user can filter by category, featured, or custom
  useEffect(() => {
    let mounted = true;
    async function loadCatalogs() {
      setLoadingCatalog(true);
      try {
        const [projectsRes, insightsRes] = await Promise.all([
          fetch('/api/projects').catch(() => null),
          fetch('/api/insights').catch(() => null),
        ]);

        if (!mounted) return;

        if (projectsRes && projectsRes.ok) {
          const pJson = await projectsRes.json();
          if (Array.isArray(pJson?.projects) && pJson.projects.length > 0) {
            const mapped = pJson.projects.map(mapStoryOption);
            setStoriesOptions(mapped);
            setStoryCategories(deriveCategories(mapped));
          }
        }

        if (insightsRes && insightsRes.ok) {
          const iJson = await insightsRes.json();
          if (Array.isArray(iJson?.insights) && iJson.insights.length > 0) {
            const mapped = iJson.insights.map(mapInsightOption);
            setInsightsOptions(mapped);
            setInsightCategories(deriveCategories(mapped));
          }
        }
      } catch (error) {
        console.error('Failed to load Client Stories / Insights catalogs:', error);
      } finally {
        if (mounted) setLoadingCatalog(false);
      }
    }
    loadCatalogs();
    return () => {
      mounted = false;
    };
  }, []);

  // Normalize current state safely
  const hubData = useMemo(
    () => (isHub ? normalizeIndustriesHubPageData(pageData) : null),
    [isHub, pageData]
  );

  const featData = useMemo(
    () =>
      !isHub && featureSlug
        ? normalizeIndustryFeaturePageData(featureSlug, pageData)
        : null,
    [isHub, featureSlug, pageData]
  );

  // Helper to move array item up/down
  function moveItem<T>(arr: T[], index: number, direction: 'up' | 'down'): T[] {
    const next = [...arr];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return next;
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    return next;
  }

  // Compute live preview of resolved Client Stories based on current config
  function getResolvedStoriesPreview(cfg: SolutionClientStoriesSectionConfig): AvailableStoryOption[] {
    const maxCount = Math.max(1, Math.min(24, Number(cfg.maxCount) || 2));
    if (cfg.selectionMode === 'custom') {
      const slugs = cfg.selectedSlugs || [];
      const picked = slugs
        .map((s) => storiesOptions.find((opt) => opt.slug === s))
        .filter((x): x is AvailableStoryOption => Boolean(x));
      if (picked.length > 0) return picked.slice(0, maxCount);
    }
    if (cfg.selectionMode === 'category' && cfg.categorySlug) {
      const byCat = storiesOptions.filter((s) => s.categorySlug === cfg.categorySlug);
      if (byCat.length > 0) return byCat.slice(0, maxCount);
    }
    if (cfg.selectionMode === 'featured') {
      const feat = storiesOptions.filter((s) => s.featured);
      return (feat.length > 0 ? feat : storiesOptions).slice(0, maxCount);
    }
    return storiesOptions.slice(0, maxCount);
  }

  // Compute live preview of resolved Blogs/Insights based on current config
  function getResolvedInsightsPreview(cfg: SolutionInsightsSectionConfig): AvailableInsightOption[] {
    const maxCount = Math.max(1, Math.min(24, Number(cfg.maxCount) || 6));
    if (cfg.selectionMode === 'custom') {
      const slugs = cfg.selectedSlugs || [];
      const picked = slugs
        .map((s) => insightsOptions.find((opt) => opt.slug === s))
        .filter((x): x is AvailableInsightOption => Boolean(x));
      if (picked.length > 0) return picked.slice(0, maxCount);
    }
    if (cfg.selectionMode === 'category' && cfg.categorySlug) {
      const byCat = insightsOptions.filter((a) => a.categorySlug === cfg.categorySlug);
      if (byCat.length > 0) return byCat.slice(0, maxCount);
    }
    if (cfg.selectionMode === 'featured') {
      const feat = insightsOptions.filter((a) => a.featured);
      return (feat.length > 0 ? feat : insightsOptions).slice(0, maxCount);
    }
    return [];
  }

  // Reusable Client Stories Selector UI
  function renderClientStoriesSelector(
    cfg: SolutionClientStoriesSectionConfig,
    onChangeConfig: (next: SolutionClientStoriesSectionConfig) => void
  ) {
    const resolvedPreview = getResolvedStoriesPreview(cfg);

    return (
      <div className="space-y-6">
        {/* Visibility Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Display Featured Client Stories Section
            </span>
            <span className="text-[11px] text-slate-500">
              Toggle whether the Client Stories section appears on this page
            </span>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={cfg.enabled !== false}
              onChange={(e) => onChangeConfig({ ...cfg, enabled: e.target.checked })}
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-700">
              {cfg.enabled !== false ? 'Visible' : 'Hidden'}
            </span>
          </label>
        </div>

        {/* Section Header Titles & Badge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Eyebrow Badge (EN)
            </label>
            <input
              type="text"
              value={cfg.badge?.en || ''}
              onChange={(e) =>
                onChangeConfig({
                  ...cfg,
                  badge: { ...(cfg.badge || { en: '', ar: '' }), en: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-persici-crimson"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              الشارة العلوية (AR)
            </label>
            <input
              type="text"
              dir="rtl"
              value={cfg.badge?.ar || ''}
              onChange={(e) =>
                onChangeConfig({
                  ...cfg,
                  badge: { ...(cfg.badge || { en: '', ar: '' }), ar: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-persici-crimson font-arabic"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Section Title (EN)
            </label>
            <input
              type="text"
              value={cfg.title?.en || ''}
              onChange={(e) =>
                onChangeConfig({
                  ...cfg,
                  title: { ...(cfg.title || { en: '', ar: '' }), en: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-persici-crimson"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              عنوان القسم (AR)
            </label>
            <input
              type="text"
              dir="rtl"
              value={cfg.title?.ar || ''}
              onChange={(e) =>
                onChangeConfig({
                  ...cfg,
                  title: { ...(cfg.title || { en: '', ar: '' }), ar: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-persici-crimson font-arabic"
            />
          </div>
        </div>

        <RichTextEditor
          label="Section Subtitle / Description"
          rows={2}
          valueEn={cfg.subtitle?.en || ''}
          valueAr={cfg.subtitle?.ar || ''}
          onChangeEn={(val) =>
            onChangeConfig({
              ...cfg,
              subtitle: { ...(cfg.subtitle || { en: '', ar: '' }), en: val },
            })
          }
          onChangeAr={(val) =>
            onChangeConfig({
              ...cfg,
              subtitle: { ...(cfg.subtitle || { en: '', ar: '' }), ar: val },
            })
          }
        />

        {/* Selection Mode & Max Count Controls */}
        <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <TbFilter className="w-4 h-4 text-persici-crimson" />
                <span>Client Stories Selection Mode &amp; Maximum Limit</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Choose how Client Stories are populated on this page and how many maximum stories will appear.
              </p>
            </div>

            {/* Max Stories Count Control */}
            <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Max Stories Shown:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onChangeConfig({ ...cfg, maxCount: num })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      cfg.maxCount === num
                        ? 'bg-persici-crimson text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={cfg.maxCount || 2}
                  onChange={(e) =>
                    onChangeConfig({
                      ...cfg,
                      maxCount: Math.max(1, Math.min(24, Number(e.target.value) || 2)),
                    })
                  }
                  className="w-14 px-2 py-1 text-xs font-bold text-center border border-slate-200 rounded-lg ml-1"
                />
              </div>
            </div>
          </div>

          {/* 3 Mode Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(
              [
                {
                  mode: 'custom' as SolutionSelectionMode,
                  title: '1. Custom Hand-Picked Stories',
                  desc: 'Select exact client stories and order them manually for this page.',
                  icon: TbListCheck,
                },
                {
                  mode: 'category' as SolutionSelectionMode,
                  title: '2. Filter by Category',
                  desc: 'Automatically pull client stories matching a specific category.',
                  icon: TbCategory,
                },
                {
                  mode: 'featured' as SolutionSelectionMode,
                  title: '3. Featured Client Stories',
                  desc: 'Automatically display stories marked as Featured in Client Stories Hub.',
                  icon: TbStar,
                },
              ] as const
            ).map((opt) => {
              const Icon = opt.icon;
              const active = cfg.selectionMode === opt.mode;
              return (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => onChangeConfig({ ...cfg, selectionMode: opt.mode })}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    active
                      ? 'bg-white border-persici-crimson ring-2 ring-persici-crimson/15 shadow-xs'
                      : 'bg-white/70 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Icon
                        className={`w-4 h-4 ${
                          active ? 'text-persici-crimson' : 'text-slate-400'
                        }`}
                      />
                      <span>{opt.title}</span>
                    </span>
                    {active && (
                      <span className="w-4 h-4 rounded-full bg-persici-crimson text-white flex items-center justify-center">
                        <TbCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Mode-Specific Controls */}
          {cfg.selectionMode === 'category' && (
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Client Story Category
              </label>
              <div className="flex flex-wrap gap-2">
                {storyCategories.map((cat) => {
                  const selected = cfg.categorySlug === cat.slug;
                  const count = storiesOptions.filter((s) => s.categorySlug === cat.slug).length;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => onChangeConfig({ ...cfg, categorySlug: cat.slug })}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                        selected
                          ? 'bg-persici-crimson text-white border-persici-crimson shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat.label.en}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                          selected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {cfg.selectionMode === 'custom' && (
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Choose Custom Client Stories ({cfg.selectedSlugs.length} Selected • Max {cfg.maxCount} Shown)
                </span>
                {loadingCatalog && (
                  <span className="text-[11px] text-slate-400">Loading catalog...</span>
                )}
              </div>

              {/* Selected Ordered Stories */}
              {cfg.selectedSlugs.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Selected Order (First {cfg.maxCount} will be displayed):
                  </span>
                  {cfg.selectedSlugs.map((storySlug, idx) => {
                    const info = storiesOptions.find((s) => s.slug === storySlug);
                    const isWithinMax = idx < cfg.maxCount;
                    return (
                      <div
                        key={storySlug}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                          isWithinMax
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="truncate">
                            <span className="font-bold text-slate-900">
                              {info ? info.title.en : storySlug}
                            </span>
                            {info && (
                              <span className="text-[11px] text-slate-500 ml-2">
                                ({info.client} • {info.categoryLabel.en})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() =>
                              onChangeConfig({
                                ...cfg,
                                selectedSlugs: moveItem(cfg.selectedSlugs, idx, 'up'),
                              })
                            }
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                          >
                            <TbArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === cfg.selectedSlugs.length - 1}
                            onClick={() =>
                              onChangeConfig({
                                ...cfg,
                                selectedSlugs: moveItem(cfg.selectedSlugs, idx, 'down'),
                              })
                            }
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                          >
                            <TbArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onChangeConfig({
                                ...cfg,
                                selectedSlugs: cfg.selectedSlugs.filter((s) => s !== storySlug),
                              })
                            }
                            className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            <TbTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* All Available Stories Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                {storiesOptions.map((story) => {
                  const checked = cfg.selectedSlugs.includes(story.slug);
                  return (
                    <label
                      key={story.slug}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        checked
                          ? 'bg-persici-crimson/5 border-persici-crimson/40'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onChangeConfig({
                              ...cfg,
                              selectedSlugs: [...cfg.selectedSlugs, story.slug],
                            });
                          } else {
                            onChangeConfig({
                              ...cfg,
                              selectedSlugs: cfg.selectedSlugs.filter((s) => s !== story.slug),
                            });
                          }
                        }}
                        className="mt-0.5 w-4 h-4 accent-persici-crimson rounded cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 truncate">{story.title.en}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{story.client}</span>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 bg-slate-200/70 rounded text-[10px] font-semibold text-slate-700">
                            {story.categoryLabel.en}
                          </span>
                          {story.featured && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live Preview of Exact Client Stories That Will Render */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <TbBriefcase className="w-4 h-4" />
                <span>
                  Live Preview: {resolvedPreview.length} Client{' '}
                  {resolvedPreview.length === 1 ? 'Story' : 'Stories'} Will Render on This Page
                </span>
              </span>
              <span className="text-[11px] text-slate-400">
                Mode: <strong className="text-white uppercase">{cfg.selectionMode}</strong> • Max:{' '}
                <strong className="text-white">{cfg.maxCount}</strong>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {resolvedPreview.map((st, idx) => (
                <div
                  key={st.slug}
                  className="p-2.5 rounded-lg bg-white/10 border border-white/10 flex items-center gap-2.5"
                >
                  <span className="w-5 h-5 rounded bg-persici-crimson text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{st.title.en}</p>
                    <p className="text-[10px] text-slate-300 truncate">
                      {st.client} • {st.categoryLabel.en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reusable Blogs / Insights Carousel Selector UI
  function renderInsightsSelector(
    cfg: SolutionInsightsSectionConfig,
    curatedItems: ContentCardItem[],
    onChangeConfig: (next: SolutionInsightsSectionConfig) => void,
    onChangeCuratedItems: (nextItems: ContentCardItem[]) => void
  ) {
    const resolvedBlogPreview = getResolvedInsightsPreview(cfg);

    return (
      <div className="space-y-6">
        {/* Visibility Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Display Blogs &amp; Insights Carousel Section
            </span>
            <span className="text-[11px] text-slate-500">
              Toggle whether the Blogs / Insights carousel is shown on this page
            </span>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={cfg.enabled !== false}
              onChange={(e) => onChangeConfig({ ...cfg, enabled: e.target.checked })}
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-700">
              {cfg.enabled !== false ? 'Visible' : 'Hidden'}
            </span>
          </label>
        </div>

        {/* Section Header Titles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Carousel Title (EN)
            </label>
            <input
              type="text"
              value={cfg.title?.en || ''}
              onChange={(e) =>
                onChangeConfig({
                  ...cfg,
                  title: { ...(cfg.title || { en: '', ar: '' }), en: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              عنوان قسم المدونات (AR)
            </label>
            <input
              type="text"
              dir="rtl"
              value={cfg.title?.ar || ''}
              onChange={(e) =>
                onChangeConfig({
                  ...cfg,
                  title: { ...(cfg.title || { en: '', ar: '' }), ar: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl font-arabic"
            />
          </div>
        </div>

        <RichTextEditor
          label="Carousel Subtitle / Description"
          rows={2}
          valueEn={cfg.subtitle?.en || ''}
          valueAr={cfg.subtitle?.ar || ''}
          onChangeEn={(val) =>
            onChangeConfig({
              ...cfg,
              subtitle: { ...(cfg.subtitle || { en: '', ar: '' }), en: val },
            })
          }
          onChangeAr={(val) =>
            onChangeConfig({
              ...cfg,
              subtitle: { ...(cfg.subtitle || { en: '', ar: '' }), ar: val },
            })
          }
        />

        {/* Selection Mode & Max Count Controls */}
        <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <TbArticle className="w-4 h-4 text-persici-crimson" />
                <span>Blogs / Insights Carousel Selection Mode &amp; Max Count</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Choose blogs from the Insights database by Custom selection, Category, or Featured status—or edit the curated page cards below.
              </p>
            </div>

            {/* Max Blogs Count Control */}
            <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Max Blogs in Carousel:
              </span>
              <div className="flex items-center gap-1">
                {[3, 4, 6, 8, 12].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onChangeConfig({ ...cfg, maxCount: num })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      cfg.maxCount === num
                        ? 'bg-persici-crimson text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={cfg.maxCount || 6}
                  onChange={(e) =>
                    onChangeConfig({
                      ...cfg,
                      maxCount: Math.max(1, Math.min(24, Number(e.target.value) || 6)),
                    })
                  }
                  className="w-14 px-2 py-1 text-xs font-bold text-center border border-slate-200 rounded-lg ml-1"
                />
              </div>
            </div>
          </div>

          {/* 3 Mode Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(
              [
                {
                  mode: 'custom' as SolutionSelectionMode,
                  title: '1. Custom / Curated Blogs',
                  desc: 'Pick specific blog articles from Insights or use the page’s custom curated cards below.',
                  icon: TbListCheck,
                },
                {
                  mode: 'category' as SolutionSelectionMode,
                  title: '2. Filter Blogs by Category',
                  desc: 'Automatically populate carousel with blogs from a chosen Insights category.',
                  icon: TbCategory,
                },
                {
                  mode: 'featured' as SolutionSelectionMode,
                  title: '3. Featured Blogs',
                  desc: 'Automatically display articles marked as Featured in the Insights Hub.',
                  icon: TbStar,
                },
              ] as const
            ).map((opt) => {
              const Icon = opt.icon;
              const active = cfg.selectionMode === opt.mode;
              return (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => onChangeConfig({ ...cfg, selectionMode: opt.mode })}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    active
                      ? 'bg-white border-persici-crimson ring-2 ring-persici-crimson/15 shadow-xs'
                      : 'bg-white/70 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Icon
                        className={`w-4 h-4 ${
                          active ? 'text-persici-crimson' : 'text-slate-400'
                        }`}
                      />
                      <span>{opt.title}</span>
                    </span>
                    {active && (
                      <span className="w-4 h-4 rounded-full bg-persici-crimson text-white flex items-center justify-center">
                        <TbCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Mode: Category */}
          {cfg.selectionMode === 'category' && (
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Blog / Insight Category
              </label>
              <div className="flex flex-wrap gap-2">
                {insightCategories.map((cat) => {
                  const selected = cfg.categorySlug === cat.slug;
                  const count = insightsOptions.filter((a) => a.categorySlug === cat.slug).length;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => onChangeConfig({ ...cfg, categorySlug: cat.slug })}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                        selected
                          ? 'bg-persici-crimson text-white border-persici-crimson shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat.label.en}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                          selected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode: Custom */}
          {cfg.selectionMode === 'custom' && (
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Option A: Pick Published Blogs from Insights Database ({cfg.selectedSlugs.length} Selected)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    If you select published blogs here, they will be used in the exact order chosen. Leave empty to use the page&apos;s Curated Insight Cards (Option B below).
                  </span>
                </div>
                {cfg.selectedSlugs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onChangeConfig({ ...cfg, selectedSlugs: [] })}
                    className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Clear Selection (Use Curated Cards)
                  </button>
                )}
              </div>

              {cfg.selectedSlugs.length > 0 && (
                <div className="space-y-2">
                  {cfg.selectedSlugs.map((artSlug, idx) => {
                    const info = insightsOptions.find((a) => a.slug === artSlug);
                    return (
                      <div
                        key={artSlug}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900 truncate">
                            {info ? info.title.en : artSlug}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() =>
                              onChangeConfig({
                                ...cfg,
                                selectedSlugs: moveItem(cfg.selectedSlugs, idx, 'up'),
                              })
                            }
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                          >
                            <TbArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === cfg.selectedSlugs.length - 1}
                            onClick={() =>
                              onChangeConfig({
                                ...cfg,
                                selectedSlugs: moveItem(cfg.selectedSlugs, idx, 'down'),
                              })
                            }
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                          >
                            <TbArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onChangeConfig({
                                ...cfg,
                                selectedSlugs: cfg.selectedSlugs.filter((s) => s !== artSlug),
                              })
                            }
                            className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            <TbTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {insightsOptions.map((article) => {
                  const checked = cfg.selectedSlugs.includes(article.slug);
                  return (
                    <label
                      key={article.slug}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        checked
                          ? 'bg-persici-crimson/5 border-persici-crimson/40'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onChangeConfig({
                              ...cfg,
                              selectedSlugs: [...cfg.selectedSlugs, article.slug],
                            });
                          } else {
                            onChangeConfig({
                              ...cfg,
                              selectedSlugs: cfg.selectedSlugs.filter((s) => s !== article.slug),
                            });
                          }
                        }}
                        className="mt-0.5 w-4 h-4 accent-persici-crimson rounded cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 truncate">{article.title.en}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{article.date}</span>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 bg-slate-200/70 rounded text-[10px] font-semibold text-slate-700">
                            {article.categoryLabel.en}
                          </span>
                          {article.featured && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live Preview Banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <TbArticle className="w-4 h-4" />
                <span>
                  {resolvedBlogPreview.length > 0
                    ? `Live Preview: ${resolvedBlogPreview.length} Database Blog Articles Will Render`
                    : `Live Preview: Using ${Math.min(cfg.maxCount || 6, curatedItems.length)} Curated Page Insight Cards (up to Max ${cfg.maxCount})`}
                </span>
              </span>
              <span className="text-[11px] text-slate-400">
                Mode: <strong className="text-white uppercase">{cfg.selectionMode}</strong> • Max:{' '}
                <strong className="text-white">{cfg.maxCount}</strong>
              </span>
            </div>
            {resolvedBlogPreview.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {resolvedBlogPreview.map((b, i) => (
                  <div
                    key={b.slug}
                    className="p-2 rounded-lg bg-white/10 border border-white/10 text-xs truncate"
                  >
                    <span className="font-bold text-amber-300 mr-1.5">#{i + 1}</span>
                    <span>{b.title.en}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {curatedItems.slice(0, cfg.maxCount || 6).map((c, i) => (
                  <div
                    key={c.id || c.slug || i}
                    className="p-2 rounded-lg bg-white/10 border border-white/10 text-xs truncate"
                  >
                    <span className="font-bold text-amber-300 mr-1.5">#{i + 1}</span>
                    <span>{typeof c.title === 'string' ? c.title : c.title?.en || ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Option B: Inline Curated Insight Cards Editor (Preserves all default page-specific cards) */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Option B: Page-Specific Curated Insight Cards ({curatedItems.length} Cards)
              </h4>
              <p className="text-[11px] text-slate-500">
                These curated cards are pre-loaded with the exact original content of this page and are used whenever Custom mode has no database overrides.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangeCuratedItems([
                  ...curatedItems,
                  {
                    id: `insight-${Date.now()}`,
                    slug: `insight-${Date.now()}`,
                    badge: { en: 'Research', ar: 'أبحاث' },
                    category: { en: 'Research', ar: 'أبحاث' },
                    title: { en: 'New Insight Article', ar: 'مقال تحليلي جديد' },
                    excerpt: { en: 'Article summary...', ar: 'ملخص المقال...' },
                    date: 'Oct 2026',
                    image: '/images/industry/consumer-products/insight-1.jpg',
                    href: '/insights',
                  },
                ])
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson transition-colors cursor-pointer"
            >
              <TbPlus className="w-3.5 h-3.5" />
              <span>Add Curated Card</span>
            </button>
          </div>

          <div className="space-y-3">
            {curatedItems.map((card, idx) => {
              const getVal = (v: unknown, l: 'en' | 'ar'): string => {
                if (!v) return '';
                if (typeof v === 'string') return v;
                if (typeof v === 'object' && v !== null) {
                  const o = v as Record<string, string>;
                  return o[l] || o.en || '';
                }
                return String(v);
              };
              const setVal = (v: unknown, l: 'en' | 'ar', nextVal: string): LocalizedString => {
                const enStr = getVal(v, 'en');
                const arStr = getVal(v, 'ar');
                return {
                  en: l === 'en' ? nextVal : enStr,
                  ar: l === 'ar' ? nextVal : arStr,
                };
              };
              const badgeSrc = card.badge || card.category;
              const cardImg = typeof card.image === 'string' ? card.image : '';

              return (
                <div
                  key={card.id || card.slug || idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Card #{idx + 1}: {getVal(card.title, 'en')}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() =>
                          onChangeCuratedItems(moveItem(curatedItems, idx, 'up'))
                        }
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      >
                        <TbArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === curatedItems.length - 1}
                        onClick={() =>
                          onChangeCuratedItems(moveItem(curatedItems, idx, 'down'))
                        }
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      >
                        <TbArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...curatedItems];
                          copy.splice(idx, 1);
                          onChangeCuratedItems(copy);
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Badge / Category (EN)
                      </label>
                      <input
                        type="text"
                        value={getVal(badgeSrc, 'en')}
                        onChange={(e) => {
                          const copy = [...curatedItems];
                          const nextBadge = setVal(badgeSrc, 'en', e.target.value);
                          copy[idx] = {
                            ...card,
                            badge: nextBadge,
                            category: nextBadge,
                          };
                          onChangeCuratedItems(copy);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        الشارة / التصنيف (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={getVal(badgeSrc, 'ar')}
                        onChange={(e) => {
                          const copy = [...curatedItems];
                          const nextBadge = setVal(badgeSrc, 'ar', e.target.value);
                          copy[idx] = {
                            ...card,
                            badge: nextBadge,
                            category: nextBadge,
                          };
                          onChangeCuratedItems(copy);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Date Label
                      </label>
                      <input
                        type="text"
                        value={getVal(card.date, 'en')}
                        onChange={(e) => {
                          const copy = [...curatedItems];
                          copy[idx] = { ...card, date: e.target.value };
                          onChangeCuratedItems(copy);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Target Link (Href)
                      </label>
                      <input
                        type="text"
                        value={card.href || ''}
                        onChange={(e) => {
                          const copy = [...curatedItems];
                          copy[idx] = { ...card, href: e.target.value };
                          onChangeCuratedItems(copy);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Headline (EN)
                      </label>
                      <input
                        type="text"
                        value={getVal(card.title, 'en')}
                        onChange={(e) => {
                          const copy = [...curatedItems];
                          copy[idx] = {
                            ...card,
                            title: setVal(card.title, 'en', e.target.value),
                          };
                          onChangeCuratedItems(copy);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        العنوان (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={getVal(card.title, 'ar')}
                        onChange={(e) => {
                          const copy = [...curatedItems];
                          copy[idx] = {
                            ...card,
                            title: setVal(card.title, 'ar', e.target.value),
                          };
                          onChangeCuratedItems(copy);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                  </div>

                  {card.excerpt !== undefined && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Excerpt (EN)
                        </label>
                        <textarea
                          rows={2}
                          value={getVal(card.excerpt, 'en')}
                          onChange={(e) => {
                            const copy = [...curatedItems];
                            copy[idx] = {
                              ...card,
                              excerpt: setVal(card.excerpt, 'en', e.target.value),
                            };
                            onChangeCuratedItems(copy);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          الملخص (AR)
                        </label>
                        <textarea
                          rows={2}
                          dir="rtl"
                          value={getVal(card.excerpt, 'ar')}
                          onChange={(e) => {
                            const copy = [...curatedItems];
                            copy[idx] = {
                              ...card,
                              excerpt: setVal(card.excerpt, 'ar', e.target.value),
                            };
                            onChangeCuratedItems(copy);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Card Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cardImg}
                        onChange={(e) => {
                          const copy = [...curatedItems];
                          copy[idx] = { ...card, image: e.target.value };
                          onChangeCuratedItems(copy);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker((url) => {
                            const copy = [...curatedItems];
                            copy[idx] = { ...card, image: url };
                            onChangeCuratedItems(copy);
                          }, 'image')
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-persici-crimson shrink-0 cursor-pointer"
                      >
                        <TbPhoto className="w-3.5 h-3.5" />
                        <span>Pick R2</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER 1: INDUSTRIES OVERVIEW HUB (`slug === 'industries'`)
  // =========================================================================
  if (isHub && hubData) {
    const updateHub = (patch: Partial<IndustriesHubCmsData>) => {
      setPageData((prev) => ({
        ...hubData,
        ...prev,
        ...patch,
      }));
    };

    return (
      <div className="space-y-5">
        {/* Top Quick-Switcher Bar across all 7 Industries Pages */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TbLayersSubtract className="w-4 h-4 text-persici-crimson" />
              <span>Industries Ecosystem Pages (Overview Hub + 6 Featured Industries)</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Click any page tab to configure its content, Client Stories &amp; Blogs
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {INDUSTRY_NAV_ITEMS.map((item) => {
              const active = item.slug === slug;
              return (
                <Link
                  key={item.slug}
                  href={`/${lang}/dashboard/pages/${item.slug}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-persici-crimson text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* SECTION 1: HERO BANNER & SEO */}
        <SectionAccordion
          number={1}
          title="SolutionsHeroSection • Hero Banner & SEO Metadata"
          description="Top breadcrumb tags, H1 headline, rich-text lead description, primary CTA, background image, and SEO metadata"
          isOpenDefault={true}
          onSave={onSave}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display Hero Banner Section
                </span>
                <span className="text-[11px] text-slate-500">
                  Toggle visibility of the top Hero section
                </span>
              </div>
              <input
                type="checkbox"
                checked={hubData.heroEnabled !== false}
                onChange={(e) => updateHub({ heroEnabled: e.target.checked })}
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Primary Tag (EN)
                </label>
                <input
                  type="text"
                  value={hubData.heroBadge.en}
                  onChange={(e) =>
                    updateHub({ heroBadge: { ...hubData.heroBadge, en: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  الشارة الرئيسية (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.heroBadge.ar}
                  onChange={(e) =>
                    updateHub({ heroBadge: { ...hubData.heroBadge, ar: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Secondary Tag (EN)
                </label>
                <input
                  type="text"
                  value={hubData.heroCtaSecondary?.en || ''}
                  onChange={(e) =>
                    updateHub({
                      heroCtaSecondary: {
                        ...(hubData.heroCtaSecondary || { en: '', ar: '' }),
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  الشارة الفرعية (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.heroCtaSecondary?.ar || ''}
                  onChange={(e) =>
                    updateHub({
                      heroCtaSecondary: {
                        ...(hubData.heroCtaSecondary || { en: '', ar: '' }),
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Hero Main Headline H1 (EN)
                </label>
                <input
                  type="text"
                  value={hubData.heroTitle.en}
                  onChange={(e) =>
                    updateHub({ heroTitle: { ...hubData.heroTitle, en: e.target.value } })
                  }
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  العنوان الرئيسي للواجهة (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.heroTitle.ar}
                  onChange={(e) =>
                    updateHub({ heroTitle: { ...hubData.heroTitle, ar: e.target.value } })
                  }
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Hero Subtitle / Lead Description"
              rows={3}
              valueEn={hubData.heroSubtitle.en}
              valueAr={hubData.heroSubtitle.ar}
              onChangeEn={(val) =>
                updateHub({ heroSubtitle: { ...hubData.heroSubtitle, en: val } })
              }
              onChangeAr={(val) =>
                updateHub({ heroSubtitle: { ...hubData.heroSubtitle, ar: val } })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Primary CTA Text (EN)
                </label>
                <input
                  type="text"
                  value={hubData.heroCtaPrimary.en}
                  onChange={(e) =>
                    updateHub({
                      heroCtaPrimary: { ...hubData.heroCtaPrimary, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  نص الزر الرئيسي (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.heroCtaPrimary.ar}
                  onChange={(e) =>
                    updateHub({
                      heroCtaPrimary: { ...hubData.heroCtaPrimary, ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Hero Image Asset (R2)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hubData.heroImage || ''}
                    onChange={(e) => updateHub({ heroImage: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((url) => updateHub({ heroImage: url }), 'image')
                    }
                    className="inline-flex items-center gap-1 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-persici-crimson shrink-0 cursor-pointer"
                  >
                    <TbPhoto className="w-4 h-4" />
                    <span>Pick R2</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="pt-4 border-t border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                SEO Meta Title &amp; Description
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    SEO Meta Title (EN)
                  </label>
                  <input
                    type="text"
                    value={hubData.seo?.title?.en || ''}
                    onChange={(e) =>
                      updateHub({
                        seo: {
                          ...hubData.seo!,
                          title: { ...hubData.seo!.title, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    عنوان SEO (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={hubData.seo?.title?.ar || ''}
                    onChange={(e) =>
                      updateHub({
                        seo: {
                          ...hubData.seo!,
                          title: { ...hubData.seo!.title, ar: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    SEO Meta Description (EN)
                  </label>
                  <textarea
                    rows={2}
                    value={hubData.seo?.description?.en || ''}
                    onChange={(e) =>
                      updateHub({
                        seo: {
                          ...hubData.seo!,
                          description: { ...hubData.seo!.description, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    وصف SEO (AR)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={hubData.seo?.description?.ar || ''}
                    onChange={(e) =>
                      updateHub({
                        seo: {
                          ...hubData.seo!,
                          description: { ...hubData.seo!.description, ar: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionAccordion>

        {/* SECTION 2: 6 TARGET INDUSTRIES GRID */}
        <SectionAccordion
          number={2}
          title="IndustriesOfferingsGrid • 6 Core Industry Cards"
          description="Section title, rich-text subtitle, and the 6 interactive industry cards with custom icons, vector diagrams, descriptions, and links"
          onSave={onSave}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display Target Industries Grid Section
                </span>
                <span className="text-[11px] text-slate-500">
                  Toggle visibility of the 6 Target Industries Grid
                </span>
              </div>
              <input
                type="checkbox"
                checked={hubData.offeringsEnabled !== false}
                onChange={(e) => updateHub({ offeringsEnabled: e.target.checked })}
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Industries Heading Title (EN)
                </label>
                <input
                  type="text"
                  value={hubData.offeringsTitle.en}
                  onChange={(e) =>
                    updateHub({
                      offeringsTitle: { ...hubData.offeringsTitle, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان القطاعات المستهدفة (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.offeringsTitle.ar}
                  onChange={(e) =>
                    updateHub({
                      offeringsTitle: { ...hubData.offeringsTitle, ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Industries Section Subtitle"
              rows={2}
              valueEn={hubData.offeringsSubtitle.en}
              valueAr={hubData.offeringsSubtitle.ar}
              onChangeEn={(val) =>
                updateHub({
                  offeringsSubtitle: { ...hubData.offeringsSubtitle, en: val },
                })
              }
              onChangeAr={(val) =>
                updateHub({
                  offeringsSubtitle: { ...hubData.offeringsSubtitle, ar: val },
                })
              }
            />

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Target Industry Cards ({hubData.offeringsList.length})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateHub({
                      offeringsList: [
                        ...hubData.offeringsList,
                        {
                          slug: `industry-${Date.now()}`,
                          tag: { en: 'Sector', ar: 'قطاع' },
                          title: { en: 'New Industry Sector', ar: 'قطاع صناعي جديد' },
                          description: { en: '', ar: '' },
                          icon: '/icons/industries/consumer-products.svg',
                          diagramType: 'grid-dots',
                          href: '/industries/consumer-products',
                          order: hubData.offeringsList.length + 1,
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson cursor-pointer"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Industry Card</span>
                </button>
              </div>

              {hubData.offeringsList.map((item, idx) => (
                <div
                  key={item.slug || idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        #{idx + 1}: {item.title.en}
                      </span>
                      <Link
                        href={`/${lang}/dashboard/pages/industries-${item.slug}`}
                        className="text-[11px] font-semibold text-persici-crimson hover:underline inline-flex items-center gap-1"
                      >
                        <span>Edit Full Page</span>
                        <TbExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() =>
                          updateHub({
                            offeringsList: moveItem(hubData.offeringsList, idx, 'up'),
                          })
                        }
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      >
                        <TbArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === hubData.offeringsList.length - 1}
                        onClick={() =>
                          updateHub({
                            offeringsList: moveItem(hubData.offeringsList, idx, 'down'),
                          })
                        }
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      >
                        <TbArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...hubData.offeringsList];
                          copy.splice(idx, 1);
                          updateHub({ offeringsList: copy });
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Tag (EN)
                      </label>
                      <input
                        type="text"
                        value={item.tag.en}
                        onChange={(e) => {
                          const copy = [...hubData.offeringsList];
                          copy[idx] = { ...item, tag: { ...item.tag, en: e.target.value } };
                          updateHub({ offeringsList: copy });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        الشارة (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={item.tag.ar}
                        onChange={(e) => {
                          const copy = [...hubData.offeringsList];
                          copy[idx] = { ...item, tag: { ...item.tag, ar: e.target.value } };
                          updateHub({ offeringsList: copy });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Vector Diagram Type
                      </label>
                      <select
                        value={item.diagramType}
                        onChange={(e) => {
                          const copy = [...hubData.offeringsList];
                          copy[idx] = {
                            ...item,
                            diagramType: e.target.value as SolutionDiagramType,
                          };
                          updateHub({ offeringsList: copy });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      >
                        {DIAGRAM_TYPES.map((dt) => (
                          <option key={dt} value={dt}>
                            {dt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Target Link (Href)
                      </label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => {
                          const copy = [...hubData.offeringsList];
                          copy[idx] = { ...item, href: e.target.value };
                          updateHub({ offeringsList: copy });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Title (EN)
                      </label>
                      <input
                        type="text"
                        value={item.title.en}
                        onChange={(e) => {
                          const copy = [...hubData.offeringsList];
                          copy[idx] = {
                            ...item,
                            title: { ...item.title, en: e.target.value },
                          };
                          updateHub({ offeringsList: copy });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        العنوان (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={item.title.ar}
                        onChange={(e) => {
                          const copy = [...hubData.offeringsList];
                          copy[idx] = {
                            ...item,
                            title: { ...item.title, ar: e.target.value },
                          };
                          updateHub({ offeringsList: copy });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Icon URL
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={item.icon || ''}
                          onChange={(e) => {
                            const copy = [...hubData.offeringsList];
                            copy[idx] = { ...item, icon: e.target.value };
                            updateHub({ offeringsList: copy });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            openMediaPicker((url) => {
                              const copy = [...hubData.offeringsList];
                              copy[idx] = { ...item, icon: url };
                              updateHub({ offeringsList: copy });
                            }, 'image')
                          }
                          className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                        >
                          Pick R2
                        </button>
                      </div>
                    </div>
                  </div>

                  <RichTextEditor
                    label={`Card #${idx + 1} Description`}
                    rows={2}
                    valueEn={item.description.en}
                    valueAr={item.description.ar}
                    onChangeEn={(val) => {
                      const copy = [...hubData.offeringsList];
                      copy[idx] = {
                        ...item,
                        description: { ...item.description, en: val },
                      };
                      updateHub({ offeringsList: copy });
                    }}
                    onChangeAr={(val) => {
                      const copy = [...hubData.offeringsList];
                      copy[idx] = {
                        ...item,
                        description: { ...item.description, ar: val },
                      };
                      updateHub({ offeringsList: copy });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </SectionAccordion>

        {/* SECTION 3: WHY IT MATTERS */}
        <SectionAccordion
          number={3}
          title="SolutionsWhyItMatters • Strategic Narrative & Velocity Metrics"
          description="Split narrative section with shaped image container, rich-text body, and 2 proof-point counters"
          onSave={onSave}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display Why It Matters Section
                </span>
              </div>
              <input
                type="checkbox"
                checked={hubData.whyItMattersEnabled !== false}
                onChange={(e) => updateHub({ whyItMattersEnabled: e.target.checked })}
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Section Title (EN)
                </label>
                <input
                  type="text"
                  value={hubData.whyItMattersTitle.en}
                  onChange={(e) =>
                    updateHub({
                      whyItMattersTitle: {
                        ...hubData.whyItMattersTitle,
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان القسم (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.whyItMattersTitle.ar}
                  onChange={(e) =>
                    updateHub({
                      whyItMattersTitle: {
                        ...hubData.whyItMattersTitle,
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Why It Matters Narrative Body"
              rows={3}
              valueEn={hubData.whyItMattersText.en}
              valueAr={hubData.whyItMattersText.ar}
              onChangeEn={(val) =>
                updateHub({
                  whyItMattersText: { ...hubData.whyItMattersText, en: val },
                })
              }
              onChangeAr={(val) =>
                updateHub({
                  whyItMattersText: { ...hubData.whyItMattersText, ar: val },
                })
              }
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Section Visual Image (R2)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hubData.whyItMattersImage}
                  onChange={(e) => updateHub({ whyItMattersImage: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    openMediaPicker(
                      (url) => updateHub({ whyItMattersImage: url }),
                      'image'
                    )
                  }
                  className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-persici-crimson shrink-0 cursor-pointer"
                >
                  <TbPhoto className="w-4 h-4" />
                  <span>Pick R2</span>
                </button>
              </div>
            </div>

            {/* Proof-Point Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Counter Metric #1
                </span>
                <input
                  type="text"
                  placeholder="Value (e.g. 3.4x)"
                  value={hubData.whyItMattersMetric1Val || '3.4x'}
                  onChange={(e) => updateHub({ whyItMattersMetric1Val: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Label (EN)"
                  value={hubData.whyItMattersMetric1Label?.en || ''}
                  onChange={(e) =>
                    updateHub({
                      whyItMattersMetric1Label: {
                        ...(hubData.whyItMattersMetric1Label || { en: '', ar: '' }),
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  dir="rtl"
                  placeholder="التسمية (AR)"
                  value={hubData.whyItMattersMetric1Label?.ar || ''}
                  onChange={(e) =>
                    updateHub({
                      whyItMattersMetric1Label: {
                        ...(hubData.whyItMattersMetric1Label || { en: '', ar: '' }),
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Counter Metric #2
                </span>
                <input
                  type="text"
                  placeholder="Value (e.g. -38%)"
                  value={hubData.whyItMattersMetric2Val || '-38%'}
                  onChange={(e) => updateHub({ whyItMattersMetric2Val: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Label (EN)"
                  value={hubData.whyItMattersMetric2Label?.en || ''}
                  onChange={(e) =>
                    updateHub({
                      whyItMattersMetric2Label: {
                        ...(hubData.whyItMattersMetric2Label || { en: '', ar: '' }),
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  dir="rtl"
                  placeholder="التسمية (AR)"
                  value={hubData.whyItMattersMetric2Label?.ar || ''}
                  onChange={(e) =>
                    updateHub({
                      whyItMattersMetric2Label: {
                        ...(hubData.whyItMattersMetric2Label || { en: '', ar: '' }),
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                />
              </div>
            </div>
          </div>
        </SectionAccordion>

        {/* SECTION 4: BENEFITS STRIP */}
        <SectionAccordion
          number={4}
          title="SolutionsBenefitsStrip • Wide Banner & 3 Strategic Pillars"
          description="Wide shaped banner image and 3 horizontal benefit columns with colored top accent bars"
          onSave={onSave}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                Display Benefits Strip Section
              </span>
              <input
                type="checkbox"
                checked={hubData.benefitsEnabled !== false}
                onChange={(e) => updateHub({ benefitsEnabled: e.target.checked })}
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Benefits Heading (EN)
                </label>
                <input
                  type="text"
                  value={hubData.benefitsTitle.en}
                  onChange={(e) =>
                    updateHub({
                      benefitsTitle: { ...hubData.benefitsTitle, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان المزايا (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.benefitsTitle.ar}
                  onChange={(e) =>
                    updateHub({
                      benefitsTitle: { ...hubData.benefitsTitle, ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Wide Banner Image (R2)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hubData.benefitsImage}
                  onChange={(e) => updateHub({ benefitsImage: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    openMediaPicker((url) => updateHub({ benefitsImage: url }), 'image')
                  }
                  className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-persici-crimson shrink-0 cursor-pointer"
                >
                  <TbPhoto className="w-4 h-4" />
                  <span>Pick R2</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {hubData.benefits.slice(0, 3).map((b, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Benefit Pillar #{idx + 1}
                    </span>
                    <input
                      type="color"
                      value={
                        b.accentColor ||
                        (idx === 0 ? '#D83427' : idx === 1 ? '#EF8C7D' : '#121212')
                      }
                      onChange={(e) => {
                        const copy = [...hubData.benefits];
                        copy[idx] = { ...b, accentColor: e.target.value };
                        updateHub({ benefits: copy });
                      }}
                      className="w-8 h-6 rounded border border-slate-300 cursor-pointer"
                      title="Top Indicator Bar Color"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Title (EN)"
                      value={b.title.en}
                      onChange={(e) => {
                        const copy = [...hubData.benefits];
                        copy[idx] = { ...b, title: { ...b.title, en: e.target.value } };
                        updateHub({ benefits: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      dir="rtl"
                      placeholder="العنوان (AR)"
                      value={b.title.ar}
                      onChange={(e) => {
                        const copy = [...hubData.benefits];
                        copy[idx] = { ...b, title: { ...b.title, ar: e.target.value } };
                        updateHub({ benefits: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                  <RichTextEditor
                    label={`Benefit #${idx + 1} Description`}
                    rows={2}
                    valueEn={b.description.en}
                    valueAr={b.description.ar}
                    onChangeEn={(val) => {
                      const copy = [...hubData.benefits];
                      copy[idx] = {
                        ...b,
                        description: { ...b.description, en: val },
                      };
                      updateHub({ benefits: copy });
                    }}
                    onChangeAr={(val) => {
                      const copy = [...hubData.benefits];
                      copy[idx] = {
                        ...b,
                        description: { ...b.description, ar: val },
                      };
                      updateHub({ benefits: copy });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </SectionAccordion>

        {/* SECTION 5: FEATURED CLIENT STORIES SELECTOR */}
        <SectionAccordion
          number={5}
          title="FeaturedClientStories • Dynamic Client Stories Selector"
          description="Select Client Stories by Custom Order, Category, or Featured status, and control the maximum number of stories shown"
          onSave={onSave}
        >
          {renderClientStoriesSelector(hubData.clientStoriesConfig!, (nextCfg) =>
            updateHub({ clientStoriesConfig: nextCfg })
          )}
        </SectionAccordion>

        {/* SECTION 6: DELIVERY ENGINE */}
        <SectionAccordion
          number={6}
          title="SolutionsDeliveryEngine • Execution Framework & Pillars"
          description="How We Deliver Differently section header, shaped image, and numbered execution pillars"
          onSave={onSave}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                Display Delivery Engine Section
              </span>
              <input
                type="checkbox"
                checked={hubData.deliveryEnabled !== false}
                onChange={(e) => updateHub({ deliveryEnabled: e.target.checked })}
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Eyebrow Badge (EN)
                </label>
                <input
                  type="text"
                  value={hubData.deliveryBadge?.en || ''}
                  onChange={(e) =>
                    updateHub({
                      deliveryBadge: {
                        ...(hubData.deliveryBadge || { en: '', ar: '' }),
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  الشارة العلوية (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.deliveryBadge?.ar || ''}
                  onChange={(e) =>
                    updateHub({
                      deliveryBadge: {
                        ...(hubData.deliveryBadge || { en: '', ar: '' }),
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Delivery Title (EN)
                </label>
                <input
                  type="text"
                  value={hubData.deliveryTitle.en}
                  onChange={(e) =>
                    updateHub({
                      deliveryTitle: { ...hubData.deliveryTitle, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان منهجية التسليم (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.deliveryTitle.ar}
                  onChange={(e) =>
                    updateHub({
                      deliveryTitle: { ...hubData.deliveryTitle, ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Delivery Subtitle"
              rows={2}
              valueEn={hubData.deliverySubtitle.en}
              valueAr={hubData.deliverySubtitle.ar}
              onChangeEn={(val) =>
                updateHub({
                  deliverySubtitle: { ...hubData.deliverySubtitle, en: val },
                })
              }
              onChangeAr={(val) =>
                updateHub({
                  deliverySubtitle: { ...hubData.deliverySubtitle, ar: val },
                })
              }
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Delivery Image (R2)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hubData.deliveryImage}
                  onChange={(e) => updateHub({ deliveryImage: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    openMediaPicker((url) => updateHub({ deliveryImage: url }), 'image')
                  }
                  className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-persici-crimson shrink-0 cursor-pointer"
                >
                  <TbPhoto className="w-4 h-4" />
                  <span>Pick R2</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Execution Pillars ({hubData.deliveryPillars.length})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateHub({
                      deliveryPillars: [
                        ...hubData.deliveryPillars,
                        {
                          title: { en: 'New Execution Pillar', ar: 'ركيزة تنفيذية جديدة' },
                          description: { en: '', ar: '' },
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson cursor-pointer"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Pillar</span>
                </button>
              </div>

              {hubData.deliveryPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Pillar #0{idx + 1}: {pillar.title.en}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...hubData.deliveryPillars];
                        copy.splice(idx, 1);
                        updateHub({ deliveryPillars: copy });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={pillar.title.en}
                      onChange={(e) => {
                        const copy = [...hubData.deliveryPillars];
                        copy[idx] = {
                          ...pillar,
                          title: { ...pillar.title, en: e.target.value },
                        };
                        updateHub({ deliveryPillars: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      dir="rtl"
                      value={pillar.title.ar}
                      onChange={(e) => {
                        const copy = [...hubData.deliveryPillars];
                        copy[idx] = {
                          ...pillar,
                          title: { ...pillar.title, ar: e.target.value },
                        };
                        updateHub({ deliveryPillars: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                  <RichTextEditor
                    label={`Pillar #0${idx + 1} Description`}
                    rows={2}
                    valueEn={pillar.description.en}
                    valueAr={pillar.description.ar}
                    onChangeEn={(val) => {
                      const copy = [...hubData.deliveryPillars];
                      copy[idx] = {
                        ...pillar,
                        description: { ...pillar.description, en: val },
                      };
                      updateHub({ deliveryPillars: copy });
                    }}
                    onChangeAr={(val) => {
                      const copy = [...hubData.deliveryPillars];
                      copy[idx] = {
                        ...pillar,
                        description: { ...pillar.description, ar: val },
                      };
                      updateHub({ deliveryPillars: copy });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </SectionAccordion>

        {/* SECTION 7: BLOGS / INSIGHTS CAROUSEL SELECTOR */}
        <SectionAccordion
          number={7}
          title="InsightsSection • Dynamic Blogs & Insights Carousel Selector"
          description="Select Blogs by Custom Order, Category, or Featured status, and control the maximum number of blogs in the carousel"
          onSave={onSave}
        >
          {renderInsightsSelector(
            hubData.insightsConfig!,
            hubData.insightsList,
            (nextCfg) =>
              updateHub({
                insightsConfig: nextCfg,
                insightsTitle: nextCfg.title,
                insightsSubtitle: nextCfg.subtitle,
                insightsCtaText: nextCfg.ctaText,
              }),
            (nextItems) => updateHub({ insightsList: nextItems })
          )}
        </SectionAccordion>

        {/* SECTION 8: CLIENT REVIEW QUOTE */}
        <SectionAccordion
          number={8}
          title="ClientReviewSection • Executive Client Testimonial"
          description="Monospace typographic client quote with crimson border accent and author attribution"
          onSave={onSave}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                Display Client Review Quote Section
              </span>
              <input
                type="checkbox"
                checked={hubData.quoteEnabled !== false}
                onChange={(e) => updateHub({ quoteEnabled: e.target.checked })}
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Eyebrow Badge (EN)
                </label>
                <input
                  type="text"
                  value={hubData.quoteBadge?.en || ''}
                  onChange={(e) =>
                    updateHub({
                      quoteBadge: {
                        ...(hubData.quoteBadge || { en: '', ar: '' }),
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  شارة الاقتباس (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.quoteBadge?.ar || ''}
                  onChange={(e) =>
                    updateHub({
                      quoteBadge: {
                        ...(hubData.quoteBadge || { en: '', ar: '' }),
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Client Testimonial Quotation"
              rows={3}
              valueEn={hubData.quoteText.en}
              valueAr={hubData.quoteText.ar}
              onChangeEn={(val) =>
                updateHub({ quoteText: { ...hubData.quoteText, en: val } })
              }
              onChangeAr={(val) =>
                updateHub({ quoteText: { ...hubData.quoteText, ar: val } })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={hubData.quoteAuthor}
                  onChange={(e) => updateHub({ quoteAuthor: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Author Role (EN)
                </label>
                <input
                  type="text"
                  value={hubData.quoteRole.en}
                  onChange={(e) =>
                    updateHub({
                      quoteRole: { ...hubData.quoteRole, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  المنصب الوظيفي (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.quoteRole.ar}
                  onChange={(e) =>
                    updateHub({
                      quoteRole: { ...hubData.quoteRole, ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>
          </div>
        </SectionAccordion>

        {/* SECTION 9: FAQS */}
        <SectionAccordion
          number={9}
          title="FaqSection • Frequently Asked Questions Accordion"
          description="Manage FAQ heading, rich-text subtitle, and expandable Q&A items"
          onSave={onSave}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                Display FAQs Section
              </span>
              <input
                type="checkbox"
                checked={hubData.faqsEnabled !== false}
                onChange={(e) => updateHub({ faqsEnabled: e.target.checked })}
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  FAQ Title (EN)
                </label>
                <input
                  type="text"
                  value={hubData.faqsTitle.en}
                  onChange={(e) =>
                    updateHub({
                      faqsTitle: { ...hubData.faqsTitle, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان الأسئلة الشائعة (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.faqsTitle.ar}
                  onChange={(e) =>
                    updateHub({
                      faqsTitle: { ...hubData.faqsTitle, ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="FAQ Section Subtitle"
              rows={2}
              valueEn={hubData.faqsSubtitle.en}
              valueAr={hubData.faqsSubtitle.ar}
              onChangeEn={(val) =>
                updateHub({
                  faqsSubtitle: { ...hubData.faqsSubtitle, en: val },
                })
              }
              onChangeAr={(val) =>
                updateHub({
                  faqsSubtitle: { ...hubData.faqsSubtitle, ar: val },
                })
              }
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  FAQ Items ({hubData.faqs.length})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateHub({
                      faqs: [
                        ...hubData.faqs,
                        {
                          question: { en: 'New Question?', ar: 'سؤال جديد؟' },
                          answer: { en: '', ar: '' },
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson cursor-pointer"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              {hubData.faqs.map((fq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Q#{idx + 1}: {fq.question.en}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() =>
                          updateHub({ faqs: moveItem(hubData.faqs, idx, 'up') })
                        }
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      >
                        <TbArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === hubData.faqs.length - 1}
                        onClick={() =>
                          updateHub({ faqs: moveItem(hubData.faqs, idx, 'down') })
                        }
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      >
                        <TbArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...hubData.faqs];
                          copy.splice(idx, 1);
                          updateHub({ faqs: copy });
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={fq.question.en}
                      onChange={(e) => {
                        const copy = [...hubData.faqs];
                        copy[idx] = {
                          ...fq,
                          question: { ...fq.question, en: e.target.value },
                        };
                        updateHub({ faqs: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      dir="rtl"
                      value={fq.question.ar}
                      onChange={(e) => {
                        const copy = [...hubData.faqs];
                        copy[idx] = {
                          ...fq,
                          question: { ...fq.question, ar: e.target.value },
                        };
                        updateHub({ faqs: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                  <RichTextEditor
                    label={`FAQ #${idx + 1} Answer`}
                    rows={2}
                    valueEn={fq.answer.en}
                    valueAr={fq.answer.ar}
                    onChangeEn={(val) => {
                      const copy = [...hubData.faqs];
                      copy[idx] = {
                        ...fq,
                        answer: { ...fq.answer, en: val },
                      };
                      updateHub({ faqs: copy });
                    }}
                    onChangeAr={(val) => {
                      const copy = [...hubData.faqs];
                      copy[idx] = {
                        ...fq,
                        answer: { ...fq.answer, ar: val },
                      };
                      updateHub({ faqs: copy });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </SectionAccordion>

        {/* SHARED CONTACT BANNER */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <TbForms className="w-4 h-4" />
              <span>Global Shared Contact &amp; Lead Form</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              The bottom contact form is shared across all pages. You can toggle its visibility on
              this page or edit its global fields in the Shared Contact editor.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-white cursor-pointer">
              <input
                type="checkbox"
                checked={hubData.contactEnabled !== false}
                onChange={(e) => updateHub({ contactEnabled: e.target.checked })}
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
              <span>Show on Page</span>
            </label>
            <Link
              href={`/${lang}/dashboard/shared-contact`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
            >
              <span>Edit Shared Contact</span>
              <TbChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER 2: 6 FEATURED INDUSTRY PAGES (`slug.startsWith('industries-')`)
  // =========================================================================
  if (!featData) return null;

  const updateFeat = (patch: Partial<IndustryFeatureCmsData>) => {
    setPageData((prev) => ({
      ...featData,
      ...prev,
      ...patch,
    }));
  };

  return (
    <div className="space-y-5">
      {/* Top Quick-Switcher Bar across all 7 Industries Pages */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <TbLayersSubtract className="w-4 h-4 text-persici-crimson" />
            <span>Industries Ecosystem Pages (Overview Hub + 6 Featured Industries)</span>
          </span>
          <span className="text-[11px] text-slate-500">
            Click any page tab to configure its content, Client Stories &amp; Blogs
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {INDUSTRY_NAV_ITEMS.map((item) => {
            const active = item.slug === slug;
            return (
              <Link
                key={item.slug}
                href={`/${lang}/dashboard/pages/${item.slug}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-persici-crimson text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: HERO BANNER & SEO */}
      <SectionAccordion
        number={1}
        title="SolutionsHeroSection • Hero Banner, Highlights & SEO Metadata"
        description="Breadcrumb tags, H1 headline, rich-text subtitle with alignment, CTA button, background image, key highlights, and SEO metadata"
        isOpenDefault={true}
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display Hero Banner Section
            </span>
            <input
              type="checkbox"
              checked={featData.hero.enabled !== false}
              onChange={(e) =>
                updateFeat({ hero: { ...featData.hero, enabled: e.target.checked } })
              }
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Primary Tag (EN)
              </label>
              <input
                type="text"
                value={featData.hero.tag.en}
                onChange={(e) =>
                  updateFeat({
                    hero: {
                      ...featData.hero,
                      tag: { ...featData.hero.tag, en: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                الشارة الرئيسية (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.hero.tag.ar}
                onChange={(e) =>
                  updateFeat({
                    hero: {
                      ...featData.hero,
                      tag: { ...featData.hero.tag, ar: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Secondary Breadcrumb Tag (EN)
              </label>
              <input
                type="text"
                value={featData.hero.secondaryTag.en}
                onChange={(e) =>
                  updateFeat({
                    hero: {
                      ...featData.hero,
                      secondaryTag: {
                        ...featData.hero.secondaryTag,
                        en: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                الشارة الفرعية (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.hero.secondaryTag.ar}
                onChange={(e) =>
                  updateFeat({
                    hero: {
                      ...featData.hero,
                      secondaryTag: {
                        ...featData.hero.secondaryTag,
                        ar: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hero Headline H1 (EN)
              </label>
              <input
                type="text"
                value={featData.hero.title.en}
                onChange={(e) =>
                  updateFeat({
                    hero: {
                      ...featData.hero,
                      title: { ...featData.hero.title, en: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                العنوان الرئيسي للواجهة (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.hero.title.ar}
                onChange={(e) =>
                  updateFeat({
                    hero: {
                      ...featData.hero,
                      title: { ...featData.hero.title, ar: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Hero Subtitle / Description"
            rows={3}
            valueEn={featData.hero.subtitle.en}
            valueAr={featData.hero.subtitle.ar}
            onChangeEn={(val) =>
              updateFeat({
                hero: {
                  ...featData.hero,
                  subtitle: { ...featData.hero.subtitle, en: val },
                },
              })
            }
            onChangeAr={(val) =>
              updateFeat({
                hero: {
                  ...featData.hero,
                  subtitle: { ...featData.hero.subtitle, ar: val },
                },
              })
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                CTA Text (EN)
              </label>
              <input
                type="text"
                value={featData.hero.ctaText.en}
                onChange={(e) =>
                  updateFeat({
                    hero: {
                      ...featData.hero,
                      ctaText: { ...featData.hero.ctaText, en: e.target.value },
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                نص الزر (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.hero.ctaText.ar}
                onChange={(e) =>
                  updateFeat({
                    hero: {
                      ...featData.hero,
                      ctaText: { ...featData.hero.ctaText, ar: e.target.value },
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                CTA Target Link
              </label>
              <input
                type="text"
                value={featData.hero.ctaHref}
                onChange={(e) =>
                  updateFeat({
                    hero: { ...featData.hero, ctaHref: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hero Image (R2)
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={featData.hero.image}
                  onChange={(e) =>
                    updateFeat({
                      hero: { ...featData.hero, image: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    openMediaPicker(
                      (url) =>
                        updateFeat({
                          hero: { ...featData.hero, image: url },
                        }),
                      'image'
                    )
                  }
                  className="px-2.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-persici-crimson shrink-0 cursor-pointer"
                >
                  Pick R2
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Hero Key Highlights (EN — One per line)
              </label>
              <textarea
                rows={3}
                value={(featData.hero.highlights || []).map((h) => h.en).join('\n')}
                onChange={(e) => {
                  const lines = e.target.value.split('\n');
                  const current = featData.hero.highlights || [];
                  const maxLen = Math.max(lines.length, current.length);
                  const nextHighlights: LocalizedString[] = [];
                  for (let i = 0; i < maxLen; i++) {
                    const enVal = lines[i] ?? '';
                    const arVal = current[i]?.ar ?? '';
                    if (enVal.trim() || arVal.trim()) {
                      nextHighlights.push({ en: enVal, ar: arVal });
                    }
                  }
                  updateFeat({
                    hero: {
                      ...featData.hero,
                      highlights: nextHighlights,
                    },
                  });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                أبرز النقاط في الواجهة (AR — سطر لكل نقطة)
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={(featData.hero.highlights || []).map((h) => h.ar).join('\n')}
                onChange={(e) => {
                  const lines = e.target.value.split('\n');
                  const current = featData.hero.highlights || [];
                  const maxLen = Math.max(lines.length, current.length);
                  const nextHighlights: LocalizedString[] = [];
                  for (let i = 0; i < maxLen; i++) {
                    const enVal = current[i]?.en ?? '';
                    const arVal = lines[i] ?? '';
                    if (enVal.trim() || arVal.trim()) {
                      nextHighlights.push({ en: enVal, ar: arVal });
                    }
                  }
                  updateFeat({
                    hero: {
                      ...featData.hero,
                      highlights: nextHighlights,
                    },
                  });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="pt-4 border-t border-slate-200/80 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              SEO Meta Title &amp; Description
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  SEO Meta Title (EN)
                </label>
                <input
                  type="text"
                  value={featData.seo.title.en}
                  onChange={(e) =>
                    updateFeat({
                      seo: {
                        ...featData.seo,
                        title: { ...featData.seo.title, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  عنوان SEO (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={featData.seo.title.ar}
                  onChange={(e) =>
                    updateFeat({
                      seo: {
                        ...featData.seo,
                        title: { ...featData.seo.title, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  SEO Meta Description (EN)
                </label>
                <textarea
                  rows={2}
                  value={featData.seo.description.en}
                  onChange={(e) =>
                    updateFeat({
                      seo: {
                        ...featData.seo,
                        description: { ...featData.seo.description, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  وصف SEO (AR)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={featData.seo.description.ar}
                  onChange={(e) =>
                    updateFeat({
                      seo: {
                        ...featData.seo,
                        description: { ...featData.seo.description, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 2: MARKET REALITIES & PANORAMIC CAROUSEL (futureStrip) */}
      <SectionAccordion
        number={2}
        title="IndustryRealitiesSection • Market Realities & Panoramic Carousel"
        description="Industry market realities header, rich-text lead, and panoramic future trend cards with full-bleed visuals"
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <TbWorld className="w-4 h-4 text-persici-crimson" />
              <span>Display Market Realities &amp; Panoramic Carousel Section</span>
            </span>
            <input
              type="checkbox"
              checked={featData.realities.enabled !== false}
              onChange={(e) =>
                updateFeat({
                  realities: { ...featData.realities, enabled: e.target.checked },
                })
              }
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Eyebrow Badge (EN)
              </label>
              <input
                type="text"
                value={featData.realities.badge?.en || ''}
                onChange={(e) =>
                  updateFeat({
                    realities: {
                      ...featData.realities,
                      badge: {
                        ...(featData.realities.badge || { en: '', ar: '' }),
                        en: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                الشارة العلوية (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.realities.badge?.ar || ''}
                onChange={(e) =>
                  updateFeat({
                    realities: {
                      ...featData.realities,
                      badge: {
                        ...(featData.realities.badge || { en: '', ar: '' }),
                        ar: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Realities Title (EN)
              </label>
              <input
                type="text"
                value={featData.realities.title.en}
                onChange={(e) =>
                  updateFeat({
                    realities: {
                      ...featData.realities,
                      title: { ...featData.realities.title, en: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان واقع السوق (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.realities.title.ar}
                onChange={(e) =>
                  updateFeat({
                    realities: {
                      ...featData.realities,
                      title: { ...featData.realities.title, ar: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Realities Section Subtitle"
            rows={2}
            valueEn={featData.realities.subtitle.en}
            valueAr={featData.realities.subtitle.ar}
            onChangeEn={(val) =>
              updateFeat({
                realities: {
                  ...featData.realities,
                  subtitle: { ...featData.realities.subtitle, en: val },
                },
              })
            }
            onChangeAr={(val) =>
              updateFeat({
                realities: {
                  ...featData.realities,
                  subtitle: { ...featData.realities.subtitle, ar: val },
                },
              })
            }
          />

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Panoramic Future Trend Slides ({featData.futureStrip.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  updateFeat({
                    futureStrip: [
                      ...featData.futureStrip,
                      {
                        badge: { en: 'Strategic Shift', ar: 'تحول استراتيجي' },
                        title: { en: 'New Market Reality', ar: 'واقع سوقي جديد' },
                        description: { en: '', ar: '' },
                        image: '/images/industry/consumer-products/future-1.jpg',
                        href: '#contact',
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson cursor-pointer"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>Add Trend Slide</span>
              </button>
            </div>

            {featData.futureStrip.map((slide, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-900">
                    Slide #{idx + 1}: {slide.title.en}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() =>
                        updateFeat({
                          futureStrip: moveItem(featData.futureStrip, idx, 'up'),
                        })
                      }
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    >
                      <TbArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === featData.futureStrip.length - 1}
                      onClick={() =>
                        updateFeat({
                          futureStrip: moveItem(featData.futureStrip, idx, 'down'),
                        })
                      }
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    >
                      <TbArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...featData.futureStrip];
                        copy.splice(idx, 1);
                        updateFeat({ futureStrip: copy });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Badge (EN)
                    </label>
                    <input
                      type="text"
                      value={slide.badge.en}
                      onChange={(e) => {
                        const copy = [...featData.futureStrip];
                        copy[idx] = {
                          ...slide,
                          badge: { ...slide.badge, en: e.target.value },
                        };
                        updateFeat({ futureStrip: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      الشارة (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={slide.badge.ar}
                      onChange={(e) => {
                        const copy = [...featData.futureStrip];
                        copy[idx] = {
                          ...slide,
                          badge: { ...slide.badge, ar: e.target.value },
                        };
                        updateFeat({ futureStrip: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Target Link (Href)
                    </label>
                    <input
                      type="text"
                      value={slide.href || ''}
                      onChange={(e) => {
                        const copy = [...featData.futureStrip];
                        copy[idx] = { ...slide, href: e.target.value };
                        updateFeat({ futureStrip: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Slide Image (R2)
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={slide.image}
                        onChange={(e) => {
                          const copy = [...featData.futureStrip];
                          copy[idx] = { ...slide, image: e.target.value };
                          updateFeat({ futureStrip: copy });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker((url) => {
                            const copy = [...featData.futureStrip];
                            copy[idx] = { ...slide, image: url };
                            updateFeat({ futureStrip: copy });
                          }, 'image')
                        }
                        className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        R2
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Title (EN)"
                    value={slide.title.en}
                    onChange={(e) => {
                      const copy = [...featData.futureStrip];
                      copy[idx] = {
                        ...slide,
                        title: { ...slide.title, en: e.target.value },
                      };
                      updateFeat({ futureStrip: copy });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="العنوان (AR)"
                    value={slide.title.ar}
                    onChange={(e) => {
                      const copy = [...featData.futureStrip];
                      copy[idx] = {
                        ...slide,
                        title: { ...slide.title, ar: e.target.value },
                      };
                      updateFeat({ futureStrip: copy });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg font-arabic"
                  />
                </div>

                <RichTextEditor
                  label={`Slide #${idx + 1} Description`}
                  rows={2}
                  valueEn={slide.description.en}
                  valueAr={slide.description.ar}
                  onChangeEn={(val) => {
                    const copy = [...featData.futureStrip];
                    copy[idx] = {
                      ...slide,
                      description: { ...slide.description, en: val },
                    };
                    updateFeat({ futureStrip: copy });
                  }}
                  onChangeAr={(val) => {
                    const copy = [...featData.futureStrip];
                    copy[idx] = {
                      ...slide,
                      description: { ...slide.description, ar: val },
                    };
                    updateFeat({ futureStrip: copy });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 3: ARCHITECTURAL BLUEPRINT (IndustryAgileFoundation) */}
      <SectionAccordion
        number={3}
        title="IndustryAgileFoundation • 3-Layer Architectural Blueprint & SVG Stack"
        description="Interactive 3-layer isometric SVG architecture diagram, section badges, title, rich-text lead, and 3 synchronized architectural pillars"
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <TbCpu className="w-4 h-4 text-persici-crimson" />
              <span>Display 3-Layer Architectural Blueprint Section</span>
            </span>
            <input
              type="checkbox"
              checked={featData.agileFoundation.enabled !== false}
              onChange={(e) =>
                updateFeat({
                  agileFoundation: {
                    ...featData.agileFoundation,
                    enabled: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Section Eyebrow Badge (EN)
              </label>
              <input
                type="text"
                value={featData.agileFoundation.sectionBadge?.en || ''}
                onChange={(e) =>
                  updateFeat({
                    agileFoundation: {
                      ...featData.agileFoundation,
                      sectionBadge: {
                        ...(featData.agileFoundation.sectionBadge || { en: '', ar: '' }),
                        en: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                شارة القسم العلوية (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.agileFoundation.sectionBadge?.ar || ''}
                onChange={(e) =>
                  updateFeat({
                    agileFoundation: {
                      ...featData.agileFoundation,
                      sectionBadge: {
                        ...(featData.agileFoundation.sectionBadge || { en: '', ar: '' }),
                        ar: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                SVG Diagram Badge (EN)
              </label>
              <input
                type="text"
                value={featData.agileFoundation.diagramBadge.en}
                onChange={(e) =>
                  updateFeat({
                    agileFoundation: {
                      ...featData.agileFoundation,
                      diagramBadge: {
                        ...featData.agileFoundation.diagramBadge,
                        en: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                شارة المخطط الهندسي (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.agileFoundation.diagramBadge.ar}
                onChange={(e) =>
                  updateFeat({
                    agileFoundation: {
                      ...featData.agileFoundation,
                      diagramBadge: {
                        ...featData.agileFoundation.diagramBadge,
                        ar: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Blueprint Title (EN)
              </label>
              <input
                type="text"
                value={featData.agileFoundation.title.en}
                onChange={(e) =>
                  updateFeat({
                    agileFoundation: {
                      ...featData.agileFoundation,
                      title: { ...featData.agileFoundation.title, en: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان المخطط المعماري (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.agileFoundation.title.ar}
                onChange={(e) =>
                  updateFeat({
                    agileFoundation: {
                      ...featData.agileFoundation,
                      title: { ...featData.agileFoundation.title, ar: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Blueprint Subtitle / Description"
            rows={2}
            valueEn={featData.agileFoundation.subtitle.en}
            valueAr={featData.agileFoundation.subtitle.ar}
            onChangeEn={(val) =>
              updateFeat({
                agileFoundation: {
                  ...featData.agileFoundation,
                  subtitle: { ...featData.agileFoundation.subtitle, en: val },
                },
              })
            }
            onChangeAr={(val) =>
              updateFeat({
                agileFoundation: {
                  ...featData.agileFoundation,
                  subtitle: { ...featData.agileFoundation.subtitle, ar: val },
                },
              })
            }
          />

          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
              3 Architectural Layers ({featData.agileFoundation.pillars.length})
            </span>

            {featData.agileFoundation.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-900">
                    Layer #{pillar.number || `0${idx + 1}`}: {pillar.title.en}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Pillar Title (EN)
                    </label>
                    <input
                      type="text"
                      value={pillar.title.en}
                      onChange={(e) => {
                        const copy = [...featData.agileFoundation.pillars];
                        copy[idx] = {
                          ...pillar,
                          title: { ...pillar.title, en: e.target.value },
                        };
                        updateFeat({
                          agileFoundation: {
                            ...featData.agileFoundation,
                            pillars: copy,
                          },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      عنوان الركيزة (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={pillar.title.ar}
                      onChange={(e) => {
                        const copy = [...featData.agileFoundation.pillars];
                        copy[idx] = {
                          ...pillar,
                          title: { ...pillar.title, ar: e.target.value },
                        };
                        updateFeat({
                          agileFoundation: {
                            ...featData.agileFoundation,
                            pillars: copy,
                          },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg font-arabic"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      SVG Isometric Layer Short Label (EN)
                    </label>
                    <input
                      type="text"
                      value={pillar.diagramTitle?.en || pillar.title.en}
                      onChange={(e) => {
                        const copy = [...featData.agileFoundation.pillars];
                        copy[idx] = {
                          ...pillar,
                          diagramTitle: {
                            ...(pillar.diagramTitle || pillar.title),
                            en: e.target.value,
                          },
                        };
                        updateFeat({
                          agileFoundation: {
                            ...featData.agileFoundation,
                            pillars: copy,
                          },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      تسمية الطبقة في المخطط (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={pillar.diagramTitle?.ar || pillar.title.ar}
                      onChange={(e) => {
                        const copy = [...featData.agileFoundation.pillars];
                        copy[idx] = {
                          ...pillar,
                          diagramTitle: {
                            ...(pillar.diagramTitle || pillar.title),
                            ar: e.target.value,
                          },
                        };
                        updateFeat({
                          agileFoundation: {
                            ...featData.agileFoundation,
                            pillars: copy,
                          },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                    />
                  </div>
                </div>

                <RichTextEditor
                  label={`Layer #${pillar.number || idx + 1} Description`}
                  rows={2}
                  valueEn={pillar.description.en}
                  valueAr={pillar.description.ar}
                  onChangeEn={(val) => {
                    const copy = [...featData.agileFoundation.pillars];
                    copy[idx] = {
                      ...pillar,
                      description: { ...pillar.description, en: val },
                    };
                    updateFeat({
                      agileFoundation: {
                        ...featData.agileFoundation,
                        pillars: copy,
                      },
                    });
                  }}
                  onChangeAr={(val) => {
                    const copy = [...featData.agileFoundation.pillars];
                    copy[idx] = {
                      ...pillar,
                      description: { ...pillar.description, ar: val },
                    };
                    updateFeat({
                      agileFoundation: {
                        ...featData.agileFoundation,
                        pillars: copy,
                      },
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 4: CORE CAPABILITIES / OFFERINGS GRID */}
      <SectionAccordion
        number={4}
        title="OfferingsGrid • Core Capabilities & Sub-Services (6 Cards)"
        description="Eyebrow badge, section title, rich-text subtitle, and capability cards with tags, icons, animated vector diagrams, descriptions, and highlight pills"
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display Core Capabilities Grid Section
            </span>
            <input
              type="checkbox"
              checked={featData.offeringsEnabled !== false}
              onChange={(e) => updateFeat({ offeringsEnabled: e.target.checked })}
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Eyebrow Badge (EN)
              </label>
              <input
                type="text"
                value={featData.offeringsBadge?.en || ''}
                onChange={(e) =>
                  updateFeat({
                    offeringsBadge: {
                      ...(featData.offeringsBadge || { en: '', ar: '' }),
                      en: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                الشارة العلوية (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.offeringsBadge?.ar || ''}
                onChange={(e) =>
                  updateFeat({
                    offeringsBadge: {
                      ...(featData.offeringsBadge || { en: '', ar: '' }),
                      ar: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Section Title (EN)
              </label>
              <input
                type="text"
                value={featData.offeringsTitle.en}
                onChange={(e) =>
                  updateFeat({
                    offeringsTitle: { ...featData.offeringsTitle, en: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان القدرات (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.offeringsTitle.ar}
                onChange={(e) =>
                  updateFeat({
                    offeringsTitle: { ...featData.offeringsTitle, ar: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Capabilities Subtitle"
            rows={2}
            valueEn={featData.offeringsSubtitle.en}
            valueAr={featData.offeringsSubtitle.ar}
            onChangeEn={(val) =>
              updateFeat({
                offeringsSubtitle: { ...featData.offeringsSubtitle, en: val },
              })
            }
            onChangeAr={(val) =>
              updateFeat({
                offeringsSubtitle: { ...featData.offeringsSubtitle, ar: val },
              })
            }
          />

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Capability Cards ({featData.offerings.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  updateFeat({
                    offerings: [
                      ...featData.offerings,
                      {
                        slug: `cap-${Date.now()}`,
                        tag: { en: 'Capability', ar: 'قدرة متقدمة' },
                        title: { en: 'New Capability', ar: 'قدرة جديدة' },
                        description: { en: '', ar: '' },
                        icon: '/icons/industries/consumer-products.svg',
                        diagramType: 'grid-dots',
                        highlights: {
                          en: ['Highlight 1', 'Highlight 2', 'Highlight 3'],
                          ar: ['ميزة ١', 'ميزة ٢', 'ميزة ٣'],
                        },
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson cursor-pointer"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>Add Capability Card</span>
              </button>
            </div>

            {featData.offerings.map((card, idx) => (
              <div
                key={card.slug || idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-900">
                    Capability #{idx + 1}: {card.title.en}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() =>
                        updateFeat({
                          offerings: moveItem(featData.offerings, idx, 'up'),
                        })
                      }
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    >
                      <TbArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === featData.offerings.length - 1}
                      onClick={() =>
                        updateFeat({
                          offerings: moveItem(featData.offerings, idx, 'down'),
                        })
                      }
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    >
                      <TbArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...featData.offerings];
                        copy.splice(idx, 1);
                        updateFeat({ offerings: copy });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Tag (EN)
                    </label>
                    <input
                      type="text"
                      value={card.tag.en}
                      onChange={(e) => {
                        const copy = [...featData.offerings];
                        copy[idx] = { ...card, tag: { ...card.tag, en: e.target.value } };
                        updateFeat({ offerings: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      الشارة (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={card.tag.ar}
                      onChange={(e) => {
                        const copy = [...featData.offerings];
                        copy[idx] = { ...card, tag: { ...card.tag, ar: e.target.value } };
                        updateFeat({ offerings: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Vector Diagram
                    </label>
                    <select
                      value={card.diagramType}
                      onChange={(e) => {
                        const copy = [...featData.offerings];
                        copy[idx] = {
                          ...card,
                          diagramType: e.target.value as SolutionDiagramType,
                        };
                        updateFeat({ offerings: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    >
                      {DIAGRAM_TYPES.map((dt) => (
                        <option key={dt} value={dt}>
                          {dt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Icon Asset (R2)
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={card.icon}
                        onChange={(e) => {
                          const copy = [...featData.offerings];
                          copy[idx] = { ...card, icon: e.target.value };
                          updateFeat({ offerings: copy });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker((url) => {
                            const copy = [...featData.offerings];
                            copy[idx] = { ...card, icon: url };
                            updateFeat({ offerings: copy });
                          }, 'image')
                        }
                        className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        R2
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Title (EN)
                    </label>
                    <input
                      type="text"
                      value={card.title.en}
                      onChange={(e) => {
                        const copy = [...featData.offerings];
                        copy[idx] = {
                          ...card,
                          title: { ...card.title, en: e.target.value },
                        };
                        updateFeat({ offerings: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      العنوان (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={card.title.ar}
                      onChange={(e) => {
                        const copy = [...featData.offerings];
                        copy[idx] = {
                          ...card,
                          title: { ...card.title, ar: e.target.value },
                        };
                        updateFeat({ offerings: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg font-arabic"
                    />
                  </div>
                </div>

                <RichTextEditor
                  label={`Card #${idx + 1} Description`}
                  rows={2}
                  valueEn={card.description.en}
                  valueAr={card.description.ar}
                  onChangeEn={(val) => {
                    const copy = [...featData.offerings];
                    copy[idx] = {
                      ...card,
                      description: { ...card.description, en: val },
                    };
                    updateFeat({ offerings: copy });
                  }}
                  onChangeAr={(val) => {
                    const copy = [...featData.offerings];
                    copy[idx] = {
                      ...card,
                      description: { ...card.description, ar: val },
                    };
                    updateFeat({ offerings: copy });
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Highlights / Bullet Points (EN — One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(card.highlights.en || []).join('\n')}
                      onChange={(e) => {
                        const copy = [...featData.offerings];
                        copy[idx] = {
                          ...card,
                          highlights: {
                            ...card.highlights,
                            en: e.target.value.split('\n').filter((s) => s.trim()),
                          },
                        };
                        updateFeat({ offerings: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      أبرز المميزات (AR — سطر لكل ميزة)
                    </label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={(card.highlights.ar || []).join('\n')}
                      onChange={(e) => {
                        const copy = [...featData.offerings];
                        copy[idx] = {
                          ...card,
                          highlights: {
                            ...card.highlights,
                            ar: e.target.value.split('\n').filter((s) => s.trim()),
                          },
                        };
                        updateFeat({ offerings: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 5: WHY IT MATTERS */}
      <SectionAccordion
        number={5}
        title="SolutionsWhyItMatters • Strategic Context & Proof Counters"
        description="Split layout with shaped image, H2 headline, rich-text narrative, and 2 animated KPI counters"
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display Why It Matters Section
            </span>
            <input
              type="checkbox"
              checked={featData.whyItMatters.enabled !== false}
              onChange={(e) =>
                updateFeat({
                  whyItMatters: { ...featData.whyItMatters, enabled: e.target.checked },
                })
              }
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Section Title (EN)
              </label>
              <input
                type="text"
                value={featData.whyItMatters.title.en}
                onChange={(e) =>
                  updateFeat({
                    whyItMatters: {
                      ...featData.whyItMatters,
                      title: { ...featData.whyItMatters.title, en: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان القسم (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.whyItMatters.title.ar}
                onChange={(e) =>
                  updateFeat({
                    whyItMatters: {
                      ...featData.whyItMatters,
                      title: { ...featData.whyItMatters.title, ar: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Strategic Narrative Text"
            rows={3}
            valueEn={featData.whyItMatters.text.en}
            valueAr={featData.whyItMatters.text.ar}
            onChangeEn={(val) =>
              updateFeat({
                whyItMatters: {
                  ...featData.whyItMatters,
                  text: { ...featData.whyItMatters.text, en: val },
                },
              })
            }
            onChangeAr={(val) =>
              updateFeat({
                whyItMatters: {
                  ...featData.whyItMatters,
                  text: { ...featData.whyItMatters.text, ar: val },
                },
              })
            }
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Section Image (R2)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featData.whyItMatters.image}
                onChange={(e) =>
                  updateFeat({
                    whyItMatters: { ...featData.whyItMatters, image: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
              />
              <button
                type="button"
                onClick={() =>
                  openMediaPicker(
                    (url) =>
                      updateFeat({
                        whyItMatters: { ...featData.whyItMatters, image: url },
                      }),
                    'image'
                  )
                }
                className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-persici-crimson shrink-0 cursor-pointer"
              >
                <TbPhoto className="w-4 h-4" />
                <span>Pick R2</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Counter Metric #1</span>
              <input
                type="text"
                value={featData.whyItMatters.metric1Val || '3.4x'}
                onChange={(e) =>
                  updateFeat({
                    whyItMatters: { ...featData.whyItMatters, metric1Val: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white"
              />
              <input
                type="text"
                value={featData.whyItMatters.metric1Label?.en || ''}
                onChange={(e) =>
                  updateFeat({
                    whyItMatters: {
                      ...featData.whyItMatters,
                      metric1Label: {
                        ...(featData.whyItMatters.metric1Label || { en: '', ar: '' }),
                        en: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
              />
              <input
                type="text"
                dir="rtl"
                value={featData.whyItMatters.metric1Label?.ar || ''}
                onChange={(e) =>
                  updateFeat({
                    whyItMatters: {
                      ...featData.whyItMatters,
                      metric1Label: {
                        ...(featData.whyItMatters.metric1Label || { en: '', ar: '' }),
                        ar: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Counter Metric #2</span>
              <input
                type="text"
                value={featData.whyItMatters.metric2Val || '-38%'}
                onChange={(e) =>
                  updateFeat({
                    whyItMatters: { ...featData.whyItMatters, metric2Val: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white"
              />
              <input
                type="text"
                value={featData.whyItMatters.metric2Label?.en || ''}
                onChange={(e) =>
                  updateFeat({
                    whyItMatters: {
                      ...featData.whyItMatters,
                      metric2Label: {
                        ...(featData.whyItMatters.metric2Label || { en: '', ar: '' }),
                        en: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
              />
              <input
                type="text"
                dir="rtl"
                value={featData.whyItMatters.metric2Label?.ar || ''}
                onChange={(e) =>
                  updateFeat({
                    whyItMatters: {
                      ...featData.whyItMatters,
                      metric2Label: {
                        ...(featData.whyItMatters.metric2Label || { en: '', ar: '' }),
                        ar: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
              />
            </div>
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 6: STRATEGIC BENEFITS STRIP */}
      <SectionAccordion
        number={6}
        title="SolutionsBenefitsStrip • Wide Banner & 3 Strategic Pillars"
        description="Wide shaped banner image and 3 horizontal benefit columns"
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display Benefits Strip Section
            </span>
            <input
              type="checkbox"
              checked={featData.benefitsStrip.enabled !== false}
              onChange={(e) =>
                updateFeat({
                  benefitsStrip: {
                    ...featData.benefitsStrip,
                    enabled: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Benefits Title (EN)
              </label>
              <input
                type="text"
                value={featData.benefitsStrip.title.en}
                onChange={(e) =>
                  updateFeat({
                    benefitsStrip: {
                      ...featData.benefitsStrip,
                      title: { ...featData.benefitsStrip.title, en: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان المزايا (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.benefitsStrip.title.ar}
                onChange={(e) =>
                  updateFeat({
                    benefitsStrip: {
                      ...featData.benefitsStrip,
                      title: { ...featData.benefitsStrip.title, ar: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Banner Image (R2)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featData.benefitsStrip.image}
                onChange={(e) =>
                  updateFeat({
                    benefitsStrip: {
                      ...featData.benefitsStrip,
                      image: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
              />
              <button
                type="button"
                onClick={() =>
                  openMediaPicker(
                    (url) =>
                      updateFeat({
                        benefitsStrip: { ...featData.benefitsStrip, image: url },
                      }),
                    'image'
                  )
                }
                className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-persici-crimson shrink-0 cursor-pointer"
              >
                <TbPhoto className="w-4 h-4" />
                <span>Pick R2</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {featData.benefitsStrip.benefits.slice(0, 3).map((b, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Benefit Pillar #{idx + 1}
                  </span>
                  <input
                    type="color"
                    value={
                      b.accentColor ||
                      (idx === 0 ? '#D83427' : idx === 1 ? '#EF8C7D' : '#121212')
                    }
                    onChange={(e) => {
                      const copy = [...featData.benefitsStrip.benefits];
                      copy[idx] = { ...b, accentColor: e.target.value };
                      updateFeat({
                        benefitsStrip: { ...featData.benefitsStrip, benefits: copy },
                      });
                    }}
                    className="w-8 h-6 rounded border border-slate-300 cursor-pointer"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={b.title.en}
                    onChange={(e) => {
                      const copy = [...featData.benefitsStrip.benefits];
                      copy[idx] = { ...b, title: { ...b.title, en: e.target.value } };
                      updateFeat({
                        benefitsStrip: { ...featData.benefitsStrip, benefits: copy },
                      });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    value={b.title.ar}
                    onChange={(e) => {
                      const copy = [...featData.benefitsStrip.benefits];
                      copy[idx] = { ...b, title: { ...b.title, ar: e.target.value } };
                      updateFeat({
                        benefitsStrip: { ...featData.benefitsStrip, benefits: copy },
                      });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                  />
                </div>
                <RichTextEditor
                  label={`Benefit #${idx + 1} Description`}
                  rows={2}
                  valueEn={b.description.en}
                  valueAr={b.description.ar}
                  onChangeEn={(val) => {
                    const copy = [...featData.benefitsStrip.benefits];
                    copy[idx] = {
                      ...b,
                      description: { ...b.description, en: val },
                    };
                    updateFeat({
                      benefitsStrip: { ...featData.benefitsStrip, benefits: copy },
                    });
                  }}
                  onChangeAr={(val) => {
                    const copy = [...featData.benefitsStrip.benefits];
                    copy[idx] = {
                      ...b,
                      description: { ...b.description, ar: val },
                    };
                    updateFeat({
                      benefitsStrip: { ...featData.benefitsStrip, benefits: copy },
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 7: DOMAIN VERTICALS */}
      <SectionAccordion
        number={7}
        title="VerticalsSection • Domain Verticals & Sub-Sector Applications"
        description="Industry vertical cards with monospace numbers (01-04), tags, titles, rich-text descriptions, and capability checklists"
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display Domain Verticals Section
            </span>
            <input
              type="checkbox"
              checked={featData.verticalsEnabled !== false}
              onChange={(e) => updateFeat({ verticalsEnabled: e.target.checked })}
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Eyebrow Badge (EN)
              </label>
              <input
                type="text"
                value={featData.verticalsBadge?.en || ''}
                onChange={(e) =>
                  updateFeat({
                    verticalsBadge: {
                      ...(featData.verticalsBadge || { en: '', ar: '' }),
                      en: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                الشارة العلوية (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.verticalsBadge?.ar || ''}
                onChange={(e) =>
                  updateFeat({
                    verticalsBadge: {
                      ...(featData.verticalsBadge || { en: '', ar: '' }),
                      ar: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Section Title (EN)
              </label>
              <input
                type="text"
                value={featData.verticalsTitle.en}
                onChange={(e) =>
                  updateFeat({
                    verticalsTitle: { ...featData.verticalsTitle, en: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان القطاعات الفرعية (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.verticalsTitle.ar}
                onChange={(e) =>
                  updateFeat({
                    verticalsTitle: { ...featData.verticalsTitle, ar: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Verticals Section Subtitle"
            rows={2}
            valueEn={featData.verticalsSubtitle.en}
            valueAr={featData.verticalsSubtitle.ar}
            onChangeEn={(val) =>
              updateFeat({
                verticalsSubtitle: { ...featData.verticalsSubtitle, en: val },
              })
            }
            onChangeAr={(val) =>
              updateFeat({
                verticalsSubtitle: { ...featData.verticalsSubtitle, ar: val },
              })
            }
          />

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Sub-Sector Vertical Cards ({featData.verticals.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  updateFeat({
                    verticals: [
                      ...featData.verticals,
                      {
                        id: `vert-${Date.now()}`,
                        number: String(featData.verticals.length + 1).padStart(2, '0'),
                        tag: { en: 'Sub-Sector', ar: 'قطاع فرعي' },
                        title: { en: 'New Sub-Sector Vertical', ar: 'قطاع فرعي جديد' },
                        description: { en: '', ar: '' },
                        capabilities: {
                          en: ['Capability 1', 'Capability 2'],
                          ar: ['قدرة ١', 'قدرة ٢'],
                        },
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson cursor-pointer"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>Add Vertical Card</span>
              </button>
            </div>

            {featData.verticals.map((vert, idx) => (
              <div
                key={vert.id || idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-900">
                    Vertical #{vert.number}: {vert.title.en}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() =>
                        updateFeat({
                          verticals: moveItem(featData.verticals, idx, 'up'),
                        })
                      }
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    >
                      <TbArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === featData.verticals.length - 1}
                      onClick={() =>
                        updateFeat({
                          verticals: moveItem(featData.verticals, idx, 'down'),
                        })
                      }
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    >
                      <TbArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...featData.verticals];
                        copy.splice(idx, 1);
                        updateFeat({ verticals: copy });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Number Badge
                    </label>
                    <input
                      type="text"
                      value={vert.number}
                      onChange={(e) => {
                        const copy = [...featData.verticals];
                        copy[idx] = { ...vert, number: e.target.value };
                        updateFeat({ verticals: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Tag (EN)
                    </label>
                    <input
                      type="text"
                      value={vert.tag.en}
                      onChange={(e) => {
                        const copy = [...featData.verticals];
                        copy[idx] = { ...vert, tag: { ...vert.tag, en: e.target.value } };
                        updateFeat({ verticals: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      الشارة (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={vert.tag.ar}
                      onChange={(e) => {
                        const copy = [...featData.verticals];
                        copy[idx] = { ...vert, tag: { ...vert.tag, ar: e.target.value } };
                        updateFeat({ verticals: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={vert.title.en}
                    onChange={(e) => {
                      const copy = [...featData.verticals];
                      copy[idx] = { ...vert, title: { ...vert.title, en: e.target.value } };
                      updateFeat({ verticals: copy });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    value={vert.title.ar}
                    onChange={(e) => {
                      const copy = [...featData.verticals];
                      copy[idx] = { ...vert, title: { ...vert.title, ar: e.target.value } };
                      updateFeat({ verticals: copy });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg bg-white font-arabic"
                  />
                </div>

                <RichTextEditor
                  label={`Vertical #${vert.number} Description`}
                  rows={2}
                  valueEn={vert.description.en}
                  valueAr={vert.description.ar}
                  onChangeEn={(val) => {
                    const copy = [...featData.verticals];
                    copy[idx] = {
                      ...vert,
                      description: { ...vert.description, en: val },
                    };
                    updateFeat({ verticals: copy });
                  }}
                  onChangeAr={(val) => {
                    const copy = [...featData.verticals];
                    copy[idx] = {
                      ...vert,
                      description: { ...vert.description, ar: val },
                    };
                    updateFeat({ verticals: copy });
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Capabilities Checklist (EN — One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(vert.capabilities.en || []).join('\n')}
                      onChange={(e) => {
                        const copy = [...featData.verticals];
                        copy[idx] = {
                          ...vert,
                          capabilities: {
                            ...vert.capabilities,
                            en: e.target.value.split('\n').filter((s) => s.trim()),
                          },
                        };
                        updateFeat({ verticals: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      قائمة القدرات (AR — سطر لكل قدرة)
                    </label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={(vert.capabilities.ar || []).join('\n')}
                      onChange={(e) => {
                        const copy = [...featData.verticals];
                        copy[idx] = {
                          ...vert,
                          capabilities: {
                            ...vert.capabilities,
                            ar: e.target.value.split('\n').filter((s) => s.trim()),
                          },
                        };
                        updateFeat({ verticals: copy });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 8: TECHNOLOGY STACK PODS */}
      <SectionAccordion
        number={8}
        title="TechStackSection • Dark Technology Infrastructure Matrix"
        description="Eyebrow badge, section title, rich-text subtitle, and dark infrastructure pods with technology badges"
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display Technology Stack Section
            </span>
            <input
              type="checkbox"
              checked={featData.techStackEnabled !== false}
              onChange={(e) => updateFeat({ techStackEnabled: e.target.checked })}
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Eyebrow Badge (EN)
              </label>
              <input
                type="text"
                value={featData.techStackBadge?.en || ''}
                onChange={(e) =>
                  updateFeat({
                    techStackBadge: {
                      ...(featData.techStackBadge || { en: '', ar: '' }),
                      en: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                الشارة العلوية (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.techStackBadge?.ar || ''}
                onChange={(e) =>
                  updateFeat({
                    techStackBadge: {
                      ...(featData.techStackBadge || { en: '', ar: '' }),
                      ar: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tech Stack Title (EN)
              </label>
              <input
                type="text"
                value={featData.techStackTitle.en}
                onChange={(e) =>
                  updateFeat({
                    techStackTitle: { ...featData.techStackTitle, en: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان البنية التقنية (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.techStackTitle.ar}
                onChange={(e) =>
                  updateFeat({
                    techStackTitle: { ...featData.techStackTitle, ar: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Tech Stack Subtitle"
            rows={2}
            valueEn={featData.techStackSubtitle.en}
            valueAr={featData.techStackSubtitle.ar}
            onChangeEn={(val) =>
              updateFeat({
                techStackSubtitle: { ...featData.techStackSubtitle, en: val },
              })
            }
            onChangeAr={(val) =>
              updateFeat({
                techStackSubtitle: { ...featData.techStackSubtitle, ar: val },
              })
            }
          />

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Technology Pods ({featData.techStackPods.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  updateFeat({
                    techStackPods: [
                      ...featData.techStackPods,
                      {
                        title: { en: 'New Tech Pod', ar: 'منظومة تقنية جديدة' },
                        badge: { en: 'Infrastructure', ar: 'بنية تحتية' },
                        description: { en: '', ar: '' },
                        technologies: [{ name: 'Technology', category: 'Core', badge: 'Core' }],
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson cursor-pointer"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>Add Tech Pod</span>
              </button>
            </div>

            {featData.techStackPods.map((pod, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-900">
                    Pod #{idx + 1}: {pod.title.en}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const copy = [...featData.techStackPods];
                      copy.splice(idx, 1);
                      updateFeat({ techStackPods: copy });
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <TbTrash className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Pod Title (EN)"
                    value={pod.title.en}
                    onChange={(e) => {
                      const copy = [...featData.techStackPods];
                      copy[idx] = { ...pod, title: { ...pod.title, en: e.target.value } };
                      updateFeat({ techStackPods: copy });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="عنوان المنظومة (AR)"
                    value={pod.title.ar}
                    onChange={(e) => {
                      const copy = [...featData.techStackPods];
                      copy[idx] = { ...pod, title: { ...pod.title, ar: e.target.value } };
                      updateFeat({ techStackPods: copy });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg font-arabic"
                  />
                  <input
                    type="text"
                    placeholder="Badge (EN)"
                    value={pod.badge.en}
                    onChange={(e) => {
                      const copy = [...featData.techStackPods];
                      copy[idx] = { ...pod, badge: { ...pod.badge, en: e.target.value } };
                      updateFeat({ techStackPods: copy });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="الشارة (AR)"
                    value={pod.badge.ar}
                    onChange={(e) => {
                      const copy = [...featData.techStackPods];
                      copy[idx] = { ...pod, badge: { ...pod.badge, ar: e.target.value } };
                      updateFeat({ techStackPods: copy });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                  />
                </div>

                <RichTextEditor
                  label={`Pod #${idx + 1} Description`}
                  rows={2}
                  valueEn={pod.description.en}
                  valueAr={pod.description.ar}
                  onChangeEn={(val) => {
                    const copy = [...featData.techStackPods];
                    copy[idx] = {
                      ...pod,
                      description: { ...pod.description, en: val },
                    };
                    updateFeat({ techStackPods: copy });
                  }}
                  onChangeAr={(val) => {
                    const copy = [...featData.techStackPods];
                    copy[idx] = {
                      ...pod,
                      description: { ...pod.description, ar: val },
                    };
                    updateFeat({ techStackPods: copy });
                  }}
                />

                {/* Technologies inside Pod */}
                <div className="space-y-2 pt-2 border-t border-slate-200/70">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">
                      Technologies ({pod.technologies.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...featData.techStackPods];
                        copy[idx] = {
                          ...pod,
                          technologies: [
                            ...pod.technologies,
                            { name: 'New Tech', category: 'Core', badge: 'Core' },
                          ],
                        };
                        updateFeat({ techStackPods: copy });
                      }}
                      className="text-[11px] font-semibold text-persici-crimson hover:underline cursor-pointer"
                    >
                      + Add Technology
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {pod.technologies.map((t, tIdx) => (
                      <div
                        key={tIdx}
                        className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-slate-200"
                      >
                        <input
                          type="text"
                          placeholder="Name"
                          value={t.name}
                          onChange={(e) => {
                            const copy = [...featData.techStackPods];
                            const techs = [...pod.technologies];
                            techs[tIdx] = { ...t, name: e.target.value };
                            copy[idx] = { ...pod, technologies: techs };
                            updateFeat({ techStackPods: copy });
                          }}
                          className="w-full px-2 py-1 text-xs font-semibold border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Badge"
                          value={t.badge || t.category || ''}
                          onChange={(e) => {
                            const copy = [...featData.techStackPods];
                            const techs = [...pod.technologies];
                            techs[tIdx] = {
                              ...t,
                              badge: e.target.value,
                              category: e.target.value,
                            };
                            copy[idx] = { ...pod, technologies: techs };
                            updateFeat({ techStackPods: copy });
                          }}
                          className="w-24 px-2 py-1 text-[11px] font-mono border border-slate-200 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...featData.techStackPods];
                            const techs = [...pod.technologies];
                            techs.splice(tIdx, 1);
                            copy[idx] = { ...pod, technologies: techs };
                            updateFeat({ techStackPods: copy });
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <TbTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 9: FEATURED CLIENT STORIES SELECTOR */}
      <SectionAccordion
        number={9}
        title="FeaturedClientStories • Dynamic Client Stories Selector"
        description="Select Client Stories by Custom Order, Category, or Featured status, and control the maximum number of stories shown on this page"
        onSave={onSave}
      >
        {renderClientStoriesSelector(featData.clientStoriesConfig, (nextCfg) =>
          updateFeat({ clientStoriesConfig: nextCfg })
        )}
      </SectionAccordion>

      {/* SECTION 10: DELIVERY ENGINE */}
      <SectionAccordion
        number={10}
        title="SolutionsDeliveryEngine • Execution Framework & Pillars"
        description="How We Deliver Differently section header, shaped image, and numbered execution pillars"
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display Delivery Engine Section
            </span>
            <input
              type="checkbox"
              checked={featData.delivery.enabled !== false}
              onChange={(e) =>
                updateFeat({
                  delivery: { ...featData.delivery, enabled: e.target.checked },
                })
              }
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Eyebrow Badge (EN)
              </label>
              <input
                type="text"
                value={featData.delivery.badge?.en || ''}
                onChange={(e) =>
                  updateFeat({
                    delivery: {
                      ...featData.delivery,
                      badge: {
                        ...(featData.delivery.badge || { en: '', ar: '' }),
                        en: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                الشارة العلوية (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.delivery.badge?.ar || ''}
                onChange={(e) =>
                  updateFeat({
                    delivery: {
                      ...featData.delivery,
                      badge: {
                        ...(featData.delivery.badge || { en: '', ar: '' }),
                        ar: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Delivery Title (EN)
              </label>
              <input
                type="text"
                value={featData.delivery.title.en}
                onChange={(e) =>
                  updateFeat({
                    delivery: {
                      ...featData.delivery,
                      title: { ...featData.delivery.title, en: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان التسليم (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.delivery.title.ar}
                onChange={(e) =>
                  updateFeat({
                    delivery: {
                      ...featData.delivery,
                      title: { ...featData.delivery.title, ar: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Delivery Subtitle"
            rows={2}
            valueEn={featData.delivery.subtitle.en}
            valueAr={featData.delivery.subtitle.ar}
            onChangeEn={(val) =>
              updateFeat({
                delivery: {
                  ...featData.delivery,
                  subtitle: { ...featData.delivery.subtitle, en: val },
                },
              })
            }
            onChangeAr={(val) =>
              updateFeat({
                delivery: {
                  ...featData.delivery,
                  subtitle: { ...featData.delivery.subtitle, ar: val },
                },
              })
            }
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Delivery Image (R2)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featData.delivery.image}
                onChange={(e) =>
                  updateFeat({
                    delivery: { ...featData.delivery, image: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
              />
              <button
                type="button"
                onClick={() =>
                  openMediaPicker(
                    (url) =>
                      updateFeat({
                        delivery: { ...featData.delivery, image: url },
                      }),
                    'image'
                  )
                }
                className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-persici-crimson shrink-0 cursor-pointer"
              >
                <TbPhoto className="w-4 h-4" />
                <span>Pick R2</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {featData.delivery.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <span className="text-xs font-bold text-slate-800 block">
                  Pillar #0{idx + 1}: {pillar.title.en}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={pillar.title.en}
                    onChange={(e) => {
                      const copy = [...featData.delivery.pillars];
                      copy[idx] = {
                        ...pillar,
                        title: { ...pillar.title, en: e.target.value },
                      };
                      updateFeat({
                        delivery: { ...featData.delivery, pillars: copy },
                      });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    value={pillar.title.ar}
                    onChange={(e) => {
                      const copy = [...featData.delivery.pillars];
                      copy[idx] = {
                        ...pillar,
                        title: { ...pillar.title, ar: e.target.value },
                      };
                      updateFeat({
                        delivery: { ...featData.delivery, pillars: copy },
                      });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                  />
                </div>
                <RichTextEditor
                  label={`Pillar #0${idx + 1} Description`}
                  rows={2}
                  valueEn={pillar.description.en}
                  valueAr={pillar.description.ar}
                  onChangeEn={(val) => {
                    const copy = [...featData.delivery.pillars];
                    copy[idx] = {
                      ...pillar,
                      description: { ...pillar.description, en: val },
                    };
                    updateFeat({
                      delivery: { ...featData.delivery, pillars: copy },
                    });
                  }}
                  onChangeAr={(val) => {
                    const copy = [...featData.delivery.pillars];
                    copy[idx] = {
                      ...pillar,
                      description: { ...pillar.description, ar: val },
                    };
                    updateFeat({
                      delivery: { ...featData.delivery, pillars: copy },
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 11: BLOGS / INSIGHTS CAROUSEL SELECTOR */}
      <SectionAccordion
        number={11}
        title="InsightsSection • Dynamic Blogs & Insights Carousel Selector"
        description="Select Blogs by Custom Order, Category, or Featured status, and control the maximum number of blogs in the carousel"
        onSave={onSave}
      >
        {renderInsightsSelector(
          featData.insightsConfig,
          featData.insights,
          (nextCfg) => updateFeat({ insightsConfig: nextCfg }),
          (nextItems) => updateFeat({ insights: nextItems })
        )}
      </SectionAccordion>

      {/* SECTION 12: CLIENT REVIEW */}
      <SectionAccordion
        number={12}
        title="ClientReviewSection • Executive Client Testimonial"
        description="Monospace typographic client quote with crimson border accent and author attribution"
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display Client Review Section
            </span>
            <input
              type="checkbox"
              checked={featData.clientReview.enabled !== false}
              onChange={(e) =>
                updateFeat({
                  clientReview: {
                    ...featData.clientReview,
                    enabled: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Badge (EN)
              </label>
              <input
                type="text"
                value={featData.clientReview.badge.en}
                onChange={(e) =>
                  updateFeat({
                    clientReview: {
                      ...featData.clientReview,
                      badge: {
                        ...featData.clientReview.badge,
                        en: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                شارة الاقتباس (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.clientReview.badge.ar}
                onChange={(e) =>
                  updateFeat({
                    clientReview: {
                      ...featData.clientReview,
                      badge: {
                        ...featData.clientReview.badge,
                        ar: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Client Quotation"
            rows={3}
            valueEn={featData.clientReview.quote.en}
            valueAr={featData.clientReview.quote.ar}
            onChangeEn={(val) =>
              updateFeat({
                clientReview: {
                  ...featData.clientReview,
                  quote: { ...featData.clientReview.quote, en: val },
                },
              })
            }
            onChangeAr={(val) =>
              updateFeat({
                clientReview: {
                  ...featData.clientReview,
                  quote: { ...featData.clientReview.quote, ar: val },
                },
              })
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={featData.clientReview.author}
                onChange={(e) =>
                  updateFeat({
                    clientReview: {
                      ...featData.clientReview,
                      author: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Author Role (EN)
              </label>
              <input
                type="text"
                value={featData.clientReview.role.en}
                onChange={(e) =>
                  updateFeat({
                    clientReview: {
                      ...featData.clientReview,
                      role: {
                        ...featData.clientReview.role,
                        en: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                المنصب الوظيفي (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.clientReview.role.ar}
                onChange={(e) =>
                  updateFeat({
                    clientReview: {
                      ...featData.clientReview,
                      role: {
                        ...featData.clientReview.role,
                        ar: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 13: FAQS */}
      <SectionAccordion
        number={13}
        title="FaqSection • Enterprise FAQs Accordion"
        description="Manage FAQ heading, rich-text subtitle, and expandable Q&A items"
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display FAQs Section
            </span>
            <input
              type="checkbox"
              checked={featData.faqsEnabled !== false}
              onChange={(e) => updateFeat({ faqsEnabled: e.target.checked })}
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                FAQ Title (EN)
              </label>
              <input
                type="text"
                value={featData.faqsTitle.en}
                onChange={(e) =>
                  updateFeat({
                    faqsTitle: { ...featData.faqsTitle, en: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان الأسئلة الشائعة (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.faqsTitle.ar}
                onChange={(e) =>
                  updateFeat({
                    faqsTitle: { ...featData.faqsTitle, ar: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="FAQ Subtitle"
            rows={2}
            valueEn={featData.faqsSubtitle.en}
            valueAr={featData.faqsSubtitle.ar}
            onChangeEn={(val) =>
              updateFeat({
                faqsSubtitle: { ...featData.faqsSubtitle, en: val },
              })
            }
            onChangeAr={(val) =>
              updateFeat({
                faqsSubtitle: { ...featData.faqsSubtitle, ar: val },
              })
            }
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                FAQ Items ({featData.faqs.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  updateFeat({
                    faqs: [
                      ...featData.faqs,
                      {
                        question: { en: 'New Question?', ar: 'سؤال جديد؟' },
                        answer: { en: '', ar: '' },
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson cursor-pointer"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </button>
            </div>

            {featData.faqs.map((fq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Q#{idx + 1}: {fq.question.en}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() =>
                        updateFeat({ faqs: moveItem(featData.faqs, idx, 'up') })
                      }
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    >
                      <TbArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === featData.faqs.length - 1}
                      onClick={() =>
                        updateFeat({ faqs: moveItem(featData.faqs, idx, 'down') })
                      }
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    >
                      <TbArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...featData.faqs];
                        copy.splice(idx, 1);
                        updateFeat({ faqs: copy });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={fq.question.en}
                    onChange={(e) => {
                      const copy = [...featData.faqs];
                      copy[idx] = {
                        ...fq,
                        question: { ...fq.question, en: e.target.value },
                      };
                      updateFeat({ faqs: copy });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    value={fq.question.ar}
                    onChange={(e) => {
                      const copy = [...featData.faqs];
                      copy[idx] = {
                        ...fq,
                        question: { ...fq.question, ar: e.target.value },
                      };
                      updateFeat({ faqs: copy });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                  />
                </div>
                <RichTextEditor
                  label={`FAQ #${idx + 1} Answer`}
                  rows={2}
                  valueEn={fq.answer.en}
                  valueAr={fq.answer.ar}
                  onChangeEn={(val) => {
                    const copy = [...featData.faqs];
                    copy[idx] = {
                      ...fq,
                      answer: { ...fq.answer, en: val },
                    };
                    updateFeat({ faqs: copy });
                  }}
                  onChangeAr={(val) => {
                    const copy = [...featData.faqs];
                    copy[idx] = {
                      ...fq,
                      answer: { ...fq.answer, ar: val },
                    };
                    updateFeat({ faqs: copy });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* SHARED CONTACT BANNER */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <TbForms className="w-4 h-4" />
            <span>Global Shared Contact &amp; Lead Form</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            The bottom contact form is shared across all pages. You can toggle its visibility on
            this page or edit its global fields in the Shared Contact editor.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-white cursor-pointer">
            <input
              type="checkbox"
              checked={featData.contactEnabled !== false}
              onChange={(e) => updateFeat({ contactEnabled: e.target.checked })}
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
            <span>Show on Page</span>
          </label>
          <Link
            href={`/${lang}/dashboard/shared-contact`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
          >
            <span>Edit Shared Contact</span>
            <TbChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default IndustriesPageCmsEditor;

