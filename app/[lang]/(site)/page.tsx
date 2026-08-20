import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@dictionaries';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { HomeView } from './_home';

export async function generateMetadata({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return createMetadata({
    title: dict.meta.title,
    description: dict.meta.description,
    locale: lang as Locale,
  });
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <HomeView lang={lang} dict={dict} />;
}
