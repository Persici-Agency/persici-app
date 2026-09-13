import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@dictionaries';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import {
  getAllClientStories,
  getClientStoryBySlug,
  getRelatedClientStories,
} from '../_client-stories/data/client-stories.data';
import { ClientStoryDetailView } from './_client-story-detail/components/client-story-detail-view';

type PageProps = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const stories = getAllClientStories();
  const locales = ['en', 'ar'];
  const params: { lang: string; slug: string }[] = [];

  for (const lang of locales) {
    for (const story of stories) {
      params.push({ lang, slug: story.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const story = getClientStoryBySlug(slug);
  if (!story) return {};

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

  const story = getClientStoryBySlug(slug);
  if (!story) notFound();

  const dict = await getDictionary(lang);
  const relatedStories = getRelatedClientStories(slug, 3);

  return (
    <ClientStoryDetailView
      story={story}
      relatedStories={relatedStories}
      lang={lang}
      dict={dict}
    />
  );
}
