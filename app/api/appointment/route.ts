import { NextRequest, NextResponse } from 'next/server';
import { saveAppointmentSubmission } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { sendAppointmentNotification } from '@/lib/email';
import type { AppointmentFormData } from '@shared/types';

export const runtime = 'nodejs';

/**
 * GET /api/appointment
 * Retrieves appointment bookings for the dashboard.
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
        appointments: [],
        note: 'MongoDB not connected. Connect MongoDB to view saved appointments.',
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
      { error: 'Failed to retrieve appointments', details: String(error) },
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
      name: body.name.trim(),
      email: body.email.trim(),
      website: body.website?.trim() || '',
      revenue: body.revenue?.trim() || '',
      selectedDate: body.selectedDate?.trim() || '',
      selectedTime: body.selectedTime?.trim() || '',
      phone: body.phone?.trim() || '',
      notes: body.notes?.trim() || '',
    };

    const result = await saveAppointmentSubmission(appointmentData);

    // Dispatch Hostinger email notification explicitly flagged as an appointment from the pop-up
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
      { error: 'Internal server error while processing your appointment.', details: String(error) },
      { status: 500 }
    );
  }
}
