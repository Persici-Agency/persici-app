import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@dictionaries';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { getAllInsightsFromDb, getInsightBySlugFromDb } from '@/lib/insights-server';
import { getSharedContactData } from '@shared/services/db.service';
import { InsightDetailView } from './_insight-detail';

type PageProps = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const insights = await getAllInsightsFromDb(true);
  const locales = ['en', 'ar'];
  const params: { lang: string; slug: string }[] = [];

  for (const lang of locales) {
    for (const insight of insights) {
      params.push({ lang, slug: insight.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const insight = await getInsightBySlugFromDb(slug);
  if (!insight) return {};

  const title = insight.title[lang as 'en' | 'ar'] || insight.title.en;
  const rawDescription = insight.excerpt[lang as 'en' | 'ar'] || insight.excerpt.en || '';
  const description = rawDescription.replace(/<[^>]*>/g, '');

  return createMetadata({
    title,
    description,
    locale: lang as Locale,
    path: `/insights/${slug}`,
  });
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const [insight, dict, sharedContact] = await Promise.all([
    getInsightBySlugFromDb(slug),
    getDictionary(lang),
    getSharedContactData(),
  ]);
  if (!insight) notFound();

  return (
    <InsightDetailView
      insight={insight}
      lang={lang}
      dict={dict}
      sharedContact={sharedContact}
    />
  );
}

