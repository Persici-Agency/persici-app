import type { LocalizedString } from '@shared/types';

export type StoryTemplateType =
  | 'marketing-video-showcase'
  | 'image-gallery-showcase'
  | 'software-web-app-showcase'
  | 'mobile-app-showcase';

export type StoryCategorySlug =
  | 'all'
  | 'software'
  | 'branding'
  | 'marketing'
  | 'video-production';

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
  client: string;
  topic: LocalizedString;
  services: LocalizedString[];
  region: LocalizedString;
  date: string;
  link?: string;

  // High-res Featured Media
  heroImage: string;
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
    // Template B (Image gallery & lightbox)
    gallery?: StoryGalleryImage[];
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

