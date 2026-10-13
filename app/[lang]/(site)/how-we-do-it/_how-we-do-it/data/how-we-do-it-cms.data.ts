import type {
  LocalizedString,
  SolutionDiagramType,
  SolutionBenefitItem,
  SolutionFaqItem,
  FeaturedClientStoryItem,
  HowWeDoItPageContent,
} from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { howWeDoItPageContent } from '@shared/data';
import { strategyConsultingData } from '../../[slug]/_strategy-consulting/data/strategy-consulting.data';
import { digitalTransformationFrameworkData } from '../../[slug]/_digital-transformation-framework/data/digital-transformation-framework.data';
import { productManagementData } from '../../[slug]/_product-management/data/product-management.data';
import { engineeringTechnologyData } from '../../[slug]/_engineering-technology/data/engineering-technology.data';
import { experienceTransformationData } from '../../[slug]/_experience-transformation/data/experience-transformation.data';
import type {
  SolutionDynamicSelectionMode,
  SolutionClientStoriesSectionConfig,
  SolutionInsightsSectionConfig,
} from '@/app/[lang]/(site)/solutions/_solutions/data/solutions-cms.data';

export type HowWeDoItDynamicSelectionMode = SolutionDynamicSelectionMode;
export type HowWeDoItClientStoriesSectionConfig = SolutionClientStoriesSectionConfig;
export type HowWeDoItInsightsSectionConfig = SolutionInsightsSectionConfig;

export interface HowWeDoItFeatureOfferingItem {
  slug: string;
  tag: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  icon?: string;
  diagramType: SolutionDiagramType;
}

export interface HowWeDoItEngagementStep {
  number: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface HowWeDoItEngagementModelSection {
  enabled?: boolean;
  badge?: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
  steps: HowWeDoItEngagementStep[];
}

export interface HowWeDoItTechStackPod {
  title: LocalizedString;
  badge?: LocalizedString;
  description: LocalizedString;
  technologies: { name: string; category?: string; badge?: string }[];
}

export interface HowWeDoItFeatureCmsData {
  page: string; // e.g. 'how-we-do-it-strategy-consulting'
  slug: string; // e.g. 'strategy-consulting'
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
  };
  offeringsEnabled?: boolean;
  offeringsBadge: LocalizedString;
  offeringsTitle: LocalizedString;
  offeringsSubtitle: LocalizedString;
  offerings: HowWeDoItFeatureOfferingItem[];
  whyItMatters: {
    enabled?: boolean;
    title: LocalizedString;
    text: LocalizedString;
    image: string;
  };
  benefitsStrip: {
    enabled?: boolean;
    title: LocalizedString;
    image: string;
    benefits: SolutionBenefitItem[];
  };
  engagementModel: HowWeDoItEngagementModelSection;
  techStackEnabled?: boolean;
  techStackBadge: LocalizedString;
  techStackTitle: LocalizedString;
  techStackSubtitle: LocalizedString;
  techStackPods: HowWeDoItTechStackPod[];
  techStackPodsTitle?: LocalizedString;
  techStackPodsSubtitle?: LocalizedString;
  clientStoriesConfig: HowWeDoItClientStoriesSectionConfig;
  clientStories: FeaturedClientStoryItem[];
  insightsConfig: HowWeDoItInsightsSectionConfig;
  insights: ContentCardItem[];
  clientReview: {
    enabled?: boolean;
    quote: LocalizedString;
    author: string;
    role: LocalizedString;
    badge?: LocalizedString;
    avatar?: string;
  };
  quote?: {
    text: LocalizedString;
    author: string;
    role: LocalizedString;
  };
  faqsEnabled?: boolean;
  faqsTitle: LocalizedString;
  faqsSubtitle: LocalizedString;
  faqs: SolutionFaqItem[];
  contactEnabled?: boolean;
  contactSection?: {
    enabled?: boolean;
    title?: LocalizedString;
    subtitle?: LocalizedString;
  };
}

export interface HowWeDoItHubCmsData extends HowWeDoItPageContent {
  seo?: {
    title: LocalizedString;
    description: LocalizedString;
  };
  heroEnabled?: boolean;
  offeringsEnabled?: boolean;
  frameworkEnabled?: boolean;
  deliveryEnabled?: boolean;
  clientStoriesConfig: HowWeDoItClientStoriesSectionConfig;
  clientStories: FeaturedClientStoryItem[];
  insightsConfig: HowWeDoItInsightsSectionConfig;
  insightsTitle?: LocalizedString;
  insightsSubtitle?: LocalizedString;
  insightsCtaText?: LocalizedString;
  insightsList: ContentCardItem[];
  quoteEnabled?: boolean;
  quoteBadge?: LocalizedString;
  quoteAvatar?: string;
  faqsEnabled?: boolean;
  contactEnabled?: boolean;
  contactSection?: {
    enabled?: boolean;
    title?: LocalizedString;
    subtitle?: LocalizedString;
  };
}

export const HOW_WE_DO_IT_FEATURE_SLUGS = [
  'strategy-consulting',
  'digital-transformation-framework',
  'product-management',
  'engineering-technology',
  'experience-transformation',
] as const;

export type HowWeDoItFeatureSlug = (typeof HOW_WE_DO_IT_FEATURE_SLUGS)[number];

const SLUG_ALIAS_MAP: Record<string, HowWeDoItFeatureSlug> = {
  strategy: 'strategy-consulting',
  'strategy-consulting': 'strategy-consulting',
  framework: 'digital-transformation-framework',
  'digital-transformation-framework': 'digital-transformation-framework',
  product: 'product-management',
  'product-management': 'product-management',
  engineering: 'engineering-technology',
  'engineering-technology': 'engineering-technology',
  experience: 'experience-transformation',
  'experience-transformation': 'experience-transformation',
};

export function isHowWeDoItPageSlug(pageSlug: string): boolean {
  if (pageSlug === 'how-we-do-it') return true;
  const clean = pageSlug.startsWith('how-we-do-it-')
    ? pageSlug.replace(/^how-we-do-it-/, '')
    : pageSlug;
  return Boolean(SLUG_ALIAS_MAP[clean]);
}

export function extractHowWeDoItFeatureSlug(pageSlug: string): HowWeDoItFeatureSlug | null {
  const clean = pageSlug.startsWith('how-we-do-it-')
    ? pageSlug.replace(/^how-we-do-it-/, '')
    : pageSlug;
  return SLUG_ALIAS_MAP[clean] || null;
}

