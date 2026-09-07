import type { FeaturedClientStoryItem } from '@shared/types';

/**
 * Master catalog of shared featured client stories.
 * Centralized so that every solution feature page (Marketing & Communications,
 * Application & Management, Digital Engineering, etc.) and the main Solutions page
 * can easily access authentic, structured, and consistent mock client story data.
 */
export const sharedFeaturedClientStories: Record<string, FeaturedClientStoryItem> = {
  // 1. Lahfaa Perfumes (GCC Luxury Fragrance)
  'lahfaa-perfumes': {
    id: 'lahfaa-perfumes',
    slug: 'lahfaa-perfumes',
    badge: {
      en: 'Luxury Brand Strategy & Packaging',
      ar: 'استراتيجية العلامات الفاخرة وهندسة التغليف',
    },
    category: {
      en: 'Luxury Brand Strategy & Packaging',
      ar: 'استراتيجية العلامات الفاخرة وهندسة التغليف',
    },
    title: {
      en: 'Lahfaa Perfumes: Luxury Identity & Bottle Architecture',
      ar: 'عطور لهفة: هوية بصرية فاخرة وتصميم معماري لزجاجة العطر',
    },
    subtitle: {
      en: 'Crafting an iconic brand identity, custom fragrance bottle architecture, and premium packaging strategy for a luxury GCC fragrance house.',
      ar: 'ابتكار هوية بصرية أيقونية، وتصميم معماري فريد لزجاجة العطر وتغليف فاخر لدار عطور خليجية راقية.',
    },
    description: {
      en: 'Persici conceptualized, branded, and launched a bespoke luxury fragrance collection that honored Arabian artisanal heritage while commanding international shelf presence. We engineered the bottle geometry, luxury unboxing architecture, and a full-funnel digital acquisition strategy across GCC flagship retail and direct-to-consumer storefronts.',
      ar: 'ابتكرت بيرسيكي هوية متكاملة لعلامة عطور خليجية فاخرة تجمع بين الأصالة الشرقية والمعايير العالمية. وصممنا الهيكل المعماري لزجاجة العطر، وتجربة فتح الصندوق الاستثنائية، واستراتيجية تسويق رقمي متكاملة عبر البوتيكات الخليجية والمتاجر الرقمية.',
    },
    summary: {
      en: 'Persici conceptualized, branded, and launched a bespoke luxury fragrance collection that honored Arabian artisanal heritage while commanding international shelf presence. We engineered the bottle geometry, luxury unboxing architecture, and a full-funnel digital acquisition strategy across GCC flagship retail and direct-to-consumer storefronts.',
      ar: 'ابتكرت بيرسيكي هوية متكاملة لعلامة عطور خليجية فاخرة تجمع بين الأصالة الشرقية والمعايير العالمية. وصممنا الهيكل المعماري لزجاجة العطر، وتجربة فتح الصندوق الاستثنائية، واستراتيجية تسويق رقمي متكاملة عبر البوتيكات الخليجية والمتاجر الرقمية.',
    },
    client: 'Lahfaa Perfumes GCC',
    metrics: [
      {
        value: '+340%',
        label: {
          en: 'Brand Recall Surge',
          ar: 'ارتفاع تذكر العلامة',
        },
      },
      {
        value: '12+',
        label: {
          en: 'GCC Retail Boutiques',
          ar: 'افتتاح بوتيكات خليجية',
        },
      },
      {
        value: '4.9/5',
        label: {
          en: 'Customer Sentiment',
          ar: 'تقييم تجربة العميل',
        },
      },
      {
        value: '+185%',
        label: {
          en: 'Direct Sales Growth',
          ar: 'نمو المبيعات المباشرة',
        },
      },
    ],
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85',
    ctaText: {
      en: 'Explore Case Study',
      ar: 'استكشف قصة النجاح',
    },
    ctaHref: '/client-stories/lahfaa-perfumes',
    tags: ['Luxury Brand Identity', 'Packaging Architecture', 'Sensory Marketing', 'GCC Retail'],
  },

  // 2. Meraas' The Beach (Dubai Waterfront Destination)
  'meraas-the-beach': {
    id: 'meraas-the-beach',
    slug: 'meraas-the-beach',
    badge: {
      en: 'Urban Destination Marketing',
      ar: 'تسويق الوجهات السياحية والحضرية',
    },
    category: {
      en: 'Urban Destination Marketing',
      ar: 'تسويق الوجهات السياحية والحضرية',
    },
    title: {
      en: "Meraas' The Beach: Defining a Contemporary Coastal Lifestyle",
      ar: 'ذا بيتش من مِراس: صياغة أسلوب حياة ساحلي معاصر في دبي',
    },
    subtitle: {
      en: "We crafted a multi-channel visual campaign for Meraas' 'The Beach' to showcase it as a world-class lifestyle destination and drive international and local footfall.",
      ar: 'ابتكرنا حملة بصرية ورقمية متكاملة لوجهة "ذا بيتش" من مِراس لإبرازها كوجهة سياحية وعصرية عالمية وزيادة تدفق الزوار والمقيمين.',
    },
    description: {
      en: "To maintain leadership amidst competing leisure hubs, Persici delivered an evocative campaign combining high-energy lifestyle cinematography, digital street activations, and targeted tourism reach, showcasing The Beach as Dubai's ultimate outdoor dining and entertainment destination.",
      ar: 'لترسيخ ريادة الوجهة بين المنافسين، طورت بيرسيكي حملة تسويقية تجمع بين الإنتاج السينمائي العصري، والتفاعل الميداني، والاستهداف السياحي الدولي لإبراز "ذا بيتش" كأرقى وجهة ترفيه ومطاعم شاطئية في دبي.',
    },
    summary: {
      en: "To maintain leadership amidst competing leisure hubs, Persici delivered an evocative campaign combining high-energy lifestyle cinematography, digital street activations, and targeted tourism reach, showcasing The Beach as Dubai's ultimate outdoor dining and entertainment destination.",
      ar: 'لترسيخ ريادة الوجهة بين المنافسين، طورت بيرسيكي حملة تسويقية تجمع بين الإنتاج السينمائي العصري، والتفاعل الميداني، والاستهداف السياحي الدولي لإبراز "ذا بيتش" كأرقى وجهة ترفيه ومطاعم شاطئية في دبي.',
    },
    client: 'Meraas Holding (Dubai)',
    metrics: [
      {
        value: '4.2M+',
        label: {
          en: 'Campaign Impressions',
          ar: 'مشاهدات وظهور للحملة',
        },
      },
      {
        value: '+65%',
        label: {
          en: 'Footfall Inflow Lift',
          ar: 'زيادة في تدفق الزوار',
        },
      },
      {
        value: '85k+',
        label: {
          en: 'Social Engagements',
          ar: 'تفاعل اجتماعي موثق',
        },
      },
      {
        value: '3.2x',
        label: {
          en: 'Seasonal Campaign ROAS',
          ar: 'عائد الحملات الموسمية',
        },
      },
    ],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    ctaText: {
      en: 'Explore Case Study',
      ar: 'استكشف قصة النجاح',
    },
    ctaHref: '/client-stories/meraas-the-beach',
    tags: ['Destination Marketing', 'Visual Storytelling', 'Experiential Events', 'Dubai Tourism'],
  },

  // 3. Meraas' La Mer (Dubai Beachfront Metropolis)
  'meraas-la-mer': {
    id: 'meraas-la-mer',
    slug: 'meraas-la-mer',
    badge: {
      en: 'Cinematic Media Production',
      ar: 'الإنتاج الإعلامي السينمائي',
    },
    category: {
      en: 'Cinematic Media Production',
      ar: 'الإنتاج الإعلامي السينمائي',
    },
    title: {
      en: "Meraas' La Mer: Capturing the Essence of a Beachfront Metropolis",
      ar: 'لا مير من مِراس: تجسيد روح المدينة العصرية على شاطئ البحر',
    },
    subtitle: {
      en: 'We crafted an elevated visual campaign for Meraas’ La Mer to elevate it into a lifestyle city, capturing its unique blend of urban energy and coastal relaxation.',
      ar: 'أنتجنا حملة بصرية راقية لوجهة لا مير لنقلها إلى مصاف المدن العصرية المتكاملة، مجسدين مزيجها الفريد بين حيوية المدينة والاسترخاء الساحلي.',
    },
    description: {
      en: 'Through dynamic 8K cinematic storytelling, vibrant editorial food and fashion photography, and multi-channel digital distribution, we amplified La Mer as Dubai’s premier beachfront playground, boosting tenant merchant foot-traffic and social resonance.',
      ar: 'من خلال تصوير سينمائي بدقة 8K، وتصوير فوتوغرافي احترافي لتجارب المأكولات والأزياء، ونشر رقمي موجه، عززنا مكانة لا مير كأرقى وجهة شاطئية في دبي، مما ضاعف تدفق الزوار للمتاجر والشهرة الرقمية.',
    },
    summary: {
      en: 'Through dynamic 8K cinematic storytelling, vibrant editorial food and fashion photography, and multi-channel digital distribution, we amplified La Mer as Dubai’s premier beachfront playground, boosting tenant merchant foot-traffic and social resonance.',
      ar: 'من خلال تصوير سينمائي بدقة 8K، وتصوير فوتوغرافي احترافي لتجارب المأكولات والأزياء، ونشر رقمي موجه، عززنا مكانة لا مير كأرقى وجهة شاطئية في دبي، مما ضاعف تدفق الزوار للمتاجر والشهرة الرقمية.',
    },
    client: 'Meraas Holding (Dubai)',
    metrics: [
      {
        value: '5.8M+',
        label: {
          en: 'Video Views Across GCC',
          ar: 'مشاهدة فيديو خليجية',
        },
      },
      {
        value: '+92%',
        label: {
          en: 'Brand Mention Surge',
          ar: 'ارتفاع الإشارات للعلامة',
        },
      },
      {
        value: '140k+',
        label: {
          en: 'Active Community Size',
          ar: 'حجم المجتمع المتفاعل',
        },
      },
      {
        value: '+48%',
        label: {
          en: 'Merchant Tenant Traffic',
          ar: 'زيادة رواد المتاجر والمطاعم',
        },
      },
    ],
    image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1200&q=85',
    ctaText: {
      en: 'Explore Case Study',
      ar: 'استكشف قصة النجاح',
    },
    ctaHref: '/client-stories/meraas-la-mer',
    tags: ['Cinematic Production', 'Destination Branding', 'Social-First Video', 'Omnichannel Launch'],
  },

  // 4. Hala Food (Caregiver Brand Archetype & Super-App)
  'hala-food': {
    id: 'hala-food',
    slug: 'hala-food',
    badge: {
      en: 'Full-Funnel Brand & Growth',
      ar: 'بناء العلامة واستراتيجيات النمو',
    },
    category: {
      en: 'Full-Funnel Brand & Growth',
      ar: 'بناء العلامة واستراتيجيات النمو',
    },
    title: {
      en: 'Hala Food: Caregiver Brand Archetype & Omnichannel Launch',
      ar: 'هلا فود: بناء نموذج العلامة الراعية واستراتيجية إطلاق متكاملة',
    },
    subtitle: {
      en: 'Crafting an empathetic Caregiver brand identity and marketing strategy that positioned home-cooked meal kits as effortlessly simple across Saudi Arabia.',
      ar: 'صياغة هوية إنسانية قائمة على نموذج "العلامة الراعية" واستراتيجية تسويق رسخت وجبات الطهي المنزلي كخيار سهل وصحي في المملكة العربية السعودية.',
    },
    description: {
      en: 'Persici engineered Hala Food’s complete go-to-market strategy, crafting an emotional brand story, packaging experience, performance marketing funnels, and retention programs that scaled the on-demand meal kit app to over 120,000 active subscribers.',
      ar: 'صممت بيرسيكي استراتيجية دخول السوق الشاملة لهلا فود، بما شمل السرد العاطفي، وتصميم العبوات، ومسارات الإعلانات الموجهة، وبرامج الاحتفاظ التي وسعت قاعدة مستخدمي التطبيق لأكثر من 120 ألف مشترك نشط.',
    },
    summary: {
      en: 'Persici engineered Hala Food’s complete go-to-market strategy, crafting an emotional brand story, packaging experience, performance marketing funnels, and retention programs that scaled the on-demand meal kit app to over 120,000 active subscribers.',
      ar: 'صممت بيرسيكي استراتيجية دخول السوق الشاملة لهلا فود، بما شمل السرد العاطفي، وتصميم العبوات، ومسارات الإعلانات الموجهة، وبرامج الاحتفاظ التي وسعت قاعدة مستخدمي التطبيق لأكثر من 120 ألف مشترك نشط.',
    },
    client: 'Hala Food KSA',
    metrics: [
      {
        value: '+280%',
        label: {
          en: 'Conversion Rate Lift',
          ar: 'ارتفاع معدل التحويل',
        },
      },
      {
        value: '120k+',
        label: {
          en: 'Active App Subscribers',
          ar: 'مشترك نشط في التطبيق',
        },
      },
      {
        value: '3.8x',
        label: {
          en: 'Blended Paid ROAS',
          ar: 'العائد الإعلاني الإجمالي',
        },
      },
      {
        value: '4.9',
        label: {
          en: 'App Store Rating',
          ar: 'تقييم متجر التطبيقات',
        },
      },
    ],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85',
    ctaText: {
      en: 'Explore Case Study',
      ar: 'استكشف قصة النجاح',
    },
    ctaHref: '/client-stories/hala-food',
    tags: ['Brand Archetype Strategy', 'D2C Growth', 'Performance Acquisition', 'App Launch'],
  },

  // 5. FinVibe (Next-Gen FinTech Trading Engine)
  'finvibe-trading': {
    id: 'finvibe-trading',
    slug: 'finvibe-trading',
    badge: {
      en: 'FinTech & High-Frequency Systems',
      ar: 'التقنية المالية والأنظمة فائقة السرعة',
    },
    category: {
      en: 'FinTech & High-Frequency Systems',
      ar: 'التقنية المالية والأنظمة فائقة السرعة',
    },
    title: {
      en: 'FinVibe: Architecting a Zero-Downtime Microservices Trading Platform',
      ar: 'منصة فاين فايب: بناء نظام تداول سحابي مصغر بمعايير أمان مصرفية وموثوقية 99.99%',
    },
    subtitle: {
      en: 'High-throughput algorithmic trading engine processing $45M+ in monthly transaction volume with biometric security vaults.',
      ar: 'محرك تداول خوارزمي فائق الأداء يعالج أكثر من 45 مليون دولار شهرياً مع خزائن تشفير بيومترية.',
    },
    description: {
      en: 'For FinVibe, Persici developed a microsecond-latency trading ecosystem with real-time WebSocket order books, zero-trust cryptographic vaults, and dynamic portfolio telemetry complying with GCC central banking regulations.',
      ar: 'طوّرت بيرسيكي لصالح فاين فايب بنية تحتية سحابية للتداول بزمن استجابة يقاس بالميكروثانية، ومزامنة لحظية لأوامر البيع والشراء، وخزائن تشفير بيومترية متوافقة تماماً مع لوائح المصارف المركزية في الخليج.',
    },
    summary: {
      en: 'For FinVibe, Persici developed a microsecond-latency trading ecosystem with real-time WebSocket order books, zero-trust cryptographic vaults, and dynamic portfolio telemetry complying with GCC central banking regulations.',
      ar: 'طوّرت بيرسيكي لصالح فاين فايب بنية تحتية سحابية للتداول بزمن استجابة يقاس بالميكروثانية، ومزامنة لحظية لأوامر البيع والشراء، وخزائن تشفير بيومترية متوافقة تماماً مع لوائح المصارف المركزية في الخليج.',
    },
    client: 'FinVibe Technologies',
    metrics: [
      {
        value: '$45M+',
        label: {
          en: 'Monthly Trading Volume',
          ar: 'حجم التداول الشهري المعالج',
        },
      },
      {
        value: '99.99%',
        label: {
          en: 'System Service Uptime',
          ar: 'جاهزية النظام دون انقطاع',
        },
      },
      {
        value: '<40ms',
        label: {
          en: 'Order Execution Latency',
          ar: 'زمن تنفيذ أوامر التداول',
        },
      },
      {
        value: '0',
        label: {
          en: 'Security Vulnerabilities',
          ar: 'ثغرات أمنية مكتشفة',
        },
      },
    ],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=85',
    ctaText: {
      en: 'Explore Case Study',
      ar: 'استكشف قصة النجاح',
    },
    ctaHref: '/client-stories/finvibe-trading',
    tags: ['FinTech Infrastructure', 'Microservices', 'Zero-Trust Security', 'WebSockets'],
  },

  // 6. Nissan Mobility (Automotive Enterprise IT Modernization)
  'nissan-mobility': {
    id: 'nissan-mobility',
    slug: 'nissan-mobility',
    badge: {
      en: 'Transportation & Mobility',
      ar: 'قطاع السيارات والنقل الذكي',
    },
    category: {
      en: 'Transportation & Mobility',
      ar: 'قطاع السيارات والنقل الذكي',
    },
    title: {
      en: 'Nissan Cuts IT Operational Costs 40% with AI-Powered Monitoring and Automation',
      ar: 'نيسان تخفض تكاليف تشغيل تقنية المعلومات بنسبة 40% عبر الأتمتة والمراقبة الذكية',
    },
    subtitle: {
      en: 'Modernized enterprise observability across regional manufacturing clusters with automated incident remediation.',
      ar: 'تحديث شامل لمنظومة المراقبة والتشغيل عبر المصانع الإقليمية مع حلول الاستجابة التنبؤية للأعطال.',
    },
    description: {
      en: 'Modernized enterprise observability across regional manufacturing clusters with automated incident remediation, zero-downtime microservices, and unified telemetry pipelines that cut operational overhead and accelerated incident response.',
      ar: 'تحديث شامل لمنظومة المراقبة والتشغيل عبر المصانع الإقليمية مع حلول الاستجابة التنبؤية للأعطال والخدمات المصغرة دون أي انقطاع، مما قلص تكاليف التشغيل وسرّع حل المشكلات التقنية.',
    },
    summary: {
      en: 'Modernized enterprise observability across regional manufacturing clusters with automated incident remediation, zero-downtime microservices, and unified telemetry pipelines that cut operational overhead and accelerated incident response.',
      ar: 'تحديث شامل لمنظومة المراقبة والتشغيل عبر المصانع الإقليمية مع حلول الاستجابة التنبؤية للأعطال والخدمات المصغرة دون أي انقطاع، مما قلص تكاليف التشغيل وسرّع حل المشكلات التقنية.',
    },
    client: 'Nissan Regional Group',
    metrics: [
      {
        value: '40%',
        label: {
          en: 'IT OpEx Reduction',
          ar: 'خفض تكاليف التشغيل',
        },
      },
      {
        value: '62%',
        label: {
          en: 'Faster Incident MTTR',
          ar: 'تسريع حل الحوادث',
        },
      },
      {
        value: '99.9%',
        label: {
          en: 'System Core Uptime',
          ar: 'جاهزية الأنظمة التشغيلية',
        },
      },
    ],
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    ctaText: {
      en: 'Explore Case Study',
      ar: 'استكشف قصة النجاح',
    },
    ctaHref: '/client-stories/nissan-mobility',
    tags: ['AI Monitoring', 'Incident Remediation', 'Cloud Operations', 'Observability'],
  },

  // 7. ChopOn (Global Sourcing Engine for Luxury Timepieces)
  'chopon-luxury': {
    id: 'chopon-luxury',
    slug: 'chopon-luxury',
    badge: {
      en: 'Luxury Horology & Global Sourcing',
      ar: 'الساعات الفاخرة وسلاسل التوريد العالمية',
    },
    category: {
      en: 'Luxury Horology & Global Sourcing',
      ar: 'الساعات الفاخرة وسلاسل التوريد العالمية',
    },
    title: {
      en: 'ChopOn: Global Sourcing Engine for Rare Luxury Timepieces',
      ar: 'شوب أون: منصة التوريد والتداول العالمية للساعات الفاخرة النادرة',
    },
    subtitle: {
      en: 'Engineered a high-trust digital marketplace with real-time escrow, serial verification, and concierge checkout.',
      ar: 'بناء منصة تداول رقمية فائقة الموثوقية بنظام ضمان مالي لحظي، وفحص الأرقام التسلسلية والشراء المخصص.',
    },
    description: {
      en: 'Persici conceptualized and developed the end-to-end digital commerce architecture for ChopOn, turning high-value timepiece transactions into a frictionless experience. We engineered bank-grade escrow integration, real-time collector bidding sockets, verified provenance tracking, and an ultra-fast headless storefront catering to ultra-high-net-worth buyers across the GCC and Europe.',
      ar: 'ابتكر فريق بيرسيكي وطوّر المعمارية الرقمية المتكاملة لمنصة ChopOn لتسهيل صفقات الساعات الفاخرة عالية القيمة. دمجنا نظام الضمان المالي البنكي، والمزايدة اللحظية لهواة الجمع، وتتبع أصالة القطع، مع متجر رقمي فائق السرعة يستهدف كبار المشترين في الخليج وأوروبا.',
    },
    summary: {
      en: 'Persici conceptualized and developed the end-to-end digital commerce architecture for ChopOn, turning high-value timepiece transactions into a frictionless experience. We engineered bank-grade escrow integration, real-time collector bidding sockets, verified provenance tracking, and an ultra-fast headless storefront catering to ultra-high-net-worth buyers across the GCC and Europe.',
      ar: 'ابتكر فريق بيرسيكي وطوّر المعمارية الرقمية المتكاملة لمنصة ChopOn لتسهيل صفقات الساعات الفاخرة عالية القيمة. دمجنا نظام الضمان المالي البنكي، والمزايدة اللحظية لهواة الجمع، وتتبع أصالة القطع، مع متجر رقمي فائق السرعة يستهدف كبار المشترين في الخليج وأوروبا.',
    },
    client: 'ChopOn Global Ltd.',
    metrics: [
      {
        value: '$18M+',
        label: {
          en: 'Processed GMV Volume',
          ar: 'إجمالي مبيعات المعاملات',
        },
      },
      {
        value: '<0.8s',
        label: {
          en: 'Catalog Search Latency',
          ar: 'سرعة البحث في الكتالوج',
        },
      },
      {
        value: '99.4%',
        label: {
          en: 'Authenticity Verification',
          ar: 'دقة التحقق من الأصالة',
        },
      },
      {
        value: '+210%',
        label: {
          en: 'Repeat Collector Orders',
          ar: 'نمو طلبات المشترين المتكررة',
        },
      },
    ],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    ctaText: {
      en: 'Explore Case Study',
      ar: 'استكشف قصة النجاح',
    },
    ctaHref: '/client-stories/chopon',
    tags: ['Headless Commerce', 'Escrow Rails', 'Luxury Horology', 'Ultra-Fast Search'],
  },

  // 8. Protes Sports (Technical Restoration & Athletic Gear Engine)
  'protes-sports': {
    id: 'protes-sports',
    slug: 'protes-sports',
    badge: {
      en: 'Technical Sports & Performance Gear',
      ar: 'العتاد الرياضي التخصصي ومعدات الأداء',
    },
    category: {
      en: 'Technical Sports & Performance Gear',
      ar: 'العتاد الرياضي التخصصي ومعدات الأداء',
    },
    title: {
      en: 'Protes Sports: Technical Restoration & E-Commerce Engine',
      ar: 'بروتيس سبورتس: تجديد العتاد التخصصي ومحرك التجارة الإلكترونية',
    },
    subtitle: {
      en: 'Revitalized an established regional athletic brand with full-funnel CRO, custom equipment customizers, and sub-second checkout.',
      ar: 'إعادة إحياء علامة تجارية رياضية إقليمية بهندسة متقدمة لمعدلات التحويل، وأدوات تخصيص المعدات ودفع فائق السرعة.',
    },
    description: {
      en: 'Persici rebuilt the digital sales engine for Protes Sports from the ground up. By deploying an advanced custom gear configuration engine, headless checkout integrations with Apple Pay and Tabby, and multi-channel performance media across Meta and TikTok, we scaled store conversion by 320% while slashing customer acquisition costs.',
      ar: 'أعادت بيرسيكي بناء محرك المبيعات الرقمية لـ Protes Sports بالكامل. من خلال نشر محرك تخصيص المعدات المتطور، والتكامل مع أبل باي وتابي، وحملات أداء مدفوعة عبر ميتا وتيك توك، ضاعفنا معدل التحويل بنسبة 320% مع خفض تكاليف الاستحواذ.',
    },
    summary: {
      en: 'Persici rebuilt the digital sales engine for Protes Sports from the ground up. By deploying an advanced custom gear configuration engine, headless checkout integrations with Apple Pay and Tabby, and multi-channel performance media across Meta and TikTok, we scaled store conversion by 320% while slashing customer acquisition costs.',
      ar: 'أعادت بيرسيكي بناء محرك المبيعات الرقمية لـ Protes Sports بالكامل. من خلال نشر محرك تخصيص المعدات المتطور، والتكامل مع أبل باي وتابي، وحملات أداء مدفوعة عبر ميتا وتيك توك، ضاعفنا معدل التحويل بنسبة 320% مع خفض تكاليف الاستحواذ.',
    },
    client: 'Protes Sports Athletic Co.',
    metrics: [
      {
        value: '+320%',
        label: {
          en: 'Checkout Conversion Lift',
          ar: 'ارتفاع معدل إتمام الشراء',
        },
      },
      {
        value: '4.2x',
        label: {
          en: 'Blended ROAS',
          ar: 'العائد الإعلاني الإجمالي',
        },
      },
      {
        value: '85k+',
        label: {
          en: 'Active Athletes Reached',
          ar: 'رياضي نشط تم الوصول إليهم',
        },
      },
      {
        value: '4.9/5',
        label: {
          en: 'Customer Satisfaction',
          ar: 'تقييم رضا المتسوقين',
        },
      },
    ],
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85',
    ctaText: {
      en: 'Explore Case Study',
      ar: 'استكشف قصة النجاح',
    },
    ctaHref: '/client-stories/protes-sports',
    tags: ['Conversion Rate Optimization', 'Performance Media', 'Sports Tech', 'Instant Checkout'],
  },

  // 9. Land Of Exotics (B2B Sanctuary & Certified Pedigree Portal)
  'land-of-exotics': {
    id: 'land-of-exotics',
    slug: 'land-of-exotics',
    badge: {
      en: 'B2B Wholesale & Pedigree Portal',
      ar: 'تجارة الجملة B2B وبوابة السلالات الموثقة',
    },
    category: {
      en: 'B2B Wholesale & Pedigree Portal',
      ar: 'تجارة الجملة B2B وبوابة السلالات الموثقة',
    },
    title: {
      en: 'Land Of Exotics: B2B Sanctuary & Certified Pedigree Portal',
      ar: 'أرض السلالات النادرة: منصة الجملة B2B والتوثيق الرقمي المعتمد',
    },
    subtitle: {
      en: 'Digitizing high-value international pedigree registries, wholesale contracts, and specialized climate-controlled logistics.',
      ar: 'رقمنة سجلات السلالات النادرة وعقود التوريد بالجملة مع إدارة الخدمات اللوجستية المبردة المتخصصة.',
    },
    description: {
      en: 'Persici engineered an enterprise B2B portal for Land Of Exotics, connecting certified breeders, sanctuaries, and accredited institutions worldwide. The platform delivers secure digital pedigree passports, multi-tiered wholesale price tiers, biometric document verification, and real-time transit telemetry across 14 GCC and international shipping hubs.',
      ar: 'طورت بيرسيكي بوابة مؤسسية لمعاملات B2B لصالح Land Of Exotics، تربط المربين المعتمدين والمؤسسات الدولية. توفر المنصة جوازات رقمية موثقة للسلالات، وتسعيراً متدرجاً للجملة، وتحققاً رقمياً مع تتبع لحظي للشحنات عبر 14 مركزاً لوجستياً إقليمياً ودولياً.',
    },
    summary: {
      en: 'Persici engineered an enterprise B2B portal for Land Of Exotics, connecting certified breeders, sanctuaries, and accredited institutions worldwide. The platform delivers secure digital pedigree passports, multi-tiered wholesale price tiers, biometric document verification, and real-time transit telemetry across 14 GCC and international shipping hubs.',
      ar: 'طورت بيرسيكي بوابة مؤسسية لمعاملات B2B لصالح Land Of Exotics، تربط المربين المعتمدين والمؤسسات الدولية. توفر المنصة جوازات رقمية موثقة للسلالات، وتسعيراً متدرجاً للجملة، وتحققاً رقمياً مع تتبع لحظي للشحنات عبر 14 مركزاً لوجستياً إقليمياً ودولياً.',
    },
    client: 'Land of Exotics International',
    metrics: [
      {
        value: '+410%',
        label: {
          en: 'B2B Order Volume Surge',
          ar: 'نمو حجم طلبات الجملة',
        },
      },
      {
        value: '14',
        label: {
          en: 'Regional Logistics Hubs',
          ar: 'مراكز لوجستية إقليمية',
        },
      },
      {
        value: '100%',
        label: {
          en: 'Digital Pedigree Verifiability',
          ar: 'توثيق رقمي موثوق 100%',
        },
      },
      {
        value: '+195%',
        label: {
          en: 'GCC Institutional Demand',
          ar: 'نمو الطلب المؤسسي الخليجي',
        },
      },
    ],
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=85',
    ctaText: {
      en: 'Explore Case Study',
      ar: 'استكشف قصة النجاح',
    },
    ctaHref: '/client-stories/land-of-exotics',
    tags: ['B2B Portal', 'Pedigree Registry', 'Tiered Pricing', 'Supply Chain Telemetry'],
  },

  // 10. Gulf Capital Group: Autonomous Sovereign AI Copilot & Knowledge Engine
  'gulf-enterprise-copilot': {
    id: 'gulf-enterprise-copilot',
    slug: 'gulf-enterprise-copilot',
    badge: {
      en: 'Sovereign Enterprise AI & RAG',
      ar: 'الذكاء الاصطناعي المؤسسي السيادي واسترجاع المعرفة',
    },
    category: {
      en: 'Enterprise AI & Autonomous Agents',
      ar: 'الذكاء الاصطناعي المؤسسي والوكلاء الأذكياء',
    },
    title: {
      en: 'Gulf Capital: Autonomous Sovereign AI Copilot & Knowledge Engine',
      ar: 'جلف كابيتال: محرك بحث دلالي ووكيل ذكاء اصطناعي سيادي للمؤسسات',
    },
    subtitle: {
      en: 'Engineering a deterministic, air-gapped RAG intelligence platform synthesizing millions of regulatory, financial, and legal filings with zero hallucination.',
      ar: 'تطوير منصة ذكاء اصطناعي سيادية ومعزولة تدمج تقنيات RAG لتحليل ملايين الوثائق المالية والتنظيمية بدقة مطلقة وخالية من الهلوسة.',
    },
    description: {
      en: 'Persici architected an on-premise private LLM deployment for a major regional investment group. By connecting hybrid dense vector retrieval with fine-tuned local models, we automated 82% of statutory compliance audits, accelerated investment due diligence from weeks to minutes, and guaranteed total data sovereignty under Saudi NDMO and UAE compliance frameworks.',
      ar: 'صممت بيرسيكي منظومة ذكاء اصطناعي محلية خاصة لمجموعة استثمارية إقليمية كبرى. ومن خلال ربط البحث المتجهي بالنماذج المحلية المدربة، قمنا بأتمتة 82% من عمليات التدقيق النظامي وتسريع دراسات الجدوى من أسابيع إلى دقائق، مع ضمان السيادة التامة للبيانات وفق لوائح الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا).',
    },
    summary: {
      en: 'Persici architected an on-premise private LLM deployment for a major regional investment group. By connecting hybrid dense vector retrieval with fine-tuned local models, we automated 82% of statutory compliance audits, accelerated investment due diligence from weeks to minutes, and guaranteed total data sovereignty under Saudi NDMO and UAE compliance frameworks.',
      ar: 'صممت بيرسيكي منظومة ذكاء اصطناعي محلية خاصة لمجموعة استثمارية إقليمية كبرى. ومن خلال ربط البحث المتجهي بالنماذج المحلية المدربة، قمنا بأتمتة 82% من عمليات التدقيق النظامي وتسريع دراسات الجدوى من أسابيع إلى دقائق، مع ضمان السيادة التامة للبيانات وفق لوائح الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا).',
    },
    client: 'Gulf Capital Group & Regional Sovereign Entities',
    metrics: [
      {
        value: '82%',
        label: {
          en: 'Audit Workflow Automation',
          ar: 'أتمتة عمليات التدقيق',
        },
      },
      {
        value: '<0.4s',
        label: {
          en: 'Hybrid RAG Query Latency',
          ar: 'زمن استرجاع الإجابات',
        },
      },
      {
        value: '99.4%',
        label: {
          en: 'Factual Citation Accuracy',
          ar: 'دقة الاستشهاد بالمصادر',
        },
      },
      {
        value: '14k+',
        label: {
          en: 'Daily Automated Inferences',
          ar: 'استدلال ذكي مؤتمت يومياً',
        },
      },
    ],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
    ctaText: {
      en: 'Explore Case Study',
      ar: 'استكشف قصة النجاح',
    },
    ctaHref: '/client-stories/gulf-enterprise-copilot',
    tags: ['Private LLM', 'Hybrid RAG', 'Vector Search', 'NDMO Sovereign Compliance'],
  },

  // 10. Lahfaa Luxury Experience (Immersive Digital Customizer & Mobile App UX)
  'lahfaa-luxury-experience': {
    id: 'lahfaa-luxury-experience',
    slug: 'lahfaa-luxury-experience',
    badge: {
      en: 'UI/UX & Product Design',
      ar: 'تصميم التجربة الرقمية والمنتج',
    },
    category: {
      en: 'UX Architecture & Living Design Systems',
      ar: 'معمارية تجربة المستخدم والأنظمة البصرية',
    },
    title: {
      en: 'Lahfaa Luxury: Immersive Digital Customizer & Mobile App UX',
      ar: 'لهفة الفاخرة: معمارية التجربة الرقمية وتخصيص العطور التفاعلي',
    },
    subtitle: {
      en: 'Designing an intuitive 3D fragrance builder and high-converting iOS & Android mobile shopping experience.',
      ar: 'تصميم منصة ثلاثية الأبعاد لتخصيص العطور وتجربة تسوق متطورة عبر تطبيقات الهواتف الذكية.',
    },
    description: {
      en: 'Persici reimagined the end-to-end digital product experience for Lahfaa, combining high-fidelity user research, interactive fragrance customizer workflows, and a design-system-first mobile interface that boosted mobile checkout completion by 340%.',
      ar: 'أعادت بيرسيكي ابتكار التجربة الرقمية الشاملة لعلامة لهفة، من خلال أبحاث متعمقة لسلوك المستخدمين، ومسارات تخصيص عطور تفاعلية، وواجهة جوال مبنية على نظام تصميم متطور رفعت معدل إتمام الشراء بنسبة 340%.',
    },
    summary: {
      en: 'Persici reimagined the end-to-end digital product experience for Lahfaa, combining high-fidelity user research, interactive fragrance customizer workflows, and a design-system-first mobile interface that boosted mobile checkout completion by 340%.',
      ar: 'أعادت بيرسيكي ابتكار التجربة الرقمية الشاملة لعلامة لهفة، من خلال أبحاث متعمقة لسلوك المستخدمين، ومسارات تخصيص عطور تفاعلية، وواجهة جوال مبنية على نظام تصميم متطور رفعت معدل إتمام الشراء بنسبة 340%.',
    },
    client: 'Lahfaa Luxury Group GCC',
    metrics: [
      {
        value: '+340%',
        label: {
          en: 'Mobile Checkout Completion',
          ar: 'ارتفاع إتمام الشراء عبر الجوال',
        },
      },
      {
        value: '<1.2s',
        label: {
          en: 'Perceived Interaction Latency',
          ar: 'زمن الاستجابة التفاعلية الفورية',
        },
      },
      {
        value: '4.9/5',
        label: {
          en: 'App Store UX Satisfaction',
          ar: 'تقييم تجربة المستخدم في المتاجر',
        },
      },
      {
        value: '+78%',
        label: {
          en: 'Repeat Fragrance Re-Orders',
          ar: 'زيادة تكرار طلبات الشراء',
        },
      },
    ],
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=85',
    ctaText: {
      en: 'Explore Case Study',
      ar: 'استكشف قصة النجاح',
    },
    ctaHref: '/client-stories/lahfaa-luxury-experience',
    tags: ['UX Architecture', 'Interactive 3D Customizer', 'Design Tokens', 'Design System'],
  },
};

