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

export interface HealthOfferingItem {
  slug: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  diagramType: SolutionDiagramType;
  highlights: { en: string[]; ar: string[] };
}

export interface HealthVerticalItem {
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

export interface HealthData {
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
  offerings: HealthOfferingItem[];
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
  verticals: HealthVerticalItem[];
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

export const healthData: HealthData = {
  hero: {
    tag: {
      en: 'Industry Practice',
      ar: 'قطاع الممارسات الصناعية',
    },
    secondaryTag: {
      en: 'Healthcare & Life Sciences',
      ar: 'الرعاية الصحية وعلوم الحياة',
    },
    title: {
      en: 'Empowering Human-Centered Healthcare & Life Sciences Innovation',
      ar: 'تمكين الرعاية الصحية المرتكزة على الإنسان وابتكارات علوم الحياة',
    },
    subtitle: {
      en: 'Transform clinical outcomes, expand digital patient access, and accelerate medical discovery. We architect sovereign, FHIR-interoperable care platforms, telehealth ecosystems, and secure health data lakes across the GCC.',
      ar: 'إحداث تحول نوعي في النتائج السريرية، وتوسيع وصول المرضى للرعاية الرقمية، وتسريع الاكتشافات الطبية. نصمم منصات رعاية متوافقة مع معايير FHIR، ومنظومات طب اتصالي، وبحيرات بيانات صحية سيادية في دول الخليج.',
    },
    ctaText: {
      en: 'Consult Healthcare Architects',
      ar: 'استشر خبراء التقنيات الصحية',
    },
    ctaHref: '#contact',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=85',
    highlights: [
      {
        en: 'FHIR R4 & HL7 Interoperable Electronic Health Record (EHR) Pipelines',
        ar: 'مسارات ربط السجلات الصحية الإلكترونية (EHR) بمعايير FHIR R4 و HL7 العالمية',
      },
      {
        en: 'Encrypted Telehealth Consultation & Remote Patient Telemetry (RPM)',
        ar: 'استشارات طبية مرئية مشفرة ومنظومات متابعة العلامات الحيوية للمرضى عن بُعد',
      },
      {
        en: 'Sovereign Clinical Data Lake & AI Diagnostic Assistance Models',
        ar: 'بحيرة بيانات سريرية سيادية ونماذج ذكاء اصطناعي لدعم التشخيص الطبي الدقيق',
      },
      {
        en: 'Strict HIPAA, GDPR & Regional Ministry of Health Compliance',
        ar: 'امتثال صارم لمتطلبات HIPAA واللوائح التنظيمية لوزارات وهيئات الصحة الخليجية',
      },
    ],
  },

  futureStrip: [
    {
      title: {
        en: 'Disjointed clinical systems risk patient outcomes',
        ar: 'تشتت الأنظمة السريرية يهدد جودة الرعاية وسلامة المرضى',
      },
      description: {
        en: 'Fragmented electronic health records (EHR) force clinicians to navigate incompatible software, creating dangerous blind spots during diagnosis and care delivery.',
        ar: 'تجبر السجلات الصحية الإلكترونية غير المترابطة الكوادر الطبية على التعامل مع برمجيات غير متوافقة، مما يخلق فجوات خطيرة في تشخيص ومتابعة المرضى.',
      },
      badge: {
        en: 'Realities of Health 01',
        ar: 'واقع قطاع الصحة 01',
      },
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Clinician burnout threatens institutional capacity',
        ar: 'إجهاد الكوادر السريرية يهدد القدرة الاستيعابية للمستشفيات',
      },
      description: {
        en: 'Doctors and nurses spend hours on repetitive manual data entry, diminishing bedside time unless automated with ambient AI clinical documentation.',
        ar: 'يقضي الأطباء والتمريض ساعات طويلة في إدخال البيانات الورقية والروتينية، مما يقلص وقت الرعاية السريرية ما لم يتم أتمتة التوثيق الطبي بالذكاء الاصطناعي.',
      },
      badge: {
        en: 'Realities of Health 02',
        ar: 'واقع قطاع الصحة 02',
      },
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Patient privacy demands uncompromising compliance',
        ar: 'خصوصية المرضى تفرض امتثالاً صارماً لا يقبل التهاون',
      },
      description: {
        en: 'Handling genomic markers and clinical telemetry requires end-to-end encryption, localized HIPAA compliance, and sovereign data residency.',
        ar: 'تتطلب معالجة المؤشرات الجينومية والبيانات الحيوية تشفيراً شاملاً وامتثالاً لمعايير HIPAA وضمانات سيادة وتوطين البيانات الصحية محلياً.',
      },
      badge: {
        en: 'Realities of Health 03',
        ar: 'واقع قطاع الصحة 03',
      },
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=85',
    },
    {
      title: {
        en: 'Care must extend beyond hospital walls',
        ar: 'الرعاية الصحية يجب أن تمتد إلى ما بعد جدران المستشفى',
      },
      description: {
        en: 'Managing chronic diseases effectively requires remote patient monitoring, connected IoT diagnostics, and proactive virtual consultations.',
        ar: 'تتطلب الإدارة الفعالة للأمراض المزمنة مراقبة المريض عن بُعد عبر مستشعرات إنترنت الأشياء الطبية وتقديم الاستشارات الاستباقية دون انقطاع.',
      },
      badge: {
        en: 'Realities of Health 04',
        ar: 'واقع قطاع الصحة 04',
      },
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85',
    },
  ],

