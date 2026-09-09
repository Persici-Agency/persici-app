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

export interface EnergyCommoditiesOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface EnergyCommoditiesVerticalItem {
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

export interface EnergyCommoditiesData {
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
  offerings: EnergyCommoditiesOfferingItem[];
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
  verticals: EnergyCommoditiesVerticalItem[];
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

export const energyCommoditiesData: EnergyCommoditiesData = {
  hero: {
    tag: {
      en: 'Industry Practice',
      ar: 'قطاع الممارسات الصناعية',
    },
    secondaryTag: {
      en: 'Energy & Commodities',
      ar: 'الطاقة وتجارة السلع',
    },
    title: {
      en: 'Accelerate the Energy Transition & Resilient Commodity Trading',
      ar: 'تسريع تحول الطاقة وتطوير سلاسل إمداد وتجارة السلع الحيوية',
    },
    subtitle: {
      en: 'Pioneer the intersection of renewable energy integration, quantitative commodity risk management (ETRM), and automated ESG carbon accounting. Deliver resilient infrastructure that powers nations and scales commercial returns.',
      ar: 'ريادة التحول نحو دمج مصادر الطاقة المتجددة، والإدارة الكمية لمخاطر تجارة السلع (ETRM)، والمحاسبة الآلية للبصمة الكربونية (ESG). نبني بنية تحتية مرنة وموثوقة تدعم ازدهار المجتمعات وتضاعف العوائد.',
    },
    ctaText: {
      en: 'Consult Energy & ETRM Experts',
      ar: 'استشر خبراء الطاقة وتجارة السلع',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=85',
    highlights: [
      {
        en: 'Energy Trading & Quantitative Risk Management (ETRM) Pipelines',
        ar: 'منظومات تجارة الطاقة وإدارة المخاطر الكمية (ETRM) فائقة السرعة',
      },
      {
        en: 'Autonomous Smart Grid Load Balancing & Battery Storage Analytics',
        ar: 'موازنة أحمال الشبكات الذكية وتحليلات تخزين الطاقة بالبطاريات آلياً',
      },
      {
        en: 'Automated Scope 1-3 Carbon Tracking & Verifiable ESG Ledgers',
        ar: 'تتبع شامل لانبعاثات النطاقات 1-3 وسجلات موثقة للامتثال البيئي',
      },
      {
        en: 'Industrial IoT Telemetry, SCADA Integration & Asset Digital Twins',
        ar: 'استقبال بيانات إنترنت الأشياء الصناعي وتكامل SCADA والتوائم الرقمية للأصول',
      },
    ],
  },

  futureStrip: [
    {
      title: {
        en: 'Legacy systems limit visibility',
        ar: 'الأنظمة القديمة تحد من الرؤية التشغيلية',
      },
      description: {
        en: 'Operational, trading and asset systems can be fragmented across the value chain, making it hard to access data and make informed decisions quickly.',
        ar: 'يمكن أن تكون أنظمة العمليات والتداول والأصول مجزأة عبر سلسلة القيمة، مما يجعل الوصول للبيانات واتخاذ قرارات مدروسة بسرعة أمراً معقداً.',
      },
      badge: {
        en: 'Realities of Energy 01',
        ar: 'واقع قطاع الطاقة 01',
      },
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Decisions require intelligence',
        ar: 'القرارات الاستراتيجية تتطلب ذكاءً تحليلياً',
      },
      description: {
        en: 'From production and maintenance to trading and risk, energy organizations struggle to apply analytics and AI consistently across workflows in real time.',
        ar: 'من الإنتاج والصيانة إلى التداول وإدارة المخاطر، تكافح مؤسسات الطاقة لتطبيق التحليلات والذكاء الاصطناعي بشكل متسق وفوري عبر مسارات العمل.',
      },
      badge: {
        en: 'Realities of Energy 02',
        ar: 'واقع قطاع الطاقة 02',
      },
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Decarbonization demands agility',
        ar: 'إزالة الكربون تتطلب مرونة تشغيلية فائقة',
      },
      description: {
        en: 'Navigating net-zero mandates requires verifiable Scope 1-3 carbon accounting and agile adaptation to evolving global environmental regulations.',
        ar: 'يتطلب تحقيق أهداف الحياد الكربوني محاسبة موثقة لانبعاثات النطاقات 1-3 والتكيف السريع مع المعايير واللوائح البيئية المتطورة باستمرار.',
      },
      badge: {
        en: 'Realities of Energy 03',
        ar: 'واقع قطاع الطاقة 03',
      },
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Market volatility tests resilience',
        ar: 'تقلبات الأسواق تختبر مرونة سلاسل الإمداد',
      },
      description: {
        en: 'Geopolitical disruption and rapid commodity price fluctuations necessitate algorithmic hedging and real-time physical dispatch telemetry.',
        ar: 'الاضطرابات الجيوسياسية والتقلبات الحادة في أسعار السلع تفرض التحوط الخوارزمي والمراقبة اللحظية لشحنات ومسارات التوزيع الميداني.',
      },
      badge: {
        en: 'Realities of Energy 04',
        ar: 'واقع قطاع الطاقة 04',
      },
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
    },
  ],

