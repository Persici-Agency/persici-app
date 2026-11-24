import type { LocalizedString } from '@shared/types';

export type StoryTemplateType =
  | 'marketing-video-showcase'
  | 'image-gallery-showcase'
  | 'marketing-branding-showcase'
  | 'software-web-app-showcase'
  | 'ai-platform-showcase'
  | 'mobile-app-showcase';

export type StoryGalleryDesign =
  | 'editorial-bento'
  | 'uniform-grid'
  | 'interactive-carousel'
  | 'masonry-lookbook'
  | 'spotlight-filmstrip'
  | 'magazine-spread';

export type StoryGalleryOrder = 'normal' | 'reverse';

export type DefaultStoryCategorySlug =
  | 'all'
  | 'software'
  | 'ai-platforms'
  | 'branding'
  | 'marketing'
  | 'marketing-branding'
  | 'video-production';

export type StoryCategorySlug = DefaultStoryCategorySlug | (string & {});

export interface ClientStoryCategory {
  id: string;
  slug: string;
  name: LocalizedString;
  description?: LocalizedString;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_CLIENT_STORY_CATEGORIES: ClientStoryCategory[] = [
  {
    id: 'software',
    slug: 'software',
    name: { en: 'Software & Web Apps', ar: 'البرمجيات والتطبيقات الرقمية' },
    order: 1,
  },
  {
    id: 'ai-platforms',
    slug: 'ai-platforms',
    name: { en: 'AI Platforms', ar: 'منصات الذكاء الاصطناعي' },
    order: 2,
  },
  {
    id: 'branding',
    slug: 'branding',
    name: { en: 'Branding & Identity', ar: 'الهوية البصرية والعلامة التجارية' },
    order: 3,
  },
  {
    id: 'marketing',
    slug: 'marketing',
    name: { en: 'Marketing & Performance', ar: 'الحملات ونمو العلامة التجارية' },
    order: 4,
  },
  {
    id: 'marketing-branding',
    slug: 'marketing-branding',
    name: { en: 'Marketing & Branding', ar: 'التسويق والهوية البصرية' },
    order: 5,
  },
  {
    id: 'video-production',
    slug: 'video-production',
    name: { en: 'Media Production & Films', ar: 'الإنتاج المرئي والسينمائي' },
    order: 6,
  },
];

export function slugifyCategorySlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface StoryMetric {
  value: string;
  label: LocalizedString;
}

export interface StoryVideoItem {
  id: string;
  title: LocalizedString;
  duration?: string;
  videoUrl: string;
  posterUrl?: string;
  aspectRatio?: '16:9' | '9:16' | '4:3';
}

export interface StoryGalleryImage {
  src: string;
  alt: LocalizedString;
  caption?: LocalizedString;
  width?: number;
  height?: number;
  featured?: boolean;
}

export interface StoryHeroSliderImage {
  src: string;
  alt?: LocalizedString;
}

export interface StoryHeroSliderConfig {
  enabled: boolean;
  autoScroll: boolean;
  infinite: boolean;
  /** Auto-scroll delay between slides in milliseconds (1500..10000, default 4000) */
  intervalMs: number;
  /** Slide glide transition duration in milliseconds (250..1500, default 650) */
  transitionMs: number;
  showArrows: boolean;
  /** Additional slider images displayed after `heroImage` (Slide #1 is always `heroImage`) */
  images: StoryHeroSliderImage[];
}

export interface StorySoftwareDeviceMockup {
  type: 'desktop' | 'mobile' | 'tablet';
  image: string;
  title?: LocalizedString;
  mediaType?: 'image' | 'gif' | 'video';
  videoUrl?: string;
}

export interface StoryTechBadge {
  name: string;
  category?: 'frontend' | 'backend' | 'database' | 'cloud' | 'tool' | 'design';
}

export interface StoryAiReferenceItem {
  id: string;
  filename: string;
  extension: string;
  text: string;
  wordCount: number;
  charCount: number;
  metaSummary: string;
  savedAt?: string;
}

export type StorySectionImageSize = 'sm' | 'md' | 'lg' | 'full';

export interface StorySectionImage {
  src: string;
  alt?: LocalizedString;
  caption?: LocalizedString;
  size?: StorySectionImageSize;
  widthPercent?: number; // 30 to 100
  maxHeight?: number; // optional max-height in px (0 or undefined = natural auto height)
  objectFit?: 'contain' | 'cover';
}

export type StoryCodeLanguage =
  | 'html'
  | 'php'
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'nextjs'
  | 'css'
  | 'python'
  | 'sql'
  | 'json'
  | 'bash';

export interface StoryCodeBlock {
  id?: string;
  title: LocalizedString;
  language: StoryCodeLanguage | string;
  code: string;
}

export interface StoryNarrativeSection {
  id: string;
  title: LocalizedString;
  image?: StorySectionImage;
  paragraphs: LocalizedString[];
  bullets?: LocalizedString[];
  codeBlocks?: StoryCodeBlock[];
  quote?: {
    text: LocalizedString;
    author: string;
    role?: LocalizedString;
  };
}

export interface ClientStoryDetail {
  id: string;
  slug: string;
  templateType: StoryTemplateType;
  category: LocalizedString;
  categorySlug: StoryCategorySlug;
  featured: boolean;
  featuredOrder?: number;

