import type {
  LocalizedString,
  SolutionDiagramType,
  SolutionOfferingItem,
  SolutionBenefitItem,
  SolutionExecutionPillar,
  SolutionFaqItem,
  FeaturedClientStoryItem,
  SolutionsPageContent,
} from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { solutionsPageContent, solutionsOfferingsList } from '@shared/data';
import { applicationManagementData } from '../../[slug]/_application-management/data/application-management.data';
import { marketingCommunicationsData } from '../../[slug]/_marketing-communications/data/marketing-communications.data';
import {
  ecommerceGrowthData,
  type EcommercePartnerItem,
} from '../../[slug]/_ecommerce-growth/data/ecommerce-growth.data';
import { aiIntegrationData } from '../../[slug]/_ai-integration/data/ai-integration.data';
import { uxProductDesignData } from '../../[slug]/_ux-product-design/data/ux-product-design.data';
import { customerEngagementData } from '../../[slug]/_customer-engagement/data/customer-engagement.data';
import { digitalEngineeringData } from '../../[slug]/_digital-engineering/data/digital-engineering.data';
import { supplyChainData } from '../../[slug]/_supply-chain/data/supply-chain.data';
import { crmManagementData } from '../../[slug]/_crm-management/data/crm-management.data';

export type SolutionDynamicSelectionMode = 'custom' | 'featured' | 'category';

export interface SolutionClientStoriesSectionConfig {
  enabled: boolean;
  badge: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
  selectionMode: SolutionDynamicSelectionMode;
  categorySlug: string;
  maxCount: number;
  selectedSlugs: string[];
}

export interface SolutionInsightsSectionConfig {
  enabled: boolean;
  title: LocalizedString;
  subtitle: LocalizedString;
  ctaText: LocalizedString;
  ctaHref: string;
  selectionMode: SolutionDynamicSelectionMode;
  categorySlug: string;
  maxCount: number;
  selectedSlugs: string[];
}

