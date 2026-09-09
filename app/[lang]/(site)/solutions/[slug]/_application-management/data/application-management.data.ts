import type { SolutionDiagramType, FeaturedClientStoryItem, SolutionBenefitItem, SolutionExecutionPillar, SolutionFaqItem } from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { getApplicationManagementFeaturedClientStories } from '@shared/data';

export interface ApplicationOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface ApplicationVerticalItem {
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

export interface ApplicationManagementData {
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
  offerings: ApplicationOfferingItem[];
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
  verticals: ApplicationVerticalItem[];
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

export const applicationManagementData: ApplicationManagementData = {
  hero: {
    tag: {
      en: 'Solutions & Engineering',
      ar: 'الحلول والهندسة البرمجية',
    },
    secondaryTag: {
      en: 'Application & Management',
      ar: 'التطبيقات والإدارة',
    },
    title: {
      en: 'Application Development & Lifecycle Management',
      ar: 'تطوير التطبيقات وإدارة دورة حياتها الرقمية',
    },
    subtitle: {
      en: 'Continue accelerating your digital transformation journey with high-performance, resilient native and cross-platform applications built for scale and retention.',
      ar: 'واصل تسريع رحلة التحول الرقمي لمؤسستك مع تطبيقات الهاتف عالية الأداء والموثوقية، المصممة للنمو والتوسع وتجربة استخدام استثنائية.',
    },
    ctaText: {
      en: 'Schedule Strategy Session',
      ar: 'احجز استشارة استراتيجية',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1400&q=85',
    highlights: [
      {
        en: 'Native & Cross-Platform Development (Swift, Kotlin, Flutter, React Native)',
        ar: 'تطوير التطبيقات الأصلية وعبر المنصات (Swift, Kotlin, Flutter, React Native)',
      },
      {
        en: 'End-to-End Application Lifecycle Management from Blueprint to Scale',
        ar: 'إدارة دورة حياة التطبيقات المتكاملة من المخطط المعماري إلى التوسع',
      },
      {
        en: 'Enterprise Security, Cryptographic Vaults & Regulatory Compliance',
        ar: 'معايير الأمان المؤسسي، خزائن التشفير والامتثال للوائح التنظيمية',
      },
      {
        en: 'Continuous App Store & Google Play Deployment with SLA Support',
        ar: 'النشر المستمر على متاجر التطبيقات مع ضمان اتفاقية مستوى الخدمة',
      },
    ],
  },

  offeringsTitle: {
    en: 'Core Engineering Pillars',
    ar: 'ركائز الهندسة والتطوير الأساسية',
  },
  offeringsSubtitle: {
    en: 'Comprehensive capabilities addressing every tier of modern enterprise mobile application development.',
    ar: 'قدرات هندسية شاملة تغطي كافة مراحل ومستويات بناء وتشغيل تطبيقات الهاتف المؤسسية الحديثة.',
  },
  offerings: [
    {
      slug: 'native-cross-platform',
      tag: { en: 'Core Platform', ar: 'المنصات الأساسية' },
      title: { en: 'iOS & Android App Development', ar: 'تطوير تطبيقات iOS و Android' },
      description: {
        en: 'Native and high-performance cross-platform applications built with Swift, Kotlin, Flutter, and React Native for fluid, 120fps responsive experiences.',
        ar: 'تطبيقات أصلية وهجينة فائقة السرعة والاستجابة بمعدل 120 إطاراً في الثانية، باستخدام أحدث أطر العمل لتجربة مستخدم لا مثيل لها.',
      },
      icon: '/icons/solutions/app-mobile-dev.svg',
      diagramType: 'app-dual-stack',
      highlights: {
        en: ['Swift & Kotlin Native', 'Flutter & React Native', 'Hardware Acceleration', 'Biometric Authentication'],
        ar: ['برمجة أصلية Swift وKotlin', 'أطر عمل Flutter وReact Native', 'تسريع عتادي للأداء', 'مصادقة بيومترية'],
      },
    },
    {
      slug: 'mobile-ui-ux',
      tag: { en: 'Experience Design', ar: 'تصميم التجربة' },
      title: { en: 'UI/UX Design for Mobile', ar: 'تصميم واجهات وتجربة المستخدم' },
      description: {
        en: 'User-centric interfaces engineered for effortless touch interactions, intuitive user journeys, and higher daily engagement and retention.',
        ar: 'واجهات تفاعلية تركز على المستخدم، مصممة للإبحار السلس ولمسات التفاعل الطبيعية، لرفع معدلات الاحتفاظ والاستخدام اليومي.',
      },
      icon: '/icons/solutions/app-mobile-design.svg',
      diagramType: 'bezier-curv-engine',
      highlights: {
        en: ['Design System Tokens', 'Fluid Micro-Interactions', 'GCC Localization & RTL', 'Accessibility (WCAG 2.1)'],
        ar: ['أنظمة تصميم موحدة', 'تفاعلات دقيقة انسيابية', 'توطين كامل للغة العربية', 'معايير الوصول الشامل'],
      },
    },
    {
      slug: 'backend-api',
      tag: { en: 'Cloud Architecture', ar: 'البنية التحتية' },
      title: { en: 'Backend & API Development', ar: 'تطوير الأنظمة الخلفية والواجهات البرمجية' },
      description: {
        en: 'High-throughput microservices, real-time WebSocket sync, and secure GraphQL & REST APIs architected for zero-downtime scalability.',
        ar: 'خدمات سحابية مصغرة فائقة الأداء، مزامنة لحظية عبر بروتوكولات WebSockets، وواجهات برمجية آمنة صُممت للعمل دون أي توقف.',
      },
      icon: '/icons/solutions/app-backend-api.svg',
      diagramType: 'api-cluster-gateway',
      highlights: {
        en: ['Microservices Architecture', 'Real-Time WebSockets', 'GraphQL & REST Gateways', 'Encrypted Caching Tiers'],
        ar: ['هندسة خدمات مصغرة', 'اتصال لحظي WebSockets', 'بوابات GraphQL وREST', 'طبقات تخزين مؤقت مشفرة'],
      },
    },
    {
      slug: 'qa-testing',
      tag: { en: 'Engineering Rigor', ar: 'الجودة والأمان' },
      title: { en: 'Quality Assurance & Testing', ar: 'ضمان الجودة والاختبارات الشاملة' },
      description: {
        en: 'End-to-end automated testing pipelines, device farm validation across 500+ physical handsets, penetration tests, and regression safety.',
        ar: 'اختبارات مؤتمتة متكاملة تشمل الفحص على أكثر من 500 هاتف فيزيائي حقيقي، ومراجعات أمنية واختبارات اختراق دقيقة لمنع أي ثغرات.',
      },
      icon: '/icons/solutions/app-qa-testing.svg',
      diagramType: 'automated-test-grid',
      highlights: {
        en: ['Automated End-to-End Testing', 'Cloud Device Farm Verification', 'Penetration & Security Audits', 'Load & Stress Benchmarks'],
        ar: ['اختبارات مؤتمتة من البداية للنهاية', 'فحص على مئات الأجهزة الحقيقية', 'مراجعات أمنية واختراق', 'محاكاة أحمال الضغط العالي'],
      },
    },
    {
      slug: 'deployment-support',
      tag: { en: 'DevOps & Launch', ar: 'النشر والتشغيل' },
      title: { en: 'App Deployment & Launch Support', ar: 'إدارة النشر ودعم الإطلاق المستمر' },
      description: {
        en: 'Guaranteed store compliance for Apple App Store and Google Play, zero-friction releases, proactive telemetry, and 24/7 hypercare support.',
        ar: 'اعتماد موثوق على متاجر آبل وجوجل بامتثال كامل للإرشادات، وإطلاق سلس مع مراقبة استباقية للأداء ودعم تشغيلي متواصل على مدار الساعة.',
      },
      icon: '/icons/solutions/app-deployment-launch.svg',
      diagramType: 'store-launch-trajectory',
      highlights: {
        en: ['Store Guidelines Compliance', 'Automated CI/CD Pipelines', 'Crash Telemetry & Analytics', '24/7 SLA Support'],
        ar: ['مطابقة معايير المتاجر بدقة', 'خطوط نشر CI/CD مؤتمتة', 'رصد وتحليل فوري للأعطال', 'دعم فني وضمان اتفاقية SLA'],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Modern mobile engineering is no longer just code — it is your direct commercial frontline.',
      ar: 'هندسة التطبيقات الحديثة لم تعد مجرد كتابة أكواد — إنها واجهة أعمالك ومحرك نموك المباشر.',
    },
    text: {
      en: 'In today\'s hyper-connected market, your mobile app is where customer trust is won or lost. High latency, clunky interfaces, or frequent crashes directly erode customer lifetime value. Persici architects resilient mobile solutions that unite speed, fluid motion, security, and continuous delivery to outperform market expectations.',
      ar: 'في عالمنا الرقمي المتسارع، يُعد تطبيق الهاتف المساحة الأولى لبناء ثقة عملائك أو خسارتها. البطء في الاستجابة أو تعقيد الواجهات يؤدي فوراً إلى تراجع ولاء العملاء. في بيرسيكي نصمم ونطور تطبيقات تدمج بين السرعة الفائقة، والأمان المؤسسي، وسهولة الاستخدام لتتفوق على تطلعات السوق.',
    },
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=85',
    metric1Val: '99.98%',
    metric1Label: {
      en: 'Crash-Free Sessions Across Production',
      ar: 'جلسات خالية تماماً من الأعطال في الإنتاج',
    },
    metric2Val: '<120ms',
    metric2Label: {
      en: 'Average Interactive Response Latency',
      ar: 'متوسط زمن الاستجابة التفاعلية اللحظية',
    },
  },

  benefitsStrip: {
    title: {
      en: 'Architectural Advantages Built for Sustainable Scale',
      ar: 'مزايا معمارية مصممة للنمو المؤسسي المستدام',
    },
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85',
    benefits: [
      {
        title: {
          en: 'High-Velocity Multi-Platform Speed',
          ar: 'سرعة إطلاق قياسية عبر المنصات',
        },
        description: {
          en: 'Shared business logic engines that cut dual-platform development cycles by 40% while preserving platform-native visual fidelity.',
          ar: 'محركات منطق برمجي مشتركة تقلل دورة التطوير بنسبة 40% مع الحفاظ الكامل على الأداء والشعور الأصيل لكل نظام.',
        },
        accentColor: '#D83427',
      },
      {
        title: {
          en: 'Offline-First Resilience & Sync',
          ar: 'موثوقية العمل دون اتصال مع المزامنة الذكية',
        },
        description: {
          en: 'Local transactional databases that enable seamless transactions even in remote or low-connectivity environments, syncing automatically upon reconnection.',
          ar: 'قواعد بيانات محلية تتيح إتمام العمليات التشغيلية دون انقطاع حتى مع ضعف الشبكة، مع مزامنة لحظية فور استعادة الاتصال.',
        },
        accentColor: '#EF8C7D',
      },
      {
        title: {
          en: 'Enterprise Security & Biometric Vaults',
          ar: 'حماية وتشفير عالي المستوى مع المصادقة البيومترية',
        },
        description: {
          en: 'Military-grade AES-256 local encryption, certificate pinning, biometric enclave storage, and OWASP Mobile Top 10 compliance.',
          ar: 'تشفير فائق بتقنية AES-256، وتثبيت شهادات SSL، وتخزين المفاتيح في الجيوب البيومترية المعزولة مع امتثال لمعايير OWASP.',
        },
        accentColor: '#121212',
      },
    ],
  },

  verticalsTitle: {
    en: 'Specialized Industry Solutions',
    ar: 'حلول متخصصة لمختلف القطاعات',
  },
  verticalsSubtitle: {
    en: 'Purpose-built mobile architectures tailored to the specific business workflows, compliance mandates, and user behaviors of leading industries.',
    ar: 'بنى تقنية مخصصة تناسب مسارات العمل التشغيلية، والمتطلبات التنظيمية، وسلوكيات المستخدمين عبر أهم القطاعات الحيوية.',
  },
  verticals: [
    {
      id: 'ecommerce',
      number: '01',
      title: { en: 'E-Commerce Applications', ar: 'تطبيقات التجارة الإلكترونية' },
      description: {
        en: 'High-converting mobile storefronts engineered with 1-click checkout, native Apple Pay & Mada integrations, personalized push engines, and real-time inventory synchronization.',
        ar: 'متاجر رقمية متقدمة مصممة لتحقيق أعلى معدلات تحويل، وتكامل فوري مع Apple Pay ومدى، وإشعارات ذكية مخصصة مع مزامنة لحظية مع المخزون.',
      },
      tag: { en: 'Retail & Commerce', ar: 'التجزئة والتجارة' },
      iconName: 'shopping-bag',
      capabilities: {
        en: ['Instant Apple Pay & Mada Checkout', 'Dynamic Recommendation Algorithms', 'Real-Time Inventory & Order Sync', 'Customer Loyalty & Reward Tiers'],
        ar: ['دفع فوري عبر Apple Pay ومدى', 'خوارزميات ترشيح المنتجات الذكية', 'مزامنة فورية للطلبات والمخزون', 'برامج مكافآت ونقاط ولاء متقدمة'],
      },
    },
    {
      id: 'ondemand',
      number: '02',
      title: { en: 'On-Demand Applications', ar: 'تطبيقات الخدمات عند الطلب' },
      description: {
        en: 'Hyper-responsive dispatch platforms equipped with sub-second geospatial telemetry, dynamic pricing engines, live route optimization, and bidirectional driver-passenger sockets.',
        ar: 'منصات توصيل وخدمات عند الطلب فائقة السرعة، مدعومة بتتبع جغرافي لحظي، وخوارزميات توزيع وتوجيه ذكية مع اتصال لحظي دائم.',
      },
      tag: { en: 'Logistics & Delivery', ar: 'اللوجستيات والتوصيل' },
      iconName: 'map-pin',
      capabilities: {
        en: ['Real-Time GPS & ETA Tracking', 'Algorithmic Dispatch & Heatmaps', 'Multi-Party In-App Chat & Calls', 'Surge Pricing & Fleet Metrics'],
        ar: ['تتبع GPS وحساب دقيق لوقت الوصول', 'توزيع آلي وخريطة حرارية للطلب', 'محادثات ومكالمات داخل التطبيق', 'تسعير ديناميكي وإدارة الأسطول'],
      },
    },
    {
      id: 'marketplace',
      number: '03',
      title: { en: 'Marketplace Applications', ar: 'تطبيقات الأسواق الرقمية' },
      description: {
        en: 'Multi-sided platforms featuring vendor management portals, automated escrow payments, escrow split settlements, localized catalog search, and integrated dispute resolution.',
        ar: 'منصات تفاعلية متعددة الأطراف تشمل بوابات خاصة للتجار، وتسويات مالية مجزأة مؤتمتة، وبحثاً ذكياً في الكتالوجات مع نظام لإدارة النزاعات.',
      },
      tag: { en: 'Multi-Sided Platforms', ar: 'منصات متعددة الأطراف' },
      iconName: 'layers',
      capabilities: {
        en: ['Vendor Portals & Analytics', 'Automated Split Payouts & Escrow', 'Faceted Search & AI Filtering', 'Buyer-Seller Secure Messaging'],
        ar: ['بوابات التجار ولوحات التحليلات', 'تسويات مالية آلية وحسابات ضمان', 'محرك بحث متطور وفلاتر ذكية', 'مراسلات آمنة بين البائع والمشتري'],
      },
    },
    {
      id: 'corporate',
      number: '04',
      title: { en: 'Corporate & Internal Applications', ar: 'تطبيقات الشركات والأنظمة الداخلية' },
      description: {
        en: 'Enterprise workforce enablement tools with role-based biometric authentication, offline field operations mode, enterprise SSO, and deep bi-directional ERP/CRM sync.',
        ar: 'أدوات رقمية لتمكين فرق العمل والموظفين، تتضمن مصادقة بيومترية مشفرة، وتشغيل ميداني بدون إنترنت، وربطاً شاملاً مع أنظمة ERP و CRM.',
      },
      tag: { en: 'Enterprise Operations', ar: 'العمليات المؤسسية' },
      iconName: 'shield-check',
      capabilities: {
        en: ['Enterprise SSO & MDM Governance', 'Offline-First Field Auditing', 'ERP & SAP/Salesforce Connectors', 'Granular Role-Based Access (RBAC)'],
        ar: ['دخول موحد SSO وإدارة أجهزة MDM', 'تدقيق ميداني يعمل دون اتصال', 'موصلات مباشرة مع SAP وSalesforce', 'صلاحيات وصول دقيقة ومخصصة'],
      },
    },
    {
      id: 'subscription',
      number: '05',
      title: { en: 'Subscription & Membership Applications', ar: 'تطبيقات الاشتراكات والعضويات' },
      description: {
        en: 'Engagement-driven digital communities with recurring tiered billing, gated content vaults, interactive community lounges, and smart churn-prevention engines.',
        ar: 'تطبيقات مجتمعية متكاملة تدعم فوترة الاشتراكات الدورية، وبوابات وصول للمحتوى الحصري، ومجتمعات تفاعلية تسهم في رفع ولاء واستبقاء الأعضاء.',
      },
      tag: { en: 'Media & Memberships', ar: 'الإعلام والمجتمعات' },
      iconName: 'star',
      capabilities: {
        en: ['App Store & Play In-App Purchases', 'Tier-Gated Media & Streaming', 'Interactive Forums & Networking', 'Automated Churn Reduction Logic'],
        ar: ['مشتريات واشتراكات داخل المتاجر', 'محتوى وبث مخصص حسب العضوية', 'غرف نقاش ومجتمعات تفاعلية', 'آليات ذكية للحد من إلغاء الاشتراك'],
      },
    },
  ],

  techStackTitle: {
    en: 'Enterprise Mobile Technology Stack',
    ar: 'البنية التقنية المؤسسية لتطوير التطبيقات',
  },
  techStackSubtitle: {
    en: 'Resilient frameworks, high-throughput cloud backends, and rigorous testing toolchains powering our mobile deployments.',
    ar: 'أطر عمل برمجية رائدة، وبنية تحتية سحابية مرنة، وأدوات اختبار متقدمة تدعم وتضمن استقرار تطبيقاتنا.',
  },
  techStackPods: [
    {
      title: { en: 'Mobile Frameworks', ar: 'أطر عمل وتطوير الهواتف' },
      badge: { en: 'Client Layer', ar: 'طبقة العميل' },
      description: {
        en: 'Cross-platform and native runtimes optimized for maximum rendering performance and low memory footprint.',
        ar: 'أطر عمل متقدمة توفر أعلى كفاءة في العرض واستهلاكاً منخفضاً للذاكرة والطاقة.',
      },
      technologies: [
        { name: 'Flutter', category: 'Cross-Platform', badge: 'High-Perf' },
        { name: 'React Native', category: 'Cross-Platform', badge: 'Ecosystem' },
        { name: 'Swift (iOS)', category: 'Native Apple', badge: 'Native' },
        { name: 'Kotlin (Android)', category: 'Native Android', badge: 'Native' },
      ],
    },
    {
      title: { en: 'Backend & Cloud APIs', ar: 'البنية السحابية والأنظمة الخلفية' },
      badge: { en: 'Cloud Services', ar: 'الخدمات السحابية' },
      description: {
        en: 'Event-driven serverless architectures and microservices delivering sub-100ms API response rates.',
        ar: 'بنى تحتية مدفوعة بالأحداث وخدمات مصغرة تضمن استجابة للواجهات البرمجية في أقل من 100 ملي ثانية.',
      },
      technologies: [
        { name: 'Node.js / NestJS', category: 'Microservices', badge: 'Runtime' },
        { name: 'Python / FastAPI', category: 'AI & Data Services', badge: 'Fast' },
        { name: 'AWS & Google Cloud', category: 'Cloud Infrastructure', badge: 'Cloud' },
        { name: 'GraphQL & WebSockets', category: 'Real-Time Sync', badge: 'API' },
      ],
    },
    {
      title: { en: 'Databases & In-Memory Caching', ar: 'قواعد البيانات والتخزين المؤقت' },
      badge: { en: 'Data Layer', ar: 'طبقة البيانات' },
      description: {
        en: 'ACID-compliant relational engines paired with distributed caching and offline local data storage.',
        ar: 'قواعد بيانات علائقية متوافقة مع متطلبات ACID، معززة بطبقات تخزين مؤقت ومزامنة محلية.',
      },
      technologies: [
        { name: 'PostgreSQL', category: 'Relational DB', badge: 'Core' },
        { name: 'Redis', category: 'In-Memory Cache', badge: 'Ultra-Fast' },
        { name: 'MongoDB', category: 'Document Store', badge: 'Scale' },
        { name: 'SQLite / Room', category: 'Offline-First Local DB', badge: 'Mobile' },
      ],
    },
    {
      title: { en: 'Testing, DevOps & CI/CD', ar: 'الاختبارات، الأمان والنشر المستمر' },
      badge: { en: 'Quality & Ops', ar: 'الجودة والعمليات' },
      description: {
        en: 'Fully automated continuous integration and delivery pipelines pushing verified builds to store beta tracks.',
        ar: 'خطوط تكامل ونشر مستمرة مؤتمتة بالكامل ترسل الإصدارات المفحوصة لمسارات الاختبار في المتاجر.',
      },
      technologies: [
        { name: 'Fastlane', category: 'Deployment Automation', badge: 'DevOps' },
        { name: 'Appium & Jest', category: 'Automated Testing', badge: 'QA' },
        { name: 'Figma & Tokens', category: 'Design Systems', badge: 'UI/UX' },
        { name: 'GitHub Actions', category: 'CI/CD Pipelines', badge: 'Automation' },
      ],
    },
  ],

  clientStories: getApplicationManagementFeaturedClientStories(),

  delivery: {
    title: {
      en: 'The Persici Mobile Delivery Architecture',
      ar: 'معمارية بيرسيكي لتنفيذ وتسليم التطبيقات',
    },
    subtitle: {
      en: 'A battle-tested 4-phase agile engineering engine that cuts time-to-market without compromising code quality, security, or stability.',
      ar: 'محرك هندسي متكامل ومجرب من 4 مراحل يقلص الوقت اللازم للوصول إلى السوق دون أي مساومة على جودة الكود أو الأمان.',
    },
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=85',
    pillars: [
      {
        title: {
          en: 'Blueprint & Systems Architecture',
          ar: 'المخطط الهندسي والمعمارية البرمجية',
        },
        description: {
          en: 'Collaborative UX discovery, database normalization, API contract schemas, and tech stack selection tailored to your volume goals.',
          ar: 'جلسات استكشاف مكثفة لتجربة المستخدم، وتحديد مخططات قواعد البيانات والواجهات البرمجية، واختيار الأنسب لتحقيق أهدافك.',
        },
      },
      {
        title: {
          en: 'Sprint Development & Automated CI/CD',
          ar: 'تطوير رشيق مع خطوط نشر مؤتمتة',
        },
        description: {
          en: 'Bi-weekly sprint releases with continuous unit tests, code review gates, and instant TestFlight & Play Console beta builds for stakeholder review.',
          ar: 'إطلاقات دورية كل أسبوعين مع اختبارات برمجية مستمرة ومراجعات كود دقيقة، وتوفير نسخ تجريبية على TestFlight و Play Console.',
        },
      },
      {
        title: {
          en: 'Store Certification & Hypercare Launch',
          ar: 'اعتماد المتاجر والإطلاق فائق العناية',
        },
        description: {
          en: 'Apple and Google compliance certification, real-time crash analytics telemetry, and 30-day dedicated war-room monitoring post-launch.',
          ar: 'إنهاء اعتمادات المتاجر الرسمية، وربط أنظمة التتبع الفوري للأعطال، مع غرفة عمليات ومراقبة مخصصة لمدة 30 يوماً بعد الإطلاق.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'cross-platform-vs-native',
      slug: 'cross-platform-vs-native-2026',
      title: {
        en: 'Cross-Platform vs. Native in 2026: The Strategic Enterprise Decision Matrix',
        ar: 'التطبيقات الهجينة مقابل الأصلية: مصفوفة القرار الاستراتيجي للمؤسسات',
      },
      category: {
        en: 'Engineering Strategy',
        ar: 'استراتيجية الهندسة البرمجية',
      },
      date: 'Aug 2026',
      href: '/insights/cross-platform-vs-native-2026',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'offline-first-mobile',
      slug: 'offline-first-mobile-architectures',
      title: {
        en: 'Offline-First Architectures: Ensuring Zero Data Loss in Unstable Connectivity',
        ar: 'معماريات التشغيل دون اتصال: ضمان عدم فقدان أي بيانات في البيئات ضعيفة الشبكة',
      },
      category: {
        en: 'Mobile Architecture',
        ar: 'معمارية تطبيقات الهواتف',
      },
      date: 'Jul 2026',
      href: '/insights/offline-first-mobile-architectures',
      image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'scaling-push-notifications',
      slug: 'scaling-push-notifications',
      title: {
        en: 'Scaling to 1 Million Push Notifications per Second Without Battery Drain',
        ar: 'إرسال مليون إشعار فوري في الثانية دون استنزاف بطارية أجهزة المستخدمين',
      },
      category: {
        en: 'Cloud & Telemetry',
        ar: 'السحابة والقياس عن بُعد',
      },
      date: 'Jun 2026',
      href: '/insights/scaling-push-notifications',
      image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici delivered an application that didn\'t just meet our technical requirements — it fundamentally transformed our unit economics. Order completion speeds soared, user complaints dropped to near zero, and the platform has effortlessly supported 10x traffic spikes during peak campaigns.',
      ar: 'قدّم لنا فريق بيرسيكي تطبيقاً لم يقتصر على تلبية المتطلبات التقنية فحسب، بل أحدث نقلة جوهرية في مؤشرات أعمالنا. ارتفعت سرعة إتمام الطلبات، وتلاشت شكاوى المستخدمين تقريباً، وتجاوز التطبيق بنجاح مضاعفة حركة الزوار بعشرة أضعاف خلال فترات الذروة.',
    },
    author: 'Fahad Al-Mutairi',
    role: {
      en: 'Co-Founder & CEO, Hala Food',
      ar: 'المؤسس المشارك والرئيس التنفيذي، هلا فود',
    },
    badge: {
      en: 'Executive Endorsement',
      ar: 'شهادة العميل',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions',
    ar: 'الأسئلة الأكثر شيوعاً',
  },
  faqsSubtitle: {
    en: 'Everything you need to know about our application engineering process, timelines, and post-launch guarantees.',
    ar: 'كل ما تود معرفته عن مراحل تطوير التطبيقات، المدد الزمنية المتوقعة، وضمانات ما بعد الإطلاق.',
  },
  faqs: [
    {
      question: {
        en: 'Should we build a Native app (Swift/Kotlin) or a Cross-Platform app (Flutter/React Native)?',
        ar: 'هل نختار التطوير الأصلي (Swift/Kotlin) أم عبر المنصات (Flutter/React Native)؟',
      },
      answer: {
        en: 'The decision depends on your performance requirements, budget, and timeline. Cross-platform frameworks like Flutter allow you to ship iOS and Android apps simultaneously from a single codebase, reducing initial development costs by ~35%. However, if your application requires heavy hardware integration (AR, Bluetooth Low Energy, advanced background computing), pure Native remains the gold standard.',
        ar: 'يعتمد القرار على طبيعة متطلبات الأداء والميزانية والجدول الزمني. تتيح أطر العمل مثل Flutter إطلاق التطبيق لنظامي iOS و Android معاً من كود برمجي واحد مما يوفر حوالي 35% من التكاليف. أما إذا كان التطبيق يتطلب تواصلاً معقداً مع عتاد الجهاز أو تقنيات الواقع المعزز، فإن البرمجة الأصلية تظل الخيار الأمثل.',
      },
    },
    {
      question: {
        en: 'How long does it typically take to design, develop, and launch an enterprise mobile app?',
        ar: 'كم يستغرق تصميم وتطوير وإطلاق تطبيق هاتف مؤسسي في العادة؟',
      },
      answer: {
        en: 'A production-ready MVP typically takes 10 to 14 weeks from initial architecture blueprinting to App Store submission. Complex enterprise applications with legacy ERP integrations, custom payment gateways, and multi-tier user roles generally require 16 to 24 weeks, executed in bi-weekly iterative sprints.',
        ar: 'يستغرق إطلاق النسخة الأولية الفعالة (MVP) عادةً ما بين 10 إلى 14 أسبوعاً من مرحلة التخطيط وحتى الرفع إلى المتاجر. أما التطبيقات المؤسسية الكبرى التي تتطلب تكاملاً مع أنظمة ERP وبوابات دفع متعددة، فتتراوح مدتها بين 16 إلى 24 أسبوعاً مقسمة على فترات عمل رشيقة كل أسبوعين.',
      },
    },
    {
      question: {
        en: 'How does Persici handle App Store and Google Play Store review rejections?',
        ar: 'كيف يتعامل فريق بيرسيكي مع متطلبات ومراجعات متاجر آبل وجوجل؟',
      },
      answer: {
        en: 'We adhere strictly to Apple\'s App Store Review Guidelines and Google Play Policy from day one of architecture. We handle the entire submission, metadata optimization, privacy declaration manifests, and reviewer test accounts. In the rare event of a reviewer query, our team addresses and resolves it within 24 to 48 hours.',
        ar: 'نلتزم التزاماً دقيقاً بإرشادات متاجر Apple وGoogle منذ اليوم الأول في التخطيط. نحن نتولى بالكامل عملية الرفع، وإعداد البيانات الوصفية، وإقرارات الخصوصية. وفي حال وجود أي استفسار من فاحصي المتاجر، يتولى فريقنا حله خلال 24 إلى 48 ساعة كحد أقصى.',
      },
    },
    {
      question: {
        en: 'Do you build the backend APIs, or can you integrate with our existing infrastructure?',
        ar: 'هل تقومون ببناء الأنظمة الخلفية أم يمكنكم التكامل مع أنظمتنا القائمة؟',
      },
      answer: {
        en: 'We do both. We can engineer scalable, greenfield microservices and GraphQL/REST backends on AWS or Google Cloud. Alternatively, we regularly integrate with enterprise legacy systems (SAP, Oracle, Microsoft Dynamics, custom SQL databases) via secure API middleware and reverse proxies.',
        ar: 'نحن نقوم بالأمرين معاً. يمكننا بناء بنية تحتية سحابية جديدة كلياً عبر AWS أو Google Cloud، كما نمتلك خبرة واسعة في الربط والتكامل مع الأنظمة المؤسسية القائمة (مثل SAP وOracle وMicrosoft Dynamics) عبر بوابات برمجية وسيطة فائقة الأمان.',
      },
    },
    {
      question: {
        en: 'What level of post-launch maintenance and SLA monitoring do you provide?',
        ar: 'ما هو مستوى الدعم الفني واتفاقية الصيانة (SLA) بعد الإطلاق؟',
      },
      answer: {
        en: 'Every deployment includes a 30-day dedicated hypercare warranty. Following launch, we offer ongoing SLA maintenance packages covering OS version compatibility updates (e.g. new iOS/Android releases), 24/7 crash telemetry, security patches, performance tuning, and continuous feature sprints.',
        ar: 'تتضمن جميع مشاريعنا فترة رعاية فائقة وضمان تشغيلي لمدة 30 يوماً بعد الإطلاق. بعدها نوفر باقات دعم مستمرة تضمن توافق التطبيق مع التحديثات السنوية لنظامي iOS و Android، والمراقبة اللحظية للأعطال، والتحديثات الأمنية الدورية، وتطوير الميزات الجديدة.',
      },
    },
    {
      question: {
        en: 'How do you protect sensitive user data and ensure local regulatory compliance?',
        ar: 'كيف تضمنون حماية بيانات المستخدمين والامتثال للأنظمة المحلية واللوائح التنظيمية؟',
      },
      answer: {
        en: 'We implement end-to-end TLS 1.3 encryption in transit, AES-256 encryption at rest, secure keychain storage, and strict biometric authentication. For clients in the GCC, we ensure compliance with Saudi PDPL, UAE Data Protection laws, and regional residency mandates.',
        ar: 'نطبق تشفيراً متكاملاً عبر بروتوكول TLS 1.3 أثناء النقل وتشفير AES-256 للبيانات المخزنة، مع استخدام المفاتيح الآمنة وسلاسل المفاتيح المشفرة والمصادقة البيومترية. كما نضمن الامتثال الكامل لنظام حماية البيانات الشخصية السعودي (PDPL) وقوانين حماية البيانات في دول الخليج.',
      },
    },
  ],
};
