import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { ServicesView } from '../services/_services';

export async function generateMetadata({ params }: PageProps<'/[lang]/how-we-do-it'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return createMetadata({
    title: dict.nav.howWeDoIt,
    description: dict.services.description,
    locale: lang as Locale,
    path: '/how-we-do-it',
  });
}

export default async function HowWeDoItPage({ params }: PageProps<'/[lang]/how-we-do-it'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <ServicesView lang={lang} dict={dict} />;
}
