'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SectionAccordion } from './section-accordion';
import { RichTextEditor } from './rich-text-editor';
import {
  TbPlus,
  TbTrash,
  TbPhoto,
  TbArrowUp,
  TbArrowDown,
  TbExternalLink,
  TbSearch,
  TbListCheck,
  TbStar,
  TbLayersSubtract,
} from 'react-icons/tb';
import {
  extractHowWeDoItFeatureSlug,
  normalizeHowWeDoItHubPageData,
  normalizeHowWeDoItFeaturePageData,
  type HowWeDoItHubCmsData,
  type HowWeDoItFeatureCmsData,
  type HowWeDoItClientStoriesSectionConfig,
  type HowWeDoItInsightsSectionConfig,
  type HowWeDoItFeatureOfferingItem,
  type HowWeDoItEngagementStep,
  type HowWeDoItTechStackPod,
} from '@/app/[lang]/(site)/how-we-do-it/_how-we-do-it/data/how-we-do-it-cms.data';
import { clientStoriesData } from '@/app/[lang]/(site)/client-stories/_client-stories/data/client-stories.data';
import { insightsData } from '@/app/[lang]/(site)/insights/_insights/data/insights.data';
import type { ClientStoryDetail } from '@/app/[lang]/(site)/client-stories/_client-stories/types';
import type { InsightDetail } from '@/app/[lang]/(site)/insights/_insights/types';
import type {
  SolutionDiagramType,
  LocalizedString,
  SolutionBenefitItem,
  SolutionFaqItem,
} from '@shared/types';

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
  'de-microservices-mesh',
  'de-api-gateway-router',
  'de-cicd-pipeline-flow',
  'ux-strategy-compass',
  'ux-wireframe-blueprint',
  'ux-journey-flowchart',
  'ux-design-token-matrix',
  'ux-prototype-interaction',
  'ce-omnichannel-orbit-matrix',
  'ce-personalization-nexus',
];

const HOW_WE_DO_IT_NAV_ITEMS: Array<{ slug: string; label: string }> = [
  { slug: 'how-we-do-it', label: 'How We Do It Overview Hub' },
  { slug: 'how-we-do-it-strategy-consulting', label: '1. Strategy & Consulting' },
  { slug: 'how-we-do-it-digital-transformation-framework', label: '2. Digital Transformation Framework' },
  { slug: 'how-we-do-it-product-management', label: '3. Product Management' },
  { slug: 'how-we-do-it-engineering-technology', label: '4. Engineering & Technology' },
  { slug: 'how-we-do-it-experience-transformation', label: '5. Experience Transformation' },
];

