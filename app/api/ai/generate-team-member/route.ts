import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { generateStructuredAiJson } from '@/lib/ai-server';
import type { AiEffectLevel, AiProviderId } from '@/lib/ai-types';
import {
  normalizeTeamBlock,
  type TeamContentBlock,
  type TeamMemberSection,
} from '@/lib/team-types';

export const runtime = 'nodejs';

export type TeamAiTargetField =
  | 'all'
  | 'profile'
  | 'description'
  | 'section'
  | 'code_block'
  | 'list_items';

interface GenerateTeamRequestBody {
  targetField: TeamAiTargetField;
  referenceText: string;
  sectionTitleHint?: string;
  codeLanguageHint?: string;
  currentMemberContext?: {
    id?: string;
    firstName?: { en?: string; ar?: string };
    lastName?: { en?: string; ar?: string };
    title?: { en?: string; ar?: string };
    portfolioUrl?: string;
  };
  providerOverride?: AiProviderId;
  modelOverride?: string;
  effectOverride?: AiEffectLevel;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'author', 'hr'])) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = (await request.json().catch(() => ({}))) as GenerateTeamRequestBody;
    const targetField = body.targetField;
    const refText = (body.referenceText || '').trim();

    if (!targetField) {
      return NextResponse.json(
        { success: false, error: 'targetField is required' },
        { status: 400 }
      );
    }

    const ctx = body.currentMemberContext;
    const hasMemberContext = Boolean(
      ctx?.firstName?.en || ctx?.lastName?.en || ctx?.title?.en
    );

    if (!refText && !hasMemberContext) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Please upload a reference document (.pdf, .docx, .txt) or enter member details before generating.',
        },
        { status: 400 }
      );
    }

    const systemPrompt = `You are Persici Digital Agency's Executive Talent Branding & Bilingual Technical Writer.
Your output MUST always be strictly valid JSON matching the exact requested structure, written at a Fortune-500 consultancy level in BOTH crisp American English ("en") and eloquent Modern Standard Arabic ("ar").
CRITICAL RULES:
- For Arabic ("ar"), use authentic enterprise business/technical Arabic (not stiff literal translation), keeping proper English product/framework names inline where natural (e.g., Next.js, Kubernetes, Meta Ads, Shopify Plus).
- Never invent fake employer awards or numbers absent from the reference; when a CV or bio omits metrics, highlight authentic architectural ownership, methodology, and leadership impact instead.
- Return ONLY the JSON object matching the schema.`;

    const memberSummaryContext = hasMemberContext
      ? `\nCURRENT TEAM MEMBER CONTEXT:\n${JSON.stringify(ctx, null, 2)}`
      : '';

    const referenceSection = refText
      ? `\n=== REFERENCE DOCUMENT / CV / BIO TEXT ===\n${refText.slice(0, 32000)}\n=== END REFERENCE ===`
      : '\n(No external file uploaded — generate based on the current team member profile details provided above.)';

    let schemaInstruction = '';

    switch (targetField) {
      case 'profile':
        schemaInstruction = `Extract or refine the core team member profile:
{
  "firstName": { "en": "First name", "ar": "الاسم الأول" },
  "lastName": { "en": "Last name", "ar": "الاسم الأخير" },
  "title": { "en": "Executive Role Title", "ar": "المسمى الوظيفي" },
  "portfolioUrl": "Optional personal portfolio, GitHub, or website URL if present in text, otherwise empty string"
}`;
        break;

      case 'description':
        schemaInstruction = `Generate the Main Description as an array of 2 to 4 structured blocks ("descriptionBlocks") combining executive bio paragraphs and optionally a list of key career milestones or technical strengths:
{
  "descriptionBlocks": [
    {
      "type": "paragraph",
      "content": { "en": "<p>Rich HTML paragraph highlighting domain leadership...</p>", "ar": "<p>فقرة احترافية...</p>" }
    },
    {
      "type": "list",
      "listStyle": "milestones",
      "listTitle": { "en": "Key Expertise & Milestones", "ar": "أبرز المحطات والخبرات" },
      "items": [
        { "label": { "en": "Focus", "ar": "التركيز" }, "text": { "en": "Clear concrete achievement", "ar": "إنجاز مهني واضح" } }
      ]
    }
  ]
}`;
        break;

      case 'section':
        schemaInstruction = `Generate 1 complete Custom Section for this team member${
          body.sectionTitleHint ? ` centered on the topic: "${body.sectionTitleHint}"` : ''
        }. Every section MUST have a compelling bilingual "title" and at least 2 content blocks ("paragraph", "list", and if engineering/technical, optionally a realistic "code" block):
{
  "section": {
    "title": { "en": "Section Headline", "ar": "عنوان القسم" },
    "blocks": [
      {
        "type": "paragraph",
        "content": { "en": "<p>Detailed narrative paragraph...</p>", "ar": "<p>وصف تفصيلي...</p>" }
      },
      {
        "type": "list",
        "listStyle": "bullets",
        "listTitle": { "en": "Core Deliverables", "ar": "المخرجات الرئيسية" },
        "items": [
          { "label": { "en": "01", "ar": "01" }, "text": { "en": "Bullet point...", "ar": "نقطة..." } }
        ]
      }
    ]
  }
}`;
        break;

      case 'code_block':
        schemaInstruction = `Generate 1 clean, realistic production code sample (${
          body.codeLanguageHint || 'appropriate language matching the specialist role, e.g. typescript, python, php, javascript, nextjs'
        }) demonstrating this team member's technical craft:
{
  "codeBlock": {
    "type": "code",
    "codeTitle": { "en": "Sample of ... Code", "ar": "نموذج كود ..." },
    "codeLanguage": "typescript",
    "code": "// multi-line runnable sample code"
  }
}`;
        break;

      case 'list_items':
        schemaInstruction = `Generate 3 to 5 concise bilingual milestones / list items highlighting the specialist's impact:
{
  "listTitle": { "en": "Key Career Milestones", "ar": "أبرز الإنجازات والمحطات" },
  "listStyle": "milestones",
  "items": [
    {
      "label": { "en": "2024", "ar": "2024" },
      "text": { "en": "Milestone achievement statement...", "ar": "بيان الإنجاز المهني..." }
    }
  ]
}`;
        break;

      case 'all':
      default:
        schemaInstruction = `Generate the COMPLETE bilingual Team Member profile, Main Description blocks, and 2–3 Custom Sections in a single JSON payload:
{
  "firstName": { "en": "First name", "ar": "الاسم الأول" },
  "lastName": { "en": "Last name", "ar": "الاسم الأخير" },
  "title": { "en": "Role / Title", "ar": "المسمى الوظيفي" },
  "portfolioUrl": "Optional URL from CV or empty string",
  "descriptionBlocks": [
    {
      "type": "paragraph",
      "content": { "en": "<p>Executive summary paragraph...</p>", "ar": "<p>نبذة تنفيذية...</p>" }
    },
    {
      "type": "paragraph",
      "content": { "en": "<p>Methodology & leadership focus...</p>", "ar": "<p>النهج العملي والقيادي...</p>" }
    }
  ],
  "sections": [
    {
      "title": { "en": "Strategic Expertise & Capabilities", "ar": "الخبرات والقدرات الاستراتيجية" },
      "blocks": [
        {
          "type": "paragraph",
          "content": { "en": "<p>Overview...</p>", "ar": "<p>نظرة عامة...</p>" }
        },
        {
          "type": "list",
          "listStyle": "milestones",
          "listTitle": { "en": "Selected Career Highlights", "ar": "أبرز المحطات المهنية" },
          "items": [
            { "label": { "en": "Impact", "ar": "الأثر" }, "text": { "en": "...", "ar": "..." } }
          ]
        }
      ]
    },
    {
      "title": { "en": "Signature Execution & Systems", "ar": "التنفيذ المنهجي وبناء الأنظمة" },
      "blocks": [
        {
          "type": "paragraph",
          "content": { "en": "<p>How this specialist approaches complex architecture and growth...</p>", "ar": "<p>كيف يقود الأنظمة والنمو...</p>" }
        }
      ]
    }
  ]
}
If the reference indicates a software engineer, AI architect, or developer role, include a relevant "code" block ({ "type": "code", "codeTitle": { "en": "...", "ar": "..." }, "codeLanguage": "typescript", "code": "..." }) inside the second section!`;
        break;
    }

    const userPrompt = `TARGET FIELD: ${targetField}${memberSummaryContext}${referenceSection}\n\nREQUIRED JSON SCHEMA:\n${schemaInstruction}`;

    const aiRes = await generateStructuredAiJson<Record<string, unknown>>({
      systemPrompt,
      userPrompt,
      targetField: `team:${targetField}`,
      storySlug: ctx?.id ? `team-${ctx.id}` : 'team-member',
      userId: user.email || user.name || 'admin',
      providerOverride: body.providerOverride,
      modelOverride: body.modelOverride,
      effectOverride: body.effectOverride,
    });

    const raw = aiRes.data || {};
    const normalizedResult: Record<string, unknown> = { ...raw };

    if (Array.isArray(raw.descriptionBlocks)) {
      normalizedResult.descriptionBlocks = raw.descriptionBlocks.map((blk, i) =>
        normalizeTeamBlock(blk, i)
      );
    }

    if (Array.isArray(raw.sections)) {
      normalizedResult.sections = raw.sections.map((sec, sIdx): TeamMemberSection => {
        const sRec = (sec && typeof sec === 'object' ? sec : {}) as Record<string, unknown>;
        const sTitle = (sRec.title && typeof sRec.title === 'object'
          ? sRec.title
          : { en: `Section ${sIdx + 1}`, ar: `القسم ${sIdx + 1}` }) as {
          en?: string;
          ar?: string;
        };
        const rawSecBlocks = Array.isArray(sRec.blocks) ? sRec.blocks : [];
        const blocks: TeamContentBlock[] =
          rawSecBlocks.length > 0
            ? rawSecBlocks.map((b, bIdx) => normalizeTeamBlock(b, bIdx))
            : [normalizeTeamBlock({ type: 'paragraph', content: { en: '', ar: '' } }, sIdx)];

        return {
          id: `sec-${Date.now()}-${sIdx + 1}`,
          title: {
            en: String(sTitle.en || `Section ${sIdx + 1}`),
            ar: String(sTitle.ar || sTitle.en || `القسم ${sIdx + 1}`),
          },
          blocks,
        };
      });
    }

    if (raw.section && typeof raw.section === 'object') {
      const sRec = raw.section as Record<string, unknown>;
      const sTitle = (sRec.title && typeof sRec.title === 'object'
        ? sRec.title
        : { en: body.sectionTitleHint || 'Expertise Section', ar: 'قسم الخبرات' }) as {
        en?: string;
        ar?: string;
      };
      const rawBlocks = Array.isArray(sRec.blocks) ? sRec.blocks : [];
      const blocks =
        rawBlocks.length > 0
          ? rawBlocks.map((b, i) => normalizeTeamBlock(b, i))
          : [normalizeTeamBlock({ type: 'paragraph', content: { en: '', ar: '' } }, 0)];
      normalizedResult.section = {
        id: `sec-${Date.now()}`,
        title: {
          en: String(sTitle.en || 'Expertise Section'),
          ar: String(sTitle.ar || sTitle.en || 'قسم الخبرات'),
        },
        blocks,
      };
    }

    if (raw.codeBlock && typeof raw.codeBlock === 'object') {
      normalizedResult.codeBlock = normalizeTeamBlock(
        { ...(raw.codeBlock as Record<string, unknown>), type: 'code' },
        0
      );
    }

    return NextResponse.json({
      success: true,
      targetField,
      result: normalizedResult,
      usage: aiRes.usage,
    });
  } catch (err) {
    console.error('[API /api/ai/generate-team-member POST] Error:', err);
    const msg = err instanceof Error ? err.message : 'AI generation failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
