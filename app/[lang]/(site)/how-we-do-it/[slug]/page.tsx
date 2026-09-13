import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { locales } from '@lib/i18n';
import { howWeDoItOfferingsList } from '@shared/data';
import { StrategyConsultingView } from './_strategy-consulting';
import { DigitalTransformationFrameworkView } from './_digital-transformation-framework';
import { ProductManagementView } from './_product-management';
import { EngineeringTechnologyView } from './_engineering-technology';
import { ExperienceTransformationView } from './_experience-transformation';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    for (const item of howWeDoItOfferingsList) {
      params.push({ lang, slug: item.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const isAr = lang === 'ar';

  if (slug === 'strategy-consulting') {
    const title = isAr ? 'الاستراتيجية والاستشارات' : 'Strategy & Consulting';
    const description = isAr
      ? 'استشارات استراتيجية تقود نمواً قابلاً للتوسع وتحول الطموح التجاري إلى خارطة طريق نمو واضحة وقابلة للتنفيذ بواسطة بيرسيكي.'
      : 'Strategic consulting that drives scalable growth: turning business ambition into clear, actionable growth roadmaps by Persici.';
    return createMetadata({
      title: `${title} — Persici Agency`,
      description,
      locale: lang as Locale,
      path: `/how-we-do-it/${slug}`,
    });
  }

  if (slug === 'digital-transformation-framework') {
    const title = isAr ? 'إطار التحول الرقمي' : 'Digital Transformation Framework';
    const description = isAr
      ? 'تسريع التحول الرقمي المؤسسي بوتيرة استثنائية عبر إطار SPEED الجامع للاستراتيجية والمنتج والتجربة والهندسة والبيانات والذكاء الاصطناعي.'
      : 'Accelerate business transformation at pace with Persici’s SPEED framework uniting Strategy, Product, Experience, Engineering, and Data & AI.';
    return createMetadata({
      title: `${title} — Persici Agency`,
      description,
      locale: lang as Locale,
      path: `/how-we-do-it/${slug}`,
    });
  }

  if (slug === 'product-management') {
    const title = isAr ? 'إدارة المنتجات' : 'Product Management';
    const description = isAr
      ? 'التفكير المتمحور حول المنتج الذي يقود التحول المؤسسي عبر دورات مستمرة لتحديد وخلق وتسليم القيمة بأعلى درجات المرونة وسرعة الإنجاز.'
      : 'Product thinking that drives organizational transformation through continuous cycles of identifying, creating, and delivering value by Persici.';
    return createMetadata({
      title: `${title} — Persici Agency`,
      description,
      locale: lang as Locale,
      path: `/how-we-do-it/${slug}`,
    });
  }

  if (slug === 'engineering-technology') {
    const title = isAr ? 'الهندسة والتكنولوجيا' : 'Engineering & Technology';
    const description = isAr
      ? 'ريادة المشهد عبر الهندسة الرشيقة وبنى الخدمات المصغرة والأنظمة السحابية القابلة للتوسع وتسريع دورات تطوير البرمجيات بواسطة بيرسيكي.'
      : 'Lead the way with agile engineering, cloud-native scalability, microservices architectures, and rapid software delivery by Persici.';
    return createMetadata({
      title: `${title} — Persici Agency`,
      description,
      locale: lang as Locale,
      path: `/how-we-do-it/${slug}`,
    });
  }

  if (slug === 'experience-transformation') {
    const title = isAr ? 'تحول تجربة المستخدم' : 'Experience Transformation';
    const description = isAr
      ? 'الارتقاء بالتطلعات عبر تصميم مستقبلي متمحور حول الإنسان، وأنظمة تصميم موحدة، ورحلات عملاء متكاملة عبر كافة القنوات بواسطة بيرسيكي.'
      : 'Elevating expectations through future-ready, human-centered design, enterprise design systems, and omnichannel journey transformation by Persici.';
    return createMetadata({
      title: `${title} — Persici Agency`,
      description,
      locale: lang as Locale,
      path: `/how-we-do-it/${slug}`,
    });
  }

  return {};
}

export default async function HowWeDoItSubPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  if (slug === 'strategy-consulting') {
    return <StrategyConsultingView lang={lang} dict={dict} />;
  }

  if (slug === 'digital-transformation-framework') {
    return <DigitalTransformationFrameworkView lang={lang} dict={dict} />;
  }

  if (slug === 'product-management') {
    return <ProductManagementView lang={lang} dict={dict} />;
  }

  if (slug === 'engineering-technology') {
    return <EngineeringTechnologyView lang={lang} dict={dict} />;
  }

  if (slug === 'experience-transformation') {
    return <ExperienceTransformationView lang={lang} dict={dict} />;
  }

  notFound();
}
