import type {
  LocalizedString,
  SolutionDiagramType,
  IndustryOfferingItem,
  SolutionBenefitItem,
  SolutionExecutionPillar,
  SolutionFaqItem,
  FeaturedClientStoryItem,
  IndustriesPageContent,
  IndustryFutureTrendItem,
  IndustryAgileFoundation,
} from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import type {
  SolutionDynamicSelectionMode,
  SolutionClientStoriesSectionConfig,
  SolutionInsightsSectionConfig,
  SolutionFeatureOfferingItem,
  SolutionFeatureVerticalItem,
  SolutionTechStackPod,
} from '@/app/[lang]/(site)/solutions/_solutions/data/solutions-cms.data';
import { industriesPageContent, industriesOfferingsList } from '@shared/data';
import { consumerProductsData } from '../../[slug]/_consumer-products/data/consumer-products.data';
import { telecomMediaTechnologyData } from '../../[slug]/_telecom-media-technology/data/telecom-media-technology.data';
import { publicSectorData } from '../../[slug]/_public-sector/data/public-sector.data';
import { retailData } from '../../[slug]/_retail/data/retail.data';
import { healthData } from '../../[slug]/_health/data/health.data';
import { energyCommoditiesData } from '../../[slug]/_energy-commodities/data/energy-commodities.data';

export type IndustryDynamicSelectionMode = SolutionDynamicSelectionMode;
export type IndustryClientStoriesSectionConfig = SolutionClientStoriesSectionConfig;
export type IndustryInsightsSectionConfig = SolutionInsightsSectionConfig;
export type IndustryFeatureOfferingItem = SolutionFeatureOfferingItem;
export type IndustryFeatureVerticalItem = SolutionFeatureVerticalItem;
export type IndustryTechStackPod = SolutionTechStackPod;

export interface IndustryRealitiesSectionConfig {
  enabled?: boolean;
  badge?: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
}

export interface IndustryAgileFoundationSectionConfig extends IndustryAgileFoundation {
  enabled?: boolean;
  sectionBadge?: LocalizedString;
}

export interface IndustryFeatureCmsData {
  page: string; // e.g. 'industries-consumer-products'
  slug: string; // e.g. 'consumer-products'
  seo: {
    title: LocalizedString;
    description: LocalizedString;
  };
  hero: {
    enabled?: boolean;
    tag: LocalizedString;
    secondaryTag: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    ctaText: LocalizedString;
    ctaHref: string;
    image: string;
    highlights: LocalizedString[];
  };
  realities: IndustryRealitiesSectionConfig;
  futureStrip: IndustryFutureTrendItem[];
  agileFoundation: IndustryAgileFoundationSectionConfig;
  offeringsEnabled?: boolean;
  offeringsBadge: LocalizedString;
  offeringsTitle: LocalizedString;
  offeringsSubtitle: LocalizedString;
  offerings: IndustryFeatureOfferingItem[];
  whyItMatters: {
    enabled?: boolean;
    title: LocalizedString;
    text: LocalizedString;
    image: string;
    metric1Val: string;
    metric1Label: LocalizedString;
    metric2Val: string;
    metric2Label: LocalizedString;
  };
  benefitsStrip: {
    enabled?: boolean;
    title: LocalizedString;
    image: string;
    benefits: SolutionBenefitItem[];
  };
  verticalsEnabled?: boolean;
  verticalsBadge: LocalizedString;
  verticalsTitle: LocalizedString;
  verticalsSubtitle: LocalizedString;
  verticals: IndustryFeatureVerticalItem[];
  techStackEnabled?: boolean;
  techStackBadge: LocalizedString;
  techStackTitle: LocalizedString;
  techStackSubtitle: LocalizedString;
  techStackPods: IndustryTechStackPod[];
  clientStoriesConfig: IndustryClientStoriesSectionConfig;
  clientStories: FeaturedClientStoryItem[];
  delivery: {
    enabled?: boolean;
    badge: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    image: string;
    pillars: SolutionExecutionPillar[];
  };
  insightsConfig: IndustryInsightsSectionConfig;
  insights: ContentCardItem[];
  clientReview: {
    enabled?: boolean;
    quote: LocalizedString;
    author: string;
    role: LocalizedString;
    badge: LocalizedString;
    avatar?: string;
  };
  faqsEnabled?: boolean;
  faqsTitle: LocalizedString;
  faqsSubtitle: LocalizedString;
  faqs: SolutionFaqItem[];
  contactEnabled?: boolean;
}

export interface IndustriesHubCmsData extends IndustriesPageContent {
  seo?: {
    title: LocalizedString;
    description: LocalizedString;
  };
  heroEnabled?: boolean;
  heroCtaHref?: string;
  offeringsEnabled?: boolean;
  offeringsBadge?: LocalizedString;
  whyItMattersEnabled?: boolean;
  whyItMattersMetric1Val?: string;
  whyItMattersMetric1Label?: LocalizedString;
  whyItMattersMetric2Val?: string;
  whyItMattersMetric2Label?: LocalizedString;
  benefitsEnabled?: boolean;
  clientStoriesConfig: IndustryClientStoriesSectionConfig;
  spotlightStories?: FeaturedClientStoryItem[];
  deliveryEnabled?: boolean;
  deliveryBadge?: LocalizedString;
  insightsConfig: IndustryInsightsSectionConfig;
  insightsTitle?: LocalizedString;
  insightsSubtitle?: LocalizedString;
  insightsCtaText?: LocalizedString;
  insightsList: ContentCardItem[];
  quoteEnabled?: boolean;
  quoteBadge?: LocalizedString;
  quoteAvatar?: string;
  faqsEnabled?: boolean;
  contactEnabled?: boolean;
}

export const INDUSTRY_FEATURE_SLUGS = [
  'consumer-products',
  'telecom-media-technology',
  'public-sector',
  'retail',
  'health',
  'energy-commodities',
] as const;

export type IndustryFeatureSlug = (typeof INDUSTRY_FEATURE_SLUGS)[number];

/**
 * Legacy dashboard/sidebar slug aliases mapped to canonical industry slugs.
 */
export const INDUSTRY_LEGACY_SLUG_ALIASES: Record<string, IndustryFeatureSlug> = {
  'financial-services': 'retail',
  'technology-media': 'telecom-media-technology',
  'industries-financial-services': 'retail',
  'industries-technology-media': 'telecom-media-technology',
};

export function isIndustryPageSlug(pageSlug: string): boolean {
  if (pageSlug === 'industries') return true;
  if (pageSlug in INDUSTRY_LEGACY_SLUG_ALIASES) return true;
  if (pageSlug.startsWith('industries-')) {
    const sub = pageSlug.replace(/^industries-/, '');
    return (
      (INDUSTRY_FEATURE_SLUGS as readonly string[]).includes(sub) ||
      sub in INDUSTRY_LEGACY_SLUG_ALIASES
    );
  }
  return false;
}

