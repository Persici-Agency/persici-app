import { NextRequest, NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { revalidatePageContent } from '@/lib/revalidate';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import {
  getAllInsightsFromDb,
  getInsightBySlugFromDb,
  ensureInsightsSeeded,
  DEFAULT_INSIGHT_SECTION_VISIBILITY,
} from '@/lib/insights-server';
import type { InsightDetail } from '@/app/[lang]/(site)/insights/_insights/types';

export const runtime = 'nodejs';

/**
 * GET /api/insights
 * Returns insight articles (supports ?includeInactive=true for dashboard, ?seed=true, ?slug=...).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const forceSeed = searchParams.get('seed') === 'true';
    const slug = searchParams.get('slug');

    if (forceSeed) {
      await ensureInsightsSeeded(true);
    }

    if (slug) {
      const article = await getInsightBySlugFromDb(slug, includeInactive);
      if (!article) {
        return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        article,
      });
    }

    const articles = await getAllInsightsFromDb(!includeInactive);
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
 * Creates or upserts an insight article in MongoDB.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'author'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Author, Editor, or Admin access required.' },
        { status: 403 }
      );
    }

    const body = (await request.json().catch(() => null)) as Partial<InsightDetail> | null;

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

    const { originalSlug, _id, ...cleanBody } = body as Partial<InsightDetail> & { _id?: string };
    void _id;

    const categorySlug = cleanBody.categorySlug || 'article';
    const defaultCategory =
      categorySlug === 'research'
        ? { en: 'Research', ar: 'بحث ودراسة' }
        : { en: 'Article', ar: 'مقال' };

    const articlePayload = {
      ...cleanBody,
      id: cleanBody.id || cleanBody.slug,
      slug: cleanBody.slug,
      categorySlug,
      category: cleanBody.category || defaultCategory,
      isActive: cleanBody.isActive !== false,
      featured: Boolean(cleanBody.featured),
      sectionVisibility: {
        ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
        ...(cleanBody.sectionVisibility || {}),
      },
      updatedAt: new Date(),
    };

    const filterSlug = originalSlug || cleanBody.slug;
    const existing = await db.collection(COLLECTIONS.INSIGHTS).findOne({ slug: filterSlug });

    let resultId = cleanBody.id || cleanBody.slug;
    if (existing) {
      await db.collection(COLLECTIONS.INSIGHTS).updateOne(
        { _id: existing._id },
        { $set: articlePayload }
      );
      resultId = existing._id.toString();
    } else {
      const res = await db.collection(COLLECTIONS.INSIGHTS).insertOne({
        ...articlePayload,
        createdAt: new Date(),
      } as unknown as import('mongodb').Document);
      resultId = res.insertedId.toString();
    }

    // Revalidate public insights routes
    revalidatePageContent('insights');
    try {
      revalidatePath('/[lang]/insights', 'page');
      revalidatePath('/en/insights');
      revalidatePath('/ar/insights');
      revalidatePath('/[lang]/insights/[slug]', 'page');
      revalidatePath(`/en/insights/${cleanBody.slug}`);
      revalidatePath(`/ar/insights/${cleanBody.slug}`);
      if (originalSlug && originalSlug !== cleanBody.slug) {
        revalidatePath(`/en/insights/${originalSlug}`);
        revalidatePath(`/ar/insights/${originalSlug}`);
      }
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: 'Article saved successfully.',
        id: resultId,
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
 * Updates an existing article (including quick status/featured/sectionVisibility toggles).
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'author'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Author, Editor, or Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || (!body.id && !body._id && !body.slug && !body.originalSlug)) {
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

    await ensureInsightsSeeded();

    const lookupSlug = body.originalSlug || body.slug;
    const filter = lookupSlug
      ? { slug: lookupSlug }
      : body._id && ObjectId.isValid(body._id)
      ? { _id: new ObjectId(body._id) }
      : body.id && ObjectId.isValid(body.id)
      ? { _id: new ObjectId(body.id) }
      : { id: body.id };

    const { _id, originalSlug, ...updateFields } = body;
    void _id;

    await db.collection(COLLECTIONS.INSIGHTS).updateOne(
      filter,
      {
        $set: {
          ...updateFields,
          updatedAt: new Date(),
        },
      },
      { upsert: Boolean(lookupSlug && updateFields.title) }
    );

    revalidatePageContent('insights');
    try {
      revalidatePath('/[lang]/insights', 'page');
      revalidatePath('/en/insights');
      revalidatePath('/ar/insights');
      revalidatePath('/[lang]/insights/[slug]', 'page');
      if (body.slug) {
        revalidatePath(`/en/insights/${body.slug}`);
        revalidatePath(`/ar/insights/${body.slug}`);
      }
      if (originalSlug && originalSlug !== body.slug) {
        revalidatePath(`/en/insights/${originalSlug}`);
        revalidatePath(`/ar/insights/${originalSlug}`);
      }
    } catch {}

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
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Editor or Admin access required.' },
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

    const filter = slug
      ? { slug }
      : id && ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { id };
    await db.collection(COLLECTIONS.INSIGHTS).deleteOne(filter);

    revalidatePageContent('insights');
    try {
      revalidatePath('/[lang]/insights', 'page');
      revalidatePath('/en/insights');
      revalidatePath('/ar/insights');
      if (slug) {
        revalidatePath('/[lang]/insights/[slug]', 'page');
        revalidatePath(`/en/insights/${slug}`);
        revalidatePath(`/ar/insights/${slug}`);
      }
    } catch {}

    return NextResponse.json({ success: true, message: 'Article deleted successfully.' });
  } catch (error) {
    console.error('[API /api/insights DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}


