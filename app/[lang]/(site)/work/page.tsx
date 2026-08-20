import { getDictionary, hasLocale } from '../../dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '../../_lib/metadata';
import type { Locale } from '../../_lib/i18n';
import { WorkView } from './_work';

export async function generateMetadata({ params }: PageProps<'/[lang]/work'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return createMetadata({
    title: dict.work.title,
    description: dict.work.description,
    locale: lang as Locale,
    path: '/work',
  });
}

export default async function WorkPage({ params }: PageProps<'/[lang]/work'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <WorkView lang={lang} dict={dict} />;
}
