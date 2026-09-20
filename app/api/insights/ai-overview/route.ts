import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface AiOverviewResponse {
  summary: string;
  keyTakeaways: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.content) {
      return NextResponse.json(
        { error: 'Article content is required for AI overview.' },
        { status: 400 }
      );
    }

    const { title = '', content = '', lang = 'en' } = body;
    const isRtl = lang === 'ar';
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. If GEMINI_API_KEY is configured in environment, call Google Gemini 2.5 Flash
    if (apiKey && apiKey.trim() !== '') {
      try {
        const prompt = `You are an elite AI strategic analyst and editor for Persici, an agency delivering digital engineering, brand architecture, and transformative products.
Analyze the following article sections and synthesize a high-impact, professional executive overview in ${
          isRtl ? 'Arabic (العربية الفصحى الحديثة)' : 'English'
        }.

Your output must be strictly valid JSON matching this schema:
{
  "summary": "2-3 punchy, insightful sentences summarizing the core thesis, operational hurdles, and strategic value of this article.",
  "keyTakeaways": [
    "Takeaway 1 (with bold premise and actionable insight)",
    "Takeaway 2 (with bold premise and actionable insight)",
    "Takeaway 3 (with bold premise and actionable insight)"
  ]
}

Article Title: "${title}"

Article Sections Content:
${content.slice(0, 12000)}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.3,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          const parsed = JSON.parse(rawText) as AiOverviewResponse;

          if (parsed.summary && Array.isArray(parsed.keyTakeaways)) {
            return NextResponse.json({
              success: true,
              summary: parsed.summary,
              keyTakeaways: parsed.keyTakeaways,
              source: 'gemini-live',
            });
          }
        } else {
          const errorDetails = await geminiRes.text();
          console.warn(
            '[Gemini API Warning] Request failed, using fallback synthesis:',
            errorDetails
          );
        }
      } catch (geminiError) {
        console.warn(
          '[Gemini API Exception] Error contacting Gemini, using fallback synthesis:',
          geminiError
        );
      }
    }

    // 2. Fallback synthesis when GEMINI_API_KEY is not yet added in .env
    // Intelligently parse paragraphs and headings from the provided content
    const lines = content
      .split('\n')
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 25);

    const firstTwo = lines.slice(0, 2).join(' ');
    const fallbackSummary = isRtl
      ? `${firstTwo.slice(0, 260)}... يقدم هذا التحليل قراءة استشرافية دقيقة لأبرز التحديات التشغيلية، ويوضح كيفية تحويل البيانات إلى قرارات استراتيجية تحقق قيمة ملموسة.`
      : `${firstTwo.slice(0, 260)}... This analysis articulates a strategic roadmap for engineering and product leaders navigating complex transformation frontiers.`;

    const remaining = lines.slice(2);
    const keyTakeaways: string[] = [];

    for (const line of remaining) {
      if (keyTakeaways.length >= 3) break;
      if (line.length > 30) {
        keyTakeaways.push(
          line.length > 140 ? `${line.slice(0, 137)}...` : line
        );
      }
    }

    if (keyTakeaways.length === 0) {
      keyTakeaways.push(
        isRtl
          ? 'المواءمة الدقيقة بين الفرق البرمجية وأصحاب المصلحة تلغي عنق الزجاجة المعرفي.'
          : 'Tight alignment between cross-functional squads removes information bottlenecks.',
        isRtl
          ? 'أتمتة استخلاص البيانات من سجلات العمليات تكشف المعوقات مبكراً.'
          : 'Automated synthesis from ambient operational artifacts surfaces latent blockers days earlier.',
        isRtl
          ? 'الحوكمة الإنسانية المحكمة تضمن بقاء الذكاء الاصطناعي أداة تمكين لا بديلاً عن القرار البشري.'
          : 'Human-in-the-loop governance ensures AI acts as a collaborative catalyst rather than an uncontrolled arbiter.'
      );
    }

    return NextResponse.json({
      success: true,
      summary: fallbackSummary,
      keyTakeaways,
      source: 'synthesizer',
      note: 'Waiting for GEMINI_API_KEY in .env',
    });
  } catch (error) {
    console.error('[API /api/insights/ai-overview POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI overview', details: String(error) },
      { status: 500 }
    );
  }
}
