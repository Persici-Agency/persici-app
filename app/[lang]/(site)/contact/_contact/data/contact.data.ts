export interface LocalizedString {
  en: string;
  ar: string;
}

export interface ContactOfficeItem {
  id: string;
  city: LocalizedString;
  country: LocalizedString;
  badge?: LocalizedString;
  address: LocalizedString;
  email: string;
  phone: string;
  hours: LocalizedString;
  timezone: string;
  image: string;
  mapsUrl: string;
  isHQ?: boolean;
}

export interface ContactChannelItem {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  email: string;
  sla: LocalizedString;
  category: LocalizedString;
}

export interface ContactFaqItem {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface ContactPageData {
  hero: {
    badge: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
  };
  officesTitle: LocalizedString;
  officesSubtitle: LocalizedString;
  offices: ContactOfficeItem[];
  channelsTitle: LocalizedString;
  channelsSubtitle: LocalizedString;
  channels: ContactChannelItem[];
  faqsTitle: LocalizedString;
  faqsSubtitle: LocalizedString;
  faqs: ContactFaqItem[];
}

export const contactPageData: ContactPageData = {
  hero: {
    badge: {
      en: 'Start a Conversation',
      ar: 'تواصل مع خبرائنا',
    },
    title: {
      en: "Let's Build the Future of Your Brand Together",
      ar: 'لنصنع معاً مستقبل علامتك التجارية ونطلق نمواً استثنائياً',
    },
    subtitle: {
      en: 'Whether you are seeking enterprise digital transformation, bespoke cloud engineering, or full-funnel customer acquisition, our strategists are ready to partner with you.',
      ar: 'سواء كنت تتطلع إلى تحول رقمي مؤسسي، أو هندسة سحابية متقدمة، أو قيادة استراتيجيات الاستحواذ والنمو، فإن فريق خبرائنا مستعد للبدء فوراً معك.',
    },
  },

  officesTitle: {
    en: 'Global Growth Hubs',
    ar: 'مراكزنا ومكاتبنا حول العالم',
  },
  officesSubtitle: {
    en: 'Connecting enterprise capabilities with deep regional insight across the GCC, Levant, and Middle East.',
    ar: 'نربط أرقى القدرات التقنية العالمية برؤى إقليمية راسخة عبر أسواق الخليج العربي وبلاد الشام والشرق الأوسط.',
  },
  offices: [
    {
      id: 'dubai-hq',
      city: {
        en: 'Dubai',
        ar: 'دبي',
      },
      country: {
        en: 'United Arab Emirates',
        ar: 'الإمارات العربية المتحدة',
      },
      badge: {
        en: 'Global Headquarters',
        ar: 'المقر الرئيسي العالمي',
      },
      address: {
        en: 'Dubai Internet City, Building 3, Innovation Hub',
        ar: 'مدينة دبي للإنترنت، مبنى 3، مجمع الابتكار',
      },
      email: 'dubai@persiciagency.com',
      phone: '+971 4 000 0000',
      hours: {
        en: 'Mon – Fri, 9:00 AM – 5:00 PM',
        ar: 'الإثنين – الجمعة، 9:00 ص – 5:00 م',
      },
      timezone: 'UTC+3',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
      mapsUrl: 'https://maps.google.com/?q=Dubai+Internet+City',
      isHQ: true,
    },
    {
      id: 'riyadh-hub',
      city: {
        en: 'Riyadh',
        ar: 'الرياض',
      },
      country: {
        en: 'Kingdom of Saudi Arabia',
        ar: 'المملكة العربية السعودية',
      },
      badge: {
        en: 'KSA Regional Hub',
        ar: 'المقر الإقليمي بالسعودية',
      },
      address: {
        en: 'King Fahd Road, Al Olaya Financial District',
        ar: 'طريق الملك فهد، حي العليا المالي',
      },
      email: 'riyadh@persiciagency.com',
      phone: '+966 11 000 0000',
      hours: {
        en: 'Sun – Thu, 9:00 AM – 5:00 PM',
        ar: 'الأحد – الخميس، 9:00 ص – 5:00 م',
      },
      timezone: 'UTC+3',
      image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=85',
      mapsUrl: 'https://maps.google.com/?q=King+Fahd+Road+Riyadh',
      isHQ: false,
    },
    {
      id: 'amman-hub',
      city: {
        en: 'Amman',
        ar: 'عمّان',
      },
      country: {
        en: 'Jordan',
        ar: 'الأردن',
      },
      badge: {
        en: 'Levant Regional Hub',
        ar: 'المقر الإقليمي لبلاد الشام',
      },
      address: {
        en: 'King Hussein Business Park (KHBP), Building 23',
        ar: 'مجمع الملك حسين للأعمال (KHBP)، مبنى 23',
      },
      email: 'amman@persiciagency.com',
      phone: '+962 6 500 0000',
      hours: {
        en: 'Sun – Thu, 9:00 AM – 5:00 PM',
        ar: 'الأحد – الخميس، 9:00 ص – 5:00 م',
      },
      timezone: 'UTC+3',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
      mapsUrl: 'https://maps.google.com/?q=King+Hussein+Business+Park+Amman',
      isHQ: false,
    },
  ],

  channelsTitle: {
    en: 'Direct Inquiries & Concierge',
    ar: 'قنوات التواصل المباشرة المخصصة',
  },
  channelsSubtitle: {
    en: 'Get in touch with the right department to accelerate response times.',
    ar: 'تواصل مباشرة مع القسم المعني لتسريع وقت الرد والاستجابة.',
  },
  channels: [
    {
      id: 'rfp',
      category: {
        en: 'Enterprise Proposals',
        ar: 'العروض والمناقصات المؤسسية',
      },
      title: {
        en: 'New Business & RFP Submissions',
        ar: 'الأعمال الجديدة والمناقصات (RFP)',
      },
      description: {
        en: 'Submit enterprise project scopes, invitations to tender, or schedule a strategic briefing with our business directors.',
        ar: 'قدم نطاق مشروعك المؤسسي، أو طلبات العروض والمناقصات، أو احجز جلسة موجز استراتيجي مع مسؤولي الأعمال لدينا.',
      },
      email: 'growth@persiciagency.com',
      sla: {
        en: 'Guaranteed response within 2 hours',
        ar: 'استجابة مؤكدة خلال ساعتين عمل',
      },
    },
    {
      id: 'partnerships',
      category: {
        en: 'Ecosystem Alliances',
        ar: 'التحالفات والشراكات',
      },
      title: {
        en: 'Strategic & Tech Partnerships',
        ar: 'الشراكات الاستراتيجية والتقنية',
      },
      description: {
        en: 'Collaborate with Persici across our global cloud, commerce, and AI ecosystem (Google Cloud, AWS, Shopify Plus, Meta).',
        ar: 'تعاون مع بيرسيشي عبر منظومتنا العالمية السحابية والتجارية والذكاء الاصطناعي (Google Cloud, AWS, Shopify Plus, Meta).',
      },
      email: 'partners@persiciagency.com',
      sla: {
        en: 'Response within 24 business hours',
        ar: 'الرد خلال 24 ساعة عمل',
      },
    },
    {
      id: 'careers',
      category: {
        en: 'Talent Acquisition',
        ar: 'استقطاب الكفاءات',
      },
      title: {
        en: 'Careers & Executive Recruitment',
        ar: 'الوظائف والتوظيف التنفيذي',
      },
      description: {
        en: 'Interested in joining our squads? Explore our open engineering, consulting, and design roles worldwide.',
        ar: 'هل تود الانضمام إلى فرق عملنا؟ استكشف الشواغر المتاحة في الاستشارات وتصميم التجارب والهندسة الرقمية.',
      },
      email: 'hr@persiciagency.com',
      sla: {
        en: 'Reviewed by recruitment squad weekly',
        ar: 'تتم مراجعة الطلبات أسبوعياً',
      },
    },
    {
      id: 'press',
      category: {
        en: 'Media Relations',
        ar: 'العلاقات الإعلامية',
      },
      title: {
        en: 'Press, Keynotes & Speaking',
        ar: 'الصحافة والمؤتمرات والمشاركات',
      },
      description: {
        en: 'Reach our media relations squad for leadership keynote bookings, thought leadership commentary, and brand assets.',
        ar: 'تواصل مع فريق العلاقات الإعلامية لحجز مشاركات قادتنا في المؤتمرات، والتصريحات الصحفية، ومواد الهوية الإعلامية.',
      },
      email: 'press@persiciagency.com',
      sla: {
        en: 'Response within 12 hours',
        ar: 'الرد خلال 12 ساعة',
      },
    },
  ],

  faqsTitle: {
    en: 'Frequently Asked Questions',
    ar: 'الأسئلة الأكثر شيوعاً حول الشراكة',
  },
  faqsSubtitle: {
    en: 'Clear answers on our engagement models, project kickoffs, and collaboration expectations.',
    ar: 'إجابات واضحة وشفافة حول نماذج التعاقد، وبدء المشاريع، والتوقعات التشغيلية.',
  },
  faqs: [
    {
      id: 'faq-1',
      question: {
        en: 'How quickly can our project kick off after signing?',
        ar: 'ما هي المدة الزمنية لبدء المشروع بعد توقيع الاتفاقية؟',
      },
      answer: {
        en: 'Our dedicated squads typically initiate discovery and Sprint 0 alignment within 5 to 7 business days following contract execution. We assemble dedicated squads that seamlessly integrate with your in-house teams from day one.',
        ar: 'تبدأ فرقنا المتخصصة مرحلة الاستكشاف والمواءمة (Sprint 0) في غضون 5 إلى 7 أيام عمل من توقيع العقد. نقوم بتشكيل فرق متكاملة تبدأ العمل والاندماج مع فريقك الداخلي من اليوم الأول.',
      },
    },
    {
      id: 'faq-2',
      question: {
        en: 'What engagement models does Persici offer?',
        ar: 'ما هي نماذج التعاقد والشراكة التي تقدمها بيرسيشي؟',
      },
      answer: {
        en: 'We structure engagements around client business velocity: Dedicated Agile Squads (ongoing monthly retainer for continuous product & growth engineering), Fixed-Scope Strategic Transformations, and Enterprise Milestone Deployments with clearly measured KPIs.',
        ar: 'نصمم نماذج التعاقد وفقاً لسرعة ومتطلبات العميل: فرق عمل متفرغة (Dedicated Squads بنظام الاشتراك الشهري للتطوير المستمر)، أو مشاريع محددة النطاق للتحول الاستراتيجي، أو نشر حلول مؤسسية متكاملة مرتبطة بمؤشرات أداء واضحة.',
      },
    },
    {
      id: 'faq-3',
      question: {
        en: 'Do you collaborate with regional GCC brands and global enterprises?',
        ar: 'هل تتعاملون مع العلامات الإقليمية في الخليج وكذلك الشركات العالمية؟',
      },
      answer: {
        en: 'Yes. With headquarters in Dubai, a strategic hub in Riyadh, and a European tech presence in Stockholm, we partner with premier regional leaders in Saudi Arabia, UAE, and GCC alongside international enterprise clients expanding into the region.',
        ar: 'نعم بالتأكيد. من خلال مقرنا في دبي، ومركزنا الاستراتيجي في الرياض، وحضورنا التقني الأوروبي في ستوكهولم، نعمل مع رواد الصناعة في السعودية والإمارات والخليج العربي، بالإضافة إلى العلامات والشركات العالمية التي تتوسع إقليمياً.',
      },
    },
    {
      id: 'faq-4',
      question: {
        en: 'What information should we prepare before our first discovery call?',
        ar: 'ما هي المعلومات التي يفضل تحضيرها قبل جلسة الاستكشاف الأولى؟',
      },
      answer: {
        en: 'Having high-level clarity on your current business friction points, target KPIs (e.g. revenue scale, legacy tech replacement, UX redesign), estimated timeframe, and current tech stack helps us provide concrete, high-leverage strategic recommendations in the very first call.',
        ar: 'يساعدنا وجود رؤية عامة حول التحديات الحالية، ومؤشرات الأداء المستهدفة (مثل مضاعفة الإيرادات، أو تحديث الأنظمة القديمة، أو إعادة تصميم التجربة)، والجدول الزمني التقديري، والبنية التقنية الحالية، في تقديم توصيات وحلول استراتيجية عملية من أول لقاء.',
      },
    },
    {
      id: 'faq-5',
      question: {
        en: 'Can we submit an RFP directly through your portal?',
        ar: 'هل يمكننا تقديم كراسة الشروط والمناقصات (RFP) مباشرة؟',
      },
      answer: {
        en: 'Yes. You can attach project scope details through our interactive inquiry form above or forward RFPs directly to growth@persici.com. Our commercial director reviews submissions within 2 hours during active business days.',
        ar: 'نعم. يمكنك تضمين تفاصيل نطاق المشروع عبر نموذج التواصل أعلاه، أو إرسال كراسة الشروط مباشرة إلى growth@persici.com وسيقوم مدير تطوير الأعمال بمراجعتها والرد خلال ساعتي عمل.',
      },
    },
  ],
};
