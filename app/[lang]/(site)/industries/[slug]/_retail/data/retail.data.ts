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

export interface RetailOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface RetailVerticalItem {
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

export interface RetailData {
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
  offerings: RetailOfferingItem[];
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
  verticals: RetailVerticalItem[];
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

export const retailData: RetailData = {
  hero: {
    tag: {
      en: 'Industry Practice',
      ar: 'قطاع الممارسات الصناعية',
    },
    secondaryTag: {
      en: 'Omnichannel Retail',
      ar: 'تجارة التجزئة الشاملة',
    },
    title: {
      en: 'Connected Retail Ecosystems That Redefine Modern Shopping',
      ar: 'منظومات تجزئة متكاملة تعيد صياغة تجربة التسوق الحديثة',
    },
    subtitle: {
      en: 'Bridge physical stores, mobile commerce, and automated supply chains into a unified profit engine. Deliver real-time inventory visibility, frictionless checkout, and predictive loyalty across every shopping touchpoint.',
      ar: 'ربط المتاجر الفعلية، والتجارة الإلكترونية، وسلاسل الإمداد المؤتمتة في محرك ربحي موحد. نوفر رؤية لحظية للمخزون، ودفعاً سلساً، وبرامج ولاء تنبؤية عبر كل نقطة تسوق.',
    },
    ctaText: {
      en: 'Schedule Retail Transformation Session',
      ar: 'احجز جلسة تحول قطاع التجزئة',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1400&q=85',
    highlights: [
      {
        en: 'Store of the Future: RFID Clienteling & In-Store Digital Integration',
        ar: 'متاجر المستقبل: أدوات مساعدة البائعين بتقنية RFID والتكامل الرقمي داخل المتجر',
      },
      {
        en: 'Unified Composable Commerce & Sub-Second Storefront Performance',
        ar: 'معمارية تجارة معيارية مركبة (Composable) وأداء فائق لواجهات المتاجر',
      },
      {
        en: 'Distributed Order Management (DOM) & Ship-from-Store Optimization',
        ar: 'إدارة الطلبات الموزعة (DOM) وتوجيه الشحن الذكي من أقرب متجر',
      },
      {
        en: 'Algorithmic Pricing Elasticity & Omnichannel Loyalty Unification',
        ar: 'مرونة تسعير خوارزمية وتوحيد برامج مكافآت ونقاط الولاء عبر جميع القنوات',
      },
    ],
  },

  futureStrip: [
    {
      title: {
        en: 'Online and in-store disconnect erodes margins',
        ar: 'انفصال القنوات الإلكترونية عن المتاجر الفعلية يضعف الهوامش',
      },
      description: {
        en: 'Retailers running disparate inventory, loyalty, and POS systems struggle to deliver consistent pricing, inventory visibility, and omnichannel fulfillment.',
        ar: 'تواجه شركات التجزئة صعوبة في توحيد الأسعار والرؤية الدقيقة للمخزون والتوصيل متعدد القنوات بسبب تشغيل أنظمة نقاط بيع ومخزون منفصلة.',
      },
      badge: {
        en: 'Realities of Retail 01',
        ar: 'واقع قطاع التجزئة 01',
      },
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Customer expectations outpace legacy commerce',
        ar: 'توقعات العملاء تتجاوز إمكانيات منصات التجارة التقليدية',
      },
      description: {
        en: 'Modern shoppers expect sub-second page loads, intuitive visual discovery, hyper-personalized recommendations, and instant frictionless checkout.',
        ar: 'يتوقع المتسوقون تجربة تصفح فورية في أجزاء من الثانية، واكتشافاً مرئياً ذكياً، وتوصيات فائقة الدقة، ودفعاً إلكترونياً فورياً دون تعقيد.',
      },
      badge: {
        en: 'Realities of Retail 02',
        ar: 'واقع قطاع التجزئة 02',
      },
      image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Fulfillment speed dictates brand preference',
        ar: 'سرعة ودقة التوصيل تحسم خيارات المستهلكين',
      },
      description: {
        en: 'Rising shipping costs and consumer demand for same-day delivery require intelligent distributed order routing and automated dark-store fulfillment.',
        ar: 'يتطلب ارتفاع تكاليف الشحن وطلب التوصيل في نفس اليوم توجيهاً ذكياً وموزعاً للطلبات وأتمتة مراكز التجهيز والمستودعات المصغرة.',
      },
      badge: {
        en: 'Realities of Retail 03',
        ar: 'واقع قطاع التجزئة 03',
      },
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'First-party data is critical in a privacy-first era',
        ar: 'البيانات المباشرة أصبحت حاسمة في عصر خصوصية المستهلك',
      },
      description: {
        en: 'With the deprecation of third-party tracking, retailers must capture consented zero- and first-party data through rewarding loyalty ecosystems.',
        ar: 'مع انحسار أدوات التتبع الخارجية، يجب على تجار التجزئة جمع بيانات العملاء بموافقتهم عبر برامج ولاء مجزية وتجارب رقمية استثنائية موثوقة.',
      },
      badge: {
        en: 'Realities of Retail 04',
        ar: 'واقع قطاع التجزئة 04',
      },
      image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=85',
    },
  ],

