import { createMetadata } from '../../../_lib/metadata';
import type { Locale } from '../../../_lib/i18n';
import { CareerDetailView } from './_career-detail';

export async function generateMetadata({ params }: PageProps<'/[lang]/careers/[slug]'>) {
  const { lang, slug } = await params;
  return createMetadata({
    title: `Career — ${slug}`,
    locale: lang as Locale,
    path: `/careers/${slug}`,
  });
}

export default async function CareerDetailPage({ params }: PageProps<'/[lang]/careers/[slug]'>) {
  const { slug } = await params;

  return <CareerDetailView slug={slug} />;
}
