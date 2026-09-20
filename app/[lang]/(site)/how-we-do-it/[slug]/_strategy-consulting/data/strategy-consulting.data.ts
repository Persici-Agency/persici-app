import type {
  SolutionOfferingItem,
  SolutionBenefitItem,
  TechInfrastructurePod,
  SolutionFaqItem,
} from '@shared/types';

export const strategyConsultingData = {
  hero: {
    title: {
      en: 'Turning Ambition into Scalable Growth Roadmaps',
      ar: 'تحويل الطموح المؤسسي إلى خرائط طريق نمو قابلة للتوسع',
    },
    subtitle: {
      en: 'Persici combines market intelligence, digital strategy, and executional experience to help ambitious businesses navigate change and capture high-value market share.',
      ar: 'تجمع بيرسيشي بين استخبارات السوق، والاستراتيجية الرقمية، والخبرة التنفيذية لمساعدة المؤسسات الطموحة على قيادة التغيير والاستحواذ على حصة سوقية مستدامة.',
    },
    tag: {
      en: 'Strategy & Consulting',
      ar: 'الاستراتيجية والاستشارات',
    },
    secondaryTag: {
      en: 'Advisory Capabilities',
      ar: 'القدرات الاستشارية',
    },
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=85',
    ctaText: {
      en: 'Book a Strategic Session',
      ar: 'احجز جلسة استراتيجية',
    },
    ctaHref: '#capabilities',
  },

  offeringsTitle: {
    en: 'Our Advisory Capabilities',
    ar: 'قدراتنا الاستشارية المتكاملة',
  },
  offeringsSubtitle: {
    en: 'End-to-end business and digital transformation designed to optimize business models and deliver long-term market leadership.',
    ar: 'تحول مؤسسي ورقمي شامل مصمم لتحسين نماذج العمل التجاري وتحقيق ريادة مستدامة في السوق.',
  },

  offerings: [
    {
      title: {
        en: 'Digital Transformation & Roadmapping',
        ar: 'استراتيجية التحول الرقمي وخرائط الطريق',
      },
      description: {
        en: 'We evaluate your current digital capabilities and define a prioritized transformation roadmap aligned with business goals, operational needs, and future growth.',
        ar: 'نقيم قدراتك الرقمية الحالية ونبني خارطة طريق تحول أولويّة متوافقة مع الأهداف التجارية والاحتياجات التشغيلية وتطلعات النمو المستقبلي.',
      },
      diagramType: 'compass-spatial-reticle',
      tag: { en: 'Transformation', ar: 'التحول المؤسسي' },
    },
    {
      title: {
        en: 'Market Entry & Go-To-Market Strategy',
        ar: 'دخول الأسواق واستراتيجيات الإطلاق (GTM)',
      },
      description: {
        en: 'We identify the right markets, audiences, channels, positioning, and launch approach to help your business enter and grow with absolute confidence.',
        ar: 'نحدد الأسواق المستهدفة، والجمهور، والقنوات، والتموضع المناسب، ومنهجيات الإطلاق لدخول الأسواق والتوسع فيها بثقة تامة.',
      },
      diagramType: 'prism-refraction-beam',
      tag: { en: 'Go-To-Market', ar: 'إطلاق الأسواق' },
    },
    {
      title: {
        en: 'Growth & Commercial Strategy',
        ar: 'استراتيجيات النمو والمبيعات التجارية',
      },
      description: {
        en: 'We uncover opportunities to increase revenue, improve customer acquisition, strengthen retention, and build more scalable commercial models.',
        ar: 'نكتشف فرص زيادة الإيرادات، وتحسين معدلات اكتساب العملاء، وتعزيز الاحتفاظ بهم، وبناء نماذج تجارية عالية الكفاءة وقابلة للتوسع.',
      },
      diagramType: 'growth-trajectory-engine',
      tag: { en: 'Revenue Growth', ar: 'نمو الإيرادات' },
    },
    {
      title: {
        en: 'E-Commerce & Digital Channel Strategy',
        ar: 'استراتيجيات التجارة الإلكترونية والقنوات الرقمية',
      },
      description: {
        en: 'We define the right platforms, channels, customer journeys, and performance priorities to accelerate digital commerce growth and margin velocity.',
        ar: 'نحدد المنصات والقنوات ورحلات العملاء وأولويات الأداء الرقمي لتسريع نمو التجارة الإلكترونية وتعظيم هوامش الربحية.',
      },
      diagramType: 'storefront-render-matrix',
      tag: { en: 'Omnichannel', ar: 'التجارة المتعددة' },
    },
    {
      title: {
        en: 'Operational Excellence & Process Optimization',
        ar: 'التميز التشغيلي وتحسين مسارات العمل',
      },
      description: {
        en: 'We redesign workflows, remove inefficiencies, and establish clearer operating models that improve productivity, speed, and business performance.',
        ar: 'نعيد تصميم مسارات العمل ونزيل الهدر التشغيلي ونؤسس نماذج تشغيل أكثر وضوحاً لرفع الإنتاجية والسرعة والأداء العام.',
      },
      diagramType: 'autonomous-workflow-engine',
      tag: { en: 'Operations', ar: 'الكفاءة التشغيلية' },
    },
    {
      title: {
        en: 'Market Intelligence & Data Analytics',
        ar: 'استخبارات السوق والتحليلات البيانية',
      },
      description: {
        en: 'We transform market research, customer insights, competitive intelligence, and performance telemetry into clear strategic decisions.',
        ar: 'نحول أبحاث السوق، ورؤى العملاء، والمعلومات التنافسية، وبيانات الأداء اللحظية إلى قرارات استراتيجية حاسمة تسبق المنافسين.',
      },
      diagramType: 'bar-spectrum-analyzer',
      tag: { en: 'Intelligence', ar: 'التحليلات الذكية' },
    },
  ] as SolutionOfferingItem[],

  whyItMatters: {
    title: {
      en: 'Actionable Insights, Measurable Results',
      ar: 'رؤى قابلة للتنفيذ، ونتائج استثنائية قابلة للقياس',
    },
    text: {
      en: 'Turning business ambition into an actionable roadmap requires combining market intelligence with pragmatic execution. We don\'t deliver theoretical slide decks; we engineer living growth systems that align leadership, operations, and technology around validated financial outcomes.',
      ar: 'يتطلب تحويل الطموح إلى خارطة طريق واقعية مزج استخبارات السوق بالتنفيذ العملي الدقيق. نحن لا نكتفي بتقديم عروض تقديمية نظرية؛ بل نبني منظومات نمو حية توحد القيادة والعمليات والتقنية حول نتائج مالية مثبتة.',
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85',
  },

  benefitsStrip: {
    title: {
      en: 'Why Partner With Persici Advisory',
      ar: 'لماذا تختار شراكة بيرسيشي للاستشارات الاستراتيجية',
    },
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=85',
    benefits: [
      {
        title: {
          en: 'Data-Driven Frameworks',
          ar: 'أطر عمل قائمة على البيانات',
        },
        description: {
          en: 'Every strategic recommendation is backed by thorough quantitative research, market telemetry, and unit economics—not subjective intuition.',
          ar: 'كل توصية استراتيجية مدعومة بأبحاث كمية معمقة وبيانات سوقية حقيقية واقتصاديات وحدة سليمة بعيداً عن الحدس غير المدروس.',
        },
        accentColor: '#D83427',
      },
      {
        title: {
          en: 'Pragmatic Execution Roadmaps',
          ar: 'خرائط تنفيذ عملية وسلسة',
        },
        description: {
          en: 'We bridge the gap between high-level strategy and technical delivery, ensuring every blueprint is immediately deployable by agile squads.',
          ar: 'نجسر الفجوة بين الاستراتيجية العليا والتنفيذ التقني لضمان جاهزية كل مخطط للتطبيق الفوري عبر فرق العمل الرشيقة.',
        },
        accentColor: '#EF8C7D',
      },
      {
        title: {
          en: 'Tailored Industry Ecosystems',
          ar: 'منظومات مخصصة لطبيعة قطاعك',
        },
        description: {
          en: 'Custom advisory models calibrated specifically to your regulatory environment, competitive density, and enterprise scale.',
          ar: 'نماذج استشارية مصممة خصيصاً وفق البيئة التنظيمية وكثافة المنافسة وحجم مؤسستك لضمان أعلى عائد استثماري.',
        },
        accentColor: '#121212',
      },
    ] as SolutionBenefitItem[],
  },

  engagementModel: {
    title: {
      en: 'Strategic Engagement Model',
      ar: 'نموذج المشاركة والاستشارات الاستراتيجية',
    },
    subtitle: {
      en: 'How we deliver measurable business transformation from diagnosis to sustainable governance.',
      ar: 'كيف نُحقق التحول التجاري القابل للقياس بدءاً من التقييم الشامل وحتى الحوكمة المستدامة.',
    },
    steps: [
      {
        number: '01',
        title: {
          en: 'Discovery & Assessment',
          ar: 'الاستكشاف والتقييم المعمق',
        },
        description: {
          en: 'Deep-dive analysis of your current business model, technical capabilities, customer journeys, and performance telemetry.',
          ar: 'تحليل شامل لنموذج عملك الحالي وقدراتك التقنية ورحلات العملاء وبيانات الأداء التشغيلي.',
        },
      },
      {
        number: '02',
        title: {
          en: 'Strategy Blueprinting',
          ar: 'تصميم المخطط الاستراتيجي',
        },
        description: {
          en: 'Architecting tailored transformation frameworks, validated growth priorities, and actionable operational milestones.',
          ar: 'بناء أطر التحول المخصصة، وتحديد أولويات النمو المثبتة، ومحطات الإنجاز التشغيلية القابلة للتحقق.',
        },
      },
      {
        number: '03',
        title: {
          en: 'Execution & Stakeholder Alignment',
          ar: 'التنفيذ ومواءمة فرق العمل',
        },
        description: {
          en: 'Aligning leadership and engineering squads, setting North Star KPIs, and integrating modern toolchains for rapid rollout.',
          ar: 'مواءمة الإدارات وفرق التطوير، وتحديد مؤشرات الأداء الحاكمة، ودمج أدوات العمل الحديثة للإطلاق السريع.',
        },
      },
      {
        number: '04',
        title: {
          en: 'Optimization & Governance',
          ar: 'التحسين المستمر والحوكمة',
        },
        description: {
          en: 'Continuous real-time measurement, market feedback loops, agile pivots, and executive advisory governance.',
          ar: 'قياس الأداء اللحظي، ومسارات التغذية الراجعة من السوق، والتعديل المرن، وحوكمة التوجيه الاستشاري المستمر.',
        },
      },
    ],
  },

  techStackPods: [
    {
      title: { en: 'Strategic Intelligence', ar: 'ذكاء الأعمال والاستراتيجية' },
      badge: { en: 'Analytics', ar: 'التحليلات' },
      description: {
        en: 'Advanced market telemetry and competitive intelligence platforms.',
        ar: 'منصات متقدمة لرصد استخبارات السوق وتحليلات المنافسة.',
      },
      technologies: [
        { name: 'Tableau', category: 'BI' },
        { name: 'Power BI', category: 'Enterprise' },
        { name: 'Google Looker', category: 'Data Cloud' },
        { name: 'Amplitude', category: 'Product Analytics' },
        { name: 'Gartner Telemetry', category: 'Intelligence' },
      ],
    },
    {
      title: { en: 'Digital Architecture & Cloud', ar: 'المعمارية الرقمية والسحابية' },
      badge: { en: 'Cloud Platforms', ar: 'المنصات السحابية' },
      description: {
        en: 'Modern scalable platforms and composable microservices.',
        ar: 'منصات حديثة قابلة للتوسع وهياكل برمجية مجمعة.',
      },
      technologies: [
        { name: 'AWS', category: 'Cloud' },
        { name: 'Google Cloud', category: 'Cloud' },
        { name: 'Microsoft Azure', category: 'Enterprise' },
        { name: 'Cloudflare', category: 'Edge' },
        { name: 'Kubernetes', category: 'Orchestration' },
      ],
    },
    {
      title: { en: 'Commerce & CRM Ecosystems', ar: 'منظومات التجارة وإدارة العملاء' },
      badge: { en: 'Ecosystems', ar: 'المنظومات' },
      description: {
        en: 'Enterprise omnichannel commerce and relationship orchestration engines.',
        ar: 'محركات التجارة الموحدة وإدارة علاقات العملاء المؤسسية.',
      },
      technologies: [
        { name: 'Salesforce', category: 'CRM' },
        { name: 'Shopify Plus', category: 'Commerce' },
        { name: 'Braze', category: 'Engagement' },
        { name: 'Klaviyo', category: 'Retention' },
        { name: 'Commercetools', category: 'Headless' },
      ],
    },
  ] as TechInfrastructurePod[],

  quote: {
    text: {
      en: 'Persici gave our executive team clarity where there was noise. Their strategic roadmap aligned our digital products with revenue milestones, generating a 3.4x ROI in the first year.',
      ar: 'منحت بيرسيشي قيادتنا التنفيذية وضوحاً تاماً في مرحلة حرجة. وحدت خارطة طريقهم منتجاتنا الرقمية مع محطات الإيرادات، محققة عائداً استثمارياً قدره 3.4x في العام الأول.',
    },
    author: 'Faisal Al-Rasheed',
    role: {
      en: 'Managing Director, Horizon Commercial Holdings',
      ar: 'العضو المنتدب، شركة هورايزون القابضة للتجارة',
    },
  },

  faqs: [
    {
      question: {
        en: 'How is Persici’s advisory different from traditional management consulting?',
        ar: 'ما الذي يميز استشارات بيرسيشي عن شركات الاستشارات الإدارية التقليدية؟',
      },
      answer: {
        en: 'Traditional firms leave you with theoretical slide decks. Persici pairs senior strategists directly with hands-on product managers and software engineers, ensuring every strategy is technically feasible and immediately built.',
        ar: 'تكتفي الشركات التقليدية بتقديم شرائح عرض نظرية. بينما تجمع بيرسيشي بين كبار المستشارين الاستراتيجيين ومديري المنتجات ومهندسي البرمجيات لضمان جدوى كل استراتيجية وبنائها فورياً.',
      },
    },
    {
      question: {
        en: 'How long does a strategic assessment take?',
        ar: 'كم يستغرق التقييم الاستراتيجي الأولي؟',
      },
      answer: {
        en: 'Our rapid discovery sprint typically takes 2 to 3 weeks, concluding with an executive strategy briefing and a fully prioritized 12-month execution roadmap.',
        ar: 'تستغرق مرحلة الاستكشاف والتقييم السريع من أسبوعين إلى 3 أسابيع، وتنتهي بتقرير تنفيذي مفصل وخارطة طريق تنفيذية محددة الأولويات لمدة 12 شهراً.',
      },
    },
    {
      question: {
        en: 'Can you assist with the execution of the strategy?',
        ar: 'هل تشاركون في تنفيذ الاستراتيجية على أرض الواقع؟',
      },
      answer: {
        en: 'Yes. Our agile pods can deploy immediately alongside your internal teams to build the platforms, launch the marketing campaigns, and measure KPIs.',
        ar: 'نعم بالتأكيد. يمكن لفرق العمل الرشيقة لدينا البدء فوراً إلى جانب كوادركم لبناء المنصات وإطلاق الحملات وقياس النتائج خطوة بخطوة.',
      },
    },
  ] as SolutionFaqItem[],
};
