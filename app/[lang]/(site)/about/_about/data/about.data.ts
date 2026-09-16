export interface LocalizedString {
  en: string;
  ar: string;
}

export interface AboutHeroData {
  badge: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
  primaryCta: LocalizedString & { href: string };
  secondaryCta: LocalizedString & { href: string };
}

export interface AboutPurposeStat {
  code: string;
  value: string;
  number: number;
  suffix?: string;
  prefix?: string;
  thousandsSeparator?: string;
  label: LocalizedString;
}

export interface AboutPurposeData {
  badge: LocalizedString;
  title: LocalizedString;
  description1: LocalizedString;
  description2: LocalizedString;
  image: string;
  stats: AboutPurposeStat[];
}

export interface AboutHeritageMetric {
  value: string;
  label: LocalizedString;
}

export interface AboutHeritageData {
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  metrics: AboutHeritageMetric[];
  cta: LocalizedString & { href: string };
  image: string;
}

export interface AboutPartnershipData {
  badge: LocalizedString;
  title: LocalizedString;
  quote: LocalizedString;
  paragraphs: LocalizedString[];
  cta: LocalizedString & { href: string };
  image: string;
}

export interface AboutMilestoneItem {
  year: string;
  title: LocalizedString;
  description: LocalizedString;
  image: string;
}

export interface AboutMilestonesData {
  badge: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
  items: AboutMilestoneItem[];
}

export interface AboutExecutiveQuoteData {
  badge: LocalizedString;
  quote: LocalizedString;
  author: LocalizedString;
  role: LocalizedString;
  avatar?: string;
}

export interface AboutCulturePhotoItem {
  id: string;
  title: LocalizedString;
  caption: LocalizedString;
  image: string;
  aspect?: string;
}

export interface AboutCultureData {
  badge: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
  photos: AboutCulturePhotoItem[];
}

export interface AboutPillarItem {
  id: string;
  title: LocalizedString;
  category: LocalizedString;
  date: LocalizedString;
  type: string;
  href: string;
  summary: LocalizedString;
  image?: string;
}

export interface AboutPillarsData {
  badge: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
  items: AboutPillarItem[];
}

export interface AboutValueCard {
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  cta: LocalizedString & { href: string };
}

export interface AboutValuesData {
  badge: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
  card1: AboutValueCard;
  card2: AboutValueCard;
}

export interface AboutPageData {
  hero: AboutHeroData;
  purpose: AboutPurposeData;
  heritage: AboutHeritageData;
  partnership: AboutPartnershipData;
  milestones: AboutMilestonesData;
  quote: AboutExecutiveQuoteData;
  culture: AboutCultureData;
  pillars: AboutPillarsData;
  values: AboutValuesData;
}

