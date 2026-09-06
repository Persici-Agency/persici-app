import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { locales } from '@lib/i18n';
import { solutionsOfferingsList } from '@shared/data';
import { fetchSolutionBySlug } from '../_solutions';
import { SolutionDetailView } from './_solution-detail';

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    for (const item of solutionsOfferingsList) {
      params.push({ lang, slug: item.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/solutions/[slug]'>) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const solution = await fetchSolutionBySlug(slug);
  if (!solution) return {};

  const title = solution.title[lang as 'en' | 'ar'] || solution.title.en;
  const description = solution.description[lang as 'en' | 'ar'] || solution.description.en;

  return createMetadata({
    title: `${title} — Persici Solutions`,
    description,
    locale: lang as Locale,
    path: `/solutions/${slug}`,
  });
}

export default async function SolutionDetailPage({
  params,
}: PageProps<'/[lang]/solutions/[slug]'>) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const solution = await fetchSolutionBySlug(slug);
  if (!solution) notFound();

  const dict = await getDictionary(lang);

  return <SolutionDetailView solution={solution} lang={lang} dict={dict} />;
}
