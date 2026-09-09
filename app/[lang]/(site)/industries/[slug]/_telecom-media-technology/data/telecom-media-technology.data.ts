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

export interface TelecomOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface TelecomVerticalItem {
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

export interface TelecomMediaTechnologyData {
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
  offerings: TelecomOfferingItem[];
  whyItMatters: {
    title: { en: string; ar: string };
    text: { en: string; ar: string };
    image: string;
  };
  benefitsStrip: {
    title: { en: string; ar: string };
    image: string;
    benefits: SolutionBenefitItem[];
  };
  verticalsTitle: { en: string; ar: string };
  verticalsSubtitle: { en: string; ar: string };
  verticals: TelecomVerticalItem[];
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

export const telecomMediaTechnologyData: TelecomMediaTechnologyData = {
  hero: {
    tag: {
      en: 'Industry Practice',
      ar: 'قطاع الممارسات الصناعية',
    },
    secondaryTag: {
      en: 'Telecom, Media & Technology',
      ar: 'الاتصالات والإعلام والتقنية',
    },
    title: {
      en: 'Reinventing Telco & Media into Agile Digital Platforms',
      ar: 'إعادة ابتكار قطاع الاتصالات والإعلام كمنصات رقمية مرنة',
    },
    subtitle: {
      en: 'Break legacy barriers, unlock 5G monetization, and conquer subscriber churn with sovereign cloud architectures, low-latency streaming pipelines, and AI-driven customer care.',
      ar: 'تجاوز قيود الأنظمة التقليدية، وحقق عوائد استثنائية من شبكات الجيل الخامس (5G)، وتصدى لمغادرة المشتركين بمعماريات سحابية سيادية ومسارات بث فائقة السرعة وخدمة عملاء ذكية بالذكاء الاصطناعي.',
    },
    ctaText: {
      en: 'Schedule TMT Strategy Session',
      ar: 'احجز جلسة استراتيجية لقطاع التقنية والاتصالات',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=85',
    highlights: [
      {
        en: '5G Programmable Network APIs & Telco-as-a-Platform Enablement',
        ar: 'واجهات برمجة شبكات الجيل الخامس (5G APIs) وتحويل المشغلين إلى منصات برمجية',
      },
      {
        en: 'AI Churn Mitigation & Behavioral Retention Orchestration',
        ar: 'الحد الاستباقي من مغادرة المشتركين وأتمتة مسارات الاستبقاء السلوكية',
      },
      {
        en: 'Cloud-Native BSS/OSS Microservices & Billing Modernization',
        ar: 'تحديث أنظمة الفوترة والعمليات (BSS/OSS) بمعمارية خدمات سحابية مصغرة',
      },
      {
        en: 'Ultra-Low-Latency Edge Streaming & Media Monetization Engines',
        ar: 'محركات بث وسائط متعددة عند الحافة بزمن استجابة فائق السرعة وتحقيق عوائد رقمية',
      },
    ],
  },

  futureStrip: [
    {
      title: {
        en: 'Heavy network capex challenges ROI',
        ar: 'الاستثمارات الضخمة في الشبكات تضغط على العوائد',
      },
      description: {
        en: 'Massive capital outlays for 5G and fiber require telcos to move beyond dumb-pipe connectivity and monetize programmable network APIs.',
        ar: 'تتطلب الاستثمارات الرأسمالية الضخمة في شبكات الجيل الخامس والألياف الضوئية التحول من مجرد قنوات نقل إلى منصات برمجية تحقق عوائد عبر واجهات برمجة التطبيقات.',
      },
      badge: {
        en: 'Realities of TMT 01',
        ar: 'واقع قطاع الاتصالات 01',
      },
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Subscriber churn accelerates in saturated markets',
        ar: 'تسارع فقدان المشتركين في الأسواق المشبعة',
      },
      description: {
        en: 'Subscribers switch providers rapidly unless operators deliver unified omnichannel self-service, personalized bundling, and zero-latency digital care.',
        ar: 'ينتقل المشتركون بسرعة بين المشغلين ما لم يقدم المزودون خدمة ذاتية رقمية موحدة، وباقات مخصصة، ودعماً فورياً فائق السرعة عبر كافة القنوات.',
      },
      badge: {
        en: 'Realities of TMT 02',
        ar: 'واقع قطاع الاتصالات 02',
      },
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Content fragmentation demands intelligent curation',
        ar: 'تشتت المحتوى يتطلب ترشيحاً ذكياً موجهاً',
      },
      description: {
        en: 'Streaming and media audiences suffer from decision fatigue, necessitating AI recommendation engines and automated metadata enrichment.',
        ar: 'يعاني جمهور المنصات الترفيهية والإعلامية من إرهاق اتخاذ القرار، مما يتطلب محركات توصية ذكية وأتمتة تصنيف البيانات الوصفية لتعزيز المشاركة.',
      },
      badge: {
        en: 'Realities of TMT 03',
        ar: 'واقع قطاع الاتصالات 03',
      },
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Legacy BSS/OSS architectures stall innovation',
        ar: 'أنظمة الدعم التشغيلي القديمة تعيق الابتكار السريع',
      },
      description: {
        en: 'Monolithic billing and network management systems hinder rapid commercial product launches and multi-cloud edge deployment.',
        ar: 'تحد أنظمة الفوترة وإدارة العمليات المركزية القديمة من سرعة إطلاق الباقات والمنتجات التجارية ونشر خدمات الحوسبة السحابية الطرفية.',
      },
      badge: {
        en: 'Realities of TMT 04',
        ar: 'واقع قطاع الاتصالات 04',
      },
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
    },
  ],

