import { getDictionary, hasLocale } from '../../dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '../../_lib/metadata';
import type { Locale } from '../../_lib/i18n';
import { ContactView } from './_contact';

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return createMetadata({
    title: dict.contact.title,
    description: dict.contact.description,
    locale: lang as Locale,
    path: '/contact',
  });
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <ContactView lang={lang} dict={dict} />;
}