export const DEFAULT_HOW_WE_DO_IT_CLIENT_STORIES: FeaturedClientStoryItem[] = [
  {
    id: 'story-hala',
    slug: 'hala-food-mobile-app-development',
    client: 'Hala Food Delivery',
    tag: { en: 'Speed Velocity & Mobile', ar: 'سرعة التنفيذ وتطبيقات الجوال' },
    title: {
      en: 'Scaling On-Demand Food Delivery to 1.2M Orders',
      ar: 'مضاعفة تسليم الطلبات الفورية إلى 1.2 مليون طلب',
    },
    description: {
      en: 'Engineered a hyper-scalable dispatching architecture reducing latency by 74% and sustaining 300% order surges.',
      ar: 'بناء معمارية توزيع ذكية فائقة السرعة قلصت زمن الاستجابة بنسبة 74% واستوعبت قفزات الطلب بنسبة 300%.',
    },
    metrics: [
      { id: 'm1', value: '74%', label: { en: 'Latency Reduction', ar: 'خفض زمن الاستجابة' } },
      { id: 'm2', value: '1.2M', label: { en: 'Orders Dispatched', ar: 'طلب ناجح' } },
      { id: 'm3', value: '4.9★', label: { en: 'Store Rating', ar: 'تقييم التطبيق' } },
    ],
    image:
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=85',
    ctaText: { en: 'View Case Study', ar: 'استكشف القصة' },
    ctaHref: '/client-stories/hala-food-mobile-app-development',
  },
  {
    id: 'story-chopon',
    slug: 'chopon-sourcing-engine-for-luxury-timepieces',
    client: 'Chopon Watches',
    tag: { en: 'Agile Architecture & Headless', ar: 'المعمارية الرشيقة والتجارة المستقلة' },
    title: {
      en: 'Global Luxury Sourcing Engine & Real-Time Vault',
      ar: 'منظومة عالمية لتوريد الساعات الفاخرة وخزنة رقمية فورية',
    },
    description: {
      en: 'Headless microservices and algorithmic inventory clearing 42M AED in certified luxury timepieces.',
      ar: 'خدمات مصغرة مستقلة ونظام مخزون رقمي سوّى مبيعات بقيمة 42 مليون درهم لساعات فاخرة معتمدة.',
    },
    metrics: [
      { id: 'm1', value: '42M+', label: { en: 'AED Processed', ar: 'درهم مبيعات' } },
      { id: 'm2', value: '99.99%', label: { en: 'Vault Uptime', ar: 'جاهزية المنظومة' } },
    ],
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    ctaText: { en: 'View Case Study', ar: 'استكشف القصة' },
    ctaHref: '/client-stories/chopon-sourcing-engine-for-luxury-timepieces',
  },
  {
    id: 'story-protes',
    slug: 'protes-sports-technical-restoration',
    client: 'Protes Sportswear',
    tag: { en: 'Living Products & Optimization', ar: 'المنتجات الحية وتحسين الأداء' },
    title: {
      en: 'Transforming Omnichannel Direct-to-Consumer Growth',
      ar: 'تحول رقمي شامل لعلامة الملابس الرياضية نحو المستهلك مباشرة',
    },
    description: {
      en: 'Redesigned the entire digital product journey, slashing checkout friction and elevating repeat buyer retention by 58%.',
      ar: 'إعادة تصميم رحلة المنتج الرقمي بالكامل، وتقليص عوائق الدفع ورفع نسبة تكرار الشراء بنسبة 58%.',
    },
    metrics: [
      { id: 'm1', value: '58%', label: { en: 'Repeat Buyers', ar: 'تكرار الشراء' } },
      { id: 'm2', value: '2.8x', label: { en: 'Mobile Conversion', ar: 'تحويل الجوال' } },
    ],
    image:
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85',
    ctaText: { en: 'View Case Study', ar: 'استكشف القصة' },
    ctaHref: '/client-stories/protes-sports-technical-restoration',
  },
];

export const DEFAULT_HOW_WE_DO_IT_INSIGHTS: ContentCardItem[] = [
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
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'insight-2',
    slug: 'what-star-formation-taught-me-about-solving-business-problems',
    category: { en: 'Article', ar: 'مقال' },
    title: {
      en: 'What Star Formation Taught Me About Solving Business Problems',
      ar: 'ماذا تعلمت من تكوين النجوم حول حل المشكلات التجارية المعقدة',
    },
    date: { en: 'August 18, 2026', ar: '١٨ أغسطس ٢٠٢٦' },
    href: '/insights/what-star-formation-taught-me-about-solving-business-problems',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'insight-3',
    slug: 'why-composable-microservices-outperform-legacy-stacks',
    category: { en: 'Research', ar: 'بحث تقني' },
    title: {
      en: 'Why Composable Microservices Outperform Legacy Stacks at Enterprise Scale',
      ar: 'لماذا تتفوق الخدمات المصغرة القابلة للتجميع على البنى التقنية القديمة في المؤسسات الكبرى',
    },
    date: { en: 'July 14, 2026', ar: '١٤ يوليو ٢٠٢٦' },
    href: '/insights',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85',
  },
];

export const defaultHowWeDoItHubCmsData: HowWeDoItHubCmsData = {
  ...howWeDoItPageContent,
  page: 'how-we-do-it',
  seo: {
    title: {
      en: 'How We Do It — Delivery Methodology & Engineering Velocity | Persici',
      ar: 'كيف نقوم بالعمل — منهجية التنفيذ وسرعة الهندسة الرقمية | بيرسيشي',
    },
    description: {
      en: 'Persici multidisciplinary delivery methodology, high-velocity agile engineering, living products, and SPEED transformation framework.',
      ar: 'منهجية بيرسيشي لتنفيذ التحول الرقمي وتسريع النمو المؤسسي: ركائز الاستراتيجية، والمنتج، والتجربة، والهندسة، والبيانات والذكاء الاصطناعي.',
    },
  },
  heroEnabled: true,
  offeringsEnabled: true,
  frameworkEnabled: true,
  deliveryEnabled: true,
  clientStoriesConfig: {
    enabled: true,
    badge: { en: 'Client Stories', ar: 'قصص النجاح' },
    title: {
      en: 'Proven Enterprise Transformations',
      ar: 'قصص نجاح تثبت جدارتنا في التحول المؤسسي',
    },
    subtitle: {
      en: 'Explore how our multidisciplinary methodologies deliver measurable commercial impact across the region.',
      ar: 'اكتشف كيف تقود منهجيات بيرسيشي نمواً تجارياً قابلاً للقياس لعملائنا في المنطقة.',
    },
    selectionMode: 'featured',
    categorySlug: 'all',
    maxCount: 3,
    selectedSlugs: [
      'hala-food-mobile-app-development',
      'chopon-sourcing-engine-for-luxury-timepieces',
      'protes-sports-technical-restoration',
    ],
  },
  clientStories: DEFAULT_HOW_WE_DO_IT_CLIENT_STORIES,
  insightsConfig: {
    enabled: true,
    title: { en: 'Methodology Insights & Perspectives', ar: 'رؤى وتحليلات في أساليب التنفيذ' },
    subtitle: {
      en: 'Our latest thinking on agile transformation, living products, and cloud engineering.',
      ar: 'أحدث مقالاتنا وأبحاثنا في التحول الرشيق والمنتجات الحية والهندسة السحابية.',
    },
    ctaText: { en: 'Explore All Insights', ar: 'استكشف كافة الرؤى' },
    ctaHref: '/insights',
    selectionMode: 'featured',
    categorySlug: 'all',
    maxCount: 3,
    selectedSlugs: [],
  },
  insightsTitle: {
    en: 'Methodology Insights & Perspectives',
    ar: 'رؤى وتحليلات في أساليب التنفيذ',
  },
  insightsSubtitle: {
    en: 'Our latest thinking on agile transformation, living products, and cloud engineering.',
    ar: 'أحدث مقالاتنا وأبحاثنا في التحول الرشيق والمنتجات الحية والهندسة السحابية.',
  },
  insightsCtaText: { en: 'Explore All Insights', ar: 'استكشف كافة الرؤى' },
  insightsList: DEFAULT_HOW_WE_DO_IT_INSIGHTS,
  quoteEnabled: true,
  quoteBadge: { en: 'Leadership Perspective', ar: 'رؤية القيادة التنفيذية' },
  faqsEnabled: true,
  contactEnabled: true,
};

