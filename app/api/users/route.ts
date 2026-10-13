import { NextRequest, NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { hashPassword } from '@/lib/auth/password';
import type { UserRole } from '@/lib/auth/rbac';

export const runtime = 'nodejs';

/**
 * GET /api/users
 * Lists team members.
 * PROTECTED: Requires 'admin' role.
 */
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Root admin access required.' }, { status: 403 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ success: true, users: [] });

    const docs = await db
      .collection(COLLECTIONS.USERS)
      .find({})
      .project({ passwordHash: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      users: docs.map((d) => {
        const { _id, ...rest } = d;
        return { ...rest, id: _id.toString() };
      }),
    });
  } catch (error) {
    console.error('[API /api/users GET] Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve team users.' }, { status: 500 });
  }
}

/**
 * POST /api/users
 * Creates/invites a new team member with an encrypted password.
 * PROTECTED: Requires 'admin' role.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Root admin access required.' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const email = String(body.email).trim().toLowerCase();
    const name = String(body.name).trim();
    const role = (['admin', 'editor', 'author', 'media buying', 'hr'].includes(body.role)
      ? body.role
      : 'editor') as UserRole;

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const existing = await db.collection(COLLECTIONS.USERS).findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'A user with this email address already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(body.password);

    const newUser = {
      name,
      email,
      role,
      passwordHash,
      status: 'active',
      avatar: body.avatar || '',
      createdBy: user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection(COLLECTIONS.USERS).insertOne(newUser);

    return NextResponse.json({
      success: true,
      message: `Team member ${name} created successfully with role: ${role}.`,
      userId: res.insertedId.toString(),
    }, { status: 201 });
  } catch (error) {
    console.error('[API /api/users POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
  }
}

/**
 * PUT /api/users
 * Updates a user role, status, or resets password.
 * PROTECTED: Requires 'admin' role.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Root admin access required.' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const filter = ObjectId.isValid(body.id) ? { _id: new ObjectId(body.id) } : { id: body.id };
    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.role && ['admin', 'editor', 'author', 'media buying', 'hr'].includes(body.role)) {
      updates.role = body.role;
    }
    if (body.status && ['active', 'suspended'].includes(body.status)) {
      updates.status = body.status;
    }
    if (body.name) updates.name = body.name.trim();
    if (body.newPassword && body.newPassword.length >= 6) {
      updates.passwordHash = await hashPassword(body.newPassword);
    }

    await db.collection(COLLECTIONS.USERS).updateOne(filter, { $set: updates });

    return NextResponse.json({ success: true, message: 'User updated successfully.' });
  } catch (error) {
    console.error('[API /api/users PUT] Error:', error);
    return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 });
  }
}

/**
 * DELETE /api/users
 * Removes a team user.
 * PROTECTED: Requires 'admin' role.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    if (id === user.id) {
      return NextResponse.json({ error: 'Cannot delete your own active administrator account.' }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    await db.collection(COLLECTIONS.USERS).deleteOne(filter);

    return NextResponse.json({ success: true, message: 'User removed successfully.' });
  } catch (error) {
    console.error('[API /api/users DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
  }
}
