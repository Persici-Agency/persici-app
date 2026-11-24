import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { generateStructuredAiJson } from '@/lib/ai-server';
import { getAllProjectsFromDb, getAllProjectCategoriesFromDb } from '@/lib/projects-server';
import type { AiEffectLevel, AiProviderId } from '@/lib/ai-types';
import {
  DEFAULT_CLIENT_STORY_CATEGORIES,
  resolveBilingualText,
  type ClientStoryCategory,
  type ClientStoryDetail,
  type StoryTechBadge,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';

export const runtime = 'nodejs';

export type StoryAiTargetField =
  | 'all'
  | 'meta'
  | 'slug'
  | 'partner'
  | 'client'
  | 'topic'
  | 'region'
  | 'services'
  | 'title'
  | 'leadSubtitle'
  | 'executiveSummary'
  | 'metrics'
  | 'intro'
  | 'problem'
  | 'solution'
  | 'impact'
  | 'section_heading'
  | 'paragraph'
  | 'bullets'
  | 'code_block'
  | 'code_blocks'
  | 'quote'
  | 'tech_stack'
  | 'related_slugs';

export type NarrativeSectionRole = 'intro' | 'problem' | 'solution' | 'impact';

type TechBadgeCategory = NonNullable<StoryTechBadge['category']>;

interface StoryCatalogEntry {
  slug: string;
  client: string;
  title: string;
  categorySlug: string;
  templateType: string;
  topic: string;
  services: string[];
  techStack: string[];
}

const VALID_TECH_CATEGORIES = new Set<TechBadgeCategory>([
  'frontend',
  'backend',
  'database',
  'cloud',
  'tool',
  'design',
]);

const TECH_CATEGORY_ALIASES: Record<string, TechBadgeCategory> = {
  hosting: 'cloud',
  infrastructure: 'cloud',
  devops: 'cloud',
  cdn: 'cloud',
  server: 'backend',
  api: 'backend',
  cms: 'backend',
  ecommerce: 'backend',
  platform: 'backend',
  db: 'database',
  sql: 'database',
  nosql: 'database',
  storage: 'database',
  cache: 'database',
  ui: 'design',
  ux: 'design',
  'ui/ux': 'design',
  creative: 'design',
  fintech: 'tool',
  payment: 'tool',
  payments: 'tool',
  analytics: 'tool',
  seo: 'tool',
  plugin: 'tool',
  sdk: 'tool',
};

function normalizeTechStackBadges(raw: unknown): StoryTechBadge[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const normalized: StoryTechBadge[] = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;
    const rawName = typeof obj.name === 'string' ? obj.name.trim() : '';
    if (!rawName) continue;
    const dedupeKey = rawName.toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const rawCat = typeof obj.category === 'string' ? obj.category.trim().toLowerCase() : 'frontend';
    let category: TechBadgeCategory = 'frontend';
    if (VALID_TECH_CATEGORIES.has(rawCat as TechBadgeCategory)) {
      category = rawCat as TechBadgeCategory;
    } else if (rawCat in TECH_CATEGORY_ALIASES) {
      category = TECH_CATEGORY_ALIASES[rawCat];
    }

    normalized.push({ name: rawName, category });
  }

  return normalized;
}

