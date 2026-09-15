import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { getAboutPageData } from '@shared/services/db.service';
import { AboutView } from './_about';

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const content = await getAboutPageData();
  const isArabic = lang === 'ar';
  const title = content.hero.title[lang as 'en' | 'ar'] || content.hero.title.en;
  const description = content.hero.subtitle[lang as 'en' | 'ar'] || content.hero.subtitle.en;

  return createMetadata({
    title: isArabic ? `${title} | وكالة بيرسيكي` : `${title} | Persici Agency`,
    description,
    locale: lang as Locale,
    path: '/about',
  });
}

export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const [dict, content] = await Promise.all([
    getDictionary(lang),
    getAboutPageData(),
  ]);

  return <AboutView content={content} lang={lang} dict={dict} />;
}
