import type { LegalDocumentData } from '../types';

export const privacyPolicyData: LegalDocumentData = {
  documentType: 'privacy',
  title: {
    en: 'Privacy Policy & Sovereign Data Governance',
    ar: 'سياسة الخصوصية وحوكمة البيانات السيادية',
  },
  subtitle: {
    en: 'Comprehensive transparency regarding how Persici Agency collects, processes, protects, and governs enterprise client telemetry and personal data across our global and regional jurisdictions.',
    ar: 'شفافية شاملة حول كيفية قيام وكالة بيرسيكي بجمع ومعالجة وحماية وحوكمة بيانات العملاء المؤسسيين والبيانات الشخصية عبر نطاقاتنا القضائية العالمية والإقليمية.',
  },
  effectiveDate: {
    en: 'January 15, 2026',
    ar: '١٥ يناير ٢٠٢٦',
  },
  version: '2026.1 (Enterprise)',
  officerEmail: 'info@persiciagency.com',
  operatingEntities: [
    {
      region: 'United Arab Emirates (Dubai)',
      legalName: {
        en: 'Persici Agency FZ-LLC',
        ar: 'وكالة بيرسيكي ش.ذ.م.م - منطقة حرة',
      },
      address: {
        en: 'Dubai Internet City / Business Bay, Dubai, United Arab Emirates',
        ar: 'مدينة دبي للإنترنت / الخليج التجاري، دبي، الإمارات العربية المتحدة',
      },
      governingAuthority: {
        en: 'UAE Data Office & Federal Decree-Law No. 45/2021 (PDPL)',
        ar: 'مكتب الإمارات للبيانات والمرسوم بقانون اتحادي رقم 45 لسنة 2021',
      },
    },
    {
      region: 'Kingdom of Saudi Arabia (Riyadh)',
      legalName: {
        en: 'Persici Agency LLC',
        ar: 'شركة وكالة بيرسيكي لتقنية المعلومات',
      },
      address: {
        en: 'King Fahd Road, Al Olaya District, Riyadh, Kingdom of Saudi Arabia',
        ar: 'طريق الملك فهد، حي العليا، الرياض، المملكة العربية السعودية',
      },
      governingAuthority: {
        en: 'Saudi Data & AI Authority (SDAIA) & Royal Decree No. M/19 (PDPL)',
        ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا) والمرسوم الملكي رقم م/19',
      },
    },
    {
      region: 'Hashemite Kingdom of Jordan (Amman)',
      legalName: {
        en: 'Persici Digital Innovations Ltd.',
        ar: 'شركة بيرسيكي للابتكارات الرقمية ذ.م.م',
      },
      address: {
        en: 'King Hussein Business Park (KHBP), Amman, Jordan',
        ar: 'مجمع الملك حسين للأعمال، عمّان، المملكة الأردنية الهاشمية',
      },
      governingAuthority: {
        en: 'Ministry of Digital Economy and Entrepreneurship & Law No. 24/2023',
        ar: 'وزارة الاقتصاد الرقمي والريادة وقانون حماية البيانات الشخصية رقم 24 لسنة 2023',
      },
    },
  ],
  clauses: [
    {
      id: 'scope-and-entities',
      title: {
        en: '1. Corporate Scope & Operating Entities',
        ar: '١. النطاق المؤسسي والكيانات التشغيلية',
      },
      content: {
        en: [
          'This Privacy Policy governs the processing of personal and corporate data collected by Persici Agency, including its subsidiaries, regional branches, and affiliate entities ("Persici", "we", "us", or "our").',
          'Persici operates multi-disciplinary engineering, commerce acceleration, and brand consulting practices with registered regional entities in Dubai (United Arab Emirates), Riyadh (Kingdom of Saudi Arabia), and Amman (Jordan).',
          'Whether you are visiting our website, engaging our professional services, applying for open careers, or utilizing our proprietary technology platforms, your data is handled with rigorous cryptographic safeguards and sovereign legal accountability.',
        ],
        ar: [
          'تحكم سياسة الخصوصية هذه معالجة البيانات الشخصية والمؤسسية التي تجمعها وكالة بيرسيكي، بما في ذلك فروعها الإقليمية وشركاتها التابعة ("بيرسيكي"، "نحن"، أو "خاصتنا").',
          'تدير بيرسيكي ممارسات في الهندسة البرمجية المتقدمة، وتسريع التجارة الرقمية، والاستشارات الاستراتيجية من خلال كيانات مسجلة في دبي (الإمارات العربية المتحدة)، الرياض (المملكة العربية السعودية)، وعمّان (الأردن).',
          'سواء كنت تزور موقعنا الإلكتروني، أو تستفيد من خدماتنا المهنية، أو تتقدم للوظائف، أو تستخدم منصاتنا التقنية، يتم التعامل مع بياناتك وفق أعلى معايير التشفير والمسؤولية القانونية السيادية.',
        ],
      },
    },
    {
      id: 'applicable-legal-frameworks',
      title: {
        en: '2. Multi-Jurisdictional Legal Foundations',
        ar: '٢. الأطر القانونية متعددة النطاقات القضائية',
      },
      jurisdiction: 'global',
      content: {
        en: [
          'Persici aligns its data architecture with premier international privacy standards while strictly observing the sovereign statutory laws of each country in which our regional branches reside:',
        ],
        ar: [
          'توائم بيرسيكي بنيتها التحتية للبيانات مع أعلى المعايير الدولية للخصوصية، مع الالتزام التام بالقوانين السيادية لكل دولة يتواجد فيها فرع إقليمي لنا:',
        ],
      },
      subsections: [
        {
          subtitle: {
            en: 'International Standards (GDPR & Cross-Border Frameworks)',
            ar: 'المعايير الدولية (اللائحة العامة لحماية البيانات الأوروبية GDPR)',
          },
          points: {
            en: [
              'Compliance with Regulation (EU) 2016/679 (General Data Protection Regulation - GDPR) for individuals located in the European Economic Area.',
              'Adherence to California Consumer Privacy Act (CCPA/CPRA) standards regarding notice, non-discrimination, and opt-out transparency.',
              'Implementation of Standard Contractual Clauses (SCCs) governing international data transfers between entities and cloud providers.',
            ],
            ar: [
              'الامتثال للائحة الاتحاد الأوروبي 2016/679 (GDPR) لجميع الأفراد والمتعاملين في المنطقة الاقتصادية الأوروبية.',
              'الالتزام بمعايير قانون خصوصية المستهلك في كاليفورنيا (CCPA/CPRA) فيما يتعلق بالإخطار والشفافية وعدم التمييز.',
              'تطبيق البنود التعاقدية القياسية (SCCs) المعتمدة لنقل البيانات الدولي بين الكيانات ومزودي الخدمات السحابية.',
            ],
          },
        },
        {
          subtitle: {
            en: 'United Arab Emirates (UAE PDPL & Free Zone Frameworks)',
            ar: 'دولة الإمارات العربية المتحدة (قانون حماية البيانات الشخصية ولائحة المناطق الحرة)',
          },
          jurisdiction: 'uae',
          points: {
            en: [
              'Full compliance with UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection (PDPL) overseen by the UAE Data Office.',
              'Alignment with Dubai International Financial Centre (DIFC) Data Protection Law No. 5 of 2020 and Abu Dhabi Global Market (ADGM) regulations where enterprise contracts specify free-zone jurisdictions.',
              'Strict observance of UAE Federal Decree-Law No. 34 of 2021 on Combatting Rumors and Cybercrime.',
            ],
            ar: [
              'الامتثال الكامل للمرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية الخاضع لإشراف مكتب الإمارات للبيانات.',
              'التوافق مع قانون حماية البيانات لمركز دبي المالي العالمي (DIFC) رقم 5 لسنة 2020 ولائحة سوق أبوظبي العالمي (ADGM) عند إبرام عقود خاضعة لهذه المناطق.',
              'الالتزام الصارم بالمرسوم بقانون اتحادي رقم 34 لسنة 2021 في شأن مكافحة الشائعات والجرائم الإلكترونية.',
            ],
          },
        },
        {
          subtitle: {
            en: 'Kingdom of Saudi Arabia (Saudi PDPL & SDAIA Regulations)',
            ar: 'المملكة العربية السعودية (نظام حماية البيانات الشخصية ولوائح سدايا)',
          },
          jurisdiction: 'ksa',
          points: {
            en: [
              'Adherence to the Saudi Personal Data Protection Law (PDPL) enacted under Royal Decree No. M/19 dated 9/2/1443H, as amended by Royal Decree No. M/148 dated 5/9/1444H.',
              'Compliance with the Executive Regulations and Regulation on Personal Data Transfer outside the Kingdom issued by the Saudi Data and AI Authority (SDAIA).',
              'Alignment with National Cybersecurity Authority (NCA) Essential Cybersecurity Controls (ECC-1:2018) for enterprise cloud architectures.',
            ],
            ar: [
              'الالتزام بنظام حماية البيانات الشخصية الصادر بالمرسوم الملكي رقم (م/19) وتعديلاته بالمرسوم الملكي رقم (م/148).',
              'الامتثال للائحة التنفيذية ولائحة نقل البيانات الشخصية إلى خارج المملكة الصادرتين عن الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا).',
              'التوافق مع الضوابط الأساسية للأمن السيبراني (ECC-1:2018) الصادرة عن الهيئة الوطنية للأمن السيبراني.',
            ],
          },
        },
        {
          subtitle: {
            en: 'Hashemite Kingdom of Jordan (Jordanian Law No. 24 of 2023)',
            ar: 'المملكة الأردنية الهاشمية (قانون حماية البيانات الشخصية رقم 24 لسنة 2023)',
          },
          jurisdiction: 'jordan',
          points: {
            en: [
              'Full adherence to Jordanian Personal Data Protection Law No. 24 of 2023 enforced through the Ministry of Digital Economy and Entrepreneurship.',
              'Compliance with Jordanian Cybercrime Law No. 17 of 2023 and Electronic Transactions Law No. 15 of 2015.',
              'Commitment to statutory consent verification, data subject rights notices, and secure in-country data handling standards.',
            ],
            ar: [
              'الالتزام التام بأحكام قانون حماية البيانات الشخصية الأردني رقم 24 لسنة 2023 المنفذ بإشراف وزارة الاقتصاد الرقمي والريادة.',
              'الامتثال لقانون الجرائم الإلكترونية الأردني رقم 17 لسنة 2023 وقانون المعاملات الإلكترونية رقم 15 لسنة 2015.',
              'الالتزام بإجراءات التحقق من الموافقة المسبقة وإخطارات حقوق أصحاب البيانات ومعايير المعالجة الآمنة.',
            ],
          },
        },
      ],
    },
    {
      id: 'controller-and-processor-roles',
      title: {
        en: '3. Data Controller vs. Data Processor Roles',
        ar: '٣. أدوار المسؤول عن البيانات ومعالج البيانات',
      },
      content: {
        en: [
          'Under applicable data protection statutes, Persici acts in dual capacities depending on the context of the engagement:',
          '1. As a Data Controller: Persici acts as controller when determining the purposes and means of processing personal data regarding visitors to persiciagency.com, corporate clients contracting directly with our agency, and career applicants submitting resumes.',
          '2. As a Data Processor / Service Provider: When engineering custom software, eCommerce pipelines, or analytics integrations on behalf of our enterprise clients, Persici acts strictly as a data processor. In such capacities, we process end-user telemetry strictly in accordance with client instructions and executed Data Processing Agreements (DPAs).',
        ],
        ar: [
          'بموجب قوانين حماية البيانات المعمول بها، تعمل بيرسيكي بصفتين مختلفتين بحسب طبيعة التعامل:',
          '١. بصفتنا مسؤولاً عن البيانات (Data Controller): نحدد أغراض ووسائل معالجة البيانات الشخصية المتعلقة بزوار موقعنا، وممثلي العملاء المؤسسيين المتعاقدين معنا مباشرة، والمتقدمين للوظائف.',
          '٢. بصفتنا معالجاً للبيانات (Data Processor): عند بناء وتطوير منصات برمجية أو حلول تجارة إلكترونية لصالح عملائنا، نعمل حصرياً كمعالج بيانات بناءً على تعليمات العميل وبموجب اتفاقية معالجة بيانات رسمية (DPA).',
        ],
      },
    },
    {
      id: 'categories-of-data',
      title: {
        en: '4. Categories of Data Collected',
        ar: '٤. فئات البيانات التي نقوم بجمعها',
      },
      content: {
        en: [
          'We collect only the minimum personal data strictly necessary to fulfill our legitimate commercial, engineering, and contractual obligations:',
          '• Corporate & Communication Data: Full name, business email, phone number, company title, and enterprise project requirements submitted via inquiry and appointment forms.',
          '• Careers & Recruitment Data: Curriculum vitae (CV), portfolio links, employment history, and contact coordinates transmitted via our careers portal.',
          '• Technical & Telemetry Data: Anonymized IP addresses, browser specifications, language preferences, operating systems, and interaction telemetry collected via privacy-conscious analytics.',
          '• Client Engagement Artifacts: Invoicing credentials, VAT registration identifiers, and administrative communications necessary for contract execution.',
        ],
        ar: [
          'نقوم بجمع الحد الأدنى الضروري فقط من البيانات الشخصية اللازمة للوفاء بالتزاماتنا التعاقدية والهندسية والتجارية المشروعة:',
          '• بيانات التواصل المؤسسي: الاسم الكامل، البريد الإلكتروني المهني، رقم الهاتف، المسمى الوظيفي، وتفاصيل المشروع المقدمة عبر نماذج التواصل والمواعيد.',
          '• بيانات التوظيف: السيرة الذاتية (CV)، روابط المعارض المهنية، التاريخ الوظيفي، ومعلومات الاتصال المقدمة عبر بوابة التوظيف.',
          '• البيانات التقنية والقياس عن بعد: عناوين IP المجهلة، نوع المتصفح، تفضيلات اللغة، ونظام التشغيل المجمعة عبر أدوات تحليلية متوافقة مع الخصوصية.',
          '• بيانات العقود والفوترة: الأرقام الضريبية، بيانات السجل التجاري، والمعلومات الرسمية المطلوبة لإصدار الفواتير المعتمدة.',
        ],
      },
    },
    {
      id: 'lawful-basis-for-processing',
      title: {
        en: '5. Lawful Bases for Processing',
        ar: '٥. الأسس القانونية لمعالجة البيانات',
      },
      content: {
        en: [
          'Persici never processes personal data arbitrarily. Each processing activity is anchored to a recognized statutory justification:',
          '• Performance of a Contract: Processing necessary to deliver engineering deliverables, project statements of work, and ongoing technical support.',
          '• Explicit Consent: Where you have affirmatively opted into newsletters, discovery sessions, or candidate recruitment pipelines.',
          '• Compliance with Legal Obligations: Fulfilling corporate registry, anti-money laundering (AML), and tax audit mandates in the UAE, Saudi Arabia, and Jordan.',
          '• Legitimate Business Interests: Maintaining platform security, preventing distributed denial-of-service (DDoS) incidents, and optimizing website delivery.',
        ],
        ar: [
          'لا تقوم بيرسيكي بمعالجة أي بيانات شخصية دون مسوغ قانوني معتمد صراحة في التشريعات المعمول بها:',
          '• تنفيذ العقود: المعالجة الضرورية لتقديم الحلول البرمجية، وإنجاز نطاقات العمل، والدعم الفني المستمر.',
          '• الموافقة الصريحة: عند موافقتك المسبقة على الاشتراك في النشرات، أو جلسات الاستكشاف، أو التقدم للوظائف.',
          '• الامتثال للالتزامات القانونية: الوفاء بمتطلبات السجلات التجارية، واللوائح الضريبية ومكافحة غسل الأموال في الإمارات والسعودية والأردن.',
          '• المصالح المشروعة: تأمين البنية التحتية، ومنع الهجمات الإلكترونية، وتحسين سرعة استجابة الموقع.',
        ],
      },
    },
    {
      id: 'sovereign-storage-and-transfers',
      title: {
        en: '6. Sovereign Storage & Cross-Border Data Transfers',
        ar: '٦. التخزين السيادي ونقل البيانات عبر الحدود',
      },
      content: {
        en: [
          'Data residency and digital sovereignty are central pillars of Persici\'s architectural methodology.',
          '• Regional Cloud Regions: For enterprise and governmental clients in Saudi Arabia and the UAE, infrastructure is deployed within local sovereign cloud datacenters (e.g., AWS me-central-1 UAE, Google Cloud Dammam KSA, or Oracle Cloud Riyadh/Jeddah) in full accordance with SDAIA and TDRA localization mandates.',
          '• International Transfers: Where data is transmitted across borders for distributed team collaboration or global cloud infrastructure (e.g., Cloudflare R2, MongoDB Atlas), transfers are protected by Standard Contractual Clauses (SCCs), cryptographic encryption in transit (TLS 1.3), and zero-knowledge storage models.',
        ],
        ar: [
          'تعد سيادة البيانات ومكان تخزينها ركيزة جوهرية في منهجية بيرسيكي الهندسية والتنظيمية.',
          '• المراكز السحابية الإقليمية: لعملائنا في المملكة العربية السعودية ودولة الإمارات، يتم نشر الأنظمة داخل مراكز بيانات سحابية محلية سيادية (مثل AWS في الإمارات، وGoogle Cloud في الدمام، أو Oracle Cloud في الرياض) التزاماً بلوائح توطين البيانات الصادرة عن سدايا والهيئات المعنية.',
          '• نقل البيانات الدولي: في الحالات التي تتطلب نقل بيانات عبر الحدود لإدارة المشاريع أو البنية التحتية السحابية الموزعة، يتم ذلك بموجب بنود تعاقدية معتمدة وتشفير كامل أثناء النقل (TLS 1.3).',
        ],
      },
    },
    {
      id: 'data-subject-rights',
      title: {
        en: '7. Multi-Jurisdictional Data Subject Rights',
        ar: '٧. حقوق أصحاب البيانات في النطاقات القضائية',
      },
      content: {
        en: [
          'Regardless of your geographic location, Persici provides comprehensive mechanisms to exercise your statutory rights:',
          '• Right to Access & Portability: Request a structured, machine-readable copy of your personal data held in our systems.',
          '• Right to Rectification: Correct inaccurate, incomplete, or outdated personal details.',
          '• Right to Erasure / Destruction: Request the irrevocable deletion of personal information where retention is no longer mandated by law (GDPR Art. 17, Saudi PDPL Art. 24, UAE PDPL Art. 16, Jordan Law No. 24/2023 Art. 9).',
          '• Right to Restrict or Object: Cease processing for direct marketing or automated algorithmic profiling.',
          '• Right to Lodge Complaints: Contact relevant supervisory authorities, including the UAE Data Office, SDAIA in Saudi Arabia, or the Personal Data Protection Board in Jordan.',
        ],
        ar: [
          'بغض النظر عن موقعك الجغرافي، توفر بيرسيكي آليات واضحة لممارسة حقوقك النظامية كاملة:',
          '• حق الاطلاع والحصول على البيانات: طلب نسخة مقروءة آلياً من بياناتك الشخصية المسجلة لدينا.',
          '• حق التصحيح والتحديث: تعديل أي بيانات غير دقيقة أو غير مكتملة.',
          '• حق الإتلاف والمحو: طلب الحذف النهائي لبياناتك الشخصية متى انتفى الغرض من جمعها ولم يعد هناك مسوغ نظامي للاحتفاظ بها.',
          '• حق الاعتراض وتقييد المعالجة: طلب إيقاف المعالجة لأغراض التسويق المباشر أو التقييم الآلي.',
          '• حق تقديم الشكاوى: يحق لك تقديم شكوى رسمية إلى الجهة التنظيمية المختصة (سدايا في السعودية، مكتب الإمارات للبيانات، أو مجلس حماية البيانات في الأردن).',
        ],
      },
    },
    {
      id: 'security-and-cryptography',
      title: {
        en: '8. Cryptographic Security & Defense-in-Depth',
        ar: '٨. الأمان التشفيري والدفاع في العمق',
      },
      content: {
        en: [
          'Persici implements institutional-grade technical and organizational defenses designed to safeguard data integrity and confidentiality:',
          '• Encryption Standards: Advanced Encryption Standard (AES-256) for all databases and file storage at rest; Transport Layer Security (TLS 1.3) with perfect forward secrecy for all data in transit.',
          '• Access Controls: Zero-Trust network architecture, mandatory Multi-Factor Authentication (MFA), and Least Privilege role-based access controls (RBAC).',
          '• Audit Logs & Monitoring: Immutable, cryptographically verified system audit logs monitoring administrative access, configuration updates, and query telemetry.',
          '• Incident Response: A formally tested Computer Security Incident Response Plan (CSIRP) guaranteeing notification to regulatory bodies and affected parties within 72 hours of a confirmed breach.',
        ],
        ar: [
          'تطبق بيرسيكي منظومة دفاعية مؤسسية تشمل تدابير فنية وتنظيمية متقدمة لضمان سرية وسلامة البيانات:',
          '• معايير التشفير: تشفير قواعد البيانات والتخزين السحابي بمعيار AES-256، واستخدام بروتوكول TLS 1.3 لكافة البيانات أثناء النقل.',
          '• إدارة الوصول: بنية شبكية قائمة على انعدام الثقة (Zero-Trust)، ومصادقة متعددة العوامل (MFA)، ومبدأ الامتيازات الأقل (RBAC).',
          '• سجلات المراجعة والمراقبة: سجلات تدقيق غير قابلة للتعديل ترصد العمليات الإدارية وسجلات الاستعلام الأمنية على مدار الساعة.',
          '• الاستجابة للحوادث: خطة استجابة للحوادث السيبرانية تتضمن إخطار الجهات التنظيمية وأصحاب الشأن خلال 72 ساعة في حال وقوع أي حادث مؤكد.',
        ],
      },
    },
    {
      id: 'cookie-policy',
      title: {
        en: '9. Cookie Governance & Analytics Telemetry',
        ar: '٩. حوكمة ملفات تعريف الارتباط (الكوكيز)',
      },
      content: {
        en: [
          'Our platform employs minimal cookies to guarantee stability, security, and responsive language delivery:',
          '• Strictly Necessary Cookies: Essential for secure navigation, CSRF protection, session management, and language routing (Arabic / English).',
          '• Performance & Analytical Telemetry: Aggregated, IP-anonymized metrics that assist us in detecting broken routes and optimizing page render speeds.',
          '• No Invasive Third-Party Trackers: Persici does not sell, rent, or trade user tracking data to third-party data brokers or behavioral advertising exchanges.',
        ],
        ar: [
          'يستخدم موقعنا الحد الأدنى من ملفات تعريف الارتباط لضمان الأمان اللحظي وتوجيه اللغة المناسبة:',
          '• ملفات تعريف الارتباط الأساسية: ضرورية لسلامة التصفح، والحماية من ثغرات CSRF، وحفظ خيار اللغة (العربية / الإنجليزية).',
          '• قياسات الأداء المجهلة: بيانات إحصائية مجمعة خالية من الهوية الشخصية تساعدنا في مراقبة سرعة التصفح وتحسين تجربة المستخدم.',
          '• لا نبيع أو نشارك بيانات التتبع: لا تقوم بيرسيكي ببيع أو تأجير أي بيانات تتبع لوسطاء البيانات أو شبكات الإعلانات السلوكية.',
        ],
      },
    },
    {
      id: 'contact-and-dpo',
      title: {
        en: '10. Data Protection Officer & Contact Coordinates',
        ar: '١٠. مسؤول حماية البيانات ومعلومات الاتصال الرسمية',
      },
      content: {
        en: [
          'To submit inquiries regarding our privacy practices, execute data subject access requests, or report potential vulnerabilities, contact our Data Governance Officer:',
          '• Central Privacy & Legal Email: info@persiciagency.com',
          '• Escalation Response Window: All verified statutory requests are acknowledged within 48 hours and fulfilled within 30 calendar days (or statutory timelines under Saudi PDPL, UAE PDPL, or GDPR).',
        ],
        ar: [
          'لتقديم أي استفسارات تتعلق بسياسة الخصوصية، أو ممارسة حقوقك في الوصول للبيانات أو تصحيحها، يرجى التواصل مع مسؤول حوكمة البيانات:',
          '• البريد الإلكتروني المركزي للشؤون القانونية والخصوصية: info@persiciagency.com',
          '• مدة الاستجابة النظامية: يتم تأكيد استلام الطلبات النظامية خلال 48 ساعة والبت فيها خلال 30 يوماً كحد أقصى وفق القوانين المعمول بها.',
        ],
      },
    },
  ],
};
