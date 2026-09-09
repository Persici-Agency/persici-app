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

export interface PublicSectorOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface PublicSectorVerticalItem {
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

export interface PublicSectorData {
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
  offerings: PublicSectorOfferingItem[];
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
  verticals: PublicSectorVerticalItem[];
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

export const publicSectorData: PublicSectorData = {
  hero: {
    tag: {
      en: 'Industry Practice',
      ar: 'قطاع الممارسات الصناعية',
    },
    secondaryTag: {
      en: 'Public Sector & Government',
      ar: 'القطاع الحكومي والمؤسسات العامة',
    },
    title: {
      en: 'Human-Centered Digital Government & Sovereign Infrastructure',
      ar: 'خدمات حكومية رقمية متمحورة حول المواطن وبنية تحتية سيادية',
    },
    subtitle: {
      en: 'Transform the way citizens, residents, and enterprises experience public services. We deliver zero-trust security, sovereign cloud data meshes, and unified life-event digital portals for regional government entities.',
      ar: 'إحداث نقلة نوعية في تجربة المواطنين والمقيمين وقطاع الأعمال للخدمات العامة. نقدم حلول أمان انعدام الثقة (Zero-Trust)، وشبكات بيانات سحابية سيادية، وبوابات موحدة لرحلات الحياة الرقمية للجهات الحكومية.',
    },
    ctaText: {
      en: 'Consult Public Sector Architects',
      ar: 'استشر خبراء القطاع الحكومي',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1400&q=85',
    highlights: [
      {
        en: 'Unified Citizen Life-Event Portals & Proactive Service Delivery',
        ar: 'بوابات موحدة لرحلات حياة المواطن وتقديم الخدمات الاستباقية المؤتمتة',
      },
      {
        en: 'Sovereign In-Country Cloud & Zero-Trust Cybersecurity Compliance',
        ar: 'سحابة سيادية محلية والامتثال الكامل لضوابط الأمن السيبراني (Zero-Trust)',
      },
      {
        en: 'Inter-Agency Data Mesh & Real-Time Ministerial Interoperability',
        ar: 'شبكة بيانات متكاملة بين الجهات الحكومية لتبادل البيانات اللحظي والموثق',
      },
      {
        en: 'Universal Accessibility (WCAG 2.1 AAA) & Sovereign Arabic AI Copilots',
        ar: 'معايير وصول عالمية (WCAG 2.1 AAA) ومساعد ذكاء اصطناعي عربي سيادي',
      },
    ],
  },

  futureStrip: [
    {
      title: {
        en: 'Bureaucratic silos slow citizen services',
        ar: 'العزلة البيروقراطية تبطئ تقديم الخدمات للمواطنين',
      },
      description: {
        en: 'Disconnected ministerial databases force citizens to navigate confusing paper-heavy touchpoints instead of unified digital one-stop portals.',
        ar: 'تجبر قواعد البيانات الوزارية المنفصلة المواطنين على التنقل بين إجراءات معقدة بدلاً من الاستفادة من بوابات موحدة تقدم الخدمات في محطة رقمية واحدة.',
      },
      badge: {
        en: 'Realities of Public Sector 01',
        ar: 'واقع القطاع الحكومي 01',
      },
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Sovereign data security cannot be compromised',
        ar: 'أمن وسيادة البيانات الوطنية خط أحمر غير قابل للتفاوض',
      },
      description: {
        en: 'Public entities must safeguard citizen identity and national registries against advanced cyber threats through strict in-country cloud residency.',
        ar: 'يتحتم على الجهات الحكومية حماية هويات المواطنين والسجلات الوطنية الحيوية من الهجمات السيبرانية عبر استضافة سحابية سيادية محكمة داخل الدولة.',
      },
      badge: {
        en: 'Realities of Public Sector 02',
        ar: 'واقع القطاع الحكومي 02',
      },
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Aging legacy core systems impede modernization',
        ar: 'الأنظمة المركزية المتقادمة تعوق مسيرة التحول الرقمي',
      },
      description: {
        en: 'Decades-old mainframe architectures are brittle and costly to maintain, making rapid civic policy changes difficult to implement.',
        ar: 'تشكل المعماريات المركزية القديمة الموروثة عبئاً مالياً وتشغيلياً ضخماً، وتعيق التطبيق السريع لسياسات وبرامج التحول وتطوير الخدمات الوطنية.',
      },
      badge: {
        en: 'Realities of Public Sector 03',
        ar: 'واقع القطاع الحكومي 03',
      },
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Accessibility & digital inclusion are mandatory',
        ar: 'الشمول الرقمي وسهولة الوصول متطلب إلزامي لكافة الفئات',
      },
      description: {
        en: 'Every public digital touchpoint must guarantee universal accessibility across age groups, abilities, and regional languages without barrier.',
        ar: 'يجب أن تضمن المنصات الحكومية الرقمية سهولة الاستخدام لكافة فئات المجتمع، بما في ذلك كبار السن وذوي الإعاقة وبمختلف اللغات دون عوائق تقنية.',
      },
      badge: {
        en: 'Realities of Public Sector 04',
        ar: 'واقع القطاع الحكومي 04',
      },
      image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85',
    },
  ],