/**
 * Selector helper: returns an array of FeaturedClientStoryItem matching the requested keys.
 */
export function getFeaturedStories(keys: string[]): FeaturedClientStoryItem[] {
  return keys
    .map((k) => sharedFeaturedClientStories[k])
    .filter((s): s is FeaturedClientStoryItem => Boolean(s));
}

/**
 * Specific curated stories for Marketing & Communications:
 * Features authentic client work from the old website: Lahfaa Perfumes, Meraas The Beach, Meraas La Mer, and Hala Food.
 */
export function getMarketingFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'lahfaa-perfumes',
    'meraas-the-beach',
    'meraas-la-mer',
    'hala-food',
  ]);
}

/**
 * Specific curated stories for Application & Management:
 * Focuses on high-performance native apps, scaling, and microservices architecture.
 */
export function getApplicationManagementFeaturedClientStories(): FeaturedClientStoryItem[] {
  return [
    {
      ...sharedFeaturedClientStories['hala-food'],
      id: 'hala-food-app',
      badge: {
        en: 'Mobile Super-App Engineering',
        ar: 'هندسة سوبر آب الهاتف الذكي',
      },
      title: {
        en: 'Hala Food: Scaling an On-Demand Delivery Super-App to Millions',
        ar: 'تطبيق هلا فود: إطلاق وتوسيع سوبر آب التوصيل السريع إلى ملايين المستخدمين',
      },
      description: {
        en: 'Persici engineered a dual-platform iOS & Android on-demand food delivery powerhouse for Hala Food with sub-second order dispatching, dynamic surge routing, and bilingual localized UX across the GCC.',
        ar: 'طوّر فريق بيرسيكي تطبيقاً فائق التطور لمنصتي iOS و Android لصالح هلا فود، يتضمن توزيع الطلبات في أجزاء من الثانية، وتوجيهاً ذكياً للمسارات مع تجربة مستخدم معربة بالكامل لدول الخليج.',
      },
      metrics: [
        { value: '+280%', label: { en: 'Conversion Rate Uplift', ar: 'ارتفاع معدل إتمام الطلبات' } },
        { value: '120k+', label: { en: 'Active Monthly Users', ar: 'مستخدم نشط شهرياً' } },
        { value: '4.9', label: { en: 'Store App Rating', ar: 'تقييم في متاجر التطبيقات' } },
        { value: '<1.2s', label: { en: 'Order Checkout Latency', ar: 'زمن إنهاء عملية الشراء' } },
      ],
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=85',
    },
    sharedFeaturedClientStories['finvibe-trading'],
  ];
}