  agileFoundation: {
    title: {
      en: 'An Agile Foundation for Modern Retail',
      ar: 'الأساس الهندسي المرن لقطاع التجزئة الحديث',
    },
    subtitle: {
      en: 'Transforming siloed point-of-sale systems, e-commerce storefronts, and warehouse networks into a single, synchronized omnichannel architecture.',
      ar: 'تحويل أنظمة نقاط البيع المنعزلة ومتاجر الويب ومستودعات التوزيع إلى معمارية متزامنة ومتكاملة تقود التجارة الموحدة.',
    },
    diagramBadge: {
      en: 'Unified Retail Architecture',
      ar: 'معمارية التجزئة الموحدة',
    },
    pillars: [
      {
        number: '01',
        title: {
          en: 'Real-Time Unified Inventory Core',
          ar: 'نواة موحدة للمخزون في الوقت الحقيقي',
        },
        description: {
          en: 'Aggregate live stock counts across every shelf, regional hub, and transit container to guarantee zero overselling and eliminate cancelled orders.',
          ar: 'تجميع بيانات المخزون المباشرة عبر كل رف ومستودع وشاحنة نقل لضمان عدم بيع سلع غير متوفرة وإلغاء إلغاء الطلبات نهائياً.',
        },
      },
      {
        number: '02',
        title: {
          en: 'Composable Headless Commerce',
          ar: 'تجارة معيارية بدون رأس قابلة للتوسع',
        },
        description: {
          en: 'Decouple frontend shopping touchpoints from backend inventory and pricing engines to launch localized storefronts and mobile apps in weeks.',
          ar: 'فصل واجهات التسوق الرقمية عن أنظمة المخزون والتسعير الخلفية، لإطلاق المتاجر والتطبيقات المحلية في غضون أسابيع.',
        },
      },
      {
        number: '03',
        title: {
          en: 'Hyper-Personalized Loyalty Hub',
          ar: 'منظومة ولاء فائقة التخصيص والربط',
        },
        description: {
          en: 'Recognize shoppers instantly in-store or online, delivering dynamic promotions, tiered VIP perks, and single-click rewards redemption.',
          ar: 'التعرف على العميل فوراً داخل الفرع أو عبر المتجر الرقمي، وتقديم عروض سياقية مخصصة واستبدال فوري لنقاط المكافآت.',
        },
      },
    ],
  },

