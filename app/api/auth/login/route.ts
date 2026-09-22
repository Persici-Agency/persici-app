import { NextRequest, NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { verifyPassword } from '@/lib/auth/password';
import { signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/jwt';
import type { UserRole } from '@/lib/auth/rbac';

export const runtime = 'nodejs';

// Simple in-memory rate limiter for login brute-force prevention
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; remainingWait?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (now - record.firstAttempt > LOCKOUT_WINDOW) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const remainingWait = Math.ceil((LOCKOUT_WINDOW - (now - record.firstAttempt)) / 1000 / 60);
    return { allowed: false, remainingWait };
  }

  record.count += 1;
  return { allowed: true };
}

function resetRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again in ${rateCheck.remainingWait} minutes.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const email = String(body.email).trim().toLowerCase();
    const password = String(body.password);

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection is temporarily unavailable. Please try again shortly.' },
        { status: 503 }
      );
    }

    const user = await db.collection(COLLECTIONS.USERS).findOne({ email });
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (user.status === 'suspended') {
      return NextResponse.json(
        { error: 'This account has been deactivated. Please contact an administrator.' },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Login successful — reset rate limiter
    resetRateLimit(ip);

    // Update lastLogin in MongoDB
    await db.collection(COLLECTIONS.USERS).updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    const role = (user.role as UserRole) || 'editor';
    const token = await signSessionToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name || 'Team Member',
      role,
      avatar: user.avatar || '',
    });

    const isProd = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role,
        avatar: user.avatar,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('[API /api/auth/login] Error:', error);
    return NextResponse.json(
      { error: 'Authentication failed due to an internal server error.' },
      { status: 500 }
    );
  }
}
