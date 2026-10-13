import { NextRequest, NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';

export const runtime = 'nodejs';

/**
 * GET /api/careers/applicants
 * Retrieves applicant pipeline for the HR ATS module.
 * PROTECTED: Requires 'admin' or 'hr' role.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'hr'])) {
      return NextResponse.json(
        { error: 'Unauthorized. HR or Admin credentials are required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const roleSlug = searchParams.get('role');
    const search = searchParams.get('q');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 200);

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ success: true, count: 0, applicants: [] });
    }

    const query: Record<string, unknown> = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (roleSlug && roleSlug !== 'all') {
      query.roleSlug = roleSlug;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { roleTitle: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await db
      .collection(COLLECTIONS.JOB_APPLICATIONS)
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      count: items.length,
      applicants: items.map((doc) => {
        const { _id, ...rest } = doc;
        return { ...rest, id: _id.toString() };
      }),
    });
  } catch (error) {
    console.error('[API /api/careers/applicants GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve applicants' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/careers/applicants
 * Updates candidate status or adds internal notes.
 * PROTECTED: Requires 'admin' or 'hr' role.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'hr'])) {
      return NextResponse.json(
        { error: 'Unauthorized. HR or Admin credentials are required.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json(
        { error: 'Applicant ID is required.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const filter = ObjectId.isValid(body.id) ? { _id: new ObjectId(body.id) } : { id: body.id };
    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.status) updates.status = body.status;
    if (body.notes !== undefined) updates.internalNotes = body.notes;
    if (body.rating !== undefined) updates.rating = body.rating;

    await db.collection(COLLECTIONS.JOB_APPLICATIONS).updateOne(filter, { $set: updates });

    return NextResponse.json({
      success: true,
      message: 'Applicant record updated successfully.',
    });
  } catch (error) {
    console.error('[API /api/careers/applicants PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update applicant record' },
      { status: 500 }
    );
  }
}
