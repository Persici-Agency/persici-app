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

  if (slug === 'ai-integration') {
    const isAr = lang === 'ar';
    const title = isAr ? 'دمج الذكاء الاصطناعي والأتمتة' : 'AI Integration & Automation';
    const description = isAr
      ? 'حلول الذكاء الاصطناعي المؤسسية، والوكلاء الأذكياء المستقلون، ومحركات استرجاع المعرفة السيادية (RAG) بواسطة بيرسيكي.'
      : 'Enterprise generative AI integration, autonomous agentic workflows, sovereign RAG architectures, and predictive intelligence by Persici.';
    return createMetadata({
      title: `${title} — Persici Solutions`,
      description,
      locale: lang as Locale,
      path: `/solutions/${slug}`,
    });
  }

  if (slug === 'ux-and-product-design') {
    const isAr = lang === 'ar';
    const title = isAr ? 'تصميم تجربة وواجهة المستخدم' : 'UX and Product Design';
    const description = isAr
      ? 'معمارية تجربة المستخدم، والأنظمة البصرية الحية، وتصميم الواجهات التفاعلية والنماذج الأولية بواسطة بيرسيكي.'
      : 'Human-centered digital product architecture, intuitive user journeys, living design systems, and rapid prototyping by Persici.';
    return createMetadata({
      title: `${title} — Persici Solutions`,
      description,
      locale: lang as Locale,
      path: `/solutions/${slug}`,
    });
  }

  if (slug === 'customer-engagement') {
    const isAr = lang === 'ar';
    const title = isAr ? 'إشراك العملاء وهندسة الولاء' : 'Customer Engagement & Loyalty';
    const description = isAr
      ? 'هندسة تفاعل العملاء، ومنظومات الولاء المؤسسية، والتخصيص اللحظي، وأحدث منصات التقنيات التسويقية بواسطة بيرسيكي.'
      : 'Enterprise customer engagement, loyalty ecosystems, real-time hyper-personalization, and durable MarTech architectures by Persici.';
    return createMetadata({
      title: `${title} — Persici Solutions`,
      description,
      locale: lang as Locale,
      path: `/solutions/${slug}`,
    });
  }

  if (slug === 'digital-engineering') {
    const isAr = lang === 'ar';
    const title = isAr ? 'الهندسة الرقمية والبرمجيات' : 'Digital Engineering & Cloud-Native Systems';
    const description = isAr
      ? 'هندسة برمجية رقمية متطورة، وأنظمة موزعة سحابية أصلية، ومسارات تدفق بيانات فورية وأتمتة DevOps بواسطة بيرسيكي.'
      : 'Mission-critical digital engineering, cloud-native distributed microservices, real-time event streaming, and automated DevOps by Persici.';
    return createMetadata({
      title: `${title} — Persici Solutions`,
      description,
      locale: lang as Locale,
      path: `/solutions/${slug}`,
    });
  }

  if (slug === 'supply-chain') {
    const isAr = lang === 'ar';
    const title = isAr ? 'سلاسل الإمداد والخدمات اللوجستية' : 'Supply Chain & Logistics Intelligence';
    const description = isAr
      ? 'سلاسل إمداد ذكية، واستشعار تنبؤي للطلب، وإدارة الطلبات الموزعة، وأتمتة المستودعات بالروبوتات وتتبع الأساطيل اللحظي بواسطة بيرسيكي.'
      : 'Intelligent supply chain, AI demand sensing, distributed order management (DOM), warehouse robotics, and real-time fleet telematics by Persici.';
    return createMetadata({
      title: `${title} — Persici Solutions`,
      description,
      locale: lang as Locale,
      path: `/solutions/${slug}`,
    });
  }

  if (slug === 'crm-management') {
    const isAr = lang === 'ar';
    const title = isAr ? 'إدارة علاقات العملاء (CRM)' : 'CRM Management (Braze & Salesforce)';
    const description = isAr
      ? 'إدارة متطورة لعلاقات العملاء، وأتمتة دورة الحياة عبر Braze وSalesforce، ومحفزات سلوكية فورية وواتساب للأعمال بواسطة بيرسيكي.'
      : 'Enterprise CRM management, lifecycle journey orchestration across Braze and Salesforce, real-time behavioral automation, and WhatsApp API by Persici.';
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

  if (slug === 'ai-integration') {
    return <AiIntegrationView lang={lang} dict={dict} />;
  }

  if (slug === 'ux-and-product-design') {
    return <UxProductDesignView lang={lang} dict={dict} />;
  }

  if (slug === 'customer-engagement') {
    return <CustomerEngagementView lang={lang} dict={dict} />;
  }

  if (slug === 'digital-engineering') {
    return <DigitalEngineeringView lang={lang} dict={dict} />;
  }

  if (slug === 'supply-chain') {
    return <SupplyChainView lang={lang} dict={dict} />;
  }

  if (slug === 'crm-management') {
    return <CrmManagementView lang={lang} dict={dict} />;
  }




  const solution = await fetchSolutionBySlug(slug);
  if (!solution) notFound();

  return <SolutionDetailView solution={solution} lang={lang} dict={dict} />;
}
