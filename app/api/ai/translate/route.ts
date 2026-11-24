import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { generateStructuredAiJson } from '@/lib/ai-server';
import type { AiEffectLevel, AiProviderId } from '@/lib/ai-types';

export const runtime = 'nodejs';

interface TranslateRequestBody {
  text?: string;
  sourceLang?: 'en' | 'ar';
  targetLang?: 'en' | 'ar';
  isHtml?: boolean;
  fieldHint?: string;
  storySlug?: string;
  storyContext?: {
    client?: string;
    partner?: string;
    topic?: string;
    category?: string;
  };
  providerOverride?: AiProviderId;
  modelOverride?: string;
  effectOverride?: AiEffectLevel;
}

function hasVisibleSourceText(raw: string, isHtml: boolean): boolean {
  if (!isHtml) return raw.trim().length > 0;
  return (
    raw
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .trim().length > 0
  );
}

function buildTranslatePrompts(params: {
  text: string;
  sourceLang: 'en' | 'ar';
  targetLang: 'en' | 'ar';
  isHtml: boolean;
  fieldHint?: string;
  storyContext?: TranslateRequestBody['storyContext'];
}) {
  const { text, sourceLang, targetLang, isHtml, fieldHint, storyContext } = params;

  const sourceName = sourceLang === 'en' ? 'English' : 'Arabic';
  const targetName = targetLang === 'en' ? 'English' : 'Arabic';

  const systemPrompt = `You are a senior bilingual (English <-> Arabic) executive copywriter and technical translator for Persici Agency, a flagship consulting, software engineering, AI platform, and creative branding firm serving MENA, GCC, Europe, and US enterprises.

TRANSLATION STANDARDS:
1. Return strictly a valid JSON object matching: { "translation": "..." } with zero markdown wrappers, zero explanation, and zero extra keys.
2. ${
    targetLang === 'ar'
      ? 'Translate from English into polished, executive-grade Modern Standard Arabic (الفصحى المؤسسية الرفيعة) natural for GCC and MENA enterprise B2B case studies. Render MENA brand, organization, and partner names naturally in Arabic where standard, while keeping software stack names, URLs, acronyms, and KPI metrics accurate (e.g., Next.js, Cloudflare R2, API, CRM, UI/UX, KPI, ROI).'
      : 'Translate from Arabic into crisp, authoritative executive B2B agency English suitable for enterprise case studies. Provide accurate transliteration or official English rendering of organization and partner names, and preserve all KPI metrics, percentages, and technical terms.'
  }
3. Preserve all numbers, percentages, symbols, units, and proper technical nouns faithfully.
4. ${
    isHtml
      ? 'INPUT IS RICH HTML CONTENT: Preserve ALL HTML tags, nesting, and attributes (<p>, <strong>, <b>, <em>, <i>, <u>, <h2>, <h3>, <ul>, <ol>, <li>, <blockquote>, <br>, <a href="..." target="..." rel="...">) in their exact structure. Translate ONLY visible human-readable text and anchor label text — NEVER alter href URLs or HTML attributes. Never escape tags as &lt; or &gt;, and never wrap output in markdown fences.'
      : 'INPUT IS PLAIN TEXT: Return clean plain text ONLY with NO HTML tags, NO markdown formatting, and NO added quotation marks unless present in the original.'
  }`;

  const contextLines = [
    fieldHint ? `Field Type: ${fieldHint}` : null,
    storyContext?.client ? `Client Context: ${storyContext.client}` : null,
    storyContext?.partner ? `Partner Context: ${storyContext.partner}` : null,
    storyContext?.topic ? `Topic / Industry: ${storyContext.topic}` : null,
    storyContext?.category ? `Category: ${storyContext.category}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const userPrompt = `Translate the following ${sourceName} ${isHtml ? 'HTML' : 'plain text'} field into ${targetName}.${
    contextLines ? `\n\nSTORY CONTEXT:\n${contextLines}` : ''
  }

SOURCE (${sourceName.toUpperCase()}):
"""
${text}
"""

Respond ONLY with JSON: { "translation": "<translated ${targetName} text>" }`;

  return { systemPrompt, userPrompt };
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'author'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = (await request.json().catch(() => null)) as TranslateRequestBody | null;
    if (!body || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Missing source text to translate.' },
        { status: 400 }
      );
    }

    const sourceLang = body.sourceLang;
    const targetLang = body.targetLang;
    if (
      (sourceLang !== 'en' && sourceLang !== 'ar') ||
      (targetLang !== 'en' && targetLang !== 'ar') ||
      sourceLang === targetLang
    ) {
      return NextResponse.json(
        { error: 'Invalid sourceLang or targetLang pair.' },
        { status: 400 }
      );
    }

    const isHtml = Boolean(body.isHtml);
    if (!hasVisibleSourceText(body.text, isHtml)) {
      return NextResponse.json(
        { error: 'Source field is empty. Please enter content before translating.' },
        { status: 400 }
      );
    }

    const { systemPrompt, userPrompt } = buildTranslatePrompts({
      text: body.text,
      sourceLang,
      targetLang,
      isHtml,
      fieldHint: body.fieldHint?.trim(),
      storyContext: body.storyContext,
    });

    const cleanHint = body.fieldHint?.trim().replace(/\s+/g, '_').slice(0, 40) || '';
    const targetField = `translate:${sourceLang}->${targetLang}${cleanHint ? `:${cleanHint}` : ''}`;

    const result = await generateStructuredAiJson<{ translation?: string }>({
      systemPrompt,
      userPrompt,
      targetField,
      storySlug: typeof body.storySlug === 'string' ? body.storySlug : '',
      userId: user.email || user.name,
      providerOverride: body.providerOverride,
      modelOverride: body.modelOverride,
      effectOverride: body.effectOverride,
    });

    const translation =
      typeof result.data?.translation === 'string' ? result.data.translation.trim() : '';

    if (!translation) {
      return NextResponse.json(
        { error: 'AI returned an empty translation.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      translation,
      usage: result.usage,
    });
  } catch (err) {
    console.error('[API /api/ai/translate POST] Error:', err);
    const msg = err instanceof Error ? err.message : 'AI translation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
