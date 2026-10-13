'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SectionAccordion } from './section-accordion';
import { RichTextEditor } from './rich-text-editor';
import {
  TbPlus,
  TbTrash,
  TbPhoto,
  TbVideo,
  TbArrowUp,
  TbArrowDown,
  TbExternalLink,
  TbSearch,
  TbFilter,
  TbListCheck,
  TbStar,
  TbForms,
  TbChevronRight,
  TbLayersSubtract,
} from 'react-icons/tb';
import {
  extractSolutionFeatureSlug,
  normalizeSolutionsHubPageData,
  normalizeSolutionFeaturePageData,
  type SolutionsHubCmsData,
  type SolutionFeatureCmsData,
  type SolutionClientStoriesSectionConfig,
  type SolutionInsightsSectionConfig,
} from '@/app/[lang]/(site)/solutions/_solutions/data/solutions-cms.data';
import { clientStoriesData } from '@/app/[lang]/(site)/client-stories/_client-stories/data/client-stories.data';
import { insightsData } from '@/app/[lang]/(site)/insights/_insights/data/insights.data';
import type { ClientStoryDetail } from '@/app/[lang]/(site)/client-stories/_client-stories/types';
import type { InsightDetail } from '@/app/[lang]/(site)/insights/_insights/types';
import type { SolutionDiagramType } from '@shared/types';

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

const SOLUTION_NAV_ITEMS: Array<{ slug: string; label: string }> = [
  { slug: 'solutions', label: 'Solutions Overview Hub' },
  { slug: 'solutions-ai-integration', label: '1. AI Integration' },
  { slug: 'solutions-application-management', label: '2. Application Management' },
  { slug: 'solutions-digital-engineering', label: '3. Digital Engineering' },
  { slug: 'solutions-ux-and-product-design', label: '4. UX & Product Design' },
  { slug: 'solutions-ecommerce-growth', label: '5. E-Commerce Growth' },
  { slug: 'solutions-marketing-communications', label: '6. Marketing & Comms' },
  { slug: 'solutions-customer-engagement', label: '7. Customer Engagement' },
  { slug: 'solutions-crm-management', label: '8. CRM Management' },
  { slug: 'solutions-supply-chain', label: '9. Supply Chain' },
];

export interface SolutionsPageCmsEditorProps {
  slug: string;
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageData: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPageData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  onSave: () => Promise<void>;
  openMediaPicker: (cb: (url: string) => void, type?: 'image' | 'video' | 'all') => void;
}

function moveItem<T>(list: T[], index: number, direction: 'up' | 'down'): T[] {
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= list.length) return list;
  const copy = [...list];
  const [moved] = copy.splice(index, 1);
  copy.splice(targetIndex, 0, moved);
  return copy;
}