  agileFoundation: {
    title: {
      en: 'An Agile Foundation for Health & Life Sciences',
      ar: 'الأساس الهندسي المرن لقطاع الرعاية الصحية وعلوم الحياة',
    },
    subtitle: {
      en: 'Unifying hospital information systems, lab diagnostic endpoints, and patient mobile applications into a secure, low-latency clinical ecosystem.',
      ar: 'توحيد أنظمة المستشفيات، ومختبرات التحاليل والأشعة، وتطبيقات المرضى في منظومة سريرية آمنة وعالية التوافق والسرعة.',
    },
    diagramBadge: {
      en: 'Clinical Architecture',
      ar: 'معمارية النظم الصحية',
    },
    pillars: [
      {
        number: '01',
        title: {
          en: 'Interoperable FHIR Data Backbone',
          ar: 'عمود فقري موحد لتبادل البيانات الصحية (FHIR)',
        },
        description: {
          en: 'Standardized FHIR R4 APIs harmonizing patient encounters, prescriptions, lab results, and diagnostic scans across public and private hospitals.',
          ar: 'واجهات FHIR R4 معيارية توحد سجلات مراجعات المرضى، والوصفات الطبية، ونتائج المختبرات، والأشعة بين المستشفيات الحكومية والخاصة.',
        },
      },
      {
        number: '02',
        title: {
          en: 'Patient-Centric Engagement Tier',
          ar: 'واجهات تفاعلية متمحورة حول المريض',
        },
        description: {
          en: 'Empathetic, accessible mobile apps offering seamless appointment booking, digital prescriptions, lab results, and video consultations.',
          ar: 'تطبيقات جوال ميسرة تتيح حجز المواعيد، واستعراض الوصفات الرقمية، ونتائج الفحوصات، والاستشارات المرئية مع الأطباء بسلاسة.',
        },
      },
      {
        number: '03',
        title: {
          en: 'Sovereign Health Security & Privacy',
          ar: 'حماية وأمان صحي سيادي مشدد',
        },
        description: {
          en: 'In-country localized health data lakes protected by AES-256 zero-knowledge encryption, ensuring compliance with regional Ministry of Health laws.',
          ar: 'بحيرات بيانات صحية محلية محمية بتشفير AES-256 متقدم بانعدام المعرفة، لضمان الامتثال التام للوائح وزارات وهيئات الصحة الخليجية.',
        },
      },
    ],
  },

