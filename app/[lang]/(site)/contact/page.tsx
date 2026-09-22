import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { getContactPageData } from '@shared/services/db.service';
import { ContactView } from './_contact';

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const [dict, content] = await Promise.all([
    getDictionary(lang),
    getContactPageData(),
  ]);
  const isAr = lang === 'ar';
  const title = content?.hero?.title?.[isAr ? 'ar' : 'en'] || dict.contact.title;
  const description = content?.hero?.subtitle?.[isAr ? 'ar' : 'en'] || dict.contact.description;

  return createMetadata({
    title,
    description,
    locale: lang as Locale,
    path: '/contact',
  });
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, content] = await Promise.all([
    getDictionary(lang),
    getContactPageData(),
  ]);

  return <ContactView lang={lang} dict={dict} content={content} />;
}
