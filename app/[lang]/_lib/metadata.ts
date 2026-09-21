import type { Metadata } from 'next';
import type { Locale } from './i18n';

const siteConfig = {
  name: {
    en: 'Persici',
    ar: 'بيرسيشي',
  },
  url: 'https://persici.com',
  defaultTitle: {
    en: 'Persici - Specialized in AI and Digital Transformation',
    ar: 'بيرسيشي - متخصصة في الذكاء الاصطناعي والتحول الرقمي',
  },
  description: {
    en: 'Persici is a boutique studio specialized in AI and digital transformation.',
    ar: 'بيرسيشي هو استوديو بوتيك متخصص في الذكاء الاصطناعي والتحول الرقمي.',
  },
};

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  locale: Locale;
  path?: string;
  noIndex?: boolean;
};

export function createMetadata({
  title,
  description,
  locale,
  path = '',
  noIndex = false,
}: CreateMetadataOptions): Metadata {
  const brandName = siteConfig.name[locale] || siteConfig.name.en;
  const isHome = !path || path === '' || path === '/';

  let pageTitle: string;
  if (isHome) {
    pageTitle = title || siteConfig.defaultTitle[locale];
  } else if (title) {
    // If title already includes brand name, don't duplicate it
    if (
      title.includes(brandName) ||
      title.includes('Persici') ||
      title.includes('بيرسيشي') ||
      title.includes('بيرسيشي')
    ) {
      pageTitle = title;
    } else {
      pageTitle = `${title} | ${brandName}`;
    }
  } else {
    pageTitle = siteConfig.defaultTitle[locale];
  }

  const pageDescription =
    description || siteConfig.description[locale];
  const url = `${siteConfig.url}/${locale}${path}`;

  return {
    title: {
      absolute: pageTitle,
    },
    description: pageDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en${path}`,
        ar: `${siteConfig.url}/ar${path}`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: brandName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export { siteConfig };
