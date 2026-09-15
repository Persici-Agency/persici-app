export interface LocalizedString {
  en: string;
  ar: string;
}

export interface CareerPerk {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  tag: LocalizedString;
  iconName: string;
}

export interface CareerProcessStep {
  step: string;
  title: LocalizedString;
  duration: LocalizedString;
  description: LocalizedString;
}

export interface CareerFaqItem {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface CareerJobOpening {
  id: string;
  slug: string;
  title: LocalizedString;
  department: LocalizedString;
  departmentSlug: 'engineering' | 'growth' | 'creative' | 'strategy' | 'data';
  location: LocalizedString;
  locationSlug: 'dubai' | 'riyadh' | 'amman' | 'remote';
  type: LocalizedString;
  experience: LocalizedString;
  workPolicy: LocalizedString;
  salaryRange: LocalizedString;
  featured?: boolean;
  isActive: boolean;
  postedDate: string;
  summary: LocalizedString;
  mission: LocalizedString;
  responsibilities: LocalizedString[];
  requirements: LocalizedString[];
  preferredQualifications: LocalizedString[];
  techStack: string[];
  benefits: LocalizedString[];
}

export interface CareersHubData {
  hero: {
    badge: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    stats: Array<{
      value: string;
      number?: number;
      suffix?: LocalizedString;
      decimals?: number;
      label: LocalizedString;
    }>;
  };
  culture: {
    badge: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    photos: Array<{
      image: string;
      title: LocalizedString;
      location: LocalizedString;
    }>;
  };
  perks: {
    badge: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    items: CareerPerk[];
  };
  process: {
    badge: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    steps: CareerProcessStep[];
  };
  spontaneous: {
    badge: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    ctaText: LocalizedString;
  };
  faqs: {
    badge: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    items: CareerFaqItem[];
  };
}

// ============================================================================
// 1. Careers Open Positions Dataset (Bilingual & High-Craft)
// ============================================================================
export const careerOpenings: CareerJobOpening[] = [
  {
    id: 'job-1',
    slug: 'staff-fullstack-ai-engineer',
    title: {
      en: 'Staff Full-Stack & Generative AI Engineer',
      ar: 'مهندس أول للنظم التوليدية والذكاء الاصطناعي الكامل',
    },
    department: {
      en: 'Engineering & AI',
      ar: 'الهندسة والذكاء الاصطناعي',
    },
    departmentSlug: 'engineering',
    location: {
      en: 'Dubai HQ / Hybrid & Remote',
      ar: 'مقر دبي / هجين وعن بُعد',
    },
    locationSlug: 'dubai',
    type: {
      en: 'Full-Time',
      ar: 'دوام كامل',
    },
    experience: {
      en: 'Lead / Staff (6+ Years)',
      ar: 'مستوى قيادي / خبير (6+ سنوات)',
    },
    workPolicy: {
      en: 'Flexible Hybrid or Full Remote',
      ar: 'هجين مرن أو عن بُعد بالكامل',
    },
    salaryRange: {
      en: 'AED 38,000 – 52,000 / mo + Equity',
      ar: '38,000 – 52,000 درهم / شهرياً + أسهم نمو',
    },
    featured: true,
    isActive: true,
    postedDate: '2026-03-01',
    summary: {
      en: 'Architect resilient Next.js 16 architectures, proprietary AI evaluation engines, and hyper-scalable headless commerce platforms for Tier-1 MENA & European enterprise brands.',
      ar: 'بناء وتطوير بنيات الجيل الحديث Next.js 16، ونماذج الذكاء الاصطناعي التوليدي الخاصة، ومنصات التجارة الرقمية فائقة القابلية للتوسع لكبرى العلامات في الشرق الأوسط وأوروبا.',
    },
    mission: {
      en: 'At Persici, engineering is not an execution layer; it is the fundamental growth engine. As a Staff Full-Stack & AI Engineer, you will spearhead our agentic workflows, build sub-second headless storefronts, and lead multi-disciplinary squads delivering breakthrough digital products that scale to millions of monthly consumers.',
      ar: 'في برسيسي، ليست الهندسة مجرد طبقة تنفيذية، بل هي محرك النمو الأساسي لكل شراكة. بصفتك مهندساً قيادياً للذكاء الاصطناعي والنظم الكاملة، ستقود أنظمتنا الوكيلة المستقلة، وتصمم واجهات تسوق فرعية الثانية، وتقود فرقاً متكاملة تقدم منتجات رقمية فارقة تخدم ملايين المتسوقين شهرياً.',
    },
    responsibilities: [
      {
        en: 'Architect and deliver high-concurrency Next.js App Router applications, edge middlewares, and serverless distributed services.',
        ar: 'هندسة وبناء تطبيقات Next.js App Router عالية التزامن، والبرمجيات الوسيطة الطرفية، والخدمات الموزعة سحابياً.',
      },
      {
        en: 'Design, fine-tune, and deploy agentic AI pipelines utilizing Gemini, Claude, and local LLMs to automate personalization, dynamic pricing, and creative velocity.',
        ar: 'تصميم وتدريب ونشر مسارات الذكاء الاصطناعي الوكيل بالاعتماد على Gemini وClaude ونماذج LLM المتخصصة لأتمتة التخصيص وسرعة الإنتاج الإبداعي.',
      },
      {
        en: 'Maintain sub-second Web Vitals (INP < 100ms, LCP < 1.2s) across enterprise e-commerce platforms handling millions in transactional volume.',
        ar: 'الحفاظ على مؤشرات أداء الويب القياسية (INP < 100ms، LCP < 1.2s) عبر منصات تجارة كبرى تدير ملايين العمليات شهرياً.',
      },
      {
        en: 'Mentor senior engineers, establish clean architectural patterns, lead code reviews, and drive our internal open-source packages.',
        ar: 'توجيه كبار المهندسين، وتأسيس أنماط برمجية محكمة، وإدارة مراجعات الشيفرة البرمجية، وتطوير حزم أدواتنا البرمجية الداخلية.',
      },
    ],
    requirements: [
      {
        en: '6+ years of professional software engineering experience with deep mastery of TypeScript, Next.js, React Server Components, and Node.js.',
        ar: 'خبرة مهنية تتجاوز 6 سنوات في هندسة البرمجيات مع إتقان استثنائي لـ TypeScript وNext.js وReact Server Components وNode.js.',
      },
      {
        en: 'Hands-on production track record designing and querying high-performance MongoDB Atlas and PostgreSQL distributed databases.',
        ar: 'سجل عملي مؤكد في تصميم وبناء واستعلام قواعد بيانات MongoDB Atlas وPostgreSQL الموزعة عالية الأداء.',
      },
      {
        en: 'Practical experience with LLM orchestration (LangChain, LlamaIndex, function-calling agent toolchains, vector embeddings, and RAG architectures).',
        ar: 'خبرة عملية مثبتة في إدارة نماذج اللغة الضخمة وهياكل الاسترجاع المعزز بالتوليد (RAG) وسلاسل استدعاء الأدوات للوكلاء الأذكياء.',
      },
      {
        en: 'Exceptional ownership mentality, clear technical writing ability, and experience working in high-velocity agile pods.',
        ar: 'عقلية ملكية ومسؤولية كاملة، ومهارة كتابية تقنية واضحة، وخبرة راسخة في بيئات العمل السريعة والرشيقة.',
      },
    ],
    preferredQualifications: [
      {
        en: 'Prior experience building headless e-commerce architectures on Shopify Plus, Centra, or BigCommerce.',
        ar: 'خبرة سابقة في بناء معماريات التجارة الإلكترونية مفصولة الرأس (Headless) على Shopify Plus أو Centra.',
      },
      {
        en: 'Familiarity with Cloudflare Workers / R2, Docker containerization, and automated CI/CD pipelines.',
        ar: 'إلمام بخدمات Cloudflare Workers / R2 السحابية، وحاويات Docker، ومسارات البناء والنشر الآلي CI/CD.',
      },
    ],
    techStack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB Atlas', 'PostgreSQL', 'Cloudflare R2', 'Docker', 'OpenAI / Gemini SDK'],
    benefits: [
      {
        en: 'Competitive base package with annual performance-indexed equity grants.',
        ar: 'راتب أساسي مجزٍ وتنافسي مع منح أسهم ملكية سنوية مرتبطة بمؤشرات الأداء.',
      },
      {
        en: 'Global mobility pass with hot-desking across Dubai, Riyadh, and Amman offices.',
        ar: 'إمكانية التنقل والعمل بحرية بين مكاتبنا في دبي، الرياض، وعمّان.',
      },
      {
        en: 'M-Series Apple workstation of choice and home office ergonomic budget ($2,500).',
        ar: 'أحدث محطة عمل Apple M-Series من اختيارك وميزانية تأثيث مكتب منزلي مريح (2,500 دولار).',
      },
    ],
  },
  {
    id: 'job-2',
    slug: 'head-of-performance-marketing',
    title: {
      en: 'Head of Performance Marketing & Growth',
      ar: 'رئيس التسويق الأدائي ونمو القنوات الرقمية',
    },
    department: {
      en: 'Growth Marketing',
      ar: 'التسويق والنمو الرقمي',
    },
    departmentSlug: 'growth',
    location: {
      en: 'Riyadh Hub / Hybrid',
      ar: 'مقر الرياض / هجين',
    },
    locationSlug: 'riyadh',
    type: {
      en: 'Full-Time',
      ar: 'دوام كامل',
    },
    experience: {
      en: 'Director Level (7+ Years)',
      ar: 'مستوى إداري أول (7+ سنوات)',
    },
    workPolicy: {
      en: 'Hybrid (King Fahd Road, Riyadh)',
      ar: 'هجين (طريق الملك فهد، الرياض)',
    },
    salaryRange: {
      en: 'SAR 36,000 – 48,000 / mo + Alpha Bonus',
      ar: '36,000 – 48,000 ريال / شهرياً + حوافز أداء',
    },
    featured: true,
    isActive: true,
    postedDate: '2026-03-03',
    summary: {
      en: 'Lead multi-million-dollar paid media portfolios across Meta, TikTok, Google, and Snapchat for high-growth DTC brands and enterprises across the GCC.',
      ar: 'قيادة محافظ وسائط مدفوعة بملايين الدولارات عبر Meta وTikTok وGoogle وSnapchat للعلامات التجارية والمؤسسات الأسرع نمواً في دول الخليج.',
    },
    mission: {
      en: 'As Head of Performance Marketing, you will own the algorithmic scaling playbook for our most ambitious clients. You will combine quantitative unit-economics modeling, creative velocity, and full-funnel attribution frameworks to deliver sustained 3x–5x ROAS and outpace traditional agency benchmarks.',
      ar: 'بصفتك رئيساً للتسويق الأدائي، ستمتلك استراتيجية التوسع الخوارزمي لأكثر عملائنا طموحاً. ستجمع بين نمذجة اقتصاديات الوحدة المالية، والسرعة الإبداعية، وأطر الإسناد الشاملة لتحقيق عوائد إنفاق تتجاوز 3x إلى 5x وتتفوق على معايير الوكالات التقليدية.',
    },
    responsibilities: [
      {
        en: 'Oversee and optimize $2M+ monthly ad spend across Meta Ads Manager, Google Performance Max, TikTok Ads, and Snapchat.',
        ar: 'الإشراف على إنفاق إعلاني يتجاوز 2 مليون دولار شهرياً وتحسينه عبر Meta وGoogle وTikTok وSnapchat.',
      },
      {
        en: 'Partner with our in-house Motion & Creative Studio to generate 30+ weekly high-converting creative iterations.',
        ar: 'التعاون الوثيق مع استوديو الهوية والحركة الداخلي لإنتاج أكثر من 30 قالباً وتجربة إعلانية عالية التحويل أسبوعياً.',
      },
      {
        en: 'Build attribution dashboards integrating server-side Conversions API (CAPI), Triple Whale, and GA4 for bulletproof tracking.',
        ar: 'تطوير لوحات إسناد تسويقي تربط بين واجهات Conversions API وTriple Whale وGA4 لضمان دقة القياس الكاملة.',
      },
      {
        en: 'Represent Persici in high-level strategic steering committees with founders, CMOs, and private equity sponsors.',
        ar: 'تمثيل برسيسي في لجان التوجيه الاستراتيجي رفيعة المستوى مع المؤسسين ورؤساء التسويق وصناديق الاستثمار.',
      },
    ],
    requirements: [
      {
        en: '7+ years managing large-scale performance marketing budgets with a verified track record in the GCC and North American markets.',
        ar: 'خبرة تزيد عن 7 سنوات في إدارة ميزانيات التسويق الأدائي الضخمة مع سجل موثق من النجاحات في الخليج وأمريكا الشمالية.',
      },
      {
        en: 'Expert knowledge of unit economics: CAC, LTV, Contribution Margin 3, MER, and inventory turnover cycles.',
        ar: 'إلمام عميق باقتصاديات التجارة: تكلفة الاكتساب (CAC)، القيمة الدائمة للعميل (LTV)، هامش المساهمة، ونسب سرعة تدوير المخزون.',
      },
      {
        en: 'Deep analytical capability using BigQuery, SQL, or advanced BI tools to identify growth anomalies.',
        ar: 'قدرة تحليلية رفيعة المستوى باستخدام BigQuery أو SQL أو أدوات ذكاء الأعمال المتقدمة لاكتشاف فرص النمو.',
      },
      {
        en: 'Bilingual fluency in Arabic and English is strongly preferred.',
        ar: 'إتقان تام للغتين العربية والإنجليزية تحدثاً وكتابة.',
      },
    ],
    preferredQualifications: [
      {
        en: 'Experience scaling high-growth beauty, fashion, luxury retail, or fintech subscription platforms.',
        ar: 'خبرة في توسيع علامات التجميل، الأزياء الفاخرة، أو منتجات التكنولوجيا المالية القائمة على الاشتراكات.',
      },
    ],
    techStack: ['Meta Ads Manager', 'TikTok for Business', 'Google Ads / PMax', 'Triple Whale', 'Shopify Plus', 'Klaviyo', 'BigQuery', 'Tableau'],
    benefits: [
      {
        en: 'Direct profit-share and quarterly revenue alpha bonuses based on client portfolio growth.',
        ar: 'مشاركة مباشرة في الأرباح ومكافآت ربع سنوية مرتبطة بمعدلات نمو محافظ العملاء.',
      },
      {
        en: 'Comprehensive VIP medical, dental, and wellness insurance across the GCC.',
        ar: 'تأمين صحي وطبي لكبار الشخصيات يشمل الرعاية الشاملة في كافة دول مجلس التعاون.',
      },
      {
        en: 'Dedicated conference budget to attend Meta / Google global summits in London, Dublin, and San Francisco.',
        ar: 'ميزانية سنوية لحضور مؤتمرات وقمم Meta وGoogle العالمية في لندن ودبلن وسان فرانسيسكو.',
      },
    ],
  },
  {
    id: 'job-3',
    slug: 'principal-brand-motion-designer',
    title: {
      en: 'Principal Brand & Motion Experience Designer',
      ar: 'مصمم رئيسي لتجارب الهوية البصرية والحركة الرقمية',
    },
    department: {
      en: 'Creative & Brand',
      ar: 'الإبداع والهوية البصرية',
    },
    departmentSlug: 'creative',
    location: {
      en: 'Dubai HQ / Hybrid',
      ar: 'مقر دبي / هجين',
    },
    locationSlug: 'dubai',
    type: {
      en: 'Full-Time',
      ar: 'دوام كامل',
    },
    experience: {
      en: 'Lead (5+ Years)',
      ar: 'مستوى قيادي إبداعي (5+ سنوات)',
    },
    workPolicy: {
      en: 'Hybrid (DIFC / Downtown Dubai)',
      ar: 'هجين (مركز دبي المالي العالمي / وسط دبي)',
    },
    salaryRange: {
      en: 'AED 32,000 – 42,000 / mo',
      ar: '32,000 – 42,000 درهم / شهرياً',
    },
    featured: false,
    isActive: true,
    postedDate: '2026-03-05',
    summary: {
      en: 'Set the visual benchmark for cutting-edge brand systems, 3D WebGL motion interactions, and viral video performance assets.',
      ar: 'وضع المعايير الفنية البصرية للهويات التجارية المتقدمة، وتفاعلات الحركة ثلاثية الأبعاد WebGL، وحملات الفيديو الإبداعية المؤثرة.',
    },
    mission: {
      en: 'Creative is the new targeting. As Principal Brand & Motion Designer, you will shape the aesthetic tone of iconic digital flagships, combine cinema-grade animation with performance psychology, and translate complex technical value propositions into captivating visual experiences.',
      ar: 'الإبداع هو محدد الاستهداف الأول في العصر الرقمي. بصفتك مصمماً رئيسياً للهوية والحركة، ستصوغ التوجه الفني لأبرز المنصات الرقمية، وتدمج الرسوم السينمائية مع علم النفس السلوكي، وتحول المفاهيم التقنية المعقدة إلى أعمال بصرية آسرة.',
    },
    responsibilities: [
      {
        en: 'Direct and execute world-class brand identities, motion design systems, interactive prototypes, and 3D product renders.',
        ar: 'توجيه وتنفيذ هويات بصرية متكاملة، وأنظمة حركة تفاعلية، ونماذج أولية ثلاثية الأبعاد للمنتجات الرقمية.',
      },
      {
        en: 'Collaborate with frontend engineers to translate Figma and After Effects designs into buttery smooth Framer Motion and WebGL interactions.',
        ar: 'التعاون مع مهندسي الواجهات لتحويل تصميمات Figma وAfter Effects إلى تفاعلات سلسة فائقة الانسيابية عبر Framer Motion وWebGL.',
      },
      {
        en: 'Produce high-velocity creative frameworks that test hooked variations, UGC concepts, and typographic typography.',
        ar: 'إنتاج أطر عمل إبداعية سريعة لاختبار الخطافات الإعلانية وتجارب الفيديو والمؤثرات الطباعية المبتكرة.',
      },
    ],
    requirements: [
      {
        en: 'Outstanding design portfolio demonstrating elite visual craft, typography, motion, and art direction for modern brands.',
        ar: 'معرض أعمال استثنائي يبرهن على حس فني رفيع، وإتقان لفنون التيبوغرافيا والحركة والإخراج الإبداعي للعلامات العصرية.',
      },
      {
        en: 'Mastery of Figma, After Effects, Cinema 4D / Blender, and modern design systems.',
        ar: 'احتراف كامل لبرامج Figma وAfter Effects وCinema 4D أو Blender وأنظمة التصميم المعيارية.',
      },
      {
        en: 'Strong understanding of conversion ergonomics, mobile-first design constraints, and social platform trends.',
        ar: 'فهم عميق لقواعد التحويل الرقمي، وقيود التصميم المخصص للهواتف الذكية، وتوجهات منصات التواصل العالمية.',
      },
    ],
    preferredQualifications: [
      {
        en: 'Experience working with Rive or interactive Lottie web animations.',
        ar: 'خبرة في العمل مع تقنيات Rive أو رسوم Lottie التفاعلية للويب.',
      },
    ],
    techStack: ['Figma', 'Adobe After Effects', 'Cinema 4D', 'Blender', 'Rive', 'Midjourney', 'Premiere Pro'],
    benefits: [
      {
        en: 'Creative mastery fund ($3,000/yr) for software, plugins, typography licenses, and masterclasses.',
        ar: 'صندوق سنوي للتمكين الإبداعي (3,000 دولار) للبرمجيات والخطوط المرخصة والدورات التخصصية.',
      },
      {
        en: 'High-end studio workstation setup (Mac Studio + Studio Display).',
        ar: 'أحدث عتاد استوديو احترافي (جهاز Mac Studio مع شاشة Studio Display فائقة الدقة).',
      },
    ],
  },
  {
    id: 'job-4',
    slug: 'lead-cro-shopify-engineer',
    title: {
      en: 'Lead Headless Shopify & CRO Engineer',
      ar: 'مهندس رئيسي لمنصات شوبيفاي وهندسة التحويل الرقمي',
    },
    department: {
      en: 'Engineering & AI',
      ar: 'الهندسة والذكاء الاصطناعي',
    },
    departmentSlug: 'engineering',
    location: {
      en: 'Amman Hub / Hybrid & Remote',
      ar: 'مقر عمّان / هجين وعن بُعد',
    },
    locationSlug: 'amman',
    type: {
      en: 'Full-Time',
      ar: 'دوام كامل',
    },
    experience: {
      en: 'Senior (5+ Years)',
      ar: 'مستوى متقدم (5+ سنوات)',
    },
    workPolicy: {
      en: 'Hybrid (KHBP Amman) or Remote',
      ar: 'هجين (مجمع الملك حسين للأعمال، عمّان) أو عن بُعد',
    },
    salaryRange: {
      en: '$55,000 – $75,000 / yr + Performance Bonus',
      ar: '55,000 – 75,000 دولار / سنوياً + حوافز أداء',
    },
    featured: false,
    isActive: true,
    postedDate: '2026-03-06',
    summary: {
      en: 'Engineer conversion-focused digital storefronts, run rigorous A/B experimentation engines, and scale headless commerce for international brands.',
      ar: 'هندسة متاجر رقمية عالية التحويل، وتشغيل محركات تجارب A/B العلمية، وتطوير البنى البرمجية للتجارة الحديثة للعلامات الدولية.',
    },
    mission: {
      en: 'You will bridge the gap between frontend performance and revenue generation. By deploying scientific multivariate tests, optimizing checkout funnels, and building lightning-fast Shopify Plus components, you directly increase bottom-line client profitability.',
      ar: 'ستشكل الجسر الحيوي بين سرعة الأداء البرمجي وتوليد الإيرادات الصافية. من خلال إطلاق اختبارات A/B العلمية، وتحسين مسارات الدفع، وبناء مكونات سريعة على Shopify Plus، ستسهم مباشرة في مضاعفة أرباح عملائنا.',
    },
    responsibilities: [
      {
        en: 'Build custom Shopify themes, Hydrogen headless storefronts, and bespoke checkout extensions using Shopify Functions.',
        ar: 'بناء قوالب مخصصة، ومتاجر Hydrogen مفصولة الرأس، وتطبيقات الدفع المخصصة بالاعتماد على Shopify Functions.',
      },
      {
        en: 'Architect and execute rigorous A/B and multivariate experiments using tools like Convert, Intelligems, and LaunchDarkly.',
        ar: 'هندسة وإدارة تجارب تقسيم الزوار المتعددة بدقة بالاعتماد على أدوات Convert وIntelligems وLaunchDarkly.',
      },
      {
        en: 'Diagnose and remediate bottlenecks in Core Web Vitals to maintain sub-second page rendering and eliminate bounce rates.',
        ar: 'فحص ومعالجة أي اختناقات في سرعة التصفح لضمان تحميل فوري وخفض معدلات الارتداد.',
      },
    ],
    requirements: [
      {
        en: '5+ years of production experience in web development with deep expertise in Shopify Liquid, Storefront API, JavaScript/TypeScript, and React.',
        ar: 'خبرة تزيد عن 5 سنوات في تطوير الويب مع إتقان متقدم لـ Shopify Liquid وStorefront API وTypeScript وReact.',
      },
      {
        en: 'Proven track record of improving e-commerce conversion rates (CVR) and Average Order Value (AOV).',
        ar: 'سجل حافل في رفع معدلات التحويل (CVR) ومتوسط قيمة السلة الشرائية (AOV) للمتاجر الإلكترونية.',
      },
      {
        en: 'Deep knowledge of web analytics, Google Tag Manager, custom dataLayers, and server-side tracking.',
        ar: 'معرفة معمقة بتحليلات الويب، وGoogle Tag Manager، وطبقات البيانات المخصصة dataLayers، والتتبع السحابي.',
      },
    ],
    preferredQualifications: [
      {
        en: 'Hands-on experience with Next.js Commerce and Edge caching strategies.',
        ar: 'خبرة عملية مع Next.js Commerce واستراتيجيات التخزين المؤقت الطرفي (Edge Caching).',
      },
    ],
    techStack: ['Shopify Plus', 'Liquid', 'Hydrogen', 'TypeScript', 'Tailwind CSS', 'GraphQL', 'Convert.com', 'Intelligems'],
    benefits: [
      {
        en: 'Flexible working environment with high trust, async collaboration, and zero micromanagement.',
        ar: 'بيئة عمل مرنة قائمة على الثقة العالية والتواصل غير المتزامن وغياب الإدارة التفصيلية.',
      },
      {
        en: 'Annual education grant and complete certification sponsorships.',
        ar: 'منحة تعليمية سنوية وتكفل كامل برسوم الشهادات الاحترافية العالمية.',
      },
    ],
  },
  {
    id: 'job-5',
    slug: 'vp-client-strategy-growth',
    title: {
      en: 'VP of Client Strategy & Enterprise Partnerships',
      ar: 'نائب الرئيس لاستراتيجيات العملاء والشراكات المؤسسية',
    },
    department: {
      en: 'Client Strategy',
      ar: 'استراتيجيات العملاء والشراكات',
    },
    departmentSlug: 'strategy',
    location: {
      en: 'Riyadh & Dubai Hubs',
      ar: 'مقري الرياض ودبي',
    },
    locationSlug: 'riyadh',
    type: {
      en: 'Full-Time',
      ar: 'دوام كامل',
    },
    experience: {
      en: 'Executive (8+ Years)',
      ar: 'مستوى تنفيذي أول (8+ سنوات)',
    },
    workPolicy: {
      en: 'On-site Hub with Regional Travel',
      ar: 'مقر مؤسسي مع سفر إقليمي دوري',
    },
    salaryRange: {
      en: 'SAR 45,000 – 60,000 / mo + Equity & Retainer Share',
      ar: '45,000 – 60,000 ريال / شهرياً + أسهم ونسبة عقود',
    },
    featured: true,
    isActive: true,
    postedDate: '2026-03-07',
    summary: {
      en: 'Drive transformative digital growth roadmaps and multi-year engagements for top-tier retail conglomerates, holding companies, and VC-backed scaleups.',
      ar: 'قيادة خارطة طريق التحول والنمو الرقمي والشراكات طويلة الأجل لكبرى مجموعات التجزئة والشركات القابضة والشركات الصاعدة في المنطقة.',
    },
    mission: {
      en: 'Our enterprise clients look to Persici not as a vendor, but as an indispensable extension of their executive leadership. As VP of Client Strategy, you will be the chief growth architect for our most pivotal partnerships, orchestrating engineering, media, and creative capabilities into coherent, multi-million-dollar transformations.',
      ar: 'ينظر عملاؤنا المؤسسيون إلى برسيسي كشريك تنفيذي استراتيجي لا كجهة توريد خارجية. بصفتك نائباً للرئيس، ستكون مهندس النمو الرئيسي لأهم شراكاتنا، موجهاً قدرات الهندسة والوسائط والإبداع في منظومة تحولية شاملة تحقق عوائد بملايين الدولارات.',
    },
    responsibilities: [
      {
        en: 'Lead relationship governance, executive quarterly business reviews (QBRs), and strategic visioning with C-suite stakeholders.',
        ar: 'إدارة حوكمة العلاقات المؤسسية، ومراجعات الأعمال الربع سنوية (QBRs)، والرؤية المشتركة مع الإدارة التنفيذية العليا.',
      },
      {
        en: 'Orchestrate cross-functional delivery pods (engineering, performance media, creative, and analytics) to guarantee SLA execution.',
        ar: 'مواءمة فرق العمل المتعددة (الهندسة، التسويق الأدائي، الإبداع، والبيانات) لضمان تحقيق مستهدفات اتفاقيات الخدمة بأعلى معايير الجودة.',
      },
      {
        en: 'Structure enterprise expansion opportunities, upsell roadmaps, and value-based pricing agreements.',
        ar: 'صياغة استراتيجيات التوسع للعملاء الحاليين، وإعداد مقترحات القيمة المضافة، والاتفاقيات القائمة على تقاسم العوائد.',
      },
    ],
    requirements: [
      {
        en: '8+ years of leadership experience in digital strategy, management consulting (Tier-1), or top-tier digital growth agencies.',
        ar: 'خبرة قيادية لا تقل عن 8 سنوات في الاستشارات الاستراتيجية الرقمية، أو كبرى بيوت الاستشارات العالمية، أو وكالات النمو الرائدة.',
      },
      {
        en: 'Deep mastery of the GCC corporate landscape, regulatory frameworks, retail dynamics, and digital consumer trends.',
        ar: 'فهم عميق لبيئة الأعمال الخليجية، والأطر التنظيمية، وحركة قطاع التجزئة، وسلوكيات المستهلك الرقمي في المنطقة.',
      },
      {
        en: 'Flawless executive communication and presentation prowess in both Arabic and English.',
        ar: 'قدرة استثنائية على التواصل والعرض التنفيذي الرفيع باللغتين العربية والإنجليزية.',
      },
    ],
    preferredQualifications: [
      {
        en: 'MBA or Master’s in Economics, Business Administration, or Computer Science.',
        ar: 'ماجستير في إدارة الأعمال (MBA) أو الاقتصاد أو علوم الحاسوب.',
      },
    ],
    techStack: ['Keynote', 'Notion Enterprise', 'Looker', 'HubSpot Enterprise', 'Linear', 'Slack'],
    benefits: [
      {
        en: 'Significant equity participation in agency growth and key client revenue streams.',
        ar: 'حصة ملكية معتبرة في أسهم الوكالة ونسب مباشرة من عوائد العقود الاستراتيجية الكبرى.',
      },
      {
        en: 'Executive travel allowance, five-star regional accommodations, and private health coverage.',
        ar: 'بدل سفر تنفيذي متكامل، وإقامة فندقية فاخرة في مهام العمل الإقليمية، وتغطية صحية شاملة.',
      },
    ],
  },
  {
    id: 'job-6',
    slug: 'data-attribution-systems-lead',
    title: {
      en: 'Data Architect & Marketing Attribution Lead',
      ar: 'مهندس نظم البيانات ونماذج الإسناد التسويقي المتقدم',
    },
    department: {
      en: 'AI & Data',
      ar: 'الذكاء الاصطناعي والبيانات',
    },
    departmentSlug: 'data',
    location: {
      en: 'Global / Remote',
      ar: 'عن بُعد عالمياً',
    },
    locationSlug: 'remote',
    type: {
      en: 'Full-Time',
      ar: 'دوام كامل',
    },
    experience: {
      en: 'Lead (5+ Years)',
      ar: 'مستوى متقدم / قيادي (5+ سنوات)',
    },
    workPolicy: {
      en: '100% Remote Anywhere (UTC+1 to UTC+4)',
      ar: 'عن بُعد بالكامل من أي مكان (توقيت UTC+1 إلى UTC+4)',
    },
    salaryRange: {
      en: '$70,000 – $95,000 / yr + Performance Alpha',
      ar: '70,000 – 95,000 دولار / سنوياً + حوافز أداء',
    },
    featured: false,
    isActive: true,
    postedDate: '2026-03-08',
    summary: {
      en: 'Build modern data stack pipelines, warehouse attribution models in BigQuery/Snowflake, and automate predictive LTV and churn forecasting.',
      ar: 'بناء مسارات البيانات السحابية الحديثة، وتطوير نماذج الإسناد التسويقي في BigQuery وSnowflake، وأتمتة التنبؤ بالقيمة المستقبلية للعملاء ومعدلات التسرب.',
    },
    mission: {
      en: 'Third-party cookies are dead, and data privacy is paramount. In this role, you will lead the construction of our proprietary data infrastructure—enabling first-party identity resolution, server-side data ingestion, and econometric marketing mix modeling (MMM) for our enterprise portfolio.',
      ar: 'ملفات تعريف الارتباط التقليدية انتهت، وخصوصية البيانات أصبحت أولوية مطلقة. في هذا المنصب، ستقود بناء بنيتنا البيانية المبتكرة التي تمكّن عملائنا من توحيد هوية المستهلكين، وجمع البيانات سحابياً، وتطبيق النمذجة الاقتصادية الرياضية (MMM) لتحقيق أعلى كفاءة تسويقية.',
    },
    responsibilities: [
      {
        en: 'Design and deploy ELT pipelines using dbt, Fivetran, and BigQuery to ingest transactional and ad data.',
        ar: 'تصميم وتشغيل مسارات استخراج وتحويل البيانات (ELT) باستخدام dbt وFivetran وBigQuery لربط بيانات المبيعات والإعلانات.',
      },
      {
        en: 'Implement statistical Marketing Mix Modeling (MMM) using Robyn or Meridian to quantify non-digital and digital media impact.',
        ar: 'تطبيق نماذج المزيج التسويقي الإحصائية (MMM) باستخدام Robyn أو Meridian لقياس أثر القنوات التسويقية بدقة رياضية.',
      },
      {
        en: 'Develop automated data health monitors and anomaly detection models flagging discrepancies before they impact spend.',
        ar: 'تطوير نماذج كشف الشذوذ والمراقبة الآلية لجودة البيانات للتحذير الفوري قبل أن تتأثر القرارات الاستثمارية.',
      },
    ],
    requirements: [
      {
        en: '5+ years building production analytics engineering pipelines with deep SQL, Python, dbt, and cloud data warehouse expertise.',
        ar: 'خبرة تزيد عن 5 سنوات في هندسة تحليلات البيانات مع إتقان متقدم لـ SQL وPython وdbt ومستودعات البيانات السحابية.',
      },
      {
        en: 'Extensive experience with first-party tracking, Meta CAPI, Google Enhanced Conversions, and modern CDPs (Segment, RudderStack).',
        ar: 'خبرة عملية واسعة في التتبع بالطرف الأول وواجهات Meta CAPI وGoogle Enhanced Conversions ومنصات بيانات العملاء (Segment/RudderStack).',
      },
      {
        en: 'Solid foundation in statistical methods, regression modeling, and causal inference.',
        ar: 'أساس متين في الأساليب الإحصائية ونماذج الانحدار وتحليلات الاستدلال السببي.',
      },
    ],
    preferredQualifications: [
      {
        en: 'Experience working in rapid-growth e-commerce or venture-backed tech environments.',
        ar: 'خبرة سابقة في بيئات التجارة الإلكترونية السريعة أو شركات التكنولوجيا المدعومة استثمارياً.',
      },
    ],
    techStack: ['BigQuery', 'dbt', 'Python', 'Snowflake', 'Fivetran', 'RudderStack', 'PostgreSQL', 'Meridian / Robyn'],
    benefits: [
      {
        en: '100% remote flexibility with home office stipend and co-working pass budget.',
        ar: 'حرية العمل عن بُعد بنسبة 100% مع بدل تجهيز مكتبي وبطاقة اشتراك في مساحات العمل المشتركة.',
      },
      {
        en: 'Annual team retreat in Dubai or Europe with all travel and accommodation covered.',
        ar: 'ملتقى سنوي شامل لكافة أعضاء الفريق في دبي أو أوروبا مع تغطية كاملة لتكاليف السفر والإقامة.',
      },
    ],
  },
];

// ============================================================================
// 2. Careers Hub Master Dataset
// ============================================================================
export const careersHubData: CareersHubData = {
  hero: {
    badge: {
      en: 'The Persici Collective • Careers & Culture',
      ar: 'مجتمع برسيسي • الوظائف وثقافة العمل',
    },
    title: {
      en: 'Architect the Future of Digital Commerce & AI',
      ar: 'اصنع مستقبل التجارة الرقمية والذكاء الاصطناعي معنا',
    },
    description: {
      en: 'We are a high-velocity collective of engineers, growth tacticians, and brand visionaries. We build iconic digital platforms, deploy proprietary AI workflows, and scale premier brands across the GCC, Scandinavia, and Europe.',
      ar: 'نحن نخبة من المهندسين ومبتكري النمو وصناع الهويات البصرية الأكثر طموحاً. نبني منصات رقمية فارقة، وننشر أنظمة ذكاء اصطناعي رائدة، ونقود نمو أبرز العلامات التجارية في الخليج وأوروبا.',
    },
    stats: [
      {
        value: '100%',
        number: 100,
        suffix: { en: '%', ar: '%' },
        label: {
          en: 'High-Impact Autonomous Pods',
          ar: 'فرق ذاتية القيادة عالية الأثر',
        },
      },
      {
        value: '3 Hubs',
        number: 3,
        suffix: { en: ' Hubs', ar: ' مراكز إقليمية' },
        label: {
          en: 'Dubai HQ • Riyadh • Amman + Remote',
          ar: 'مقر دبي • الرياض • عمّان + عن بُعد',
        },
      },
      {
        value: '4.9 / 5',
        number: 4.9,
        decimals: 1,
        suffix: { en: ' / 5', ar: ' / 5' },
        label: {
          en: 'Team Fulfillment & Growth Score',
          ar: 'معدل الرضا والتطور المهني',
        },
      },
      {
        value: '14+',
        number: 14,
        suffix: { en: '+', ar: '+' },
        label: {
          en: 'Nationalities Across the Collective',
          ar: 'جنسية تلتقي تحت مظلة واحدة',
        },
      },
    ],
  },
  culture: {
    badge: {
      en: 'Life at Persici',
      ar: 'الحياة في برسيسي',
    },
    title: {
      en: 'Where Craftsmanship Meets Velocity',
      ar: 'حيث يلتقي الإتقان الحرفي بالسرعة الاستثنائية',
    },
    description: {
      en: 'We rejected corporate bureaucracy in favor of sharp minds, radical transparency, and deep craft. Here, you work directly with partners, ship code that moves millions, and grow at an exponential rate.',
      ar: 'تخلينا عن البيروقراطية المؤسسية العقيمة لصالح العقول الوقادة، والشفافية التامة، والإتقان الفني الرفيع. هنا، ستعمل مباشرة مع الشركاء التنفيذيين، وتطلق برمجيات تحرك ملايين الدولارات، وتتطور مهنياً بوتيرة متسارعة.',
    },
    photos: [
      {
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        title: {
          en: 'Engineering Sprint & AI Hackathon',
          ar: 'جلسة برمجة مكثفة وماراثون الذكاء الاصطناعي',
        },
        location: {
          en: 'Dubai Innovation Lab',
          ar: 'مختبر الابتكار في دبي',
        },
      },
      {
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
        title: {
          en: 'Creative Review & Brand Motion Studio',
          ar: 'مراجعة الهويات الإبداعية واستوديو الحركة',
        },
        location: {
          en: 'Riyadh Growth Hub',
          ar: 'مقر النمو في الرياض',
        },
      },
      {
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
        title: {
          en: 'Cross-Disciplinary Strategy Sync',
          ar: 'مزامنة استراتيجية متعددة التخصصات',
        },
        location: {
          en: 'Amman Tech Hub',
          ar: 'مقر التكنولوجيا في عمّان',
        },
      },
      {
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
        title: {
          en: 'Global All-Hands & Strategy Retreat',
          ar: 'الملتقى الاستراتيجي السنوي للفريق',
        },
        location: {
          en: 'Global Collective',
          ar: 'لقاء الفريق العالمي',
        },
      },
    ],
  },
  perks: {
    badge: {
      en: 'Executive Benefits & Total Rewards',
      ar: 'المزايا التنفيذية والمكافآت الشاملة',
    },
    title: {
      en: 'Engineered for Mastery, Wellbeing & Wealth',
      ar: 'مصممة للتميز المهني، الراحة الشخصية، وبناء الثروة',
    },
    subtitle: {
      en: 'We believe exceptional builders should be treated and compensated exceptionally. Our total rewards model is transparent, competitive, and designed for long-term compounding.',
      ar: 'نؤمن بأن المبدعين الاستثنائيين يستحقون تقديراً ومكافآت استثنائية. نموذج مكافآتنا يتسم بالشفافية الكاملة، والمنافسة العالية، ومصمم لبناء قيمة مستدامة طويلة الأجل.',
    },
    items: [
      {
        id: 'perk-1',
        title: {
          en: 'Global Hub Mobility & Remote Freedom',
          ar: 'حرية التنقل بين المقرات والعمل عن بُعد',
        },
        description: {
          en: 'Hot-desk freely across Dubai HQ, Riyadh, and Amman hubs, or work from anywhere with flexible async rhythms.',
          ar: 'تنقل بحرية بين مكاتبنا في دبي والرياض وعمّان، أو اعمل من أي مكان في العالم بنظام تواصل غير متزامن فائق المرونة.',
        },
        tag: {
          en: 'Anywhere Mindset',
          ar: 'مرونة بلا حدود',
        },
        iconName: 'Globe',
      },
      {
        id: 'perk-2',
        title: {
          en: 'Alpha Equity & Performance Profit-Share',
          ar: 'أسهم ملكية وحوافز أرباح مباشرة',
        },
        description: {
          en: 'Participate directly in our agency’s upside through structured equity grants and quarterly performance profit-sharing.',
          ar: 'شارك مباشرة في نجاحاتنا ونمونا من خلال منح أسهم ملكية حقيقية وتوزيعات أرباح ربع سنوية مرتبطة بنتائج الأداء.',
        },
        tag: {
          en: 'Wealth Building',
          ar: 'شراكة في النجاح',
        },
        iconName: 'TrendingUp',
      },
      {
        id: 'perk-3',
        title: {
          en: 'Annual Mastery Stipend ($3,000/yr)',
          ar: 'ميزانية سنوية للتطوير والتعلم (3,000$)',
        },
        description: {
          en: 'Dedicated annual budget for international conferences, professional certifications, book allowances, and bespoke coaching.',
          ar: 'ميزانية سنوية خاصة لحضور المؤتمرات العالمية، والشهادات المهنية المعتمدة، وشراء الكتب والتدريب التخصصي.',
        },
        tag: {
          en: 'Lifelong Craft',
          ar: 'تطور مستمر',
        },
        iconName: 'GraduationCap',
      },
      {
        id: 'perk-4',
        title: {
          en: 'Top-Tier Health & Wellness Concierge',
          ar: 'رعاية صحية وتأمين طبي لكبار الشخصيات',
        },
        description: {
          en: 'Comprehensive VIP medical, dental, and optical coverage across the GCC and Europe, with mental wellbeing coaching access.',
          ar: 'تغطية طبية شاملة وممتازة للأسنان والعيون في الخليج وأوروبا، مع استشارات مجانية للصحة النفسية والذهنية.',
        },
        tag: {
          en: 'Holistic Health',
          ar: 'رعاية متكاملة',
        },
        iconName: 'HeartHandshake',
      },
      {
        id: 'perk-5',
        title: {
          en: 'M-Series Gear & $2,500 Home Office Budget',
          ar: 'أحدث عتاد Apple وميزانية تجهيز مكتبي (2,500$)',
        },
        description: {
          en: 'Top-spec MacBook Pro M-series workstation of your choice, external 4K displays, and ergonomic chair allowance.',
          ar: 'أحدث جهاز MacBook Pro M-series من اختيارك، وشاشات 4K فائقة الدقة، وميزانية لتجهيز بيئة عملك المنزلية.',
        },
        tag: {
          en: 'Hardware Excellence',
          ar: 'أعلى المعايير التقنية',
        },
        iconName: 'Laptop',
      },
      {
        id: 'perk-6',
        title: {
          en: 'Unlimited Recharge & Generous Family Leave',
          ar: 'إجازات مرنة بلا حدود وإجازة أمومة وأبوة رائدة',
        },
        description: {
          en: 'High-trust flexible paid time off, 25+ days standard leave, plus paid parental leaves designed for family milestones.',
          ar: 'إجازات مدفوعة قائمة على الثقة والمسؤولية الذاتية (25+ يوماً قياسياً)، مع إجازات أمومة وأبوة متقدمة لرعاية الأسرة.',
        },
        tag: {
          en: 'Work-Life Harmony',
          ar: 'توازن واستدامة',
        },
        iconName: 'Sun',
      },
    ],
  },
  process: {
    badge: {
      en: 'Our Hiring Transparency',
      ar: 'شفافية مسار التوظيف لدينا',
    },
    title: {
      en: 'Respectful, Fast & Transparent Journey',
      ar: 'مسار توظيف يتسم بالاحترام، السرعة، والوضوح التام',
    },
    subtitle: {
      en: 'We despise 8-round corporate interviews. Our hiring process is calibrated to evaluate real craft, respect your time, and provide feedback at every milestone within 48 business hours.',
      ar: 'نمقت جولات المقابلات البيروقراطية اللانهائية. مسار التوظيف لدينا مصمم لتقييم المهارة العملية الحقيقية، واحترام وقتك، وتقديم إجابات واضحة خلال 48 ساعة عمل.',
    },
    steps: [
      {
        step: '01',
        title: {
          en: 'Application & Dossier Review',
          ar: 'مراجعة الطلب ومعرض الأعمال',
        },
        duration: {
          en: 'Within 48 Hours',
          ar: 'خلال 48 ساعة',
        },
        description: {
          en: 'Our department leads review your CV, GitHub, or portfolio. No algorithmic filters; real human experts assess your craft.',
          ar: 'يقوم قادة الأقسام بأنفسهم بمراجعة سيرتك ومعرض أعمالك؛ بلا مرشحات آلية بل خبراء حقيقيون يقدرون إتقانك.',
        },
      },
      {
        step: '02',
        title: {
          en: 'Cultural & Alignment Conversation',
          ar: 'جلسة المواءمة الثقافية والرؤية',
        },
        duration: {
          en: '30 Minutes • Video Call',
          ar: '30 دقيقة • اتصال مرئي',
        },
        description: {
          en: 'A low-friction, mutual dialogue to explore expectations, your career trajectory, our values, and team dynamics.',
          ar: 'حوار هادئ وبناء للتعرف المتبادل، واستكشاف طموحاتك المهنية، وقيمنا المشتركة، وديناميكية الفريق.',
        },
      },
      {
        step: '03',
        title: {
          en: 'Practical Craft Challenge',
          ar: 'تحدي المهارة العملية التطبيقية',
        },
        duration: {
          en: 'Practical & Realistic • Paid',
          ar: 'عملي وواقعي • مدفوع الأجر',
        },
        description: {
          en: 'No abstract puzzle questions. A real-world challenge simulating our daily workflow, followed by a collaborative discussion.',
          ar: 'لا أسئلة ألغاز نظرية معقدة؛ بل مهمة واقعية تحاكي طبيعة عملنا اليومية، تليها جلسة نقاشية تفاعلية.',
        },
      },
      {
        step: '04',
        title: {
          en: 'The Offer & Welcome to the Collective',
          ar: 'العرض الوظيفي والانضمام للنخبة',
        },
        duration: {
          en: 'Within 48 Hours Post-Challenge',
          ar: 'خلال 48 ساعة من انتهاء التحدي',
        },
        description: {
          en: 'A transparent, competitive offer outlining compensation, equity, and start logistics, followed by high-touch onboarding.',
          ar: 'عرض وظيفي شفاف وتنافسي يوضح الراتب والأسهم والمزايا، يليه برنامج تأهيل واستقبال استثنائي.',
        },
      },
    ],
  },
  spontaneous: {
    badge: {
      en: 'Open Talent Collective',
      ar: 'باب الانضمام مفتوح دائماً',
    },
    title: {
      en: 'Don’t See Your Exact Role? We Always Hire Visionaries.',
      ar: 'لم تجد المسمى المناسب لك؟ أبوابنا مفتوحة دائماً للمبدعين الاستثنائيين.',
    },
    description: {
      en: 'Exceptional talent often defies rigid job descriptions. If you are a world-class creator, engineer, or growth architect who believes they can elevate our collective, we want to hear from you.',
      ar: 'المواهب الاستثنائية تتجاوز التصنيفات الوظيفية التقليدية. إذا كنت تملك مهارات عالمية في الهندسة أو الإبداع أو استراتيجيات النمو، وتؤمن بقدرتك على إحداث نقلة نوعية معنا، فنحن بانتظار تواصلك.',
    },
    ctaText: {
      en: 'Submit a Spontaneous Application',
      ar: 'قدم طلب انضمام عام للوكالة',
    },
  },
  faqs: {
    badge: {
      en: 'Candidate Inquiries',
      ar: 'استفسارات المرشحين الشائعة',
    },
    title: {
      en: 'Frequently Asked Questions',
      ar: 'الأسئلة الأكثر تكراراً',
    },
    subtitle: {
      en: 'Everything you need to know about our hiring rhythms, visa sponsorships, remote policies, and working arrangements.',
      ar: 'كل ما تحتاج لمعرفته حول وتيرة التوظيف، رعاية التأشيرات، سياسات العمل عن بُعد، وبيئة العمل.',
    },
    items: [
      {
        id: 'faq-1',
        question: {
          en: 'Do you offer relocation and visa sponsorship for regional offices?',
          ar: 'هل تقدمون رعاية التأشيرة والمساعدة في الانتقال لمكاتبكم الإقليمية؟',
        },
        answer: {
          en: 'Yes. For roles based in Dubai (UAE) and Riyadh (Saudi Arabia), we handle complete employment visa processing, medical examinations, relocation stipends, and initial housing assistance for verified candidates.',
          ar: 'نعم بالتأكيد. للوظائف المعتمدة في دبي (الإمارات) والرياض (السعودية)، تتكفل الوكالة بإجراءات الإقامة والتأشيرة كاملة، والفحوصات الطبية، وبدل الانتقال، والمساعدة في السكن الأولي.',
        },
      },
      {
        id: 'faq-2',
        question: {
          en: 'Can I apply for a role as a 100% remote team member?',
          ar: 'هل يمكنني التقدم لأي وظيفة والعمل عن بُعد بنسبة 100%؟',
        },
        answer: {
          en: 'Yes. Many of our roles (especially in Engineering, AI, and Data) are remote-friendly. We hire across the GCC, Levant, and Europe as long as your working hours overlap significantly with UTC+1 to UTC+4.',
          ar: 'نعم، العديد من وظائفنا (خاصة في الهندسة والذكاء الاصطناعي وتحليل البيانات) تدعم العمل عن بُعد بالكامل عبر دول الخليج وبلاد الشام وأوروبا، شريطة توافق ساعات العمل مع توقيت UTC+1 إلى UTC+4.',
        },
      },
      {
        id: 'faq-3',
        question: {
          en: 'How fast will I hear back after submitting my application?',
          ar: 'ما هي المدة المتوقعة لتلقي الرد بعد تقديم طلبي؟',
        },
        answer: {
          en: 'We adhere to a strict 48 to 72 business-hour review policy. Every single submission is reviewed by a human lead, and you will receive a notification regarding your candidacy status.',
          ar: 'نلتزم بسياسة مراجعة صارمة تتراوح بين 48 و72 ساعة عمل. يتم تقييم كل طلب بشكل دقيق بواسطة قائد القسم المختص وستتلقى إشعاراً واضحاً بحالة ترشحك.',
        },
      },
      {
        id: 'faq-4',
        question: {
          en: 'How is compensation structured at Persici Agency?',
          ar: 'كيف يُهيكل نظام الرواتب والمكافآت في وكالة برسيسي؟',
        },
        answer: {
          en: 'We benchmark our compensation packages against the top 10% of tech firms and premier agencies in the region. Most positions include a competitive base salary, quarterly performance bonuses, and equity grants for lead roles.',
          ar: 'نحدد رواتبنا ومكافآتنا وفقاً لأعلى 10% في قطاع التكنولوجيا والوكالات الرائدة في المنطقة. تشمل الحزم راتباً أساسياً مجزياً، وحوافز ربع سنوية، وأسهم ملكية للمناصب القيادية.',
        },
      },
    ],
  },
};

// ============================================================================
// 3. Helper Functions
// ============================================================================
export function getAllCareers(): CareerJobOpening[] {
  return careerOpenings.filter((job) => job.isActive);
}

export function getCareerBySlug(slug: string): CareerJobOpening | undefined {
  return careerOpenings.find((job) => job.slug === slug && job.isActive);
}

export function getRelatedCareers(currentSlug: string, limit: number = 2): CareerJobOpening[] {
  const current = getCareerBySlug(currentSlug);
  return careerOpenings
    .filter((job) => job.slug !== currentSlug && job.isActive)
    .sort((a, b) => {
      // Prioritize same department
      if (current && a.departmentSlug === current.departmentSlug && b.departmentSlug !== current.departmentSlug) return -1;
      if (current && b.departmentSlug === current.departmentSlug && a.departmentSlug !== current.departmentSlug) return 1;
      return 0;
    })
    .slice(0, limit);
}
