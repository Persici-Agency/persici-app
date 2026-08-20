import { getDictionary, hasLocale } from '../../dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '../../_lib/metadata';
import type { Locale } from '../../_lib/i18n';
import { InsightsView } from './_insights';

export async function generateMetadata({ params }: PageProps<'/[lang]/insights'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return createMetadata({
    title: dict.insights.title,
    description: dict.insights.description,
    locale: lang as Locale,
    path: '/insights',
  });
}

export default async function InsightsPage({ params }: PageProps<'/[lang]/insights'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <InsightsView lang={lang} dict={dict} />;
}
