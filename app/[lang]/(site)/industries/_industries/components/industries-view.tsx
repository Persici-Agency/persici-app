import type { Dictionary } from '@dictionaries';
import type { IndustriesPageContent } from '@shared/types';
import type { IndustriesHubCmsData } from '../data/industries-cms.data';
import { getSolutionsOverviewFeaturedClientStories } from '@shared/data';
import {
  SolutionsHeroSection,
  SolutionsWhyItMatters,
  SolutionsBenefitsStrip,
  SolutionsDeliveryEngine,
} from '@/app/[lang]/(site)/solutions/_solutions';
import { IndustriesOfferingsGrid } from './industries-offerings-grid';
import { HomeContactSection } from '../../../_home/components/home-contact-section';
import {
  FeaturedClientStories,
  InsightsSection,
  ClientReviewSection,
  FaqSection,
} from '@shared';

interface IndustriesViewProps {
  content: IndustriesPageContent | IndustriesHubCmsData;
  lang: string;
  dict: Dictionary;
}

export function IndustriesView({ content, lang, dict }: IndustriesViewProps) {
  const l = lang as 'en' | 'ar';
  const data = content as IndustriesHubCmsData;

  const fallbackStories = getSolutionsOverviewFeaturedClientStories();
  const displayStories =
    data.spotlightStories && data.spotlightStories.length > 0
      ? data.spotlightStories
      : fallbackStories;

  const fallbackInsights = [
    {
      id: 'insight-1',
      category: { en: 'Article', ar: 'مقال' },
      title: {
        en: 'Can Gen AI Help Agile Teams Improve Delivery Clarity?',
        ar: 'هل يمكن للذكاء الاصطناعي التوليدي مساعدة فرق أجايل في تحسين وضوح التسليم؟',
      },
      date: { en: 'September 02, 2026', ar: '٢ سبتمبر ٢٠٢٦' },
      href: '/insights/can-gen-ai-help-agile-teams-improve-delivery-clarity',
    },
    {
      id: 'insight-2',
      category: { en: 'Article', ar: 'مقال' },
      title: {
        en: 'What Star Formation Taught Me About Solving Business Problems',
        ar: 'ماذا تعلمت من تكوين النجوم حول حل المشكلات التجارية المعقدة',
      },
      date: { en: 'August 21, 2026', ar: '٢١ أغسطس ٢٠٢٦' },
      href: '/insights/what-star-formation-taught-me-about-solving-business-problems',
    },
  ];

  const displayInsights =
    data.insightsList && data.insightsList.length > 0 ? data.insightsList : fallbackInsights;

  const csCfg = data.clientStoriesConfig;
  const insCfg = data.insightsConfig;

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Split Hero Section */}
      {data.heroEnabled !== false && (
        <SolutionsHeroSection
          tag={data.heroBadge}
          title={data.heroTitle}
          subtitle={data.heroSubtitle}
          ctaText={data.heroCtaPrimary}
          ctaHref={data.heroCtaHref || '#industries-grid'}
          image={data.heroImage}
          lang={lang}
        />
      )}

      {/* 2. 6-Card Industry Offerings Grid */}
      {data.offeringsEnabled !== false && (
        <IndustriesOfferingsGrid
          offerings={data.offeringsList}
          badge={data.offeringsBadge?.[l] || data.offeringsBadge?.en}
          title={data.offeringsTitle[l] || data.offeringsTitle.en}
          subtitle={data.offeringsSubtitle[l] || data.offeringsSubtitle.en}
          lang={lang}
        />
      )}

      {/* 3. Editorial Why It Matters Split Section */}
      {data.whyItMattersEnabled !== false && (
        <SolutionsWhyItMatters
          title={data.whyItMattersTitle[l] || data.whyItMattersTitle.en}
          text={data.whyItMattersText[l] || data.whyItMattersText.en}
          image={data.whyItMattersImage}
          metric1Val={data.whyItMattersMetric1Val}
          metric1Label={data.whyItMattersMetric1Label}
          metric2Val={data.whyItMattersMetric2Val}
          metric2Label={data.whyItMattersMetric2Label}
          lang={lang}
        />
      )}

      {/* 4. 3-Column Strategic Benefits Strip */}
      {data.benefitsEnabled !== false && (
        <SolutionsBenefitsStrip
          title={data.benefitsTitle[l] || data.benefitsTitle.en}
          image={data.benefitsImage}
          benefits={data.benefits}
          lang={lang}
        />
      )}

      {/* 5. Featured Client Stories */}
      {csCfg?.enabled !== false && (
        <FeaturedClientStories
          stories={displayStories}
          lang={lang}
          sectionBadge={
            csCfg?.badge?.[l] ||
            csCfg?.badge?.en ||
            (l === 'ar' ? 'قصص النجاح المميزة' : 'Featured Client Stories')
          }
          sectionTitle={
            csCfg?.title?.[l] ||
            csCfg?.title?.en ||
            (l === 'ar'
              ? 'أثر تجاري وهندسي ملموس عبر كافة القطاعات'
              : 'Cross-Industry Engineering & Commercial Impact')
          }
          sectionSubtitle={
            csCfg?.subtitle?.[l] ||
            csCfg?.subtitle?.en ||
            (l === 'ar'
              ? 'اكتشف كيف تقدم بيرسيشي حلول برمجية وتجارية وتسويقية متكاملة لرواد الصناعات في المنطقة.'
              : 'Discover how Persici delivers enterprise-grade software, commerce, and marketing transformations for industry leaders.')
          }
        />
      )}

      {/* 6. 4-Pillar Delivery Engine */}
      {data.deliveryEnabled !== false && (
        <SolutionsDeliveryEngine
          badge={data.deliveryBadge}
          title={data.deliveryTitle[l] || data.deliveryTitle.en}
          subtitle={data.deliverySubtitle[l] || data.deliverySubtitle.en}
          image={data.deliveryImage}
          pillars={data.deliveryPillars}
          lang={lang}
        />
      )}

      {/* 7. Latest Insights / Thinking */}
      {insCfg?.enabled !== false && (
        <InsightsSection
          title={
            insCfg?.title ||
            data.insightsTitle || {
              en: 'Our latest thinking',
              ar: 'أحدث رؤانا وأفكارنا',
            }
          }
          subtitle={
            insCfg?.subtitle ||
            data.insightsSubtitle || {
              en: 'Fresh perspectives on how teams can build, run and scale with AI across every industry.',
              ar: 'رؤى حديثة حول كيفية بناء الفرق لأعمالها وتشغيلها والتوسع عبر الذكاء الاصطناعي في كل قطاع.',
            }
          }
          ctaText={
            insCfg?.ctaText ||
            data.insightsCtaText || {
              en: 'Learn more',
              ar: 'اعرف المزيد',
            }
          }
          ctaHref={insCfg?.ctaHref || '/insights'}
          items={displayInsights}
          lang={lang}
        />
      )}

      {/* 8. Client Review / Executive Quote */}
      {data.quoteEnabled !== false && (
        <ClientReviewSection
          quoteText={data.quoteText}
          quoteAuthor={data.quoteAuthor}
          quoteRole={data.quoteRole}
          badge={
            data.quoteBadge || {
              en: 'Verified Enterprise Partner',
              ar: 'شريك مؤسسي معتمد',
            }
          }
          quoteAvatar={data.quoteAvatar || undefined}
          lang={lang}
        />
      )}

      {/* 9. FAQs Section */}
      {data.faqsEnabled !== false && (
        <FaqSection
          title={data.faqsTitle[l] || data.faqsTitle.en}
          subtitle={data.faqsSubtitle[l] || data.faqsSubtitle.en}
          faqs={data.faqs}
          lang={lang}
        />
      )}

      {/* 10. Shared Contact Section */}
      {data.contactEnabled !== false && <HomeContactSection dict={dict} lang={lang} />}
    </main>
  );
}