  offeringsTitle: {
    en: 'Core Healthcare Capabilities',
    ar: 'القدرات الهندسية لقطاع الرعاية الصحية',
  },
  offeringsSubtitle: {
    en: 'Secure, clinical-grade digital platforms engineered to enhance diagnostic speed, patient well-being, and medical workflow velocity.',
    ar: 'منصات رقمية طبية معتمدة مصممة لرفع دقة التشخيص، وتحسين جودة حياة المرضى، وتسريع الإجراءات السريرية.',
  },
  offerings: [
    {
      slug: 'telehealth-virtual-clinics',
      tag: { en: 'Telehealth & Care', ar: 'الطب الاتصالي والرعاية' },
      title: { en: 'Connected Telehealth & Virtual Clinic Platforms', ar: 'منصات الطب الاتصالي والعيادات الافتراضية' },
      description: {
        en: 'End-to-end virtual consultations with HD video, integrated digital stethoscope audio, in-session EHR note-taking, and automated electronic e-prescriptions.',
        ar: 'استشارات طبية افتراضية متكاملة ببث فيديو عالي الدقة، وتزامن أصوات السماعة الطبية الرقمية، وتوثيق السجل الطبي وإصدار الوصفات الدوائية المعتمدة.',
      },
      icon: 'TbActivity',
      diagramType: 'neural-synapse-web',
      highlights: {
        en: [
          'Encrypted WebRTC HD Video with Virtual Waiting Rooms',
          'Integrated Digital E-Prescription Gateway to Pharmacies',
          'In-Consultation Medical Device Telemetry Streaming',
          'Automated Post-Consultation Follow-Up Care Plans',
        ],
        ar: [
          'بث مرئي عالي الأمان عبر WebRTC مع غرف انتظار افتراضية',
          'بوابة وصفات دوائية إلكترونية مربوطة مباشرة بالصيدليات المعتمدة',
          'استقبال بث قراءات الأجهزة الطبية المنزلية أثناء الاستشارة',
          'خطط متابعة صحية مجدولة وتنبيهات علاجية آلية بعد الكشف',
        ],
      },
    },
    {
      slug: 'life-sciences-clinical-data',
      tag: { en: 'Life Sciences & Trials', ar: 'علوم الحياة والتجارب السريرية' },
      title: { en: 'Life Sciences & Clinical Trial Data Engine', ar: 'محرك بيانات علوم الحياة والتجارب السريرية' },
      description: {
        en: 'Streamline drug discovery pipelines and patient cohort identification using federated clinical data lakes with automated patient de-identification.',
        ar: 'تسريع وتيرة أبحاث الأدوية وتحديد المجموعات المؤهلة للتجارب السريرية عبر بحيرات بيانات سريرية موحدة مع حجب الهوية آلياً.',
      },
      icon: 'TbFlask',
      diagramType: 'helix-data-strand',
      highlights: {
        en: [
          'Automated HIPAA/GDPR Patient Record Anonymization',
          'AI-Powered Clinical Trial Eligibility Matching',
          'Electronic Data Capture (EDC) Regulatory Compliance',
          'Adverse Drug Event (ADE) Real-Time Signal Detection',
        ],
        ar: [
          'حجب آلي لمعلومات هوية المرضى وفق معايير الخصوصية الصارمة',
          'مطابقة شروط التجارب السريرية مع ملفات المرضى بالذكاء الاصطناعي',
          'منظومات جمع البيانات الإلكترونية (EDC) المطابقة للمواصفات',
          'رصد الآثار الجانبية للأدوية والإشارات الدوائية في الوقت الفعلي',
        ],
      },
    },
    {
      slug: 'medtech-iot-streaming',
      tag: { en: 'MedTech & IoT', ar: 'الأجهزة الطبية وإنترنت الأشياء' },
      title: { en: 'MedTech IoT & Medical Device Streaming', ar: 'إنترنت الأشياء الطبي وبث قراءات الأجهزة الحيوية' },
      description: {
        en: 'Connect patient glucose monitors, pulse oximeters, and hospital ventilators to secure cloud endpoints for real-time anomaly detection and clinical alerts.',
        ar: 'ربط أجهزة قياس السكر، ونبضات القلب، وأجهزة التنفس بالمستشفيات مع منصات سحابية آمنة لاكتشاف الاضطرابات الحيوية وإرسال الإنذارات الفورية.',
      },
      icon: 'TbHeartbeat',
      diagramType: 'hexagonal-honeycomb-hive',
      highlights: {
        en: [
          'MQTT & Bluetooth Low Energy (BLE) Medical Ingestion',
          'Real-Time Tachycardia & Oxygen Drop Anomaly Triggers',
          'FDA & CE Mark Software as a Medical Device (SaMD) Design',
          'Continuous Bedside ICU Telemetry Stream Orchestration',
        ],
        ar: [
          'استقبال بيانات الأجهزة عبر تقنيات البلوتوث منخفض الطاقة (BLE)',
          'تنبيهات فورية لارتفاع نبضات القلب أو هبوط الأكسجين الحاد',
          'تصميم برمجي مطابق لاشتراطات البرمجيات كأجهزة طبية (SaMD)',
          'إدارة تدفق قراءات أجهزة العناية المركزة (ICU) إلى شاشات الأطباء',
        ],
      },
    },
    {
      slug: 'diagnostic-ai-clinical-decision',
      tag: { en: 'AI & Diagnostics', ar: 'التشخيص الطبي والذكاء الاصطناعي' },
      title: { en: 'Diagnostic AI & Clinical Decision Support', ar: 'الذكاء الاصطناعي التشخيصي وأنظمة دعم القرار الطبي' },
      description: {
        en: 'Assist clinicians with computer-vision models that triage radiology scans, flag emergent hemorrhage indicators, and cross-check drug-to-drug interactions.',
        ar: 'مساعدة الأطباء بنماذج رؤية حاسوبية تصنف صور الأشعة السينية، وترصد مؤشرات النزيف الطارئة، وتتحقق آلياً من التداخلات والتعارضات الدوائية.',
      },
      icon: 'TbStethoscope',
      diagramType: 'prism-refraction-beam',
      highlights: {
        en: [
          'DICOM Radiology Scan Pre-Screening & Lesion Bounding',
          'Automated Drug-Allergy & Interaction Conflict Checking',
          'Sepsis Early-Warning Score (NEWS2) Real-Time Calculation',
          'Sovereign In-Hospital AI Inference with Zero Cloud Leaks',
        ],
        ar: [
          'فحص استباقي لصور أشعة DICOM وتحديد مناطق الاشتباه بدقة',
          'تحقق آلي من تعارضات الأدوية مع حساسية المريض أو الأدوية الأخرى',
          'حساب مؤشرات الإنذار المبكر للتسمم وتدهور الحالات (NEWS2) فوراً',
          'تشغيل نماذج الذكاء الاصطناعي محلياً داخل المستشفى لحماية السرية',
        ],
      },
    },
    {
      slug: 'unified-patient-ehr',
      tag: { en: 'Interoperability', ar: 'تكامل السجلات الطبية' },
      title: { en: 'Unified Patient Electronic Health Records (EHR)', ar: 'السجل الطبي الإلكتروني الموحد للمريض (EHR)' },
      description: {
        en: 'Create a longitudinal, lifelong health record that unites clinical notes, immunization histories, surgical reports, and prescriptions from multiple healthcare networks.',
        ar: 'بناء سجل طبي موحد وشامل لحياة المريض يجمع الملاحظات السريرية، وتاريخ التطعيمات، وتقارير العمليات الجراحية، والوصفات من كافة المستشفيات.',
      },
      icon: 'TbFileInvoice',
      diagramType: 'circuit-flow',
      highlights: {
        en: [
          'Longitudinal Patient Health Timeline & Master Patient Index',
          'Bidirectional Sync with Epic, Cerner, and In-House HIS',
          'Patient Consent Management & Granular Record Sharing',
          'Instant Lab Test Trend Visualizations over Multi-Year Periods',
        ],
        ar: [
          'تسلسل زمني متكامل لصحة المريض وفهرس مركزي موحد للمرضى',
          'مزامنة ثنائية الاتجاه مع أنظمة Epic و Cerner والأنظمة المحلية',
          'إدارة موافقات المريض على مشاركة تقاريره مع الأطباء والاستشاريين',
          'رسوم بيانية لتطور نتائج الفحوصات والتحاليل عبر سنوات متعددة',
        ],
      },
    },
    {
      slug: 'sovereign-healthcare-compliance',
      tag: { en: 'Security & Compliance', ar: 'الأمان والامتثال الصحي' },
      title: { en: 'Sovereign Health Compliance & Identity Vault', ar: 'خزينة الهوية الطبية والامتثال الصحي السيادي' },
      description: {
        en: 'Protect electronic protected health information (ePHI) with immutable audit logs, strict medical role authorization, and biometric patient verification.',
        ar: 'حماية المعلومات الصحية الإلكترونية المحمية (ePHI) بسجلات تدقيق غير قابلة للتعديل، وصلاحيات طبية مشددة، والتحقق الحيوي من هوية المريض.',
      },
      icon: 'TbShieldHeart',
      diagramType: 'ce-durable-identity-vault',
      highlights: {
        en: [
          'AES-256 Field-Level Encryption for Sensitive Medical Data',
          'Granular Role-Based Access for Doctors, Nurses & Staff',
          'Immutable Tamper-Evident Access Auditing Logs',
          'Compliance Certified for National Health Authority Mandates',
        ],
        ar: [
          'تشفير متقدم على مستوى الحقول للبيانات الصحية الحساسة',
          'صلاحيات وصول دقيقة بحسب اختصاص الأطباء والتمريض والإداريين',
          'سجلات تدقيق أمنية موثقة ترصد كل محاولة اطلاع على ملف المريض',
          'شهادات امتثال معتمدة لضوابط الهيئات الصحية الوطنية والإقليمية',
        ],
      },
    },
  ],

