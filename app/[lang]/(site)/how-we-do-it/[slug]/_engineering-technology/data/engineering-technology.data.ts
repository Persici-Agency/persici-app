import type {
  SolutionOfferingItem,
  SolutionBenefitItem,
  TechInfrastructurePod,
  SolutionFaqItem,
} from '@shared/types';

export const engineeringTechnologyData = {
  hero: {
    title: {
      en: 'Spark Innovation & Accelerate Digital Engineering',
      ar: 'إشعال شرارة الابتكار وتسريع الهندسة الرقمية',
    },
    subtitle: {
      en: 'Lead the way with agile engineering, scalable cloud platforms, cross-functional pods, and cutting-edge technologies. We guide enterprises through seamless transitions from legacy monoliths to modern resilient architectures.',
      ar: 'ريادة المشهد عبر الهندسة الرشيقة، والمنصات السحابية القابلة للتوسع، وفرق العمل المتكاملة، وأحدث التقنيات. نقود المؤسسات في الانتقال السلس من الأنظمة القديمة المتكلسة إلى بنى سحابية حديثة وفائقة المرونة.',
    },
    tag: {
      en: 'Engineering & Technology',
      ar: 'الهندسة والتكنولوجيا',
    },
    secondaryTag: {
      en: 'Our Better How',
      ar: 'منهجيتنا الأفضل في التنفيذ',
    },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85',
    ctaText: {
      en: 'Explore Engineering Capabilities',
      ar: 'استكشف القدرات الهندسية',
    },
    ctaHref: '#capabilities',
  },

  offeringsTitle: {
    en: 'Core Engineering Capabilities: Our Better How',
    ar: 'القدرات الهندسية الأساسية: منهجيتنا الأفضل',
  },
  offeringsSubtitle: {
    en: 'Delivering end-to-end technical transformation across IT value streams, enterprise platforms, and digital customer channels.',
    ar: 'تقديم تحول تقني متكامل عبر مسارات قيمة تقنية المعلومات، والمنصات المؤسسية، وقنوات العملاء الرقمية.',
  },

  offerings: [
    {
      title: {
        en: 'Engineering Transformation',
        ar: 'تحول الهندسة والعمليات البرمجية',
      },
      description: {
        en: 'We assess the IT value streams across your organization to ensure your technology strategy fully supports business and customer objectives with modern agile methods, tooling, and continuous delivery.',
        ar: 'نقيم مسارات قيمة تقنية المعلومات لضمان مواءمة استراتيجية التكنولوجيا مع الأهداف التجارية والعملاء، عبر تطبيق أساليب وأدوات حديثة للتسليم المستمر.',
      },
      diagramType: 'de-microservices-mesh',
      tag: { en: 'IT Transformation', ar: 'تحول تقنية المعلومات' },
    },
    {
      title: {
        en: 'Software Implementation',
        ar: 'نشر وتكامل البرمجيات المؤسسية',
      },
      description: {
        en: 'We support our clients in choosing and deploying the right enterprise software, leveraging our proven agile approach to accelerate marketing, commerce, and business operations.',
        ar: 'ندعم عملاءنا في اختيار ونشر البرمجيات المؤسسية المثالية، مستفيدين من منهجيتنا الرشيقة لتسريع عمليات التسويق والتجارة والعمليات التشغيلية.',
      },
      diagramType: 'api-cluster-gateway',
      tag: { en: 'Software Deployment', ar: 'تكامل البرمجيات' },
    },
    {
      title: {
        en: 'Experience Technologies',
        ar: 'تقنيات التجارب الرقمية والقنوات المتعددة',
      },
      description: {
        en: 'We build agile, customer-focused applications across web, mobile, and voice—helping clients rapidly meet evolving needs while creating stronger experiences across the customer journey.',
        ar: 'نبني تطبيقات رشيقة ومتمحورة حول العميل عبر الويب والجوال والصوت، لمساعدة العملاء على التكيف السريع وصناعة تجارب رقمية مؤثرة.',
      },
      diagramType: 'app-dual-stack',
      tag: { en: 'Experience Tech', ar: 'تقنيات التجارب' },
    },
    {
      title: {
        en: 'Microservices & Composable APIs',
        ar: 'الخدمات المصغرة وواجهات البرمجة المجمعة',
      },
      description: {
        en: 'By engineering and operating microservices and API platforms, we empower teams with greater agility, decoupled deployments, and seamless collaboration—driving faster digital innovation.',
        ar: 'عبر هندسة وتشغيل منصات الخدمات المصغرة وواجهات API، نمكن الفرق من تحقيق استقلالية النشر والمرونة والتكامل السلس لتسريع الابتكار الرقمي.',
      },
      diagramType: 'de-api-gateway-router',
      tag: { en: 'APIs & Cloud', ar: 'الواجهات والسحابة' },
    },
    {
      title: {
        en: 'DevOps & Automated CI/CD Pipelines',
        ar: 'هندسة DevOps ومسارات الأتمتة المستمرة',
      },
      description: {
        en: 'Automating testing, infrastructure as code, and zero-downtime deployment pipelines that convert software shipping into a routine, frictionless daily practice.',
        ar: 'أتمتة الاختبارات، والبنية التحتية البرمجية (IaC)، ومسارات النشر دون أي انقطاع، لتحويل إطلاق التحديثات البرمجية إلى ممارسة يومية سلسة وآمنة.',
      },
      diagramType: 'de-cicd-pipeline-flow',
      tag: { en: 'CI/CD Pipelines', ar: 'مسارات الأتمتة' },
    },
    {
      title: {
        en: 'Sovereign Security & Resilience',
        ar: 'الأمن السيبراني السيادي والموثوقية',
      },
      description: {
        en: 'Zero-trust architecture, multi-region failover, sovereign data compliance, and 99.99% high-availability guarantees for mission-critical enterprise workloads.',
        ar: 'معمارية انعدام الثقة (Zero-Trust)، واستعادة البيانات متعددة المناطق، والامتثال لسيادة البيانات، وضمان جاهزية تشغيلية بنسبة 99.99% لأهم الأنظمة الحيوية.',
      },
      diagramType: 'cyber-shield-lock',
      tag: { en: 'Zero Trust', ar: 'الأمن السيبراني' },
    },
  ] as SolutionOfferingItem[],

  whyItMatters: {
    title: {
      en: 'From Fragile Monoliths to Composable Cloud-Native Systems',
      ar: 'من الأنظمة الأحادية المعقدة إلى البنى السحابية المرنة القابلة للتجميع',
    },
    text: {
      en: 'Legacy systems slow organizations down, increasing technical debt and exposing operations to outages. Our modern engineering approach breaks these constraints, transforming technology into an adaptable engine of continuous market differentiation.',
      ar: 'تتسبب الأنظمة القديمة المتشابكة في إبطاء وتيرة العمل ومضاعفة الديون التقنية وتعريض العمليات للمخاطر. تكسر منهجيتنا الهندسية الحديثة هذه القيود، محولة التكنولوجيا إلى محرك مرن للريادة والتفوق في السوق.',
    },
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
  },

  benefitsStrip: {
    title: {
      en: 'The Engineering Excellence Advantage',
      ar: 'مزايا التميز الهندسي من بيرسيكي',
    },
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=85',
    benefits: [
      {
        title: {
          en: 'Zero-Downtime Releases',
          ar: 'تحديثات دون أي انقطاع في الخدمة',
        },
        description: {
          en: 'Deploy code updates safely multiple times a day using blue-green and canary deployment strategies.',
          ar: 'إطلاق التحديثات البرمجية بأمان عدة مرات يومياً باستخدام استراتيجيات النشر التدريجي دون التأثير على المستخدمين.',
        },
        accentColor: '#D83427',
      },
      {
        title: {
          en: '10x Faster Deployment Cycles',
          ar: 'تسريع دورات النشر بعشرة أضعاف',
        },
        description: {
          en: 'Automated testing and infrastructure scaffolding dramatically shorten the path from pull request to production.',
          ar: 'الاختبارات المؤتمتة وهياكل البنية التحتية الجاهزة تختصر المسار من كتابة الكود إلى بيئة الإنتاج الحية.',
        },
        accentColor: '#EF8C7D',
      },
      {
        title: {
          en: 'Scalable Elastic Infrastructure',
          ar: 'بنية تحتية مرنة وقابلة للتوسع',
        },
        description: {
          en: 'Auto-scaling cloud architectures that seamlessly handle million-user traffic spikes with minimal marginal cost.',
          ar: 'بنى سحابية ذاتية التوسع تستوعب قفزات الزيارات المليونية بسلاسة تامة وبأقل تكلفة تشغيلية ممكنة.',
        },
        accentColor: '#121212',
      },
    ] as SolutionBenefitItem[],
  },

  techStackPods: [
    {
      badge: { en: 'Cloud & K8s', ar: 'السحابة والحاويات' },
      title: { en: 'Cloud & Kubernetes Infrastructure', ar: 'البنية السحابية وإدارة الحاويات' },
      description: {
        en: 'Multi-cloud scalable platforms and cluster orchestration.',
        ar: 'منصات سحابية متعددة وإدارة مجموعات الحاويات.',
      },
      technologies: [
        { name: 'AWS EKS', category: 'Cloud' },
        { name: 'Google GKE', category: 'Cloud' },
        { name: 'Azure AKS', category: 'Cloud' },
        { name: 'Docker', category: 'Containers' },
        { name: 'Terraform', category: 'IaC' },
        { name: 'Helm', category: 'K8s' },
      ],
    },
    {
      badge: { en: 'Backend & APIs', ar: 'الخدمات الخلفية' },
      title: { en: 'API Gateways & Backend Services', ar: 'بوابات البرمجة والخدمات الخلفية' },
      description: {
        en: 'High-throughput microservices and event-driven architectures.',
        ar: 'خدمات مصغرة فائقة الأداء وبنى برمجية موجهة بالأحداث.',
      },
      technologies: [
        { name: 'Node.js', category: 'Runtime' },
        { name: 'Go', category: 'Language' },
        { name: 'GraphQL', category: 'API' },
        { name: 'Apache Kafka', category: 'Events' },
        { name: 'Redis Enterprise', category: 'Cache' },
        { name: 'Kong', category: 'Gateway' },
      ],
    },
    {
      badge: { en: 'Frontend & Edge', ar: 'الواجهات والحوسبة الطرفية' },
      title: { en: 'Frontend Engineering & Edge', ar: 'هندسة الواجهات والشبكات الطرفية' },
      description: {
        en: 'Modern edge computing and reactive frontend frameworks.',
        ar: 'الحوسبة الطرفية المتقدمة وأطر عمل الواجهات التفاعلية.',
      },
      technologies: [
        { name: 'Next.js 16', category: 'Framework' },
        { name: 'React 19', category: 'UI' },
        { name: 'TypeScript', category: 'Language' },
        { name: 'Tailwind CSS v4', category: 'Styling' },
        { name: 'Cloudflare Workers', category: 'Edge' },
      ],
    },
  ] as TechInfrastructurePod[],

  quote: {
    text: {
      en: 'Persici’s engineers transformed our architecture from a monolithic legacy stack into a headless microservices system. Our page loads dropped under 1 second, and our server costs fell by 42%.',
      ar: 'حوّل مهندسو بيرسيكي بنيتنا التقنية من نظام قديم متكلس إلى بنية خدمات مصغرة مرنة. انخفض زمن تحميل الصفحات إلى أقل من ثانية، وانخفضت تكاليف الخوادم لدينا بنسبة 42%.',
    },
    author: 'Khaled Al-Mutawa',
    role: {
      en: 'CTO, GCC Omnichannel Retail Group',
      ar: 'الرئيس التنفيذي للتكنولوجيا، مجموعة التجزئة الخليجية الموحدة',
    },
  },

  faqs: [
    {
      question: {
        en: 'How do you handle migration from legacy enterprise architectures?',
        ar: 'كيف تديرون الانتقال من البنى التقنية والأنظمة القديمة؟',
      },
      answer: {
        en: 'We use the proven Strangler Fig pattern, gradually migrating business capabilities into modular microservices behind a unified API gateway. This ensures zero operational downtime and continuous delivery of business value.',
        ar: 'نطبق نمط التفكيك التدريجي (Strangler Fig) لنقل وظائف العمل خطوة بخطوة إلى خدمات مصغرة خلف بوابة واجهات موحدة، مما يضمن استمرارية الخدمة التامة وتحقيق قيمة متواصلة دون انقطاع.',
      },
    },
    {
      question: {
        en: 'What standards do your engineers follow for code quality and security?',
        ar: 'ما هي المعايير التي يتبعها مهندسوكم لضمان جودة الكود والأمان؟',
      },
      answer: {
        en: 'We mandate strict TypeScript type safety, automated linting, unit/integration test coverage > 85%, OWASP Top 10 security scanning, and automated peer reviews before merging into production branches.',
        ar: 'نفرض معايير أمان صارمة تشمل أمان الأنواع في TypeScript، والفحص الآلي للكود، وتغطية اختبارات تتجاوز 85%، وفحص ثغرات OWASP Top 10، والمراجعة الثنائية الدقيقة قبل دمج أي كود في بيئة الإنتاج.',
      },
    },
    {
      question: {
        en: 'Do you support multi-cloud deployments?',
        ar: 'هل تدعمون النشر عبر بيئات سحابية متعددة (Multi-Cloud)؟',
      },
      answer: {
        en: 'Yes. By leveraging Kubernetes, Terraform infrastructure as code, and containerized microservices, our architectures run portably across AWS, Google Cloud, Microsoft Azure, and local sovereign data centers.',
        ar: 'نعم. من خلال الاعتماد على Kubernetes، والبنية التحتية البرمجية عبر Terraform، والحاويات المستقلة، تعمل أنظمتنا بمرونة عبر AWS وGoogle Cloud وAzure ومراكز البيانات المحلية السيادية.',
      },
    },
  ] as SolutionFaqItem[],
};
