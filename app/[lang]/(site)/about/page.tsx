import { getDictionary, hasLocale } from '../../dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '../../_lib/metadata';
import type { Locale } from '../../_lib/i18n';
import { AboutView } from './_about';

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return createMetadata({
    title: dict.about.title,
    description: dict.about.description,
    locale: lang as Locale,
    path: '/about',
  });
}

export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <AboutView lang={lang} dict={dict} />;
}
