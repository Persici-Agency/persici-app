import { NextRequest, NextResponse } from 'next/server';
import { saveAppointmentSubmission } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { sendAppointmentNotification } from '@/lib/email';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import type { AppointmentFormData } from '@shared/types';

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
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

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
        return { ...rest, id: _id.toString() };
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

    const body = (await request.json().catch(() => null)) as AppointmentFormData | null;

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
      selectedDate: (body.selectedDate || '').trim().slice(0, 50),
      selectedTime: (body.selectedTime || '').trim().slice(0, 50),
      phone: (body.phone || '').trim().slice(0, 50),
      notes: (body.notes || '').trim().slice(0, 2000),
    };

    const result = await saveAppointmentSubmission(appointmentData);

    // Dispatch Hostinger email notification
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