export const defaultStrategyConsultingCmsData: HowWeDoItFeatureCmsData = {
  page: 'how-we-do-it-strategy-consulting',
  slug: 'strategy-consulting',
  seo: {
    title: {
      en: 'Strategy & Consulting — Persici Delivery Methodology',
      ar: 'الاستراتيجية والاستشارات — منهجية بيرسيشي في التنفيذ',
    },
    description: {
      en: 'Strategic consulting that drives scalable growth: turning business ambition into clear, actionable growth roadmaps by Persici.',
      ar: 'استشارات استراتيجية تقود نمواً قابلاً للتوسع وتحول الطموح التجاري إلى خارطة طريق نمو واضحة وقابلة للتنفيذ بواسطة بيرسيشي.',
    },
  },
  hero: {
    enabled: true,
    tag: strategyConsultingData.hero.tag,
    secondaryTag: strategyConsultingData.hero.secondaryTag,
    title: strategyConsultingData.hero.title,
    subtitle: strategyConsultingData.hero.subtitle,
    ctaText: strategyConsultingData.hero.ctaText,
    ctaHref: strategyConsultingData.hero.ctaHref,
    image: strategyConsultingData.hero.image,
  },
  offeringsEnabled: true,
  offeringsBadge: { en: 'Advisory Capabilities', ar: 'القدرات الاستشارية' },
  offeringsTitle: strategyConsultingData.offeringsTitle,
  offeringsSubtitle: strategyConsultingData.offeringsSubtitle,
  offerings: strategyConsultingData.offerings.map((o, idx) => ({
    slug: `strategy-capability-${idx + 1}`,
    tag: o.tag,
    title: o.title,
    description: o.description,
    diagramType: o.diagramType || 'prism-refraction-beam',
    icon: o.icon,
  })),
  whyItMatters: {
    enabled: true,
    title: strategyConsultingData.whyItMatters.title,
    text: strategyConsultingData.whyItMatters.text,
    image: strategyConsultingData.whyItMatters.image,
  },
  benefitsStrip: {
    enabled: true,
    title: strategyConsultingData.benefitsStrip.title,
    image: strategyConsultingData.benefitsStrip.image,
    benefits: strategyConsultingData.benefitsStrip.benefits,
  },
  engagementModel: {
    enabled: true,
    badge: { en: 'Engagement Model', ar: 'نموذج التنفيذ' },
    title: strategyConsultingData.engagementModel.title,
    subtitle: strategyConsultingData.engagementModel.subtitle,
    steps: strategyConsultingData.engagementModel.steps,
  },
  techStackEnabled: true,
  techStackBadge: { en: 'Toolchains & Platforms', ar: 'الأدوات والبنية التحتية' },
  techStackTitle: {
    en: 'Strategic Technology Ecosystem',
    ar: 'منظومة التقنيات الاستراتيجية',
  },
  techStackSubtitle: {
    en: 'We leverage enterprise cloud and intelligence platforms to transform strategy into operational reality.',
    ar: 'نوظف أرقى المنصات السحابية والتحليلية لتحويل الاستراتيجية إلى واقع رقمي ملموس.',
  },
  techStackPods: strategyConsultingData.techStackPods,
  clientStoriesConfig: {
    enabled: true,
    badge: { en: 'Featured Client Stories', ar: 'قصص النجاح المميزة' },
    title: {
      en: 'Strategic Transformations That Accelerated Commercial Growth',
      ar: 'تحولات استراتيجية صنعت فارقاً حقيقياً وضاعفت الإيرادات',
    },
    subtitle: {
      en: 'Explore how our advisory roadmaps unlocked lasting competitive advantage for market leaders.',
      ar: 'اكتشف كيف ساهمت خرائط طريق بيرسيشي الاستشارية في ترسيخ ريادة عملائنا وتعظيم عوائدهم.',
    },
    selectionMode: 'featured',
    categorySlug: 'all',
    maxCount: 3,
    selectedSlugs: [
      'hala-food-mobile-app-development',
      'chopon-sourcing-engine-for-luxury-timepieces',
      'protes-sports-technical-restoration',
    ],
  },
  clientStories: DEFAULT_HOW_WE_DO_IT_CLIENT_STORIES,
  insightsConfig: {
    enabled: true,
    title: { en: 'Strategic Thinking & Market Perspectives', ar: 'الرؤى الاستراتيجية وتحليلات السوق' },
    subtitle: {
      en: 'Executive briefings, growth frameworks, and digital advisory viewpoints.',
      ar: 'إحاطات تنفيذية وأطر نمو وتحليلات استشارية لصنّاع القرار.',
    },
    ctaText: { en: 'Explore Insights', ar: 'استكشف كافة الرؤى' },
    ctaHref: '/insights',
    selectionMode: 'featured',
    categorySlug: 'all',
    maxCount: 3,
    selectedSlugs: [],
  },
  insights: DEFAULT_HOW_WE_DO_IT_INSIGHTS,
  clientReview: {
    enabled: true,
    quote: strategyConsultingData.quote.text,
    author: strategyConsultingData.quote.author,
    role: strategyConsultingData.quote.role,
    badge: { en: 'Verified Executive Partner', ar: 'شريك تنفيذي معتمد' },
  },
  faqsEnabled: true,
  faqsTitle: { en: 'Frequently Asked Questions', ar: 'الأسئلة الأكثر شيوعاً' },
  faqsSubtitle: {
    en: 'Common questions on our strategic consulting and engagement frameworks.',
    ar: 'إجابات واضحة حول استشاراتنا الاستراتيجية ونماذج العمل التنفيذية.',
  },
  faqs: strategyConsultingData.faqs,
  contactEnabled: true,
};

