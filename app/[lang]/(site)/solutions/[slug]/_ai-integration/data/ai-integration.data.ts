import type {
  SolutionDiagramType,
  FeaturedClientStoryItem,
  SolutionBenefitItem,
  SolutionExecutionPillar,
  SolutionFaqItem,
} from '@shared/types';
import type { ContentCardItem } from '@shared/components/content-card';
import { getAiIntegrationFeaturedClientStories } from '@shared/data';

export interface AiOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface AiVerticalItem {
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

export interface AiIntegrationData {
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
  offerings: AiOfferingItem[];
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
  verticals: AiVerticalItem[];
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

export const aiIntegrationData: AiIntegrationData = {
  hero: {
    tag: {
      en: 'Solutions & Autonomous Systems',
      ar: 'الحلول والأنظمة الذكية المستقلة',
    },
    secondaryTag: {
      en: 'AI Integration & Automation',
      ar: 'دمج الذكاء الاصطناعي والأتمتة',
    },
    title: {
      en: 'Enterprise AI Integration & Autonomous Intelligence',
      ar: 'دمج الذكاء الاصطناعي والأتمتة الذكية للأنظمة المؤسسية',
    },
    subtitle: {
      en: 'Move beyond experimental prototypes. We design, integrate, and scale production-grade generative AI, autonomous agentic workflows, and sovereign RAG retrieval engines directly into your core enterprise software infrastructure.',
      ar: 'تجاوز التجارب المبدئية والنماذج النظرية. نصمم، وندمج، ونوسع حلول الذكاء الاصطناعي التوليدي، ومسارات الوكلاء الأذكياء المستقلة، ومحركات استرجاع المعرفة السيادية (RAG) مباشرة في البنية البرمجية لمؤسستك.',
    },
    ctaText: {
      en: 'Schedule AI Architecture Audit',
      ar: 'احجز تدقيق معمارية الذكاء الاصطناعي',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=85',
    highlights: [
      {
        en: 'Enterprise Private LLM Fine-Tuning & Air-Gapped GCC Deployment',
        ar: 'تدريب مخصص للنماذج اللغوية ونشر محلي معزول متوافق مع لوائح الخليج',
      },
      {
        en: 'Sub-Second Agentic RAG Architecture with Zero Hallucination Guardrails',
        ar: 'معمارية RAG فائقة السرعة مع حواجز حماية تمنع الهلوسة تماماً',
      },
      {
        en: 'Autonomous Multi-Agent Task Orchestration & Business Logic Automation',
        ar: 'تنسيق متعدد الوكلاء المستقلين لأتمتة المهام المعقدة ومنطق الأعمال',
      },
      {
        en: 'Full Compliance with Saudi NDMO & UAE National AI Governance Frameworks',
        ar: 'امتثال كامل لضوابط الهيئة السعودية للبيانات (سدايا) ومبادئ حوكمة الذكاء بالإمارات',
      },
    ],
  },

  offeringsTitle: {
    en: 'Core AI Capabilities',
    ar: 'القدرات الأساسية في الذكاء الاصطناعي',
  },
  offeringsSubtitle: {
    en: 'Six specialized disciplines engineered to turn unstructured enterprise data into deterministic, automated, and compounding business value.',
    ar: 'ستة تخصصات هندسية متقدمة مصممة لتحويل بيانات المؤسسة غير المنظمة إلى قيمة تشغيلية مؤتمتة ومضاعفة وقابلة للتوسع.',
  },
  offerings: [
    {
      slug: 'conversational-ai-assistants',
      tag: {
        en: 'Conversational Intelligence',
        ar: 'الذكاء الحواري المتقدم',
      },
      title: {
        en: 'AI-Powered Assistants & Conversational Agents',
        ar: 'وكلاء ومساعدون أذكياء فائقو التفاعل',
      },
      description: {
        en: 'Custom multimodal conversational assistants grounded in your proprietary knowledge base to automate complex customer interactions, handle tier-2 support, and guide employee operations 24/7.',
        ar: 'مساعدون افتراضيون متعددو الوسائط مدربون على قواعد معرفتك الخاصة لأتمتة خدمة العملاء المعقدة، والرد الفوري على الاستفسارات وتوجيه العمليات الداخلية على مدار الساعة.',
      },
      icon: '/icons/solutions/ai-conversational-agent.svg',
      diagramType: 'ai-conversational-agent',
      highlights: {
        en: [
          'Omnichannel Web, Mobile & WhatsApp API Deployment',
          'Deterministic Source Citation & Zero Hallucination Guardrails',
          'Context-Aware Sentiment Analysis & Human Escalation Routing',
          'Bilingual Dialectal Arabic & English Natural Processing',
        ],
        ar: [
          'نشر متكامل عبر الويب، وتطبيقات الهاتف، وقنوات واتساب',
          'توثيق دقيق للمصادر وضوابط أمان تمنع الهلوسة',
          'تحليل لحظي لمشاعر المستخدم وإحالة ذكية للفريق البشري',
          'معالجة متقدمة للهجات العربية والإنجليزية بسلاسة فائقة',
        ],
      },
    },
    {
      slug: 'workflow-process-automation',
      tag: {
        en: 'Autonomous Operations',
        ar: 'الأتمتة التشغيلية المستقلة',
      },
      title: {
        en: 'Workflow & Autonomous Process Automation',
        ar: 'أتمتة مسارات العمل والعمليات المؤسسية',
      },
      description: {
        en: 'Self-orchestrating multi-agent systems that extract unstructured document data, reconcile disparate records, execute API transactions, and eliminate manual back-office bottlenecks.',
        ar: 'أنظمة مستقلة متعددة الوكلاء تستخرج البيانات من المستندات غير المنظمة، وتطابق السجلات، وتنفذ المعاملات عبر واجهات البرمجة للقضاء على معوقات العمل اليدوي.',
      },
      icon: '/icons/solutions/ai-workflow-automation.svg',
      diagramType: 'autonomous-workflow-engine',
      highlights: {
        en: [
          'Intelligent Document Processing (Invoices, Contracts, KYC, ID)',
          'Autonomous Decision Gates & Exception Handling Verification',
          'Legacy ERP & CRM Read/Write Transaction Orchestration',
          '65%+ Reduction in Manual Processing Turnaround Time',
        ],
        ar: [
          'معالجة ذكية للمستندات (فواتير، عقود، وثائق الهوية واعرف عميلك)',
          'بوابات اتخاذ قرار مستقلة والتحقق الذاتي من الأخطاء',
          'تكامل فوري وقراءة وكتابة مع أنظمة ERP و CRM المؤسسية',
          'خفض زمن المعالجة التشغيلية بنسبة تتجاوز 65%',
        ],
      },
    },
    {
      slug: 'recommendation-personalization-engines',
      tag: {
        en: 'Predictive Personalization',
        ar: 'التخصيص التنبؤي الذكي',
      },
      title: {
        en: 'Recommendation & Personalization Engines',
        ar: 'محركات التوصية والتخصيص الذكي الفائق',
      },
      description: {
        en: 'High-dimensional vector embedding models that analyze behavioral patterns in real time to serve personalized product catalogs, dynamic content feeds, and next-best-action recommendations.',
        ar: 'نماذج تمثيل متجهي متقدمة تحلل السلوك اللحظي للمستخدمين لتقديم ترشيحات مخصصة للمنتجات، وتجارب محتوى تفاعلية، وتوصيات بالخطوة المثالية التالية.',
      },
      icon: '/icons/solutions/ai-recommendation-engine.svg',
      diagramType: 'recommendation-cluster-matrix',
      highlights: {
        en: [
          'Real-Time Vector Similarity & Collaborative Filtering',
          'Cold-Start Heuristics for New Catalog Items & Users',
          'Session-Based Contextual Re-ranking & Dynamic Pricing',
          '+38% Average Order Value (AOV) & Content Engagement Lift',
        ],
        ar: [
          'تشابه متجهي لحظي وتصفية تشاركية فائقة الدقة',
          'خوارزميات ذكية لمعالجة المنتجات والمستخدمين الجدد',
          'إعادة ترتيب فورية لصفحات المنتجات وتخصيص التسعير',
          'زيادة متوسط قيمة الطلب (AOV) والتفاعل بنسبة +38%',
        ],
      },
    },
    {
      slug: 'predictive-analytics-business-intelligence',
      tag: {
        en: 'Data & Forecasting',
        ar: 'البيانات والتنبؤ المستقبلي',
      },
      title: {
        en: 'Predictive Analytics & Business Intelligence',
        ar: 'التحليلات التنبؤية وذكاء الأعمال الاستراتيجي',
      },
      description: {
        en: 'Deep learning time-series and classification algorithms that turn raw telemetry into probabilistic demand projections, churn early-warning alarms, and automated risk scoring.',
        ar: 'خوارزميات تعلم عميق وتصنيف زمني تحول البيانات الضخمة إلى توقعات طلب مستقبلية دقيقة، وإنذار مبكر بتسرب العملاء، وتقييم مؤتمت للمخاطر المالية.',
      },
      icon: '/icons/solutions/ai-predictive-analytics.svg',
      diagramType: 'predictive-forecast-beam',
      highlights: {
        en: [
          'Supply Chain Demand Sensing & Inventory Stockout Prediction',
          'Algorithmic Customer Churn Scoring & Preventive Retention',
          'Streaming Telemetry Dashboards & Anomaly Detection Beacons',
          'Executive Decision Simulation & Scenario Forecasting',
        ],
        ar: [
          'استشعار الطلب في سلاسل الإمداد وتفادي نفاد المخزون',
          'تقييم احتمالية مغادرة العميل والتدخل الاستباقي للاحتفاظ',
          'لوحات مؤشرات حية وكشف لحظي عن أي شذوذ في الأداء',
          'محاكاة قرارات الإدارة العليا والتنبؤ بالسيناريوهات البديلة',
        ],
      },
    },
    {
      slug: 'enterprise-rag-knowledge-retrieval',
      tag: {
        en: 'Knowledge Infrastructure',
        ar: 'البنية التحتية للمعرفة المؤسسية',
      },
      title: {
        en: 'Enterprise RAG & Hybrid Vector Retrieval',
        ar: 'أنظمة RAG واسترجاع المعرفة المتجهية الهجينة',
      },
      description: {
        en: 'Air-gapped Retrieval-Augmented Generation architectures that index massive corporate PDF repositories, SQL databases, and wikis for instant semantic discovery with verbatim source citations.',
        ar: 'معماريات استرجاع معرفة معزولة (RAG) تفهرس ملايين المستندات والوثائق وقواعد البيانات المؤسسية لتحقيق استكشاف دلالي فوري مدعوم بالاستشهاد بالمصدر بدقة متناهية.',
      },
      icon: '/icons/solutions/ai-rag-retrieval.svg',
      diagramType: 'llm-rag-pipeline',
      highlights: {
        en: [
          'Hybrid Dense Vector + Sparse BM25 Keyword Search',
          'Role-Based Access Control (RBAC) Enforced at Chunk Level',
          'Sub-Second Query Latency Across Millions of Document Embeddings',
          'Zero Data Leakage with Private On-Premise VPC Enclaves',
        ],
        ar: [
          'بحث هجين يجمع بين التقارب الدلالي والكلمات المفتاحية',
          'تحكم صارم بصلاحيات الوصول على مستوى كل جزء من البيانات',
          'استجابة فورية في أجزاء من الثانية عبر ملايين المتجهات',
          'حماية مطلقة للخصوصية داخل بيئات سحابية محلية خاصة',
        ],
      },
    },
    {
      slug: 'generative-ai-enterprise-copilots',
      tag: {
        en: 'Productivity Acceleration',
        ar: 'مضاعفة الإنتاجية المؤسسية',
      },
      title: {
        en: 'Generative AI & Enterprise Copilots',
        ar: 'الذكاء التوليدي والمساعدات المؤسسية المتخصصة',
      },
      description: {
        en: 'Task-specific AI copilots integrated into your internal enterprise portals to synthesize executive memos, audit legal clauses, generate clean code, and accelerate workforce output by 4x.',
        ar: 'مساعدات ذكاء اصطناعي متخصصة تندمج في بوابات العمل الداخلية لصياغة التقارير التنفيذية، وتدقيق البنود القانونية، وتوليد الكود البرمجي لمضاعفة إنتاجية الفرق بمقدار 4 أضعاف.',
      },
      icon: '/icons/solutions/ai-generative-copilots.svg',
      diagramType: 'generative-copilot-interface',
      highlights: {
        en: [
          'Custom Prompt Engineering & Domain Context Templating',
          'Legal Contract Analysis & Regulatory Clause Cross-Auditing',
          'Automated Technical Documentation & Code Review Assistants',
          'Streaming Output Synthesis with Token Cost Optimization',
        ],
        ar: [
          'هندسة أوامر احترافية وتضمين سياق الأعمال الخاص بمؤسستك',
          'تحليل وتدقيق العقود القانونية ومطابقة البنود التنظيمية',
          'توثيق برمجي مؤتمت ومساعدات مراجعة الأكواد للفرق التقنية',
          'توليد لحظي سريع للمخرجات مع ترشيد استهلاك تكاليف الرموز',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'From AI Hype to Deterministic Enterprise Execution',
      ar: 'من صخب الذكاء الاصطناعي إلى التنفيذ المؤسسي الحاسم والموثوق',
    },
    text: {
      en: 'Most enterprise AI initiatives fail because they treat large language models as standalone chatbots rather than deep system integrations. At Persici, we engineer production AI as an architectural layer — grounding foundation models in your proprietary data pipelines, enforcing deterministic guardrails to eliminate hallucinations, and integrating directly with existing ERPs, CRMs, and core databases. Our solutions prioritize data sovereignty, local GCC cloud compliance (Saudi NDMO and UAE AI ethics), sub-second inference latency, and measurable ROI. Whether automating high-volume document workflows or building autonomous agentic loops, we turn artificial intelligence into a reliable, secure, and compounding growth engine.',
      ar: 'تفشل معظم مبادرات الذكاء الاصطناعي في المؤسسات لأنها تتعامل مع النماذج كأدوات محادثة معزولة بدلاً من دمجها في صميم الأنظمة البرمجية. في بيرسيكي، نهندس الذكاء الاصطناعي كطبقة معمارية حيوية، ونربط النماذج ببيانات مؤسستك الخاصة، ونطبق حواجز حماية صارمة لمنع الهلوسة، مع التكامل المباشر مع قواعد البيانات وأنظمة ERP و CRM. نضع في مقدمة أولوياتنا سيادة البيانات، والامتثال للوائح الخليجية (سدايا وضوابط الإمارات)، مع تحقيق زمن استجابة سريع وعائد استثماري ملموس يضاعف الكفاءة التشغيلية.',
    },
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=85',
    metric1Val: '85%+',
    metric1Label: {
      en: 'Routine Workflow Automation',
      ar: 'أتمتة العمليات الروتينية المتكررة',
    },
    metric2Val: '4.4x',
    metric2Label: {
      en: 'Decision-Making Velocity',
      ar: 'تسريع وتيرة اتخاذ القرارات',
    },
  },

  benefitsStrip: {
    title: {
      en: 'Strategic Advantages of Persici AI Engineering',
      ar: 'المزايا الاستراتيجية لمعمارية الذكاء الاصطناعي في بيرسيكي',
    },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85',
    benefits: [
      {
        title: {
          en: 'Sovereign Data Privacy & Air-Gapped Security',
          ar: 'سيادة تامة للبيانات وحماية معزولة للخصوصية',
        },
        description: {
          en: 'Zero data leakage to third-party providers. Deployments reside entirely within your private VPC or on-premise infrastructure under full GCC regulatory compliance.',
          ar: 'حماية مطلقة من تسرب البيانات لمزودي الخدمة الخارجيين، مع نشر المنظومة بالكامل داخل شبكاتك الخاصة وبما يتوافق مع الأنظمة الحكومية.',
        },
        accentColor: '#D83427',
      },
      {
        title: {
          en: 'Sub-Second Hybrid RAG Retrieval Latency',
          ar: 'استرجاع دلالي هجين فائق السرعة',
        },
        description: {
          en: 'Optimized vector indices and sparse keyword filters deliver verified source document context to foundation models in under 400 milliseconds.',
          ar: 'فهارس متجهية محسّنة تقدم سياق الوثائق الموثقة للنماذج اللغوية في زمن استجابة يقل عن 400 جزء من الثانية.',
        },
        accentColor: '#EF8C7D',
      },
      {
        title: {
          en: 'Deterministic Business Logic & Guardrails',
          ar: 'منطق أعمال محكم وحواجز حماية موثوقة',
        },
        description: {
          en: 'Strict output schema validation and fact-checking layers eliminate generative hallucinations, ensuring production outputs are 100% auditable.',
          ar: 'ضوابط تدقيق صارمة على المخرجات تقضي على الهلوسة تماماً، وتضمن توافق الردود بنسبة 100% مع اللوائح والسياسات الداخلية.',
        },
        accentColor: '#121212',
      },
      {
        title: {
          en: 'Measurable Enterprise Operational ROI',
          ar: 'عائد استثماري تشغيلي واضح وقابل للقياس',
        },
        description: {
          en: 'Directly reduce back-office processing costs by 60%+, accelerate knowledge retrieval by 80%, and scale capacity without linear headcount expansion.',
          ar: 'خفض مباشر لتكاليف المعالجة التشغيلية بنسبة تتجاوز 60% وتسريع استخراج المعرفة بنسبة 80% دون الحاجة لمضاعفة فرق العمل.',
        },
        accentColor: '#D83427',
      },
    ],
  },

  verticalsTitle: {
    en: 'Domain Architectures & Industry Verticals',
    ar: 'المعمارية المتخصصة للقطاعات الاقتصادية',
  },
  verticalsSubtitle: {
    en: 'Tailored artificial intelligence models and workflows engineered to solve sector-specific regulatory, data, and operational challenges.',
    ar: 'نماذج ومسارات ذكاء اصطناعي مصممة لمعالجة التحديات التنظيمية والتشغيلية الخاصة بكل قطاع في بيئة الأعمال الخليجية.',
  },
  verticals: [
    {
      id: 'banking-fintech',
      number: '01',
      tag: { en: 'Financial Services', ar: 'الخدمات المالية والمصرفية' },
      title: {
        en: 'Banking, FinTech & Wealth Intelligence',
        ar: 'القطاع المصرفي، التقنية المالية وإدارة الثروات',
      },
      description: {
        en: 'Automated KYC document extraction, real-time transaction fraud anomalies, algorithmic risk scoring, and intelligent conversational wealth advisors.',
        ar: 'استخراج مؤتمت لوثائق فتح الحسابات، وكشف لحظي عن احتيال المعاملات، وتقييم ائتماني ذكي مع مستشارين استثماريين افتراضيين.',
      },
      capabilities: {
        en: [
          'Sub-Second Regulatory Anti-Money Laundering (AML) Screening',
          'Air-Gapped Private Banking Copilots & Portfolio Advisory',
          'Automated Financial Statement Parsing & Credit Underwriting',
          'Sovereign Local Vaults Compliant with SAMA & CBUAE Rules',
        ],
        ar: [
          'فحص فوري للمعاملات لمكافحة غسيل الأموال في أجزاء من الثانية',
          'مساعدات ذكاء اصطناعي مصرفية معزولة لإدارة المحافظ الاستثمارية',
          'تحليل مؤتمت للقوائم المالية وتقدير الجدارة الائتمانية',
          'خزائن تشفير سيادية متوافقة تماماً مع تعليمات البنوك المركزية',
        ],
      },
    },
    {
      id: 'healthcare-diagnostics',
      number: '02',
      tag: { en: 'Healthcare & Clinical', ar: 'الرعاية الصحية والسريرية' },
      title: {
        en: 'Healthcare, Clinical Data & Diagnostics',
        ar: 'الرعاية الصحية، البيانات السريرية والتشخيص',
      },
      description: {
        en: 'HIPAA and national health privacy compliant assistants that summarize clinical notes, streamline patient triage, and support diagnostic radiologist workflows.',
        ar: 'أنظمة متوافقة مع خصوصية السجلات الصحية تلخص الملاحظات الطبية، وتصنف حالات المرضى وتدعم فرق الأشعة والتشخيص السريري.',
      },
      capabilities: {
        en: [
          'Automated Clinical Encounter Transcription & EHR Ingestion',
          'Intelligent Patient Symptom Triage & Appointment Dispatch',
          'Medical Imaging Anomaly Pre-Screening & Prioritization',
          'Local Healthcare Data Residency Compliance (MOH / DOH)',
        ],
        ar: [
          'تدوين مؤتمت للمحادثات السريرية والتسجيل في الملفات الإلكترونية',
          'فرز ذكي لأعراض المرضى وتوجيه المواعيد حسب الأولوية الطبية',
          'فحص مبدئي للصور الطبية وتنبيه الأطباء للحالات الحرجة',
          'امتثال كامل للوائح استضافة البيانات الصحية المحلية',
        ],
      },
    },
    {
      id: 'retail-ecommerce',
      number: '03',
      tag: { en: 'Commerce & Retail', ar: 'التجارة الرقمية والتجزئة' },
      title: {
        en: 'Retail, E-Commerce & Autonomous Merchandising',
        ar: 'التجارة الرقمية، التجزئة وإدارة المتاجر المستقلة',
      },
      description: {
        en: 'Predictive inventory replenishment, semantic visual search, autonomous catalog tagging, and dynamic pricing models that maximize gross merchandise margins.',
        ar: 'إعادة تزويد المخزون التنبؤية، والبحث البصري الدلالي، والوسم التلقائي للمنتجات، ونماذج تسعير ذكية ترفع هوامش أرباح المتاجر.',
      },
      capabilities: {
        en: [
          'Semantic Visual Product Search & Multi-Modal Matching',
          'Autonomous SKU Tagging, SEO Copywriting & Categorization',
          'Predictive Dynamic Markdown & Volume Pricing Algorithms',
          'Conversational Commerce Assistants Integrated with Salla & Shopify',
        ],
        ar: [
          'بحث بصري دلالي ومطابقة دقيقة للمنتجات عبر الصور',
          'وسم مؤتمت للمنتجات وتوليد أوصاف تسويقية متوافقة مع SEO',
          'خوارزميات تسعير ديناميكي ذكي لتحقيق أقصى ربحية ممكنة',
          'مساعدات تجارة حوارية متكاملة مباشرة مع متاجر سلة وشوبيفاي',
        ],
      },
    },
    {
      id: 'government-public-sector',
      number: '04',
      tag: { en: 'Public Sector', ar: 'القطاع الحكومي والسيادي' },
      title: {
        en: 'Government, Citizen Services & Sovereign AI',
        ar: 'القطاع الحكومي، الخدمات التفاعلية والذكاء السيادي',
      },
      description: {
        en: 'Digital human citizen concierges, automated municipal permit reviewing, and legislative knowledge bases that enhance citizen satisfaction and process speed.',
        ar: 'مساعدون رقميون تفاعليون لخدمة المواطنين، وتدقيق مؤتمت للتراخيص والوثائق الحكومية، ومحركات بحث نظامية ترفع كفاءة الخدمات العامة.',
      },
      capabilities: {
        en: [
          '24/7 Digital Concierges Handling Millions of Citizen Inquiries',
          'Automated Statutory Compliance & Municipal Permit Review',
          'Localized Dialect Natural Processing for High Public Adoption',
          'Strict Data Sovereignty (Class-A Sovereign Cloud Compliant)',
        ],
        ar: [
          'مساعدون رقميون لخدمة ملايين المراجعين على مدار الساعة',
          'تدقيق مؤتمت ومطابقة للوائح التراخيص والمعاملات الرسمية',
          'معالجة دقيقة للهجات المحلية لضمان تجربة مستخدم استثنائية',
          'سيادة رقمية كاملة متوافقة مع الفئات السيادية المعتمدة',
        ],
      },
    },
    {
      id: 'energy-predictive-infrastructure',
      number: '05',
      tag: { en: 'Energy & Infrastructure', ar: 'الطاقة والبنية التحتية' },
      title: {
        en: 'Energy, Utilities & Predictive Infrastructure',
        ar: 'قطاع الطاقة، المرافق والبنية التحتية التنبؤية',
      },
      description: {
        en: 'Edge AI sensor monitoring, acoustic anomaly telemetry, predictive equipment maintenance, and grid load optimization that prevent catastrophic downtime.',
        ar: 'مراقبة ذكية لحساسات إنترنت الأشياء، وتحليل الترددات الصوتية لكشف الأعطال، وصيانة تنبؤية للمعدات تمنع التوقف المفاجئ للمنشآت.',
      },
      capabilities: {
        en: [
          'Edge AI Telemetry Processing on Isolated Heavy Equipment',
          'Acoustic Anomaly Detection for Turbine & Pipeline Health',
          'Grid Load Forecasting & Dynamic Energy Distribution Models',
          'Automated HSE Compliance Scanning via Computer Vision',
        ],
        ar: [
          'معالجة حافة ذكية للبيانات التشغيلية في المنشآت الحقلية المعزولة',
          'كشف صوتي تنبؤي عن أعطال التوربينات وسلامة خطوط الأنابيب',
          'تنبؤ بأحمال الشبكة وتحسين توزيع الطاقة المستدامة',
          'مراقبة مؤتمتة لمعايير السلامة والصحة المهنية عبر الرؤية الحاسوبية',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'Modern Enterprise AI Infrastructure',
    ar: 'البنية التحتية المؤسسية للذكاء الاصطناعي',
  },
  techStackSubtitle: {
    en: 'Built on world-class foundation models, robust agentic orchestration frameworks, scalable vector stores, and sovereign private compute clusters.',
    ar: 'منظومة مبنية على أقوى النماذج التأسيسية، وأطر تنسيق الوكلاء الأذكياء، وقواعد البيانات المتجهية، والبيئات السحابية السيادية فائقة الأمان.',
  },
  techStackPods: [
    {
      title: {
        en: 'Foundational Models & LLMs',
        ar: 'النماذج التأسيسية والنماذج اللغوية الكبرى',
      },
      badge: { en: 'Inference Layer', ar: 'طبقة الاستدلال' },
      description: {
        en: 'Commercial and open-weight models fine-tuned and deployed with domain-specific grounding and token latency optimization.',
        ar: 'نماذج تجارية ومفتوحة المصدر مدربة ومخصصة لتطبيقات الأعمال مع ترشيد زمن الاستجابة وتكاليف الاستدلال.',
      },
      technologies: [
        { name: 'OpenAI GPT-4o', category: 'Commercial LLM', badge: 'Flagship' },
        { name: 'Anthropic Claude 3.5 Sonnet', category: 'Reasoning & Code', badge: 'Benchmark' },
        { name: 'Google Gemini 1.5 Pro', category: 'Multimodal / 2M Context', badge: 'Ultra Context' },
        { name: 'Meta LLaMA 3.1 (70B / 405B)', category: 'Sovereign Open Weights', badge: 'Private VPC' },
        { name: 'Mistral Large 2', category: 'Multilingual European LLM' },
        { name: 'DeepSeek-V3 / R1', category: 'High-Efficiency Reasoning' },
      ],
    },
    {
      title: {
        en: 'Agentic Frameworks & Orchestration',
        ar: 'أطر عمل وتنسيق الوكلاء الأذكياء',
      },
      badge: { en: 'Agentic Engine', ar: 'المحرك المستقل' },
      description: {
        en: 'Production-tested multi-agent graph state machines that manage memory, parallel tool calling, and self-correcting logic.',
        ar: 'أطر عمل لإدارة آلات الحالة المتعددة الوكلاء، وحفظ الذاكرة طويلة المدى، واستدعاء الأدوات والتصحيح الذاتي.',
      },
      technologies: [
        { name: 'LangGraph', category: 'Stateful Agent Graphs', badge: 'Production Standard' },
        { name: 'LlamaIndex', category: 'Enterprise Data Ingestion & RAG', badge: 'Standard' },
        { name: 'CrewAI', category: 'Multi-Agent Role Collaboration' },
        { name: 'AutoGen', category: 'Conversational Agent Loops' },
        { name: 'DSPy', category: 'Algorithmic Prompt Optimization' },
        { name: 'Semantic Kernel', category: 'Enterprise SDK Orchestration' },
      ],
    },
    {
      title: {
        en: 'Vector Databases & Semantic Search',
        ar: 'قواعد البيانات المتجهية والبحث الدلالي',
      },
      badge: { en: 'Knowledge Store', ar: 'مخزن المعرفة' },
      description: {
        en: 'Ultra-low latency vector indices enabling sub-second hybrid retrieval across billions of high-dimensional document chunks.',
        ar: 'فهارس متجهية سريعة تتيح البحث الدلالي والهجين في أجزاء من الثانية عبر مليارات المتجهات والوثائق المؤسسية.',
      },
      technologies: [
        { name: 'Pinecone', category: 'Serverless Managed Vector Index', badge: 'Zero Maintenance' },
        { name: 'Milvus', category: 'Distributed Enterprise Vector Cluster', badge: 'High Scale' },
        { name: 'Qdrant', category: 'Rust-Powered Low-Latency Vector DB', badge: 'Fastest Engine' },
        { name: 'pgvector (PostgreSQL)', category: 'Relational + Vector Hybrid', badge: 'Unified DB' },
        { name: 'Weaviate', category: 'Modular Semantic Search Graph' },
        { name: 'BigQuery Vector Search', category: 'GCP Data Warehouse Scale' },
      ],
    },
    {
      title: {
        en: 'Enterprise MLOps & Sovereign Cloud',
        ar: 'عمليات التعلم الآلي والبيئات السحابية السيادية',
      },
      badge: { en: 'Sovereign Compute', ar: 'الحوسبة السيادية' },
      description: {
        en: 'Private infrastructure, continuous model evaluation, GPU cluster orchestration, and sovereign regional compliance.',
        ar: 'بنية تحتية محلية خاصة، وتقييم مستمر لأداء النماذج، وإدارة حزم المعالجة الرسومية مع الالتزام التام بالسيادة الرقمية.',
      },
      technologies: [
        { name: 'AWS Bedrock & VPC Enclaves', category: 'Private Cloud', badge: 'Enterprise Standard' },
        { name: 'Azure OpenAI Private Endpoints', category: 'Dedicated Enclave', badge: 'GCC Region' },
        { name: 'Google Cloud Vertex AI', category: 'Managed MLOps Pipeline' },
        { name: 'vLLM & TensorRT-LLM', category: 'Ultra-High Throughput Inference', badge: 'Speed' },
        { name: 'NVIDIA Triton Inference Server', category: 'Hardware Acceleration' },
        { name: 'LangSmith & Arize AI', category: 'LLM Observability & Guardrails' },
      ],
    },
  ],

  clientStories: getAiIntegrationFeaturedClientStories(),

  delivery: {
    title: {
      en: 'How We Operationalize AI Systems',
      ar: 'منهجيتنا في تشغيل وتوسيع أنظمة الذكاء الاصطناعي',
    },
    subtitle: {
      en: 'A rigorous four-phase engineering framework designed to eliminate hallucination risk, guarantee sovereign compliance, and deliver rapid measurable ROI.',
      ar: 'إطار عمل هندسي دقيق من أربع مراحل مصمم للقضاء على مخاطر الهلوسة، وضمان السيادة الرقمية، وتحقيق عائد استثماري سريع وملموس.',
    },
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1400&q=85',
    pillars: [
      {
        title: {
          en: '1. Feasibility & Data Readiness Audit',
          ar: '١. دراسة الجدوى وتدقيق جاهزية البيانات',
        },
        description: {
          en: 'We audit your corporate document repositories, databases, and APIs for semantic density, privacy classification, and data hygiene before touching model code.',
          ar: 'ندقق مستودعات الوثائق وقواعد البيانات والواجهات البرمجية لتقييم جودتها وتصنيف درجات سريتها قبل كتابة أي سطر برمجي.',
        },
      },
      {
        title: {
          en: '2. Deterministic Architecture & Hybrid RAG',
          ar: '٢. المعمارية الموثوقة وهندسة استرجاع RAG',
        },
        description: {
          en: 'We establish hybrid vector search indices, define chunking strategies, and implement multi-layer guardrails to ensure 100% auditable citation accuracy.',
          ar: 'نبني فهارس البحث المتجهي الهجين، ونحدد استراتيجيات تقطيع النصوص، ونضع حواجز حماية تضمن دقة الاستشهاد بالمصادر دون هلوسة.',
        },
      },
      {
        title: {
          en: '3. Staged Sandbox & Agentic Integration',
          ar: '٣. بيئة الاختبار المرحلية وتكامل الوكلاء',
        },
        description: {
          en: 'We deploy multi-agent state machines in a secure isolated staging enclave, conducting rigorous red-teaming, prompt evasion stress tests, and API validation.',
          ar: 'ننشر وكلاء الذكاء الاصطناعي داخل بيئات معزولة وآمنة، مع إخضاعها لاختبارات أمنية مكثفة ومحاكاة محاولات الاختراق قبل الإطلاق.',
        },
      },
      {
        title: {
          en: '4. Sovereign Scaled Production & Continuous MLOps',
          ar: '٤. النشر السيادي والمتابعة المستمرة (MLOps)',
        },
        description: {
          en: 'We scale your solution to production with private VPC end-points, continuous token cost telemetry, automated regression tests, and dedicated SLA support.',
          ar: 'نطلق المنظومة للعمل الميداني بنقاط وصول سحابية خاصة، مع مراقبة استهلاك الرموز البرمجية، واختبارات الأداء المستمرة وضمان مستوى الخدمة.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'ai-insight-1',
      slug: 'sovereign-ai-gcc-compliance',
      category: {
        en: 'Regulatory Strategy',
        ar: 'الاستراتيجية التنظيمية',
      },
      title: {
        en: 'Sovereign AI in the GCC: Building Air-Gapped Enterprise LLM Architectures Under NDMO Guidelines',
        ar: 'الذكاء الاصطناعي السيادي في الخليج: بناء نماذج ذكاء اصطناعي مؤسسية معزولة وفق ضوابط سدايا',
      },
      date: {
        en: 'September 2026',
        ar: 'سبتمبر ٢٠٢٦',
      },
      href: '/insights/sovereign-ai-gcc-compliance',
      type: 'insight',
    },
    {
      id: 'ai-insight-2',
      slug: 'eliminating-rag-hallucinations',
      category: {
        en: 'AI Engineering',
        ar: 'هندسة الذكاء الاصطناعي',
      },
      title: {
        en: 'Eliminating RAG Hallucinations: Advanced Hybrid Vector Indexing and Deterministic Guardrails in Production',
        ar: 'القضاء على هلوسة نماذج RAG: الفهرسة المتجهية الهجينة وحواجز الحماية الموثوقة في بيئات الإنتاج',
      },
      date: {
        en: 'August 2026',
        ar: 'أغسطس ٢٠٢٦',
      },
      href: '/insights/eliminating-rag-hallucinations',
      type: 'insight',
    },
    {
      id: 'ai-insight-3',
      slug: 'autonomous-multi-agent-orchestration',
      category: {
        en: 'Autonomous Systems',
        ar: 'الأنظمة المستقلة',
      },
      title: {
        en: 'Beyond Chatbots: How Autonomous Multi-Agent Workflows Are Automating Tier-2 Enterprise Operations',
        ar: 'ما بعد روبوتات الدردشة: كيف تُحدث مسارات الوكلاء الأذكياء المستقلين ثورة في العمليات التشغيلية المعقدة',
      },
      date: {
        en: 'July 2026',
        ar: 'يوليو ٢٠٢٦',
      },
      href: '/insights/autonomous-multi-agent-orchestration',
      type: 'insight',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici transformed our institutional research operations. Instead of waiting days for analysts to manually digest complex regulatory filings and financial disclosures, our teams now interact with a secure, sovereign AI copilot that synthesizes millions of data points in seconds with zero hallucination. It is by far the highest-ROI technology initiative we have executed this decade.',
      ar: 'أحدثت بيرسيكي نقلة نوعية حقيقية في كفاءة أبحاثنا الاستثمارية. بدلاً من انتظار أيام لتحليل التقارير المالية والوثائق النظامية المعقدة، أصبح لدى فرقنا وكيل ذكاء اصطناعي سيادي وآمن يلخص ملايين المتغيرات في ثوانٍ معدودة بدقة مطلقة. إنها بلا شك المبادرة التقنية الأعلى عائداً على الاستثمار لمؤسستنا.',
    },
    author: 'Dr. Tariq Al-Mansoor',
    role: {
      en: 'Chief Technology & Innovation Officer, Gulf Capital Investment Group',
      ar: 'رئيس قطاع التقنية والابتكار، مجموعة جلف كابيتال للاستثمار',
    },
    badge: {
      en: 'Verified Enterprise AI Client Review',
      ar: 'تقييم موثق من عميل مؤسسي للذكاء الاصطناعي',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions',
    ar: 'الأسئلة الشائعة حول الذكاء الاصطناعي',
  },
  faqsSubtitle: {
    en: 'Clear answers regarding data sovereignty, private VPC hosting, hallucination prevention, legacy integration, and deployment timelines.',
    ar: 'إجابات واضحة حول سيادة البيانات، والاستضافة السحابية الخاصة، ومنع الهلوسة، والتكامل مع الأنظمة القديمة والجداول الزمنية للتنفيذ.',
  },
  faqs: [
    {
      question: {
        en: 'Where is our enterprise data hosted and is it ever used to train public models?',
        ar: 'أين تتم استضافة بيانات مؤسستنا وهل يتم استخدامها لتدريب نماذج عامة؟',
      },
      answer: {
        en: 'Never. All AI solutions designed by Persici enforce strict zero-data-retention agreements. For clients with high security or sovereignty mandates, we deploy entirely within your private VPC (AWS, Azure, Google Cloud GCC regions) or on air-gapped on-premise hardware using fine-tuned open-weight models (like LLaMA 3.1 or Mistral). Your proprietary data never leaves your perimeter and is strictly excluded from any public model training loops.',
        ar: 'مستحيل تماماً. تلتزم بيرسيكي باتفاقيات صارمة لعدم الاحتفاظ بالبيانات. وللجهات ذات المتطلبات الأمنية والسيادية العالية، ننشر الحلول بالكامل داخل شبكاتك السحابية الخاصة (مراكز بيانات الخليج) أو على خوادم محلية معزولة باستخدام نماذج مفتوحة المصدر مدربة خصيصاً لك، مما يضمن بقاء بياناتك تحت سيطرتك الكاملة دون أي مشاركة مع أطراف خارجية.',
      },
    },
    {
      question: {
        en: 'How do you prevent generative AI hallucinations in sensitive business workflows?',
        ar: 'كيف تضمنون منع هلوسة الذكاء الاصطناعي في مسارات العمل الحساسة؟',
      },
      answer: {
        en: 'We implement deterministic Retrieval-Augmented Generation (RAG) with multi-layered guardrails. Foundation models are instructed and constrained via system prompts to answer strictly from provided source chunks. Every single output sentence is cryptographically mapped to verbatim document citations. If the retrieval engine cannot locate verified evidence in your knowledge base, the model triggers an explicit fallback response rather than generating unverified assumptions.',
        ar: 'نطبق معمارية استرجاع معرفة معززة (RAG) موثوقة مع حواجز حماية متعددة الطبقات. يتم تقييد النماذج للإجابة حصرياً من نصوص الوثائق المرفقة، مع ربط كل عبارة بمصدرها الأصلي برقم الصفحة والفقرة. وفي حال عدم العثور على إجابة موثقة في بياناتك، يتم تفعيل رد توضيحي صريح بدلاً من اللجوء إلى التخمين أو الهلوسة.',
      },
    },
    {
      question: {
        en: 'Are your AI implementations compliant with Saudi NDMO and UAE AI ethics frameworks?',
        ar: 'هل حلولكم متوافقة مع لوائح سدايا بالسعودية وإرشادات حوكمة الذكاء بالإمارات؟',
      },
      answer: {
        en: 'Yes. Our engineering protocols are built specifically to adhere to the National Data Management Office (NDMO) standards in Saudi Arabia, SDAIA AI ethics guidelines, and the UAE National Strategy for Artificial Intelligence. We implement role-based access control (RBAC), data residency in local GCC cloud zones, comprehensive audit logging, and automated PII anonymization to ensure full regulatory compliance.',
        ar: 'نعم بالتأكيد. تم تصميم كافة معمارياتنا البرمجية لتتوافق مع معايير مكتب إدارة البيانات الوطنية (NDMO) بالمملكة العربية السعودية، وأخلاقيات الذكاء الاصطناعي لهيئة (سدايا)، واستراتيجية الإمارات الوطنية للذكاء الاصطناعي، مع الالتزام التام بإقامة البيانات محلياً وتشفيرها وتطبيق سجلات التدقيق الشاملة.',
      },
    },
    {
      question: {
        en: 'Can your AI solutions integrate with legacy ERP, CRM, and custom databases?',
        ar: 'هل يمكن لحلولكم التكامل مع أنظمة ERP و CRM وقواعد البيانات القديمة لدينا؟',
      },
      answer: {
        en: 'Absolutely. We specialize in non-invasive API middleware and custom database connectors. Our autonomous multi-agent workflows connect seamlessly to SAP, Oracle, Microsoft Dynamics, Salesforce, PostgreSQL, SQL Server, and custom internal REST/GraphQL endpoints to read telemetry, query records, and write approved transactions with complete auditability.',
        ar: 'بالتأكيد. نحن متخصصون في بناء طبقات ربط برمجية آمنة لا تتطلب تعديل أنظمتك الأساسية. تتكامل حلولنا بسلاسة مع SAP، و Oracle، و Microsoft Dynamics، و Salesforce وقواعد بيانات SQL المختلفة لقراءة البيانات وتنفيذ المعاملات المعتمدة بسلاسة وأمان.',
      },
    },
    {
      question: {
        en: 'How do you optimize recurring token costs and response latency for high-volume use?',
        ar: 'كيف تتحكمون في تكاليف الرموز (Tokens) وسرعة الاستجابة في الاستخدام الكثيف؟',
      },
      answer: {
        en: 'We utilize dynamic semantic caching (storing previous query responses to eliminate redundant LLM calls), tiered model routing (directing simple queries to fast, cost-effective models while reserving reasoning models for complex tasks), and prompt compression techniques. This architecture routinely reduces token expenditures by 45% to 65% while keeping end-to-end response latency under 600 milliseconds.',
        ar: 'نعتمد تقنيات التخزين المؤقت الدلالي (Semantic Caching) لتفادي تكرار الاستعلامات، مع توجيه ذكي للمهام (استخدام نماذج سريعة ومنخفضة التكلفة للمهام الروتينية، وتخصيص النماذج الكبرى للمهام المعقدة)، وضغط الأوامر، مما يخفض تكاليف الاستهلاك بنسبة 45% إلى 65% ويحافظ على زمن استجابة سريع جداً.',
      },
    },
    {
      question: {
        en: 'What is the typical timeline to deploy an enterprise AI solution into production?',
        ar: 'ما هو الإطار الزمني المعتاد لإطلاق ونشر حل الذكاء الاصطناعي في بيئة العمل؟',
      },
      answer: {
        en: 'A standard enterprise AI engagement spans 6 to 12 weeks depending on integration complexity. Phase 1 (Data audit & RAG sandbox proof-of-concept) delivers a working prototype within 2 to 3 weeks. Phase 2 (System integration, security hardening, and red-teaming) takes 3 to 4 weeks, followed by staged production rollout, team enablement, and continuous MLOps telemetry.',
        ar: 'يستغرق المشروع المؤسسي المعتاد بين 6 إلى 12 أسبوعاً حسب حجم الأنظمة المرتبطة. وتبدأ المرحلة الأولى بتدقيق البيانات وبناء نموذج تجريبي فعال (PoC) خلال أسبوعين إلى 3 أسابيع، تليها مرحلة التكامل الأمني واختبارات الأداء لمدة 3 إلى 4 أسابيع، ثم النشر التدريجي وتدريب الفرق.',
      },
    },
  ],
};