  agileFoundation: {
    title: {
      en: 'An Agile Foundation for Energy & Commodities',
      ar: 'الأساس الهندسي المرن لقطاع الطاقة والسلع',
    },
    subtitle: {
      en: 'Harmonizing SCADA sensor streams, physical pipeline logistics, and quantitative trading desks into a unified, high-resilience digital architecture.',
      ar: 'دمج تدفقات مستشعرات SCADA، والخدمات اللوجستية لخطوط الإمداد، ومكاتب التداول الكمي في معمارية رقمية موحدة وعالية الصمود.',
    },
    diagramBadge: {
      en: 'Energy Grid Architecture',
      ar: 'معمارية شبكات الطاقة والسلع',
    },
    pillars: [
      {
        number: '01',
        title: {
          en: 'Unified Industrial IoT & SCADA Backbone',
          ar: 'منظومة إنترنت الأشياء الصناعي و SCADA الموحدة',
        },
        description: {
          en: 'Ingest millions of sensor readings per second across substations, solar inverters, and wellheads with sub-10ms operational latency.',
          ar: 'استقبال ملايين القراءات في الثانية من محطات التحويل، والمحولات الشمسية، ورؤوس الآبار بزمن تشغيلي يقل عن 10 ميلي ثانية.',
        },
      },
      {
        number: '02',
        title: {
          en: 'Low-Latency ETRM Trading Hub',
          ar: 'مركز تداول السلع وإدارة المخاطر فائق السرعة',
        },
        description: {
          en: 'Real-time Mark-to-Market (MtM) valuations, Value-at-Risk (VaR) simulations, and automated contract settlement across energy markets.',
          ar: 'تقييمات فورية للقيمة السوقية العادلة (MtM)، ومحاكاة القيمة المعرضة للمخاطر (VaR)، وتسوية تعاقدية مؤتمتة في أسواق الطاقة.',
        },
      },
      {
        number: '03',
        title: {
          en: 'Auditable Scope 1-3 Carbon Ledger',
          ar: 'سجل موثق ومدقق لانبعاثات النطاقات 1 و 2 و 3',
        },
        description: {
          en: 'Automated greenhouse gas accounting tied directly to physical energy flows, satisfying regional and international ESG disclosure mandates.',
          ar: 'محاسبة آلية لانبعاثات الغازات الدفيئة مرتبطة مباشرة بتدفقات الطاقة الفعلية، لمطابقة معايير الإفصاح البيئي الإقليمية والدولية.',
        },
      },
    ],
  },

