import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { locales } from '@lib/i18n';
import { industriesOfferingsList } from '@shared/data';
import { fetchIndustryBySlug, fetchIndustryFeaturePageData } from '../_industries';
import { extractIndustryFeatureSlug } from '../_industries/data/industries-cms.data';
import { IndustryDetailView } from './_industry-detail';
import { ConsumerProductsView } from './_consumer-products';
import { TelecomMediaTechnologyView } from './_telecom-media-technology';
import { PublicSectorView } from './_public-sector';
import { RetailView } from './_retail';
import { HealthView } from './_health';
import { EnergyCommoditiesView } from './_energy-commodities';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    for (const item of industriesOfferingsList) {
      params.push({ lang, slug: item.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  if (extractIndustryFeatureSlug(slug)) {
    const pageData = await fetchIndustryFeaturePageData(slug);
    const isAr = lang === 'ar';
    const title = pageData.seo?.title?.[isAr ? 'ar' : 'en'] || `${slug} — Persici Industries`;
    const description = pageData.seo?.description?.[isAr ? 'ar' : 'en'] || '';
    return createMetadata({
      title,
      description,
      locale: lang as Locale,
      path: `/industries/${slug}`,
    });
  }

  const industry = await fetchIndustryBySlug(slug);
  if (!industry) return {};

  const title = industry.title[lang as 'en' | 'ar'] || industry.title.en;
  const description = industry.description[lang as 'en' | 'ar'] || industry.description.en;

  return createMetadata({
    title: `${title} — Persici Industries`,
    description,
    locale: lang as Locale,
    path: `/industries/${slug}`,
  });
}

export default async function IndustryDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  if (slug === 'consumer-products') {
    const pageData = await fetchIndustryFeaturePageData(slug);
    return <ConsumerProductsView data={pageData} lang={lang} dict={dict} />;
  }

  if (slug === 'telecom-media-technology') {
    const pageData = await fetchIndustryFeaturePageData(slug);
    return <TelecomMediaTechnologyView data={pageData} lang={lang} dict={dict} />;
  }

  if (slug === 'public-sector') {
    const pageData = await fetchIndustryFeaturePageData(slug);
    return <PublicSectorView data={pageData} lang={lang} dict={dict} />;
  }

  if (slug === 'retail') {
    const pageData = await fetchIndustryFeaturePageData(slug);
    return <RetailView data={pageData} lang={lang} dict={dict} />;
  }

  if (slug === 'health') {
    const pageData = await fetchIndustryFeaturePageData(slug);
    return <HealthView data={pageData} lang={lang} dict={dict} />;
  }

  if (slug === 'energy-commodities') {
    const pageData = await fetchIndustryFeaturePageData(slug);
    return <EnergyCommoditiesView data={pageData} lang={lang} dict={dict} />;
  }

  const industry = await fetchIndustryBySlug(slug);
  if (!industry) notFound();

  return <IndustryDetailView industry={industry} lang={lang} dict={dict} />;
}