export function extractIndustryFeatureSlug(pageSlug: string): IndustryFeatureSlug | null {
  if (pageSlug in INDUSTRY_LEGACY_SLUG_ALIASES) {
    return INDUSTRY_LEGACY_SLUG_ALIASES[pageSlug];
  }
  const clean = pageSlug.startsWith('industries-') ? pageSlug.replace(/^industries-/, '') : pageSlug;
  if (clean in INDUSTRY_LEGACY_SLUG_ALIASES) {
    return INDUSTRY_LEGACY_SLUG_ALIASES[clean];
  }
  if ((INDUSTRY_FEATURE_SLUGS as readonly string[]).includes(clean)) {
    return clean as IndustryFeatureSlug;
  }
  return null;
}

const DEFAULT_HUB_INSIGHTS: ContentCardItem[] = [
  {
    id: 'insight-1',
    slug: 'can-gen-ai-help-agile-teams-improve-delivery-clarity',
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
    slug: 'what-star-formation-taught-me-about-solving-business-problems',
    category: { en: 'Article', ar: 'مقال' },
    title: {
      en: 'What Star Formation Taught Me About Solving Business Problems',
      ar: 'ماذا تعلمت من تكوين النجوم حول حل المشكلات التجارية المعقدة',
    },
    date: { en: 'August 21, 2026', ar: '٢١ أغسطس ٢٠٢٦' },
    href: '/insights/what-star-formation-taught-me-about-solving-business-problems',
  },
];

export const defaultIndustriesHubCmsData: IndustriesHubCmsData = {
  ...industriesPageContent,
  page: 'industries',
  seo: {
    title: {
      en: 'Industries | Domain-Specialized Digital Transformation',
      ar: 'القطاعات | التحول الرقمي المتخصص حسب القطاع',
    },
    description: {
      en: 'Explore how Persici delivers domain-specialized software engineering, digital commerce, and AI transformation across Consumer Products, TMT, Public Sector, Retail, Healthcare, and Energy.',
      ar: 'اكتشف كيف تقدم بيرسيشي حلول هندسة البرمجيات والتجارة الرقمية والذكاء الاصطناعي المتخصصة لقطاعات المنتجات الاستهلاكية، والاتصالات، والقطاع الحكومي، والتجزئة، والصحة، والطاقة.',
    },
  },
  heroEnabled: true,
  heroCtaHref: '#industries-grid',
  offeringsEnabled: true,
  offeringsBadge: {
    en: 'Target Industries',
    ar: 'القطاعات المتخصصة',
  },
  whyItMattersEnabled: true,
  whyItMattersMetric1Val: '3.4x',
  whyItMattersMetric1Label: {
    en: 'Average Revenue Velocity',
    ar: 'تسارع وتيرة الإيرادات',
  },
  whyItMattersMetric2Val: '-38%',
  whyItMattersMetric2Label: {
    en: 'Customer Acquisition Cost',
    ar: 'انخفاض تكلفة الاستحواذ',
  },
  benefitsEnabled: true,
  clientStoriesConfig: {
    enabled: true,
    badge: {
      en: 'Featured Client Stories',
      ar: 'قصص النجاح المميزة',
    },
    title: {
      en: 'Cross-Industry Engineering & Commercial Impact',
      ar: 'أثر تجاري وهندسي ملموس عبر كافة القطاعات',
    },
    subtitle: {
      en: 'Discover how Persici delivers enterprise-grade software, commerce, and marketing transformations for industry leaders.',
      ar: 'اكتشف كيف تقدم بيرسيشي حلول برمجية وتجارية وتسويقية متكاملة لرواد الصناعات في المنطقة.',
    },
    selectionMode: 'custom',
    categorySlug: 'all',
    maxCount: 4,
    selectedSlugs: [
      'khazan-crafting-alz-al-lahzat-a-campaign-for-memorable-moments',
      'chopon-sourcing-engine-for-luxury-timepieces',
      'lahfaa-perfumes-luxury-branding-bottle-design',
      'meraas-the-beach-defining-a-contemporary-coastal-lifestyle',
    ],
  },
  deliveryEnabled: true,
  deliveryBadge: {
    en: 'Execution Framework',
    ar: 'إطار العمل التنفيذي',
  },
  insightsConfig: {
    enabled: true,
    title: {
      en: 'Our latest thinking',
      ar: 'أحدث رؤانا وأفكارنا',
    },
    subtitle: {
      en: 'Fresh perspectives on how teams can build, run and scale with AI across every industry.',
      ar: 'رؤى حديثة حول كيفية بناء الفرق لأعمالها وتشغيلها والتوسع عبر الذكاء الاصطناعي في كل قطاع.',
    },
    ctaText: {
      en: 'Learn more',
      ar: 'اعرف المزيد',
    },
    ctaHref: '/insights',
    selectionMode: 'custom',
    categorySlug: 'all',
    maxCount: 2,
    selectedSlugs: [],
  },
  insightsTitle: {
    en: 'Our latest thinking',
    ar: 'أحدث رؤانا وأفكارنا',
  },
  insightsSubtitle: {
    en: 'Fresh perspectives on how teams can build, run and scale with AI across every industry.',
    ar: 'رؤى حديثة حول كيفية بناء الفرق لأعمالها وتشغيلها والتوسع عبر الذكاء الاصطناعي في كل قطاع.',
  },
  insightsCtaText: {
    en: 'Learn more',
    ar: 'اعرف المزيد',
  },
  insightsList: DEFAULT_HUB_INSIGHTS,
  quoteEnabled: true,
  quoteBadge: {
    en: 'Verified Enterprise Partner',
    ar: 'شريك مؤسسي معتمد',
  },
  quoteAvatar: '',
  faqsEnabled: true,
  contactEnabled: true,
};

interface IndustryFeaturePageMetaPreset {
  seo: { title: LocalizedString; description: LocalizedString };
  realities: IndustryRealitiesSectionConfig;
  offeringsBadge: LocalizedString;
  verticalsBadge: LocalizedString;
  techStackBadge: LocalizedString;
  clientStoriesConfig: IndustryClientStoriesSectionConfig;
  insightsConfig: IndustryInsightsSectionConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawData: any;
}

