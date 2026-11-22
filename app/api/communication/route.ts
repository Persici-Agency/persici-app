import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import {
  getCommunicationConfigFromDb,
  saveCommunicationConfigToDb,
} from '@/lib/communication-server';
import type { CommunicationSocialConfig } from '@/lib/communication-types';

export const runtime = 'nodejs';

/**
 * GET /api/communication
 * Returns the centralized Communication & Social Media configuration.
 */
export async function GET() {
  try {
    const config = await getCommunicationConfigFromDb();
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('[API /api/communication GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve communication & social media configuration.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/communication
 * Updates website domain, emails, phones, social links, regional branches, and direct channels.
 * PROTECTED: Requires 'admin' or 'editor' role.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or Editor role required.' },
        { status: 403 }
      );
    }

    const body = (await request.json().catch(() => null)) as
      | Partial<CommunicationSocialConfig>
      | { config?: Partial<CommunicationSocialConfig> }
      | null;

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const payload =
      'config' in body && body.config && typeof body.config === 'object'
        ? body.config
        : (body as Partial<CommunicationSocialConfig>);

    const saved = await saveCommunicationConfigToDb(
      payload,
      user.email || user.name || 'admin'
    );

    if (!saved.success) {
      return NextResponse.json(
        { error: saved.error || 'Failed to save configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      config: saved.config,
      message: 'Communication & Social Media settings published across the entire site.',
    });
  } catch (error) {
    console.error('[API /api/communication PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to save communication configuration.' },
      { status: 500 }
    );
  }
}
