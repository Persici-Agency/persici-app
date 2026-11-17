import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { getAiConfig, saveAiConfig, getAiUsageSummary } from '@/lib/ai-server';
import { toPublicAiConfig, type AiProviderId, type AiSystemConfig } from '@/lib/ai-types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [config, usage] = await Promise.all([getAiConfig(), getAiUsageSummary()]);
    return NextResponse.json({
      success: true,
      config: toPublicAiConfig(config),
      usage,
    });
  } catch (err) {
    console.error('[API /api/ai/config GET] Error:', err);
    return NextResponse.json({ error: 'Failed to load AI configuration' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = (await request.json().catch(() => null)) as
      | (Partial<AiSystemConfig> & { clearKeys?: AiProviderId[] })
      | null;

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid configuration payload' }, { status: 400 });
    }

    const saved = await saveAiConfig(body, user.email || user.name || 'dashboard');
    const usage = await getAiUsageSummary();

    return NextResponse.json({
      success: true,
      config: toPublicAiConfig(saved),
      usage,
    });
  } catch (err) {
    console.error('[API /api/ai/config PUT] Error:', err);
    return NextResponse.json({ error: 'Failed to save AI configuration' }, { status: 500 });
  }
}