export const defaultDigitalTransformationFrameworkCmsData: HowWeDoItFeatureCmsData = {
  page: 'how-we-do-it-digital-transformation-framework',
  slug: 'digital-transformation-framework',
  seo: {
    title: {
      en: 'Digital Transformation Framework — Persici SPEED Engine',
      ar: 'إطار التحول الرقمي — محرك SPEED للتحول المؤسسي | بيرسيشي',
    },
    description: {
      en: 'Accelerate business transformation at pace with Persici’s SPEED framework uniting Strategy, Product, Experience, Engineering, and Data & AI.',
      ar: 'تسريع التحول الرقمي المؤسسي بوتيرة استثنائية عبر إطار SPEED الجامع للاستراتيجية والمنتج والتجربة والهندسة والبيانات والذكاء الاصطناعي.',
    },
  },
  hero: {
    enabled: true,
    tag: digitalTransformationFrameworkData.hero.tag,
    secondaryTag: digitalTransformationFrameworkData.hero.secondaryTag,
    title: digitalTransformationFrameworkData.hero.title,
    subtitle: digitalTransformationFrameworkData.hero.subtitle,
    ctaText: digitalTransformationFrameworkData.hero.ctaText,
    ctaHref: digitalTransformationFrameworkData.hero.ctaHref,
    image: digitalTransformationFrameworkData.hero.image,
  },
  offeringsEnabled: true,
  offeringsBadge: { en: 'SPEED Framework', ar: 'إطار العمل SPEED' },
  offeringsTitle: digitalTransformationFrameworkData.offeringsTitle,
  offeringsSubtitle: digitalTransformationFrameworkData.offeringsSubtitle,
  offerings: digitalTransformationFrameworkData.offerings.map((o, idx) => ({
    slug: `framework-pillar-${idx + 1}`,
    tag: o.tag,
    title: o.title,
    description: o.description,
    diagramType: o.diagramType || 'quantum-core-cube',
    icon: o.icon,
  })),
  whyItMatters: {
    enabled: true,
    title: digitalTransformationFrameworkData.whyItMatters.title,
    text: digitalTransformationFrameworkData.whyItMatters.text,
    image: digitalTransformationFrameworkData.whyItMatters.image,
  },
  benefitsStrip: {
    enabled: true,
    title: digitalTransformationFrameworkData.benefitsStrip.title,
    image: digitalTransformationFrameworkData.benefitsStrip.image,
    benefits: digitalTransformationFrameworkData.benefitsStrip.benefits,
  },
  engagementModel: {
    enabled: true,
    badge: { en: 'SPEED Execution Lifecycle', ar: 'دورة تنفيذ إطار SPEED' },
    title: {
      en: 'How the SPEED Capabilities Synchronize in Production',
      ar: 'كيف تتناغم قدرات SPEED في بيئة العمل الحية',
    },
    subtitle: {
      en: 'Iterative multidisciplinary cadence delivering continuous business value.',
      ar: 'إيقاع عمل تكراري موحد يقدم قيمة مستمرة ومثبتة للمؤسسة.',
    },
    steps: [
      {
        number: 'S',
        title: { en: 'Strategy & Architecture', ar: 'الاستراتيجية والمعمارية' },
        description: {
          en: 'Quantifying value pools and validating clear, scalable execution blueprints.',
          ar: 'تحديد مصادر القيمة والتحقق من مخططات التنفيذ القابلة للتوسع.',
        },
      },
      {
        number: 'P',
        title: { en: 'Living Product Squads', ar: 'فرق المنتجات الحية' },
        description: {
          en: 'Autonomous cross-functional pods building living products aligned to North Star KPIs.',
          ar: 'فرق عمل مستقلة تبني منتجات حية وموجهة بأهداف النجم الشمالي.',
        },
      },
      {
        number: 'E',
        title: { en: 'Human Experience & Engineering', ar: 'التجربة والهندسة السحابية' },
        description: {
          en: 'Seamless omnichannel journeys backed by zero-downtime composable architectures.',
          ar: 'رحلات عملاء سلسة مدعومة ببنى سحابية مجمعة لا تنقطع إطلاقاً.',
        },
      },
      {
        number: 'D',
        title: { en: 'Data Intelligence & Scale', ar: 'ذكاء البيانات والتوسع' },
        description: {
          en: 'Real-time telemetry, automated personalization, and scalable governance.',
          ar: 'رصد لحظي للأداء، وتخصيص ذكي للرحلات، وحوكمة قابلة للنمو.',
        },
      },
    ],
  },
  techStackEnabled: true,
  techStackBadge: { en: 'Transformation Architecture', ar: 'البنية التحتية والتقنيات' },
  techStackTitle: {
    en: 'Transformation Toolchains & Platforms',
    ar: 'منظومة أدوات التحول الرقمي',
  },
  techStackSubtitle: {
    en: 'Modern cloud architectures and toolchains driving rapid, continuous enterprise evolution.',
    ar: 'منصات سحابية وهندسية مرنة تضمن تدفق الابتكار والتحول بوتيرة سريعة ومستقرة.',
  },
  techStackPods: digitalTransformationFrameworkData.techStackPods,
  clientStoriesConfig: {
    enabled: true,
    badge: { en: 'Enterprise Case Studies', ar: 'قصص نجاح التحول' },
    title: {
      en: 'Organizations Powered by the SPEED Engine',
      ar: 'مؤسسات انطلقت بقوة محرك SPEED',
    },
    subtitle: {
      en: 'Discover how multi-capability integration drives accelerated transformation and digital resilience.',
      ar: 'اكتشف كيف ساهم التكامل الخماسي لإطار SPEED في تسريع التحول وبناء مناعة رقمية مستدامة.',
    },
    selectionMode: 'featured',
    categorySlug: 'all',
    maxCount: 3,
    selectedSlugs: [
      'hala-food-mobile-app-development',
      'chopon-sourcing-engine-for-luxury-timepieces',
      'protes-sports-technical-restoration',
    ],
  },
  clientStories: DEFAULT_HOW_WE_DO_IT_CLIENT_STORIES,
  insightsConfig: {
    enabled: true,
    title: { en: 'SPEED Transformation Insights', ar: 'رؤى وتحليلات إطار SPEED' },
    subtitle: {
      en: 'Deep dives on multidisciplinary agility, agile architecture, and enterprise scale.',
      ar: 'تحليلات معمقة حول المرونة متعددة التخصصات والهندسة السحابية المتطورة.',
    },
    ctaText: { en: 'Explore Insights', ar: 'استكشف كافة الرؤى' },
    ctaHref: '/insights',
    selectionMode: 'featured',
    categorySlug: 'all',
    maxCount: 3,
    selectedSlugs: [],
  },
  insights: DEFAULT_HOW_WE_DO_IT_INSIGHTS,
  clientReview: {
    enabled: true,
    quote: digitalTransformationFrameworkData.quote.text,
    author: digitalTransformationFrameworkData.quote.author,
    role: digitalTransformationFrameworkData.quote.role,
    badge: { en: 'Transformation Leader', ar: 'قائد تحول رقمي معتمد' },
  },
  faqsEnabled: true,
  faqsTitle: { en: 'Frequently Asked Questions', ar: 'الأسئلة الأكثر شيوعاً' },
  faqsSubtitle: {
    en: 'Answers on how the SPEED digital transformation framework operates in practice.',
    ar: 'إجابات حول كيفية تطبيق إطار SPEED للتحول الرقمي في البيئات المؤسسية المعقدة.',
  },
  faqs: digitalTransformationFrameworkData.faqs,
  contactEnabled: true,
};

export const defaultProductManagementCmsData: HowWeDoItFeatureCmsData = {
  page: 'how-we-do-it-product-management',
  slug: 'product-management',
  seo: {
    title: {
      en: 'Product Management — Living Products & Agile Pods | Persici',
      ar: 'إدارة المنتجات — المنتجات الحية وفرق العمل الرشيقة | بيرسيشي',
    },
    description: {
      en: 'Product thinking that drives organizational transformation through continuous cycles of identifying, creating, and delivering value by Persici.',
      ar: 'التفكير المتمحور حول المنتج الذي يقود التحول المؤسسي عبر دورات مستمرة لتحديد وخلق وتسليم القيمة بأعلى درجات المرونة وسرعة الإنجاز.',
    },
  },
  hero: {
    enabled: true,
    tag: productManagementData.hero.tag,
    secondaryTag: productManagementData.hero.secondaryTag,
    title: productManagementData.hero.title,
    subtitle: productManagementData.hero.subtitle,
    ctaText: productManagementData.hero.ctaText,
    ctaHref: productManagementData.hero.ctaHref,
    image: productManagementData.hero.image,
  },
  offeringsEnabled: true,
  offeringsBadge: { en: 'Product Methodology', ar: 'منهجية إدارة المنتجات' },
  offeringsTitle: productManagementData.offeringsTitle,
  offeringsSubtitle: productManagementData.offeringsSubtitle,
  offerings: productManagementData.offerings.map((o, idx) => ({
    slug: `product-pillar-${idx + 1}`,
    tag: o.tag,
    title: o.title,
    description: o.description,
    diagramType: o.diagramType || 'ux-prototype-interaction',
    icon: o.icon,
  })),
  whyItMatters: {
    enabled: true,
    title: productManagementData.whyItMatters.title,
    text: productManagementData.whyItMatters.text,
    image: productManagementData.whyItMatters.image,
  },
  benefitsStrip: {
    enabled: true,
    title: productManagementData.benefitsStrip.title,
    image: productManagementData.benefitsStrip.image,
    benefits: productManagementData.benefitsStrip.benefits,
  },
  engagementModel: {
    enabled: true,
    badge: { en: 'Living Product Cadence', ar: 'إيقاع المنتجات الحية' },
    title: {
      en: 'The 4-Step Continuous Discovery & Delivery Loop',
      ar: 'دورة الاستكشاف والتسليم المستمر المكونة من 4 مراحل',
    },
    subtitle: {
      en: 'How our product squads move rapidly from validated user pain to shipping production value.',
      ar: 'كيف تتحرك فرق المنتجات لدينا بسرعة من احتياج المستخدم المثبت إلى تسليم القيمة الحية.',
    },
    steps: [
      {
        number: '01',
        title: { en: 'Continuous Discovery', ar: 'الاستكشاف المستمر' },
        description: {
          en: 'Weekly user testing, customer interviews, and behavioral funnel telemetry.',
          ar: 'اختبارات مستخدمين أسبوعية ومقابلات مباشرة وتحليلات تفصيلية لسلوك التصفح.',
        },
      },
      {
        number: '02',
        title: { en: 'Rapid Prototyping', ar: 'النماذج الأولية السريعة' },
        description: {
          en: 'Figma prototypes and interactive sandbox proofs-of-concept before writing code.',
          ar: 'نماذج أولية تفاعلية واختبارات جدوى بصرية قبل استثمار الجهد في البرمجة.',
        },
      },
      {
        number: '03',
        title: { en: 'Value-Driven Sprints', ar: 'دورات التطوير الموجهة' },
        description: {
          en: 'Two-week agile sprints deploying verified features tied directly to North Star metrics.',
          ar: 'دورات أسبوعين رشيقة تطلق مزايا مثبتة ومربوطة مباشرة بمؤشرات الأداء.',
        },
      },
      {
        number: '04',
        title: { en: 'Inspect & Telemetry', ar: 'القياس والتطوير' },
        description: {
          en: 'Real-time cohort retention measurement, qualitative feedback, and immediate iteration.',
          ar: 'قياس الاحتفاظ بالمستخدمين، ومراجعة التغذية الراجعة، والتطوير الفوري.',
        },
      },
    ],
  },
  techStackEnabled: true,
  techStackBadge: { en: 'Product Toolchains', ar: 'أدوات ومنصات المنتجات' },
  techStackTitle: {
    en: 'Product Analytics & Roadmapping Toolchains',
    ar: 'منظومة إدارة المنتجات والبيانات',
  },
  techStackSubtitle: {
    en: 'We employ modern user telemetry, behavioral analytics, and roadmapping platforms to ship impactful features.',
    ar: 'نوظف أرقى أدوات تتبع سلوك المستخدمين وبناء النماذج الأولية لضمان تسليم ميزات ذات أثر حقيقي.',
  },
  techStackPods: productManagementData.techStackPods,
  clientStoriesConfig: {
    enabled: true,
    badge: { en: 'Product Case Studies', ar: 'قصص نجاح المنتجات' },
    title: {
      en: 'Living Products Engineered for Market Impact',
      ar: 'منتجات حية صُنعت لتحقيق أثر تجاري ملموس',
    },
    subtitle: {
      en: 'See how our product leadership turns ideas into high-retention commercial platforms.',
      ar: 'اكتشف كيف تحول قيادة المنتجات لدينا الأفكار إلى منصات تجارية عالية الولاء والنمو.',
    },
    selectionMode: 'featured',
    categorySlug: 'all',
    maxCount: 3,
    selectedSlugs: [
      'hala-food-mobile-app-development',
      'chopon-sourcing-engine-for-luxury-timepieces',
      'protes-sports-technical-restoration',
    ],
  },
  clientStories: DEFAULT_HOW_WE_DO_IT_CLIENT_STORIES,
  insightsConfig: {
    enabled: true,
    title: { en: 'Product Leadership Thinking', ar: 'رؤى القيادة في إدارة المنتجات' },
    subtitle: {
      en: 'Perspectives on outcome roadmaps, product metrics, and autonomous squads.',
      ar: 'مقالات وأبحاث في خرائط طريق النتائج ومقاييس المنتجات الحية وفرق العمل الرشيقة.',
    },
    ctaText: { en: 'Explore Insights', ar: 'استكشف كافة الرؤى' },
    ctaHref: '/insights',
    selectionMode: 'featured',
    categorySlug: 'all',
    maxCount: 3,
    selectedSlugs: [],
  },
  insights: DEFAULT_HOW_WE_DO_IT_INSIGHTS,
  clientReview: {
    enabled: true,
    quote: productManagementData.quote.text,
    author: productManagementData.quote.author,
    role: productManagementData.quote.role,
    badge: { en: 'Head of Digital Products', ar: 'رئيس المنتجات الرقمية' },
  },
  faqsEnabled: true,
  faqsTitle: { en: 'Frequently Asked Questions', ar: 'الأسئلة الأكثر شيوعاً' },
  faqsSubtitle: {
    en: 'Common questions on modern product management and our collaborative agile pods.',
    ar: 'إجابات حول منهجيات إدارة المنتجات الحديثة وتكامل فرق العمل الرشيقة.',
  },
  faqs: productManagementData.faqs,
  contactEnabled: true,
};