  agileFoundation: {
    title: {
      en: 'An Agile Foundation for Telco & Media',
      ar: 'الأساس الهندسي المرن لقطاع الاتصالات والإعلام',
    },
    subtitle: {
      en: 'Modernizing monolithic legacy telecommunications and media broadcasting into modular, cloud-native services designed for rapid product rollouts and microsecond responsiveness.',
      ar: 'تحديث أنظمة الاتصالات والبث الضخمة التقليدية إلى خدمات سحابية معيارية رشيقة مصممة لإطلاق المنتجات بسرعة فائقة وأوقات استجابة في أجزاء من الميلي ثانية.',
    },
    diagramBadge: {
      en: 'TMT Digital Architecture',
      ar: 'المعمارية الرقمية للاتصالات والتقنية',
    },
    pillars: [
      {
        number: '01',
        title: {
          en: 'Decoupled BSS/OSS Microservices',
          ar: 'فصل خدمات الفوترة والعمليات (BSS/OSS)',
        },
        description: {
          en: 'Isolate billing, product catalog, and network provisioning into resilient microservices, enabling new mobile plan launches in days rather than quarters.',
          ar: 'عزل الفوترة وكتالوج الباقات وتشغيل الشبكات في خدمات مصغرة مرنة، مما يتيح إطلاق باقات المشتركين الجديدة في أيام معدودة بدلاً من شهور.',
        },
      },
      {
        number: '02',
        title: {
          en: 'Real-Time Telemetry & Autonomous Care',
          ar: 'الرصد الفوري والخدمة الذاتية المؤتمتة',
        },
        description: {
          en: 'Ingest network cell tower telemetry and subscriber device signals in real time to proactively resolve call drops and bandwidth throttling via AI.',
          ar: 'جمع بيانات أبراج الاتصال وإشارات أجهزة المشتركين في الوقت الفعلي لحل مشاكل انقطاع المكالمات وبطء السرعة استباقياً بواسطة الذكاء الاصطناعي.',
        },
      },
      {
        number: '03',
        title: {
          en: 'Omnichannel Subscriber Self-Care Portal',
          ar: 'بوابة موحدة للخدمة الذاتية للمشتركين',
        },
        description: {
          en: 'Unified mobile apps, eSIM provisioning, instant top-ups, and sovereign generative AI copilots that deflect up to 68% of contact center call volume.',
          ar: 'تطبيقات جوال متكاملة تدعم تفعيل الشريحة الإلكترونية (eSIM)، والشحن الفوري، ومساعد ذكاء اصطناعي سيادي يمتص حتى 68% من استفسارات مراكز الاتصال.',
        },
      },
    ],
  },

