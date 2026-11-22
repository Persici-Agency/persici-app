import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import {
  createTeamMemberInDb,
  deleteTeamMemberFromDb,
  getTeamMembersFromDb,
  reorderTeamMembersInDb,
  seedDefaultTeamMembers,
  updateTeamMemberInDb,
} from '@/lib/team-server';
import type { TeamMemberDetail } from '@/lib/team-types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const activeOnly = request.nextUrl.searchParams.get('activeOnly') === 'true';
    const members = await getTeamMembersFromDb({ activeOnly });
    return NextResponse.json({
      success: true,
      members,
    });
  } catch (err) {
    console.error('[API /api/team GET] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'hr'])) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    if (body.action === 'seed') {
      const seedRes = await seedDefaultTeamMembers();
      if (!seedRes.success) {
        return NextResponse.json(
          { success: false, error: seedRes.error || 'Failed to seed default team' },
          { status: 500 }
        );
      }
      const members = await getTeamMembersFromDb();
      return NextResponse.json({ success: true, count: seedRes.count, members });
    }

    const updatedBy = user.email || user.name || 'admin';
    const result = await createTeamMemberInDb(
      body as Partial<TeamMemberDetail>,
      updatedBy
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      member: result.member,
    });
  } catch (err) {
    console.error('[API /api/team POST] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'hr'])) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const updatedBy = user.email || user.name || 'admin';

    if (body.action === 'reorder') {
      const orderedIds = Array.isArray(body.orderedIds)
        ? body.orderedIds.map((id) => String(id)).filter(Boolean)
        : [];
      if (orderedIds.length === 0) {
        return NextResponse.json(
          { success: false, error: 'orderedIds array is required' },
          { status: 400 }
        );
      }

      const reorderRes = await reorderTeamMembersInDb(orderedIds, updatedBy);
      if (!reorderRes.success) {
        return NextResponse.json(
          { success: false, error: reorderRes.error || 'Failed to reorder team members' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        members: reorderRes.members,
        message: 'Team carousel order updated & saved.',
      });
    }

    const id = String(body.id || body._id || '').trim();
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required for update' },
        { status: 400 }
      );
    }

    const updateRes = await updateTeamMemberInDb(
      id,
      body as Partial<TeamMemberDetail>,
      updatedBy
    );
    if (!updateRes.success) {
      return NextResponse.json(
        { success: false, error: updateRes.error },
        { status: updateRes.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      member: updateRes.member,
    });
  } catch (err) {
    console.error('[API /api/team PUT] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'hr'])) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    let id = request.nextUrl.searchParams.get('id') || '';
    if (!id) {
      const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
      id = String(body.id || body._id || '').trim();
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required for deletion' },
        { status: 400 }
      );
    }

    const res = await deleteTeamMemberFromDb(id);
    if (!res.success) {
      return NextResponse.json(
        { success: false, error: res.error },
        { status: res.status || 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /api/team DELETE] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
