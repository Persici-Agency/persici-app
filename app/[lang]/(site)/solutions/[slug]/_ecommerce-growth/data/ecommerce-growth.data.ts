import type { SolutionDiagramType, FeaturedClientStoryItem, SolutionBenefitItem, SolutionExecutionPillar, SolutionFaqItem } from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { getEcommerceGrowthFeaturedClientStories } from '@shared/data';

export interface EcommerceOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface EcommercePartnerItem {
  name: string;
  role: { en: string; ar: string };
  logo: string;
}

export interface EcommerceVerticalItem {
  id: string;
  number: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  tag: { en: string; ar: string };
  iconName: string;
  capabilities: { en: string[]; ar: string[] };
}

export interface TechStackPod {
  title: { en: string; ar: string };
  badge: { en: string; ar: string };
  description: { en: string; ar: string };
  technologies: { name: string; category: string; badge?: string }[];
}

export interface EcommerceGrowthData {
  hero: {
    tag: { en: string; ar: string };
    secondaryTag: { en: string; ar: string };
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    ctaText: { en: string; ar: string };
    ctaHref: string;
    image: string;
    highlights: { en: string; ar: string }[];
  };
  partnerShowcase: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    video: {
      src: string;
      poster?: string;
      title: { en: string; ar: string };
      caption: { en: string; ar: string };
      partnerBadge: { en: string; ar: string };
    };
    partners: EcommercePartnerItem[];
  };
  offeringsTitle: { en: string; ar: string };
  offeringsSubtitle: { en: string; ar: string };
  offerings: EcommerceOfferingItem[];
  whyItMatters: {
    title: { en: string; ar: string };
    text: { en: string; ar: string };
    image: string;
    metric1Val: string;
    metric1Label: { en: string; ar: string };
    metric2Val: string;
    metric2Label: { en: string; ar: string };
  };
  benefitsStrip: {
    title: { en: string; ar: string };
    image: string;
    benefits: SolutionBenefitItem[];
  };
  verticalsTitle: { en: string; ar: string };
  verticalsSubtitle: { en: string; ar: string };
  verticals: EcommerceVerticalItem[];
  techStackTitle: { en: string; ar: string };
  techStackSubtitle: { en: string; ar: string };
  techStackPods: TechStackPod[];
  clientStories: FeaturedClientStoryItem[];
  delivery: {
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    image: string;
    pillars: SolutionExecutionPillar[];
  };
  insights: ContentCardItem[];
  clientReview: {
    quote: { en: string; ar: string };
    author: string;
    role: { en: string; ar: string };
    badge: { en: string; ar: string };
  };
  faqsTitle: { en: string; ar: string };
  faqsSubtitle: { en: string; ar: string };
  faqs: SolutionFaqItem[];
}

