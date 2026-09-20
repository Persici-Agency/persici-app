import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { getHowWeDoItPageData } from '@shared/services/db.service';
import { HowWeDoItHubView } from './_components/how-we-do-it-hub-view';

export async function generateMetadata({ params }: PageProps<'/[lang]/how-we-do-it'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const isAr = lang === 'ar';

  return createMetadata({
    title: `${dict.nav.howWeDoIt} — Persici Agency`,
    description: isAr
      ? 'منهجية بيرسيشي لتنفيذ التحول الرقمي وتسريع النمو المؤسسي: ركائز الاستراتيجية، والمنتج، والتجربة، والهندسة، والبيانات والذكاء الاصطناعي.'
      : 'Persici delivery framework, agile engineering velocity, living products, and end-to-end digital transformation methodology.',
    locale: lang as Locale,
    path: '/how-we-do-it',
  });
}

export default async function HowWeDoItPage({ params }: PageProps<'/[lang]/how-we-do-it'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const content = await getHowWeDoItPageData();

  return <HowWeDoItHubView content={content} lang={lang} dict={dict} />;
}
