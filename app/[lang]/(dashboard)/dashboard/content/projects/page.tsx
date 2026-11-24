'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  TbLayout,
  TbCategory,
  TbFilePencil,
  TbRotateClockwise2,
  TbAlertTriangle,
  TbCloudCheck,
  TbCheck,
  TbLoader2,
  TbTrash,
  TbSpacingVertical,
} from 'react-icons/tb';
import { MediaPickerModal } from '@dashboard-shared/components';
import type {
  ImageUploadQualityMode,
  MediaItem,
} from '@dashboard-shared/components/media/types';
import {
  DEFAULT_CLIENT_STORY_CATEGORIES,
  hasAnyBilingualText,
  normalizeBilingualInput,
  resolveBilingualText,
  slugifyCategorySlug,
  type ClientStoryCategory,
  type ClientStoryDetail,
  type StoryCategorySlug,
  type StoryTemplateType,
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
  PortfolioAiReferenceBar,
  AiFieldTrigger,
  StoryDetailSpacingModal,
  stripDraftMeta,
  areStoriesContentEqual,
  readLocalStoryDrafts,
  writeLocalStoryDraft,
  removeLocalStoryDraft,
  readNewStoryLocalDraft,
  writeNewStoryLocalDraft,
  clearNewStoryLocalDraft,
  type UploadedReferenceItem,
  type StoryAiFieldControls,
  type StoryAiTranslateParams,
  type LocalStoryDraftEntry,
} from './_components';
import type {
  StoryAiTargetField,
  NarrativeSectionRole,
} from '@/app/api/ai/generate-story-field/route';
import type { AiEffectLevel, AiProviderId } from '@/lib/ai-types';

function resolveCategoryBySlug(
  slug: string,
  list: ClientStoryCategory[]
): ClientStoryCategory | undefined {
  return (
    list.find((c) => c.slug === slug) ||
    DEFAULT_CLIENT_STORY_CATEGORIES.find((c) => c.slug === slug)
  );
}

function buildStorySavePayload(
  story: ClientStoryDetail,
  refs: UploadedReferenceItem[]
): ClientStoryDetail {
  const clean = stripDraftMeta(story);
  const normalizedTitle = normalizeBilingualInput(clean.title);
  const normalizedPartner = normalizeBilingualInput(clean.partner);
  const normalizedClient = normalizeBilingualInput(clean.client);

  return {
    ...clean,
    title: {
      en: normalizedTitle.en.trim(),
      ar: normalizedTitle.ar.trim(),
    },
    partner: {
      en: normalizedPartner.en.trim(),
      ar: normalizedPartner.ar.trim(),
    },
    client: {
      en: normalizedClient.en.trim(),
      ar: normalizedClient.ar.trim(),
    },
    aiReferences: refs,
  };
}

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
  partner: { en: '', ar: '' },
  client: { en: 'Enterprise Client', ar: 'عميل مؤسسي' },
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
  heroSlider: {
    enabled: false,
    autoScroll: true,
    infinite: true,
    intervalMs: 4000,
    transitionMs: 650,
    showArrows: true,
    images: [],
  },
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
    galleryDesign: 'editorial-bento',
    galleryOrder: 'normal',
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
  aiReferences: [],
};

