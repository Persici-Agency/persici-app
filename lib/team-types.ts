export interface TeamLocalizedString {
  en: string;
  ar: string;
}

export type TeamBlockType = 'paragraph' | 'image' | 'code' | 'list';

export type TeamImageSize = 'sm' | 'md' | 'lg' | 'full';

export interface TeamListItem {
  id: string;
  label?: TeamLocalizedString;
  text: TeamLocalizedString;
}

export interface TeamContentBlock {
  id: string;
  type: TeamBlockType;
  /** Paragraph HTML / text (type === 'paragraph') */
  content?: TeamLocalizedString;
  /** Image properties (type === 'image') */
  imageUrl?: string;
  imageAlt?: TeamLocalizedString;
  imageCaption?: TeamLocalizedString;
  imageSize?: TeamImageSize;
  /** Code block properties (type === 'code') */
  codeTitle?: TeamLocalizedString;
  codeLanguage?: string;
  code?: string;
  /** List / milestones properties (type === 'list') */
  listStyle?: 'bullets' | 'milestones';
  listTitle?: TeamLocalizedString;
  items?: TeamListItem[];
}

export interface TeamMemberSection {
  id: string;
  /** Mandatory section title (non-removable) */
  title: TeamLocalizedString;
  /** Draggable content blocks; must contain >= 1 block */
  blocks: TeamContentBlock[];
}

export interface TeamAiReferenceDoc {
  id: string;
  filename: string;
  extension: string;
  text: string;
  wordCount: number;
  charCount: number;
  metaSummary: string;
  savedAt?: string;
}

export interface TeamMemberDetail {
  id: string;
  _id?: string;
  firstName: TeamLocalizedString;
  lastName: TeamLocalizedString;
  title: TeamLocalizedString;
  avatar: string;
  portfolioUrl?: string;
  /** Main Description composed of draggable content blocks */
  descriptionBlocks: TeamContentBlock[];
  /** Custom draggable sections (each has mandatory title + >= 1 block) */
  sections: TeamMemberSection[];
  order: number;
  active: boolean;
  aiReferences?: TeamAiReferenceDoc[];
  createdAt?: string;
  updatedAt?: string;
}

function makeUid(prefix: string, seed?: number): string {
  const rand = Math.random().toString(36).slice(2, 7);
  return `${prefix}-${Date.now()}-${seed ?? rand}`;
}

export function createEmptyTeamBlock(type: TeamBlockType, seed?: number): TeamContentBlock {
  const id = makeUid(`blk-${type}`, seed);
  if (type === 'image') {
    return {
      id,
      type: 'image',
      imageUrl: '',
      imageAlt: { en: '', ar: '' },
      imageCaption: { en: '', ar: '' },
      imageSize: 'lg',
    };
  }
  if (type === 'code') {
    return {
      id,
      type: 'code',
      codeTitle: { en: 'Sample of TypeScript Code', ar: 'نموذج كود TypeScript' },
      codeLanguage: 'typescript',
      code: `export async function optimizeWorkflow(input: string) {\n  return { status: 'optimized', input };\n}`,
    };
  }
  if (type === 'list') {
    return {
      id,
      type: 'list',
      listStyle: 'milestones',
      listTitle: { en: 'Key Career Milestones', ar: 'أبرز المحطات والإنجازات المهنية' },
      items: [
        {
          id: makeUid('item', 1),
          label: { en: '2025', ar: '2025' },
          text: {
            en: 'Led enterprise digital transformation architecture across regional partners.',
            ar: 'قيادة معمارية التحول الرقمي المؤسسي عبر الشركاء الإقليميين.',
          },
        },
      ],
    };
  }
  return {
    id,
    type: 'paragraph',
    content: { en: '', ar: '' },
  };
}

export function createEmptyTeamSection(index = 1): TeamMemberSection {
  return {
    id: makeUid('sec', index),
    title: {
      en: `Expertise & Impact Section ${index}`,
      ar: `قسم الخبرة والأثر ${index}`,
    },
    blocks: [createEmptyTeamBlock('paragraph', index)],
  };
}

