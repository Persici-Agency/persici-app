import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { discoverProviderModels } from '@/lib/ai-server';
import { AI_PROVIDER_IDS, type AiProviderId } from '@/lib/ai-types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const rawProvider = searchParams.get('provider') as AiProviderId | null;
    const provider: AiProviderId =
      rawProvider && AI_PROVIDER_IDS.includes(rawProvider) ? rawProvider : 'gemini';

    const overrideKey = request.headers.get('x-ai-api-key') || undefined;
    const result = await discoverProviderModels(provider, overrideKey, true);

    return NextResponse.json({
      success: true,
      provider,
      ...result,
    });
  } catch (err) {
    console.error('[API /api/ai/models GET] Error:', err);
    return NextResponse.json({ error: 'Failed to discover AI models' }, { status: 500 });
  }
}
