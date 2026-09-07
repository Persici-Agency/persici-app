import type {
  SolutionDiagramType,
  FeaturedClientStoryItem,
  SolutionBenefitItem,
  SolutionExecutionPillar,
  SolutionFaqItem,
} from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { getSupplyChainFeaturedClientStories } from '@shared/data';

export interface SupplyChainOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface SupplyChainVerticalItem {
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

export interface SupplyChainData {
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
  offerings: SupplyChainOfferingItem[];
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
  verticals: SupplyChainVerticalItem[];
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

export const supplyChainData: SupplyChainData = {
  hero: {
    tag: {
      en: 'Solutions & Logistics Intelligence',
      ar: 'الحلول وسلاسل الإمداد الذكية',
    },
    secondaryTag: {
      en: 'Supply Chain & Fulfillment',
      ar: 'سلاسل الإمداد والخدمات اللوجستية',
    },
    title: {
      en: 'Intelligent Supply Chain & Logistics That Turn Global Disruption Into Unfair Advantage',
      ar: 'سلاسل إمداد ذكية تحوّل اضطرابات التجارة إلى ميزة تنافسية استثنائية ونمو مستدام',
    },
    subtitle: {
      en: 'Turn your supply chain into a resilient, autonomous value engine. We unify AI demand sensing, multi-echelon inventory optimization, automated warehouse robotics (WMS/WCS), and end-to-end multi-modal visibility—empowering enterprise leaders across the GCC to respond faster, protect margins, and fulfill every customer promise.',
      ar: 'حوّل سلسلة إمدادك إلى محرك قيمة ذاتي التشغيل وفائق المرونة. نوحد الاستشعار التنبؤي للطلب بالذكاء الاصطناعي، وتحسين المخزون متعدد المستويات، وأتمتة المستودعات والروبوتات، والتتبع اللوجستي الشامل متعدد الوسائط—لتمكين قادة الأعمال في الخليج من الاستجابة الفورية وحماية هوامش الربح والوفاء بكل وعد للعملاء.',
    },
    ctaText: {
      en: 'Schedule Supply Chain Strategy Audit',
      ar: 'احجز تدقيق استراتيجية سلاسل الإمداد',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=85',
    highlights: [
      {
        en: 'Multi-Echelon Real-Time Inventory Visibility (ERP & WMS)',
        ar: 'رؤية لحظية شاملة للمخزون عبر كافة المستودعات والمتاجر',
      },
      {
        en: 'AI-Powered Autonomous Demand Sensing & Bullwhip Damping',
        ar: 'استشعار تنبؤي ذكي للطلب والحد من تقلبات سلاسل التوريد',
      },
      {
        en: 'Distributed Order Management (DOM) & Sub-Second ATP',
        ar: 'إدارة وتوجيه الطلبات الموزعة وتأكيد التوفر بأجزاء من الثانية',
      },
      {
        en: 'Smart Fleet Telematics & Cold-Chain IoT Sensor Tracking',
        ar: 'تتبع ذكي للأساطيل ومراقبة سلاسل التبريد بحساسات إنترنت الأشياء',
      },
    ],
  },

  offeringsTitle: {
    en: 'Core Supply Chain & Logistics Capabilities',
    ar: 'القدرات الأساسية في سلاسل الإمداد والخدمات اللوجستية',
  },
  offeringsSubtitle: {
    en: 'Six specialized disciplines uniting advanced algorithmic optimization, modern fulfillment software, and automated physical robotics to engineer an unstoppable supply chain.',
    ar: 'ستة مسارات تخصصية تدمج الخوارزميات المتقدمة وبرمجيات الشحن الحديثة والروبوتات المؤتمتة لبناء منظومة إمداد ولوجستيات عالية الكفاءة والصمود.',
  },
  offerings: [
    {
      slug: 'supply-chain-strategy-transformation',
      tag: {
        en: 'Network Optimization',
        ar: 'تخطيط الشبكات الاستراتيجية',
      },
      title: {
        en: 'Supply Chain Strategy & Network Design',
        ar: 'استراتيجية سلاسل الإمداد وتصميم الشبكات اللوجستية',
      },
      description: {
        en: 'Holistic supply network blueprinting, greenfield distribution center site selection, Total Landed Cost (TLC) simulation, and ESG decarbonization audits to optimize regional flow.',
        ar: 'تخطيط شامل لشبكات التوزيع، واختيار مواقع المراكز اللوجستية، ومحاكاة التكلفة الإجمالية للوصول (TLC)، وتدقيق الاستدامة وخفض الانبعاثات لتحسين التدفق الإقليمي.',
      },
      icon: '/icons/solutions/sc-network-strategy.svg',
      diagramType: 'sc-global-network-flow',
      highlights: {
        en: [
          'Digital Twin Network Topology & Greenfield DC Simulation',
          'Total Landed Cost (TLC) Tariff & Freight Modeling',
          'Nearshoring, Dual-Sourcing & Supply Risk Decoupling',
        ],
        ar: [
          'محاكاة رقمية لشبكات التوزيع ومواقع المستودعات الجديدة',
          'نمذجة التكلفة الإجمالية للوصول والرسوم الجمركية وأجور الشحن',
          'استراتيجيات التوريد المزدوج وتنويع الموردين لتقليل المخاطر',
        ],
      },
    },
    {
      slug: 'demand-sensing-supply-planning',
      tag: {
        en: 'Predictive Intelligence',
        ar: 'الذكاء التنبؤي للطلب',
      },
      title: {
        en: 'AI Demand Sensing & Predictive Supply Planning',
        ar: 'استشعار الطلب بالذكاء الاصطناعي والتخطيط التنبؤي للتوريد',
      },
      description: {
        en: 'Replace static historical run-rates with machine learning models that ingest POS sell-through, promotional calendar shifts, macroeconomic signals, and weather telemetry.',
        ar: 'استبدال التنبؤات التاريخية الجامدة بنماذج تعلم آلي متطورة تستوعب مبيعات نقاط البيع، والحملات الترويجية، ومؤشرات الاقتصاد، وبيانات الطقس للتنبؤ الدقيق.',
      },
      icon: '/icons/solutions/sc-demand-sensing.svg',
      diagramType: 'sc-demand-forecast-waveform',
      highlights: {
        en: [
          'Multi-Horizon SKU-Level Machine Learning Forecasting',
          'Bullwhip Effect Damping & Collaborative S&OP Workflows',
          'Dynamic Buffer Stock & Service-Level Safety Optimizers',
        ],
        ar: [
          'تنبؤات دقيقة على مستوى المنتجات الفردية عبر آفاق زمنية متعددة',
          'تخفيف أثر السوط (Bullwhip Effect) ومواءمة المبيعات والعمليات (S&OP)',
          'تحسين ديناميكي لمخزون الأمان لضمان أعلى مستويات الخدمة',
        ],
      },
    },
    {
      slug: 'omnichannel-fulfillment-dom',
      tag: {
        en: 'Order Orchestration',
        ar: 'إدارة وتوجيه الطلبات الموزعة',
      },
      title: {
        en: 'Distributed Order Management (DOM) & Fulfillment',
        ar: 'إدارة الطلبات الموزعة (DOM) وتكامل قنوات الوفاء',
      },
      description: {
        en: 'Intelligent routing engines that evaluate stock proximity, shipping tariffs, store capacity, and delivery promises in real time—slashing split shipments and fulfillment lag.',
        ar: 'محركات توجيه ذكية تقيّم قرب المخزون، وتكلفة الشحن، والطاقة الاستيعابية للمتاجر، وتعهدات التسليم لحظياً—مما يقضي على تجزئة الشحنات ويقلل زمن التنفيذ.',
      },
      icon: '/icons/solutions/sc-order-fulfillment.svg',
      diagramType: 'sc-omnichannel-fulfillment-hub',
      highlights: {
        en: [
          'Real-Time Available-to-Promise (ATP) & Capable-to-Promise (CTP)',
          'Ship-from-Store, Click-and-Collect & Micro-Hub Orchestration',
          'Automated Split-Shipment Consolidation & Least-Cost Routing',
        ],
        ar: [
          'تأكيد لحظي للتوفر والقدرة على الوفاء (ATP/CTP) قبل الدفع',
          'الشحن من الفروع، والاستلام من المتاجر، والمستودعات المصغرة',
          'دمج تلقائي للشحنات واختيار مسارات التوصيل الأقل تكلفة',
        ],
      },
    },
    {
      slug: 'warehouse-automation-robotics',
      tag: {
        en: 'Warehouse & Robotics',
        ar: 'أتمتة المستودعات والروبوتات',
      },
      title: {
        en: 'Smart Warehouse Operations & AMR Robotics (WMS/WCS)',
        ar: 'إدارة المستودعات الذكية والروبوتات المتنقلة (WMS/WCS)',
      },
      description: {
        en: 'Transform storage nodes into autonomous fulfillment engines. We engineer next-generation WMS platforms integrated with Autonomous Mobile Robots (AMR) and pick-to-light systems.',
        ar: 'تحويل المستودعات إلى محركات وفاء مؤتمتة. نصمم منصات WMS حديثة متكاملة مع الروبوتات الذكية المتنقلة (AMR) وأنظمة الالتقاط الضوئي والفرز الآلي.',
      },
      icon: '/icons/solutions/sc-warehouse-automation.svg',
      diagramType: 'sc-warehouse-robotics-grid',
      highlights: {
        en: [
          'Autonomous Mobile Robot (AMR) & AGV Fleet Coordination',
          'Dynamic Slotting Optimization Based on Velocity & Dimensions',
          'Computer Vision Inbound Inspection & Automated Put-Away',
        ],
        ar: [
          'تنسيق أساطيل الروبوتات المتنقلة (AMR) والمركبات الموجهة آلياً',
          'تحسين ديناميكي لأماكن التخزين بناءً على سرعة دوران البضائع',
          'فحص بصري آلي للشحنات الواردة وتوجيه التخزين بالذكاء الاصطناعي',
        ],
      },
    },
    {
      slug: 'fleet-logistics-telematics',
      tag: {
        en: 'Fleet & TMS',
        ar: 'إدارة النقل وتتبع الأساطيل',
      },
      title: {
        en: 'Intelligent Transportation & Dynamic Fleet Dispatch (TMS)',
        ar: 'أنظمة إدارة النقل الذكية وتوزيع الأساطيل الديناميكي (TMS)',
      },
      description: {
        en: 'Next-generation Transportation Management Systems (TMS) delivering sub-second route recalculations, 3D container cubing, live driver telematics, and cold-chain compliance.',
        ar: 'منظومات متقدمة لإدارة النقل توفر إعادة احتساب فوري للمسارات، وحساب الأحمال ثلاثي الأبعاد، وتتبع السائقين وسلاسل التبريد عبر إنترنت الأشياء.',
      },
      icon: '/icons/solutions/sc-fleet-telematics.svg',
      diagramType: 'sc-fleet-transit-radar',
      highlights: {
        en: [
          'Multi-Stop Dynamic Route Dispatch & Traffic Optimization',
          'Real-Time Cold-Chain Temperature & Humidity IoT Telemetry',
          'Automated Carrier Rate Procurement & Freight Audit Matching',
        ],
        ar: [
          'توجيه ديناميكي للرحلات متعددة المحطات وتفادي الازدحام المروري',
          'مراقبة لحظية لدرجات حرارة ورطوبة شحنات التبريد بحساسات IoT',
          'أتمتة تسعير وتدقيق فواتير الشحن مع شركات النقل المختلفة',
        ],
      },
    },
    {
      slug: 'end-to-end-visibility-control-tower',
      tag: {
        en: 'Control Tower & Risk',
        ar: 'برج المراقبة وإدارة المخاطر',
      },
      title: {
        en: 'Supply Chain Control Tower & Risk Intelligence',
        ar: 'برج مراقبة سلاسل الإمداد واستشعار المخاطر التشغيلية',
      },
      description: {
        en: 'A unified single pane of glass aggregating ERP, carrier EDI/API feeds, customs gates, port congestion telemetry, and weather feeds with automated AI incident playbooks.',
        ar: 'منصة مركزية موحدة تدمج أنظمة المؤسسة، وبيانات الناقلين الفورية، وبوابات الجمارك، وحركة الموانئ، والطقس مع سيناريوهات استجابة مؤتمتة عند الأزمات.',
      },
      icon: '/icons/solutions/sc-control-tower.svg',
      diagramType: 'sc-control-tower-nexus',
      highlights: {
        en: [
          'Real-Time Milestone Tracking Across Air, Sea, Road & Rail',
          'Predictive Customs Clearance & Port Congestion Geofencing',
          'Autonomous Exception Management & Disruption Mitigation',
        ],
        ar: [
          'تتبع فوري لمراحل الشحن الجوي والبحري والبري وسكك الحديد',
          'تنبؤ بأوقات التخليص الجمركي وازدحام الموانئ بالنطاقات الجغرافية',
          'إدارة استباقية للأزمات وخطط طوارئ مؤتمتة لتفادي التأخير',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Fragile Supply Chains Bleed Capital; Resilient Value Networks Create Market Dominance',
      ar: 'سلاسل الإمداد الهشة تستنزف الأرباح؛ والشبكات الرقمية المرنة تصنع الريادة السوقية',
    },
    text: {
      en: 'Modern enterprise supply chains face unprecedented volatility: geopolitical chokepoints, escalating fuel and shipping tariffs, port bottlenecks, and soaring customer expectations for same-day delivery. Organizations operating on siloed legacy spreadsheets and disconnected ERP databases suffer from chronic stockouts, bloated working capital, and missed fulfillment promises. Transforming your supply chain with autonomous AI sensing, distributed order routing, and real-time visibility turns vulnerability into an insurmountable competitive advantage.',
      ar: 'تواجه سلاسل الإمداد المؤسسية اليوم تقلبات غير مسبوقة: اختناقات المضائق الجيوسياسية، وارتفاع أجور الشحن والوقود، وازدحام الموانئ، وتوقعات العملاء المتصاعدة بالتوصيل في نفس اليوم. إن الشركات التي لا تزال تعتمد على جداول البيانات المعزولة وقواعد البيانات المفككة تعاني من نفاد المخزون، وتضخم رأس المال العامل، والإخفاق في الوفاء بوعود التسليم. إن تحويل سلسلة إمدادك عبر الذكاء الاصطناعي والتوجيه الموزع للطلبات والرؤية اللحظية يحول التحديات إلى ميزة تنافسية كبرى.',
    },
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=85',
    metric1Val: '99.4%',
    metric1Label: {
      en: 'On-Time In-Full (OTIF) Fulfillment Rate',
      ar: 'معدل التسليم الكامل في الوقت المحدد (OTIF)',
    },
    metric2Val: '-35%',
    metric2Label: {
      en: 'Reduction in Working Capital Holding Costs',
      ar: 'انخفاض في تكاليف احتجاز رأس المال المخزني',
    },
  },

  benefitsStrip: {
    title: {
      en: 'Strategic Supply Chain Outcomes That Protect Margins & Deliver Velocity',
      ar: 'نتائج استراتيجية ملموسة تحمي هوامش الربح وتضاعف سرعة التوصيل',
    },
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=85',
    benefits: [
      {
        title: {
          en: '35% Lower Inventory Carrying Costs via Precision Safety Stock',
          ar: 'خفض تكلفة حفظ المخزون بنسبة 35% عبر موازنة مخزون الأمان',
        },
        description: {
          en: 'Machine learning algorithms calculate dynamic buffer thresholds per SKU, releasing trapped working capital without jeopardizing customer availability.',
          ar: 'تحسب خوارزميات التعلم الآلي هوامش أمان ديناميكية لكل صنف، مما يحرر رأس المال المحتجز دون المساس بتوفر المنتجات للعملاء.',
        },
      },
      {
        title: {
          en: 'Sub-Second Order Promising & Guaranteed Same-Day Delivery',
          ar: 'تأكيد فوري للطلبات وضمان التسليم في نفس اليوم بدقة متناهية',
        },
        description: {
          en: 'Distributed order management synchronizes physical store inventories and regional micro-hubs to fulfill orders from the most cost-effective and rapid location.',
          ar: 'تزامن إدارة الطلبات الموزعة مخزون المتاجر والمستودعات المصغرة لشحن كل طلب من النقطة الأسرع والأقل تكلفة.',
        },
      },
      {
        title: {
          en: '99.8% Cold-Chain & Perishable Cargo Quality Compliance',
          ar: 'امتثال بنسبة 99.8% لمعايير جودة سلاسل التبريد والأغذية الحساسة',
        },
        description: {
          en: 'IoT sensor telemetry streams live ambient temperature and humidity data to trigger proactive driver alerts before spoilage or regulatory non-compliance occurs.',
          ar: 'حساسات إنترنت الأشياء تبث بيانات درجات الحرارة والرطوبة فورياً لتنبيه السائقين استباقياً قبل تعرض البضائع للتلف أو مخالفة الأنظمة.',
        },
      },
      {
        title: {
          en: 'Resilient Disruption Mitigation via Digital Twin War-Rooms',
          ar: 'صمود فائق أمام الأزمات عبر غرف عمليات التوأم الرقمي والمحاكاة',
        },
        description: {
          en: 'Automated playbooks immediately reroute freight, activate alternative suppliers, and reallocate stock whenever port strikes, bad weather, or customs halts strike.',
          ar: 'سيناريوهات مؤتمتة تعيد توجيه الشحنات فوراً وتفعّل الموردين البدلاء وتعيد توزيع المخزون عند حدوث أي طارئ في الموانئ أو الجمارك.',
        },
      },
    ],
  },

  verticalsTitle: {
    en: 'Mission-Critical Supply Chain Architectures by Industry',
    ar: 'معماريات إمداد متخصصة ومصممة لكل قطاع',
  },
  verticalsSubtitle: {
    en: 'Purpose-engineered logistics and fulfillment operating models tailored to the specialized compliance and tempo requirements of leading regional industries.',
    ar: 'نماذج تشغيلية لوجستية مصممة هندسياً لتلبية أعلى متطلبات الدقة والامتثال والسرعة لمختلف القطاعات الرائدة في المنطقة.',
  },
  verticals: [
    {
      id: 'omnichannel-retail-ecommerce',
      number: '01',
      title: {
        en: 'Omnichannel Retail, Super-Apps & Quick Commerce',
        ar: 'التجزئة متعددة القنوات والتطبيقات السريعة والتجارة الإلكترونية',
      },
      description: {
        en: 'Sub-30-minute dark store fulfillment, ship-from-store networks, seamless unified returns management, and real-time inventory sync across millions of active consumer carts.',
        ar: 'وفاء بالطلبات في أقل من 30 دقيقة عبر المستودعات المظلمة، وشبكات الشحن من الفروع، وإدارة سلسة للمرتجعات وتزامن فوري للمخزون مع سلات التسوق.',
      },
      tag: {
        en: 'Retail & Quick Commerce',
        ar: 'التجزئة والتجارة السريعة',
      },
      capabilities: {
        en: [
          'Dark-store picking and automated bag-pack routing',
          'Unified omnichannel store returns & rapid restocking',
          'Sub-second cart reservation locks to eliminate ghost stock',
        ],
        ar: [
          'التقاط وتجهيز الطلبات في المتاجر المظلمة بتوجيه آلي',
          'إرجاع موحد عبر كافة القنوات وإعادة تجهيز سريعة للمخزون',
          'حجز المخزون في سلة العميل في أجزاء من الثانية لمنع النقص الوهمي',
        ],
      },
    },
    {
      id: 'pharma-cold-chain-life-sciences',
      number: '02',
      title: {
        en: 'Pharmaceuticals, Vaccines & Cold-Chain Life Sciences',
        ar: 'الأدوية واللقاحات وسلاسل التبريد الطبية والصحية',
      },
      description: {
        en: 'Strict temperature-controlled distribution (-80°C to +25°C), serialized GS1 track-and-trace compliance, Saudi SFDA and UAE MoHAP drug serialization traceability.',
        ar: 'توزيع فائق الدقة بضبط درجات الحرارة (-80 إلى +25 درجة مئوية)، وتتبع تسلسلي GS1 متوافق مع متطلبات هيئة الغذاء والدواء السعودية (SFDA) ووزارة الصحة الإماراتية.',
      },
      tag: {
        en: 'Life Sciences & Pharma',
        ar: 'الرعاية الصحية والأدوية',
      },
      capabilities: {
        en: [
          'SFDA / MoHAP serialization and 2D barcode batch track-and-trace',
          'Continuous real-time IoT cryogenic temperature telemetry',
          'Automated quarantine workflows for thermal excursion incidents',
        ],
        ar: [
          'تتبع وتسجيل الأدوية بالباركود ثنائي الأبعاد المتوافق مع SFDA',
          'مراقبة لحظية مستمرة لدرجات الحرارة الحرجة بحساسات دقيقة',
          'عزل وحجز آلي فوري للشحنات التي تعرضت لتغير في درجات الحرارة',
        ],
      },
    },
    {
      id: 'food-beverage-fresh-distribution',
      number: '03',
      title: {
        en: 'Food & Beverage, Dairy & Fresh FMCG Distribution',
        ar: 'الأغذية والمشروبات ومنتجات الألبان وسريعة التلف (FMCG)',
      },
      description: {
        en: 'First-Expired, First-Out (FEFO) automated allocation, cold-chain reefer telematics, dynamic dock door cross-docking, and shelf-life decay modeling for fresh goods.',
        ar: 'توزيع مؤتمت وفق مبدأ الأقرب انتهاءً يُصرف أولاً (FEFO)، وتتبع شاحنات التبريد، والعبور المباشر السريع (Cross-Docking)، ونمذجة دقيقة لصلاحية المنتجات الطازجة.',
      },
      tag: {
        en: 'FMCG & Fresh Foods',
        ar: 'الأغذية والسلع الاستهلاكية',
      },
      capabilities: {
        en: [
          'FEFO inventory dispatch rules to prevent expiration waste',
          'Zero-dwell cross-docking hubs for high-velocity perishables',
          'Automated electronic food safety hygiene compliance logs',
        ],
        ar: [
          'قواعد صرف FEFO الذكية لمنع هدر وتلف المنتجات الغذائية',
          'مراكز عبور وتوزيع مباشر دون تخزين للسلع فائقة السرعة',
          'سجلات إلكترونية مؤتمتة لمطابقة معايير السلامة والنظافة الغذائية',
        ],
      },
    },
    {
      id: 'industrial-manufacturing-automotive',
      number: '04',
      title: {
        en: 'Industrial Manufacturing, Automotive & Spare Parts',
        ar: 'التصنيع الصناعي وقطع غيار المركبات والآليات الثقيلة',
      },
      description: {
        en: 'Just-in-Time (JIT) line-side delivery, Kanban replenishment automation, heavy machinery spare parts distribution, and supplier VMI (Vendor-Managed Inventory) portals.',
        ar: 'تغذية خطوط الإنتاج بالوقت المناسب (JIT)، وأتمتة إعادة الطلب بأسلوب كانبان، وتوزيع قطع الغيار الثقيلة، وبوابات إدارة المخزون من قبل الموردين (VMI).',
      },
      tag: {
        en: 'Industrial & Automotive',
        ar: 'الصناعة والسيارات',
      },
      capabilities: {
        en: [
          'JIT delivery sequences synchronized with factory manufacturing lines',
          'Heavy-weight freight logistics routing and crane dispatching',
          'Automated supplier restock triggers via digital Kanban signals',
        ],
        ar: [
          'جدولة تسليم دقيقة ومتزامنة مع وتيرة خطوط التصنيع في المصانع',
          'توجيه الشحنات الثقيلة وتنسيق معدات الرفع والتفريغ بالمستودعات',
          'إشارات إعادة طلب مؤتمتة للموردين عبر منظومة كانبان الرقمية',
        ],
      },
    },
    {
      id: 'energy-oil-gas-critical-logistics',
      number: '05',
      title: {
        en: 'Energy, Oil & Gas Remote Field Logistics',
        ar: 'لوجستيات قطاع الطاقة والنفط والغاز والمواقع النائية',
      },
      description: {
        en: 'Remote rig replenishment, critical down-hole valve expedited hotshot delivery, dangerous goods (HAZMAT) compliance, and heavy offshore supply vessel coordination.',
        ar: 'إمداد منصات الحفر النائية، وتوصيل القطع والصمامات الحرجة على مدار الساعة، والامتثال الصارم لنقل المواد الخطرة (HAZMAT)، وتنسيق سفن الإمداد البحرية.',
      },
      tag: {
        en: 'Energy & Heavy Industry',
        ar: 'الطاقة والصناعات الثقيلة',
      },
      capabilities: {
        en: [
          '24/7 hotshot emergency courier dispatch to desert rigs and refineries',
          'HAZMAT regulatory certification and digital compliance passports',
          'Offshore marine logistics, supply vessel tracking and dock staging',
        ],
        ar: [
          'خدمة شحن طارئة على مدار الساعة لمنصات النفط والمصافي النائية',
          'شهادات وجوازات رقمية لنقل المواد الخطرة وفق المعايير الدولية',
          'تنسيق اللوجستيات البحرية وسفن الإمداد وتجهيز الأرصفة البحرية',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'Production-Grade Supply Chain & Logistics Tech Ecosystem',
    ar: 'المنظومة التقنية لسلاسل الإمداد واللوجستيات المؤسسية',
  },
  techStackSubtitle: {
    en: 'Engineered with proven enterprise platforms, real-time event streaming brokers, and cutting-edge robotics coordination frameworks.',
    ar: 'مبنية على منصات مؤسسية عريقة، وموزعات تدفق بيانات لحظية، وأحدث أطر التنسيق الروبوتية المتقدمة.',
  },
  techStackPods: [
    {
      title: {
        en: 'Supply Chain AI & Demand Sensing Engines',
        ar: 'محركات الذكاء الاصطناعي والتنبؤ بالطلب',
      },
      badge: {
        en: 'AI & S&OP',
        ar: 'الذكاء والتخطيط',
      },
      description: {
        en: 'Advanced machine learning forecasting pipelines processing point-of-sale data, market elasticities, seasonal promotions, and external macroeconomic indicators.',
        ar: 'نماذج تعلم آلي متقدمة تحلل بيانات نقاط البيع، ومرونة الأسعار، والمواسم الترويجية، والمؤشرات الاقتصادية الخارجية.',
      },
      technologies: [
        { name: 'Blue Yonder / o9 Solutions', category: 'Enterprise S&OP Planning', badge: 'Tier 1' },
        { name: 'AWS Supply Chain', category: 'Cloud Supply Intelligence' },
        { name: 'Python / PyTorch & Prophet', category: 'Custom ML Forecasting' },
        { name: 'Databricks Lakehouse', category: 'Feature Store & Model Training' },
        { name: 'SAP Integrated Business Planning (IBP)', category: 'Core ERP Demand Sync' },
      ],
    },
    {
      title: {
        en: 'Distributed Order Management (DOM) & Inventory Core',
        ar: 'إدارة وتوجيه الطلبات الموزعة ونواة المخزون',
      },
      badge: {
        en: 'Order Routing',
        ar: 'توجيه الطلبات',
      },
      description: {
        en: 'Headless, decoupled order orchestration microservices synchronizing multi-enterprise inventories, reservation locks, and least-cost fulfillment algorithms.',
        ar: 'خدمات مصغرة لإدارة الطلبات الموزعة تزامن مخزون الشبكة بالكامل، وتطبق أقفال الحجز اللحظية، وخوارزميات الشحن الأقل تكلفة.',
      },
      technologies: [
        { name: 'Fluent Commerce OMS', category: 'Distributed Order Management', badge: 'Headless' },
        { name: 'Manhattan Active Omni', category: 'Omnichannel Routing & ATP' },
        { name: 'SAP S/4HANA / Oracle ERP', category: 'Core Financials & Master Data' },
        { name: 'IBM Sterling Order Management', category: 'Enterprise EDI & B2B' },
        { name: 'Redis Enterprise', category: 'Sub-Second ATP Inventory Cache', badge: 'In-Memory' },
      ],
    },
    {
      title: {
        en: 'Warehouse Management & AMR Robotics (WMS/WCS)',
        ar: 'أنظمة إدارة المستودعات والروبوتات الذكية',
      },
      badge: {
        en: 'WMS & Robotics',
        ar: 'المستودعات والروبوتات',
      },
      description: {
        en: 'High-throughput warehouse management software coupled with Warehouse Execution Systems (WES) to orchestrate human labor, conveyors, and robotic fleets.',
        ar: 'برمجيات إدارة المستودعات عالية الإنتاجية المتصلة بأنظمة التنفيذ (WES) لتنسيق العمالة البشرية، والسيور الناقلة، وأساطيل الروبوتات.',
      },
      technologies: [
        { name: 'Körber / Manhattan WMS', category: 'Enterprise Warehouse Management' },
        { name: 'ROS 2 (Robot Operating System)', category: 'Autonomous Mobile Robot Fleet' },
        { name: 'NVIDIA Isaac Sim', category: 'Digital Twin Warehouse Simulation', badge: 'Omniverse' },
        { name: 'Zebra Technologies RFID', category: 'Passive & Active RFID Inbound' },
        { name: 'Pick-to-Light & Put-Wall Systems', category: 'High-Velocity eCommerce Fulfillment' },
      ],
    },
    {
      title: {
        en: 'Transportation (TMS), Telematics & Control Towers',
        ar: 'إدارة النقل والتتبع وأبراج المراقبة',
      },
      badge: {
        en: 'TMS & Visibility',
        ar: 'النقل والرؤية',
      },
      description: {
        en: 'End-to-end multi-modal carrier integration, real-time IoT temperature telematics, dynamic route dispatchers, and unified control tower dashboards.',
        ar: 'ربط متكامل لشركات النقل متعددة الوسائط، وحساسات تتبع درجات الحرارة اللحظية، وأنظمة التوجيه الذكي، ولوحات تحكم مركزية للأزمات.',
      },
      technologies: [
        { name: 'Project44 / FourKites', category: 'Global Multi-Modal Visibility', badge: 'Real-Time' },
        { name: 'Oracle / SAP Transportation (TMS)', category: 'Freight Procurement & Rating' },
        { name: 'GeoTab / Teltonika IoT', category: 'Heavy Vehicle Fleet Telematics' },
        { name: 'Apache Kafka & Flink', category: 'Real-Time Telemetry Event Bus', badge: 'High-Speed' },
        { name: 'TimescaleDB & ClickHouse', category: 'Geospatial Time-Series Database' },
      ],
    },
  ],

  clientStories: getSupplyChainFeaturedClientStories(),

  delivery: {
    title: {
      en: 'How We Deliver Differently: Our 4 Supply Chain Pillars',
      ar: 'كيف نبتكر لوجستياً بشكل مختلف: ركائزنا الأربع لسلاسل الإمداد',
    },
    subtitle: {
      en: 'A pragmatic engineering methodology that connects software, robotics, and operational field execution into an adaptive, resilient value engine.',
      ar: 'منهجية هندسية وتشغيلية راسخة تربط البرمجيات المتقدمة والروبوتات بالعمل الميداني لبناء محرك قيمة مرن وقابل للتكيف المستمر.',
    },
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=85',
    pillars: [
      {
        title: {
          en: 'Digital Twin Simulation & Scenario Stress-Testing',
          ar: 'المحاكاة بالتوأم الرقمي واختبارات الضغط للسيناريوهات',
        },
        description: {
          en: 'Before committing capital expenditures to warehouses or fleet leases, we construct physics-based digital twins to test peak sales days, port closure scenarios, and warehouse layout throughput.',
          ar: 'قبل استثمار ملايين الدولارات في المستودعات أو استئجار الأساطيل، نبني توأماً رقمياً للمنظومة لاختبار أيام الذروة ومحاكاة إغلاق الموانئ وسرعة تدفق البضائع.',
        },
      },
      {
        title: {
          en: 'API-First Logistics Mesh & Event-Driven Architecture',
          ar: 'شبكة لوجستية معتمدة على الـ APIs ومعمارية تدفق الأحداث',
        },
        description: {
          en: 'We eliminate rigid batch file transfers (legacy flat files) in favor of sub-second Kafka event streams that broadcast order changes, warehouse scan events, and delivery coordinates across your stack.',
          ar: 'نقضي على التبادلات البطيئة للملفات الجامدة عبر مسارات تدفق أحداث فورية في Kafka تبث تحديثات الطلبات وعمليات المسح بالمستودع وإحداثيات الشحن لحظة بلحظة.',
        },
      },
      {
        title: {
          en: 'Lean Operational Kaizen & Warehouse Floor Engineering',
          ar: 'منهجية كايزن اللوجستية وهندسة العمليات الميدانية بالمستودعات',
        },
        description: {
          en: 'Software alone cannot fix a flawed physical operation. Our industrial engineers analyze ergonomics, pick paths, dock cross-docking bottlenecks, and packaging waste on the actual warehouse floor.',
          ar: 'البرمجيات وحدها لا تصلح التشغيل الميداني المعيب. يحلل مهندسونا الصناعيون مسارات الالتقاط، وحركة الرافعات، واختناقات أرصفة التحميل على أرض المستودع لتقليل الهدر.',
        },
      },
      {
        title: {
          en: 'Sovereign Customs Automation & Regulatory Compliance',
          ar: 'أتمتة الجمارك السيادية والامتثال للتشريعات والفوترة الإلكترونية',
        },
        description: {
          en: 'Pre-configured integrations with Saudi ZATCA e-invoicing Phase 2, Fasah customs portals, and UAE Federal Customs platforms accelerate border crossings and eliminate customs seizure risks.',
          ar: 'ربط برمجي مسبق مع منظومة الفاتورة الإلكترونية لهيئة الزكاة والضريبة والجمارك السعودية (ZATCA)، ومنصة فسح، وجمارك الإمارات لتسريع الإفراج الجمركي.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'autonomous-supply-chain-control-towers',
      slug: 'autonomous-supply-chain-control-towers',
      type: 'insight',
      badge: {
        en: 'Strategic Logistics Blueprint',
        ar: 'مخطط لوجستي استراتيجي',
      },
      title: {
        en: 'From Fragile to Agile: Building Autonomous Supply Chain Control Towers in the GCC',
        ar: 'من الهشاشة إلى المرونة: كيف تبني أبراج مراقبة ذاتية لسلاسل الإمداد في الخليج',
      },
      excerpt: {
        en: 'How regional enterprise logistics leaders unite ERP data, carrier IoT telemetry, and predictive AI playbooks to eliminate disruption blindspots.',
        ar: 'كيف يوحد قادة اللوجستيات بالمنطقة بيانات أنظمة المؤسسة وتتبع الشاحنات بإنترنت الأشياء والذكاء التنبؤي لتفادي مفاجآت التأخير.',
      },
      date: '2026-03-05',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      href: '/insights/autonomous-supply-chain-control-towers',
    },
    {
      id: 'micro-fulfillment-dark-stores-blueprint',
      slug: 'micro-fulfillment-dark-stores-blueprint',
      type: 'insight',
      badge: {
        en: 'Quick Commerce Architecture',
        ar: 'هندسة التجارة السريعة',
      },
      title: {
        en: 'Micro-Fulfillment and Dark Stores: The Engineering Blueprint for 30-Minute Delivery',
        ar: 'المستودعات المصغرة والمتاجر المظلمة: الدليل الهندسي لتحقيق التوصيل في 30 دقيقة',
      },
      excerpt: {
        en: 'Architecting inventory allocation, robotics picking cells, and dynamic last-mile dispatch to deliver ultra-fast fulfillment without margin erosion.',
        ar: 'تصميم توزيع المخزون وخلايا الالتقاط الروبوتية والتوجيه الذكي للميل الأخير لتحقيق أسرع توصيل مع حماية هوامش الربحية.',
      },
      date: '2026-02-22',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
      href: '/insights/micro-fulfillment-dark-stores-blueprint',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici transformed our fragmented regional supply chain into an autonomous, predictive fulfillment powerhouse. Across 42 distribution centers and 380 retail stores in Saudi Arabia and the UAE, our stockouts dropped by 72% while same-day order throughput doubled. Their deep integration of robotics, WMS, and real-time Kafka telemetry set a new standard for Middle Eastern logistics.',
      ar: 'حوّلت بيرسيكي سلسلة إمدادنا الإقليمية المفككة إلى منظومة وفاء ذاتية التشغيل وفائقة التنبؤ. وعبر 42 مركز توزيع و380 متجراً في السعودية والإمارات، انخفض نفاد المخزون لدينا بنسبة 72% وتضاعفت سرعة شحن طلبات اليوم نفسه. إن تكاملهم العميق بين الروبوتات وأنظمة WMS وتدفق البيانات اللحظي وضع معياراً جديداً للوجستيات في الشرق الأوسط.',
    },
    author: 'Eng. Sultan Al-Ghamdi',
    role: {
      en: 'Chief Supply Chain Officer (CSCO), Gulf Omnichannel Logistics & Retail',
      ar: 'رئيس قطاع سلاسل الإمداد، شركة الخليج للوجستيات والتجزئة',
    },
    badge: {
      en: 'Verified Enterprise Logistics Transformation',
      ar: 'تحول لوجستي ومؤسسي معتمد في سلاسل الإمداد',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions',
    ar: 'الأسئلة الشائعة حول سلاسل الإمداد واللوجستيات',
  },
  faqsSubtitle: {
    en: 'Pragmatic perspectives on WMS vs OMS architecture, ERP integration timelines, cold-chain compliance, and AMR robotics ROI.',
    ar: 'إجابات هندسية وعملية حول أنظمة WMS وOMS، والجداول الزمنية لربط الـ ERP، والامتثال لسلاسل التبريد، وعوائد الاستثمار في الروبوتات.',
  },
  faqs: [
    {
      question: {
        en: 'What is the operational difference between a WMS and a Distributed Order Management (DOM) system?',
        ar: 'ما هو الفرق التشغيلي بين نظام إدارة المستودعات (WMS) ونظام إدارة الطلبات الموزعة (DOM)؟',
      },
      answer: {
        en: 'A Warehouse Management System (WMS) governs everything that happens inside the four walls of a physical facility: receiving, inventory slotting, picker routing, packing, and shipping dock assignment. A Distributed Order Management (DOM) system sits above all facilities, stores, and suppliers—deciding which specific facility, store, or vendor should fulfill an order based on shipping cost, proximity, inventory availability, and customer SLA promise.',
        ar: 'يدير نظام إدارة المستودعات (WMS) كل ما يحدث داخل جدران المستودع الفعلي: الاستلام، وترتيب البضائع في الأرفف، وتوجيه العمال لالتقاط الأصناف، والتعبئة، وتجهيز أرصفة الشحن. أما نظام إدارة الطلبات الموزعة (DOM)، فيعمل كطبقة عليا تشرف على كافة المستودعات والفروع والموردين، ويحدد بذكاء أي موقع هو الأنسب لشحن الطلب استناداً إلى التكلفة، والقرب الجغرافي، وتوفر المخزون، وتعهد وقت التسليم.',
      },
    },
    {
      question: {
        en: 'How long does an end-to-end WMS, TMS, and OMS supply chain modernization typically take?',
        ar: 'ما هي المدة الزمنية المعتادة لتنفيذ مشروع تحديث شامل لأنظمة WMS وTMS وOMS؟',
      },
      answer: {
        en: 'A standard enterprise deployment spans 12 to 16 weeks structured in iterative phases: Operational and network discovery (Weeks 1-3), API integration and ERP connectors (Weeks 4-7), Pilot facility deployment and AMR/hardware testing (Weeks 8-11), and Phased multi-node rollout with continuous hypercare (Weeks 12-16). Quick-win modules like real-time ATP or route dispatchers frequently go live within the first 6 weeks.',
        ar: 'يستغرق التنفيذ المؤسسي المتكامل عادة بين 12 إلى 16 أسبوعاً مقسمة على مراحل متتالية: دراسة العمليات والشبكة (الأسابيع 1-3)، بناء واجهات الربط والتكامل مع الـ ERP (الأسابيع 4-7)، إطلاق تجريبي في مستودع رئيسي واختبار الروبوتات والأجهزة (الأسابيع 8-11)، ثم التوسع التدريجي عبر باقي المراكز مع دعم تشغيلي مكثف (الأسابيع 12-16). وتبدأ الميزات السريعة كالتأكيد اللحظي للتوفر بتوليد قيمة خلال الأسابيع الأولى.',
      },
    },
    {
      question: {
        en: 'How do you ensure uninterrupted operational continuity during warehouse system cutovers?',
        ar: 'كيف تضمنون عدم توقف العمليات الميدانية في المستودعات أثناء الانتقال إلى النظام الجديد؟',
      },
      answer: {
        en: 'We use parallel shadowing and zone-by-zone cutovers rather than a high-risk "big-bang" switch. We run the legacy and new systems in parallel across specific non-critical categories, conduct digital twin simulation of order pick batches, and train warehouse floor teams during low-volume shifts with physical handheld dry runs until pick accuracy exceeds 99.9%.',
        ar: 'نتبع منهجية الانتقال التدريجي حسب المناطق والتشغيل المتوازي (Parallel Shadowing) بدلاً من التبديل الكلي المفاجئ. نطبق النظام الجديد في أقسام محددة أولاً، ونجري محاكاة رقمية لأفواج الطلبات، وندرب فرق العمل الميدانية في أوقات انخفاض حركة الشحن مع تطبيقات عملية على أجهزة المسح اليدوية حتى تتجاوز دقة الالتقاط 99.9% قبل الإطلاق الشامل.',
      },
    },
    {
      question: {
        en: 'What is the realistic return on investment (ROI) timeframe for Autonomous Mobile Robots (AMR)?',
        ar: 'ما هو الإطار الزمني الواقعي لعائد الاستثمار (ROI) عند إدخال الروبوتات المتنقلة (AMR)؟',
      },
      answer: {
        en: 'For high-velocity distribution centers with over 10,000 daily order picks, AMRs typically achieve full capital payback within 12 to 18 months. The return is driven by a 2.5x to 3x increase in worker pick rates (reducing dead-walking time by up to 70%), a 90% reduction in mispick errors, and the ability to handle peak holiday spikes without tripling temporary seasonal staff.',
        ar: 'بالنسبة للمراكز اللوجستية التي يتجاوز حجم عملها 10,000 طلب يومياً، تحقق الروبوتات الذكية عائداً كاملاً على الاستثمار خلال 12 إلى 18 شهراً. ويعود ذلك إلى مضاعفة إنتاجية العامل بمقدار 2.5 إلى 3 أضعاف (من خلال توفير 70% من وقت المشي الفارغ داخل الممرات)، وخفض أخطاء الالتقاط بنسبة 90%، والقدرة على استيعاب مواسم الذروة دون الحاجة لتوظيف أعداد هائلة من العمالة المؤقتة.',
      },
    },
    {
      question: {
        en: 'Are your supply chain architectures integrated with regional customs and regulatory platforms?',
        ar: 'هل تتكامل معمارياتكم اللوجستية مع بوابات الجمارك والأنظمة التنظيمية في السعودية والإمارات؟',
      },
      answer: {
        en: 'Yes. Our architectures natively connect with Saudi ZATCA e-invoicing Phase 2, Fasah customs portals, Saber product conformity, and UAE Federal Customs platforms. All shipping consignments carry cryptographic electronic bills of lading (e-BOL) and customs clearance metadata, preventing border holds and costly port demurrage penalties.',
        ar: 'نعم بكل تأكيد. تتصل أنظمتنا بسلاسة مع منظومة الفوترة الإلكترونية لهيئة الزكاة والجمارك (ZATCA)، وبوابة فسح، ومنصة سابر لمطابقة المنتجات، وبوابات الجمارك الاتحادية في الإمارات. وتحمل الشحنات بوالص شحن إلكترونية مشفرة (e-BOL) وبيانات الإفراج الجمركي المسبق، مما يمنع احتجاز البضائع ويجنب الشركات غرامات تأخير الحاويات في الموانئ.',
      },
    },
    {
      question: {
        en: 'How do you bridge the gap between complex software and front-line warehouse and fleet workers?',
        ar: 'كيف توفّقون بين البرمجيات المتقدمة وقدرات العمال الميدانيين وسائقي الشاحنات؟',
      },
      answer: {
        en: 'We prioritize intuitive UI and multi-lingual voice/scanner interactions. Our mobile scanner apps and driver interfaces feature simplified Arabic, English, Hindi, and Urdu interfaces with large touch targets, color-coded barcode scan confirmation beeps, and zero-learning-curve visual workflows that can be mastered by new floor staff in under 15 minutes.',
        ar: 'نضع سهولة الاستخدام في صدارة أولوياتنا مع دعم تعدد اللغات والتوجيه الصوتي والضوئي. صُممت تطبيقات الماسحات اليدوية وواجهات السائقين بواجهات مبسطة باللغات العربية والإنجليزية والهندية والأوردية بأزرار لمس كبيرة وإشارات صوتية ومرئية ملونة تؤكد صحة المسح، مما يُمكّن أي عامل جديد من إتقان العمل خلال أقل من 15 دقيقة.',
      },
    },
  ],
};
