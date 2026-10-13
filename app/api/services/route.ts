import { NextRequest, NextResponse } from 'next/server';
import { getDbServices } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { revalidatePageContent } from '@/lib/revalidate';
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
 * PROTECTED: Requires 'admin' or 'editor' role.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or Editor permissions required.' },
        { status: 403 }
      );
    }

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

    const res = await db.collection(COLLECTIONS.SERVICES).insertOne(newService as unknown as import('mongodb').Document);
    revalidatePageContent('home');
    revalidatePageContent('services');

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
 * PROTECTED: Requires 'admin' or 'editor' role.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or Editor permissions required.' },
        { status: 403 }
      );
    }

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

    revalidatePageContent('home');
    revalidatePageContent('services');

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

/**
 * DELETE /api/services
 * Deletes a service.
 * PROTECTED: Requires 'admin' or 'editor' role.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or Editor permissions required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    if (!slug && !id) {
      return NextResponse.json({ error: 'Slug or ID is required' }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const filter = id && ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { slug };
    await db.collection(COLLECTIONS.SERVICES).deleteOne(filter);

    revalidatePageContent('home');
    revalidatePageContent('services');

    return NextResponse.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('[API /api/services DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
