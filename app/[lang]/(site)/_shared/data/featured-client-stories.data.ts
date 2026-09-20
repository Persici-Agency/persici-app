import type { FeaturedClientStoryItem } from '@shared/types';
import type { ClientStoryDetail } from '../../client-stories/_client-stories/types';
import { clientStoriesData } from '../../client-stories/_client-stories/data/client-stories.data';

/**
 * Transforms an authoritative ClientStoryDetail record from the Client Stories
 * master catalog into the standardized FeaturedClientStoryItem shape used across
 * Solutions, Industries, and How We Do It showcase views.
 */
export function clientStoryToFeaturedItem(story: ClientStoryDetail): FeaturedClientStoryItem {
  const m1 = story.metrics[0];
  const m2 = story.metrics[1];
  const m3 = story.metrics[2];
  const m4 = story.metrics[3];

  return {
    id: story.id || story.slug,
    slug: story.slug,
    badge: story.category,
    category: story.category,
    title: story.title,
    subtitle: story.leadSubtitle,
    description: story.executiveSummary,
    summary: story.executiveSummary,
    client: story.client,
    metrics: story.metrics.map((m) => ({
      value: m.value,
      label: m.label,
    })),
    metric1Val: m1?.value,
    metric1Label: m1?.label,
    metric2Val: m2?.value,
    metric2Label: m2?.label,
    metric3Val: m3?.value,
    metric3Label: m3?.label,
    metric4Val: m4?.value,
    metric4Label: m4?.label,
    image: story.heroImage,
    ctaText: {
      en: 'Explore Case Study',
      ar: 'استكشف قصة النجاح',
    },
    ctaHref: `/client-stories/${story.slug}`,
    tags: story.services ? story.services.map((s) => s.en) : [],
  };
}

/**
 * Master catalog of shared featured client stories.
 * Generated directly from clientStoriesData so that every page in the application
 * (Industries, Solutions, How We Do It) renders real, authentic client stories
 * synchronized with the live Client Stories hub.
 */
const realStoriesMap: Record<string, FeaturedClientStoryItem> = {};

// 1. Populate all 16 real stories by their exact full slug
clientStoriesData.forEach((story) => {
  const item = clientStoryToFeaturedItem(story);
  realStoriesMap[story.slug] = item;
  if (story.id) {
    realStoriesMap[story.id] = item;
  }
});

// 2. Register semantic shorthand keys and legacy alias mappings
const aliasMappings: Record<string, string> = {
  // Real stories semantic aliases
  khazan: 'khazan-crafting-alz-al-lahzat-a-campaign-for-memorable-moments',
  'khazan-fmcg': 'khazan-crafting-alz-al-lahzat-a-campaign-for-memorable-moments',
  chopon: 'chopon-sourcing-engine-for-luxury-timepieces',
  'chopon-luxury': 'chopon-sourcing-engine-for-luxury-timepieces',
  'lahfaa-perfumes': 'lahfaa-perfumes-luxury-branding-bottle-design',
  'lahfaa-branding': 'lahfaa-perfumes-luxury-branding-bottle-design',
  'lahfaa-luxury-experience': 'lahfaa-perfumes-luxury-branding-bottle-design',
  'lahfaa-ecommerce': 'lahfaa-perfumes-luxury-ecommerce-redesign',
  'hala-food': 'hala-food-brand-identity-marketing-strategy',
  'hala-food-branding': 'hala-food-brand-identity-marketing-strategy',
  'hala-food-app': 'hala-food-mobile-app-development',
  'metal-fuze': 'metal-fuze-architectural-construction-portal',
  'land-of-exotics': 'land-of-exotics-sanctuary-landing-page',
  protes: 'protes-sports-technical-restoration',
  'protes-sports': 'protes-sports-technical-restoration',
  'meraas-the-beach': 'meraas-the-beach-defining-a-contemporary-coastal-lifestyle',
  'meraas-la-mer': 'meraas-la-mer-capturing-the-essence-of-a-beachfront-metropolis',
  'meraas-residence': 'meraas-forging-a-modern-residential-identity-for-dubai',
  'meraas-residential': 'meraas-forging-a-modern-residential-identity-for-dubai',
  'saudi-food-bank': 'saudi-food-bank-inspiring-the-next-generation-to-reduce-food-waste',
  etaam: 'saudi-food-bank-inspiring-the-next-generation-to-reduce-food-waste',
  aiwin: 'aiwin-a-cinematic-introduction-to-a-legacy-of-trust',
  'ola-al-fares': 'capturing-an-icon-the-ola-al-fares-videography-session',
  'amr-sharaf': 'amr-sharaf-translating-poetry-into-a-visual-experience',

  // Graceful fallback for any historical placeholder keys -> map to closest real client story
  'nissan-mobility': 'metal-fuze-architectural-construction-portal',
  'gulf-enterprise-copilot': 'aiwin-a-cinematic-introduction-to-a-legacy-of-trust',
  'finvibe-trading': 'chopon-sourcing-engine-for-luxury-timepieces',
  'veloce-fintech': 'chopon-sourcing-engine-for-luxury-timepieces',
};

