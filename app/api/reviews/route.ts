import { NextRequest, NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { revalidatePageContent } from '@/lib/revalidate';
import { reviewsList } from '@shared/data';

export const runtime = 'nodejs';

/**
 * GET /api/reviews
 * Returns all reviews from MongoDB.
 */
export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ success: true, reviews: reviewsList });
    }

    const items = await db.collection(COLLECTIONS.REVIEWS).find({}).toArray();
    return NextResponse.json({
      success: true,
      reviews: items.length > 0 ? items.map((doc) => {
        const { _id, ...rest } = doc;
        return { ...rest, id: _id.toString() };
      }) : reviewsList,
    });
  } catch (error) {
    console.error('[API /api/reviews GET] Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve reviews' }, { status: 500 });
  }
}

/**
 * POST /api/reviews
 * Creates a new review.
 * PROTECTED: Requires 'admin' or 'editor' role.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.name || !body.review) {
      return NextResponse.json({ error: 'Reviewer name and review quote are required.' }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const newDoc = {
      name: body.name.trim(),
      role: (body.role || '').trim(),
      company: (body.company || '').trim(),
      review: body.review.trim(),
      verified: body.verified || 'Verified Client',
      rating: body.rating || 5,
      active: body.active !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection(COLLECTIONS.REVIEWS).insertOne(newDoc);
    revalidatePageContent('home');

    return NextResponse.json({ success: true, id: res.insertedId.toString(), message: 'Review added successfully' }, { status: 201 });
  } catch (error) {
    console.error('[API /api/reviews POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

/**
 * PUT /api/reviews
 * Updates an existing review.
 * PROTECTED: Requires 'admin' or 'editor' role.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json({ error: 'Review ID is required.' }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const filter = ObjectId.isValid(body.id) ? { _id: new ObjectId(body.id) } : { id: body.id };
    const { id, _id, ...fields } = body;
    void id;
    void _id;

    await db.collection(COLLECTIONS.REVIEWS).updateOne(filter, {
      $set: { ...fields, updatedAt: new Date() },
    });

    revalidatePageContent('home');
    return NextResponse.json({ success: true, message: 'Review updated successfully' });
  } catch (error) {
    console.error('[API /api/reviews PUT] Error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

/**
 * DELETE /api/reviews
 * Deletes a review.
 * PROTECTED: Requires 'admin' or 'editor' role.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    await db.collection(COLLECTIONS.REVIEWS).deleteOne(filter);

    revalidatePageContent('home');
    return NextResponse.json({ success: true, message: 'Review removed successfully' });
  } catch (error) {
    console.error('[API /api/reviews DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
