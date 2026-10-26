import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { SolutionsView } from './_solutions';
import { fetchSolutionsPageData } from './_solutions/services';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps<'/[lang]/solutions'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const content = await fetchSolutionsPageData();
  const l = lang as 'en' | 'ar';
  const title =
    content.seo?.title?.[l] ||
    content.seo?.title?.en ||
    content.heroTitle[l] ||
    content.heroTitle.en;
  const description =
    content.seo?.description?.[l] ||
    content.seo?.description?.en ||
    content.heroSubtitle[l] ||
    content.heroSubtitle.en;

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
