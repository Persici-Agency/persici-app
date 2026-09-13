import type { MetadataRoute } from 'next';

const baseUrl = 'https://persici.com';
const locales = ['en', 'ar'];

const staticRoutes = [
  '',
  '/about',
  '/solutions',
  '/industries',
  '/client-stories',
  '/work',
  '/insights',
  '/careers',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            ar: `${baseUrl}/ar${route}`,
          },
        },
      });
    }
  }

  return entries;
}
