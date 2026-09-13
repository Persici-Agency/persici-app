import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { IndustriesView, fetchIndustriesPageData } from './_industries';

export async function generateMetadata({ params }: PageProps<'/[lang]/industries'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const content = await fetchIndustriesPageData();
  const title = content.heroTitle[lang as 'en' | 'ar'] || content.heroTitle.en;
  const description = content.heroSubtitle[lang as 'en' | 'ar'] || content.heroSubtitle.en;

  return createMetadata({
    title,
    description,
    locale: lang as Locale,
    path: '/industries',
  });
}

export default async function IndustriesPage({ params }: PageProps<'/[lang]/industries'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const content = await fetchIndustriesPageData();

  return <IndustriesView content={content} lang={lang} dict={dict} />;
}

