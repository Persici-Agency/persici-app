import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import {
  getClientStoryDetailSpacingFromDb,
  resetClientStoryDetailSpacingInDb,
  saveClientStoryDetailSpacingToDb,
} from '@/lib/projects-server';
import { DEFAULT_CLIENT_STORY_DETAIL_SPACING } from '@/app/[lang]/(site)/client-stories/_client-stories/types';

export const runtime = 'nodejs';

function revalidateClientStoryDetailRoutes() {
  try {
    revalidatePath('/[lang]/client-stories/[slug]', 'page');
    revalidatePath('/[lang]/client-stories', 'page');
    revalidatePath('/en/client-stories');
    revalidatePath('/ar/client-stories');
  } catch {
    // Ignore outside Next request context
  }
}

/**
 * GET /api/projects/detail-spacing
 * Returns the global spacing configuration applied to all Client Story Detail pages.
 */
export async function GET() {
  try {
    const spacing = await getClientStoryDetailSpacingFromDb();
    return NextResponse.json(
      {
        success: true,
        spacing,
        defaults: DEFAULT_CLIENT_STORY_DETAIL_SPACING,
      },
      {
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  } catch (error) {
    console.error('[API /api/projects/detail-spacing GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve Client Story Detail spacing settings' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/detail-spacing
 * Updates global spacing settings across all Client Story Detail pages.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'author'])) {
      return NextResponse.json(
        { error: 'Unauthorized. An authenticated author/editor session is required.' },
        { status: 403 }
      );
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const payload =
      body.spacing && typeof body.spacing === 'object' ? body.spacing : body;
    const spacing = await saveClientStoryDetailSpacingToDb(payload);
    revalidateClientStoryDetailRoutes();

    return NextResponse.json({
      success: true,
      spacing,
      defaults: DEFAULT_CLIENT_STORY_DETAIL_SPACING,
    });
  } catch (error) {
    console.error('[API /api/projects/detail-spacing PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update Client Story Detail spacing settings' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/detail-spacing
 * Resets global Client Story Detail spacing settings back to system defaults.
 */
export async function DELETE() {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'author'])) {
      return NextResponse.json(
        { error: 'Unauthorized. An authenticated author/editor session is required.' },
        { status: 403 }
      );
    }

    const spacing = await resetClientStoryDetailSpacingInDb();
    revalidateClientStoryDetailRoutes();

    return NextResponse.json({
      success: true,
      spacing,
      defaults: DEFAULT_CLIENT_STORY_DETAIL_SPACING,
    });
  } catch (error) {
    console.error('[API /api/projects/detail-spacing DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to reset Client Story Detail spacing settings' },
      { status: 500 }
    );
  }
}
