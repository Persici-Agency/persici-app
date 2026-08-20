import { getDictionary, hasLocale } from '../../dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '../../_lib/metadata';
import type { Locale } from '../../_lib/i18n';
import { CareersView } from './_careers';

export async function generateMetadata({ params }: PageProps<'/[lang]/careers'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return createMetadata({
    title: dict.careers.title,
    description: dict.careers.description,
    locale: lang as Locale,
    path: '/careers',
  });
}

export default async function CareersPage({ params }: PageProps<'/[lang]/careers'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <CareersView lang={lang} dict={dict} />;
}