  // Hero & Meta
  title: LocalizedString;
  leadSubtitle: LocalizedString;
  executiveSummary: LocalizedString;
  partner?: LocalizedString;
  client: LocalizedString;
  topic: LocalizedString;
  services: LocalizedString[];
  region: LocalizedString;
  date: string;
  link?: string;

  // High-res Featured Media
  heroImage: string;
  heroSlider?: StoryHeroSliderConfig;
  heroVideo?: string;
  heroVideoPoster?: string;

  // Key Metrics (2 - 4)
  metrics: StoryMetric[];

  // Narrative Content
  intro: StoryNarrativeSection;
  problem: StoryNarrativeSection;
  solution: StoryNarrativeSection;
  impact: StoryNarrativeSection;

  // Adaptive Media Showcase
  mediaShowcase: {
    title: LocalizedString;
    description: LocalizedString;
    // Template A (Multi-video)
    videos?: StoryVideoItem[];
    // Template B / Universal Visual Gallery & Layout Design
    gallery?: StoryGalleryImage[];
    galleryDesign?: StoryGalleryDesign;
    galleryOrder?: StoryGalleryOrder;
    // Template C (Software demo & mockups)
    mockups?: StorySoftwareDeviceMockup[];
    demoVideo?: string;
    demoVideoPoster?: string;
    techStack?: StoryTechBadge[];
  };

  // Related Stories (Slugs)
  relatedSlugs: string[];

  // Persisted AI Reference Files & Text Notes
  aiReferences?: StoryAiReferenceItem[];
}

export interface ClientStoriesHubCategoryFilter {
  slug: StoryCategorySlug;
  label: LocalizedString;
}

export interface ClientStoriesHubPageData {
  hero: {
    badge: LocalizedString;
    title: LocalizedString;
    titleHighlight: LocalizedString;
    subtitle: LocalizedString;
    primaryCtaLabel: LocalizedString;
    primaryCtaHref: string;
    secondaryCtaLabel: LocalizedString;
    secondaryCtaHref: string;
  };
  featuredSection: {
    badge: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    ctaLabel: LocalizedString;
  };
  allStoriesSection: {
    badge: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    emptyTitle: LocalizedString;
    emptySubtitle: LocalizedString;
    categories: ClientStoriesHubCategoryFilter[];
  };
}

export function normalizeBilingualInput(
  val: unknown,
  fallback?: LocalizedString | string
): LocalizedString {
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed && fallback) return normalizeBilingualInput(fallback);
    return { en: trimmed, ar: '' };
  }
  if (val && typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    const en = typeof obj.en === 'string' ? obj.en : '';
    const ar = typeof obj.ar === 'string' ? obj.ar : '';
    return { en, ar };
  }
  if (fallback) return normalizeBilingualInput(fallback);
  return { en: '', ar: '' };
}

/**
 * Resolves localized text for `lang` ('en' | 'ar').
 * If the requested language is empty, automatically falls back to the other language.
 */
export function resolveBilingualText(
  val: LocalizedString | string | null | undefined,
  lang: string = 'en'
): string {
  if (typeof val === 'string') return val.trim();
  if (!val || typeof val !== 'object') return '';
  const en = typeof val.en === 'string' ? val.en.trim() : '';
  const ar = typeof val.ar === 'string' ? val.ar.trim() : '';
  return lang === 'ar' ? ar || en : en || ar;
}

export function hasAnyBilingualText(
  val: LocalizedString | string | null | undefined
): boolean {
  return resolveBilingualText(val, 'en').length > 0;
}

