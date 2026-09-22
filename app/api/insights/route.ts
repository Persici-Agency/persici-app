import { NextRequest, NextResponse } from 'next/server';
import { getDbInsights } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { revalidatePageContent } from '@/lib/revalidate';
import type { InsightArticle } from '@shared/types';

export const runtime = 'nodejs';

/**
 * GET /api/insights
 * Returns published insight articles.
 */
export async function GET() {
  try {
    const articles = await getDbInsights();
    return NextResponse.json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error('[API /api/insights GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve articles', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/insights
 * Creates a new insight article in MongoDB.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as Partial<InsightArticle> | null;

    if (!body || !body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Article title and slug are required.' },
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

    const newArticle = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection(COLLECTIONS.INSIGHTS).insertOne(newArticle as unknown as import('mongodb').Document);

    // Revalidate public insights routes
    revalidatePageContent('insights');
    try {
      revalidatePath('/[lang]/insights/[slug]', 'page');
      revalidatePath(`/en/insights/${body.slug}`);
      revalidatePath(`/ar/insights/${body.slug}`);
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: 'Article created successfully.',
        id: res.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /api/insights POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create article', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/insights
 * Updates an existing article.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || (!body.id && !body._id && !body.slug)) {
      return NextResponse.json(
        { error: 'Article ID, _id, or slug is required for updating.' },
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

    await db.collection(COLLECTIONS.INSIGHTS).updateOne(filter, {
      $set: {
        ...updateFields,
        updatedAt: new Date(),
      },
    });

    revalidatePageContent('insights');
    if (body.slug) {
      try {
        revalidatePath('/[lang]/insights/[slug]', 'page');
        revalidatePath(`/en/insights/${body.slug}`);
        revalidatePath(`/ar/insights/${body.slug}`);
      } catch {}
    }

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully.',
    });
  } catch (error) {
    console.error('[API /api/insights PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update article', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/insights
 * Deletes an insight article.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    if (!slug && !id) {
      return NextResponse.json({ error: 'Slug or ID is required' }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const filter = id && ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { slug };
    await db.collection(COLLECTIONS.INSIGHTS).deleteOne(filter);

    revalidatePageContent('insights');
    if (slug) {
      try {
        revalidatePath('/[lang]/insights/[slug]', 'page');
        revalidatePath(`/en/insights/${slug}`);
        revalidatePath(`/ar/insights/${slug}`);
      } catch {}
    }

    return NextResponse.json({ success: true, message: 'Article deleted successfully.' });
  } catch (error) {
    console.error('[API /api/insights DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}

