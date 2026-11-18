import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import {
  getAiConfig,
  saveAiConfig,
  getAiUsageSummary,
  discoverProviderModels,
} from '@/lib/ai-server';
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

    let saved = await saveAiConfig(body, user.email || user.name || 'dashboard');
    if (saved.providers[saved.activeProvider]?.hasApiKey) {
      try {
        const discovery = await discoverProviderModels(saved.activeProvider, undefined, true);
        if (
          discovery.source === 'live-api' &&
          discovery.models.length > 0 &&
          !discovery.models.some((m) => m.id === saved.activeModelId)
        ) {
          saved = await saveAiConfig(
            { activeModelId: discovery.models[0].id },
            user.email || user.name || 'dashboard'
          );
        } else {
          saved = await getAiConfig(true);
        }
      } catch {
        // Keep saved config even if live discovery endpoint fails
      }
    }

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
