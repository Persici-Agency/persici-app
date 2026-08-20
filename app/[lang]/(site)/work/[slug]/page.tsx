import { createMetadata } from '../../../_lib/metadata';
import type { Locale } from '../../../_lib/i18n';
import { WorkDetailView } from './_work-detail';

export async function generateMetadata({ params }: PageProps<'/[lang]/work/[slug]'>) {
  const { lang, slug } = await params;
  return createMetadata({
    title: `Work — ${slug}`,
    locale: lang as Locale,
    path: `/work/${slug}`,
  });
}

export default async function WorkDetailPage({ params }: PageProps<'/[lang]/work/[slug]'>) {
  const { lang, slug } = await params;

  return <WorkDetailView slug={slug} lang={lang} />;
}
