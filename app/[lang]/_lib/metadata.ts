import type { Metadata } from 'next';
import type { Locale } from './i18n';

const siteConfig = {
  name: 'Persici',
  url: 'https://persici.com',
  description: {
    en: 'Persici is a digital agency specializing in strategy, design, engineering, and digital transformation.',
    ar: 'بيرسيكي هي وكالة رقمية متخصصة في الاستراتيجية والتصميم والهندسة والتحول الرقمي.',
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
  const pageTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.name;
  const pageDescription =
    description || siteConfig.description[locale];
  const url = `${siteConfig.url}/${locale}${path}`;

  return {
    title: pageTitle,
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
      siteName: siteConfig.name,
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
