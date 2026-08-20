import { createMetadata } from '../../../_lib/metadata';
import type { Locale } from '../../../_lib/i18n';
import { ServiceDetailView } from './_service-detail';

export async function generateMetadata({ params }: PageProps<'/[lang]/services/[slug]'>) {
  const { lang, slug } = await params;
  return createMetadata({
    title: `Service — ${slug}`,
    locale: lang as Locale,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: PageProps<'/[lang]/services/[slug]'>) {
  const { lang, slug } = await params;

  return <ServiceDetailView slug={slug} lang={lang} />;
}
