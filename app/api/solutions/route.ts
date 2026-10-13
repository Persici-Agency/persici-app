import { NextRequest, NextResponse } from 'next/server';
import { getDbSolutions } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { revalidatePageContent } from '@/lib/revalidate';
import type { SolutionOfferingItem } from '@shared/types';

export const runtime = 'nodejs';

/**
 * GET /api/solutions
 * Returns list of growth solutions.
 */
export async function GET() {
  try {
    const solutions = await getDbSolutions();
    return NextResponse.json({
      success: true,
      count: solutions.length,
      solutions,
    });
  } catch (error) {
    console.error('[API /api/solutions GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve solutions', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/solutions
 * Creates a new solution item in MongoDB.
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

    const body = (await request.json().catch(() => null)) as Partial<SolutionOfferingItem> | null;

    if (!body || !body.slug) {
      return NextResponse.json(
        { error: 'Solution slug is required.' },
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

    const newSolution = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection(COLLECTIONS.SOLUTIONS).insertOne(newSolution as unknown as import('mongodb').Document);
    revalidatePageContent('solutions');

    return NextResponse.json(
      {
        success: true,
        message: 'Solution created successfully.',
        id: res.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /api/solutions POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create solution', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/solutions
 * Updates an existing solution.
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
        { error: 'Solution ID, _id, or slug is required for updating.' },
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

    await db.collection(COLLECTIONS.SOLUTIONS).updateOne(filter, {
      $set: {
        ...updateFields,
        updatedAt: new Date(),
      },
    });

    revalidatePageContent('solutions');

    return NextResponse.json({
      success: true,
      message: 'Solution updated successfully.',
    });
  } catch (error) {
    console.error('[API /api/solutions PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update solution', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/solutions
 * Deletes a solution offering.
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
    await db.collection(COLLECTIONS.SOLUTIONS).deleteOne(filter);

    revalidatePageContent('solutions');

    return NextResponse.json({ success: true, message: 'Solution deleted successfully.' });
  } catch (error) {
    console.error('[API /api/solutions DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete solution' }, { status: 500 });
  }
}
