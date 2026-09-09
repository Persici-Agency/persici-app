import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '@lib/metadata';
import type { Locale } from '@lib/i18n';
import { HomeContactSection } from '../_home/components/home-contact-section';
import { SolutionsHeroSection } from '../solutions/_solutions/components/solutions-hero-section';
import { SolutionsDeliveryEngine } from '../solutions/_solutions/components/solutions-delivery-engine';
import { solutionsPageContent } from '@shared/data';

export async function generateMetadata({ params }: PageProps<'/[lang]/how-we-do-it'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return createMetadata({
    title: dict.nav.howWeDoIt,
    description: lang === 'ar' ? 'منهجية بيرسيكي لتنفيذ التحول الرقمي وتسريع النمو المؤسسي.' : 'Persici delivery framework, agile engineering, and digital transformation methodology.',
    locale: lang as Locale,
    path: '/how-we-do-it',
  });
}

export default async function HowWeDoItPage({ params }: PageProps<'/[lang]/how-we-do-it'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const isAr = lang === 'ar';

  return (
    <div className="flex flex-col min-h-screen">
      <SolutionsHeroSection
        title={{
          en: 'How We Transform & Deliver Differently',
          ar: 'كيف نُحدث التحول وننفذ بشكل مختلف',
        }}
        subtitle={{
          en: 'Our multidisciplinary engineering and product teams cut delivery cycles from months to days with high-velocity execution and proven frameworks.',
          ar: 'فرقنا الهندسية والاستراتيجية متعددة التخصصات تختصر دورات التنفيذ من أشهر إلى أيام عبر أطر عمل مجربة وأعلى معايير السرعة والموثوقية.',
        }}
        tag={{ en: 'Our Methodology', ar: 'منهجية العمل' }}
        secondaryTag={{ en: 'Agile Delivery', ar: 'التنفيذ الرشيق' }}
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85"
        ctaText={{ en: 'Explore Capabilities', ar: 'استكشف قدراتنا' }}
        ctaHref="#delivery"
        lang={lang}
      />
      <div id="delivery">
        <SolutionsDeliveryEngine
          title={solutionsPageContent.deliveryTitle[isAr ? 'ar' : 'en']}
          subtitle={solutionsPageContent.deliverySubtitle[isAr ? 'ar' : 'en']}
          image={solutionsPageContent.deliveryImage}
          pillars={solutionsPageContent.deliveryPillars}
          lang={lang}
        />
      </div>
      <HomeContactSection lang={lang} dict={dict} />
    </div>
  );
}