  whyItMatters: {
    title: {
      en: 'The Imperative of Modernized Digital Healthcare',
      ar: 'حتمية التحول الرقمي في الرعاية الصحية الحديثة',
    },
    text: {
      en: 'Healthcare systems around the world face a critical trilemma: rising clinical costs, clinician burnout, and an aging population with surging chronic disease rates. Fragmented hospital databases and proprietary medical devices prevent doctors from seeing the full clinical picture, resulting in redundant tests, delayed diagnoses, and administrative fatigue. Persici collaborates with hospital networks, life sciences giants, and regional health authorities to build open, secure, and human-centered digital health platforms that elevate clinical outcomes and expand life-saving care access.',
      ar: 'تواجه المنظومات الصحية حول العالم تحديات معقدة: ارتفاع التكاليف العلاجية، وإجهاد الكوادر الطبية، وتزايد الأمراض المزمنة. إن قواعد بيانات المستشفيات المنعزلة والأجهزة الطبية المغلقة تحرم الأطباء من الرؤية السريرية الشاملة، مما يؤدي إلى تكرار الفحوصات غير الضرورية، وتأخر التشخيص، واستنزاف الوقت الإداري. تتشارك بيرسيكي مع كبرى المستشفيات ومجموعات علوم الحياة والهيئات الصحية لبناء منصات طبية مفتوحة وآمنة ومتمحورة حول الإنسان ترفع كفاءة العلاج وتوسع سبل الرعاية المنقذة للحياة.',
    },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85',
  },

  benefitsStrip: {
    title: {
      en: 'Transformational Value for Healthcare Enterprises',
      ar: 'القيمة التشغيلية والسريرية للمؤسسات الصحية',
    },
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85',
    benefits: [
      {
        title: { en: 'Accelerated Clinical Turnaround', ar: 'تسريع دورة العمل السريري' },
        description: {
          en: 'Unified EHR data and AI decision support cut clinical charting time by 45%, giving doctors more dedicated time with patients.',
          ar: 'توحيد السجلات الطبية ودعم القرار بالذكاء الاصطناعي يقلص وقت التوثيق بنسبة 45%، ليمنح الأطباء وقتاً أطول لمعاينة المرضى.',
        },
      },
      {
        title: { en: 'Proactive Preventive Care', ar: 'رعاية وقائية استباقية للمرضى' },
        description: {
          en: 'Remote vital telemetry flags patient deterioration early, reducing preventable emergency room readmissions by up to 32%.',
          ar: 'المتابعة الحيوية عن بُعد ترصد التدهور الصحي مبكراً، مما يخفض إعادة التنويم في الطوارئ بنسبة 32%.',
        },
      },
      {
        title: { en: '100% Regulatory Health Compliance', ar: 'امتثال تنظيمي صحي بنسبة 100%' },
        description: {
          en: 'Full conformity with HIPAA, GDPR, and regional Ministry of Health cloud security directives, safeguarding patient trust.',
          ar: 'توافق كامل مع متطلبات HIPAA واللوائح التنظيمية لوزارات وهيئات الصحة الخليجية لترسيخ ثقة المرضى.',
        },
      },
      {
        title: { en: 'Frictionless Patient Experience', ar: 'تجربة مريض ميسرة بدون انتظار' },
        description: {
          en: 'Instant booking, mobile check-in, and home prescription delivery elevate patient satisfaction ratings above 93%.',
          ar: 'حجز المواعيد الفوري، وتسجيل الدخول عبر التطبيق، وتوصيل الأدوية للمنزل يرفع رضا المرضى لأكثر من 93%.',
        },
      },
    ],
  },