  offeringsTitle: {
    en: 'Capabilities Built for Digital Telco & Tech',
    ar: 'قدرات هندسية متطورة لقطاع الاتصالات والتقنية',
  },
  offeringsSubtitle: {
    en: 'Production-ready solutions delivering high network throughput, subscriber retention, and scalable media monetization.',
    ar: 'حلول جاهزة للإنتاج تضمن تدفقاً شبكياً هائلاً، واستبقاء المشتركين، وتحقيق عوائد قابلة للتوسع من منصات الإعلام والتقنية.',
  },
  offerings: [
    {
      slug: 'next-gen-5g-network-apis',
      tag: { en: '5G & Infrastructure', ar: 'شبكات 5G والبنية التحتية' },
      title: { en: '5G Network APIs & Programmable Core', ar: 'واجهات شبكات 5G والأنظمة البرمجية' },
      description: {
        en: 'Deploy GSMA Open Gateway standard APIs that allow enterprise developers to request dynamic quality on demand (QoD), network slicing, and SIM swap security.',
        ar: 'نشر واجهات معتمدة لمعايير GSMA Open Gateway تتيح للمطورين والشركات طلب جودة مخصصة عند الطلب (QoD)، وتقسيم الشبكات، وأمان التحقق من الشريحة.',
      },
      icon: 'TbBroadcast',
      diagramType: 'wave-frequency-stream',
      highlights: {
        en: [
          'GSMA Open Gateway & CAMARA API Standardization',
          'Dynamic Network Slicing & SLA Guarantee Policies',
          'Carrier-Grade Low-Latency Edge Deployments',
          'SIM Swap & Silent Mobile Identity Verification',
        ],
        ar: [
          'توحيد معايير الواجهات وفق GSMA Open Gateway و CAMARA',
          'تقسيم ديناميكي للشبكات وضمان اتفاقيات مستوى الخدمة (SLA)',
          'نشر معالجة حافة فائقة السرعة تلائم متطلبات المشغلين',
          'التحقق الذاتي من هوية الشريحة ومنع الاحتيال الرقمي',
        ],
      },
    },
    {
      slug: 'media-streaming-monetization',
      tag: { en: 'Media & Streaming', ar: 'بث الوسائط وتحقيق العوائد' },
      title: { en: 'Digital Media Streaming & Ad Insertion', ar: 'منصات بث الوسائط والإعلانات الموجهة' },
      description: {
        en: 'Engineered for millions of concurrent viewers with adaptive bitrate HLS/DASH streaming, real-time dynamic server-side ad insertion (SSAI), and digital rights management.',
        ar: 'مصممة لملايين المشاهدين المتزامنين مع تقنيات HLS/DASH المتكيفة، وحقن الإعلانات الديناميكية من جهة الخادم (SSAI)، وإدارة الحقوق الرقمية (DRM).',
      },
      icon: 'TbDeviceTv',
      diagramType: 'social-resonance-echo',
      highlights: {
        en: [
          'Server-Side Ad Insertion (SSAI) with Zero Buffer Jitter',
          'Multi-DRM Protection (Widevine, FairPlay, PlayReady)',
          'AI Scene Search & Instant Content Highlights Clipping',
          'Multi-Tenant OTT Architecture with Global Edge CDN',
        ],
        ar: [
          'حقن الإعلانات على الخادم (SSAI) بدون أي تقطيع في البث',
          'حماية متعددة الحقوق تشمل Widevine و FairPlay و PlayReady',
          'بحث ذكي في المشاهد وقص لقطات الفيديو المهمة آلياً',
          'معمارية OTT متعددة المستأجرين مرتبطة بشبكات CDN عالمية',
        ],
      },
    },
    {
      slug: 'b2b-telco-saas-architecture',
      tag: { en: 'B2B & Enterprise', ar: 'حلول الشركات وخدمات B2B' },
      title: { en: 'B2B Telco & Enterprise SaaS Gateways', ar: 'بوابات خدمات الاتصالات وحلول SaaS للشركات' },
      description: {
        en: 'Empower corporate enterprise clients with self-service fleet billing, bulk eSIM fleet deployment, SD-WAN control dashboards, and automated service quotas.',
        ar: 'تمكين عملاء الشركات من إدارة أساطيل الشرائح، وتفعيل شرائح eSIM الجماعية، ولوحات تحكم شبكات SD-WAN، وتحديد الحصص آلياً.',
      },
      icon: 'TbServer2',
      diagramType: 'api-cluster-gateway',
      highlights: {
        en: [
          'Bulk Corporate Fleet Provisioning & Cost Centers',
          'Self-Service SD-WAN & MPLS Configuration Portals',
          'Automated Tiered Enterprise Credit Limit Approvals',
          'RESTful B2B Billing API Integrations with SAP/Oracle',
        ],
        ar: [
          'إدارة جماعية لشرائح أساطيل الشركات ومراكز التكلفة',
          'بوابات خدمة ذاتية لضبط إعدادات شبكات SD-WAN و MPLS',
          'موافقات آلية على التسهيلات الائتمانية للشركات الكبرى',
          'واجهات برمجة RESTful متصلة بأنظمة SAP و Oracle للمحاسبة',
        ],
      },
    },
    {
      slug: 'churn-prediction-retention',
      tag: { en: 'AI & Data Intelligence', ar: 'ذكاء البيانات ونماذج AI' },
      title: { en: 'Predictive Subscriber Churn Engine', ar: 'محرك التنبؤ بمغادرة المشتركين والاستبقاء' },
      description: {
        en: 'Identify churn signals weeks before cancellation. Machine learning models evaluate data usage drop-offs, dropped call spikes, and bill surprises to trigger automated loyalty retention.',
        ar: 'رصد إشارات المغادرة قبل وقوعها بأسابيع. تقيم نماذج التعلم الآلي انخفاض استهلاك البيانات وشكاوى الفواتير لإطلاق عروض استبقاء آلية فورية.',
      },
      icon: 'TbUserCheck',
      diagramType: 'orbital-radar',
      highlights: {
        en: [
          'Real-Time Behavioral Churn Probability Scoring',
          'Automated Next-Best-Offer (NBO) Incentive Engine',
          'Billing Shock Intervention & Proactive Tariff Upgrades',
          'Omnichannel Retention Push via App, SMS & WhatsApp',
        ],
        ar: [
          'تسجيل احتمالية المغادرة في الوقت الفعلي بناءً على السلوك',
          'محرك العرض الأفضل التالي (Next-Best-Offer) الآلي',
          'معالجة صدمات الفواتير وترقية الباقات استباقياً',
          'تواصل استبقاء متعدد القنوات عبر التطبيق والرسائل والواتساب',
        ],
      },
    },
    {
      slug: 'cloud-native-bss-oss',
      tag: { en: 'Cloud & Modernization', ar: 'السحابة وتحديث الأنظمة' },
      title: { en: 'Cloud-Native BSS/OSS Modernization', ar: 'تحديث منظومة العمليات والفوترة السحابية' },
      description: {
        en: 'Break down monolithic charging and rating systems into cloud-native microservices running on Kubernetes, cutting infrastructure operating costs by up to 45%.',
        ar: 'تفكيك أنظمة الفوترة والتقييم المتضخمة إلى خدمات سحابية مصغرة تعمل على Kubernetes، مما يخفض تكاليف البنية التحتية بنسبة تصل إلى 45%.',
      },
      icon: 'TbCpu',
      diagramType: 'de-microservices-mesh',
      highlights: {
        en: [
          'TM Forum Open Digital Architecture (ODA) Alignment',
          'Real-Time Convergent Charging System (CCS) Tuning',
          'Zero-Downtime Rolling Upgrades for Network Systems',
          'Automated Service Fulfillment & Dynamic Catalog Sync',
        ],
        ar: [
          'توافق كامل مع المعمارية الرقمية المفتوحة TM Forum ODA',
          'ضبط أنظمة الفوترة والتحصيل المتقاربة (CCS) لحظياً',
          'تحديثات مستمرة للأنظمة دون انقطاع ثانية واحدة عن العمل',
          'أتمتة تفعيل الخدمات ومزامنة كتالوج المنتجات بين الأنظمة',
        ],
      },
    },
    {
      slug: 'edge-computing-iot',
      tag: { en: 'Edge & IoT', ar: 'حوسبة الحافة وإنترنت الأشياء' },
      title: { en: 'Edge Computing & Industrial IoT Hub', ar: 'حوسبة الحافة ومنصات إنترنت الأشياء الصناعية' },
      description: {
        en: 'Process millions of sensor telemetry streams at the cellular edge. Enable sub-5 millisecond response times for smart city sensors, logistics fleets, and utility grids.',
        ar: 'معالجة ملايين تدفقات أجهزة الاستشعار عند حافة الشبكة الخلوية. توفير زمن استجابة يقل عن 5 ميلي ثانية للمدن الذكية، وشبكات النقل، والمرافق العامة.',
      },
      icon: 'TbActivity',
      diagramType: 'infinity-pulse-exchange',
      highlights: {
        en: [
          'Multi-Access Edge Computing (MEC) Infrastructure',
          'MQTT & CoAP Scalable IoT Message Ingestion',
          'Sub-5ms End-to-End Latency for Critical Sensors',
          'Over-the-Air (OTA) Device Firmware Management',
        ],
        ar: [
          'بنية تحتية لحوسبة الحافة متعددة المنافذ (MEC)',
          'استقبال بيانات المستشعرات عبر بروتوكولات MQTT و CoAP',
          'زمن استجابة أقل من 5 ميلي ثانية للمستشعرات الحيوية',
          'إدارة وتحديث برمجيات الأجهزة المتصلة عن بُعد (OTA)',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Navigating Disruption in Telecommunications, Media & Tech',
      ar: 'قيادة التحول في مشهد الاتصالات والإعلام والتقنية المعاصر',
    },
    text: {
      en: 'The TMT industry sits at the epicenter of the global digital economy, yet faces severe margin pressure from capital-intensive 5G rollouts, rising customer acquisition costs, and aggressive streaming competition. Winning operators and tech brands are those that transcend dumb-pipe connectivity to become agile software platforms. Persici empowers TMT leaders with sovereign architectures, AI-driven subscriber operations, and media monetization pipelines that transform network investments into high-margin enterprise software revenue.',
      ar: 'يقع قطاع الاتصالات والإعلام والتقنية في قلب الاقتصاد الرقمي العالمي، ولكنه يواجه ضغوطاً متزايدة على الهوامش بسبب النفقات الرأسمالية الضخمة لشبكات 5G، وارتفاع تكلفة استقطاب المشتركين، والمنافسة الشرسة في البث. المشغلون والشركات الرائدة هم من يتحولون من مجرد ناقل للبيانات إلى منصات برمجية رشيقة. تمكن بيرسيكي قادة القطاع بمعماريات سيادية، وعمليات ذكية للمشتركين، ومسارات عوائد رقمية تحول استثمارات الشبكات إلى أرباح تشغيلية مستدامة.',
    },
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=85',
  },

  benefitsStrip: {
    title: {
      en: 'Proven Strategic Impact for TMT Enterprises',
      ar: 'أثر استراتيجي ملموس لكبرى شركات الاتصالات والإعلام',
    },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85',
    benefits: [
      {
        title: { en: 'Drastic Churn Reduction', ar: 'خفض حاد في معدلات مغادرة المشتركين' },
        description: {
          en: 'Proactive behavioral modeling mitigates churn by up to 34%, preserving high-ARPU subscriber accounts through tailored loyalty interventions.',
          ar: 'النمذجة السلوكية الاستباقية تخفض مغادرة العملاء بنسبة تصل إلى 34%، وتحمي المشتركين ذوي العوائد المرتفعة بعروض ولاء مخصصة.',
        },
      },
      {
        title: { en: '5G Enterprise Monetization', ar: 'عوائد استثنائية لخدمات 5G المؤسسية' },
        description: {
          en: 'Monetize high-speed connectivity by offering programmable network slicing APIs directly to enterprises for private industrial deployments.',
          ar: 'تحقيق أرباح من سرعات الشبكة بطرح واجهات APIs لتقسيم الشبكات للشركات الكبرى والمصانع الذكية مباشرة.',
        },
      },
      {
        title: { en: 'Zero-Touch Digital Care', ar: 'خدمة عملاء ذاتية بدون تدخل بشري' },
        description: {
          en: 'Deflect up to 68% of mundane customer inquiries to sovereign AI assistants, allowing human agents to focus on high-touch enterprise accounts.',
          ar: 'امتصاص حتى 68% من الاستفسارات الروتينية عبر مساعدي الذكاء الاصطناعي السيادية، ليتفرغ الموظفون لخدمة كبار العملاء.',
        },
      },
      {
        title: { en: 'Scalable Content Delivery', ar: 'بث وسائط فائق التوسع والموثوقية' },
        description: {
          en: 'Deliver peak sporting and live entertainment broadcasts with sub-second glass-to-glass latency and dynamic server-side ad yields.',
          ar: 'بث الفعاليات الرياضية والترفيهية المباشرة بزمن استجابة أقل من ثانية، وتحقيق أعلى عوائد من الإعلانات الديناميكية.',
        },
      },
    ],
  },

  verticalsTitle: {
    en: 'Sectors Within TMT We Transform',
    ar: 'القطاعات المتخصصة التي نقود تحولها',
  },
  verticalsSubtitle: {
    en: 'Targeted architectural solutions tailored to the operational realties of network carriers, media platforms, and SaaS providers.',
    ar: 'حلول معمارية موجهة تراعي الواقع التشغيلي لمشغلي الشبكات، ومنصات البث الرقمي، ومزودي البرمجيات كخدمة.',
  },
  verticals: [
    {
      id: 'telecom-networks',
      number: '01',
      title: { en: 'Mobile & Fixed Network Carriers', ar: 'مشغلو شبكات الاتصالات المتنقلة والثابتة' },
      tag: { en: '5G Core & BSS/OSS', ar: 'أنظمة 5G والعمليات' },
      description: {
        en: 'Empowering national telecom providers to modernize billing infrastructure, deploy self-service mobile apps, and unlock corporate 5G network slicing.',
        ar: 'تمكين شركات الاتصالات الوطنية من تحديث أنظمة الفوترة، ونشر تطبيقات الخدمة الذاتية للمشتركين، وإطلاق شبكات 5G الخاصة للشركات.',
      },
      capabilities: {
        en: [
          'eSIM Instant Activation & Self-Service Provisioning',
          'Converged Rating & Real-Time Billing Integration',
          'Network Slicing API Gateway for Corporate Accounts',
          'AI-Powered Dropped Call Diagnostic Engines',
        ],
        ar: [
          'تفعيل فوري لشرائح eSIM عبر التطبيق بخطوات ذاتية',
          'دمج أنظمة التقييم والفوترة الفورية متعددة الخدمات',
          'بوابة واجهات برمجة لتقسيم الشبكات لحسابات الشركات',
          'محركات ذكاء اصطناعي لتشخيص وتحليل انقطاع المكالمات',
        ],
      },
    },
    {
      id: 'media-entertainment',
      number: '02',
      title: { en: 'Digital Media, OTT & Entertainment', ar: 'الإعلام الرقمي ومنصات البث الترفيهي (OTT)' },
      tag: { en: 'Streaming & DAI', ar: 'البث والإعلانات الديناميكية' },
      description: {
        en: 'Architecting scalable OTT video streaming platforms with personalized content recommendation, dynamic ad insertion, and live interactive event voting.',
        ar: 'هندسة منصات بث فيديو OTT فائقة التوسع، مع توصيات مخصصة للمحتوى، وحقن ديناميكي للإعلانات، وتصويت تفاعلي للمباريات الحية.',
      },
      capabilities: {
        en: [
          'Ultra-Low-Latency Live Video Streaming Pipelines',
          'Server-Side Dynamic Ad Insertion (SSAI)',
          'AI Multi-Language Audio Dubbing & Subtitling',
          'Cross-Device Resume & Interactive Watch-Party Hubs',
        ],
        ar: [
          'مسارات بث فيديو مباشر بزمن انتقال منخفض للغاية',
          'حقن إعلانات ديناميكية موجهة على مستوى الخادم (SSAI)',
          'دبلجة صوتية وترجمة متعددة اللغات بالذكاء الاصطناعي',
          'متابعة المشاهدة عبر الأجهزة وغرف مشاهدة تفاعلية مشتركة',
        ],
      },
    },
    {
      id: 'consumer-tech',
      number: '03',
      title: { en: 'Consumer Tech & High-Growth SaaS', ar: 'التقنيات الاستهلاكية وبرمجيات SaaS المتسارعة' },
      tag: { en: 'Platform Engineering', ar: 'هندسة المنصات والبرمجيات' },
      description: {
        en: 'Enabling consumer hardware and cloud software brands to build durable subscription ecosystems, optimize viral user onboarding, and scale microservices globally.',
        ar: 'مساعدة علامات الأجهزة الاستهلاكية وبرمجيات السحابة على بناء اشتراكات مستدامة، وتحسين انضمام المستخدمين، وتوسيع الخدمات عالمياً.',
      },
      capabilities: {
        en: [
          'Product-Led Growth (PLG) Onboarding Funnels',
          'Multi-Tenant SaaS Microservice Architecture',
          'Integrated Hardware-Software Telematics Sync',
          'Zero-Trust User Identity & Single Sign-On (SSO)',
        ],
        ar: [
          'مسارات انضمام رقمية سلسة تقود نمو المنتجات (PLG)',
          'معمارية خدمات مصغرة متعددة المستأجرين للبرمجيات',
          'مزامنة سحابية فورية بين الأجهزة الذكية والتطبيقات',
          'أنظمة هوية وانعدام الثقة (Zero-Trust) وتسجيل دخول موحد',
        ],
      },
    },
    {
      id: 'edge-satellite',
      number: '04',
      title: { en: 'Satellite & Edge Infrastructure', ar: 'البنية التحتية للأقمار الصناعية والحافة' },
      tag: { en: 'Low-Orbit & Remote', ar: 'المدار المنخفض وشبكات الحافة' },
      description: {
        en: 'Designing low Earth orbit (LEO) satellite data processing pipelines, offshore rig connectivity hubs, and distributed edge nodes for mission-critical operations.',
        ar: 'تصميم مسارات معالجة بيانات الأقمار الصناعية ذات المدار المنخفض (LEO)، ومحطات ربط المنصات البحرية، وعقد الحافة للعمليات الحيوية.',
      },
      capabilities: {
        en: [
          'Hybrid Satellite-Terrestrial Failover Routing',
          'Distributed Edge Node Telemetry Ingestion',
          'Encrypted High-Altitude Data Transmission',
          'Remote Autonomous Asset Tracking & Diagnostics',
        ],
        ar: [
          'توجيه مرن بديل بين شبكات الأقمار الصناعية والأرضية',
          'استقبال بيانات أجهزة الاستشعار عبر عقد الحافة الموزعة',
          'تشفير سيادي عالي الأمان لنقل البيانات عبر الأقمار',
          'تتبع وتشخيص حالة الأصول النائية بشكل مستقل وآلي',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'TMT Technology Infrastructure',
    ar: 'البنية التقنية لقطاع الاتصالات والتقنية',
  },
  techStackSubtitle: {
    en: 'Carrier-grade, cloud-native frameworks designed for microsecond telemetry, high concurrent connections, and sovereign compliance.',
    ar: 'أطر عمل سحابية بمستوى المشغلين مصممة لمعالجة تدفقات البيانات في أجزاء من الميلي ثانية والامتثال السيادي للأنظمة.',
  },
  techStackPods: [
    {
      title: { en: 'Carrier Cloud & 5G Core', ar: 'سحابة المشغلين وشبكات 5G' },
      badge: { en: 'Network Tier', ar: 'طبقة الشبكة' },
      description: {
        en: 'Containerized telecom network functions (CNFs) deployed on hybrid clouds for dynamic scaling and network slicing.',
        ar: 'وظائف شبكات اتصالات معتمدة على الحاويات (CNFs) موزعة على سحابات هجينة لتقسيم الشبكات والتوسع التلقائي.',
      },
      technologies: [
        { name: 'Red Hat OpenShift', category: 'Carrier Kubernetes', badge: 'Telco' },
        { name: 'AWS for Telecom', category: 'Hybrid Edge', badge: 'Wavelength' },
        { name: 'Azure for Operators', category: 'Core Network', badge: '5G Ready' },
        { name: 'Istio Service Mesh', category: 'Microservice Traffic', badge: 'mTLS' },
      ],
    },
    {
      title: { en: 'Low-Latency Media & Edge', ar: 'بث الوسائط والحافة المنخفضة التأخير' },
      badge: { en: 'Streaming Tier', ar: 'طبقة البث التفاعلي' },
      description: {
        en: 'Global content delivery network (CDN) edge compute, server-side ad injection, and low-latency video transcoding.',
        ar: 'شبكة توزيع محتوى (CDN) عند الحافة مع معالجة سحابية، وحقن إعلانات لحظي، وترميز فيديو فائق السرعة.',
      },
      technologies: [
        { name: 'Cloudflare Workers', category: 'Edge Serverless', badge: 'Global' },
        { name: 'Fastly Media Shield', category: 'Sub-Second OTT', badge: 'Low Latency' },
        { name: 'Apache Kafka', category: 'Real-Time Event Stream', badge: 'Million msg/s' },
        { name: 'FFmpeg Pipelines', category: 'Adaptive Bitrate Transcode', badge: 'HLS/DASH' },
      ],
    },
    {
      title: { en: 'BSS/OSS Modernization', ar: 'أنظمة العمليات والفوترة الرقمية' },
      badge: { en: 'Operations Tier', ar: 'طبقة العمليات والفوترة' },
      description: {
        en: 'Decoupled customer billing, service orchestration, and automated ticketing systems aligned with TM Forum standards.',
        ar: 'أنظمة فوترة مفصولة، وجدولة آلية للخدمات، وإدارة تذاكر الدعم متوافقة تماماً مع معايير TM Forum ODA.',
      },
      technologies: [
        { name: 'Salesforce Telecom', category: 'Communications Cloud', badge: 'Omnichannel' },
        { name: 'Amdocs APIs', category: 'Billing & Charging', badge: 'Telecom Core' },
        { name: 'ServiceNow TSM', category: 'Telecom Service Mgmt', badge: 'Automated' },
        { name: 'Camunda BPM', category: 'Workflow Orchestration', badge: 'BPMN 2.0' },
      ],
    },
    {
      title: { en: 'Subscriber AI & Analytics', ar: 'ذكاء المشتركين والتحليلات التنبؤية' },
      badge: { en: 'Intelligence Tier', ar: 'طبقة الذكاء الاصطناعي' },
      description: {
        en: 'Machine learning infrastructure processing subscriber telemetry to score churn probability and predict network congestion.',
        ar: 'بنية تحتية لتعلم الآلة تحلل بيانات استهلاك المشتركين للتنبؤ بنوايا المغادرة واكتشاف ازدحام الشبكات استباقياً.',
      },
      technologies: [
        { name: 'Databricks', category: 'Lakehouse & ML Models', badge: 'Realtime' },
        { name: 'ClickHouse', category: 'Sub-Second Telemetry DB', badge: 'Petabyte' },
        { name: 'Redis Enterprise', category: 'In-Memory State Store', badge: 'Sub-Millisecond' },
        { name: 'PyTorch / Triton', category: 'Inference Serving', badge: 'GPU Cluster' },
      ],
    },
  ],

  clientStories: getFeaturedStories(['gulf-enterprise-copilot', 'finvibe-trading', 'nissan-mobility']),

  delivery: {
    title: {
      en: 'Our TMT Delivery Blueprint',
      ar: 'منهجية تنفيذ حلول الاتصالات والتقنية',
    },
    subtitle: {
      en: 'A rigorous delivery methodology built to navigate complex carrier regulations, legacy IT dependencies, and zero-downtime cutovers.',
      ar: 'منهجية تنفيذ صارمة مصممة للتعامل مع اللوائح التنظيمية، وتبعية الأنظمة القديمة، والتحول التقني دون توقف الخدمة ثانية واحدة.',
    },
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85',
    pillars: [
      {
        title: {
          en: 'Legacy Dependency & Regulatory Audit',
          ar: 'تدقيق الأنظمة القائمة والامتثال التنظيمي',
        },
        description: {
          en: 'Comprehensive mapping of legacy BSS/OSS interfaces, regulatory spectrum constraints, data residency mandates, and network bottlenecks.',
          ar: 'تخطيط شامل لواجهات أنظمة BSS/OSS القديمة، وقيود الترددات، ولوائح توطين البيانات، ونقاط الاختناق في الشبكة.',
        },
      },
      {
        title: {
          en: 'Microservice Decoupling & API Gateway',
          ar: 'فصل الخدمات المصغرة وبناء بوابة الواجهات',
        },
        description: {
          en: 'Implement the Strangler Fig pattern to encapsulate legacy core systems behind hardened API gateways without disrupting active subscribers.',
          ar: 'تطبيق نمط عزل الأنظمة القديمة تدريجياً (Strangler Fig) خلف بوابات واجهات برمجة محصنة دون التأثير على المشتركين الحاليين.',
        },
      },
      {
        title: {
          en: 'Staged Migration & Shadow Traffic Testing',
          ar: 'الترحيل المتدرج واختبار حركة المرور الموازية',
        },
        description: {
          en: 'Mirror live network and billing traffic to validate accuracy, performance, and failover resilience prior to full production cutover.',
          ar: 'محاكاة حركة مرور الفوترة والشبكة الحية في بيئة موازية للتحقق التام من الدقة وسرعة الاستجابة قبل التحويل النهائي.',
        },
      },
      {
        title: {
          en: 'Continuous Autonomous Operations',
          ar: 'العمليات المستمرة والأتمتة الذاتية',
        },
        description: {
          en: 'Hand off fully automated CI/CD pipelines, self-healing observability runbooks, and proactive churn intervention algorithms to your teams.',
          ar: 'تسليم مسارات نشر مؤتمتة (CI/CD)، وأنظمة مراقبة ذاتية الإصلاح، وخوارزميات استبقاء تفاعلية لفريق العمل الداخلي لديك.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'tmt-insight-01',
      title: {
        en: 'Monetizing 5G: How Network API Marketplaces Drive Enterprise Revenue',
        ar: 'تحقيق عوائد 5G: كيف تقود منصات واجهات الشبكة إيرادات قطاع الشركات',
      },
      excerpt: {
        en: 'Why leading telecommunications carriers are unlocking tens of millions in new annual recurring revenue through Open Gateway network slicing APIs.',
        ar: 'لماذا يحقق مشغلو الاتصالات الرائدون عشرات الملايين من العوائد المتكررة السنوية عبر واجهات برمجة تقسيم الشبكات المفتوحة.',
      },
      badge: {
        en: '5G Architecture',
        ar: 'معمارية 5G',
      },
      slug: 'monetizing-5g-network-api-marketplaces',
      href: '/insights/monetizing-5g-network-api-marketplaces',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      date: '2026-02-12',
    },
    {
      id: 'tmt-insight-02',
      title: {
        en: 'The Zero-Churn Telco: Machine Learning Models for Subscriber Retention',
        ar: 'مشغل اتصالات بدون مغادرة: نماذج تعلم الآلة للاحتفاظ بالمشتركين',
      },
      excerpt: {
        en: 'Evaluating how predictive AI behavioral intervention prevents churn weeks before customer cancellation in hyper-competitive markets.',
        ar: 'تقييم كيفية منع التدخل السلوكي الذكي لمغادرة المشتركين قبل أسابيع من الإلغاء في الأسواق شديدة التنافسية.',
      },
      badge: {
        en: 'AI Retention',
        ar: 'ذكاء الاستبقاء',
      },
      slug: 'the-zero-churn-telco-machine-learning',
      href: '/insights/the-zero-churn-telco-machine-learning',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      date: '2026-01-20',
    },
    {
      id: 'tmt-insight-03',
      title: {
        en: 'Modernizing Monolithic BSS/OSS: The Microservices Roadmap',
        ar: 'تحديث منظومات BSS/OSS المتضخمة: خارطة طريق الخدمات المصغرة',
      },
      excerpt: {
        en: 'Step-by-step technical playbook for decomposing multi-decade legacy billing stacks into resilient, TM Forum ODA compliant microservices.',
        ar: 'دليل تقني مفصل لتفكيك أنظمة الفوترة المتراكمة على مدى عقود إلى خدمات مصغرة مرنة متوافقة مع معايير TM Forum ODA.',
      },
      badge: {
        en: 'Cloud Engineering',
        ar: 'الهندسة السحابية',
      },
      slug: 'modernizing-monolithic-bss-oss-roadmap',
      href: '/insights/modernizing-monolithic-bss-oss-roadmap',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      date: '2026-01-05',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici engineered our next-generation subscriber self-care platform and real-time retention telemetry. We reduced call center load by 64% within three months and eliminated customer onboarding latency down to seconds.',
      ar: 'طورت بيرسيكي منصتنا المتطورة للخدمة الذاتية للمشتركين ونظام الرصد الفوري للاستبقاء. نجحنا في خفض ضغط مراكز الاتصال بنسبة 64% خلال ثلاثة أشهر، واختصرنا وقت انضمام المشترك وتفعيل خطه إلى ثوانٍ معدودة.',
    },
    author: 'Tariq Mansoor',
    role: {
      en: 'VP of Digital Channels & Customer Experience, Regional Telecom Operator',
      ar: 'نائب الرئيس للقنوات الرقمية وتجربة العملاء، مشغل اتصالات إقليمي',
    },
    badge: {
      en: 'Verified Enterprise Client',
      ar: 'عميل مؤسسي موثق',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions: Telecom, Media & Technology',
    ar: 'الأسئلة الشائعة: قطاع الاتصالات والإعلام والتقنية',
  },
  faqsSubtitle: {
    en: 'Answers regarding 5G monetization, BSS/OSS migration, subscriber churn prevention, and data sovereignty compliance.',
    ar: 'إجابات تقنية حول عوائد شبكات 5G، والتحول لأنظمة BSS/OSS السحابية، ومنع مغادرة المشتركين، والامتثال للوائح سيادة البيانات.',
  },
  faqs: [
    {
      question: {
        en: 'How do you decouple legacy BSS/OSS systems without interrupting millions of active mobile subscribers?',
        ar: 'كيف تقومون بفصل وتحديث أنظمة BSS/OSS القديمة دون التأثير على ملايين المشتركين النشطين؟',
      },
      answer: {
        en: 'We deploy the Strangler Fig architectural pattern. An enterprise API cluster gateway intercepts incoming subscriber traffic, gradually redirecting specific capabilities (such as plan changes, eSIM activation, or bill payments) to modern microservices while keeping legacy databases synchronized via real-time change data capture (CDC).',
        ar: 'نعتمد نمط (Strangler Fig) المعماري المجرب عالمياً. تقوم بوابة واجهات برمجية متطورة باعتراض حركة البيانات وتوجيه خدمات معينة تدريجياً (مثل تغيير الباقات، وتفعيل eSIM، وسداد الفواتير) إلى خدمات مصغرة حديثة، مع الحفاظ على تزامن قواعد البيانات القديمة لحظياً عبر مسارات CDC دون أي انقطاع.',
      },
    },
    {
      question: {
        en: 'How does your predictive churn engine identify at-risk subscribers early?',
        ar: 'كيف ينجح محرك التنبؤ بمغادرة المشتركين في رصد الحالات المعرضة للإلغاء مبكراً؟',
      },
      answer: {
        en: 'The engine evaluates dozens of multi-dimensional signals, including dropped call frequency, micro-outages in home coverage, customer care complaint sentiment, payment friction, and competitive pricing changes. When an account crosses the risk threshold, automated Next-Best-Offer workflows trigger personalized retention incentives.',
        ar: 'يقوم المحرك بتقييم عشرات الإشارات المتكاملة، مثل تكرار انقطاع المكالمات، وبطء التغطية في منطقة المشترك، ونبرة الشكاوى في الدعم الفني، وصدمات الفواتير، وعروض المنافسين. وعند تجاوز عتبة الخطر، يطلق النظام عروض استبقاء فورية مخصصة للعميل.',
      },
    },
    {
      question: {
        en: 'Can the media streaming platform handle high-concurrency live sporting events?',
        ar: 'هل تتحمل منصة بث الوسائط المباريات الرياضية الحية ذات كثافة المشاهدة الهائلة؟',
      },
      answer: {
        en: 'Yes. Our media architecture utilizes multi-CDN edge routing, low-latency HLS/DASH chunking, and server-side dynamic ad insertion (SSAI). It has been validated to sustain millions of simultaneous concurrent streams during championship matches with zero buffering.',
        ar: 'نعم بكل تأكيد. تستند معمارية البث لدينا إلى شبكات CDN متعددة وموزعة عالمياً، وتقطيع فيديو HLS/DASH فائق السرعة، وحقن الإعلانات على مستوى الخادم (SSAI). وقد تم اختبارها لتحمل ملايين المشاهدين المتزامنين أثناء المباريات الكبرى دون أي تقطيع.',
      },
    },
    {
      question: {
        en: 'Are your cloud deployments compliant with regional GCC telecom data sovereignty regulations?',
        ar: 'هل حلولكم السحابية متوافقة مع لوائح هيئات الاتصالات وسيادة البيانات في دول الخليج؟',
      },
      answer: {
        en: 'Absolutely. We design sovereign cloud architectures hosted exclusively within in-country GCC data centers (such as local AWS Bahrain/UAE, Google Cloud Dammam/Doha, Oracle Cloud Riyadh, or private telecom telco-cloud enclaves) strictly adhering to NCA and TDRA data residency mandates.',
        ar: 'بالتأكيد. نصمم معماريات سحابية سيادية تستضاف حصرياً داخل مراكز البيانات المحلية في دول الخليج (مثل AWS و Google Cloud و Oracle Cloud المحلية أو السحب الخاصة للمشغلين)، وتلتزم التزاماً صارماً بلوائح الهيئة الوطنية للأمن السيبراني وهيئات الاتصالات المحلية.',
      },
    },
    {
      question: {
        en: 'What is GSMA Open Gateway, and how does Persici help operators implement it?',
        ar: 'ما هو معيار GSMA Open Gateway وكيف تساعد بيرسيكي مشغلي الاتصالات في تطبيقه؟',
      },
      answer: {
        en: 'GSMA Open Gateway is a global initiative transforming mobile networks into standardized software platforms. Persici builds carrier-grade API gateways exposing standard CAMARA APIs (such as SIM Swap, Quality on Demand, and Device Location) to enterprise developers, creating high-margin B2B API subscription revenue.',
        ar: 'مبادرة GSMA Open Gateway هي حراك عالمي لتحويل شبكات الاتصالات إلى منصات برمجية موحدة. تبني بيرسيكي بوابات واجهات برمجة معتمدة تطرح واجهات CAMARA المعيارية (مثل التحقق من الشريحة، والجودة عند الطلب، وموقع الجهاز) لمطوري الشركات، مما يفتح مسار إيرادات اشتراكات B2B عالي الهامش.',
      },
    },
    {
      question: {
        en: 'How much operational cost can be reduced by moving to AI customer care?',
        ar: 'ما مقدار خفض التكاليف التشغيلية الذي يمكن تحقيقه عبر خدمة العملاء بالذكاء الاصطناعي؟',
      },
      answer: {
        en: 'By integrating sovereign generative AI agents with backend billing and provisioning APIs, operators typically achieve 55% to 68% direct call deflection for common requests, cutting per-inquiry support costs by up to 75% while improving subscriber CSAT scores.',
        ar: 'بدمج وكلاء الذكاء الاصطناعي التوليدي السيادية مع واجهات الفوترة وتفعيل الخدمات، يحقق المشغلون عادة تحويلاً واستيعاباً ذاتياً بنسبة 55% إلى 68% للاستفسارات الشائعة، مما يخفض تكلفة معالجة التذكرة الواحدة بنسبة 75% ويرفع رضا المشتركين.',
      },
    },
  ],
};
