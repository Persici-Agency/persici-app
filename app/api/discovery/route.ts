import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { saveDiscoverySubmission } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import type { DiscoveryFormData, LeadAttributionInfo } from '@shared/types';

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

function sanitizeAttribution(raw: unknown): LeadAttributionInfo | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const obj = raw as Record<string, unknown>;
  const clean: LeadAttributionInfo = {};
  const keys: (keyof LeadAttributionInfo)[] = [
    'utmSource',
    'utmMedium',
    'utmCampaign',
    'utmTerm',
    'utmContent',
    'gclid',
    'fbclid',
    'ttclid',
    'liFatId',
    'twclid',
    'sccid',
    'referrer',
    'landingPage',
  ];
  for (const k of keys) {
    if (typeof obj[k] === 'string' && obj[k].trim()) {
      clean[k] = obj[k].trim().slice(0, 250);
    }
  }
  return Object.keys(clean).length > 0 ? clean : undefined;
}

/**
 * GET /api/discovery
 * Retrieves discovery call leads for the dashboard.
 * Returns both `leads` and `submissions` with normalized fields.
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
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);

    const db = await getDb();
    if (!db) {
      return NextResponse.json({
        success: true,
        count: 0,
        leads: [],
        submissions: [],
        note: 'MongoDB not connected.',
      });
    }

    const items = await db
      .collection(COLLECTIONS.DISCOVERY_SUBMISSIONS)
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const normalized = items.map((doc) => {
      const { _id, ...rest } = doc;
      const firstName = String(rest.firstName || '');
      const lastName = String(rest.lastName || '');
      const fullName =
        String(rest.name || `${firstName} ${lastName}`.trim()) ||
        'Enterprise Account';
      const website = String(rest.website || rest.company || '');
      const revenue = String(rest.revenue || rest.budgetTier || 'Custom Tier');

      return {
        ...rest,
        id: _id.toString(),
        name: fullName,
        firstName: firstName || fullName.split(' ')[0] || '',
        lastName: lastName || fullName.split(' ').slice(1).join(' ') || '',
        email: String(rest.email || ''),
        phone: String(rest.phone || ''),
        website,
        company: String(rest.company || website || ''),
        revenue,
        budgetTier: revenue,
        timeline: String(rest.timeline || 'Immediate'),
        description: String(rest.description || ''),
        notes: String(rest.notes || ''),
        status: String(rest.status || 'pending'),
        attribution: rest.attribution || undefined,
      };
    });

    return NextResponse.json({
      success: true,
      count: normalized.length,
      leads: normalized,
      submissions: normalized,
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

    const body = (await request.json().catch(() => null)) as
      | (DiscoveryFormData & { attribution?: unknown })
      | null;

    const firstName = (body?.firstName || body?.name || '').trim();
    if (!body || !body.email || !firstName) {
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

    const lastName = (body.lastName || '').trim().slice(0, 50);
    const fullName = (body.name || `${firstName} ${lastName}`.trim()).slice(0, 100);

    const result = await saveDiscoverySubmission({
      firstName: firstName.slice(0, 50),
      lastName,
      name: fullName,
      email: body.email.trim().toLowerCase().slice(0, 150),
      website: (body.website || '').trim().slice(0, 200),
      revenue: body.revenue || 'Not specified',
      phone: (body.phone || '').trim().slice(0, 50),
      company: (body.company || body.website || '').trim().slice(0, 150),
      timeline: (body.timeline || 'Immediate').trim().slice(0, 100),
      description: (body.description || '').trim().slice(0, 2000),
      attribution: sanitizeAttribution(body.attribution),
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

/**
 * PUT /api/discovery
 * Updates status or internal notes on a discovery lead.
 * PROTECTED: Requires 'admin' or 'media buying' role.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'media buying'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or Media Buying role is required.' },
        { status: 403 }
      );
    }

    const body = (await request.json().catch(() => null)) as {
      id?: string;
      status?: string;
      notes?: string;
    } | null;

    if (!body || !body.id) {
      return NextResponse.json(
        { error: 'Discovery Lead ID is required.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not connected.' },
        { status: 503 }
      );
    }

    const updateFields: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (typeof body.status === 'string') {
      updateFields.status = body.status.trim();
    }
    if (typeof body.notes === 'string') {
      updateFields.notes = body.notes.trim().slice(0, 5000);
    }

    const filter = ObjectId.isValid(body.id)
      ? { _id: new ObjectId(body.id) }
      : ({ _id: body.id } as unknown as Record<string, unknown>);

    await db
      .collection(COLLECTIONS.DISCOVERY_SUBMISSIONS)
      .updateOne(filter, { $set: updateFields });

    return NextResponse.json({
      success: true,
      id: body.id,
      ...updateFields,
    });
  } catch (error) {
    console.error('[API /api/discovery PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update discovery lead.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/discovery?id=<id>
 * Removes a discovery lead by ID.
 * PROTECTED: Requires 'admin' or 'media buying' role.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'media buying'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or Media Buying role is required.' },
        { status: 403 }
      );
    }

    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Discovery Lead ID (?id=...) is required.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not connected.' },
        { status: 503 }
      );
    }

    const filter = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : ({ _id: id } as unknown as Record<string, unknown>);

    await db.collection(COLLECTIONS.DISCOVERY_SUBMISSIONS).deleteOne(filter);

    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (error) {
    console.error('[API /api/discovery DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete discovery lead.' },
      { status: 500 }
    );
  }
}
