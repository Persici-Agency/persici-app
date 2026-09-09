import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { SolutionsView, fetchSolutionsPageData } from './_solutions';

export async function generateMetadata({ params }: PageProps<'/[lang]/solutions'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const content = await fetchSolutionsPageData();
  const title = content.heroTitle[lang as 'en' | 'ar'] || content.heroTitle.en;
  const description = content.heroSubtitle[lang as 'en' | 'ar'] || content.heroSubtitle.en;

  return createMetadata({
    title,
    description,
    locale: lang as Locale,
    path: '/solutions',
  });
}

export default async function SolutionsPage({ params }: PageProps<'/[lang]/solutions'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const content = await fetchSolutionsPageData();

  return <SolutionsView content={content} lang={lang} dict={dict} />;
}
