import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { ServicesView } from '../services/_services';

export async function generateMetadata({ params }: PageProps<'/[lang]/solutions'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return createMetadata({
    title: dict.nav.solutions || dict.services.title,
    description: dict.services.description,
    locale: lang as Locale,
    path: '/solutions',
  });
}

export default async function SolutionsPage({ params }: PageProps<'/[lang]/solutions'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <ServicesView lang={lang} dict={dict} />;
}