export const defaultEngineeringTechnologyCmsData: HowWeDoItFeatureCmsData = {
  page: 'how-we-do-it-engineering-technology',
  slug: 'engineering-technology',
  seo: {
    title: {
      en: 'Engineering & Technology — Composable Cloud & Microservices | Persici',
      ar: 'الهندسة والتكنولوجيا — البنى السحابية المرنة والخدمات المصغرة | بيرسيشي',
    },
    description: {
      en: 'Lead the way with agile engineering, cloud-native scalability, microservices architectures, and rapid software delivery by Persici.',
      ar: 'ريادة المشهد عبر الهندسة الرشيقة وبنى الخدمات المصغرة والأنظمة السحابية القابلة للتوسع وتسريع دورات تطوير البرمجيات بواسطة بيرسيشي.',
    },
  },
  hero: {
    enabled: true,
    tag: engineeringTechnologyData.hero.tag,
    secondaryTag: engineeringTechnologyData.hero.secondaryTag,
    title: engineeringTechnologyData.hero.title,
    subtitle: engineeringTechnologyData.hero.subtitle,
    ctaText: engineeringTechnologyData.hero.ctaText,
    ctaHref: engineeringTechnologyData.hero.ctaHref,
    image: engineeringTechnologyData.hero.image,
  },
  offeringsEnabled: true,
  offeringsBadge: { en: 'Engineering Capabilities', ar: 'القدرات الهندسية' },
  offeringsTitle: engineeringTechnologyData.offeringsTitle,
  offeringsSubtitle: engineeringTechnologyData.offeringsSubtitle,
  offerings: engineeringTechnologyData.offerings.map((o, idx) => ({
    slug: `engineering-pillar-${idx + 1}`,
    tag: o.tag,
    title: o.title,
    description: o.description,
    diagramType: o.diagramType || 'de-microservices-mesh',
    icon: o.icon,
  })),
  whyItMatters: {
    enabled: true,
    title: engineeringTechnologyData.whyItMatters.title,
    text: engineeringTechnologyData.whyItMatters.text,
    image: engineeringTechnologyData.whyItMatters.image,
  },
  benefitsStrip: {
    enabled: true,
    title: engineeringTechnologyData.benefitsStrip.title,
    image: engineeringTechnologyData.benefitsStrip.image,
    benefits: engineeringTechnologyData.benefitsStrip.benefits,
  },
  engagementModel: {
    enabled: true,
    badge: { en: 'Engineering Velocity Pipeline', ar: 'مسار السرعة الهندسية' },
    title: {
      en: 'Modern Continuous Delivery Architecture',
      ar: 'معمارية التسليم المستمر الحديثة',
    },
    subtitle: {
      en: 'Automated infrastructure and testing ensuring zero-friction software shipping.',
      ar: 'بنية تحتية واختبارات مؤتمتة تضمن إطلاق البرمجيات بسلاسة وأمان تام.',
    },
    steps: [
      {
        number: '01',
        title: { en: 'Composable Architecture', ar: 'المعمارية المجمعة' },
        description: {
          en: 'Decoupled microservices and unified API gateways eliminating monolithic bottlenecks.',
          ar: 'خدمات مصغرة مستقلة وبوابات واجهات موحدة تكسر قيود الأنظمة المتكلسة.',
        },
      },
      {
        number: '02',
        title: { en: 'Infrastructure as Code', ar: 'البنية التحتية كبرمجيات' },
        description: {
          en: 'Terraform and Kubernetes cluster provisioning for reproducible, scalable cloud environments.',
          ar: 'إدارة السحابة عبر Terraform وKubernetes لبيئات متطابقة وسريعة التوسع.',
        },
      },
      {
        number: '03',
        title: { en: 'Automated CI/CD', ar: 'مسارات الأتمتة المستمرة' },
        description: {
          en: 'Blue-green and canary zero-downtime deployments releasing safely multiple times daily.',
          ar: 'نشر تدريجي دون انقطاع يطلق التحديثات البرمجية بأمان تام عدة مرات يومياً.',
        },
      },
      {
        number: '04',
        title: { en: 'Zero-Trust Telemetry', ar: 'الموثوقية والرقابة الفورية' },
        description: {
          en: 'Distributed tracing, proactive APM observability, and sovereign security compliance.',
          ar: 'تتبع شامل للأداء، ومراقبة استباقية، وامتثال كامل لأعلى معايير الأمن السيادي.',
        },
      },
    ],
  },
  techStackEnabled: true,
  techStackBadge: { en: 'Technology Stack', ar: 'المنظومة التقنية' },
  techStackTitle: {
    en: 'Cloud-Native Engineering Ecosystem',
    ar: 'منظومة الهندسة السحابية المتكاملة',
  },
  techStackSubtitle: {
    en: 'Enterprise frameworks and cloud infrastructure built for resilience and zero-downtime execution.',
    ar: 'أطر عمل سحابية ومؤسسية مبنية لأعلى درجات الاستقرار والتشغيل المتواصل دون انقطاع.',
  },
  techStackPods: engineeringTechnologyData.techStackPods,
  clientStoriesConfig: {
    enabled: true,
    badge: { en: 'Engineering Case Studies', ar: 'قصص النجاح الهندسية' },
    title: {
      en: 'Platforms Built for Scalable High-Throughput Execution',
      ar: 'منصات شُيدت لأعلى معدلات الحركة والتوسع',
    },
    subtitle: {
      en: 'Explore how our cloud-native architectures handle millions of daily interactions seamlessly.',
      ar: 'اكتشف كيف تتعامل بنانا السحابية مع ملايين التفاعلات اليومية بسلاسة وموثوقية تامة.',
    },
    selectionMode: 'featured',
    categorySlug: 'all',
    maxCount: 3,
    selectedSlugs: [
      'hala-food-mobile-app-development',
      'chopon-sourcing-engine-for-luxury-timepieces',
      'protes-sports-technical-restoration',
    ],
  },
  clientStories: DEFAULT_HOW_WE_DO_IT_CLIENT_STORIES,
  insightsConfig: {
    enabled: true,
    title: { en: 'Engineering & Architecture Insights', ar: 'رؤى وتحليلات الهندسة المعمارية' },
    subtitle: {
      en: 'Deep dives on microservices, cloud cost optimization, and developer velocity.',
      ar: 'مقالات تخصصية في الخدمات المصغرة، وتحسين تكاليف السحابة، وتسريع إنتاجية المطورين.',
    },
    ctaText: { en: 'Explore Insights', ar: 'استكشف كافة الرؤى' },
    ctaHref: '/insights',
    selectionMode: 'featured',
    categorySlug: 'all',
    maxCount: 3,
    selectedSlugs: [],
  },
  insights: DEFAULT_HOW_WE_DO_IT_INSIGHTS,
  clientReview: {
    enabled: true,
    quote: engineeringTechnologyData.quote.text,
    author: engineeringTechnologyData.quote.author,
    role: engineeringTechnologyData.quote.role,
    badge: { en: 'Chief Technology Officer', ar: 'الرئيس التنفيذي للتكنولوجيا' },
  },
  faqsEnabled: true,
  faqsTitle: { en: 'Frequently Asked Questions', ar: 'الأسئلة الأكثر شيوعاً' },
  faqsSubtitle: {
    en: 'Questions on enterprise cloud migration, code quality standards, and multi-cloud resilience.',
    ar: 'إجابات حول الانتقال السحابي، ومعايير جودة الكود، وموثوقية السحابة المتعددة.',
  },
  faqs: engineeringTechnologyData.faqs,
  contactEnabled: true,
};