function tokenizeKeywords(text: string): Set<string> {
  const stopWords = new Set([
    'and',
    'the',
    'for',
    'with',
    'from',
    'into',
    'that',
    'this',
    'full',
    'web',
    'app',
    'apps',
    'platform',
    'digital',
    'enterprise',
    'custom',
    'system',
    'solutions',
    'services',
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !stopWords.has(w));
  return new Set(words);
}

function buildStoriesCatalogSummary(
  dbStories: ClientStoryDetail[],
  excludeSlug?: string
): StoryCatalogEntry[] {
  const excluded = (excludeSlug || '').trim().toLowerCase();
  return dbStories
    .filter((s) => s.slug && s.slug.toLowerCase() !== excluded)
    .map((s) => ({
      slug: s.slug,
      client: resolveBilingualText(s.client, 'en'),
      title: s.title?.en || s.title?.ar || s.slug,
      categorySlug: s.categorySlug,
      templateType: s.templateType,
      topic: s.topic?.en || s.topic?.ar || '',
      services: (s.services || []).map((srv) => srv.en).filter(Boolean),
      techStack: (s.mediaShowcase?.techStack || []).map((t) => t.name).filter(Boolean),
    }));
}

function rankDatabaseRelatedSlugs(params: {
  currentStoryContext?: Record<string, unknown>;
  referenceText: string;
  dbStories: ClientStoryDetail[];
  limit?: number;
}): string[] {
  const { currentStoryContext, referenceText, dbStories, limit = 3 } = params;
  const currentSlug =
    typeof currentStoryContext?.slug === 'string'
      ? currentStoryContext.slug.trim().toLowerCase()
      : '';
  const currentCategory =
    typeof currentStoryContext?.categorySlug === 'string'
      ? currentStoryContext.categorySlug.trim().toLowerCase()
      : '';
  const currentTemplate =
    typeof currentStoryContext?.templateType === 'string'
      ? currentStoryContext.templateType.trim().toLowerCase()
      : '';

  const currentServicesList = Array.isArray(currentStoryContext?.services)
    ? (currentStoryContext.services as Array<{ en?: string; ar?: string }>)
        .map((s) => (typeof s?.en === 'string' ? s.en.trim().toLowerCase() : ''))
        .filter(Boolean)
    : [];

  const topicObj = currentStoryContext?.topic as { en?: string } | undefined;
  const titleObj = currentStoryContext?.title as { en?: string } | undefined;
  const mediaObj = currentStoryContext?.mediaShowcase as
    | { techStack?: Array<{ name?: string }> }
    | undefined;
  const currentTechNames = new Set(
    (mediaObj?.techStack || [])
      .map((t) => (typeof t?.name === 'string' ? t.name.trim().toLowerCase() : ''))
      .filter(Boolean)
  );

  const currentKeywordSet = tokenizeKeywords(
    [
      topicObj?.en || '',
      titleObj?.en || '',
      currentServicesList.join(' '),
      Array.from(currentTechNames).join(' '),
    ].join(' ')
  );
  const refLower = referenceText.toLowerCase();

  const scored = dbStories
    .filter((s) => s.slug && s.slug.toLowerCase() !== currentSlug)
    .map((candidate) => {
      let score = 0;
      const candSlugLower = candidate.slug.toLowerCase();

      if (refLower && refLower.includes(candSlugLower)) {
        score += 100;
      }
      if (currentCategory && candidate.categorySlug?.toLowerCase() === currentCategory) {
        score += 40;
      }
      if (currentTemplate && candidate.templateType?.toLowerCase() === currentTemplate) {
        score += 20;
      }

      const candServices = (candidate.services || [])
        .map((s) => (s.en || '').trim().toLowerCase())
        .filter(Boolean);
      let serviceScore = 0;
      for (const cs of candServices) {
        if (currentServicesList.includes(cs)) {
          serviceScore += 15;
        }
      }
      score += Math.min(35, serviceScore);

      const candTech = (candidate.mediaShowcase?.techStack || [])
        .map((t) => t.name.trim().toLowerCase())
        .filter(Boolean);
      let techMatches = 0;
      for (const ct of candTech) {
        if (currentTechNames.has(ct)) techMatches += 1;
      }
      score += Math.min(20, techMatches * 6);

      const candKeywords = tokenizeKeywords(
        [
          candidate.topic?.en || '',
          candidate.title?.en || '',
          candServices.join(' '),
          candTech.join(' '),
        ].join(' ')
      );
      let kwOverlap = 0;
      for (const kw of candKeywords) {
        if (currentKeywordSet.has(kw)) kwOverlap += 1;
      }
      score += Math.min(25, kwOverlap * 4);

      if (candidate.featured) score += 2;

      return { slug: candidate.slug, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.slug);
}

function validateAndTopUpRelatedSlugs(params: {
  candidateSlugs: unknown;
  currentStoryContext?: Record<string, unknown>;
  referenceText: string;
  dbStories: ClientStoryDetail[];
  limit?: number;
}): string[] {
  const { candidateSlugs, currentStoryContext, referenceText, dbStories, limit = 3 } = params;
  const currentSlug =
    typeof currentStoryContext?.slug === 'string'
      ? currentStoryContext.slug.trim().toLowerCase()
      : '';
  const validMap = new Map<string, string>();
  for (const s of dbStories) {
    if (s.slug && s.slug.toLowerCase() !== currentSlug) {
      validMap.set(s.slug.toLowerCase(), s.slug);
    }
  }

  const picked: string[] = [];
  const seen = new Set<string>();

  if (Array.isArray(candidateSlugs)) {
    for (const raw of candidateSlugs) {
      if (typeof raw !== 'string') continue;
      const canonical = validMap.get(raw.trim().toLowerCase());
      if (canonical && !seen.has(canonical.toLowerCase())) {
        seen.add(canonical.toLowerCase());
        picked.push(canonical);
      }
    }
  }

  if (picked.length < limit) {
    const ranked = rankDatabaseRelatedSlugs({
      currentStoryContext,
      referenceText,
      dbStories,
      limit: Math.max(limit + 2, 5),
    });
    for (const slug of ranked) {
      if (picked.length >= limit) break;
      if (!seen.has(slug.toLowerCase())) {
        seen.add(slug.toLowerCase());
        picked.push(slug);
      }
    }
  }

  return picked.slice(0, Math.max(limit, picked.length));
}

const SECTION_ROLE_GUIDANCE: Record<NarrativeSectionRole, string> = {
  intro:
    'SECTION ROLE = OVERVIEW (Section 04): Establish the client organization, brand heritage or market position, strategic vision, and project scope before diving into obstacles. Keep tone authoritative, contextual, and SEO-enriched.',
  problem:
    'SECTION ROLE = THE CHALLENGE (Section 05): Focus strictly on business bottlenecks, technical debt, operational friction, fragmented systems, slow performance, or market challenges documented in the reference file. Highlight pain points crisply without repeating solution details.',
  solution:
    'SECTION ROLE = THE ENGINEERED SOLUTION (Section 06): Focus strictly on the technical architecture, digital strategy, AI pipelines, design system, cloud infrastructure, or campaign execution delivered by Persici Agency. Name concrete tools, methodologies, and workflows from the reference file.',
  impact:
    'SECTION ROLE = THE MEASURABLE IMPACT (Section 07): Focus strictly on quantifiable ROI, conversion lift, performance gains, customer growth, efficiency milestones, and long-term business value achieved from the engagement.',
};

function collectStoryCodeSummary(ctx?: Record<string, unknown>) {
  if (!ctx) return [];
  const roles: NarrativeSectionRole[] = ['intro', 'problem', 'solution', 'impact'];
  const collected: Array<{ section: string; language: string; title: string; code: string }> = [];
  for (const r of roles) {
    const sec = ctx[r] as { codeBlocks?: Array<{ language?: string; title?: { en?: string }; code?: string }> } | undefined;
    if (Array.isArray(sec?.codeBlocks)) {
      for (const blk of sec.codeBlocks) {
        if (blk && typeof blk.code === 'string' && blk.code.trim()) {
          collected.push({
            section: r,
            language: String(blk.language || ''),
            title: String(blk.title?.en || ''),
            code: blk.code.slice(0, 800),
          });
        }
      }
    }
  }
  return collected;
}

function buildPromptForTarget(params: {
  targetField: StoryAiTargetField;
  referenceText: string;
  currentStoryContext?: Record<string, unknown>;
  sectionContext?: NarrativeSectionRole;
  paragraphIndex?: number;
  codeBlockIndex?: number;
  codeLanguage?: string;
  availableStoriesCatalog?: StoryCatalogEntry[];
  availableCategories?: ClientStoryCategory[];
}): { systemPrompt: string; userPrompt: string } {
  const {
    targetField,
    referenceText,
    currentStoryContext,
    sectionContext,
    paragraphIndex,
    codeBlockIndex,
    codeLanguage,
    availableStoriesCatalog,
    availableCategories,
  } = params;
  const resolvedCategories =
    availableCategories && availableCategories.length > 0
      ? availableCategories
      : DEFAULT_CLIENT_STORY_CATEGORIES;
  const allowedCategorySlugsList = resolvedCategories
    .map((c) => `"${c.slug}" (${resolveBilingualText(c.name, 'en')})`)
    .join(' | ');
  const firstCategorySlug = resolvedCategories[0]?.slug || 'software';
  const role: NarrativeSectionRole = sectionContext || 'intro';
  const hasRef = Boolean(referenceText && referenceText.trim().length > 0);

  const baseSystemPrompt = `You are the Principal Editorial, Solutions Architect & SEO Director at Persici Agency — a global leader in enterprise AI, Custom Software Engineering, Digital Transformation, UX Design, and Performance Marketing.

CORE RULES:
1. GROUNDING RULE: ${
    hasRef
      ? 'Rely strictly on the facts, brand names, technologies, deliverables, metrics, and context inside the provided REFERENCE DOCUMENT. Never invent fake client names or fabricated statistical numbers.'
      : 'Use the provided Client Story metadata (client, title, topic, category, services, code samples, and active section context) to produce realistic, production-grade technical output.'
  }
2. SIMULTANEOUS BILINGUAL OUTPUT: Every bilingual object must provide authoritative B2B English ("en") and natural, idiomatic Modern Standard Arabic ("ar") suitable for C-suite executives (never literal word-by-word translation).
3. SEO BEST PRACTICES: Weave high-intent industry keywords naturally into headings, summaries, and narrative prose without keyword stuffing.
4. HTML FORMATTING FOR RICH TEXT FIELDS: When returning rich text / paragraphs, use clean semantic HTML tags (<p>, <strong>, <ul>, <li>) — no markdown backticks inside JSON strings.
5. CODE OUTPUT FORMATTING: When generating code blocks, return raw valid code inside the "code" JSON string (escaped newlines \\n) without wrapping it in triple backtick markdown fences.
6. JSON ONLY: Return strictly valid JSON matching the exact schema requested for the target field.`;

  const mediaShowcaseCtx = currentStoryContext?.mediaShowcase as
    | { techStack?: unknown }
    | undefined;
  const storyContextJson = currentStoryContext
    ? JSON.stringify(
        {
          slug: currentStoryContext.slug,
          partner: currentStoryContext.partner,
          client: currentStoryContext.client,
          categorySlug: currentStoryContext.categorySlug,
          templateType: currentStoryContext.templateType,
          title: currentStoryContext.title,
          topic: currentStoryContext.topic,
          services: currentStoryContext.services,
          executiveSummary: currentStoryContext.executiveSummary,
          sectionSummary: currentStoryContext[role],
          region: currentStoryContext.region,
          date: currentStoryContext.date,
          currentTechStack: mediaShowcaseCtx?.techStack,
          codeSamples: collectStoryCodeSummary(currentStoryContext),
        },
        null,
        2
      )
    : '{}';

  let fieldInstructions = '';

  switch (targetField) {
    case 'meta':
      fieldInstructions = `TARGET: Extract Case Study Meta & Classification.
Allowed "categorySlug" values ONLY: ${allowedCategorySlugsList}.
Allowed "templateType" values ONLY: "software-web-app-showcase" | "ai-platform-showcase" | "mobile-app-showcase" | "marketing-video-showcase" | "marketing-branding-showcase" | "image-gallery-showcase".
CLASSIFICATION RULES (categorySlug and templateType are selected INDEPENDENTLY):
- "categorySlug" defines the story's business/filter category (from the allowed list above).
- "templateType" defines ONLY how the deliverables media section is laid out ("software-web-app-showcase", "ai-platform-showcase", "mobile-app-showcase", "marketing-video-showcase", "marketing-branding-showcase", "image-gallery-showcase"). Any category may use any showcase template depending on what deliverables exist in the reference.
Return STRICT JSON matching this exact schema:
{
  "partner": {
    "en": "Optional partner company/agency name ONLY if explicitly credited as a partner in the reference, otherwise empty string \"\"",
    "ar": "اسم الشريك بالعربية فقط إذا ذُكر صراحةً كشريك في المرجع، وإلا اتركه فارغاً \"\""
  },
  "client": {
    "en": "Exact client organization name from reference in English",
    "ar": "اسم العميل / المؤسسة بالعربية"
  },
  "slug": "seo-friendly-lowercase-hyphenated-slug",
  "categorySlug": "${firstCategorySlug}",
  "templateType": "software-web-app-showcase",
  "topic": { "en": "Industry / Niche in English", "ar": "المجال / الصناعة بالعربية" },
  "region": { "en": "Geographic market e.g. Saudi Arabia & GCC", "ar": "المنطقة الجغرافية بالعربية" },
  "date": "Year or Month Year e.g. August 2025",
  "services": [
    { "en": "Service 1", "ar": "الخدمة 1" },
    { "en": "Service 2", "ar": "الخدمة 2" },
    { "en": "Service 3", "ar": "الخدمة 3" }
  ]
}`;
      break;

    case 'partner':
      fieldInstructions = `TARGET: Partner Organization Name (Optional, Bilingual EN & AR).
Return STRICT JSON:
{
  "partner": {
    "en": "Exact partner organization/agency name ONLY if explicitly credited as a partner in the reference; otherwise empty string \"\"",
    "ar": "اسم الشريك بالعربية فقط إذا ذُكر صراحةً كشريك في المرجع؛ وإلا اتركه فارغاً \"\""
  }
}`;
      break;

    case 'client':
      fieldInstructions = `TARGET: Client Organization Name (Bilingual EN & AR).
Return STRICT JSON:
{
  "client": {
    "en": "Concise official client brand/company name in English from the reference",
    "ar": "الاسم الرسمي للعميل أو العلامة التجارية بالعربية"
  }
}`;
      break;

    case 'slug':
      fieldInstructions = `TARGET: High-CTR, clean SEO URL Slug for the client story.
Must be lowercase ASCII letters, numbers, and single hyphens only (max 6 words, e.g. "accor-enterprise-loyalty-platform").
Return STRICT JSON: { "slug": "clean-seo-slug" }`;
      break;

    case 'topic':
      fieldInstructions = `TARGET: Industry / Topic classification based on the reference.
Return STRICT JSON: { "topic": { "en": "Industry / Sector (3-6 words)", "ar": "المجال والقطاع بالعربية" } }`;
      break;

    case 'region':
      fieldInstructions = `TARGET: Geographic Region / Market served.
Return STRICT JSON: { "region": { "en": "Region (e.g. UAE & Saudi Arabia)", "ar": "المنطقة بالعربية" } }`;
      break;

    case 'services':
      fieldInstructions = `TARGET: 3 to 5 specific Services Delivered derived from the reference document.
Return STRICT JSON: { "services": [ { "en": "Service Name EN", "ar": "اسم الخدمة بالعربية" } ] }`;
      break;

    case 'title':
      fieldInstructions = `TARGET: SEO Primary H1 Case Study Title.
Best practice: "[Client Name]: [High-Impact Transformation or Key Deliverable]" (approx 55-80 chars, compelling, keyword-rich).
Return STRICT JSON: { "title": { "en": "SEO Case Study Title EN", "ar": "عنوان دراسة الحالة الرئيسي بالعربية" } }`;
      break;

    case 'leadSubtitle':
      fieldInstructions = `TARGET: Lead Subtitle Hook (rendered right under the H1 title).
Write 1-2 punchy, executive sentences in clean HTML (<p>...</p>, you may use <strong> on key outcome phrases) summarizing the transformation.
Return STRICT JSON: { "leadSubtitle": { "en": "<p>...</p>", "ar": "<p>...</p>" } }`;
      break;

    case 'executiveSummary':
      fieldInstructions = `TARGET: SEO Executive Summary (search snippet & executive intro paragraph).
Write a crisp 2-4 sentence summary in clean HTML (<p>...</p> with <strong> emphasis on core scope and results) capturing who, what, how, and measurable business outcome.
Return STRICT JSON: { "executiveSummary": { "en": "<p>...</p>", "ar": "<p>...</p>" } }`;
      break;

    case 'metrics':
      fieldInstructions = `TARGET: Key Impact Metrics (2 to 4 CountUp KPI stat cards).
Extract real quantitative results or strongest verified performance milestones from the reference (format value concisely like "+340%", "3.4x", "99.9%", "-42%", "14.2M+"). Keep labels short (2-4 words).
Return STRICT JSON:
{
  "metrics": [
    { "value": "+240%", "label": { "en": "Conversion Lift", "ar": "ارتفاع معدل التحويل" } }
  ]
}`;
      break;

    case 'intro':
    case 'problem':
    case 'solution':
    case 'impact':
      fieldInstructions = `${SECTION_ROLE_GUIDANCE[targetField]}
Write 2 well-structured rich HTML paragraphs (<p>...</p> using <strong> on key concepts), 3 concise Key Highlight bullet points, and 1 authentic executive pull quote grounded in the reference.
Return STRICT JSON matching this exact schema:
{
  "title": { "en": "Specific Engaging Section Heading EN", "ar": "عنوان القسم المناسب بالعربية" },
  "paragraphs": [
    { "en": "<p>Paragraph 1...</p>", "ar": "<p>الفقرة الأولى...</p>" },
    { "en": "<p>Paragraph 2...</p>", "ar": "<p>الفقرة الثانية...</p>" }
  ],
  "bullets": [
    { "en": "Concise highlight 1", "ar": "نقطة إبراز 1" },
    { "en": "Concise highlight 2", "ar": "نقطة إبراز 2" },
    { "en": "Concise highlight 3", "ar": "نقطة إبراز 3" }
  ],
  "quote": {
    "text": { "en": "Executive quote summarizing this phase's truth/impact", "ar": "اقتباس تنفيذي يعكس هذه المرحلة" },
    "author": "Stakeholder Name or Persici Engineering Lead",
    "role": { "en": "Role / Organization", "ar": "المنصب / المؤسسة" }
  }
}`;
      break;

    case 'section_heading':
      fieldInstructions = `${SECTION_ROLE_GUIDANCE[role]}
TARGET: Write an SEO-friendly, authoritative Section Heading specifically for this section.
Return STRICT JSON: { "en": "Section Heading EN", "ar": "عنوان القسم بالعربية" }`;
      break;

    case 'paragraph':
      fieldInstructions = `${SECTION_ROLE_GUIDANCE[role]}
TARGET: Write Body Paragraph #${(paragraphIndex ?? 0) + 1} specifically tailored to this section's purpose. Use clean semantic HTML (<p>...</p> with strategic <strong> highlights). Avoid repeating prior sections verbatim.
Return STRICT JSON: { "en": "<p>...</p>", "ar": "<p>...</p>" }`;
      break;

    case 'bullets':
      fieldInstructions = `${SECTION_ROLE_GUIDANCE[role]}
TARGET: Generate 3 to 5 scannable, high-value Key Highlights / Bullet Points specifically for this section.
Return STRICT JSON:
{
  "bullets": [
    { "en": "Concise highlight 1", "ar": "نقطة بارزة 1" }
  ]
}`;
      break;

    case 'code_block':
      fieldInstructions = `${SECTION_ROLE_GUIDANCE[role]}
TARGET: Generate 1 crisp, realistic, production-quality Code Sample (#${(codeBlockIndex ?? 0) + 1}) directly relevant to the Client Story topic, title, and this section (${role}).
${codeLanguage ? `REQUIRED LANGUAGE: "${codeLanguage}"` : 'Choose the most appropriate language from: "html", "php", "javascript", "typescript", "react", "nextjs", "css", "python", "sql", "json", "bash".'}
The bilingual title before the code should clearly name the sample (e.g., "Sample of PHP Code" / "نموذج كود PHP" or "Sample of React Hook" / "نموذج كود React").
Keep code cleanly indented, realistic (10-28 lines), and free of markdown triple backticks.
Return STRICT JSON:
{
  "title": { "en": "Sample of ... Code", "ar": "نموذج كود ..." },
  "language": "${codeLanguage || 'typescript'}",
  "code": "// Raw clean code with newlines"
}`;
      break;

    case 'code_blocks':
      fieldInstructions = `${SECTION_ROLE_GUIDANCE[role]}
TARGET: Generate 1 to 2 authentic, production-quality Code Samples tailored specifically to this Client Story topic and section (${role}).
Allowed language ids: "html", "php", "javascript", "typescript", "react", "nextjs", "css", "python", "sql", "json", "bash".
Each item must include a descriptive bilingual title (e.g., "Sample of HTML Code" / "نموذج كود HTML"), the language id, and clean 10-25 line code.
Return STRICT JSON:
{
  "codeBlocks": [
    {
      "title": { "en": "Sample of ... Code", "ar": "نموذج كود ..." },
      "language": "typescript",
      "code": "// Raw clean code"
    }
  ]
}`;
      break;

    case 'quote':
      fieldInstructions = `${SECTION_ROLE_GUIDANCE[role]}
TARGET: Generate an authentic Executive Pull Quote (plus author & role from the reference or client team) tailored specifically to this section.
Return STRICT JSON:
{
  "text": { "en": "Quote text EN", "ar": "نص الاقتباس بالعربية" },
  "author": "Author Name",
  "role": { "en": "Executive Role EN", "ar": "المسمى الوظيفي بالعربية" }
}`;
      break;

    case 'tech_stack':
      fieldInstructions = `TARGET: Extract and curate the exact Technology Stack Badges ("techStack") for this Client Story based on the Reference Document, code samples, templateType, and engineered solution context.
INSTRUCTIONS:
- Replace irrelevant placeholder/default badges (do NOT keep Next.js, TypeScript, Tailwind CSS, or MongoDB unless they were actually used in THIS client story).
- Include every relevant technology, AI model/LLM/vector DB/agent framework (especially for "ai-platform-showcase" / "ai-platforms"), CMS, framework, programming language, payment/FinTech integration, cloud/hosting provider, UI/UX or campaign tool documented in the reference or code samples (typically 4 to 10 concise badges; remove duplicates or redundant items).
- Allowed "category" values ONLY: "frontend" | "backend" | "database" | "cloud" | "tool" | "design".
Return STRICT JSON:
{
  "techStack": [
    { "name": "WordPress", "category": "backend" },
    { "name": "PHP", "category": "backend" },
    { "name": "WooCommerce", "category": "backend" },
    { "name": "MySQL", "category": "database" }
  ]
}`;
      break;

    case 'related_slugs':
      fieldInstructions = `TARGET: Select the 3 most relevant Related Client Story slugs from our live database catalog.
INSTRUCTIONS:
- Pick 3 slugs STRICTLY from the AVAILABLE DATABASE CLIENT STORIES list below (never invent or modify slugs).
- Prioritize stories that share the same "categorySlug", similar "services", matching "topic" / industry, overlapping "techStack", or are explicitly referenced in the Reference Document.
Return STRICT JSON:
{
  "relatedSlugs": [
    "existing-database-slug-1",
    "existing-database-slug-2",
    "existing-database-slug-3"
  ]
}`;
      break;

    case 'all':
      fieldInstructions = `TARGET: Generate ALL sections of the complete Persici Client Story from the Reference Document cleanly without cross-section repetition.
Allowed "categorySlug": ${allowedCategorySlugsList}.
Allowed "templateType": "software-web-app-showcase" | "ai-platform-showcase" | "mobile-app-showcase" | "marketing-video-showcase" | "marketing-branding-showcase" | "image-gallery-showcase".
CLASSIFICATION RULES (categorySlug and templateType are independent choices):
- Choose the best matching "categorySlug" for the story's industry/service domain.
- Independently choose the "templateType" showcase layout ("ai-platform-showcase", "software-web-app-showcase", "mobile-app-showcase", "marketing-video-showcase", "marketing-branding-showcase", or "image-gallery-showcase") matching how deliverables should be visually presented.
Allowed "techStack[].category": "frontend" | "backend" | "database" | "cloud" | "tool" | "design".
For "relatedSlugs", choose 3 slugs STRICTLY from the AVAILABLE DATABASE CLIENT STORIES list matching category, services, or industry.
Return STRICT JSON matching this complete schema:
{
  "meta": {
    "partner": { "en": "", "ar": "" },
    "client": { "en": "Client Name", "ar": "اسم العميل" },
    "slug": "seo-hyphenated-slug",
    "categorySlug": "${firstCategorySlug}",
    "templateType": "software-web-app-showcase",
    "topic": { "en": "...", "ar": "..." },
    "region": { "en": "...", "ar": "..." },
    "date": "2025",
    "services": [ { "en": "...", "ar": "..." } ]
  },
  "title": { "en": "...", "ar": "..." },
  "leadSubtitle": { "en": "<p>...</p>", "ar": "<p>...</p>" },
  "executiveSummary": { "en": "<p>...</p>", "ar": "<p>...</p>" },
  "metrics": [
    { "value": "+...", "label": { "en": "...", "ar": "..." } }
  ],
  "intro": {
    "title": { "en": "...", "ar": "..." },
    "paragraphs": [ { "en": "<p>...</p>", "ar": "<p>...</p>" } ],
    "bullets": [ { "en": "...", "ar": "..." } ],
    "quote": { "text": { "en": "...", "ar": "..." }, "author": "...", "role": { "en": "...", "ar": "..." } }
  },
  "problem": {
    "title": { "en": "...", "ar": "..." },
    "paragraphs": [ { "en": "<p>...</p>", "ar": "<p>...</p>" } ],
    "bullets": [ { "en": "...", "ar": "..." } ],
    "quote": { "text": { "en": "...", "ar": "..." }, "author": "...", "role": { "en": "...", "ar": "..." } }
  },
  "solution": {
    "title": { "en": "...", "ar": "..." },
    "paragraphs": [ { "en": "<p>...</p>", "ar": "<p>...</p>" } ],
    "bullets": [ { "en": "...", "ar": "..." } ],
    "quote": { "text": { "en": "...", "ar": "..." }, "author": "...", "role": { "en": "...", "ar": "..." } }
  },
  "impact": {
    "title": { "en": "...", "ar": "..." },
    "paragraphs": [ { "en": "<p>...</p>", "ar": "<p>...</p>" } ],
    "bullets": [ { "en": "...", "ar": "..." } ],
    "quote": { "text": { "en": "...", "ar": "..." }, "author": "...", "role": { "en": "...", "ar": "..." } }
  },
  "techStack": [
    { "name": "Tech Name", "category": "frontend" }
  ],
  "relatedSlugs": [
    "existing-database-slug-1",
    "existing-database-slug-2",
    "existing-database-slug-3"
  ]
}`;
      break;
  }

  const catalogBlock =
    availableStoriesCatalog && availableStoriesCatalog.length > 0
      ? `\n\nAVAILABLE DATABASE CLIENT STORIES (choose relatedSlugs ONLY from these exact slugs):\n${JSON.stringify(
          availableStoriesCatalog,
          null,
          2
        )}`
      : '';

  const userPrompt = `CURRENT STORY METADATA CONTEXT:
${storyContextJson}

GENERATION TASK:
${fieldInstructions}${catalogBlock}

REFERENCE DOCUMENT CONTENT:
"""
${hasRef ? referenceText.slice(0, 55000) : 'No external reference file attached — rely on CURRENT STORY METADATA CONTEXT and best technical engineering standards.'}
"""`;

  return { systemPrompt: baseSystemPrompt, userPrompt };
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = (await request.json().catch(() => null)) as {
      targetField?: StoryAiTargetField;
      referenceText?: string;
      currentStoryContext?: Record<string, unknown>;
      sectionContext?: NarrativeSectionRole;
      paragraphIndex?: number;
      codeBlockIndex?: number;
      codeLanguage?: string;
      providerOverride?: AiProviderId;
      modelOverride?: string;
      effectOverride?: AiEffectLevel;
    } | null;

    const targetField: StoryAiTargetField = body?.targetField || 'title';
    const isContextAllowedTarget =
      targetField === 'code_block' ||
      targetField === 'code_blocks' ||
      targetField === 'tech_stack' ||
      targetField === 'related_slugs';
    const refText = body?.referenceText?.trim() || '';

    if (!body || (!isContextAllowedTarget && !refText)) {
      return NextResponse.json(
        {
          error:
            'Please upload a reference file (.pdf, .docx/.doc, .xlsx/.xls, .md, or .txt) first before generating content with AI.',
          code: 'REFERENCE_REQUIRED',
        },
        { status: 400 }
      );
    }

    const storySlug =
      typeof body.currentStoryContext?.slug === 'string'
        ? body.currentStoryContext.slug
        : '';

    const needsDbCatalog = targetField === 'related_slugs' || targetField === 'all';
    const needsCategories = targetField === 'meta' || targetField === 'all';
    const [dbStories, availableCategories] = await Promise.all([
      needsDbCatalog ? getAllProjectsFromDb(true) : Promise.resolve([]),
      needsCategories ? getAllProjectCategoriesFromDb() : Promise.resolve([]),
    ]);
    const availableStoriesCatalog = needsDbCatalog
      ? buildStoriesCatalogSummary(dbStories, storySlug)
      : undefined;

    const { systemPrompt, userPrompt } = buildPromptForTarget({
      targetField,
      referenceText: refText,
      currentStoryContext: body.currentStoryContext,
      sectionContext: body.sectionContext,
      paragraphIndex: body.paragraphIndex,
      codeBlockIndex: body.codeBlockIndex,
      codeLanguage: body.codeLanguage,
      availableStoriesCatalog,
      availableCategories,
    });

    if (targetField === 'related_slugs') {
      try {
        const result = await generateStructuredAiJson({
          systemPrompt,
          userPrompt,
          targetField,
          storySlug,
          userId: user.email || user.name,
          providerOverride: body.providerOverride,
          modelOverride: body.modelOverride,
          effectOverride: body.effectOverride,
        });

        const rawData = (result.data || {}) as Record<string, unknown>;
        const validatedSlugs = validateAndTopUpRelatedSlugs({
          candidateSlugs: rawData.relatedSlugs,
          currentStoryContext: body.currentStoryContext,
          referenceText: refText,
          dbStories,
          limit: 3,
        });

        return NextResponse.json({
          success: true,
          targetField,
          result: { ...rawData, relatedSlugs: validatedSlugs },
          usage: result.usage,
        });
      } catch (aiErr) {
        console.warn('[API /api/ai/generate-story-field] AI related_slugs fallback to DB matcher:', aiErr);
        const fallbackSlugs = rankDatabaseRelatedSlugs({
          currentStoryContext: body.currentStoryContext,
          referenceText: refText,
          dbStories,
          limit: 3,
        });
        return NextResponse.json({
          success: true,
          targetField,
          source: 'database-fallback',
          result: { relatedSlugs: fallbackSlugs },
        });
      }
    }

    const result = await generateStructuredAiJson({
      systemPrompt,
      userPrompt,
      targetField: body.sectionContext ? `${body.sectionContext}:${targetField}` : targetField,
      storySlug,
      userId: user.email || user.name,
      providerOverride: body.providerOverride,
      modelOverride: body.modelOverride,
      effectOverride: body.effectOverride,
    });

    const rawData = (result.data || {}) as Record<string, unknown>;
    const sanitizedData: Record<string, unknown> = { ...rawData };

    if (targetField === 'tech_stack' || targetField === 'all') {
      if (Array.isArray(rawData.techStack)) {
        sanitizedData.techStack = normalizeTechStackBadges(rawData.techStack);
      }
    }

    if (targetField === 'all' && dbStories.length > 0) {
      const contextForMatch = {
        ...(body.currentStoryContext || {}),
        ...(rawData.meta && typeof rawData.meta === 'object' ? (rawData.meta as Record<string, unknown>) : {}),
        ...(rawData.title ? { title: rawData.title } : {}),
        ...(Array.isArray(sanitizedData.techStack)
          ? { mediaShowcase: { techStack: sanitizedData.techStack } }
          : {}),
      };
      sanitizedData.relatedSlugs = validateAndTopUpRelatedSlugs({
        candidateSlugs: rawData.relatedSlugs,
        currentStoryContext: contextForMatch,
        referenceText: refText,
        dbStories,
        limit: 3,
      });
    }

    return NextResponse.json({
      success: true,
      targetField,
      result: sanitizedData,
      usage: result.usage,
    });
  } catch (err) {
    console.error('[API /api/ai/generate-story-field POST] Error:', err);
    const msg = err instanceof Error ? err.message : 'AI generation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
