import { createMetadata } from '../../../_lib/metadata';
import type { Locale } from '../../../_lib/i18n';
import { InsightDetailView } from './_insight-detail';

export async function generateMetadata({ params }: PageProps<'/[lang]/insights/[slug]'>) {
  const { lang, slug } = await params;
  return createMetadata({
    title: `Insight — ${slug}`,
    locale: lang as Locale,
    path: `/insights/${slug}`,
  });
}

export default async function InsightDetailPage({ params }: PageProps<'/[lang]/insights/[slug]'>) {
  const { slug } = await params;

  return <InsightDetailView slug={slug} />;
}
