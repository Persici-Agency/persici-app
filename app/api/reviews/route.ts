import { NextRequest, NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { revalidatePageContent } from '@/lib/revalidate';
import { reviewsList } from '@shared/data';
import type { ReviewItem } from '@shared/types';

export const runtime = 'nodejs';

/**
 * Normalizes a review document to guarantee bilingual properties exist.
 */
function normalizeReviewDoc(doc: Record<string, unknown> | ReviewItem) {
  const { _id, ...rest } = doc as unknown as Record<string, unknown>;
  const nameVal = rest.name as string | { en?: string; ar?: string } | undefined;
  const nameEn = (String(rest.nameEn || '') || (typeof nameVal === 'object' ? nameVal?.en : nameVal) || '').trim();
  const nameAr = (String(rest.nameAr || '') || (typeof nameVal === 'object' ? nameVal?.ar : '') || nameEn).trim();

  const roleVal = rest.role as string | { en?: string; ar?: string } | undefined;
  const roleEn = (String(rest.roleEn || '') || (typeof roleVal === 'object' ? roleVal?.en : roleVal) || '').trim();
  const roleAr = (String(rest.roleAr || '') || (typeof roleVal === 'object' ? roleVal?.ar : '') || roleEn).trim();

  const compVal = rest.company as string | { en?: string; ar?: string } | undefined;
  const companyEn = (String(rest.companyEn || '') || (typeof compVal === 'object' ? compVal?.en : compVal) || '').trim();
  const companyAr = (String(rest.companyAr || '') || (typeof compVal === 'object' ? compVal?.ar : '') || companyEn).trim();

  const revVal = rest.review as string | { en?: string; ar?: string } | undefined;
  const reviewEn = (String(rest.reviewEn || '') || (typeof revVal === 'object' ? revVal?.en : revVal) || '').trim();
  const reviewAr = (String(rest.reviewAr || '') || (typeof revVal === 'object' ? revVal?.ar : '') || reviewEn).trim();

  const verVal = rest.verified as string | { en?: string; ar?: string } | undefined;
  const verifiedEn = (String(rest.verifiedEn || '') || (typeof verVal === 'object' ? verVal?.en : verVal) || 'Verified Client').trim();
  const verifiedAr = (String(rest.verifiedAr || '') || (typeof verVal === 'object' ? verVal?.ar : '') || 'عميل موثق').trim();

  return {
    ...rest,
    id: _id ? _id.toString() : rest.id,
    name: nameEn || nameAr,
    nameEn,
    nameAr,
    role: roleEn || roleAr,
    roleEn,
    roleAr,
    company: companyEn || companyAr,
    companyEn,
    companyAr,
    review: reviewEn || reviewAr,
    reviewEn,
    reviewAr,
    verified: verifiedEn || verifiedAr,
    verifiedEn,
    verifiedAr,
    rating: typeof rest.rating === 'number' ? rest.rating : (parseFloat(String(rest.rating || '')) || 5),
    active: rest.active !== false,
  };
}

/**
 * Synchronizes the canonical reviews collection with the embedded reviews array in page_contents
 * for the 'home' page. This keeps both storage locations completely identical and in sync.
 */
async function syncPageContentsReviews(db: any) {
  try {
    const allReviews = await db
      .collection(COLLECTIONS.REVIEWS)
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const normalized = allReviews.map(normalizeReviewDoc);
    await db.collection(COLLECTIONS.PAGES).updateOne(
      { page: 'home' },
      { $set: { 'reviews.reviews': normalized } }
    );
  } catch (err) {
    console.warn('[API /api/reviews] Failed to sync page_contents.home.reviews.reviews:', err);
  }
}

/**
 * GET /api/reviews
 * Returns all reviews from MongoDB with normalized bilingual fields.
 */
export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ success: true, reviews: reviewsList.map(normalizeReviewDoc) });
    }

    const items = await db.collection(COLLECTIONS.REVIEWS).find({}).sort({ order: 1, createdAt: -1 }).toArray();
    return NextResponse.json({
      success: true,
      reviews: items.length > 0 ? items.map(normalizeReviewDoc) : reviewsList.map(normalizeReviewDoc),
    });
  } catch (error) {
    console.error('[API /api/reviews GET] Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve reviews' }, { status: 500 });
  }
}