function normalizeBi(
  val: unknown,
  fallbackEn = '',
  fallbackAr = ''
): TeamLocalizedString {
  if (typeof val === 'string') {
    const clean = val.trim();
    return { en: clean || fallbackEn, ar: clean || fallbackAr || fallbackEn };
  }
  if (val && typeof val === 'object') {
    const rec = val as { en?: unknown; ar?: unknown };
    const en = typeof rec.en === 'string' ? rec.en : fallbackEn;
    const ar = typeof rec.ar === 'string' ? rec.ar : fallbackAr || en;
    return { en, ar };
  }
  return { en: fallbackEn, ar: fallbackAr || fallbackEn };
}

export function normalizeTeamBlock(raw: unknown, idx = 0): TeamContentBlock {
  const rec = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const rawType = String(rec.type || 'paragraph');
  const type: TeamBlockType =
    rawType === 'image' || rawType === 'code' || rawType === 'list' ? rawType : 'paragraph';

  const id = typeof rec.id === 'string' && rec.id.trim() ? rec.id.trim() : makeUid(`blk-${type}`, idx);

  if (type === 'image') {
    const sz = rec.imageSize;
    const imageSize: TeamImageSize =
      sz === 'sm' || sz === 'md' || sz === 'lg' || sz === 'full' ? sz : 'lg';
    return {
      id,
      type: 'image',
      imageUrl: typeof rec.imageUrl === 'string' ? rec.imageUrl.trim() : '',
      imageAlt: normalizeBi(rec.imageAlt),
      imageCaption: normalizeBi(rec.imageCaption),
      imageSize,
    };
  }

  if (type === 'code') {
    return {
      id,
      type: 'code',
      codeTitle: normalizeBi(rec.codeTitle, 'Code Sample', 'نموذج برمجي'),
      codeLanguage:
        typeof rec.codeLanguage === 'string' && rec.codeLanguage.trim()
          ? rec.codeLanguage.trim()
          : 'typescript',
      code: typeof rec.code === 'string' ? rec.code : '',
    };
  }

  if (type === 'list') {
    const rawItems = Array.isArray(rec.items) ? rec.items : [];
    const items: TeamListItem[] =
      rawItems.length > 0
        ? rawItems.map((it, itemIdx) => {
            const itemRec = (it && typeof it === 'object' ? it : {}) as Record<string, unknown>;
            return {
              id:
                typeof itemRec.id === 'string' && itemRec.id.trim()
                  ? itemRec.id.trim()
                  : makeUid('item', itemIdx),
              label: normalizeBi(itemRec.label),
              text: normalizeBi(itemRec.text),
            };
          })
        : [
            {
              id: makeUid('item', 0),
              label: { en: '', ar: '' },
              text: { en: '', ar: '' },
            },
          ];

    return {
      id,
      type: 'list',
      listStyle: rec.listStyle === 'bullets' ? 'bullets' : 'milestones',
      listTitle: normalizeBi(rec.listTitle),
      items,
    };
  }

  return {
    id,
    type: 'paragraph',
    content: normalizeBi(rec.content),
  };
}

export function normalizeTeamMember(
  raw: unknown,
  fallbackIndex = 0
): TeamMemberDetail {
  const rec = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const id =
    typeof rec.id === 'string' && rec.id.trim()
      ? rec.id.trim()
      : rec._id
      ? String(rec._id)
      : `member-${fallbackIndex + 1}`;

  const rawBlocks = Array.isArray(rec.descriptionBlocks) ? rec.descriptionBlocks : [];
  const descriptionBlocks: TeamContentBlock[] =
    rawBlocks.length > 0
      ? rawBlocks.map((b, i) => normalizeTeamBlock(b, i))
      : [createEmptyTeamBlock('paragraph', fallbackIndex)];

  const rawSections = Array.isArray(rec.sections) ? rec.sections : [];
  const sections: TeamMemberSection[] = rawSections.map((sec, sIdx) => {
    const secRec = (sec && typeof sec === 'object' ? sec : {}) as Record<string, unknown>;
    const blocksRaw = Array.isArray(secRec.blocks) ? secRec.blocks : [];
    const blocks =
      blocksRaw.length > 0
        ? blocksRaw.map((b, bIdx) => normalizeTeamBlock(b, bIdx))
        : [createEmptyTeamBlock('paragraph', sIdx)];
    return {
      id:
        typeof secRec.id === 'string' && secRec.id.trim()
          ? secRec.id.trim()
          : makeUid('sec', sIdx),
      title: normalizeBi(
        secRec.title,
        `Section ${sIdx + 1}`,
        `القسم ${sIdx + 1}`
      ),
      blocks,
    };
  });

  const orderNum =
    typeof rec.order === 'number' && Number.isFinite(rec.order)
      ? rec.order
      : fallbackIndex + 1;

  return {
    id,
    ...(rec._id ? { _id: String(rec._id) } : {}),
    firstName: normalizeBi(rec.firstName),
    lastName: normalizeBi(rec.lastName),
    title: normalizeBi(rec.title),
    avatar: typeof rec.avatar === 'string' ? rec.avatar.trim() : '',
    portfolioUrl: typeof rec.portfolioUrl === 'string' ? rec.portfolioUrl.trim() : '',
    descriptionBlocks,
    sections,
    order: orderNum,
    active: rec.active !== false,
    ...(Array.isArray(rec.aiReferences)
      ? { aiReferences: rec.aiReferences as TeamAiReferenceDoc[] }
      : {}),
    ...(typeof rec.createdAt === 'string' ? { createdAt: rec.createdAt } : {}),
    ...(typeof rec.updatedAt === 'string' ? { updatedAt: rec.updatedAt } : {}),
  };
}

