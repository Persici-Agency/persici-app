import { NextRequest, NextResponse } from 'next/server';
import { getDbServices } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { ServiceItem } from '@shared/types';

export const runtime = 'nodejs';

/**
 * GET /api/services
 * Returns list of growth services.
 */
export async function GET() {
  try {
    const services = await getDbServices();
    return NextResponse.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error('[API /api/services GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve services', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/services
 * Creates a new service in MongoDB.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as Partial<ServiceItem> | null;

    if (!body || !body.slug) {
      return NextResponse.json(
        { error: 'Service slug is required.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'MongoDB connection is not available.' },
        { status: 503 }
      );
    }

    const newService = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection(COLLECTIONS.SERVICES).insertOne(newService);

    return NextResponse.json(
      {
        success: true,
        message: 'Service created successfully.',
        id: res.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /api/services POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create service', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/services
 * Updates an existing service.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || (!body.id && !body._id && !body.slug)) {
      return NextResponse.json(
        { error: 'Service ID, _id, or slug is required for updating.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'MongoDB connection is not available.' },
        { status: 503 }
      );
    }

    const filter = body._id
      ? { _id: new ObjectId(body._id) }
      : body.id && ObjectId.isValid(body.id)
      ? { _id: new ObjectId(body.id) }
      : { slug: body.slug };

    const { id, _id, ...updateFields } = body;
    void id;
    void _id;

    await db.collection(COLLECTIONS.SERVICES).updateOne(filter, {
      $set: {
        ...updateFields,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully.',
    });
  } catch (error) {
    console.error('[API /api/services PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update service', details: String(error) },
      { status: 500 }
    );
  }
}