/**
 * Specific curated stories for the Main Solutions page:
 */
export function getSolutionsOverviewFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'nissan-mobility',
    'lahfaa-perfumes',
    'hala-food',
  ]);
}
/**
 * Specific curated stories for E-Commerce Growth:
 * Features authentic client work from the old website: ChopOn, Protes Sports, Lahfaa Perfumes, and Land Of Exotics.
 */
export function getEcommerceGrowthFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'chopon-luxury',
    'protes-sports',
    'lahfaa-perfumes',
    'land-of-exotics',
  ]);
}

/**
 * Specific curated stories for AI Integration:
 * Features Gulf Capital Sovereign AI Copilot, FinVibe Algorithmic Equities, and Nissan Mobility Connected Telematics.
 */
export function getAiIntegrationFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'gulf-enterprise-copilot',
    'finvibe-trading',
    'nissan-mobility',
  ]);
}

/**
 * Specific curated stories for UX and Product Design:
 * Features Lahfaa Luxury Experience, Gulf Capital Sovereign Copilot, and Nissan Mobility.
 */
export function getUxProductDesignFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'lahfaa-luxury-experience',
    'gulf-enterprise-copilot',
    'nissan-mobility',
  ]);
}

/**
 * Specific curated stories for Customer Engagement:
 * Features Lahfaa Luxury Experience, Gulf Capital Sovereign Copilot, and Nissan Mobility.
 */
export function getCustomerEngagementFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'lahfaa-luxury-experience',
    'gulf-enterprise-copilot',
    'nissan-mobility',
  ]);
}

/**
 * Specific curated stories for Digital Engineering:
 * Features Gulf Capital Sovereign Copilot, Nissan Mobility, and FinVibe Algorithmic Equities.
 */
export function getDigitalEngineeringFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'gulf-enterprise-copilot',
    'nissan-mobility',
    'finvibe-trading',
  ]);
}

/**
 * Specific curated stories for Supply Chain & Logistics:
 * Features Nissan Connected Fleet Mobility, Hala Food On-Demand Cold-Chain, and Land of Exotics Omnichannel Fulfillment.
 */
export function getSupplyChainFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'nissan-mobility',
    'hala-food',
    'land-of-exotics',
  ]);
}

/**
 * Specific curated stories for CRM Management (Braze & Salesforce):
 * Features Hala Food Lifecycle Retention, Lahfaa Luxury Loyalty, and ChopOn Omnichannel Re-engagement.
 */
export function getCrmManagementFeaturedClientStories(): FeaturedClientStoryItem[] {
  return getFeaturedStories([
    'hala-food',
    'lahfaa-perfumes',
    'chopon-luxury',
  ]);
}





