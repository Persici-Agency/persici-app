import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { locales } from '@lib/i18n';
import { industriesOfferingsList } from '@shared/data';
import { fetchIndustryBySlug } from '../_industries';
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

  const isAr = lang === 'ar';

  if (slug === 'consumer-products') {
    const title = isAr ? 'المنتجات الاستهلاكية' : 'Consumer Products';
    const description = isAr
      ? 'تجاوز تطلعات المستهلكين من خلال تجارب التجارة المباشرة (D2C)، وسلاسل الإمداد المرنة، وذكاء البيانات السيادية بواسطة بيرسيكي.'
      : 'Exceed evolving customer expectations through seamless D2C experiences, agile supply chains, and sovereign data intelligence by Persici.';
    return createMetadata({
      title: `${title} — Persici Industries`,
      description,
      locale: lang as Locale,
      path: `/industries/${slug}`,
    });
  }

  if (slug === 'telecom-media-technology') {
    const title = isAr ? 'الاتصالات والإعلام والتقنية' : 'Telecommunications, Media & Technology';
    const description = isAr
      ? 'إعادة ابتكار مشغلي الاتصالات ومنصات الإعلام بواجهات 5G البرمجية، وبث الوسائط فائق السرعة، والحد من مغادرة المشتركين بواسطة بيرسيكي.'
      : 'Reinventing telecom carriers and media platforms with 5G programmable APIs, low-latency streaming, and AI churn prevention by Persici.';
    return createMetadata({
      title: `${title} — Persici Industries`,
      description,
      locale: lang as Locale,
      path: `/industries/${slug}`,
    });
  }

  if (slug === 'public-sector') {
    const title = isAr ? 'القطاع الحكومي والمؤسسات العامة' : 'Public Sector & Government';
    const description = isAr
      ? 'منصات حكومية رقمية متمحورة حول المواطن، وشبكات تكامل البيانات بين الجهات، وبنية تحتية سحابية سيادية محكمة بواسطة بيرسيكي.'
      : 'Human-centered digital civic platforms, inter-agency data meshes, and sovereign cloud infrastructure for public entities by Persici.';
    return createMetadata({
      title: `${title} — Persici Industries`,
      description,
      locale: lang as Locale,
      path: `/industries/${slug}`,
    });
  }

  if (slug === 'retail') {
    const title = isAr ? 'تجارة التجزئة والتجارة الموحدة' : 'Retail & Unified Commerce';
    const description = isAr
      ? 'ربط المتاجر الفعلية، والتجارة الإلكترونية بدون رأس، وإدارة الطلبات الموزعة في منظومة تجارة شاملة عالية الربحية بواسطة بيرسيكي.'
      : 'Connecting physical stores, headless e-commerce, and distributed order management (DOM) into an omnichannel profit engine by Persici.';
    return createMetadata({
      title: `${title} — Persici Industries`,
      description,
      locale: lang as Locale,
      path: `/industries/${slug}`,
    });
  }

  if (slug === 'health') {
    const title = isAr ? 'الرعاية الصحية وعلوم الحياة' : 'Healthcare & Life Sciences';
    const description = isAr
      ? 'منصات الطب الاتصالي المتصلة، والتوافقية السريرية بمعايير FHIR R4، وحلول بيانات المرضى السيادية المحمية بواسطة بيرسيكي.'
      : 'Connected telehealth platforms, FHIR R4 clinical interoperability, and sovereign patient data solutions by Persici.';
    return createMetadata({
      title: `${title} — Persici Industries`,
      description,
      locale: lang as Locale,
      path: `/industries/${slug}`,
    });
  }

  if (slug === 'energy-commodities') {
    const title = isAr ? 'الطاقة وتجارة السلع' : 'Energy & Commodities';
    const description = isAr
      ? 'تسريع تحول الطاقة بالشبكات الذكية المستقلة، وإدارة مخاطر تجارة السلع (ETRM)، والمحاسبة الآلية للانبعاثات الكربونية بواسطة بيرسيكي.'
      : 'Accelerating the energy transition with autonomous smart grids, quantitative ETRM risk management, and automated Scope 1-3 carbon tracking by Persici.';
    return createMetadata({
      title: `${title} — Persici Industries`,
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
    return <ConsumerProductsView lang={lang} dict={dict} />;
  }

  if (slug === 'telecom-media-technology') {
    return <TelecomMediaTechnologyView lang={lang} dict={dict} />;
  }

  if (slug === 'public-sector') {
    return <PublicSectorView lang={lang} dict={dict} />;
  }

  if (slug === 'retail') {
    return <RetailView lang={lang} dict={dict} />;
  }

  if (slug === 'health') {
    return <HealthView lang={lang} dict={dict} />;
  }

  if (slug === 'energy-commodities') {
    return <EnergyCommoditiesView lang={lang} dict={dict} />;
  }

  const industry = await fetchIndustryBySlug(slug);
  if (!industry) notFound();

  return <IndustryDetailView industry={industry} lang={lang} dict={dict} />;
}
