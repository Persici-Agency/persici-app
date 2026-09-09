import type {
  SolutionDiagramType,
  FeaturedClientStoryItem,
  SolutionBenefitItem,
  SolutionExecutionPillar,
  SolutionFaqItem,
} from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { getCrmManagementFeaturedClientStories } from '@shared/data';

export interface CrmManagementOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface CrmManagementVerticalItem {
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

export interface CrmManagementData {
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
  offerings: CrmManagementOfferingItem[];
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
  verticals: CrmManagementVerticalItem[];
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

export const crmManagementData: CrmManagementData = {
  hero: {
    tag: {
      en: 'Solutions & Lifecycle Automation',
      ar: 'الحلول وأتمتة دورة حياة العميل',
    },
    secondaryTag: {
      en: 'CRM Management (Braze & Salesforce)',
      ar: 'إدارة علاقات العملاء (Braze & Salesforce)',
    },
    title: {
      en: 'Enterprise CRM Management & Lifecycle Orchestration That Multiplies Customer LTV',
      ar: 'إدارة متطورة لعلاقات العملاء وأتمتة دورة الحياة لمضاعفة القيمة الدائمة للعملاء',
    },
    subtitle: {
      en: 'Transform customer data into personalized experiences that drive engagement, retention, and long-term growth. We implement, integrate, and optimize leading platforms—specializing in Braze, Salesforce Marketing Cloud, Klaviyo, and WhatsApp Business API—delivering up to 480% ROI through real-time behavioral automation, predictive RFM segmentation, and zero-downtime migrations.',
      ar: 'حوّل بيانات عملائك إلى تجارب استثنائية مخصصة تعزز التفاعل والولاء والنمو المستدام. نقوم بتنفيذ وربط وتحسين كبرى منصات إدارة علاقات العملاء—متخصصين في Braze وSalesforce Marketing Cloud وKlaviyo وواتساب للأعمال—لتحقيق عائد استثمار يصل إلى 480% عبر الأتمتة السلوكية اللحظية والتقسيم التنبؤي المتطور.',
    },
    ctaText: {
      en: 'Schedule Enterprise CRM Audit',
      ar: 'احجز تدقيق منظومة إدارة علاقات العملاء',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=85',
    highlights: [
      {
        en: 'Certified Braze, Salesforce & Klaviyo Enterprise Architecture',
        ar: 'معمارية معتمدة لمنصات Braze وSalesforce وKlaviyo',
      },
      {
        en: 'Sub-Second Behavioral Triggers & Dynamic Liquid Scripting',
        ar: 'محفزات سلوكية فورية وتخصيص ديناميكي بنصوص Liquid',
      },
      {
        en: 'Official Meta WhatsApp Business Cloud API Multi-Agent Hub',
        ar: 'ربط رسمي مع واجهة واتساب السحابية للأعمال مع فرق متعددة',
      },
      {
        en: 'Automated Dedicated IP Warming & 99.7% Inbox Deliverability',
        ar: 'إحماء آلي لعناوين الـ IP المخصصة ووصول لصندوق الوارد بنسبة 99.7%',
      },
    ],
  },

  offeringsTitle: {
    en: 'Core CRM Management Capabilities',
    ar: 'القدرات الأساسية في إدارة علاقات العملاء',
  },
  offeringsSubtitle: {
    en: 'Six specialized disciplines connecting data, segmentation, automation, and omnichannel communication to deliver human-centric experiences at enterprise scale.',
    ar: 'ستة مسارات تخصصية تربط البيانات بالتقسيم الذكي والأتمتة وقنوات التواصل المتعددة لتقديم تجارب عملاء إنسانية ومؤثرة على نطاق مؤسسي واسع.',
  },
  offerings: [
    {
      slug: 'crm-strategy-lifecycle-planning',
      tag: {
        en: 'Lifecycle Strategy',
        ar: 'استراتيجية دورة الحياة',
      },
      title: {
        en: 'CRM Strategy & Lifecycle Planning',
        ar: 'استراتيجية CRM وتخطيط دورة حياة العميل',
      },
      description: {
        en: 'Define your customer lifecycle roadmap, cross-channel communication priorities, audience segment hierarchies, and win-back playbooks aligned with commercial KPIs.',
        ar: 'تحديد خارطة طريق دورة حياة العميل، وأولويات التواصل عبر القنوات، وهيكلة الشرائح المستهدفة، واستراتيجيات استعادة العملاء المنقطعين لتعظيم العوائد.',
      },
      icon: '/icons/solutions/crm-strategy-blueprint.svg',
      diagramType: 'crm-lifecycle-funnel-loop',
      highlights: {
        en: [
          'Full-Funnel Lifecycle Blueprinting (Onboard -> Convert -> Retain -> Winback)',
          'Communication Frequency Capping & Channel Governance Matrix',
          'Automated Churn Early-Warning & Churn Defense Playbooks',
        ],
        ar: [
          'تخطيط شامل لدورة الحياة (الترحيب والتفعيل -> التحويل -> الاحتفاظ -> الاستعادة)',
          'حوكمة وتحديد سقف تكرار الرسائل لمنع إزعاج العملاء وتشتتهم',
          'نماذج استباقية للإنذار المبكر لمنع تسرب العملاء وإعادة تفعيلهم',
        ],
      },
    },
    {
      slug: 'crm-platform-implementation-integration',
      tag: {
        en: 'Platform Engineering',
        ar: 'هندسة وربط المنصات',
      },
      title: {
        en: 'CRM Platform Implementation & Integration (Braze & Salesforce)',
        ar: 'تنفيذ وربط منصات CRM (Braze وSalesforce)',
      },
      description: {
        en: 'End-to-end configuration and API integration of Braze, Salesforce Marketing Cloud, HubSpot, and Klaviyo with your mobile apps, ecommerce engines, and data lakes.',
        ar: 'إعداد وتكامل متكامل لمنصات Braze وSalesforce وHubSpot وKlaviyo عبر الـ APIs مع تطبيقات الجوال ومتاجر التجارة الإلكترونية وبحيرات البيانات.',
      },
      icon: '/icons/solutions/crm-platform-engineering.svg',
      diagramType: 'crm-braze-salesforce-mesh',
      highlights: {
        en: [
          'Braze Web & Mobile SDK (iOS & Android) Custom Event Tracking',
          'Salesforce Marketing Cloud Data Extensions & Journey Builder Setup',
          'Reverse ETL Integration with Snowflake, BigQuery & Redshift',
        ],
        ar: [
          'تضمين حزم Braze SDK للموقع والتطبيقات وتتبع الأحداث المخصصة',
          'بناء Data Extensions ومسارات Journey Builder في Salesforce',
          'ربط Reverse ETL مباشر مع مستودعات Snowflake وBigQuery',
        ],
      },
    },
    {
      slug: 'customer-segmentation-rfm-modeling',
      tag: {
        en: 'Audience Intelligence',
        ar: 'التقسيم الذكي ونماذج RFM',
      },
      title: {
        en: 'Customer Segmentation & Predictive RFM Modeling',
        ar: 'تقسيم العملاء ونماذج RFM التنبؤية للسلوك الشرائي',
      },
      description: {
        en: 'Create dynamic, self-updating audience cohorts using demographic profiles, transaction frequency, SKU affinities, and real-time app in-session events.',
        ar: 'إنشاء شرائح جماهيرية ذكية ذاتية التحديث بالاعتماد على البيانات الشخصية، وسجل المعاملات، وتفضيلات المنتجات، وسلوك التفاعل الفوري بالتطبيق.',
      },
      icon: '/icons/solutions/crm-rfm-segmentation.svg',
      diagramType: 'crm-rfm-cohort-matrix',
      highlights: {
        en: [
          'Dynamic RFM Matrix (Recency, Frequency, Monetary) Clustering',
          'High-Value VIP Cohort Identification & White-Glove Sequences',
          'Predictive Propensity-to-Buy Scoring via Machine Learning',
        ],
        ar: [
          'تقسيم عنقودي ديناميكي بنموذج RFM (حداثة، وتكرار، وقيمة الشراء)',
          'تحديد كبار العملاء (VIPs) وتخصيص تجارب حصرية رفيعة المستوى لهم',
          'احتساب احتمالية الشراء المستقبلية بالاعتماد على خوارزميات التعلم الآلي',
        ],
      },
    },
    {
      slug: 'omnichannel-journey-automation',
      tag: {
        en: 'Omnichannel Dispatch',
        ar: 'أتمتة القنوات المتعددة',
      },
      title: {
        en: 'Omnichannel Journey Automation (Email, WhatsApp, Push & SMS)',
        ar: 'أتمتة الرحلات متعددة القنوات (الإيميل، والواتساب، والإشعارات، وSMS)',
      },
      description: {
        en: 'Build unified multi-channel Canvas workflows that guide customers seamlessly across email, official WhatsApp Business API, rich app push, in-app cards, and SMS.',
        ar: 'تصميم مسارات Canvas مؤتمتة وموحدة توجه العملاء بسلاسة عبر البريد الإلكتروني، وواتساب للأعمال، وإشعارات التطبيق الغنية، ورسائل الـ SMS.',
      },
      icon: '/icons/solutions/crm-omnichannel-dispatch.svg',
      diagramType: 'crm-omnichannel-trigger-flow',
      highlights: {
        en: [
          'Official Meta WhatsApp Business Cloud API Interactive Messages',
          'Sub-Second Real-Time Push Notifications with Liquid Personalization',
          'Cross-Channel Fallback Logic (Push -> WhatsApp -> Email -> SMS)',
        ],
        ar: [
          'رسائل تفاعلية عبر واجهة واتساب للأعمال السحابية الرسمية من Meta',
          'إشعارات لحظية مخصصة بنصوص Liquid تصل في أجزاء من الثانية',
          'منطق التبديل التلقائي بين القنوات لضمان تسليم الرسالة بأقل تكلفة',
        ],
      },
    },
    {
      slug: 'campaign-operations-multivariate-testing',
      tag: {
        en: 'Operations & Testing',
        ar: 'إدارة الحملات واختبارات A/B',
      },
      title: {
        en: 'Campaign Operations, A/B Testing & Production QA',
        ar: 'إدارة الحملات التشغيلية واختبارات A/B والتدقيق الشامل',
      },
      description: {
        en: 'End-to-end campaign execution from dynamic template coding to multivariate copy/creative A/B testing, Send-Time Optimization (STO), and cross-device QA.',
        ar: 'تنفيذ احترافي متكامل للحملات من برمجة القوالب الديناميكية إلى اختبارات A/B متعددة المتغيرات، وتوقيت الإرسال الأمثل (STO)، وفحص التوافق عبر الأجهزة.',
      },
      icon: '/icons/solutions/crm-campaign-operations.svg',
      diagramType: 'crm-ab-testing-switch',
      highlights: {
        en: [
          'AI-Powered Send-Time Optimization (STO) per Individual User',
          'Multivariate Subject Line, Creative & CTA Statistical A/B Testing',
          'Rigorous Cross-Client Rendering QA on iOS, Android & Desktop',
        ],
        ar: [
          'توقيت الإرسال الأمثل بالذكاء الاصطناعي (STO) لكل مستخدم على حدة',
          'اختبارات A/B دقيقة لعناوين الرسائل والتصاميم والدعوة لاتخاذ إجراء',
          'فحص شامل ومكثف لظهور القوالب بدقة على iOS وأندرويد وأجهزة الكمبيوتر',
        ],
      },
    },
    {
      slug: 'crm-migration-data-hygiene',
      tag: {
        en: 'Migration & Privacy',
        ar: 'نقل البيانات وحوكمة الخصوصية',
      },
      title: {
        en: 'Zero-Downtime CRM Migration & First-Party Data Hygiene',
        ar: 'نقل أنظمة CRM دون انقطاع وتطهير بيانات الطرف الأول',
      },
      description: {
        en: 'Seamlessly migrate customer history, automated journeys, and consent records from legacy tools to Braze or Salesforce while safeguarding domain deliverability.',
        ar: 'نقل آمن وسلس لسجلات العملاء والرحلات المؤتمتة وبيانات الموافقة من الأنظمة القديمة إلى Braze أو Salesforce مع حماية سمعة النطاق وقابلية الوصول.',
      },
      icon: '/icons/solutions/crm-data-hygiene.svg',
      diagramType: 'crm-identity-hygiene-vault',
      highlights: {
        en: [
          'Parallel Zero-Downtime Migration Framework with Dedicated IP Warming',
          'Historical Data Hygiene, Hard Bounce Pruning & Suppression Sync',
          'Strict Compliance with Saudi PDPL & UAE Personal Data Protection Laws',
        ],
        ar: [
          'منهجية نقل متوازية بلا توقف مع تسخين احترافي لعنوان الـ IP المخصص',
          'تنقية وتطهير البيانات التاريخية، واستبعاد العناوين المرتدة وحظرها',
          'امتثال كامل لنظام حماية البيانات الشخصية السعودي (PDPL) وقوانين الإمارات',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Siloed Customer Data Drains Budgets; Intelligent Lifecycle CRM Drives 480% ROI',
      ar: 'بيانات العملاء المعزولة تهدر الميزانيات؛ ومنظومة CRM الذكية تحقق عائداً يصل إلى 480%',
    },
    text: {
      en: 'In an era where digital ad costs (CAC) continue to escalate, treating your existing customer base with generic, blast communications is catastrophic. Disconnected customer databases, irrelevant mass marketing emails, and disjointed channel touchpoints alienate buyers and inflate unsubscribes. Modern CRM management connects your entire customer lifecycle—combining real-time behavioral data, automated multi-channel messaging, and predictive intelligence to build enduring emotional bonds and turn everyday interactions into compounding lifetime value.',
      ar: 'في عصر تتصاعد فيه تكاليف استقطاب العملاء الجدد (CAC) باستمرار، فإن التعامل مع قاعدة عملائك الحالية برسائل جماعية عامة يمثل خطأ استراتيجياً فادحاً. إن تشتت قواعد البيانات، والرسائل الترويجية العشوائية، وغياب التنسيق بين القنوات يؤدي إلى نفور العملاء وارتفاع معدلات إلغاء الاشتراك. تربط إدارة علاقات العملاء الحديثة دورة حياة العميل بالكامل—دامجة البيانات السلوكية الفورية، والأتمتة متعددة القنوات، والذكاء التنبؤي لبناء علاقات وجدانية متينة ومضاعفة القيمة الدائمة للعملاء.',
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85',
    metric1Val: 'Up to 480%',
    metric1Label: {
      en: 'Measurable Enterprise Marketing ROI Lift',
      ar: 'ارتفاع مثبت في عائد الاستثمار التسويقي للمؤسسات',
    },
    metric2Val: '+62%',
    metric2Label: {
      en: 'Increase in 90-Day Repeat Purchase Retention',
      ar: 'زيادة في معدل تكرار الشراء واحتفاظ العملاء لـ 90 يوماً',
    },
  },

  benefitsStrip: {
    title: {
      en: 'Strategic CRM Outcomes That Maximize Revenue & Accelerate Retention',
      ar: 'نتائج استراتيجية ملموسة تعظم الإيرادات وتسرع نمو ولاء العملاء',
    },
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=85',
    benefits: [
      {
        title: {
          en: 'Up to 480% Proven ROI via Event-Driven Behavioral Automation',
          ar: 'عائد استثماري يصل إلى 480% عبر الأتمتة الموجهة بالسلوك اللحظي',
        },
        description: {
          en: 'Replacing generic batch-and-blast marketing with real-time contextual triggers yields dramatic increases in conversion velocity and revenue per recipient.',
          ar: 'استبدال الرسائل الجماعية العشوائية بمحفزات سياقية فورية مبنية على تصرفات العميل يحقق قفزات كبرى في معدلات التحويل والإيراد لكل عميل.',
        },
      },
      {
        title: {
          en: 'Sub-Second Omnichannel Dispatch (WhatsApp, Push, Email & SMS)',
          ar: 'إرسال لحظي في أجزاء من الثانية عبر الواتساب والإشعارات والإيميل',
        },
        description: {
          en: 'Deliver automated personalized messages across the customer’s preferred channel the instant they abandon a cart, browse a category, or complete a milestone.',
          ar: 'إيصال رسائل مخصصة عبر القناة المفضلة للعميل في اللحظة نفسها التي يترك فيها السلة، أو يتصفح قسماً، أو يكمل معاملة مالية.',
        },
      },
      {
        title: {
          en: '99.7% Primary Inbox Deliverability with Dedicated IP Warming',
          ar: 'معدل وصول لصندوق الوارد بنسبة 99.7% عبر تسخين الـ IP المخصص',
        },
        description: {
          en: 'Zero-drop migration frameworks, SPF/DKIM/DMARC authentication, and algorithmic list hygiene keep your communications in front of active buyers.',
          ar: 'أطر انتقال محكمة، وتوثيق صارم لمعايير SPF وDKIM وDMARC، وتنقية مستمرة للقوائم تضمن وصول رسائلك إلى صندوق الوارد وتفادي مجلد الرسائل غير المرغوب فيها.',
        },
      },
      {
        title: {
          en: '100% Sovereign Privacy Compliance with Saudi PDPL & UAE Laws',
          ar: 'امتثال سيادي بنسبة 100% لنظام حماية البيانات السعودي ولوائح الإمارات',
        },
        description: {
          en: 'Built-in consent management, localized regional data governance, and automated opt-out synchronization protect your brand and eliminate regulatory penalties.',
          ar: 'إدارة متكاملة لموافقات المستخدمين، وحوكمة إقليمية للبيانات، ومزامنة فورية لطلبات إلغاء الاشتراك تحمي علامتك التجارية وتمنع الغرامات التنظيمية.',
        },
      },
    ],
  },

  verticalsTitle: {
    en: 'Mission-Critical Lifecycle CRM Architectures by Industry',
    ar: 'معماريات CRM مخصصة ومصممة لأبرز القطاعات',
  },
  verticalsSubtitle: {
    en: 'Bespoke CRM and customer engagement architectures configured for the unique behavioral patterns, compliance standards, and transaction cycles of leading GCC industries.',
    ar: 'معماريات لإدارة علاقات العملاء مصممة خصيصاً لتلائم الأنماط السلوكية، ومعايير الامتثال، ودورات الشراء في مختلف القطاعات الرائدة بالخليج.',
  },
  verticals: [
    {
      id: 'luxury-fashion-omnichannel-retail',
      number: '01',
      title: {
        en: 'Luxury Fashion & Omnichannel Department Retail',
        ar: 'الأزياء الفاخرة والتجزئة متعددة القنوات والمتاجر الكبرى',
      },
      description: {
        en: 'VIP clienteling integration, high-value tier milestone journeys, real-time in-store sales associate assistance, and replenishment triggers for luxury cosmetics.',
        ar: 'تكامل أدوات خدمة كبار العملاء (Clienteling)، ورحلات الترقية للشركات الحصرية، وتنبيهات فورية للبائعين في الفروع، وتذكيرات إعادة شراء العطور ومستحضرات التجميل.',
      },
      tag: {
        en: 'Luxury & Fashion Retail',
        ar: 'التجزئة الفاخرة والأزياء',
      },
      capabilities: {
        en: [
          'In-store point-of-sale customer profile sync with Braze Canvas',
          'Private concierge WhatsApp Business outreach for VIP collections',
          'Predictive replenishment reminders based on historical product usage',
        ],
        ar: [
          'ربط ملفات العملاء بنقاط البيع بالفروع مع مسارات Braze Canvas',
          'تواصل شخصي حصري عبر واتساب للأعمال لمجموعات الأزياء الخاصة',
          'تذكيرات تنبؤية ذكية لإعادة طلب المنتجات بناءً على وتيرة الاستهلاك',
        ],
      },
    },
    {
      id: 'banking-fintech-wealth-management',
      number: '02',
      title: {
        en: 'Banking, Neobanks, Fintech & Wealth Management',
        ar: 'القطاع المصرفي والبنوك الرقمية والتقنية المالية وإدارة الثروات',
      },
      description: {
        en: 'KYC onboarding acceleration, transactional security push alerts, salary transfer incentives, credit card activation nudges, and SAMA-compliant communication vaults.',
        ar: 'تسريع فتح الحسابات والتحقق من الهوية (KYC)، وإشعارات الأمان اللحظية، ومحفزات تحويل الراتب وتفعيل البطاقات الائتمانية مع امتثال تام لضوابط البنك المركزي.',
      },
      tag: {
        en: 'Fintech & Digital Banking',
        ar: 'المصارف والتقنية المالية',
      },
      capabilities: {
        en: [
          'Encrypted transactional push notifications with bi-directional verification',
          'Automated drop-off recovery for digital account opening funnels',
          'Segmented investment portfolio updates and WealthTech alerts',
        ],
        ar: [
          'إشعارات مشفرة للمعاملات المصرفية مع إمكانية التأكيد ثنائي الاتجاه',
          'استعادة المتعثرين في مراحل فتح الحساب البنكي الرقمي آلياً',
          'تحديثات مخصصة للمحافظ الاستثمارية وتنبيهات الأسواق للمستثمرين',
        ],
      },
    },
    {
      id: 'on-demand-superapps-food-delivery',
      number: '03',
      title: {
        en: 'On-Demand Delivery, Quick Commerce & Super-Apps',
        ar: 'تطبيقات التوصيل السريع والتجارة الفورية والتطبيقات الشاملة',
      },
      description: {
        en: 'Sub-minute contextual push triggers, gamified loyalty punch cards, live driver delivery tracking in-app messaging, and dynamic mealtime craving campaigns.',
        ar: 'إشعارات سياقية في أقل من دقيقة، وبطاقات ولاء تفاعلية مبتكرة، وتتبع مباشر للطلب عبر رسائل التطبيق، وحملات ديناميكية متزامنة مع أوقات الوجبات.',
      },
      tag: {
        en: 'Quick Commerce & Apps',
        ar: 'التطبيقات والتجارة السريعة',
      },
      capabilities: {
        en: [
          'Weather and live traffic-triggered hot meal promo notifications',
          'Gamified recurring order streaks with instant reward badges',
          'Geo-fenced push delivery alerts when courier arrives at perimeter',
        ],
        ar: [
          'إشعارات ترويجية للوجبات مرتبطة بحالة الطقس والازدحام المروري',
          'سلاسل طلبات تحفيزية وألعاب ولاء تمنح مكافآت فورية ومباشرة',
          'تنبيهات وصول السائق بالنطاق الجغرافي الدقيق للعميل',
        ],
      },
    },
    {
      id: 'aviation-travel-hospitality-clubs',
      number: '04',
      title: {
        en: 'Aviation, Premium Travel & Hospitality Loyalty',
        ar: 'الطيران والسفر الفاخر والفنادق وبرامج الولاء السياحية',
      },
      description: {
        en: 'Pre-flight WhatsApp boarding passes, seat upgrade bidding sequences, personalized destination itinerary guides, and tiered frequent-flyer tier progression campaigns.',
        ar: 'إصدار بطاقات الصعود عبر الواتساب قبل الرحلة، وعروض ترقية المقاعد، وأدلة السفر المخصصة، وحملات الترقية لبرامج ولاء المسافرين الدائمين.',
      },
      tag: {
        en: 'Aviation & Hospitality',
        ar: 'الطيران والضيافة',
      },
      capabilities: {
        en: [
          'Automated WhatsApp flight status updates and gate change alerts',
          'Last-minute premium class seat bidding push notifications',
          'Hotel room stay preference collection and post-checkout NPS surveys',
        ],
        ar: [
          'تحديثات حالة الرحلات وتغيير البوابات آلياً عبر تطبيق واتساب',
          'إشعارات عروض المزايدة على ترقية مقاعد درجة الأعمال في اللحظات الأخيرة',
          'استطلاع تفضيلات الإقامة الفندقية واستبيانات الرضا المؤتمتة بعد المغادرة',
        ],
      },
    },
    {
      id: 'healthcare-wellness-telemedicine',
      number: '05',
      title: {
        en: 'Healthcare, Telemedicine & Wellness Clinics',
        ar: 'الرعاية الصحية والطب الاتصالي ومراكز العافية والعيادات',
      },
      description: {
        en: 'Automated clinic appointment reminders, prescription refill nudges, post-procedure recovery check-ins, and health insurance claim status updates.',
        ar: 'تذكيرات مؤتمتة بمواعيد العيادات، وتنبيهات إعادة صرف الأدوية، ومتابعة ما بعد العمليات، وتحديثات حالة مطالبات التأمين الطبي بكل خصوصية.',
      },
      tag: {
        en: 'HealthTech & Clinics',
        ar: 'الرعاية الصحية والعيادات',
      },
      capabilities: {
        en: [
          'HIPAA / Saudi MoH compliant encrypted appointment confirmation',
          'Chronic medication refill reminders with one-click re-ordering',
          'Post-consultation doctor feedback and care plan compliance tracking',
        ],
        ar: [
          'تأكيد مواعيد الكشف الطبي بتشفير كامل مطابق لاشتراطات وزارة الصحة',
          'تذكيرات إعادة تعبئة أدوية الأمراض المزمنة بضغطة زر واحدة',
          'متابعة التزام المريض بالخطة العلاجية واستبيان رأيه بعد الاستشارة',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'Production-Grade Enterprise CRM Tech Stack',
    ar: 'المنظومة التقنية لإدارة علاقات العملاء المؤسسية',
  },
  techStackSubtitle: {
    en: 'Integrated with premier enterprise engagement suites, high-throughput cloud messaging gateways, and real-time reverse ETL pipelines.',
    ar: 'متكاملة مع أرقى منصات تفاعل العملاء العالمية، وبوابات الرسائل السحابية فائقة السرعة، ومسارات نقل البيانات الفورية.',
  },
  techStackPods: [
    {
      title: {
        en: 'Customer Engagement & CRM Platforms',
        ar: 'منصات تفاعل وإدارة علاقات العملاء',
      },
      badge: {
        en: 'Core Platforms',
        ar: 'المنصات الأساسية',
      },
      description: {
        en: 'Industry-leading cloud platforms engineered for real-time customer data unification, visual journey orchestration, and predictive intelligence.',
        ar: 'منصات سحابية رائدة مصممة لتوحيد بيانات العملاء اللحظية، وتصميم رحلات التفاعل المرئية، وتشغيل الذكاء الاصطناعي التنبؤي.',
      },
      technologies: [
        { name: 'Braze', category: 'Omnichannel Customer Engagement', badge: 'Certified' },
        { name: 'Salesforce Marketing Cloud', category: 'Enterprise Journey Builder', badge: 'Tier 1' },
        { name: 'Klaviyo', category: 'eCommerce Lifecycle Marketing', badge: 'Elite' },
        { name: 'HubSpot Enterprise', category: 'Inbound CRM & Pipeline Sync' },
        { name: 'Customer.io', category: 'Automated Product-Led Messaging' },
      ],
    },
    {
      title: {
        en: 'Omnichannel Messaging Gateways & APIs',
        ar: 'بوابات الرسائل والتواصل متعدد القنوات',
      },
      badge: {
        en: 'Messaging Gateways',
        ar: 'بوابات الإرسال',
      },
      description: {
        en: 'Direct telecommunication and messaging APIs supporting rich interactive content, sub-second delivery, and global carrier fallbacks.',
        ar: 'واجهات برمجة مباشرة لشبكات الاتصالات تدعم المحتوى التفاعلي الغني، والتسليم في أجزاء من الثانية، والتبديل التلقائي بين المشغلين.',
      },
      technologies: [
        { name: 'Meta WhatsApp Cloud API', category: 'Official WhatsApp Business', badge: 'Official BSP' },
        { name: 'Infobip & Twilio', category: 'Global SMS & Voice Gateways' },
        { name: 'Apple APNs & Firebase FCM', category: 'Mobile Push Notifications' },
        { name: 'Sinch / Unifonic', category: 'Regional GCC Telco Routing' },
        { name: 'SendGrid / SparkPost', category: 'High-Volume Transactional Email' },
      ],
    },
    {
      title: {
        en: 'Modern Data Stack & Reverse ETL Pipelines',
        ar: 'منظومة البيانات الحديثة ومسارات Reverse ETL',
      },
      badge: {
        en: 'Data & CDP',
        ar: 'البيانات والـ CDP',
      },
      description: {
        en: 'Zero-copy data integration feeding warehouse models, customer identity graphs, and behavioral event streams straight into CRM campaign engines.',
        ar: 'ربط لحظي ينقل نماذج مستودعات البيانات، وسجلات الهوية الموحدة، وأحداث السلوك مباشرة إلى محركات حملات الـ CRM دون تأخير.',
      },
      technologies: [
        { name: 'Snowflake & BigQuery', category: 'Cloud Data Warehouse Core' },
        { name: 'Hightouch & Census', category: 'Reverse ETL Warehouse Activation', badge: 'Sync' },
        { name: 'Twilio Segment / mParticle', category: 'Customer Data Platform (CDP)' },
        { name: 'Mixpanel & Amplitude', category: 'Product Analytics & Cohorts' },
        { name: 'PostgreSQL & Redis', category: 'Sub-Second Profile Caching' },
      ],
    },
    {
      title: {
        en: 'Deliverability, Dynamic Rendering & QA Suites',
        ar: 'قابلية الوصول وفحص القوالب وتدقيق الجودة',
      },
      badge: {
        en: 'Deliverability & QA',
        ar: 'الوصول والجودة',
      },
      description: {
        en: 'Specialized tooling ensuring 99.7%+ inbox placement, dedicated IP reputation protection, dark-mode compatibility, and cross-client rendering perfection.',
        ar: 'أدوات متخصصة تضمن وصول الرسائل لصندوق الوارد بنسبة +99.7%، وحماية سمعة الـ IP، وتوافق القوالب مع الوضع الداكن وكافة الأجهزة.',
      },
      technologies: [
        { name: 'Litmus & Email on Acid', category: 'Cross-Device Rendering QA', badge: 'Pixel-Perfect' },
        { name: 'Validity 250ok', category: 'Deliverability & Reputation Monitoring' },
        { name: 'Liquid Scripting Engine', category: 'Dynamic Real-Time Personalization' },
        { name: 'Google Postmaster Tools', category: 'Domain Reputation Telemetry' },
        { name: 'BIMI & VMC Certificates', category: 'Verified Brand In-Inbox Logos' },
      ],
    },
  ],

  clientStories: getCrmManagementFeaturedClientStories(),

  delivery: {
    title: {
      en: 'How We Deliver Differently: Our 4 CRM Execution Pillars',
      ar: 'كيف نبتكر تسويقياً بشكل مختلف: ركائزنا الأربع لإدارة علاقات العملاء',
    },
    subtitle: {
      en: 'A battle-tested methodology that replaces manual campaign blasting with automated, data-driven lifecycle orchestration built for compounding returns.',
      ar: 'منهجية مثبتة تستبدل الإرسال اليدوي العشوائي بأتمتة ذكية متكاملة لدورة حياة العميل تحقق عوائد تراكمية مستدامة.',
    },
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85',
    pillars: [
      {
        title: {
          en: 'Data Layer Auditing & Reverse ETL Identity Binding',
          ar: 'تدقيق طبقة البيانات وتوحيد الهوية عبر Reverse ETL',
        },
        description: {
          en: 'We eliminate data latency by connecting your single source of truth (Snowflake, BigQuery) directly to Braze and Salesforce, ensuring customer attributes and event states reflect in under 60 seconds.',
          ar: 'نقضي على بطء البيانات من خلال ربط مستودع بياناتك المركزي مباشرة بمنصات Braze وSalesforce، مما يضمن تحديث سمات وسلوكيات العميل في أقل من 60 ثانية.',
        },
      },
      {
        title: {
          en: 'Lifecycle Canvas Architecture & Behavioral Trigger Blueprinting',
          ar: 'معمارية مسارات Canvas وتصميم المحفزات السلوكية اللحظية',
        },
        description: {
          en: 'We map every critical conversion moment—from abandoned browse to multi-tier loyalty upgrades—into event-driven Canvases with smart frequency capping, preventing message fatigue.',
          ar: 'نرسم كل لحظة تحويل حاسمة—من التصفح المتروك إلى الترقيات في برنامج الولاء—في مسارات Canvas مرنة مزودة بضوابط لمنع الإرسال المفرط.',
        },
      },
      {
        title: {
          en: 'Continuous Experimentation & Send-Time Optimization (STO)',
          ar: 'التجارب المستمرة وتوقيت الإرسال الأمثل بالذكاء الاصطناعي (STO)',
        },
        description: {
          en: 'We apply statistical multi-armed bandit testing across subject lines, dynamic liquid templates, and channels, automatically channeling budget and volume into winning variations.',
          ar: 'نطبق اختبارات إحصائية متطورة على عناوين الرسائل والقوالب الديناميكية والقنوات، مع توجيه الحجم آلياً نحو الخيارات التي تحقق أعلى تفاعل.',
        },
      },
      {
        title: {
          en: 'Embedded Co-Pilot Operations & Internal Team Enablement',
          ar: 'تشغيل تضامني ونقل كامل للمعرفة لتمكين فريقك الداخلي',
        },
        description: {
          en: 'We don’t just build and leave. Our certified CRM architects co-engineer campaigns with your internal marketers, providing recorded standard operating procedures (SOPs) and hands-on enablement.',
          ar: 'لا نكتفي بالبناء والمغادرة، بل يعمل خبراؤنا المعتمدون جنباً إلى جنب مع فريقك التسويقي الداخلي، مع تقديم أدلة تشغيل موثقة وورش عمل تطبيقية تضمن استقلاليتهم الكاملة.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'modern-crm-playbook-braze-roi',
      slug: 'modern-crm-playbook-braze-roi',
      type: 'insight',
      badge: {
        en: 'Lifecycle Playbook',
        ar: 'دليل دورة الحياة',
      },
      title: {
        en: 'The Modern CRM Playbook: Unlocking 480% ROI with Braze Canvas and Behavioral Triggers',
        ar: 'دليل CRM الحديث: كيف تحقق عائداً بنسبة 480% باستخدام Braze Canvas والمحفزات السلوكية',
      },
      excerpt: {
        en: 'Why static weekly newsletters are failing, and how GCC enterprise brands build event-driven lifecycle automation that compounds customer lifetime value.',
        ar: 'لماذا لم تعد النشرات البريدية الأسبوعية التقليدية مجدية، وكيف تبني كبرى العلامات بالمنطقة أتمتة سلوكية لحظية تضاعف القيمة الدائمة للعملاء.',
      },
      date: '2026-03-06',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      href: '/insights/modern-crm-playbook-braze-roi',
    },
    {
      id: 'whatsapp-business-api-gcc-omnichannel',
      slug: 'whatsapp-business-api-gcc-omnichannel',
      type: 'insight',
      badge: {
        en: 'Messaging Architecture',
        ar: 'معمارية الرسائل الفورية',
      },
      title: {
        en: 'WhatsApp Business API vs Traditional SMS: The GCC Omnichannel Revolution',
        ar: 'واتساب للأعمال مقابل الرسائل النصية القصيرة: ثورة التواصل التفاعلي في الخليج',
      },
      excerpt: {
        en: 'How to implement official Meta WhatsApp Cloud API with multi-agent routing, catalog checkouts, and 98% open rates without risking spam penalties.',
        ar: 'كيفية ربط واجهة واتساب الرسمية مع الفِرق المتعددة، وميزات الشراء من المحادثة، وتحقيق معدلات فتح تفوق 98% دون حظر الحسابات.',
      },
      date: '2026-02-26',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      href: '/insights/whatsapp-business-api-gcc-omnichannel',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici completely modernized our customer lifecycle engine. Migrating from our legacy ESP to Braze and activating WhatsApp Business API transformed our business. Within 90 days, our cart abandonment recovery jumped by 240% and our repeat purchase frequency doubled. Their mastery of data extensions, liquid personalization, and dedicated IP deliverability is unmatched in the region.',
      ar: 'أعادت بيرسيكي تحديث وتطوير منظومة دورة حياة العميل لدينا بالكامل. إن انتقالنا من المنصة القديمة إلى Braze وتفعيل واتساب للأعمال أحدث نقلة نوعية في نتائجنا. وخلال 90 يوماً فقط، قفزت نسبة استعادة السلات المتروكة بمقدار 240% وتضاعف معدل تكرار الشراء. إن تمكنهم من حوكمة البيانات، والتخصيص المتقدم، وضمان وصول الرسائل لا يضاهى في المنطقة.',
    },
    author: 'Laila Al-Khatib',
    role: {
      en: 'Vice President of Growth & CRM, Al-Rawabi Retail & eCommerce Group',
      ar: 'نائب الرئيس للنمو وإدارة علاقات العملاء، مجموعة الروابي للتجزئة',
    },
    badge: {
      en: 'Verified Enterprise CRM & Lifecycle Transformation',
      ar: 'تحول معتمد في إدارة علاقات العملاء ودورة الحياة',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions',
    ar: 'الأسئلة الشائعة حول إدارة علاقات العملاء (CRM)',
  },
  faqsSubtitle: {
    en: 'Clear answers on Braze vs Salesforce platform selection, migration timelines, WhatsApp Business API compliance, and dedicated IP warming.',
    ar: 'إجابات واضحة ومباشرة حول المقارنة بين المنصات، وجداول الانتقال، والامتثال في واتساب للأعمال، وتسخين عناوين الـ IP.',
  },
  faqs: [
    {
      question: {
        en: 'How do you help us choose between Braze, Salesforce Marketing Cloud, and Klaviyo?',
        ar: 'كيف تساعدوننا في الاختيار الأمثل بين Braze وSalesforce Marketing Cloud وKlaviyo؟',
      },
      answer: {
        en: 'We evaluate your primary channels, product ecosystem, and engineering maturity. For digital-first brands with native mobile apps requiring sub-second cross-channel push, in-app messaging, and event streaming, Braze is unmatched. For global conglomerates with deep legacy enterprise sales cycles and complex CRM hierarchies, Salesforce Marketing Cloud provides deep native CRM hooks. For pure-play Shopify Plus and ecommerce brands, Klaviyo offers the fastest time-to-value.',
        ar: 'نقوم بتقييم قنواتك الأساسية، وطبيعة منتجك، ومدى نضج بنيتك التقنية. بالنسبة للعلامات الرقمية التي تمتلك تطبيقات جوال وتحتاج لإرسال إشعارات فورية ورسائل داخل التطبيق بأجزاء من الثانية، فإن Braze هي الخيار الأقوى عالمياً. وللمؤسسات الضخمة التي تعتمد على مسارات بيع معقدة، توفر Salesforce تكاملاً وثيقاً. أما لمتاجر شوبيفاي بلس والتجارة الإلكترونية، فإن Klaviyo توفر أسرع وقت لتحقيق العوائد.',
      },
    },
    {
      question: {
        en: 'How do you execute a zero-downtime CRM migration without damaging sender reputation?',
        ar: 'كيف تنفذون الانتقال إلى منصة CRM جديدة دون أي انقطاع ودون الإضرار بسمعة الإرسال؟',
      },
      answer: {
        en: 'We execute a phased, parallel IP-warming framework over 3 to 4 weeks. We clean and segment your legacy lists (pruning hard bounces and long-term inactives), configure SPF, DKIM, and DMARC authentication on dedicated sending IPs, and gradually shift high-engagement trigger volumes (like password resets and welcome journeys) before scaling mass broadcasts. This guarantees zero deliverability degradation.',
        ar: 'نطبق منهجية انتقال متوازية وتدريجية مع تسخين عنوان الـ IP المخصص على مدار 3 إلى 4 أسابيع. نقوم بتنقية قوائمك القديمة واستبعاد العناوين الخاملة، وضبط إعدادات التوثيق (SPF وDKIM وDMARC)، ونقل رسائل التفاعل العالي (مثل رسائل الترحيب وتأكيد الطلبات) تدريجياً قبل بدء الحملات الكبرى، مما يضمن وصول الرسائل لصندوق الوارد بنسبة 100%.',
      },
    },
    {
      question: {
        en: 'How does WhatsApp Business API integrate into our automated CRM journeys?',
        ar: 'كيف يتم ربط واجهة واتساب للأعمال (WhatsApp Business API) بمسارات الـ CRM المؤتمتة؟',
      },
      answer: {
        en: 'We register your brand as an official Meta Verified WhatsApp Business Account (WABA), pre-approve HSM message templates for utility and marketing categories, and configure webhooks directly into Braze Canvas or Salesforce Journey Builder. Customers can receive interactive carousels, click-to-chat bot responses, or be routed to human customer care agents seamlessly.',
        ar: 'نقوم بتسجيل علامتك التجارية كحساب واتساب رسمي موثق من Meta (WABA)، واعتماد قوالب الرسائل التفاعلية والترويجية مسبقاً، وربطها مباشرة بمسارات Braze Canvas أو Salesforce. ويتمكن العملاء من استلام عروض تفاعلية، والشراء مباشرة من المحادثة، أو التحويل التلقائي لفريق خدمة العملاء البشري بكل سلاسة.',
      },
    },
    {
      question: {
        en: 'What is Reverse ETL and why is it essential for modern CRM performance?',
        ar: 'ما هي تقنية Reverse ETL ولماذا تعتبر ضرورية للغاية لنجاح منظومة الـ CRM؟',
      },
      answer: {
        en: 'Reverse ETL continuously syncs computed customer attributes—such as predicted LTV, RFM scores, churn risk, and product affinities calculated in your cloud data warehouse (Snowflake, BigQuery)—directly into your CRM platform in real time. This ensures your marketing team can build sophisticated cohorts without relying on engineers to write custom database exports.',
        ar: 'تقنية Reverse ETL هي عملية مزامنة لحظية مستمرة لسمات وبيانات العملاء المحسوبة—مثل القيمة الدائمة المتوقعة، ودرجات RFM، واحتمالية التسرب المحسوبة في مستودع بياناتك (Snowflake أو BigQuery)—مباشرة إلى منصة الـ CRM. هذا يُمكّن فريق التسويق من بناء شرائح استهداف متقدمة فورياً دون الحاجة للاعتماد على المبرمجين لاستخراج الملفات.',
      },
    },
    {
      question: {
        en: 'Is customer data processed through your CRM architectures compliant with Saudi PDPL?',
        ar: 'هل تتوافق معالجة بيانات العملاء عبر معمارياتكم مع نظام حماية البيانات الشخصية السعودي (PDPL)؟',
      },
      answer: {
        en: 'Yes. All our CRM and marketing data architectures strictly follow the Saudi Personal Data Protection Law (PDPL) and UAE regulations. We implement explicit opt-in capture mechanisms, localized data residency configurations, automated consumer data deletion/export workflows, and granular communication consent ledgers across all touchpoints.',
        ar: 'نعم بكل تأكيد وبأعلى درجات الالتزام. تتوافق كافة حلولنا مع نظام حماية البيانات الشخصية السعودي (PDPL) وقوانين حماية البيانات في الإمارات. نطبق آليات دقيقة لتسجيل الموافقة الصريحة للمستخدمين، وخيارات توطين البيانات، ومسارات مؤتمتة لطلبات حذف وتصدير البيانات وسجلات حظر شاملة تحمي خصوصية العميل.',
      },
    },
    {
      question: {
        en: 'Will our internal marketing team be trained to manage and build journeys independently?',
        ar: 'هل سيتم تدريب وتأهيل فريقنا التسويقي الداخلي لإدارة وبناء الحملات بشكل مستقل؟',
      },
      answer: {
        en: 'Yes. Capability transfer is embedded into every engagement. We provide hands-on cohort workshops, step-by-step video playbooks, template modular design kits, and co-piloted launch sprints. By project completion, your internal team has complete confidence and full autonomy to launch, test, and optimize new journeys.',
        ar: 'نعم بالتأكيد، فنقل المعرفة جزء أساسي من كل مشروع ننفذه. نقدم ورش عمل تطبيقية ومكثفة، وأدلة فيديو خطوة بخطوة، ونظام قوالب تصميم نمطية، ودورات إطلاق مشتركة. وبحلول موعد التسليم النهائي، يكون فريقك الداخلي مؤهلاً بالكامل لإنشاء واختبار وتطوير الحملات الجديدة بكل احترافية واستقلالية.',
      },
    },
  ],
};
