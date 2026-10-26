import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { getAllProjectsFromDb } from '@/lib/projects-server';
import { getClientStoriesPageData } from '@shared/services/db.service';
import { ClientStoriesHubView } from './_client-stories/components/client-stories-hub-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps<'/[lang]/client-stories'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const isRtl = lang === 'ar';

  return createMetadata({
    title: isRtl
      ? 'قصص نجاح العملاء والأعمال التحولية | وكالة بيرسيشي'
      : 'Client Stories & Transformative Case Studies | Persici Agency',
    description: isRtl
      ? 'اكتشف كيف تشارك بيرسيشي المؤسسات الطموحة في دول الخليج والعالم لهندسة علامات استثنائية، وبناء منصات برمجية متطورة، وتحقيق قفزات نوعية في النمو والإيرادات.'
      : 'Explore how Persici partners with visionary enterprises across the GCC and globally to engineer transformative digital products, iconic brands, and high-impact growth engines.',
    locale: lang as Locale,
    path: '/client-stories',
  });
}

export default async function ClientStoriesPage({ params }: PageProps<'/[lang]/client-stories'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, stories, pageContent] = await Promise.all([
    getDictionary(lang),
    getAllProjectsFromDb(),
    getClientStoriesPageData(),
  ]);

  return (
    <ClientStoriesHubView
      stories={stories}
      pageContent={pageContent}
      lang={lang}
      dict={dict}
    />
  );
}