  verticalsTitle: {
    en: 'Healthcare Domains We Transform',
    ar: 'القطاعات الصحية التي نقود تحولها',
  },
  verticalsSubtitle: {
    en: 'Targeted architectures addressing the distinct clinical workflows, device standards, and compliance rules of specific healthcare sectors.',
    ar: 'معماريات متخصصة تلبي مسارات العمل السريرية، ومعايير الأجهزة الطبية، وضوابط الامتثال لمختلف مجالات الرعاية الصحية.',
  },
  verticals: [
    {
      id: 'hospital-providers',
      number: '01',
      title: { en: 'Hospital Systems & Healthcare Providers', ar: 'المستشفيات والمجموعات الطبية الكبرى' },
      tag: { en: 'Clinical Excellence', ar: 'التميز السريري' },
      description: {
        en: 'Connecting hospital wards, diagnostic labs, and outpatient specialty clinics into a single synchronized clinical operational network.',
        ar: 'ربط أجنحة التنويم، ومختبرات الفحوصات، والعيادات التخصصية في شبكة عمليات سريرية موحدة ومتزامنة على مدار الساعة.',
      },
      capabilities: {
        en: [
          'Inpatient Admission & Bedside EHR Tablet Workflows',
          'Automated Operating Room (OR) Schedule Optimization',
          'Cross-Department Lab & Radiology Order Routing',
          'Patient Portal with Multi-Physician Care Coordination',
        ],
        ar: [
          'إجراءات التنويم ومتابعة السجلات عبر أجهزة الأطباء اللوحية',
          'جدولة غرف العمليات الجراحية تلقائياً لتقليل وقت التعطيل',
          'توجيه طلبات التحاليل والأشعة بين الأقسام ومتابعتها فورياً',
          'بوابة للمريض تتيح التنسيق المتكامل بين مختلف أطبائه واستشارييه',
        ],
      },
    },
    {
      id: 'life-sciences',
      number: '02',
      title: { en: 'Life Sciences & Pharmaceutical R&D', ar: 'علوم الحياة وأبحاث وتطوير الأدوية' },
      tag: { en: 'Clinical Research', ar: 'الأبحاث والتجارب' },
      description: {
        en: 'Accelerating clinical research trials with federated real-world evidence (RWE) data lakes and AI-assisted patient cohort matching.',
        ar: 'تسريع التجارب السريرية للأدوية عبر بحيرات بيانات الأدلة الواقعية (RWE) والمطابقة الذكية لملفات المرضى المؤهلين.',
      },
      capabilities: {
        en: [
          'Real-World Evidence (RWE) Clinical Data Ingestion',
          'Decentralized Clinical Trial (DCT) Mobile Portals',
          'Regulatory Submission Electronic Dossier Generation',
          'Automated Adverse Drug Reaction Reporting Pipelines',
        ],
        ar: [
          'استيعاب بيانات الأدلة الواقعية (RWE) من المستشفيات الشريكة',
          'تطبيقات للجوال لإدارة التجارب السريرية اللامركزية مع المرضى',
          'إعداد الملفات الإلكترونية لتقديمها لهيئات الغذاء والدواء',
          'مسارات مؤتمتة للإبلاغ الفوري عن الآثار الجانبية للأدوية',
        ],
      },
    },
    {
      id: 'medtech-devices',
      number: '03',
      title: { en: 'Medical Device Manufacturers (MedTech)', ar: 'مصنعو الأجهزة والمعدات الطبية (MedTech)' },
      tag: { en: 'Connected Hardware', ar: 'الأجهزة المتصلة' },
      description: {
        en: 'Transforming medical diagnostic devices into connected IoT platforms streaming continuous telemetry to physician clinical dashboards.',
        ar: 'تحويل الأجهزة التشخيصية والمعدات الطبية إلى منصات ذكية متصلة تبث القياسات الحيوية لحظياً إلى لوحات تحكم الأطباء.',
      },
      capabilities: {
        en: [
          'Secure Bluetooth & Cellular Device Cloud Ingestion',
          'Device Preventive Maintenance & Remote Calibration',
          'Software as a Medical Device (SaMD) Architecture',
          'Real-Time Patient Bio-Signal Anomaly Detection',
        ],
        ar: [
          'استقبال بيانات الأجهزة الآمن عبر البلوتوث والشبكات الخلوية',
          'الصيانة الوقائية ومعايرة الأجهزة الطبية الحساسة عن بُعد',
          'معمارية برمجية معتمدة كأجهزة طبية رسمية (SaMD)',
          'رصد الاضطرابات الحيوية في إشارات تخطيط القلب والتنفس',
        ],
      },
    },
    {
      id: 'telehealth-startups',
      number: '04',
      title: { en: 'Digital Health & Telemedicine Startups', ar: 'منصات الصحة الرقمية والطب الاتصالي' },
      tag: { en: 'On-Demand Health', ar: 'الرعاية الصحية عند الطلب' },
      description: {
        en: 'Empowering digital health innovators to launch on-demand telemedicine consultations, mental health portals, and home lab test booking apps.',
        ar: 'تمكين رواد الصحة الرقمية من إطلاق منصات الاستشارات الطبية الفورية، وتطبيقات الصحة النفسية، وحجز الفحوصات المنزلية.',
      },
      capabilities: {
        en: [
          'Instant Doctor-on-Demand Video Queue Orchestration',
          'At-Home Phlebotomy & Lab Sample Booking Engine',
          'Digital Prescription Fulfillment with Courier Dispatch',
          'Subscription-Based Chronic Wellness & Diet Tracking',
        ],
        ar: [
          'إدارة طوابير الاستشارات الفورية مع الأطباء المتاحين على مدار الساعة',
          'محرك حجز سحب العينات والتحاليل المخبرية من المنزل',
          'صرف وتوصيل الوصفات الدوائية عبر مناديب الشحن المعتمدين',
          'برامج اشتراكات لمتابعة الحالات المزمنة وتنسيق الحميات الغذائية',
        ],
      },
    },
  ],

