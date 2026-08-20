export interface InsightArticle {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
}

export const insightsArticles: InsightArticle[] = [
  {
    slug: 'scaling-meta-ads-2026',
    title: 'The 2026 DTC Playbook: Scaling Meta Ads with Creative Velocity',
    category: 'Paid Media',
    readTime: '6 min read',
    date: 'August 2026',
    excerpt: 'How leading brands maintain 3x+ ROAS by running systematic weekly creative testing frameworks.',
  },
  {
    slug: 'shopify-headless-cro',
    title: 'Maximizing Conversion Rate: From Monolith to Headless Shopify',
    category: 'Engineering & CRO',
    readTime: '8 min read',
    date: 'July 2026',
    excerpt: 'Architectural lessons and sub-second page speed optimizations that doubled checkout conversions.',
  },
  {
    slug: 'first-party-data-retention',
    title: 'Unlocking LTV: First-Party Data & Retention Funnels',
    category: 'Retention',
    readTime: '5 min read',
    date: 'June 2026',
    excerpt: 'Transforming one-time shoppers into repeat brand advocates with automated lifecycle flows.',
  },
];

export function getInsightsArticles(): InsightArticle[] {
  return insightsArticles;
}
