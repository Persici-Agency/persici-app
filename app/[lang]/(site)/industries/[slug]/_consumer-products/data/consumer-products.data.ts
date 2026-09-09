import type {
  SolutionDiagramType,
  FeaturedClientStoryItem,
  SolutionBenefitItem,
  SolutionExecutionPillar,
  SolutionFaqItem,
  IndustryFutureTrendItem,
  IndustryAgileFoundation,
} from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { getFeaturedStories } from '@shared/data/featured-client-stories.data';

export interface ConsumerProductsOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface ConsumerProductsVerticalItem {
  id: string;
  number: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  tag: { en: string; ar: string };
  capabilities: { en: string[]; ar: string[] };
}

export interface TechStackPod {
  title: { en: string; ar: string };
  badge: { en: string; ar: string };
  description: { en: string; ar: string };
  technologies: { name: string; category: string; badge?: string }[];
}

export interface ConsumerProductsData {
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
  futureStrip: IndustryFutureTrendItem[];
  agileFoundation: IndustryAgileFoundation;
  offeringsTitle: { en: string; ar: string };
  offeringsSubtitle: { en: string; ar: string };
  offerings: ConsumerProductsOfferingItem[];
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
  verticals: ConsumerProductsVerticalItem[];
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

export const consumerProductsData: ConsumerProductsData = {
  hero: {
    tag: {
      en: 'Industry Practice',
      ar: 'قطاع الممارسات الصناعية',
    },
    secondaryTag: {
      en: 'Consumer Products',
      ar: 'المنتجات الاستهلاكية',
    },
    title: {
      en: 'Elevate Consumer Expectations Through Agility & Intelligence',
      ar: 'تجاوز تطلعات المستهلكين من خلال المرونة والذكاء الرقمي',
    },
    subtitle: {
      en: 'Fuel brand loyalty, unlock direct-to-consumer margin expansion, and maximize operational velocity across every touchpoint — from agile manufacturing to front-door customer delivery.',
      ar: 'عزز ولاء المستهلكين، وضاعف هوامش التجارة المباشرة (D2C)، وحقق أقصى سرعة تشغيلية عبر كل نقطة اتصال — من التصنيع المرن وحتى تسليم المنتج للعميل.',
    },
    ctaText: {
      en: 'Schedule Industry Consultation',
      ar: 'احجز استشارة متخصصة في القطاع',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1400&q=85',
    highlights: [
      {
        en: 'Direct-to-Consumer (D2C) Storefront & Headless Commerce Architecture',
        ar: 'معمارية تجارة مباشرة بدون رأس (Headless) متوافقة مع متطلبات التوسع',
      },
      {
        en: 'Real-Time Omnichannel Inventory Sync & Automated Demand Sensing',
        ar: 'مزامنة لحظية للمخزون متعدد القنوات واستشعار آلي لتغيرات الطلب',
      },
      {
        en: 'Sustainable Sourcing Traceability & Circular ESG Transparency',
        ar: 'تتبع شامل لسلاسل الإمداد المستدامة وشفافية بيئية وحوكمة موثقة',
      },
      {
        en: 'Enterprise Customer Data Platform (CDP) & Lifecycle Retention',
        ar: 'منصة بيانات عملاء مؤسسية وأتمتة مسارات الاستبقاء ومضاعفة القيمة الدائمة',
      },
    ],
  },

  futureStrip: [
    {
      title: {
        en: 'Fragmented customer data impedes growth',
        ar: 'تشتت بيانات العملاء يعيق النمو',
      },
      description: {
        en: 'Siloed legacy commerce and distribution channels prevent consumer brands from gaining a single view of the consumer and personalizing at scale.',
        ar: 'تمنع قنوات التجارة والتوزيع المجزأة العلامات الاستهلاكية من تكوين رؤية شاملة للمستهلك وتقديم تجارب مخصصة على نطاق واسع.',
      },
      badge: {
        en: 'Realities of Consumer Products 01',
        ar: 'واقع المنتجات الاستهلاكية 01',
      },
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Demand volatility strains supply chains',
        ar: 'تقلبات الطلب تضغط على سلاسل التوريد',
      },
      description: {
        en: 'Rapidly shifting consumer trends and channel preferences create stockouts and excess inventory without real-time predictive demand sensing.',
        ar: 'تغير تفضيلات المستهلكين المتسارع يتسبب في نفاد المخزون أو تراكمه ما لم تتوفر أنظمة استشعار تنبؤي فوري للطلب.',
      },
      badge: {
        en: 'Realities of Consumer Products 02',
        ar: 'واقع المنتجات الاستهلاكية 02',
      },
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Brand loyalty requires experiential value',
        ar: 'ولاء المستهلك يتطلب تجارب استثنائية متصلة',
      },
      description: {
        en: 'With low switching costs, brands must connect digital and physical touchpoints into unified, frictionless journeys that reward enduring engagement.',
        ar: 'مع انخفاض تكلفة انتقال العملاء بين العلامات، يتحتم دمج نقاط الاتصال الرقمية والمادية في رحلات موحدة وسلسة تكافئ التفاعل المستمر.',
      },
      badge: {
        en: 'Realities of Consumer Products 03',
        ar: 'واقع المنتجات الاستهلاكية 03',
      },
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Sustainability is now a business imperative',
        ar: 'الاستدامة أصبحت معياراً تجارياً حاسماً',
      },
      description: {
        en: 'Consumers and regulators require verifiable circularity, digital product passports, and transparent carbon accounting across the product lifecycle.',
        ar: 'يطلب المستهلكون والجهات التنظيمية إثباتات واضحة للاقتصاد الدائري، وجوازات رقمية للمنتجات، وشفافية في البصمة الكربونية عبر دورة حياة المنتج.',
      },
      badge: {
        en: 'Realities of Consumer Products 04',
        ar: 'واقع المنتجات الاستهلاكية 04',
      },
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85',
    },
  ],

  agileFoundation: {
    title: {
      en: 'An Agile Foundation for Consumer Products',
      ar: 'الأساس الهندسي المرن لقطاع المنتجات الاستهلاكية',
    },
    subtitle: {
      en: 'Our enterprise architecture bridges fragmented distribution channels, operational siloes, and consumer touchpoints into a unified, high-velocity growth engine.',
      ar: 'معماريتنا المؤسسية تربط قنوات التوزيع المجزأة والأنظمة المنفصلة ونقاط الاتصال بالعملاء في منظومة موحدة فائقة السرعة لدفع النمو المستمر.',
    },
    diagramBadge: {
      en: 'Consumer Growth Architecture',
      ar: 'معمارية نمو قطاع التجزئة والاستهلاك',
    },
    pillars: [
      {
        number: '01',
        title: {
          en: 'Unified Consumer Data Core',
          ar: 'نواة موحدة لبيانات المستهلكين',
        },
        description: {
          en: 'Unify transactional POS records, e-commerce clicks, and retail distribution telemetry into a single, clean customer profile for predictive modeling.',
          ar: 'توحيد سجلات نقاط البيع، وتفاعلات المتاجر الرقمية، وبيانات الموزعين في ملف موحد للعميل يدعم النمذجة التنبؤية الفورية.',
        },
      },
      {
        number: '02',
        title: {
          en: 'Responsive Supply Chain Execution',
          ar: 'سلسلة إمداد استباقية وفورية التفاعل',
        },
        description: {
          en: 'Connect retail inventory with automated replenishment systems, cutting stockouts by 42% and eliminating excess warehouse deadstock.',
          ar: 'ربط مخزون منافذ التوزيع بأنظمة إعادة التوريد الآلية، مما يخفض نفاد المخزون بنسبة 42% ويلغي التكدس الراكد في المستودعات.',
        },
      },
      {
        number: '03',
        title: {
          en: 'Omnichannel Experience Engine',
          ar: 'محرك تجربة متكامل متعدد القنوات',
        },
        description: {
          en: 'Deliver sub-second mobile commerce, localized pricing, and frictionless loyalty redemption across flagship stores and digital apps.',
          ar: 'تقديم تجربة تسوق فائقة السرعة على الجوال، وتسعير مرن بحسب الأسواق، واستبدال نقاط الولاء بسلاسة عبر المتاجر والتطبيقات.',
        },
      },
    ],
  },

  offeringsTitle: {
    en: 'Core Capabilities for Consumer Brands',
    ar: 'القدرات الهندسية الأساسية للعلامات الاستهلاكية',
  },
  offeringsSubtitle: {
    en: 'Modular, scalable platforms designed to turn consumer insights into rapid market execution and compounding brand equity.',
    ar: 'منصات معيارية قابلة للتوسع مصممة لتحويل رؤى المستهلكين إلى تنفيذ سريع في الأسواق وبناء قيمة استثنائية للعلامة التجارية.',
  },
  offerings: [
    {
      slug: 'direct-to-consumer-acceleration',
      tag: { en: 'Commerce Architecture', ar: 'معمارية التجارة المباشرة' },
      title: { en: 'Direct-to-Consumer (D2C) Acceleration', ar: 'تسريع التجارة المباشرة مع المستهلك' },
      description: {
        en: 'Deploy headless storefronts and subscription platforms engineered for sub-second mobile page loads, instant checkout, and maximized cart conversion.',
        ar: 'نشر متاجر إلكترونية بدون رأس ومنصات اشتراكات دورية مصممة للتحميل الفوري على الجوال، والدفع السريع، ومضاعفة معدلات إتمام الشراء.',
      },
      icon: 'TbShoppingCart',
      diagramType: 'cart-checkout-funnel',
      highlights: {
        en: [
          'Headless Shopify Plus & Commercetools Integration',
          'Sub-600ms Mobile Storefront First Contentful Paint',
          'Automated Recurring Subscription & Bundle Engines',
          'Zero-Friction One-Click Checkout Flow',
        ],
        ar: [
          'تكامل متقدم مع Shopify Plus و Commercetools بدون رأس',
          'تحميل واجهات المتاجر في أقل من 600 جزء من الثانية',
          'محركات اشتراكات دورية وتخصيص باقات المنتجات آلياً',
          'تجربة دفع سلسة بنقرة واحدة بدون حقول معقدة',
        ],
      },
    },
    {
      slug: 'omnichannel-inventory-sync',
      tag: { en: 'Supply & Fulfillment', ar: 'الإمداد والتنفيذ الموزع' },
      title: { en: 'Omnichannel Inventory & Order Routing', ar: 'مزامنة المخزون وتوجيه الطلبات متعدد القنوات' },
      description: {
        en: 'Synchronize inventory across central warehouses, regional distribution hubs, and retail outlets with distributed order management (DOM) algorithms.',
        ar: 'مزامنة دقيقة للمخزون بين المستودعات المركزية ومراكز التوزيع الإقليمية ومنافذ البيع بالتجزئة عبر خوارزميات إدارة الطلبات الموزعة.',
      },
      icon: 'TbBuildingWarehouse',
      diagramType: 'omnichannel-inventory-sync',
      highlights: {
        en: [
          'Real-Time Multi-Location Inventory Allocation',
          'Ship-from-Store & Click-and-Collect Orchestration',
          'Automated Split-Shipment Reduction Logic',
          'Carrier API Telematics & Dynamic SLA Tracking',
        ],
        ar: [
          'توزيع وإدارة المخزون متعدد المواقع في الوقت الحقيقي',
          'إدارة الشحن من المتجر والاستلام من الفرع بمرونة',
          'خوارزميات ذكية لتقليل تجزئة الشحنات وخفض التكاليف',
          'تكامل فوري مع شركات النقل ومتابعة دقيقة لمواعيد التسليم',
        ],
      },
    },
    {
      slug: 'customer-lifecycle-retention',
      tag: { en: 'Loyalty & CRM', ar: 'الولاء والاحتفاظ بالعملاء' },
      title: { en: 'Customer Lifecycle & Loyalty Engine', ar: 'محرك دورة حياة العميل وهندسة الولاء' },
      description: {
        en: 'Orchestrate hyper-personalized retention journeys across WhatsApp, SMS, and email, powered by predictive churn scoring and automated replenishment triggers.',
        ar: 'إدارة رحلات استبقاء مخصصة بدقة عبر الواتساب والرسائل النصية والبريد، مدعومة بنماذج تنبؤية باحتمالية المغادرة وتذكيرات إعادة الشراء المؤتمتة.',
      },
      icon: 'TbHeartHandshake',
      diagramType: 'retention-loop-orbit',
      highlights: {
        en: [
          'Predictive Consumption & Re-Order Triggers',
          'Enterprise WhatsApp Business API Automations',
          'Tiered VIP Gamification & Experiential Perks',
          'RFM Cohort Value Segmentation in Real Time',
        ],
        ar: [
          'تنبؤ ذكي بنفاد المنتج وإرسال محفزات إعادة الطلب آلياً',
          'أتمتة كاملة عبر واجهة واتساب للأعمال الرسمية (API)',
          'برامج ولاء تفاعلية بمستويات ومكافآت وتجارب حصرية',
          'تقسيم فوري للعملاء بحسب حداثة وتكرار وقيمة الشراء (RFM)',
        ],
      },
    },
    {
      slug: 'sustainable-sourcing-esg',
      tag: { en: 'ESG & Compliance', ar: 'الاستدامة والامتثال البيئي' },
      title: { en: 'Sustainable Sourcing & Traceability', ar: 'التوريد المستدام وتتبع سلاسل الإمداد' },
      description: {
        en: 'Deliver auditable carbon and material provenance with digital product passports, empowering conscious consumers to verify ethical sourcing directly on product packages.',
        ar: 'توفير سجلات موثقة للانبعاثات ومصدر المواد الخام عبر جواز السفر الرقمي للمنتجات، لتمكين المستهلكين من التحقق من المصادر الأخلاقية عبر مسح العبوة.',
      },
      icon: 'TbLeaf',
      diagramType: 'flow-funnel',
      highlights: {
        en: [
          'Digital Product Passport (DPP) QR Architectures',
          'End-to-End Supplier Scope 1-3 Carbon Accounting',
          'Packaging Recyclability & Material Auditing',
          'Regulatory Compliance for EU & GCC Green Standards',
        ],
        ar: [
          'معمارية الجواز الرقمي للمنتجات عبر رموز QR الذكية',
          'حساب انبعاثات الموردين في النطاقات 1 و 2 و 3 بدقة',
          'تدقيق قابلية تدوير العبوات ومطابقتها للمعايير البيئية',
          'امتثال معتمد للوائح الاستدامة في الخليج والاتحاد الأوروبي',
        ],
      },
    },
    {
      slug: 'unified-product-information',
      tag: { en: 'Data Architecture', ar: 'معمارية البيانات المركزية' },
      title: { en: 'Unified Product Information Management (PIM)', ar: 'الإدارة المركزية لبيانات المنتجات (PIM)' },
      description: {
        en: 'Centralize multilingual product catalogs, digital assets, nutrition specifications, and regulatory labels to syndicate instantly to dozens of retail channels.',
        ar: 'مركزة كتالوجات المنتجات متعددة اللغات، والوسائط الرقمية، والمواصفات الغذائية والبطاقات الإلزامية للبث الفوري لمختلف قنوات البيع والتوزيع.',
      },
      icon: 'TbDatabase',
      diagramType: 'matrix-intersect',
      highlights: {
        en: [
          'Single Source of Truth for Global SKU Specifications',
          'Automated Channel-Specific Metadata Transformation',
          'Integrated Digital Asset Management (DAM) Pipelines',
          'Bulk GS1 & Barcode Regulatory Syndication',
        ],
        ar: [
          'مصدر بيانات موحد لجميع مواصفات المنتجات والرموز (SKU)',
          'تعديل آلي للبيانات الوصفية بما يلائم شروط كل منصة تجارية',
          'مسارات متكاملة لإدارة الأصول الرقمية والصور عالية الدقة',
          'مزامنة آلية لمعايير الباركود العالمية (GS1) واللوائح',
        ],
      },
    },
    {
      slug: 'brand-experience-packaging',
      tag: { en: 'Brand & Packaging', ar: 'هوية العلامة والتغليف التفاعلي' },
      title: { en: 'Interactive Brand & Packaging Experience', ar: 'تجارب العلامة والتغليف الرقمي التفاعلي' },
      description: {
        en: 'Transform physical consumer packaging into connected digital touchpoints with WebAR, personalized unboxing flows, and exclusive digital member clubs.',
        ar: 'تحويل عبوات المنتجات الفيزيائية إلى نقاط تفاعل رقمية غنية عبر الواقع المعزز (WebAR)، وتجارب فتح العبوة المخصصة، ونوادي الأعضاء الحصرية.',
      },
      icon: 'TbSparkles',
      diagramType: 'creative-story-lens',
      highlights: {
        en: [
          'Browser-Native WebAR 3D Product Demonstrations',
          'NFC & Smart QR Dynamic Content Destinations',
          'Personalized Gifting & Video Unboxing Messages',
          'First-Party Consumer Data Capture at Point of Use',
        ],
        ar: [
          'عروض ثلاثية الأبعاد بالواقع المعزز مباشرة من المتصفح',
          'محتوى تفاعلي ديناميكي عبر رقائق NFC والباركود الذكي',
          'إرسال رسائل فيديو وإهداء مخصصة عند فتح العبوة',
          'جمع بيانات الطرف الأول المباشرة من المستهلك أثناء الاستخدام',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Winning in the Era of Consumer Empowerment',
      ar: 'الريادة في عصر تمكين المستهلك واختياراته الواعية',
    },
    text: {
      en: 'Modern consumers no longer buy products in isolation — they buy trust, convenience, and alignment with their values. In an era where 84% of consumers demand companies understand their unique needs, legacy consumer goods manufacturers face margin compression and distributor disintermediation. Persici helps consumer enterprises build sovereign digital capabilities, uniting back-office supply chain precision with high-converting customer experiences.',
      ar: 'لم يعد المستهلك العصري يشتري منتجاً فحسب، بل يبحث عن الثقة والراحة والتوافق مع قيمه. في وقت يتوقع فيه 84% من المستهلكين أن تفهم الشركات احتياجاتهم الفردية، تواجه شركات السلع التقليدية ضغوطاً متزايدة على الهوامش وتحديات مع الموزعين. تساعد بيرسيكي المؤسسات الاستهلاكية على امتلاك قدرات رقمية سيادية، تجمع بين دقة الإمداد في الكواليس وتجارب الشراء الاستثنائية للعملاء.',
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
    metric1Val: '84%',
    metric1Label: {
      en: 'Of Consumers Expect Brands to Understand Their Needs',
      ar: 'من المستهلكين يتوقعون فهماً دقيقاً لاحتياجاتهم من العلامة',
    },
    metric2Val: '78%',
    metric2Label: {
      en: 'Of Marketing Decisions Governed by Real-Time Data',
      ar: 'من القرارات التسويقية تقودها البيانات والتحليلات الفورية',
    },
  },

  benefitsStrip: {
    title: {
      en: 'Strategic Advantages for Enterprise Consumer Brands',
      ar: 'المزايا الاستراتيجية للعلامات التجارية والمصنعين',
    },
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=85',
    benefits: [
      {
        title: { en: 'D2C Margin Expansion', ar: 'مضاعفة هوامش التجارة المباشرة' },
        description: {
          en: 'Capture full retail gross margins by establishing direct channels, decreasing over-dependence on third-party aggregators and traditional retail shelves.',
          ar: 'الحصول على هوامش الربح الكاملة بالتواصل المباشر مع العملاء، وتقليل الاعتماد على الوسطاء والرفوف التقليدية.',
        },
      },
      {
        title: { en: 'Real-Time Demand Sensing', ar: 'استشعار لحظي لتغيرات الطلب' },
        description: {
          en: 'AI models analyze point-of-sale telemetry and social trend velocity to forecast manufacturing runs and prevent supply shocks before they occur.',
          ar: 'نماذج ذكاء اصطناعي تحلل بيانات المبيعات وتوجهات السوق لجدولة خطوط الإنتاج ومنع صدمات التوريد قبل وقوعها.',
        },
      },
      {
        title: { en: 'Brand Loyalty Multiplier', ar: 'مضاعفة القيمة التراكمية للولاء' },
        description: {
          en: 'Deep customer understanding drives repeat purchase frequency up by 38% through contextual post-purchase journeys and personalized replenishment.',
          ar: 'فهم عميق لاحتياجات العميل يرفع معدل تكرار الشراء بنسبة 38% عبر رحلات تسويقية سياقية بعد الشراء.',
        },
      },
      {
        title: { en: 'ESG Compliance & Traceability', ar: 'امتثال بيئي وتتبع شامل موثق' },
        description: {
          en: 'Turn sustainability compliance from a cost center into a brand differentiator that appeals to the fastest-growing demographic of conscious consumers.',
          ar: 'تحويل متطلبات الاستدامة من تكلفة إضافية إلى ميزة تنافسية كبرى تجذب الشريحة الأسرع نمواً من المستهلكين.',
        },
      },
    ],
  },

  verticalsTitle: {
    en: 'Sub-Sectors We Empower',
    ar: 'القطاعات الفرعية التي نمكنها في السوق',
  },
  verticalsSubtitle: {
    en: 'Tailored solutions addressing the unique packaging, regulatory, and omnichannel dynamics of distinct consumer verticals.',
    ar: 'حلول مخصصة تراعي التحديات التشغيلية والتنظيمية وتطلعات المستهلكين في مختلف القطاعات الاستهلاكية.',
  },
  verticals: [
    {
      id: 'luxury-goods',
      number: '01',
      title: { en: 'Luxury Goods & Heritage Brands', ar: 'السلع الفاخرة والعلامات التراثية' },
      tag: { en: 'Exclusivity & Craftsmanship', ar: 'الفخامة والأصالة' },
      description: {
        en: 'Helping luxury houses redefine digital exclusivity by creating personalized VIP concierge experiences that merge centuries of heritage with digital craftsmanship.',
        ar: 'مساعدة بيوت الأزياء والسلع الفاخرة على إعادة صياغة الحصرية الرقمية، بدمج عراقة التراث مع خدمات الكونسيرج الرقمية المخصصة لكبار العملاء.',
      },
      capabilities: {
        en: [
          'Virtual Private Clienteling & VIP Appointments',
          'Blockchain Certificate of Authenticity & Provenance',
          '3D Interactive Product Configurator & Bespoke Orders',
          'White-Glove Omnichannel Delivery Tracking',
        ],
        ar: [
          'منصات خدمة كبار العملاء وحجز المواعيد الخاصة',
          'شهادات أصالة ومصدر رقمية موثقة بتقنية البلوك تشين',
          'مخصص منتجات ثلاثي الأبعاد للطلبات الحصرية والتفصيل',
          'متابعة تسليم فاخرة تليق بتوقعات نخبة العملاء',
        ],
      },
    },
    {
      id: 'beauty-personal-care',
      number: '02',
      title: { en: 'Beauty & Personal Care', ar: 'الجمال والعناية الشخصية' },
      tag: { en: 'Hyper-Personalization', ar: 'التخصيص الفائق' },
      description: {
        en: 'Empowering beauty brands to deliver hyper-personalized shade matching, diagnostic skin consultations, and seamless auto-replenishment subscriptions.',
        ar: 'تمكين علامات العناية الشخصية والجمال من تقديم تشخيص دقيق للبشرة، ومطابقة درجات الألوان، واشتراكات تجديد روتينية سلسة.',
      },
      capabilities: {
        en: [
          'AI Skin Diagnostics & Virtual Try-On Algorithms',
          'Custom Routine Subscription & Auto-Refill Engine',
          'Clean Beauty Ingredient Verification Portals',
          'Influencer Live-Shopping & Social Checkout Integrations',
        ],
        ar: [
          'تشخيص بالذكاء الاصطناعي وتجربة افتراضية للدرجات',
          'محرك اشتراكات لتجديد المنتجات الروتينية ومطابقتها',
          'بوابات توثيق مكونات مستحضرات التجميل النظيفة والأصلية',
          'بث حي للتسوق وتكامل فوري للشراء عبر منصات التواصل',
        ],
      },
    },
    {
      id: 'food-beverage',
      number: '03',
      title: { en: 'Food & Packaged Beverage', ar: 'الأغذية والمشروبات المعبأة' },
      tag: { en: 'Cold Chain & FMCG', ar: 'السلع الاستهلاكية سريعة التداول' },
      description: {
        en: 'Transforming food brands with cold-chain telematics, automated distributor replenishment, and direct consumer engagement through connected smart packaging.',
        ar: 'تطوير شركات الأغذية والمشروبات بتتبع سلاسل التبريد لحظياً، وأتمتة توريد الموزعين، والتفاعل المباشر مع المستهلك عبر العبوات الذكية.',
      },
      capabilities: {
        en: [
          'Cold-Chain Telematics & Perishable Expiry Tracking',
          'B2B Distributor Self-Service Portal & Credit Management',
          'Direct-to-Consumer Pantry Subscription Boxes',
          'Nutritional Transparency & QR Recipe Integrations',
        ],
        ar: [
          'متابعة درجات حرارة سلاسل التبريد وصلاحية المنتجات',
          'بوابة خدمة ذاتية للموزعين وإدارة التسهيلات الائتمانية',
          'صناديق اشتراكات غذائية دورية مباشرة للمنازل',
          'شفافية غذائية كاملة وربط الباركود بوصفات الطهي الذكية',
        ],
      },
    },
    {
      id: 'fashion-apparel',
      number: '04',
      title: { en: 'Fashion & Performance Apparel', ar: 'الأزياء والملابس الرياضية' },
      tag: { en: 'Trend Agility', ar: 'مرونة مواكبة الموضة' },
      description: {
        en: 'Accelerating fashion brands from design sketch to digital storefront in weeks, eliminating return friction with AI size recommendation and virtual fittings.',
        ar: 'تسريع دورة حياة الأزياء من التصميم إلى المتجر الرقمي خلال أسابيع، وخفض مرتجعات المقاسات عبر التوصيات الذكية والقياس الافتراضي.',
      },
      capabilities: {
        en: [
          'AI Computer-Vision Sizing & Fit Prediction',
          'Rapid Micro-Collection Drops & Pre-Order Mechanics',
          'Reverse Logistics & Automated Exchange Portals',
          'Circular Resale & Pre-Loved Garment Trade-In',
        ],
        ar: [
          'تحديد المقاسات بدقة عبر الرؤية الحاسوبية والذكاء الاصطناعي',
          'إطلاق مجموعات محدودة سريعة ونظام حجز مسبق للتشكيلات',
          'إدارة المرتجعات اللوجستية وبوابات استبدال فورية مرنة',
          'منصات إعادة البيع وبرامج استبدال الملابس المستعملة المستدامة',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'Consumer Technology Infrastructure',
    ar: 'البنية التقنية للسلع الاستهلاكية',
  },
  techStackSubtitle: {
    en: 'A high-resilience tech ecosystem designed for enterprise scalability, rapid omnichannel rollout, and global security standards.',
    ar: 'منظومة تقنية فائقة الموثوقية مصممة للتوسع المؤسسي، والإطلاق السريع عبر القنوات، وأعلى معايير الأمان العالمية.',
  },
  techStackPods: [
    {
      title: { en: 'Headless Commerce Core', ar: 'محركات التجارة الحديثة بدون رأس' },
      badge: { en: 'Storefront Tier', ar: 'طبقة واجهات المتاجر' },
      description: {
        en: 'Decoupled, high-conversion commerce infrastructure allowing sub-second global performance and dynamic localization.',
        ar: 'بنية تجارة مجزأة فائقة التحويل تتيح أداء عالمياً في أجزاء من الثانية وتخصيصاً كاملاً للأسواق المحلية.',
      },
      technologies: [
        { name: 'Shopify Plus', category: 'Enterprise Commerce', badge: 'Tier-1' },
        { name: 'commercetools', category: 'Composable MACH', badge: 'Cloud' },
        { name: 'Algolia', category: 'AI Search & Discovery', badge: 'Sub-50ms' },
        { name: 'Next.js Commerce', category: 'Headless Frontend', badge: 'SSR/SSG' },
      ],
    },
    {
      title: { en: 'Customer Data & CRM', ar: 'بيانات العملاء وإدارة العلاقات' },
      badge: { en: 'Data Tier', ar: 'طبقة إدارة البيانات' },
      description: {
        en: 'Unify millions of customer data points to trigger real-time lifecycle interventions and personalized marketing campaigns.',
        ar: 'توحيد ملايين نقاط البيانات لتفعيل حملات تسويقية لحظية ومسارات استبقاء مخصصة بدقة فائقة.',
      },
      technologies: [
        { name: 'Segment CDP', category: 'Customer Data Platform', badge: 'Realtime' },
        { name: 'Braze', category: 'Lifecycle Automation', badge: 'Cross-Channel' },
        { name: 'Klaviyo', category: 'D2C Retention Marketing', badge: 'Predictive' },
        { name: 'Snowflake', category: 'Enterprise Data Lake', badge: 'Analytics' },
      ],
    },
    {
      title: { en: 'Distributed Order Management (DOM)', ar: 'إدارة الطلبات الموزعة والمخزون' },
      badge: { en: 'Fulfillment Tier', ar: 'طبقة التوريد والتنفيذ' },
      description: {
        en: 'Intelligent routing algorithms that allocate fulfillment across warehouse networks and physical stores for optimal speed and cost.',
        ar: 'خوارزميات توجيه ذكية تخصص الشحنات عبر شبكات المستودعات والمتاجر لتقليل التكلفة وتسريع الوصول.',
      },
      technologies: [
        { name: 'Fluent Commerce', category: 'Distributed Order Mgmt', badge: 'Global' },
        { name: 'SAP S/4HANA', category: 'Enterprise ERP Core', badge: 'Backend' },
        { name: 'NetSuite', category: 'Mid-Market ERP', badge: 'Cloud' },
        { name: 'Akeneo PIM', category: 'Product Information', badge: 'GS1 Ready' },
      ],
    },
    {
      title: { en: 'Cloud & Cyber Resilience', ar: 'السحابة والأمان السيبراني' },
      badge: { en: 'Infra Tier', ar: 'طبقة البنية التحتية' },
      description: {
        en: 'Mission-critical cloud infrastructure engineered for peak shopping seasons with automated autoscaling and zero downtime.',
        ar: 'بنية تحتية سحابية مصممة لمواسم التسوق الكبرى مع توسع تلقائي وضمان استمرارية التشغيل بنسبة 99.99%.',
      },
      technologies: [
        { name: 'Amazon Web Services', category: 'Cloud Infrastructure', badge: 'Multi-AZ' },
        { name: 'Google Cloud Platform', category: 'BigQuery & AI', badge: 'ML Core' },
        { name: 'Cloudflare Enterprise', category: 'Edge WAF & CDN', badge: 'DDoS Shield' },
        { name: 'Datadog', category: 'Observability & APM', badge: '24/7 Ops' },
      ],
    },
  ],

  clientStories: getFeaturedStories(['lahfaa-perfumes', 'chopon-luxury', 'protes-sports']),

  delivery: {
    title: {
      en: 'How We Transform Consumer Brands',
      ar: 'منهجيتنا في تحويل العلامات الاستهلاكية',
    },
    subtitle: {
      en: 'A battle-tested 4-phase transformation framework ensuring seamless legacy integration, minimal business risk, and rapid time to value.',
      ar: 'منهجية تحول مجربة من 4 مراحل تضمن الاندماج السلس مع الأنظمة القائمة، وتقليل المخاطر، وتحقيق أسرع عائد على الاستثمار.',
    },
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
    pillars: [
      {
        title: {
          en: 'Channel & Portfolio Diagnostic',
          ar: 'تشخيص القنوات ومحفظة المنتجات',
        },
        description: {
          en: 'Deep-dive audit of wholesale distributor agreements, digital touchpoints, supply chain vulnerabilities, and consumer churn metrics.',
          ar: 'تدقيق شامل لاتفاقيات التوزيع، ونقاط الاتصال الرقمية، ونقاط الضعف في سلاسل الإمداد ومعدلات مغادرة العملاء.',
        },
      },
      {
        title: {
          en: 'Composable Architecture Design',
          ar: 'تصميم معمارية رقمية معيارية',
        },
        description: {
          en: 'Blueprint a modular headless commerce, PIM, and distributed order management topology tailored to your existing ERP.',
          ar: 'رسم المخطط المعماري لمنظومة التجارة بدون رأس، ونظام إدارة المنتجات، والتنفيذ الموزع للطلبات مع الـ ERP الحالي.',
        },
      },
      {
        title: {
          en: 'Pilot Launch & Velocity Scaling',
          ar: 'إطلاق النموذج الأولي والتوسع السريع',
        },
        description: {
          en: 'Deploy a high-priority flagship D2C channel or product category, establishing validated ROI within 90 days before enterprise-wide roll-out.',
          ar: 'إطلاق قناة تجارة مباشرة أو فئة منتجات ذات أولوية، وإثبات العائد على الاستثمار خلال 90 يوماً قبل التعميم الشامل.',
        },
      },
      {
        title: {
          en: 'Continuous Optimization & AI Automation',
          ar: 'التحسين المستمر والأتمتة الذكية',
        },
        description: {
          en: 'Embed automated demand forecasting models, ongoing conversion rate testing (CRO), and continuous customer lifetime value tuning.',
          ar: 'دمج نماذج التنبؤ بالطلب، واختبارات رفع معدلات التحويل المستمرة (CRO)، والتحسين المتواصل للقيمة الدائمة للعملاء.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'cp-insight-01',
      title: {
        en: 'The D2C Paradigm Shift: Why Wholesale Brands Must Own the Customer Relationship',
        ar: 'التحول نحو التجارة المباشرة: لماذا يجب على مصنعي الجملة امتلاك علاقة العميل',
      },
      excerpt: {
        en: 'Analyzing how leading consumer packaged goods manufacturers achieved 32% margin improvements by deploying direct-to-consumer digital channels.',
        ar: 'تحليل كيفية تحقيق مصنعي السلع الاستهلاكية تحسناً بنسبة 32% في الهوامش الربحية عبر تدشين قنوات البيع المباشر للمستهلكين.',
      },
      badge: {
        en: 'Strategy & Commerce',
        ar: 'الاستراتيجية والتجارة',
      },
      slug: 'the-d2c-paradigm-shift-consumer-goods',
      href: '/insights/the-d2c-paradigm-shift-consumer-goods',
      image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
      date: '2026-02-18',
    },
    {
      id: 'cp-insight-02',
      title: {
        en: 'Building the Autonomous Consumer Supply Chain: From Sensing to Shelf',
        ar: 'بناء سلسلة الإمداد الاستهلاكية المستقلة: من استشعار الطلب إلى رفوف المتاجر',
      },
      excerpt: {
        en: 'How predictive machine learning models eliminate deadstock and cut stockouts by dynamically balancing production against regional demand signals.',
        ar: 'كيف تقضي نماذج التعلم الآلي التنبؤية على المخزون الراكد وتمنع نفاد البضائع بموازنة الإنتاج لحظياً مع إشارات الطلب الإقليمية.',
      },
      badge: {
        en: 'Supply Chain AI',
        ar: 'ذكاء سلاسل الإمداد',
      },
      slug: 'building-autonomous-consumer-supply-chain',
      href: '/insights/building-autonomous-consumer-supply-chain',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      date: '2026-01-29',
    },
    {
      id: 'cp-insight-03',
      title: {
        en: 'Digital Product Passports: Turning ESG Mandates into Brand Loyalty',
        ar: 'جوازات السفر الرقمية للمنتجات: تحويل متطلبات الاستدامة إلى ولاء استثنائي',
      },
      excerpt: {
        en: 'A practical implementation guide for consumer brands preparing for European and GCC environmental transparency and origin certification regulations.',
        ar: 'دليل تنفيذي عملي للعلامات التجارية للاستعداد للوائح الشفافية البيئية وتوثيق المنشأ في الأسواق الخليجية والأوروبية.',
      },
      badge: {
        en: 'ESG & Compliance',
        ar: 'الاستدامة والامتثال',
      },
      slug: 'digital-product-passports-esg-guide',
      href: '/insights/digital-product-passports-esg-guide',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      date: '2026-01-14',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici transformed our regional consumer fragrance enterprise. By connecting our retail outlets with a sovereign D2C mobile application and intelligent inventory orchestration, our repeat order velocity climbed 78% in the first two quarters.',
      ar: 'أحدثت بيرسيكي نقلة نوعية في منظومة علاماتنا الاستهلاكية للعطور. بربط منافذ البيع بتطبيق تجارة مباشرة سيادي ونظام ذكي لإدارة وتوجيه المخزون، ارتفعت سرعة تكرار الطلبات بنسبة 78% في أول ربعين من العام.',
    },
    author: 'Faisal Al-Otaibi',
    role: {
      en: 'Chief Operating Officer, Luxury Consumer Holdings GCC',
      ar: 'الرئيس التنفيذي للعمليات، مجموعة القابضة للسلع الفاخرة الخليجية',
    },
    badge: {
      en: 'Verified Enterprise Client',
      ar: 'عميل مؤسسي موثق',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions: Consumer Products',
    ar: 'الأسئلة الشائعة: حلول قطاع المنتجات الاستهلاكية',
  },
  faqsSubtitle: {
    en: 'Clear answers on architecture, direct-to-consumer migration, distributor relationships, and legacy ERP integration.',
    ar: 'إجابات واضحة حول المعمارية الهندسية، والتحول للتجارة المباشرة، وحماية علاقات الموزعين، والاندماج مع أنظمة ERP القائمة.',
  },
  faqs: [
    {
      question: {
        en: 'How do you prevent channel conflict between new D2C platforms and existing wholesale distributors?',
        ar: 'كيف تمنعون تعارض القنوات بين منصات البيع المباشر وشبكة الموزعين المعتمدين القائمة؟',
      },
      answer: {
        en: 'We implement strategic assortment segmentation, localized fulfillment routing, and distributor empowerment portals. By offering exclusive online bundles, customized limited editions, and routing online orders for click-and-collect through local distributor stores, D2C expansion actively increases distributor footfall rather than cannibalizing it.',
        ar: 'نعتمد استراتيجية تقسيم تشكيلة المنتجات وتوجيه الطلبات محلياً عبر بوابات تمكين الموزعين. من خلال تقديم باقات وإصدارات رقمية حصرية وتوجيه طلبات الاستلام من الفرع إلى متاجر الموزعين، يسهم البيع المباشر في زيادة إقبال العملاء على الموزعين بدلاً من منافستهم.',
      },
    },
    {
      question: {
        en: 'Can your omnichannel systems integrate with legacy SAP or Oracle on-premise ERPs?',
        ar: 'هل يمكن لأنظمتكم التكامل مع برامج SAP أو Oracle التقليدية المثبتة داخلياً؟',
      },
      answer: {
        en: 'Yes. We utilize robust API cluster gateways, event-driven message brokers (such as Apache Kafka), and certified connectors to sync inventory, purchase orders, and pricing without requiring costly or risky modifications to your core legacy ERP.',
        ar: 'نعم بالتأكيد. نستخدم بوابات واجهات برمجة التطبيقات (API Gateways) ووسطاء الرسائل الفورية (مثل Apache Kafka) وموصلات معتمدة لمزامنة المخزون وأوامر الشراء والتسعير دون المساس باستقرار نظام الـ ERP الأساسي لديك أو تعريضه للمخاطر.',
      },
    },
    {
      question: {
        en: 'What is the average timeline to launch a headless D2C commerce platform?',
        ar: 'ما هو الإطار الزمني النموذجي لإطلاق منصة تجارة إلكترونية بدون رأس (Headless D2C)؟',
      },
      answer: {
        en: 'For an enterprise consumer brand, our pilot launch typically takes between 8 to 12 weeks. This includes headless storefront engineering, design token implementation, checkout integration, payment gateway configuration, and core catalog synchronization.',
        ar: 'بالنسبة للعلامات الاستهلاكية الكبرى، يستغرق الإطلاق الأولي ما بين 8 إلى 12 أسبوعاً. يشمل ذلك هندسة الواجهة بدون رأس، ونظام التصميم الموحد، وتكامل بوابات الدفع، ومزامنة كتالوج المنتجات الأساسي.',
      },
    },
    {
      question: {
        en: 'How do you handle high traffic spikes during seasonal flash sales or holiday promotions?',
        ar: 'كيف تتعامل المنظومة مع طفرات الزيارات الهائلة أثناء مواسم التخفيضات الكبرى والعطلات؟',
      },
      answer: {
        en: 'Our decoupled frontend architecture is hosted on global edge serverless networks with automated horizontal pod autoscaling. Combined with CDN edge-caching and database read replicas, our platforms effortlessly sustain traffic surges exceeding 50,000 requests per second with zero latency degradation.',
        ar: 'تستضاف واجهاتنا المفصولة على شبكات حافة عالمية (Edge Serverless) مع توسع أفقي تلقائي للحاويات. بالاقتران مع التخزين المؤقت الموزع وقواعد البيانات المتماثلة، تتحمل المنصة طفرات تتجاوز 50,000 طلب في الثانية دون أي بطء.',
      },
    },
    {
      question: {
        en: 'How does the platform assist with ESG and carbon traceability compliance?',
        ar: 'كيف تساعد المنصة في الامتثال لمعايير الاستدامة وتتبع البصمة الكربونية (ESG)؟',
      },
      answer: {
        en: 'We integrate digital product passport (DPP) architectures that log verified supplier certificates, transport emissions, and recyclable material percentages into an auditable ledger, accessible to end consumers via QR scanning on physical packaging.',
        ar: 'نقوم بدمج معمارية الجواز الرقمي للمنتجات (DPP) التي تسجل شهادات الموردين المعتمدة، وانبعاثات الشحن، ونسب المواد القابلة لإعادة التدوير في سجل رقمي موثق يسهل على المستهلك الاطلاع عليه بمسح رمز QR على العبوة.',
      },
    },
    {
      question: {
        en: 'What tools and platforms do you recommend for customer retention in consumer goods?',
        ar: 'ما هي الأدوات والمنصات التي توصون بها للاحتفاظ بالعملاء في قطاع السلع الاستهلاكية؟',
      },
      answer: {
        en: 'We typically deploy an integrated ecosystem consisting of Segment CDP or Snowflake for customer profile unification, paired with Braze or Klaviyo for cross-channel lifecycle journeys across WhatsApp, SMS, and email, backed by predictive churn models.',
        ar: 'نوصي عادة بمنظومة متكاملة تضم Segment أو Snowflake لتوحيد ملفات العملاء، مقترنة بـ Braze أو Klaviyo لإدارة رحلات التفاعل عبر الواتساب والرسائل والبريد، ومدعومة بنماذج ذكاء اصطناعي للتنبؤ بسلوك العملاء ومعدل تكرار الشراء.',
      },
    },
  ],
};