  techStackTitle: {
    en: 'Healthcare Technical Infrastructure',
    ar: 'البنية التقنية للقطاع الصحي',
  },
  techStackSubtitle: {
    en: 'Clinical-grade, certified interoperability and security foundations built to the highest medical regulatory frameworks.',
    ar: 'بنية تحتية طبية معتمدة ومحصنة توفر أعلى مستويات التوافقية والأمان وفق أشد المعايير الصحية العالمية واللوائح الإقليمية.',
  },
  techStackPods: [
    {
      title: { en: 'Healthcare Interoperability & APIs', ar: 'التوافقية والواجهات الصحية المعيارية' },
      badge: { en: 'Standards Tier', ar: 'طبقة المعايير' },
      description: {
        en: 'Certified FHIR R4 and HL7 message brokers connecting hospital information systems (HIS) with cloud endpoints.',
        ar: 'وسطاء رسائل معتمدون بمعايير FHIR R4 و HL7 لربط أنظمة المستشفيات (HIS) بالمنصات السحابية والتطبيقات.',
      },
      technologies: [
        { name: 'HL7 FHIR R4', category: 'Medical Data Standard', badge: 'Global Core' },
        { name: 'DICOMweb', category: 'Medical Imaging API', badge: 'PACS Sync' },
        { name: 'Epic / Cerner APIs', category: 'EHR Bidirectional Connectors', badge: 'Certified' },
        { name: 'HAPI FHIR Engine', category: 'Open-Source FHIR Server', badge: 'Enterprise' },
      ],
    },
    {
      title: { en: 'Sovereign Health Cloud Infrastructure', ar: 'السحابة الصحية السيادية' },
      badge: { en: 'Cloud & In-Country Tier', ar: 'طبقة السحابة المحلية' },
      description: {
        en: 'Dedicated health cloud infrastructure ensuring all patient diagnostic notes and scans remain stored inside sovereign borders.',
        ar: 'بنية سحابية صحية مخصصة تضمن حفظ وتخزين جميع سجلات المرضى وصور الأشعة داخل الحدود الوطنية حصرياً.',
      },
      technologies: [
        { name: 'AWS Healthcare Cloud', category: 'Dedicated Clinical VPC', badge: 'In-Country' },
        { name: 'Google Cloud Healthcare API', category: 'Managed FHIR & De-ID', badge: 'Sovereign' },
        { name: 'Oracle Health Cloud', category: 'Clinical Core Ledger', badge: 'Tier-4' },
        { name: 'STC Medical Cloud', category: 'Regional In-Kingdom Host', badge: 'Compliant' },
      ],
    },
    {
      title: { en: 'Telehealth & Real-Time Communications', ar: 'الطب الاتصالي والبث التفاعلي المشفر' },
      badge: { en: 'Telehealth Tier', ar: 'طبقة الاتصال الطبي' },
      description: {
        en: 'End-to-end encrypted WebRTC audio and video conferencing engineered for high clarity and low-bandwidth environments.',
        ar: 'اتصالات مرئية وصوتية مشفرة بالكامل عبر WebRTC مصممة للنقاء الصوتي والعمل بكفاءة في شبكات الاتصال الضعيفة.',
      },
      technologies: [
        { name: 'Twilio HIPAA Voice/Video', category: 'Encrypted Telehealth SDK', badge: 'Compliant' },
        { name: 'Agora WebRTC', category: 'Low-Latency Media Engine', badge: 'Sub-150ms' },
        { name: 'WebSockets Telemetry', category: 'Live Vitals Streaming', badge: 'Realtime' },
        { name: 'Daily.co Health Video', category: 'Embedded Consultation Rooms', badge: 'Secure' },
      ],
    },
    {
      title: { en: 'Health Cyber Governance & Security', ar: 'الأمان والحوكمة السيبرانية الصحية' },
      badge: { en: 'Compliance Tier', ar: 'طبقة الحوكمة والامتثال' },
      description: {
        en: 'Cryptographic key custody and zero-knowledge encryption safeguarding sensitive electronic personal health information (ePHI).',
        ar: 'إدارة وتخزين مفاتيح التشفير السيادية وحماية السجلات الطبية الشخصية (ePHI) ضد أي محاولات وصول غير مصرحة.',
      },
      technologies: [
        { name: 'HashiCorp Vault HSM', category: 'FIPS 140-2 Key Custody', badge: 'Hardware' },
        { name: 'Okta Customer Identity', category: 'Healthcare Identity & MFA', badge: 'OAuth 2.0' },
        { name: 'Cloudflare Zero Trust', category: 'Edge WAF & Clinician ZTNA', badge: 'HIPAA WAF' },
        { name: 'Datadog HIPAA Audit', category: 'Audit Log Archival & Alerting', badge: '24/7 Security' },
      ],
    },
  ],

  clientStories: getFeaturedStories(['gulf-enterprise-copilot', 'protes-sports', 'hala-food']),

  delivery: {
    title: {
      en: 'Healthcare Transformation Methodology',
      ar: 'منهجيتنا في تحول الأنظمة الصحية',
    },
    subtitle: {
      en: 'A patient-safety first delivery framework designed for strict regulatory compliance, minimal clinical interruption, and validated medical efficacy.',
      ar: 'منهجية تنفيذ تضع سلامة المرضى في المقام الأول، مصممة لمطابقة أدق الاشتراطات التنظيمية وضمان استمرار العمل السريري دون انقطاع.',
    },
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85',
    pillars: [
      {
        title: {
          en: 'Clinical Workflow & Regulatory Audit',
          ar: 'تدقيق المسارات السريرية والامتثال التنظيمي',
        },
        description: {
          en: 'Evaluate clinical charting friction, HIS integration points, patient data privacy boundaries, and medical council licensing requirements.',
          ar: 'تقييم تحديات التوثيق الطبي للأطباء، ونقاط ربط أنظمة المستشفى، وحدود خصوصية بيانات المرضى، واشتراطات التراخيص الصحية.',
        },
      },
      {
        title: {
          en: 'FHIR Architecture & Sovereign Cloud Setup',
          ar: 'بناء معمارية FHIR وتجهيز السحابة السيادية',
        },
        description: {
          en: 'Deploy in-country encrypted clinical repositories, set up FHIR R4 data models, and establish secure mTLS tunnels with legacy HIS databases.',
          ar: 'نشر المستودعات السريرية المشفرة محلياً، وضبط نماذج بيانات FHIR R4، وبناء قنوات ربط مشفرة مع قواعد بيانات المستشفى القديمة.',
        },
      },
      {
        title: {
          en: 'Pilot Clinical Unit Deployment',
          ar: 'التشغيل التجريبي في قسم سريري محدد',
        },
        description: {
          en: 'Deploy the new telehealth or EHR mobile solution within a pilot department, validating doctor satisfaction and patient usability before wide rollout.',
          ar: 'تشغيل حلول الطب الاتصالي أو السجل الطبي في قسم تخصصي تجريبي، والتحقق من رضا الكادر الطبي والمرضى قبل التعميم.',
        },
      },
      {
        title: {
          en: 'Hospital-Wide Rollout & AI Optimization',
          ar: 'التعميم الشامل وتفعيل أدوات الذكاء الاصطناعي',
        },
        description: {
          en: 'Scale the digital care platform across all clinics, activating automated clinical decision support, pharmacy integrations, and continuous audit monitoring.',
          ar: 'توسيع المنصة لتشمل كافة فروع وأقسام المستشفى، وتفعيل أدوات دعم القرار الطبي الذكية، وربط الصيدليات، والمراقبة الأمنية المستمرة.',
        },
      },
    ],
  },