/**
 * POST /api/reviews
 * Creates a new bilingual review.
 * PROTECTED: Requires 'admin' or 'editor' role.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const nameEn = (body.nameEn || (typeof body.name === 'object' ? body.name?.en : body.name) || '').trim();
    const nameAr = (body.nameAr || (typeof body.name === 'object' ? body.name?.ar : '') || nameEn).trim();
    if (!nameEn && !nameAr) {
      return NextResponse.json({ error: 'Reviewer name is required.' }, { status: 400 });
    }

    const reviewEn = (body.reviewEn || (typeof body.review === 'object' ? body.review?.en : body.review) || '').trim();
    const reviewAr = (body.reviewAr || (typeof body.review === 'object' ? body.review?.ar : '') || reviewEn).trim();
    if (!reviewEn && !reviewAr) {
      return NextResponse.json({ error: 'Review quote is required.' }, { status: 400 });
    }

    const roleEn = (body.roleEn || (typeof body.role === 'object' ? body.role?.en : body.role) || '').trim();
    const roleAr = (body.roleAr || (typeof body.role === 'object' ? body.role?.ar : '') || roleEn).trim();

    const companyEn = (body.companyEn || (typeof body.company === 'object' ? body.company?.en : body.company) || '').trim();
    const companyAr = (body.companyAr || (typeof body.company === 'object' ? body.company?.ar : '') || companyEn).trim();

    const verifiedEn = (body.verifiedEn || (typeof body.verified === 'object' ? body.verified?.en : body.verified) || 'Verified Client').trim();
    const verifiedAr = (body.verifiedAr || (typeof body.verified === 'object' ? body.verified?.ar : '') || 'عميل موثق').trim();

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const newDoc = {
      name: nameEn || nameAr,
      nameEn,
      nameAr,
      role: roleEn || roleAr,
      roleEn,
      roleAr,
      company: companyEn || companyAr,
      companyEn,
      companyAr,
      review: reviewEn || reviewAr,
      reviewEn,
      reviewAr,
      verified: verifiedEn || verifiedAr,
      verifiedEn,
      verifiedAr,
      rating: typeof body.rating === 'number' ? body.rating : (parseFloat(body.rating) || 5),
      active: body.active !== false,
      avatar: (body.avatar || '').trim(),
      order: typeof body.order === 'number' ? body.order : 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection(COLLECTIONS.REVIEWS).insertOne(newDoc);
    await syncPageContentsReviews(db);
    revalidatePageContent('home');

    return NextResponse.json({
      success: true,
      id: res.insertedId.toString(),
      review: normalizeReviewDoc({ ...newDoc, _id: res.insertedId }),
      message: 'Review added successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('[API /api/reviews POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

/**
 * PUT /api/reviews
 * Updates an existing review with bilingual content.
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

    const nameEn = (fields.nameEn || (typeof fields.name === 'object' ? fields.name?.en : fields.name) || '').trim();
    const nameAr = (fields.nameAr || (typeof fields.name === 'object' ? fields.name?.ar : '') || nameEn).trim();

    const roleEn = (fields.roleEn || (typeof fields.role === 'object' ? fields.role?.en : fields.role) || '').trim();
    const roleAr = (fields.roleAr || (typeof fields.role === 'object' ? fields.role?.ar : '') || roleEn).trim();

    const companyEn = (fields.companyEn || (typeof fields.company === 'object' ? fields.company?.en : fields.company) || '').trim();
    const companyAr = (fields.companyAr || (typeof fields.company === 'object' ? fields.company?.ar : '') || companyEn).trim();

    const reviewEn = (fields.reviewEn || (typeof fields.review === 'object' ? fields.review?.en : fields.review) || '').trim();
    const reviewAr = (fields.reviewAr || (typeof fields.review === 'object' ? fields.review?.ar : '') || reviewEn).trim();

    const verifiedEn = (fields.verifiedEn || (typeof fields.verified === 'object' ? fields.verified?.en : fields.verified) || 'Verified Client').trim();
    const verifiedAr = (fields.verifiedAr || (typeof fields.verified === 'object' ? fields.verified?.ar : '') || 'عميل موثق').trim();

    const updatePayload: Record<string, unknown> = {
      ...fields,
      name: nameEn || nameAr,
      nameEn,
      nameAr,
      role: roleEn || roleAr,
      roleEn,
      roleAr,
      company: companyEn || companyAr,
      companyEn,
      companyAr,
      review: reviewEn || reviewAr,
      reviewEn,
      reviewAr,
      verified: verifiedEn || verifiedAr,
      verifiedEn,
      verifiedAr,
      updatedAt: new Date(),
    };

    if (fields.rating !== undefined) {
      updatePayload.rating = typeof fields.rating === 'number' ? fields.rating : (parseFloat(fields.rating) || 5);
    }

    await db.collection(COLLECTIONS.REVIEWS).updateOne(filter, {
      $set: updatePayload,
    });

    await syncPageContentsReviews(db);
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

    await syncPageContentsReviews(db);
    revalidatePageContent('home');
    return NextResponse.json({ success: true, message: 'Review removed successfully' });
  } catch (error) {
    console.error('[API /api/reviews DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
