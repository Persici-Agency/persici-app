import type {
  SolutionOfferingItem,
  SolutionBenefitItem,
  TechInfrastructurePod,
  SolutionFaqItem,
} from '@shared/types';

export const experienceTransformationData = {
  hero: {
    title: {
      en: 'Elevating Expectations Through Human-Centered Design',
      ar: 'الارتقاء بالتطلعات عبر تصميم مستقبلي متمحور حول الإنسان',
    },
    subtitle: {
      en: 'Creating seamless customer experiences that foster loyalty is critical. We empower organizations to redefine what is achievable by reshaping how value is delivered, crafting future-ready digital and physical journeys centered on customer success.',
      ar: 'صناعة تجارب عملاء سلسة تعزز الولاء هي ركيزة النجاح المؤسسي. نمكن المنظمات من إعادة صياغة ما يمكن تحقيقه عبر إعادة تشكيل طرق تقديم القيمة، وبناء رحلات رقمية وواقعية ترتكز على نجاح العميل.',
    },
    tag: {
      en: 'Experience Transformation',
      ar: 'تحول تجربة المستخدم',
    },
    secondaryTag: {
      en: 'Human-Centered Design',
      ar: 'التصميم المتمحور حول الإنسان',
    },
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85',
    ctaText: {
      en: 'Explore Experience Capabilities',
      ar: 'استكشف قدرات التجربة',
    },
    ctaHref: '#capabilities',
  },

  offeringsTitle: {
    en: '5 Core Experience Transformation Domains',
    ar: 'المجالات الخمسة لتحول تجربة المستخدم',
  },
  offeringsSubtitle: {
    en: 'Reshaping how customer value is delivered through scalable design systems, omnichannel touchpoints, and intuitive interactions.',
    ar: 'إعادة تشكيل كيفية تسليم القيمة للعميل عبر أنظمة تصميم موحدة، ونقاط اتصال متعددة القنوات، وتفاعلات بديهية سلسة.',
  },

  offerings: [
    {
      title: {
        en: 'Product Design Service',
        ar: 'خدمات تصميم المنتجات الرقمية',
      },
      description: {
        en: 'Fulfill your brand promise with outstanding digital product interfaces and interactive prototypes that anticipate and exceed customer needs.',
        ar: 'الوفاء بوعد علامتك التجارية عبر واجهات منتجات رقمية استثنائية ونماذج تفاعلية تستبق وتتجاوز تطلعات واحتياجات العملاء.',
      },
      diagramType: 'creative-story-lens',
      tag: { en: 'Product UX', ar: 'تصميم الواجهات' },
    },
    {
      title: {
        en: 'Enterprise Design Systems',
        ar: 'أنظمة التصميم المؤسسية الموحدة',
      },
      description: {
        en: 'Create a consistent, tokenized digital framework that accelerates your entire product landscape and aligns designers with engineers.',
        ar: 'بناء إطار عمل رقمي موحد قائم على رموز التصميم (Design Tokens) لتسريع إطلاق المنتجات وتوحيد لغة المصممين والمطورين.',
      },
      diagramType: 'bezier-curv-engine',
      tag: { en: 'Design Systems', ar: 'أنظمة التصميم' },
    },
    {
      title: {
        en: 'Connected Retail & Omnichannel Journeys',
        ar: 'التجزئة المتصلة والرحلات الموحدة',
      },
      description: {
        en: 'Inspire real behavioral shifts by delivering consistent, connected shopping and engagement journeys seamlessly across physical and online channels.',
        ar: 'إحداث تحول سلوكي حقيقي عبر تقديم رحلات تسوق وتفاعل متصلة ومتناغمة تماماً بين المتاجر الواقعية والمنصات الرقمية.',
      },
      diagramType: 'ce-omnichannel-orbit-matrix',
      tag: { en: 'Omnichannel', ar: 'القنوات الموحدة' },
    },
    {
      title: {
        en: 'Enterprise Platform Experience',
        ar: 'تجربة المنصات المؤسسية وإدارة العملاء',
      },
      description: {
        en: 'Align frontline user experience with backend enterprise workflows across Salesforce, SAP, and custom portals to maximize digital transformation ROI.',
        ar: 'مواءمة تجربة المستخدمين مع مسارات العمل المؤسسية الخلفية في Salesforce وSAP والبوابات الخاصة لتعظيم عائد التحول الرقمي.',
      },
      diagramType: 'ce-personalization-nexus',
      tag: { en: 'Enterprise UX', ar: 'المنصات المؤسسية' },
    },
    {
      title: {
        en: 'Customer Journey Transformation',
        ar: 'إعادة هندسة رحلة العميل الشاملة',
      },
      description: {
        en: 'Discover high-impact growth opportunities where revenue rises while service costs decline—powered by full customer journey orchestration.',
        ar: 'اكتشاف فرص نمو كبرى ترتفع معها الإيرادات وتنخفض تكاليف خدمة العملاء—عبر إعادة هندسة رحلة العميل المتكاملة.',
      },
      diagramType: 'social-resonance-echo',
      tag: { en: 'Journey Mapping', ar: 'خرائط الرحلة' },
    },
  ] as SolutionOfferingItem[],

  whyItMatters: {
    title: {
      en: 'Closing the Experience Gap',
      ar: 'جسر الفجوة بين توقعات العميل والواقع التشغيلي',
    },
    text: {
      en: 'Many organizations assume their customer journeys are seamless, but telemetry and customer churn reveal a different reality. As expectations continuously accelerate, great experiences are no longer a luxury—they are the primary driver of customer lifetime value and enterprise retention.',
      ar: 'تفترض العديد من المنظمات أن رحلات عملائها خالية من العوائق، لكن البيانات ومعدلات مغادرة العملاء تكشف واقعاً مختلفاً. ومع تسارع تطلعات الجمهور، لم تعد التجارب الاستثنائية ترفاً—بل هي المحرك الأول لقيمة العميل مدى الحياة واستدامة النمو.',
    },
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
  },

  benefitsStrip: {
    title: {
      en: 'Measurable Experience Outcomes',
      ar: 'نتائج تجربة قابلة للقياس والتحقق',
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=85',
    benefits: [
      {
        title: {
          en: 'Unified Omnichannel Consistency',
          ar: 'تناغم شامل عبر القنوات',
        },
        description: {
          en: 'Customers encounter frictionless, identical brand tone and intuitive functionality across mobile, web, and brick-and-mortar touchpoints.',
          ar: 'يختبر العملاء هوية موحدة ووظائف بديهية سلسة عبر تطبيقات الجوال والويب والمتاجر الميدانية دون أي تعارض.',
        },
        accentColor: '#D83427',
      },
      {
        title: {
          en: '50% Faster Feature Delivery',
          ar: 'مضاعفة سرعة إطلاق الواجهات',
        },
        description: {
          en: 'Pre-built tokenized design system components allow teams to ship new screens and features in days instead of weeks.',
          ar: 'تتيح مكونات نظام التصميم الجاهزة والموثوقة للفرق إطلاق شاشات ومزايا جديدة في أيام معدودة بدلاً من أسابيع.',
        },
        accentColor: '#EF8C7D',
      },
      {
        title: {
          en: 'Boosted Conversion & Retention',
          ar: 'زيادة معدلات التحويل والولاء',
        },
        description: {
          en: 'Streamlined checkout flows and frictionless micro-interactions directly reduce cart abandonment and elevate lifetime value.',
          ar: 'مسارات دفع مبسطة وتفاعلات دقيقة تقلل من التخلي عن السلة وتضاعف القيمة الدائمة للعملاء.',
        },
        accentColor: '#121212',
      },
    ] as SolutionBenefitItem[],
  },

  techStackPods: [
    {
      badge: { en: 'Design Systems', ar: 'أنظمة التصميم' },
      title: { en: 'Design Systems & Tokens', ar: 'أنظمة ورموز التصميم المؤسسي' },
      description: {
        en: 'Single source of truth for component libraries and design tokens.',
        ar: 'مرجع موحد لمكتبات المكونات ورموز التصميم البرمجية.',
      },
      technologies: [
        { name: 'Figma Design Tokens', category: 'Tokens' },
        { name: 'Storybook', category: 'Components' },
        { name: 'Tailwind CSS v4', category: 'Styling' },
        { name: 'Zeroheight', category: 'Docs' },
        { name: 'Radix UI', category: 'Primitives' },
      ],
    },
    {
      badge: { en: 'Telemetry & CX', ar: 'الرصد وتجربة المستخدم' },
      title: { en: 'Experience Telemetry & Research', ar: 'أبحاث ورصد تجربة المستخدم' },
      description: {
        en: 'Real-time sentiment and behavioral heatmapping tools.',
        ar: 'أدوات قياس المشاعر والخرائط الحرارية لسلوك المتصفحين.',
      },
      technologies: [
        { name: 'FullStory', category: 'Analytics' },
        { name: 'Hotjar', category: 'Heatmaps' },
        { name: 'UserZoom', category: 'Research' },
        { name: 'Optimal Workshop', category: 'Testing' },
        { name: 'Qualtrics CX', category: 'Feedback' },
      ],
    },
    {
      badge: { en: 'Platforms & Portals', ar: 'المنصات والبوابات' },
      title: { en: 'Enterprise CRM & Portals', ar: 'بوابات العملاء والمنظومات المدمجة' },
      description: {
        en: 'Enterprise platforms orchestrating personalized omnichannel experiences.',
        ar: 'منصات مؤسسية لتخصيص الرحلات عبر كافة القنوات المتصلة.',
      },
      technologies: [
        { name: 'Salesforce Experience Cloud', category: 'Portal' },
        { name: 'Braze', category: 'Engagement' },
        { name: 'Shopify Hydrogen', category: 'Commerce' },
        { name: 'Contentful', category: 'CMS' },
        { name: 'Algolia', category: 'Search' },
      ],
    },
  ] as TechInfrastructurePod[],

  quote: {
    text: {
      en: 'Persici rebuilt our customer onboarding and mobile app from scratch. Our CSAT score jumped from 72% to 94%, and mobile checkout conversion increased by 48% within 90 days.',
      ar: 'أعادت بيرسيشي تصميم مسار انضمام العملاء وتطبيق الجوال كلياً. قفز مؤشر رضا العملاء (CSAT) من 72% إلى 94%، وارتفع معدل إتمام الشراء عبر الجوال بنسبة 48% خلال 90 يوماً.',
    },
    author: 'Reem Al-Hassan',
    role: {
      en: 'Customer Experience Director, Gulf Lifestyle Brands',
      ar: 'مديرة تجربة العملاء، مجموعة العلامات الخليجية العصرية',
    },
  },

  faqs: [
    {
      question: {
        en: 'How do you measure the ROI of experience transformation?',
        ar: 'كيف تقيسون العائد الاستثماري لمشاريع تحول تجربة المستخدم؟',
      },
      answer: {
        en: 'We establish baseline customer metrics prior to redesign: conversion rates, task completion time, Net Promoter Score (NPS), Customer Satisfaction (CSAT), and support ticket volumes—tracking financial uplift at every milestone.',
        ar: 'نحدد مقاييس الأداء الأساسية قبل إعادة التصميم: نسب التحويل، وزمن إتمام المهام، ومؤشر ترويج العملاء (NPS)، ورضا العملاء (CSAT)، وحجم تذاكر الدعم—ونتتبع التحسن المالي المباشر في كل مرحلة.',
      },
    },
    {
      question: {
        en: 'What is included in an Enterprise Design System?',
        ar: 'ما الذي يتضمنه نظام التصميم المؤسسي الموحد؟',
      },
      answer: {
        en: 'A comprehensive design system includes design tokens (colors, typography, spacing, shadows), fully tested interactive React/TypeScript component libraries in Storybook, accessibility guidelines (WCAG 2.1 AA), and governance documentation.',
        ar: 'يتضمن نظام التصميم الشامل رموز التصميم (الألوان، الخطوط، المسافات)، ومكتبة مكونات تفاعلية ومختبرة بتقنية React وTypeScript في Storybook، ومعايير الوصول الشامل (WCAG 2.1 AA)، وإرشادات الحوكمة والتحديث.',
      },
    },
    {
      question: {
        en: 'How do you ensure seamless collaboration between design and engineering?',
        ar: 'كيف تضمنون التعاون السلس بين فرق التصميم والهندسة البرمجية؟',
      },
      answer: {
        en: 'Designers and engineers share the exact same component taxonomy and token repositories. We conduct automated design-linting checks and pair design leads directly in agile engineering sprint planning.',
        ar: 'يشترك المصممون والمهندسون في نفس تصنيف المكونات ومستودعات رموز التصميم البرمجية. نجري فحوصات آلية لمطابقة التصميم ونشرك قادة التجربة مباشرة في تخطيط دورات التطوير البرمجية.',
      },
    },
  ] as SolutionFaqItem[],
};
