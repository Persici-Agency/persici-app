import { NextRequest, NextResponse } from 'next/server';
import { saveContactSubmission } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import type { ContactFormData } from '@shared/types';

export const runtime = 'nodejs';

/**
 * GET /api/contact
 * Retrieves contact submissions for the back-office dashboard.
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
        submissions: [],
        note: 'MongoDB not connected. Connect MongoDB to view saved submissions.',
      });
    }

    const items = await db
      .collection(COLLECTIONS.CONTACT_SUBMISSIONS)
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      count: items.length,
      submissions: items.map((doc) => {
        const { _id, ...rest } = doc;
        return { ...rest, id: _id.toString() };
      }),
    });
  } catch (error) {
    console.error('[API /api/contact GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve contact submissions', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contact
 * Handles contact form submissions.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as ContactFormData | null;

    if (!body || !body.email || !body.name) {
      return NextResponse.json(
        { error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const result = await saveContactSubmission({
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message?.trim() || '',
      phone: body.phone?.trim() || '',
      subject: body.subject?.trim() || 'General Inquiry',
    });

    return NextResponse.json(
      {
        success: result.success,
        message: 'Thank you! Your inquiry has been received.',
        submissionId: result.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /api/contact POST] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing your inquiry.', details: String(error) },
      { status: 500 }
    );
  }
}
