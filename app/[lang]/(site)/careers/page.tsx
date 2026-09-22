import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { getAllCareersFromDb } from '@/lib/careers-server';
import { CareersView } from './_careers';

export async function generateMetadata({ params }: PageProps<'/[lang]/careers'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const isAr = lang === 'ar';

  return createMetadata({
    title: isAr
      ? 'الوظائف وثقافة العمل — وكالة برسيسي'
      : 'Careers & Culture — Persici Agency',
    description: isAr
      ? 'انضم إلى نخبة المهندسين ومبتكري النمو وصناع الهويات في برسيسي. استكشف الوظائف الشاغرة في دبي، الرياض، عمّان وعن بُعد.'
      : 'Join our high-velocity collective of engineers, growth tacticians, and brand visionaries. Explore active openings across Dubai HQ, Riyadh, Amman, and remote.',
    locale: lang as Locale,
    path: '/careers',
  });
}

export default async function CareersPage({ params }: PageProps<'/[lang]/careers'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const openings = await getAllCareersFromDb(true);

  return <CareersView lang={lang} dict={dict} initialOpenings={openings} />;
}
