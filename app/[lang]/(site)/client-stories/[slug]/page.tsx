import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@dictionaries';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import {
  getClientStoryDetailSpacingFromDb,
  getProjectBySlugFromDb,
  getRelatedProjectsFromDb,
} from '@/lib/projects-server';
import { ClientStoryDetailView } from './_client-story-detail/components/client-story-detail-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const story = await getProjectBySlugFromDb(slug);
  if (!story) notFound();

  const title = story.title[lang as 'en' | 'ar'] || story.title.en;
  const description =
    story.executiveSummary[lang as 'en' | 'ar'] || story.executiveSummary.en;

  return createMetadata({
    title,
    description,
    locale: lang as Locale,
    path: `/client-stories/${slug}`,
  });
}

export default async function ClientStoryDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const [story, spacingConfig] = await Promise.all([
    getProjectBySlugFromDb(slug),
    getClientStoryDetailSpacingFromDb(),
  ]);
  if (!story) notFound();

  const [dict, relatedStories] = await Promise.all([
    getDictionary(lang),
    getRelatedProjectsFromDb(slug, 3),
  ]);

  return (
    <ClientStoryDetailView
      story={story}
      relatedStories={relatedStories}
      lang={lang}
      dict={dict}
      spacingConfig={spacingConfig}
    />
  );
}
