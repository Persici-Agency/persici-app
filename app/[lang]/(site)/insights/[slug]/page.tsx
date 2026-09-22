import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@dictionaries';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { getAllInsights } from '../_insights/data/insights.data';
import { getInsightBySlugFromDb } from '@/lib/insights-server';
import { InsightDetailView } from './_insight-detail';

type PageProps = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const insights = getAllInsights();
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
  const description = insight.excerpt[lang as 'en' | 'ar'] || insight.excerpt.en;

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

  const insight = await getInsightBySlugFromDb(slug);
  if (!insight) notFound();

  const dict = await getDictionary(lang);

  return (
    <InsightDetailView
      insight={insight}
      lang={lang}
      dict={dict}
    />
  );
}
