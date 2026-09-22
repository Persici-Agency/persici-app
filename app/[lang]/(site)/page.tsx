import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@dictionaries';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { getHomePageData } from '@shared/services/db.service';
import { HomeView } from './_home';

export async function generateMetadata({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const [dict, content] = await Promise.all([
    getDictionary(lang),
    getHomePageData(),
  ]);
  const isAr = lang === 'ar';
  const hero = content?.hero;
  const title = (isAr ? hero?.title?.ar : hero?.title?.en) || dict.meta.title;
  const description = (isAr ? hero?.subtitle?.ar : hero?.subtitle?.en) || dict.meta.description;

  return createMetadata({
    title,
    description,
    locale: lang as Locale,
  });
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, content] = await Promise.all([
    getDictionary(lang),
    getHomePageData(),
  ]);

  return <HomeView lang={lang} dict={dict} content={content} />;
}