export interface HowWeDoItPageCmsEditorProps {
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

export function HowWeDoItPageCmsEditor({
  slug,
  lang,
  pageData,
  setPageData,
  onSave,
  openMediaPicker,
}: HowWeDoItPageCmsEditorProps) {
  const isHub = slug === 'how-we-do-it';
  const featureSlug = isHub ? null : extractHowWeDoItFeatureSlug(slug);

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

  // Normalize current data against canonical defaults so no field is ever empty or lost
  const hubData: HowWeDoItHubCmsData | null = useMemo(
    () => (isHub ? normalizeHowWeDoItHubPageData(pageData as Partial<HowWeDoItHubCmsData>) : null),
    [isHub, pageData]
  );

  const featData: HowWeDoItFeatureCmsData | null = useMemo(
    () =>
      !isHub && featureSlug
        ? normalizeHowWeDoItFeaturePageData(featureSlug, pageData as Partial<HowWeDoItFeatureCmsData>)
        : null,
    [isHub, featureSlug, pageData]
  );

  // Story categories for category filtering
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

  // Insight categories for category filtering
  const insightCategories = useMemo(() => {
    const map = new Map<string, string>();
    map.set('all', 'All Categories');
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

  // ---------------------------------------------------------------------------
  // Reusable Client Stories Configurator Sub-View (Matching Solutions & Industries)
  // ---------------------------------------------------------------------------
  const renderClientStoriesSelector = (
    config: HowWeDoItClientStoriesSectionConfig,
    onUpdateConfig: (next: HowWeDoItClientStoriesSectionConfig) => void
  ) => {
    const mode = config.selectionMode || 'custom';
    const maxCount = Math.max(1, Number(config.maxCount) || 3);
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
              placeholder="e.g. Proven Enterprise Transformations"
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
                Choose how Client Stories are populated on this page and how many cards to display
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
                      maxCount: Math.max(1, Math.min(24, Number(e.target.value) || 3)),
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
              <TbStar
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  mode === 'category' ? 'text-persici-crimson' : 'text-slate-400'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-slate-900">2. Category Filter</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Automatically pull all stories matching a specific domain category
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
                <div className="text-xs font-bold text-slate-900">3. Featured Stories</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Automatically show globally marked Featured Client Stories
                </div>
              </div>
            </button>
          </div>

          {/* Mode-Specific Controls */}
          {mode === 'category' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Select Target Category:
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

  // ---------------------------------------------------------------------------
  // Reusable Blogs / Insights Selector Sub-View (Matching Solutions & Industries)
  // ---------------------------------------------------------------------------
  const renderInsightsSelector = (
    config: HowWeDoItInsightsSectionConfig,
    onUpdateConfig: (next: HowWeDoItInsightsSectionConfig) => void
  ) => {
    const mode = config.selectionMode || 'custom';
    const maxCount = Math.max(1, Number(config.maxCount) || 3);
    const selectedSlugs = Array.isArray(config.selectedSlugs) ? config.selectedSlugs : [];

    // Compute live preview of blogs that will appear in the carousel
    const previewBlogs = (() => {
      if (mode === 'featured') {
        const feat = allInsights.filter((i) => i.featured);
        return (feat.length > 0 ? feat : allInsights).slice(0, maxCount);
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
        return (filtered.length > 0 ? filtered : allInsights).slice(0, maxCount);
      }
      // custom mode
      const list: InsightDetail[] = [];
      for (const sl of selectedSlugs) {
        const found = allInsights.find((i) => i.slug === sl || i.id === sl);
        if (found) list.push(found);
      }
      return (list.length > 0 ? list : allInsights).slice(0, maxCount);
    })();

    const filteredCatalog = allInsights.filter((i) => {
      if (!insightSearch.trim()) return true;
      const q = insightSearch.toLowerCase();
      return (
        i.title?.en?.toLowerCase().includes(q) ||
        i.title?.ar?.toLowerCase().includes(q) ||
        i.category?.en?.toLowerCase().includes(q) ||
        i.slug?.toLowerCase().includes(q)
      );
    });

    const toggleInsightSlug = (insightSlug: string) => {
      if (selectedSlugs.includes(insightSlug)) {
        onUpdateConfig({
          ...config,
          selectedSlugs: selectedSlugs.filter((s) => s !== insightSlug),
        });
      } else {
        onUpdateConfig({
          ...config,
          selectedSlugs: [...selectedSlugs, insightSlug],
        });
      }
    };

    return (
      <div className="space-y-5">
        {/* Visibility Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Display Blogs &amp; Insights Carousel Section
            </span>
            <span className="text-[11px] text-slate-500">
              Toggle visibility of the insights articles carousel on the live page
            </span>
          </div>
          <input
            type="checkbox"
            checked={config.enabled !== false}
            onChange={(e) => onUpdateConfig({ ...config, enabled: e.target.checked })}
            className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
          />
        </div>

        {/* Section Header Copy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Section Title (EN)
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
              عنوان قسم المقالات (AR)
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              CTA Button Label (EN)
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
              نص زر الرابط (AR)
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
        </div>

        {/* Selection Mode & Max Count Controls */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Blogs &amp; Insights Selection Source &amp; Carousel Limit
              </span>
              <span className="text-[11px] text-slate-500">
                Choose how articles are populated in the carousel and how many cards to display
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Max Articles:
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
                      maxCount: Math.max(1, Math.min(24, Number(e.target.value) || 3)),
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
                  Hand-pick exact articles in your custom display order ({selectedSlugs.length}{' '}
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
              <TbStar
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  mode === 'category' ? 'text-persici-crimson' : 'text-slate-400'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-slate-900">2. Category Filter</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Automatically pull all articles matching a specific topic category
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
                <div className="text-xs font-bold text-slate-900">3. Featured Insights</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Automatically display globally featured articles and research
                </div>
              </div>
            </button>
          </div>

          {/* Category Dropdown */}
          {mode === 'category' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Select Article Category:
                </label>
                <span className="text-[11px] text-slate-500">
                  All active articles in this category will be shown up to {maxCount}
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

          {/* Custom Selection Picker */}
          {mode === 'custom' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 block">
                  Selected Custom Articles Order ({selectedSlugs.length} selected • Top {maxCount}{' '}
                  will show)
                </span>
                {selectedSlugs.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">
                    No articles selected yet. Check articles from the catalog below.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedSlugs.map((sl, idx) => {
                      const ins = allInsights.find((i) => i.slug === sl || i.id === sl);
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
                              <span className="font-semibold">{ins?.title?.en || sl}</span>
                              {ins?.category && (
                                <span className="text-[11px] text-slate-500 ml-2">
                                  ({ins.category?.en || ins.categorySlug})
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
                              onClick={() => toggleInsightSlug(sl)}
                              className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              title="Remove"
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

              {/* Searchable Catalog */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Choose from All Articles ({allInsights.length} available)
                  </span>
                  <div className="relative w-full sm:w-64">
                    <TbSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search articles by title or topic..."
                      value={insightSearch}
                      onChange={(e) => setInsightSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {filteredCatalog.map((ins) => {
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
                          onChange={() => toggleInsightSlug(ins.slug)}
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
            </div>
          )}

          {/* Live Resolved Preview */}
          <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                ✓ Live Page Preview: {previewBlogs.length} Articles Will Be Displayed
              </span>
              <Link
                href={`/${lang}/dashboard/content/insights`}
                className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white underline"
              >
                <span>Manage All Articles</span>
                <TbExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {previewBlogs.map((b, idx) => (
                <div
                  key={b.slug || idx}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/10 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-persici-crimson text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate">{b.title?.en}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {b.category?.en || b.categorySlug}
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
  // RENDER 1: OVERVIEW HUB (`slug === 'how-we-do-it'`)
  // =========================================================================
  if (isHub && hubData) {
    const updateHub = (patch: Partial<HowWeDoItHubCmsData>) => {
      setPageData((prev) => ({
        ...hubData,
        ...prev,
        ...patch,
      }));
    };

    return (
      <div className="space-y-5">
        {/* Top Quick-Switcher Bar across all 6 How We Do It Pages */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TbLayersSubtract className="w-4 h-4 text-persici-crimson" />
              <span>How We Do It Ecosystem Pages (Overview Hub + 5 Methodology Pages)</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Click any page tab to configure its content, Client Stories &amp; Blogs
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {HOW_WE_DO_IT_NAV_ITEMS.map((item) => {
              const active =
                item.slug === slug ||
                (slug.startsWith('how-we-do-it-') && item.slug === slug) ||
                (item.slug === `how-we-do-it-${slug}`);
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
                  Toggle visibility of the top Hero section on the How We Do It Hub
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
                          ...(hubData.seo || {
                            title: { en: '', ar: '' },
                            description: { en: '', ar: '' },
                          }),
                          title: {
                            ...(hubData.seo?.title || { en: '', ar: '' }),
                            en: e.target.value,
                          },
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
                          ...(hubData.seo || {
                            title: { en: '', ar: '' },
                            description: { en: '', ar: '' },
                          }),
                          title: {
                            ...(hubData.seo?.title || { en: '', ar: '' }),
                            ar: e.target.value,
                          },
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
                          ...(hubData.seo || {
                            title: { en: '', ar: '' },
                            description: { en: '', ar: '' },
                          }),
                          description: {
                            ...(hubData.seo?.description || { en: '', ar: '' }),
                            en: e.target.value,
                          },
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
                          ...(hubData.seo || {
                            title: { en: '', ar: '' },
                            description: { en: '', ar: '' },
                          }),
                          description: {
                            ...(hubData.seo?.description || { en: '', ar: '' }),
                            ar: e.target.value,
                          },
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

        {/* SECTION 2: 5 CORE METHODOLOGY PILLARS GRID */}
        <SectionAccordion
          number={2}
          title="OfferingsGrid • The 5 Core Methodology Pillars"
          description="Section title, subtitle, and the 5 specialized methodology cards with vector diagrams, descriptions, and subpage links"
          isOpenDefault={false}
          onSave={onSave}
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                Display Methodology Pillars Grid
              </span>
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
                  Section Title (EN)
                </label>
                <input
                  type="text"
                  value={hubData.offeringsTitle.en}
                  onChange={(e) =>
                    updateHub({
                      offeringsTitle: { ...hubData.offeringsTitle, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم الركائز (AR)
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
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Section Subtitle / Description"
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

            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                The 5 Specialized Methodology Cards
              </span>
              {hubData.offeringsList.map((card, idx) => (
                <div
                  key={card.slug || idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-persici-crimson font-mono flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-persici-crimson text-white text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{card.slug}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{card.href}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Card Tag (EN)
                      </label>
                      <input
                        type="text"
                        value={card.tag.en}
                        onChange={(e) => {
                          const copy = [...hubData.offeringsList];
                          copy[idx] = {
                            ...card,
                            tag: { ...card.tag, en: e.target.value },
                          };
                          updateHub({ offeringsList: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        شارة البطاقة (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={card.tag.ar}
                        onChange={(e) => {
                          const copy = [...hubData.offeringsList];
                          copy[idx] = {
                            ...card,
                            tag: { ...card.tag, ar: e.target.value },
                          };
                          updateHub({ offeringsList: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Card Title (EN)
                      </label>
                      <input
                        type="text"
                        value={card.title.en}
                        onChange={(e) => {
                          const copy = [...hubData.offeringsList];
                          copy[idx] = {
                            ...card,
                            title: { ...card.title, en: e.target.value },
                          };
                          updateHub({ offeringsList: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        عنوان البطاقة (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={card.title.ar}
                        onChange={(e) => {
                          const copy = [...hubData.offeringsList];
                          copy[idx] = {
                            ...card,
                            title: { ...card.title, ar: e.target.value },
                          };
                          updateHub({ offeringsList: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                      />
                    </div>
                  </div>

                  <RichTextEditor
                    label="Card Description"
                    rows={2}
                    valueEn={card.description.en}
                    valueAr={card.description.ar}
                    onChangeEn={(val) => {
                      const copy = [...hubData.offeringsList];
                      copy[idx] = {
                        ...card,
                        description: { ...card.description, en: val },
                      };
                      updateHub({ offeringsList: copy });
                    }}
                    onChangeAr={(val) => {
                      const copy = [...hubData.offeringsList];
                      copy[idx] = {
                        ...card,
                        description: { ...card.description, ar: val },
                      };
                      updateHub({ offeringsList: copy });
                    }}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Vector Architecture Diagram
                      </label>
                      <select
                        value={card.diagramType || 'grid-dots'}
                        onChange={(e) => {
                          const copy = [...hubData.offeringsList];
                          copy[idx] = {
                            ...card,
                            diagramType: e.target.value as SolutionDiagramType,
                          };
                          updateHub({ offeringsList: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 font-mono"
                      >
                        {DIAGRAM_TYPES.map((dt) => (
                          <option key={dt} value={dt}>
                            {dt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Target Page Route Href
                      </label>
                      <input
                        type="text"
                        value={card.href}
                        onChange={(e) => {
                          const copy = [...hubData.offeringsList];
                          copy[idx] = { ...card, href: e.target.value };
                          updateHub({ offeringsList: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionAccordion>

        {/* SECTION 3: SPEED TRANSFORMATION FRAMEWORK */}
        <SectionAccordion
          number={3}
          title="FrameworkSection • The SPEED Transformation Engine"
          description="Section title, narrative subtitle, and the 5 foundational SPEED execution pillars (Strategy, Product, Experience, Engineering, Data & AI)"
          isOpenDefault={false}
          onSave={onSave}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                Display SPEED Transformation Section
              </span>
              <input
                type="checkbox"
                checked={hubData.frameworkEnabled !== false}
                onChange={(e) => updateHub({ frameworkEnabled: e.target.checked })}
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Framework Section Title (EN)
                </label>
                <input
                  type="text"
                  value={hubData.frameworkTitle.en}
                  onChange={(e) =>
                    updateHub({
                      frameworkTitle: { ...hubData.frameworkTitle, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم محرك SPEED (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={hubData.frameworkTitle.ar}
                  onChange={(e) =>
                    updateHub({
                      frameworkTitle: { ...hubData.frameworkTitle, ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Framework Subtitle / Description"
              rows={2}
              valueEn={hubData.frameworkSubtitle.en}
              valueAr={hubData.frameworkSubtitle.ar}
              onChangeEn={(val) =>
                updateHub({
                  frameworkSubtitle: { ...hubData.frameworkSubtitle, en: val },
                })
              }
              onChangeAr={(val) =>
                updateHub({
                  frameworkSubtitle: { ...hubData.frameworkSubtitle, ar: val },
                })
              }
            />

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                The 5 SPEED Engine Pillars
              </span>
              {hubData.frameworkPillars.map((pillar, idx) => (
                <div
                  key={pillar.letter + idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-persici-crimson/10 text-persici-crimson font-mono font-bold text-xs flex items-center justify-center">
                      {pillar.letter}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Pillar {idx + 1}: {pillar.name.en} / {pillar.name.ar}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Pillar Name (EN)
                      </label>
                      <input
                        type="text"
                        value={pillar.name.en}
                        onChange={(e) => {
                          const copy = [...hubData.frameworkPillars];
                          copy[idx] = {
                            ...pillar,
                            name: { ...pillar.name, en: e.target.value },
                          };
                          updateHub({ frameworkPillars: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        اسم الركيزة (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={pillar.name.ar}
                        onChange={(e) => {
                          const copy = [...hubData.frameworkPillars];
                          copy[idx] = {
                            ...pillar,
                            name: { ...pillar.name, ar: e.target.value },
                          };
                          updateHub({ frameworkPillars: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                      />
                    </div>
                  </div>

                  <RichTextEditor
                    label="Pillar Description"
                    rows={2}
                    valueEn={pillar.description.en}
                    valueAr={pillar.description.ar}
                    onChangeEn={(val) => {
                      const copy = [...hubData.frameworkPillars];
                      copy[idx] = {
                        ...pillar,
                        description: { ...pillar.description, en: val },
                      };
                      updateHub({ frameworkPillars: copy });
                    }}
                    onChangeAr={(val) => {
                      const copy = [...hubData.frameworkPillars];
                      copy[idx] = {
                        ...pillar,
                        description: { ...pillar.description, ar: val },
                      };
                      updateHub({ frameworkPillars: copy });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </SectionAccordion>

        {/* SECTION 4: HIGH-VELOCITY AGILE DELIVERY PILLARS */}
        <SectionAccordion
          number={4}
          title="DeliveryEngineSection • High-Velocity Agile Delivery Pillars"
          description="Section title, rich-text subtitle, side delivery illustration asset, and the autonomous execution pods"
          isOpenDefault={false}
          onSave={onSave}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                Display Delivery Pillars Section
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
                  Delivery Section Title (EN)
                </label>
                <input
                  type="text"
                  value={hubData.deliveryTitle.en}
                  onChange={(e) =>
                    updateHub({
                      deliveryTitle: { ...hubData.deliveryTitle, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم سرعة التنفيذ (AR)
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
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Delivery Subtitle / Lead Narrative"
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
                Delivery Illustration Image Asset (R2)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hubData.deliveryImage || ''}
                  onChange={(e) => updateHub({ deliveryImage: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    openMediaPicker((url) => updateHub({ deliveryImage: url }), 'image')
                  }
                  className="inline-flex items-center gap-1 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-persici-crimson shrink-0 cursor-pointer"
                >
                  <TbPhoto className="w-4 h-4" />
                  <span>Pick R2</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Agile Execution Principles
              </span>
              {hubData.deliveryPillars.map((dp, idx) => (
                <div
                  key={dp.number || idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center">
                      {dp.number}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {dp.title.en}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Title (EN)
                      </label>
                      <input
                        type="text"
                        value={dp.title.en}
                        onChange={(e) => {
                          const copy = [...hubData.deliveryPillars];
                          copy[idx] = { ...dp, title: { ...dp.title, en: e.target.value } };
                          updateHub({ deliveryPillars: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        العنوان (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={dp.title.ar}
                        onChange={(e) => {
                          const copy = [...hubData.deliveryPillars];
                          copy[idx] = { ...dp, title: { ...dp.title, ar: e.target.value } };
                          updateHub({ deliveryPillars: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                      />
                    </div>
                  </div>

                  <RichTextEditor
                    label="Description"
                    rows={2}
                    valueEn={dp.description.en}
                    valueAr={dp.description.ar}
                    onChangeEn={(val) => {
                      const copy = [...hubData.deliveryPillars];
                      copy[idx] = { ...dp, description: { ...dp.description, en: val } };
                      updateHub({ deliveryPillars: copy });
                    }}
                    onChangeAr={(val) => {
                      const copy = [...hubData.deliveryPillars];
                      copy[idx] = { ...dp, description: { ...dp.description, ar: val } };
                      updateHub({ deliveryPillars: copy });
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
          description="Configure the client case studies showcase with custom ordering, category filter, or globally featured items"
          isOpenDefault={false}
          onSave={onSave}
        >
          {renderClientStoriesSelector(hubData.clientStoriesConfig, (nextCfg) =>
            updateHub({ clientStoriesConfig: nextCfg })
          )}
        </SectionAccordion>

        {/* SECTION 6: INSIGHTS & BLOGS CAROUSEL SELECTOR */}
        <SectionAccordion
          number={6}
          title="InsightsSection • Dynamic Blogs & Insights Carousel Selector"
          description="Configure the methodology articles and thought leadership carousel with custom order, category filtering, and count limit"
          isOpenDefault={false}
          onSave={onSave}
        >
          {renderInsightsSelector(hubData.insightsConfig, (nextCfg) =>
            updateHub({ insightsConfig: nextCfg })
          )}
        </SectionAccordion>

        {/* SECTION 7: EXECUTIVE TESTIMONIAL QUOTE */}
        <SectionAccordion
          number={7}
          title="ClientReviewSection • Executive Leadership Testimonial"
          description="Section quote text, author name, client organization/role, and optional leadership badge"
          isOpenDefault={false}
          onSave={onSave}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                Display Executive Testimonial Quote
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
                  Quote Eyebrow Badge (EN)
                </label>
                <input
                  type="text"
                  value={hubData.quoteBadge?.en || ''}
                  onChange={(e) =>
                    updateHub({
                      quoteBadge: { ...(hubData.quoteBadge || { en: '', ar: '' }), en: e.target.value },
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
                      quoteBadge: { ...(hubData.quoteBadge || { en: '', ar: '' }), ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Testimonial Quote Text"
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
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Role &amp; Company (EN)
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
                  المسمى المؤسسي (AR)
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

        {/* SECTION 8: FREQUENTLY ASKED QUESTIONS */}
        <SectionAccordion
          number={8}
          title="FaqSection • Frequently Asked Questions Accordion"
          description="Section title, subtitle, and bilingual Q&A items answering critical executive delivery questions"
          isOpenDefault={false}
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
                  Section Title (EN)
                </label>
                <input
                  type="text"
                  value={hubData.faqsTitle.en}
                  onChange={(e) =>
                    updateHub({
                      faqsTitle: { ...hubData.faqsTitle, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم الأسئلة الشائعة (AR)
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
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="FAQs Subtitle / Description"
              rows={2}
              valueEn={hubData.faqsSubtitle.en}
              valueAr={hubData.faqsSubtitle.ar}
              onChangeEn={(val) =>
                updateHub({ faqsSubtitle: { ...hubData.faqsSubtitle, en: val } })
              }
              onChangeAr={(val) =>
                updateHub({ faqsSubtitle: { ...hubData.faqsSubtitle, ar: val } })
              }
            />

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  FAQ Question &amp; Answer Items ({hubData.faqs.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next: SolutionFaqItem = {
                      question: { en: 'New Methodology Question', ar: 'سؤال جديد' },
                      answer: { en: 'Answer details here...', ar: 'تفاصيل الإجابة هنا...' },
                    };
                    updateHub({ faqs: [...hubData.faqs, next] });
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-persici-crimson transition-colors cursor-pointer"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add FAQ Item</span>
                </button>
              </div>

              {hubData.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="w-6 h-6 rounded bg-persici-crimson text-white text-xs font-bold flex items-center justify-center font-mono">
                      Q{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() =>
                          updateHub({ faqs: moveItem(hubData.faqs, idx, 'up') })
                        }
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <TbArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === hubData.faqs.length - 1}
                        onClick={() =>
                          updateHub({ faqs: moveItem(hubData.faqs, idx, 'down') })
                        }
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <TbArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...hubData.faqs];
                          copy.splice(idx, 1);
                          updateHub({ faqs: copy });
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                        title="Delete FAQ"
                      >
                        <TbTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Question (EN)
                      </label>
                      <input
                        type="text"
                        value={faq.question.en}
                        onChange={(e) => {
                          const copy = [...hubData.faqs];
                          copy[idx] = {
                            ...faq,
                            question: { ...faq.question, en: e.target.value },
                          };
                          updateHub({ faqs: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        السؤال (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={faq.question.ar}
                        onChange={(e) => {
                          const copy = [...hubData.faqs];
                          copy[idx] = {
                            ...faq,
                            question: { ...faq.question, ar: e.target.value },
                          };
                          updateHub({ faqs: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                      />
                    </div>
                  </div>

                  <RichTextEditor
                    label="Answer"
                    rows={2}
                    valueEn={faq.answer.en}
                    valueAr={faq.answer.ar}
                    onChangeEn={(val) => {
                      const copy = [...hubData.faqs];
                      copy[idx] = {
                        ...faq,
                        answer: { ...faq.answer, en: val },
                      };
                      updateHub({ faqs: copy });
                    }}
                    onChangeAr={(val) => {
                      const copy = [...hubData.faqs];
                      copy[idx] = {
                        ...faq,
                        answer: { ...faq.answer, ar: val },
                      };
                      updateHub({ faqs: copy });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </SectionAccordion>

        {/* SECTION 9: SHARED CONTACT SECTION */}
        <SectionAccordion
          number={9}
          title="HomeContactSection • Shared Contact &amp; Consultation Form"
          description="Toggle whether the global contact form section is displayed at the bottom of the How We Do It Hub"
          isOpenDefault={false}
          onSave={onSave}
        >
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Enable Bottom Contact Section
              </span>
              <span className="text-[11px] text-slate-500">
                Display the global consultation and contact form section at the bottom of the page
              </span>
            </div>
            <input
              type="checkbox"
              checked={hubData.contactEnabled !== false}
              onChange={(e) => updateHub({ contactEnabled: e.target.checked })}
              className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
            />
          </div>
        </SectionAccordion>
      </div>
    );
  }

  // =========================================================================
  // RENDER 2: 5 METHODOLOGY SUBPAGES (`slug.startsWith('how-we-do-it-')`)
  // =========================================================================
  if (!featData || !featureSlug) return null;

  const updateFeat = (patch: Partial<HowWeDoItFeatureCmsData>) => {
    setPageData((prev) => ({
      ...featData,
      ...prev,
      ...patch,
    }));
  };

  return (
    <div className="space-y-5">
      {/* Top Quick-Switcher Bar across all 6 How We Do It Pages */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <TbLayersSubtract className="w-4 h-4 text-persici-crimson" />
            <span>How We Do It Ecosystem Pages (Overview Hub + 5 Methodology Pages)</span>
          </span>
          <span className="text-[11px] text-slate-500">
            Click any page tab to configure its content, Client Stories &amp; Blogs
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {HOW_WE_DO_IT_NAV_ITEMS.map((item) => {
            const active =
              item.slug === slug ||
              (slug.startsWith('how-we-do-it-') && item.slug === slug) ||
              (item.slug === `how-we-do-it-${slug}`);
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Primary CTA Text (EN)
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
                value={featData.hero.ctaText.ar}
                onChange={(e) =>
                  updateFeat({
                    hero: {
                      ...featData.hero,
                      ctaText: { ...featData.hero.ctaText, ar: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                CTA Target Href
              </label>
              <input
                type="text"
                value={featData.hero.ctaHref}
                onChange={(e) =>
                  updateFeat({
                    hero: { ...featData.hero, ctaHref: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Hero Image Asset (R2)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featData.hero.image || ''}
                onChange={(e) =>
                  updateFeat({ hero: { ...featData.hero, image: e.target.value } })
                }
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
              />
              <button
                type="button"
                onClick={() =>
                  openMediaPicker(
                    (url) => updateFeat({ hero: { ...featData.hero, image: url } }),
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

      {/* SECTION 2: CORE CAPABILITIES & METHODOLOGIES (CARDS GRID) */}
      <SectionAccordion
        number={2}
        title="OfferingsGrid • Core Capabilities & Methodologies (Cards Grid)"
        description="Section badge, title, subtitle, and the capability cards with icons, vector diagrams, descriptions, and tags"
        isOpenDefault={false}
        onSave={onSave}
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display Capabilities Section
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
                Section Eyebrow Badge (EN)
              </label>
              <input
                type="text"
                value={featData.offeringsBadge.en}
                onChange={(e) =>
                  updateFeat({
                    offeringsBadge: { ...featData.offeringsBadge, en: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                شارة القسم (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.offeringsBadge.ar}
                onChange={(e) =>
                  updateFeat({
                    offeringsBadge: { ...featData.offeringsBadge, ar: e.target.value },
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
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان القسم (AR)
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
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Section Subtitle / Description"
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
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Capability Cards ({featData.offerings.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const next: HowWeDoItFeatureOfferingItem = {
                    slug: `capability-${Date.now()}`,
                    tag: { en: 'New Capability', ar: 'قدرة جديدة' },
                    title: { en: 'New Domain Capability', ar: 'قدرة متخصصة جديدة' },
                    description: { en: 'Capability description...', ar: 'وصف القدرة هنا...' },
                    diagramType: 'matrix-intersect',
                    icon: 'lightbulb',
                  };
                  updateFeat({ offerings: [...featData.offerings, next] });
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-persici-crimson transition-colors cursor-pointer"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>Add Capability Card</span>
              </button>
            </div>

            {featData.offerings.map((card, idx) => (
              <div
                key={card.slug || idx}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-persici-crimson text-white text-xs font-bold flex items-center justify-center font-mono">
                    {idx + 1}
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
                      title="Move Up"
                    >
                      <TbArrowUp className="w-3.5 h-3.5" />
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
                      title="Move Down"
                    >
                      <TbArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...featData.offerings];
                        copy.splice(idx, 1);
                        updateFeat({ offerings: copy });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      title="Delete Card"
                    >
                      <TbTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Card Tag (EN)
                    </label>
                    <input
                      type="text"
                      value={card.tag.en}
                      onChange={(e) => {
                        const copy = [...featData.offerings];
                        copy[idx] = { ...card, tag: { ...card.tag, en: e.target.value } };
                        updateFeat({ offerings: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      شارة البطاقة (AR)
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
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Card Title (EN)
                    </label>
                    <input
                      type="text"
                      value={card.title.en}
                      onChange={(e) => {
                        const copy = [...featData.offerings];
                        copy[idx] = { ...card, title: { ...card.title, en: e.target.value } };
                        updateFeat({ offerings: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      عنوان البطاقة (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={card.title.ar}
                      onChange={(e) => {
                        const copy = [...featData.offerings];
                        copy[idx] = { ...card, title: { ...card.title, ar: e.target.value } };
                        updateFeat({ offerings: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                </div>

                <RichTextEditor
                  label="Card Description"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Vector Architecture Diagram
                    </label>
                    <select
                      value={card.diagramType || 'grid-dots'}
                      onChange={(e) => {
                        const copy = [...featData.offerings];
                        copy[idx] = {
                          ...card,
                          diagramType: e.target.value as SolutionDiagramType,
                        };
                        updateFeat({ offerings: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 font-mono"
                    >
                      {DIAGRAM_TYPES.map((dt) => (
                        <option key={dt} value={dt}>
                          {dt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Card Slug / ID
                    </label>
                    <input
                      type="text"
                      value={card.slug}
                      onChange={(e) => {
                        const copy = [...featData.offerings];
                        copy[idx] = { ...card, slug: e.target.value };
                        updateFeat({ offerings: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 3: WHY IT MATTERS (STRATEGIC NARRATIVE) */}
      <SectionAccordion
        number={3}
        title="SolutionsWhyItMatters • Strategic Context & Proof Counters"
        description="Headline title, detailed narrative justification text, and the side illustration asset"
        isOpenDefault={false}
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
                Headline Title (EN)
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
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
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
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Detailed Narrative Text"
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
              Side Illustration Asset (R2)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featData.whyItMatters.image || ''}
                onChange={(e) =>
                  updateFeat({
                    whyItMatters: { ...featData.whyItMatters, image: e.target.value },
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
                        whyItMatters: { ...featData.whyItMatters, image: url },
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
      </SectionAccordion>

      {/* SECTION 4: STRATEGIC BENEFITS STRIP (3 CARDS) */}
      <SectionAccordion
        number={4}
        title="SolutionsBenefitsStrip • Strategic Advantages Strip"
        description="Section title, side banner illustration asset, and the 3 high-impact strategic advantage cards"
        isOpenDefault={false}
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
                Section Title (EN)
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
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان قسم المزايا (AR)
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
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Banner Illustration Asset (R2)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featData.benefitsStrip.image || ''}
                onChange={(e) =>
                  updateFeat({
                    benefitsStrip: { ...featData.benefitsStrip, image: e.target.value },
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
                        benefitsStrip: { ...featData.benefitsStrip, image: url },
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

          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              The 3 High-Impact Strategic Advantage Cards
            </span>
            {featData.benefitsStrip.benefits.map((b: SolutionBenefitItem, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-persici-crimson text-white text-xs font-bold flex items-center justify-center font-mono">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-800">{b.title.en}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Title (EN)
                    </label>
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
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      العنوان (AR)
                    </label>
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
                </div>

                <RichTextEditor
                  label="Description"
                  rows={2}
                  valueEn={b.description.en}
                  valueAr={b.description.ar}
                  onChangeEn={(val) => {
                    const copy = [...featData.benefitsStrip.benefits];
                    copy[idx] = { ...b, description: { ...b.description, en: val } };
                    updateFeat({
                      benefitsStrip: { ...featData.benefitsStrip, benefits: copy },
                    });
                  }}
                  onChangeAr={(val) => {
                    const copy = [...featData.benefitsStrip.benefits];
                    copy[idx] = { ...b, description: { ...b.description, ar: val } };
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

      {/* SECTION 5: DELIVERY LIFECYCLE / ENGAGEMENT MODEL */}
      <SectionAccordion
        number={5}
        title="EngagementModelSection • Delivery Lifecycle & Engagement Model"
        description="Section badge, headline, narrative subtitle, and the sequential execution phases with key deliverables"
        isOpenDefault={false}
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display Engagement Model Section
            </span>
            <input
              type="checkbox"
              checked={featData.engagementModel.enabled !== false}
              onChange={(e) =>
                updateFeat({
                  engagementModel: {
                    ...featData.engagementModel,
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
                value={featData.engagementModel.badge?.en || ''}
                onChange={(e) =>
                  updateFeat({
                    engagementModel: {
                      ...featData.engagementModel,
                      badge: {
                        ...(featData.engagementModel.badge || { en: '', ar: '' }),
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
                شارة القسم (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.engagementModel.badge?.ar || ''}
                onChange={(e) =>
                  updateFeat({
                    engagementModel: {
                      ...featData.engagementModel,
                      badge: {
                        ...(featData.engagementModel.badge || { en: '', ar: '' }),
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
                value={featData.engagementModel.title.en}
                onChange={(e) =>
                  updateFeat({
                    engagementModel: {
                      ...featData.engagementModel,
                      title: { ...featData.engagementModel.title, en: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان القسم (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.engagementModel.title.ar}
                onChange={(e) =>
                  updateFeat({
                    engagementModel: {
                      ...featData.engagementModel,
                      title: { ...featData.engagementModel.title, ar: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Section Subtitle / Description"
            rows={2}
            valueEn={featData.engagementModel.subtitle.en}
            valueAr={featData.engagementModel.subtitle.ar}
            onChangeEn={(val) =>
              updateFeat({
                engagementModel: {
                  ...featData.engagementModel,
                  subtitle: { ...featData.engagementModel.subtitle, en: val },
                },
              })
            }
            onChangeAr={(val) =>
              updateFeat({
                engagementModel: {
                  ...featData.engagementModel,
                  subtitle: { ...featData.engagementModel.subtitle, ar: val },
                },
              })
            }
          />

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Engagement Model Phases ({featData.engagementModel.steps.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const next: HowWeDoItEngagementStep = {
                    number: String(featData.engagementModel.steps.length + 1).padStart(2, '0'),
                    title: { en: 'New Phase', ar: 'مرحلة جديدة' },
                    description: { en: 'Phase methodology and deliverables...', ar: 'تفاصيل ومخرجات المرحلة...' },
                  };
                  updateFeat({
                    engagementModel: {
                      ...featData.engagementModel,
                      steps: [...featData.engagementModel.steps, next],
                    },
                  });
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-persici-crimson transition-colors cursor-pointer"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>Add Phase</span>
              </button>
            </div>

            {featData.engagementModel.steps.map((st: HowWeDoItEngagementStep, idx: number) => (
              <div
                key={st.number || idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-persici-crimson text-white text-xs font-bold flex items-center justify-center font-mono">
                      {st.number}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{st.title.en}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const copy = moveItem(featData.engagementModel.steps, idx, 'up');
                        updateFeat({
                          engagementModel: { ...featData.engagementModel, steps: copy },
                        });
                      }}
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <TbArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === featData.engagementModel.steps.length - 1}
                      onClick={() => {
                        const copy = moveItem(featData.engagementModel.steps, idx, 'down');
                        updateFeat({
                          engagementModel: { ...featData.engagementModel, steps: copy },
                        });
                      }}
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <TbArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...featData.engagementModel.steps];
                        copy.splice(idx, 1);
                        updateFeat({
                          engagementModel: { ...featData.engagementModel, steps: copy },
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      title="Delete Phase"
                    >
                      <TbTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Step Number Badge
                    </label>
                    <input
                      type="text"
                      value={st.number}
                      onChange={(e) => {
                        const copy = [...featData.engagementModel.steps];
                        copy[idx] = { ...st, number: e.target.value };
                        updateFeat({
                          engagementModel: { ...featData.engagementModel, steps: copy },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Phase Title (EN)
                    </label>
                    <input
                      type="text"
                      value={st.title.en}
                      onChange={(e) => {
                        const copy = [...featData.engagementModel.steps];
                        copy[idx] = { ...st, title: { ...st.title, en: e.target.value } };
                        updateFeat({
                          engagementModel: { ...featData.engagementModel, steps: copy },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      عنوان المرحلة (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={st.title.ar}
                      onChange={(e) => {
                        const copy = [...featData.engagementModel.steps];
                        copy[idx] = { ...st, title: { ...st.title, ar: e.target.value } };
                        updateFeat({
                          engagementModel: { ...featData.engagementModel, steps: copy },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                </div>

                <RichTextEditor
                  label="Phase Description & Deliverables"
                  rows={2}
                  valueEn={st.description.en}
                  valueAr={st.description.ar}
                  onChangeEn={(val) => {
                    const copy = [...featData.engagementModel.steps];
                    copy[idx] = { ...st, description: { ...st.description, en: val } };
                    updateFeat({
                      engagementModel: { ...featData.engagementModel, steps: copy },
                    });
                  }}
                  onChangeAr={(val) => {
                    const copy = [...featData.engagementModel.steps];
                    copy[idx] = { ...st, description: { ...st.description, ar: val } };
                    updateFeat({
                      engagementModel: { ...featData.engagementModel, steps: copy },
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 6: ENTERPRISE TECHNOLOGY & TOOLCHAIN PODS */}
      <SectionAccordion
        number={6}
        title="TechStackSection • Dark Technology Infrastructure Matrix"
        description="Section badge, headline, narrative subtitle, and the enterprise toolchain category pods"
        isOpenDefault={false}
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display Technology Toolchains Section
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
                Section Eyebrow Badge (EN)
              </label>
              <input
                type="text"
                value={featData.techStackBadge.en}
                onChange={(e) =>
                  updateFeat({
                    techStackBadge: { ...featData.techStackBadge, en: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                شارة القسم (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.techStackBadge.ar}
                onChange={(e) =>
                  updateFeat({
                    techStackBadge: { ...featData.techStackBadge, ar: e.target.value },
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
                value={featData.techStackTitle.en}
                onChange={(e) =>
                  updateFeat({
                    techStackTitle: { ...featData.techStackTitle, en: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان القسم (AR)
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
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="Section Subtitle / Description"
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

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Technology Pods ({featData.techStackPods.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const next: HowWeDoItTechStackPod = {
                    title: { en: 'New Technology Pod', ar: 'مجموعة تقنية جديدة' },
                    badge: { en: 'Toolchain', ar: 'منظومة' },
                    description: { en: 'Pod description...', ar: 'وصف المجموعة التقنية...' },
                    technologies: [{ name: 'React', badge: 'Frontend' }, { name: 'Node.js', badge: 'Backend' }],
                  };
                  updateFeat({ techStackPods: [...featData.techStackPods, next] });
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-persici-crimson transition-colors cursor-pointer"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>Add Tech Pod</span>
              </button>
            </div>

            {featData.techStackPods.map((pod: HowWeDoItTechStackPod, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">
                    Pod #{idx + 1}: {pod.title.en}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const copy = moveItem(featData.techStackPods, idx, 'up');
                        updateFeat({ techStackPods: copy });
                      }}
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <TbArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === featData.techStackPods.length - 1}
                      onClick={() => {
                        const copy = moveItem(featData.techStackPods, idx, 'down');
                        updateFeat({ techStackPods: copy });
                      }}
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <TbArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...featData.techStackPods];
                        copy.splice(idx, 1);
                        updateFeat({ techStackPods: copy });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      title="Delete Pod"
                    >
                      <TbTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Pod Title (EN)
                    </label>
                    <input
                      type="text"
                      value={pod.title.en}
                      onChange={(e) => {
                        const copy = [...featData.techStackPods];
                        copy[idx] = { ...pod, title: { ...pod.title, en: e.target.value } };
                        updateFeat({ techStackPods: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      عنوان المجموعة (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={pod.title.ar}
                      onChange={(e) => {
                        const copy = [...featData.techStackPods];
                        copy[idx] = { ...pod, title: { ...pod.title, ar: e.target.value } };
                        updateFeat({ techStackPods: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                </div>

                <RichTextEditor
                  label="Pod Description"
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

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Technologies / Tools (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js, TypeScript, Tailwind, Python"
                    value={pod.technologies.map((t) => t.name).join(', ')}
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean);
                      const copy = [...featData.techStackPods];
                      copy[idx] = {
                        ...pod,
                        technologies: tags.map((name) => ({ name })),
                      };
                      updateFeat({ techStackPods: copy });
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 7: DYNAMIC CLIENT STORIES SELECTOR */}
      <SectionAccordion
        number={7}
        title="FeaturedClientStories • Dynamic Client Stories Selector"
        description="Configure the client case studies showcase with custom ordering, category filter, or globally featured items"
        isOpenDefault={false}
        onSave={onSave}
      >
        {renderClientStoriesSelector(featData.clientStoriesConfig, (nextCfg) =>
          updateFeat({ clientStoriesConfig: nextCfg })
        )}
      </SectionAccordion>

      {/* SECTION 8: DYNAMIC BLOGS & INSIGHTS CAROUSEL SELECTOR */}
      <SectionAccordion
        number={8}
        title="InsightsSection • Dynamic Blogs & Insights Carousel Selector"
        description="Configure the methodology articles and thought leadership carousel with custom order, category filtering, and count limit"
        isOpenDefault={false}
        onSave={onSave}
      >
        {renderInsightsSelector(featData.insightsConfig, (nextCfg) =>
          updateFeat({ insightsConfig: nextCfg })
        )}
      </SectionAccordion>

      {/* SECTION 9: CLIENT REVIEW TESTIMONIAL QUOTE */}
      <SectionAccordion
        number={9}
        title="ClientReviewSection • Executive Client Testimonial"
        description="Quote testimonial copy, author name, client organization/role, and optional leadership badge"
        isOpenDefault={false}
        onSave={onSave}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Display Client Review Quote Section
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

          <RichTextEditor
            label="Client Quote Copy"
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
                Client Author Name
              </label>
              <input
                type="text"
                value={featData.clientReview.author}
                onChange={(e) =>
                  updateFeat({
                    clientReview: { ...featData.clientReview, author: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Role &amp; Company (EN)
              </label>
              <input
                type="text"
                value={featData.clientReview.role.en}
                onChange={(e) =>
                  updateFeat({
                    clientReview: {
                      ...featData.clientReview,
                      role: { ...featData.clientReview.role, en: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                المسمى والشركة (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={featData.clientReview.role.ar}
                onChange={(e) =>
                  updateFeat({
                    clientReview: {
                      ...featData.clientReview,
                      role: { ...featData.clientReview.role, ar: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
              />
            </div>
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 10: FREQUENTLY ASKED QUESTIONS */}
      <SectionAccordion
        number={10}
        title="FaqSection • Frequently Asked Questions Accordion"
        description="Section title, subtitle, and bilingual Q&A items answering critical methodology inquiries"
        isOpenDefault={false}
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
                Section Title (EN)
              </label>
              <input
                type="text"
                value={featData.faqsTitle.en}
                onChange={(e) =>
                  updateFeat({
                    faqsTitle: { ...featData.faqsTitle, en: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان قسم الأسئلة الشائعة (AR)
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
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
              />
            </div>
          </div>

          <RichTextEditor
            label="FAQs Subtitle / Description"
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

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                FAQ Items ({featData.faqs.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const next: SolutionFaqItem = {
                    question: { en: 'New Methodology Question', ar: 'سؤال جديد' },
                    answer: { en: 'Answer details here...', ar: 'تفاصيل الإجابة هنا...' },
                  };
                  updateFeat({ faqs: [...featData.faqs, next] });
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-persici-crimson transition-colors cursor-pointer"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>Add FAQ Item</span>
              </button>
            </div>

            {featData.faqs.map((faq: SolutionFaqItem, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="w-6 h-6 rounded bg-persici-crimson text-white text-xs font-bold flex items-center justify-center font-mono">
                    Q{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() =>
                        updateFeat({ faqs: moveItem(featData.faqs, idx, 'up') })
                      }
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <TbArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === featData.faqs.length - 1}
                      onClick={() =>
                        updateFeat({ faqs: moveItem(featData.faqs, idx, 'down') })
                      }
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <TbArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...featData.faqs];
                        copy.splice(idx, 1);
                        updateFeat({ faqs: copy });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      title="Delete FAQ"
                    >
                      <TbTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Question (EN)
                    </label>
                    <input
                      type="text"
                      value={faq.question.en}
                      onChange={(e) => {
                        const copy = [...featData.faqs];
                        copy[idx] = {
                          ...faq,
                          question: { ...faq.question, en: e.target.value },
                        };
                        updateFeat({ faqs: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      السؤال (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={faq.question.ar}
                      onChange={(e) => {
                        const copy = [...featData.faqs];
                        copy[idx] = {
                          ...faq,
                          question: { ...faq.question, ar: e.target.value },
                        };
                        updateFeat({ faqs: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                </div>

                <RichTextEditor
                  label="Answer"
                  rows={2}
                  valueEn={faq.answer.en}
                  valueAr={faq.answer.ar}
                  onChangeEn={(val) => {
                    const copy = [...featData.faqs];
                    copy[idx] = { ...faq, answer: { ...faq.answer, en: val } };
                    updateFeat({ faqs: copy });
                  }}
                  onChangeAr={(val) => {
                    const copy = [...featData.faqs];
                    copy[idx] = { ...faq, answer: { ...faq.answer, ar: val } };
                    updateFeat({ faqs: copy });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* SECTION 11: SHARED CONTACT FORM SECTION */}
      <SectionAccordion
        number={11}
        title="HomeContactSection • Shared Contact &amp; Consultation Form"
        description="Toggle whether the global contact form section is displayed at the bottom of this methodology page"
        isOpenDefault={false}
        onSave={onSave}
      >
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Enable Bottom Contact Section
            </span>
            <span className="text-[11px] text-slate-500">
              Display the global consultation and contact form section at the bottom of the page
            </span>
          </div>
          <input
            type="checkbox"
            checked={featData.contactEnabled !== false}
            onChange={(e) => updateFeat({ contactEnabled: e.target.checked })}
            className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
          />
        </div>
      </SectionAccordion>
    </div>
  );
}
