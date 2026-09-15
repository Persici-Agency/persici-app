import type { LegalDocumentData } from '../types';

export const termsOfServiceData: LegalDocumentData = {
  documentType: 'terms',
  title: {
    en: 'Terms of Service & Commercial Engagement Agreement',
    ar: 'شروط الخدمة واتفاقية التعامل التجاري المؤسسي',
  },
  subtitle: {
    en: 'Standard commercial conditions, intellectual property frameworks, multi-jurisdiction compliance mandates, and professional terms governing client collaborations with Persici Agency.',
    ar: 'الشروط التجارية العامة، وأطر الملكية الفكرية، والالتزامات النظامية متعددة النطاقات القضائية، والقواعد الحاكمة لتعاملات العملاء مع وكالة بيرسيكي.',
  },
  effectiveDate: {
    en: 'January 15, 2026',
    ar: '١٥ يناير ٢٠٢٦',
  },
  version: '2026.1 (Commercial)',
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
        en: 'UAE Commercial Transactions Law & DIFC / UAE Courts',
        ar: 'قانون المعاملات التجارية الإماراتي ومحاكم دبي / مركز دبي المالي العالمي',
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
        en: 'Saudi Commercial Law, E-Commerce Law (M/126) & SCCA / Saudi Commercial Courts',
        ar: 'نظام التجارة والمحاكم التجارية السعودية والمركز السعودي للتحكيم التجاري',
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
        en: 'Jordanian Commercial Code & Amman Commercial Courts',
        ar: 'قانون التجارة الأردني ومحاكم عمّان التجارية',
      },
    },
  ],
  clauses: [
    {
      id: 'acceptance-and-scope',
      title: {
        en: '1. Acceptance of Terms & Commercial Scope',
        ar: '١. قبول الشروط ونطاق التعامل التجاري',
      },
      content: {
        en: [
          'These Terms of Service ("Terms") constitute a legally binding agreement between Persici Agency ("Persici", "we", "us", or "our") and any organization, enterprise, or individual ("Client", "you", or "your") accessing our platforms or executing professional service contracts.',
          'By executing a Statement of Work (SOW), retaining our consulting pods, or accessing our digital environments, you acknowledge that you have read, understood, and agreed to be bound by these Terms and our companion Privacy Policy.',
        ],
        ar: [
          'تشكل شروط الخدمة هذه ("الشروط") اتفاقية ملزمة قانوناً بين وكالة بيرسيكي ("بيرسيكي"، "نحن"، أو "خاصتنا") وأي مؤسسة أو شركة أو فرد ("العميل" أو "أنتم") يدخل إلى منصاتنا أو يتعاقد على خدماتنا المهنية.',
          'من خلال توقيع نطاق عمل (SOW)، أو الاستعانة بفرقنا الاستشارية، أو استخدام بيئاتنا الرقمية، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام الكامل بهذه الشروط وبسياسة الخصوصية المعتمدة لدينا.',
        ],
      },
    },
    {
      id: 'agency-services-and-sows',
      title: {
        en: '2. Services, Agile Pods & Statements of Work',
        ar: '٢. نطاقات العمل وفرق التنفيذ الرشيقة',
      },
      content: {
        en: [
          'Persici delivers high-caliber services across eCommerce acceleration, full-funnel digital marketing, custom cloud engineering, UX/UI design systems, and enterprise data architectures.',
          'Each client engagement is governed by an executed Statement of Work (SOW) specifying milestones, deliverables, timelines, acceptance criteria, and financial terms. In the event of any conflict between these general Terms and an executed SOW, the specific provisions of the SOW shall supersede solely for that project scope.',
          'Project timelines are collaborative and depend on prompt client feedback, access to required APIs and credentials, and formal milestone sign-offs.',
        ],
        ar: [
          'تقدم بيرسيكي خدمات تقنية واستراتيجية متقدمة في تسريع التجارة الإلكترونية، والتسويق الرقمي الشامل، والهندسة السحابية، وتصميم النظم الرقمية (UX/UI)، وحوكمة البيانات المؤسسية.',
          'تخضع كل شراكة لنطاق عمل معتمد (SOW) يحدد بدقة المعالم الرئيسية، والمخرجات، والجداول الزمنية، ومعايير القبول، والالتزامات المالية. وفي حال وجود أي تعارض، تسري الشروط الخاصة المنصوص عليها في نطاق العمل المعني.',
          'تعتمد المواعيد الزمنية للتسليم على التعاون المشترك، والاعتماد السريع للمراحل، وتزويد فرقنا بالصلاحيات والواجهات البرمجية (APIs) اللازمة.',
        ],
      },
    },
    {
      id: 'intellectual-property',
      title: {
        en: '3. Intellectual Property Rights & Ownership',
        ar: '٣. حقوق الملكية الفكرية وملكية المخرجات',
      },
      content: {
        en: [
          '• Client Deliverables: Upon receipt of full and final payment for the applicable project milestone, all bespoke source code, creative assets, designs, and content produced specifically for the Client shall vest in the Client as proprietary intellectual property.',
          '• Agency Background IP: Persici retains exclusive ownership over all pre-existing software frameworks, developer toolkits, reusable UI component libraries, algorithms, and know-how developed independently of the client engagement. Persici grants the Client a perpetual, non-exclusive, worldwide, royalty-free license to use such Background IP solely as integrated within the delivered system.',
          '• Client Materials: The Client guarantees that all trademarks, brand collateral, and data supplied to Persici for project execution are owned by or properly licensed to the Client without infringing third-party rights.',
        ],
        ar: [
          '• مخرجات العميل: فور استلام السداد الكامل والنهائي لمستحقات كل مرحلة تعاقدية، تنتقل ملكية الأكواد البرمجية المخصصة والتصاميم والمحتوى المنفذ خصيصاً للعميل لتصبح ملكية فكرية حصرية له.',
          '• الملكية الفكرية المسبقة للوكالة (Background IP): تحتفظ بيرسيكي بملكيتها الحصرية للمكتبات البرمجية، والمكونات المسبقة، والخوارزميات، والأدوات المطورة بشكل مستقل عن المشروع. وتمنح العميل ترخيصاً دائماً وغير حصري وعالمياً لاستخدامها كجزء مدمج في النظام المسلم.',
          '• مواد وبيانات العميل: يضمن العميل ملكيته الكاملة أو امتلاكه التراخيص النظامية لكافة العلامات التجارية والبيانات والمواد التي يزود بها بيرسيكي لتنفيذ المشروع.',
        ],
      },
    },
    {
      id: 'multi-jurisdictional-compliance',
      title: {
        en: '4. Sovereign Multi-Jurisdictional Regulatory Compliance',
        ar: '٤. الامتثال النظامي في النطاقات القضائية الإقليمية',
      },
      content: {
        en: [
          'Client collaborations are executed in full alignment with the statutory laws of each branch territory:',
        ],
        ar: [
          'تدار جميع المشروعات والتعاقدات في توافق تام مع الأنظمة والتشريعات المعمول بها في مقرات فروعنا:',
        ],
      },
      subsections: [
        {
          subtitle: {
            en: 'United Arab Emirates (Dubai Branch Collaborations)',
            ar: 'دولة الإمارات العربية المتحدة (تعاقدات فرع دبي)',
          },
          jurisdiction: 'uae',
          points: {
            en: [
              'Compliance with UAE Federal Law No. 15 of 2020 on Consumer Protection and UAE Federal Decree-Law No. 46 of 2021 on Electronic Transactions and Trust Services.',
              'Adherence to UAE Central Bank standards for digital payment gateway integrations and PCI-DSS Level 1 specifications.',
              'Registration under the UAE Federal Tax Authority (FTA) with mandatory 5% Value Added Tax (VAT) invoice issuance.',
            ],
            ar: [
              'الالتزام بالقانون الاتحادي رقم 15 لسنة 2020 بشأن حماية المستهلك والمرسوم بقانون اتحادي رقم 46 لسنة 2021 بشأن المعاملات الإلكترونية وخدمات الثقة.',
              'الامتثال لمعايير مصرف الإمارات المركزي لبوابات الدفع الإلكتروني وتوافق معايير أمان بطاقات الدفع PCI-DSS.',
              'التسجيل لدى الهيئة الاتحادية للضرائب (FTA) وإصدار فواتير ضريبية نظامية بنسبة ضريبة القيمة المضافة 5%.',
            ],
          },
        },
        {
          subtitle: {
            en: 'Kingdom of Saudi Arabia (Riyadh Branch Collaborations)',
            ar: 'المملكة العربية السعودية (تعاقدات فرع الرياض)',
          },
          jurisdiction: 'ksa',
          points: {
            en: [
              'Strict observance of the Saudi E-Commerce Law (Royal Decree No. M/126 of 1440H) and Electronic Transactions Law (Royal Decree No. M/18 of 1428H).',
              'Full compliance with Zakat, Tax and Customs Authority (ZATCA) regulations, including 15% VAT and Phase 2 E-Invoicing (FATOORA clearance & reporting integration).',
              'Sovereign cloud hosting alignment with National Cybersecurity Authority (NCA) Essential Controls for enterprise systems.',
            ],
            ar: [
              'الالتزام بنظام التجارة الإلكترونية السعودي (المرسوم الملكي م/126) ونظام التعاملات الإلكترونية (المرسوم الملكي م/18).',
              'الامتثال الكامل لمتطلبات هيئة الزكاة والضريبة والجمارك (ZATCA)، بما يشمل ضريبة القيمة المضافة 15% ومنظومة الفوترة الإلكترونية المرحلة الثانية (فاتورة).',
              'الالتزام بضوابط الهيئة الوطنية للأمن السيبراني (NCA) لاستضافة الأنظمة السحابية داخل مراكز بيانات المملكة.',
            ],
          },
        },
        {
          subtitle: {
            en: 'Hashemite Kingdom of Jordan (Amman Branch Collaborations)',
            ar: 'المملكة الأردنية الهاشمية (تعاقدات فرع عمّان)',
          },
          jurisdiction: 'jordan',
          points: {
            en: [
              'Adherence to Jordanian Electronic Transactions Law No. 15 of 2015 and Cybercrime Law No. 17 of 2023.',
              'Compliance with the Ministry of Industry, Trade and Supply and the Income and Sales Tax Department (ISTD) regulations.',
              'Enforcement of fair trade, consumer rights, and statutory software warranty standards.',
            ],
            ar: [
              'الالتزام بقانون المعاملات الإلكترونية الأردني رقم 15 لسنة 2015 وقانون الجرائم الإلكترونية رقم 17 لسنة 2023.',
              'الامتثال لتعليمات وزارة الصناعة والتجارة ودائرة ضريبة الدخل والمبيعات الأردنية.',
              'تطبيق معايير حماية المستهلك التجاري وضمانات جودة البرمجيات المعتمدة رسمياً.',
            ],
          },
        },
      ],
    },
    {
      id: 'financial-terms-and-vat',
      title: {
        en: '5. Fees, Invoicing, Taxes & VAT Compliance',
        ar: '٥. الأتعاب، الفوترة، والالتزامات الضريبية',
      },
      content: {
        en: [
          '• Payment Schedules: Professional fees are invoiced pursuant to milestone schedules outlined in the applicable SOW. Standard enterprise payment terms are Net 15 or Net 30 from the tax invoice date.',
          '• Multi-Country Tax Invoicing: Invoices are rendered in the designated currency (AED, SAR, JOD, or USD) and incorporate all applicable statutory taxes: UAE VAT (5%), Saudi VAT (15% ZATCA-compliant QR cryptographic stamps), or Jordanian General Sales Tax.',
          '• Late Settlements: Outstanding sums beyond thirty (30) days from due date may result in a temporary suspension of staging deployments, production rollouts, and engineering sprint allocations until accounts are normalized.',
        ],
        ar: [
          '• جداول الدفعات: يتم إصدار فواتير الأتعاب المهنية وفق جداول الإنجاز المحددة في نطاق العمل. ومدة السداد المعتمدة هي 15 أو 30 يوماً من تاريخ الفاتورة الضريبية.',
          '• الفوترة الضريبية متعددة الدول: تصدر الفواتير بالعملة المتفق عليها (درهم إماراتي، ريال سعودي، دينار أردني، أو دولار أمريكي) وتشمل الضرائب السيادية المعتمدة: ضريبة القيمة المضافة الإماراتية (5%)، أو السعودية (15% بختم QR التشفيري لمنظومة فاتورة)، أو ضريبة المبيعات الأردنية.',
          '• تأخر السداد: يحق للوكالة تعليق النشر على البيئات التجريبية أو إيقاف مهام التطوير في حال تأخر السداد لأكثر من 30 يوماً حتى تتم تسوية المستحقات.',
        ],
      },
    },
    {
      id: 'warranties-and-service-levels',
      title: {
        en: '6. Quality Standards, SLAs & Warranties',
        ar: '٦. معايير الجودة، مستويات الخدمة (SLA)، والضمان البرمجي',
      },
      content: {
        en: [
          '• Professional Standard of Care: Persici warrants that all digital engineering, UX design, and consulting deliverables will be executed in a professional, workmanlike manner adhering to current modern software best practices.',
          '• Warranty Period: Unless otherwise specified in the SOW, bespoke custom code delivered by Persici includes a thirty (30) day warranty post-deployment covering critical bug fixes and defect rectification arising from our implementation.',
          '• Third-Party Infrastructure Exclusions: Persici is not liable for performance degradation, outages, or API deprecations attributable to third-party services (e.g., Cloudflare, Shopify, Google, Meta, or payment gateways).',
        ],
        ar: [
          '• العناية المهنية الواجبة: تضمن بيرسيكي تنفيذ كافة المخرجات البرمجية والتصميمية بأعلى معايير الحرفية ومطابقة أفضل ممارسات هندسة البرمجيات الحديثة.',
          '• فترة الضمان البرمجي: ما لم ينص نطاق العمل على خلاف ذلك، تتضمن الأنظمة المطورة ضماناً لمدة ثلاثين (30) يوماً بعد الإطلاق لمعالجة أي أخطاء برمجية أو عيوب ناشئة عن الكود المنفذ من قبلنا.',
          '• استثناءات الطرف الثالث: لا تتحمل بيرسيكي مسؤولية انقطاع أو تغيير بروتوكولات واجهات الطرف الثالث السحابية مثل Shopify أو Google أو Meta أو بوابات الدفع الإلكتروني.',
        ],
      },
    },
    {
      id: 'confidentiality-and-nda',
      title: {
        en: '7. Enterprise Confidentiality & Non-Disclosure',
        ar: '٧. السرية المؤسسية وحماية الأسرار التجارية',
      },
      content: {
        en: [
          'Both parties agree to hold in strict confidence all proprietary, financial, technical, and strategic data disclosed during the collaboration.',
          'Confidential Information shall not be disclosed to any third party without prior written consent, except to employees, subcontractors, and legal advisors bound by confidentiality restrictions at least as stringent as those contained herein.',
          'Confidentiality obligations survive the termination or expiration of this Agreement for a minimum duration of three (3) years.',
        ],
        ar: [
          'يلتزم الطرفان بالحفاظ التام على سرية كافة المعلومات المالية والتقنية والاستراتيجية والأسرار التجارية المتبادلة أثناء الشراكة.',
          'لا يجوز إفشاء المعلومات السرية لأي طرف ثالث دون موافقة كتابية مسبقة، باستثناء المستشارين والمطورين الملزمين باتفاقيات سرية مماثلة.',
          'تظل التزامات السرية سارية المفعول بعد انتهاء التعاقد لمدة لا تقل عن ثلاث (3) سنوات.',
        ],
      },
    },
    {
      id: 'limitation-of-liability',
      title: {
        en: '8. Limitation of Liability & Mutual Indemnification',
        ar: '٨. حدود المسؤولية والتعويض المتبادل',
      },
      content: {
        en: [
          'To the maximum extent permitted by applicable sovereign law:',
          '• Neither party shall be liable for indirect, incidental, consequential, special, or punitive damages, including loss of profits, data, revenue, or business reputation, regardless of whether advised of such possibilities.',
          '• The total aggregate liability of Persici arising out of or related to any project engagement shall be strictly capped at the total amount actually paid by the Client to Persici under the specific Statement of Work during the six (6) month period immediately preceding the event giving rise to liability.',
        ],
        ar: [
          'إلى أقصى حد تسمح به الأنظمة والقوانين المعمول بها:',
          '• لا يتحمل أي من الطرفين مسؤولية أي أضرار غير مباشرة أو تبعية أو خاصة، بما في ذلك خسارة الأرباح أو توقف الأعمال أو فقدان البيانات أو السمعة التجارية.',
          '• تنحصر المسؤولية المالية الإجمالية القصوى لبيرسيكي عن أي مطالبة ناشئة عن نطاق العمل في حدود إجمالي المبالغ المسددة فعلياً من العميل بموجب ذلك النطاق خلال الستة (6) أشهر السابقة لوقوع الحدث.',
        ],
      },
    },
    {
      id: 'governing-law-and-dispute-resolution',
      title: {
        en: '9. Dispute Resolution & Sovereign Governing Law',
        ar: '٩. تسوية النزاعات والقانون الحاكم',
      },
      content: {
        en: [
          'The governing law and forum for resolution of disputes shall correspond to the contracting Persici entity designated in the applicable SOW:',
          '• UAE Contracting Entity: Governed by the laws of Dubai and the UAE. Any unresolved dispute shall be submitted to the Dubai International Arbitration Centre (DIAC) or the exclusive jurisdiction of the Dubai Courts (or DIFC Courts where specified in the SOW).',
          '• Saudi Arabia Contracting Entity: Governed by the laws of the Kingdom of Saudi Arabia. Disputes shall be resolved amicably, failing which they shall be adjudicated before the Saudi Commercial Courts in Riyadh or submitted to the Saudi Center for Commercial Arbitration (SCCA).',
          '• Jordan Contracting Entity: Governed by the statutory laws of the Hashemite Kingdom of Jordan and subject to the exclusive jurisdiction of the Amman Commercial Courts.',
        ],
        ar: [
          'يتحدد القانون الحاكم والجهة القضائية المختصة بالنزاعات وفق الكيان التعاقدي لبيرسيكي المحدد في نطاق العمل (SOW):',
          '• التعاقد مع الكيان الإماراتي: يخضع لقوانين إمارة دبي والقوانين الاتحادية للإمارات. وتختص بالنظر في النزاعات محاكم دبي (أو محاكم مركز دبي المالي العالمي DIFC) أو مركز دبي للتحكيم الدولي (DIAC).',
          '• التعاقد مع الكيان السعودي: يخضع لأنظمة المملكة العربية السعودية المعمول بها. ويفصل في النزاعات أمام المحاكم التجارية بالرياض أو عبر المركز السعودي للتحكيم التجاري (SCCA).',
          '• التعاقد مع الكيان الأردني: يخضع لأحكام القوانين النافذة في المملكة الأردنية الهاشمية ويكون الاختصاص القضائي لمحاكم عمّان التجارية.',
        ],
      },
    },
    {
      id: 'termination-and-notices',
      title: {
        en: '10. Termination, Handover & Official Notices',
        ar: '١٠. إنهاء التعاقد، التسليم النهائي، والإخطارات الرسمية',
      },
      content: {
        en: [
          '• Termination for Cause: Either party may terminate an engagement immediately upon written notice if the other party breaches a material provision and fails to cure within thirty (30) calendar days.',
          '• Work-in-Progress Handover: Upon termination, Persici shall deliver all completed and paid deliverables, along with reasonably required repository access and documentation.',
          '• Official Inquiries: Formal legal notices under these Terms must be dispatched in writing to our central legal desk:',
          'Email: info@persiciagency.com',
        ],
        ar: [
          '• الإنهاء للإخلال الجوهري: يحق لأي من الطرفين إنهاء التعاقد فوراً بإخطار كتابي إذا أخل الطرف الآخر بالتزام جوهري ولم يقم بتصحيحه خلال ثلاثين (30) يوماً من تاريخ الإخطار.',
          '• تسليم الأعمال المنجزة: عند الإنهاء، تسلم بيرسيكي كافة المخرجات المعتمدة والمدفوعة بالكامل مع بيانات الوصول للمستودعات البرمجية والتوثيق اللازم.',
          '• الإخطارات الرسمية: توجه كافة الإخطارات القانونية والمراسلات الرسمية كتابة إلى البريد المعتمد:',
          'البريد الإلكتروني: info@persiciagency.com',
        ],
      },
    },
  ],
};