export function SolutionsPageCmsEditor({
  slug,
  lang,
  pageData,
  setPageData,
  onSave,
  openMediaPicker,
}: SolutionsPageCmsEditorProps) {
  const isHub = slug === 'solutions';
  const featureSlug = isHub ? null : extractSolutionFeatureSlug(slug);

  // Live catalog of all Client Stories & Blogs from DB (with static fallback)
  const [allStories, setAllStories] = useState<ClientStoryDetail[]>(clientStoriesData);
  const [allInsights, setAllInsights] = useState<InsightDetail[]>(insightsData);
  const [storySearch, setStorySearch] = useState('');
  const [insightSearch, setInsightSearch] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/projects')
      .then((r) => r.json())
      .then((res) => {
        if (active && Array.isArray(res?.projects) && res.projects.length > 0) {
          setAllStories(res.projects);
        }
      })
      .catch(() => {});

    fetch('/api/insights')
      .then((r) => r.json())
      .then((res) => {
        if (active && Array.isArray(res?.insights) && res.insights.length > 0) {
          setAllInsights(res.insights);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Normalize current data against canonical defaults so no field is ever empty
  const hubData: SolutionsHubCmsData | null = useMemo(
    () => (isHub ? normalizeSolutionsHubPageData(pageData as Partial<SolutionsHubCmsData>) : null),
    [isHub, pageData]
  );

  const featData: SolutionFeatureCmsData | null = useMemo(
    () =>
      !isHub && featureSlug
        ? normalizeSolutionFeaturePageData(featureSlug, pageData as Partial<SolutionFeatureCmsData>)
        : null,
    [isHub, featureSlug, pageData]
  );

  // Available Client Story Categories
  const storyCategories = useMemo(() => {
    const map = new Map<string, string>();
    map.set('all', 'All Categories');
    allStories.forEach((s) => {
      if (s.categorySlug) {
        map.set(
          s.categorySlug,
          `${s.category?.en || s.categorySlug} (${s.categorySlug})`
        );
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [allStories]);

  // Available Insight Categories
  const insightCategories = useMemo(() => {
    const map = new Map<string, string>();
    map.set('all', 'All Categories');
    map.set('article', 'Article (article)');
    map.set('research', 'Research (research)');
    allInsights.forEach((ins) => {
      if (ins.categorySlug && !map.has(ins.categorySlug)) {
        map.set(
          ins.categorySlug,
          `${ins.category?.en || ins.categorySlug} (${ins.categorySlug})`
        );
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [allInsights]);

  // Helper to render the Client Stories Configuration & Selector block (shared by Hub and Feature pages)
  const renderClientStoriesSelector = (
    config: SolutionClientStoriesSectionConfig,
    onUpdateConfig: (next: SolutionClientStoriesSectionConfig) => void
  ) => {
    const mode = config.selectionMode || 'custom';
    const maxCount = Math.max(1, Number(config.maxCount) || 4);
    const selectedSlugs = Array.isArray(config.selectedSlugs) ? config.selectedSlugs : [];

    // Compute live preview of stories that will render on the page
    const previewStories = (() => {
      if (mode === 'featured') {
        const feat = [...allStories]
          .filter((s) => s.featured)
          .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
        return (feat.length > 0 ? feat : allStories).slice(0, maxCount);
      }
      if (mode === 'category') {
        const cat = (config.categorySlug || 'all').toLowerCase();
        const filtered =
          cat === 'all'
            ? allStories
            : allStories.filter(
                (s) =>
                  s.categorySlug?.toLowerCase() === cat ||
                  s.category?.en?.toLowerCase() === cat
              );
        return (filtered.length > 0 ? filtered : allStories).slice(0, maxCount);
      }
      // custom mode
      const list: ClientStoryDetail[] = [];
      for (const sl of selectedSlugs) {
        const found = allStories.find((s) => s.slug === sl || s.id === sl);
        if (found) list.push(found);
      }
      return (list.length > 0 ? list : allStories).slice(0, maxCount);
    })();

    const filteredCatalog = allStories.filter((s) => {
      if (!storySearch.trim()) return true;
      const q = storySearch.toLowerCase();
      return (
        s.title?.en?.toLowerCase().includes(q) ||
        s.title?.ar?.toLowerCase().includes(q) ||
        s.client?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q) ||
        s.category?.en?.toLowerCase().includes(q)
      );
    });

    const toggleStorySlug = (storySlug: string) => {
      if (selectedSlugs.includes(storySlug)) {
        onUpdateConfig({
          ...config,
          selectedSlugs: selectedSlugs.filter((s) => s !== storySlug),
        });
      } else {
        onUpdateConfig({
          ...config,
          selectedSlugs: [...selectedSlugs, storySlug],
        });
      }
    };

    return (
      <div className="space-y-5">
        {/* Visibility Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Display Featured Client Stories Section on This Page
            </span>
            <span className="text-[11px] text-slate-500">
              Toggle visibility of the sticky stacked Client Stories showcase on the live page
            </span>
          </div>
          <input
            type="checkbox"
            checked={config.enabled !== false}
            onChange={(e) => onUpdateConfig({ ...config, enabled: e.target.checked })}
            className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
          />
        </div>

        {/* Section Header Copy (Badge, Title, Subtitle) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Section Eyebrow Badge (EN)
            </label>
            <input
              type="text"
              value={config.badge?.en || ''}
              onChange={(e) =>
                onUpdateConfig({
                  ...config,
                  badge: { ...(config.badge || { en: '', ar: '' }), en: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              شارة قسم قصص النجاح (AR)
            </label>
            <input
              type="text"
              dir="rtl"
              value={config.badge?.ar || ''}
              onChange={(e) =>
                onUpdateConfig({
                  ...config,
                  badge: { ...(config.badge || { en: '', ar: '' }), ar: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Section Heading Title (EN)
            </label>
            <input
              type="text"
              placeholder="e.g. Proven Enterprise Impact"
              value={config.title?.en || ''}
              onChange={(e) =>
                onUpdateConfig({
                  ...config,
                  title: { ...(config.title || { en: '', ar: '' }), en: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              عنوان قسم قصص النجاح (AR)
            </label>
            <input
              type="text"
              dir="rtl"
              value={config.title?.ar || ''}
              onChange={(e) =>
                onUpdateConfig({
                  ...config,
                  title: { ...(config.title || { en: '', ar: '' }), ar: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
            />
          </div>
        </div>

        <RichTextEditor
          label="Section Subtitle / Description"
          rows={2}
          valueEn={config.subtitle?.en || ''}
          valueAr={config.subtitle?.ar || ''}
          onChangeEn={(val) =>
            onUpdateConfig({
              ...config,
              subtitle: { ...(config.subtitle || { en: '', ar: '' }), en: val },
            })
          }
          onChangeAr={(val) =>
            onUpdateConfig({
              ...config,
              subtitle: { ...(config.subtitle || { en: '', ar: '' }), ar: val },
            })
          }
        />

        {/* Selection Mode & Max Count Controls */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Client Stories Selection Source &amp; Maximum Limit
              </span>
              <span className="text-[11px] text-slate-500">
                Choose how Client Stories are populated on this Solution page and how many cards to display
              </span>
            </div>

            {/* Max Stories Count Control */}
            <div className="flex items-center gap-2 shrink-0">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Max Stories:
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 6, 8].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onUpdateConfig({ ...config, maxCount: n })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      maxCount === n
                        ? 'bg-persici-crimson text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={maxCount}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      maxCount: Math.max(1, Math.min(24, Number(e.target.value) || 4)),
                    })
                  }
                  className="w-16 px-2.5 py-1 text-xs font-bold text-center border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3 Mode Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onUpdateConfig({ ...config, selectionMode: 'custom' })}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'custom'
                  ? 'bg-white border-persici-crimson ring-2 ring-persici-crimson/15 shadow-xs'
                  : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              <TbListCheck
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  mode === 'custom' ? 'text-persici-crimson' : 'text-slate-400'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-slate-900">1. Custom Selection</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Hand-pick exact Client Stories in your custom display order ({selectedSlugs.length}{' '}
                  selected)
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateConfig({ ...config, selectionMode: 'category' })}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'category'
                  ? 'bg-white border-persici-crimson ring-2 ring-persici-crimson/15 shadow-xs'
                  : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              <TbFilter
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  mode === 'category' ? 'text-persici-crimson' : 'text-slate-400'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-slate-900">2. By Category</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Automatically pull Client Stories matching a specific category
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateConfig({ ...config, selectionMode: 'featured' })}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'featured'
                  ? 'bg-white border-persici-crimson ring-2 ring-persici-crimson/15 shadow-xs'
                  : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              <TbStar
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  mode === 'featured' ? 'text-persici-crimson' : 'text-slate-400'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-slate-900">3. Featured Client Stories</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Automatically pull stories marked as Featured in Client Stories Hub
                </div>
              </div>
            </button>
          </div>

          {/* Mode-Specific Controls */}
          {mode === 'category' && (
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Target Client Story Category
                </label>
                <span className="text-[11px] text-slate-500">
                  All active Client Stories in this category will be fetched up to {maxCount} stories
                </span>
              </div>
              <select
                value={config.categorySlug || 'all'}
                onChange={(e) => onUpdateConfig({ ...config, categorySlug: e.target.value })}
                className="px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 min-w-[240px]"
              >
                {storyCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === 'custom' && (
            <div className="space-y-3">
              {/* Selected Stories Order List */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Selected Custom Stories Order ({selectedSlugs.length} selected • Top {maxCount}{' '}
                    will show)
                  </span>
                </div>
                {selectedSlugs.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">
                    No custom stories selected yet. Check stories from the catalog below.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedSlugs.map((sl, idx) => {
                      const st = allStories.find((s) => s.slug === sl || s.id === sl);
                      const isShown = idx < maxCount;
                      return (
                        <div
                          key={sl}
                          className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border text-xs ${
                            isShown
                              ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-900'
                              : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                isShown
                                  ? 'bg-persici-crimson text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <div className="truncate">
                              <span className="font-semibold">
                                {st?.title?.en || sl}
                              </span>
                              {st?.client && (
                                <span className="text-[11px] text-slate-500 ml-2">
                                  ({st.client} • {st.category?.en || st.categorySlug})
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() =>
                                onUpdateConfig({
                                  ...config,
                                  selectedSlugs: moveItem(selectedSlugs, idx, 'up'),
                                })
                              }
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <TbArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === selectedSlugs.length - 1}
                              onClick={() =>
                                onUpdateConfig({
                                  ...config,
                                  selectedSlugs: moveItem(selectedSlugs, idx, 'down'),
                                })
                              }
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <TbArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleStorySlug(sl)}
                              className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              title="Remove from selection"
                            >
                              <TbTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Searchable Checkable Catalog of All Client Stories */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Choose from All Client Stories ({allStories.length} available)
                  </span>
                  <div className="relative w-full sm:w-64">
                    <TbSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search stories by title, client, category..."
                      value={storySearch}
                      onChange={(e) => setStorySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {filteredCatalog.map((story) => {
                    const isChecked = selectedSlugs.includes(story.slug);
                    return (
                      <label
                        key={story.slug}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-red-50/50 border-persici-crimson/40'
                            : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleStorySlug(story.slug)}
                          className="mt-0.5 w-4 h-4 accent-persici-crimson rounded cursor-pointer shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 truncate">
                            {story.title?.en}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate" dir="rtl">
                            {story.title?.ar}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded text-slate-600">
                              {story.category?.en || story.categorySlug}
                            </span>
                            {story.featured && (
                              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded">
                                ★ Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Live Resolved Stories Preview */}
          <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                ✓ Live Page Preview: {previewStories.length} Client{' '}
                {previewStories.length === 1 ? 'Story' : 'Stories'} Will Be Displayed
              </span>
              <Link
                href={`/${lang}/dashboard/projects`}
                className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white underline"
              >
                <span>Manage All Client Stories</span>
                <TbExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {previewStories.map((st, idx) => (
                <div
                  key={st.slug || idx}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/10 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-persici-crimson text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate">{st.title?.en}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {st.client} • {st.category?.en || st.categorySlug}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper to render the Blogs / Insights Carousel Configuration & Selector block
  const renderInsightsSelector = (
    config: SolutionInsightsSectionConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customItems: any[],
    onUpdateConfig: (next: SolutionInsightsSectionConfig) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdateCustomItems: (nextItems: any[]) => void
  ) => {
    const mode = config.selectionMode || 'custom';
    const maxCount = Math.max(1, Number(config.maxCount) || 4);
    const selectedSlugs = Array.isArray(config.selectedSlugs) ? config.selectedSlugs : [];

    // Compute live preview of blogs that will appear in the carousel
    const previewBlogs = (() => {
      if (mode === 'featured') {
        const feat = allInsights.filter((i) => i.featured);
        return (feat.length > 0 ? feat : allInsights)
          .slice(0, maxCount)
          .map((i) => ({
            id: i.slug,
            titleEn: i.title?.en,
            tagEn: i.category?.en || i.categorySlug,
            href: `/insights/${i.slug}`,
          }));
      }
      if (mode === 'category') {
        const cat = (config.categorySlug || 'all').toLowerCase();
        const filtered =
          cat === 'all'
            ? allInsights
            : allInsights.filter(
                (i) =>
                  i.categorySlug?.toLowerCase() === cat ||
                  i.category?.en?.toLowerCase() === cat
              );
        return (filtered.length > 0 ? filtered : allInsights)
          .slice(0, maxCount)
          .map((i) => ({
            id: i.slug,
            titleEn: i.title?.en,
            tagEn: i.category?.en || i.categorySlug,
            href: `/insights/${i.slug}`,
          }));
      }
      // custom mode
      if (selectedSlugs.length > 0) {
        return selectedSlugs.slice(0, maxCount).map((sl) => {
          const dbMatch = allInsights.find((i) => i.slug === sl || i.id === sl);
          if (dbMatch) {
            return {
              id: dbMatch.slug,
              titleEn: dbMatch.title?.en,
              tagEn: dbMatch.category?.en || dbMatch.categorySlug,
              href: `/insights/${dbMatch.slug}`,
            };
          }
          const customMatch = customItems.find(
            (c) => c.id === sl || c.href === `/insights/${sl}`
          );
          return {
            id: sl,
            titleEn: customMatch?.title?.en || sl,
            tagEn: customMatch?.tag?.en || 'Article',
            href: customMatch?.href || `/insights/${sl}`,
          };
        });
      }
      return customItems.slice(0, maxCount).map((c, idx) => ({
        id: c.id || `ins-${idx + 1}`,
        titleEn: c.title?.en || '',
        tagEn: c.tag?.en || 'Article',
        href: c.href || '/insights',
      }));
    })();

    const filteredInsightsCatalog = allInsights.filter((ins) => {
      if (!insightSearch.trim()) return true;
      const q = insightSearch.toLowerCase();
      return (
        ins.title?.en?.toLowerCase().includes(q) ||
        ins.title?.ar?.toLowerCase().includes(q) ||
        ins.slug?.toLowerCase().includes(q) ||
        ins.category?.en?.toLowerCase().includes(q)
      );
    });

    const toggleBlogSlug = (blogSlug: string) => {
      if (selectedSlugs.includes(blogSlug)) {
        onUpdateConfig({
          ...config,
          selectedSlugs: selectedSlugs.filter((s) => s !== blogSlug),
        });
      } else {
        onUpdateConfig({
          ...config,
          selectedSlugs: [...selectedSlugs, blogSlug],
        });
      }
    };

    return (
      <div className="space-y-5">
        {/* Visibility Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Display Insights / Blogs Carousel Section on This Page
            </span>
            <span className="text-[11px] text-slate-500">
              Toggle visibility of the &ldquo;Our Latest Thinking&rdquo; blog carousel on the live page
            </span>
          </div>
          <input
            type="checkbox"
            checked={config.enabled !== false}
            onChange={(e) => onUpdateConfig({ ...config, enabled: e.target.checked })}
            className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
          />
        </div>

        {/* Section Heading & CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Section Heading Title (EN)
            </label>
            <input
              type="text"
              value={config.title?.en || ''}
              onChange={(e) =>
                onUpdateConfig({
                  ...config,
                  title: { ...(config.title || { en: '', ar: '' }), en: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              عنوان قسم المدونات والرؤى (AR)
            </label>
            <input
              type="text"
              dir="rtl"
              value={config.title?.ar || ''}
              onChange={(e) =>
                onUpdateConfig({
                  ...config,
                  title: { ...(config.title || { en: '', ar: '' }), ar: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
            />
          </div>
        </div>

        <RichTextEditor
          label="Section Subtitle / Description"
          rows={2}
          valueEn={config.subtitle?.en || ''}
          valueAr={config.subtitle?.ar || ''}
          onChangeEn={(val) =>
            onUpdateConfig({
              ...config,
              subtitle: { ...(config.subtitle || { en: '', ar: '' }), en: val },
            })
          }
          onChangeAr={(val) =>
            onUpdateConfig({
              ...config,
              subtitle: { ...(config.subtitle || { en: '', ar: '' }), ar: val },
            })
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Action Button Label (EN)
            </label>
            <input
              type="text"
              value={config.ctaText?.en || ''}
              onChange={(e) =>
                onUpdateConfig({
                  ...config,
                  ctaText: { ...(config.ctaText || { en: '', ar: '' }), en: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              نص الزر (AR)
            </label>
            <input
              type="text"
              dir="rtl"
              value={config.ctaText?.ar || ''}
              onChange={(e) =>
                onUpdateConfig({
                  ...config,
                  ctaText: { ...(config.ctaText || { en: '', ar: '' }), ar: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Action Button Link (Href)
            </label>
            <input
              type="text"
              value={config.ctaHref || '/insights'}
              onChange={(e) => onUpdateConfig({ ...config, ctaHref: e.target.value })}
              className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
            />
          </div>
        </div>

        {/* Selection Mode & Max Blogs Controls */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Blogs / Insights Carousel Source &amp; Maximum Cards
              </span>
              <span className="text-[11px] text-slate-500">
                Choose which blogs appear in the carousel on this page and how many cards to load
              </span>
            </div>

            {/* Max Blogs Count Control */}
            <div className="flex items-center gap-2 shrink-0">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Max Blogs in Carousel:
              </label>
              <div className="flex items-center gap-1">
                {[2, 3, 4, 5, 6, 8].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onUpdateConfig({ ...config, maxCount: n })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      maxCount === n
                        ? 'bg-persici-crimson text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={maxCount}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      maxCount: Math.max(1, Math.min(24, Number(e.target.value) || 4)),
                    })
                  }
                  className="w-16 px-2.5 py-1 text-xs font-bold text-center border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3 Mode Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onUpdateConfig({ ...config, selectionMode: 'custom' })}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'custom'
                  ? 'bg-white border-persici-crimson ring-2 ring-persici-crimson/15 shadow-xs'
                  : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              <TbListCheck
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  mode === 'custom' ? 'text-persici-crimson' : 'text-slate-400'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-slate-900">1. Custom / Curated Blogs</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Hand-pick specific blogs from the Insights library or edit custom carousel cards
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateConfig({ ...config, selectionMode: 'category' })}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'category'
                  ? 'bg-white border-persici-crimson ring-2 ring-persici-crimson/15 shadow-xs'
                  : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              <TbFilter
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  mode === 'category' ? 'text-persici-crimson' : 'text-slate-400'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-slate-900">2. By Blog Category</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Automatically load blogs matching a specific category (e.g. Article, Research)
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateConfig({ ...config, selectionMode: 'featured' })}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'featured'
                  ? 'bg-white border-persici-crimson ring-2 ring-persici-crimson/15 shadow-xs'
                  : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              <TbStar
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  mode === 'featured' ? 'text-persici-crimson' : 'text-slate-400'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-slate-900">3. Featured Blogs Only</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Automatically load blogs marked as Featured in the Insights Hub
                </div>
              </div>
            </button>
          </div>

          {mode === 'category' && (
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Target Blog / Insight Category
                </label>
                <span className="text-[11px] text-slate-500">
                  All active blogs in this category will be loaded into the carousel up to{' '}
                  {maxCount} cards
                </span>
              </div>
              <select
                value={config.categorySlug || 'all'}
                onChange={(e) => onUpdateConfig({ ...config, categorySlug: e.target.value })}
                className="px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 min-w-[240px]"
              >
                {insightCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === 'custom' && (
            <div className="space-y-4">
              {/* Option A: Quick-Pick from Published Blogs in DB */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Pick Directly from Insights &amp; Blogs Library ({selectedSlugs.length}{' '}
                      pinned)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Check blogs below to pin them directly from the Insights database, or leave
                      unchecked to use the Page&apos;s Curated Cards below.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedSlugs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onUpdateConfig({ ...config, selectedSlugs: [] })}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                      >
                        Reset to Page Curated Cards
                      </button>
                    )}
                    <div className="relative w-full sm:w-56">
                      <TbSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search published blogs..."
                        value={insightSearch}
                        onChange={(e) => setInsightSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {filteredInsightsCatalog.map((ins) => {
                    const isChecked = selectedSlugs.includes(ins.slug);
                    return (
                      <label
                        key={ins.slug}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-red-50/50 border-persici-crimson/40'
                            : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBlogSlug(ins.slug)}
                          className="mt-0.5 w-4 h-4 accent-persici-crimson rounded cursor-pointer shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 truncate">{ins.title?.en}</div>
                          <div className="text-[11px] text-slate-500 truncate" dir="rtl">
                            {ins.title?.ar}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded text-slate-600">
                              {ins.category?.en || ins.categorySlug}
                            </span>
                            <span className="text-[10px] text-slate-400">{ins.date}</span>
                            {ins.featured && (
                              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded">
                                ★ Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Option B: Page Curated Insight Cards Editor */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Page Curated Insight Cards ({customItems.length} cards)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Edit the exact text, tags, dates, or links of this page&apos;s curated blog
                      cards
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateCustomItems([
                        ...customItems,
                        {
                          id: `ins-${Date.now()}`,
                          tag: { en: 'Article', ar: 'مقال' },
                          title: { en: 'New Strategic Insight', ar: 'مقال استراتيجي جديد' },
                          description: { en: '', ar: '' },
                          date: { en: 'October 2026', ar: 'أكتوبر ٢٠٢٦' },
                          image: '/images/insights/data-into-value-office.jpg',
                          href: '/insights/data-into-value',
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
                  {customItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-bold text-slate-800">
                          Blog Card #{idx + 1}: {item.title?.en || 'Insight'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() =>
                              onUpdateCustomItems(moveItem(customItems, idx, 'up'))
                            }
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                          >
                            <TbArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === customItems.length - 1}
                            onClick={() =>
                              onUpdateCustomItems(moveItem(customItems, idx, 'down'))
                            }
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                          >
                            <TbArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...customItems];
                              copy.splice(idx, 1);
                              onUpdateCustomItems(copy);
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            <TbTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                            Category Tag (EN)
                          </label>
                          <input
                            type="text"
                            value={item.tag?.en || ''}
                            onChange={(e) => {
                              const copy = [...customItems];
                              copy[idx] = {
                                ...item,
                                tag: { ...(item.tag || {}), en: e.target.value },
                              };
                              onUpdateCustomItems(copy);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                            التصنيف (AR)
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={item.tag?.ar || ''}
                            onChange={(e) => {
                              const copy = [...customItems];
                              copy[idx] = {
                                ...item,
                                tag: { ...(item.tag || {}), ar: e.target.value },
                              };
                              onUpdateCustomItems(copy);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                            Date (EN)
                          </label>
                          <input
                            type="text"
                            value={item.date?.en || ''}
                            onChange={(e) => {
                              const copy = [...customItems];
                              copy[idx] = {
                                ...item,
                                date: { ...(item.date || {}), en: e.target.value },
                              };
                              onUpdateCustomItems(copy);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                            التاريخ (AR)
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={item.date?.ar || ''}
                            onChange={(e) => {
                              const copy = [...customItems];
                              copy[idx] = {
                                ...item,
                                date: { ...(item.date || {}), ar: e.target.value },
                              };
                              onUpdateCustomItems(copy);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-arabic"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                            Headline Title (EN)
                          </label>
                          <input
                            type="text"
                            value={item.title?.en || ''}
                            onChange={(e) => {
                              const copy = [...customItems];
                              copy[idx] = {
                                ...item,
                                title: { ...(item.title || {}), en: e.target.value },
                              };
                              onUpdateCustomItems(copy);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                            عنوان المقال (AR)
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={item.title?.ar || ''}
                            onChange={(e) => {
                              const copy = [...customItems];
                              copy[idx] = {
                                ...item,
                                title: { ...(item.title || {}), ar: e.target.value },
                              };
                              onUpdateCustomItems(copy);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg font-arabic"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                            Target Link (Href)
                          </label>
                          <input
                            type="text"
                            value={item.href || ''}
                            onChange={(e) => {
                              const copy = [...customItems];
                              copy[idx] = { ...item, href: e.target.value };
                              onUpdateCustomItems(copy);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                            Cover Image URL
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={item.image || ''}
                              onChange={(e) => {
                                const copy = [...customItems];
                                copy[idx] = { ...item, image: e.target.value };
                                onUpdateCustomItems(copy);
                              }}
                              className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                openMediaPicker((url) => {
                                  const copy = [...customItems];
                                  copy[idx] = { ...item, image: url };
                                  onUpdateCustomItems(copy);
                                }, 'image')
                              }
                              className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                            >
                              Pick R2
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Live Resolved Carousel Preview */}
          <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                ✓ Live Carousel Preview: {previewBlogs.length}{' '}
                {previewBlogs.length === 1 ? 'Blog' : 'Blogs'} Will Be Loaded
              </span>
              <Link
                href={`/${lang}/dashboard/insights`}
                className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white underline"
              >
                <span>Manage All Blogs &amp; Insights</span>
                <TbExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {previewBlogs.map((b, idx) => (
                <div
                  key={b.id || idx}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/10 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-persici-crimson text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate">{b.titleEn}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {b.tagEn} • {b.href}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // RENDER 1: SOLUTIONS OVERVIEW HUB (`slug === 'solutions'`)
  // =========================================================================
  if (isHub && hubData) {
    const updateHub = (patch: Partial<SolutionsHubCmsData>) => {
      setPageData((prev) => ({
        ...hubData,
        ...prev,
        ...patch,
      }));
    };

    return (
      <div className="space-y-5">
        {/* Top Quick-Switcher Bar across all 10 Solution Pages */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TbLayersSubtract className="w-4 h-4 text-persici-crimson" />
              <span>Solutions Ecosystem Pages (Overview Hub + 9 Featured Solutions)</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Click any page tab to configure its content, Client Stories &amp; Blogs
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SOLUTION_NAV_ITEMS.map((item) => {
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

        {/* SECTION 1: HERO & SEO */}
        <SectionAccordion
          number={1}
          title="SolutionsHeroSection • Overview Hero Banner & SEO Metadata"
          description="Breadcrumb tags, main H1 headline, rich-text subtitle with alignment, primary CTA, hero background image, and SEO metadata"
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
                  Toggle visibility of the top Hero Banner on the Solutions Overview Hub
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
                  Primary Tag / Breadcrumb (EN)
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

        {/* SECTION 2: 9 SOLUTIONS OFFERINGS GRID */}
        <SectionAccordion
          number={2}
          title="SolutionsOfferingsGrid • 9 Core Solutions Cards"
          description="Section title, rich-text subtitle, and the 9 interactive solution cards with custom icons, vector diagrams, descriptions, and links"
          onSave={onSave}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display Offerings Grid Section
                </span>
                <span className="text-[11px] text-slate-500">
                  Toggle visibility of the 9 Solutions Offerings Grid
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
                  Offerings Heading Title (EN)
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
                  عنوان الحلول التقنية (AR)
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
              label="Offerings Section Subtitle"
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
                  Solutions Offerings Cards ({hubData.offeringsList.length})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateHub({
                      offeringsList: [
                        ...hubData.offeringsList,
                        {
                          slug: `solution-${Date.now()}`,
                          tag: { en: 'Solution', ar: 'حل متكامل' },
                          title: { en: 'New Solution Offering', ar: 'حل جديد' },
                          description: { en: '', ar: '' },
                          icon: '/icons/solutions/ai-integration.svg',
                          diagramType: 'grid-dots',
                          href: '/solutions/ai-integration',
                          order: hubData.offeringsList.length + 1,
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson cursor-pointer"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Offering Card</span>
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
                        href={`/${lang}/dashboard/pages/solutions-${item.slug}`}
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
      </div>
    );
  }

  // =========================================================================
  // RENDER 2: 9 FEATURED SOLUTION PAGES (`slug.startsWith('solutions-')`)
  // =========================================================================
  if (!featData) return null;

  const updateFeat = (patch: Partial<SolutionFeatureCmsData>) => {
    setPageData((prev) => ({
      ...featData,
      ...prev,
      ...patch,
    }));
  };

  const isEcommerce = featData.slug === 'ecommerce-growth';

  return (
    <div className="space-y-5">
      {/* Top Quick-Switcher Bar across all 10 Solution Pages */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <TbLayersSubtract className="w-4 h-4 text-persici-crimson" />
            <span>Solutions Ecosystem Pages (Overview Hub + 9 Featured Solutions)</span>
          </span>
          <span className="text-[11px] text-slate-500">
            Click any page tab to configure its content, Client Stories &amp; Blogs
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SOLUTION_NAV_ITEMS.map((item) => {
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
        description="Breadcrumb tags, H1 headline, rich-text subtitle with alignment, CTA button, background image, and SEO metadata"
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

      {/* E-COMMERCE EXCLUSIVE: PARTNER SHOWCASE & VIDEO */}
      {isEcommerce && featData.partnerShowcase && (
        <SectionAccordion
          number={2}
          title="EcommercePartnerShowcase • Official Partners & Video Showcase"
          description="Official Salla/Shopify partner badge, title, rich-text description, showcase video, and 8 partner logos"
          onSave={onSave}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                Display E-Commerce Partner Showcase Section
              </span>
              <input
                type="checkbox"
                checked={featData.partnerShowcase.enabled !== false}
                onChange={(e) =>
                  updateFeat({
                    partnerShowcase: {
                      ...featData.partnerShowcase!,
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
                  Partner Badge (EN)
                </label>
                <input
                  type="text"
                  value={featData.partnerShowcase.badge.en}
                  onChange={(e) =>
                    updateFeat({
                      partnerShowcase: {
                        ...featData.partnerShowcase!,
                        badge: {
                          ...featData.partnerShowcase!.badge,
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
                  شارة الشراكة (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={featData.partnerShowcase.badge.ar}
                  onChange={(e) =>
                    updateFeat({
                      partnerShowcase: {
                        ...featData.partnerShowcase!,
                        badge: {
                          ...featData.partnerShowcase!.badge,
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
                  Section Title (EN)
                </label>
                <input
                  type="text"
                  value={featData.partnerShowcase.title.en}
                  onChange={(e) =>
                    updateFeat({
                      partnerShowcase: {
                        ...featData.partnerShowcase!,
                        title: {
                          ...featData.partnerShowcase!.title,
                          en: e.target.value,
                        },
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
                  value={featData.partnerShowcase.title.ar}
                  onChange={(e) =>
                    updateFeat({
                      partnerShowcase: {
                        ...featData.partnerShowcase!,
                        title: {
                          ...featData.partnerShowcase!.title,
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Partner Showcase Description"
              rows={2}
              valueEn={featData.partnerShowcase.description.en}
              valueAr={featData.partnerShowcase.description.ar}
              onChangeEn={(val) =>
                updateFeat({
                  partnerShowcase: {
                    ...featData.partnerShowcase!,
                    description: {
                      ...featData.partnerShowcase!.description,
                      en: val,
                    },
                  },
                })
              }
              onChangeAr={(val) =>
                updateFeat({
                  partnerShowcase: {
                    ...featData.partnerShowcase!,
                    description: {
                      ...featData.partnerShowcase!.description,
                      ar: val,
                    },
                  },
                })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Showcase Video URL (R2)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featData.partnerShowcase.video.src}
                    onChange={(e) =>
                      updateFeat({
                        partnerShowcase: {
                          ...featData.partnerShowcase!,
                          video: {
                            ...featData.partnerShowcase!.video,
                            src: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker(
                        (url) =>
                          updateFeat({
                            partnerShowcase: {
                              ...featData.partnerShowcase!,
                              video: {
                                ...featData.partnerShowcase!.video,
                                src: url,
                              },
                            },
                          }),
                        'video'
                      )
                    }
                    className="inline-flex items-center gap-1 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-persici-crimson shrink-0 cursor-pointer"
                  >
                    <TbVideo className="w-4 h-4" />
                    <span>Pick R2</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Video Poster Thumbnail (R2)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featData.partnerShowcase.video.poster}
                    onChange={(e) =>
                      updateFeat({
                        partnerShowcase: {
                          ...featData.partnerShowcase!,
                          video: {
                            ...featData.partnerShowcase!.video,
                            poster: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker(
                        (url) =>
                          updateFeat({
                            partnerShowcase: {
                              ...featData.partnerShowcase!,
                              video: {
                                ...featData.partnerShowcase!.video,
                                poster: url,
                              },
                            },
                          }),
                        'image'
                      )
                    }
                    className="inline-flex items-center gap-1 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-persici-crimson shrink-0 cursor-pointer"
                  >
                    <TbPhoto className="w-4 h-4" />
                    <span>Pick R2</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Partner Logos Grid */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Certified Partner Logos ({featData.partnerShowcase.partners.length})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateFeat({
                      partnerShowcase: {
                        ...featData.partnerShowcase!,
                        partners: [
                          ...featData.partnerShowcase!.partners,
                          {
                            name: 'New Partner',
                            role: { en: 'Certified Partner', ar: 'شريك معتمد' },
                            logo: '/images/clients/salla.png',
                          },
                        ],
                      },
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson cursor-pointer"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Partner</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {featData.partnerShowcase.partners.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => {
                          const copy = [...featData.partnerShowcase!.partners];
                          copy[idx] = { ...p, name: e.target.value };
                          updateFeat({
                            partnerShowcase: {
                              ...featData.partnerShowcase!,
                              partners: copy,
                            },
                          });
                        }}
                        className="px-2.5 py-1 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...featData.partnerShowcase!.partners];
                          copy.splice(idx, 1);
                          updateFeat({
                            partnerShowcase: {
                              ...featData.partnerShowcase!,
                              partners: copy,
                            },
                          });
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={p.logo}
                        onChange={(e) => {
                          const copy = [...featData.partnerShowcase!.partners];
                          copy[idx] = { ...p, logo: e.target.value };
                          updateFeat({
                            partnerShowcase: {
                              ...featData.partnerShowcase!,
                              partners: copy,
                            },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker((url) => {
                            const copy = [...featData.partnerShowcase!.partners];
                            copy[idx] = { ...p, logo: url };
                            updateFeat({
                              partnerShowcase: {
                                ...featData.partnerShowcase!,
                                partners: copy,
                              },
                            });
                          }, 'image')
                        }
                        className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        Pick R2
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionAccordion>
      )}

      {/* SECTION 2: CORE CAPABILITIES / OFFERINGS GRID */}
      <SectionAccordion
        number={isEcommerce ? 3 : 2}
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
                        icon: '/icons/solutions/ai-integration.svg',
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

      {/* SECTION 3: WHY IT MATTERS */}
      <SectionAccordion
        number={isEcommerce ? 4 : 3}
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

      {/* SECTION 4: STRATEGIC BENEFITS STRIP */}
      <SectionAccordion
        number={isEcommerce ? 5 : 4}
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

      {/* SECTION 5: DOMAIN VERTICALS */}
      <SectionAccordion
        number={isEcommerce ? 6 : 5}
        title="VerticalsSection • Domain Verticals & Industry Applications"
        description="Industry vertical cards with monospace numbers (01-05), tags, titles, rich-text descriptions, and capability checklists"
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
                عنوان القطاعات (AR)
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
                Industry Vertical Cards ({featData.verticals.length})
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
                        tag: { en: 'Sector', ar: 'قطاع' },
                        title: { en: 'New Industry Vertical', ar: 'قطاع صناعي جديد' },
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

      {/* SECTION 6: TECHNOLOGY STACK PODS */}
      <SectionAccordion
        number={isEcommerce ? 7 : 6}
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
                          value={t.badge || ''}
                          onChange={(e) => {
                            const copy = [...featData.techStackPods];
                            const techs = [...pod.technologies];
                            techs[tIdx] = { ...t, badge: e.target.value };
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

      {/* SECTION 7: FEATURED CLIENT STORIES SELECTOR */}
      <SectionAccordion
        number={isEcommerce ? 8 : 7}
        title="FeaturedClientStories • Dynamic Client Stories Selector"
        description="Select Client Stories by Custom Order, Category, or Featured status, and control the maximum number of stories shown on this page"
        onSave={onSave}
      >
        {renderClientStoriesSelector(featData.clientStoriesConfig, (nextCfg) =>
          updateFeat({ clientStoriesConfig: nextCfg })
        )}
      </SectionAccordion>

      {/* SECTION 8: DELIVERY ENGINE */}
      <SectionAccordion
        number={isEcommerce ? 9 : 8}
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

      {/* SECTION 9: BLOGS / INSIGHTS CAROUSEL SELECTOR */}
      <SectionAccordion
        number={isEcommerce ? 10 : 9}
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

      {/* SECTION 10: CLIENT REVIEW */}
      <SectionAccordion
        number={isEcommerce ? 11 : 10}
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

      {/* SECTION 11: FAQS */}
      <SectionAccordion
        number={isEcommerce ? 12 : 11}
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
