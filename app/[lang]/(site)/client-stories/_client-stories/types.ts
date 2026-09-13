import type { LocalizedString } from '@shared/types';

export type StoryTemplateType =
  | 'marketing-video-showcase'
  | 'image-gallery-showcase'
  | 'software-web-app-showcase';

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
}

export interface StoryTechBadge {
  name: string;
  category?: 'frontend' | 'backend' | 'database' | 'cloud' | 'tool' | 'design';
}

export interface StoryNarrativeSection {
  id: string;
  title: LocalizedString;
  paragraphs: LocalizedString[];
  bullets?: LocalizedString[];
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
}