  offeringsTitle: {
    en: 'Capabilities Built for Omnichannel Retail',
    ar: 'القدرات الهندسية الأساسية لقطاع التجزئة',
  },
  offeringsSubtitle: {
    en: 'Modular platforms engineered to eliminate friction across digital, physical, and fulfillment operations.',
    ar: 'منصات معيارية مصممة للقضاء على الاحتكاك التشغيلي في المتاجر الرقمية والفعلية ومسارات التوصيل والتنفيذ.',
  },
  offerings: [
    {
      slug: 'store-of-the-future-systems',
      tag: { en: 'In-Store Experience', ar: 'تجربة المتجر الفعلي' },
      title: { en: 'Store of the Future & Smart Retail Systems', ar: 'متاجر المستقبل وأنظمة التجزئة الذكية' },
      description: {
        en: 'Equip sales associates with mobile clienteling tablets, real-time stock locators, and seamless line-busting mobile point-of-sale (mPOS) terminals.',
        ar: 'تزويد بائعي الفروع بأجهزة لوحية ذكية لخدمة العملاء، وتحديد مواقع السلع بالمستودع لحظياً، وإنهاء طوابير الانتظار بنقاط بيع متنقلة.',
      },
      icon: 'TbBuildingStore',
      diagramType: 'storefront-render-matrix',
      highlights: {
        en: [
          'Tablet-Native Associate Clienteling & Customer Profiles',
          'Line-Busting Mobile POS & Tap-to-Pay Integration',
          'Smart Fitting Rooms with Interactive Touch Displays',
          'RFID In-Store Stock Auditing & Loss Prevention',
        ],
        ar: [
          'تطبيقات لوحية للبائعين تعرض ملفات العملاء وتفضيلاتهم',
          'إنهاء طوابير الدفع بنقاط بيع متنقلة تدعم الدفع اللاسلكي',
          'غرف قياس ذكية مزودة بشاشات لمس تفاعلية لطلب المقاسات',
          'جرد المخزون الفوري داخل المتجر بتقنية RFID ومكافحة الفاقد',
        ],
      },
    },
    {
      slug: 'distributed-order-management',
      tag: { en: 'Fulfillment & Logistics', ar: 'إدارة الطلبات والتنفيذ' },
      title: { en: 'Distributed Order Management & Unified Inventory', ar: 'إدارة الطلبات الموزعة وتوحيد المخزون' },
      description: {
        en: 'Intelligently route orders to the closest store or distribution center, enabling cost-effective same-day dispatch and click-and-collect fulfillment.',
        ar: 'توجيه الطلبات بذكاء لأقرب متجر فعلي أو مركز توزيع، مما يتيح التوصيل في نفس اليوم بأقل تكلفة ودعم استلام الطلبات من الفرع.',
      },
      icon: 'TbPackage',
      diagramType: 'sc-omnichannel-fulfillment-hub',
      highlights: {
        en: [
          'Dynamic Cost-Optimized Fulfillment Order Routing',
          'Curbside & In-Store Click-and-Collect Orchestration',
          'Automated Split-Shipment Consolidation Logic',
          'Real-Time Safety Stock Buffers & Ghost Stock Prevention',
        ],
        ar: [
          'توجيه الشحنات الذكي بأقل تكلفة لوجستية وأسرع مسار',
          'إدارة استلام الطلبات من السيارة أو داخل المتجر بسلاسة',
          'خوارزميات ذكية لتجميع الشحنات المجزأة في طرد واحد',
          'حماية المخزون الحرج ومنع عرض المنتجات الوهمية أو غير المتوفرة',
        ],
      },
    },
    {
      slug: 'ai-merchandising-pricing',
      tag: { en: 'AI & Merchandising', ar: 'التسويق التجاري والذكاء الاصطناعي' },
      title: { en: 'AI Merchandising & Dynamic Pricing Engine', ar: 'محرك التسعير الديناميكي وإدارة التشكيلة الذكية' },
      description: {
        en: 'Maximize gross margins and inventory turns with AI models that simulate price elasticity, competitor promotion velocity, and localized demand.',
        ar: 'مضاعفة هوامش الربح وسرعة دوران المخزون بنماذج ذكاء اصطناعي تحلل مرونة الأسعار، وتخفيضات المنافسين، والطلب المحلي.',
      },
      icon: 'TbChartLine',
      diagramType: 'growth-trajectory-engine',
      highlights: {
        en: [
          'Automated Competitor Price Scraping & Match Rules',
          'Elasticity-Based Dynamic Markdown Optimization',
          'Localized Product Assortment Recommendations',
          'Seasonal Clearance Velocity Tuning Algorithms',
        ],
        ar: [
          'رصد ومطابقة أسعار المنافسين في السوق تلقائياً',
          'تحسين تخفيضات الأسعار بناءً على مرونة الطلب وهامش الربح',
          'تخصيص تشكيلة المنتجات في الفروع وفق تفضيلات سكان المنطقة',
          'خوارزميات ذكية لتصفية البضائع الموسمية بأعلى عائد ممكن',
        ],
      },
    },
    {
      slug: 'supply-chain-visibility-returns',
      tag: { en: 'Returns & Circularity', ar: 'سلاسل الإمداد وإدارة المرتجعات' },
      title: { en: 'Supply Chain Visibility & Reverse Logistics', ar: 'شفافية سلاسل الإمداد والخدمات اللوجستية العكسية' },
      description: {
        en: 'Transform product returns from a margin drain into a customer delight touchpoint with self-service return lockers, instant exchanges, and rapid restock.',
        ar: 'تحويل مرتجعات السلع من عبء مالي إلى فرصة لتعزيز رضا العميل عبر خزائن الإرجاع الذكية، والاستبدال الفوري، وإعادة العرض للبيع.',
      },
      icon: 'TbRotate',
      diagramType: 'lattice-loop',
      highlights: {
        en: [
          'Customer Self-Service Drop-Off & QR Return Slips',
          'Instant Store Credit & One-Click Size Exchange Portals',
          'Automated Return Quality Grading & Disposition Routing',
          'Fast-Track Restocking of High-Demand Inventory SKUs',
        ],
        ar: [
          'بوابات إرجاع ذاتية للمتسوقين برمز QR دون طباعة بوالص',
          'إيداع رصيد فوري في المحفظة أو استبدال المقاس بنقرة واحدة',
          'فحص وتصنيف جودة المرتجعات وتوجيهها آلياً للمسار الأنسب',
          'إعادة إدراج السلع سريعة الدوران في المخزون المتاح للبيع فوراً',
        ],
      },
    },
    {
      slug: 'unified-shopper-loyalty',
      tag: { en: 'Loyalty & Retention', ar: 'الولاء والاحتفاظ بالمتسوقين' },
      title: { en: 'Unified Shopper Loyalty & Frictionless Checkout', ar: 'برامج الولاء الموحدة والدفع السريع بدون احتكاك' },
      description: {
        en: 'Single shopper identity bridging POS, mobile apps, and e-commerce with unified loyalty point accrual, personalized coupons, and card-linked offers.',
        ar: 'ملف موحد للمتسوق يربط نقاط البيع في المتاجر بتطبيقات الجوال والموقع، مع تجميع النقاط المشترك، والكوبونات المخصصة، والدفع المباشر.',
      },
      icon: 'TbTrophy',
      diagramType: 'ce-loyalty-tier-prism',
      highlights: {
        en: [
          'Unified Card-Linked & Phone Number Loyalty Accrual',
          'Real-Time Personalized In-App Coupon Stacking',
          'Biometric Tap-to-Pay & Digital Receipt Archival',
          'Tiered VIP Gamification with Secret Product Drops',
        ],
        ar: [
          'تجميع نقاط الولاء برقم الجوال أو بطاقة الدفع مباشرة',
          'تطبيق تلقائي لأفضل الكوبونات المخصصة للمتسوق في السلة',
          'دفع سريع بالبصمة وإرسال الفواتير الإلكترونية على التطبيق',
          'مستويات مكافآت حصرية مع إمكانية الوصول المبكر للمنتجات',
        ],
      },
    },
    {
      slug: 'omnichannel-retail-analytics',
      tag: { en: 'Analytics & Insights', ar: 'التحليلات وبيانات التجزئة' },
      title: { en: 'Omnichannel Retail Analytics & POS Data Mesh', ar: 'تحليلات التجزئة الموحدة وشبكة بيانات نقاط البيع' },
      description: {
        en: 'Harmonize billions of store footfall signals, basket scan logs, and website clickstreams into actionable merchant dashboards and inventory forecasts.',
        ar: 'دمج مليارات بيانات حركة المتسوقين داخل الفروع، وسجلات مسح الباركود، وتصفح المتاجر الرقمية في لوحات تحكم فورية لمديري الفئات.',
      },
      icon: 'TbChartBar',
      diagramType: 'bar-spectrum-analyzer',
      highlights: {
        en: [
          'Sub-Second Basket Analysis & Cross-Sell Opportunity Rules',
          'Footfall Heatmaps vs Checkout Conversion Ratio Tracking',
          'Omnichannel Customer Lifetime Value (CLV) Dashboards',
          'Category Performance Benchmarking Against Regional Trends',
        ],
        ar: [
          'تحليل محتويات سلة الشراء واقتراح المنتجات المكملة فوراً',
          'مقارنة الكثافة الحركية في الفروع مع معدلات الشراء الفعلية',
          'لوحات تتبع القيمة الدائمة للعملاء عبر كافة القنوات الموحدة',
          'مقارنة أداء فئات المنتجات مع مؤشرات السوق الإقليمية',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'Winning the Omnichannel Retail Battleground',
      ar: 'حسم المنافسة في ساحة تجارة التجزئة متعددة القنوات',
    },
    text: {
      en: 'Retail is undergoing a structural transformation. Treating e-commerce and physical brick-and-mortar stores as separate, competing cost centers results in fragmented shopper data, inconsistent pricing, and costly inventory mismatches. Winning retailers are those that integrate online convenience with the tangible immediacy of the physical store. Persici helps enterprise retailers unify their core architecture, unlocking 360-degree customer identity, automated order fulfillment, and compounding store profitability.',
      ar: 'يشهد قطاع التجزئة تحولاً هيكلياً عميقاً. إن التعامل مع المتاجر الإلكترونية والفروع التقليدية ككيانات منفصلة متنافسة يؤدي إلى تشتت بيانات العملاء، وتضارب الأسعار، وخسائر فادحة في المخزون. تجار التجزئة الناجحون هم من يدمجون سهولة الشراء الرقمي مع متعة وسرعة التجربة في المتجر الفعلي. تمكن بيرسيكي كبرى شركات التجزئة من توحيد بنيتها التقنية، وبناء هوية شاملة للمتسوقين، وأتمتة التوريد لمضاعفة ربحية المتاجر.',
    },
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=85',
  },

  benefitsStrip: {
    title: {
      en: 'Validated Growth Advantages for Modern Retailers',
      ar: 'مكتسبات تجارية مثبتة لرواد تجارة التجزئة',
    },
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=85',
    benefits: [
      {
        title: { en: 'Stockout Elimination', ar: 'القضاء على نفاد المخزون' },
        description: {
          en: 'Real-time inventory visibility across stores and hubs reduces missed sales by up to 41%, keeping popular products continually available.',
          ar: 'الرؤية اللحظية للمخزون عبر الفروع والمستودعات تخفض فرص البيع الضائعة بنسبة 41% وتضمن وفرة السلع المطلوبة دائماً.',
        },
      },
      {
        title: { en: 'In-Store Conversion Surge', ar: 'قفزة في معدلات الشراء داخل المتجر' },
        description: {
          en: 'Equipping store associates with clienteling tablets increases basket size by 28% and shortens average checkout wait times to under 30 seconds.',
          ar: 'تزويد بائعي الفروع بأجهزة المساعدة الذكية يرفع متوسط قيمة سلة الشراء بنسبة 28% ويقلص وقت الدفع لأقل من 30 ثانية.',
        },
      },
      {
        title: { en: 'Lower Last-Mile Delivery Cost', ar: 'خفض تكاليف الميل الأخير' },
        description: {
          en: 'Routing online orders for fulfillment from the closest physical store cuts courier fees by up to 35% and enables true same-day delivery.',
          ar: 'توجيه طلبات الشراء عبر الإنترنت للتنفيذ من أقرب فرع يقلص تكاليف الشحن بنسبة 35% ويتيح التوصيل في نفس اليوم.',
        },
      },
      {
        title: { en: 'Compounding Customer Lifetime Value', ar: 'مضاعفة القيمة التراكمية للمتسوق' },
        description: {
          en: 'Omnichannel loyalty members who shop both in-store and online demonstrate a 3.2x higher annual spend compared to single-channel shoppers.',
          ar: 'أعضاء برامج الولاء الذين يتسوقون من الفروع والمتجر الرقمي معاً ينفقون سنوياً 3.2 ضعف إنفاق متسوق القناة الواحدة.',
        },
      },
    ],
  },

  verticalsTitle: {
    en: 'Retail Sectors We Empower',
    ar: 'قطاعات التجزئة التي نقود تحولها',
  },
  verticalsSubtitle: {
    en: 'Tailored platforms addressing the operational speed, inventory density, and customer expectations of distinct retail verticals.',
    ar: 'منصات متخصصة تلائم سرعة العمليات، وكثافة المخزون، وتطلعات المتسوقين في مختلف قطاعات التجزئة.',
  },
  verticals: [
    {
      id: 'department-stores',
      number: '01',
      title: { en: 'Department Stores & Fashion Chains', ar: 'المتاجر متعددة الأقسام وسلاسل الأزياء' },
      tag: { en: 'Omnichannel Apparel', ar: 'الأزياء متعددة القنوات' },
      description: {
        en: 'Blending multi-brand curated boutiques with digital interactive mirrors, associate styling apps, and seamless ship-from-store fulfillment.',
        ar: 'دمج أقسام الماركات المتنوعة مع مرايا القياس التفاعلية، وتطبيقات تنسيق الأزياء للبائعين، والشحن المباشر من الفرع للعميل.',
      },
      capabilities: {
        en: [
          'Interactive Digital Mirrors & Size Request Displays',
          'Associate Personal Stylist & Curated Lookbook Apps',
          'Omnichannel Store-to-Door Same-Day Delivery',
          'Unified Multi-Brand Brand Concession Billing',
        ],
        ar: [
          'مرايا رقمية تفاعلية وشاشات لطلب مقاسات بديلة من الغرفة',
          'تطبيقات المنسق الشخصي للبائعين لاقتراح الإطلالات المكتملة',
          'شحن مباشر من أقرب متجر لعنوان العميل في نفس اليوم',
          'فوترة موحدة لإدارة مبيعات العلامات التجارية المستضافة',
        ],
      },
    },
    {
      id: 'grocery-hypermarkets',
      number: '02',
      title: { en: 'Supermarkets, Hypermarkets & Quick Commerce', ar: 'السوبرماركت والهايبرماركت والتجارة السريعة' },
      tag: { en: 'High-Velocity Grocery', ar: 'السلع التموينية السريعة' },
      description: {
        en: 'Deploying high-velocity barcode scanning, cold-chain replenishment alerts, dark store micro-picking, and sub-30-minute delivery routing.',
        ar: 'نشر تقنيات المسح السريع للباركود، وتنبيهات توريد سلاسل التبريد، وانتقاء الطلبات في المستودعات المظلمة، والتوصيل السريع في دقائق.',
      },
      capabilities: {
        en: [
          'Warehouse Micro-Fulfillment Wave Picking Algorithms',
          'Perishable Freshness Tracking & Dynamic Markdown',
          'Customer Scan-and-Go Mobile Self-Checkout',
          'Express 30-Minute Neighborhood Courier Dispatch',
        ],
        ar: [
          'خوارزميات انتقاء الطلبات المجمعة في المستودعات السريعة',
          'تتبع صلاحية المنتجات الطازجة وخفض أسعارها آلياً قبل الانتهاء',
          'الدفع الذاتي في المتجر عبر مسح الباركود بجوال المتسوق',
          'إدارة وتوجيه دراجات التوصيل السريع للأحياء خلال دقائق',
        ],
      },
    },
    {
      id: 'luxury-specialty',
      number: '03',
      title: { en: 'Luxury Boutiques & Specialty Retailers', ar: 'المتاجر الفاخرة والبوتيكات المتخصصة' },
      tag: { en: 'VIP Clienteling', ar: 'خدمة كبار العملاء' },
      description: {
        en: 'Empowering luxury boutiques with private salon booking, clienteling tablets that surface VIP purchase histories, and white-glove courier dispatch.',
        ar: 'تمكين المتاجر الفاخرة بحجز صالونات التسوق الخاصة، واستعراض تاريخ مشتريات كبار الشخصيات على الأجهزة اللوحية، والتوصيل الراقي.',
      },
      capabilities: {
        en: [
          'Private VIP Appointment Booking & Salon Concierge',
          'Complete Client Omnichannel Purchase & Wishlist History',
          'White-Glove Courier Delivery with Time-Slot Precision',
          'Bespoke Product Monogramming & Customization Engine',
        ],
        ar: [
          'حجز المواعيد الخاصة في صالات كبار الشخصيات مع كونسيرج',
          'عرض سجل مشتريات العميل وقائمة رغباته عبر كافة القنوات',
          'تسليم فاخر عبر سيارات مخصصة مع تحديد موعد التسليم بدقة',
          'محرك تخصيص وحفر الأسماء والأحرف على المنتجات الفاخرة',
        ],
      },
    },
    {
      id: 'b2b-distribution',
      number: '04',
      title: { en: 'B2B Wholesale & Commercial Distribution', ar: 'التجارة والتوزيع بالجملة لقطاع الأعمال (B2B)' },
      tag: { en: 'Wholesale Commerce', ar: 'تجارة الجملة والشركات' },
      description: {
        en: 'Delivering B2C-grade digital ordering portals for wholesale buyers, supporting custom contracted pricing, credit terms, and bulk re-orders.',
        ar: 'تقديم بوابات طلب رقمية متطورة تضاهي تجربة الأفراد لمشتري الجملة، مع دعم الأسعار التعاقدية، وتسهيلات الائتمان، وإعادة الطلب المجمع.',
      },
      capabilities: {
        en: [
          'Customer-Specific Contracted Pricing & Tiered Volume Rates',
          'Automated Credit Line Verification & Purchase Order (PO) Flows',
          'Bulk SKU CSV Upload & Fast Barcode Replenishment',
          'Multi-User Corporate Purchasing Hierarchies & Approval Rules',
        ],
        ar: [
          'أسعار تعاقدية مخصصة لكل شركة وخصومات كمية متدرجة',
          'تحقق فوري من السقف الائتماني واعتماد أوامر الشراء الرسمية',
          'رفع ملفات الطلبات المجمعة (CSV) وإعادة التوريد السريع',
          'إدارة صلاحيات مسؤولي المشتريات ومسارات الموافقات الداخلية',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'Modern Retail Technology Stack',
    ar: 'البنية التقنية لمنظومة التجزئة الحديثة',
  },
  techStackSubtitle: {
    en: 'Modular, composable architecture engineered for continuous uptime, high peak-season concurrency, and unified shopper identity.',
    ar: 'معمارية معيارية مركبة مصممة للعمل المستمر بدون انقطاع، وتحمل ضغط مواسم التسوق الكبرى، وتوحيد هوية المتسوقين.',
  },
  techStackPods: [
    {
      title: { en: 'Composable Commerce Core', ar: 'محركات التجارة الحديثة بدون رأس' },
      badge: { en: 'Commerce Tier', ar: 'طبقة التجارة' },
      description: {
        en: 'API-first commerce engines powering sub-second web storefronts, mobile apps, and in-store interactive kiosks.',
        ar: 'محركات تجارة تعتمد على واجهات البرمجة لتشغيل متاجر الويب، وتطبيقات الجوال، والشاشات التفاعلية داخل الفروع.',
      },
      technologies: [
        { name: 'Shopify Plus', category: 'Enterprise Storefront', badge: 'Scalable' },
        { name: 'commercetools', category: 'Composable MACH Core', badge: 'Cloud' },
        { name: 'Algolia NeuralSearch', category: 'AI Discovery & Navigation', badge: 'Sub-30ms' },
        { name: 'Next.js 15', category: 'Ultra-Fast React SSR', badge: 'Edge Native' },
      ],
    },
    {
      title: { en: 'Distributed Order Management (DOM)', ar: 'إدارة الطلبات الموزعة والمخزون' },
      badge: { en: 'Fulfillment Tier', ar: 'طبقة التوريد والتنفيذ' },
      description: {
        en: 'Intelligent routing engines matching customer orders with nearest inventory locations for optimized delivery speed and cost.',
        ar: 'محركات توجيه ذكية تطابق طلبات الشراء مع أقرب موقع للمخزون لتحقيق أسرع وصول وأقل تكلفة شحن.',
      },
      technologies: [
        { name: 'Fluent Commerce', category: 'Distributed Order Orchestration', badge: 'Global' },
        { name: 'Manhattan Active', category: 'Warehouse & Omni Routing', badge: 'Enterprise' },
        { name: 'SAP S/4HANA', category: 'Core ERP Ledger & Purchasing', badge: 'Realtime' },
        { name: 'Akeneo PIM', category: 'Multilingual Catalog Data', badge: 'Centralized' },
      ],
    },
    {
      title: { en: 'Customer Data & Omnichannel Loyalty', ar: 'بيانات العملاء وبرامج الولاء الموحدة' },
      badge: { en: 'Data & CRM Tier', ar: 'طبقة البيانات والولاء' },
      description: {
        en: 'Unifying physical POS transaction records and digital web clicks to trigger real-time personalized retention campaigns.',
        ar: 'توحيد سجلات مشتريات نقاط البيع الفعلية مع تصفح الموقع لإطلاق حملات تسويقية وتذكيرات مخصصة في الوقت الفعلي.',
      },
      technologies: [
        { name: 'Segment CDP', category: 'Unified Customer Profile', badge: 'Realtime' },
        { name: 'Braze', category: 'Cross-Channel Messaging', badge: 'Push/SMS/WA' },
        { name: 'Talon.One', category: 'Promotion & Coupon Rules Engine', badge: 'Flexible' },
        { name: 'Snowflake', category: 'Retail Data Cloud', badge: 'Analytics' },
      ],
    },
    {
      title: { en: 'Unified POS & Edge Payments', ar: 'نقاط البيع الموحدة وبوابات الدفع' },
      badge: { en: 'POS & Edge Tier', ar: 'طبقة نقاط البيع والدفع' },
      description: {
        en: 'Unified payment terminals and in-store mobile point-of-sale software syncing automatically with central accounts.',
        ar: 'أجهزة دفع موحدة وبرمجيات نقاط بيع متنقلة داخل الفروع تتزامن تلقائياً وبشكل فوري مع الحسابات المركزية.',
      },
      technologies: [
        { name: 'Stripe Terminal', category: 'In-Person & Online Payments', badge: 'Unified' },
        { name: 'Adyen Unified', category: 'Global POS & E-Commerce Core', badge: 'Single Ledger' },
        { name: 'AWS Retail Cloud', category: 'Scalable Cloud Infrastructure', badge: '99.999%' },
        { name: 'Zebra RFID Tech', category: 'In-Store Hardware & Handhelds', badge: 'IoT' },
      ],
    },
  ],

  clientStories: getFeaturedStories(['chopon-luxury', 'lahfaa-perfumes', 'land-of-exotics']),

  delivery: {
    title: {
      en: 'How We Transform Retail Operations',
      ar: 'منهجيتنا في تحول قطاع التجزئة',
    },
    subtitle: {
      en: 'A battle-tested 4-phase transformation process designed for zero retail downtime, seamless ERP integration, and rapid measurable uplift in store sales.',
      ar: 'منهجية تحول مجربة من 4 مراحل تضمن استمرار مبيعات المتاجر دون توقف، والاندماج السلس مع أنظمة ERP، وتحقيق نمو سريع وملموس في الإيرادات.',
    },
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
    pillars: [
      {
        title: {
          en: 'Store & Channel Architectural Audit',
          ar: 'تدقيق معمارية الفروع والقنوات البيعية',
        },
        description: {
          en: 'In-depth diagnostic of point-of-sale systems, warehouse distribution bottlenecks, inventory reconciliation latency, and cart abandonment rates.',
          ar: 'تشخيص عميق لأنظمة نقاط البيع، واختناقات مستودعات التوزيع، وتأخر مطابقة المخزون، ونسب التراجع عن إتمام سلة الشراء.',
        },
      },
      {
        title: {
          en: 'Unified Composable Architecture Design',
          ar: 'تصميم معمارية التجزئة المعيارية الموحدة',
        },
        description: {
          en: 'Blueprint a modular headless commerce, distributed order management, and unified customer profile schema connecting stores and web.',
          ar: 'رسم المخطط المعماري للتجارة بدون رأس، ومحرك إدارة الطلبات الموزعة، ومخطط ملف العميل الموحد لربط الفروع بالمتجر الرقمي.',
        },
      },
      {
        title: {
          en: 'Pilot Store & Flagship Digital Rollout',
          ar: 'تطبيق النموذج في متجر رائد والإطلاق الرقمي',
        },
        description: {
          en: 'Deploy in-store mobile clienteling and the new digital storefront in a pilot flagship region, proving double-digit conversion lift in 90 days.',
          ar: 'تطبيق أدوات مساعدة البائعين والمتجر الرقمي الجديد في فرع تجريبي رئيسي، وإثبات نمو المبيعات بنسبة مضاعفة خلال 90 يوماً.',
        },
      },
      {
        title: {
          en: 'Enterprise-Wide Rollout & AI Optimization',
          ar: 'التعميم الشامل وتحسين الخوارزميات الذكية',
        },
        description: {
          en: 'Scale the omnichannel architecture across all retail locations, activating automated demand forecasting and continuous dynamic pricing.',
          ar: 'توسيع المنظومة لتشمل كافة الفروع وسلاسل التوريد، وتفعيل محركات التنبؤ الآلي بالطلب والتسعير الديناميكي المستمر.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'ret-insight-01',
      title: {
        en: 'The Death of the Siloed Store: How Unified Commerce Unlocks 3.2x Higher Spend',
        ar: 'نهاية المتاجر المنعزلة: كيف تضاعف التجارة الموحدة إنفاق العملاء 3.2 مرة',
      },
      excerpt: {
        en: 'Evaluating field telemetry from leading retailers that connected store POS with digital loyalty, driving massive cross-channel customer lifetime value.',
        ar: 'تقييم بيانات ميدانية لكبرى شركات التجزئة التي ربطت نقاط بيع الفروع ببرامج الولاء الرقمية لمضاعفة القيمة الدائمة للعملاء.',
      },
      badge: {
        en: 'Unified Commerce',
        ar: 'التجارة الموحدة',
      },
      slug: 'the-death-of-the-siloed-store-unified-commerce',
      href: '/insights/the-death-of-the-siloed-store-unified-commerce',
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80',
      date: '2026-02-14',
    },
    {
      id: 'ret-insight-02',
      title: {
        en: 'Distributed Order Management: Turning Physical Stores into Fulfillment Engines',
        ar: 'إدارة الطلبات الموزعة: تحويل الفروع الفعلية إلى مراكز شحن سريعة',
      },
      excerpt: {
        en: 'How ship-from-store routing cuts delivery times down to hours while slashing expensive courier logistics costs by up to 35%.',
        ar: 'كيف يؤدي الشحن المباشر من أقرب فرع إلى اختصار زمن التوصيل لساعات قليلة وخفض تكاليف شركات الشحن بنسبة تصل إلى 35%.',
      },
      badge: {
        en: 'Omnichannel Logistics',
        ar: 'اللوجستيات متعددة القنوات',
      },
      slug: 'distributed-order-management-ship-from-store',
      href: '/insights/distributed-order-management-ship-from-store',
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
      date: '2026-01-24',
    },
    {
      id: 'ret-insight-03',
      title: {
        en: 'Reverse Logistics Optimization: Turning Product Returns into Loyal Exchanges',
        ar: 'تحسين اللوجستيات العكسية: تحويل مرتجعات السلع إلى استبدال يعزز الولاء',
      },
      excerpt: {
        en: 'A strategic implementation guide to streamlining consumer product returns with self-service QR portals, instant store credit, and rapid inventory restocking.',
        ar: 'دليل عملي لتطوير منظومة المرتجعات ببوابات الخدمة الذاتية برمز QR، والإيداع الفوري للرصيد، وإعادة إدراج البضائع في المخزون سريعاً.',
      },
      badge: {
        en: 'Supply Chain Strategy',
        ar: 'استراتيجية سلاسل الإمداد',
      },
      slug: 'reverse-logistics-optimization-returns-guide',
      href: '/insights/reverse-logistics-optimization-returns-guide',
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
      date: '2026-01-08',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici unified our 45 physical retail locations with our high-growth e-commerce application. By introducing ship-from-store order routing and mobile POS for our associates, our store conversion jumped 31% and stockout cancellations completely disappeared.',
      ar: 'قامت بيرسيكي بتوحيد 45 فرعاً فعلياً لدينا مع تطبيق المتجر الرقمي المتسارع. بفضل توجيه الشحن من أقرب فرع وأجهزة الدفع المتنقلة للبائعين، قفزت مبيعات الفروع بنسبة 31% واختفت مشكلة إلغاء الطلبات لنفاد المخزون تماماً.',
    },
    author: 'Khaled Bin Rashid',
    role: {
      en: 'Executive Vice President of Retail, Premier Department Stores Group',
      ar: 'نائب الرئيس التنفيذي لقطاع التجزئة، مجموعة المتاجر الكبرى الرائدة',
    },
    badge: {
      en: 'Verified Enterprise Client',
      ar: 'عميل مؤسسي موثق',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions: Retail Solutions',
    ar: 'الأسئلة الشائعة: حلول قطاع تجارة التجزئة',
  },
  faqsSubtitle: {
    en: 'Clear insights regarding POS integration, omnichannel inventory synchronization, ship-from-store logistics, and loyalty unification.',
    ar: 'إجابات واضحة حول ربط نقاط البيع، وتزامن المخزون متعدد القنوات، والشحن من الفروع، وتوحيد برامج ولاء المتسوقين.',
  },
  faqs: [
    {
      question: {
        en: 'How do you prevent store associates and online shoppers from selling the same item simultaneously?',
        ar: 'كيف تمنعون بيع نفس القطعة الأخيرة في المتجر الفعلي وعبر الإنترنت في نفس اللحظة؟',
      },
      answer: {
        en: 'We implement sub-second distributed locking and safety stock buffers within the Distributed Order Management (DOM) layer. When an item is scanned at the in-store POS register or added to an active digital checkout session, its availability is reserved in real time across all channels.',
        ar: 'نطبق تقنية الحجز الموزع اللحظي (Distributed Locking) وهوامش الأمان الذكية في نظام إدارة الطلبات (DOM). بمجرد مسح القطعة في كاشير المتجر أو بدء جلسة الدفع المؤكدة في المتجر الإلكتروني، يتم حجزها وتحديث رصيدها في أجزاء من الثانية عبر جميع القنوات.',
      },
    },
    {
      question: {
        en: 'Can the ship-from-store solution work if our store employees have no specialized logistics experience?',
        ar: 'هل يمكن تطبيق نظام الشحن من الفرع حتى لو لم يكن لدى موظفي المتجر خبرة لوجستية سابقة؟',
      },
      answer: {
        en: 'Yes. We provide an ultra-simple, tablet-native fulfillment app. Associates receive intuitive pick-lists sorted by store aisle, scan barcodes to verify correct items, and generate pre-formatted courier shipping labels with one tap.',
        ar: 'نعم بالتأكيد. نوفر تطبيقاً لوحياً ميسراً للغاية لموظفي الفروع. يتلقى الموظف قائمة انتقاء ذكية مرتبة حسب ممرات الرفوف، ويمسح الباركود للتأكد من مطابقة السلعة، ويطبع بوليصة الشحن بضغطة زر واحدة دون أي تعقيد.',
      },
    },
    {
      question: {
        en: 'How do you unify loyalty points between physical store registers and our mobile app?',
        ar: 'كيف يتم توحيد واحتساب نقاط الولاء بين كاشير الفروع وتطبيق الجوال للمتسوقين؟',
      },
      answer: {
        en: 'We centralize customer loyalty on an API-driven Customer Data Platform (CDP). Customers identify themselves at the register via their phone number, mobile app QR code, or card-linked loyalty, instantly synchronizing points and allowing immediate redemption.',
        ar: 'نوحد برنامج الولاء عبر منصة بيانات عملاء مركزية (CDP). يمكن للمتسوق التعريف بنفسه عند الكاشير برقم جواله، أو بمسح رمز QR من التطبيق، أو عبر بطاقة الدفع المربوطة، لتتزامن النقاط لحظياً مع إمكانية استخدامها للخصم فوراً.',
      },
    },
    {
      question: {
        en: 'What is the implementation timeline for a composable headless retail storefront?',
        ar: 'ما هو الإطار الزمني لتنفيذ متجر تجزئة بدون رأس (Headless Composable)؟',
      },
      answer: {
        en: 'A flagship omnichannel headless rollout typically spans 10 to 14 weeks. This encompasses catalog migration, design system implementation, checkout integration, ERP/POS bidirectional connectors, and staging load-tests.',
        ar: 'يستغرق إطلاق المتجر بدون رأس متعدد القنوات عادة ما بين 10 إلى 14 أسبوعاً. يشمل ذلك ترحيل كتالوج المنتجات، وتطبيق نظام التصميم، وتكامل بوابات الدفع، والربط ثنائي الاتجاه مع أنظمة ERP ونقاط البيع، واختبارات التحمل القصوى.',
      },
    },
    {
      question: {
        en: 'Can we integrate with regional GCC payment methods like Mada, Tabby, Tamara, and Apple Pay?',
        ar: 'هل يدعم النظام بوابات الدفع والتقسيط الخليجية مثل مدى، وتابي، وتمارا، وApple Pay؟',
      },
      answer: {
        en: 'Yes. Our checkout architectures natively support all premier regional and global payment methods, including Mada, Apple Pay, Google Pay, Tabby, Tamara (Buy-Now-Pay-Later), and credit cards, with automated reconciliation across store POS and e-commerce.',
        ar: 'نعم بكل تأكيد. تدعم واجهات الدفع لدينا كافة الوسائل المحلية والعالمية المعتمدة، مثل مدى، وApple Pay، وGoogle Pay، وحلول الشراء الآن والدفع لاحقاً (تابي وتمارا)، مع تسوية محاسبية آلية تجمع بين مبيعات الفروع والمتجر الإلكتروني.',
      },
    },
    {
      question: {
        en: 'How does dynamic AI pricing operate without confusing shoppers who visit stores and the website?',
        ar: 'كيف يعمل التسعير الديناميكي بالذكاء الاصطناعي دون إرباك المتسوقين بين أسعار المتجر والموقع؟',
      },
      answer: {
        en: 'Our engine allows centralized omnichannel price parity rules or transparent channel-specific promotional tags. When dynamic clearance markdowns are deployed, synchronized digital shelf labels (ESL) update in physical stores at the exact moment prices shift online.',
        ar: 'يتيح محركنا ضبط قواعد تطابق الأسعار بين القنوات أو تقديم عروض ترويجية رقمية واضحة ومحددة. وعند تطبيق التخفيضات الديناميكية لتصفية المخزون، تتزامن شاشات الأسعار الإلكترونية على رفوف المتاجر (ESL) في نفس لحظة تحديث السعر على الموقع.',
      },
    },
  ],
};
