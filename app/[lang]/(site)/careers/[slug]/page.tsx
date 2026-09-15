import { notFound } from 'next/navigation';
import { hasLocale } from '@dictionaries';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { getCareerBySlug, getRelatedCareers } from '../_careers/data/careers.data';
import { CareerDetailView } from './_career-detail';

export async function generateMetadata({ params }: PageProps<'/[lang]/careers/[slug]'>) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const job = getCareerBySlug(slug);
  if (!job) return {};

  const isAr = lang === 'ar';

  return createMetadata({
    title: isAr
      ? `${job.title.ar} — وظائف وكالة برسيسي`
      : `${job.title.en} — Persici Careers`,
    description: job.summary[isAr ? 'ar' : 'en'],
    locale: lang as Locale,
    path: `/careers/${slug}`,
  });
}

export default async function CareerDetailPage({ params }: PageProps<'/[lang]/careers/[slug]'>) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const job = getCareerBySlug(slug);
  if (!job) {
    notFound();
  }

  const relatedJobs = getRelatedCareers(slug, 2);

  return <CareerDetailView job={job} relatedJobs={relatedJobs} lang={lang} />;
}
