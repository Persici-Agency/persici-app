import type {
  SolutionDiagramType,
  FeaturedClientStoryItem,
  SolutionBenefitItem,
  SolutionExecutionPillar,
  SolutionFaqItem,
} from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { getDigitalEngineeringFeaturedClientStories } from '@shared/data';

export interface DigitalEngineeringOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface DigitalEngineeringVerticalItem {
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

export interface DigitalEngineeringData {
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
  offerings: DigitalEngineeringOfferingItem[];
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
  verticals: DigitalEngineeringVerticalItem[];
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

export const digitalEngineeringData: DigitalEngineeringData = {
  hero: {
    tag: {
      en: 'Solutions & Cloud-Native Systems',
      ar: 'الحلول والأنظمة السحابية الأصلية',
    },
    secondaryTag: {
      en: 'Digital Engineering',
      ar: 'الهندسة الرقمية والبرمجيات',
    },
    title: {
      en: 'Mission-Critical Digital Engineering for Resilient, Scalable Enterprise Ecosystems',
      ar: 'هندسة برمجية رقمية متطورة لأنظمة مؤسسية عالية المرونة وقابلة للتوسع الفائق',
    },
    subtitle: {
      en: 'Unlocking innovation and performance through generative AI and cloud-native architecture. We design, engineer, and modernize distributed software systems—transforming brittle legacy monoliths into fault-tolerant, high-throughput microservices, real-time data streaming pipelines, and automated DevOps workflows.',
      ar: 'نطلق آفاق الابتكار والأداء الفائق عبر الذكاء الاصطناعي التوليدي والمعمارية السحابية الأصلية. نقوم بتصميم وتطوير وتحديث الأنظمة البرمجية الموزعة—محولين المنظومات المتجانسة القديمة إلى خدمات مصغرة عالية الصمود ومسارات تدفق بيانات فورية وأتمتة DevOps متكاملة.',
    },
    ctaText: {
      en: 'Request Engineering Architecture Audit',
      ar: 'احجز تدقيق المعمارية البرمجية والهندسية',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85',
    highlights: [
      {
        en: 'Cloud-Native Distributed Microservices & Event Meshes',
        ar: 'خدمات سحابية مصغرة موزعة وشبكات أحداث فورية',
      },
      {
        en: 'High-Throughput Streaming with Apache Kafka & Flink',
        ar: 'تدفق بيانات عالي الإنتاجية عبر Kafka وFlink',
      },
      {
        en: 'Zero-Downtime Strangler Fig Legacy Modernization',
        ar: 'تحديث الأنظمة القديمة بنمط Strangler Fig بلا توقف',
      },
      {
        en: 'Automated Multi-Cloud Infrastructure as Code (IaC)',
        ar: 'بنية تحتية كودية مؤتمتة عبر السحابات المتعددة',
      },
    ],
  },

  offeringsTitle: {
    en: 'Core Digital Engineering Capabilities',
    ar: 'القدرات الهندسية الرقمية الأساسية',
  },
  offeringsSubtitle: {
    en: 'Six specialized disciplines uniting cutting-edge software craft, cloud-native infrastructure, and automated delivery pipelines to build enduring digital engines.',
    ar: 'ستة مسارات تخصصية تدمج البراعة البرمجية الرفيعة بالبنية التحتية السحابية الأصلية وأتمتة التسليم المستمر لبناء محركات رقمية مستدامة.',
  },
  offerings: [
    {
      slug: 'product-software-engineering',
      tag: {
        en: 'Software Craft',
        ar: 'الحلول البرمجية المتطورة',
      },
      title: {
        en: 'Product & Software Engineering',
        ar: 'هندسة المنتجات والبرمجيات المتقدمة',
      },
      description: {
        en: 'Custom full-lifecycle digital product development using Golang, Rust, TypeScript, and modern distributed paradigms for enterprise performance, modularity, and high-velocity shipping.',
        ar: 'تطوير متكامل للمنتجات الرقمية عبر دورة الحياة الكاملة باستخدام Golang وRust وTypeScript وأحدث الأنماط البرمجية الموزعة لتحقيق أعلى سرعة تسليم وأداء مؤسسي.',
      },
      icon: '/icons/solutions/de-product-engineering.svg',
      diagramType: 'de-microservices-mesh',
      highlights: {
        en: [
          'Domain-Driven Design (DDD) & Clean Hexagonal Architecture',
          'Polyglot Microservices with Type-Safe RPC & GraphQL',
          'Autonomous Product Pods with Continuous Deployment',
        ],
        ar: [
          'تصميم قائم على النطاق (DDD) ومعمارية سداسية نظيفة',
          'خدمات مصغرة متعددة اللغات مع Type-Safe RPC وGraphQL',
          'فرق هندسية مستقلة تدعم دورات النشر البرمجي المستمر',
        ],
      },
    },
    {
      slug: 'tech-architecture-strategy',
      tag: {
        en: 'Enterprise Blueprint',
        ar: 'استراتيجية المعمارية التقنية',
      },
      title: {
        en: 'Tech & Enterprise Architecture Strategy',
        ar: 'استراتيجية المعمارية التقنية والمؤسسية',
      },
      description: {
        en: 'Strategic technology governance and scalable systems blueprinting. We align IT investments with commercial objectives, establish decoupled API ecosystems, and enforce sound compliance.',
        ar: 'حوكمة تقنية استراتيجية وتخطيط شامل لمعمارية النظم القابلة للتوسع. نوائم الاستثمارات التقنية مع الأهداف التجارية ونبني بيئات واجهات برمجية مستقلة وآمنة.',
      },
      icon: '/icons/solutions/de-tech-strategy.svg',
      diagramType: 'de-api-gateway-router',
      highlights: {
        en: [
          'Enterprise API Gateway & Federated Service Catalog',
          'Cost, Scalability & Regulatory Governance Assessments',
          'Technology Evaluation & Vendor-Agnostic Stack Selection',
        ],
        ar: [
          'بوابات API مؤسسية ودليل خدمات موحد ومترابط',
          'تقييمات دورية للتكاليف، وقابلية التوسع، والامتثال التنظيمي',
          'مفاضلة حيادية واختيار دقيق لأحدث المنظومات التقنية',
        ],
      },
    },
    {
      slug: 'cloud-infrastructure-kubernetes',
      tag: {
        en: 'Cloud-Native Platform',
        ar: 'المنصات السحابية وكوبرنيتس',
      },
      title: {
        en: 'Multi-Cloud Infrastructure & Kubernetes',
        ar: 'البنية التحتية متعددة السحابات وحاويات Kubernetes',
      },
      description: {
        en: 'Production-ready cloud foundation across AWS, Azure, and Google Cloud with hardened Kubernetes clusters, Istio service mesh, autoscaling pods, and sovereign data perimeter boundaries.',
        ar: 'بنية سحابية مؤسسية جاهزة للإنتاج عبر AWS وAzure وGCP مع مجموعات Kubernetes مؤمنة، وشبكة خدمات Istio، وتوسع تلقائي، وحدود سيادية صارمة للبيانات.',
      },
      icon: '/icons/solutions/de-cloud-architecture.svg',
      diagramType: 'de-cloud-cluster-orbit',
      highlights: {
        en: [
          'Hardened EKS, AKS, & GKE Enterprise Cluster Orchestration',
          'Istio Service Mesh with Mutual TLS (mTLS) Encryption',
          'Multi-Region Active-Active High Availability & Failover',
        ],
        ar: [
          'إدارة متقدمة لمجموعات EKS وAKS وGKE المؤسسية',
          'شبكة خدمات Istio بتشفير ثنائي الاتجاه (mTLS)',
          'توفر فائق ونشط عبر مناطق جغرافية متعددة ومراكز بيانات متباعدة',
        ],
      },
    },
    {
      slug: 'data-ai-event-streaming',
      tag: {
        en: 'Real-Time Streaming',
        ar: 'تدفق البيانات اللحظي والذكاء الاصطناعي',
      },
      title: {
        en: 'Distributed Data & Real-Time Event Streaming',
        ar: 'معالجة البيانات الموزعة وتدفق الأحداث اللحظي',
      },
      description: {
        en: 'Sub-second event-driven data fabrics engineered with Apache Kafka, Apache Flink, and distributed state stores to power predictive intelligence, fraud mitigation, and live telemetry.',
        ar: 'شبكات بيانات فورية قائمة على تدفق الأحداث بأجزاء من الثانية عبر Kafka وFlink ومخازن الحالة الموزعة لتشغيل الذكاء التنبؤي ومكافحة الاحتيال والقياس اللحظي.',
      },
      icon: '/icons/solutions/de-data-ai-systems.svg',
      diagramType: 'de-event-streaming-bus',
      highlights: {
        en: [
          'High-Throughput Kafka Partitioning & Schema Registry',
          'Stateful Complex Event Processing (CEP) with Apache Flink',
          'Real-Time Lakehouse Integration with Apache Iceberg & ClickHouse',
        ],
        ar: [
          'تقسيم وتوزيع عالي الإنتاجية عبر Kafka مع سجل المخططات',
          'معالجة أحداث معقدة ومتكاملة الحالة عبر Apache Flink',
          'ربط لحظي مع مستودعات Lakehouse عبر Iceberg وClickHouse',
        ],
      },
    },
    {
      slug: 'devops-iac-automation',
      tag: {
        en: 'DevSecOps & Delivery',
        ar: 'أتمتة DevOps والبنية ككود',
      },
      title: {
        en: 'DevOps, IaC & CI/CD Pipelines',
        ar: 'أتمتة DevOps، والبنية التحتية ككود، وخطوط CI/CD',
      },
      description: {
        en: 'Eliminate delivery bottlenecks with automated GitOps workflows, Terraform-driven Infrastructure as Code, continuous security scanning (SAST/DAST), and automated canary deployments.',
        ar: 'القضاء على اختناقات النشر عبر مسارات GitOps المؤتمتة، والبنية التحتية ككود عبر Terraform، والفحص الأمني المستمر، واستراتيجيات النشر التدريجي (Canary).',
      },
      icon: '/icons/solutions/de-devops-automation.svg',
      diagramType: 'de-cicd-pipeline-flow',
      highlights: {
        en: [
          'Zero-Downtime Blue/Green & Canary Progressive Releases',
          'Modular Terraform & OpenTofu Enterprise Modules',
          'Integrated Shift-Left DevSecOps Security Gateways',
        ],
        ar: [
          'إصدارات برمجية تدريجية (Canary & Blue/Green) دون انقطاع',
          'وحدات برمجية نمطية للبنية ككود عبر Terraform وOpenTofu',
          'بوابات فحص أمني استباقية مدمجة في مسار التطوير',
        ],
      },
    },
    {
      slug: 'legacy-modernization-deconstruction',
      tag: {
        en: 'Systems Evolution',
        ar: 'تحديث وتفكيك الأنظمة القديمة',
      },
      title: {
        en: 'Legacy Modernization & Microservices Deconstruction',
        ar: 'تحديث الأنظمة المتجانسة وتفكيكها إلى خدمات مصغرة',
      },
      description: {
        en: 'Systematically deconstruct tightly coupled monolithic architectures using the Strangler Fig pattern, database refactoring, and asynchronous messaging—guaranteeing 100% operational continuity.',
        ar: 'تفكيك منهجي للأنظمة المتجانسة المتشابكة باستخدام نمط خنق التين (Strangler Fig) وتطوير قواعد البيانات والاتصال غير المتزامن مع ضمان استمرارية الأعمال بنسبة 100%.',
      },
      icon: '/icons/solutions/de-legacy-modernization.svg',
      diagramType: 'de-resilience-failover',
      highlights: {
        en: [
          'Zero-Downtime Database Sharding & Change Data Capture (CDC)',
          'Strangler Fig Microservice Extraction & Proxy Layering',
          'Legacy API Facades & Anti-Corruption Layer (ACL) Shields',
        ],
        ar: [
          'تقسيم قواعد البيانات والتقاط التغييرات (CDC) بلا توقف للخدمة',
          'استخراج تدريجي للخدمات المصغرة مع طبقات التوجيه الذكية',
          'واجهات برمجية وسيطة وطبقات عزل لحماية المنظومة الحديثة',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Modern Business Demands Systems That Never Fail and Never Slow Down',
      ar: 'بيئة الأعمال الحديثة تتطلب أنظمة لا تتعطل أبداً ولا تتباطأ تحت الضغط',
    },
    text: {
      en: 'In an era where digital services drive enterprise valuation, technical debt and fragile monolithic architectures represent existential risks. Cloud sprawl, tightly coupled codebases, and manual deployment cycles stifle innovation, introduce catastrophic outages, and drain IT budgets. Digital engineering is the foundation that transforms technology from an operational bottleneck into a compounding competitive advantage.',
      ar: 'في عصر تقود فيه الخدمات الرقمية القيمة السوقية للمؤسسات، يشكل التراكم التقني والأنظمة المتجانسة الهشة خطراً وجودياً حقيقياً. إن تشتت الموارد السحابية، والشيفرات البرمجية المتشابكة، ودورات النشر اليدوية تعيق الابتكار، وتسبب انقطاعات مكلفة، وتستنزف الميزانيات. الهندسة الرقمية هي الأساس الذي يحول التقنية من عائق تشغيلي إلى ميزة تنافسية مضاعفة ومستدامة.',
    },
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
    metric1Val: '99.999%',
    metric1Label: {
      en: 'Target High-Availability Uptime',
      ar: 'مستوى جاهزية وتوفر الخدمة المستهدف',
    },
    metric2Val: '10x',
    metric2Label: {
      en: 'Faster Feature Deployment Velocity',
      ar: 'مضاعفة سرعة إطلاق المزايا والخدمات',
    },
  },

  benefitsStrip: {
    title: {
      en: 'Engineering Outcomes That Drive Enterprise Velocity & Resilience',
      ar: 'نتائج هندسية ملموسة تعزز سرعة المؤسسة وصمودها الرقمي',
    },
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=85',
    benefits: [
      {
        title: {
          en: '99.999% High Availability & Fault Tolerance',
          ar: 'توفر فائق بنسبة 99.999% وصمود استثنائي أمام الأعطال',
        },
        description: {
          en: 'Self-healing Kubernetes clusters, distributed caching, circuit-breaker patterns, and multi-region failover protocols ensure uninterrupted digital operations under peak load.',
          ar: 'مجموعات كوبرنيتس ذاتية المعالجة، وتخزين مؤقت موزع، وأنماط قواطع الدوائر (Circuit Breakers)، وتبديل فوري بين المناطق يضمن استمرار العمل تحت أقصى ضغط.',
        },
      },
      {
        title: {
          en: '10x Faster Release Cadence & Time-to-Market',
          ar: 'تسريع وتيرة إطلاق التحديثات بمقدار 10 أضعاف وصولاً للسوق',
        },
        description: {
          en: 'Fully automated CI/CD and GitOps delivery pipelines allow engineering squads to safely release micro-updates multiple times a day without fear of regressions or outages.',
          ar: 'مسارات تسليم CI/CD وGitOps مؤتمتة بالكامل تمكن الفرق الهندسية من نشر التحديثات بأمان عدة مرات يومياً دون الخوف من الأخطاء أو توقف النظام.',
        },
      },
      {
        title: {
          en: '40%+ Cloud Infrastructure Cost Optimization',
          ar: 'تحسين وخفض تكاليف البنية السحابية بنسبة تتجاوز 40%',
        },
        description: {
          en: 'Dynamic rightsizing, FinOps telemetry, spot instance orchestration, and serverless compute primitives eliminate idle resource waste across your multi-cloud estate.',
          ar: 'إدارة FinOps ومراقبة استهلاك الموارد، والتوسع التلقائي الدقيق، وحوسبة بدون خوادم تقضي على الهدر في الموارد عبر كافة البيئات السحابية.',
        },
      },
      {
        title: {
          en: 'Zero-Trust Security & Sovereign Regulatory Compliance',
          ar: 'أمان قائم على انعدام الثقة (Zero-Trust) وامتثال سيادي صارم',
        },
        description: {
          en: 'End-to-end mutual TLS, continuous automated vulnerability scanning, immutable audit logs, and data sovereignty controls aligned with Saudi NCA and UAE cybersecurity directives.',
          ar: 'تشفير mTLS متكامل، وفحص أمني استباقي مستمر، وسجلات تدقيق غير قابلة للتغيير، مع التزام تام بضوابط الهيئة الوطنية للأمن السيبراني (NCA) واللوائح الإقليمية.',
        },
      },
    ],

  },

  verticalsTitle: {
    en: 'Mission-Critical Architectures by Industry',
    ar: 'معماريات هندسية مخصصة للقطاعات الحيوية',
  },
  verticalsSubtitle: {
    en: 'Tailored digital engineering frameworks engineered for the stringent compliance, throughput, and scale demands of high-stakes industries.',
    ar: 'أطر هندسية رقمية مصممة لتلبية متطلبات الامتثال التنظيمي الصارم والإنتاجية الفائقة لأكثر القطاعات حساسية وتأثيراً.',
  },
  verticals: [
    {
      id: 'high-frequency-fintech-banking',
      number: '01',
      title: {
        en: 'High-Frequency Fintech & Digital Banking',
        ar: 'التقنية المالية والخدمات المصرفية الرقمية الفورية',
      },
      description: {
        en: 'Sub-millisecond payment switches, event-sourced transaction ledgers, and secure Open Banking API gateways compliant with SAMA and UAE Central Bank guidelines.',
        ar: 'محولات دفع ذات زمن استجابة بأجزاء من الميلي ثانية، وسجلات معاملات قائمة على تدفق الأحداث، وبوابات مصرفية مفتوحة متوافقة مع متطلبات البنك المركزي السعودي (ساما) ومصرف الإمارات المركزي.',
      },
      tag: {
        en: 'Banking & Financial Services',
        ar: 'القطاع المالي والمصرفي',
      },
      capabilities: {
        en: [
          'Sub-millisecond ledger consensus and transaction processing',
          'Open Banking regulatory compliance & hardened API gateways',
          'Real-time fraud telemetry and anomaly detection hooks',
        ],
        ar: [
          'معالجة فورية للمعاملات وتوافق السجلات في أجزاء من الميلي ثانية',
          'بوابات API آمنة ومتوافقة مع تشريعات المصرفية المفتوحة',
          'رصد لحظي للاحتيال وربط مباشر مع أنظمة كشف الشبهات',
        ],
      },
    },
    {
      id: 'telecommunications-5g-edge',
      number: '02',
      title: {
        en: 'Telecommunications & 5G Edge Infrastructure',
        ar: 'الاتصالات والبنية التحتية لشبكات الجيل الخامس وحوسبة الحافة',
      },
      description: {
        en: 'Cloud-native network function virtualization (NFV), ultra-low latency edge computing nodes, and scalable subscriber billing integration for next-gen telco operators.',
        ar: 'محاكاة افتراضية لوظائف الشبكات (NFV)، وحوسبة حافة ذات زمن استجابة منخفض للغاية، وأنظمة فوترة ومحاسبة عملاقة لمشغلي الاتصالات الحديثة.',
      },
      tag: {
        en: 'Telco & Edge Computing',
        ar: 'الاتصالات وحوسبة الحافة',
      },
      capabilities: {
        en: [
          'Containerized network functions (CNFs) with Kubernetes',
          'Multi-access Edge Computing (MEC) workloads',
          'High-volume event mediation and rating engines',
        ],
        ar: [
          'وظائف شبكية قائمة على الحاويات (CNFs) مدارة عبر كوبرنيتس',
          'معالجة أحمال العمل على حافة الشبكات (MEC)',
          'محركات وسيطة لمعالجة وتصنيف مليارات أحداث الاتصال',
        ],
      },
    },
    {
      id: 'healthcare-informatics-iomt',
      number: '03',
      title: {
        en: 'Healthcare Informatics & IoMT',
        ar: 'المعلوماتية الصحية وإنترنت الأشياء الطبية (IoMT)',
      },
      description: {
        en: 'Secure HL7/FHIR compliant health data exchange, medical telemetry ingestion pipelines, and fault-tolerant clinical decision support platforms with sovereign encryption.',
        ar: 'تبادل آمن للبيانات الطبية وفق معايير HL7/FHIR، ومسارات استيعاب بيانات الأجهزة الطبية، ومنصات دعم القرار السريري بتشفير سيادي كامل.',
      },
      tag: {
        en: 'HealthTech & IoMT',
        ar: 'التقنية الصحية والطبية',
      },
      capabilities: {
        en: [
          'FHIR/HL7 inter-hospital message brokering',
          'End-to-end encrypted medical IoT telemetry streams',
          'HIPAA, Saudi MoH, and NABIDH data compliance',
        ],
        ar: [
          'وساطة رسائل السجلات الصحية وفق معايير FHIR وHL7',
          'تدفق بيانات الأجهزة الطبية بتشفير طرفي متقدم',
          'امتثال كامل لمتطلبات وزارة الصحة السعودية ومنظومة نبض',
        ],
      },
    },
    {
      id: 'mobility-automotive-logistics',
      number: '04',
      title: {
        en: 'Smart Mobility, Fleet & Logistics',
        ar: 'التنقل الذكي وإدارة الأساطيل وسلاسل الإمداد',
      },
      description: {
        en: 'Real-time vehicle telematics ingestion, intelligent geospatial routing, automated dispatching engines, and cold-chain temperature telemetry at enterprise scale.',
        ar: 'استيعاب بيانات المركبات اللحظية، وتوجيه مسارات جغرافي ذكي، ومحركات توزيع الشحنات المؤتمتة، وتتبع سلاسل التبريد على نطاق مؤسسي ضخم.',
      },
      tag: {
        en: 'Mobility & Supply Chain',
        ar: 'النقل والخدمات اللوجستية',
      },
      capabilities: {
        en: [
          'MQTT & Kafka ingestion for millions of connected sensors',
          'Sub-second dynamic route recalculation & geofencing',
          'Predictive maintenance alerts via edge intelligence',
        ],
        ar: [
          'استيعاب بروتوكولات MQTT وKafka لملايين الحساسات المتصلة',
          'إعادة حساب المسارات الجغرافية الفورية وتحديد النطاقات',
          'تنبيهات الصيانة التنبؤية بالاعتماد على ذكاء حافة الشبكة',
        ],
      },
    },
    {
      id: 'energy-iot-commodities',
      number: '05',
      title: {
        en: 'Energy Grid, Industrial IoT & Commodities',
        ar: 'شبكات الطاقة، وإنترنت الأشياء الصناعي، والسلع',
      },
      description: {
        en: 'Mission-critical SCADA-to-Cloud telemetry, predictive grid load forecasting engines, and carbon emissions monitoring infrastructure for global energy producers.',
        ar: 'ربط أنظمة SCADA الصناعية بالسحابة بأعلى موثوقية، ومحركات تنبؤ بأحمال شبكات الطاقة، وبنية تحتية لمراقبة البصمة الكربونية لكبرى شركات الطاقة.',
      },
      tag: {
        en: 'Energy & Industrial IoT',
        ar: 'الطاقة وإنترنت الأشياء الصناعي',
      },
      capabilities: {
        en: [
          'Hardened SCADA & OPC-UA industrial protocol bridges',
          'High-frequency time-series telemetry storage with TimescaleDB',
          'Automated ESG and carbon compliance calculation engines',
        ],
        ar: [
          'جسور ربط مؤمنة لبروتوكولات SCADA وOPC-UA الصناعية',
          'تخزين بيانات السلاسل الزمنية عالية التردد عبر TimescaleDB',
          'محركات مؤتمتة لحساب تقارير الاستدامة والبصمة الكربونية',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'Production-Grade Digital Engineering Stack',
    ar: 'المنظومة التقنية والهندسية المؤسسية',
  },
  techStackSubtitle: {
    en: 'Engineered with proven, high-performance open standards, enterprise cloud runtimes, and resilient distributed systems technologies.',
    ar: 'مبنية على أحدث المعايير المفتوحة عالية الأداء، وبيئات التشغيل السحابية المؤسسية، وتقنيات النظم الموزعة فائقة الصمود.',
  },
  techStackPods: [
    {
      title: {
        en: 'Distributed Core & Modern Runtimes',
        ar: 'الأنظمة الموزعة وبيئات التشغيل الحديثة',
      },
      badge: {
        en: 'Core Runtimes',
        ar: 'لغات وبيئات التشغيل',
      },
      description: {
        en: 'Ultra-low latency, concurrent, and memory-safe languages engineered for high-concurrency microservices, robust APIs, and distributed computational tasks.',
        ar: 'لغات برمجة ذات زمن استجابة متدنٍ وأمان فائق في إدارة الذاكرة، مصممة لمعالجة ملايين الطلبات المتزامنة والواجهات البرمجية القوية.',
      },
      technologies: [
        { name: 'Golang', category: 'High-Concurrency Services', badge: 'v1.23' },
        { name: 'Rust', category: 'Systems & Memory-Safe Kernels', badge: 'Ultra-Fast' },
        { name: 'TypeScript / Node.js', category: 'Full-Stack & APIs', badge: 'v22 LTS' },
        { name: 'Java / Spring Boot 3', category: 'Enterprise Core Services' },
        { name: 'Python / FastAPI', category: 'AI Inference & Data Microservices' },
      ],
    },
    {
      title: {
        en: 'Cloud-Native & Container Orchestration',
        ar: 'المنصات السحابية وإدارة الحاويات',
      },
      badge: {
        en: 'Orchestration',
        ar: 'إدارة السحابة والحاويات',
      },
      description: {
        en: 'Automated multi-cloud cluster runtimes, declarative infrastructure, service discovery, and self-healing containerized deployments.',
        ar: 'بيئات تشغيل مجموعات متعددة السحابات مؤتمتة، وبنية تحتية إعلانية كودية، واكتشاف للخدمات، ونشر حاويات ذاتي الإصلاح والشفاء.',
      },
      technologies: [
        { name: 'Kubernetes (K8s)', category: 'Container Orchestration', badge: 'CNCF Core' },
        { name: 'Docker & Podman', category: 'Containerization' },
        { name: 'Istio Service Mesh', category: 'mTLS & Traffic Shifting' },
        { name: 'Terraform / OpenTofu', category: 'Infrastructure as Code' },
        { name: 'AWS / GCP / Azure', category: 'Multi-Cloud Foundation' },
      ],
    },
    {
      title: {
        en: 'Real-Time Streaming & Distributed Data',
        ar: 'تدفق البيانات اللحظي والبيانات الموزعة',
      },
      badge: {
        en: 'Event Streaming',
        ar: 'تدفق الأحداث وقواعد البيانات',
      },
      description: {
        en: 'Fault-tolerant message queues, complex stateful event processing, high-speed caches, and analytical real-time data engines.',
        ar: 'طوابير رسائل صامدة للأعطال، ومعالجة أحداث متقدمة، وذاكرة تخزين مؤقت فائقة السرعة، ومحركات تحليلية للبيانات اللحظية.',
      },
      technologies: [
        { name: 'Apache Kafka', category: 'Distributed Event Bus', badge: 'Petabyte Scale' },
        { name: 'Apache Flink', category: 'Stateful Stream Processing' },
        { name: 'Redis Enterprise', category: 'In-Memory Cache & Pub/Sub' },
        { name: 'ClickHouse', category: 'Real-Time Columnar Analytics' },
        { name: 'Apache Iceberg', category: 'Open Table Lakehouse' },
      ],
    },
    {
      title: {
        en: 'DevOps, SRE & DevSecOps Automation',
        ar: 'أتمتة DevOps وموثوقية النظم والأمان',
      },
      badge: {
        en: 'Delivery & SRE',
        ar: 'التسليم وموثوقية المواقع',
      },
      description: {
        en: 'Zero-touch continuous integration, GitOps release pipelines, full-stack distributed tracing, and automated shift-left security enforcement.',
        ar: 'تكامل ونشر مستمر مؤتمت، ومسارات إطلاق تعتمد على GitOps، وتتبع موزع شامل للأخطاء، وفحص أمني استباقي في كل مرحلة برمجية.',
      },
      technologies: [
        { name: 'GitHub Actions', category: 'CI/CD Automation' },
        { name: 'ArgoCD', category: 'Declarative GitOps Delivery', badge: 'GitOps' },
        { name: 'OpenTelemetry & Datadog', category: 'Full-Stack Observability' },
        { name: 'HashiCorp Vault', category: 'Secrets Management & PKI' },
        { name: 'Snyk & Trivy', category: 'Shift-Left Vulnerability Scanning' },
      ],
    },
  ],

  clientStories: getDigitalEngineeringFeaturedClientStories(),

  delivery: {
    title: {
      en: 'How We Engineer Differently: Our 4 Delivery Pillars',
      ar: 'كيف نبتكر برمجياً بشكل مختلف: ركائزنا الهندسية الأربع',
    },
    subtitle: {
      en: 'A battle-tested software engineering discipline that moves from tactical problem-solving to robust, maintainable architecture built to scale.',
      ar: 'منهجية هندسية راسخة تنتقل من الحلول الترقيعية المؤقتة إلى معمارية برمجية متينة ومستدامة صُممت للتوسع اللامحدود.',
    },
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
    pillars: [
      {
        title: {
          en: 'Domain-Driven Design (DDD) & Event Storming',
          ar: 'التصميم القائم على النطاق (DDD) وجلسات عواصف الأحداث',
        },
        description: {
          en: 'We dissect complex business domains into clear bounded contexts and autonomous event models, preventing codebase entanglement and establishing crystal-clear service ownership.',
          ar: 'نفكك نطاقات الأعمال المعقدة إلى سياقات محددة ونماذج أحداث مستقلة، مما يمنع تشابك الشيفرات ويحدد بدقة مسؤولية وملكية كل خدمة برمجية.',
        },
      },
      {
        title: {
          en: 'Cloud-Native Infrastructure as Code (IaC)',
          ar: 'البنية التحتية ككود السحابية الأصلية (IaC)',
        },
        description: {
          en: 'Every network route, Kubernetes cluster, security group, and database is defined in version-controlled Terraform modules, ensuring reproducible and audit-compliant staging and production environments.',
          ar: 'يتم تعريف كل مسار شبكة ومجموعة كوبرنيتس وإعداد أمني وقاعدة بيانات في كود Terraform مدار بإصدارات، مما يضمن بيئات متطابقة وموثقة بالكامل.',
        },
      },
      {
        title: {
          en: 'Shift-Left DevSecOps & Automated Verification',
          ar: 'أمان برمجي استباقي (Shift-Left) واختبارات آلية شاملة',
        },
        description: {
          en: 'Security, performance, and regression testing are moved upstream into developer commits. Static analysis, container vulnerability checks, and integration suites run on every pull request.',
          ar: 'ننقل اختبارات الأمان والأداء ومطابقة الجودة إلى المراحل البرمجية الأولى. يتم فحص الثغرات واختبارات التكامل آلياً مع كل مراجعة كودية.',
        },
      },
      {
        title: {
          en: 'Observability-First Site Reliability Engineering (SRE)',
          ar: 'هندسة موثوقية المواقع (SRE) المعتمدة على الرصد الشامل',
        },
        description: {
          en: 'We define quantifiable Service Level Objectives (SLOs) and Error Budgets backed by distributed OpenTelemetry tracing and actionable Prometheus alerting—catching anomalies before users do.',
          ar: 'نحدد أهداف مستوى خدمة قابلة للقياس (SLOs) وميزانيات للأخطاء مدعومة بتتبع موزع شامل وتنبيهات استباقية لرصد أي خلل قبل أن يشعر به المستخدم.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'deconstructing-the-monolith-strangler-fig',
      slug: 'deconstructing-the-monolith-strangler-fig',
      type: 'insight',
      badge: {
        en: 'Architecture Deep-Dive',
        ar: 'تحليل معماري معمق',
      },
      title: {
        en: 'Deconstructing the Monolith: Strategic Strangler Fig Patterns for Zero-Downtime Migration',
        ar: 'تفكيك الأنظمة المتجانسة: أنظمة Strangler Fig للانتقال البرمجي بلا توقف',
      },
      excerpt: {
        en: 'A pragmatic architectural playbook for breaking down legacy enterprise systems into resilient microservices while maintaining 100% operational continuity and transaction integrity.',
        ar: 'دليل معماري عملي لتفكيك الأنظمة المؤسسية القديمة إلى خدمات مصغرة مرنة مع الحفاظ الكامل على استمرارية الأعمال وسلامة المعاملات.',
      },
      date: '2026-03-01',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      href: '/insights/deconstructing-the-monolith-strangler-fig',
    },
    {
      id: 'event-driven-microservices-kafka-flink',
      slug: 'event-driven-microservices-kafka-flink',
      type: 'insight',
      badge: {
        en: 'Real-Time Streaming',
        ar: 'تدفق البيانات اللحظي',
      },
      title: {
        en: 'Event-Driven Microservices at Petabyte Scale: Kafka and Flink Architectural Patterns',
        ar: 'الخدمات المصغرة الموجهة بالأحداث على مقياس البيتابايت: أنماط Kafka وFlink',
      },
      excerpt: {
        en: 'How modern engineering leaders architect high-throughput event logs, manage schema evolution, and handle distributed transaction rollbacks in production.',
        ar: 'كيف يصمم قادة الهندسة البرمجية سجلات الأحداث فائقة السرعة، ويديرون تطور المخططات البيانية، ويعالجون استرجاع المعاملات الموزعة في بيئات الإنتاج الحية.',
      },
      date: '2026-02-18',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      href: '/insights/event-driven-microservices-kafka-flink',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici modernized our critical core banking transaction switch into an ultra-low latency, event-driven Kubernetes architecture. We eliminated 99.8% of system outages while enabling our developers to release new microservices multiple times a day without fear. Their software engineering rigour is world-class.',
      ar: 'أعادت بيرسيكي بناء وتحديث محول المعاملات المصرفية الأساسي لدينا بالكامل إلى معمارية كوبرنيتس فورية وموجهة بالأحداث. قضينا على 99.8% من انقطاعات الخدمة ومكّنا مطورينا من نشر خدمات مصغرة جديدة عدة مرات يومياً بكل ثقة وأمان. إن انضباطهم الهندسي ومعاييرهم البرمجية تضاهي الأفضل عالمياً.',
    },
    author: 'Dr. Tariq Al-Husseini',
    role: {
      en: 'Chief Technology Officer (CTO), Gulf Digital Bank',
      ar: 'رئيس قطاع التكنولوجيا (CTO)، بنك الخليج الرقمي',
    },
    badge: {
      en: 'Verified Mission-Critical Core Modernization',
      ar: 'تحول معماري معتمد للأنظمة المصرفية الحيوية',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions',
    ar: 'الأسئلة الشائعة حول الهندسة الرقمية',
  },
  faqsSubtitle: {
    en: 'Clear engineering perspectives on microservices migrations, multi-cloud strategies, zero-downtime cutovers, and regional compliance.',
    ar: 'رؤى هندسية واضحة ومباشرة حول الانتقال للخدمات المصغرة، واستراتيجيات السحابات المتعددة، والنشر بلا توقف، والامتثال التنظيمي.',
  },
  faqs: [
    {
      question: {
        en: 'How do you decide between a modular monolith and a distributed microservices architecture?',
        ar: 'كيف تحددون الخيار الأمثل بين المنظومة المتجانسة النمطية (Modular Monolith) والخدمات المصغرة الموزعة؟',
      },
      answer: {
        en: 'We assess team size, deployment cadence, domain complexity, and independent scaling requirements. For early-stage initiatives or small teams, a well-factored modular monolith with clean boundaries often provides superior developer velocity without distributed systems overhead. When multiple autonomous engineering teams need to deploy independently or specific workloads demand distinct scaling characteristics (e.g. sub-second payment processing), we architect decoupled microservices.',
        ar: 'نقوم بتقييم حجم الفرق الهندسية، ووتيرة النشر المطلوبة، وتعقيد نطاق الأعمال، واحتياجات التوسع المستقل. بالنسبة للمبادرات الجديدة أو الفرق الصغيرة، غالباً ما يوفر المنظوم النمطي المصمم بعناية (Modular Monolith) سرعة تطوير فائقة دون تعقيدات الأنظمة الموزعة. أما عندما تتطلب المنظومة عمل فرق متعددة بشكل مستقل أو عندما تحتاج أحمال محددة لتوسع هائل (مثل بوابات الدفع الفورية)، فإننا نصمم خدمات مصغرة مفصولة ومرنة.',
      },
    },
    {
      question: {
        en: 'How do you execute zero-downtime database and traffic cutovers during modernization?',
        ar: 'كيف تنفذون عمليات التحويل البرمجي للبيانات وحركة المرور دون أي انقطاع في الخدمة؟',
      },
      answer: {
        en: 'We leverage the Strangler Fig pattern combined with dual-writing and Change Data Capture (CDC) via Debezium and Kafka. Legacy and modern databases are kept in continuous bidirectional synchronization. Traffic is progressively shifted at the API Gateway layer using canary percentages (1%, 5%, 25%, 100%) with automated rollbacks triggered if error rates exceed 0.01%, ensuring zero disruption to end-users.',
        ar: 'نعتمد على نمط خنق التين (Strangler Fig) مدمجاً مع الكتابة المزدوجة وتقنية التقاط التغييرات (CDC) عبر Debezium وKafka. نحافظ على تزامن فوري ثنائي الاتجاه بين قواعد البيانات القديمة والجديدة. ويتم تحويل حركة المرور تدريجياً عبر بوابة الـ API بنسب محددة (1% ثم 5% ثم 25% وصولاً إلى 100%) مع ارتداد آلي فوري في حال تجاوزت الأخطاء 0.01%، مما يضمن تجربة سلسة للمستخدمين بلا أدنى انقطاع.',
      },
    },
    {
      question: {
        en: 'What is your approach to Multi-Cloud vs Single-Cloud infrastructure?',
        ar: 'ما هي استراتيجيتكم في الموازنة بين السحابات المتعددة (Multi-Cloud) والاعتماد على مزود سحابي واحد؟',
      },
      answer: {
        en: 'We engineer using cloud-agnostic primitives—containerizing workloads on Kubernetes, managing state with standard protocols, and writing portable Terraform modules. This avoids vendor lock-in and satisfies sovereign data residency mandates (such as keeping sensitive transaction logs on local cloud regions like AWS Bahrain or Google Cloud Dammam) while allowing strategic utilization of cloud-specific AI accelerators.',
        ar: 'نصمم برمجياتنا استناداً إلى معايير سحابية حيادية ومفتوحة—من خلال تشغيل الأحمال داخل كوبرنيتس، وإدارة البنية عبر كود Terraform قابل للنقل. هذا يمنع الارتهان لمزود واحد ويلبي اشتراطات سيادة وتوطين البيانات الإقليمية (مثل إبقاء السجلات الحساسة داخل مناطق سحابية محلية في السعودية أو الإمارات)، مع الاستفادة التكتيكية من ميزات الذكاء الاصطناعي الفريدة لكل مزود.',
      },
    },
    {
      question: {
        en: 'How do your CI/CD pipelines prevent catastrophic production bugs and regressions?',
        ar: 'كيف تمنع خطوط CI/CD المؤتمتة لديكم حدوث الأعطال الكارثية في بيئة العمل الحية؟',
      },
      answer: {
        en: 'Our pipelines employ progressive delivery and shift-left automated verification. Every commit undergoes automated unit testing, SAST security scans, container vulnerability checks, contract testing (Pact), and ephemeral environment integration suites. Merges trigger canary rollouts monitored by automated Prometheus anomaly detectors that automatically abort the deployment if latencies spike.',
        ar: 'تستخدم مساراتنا مبدأ التسليم التدريجي والفحص الآلي الاستباقي. تخضع كل إضافة كودية لاختبارات الوحدات، وفحص الثغرات الأمنية (SAST)، واختبارات توافق الواجهات (Pact)، واختبارات التكامل في بيئات سحابية مؤقتة. وعند الاعتماد، تبدأ الإصدارات التدريجية (Canary) المراقبة بمتحسسات ترصد أي ارتفاع في زمن الاستجابة وتوقف النشر فورياً قبل تأثر المنظومة.',
      },
    },
    {
      question: {
        en: 'Are your digital engineering architectures compliant with regional frameworks like Saudi NCA and UAE CBUAE?',
        ar: 'هل تتوافق معمارياتكم الهندسية مع الضوابط السيادية مثل الهيئة الوطنية للأمن السيبراني (NCA) والبنك المركزي؟',
      },
      answer: {
        en: 'Yes. We build with regulatory compliance embedded into the infrastructure code. Our architectures enforce strict data encryption at rest and in transit (FIPS 140-2 validated), centralized immutable audit logging with HashiCorp Vault, localized tenant isolation, and multi-factor Zero-Trust identity boundaries fully aligned with Saudi NCA ECC/CSCC controls and UAE federal regulations.',
        ar: 'نعم بكل تأكيد وبأعلى درجات التدقيق. نبني الامتثال التنظيمي كجزء لا يتجزأ من كود البنية التحتية. تطبق معمارياتنا تشفيراً صارماً للبيانات أثناء التخزين والنقل، وسجلات تدقيق غير قابلة للتعديل عبر HashiCorp Vault، وعزل تام للبيانات، وضوابط وصول قائمة على انعدام الثقة (Zero-Trust) متوافقة كلياً مع الضوابط الأساسية للأمن السيبراني (ECC) وضوابط مصرف الإمارات المركزي.',
      },
    },
    {
      question: {
        en: 'How do you empower internal engineering teams to maintain and scale systems after launch?',
        ar: 'كيف تمكّنون الفرق الهندسية الداخلية لدى العميل من إدارة وتوسيع الأنظمة بعد الإطلاق؟',
      },
      answer: {
        en: 'We practice pair-programming, co-engineering, and establish Internal Developer Portals (IDPs) using Backstage or custom portals. We provide comprehensive Architectural Decision Records (ADRs), automated runbooks, and hands-on SRE workshops, ensuring your internal engineers have complete ownership, deep context, and full autonomy from day one.',
        ar: 'نمارس أسلوب البرمجة التشاركية والهندسة المشتركة جنباً إلى جنب مع فرقكم، ونبني بوابات داخلية للمطورين (IDPs) استناداً إلى Backstage. كما نقدم توثيقاً شاملاً لقرارات المعمارية (ADRs)، وأدلة تشغيل مؤتمتة، وورش عمل تطبيقية في هندسة موثوقية المواقع (SRE)، مما يضمن امتلاك فريقكم الداخلي لكافة تفاصيل المنظومة وقدرته التامة على تطويرها باستقلالية واحتراف.',
      },
    },
  ],
};
