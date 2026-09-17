import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { LegalPageView, privacyPolicyData } from '../_legal';

type PageParams = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageParams) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const isAr = lang === 'ar';

  return createMetadata({
    title: isAr ? 'سياسة الخصوصية وحوكمة البيانات | وكالة بيرسيشي' : 'Privacy Policy & Data Governance | Persici Agency',
    description: isAr
      ? 'سياسة الخصوصية الرسمية لوكالة بيرسيشي وفق المعايير الدولية والأنظمة السيادية في الإمارات والسعودية والأردن.'
      : 'Official Privacy Policy of Persici Agency pursuant to international GDPR/CCPA standards and statutory data protection laws in the UAE, Saudi Arabia, and Jordan.',
    locale: lang as Locale,
    path: '/privacy',
  });
}

export default async function PrivacyPage({ params }: PageParams) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <LegalPageView data={privacyPolicyData} lang={lang} dict={dict} />;
}
