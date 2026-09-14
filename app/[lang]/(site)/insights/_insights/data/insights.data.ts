import type { InsightDetail } from '../types';

export const insightsData: InsightDetail[] = [
  {
    id: 'can-gen-ai-help-agile-teams-improve-delivery-clarity',
    slug: 'can-gen-ai-help-agile-teams-improve-delivery-clarity',
    categorySlug: 'article',
    category: {
      en: 'Article',
      ar: 'مقال',
    },
    title: {
      en: 'Can Gen AI Help Agile Teams Improve Delivery Clarity?',
      ar: 'هل يمكن للذكاء الاصطناعي التوليدي مساعدة فرق أجايل في تعزيز وضوح التسليم؟',
    },
    subtitle: {
      en: 'One internal agile team member has experimented with internal frameworks and human-centric workflows to improve the quality of delivery metrics.',
      ar: 'تجربة عملية واقعية حول استخدام أطر العمل وسير العمل المتمحور حول الإنسان لتحسين جودة مقاييس التسليم ومواءمة الفرق البرمجية.',
    },
    excerpt: {
      en: 'Exploring how generative AI bridges delivery ambiguity, turns noisy backlog updates into actionable sprint signals, and empowers engineering leaders.',
      ar: 'استكشاف كيف يسهم الذكاء الاصطناعي التوليدي في إزالة الغموض وتحويل تحديثات المهام غير المنتظمة إلى إشارات دقيقة تخدم قادة الهندسة البرمجية.',
    },
    readTime: '10 min read',
    date: 'June 21, 2024',
    coverImage: '/images/insights/data-into-value-office.jpg',
    featured: true,
    aiOverview: {
      summary: {
        en: 'This article analyzes how integrating localized generative AI copilots into agile delivery cycles removes cognitive overhead, turning messy pull requests and user stories into unambiguous acceptance criteria while preventing mid-sprint scope creep by 64%.',
        ar: 'يستعرض هذا المقال كيف يسهم دمج المساعدات الذكية في دورات تسليم أجايل في القضاء على الإجهاد الذهني، وتحويل متطلبات المهام غير الواضحة إلى معايير قبول دقيقة، مما خفض تضخم نطاق العمل بنسبة 64% في التجارب التطبيقية.',
      },
      keyTakeaways: [
        {
          en: 'Synthesizing Ambiguity: LLMs excel at converting unstructured stakeholder transcripts into strict Given-When-Then specifications.',
          ar: 'توضيح الغموض: تتفوق النماذج اللغوية في تحويل نصوص الاجتماعات غير المنظمة إلى معايير قبول برمجية محكمة.',
        },
        {
          en: 'Predictive Risk Radar: Cross-repository semantic analysis surfaces architectural deadlocks days before scheduled sprint reviews.',
          ar: 'رادار استشراف المخاطر: التحليل الدلالي لمستودعات الشيفرات يكشف التعارضات المعمارية قبل أيام من مواعيد المراجعة.',
        },
        {
          en: 'Human-in-the-Loop Governance: AI serves as a collaborative drafting layer—every production commit requires verified engineer sign-off.',
          ar: 'الحوكمة الإنسانية المحكمة: يعمل الذكاء الاصطناعي كمسودة تعاونية فقط، مع اشتراط الاعتماد البشري المباشر لكل سطر برمجي.',
        },
      ],
    },
    author: {
      name: 'Sarah Chen',
      role: {
        en: 'Strategic Agile Specialist & AI Delivery Lead',
        ar: 'أخصائية استراتيجيات أجايل وقائدة تسليم الذكاء الاصطناعي',
      },
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'delivery-problem-to-ai',
        title: {
          en: 'How did a delivery problem lead me to AI?',
          ar: 'كيف قادتني مشكلة في التسليم إلى الذكاء الاصطناعي؟',
        },
      },
      {
        id: 'dashboards-improve-conversations',
        title: {
          en: 'How can dashboards improve delivery conversations?',
          ar: 'كيف يمكن للوحات المعلومات تحسين حوارات التسليم؟',
        },
      },
      {
        id: 'where-gen-ai-helps',
        title: {
          en: 'Where can gen AI help agile delivery teams?',
          ar: 'أين يمكن للذكاء الاصطناعي التوليدي مساعدة فِرق أجايل؟',
        },
      },
      {
        id: 'testing-gen-ai-on-epic',
        title: {
          en: 'What happened when we tested gen AI on one epic',
          ar: 'ماذا حدث عندما اختبرنا الذكاء الاصطناعي على ملحمة برمجية واحدة؟',
        },
      },
      {
        id: 'experiment-with-ai-responsibly',
        title: {
          en: 'What helps employees experiment with AI responsibly?',
          ar: 'ما الذي يُمكّن الموظفين من تجربة الذكاء الاصطناعي بمسؤولية؟',
        },
      },
      {
        id: 'learning-about-ai',
        title: {
          en: 'How can professionals begin learning about AI?',
          ar: 'كيف يمكن للمهنيين البدء في تعلّم الذكاء الاصطناعي؟',
        },
      },
    ],
    sections: [
      {
        id: 'delivery-problem-to-ai',
        heading: {
          en: 'How did a delivery problem lead me to AI?',
          ar: 'كيف قادتني مشكلة في التسليم إلى الذكاء الاصطناعي؟',
        },
        paragraphs: {
          en: [
            'For years, managing cross-functional delivery meant reconciling discrepancies between what engineers committed to and what stakeholders actually understood. Burndown charts gave a mathematical illusion of progress, but qualitative roadblocks—like ambiguous acceptance criteria or subtle architectural debt—remained concealed until sprint reviews.',
            'As an agile lead steering multiple software squads, I observed that delivery friction rarely stemmed from lack of engineering talent. Instead, it was an information synthesis bottleneck: developers spent hours writing commit messages, Jira updates, and status reports that leadership seldom had time to digest in context.',
            'I turned to generative AI not to replace human conversations, but to extract clarity from ambient operational artifacts. By fine-tuning localized context models on user stories and commit histories, we could uncover latent blockers days before they materialized on delivery dashboards.',
          ],
          ar: [
            'لسنوات طويلة، عنت إدارة التسليم المشترك بين الفرق المختلفة محاولة ردم الفجوة بين ما التزم به المهندسون وما استوعبه أصحاب المصلحة. كانت مخططات الإنجاز تعطي انطباعاً رقمياً زائفاً بالتقدم، بينما ظلت العوائق النوعية - مثل معايير القبول الغامضة والديون المعمارية الخفية - محجوبة حتى مراجعات السبرنت.',
            'بصفتي قائدة لفرق أجايل متعددة، لاحظت أن بطء التسليم لم يكن ناتجاً عن نقص الكفاءة الهندسية. بل كان عنق الزجاجة يكمن في تلخيص واستيعاب المعلومات؛ حيث أمضى المطورون ساعات في كتابة التحديثات وسجلات المهام التي نادراً ما امتلكت الإدارة وقتاً لقراءتها وفهم سياقها الحقيقي.',
            'لجأت إلى الذكاء الاصطناعي التوليدي ليس لاستبدال الحوارات الإنسانية، بل لاستخلاص الوضوح من الركام الرقمي اليومي. ومن خلال تدريب نماذج سياقية مخصصة على قصص المستخدم وسجلات الشيفرات، تمكنا من رصد المعوقات الكامنة قبل أيام من ظهورها على لوحات المتابعة.',
          ],
        },
        callout: {
          en: 'Generative AI acts as an objective cognitive synthesis layer: it does not judge team velocity; it illuminates narrative blindspots before they turn into delivery delays.',
          ar: 'يعمل الذكاء الاصطناعي التوليدي كطبقة تركيب معرفية موضوعية: فهو لا يحكم على سرعة الفريق، بل يسلط الضوء على النقاط العمياء قبل أن تتحول إلى تأخيرات في التسليم.',
        },
      },
      {
        id: 'dashboards-improve-conversations',
        heading: {
          en: 'How can dashboards improve delivery conversations?',
          ar: 'كيف يمكن للوحات المعلومات تحسين حوارات التسليم؟',
        },
        paragraphs: {
          en: [
            'Traditional delivery dashboards are retrospective by nature. They communicate what went wrong last sprint, but offer little assistance in forecasting where the current release might fracture. When teams gather around static graphs, discussions frequently devolve into debates over metric definitions rather than root-cause remediation.',
            'By introducing real-time natural language synthesis into our Jira and GitHub telemetry, we transformed passive dashboards into conversational decision-support surfaces. Instead of staring at an orange burndown line, product owners can now ask: "Which dependencies are at risk if Epic B slips by two days?" and receive an instant dependency graph accompanied by risk narratives.',
            'This shift from reactive telemetry to anticipatory reasoning elevated our daily standups from status interrogations into strategic problem-solving workshops.',
          ],
          ar: [
            'تتسم لوحات المعلومات التقليدية بكونها بأثر رجعي بطبيعتها؛ فهي توضح ما حدث من أخطاء في السبرنت السابق، لكنها نادراً ما تساعد في توقع مواطن الخلل في الإصدار الحالي. وعندما يجتمع الفريق حول رسوم بيانية جامدة، غالباً ما يتحول النقاش إلى جدل حول تعريفات المقاييس بدلاً من معالجة الأسباب الجذرية.',
            'من خلال دمج التلخيص اللغوي الفوري مع بيانات Jira و GitHub، حولنا اللوحات الصامتة إلى منصات دعم قرار تفاعلية. فبدلاً من التحديق في خط السبرنت المتعثر، يمكن لمدير المنتج الآن أن يسأل: "ما هي الاعتماديات المعرضة للخطر إذا تأخرت الملحمة B يومين؟" ويتلقى على الفور تحليلاً بيانياً واضحاً لمستوى المخاطر.',
            'هذا التحول من القياس السلبي إلى الاستشراف الاستباقي ارتقى باجتماعاتنا اليومية من مجرد استجواب حول الحالة إلى ورش عمل استراتيجية لحل المشكلات.',
          ],
        },
      },
      {
        id: 'where-gen-ai-helps',
        heading: {
          en: 'Where can gen AI help agile delivery teams?',
          ar: 'أين يمكن للذكاء الاصطناعي التوليدي مساعدة فِرق أجايل؟',
        },
        paragraphs: {
          en: [
            'Through rigorous experimentation across eight sprints, our squads identified three distinct domains where generative models produce disproportionate value without compromising engineering autonomy:',
          ],
          ar: [
            'من خلال تجارب منهجية عبر ثماني دورات سبرنت متتالية، حددت فرقنا ثلاثة مجالات محورية يحقق فيها الذكاء الاصطناعي التوليدي قيمة نوعية استثنائية دون المساس باستقلالية المهندسين:',
          ],
        },
        list: {
          en: [
            'Synthesizing Ambiguous Requirements: Converting raw stakeholder interview transcripts and bullet points into fully fleshed-out Given-When-Then acceptance criteria.',
            'Automated Cross-Squad Dependency Mapping: Reading pull requests across distributed microservices to flag architectural overlaps and contract breaking changes.',
            'Sprint Retrospective Theme Clustering: Ingesting anonymous developer retro feedback and grouping sentiment trends into actionable thematic priorities.',
          ],
          ar: [
            'صياغة المتطلبات الغامضة: تحويل مسودات الاجتماعات وملاحظات العملاء الأولية إلى معايير قبول متكاملة بصيغة (Given-When-Then).',
            'رسم خرائط الاعتماديات بين الفرق: قراءة طلبات الدمج (PRs) عبر الخدمات المصغرة المختلفة لتنبيه المطورين إلى التداخلات المعمارية المحتملة.',
            'تصنيف مخرجات الاجتماعات التقويمية (Retros): استيعاب الملاحظات المجهولة من أعضاء الفريق وتجميع المشاعر والأنماط في أولويات عمل ملموسة.',
          ],
        },
      },
      {
        id: 'testing-gen-ai-on-epic',
        heading: {
          en: 'What happened when we tested gen AI on one epic',
          ar: 'ماذا حدث عندما اختبرنا الذكاء الاصطناعي على ملحمة برمجية واحدة؟',
        },
        paragraphs: {
          en: [
            'To empirically test our hypothesis, we selected an enterprise billing engine overhaul—an epic with 42 user stories spanning five distinct microservices. We ran a shadow control sprint: one team used conventional grooming, while the paired squad leveraged an AI copilot to pre-analyze user stories for edge cases, missing error states, and schema ambiguities.',
            'The results were striking. The AI-assisted squad experienced a 64% reduction in mid-sprint scope creep and zero critical defect re-openings during QA validation. Developers reported spending significantly less time clarifying acceptance criteria and more time writing clean, testable business logic.',
            'Most surprisingly, junior engineers felt dramatically more confident tackling complex tasks because the AI assistant provided clear architectural rationale and contextual API usage patterns directly within their IDEs.',
          ],
          ar: [
            'لاختبار فرضيتنا عملياً، اخترنا مشروع إعادة هيكلة محرك الفوترة المؤسسي — وهي ملحمة برمجية تحتوي على 42 قصة مستخدم موزعة على 5 خدمات مصغرة. طبقنا تجربة مقارنة: قام فريق باتباع الأسلوب التقليدي، بينما استخدم الفريق الآخر مساعداً ذكياً لتحليل القصص بحثاً عن الحالات الاستثنائية والغموض في هياكل البيانات.',
            'كانت النتائج مبهرة؛ فقد شهد الفريق المدعوم بالذكاء الاصطناعي انخفاضاً بنسبة 64% في تضخم نطاق العمل أثناء السبرنت، مع انعدام تام للأخطاء الحرجة التي أعيد فتحها أثناء اختبارات الجودة. وأفاد المطورون بأنهم استهلكوا وقتاً أقل بكثير في الاستفسار عن معايير القبول ووقتاً أكبر في كتابة شيفرات نظيفة.',
            'والأمر الأكثر إلهاماً كان شعور المطورين المبتدئين بثقة مضاعفة عند التعامل مع المهام المعقدة بفضل التوضيحات المعمارية الفورية التي وفرها المساعد الذكي مباشرة في بيئة التطوير.',
          ],
        },
      },
      {
        id: 'experiment-with-ai-responsibly',
        heading: {
          en: 'What helps employees experiment with AI responsibly?',
          ar: 'ما الذي يُمكّن الموظفين من تجربة الذكاء الاصطناعي بمسؤولية؟',
        },
        paragraphs: {
          en: [
            'Unregulated AI experimentation frequently triggers enterprise concerns regarding code IP security, hallucinated logic, and developer over-reliance. To establish a safe innovation harbor, Persici instituted a "Human-in-the-Loop Delivery Charter".',
            'Under this framework, AI models are explicitly classified as collaborative draughtsmen rather than authoritative arbiters. Every single generated specification, code snippet, or retrospective summary must be verified and co-signed by a human engineer before merging into mainline branches.',
            'Furthermore, all automated processing takes place within zero-data-retention isolated runtime environments, ensuring client confidentiality and compliance with GCC enterprise data governance standards.',
          ],
          ar: [
            'قد يثير الاستخدام غير المنضبط للذكاء الاصطناعي مخاوف مؤسسية تتعلق بحماية الملكية الفكرية، والمعلومات المهلوسة، والاعتماد المفرط. لتوفير بيئة ابتكار آمنة، وضعت بيرسيكي "ميثاق التسليم الإنساني المحكم".',
            'بموجب هذا الميثاق، تصنف نماذج الذكاء الاصطناعي صراحة كمساعد مسودة تعاوني وليست مرجعاً نهائياً. يجب مراجعة واعتماد كل مواصفة، أو سطر برمجي، أو ملخص تم إنشاؤه بواسطة مهندس بشري قبل دمجه في الفروع البرمجية الرئيسية.',
            'إضافة إلى ذلك، تُجرى جميع المعالجات الآلية ضمن بيئات تشغيلية معزولة لا تحتفظ بالبيانات، بما يضمن السرية التامة والامتثال لأعلى معايير حوكمة البيانات المؤسسية في الخليج.',
          ],
        },
      },
      {
        id: 'learning-about-ai',
        heading: {
          en: 'How can professionals begin learning about AI?',
          ar: 'كيف يمكن للمهنيين البدء في تعلّم الذكاء الاصطناعي؟',
        },
        paragraphs: {
          en: [
            'For agile practitioners, product owners, and engineering leaders seeking to integrate AI into their operational rhythm, the barrier to entry is far lower than commonly assumed. You do not require a PhD in tensor mathematics to build meaningful delivery workflows.',
            'Start by systematically documenting the questions that arise most frequently during your retrospectives and sprint planning sessions. Use prompt-chaining tools to feed structured templates against your team’s public documentation, measuring whether AI-assisted synthesis saves actual cognitive load.',
            'Ultimately, generative AI in agile delivery is not about writing software faster—it is about cultivating profound clarity, reducing friction, and liberating creative minds to build products that truly resonate.',
          ],
          ar: [
            'بالنسبة لممارسي منهجيات أجايل، ومديري المنتجات، وقادة الهندسة الراغبين في دمج الذكاء الاصطناعي في إيقاعهم اليومي، فإن حاجز الدخول أقل بكثير مما يُعتقد عادة؛ فأنت لست بحاجة إلى شهادة دكتوراه في الرياضيات المعقدة لبناء تدفقات تسليم ذكية وفعالة.',
            'ابدأ بتوثيق الأسئلة المتكررة التي تطرح أثناء اجتماعات التخطيط والمراجعة. ثم استخدم أدوات تسلسل التوجيهات (Prompt Chaining) لاختبار ما إذا كان التلخيص الذكي يوفر جهداً ذهنياً حقيقياً على أعضاء الفريق.',
            'في نهاية المطاف، لا يهدف الذكاء الاصطناعي في فرق أجايل إلى مجرد كتابة الشيفرات بسرعة أعلى — بل يهدف إلى ترسيخ الوضوح العميق، وإزالة الاحتكاك التشغيلي، وتحرير العقول المبدعة لبناء منتجات تحدث فارقاً استثنائياً.',
          ],
        },
      },
    ],
  },
  {
    id: 'what-ai-means-for-the-next-generation-of-data-engineers',
    slug: 'what-ai-means-for-the-next-generation-of-data-engineers',
    categorySlug: 'article',
    category: {
      en: 'Article',
      ar: 'مقال',
    },
    title: {
      en: 'What AI Means for the Next Generation of Data Engineers',
      ar: 'ماذا يعني الذكاء الاصطناعي للجيل القادم من مهندسي البيانات؟',
    },
    subtitle: {
      en: 'From pipeline plumbers to data product architects: why automated ETL is shifting engineering focus toward semantic governance.',
      ar: 'من مجرد بناء خطوط الأنابيب إلى هندسة منتجات البيانات: كيف تعيد أتمتة تدفقات البيانات توجيه التركيز نحو الحوكمة الدلالية.',
    },
    excerpt: {
      en: 'Autonomous data modeling and declarative ETL tools are transforming data engineering from maintenance plumbing into strategic product development.',
      ar: 'أدوات النمذجة المستقلة وخطوط تدفق البيانات التقريرية تعيد تشكيل هندسة البيانات من مجرد أعمال صيانة روتينية إلى تطوير منتجات استراتيجية.',
    },
    readTime: '7 min read',
    date: 'September 10, 2024',
    coverImage: '/images/insights/customer-behavior-analytics-charts.jpg',
    author: {
      name: 'Tarek Al-Mansoor',
      role: {
        en: 'Chief Data Architect',
        ar: 'كبير مهندسي معمارية البيانات',
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'the-death-of-manual-etl',
        title: {
          en: 'The death of manual ETL plumbing',
          ar: 'نهاية أعمال الربط اليدوي لتدفق البيانات',
        },
      },
      {
        id: 'the-rise-of-semantic-layer',
        title: {
          en: 'The rise of the autonomous semantic layer',
          ar: 'صعود الطبقة الدلالية المستقلة',
        },
      },
      {
        id: 'new-skills-demanded',
        title: {
          en: 'Skills demanded in the modern data ecosystem',
          ar: 'المهارات المطلوبة في منظومة البيانات الحديثة',
        },
      },
    ],
    sections: [
      {
        id: 'the-death-of-manual-etl',
        heading: {
          en: 'The death of manual ETL plumbing',
          ar: 'نهاية أعمال الربط اليدوي لتدفق البيانات',
        },
        paragraphs: {
          en: [
            'For two decades, data engineering was predominantly defined by extracting data from disparate databases, handling brittle transform scripts, and loading records into columnar warehouses. Today, AI-powered schema reconciliation algorithms write and test transformations automatically.',
            'This automation does not eliminate data engineers; it liberates them from repetitive script maintenance. The modern data engineer is no longer a pipeline plumber—they are a data product manager responsible for latency SLAs, lineage fidelity, and enterprise trust.',
          ],
          ar: [
            'على مدى عقدين، كان عمل مهندس البيانات يتمحور حول استخراج البيانات من مصادر متباينة، والتعامل مع نصوص برمجية هشة، وتفريغ السجلات في المستودعات الرقمية. اليوم، تقوم خوارزميات التوفيق الذكية بكتابة واختبار التحويلات بصورة تلقائية.',
            'هذه الأتمتة لا تلغي دور مهندس البيانات، بل تحرره من أعمال الصيانة الرتيبة. مهندس البيانات الحديث لم يعد مجرد فني تمديدات، بل أصبح مدير منتج بيانات مسؤولاً عن دقة السجلات وسرعة وصولها وثقة الإدارة فيها.',
          ],
        },
      },
      {
        id: 'the-rise-of-semantic-layer',
        heading: {
          en: 'The rise of the autonomous semantic layer',
          ar: 'صعود الطبقة الدلالية المستقلة',
        },
        paragraphs: {
          en: [
            'As large language models become the primary interface for business queries, semantic consistency is paramount. If an AI agent queries "Gross Revenue" across three different departments and gets three distinct mathematical interpretations, hallucinations are guaranteed.',
            'Data engineers are now tasked with curating immutable semantic models, defining metric contracts, and building governance rails that guarantee AI systems access validated ground truth.',
          ],
          ar: [
            'مع تحول النماذج اللغوية الكبيرة إلى واجهة أساسية لاستعلامات الأعمال، أصبحت الدقة الدلالية مسألة حاسمة. فإذا استعلم مساعد ذكي عن "إجمالي الإيرادات" عبر ثلاثة أقسام وتلقى ثلاثة تفسيرات حسابية مختلفة، فإن الهلوسة الرقمية ستكون النتيجة الحتمية.',
            'لذلك يُكلّف مهندسو البيانات الآن ببناء نماذج دلالية راسخة، وتحديد عقود المقاييس، وإنشاء أطر حوكمة تضمن وصول أنظمة الذكاء الاصطناعي إلى حقائق تشغيلية موثوقة وموحدة.',
          ],
        },
      },
      {
        id: 'new-skills-demanded',
        heading: {
          en: 'Skills demanded in the modern data ecosystem',
          ar: 'المهارات المطلوبة في منظومة البيانات الحديثة',
        },
        paragraphs: {
          en: [
            'The next generation of high-earning data engineers will combine distributed systems fluency with domain modeling mastery. Understanding streaming architectures like Apache Kafka and vector indexing engines will prove far more pivotal than writing traditional SQL stored procedures.',
          ],
          ar: [
            'الجيل القادم من نخبة مهندسي البيانات سيجمع بين إتقان الأنظمة الموزعة والقدرة على نمذجة مجالات الأعمال المعقدة. وسيكون فهم البنى التحتية المتدفقة مثل Apache Kafka وقواعد البيانات المتجهة (Vector DBs) أكثر أهمية بكثير من مجرد كتابة استعلامات SQL التقليدية.',
          ],
        },
      },
    ],
  },
  {
    id: 'what-star-formation-taught-me-about-solving-business-problems',
    slug: 'what-star-formation-taught-me-about-solving-business-problems',
    categorySlug: 'article',
    category: {
      en: 'Article',
      ar: 'مقال',
    },
    title: {
      en: 'What Star Formation Taught Me About Solving Business Problems',
      ar: 'ماذا علمني تشكل النجوم عن حل معضلات الأعمال المعقدة؟',
    },
    subtitle: {
      en: 'Translating gravitational accretion, critical mass thresholds, and thermodynamic equilibrium into organizational scaling dynamics.',
      ar: 'ترجمة قوى الجاذبية وتراكم الكتلة الحرجة والتوازن الديناميكي الحراري إلى استراتيجيات نمو للمؤسسات الطموحة.',
    },
    excerpt: {
      en: 'How principles of astrophysics and chaotic system dynamics offer a profound blueprint for catalyzing enterprise innovation and scaling market ventures.',
      ar: 'كيف تقدم مبادئ الفيزياء الفلكية وديناميكيات الأنظمة المعقدة مخططاً عميقاً لتحفيز الابتكار المؤسسي وتوسيع نطاق الأعمال في الأسواق التنافسية.',
    },
    readTime: '8 min read',
    date: 'August 29, 2024',
    coverImage: '/images/insights/experience-gap-shopping.jpg',
    author: {
      name: 'Dr. Marcus Vance',
      role: {
        en: 'Principal Innovation Architect',
        ar: 'كبير مهندسي الابتكار المؤسسي',
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'critical-density',
        title: {
          en: 'Critical density and organizational momentum',
          ar: 'الكثافة الحرجة والزخم المؤسسي',
        },
      },
      {
        id: 'gravitational-collapse',
        title: {
          en: 'Navigating positive feedback loops',
          ar: 'إدارة حلقات التغذية الراجعة المتسارعة',
        },
      },
      {
        id: 'fusion-sustained',
        title: {
          en: 'Igniting sustainable self-funding fusion',
          ar: 'إطلاق الاندماج المستدام ذاتي التمويل',
        },
      },
    ],
    sections: [
      {
        id: 'critical-density',
        heading: {
          en: 'Critical density and organizational momentum',
          ar: 'الكثافة الحرجة والزخم المؤسسي',
        },
        paragraphs: {
          en: [
            'Stars do not form uniformly across empty space. They require interstellar molecular clouds where local density fluctuations overcome thermal pressure. Similarly, transformative enterprise projects fail when leadership dilutes talent thinly across fifty initiatives instead of concentrating critical intellectual mass on two transformative bets.',
            'At Persici, we apply the "Jeans Mass" principle to venture design: until a multidisciplinary team reaches the exact critical threshold of engineering, design, and commercial velocity, external entropy will always dissolve the initiative.',
          ],
          ar: [
            'لا تتشكل النجوم عشوائياً في الفضاء المفتوح، بل تتطلب سحباً جزيئية كثيفة تتغلب فيها تقلبات الجاذبية الموضعية على الضغط الحراري المشتت. وبالمثل، تفشل المشاريع التحولية في الشركات عندما توزع الإدارة كفاءاتها بشكل متناثر على خمسين مبادرة بدلاً من حشد كتلة معرفية مركزة في رهانين استراتيجيين.',
            'في بيرسيكي، نطبق مبدأ "كتلة جينز" على بناء المشاريع: فما لم يبلغ الفريق متعدد التخصصات الحد الحرج من التناغم الهندسي والتصميمي والتجاري، فإن التشتت المؤسسي سيقوض المبادرة حتماً.',
          ],
        },
      },
      {
        id: 'gravitational-collapse',
        heading: {
          en: 'Navigating positive feedback loops',
          ar: 'إدارة حلقات التغذية الراجعة المتسارعة',
        },
        paragraphs: {
          en: [
            'Once contraction begins, gravity accelerates the inward pull exponentially. In digital platforms, this equates to the compounding network effect: superior user experience drives organic customer acquisition, which expands transactional liquidity, attracting premium partners.',
          ],
          ar: [
            'بمجرد أن يبدأ الانكماش الجاذبي، تتسارع القوة للداخل بشكل تصاعدي. في المنصات الرقمية، يترجم ذلك إلى التأثير الشبكي المضاعف: تجربة المستخدم الفائقة تحفز الاستقطاب الطبيعي، مما يرفع حجم السيولة التشغيلية ويجذب كبار الشركاء.',
          ],
        },
      },
      {
        id: 'fusion-sustained',
        heading: {
          en: 'Igniting sustainable self-funding fusion',
          ar: 'إطلاق الاندماج المستدام ذاتي التمويل',
        },
        paragraphs: {
          en: [
            'The birth of a star occurs when core temperature triggers nuclear fusion—generating outward radiative pressure that balances gravitational collapse into stable equilibrium. In commerce, this is the transition from venture capital burn to profitable unit economics.',
          ],
          ar: [
            'ولادة النجم الحقيقية تحدث عندما تشعل حرارة اللب تفاعلات الاندماج النووي — مما يولد ضغطاً إشعاعياً خارجياً يوازن قوى الجاذبية ويحقق استقراراً دائماً. وفي عالم الأعمال، يمثل ذلك الانتقال الحاسم من حرق رأس المال الاستثماري إلى تحقيق اقتصاديات وحدة مربحة ومستدامة.',
          ],
        },
      },
    ],
  },
  {
    id: 'ai-pays-off-when-you-redesign-around-value-flows',
    slug: 'ai-pays-off-when-you-redesign-around-value-flows',
    categorySlug: 'research',
    category: {
      en: 'Research',
      ar: 'بحث ودراسة',
    },
    title: {
      en: 'AI Pays Off When You Redesign Around Value Flows',
      ar: 'عوائد الذكاء الاصطناعي تتحقق حين تعيد تصميم مسارات القيمة',
    },
    subtitle: {
      en: 'Empirical benchmark across 120 GCC enterprises: why point-solution AI pilots fail while holistic value-stream redesign generates 3.4x ROI.',
      ar: 'دراسة مرجعية عبر 120 مؤسسة خليجية: لماذا تفشل تجارب الذكاء الاصطناعي الجزئية بينما يحقق إعادة تصميم تدفق القيمة الشامل عائداً بنسبة 3.4 أضعاف.',
    },
    excerpt: {
      en: 'A deep-dive research report demonstrating that true AI economic leverage is unlocked only by dismantling departmental silos and rewiring the end-to-end customer value stream.',
      ar: 'تقرير بحثي معمق يبرهن أن القوة الاقتصادية الحقيقية للذكاء الاصطناعي لا تتجلى إلا بتفكيك الحواجز الإدارية وإعادة هندسة مسار القيمة الممتد للعميل من البداية للنهاية.',
    },
    readTime: '12 min read',
    date: 'August 14, 2024',
    coverImage: '/images/insights/customer-journey-hotel.jpg',
    author: {
      name: 'Dr. Tariq Al-Hashimi',
      role: {
        en: 'Director of Enterprise Research',
        ar: 'مدير أبحاث التحول المؤسسي',
      },
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'the-pilot-trap',
        title: {
          en: 'The enterprise pilot trap in GCC markets',
          ar: 'فخ التجارب المحدودة في الأسواق الخليجية',
        },
      },
      {
        id: 'value-stream-mapping',
        title: {
          en: 'End-to-end value stream orchestration',
          ar: 'تنسيق مسار القيمة المتكامل',
        },
      },
      {
        id: 'roi-multipliers',
        title: {
          en: 'The 3.4x operational ROI multiplier',
          ar: 'مضاعف العائد التشغيلي البالغ 3.4 أضعاف',
        },
      },
    ],
    sections: [
      {
        id: 'the-pilot-trap',
        heading: {
          en: 'The enterprise pilot trap in GCC markets',
          ar: 'فخ التجارب المحدودة في الأسواق الخليجية',
        },
        paragraphs: {
          en: [
            'Our 2024 regional study revealed that over 78% of enterprise AI investments in the UAE and Saudi Arabia are confined to isolated department-level experiments—such as standalone customer service chatbots or automated marketing copy generators. While these pilots demonstrate novelty, fewer than 14% scale into balance-sheet profitability.',
            'The core pathology is what we term "localized optimization friction": accelerating a single node in a workflow simply pushes the bottleneck downstream to legal compliance, procurement, or manual fulfillment.',
          ],
          ar: [
            'كشفت دراستنا الإقليمية لعام 2024 أن أكثر من 78% من استثمارات الذكاء الاصطناعي في الإمارات والسعودية ظلت محصورة في تجارب فردية منعزلة داخل الأقسام — مثل روبوتات خدمة العملاء أو كتابة الإعلانات التلقائية. ورغم الجاذبية الأولية، فإن أقل من 14% منها استطاع التحول إلى أرباح ملموسة في الميزانية.',
            'ويعود السبب الجوهري إلى ما نطلق عليه "احتكاك التحسين الموضعي"؛ حيث يؤدي تسريع خطوة منفردة في المعاملة إلى تراكم الضغط عند المراحل التالية مثل التدقيق القانوني أو التنفيذ اليدوي.',
          ],
        },
      },
      {
        id: 'value-stream-mapping',
        heading: {
          en: 'End-to-end value stream orchestration',
          ar: 'تنسيق مسار القيمة المتكامل',
        },
        paragraphs: {
          en: [
            'Enterprises that achieved sustained double-digit efficiency gains bypassed point tools entirely. Instead, they mapped the entire lifecycle of a customer transaction and deployed synchronized multi-agent workflows that bridge legacy ERPs, CRM databases, and real-time fulfillment pipelines.',
          ],
          ar: [
            'المؤسسات التي حققت قفزات كفاءة مستدامة تجاوزت الأدوات المنفردة كلياً. وبدلاً من ذلك، قامت برسم دورة حياة المعاملة كاملة ونشرت فِرق عملاء برمجية ذكية (Multi-agent workflows) تربط أنظمة ERP المركزية بقواعد بيانات CRM وقنوات التوصيل في الوقت الفعلي.',
          ],
        },
      },
      {
        id: 'roi-multipliers',
        heading: {
          en: 'The 3.4x operational ROI multiplier',
          ar: 'مضاعف العائد التشغيلي البالغ 3.4 أضعاف',
        },
        paragraphs: {
          en: [
            'By redesigning around value streams, organizations in our cohort reduced customer order-to-cash cycles from 18 days to 38 hours, while generating an average 3.4x return on invested technology capital over an 18-month horizon.',
          ],
          ar: [
            'من خلال إعادة التصميم حول تدفقات القيمة، خفضت المؤسسات المشاركة في الدراسة دورة المعاملات من 18 يوماً إلى 38 ساعة فقط، محققة عائداً متوسطاً قدره 3.4 أضعاف على رأس المال التكنولوجي المستثمر خلال 18 شهراً.',
          ],
        },
      },
    ],
  },
  {
    id: 'ai-adoption-is-up-enterprise-impact-still-lags',
    slug: 'ai-adoption-is-up-enterprise-impact-still-lags',
    categorySlug: 'research',
    category: {
      en: 'Research',
      ar: 'بحث ودراسة',
    },
    title: {
      en: 'AI Adoption Is Up, Enterprise Impact Still Lags',
      ar: 'معدلات تبني الذكاء الاصطناعي ترتفع، لكن الأثر المؤسسي الحقيقي ما زال متأخراً',
    },
    subtitle: {
      en: 'Why software licensing budgets are surging while productivity curves remain flat across Middle Eastern financial services and retail.',
      ar: 'لماذا ترتفع ميزانيات اشتراكات البرمجيات بشكل قياسي بينما تبقى منحنيات الإنتاجية ثابتة في قطاعي المال والتجزئة في الشرق الأوسط.',
    },
    excerpt: {
      en: 'Synthesizing survey data from 450 corporate executives to uncover the organizational inertia and legacy compliance hurdles holding back enterprise AI dividends.',
      ar: 'تحليل بيانات استطلاعية لـ 450 رئيساً تنفيذياً لكشف الجمود التنظيمي وتحديات الامتثال القديمة التي تحول دون جني مكاسب الذكاء الاصطناعي المؤسسي.',
    },
    readTime: '9 min read',
    date: 'August 02, 2024',
    coverImage: '/images/insights/channel-effectiveness-livestream.jpg',
    author: {
      name: 'Lina Kanaan',
      role: {
        en: 'Senior Research Analyst',
        ar: 'محللة أبحاث أولى في الاقتصاد الرقمي',
      },
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'the-productivity-paradox',
        title: {
          en: 'The new digital productivity paradox',
          ar: 'مفارقة الإنتاجية الرقمية الجديدة',
        },
      },
      {
        id: 'legacy-compliance-bottlenecks',
        title: {
          en: 'Legacy compliance and governance friction',
          ar: 'عقبات الامتثال وأنظمة الحوكمة التقليدية',
        },
      },
      {
        id: 'the-remedy-blueprint',
        title: {
          en: 'The architectural remedy blueprint',
          ar: 'خارطة الطريق المعمارية للحلول الجذرية',
        },
      },
    ],
    sections: [
      {
        id: 'the-productivity-paradox',
        heading: {
          en: 'The new digital productivity paradox',
          ar: 'مفارقة الإنتاجية الرقمية الجديدة',
        },
        paragraphs: {
          en: [
            'Across the regional business landscape, 84% of surveyed C-suite executives report acquiring enterprise generative AI licenses for their workforce. Yet, macroeconomic productivity indicators across these same enterprises show zero statistically significant variance compared to pre-deployment baselines.',
            'Just as the arrival of factory electricity initially failed to boost manufacturing output until factory floor layouts were fundamentally re-engineered, AI tools cannot accelerate organizations built on twentieth-century bureaucratic hierarchy.',
          ],
          ar: [
            'أفاد 84% من كبار التنفيذيين المشاركين في الاستطلاع الإقليمي بشراء تراخيص مؤسسية للذكاء الاصطناعي لفرق عملهم. ومع ذلك، لم تظهر مؤشرات الإنتاجية أي فارق إحصائي ملموس مقارنة بالفترات التي سبقت تطبيق هذه التقنيات.',
            'تماماً كما حدث عند دخول الكهرباء إلى المصانع قديماً حيث لم ترفع الإنتاج حتى أعيد تصميم أرضيات المصانع كلياً، فإن أدوات الذكاء الاصطناعي لن ترفع كفاءة مؤسسات مبنية على هياكل بيروقراطية من القرن الماضي.',
          ],
        },
      },
      {
        id: 'legacy-compliance-bottlenecks',
        heading: {
          en: 'Legacy compliance and governance friction',
          ar: 'عقبات الامتثال وأنظمة الحوكمة التقليدية',
        },
        paragraphs: {
          en: [
            'The single greatest obstacle cited by 67% of Chief Information Security Officers is not technical latency or LLM accuracy, but risk management paralysis. Traditional review cycles designed for quarterly software releases freeze automated agents that generate insights in minutes.',
          ],
          ar: [
            'العائق الأكبر الذي أشار إليه 67% من مديري أمن المعلومات ليس البطء التقني أو دقة النماذج، بل التردد في إدارة المخاطر. فدورات المراجعة القديمة المصممة لإصدارات برمجية ربع سنوية تكبل حركة الوكلاء الأذكياء القادرين على توليد الرؤى في ثوانٍ معدودة.',
          ],
        },
      },
      {
        id: 'the-remedy-blueprint',
        heading: {
          en: 'The architectural remedy blueprint',
          ar: 'خارطة الطريق المعمارية للحلول الجذرية',
        },
        paragraphs: {
          en: [
            'Organizations realizing authentic enterprise impact mandate three structural reforms: programmable guardrails replacing manual audits, continuous automated compliance verification, and direct compensation incentives tied to algorithmic throughput.',
          ],
          ar: [
            'المؤسسات التي تحقق أثراً حقيقياً تتبنى ثلاثة إصلاحات هيكلية: حواجز حماية برمجية مشفرة بدلاً من المراجعات اليدوية، وتدقيق امتثال آلي ومستمر، وربط حوافز الأداء بزيادة الاعتماد على العمليات المؤتمتة.',
          ],
        },
      },
    ],
  },
  {
    id: 'how-ai-agents-use-shared-context-in-it-operations',
    slug: 'how-ai-agents-use-shared-context-in-it-operations',
    categorySlug: 'research',
    category: {
      en: 'Research',
      ar: 'بحث ودراسة',
    },
    title: {
      en: 'How AI Agents Use Shared Context in IT Operations',
      ar: 'كيف تستخدم وكلاء الذكاء الاصطناعي السياق المشترك في عمليات تكنولوجيا المعلومات؟',
    },
    subtitle: {
      en: 'Autonomous incident triage, unified vector topology, and real-time self-healing in distributed cloud environments.',
      ar: 'التشخيص الذاتي للحوادث التقنية، والربط الطوبولوجي الموحد، والمعالجة التلقائية في البيئات السحابية الموزعة.',
    },
    excerpt: {
      en: 'Examining the technical protocols and retrieval architectures that allow swarms of autonomous agents to coordinate root-cause analysis during major cloud outages.',
      ar: 'استعراض البروتوكولات التقنية وهياكل الاسترجاع التي تمكّن أسراب الوكلاء الأذكياء من تنسيق تحليل الأسباب الجذرية أثناء انقطاعات الخدمات السحابية الكبرى.',
    },
    readTime: '11 min read',
    date: 'July 26, 2024',
    coverImage: '/images/insights/telecom-clv-smartphone.jpg',
    author: {
      name: 'Fadi Haddad',
      role: {
        en: 'VP of Cloud Infrastructure & SRE',
        ar: 'نائب الرئيس للبنية التحتية السحابية وموثوقية النظم',
      },
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'the-shared-context-fabric',
        title: {
          en: 'The shared context communication fabric',
          ar: 'نسيج الاتصال والسياق المشترك',
        },
      },
      {
        id: 'multi-agent-triage',
        title: {
          en: 'Multi-agent outage triage in production',
          ar: 'التشخيص الجماعي للأعطال في بيئات الإنتاج الحية',
        },
      },
      {
        id: 'security-and-containment',
        title: {
          en: 'Autonomous blast radius containment',
          ar: 'احتواء نطاق الضرر البرمجي بشكل آلي',
        },
      },
    ],
    sections: [
      {
        id: 'the-shared-context-fabric',
        heading: {
          en: 'The shared context communication fabric',
          ar: 'نسيج الاتصال والسياق المشترك',
        },
        paragraphs: {
          en: [
            'In modern multi-cloud architectures, a single application failure cascades across hundreds of decoupled microservices within milliseconds. Human Site Reliability Engineering (SRE) teams are instantly overwhelmed by thousands of uncoordinated telemetry alerts.',
            'By establishing a shared context blackboard backed by low-latency vector databases, autonomous specialized agents—each dedicated to metrics, distributed traces, or deployment logs—can collaboratively cross-reference signals in real time without human coordination bottlenecks.',
          ],
          ar: [
            'في البنى التحتية السحابية الموزعة، يمتد العطل البرمجي المفرد ليصيب مئات الخدمات المصغرة خلال أجزاء من الثانية، مما يؤدي إلى غمر فرق موثوقية النظم (SRE) بآلاف التنبيهات المتضاربة.',
            'ومن خلال إنشاء لوحة سياق مشترك مدعومة بقواعد بيانات متجهة فائقة السرعة، يستطيع وكلاء متخصصون — كل منهم يراقب المقاييس أو التتبعات أو سجلات النشر — مقارنة الإشارات فورياً واكتشاف مصدر الخلل دون الحاجة لتدخل بشري معقد.',
          ],
        },
      },
      {
        id: 'multi-agent-triage',
        heading: {
          en: 'Multi-agent outage triage in production',
          ar: 'التشخيص الجماعي للأعطال في بيئات الإنتاج الحية',
        },
        paragraphs: {
          en: [
            'During a benchmark chaos test simulating a core database partition, our multi-agent architecture diagnosed root-cause deadlocks in 4.2 seconds—compared to an average 38 minutes required by seasoned on-call human incident squads.',
          ],
          ar: [
            'أثناء اختبار محاكاة أعطال حية لانهيار قاعدة بيانات رئيسية، نجح النظام متعدد الوكلاء في تحديد القفل البرمجي المسبب للعطل في 4.2 ثانية فقط — مقارنة بمتوسط 38 دقيقة تطلبتها الفرق البشرية المناوبة.',
          ],
        },
      },
      {
        id: 'security-and-containment',
        heading: {
          en: 'Autonomous blast radius containment',
          ar: 'احتواء نطاق الضرر البرمجي بشكل آلي',
        },
        paragraphs: {
          en: [
            'Beyond diagnostic speed, the agents automatically provisioned synthetic mock endpoints, isolated rogue tenants, and rolled back poisoned canary deployments, limiting blast radius degradation to under 0.02% of active users.',
          ],
          ar: [
            'ولم يتوقف الأمر عند سرعة التشخيص، بل قام الوكلاء تلقائياً بتفعيل نقاط وصول بديلة، وعزل الحسابات المتسببة بالضغط، والتراجع عن التحديثات الملوثة، مما حصر نطاق التأثر بأقل من 0.02% من المستخدمين النشطين.',
          ],
        },
      },
    ],
  },
  {
    id: 'digital-euro-readiness-without-a-core-banking-rebuild',
    slug: 'digital-euro-readiness-without-a-core-banking-rebuild',
    categorySlug: 'research',
    category: {
      en: 'Research',
      ar: 'بحث ودراسة',
    },
    title: {
      en: 'Digital Euro Readiness Without a Core Banking Rebuild',
      ar: 'الجاهزية لليورو الرقمي دون إعادة بناء الأنظمة المصرفية المركزية',
    },
    subtitle: {
      en: 'Architectural middleware blueprints for tier-1 European and GCC correspondent institutions preparing for CBDC settlement.',
      ar: 'مخططات معمارية للطبقات الوسيطة تمكّن المصارف الإقليمية والدولية من استيعاب العملات الرقمية للبنوك المركزية (CBDC) بكفاءة.',
    },
    excerpt: {
      en: 'A strategic research whitepaper demonstrating how commercial banks can achieve full Central Bank Digital Currency compatibility through modular event-streaming proxy layers.',
      ar: 'ورقة بحثية استراتيجية توضح كيف يمكن للبنوك التجارية تحقيق التوافق الكامل مع العملات الرقمية السيادية عبر طبقات تدفق بيانات وسيطة دون استبدال الأنظمة المصرفية القديمة.',
    },
    readTime: '10 min read',
    date: 'July 19, 2024',
    coverImage: '/images/insights/sustainability-at-scale-tablet.jpg',
    author: {
      name: 'Alexander Weber',
      role: {
        en: 'Partner, Financial Services Practice',
        ar: 'شريك قطاع الخدمات المالية والتقنيات المصرفية',
      },
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'cbdc-integration-hurdles',
        title: {
          en: 'The CBDC core replacement trap',
          ar: 'فخ الاستبدال الشامل للأنظمة المصرفية',
        },
      },
      {
        id: 'event-driven-adapter-pattern',
        title: {
          en: 'The event-driven sidecar adapter pattern',
          ar: 'نمط المحولات الجانبية القائمة على الأحداث',
        },
      },
      {
        id: 'programmable-compliance',
        title: {
          en: 'Sub-second programmable AML and sanctions screening',
          ar: 'الفحص البرمجي اللحظي لغسيل الأموال والعقوبات',
        },
      },
    ],
    sections: [
      {
        id: 'cbdc-integration-hurdles',
        heading: {
          en: 'The CBDC core replacement trap',
          ar: 'فخ الاستبدال الشامل للأنظمة المصرفية',
        },
        paragraphs: {
          en: [
            'As European central banks advance toward the Digital Euro and GCC central banks test cross-border wholesale CBDCs (like Project Aber and mBridge), tier-1 retail banks face a massive technical dilemma: legacy mainframe ledger engines cannot sustain the sub-second cryptographic settlement frequencies demanded by central bank nodes.',
            'A full core banking engine replacement carries exorbitant multi-hundred-million euro budgets and an unacceptable 40% historical project failure rate.',
          ],
          ar: [
            'مع تقدم البنوك المركزية الأوروبية نحو اليورو الرقمي وإطلاق البنوك المركزية الخليجية لمشاريع العملات الرقمية العابرة للحدود (مثل مشروعي "عابر" و "mBridge")، تواجه البنوك معضلة تقنية كبرى: فالأنظمة الدفترية المركزية القديمة عاجزة عن معالجة التسويات المشفرة اللحظية.',
            'وفي المقابل، فإن الاستبدال الكامل للأنظمة المصرفية المركزية يكلف مئات الملايين من الدولارات وينطوي على نسبة فشل تاريخية تتجاوز 40%.',
          ],
        },
      },
      {
        id: 'event-driven-adapter-pattern',
        heading: {
          en: 'The event-driven sidecar adapter pattern',
          ar: 'نمط المحولات الجانبية القائمة على الأحداث',
        },
        paragraphs: {
          en: [
            'Our research proposes an event-driven sidecar architecture: by inserting an asynchronous Apache Kafka caching proxy between the central bank API gateway and internal ledgers, institutions can achieve real-time CBDC tokenization while reconciling with legacy cores via batched ledger settlements.',
          ],
          ar: [
            'يقدم بحثنا نمطاً معمارياً يعتمد على المحولات الجانبية؛ فمن خلال إدراج طبقة وسيطة عبر Apache Kafka بين بوابات البنك المركزي والأنظمة الداخلية، تستطيع المصارف معالجة الرموز الرقمية لحظياً مع ترحيل التسويات الدفترية للنظام القديم في دفعات مجدولة.',
          ],
        },
      },
      {
        id: 'programmable-compliance',
        heading: {
          en: 'Sub-second programmable AML and sanctions screening',
          ar: 'الفحص البرمجي اللحظي لغسيل الأموال والعقوبات',
        },
        paragraphs: {
          en: [
            'This architecture isolates cryptographic signature generation from core balance inquiries, executing automated anti-money-laundering (AML) checks in under 80 milliseconds without adding load to legacy databases.',
          ],
          ar: [
            'يفصل هذا التصميم عمليات التوقيع الرقمي المشفر عن استعلامات الأرصدة المصرفية، مما يتيح إجراء تدقيق آلي لمكافحة غسيل الأموال (AML) في أقل من 80 جزءاً من الألف من الثانية ودون تحميل خوادم البنك القديمة أي أعباء إضافية.',
          ],
        },
      },
    ],
  },
  {
    id: 'ai-for-core-banking-modernization',
    slug: 'ai-for-core-banking-modernization',
    categorySlug: 'article',
    category: {
      en: 'Article',
      ar: 'مقال',
    },
    title: {
      en: 'AI for Core Banking Modernization',
      ar: 'الذكاء الاصطناعي لتحديث الأنظمة المصرفية المركزية',
    },
    subtitle: {
      en: 'How automated code transpilation and synthetic verification engines are breathing new life into forty-year-old COBOL architectures.',
      ar: 'كيف تعيد محركات ترجمة الشيفرات الآلية والاختبار الاصطناعي الحيوية إلى أنظمة الكوبول المصرفية التي تعمل منذ 40 عاماً.',
    },
    excerpt: {
      en: 'Demystifying how automated semantic translation engines safely convert legacy banking logic into containerized, cloud-native microservices.',
      ar: 'توضيح كيف تقوم محركات الترجمة الدلالية الذكية بتحويل الأنظمة المصرفية القديمة بأمان إلى خدمات سحابية مصغرة ومعزولة.',
    },
    readTime: '8 min read',
    date: 'July 14, 2024',
    coverImage: '/images/insights/emotion-sentiment-woman.jpg',
    author: {
      name: 'Elena Rostova',
      role: {
        en: 'Principal Banking Architect',
        ar: 'كبيرة مهندسي النظم المصرفية المتقدمة',
      },
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'the-cobol-conundrum',
        title: {
          en: 'The COBOL talent cliff',
          ar: 'أزمة تقاعد خبراء لغة الكوبول',
        },
      },
      {
        id: 'semantic-transpilation',
        title: {
          en: 'Semantic translation versus brute-force rewrites',
          ar: 'الترجمة الدلالية الذكية مقابل إعادة الكتابة الجذرية',
        },
      },
      {
        id: 'synthetic-twin-testing',
        title: {
          en: 'Synthetic digital twin validation',
          ar: 'الاختبار عبر التوائم الرقمية الاصطناعية',
        },
      },
    ],
    sections: [
      {
        id: 'the-cobol-conundrum',
        heading: {
          en: 'The COBOL talent cliff',
          ar: 'أزمة تقاعد خبراء لغة الكوبول',
        },
        paragraphs: {
          en: [
            'Over 70% of worldwide financial transactions still touch COBOL mainframe routines. As original authors retire, the institutional risk of maintaining these undocumented systems has reached catastrophic levels.',
            'Attempts to rewrite these mainframes manually in modern languages like Java or Go consistently encounter obscure business rules hidden in decades of patched edge cases.',
          ],
          ar: [
            'ما زالت أكثر من 70% من المعاملات المالية حول العالم تعتمد على شيفرات مكتوبة بلغة COBOL. ومع تقاعد المهندسين الأصليين، وصلت مخاطر صيانة هذه الأنظمة غير الموثقة إلى مستويات مقلقة للغاية.',
            'وفشلت معظم محاولات إعادة كتابتها يدوياً بلغات حديثة مثل Java أو Go بسبب القواعد التشغيلية الخفية والترقيعات المتراكمة عبر عقود من الزمن.',
          ],
        },
      },
      {
        id: 'semantic-transpilation',
        heading: {
          en: 'Semantic translation versus brute-force rewrites',
          ar: 'الترجمة الدلالية الذكية مقابل إعادة الكتابة الجذرية',
        },
        paragraphs: {
          en: [
            'Specialized fine-tuned LLMs do not just convert syntax line-by-line; they reconstruct the conceptual business state machine. By mapping legacy memory registers to declarative Domain-Driven Design (DDD) aggregates, financial institutions can extract clean, maintainable microservices with zero behavioral drift.',
          ],
          ar: [
            'النماذج اللغوية المتخصصة والمدربة دلالياً لا تكتفي بترجمة الأسطر حرفياً، بل تعيد بناء منطق الأعمال المفاهيمي كاملاً. ومن خلال ربط سجلات الذاكرة القديمة بنماذج التصميم القائم على المجال (DDD)، تستخرج البنوك خدمات مصغرة نظيفة وقابلة للصيانة وبمطابقة تامة لسلوك النظام القديم.',
          ],
        },
      },
      {
        id: 'synthetic-twin-testing',
        heading: {
          en: 'Synthetic digital twin validation',
          ar: 'الاختبار عبر التوائم الرقمية الاصطناعية',
        },
        paragraphs: {
          en: [
            'By running historical transaction traffic concurrently through both the legacy mainframe and the modern AI-transpiled microservice, banks can mathematically verify parity across hundreds of millions of real transactions before migrating live accounts.',
          ],
          ar: [
            'من خلال تمرير بيانات المعاملات التاريخية بالتوازي عبر النظام القديم والخدمة المصغرة الحديثة المترجمة بالذكاء الاصطناعي، تستطيع البنوك إثبات التطابق الحسابي المطلق عبر مئات الملايين من المعاملات الحقيقية قبل تحويل الحسابات الحية.',
          ],
        },
      },
    ],
  },
  {
    id: 'our-marketing-transformation-is-now-a-business-school-case-study',
    slug: 'our-marketing-transformation-is-now-a-business-school-case-study',
    categorySlug: 'article',
    category: {
      en: 'Article',
      ar: 'مقال',
    },
    title: {
      en: 'Our Marketing Transformation Is Now a Business School Case Study',
      ar: 'تحولنا التسويقي أصبح الآن دراسة حالة معتمدة في كليات إدارة الأعمال',
    },
    subtitle: {
      en: 'How dismantling agency silos and unifying media, creative velocity, and algorithmic attribution established an award-winning benchmark.',
      ar: 'كيف أسهم تفكيك الجزر المنعزلة وتوحيد الإنتاج الإبداعي مع خوارزميات الإسناد في إرساء معيار تسويقي مرموق حائز على الجوائز.',
    },
    excerpt: {
      en: 'A behind-the-scenes breakdown of how Persici restructured its client engagement model to eliminate marketing waste and deliver unmatched compound growth.',
      ar: 'تفاصيل مشوقة من كواليس إعادة هيكلة نموذج عمل بيرسيكي للقضاء على الهدر الإعلاني وتحقيق نمو مركب ومستدام لشركائنا.',
    },
    readTime: '6 min read',
    date: 'July 09, 2024',
    coverImage: '/images/insights/data-into-value-office.jpg',
    author: {
      name: 'Yousef Al-Qasimi',
      role: {
        en: 'Managing Director, Brand & Performance',
        ar: 'المدير التنفيذي لقطاع العلامات التجارية والأداء',
      },
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'dismantling-silos',
        title: {
          en: 'Dismantling the traditional agency silo',
          ar: 'تفكيك نموذج الوكالات الإعلانية التقليدي',
        },
      },
      {
        id: 'algorithmic-velocity',
        title: {
          en: 'Creative velocity as an algorithmic moat',
          ar: 'السرعة الإبداعية كحصن خوارزمي تنافسي',
        },
      },
      {
        id: 'academic-recognition',
        title: {
          en: 'From boardroom results to academic curriculum',
          ar: 'من نتائج استثنائية للشركاء إلى مناهج أكاديمية',
        },
      },
    ],
    sections: [
      {
        id: 'dismantling-silos',
        heading: {
          en: 'Dismantling the traditional agency silo',
          ar: 'تفكيك نموذج الوكالات الإعلانية التقليدي',
        },
        paragraphs: {
          en: [
            'In standard advertising agencies, media buyers sit in one corner, creative designers in another, and data analysts in a basement. The result is chronic misalignment: campaigns go live days after trends evaporate, and feedback loops take weeks to adjust creatives.',
            'Persici replaced this disjointed structure with unified multidisciplinary pods. Media strategists and motion directors work side-by-side in daily 15-minute optimization huddles, iteratively editing high-converting assets in real time.',
          ],
          ar: [
            'في الوكالات الإعلانية التقليدية، يجلس مسؤولو الحملات في زاوية، والمصممون المبدعون في زاوية أخرى، ومحللو البيانات في طابق منفصل. وتكون النتيجة تفككاً مزمناً: تطلق الحملات بعد أن تكون التوجهات الرائجة قد انتهت، وتستغرق مراجعة الأداء أسابيع.',
            'استبدلت بيرسيكي هذا الهيكل المترهل بفِرق عمل مشتركة ومرنة؛ حيث يعمل مخطط الحملات بجوار مخرج الفيديو مباشرة، ويقومان بتعديل المواد الإعلانية الأكثر جذباً في الوقت الفعلي.',
          ],
        },
      },
      {
        id: 'algorithmic-velocity',
        heading: {
          en: 'Creative velocity as an algorithmic moat',
          ar: 'السرعة الإبداعية كحصن خوارزمي تنافسي',
        },
        paragraphs: {
          en: [
            'Modern ad auction algorithms reward creative diversity and rapid refresh rates. By producing and testing up to 50 targeted creative variants weekly per client, our teams systematically beat industry CAC benchmarks by more than 40%.',
          ],
          ar: [
            'خوارزميات المزادات الإعلانية الحديثة في ميتا وتيك توك تكافئ التنوع الإبداعي والتجديد السريع. ومن خلال إنتاج واختبار ما يصل إلى 50 تصميماً مختلفاً أسبوعياً لكل شريك، تفوقت فرقنا باستمرار على معايير تكلفة الاستحواذ بنسبة تفوق 40%.',
          ],
        },
      },
      {
        id: 'academic-recognition',
        heading: {
          en: 'From boardroom results to academic curriculum',
          ar: 'من نتائج استثنائية للشركاء إلى مناهج أكاديمية',
        },
        paragraphs: {
          en: [
            'This operating paradigm was recently codified as an official business school case study on marketing agility in the era of artificial intelligence—proving that true competitive advantage lies in operational velocity, not ad spend size.',
          ],
          ar: [
            'تم توثيق هذا النموذج التشغيلي مؤخراً كدراسة حالة رسمية في كليات إدارة الأعمال حول مرونة التسويق في عصر الذكاء الاصطناعي — مما يثبت أن الميزة التنافسية الحقيقية تكمن في سرعة الإجراءات التشغيلية، وليس فقط في ضخامة الميزانيات الإعلانية.',
          ],
        },
      },
    ],
  },
  {
    id: 'customer-behavior-analytics-unlocking-the-why-behind-every-action',
    slug: 'customer-behavior-analytics-unlocking-the-why-behind-every-action',
    categorySlug: 'research',
    category: {
      en: 'Research',
      ar: 'بحث ودراسة',
    },
    title: {
      en: 'Customer Behavior Analytics: Unlocking the Why Behind Every Action',
      ar: 'تحليلات سلوك العملاء: كشف الدوافع الحقيقية وراء كل قرار شراء',
    },
    subtitle: {
      en: 'Data tells you what people do. Behavior tells you why they do it. Discover how decoding digital body language drives authentic enterprise growth.',
      ar: 'البيانات الرقمية توضح ما يفعله الناس، لكن السلوك يفسر دوافعهم الحقيقية. اكتشف كيف يساعد فهم لغة الجسد الرقمية في مضاعفة المبيعات والولاء.',
    },
    excerpt: {
      en: 'Every click, search, purchase, and abandonment tells part of a story. Learn how behavioral psychology turns surface-level analytics into high-converting experiences.',
      ar: 'كل نقرة، وبحث، وشراء، وتخلٍّ عن سلة التسوق يروي جزءاً من القصة. تعلم كيف يحول التحليل النفسي للسلوك الأرقام الصامتة إلى تجارب تحقق أعلى معدلات التحويل.',
    },
    readTime: '10 min read',
    date: 'June 18, 2024',
    coverImage: '/images/insights/customer-behavior-analytics-charts.jpg',
    author: {
      name: 'Nour Al-Sabah',
      role: {
        en: 'Head of Behavioral Science & CRO',
        ar: 'رئيسة علوم السلوك وتحسين معدلات التحويل',
      },
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'surface-data-mirage',
        title: {
          en: 'The mirage of surface-level metrics',
          ar: 'سراب المقاييس الرقمية السطحية',
        },
      },
      {
        id: 'digital-body-language',
        title: {
          en: 'Decoding digital body language',
          ar: 'فك شفرات لغة الجسد الرقمية للمستخدم',
        },
      },
      {
        id: 'orchestrating-conversion',
        title: {
          en: 'From passive tracking to active orchestration',
          ar: 'من التتبع السلبي إلى هندسة تجربة التحويل',
        },
      },
    ],
    sections: [
      {
        id: 'surface-data-mirage',
        heading: {
          en: 'The mirage of surface-level metrics',
          ar: 'سراب المقاييس الرقمية السطحية',
        },
        paragraphs: {
          en: [
            'In the modern enterprise, leaders are swimming in "What". We know bounce rates, session durations, and heatmaps of our digital storefronts with surgical precision. But for most executives, these metrics are a mirage: a high session duration could mean deep engagement, or it could mean a customer is hopelessly lost in a confusing navigation menu.',
            'A click is an action, but it is not an insight. True competitive advantage is not found in stockpiling more telemetry, but in decoding the underlying human intent.',
          ],
          ar: [
            'في المؤسسات المعاصرة، يغرق القادة في معرفة "ماذا حدث". فنحن نعرف معدلات الارتداد، ومدة الجلسات، والخرائط الحرارية للمتاجر الإلكترونية بدقة متناهية. ولكن بالنسبة لمعظم التنفيذيين، فإن هذه الأرقام قد تكون خادعة: فقد تعني مدة الجلسة الطويلة تفاعلاً عميقاً، أو قد تعني أن العميل تائه تماماً في قائمة تصفح مربكة.',
            'النقرة هي مجرد حركة فيزيائية وليست دافعاً بحد ذاتها. الميزة التنافسية الحقيقية لا تكمن في تكديس المزيد من البيانات، بل في فك رموز القصد والدافع الإنساني الكامن وراءها.',
          ],
        },
      },
      {
        id: 'digital-body-language',
        heading: {
          en: 'Decoding digital body language',
          ar: 'فك شفرات لغة الجسد الرقمية للمستخدم',
        },
        paragraphs: {
          en: [
            'Just as in physical brick-and-mortar stores where experienced sales associates observe hesitations, repeated product handling, and posture, digital consumers exhibit nuanced behavioral cues: erratic cursor movements, rapid scrolling, repeated price checks, and abandoned coupon entries.',
            'By training real-time classification models to recognize these patterns as they occur, platforms can intervene with contextually relevant assistance before frustration prompts churn.',
          ],
          ar: [
            'تماماً كما يلاحظ البائع الخبير في المتجر الواقعي تردد المشتري، وإعادة فحص المنتج، وحركات التردد، فإن المتسوق الرقمي يبدي إشارات سلوكية دقيقة للغاية: مثل حركة المؤشر المترددة، والتمرير السريع، وتكرار مراجعة السعر، ومحاولات إدخال كوبونات التخفيض.',
            'ومن خلال تدريب نماذج تصنيف لحظية للتعرف على هذه الأنماط أثناء حدوثها، تستطيع المنصات التدخل بتقديم دعم مخصص قبل أن يؤدي الإحباط إلى مغادرة العميل.',
          ],
        },
      },
      {
        id: 'orchestrating-conversion',
        heading: {
          en: 'From passive tracking to active orchestration',
          ar: 'من التتبع السلبي إلى هندسة تجربة التحويل',
        },
        paragraphs: {
          en: [
            'When behavioral analytics is connected directly to dynamic pricing and personalization engines, checkout abandonment drops significantly. Moving from passive measurement to automated empathy is the definitive frontier of digital commerce.',
          ],
          ar: [
            'عندما ترتبط التحليلات السلوكية مباشرة بمحركات التسعير الديناميكي وتخصيص الواجهات، تنخفض معدلات التخلي عن السلة بصورة جذرية. إن الانتقال من مجرد الرصد الصامت إلى إبداء التعاطف الرقمي التلقائي هو الأفق الحقيقي لتجارة المستقبل.',
          ],
        },
      },
    ],
  },
  {
    id: 'closing-the-energy-security-gap-building-a-sustainable-future',
    slug: 'closing-the-energy-security-gap-building-a-sustainable-future',
    categorySlug: 'research',
    category: {
      en: 'Research',
      ar: 'بحث ودراسة',
    },
    title: {
      en: 'Closing the Energy Security Gap: Building a Sustainable Future',
      ar: 'سد فجوة أمن الطاقة: بناء مستقبل مستدام وموثوق',
    },
    subtitle: {
      en: 'Balancing decarbonization imperatives with industrial grid stability through predictive smart distribution and battery storage telemetry.',
      ar: 'الموازنة بين متطلبات إزالة الكربون واستقرار الشبكات الصناعية عبر التوزيع الذكي التنبؤي وتطبيقات تخزين الطاقة المتقدمة.',
    },
    excerpt: {
      en: 'As regional economies decarbonize while demand surges from AI datacenters, intelligent software distribution grids are essential to prevent energy supply volatility.',
      ar: 'مع تسارع خطط خفض الانبعاثات وتزايد الطلب الهائل من مراكز بيانات الذكاء الاصطناعي، أصبحت شبكات التوزيع البرمجية الذكية ضرورة ملحة لمنع تقلبات إمدادات الطاقة.',
    },
    readTime: '11 min read',
    date: 'June 04, 2024',
    coverImage: '/images/insights/energy-security-wind-turbines.jpg',
    author: {
      name: 'Dr. Zaid Al-Nuaimi',
      role: {
        en: 'Senior Energy & Infrastructure Advisor',
        ar: 'مستشار أول لقطاع الطاقة والبنية التحتية',
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'the-security-trilemma',
        title: {
          en: 'The modern energy trilemma',
          ar: 'معضلة الطاقة الثلاثية المعاصرة',
        },
      },
      {
        id: 'algorithmic-load-balancing',
        title: {
          en: 'Algorithmic grid load balancing',
          ar: 'الموازنة الخوارزمية لأحمال الشبكات الكهربائية',
        },
      },
      {
        id: 'regional-gcc-leadership',
        title: {
          en: 'The GCC renewable energy frontier',
          ar: 'الريادة الخليجية في قطاع الطاقة المتجددة',
        },
      },
    ],
    sections: [
      {
        id: 'the-security-trilemma',
        heading: {
          en: 'The modern energy trilemma',
          ar: 'معضلة الطاقة الثلاثية المعاصرة',
        },
        paragraphs: {
          en: [
            'Energy security has become one of the defining challenges of our era. As global markets transition toward renewable sources, governments and heavy industries must simultaneously balance affordability, sustainability, and relentless baseload reliability.',
            'The exponential rise of hyperscale artificial intelligence datacenters has introduced massive localized demand spikes that traditional centralized power grids were never engineered to handle.',
          ],
          ar: [
            'أصبح أمن الطاقة واحداً من أكثر التحديات تأثيراً في عصرنا الحالي. ومع تحول الأسواق العالمية نحو المصادر المتجددة، يتعين على الحكومات والقطاعات الصناعية الكبرى الموازنة بين التكلفة الاقتصادية، والاستدامة البيئية، وضمان استقرار الإمداد على مدار الساعة.',
            'وقد أدى الصعود الهائل لمراكز بيانات الذكاء الاصطناعي العملاقة إلى خلق قفزات مفاجئة في استهلاك الكهرباء لم تكن شبكات الطاقة المركزية القديمة مصممة لاستيعابها إطلاقاً.',
          ],
        },
      },
      {
        id: 'algorithmic-load-balancing',
        heading: {
          en: 'Algorithmic grid load balancing',
          ar: 'الموازنة الخوارزمية لأحمال الشبكات الكهربائية',
        },
        paragraphs: {
          en: [
            'By deploying micro-forecasting machine learning models that ingest meteorological radar data alongside industrial consumption trends, grid operators can predict solar and wind intermittency 48 hours in advance, orchestrating battery storage charging cycles with millisecond precision.',
          ],
          ar: [
            'من خلال نشر نماذج تعلم آلي للتنبؤ الدقيق تدمج بيانات الرادار الجوي مع أنماط الاستهلاك الصناعي، يستطيع مشغلو الشبكات توقع تقلبات الطاقة الشمسية والرياح قبل 48 ساعة، وإدارة دورات شحن بطاريات التخزين الضخمة بدقة تصل لأجزاء من الألف من الثانية.',
          ],
        },
      },
      {
        id: 'regional-gcc-leadership',
        heading: {
          en: 'The GCC renewable energy frontier',
          ar: 'الريادة الخليجية في قطاع الطاقة المتجددة',
        },
        paragraphs: {
          en: [
            'With landmark initiatives across the UAE and Saudi Arabia—such as the Mohammed bin Rashid Al Maktoum Solar Park and NEOM Green Hydrogen—the Gulf region is rapidly proving that world-scale clean energy can be combined with unrivaled grid stability.',
          ],
          ar: [
            'من خلال المبادرات الرائدة في الإمارات والسعودية — مثل مجمع محمد بن راشد آل مكتوم للطاقة الشمسية ومشاريع نيوم للهيدروجين الأخضر — تثبت منطقة الخليج للعالم أن الطاقة النظيفة واسعة النطاق يمكن أن تقترن بأعلى درجات الموثوقية والأمان.',
          ],
        },
      },
    ],
  },
  {
    id: 'closing-the-experience-gap-in-digital-commerce',
    slug: 'closing-the-experience-gap-in-digital-commerce',
    categorySlug: 'article',
    category: {
      en: 'Article',
      ar: 'مقال',
    },
    title: {
      en: 'Closing the Experience Gap in Digital Commerce',
      ar: 'ردم فجوة تجربة المستخدم في التجارة الإلكترونية',
    },
    subtitle: {
      en: 'Why fast page speeds and competitive pricing are no longer enough to build enduring customer loyalty in competitive digital markets.',
      ar: 'لماذا لم تعد سرعة التصفح والأسعار التنافسية كافية وحدها لبناء ولاء دائم لدى المستهلك في الأسواق الرقمية المزدحمة.',
    },
    excerpt: {
      en: 'Today’s shoppers expect intuitive personalization, sub-second checkout friction, and genuine brand resonance. Here is how modern retailers bridge the experience gap.',
      ar: 'يتوقع المتسوقون اليوم تخصيصاً ذكياً، وإتمام شراء في أجزاء من الثانية، وتواصلاً حقيقياً مع العلامة التجارية. إليك كيف تردم المتاجر الرائدة فجوة التجربة.',
    },
    readTime: '7 min read',
    date: 'May 22, 2024',
    coverImage: '/images/insights/experience-gap-shopping.jpg',
    author: {
      name: 'Maya Mansour',
      role: {
        en: 'Director of Commerce Experience',
        ar: 'مديرة تجارب التجارة الرقمية والنمو',
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'the-silent-attrition',
        title: {
          en: 'The cost of silent customer attrition',
          ar: 'تكلفة فقدان العملاء الصامت',
        },
      },
      {
        id: 'frictionless-friction',
        title: {
          en: 'Meaningful engagement versus sterile checkout',
          ar: 'التفاعل الثري مقابل الشراء الآلي البارد',
        },
      },
      {
        id: 'the-omnichannel-continuity',
        title: {
          en: 'Unified omnichannel continuity',
          ar: 'استمرارية التجربة الموحدة عبر القنوات',
        },
      },
    ],
    sections: [
      {
        id: 'the-silent-attrition',
        heading: {
          en: 'The cost of silent customer attrition',
          ar: 'تكلفة فقدان العملاء الصامت',
        },
        paragraphs: {
          en: [
            'Over 82% of consumers who abandon a digital retailer never complain to customer support—they simply never return. When businesses measure satisfaction solely through support ticket volumes, they remain blind to the millions lost to subtle UX friction.',
            'Common culprits include cluttered mobile cart interfaces, obscure shipping estimates, and requiring account creation prior to checkout.',
          ],
          ar: [
            'أكثر من 82% من المستهلكين الذين يغادرون متجراً إلكترونياً دون إتمام الشراء لا يتواصلون أبداً مع خدمة العملاء — بل يتجهون ببساطة إلى منافس آخر. وعندما تقيس الشركات رضا العملاء عبر تذاكر الشكاوى فقط، تظل غافلة عن ملايين الدولارات المفقودة بسبب الاحتكاك البرمجي الخفي.',
            'وتشمل الأسباب الشائعة واجهات السلة المزدحمة على الهواتف، وعدم وضوح تكاليف الشحن من البداية، وإلزام المشتري بإنشاء حساب قبل الدفع.',
          ],
        },
      },
      {
        id: 'frictionless-friction',
        heading: {
          en: 'Meaningful engagement versus sterile checkout',
          ar: 'التفاعل الثري مقابل الشراء الآلي البارد',
        },
        paragraphs: {
          en: [
            'In the race to optimize checkout speed, many platforms stripped away the rich storytelling and sensory context that make retail enjoyable. Modern headless commerce allows brands to blend lightning-fast performance with interactive 3D product previews and authentic social proof.',
          ],
          ar: [
            'في حمى السباق لتسريع عمليات الدفع، جردت العديد من المتاجر تجربة التسوق من السرد القصري الجذاب والأبعاد الجمالية التي تجعل الشراء ممتعاً. تتيح بنية التجارة المستقلة (Headless Commerce) اليوم للمتاجر الجمع بين السرعة الفائقة والعروض التفاعلية ثلاثية الأبعاد للمنتجات.',
          ],
        },
      },
      {
        id: 'the-omnichannel-continuity',
        heading: {
          en: 'Unified omnichannel continuity',
          ar: 'استمرارية التجربة الموحدة عبر القنوات',
        },
        paragraphs: {
          en: [
            'Bridging the experience gap requires unified customer identity: items saved on a mobile app during a morning commute must seamlessly sync with the desktop storefront and in-store point-of-sale registers.',
          ],
          ar: [
            'ردم فجوة التجربة يتطلب هوية موحدة للعميل: فالمنتجات التي يحفظها العميل في تطبيق الهاتف أثناء تنقله صباحاً يجب أن تظهر فوراً في سلة متصفح حاسوبه وفي شاشات نقاط البيع داخل المتجر الواقعي دون أي انقطاع.',
          ],
        },
      },
    ],
  },
  {
    id: 'how-telecom-companies-calculate-and-increase-customer-lifetime-value',
    slug: 'how-telecom-companies-calculate-and-increase-customer-lifetime-value',
    categorySlug: 'research',
    category: {
      en: 'Research',
      ar: 'بحث ودراسة',
    },
    title: {
      en: 'How Telecom Companies Calculate and Increase Customer Lifetime Value (CLV)',
      ar: 'كيف تحسب شركات الاتصالات القيمة الدائمة للعميل (CLV) وتضاعفها؟',
    },
    subtitle: {
      en: 'Predictive churn modeling, multi-service bundling algorithms, and behavioral cohort segmentation in saturated mobile markets.',
      ar: 'نمذجة التنبؤ بإلغاء الاشتراكات، وخوارزميات حزم الخدمات المتعددة، وتصنيف الشرائح السلوكية في أسواق الاتصالات التنافسية.',
    },
    excerpt: {
      en: 'In saturated telecommunication markets with near-zero population growth, profitability hinges entirely on expanding Customer Lifetime Value through automated next-best-action models.',
      ar: 'في أسواق الاتصالات المشبعة، يعتمد نمو الأرباح كلياً على تعظيم القيمة الدائمة للعميل عبر نماذج الذكاء الاصطناعي التي تقترح الخطوة الأنسب لكل مستخدم تلقائياً.',
    },
    readTime: '10 min read',
    date: 'May 11, 2024',
    coverImage: '/images/insights/telecom-clv-smartphone.jpg',
    author: {
      name: 'Rami Al-Khatib',
      role: {
        en: 'Director of Telecom & Data Science',
        ar: 'مدير قطاع حلول الاتصالات وعلم البيانات',
      },
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    },
    tableOfContents: [
      {
        id: 'the-saturation-challenge',
        title: {
          en: 'The subscriber saturation reality',
          ar: 'واقع تشبع أسواق المشتركين',
        },
      },
      {
        id: 'predictive-clv-equations',
        title: {
          en: 'Dynamic machine learning CLV equations',
          ar: 'معادلات القيمة الدائمة الديناميكية بالتعلم الآلي',
        },
      },
      {
        id: 'proactive-retention-engines',
        title: {
          en: 'Proactive retention and personalized bundling',
          ar: 'محركات الاحتفاظ الاستباقي وتخصيص الباقات',
        },
      },
    ],
    sections: [
      {
        id: 'the-saturation-challenge',
        heading: {
          en: 'The subscriber saturation reality',
          ar: 'واقع تشبع أسواق المشتركين',
        },
        paragraphs: {
          en: [
            'With mobile penetration rates exceeding 180% across major GCC markets like the UAE, Saudi Arabia, and Qatar, acquiring net new subscriber SIMs has become prohibitively expensive. Profitability has decisively migrated from brute subscriber acquisition to maximizing Average Revenue Per User (ARPU) and minimizing voluntary churn.',
          ],
          ar: [
            'مع تجاوز معدلات انتشار الهواتف المحمولة حاجز 180% في الأسواق الخليجية الكبرى مثل الإمارات والسعودية وقطر، أصبحت تكلفة استقطاب مشتركين جدد مرتفعة جداً. وانتقلت معادلة الربحية الحاسمة من مجرد زيادة المشتركين إلى تعظيم متوسط العائد لكل مستخدم (ARPU) وخفض معدلات التراجع الطوعي.',
          ],
        },
      },
      {
        id: 'predictive-clv-equations',
        heading: {
          en: 'Dynamic machine learning CLV equations',
          ar: 'معادلات القيمة الدائمة الديناميكية بالتعلم الآلي',
        },
        paragraphs: {
          en: [
            'Traditional CLV formulas relied on static historical averages that failed to detect sudden behavioral shifts. By incorporating real-time network quality of service (QoS) telemetry, app usage frequencies, and billing inquiries into recurrent neural networks, operators can forecast subscriber lifetime value with 92% accuracy 6 months in advance.',
          ],
          ar: [
            'اعتمدت معادلات القيمة الدائمة التقليدية على متوسطات تاريخية ثابتة عجزت عن رصد التغيرات السلوكية المفاجئة. ومن خلال دمج بيانات جودة الشبكة في الوقت الفعلي ومعدل استخدام التطبيقات وسجلات الاستفسار عن الفواتير في شبكات عصبية متطورة، يستطيع المشغلون توقع القيمة المستقبلية بدقة 92% قبل 6 أشهر كاملة.',
          ],
        },
      },
      {
        id: 'proactive-retention-engines',
        heading: {
          en: 'Proactive retention and personalized bundling',
          ar: 'محركات الاحتفاظ الاستباقي وتخصيص الباقات',
        },
        paragraphs: {
          en: [
            'When an enterprise subscriber experiences repeated dropped calls along a specific commute corridor, automated retention systems immediately inject complimentary 5G speed boosts or personalized streaming partner subscriptions before the customer ever considers switching providers.',
          ],
          ar: [
            'عندما يواجه مشترك مميز انقطاعات متكررة في المكالمات على مسار تنقله اليومي، يقوم النظام الآلي فوراً بتقديم ترقيات سرعة 5G مجانية أو اشتراكات ترفيهية مخصصة للعميل قبل أن يفكر في الانتقال إلى مشغل منافس.',
          ],
        },
      },
    ],
  },
];

export function getAllInsights(): InsightDetail[] {
  return insightsData;
}

export function getInsightBySlug(slug: string): InsightDetail | undefined {
  return insightsData.find((i) => i.slug === slug);
}

export function getInsightsByCategory(categorySlug: 'article' | 'research'): InsightDetail[] {
  return insightsData.filter((i) => i.categorySlug === categorySlug);
}

export function getFeaturedInsight(): InsightDetail {
  return insightsData.find((i) => i.featured) || insightsData[0];
}
