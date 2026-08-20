export interface ProjectItem {
  slug: string;
  title: string;
  category: string;
  result: string;
  description: string;
  image: string;
}

export const projectsList: ProjectItem[] = [
  {
    slug: 'nordic-living',
    title: 'Nordic Living',
    category: 'Home & Living • Scale',
    result: '+210% International Revenue',
    description: 'Full-funnel Meta & Google Ads restructuring combined with custom headless checkout.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'lumina-beauty',
    title: 'Lumina Beauty',
    category: 'Cosmetics • D2C',
    result: '+140% 90-Day Surge',
    description: 'High-velocity TikTok creative pipeline and custom Shopify Plus performance optimization.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'urban-pulse',
    title: 'Urban Pulse',
    category: 'Apparel & Streetwear',
    result: '-42% CAC at 3x Spend',
    description: 'Granular audience segmentation and dynamic product catalog advertising.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'atelier-chic',
    title: 'Atelier Chic',
    category: 'Luxury Fashion',
    result: '2.8x ROAS Sustained',
    description: 'High-intent search capture and premium creative storytelling campaigns.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
];

export function getProjectsList(): ProjectItem[] {
  return projectsList;
}
