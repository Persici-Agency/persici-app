import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { LegalPageView, termsOfServiceData } from '../_legal';

type PageParams = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageParams) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const isAr = lang === 'ar';

  return createMetadata({
    title: isAr ? 'شروط الخدمة والتعامل التجاري | وكالة بيرسيشي' : 'Terms of Service & Commercial Agreement | Persici Agency',
    description: isAr
      ? 'الشروط والأحكام التجارية العامة لوكالة بيرسيشي، متوافقة مع الأنظمة التجارية في الإمارات والسعودية والأردن.'
      : 'Standard Commercial Terms of Service of Persici Agency, governing software engineering, eCommerce acceleration, and advisory engagements across UAE, KSA, and Jordan.',
    locale: lang as Locale,
    path: '/terms-of-service',
  });
}

export default async function TermsOfServicePage({ params }: PageParams) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <LegalPageView data={termsOfServiceData} lang={lang} dict={dict} />;
}