  agileFoundation: {
    title: {
      en: 'An Agile Foundation for the Public Sector',
      ar: 'الأساس الهندسي المرن للقطاع الحكومي',
    },
    subtitle: {
      en: 'Bridging siloed ministries, legacy civil databases, and multi-channel citizen touchpoints into a unified, secure civic experience framework.',
      ar: 'ربط الوزارات المنفصلة وقواعد البيانات المدنية القديمة ونقاط التواصل مع المواطنين في إطار عمل حكومي موحد وآمن وعالي الكفاءة.',
    },
    diagramBadge: {
      en: 'Sovereign Civic Architecture',
      ar: 'المعمارية الحكومية السيادية',
    },
    pillars: [
      {
        number: '01',
        title: {
          en: 'Secure Inter-Agency Data Mesh',
          ar: 'شبكة تبادل البيانات الحكومية الآمنة',
        },
        description: {
          en: 'Standardized REST and GraphQL data exchange nodes connecting civil registries, municipal records, and commercial licensing with complete audit logging.',
          ar: 'عقد تبادل بيانات معيارية تربط السجلات المدنية، والبلديات، والتراخيص التجارية مع توثيق أمني شامل لجميع العمليات.',
        },
      },
      {
        number: '02',
        title: {
          en: 'Zero-Trust Identity Verification',
          ar: 'التحقق من الهوية الرقمية بانعدام الثقة',
        },
        description: {
          en: 'National digital identity federation with biometric liveness checks, role-based access control (RBAC), and sovereign single sign-on (SSO).',
          ar: 'ربط الهوية الرقمية الوطنية بالتحقق الحيوي (Biometric)، والصلاحيات المعتمدة على الأدوار، وتسجيل الدخول الموحد لجميع المنصات.',
        },
      },
      {
        number: '03',
        title: {
          en: 'Accessible Universal Experience Tier',
          ar: 'واجهات رقمية شاملة وسهلة الوصول',
        },
        description: {
          en: 'Bilingual Arabic-first UI engineered to WCAG 2.1 AAA accessibility guidelines, ensuring seamless engagement for all demographics and seniors.',
          ar: 'واجهات تفاعلية عربية بالكامل مصممة وفق معايير إتاحة الوصول العالمية (WCAG 2.1 AAA) لضمان سهولة الاستخدام لكبار السن وذوي الإعاقة.',
        },
      },
    ],
  },

