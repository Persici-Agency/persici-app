import type {
  SolutionOfferingItem,
  SolutionBenefitItem,
  TechInfrastructurePod,
  SolutionFaqItem,
} from '@shared/types';

export const productManagementData = {
  hero: {
    title: {
      en: 'Product Thinking That Drives Organizational Transformation',
      ar: 'التفكير المتمحور حول المنتج الذي يقود التحول المؤسسي',
    },
    subtitle: {
      en: 'Sustainable growth comes from an ongoing cycle of identifying, creating, and delivering value. We embed agility into business models through evolving culture, smarter ways of working, clear metrics, and living digital platforms.',
      ar: 'يتحقق النمو المستدام عبر دورات مستمرة لتحديد وخلق وتسليم القيمة. نرسخ المرونة في نماذج الأعمال عبر ثقافة متطورة، وأساليب عمل ذكية، ومقاييس واضحة، ومنصات رقمية حية تتطور باستمرار.',
    },
    tag: {
      en: 'Product Management',
      ar: 'إدارة المنتجات',
    },
    secondaryTag: {
      en: 'Living Products',
      ar: 'المنتجات الحية',
    },
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1400&q=85',
    ctaText: {
      en: 'Explore Product Thinking',
      ar: 'استكشف منهجية المنتج',
    },
    ctaHref: '#capabilities',
  },

  offeringsTitle: {
    en: '5 Pillars of Modern Product Management',
    ar: 'الركائز الخمس لإدارة المنتجات الحديثة',
  },
  offeringsSubtitle: {
    en: 'Starting with empowered teams, we scale agility across your organization to achieve lasting customer and business impact.',
    ar: 'بدءاً من فرق العمل الممكنة والمستقلة، نوسع نطاق المرونة المؤسسية لتحقيق أثر تجاري دائم وتجربة عملاء متفوقة.',
  },

  offerings: [
    {
      title: {
        en: 'Outcome-Driven Roadmapping',
        ar: 'خرائط طريق موجهة بالنتائج المحققة',
      },
      description: {
        en: 'Shifting from rigid feature backlogs to outcome-focused roadmaps that tie engineering sprints directly to measurable commercial KPIs.',
        ar: 'الانتقال من قوائم المزايا الجامدة إلى خرائط طريق تركز على النتائج وتربط دورات التطوير البرمجي مباشرة بمؤشرات الأداء التجارية.',
      },
      diagramType: 'ux-strategy-compass',
      tag: { en: 'Roadmapping', ar: 'خرائط الطريق' },
    },
    {
      title: {
        en: 'Autonomous Cross-Functional Pods',
        ar: 'فرق عمل متكاملة ومستقلة (Pods)',
      },
      description: {
        en: 'Co-locating dedicated product managers, UX designers, and cloud developers to eliminate approval bottlenecks and accelerate velocity.',
        ar: 'دمج مديري المنتجات، ومصممي التجارب، ومطوري السحابة في فرق عمل موحدة لإلغاء أي عقبات روتينية وتسريع وتيرة التسليم.',
      },
      diagramType: 'ux-wireframe-blueprint',
      tag: { en: 'Agile Pods', ar: 'فرق العمل الرشيقة' },
    },
    {
      title: {
        en: 'Continuous Discovery & Validation',
        ar: 'الاستكشاف والتحقق المستمر من الطلب',
      },
      description: {
        en: 'Weekly user testing, qualitative customer interviews, and behavioral analytics ensuring every feature solves proven customer pain.',
        ar: 'اختبارات أسبوعية مع المستخدمين، ومقابلات نوعية، وتحليلات سلوكية تضمن حل كل ميزة لمشكلة حقيقية مثبتة لدى العميل.',
      },
      diagramType: 'ux-journey-flowchart',
      tag: { en: 'User Validation', ar: 'التحقق من المستخدم' },
    },
    {
      title: {
        en: 'North Star & Value Stream Metrics',
        ar: 'مؤشرات النجم الشمالي وقنوات القيمة',
      },
      description: {
        en: 'Establishing granular telemetry that tracks user activation, cohort retention, and margin impact across the product lifecycle.',
        ar: 'تأسيس منظومة قياس دقيقة تتتبع تفعيل المستخدمين، والاحتفاظ بالمجموعات، وهوامش الربحية طوال دورة حياة المنتج.',
      },
      diagramType: 'ux-design-token-matrix',
      tag: { en: 'Value Streams', ar: 'مسارات القيمة' },
    },
    {
      title: {
        en: 'Living Product Evolution',
        ar: 'هندسة تطور المنتجات الحية',
      },
      description: {
        en: 'Architecting modular software that adapts iteratively to customer feedback and new market opportunities without disruptive rewrites.',
        ar: 'بناء برمجيات معيارية تتطور بشكل تكراري مع آراء العملاء وفرص السوق الجديدة دون الحاجة إلى إعادة بناء مكلفة.',
      },
      diagramType: 'ux-prototype-interaction',
      tag: { en: 'Living Systems', ar: 'الأنظمة الحية' },
    },
  ] as SolutionOfferingItem[],

  whyItMatters: {
    title: {
      en: 'From Fixed Projects to Living Products',
      ar: 'من المشاريع المؤقتة إلى المنتجات الحية المتطورة',
    },
    text: {
      en: 'Traditional project management stops when software goes live. But true digital value starts at launch. By shifting to a product mindset, organizations continuously inspect telemetry, refine customer experiences, and unlock incremental revenue every single week.',
      ar: 'تنتهي إدارة المشاريع التقليدية بمجرد إطلاق النظام. لكن القيمة الرقمية الحقيقية تبدأ لحظة الإطلاق. عبر التحول إلى عقلية المنتجات الحية، تستمر المؤسسات في تحليل البيانات وتحسين التجارب ومضاعفة الإيرادات أسبوعاً بعد أسبوع.',
    },
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
  },

  benefitsStrip: {
    title: {
      en: 'Measurable Product Management Impact',
      ar: 'أثر ملموس لإدارة المنتجات الذكية',
    },
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1400&q=85',
    benefits: [
      {
        title: {
          en: 'Value-Driven Sprints',
          ar: 'دورات تطوير موجهة بالقيمة',
        },
        description: {
          en: 'Every two-week sprint delivers functioning, tested software that moves validated business metrics.',
          ar: 'كل أسبوعين من التطوير يسفر عن برمجيات جاهزة ومختبرة تحرك مؤشرات الأداء الحقيقية للأعمال.',
        },
        accentColor: '#D83427',
      },
      {
        title: {
          en: 'Reduced Engineering Waste',
          ar: 'الحد من الهدر البرمجي',
        },
        description: {
          en: 'Validating concepts before writing code prevents building complex features that customers never use.',
          ar: 'التحقق من المفاهيم قبل البرمجة يمنع بناء مزايا معقدة لا تحقق رغبات المستخدمين وتستنزف الميزانيات.',
        },
        accentColor: '#EF8C7D',
      },
      {
        title: {
          en: 'Autonomous Team Velocity',
          ar: 'سرعة واستقلالية الفرق',
        },
        description: {
          en: 'Empowered squads make rapid daily decisions guided by clear North Star goals and shared telemetry.',
          ar: 'فرق عمل مستقلة تتخذ قرارات يومية سريعة وموجهة بهدف النجم الشمالي المشترك وبيانات الأداء اللحظية.',
        },
        accentColor: '#121212',
      },
    ] as SolutionBenefitItem[],
  },

  techStackPods: [
    {
      title: { en: 'Discovery & User Analytics', ar: 'الاستكشاف وتحليلات سلوك المستخدم' },
      badge: { en: 'Analytics', ar: 'التحليلات' },
      description: {
        en: 'Continuous telemetry on user behavior and engagement cohorts.',
        ar: 'رصد لحظي لسلوك المستخدمين وتفاعل الفئات المختلفة.',
      },
      technologies: [
        { name: 'Amplitude', category: 'Product Analytics' },
        { name: 'Mixpanel', category: 'Funnels' },
        { name: 'FullStory', category: 'Session Replay' },
        { name: 'Hotjar', category: 'Heatmaps' },
        { name: 'Google Analytics 4', category: 'Attribution' },
      ],
    },
    {
      title: { en: 'Product Management & Backlog', ar: 'إدارة المنتجات وخرائط الطريق' },
      badge: { en: 'Roadmaps', ar: 'خرائط الطريق' },
      description: {
        en: 'Strategic roadmapping and sprint orchestration tools.',
        ar: 'أدوات بناء خرائط الطريق الاستراتيجية وإدارة دورات التطوير.',
      },
      technologies: [
        { name: 'Productboard', category: 'Roadmapping' },
        { name: 'Linear', category: 'Issue Tracking' },
        { name: 'Jira Software', category: 'Agile Sprints' },
        { name: 'Notion Enterprise', category: 'Specs & Docs' },
        { name: 'Aha!', category: 'Strategy' },
      ],
    },
    {
      title: { en: 'Prototyping & Co-Creation', ar: 'النماذج الأولية والتصميم المشترك' },
      badge: { en: 'Prototyping', ar: 'النماذج الأولية' },
      description: {
        en: 'High-fidelity prototyping and interactive design systems.',
        ar: 'نماذج أولية عالية الدقة وأنظمة تصميم تفاعلية موحدة.',
      },
      technologies: [
        { name: 'Figma', category: 'Design UI' },
        { name: 'FigJam', category: 'Workshops' },
        { name: 'Miro', category: 'Journey Maps' },
        { name: 'Maze', category: 'User Testing' },
        { name: 'UserTesting', category: 'Feedback' },
      ],
    },
  ] as TechInfrastructurePod[],

  quote: {
    text: {
      en: 'Persici embedded product managers into our squads who completely changed how we work. Instead of arguing about opinions, we now make decisions based on user telemetry and ship features 3x faster.',
      ar: 'أدمجت بيرسيشي قادة منتجات محترفين داخل فرقنا غيروا أسلوب العمل كلياً. بدلاً من الجدال حول الآراء الشخصية، أصبحنا نتخذ القرارات بناءً على سلوك المستخدمين ونطلق المزايا أسرع بثلاث مرات.',
    },
    author: 'Majed Al-Ghamdi',
    role: {
      en: 'Head of Digital Products, Saudi Retail Tech Group',
      ar: 'رئيس المنتجات الرقمية، المجموعة السعودية لتقنية التجزئة',
    },
  },

  faqs: [
    {
      question: {
        en: 'What is the role of a Persici product manager in our organization?',
        ar: 'ما هو دور مدير المنتج من بيرسيشي داخل مؤسستنا؟',
      },
      answer: {
        en: 'Our product managers serve as the strategic nexus between business leadership, design, and engineering. They define the product vision, prioritize the roadmap based on ROI, run user testing, and ensure cross-functional execution.',
        ar: 'يعمل مديرو المنتجات لدينا كحلقة وصل استراتيجية بين الإدارة التنفيذية والتصميم والهندسة البرمجية. يحددون رؤية المنتج، ويرتبون الأولويات وفق العائد المالي، ويجرون اختبارات المستخدمين، ويضمنون سلامة التنفيذ.',
      },
    },
    {
      question: {
        en: 'How do you transition from feature-focused to outcome-focused product development?',
        ar: 'كيف ننتقل من التركيز على المزايا إلى التطوير الموجه بالنتائج؟',
      },
      answer: {
        en: 'We establish clear North Star metrics (e.g. conversion rate, active retention, checkout completion) and organize sprints around moving those specific numbers, rather than checking off feature lists.',
        ar: 'نحدد مؤشرات النجم الشمالي الرئيسية (مثل معدل التحويل، ونسبة الاحتفاظ النشط، وإتمام عمليات الشراء) وننظم دورات التطوير حول تحريك تلك الأرقام بدلاً من مجرد إكمال قوائم المزايا الشكلية.',
      },
    },
    {
      question: {
        en: 'Do you train our internal product teams during the engagement?',
        ar: 'هل تدربون كوادر المنتجات الداخلية لدينا خلال فترة العمل؟',
      },
      answer: {
        en: 'Yes. Knowledge transfer and capability building are core to our model. We pair our senior product leads with your staff and run hands-on workshops on modern product discovery and agile ceremonies.',
        ar: 'نعم بالتأكيد. بناء القدرات الداخلية ونقل المعرفة ركن أساسي في نموذجنا. نقرن قادة المنتجات لدينا بكوادركم ونقدم ورش عمل عملية في استكشاف المنتجات والطقوس الرشيقة الحديثة.',
      },
    },
  ] as SolutionFaqItem[],
};
