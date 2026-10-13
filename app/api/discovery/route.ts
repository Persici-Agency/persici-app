import { NextRequest, NextResponse } from 'next/server';
import { saveDiscoverySubmission } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import type { DiscoveryFormData } from '@shared/types';

export const runtime = 'nodejs';

const discoveryIps = new Map<string, { count: number; timestamp: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = discoveryIps.get(ip);
  if (!record || now - record.timestamp > 10 * 60 * 1000) {
    discoveryIps.set(ip, { count: 1, timestamp: now });
    return true;
  }
  if (record.count >= 6) return false;
  record.count += 1;
  return true;
}

/**
 * GET /api/discovery
 * Retrieves discovery call leads for the dashboard.
 * PROTECTED: Requires 'admin' or 'media buying' role.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'media buying'])) {
      return NextResponse.json(
        { error: 'Unauthorized. An authenticated administrative session is required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

    const db = await getDb();
    if (!db) {
      return NextResponse.json({
        success: true,
        count: 0,
        leads: [],
        note: 'MongoDB not connected.',
      });
    }

    const items = await db
      .collection(COLLECTIONS.DISCOVERY_SUBMISSIONS)
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      count: items.length,
      leads: items.map((doc) => {
        const { _id, ...rest } = doc;
        return { ...rest, id: _id.toString() };
      }),
    });
  } catch (error) {
    console.error('[API /api/discovery GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve discovery leads' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/discovery
 * Handles 30-minute discovery booking submissions.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few moments before trying again.' },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as DiscoveryFormData | null;

    if (!body || !body.email || !body.firstName) {
      return NextResponse.json(
        { error: 'First name and work email are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid work email.' },
        { status: 400 }
      );
    }

    const result = await saveDiscoverySubmission({
      firstName: body.firstName.trim().slice(0, 50),
      lastName: (body.lastName || '').trim().slice(0, 50),
      email: body.email.trim().toLowerCase().slice(0, 150),
      website: (body.website || '').trim().slice(0, 200),
      revenue: body.revenue || 'Not specified',
    });

    return NextResponse.json(
      {
        success: result.success,
        message: 'Discovery session requested! Our growth director will reach out shortly.',
        leadId: result.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /api/discovery POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process discovery request' },
      { status: 500 }
    );
  }
}
