import { notFound } from 'next/navigation';
import { hasLocale } from '@dictionaries';
import { createMetadata } from '../../../_lib/metadata';
import type { Locale } from '../../../_lib/i18n';
import { fetchProjectsList } from '../_work/services';
import { getProjectBySlugFromDb } from '@/lib/projects-server';
import { WorkDetailView } from './_work-detail';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function findWorkProject(slug: string) {
  const [projects, story] = await Promise.all([
    fetchProjectsList(),
    getProjectBySlugFromDb(slug),
  ]);
  const matchedProject = projects.find((p) => p.slug === slug);
  return matchedProject || story || null;
}

export async function generateMetadata({ params }: PageProps<'/[lang]/work/[slug]'>) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const project = await findWorkProject(slug);
  if (!project) notFound();

  return createMetadata({
    title: `Work — ${slug}`,
    locale: lang as Locale,
    path: `/work/${slug}`,
  });
}

export default async function WorkDetailPage({ params }: PageProps<'/[lang]/work/[slug]'>) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const project = await findWorkProject(slug);
  if (!project) notFound();

  return <WorkDetailView slug={slug} lang={lang} />;
}
