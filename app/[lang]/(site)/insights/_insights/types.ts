export type InsightCategorySlug = 'all' | 'article' | 'research' | string;

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface InsightAuthor {
  name: string;
  role: LocalizedString;
  avatar?: string;
}

export interface InsightTocItem {
  id: string;
  title: LocalizedString;
}

export interface InsightSection {
  id: string;
  heading: LocalizedString;
  paragraphs: {
    en: string[];
    ar: string[];
  };
  callout?: LocalizedString;
  list?: {
    en: string[];
    ar: string[];
  };
}

export interface InsightSectionVisibility {
  showBreadcrumbs: boolean;
  showCategoryBadge: boolean;
  showSubtitle: boolean;
  showDate: boolean;
  showReadTime: boolean;
  showShareMenu: boolean;
  showAuthorCard: boolean;
  showAuthorAvatar: boolean;
  showAuthorRole: boolean;
  showTableOfContents: boolean;
  showAiOverview: boolean;
  showCallouts: boolean;
  showBulletLists: boolean;
  showFeedbackWidget: boolean;
  showContactSection: boolean;
}

export interface InsightDetail {
  id: string;
  slug: string;
  originalSlug?: string;
  categorySlug: string;
  category: LocalizedString;
  title: LocalizedString;
  subtitle?: LocalizedString;
  excerpt: LocalizedString;
  readTime: string;
  date: string;
  author: InsightAuthor;
  tableOfContents: InsightTocItem[];
  sections: InsightSection[];
  coverImage?: string;
  featured?: boolean;
  isActive?: boolean;
  aiOverview?: {
    summary: LocalizedString;
    keyTakeaways: LocalizedString[];
  };
  sectionVisibility?: InsightSectionVisibility;
}

export interface InsightsHubCategoryFilter {
  slug: string;
  label: LocalizedString;
}

export interface InsightsHubPageData {
  hero: {
    enabled?: boolean;
    badge: LocalizedString;
    title: LocalizedString;
    titleHighlight: LocalizedString;
    description: LocalizedString;
    primaryCtaLabel: LocalizedString;
    primaryCtaHref: string;
    secondaryCtaLabel: LocalizedString;
    secondaryCtaHref: string;
    heroImage: string;
    heroImageAlt: LocalizedString;
  };
  exploreSection: {
    enabled?: boolean;
    badge: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    categories: InsightsHubCategoryFilter[];
    emptyTitle: LocalizedString;
    emptySubtitle: LocalizedString;
    loadMoreText: LocalizedString;
  };
  newsletterSection: {
    enabled?: boolean;
    badge: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    emailPlaceholder: LocalizedString;
    submitButtonText: LocalizedString;
    successMessage: LocalizedString;
    privacyDisclaimer: LocalizedString;
    image: string;
    imageAlt: LocalizedString;
  };
  contactSection: {
    enabled?: boolean;
  };
}