export const defaultExperienceTransformationCmsData: HowWeDoItFeatureCmsData = {
  page: 'how-we-do-it-experience-transformation',
  slug: 'experience-transformation',
  seo: {
    title: {
      en: 'Experience Transformation — Human-Centered Design Systems | Persici',
      ar: 'تحول تجربة المستخدم — التصميم المتمحور حول الإنسان وأنظمة التصميم | بيرسيشي',
    },
    description: {
      en: 'Elevating expectations through future-ready, human-centered design, enterprise design systems, and omnichannel journey transformation by Persici.',
      ar: 'الارتقاء بالتطلعات عبر تصميم مستقبلي متمحور حول الإنسان، وأنظمة تصميم موحدة، ورحلات عملاء متكاملة عبر كافة القنوات بواسطة بيرسيشي.',
    },
  },
  hero: {
    enabled: true,
    tag: experienceTransformationData.hero.tag,
    secondaryTag: experienceTransformationData.hero.secondaryTag,
    title: experienceTransformationData.hero.title,
    subtitle: experienceTransformationData.hero.subtitle,
    ctaText: experienceTransformationData.hero.ctaText,
    ctaHref: experienceTransformationData.hero.ctaHref,
    image: experienceTransformationData.hero.image,
  },
  offeringsEnabled: true,
  offeringsBadge: { en: 'Experience Domains', ar: 'مجالات تجربة المستخدم' },
  offeringsTitle: experienceTransformationData.offeringsTitle,
  offeringsSubtitle: experienceTransformationData.offeringsSubtitle,
  offerings: experienceTransformationData.offerings.map((o, idx) => ({
    slug: `experience-pillar-${idx + 1}`,
    tag: o.tag,
    title: o.title,
    description: o.description,
    diagramType: o.diagramType || 'creative-story-lens',
    icon: o.icon,
  })),
  whyItMatters: {
    enabled: true,
    title: experienceTransformationData.whyItMatters.title,
    text: experienceTransformationData.whyItMatters.text,
    image: experienceTransformationData.whyItMatters.image,
  },
  benefitsStrip: {
    enabled: true,
    title: experienceTransformationData.benefitsStrip.title,
    image: experienceTransformationData.benefitsStrip.image,
    benefits: experienceTransformationData.benefitsStrip.benefits,
  },
  engagementModel: {
    enabled: true,
    badge: { en: 'Experience Engineering Process', ar: 'منهجية هندسة التجربة' },
    title: {
      en: 'How We Transform Omnichannel Customer Journeys',
      ar: 'كيف نعيد هندسة رحلات العملاء متعددة القنوات',
    },
    subtitle: {
      en: 'A proven human-centered design workflow delivering high-converting, lovable experiences.',
      ar: 'مسار تصميم متمحور حول الإنسان يقدم تجارب استثنائية تحقق أعلى معدلات التحويل.',
    },
    steps: [
      {
        number: '01',
        title: { en: 'Ethnographic & CX Research', ar: 'الأبحاث والتحليل السلوكي' },
        description: {
          en: 'Uncovering unarticulated user needs through contextual inquiry and journey mapping.',
          ar: 'اكتشاف احتياجات العملاء غير المعلنة عبر المقابلات المعمقة وخرائط الرحلة.',
        },
      },
      {
        number: '02',
        title: { en: 'Design Systems & Tokens', ar: 'رموز وأنظمة التصميم' },
        description: {
          en: 'Architecting tokenized Figma libraries mapped directly to production React components.',
          ar: 'بناء مكتبات تصميم موحدة بالرموز البرمجية متوافقة مع مكونات React.',
        },
      },
      {
        number: '03',
        title: { en: 'Micro-Interaction Polish', ar: 'التفاعل الدقيق والجاذبية' },
        description: {
          en: 'Crafting responsive, delightful micro-interactions and frictionless checkout flows.',
          ar: 'صناعة تفاعلات دقيقة ممتعة ومسارات دفع خالية تماماً من أي عوائق.',
        },
      },
      {
        number: '04',
        title: { en: 'Continuous CX Telemetry', ar: 'الرصد المستمر للتجربة' },
        description: {
          en: 'Heatmaps, CSAT, NPS, and usability metrics tracked in real-time post-launch.',
          ar: 'متابعة الخرائط الحرارية ومؤشرات الرضا وسهولة الاستخدام فور الإطلاق.',
        },
      },
    ],
  },
  techStackEnabled: true,
  techStackBadge: { en: 'CX Toolchains', ar: 'منظومة أدوات التجربة' },
  techStackTitle: {
    en: 'Design Systems & Experience Telemetry',
    ar: 'أنظمة التصميم ورصد تجربة المستخدم',
  },
  techStackSubtitle: {
    en: 'Modern toolchains synchronizing design tokens, usability testing, and enterprise CRM touchpoints.',
    ar: 'أدوات حديثة توحد رموز التصميم واختبارات سهولة الاستخدام ونقاط الاتصال المؤسسية.',
  },
  techStackPods: experienceTransformationData.techStackPods,
  clientStoriesConfig: {
    enabled: true,
    badge: { en: 'Experience Case Studies', ar: 'قصص نجاح تجربة المستخدم' },
    title: {
      en: 'Human-Centered Journeys That Drove Customer Loyalty',
      ar: 'رحلات متمحورة حول الإنسان صنعت ولاءً دائماً',
    },
    subtitle: {
      en: 'Explore how elevated user experiences directly increased retention and customer lifetime value.',
      ar: 'اكتشف كيف ساهمت التجارب الاستثنائية في مضاعفة الاحتفاظ بالقيمة الدائمة للعملاء.',
    },
    selectionMode: 'featured',
    categorySlug: 'all',
    maxCount: 3,
    selectedSlugs: [
      'hala-food-mobile-app-development',
      'chopon-sourcing-engine-for-luxury-timepieces',
      'protes-sports-technical-restoration',
    ],
  },
  clientStories: DEFAULT_HOW_WE_DO_IT_CLIENT_STORIES,
  insightsConfig: {
    enabled: true,
    title: { en: 'Design Systems & UX Insights', ar: 'رؤى أنظمة التصميم وتجربة المستخدم' },
    subtitle: {
      en: 'Latest articles on omnichannel experience design, tokens, and usability benchmarks.',
      ar: 'أحدث مقالاتنا في تصميم التجارب الموحدة ورموز التصميم ومعايير سهولة الاستخدام.',
    },
    ctaText: { en: 'Explore Insights', ar: 'استكشف كافة الرؤى' },
    ctaHref: '/insights',
    selectionMode: 'featured',
    categorySlug: 'all',
    maxCount: 3,
    selectedSlugs: [],
  },
  insights: DEFAULT_HOW_WE_DO_IT_INSIGHTS,
  clientReview: {
    enabled: true,
    quote: experienceTransformationData.quote.text,
    author: experienceTransformationData.quote.author,
    role: experienceTransformationData.quote.role,
    badge: { en: 'Customer Experience Director', ar: 'مدير تجربة العملاء' },
  },
  faqsEnabled: true,
  faqsTitle: { en: 'Frequently Asked Questions', ar: 'الأسئلة الأكثر شيوعاً' },
  faqsSubtitle: {
    en: 'Common questions on experience ROI, design systems, and design-engineering parity.',
    ar: 'إجابات حول العائد الاستثماري للتجربة، وأنظمة التصميم، وتكامل التصميم مع البرمجة.',
  },
  faqs: experienceTransformationData.faqs,
  contactEnabled: true,
};