export function getMemberFullName(
  member: Pick<TeamMemberDetail, 'firstName' | 'lastName'>,
  lang: string
): string {
  const l = lang === 'ar' ? 'ar' : 'en';
  const first = (member.firstName?.[l] || member.firstName?.en || '').trim();
  const last = (member.lastName?.[l] || member.lastName?.en || '').trim();
  return [first, last].filter(Boolean).join(' ');
}

export function validateTeamMemberPayload(member: TeamMemberDetail): string | null {
  if (!member.firstName.en.trim() && !member.firstName.ar.trim()) {
    return 'First Name is required in at least one language.';
  }
  if (!member.lastName.en.trim() && !member.lastName.ar.trim()) {
    return 'Last Name is required in at least one language.';
  }
  if (!member.title.en.trim() && !member.title.ar.trim()) {
    return 'Role / Title is required in at least one language.';
  }
  for (let i = 0; i < member.sections.length; i++) {
    const sec = member.sections[i];
    if (!sec.title.en.trim() && !sec.title.ar.trim()) {
      return `Custom Section #${i + 1} requires a mandatory title.`;
    }
    if (!Array.isArray(sec.blocks) || sec.blocks.length === 0) {
      return `Custom Section "${sec.title.en || sec.title.ar}" must contain at least one content block.`;
    }
  }
  return null;
}

