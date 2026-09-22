import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user,
  });
}

/**
 * PUT /api/auth/me
 * Allows authenticated user to update their own profile and change password.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const filter = ObjectId.isValid(user.id) ? { _id: new ObjectId(user.id) } : { email: user.email };
    const currentRecord = await db.collection(COLLECTIONS.USERS).findOne(filter);

    if (!currentRecord) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.name && typeof body.name === 'string') {
      updates.name = body.name.trim();
    }

    if (body.newPassword) {
      if (!body.currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password.' }, { status: 400 });
      }

      const isValid = await verifyPassword(body.currentPassword, currentRecord.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'The current password you provided is incorrect.' }, { status: 400 });
      }

      if (body.newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
      }

      updates.passwordHash = await hashPassword(body.newPassword);
    }

    await db.collection(COLLECTIONS.USERS).updateOne(filter, { $set: updates });

    return NextResponse.json({
      success: true,
      message: 'Profile and security credentials updated successfully.',
    });
  } catch (error) {
    console.error('[API /api/auth/me PUT] Error:', error);
    return NextResponse.json({ error: 'Failed to update credentials' }, { status: 500 });
  }
}
