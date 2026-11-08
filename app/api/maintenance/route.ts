import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import {
  getMaintenanceConfig,
  saveMaintenanceConfig,
} from '@/lib/maintenance-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/maintenance
 * Retrieves the live Maintenance Mode & Redirect configuration.
 */
export async function GET(request: NextRequest) {
  try {
    const force = request.nextUrl.searchParams.get('refresh') === '1';
    const config = await getMaintenanceConfig(force);

    return NextResponse.json(
      {
        success: true,
        config,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('[API /api/maintenance GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve maintenance configuration.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/maintenance
 * Updates the site Maintenance Mode & Global Redirect configuration.
 * PROTECTED: Requires 'admin' or 'editor' role.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json(
        {
          error:
            'Unauthorized. Only Administrators and Editors can modify Maintenance Mode settings.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request payload.' },
        { status: 400 }
      );
    }

    // Validate redirect URL if Redirect Mode is enabled or selected with a non-empty URL
    const rawRedirectUrl =
      typeof body.redirectUrl === 'string' ? body.redirectUrl.trim() : '';

    if (body.enabled && body.mode === 'redirect' && !rawRedirectUrl) {
      return NextResponse.json(
        {
          error:
            'Please provide a valid target Redirect URL (e.g. https://example.com) before activating Direct Redirect Mode.',
        },
        { status: 400 }
      );
    }

    if (rawRedirectUrl) {
      try {
        const parsed = new URL(rawRedirectUrl);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          return NextResponse.json(
            {
              error:
                'Redirect URL must start with http:// or https:// (e.g. https://example.com).',
            },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          {
            error:
              'Invalid Redirect URL format. Please enter a full URL starting with https:// or http://.',
          },
          { status: 400 }
        );
      }
    }

    const result = await saveMaintenanceConfig(
      body,
      user.email || user.name || 'admin'
    );

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/[lang]', 'layout');
      revalidatePath('/en');
      revalidatePath('/ar');
      revalidatePath('/en/maintenance');
      revalidatePath('/ar/maintenance');
    } catch (revalErr) {
      console.warn('[API /api/maintenance PUT] Revalidation notice:', revalErr);
    }

    return NextResponse.json({
      success: true,
      config: result.config,
      persistedToDb: result.persistedToDb,
      message: 'Maintenance mode configuration saved and applied.',
    });
  } catch (error) {
    console.error('[API /api/maintenance PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update maintenance configuration.' },
      { status: 500 }
    );
  }
}
