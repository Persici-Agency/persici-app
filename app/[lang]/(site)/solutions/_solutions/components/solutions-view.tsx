import React from 'react';
import { FeaturedClientStories, InsightsSection, FaqSection, ClientReviewSection } from '@shared';
import type { Dictionary } from '@dictionaries';
import type { SolutionsHubCmsData } from '../services/solutions-data.service';
import { HomeContactSection } from '../../../_home/components/home-contact-section';
import { SolutionsHeroSection } from './solutions-hero-section';
import { SolutionsOfferingsGrid } from './solutions-offerings-grid';
import { SolutionsWhyItMatters } from './solutions-why-it-matters';
import { SolutionsBenefitsStrip } from './solutions-benefits-strip';
import { SolutionsDeliveryEngine } from './solutions-delivery-engine';

export type SolutionsViewProps = {
  content: SolutionsHubCmsData;
  lang: string;
  dict: Dictionary;
};

export function SolutionsView({ content, lang, dict }: SolutionsViewProps) {
  const l = lang as 'en' | 'ar';
  const offeringsTitle = content.offeringsTitle[l] || content.offeringsTitle.en;
  const offeringsSubtitle = content.offeringsSubtitle[l] || content.offeringsSubtitle.en;
  const whyItMattersTitle = content.whyItMattersTitle[l] || content.whyItMattersTitle.en;
  const whyItMattersText = content.whyItMattersText[l] || content.whyItMattersText.en;
  const benefitsTitle = content.benefitsTitle[l] || content.benefitsTitle.en;
  const deliveryTitle = content.deliveryTitle[l] || content.deliveryTitle.en;
  const deliverySubtitle = content.deliverySubtitle[l] || content.deliverySubtitle.en;
  const faqsTitle = content.faqsTitle[l] || content.faqsTitle.en;
  const faqsSubtitle = content.faqsSubtitle[l] || content.faqsSubtitle.en;

  const csConfig = content.clientStoriesConfig;
  const insConfig = content.insightsConfig;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      {content.heroEnabled !== false && (
        <SolutionsHeroSection content={content} lang={lang} />
      )}

      {/* 2. "Our Offerings" 9 Solutions Grid from Challenges Section */}
      {content.offeringsEnabled !== false && (
        <SolutionsOfferingsGrid
          offerings={content.offeringsList}
          title={offeringsTitle}
          subtitle={offeringsSubtitle}
          lang={lang}
        />
      )}

      {/* 3. Why It Matters Context */}
      {content.whyItMattersEnabled !== false && (
        <SolutionsWhyItMatters
          title={whyItMattersTitle}
          text={whyItMattersText}
          image={content.whyItMattersImage}
          metric1Val={content.whyItMattersMetric1Val}
          metric1Label={content.whyItMattersMetric1Label}
          metric2Val={content.whyItMattersMetric2Val}
          metric2Label={content.whyItMattersMetric2Label}
          lang={lang}
        />
      )}

      {/* 4. Benefits of Growth Architecture Strip */}
      {content.benefitsEnabled !== false && (
        <SolutionsBenefitsStrip
          title={benefitsTitle}
          image={content.benefitsImage}
          benefits={content.benefits}
          lang={lang}
        />
      )}

      {/* 5. Customer Stories / Stacked Spotlight Cards */}
      {csConfig?.enabled !== false && (
        <FeaturedClientStories
          content={content}
          sectionBadge={csConfig?.badge}
          sectionTitle={csConfig?.title?.[l] || csConfig?.title?.en || undefined}
          sectionSubtitle={csConfig?.subtitle?.[l] || csConfig?.subtitle?.en || undefined}
          stories={content.spotlightStories}
          lang={lang}
        />
      )}

      {/* 6. "How We Deliver Differently" / Cut Dev Time Platform */}
      {content.deliveryEnabled !== false && (
        <SolutionsDeliveryEngine
          badge={content.deliveryBadge}
          title={deliveryTitle}
          subtitle={deliverySubtitle}
          image={content.deliveryImage}
          pillars={content.deliveryPillars}
          lang={lang}
        />
      )}

      {/* 7. Our Latest Thinking / Insights Section */}
      {insConfig?.enabled !== false && (
        <InsightsSection
          title={insConfig?.title || content.insightsTitle}
          subtitle={insConfig?.subtitle || content.insightsSubtitle}
          ctaText={insConfig?.ctaText || content.insightsCtaText}
          ctaHref={insConfig?.ctaHref || '/insights'}
          items={content.insightsList}
          lang={lang}
        />
      )}

      {/* 8. Client Review Standalone Monospace Quote */}
      {content.quoteEnabled !== false && (
        <ClientReviewSection
          content={content}
          badge={content.quoteBadge}
          quoteAvatar={content.quoteAvatar}
          lang={lang}
        />
      )}

      {/* 9. FAQs Accordion */}
      {content.faqsEnabled !== false && (
        <FaqSection
          title={faqsTitle}
          subtitle={faqsSubtitle}
          faqs={content.faqs}
          lang={lang}
        />
      )}

      {/* 10. Static Home Contact Section (Required on all Solution Pages) */}
      {content.contactEnabled !== false && (
        <HomeContactSection lang={lang} dict={dict} />
      )}
    </div>
  );
}