  offeringsTitle: {
    en: 'Core Public Sector Capabilities',
    ar: 'القدرات الهندسية للجهات الحكومية',
  },
  offeringsSubtitle: {
    en: 'Hardened, sovereign digital solutions engineered to elevate citizen satisfaction and optimize administrative expenditure.',
    ar: 'حلول رقمية سيادية محكمة مصممة لرفع رضا المواطنين، وتعزيز الكفاءة التشغيلية، وترشيد الإنفاق الحكومي.',
  },
  offerings: [
    {
      slug: 'sovereign-cloud-zero-trust',
      tag: { en: 'Sovereign Cloud', ar: 'السحابة السيادية' },
      title: { en: 'Sovereign Cloud & Zero-Trust Security', ar: 'السحابة السيادية وأمان انعدام الثقة' },
      description: {
        en: 'Deploy containerized public services in localized, air-gapped sovereign clouds complying with national cybersecurity guidelines and strict data residency.',
        ar: 'نشر الخدمات العامة على سحب سيادية معزولة محلياً، متوافقة مع متطلبات الهيئة الوطنية للأمن السيبراني وضوابط توطين البيانات الصارمة.',
      },
      icon: 'TbShieldCheck',
      diagramType: 'cyber-shield-lock',
      highlights: {
        en: [
          'In-Country Data Residency & Sovereign Encryption Keys',
          'Zero-Trust Architecture (ZTA) & Micro-Segmentation',
          'Continuous Automated Vulnerability & Penetration Audits',
          'NCA ECC / CSCC National Cybersecurity Compliance',
        ],
        ar: [
          'توطين البيانات محلياً وإدارة مفاتيح التشفير السيادية',
          'معمارية انعدام الثقة (ZTA) والتقسيم الأمني الشبكي الدقيق',
          'فحص آلي مستمر للثغرات واختبارات الاختراق الدورية',
          'امتثال كامل لضوابط الأمن السيبراني الأساسية (ECC/CSCC)',
        ],
      },
    },
    {
      slug: 'smart-city-citizen-portals',
      tag: { en: 'Civic Portals', ar: 'البوابات المدنية والمدن الذكية' },
      title: { en: 'Smart City Portals & Life-Event Journeys', ar: 'بوابات المدن الذكية ورحلات محطات الحياة' },
      description: {
        en: 'Unified web and mobile citizen experience layer consolidating municipal services, permit approvals, and civic notifications into one intuitive interface.',
        ar: 'بوابة موحدة للمواطنين عبر الويب وتطبيقات الجوال تدمج الخدمات البلدية وتراخيص البناء والإشعارات الحكومية في واجهة سلسة.',
      },
      icon: 'TbSmartHome',
      diagramType: 'compass-spatial-reticle',
      highlights: {
        en: [
          'Unified Citizen Profile & Dynamic Status Dashboards',
          'Sub-Second Municipal Permit Approval Automation',
          'Push Notifications via SMS, WhatsApp & Government App',
          'Multilingual Accessibility Compliant with WCAG 2.1 AAA',
        ],
        ar: [
          'ملف موحد للمواطن ولوحة متابعة لحظية لحالة المعاملات',
          'أتمتة إصدار التراخيص البلدية والشهادات في ثوانٍ',
          'إشعارات فورية عبر الرسائل والواتساب والتطبيق الموحد',
          'واجهات متوافقة مع أعلى معايير إتاحة الاستخدام العالمية',
        ],
      },
    },
    {
      slug: 'inter-agency-data-mesh',
      tag: { en: 'Data Integration', ar: 'تكامل البيانات والربط البيني' },
      title: { en: 'Inter-Agency Data Mesh & Integration', ar: 'منظومة تكامل البيانات بين الجهات الحكومية' },
      description: {
        en: 'Decouple departmental silos with an enterprise data mesh and high-throughput event streaming, allowing real-time inter-ministerial data verification.',
        ar: 'القضاء على جزر البيانات المنعزلة عبر شبكة بيانات مؤسسية وبث للأحداث الفورية، لتمكين التحقق اللحظي بين مختلف الوزارات والهيئات.',
      },
      icon: 'TbNetwork',
      diagramType: 'de-event-streaming-bus',
      highlights: {
        en: [
          'Event-Driven Ministerial Messaging with Apache Kafka',
          'Cryptographically Signed Inter-Agency API Gateways',
          'Granular Role-Based Data Access & Audit Telemetry',
          'Automated Record Reconciliation & Deduplication',
        ],
        ar: [
          'تبادل بيانات الوزارات عبر مسارات Apache Kafka الفورية',
          'بوابات واجهات برمجة موقعة رقمياً ومحمية بالتشفير',
          'صلاحيات تدقيق دقيقة بحسب الاختصاص وتتبع مسار العمليات',
          'مطابقة آلية للسجلات ومنع تكرار القيود بين الهيئات',
        ],
      },
    },
    {
      slug: 'digital-identity-verification',
      tag: { en: 'Digital Identity', ar: 'الهوية الرقمية والتوثيق' },
      title: { en: 'Digital Identity & Biometric Verification', ar: 'الهوية الرقمية والتحقق الحيوي الموثوق' },
      description: {
        en: 'Seamless integration with national digital identity systems, supporting biometric liveness checks, digital signatures, and instant authorization.',
        ar: 'ربط مباشر مع منصات الهوية الرقمية الوطنية المعتمدة، مع دعم التحقق الحيوي بالوجه، والتوقيع الرقمي، والتفويض الإلكتروني الفوري.',
      },
      icon: 'TbFingerprint',
      diagramType: 'triad-mesh',
      highlights: {
        en: [
          'National ID & Nafath / UAE Pass API Integration',
          'Biometric Liveness Detection & Anti-Spoofing AI',
          'Cryptographic Digital Signature Generation',
          'Delegated Corporate & Legal Guardianship Authority',
        ],
        ar: [
          'تكامل فوري مع نفاذ، والهوية الرقمية، و UAE Pass',
          'التحقق من حيوية الوجه ومكافحة التزييف بالذكاء الاصطناعي',
          'إصدار التواقيع الرقمية المشفرة المعتمدة قانونياً',
          'إدارة التفويضات النظامية والوكالات الشرعية إلكترونياً',
        ],
      },
    },
    {
      slug: 'modernized-administrative-systems',
      tag: { en: 'Modernization', ar: 'تحديث الأنظمة الإدارية' },
      title: { en: 'Modernized Civil Administration Systems', ar: 'تحديث المنظومات الإدارية والمعاملات المدنية' },
      description: {
        en: 'Decompose legacy departmental mainframes into cloud-native workflow engines, eliminating back-office paper processes and accelerating cycle times.',
        ar: 'تحديث الأنظمة الإدارية القديمة إلى محركات سير عمل سحابية مرنة، للقضاء التام على المعاملات الورقية واختصار زمن الإنجاز.',
      },
      icon: 'TbBuildingColumns',
      diagramType: 'nested-squares',
      highlights: {
        en: [
          'BPMN 2.0 Automated Administrative Workflow Orchestration',
          'Paperless Document Archival with OCR Intelligence',
          'Dynamic Forms Engine with Real-Time Validation',
          'Comprehensive SLA Tracking & Ministerial Bottleneck Alerts',
        ],
        ar: [
          'أتمتة مسارات المعاملات الإدارية بمعايير BPMN 2.0',
          'أرشفة إلكترونية ذكية خالية من الورق مع التعرف على النصوص',
          'محرك نماذج تفاعلي ذكي للتحقق من البيانات تلقائياً',
          'متابعة دقيقة لاتفاقيات مستوى الخدمة وتنبيهات التأخير',
        ],
      },
    },
    {
      slug: 'emergency-response-telematics',
      tag: { en: 'Public Safety', ar: 'السلامة العامة والطوارئ' },
      title: { en: 'Crisis Command & Emergency Telematics Hub', ar: 'مركز قيادة الأزمات وإدارة الطوارئ الذكية' },
      description: {
        en: 'Equip civil defense and emergency response agencies with real-time geospatial incident tracking, automated fleet routing, and crisis notification broadcasting.',
        ar: 'تزويد أجهزة الدفاع المدني والطوارئ بمنظومة تتبع مكاني لحظي للحوادث، وتوجيه ذكي للأساطيل، وبث تحذيرات الأزمات الفورية للمواطنين.',
      },
      icon: 'TbHeartHandshake',
      diagramType: 'concentric-nodes',
      highlights: {
        en: [
          'Real-Time GIS Incident Mapping & Heatmaps',
          'Automated First-Responder Fleet Dispatch Routing',
          'Geo-Targeted Emergency Alert Broadcasting (SMS & Cell)',
          'Inter-Agency Disaster Coordination War-Room Portals',
        ],
        ar: [
          'خرائط تفاعلية لحظية لتوزيع الحوادث والبلاغات الجغرافية',
          'توجيه آلي ذكي لمركبات الإسعاف والدفاع المدني لموقع البلاغ',
          'بث تنبيهات الطوارئ للمناطق الجغرافية المتأثرة مباشرة',
          'بوابات غرف عمليات مشتركة للتنسيق أثناء الأزمات والكوارث',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Building Next-Generation Citizen Trust',
      ar: 'بناء جسور الثقة مع المواطنين في العصر الرقمي',
    },
    text: {
      en: 'Citizen expectations for public services have been irreversibly reshaped by consumer technology. Today, residents expect governmental interactions to be as intuitive, fast, and accessible as ordering on an app. Siloed bureaucratic agencies, fragmented legacy databases, and paper documentation create frustration and inflate operational overhead. Persici partners with ministries and regional authorities to engineer human-centered civic ecosystems that safeguard national data sovereignty while delivering seamless, world-class citizen experiences.',
      ar: 'أعادت التكنولوجيا الاستهلاكية صياغة توقعات المواطنين تجاه الخدمات الحكومية. يتوقع المواطن والمقيم اليوم أن تكون معاملاته الحكومية بنفس السلاسة والسرعة التي يختبرها في التطبيقات الحديثة. إن البيروقراطية المجزأة والأنظمة القديمة تسبب هدر الوقت وتكبد ميزانيات ضخمة. تتشارك بيرسيكي مع الوزارات والهيئات الحكومية لهندسة منظومات رقمية تتمحور حول الإنسان، وتحمي السيادة الرقمية للبيانات، وتقدم خدمات مدنية بمقاييس عالمية رائدة.',
    },
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=85',
  },

  benefitsStrip: {
    title: {
      en: 'Strategic Outcomes for Government Authorities',
      ar: 'المكتسبات الاستراتيجية للجهات والمؤسسات الحكومية',
    },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    benefits: [
      {
        title: { en: 'Frictionless Citizen Journeys', ar: 'رحلات مواطنين سلسة ومؤتمتة' },
        description: {
          en: 'Compress service turnaround times from days to seconds, elevating national citizen satisfaction metrics to international top-tier benchmarks.',
          ar: 'تقليص وقت إنجاز المعاملات من أيام إلى ثوانٍ معدودة، مما يرفع مؤشرات رضا المواطنين للمراتب العالمية الأولى.',
        },
      },
      {
        title: { en: 'Sovereign In-Country Security', ar: 'أمان سيادي محلي متكامل' },
        description: {
          en: 'Ensure 100% of sensitive civil data and telemetry remains within national sovereign borders, fortified by zero-trust encryption.',
          ar: 'ضمان بقاء 100% من البيانات الحكومية الحساسة داخل الحدود الوطنية، محصنة بأعلى درجات التشفير السيادي.',
        },
      },
      {
        title: { en: 'Cross-Entity Interoperability', ar: 'تكامل كامل بين الهيئات والوزارات' },
        description: {
          en: 'Eliminate manual inter-ministerial correspondence through automated data mesh verification, saving thousands of operational man-hours.',
          ar: 'إلغاء المراسلات اليدوية بين الجهات عبر التحقق الآلي من البيانات، مما يوفر آلاف الساعات التشغيلية سنوياً.',
        },
      },
      {
        title: { en: 'Paperless Fiscal Efficiency', ar: 'كفاءة مالية وبيئة حكومية خالية من الورق' },
        description: {
          en: 'Achieve complete digital transformation that drastically lowers paper, printing, and administrative overhead across all municipal offices.',
          ar: 'تحقيق تحول رقمي شامل يخفض تكاليف الطباعة والمستندات الورقية والعبء الإداري في جميع الفروع والمكاتب.',
        },
      },
    ],
  },

  verticalsTitle: {
    en: 'Government Verticals We Modernize',
    ar: 'القطاعات الحكومية التي نقود تحولها',
  },
  verticalsSubtitle: {
    en: 'Customized platforms addressing the distinct security, regulatory, and civic mandates of specific governmental domains.',
    ar: 'منصات مخصصة تلبي المتطلبات الأمنية والتنظيمية والخدمية لمختلف القطاعات الحكومية والمؤسسات العامة.',
  },
  verticals: [
    {
      id: 'federal-agencies',
      number: '01',
      title: { en: 'Ministries & Central Authorities', ar: 'الوزارات والهيئات الاتحادية والمركزية' },
      tag: { en: 'National Portals', ar: 'البوابات الوطنية الموحدة' },
      description: {
        en: 'Architecting national unified services portals, policy analytics platforms, and automated inter-ministerial approvals for federal government entities.',
        ar: 'هندسة بوابات الخدمات الوطنية الموحدة، ومنصات تحليلات السياسات العامة، ومسارات الموافقات المؤتمتة بين الوزارات الاتحادية.',
      },
      capabilities: {
        en: [
          'Unified National Life-Event Service Orchestration',
          'Real-Time Ministerial KPI Dashboards & Decision Support',
          'Sovereign Inter-Entity Workflow Automation',
          'Strict National Data Residency & Compliance Auditing',
        ],
        ar: [
          'إدارة رحلات الخدمات الوطنية الاستباقية للمواطنين',
          'لوحات مؤشرات أداء لحظية لدعم اتخاذ القرارات الوزارية',
          'أتمتة سير المعاملات بين الجهات الحكومية بسيادة تامة',
          'تدقيق امتثال توطين البيانات وفق الأنظمة الوطنية',
        ],
      },
    },
    {
      id: 'smart-cities',
      number: '02',
      title: { en: 'Municipalities & Smart Cities', ar: 'أمانات المناطق والبلديات والمدن الذكية' },
      tag: { en: 'Urban Operations', ar: 'إدارة العمليات الحضرية' },
      description: {
        en: 'Deploying digital building permits, urban GIS mapping, waste management telemetry, and public parking booking for progressive municipalities.',
        ar: 'نشر منصات التراخيص الإنشائية الرقمية، والخرائط الحضرية الجغرافية، ومستشعرات إدارة النفايات، والمواقف الذكية للأمانات والبلديات.',
      },
      capabilities: {
        en: [
          'Automated Building Permit & Zoning Review Engines',
          'Smart Waste Telemetry & Dynamic Route Optimization',
          'Digital Municipal Asset & Facility Maintenance Hub',
          'Citizen Complaint Ticketing with Geo-Location Tracking',
        ],
        ar: [
          'محركات أوتوماتيكية لفحص المخططات وتراخيص البناء',
          'مستشعرات ذكية لإدارة النفايات وتوجيه مسارات النظافة',
          'منصة موحدة لإدارة وصيانة الأصول والمرافق البلدية',
          'استقبال ومتابعة بلاغات المواطنين المرتبطة بالموقع الجغرافي',
        ],
      },
    },
    {
      id: 'public-safety',
      number: '03',
      title: { en: 'Public Safety, Security & Crisis Management', ar: 'السلامة العامة والدفاع المدني وإدارة الأزمات' },
      tag: { en: 'Emergency Command', ar: 'مراكز قيادة الطوارئ' },
      description: {
        en: 'Empowering civil defense and emergency authorities with unified dispatch software, real-time drone reconnaissance feeds, and automated crisis alert broadcasts.',
        ar: 'تمكين أجهزة الدفاع المدني والطوارئ ببرمجيات التوجيه الموحدة، وبث طائرات الاستطلاع المسيرة اللحظي، وأنظمة التحذير المبكر في الأزمات.',
      },
      capabilities: {
        en: [
          'Multi-Agency Emergency Command & Dispatch (CAD)',
          'Real-Time Live Video Drone Feeds & Heatmap Overlays',
          'Cell-Broadcast Emergency Notification Infrastructure',
          'Incident Risk Modeling & Evacuation Simulation',
        ],
        ar: [
          'أنظمة توجيه واستجابة طوارئ موحدة مشتركة بين الهيئات',
          'بث حي وتراكب حراري من طائرات الدرون لموقع الحوادث',
          'بث تنبيهات الطوارئ العاجلة عبر البث الخلوي للأجهزة',
          'نمذجة مخاطر الكوارث ومحاكاة خطط الإخلاء الذكية',
        ],
      },
    },
    {
      id: 'judicial-services',
      number: '04',
      title: { en: 'Judicial, Courts & Legal Services', ar: 'القطاع العدلي والمحاكم والخدمات القانونية' },
      tag: { en: 'Digital Justice', ar: 'العدالة الرقمية' },
      description: {
        en: 'Digitizing the entire court process from electronic lawsuit filing to remote video hearings, automated case distribution, and digital notarization.',
        ar: 'أتمتة منظومة المحاكم بالكامل من رفع الدعاوى إلكترونياً، وجلسات التقاضي عن بُعد، والتوزيع الآلي للقضايا، والتوثيق العدلي الرقمي.',
      },
      capabilities: {
        en: [
          'Electronic Lawsuit Ingestion & Automated Case Docketing',
          'Encrypted Remote Judicial Video Hearing Rooms',
          'Digital Power of Attorney & Property Deed Notarization',
          'Smart Judicial Workflow & Enforceable Order Generation',
        ],
        ar: [
          'قيد الدعاوى القضائية الإلكتروني وجدولة الجلسات آلياً',
          'غرف تقاضي مرئية مشفرة وموثوقة للجلسات القضائية عن بُعد',
          'إصدار الوكالات الشرعية وتوثيق الصكوك العقارية إلكترونياً',
          'إصدار أوامر التنفيذ القضائية ومتابعة سريانها برمجياً',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'Public Sector Technical Infrastructure',
    ar: 'البنية التقنية للقطاع الحكومي',
  },
  techStackSubtitle: {
    en: 'Hardened, sovereign infrastructure certified for national security compliance, zero-trust perimeter defense, and seamless high availability.',
    ar: 'بنية تحتية سيادية محكمة ومعتمدة تلبي معايير الأمن الوطني، وحماية انعدام الثقة، والجاهزية العالية بنسبة 99.999%.',
  },
  techStackPods: [
    {
      title: { en: 'Sovereign Government Cloud', ar: 'السحابة الحكومية السيادية' },
      badge: { en: 'Sovereign Infra', ar: 'البنية السيادية' },
      description: {
        en: 'Air-gapped and localized government cloud infrastructure keeping all citizen data resident within national physical boundaries.',
        ar: 'بنية تحتية سحابية معزولة ومحلية تضمن بقاء جميع بيانات وسجلات المواطنين داخل الحدود الوطنية للدولة.',
      },
      technologies: [
        { name: 'Oracle Cloud Gov', category: 'Dedicated Regions', badge: 'Tier-4' },
        { name: 'AWS Dedicated Cloud', category: 'Air-Gapped Sovereign', badge: 'Certified' },
        { name: 'STC / National Cloud', category: 'In-Country Local Cloud', badge: 'Class-A' },
        { name: 'Red Hat Enterprise', category: 'Sovereign OS & K8s', badge: 'Hardened' },
      ],
    },
    {
      title: { en: 'Zero-Trust Security & Identity', ar: 'أمان انعدام الثقة والهوية الوطنية' },
      badge: { en: 'Security Tier', ar: 'طبقة الأمن والحماية' },
      description: {
        en: 'Strict cryptographic identity verification and hardware security modules (HSM) enforcing least-privilege administrative access.',
        ar: 'تحقق مشفر صارم من الهوية وأجهزة أمان مادية (HSM) تفرض صلاحيات الوصول بالحد الأدنى لكافة الموظفين.',
      },
      technologies: [
        { name: 'Keycloak / Nafath SSO', category: 'National Identity Federation', badge: 'eID' },
        { name: 'HashiCorp Vault', category: 'Sovereign Secrets & KMS', badge: 'FIPS 140-2' },
        { name: 'SailPoint Identity', category: 'Role Governance & RBAC', badge: 'Enterprise' },
        { name: 'Palo Alto Prisma', category: 'Zero-Trust Network Access', badge: 'ZTNA' },
      ],
    },
    {
      title: { en: 'Inter-Agency Data Mesh', ar: 'منظومة تكامل البيانات بين الجهات' },
      badge: { en: 'Integration Tier', ar: 'طبقة الربط الحكومي' },
      description: {
        en: 'High-throughput secure API gateways and event streaming buses enabling verifiable data exchange between ministerial databases.',
        ar: 'بوابات واجهات برمجة آمنة ومسارات بث أحداث عالية السرعة تتيح تبادل البيانات الموثق بين قواعد بيانات الوزارات.',
      },
      technologies: [
        { name: 'Kong Enterprise', category: 'Federated API Gateway', badge: 'mTLS' },
        { name: 'Apache Kafka', category: 'Event Streaming Backbone', badge: 'Sub-10ms' },
        { name: 'MuleSoft AnyPoint', category: 'Legacy Systems Adapter', badge: 'Certified' },
        { name: 'GraphQL Mesh', category: 'Federated Query Gateway', badge: 'Unified' },
      ],
    },
    {
      title: { en: 'Accessible Citizen Frontend', ar: 'واجهات المواطنين سهلة الوصول' },
      badge: { en: 'Experience Tier', ar: 'طبقة تجربة المستخدم' },
      description: {
        en: 'Sub-second, accessible web and mobile platforms built to national accessibility standards and bilingual Arabic typography.',
        ar: 'منصات ويب وجوال فائقة السرعة مصممة وفق معايير الإتاحة الوطنية مع دعم كامل للخطوط العربية الراقية.',
      },
      technologies: [
        { name: 'Next.js 15', category: 'Modern Web Architecture', badge: 'SSR / Edge' },
        { name: 'Tailwind CSS', category: 'WCAG AAA Design System', badge: 'Accessible' },
        { name: 'Strapi / Drupal Core', category: 'Enterprise Headless CMS', badge: 'Content' },
        { name: 'Playwright', category: 'Automated Accessibility Audits', badge: 'CI/CD' },
      ],
    },
  ],

  clientStories: getFeaturedStories(['gulf-enterprise-copilot', 'nissan-mobility', 'finvibe-trading']),

  delivery: {
    title: {
      en: 'Public Sector Transformation Roadmap',
      ar: 'خارطة طريق التحول الرقمي الحكومي',
    },
    subtitle: {
      en: 'A phased governance framework built for public entity compliance, risk mitigation, and visible civic milestone delivery.',
      ar: 'إطار حوكمة مرحلي مصمم لمطابقة اللوائح الحكومية، وإدارة المخاطر، وتحقيق إنجازات ملموسة تعزز خدمة المواطنين.',
    },
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
    pillars: [
      {
        title: {
          en: 'Regulatory Alignment & Security Clearance',
          ar: 'المطابقة التنظيمية والتصريح الأمني',
        },
        description: {
          en: 'Audit existing citizen data flows against national cybersecurity authority controls, data classification laws, and privacy frameworks.',
          ar: 'تدقيق مسارات بيانات المواطنين الحالية للتأكد من مطابقتها لضوابط الأمن السيبراني ولوائح تصنيف البيانات والخصوصية الوطنية.',
        },
      },
      {
        title: {
          en: 'Sovereign Architecture & Identity Integration',
          ar: 'بناء المعمارية السيادية والربط مع الهوية',
        },
        description: {
          en: 'Provision in-country sovereign cloud enclaves and connect national identity federation (Nafath, UAE Pass) for authenticated citizen access.',
          ar: 'تجهيز البيئات السحابية السيادية المحلية وربطها بنظام الهوية الوطنية الموحد (نفاذ / UAE Pass) لتوثيق دخول المواطنين بأمان.',
        },
      },
      {
        title: {
          en: 'Life-Event Service Digitization & Pilot',
          ar: 'رقمنة خدمات محطات الحياة والإطلاق التجريبي',
        },
        description: {
          en: 'Re-architect priority high-impact public services into automated life-event journeys, validating citizen experience with public focus groups.',
          ar: 'إعادة هندسة الخدمات الحكومية ذات الأولوية كرحلات محطات حياة مؤتمتة، واختبار تجربة المستخدم مع مجموعات تركيز من المواطنين.',
        },
      },
      {
        title: {
          en: 'Inter-Agency Expansion & Continuous Governance',
          ar: 'التوسع بين الهيئات والحوكمة المستمرة',
        },
        description: {
          en: 'Scale the data mesh to incorporate adjacent municipal, judicial, and financial entities, establishing permanent observability and SLA monitoring.',
          ar: 'توسيع شبكة البيانات لتشمل الجهات البلدية والعدلية والمالية الشريكة، مع تدشين مراقبة مستمرة للجاهزية ومؤشرات الإنجاز.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'pub-insight-01',
      title: {
        en: 'The Sovereign Government Cloud: Architecting National Data Resilience',
        ar: 'السحابة الحكومية السيادية: هندسة الصمود الوطني وإدارة البيانات',
      },
      excerpt: {
        en: 'How modern public authorities protect sensitive civil data within national boundaries while maintaining cutting-edge cloud agility.',
        ar: 'كيف تحمي الجهات الحكومية الحديثة البيانات المدنية الحساسة داخل الحدود السيادية مع الاستفادة الكاملة من مرونة السحابة المتطورة.',
      },
      badge: {
        en: 'Cloud Sovereignty',
        ar: 'السيادة السحابية',
      },
      slug: 'sovereign-government-cloud-architecture',
      href: '/insights/sovereign-government-cloud-architecture',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      date: '2026-02-15',
    },
    {
      id: 'pub-insight-02',
      title: {
        en: 'Designing Proactive Citizen Portals: The End of Bureaucratic Queues',
        ar: 'تصميم بوابات المواطنين الاستباقية: نهاية الطوابير البيروقراطية',
      },
      excerpt: {
        en: 'A strategic framework for turning reactive departmental paperwork into predictive, automated citizen life-event milestones.',
        ar: 'إطار عمل استراتيجي لتحويل المعاملات الورقية الروتينية إلى محطات حياة استباقية مؤتمتة تقدم للمواطن تلقائياً.',
      },
      badge: {
        en: 'Civic UX',
        ar: 'تجربة المستخدم الحكومية',
      },
      slug: 'designing-proactive-citizen-portals',
      href: '/insights/designing-proactive-citizen-portals',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      date: '2026-01-28',
    },
    {
      id: 'pub-insight-03',
      title: {
        en: 'Inter-Agency Data Mesh: Breaking Down Ministerial Siloes Safely',
        ar: 'شبكة تكامل البيانات بين الجهات: كسر عزلة الوزارات بأمان وموثوقية',
      },
      excerpt: {
        en: 'Evaluating event-driven data streaming patterns that enable ministries to verify records in real time without compromising security.',
        ar: 'تقييم أنماط تدفق البيانات الموجهة بالأحداث التي تتيح للوزارات التحقق من السجلات لحظياً دون المساس بالأمان أو الخصوصية.',
      },
      badge: {
        en: 'Data Governance',
        ar: 'حوكمة البيانات',
      },
      slug: 'inter-agency-data-mesh-playbook',
      href: '/insights/inter-agency-data-mesh-playbook',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      date: '2026-01-10',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici engineered our sovereign municipal services portal and automated permit engine. Our service cycle times dropped from five business days to less than two hours, achieving a 94% citizen satisfaction rating in our annual audit.',
      ar: 'طورت بيرسيكي بوابة خدماتنا البلدية السيادية ومحرك إصدار التراخيص الآلي. انخفض وقت إنجاز المعاملات من خمسة أيام عمل إلى أقل من ساعتين، مع تحقيق نسبة رضا للمواطنين بلغت 94% في التدقيق السنوي.',
    },
    author: 'Eng. Abdulaziz Al-Dosari',
    role: {
      en: 'Director General of Digital Transformation, Regional Municipal Authority',
      ar: 'المدير العام للتحول الرقمي، أمانة منطقة ومؤسسة بلدية كبرى',
    },
    badge: {
      en: 'Verified Public Entity Client',
      ar: 'جهة حكومية موثقة',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions: Public Sector Solutions',
    ar: 'الأسئلة الشائعة: حلول القطاع الحكومي والمؤسسات العامة',
  },
  faqsSubtitle: {
    en: 'Clear answers on national data sovereignty, security clearances, legacy database migration, and citizen accessibility standards.',
    ar: 'إجابات واضحة حول سيادة البيانات الوطنية، والتصاريح الأمنية، وترحيل قواعد البيانات القديمة، ومعايير وصول المواطنين.',
  },
  faqs: [
    {
      question: {
        en: 'How do you guarantee that all citizen and state data remains sovereign within national borders?',
        ar: 'كيف تضمنون بقاء كافة بيانات المواطنين ومعلومات الدولة داخل الحدود السيادية الوطنية؟',
      },
      answer: {
        en: 'Our architectures deploy exclusively onto in-country dedicated sovereign clouds (such as Oracle Dedicated Regions, local AWS GCC regions, or private government datacenters). Data never leaves the geographical territory, encryption keys are held solely by the state entity, and zero external telemetry is transmitted.',
        ar: 'تستضاف حلولنا حصرياً في سحب سيادية محلية مخصصة داخل الدولة (مثل مناطق أوراكل المخصصة أو السحب الحكومية المحلية). لا تغادر البيانات حدود الدولة مطلقاً، وتدار مفاتيح التشفير حصرياً من قبل الجهة الحكومية، مع حظر كامل لنقل أي بيانات تشخيصية للخارج.',
      },
    },
    {
      question: {
        en: 'Are your digital government portals certified for universal accessibility (WCAG 2.1 AAA)?',
        ar: 'هل بواباتكم الحكومية الرقمية معتمدة لمعايير إتاحة الوصول العالمية الشاملة (WCAG 2.1 AAA)؟',
      },
      answer: {
        en: 'Yes. All civic user interfaces are engineered from the ground up for full screen-reader compatibility, high-contrast modes, dynamic text scaling, keyboard navigation, and cognitive simplicity in both Arabic and English, strictly complying with WCAG 2.1 AAA specifications.',
        ar: 'نعم بالتأكيد. تُصمم كافة واجهات المستخدم الحكومية لتتوافق تماماً مع برامج قراءة الشاشة، وأنماط التباين العالي، والتحكم بحجم الخط، والتنقل الكامل بلوحة المفاتيح، والوضوح الإدراكي باللغتين العربية والإنجليزية وفق معايير WCAG 2.1 AAA الصارمة.',
      },
    },
    {
      question: {
        en: 'Can the inter-agency data mesh connect with legacy mainframe systems without replacing them?',
        ar: 'هل يمكن لشبكة البيانات الحكومية التكامل مع الأنظمة المركزية القديمة (Mainframes) دون الحاجة لاستبدالها؟',
      },
      answer: {
        en: 'Yes. We build non-intrusive cryptographic adapters and Change Data Capture (CDC) pipelines that mirror and transform data from legacy IBM/Oracle databases into modern Kafka event streams without imposing additional processing load on legacy systems.',
        ar: 'نعم. نبني موصلات برمجية مشفرة ومسارات التقاط البيانات المتغيرة (CDC) تقوم بنسخ وتحويل البيانات من أنظمة IBM و Oracle القديمة إلى مسارات أحداث Kafka الحديثة لحظياً دون تحميل الأنظمة القائمة أي أعباء تشغيلية إضافية.',
      },
    },
    {
      question: {
        en: 'How does the platform integrate with national identity systems like Nafath or UAE Pass?',
        ar: 'كيف تتكامل المنصة مع أنظمة الهوية الوطنية مثل نفاذ أو UAE Pass؟',
      },
      answer: {
        en: 'We implement certified OpenID Connect (OIDC) federated authentication modules that link directly with national identity APIs. This enables biometric push approvals, zero-password login, and verifiable legal consent in milliseconds.',
        ar: 'نقوم بدمج وحدات مصادقة معيارية معتمدة وفق بروتوكول OpenID Connect ترتبط مباشرة بواجهات برمجة الهوية الوطنية. يتيح ذلك التحقق الفوري عبر البصمة وتأكيد الهوية على الجوال دون كلمات مرور وفي أجزاء من الثانية.',
      },
    },
    {
      question: {
        en: 'What security clearances and governance frameworks do your engineers adhere to?',
        ar: 'ما هي ضوابط الأمن والتصاريح المعمول بها لدى مهندسيكم أثناء تنفيذ المشاريع الحكومية؟',
      },
      answer: {
        en: 'Our public sector engineering teams operate under strict security clearance protocols, utilizing role-based access control, dedicated bastion jump-hosts, automated audit logging, and adherence to national frameworks including NCA ECC, CSCC, and ISO 27001.',
        ar: 'يعمل فريق مهندسينا وفق بروتوكولات تصريح أمني صارمة، مع استخدام بوابات وصول محصنة (Bastion Hosts)، وتسجيل تدقيق رقمي لكل أمر ينفذ، والالتزام الكامل بضوابط الهيئة الوطنية للأمن السيبراني (NCA ECC/CSCC) ومعايير ISO 27001.',
      },
    },
    {
      question: {
        en: 'How do you measure citizen satisfaction and service level performance?',
        ar: 'كيف يتم قياس رضا المواطنين ومتابعة مستوى أداء وسرعة إنجاز الخدمات؟',
      },
      answer: {
        en: 'Our platforms include built-in real-time analytics engines measuring end-to-end transaction velocity, citizen sentiment feedback, and departmental bottlenecks, providing executive leadership with actionable dashboards to continually elevate public service delivery.',
        ar: 'تتضمن منصاتنا محركات تحليلات لحظية مدمجة تقيس سرعة إنجاز المعاملات من البداية للنهاية، وانطباعات ورضا المواطنين بعد الخدمة، ونقاط الاختناق الإداري، مما يزود القيادة بلوحات مؤشرات فورية لتحسين جودة الخدمات باستمرار.',
      },
    },
  ],
};