export interface SolutionFeatureOfferingItem {
  slug: string;
  tag: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface SolutionFeatureVerticalItem {
  id: string;
  number: string;
  title: LocalizedString;
  description: LocalizedString;
  tag: LocalizedString;
  iconName?: string;
  capabilities: { en: string[]; ar: string[] };
}

export interface SolutionTechStackPod {
  title: LocalizedString;
  badge: LocalizedString;
  description: LocalizedString;
  technologies: { name: string; category: string; badge?: string }[];
}

export interface SolutionPartnerShowcaseSection {
  enabled?: boolean;
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  partnersHeading?: LocalizedString;
  video: {
    src: string;
    poster?: string;
    title: LocalizedString;
    caption: LocalizedString;
    partnerBadge: LocalizedString;
  };
  partners: EcommercePartnerItem[];
}

export interface SolutionFeatureCmsData {
  page: string; // e.g. 'solutions-application-management'
  slug: string; // e.g. 'application-management'
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
  partnerShowcase?: SolutionPartnerShowcaseSection;
  offeringsEnabled?: boolean;
  offeringsBadge: LocalizedString;
  offeringsTitle: LocalizedString;
  offeringsSubtitle: LocalizedString;
  offerings: SolutionFeatureOfferingItem[];
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
  verticals: SolutionFeatureVerticalItem[];
  techStackEnabled?: boolean;
  techStackBadge: LocalizedString;
  techStackTitle: LocalizedString;
  techStackSubtitle: LocalizedString;
  techStackPods: SolutionTechStackPod[];
  clientStoriesConfig: SolutionClientStoriesSectionConfig;
  clientStories: FeaturedClientStoryItem[];
  delivery: {
    enabled?: boolean;
    badge: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    image: string;
    pillars: SolutionExecutionPillar[];
  };
  insightsConfig: SolutionInsightsSectionConfig;
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

export interface SolutionsHubCmsData extends SolutionsPageContent {
  seo?: {
    title: LocalizedString;
    description: LocalizedString;
  };
  heroEnabled?: boolean;
  heroCtaHref?: string;
  offeringsEnabled?: boolean;
  whyItMattersEnabled?: boolean;
  whyItMattersMetric1Val?: string;
  whyItMattersMetric1Label?: LocalizedString;
  whyItMattersMetric2Val?: string;
  whyItMattersMetric2Label?: LocalizedString;
  benefitsEnabled?: boolean;
  clientStoriesConfig: SolutionClientStoriesSectionConfig;
  deliveryEnabled?: boolean;
  deliveryBadge?: LocalizedString;
  insightsConfig: SolutionInsightsSectionConfig;
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

export const SOLUTION_FEATURE_SLUGS = [
  'ai-integration',
  'application-management',
  'digital-engineering',
  'ux-and-product-design',
  'ecommerce-growth',
  'marketing-communications',
  'customer-engagement',
  'crm-management',
  'supply-chain',
] as const;

export type SolutionFeatureSlug = (typeof SOLUTION_FEATURE_SLUGS)[number];

export function isSolutionPageSlug(pageSlug: string): boolean {
  if (pageSlug === 'solutions') return true;
  if (pageSlug.startsWith('solutions-')) {
    const sub = pageSlug.replace(/^solutions-/, '');
    return (SOLUTION_FEATURE_SLUGS as readonly string[]).includes(sub);
  }
  return false;
}

export function extractSolutionFeatureSlug(pageSlug: string): SolutionFeatureSlug | null {
  const clean = pageSlug.startsWith('solutions-') ? pageSlug.replace(/^solutions-/, '') : pageSlug;
  if ((SOLUTION_FEATURE_SLUGS as readonly string[]).includes(clean)) {
    return clean as SolutionFeatureSlug;
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

export const defaultSolutionsHubCmsData: SolutionsHubCmsData = {
  ...solutionsPageContent,
  page: 'solutions',
  seo: {
    title: {
      en: 'Solutions | Enterprise Growth & Engineering',
      ar: 'الحلول | النمو والهندسة المؤسسية',
    },
    description: {
      en: 'Integrated software engineering, brand architecture, and digital growth ecosystems engineered by Persici for measurable business outcomes.',
      ar: 'حلول متكاملة في هندسة البرمجيات وبناء الهوية واستراتيجيات النمو الرقمي من بيرسيشي لتحقيق نتائج أعمال قابلة للقياس.',
    },
  },
  heroEnabled: true,
  heroCtaHref: '#offerings',
  offeringsEnabled: true,
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
      en: '',
      ar: '',
    },
    subtitle: {
      en: '',
      ar: '',
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
      en: 'Fresh perspectives on how teams can build, run and scale with AI.',
      ar: 'رؤى حديثة حول كيفية بناء الفرق لأعمالها وتشغيلها والتوسع عبر الذكاء الاصطناعي.',
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
    en: 'Fresh perspectives on how teams can build, run and scale with AI.',
    ar: 'رؤى حديثة حول كيفية بناء الفرق لأعمالها وتشغيلها والتوسع عبر الذكاء الاصطناعي.',
  },
  insightsCtaText: {
    en: 'Learn more',
    ar: 'اعرف المزيد',
  },
  insightsList: DEFAULT_HUB_INSIGHTS,
  quoteEnabled: true,
  quoteBadge: {
    en: 'What our clients say',
    ar: 'آراء العملاء',
  },
  quoteAvatar: '',
  faqsEnabled: true,
  contactEnabled: true,
};

interface FeaturePageMetaPreset {
  seo: { title: LocalizedString; description: LocalizedString };
  offeringsBadge: LocalizedString;
  verticalsBadge: LocalizedString;
  techStackBadge: LocalizedString;
  clientStoriesConfig: SolutionClientStoriesSectionConfig;
  insightsConfig: SolutionInsightsSectionConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawData: any;
}

const FEATURE_PAGE_PRESETS: Record<SolutionFeatureSlug, FeaturePageMetaPreset> = {
  'application-management': {
    rawData: applicationManagementData,
    seo: {
      title: { en: 'Application & Management', ar: 'التطبيقات والإدارة' },
      description: {
        en: 'End-to-end enterprise mobile application development, modern cross-platform engineering, and lifecycle management by Persici.',
        ar: 'خدمات تطوير وإدارة دورة حياة التطبيقات المؤسسية لمنصات iOS و Android والهجينة بواسطة فريق بيرسيشي.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'ركائز التطوير' },
    verticalsBadge: { en: 'Domain Architectures', ar: 'حلول القطاعات المتخصصة' },
    techStackBadge: { en: 'Technology Infrastructure', ar: 'الأدوات والبنية التحتية' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Case Studies', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Applications engineered for measurable enterprise impact',
        ar: 'تطبيقات صنعت فارقاً حقيقياً في السوق',
      },
      subtitle: {
        en: 'Explore how our high-velocity mobile engineering drives customer retention and commercial scale.',
        ar: 'اكتشف كيف ساهمت تطبيقات بيرسيشي في تسريع وتيرة النمو ومضاعفة الإيرادات لعملائنا.',
      },
      selectionMode: 'custom',
      categorySlug: 'software-and-apps',
      maxCount: 3,
      selectedSlugs: [
        'hala-food-mobile-app-development',
        'chopon-sourcing-engine-for-luxury-timepieces',
        'protes-sports-technical-restoration',
      ],
    },
    insightsConfig: {
      enabled: true,
      title: { en: 'Our Latest Thinking', ar: 'أحدث الرؤى والأفكار' },
      subtitle: {
        en: 'Architectural blueprints, technical deep dives, and product leadership perspectives.',
        ar: 'استكشف أحدث المقالات والتحليلات المعمارية في هندسة وتطوير التطبيقات.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  'marketing-communications': {
    rawData: marketingCommunicationsData,
    seo: {
      title: { en: 'Marketing & Communications', ar: 'التسويق والاتصال المؤسسي' },
      description: {
        en: 'Integrated full-funnel marketing, brand communications, creative storytelling, and data-driven media buying by Persici.',
        ar: 'استراتيجيات تسويق واتصال مؤسسي متكاملة، وسرد إبداعي، وإدارة حملات موجهة بالأداء والبيانات بواسطة بيرسيشي.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والصناعات' },
    techStackBadge: { en: 'Technology & Stack', ar: 'المنظومة التقنية' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Impactful work that resonates and drives measurable growth',
        ar: 'حملات صنعت فارقاً حقيقياً وأثراً تجارياً ملموساً',
      },
      subtitle: {
        en: 'Discover how we help ambitious brands cut through the market noise, build cultural resonance, and capture market share.',
        ar: 'اكتشف كيف ساهمت استراتيجيات بيرسيشي التسويقية في ترسيخ مكانة عملائنا ومضاعفة عوائدهم في السوق الخليجي.',
      },
      selectionMode: 'custom',
      categorySlug: 'marketing',
      maxCount: 4,
      selectedSlugs: [
        'khazan-crafting-alz-al-lahzat-a-campaign-for-memorable-moments',
        'meraas-the-beach-defining-a-contemporary-coastal-lifestyle',
        'hala-food-brand-identity-marketing-strategy',
        'lahfaa-perfumes-luxury-branding-bottle-design',
      ],
    },
    insightsConfig: {
      enabled: true,
      title: { en: 'Our Latest Thinking', ar: 'أحدث الرؤى والأفكار' },
      subtitle: {
        en: 'Explore our latest perspectives on cultural localization, omnichannel attribution, and creative growth.',
        ar: 'استكشف أحدث المقالات والتحليلات المعمارية في استراتيجيات التسويق والنمو الرقمي.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  'ecommerce-growth': {
    rawData: ecommerceGrowthData,
    seo: {
      title: { en: 'E-Commerce Growth', ar: 'النمو في التجارة الإلكترونية' },
      description: {
        en: 'Scalable digital commerce ecosystems, high-converting storefront architecture, full-funnel media acquisition, and compounding retention by Persici.',
        ar: 'منظومات تجارة رقمية قابلة للتوسع، وهندسة متاجر فائقة السرعة والتحويل، وإعلانات أداء واستبقاء العملاء بواسطة بيرسيشي.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Transformative E-Commerce Growth & Proven Scalability',
        ar: 'نتائج أعمال استثنائية ونمو متسارع في المبيعات',
      },
      subtitle: {
        en: 'See how our full-funnel commerce architecture scales top GCC and global retail brands.',
        ar: 'اكتشف كيف قادت استراتيجيات بيرسيشي كبرى المتاجر الخليجية إلى مضاعفة الإيرادات وهوامش الأرباح.',
      },
      selectionMode: 'custom',
      categorySlug: 'software-and-apps',
      maxCount: 4,
      selectedSlugs: [
        'lahfaa-perfumes-luxury-ecommerce-redesign',
        'chopon-sourcing-engine-for-luxury-timepieces',
        'protes-sports-technical-restoration',
        'land-of-exotics-sanctuary-landing-page',
      ],
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'Insights & Strategic Commerce Architecture',
        ar: 'رؤى وأفكار في التجارة الرقمية والنمو',
      },
      subtitle: {
        en: 'Tactical playbooks and cutting-edge perspectives on headless commerce, CRO, and compounding retention.',
        ar: 'أحدث الدراسات والتحليلات العملية لهندسة المتاجر، وتحسين معدلات التحويل، ومضاعفة ولاء العملاء.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  'ai-integration': {
    rawData: aiIntegrationData,
    seo: {
      title: { en: 'AI Integration & Automation', ar: 'دمج الذكاء الاصطناعي والأتمتة' },
      description: {
        en: 'Enterprise generative AI integration, autonomous agentic workflows, sovereign RAG architectures, and predictive intelligence by Persici.',
        ar: 'حلول الذكاء الاصطناعي المؤسسية، والوكلاء الأذكياء المستقلون، ومحركات استرجاع المعرفة السيادية (RAG) بواسطة بيرسيشي.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Proven Enterprise Impact & Sovereign AI Scalability',
        ar: 'أثر تشغيلي استثنائي ونماذج ذكاء اصطناعي سيادية',
      },
      subtitle: {
        en: 'See how our sovereign AI and RAG architectures automate knowledge operations for leading enterprises.',
        ar: 'اكتشف كيف ساهمت معماريات الذكاء الاصطناعي من بيرسيشي في تسريع أداء المؤسسات والشركات الخليجية الكبرى.',
      },
      selectionMode: 'custom',
      categorySlug: 'software-and-apps',
      maxCount: 3,
      selectedSlugs: [
        'chopon-sourcing-engine-for-luxury-timepieces',
        'aiwin-a-cinematic-introduction-to-a-legacy-of-trust',
        'hala-food-mobile-app-development',
      ],
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'Insights & Enterprise AI Architecture',
        ar: 'رؤى وأفكار في الذكاء الاصطناعي المؤسسي',
      },
      subtitle: {
        en: 'Cutting-edge engineering playbooks on sovereign RAG retrieval, agentic workflows, and LLM governance.',
        ar: 'أحدث الأبحاث والدراسات الميدانية حول استرجاع المعرفة الهجين، وهندسة الوكلاء المستقلين، وحوكمة النماذج التوليدية.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  'ux-and-product-design': {
    rawData: uxProductDesignData,
    seo: {
      title: { en: 'UX and Product Design', ar: 'تصميم تجربة وواجهة المستخدم' },
      description: {
        en: 'Human-centered digital product architecture, intuitive user journeys, living design systems, and rapid prototyping by Persici.',
        ar: 'معمارية تجربة المستخدم، والأنظمة البصرية الحية، وتصميم الواجهات التفاعلية والنماذج الأولية بواسطة بيرسيشي.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Transformative Digital Products & Proven User Growth',
        ar: 'تجارب رقمية استثنائية ونمو متسارع في التحويل',
      },
      subtitle: {
        en: 'See how human-centered UX architecture and living design systems scale top regional and global digital brands.',
        ar: 'اكتشف كيف ساهمت منهجية بيرسيشي في تصميم المنتجات في مضاعفة تحويلات كبرى المنصات والعلامات الإقليمية.',
      },
      selectionMode: 'custom',
      categorySlug: 'branding',
      maxCount: 3,
      selectedSlugs: [
        'lahfaa-perfumes-luxury-branding-bottle-design',
        'hala-food-mobile-app-development',
        'chopon-sourcing-engine-for-luxury-timepieces',
      ],
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'Insights & Strategic Product Architecture',
        ar: 'رؤى وأفكار في تصميم المنتجات وتجربة المستخدم',
      },
      subtitle: {
        en: 'Actionable playbooks on living design systems, cognitive friction elimination, and Figma-to-code architectures.',
        ar: 'أحدث الدراسات العملية لمنهجيات التصميم، وتقليل الإرهاق المعرفي، وربط فيجما بكود الواجهات.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  'customer-engagement': {
    rawData: customerEngagementData,
    seo: {
      title: { en: 'Customer Engagement & Loyalty', ar: 'إشراك العملاء وهندسة الولاء' },
      description: {
        en: 'Enterprise customer engagement, loyalty ecosystems, real-time hyper-personalization, and durable MarTech architectures by Persici.',
        ar: 'هندسة تفاعل العملاء، ومنظومات الولاء المؤسسية، والتخصيص اللحظي، وأحدث منصات التقنيات التسويقية بواسطة بيرسيشي.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Transformative Customer Engagement & Proven Retention Growth',
        ar: 'تجارب تفاعل استثنائية ونمو متسارع في ولاء العملاء',
      },
      subtitle: {
        en: 'See how data-driven personalization and durable retention ecosystems drive compounding lifetime value for leading digital brands.',
        ar: 'اكتشف كيف ساهمت استراتيجيات بيرسيشي في إشراك وتفاعل العملاء في مضاعفة تكرار الشراء وخفض معدلات التسرب لكبرى المنصات الإقليمية.',
      },
      selectionMode: 'custom',
      categorySlug: 'marketing',
      maxCount: 3,
      selectedSlugs: [
        'khazan-crafting-alz-al-lahzat-a-campaign-for-memorable-moments',
        'meraas-the-beach-defining-a-contemporary-coastal-lifestyle',
        'saudi-food-bank-inspiring-the-next-generation-to-reduce-food-waste',
      ],
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'Insights & Strategic Customer Engagement',
        ar: 'رؤى واستراتيجيات تفاعل وولاء العملاء',
      },
      subtitle: {
        en: 'Actionable playbooks on first-party identity graphing, real-time contextual relevance, and emotional loyalty ecosystems.',
        ar: 'أحدث الأبحاث العملية لحوكمة بيانات الطرف الأول، والتخصيص اللحظي، وهندسة برامج الولاء المعنوية.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  'digital-engineering': {
    rawData: digitalEngineeringData,
    seo: {
      title: {
        en: 'Digital Engineering & Cloud-Native Systems',
        ar: 'الهندسة الرقمية والبرمجيات',
      },
      description: {
        en: 'Mission-critical digital engineering, cloud-native distributed microservices, real-time event streaming, and automated DevOps by Persici.',
        ar: 'هندسة برمجية رقمية متطورة، وأنظمة موزعة سحابية أصلية، ومسارات تدفق بيانات فورية وأتمتة DevOps بواسطة بيرسيشي.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
      title: {
        en: 'Transformative Digital Engineering & Proven Scale',
        ar: 'هندسة برمجية تحويلية وأنظمة سحابية فائقة الأداء',
      },
      subtitle: {
        en: 'See how event-driven distributed architectures and automated cloud platforms power mission-critical resilience across the region.',
        ar: 'اكتشف كيف ساهمت استراتيجيات بيرسيشي الهندسية في تحديث النظم الحيوية ومضاعفة سرعة التسليم للشركات الرائدة.',
      },
      selectionMode: 'custom',
      categorySlug: 'software-and-apps',
      maxCount: 3,
      selectedSlugs: [
        'chopon-sourcing-engine-for-luxury-timepieces',
        'metal-fuze-architectural-construction-portal',
        'hala-food-mobile-app-development',
      ],
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'Insights & Engineering Architecture',
        ar: 'رؤى واستراتيجيات الهندسة الرقمية',
      },
      subtitle: {
        en: 'Actionable playbooks on Strangler Fig modernization, petabyte-scale Kafka streams, and site reliability engineering.',
        ar: 'أحدث الأبحاث العملية لتفكيك الأنظمة القديمة، ومعالجة الأحداث اللحظية، وهندسة موثوقية المواقع (SRE).',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  'supply-chain': {
    rawData: supplyChainData,
    seo: {
      title: {
        en: 'Supply Chain & Logistics Intelligence',
        ar: 'سلاسل الإمداد والخدمات اللوجستية',
      },
      description: {
        en: 'Intelligent supply chain, AI demand sensing, distributed order management (DOM), warehouse robotics, and real-time fleet telematics by Persici.',
        ar: 'سلاسل إمداد ذكية، واستشعار تنبؤي للطلب، وإدارة الطلبات الموزعة، وأتمتة المستودعات بالروبوتات وتتبع الأساطيل اللحظي بواسطة بيرسيشي.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured Supply Chain Stories', ar: 'قصص النجاح اللوجستية المميزة' },
      title: {
        en: 'Transformative Supply Chain & High-Velocity Logistics',
        ar: 'تحول لوجستي رائد وشبكات إمداد فائقة الصمود',
      },
      subtitle: {
        en: 'See how automated order routing, IoT cold-chains, and AI demand sensing power resilient logistics across the region.',
        ar: 'اكتشف كيف ساهمت حلول بيرسيشي لسلاسل الإمداد في خفض تكاليف التشغيل ومضاعفة سرعة الوفاء بالطلبات.',
      },
      selectionMode: 'custom',
      categorySlug: 'software-and-apps',
      maxCount: 3,
      selectedSlugs: [
        'protes-sports-technical-restoration',
        'hala-food-mobile-app-development',
        'chopon-sourcing-engine-for-luxury-timepieces',
      ],
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'Insights & Logistics Architecture',
        ar: 'رؤى واستراتيجيات سلاسل الإمداد',
      },
      subtitle: {
        en: 'Actionable playbooks on autonomous control towers, dark stores, and AI demand sensing across the Middle East.',
        ar: 'أحدث الأبحاث العملية لأبراج المراقبة المستقلة، والمتاجر المظلمة، والتنبؤ بالطلب بالذكاء الاصطناعي.',
      },
      ctaText: { en: 'Learn more', ar: 'اعرف المزيد' },
      ctaHref: '/insights',
      selectionMode: 'custom',
      categorySlug: 'all',
      maxCount: 3,
      selectedSlugs: [],
    },
  },
  'crm-management': {
    rawData: crmManagementData,
    seo: {
      title: {
        en: 'CRM Management (Braze & Salesforce)',
        ar: 'إدارة علاقات العملاء (CRM)',
      },
      description: {
        en: 'Enterprise CRM management, lifecycle journey orchestration across Braze and Salesforce, real-time behavioral automation, and WhatsApp API by Persici.',
        ar: 'إدارة متطورة لعلاقات العملاء، وأتمتة دورة الحياة عبر Braze وSalesforce، ومحفزات سلوكية فورية وواتساب للأعمال بواسطة بيرسيشي.',
      },
    },
    offeringsBadge: { en: 'Core Capabilities', ar: 'القدرات والحلول المتخصصة' },
    verticalsBadge: { en: 'Domain Verticals', ar: 'القطاعات والأسواق المتخصصة' },
    techStackBadge: { en: 'Infrastructure & Platforms', ar: 'البنية التقنية المتطورة' },
    clientStoriesConfig: {
      enabled: true,
      badge: { en: 'Featured CRM Client Stories', ar: 'قصص النجاح التسويقية المميزة' },
      title: {
        en: 'Proven Marketing ROI & Compounding Customer Lifetime Value',
        ar: 'عائد استثماري فائق وتجارب عملاء تضاعف ولاء العلامة',
      },
      subtitle: {
        en: 'See how automated Braze Canvas journeys, WhatsApp Business API, and predictive RFM cohorts drive exponential enterprise growth.',
        ar: 'اكتشف كيف ساهمت استراتيجيات بيرسيشي في إدارة علاقات العملاء في مضاعفة تكرار الشراء وخفض تكاليف الاستحواذ.',
      },
      selectionMode: 'custom',
      categorySlug: 'marketing',
      maxCount: 3,
      selectedSlugs: [
        'lahfaa-perfumes-luxury-ecommerce-redesign',
        'hala-food-brand-identity-marketing-strategy',
        'khazan-crafting-alz-al-lahzat-a-campaign-for-memorable-moments',
      ],
    },
    insightsConfig: {
      enabled: true,
      title: {
        en: 'Insights & CRM Architecture',
        ar: 'رؤى واستراتيجيات إدارة علاقات العملاء',
      },
      subtitle: {
        en: 'Actionable playbooks on Braze Canvas architecture, WhatsApp Cloud API, and AI send-time optimization.',
        ar: 'أحدث الأبحاث العملية لأتمتة دورة حياة العميل، وواتساب للأعمال، وتوقيت الإرسال الأمثل بالذكاء الاصطناعي.',
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

export function getDefaultSolutionFeatureCmsData(
  featureSlug: SolutionFeatureSlug
): SolutionFeatureCmsData {
  const preset = FEATURE_PAGE_PRESETS[featureSlug] || FEATURE_PAGE_PRESETS['application-management'];
  const raw = preset.rawData;

  return {
    page: `solutions-${featureSlug}`,
    slug: featureSlug,
    seo: preset.seo,
    hero: {
      enabled: true,
      ...raw.hero,
    },
    ...(raw.partnerShowcase
      ? {
          partnerShowcase: {
            enabled: true,
            partnersHeading: {
              en: 'Certified Platform & Media Partners',
              ar: 'الشركاء والمنصات التكنولوجية المعتمدة',
            },
            ...raw.partnerShowcase,
          },
        }
      : {}),
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
  fallback: { en: string; ar: string },
  allowEmpty = false
): LocalizedString {
  if (!custom || typeof custom !== 'object') {
    return { en: fallback.en, ar: fallback.ar };
  }
  const enVal =
    typeof custom.en === 'string' && (allowEmpty || custom.en.trim().length > 0)
      ? custom.en
      : fallback.en;
  const arVal =
    typeof custom.ar === 'string' && (allowEmpty || custom.ar.trim().length > 0)
      ? custom.ar
      : fallback.ar;
  return { en: enVal, ar: arVal };
}

function pickStr(custom: unknown, fallback: string): string {
  return typeof custom === 'string' && custom.trim().length > 0 ? custom.trim() : fallback;
}

/**
 * Normalizes the main Solutions Overview Hub (`page: 'solutions'`) data so 100% of existing
 * static data is preserved and pre-populated in both the public page and dashboard editor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeSolutionsHubPageData(raw?: Record<string, any> | null): SolutionsHubCmsData {
  const src = raw && typeof raw === 'object' ? raw : {};
  const def = defaultSolutionsHubCmsData;

  const rawOfferings =
    Array.isArray(src.offeringsList) && src.offeringsList.length > 0
      ? src.offeringsList
      : solutionsOfferingsList;

  const normalizedOfferings: SolutionOfferingItem[] = rawOfferings.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: Record<string, any>, idx: number) => {
      const fb =
        solutionsOfferingsList.find((o) => o.slug === item?.slug) ||
        solutionsOfferingsList[idx] ||
        solutionsOfferingsList[0];
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
    page: 'solutions',
    seo: {
      title: pickBi(
        src.seo?.title,
        def.seo?.title || {
          en: 'Solutions | Enterprise Growth & Engineering',
          ar: 'الحلول | النمو والهندسة المؤسسية',
        }
      ),
      description: pickBi(
        src.seo?.description,
        def.seo?.description || {
          en: 'Integrated software engineering, brand architecture, and digital growth ecosystems engineered by Persici for measurable business outcomes.',
          ar: 'حلول متكاملة في هندسة البرمجيات وبناء الهوية واستراتيجيات النمو الرقمي من بيرسيشي لتحقيق نتائج أعمال قابلة للقياس.',
        }
      ),
    },
    heroEnabled: src.heroEnabled !== false,
    heroBadge: pickBi(src.heroBadge, def.heroBadge),
    heroTitle: pickBi(src.heroTitle, def.heroTitle),
    heroSubtitle: pickBi(src.heroSubtitle, def.heroSubtitle),
    heroCtaPrimary: pickBi(src.heroCtaPrimary, def.heroCtaPrimary),
    heroCtaSecondary: pickBi(src.heroCtaSecondary, def.heroCtaSecondary),
    heroCtaHref: pickStr(src.heroCtaHref, def.heroCtaHref || '#offerings'),
    heroImage: pickStr(src.heroImage, def.heroImage),
    offeringsEnabled: src.offeringsEnabled !== false,
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
      def.quoteBadge || { en: 'What our clients say', ar: 'آراء العملاء' }
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
 * Normalizes any of the 9 Featured Solution Pages (`solutions-<slug>`) against its canonical
 * static dataset so zero content is ever lost or altered unless explicitly edited.
 */
export function normalizeSolutionFeaturePageData(
  slugOrPage: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw?: Record<string, any> | null
): SolutionFeatureCmsData {
  const featureSlug = extractSolutionFeatureSlug(slugOrPage) || 'application-management';
  const def = getDefaultSolutionFeatureCmsData(featureSlug);
  const src = raw && typeof raw === 'object' ? raw : {};

  const rawOfferings =
    Array.isArray(src.offerings) && src.offerings.length > 0 ? src.offerings : def.offerings;

  const normalizedOfferings: SolutionFeatureOfferingItem[] = rawOfferings.map(
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

  const normalizedVerticals: SolutionFeatureVerticalItem[] = rawVerticals.map(
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

  const normalizedPods: SolutionTechStackPod[] = rawPods.map(
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

  let normalizedPartnerShowcase: SolutionPartnerShowcaseSection | undefined = undefined;
  if (def.partnerShowcase || src.partnerShowcase) {
    const fbPs = def.partnerShowcase || getDefaultSolutionFeatureCmsData('ecommerce-growth').partnerShowcase!;
    const rawPs = src.partnerShowcase || {};
    normalizedPartnerShowcase = {
      enabled: rawPs.enabled !== false,
      badge: pickBi(rawPs.badge, fbPs.badge),
      title: pickBi(rawPs.title, fbPs.title),
      description: pickBi(rawPs.description, fbPs.description),
      partnersHeading: pickBi(
        rawPs.partnersHeading,
        fbPs.partnersHeading || {
          en: 'Certified Platform & Media Partners',
          ar: 'الشركاء والمنصات التكنولوجية المعتمدة',
        }
      ),
      video: {
        src: pickStr(rawPs.video?.src, fbPs.video.src),
        poster: pickStr(rawPs.video?.poster, fbPs.video.poster || ''),
        title: pickBi(rawPs.video?.title, fbPs.video.title),
        caption: pickBi(rawPs.video?.caption, fbPs.video.caption),
        partnerBadge: pickBi(rawPs.video?.partnerBadge, fbPs.video.partnerBadge),
      },
      partners:
        Array.isArray(rawPs.partners) && rawPs.partners.length > 0
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rawPs.partners.map((pt: Record<string, any>, idx: number) => {
              const fbPt = fbPs.partners[idx] || fbPs.partners[0];
              return {
                name: pickStr(pt?.name, fbPt.name),
                role: pickBi(pt?.role, fbPt.role),
                logo: pickStr(pt?.logo, fbPt.logo),
              };
            })
          : fbPs.partners,
    };
  }

  return {
    ...def,
    ...src,
    page: `solutions-${featureSlug}`,
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
    ...(normalizedPartnerShowcase ? { partnerShowcase: normalizedPartnerShowcase } : {}),
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
