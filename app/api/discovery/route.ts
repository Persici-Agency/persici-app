import { NextRequest, NextResponse } from 'next/server';
import { saveDiscoverySubmission } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import type { DiscoveryFormData } from '@shared/types';

export const runtime = 'nodejs';

/**
 * GET /api/discovery
 * Retrieves discovery call leads for the dashboard.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const db = await getDb();
    if (!db) {
      return NextResponse.json({
        success: true,
        count: 0,
        leads: [],
        note: 'MongoDB not connected. Connect MongoDB to view saved leads.',
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
      { error: 'Failed to retrieve discovery leads', details: String(error) },
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
      firstName: body.firstName.trim(),
      lastName: body.lastName?.trim() || '',
      email: body.email.trim(),
      website: body.website?.trim() || '',
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
      { error: 'Failed to process discovery request', details: String(error) },
      { status: 500 }
    );
  }
}
