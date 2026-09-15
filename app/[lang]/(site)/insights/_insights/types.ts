export type InsightCategorySlug = 'all' | 'article' | 'research';

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

export interface InsightDetail {
  id: string;
  slug: string;
  categorySlug: 'article' | 'research';
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
  aiOverview?: {
    summary: LocalizedString;
    keyTakeaways: LocalizedString[];
  };
}