const INDUSTRY_FEATURE_PRESETS: Record<IndustryFeatureSlug, IndustryFeaturePageMetaPreset> = {
  'consumer-products': {
    rawData: consumerProductsData,
    seo: {
      title: {
        en: 'Consumer Products | D2C Commerce & Supply Chain Transformation',
        ar: 'المنتجات الاستهلاكية | التجارة المباشرة وتحول سلاسل الإمداد',
      },
      description: {
        en: 'Accelerate direct-to-consumer (D2C) revenue, unify omnichannel retail execution, and modernize supply chain intelligence with Persici.',
        ar: 'تسريع إيرادات البيع المباشر للمستهلك، وتوحيد قنوات التجزئة، وتحديث ذكاء سلاسل الإمداد للمنتجات الاستهلاكية مع بيرسيشي.',
      },
    },
    realities: {
      enabled: true,
      badge: { en: 'Market Realities', ar: 'واقع السوق والتحديات' },
      title: {
        en: 'The realities of consumer products',
        ar: 'واقع قطاع المنتجات الاستهلاكية',
      },
      subtitle: {
        en: 'Consumer products enterprises are navigating shifting consumer behaviors, omnichannel fragmentation, and volatile supply networks while striving to deliver personalized, sustainable brand experiences.',
        ar: 'تواجه العلامات الاستهلاكية تشتتاً في بيانات العملاء وتقلبات متسارعة في سلاسل التوريد، بينما تتطلب المنافسة تجارب استثنائية متصلة واستدامة موثقة.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Transforming Consumer Brands Across Regional Markets',
        ar: 'نمو قياسي وهوامش ربحية استثنائية في قطاع التجزئة',
      },
      subtitle: {
        en: 'Explore how our commerce, inventory, and retention architectures power sustained commercial growth for premier consumer enterprises.',
        ar: 'تعرف على كيفية مساهمة معماريات بيرسيشي في مضاعفة المبيعات المباشرة وولاء المستهلكين لعلامات كبرى.',
      },
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: consumerProductsData.clientStories.length || 4,
      selectedSlugs: consumerProductsData.clientStories
        .map((s) => String(s.slug || s.id || ''))
        .filter(Boolean),
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'Consumer Industry Insights',
        ar: 'رؤى وأبحاث المنتجات الاستهلاكية',
      },
      subtitle: {
        en: 'Executive perspectives on omnichannel retail velocity, D2C margins, and sustainable supply chains.',
        ar: 'أحدث التحليلات الميدانية حول استراتيجيات البيع المباشر، وتنبؤ الطلب، والامتثال البيئي للمنتجات.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  'telecom-media-technology': {
    rawData: telecomMediaTechnologyData,
    seo: {
      title: {
        en: 'Telecommunications, Media & Technology | Cloud & Digital Platforms',
        ar: 'الاتصالات والإعلام والتكنولوجيا | المنصات الرقمية والسحابية',
      },
      description: {
        en: 'Modernize BSS/OSS stacks, monetize 5G and OTT streaming platforms, and deploy AI subscriber retention engines with Persici.',
        ar: 'تحديث أنظمة الفوترة والشبكات، وتعظيم عوائد الجيل الخامس وبث المحتوى، وبناء محركات استبقاء المشتركين بالذكاء الاصطناعي مع بيرسيشي.',
      },
    },
    realities: {
      enabled: true,
      badge: { en: 'Market Realities', ar: 'واقع السوق والتحديات' },
      title: {
        en: 'The realities of telecommunications, media and technology',
        ar: 'واقع قطاع الاتصالات والإعلام والتكنولوجيا',
      },
      subtitle: {
        en: 'Telecommunications, media, and technology enterprises face intense infrastructure capital demands, subscriber churn, and fragmented content distribution while navigating legacy operational architectures.',
        ar: 'يواجه مشغلو الاتصالات وشركات التكنولوجيا نفقات رأسمالية ضخمة في البنية التحتية وتسارع فقدان المشتركين، بينما تعيق الأنظمة القديمة طرح الخدمات المبتكرة.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Mission-Critical Digital Engineering for Telecom & Tech',
        ar: 'بنية تحتية سيادية وتسارع رقمي في قطاع الاتصالات',
      },
      subtitle: {
        en: 'Explore how our cloud-native platforms, AI copilots, and real-time streaming engines power leading operators.',
        ar: 'اكتشف كيف ساهمت معماريات بيرسيشي في أتمتة عمليات المشتركين وتقديم حلول سحابية فائقة الموثوقية.',
      },
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: telecomMediaTechnologyData.clientStories.length || 4,
      selectedSlugs: telecomMediaTechnologyData.clientStories
        .map((s) => String(s.slug || s.id || ''))
        .filter(Boolean),
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'TMT Executive Insights',
        ar: 'رؤى وأبحاث قطاع الاتصالات والإعلام',
      },
      subtitle: {
        en: 'Engineering playbooks on Open Gateway APIs, subscriber retention, and carrier-grade cloud modernization.',
        ar: 'أحدث التحليلات الميدانية حول عوائد شبكات 5G، ونماذج التنبؤ بمغادرة المشتركين، وتحديث منظومات الفوترة.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  'public-sector': {
    rawData: publicSectorData,
    seo: {
      title: {
        en: 'Public Sector & Government | Sovereign Digital Services',
        ar: 'القطاع الحكومي والعام | الخدمات الرقمية السيادية',
      },
      description: {
        en: 'Architect secure, accessible citizen portals, sovereign cloud platforms, and inter-agency data governance ecosystems with Persici.',
        ar: 'تصميم وتطوير البوابات الحكومية الذكية، والمنصات السحابية السيادية، ومنظومات تكامل وحوكمة البيانات الوطنية مع بيرسيشي.',
      },
    },
    realities: {
      enabled: true,
      badge: { en: 'Market Realities', ar: 'واقع السوق والتحديات' },
      title: {
        en: 'The realities of the public sector',
        ar: 'واقع القطاع الحكومي والخدمات العامة',
      },
      subtitle: {
        en: 'Public sector entities are navigating legacy bureaucratic architectures and complex compliance mandates while striving to deliver modern, sovereign, and accessible citizen services.',
        ar: 'تواجه المؤسسات الحكومية تحديات البيروقراطية المجزأة والأنظمة المتقادمة، بينما يتطلب التحول الرقمي أماناً سيادياً وشمولاً رقمياً لكافة المواطنين.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Proven Public Impact & Sovereign Cloud Scalability',
        ar: 'منظومات سيادية موثوقة تخدم ملايين المواطنين',
      },
      subtitle: {
        en: 'Explore how our sovereign cloud foundations, citizen portals, and automated workflow engines transform public services.',
        ar: 'اكتشف كيف ساهمت معماريات بيرسيشي في تسريع المعاملات الحكومية وبناء بنية رقمية وطنية آمنة.',
      },
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: publicSectorData.clientStories.length || 3,
      selectedSlugs: publicSectorData.clientStories
        .map((s) => String(s.slug || s.id || ''))
        .filter(Boolean),
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'Public Sector Insights',
        ar: 'رؤى وأبحاث القطاع الحكومي',
      },
      subtitle: {
        en: 'Whitepapers on government cloud sovereignty, proactive life-event journeys, and inter-agency data meshes.',
        ar: 'دراسات ميدانية حول السحابة الحكومية السيادية، وتصميم تجربة المواطن الرقمية، وحوكمة تبادل البيانات.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  retail: {
    rawData: retailData,
    seo: {
      title: {
        en: 'Retail & Omnichannel Commerce | Unified Store & Digital Experiences',
        ar: 'تجارة التجزئة | التجارة الموحدة وتجارب المتاجر المتصلة',
      },
      description: {
        en: 'Unify physical store operations and headless digital commerce with real-time inventory, distributed order management, and loyalty engines by Persici.',
        ar: 'توحيد عمليات الفروع الفعلية والتجارة الإلكترونية مع أنظمة إدارة الطلبات الموزعة وبرامج الولاء الذكية من بيرسيشي.',
      },
    },
    realities: {
      enabled: true,
      badge: { en: 'Market Realities', ar: 'واقع السوق والتحديات' },
      title: {
        en: 'The realities of retail',
        ar: 'واقع قطاع تجارة التجزئة',
      },
      subtitle: {
        en: 'Retailers must overcome disparate channel architectures, rising consumer immediacy, and complex inventory routing to maintain relevance and protect operating margins.',
        ar: 'تواجه شركات التجزئة انفصال القنوات المادية عن الرقمية وتوقعات متزايدة للعملاء وسرعات توصيل قياسية، بينما تتطلب الهوامش الربحية بيانات مباشرة دقيقة.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Transforming Retail Experiences Across Physical & Digital',
        ar: 'نجاحات تجارية استثنائية ونمو متسارع في قطاع التجزئة',
      },
      subtitle: {
        en: 'Explore how our composable commerce, mobile clienteling, and distributed order management engines drive retail profitability.',
        ar: 'اكتشف كيف ساهمت معماريات بيرسيشي في القضاء على نفاد المخزون ومضاعفة مبيعات كبرى سلاسل المتاجر.',
      },
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: retailData.clientStories.length || 4,
      selectedSlugs: retailData.clientStories
        .map((s) => String(s.slug || s.id || ''))
        .filter(Boolean),
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'Omnichannel Retail Insights',
        ar: 'رؤى وأبحاث قطاع التجزئة',
      },
      subtitle: {
        en: 'Executive playbooks on unified retail architectures, ship-from-store economics, and reverse logistics.',
        ar: 'أحدث التحليلات الميدانية حول التجارة الموحدة، وتحويل المتاجر لمراكز شحن، وتحسين اللوجستيات العكسية.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  health: {
    rawData: healthData,
    seo: {
      title: {
        en: 'Healthcare & Life Sciences | Connected Care & FHIR Interoperability',
        ar: 'الرعاية الصحية وعلوم الحياة | الرعاية المتصلة وتكامل الأنظمة الطبية',
      },
      description: {
        en: 'Build HIPAA-compliant telehealth platforms, FHIR R4 clinical data hubs, and AI diagnostic workflows with Persici.',
        ar: 'بناء منصات الطب الاتصالي المتوافقة مع المعايير الطبية، ومراكز بيانات FHIR، وأنظمة الذكاء الاصطناعي السريري مع بيرسيشي.',
      },
    },
    realities: {
      enabled: true,
      badge: { en: 'Market Realities', ar: 'واقع السوق والتحديات' },
      title: {
        en: 'The realities of healthcare and life sciences',
        ar: 'واقع قطاع الرعاية الصحية وعلوم الحياة',
      },
      subtitle: {
        en: 'Healthcare systems are navigating disconnected clinical architectures, clinician cognitive overload, and strict sovereign privacy mandates while striving to deliver continuous, patient-centric care.',
        ar: 'تواجه مؤسسات الرعاية الصحية تشتتاً في السجلات السريرية وإجهاداً متزايداً للكوادر الطبية، بينما تتطلب سلامة المرضى وخصوصيتهم امتثالاً لا يقبل التهاون.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Validated Clinical Impact & Healthcare Scalability',
        ar: 'أثر سريري ملموس وأنظمة رعاية صحية رقمية موثوقة',
      },
      subtitle: {
        en: 'Explore how our telehealth, FHIR interoperability, and clinical AI platforms transform regional healthcare systems.',
        ar: 'اكتشف كيف ساهمت منصات بيرسيشي للطب الاتصالي والسجلات الطبية الموحدة في خدمة مئات الآلاف من المرضى.',
      },
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: healthData.clientStories.length || 3,
      selectedSlugs: healthData.clientStories
        .map((s) => String(s.slug || s.id || ''))
        .filter(Boolean),
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'Healthcare & Life Sciences Insights',
        ar: 'رؤى وأبحاث الرعاية الصحية',
      },
      subtitle: {
        en: 'Clinical whitepapers on FHIR R4 interoperability, ambient remote patient telemetry, and sovereign health clouds.',
        ar: 'أحدث التحليلات الميدانية حول معايير FHIR، والمتابعة الحيوية للأمراض المزمنة، والسحب الصحية السيادية.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  'energy-commodities': {
    rawData: energyCommoditiesData,
    seo: {
      title: {
        en: 'Energy & Commodities | Smart Grid Telemetry, ETRM & ESG Platforms',
        ar: 'الطاقة والسلع | الشبكات الذكية وأنظمة تداول الطاقة والاستدامة',
      },
      description: {
        en: 'Engineer industrial IoT & SCADA telemetry pipelines, ETRM commodity trading platforms, and automated Scope 1-3 ESG carbon ledgers with Persici.',
        ar: 'هندسة منصات مراقبة الحقول والشبكات الذكية، وأنظمة تداول السلع والطاقة، ومنصات تتبع الانبعاثات والاستدامة البيئية مع بيرسيشي.',
      },
    },
    realities: {
      enabled: true,
      badge: { en: 'Market Realities', ar: 'واقع السوق والتحديات' },
      title: {
        en: 'The realities of energy and commodities',
        ar: 'واقع قطاع الطاقة وتجارة السلع',
      },
      subtitle: {
        en: 'Energy and commodities companies are navigating volatile markets, decarbonization goals and complex supply chains while relying on legacy systems that limit visibility, speed and operational resilience.',
        ar: 'تواجه شركات الطاقة وتجارة السلع أسواقاً متقلبة، وأهداف إزالة الكربون، وسلاسل توريد معقدة، بينما تعتمد على أنظمة قديمة تحد من الرؤية والسرعة والمرونة التشغيلية.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Mission-Critical Energy & Industrial Resilience',
        ar: 'بنية تحتية مرنة وعمليات تداول طاقة عالية الموثوقية',
      },
      subtitle: {
        en: 'Explore how our SCADA telemetry, quantitative trading hubs, and IoT predictive platforms transform energy enterprises.',
        ar: 'اكتشف كيف ساهمت معماريات بيرسيشي في استقرار شبكات الكهرباء وحماية هوامش تجارة السلع الإقليمية.',
      },
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: energyCommoditiesData.clientStories.length || 3,
      selectedSlugs: energyCommoditiesData.clientStories
        .map((s) => String(s.slug || s.id || ''))
        .filter(Boolean),
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'Energy & Commodities Insights',
        ar: 'رؤى وأبحاث الطاقة وتجارة السلع',
      },
      subtitle: {
        en: 'Technical playbooks on renewable integration, quantitative trading risk models, and Scope 1-3 carbon tracking.',
        ar: 'أحدث التحليلات الميدانية حول استقرار الشبكات الذكية، وتجارة السلع بالأقمار الصناعية، وإزالة الكربون.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
};

export function getDefaultIndustryFeatureCmsData(
  featureSlug: IndustryFeatureSlug | string
): IndustryFeatureCmsData {
  const canonical =
    extractIndustryFeatureSlug(featureSlug) ||
    (INDUSTRY_FEATURE_SLUGS.includes(featureSlug as IndustryFeatureSlug)
      ? (featureSlug as IndustryFeatureSlug)
      : 'consumer-products');
  const preset = INDUSTRY_FEATURE_PRESETS[canonical] || INDUSTRY_FEATURE_PRESETS['consumer-products'];
  const raw = preset.rawData;

  return {
    page: `industries-${canonical}`,
    slug: canonical,
    seo: preset.seo,
    hero: {
      enabled: true,
      ...raw.hero,
    },
    realities: {
      enabled: true,
      ...preset.realities,
    },
    futureStrip: raw.futureStrip,
    agileFoundation: {
      enabled: true,
      sectionBadge: {
        en: 'Architectural Blueprint',
        ar: 'المخطط المعماري المتكامل',
      },
      ...raw.agileFoundation,
    },
    offeringsEnabled: true,
    offeringsBadge: preset.offeringsBadge,
    offeringsTitle: raw.offeringsTitle,
    offeringsSubtitle: raw.offeringsSubtitle,
    offerings: raw.offerings,
    whyItMatters: {
      enabled: true,
      ...raw.whyItMatters,
    },
    benefitsStrip: {
      enabled: true,
      ...raw.benefitsStrip,
    },
    verticalsEnabled: true,
    verticalsBadge: preset.verticalsBadge,
    verticalsTitle: raw.verticalsTitle,
    verticalsSubtitle: raw.verticalsSubtitle,
    verticals: raw.verticals,
    techStackEnabled: true,
    techStackBadge: preset.techStackBadge,
    techStackTitle: raw.techStackTitle,
    techStackSubtitle: raw.techStackSubtitle,
    techStackPods: raw.techStackPods,
    clientStoriesConfig: preset.clientStoriesConfig,
    clientStories: raw.clientStories,
    delivery: {
      enabled: true,
      badge: { en: 'Execution Framework', ar: 'إطار العمل التنفيذي' },
      ...raw.delivery,
    },
    insightsConfig: preset.insightsConfig,
    insights: raw.insights,
    clientReview: {
      enabled: true,
      ...raw.clientReview,
    },
    faqsEnabled: true,
    faqsTitle: raw.faqsTitle,
    faqsSubtitle: raw.faqsSubtitle,
    faqs: raw.faqs,
    contactEnabled: true,
  };
}

function pickBi(
  custom: { en?: string; ar?: string } | undefined | null,
  fallback?: { en?: string; ar?: string } | null,
  allowEmpty = false
): LocalizedString {
  const fbEn = fallback?.en || '';
  const fbAr = fallback?.ar || '';
  if (!custom || typeof custom !== 'object') {
    return { en: fbEn, ar: fbAr };
  }
  const enVal =
    typeof custom.en === 'string' && (allowEmpty || custom.en.trim().length > 0)
      ? custom.en
      : fbEn;
  const arVal =
    typeof custom.ar === 'string' && (allowEmpty || custom.ar.trim().length > 0)
      ? custom.ar
      : fbAr;
  return { en: enVal, ar: arVal };
}

function pickStr(custom: unknown, fallback?: string | null): string {
  if (typeof custom === 'string' && custom.trim().length > 0) return custom.trim();
  return typeof fallback === 'string' ? fallback : '';
}

/**
 * Normalizes the main Industries Overview Hub (`page: 'industries'`) data so 100% of existing
 * static data is preserved and pre-populated in both the public page and dashboard editor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeIndustriesHubPageData(raw?: Record<string, any> | null): IndustriesHubCmsData {
  const src = raw && typeof raw === 'object' ? raw : {};
  const def = defaultIndustriesHubCmsData;

  const rawOfferings =
    Array.isArray(src.offeringsList) && src.offeringsList.length > 0
      ? src.offeringsList
      : industriesOfferingsList;

  const normalizedOfferings: IndustryOfferingItem[] = rawOfferings.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: Record<string, any>, idx: number) => {
      const fb =
        industriesOfferingsList.find((o) => o.slug === item?.slug) ||
        industriesOfferingsList[idx] ||
        industriesOfferingsList[0];
      return {
        ...fb,
        ...item,
        slug: pickStr(item?.slug, fb.slug),
        title: pickBi(item?.title, fb.title),
        description: pickBi(item?.description, fb.description),
        tag: pickBi(item?.tag, fb.tag),
        diagramType: (item?.diagramType || fb.diagramType) as SolutionDiagramType,
        icon: pickStr(item?.icon, fb.icon || ''),
        href: pickStr(item?.href, fb.href),
        order: typeof item?.order === 'number' ? item.order : fb.order || idx + 1,
      };
    }
  );

  const rawBenefits =
    Array.isArray(src.benefits) && src.benefits.length > 0 ? src.benefits : def.benefits;

  const normalizedBenefits: SolutionBenefitItem[] = rawBenefits.slice(0, 3).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (b: Record<string, any>, idx: number) => {
      const fb = def.benefits[idx] || def.benefits[0];
      return {
        title: pickBi(b?.title, fb.title),
        description: pickBi(b?.description, fb.description),
        accentColor: pickStr(b?.accentColor, fb.accentColor || '#D83427'),
      };
    }
  );

  const rawPillars =
    Array.isArray(src.deliveryPillars) && src.deliveryPillars.length > 0
      ? src.deliveryPillars
      : def.deliveryPillars;

  const normalizedPillars: SolutionExecutionPillar[] = rawPillars.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: Record<string, any>, idx: number) => {
      const fb = def.deliveryPillars[idx] || def.deliveryPillars[0];
      return {
        title: pickBi(p?.title, fb.title),
        description: pickBi(p?.description, fb.description),
      };
    }
  );

  const rawFaqs = Array.isArray(src.faqs) && src.faqs.length > 0 ? src.faqs : def.faqs;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizedFaqs: SolutionFaqItem[] = rawFaqs.map((f: Record<string, any>, idx: number) => {
    const fb = def.faqs[idx] || def.faqs[0];
    return {
      question: pickBi(f?.question, fb.question),
      answer: pickBi(f?.answer, fb.answer),
    };
  });

  const csCfg = src.clientStoriesConfig || {};
  const insCfg = src.insightsConfig || {};

  return {
    ...def,
    ...src,
    page: 'industries',
    seo: {
      title: pickBi(
        src.seo?.title,
        def.seo?.title || {
          en: 'Industries | Domain-Specialized Digital Transformation',
          ar: 'القطاعات | التحول الرقمي المتخصص حسب القطاع',
        }
      ),
      description: pickBi(
        src.seo?.description,
        def.seo?.description || {
          en: 'Explore how Persici delivers domain-specialized software engineering, digital commerce, and AI transformation across Consumer Products, TMT, Public Sector, Retail, Healthcare, and Energy.',
          ar: 'اكتشف كيف تقدم بيرسيشي حلول هندسة البرمجيات والتجارة الرقمية والذكاء الاصطناعي المتخصصة لقطاعات المنتجات الاستهلاكية، والاتصالات، والقطاع الحكومي، والتجزئة، والصحة، والطاقة.',
        }
      ),
    },
    heroEnabled: src.heroEnabled !== false,
    heroBadge: pickBi(src.heroBadge, def.heroBadge),
    heroTitle: pickBi(src.heroTitle, def.heroTitle),
    heroSubtitle: pickBi(src.heroSubtitle, def.heroSubtitle),
    heroCtaPrimary: pickBi(src.heroCtaPrimary, def.heroCtaPrimary),
    heroCtaSecondary: pickBi(src.heroCtaSecondary, def.heroCtaSecondary),
    heroCtaHref: pickStr(src.heroCtaHref, def.heroCtaHref || '#industries-grid'),
    heroImage: pickStr(src.heroImage, def.heroImage),
    offeringsEnabled: src.offeringsEnabled !== false,
    offeringsBadge: pickBi(
      src.offeringsBadge,
      def.offeringsBadge || { en: 'Target Industries', ar: 'القطاعات المتخصصة' }
    ),
    offeringsTitle: pickBi(src.offeringsTitle, def.offeringsTitle),
    offeringsSubtitle: pickBi(src.offeringsSubtitle, def.offeringsSubtitle),
    offeringsList: normalizedOfferings,
    whyItMattersEnabled: src.whyItMattersEnabled !== false,
    whyItMattersTitle: pickBi(src.whyItMattersTitle, def.whyItMattersTitle),
    whyItMattersText: pickBi(src.whyItMattersText, def.whyItMattersText),
    whyItMattersImage: pickStr(src.whyItMattersImage, def.whyItMattersImage),
    whyItMattersMetric1Val: pickStr(src.whyItMattersMetric1Val, def.whyItMattersMetric1Val || '3.4x'),
    whyItMattersMetric1Label: pickBi(
      src.whyItMattersMetric1Label,
      def.whyItMattersMetric1Label || { en: 'Average Revenue Velocity', ar: 'تسارع وتيرة الإيرادات' }
    ),
    whyItMattersMetric2Val: pickStr(src.whyItMattersMetric2Val, def.whyItMattersMetric2Val || '-38%'),
    whyItMattersMetric2Label: pickBi(
      src.whyItMattersMetric2Label,
      def.whyItMattersMetric2Label || { en: 'Customer Acquisition Cost', ar: 'انخفاض تكلفة الاستحواذ' }
    ),
    benefitsEnabled: src.benefitsEnabled !== false,
    benefitsTitle: pickBi(src.benefitsTitle, def.benefitsTitle),
    benefitsImage: pickStr(src.benefitsImage, def.benefitsImage),
    benefits: normalizedBenefits,
    clientStoriesConfig: {
      enabled: csCfg.enabled !== false,
      badge: pickBi(csCfg.badge, def.clientStoriesConfig.badge, true),
      title: pickBi(csCfg.title, def.clientStoriesConfig.title, true),
      subtitle: pickBi(csCfg.subtitle, def.clientStoriesConfig.subtitle, true),
      selectionMode:
        csCfg.selectionMode === 'featured' ||
        csCfg.selectionMode === 'category' ||
        csCfg.selectionMode === 'custom'
          ? csCfg.selectionMode
          : def.clientStoriesConfig.selectionMode,
      categorySlug: pickStr(csCfg.categorySlug, def.clientStoriesConfig.categorySlug),
      maxCount:
        typeof csCfg.maxCount === 'number' && csCfg.maxCount >= 1
          ? csCfg.maxCount
          : def.clientStoriesConfig.maxCount,
      selectedSlugs:
        Array.isArray(csCfg.selectedSlugs) && csCfg.selectedSlugs.length > 0
          ? csCfg.selectedSlugs.map(String)
          : def.clientStoriesConfig.selectedSlugs,
    },
    spotlightStories:
      Array.isArray(src.spotlightStories) && src.spotlightStories.length > 0
        ? src.spotlightStories
        : def.spotlightStories,
    deliveryEnabled: src.deliveryEnabled !== false,
    deliveryBadge: pickBi(
      src.deliveryBadge,
      def.deliveryBadge || { en: 'Execution Framework', ar: 'إطار العمل التنفيذي' }
    ),
    deliveryTitle: pickBi(src.deliveryTitle, def.deliveryTitle),
    deliverySubtitle: pickBi(src.deliverySubtitle, def.deliverySubtitle),
    deliveryImage: pickStr(src.deliveryImage, def.deliveryImage),
    deliveryPillars: normalizedPillars,
    insightsConfig: {
      enabled: insCfg.enabled !== false,
      title: pickBi(insCfg.title || src.insightsTitle, def.insightsConfig.title),
      subtitle: pickBi(insCfg.subtitle || src.insightsSubtitle, def.insightsConfig.subtitle),
      ctaText: pickBi(insCfg.ctaText || src.insightsCtaText, def.insightsConfig.ctaText),
      ctaHref: pickStr(insCfg.ctaHref, def.insightsConfig.ctaHref),
      selectionMode:
        insCfg.selectionMode === 'featured' ||
        insCfg.selectionMode === 'category' ||
        insCfg.selectionMode === 'custom'
          ? insCfg.selectionMode
          : def.insightsConfig.selectionMode,
      categorySlug: pickStr(insCfg.categorySlug, def.insightsConfig.categorySlug),
      maxCount:
        typeof insCfg.maxCount === 'number' && insCfg.maxCount >= 1
          ? insCfg.maxCount
          : def.insightsConfig.maxCount,
      selectedSlugs: Array.isArray(insCfg.selectedSlugs)
        ? insCfg.selectedSlugs.map(String)
        : def.insightsConfig.selectedSlugs,
    },
    insightsTitle: pickBi(src.insightsTitle || insCfg.title, def.insightsConfig.title),
    insightsSubtitle: pickBi(src.insightsSubtitle || insCfg.subtitle, def.insightsConfig.subtitle),
    insightsCtaText: pickBi(src.insightsCtaText || insCfg.ctaText, def.insightsConfig.ctaText),
    insightsList:
      Array.isArray(src.insightsList) && src.insightsList.length > 0
        ? src.insightsList
        : def.insightsList,
    quoteEnabled: src.quoteEnabled !== false,
    quoteBadge: pickBi(
      src.quoteBadge,
      def.quoteBadge || { en: 'Verified Enterprise Partner', ar: 'شريك مؤسسي معتمد' }
    ),
    quoteText: pickBi(src.quoteText, def.quoteText),
    quoteAuthor: pickStr(src.quoteAuthor, def.quoteAuthor),
    quoteRole: pickBi(src.quoteRole, def.quoteRole),
    quoteAvatar: typeof src.quoteAvatar === 'string' ? src.quoteAvatar : '',
    faqsEnabled: src.faqsEnabled !== false,
    faqsTitle: pickBi(src.faqsTitle, def.faqsTitle),
    faqsSubtitle: pickBi(src.faqsSubtitle, def.faqsSubtitle),
    faqs: normalizedFaqs,
    contactEnabled: src.contactEnabled !== false,
  };
}

/**
 * Normalizes any of the 6 Featured Industry Pages (`industries-<slug>`) against its canonical
 * static dataset so zero content is ever lost or altered unless explicitly edited.
 */
export function normalizeIndustryFeaturePageData(
  slugOrPage: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw?: Record<string, any> | null
): IndustryFeatureCmsData {
  const featureSlug = extractIndustryFeatureSlug(slugOrPage) || 'consumer-products';
  const def = getDefaultIndustryFeatureCmsData(featureSlug);
  const src = raw && typeof raw === 'object' ? raw : {};

  const rawFutureStrip =
    Array.isArray(src.futureStrip) && src.futureStrip.length > 0
      ? src.futureStrip
      : def.futureStrip;

  const normalizedFutureStrip: IndustryFutureTrendItem[] = rawFutureStrip.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: Record<string, any>, idx: number) => {
      const fb = def.futureStrip[idx] || def.futureStrip[0];
      return {
        ...fb,
        ...item,
        title: pickBi(item?.title, fb.title),
        description: pickBi(item?.description, fb.description),
        badge: pickBi(item?.badge, fb.badge),
        image: pickStr(item?.image, fb.image),
        ...(item?.href || fb.href ? { href: pickStr(item?.href, fb.href || '') } : {}),
      };
    }
  );

  const rawAf = src.agileFoundation || {};
  const fbAf = def.agileFoundation;

  const normalizedAgileFoundation: IndustryAgileFoundationSectionConfig = {
    enabled: rawAf.enabled !== false,
    sectionBadge: pickBi(
      rawAf.sectionBadge,
      fbAf.sectionBadge || { en: 'Architectural Blueprint', ar: 'الأساس المعماري الرشيق' }
    ),
    title: pickBi(rawAf.title, fbAf.title),
    subtitle: pickBi(rawAf.subtitle, fbAf.subtitle),
    diagramBadge: pickBi(rawAf.diagramBadge, fbAf.diagramBadge),
    pillars:
      Array.isArray(rawAf.pillars) && rawAf.pillars.length > 0
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rawAf.pillars.map((pl: Record<string, any>, idx: number) => {
            const fbPl = fbAf.pillars[idx] || fbAf.pillars[0];
            return {
              number: pickStr(pl?.number, fbPl.number || String(idx + 1).padStart(2, '0')),
              title: pickBi(pl?.title, fbPl.title),
              diagramTitle: pickBi(
                pl?.diagramTitle,
                fbPl.diagramTitle || fbPl.title
              ),
              description: pickBi(pl?.description, fbPl.description),
            };
          })
        : fbAf.pillars,
  };

  const rawOfferings =
    Array.isArray(src.offerings) && src.offerings.length > 0 ? src.offerings : def.offerings;

  const normalizedOfferings: IndustryFeatureOfferingItem[] = rawOfferings.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: Record<string, any>, idx: number) => {
      const fb =
        def.offerings.find((o) => o.slug === item?.slug) ||
        def.offerings[idx] ||
        def.offerings[0];
      return {
        ...fb,
        ...item,
        slug: pickStr(item?.slug, fb.slug),
        tag: pickBi(item?.tag, fb.tag),
        title: pickBi(item?.title, fb.title),
        description: pickBi(item?.description, fb.description),
        icon: pickStr(item?.icon, fb.icon),
        diagramType: (item?.diagramType || fb.diagramType) as SolutionDiagramType,
        highlights: {
          en:
            Array.isArray(item?.highlights?.en) && item.highlights.en.length > 0
              ? item.highlights.en.map(String)
              : fb.highlights.en,
          ar:
            Array.isArray(item?.highlights?.ar) && item.highlights.ar.length > 0
              ? item.highlights.ar.map(String)
              : fb.highlights.ar,
        },
      };
    }
  );

  const rawBenefits =
    Array.isArray(src.benefitsStrip?.benefits) && src.benefitsStrip.benefits.length > 0
      ? src.benefitsStrip.benefits
      : def.benefitsStrip.benefits;

  const normalizedBenefits: SolutionBenefitItem[] = rawBenefits.slice(0, 3).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (b: Record<string, any>, idx: number) => {
      const fb = def.benefitsStrip.benefits[idx] || def.benefitsStrip.benefits[0];
      return {
        title: pickBi(b?.title, fb.title),
        description: pickBi(b?.description, fb.description),
        accentColor: pickStr(b?.accentColor, fb.accentColor || '#D83427'),
      };
    }
  );

  const rawVerticals =
    Array.isArray(src.verticals) && src.verticals.length > 0 ? src.verticals : def.verticals;

  const normalizedVerticals: IndustryFeatureVerticalItem[] = rawVerticals.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: Record<string, any>, idx: number) => {
      const fb =
        def.verticals.find((item) => item.id === v?.id) ||
        def.verticals[idx] ||
        def.verticals[0];
      return {
        ...fb,
        ...v,
        id: pickStr(v?.id, fb.id),
        number: pickStr(v?.number, fb.number || String(idx + 1).padStart(2, '0')),
        title: pickBi(v?.title, fb.title),
        description: pickBi(v?.description, fb.description),
        tag: pickBi(v?.tag, fb.tag),
        ...(fb.iconName || v?.iconName
          ? { iconName: pickStr(v?.iconName, fb.iconName || '') }
          : {}),
        capabilities: {
          en:
            Array.isArray(v?.capabilities?.en) && v.capabilities.en.length > 0
              ? v.capabilities.en.map(String)
              : fb.capabilities.en,
          ar:
            Array.isArray(v?.capabilities?.ar) && v.capabilities.ar.length > 0
              ? v.capabilities.ar.map(String)
              : fb.capabilities.ar,
        },
      };
    }
  );

  const rawPods =
    Array.isArray(src.techStackPods) && src.techStackPods.length > 0
      ? src.techStackPods
      : def.techStackPods;

  const normalizedPods: IndustryTechStackPod[] = rawPods.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pod: Record<string, any>, idx: number) => {
      const fb = def.techStackPods[idx] || def.techStackPods[0];
      return {
        title: pickBi(pod?.title, fb.title),
        badge: pickBi(pod?.badge, fb.badge),
        description: pickBi(pod?.description, fb.description),
        technologies:
          Array.isArray(pod?.technologies) && pod.technologies.length > 0
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pod.technologies.map((t: Record<string, any>, tIdx: number) => {
                const fbTech = fb.technologies[tIdx] || fb.technologies[0] || {
                  name: '',
                  category: '',
                };
                return {
                  name: pickStr(t?.name, fbTech.name),
                  category: pickStr(t?.category, fbTech.category),
                  ...(t?.badge || fbTech.badge
                    ? { badge: pickStr(t?.badge, fbTech.badge || '') }
                    : {}),
                };
              })
            : fb.technologies,
      };
    }
  );

  const rawPillars =
    Array.isArray(src.delivery?.pillars) && src.delivery.pillars.length > 0
      ? src.delivery.pillars
      : def.delivery.pillars;

  const normalizedPillars: SolutionExecutionPillar[] = rawPillars.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: Record<string, any>, idx: number) => {
      const fb = def.delivery.pillars[idx] || def.delivery.pillars[0];
      return {
        title: pickBi(p?.title, fb.title),
        description: pickBi(p?.description, fb.description),
      };
    }
  );

  const rawFaqs = Array.isArray(src.faqs) && src.faqs.length > 0 ? src.faqs : def.faqs;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizedFaqs: SolutionFaqItem[] = rawFaqs.map((f: Record<string, any>, idx: number) => {
    const fb = def.faqs[idx] || def.faqs[0];
    return {
      question: pickBi(f?.question, fb.question),
      answer: pickBi(f?.answer, fb.answer),
    };
  });

  const csCfg = src.clientStoriesConfig || {};
  const insCfg = src.insightsConfig || {};

  return {
    ...def,
    ...src,
    page: `industries-${featureSlug}`,
    slug: featureSlug,
    seo: {
      title: pickBi(src.seo?.title, def.seo.title),
      description: pickBi(src.seo?.description, def.seo.description),
    },
    hero: {
      enabled: src.hero?.enabled !== false,
      tag: pickBi(src.hero?.tag, def.hero.tag),
      secondaryTag: pickBi(src.hero?.secondaryTag, def.hero.secondaryTag),
      title: pickBi(src.hero?.title, def.hero.title),
      subtitle: pickBi(src.hero?.subtitle, def.hero.subtitle),
      ctaText: pickBi(src.hero?.ctaText, def.hero.ctaText),
      ctaHref: pickStr(src.hero?.ctaHref, def.hero.ctaHref),
      image: pickStr(src.hero?.image, def.hero.image),
      highlights:
        Array.isArray(src.hero?.highlights) && src.hero.highlights.length > 0
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            src.hero.highlights.map((h: Record<string, any>, idx: number) =>
              pickBi(h, def.hero.highlights[idx] || def.hero.highlights[0] || { en: '', ar: '' })
            )
          : def.hero.highlights,
    },
    realities: {
      enabled: src.realities?.enabled !== false,
      badge: pickBi(
        src.realities?.badge,
        def.realities.badge || { en: 'Market Realities', ar: 'واقع السوق والتحديات' }
      ),
      title: pickBi(src.realities?.title, def.realities.title),
      subtitle: pickBi(src.realities?.subtitle, def.realities.subtitle),
    },
    futureStrip: normalizedFutureStrip,
    agileFoundation: normalizedAgileFoundation,
    offeringsEnabled: src.offeringsEnabled !== false,
    offeringsBadge: pickBi(src.offeringsBadge, def.offeringsBadge),
    offeringsTitle: pickBi(src.offeringsTitle, def.offeringsTitle),
    offeringsSubtitle: pickBi(src.offeringsSubtitle, def.offeringsSubtitle),
    offerings: normalizedOfferings,
    whyItMatters: {
      enabled: src.whyItMatters?.enabled !== false,
      title: pickBi(src.whyItMatters?.title, def.whyItMatters.title),
      text: pickBi(src.whyItMatters?.text, def.whyItMatters.text),
      image: pickStr(src.whyItMatters?.image, def.whyItMatters.image),
      metric1Val: pickStr(src.whyItMatters?.metric1Val, def.whyItMatters.metric1Val),
      metric1Label: pickBi(src.whyItMatters?.metric1Label, def.whyItMatters.metric1Label),
      metric2Val: pickStr(src.whyItMatters?.metric2Val, def.whyItMatters.metric2Val),
      metric2Label: pickBi(src.whyItMatters?.metric2Label, def.whyItMatters.metric2Label),
    },
    benefitsStrip: {
      enabled: src.benefitsStrip?.enabled !== false,
      title: pickBi(src.benefitsStrip?.title, def.benefitsStrip.title),
      image: pickStr(src.benefitsStrip?.image, def.benefitsStrip.image),
      benefits: normalizedBenefits,
    },
    verticalsEnabled: src.verticalsEnabled !== false,
    verticalsBadge: pickBi(src.verticalsBadge, def.verticalsBadge),
    verticalsTitle: pickBi(src.verticalsTitle, def.verticalsTitle),
    verticalsSubtitle: pickBi(src.verticalsSubtitle, def.verticalsSubtitle),
    verticals: normalizedVerticals,
    techStackEnabled: src.techStackEnabled !== false,
    techStackBadge: pickBi(src.techStackBadge, def.techStackBadge),
    techStackTitle: pickBi(src.techStackTitle, def.techStackTitle),
    techStackSubtitle: pickBi(src.techStackSubtitle, def.techStackSubtitle),
    techStackPods: normalizedPods,
    clientStoriesConfig: {
      enabled: csCfg.enabled !== false,
      badge: pickBi(csCfg.badge, def.clientStoriesConfig.badge),
      title: pickBi(csCfg.title, def.clientStoriesConfig.title),
      subtitle: pickBi(csCfg.subtitle, def.clientStoriesConfig.subtitle),
      selectionMode:
        csCfg.selectionMode === 'featured' ||
        csCfg.selectionMode === 'category' ||
        csCfg.selectionMode === 'custom'
          ? csCfg.selectionMode
          : def.clientStoriesConfig.selectionMode,
      categorySlug: pickStr(csCfg.categorySlug, def.clientStoriesConfig.categorySlug),
      maxCount:
        typeof csCfg.maxCount === 'number' && csCfg.maxCount >= 1
          ? csCfg.maxCount
          : def.clientStoriesConfig.maxCount,
      selectedSlugs:
        Array.isArray(csCfg.selectedSlugs) && csCfg.selectedSlugs.length > 0
          ? csCfg.selectedSlugs.map(String)
          : def.clientStoriesConfig.selectedSlugs,
    },
    clientStories:
      Array.isArray(src.clientStories) && src.clientStories.length > 0
        ? src.clientStories
        : def.clientStories,
    delivery: {
      enabled: src.delivery?.enabled !== false,
      badge: pickBi(src.delivery?.badge, def.delivery.badge),
      title: pickBi(src.delivery?.title, def.delivery.title),
      subtitle: pickBi(src.delivery?.subtitle, def.delivery.subtitle),
      image: pickStr(src.delivery?.image, def.delivery.image),
      pillars: normalizedPillars,
    },
    insightsConfig: {
      enabled: insCfg.enabled !== false,
      title: pickBi(insCfg.title, def.insightsConfig.title),
      subtitle: pickBi(insCfg.subtitle, def.insightsConfig.subtitle),
      ctaText: pickBi(insCfg.ctaText, def.insightsConfig.ctaText),
      ctaHref: pickStr(insCfg.ctaHref, def.insightsConfig.ctaHref),
      selectionMode:
        insCfg.selectionMode === 'featured' ||
        insCfg.selectionMode === 'category' ||
        insCfg.selectionMode === 'custom'
          ? insCfg.selectionMode
          : def.insightsConfig.selectionMode,
      categorySlug: pickStr(insCfg.categorySlug, def.insightsConfig.categorySlug),
      maxCount:
        typeof insCfg.maxCount === 'number' && insCfg.maxCount >= 1
          ? insCfg.maxCount
          : def.insightsConfig.maxCount,
      selectedSlugs: Array.isArray(insCfg.selectedSlugs)
        ? insCfg.selectedSlugs.map(String)
        : def.insightsConfig.selectedSlugs,
    },
    insights:
      Array.isArray(src.insights) && src.insights.length > 0 ? src.insights : def.insights,
    clientReview: {
      enabled: src.clientReview?.enabled !== false,
      quote: pickBi(src.clientReview?.quote, def.clientReview.quote),
      author: pickStr(src.clientReview?.author, def.clientReview.author),
      role: pickBi(src.clientReview?.role, def.clientReview.role),
      badge: pickBi(src.clientReview?.badge, def.clientReview.badge),
      ...(src.clientReview?.avatar ? { avatar: String(src.clientReview.avatar) } : {}),
    },
    faqsEnabled: src.faqsEnabled !== false,
    faqsTitle: pickBi(src.faqsTitle, def.faqsTitle),
    faqsSubtitle: pickBi(src.faqsSubtitle, def.faqsSubtitle),
    faqs: normalizedFaqs,
    contactEnabled: src.contactEnabled !== false,
  };
}
