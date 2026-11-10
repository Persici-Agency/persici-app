import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { saveContactSubmission } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { sendContactFormNotification } from '@/lib/email';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import type { ContactFormData, LeadAttributionInfo } from '@shared/types';

export const runtime = 'nodejs';

// Simple submission rate limiter per IP: max 6 requests per 10 minutes
const submissionIps = new Map<string, { count: number; timestamp: number }>();
function checkSubmissionRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = submissionIps.get(ip);
  if (!record || now - record.timestamp > 10 * 60 * 1000) {
    submissionIps.set(ip, { count: 1, timestamp: now });
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
 * GET /api/contact
 * Retrieves contact submissions for the back-office dashboard.
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
        submissions: [],
        note: 'MongoDB not connected.',
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
        return {
          ...rest,
          id: _id.toString(),
          name: String(rest.name || 'Prospect'),
          email: String(rest.email || ''),
          phone: String(rest.phone || ''),
          company: String(rest.company || ''),
          country: String(rest.country || ''),
          jobTitle: String(rest.jobTitle || ''),
          reason: String(rest.reason || rest.service || rest.subject || 'General Inquiry'),
          subject: String(rest.subject || rest.reason || 'General Inquiry'),
          message: String(rest.message || ''),
          status: String(rest.status || 'unread'),
          notes: String(rest.notes || rest.adminNotes || ''),
          attribution: rest.attribution || undefined,
        };
      }),
    });
  } catch (error) {
    console.error('[API /api/contact GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve contact submissions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contact
 * Handles contact form submissions with server-side validation, rate limiting, and UTM attribution.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkSubmissionRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as
      | (ContactFormData & { recaptchaToken?: string; attribution?: unknown })
      | null;

    if (!body || !body.email || !body.name) {
      return NextResponse.json(
        { error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Optional server-side reCAPTCHA verification if token provided and secret configured
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret && body.recaptchaToken) {
      try {
        const verifyRes = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${body.recaptchaToken}`,
          { method: 'POST' }
        );
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          return NextResponse.json(
            { error: 'reCAPTCHA verification failed. Please try again.' },
            { status: 400 }
          );
        }
      } catch (recaptchaErr) {
        console.warn('[API /api/contact] reCAPTCHA verify warning:', recaptchaErr);
      }
    }

    const contactData: ContactFormData = {
      name: body.name.trim().slice(0, 100),
      email: body.email.trim().toLowerCase().slice(0, 150),
      message: (body.message || '').trim().slice(0, 3000),
      phone: (body.phone || '').trim().slice(0, 50),
      subject: (body.subject || 'General Inquiry').trim().slice(0, 200),
      company: (body.company || '').trim().slice(0, 150),
      country: (body.country || '').trim().slice(0, 100),
      jobTitle: (body.jobTitle || '').trim().slice(0, 100),
      reason: (body.reason || '').trim().slice(0, 100),
      attribution: sanitizeAttribution(body.attribution),
    };

    const result = await saveContactSubmission(contactData);

    try {
      await sendContactFormNotification(contactData);
    } catch (emailErr) {
      console.error('[API /api/contact POST] Email notification dispatch failed:', emailErr);
    }

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
      { error: 'Internal server error while processing your inquiry.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/contact
 * Updates status or internal media-buying notes on a contact submission.
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
        { error: 'Submission ID is required.' },
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
      .collection(COLLECTIONS.CONTACT_SUBMISSIONS)
      .updateOne(filter, { $set: updateFields });

    return NextResponse.json({
      success: true,
      id: body.id,
      ...updateFields,
    });
  } catch (error) {
    console.error('[API /api/contact PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update contact inquiry.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contact?id=<id>
 * Removes a contact submission by ID.
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
        { error: 'Submission ID (?id=...) is required.' },
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

    await db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).deleteOne(filter);

    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (error) {
    console.error('[API /api/contact DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact inquiry.' },
      { status: 500 }
    );
  }
}