export const ecommerceGrowthData: EcommerceGrowthData = {
  hero: {
    tag: {
      en: 'Solutions & Growth Architecture',
      ar: 'الحلول وبنية النمو المؤسسي',
    },
    secondaryTag: {
      en: 'E-Commerce Growth',
      ar: 'النمو في التجارة الإلكترونية',
    },
    title: {
      en: 'Turning Digital Commerce Into a Scalable Growth Engine',
      ar: 'تحويل التجارة الرقمية إلى محرك نمو مؤسسي قابل للتوسع المستدام',
    },
    subtitle: {
      en: 'Launch a transformative era of seamless digital-first commerce. From high-converting storefront architecture to full-funnel media and automated customer retention, we scale your direct-to-consumer and enterprise brand across the GCC.',
      ar: 'أطلق حقبة تحولية من التجارة الرقمية السلسة والمتقدمة لعلامتك التجارية. من معمارية المتاجر فائقة التحويل إلى إعلانات الأداء وبرامج الاحتفاظ بالعملاء، نُمكّن علامتك من التوسع والريادة عبر أسواق الخليج.',
    },
    ctaText: {
      en: 'Schedule Strategy Audit',
      ar: 'احجز جلسة تدقيق استراتيجية',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=1400&q=85',
    highlights: [
      {
        en: 'Certified Enterprise Platforms: Shopify Plus, Salla, Zid & Headless',
        ar: 'منصات مؤسسية معتمدة: شوبيفاي بلس، سلة، زد والأنظمة الهجينة',
      },
      {
        en: 'Sub-Second Localized Checkout (Mada, Apple Pay, Tabby, Tamara)',
        ar: 'إنهاء فوري للشراء (مدى، أبل باي، تابي، وتمارا)',
      },
      {
        en: 'Full-Funnel Algorithmic Acquisition (Google, Meta, TikTok, Snapchat)',
        ar: 'استحواذ رقمي خوارزمي متكامل (جوجل، ميتا، تيك توك، وسناب شات)',
      },
      {
        en: 'Automated Lifecycle Retention & Compounding Customer LTV Loops',
        ar: 'مسارات استبقاء مؤتمتة ومضاعفة القيمة الدائمة للعملاء',
      },
    ],
  },

  partnerShowcase: {
    badge: {
      en: 'Platforms We Master',
      ar: 'المنصات التي نتقنها',
    },
    title: {
      en: 'Powered by Industry Leaders',
      ar: 'مدعومون بشراكات استراتيجية مع رواد الصناعة',
    },
    description: {
      en: 'We partner with top-tier technology and advertising platforms to turn your business goals into measurable success. From certified MENA commerce engines like Salla and Zid to global retail giants and ad networks.',
      ar: 'نتعاون مع كبرى المنصات التقنية والإعلانية العالمية والإقليمية لتحويل أهدافك التجارية إلى نجاحات ملموسة. من منصات التجارة المعتمدة في المنطقة مثل سلة وزد إلى عمالقة التكنولوجيا وشبكات الإعلانات الدولية.',
    },
    video: {
      src: '/videos/solutions/e-commerce/salla-logeria-store-story-video.mp4',
      poster: '/videos/solutions/e-commerce/salla-logeria-store-story-video-poster.jpg',
      title: {
        en: 'Logeria Store Story: An Idea Turned Into Reality on Salla Platform',
        ar: 'قصة متجر لوجيريا: فكرة صارت حقيقة على منصة سلة',
      },
      caption: {
        en: 'Watch how Persici engineered a bespoke luxury storefront on Salla, driving a +340% sales surge and sub-second checkout for Logeria.',
        ar: 'شاهد كيف صممت بيرسيكي متجراً فاخراً على منصة سلة، مما حقق نمواً بنسبة 340% في المبيعات وتجربة شراء في أجزاء من الثانية لمتجر لوجيريا.',
      },
      partnerBadge: {
        en: 'Official Salla Enterprise Partner',
        ar: 'شريك سلة المعتمد للمؤسسات',
      },
    },
    partners: [
      {
        name: 'Salla',
        role: {
          en: 'Certified Enterprise Commerce',
          ar: 'منصة التجارة المؤسسية الرائدة',
        },
        logo: '/images/solutions/e-commerce/Partners/salla_logo.jpg',
      },
      {
        name: 'Zid',
        role: {
          en: 'Retail Growth Ecosystem',
          ar: 'منظومة نمو تجارة التجزئة',
        },
        logo: '/images/solutions/e-commerce/Partners/zid_logo_h.jpg',
      },
      {
        name: 'Shopify Plus',
        role: {
          en: 'Global Headless Architecture',
          ar: 'المعمارية العالمية للتجارة الرقمية',
        },
        logo: '/images/solutions/e-commerce/Partners/shopify_logo_h.jpg',
      },
      {
        name: 'WordPress / WooCommerce',
        role: {
          en: 'Custom Open Commerce',
          ar: 'تطوير المتاجر المفتوحة المخصصة',
        },
        logo: '/images/solutions/e-commerce/Partners/wordpress_logo_h.jpg',
      },
      {
        name: 'Google Ads',
        role: {
          en: 'High-Intent Search & Shopping',
          ar: 'إعلانات البحث والتسوق عالي النية',
        },
        logo: '/images/solutions/e-commerce/Partners/google_ads_logo_h.jpg',
      },
      {
        name: 'Meta Ads',
        role: {
          en: 'Instagram & Facebook Scale',
          ar: 'إعلانات إنستغرام وفيسبوك الموجهة',
        },
        logo: '/images/solutions/e-commerce/Partners/meta_logo_h.jpg',
      },
      {
        name: 'TikTok for Business',
        role: {
          en: 'Viral Social Commerce',
          ar: 'التجارة الاجتماعية وحملات الانتشار',
        },
        logo: '/images/solutions/e-commerce/Partners/tiktok_logo_h.jpg',
      },
      {
        name: 'Snapchat Ads',
        role: {
          en: 'GCC AR & Immersive Video',
          ar: 'إعلانات سناب شات والواقع المعزز بالخليج',
        },
        logo: '/images/solutions/e-commerce/Partners/snapchat_logo_h.jpg',
      },
    ],
  },

  offeringsTitle: {
    en: 'How We Drive Commerce Growth',
    ar: 'كيف نقود النمو في التجارة الإلكترونية',
  },
  offeringsSubtitle: {
    en: 'Six specialized disciplines engineered to turn browsers into loyal brand champions and accelerate sustainable retail profitability.',
    ar: 'ستة مجالات تخصصية دقيقة مصممة لتحويل المتصفحين إلى عملاء أوفياء وتسريع الربحية المستدامة لعلامتك التجارية.',
  },
  offerings: [
    {
      slug: 'digital-commerce-strategy',
      tag: {
        en: 'Strategic Roadmap',
        ar: 'خارطة الطريق الاستراتيجية',
      },
      title: {
        en: 'Digital Commerce Strategy',
        ar: 'استراتيجية التجارة الرقمية',
      },
      description: {
        en: 'We build a clear, data-driven commerce roadmap aligned with your market dynamics, unit economics, customer lifetime value, and long-term expansion goals.',
        ar: 'نبني خارطة طريق رقمية واضحة ومبنية على البيانات تتماشى مع ديناميكيات السوق واقتصاديات الوحدة والقيمة الدائمة للعملاء لتحقيق أهدافك التوسعية.',
      },
      icon: '/icons/solutions/ecom-digital-strategy.svg',
      diagramType: 'growth-trajectory-engine',
      highlights: {
        en: [
          'Market Opportunity & Competitor Pricing Audits',
          'Unit Economics, Contribution Margin & CAC Modeling',
          'Platform Selection (Shopify Plus vs Salla vs Headless)',
          'GCC Regional Expansion & Cross-Border Logistics Strategy',
        ],
        ar: [
          'تدقيق فرص السوق وتسعير المنافسين',
          'نمذجة اقتصاديات الوحدة وهامش المساهمة وتكلفة الاستحواذ',
          'اختيار المنصة المثالية (شوبيفاي بلس، سلة، أو هيدلس)',
          'استراتيجيات التوسع الخليجي والخدمات اللوجستية العابرة للحدود',
        ],
      },
    },
    {
      slug: 'store-design-development',
      tag: {
        en: 'Storefront Engineering',
        ar: 'هندسة وتصميم المتاجر',
      },
      title: {
        en: 'Store Design & Development',
        ar: 'تصميم وتطوير المتاجر الإلكترونية',
      },
      description: {
        en: 'We design and develop seamless, ultra-fast online stores across Salla, Zid, and Shopify Plus that combine distinctive brand identity with frictionless conversion paths.',
        ar: 'نصمم ونطور متاجر إلكترونية فائقة السرعة والسلاسة عبر سلة، وزد، وشوبيفاي بلس تجمع بين الهوية البصرية الجذابة ومسارات الشراء سهلة التحويل.',
      },
      icon: '/icons/solutions/ecom-store-design.svg',
      diagramType: 'storefront-render-matrix',
      highlights: {
        en: [
          'Bespoke UX/UI Design & Micro-Interaction Design Systems',
          'Sub-Second Page Load Optimization (<1.2s Core Web Vitals)',
          'Native GCC Checkout (Mada, Apple Pay, Tamara, Tabby)',
          'Custom Theme Engineering & Headless Commerce APIs',
        ],
        ar: [
          'تصميم واجهات وتجارب مستخدم مخصصة وأنظمة تصميم متقدمة',
          'تحسين سرعة التحميل الفورية (مؤشرات حيوية أقل من 1.2 ثانية)',
          'بوابات دفع خليجية أصلية (مدى، أبل باي، تمارا، وتابي)',
          'تطوير قوالب برمجية خاصة وربط واجهات برمجة التطبيقات الهجينة',
        ],
      },
    },
    {
      slug: 'performance-marketing',
      tag: {
        en: 'Media Acquisition',
        ar: 'إعلانات الأداء والاستحواذ',
      },
      title: {
        en: 'Performance Marketing',
        ar: 'التسويق بالأداء والنمو المدفوع',
      },
      description: {
        en: 'We engineer and scale full-funnel paid media campaigns across Google, Meta, TikTok, and Snapchat to attract high-intent shoppers and generate predictable return on ad spend (ROAS).',
        ar: 'ندير ونوسع حملات مدفوعة متكاملة المراحل عبر جوجل، وميتا، وتيك توك، وسناب شات لجذب متسوقين ذوي رغبة شراء حقيقية وتحقيق عائد استثماري متوقع ومربح.',
      },
      icon: '/icons/solutions/ecom-performance-marketing.svg',
      diagramType: 'ad-targeting-matrix',
      highlights: {
        en: [
          'Algorithmic Bidding & Dynamic Catalog Ads (DPA)',
          'High-Velocity UGC & Creative Studio Testing Loops',
          'First-Party Conversion API (CAPI) & Server-Side Tracking',
          'Multi-Touch Attribution Modeling with Triple Whale & GA4',
        ],
        ar: [
          'مزايدة خوارزمية ذكية وإعلانات كتالوج ديناميكية (DPA)',
          'إنتاج واختبار مكثف لإعلانات المحتوى المنشأ من المستخدمين (UGC)',
          'ربط خوادم التحويل (CAPI) والتتبع المباشر من الخادم',
          'نمذجة عزو التحويلات متعددة اللمسات عبر Triple Whale و GA4',
        ],
      },
    },
    {
      slug: 'conversion-rate-optimization',
      tag: {
        en: 'Revenue Engineering',
        ar: 'هندسة معدلات التحويل',
      },
      title: {
        en: 'Conversion Rate Optimization (CRO)',
        ar: 'تحسين معدلات التحويل (CRO)',
      },
      description: {
        en: 'We continuously audit customer telemetry, run iterative split tests on key funnel steps, and eliminate checkout friction to extract maximum revenue from every single visitor.',
        ar: 'نقوم بتحليل سلوك المتسوقين باستمرار وإجراء اختبارات دقيقة على كل خطوة في مسار الشراء وإزالة معوقات الدفع لتحقيق أقصى إيراد من كل زائر.',
      },
      icon: '/icons/solutions/ecom-cro-optimization.svg',
      diagramType: 'cart-checkout-funnel',
      highlights: {
        en: [
          'Session Recording Audits & Heatmap Dropoff Analysis',
          'Rigorous A/B Testing on Product Pages (PDP) & Checkout',
          'One-Click Upsells, Cross-Sells & Dynamic Free Shipping Bars',
          'Average Order Value (AOV) Bundling & Tiered Volume Pricing',
        ],
        ar: [
          'تدقيق تسجيلات الجلسات وتحليل الخرائط الحرارية لمناطق الهدر',
          'اختبارات A/B تجريبية دقيقة على صفحات المنتجات والدفع',
          'عروض زيادة قيمة الطلب بنقرة واحدة وشريط الشحن المجاني الديناميكي',
          'حزم مضاعفة متوسط قيمة السلة (AOV) والتسعير المتدرج',
        ],
      },
    },
    {
      slug: 'omnichannel-marketplace-strategy',
      tag: {
        en: 'Multi-Channel Commerce',
        ar: 'التجارة متعددة القنوات',
      },
      title: {
        en: 'Omnichannel & Marketplace Strategy',
        ar: 'استراتيجية القنوات والأسواق المتعددة',
      },
      description: {
        en: 'Stay ahead of shifting consumer behaviors by synchronizing your web store, mobile apps, physical retail POS, and regional marketplaces like Amazon and Noon into one unified inventory engine.',
        ar: 'واكب تطلعات المتسوقين بمزامنة متجرك الإلكتروني وتطبيقك الذكي مع نقاط البيع الميدانية ومنصات البيع الكبرى مثل أمازون ونون في منظومة مخزون موحدة.',
      },
      icon: '/icons/solutions/ecom-omnichannel-marketplace.svg',
      diagramType: 'omnichannel-inventory-sync',
      highlights: {
        en: [
          'Amazon & Noon Marketplace Storefronts & Fulfillment (FBN/FBA)',
          'Unified Real-Time Inventory Sync Across Stores & POS',
          'Click & Collect, Store Pickup, and GCC Rapid Delivery Integration',
          'B2B Wholesale Portal Architecture with Custom Price Tiers',
        ],
        ar: [
          'إدارة وتوسيع المتاجر في أمازون ونون وخدمات الشحن اللوجستي',
          'مزامنة المخزون الفورية عبر كافة المتاجر ونقاط البيع الفعلية',
          'خدمات الاستلام من الفرع والتكامل مع أساطيل التوصيل السريع',
          'معمارية بوابات تجارة الجملة B2B مع تسعير مخصص للعملاء',
        ],
      },
    },
    {
      slug: 'retention-lifecycle-data',
      tag: {
        en: 'Compounding LTV',
        ar: 'الاحتفاظ ومضاعفة القيمة',
      },
      title: {
        en: 'Retention, Lifecycle Data & Growth',
        ar: 'الاحتفاظ بالعملاء والبيانات ودورة الحياة',
      },
      description: {
        en: 'We build automated SMS, WhatsApp, and email lifecycle flows (Klaviyo, Braze) alongside VIP loyalty programs to convert one-time buyers into high-margin repeat brand advocates.',
        ar: 'نبني مسارات تواصل مؤتمتة عبر الرسائل والواتساب والبريد (Klaviyo و Braze) وبرامج ولاء لتحويل المشترين لمرة واحدة إلى عملاء دائمين ذوي ولاء عالٍ.',
      },
      icon: '/icons/solutions/ecom-retention-lifecycle.svg',
      diagramType: 'retention-loop-orbit',
      highlights: {
        en: [
          'Predictive Churn & Repurchase Frequency Segmentation',
          'Automated WhatsApp & SMS Cart Abandonment Recovery Flows',
          'Klaviyo & Braze Lifecycle Flow Architecture (Welcome, Post-Purchase, Win-Back)',
          'Tiered VIP Loyalty Programs & Bespoke Referral Engines',
        ],
        ar: [
          'تقسيم العملاء التنبؤي وفترات تكرار الشراء المتوقعة',
          'مسارات استرجاع السلات المتروكة المؤتمتة عبر واتساب والرسائل القصيرة',
          'بناء مسارات تواصل مؤتمتة عبر Klaviyo و Braze (ترحيب، ما بعد الشراء، استعادة)',
          'برامج ولاء متدرجة لكبار العملاء وأنظمة إحالة بمكافآت مخصصة',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Turning Digital Commerce Into a Scalable Growth Engine',
      ar: 'تحويل التجارة الرقمية إلى محرك نمو مؤسسي متكامل',
    },
    text: {
      en: 'At Persici, we go beyond building online stores. We create fully integrated digital commerce experiences that combine strategy, technology, creative execution, performance marketing, and data under one powerful growth ecosystem. From platform development and seamless user experience to paid media, analytics, and conversion optimization, we manage every stage of the customer journey. Our expertise across Shopify Plus, Salla, Zid, WordPress, Google, Meta, TikTok, and Snapchat enables us to build scalable solutions tailored to each brand’s market and business goals. By connecting technology, creativity, and performance, we help brands attract the right customers, increase conversions, reduce acquisition costs, and achieve sustainable revenue growth. Persici turns digital commerce into a scalable, continuously optimized engine for long-term business success.',
      ar: 'في بيرسيكي، نتجاوز مجرد بناء متجر إلكتروني تقليدي. نحن نبتكر تجارب تجارة رقمية متكاملة تماماً تجمع بين الاستراتيجية، والتقنية المتقدمة، والتنفيذ الإبداعي، والتسويق بالأداء، والبيانات تحت مظلة منظومة نمو موحدة. من تطوير المنصات وتجربة المستخدم السلسة إلى الحملات الإعلانية، والتحليلات، وتحسين معدلات التحويل، ندير كل مرحلة من رحلة العميل. تمكننا خبراتنا عبر شوبيفاي بلس، وسلة، وزد، وووردبريس، وجوجل، وميتا، وتيك توك، وسناب شات من بناء حلول قابلة للتوسع مصممة خصيصاً لكل سوق وأهداف كل علامة تجارية.',
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85',
    metric1Val: '+340%',
    metric1Label: {
      en: 'Average GMV Scaling in 12 Months',
      ar: 'متوسط نمو المبيعات خلال 12 شهراً',
    },
    metric2Val: '3.6x',
    metric2Label: {
      en: 'Blended Cross-Channel ROAS',
      ar: 'متوسط العائد الإعلاني الإجمالي',
    },
  },

  benefitsStrip: {
    title: {
      en: 'Strategic Benefits of Persici Commerce Architecture',
      ar: 'المزايا الاستراتيجية لمعمارية التجارة الرقمية في بيرسيكي',
    },
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1600&q=85',
    benefits: [
      {
        title: {
          en: 'High-Velocity Storefront Architecture',
          ar: 'معمارية متاجر فائقة السرعة',
        },
        description: {
          en: 'Sub-second page loads and seamless mobile checkouts that minimize cart dropoffs and maximize session conversions.',
          ar: 'تحميل فوري في أجزاء من الثانية وتجربة دفع سلسة على الهواتف تمنع هدر السلات وترفع التحويلات.',
        },
        accentColor: '#D83427',
      },
      {
        title: {
          en: 'Lower CAC & Media Efficiency',
          ar: 'خفض تكلفة الاستحواذ وكفاءة الإعلانات',
        },
        description: {
          en: 'Algorithmic targeting across Meta, Google, and TikTok that maximizes profit margins and eliminates wasted ad spend.',
          ar: 'استهداف خوارزمي دقيق يرفع هوامش الأرباح الصافية ويقضي تماماً على الإنفاق الإعلاني المهدر.',
        },
        accentColor: '#EF8C7D',
      },
      {
        title: {
          en: 'Compounding Customer Lifetime Value',
          ar: 'مضاعفة القيمة الدائمة للعملاء (LTV)',
        },
        description: {
          en: 'Automated lifecycle loops and personalized VIP retention journeys that turn over 65% of revenue into repeat purchases.',
          ar: 'مسارات استبقاء ذكية وتجارب ولاء مخصصة تجعل أكثر من 65% من إجمالي الإيرادات متأتية من طلبات متكررة.',
        },
        accentColor: '#121212',
      },
      {
        title: {
          en: 'Localized GCC Commerce Mastery',
          ar: 'ريادة التجارة الموطنة للخليج',
        },
        description: {
          en: 'Native integrations with Mada, Apple Pay, Tamara, Tabby, Salla Enterprise, Zid Pro, and localized regional courier APIs.',
          ar: 'تكامل أصيل مع مدى، وأبل باي، وتمارا، وتابي، وسلة، وزد، والواجهات البرمجية لشركات الشحن الإقليمية.',
        },
        accentColor: '#D83427',
      },
    ],
  },

  verticalsTitle: {
    en: 'Domain Architectures & Industry Verticals',
    ar: 'المعمارية المتخصصة للقطاعات التجارية',
  },
  verticalsSubtitle: {
    en: 'Tailored e-commerce frameworks engineered around the unique purchase behaviors, supply chains, and customer expectations of each industry.',
    ar: 'أطر عمل للتجارة الإلكترونية مصممة خصيصاً لتلائم السلوك الشرائي، وسلاسل الإمداد، وتطلعات العملاء لكل قطاع.',
  },
  verticals: [
    {
      id: 'luxury-fragrance',
      number: '01',
      tag: {
        en: 'High-Ticket & Prestige',
        ar: 'السلع الفاخرة والقيمة العالية',
      },
      title: {
        en: 'Luxury Fragrance & Fine Beauty',
        ar: 'العطور الفاخرة ومستحضرات التجميل الراقية',
      },
      description: {
        en: 'Sensory storytelling, bespoke unboxing digital architecture, and sample-to-bottle conversion funnels tailored to prestigious GCC fragrance houses like Lahfaa.',
        ar: 'سرد قصصي حسي وتصميم رقمي فاخر لتجربة فتح الصندوق، مع مسارات تحويل من العينات إلى زجاجات العطور الكاملة مصممة لدور العطور الخليجية الفاخرة.',
      },
      iconName: 'Sparkles',
      capabilities: {
        en: [
          'Fragrance Profile & Olfactory Discovery Quizzes',
          'Discovery Set to Full Bottle Credit Deductions',
          'Luxury Gift Wrapping & Custom Engraving Checkouts',
          'High-Margin Loyalty Tiers with Private Member Access',
        ],
        ar: [
          'اختبارات استكشاف النوتات العطرية والميول الشخصية',
          'خصم قيمة عينات الاستكشاف عند شراء الزجاجة الأصلية',
          'خيارات تغليف الهدايا الفاخر والنقش المخصص عند الدفع',
          'برامج ولاء حصرية تتيح الوصول المبكر للإصدارات المحدودة',
        ],
      },
    },
    {
      id: 'd2c-fashion',
      number: '02',
      tag: {
        en: 'High-Velocity Retail',
        ar: 'تجزئة الأزياء سريعة النمو',
      },
      title: {
        en: 'Direct-to-Consumer Fashion & Apparel',
        ar: 'الأزياء والملابس المباشرة للمستهلك (D2C)',
      },
      description: {
        en: 'Dynamic visual lookbooks, seasonal drop countdowns, accurate localized size guidance, and instant frictionless mobile checkouts built for high-volume GCC fashion labels.',
        ar: 'كتالوجات أزياء بصرية تفاعلية، وعد تنازلي للإطلاقات الموسمية، ودليل مقاسات ذكي مع إنهاء فوري للشراء عبر الجوال لعلامات الأزياء الخليجية.',
      },
      iconName: 'ShoppingBag',
      capabilities: {
        en: [
          'Instant Size Recommender & Interactive Fit Guides',
          'Limited Drop Engines with Real-Time Stock Counters',
          'Integrated "Shop the Look" Bundling Checkouts',
          'Automated Tabby & Tamara Installment Breakdowns',
        ],
        ar: [
          'أداة التوصية الفورية بالمقاسات ودليل المقاسات التفاعلي',
          'محرك إطلاق المجموعات المحدودة مع عداد المخزون اللحظي',
          'ميزة "تسوق المظهر كاملاً" مع خصومات الحزم التلقائية',
          'عرض تفصيلي فوري لخطط التقسيط بدون فوائد عبر تابي وتمارا',
        ],
      },
    },
    {
      id: 'rare-horology',
      number: '03',
      tag: {
        en: 'High-Trust Marketplace',
        ar: 'أسواق الساعات والمجوهرات الموثقة',
      },
      title: {
        en: 'Rare Horology & Fine Jewelry',
        ar: 'الساعات النادرة والمجوهرات الثمينة',
      },
      description: {
        en: 'High-trust escrow rails, physical certificate verification, high-resolution zoom viewports, and VIP concierge checkout for ultra-valuable collectibles like ChopOn.',
        ar: 'مسارات ضمان مالي بنكية فائقة الأمان، وفحص شهادات الأصالة، وعدسات تكبير فائقة الدقة، وخدمة الكونسيرج المخصصة لصفقات الساعات الفاخرة.',
      },
      iconName: 'ShieldCheck',
      capabilities: {
        en: [
          'Bank-Grade Escrow Milestone Payment Integration',
          'Serial Number Database & Authenticity Registry',
          'Private Viewing Concierge Booking Architecture',
          'Insured White-Glove Armored Courier Dispatch',
        ],
        ar: [
          'تكامل بوابات الضمان المالي المصرفي على مراحل المعاملة',
          'قاعدة بيانات الأرقام التسلسلية وسجل توثيق الأصالة',
          'حجز مواعيد المعاينة الخاصة مع خبراء التقييم',
          'إدارة الشحن المؤمن عبر سيارات النقل المصفحة المتخصصة',
        ],
      },
    },
    {
      id: 'specialty-fnb',
      number: '04',
      tag: {
        en: 'Perishable & Subscription',
        ar: 'الأغذية والمشروبات التخصصية والاشتراكات',
      },
      title: {
        en: 'Specialty F&B & Consumer Packaged Goods',
        ar: 'الأغذية التخصصية والمنتجات الاستهلاكية السريعة',
      },
      description: {
        en: 'Subscription recurrence engines, temperature-controlled delivery slot scheduling, and rapid one-tap re-ordering pipelines for gourmet roasters, nutrition, and specialty foods.',
        ar: 'محركات اشتراكات دورية ذكية، وجدولة التوصيل المبرد في نوافذ زمنية محددة، وإعادة طلب بلمسة واحدة لمحامص القهوة والأغذية التخصصية.',
      },
      iconName: 'Truck',
      capabilities: {
        en: [
          'Recurring Subscription Billing (Recharge & Salla Subscriptions)',
          'Hyperlocal Delivery Window & Cold-Chain Slot Selection',
          'One-Tap Re-Order via Automated WhatsApp Bots',
          'Freshness Batch Expiration & Automated Stock Depletion',
        ],
        ar: [
          'فوترة الاشتراكات التلقائية (Recharge واشتراكات سلة)',
          'تحديد فترات التوصيل السريع المحلي مع التبريد المخصص',
          'إعادة الطلب بلمسة واحدة عبر روبوتات واتساب الذكية',
          'تتبع دفعات الإنتاج وتاريخ الصلاحية وتدوير المخزون آلياً',
        ],
      },
    },
    {
      id: 'sports-technical',
      number: '05',
      tag: {
        en: 'Performance Equipment',
        ar: 'العتاد الرياضي والمعدات التخصصية',
      },
      title: {
        en: 'Sports Equipment & Technical Gear',
        ar: 'العتاد الرياضي والمعدات التخصصية',
      },
      description: {
        en: 'Custom gear configuration matrices, technical specification filters, warranty registration portals, and regional club bulk ordering engines like Protes Sports.',
        ar: 'أدوات تخصيص وتجميع العتاد، وفلاتر المواصفات الفنية الدقيقة، وبوابات تسجيل الضمان، ومحركات طلبات الجملة للأندية والفرق الرياضية.',
      },
      iconName: 'Zap',
      capabilities: {
        en: [
          'Custom Equipment Builder & Personalization Configurator',
          'Technical Spec Matrix & Direct Product Comparison Tools',
          'B2B Club Purchase Orders & Bulk Volume Tiers',
          'Digital Serial Warranty Claim & Repair Tracking',
        ],
        ar: [
          'مُنشئ العتاد المخصص وأدوات الطباعة والتخصيص التفاعلية',
          'مصفوفة المواصفات الفنية وأدوات المقارنة المباشرة',
          'أوامر شراء أندية B2B وأسعار التوريد بالجملة',
          'تسجيل الضمان الرقمي بالرقم التسلسلي وتتبع الصيانة',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'Modern E-Commerce Technology Stack',
    ar: 'منظومة التقنيات الحديثة للتجارة الإلكترونية',
  },
  techStackSubtitle: {
    en: 'Enterprise-grade commerce platforms, regional payment rails, marketing automation engines, and real-time attribution intelligence.',
    ar: 'منصات تجارة مؤسسية موثوقة، ومسارات دفع إقليمية، وأدوات أتمتة التسويق، وأنظمة ذكاء العزو والبيانات الفورية.',
  },
  techStackPods: [
    {
      title: {
        en: 'Core Commerce Engines',
        ar: 'منصات ومحركات التجارة الأساسية',
      },
      badge: {
        en: 'Certified Partner',
        ar: 'شريك معتمد',
      },
      description: {
        en: 'High-availability, scale-ready storefront platforms powering thousands of daily transactions with zero downtime.',
        ar: 'منصات تجارة متقدمة وموثوقة تدير آلاف المعاملات اليومية بجاهزية تشغيلية كاملة ودون أي انقطاع.',
      },
      technologies: [
        { name: 'Shopify Plus', category: 'Enterprise Headless', badge: 'Certified' },
        { name: 'Salla Enterprise', category: 'MENA Commerce Engine', badge: 'Partner' },
        { name: 'Zid Pro', category: 'Saudi Retail Platform', badge: 'Partner' },
        { name: 'WooCommerce Headless', category: 'Open Architecture' },
        { name: 'Next.js Commerce', category: 'Storefront Framework' },
      ],
    },
    {
      title: {
        en: 'Payment & FinTech Rails',
        ar: 'مسارات الدفع والتقنية المالية',
      },
      badge: {
        en: 'Local GCC Gateways',
        ar: 'بوابات دفع خليجية',
      },
      description: {
        en: 'Sub-second checkout gateways with full regional compliance and Buy Now Pay Later (BNPL) integrations.',
        ar: 'بوابات إنهاء فوري للشراء متوافقة مصرفياً بالكامل مع حلول الشراء الآن والدفع لاحقاً (BNPL).',
      },
      technologies: [
        { name: 'Mada Local Debit', category: 'National Debit Rail', badge: 'Native' },
        { name: 'Apple Pay & Google Pay', category: '1-Click Mobile' },
        { name: 'Tamara', category: 'BNPL Installments', badge: 'GCC' },
        { name: 'Tabby', category: 'Split in 4 Payments', badge: 'GCC' },
        { name: 'HyperPay / Tap Payments', category: 'Enterprise Gateway' },
        { name: 'Stripe Global', category: 'Cross-Border Billing' },
      ],
    },
    {
      title: {
        en: 'Growth & Lifecycle Automation',
        ar: 'أتمتة النمو واستبقاء العملاء',
      },
      badge: {
        en: 'Retention Loops',
        ar: 'مسارات الاستبقاء',
      },
      description: {
        en: 'Multi-channel messaging pipelines and AI customer data platforms driving repeat purchase compounding.',
        ar: 'قنوات تواصل متعددة ومنصات بيانات عملاء ذكية تضاعف تكرار الشراء وتعظم ولاء المتسوقين.',
      },
      technologies: [
        { name: 'Klaviyo Enterprise', category: 'Email & SMS Flows', badge: 'Partner' },
        { name: 'Braze Customer Engagement', category: 'Real-Time Omnichannel' },
        { name: 'WhatsApp Business API', category: 'Direct Conversational' },
        { name: 'Gorgias AI Concierge', category: 'Customer Support' },
        { name: 'Recharge Subscriptions', category: 'Recurring Billing' },
      ],
    },
    {
      title: {
        en: 'Attribution & Conversion Intelligence',
        ar: 'ذكاء العزو وتحليلات التحويل',
      },
      badge: {
        en: 'First-Party Data',
        ar: 'بيانات الطرف الأول',
      },
      description: {
        en: 'Server-side tracking pipelines, blended ROAS dashboards, and predictive unit economic models.',
        ar: 'مسارات تتبع من الخادم، ولوحات مراقبة العائد الإعلاني الإجمالي، ونماذج التنبؤ باقتصاديات الوحدة.',
      },
      technologies: [
        { name: 'Triple Whale', category: 'Blended Multi-Touch ROAS', badge: 'Analytics' },
        { name: 'Google Analytics 4 (GA4)', category: 'Enhanced E-Commerce' },
        { name: 'Meta Conversions API (CAPI)', category: 'Server-Side Telemetry' },
        { name: 'Microsoft Clarity', category: 'Session Heatmaps & Dropoff' },
        { name: 'Google BigQuery', category: 'Customer Data Warehouse' },
      ],
    },
  ],

  clientStories: getEcommerceGrowthFeaturedClientStories(),

  delivery: {
    title: {
      en: 'The Persici Commerce Growth Engine',
      ar: 'محرك بيرسيكي لهندسة ونمو التجارة الرقمية',
    },
    subtitle: {
      en: 'A battle-tested 4-phase retail acceleration engine that unites strategy, storefront speed, performance acquisition, and automated retention loops.',
      ar: 'محرك تسريع تجاري متكامل ومجرب من 4 مراحل يربط بين الاستراتيجية، وسرعة المتجر، وإعلانات الأداء، ومسارات الاستبقاء المؤتمتة.',
    },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85',
    pillars: [
      {
        title: {
          en: 'Architectural Audit & Unit Economics',
          ar: 'التدقيق المعماري واقتصاديات الوحدة',
        },
        description: {
          en: 'We dissect your product margins, inventory turnover rates, CAC thresholds, and technical platform bottlenecks to establish a profitable scaling baseline.',
          ar: 'نحلل هوامش أرباح المنتجات، ومعدلات دوران المخزون، وسقف تكلفة الاستحواذ، ومعوقات المنصة الحالية لتحديد خط أساسي للنمو المربح.',
        },
      },
      {
        title: {
          en: 'Storefront UX & Conversion Engineering',
          ar: 'هندسة واجهات المتاجر وتجربة التحويل',
        },
        description: {
          en: 'We build or refactor your online storefront for sub-second page loads, intuitive collection discovery, dynamic bundling, and friction-free regional checkout.',
          ar: 'نبني أو نُحدّث متجرك الإلكتروني ليحقق سرعة فائقة، وتصفحاً بديهياً للمنتجات، وعروضاً ذكية، ودفعاً سلساً عبر البوابات الخليجية.',
        },
      },
      {
        title: {
          en: 'Full-Funnel Algorithmic Acquisition',
          ar: 'الاستحواذ الخوارزمي متكامل المراحل',
        },
        description: {
          en: 'We deploy multi-network ad campaigns across Meta, Google, TikTok, and Snapchat with custom server-side tracking (CAPI) and high-velocity UGC creative testing.',
          ar: 'نطلق حملات إعلانية متعددة القنوات عبر ميتا، وجوجل، وتيك توك، وسناب شات مع تتبع من الخادم (CAPI) واختبارات مستمرة للمحتوى الإبداعي.',
        },
      },
      {
        title: {
          en: 'Retention Loops & Compounding LTV',
          ar: 'مسارات الاستبقاء ومضاعفة القيمة التراكمية',
        },
        description: {
          en: 'We implement automated lifecycle communications across WhatsApp, SMS, and email, turning one-off purchasers into loyal repeat buyers with compounding lifetime value.',
          ar: 'نفعّل مسارات تواصل مؤتمتة عبر واتساب والرسائل القصيرة والبريد، مما يحول المشترين لمرة واحدة إلى عملاء دائمين ذوي قيمة شرائية مضاعفة.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'ecom-insight-1',
      slug: 'gcc-headless-commerce-shift',
      title: {
        en: 'The GCC Headless Commerce Shift: How Salla Enterprise and Shopify Plus Are Doubling Conversions',
        ar: 'تحول التجارة الهجينة في الخليج: كيف تضاعف سلة للمؤسسات وشوبيفاي بلس معدلات التحويل',
      },
      category: {
        en: 'Commerce Architecture',
        ar: 'معمارية التجارة الرقمية',
      },
      date: 'March 2026',
      readTime: '6 min read',
      excerpt: {
        en: 'Why modern retail brands in Saudi Arabia and the UAE are abandoning heavy monolithic templates in favor of sub-second headless storefronts and modular API architectures.',
        ar: 'لماذا تتخلى كبرى العلامات التجارية في السعودية والإمارات عن القوالب التقليدية لصالح المتاجر الهجينة فائقة السرعة وواجهات برمجة التطبيقات المعيارية.',
      },
      image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
      href: '/insights/gcc-headless-commerce-shift',
      systemType: 'insight',
    },
    {
      id: 'ecom-insight-2',
      slug: 'sub-second-checkouts-bnpl-mada',
      title: {
        en: 'Sub-Second Mobile Checkouts: Slashing Cart Abandonment with Mada, Apple Pay & Tamara',
        ar: 'إنهاء الشراء في أجزاء من الثانية: القضاء على هدر السلات عبر مدى، أبل باي وتمارا',
      },
      category: {
        en: 'Conversion Engineering',
        ar: 'هندسة التحويل والتقنية المالية',
      },
      date: 'February 2026',
      readTime: '5 min read',
      excerpt: {
        en: 'A step-by-step breakdown of how localized friction-free mobile checkout flows decrease cart abandonment rates by up to 42% for GCC e-commerce brands.',
        ar: 'دليل عملي مفصل يوضح كيف تساهم مسارات الدفع الميسرة والموطنة في تقليص نسب السلات المتروكة بما يصل إلى 42% للمتاجر الخليجية.',
      },
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      href: '/insights/sub-second-checkouts-bnpl-mada',
      systemType: 'insight',
    },
    {
      id: 'ecom-insight-3',
      slug: 'retention-first-profitability-loops',
      title: {
        en: 'Retention-First Architecture: Transitioning from Unsustainable CAC to 65% Repeat Revenue',
        ar: 'استراتيجية الاستبقاء أولاً: الانتقال من تكلفة الاستحواذ المرتفعة إلى 65% إيرادات متكررة',
      },
      category: {
        en: 'Lifecycle & Retention',
        ar: 'دورة حياة العملاء والاستبقاء',
      },
      date: 'January 2026',
      readTime: '7 min read',
      excerpt: {
        en: 'With rising ad auction costs across Meta and Google, discover how automated WhatsApp and email retention loops protect your contribution margins.',
        ar: 'مع ارتفاع تكاليف المزادات الإعلانية عبر ميتا وجوجل، اكتشف كيف تحمي مسارات الواتساب والبريد المؤتمتة هوامش ربحيتك الصافية.',
      },
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      href: '/insights/retention-first-profitability-loops',
      systemType: 'insight',
    },
  ],

  clientReview: {
    quote: {
      en: '"Persici engineered our digital store from scratch and completely transformed our retail trajectory. Their integration of sub-second checkout on Salla, paired with targeted performance media, drove a 340% sales surge in our very first quarter. They act like true business co-founders."',
      ar: '"بنى فريق بيرسيكي متجرنا الرقمي من الصفر وغيّر مسار تجارتنا بالكامل. تحقيق سرعة الشراء الفورية على منصة سلة، وتزامنها مع حملات الأداء الموجهة، حقق لنا قفزة بنسبة 340% في المبيعات خلال أول ثلاثة أشهر. إنهم شركاء نمو حقيقيون بكل ما تعنيه الكلمة."',
    },
    author: 'Fahad Al-Subaie',
    role: {
      en: 'Managing Director, Logeria & Luxury Collectibles Group',
      ar: 'المدير التنفيذي، مجموعة لوجيريا والسلع الفاخرة',
    },
    badge: {
      en: 'Verified E-Commerce Client',
      ar: 'عميل تجارة إلكترونية موثق',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions',
    ar: 'الأسئلة الشائعة',
  },
  faqsSubtitle: {
    en: 'Clear answers on our e-commerce frameworks, platform integrations, migration processes, and partnership model.',
    ar: 'إجابات واضحة وشاملة حول أطر عمل التجارة الإلكترونية، وتكاملات المنصات، وعمليات الترحيل، ونموذج الشراكة.',
  },
  faqs: [
    {
      question: {
        en: 'How do you determine whether to build on Salla, Zid, or Shopify Plus?',
        ar: 'كيف تحددون المنصة الأنسب لعلامتنا بين سلة، وزد، وشوبيفاي بلس؟',
      },
      answer: {
        en: 'We evaluate your target geographic footprint, average order value, required payment integrations, warehouse complexity, and customization needs. For Saudi-centric retail and rapid localized compliance, Salla Enterprise and Zid offer unbeatable native Mada and courier setups. For international expansion, multi-currency stores, and custom headless frontends, Shopify Plus provides global scalability. We guide you to the optimal choice based on unit economics.',
        ar: 'نقوم بتقييم نطاقك الجغرافي المستهدف، ومتوسط قيمة السلة، وبوابات الدفع المطلوبة، وتعقيدات المستودعات والتخصيص البرمجي. للعلامات التي تركز على السوق السعودي والخليجي، توفر سلة وزد تكاملاً مدمجاً فائق القوة مع مدى وشركات الشحن. وللتوسع العالمي، والعملات المتعددة، والواجهات الهجينة المخصصة، يقدم شوبيفاي بلس مرونة عالمية لا تضاهى.',
      },
    },
    {
      question: {
        en: 'How do you optimize checkout conversion rates for GCC payment methods?',
        ar: 'كيف تعملون على تحسين معدلات التحويل لبوابات الدفع الخليجية؟',
      },
      answer: {
        en: 'We eliminate checkout friction by embedding native 1-click Apple Pay, Mada debit card autofill, and pre-qualifying Buy Now Pay Later (BNPL) options like Tamara and Tabby directly on product pages. In addition, we optimize OTP verification speeds and provide clear bilingual order summaries, cutting checkout abandonment by up to 42%.',
        ar: 'نزيل كافة معوقات الدفع عبر تفعيل أبل باي بنقرة واحدة، والإكمال التلقائي لبطاقات مدى، وعرض خيارات التقسيط بدون فوائد عبر تمارا وتابي مباشرة في صفحات المنتجات. كما نعمل على تسريع وصول رسائل التحقق (OTP) وتوفير ملخص طلب ثنائي اللغة واضح تماماً، مما يقلص السلات المتروكة بما يصل إلى 42%.',
      },
    },
    {
      question: {
        en: 'Can Persici integrate custom ERP, warehouse, and physical POS systems with our online store?',
        ar: 'هل يمكن لبيرسيكي ربط أنظمة ERP وإدارة المستودعات ونقاط البيع الفعلية بالمتجر؟',
      },
      answer: {
        en: 'Yes. We build custom bi-directional API sync pipelines connecting your e-commerce store with regional ERP solutions (such as Odoo, SAP, Oracle, and Microsoft Dynamics) and physical retail POS systems. Inventory counts, order status updates, customer records, and financial ledger data synchronize in real time.',
        ar: 'نعم بكل تأكيد. نبني مسارات ربط ثنائية الاتجاه عبر واجهات برمجة التطبيقات (APIs) لربط متجرك مع أنظمة ERP المؤسسية (مثل Odoo و SAP و Oracle و Dynamics) ونقاط البيع الميدانية (POS). تتم مزامنة مستويات المخزون، وحالات الطلبات، وسجلات العملاء والبيانات المالية في الوقت الفعلي.',
      },
    },
    {
      question: {
        en: 'What is your methodology for scaling paid ad spend profitably across Meta, Google, and TikTok?',
        ar: 'ما هي منهجيتكم لتوسيع الإنفاق الإعلاني المدفوع بربحية عبر ميتا، وجوجل، وتيك توك؟',
      },
      answer: {
        en: 'We use server-side tracking (Meta CAPI, Google Enhanced Conversions) combined with Triple Whale attribution modeling to track first-party customer purchases accurately. We deploy high-velocity creative testing pods to discover winning ad angles weekly, scaling budgets incrementally against your net contribution margin rather than misleading platform ROAS.',
        ar: 'نعتمد على التتبع المباشر من الخادم (Meta CAPI و Google Enhanced Conversions) مع أدوات عزو التحويل المتقدمة لتتبع مشتريات العملاء بدقة متناهية. نطلق اختبارات أسبوعية مستمرة للإبداعات الإعلانية، ونرفع الميزانيات تدريجياً بناءً على هامش الربح الصافي الفعلي لا على العوائد الإعلانية الوهمية.',
      },
    },
    {
      question: {
        en: 'How do you prepare online stores for mega flash sale events like White Friday and Ramadan?',
        ar: 'كيف تُعدّون المتاجر الرقمية لمواسم التخفيضات الضخمة مثل الجمعة البيضاء وموسم رمضان؟',
      },
      answer: {
        en: 'We conduct rigorous synthetic load testing up to 100,000 concurrent active sessions, pre-cache dynamic catalog assets, optimize database queries, implement anti-bot checkout safeguards, and pre-configure automated abandoned cart recovery sequences to ensure zero downtime and peak conversion velocity.',
        ar: 'نجري اختبارات إجهاد وتحمل تحاكي ما يصل إلى 100,000 جلسة نشطة متزامنة، ونقوم بالتخزين المؤقت المسبق للمنتجات، وتحسين استعلامات قواعد البيانات، ووضع حواجز حماية ضد روبوتات الشراء، وتجهيز مسارات استعادة السلات المؤتمتة لضمان استقرار كامل وأعلى معدل مبيعات.',
      },
    },
    {
      question: {
        en: 'What does a typical store migration or build timeline look like?',
        ar: 'كم يستغرق الجدول الزمني المعتاد لبناء متجر جديد أو ترحيل متجر قائم؟',
      },
      answer: {
        en: 'A turnkey bespoke store build or complete platform migration typically spans 4 to 8 weeks, structured across four phases: UX Discovery & Architecture (Weeks 1-2), Storefront Development & Integration (Weeks 3-5), Data & Catalog Migration (Weeks 6-7), and QA Testing, Staff Training & Launch (Week 8).',
        ar: 'يستغرق بناء متجر جديد مخصص أو ترحيل متجر قائم عادة من 4 إلى 8 أسابيع، مقسمة على أربع مراحل: جلسات استكشاف تجربة المستخدم وتحديد المعمارية (الأسبوع 1-2)، وتطوير المتجر والتكاملات (الأسبوع 3-5)، وترحيل بيانات العملاء والمنتجات (الأسبوع 6-7)، والاختبارات الشاملة وتدريب الفريق والإطلاق الرسمي (الأسبوع 8).',
      },
    },
  ],
};
