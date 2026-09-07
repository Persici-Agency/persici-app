import type { SolutionDiagramType, FeaturedClientStoryItem, SolutionBenefitItem, SolutionExecutionPillar, SolutionFaqItem } from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { getMarketingFeaturedClientStories } from '@shared/data';

export interface MarketingOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface MarketingVerticalItem {
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

export interface MarketingCommunicationsData {
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
  offerings: MarketingOfferingItem[];
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
  verticals: MarketingVerticalItem[];
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

export const marketingCommunicationsData: MarketingCommunicationsData = {
  hero: {
    tag: {
      en: 'Solutions & Growth',
      ar: 'الحلول واستراتيجيات النمو',
    },
    secondaryTag: {
      en: 'Marketing & Communications',
      ar: 'التسويق والاتصال المؤسسي',
    },
    title: {
      en: 'Full-Funnel Marketing & Brand Communications That Drive Real Growth',
      ar: 'استراتيجيات تسويق واتصال مؤسسي متكاملة تصنع نمواً مستداماً',
    },
    subtitle: {
      en: 'At Persici, we unite brand positioning, high-impact creative storytelling, omnichannel media execution, and real-time attribution under one unified strategic direction to turn audience attention into measurable market leadership.',
      ar: 'في بيرسيكي، نوحد التموضع الاستراتيجي للعلامة التجارية، والسرد الإبداعي المؤثر، وإدارة الحملات متعددة القنوات، والتحليل اللحظي للأداء تحت مظلة واحدة لتحويل انتباه الجمهور إلى ريادة سوقية حقيقية.',
    },
    ctaText: {
      en: 'Schedule Strategy Session',
      ar: 'احجز استشارة استراتيجية',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85',
    highlights: [
      {
        en: 'Distinctive Brand Positioning & Omnichannel Market Narrative',
        ar: 'تموضع فريد للعلامة وسرد تسويقي متكامل عبر كافة المنصات',
      },
      {
        en: 'High-Impact Creative Production (Cinematic Video, 3D Motion & Social-First)',
        ar: 'إنتاج إبداعي فائق الجودة (فيديو سينمائي، موشن ثلاثي الأبعاد ومحتوى اجتماعي)',
      },
      {
        en: 'Data-Driven Performance Buying across Meta, Google, TikTok & LinkedIn',
        ar: 'شراء وسائط مدفوعة بالأداء والبيانات عبر ميتا، جوجل، تيك توك ولينكد إن',
      },
      {
        en: 'Predictable Full-Funnel Attribution & Sustainable ROAS Scaling',
        ar: 'تحليل دقيق لكامل مسار التحويل ومضاعفة العائد على الإنفاق الإعلاني',
      },
    ],
  },

  offeringsTitle: {
    en: 'Integrated Marketing Capabilities',
    ar: 'قدرات التسويق والاتصال المتكاملة',
  },
  offeringsSubtitle: {
    en: 'Connecting every stage of the brand and customer journey—from foundational positioning to profitable full-funnel customer acquisition.',
    ar: 'ربط كافة مراحل رحلة العميل والعلامة التجارية—من التموضع التأسيسي حتى الاستحواذ المربح والمستدام على العملاء.',
  },
  offerings: [
    {
      slug: 'brand-strategy-positioning',
      tag: { en: 'Market Leadership', ar: 'الريادة السوقية' },
      title: { en: 'Brand Strategy & Positioning', ar: 'استراتيجية العلامة التجارية والتموضع' },
      description: {
        en: 'We define a distinctive brand position, value proposition, tone of voice, and market narrative that create relevance, differentiation, and long-term brand equity.',
        ar: 'نصيغ تموضعاً فريداً لعلامتك التجارية، وقيمة مقترحة مميزة، ونبرة صوت وسرداً تسويقياً يخلق تفاوتاً تنافسياً ويبني قيمة مستدامة على المدى الطويل.',
      },
      icon: '/icons/solutions/mkt-brand-strategy.svg',
      diagramType: 'prism-refraction-beam',
      highlights: {
        en: ['Value Proposition Design', 'Brand Architecture & Persona', 'Competitive Whitespace Audit', 'Verbal & Visual Identity Guidelines'],
        ar: ['تصميم القيمة المقترحة', 'هيكلية وهوية العلامة', 'تحليل الفجوات التنافسية', 'إرشادات الهوية اللفظية والبصرية'],
      },
    },
    {
      slug: 'creative-storytelling',
      tag: { en: 'Creative Excellence', ar: 'الإبداع والسرد' },
      title: { en: 'Content & Creative Storytelling', ar: 'المحتوى والسرد القصصي الإبداعي' },
      description: {
        en: 'We transform brand ideas into compelling creative concepts, emotional campaigns, and narrative hooks designed to capture attention and forge deep audience loyalty.',
        ar: 'نحول أفكار علامتك التجارية إلى مفاهيم إبداعية آسرة، وحملات عاطفية وسرد مشوق يجذب الانتباه ويبني ولاءً عميقاً وطويل الأمد لدى الجمهور.',
      },
      icon: '/icons/solutions/mkt-creative-storytelling.svg',
      diagramType: 'creative-story-lens',
      highlights: {
        en: ['Emotional Narrative Hooks', '3D Motion & Kinetic Type', 'Social-First Content Systems', 'Bilingual GCC Copywriting'],
        ar: ['حبكات سردية عاطفية', 'موشن ثلاثي الأبعاد ونصوص حركية', 'أنظمة محتوى مخصصة للمنصات', 'صياغة إبداعية ثنائية اللغة'],
      },
    },
    {
      slug: 'integrated-omnichannel-campaigns',
      tag: { en: 'Campaign Orchestration', ar: 'إدارة الحملات' },
      title: { en: 'Integrated Omnichannel Campaigns', ar: 'الحملات المتكاملة متعددة القنوات' },
      description: {
        en: 'We orchestrate connected multi-platform campaigns across digital, social, performance ads, PR, and experiential touchpoints to deliver one cohesive brand impact.',
        ar: 'نخطط وننفذ حملات مترابطة تجمع بين القنوات الرقمية، ووسائل التواصل، والإعلانات الممولة، والعلاقات العامة لتقديم تجربة علامة موحدة ومؤثرة.',
      },
      icon: '/icons/solutions/mkt-integrated-campaigns.svg',
      diagramType: 'omnichannel-radial-mesh',
      highlights: {
        en: ['360° Media Mix Planning', 'Unified Audience Retargeting', 'Cross-Platform Frequency Capping', 'High-Impact Brand Launches'],
        ar: ['تخطيط إعلامي شامل 360°', 'إعادة استهداف موحدة للجمهور', 'ضبط وتيرة الظهور عبر المنصات', 'إطلاق مدوٍ للعلامات والمنتجات'],
      },
    },
    {
      slug: 'social-media-community',
      tag: { en: 'Social Resonance', ar: 'التفاعل الاجتماعي' },
      title: { en: 'Social Media & Community Engagement', ar: 'إدارة التواصل وبناء المجتمعات' },
      description: {
        en: 'Platform-specific distribution strategies that build brand authority, foster loyal organic communities, and turn everyday social interactions into customer advocacy.',
        ar: 'استراتيجيات نشر مخصصة لكل منصة تعزز مصداقية علامتك التجارية، وتبني مجتمعات نشطة تحول التفاعلات اليومية إلى ولاء ومناصرة حقيقية.',
      },
      icon: '/icons/solutions/mkt-social-engagement.svg',
      diagramType: 'social-resonance-echo',
      highlights: {
        en: ['TikTok & Reels Velocity', 'GCC Cultural Relevance & Tone', 'Influencer & Creator Alignment', 'Active Sentiment Moderation'],
        ar: ['إنتاج مكثف لتيك توك وريلز', 'ملاءمة ثقافية خليجية أصيلة', 'إدارة صناع المحتوى والمؤثرين', 'إشراف ورصد فوري للمشاعر'],
      },
    },
    {
      slug: 'data-driven-analytics',
      tag: { en: 'Performance Rigor', ar: 'التحليل والأداء' },
      title: { en: 'Data-Driven Marketing & Analytics', ar: 'التسويق المدفوع بالبيانات والتحليلات' },
      description: {
        en: 'We leverage audience intelligence, multi-touch attribution modeling, and rigorous A/B experimentation to maximize marketing ROI and remove budget waste.',
        ar: 'نوظف ذكاء الجمهور، ونماذج الإسناد متعددة اللمسات، والاختبارات التجريبية الدقيقة لتعظيم العائد على الاستثمار التسويقي والقضاء على هدر الميزانيات.',
      },
      icon: '/icons/solutions/mkt-data-analytics.svg',
      diagramType: 'bar-spectrum-analyzer',
      highlights: {
        en: ['Multi-Touch Attribution', 'Cohort Lifetime Value Modeling', 'Real-Time ROAS Dashboards', 'Predictive Churn Prevention'],
        ar: ['إسناد متعدد اللمسات للمبيعات', 'نمذجة القيمة الدائمة للعملاء', 'لوحات تحكم لحظية للعائد الإعلاني', 'تنبؤ استباقي ومكافحة التسرب'],
      },
    },
    {
      slug: 'media-content-production',
      tag: { en: 'Studio Production', ar: 'الإنتاج الإعلامي' },
      title: { en: 'Media & Content Production', ar: 'الإنتاج الإعلامي وصناعة المحتوى' },
      description: {
        en: 'From high-concept television commercials and cinematic brand documentaries to editorial photography and high-volume social assets, executed from concept to final delivery.',
        ar: 'من الإعلانات التلفزيونية السينمائية والأفلام الوثائقية للعلامات التجارية إلى جلسات التصوير الفوتوغرافي الاحترافية والمحتوى الرقمي عالي الكثافة.',
      },
      icon: '/icons/solutions/mkt-media-production.svg',
      diagramType: 'media-production-timeline',
      highlights: {
        en: ['Cinematic Brand Commercials', 'Commercial Product Photography', 'High-Speed VFX & Motion Graphics', 'Turnkey Production Studio'],
        ar: ['إعلانات تجارية سينمائية', 'تصوير احترافي للمنتجات', 'مؤثرات بصرية وموشن جرافيك', 'إدارة إنتاج متكاملة وشاملة'],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Fragmented marketing erodes brand trust and burns capital. Connected communications compound value.',
      ar: 'التسويق المجزأ يهدر الميزانيات ويضعف ثقة الجمهور. الاتصال المترابط يضاعف القيمة والأرباح.',
    },
    text: {
      en: 'In an era of ad fatigue and platform volatility, disjointed campaigns, inconsistent agency retainers, and isolated creative executions fail to move the commercial needle. Sustainable brand momentum requires full-funnel coherence—where brand identity, compelling storytelling, precision paid acquisition, and behavioral data operate in synchronized harmony.',
      ar: 'في عصر يعاني فيه الجمهور من التشبع الإعلاني، لم تعد الحملات المنعزلة والرسائل غير المترابطة قادرة على تحقيق نمو حقيقي. النجاح التسويقي المستدام يتطلب تناغماً شاملاً لكامل مسار التحويل، حيث تعمل الهوية الفريدة، والسرد الإبداعي، والاستحواذ الإعلاني الموجه، وتحليلات السلوك كمنظومة متصلة تصنع تأثيراً لا يُنسى.',
    },
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=85',
    metric1Val: '3.8x',
    metric1Label: {
      en: 'Average Increase in Return on Ad Spend (ROAS)',
      ar: 'متوسط مضاعفة العائد على الإنفاق الإعلاني للمؤسسات',
    },
    metric2Val: '+310%',
    metric2Label: {
      en: 'Higher Brand Recall Across GCC Target Demographics',
      ar: 'ارتفاع في ترسيخ العلامة في أذهان الجمهور الخليجي المستهدف',
    },
  },

  benefitsStrip: {
    title: {
      en: 'Strategic Advantages of Full-Funnel Marketing & Communications',
      ar: 'المزايا الاستراتيجية لاستراتيجيات التسويق والاتصال المتكاملة',
    },
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=85',
    benefits: [
      {
        title: { en: 'Unified Omnichannel Narrative', ar: 'سرد موحد عبر كافة القنوات' },
        description: {
          en: 'Eliminate channel cannibalization with one consistent voice across paid, owned, and earned media.',
          ar: 'القضاء على تضارب الرسائل الإعلانية عبر صوت متسق وموحد في الوسائط المدفوعة والمملوكة والمكتسبة.',
        },
      },
      {
        title: { en: 'Lower Customer Acquisition Cost', ar: 'خفض كلفة الاستحواذ على العملاء' },
        description: {
          en: 'Emotionally resonant creative hooks earn attention organically, dramatically lowering paid auction bids.',
          ar: 'ابتكارات إبداعية تلامس مشاعر الجمهور وتجذب انتباههم طبيعياً، مما يخفض تكاليف المزايدات الإعلانية.',
        },
      },
      {
        title: { en: 'Authentic GCC Cultural Resonance', ar: 'أصالة وملاءمة ثقافية خليجية' },
        description: {
          en: 'Bilingual messaging that moves past literal translation into deep regional nuances across Saudi and UAE markets.',
          ar: 'صياغة ثنائية اللغة تتجاوز الترجمة الحرفية إلى عمق النبرة والمفاهيم الثقافية في السوق السعودي والإماراتي.',
        },
      },
      {
        title: { en: 'Closed-Loop Revenue Attribution', ar: 'إسناد مالي دقيق للإيرادات' },
        description: {
          en: 'Trace every dollar from top-of-funnel creative impressions to verified bottom-line bank deposits.',
          ar: 'تتبع كل ريال أو درهم من أول ظهور إعلاني حتى إتمام المعاملة في الحسابات المصرفية بدقة متناهية.',
        },
      },
    ],
  },

  verticalsTitle: {
    en: 'Specialized Industry Verticals',
    ar: 'القطاعات والصناعات المتخصصة',
  },
  verticalsSubtitle: {
    en: 'Tailored marketing frameworks engineered for the commercial realities and buyer journeys of GCC markets.',
    ar: 'أطر عمل تسويقية مصممة خصيصاً للواقع التجاري ومسارات الشراء الفريدة في الأسواق الخليجية والعالمية.',
  },
  verticals: [
    {
      id: 'luxury-goods',
      number: '01',
      tag: { en: 'Prestige & Craft', ar: 'الفخامة والأناقة' },
      title: { en: 'Luxury Fragrance, Jewelry & Fine Goods', ar: 'العطور الفاخرة، المجوهرات والمنتجات الراقية' },
      description: {
        en: 'Bespoke bottle design, artisanal packaging architecture, sensory storytelling, and ultra-high-net-worth customer engagement for premium GCC houses.',
        ar: 'تصميم مخصص لعبوات العطور والمنتجات، وهندسة تغليف حرفية وسرد حسي يجذب عملاء النخبة والمقتنين في الخليج.',
      },
      iconName: 'TbDiamond',
      capabilities: {
        en: ['Sensory Storytelling & Unboxing', 'Boutique Retail Experience', 'VIP Client Acquisition', 'GCC Heritage Positioning'],
        ar: ['سرد حسي وتجربة فتح الصندوق', 'تجارب التجزئة في البوتيكات الفاخرة', 'استقطاب كبار الشخصيات VIP', 'تموضع يبرز الأصالة الخليجية'],
      },
    },
    {
      id: 'destinations-lifestyle',
      number: '02',
      tag: { en: 'Experiential Destinations', ar: 'الوجهات وأسلوب الحياة' },
      title: { en: 'Real Estate & Urban Lifestyle Destinations', ar: 'العقارات والوجهات السياحية ونمط الحياة' },
      description: {
        en: 'Cinematic visual campaigns for world-class waterfronts, lifestyle cities, and master developments that drive massive footfall and global prestige.',
        ar: 'حملات بصرية سينمائية للواجهات البحرية والمدن السياحية والمشاريع الكبرى لزيادة تدفق الزوار وترسيخ المكانة العالمية.',
      },
      iconName: 'TbBuildingSkyscraper',
      capabilities: {
        en: ['Architectural Visual Campaigns', 'Footfall Generation Events', 'Merchant Tenant Co-Marketing', 'International Tourist Reach'],
        ar: ['حملات بصرية معمارية سينمائية', 'فعاليات زيادة تدفق الزوار', 'تسويق مشترك لمستأجري التجزئة', 'استهداف السياح والجمهور الدولي'],
      },
    },
    {
      id: 'd2c-ecommerce',
      number: '03',
      tag: { en: 'High-Velocity Retail', ar: 'التجارة الرقمية السريعة' },
      title: { en: 'Direct-to-Consumer & Omnichannel Retail', ar: 'التجارة الرقمية المباشرة للمستهلك D2C' },
      description: {
        en: 'Performance acquisition, creative iteration loops, and retention marketing engineered for fast-scaling digital brands and modern retail chains.',
        ar: 'استحواذ إعلاني موجه بالأداء، وتطوير دوري للمحتوى الإعلاني، وتسويق ولاء واحتفاظ مصمم لنمو العلامات الرقمية والتجزئة الحديثة.',
      },
      iconName: 'TbShoppingBag',
      capabilities: {
        en: ['Full-Funnel Paid Acquisition', 'High-Converting Creative Testing', 'Lifecycle Email & SMS Flows', 'Average Order Value Lift'],
        ar: ['استحواذ مدفوع بكامل المسار', 'اختبار مستمر للإعلانات عالية التحويل', 'أتمتة البريد والرسائل النصية', 'رفع متوسط قيمة سلة الشراء'],
      },
    },
    {
      id: 'fnb-hospitality',
      number: '04',
      tag: { en: 'Dining & Experiences', ar: 'الضيافة والأغذية' },
      title: { en: 'F&B, Meal Platforms & Modern Hospitality', ar: 'الأغذية والمطاعم ومنصات الاشتراكات' },
      description: {
        en: 'Caregiver and convenience positioning, viral food imagery, hyper-local geotargeted activations, and repeat subscription retention.',
        ar: 'تموضع قائم على الرعاية والراحة، ومحتوى بصري جاذب للأطعمة، واستهداف جغرافي محلي دقيق لرفع معدلات الاشتراكات الدورية.',
      },
      iconName: 'TbCoffee',
      capabilities: {
        en: ['Mouth-Watering Food Production', 'Hyper-Local Delivery Geotargeting', 'Subscription Recurring Growth', 'Influencer Taste Activations'],
        ar: ['إنتاج محتوى طعام فائق الجاذبية', 'استهداف جغرافي لخدمات التوصيل', 'تنمية الاشتراكات المتكررة', 'تجارب تذوق بالتعاون مع المؤثرين'],
      },
    },
    {
      id: 'corporate-fintech',
      number: '05',
      tag: { en: 'Corporate Reputation', ar: 'المؤسسات والتقنية المالية' },
      title: { en: 'Enterprise Corporate & FinTech Brands', ar: 'المؤسسات الكبرى والتقنية المالية' },
      description: {
        en: 'Executive thought leadership, institutional PR, ESG communications, and stakeholder trust-building across GCC financial hubs.',
        ar: 'بناء الحضور القيادي التنفيذي، والعلاقات العامة المؤسسية، والتواصل البيئي والاجتماعي وبناء الثقة في المراكز المالية الخليجية.',
      },
      iconName: 'TbBuildingBank',
      capabilities: {
        en: ['Executive Thought Leadership', 'Investor & Stakeholder PR', 'Crisis Communications Architecture', 'B2B Account-Based Marketing'],
        ar: ['إبراز الحضور القيادي للرؤساء', 'علاقات عامة للمستثمرين والشركاء', 'إدارة الاتصال في الأزمات', 'تسويق الحسابات الاستراتيجية B2B'],
      },
    },
  ],

  techStackTitle: {
    en: 'Modern Marketing & Communications Stack',
    ar: 'البنية التحتية والتقنيات التسويقية الحديثة',
  },
  techStackSubtitle: {
    en: 'Enterprise marketing platforms, creative production engines, and attribution intelligence that power our client campaigns.',
    ar: 'منصات التسويق المؤسسية، واستوديوهات الإنتاج الرقمي، وأنظمة التحليل والإسناد التي تدير حملات عملائنا بنجاح.',
  },
  techStackPods: [
    {
      title: { en: 'Marketing Automation & CRM', ar: 'أتمتة التسويق وإدارة علاقات العملاء' },
      badge: { en: 'Lifecycle Engine', ar: 'محرك دورة حياة العميل' },
      description: {
        en: 'Omnichannel customer journeys, automated behavioral triggers, and unified subscriber segmentations.',
        ar: 'مسارات متصلة عبر القنوات، ومحفزات سلوكية مؤتمتة، وتقسيم دقيق للجمهور وقواعد البيانات.',
      },
      technologies: [
        { name: 'HubSpot Enterprise', category: 'Automation & Inbound', badge: 'Tier 1' },
        { name: 'Salesforce Marketing Cloud', category: 'Enterprise Journey' },
        { name: 'Klaviyo', category: 'D2C Retention' },
        { name: 'Braze', category: 'Mobile CRM & Push' },
        { name: 'Customer.io', category: 'Event-Triggered Messaging' },
      ],
    },
    {
      title: { en: 'Paid Media & Growth Engines', ar: 'إدارة الوسائط المدفوعة ومحركات النمو' },
      badge: { en: 'Performance Scale', ar: 'النمو والأداء' },
      description: {
        en: 'Algorithmic media buying, creative testing sandboxes, and precision targeting across premium global networks.',
        ar: 'شراء وسائط مدفوع بالخوارزميات الذكية، وبيئات اختبار للإعلانات واستهداف موجه عبر كبرى الشبكات.',
      },
      technologies: [
        { name: 'Meta Ads Manager (FB/IG)', category: 'Social Acquisition', badge: 'Core' },
        { name: 'Google Ads & DV360', category: 'Search & Programmatic' },
        { name: 'TikTok For Business', category: 'Short-Form Video' },
        { name: 'Snapchat Ads Manager', category: 'GCC Gen-Z Scale' },
        { name: 'LinkedIn Campaign Manager', category: 'B2B Enterprise' },
      ],
    },
    {
      title: { en: 'Creative & Media Production Studio', ar: 'استوديو الإنتاج الإبداعي وصناعة المحتوى' },
      badge: { en: 'Visual Mastery', ar: 'التميز البصري' },
      description: {
        en: 'Full-cycle cinema production, 3D motion graphics, commercial editorial photography, and rapid social asset pipelines.',
        ar: 'إنتاج سينمائي متكامل، موشن جرافيك ثلاثي الأبعاد، تصوير فوتوغرافي تجاري، وخطوط إنتاج للمحتوى السريع.',
      },
      technologies: [
        { name: 'RED Digital Cinema', category: '8K Film Cameras', badge: 'Hardware' },
        { name: 'DaVinci Resolve Studio', category: 'Color Grading & Post' },
        { name: 'Cinema 4D & Octane', category: '3D Product Rendering' },
        { name: 'Adobe Creative Cloud', category: 'Design & Editorial' },
        { name: 'Figma Design System', category: 'Creative Tokens' },
      ],
    },
    {
      title: { en: 'Attribution & Marketing Intelligence', ar: 'التحليل والإسناد والذكاء التسويقي' },
      badge: { en: 'Closed-Loop ROI', ar: 'عائد استثماري موثق' },
      description: {
        en: 'Multi-touch attribution models, custom BigQuery data lakes, and real-time revenue telemetry.',
        ar: 'نماذج إسناد مالي متعددة اللمسات، وبحيرات بيانات مخصصة عبر BigQuery، ولوحات تحكم لحظية للأرباح.',
      },
      technologies: [
        { name: 'Google Analytics 4', category: 'Web & App Telemetry', badge: 'Analytics' },
        { name: 'AppsFlyer', category: 'Mobile Attribution & DeepLink' },
        { name: 'Mixpanel', category: 'Funnel & Retention Behavior' },
        { name: 'Triple Whale', category: 'First-Party D2C Attribution' },
        { name: 'Google BigQuery', category: 'Marketing Data Lake' },
      ],
    },
  ],

  clientStories: getMarketingFeaturedClientStories(),

  delivery: {
    title: {
      en: 'The Persici Full-Funnel Campaign Engine',
      ar: 'محرك بيرسيكي المتكامل لإدارة الحملات والنمو',
    },
    subtitle: {
      en: 'A rigorous four-stage framework that transforms abstract brand positioning into measurable market share and sustainable revenue.',
      ar: 'منهجية دقيقة من أربع مراحل تحول التموضع النظري للعلامة إلى حصة سوقية ملموسة وأرباح مستدامة.',
    },
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85',
    pillars: [
      {
        title: { en: 'Audience Intelligence & Cultural Blueprint', ar: 'ذكاء الجمهور والمخطط الثقافي' },
        description: {
          en: 'Deep qualitative market audits, competitive whitespace discovery, and persona profiling tailored to GCC cultural dynamics.',
          ar: 'دراسات سوقية نوعية دقيقة، واستكشاف الفجوات التنافسية، ورسم سمات الجمهور بما ينسجم مع الخصوصية الثقافية الخليجية.',
        },
      },
      {
        title: { en: 'Narrative Architecture & Creative Ideation', ar: 'هندسة السرد والابتكار الإبداعي' },
        description: {
          en: 'Transforming strategic insights into compelling creative hooks, cinematic storyboards, and scalable multi-format content design systems.',
          ar: 'تحويل الرؤى الاستراتيجية إلى حبكات إبداعية آسرة، ونصوص سينمائية وأنظمة محتوى مرنة تغطي كافة المقاسات والمنصات.',
        },
      },
      {
        title: { en: 'Omnichannel Deployment & Precision Media Buying', ar: 'النشر متعدد القنوات والشراء الإعلاني الدقيق' },
        description: {
          en: 'Algorithmic media execution, cross-platform audience retargeting, and rigorous creative testing across Meta, Google, TikTok, and Snapchat.',
          ar: 'شراء وسائط مدعوم بالخوارزميات الذكية، وإعادة استهداف موحدة، واختبارات A/B دورية عبر كبرى المنصات الإعلانية العالمية.',
        },
      },
      {
        title: { en: 'Real-Time Attribution & Revenue Optimization', ar: 'الإسناد اللحظي ومضاعفة العائد الاستثماري' },
        description: {
          en: 'Multi-touch financial tracking, lifetime value cohort analysis, and continuous creative refinement to scale profitable spend.',
          ar: 'تتبع مالي متعدد اللمسات، وتحليل القيمة الدائمة للعملاء، وتطوير مستمر للأصول الإعلانية لضمان أعلى ربحية ممكنة.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'mkt-insight-1',
      slug: 'creative-is-the-new-targeting',
      title: {
        en: 'The Death of Generic Performance Marketing: Why Creative is the New Targeting',
        ar: 'نهاية التسويق التقليدي الموجه: كيف أصبح المحتوى الإبداعي هو أداة الاستهداف الحقيقية',
      },
      category: { en: 'Growth Strategy', ar: 'استراتيجيات النمو' },
      date: 'Aug 2026',
      readTime: '6 min read',
      author: 'Persici Strategy Team',
      systemType: 'insight',
      excerpt: {
        en: 'In an AI-mediated privacy landscape, algorithmic ad platforms favor compelling storytelling and high watch-times over granular manual audience toggles.',
        ar: 'في ظل تحديات الخصوصية الحالية وخوارزميات الذكاء الاصطناعي، تكافئ المنصات الإعلانية السرد المشوق وزمن المشاهدة الطويل بدلاً من الاستهدافات اليدوية المعقدة.',
      },
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      href: '/insights/creative-is-the-new-targeting',
    },
    {
      id: 'mkt-insight-2',
      slug: 'full-funnel-omnichannel-roas',
      title: {
        en: 'Full-Funnel Omnichannel Orchestration: Connecting Brand Equity to Bottom-Line ROAS',
        ar: 'إدارة الحملات متعددة القنوات: ربط قيمة العلامة بالعائد الاستثماري المباشر',
      },
      category: { en: 'Media Architecture', ar: 'هندسة الوسائط' },
      date: 'Jul 2026',
      readTime: '8 min read',
      author: 'Persici Analytics Lab',
      systemType: 'insight',
      excerpt: {
        en: 'How modern enterprises break down the artificial divide between top-of-funnel brand building and bottom-of-funnel conversion engineering.',
        ar: 'كيف تكسر المؤسسات الكبرى الحاجز المصطنع بين بناء العلامة التجارية في أعلى المسار وتحقيق المبيعات المباشرة في أسفله.',
      },
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      href: '/insights/full-funnel-omnichannel-roas',
    },
    {
      id: 'mkt-insight-3',
      slug: 'gcc-cultural-resonance-marketing',
      title: {
        en: 'GCC Cultural Localization: Moving Beyond Literal Translation to Authentic Regional Resonance',
        ar: 'التوطين الثقافي في الخليج: الانتقال من الترجمة الحرفية إلى الانسجام الإقليمي الأصيل',
      },
      category: { en: 'Regional Branding', ar: 'الهوية الإقليمية' },
      date: 'Jun 2026',
      readTime: '5 min read',
      author: 'Persici Cultural Insights',
      systemType: 'insight',
      excerpt: {
        en: 'Navigating dialects, cultural symbolism, and social consumer nuances across Saudi Arabia, the UAE, and Kuwait for lasting commercial impact.',
        ar: 'التعامل بذكاء مع اللهجات، والرموز الثقافية، وتطلعات المستهلك في السعودية والإمارات والكويت لصنع أثر تجاري لا يُنسى.',
      },
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      href: '/insights/gcc-cultural-resonance-marketing',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici transformed our fragrance house from an aspiring regional label into an established luxury symbol across the GCC. Their mastery of visual storytelling, packaging architecture, and full-funnel digital marketing produced an immediate 340% surge in brand equity and retail sell-through.',
      ar: 'حولت بيرسيكي دار عطورنا من علامة إقليمية واعدة إلى رمز راسخ للفخامة في أنحاء الخليج. إن براعتهم في السرد البصري، وهندسة التغليف، والتسويق الرقمي المتكامل حققت قفزة فورية بنسبة 340% في القيمة السوقية ومبيعات التجزئة.',
    },
    author: 'Sultan Al-Qasimi',
    role: {
      en: 'Brand Director, Lahfaa Perfumes GCC',
      ar: 'مدير العلامة التجارية، عطور لهفة الخليجية',
    },
    badge: {
      en: 'Verified Luxury Partner',
      ar: 'شريك فاخر معتمد',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions',
    ar: 'الأسئلة الشائعة حول التسويق والاتصال',
  },
  faqsSubtitle: {
    en: 'Clear insights into our campaign engagements, media buying models, creative production, and performance attribution.',
    ar: 'إجابات واضحة وشفافة حول نماذج التعاقد، وإدارة الحملات، والإنتاج الإبداعي، وقياس العائد الاستثماري.',
  },
  faqs: [
    {
      question: {
        en: 'How does Persici approach marketing strategy differently from traditional ad agencies?',
        ar: 'كيف تختلف استراتيجية بيرسيكي التسويقية عن الوكالات الإعلانية التقليدية؟',
      },
      answer: {
        en: 'Unlike traditional agencies that separate brand awareness from direct-response conversions, Persici unites full-funnel strategy, premium in-house cinema production, and first-party attribution modeling under one unified engagement. We don\'t just create pretty campaigns; we engineer commercial pipeline and measurable ROAS.',
        ar: 'على عكس الوكالات التقليدية التي تفصل بين بناء الوعي بالعلامة والمبيعات المباشرة، توحد بيرسيكي بين الاستراتيجية الشاملة، والإنتاج السينمائي الاحترافي، والتحليل المالي المباشر. نحن لا نصنع إعلانات جميلة فحسب، بل نبني محركات نمو تجاري تحقق عائداً استثمارياً ملموساً.',
      },
    },
    {
      question: {
        en: 'Do you manage media ad spend directly, and how are budgets handled?',
        ar: 'هل تديرون الإنفاق الإعلاني مباشرة، وكيف يتم التعامل مع الميزانيات؟',
      },
      answer: {
        en: 'Yes. We manage client ad accounts with 100% transparency. Media spends are billed directly to your corporate payment methods or credit facilities, with zero markups or hidden fees on media dollars. Persici charges a transparent management fee tied to strategic performance milestones.',
        ar: 'نعم، ندير حسابات عملائنا الإعلانية بشفافية مطلقة بنسبة 100%. تُسدد تكاليف الوسائط مباشرة عبر وسائل الدفع الخاصة بمؤسستكم دون أي هوامش ربح أو رسوم خفية على الإنفاق الإعلاني، ونتعاقد على رسوم إدارة واضحة مرتبطة بمؤشرات الأداء المتفق عليها.',
      },
    },
    {
      question: {
        en: 'How do you ensure authentic cultural localization for GCC and Saudi markets?',
        ar: 'كيف تضمنون ملاءمة وتوطيناً ثقافياً حقيقياً للسوق السعودي والخليجي؟',
      },
      answer: {
        en: 'Our creative strategy and copywriting teams operate directly out of Dubai and Riyadh. We develop campaigns with native understanding of Saudi Vision 2030 initiatives, regional dialects (Najdi, Hijazi, Gulf), seasonal shopping calendars (Ramadan, National Days, Foundation Day), and local consumer psychology.',
        ar: 'تعمل فرقنا الاستراتيجية والإبداعية مباشرة من دبي والرياض، حيث نطور الحملات بفهم عميق لمبادرات رؤية السعودية 2030، واللهجات الإقليمية (النجدية، الحجازية، الخليجية)، والمواسم التسويقية الكبرى (رمضان، الأعياد، اليوم الوطني ويوم التأسيس).',
      },
    },
    {
      question: {
        en: 'Can Persici handle turnkey video and photography production in-house?',
        ar: 'هل تمتلك بيرسيكي استوديوهات وقدرات إنتاج فيديو وتصوير داخلي متكامل؟',
      },
      answer: {
        en: 'Yes. Our production team operates RED cinema cameras, DaVinci Resolve color grading suites, drone cinematography, and dedicated studio lighting rigs. We manage casting, art direction, shooting, editing, 3D motion graphics, and sound design from start to finish.',
        ar: 'نعم، يمتلك فريق الإنتاج لدينا كاميرات سينمائية متطورة من نوع RED، واستوديوهات تلوين DaVinci، ومعدات تصوير جوي، وإضاءة متكاملة. ونتولى كافة العمليات من اختيار الممثلين، وتصميم الديكور، والتصوير، والمونتاج، والمؤثرات ثلاثية الأبعاد وحتى المكساج الصوتي.',
      },
    },
    {
      question: {
        en: 'How quickly can an integrated marketing campaign be launched?',
        ar: 'ما هي المدة الزمنية اللازمة لإطلاق حملة تسويقية متكاملة؟',
      },
      answer: {
        en: 'Agile performance campaigns and content iteration sprints typically launch within 2 to 3 weeks. Comprehensive 360° brand transformations, flagship cinema commercials, and full-funnel omnichannel orchestrations generally require 4 to 8 weeks from initial blueprint to live market broadcast.',
        ar: 'الحملات الإعلانية السريعة واختبارات المحتوى تُطلق عادة خلال أسبوعين إلى 3 أسابيع، بينما تتطلب الحملات الكبرى الشاملة 360° والأفلام السينمائية من 4 إلى 8 أسابيع من التخطيط الأولي حتى البث المباشر في كافة القنوات.',
      },
    },
    {
      question: {
        en: 'What attribution models do you use to measure campaign success?',
        ar: 'ما هي نماذج الإسناد والتحليل التي تعتمدون عليها لقياس نجاح الحملات؟',
      },
      answer: {
        en: 'We implement multi-touch attribution models leveraging first-party pixel data, server-side Conversions API (CAPI), Google Analytics 4, and custom BigQuery data pipelines. We measure blended ROAS, Customer Acquisition Cost (CAC), Customer Lifetime Value (LTV), and net incremental revenue.',
        ar: 'نعتمد نماذج إسناد متعددة اللمسات مدعومة ببيانات الطرف الأول وواجهات برمجة التحويلات من الخادم (CAPI)، وGA4، وبحيرات بيانات BigQuery. ونقيس العائد الإعلاني الإجمالي، وكلفة الاستحواذ، والقيمة الدائمة للعملاء وصافي الإيرادات الإضافية.',
      },
    },
  ],
};
