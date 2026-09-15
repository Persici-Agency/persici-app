import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { getAllInsights, InsightsHubView } from './_insights';

export async function generateMetadata({ params }: PageProps<'/[lang]/insights'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const isRtl = lang === 'ar';

  return createMetadata({
    title: isRtl
      ? 'الرؤى والقيادة الفكرية والأبحاث الاستراتيجية | وكالة بيرسيكي'
      : 'Insights & Thought Leadership | Persici Agency',
    description: isRtl
      ? 'استكشف أحدث الأبحاث والدراسات الميدانية، والمقالات المعرفية الموجهة لقادة التحول الرقمي ورواد الأعمال في الخليج والعالم.'
      : 'Explore transformative thought leadership, empirical enterprise research, and strategic digital transformation playbooks from Persici.',
    locale: lang as Locale,
    path: '/insights',
  });
}

export default async function InsightsPage({ params }: PageProps<'/[lang]/insights'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const insights = getAllInsights();

  return <InsightsHubView insights={insights} lang={lang} dict={dict} />;
}
