import type {
  SolutionDiagramType,
  FeaturedClientStoryItem,
  SolutionBenefitItem,
  SolutionExecutionPillar,
  SolutionFaqItem,
} from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { getUxProductDesignFeaturedClientStories } from '@shared/data';

export interface UxOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface UxVerticalItem {
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

export interface UxProductDesignData {
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
  offeringsTitle: { en: string; ar: string };
  offeringsSubtitle: { en: string; ar: string };
  offerings: UxOfferingItem[];
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
  verticals: UxVerticalItem[];
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

export const uxProductDesignData: UxProductDesignData = {
  hero: {
    tag: {
      en: 'Solutions & Product Engineering',
      ar: 'الحلول وهندسة المنتجات الرقمية',
    },
    secondaryTag: {
      en: 'UX and Product Design',
      ar: 'تصميم تجربة وواجهة المستخدم',
    },
    title: {
      en: 'UX & Digital Product Design That Converts, Scales & Retains',
      ar: 'تصميم تجربة وواجهة المنتجات الرقمية لتحقيق النمو والولاء المؤسسي',
    },
    subtitle: {
      en: 'We transform complex enterprise ideas into intuitive digital products that users understand, trust, and choose to use. From user research and interactive prototypes to scalable design systems and production handoff, every interaction is engineered to reduce friction and accelerate adoption.',
      ar: 'نحول الأفكار المعقدة إلى منتجات رقمية بديهية يثق بها المستخدمون ويختارونها. من أبحاث السلوك والنماذج التفاعلية إلى أنظمة التصميم والتسليم البرمجي، نهندس كل تفاعل لتقليل الاحتكاك وتسريع وتيرة النمو.',
    },
    ctaText: {
      en: 'Schedule Product Design Audit',
      ar: 'احجز تدقيق تجربة المستخدم',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1400&q=85',
    highlights: [
      {
        en: 'Product Strategy & Discovery Roadmaps',
        ar: 'استراتيجية المنتج وخارطة طريق الاكتشاف',
      },
      {
        en: 'Ethnographic Research & User Journey Mapping',
        ar: 'أبحاث معمقة للمستخدمين ورسم مسارات السلوك',
      },
      {
        en: 'Modular Living Design Systems in Figma & Code',
        ar: 'أنظمة تصميم حية ومتزامنة في فيجما والكود',
      },
      {
        en: 'WCAG 2.2 AA Accessibility & Pixel-Perfect Handoff',
        ar: 'معايير وصول عالمية وتسليم برمجي فائق الدقة',
      },
    ],
  },

  offeringsTitle: {
    en: 'Core Product Design Capabilities & Disciplines',
    ar: 'القدرات والحلول المتخصصة في تصميم المنتجات الرقمية',
  },
  offeringsSubtitle: {
    en: 'An integrated end-to-end design methodology spanning behavioral discovery, information architecture, living design systems, and rapid interactive prototyping.',
    ar: 'منهجية تصميم متكاملة تجمع بين أبحاث السلوك البشري، وهندسة المعلومات، وبناء أنظمة التصميم الحية، والاختبار السريع للنماذج التفاعلية.',
  },
  offerings: [
    {
      slug: 'product-strategy-discovery',
      tag: {
        en: 'Product Strategy & Vision',
        ar: 'استراتيجية واكتشاف المنتج',
      },
      title: {
        en: 'Product Strategy & Discovery Roadmapping',
        ar: 'استراتيجية المنتج وخارطة طريق الاكتشاف',
      },
      description: {
        en: 'Aligning business goals, customer pain points, and technical feasibility to turn early concepts into high-velocity product roadmaps with clear commercial ROI.',
        ar: 'مواءمة أهداف الأعمال مع احتياجات المستخدمين والجدوى التقنية لتحويل المفاهيم الأولية إلى خارطة طريق منتج واضحة وقابلة للتنفيذ السريع.',
      },
      icon: '/icons/solutions/ux-product-strategy.svg',
      diagramType: 'ux-strategy-compass',
      highlights: {
        en: [
          'Opportunity Solution Trees & Product-Market Fit Audits',
          'Quantitative TAM & Feature Priority Value Scoring',
          'Agile Sprint 0 Scoping & Engineering Feasibility',
          'OKR Alignment & Executive Stakeholder Architecture',
        ],
        ar: [
          'أشجار حلول الفرص وتدقيق ملاءمة المنتج للسوق المستهدف',
          'تحليل حجم السوق وتحديد أولويات الميزات بناءً على القيمة',
          'تخطيط نطاق العمل للسبرنت صفر وتقييم الجدوى الهندسية',
          'مواءمة الأهداف والنتائج الرئيسية (OKRs) للإدارة العليا',
        ],
      },
    },
    {
      slug: 'ux-research-journey-architecture',
      tag: {
        en: 'Human-Centered Research',
        ar: 'أبحاث وسلوك المستخدمين',
      },
      title: {
        en: 'UX Research & Behavioral Journey Architecture',
        ar: 'أبحاث تجربة المستخدم وهندسة مسارات السلوك',
      },
      description: {
        en: 'Deep ethnographic interviews, usability telemetry, and mental model mapping to untangle complex user friction and craft intuitive end-to-end user flows.',
        ar: 'مقابلات معمقة مع المستخدمين وتحليل بيانات السلوك لرسم خرائط النماذج الذهنية وإزالة كافة نقاط الاحتكاك عبر مسار الاستخدام.',
      },
      icon: '/icons/solutions/ux-user-research.svg',
      diagramType: 'ux-journey-flowchart',
      highlights: {
        en: [
          'Generative & Evaluative Qualitative User Interviews',
          'Behavioral Heuristic Audits & Drop-off Telemetry',
          'Mental Model Synthesis & Persona Archetype Mapping',
          'Multimodal Task Analysis & Omnichannel User Flows',
        ],
        ar: [
          'مقابلات بحثية نوعية وتوليدية معمقة مع شرائح المستخدمين',
          'تدقيق ارشادي شامل لكشف أسباب مغادرة التطبيق في كل شاشة',
          'صياغة النماذج الذهنية وتحديد شخصيات المستخدمين الحقيقية',
          'هندسة تدفقات المهام وسيناريوهات الاستخدام عبر كافة القنوات',
        ],
      },
    },
    {
      slug: 'information-architecture-wireframing',
      tag: {
        en: 'Information Architecture',
        ar: 'هندسة وهيكلة المعلومات',
      },
      title: {
        en: 'Information Architecture & Wireframe Scaffolding',
        ar: 'هيكلة المعلومات والتخطيط الهيكلي (Wireframing)',
      },
      description: {
        en: 'Logical content hierarchy, taxonomy trees, and low-fidelity structural blueprints designed to guarantee frictionless navigation across complex software ecosystems.',
        ar: 'تنظيم محتوى منطقي وهياكل تصنيف ذكية ومخططات هيكلية تضمن تنقلاً سلساً وبديهياً عبر الأنظمة والمنصات الرقمية المعقدة.',
      },
      icon: '/icons/solutions/ux-information-architecture.svg',
      diagramType: 'ux-wireframe-blueprint',
      highlights: {
        en: [
          'Hierarchical Tree Testing & Card Sorting Studies',
          'Responsive Low-to-Mid Fidelity Blueprint Wireframes',
          'Edge-Case Scenario & Error-State Logic Architecture',
          'Intuitive Navigation Taxonomies for Complex SaaS Portals',
        ],
        ar: [
          'اختبارات تصنيف البطاقات وهيكلة الشاشات مع مستخدمين فعليين',
          'مخططات هيكلية متجاوبة لجميع مقاسات الشاشات والأجهزة',
          'معمارية حالات الخطأ والسيناريوهات الاستثنائية للأنظمة',
          'تصنيفات تنقل بديهية وسهلة لبوابات SaaS والمنصات المؤسسية',
        ],
      },
    },
    {
      slug: 'ui-design-living-design-systems',
      tag: {
        en: 'Visual Design & Tokens',
        ar: 'الواجهات والأنظمة البصرية',
      },
      title: {
        en: 'UI Design & Scalable Living Design Systems',
        ar: 'تصميم الواجهات وأنظمة التصميم القابلة للتوسع',
      },
      description: {
        en: 'Bespoke, brand-aligned interfaces powered by modular design tokens in Figma and code, accelerating engineering handoff and guaranteeing visual consistency.',
        ar: 'واجهات استخدام متميزة تعكس هوية العلامة، مدعومة برموز تصميمية معيارية تسرع وتيرة التطوير وتضمن اتساق الهوية عبر كافة المنصات.',
      },
      icon: '/icons/solutions/ux-design-systems.svg',
      diagramType: 'ux-design-token-matrix',
      highlights: {
        en: [
          'Multi-Tier Design Tokens (Color, Spacing, Typography, Radius)',
          'Atomic Component Libraries with Complete State Coverage',
          'Cross-Platform Synchronized Dark & Light Themes',
          'Comprehensive Micro-Typography & Spatial Spacing Scales',
        ],
        ar: [
          'رموز تصميمية معيارية متعددة المستويات للألوان والمسافات',
          'مكتبات عناصر ذرية تغطي كافة حالات التفاعل والأجهزة',
          'سمات داكنة وفاتحة متزامنة عبر تطبيقات الويب والهاتف',
          'مقاييس طباعية وشبكات مساحية متقدمة تدعم اللغتين العربية والإنجليزية',
        ],
      },
    },
    {
      slug: 'interactive-prototyping-usability-testing',
      tag: {
        en: 'Validation & Prototyping',
        ar: 'النماذج الأولية والاختبار',
      },
      title: {
        en: 'Interactive Prototyping & Usability Validation',
        ar: 'النماذج التفاعلية الأولية والتحقق من الاستخدام',
      },
      description: {
        en: 'High-fidelity micro-interactions and clickable prototypes tested with real target users to de-risk investment and validate core assumptions before code is written.',
        ar: 'تفاعلات دقيقة ونماذج تفاعلية تحاكي المنتج الحقيقي تُختبر مع مستخدمين فعليين لتقليل المخاطر والتحقق من الفرضيات قبل كتابة الكود.',
      },
      icon: '/icons/solutions/ux-prototyping-testing.svg',
      diagramType: 'ux-prototype-interaction',
      highlights: {
        en: [
          'Clickable High-Fidelity Micro-Interaction Prototypes',
          'Moderated & Unmoderated Target Usability Lab Sessions',
          'Time-on-Task & Cognitive Workload Benchmarking',
          'Quantitative A/B Preference Testing & Heatmap Analytics',
        ],
        ar: [
          'نماذج تفاعلية عالية الدقة مع حركات وتفاعلات ميكروية متقدمة',
          'جلسات اختبار استخدام موجهة وحرة مع عملاء مستهدفين حقيقيين',
          'قياس زمن إنجاز المهام ومؤشرات الجهد المعرفي وسهولة الاستخدام',
          'اختبارات تفضيل كمية وتحليل الخرائط الحرارية لنقاط النقر',
        ],
      },
    },
    {
      slug: 'developer-handoff-accessibility-wcag',
      tag: {
        en: 'Handoff & Governance',
        ar: 'التسليم البرمجي والحوكمة',
      },
      title: {
        en: 'Developer Handoff & Accessibility (WCAG 2.2 AA)',
        ar: 'التسليم البرمجي المتقن ومعايير الوصول العالمية',
      },
      description: {
        en: 'Pixel-perfect component specifications, tokenized CSS variables, and strict WCAG 2.2 AA accessibility audits ensuring seamless transition from Figma to production.',
        ar: 'مواصفات دقيقة للعناصر، ومتغيرات CSS معيارية، وتدقيق صارم لمعايير إمكانية الوصول لضمان تحويل مثالي للتصميم إلى كود برمجي عالي الأداء.',
      },
      icon: '/icons/solutions/ux-design-handoff.svg',
      diagramType: 'ux-handoff-spec-engine',
      highlights: {
        en: [
          'Tokenized CSS Variables & React/Tailwind Component Sync',
          'Strict WCAG 2.2 Level AA Contrast & Screen-Reader Specs',
          'Comprehensive Motion Curve & Interaction Parameters',
          'Production Design QA & Zero Pixel-Defect Guarantee',
        ],
        ar: [
          'مزامنة متغيرات التصميم مع مكونات React و Tailwind الحديثة',
          'توافق صارم مع معايير الوصول العالمية وقارئات الشاشة للمكفوفين',
          'توثيق دقيق لمعاملات ومنحنيات الحركة والانتقال بين الشاشات',
          'مراجعة جودة التصميم في مرحلة الإنتاج وضمان دقة البيكسل بنسبة 100%',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Why Strategic UX Architecture Matters for Enterprise Growth',
      ar: 'لماذا تمثل هندسة تجربة المستخدم ركيزة أساسية لنمو الأعمال',
    },
    text: {
      en: 'Digital products rarely fail due to backend technology; they fail because users experience cognitive overload, unintuitive workflows, and compounding friction. Persici’s product design methodology replaces subjective guesswork with behavioral telemetry and rigorous validation. We align customer intent directly with commercial objectives, delivering digital products that command market adoption, reduce customer acquisition costs, and build enduring enterprise loyalty.',
      ar: 'نادراً ما تفشل المنتجات الرقمية بسبب البنية التقنية، بل تفشل بسبب الإرهاق المعرفي، والمسارات غير البديهية، والاحتكاك التفاعلي. تستبدل منهجية بيرسيكي في تصميم المنتجات التخمين بالبيانات السلوكية والتحقق الميداني الصارم. نحن نوائم دوافع المستخدمين مع الأهداف التجارية للمؤسسة، لنبتكر تجارب تعزز معدلات التحويل، وتخفض تكلفة الاستحواذ، وتبني ولاءً راسخاً للعلامة.',
    },
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1400&q=85',
    metric1Val: '+280%',
    metric1Label: {
      en: 'Task Completion Rate Lift',
      ar: 'ارتفاع معدل إنجاز مهام المستخدمين',
    },
    metric2Val: '<1.4s',
    metric2Label: {
      en: 'Accelerated Time-to-Value',
      ar: 'تسريع وصول المستخدم للقيمة الأساسية',
    },
  },

  benefitsStrip: {
    title: {
      en: 'The Persici Product Design Advantage',
      ar: 'المزايا الاستراتيجية لتصميم المنتجات مع بيرسيكي',
    },
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=85',
    benefits: [
      {
        title: {
          en: 'Cognitive Friction Reduction',
          ar: 'القضاء على الإرهاق والجهد المعرفي',
        },
        description: {
          en: 'We streamline complex multi-step workflows into effortless, delightful user paths that dramatically improve self-service task completion.',
          ar: 'نبسط المسارات الرقمية المعقدة إلى تدفقات بديهية ممتعة ترفع بشكل كبير معدل إتمام العمليات ذاتياً ودون مساعدة.',
        },
        accentColor: '#D83427',
      },
      {
        title: {
          en: 'Living Design System Scalability',
          ar: 'أنظمة تصميم حية وقابلة للتوسع المستمر',
        },
        description: {
          en: 'Centralized token architecture ensures every new feature, sub-brand, or platform release remains 100% on-brand without rework.',
          ar: 'معمارية رموز تصميمية مركزية تضمن إطلاق أي ميزة جديدة أو تطبيق فرعي بنفس الهوية البصرية ودون إعادة بناء من الصفر.',
        },
        accentColor: '#EF8C7D',
      },
      {
        title: {
          en: '3x Accelerated Engineering Velocity',
          ar: 'مضاعفة سرعة الفرق الهندسية بمقدار 3 أضعاف',
        },
        description: {
          en: 'Developer-ready design tokens, reusable React component specs, and edge-case documentation slash frontend build times by 65%.',
          ar: 'مكونات تصميمية متوافقة مع الكود البرمجي وتوثيق شامل لحالات الاستخدام يقلل زمن التطوير البرمجي بنسبة 65%.',
        },
        accentColor: '#121212',
      },
      {
        title: {
          en: 'Compounding Retention & NPS Lift',
          ar: 'مضاعفة ولاء العملاء ومؤشر الترويج (NPS)',
        },
        description: {
          en: 'Products crafted around genuine human needs transform casual visitors into passionate brand advocates who stay and compound value.',
          ar: 'المنتجات المصممة حول الاحتياجات الإنسانية الحقيقية تحول المستخدمين العاديين إلى سفراء مخلصين للعلامة ومصدر للنمو المستدام.',
        },
        accentColor: '#D83427',
      },
    ],
  },

  verticalsTitle: {
    en: 'Domain Verticals & Specialized Industry Architectures',
    ar: 'المعمارية المتخصصة للقطاعات الاقتصادية وتطبيقاتها',
  },
  verticalsSubtitle: {
    en: 'Tailored UX architecture and user journey systems engineered to solve industry-specific operational, compliance, and consumer adoption challenges.',
    ar: 'معماريات تجربة مستخدم مصممة لمعالجة التحديات التشغيلية والتنظيمية الخاصة بكل قطاع في بيئة الأعمال الخليجية والعالمية.',
  },
  verticals: [
    {
      id: 'fintech-wealth',
      number: '01',
      tag: { en: 'Financial Services', ar: 'التقنية المالية والمصرفية' },
      title: {
        en: 'FinTech, Neobanking & Wealth Management',
        ar: 'التقنية المالية، البنوك الرقمية وإدارة الثروات',
      },
      description: {
        en: 'Frictionless biometric onboarding, intuitive trading interfaces, real-time portfolio data visualization, and micro-investment experiences built for high-trust transactions.',
        ar: 'فتح حسابات مصرفية بديهي بالبصمة الحيوية، وشاشات تداول حية، وتصور مرئي فوري لبيانات المحافظ الاستثمارية لتعزيز ثقة العميل المطلقة.',
      },
      capabilities: {
        en: [
          'Sub-3-Minute KYC & Biometric Mobile Onboarding',
          'High-Density Financial Telemetry & Charting UI',
          'Instant Regulatory Compliance & Security State Feedback',
          'Personalized Financial Insights & Gamified Savings Goals',
        ],
        ar: [
          'فتح حساب مصرفي كامل والتحقق من الهوية في أقل من 3 دقائق',
          'واجهات متطورة لعرض المؤشرات المالية والرسوم البيانية الكثيفة',
          'تغذية راجعة فورية لمعايير الأمان والتوافق مع البنوك المركزية',
          'رؤى مالية مخصصة وتجارب ادخار تفاعلية تشجع على الاستثمار',
        ],
      },
    },
    {
      id: 'ecommerce-luxury',
      number: '02',
      tag: { en: 'Luxury Retail & DTC', ar: 'التجارة الإلكترونية والعلامات الفاخرة' },
      title: {
        en: 'E-Commerce, DTC & Luxury Brand Experiences',
        ar: 'التجارة الإلكترونية، متاجر DTC والتجزئة الفاخرة',
      },
      description: {
        en: 'Immersive digital storefronts, 3D product visualizers, one-tap mobile checkout funnels, and VIP loyalty portals that elevate brand prestige and drive conversion.',
        ar: 'متاجر رقمية غامرة، وأدوات استعراض ثلاثية الأبعاد للمنتجات، ومسارات شراء سريعة بلمسة واحدة تعزز مكانة العلامة ومعدلات الشراء.',
      },
      capabilities: {
        en: [
          'Interactive 3D Product Customizers & Configurator UIs',
          'Sub-Second Frictionless One-Tap Checkout Architectures',
          'Curated Editorial Storytelling & Lookbook Navigation',
          'VIP Tiered Loyalty & Gamified Rewards Hubs',
        ],
        ar: [
          'أدوات تفاعلية ثلاثية الأبعاد لتخصيص المنتجات وتركيبها',
          'معمارية دفع سريعة وفائقة السلاسة بلمسة واحدة عبر الجوال',
          'تصميم مجلات رقمية تفاعلية وقصص تسوق بصرية ملهمة',
          'بوابات ولاء حصرية ومكافآت مخصصة لكبار العملاء',
        ],
      },
    },
    {
      id: 'b2b-saas',
      number: '03',
      tag: { en: 'Enterprise SaaS', ar: 'منصات SaaS والأنظمة المؤسسية' },
      title: {
        en: 'B2B SaaS & Complex Enterprise Workflows',
        ar: 'منصات B2B SaaS وأنظمة إدارة الأعمال المعقدة',
      },
      description: {
        en: 'Taming deep administrative dashboards, multi-tenant permission matrices, dynamic data tables, and high-frequency productivity interfaces for enterprise teams.',
        ar: 'تبسيط لوحات التحكم الإدارية الضخمة، ومصفوفات الصلاحيات المتعددة، وجداول البيانات الديناميكية لمضاعفة إنتاجية فرق العمل المؤسسية.',
      },
      capabilities: {
        en: [
          'Customizable Multi-Tenant Analytics Dashboards',
          'Advanced Virtualized Data Tables with Instant Filtering',
          'Granular Role-Based Access Control (RBAC) Matrices',
          'Keyboard Shortcut Navigation & High-Velocity Power Modes',
        ],
        ar: [
          'لوحات تحكم تحليلية قابلة للتخصيص الكامل حسب متطلبات كل مستخدم',
          'جداول بيانات افتراضية متطورة تدعم الفرز والبحث اللحظي لملايين السجلات',
          'مصفوفات تحكم دقيقة بصلاحيات الوصول وأدوار المستخدمين المختلفة',
          'دعم اختصارات لوحة المفاتيح ووضعيات العمل السريعة للمحترفين',
        ],
      },
    },
    {
      id: 'healthcare-clinical',
      number: '04',
      tag: { en: 'Health & Clinical', ar: 'الرعاية الصحية والطب الرقمي' },
      title: {
        en: 'Healthcare, Telemedicine & Clinical Portals',
        ar: 'الرعاية الصحية، الطب الاتصالي والبوابات السريرية',
      },
      description: {
        en: 'Empathetic patient consultation portals, clear clinical diagnostic views, prescription tracking, and appointment booking engineered for clarity and reassurance.',
        ar: 'بوابات استشارات طبية تراعي المشاعر الإنسانية، وتصور واضح للتشخيص والتحاليل، وتتبع الوصفات وحجز المواعيد بمنتهى الطمأنينة والوضوح.',
      },
      capabilities: {
        en: [
          'Accessible Patient Portals Compliant with HIPAA & Seha',
          'Instant Doctor-Patient Video Triage & Scheduling UIs',
          'Visual Diagnostic Summaries & Prescription Tracking',
          'Emergency SOS Dispatch & Multilingual Medical Triage',
        ],
        ar: [
          'بوابات مرضى متوافقة مع أعلى معايير أمان وخصوصية البيانات الطبية',
          'واجهات حجز مكالمات الفيديو والتواصل الفوري مع الأطباء والاستشاريين',
          'ملخصات بصرية واضحة للفحوصات والتحاليل وتتبع صرف الأدوية',
          'أنظمة استجابة طارئة ودعم لغوي متعدد للمصطلحات الطبية المعقدة',
        ],
      },
    },
    {
      id: 'govtech-smart-cities',
      number: '05',
      tag: { en: 'Smart Mobility & GovTech', ar: 'النقل الذكي والخدمات الحكومية' },
      title: {
        en: 'Smart Mobility, Logistics & Citizen Portals',
        ar: 'النقل الذكي، سلاسل الإمداد وبوابات المواطنين الرقمية',
      },
      description: {
        en: 'Geospatial fleet routing, intuitive ride-hailing maps, citizen service request portals, and multi-tier public sector workflows designed for universal accessibility.',
        ar: 'خرائط تتبع ذكية للأساطيل، وتطبيقات نقل بديهية، وبوابات تقديم الخدمات الحكومية المصممة لسهولة الوصول والاستخدام الشامل لكافة فئات المجتمع.',
      },
      capabilities: {
        en: [
          'Real-Time Geospatial Map Navigation & Telemetry',
          'Streamlined Citizen Service Delivery & Document Requests',
          'Automated Fleet Dispatch & Driver Task Interfaces',
          'Universal WCAG 2.2 Level AA Accessibility Across All Ages',
        ],
        ar: [
          'خرائط جغرافية تفاعلية لتتبع المركبات والرحلات في الوقت الفعلي',
          'مسارات ميسرة لتقديم المعاملات الحكومية وطلب المستندات الرسمية',
          'واجهات مهام واضحة ومبسطة لسائقي التوصيل ومندوبي الشحن',
          'معايير إتاحة عالمية تناسب كبار السن وذوي الإعاقة بكل سلاسة',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'Design Tooling, Prototyping Engines & Token Infrastructure',
    ar: 'أدوات التصميم، محركات النماذج التفاعلية والبنية التحتية للمتغيرات',
  },
  techStackSubtitle: {
    en: 'We leverage industry-standard design technologies and automated token pipelines to guarantee fluid handoff, design QA, and engineering precision.',
    ar: 'نعتمد أحدث برمجيات التصميم العالمية ومسارات المزامنة المؤتمتة لضمان تسليم برمجي سلس وضبط صارم لجودة التنفيذ في كل شاشة.',
  },
  techStackPods: [
    {
      title: {
        en: 'Design Systems & UI Architecture',
        ar: 'أنظمة التصميم ومعمارية الواجهات',
      },
      badge: { en: 'Core Design Engine', ar: 'محرك التصميم الأساسي' },
      description: {
        en: 'Master multi-platform component libraries, responsive layout grids, and interactive vector assets maintained across scalable Figma cloud environments.',
        ar: 'مكتبات عناصر متكاملة متعددة المنصات، وشبكات تخطيط متجاوبة، وأصول متجهة تفاعلية تُدار عبر بيئات فيجما السحابية المنظمة.',
      },
      technologies: [
        { name: 'Figma Enterprise', category: 'UI Design', badge: 'Primary' },
        { name: 'FigJam', category: 'Ideation' },
        { name: 'ProtoPie', category: 'Advanced Motion', badge: 'High-Fi' },
        { name: 'Framer', category: 'Interactive Web' },
        { name: 'Principle', category: 'Micro-Interactions' },
      ],
    },
    {
      title: {
        en: 'User Research & Behavioral Analytics',
        ar: 'أبحاث المستخدمين وتحليلات السلوك',
      },
      badge: { en: 'Validation & Telemetry', ar: 'التحقق والقياس السلوكي' },
      description: {
        en: 'Continuous qualitative and quantitative feedback loops capturing live heatmaps, session recordings, conversion funnels, and cognitive friction scores.',
        ar: 'أدوات رصد لحظية لتسجيل الجلسات، والخرائط الحرارية، ومسارات التحويل لقياس الجهد المعرفي ونقاط توقف المستخدمين بدقة علمية.',
      },
      technologies: [
        { name: 'Hotjar', category: 'Heatmaps' },
        { name: 'Maze Testing', category: 'Usability Labs', badge: 'Testing' },
        { name: 'Mixpanel', category: 'Product Analytics' },
        { name: 'FullStory', category: 'Session Replay' },
        { name: 'UserTesting', category: 'Qualitative Research' },
      ],
    },
    {
      title: {
        en: 'Design Tokens & Engineering Handoff',
        ar: 'رموز التصميم والتسليم البرمجي',
      },
      badge: { en: 'Code Synchronization', ar: 'مزامنة الكود البرمجي' },
      description: {
        en: 'Automated token translation pipeline transforming Figma styles into production-ready CSS variables, Tailwind configuration, and React component props.',
        ar: 'مسار مؤتمت يحول أنماط فيجما مباشرة إلى متغيرات CSS جاهزة للإنتاج، وإعدادات Tailwind ومكونات React معيارية.',
      },
      technologies: [
        { name: 'Tokens Studio', category: 'Design Tokens', badge: 'Automated' },
        { name: 'Storybook', category: 'UI Component Docs' },
        { name: 'Tailwind CSS', category: 'Design Utilities' },
        { name: 'Radix UI / Headless', category: 'Accessible Primitives' },
        { name: 'Style Dictionary', category: 'Multi-Platform Export' },
      ],
    },
    {
      title: {
        en: 'Accessibility & Quality Governance',
        ar: 'إمكانية الوصول وضبط الجودة الشاملة',
      },
      badge: { en: 'Compliance & QA', ar: 'الامتثال وضمان الجودة' },
      description: {
        en: 'Automated contrast checkers, screen-reader validation, and interactive focus state testing enforcing complete WCAG 2.2 Level AA compliance.',
        ar: 'أدوات فحص تباين مؤتمتة، واختبارات قارئات الشاشة والتركيز اللمسي لضمان التوافق التام مع معايير الوصول العالمية WCAG 2.2 AA.',
      },
      technologies: [
        { name: 'Axe DevTools', category: 'Accessibility QA', badge: 'WCAG 2.2' },
        { name: 'Stark for Figma', category: 'Contrast & Vision' },
        { name: 'Google Lighthouse', category: 'UX Performance' },
        { name: 'VoiceOver / TalkBack', category: 'Screen Readers' },
        { name: 'Color Oracle', category: 'Color Blindness Simulation' },
      ],
    },
  ],

  clientStories: getUxProductDesignFeaturedClientStories(),

  delivery: {
    title: {
      en: 'How We Deliver Products Differently',
      ar: 'كيف نصمم ونبني المنتجات الرقمية بمنهجية استثنائية',
    },
    subtitle: {
      en: 'A rigorous four-phase design-to-production framework engineered to validate ideas early, eliminate rework, and accelerate time-to-market.',
      ar: 'منظومة عمل متكاملة في أربع مراحل استراتيجية تضمن التحقق المبكر من الفرضيات، والقضاء على الهدر وإطلاق المنتج في زمن قياسي.',
    },
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1400&q=85',
    pillars: [
      {
        title: {
          en: '1. Heuristic Audit & User Research Sprint',
          ar: '١. التدقيق الإرشادي وأبحاث سلوك المستخدمين',
        },
        description: {
          en: 'We dissect your existing software telemetry or conduct field interviews to uncover root cognitive bottlenecks, user drop-offs, and high-impact feature opportunities.',
          ar: 'نحلل بيانات الاستخدام للمنتج الحالي ونجري مقابلات ميدانية لتشخيص نقاط الاحتكاك المعرفي وتحديد الفرص الأكثر تأثيراً على النمو.',
        },
      },
      {
        title: {
          en: '2. Information Architecture & Rapid Prototyping',
          ar: '٢. هيكلة المعلومات وبناء النماذج التفاعلية السريعة',
        },
        description: {
          en: 'We structure intuitive screen hierarchies and develop high-fidelity clickable prototypes that allow stakeholders and real users to validate the experience before code.',
          ar: 'نبني هياكل شاشات بديهية ونطور نماذج تفاعلية تحاكي الواقع تتيح لأصحاب القرار والعملاء تجربة المنتج والتحقق من سلاسته قبل البرمجة.',
        },
      },
      {
        title: {
          en: '3. Living Design System & Token Architecture',
          ar: '٣. تطوير نظام التصميم الحي ومعمارية المتغيرات',
        },
        description: {
          en: 'We author a comprehensive modular component library in Figma synced directly with code tokens, establishing visual brand cohesion across all digital touchpoints.',
          ar: 'نصمم مكتبة عناصر معيارية متكاملة في فيجما متزامنة مباشرة مع كود التطوير، لترسيخ وحدة الهوية وسرعة الإطلاق عبر كافة القنوات.',
        },
      },
      {
        title: {
          en: '4. Engineering Handoff, Design QA & Launch',
          ar: '٤. التسليم البرمجي المتقن وضبط الجودة والإطلاق',
        },
        description: {
          en: 'Our designers embed directly with your frontend developers, providing pixel-perfect CSS specs, motion curves, and accessibility audits until production perfection is achieved.',
          ar: 'يندمج مصممونا مباشرة مع فريق التطوير، مقدمين مواصفات دقيقة ومنحنيات حركة وتدقيقاً مستمراً حتى يخرج المنتج للجمهور بأعلى درجات الإتقان.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'design-tokens-enterprise-scale',
      slug: 'design-tokens-enterprise-scale',
      title: {
        en: 'The Enterprise Guide to Design Tokens: Bridging Figma and Production Code',
        ar: 'الدليل المؤسسي لرموز التصميم (Design Tokens): الجسر الحقيقي بين فيجما والكود البرمجي',
      },
      category: {
        en: 'Design Systems & Engineering',
        ar: 'أنظمة التصميم والهندسة',
      },
      date: 'Aug 28, 2026',
      readTime: '6 min read',
      excerpt: {
        en: 'How leading engineering teams eliminate visual drift, automate dark mode, and accelerate multi-platform frontend delivery by 65% through tokenized design architectures.',
        ar: 'كيف تقضي الفرق الهندسية الرائدة على التباين البصري وتؤتمت السمات الداكنة وتسرع إطلاق الواجهات بنسبة 65% عبر رموز التصميم المعيارية.',
      },
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=85',
      href: '/insights/design-tokens-enterprise-scale',
    },
    {
      id: 'wcag-accessibility-modern-saas',
      slug: 'wcag-accessibility-modern-saas',
      title: {
        en: 'Designing for Everyone: Achieving WCAG 2.2 AA Compliance in Complex SaaS Portals',
        ar: 'التصميم الشامل للجميع: تحقيق معايير WCAG 2.2 AA في بوابات البرمجيات المؤسسية المعقدة',
      },
      category: {
        en: 'Accessibility & Usability',
        ar: 'إمكانية الوصول وسهولة الاستخدام',
      },
      date: 'Aug 14, 2026',
      readTime: '7 min read',
      excerpt: {
        en: 'Accessibility is not an afterthought; it is a competitive advantage. Discover practical UX guidelines for contrast ratios, keyboard navigation, and screen-reader tree architecture.',
        ar: 'إمكانية الوصول ليست خياراً ثانوياً، بل ميزة تنافسية حاسمة. اكتشف إرشادات عملية للتباين، والتنقل بلوحة المفاتيح وقارئات الشاشة.',
      },
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=85',
      href: '/insights/wcag-accessibility-modern-saas',
    },
    {
      id: 'cognitive-load-reduction-fintech',
      slug: 'cognitive-load-reduction-fintech',
      title: {
        en: 'Reducing Cognitive Overload in High-Frequency Trading & Banking Interfaces',
        ar: 'تقليل الجهد المعرفي في واجهات التداول عالي التردد والتطبيقات المصرفية',
      },
      category: {
        en: 'FinTech UX Architecture',
        ar: 'معمارية تجربة المستخدم المالي',
      },
      date: 'Jul 29, 2026',
      readTime: '8 min read',
      excerpt: {
        en: 'How visual hierarchy, progressive disclosure, and contextual data visualization transform intimidating financial interfaces into trust-inspiring customer journeys.',
        ar: 'كيف يساهم التسلسل البصري الذكي والكشف التدريجي عن المعلومات في تحويل الشاشات المالية المعقدة إلى تجارب تبني ثقة المستثمر.',
      },
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
      href: '/insights/cognitive-load-reduction-fintech',
    },
    {
      id: 'micro-interactions-checkout-conversion',
      slug: 'micro-interactions-checkout-conversion',
      title: {
        en: 'The Psychology of Micro-Interactions: Elevating Checkout Conversions by 34%',
        ar: 'سيكولوجيا التفاعلات الميكروية: كيف ترفع التفاصيل الحركية الدقيقة معدل الشراء بنسبة 34%',
      },
      category: {
        en: 'Conversion & Behavioral Design',
        ar: 'التصميم السلوكي والتحويل',
      },
      date: 'Jul 12, 2026',
      readTime: '5 min read',
      excerpt: {
        en: 'Subtle tactile feedback, animated validation states, and instant progress markers turn anxiety-inducing purchase moments into effortless, rewarding conversions.',
        ar: 'الاستجابة اللمسية الدقيقة، وحركات التحقق الفوري، ومؤشرات التقدم الواضحة تحول لحظات الشراء المقلقة إلى عمليات سلسة وممتعة.',
      },
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=85',
      href: '/insights/micro-interactions-checkout-conversion',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici completely transformed our digital product ecosystem. Their user research was eye-opening, uncovering bottlenecks we had overlooked for years. The living design system they engineered for our mobile and web applications cut our frontend engineering cycles in half and drove a 340% increase in checkout conversions. They don’t just design pretty screens; they engineer commercial impact.',
      ar: 'أعادت بيرسيكي ابتكار منظومة منتجاتنا الرقمية بالكامل. كانت أبحاث المستخدمين بمثابة نقلة نوعية كشفت لنا عن نقاط احتكاك غفلنا عنها لسنوات. وقد ساهم نظام التصميم الحي الذي بنوه لتطبيقاتنا وموقعنا في خفض زمن التطوير البرمجي للنصف ورفع إتمام الشراء بنسبة 340%. هم لا يصممون شاشات جذابة فحسب، بل يصنعون أثراً تجارياً استثنائياً.',
    },
    author: 'Tariq Al-Mansoor',
    role: {
      en: 'VP of Digital Product & Customer Experience, Luxury Retail Group GCC',
      ar: 'نائب الرئيس للمنتجات الرقمية وتجربة العميل، مجموعة التجزئة الفاخرة الخليجية',
    },
    badge: {
      en: 'Verified Enterprise Product Review',
      ar: 'تقييم موثق من قيادة المنتجات الرقمية',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions',
    ar: 'الأسئلة الشائعة حول تصميم المنتجات وتجربة المستخدم',
  },
  faqsSubtitle: {
    en: 'Everything you need to know about our product design sprints, living design systems, usability testing, and developer handoff process.',
    ar: 'كل ما تحتاج لمعرفته حول سبرنتات تصميم المنتجات، وأنظمة التصميم، واختبارات الاستخدام، وآلية التسليم البرمجي المتقن.',
  },
  faqs: [
    {
      question: {
        en: 'How does Persici approach UX research before designing UI screens?',
        ar: 'كيف تنفذ بيرسيكي أبحاث تجربة المستخدم قبل البدء في تصميم الواجهات؟',
      },
      answer: {
        en: 'We begin with an intensive discovery phase: analyzing your current product telemetry (drop-offs, session replays, click heatmaps), conducting 1-on-1 qualitative interviews with target customers, and synthesizing findings into Opportunity Solution Trees and journey maps. We never design based on subjective opinion; every wireframe solves a verified human friction point.',
        ar: 'نبدأ بمرحلة اكتشاف مكثفة: تحليل بيانات الاستخدام للمنتج الحالي (معدلات المغادرة، تسجيلات الجلسات، الخرائط الحرارية)، وإجراء مقابلات فردية مع عملاء مستهدفين حقيقيين، وصياغة النتائج في أشجار حلول وخرائط رحلة واضحة. نحن لا نصمم بناءً على آراء شخصية، بل يحل كل إطار مشكلة حقيقية مثبتة بالبيانات.',
      },
    },
    {
      question: {
        en: 'What is included in a Persici living design system?',
        ar: 'ماذا يتضمن نظام التصميم الحي (Living Design System) من بيرسيكي؟',
      },
      answer: {
        en: 'A complete design system includes multi-tier design tokens (colors, semantic typography, responsive spacing, shadows, border radii), fully responsive atomic components with 100% interactive state coverage (hover, active, focus, disabled, loading, error), comprehensive dark and light modes, and seamless token synchronization with your frontend codebase via Tokens Studio and Storybook.',
        ar: 'يتضمن نظام التصميم رموزاً معيارية متعددة المستويات (الألوان، الخطوط، المسافات، الظلال، حواف العناصر)، ومكتبة عناصر ذرية متجاوبة تغطي كافة حالات التفاعل (التحويم، النقر، التركيز، التحميل، والخطأ)، ودعماً متزامناً للوضعين الداكن والفاتح، مع مزامنة مؤتمتة لرموز الكود عبر Tokens Studio و Storybook.',
      },
    },
    {
      question: {
        en: 'How do you ensure designs are accessible and comply with WCAG standards?',
        ar: 'كيف تضمنون توافق التصاميم مع معايير إمكانية الوصول العالمية (WCAG)؟',
      },
      answer: {
        en: 'We design strictly to WCAG 2.2 Level AA accessibility standards from day one. This includes automated 4.5:1 text-to-background contrast verification, touch target sizes of at least 44x44 points, explicit focus ring indicators for keyboard navigation, logical screen-reader header hierarchies, and color-blindness simulation testing.',
        ar: 'نصمم وفق معايير WCAG 2.2 AA العالمية منذ اليوم الأول. يشمل ذلك تدقيقاً مؤتمتاً لنسب تباين الألوان لا تقل عن 4.5:1، ومساحات لمس لا تقل عن 44×44 نقطة، ومؤشرات تركيز واضحة للتنقل بلوحة المفاتيح، وهياكل برمجية تدعم قارئات الشاشة للمكفوفين ومحاكاة درجات عمى الألوان.',
      },
    },
    {
      question: {
        en: 'How does your team handle the handoff to our internal frontend developers?',
        ar: 'كيف يتعامل فريقكم مع التسليم البرمجي لمهندسي الواجهات في شركتنا؟',
      },
      answer: {
        en: 'We believe design handoff is a continuous partnership, not an export file. We provide pixel-perfect Figma specs with inspectable CSS token variables, interactive ProtoPie or Framer micro-interaction motion curves, and Storybook components. Furthermore, our designers conduct weekly Design QA reviews on staging builds to catch and eliminate visual defects before production.',
        ar: 'نؤمن أن التسليم البرمجي شراكة مستمرة وليس مجرد إرسال ملفات. نقدم شاشات فيجما مفصلة بمتغيرات CSS معيارية، ومنحنيات حركة تفاعلية، ومكونات Storybook. كما يعقد مصممونا مراجعات أسبوعية لضبط جودة التصميم على النسخ التجريبية للتأكد من مطابقة الكود للتصميم بنسبة 100%.',
      },
    },
    {
      question: {
        en: 'Can you redesign our complex enterprise SaaS platform without disrupting active users?',
        ar: 'هل يمكنكم إعادة تصميم منصة SaaS مؤسسية معقدة دون إرباك المستخدمين الحاليين؟',
      },
      answer: {
        en: 'Yes. For mature products, we recommend an incremental design system migration. We build the centralized design token infrastructure first, re-architect core high-friction workflows, and roll out improvements progressively behind feature flags or phased releases, accompanied by contextual in-app onboarding to ensure zero disruption to daily productivity.',
        ar: 'نعم بالتأكيد. بالنسبة للمنتجات القائمة، نتبع استراتيجية التحول التدريجي. نبني البنية التحتية لرموز التصميم أولاً، ثم نعيد هندسة المسارات الأكثر احتكاكاً، ونطلق التحسينات تدريجياً عبر إطلاقات مرحلية مدعومة بتعليمات توجيهية تفاعلية تضمن استمرار الإنتاجية دون أي إرباك.',
      },
    },
    {
      question: {
        en: 'What is the typical timeline for an end-to-end product design project?',
        ar: 'ما هو الجدول الزمني المعتاد لمشروع تصميم منتج رقمي متكامل؟',
      },
      answer: {
        en: 'A standard comprehensive engagement spans 6 to 12 weeks: Weeks 1–3 focus on heuristic auditing and user research; Weeks 4–6 cover information architecture, wireframing, and low-fidelity prototypes; Weeks 7–9 deliver high-fidelity UI screens and interactive user testing; and Weeks 10–12 finalize the living design system, developer tokens, and launch QA.',
        ar: 'تستغرق المشاريع الشاملة عادة من 6 إلى 12 أسبوعاً: الأسابيع 1-3 مخصصة للتدقيق الإرشادي وأبحاث المستخدمين، والأسابيع 4-6 لهيكلة المعلومات وبناء المخططات والنماذج الأولية، والأسابيع 7-9 للتصميم البصري عالي الدقة واختبارات الاستخدام، والأسابيع 10-12 لبناء نظام التصميم والتسليم البرمجي.',
      },
    },
  ],
};
