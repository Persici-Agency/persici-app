import type {
  SolutionDiagramType,
  FeaturedClientStoryItem,
  SolutionBenefitItem,
  SolutionExecutionPillar,
  SolutionFaqItem,
} from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { getCustomerEngagementFeaturedClientStories } from '@shared/data';

export interface CustomerEngagementOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface CustomerEngagementVerticalItem {
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

export interface CustomerEngagementData {
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
  offerings: CustomerEngagementOfferingItem[];
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
  verticals: CustomerEngagementVerticalItem[];
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

export const customerEngagementData: CustomerEngagementData = {
  hero: {
    tag: {
      en: 'Solutions & Retention Architecture',
      ar: 'الحلول وهندسة ولاء العملاء',
    },
    secondaryTag: {
      en: 'Customer Engagement',
      ar: 'إشراك العملاء والتفاعل',
    },
    title: {
      en: 'Customer Engagement That Turns Everyday Interactions Into Compounding Loyalty',
      ar: 'هندسة تفاعل العملاء لتحويل كل تواصل إلى ولاء مستدام ونمو مضاعف',
    },
    subtitle: {
      en: 'From insights to impact: Transform first-party data and generative intelligence into human-centric customer journeys. We unite loyalty systems, real-time personalization, and durable MarTech stacks to cultivate authentic emotional bonds and elevate customer lifetime value (LTV).',
      ar: 'من الرؤى والبيانات إلى الأثر الملموس: نحول بيانات الطرف الأول والذكاء الاصطناعي التوليدي إلى رحلات عملاء تركز على الإنسان. ندمج منظومات الولاء، والتخصيص اللحظي، وأحدث أدوات التسويق التقني لبناء علاقات عميقة ومضاعفة القيمة الدائمة للعملاء.',
    },
    ctaText: {
      en: 'Schedule Retention Strategy Audit',
      ar: 'احجز تدقيق استراتيجية ولاء العملاء',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=85',
    highlights: [
      {
        en: 'AI-Powered Personalization & Dynamic Content at Scale',
        ar: 'تخصيص مدعوم بالذكاء الاصطناعي ومحتوى ديناميكي متكيف',
      },
      {
        en: 'Cookieless First-Party Identity Resolution & Vaults',
        ar: 'حوكمة وتوحيد هويات الطرف الأول لمستقبل بلا كوكيز',
      },
      {
        en: 'Omnichannel Journey Orchestration across Web, App & Store',
        ar: 'تنسيق متزامن لرحلة العميل عبر المتجر والتطبيق والفروع',
      },
      {
        en: 'Modernized MarTech Stacks (Braze, Klaviyo & CDP Integration)',
        ar: 'تحديث وتكامل منصات التقنية التسويقية وأحدث أدوات الـ CDP',
      },
    ],
  },

  offeringsTitle: {
    en: 'Core Customer Engagement Capabilities & Disciplines',
    ar: 'القدرات والحلول المتخصصة في تفاعل وولاء العملاء',
  },
  offeringsSubtitle: {
    en: 'An integrated end-to-end framework combining behavioural insights, dynamic real-time personalization, durable first-party data, and cross-channel lifecycle orchestration.',
    ar: 'منهجية شاملة ومتكاملة تجمع بين تحليل سلوك العملاء، والتخصيص اللحظي التكيفي، وبيانات الطرف الأول المستدامة، وأتمتة مسارات دورة حياة العميل عبر جميع القنوات.',
  },
  offerings: [
    {
      slug: 'enterprise-customer-loyalty',
      tag: {
        en: 'Loyalty & Retention',
        ar: 'الولاء والاحتفاظ',
      },
      title: {
        en: 'Enterprise Customer Loyalty Ecosystems',
        ar: 'منظومات ولاء ومكافآت العملاء المؤسسية',
      },
      description: {
        en: 'Redefining retention by fusing behavioural telemetry, tier mechanics, and emotional rewards to turn traditional point systems into engaging loyalty flywheels.',
        ar: 'إعادة ابتكار استراتيجيات الاحتفاظ بدمج بيانات السلوك الفعلي وآليات ترقية المستويات والمكافآت المعنوية لتحويل برامج النقاط التقليدية إلى محركات ولاء حقيقية.',
      },
      icon: '/icons/solutions/ce-customer-loyalty.svg',
      diagramType: 'ce-loyalty-tier-prism',
      highlights: {
        en: [
          'Tier Progression & Gamified Milestone Mechanics',
          'VIP Emotional Rewards & Experiential Capital',
          'Omnichannel Point Accrual & Real-Time Redemption',
          'Automated Inactivity Rescuing & Churn Prevention',
        ],
        ar: [
          'مستويات ولاء متقدمة وآليات تفاعلية قائمة على الإنجاز',
          'مكافآت وتجارب استثنائية حصرية تعزز الارتباط الوجداني',
          'جمع واستبدال فوري للنقاط عبر الموقع والتطبيق والفروع',
          'مسارات آلية لإعادة تنشيط الحسابات الخاملة والحد من التسرب',
        ],
      },
    },
    {
      slug: 'hyper-personalization-engines',
      tag: {
        en: 'Real-Time Relevance',
        ar: 'التخصيص الفائق',
      },
      title: {
        en: 'Hyper-Personalization & Dynamic Content Engines',
        ar: 'محركات التخصيص الفائق والمحتوى التفاعلي اللحظي',
      },
      description: {
        en: 'Anticipating customer intent and dynamically streaming personalized product recommendations, editorial layouts, and micro-offers across every session.',
        ar: 'استشراف نية وسياق العميل وتقديم ترشيحات منتجات فائقة الدقة، وتخطيطات مخصصة وعروض استثنائية متزامنة لحظياً عبر كل جلسة استخدام.',
      },
      icon: '/icons/solutions/ce-hyper-personalization.svg',
      diagramType: 'ce-personalization-nexus',
      highlights: {
        en: [
          'Affinity Vector Modeling & Algorithmic Discovery',
          'Sub-Second Real-Time UI/UX Content Composition',
          'Dynamic Pricing, Bundle & Cross-Sell Micro-Engagements',
          'Continuous Multivariate Personalization Testing',
        ],
        ar: [
          'نمذجة متجهات الاهتمام واكتشاف المنتجات بالذكاء الاصطناعي',
          'توليد محتوى الواجهة والتجربة في أجزاء من الثانية',
          'تخصيص ديناميكي للباقات والخصومات والعروض التكميلية',
          'اختبارات متعددة المتغيرات لقياس الأثر على متوسط قيمة الطلب',
        ],
      },
    },
    {
      slug: 'martech-ecosystem-modernization',
      tag: {
        en: 'MarTech Architecture',
        ar: 'معمارية التقنيات التسويقية',
      },
      title: {
        en: 'MarTech Architecture & Real-Time CDP Integration',
        ar: 'معمارية التقنيات التسويقية وربط منصات الـ CDP',
      },
      description: {
        en: 'Unifying siloed customer data pipelines, centralizing CDPs (Segment, mParticle), and driving automated event triggers with sub-second event latency.',
        ar: 'توحيد تدفقات بيانات العملاء المجزأة، وربط منصات بيانات العملاء المتقدمة، وإطلاق الرسائل المؤتمتة بناءً على أحداث فورية دون أي تأخير.',
      },
      icon: '/icons/solutions/ce-martech-transformation.svg',
      diagramType: 'ce-martech-stack-router',
      highlights: {
        en: [
          'Enterprise CDP Integration (Segment, Tealium, mParticle)',
          'Sub-Second Event Streaming & Webhook Pipelines',
          'Braze & Klaviyo Canvas Lifecycle Automation',
          'Data Clean Room Setup & Enterprise Reverse-ETL',
        ],
        ar: [
          'تكامل واجهات منصات الـ CDP الكبرى وحوكمة البيانات',
          'معالجة وتمرير بيانات الأحداث في الوقت الفعلي عبر الويب هوك',
          'هندسة مسارات الحملات المؤتمتة في Braze وKlaviyo',
          'غرف البيانات النظيفة وتقنيات الـ Reverse-ETL المؤسسية',
        ],
      },
    },
    {
      slug: 'durable-first-party-data',
      tag: {
        en: 'Cookieless Future',
        ar: 'بيانات الطرف الأول',
      },
      title: {
        en: 'Durable First-Party Data & Identity Governance',
        ar: 'إدارة وحوكمة بيانات الطرف الأول المستدامة',
      },
      description: {
        en: 'Safeguarding customer acquisition and retention against third-party cookie deprecation through consensual identity graphs and enterprise clean rooms.',
        ar: 'تحصين أعمالك ضد اندثار ملفات تعريف الارتباط الخارجية عبر بناء مخططات هوية سيادية وقنوات جمع بيانات أولية قائمة على الشفافية والموافقة.',
      },
      icon: '/icons/solutions/ce-durable-first-party.svg',
      diagramType: 'ce-durable-identity-vault',
      highlights: {
        en: [
          'Universal Deterministic & Probabilistic ID Resolution',
          'Zero-Party Preference Centers & Progressive Profiling',
          'Server-Side Event Tracking (Meta CAPI, Google GTM Server)',
          'Global Privacy Compliance (GDPR, CCPA & Saudi PDPL)',
        ],
        ar: [
          'توحيد هويات العملاء القطعية والاحتمالية عبر الأجهزة',
          'مراكز تفضيلات العملاء واستخلاص البيانات التفاعلية الطوعية',
          'تتبع الأحداث من جانب الخادم (Server-Side Tracking)',
          'الامتثال الكامل للأنظمة العالمية ونظام حماية البيانات السعودي (PDPL)',
        ],
      },
    },
    {
      slug: 'omnichannel-journey-orchestration',
      tag: {
        en: 'Connected Touchpoints',
        ar: 'تنسيق الرحلة الموحدة',
      },
      title: {
        en: 'Omnichannel Lifecycle Journey Orchestration',
        ar: 'تنسيق مسار دورة حياة العميل عبر كافة القنوات',
      },
      description: {
        en: 'Synchronizing cross-channel interactions across mobile push, email, SMS, messaging apps, and in-store clienteling into cohesive sequential narratives.',
        ar: 'مزامنة رسائل وتفاعلات القنوات المتعددة (إشعارات الهاتف، البريد، الرسائل النصية، وواتساب ونقاط البيع) في سياق سردي متماسك.',
      },
      icon: '/icons/solutions/ce-omnichannel-orchestration.svg',
      diagramType: 'ce-omnichannel-orbit-matrix',
      highlights: {
        en: [
          'Coordinated Multi-Step Push, SMS & WhatsApp Journeys',
          'In-Store Staff Clienteling & Digital Profile Lookup',
          'Unified Interaction Frequency Capping & Fatigue Defense',
          'Real-Time Channel Preference AI Routing',
        ],
        ar: [
          'حملات متتابعة وذكية عبر الإشعارات والرسائل النصية وتطبيق واتساب',
          'تطبيق خدمة العملاء في المتاجر وعرض الملف الموحد للبائعين',
          'ضبط سقف وتيرة الإرسال لحماية العملاء من الإرهاق الإعلاني',
          'توجيه الرسائل تلقائياً للقناة المفضلة لكل عميل بالذكاء الاصطناعي',
        ],
      },
    },
    {
      slug: 'predictive-churn-ltv-optimization',
      tag: {
        en: 'Predictive Intelligence',
        ar: 'الذكاء التنبؤي للقيمة',
      },
      title: {
        en: 'Predictive Churn Defense & LTV Optimization',
        ar: 'الحد الاستباقي من فقدان العملاء ومضاعفة القيمة الدائمة',
      },
      description: {
        en: 'Machine learning models calculating real-time churn probability and lifetime value trajectories, triggering high-impact proactive retention campaigns.',
        ar: 'نماذج تعلم آلي تحسب احتمالية مغادرة العميل بدقة وتتنبأ بالقيمة الدائمة، مما يطلق تلقائياً إجراءات استباقية تحافظ على ولاء العميل قبل فوات الأوان.',
      },
      icon: '/icons/solutions/ce-predictive-ltv.svg',
      diagramType: 'ce-predictive-ltv-engine',
      highlights: {
        en: [
          'Continuous Churn Risk Scoring & Early Warning Radar',
          'Propensity-to-Buy AI Modeling & Next-Best-Action Engine',
          'LTV Decile Cohort Segmentation & Resource Allocation',
          'Win-Back Incentivization with Unit Economic Guardrails',
        ],
        ar: [
          'تسجيل مستمر لمخاطر الانسحاب ورادار إنذار مبكر للعملاء المعرضين للفقد',
          'نماذج توقع نية الشراء واقتراح الخطوة المثلى التالية (Next-Best-Action)',
          'تصنيف العملاء إلى شرائح عشرية حسب القيمة الدائمة لتركيز الجهود',
          'عروض استعادة ولاء مجدية اقتصادياً تحافظ على هوامش الأرباح',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Why Modern Customer Engagement Dictates Enterprise Valuation',
      ar: 'لماذا يُعد التفاعل الاستباقي للعملاء الركيزة الأساسية للنمو المؤسسي',
    },
    text: {
      en: 'In a cookieless, hyper-competitive digital landscape, acquiring a new customer costs up to 7x more than retaining an existing one. Generic blasts and disconnected touchpoints erode brand trust and trigger immediate unsubscribes. Persici transforms customer engagement into an authentic, data-driven conversation—delivering relevant value at the exact micro-moment of customer intent.',
      ar: 'في سوق رقمي سريع التغير وبلا ملفات تعريف ارتباط خارجية، تبلغ تكلفة اكتساب عميل جديد 7 أضعاف تكلفة الحفاظ على عميل حالي. الرسائل العامة والتفاعلات المجزأة تقوض ثقة المستهلك وتؤدي إلى فقدان فوري للعملاء. تحول بيرسيكي تفاعل العملاء إلى حوار استراتيجي مدعوم بالبيانات، يمنح العميل القيمة التي ينتظرها في اللحظة المناسبة بالضبط.',
    },
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    metric1Val: '+340%',
    metric1Label: {
      en: 'Repeat Purchase Frequency Lift',
      ar: 'مضاعفة وتيرة تكرار عمليات الشراء',
    },
    metric2Val: '68%',
    metric2Label: {
      en: 'Lower Churn Rate Across First 90 Days',
      ar: 'انخفاض معدل فقدان العملاء خلال أول 90 يوماً',
    },
  },

  benefitsStrip: {
    title: {
      en: 'The Persici Customer Engagement Advantage',
      ar: 'المزايا الاستراتيجية لهندسة تفاعل العملاء مع بيرسيكي',
    },
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=85',
    benefits: [
      {
        title: {
          en: 'Unified 360° Identity',
          ar: 'هوية موحدة ومكتملة 360 درجة',
        },
        description: {
          en: 'Single source of truth reconciling anonymous website visitors, app accounts, loyalty members, and offline POS shoppers into unified profiles.',
          ar: 'مصدر موحد وموثوق يدمج زوار الموقع، وحسابات التطبيق، وأعضاء برنامج الولاء، ومشتري الفروع في ملف عميل موحد فائق الدقة.',
        },
        accentColor: '#D83427',
      },
      {
        title: {
          en: 'Contextual Empathy at Scale',
          ar: 'تفاعل سياقي ذكي وفوري',
        },
        description: {
          en: 'Sub-second real-time event triggers deliver meaningful, personalized recommendations at the precise psychological peak of user intent.',
          ar: 'إطلاق فوري للتوصيات والعروض في أجزاء من الثانية عند لحظة الحماس والنية الشرائية لتعزيز الرضا وتسهيل اتخاذ القرار.',
        },
        accentColor: '#EF8C7D',
      },
      {
        title: {
          en: 'Resilient Unit Economics',
          ar: 'جدوى اقتصادية وهوامش أرباح قوية',
        },
        description: {
          en: 'Dramatically reduce blended customer acquisition costs (CAC) while compounding customer lifetime value through recurring retention loops.',
          ar: 'خفض تكلفة الاستحواذ الإجمالية للعميل بشكل ملموس عبر مضاعفة القيمة الدائمة ومسارات إعادة الشراء الدورية التلقائية.',
        },
        accentColor: '#121212',
      },
      {
        title: {
          en: 'Cookieless Sovereignty',
          ar: 'سيادة بيانات الطرف الأول',
        },
        description: {
          en: 'Future-proof customer relationships with privacy-compliant first-party data assets that safeguard marketing reach against browser lockouts.',
          ar: 'بناء أصول بيانات خاصة ومستدامة متوافقة مع أحدث معايير الخصوصية العالمية، تضمن استمرار الوصول للعملاء دون الاعتماد على الكوكيز.',
        },
        accentColor: '#D83427',
      },
    ],
  },

  verticalsTitle: {
    en: 'Domain Architectures Across Vertical Markets',
    ar: 'معماريات تفاعل العملاء عبر القطاعات الاقتصادية الكبرى',
  },
  verticalsSubtitle: {
    en: 'Engineered for industry-specific retention challenges, compliance mandates, and high-frequency engagement paradigms.',
    ar: 'حلول مخصصة تراعي التحديات الخاصة بكل قطاع، والضوابط التنظيمية ومعدلات التفاعل المتكررة لضمان أقصى عائد على الاستثمار.',
  },
  verticals: [
    {
      id: 'luxury-omnichannel-retail',
      number: '01',
      title: {
        en: 'Luxury & High-Growth Retail',
        ar: 'قطاع التجزئة والعلامات الفاخرة',
      },
      description: {
        en: 'Bespoke clienteling tools, private VIP tiered rewards, and omnichannel basket synchronization bridging flagship boutiques with direct-to-consumer digital flagships.',
        ar: 'تطبيقات رقمية متطورة لفرق المبيعات في البوتيكات الفاخرة، ومستويات ولاء حصرية، ومزامنة فورية للمشتريات بين الفروع والمتاجر الرقمية.',
      },
      tag: {
        en: 'Retail & Fashion',
        ar: 'التجزئة والأزياء',
      },
      capabilities: {
        en: [
          'In-store mobile clienteling & past purchase lookup',
          'Private tier allocation & experiential reward invites',
          'Omnichannel cart synchronization & click-and-collect push',
        ],
        ar: [
          'ملف العميل الموحد للبائعين داخل المتجر وعرض المشتريات السابقة',
          'برامج ولاء حصرية لكبار الشخصيات ودعوات لفعاليات خاصة',
          'مزامنة سلة التسوق بين الموقع والفروع والاستلام من المتجر',
        ],
      },
    },
    {
      id: 'financial-services-banking',
      number: '02',
      title: {
        en: 'Financial Services & Neo-Banking',
        ar: 'الخدمات المالية والبنوك الرقمية',
      },
      description: {
        en: 'Contextual transaction milestones, gamified financial wellness rewards, and regulatory-compliant engagement journeys that boost debit card and wealth product adoption.',
        ar: 'إشعارات لحظية ذكية عند كل معاملة، ومكافآت توعوية للادخار والاستثمار، ومسارات تفاعلية متوافقة مع لوائح البنوك المركزية ترفع استخدام البطاقات.',
      },
      tag: {
        en: 'FinTech & Banking',
        ar: 'التقنية المالية والمصارف',
      },
      capabilities: {
        en: [
          'Real-time spending categorisation & micro-savings triggers',
          'Financial wellness gamification & tier status badges',
          'Encrypted transactional event routing & PDPL compliance',
        ],
        ar: [
          'تصنيف فوري للمصروفات مع تحفيز تلقائي للادخار الذكي',
          'آليات مكافآت تفاعلية لتحقيق الأهداف المالية والحصول على أوسمة',
          'توجيه مشفر وآمن للأحداث البنكية متوافق مع لوائح الخصوصية',
        ],
      },
    },
    {
      id: 'digital-health-wellness',
      number: '03',
      title: {
        en: 'Digital Health & Telemedicine',
        ar: 'الرعاية الصحية الرقمية والعافية',
      },
      description: {
        en: 'Empathetic post-consultation care protocols, automated prescription refill cadences, and personalized health milestone journeys built with rigorous HIPAA and clinical confidentiality.',
        ar: 'بروتوكولات رعاية ومتابعة بعد الاستشارات الطبية، وتذكيرات آلية بتجديد الأدوية، ومسارات صحية مخصصة مبنية بأعلى درجات السرية والامتثال الطبي.',
      },
      tag: {
        en: 'Healthcare & Wellness',
        ar: 'الصحة والعافية',
      },
      capabilities: {
        en: [
          'Automated medication & treatment refill sequences',
          'Post-consultation symptom logging & wellness check-ins',
          'Clinical privacy compliance & consensual preference controls',
        ],
        ar: [
          'تذكيرات ذكية مجدولة لإعادة صرف الأدوية وجلسات المتابعة',
          'تسجيل الأعراض واستبيانات الرضا بعد زيارة الطبيب',
          'أعلى معايير الأمان والسرية للبيانات الصحية والطبية',
        ],
      },
    },
    {
      id: 'media-entertainment-streaming',
      number: '04',
      title: {
        en: 'Media, Entertainment & Streaming',
        ar: 'الإعلام والترفيه ومنصات البث',
      },
      description: {
        en: 'Watchlist-driven push alerts, algorithmic binge-recommendations, and proactive re-engagement journeys keeping subscribers actively engaged before billing cycles renew.',
        ar: 'تنبيهات لحظية بالأعمال المفضلة الجديدة، وترشيحات ذكية تزيد من ساعات المشاهدة، وحملات استباقية تحافظ على المشتركين قبل مواعيد تجديد الاشتراكات.',
      },
      tag: {
        en: 'Media & Streaming',
        ar: 'الإعلام والمحتوى',
      },
      capabilities: {
        en: [
          'Watch-history-based episodic push triggers',
          'Subscription billing renewal reminders with value summaries',
          'Exclusive premiere community access & fan milestone perks',
        ],
        ar: [
          'إشعارات مخصصة بحسب سجل المشاهدة ومواعيد الحلقات الجديدة',
          'ملخصات شهرية للقيمة والمزايا المستفادة قبل تجديد الاشتراك',
          'وصول حصري للعروض الأولى ومزايا خاصة للمشتركين الدائمين',
        ],
      },
    },
    {
      id: 'aviation-travel-hospitality',
      number: '05',
      title: {
        en: 'Aviation, Travel & Hospitality',
        ar: 'الطيران والسياحة والضيافة',
      },
      description: {
        en: 'Dynamic flight gate alerts, pre-arrival room preference forms, and tier-accelerated mileage earning cycles that build lifelong loyalty for global travelers.',
        ar: 'تحديثات مباشرة ومخصصة لرحلات الطيران، واستبيانات ما قبل الوصول لتفضيلات الغرف، وبرامج أميال ونقاط سريعة تضمن استمرارية السفر والإقامة.',
      },
      tag: {
        en: 'Travel & Hospitality',
        ar: 'السياحة والفنادق',
      },
      capabilities: {
        en: [
          'Context-aware gate, luggage & mobile boarding pass updates',
          'Pre-check-in preference customization & upgrade micro-offers',
          'Tier milestone expiration alerts with instant redemption options',
        ],
        ar: [
          'إشعارات لحظية بتحديثات البوابات واستلام الأمتعة وبطاقات الصعود',
          'تخصيص تفضيلات الإقامة وعروض الترقية الفورية قبل الوصول',
          'تنبيهات بقرب انتهاء صلاحية النقاط مع خيارات استبدال مرنة',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'Integrated Customer Engagement Stack & Architecture',
    ar: 'المنظومة التقنية المتكاملة لإشراك وتفاعل العملاء',
  },
  techStackSubtitle: {
    en: 'An enterprise-grade ecosystem integrating leading customer data platforms, cross-channel journey orchestrators, and predictive personalization engines.',
    ar: 'معمارية مؤسسية تجمع بين أقوى منصات بيانات العملاء العالمية، ومحركات تنسيق الحملات المتعددة، وخوارزميات التخصيص التنبؤية.',
  },
  techStackPods: [
    {
      title: {
        en: 'Customer Data Platforms (CDPs)',
        ar: 'منصات بيانات العملاء (CDP)',
      },
      badge: {
        en: 'Unified Profiles',
        ar: 'الملف الموحد',
      },
      description: {
        en: 'Centralized streaming infrastructure capturing first-party behavioural events, resolving cross-device identities, and syncing actionable traits in real time.',
        ar: 'بنية تحتية مركزية تجمع أحداث وسلوكيات العملاء من كافة القنوات، وتوحد الهويات الرقمية، وتحدث الخصائص لحظياً لدعم اتخاذ القرار.',
      },
      technologies: [
        { name: 'Twilio Segment', category: 'Customer Data Platform', badge: 'Certified Partner' },
        { name: 'mParticle', category: 'Multi-Screen Event Streaming' },
        { name: 'Tealium AudienceStream', category: 'Enterprise Identity Hub' },
        { name: 'Simon Data', category: 'Composable CDP & Reverse-ETL' },
      ],
    },
    {
      title: {
        en: 'Lifecycle & Journey Orchestration',
        ar: 'أتمتة دورة حياة العميل والحملات',
      },
      badge: {
        en: 'Omnichannel Execution',
        ar: 'تنفيذ متعدد القنوات',
      },
      description: {
        en: 'Leading customer engagement platforms orchestrating responsive multi-step campaigns across push notifications, email, in-app messaging, and SMS.',
        ar: 'منصات رائدة لتنسيق وتنفيذ الحملات التفاعلية المتتابعة عبر إشعارات الهاتف والبريد والرسائل داخل التطبيق والرسائل النصية.',
      },
      technologies: [
        { name: 'Braze', category: 'Lifecycle Canvas & Real-Time Push', badge: 'Enterprise Leader' },
        { name: 'Klaviyo', category: 'Predictive DTC Email & SMS' },
        { name: 'Iterable', category: 'Cross-Channel Journey Builder' },
        { name: 'Salesforce Marketing Cloud', category: 'Enterprise Journey Builder' },
      ],
    },
    {
      title: {
        en: 'Predictive AI & Personalization',
        ar: 'الذكاء الاصطناعي والتخصيص اللحظي',
      },
      badge: {
        en: 'Adaptive Relevancy',
        ar: 'الملاءمة الفورية',
      },
      description: {
        en: 'Algorithmic recommendation engines and dynamic visual builders creating sub-second personalized storefront and app experiences for each customer.',
        ar: 'محركات ترشيح وتخصيص ديناميكية تقدم واجهات ومحتوى مخصصاً لكل مستخدم في جزء من الثانية بناءً على اهتماماته وسلوكه السابق.',
      },
      technologies: [
        { name: 'Dynamic Yield', category: 'Real-Time Omnichannel Personalization' },
        { name: 'Algolia Recommend', category: 'AI Search & Affinity Matching' },
        { name: 'AWS Personalize', category: 'Machine Learning Recommendation Engine' },
        { name: 'Insider', category: 'Predictive Experience Engine' },
      ],
    },
    {
      title: {
        en: 'Consent, Identity & Clean Rooms',
        ar: 'حوكمة الخصوصية وغرف البيانات النظيفة',
      },
      badge: {
        en: 'Privacy & Governance',
        ar: 'الأمان والامتثال',
      },
      description: {
        en: 'Zero-party consent frameworks, identity graphs, and data clean room infrastructure ensuring global privacy compliance (GDPR, PDPL) and secure partnerships.',
        ar: 'أنظمة إدارة موافقة وتفضيلات المستخدمين، ومخططات الهوية وحلول غرف البيانات النظيفة لضمان الامتثال التام لأنظمة الخصوصية وحماية البيانات.',
      },
      technologies: [
        { name: 'OneTrust', category: 'Consent & Preference Management' },
        { name: 'LiveRamp', category: 'Enterprise Identity Graph & Resolution' },
        { name: 'Amperity', category: 'Deterministic Identity Resolution' },
        { name: 'Snowflake Clean Rooms', category: 'Secure Cross-Partner Data Collaboration' },
      ],
    },
  ],

  clientStories: getCustomerEngagementFeaturedClientStories(),

  delivery: {
    title: {
      en: 'How We Deliver Customer Engagement Differently',
      ar: 'كيف نصنع الفارق في تنفيذ استراتيجيات تفاعل العملاء',
    },
    subtitle: {
      en: 'A high-velocity engagement methodology built around clean data pipelines, behavioural journey mapping, and continuous algorithmic optimization.',
      ar: 'منهجية عمل سريعة ودقيقة تبدأ بتدقيق وتطهير البيانات، ورسم مسارات السلوك، وإطلاق منصات الأتمتة والتحسين المستمر لمعدلات الاحتفاظ.',
    },
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    pillars: [
      {
        title: {
          en: 'First-Party Data Audit & Identity Graphing',
          ar: 'تدقيق بيانات الطرف الأول وتوحيد مخطط الهوية',
        },
        description: {
          en: 'We audit your existing tracking infrastructure, eliminate duplicate customer profiles, and establish an unbroken single customer view across web, app, and POS.',
          ar: 'ندقق البنية التحتية الحالية لجمع البيانات، ونلغي التكرارات في سجلات العملاء، ونبني ملف العميل الموحد الموثوق عبر كافة المنصات.',
        },
      },
      {
        title: {
          en: 'Lifecycle Journey & Tier Mechanics Blueprints',
          ar: 'هندسة مسارات دورة الحياة وآليات منظومة الولاء',
        },
        description: {
          en: 'We map out the decisive behavioral milestones from Day 0 onboarding to post-purchase advocacy, designing tier incentives that drive genuine emotional loyalty.',
          ar: 'نرسم بدقة المحطات السلوكية الحاسمة بدءاً من التسجيل وحتى مرحلة الولاء الدائم، مع تصميم حوافز ذكية تعزز الارتباط العاطفي بالعلامة.',
        },
      },
      {
        title: {
          en: 'CDP, Braze & Personalization Stack Integration',
          ar: 'ربط وتكامل منصات الـ CDP وBraze ومحركات التخصيص',
        },
        description: {
          en: 'Our engineering squads configure real-time event streaming pipelines, integrate modern engagement canvases (Braze/Klaviyo), and deploy custom dynamic modules.',
          ar: 'يقوم مهندسونا بتهيئة مسارات معالجة الأحداث اللحظية، وتكامل منصات التفاعل الرائدة، وتفعيل نماذج التخصيص التلقائي في الواجهات.',
        },
      },
      {
        title: {
          en: 'Continuous LTV Optimization & Churn Defense',
          ar: 'التحسين المستمر للقيمة الدائمة والحد من التسرب',
        },
        description: {
          en: 'We operate continuous multivariate messaging experiments, train churn mitigation algorithms, and scale VIP customer loops that compound lifetime value over time.',
          ar: 'ندير اختبارات تجريبية مستمرة لرسائل وتوقيت الحملات، وندرب خوارزميات التنبؤ بالتسرب، ونضاعف عوائد برامج كبار العملاء بشكل تصاعدي مستدام.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'first-party-identity-graph',
      slug: 'first-party-identity-graph',
      badge: {
        en: 'Durable Marketing',
        ar: 'التسويق المستدام',
      },
      title: {
        en: 'The Cookieless Reality: Building a Resilient First-Party Identity Graph',
        ar: 'واقع ما بعد الكوكيز: كيف تبني مؤسسات اليوم مخططات هوية سيادية مستدامة',
      },
      excerpt: {
        en: 'How forward-thinking enterprises are replacing third-party tracking cookies with consented, deterministic identity architectures that preserve marketing ROI.',
        ar: 'كيف تستبدل الشركات الرائدة ملفات تعريف الارتباط الخارجية بمعماريات هوية قطعية قائمة على الموافقة تحفظ كفاءة الإنفاق التسويقي.',
      },
      date: '2026-03-01',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      href: '/insights/first-party-identity-graph',
    },
    {
      id: 'personalization-without-creepiness',
      slug: 'personalization-without-creepiness',
      badge: {
        en: 'Customer Experience',
        ar: 'تجربة العميل',
      },
      title: {
        en: 'Contextual Relevance vs. Privacy: Engineering Loyalty Without Friction',
        ar: 'الملاءمة السياقية في مواجهة الخصوصية: هندسة الولاء دون إزعاج المستخدم',
      },
      excerpt: {
        en: 'The fine line between helpful empathy and invasive tracking: Frameworks for delivering real-time value at the exact moment of customer intent.',
        ar: 'الخط الرفيع بين التوصيات المفيدة والتتبع المزعج: أطر عمل لتقديم قيمة لحظية حقيقية تتناغم مع توقعات العميل وتحترم خصوصيته.',
      },
      date: '2026-02-18',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      href: '/insights/personalization-without-creepiness',
    },
    {
      id: 'modern-loyalty-flywheel',
      slug: 'modern-loyalty-flywheel',
      badge: {
        en: 'Retention Architecture',
        ar: 'هندسة الاحتفاظ',
      },
      title: {
        en: 'Beyond Transactional Points: The Modern Emotional Loyalty Flywheel',
        ar: 'ما بعد نقاط الشراء التقليدية: كيف تبني منظومة ولاء وجدانية تعزز النمو',
      },
      excerpt: {
        en: 'Why static discounts fail to build long-term retention, and how experiential VIP tiers and community perks unlock compounding lifetime value.',
        ar: 'لماذا تفشل برامج الخصومات التقليدية في الحفاظ على العملاء، وكيف تصنع التجارب الحصرية والمزايا الوجدانية قيمة دائمة مضاعفة.',
      },
      date: '2026-02-04',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      href: '/insights/modern-loyalty-flywheel',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici rebuilt our entire retention engine from the data layer up. Within 4 months of launching our unified loyalty architecture and real-time CDP orchestration, our 60-day repeat purchase rate leaped by 320% while our unsubscribes dropped to near zero. They are absolute masters of modern customer engagement.',
      ar: 'أعادت بيرسيكي بناء منظومة ولاء واحتفاظ العملاء بالكامل من طبقة البيانات وحتى التنفيذ. وخلال 4 أشهر فقط من إطلاق معمارية الولاء الموحدة وربط منصة الـ CDP، قفز معدل تكرار الشراء لدينا بنسبة 320% وانخفضت الإلغاءات إلى ما يقارب الصفر. إنهم رواد حقيقيون في هندسة تفاعل العملاء.',
    },
    author: 'Tariq Al-Mansoor',
    role: {
      en: 'Chief Customer Officer (CCO), Al-Farah Luxury Retail Group',
      ar: 'رئيس قطاع تجربة العملاء، مجموعة الفرح للتجزئة الفاخرة',
    },
    badge: {
      en: 'Verified Enterprise Engagement Transformation',
      ar: 'تحول مؤسسي معتمد في تفاعل وولاء العملاء',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions',
    ar: 'الأسئلة الشائعة حول تفاعل وولاء العملاء',
  },
  faqsSubtitle: {
    en: 'Clear answers on CDP implementation timelines, Braze & Klaviyo migrations, first-party data strategies, and privacy compliance.',
    ar: 'إجابات وافية ومباشرة حول الجداول الزمنية للربط، والانتقال إلى المنصات الحديثة، واستراتيجيات بيانات الطرف الأول والامتثال لأنظمة الخصوصية.',
  },
  faqs: [
    {
      question: {
        en: 'How long does an end-to-end Customer Engagement and CDP transformation typically take?',
        ar: 'ما هي المدة الزمنية المعتادة لتنفيذ مشروع متكامل لمنظومة تفاعل العملاء والـ CDP؟',
      },
      answer: {
        en: 'Our standard deployment spans 8 to 12 weeks divided into four distinct phases: Data hygiene and identity auditing (Weeks 1-3), Journey blueprinting and tier mechanics design (Weeks 4-6), Technical integration of the CDP and engagement platforms (Weeks 7-9), and Journey activation with automated experimentation (Weeks 10-12). Many high-priority automated journeys go live and generate revenue well before the final sprint.',
        ar: 'يستغرق التنفيذ المؤسسي القياسي عادة بين 8 إلى 12 أسبوعاً مقسمة على أربع مراحل: تدقيق وتطهير البيانات وتوحيد الهوية (الأسابيع 1-3)، رسم مسارات الرحلات وتصميم آليات الولاء (الأسابيع 4-6)، الربط البرمجي لمنصة الـ CDP وأدوات الحملات (الأسابيع 7-9)، وتفعيل المسارات المؤتمتة وبدء التجارب (الأسابيع 10-12). وتبدأ العديد من المسارات ذات الأولوية العالية بتحقيق عوائد ملموسة قبل انتهاء المشروع بالكامل.',
      },
    },
    {
      question: {
        en: 'Can you migrate us from legacy email service providers (ESPs) to Braze or Klaviyo without disrupting active operations?',
        ar: 'هل يمكنكم نقلنا من أدوات البريد التقليدية إلى Braze أو Klaviyo دون التأثير على سير العمل؟',
      },
      answer: {
        en: 'Yes. We follow a zero-downtime, parallel IP-warming migration framework. We synchronize legacy subscriber lists, clean unsubscribes, rebuild and optimize all core automated templates, and warm new dedicated sending IPs gradually over 3 to 4 weeks. Your business experiences zero communication drop-offs and sees immediate deliverability gains.',
        ar: 'نعم بكل تأكيد. نتبع منهجية انتقال متوازية تضمن استمرارية الأعمال دون أي انقطاع مع إحماء تدريجي لعنوان الـ IP (IP Warming). نقوم بتنقية القوائم، وإعادة بناء قوالب الرسائل المؤتمتة، والتسخين التدريجي لعناوين الإرسال الجديدة على مدار 3 إلى 4 أسابيع، مما يحافظ على استمرارية التواصل ويرفع معدلات وصول الرسائل إلى صندوق الوارد.',
      },
    },
    {
      question: {
        en: 'How do you prepare our customer engagement programs for a cookieless digital environment?',
        ar: 'كيف تجهزون برامج تفاعل العملاء لمواجهة بيئة رقمية بلا ملفات تعريف ارتباط (كوكيز)؟',
      },
      answer: {
        en: 'We establish an owned, first-party data architecture. This includes implementing server-side event gateways (Meta Conversions API, Google Tag Manager Server-Side), setting up interactive zero-party preference centers, and generating deterministic customer identifiers that bind web sessions, mobile app usage, and offline transactions without reliance on third-party tracking cookies.',
        ar: 'نبني معمارية بيانات طرف أول سيادية ومستدامة. ويشمل ذلك تفعيل بوابات تتبع الأحداث من جانب الخادم (مثل Meta CAPI وGTM Server-Side)، وتصميم مراكز تفضيلات تفاعلية طوعية، وإنشاء معرفات عملاء قطعية توحد زيارات الموقع واستخدام التطبيق وعمليات الشراء في الفروع دون أي اعتماد على كوكيز الطرف الثالث.',
      },
    },
    {
      question: {
        en: 'How do we measure the true incremental financial lift of our loyalty and engagement initiatives?',
        ar: 'كيف نقيس الزيادة المالية الإضافية الفعلية الناتجة عن مبادرات الولاء والتفاعل؟',
      },
      answer: {
        en: 'We implement rigorous holdout group testing across all automated campaigns and tier promotions. By comparing purchase frequency, average order value (AOV), and 90-day retention between customers receiving automated personalized journeys versus an unmessaged control group, we calculate exact incremental gross margin lift with mathematical certainty.',
        ar: 'نطبق منهجية المجموعات الضابطة (Holdout Groups) عبر كافة الحملات المؤتمتة وعروض الولاء. ومن خلال المقارنة الدقيقة لمعدلات تكرار الشراء، ومتوسط قيمة الطلب، ومعدل الاحتفاظ بين العملاء المستهدفين والمجموعة الضابطة، نحسب العائد الإضافي الصافي بدقة رياضية لا تقبل الشك.',
      },
    },
    {
      question: {
        en: 'Is our customer data handling compliant with regional privacy laws like Saudi PDPL and UAE data regulations?',
        ar: 'هل تتوافق معالجة بيانات العملاء مع نظام حماية البيانات الشخصية السعودي (PDPL) والأنظمة الخليجية؟',
      },
      answer: {
        en: 'Absolutely. All our MarTech and CDP architectural designs strictly adhere to Saudi PDPL, UAE Data Protection Laws, and GDPR. We implement granular user consent logging, localized data residency configurations, automated subject access/deletion workflows, and data minimization protocols across every integrated tool.',
        ar: 'نعم بكل تأكيد وبأعلى درجات الالتزام. تتوافق كافة معمارياتنا البرمجية مع نظام حماية البيانات الشخصية السعودي (PDPL) وقوانين حماية البيانات في الإمارات والـ GDPR. ونطبق آليات دقيقة لتسجيل موافقة المستخدمين، وضمان إقامة البيانات وتوطينها محلياً، ومسارات مؤتمتة لطلبات حذف وتعديل البيانات وحمايتها بأعلى معايير التشفير.',
      },
    },
    {
      question: {
        en: 'Will our internal marketing and CRM teams be trained to manage and evolve the new platform independently?',
        ar: 'هل ستقومون بتدريب وتأهيل فرقنا الداخلية لإدارة وتطوير المنظومة الجديدة بشكل مستقل؟',
      },
      answer: {
        en: 'Yes. Knowledge transfer is baked into our delivery process. We provide hands-on workshops, recorded operational documentation, segmentation playbooks, and template design systems for your team. By the conclusion of Sprint 4, your internal marketers are fully empowered to build, test, and analyze new campaigns with confidence.',
        ar: 'نعم بالتأكيد، فنقل المعرفة جزء أساسي ومحوري في منهجية تسليمنا. نقدم ورش عمل تطبيقية ومكثفة، وتوثيقاً تشغيلياً مرئياً ومكتوباً، وأدلة لبناء الشرائح واستخدام قوالب التصميم. وبنهاية المرحلة الرابعة، يكون فريقكم الداخلي جاهزاً ومؤهلاً بالكامل لإنشاء واختبار وتحليل الحملات الجديدة بكل استقلالية واحترافية.',
      },
    },
  ],
};