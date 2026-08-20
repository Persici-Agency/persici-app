import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { ServicesView } from './_services';

export async function generateMetadata({ params }: PageProps<'/[lang]/services'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return createMetadata({
    title: dict.services.title,
    description: dict.services.description,
    locale: lang as Locale,
    path: '/services',
  });
}

export default async function ServicesPage({ params }: PageProps<'/[lang]/services'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <ServicesView lang={lang} dict={dict} />;
}
