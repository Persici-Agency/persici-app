import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { WorkView } from '../work/_work';

export async function generateMetadata({ params }: PageProps<'/[lang]/client-stories'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return createMetadata({
    title: dict.nav.clientStories || dict.work.title,
    description: dict.work.description,
    locale: lang as Locale,
    path: '/client-stories',
  });
}

export default async function ClientStoriesPage({ params }: PageProps<'/[lang]/client-stories'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <WorkView lang={lang} dict={dict} />;
}