export const HOW_WE_DO_IT_FEATURE_DEFAULTS: Record<HowWeDoItFeatureSlug, HowWeDoItFeatureCmsData> = {
  'strategy-consulting': defaultStrategyConsultingCmsData,
  'digital-transformation-framework': defaultDigitalTransformationFrameworkCmsData,
  'product-management': defaultProductManagementCmsData,
  'engineering-technology': defaultEngineeringTechnologyCmsData,
  'experience-transformation': defaultExperienceTransformationCmsData,
};

export function getDefaultHowWeDoItFeatureCmsData(
  featureSlug: HowWeDoItFeatureSlug
): HowWeDoItFeatureCmsData {
  return HOW_WE_DO_IT_FEATURE_DEFAULTS[featureSlug] || defaultStrategyConsultingCmsData;
}

export function getDefaultHowWeDoItHubCmsData(): HowWeDoItHubCmsData {
  return defaultHowWeDoItHubCmsData;
}

// ---------------------------------------------------------------------------
// Normalization Helpers to Guarantee 100% Data Preservation & Fallback Safety
// ---------------------------------------------------------------------------

function pickBi(
  custom: { en?: string; ar?: string } | undefined | null,
  fallback: { en: string; ar: string }
): LocalizedString {
  const en =
    typeof custom?.en === 'string' && custom.en.trim().length > 0 ? custom.en : fallback.en;
  const ar =
    typeof custom?.ar === 'string' && custom.ar.trim().length > 0 ? custom.ar : fallback.ar;
  return { en, ar };
}

function pickStr(custom: string | undefined | null, fallback: string | undefined = ''): string {
  if (typeof custom === 'string' && custom.trim().length > 0) return custom;
  return fallback || '';
}

export function normalizeHowWeDoItHubPageData(
  raw?: Partial<HowWeDoItHubCmsData> | null
): HowWeDoItHubCmsData {
  const src = raw || {};
  const def = defaultHowWeDoItHubCmsData;

  const csCfg = src.clientStoriesConfig || def.clientStoriesConfig;
  const insCfg = src.insightsConfig || def.insightsConfig;

  return {
    ...def,
    ...src,
    page: 'how-we-do-it',
    seo: {
      title: pickBi(src.seo?.title, def.seo?.title || { en: 'How We Do It', ar: 'كيف نقوم بالعمل' }),
      description: pickBi(
        src.seo?.description,
        def.seo?.description || { en: 'Our Methodology', ar: 'منهجيتنا في العمل' }
      ),
    },
    heroEnabled: src.heroEnabled !== false,
    heroBadge: pickBi(src.heroBadge, def.heroBadge),
    heroTitle: pickBi(src.heroTitle, def.heroTitle),
    heroSubtitle: pickBi(src.heroSubtitle, def.heroSubtitle),
    heroCtaPrimary: pickBi(src.heroCtaPrimary, def.heroCtaPrimary),
    heroCtaSecondary: pickBi(src.heroCtaSecondary, def.heroCtaSecondary),
    heroImage: pickStr(src.heroImage, def.heroImage),

    offeringsEnabled: src.offeringsEnabled !== false,
    offeringsTitle: pickBi(src.offeringsTitle, def.offeringsTitle),
    offeringsSubtitle: pickBi(src.offeringsSubtitle, def.offeringsSubtitle),
    offeringsList:
      Array.isArray(src.offeringsList) && src.offeringsList.length > 0
        ? src.offeringsList.map((item, idx) => {
            const fb = def.offeringsList[idx] || def.offeringsList[0];
            return {
              ...fb,
              ...item,
              title: pickBi(item.title, fb.title),
              description: pickBi(item.description, fb.description),
              tag: pickBi(item.tag, fb.tag),
              slug: pickStr(item.slug, fb.slug),
              href: pickStr(item.href, fb.href),
              diagramType: item.diagramType || fb.diagramType,
            };
          })
        : def.offeringsList,

    frameworkEnabled: src.frameworkEnabled !== false,
    frameworkTitle: pickBi(src.frameworkTitle, def.frameworkTitle),
    frameworkSubtitle: pickBi(src.frameworkSubtitle, def.frameworkSubtitle),
    frameworkPillars:
      Array.isArray(src.frameworkPillars) && src.frameworkPillars.length > 0
        ? src.frameworkPillars.map((p, idx) => {
            const fb = def.frameworkPillars[idx] || def.frameworkPillars[0];
            return {
              letter: pickStr(p.letter, fb.letter),
              name: pickBi(p.name, fb.name),
              description: pickBi(p.description, fb.description),
            };
          })
        : def.frameworkPillars,

    deliveryEnabled: src.deliveryEnabled !== false,
    deliveryTitle: pickBi(src.deliveryTitle, def.deliveryTitle),
    deliverySubtitle: pickBi(src.deliverySubtitle, def.deliverySubtitle),
    deliveryImage: pickStr(src.deliveryImage, def.deliveryImage),
    deliveryPillars:
      Array.isArray(src.deliveryPillars) && src.deliveryPillars.length > 0
        ? src.deliveryPillars.map((p, idx) => {
            const fb = def.deliveryPillars[idx] || def.deliveryPillars[0];
            return {
              number: pickStr(p.number, fb.number),
              title: pickBi(p.title, fb.title),
              description: pickBi(p.description, fb.description),
            };
          })
        : def.deliveryPillars,

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
    insightsTitle: pickBi(src.insightsTitle, def.insightsTitle || def.insightsConfig.title),
    insightsSubtitle: pickBi(src.insightsSubtitle, def.insightsSubtitle || def.insightsConfig.subtitle),
    insightsCtaText: pickBi(src.insightsCtaText, def.insightsCtaText || def.insightsConfig.ctaText),
    insightsList:
      Array.isArray(src.insightsList) && src.insightsList.length > 0
        ? src.insightsList
        : def.insightsList,

    quoteEnabled: src.quoteEnabled !== false,
    quoteText: pickBi(src.quoteText, def.quoteText),
    quoteAuthor: pickStr(src.quoteAuthor, def.quoteAuthor),
    quoteRole: pickBi(src.quoteRole, def.quoteRole),
    quoteBadge: pickBi(src.quoteBadge, def.quoteBadge || { en: 'Executive Quote', ar: 'شهادة القيادة' }),

    faqsEnabled: src.faqsEnabled !== false,
    faqsTitle: pickBi(src.faqsTitle, def.faqsTitle),
    faqsSubtitle: pickBi(src.faqsSubtitle, def.faqsSubtitle),
    faqs:
      Array.isArray(src.faqs) && src.faqs.length > 0
        ? src.faqs.map((f, idx) => {
            const fb = def.faqs[idx] || def.faqs[0];
            return {
              question: pickBi(f.question, fb.question),
              answer: pickBi(f.answer, fb.answer),
            };
          })
        : def.faqs,

    contactEnabled: src.contactEnabled !== false,
    contactSection: {
      enabled: src.contactSection?.enabled !== false && src.contactEnabled !== false,
      title: src.contactSection?.title,
      subtitle: src.contactSection?.subtitle,
    },
  };
}

