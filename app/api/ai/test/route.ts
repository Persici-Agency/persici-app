import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import {
  getAiConfig,
  getAiUsageSummary,
  probeProviderConnectionAndBalance,
} from '@/lib/ai-server';
import { AI_PROVIDER_IDS, toPublicAiConfig, type AiProviderId } from '@/lib/ai-types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = (await request.json().catch(() => null)) as {
      provider?: AiProviderId;
      modelId?: string;
      apiKey?: string;
    } | null;

    const provider: AiProviderId =
      body?.provider && AI_PROVIDER_IDS.includes(body.provider) ? body.provider : 'gemini';

    const probe = await probeProviderConnectionAndBalance(
      provider,
      body?.modelId,
      body?.apiKey
    );

    const [config, usage] = await Promise.all([getAiConfig(true), getAiUsageSummary()]);

    return NextResponse.json({
      success: probe.ok,
      probe,
      config: toPublicAiConfig(config),
      usage,
    });
  } catch (err) {
    console.error('[API /api/ai/test POST] Error:', err);
    return NextResponse.json({ error: 'Failed to test AI connection' }, { status: 500 });
  }
}
