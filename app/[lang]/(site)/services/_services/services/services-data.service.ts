export interface ServiceItem {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
}

export const servicesList: ServiceItem[] = [
  {
    slug: 'paid-social',
    titleKey: 'Paid Social & Performance Marketing',
    descriptionKey: 'Data-backed acquisition campaigns across Meta, TikTok, and emerging channels.',
    icon: '📱',
  },
  {
    slug: 'google-ads',
    titleKey: 'Google Ads & Search',
    descriptionKey: 'High-intent Search, Shopping, Performance Max, and YouTube campaigns.',
    icon: '🔍',
  },
  {
    slug: 'shopify-cro',
    titleKey: 'Shopify Plus & CRO',
    descriptionKey: 'High-converting headless storefronts and continuous A/B conversion rate optimization.',
    icon: '🛍️',
  },
  {
    slug: 'strategy',
    titleKey: 'Growth Strategy & Data Intelligence',
    descriptionKey: 'Unit economics modeling, retention loops, and server-side tracking infrastructure.',
    icon: '📊',
  },
];

export function getServicesList(): ServiceItem[] {
  return servicesList;
}
