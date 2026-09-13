import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { getAllClientStories } from './_client-stories/data/client-stories.data';
import { ClientStoriesHubView } from './_client-stories/components/client-stories-hub-view';

export async function generateMetadata({ params }: PageProps<'/[lang]/client-stories'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const isRtl = lang === 'ar';

  return createMetadata({
    title: isRtl
      ? 'قصص نجاح العملاء والأعمال التحولية | وكالة بيرسيكي'
      : 'Client Stories & Transformative Case Studies | Persici Agency',
    description: isRtl
      ? 'اكتشف كيف تشارك بيرسيكي المؤسسات الطموحة في دول الخليج والعالم لهندسة علامات استثنائية، وبناء منصات برمجية متطورة، وتحقيق قفزات نوعية في النمو والإيرادات.'
      : 'Explore how Persici partners with visionary enterprises across the GCC and globally to engineer transformative digital products, iconic brands, and high-impact growth engines.',
    locale: lang as Locale,
    path: '/client-stories',
  });
}

export default async function ClientStoriesPage({ params }: PageProps<'/[lang]/client-stories'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const stories = getAllClientStories();

  return <ClientStoriesHubView stories={stories} lang={lang} dict={dict} />;
}