export const aboutPageData: AboutPageData = {
  hero: {
    badge: {
      en: 'About Persici',
      ar: 'عن بيرسيكي',
    },
    title: {
      en: 'We Rebuild How Organizations Think, Move, and Grow',
      ar: 'نعيد تشكيل طريقة تفكير ونمو المؤسسات',
    },
    subtitle: {
      en: 'We drive innovation and sustainable success for ambitious organizations through digital reinvention, creative intelligence, and business transformation.',
      ar: 'نقود الابتكار والنجاح المستدام للمؤسسات الطموحة من خلال إعادة الابتكار الرقمي، الذكاء الإبداعي، وتحول الأعمال.',
    },
    primaryCta: {
      en: 'Explore Our Journey',
      ar: 'استكشف مسيرتنا',
      href: '#milestones',
    },
    secondaryCta: {
      en: 'Book a Discovery Call',
      ar: 'احجز مكالمة استكشافية',
      href: '#contact',
    },
  },

  purpose: {
    badge: {
      en: 'Purpose & Vision',
      ar: 'الرؤية والهدف',
    },
    title: {
      en: 'Purpose-Built for Growth & Transformation',
      ar: 'شريك استراتيجي برؤية هادفة ومستقبلية',
    },
    description1: {
      en: 'At Persici, we believe true transformation happens at the intersection of strategic clarity, advanced technology, and human-centric design. We exist to help forward-thinking organizations convert market friction into exponential momentum.',
      ar: 'في بيرسيكي، نؤمن بأن التحول الحقيقي ينبثق عند التقاء الوضوح الاستراتيجي، والتكنولوجيا المتطورة، والتصميم المتمحور حول الإنسان. وُجدنا لمساعدة المؤسسات الطموحة على تحويل تحديات السوق إلى قوة دافعة استثنائية.',
    },
    description2: {
      en: 'From digital customer experience reinvention to modern cloud engineering and enterprise AI integration, our multidisciplinary squads solve the toughest growth challenges with measurable business outcomes.',
      ar: 'من إعادة ابتكار تجربة العملاء الرقمية إلى هندسة السحابة الحديثة ودمج الذكاء الاصطناعي المؤسسي، تعالج فرقنا متعددة التخصصات أصعب تحديات النمو لتحقيق نتائج ملموسة وقابلة للقياس.',
    },
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
    stats: [
      {
        code: '01',
        value: '30+',
        number: 30,
        suffix: '+',
        label: {
          en: 'years of experience',
          ar: 'سنوات من الخبرة والريادة',
        },
      },
      {
        code: '02',
        value: '20,000',
        number: 20000,
        thousandsSeparator: ',',
        suffix: '',
        label: {
          en: 'passionate people',
          ar: 'كفاءة متخصصة وشغوفة',
        },
      },
      {
        code: '03',
        value: '72',
        number: 72,
        suffix: '',
        label: {
          en: 'worldwide offices',
          ar: 'مكاتب ومراكز حول العالم',
        },
      },
    ],
  },

  heritage: {
    badge: {
      en: 'Global Strategic Reach',
      ar: 'حضور استراتيجي عالمي',
    },
    title: {
      en: 'Global Standards, Deep Regional Roots',
      ar: 'معايير عالمية، وجذور إقليمية راسخة',
    },
    description: {
      en: 'Connecting global digital capabilities with unmatched local market insight across the GCC and Europe. We empower regional leaders and global brands to scale seamlessly with speed, security, and precision.',
      ar: 'نربط أرقى القدرات الرقمية العالمية بفهم عميق لأسواق الخليج العربي وأوروبا. نمكّن قادة الصناعة والعلامات التجارية العالمية من التوسع السلس بسرعة وأمان ودقة متناهية.',
    },
    metrics: [
      {
        value: '100+',
        label: {
          en: 'Enterprise Deployments',
          ar: 'مشاريع مؤسسية منجزة',
        },
      },
      {
        value: '98%',
        label: {
          en: 'Client Retention Rate',
          ar: 'نسبة استمرار العملاء',
        },
      },
      {
        value: '4.8★',
        label: {
          en: 'Verified Client Rating',
          ar: 'تقييم رضا العملاء',
        },
      },
    ],
    cta: {
      en: 'Explore Our Client Stories',
      ar: 'استكشف قصص نجاح عملائنا',
      href: '/client-stories',
    },
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80',
  },

  partnership: {
    badge: {
      en: 'How We Partner',
      ar: 'كيف نشارك عملاءنا',
    },
    title: {
      en: 'Partnership with Purpose, Built for Lasting Impact',
      ar: 'شراكة هادفة مصممة لأثر مستدام',
    },
    quote: {
      en: "We don't just deliver projects — we build partnerships.",
      ar: 'نحن لا نقدم مجرد مشاريع — بل نبني شراكات استراتيجية متكاملة.',
    },
    paragraphs: [
      {
        en: "Every collaboration starts with listening. We immerse ourselves in our clients' worlds — their challenges, ambitions, and untold opportunities. Together, we shape bold visions, then bring them to life through strategy, creativity, and technology.",
        ar: 'تبدأ كل شراكة بالاستماع العميق. نغوص في تفاصيل عالم شركائنا — تحدياتهم، طموحاتهم، والفرص غير المستغلة. معاً، نصيغ رؤى جريئة، ثم نحوّلها إلى واقع ملموس عبر الاستراتيجية والإبداع والتكنولوجيا.',
      },
      {
        en: "We move as one team — challenging assumptions, experimenting with ideas, and staying agile when the market shifts. Because the best outcomes aren't created for our clients, but with them.",
        ar: 'نتحرك كفريق عمل موحد — نتحدى الافتراضات التقليدية، ونجرّب الأفكار المبتكرة، ونحافظ على مرونتنا مع كل تحول في السوق. لأن أفضل النتائج لا تُصنع لعملائنا، بل معهم وبهم.',
      },
    ],
    cta: {
      en: 'Explore Our Methodology',
      ar: 'استكشف منهجيتنا',
      href: '/how-we-do-it',
    },
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  },

  milestones: {
    badge: {
      en: 'Our Journey',
      ar: 'مسيرتنا عبر الزمن',
    },
    title: {
      en: 'How We Got Here: Milestones of Innovation',
      ar: 'كيف وصلنا إلى هنا: محطات الابتكار والنمو',
    },
    subtitle: {
      en: 'From boutique digital consultancy to cross-border transformation powerhouse.',
      ar: 'من استشارات رقمية متخصصة إلى قوة متكاملة للتحول عبر الحدود.',
    },
    items: [
      {
        year: '2018',
        title: {
          en: 'The Foundation & Strategic Advisory',
          ar: 'التأسيس والاستشارات الاستراتيجية',
        },
        description: {
          en: 'Founded as a boutique advisory bridging growth marketing, user experience, and measurable digital ROI for pioneering ventures.',
          ar: 'انطلقت بيرسيكي كبيت استشاري يدمج بين تسويق النمو، تجربة المستخدم، والعائد الرقمي الملموس للشركات الرائدة.',
        },
        image: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1000&q=80',
      },
      {
        year: '2020',
        title: {
          en: 'Digital Acceleration & Commerce Scale',
          ar: 'التسارع الرقمي وتوسع التجارة الإلكترونية',
        },
        description: {
          en: 'Expanded into high-velocity performance engineering and enterprise headless commerce during the global digital inflection point.',
          ar: 'التوسع نحو هندسة الأداء العالي والتجارة الإلكترونية المعيارية لمواكبة نقطة التحول الرقمي العالمية.',
        },
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
      },
      {
        year: '2022',
        title: {
          en: 'Regional Expansion: Dubai & Riyadh',
          ar: 'التوسع الإقليمي: دبي والرياض',
        },
        description: {
          en: 'Inaugurated dedicated headquarters in Dubai and Riyadh, cementing deep regional footprint across the GCC transformation landscape.',
          ar: 'تدشين مقار رئيسية في دبي والرياض لترسيخ التواجد الإقليمي والمساهمة الفاعلة في مسيرة التحول بالخليج العربي.',
        },
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
      },
      {
        year: '2023',
        title: {
          en: 'Enterprise Transformation & SPEED Framework',
          ar: 'التحول المؤسسي ومنهجية SPEED',
        },
        description: {
          en: 'Pioneered agile delivery squads and end-to-end modern software engineering, scaling cross-functional enterprise transformations.',
          ar: 'إطلاق فرق العمل الرشيقة وهندسة البرمجيات المتكاملة لقيادة برامج التحول المؤسسي الشاملة.',
        },
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
      },
      {
        year: '2024',
        title: {
          en: 'AI Integration & Agentic Systems',
          ar: 'دمج الذكاء الاصطناعي والأنظمة الوكيلة',
        },
        description: {
          en: 'Integrated generative AI copilots, machine intelligence, and automated marketing workflows across our client portfolio.',
          ar: 'دمج نماذج الذكاء الاصطناعي التوليدي، التحليلات التنبؤية، وسير العمل المؤتمت عبر مختلف قطاعات العملاء.',
        },
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      },
      {
        year: '2025',
        title: {
          en: 'Cloud Modernization & Enterprise Architecture',
          ar: 'تحديث السحابة وهندسة الأنظمة',
        },
        description: {
          en: 'Engineered sovereign data infrastructures, microservices, and modern headless systems for enterprise-grade scalability.',
          ar: 'بناء بنى سحابية سيادية ونظم ميكروخدمية معيارية تضمن التوسع المؤسسي الموثوق والمرونة القصوى.',
        },
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
      },
      {
        year: '2026',
        title: {
          en: 'The Intelligent Enterprise Era',
          ar: 'عصر المؤسسة الذكية المتكاملة',
        },
        description: {
          en: 'Empowering industry champions to anticipate disruptions and build living digital ecosystems powered by human creativity and AI.',
          ar: 'تمكين رواد الصناعة من استباق المتغيرات وبناء منظومات رقمية ذكية حية تقودها الإبداعات البشرية وتدعمها تقنيات الذكاء الاصطناعي.',
        },
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80',
      },
    ],
  },

  quote: {
    badge: {
      en: 'Leadership Vision',
      ar: 'رؤية القيادة',
    },
    quote: {
      en: "Every great organization begins with a question: How can creativity, strategy, and technology work together to make business more human? In a world driven by speed, what truly sets you apart is the integrity to slow down and do what's right.",
      ar: 'تبدأ كل مؤسسة استثنائية بسؤال جوهري: كيف يمكن للإبداع والاستراتيجية والتكنولوجيا أن تتكامل لتجعل الأعمال أكثر إنسانية؟ في عالم تتسارع وتيرته، ما يميزك حقاً هو النزاهة للتأني والقيام بما هو صواب.',
    },
    author: {
      en: 'Amr Sharaf',
      ar: 'عمرو شرف',
    },
    role: {
      en: 'CEO, Persici Agency',
      ar: 'الرئيس التنفيذي، وكالة بيرسيكي',
    },
    avatar: 'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/members/amr-sharaf-v2.webp',
  },

  culture: {
    badge: {
      en: 'Our Culture',
      ar: 'ثقافتنا وبيئة العمل',
    },
    title: {
      en: 'The Minds Behind the Work',
      ar: 'العقول وراء إنجازاتنا',
    },
    subtitle: {
      en: 'Diverse perspectives, unified by a relentless passion for excellence.',
      ar: 'رؤى متنوعة يجمعها شغف لا يهدأ بالتميز والإبداع وصنع الفارق.',
    },
    photos: [
      {
        id: 'c1',
        title: {
          en: 'Architectural Focus Pod',
          ar: 'مساحة العمل الفردي المتطورة',
        },
        caption: {
          en: 'Modern Office Environment',
          ar: 'بيئة عمل عصرية',
        },
        image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=85',
        aspect: 'portrait-tall',
      },
      {
        id: 'c2',
        title: {
          en: 'Co-Worker Collaboration',
          ar: 'التعاون الإبداعي المشترك',
        },
        caption: {
          en: 'Cross-Functional Squads',
          ar: 'فرق عمل متكاملة',
        },
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85',
        aspect: 'landscape',
      },
      {
        id: 'c3',
        title: {
          en: 'Technology & Digital Craft',
          ar: 'الهندسة التقنية والحرفية الرقمية',
        },
        caption: {
          en: 'Advanced Engineering Sprints',
          ar: 'تطوير برمجي متقدم',
        },
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85',
        aspect: 'landscape',
      },
      {
        id: 'c4',
        title: {
          en: 'Office Community Hub & Lounge',
          ar: 'ردهة ومجتمع بيرسيكي التفاعلي',
        },
        caption: {
          en: 'Social Connection & Cafe Area',
          ar: 'مساحات التواصل الاجتماعي والتفاعل',
        },
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85',
        aspect: 'panoramic-wide',
      },
    ],
  },

  pillars: {
    badge: {
      en: 'What Sets Us Apart',
      ar: 'ما يميزنا',
    },
    title: {
      en: 'Strategic Capabilities That Deliver',
      ar: 'ركائزنا الاستراتيجية للتنفيذ',
    },
    subtitle: {
      en: 'We unite strategy, product design, engineering, and digital growth into unified business engines.',
      ar: 'نوحد الاستراتيجية، تصميم المنتجات، الهندسة، ونمو الأعمال في محركات تشغيلية متكاملة.',
    },
    items: [
      {
        id: 'pillar-1',
        title: {
          en: 'Business Transformation & Digital Reinvention',
          ar: 'تحول الأعمال وإعادة الابتكار الرقمي',
        },
        category: {
          en: 'Strategy & Consulting',
          ar: 'الاستراتيجية والاستشارات',
        },
        date: {
          en: 'Core Capability',
          ar: 'قدرة جوهرية',
        },
        type: 'strategy',
        href: '/how-we-do-it/strategy-consulting',
        summary: {
          en: 'Rethinking business models, operating frameworks, and customer journey orchestration to outpace market disruptions.',
          ar: 'إعادة صياغة نماذج الأعمال وأطر العمل التشغيلية وتنسيق رحلة العميل للتفوق على متغيرات السوق.',
        },
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
      },
      {
        id: 'pillar-2',
        title: {
          en: 'Creative Intelligence & Experience Design',
          ar: 'الذكاء الإبداعي وتصميم التجارب',
        },
        category: {
          en: 'Design & Branding',
          ar: 'التصميم والهوية',
        },
        date: {
          en: 'Core Capability',
          ar: 'قدرة جوهرية',
        },
        type: 'design',
        href: '/solutions/ux-and-product-design',
        summary: {
          en: 'Crafting brand narratives and frictionless digital touchpoints that convert first-time visitors into brand champions.',
          ar: 'صياغة هويات بصرية ونقاط تواصل رقمية سلسة تحول الزوار إلى سفراء مخلصين للعلامة التجارية.',
        },
        image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=85',
      },
      {
        id: 'pillar-3',
        title: {
          en: 'Next-Gen Engineering & Cloud Systems',
          ar: 'الهندسة التقنية والأنظمة السحابية',
        },
        category: {
          en: 'Technology & Cloud',
          ar: 'التكنولوجيا والسحابة',
        },
        date: {
          en: 'Core Capability',
          ar: 'قدرة جوهرية',
        },
        type: 'engineering',
        href: '/solutions/digital-engineering',
        summary: {
          en: 'Building secure, resilient, cloud-native architectures that empower continuous deployment and limitless scale.',
          ar: 'بناء بنى سحابية مرنة وآمنة تمكّن النشر البرمجي المستمر والتوسع المؤسسي اللامحدود.',
        },
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
      },
      {
        id: 'pillar-4',
        title: {
          en: 'Enterprise AI & Agentic Workflows',
          ar: 'الذكاء الاصطناعي المؤسسي وسير العمل المؤتمت',
        },
        category: {
          en: 'Artificial Intelligence',
          ar: 'الذكاء الاصطناعي',
        },
        date: {
          en: 'Core Capability',
          ar: 'قدرة جوهرية',
        },
        type: 'ai',
        href: '/solutions/ai-integration',
        summary: {
          en: 'Embedding intelligent machine automation and custom LLM copilots directly into high-leverage operational flows.',
          ar: 'دمج الأتمتة الذكية والأنظمة الوكيلة ونماذج الذكاء الاصطناعي المخصصة في العمليات التشغيلية الحيوية.',
        },
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
      },
    ],
  },

  values: {
    badge: {
      en: 'Core Principles',
      ar: 'قيمنا ومبادئنا',
    },
    title: {
      en: 'The Values That Shape Us',
      ar: 'قيمنا التي ترسم هويتنا',
    },
    subtitle: {
      en: 'Not rules on a wall, but living lessons we practice every day in every partnership.',
      ar: 'ليست مجرد شعارات، بل ممارسات يومية نعيشها في كل قرار وكل شراكة.',
    },
    card1: {
      badge: {
        en: 'How We Think',
        ar: 'منهجية تفكيرنا',
      },
      title: {
        en: 'Agility in Action & Relentless Curiosity',
        ar: 'المرونة في التنفيذ والشغف بالمعرفة',
      },
      description: {
        en: 'Change is constant. We challenge assumptions, ask better questions, and adapt smarter to keep our partners ahead of the curve.',
        ar: 'التغيير هو الثابت الوحيد. نتحدى الافتراضات ونسأل أسئلة أدق ونتكيف بذكاء لنبقي شركاءنا متقدمين بخطوة دائماً.',
      },
      cta: {
        en: 'Our Approach',
        ar: 'منهجيتنا في العمل',
        href: '/how-we-do-it',
      },
    },
    card2: {
      badge: {
        en: 'How We Work',
        ar: 'طريقة عملنا',
      },
      title: {
        en: 'Collaboration Without Boundaries & Purposeful Impact',
        ar: 'التعاون بلا حواجز والأثر الهادف',
      },
      description: {
        en: 'Innovation thrives when diverse minds come together across disciplines and borders. Every strategy begins with empathy and ends with measurable ROI.',
        ar: 'يزدهر الابتكار حين تلتقي العقول المبدعة عبر التخصصات والحدود. كل استراتيجية تبدأ بالتعاطف وتنتهي بعائد ملموس.',
      },
      cta: {
        en: 'Explore Careers',
        ar: 'انضم إلى فريقنا',
        href: '/careers',
      },
    },
  },
};