Object.entries(aliasMappings).forEach(([alias, targetSlug]) => {
  if (realStoriesMap[targetSlug]) {
    realStoriesMap[alias] = realStoriesMap[targetSlug];
  }
});

export const sharedFeaturedClientStories: Record<string, FeaturedClientStoryItem> = realStoriesMap;

/**
 * Returns an array of FeaturedClientStoryItem matching the requested keys or slugs.
 */
export function getFeaturedStories(keys: string[]): FeaturedClientStoryItem[] {
  return keys
    .map((k) => sharedFeaturedClientStories[k])
    .filter((s): s is FeaturedClientStoryItem => Boolean(s));
}

/**
 * Curated authentic stories for Marketing & Communications:
 * Khazan (GCC Multi-Channel), Meraas The Beach (Destination Cinematography),
 * Hala Food (Brand Architecture), Lahfaa Perfumes (Luxury Branding).
 */
export function getMarketingFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'khazan',
    'meraas-the-beach',
    'hala-food',
    'lahfaa-perfumes',
  ]);
}

/**
 * Curated authentic stories for Application & Management:
 * Hala Food Mobile App (React Native Super-App), ChopOn (High-Concurrency Portal),
 * PROTES Sports (Technical Infrastructure & Fulfillment).
 */
export function getApplicationManagementFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'hala-food-app',
    'chopon',
    'protes-sports',
  ]);
}

/**
 * Curated authentic stories for the Main Solutions Overview:
 * Khazan, ChopOn, Lahfaa Perfumes, Meraas The Beach.
 */
export function getSolutionsOverviewFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'khazan',
    'chopon',
    'lahfaa-perfumes',
    'meraas-the-beach',
  ]);
}

/**
 * Curated authentic stories for E-Commerce Growth:
 * Lahfaa Perfumes E-Commerce, ChopOn Marketplace, PROTES Sports Revival, Land of Exotics.
 */
export function getEcommerceGrowthFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'lahfaa-ecommerce',
    'chopon',
    'protes-sports',
    'land-of-exotics',
  ]);
}

/**
 * Curated authentic stories for AI Integration:
 * ChopOn (Verification & Algorithmic Sourcing Engine), AIWIN (Future Tech & Industrial Conglomerate),
 * Hala Food Mobile App (Dynamic Optimization).
 */
export function getAiIntegrationFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'chopon',
    'aiwin',
    'hala-food-app',
  ]);
}

/**
 * Curated authentic stories for UX and Product Design:
 * Lahfaa Perfumes (Bottle Architecture & CAD), Hala Food Mobile App (60-Second Checkout UX),
 * ChopOn (VIP Collector Interface).
 */
export function getUxProductDesignFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'lahfaa-perfumes',
    'hala-food-app',
    'chopon',
  ]);
}

/**
 * Curated authentic stories for Customer Engagement:
 * Khazan (Family Narrative Campaign), Meraas The Beach (Seaside Experience),
 * Saudi Food Bank (Nationwide Youth Engagement).
 */
export function getCustomerEngagementFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'khazan',
    'meraas-the-beach',
    'saudi-food-bank',
  ]);
}

/**
 * Curated authentic stories for Digital Engineering:
 * ChopOn (Full-Stack Web Engineering & Escrow Rails), Metal Fuze (B2B Engineering Portal),
 * Hala Food Mobile App (React Native Engine).
 */
export function getDigitalEngineeringFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'chopon',
    'metal-fuze',
    'hala-food-app',
  ]);
}

/**
 * Curated authentic stories for Supply Chain & Logistics:
 * PROTES Sports (Automated Thermal Logistics), Hala Food Mobile App (Cold-Chain Delivery),
 * ChopOn (Cross-Border Luxury Sourcing).
 */
export function getSupplyChainFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'protes-sports',
    'hala-food-app',
    'chopon',
  ]);
}

/**
 * Curated authentic stories for CRM Management:
 * Lahfaa Perfumes (GCC Loyalty & Retention), Hala Food (45K+ Household Acquisition),
 * Khazan (Retail Sell-Through Acceleration).
 */
export function getCrmManagementFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'lahfaa-ecommerce',
    'hala-food',
    'khazan',
  ]);
}