  insights: [
    {
      id: 'hlth-insight-01',
      title: {
        en: 'The FHIR Revolution: How Interoperability Unlocks Value in Regional Healthcare',
        ar: 'ثورة معايير FHIR: كيف يفتح التوافق الرقمي آفاقاً جديدة للرعاية الصحية',
      },
      excerpt: {
        en: 'Why leading hospitals and ministries are adopting FHIR R4 to unify patient histories, eliminate redundant clinical tests, and power preventive medicine.',
        ar: 'لماذا تعتمد كبرى المستشفيات والهيئات معايير FHIR R4 لتوحيد سجلات المرضى، والقضاء على الفحوصات المكررة، ودعم الطب الوقائي.',
      },
      badge: {
        en: 'Health Interoperability',
        ar: 'التوافقية الصحية',
      },
      slug: 'fhir-revolution-regional-healthcare-interoperability',
      href: '/insights/fhir-revolution-regional-healthcare-interoperability',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      date: '2026-02-10',
    },
    {
      id: 'hlth-insight-02',
      title: {
        en: 'Connected Care at Scale: Telemetry and AI for Chronic Disease Management',
        ar: 'الرعاية المتصلة واسعة النطاق: أجهزة التتبع والذكاء الاصطناعي لإدارة الأمراض المزمنة',
      },
      excerpt: {
        en: 'How ambient remote patient monitoring (RPM) and real-time vital telemetry cut emergency hospital readmissions by over 30%.',
        ar: 'كيف تسهم المتابعة الحيوية المنزلية عن بُعد وتدفق القراءات اللحظية في خفض مراجعات الطوارئ وتنويم الحالات المزمنة بأكثر من 30%.',
      },
      badge: {
        en: 'Telehealth & RPM',
        ar: 'الطب الاتصالي',
      },
      slug: 'connected-care-at-scale-chronic-disease',
      href: '/insights/connected-care-at-scale-chronic-disease',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      date: '2026-01-22',
    },
    {
      id: 'hlth-insight-03',
      title: {
        en: 'Sovereign Health Clouds: Navigating Medical Data Privacy in the GCC',
        ar: 'السحب الصحية السيادية: حماية خصوصية البيانات الطبية في دول الخليج',
      },
      excerpt: {
        en: 'A strategic blueprint for healthcare executives designing zero-trust cloud repositories that strictly comply with local Ministry of Health mandates.',
        ar: 'دليل استراتيجي لقيادات القطاع الصحي لتصميم مستودعات سحابية سيادية مطابقة تماماً لاشتراطات ولوائح وزارات الصحة المحلية.',
      },
      badge: {
        en: 'Health Sovereignty',
        ar: 'السيادة الصحية',
      },
      slug: 'sovereign-health-clouds-gcc-compliance',
      href: '/insights/sovereign-health-clouds-gcc-compliance',
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
      date: '2026-01-04',
    },
  ],

  clientReview: {
    quote: {
      en: 'Persici engineered our virtual clinic platform and FHIR hospital interoperability gateway. We scaled to over 150,000 monthly telemedicine consultations while ensuring complete medical record confidentiality and zero latency for our clinicians.',
      ar: 'طورت بيرسيكي منصة عياداتنا الافتراضية وبوابة الربط الصحي المعياري (FHIR) لمستشفياتنا. توسعنا لتقديم أكثر من 150,000 استشارة طبية عن بُعد شهرياً مع ضمان السرية التامة لسجلات المرضى وتوفير سرعة استجابة فائقة لأطبائنا.',
    },
    author: 'Dr. Tariq Al-Shammari',
    role: {
      en: 'Chief Medical Information Officer, Regional Healthcare System',
      ar: 'المدير التنفيذي للمعلوماتية الطبية، شبكة مستشفيات ومراكز رعاية صحية رائدة',
    },
    badge: {
      en: 'Verified Healthcare Client',
      ar: 'جهة صحية موثقة',
    },
  },