  offeringsTitle: {
    en: 'Core Capabilities for Energy & Commodities',
    ar: 'القدرات الهندسية الأساسية لقطاع الطاقة والسلع',
  },
  offeringsSubtitle: {
    en: 'Mission-critical digital solutions built to optimize asset yields, ensure grid stability, and maximize physical commodity margins.',
    ar: 'حلول رقمية حيوية مصممة لرفع كفاءة الأصول التشغيلية، وضمان استقرار الشبكات، ومضاعفة هوامش تجارة السلع المادية.',
  },
  offerings: [
    {
      slug: 'etrm-quantitative-trading',
      tag: { en: 'ETRM & Trading', ar: 'تجارة السلع وإدارة المخاطر' },
      title: { en: 'Energy Trading & Risk Management (ETRM)', ar: 'منظومات تجارة الطاقة وإدارة المخاطر (ETRM)' },
      description: {
        en: 'Deploy cloud-native trading platforms executing real-time portfolio Mark-to-Market (MtM), Monte Carlo risk simulations, and automated clearing house settlement.',
        ar: 'نشر منصات تداول سحابية تنفذ تقييمات المحافظ الاستثمارية لحظياً، ومحاكاة مخاطر مونت كارلو، والتسوية الآلية مع غرف المقاصة العالمية.',
      },
      icon: 'TbCoins',
      diagramType: 'sc-control-tower-nexus',
      highlights: {
        en: [
          'Sub-Second Value-at-Risk (VaR) & Sensitivity Calculations',
          'Automated Deal Capture for Physical & Financial Contracts',
          'Real-Time Pipeline Capacity Scheduling & Nominations',
          'Bi-Directional Settlement API Feeds with Global Exchanges',
        ],
        ar: [
          'حساب القيمة المعرضة للمخاطر (VaR) ومؤشرات الحساسية في ثوانٍ',
          'تسجيل وإبرام الصفقات الآلي للعقود المادية والمالية المشتقة',
          'جدولة وتنسيق طاقات خطوط الأنابيب والشحنات في الوقت الفعلي',
          'ربط تسوية مباشر عبر واجهات APIs مع بورصات الطاقة العالمية',
        ],
      },
    },
    {
      slug: 'smart-grid-renewable-analytics',
      tag: { en: 'Smart Grid & Renewables', ar: 'الشبكات الذكية والطاقة المتجددة' },
      title: { en: 'Smart Grid Analytics & Renewable Optimization', ar: 'تحليلات الشبكات الذكية ومزارع الطاقة المتجددة' },
      description: {
        en: 'Balance intermittent solar and wind generation with AI demand forecasting, grid voltage regulation, and battery energy storage system (BESS) dispatch.',
        ar: 'موازنة توليد الطاقة الشمسية وطاقة الرياح المتقطعة بنماذج التنبؤ بالأحمال، وضبط الجهد الكهربائي، وتوجيه بطاريات التخزين الذكية (BESS).',
      },
      icon: 'TbBolt',
      diagramType: 'sc-demand-forecast-waveform',
      highlights: {
        en: [
          'AI Solar Irradiance & Wind Velocity Micro-Forecasting',
          'Automated Battery Energy Storage System (BESS) Arbitrage',
          'Virtual Power Plant (VPP) Aggregation & Dispatch',
          'Dynamic Grid Congestion Relief & Feeder Balancing',
        ],
        ar: [
          'تنبؤ ذكي دقيق بمستويات الإشعاع الشمسي وسرعة الرياح',
          'أتمتة شحن وتفريغ بطاريات التخزين لتحقيق أقصى ربحية',
          'إدارة وتجميع محطات التوليد الافتراضية (VPP) في شبكة موحدة',
          'تخفيف الاختناقات وتوزيع الأحمال على خطوط النقل ديناميكياً',
        ],
      },
    },
    {
      slug: 'decarbonization-carbon-tracking',
      tag: { en: 'ESG & Decarbonization', ar: 'الاستدامة وإزالة الكربون' },
      title: { en: 'Decarbonization & Automated Scope 1-3 Carbon Tracking', ar: 'إزالة الكربون والمحاسبة الآلية للانبعاثات 1-3' },
      description: {
        en: 'Connect energy consumption meters and supply chain transport telemetry to an auditable carbon ledger, automating GHG Protocol reporting and carbon credit verification.',
        ar: 'ربط عدادات استهلاك الطاقة ومستشعرات الشحن اللوجستي بسجل كربوني موثق، لأتمتة تقارير بروتوكول الغازات الدفيئة وإثبات شهادات الكربون.',
      },
      icon: 'TbLeaf',
      diagramType: 'quantum-core-cube',
      highlights: {
        en: [
          'Real-Time Facility Scope 1, 2 & 3 Emission Quantification',
          'Automated Carbon Accounting Compliant with GHG Protocol',
          'Blockchain-Verified Carbon Offset Credit Retirement',
          'Investor-Grade ESG Metric Reporting & Sustainability Dashboards',
        ],
        ar: [
          'قياس فوري لانبعاثات المنشآت في النطاقات 1 و 2 و 3 بدقة',
          'محاسبة كربونية مؤتمتة متوافقة تماماً مع معايير GHG Protocol',
          'تسوية وإلغاء أرصدة الكربون الخضراء الموثقة بالبلوك تشين',
          'لوحات مؤشرات استدامة مخصصة للمستثمرين والجهات التنظيمية',
        ],
      },
    },
    {
      slug: 'global-commodity-logistics',
      tag: { en: 'Commodity Logistics', ar: 'لوجستيات السلع والتجارة البحرية' },
      title: { en: 'Global Commodity Logistics & Marine Telematics', ar: 'لوجستيات السلع وتتبع الشحن الملاحي الذكي' },
      description: {
        en: 'Monitor bulk carrier maritime routes, demurrage risk, port congestion, and cargo quality in transit using satellite AIS feeds and cargo IoT sensors.',
        ar: 'مراقبة مسارات ناقلات السلع البحرية، ومخاطر غرامات التأخير (Demurrage)، وازدحام الموانئ، وجودة البضائع عبر أقمار AIS ومستشعرات الشحن.',
      },
      icon: 'TbShip',
      diagramType: 'sc-global-network-flow',
      highlights: {
        en: [
          'Real-Time Satellite AIS Vessel Tracking & ETA Prediction',
          'Demurrage Cost Prediction & Port Congestion Avoidance',
          'Bulk Grain, Ore & Crude Temperature/Moisture Telemetry',
          'Automated Electronic Bill of Lading (eBL) Clearing',
        ],
        ar: [
          'تتبع حركة السفن بالأقمار الصناعية والتنبؤ الدقيق بمواعيد الوصول',
          'التنبؤ بغرامات تأخير التفريغ وتجنب الموانئ البحرية المزدحمة',
          'مراقبة درجات الحرارة والرطوبة للحبوب والمعادن والنفط الخام',
          'إصدار وتداول بوالص الشحن البحرية الإلكترونية المعتمدة (eBL)',
        ],
      },
    },
    {
      slug: 'asset-predictive-maintenance',
      tag: { en: 'Asset Operations', ar: 'إدارة الأصول والصيانة التنبؤية' },
      title: { en: 'Asset Predictive Maintenance & Digital Twin', ar: 'الصيانة التنبؤية والتوأم الرقمي للمنشآت الحيوية' },
      description: {
        en: 'Build high-fidelity 3D digital twins of refineries, offshore platforms, and wind turbines. Machine learning models detect mechanical vibration anomalies weeks before failure.',
        ar: 'بناء توائم رقمية ثلاثية الأبعاد للمصافي، والمنصات البحرية، وتوربينات الرياح. ترصد نماذج الذكاء الاصطناعي اهتزازات المعدات لتفادي الأعطال قبل أسابيع.',
      },
      icon: 'TbActivity',
      diagramType: 'sc-fleet-transit-radar',
      highlights: {
        en: [
          'High-Fidelity 3D Facility BIM & Spatial Telemetry Overlay',
          'Turbine & Compressor Vibration Machine Learning Anomaly Detection',
          'Automated Work-Order Generation in SAP PM / IBM Maximo',
          'Catastrophic Plant Downtime Elimination & Extended Asset Lifespans',
        ],
        ar: [
          'نمذجة مكانية ثلاثية الأبعاد للمنشآت مع تراكب قراءات المستشعرات',
          'رصد اهتزازات التوربينات والضواغط بالتعلم الآلي لمنع التلف',
          'إصدار أوامر الصيانة آلياً في أنظمة SAP PM و IBM Maximo',
          'القضاء على توقف المحطات المفاجئ وإطالة العمر الافتراضي للمعدات',
        ],
      },
    },
    {
      slug: 'critical-infrastructure-cybersecurity',
      tag: { en: 'Cyber Resilience', ar: 'الأمن السيبراني للمنشآت الحيوية' },
      title: { en: 'Critical Infrastructure Cybersecurity & Grid Resilience', ar: 'الأمن السيبراني للبنية التحتية وصمود الشبكات' },
      description: {
        en: 'Fortify operational technology (OT), SCADA, and distributed energy resources against sophisticated nation-state cyberattacks with zero-trust network segmentation.',
        ar: 'تحصين التقنيات التشغيلية (OT)، وأنظمة SCADA، وشبكات الطاقة ضد الهجمات السيبرانية المتقدمة عبر العزل الشبكي المحكم وضوابط انعدام الثقة.',
      },
      icon: 'TbShieldCheck',
      diagramType: 'de-resilience-failover',
      highlights: {
        en: [
          'OT / IT Network Micro-Segmentation & Purdue Model Compliance',
          'Anomaly Detection for Industrial Protocols (Modbus, DNP3, IEC 61850)',
          'Air-Gapped Backup Systems with Instant Failover Recovery',
          'National Critical Infrastructure Protection (NCA CIP) Certified',
        ],
        ar: [
          'عزل شبكات التحكم الصناعي (OT) عن شبكات تقنية المعلومات (IT)',
          'اكتشاف التهديدات في بروتوكولات الصناعة (Modbus, DNP3, IEC 61850)',
          'نسخ احتياطي معزول كهربائياً مع استعادة فورية للتشغيل عند الطوارئ',
          'امتثال معتمد لضوابط حماية البنية التحتية الحساسة (NCA CIP)',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Powering a Sustainable, Secure Energy Future',
      ar: 'بناء مستقبل طاقة مستدام وآمن وموثوق',
    },
    text: {
      en: 'The global energy and commodities landscape is undergoing the most monumental transition since the Industrial Revolution. Energy producers and trading houses must balance two equally urgent imperatives: ensuring uninterrupted, affordable energy security while aggressively decarbonizing operations to meet net-zero targets. Fragmented legacy SCADA silos, manual spreadsheet trading workflows, and disconnected supply chains leave enterprises vulnerable to extreme market shocks. Persici delivers sovereign digital architectures that unite field telemetry with quantitative trading intelligence, ensuring long-term profitability and global climate resilience.',
      ar: 'يشهد قطاع الطاقة والسلع العالمي أهم مرحلة تحول منذ الثورة الصناعية. يتعين على منتجي الطاقة ومجموعات تجارة السلع تحقيق توازن دقيق بين أمرين متساويين في الأهمية: ضمان أمن الإمدادات بتكاليف تنافسية، وتسريع إزالة الكربون للوصول إلى الحياد الصفري. إن أنظمة SCADA المنعزلة، وإدارة الصفقات اليدوية، وسلاسل الإمداد المتباعدة تجعل الشركات عرضة لصدمات الأسواق الحادة. تقدم بيرسيكي معماريات رقمية سيادية تربط مستشعرات الحقول بمحركات التداول الكمي الذكية، مما يضمن الربحية المستدامة والصمود في مشهد الطاقة المتجدد.',
    },
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=85',
  },

  benefitsStrip: {
    title: {
      en: 'Strategic Advantages for Energy & Commodity Enterprises',
      ar: 'المكتسبات الاستراتيجية لكبرى شركات الطاقة والسلع',
    },
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85',
    benefits: [
      {
        title: { en: 'Grid Stability & Peak Shaving', ar: 'استقرار الشبكة وحلاقة ذروة الأحمال' },
        description: {
          en: 'Predictive renewable integration and battery dispatch reduce peak grid stress by up to 34%, eliminating blackout vulnerabilities.',
          ar: 'التنبؤ الذكي بالأحمال وتوجيه البطاريات يقلص ضغط الذروة على الشبكات بنسبة 34%، ويمنع انقطاعات التيار المفاجئة.',
        },
      },
      {
        title: { en: 'Trading Margin Protection', ar: 'حماية هوامش صفقات التداول' },
        description: {
          en: 'Real-time Value-at-Risk modeling and automated pipeline capacity scheduling insulate commercial margins against volatile swings.',
          ar: 'النمذجة اللحظية للمخاطر وجدولة سعات الأنابيب آلياً تحمي هوامش الصفقات التجارية من التقلبات الحادة للأسعار.',
        },
      },
      {
        title: { en: 'Auditable Green Premiums', ar: 'عوائد إضافية للسلع الخضراء الموثقة' },
        description: {
          en: 'Verifiable, digital product passports for low-carbon fuels and commodities enable trading desks to capture premium international green pricing.',
          ar: 'جوازات السفر الرقمية الموثقة للوقود والسلع منخفضة الانبعاثات تتيح لمكاتب التداول بيع الشحنات بأسعار تفضيلية أعلى.',
        },
      },
      {
        title: { en: 'Zero Unplanned Downtime', ar: 'القضاء على التوقف غير المجدول' },
        description: {
          en: 'Machine learning vibration models detect critical compressor and turbine wear weeks ahead, saving millions in emergency repair costs.',
          ar: 'نماذج التعلم الآلي ترصد تآكل التوربينات والضواغط قبل أسابيع من تعطلها، مما يوفر ملايين الدولارات في تكاليف الإصلاح الطارئ.',
        },
      },
    ],
  },

  verticalsTitle: {
    en: 'Energy & Commodity Sectors We Modernize',
    ar: 'قطاعات الطاقة والسلع التي نقود تحولها',
  },
  verticalsSubtitle: {
    en: 'Engineered solutions built for the specific operational, trading, and environmental regulatory realities of distinct energy sub-sectors.',
    ar: 'حلول متخصصة تراعي الواقع التشغيلي، والتجاري، والتنظيمي لمختلف قطاعات الطاقة والسلع الحيوية.',
  },
  verticals: [
    {
      id: 'power-utilities',
      number: '01',
      title: { en: 'Power Generation, Renewables & Utilities', ar: 'توليد الطاقة ومشاريع الطاقة المتجددة والمرافق' },
      tag: { en: 'Clean Power', ar: 'الطاقة النظيفة' },
      description: {
        en: 'Deploying smart meter analytics, solar plant SCADA telemetry, and automated battery energy storage dispatch for progressive regional power utilities.',
        ar: 'نشر تحليلات العدادات الذكية، ومستشعرات محطات الطاقة الشمسية، والتوجيه الآلي لبطاريات تخزين الطاقة لمرافق الكهرباء الكبرى.',
      },
      capabilities: {
        en: [
          'Solar PV & Wind Farm Real-Time Fleet Telemetry',
          'Dynamic Grid Tariff Pricing & Smart Meter Ingestion',
          'Battery Energy Storage System (BESS) Automated Dispatch',
          'Vegetation Management & Transmission Line Drone Audits',
        ],
        ar: [
          'استقبال بيانات محطات الطاقة الشمسية والرياح في الوقت الفعلي',
          'تحديث تعرفة الكهرباء ديناميكياً واستيعاب قراءات العدادات الذكية',
          'توجيه الشحن والتفريغ التلقائي لبطاريات تخزين الطاقة (BESS)',
          'فحص خطوط النقل الهوائية ومراقبة المخاطر المحيطة بطائرات الدرون',
        ],
      },
    },
    {
      id: 'oil-gas',
      number: '02',
      title: { en: 'Upstream, Downstream Oil & Petrochemicals', ar: 'استكشاف وتكرير النفط والغاز والبتروكيماويات' },
      tag: { en: 'Hydrocarbon Yield', ar: 'كفاءة التكرير والإنتاج' },
      description: {
        en: 'Optimizing refinery throughput, pipeline acoustic leak detection, and offshore platform predictive maintenance with digital twins.',
        ar: 'رفع كفاءة المصافي، والرصد الصوتي الذكي لتسربات خطوط الأنابيب، والصيانة التنبؤية للمنصات البحرية باستخدام التوائم الرقمية.',
      },
      capabilities: {
        en: [
          'Refinery Distillation Column Real-Time Process Optimization',
          'Acoustic Fiber-Optic Pipeline Leak & Pressure Drop Detection',
          'Offshore Platform Structural Health Digital Twins',
          'Automated Flare Stack Methane Emission Monitoring',
        ],
        ar: [
          'تحسين تشغيل أبراج تقطير المصافي لحظياً لرفع جودة المشتقات',
          'رصد تسربات وهبوط ضغط الأنابيب بالألياف الضوئية الصوتية',
          'توائم رقمية لمراقبة السلامة الهيكلية للمنصات البحرية',
          'مراقبة آلية لانبعاثات الميثان من شعلات الحقول لخفض الفاقد',
        ],
      },
    },
    {
      id: 'commodity-agribusiness',
      number: '03',
      title: { en: 'Commodity Trading & Agribusiness Logistics', ar: 'تجارة السلع الزراعية وسلاسل الإمداد الغذائي' },
      tag: { en: 'Bulk Trade', ar: 'تجارة السلع المجمعة' },
      description: {
        en: 'Empowering commodity merchants with vessel AIS satellite tracking, bulk grain silo telemetry, and automated trade contract financing.',
        ar: 'تمكين تجار السلع بالرصد الفضائي لحركة السفن (AIS)، ومستشعرات صوامع الحبوب، وأتمتة التمويل التعاقدي للصفقات الدولية.',
      },
      capabilities: {
        en: [
          'Satellite Vessel Route Tracking & Demurrage Minimization',
          'Silo Grain Moisture & Quality Telemetry in Real Time',
          'Automated Trade Finance Letter of Credit (LC) Reconciliation',
          'Cross-Commodity Hedging & Futures Basis Trading Tools',
        ],
        ar: [
          'تتبع خطوط سير السفن بالأقمار الصناعية لتفادي غرامات التأخير',
          'مراقبة مستويات رطوبة وجودة الحبوب داخل الصوامع لحظياً',
          'مطابقة الاعتمادات المستندية لتمويل التجارة الدولية آلياً',
          'أدوات متطورة للتحوط وتداول الفروقات السعرية بين السلع',
        ],
      },
    },
    {
      id: 'carbon-cleantech',
      number: '04',
      title: { en: 'Carbon Markets & CleanTech Infrastructure', ar: 'أسواق تداول الكربون ومشاريع التقنية النظيفة' },
      tag: { en: 'Net-Zero Markets', ar: 'أسواق الحياد الصفري' },
      description: {
        en: 'Architecting digital carbon credit exchange platforms, green hydrogen plant telemetry, and verified carbon removal certificate registries.',
        ar: 'هندسة منصات تداول شهادات الكربون الرقمية، ومستشعرات مصانع الهيدروجين الأخضر، وسجلات توثيق شهادات احتجاز الكربون المعتمدة.',
      },
      capabilities: {
        en: [
          'Carbon Credit Tokenization & Digital Certificate Retirement',
          'Green Hydrogen Electrolyzer Purity & Energy Telemetry',
          'Carbon Capture & Storage (CCS) Sequestration Verification',
          'ESG Disclosure Automated Taxonomy Mapping for Regulators',
        ],
        ar: [
          'ترميز شهادات خفض الكربون الرقمية وتوثيق تسويتها بالكامل',
          'مراقبة كفاءة ونقاء أجهزة التحليل الكهربائي للهيدروجين الأخضر',
          'التحقق الميداني الموثق من كميات احتجاز وعزل الكربون (CCS)',
          'مطابقة إفصاحات الاستدامة آلياً مع متطلبات الهيئات التنظيمية',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'Energy & Commodities Technical Stack',
    ar: 'البنية التقنية لقطاع الطاقة والسلع',
  },
  techStackSubtitle: {
    en: 'Industrial-grade, cyber-hardened systems engineered for continuous telemetry, sub-second financial risk models, and national grid safety.',
    ar: 'أنظمة متطورة بمقاييس صناعية محكمة مصممة لاستيعاب التدفقات المستمرة، وحساب المخاطر المالية في ثوانٍ، وحماية أمن الشبكات الوطنية.',
  },
  techStackPods: [
    {
      title: { en: 'SCADA & Industrial IoT Core', ar: 'منظومات SCADA وإنترنت الأشياء الصناعي' },
      badge: { en: 'Industrial OT Tier', ar: 'طبقة التقنيات التشغيلية' },
      description: {
        en: 'High-throughput operational technology telemetry brokers processing millions of field sensor signals with millisecond precision.',
        ar: 'وسطاء استقبال بيانات التقنيات التشغيلية لمعالجة ملايين إشارات المستشعرات في الحقول بدقة في أجزاء من الثانية.',
      },
      technologies: [
        { name: 'OSIsoft PI System', category: 'Operational Data Historian', badge: 'Industrial' },
        { name: 'Siemens MindSphere', category: 'Industrial IoT Core', badge: 'Cloud Edge' },
        { name: 'AWS IoT SiteWise', category: 'Substation Stream Broker', badge: 'Scalable' },
        { name: 'MQTT / Sparkplug B', category: 'Edge Industrial Protocol', badge: 'Low Bandwidth' },
      ],
    },
    {
      title: { en: 'ETRM & Quantitative Trading', ar: 'تجارة السلع وإدارة المخاطر الكمية' },
      badge: { en: 'Financial Core', ar: 'الطبقة المالية والتحوط' },
      description: {
        en: 'Ultra-low latency risk engines performing real-time portfolio valuations, VaR simulations, and trade contract clearing.',
        ar: 'محركات مخاطر فائقة السرعة تنفذ تقييمات المحافظ الاستثمارية، ومحاكاة المخاطر، ومقاصة عقود السلع في ثوانٍ معدودة.',
      },
      technologies: [
        { name: 'OpenLink Endur', category: 'Enterprise ETRM Platform', badge: 'Global Standard' },
        { name: 'Apache Flink', category: 'Stateful Stream Processing', badge: 'Sub-Millisecond' },
        { name: 'Snowflake Energy', category: 'Data Lakehouse & Sharing', badge: 'Petabyte' },
        { name: 'Python Quant Stack', category: 'NumPy / SciPy Monte Carlo', badge: 'GPU Accelerated' },
      ],
    },
    {
      title: { en: 'Geospatial & Marine Telematics', ar: 'التحليلات الجيومكانية والتتبع الملاحي' },
      badge: { en: 'Geospatial Tier', ar: 'طبقة البيانات الجغرافية' },
      description: {
        en: 'Satellite telemetry pipelines tracking global vessel positions, port congestion, weather patterns, and crop vegetation health.',
        ar: 'مسارات بيانات الأقمار الصناعية لتتبع مواقع السفن العالمية، وازدحام الموانئ، وتقلبات الطقس، وصحة المحاصيل الزراعية.',
      },
      technologies: [
        { name: 'Google Earth Engine', category: 'Satellite Imagery & Weather', badge: 'Geospatial' },
        { name: 'ESRI ArcGIS Core', category: 'Pipeline & Grid GIS Mapping', badge: 'Enterprise' },
        { name: 'Spire Global AIS', category: 'Satellite Maritime Tracking', badge: 'Realtime' },
        { name: 'Deck.gl / Mapbox', category: 'High-Performance 3D Vis', badge: 'WebGL' },
      ],
    },
    {
      title: { en: 'Decarbonization ERP & Operations', ar: 'أنظمة إدارة الأصول وإزالة الكربون' },
      badge: { en: 'Enterprise Operations', ar: 'طبقة العمليات والحوكمة' },
      description: {
        en: 'Enterprise resource planning and computerized maintenance management systems linking maintenance with carbon accounting.',
        ar: 'أنظمة تخطيط الموارد وإدارة الصيانة المحوسبة التي تربط أوامر العمل الميدانية بالمحاسبة الدقيقة للانبعاثات.',
      },
      technologies: [
        { name: 'SAP S/4HANA Energy', category: 'Core Utilities ERP', badge: 'Realtime' },
        { name: 'IBM Maximo', category: 'Enterprise Asset Management', badge: 'Predictive' },
        { name: 'Enablon ESG', category: 'Carbon & EHS Compliance', badge: 'GHG Protocol' },
        { name: 'HashiCorp Vault', category: 'Critical Infrastructure KMS', badge: 'Air-Gapped' },
      ],
    },
  ],

  clientStories: getFeaturedStories(['nissan-mobility', 'gulf-enterprise-copilot', 'finvibe-trading']),

  delivery: {
    title: {
      en: 'How We Deliver Energy & Commodity Solutions',
      ar: 'منهجيتنا في تنفيذ مشاريع الطاقة وتجارة السلع',
    },
    subtitle: {
      en: 'A rigorous industrial delivery framework engineered to safeguard continuous physical operations, ensure grid safety, and accelerate commercial returns.',
      ar: 'منهجية تنفيذ صناعية صارمة مصممة لحماية استمرار العمليات التشغيلية، وضمان سلامة الشبكات، وتحقيق أسرع عائد تجاري ملموس.',
    },
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
    pillars: [
      {
        title: {
          en: 'Field Telemetry & SCADA Safety Audit',
          ar: 'تدقيق مستشعرات الحقول وسلامة SCADA',
        },
        description: {
          en: 'Evaluate existing industrial protocol configurations (Modbus, DNP3, OPC UA), OT network security boundaries, and trading desk latency points.',
          ar: 'تقييم بروتوكولات التحكم الصناعي الحالية، وحدود أمان شبكات التقنية التشغيلية (OT)، ونقاط بطء تنفيذ صفقات التداول.',
        },
      },
      {
        title: {
          en: 'Sovereign Pipeline & ETRM Blueprinting',
          ar: 'تصميم معمارية تدفق البيانات ومنظومة ETRM',
        },
        description: {
          en: 'Design non-intrusive data taps, sovereign cloud telemetry lakes, and real-time portfolio valuation models matching your physical assets.',
          ar: 'تصميم مسارات سحب البيانات الآمنة دون التأثير على الحقول، وبحيرات البيانات السحابية، ونماذج التقييم المطابقة لأصولك الفعلية.',
        },
      },
      {
        title: {
          en: 'Pilot Asset Digitization & Live Shadow Trading',
          ar: 'رقمنة الأصول التجريبية والتداول الموازي',
        },
        description: {
          en: 'Connect a pilot solar facility, pipeline segment, or commodity trade book, running live shadow risk valuations without operational exposure.',
          ar: 'ربط محطة شمسية تجريبية أو خط أنابيب محدد أو محفظة سلع، وتشغيل تقييم المخاطر الموازي دون أي مخاطرة بالعمليات الحية.',
        },
      },
      {
        title: {
          en: 'Fleet-Wide Commissioning & ESG Automation',
          ar: 'التشغيل الشامل وأتمتة تقارير الاستدامة',
        },
        description: {
          en: 'Roll out the platform across all regional assets, activating automated battery dispatch, real-time VaR limits, and certified carbon ledgers.',
          ar: 'تعميم المنظومة على كافة الأصول الإقليمية، وتفعيل التوجيه الآلي لبطاريات الطاقة، وحدود المخاطر الفورية، وسجلات الكربون المعتمدة.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'eng-insight-01',
      title: {
        en: 'The Autonomous Smart Grid: Navigating High-Penetration Solar & Wind Assets',
        ar: 'الشبكات الذكية المستقلة: إدارة التدفقات الهائلة لمزارع الطاقة الشمسية والرياح',
      },
      excerpt: {
        en: 'How predictive load forecasting and automated battery storage dispatch eliminate grid frequency instability in decarbonizing energy markets.',
        ar: 'كيف يسهم التنبؤ الذكي بالأحمال وتوجيه بطاريات التخزين آلياً في القضاء على اضطرابات تردد الشبكة في أسواق الطاقة المتحولة.',
      },
      badge: {
        en: 'Smart Grid AI',
        ar: 'ذكاء الشبكات',
      },
      slug: 'autonomous-smart-grid-solar-wind-management',
      href: '/insights/autonomous-smart-grid-solar-wind-management',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      date: '2026-02-16',
    },
    {
      id: 'eng-insight-02',
      title: {
        en: 'Quantitative Commodity Trading: Unifying Vessel AIS with ETRM Risk Models',
        ar: 'تجارة السلع الكمية: دمج التتبع الملاحي للأقمار الصناعية مع نماذج مخاطر ETRM',
      },
      excerpt: {
        en: 'Why leading energy commodity trading desks are integrating satellite marine telematics directly into Value-at-Risk calculations.',
        ar: 'لماذا تدمج مكاتب تداول سلع الطاقة الرائدة بيانات حركة السفن بالأقمار الصناعية مباشرة في معادلات حساب القيمة المعرضة للمخاطر.',
      },
      badge: {
        en: 'ETRM & Quant Trading',
        ar: 'تجارة السلع الكمية',
      },
      slug: 'quantitative-commodity-trading-ais-etrm',
      href: '/insights/quantitative-commodity-trading-ais-etrm',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      date: '2026-01-26',
    },
    {
      id: 'eng-insight-03',
      title: {
        en: 'Scope 1-3 Carbon Ledgering: Transforming ESG Compliance into Premium Margins',
        ar: 'تدقيق انبعاثات النطاقات 1-3: تحويل الامتثال البيئي إلى هوامش ربحية متميزة',
      },
      excerpt: {
        en: 'A strategic technical guide to automating greenhouse gas accounting directly from physical SCADA flow meters to satisfy global regulators.',
        ar: 'دليل تقني استراتيجي لأتمتة محاسبة الغازات الدفيئة مباشرة من عدادات تدفق SCADA في الحقول لمطابقة متطلبات الهيئات الدولية.',
      },
      badge: {
        en: 'ESG & Decarbonization',
        ar: 'الاستدامة وإزالة الكربون',
      },
      slug: 'scope-1-3-carbon-ledgering-guide',
      href: '/insights/scope-1-3-carbon-ledgering-guide',
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
      date: '2026-01-09',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici transformed our regional utility and renewable energy operations. By linking our solar farm SCADA data with an AI battery storage dispatch engine, we stabilized our peak grid frequencies and cut transmission curtailment losses by 38%.',
      ar: 'أحدثت بيرسيكي نقلة نوعية في عمليات مرافقنا ومشاريع الطاقة المتجددة. بربط بيانات SCADA لمزارع الطاقة الشمسية بمحرك توجيه ذكي لبطاريات التخزين، نجحنا في تثبيت ترددات الشبكة في أوقات الذروة وخفضنا هدر الطاقة بنسبة 38%.',
    },
    author: 'Eng. Mansoor Al-Harbi',
    role: {
      en: 'Chief Technology Officer, Regional Clean Energy & Power Utility',
      ar: 'الرئيس التنفيذي للتكنولوجيا، شركة رائدة في الطاقة النظيفة والمرافق الكهربائية',
    },
    badge: {
      en: 'Verified Energy Enterprise Client',
      ar: 'عميل مؤسسي موثق في قطاع الطاقة',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions: Energy & Commodities Solutions',
    ar: 'الأسئلة الشائعة: حلول قطاع الطاقة والسلع',
  },
  faqsSubtitle: {
    en: 'Answers regarding SCADA telemetry integration, ETRM risk calculations, battery dispatch automation, and carbon accounting standards.',
    ar: 'إجابات تقنية حول ربط مستشعرات SCADA، وحسابات مخاطر ETRM، وأتمتة بطاريات التخزين، ومعايير المحاسبة الكربونية.',
  },
  faqs: [
    {
      question: {
        en: 'How do you collect data from legacy SCADA and PLC systems without risking field operations?',
        ar: 'كيف تجمعون البيانات من أنظمة SCADA و PLC القديمة دون تعريض العمليات الميدانية لأي مخاطر؟',
      },
      answer: {
        en: 'We deploy non-intrusive, read-only industrial edge gateways (such as MQTT Sparkplug B adapters or unidirectional data diodes) that tap into operational historian tags without transmitting any control commands back to critical physical PLCs.',
        ar: 'نستخدم بوابات حافة صناعية للقراءة فقط (مثل موصلات MQTT Sparkplug B أو صمامات البيانات أحادية الاتجاه Data Diodes) التي تقرأ سجلات البيانات دون إرسال أي أوامر تحكم راجعة إلى وحدات التحكم الحساسة (PLCs).',
      },
    },
    {
      question: {
        en: 'Can your ETRM solution perform real-time portfolio risk calculations for multi-commodity books?',
        ar: 'هل يمكن لحلول ETRM تنفيذ حسابات المخاطر اللحظية لمحافظ تضم سلعاً متعددة (نفط، غاز، كهرباء، حبوب)؟',
      },
      answer: {
        en: 'Yes. Our quantitative risk engine utilizes distributed GPU-accelerated Monte Carlo simulations and stateful streaming architectures (Apache Flink), delivering sub-second Mark-to-Market (MtM) and Value-at-Risk (VaR) calculations across thousands of complex cross-commodity derivatives.',
        ar: 'نعم بالتأكيد. يستخدم محرك المخاطر الكمي محاكاة مونت كارلو الموزعة والمسرعة بمعالجات GPU ومسارات البث الفوري (Apache Flink)، ليقدم حسابات القيمة السوقية (MtM) والقيمة المعرضة للمخاطر (VaR) في أجزاء من الثانية لآلاف عقود المشتقات المعقدة.',
      },
    },
    {
      question: {
        en: 'How does the automated battery energy storage (BESS) dispatch engine operate?',
        ar: 'كيف يعمل محرك التوجيه والشحن الآلي لبطاريات تخزين الطاقة (BESS)؟',
      },
      answer: {
        en: 'The engine continuously ingests day-ahead electricity spot prices, dynamic grid frequency telemetry, and localized solar/wind production forecasts. It automatically dispatches charging cycles during low-cost surplus generation and injects power back into the grid during peak pricing windows.',
        ar: 'يستقبل المحرك باستمرار أسعار الكهرباء الفورية المتوقعة، وتردد الشبكة اللحظي، وتنبؤات إنتاج مزارع الرياح والشمس. يوجه النظام البطاريات للشحن تلقائياً في فترات فائض الإنتاج وانخفاض السعر، ويفرغ الطاقة في الشبكة أثناء ساعات الذروة لتحقيق أعلى عائد.',
      },
    },
    {
      question: {
        en: 'How does your platform calculate Scope 1, 2, and 3 emissions for regulatory reporting?',
        ar: 'كيف تحسب المنصة انبعاثات النطاقات 1 و 2 و 3 لتقارير الاستدامة الرسمية؟',
      },
      answer: {
        en: 'The platform translates raw physical fuel flow meter logs, utility billing telemetry, and maritime shipping fuel burn directly into standardized carbon dioxide equivalent (CO2e) metrics using internationally verified GHG Protocol emission factors, generating auditable ESG reports with one click.',
        ar: 'تقوم المنصة بتحويل قراءات عدادات تدفق الوقود الميدانية، واستهلاك الكهرباء، وبيانات استهلاك وقود السفن مباشرة إلى مكافئ ثاني أكسيد الكربون (CO2e) وفق معاملات الانبعاث المعتمدة لـ GHG Protocol، وتصدر تقارير استدامة مدققة بنقرة واحدة.',
      },
    },
    {
      question: {
        en: 'How do you safeguard operational technology (OT) from external cybersecurity threats?',
        ar: 'كيف تحمون شبكات التقنيات التشغيلية (OT) من التهديدات السيبرانية الخارجية؟',
      },
      answer: {
        en: 'We adhere strictly to the Purdue Enterprise Reference Architecture and ISA/IEC 62443 standards. OT networks are isolated behind industrial firewalls with micro-segmentation, multi-factor bastion jump-hosts, and continuous anomaly detection for industrial protocols like Modbus and DNP3.',
        ar: 'نلتزم بدقة بنموذج Purdue ومعايير ISA/IEC 62443 العالمية. تعزل شبكات التحكم الصناعي تماماً خلف جدران حماية صناعية مع تقسيم أمني دقيق، وبوابات وصول محصنة، وفحص مستمر للأنشطة غير الطبيعية في بروتوكولات Modbus و DNP3.',
      },
    },
    {
      question: {
        en: 'What is the implementation timeline for a digital energy or ETRM platform?',
        ar: 'ما هو الإطار الزمني لتنفيذ منصة طاقة رقمية أو منظومة ETRM؟',
      },
      answer: {
        en: 'A pilot deployment connecting an operational wind/solar asset or establishing an ETRM risk shadow trading book typically takes 10 to 14 weeks. Full enterprise-wide rollout across multiple facilities spans 4 to 6 months depending on legacy SCADA telemetry density.',
        ar: 'يستغرق الإطلاق التجريبي لربط محطة طاقة متجددة أو تدشين محفظة تداول موازية في نظام ETRM عادة ما بين 10 إلى 14 أسبوعاً. أما التعميم الشامل على مستوى كافة المحطات فيستغرق من 4 إلى 6 أشهر بحسب كثافة مستشعرات SCADA القائمة.',
      },
    },
  ],
};
