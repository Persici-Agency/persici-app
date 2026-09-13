import type {
  SolutionOfferingItem,
  SolutionBenefitItem,
  TechInfrastructurePod,
  SolutionFaqItem,
} from '@shared/types';

export const digitalTransformationFrameworkData = {
  hero: {
    title: {
      en: 'Accelerate Your Business Transformation at Pace',
      ar: 'تسريع التحول الرقمي المؤسسي بوتيرة استثنائية',
    },
    subtitle: {
      en: 'Every organization’s path to transformation is unique. At Persici, each transformation we lead is powered by five core capabilities. When combined with the power of AI, they empower our partners to uncover and realize value at scale.',
      ar: 'مسار التحول الرقمي فريد لكل مؤسسة. في بيرسيكي، يقود كل مشروع تحول خمس قدرات جوهرية موحدة بقوة الذكاء الاصطناعي لتمكين شركائنا من اكتشاف وتحقيق القيمة على نطاق واسع.',
    },
    tag: {
      en: 'Transformation Engine',
      ar: 'محرك التحول المؤسسي',
    },
    secondaryTag: {
      en: 'SPEED Framework',
      ar: 'إطار SPEED الموحد',
    },
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=85',
    ctaText: {
      en: 'Explore Framework',
      ar: 'استكشف إطار العمل',
    },
    ctaHref: '#capabilities',
  },

  offeringsTitle: {
    en: 'The 5 Integrated SPEED Capabilities',
    ar: 'القدرات الخمس المتكاملة لإطار SPEED',
  },
  offeringsSubtitle: {
    en: 'True transformation demands that strategy, product, experience, engineering, and data work seamlessly together.',
    ar: 'يتطلب التحول الرقمي الحقيقي عمل الاستراتيجية والمنتج والتجربة والهندسة والبيانات بتكامل تام وتناغم مستمر.',
  },

  offerings: [
    {
      title: {
        en: 'Strategy & Value Architecture',
        ar: 'الاستراتيجية وهندسة القيمة',
      },
      description: {
        en: 'Define and validate sources of value with clear, scalable plans for sustainable market growth and operational excellence.',
        ar: 'تحديد مصادر القيمة والتحقق منها بخطط نمو واضحة وقابلة للتوسع في السوق لتحقيق التميز التشغيلي.',
      },
      diagramType: 'triad-mesh',
      tag: { en: 'S — Strategy', ar: 'S — الاستراتيجية' },
    },
    {
      title: {
        en: 'Product & Agile Operating Models',
        ar: 'المنتجات الحية ونماذج العمل الرشيقة',
      },
      description: {
        en: 'Build evolving, living products that continuously deliver value through Agile, outcome-focused product squads.',
        ar: 'بناء منتجات حية ومتطورة تقدم قيمة مستمرة عبر فرق عمل رشيقة وموجهة بالنتائج والأثر التجاري.',
      },
      diagramType: 'lattice-loop',
      tag: { en: 'P — Product', ar: 'P — المنتج' },
    },
    {
      title: {
        en: 'Human-Centered Experience',
        ar: 'التجربة المتمحورة حول الإنسان',
      },
      description: {
        en: 'Craft human-centric journeys connecting digital and physical touchpoints, powered by emerging interactive tech and AI.',
        ar: 'تصميم رحلات سلسة متمحورة حول الإنسان تربط نقاط التماس الرقمية والميدانية بأحدث التقنيات التفاعلية والذكاء الاصطناعي.',
      },
      diagramType: 'omnichannel-radial-mesh',
      tag: { en: 'E — Experience', ar: 'E — التجربة' },
    },
    {
      title: {
        en: 'Next-Gen Engineering & Cloud',
        ar: 'الهندسة الحديثة والسحابة',
      },
      description: {
        en: 'Transform technology from a cost center into a true enabler of speed, high availability, and architectural agility.',
        ar: 'تحويل التكنولوجيا من عبء تكلفة إلى محرك حقيقي للسرعة والجاهزية العالية والمرونة المعمارية.',
      },
      diagramType: 'quantum-core-cube',
      tag: { en: 'E — Engineering', ar: 'E — الهندسة' },
    },
    {
      title: {
        en: 'Data Intelligence & Generative AI',
        ar: 'ذكاء البيانات والذكاء الاصطناعي التوليدي',
      },
      description: {
        en: 'Leverage data responsibly to fuel predictive insights, autonomous workflows, and personalized customer interactions.',
        ar: 'توظيف البيانات بمسؤولية لدعم الرؤى التنبؤية ومسارات العمل المستقلة والتخصيص الفوري لتجارب العملاء.',
      },
      diagramType: 'neural-synapse-web',
      tag: { en: 'D — Data & AI', ar: 'D — البيانات والذكاء الاصطناعي' },
    },
  ] as SolutionOfferingItem[],

  whyItMatters: {
    title: {
      en: 'How the Framework Drives Continuous Value',
      ar: 'كيف يُحقق إطار العمل قيمة مستدامة ومتطورة',
    },
    text: {
      en: 'Innovation doesn’t end when a product launches — it only begins there. Every service, every touchpoint should keep evolving, adapting, and improving. As technologies like generative AI reshape what is possible, organizations that stay digital at the core gain the freedom to reinvent continuously.',
      ar: 'لا ينتهي الابتكار بإطلاق المنتج — بل يبدأ من هناك. كل خدمة وكل نقطة اتصال يجب أن تستمر في التطور والتكيف والتحسين. ومع إعادة تشكيل التقنيات الحديثة كذكاء التوليد الاصطناعي لما هو ممكن، تكتسب المؤسسات الرقمية في جوهرها حرية إعادة الابتكار باستمرار.',
    },
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85',
  },

  benefitsStrip: {
    title: {
      en: '5 Core Transformative Value Drivers',
      ar: 'خمسة محركات استراتيجية لإطلاق القيمة',
    },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=85',
    benefits: [
      {
        title: {
          en: 'Faster Time to Market',
          ar: 'تسريع الوصول إلى السوق',
        },
        description: {
          en: 'Our integrated capabilities help organizations accelerate their digital transformation journey and launch innovative products faster with precision.',
          ar: 'تساعد قدراتنا المتكاملة المؤسسات على تسريع رحلة تحولها وإطلاق المنتجات المبتكرة في الأسواق بسرعة ودقة استثنائية.',
        },
        accentColor: '#D83427',
      },
      {
        title: {
          en: 'Superior Customer Experience',
          ar: 'تجربة عملاء استثنائية',
        },
        description: {
          en: 'Designing personalized, engaging journeys that inspire loyalty, reduce churn, and drive sustainable enterprise revenue.',
          ar: 'تصميم رحلات مخصصة وجذابة تعزز الولاء وتحد من مغادرة العملاء وتدعم نمو الإيرادات المؤسسية.',
        },
        accentColor: '#EF8C7D',
      },
      {
        title: {
          en: 'Culture of Continuous Agility',
          ar: 'ثقافة المرونة والابتكار المستمر',
        },
        description: {
          en: 'Iterative frameworks that empower cross-functional teams to identify and seize new opportunities as market conditions shift.',
          ar: 'أطر عمل تكرارية تمكن فرق العمل متعددة التخصصات من رصد واغتنام الفرص الجديدة فور ظهورها في السوق.',
        },
        accentColor: '#121212',
      },
    ] as SolutionBenefitItem[],
  },

  techStackPods: [
    {
      title: { en: 'Transformation Toolchains', ar: 'أدوات إدارة التحول المؤسسي' },
      badge: { en: 'Agile Toolchains', ar: 'أدوات المرونة' },
      description: {
        en: 'Agile portfolio orchestration and telemetry systems.',
        ar: 'منظومات إدارة المحافظ الرشيقة وتتبع مؤشرات الأداء.',
      },
      technologies: [
        { name: 'Jira Align', category: 'Portfolio' },
        { name: 'Confluence', category: 'Knowledge' },
        { name: 'Miro', category: 'Co-Creation' },
        { name: 'Azure DevOps', category: 'CI/CD' },
        { name: 'Linear', category: 'Tracking' },
      ],
    },
    {
      title: { en: 'Cloud & API Architecture', ar: 'البنية السحابية وواجهات البرمجة' },
      badge: { en: 'Cloud Native', ar: 'السحابة الأصلية' },
      description: {
        en: 'Containerized infrastructure and serverless microservices.',
        ar: 'بنى الحاويات والخدمات المصغرة السحابية المستقلة.',
      },
      technologies: [
        { name: 'Kubernetes', category: 'Orchestration' },
        { name: 'Docker', category: 'Containers' },
        { name: 'GraphQL', category: 'API Layer' },
        { name: 'Terraform', category: 'IaC' },
        { name: 'Next.js 16', category: 'Edge Frontend' },
      ],
    },
    {
      title: { en: 'AI & Data Foundations', ar: 'أسس الذكاء الاصطناعي والبيانات' },
      badge: { en: 'Data & GenAI', ar: 'البيانات والذكاء الاصطناعي' },
      description: {
        en: 'Enterprise data lakes and autonomous agentic pipelines.',
        ar: 'مستودعات البيانات المؤسسية ومسارات الوكلاء الأذكياء.',
      },
      technologies: [
        { name: 'Snowflake', category: 'Data Warehouse' },
        { name: 'BigQuery', category: 'Analytics' },
        { name: 'OpenAI', category: 'LLMs' },
        { name: 'LangChain', category: 'Agents' },
        { name: 'Pinecone', category: 'Vector DB' },
      ],
    },
  ] as TechInfrastructurePod[],

  quote: {
    text: {
      en: 'The SPEED framework broke down the silos between our business units and IT team. We modernized our core systems in months rather than years, with zero disruption to our daily operations.',
      ar: 'نجح إطار SPEED في كسر الحواجز التقليدية بين إدارات الأعمال وفريق تقنية المعلومات لدينا. حدثنا أنظمتنا الجوهرية في أشهر معدودة دون أي انقطاع في سير العمل اليومي.',
    },
    author: 'Nasser Al-Subaie',
    role: {
      en: 'VP of Digital Transformation, Al-Futtaim Enterprise Logistics',
      ar: 'نائب رئيس التحول الرقمي، الفطيم للخدمات اللوجستية',
    },
  },

  faqs: [
    {
      question: {
        en: 'What makes the SPEED framework different from traditional frameworks?',
        ar: 'ما الذي يجعل إطار SPEED مختلفاً عن أطر العمل التقليدية؟',
      },
      answer: {
        en: 'SPEED unifies Strategy, Product, Experience, Engineering, and Data into a single iterative loop. Instead of handing off static deliverables across departments, multidisciplinary squads execute in synchronized cadence.',
        ar: 'يوحد إطار SPEED الاستراتيجية والمنتج والتجربة والهندسة والبيانات في دورة عمل تكرارية واحدة. بدلاً من التسليم المنفصل بين الأقسام، تعمل الفرق المتكاملة بإيقاع زمني متزامن.',
      },
    },
    {
      question: {
        en: 'How do you incorporate AI into the Digital Transformation Framework?',
        ar: 'كيف تدمجون الذكاء الاصطناعي داخل إطار التحول الرقمي؟',
      },
      answer: {
        en: 'AI is embedded into every layer of SPEED: from automated market analytics in Strategy, to AI-driven feature validation in Product, generative personalization in Experience, and copilot tooling in Engineering.',
        ar: 'الذكاء الاصطناعي مدمج في كل طبقة من طبقات SPEED: من التحليلات السوقية المؤتمتة في الاستراتيجية، واختبار المزايا الذكي في المنتج، والتخصيص التوليدي في التجربة، إلى أدوات البرمجة المساعدة في الهندسة.',
      },
    },
    {
      question: {
        en: 'Can the SPEED framework be adopted incrementally?',
        ar: 'هل يمكن تطبيق إطار SPEED بشكل تدريجي في المؤسسة؟',
      },
      answer: {
        en: 'Yes. Most enterprise partners start with a single pilot value stream, establishing proof-of-value in 60 to 90 days before scaling the framework across the entire organization.',
        ar: 'نعم بالتأكيد. يبدأ معظم شركائنا بمشروع ريادي واحد لإثبات القيمة خلال 60 إلى 90 يوماً قبل تعميم الإطار تدريجياً عبر كافة قطاعات المؤسسة.',
      },
    },
  ] as SolutionFaqItem[],
};