export function normalizeHowWeDoItFeaturePageData(
  slugOrPage: string,
  raw?: Partial<HowWeDoItFeatureCmsData> | null
): HowWeDoItFeatureCmsData {
  const canonicalSlug = extractHowWeDoItFeatureSlug(slugOrPage) || 'strategy-consulting';
  const src = raw || {};
  const def = getDefaultHowWeDoItFeatureCmsData(canonicalSlug);

  const csCfg = src.clientStoriesConfig || def.clientStoriesConfig;
  const insCfg = src.insightsConfig || def.insightsConfig;

  return {
    ...def,
    ...src,
    page: `how-we-do-it-${canonicalSlug}`,
    slug: canonicalSlug,
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
    },
    offeringsEnabled: src.offeringsEnabled !== false,
    offeringsBadge: pickBi(src.offeringsBadge, def.offeringsBadge),
    offeringsTitle: pickBi(src.offeringsTitle, def.offeringsTitle),
    offeringsSubtitle: pickBi(src.offeringsSubtitle, def.offeringsSubtitle),
    offerings:
      Array.isArray(src.offerings) && src.offerings.length > 0
        ? src.offerings.map((item, idx) => {
            const fb = def.offerings[idx] || def.offerings[0];
            return {
              slug: pickStr(item.slug, fb.slug),
              tag: pickBi(item.tag, fb.tag),
              title: pickBi(item.title, fb.title),
              description: pickBi(item.description, fb.description),
              diagramType: item.diagramType || fb.diagramType,
              icon: item.icon || fb.icon,
            };
          })
        : def.offerings,
    whyItMatters: {
      enabled: src.whyItMatters?.enabled !== false,
      title: pickBi(src.whyItMatters?.title, def.whyItMatters.title),
      text: pickBi(src.whyItMatters?.text, def.whyItMatters.text),
      image: pickStr(src.whyItMatters?.image, def.whyItMatters.image),
    },
    benefitsStrip: {
      enabled: src.benefitsStrip?.enabled !== false,
      title: pickBi(src.benefitsStrip?.title, def.benefitsStrip.title),
      image: pickStr(src.benefitsStrip?.image, def.benefitsStrip.image),
      benefits:
        Array.isArray(src.benefitsStrip?.benefits) && src.benefitsStrip.benefits.length > 0
          ? src.benefitsStrip.benefits.map((b, idx) => {
              const fb = def.benefitsStrip.benefits[idx] || def.benefitsStrip.benefits[0];
              return {
                title: pickBi(b.title, fb.title),
                description: pickBi(b.description, fb.description),
                accentColor: pickStr(b.accentColor, fb.accentColor),
              };
            })
          : def.benefitsStrip.benefits,
    },
    engagementModel: {
      enabled: src.engagementModel?.enabled !== false,
      badge: pickBi(src.engagementModel?.badge, def.engagementModel.badge || { en: 'Lifecycle', ar: 'دورة العمل' }),
      title: pickBi(src.engagementModel?.title, def.engagementModel.title),
      subtitle: pickBi(src.engagementModel?.subtitle, def.engagementModel.subtitle),
      steps:
        Array.isArray(src.engagementModel?.steps) && src.engagementModel.steps.length > 0
          ? src.engagementModel.steps.map((st, idx) => {
              const fb = def.engagementModel.steps[idx] || def.engagementModel.steps[0];
              return {
                number: pickStr(st.number, fb.number),
                title: pickBi(st.title, fb.title),
                description: pickBi(st.description, fb.description),
              };
            })
          : def.engagementModel.steps,
    },
    techStackEnabled: src.techStackEnabled !== false,
    techStackBadge: pickBi(src.techStackBadge, def.techStackBadge),
    techStackTitle: pickBi(src.techStackTitle, def.techStackTitle),
    techStackSubtitle: pickBi(src.techStackSubtitle, def.techStackSubtitle),
    techStackPods:
      Array.isArray(src.techStackPods) && src.techStackPods.length > 0
        ? src.techStackPods.map((pod, idx) => {
            const fb = def.techStackPods[idx] || def.techStackPods[0];
            return {
              title: pickBi(pod.title, fb.title),
              badge: pod.badge
                ? pickBi(pod.badge, fb.badge || { en: '', ar: '' })
                : fb.badge,
              description: pickBi(pod.description, fb.description),
              technologies:
                Array.isArray(pod.technologies) && pod.technologies.length > 0
                  ? pod.technologies.map((t, tIdx) => {
                      const fbTech = fb.technologies[tIdx] || fb.technologies[0];
                      return {
                        name: pickStr(t?.name, fbTech.name),
                        category: pickStr(t?.category, fbTech.category),
                        badge: t?.badge || fbTech.badge,
                      };
                    })
                  : fb.technologies,
            };
          })
        : def.techStackPods,
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
      badge: pickBi(src.clientReview?.badge, def.clientReview.badge || { en: 'Executive Review', ar: 'شهادة العميل' }),
      ...(src.clientReview?.avatar ? { avatar: String(src.clientReview.avatar) } : {}),
    },
    faqsEnabled: src.faqsEnabled !== false,
    faqsTitle: pickBi(src.faqsTitle, def.faqsTitle),
    faqsSubtitle: pickBi(src.faqsSubtitle, def.faqsSubtitle),
    faqs:
      Array.isArray(src.faqs) && src.faqs.length > 0
        ? src.faqs.map((f, idx) => {
            const fb = def.faqs[idx] || def.faqs[0];
            return {
              question: pickBi(f.question, fb.question),
              answer: pickBi(f.answer, fb.answer),
            };
          })
        : def.faqs,
    techStackPodsTitle: src.techStackPodsTitle || src.techStackTitle || def.techStackTitle,
    techStackPodsSubtitle: src.techStackPodsSubtitle || src.techStackSubtitle || def.techStackSubtitle,
    quote: {
      text: pickBi(src.quote?.text, def.clientReview.quote),
      author: pickStr(src.quote?.author, def.clientReview.author),
      role: pickBi(src.quote?.role, def.clientReview.role),
    },
    contactEnabled: src.contactEnabled !== false,
    contactSection: {
      enabled: src.contactSection?.enabled !== false && src.contactEnabled !== false,
      title: src.contactSection?.title,
      subtitle: src.contactSection?.subtitle,
    },
  };
}