  faqsTitle: {
    en: 'Frequently Asked Questions: Healthcare Solutions',
    ar: 'الأسئلة الشائعة: حلول قطاع الرعاية الصحية',
  },
  faqsSubtitle: {
    en: 'Answers regarding medical data sovereignty, FHIR standards, telemedicine video encryption, and hospital EHR integration.',
    ar: 'إجابات وافية حول سيادة البيانات الطبية، ومعايير FHIR، وتشفير استشارات الطب الاتصالي، والربط مع أنظمة المستشفيات.',
  },
  faqs: [
    {
      question: {
        en: 'How do you ensure medical records and patient scans remain sovereign within local borders?',
        ar: 'كيف تضمنون بقاء السجلات الطبية وصور الأشعة داخل الحدود الوطنية للدولة؟',
      },
      answer: {
        en: 'We deploy exclusively on accredited in-country sovereign healthcare cloud instances or private on-premise hospital datacenters. All electronic Protected Health Information (ePHI) is encrypted at rest and in transit using hardware keys held exclusively by the medical institution.',
        ar: 'تستضاف أنظمتنا حصرياً في بيئات سحابية صحية محلية معتمدة داخل الدولة أو في مراكز البيانات الخاصة للمستشفى. تُشفر كافة السجلات الطبية الحساسة (ePHI) أثناء التخزين والنقل بمفاتيح أمان مادية تديرها المنشأة الطبية فقط.',
      },
    },
    {
      question: {
        en: 'What is FHIR, and how does it benefit our hospital network?',
        ar: 'ما هو معيار FHIR وما الفائدة التي يعود بها على شبكة مستشفياتنا؟',
      },
      answer: {
        en: 'FHIR (Fast Healthcare Interoperability Resources) is the global standard for exchanging healthcare data electronically. It enables different hospital information systems, lab devices, and patient mobile apps to seamlessly communicate using modern REST APIs, eliminating duplicate tests and medical record fragmentation.',
        ar: 'معيار FHIR هو المعيار العالمي الأحدث لتبادل البيانات الصحية إلكترونياً. يتيح للأنظمة الطبية المختلفة، ومختبرات التحاليل، وتطبيقات الجوال التحدث والتكامل معاً عبر واجهات REST برمجية حديثة، مما يقضي على تكرار الفحوصات وتشتت ملف المريض.',
      },
    },
    {
      question: {
        en: 'Can our physicians conduct video consultations on low-bandwidth patient mobile connections?',
        ar: 'هل يستطيع أطباؤنا إجراء استشارات مرئية حتى مع ضعف سرعة الإنترنت لدى المريض؟',
      },
      answer: {
        en: 'Yes. Our WebRTC media engine features dynamic adaptive bitrate transcoding that prioritizes crystal-clear audio even when network bandwidth drops below 150 kbps, automatically downgrading video resolution to maintain unbroken communication.',
        ar: 'نعم بكل تأكيد. يعتمد محرك البث لدينا على تقنية التعديل الديناميكي لجودة الفيديو والصوت (Adaptive Bitrate)، حيث يعطي الأولوية لصفاء ونقاء الصوت حتى مع انخفاض سرعة الشبكة لأقل من 150 كيلوبت/ثانية لضمان استمرار الاستشارة دون انقطاع.',
      },
    },
    {
      question: {
        en: 'Can the platform integrate with legacy hospital information systems like Epic, Cerner, or homegrown HIS?',
        ar: 'هل يمكن للمنصة التكامل مع أنظمة المستشفيات القديمة مثل Epic أو Cerner أو البرامج المحلية؟',
      },
      answer: {
        en: 'Yes. We build certified HL7 v2 and FHIR translation adapters that read and write patient admissions, vital signs, and discharge summaries directly from and to your existing HIS with zero disruption to daily clinic workflows.',
        ar: 'نعم. نبني موصلات معتمدة لبروتوكولات HL7 v2 و FHIR تقرأ وتحدث بيانات دخول المرضى، والعلامات الحيوية، والتقارير الطبية مباشرة في نظام المستشفى القائم دون أي تعطيل لسير العمل اليومي في العيادات.',
      },
    },
    {
      question: {
        en: 'How do you prevent diagnostic AI models from hallucinating in clinical environments?',
        ar: 'كيف تمنعون نماذج الذكاء الاصطناعي التشخيصي من تقديم معلومات غير دقيقة (Hallucinations)؟',
      },
      answer: {
        en: 'All clinical decision support algorithms operate within strict deterministic guardrails. AI models are trained exclusively as assistant augmentations — highlighting potential scan anomalies or calculating validated medical risk scores (like NEWS2 or SOFA) for the attending physician to verify and approve.',
        ar: 'تعمل كافة خوارزميات دعم القرار الطبي داخل ضوابط حتمية صارمة وموثقة. صُممت النماذج كمساعد استشاري فقط — حيث تحدد مناطق الاشتباه في صور الأشعة أو تحسب مؤشرات الخطر السريرية المعتمدة (مثل NEWS2) ليتولى الطبيب المعالج فحصها واعتمادها رسمياً.',
      },
    },
    {
      question: {
        en: 'What is the implementation timeline for a telehealth and patient portal platform?',
        ar: 'ما هو الإطار الزمني لتنفيذ منصة طب اتصالي وبوابة متكاملة للمرضى؟',
      },
      answer: {
        en: 'A production-grade, sovereign telehealth and patient portal rollout typically takes 10 to 14 weeks. This includes EHR database connector setup, bilingual mobile app deployment, video server configuration, and medical staff onboarding.',
        ar: 'يستغرق إطلاق منصة الطب الاتصالي وبوابة المرضى المتكاملة عادة ما بين 10 إلى 14 أسبوعاً. يشمل ذلك ربط قواعد بيانات السجلات الطبية، ونشر تطبيقات الجوال ثنائية اللغة، وضبط خوادم الفيديو المشفرة، وتدريب الكادر الطبي على المنظومة.',
      },
    },
  ],
};
