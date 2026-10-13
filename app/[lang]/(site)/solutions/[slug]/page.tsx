import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { locales } from '@lib/i18n';
import { solutionsOfferingsList } from '@shared/data';
import { fetchSolutionBySlug, fetchSolutionFeaturePageData } from '../_solutions/services';
import { isSolutionPageSlug } from '../_solutions/data/solutions-cms.data';
import { SolutionDetailView } from './_solution-detail';
import { ApplicationManagementView } from './_application-management';
import { MarketingCommunicationsView } from './_marketing-communications';
import { EcommerceGrowthView } from './_ecommerce-growth';
import { AiIntegrationView } from './_ai-integration';
import { UxProductDesignView } from './_ux-product-design';
import { CustomerEngagementView } from './_customer-engagement';
import { DigitalEngineeringView } from './_digital-engineering';
import { SupplyChainView } from './_supply-chain';
import { CrmManagementView } from './_crm-management';

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    for (const item of solutionsOfferingsList) {
      params.push({ lang, slug: item.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/solutions/[slug]'>) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  if (isSolutionPageSlug(slug)) {
    const pageData = await fetchSolutionFeaturePageData(slug);
    const l = lang as 'en' | 'ar';
    const rawTitle =
      pageData.seo?.title?.[l] ||
      pageData.seo?.title?.en ||
      pageData.hero.title[l] ||
      pageData.hero.title.en;
    const description =
      pageData.seo?.description?.[l] ||
      pageData.seo?.description?.en ||
      pageData.hero.subtitle[l] ||
      pageData.hero.subtitle.en;
    const title = rawTitle.includes('Persici')
      ? rawTitle
      : `${rawTitle} — Persici Solutions`;

    return createMetadata({
      title,
      description,
      locale: lang as Locale,
      path: `/solutions/${slug}`,
    });
  }

  const solution = await fetchSolutionBySlug(slug);
  if (!solution) return {};

  const title = solution.title[lang as 'en' | 'ar'] || solution.title.en;
  const description = solution.description[lang as 'en' | 'ar'] || solution.description.en;

  return createMetadata({
    title: `${title} — Persici Solutions`,
    description,
    locale: lang as Locale,
    path: `/solutions/${slug}`,
  });
}

export default async function SolutionDetailPage({
  params,
}: PageProps<'/[lang]/solutions/[slug]'>) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  if (slug === 'application-management') {
    const data = await fetchSolutionFeaturePageData(slug);
    return <ApplicationManagementView lang={lang} dict={dict} data={data} />;
  }

  if (slug === 'marketing-communications') {
    const data = await fetchSolutionFeaturePageData(slug);
    return <MarketingCommunicationsView lang={lang} dict={dict} data={data} />;
  }

  if (slug === 'ecommerce-growth') {
    const data = await fetchSolutionFeaturePageData(slug);
    return <EcommerceGrowthView lang={lang} dict={dict} data={data} />;
  }

  if (slug === 'ai-integration') {
    const data = await fetchSolutionFeaturePageData(slug);
    return <AiIntegrationView lang={lang} dict={dict} data={data} />;
  }

  if (slug === 'ux-and-product-design') {
    const data = await fetchSolutionFeaturePageData(slug);
    return <UxProductDesignView lang={lang} dict={dict} data={data} />;
  }

  if (slug === 'customer-engagement') {
    const data = await fetchSolutionFeaturePageData(slug);
    return <CustomerEngagementView lang={lang} dict={dict} data={data} />;
  }

  if (slug === 'digital-engineering') {
    const data = await fetchSolutionFeaturePageData(slug);
    return <DigitalEngineeringView lang={lang} dict={dict} data={data} />;
  }

  if (slug === 'supply-chain') {
    const data = await fetchSolutionFeaturePageData(slug);
    return <SupplyChainView lang={lang} dict={dict} data={data} />;
  }

  if (slug === 'crm-management') {
    const data = await fetchSolutionFeaturePageData(slug);
    return <CrmManagementView lang={lang} dict={dict} data={data} />;
  }

  const solution = await fetchSolutionBySlug(slug);
  if (!solution) notFound();

  return <SolutionDetailView solution={solution} lang={lang} dict={dict} />;
}
