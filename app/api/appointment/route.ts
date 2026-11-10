import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { saveAppointmentSubmission } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { sendAppointmentNotification } from '@/lib/email';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import type { AppointmentFormData, LeadAttributionInfo } from '@shared/types';

export const runtime = 'nodejs';

const appointmentIps = new Map<string, { count: number; timestamp: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = appointmentIps.get(ip);
  if (!record || now - record.timestamp > 10 * 60 * 1000) {
    appointmentIps.set(ip, { count: 1, timestamp: now });
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
 * GET /api/appointment
 * Retrieves appointment bookings for the dashboard.
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
        appointments: [],
        note: 'MongoDB not connected.',
      });
    }

    const items = await db
      .collection(COLLECTIONS.APPOINTMENTS)
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      count: items.length,
      appointments: items.map((doc) => {
        const { _id, ...rest } = doc;
        const selectedDate = String(rest.selectedDate || rest.date || 'TBD');
        const selectedTime = String(rest.selectedTime || rest.timeSlot || '');
        const website = String(rest.website || rest.company || '');
        const revenue = String(rest.revenue || '');
        return {
          ...rest,
          id: _id.toString(),
          name: String(rest.name || 'Client'),
          email: String(rest.email || ''),
          phone: String(rest.phone || ''),
          website,
          company: website,
          revenue,
          selectedDate,
          date: selectedDate,
          selectedTime,
          timeSlot: selectedTime,
          topic: String(rest.topic || revenue || 'Strategy Discovery Call'),
          notes: String(rest.notes || rest.adminNotes || ''),
          status: String(rest.status || 'pending'),
          attribution: rest.attribution || undefined,
        };
      }),
    });
  } catch (error) {
    console.error('[API /api/appointment GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve appointments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointment
 * Handles appointment bookings submitted from the site floating appointment pop-up.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before booking another session.' },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as
      | (AppointmentFormData & { attribution?: unknown })
      | null;

    if (!body || !body.email || !body.name) {
      return NextResponse.json(
        { error: 'Name and email are required fields for appointment booking.' },
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

    const appointmentData: AppointmentFormData = {
      name: body.name.trim().slice(0, 100),
      email: body.email.trim().toLowerCase().slice(0, 150),
      website: (body.website || '').trim().slice(0, 200),
      revenue: (body.revenue || '').trim().slice(0, 50),
      selectedDate: (body.selectedDate || '').trim().slice(0, 80),
      selectedTime: (body.selectedTime || '').trim().slice(0, 50),
      phone: (body.phone || '').trim().slice(0, 50),
      notes: (body.notes || '').trim().slice(0, 2000),
      attribution: sanitizeAttribution(body.attribution),
    };

    const result = await saveAppointmentSubmission(appointmentData);

    try {
      await sendAppointmentNotification(appointmentData);
    } catch (emailErr) {
      console.error('[API /api/appointment POST] Email notification dispatch failed:', emailErr);
    }

    return NextResponse.json(
      {
        success: result.success,
        message: 'Your discovery appointment has been booked successfully.',
        appointmentId: result.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /api/appointment POST] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing your appointment.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/appointment
 * Updates status or internal notes on an appointment booking.
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
        { error: 'Appointment ID is required.' },
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
      .collection(COLLECTIONS.APPOINTMENTS)
      .updateOne(filter, { $set: updateFields });

    return NextResponse.json({
      success: true,
      id: body.id,
      ...updateFields,
    });
  } catch (error) {
    console.error('[API /api/appointment PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/appointment?id=<id>
 * Removes an appointment booking by ID.
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
        { error: 'Appointment ID (?id=...) is required.' },
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

    await db.collection(COLLECTIONS.APPOINTMENTS).deleteOne(filter);

    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (error) {
    console.error('[API /api/appointment DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment.' },
      { status: 500 }
    );
  }
}