export default function ProjectsManagerPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  const [stories, setStories] = useState<ClientStoryDetail[]>([]);
  const [categories, setCategories] = useState<ClientStoryCategory[]>(
    DEFAULT_CLIENT_STORY_CATEGORIES
  );
  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Editor & Draft State
  const [editingStory, setEditingStory] = useState<ClientStoryDetail | null>(null);
  const [publishedBaseline, setPublishedBaseline] = useState<ClientStoryDetail | null>(null);
  const [initialNewStoryBaseline, setInitialNewStoryBaseline] =
    useState<ClientStoryDetail | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [persistedSlug, setPersistedSlug] = useState<string | null>(null);
  const [activeTocSection, setActiveTocSection] = useState('sec-meta');

  const [localDraftsMap, setLocalDraftsMap] = useState<Record<string, LocalStoryDraftEntry>>({});
  const [newStoryLocalDraft, setNewStoryLocalDraft] = useState<LocalStoryDraftEntry | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [autoSavedAt, setAutoSavedAt] = useState<string | null>(null);
  const [draftSavedFeedback, setDraftSavedFeedback] = useState<{
    at: string;
    offline?: boolean;
  } | null>(null);
  const [publishSuccessInfo, setPublishSuccessInfo] = useState<{ at: string } | null>(null);
  const [restoredDraftInfo, setRestoredDraftInfo] = useState<{
    source: 'local' | 'server';
    savedAt?: string;
  } | null>(null);
  const [discardConfirmTarget, setDiscardConfirmTarget] = useState<{
    mode: 'open-editor' | 'card' | 'new-local-banner';
    story?: ClientStoryDetail;
  } | null>(null);
  const [discardingDraft, setDiscardingDraft] = useState(false);

  // AI Studio Reference & Generation State
  const [references, setReferences] = useState<UploadedReferenceItem[]>([]);
  const [isSavingReferences, setIsSavingReferences] = useState(false);
  const [generatingFieldKey, setGeneratingFieldKey] = useState<string | null>(null);
  const [translatingKeys, setTranslatingKeys] = useState<Record<string, boolean>>({});
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [referenceWarning, setReferenceWarning] = useState<string | null>(null);
  const [activeAiMeta, setActiveAiMeta] = useState<{
    provider: AiProviderId;
    modelId: string;
    effectLevel: AiEffectLevel;
    hasApiKey: boolean;
    isFreeTier: boolean;
  } | null>(null);
  const [lastUsageBanner, setLastUsageBanner] = useState<{
    tokens: number;
    costUsd: number;
    isFreeTier: boolean;
  } | null>(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | StoryCategorySlug>('all');
  const [templateFilter, setTemplateFilter] = useState<'all' | StoryTemplateType>('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Media Picker Modal & Upload Compression Mode State
  const [spacingModalOpen, setSpacingModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerMultiple, setMediaPickerMultiple] = useState(false);
  const [mediaPickerType, setMediaPickerType] = useState<'image' | 'video' | 'all'>('image');
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);
  const [mediaPickerMultiCallback, setMediaPickerMultiCallback] = useState<
    ((urls: string[], items: MediaItem[]) => void) | null
  >(null);
  const [uploadQualityMode, setUploadQualityMode] = useState<ImageUploadQualityMode>('high-webp');

  const getHref = (href: string) => {
    if (!passkey) return href;
    const sep = href.includes('?') ? '&' : '?';
    return `${href}${sep}passkey=${encodeURIComponent(passkey)}`;
  };

  const loadStories = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [projRes, catRes] = await Promise.all([
        fetch('/api/projects', { cache: 'no-store' }),
        fetch('/api/projects/categories', { cache: 'no-store' }),
      ]);
      const data = await projRes.json();
      if (data.projects) {
        setStories(data.projects);
      }
      const catData = await catRes.json().catch(() => ({}));
      if (Array.isArray(catData.categories) && catData.categories.length > 0) {
        setCategories(catData.categories);
      }
    } catch (err) {
      console.error('Failed to load portfolio stories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch('/api/projects', { cache: 'no-store' }).then((res) => res.json()),
      fetch('/api/projects/categories', { cache: 'no-store' })
        .then((res) => res.json())
        .catch(() => ({})),
    ])
      .then(([projData, catData]) => {
        if (!active) return;
        const loadedCategories: ClientStoryCategory[] =
          Array.isArray(catData?.categories) && catData.categories.length > 0
            ? catData.categories
            : DEFAULT_CLIENT_STORY_CATEGORIES;

        setCategories(loadedCategories);
        if (projData?.projects) {
          setStories(projData.projects);
        }

        if (typeof window !== 'undefined') {
          const loadedLocalMap = readLocalStoryDrafts();
          setLocalDraftsMap(loadedLocalMap);
          setNewStoryLocalDraft(readNewStoryLocalDraft());

          const sp = new URLSearchParams(window.location.search);
          const pk = sp.get('passkey') || sp.get('key') || '';
          if (pk) setPasskey(pk);

          const filterCat = sp.get('category');
          if (filterCat && filterCat !== 'all') {
            setCategoryFilter(filterCat);
          }

          const editSlug = sp.get('edit');
          const loadedStories: ClientStoryDetail[] = Array.isArray(projData?.projects)
            ? projData.projects
            : [];

          if (editSlug && loadedStories.length > 0) {
            const matchedStory = loadedStories.find(
              (s) => s.slug === editSlug || s.id === editSlug
            );
            if (matchedStory) {
              const key = matchedStory.slug;
              const localEntry = loadedLocalMap[key];
              const serverDraft = matchedStory.draftData;
              const isDraftOnly = matchedStory.status === 'draft';
              const cleanBaseline = isDraftOnly ? null : stripDraftMeta(matchedStory);

              let chosenStory: ClientStoryDetail = stripDraftMeta(matchedStory);
              let restored: { source: 'local' | 'server'; savedAt?: string } | null = null;

              if (localEntry && serverDraft) {
                const localMs = new Date(localEntry.savedAt).getTime() || 0;
                const serverMs = matchedStory.draftUpdatedAt
                  ? new Date(matchedStory.draftUpdatedAt).getTime() || 0
                  : 0;
                if (localMs >= serverMs) {
                  chosenStory = stripDraftMeta(localEntry.draftStory);
                  restored = { source: 'local', savedAt: localEntry.savedAt };
                } else {
                  chosenStory = stripDraftMeta(serverDraft);
                  restored = { source: 'server', savedAt: matchedStory.draftUpdatedAt };
                }
              } else if (localEntry) {
                chosenStory = stripDraftMeta(localEntry.draftStory);
                restored = { source: 'local', savedAt: localEntry.savedAt };
              } else if (serverDraft) {
                chosenStory = stripDraftMeta(serverDraft);
                restored = { source: 'server', savedAt: matchedStory.draftUpdatedAt };
              } else if (isDraftOnly) {
                restored = { source: 'server', savedAt: matchedStory.draftUpdatedAt };
              }

              const savedRefs = Array.isArray(chosenStory.aiReferences)
                ? chosenStory.aiReferences
                : [];
              setIsCreating(false);
              setPersistedSlug(matchedStory.slug);
              setPublishedBaseline(cleanBaseline);
              setInitialNewStoryBaseline(null);
              setActiveTocSection('sec-meta');
              setReferences(savedRefs);
              setReferenceWarning(null);
              setLastUsageBanner(null);
              setTranslatingKeys({});
              setAutoSavedAt(restored?.savedAt || null);
              setDraftSavedFeedback(null);
              setPublishSuccessInfo(null);
              setRestoredDraftInfo(restored);
              setEditingStory({ ...chosenStory, aiReferences: savedRefs });

              sp.delete('edit');
              const nextQs = sp.toString();
              const cleanUrl = `${window.location.pathname}${nextQs ? `?${nextQs}` : ''}`;
              window.history.replaceState({}, '', cleanUrl);
            }
          }

          const newCat = sp.get('newCategory');
          if (newCat && newCat !== 'all') {
            const matched = resolveCategoryBySlug(newCat, loadedCategories);
            const fallbackSlug = matched?.slug || newCat;
            const fallbackCatName = matched
              ? {
                  en: resolveBilingualText(matched.name, 'en'),
                  ar: resolveBilingualText(matched.name, 'ar'),
                }
              : { en: newCat, ar: newCat };

            const createdInitial: ClientStoryDetail = {
              ...DEFAULT_NEW_STORY,
              id: `story-${Date.now()}`,
              slug: `case-study-${Date.now()}`,
              categorySlug: fallbackSlug,
              category: fallbackCatName,
              aiReferences: [],
            };

            setIsCreating(true);
            setPersistedSlug(null);
            setPublishedBaseline(null);
            setInitialNewStoryBaseline(createdInitial);
            setActiveTocSection('sec-meta');
            setReferences([]);
            setReferenceWarning(null);
            setLastUsageBanner(null);
            setAutoSavedAt(null);
            setDraftSavedFeedback(null);
            setPublishSuccessInfo(null);
            setRestoredDraftInfo(null);
            setEditingStory(createdInitial);

            sp.delete('newCategory');
            const nextQs = sp.toString();
            const cleanUrl = `${window.location.pathname}${nextQs ? `?${nextQs}` : ''}`;
            window.history.replaceState({}, '', cleanUrl);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load portfolio stories:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    fetch('/api/ai/config', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.config) {
          const prov = data.config.activeProvider as AiProviderId;
          setActiveAiMeta({
            provider: prov,
            modelId: data.config.activeModelId,
            effectLevel: data.config.effectLevel,
            hasApiKey: Boolean(data.config.providers?.[prov]?.hasApiKey),
            isFreeTier: Boolean(data.config.providers?.[prov]?.isFreeTier),
          });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Layer 1 Auto-Save to localStorage (Debounced 350ms) so in-progress edits survive connection drops
  useEffect(() => {
    if (!editingStory) return;

    const timer = window.setTimeout(() => {
      if (isCreating) {
        if (
          initialNewStoryBaseline &&
          !areStoriesContentEqual(editingStory, initialNewStoryBaseline)
        ) {
          const entry = writeNewStoryLocalDraft(editingStory);
          if (entry) {
            setNewStoryLocalDraft(entry);
            setAutoSavedAt(entry.savedAt);
            setPublishSuccessInfo(null);
          }
        }
        return;
      }

      const storyKey = persistedSlug || editingStory.slug;
      if (!storyKey) return;

      const isDraftOnly = editingStory.status === 'draft';
      const differsFromPublished =
        isDraftOnly ||
        (publishedBaseline ? !areStoriesContentEqual(editingStory, publishedBaseline) : false);

      if (differsFromPublished) {
        const entry = writeLocalStoryDraft(storyKey, editingStory);
        if (entry) {
          setLocalDraftsMap((prev) => ({ ...prev, [storyKey]: entry }));
          setAutoSavedAt(entry.savedAt);
          setPublishSuccessInfo(null);
        }
      } else {
        setLocalDraftsMap((prev) => {
          if (!prev[storyKey]) return prev;
          return removeLocalStoryDraft(storyKey);
        });
        setAutoSavedAt(null);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [editingStory, isCreating, persistedSlug, publishedBaseline, initialNewStoryBaseline]);

  // Open Media Picker helpers (Single & Bulk Multi-Select)
  const handleOpenMediaPicker = (
    callbackOrTarget: ((url: string) => void) | 'heroImage' | 'heroVideo' | 'heroVideoPoster',
    type: 'image' | 'video' | 'all' = 'image'
  ) => {
    setMediaPickerMultiple(false);
    setMediaPickerMultiCallback(null);
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

  const handleOpenMultiMediaPicker = (
    callback: (urls: string[], items: MediaItem[]) => void,
    type: 'image' | 'video' | 'all' = 'image'
  ) => {
    setMediaPickerMultiple(true);
    setMediaPickerCallback(null);
    setMediaPickerMultiCallback(() => callback);
    setMediaPickerType(type);
    setMediaPickerOpen(true);
  };

  const handleMediaPickerSelect = (url: string) => {
    if (mediaPickerCallback) {
      mediaPickerCallback(url);
    }
    setMediaPickerOpen(false);
    setMediaPickerMultiple(false);
    setMediaPickerCallback(null);
    setMediaPickerMultiCallback(null);
  };

  const handleMediaPickerSelectMultiple = (urls: string[], selectedItems: MediaItem[]) => {
    if (mediaPickerMultiCallback) {
      mediaPickerMultiCallback(urls, selectedItems);
    }
    setMediaPickerOpen(false);
    setMediaPickerMultiple(false);
    setMediaPickerCallback(null);
    setMediaPickerMultiCallback(null);
  };

  // Open Create Modal
  const openNewProject = () => {
    const freshStory: ClientStoryDetail = {
      ...DEFAULT_NEW_STORY,
      id: `story-${Date.now()}`,
      slug: `case-study-${Date.now()}`,
      aiReferences: [],
    };
    setIsCreating(true);
    setPersistedSlug(null);
    setPublishedBaseline(null);
    setInitialNewStoryBaseline(freshStory);
    setActiveTocSection('sec-meta');
    setReferences([]);
    setReferenceWarning(null);
    setLastUsageBanner(null);
    setTranslatingKeys({});
    setAutoSavedAt(null);
    setDraftSavedFeedback(null);
    setPublishSuccessInfo(null);
    setRestoredDraftInfo(null);
    setEditingStory(freshStory);
  };

  const resumeNewStoryDraft = () => {
    if (!newStoryLocalDraft?.draftStory) return;
    const resumed = stripDraftMeta(newStoryLocalDraft.draftStory);
    const savedRefs = Array.isArray(resumed.aiReferences) ? resumed.aiReferences : [];
    setIsCreating(true);
    setPersistedSlug(null);
    setPublishedBaseline(null);
    setInitialNewStoryBaseline({
      ...DEFAULT_NEW_STORY,
      id: resumed.id || `story-${Date.now()}`,
      slug: resumed.slug || `case-study-${Date.now()}`,
      aiReferences: [],
    });
    setActiveTocSection('sec-meta');
    setReferences(savedRefs);
    setReferenceWarning(null);
    setLastUsageBanner(null);
    setTranslatingKeys({});
    setAutoSavedAt(newStoryLocalDraft.savedAt);
    setDraftSavedFeedback(null);
    setPublishSuccessInfo(null);
    setRestoredDraftInfo({ source: 'local', savedAt: newStoryLocalDraft.savedAt });
    setEditingStory({ ...resumed, aiReferences: savedRefs });
  };

  // Open Edit Modal (automatically restores local or server draft if present)
  const openEditStory = (story: ClientStoryDetail) => {
    const key = story.slug;
    const localEntry = localDraftsMap[key];
    const serverDraft = story.draftData;
    const isDraftOnly = story.status === 'draft';
    const cleanPublishedBaseline = isDraftOnly ? null : stripDraftMeta(story);

    let chosenStory: ClientStoryDetail = stripDraftMeta(story);
    let restored: { source: 'local' | 'server'; savedAt?: string } | null = null;

    if (localEntry && serverDraft) {
      const localMs = new Date(localEntry.savedAt).getTime() || 0;
      const serverMs = story.draftUpdatedAt
        ? new Date(story.draftUpdatedAt).getTime() || 0
        : 0;
      if (localMs >= serverMs) {
        chosenStory = stripDraftMeta(localEntry.draftStory);
        restored = { source: 'local', savedAt: localEntry.savedAt };
      } else {
        chosenStory = stripDraftMeta(serverDraft);
        restored = { source: 'server', savedAt: story.draftUpdatedAt };
      }
    } else if (localEntry) {
      chosenStory = stripDraftMeta(localEntry.draftStory);
      restored = { source: 'local', savedAt: localEntry.savedAt };
    } else if (serverDraft) {
      chosenStory = stripDraftMeta(serverDraft);
      restored = { source: 'server', savedAt: story.draftUpdatedAt };
    } else if (isDraftOnly) {
      restored = { source: 'server', savedAt: story.draftUpdatedAt };
    }

    const savedRefs = Array.isArray(chosenStory.aiReferences) ? chosenStory.aiReferences : [];
    setIsCreating(false);
    setPersistedSlug(story.slug);
    setPublishedBaseline(cleanPublishedBaseline);
    setInitialNewStoryBaseline(null);
    setActiveTocSection('sec-meta');
    setReferences(savedRefs);
    setReferenceWarning(null);
    setLastUsageBanner(null);
    setTranslatingKeys({});
    setAutoSavedAt(restored?.savedAt || null);
    setDraftSavedFeedback(null);
    setPublishSuccessInfo(null);
    setRestoredDraftInfo(restored);
    setEditingStory({ ...chosenStory, aiReferences: savedRefs });
  };

  const handleCloseEditorModal = () => {
    if (editingStory) {
      if (isCreating) {
        if (
          initialNewStoryBaseline &&
          !areStoriesContentEqual(editingStory, initialNewStoryBaseline)
        ) {
          const entry = writeNewStoryLocalDraft(editingStory);
          if (entry) setNewStoryLocalDraft(entry);
        }
      } else {
        const storyKey = persistedSlug || editingStory.slug;
        const differs =
          editingStory.status === 'draft' ||
          (publishedBaseline ? !areStoriesContentEqual(editingStory, publishedBaseline) : false);
        if (storyKey && differs) {
          const entry = writeLocalStoryDraft(storyKey, editingStory);
          if (entry) {
            setLocalDraftsMap((prev) => ({ ...prev, [storyKey]: entry }));
          }
        }
      }
    }
    setEditingStory(null);
    setPublishedBaseline(null);
    setInitialNewStoryBaseline(null);
    setIsCreating(false);
    setPersistedSlug(null);
    setRestoredDraftInfo(null);
    setDraftSavedFeedback(null);
    setPublishSuccessInfo(null);
  };

  const persistStoryReferences = async (nextRefs: UploadedReferenceItem[]) => {
    setReferences(nextRefs);
    setEditingStory((prev) => (prev ? { ...prev, aiReferences: nextRefs } : null));

    if (!isCreating && persistedSlug) {
      setStories((prev) =>
        prev.map((s) =>
          s.slug === persistedSlug ? { ...s, aiReferences: nextRefs } : s
        )
      );
      setPublishedBaseline((prev) =>
        prev ? { ...prev, aiReferences: nextRefs } : null
      );
      setIsSavingReferences(true);
      try {
        await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingStory?.id,
            slug: persistedSlug,
            lookupSlug: persistedSlug,
            aiReferences: nextRefs,
          }),
        });
      } catch (err) {
        console.error('Failed to auto-save AI references:', err);
      } finally {
        setIsSavingReferences(false);
      }
    }
  };

  const combinedReferenceText = references
    .map((r) => `=== REFERENCE DOCUMENT: ${r.filename} (${r.metaSummary}) ===\n${r.text}`)
    .join('\n\n')
    .trim();

  const handleMissingReference = () => {
    setReferenceWarning(
      isRtl
        ? 'يرجى رفع ملف مرجع أولاً (PDF أو Word أو Excel أو Markdown أو TXT) حتى يتمكن الذكاء الاصطناعي من توليد المحتوى لهذا الحقل.'
        : 'Please upload a reference file (PDF, Word, Excel, Markdown, or TXT) first before generating content with AI.'
    );
    const bar = document.getElementById('ai-reference-bar');
    if (bar) {
      bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleGenerateAiField = async (
    targetField: StoryAiTargetField,
    options?: {
      sectionContext?: NarrativeSectionRole;
      paragraphIndex?: number;
      codeBlockIndex?: number;
      codeLanguage?: string;
      keyLabel?: string;
    }
  ) => {
    if (!editingStory) return;
    const isContextAllowedTarget =
      targetField === 'code_block' ||
      targetField === 'code_blocks' ||
      targetField === 'tech_stack' ||
      targetField === 'related_slugs';
    if (!isContextAllowedTarget && !combinedReferenceText) {
      handleMissingReference();
      return;
    }

    const fieldKey = options?.keyLabel || targetField;
    setReferenceWarning(null);
    if (targetField === 'all') {
      setIsGeneratingAll(true);
    } else {
      setGeneratingFieldKey(fieldKey);
    }

    try {
      const res = await fetch('/api/ai/generate-story-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetField,
          referenceText: combinedReferenceText,
          currentStoryContext: editingStory,
          sectionContext: options?.sectionContext,
          paragraphIndex: options?.paragraphIndex,
          codeBlockIndex: options?.codeBlockIndex,
          codeLanguage: options?.codeLanguage,
        }),
      });

      const payload = await res.json();
      if (!res.ok || !payload.success) {
        if (payload.code === 'REFERENCE_REQUIRED') {
          handleMissingReference();
          return;
        }
        throw new Error(payload.error || 'AI generation failed.');
      }

      const r = payload.result || {};
      if (payload.usage) {
        setLastUsageBanner({
          tokens: payload.usage.totalTokens || 0,
          costUsd: payload.usage.estimatedCostUsd || 0,
          isFreeTier: Boolean(payload.usage.isFreeTier),
        });
      }

      setEditingStory((prev) => {
        if (!prev) return null;
        const next = { ...prev };

        if (targetField === 'all') {
          if (r.meta && typeof r.meta === 'object') {
            const m = r.meta as Record<string, unknown>;
            if (m.partner !== undefined) {
              const p = normalizeBilingualInput(m.partner);
              next.partner = { en: p.en.trim(), ar: p.ar.trim() };
            }
            if (m.client !== undefined) {
              const c = normalizeBilingualInput(m.client);
              if (hasAnyBilingualText(c)) {
                next.client = { en: c.en.trim(), ar: c.ar.trim() };
              }
            }
            if (typeof m.slug === 'string' && m.slug) next.slug = m.slug;
            if (typeof m.categorySlug === 'string' && m.categorySlug.trim()) {
              const catSlug = m.categorySlug.trim();
              const matched = resolveCategoryBySlug(catSlug, categories);
              if (matched) {
                next.categorySlug = matched.slug;
                next.category = {
                  en: resolveBilingualText(matched.name, 'en'),
                  ar: resolveBilingualText(matched.name, 'ar'),
                };
              }
            }
            if (typeof m.templateType === 'string') {
              next.templateType = m.templateType as StoryTemplateType;
            }
            if (m.topic && typeof m.topic === 'object') {
              next.topic = m.topic as { en: string; ar: string };
            }
            if (m.region && typeof m.region === 'object') {
              next.region = m.region as { en: string; ar: string };
            }
            if (typeof m.date === 'string' && m.date) next.date = m.date;
            if (Array.isArray(m.services) && m.services.length > 0) {
              next.services = m.services as Array<{ en: string; ar: string }>;
            }
          }
          if (r.title) next.title = r.title;
          if (r.leadSubtitle) next.leadSubtitle = r.leadSubtitle;
          if (r.executiveSummary) next.executiveSummary = r.executiveSummary;
          if (Array.isArray(r.metrics) && r.metrics.length > 0) next.metrics = r.metrics;
          if (r.intro) next.intro = { ...(prev.intro || { id: 'intro' }), ...r.intro, id: 'intro' };
          if (r.problem) next.problem = { ...(prev.problem || { id: 'the-problem' }), ...r.problem, id: 'the-problem' };
          if (r.solution) next.solution = { ...(prev.solution || { id: 'the-solution' }), ...r.solution, id: 'the-solution' };
          if (r.impact) next.impact = { ...(prev.impact || { id: 'the-impact' }), ...r.impact, id: 'the-impact' };
          if (Array.isArray(r.techStack) && r.techStack.length > 0) {
            next.mediaShowcase = {
              ...(prev.mediaShowcase || {
                title: { en: 'Deliverables & Production', ar: 'معرض المخرجات والإنتاج' },
                description: { en: '', ar: '' },
              }),
              techStack: r.techStack,
            };
          }
          if (Array.isArray(r.relatedSlugs) && r.relatedSlugs.length > 0) {
            next.relatedSlugs = r.relatedSlugs;
          }
        } else if (targetField === 'meta') {
          if (r.partner !== undefined) {
            const p = normalizeBilingualInput(r.partner);
            next.partner = { en: p.en.trim(), ar: p.ar.trim() };
          }
          if (r.client !== undefined) {
            const c = normalizeBilingualInput(r.client);
            if (hasAnyBilingualText(c)) {
              next.client = { en: c.en.trim(), ar: c.ar.trim() };
            }
          }
          if (typeof r.slug === 'string' && r.slug) next.slug = r.slug;
          if (typeof r.categorySlug === 'string' && r.categorySlug.trim()) {
            const catSlug = r.categorySlug.trim();
            const matched = resolveCategoryBySlug(catSlug, categories);
            if (matched) {
              next.categorySlug = matched.slug;
              next.category = {
                en: resolveBilingualText(matched.name, 'en'),
                ar: resolveBilingualText(matched.name, 'ar'),
              };
            }
          }
          if (typeof r.templateType === 'string') {
            next.templateType = r.templateType as StoryTemplateType;
          }
          if (r.topic) next.topic = r.topic;
          if (r.region) next.region = r.region;
          if (typeof r.date === 'string' && r.date) next.date = r.date;
          if (Array.isArray(r.services) && r.services.length > 0) next.services = r.services;
        } else if (targetField === 'slug' && typeof r.slug === 'string') {
          next.slug = r.slug;
        } else if (targetField === 'partner' && r.partner !== undefined) {
          const p = normalizeBilingualInput(r.partner);
          next.partner = { en: p.en.trim(), ar: p.ar.trim() };
        } else if (targetField === 'client' && r.client !== undefined) {
          const c = normalizeBilingualInput(r.client);
          if (hasAnyBilingualText(c)) {
            next.client = { en: c.en.trim(), ar: c.ar.trim() };
          }
        } else if (targetField === 'topic' && r.topic) {
          next.topic = r.topic;
        } else if (targetField === 'region' && r.region) {
          next.region = r.region;
        } else if (targetField === 'services' && Array.isArray(r.services)) {
          next.services = r.services;
        } else if (targetField === 'title' && r.title) {
          next.title = r.title;
        } else if (targetField === 'leadSubtitle' && r.leadSubtitle) {
          next.leadSubtitle = r.leadSubtitle;
        } else if (targetField === 'executiveSummary' && r.executiveSummary) {
          next.executiveSummary = r.executiveSummary;
        } else if (targetField === 'metrics' && Array.isArray(r.metrics)) {
          next.metrics = r.metrics.slice(0, 4);
        } else if (targetField === 'tech_stack' && Array.isArray(r.techStack)) {
          next.mediaShowcase = {
            ...(prev.mediaShowcase || {
              title: { en: 'Deliverables & Production', ar: 'معرض المخرجات والإنتاج' },
              description: { en: '', ar: '' },
            }),
            techStack: r.techStack,
          };
        } else if (targetField === 'related_slugs' && Array.isArray(r.relatedSlugs)) {
          next.relatedSlugs = r.relatedSlugs;
        } else if (
          targetField === 'intro' ||
          targetField === 'problem' ||
          targetField === 'solution' ||
          targetField === 'impact'
        ) {
          const existingSec = prev[targetField] || {
            id: targetField === 'intro' ? 'intro' : `the-${targetField}`,
            title: { en: '', ar: '' },
            paragraphs: [],
          };
          next[targetField] = {
            ...existingSec,
            ...r,
            id: existingSec.id,
          };
        } else if (options?.sectionContext) {
          const secKey = options.sectionContext;
          const existingSec = prev[secKey] || {
            id: secKey === 'intro' ? 'intro' : `the-${secKey}`,
            title: { en: '', ar: '' },
            paragraphs: [{ en: '', ar: '' }],
          };
          const updatedSec = { ...existingSec };

          if (targetField === 'section_heading' && (r.en || r.ar)) {
            updatedSec.title = { en: r.en || '', ar: r.ar || '' };
          } else if (targetField === 'paragraph' && (r.en || r.ar)) {
            const pIdx = options.paragraphIndex ?? 0;
            const copyParas = [...(updatedSec.paragraphs || [])];
            copyParas[pIdx] = { en: r.en || '', ar: r.ar || '' };
            updatedSec.paragraphs = copyParas;
          } else if (targetField === 'bullets' && Array.isArray(r.bullets)) {
            updatedSec.bullets = r.bullets;
          } else if (targetField === 'code_block' && typeof r.code === 'string') {
            const cIdx = options.codeBlockIndex ?? 0;
            const copyBlocks = [...(updatedSec.codeBlocks || [])];
            const existing = copyBlocks[cIdx];
            copyBlocks[cIdx] = {
              id: existing?.id || `code-${Date.now()}-${cIdx + 1}`,
              title: r.title || existing?.title || { en: 'Sample Code', ar: 'نموذج كود' },
              language: r.language || existing?.language || options.codeLanguage || 'typescript',
              code: r.code,
            };
            updatedSec.codeBlocks = copyBlocks;
          } else if (targetField === 'code_blocks' && Array.isArray(r.codeBlocks)) {
            const generatedBlocks = r.codeBlocks.map(
              (
                blk: {
                  title?: { en: string; ar: string };
                  language?: string;
                  code?: string;
                },
                idx: number
              ) => ({
                id: `code-${Date.now()}-${idx + 1}`,
                title: blk.title || { en: 'Sample Code', ar: 'نموذج كود' },
                language: blk.language || 'typescript',
                code: blk.code || '',
              })
            );
            updatedSec.codeBlocks = [
              ...(updatedSec.codeBlocks || []),
              ...generatedBlocks,
            ];
          } else if (targetField === 'quote' && r.text) {
            updatedSec.quote = {
              text: r.text,
              author: r.author || updatedSec.quote?.author || 'Leadership Team',
              role: r.role || { en: 'Executive Partner', ar: 'شريك تنفيذي' },
            };
          }

          next[secKey] = updatedSec;
        }

        return next;
      });
    } catch (err) {
      console.error('AI generation error:', err);
      const rawMsg = err instanceof Error ? err.message : 'AI generation failed.';
      const isOverload = /503|high demand|UNAVAILABLE|overloaded|429|rate.?limit/i.test(rawMsg);
      setReferenceWarning(
        isOverload
          ? isRtl
            ? `خوادم نموذج الذكاء الاصطناعي تشهد ضغطاً مرتفعاً مؤقتاً (${rawMsg.slice(0, 120)}). حاول مجدداً خلال ثوانٍ أو اختر نموذجاً/مزوداً آخر من AI Studio.`
            : `The AI provider is temporarily experiencing high demand (${rawMsg.slice(0, 120)}). Please retry in a moment or switch to another model/provider in AI Studio.`
          : rawMsg
      );
      const bar = document.getElementById('ai-reference-bar');
      if (bar) {
        bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      setGeneratingFieldKey(null);
      setIsGeneratingAll(false);
    }
  };

  const handleTranslateField = async (params: StoryAiTranslateParams) => {
    const rawText = params.text || '';
    const hasContent = params.isHtml
      ? rawText
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/gi, ' ')
          .trim().length > 0
      : rawText.trim().length > 0;

    if (!hasContent || translatingKeys[params.key]) return;

    setReferenceWarning(null);
    setTranslatingKeys((prev) => ({ ...prev, [params.key]: true }));

    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rawText,
          sourceLang: params.sourceLang,
          targetLang: params.targetLang,
          isHtml: Boolean(params.isHtml),
          fieldHint: params.fieldHint,
          storySlug: editingStory?.slug || '',
          storyContext: editingStory
            ? {
                client: resolveBilingualText(editingStory.client, 'en'),
                partner: resolveBilingualText(editingStory.partner, 'en'),
                topic: editingStory.topic?.en || editingStory.topic?.ar || '',
                category: editingStory.category?.en || editingStory.categorySlug || '',
              }
            : undefined,
        }),
      });

      const payload = await res.json();
      if (!res.ok || !payload.success || typeof payload.translation !== 'string') {
        throw new Error(payload.error || 'AI translation failed.');
      }

      if (payload.usage) {
        setLastUsageBanner({
          tokens: payload.usage.totalTokens || 0,
          costUsd: payload.usage.estimatedCostUsd || 0,
          isFreeTier: Boolean(payload.usage.isFreeTier),
        });
      }

      const translated = payload.translation;
      params.onSuccess?.(translated);

      if (params.updateStory) {
        setEditingStory((prev) => (prev ? params.updateStory!(prev, translated) : null));
      }
    } catch (err) {
      console.error('AI translation error:', err);
      const rawMsg = err instanceof Error ? err.message : 'AI translation failed.';
      const isOverload = /503|high demand|UNAVAILABLE|overloaded|429|rate.?limit/i.test(rawMsg);
      setReferenceWarning(
        isOverload
          ? isRtl
            ? `خوادم نموذج الذكاء الاصطناعي تشهد ضغطاً مرتفعاً مؤقتاً (${rawMsg.slice(0, 120)}). حاول مجدداً خلال ثوانٍ أو اختر نموذجاً/مزوداً آخر من AI Studio.`
            : `The AI provider is temporarily experiencing high demand (${rawMsg.slice(0, 120)}). Please retry in a moment or switch to another model/provider in AI Studio.`
          : rawMsg
      );
      const bar = document.getElementById('ai-reference-bar');
      if (bar) {
        bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      setTranslatingKeys((prev) => {
        const next = { ...prev };
        delete next[params.key];
        return next;
      });
    }
  };

  const aiControls: StoryAiFieldControls = {
    hasReference: combinedReferenceText.length > 0,
    generatingFieldKey,
    onGenerateField: handleGenerateAiField,
    onMissingReference: handleMissingReference,
    translatingKeys,
    onTranslate: handleTranslateField,
  };

  // Computed Draft Status for Currently Open Modal
  const currentStoryKey = !isCreating && editingStory ? persistedSlug || editingStory.slug : '';
  const matchingServerStory = currentStoryKey
    ? stories.find((s) => s.slug === currentStoryKey)
    : undefined;
  const hasServerDraftOnOpen = Boolean(
    matchingServerStory &&
      (matchingServerStory.status === 'draft' || Boolean(matchingServerStory.draftData))
  );
  const hasLocalDraftOnOpen = Boolean(
    editingStory &&
      (isCreating
        ? Boolean(newStoryLocalDraft) ||
          Boolean(
            initialNewStoryBaseline &&
              !areStoriesContentEqual(editingStory, initialNewStoryBaseline)
          )
        : currentStoryKey && Boolean(localDraftsMap[currentStoryKey]))
  );
  const isOpenEditorDirtyFromPublished = Boolean(
    editingStory &&
      !isCreating &&
      publishedBaseline &&
      !areStoriesContentEqual(editingStory, publishedBaseline)
  );
  const hasUnsavedOrDraftedEdits = Boolean(
    editingStory &&
      (hasServerDraftOnOpen ||
        hasLocalDraftOnOpen ||
        isOpenEditorDirtyFromPublished ||
        editingStory.status === 'draft')
  );
  const hasDiscardableDraft = Boolean(
    editingStory &&
      (isCreating
        ? hasLocalDraftOnOpen
        : hasServerDraftOnOpen || hasLocalDraftOnOpen || isOpenEditorDirtyFromPublished)
  );

  // Save as Draft (Offline-safe localStorage + Server draft persistence; stays open)
  const handleSaveDraft = async () => {
    if (!editingStory) return;

    const fallbackTitle =
      editingStory.title?.en?.trim() || editingStory.title?.ar?.trim() || '';
    const safeSlug =
      editingStory.slug?.trim() ||
      slugifyCategorySlug(fallbackTitle) ||
      `draft-${Date.now()}`;

    const draftStory = buildStorySavePayload(
      {
        ...editingStory,
        slug: safeSlug,
      },
      references
    );

    // 1. Always write immediately to localStorage so offline loss never loses work
    if (isCreating) {
      const localEntry = writeNewStoryLocalDraft(draftStory);
      if (localEntry) setNewStoryLocalDraft(localEntry);
    } else {
      const key = persistedSlug || safeSlug;
      const localEntry = writeLocalStoryDraft(key, draftStory);
      if (localEntry) {
        setLocalDraftsMap((prev) => ({ ...prev, [key]: localEntry }));
      }
    }

    setSavingDraft(true);
    try {
      const url = '/api/projects';
      const method = isCreating ? 'POST' : 'PUT';
      const lookupSlug = persistedSlug || safeSlug;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draftStory,
          action: 'save-draft',
          status: 'draft',
          ...(isCreating ? {} : { lookupSlug }),
        }),
      });

      const payload = await res.json().catch(() => ({}));
      if (res.ok) {
        const nowIso =
          typeof payload.draftUpdatedAt === 'string'
            ? payload.draftUpdatedAt
            : new Date().toISOString();

        if (isCreating) {
          clearNewStoryLocalDraft();
          setNewStoryLocalDraft(null);
          const syncedDraft: ClientStoryDetail = { ...draftStory, status: 'draft' };
          const savedLocal = writeLocalStoryDraft(safeSlug, syncedDraft);
          if (savedLocal) {
            setLocalDraftsMap((prev) => ({ ...prev, [safeSlug]: savedLocal }));
          }
          setIsCreating(false);
          setPersistedSlug(safeSlug);
          setPublishedBaseline(null);
          setInitialNewStoryBaseline(null);
          setEditingStory(syncedDraft);
        }

        setAutoSavedAt(nowIso);
        setPublishSuccessInfo(null);
        setDraftSavedFeedback({ at: nowIso, offline: false });
        void loadStories(false);
      } else {
        setDraftSavedFeedback({ at: new Date().toISOString(), offline: true });
      }
    } catch (err) {
      console.warn('Offline or network error while saving draft to server; kept in browser:', err);
      setDraftSavedFeedback({ at: new Date().toISOString(), offline: true });
    } finally {
      setSavingDraft(false);
    }
  };

  // Save & Publish Story (POST or PUT — keeps edit modal open & clears drafts)
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingStory) return;

    if (
      !editingStory.slug?.trim() ||
      !hasAnyBilingualText(editingStory.title) ||
      !hasAnyBilingualText(editingStory.client)
    ) {
      alert(
        isRtl
          ? 'يرجى إدخال المعرف (Slug)، وعنوان للمشروع واسم العميل بلغة واحدة على الأقل (العربية أو الإنجليزية).'
          : 'Please provide a URL slug, at least one title (EN or AR), and at least one client name (EN or AR).'
      );
      return;
    }

    setSaving(true);
    try {
      const url = '/api/projects';
      const method = isCreating ? 'POST' : 'PUT';
      const payloadToSave = buildStorySavePayload(editingStory, references);
      const lookupSlug = persistedSlug || payloadToSave.slug;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payloadToSave,
          action: 'publish',
          status: 'published',
          ...(isCreating ? {} : { lookupSlug }),
        }),
      });

      if (res.ok) {
        const cleanPublished: ClientStoryDetail = {
          ...stripDraftMeta(payloadToSave),
          status: 'published',
        };

        // Remove any local draft entries associated with old/new slug
        if (persistedSlug) {
          removeLocalStoryDraft(persistedSlug);
        }
        const remainingMap = removeLocalStoryDraft(cleanPublished.slug);
        setLocalDraftsMap(remainingMap);
        if (isCreating) {
          clearNewStoryLocalDraft();
          setNewStoryLocalDraft(null);
        }

        // Keep edit modal open with the freshly published baseline
        setEditingStory(cleanPublished);
        setPublishedBaseline(cleanPublished);
        setInitialNewStoryBaseline(null);
        setIsCreating(false);
        setPersistedSlug(cleanPublished.slug);
        setRestoredDraftInfo(null);
        setAutoSavedAt(null);
        setDraftSavedFeedback(null);
        setPublishSuccessInfo({ at: new Date().toISOString() });
        void loadStories(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Error saving story: ${errorData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Failed to save story:', err);
      alert(
        isRtl
          ? 'تعذر الاتصال بالخادم حالياً — تم حفظ مسودتك تلقائياً في المتصفح ولن تضيع تعديلاتك.'
          : 'Network error while publishing — your edits remain safely auto-saved in your browser draft.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Confirm & Execute Discard Draft (removes local + server drafts, restores last published version)
  const handleConfirmDiscardDraft = async () => {
    if (!discardConfirmTarget) return;
    setDiscardingDraft(true);

    try {
      if (discardConfirmTarget.mode === 'new-local-banner') {
        clearNewStoryLocalDraft();
        setNewStoryLocalDraft(null);
        setDiscardConfirmTarget(null);
        return;
      }

      if (discardConfirmTarget.mode === 'open-editor') {
        const keyA = persistedSlug || '';
        const keyB = editingStory?.slug || '';
        if (keyA) removeLocalStoryDraft(keyA);
        if (keyB && keyB !== keyA) removeLocalStoryDraft(keyB);
        setLocalDraftsMap(readLocalStoryDrafts());
        if (isCreating) {
          clearNewStoryLocalDraft();
          setNewStoryLocalDraft(null);
        }

        if (!isCreating && (keyA || keyB)) {
          await fetch('/api/projects', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'discard-draft',
              id: editingStory?.id,
              slug: keyB || keyA,
              lookupSlug: keyA || keyB,
            }),
          }).catch(() => {});
        }

        if (publishedBaseline) {
          setEditingStory(publishedBaseline);
          setReferences(
            Array.isArray(publishedBaseline.aiReferences)
              ? publishedBaseline.aiReferences
              : []
          );
          setRestoredDraftInfo(null);
          setAutoSavedAt(null);
          setDraftSavedFeedback(null);
          setPublishSuccessInfo(null);
          void loadStories(false);
        } else {
          // Never-published draft: deleting draft removes the unpublished record and closes modal
          setEditingStory(null);
          setPublishedBaseline(null);
          setInitialNewStoryBaseline(null);
          setIsCreating(false);
          setPersistedSlug(null);
          setRestoredDraftInfo(null);
          setAutoSavedAt(null);
          setDraftSavedFeedback(null);
          setPublishSuccessInfo(null);
          void loadStories(false);
        }

        setDiscardConfirmTarget(null);
        return;
      }

      if (discardConfirmTarget.mode === 'card' && discardConfirmTarget.story) {
        const target = discardConfirmTarget.story;
        const remaining = removeLocalStoryDraft(target.slug);
        setLocalDraftsMap(remaining);

        if (target.status === 'draft' || target.draftData) {
          await fetch('/api/projects', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'discard-draft',
              id: target.id,
              slug: target.slug,
              lookupSlug: target.slug,
            }),
          }).catch(() => {});
        }

        void loadStories(false);
        setDiscardConfirmTarget(null);
      }
    } finally {
      setDiscardingDraft(false);
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
        setLocalDraftsMap(removeLocalStoryDraft(slug));
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
    const p = normalizeBilingualInput(story.partner);
    const c = normalizeBilingualInput(story.client);
    const partnerEn = p.en.toLowerCase();
    const partnerAr = p.ar.toLowerCase();
    const clientEn = c.en.toLowerCase();
    const clientAr = c.ar.toLowerCase();
    const slug = story.slug?.toLowerCase() || '';

    const matchesQuery =
      !q ||
      titleEn.includes(q) ||
      titleAr.includes(q) ||
      partnerEn.includes(q) ||
      partnerAr.includes(q) ||
      clientEn.includes(q) ||
      clientAr.includes(q) ||
      slug.includes(q);
    const matchesCategory = categoryFilter === 'all' || story.categorySlug === categoryFilter;
    const matchesTemplate = templateFilter === 'all' || story.templateType === templateFilter;
    const matchesFeatured = !featuredOnly || Boolean(story.featured);

    return matchesQuery && matchesCategory && matchesTemplate && matchesFeatured;
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-6 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. Page Master Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-persici-crimson mb-1.5">
            <TbSparkles className="w-4 h-4" />
            <span>{isRtl ? 'إدارة قصص نجاح العملاء ودراسات الحالة' : 'Client Stories & Case Studies CMS'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isRtl ? 'قصص العملاء (Client Stories)' : 'Client Stories & Case Studies'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            {isRtl
              ? 'إضافة وتعديل قصص العملاء، وتحديد القصص المميزة (Featured Stories)، وتخصيص التصنيف والقالب الديناميكي (تطبيقات ويب، تطبيقات جوال، حملات فيديو، وهوية بصرية) ومكتبة Cloudflare R2.'
              : 'Create, edit, and feature client stories across the Featured Stories carousel and All Client Stories infinite grid. Customize categories, dynamic showcase templates (Web Apps, Mobile Apps, Video Reels, Branding Galleries), metrics, and Cloudflare R2 media.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={openNewProject}
            className="flex items-center gap-2 px-5 py-2.5 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-persici-crimson/20 transition-all cursor-pointer"
          >
            <TbPlus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة قصة عميل جديدة' : 'Add Client Story'}</span>
          </button>

          <Link
            href={getHref(`/${lang}/dashboard/content/projects/categories`)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <TbCategory className="w-4 h-4 text-persici-crimson" />
            <span>{isRtl ? 'التصنيفات' : 'Categories'}</span>
          </Link>

          <button
            type="button"
            onClick={() => setSpacingModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title={
              isRtl
                ? 'تخصيص مسافات جميع صفحات تفاصيل قصص العملاء'
                : 'Customize spacing across all Client Story Detail pages'
            }
          >
            <TbSpacingVertical className="w-4 h-4 text-persici-crimson" />
            <span>{isRtl ? 'مسافات صفحات القصص' : 'Detail Page Spacing'}</span>
          </button>

          <Link
            href={`/${lang}/dashboard/pages/client-stories`}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
            title="Edit Client Stories Hub Page Hero & Section Titles"
          >
            <TbLayout className="w-4 h-4 text-persici-crimson" />
            <span>{isRtl ? 'تعديل عناوين صفحة قصص العملاء' : 'Edit Hub Page Sections'}</span>
          </Link>

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
              <option value="ai-platform-showcase">{isRtl ? 'منصات الذكاء الاصطناعي (AI Platforms)' : 'AI Platforms'}</option>
              <option value="mobile-app-showcase">{isRtl ? 'تطبيقات الجوال (Mobile App)' : 'Native Mobile App'}</option>
              <option value="marketing-video-showcase">{isRtl ? 'فيديو وحملات (Marketing Video)' : 'Marketing Video Reel'}</option>
              <option value="marketing-branding-showcase">{isRtl ? 'التسويق والهوية البصرية (1-2 وسائط)' : 'Marketing & Branding (1-2 Assets)'}</option>
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

        {/* Category Filter Pills (Synced Live with Client Story Categories) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
          <span className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider shrink-0 me-1">
            {isRtl ? 'التصنيف:' : 'Category:'}
          </span>
          {(() => {
            const knownSlugs = new Set(categories.map((c) => c.slug));
            const dynamicCats: ClientStoryCategory[] = [...categories];
            for (const st of stories) {
              if (st.categorySlug && st.categorySlug !== 'all' && !knownSlugs.has(st.categorySlug)) {
                knownSlugs.add(st.categorySlug);
                dynamicCats.push({
                  id: st.categorySlug,
                  slug: st.categorySlug,
                  name: {
                    en: resolveBilingualText(st.category, 'en') || st.categorySlug,
                    ar: resolveBilingualText(st.category, 'ar') || st.categorySlug,
                  },
                  order: dynamicCats.length + 1,
                });
              }
            }

            const filterPills = [
              {
                id: 'all',
                label: isRtl ? 'الكل' : 'All Categories',
                count: stories.length,
              },
              ...dynamicCats.map((cat) => ({
                id: cat.slug,
                label: resolveBilingualText(cat.name, lang),
                count: stories.filter((s) => s.categorySlug === cat.slug).length,
              })),
            ];

            return filterPills.map((cat) => {
              const isActive = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            });
          })()}
        </div>
      </div>

      {/* Unsaved New Story Browser Draft Banner */}
      {!editingStory && newStoryLocalDraft && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <TbFilePencil className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-amber-950">
                  {isRtl
                    ? 'توجد مسودة غير منشورة لقصة عميل جديدة محفوظة تلقائياً'
                    : 'Unsaved New Client Story Draft Found'}
                </span>
                <span className="text-[11px] font-mono text-amber-800/80">
                  {new Date(newStoryLocalDraft.savedAt).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-amber-900/80 truncate mt-0.5">
                {newStoryLocalDraft.draftStory.title?.en ||
                  newStoryLocalDraft.draftStory.title?.ar ||
                  newStoryLocalDraft.storyKey}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setDiscardConfirmTarget({ mode: 'new-local-banner' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-red-50 hover:border-red-200 text-amber-900 hover:text-red-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <TbRotateClockwise2 className="w-3.5 h-3.5" />
              <span>{isRtl ? 'حذف المسودة' : 'Discard Draft'}</span>
            </button>
            <button
              type="button"
              onClick={resumeNewStoryDraft}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <TbFilePencil className="w-3.5 h-3.5" />
              <span>{isRtl ? 'استكمال تعديل المسودة' : 'Resume Draft'}</span>
            </button>
          </div>
        </div>
      )}

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
          {filteredStories.map((story) => {
            const localEntry = localDraftsMap[story.slug];
            const serverDraft = story.draftData;
            let previewStory = story;
            let cardDraftAt = story.draftUpdatedAt;

            if (localEntry && serverDraft) {
              const localMs = new Date(localEntry.savedAt).getTime() || 0;
              const serverMs = story.draftUpdatedAt
                ? new Date(story.draftUpdatedAt).getTime() || 0
                : 0;
              if (localMs >= serverMs) {
                previewStory = localEntry.draftStory;
                cardDraftAt = localEntry.savedAt;
              } else {
                previewStory = serverDraft;
              }
            } else if (localEntry) {
              previewStory = localEntry.draftStory;
              cardDraftAt = localEntry.savedAt;
            } else if (serverDraft) {
              previewStory = serverDraft;
            }

            const cardDraftStatus: 'none' | 'unpublished-draft' | 'unsaved-edits' =
              story.status === 'draft'
                ? 'unpublished-draft'
                : localEntry || serverDraft
                ? 'unsaved-edits'
                : 'none';

            return (
              <PortfolioCard
                key={story.slug}
                story={story}
                displayStory={previewStory}
                draftStatus={cardDraftStatus}
                draftUpdatedAt={cardDraftAt}
                lang={lang}
                onEdit={openEditStory}
                onDelete={handleDelete}
                onToggleFeatured={handleToggleFeatured}
                onDiscardDraft={(targetStory) =>
                  setDiscardConfirmTarget({ mode: 'card', story: targetStory })
                }
              />
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DEEP PORTFOLIO STORY EDITOR DRAWER / MODAL                             */}
      {/* ========================================================================= */}
      {editingStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-6xl w-full my-4 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Top Header Bar */}
            <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/80 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500">
                  <span className="font-bold text-persici-crimson uppercase">
                    {isCreating ? (isRtl ? 'إضافة مشروع جديد' : 'New Case Study') : (isRtl ? 'تعديل دراسة الحالة' : 'Edit Story')}
                  </span>
                  <span>•</span>
                  <span className="truncate">/{editingStory.slug}</span>

                  {publishSuccessInfo && !hasUnsavedOrDraftedEdits ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-sans font-bold">
                      <TbCheck className="w-3 h-3" />
                      <span>{isRtl ? 'تم الحفظ والنشر بنجاح' : 'Saved & Published Live'}</span>
                    </span>
                  ) : hasUnsavedOrDraftedEdits ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-sans font-bold">
                      <TbCloudCheck className="w-3 h-3" />
                      <span>
                        {draftSavedFeedback?.offline
                          ? isRtl
                            ? 'مسودة محفوظة محلياً (غير متصل)'
                            : 'Draft Saved Locally (Offline)'
                          : draftSavedFeedback
                          ? isRtl
                            ? 'تم حفظ المسودة'
                            : 'Draft Saved'
                          : autoSavedAt
                          ? isRtl
                            ? 'حفظ تلقائي للمسودة'
                            : 'Auto-saved Draft'
                          : isRtl
                          ? 'مسودة غير منشورة'
                          : 'Draft Active'}
                      </span>
                    </span>
                  ) : null}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate mt-0.5">
                  {editingStory.title?.en || editingStory.title?.ar || 'Untitled Story'}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {!isCreating && editingStory.status !== 'draft' && (
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

                {hasDiscardableDraft && (
                  <button
                    type="button"
                    onClick={() => setDiscardConfirmTarget({ mode: 'open-editor' })}
                    disabled={saving || savingDraft || discardingDraft}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-red-50 text-amber-800 hover:text-red-700 border border-amber-300 hover:border-red-300 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                    title={
                      isRtl
                        ? 'حذف المسودة والعودة لآخر نسخة منشورة'
                        : 'Discard draft and revert to last published version'
                    }
                  >
                    <TbRotateClockwise2 className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">
                      {isRtl ? 'حذف المسودة' : 'Remove Draft'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => void handleSaveDraft()}
                  disabled={saving || savingDraft || discardingDraft}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  {savingDraft ? (
                    <TbLoader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <TbFilePencil className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {savingDraft
                      ? isRtl
                        ? 'جارٍ حفظ المسودة...'
                        : 'Saving Draft...'
                      : isRtl
                      ? 'حفظ كمسودة'
                      : 'Save as Draft'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving || savingDraft || discardingDraft}
                  className="flex items-center gap-1.5 px-5 py-2 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <TbLoader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TbDeviceFloppy className="w-4 h-4" />
                  )}
                  <span>{saving ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') : (isRtl ? 'حفظ ونشر' : 'Save & Publish')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloseEditorModal}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title={isRtl ? 'إغلاق (يتم الاحتفاظ بالمسودة تلقائياً)' : 'Close (draft auto-saved)'}
                >
                  <TbX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Status / Restored Draft Notification Strip */}
            {publishSuccessInfo && !hasUnsavedOrDraftedEdits ? (
              <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900 shrink-0">
                <div className="flex items-center gap-2 font-semibold">
                  <TbCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isRtl
                      ? 'تم حفظ ونشر دراسة الحالة بالتعديلات الجديدة بنجاح. يمكنك متابعة التعديل هنا أو إغلاق النافذة عند الانتهاء.'
                      : 'Client Story saved and published live with your new edits. You can keep editing here or close when finished.'}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-700">
                  {new Date(publishSuccessInfo.at).toLocaleTimeString()}
                </span>
              </div>
            ) : restoredDraftInfo || draftSavedFeedback ? (
              <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950 shrink-0">
                <div className="flex items-center gap-2 font-medium">
                  <TbFilePencil className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {draftSavedFeedback?.offline
                      ? isRtl
                        ? 'تعذر الوصول للخادم — تم حفظ المسودة محلياً في المتصفح لحين عودة الاتصال بالإنترنت.'
                        : 'Saved locally in your browser (offline protection active until internet connection returns).'
                      : draftSavedFeedback
                      ? isRtl
                        ? 'تم حفظ المسودة في قاعدة البيانات والمتصفح دون نشرها على الموقع بعد.'
                        : 'Draft saved safely to database & browser without publishing changes live yet.'
                      : restoredDraftInfo?.source === 'local'
                      ? isRtl
                        ? 'تمت استعادة آخر تعديلاتك غير المنشورة من المسودة التلقائية للمتصفح.'
                        : 'Restored your unsaved draft edits automatically from your last session.'
                      : isRtl
                      ? 'يتم الآن تحرير المسودة المحفوظة لهذه القصة.'
                      : 'Editing saved draft changes (not yet published live).'}
                  </span>
                </div>
                {hasDiscardableDraft && (
                  <button
                    type="button"
                    onClick={() => setDiscardConfirmTarget({ mode: 'open-editor' })}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 hover:underline cursor-pointer shrink-0"
                  >
                    <TbRotateClockwise2 className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'حذف المسودة' : 'Remove Draft'}</span>
                  </button>
                )}
              </div>
            ) : null}

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
                {/* Reference Document Uploader & Global AI Control Bar */}
                <PortfolioAiReferenceBar
                  lang={lang}
                  references={references}
                  onAddReferences={(docs) =>
                    void persistStoryReferences([...references, ...docs])
                  }
                  onRemoveReference={(id) =>
                    void persistStoryReferences(
                      references.filter((item) => item.id !== id)
                    )
                  }
                  onClearAllReferences={() => void persistStoryReferences([])}
                  isSavingReferences={isSavingReferences}
                  onGenerateAll={() => handleGenerateAiField('all', { keyLabel: 'all' })}
                  isGeneratingAll={isGeneratingAll}
                  generatingFieldKey={generatingFieldKey}
                  referenceWarning={referenceWarning}
                  onDismissWarning={() => setReferenceWarning(null)}
                  activeAiMeta={activeAiMeta}
                  lastUsageBanner={lastUsageBanner}
                />

                {/* Image Upload WebP Quality Mode Bar (Before Upload Toggle) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {isRtl
                        ? 'إعداد جودة وضغط الصور قبل الرفع (WebP)'
                        : 'Before Upload: Image Quality & WebP Conversion Setting'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isRtl
                        ? 'يحفظ الوضع عالي الجودة دقة لقطات الشاشة الكاملة للمواقع بدون تصغير حاد مع تحويلها لـ WebP.'
                        : 'High Quality WebP keeps full-page website screenshots crisp (up to 3840w × 16380h at q94) while converting to WebP.'}
                    </p>
                  </div>
                  <div className="inline-flex items-center p-1 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                    <button
                      type="button"
                      onClick={() => setUploadQualityMode('high-webp')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        uploadQualityMode === 'high-webp'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <TbSparkles className="w-3.5 h-3.5" />
                      <span>
                        {isRtl
                          ? 'جودة عالية WebP (للشاشات الكاملة)'
                          : 'High Quality WebP (Full-Screen)'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadQualityMode('reduced-webp')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        uploadQualityMode === 'reduced-webp'
                          ? 'bg-slate-800 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{isRtl ? 'تقليل الجودة WebP' : 'Reduced Quality WebP'}</span>
                    </button>
                  </div>
                </div>

                {/* Section 01: Meta & General */}
                <PortfolioMetaSection
                  story={editingStory}
                  onChange={setEditingStory}
                  lang={lang}
                  categories={categories}
                  onCategoryCreated={(cat) =>
                    setCategories((prev) => [
                      ...prev.filter((c) => c.slug !== cat.slug),
                      cat,
                    ])
                  }
                  aiControls={aiControls}
                />

                {/* Section 02: Hero & Summary */}
                <PortfolioHeroSection
                  story={editingStory}
                  onChange={setEditingStory}
                  lang={lang}
                  onOpenMediaPicker={handleOpenMediaPicker}
                  onOpenMultiMediaPicker={handleOpenMultiMediaPicker}
                  aiControls={aiControls}
                />

                {/* Section 03: Key Impact Metrics */}
                <PortfolioMetricsSection
                  story={editingStory}
                  onChange={setEditingStory}
                  lang={lang}
                  aiControls={aiControls}
                />

                {/* Section 04: Narrative - Overview */}
                <PortfolioNarrativeSection
                  id="sec-intro"
                  sectionRole="intro"
                  stepNumber="04"
                  sectionTitleEn="Section 1: Project Overview"
                  sectionTitleAr="القسم الأول: نظرة عامة وسياق المشروع"
                  descriptionEn="Initial agency context, client background, and strategic alignment."
                  descriptionAr="سياق التدخل الاستشاري، خلفية العميل، ومواءمة الأهداف الاستراتيجية."
                  sectionData={editingStory.intro}
                  onChange={(updated) =>
                    setEditingStory((prev) => (prev ? { ...prev, intro: updated } : null))
                  }
                  lang={lang}
                  aiControls={aiControls}
                  onOpenMediaPicker={handleOpenMediaPicker}
                  uploadQualityMode={uploadQualityMode}
                  onUploadQualityModeChange={setUploadQualityMode}
                />

                {/* Section 05: Narrative - Problem */}
                <PortfolioNarrativeSection
                  id="sec-problem"
                  sectionRole="problem"
                  stepNumber="05"
                  sectionTitleEn="Section 2: The Challenge"
                  sectionTitleAr="القسم الثاني: التحدي والمشكلة الاستراتيجية"
                  descriptionEn="Core business bottlenecks, technical debt, or market obstacles faced."
                  descriptionAr="العقبات الرئيسية، القيود التقنية السابقة، والتحديات التسويقية المعقدة."
                  sectionData={editingStory.problem}
                  onChange={(updated) =>
                    setEditingStory((prev) => (prev ? { ...prev, problem: updated } : null))
                  }
                  lang={lang}
                  aiControls={aiControls}
                  onOpenMediaPicker={handleOpenMediaPicker}
                  uploadQualityMode={uploadQualityMode}
                  onUploadQualityModeChange={setUploadQualityMode}
                />

                {/* Section 06: Narrative - Solution */}
                <PortfolioNarrativeSection
                  id="sec-solution"
                  sectionRole="solution"
                  stepNumber="06"
                  sectionTitleEn="Section 3: The Engineered Solution"
                  sectionTitleAr="القسم الثالث: الحل المعماري والتنفيذ"
                  descriptionEn="Strategic architecture, software engineering, or campaigns delivered by Persici."
                  descriptionAr="الهندسة المعمارية المطورة، البرمجيات المتقدمة، أو الحملات الإبداعية المنفذة."
                  sectionData={editingStory.solution}
                  onChange={(updated) =>
                    setEditingStory((prev) => (prev ? { ...prev, solution: updated } : null))
                  }
                  lang={lang}
                  aiControls={aiControls}
                  onOpenMediaPicker={handleOpenMediaPicker}
                  uploadQualityMode={uploadQualityMode}
                  onUploadQualityModeChange={setUploadQualityMode}
                />

                {/* Section 07: Narrative - Impact */}
                <PortfolioNarrativeSection
                  id="sec-impact"
                  sectionRole="impact"
                  stepNumber="07"
                  sectionTitleEn="Section 4: The Measurable Impact"
                  sectionTitleAr="القسم الرابع: الأثر والنتائج وعائد الاستثمار"
                  descriptionEn="Quantifiable growth, customer feedback, and long-term business value generated."
                  descriptionAr="العائد الملموس على الاستثمار، نمو المبيعات، والأثر المستدام على أعمال العميل."
                  sectionData={editingStory.impact}
                  onChange={(updated) =>
                    setEditingStory((prev) => (prev ? { ...prev, impact: updated } : null))
                  }
                  lang={lang}
                  aiControls={aiControls}
                  onOpenMediaPicker={handleOpenMediaPicker}
                  uploadQualityMode={uploadQualityMode}
                  onUploadQualityModeChange={setUploadQualityMode}
                />

                {/* Section 08: Media Showcase & Deliverables */}
                <PortfolioMediaShowcaseSection
                  story={editingStory}
                  onChange={setEditingStory}
                  lang={lang}
                  onOpenMediaPicker={handleOpenMediaPicker}
                  onOpenMultiMediaPicker={handleOpenMultiMediaPicker}
                  aiControls={aiControls}
                />

                {/* Section 09: Related Stories & Final Publish Bar */}
                <div id="sec-publish" className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="border-b border-slate-200 pb-2 flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-persici-crimson/10 text-persici-crimson text-xs font-mono font-bold flex items-center justify-center">
                        09
                      </span>
                      <span>{isRtl ? 'المشاريع ذات الصلة وإتمام النشر' : 'Related Stories & Publishing'}</span>
                    </h4>

                    <AiFieldTrigger
                      variant="pill"
                      lang={lang}
                      hasReference={aiControls.hasReference}
                      allowWithoutReference
                      onMissingReference={aiControls.onMissingReference}
                      isLoading={generatingFieldKey === 'related_slugs'}
                      onGenerate={() =>
                        handleGenerateAiField('related_slugs', { keyLabel: 'related_slugs' })
                      }
                      labelEn="Find Related Stories with AI"
                      labelAr="اقتراح مشاريع ذات صلة بالذكاء الاصطناعي"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="block text-xs font-semibold text-slate-700">
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
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 outline-none focus:bg-white focus:border-persici-crimson"
                    />

                    {(editingStory.relatedSlugs || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {(editingStory.relatedSlugs || []).map((relSlug) => {
                          const matched = stories.find((s) => s.slug === relSlug);
                          return (
                            <span
                              key={relSlug}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] border ${
                                matched
                                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                                  : 'bg-amber-50 border-amber-200 text-amber-800'
                              }`}
                            >
                              <span className="font-semibold truncate max-w-[220px]">
                                {matched
                                  ? isRtl
                                    ? matched.title?.ar || matched.title?.en || relSlug
                                    : matched.title?.en || relSlug
                                  : relSlug}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                ({matched ? matched.categorySlug : isRtl ? 'غير موجود' : 'unmatched'})
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingStory({
                                    ...editingStory,
                                    relatedSlugs: (editingStory.relatedSlugs || []).filter(
                                      (s) => s !== relSlug
                                    ),
                                  })
                                }
                                className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                                title={isRtl ? 'إزالة' : 'Remove'}
                              >
                                <TbX className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="text-sm font-bold">
                          {isRtl ? 'جاهز لنشر دراسة الحالة؟' : 'Ready to Publish Changes?'}
                        </h5>
                        {publishSuccessInfo && !hasUnsavedOrDraftedEdits && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                            <TbCheck className="w-3 h-3" />
                            <span>{isRtl ? 'تم الحفظ والنشر بنجاح' : 'Saved & Published Live'}</span>
                          </span>
                        )}
                        {draftSavedFeedback && hasUnsavedOrDraftedEdits && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-[10px] font-bold">
                            <TbCloudCheck className="w-3 h-3" />
                            <span>
                              {draftSavedFeedback.offline
                                ? isRtl
                                  ? 'مسودة محلية (غير متصل)'
                                  : 'Saved Locally (Offline)'
                                : isRtl
                                ? 'تم حفظ المسودة'
                                : 'Draft Saved'}
                            </span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {isRtl
                          ? 'يتم النشر مباشرة وتظل نافذة التعديل مفتوحة لمتابعة عملك، أو يمكنك الحفظ كمسودة دون نشر.'
                          : 'Publishes live while keeping this editor open for further edits, or save safely as a draft.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleCloseEditorModal}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                      >
                        {isRtl ? 'إغلاق' : 'Close'}
                      </button>

                      {hasDiscardableDraft && (
                        <button
                          type="button"
                          onClick={() => setDiscardConfirmTarget({ mode: 'open-editor' })}
                          disabled={saving || savingDraft || discardingDraft}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-red-500/20 text-amber-200 hover:text-red-200 border border-white/15 hover:border-red-400/40 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <TbRotateClockwise2 className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'حذف المسودة' : 'Remove Draft'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => void handleSaveDraft()}
                        disabled={saving || savingDraft || discardingDraft}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 border border-amber-400/40 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {savingDraft ? (
                          <TbLoader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <TbFilePencil className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {savingDraft
                            ? isRtl
                              ? 'جارٍ الحفظ...'
                              : 'Saving Draft...'
                            : isRtl
                            ? 'حفظ كمسودة'
                            : 'Save as Draft'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSave()}
                        disabled={saving || savingDraft || discardingDraft}
                        className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-persici-crimson/30 cursor-pointer disabled:opacity-50"
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
                            ? 'حفظ ونشر'
                            : 'Save & Publish'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discard Draft Warning Confirmation Modal */}
      {discardConfirmTarget &&
        (() => {
          const targetStory =
            discardConfirmTarget.mode === 'card'
              ? discardConfirmTarget.story
              : discardConfirmTarget.mode === 'open-editor'
              ? publishedBaseline
              : null;
          const willDeleteUnpublished =
            discardConfirmTarget.mode === 'new-local-banner' ||
            (discardConfirmTarget.mode === 'open-editor' && !publishedBaseline) ||
            (discardConfirmTarget.mode === 'card' && targetStory?.status === 'draft');

          return (
            <div className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                    <TbAlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900">
                      {isRtl
                        ? 'هل تريد حقاً حذف هذه المسودة؟'
                        : 'Did you really want to discard this draft?'}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {willDeleteUnpublished
                        ? isRtl
                          ? 'لم يتم نشر قصة العميل هذه بعد. الموافقة على حذف المسودة ستمسح جميع التعديلات المحفوظة لهذه المسودة نهائياً.'
                          : 'This client story has not been published yet. Confirming will permanently delete this saved draft and its unsaved changes.'
                        : isRtl
                        ? 'سيتم حذف جميع التعديلات المحفوظة في المسودة واستعادة آخر نسخة منشورة ومحفوظة من قصة العميل.'
                        : 'All unpublished draft edits will be deleted and the story will revert cleanly to the last saved & published version.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={discardingDraft}
                    onClick={() => setDiscardConfirmTarget(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isRtl ? 'إلغاء والاحتفاظ بالمسودة' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    disabled={discardingDraft}
                    onClick={() => void handleConfirmDiscardDraft()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {discardingDraft ? (
                      <TbLoader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <TbTrash className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {discardingDraft
                        ? isRtl
                          ? 'جارٍ الحذف...'
                          : 'Discarding...'
                        : isRtl
                        ? 'نعم، حذف المسودة'
                        : 'Yes, Discard Draft'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Global Client Story Detail Page Spacing Modal */}
      {spacingModalOpen && (
        <StoryDetailSpacingModal
          isOpen={spacingModalOpen}
          onClose={() => setSpacingModalOpen(false)}
          lang={lang}
        />
      )}

      {/* Media Picker Modal (Supports Single & Bulk Multi-Select + Folder/Subfolder Uploads) */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={mediaPickerOpen}
          multiple={mediaPickerMultiple}
          allowedType={mediaPickerType}
          onClose={() => {
            setMediaPickerOpen(false);
            setMediaPickerMultiple(false);
            setMediaPickerCallback(null);
            setMediaPickerMultiCallback(null);
          }}
          onSelect={handleMediaPickerSelect}
          onSelectMultiple={handleMediaPickerSelectMultiple}
          defaultFolder="projects"
          defaultQualityMode={uploadQualityMode}
        />
      )}
    </div>
  );
}