export const DEFAULT_TEAM_MEMBERS: TeamMemberDetail[] = [
  {
    id: 'team-ahmed-magdy',
    firstName: { en: 'Ahmed', ar: 'أحمد' },
    lastName: { en: 'Magdy', ar: 'مجدي' },
    title: {
      en: 'Software Tester & Quality Assurance (QA)',
      ar: 'مهندس اختبار البرمجيات وضمان الجودة (QA)',
    },
    avatar:
      'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/general/ahmed-magdy-1793017580332.webp',
    portfolioUrl: '',
    descriptionBlocks: [
      {
        id: 'ahmed-magdy-bio-1',
        type: 'paragraph',
        content: {
          en: '<p>Leads end-to-end quality engineering, automated test coverage, and release reliability validation across Persici web and mobile platforms.</p>',
          ar: '<p>يقود هندسة ضمان الجودة والاختبارات الشاملة وموثوقية الإصدارات عبر منصات الويب وتطبيقات الهواتف الذكية.</p>',
        },
      },
    ],
    sections: [],
    order: 1,
    active: true,
  },
  {
    id: 'team-mahmood-fathi',
    firstName: { en: 'Mahmood', ar: 'محمود' },
    lastName: { en: 'Fathi', ar: 'فتحي' },
    title: {
      en: 'Mobile Application Developer',
      ar: 'مطور تطبيقات الهواتف الذكية',
    },
    avatar:
      'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/general/doc-mahmoud-1793017588727.webp',
    portfolioUrl: '',
    descriptionBlocks: [
      {
        id: 'mahmood-fathi-bio-1',
        type: 'paragraph',
        content: {
          en: '<p>Engineers native and cross-platform iOS and Android applications focused on smooth UX, offline resilience, and scalable mobile architectures.</p>',
          ar: '<p>يصمم ويطور تطبيقات الهواتف الذكية لأنظمة iOS وAndroid بأداء سلس وتجربة مستخدم عالية الكفاءة وقابلية توسع متقدمة.</p>',
        },
      },
    ],
    sections: [],
    order: 2,
    active: true,
  },
  {
    id: 'team-ziad-ahmed',
    firstName: { en: 'Ziad', ar: 'زياد' },
    lastName: { en: 'Ahmed', ar: 'أحمد' },
    title: {
      en: 'Front-End Developer',
      ar: 'مطور واجهات المستخدم الأمامية (Front-End)',
    },
    avatar:
      'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/general/ziad-ahmed-1793017591531.webp',
    portfolioUrl: '',
    descriptionBlocks: [
      {
        id: 'ziad-ahmed-bio-1',
        type: 'paragraph',
        content: {
          en: '<p>Crafts responsive React and Next.js interfaces with pixel-accurate design systems, RTL/LTR bilingual parity, and fluid micro-interactions.</p>',
          ar: '<p>يبني واجهات React وNext.js متجاوبة بدقة تصميم عالية، مع دعم متكامل للغتين العربية والإنجليزية وحركات تفاعلية سلسة.</p>',
        },
      },
    ],
    sections: [],
    order: 3,
    active: true,
  },
  {
    id: 'team-mohamed-aref',
    firstName: { en: 'Mohamed', ar: 'محمد' },
    lastName: { en: 'Aref', ar: 'عارف' },
    title: {
      en: 'Back-End Developer & AI Specialist',
      ar: 'مطور الأنظمة الخلفية وأخصائي الذكاء الاصطناعي',
    },
    avatar:
      'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/general/mohamed-aref-1793017589899.webp',
    portfolioUrl: '',
    descriptionBlocks: [
      {
        id: 'mohamed-aref-bio-1',
        type: 'paragraph',
        content: {
          en: '<p>Architects scalable backend APIs, cloud data pipelines, and custom enterprise AI integrations powering intelligent automation.</p>',
          ar: '<p>يهندس واجهات البرمجة الخلفية ومسارات البيانات السحابية وتكاملات الذكاء الاصطناعي المخصصة لدعم الأتمتة المؤسسية.</p>',
        },
      },
    ],
    sections: [],
    order: 4,
    active: true,
  },
  {
    id: 'team-amr-ayman',
    firstName: { en: 'Amr', ar: 'عمرو' },
    lastName: { en: 'Ayman', ar: 'أيمن' },
    title: {
      en: 'Back-End Developer',
      ar: 'مطور الأنظمة الخلفية (Back-End)',
    },
    avatar:
      'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/general/amr-ayyman-1793017582396.webp',
    portfolioUrl: '',
    descriptionBlocks: [
      {
        id: 'amr-ayman-bio-1',
        type: 'paragraph',
        content: {
          en: '<p>Builds secure server architectures, database modeling, and high-throughput API integrations for digital products and enterprise portals.</p>',
          ar: '<p>يطور معماريات الخوادم الآمنة وقواعد البيانات وتكاملات واجهات البرمجة عالية الكفاءة للمنصات الرقمية والمؤسسية.</p>',
        },
      },
    ],
    sections: [],
    order: 5,
    active: true,
  },
  {
    id: 'team-ahmed-osama',
    firstName: { en: 'Ahmed', ar: 'أحمد' },
    lastName: { en: 'Osama', ar: 'أسامة' },
    title: {
      en: 'Media Buyer',
      ar: 'أخصائي شراء المساحات الإعلانية وإدارة الحملات',
    },
    avatar:
      'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/general/ahmed-osama-1793017581396.webp',
    portfolioUrl: '',
    descriptionBlocks: [
      {
        id: 'ahmed-osama-bio-1',
        type: 'paragraph',
        content: {
          en: '<p>Drives measurable performance acquisition campaigns across Meta, Google, and TikTok with data-backed budget allocation and ROAS optimization.</p>',
          ar: '<p>يقود حملات الاستحواذ الإعلاني عالية الأداء عبر ميتا وجوجل وتيك توك مع تحسين العائد على الإنفاق الإعلاني.</p>',
        },
      },
    ],
    sections: [],
    order: 6,
    active: true,
  },
];
