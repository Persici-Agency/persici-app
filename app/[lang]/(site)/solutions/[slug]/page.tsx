import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { locales } from '@lib/i18n';
import { solutionsOfferingsList } from '@shared/data';
import { fetchSolutionBySlug } from '../_solutions';
import { SolutionDetailView } from './_solution-detail';
import { ApplicationManagementView } from './_application-management';
import { MarketingCommunicationsView } from './_marketing-communications';
import { EcommerceGrowthView } from './_ecommerce-growth';

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

  if (slug === 'application-management') {
    const isAr = lang === 'ar';
    const title = isAr ? 'التطبيقات والإدارة' : 'Application & Management';
    const description = isAr
      ? 'خدمات تطوير وإدارة دورة حياة التطبيقات المؤسسية لمنصات iOS و Android والهجينة بواسطة فريق بيرسيكي.'
      : 'End-to-end enterprise mobile application development, modern cross-platform engineering, and lifecycle management by Persici.';
    return createMetadata({
      title: `${title} — Persici Solutions`,
      description,
      locale: lang as Locale,
      path: `/solutions/${slug}`,
    });
  }

  if (slug === 'marketing-communications') {
    const isAr = lang === 'ar';
    const title = isAr ? 'التسويق والاتصال المؤسسي' : 'Marketing & Communications';
    const description = isAr
      ? 'استراتيجيات تسويق واتصال مؤسسي متكاملة، وسرد إبداعي، وإدارة حملات موجهة بالأداء والبيانات بواسطة بيرسيكي.'
      : 'Integrated full-funnel marketing, brand communications, creative storytelling, and data-driven media buying by Persici.';
    return createMetadata({
      title: `${title} — Persici Solutions`,
      description,
      locale: lang as Locale,
      path: `/solutions/${slug}`,
    });
  }

  if (slug === 'ecommerce-growth') {
    const isAr = lang === 'ar';
    const title = isAr ? 'النمو في التجارة الإلكترونية' : 'E-Commerce Growth';
    const description = isAr
      ? 'منظومات تجارة رقمية قابلة للتوسع، وهندسة متاجر فائقة السرعة والتحويل، وإعلانات أداء واستبقاء العملاء بواسطة بيرسيكي.'
      : 'Scalable digital commerce ecosystems, high-converting storefront architecture, full-funnel media acquisition, and compounding retention by Persici.';
    return createMetadata({
      title: `${title} — Persici Solutions`,
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
    return <ApplicationManagementView lang={lang} dict={dict} />;
  }

  if (slug === 'marketing-communications') {
    return <MarketingCommunicationsView lang={lang} dict={dict} />;
  }

  if (slug === 'ecommerce-growth') {
    return <EcommerceGrowthView lang={lang} dict={dict} />;
  }

  const solution = await fetchSolutionBySlug(slug);
  if (!solution) notFound();

  return <SolutionDetailView solution={solution} lang={lang} dict={dict} />;
}
