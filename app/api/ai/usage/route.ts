import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { getAiUsageSummary } from '@/lib/ai-server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const usage = await getAiUsageSummary();
    return NextResponse.json({
      success: true,
      usage,
    });
  } catch (err) {
    console.error('[API /api/ai/usage GET] Error:', err);
    return NextResponse.json({ error: 'Failed to load AI usage telemetry' }, { status: 500 });
  }
}
