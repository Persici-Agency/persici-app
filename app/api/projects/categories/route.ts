import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { revalidatePageContent } from '@/lib/revalidate';
import {
  getProjectCategoriesWithCounts,
  ensureProjectCategoriesSeeded,
  mapDocToProjectCategory,
} from '@/lib/projects-server';
import {
  hasAnyBilingualText,
  normalizeBilingualInput,
  resolveBilingualText,
  slugifyCategorySlug,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';

export const runtime = 'nodejs';

function revalidateClientStoriesRoutes() {
  revalidatePageContent('client-stories');
  revalidatePageContent('work');
  revalidatePageContent('solutions');
  revalidatePageContent('industries');
  revalidatePageContent('how-we-do-it');
  try {
    revalidatePath('/[lang]/client-stories', 'page');
    revalidatePath('/en/client-stories');
    revalidatePath('/ar/client-stories');
    revalidatePath('/[lang]/client-stories/[slug]', 'page');
    revalidatePath('/', 'layout');
  } catch {
    // Ignore revalidation errors outside Next request context
  }
}

/**
 * GET /api/projects/categories
 * Returns ordered Client Story categories along with story counts.
 */
export async function GET() {
  try {
    const data = await getProjectCategoriesWithCounts();
    return NextResponse.json({
      success: true,
      categories: data.categories,
      totalStories: data.totalStories,
    });
  } catch (error) {
    console.error('[API /api/projects/categories GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve client story categories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/categories
 * Creates a new Client Story category.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'author'])) {
      return NextResponse.json(
        { error: 'Unauthorized. An authenticated author/editor session is required.' },
        { status: 403 }
      );
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const nameRaw = normalizeBilingualInput(body.name);
    const name = {
      en: nameRaw.en.trim(),
      ar: nameRaw.ar.trim(),
    };

    if (!hasAnyBilingualText(name)) {
      return NextResponse.json(
        { error: 'Category name is required in at least one language (English or Arabic).' },
        { status: 400 }
      );
    }

    const slugSource =
      typeof body.slug === 'string' && body.slug.trim()
        ? body.slug
        : name.en || '';
    const slug = slugifyCategorySlug(slugSource);

    if (!slug) {
      return NextResponse.json(
        {
          error:
            'Please provide a valid URL slug in lowercase English letters, numbers, and hyphens (e.g. fintech).',
        },
        { status: 400 }
      );
    }

    if (slug === 'all') {
      return NextResponse.json(
        { error: 'The slug "all" is reserved for the All Stories filter.' },
        { status: 400 }
      );
    }

    const descRaw = normalizeBilingualInput(body.description);
    const description = {
      en: descRaw.en.trim(),
      ar: descRaw.ar.trim(),
    };

    await ensureProjectCategoriesSeeded();
    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'MongoDB connection is not available.' },
        { status: 503 }
      );
    }

    const col = db.collection(COLLECTIONS.PROJECT_CATEGORIES);
    const existing = await col.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: `A category with slug "${slug}" already exists.` },
        { status: 409 }
      );
    }

    const existingList = await col.find({}, { projection: { order: 1 } }).toArray();
    const maxOrder = existingList.reduce(
      (max, item) =>
        typeof item.order === 'number' && item.order > max ? item.order : max,
      0
    );

    const now = new Date();
    const newDoc = {
      id: slug,
      slug,
      name,
      ...(hasAnyBilingualText(description) ? { description } : {}),
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };

    await col.insertOne(newDoc);
    revalidateClientStoriesRoutes();

    return NextResponse.json(
      {
        success: true,
        category: mapDocToProjectCategory(newDoc),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /api/projects/categories POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/categories
 * Reorders categories OR updates a category and cascades slug/name updates to linked stories.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'author'])) {
      return NextResponse.json(
        { error: 'Unauthorized. An authenticated author/editor session is required.' },
        { status: 403 }
      );
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    await ensureProjectCategoriesSeeded();
    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'MongoDB connection is not available.' },
        { status: 503 }
      );
    }

    const col = db.collection(COLLECTIONS.PROJECT_CATEGORIES);

    // Branch 1: Reorder list
    if (Array.isArray(body.orderedSlugs)) {
      const slugs = body.orderedSlugs
        .map((s) => slugifyCategorySlug(String(s || '')))
        .filter(Boolean);

      if (slugs.length > 0) {
        const now = new Date();
        await col.bulkWrite(
          slugs.map((slug, idx) => ({
            updateOne: {
              filter: { slug },
              update: { $set: { order: idx + 1, updatedAt: now } },
            },
          }))
        );
        revalidateClientStoriesRoutes();
      }

      return NextResponse.json({ success: true });
    }

    // Branch 2: Edit category metadata (+ cascade to matching projects)
    const previousSlug = slugifyCategorySlug(
      String(body.previousSlug || body.slug || '')
    );
    const nextSlug = slugifyCategorySlug(
      String(body.slug || previousSlug)
    );
    const nameRaw = normalizeBilingualInput(body.name);
    const name = {
      en: nameRaw.en.trim(),
      ar: nameRaw.ar.trim(),
    };

    if (!previousSlug || !nextSlug || nextSlug === 'all') {
      return NextResponse.json(
        { error: 'Valid previousSlug and target category slug are required.' },
        { status: 400 }
      );
    }

    if (!hasAnyBilingualText(name)) {
      return NextResponse.json(
        { error: 'Category name is required in at least one language (English or Arabic).' },
        { status: 400 }
      );
    }

    if (nextSlug !== previousSlug) {
      const conflict = await col.findOne({ slug: nextSlug });
      if (conflict) {
        return NextResponse.json(
          { error: `Another category already uses slug "${nextSlug}".` },
          { status: 409 }
        );
      }
    }

    const descRaw = normalizeBilingualInput(body.description);
    const description = {
      en: descRaw.en.trim(),
      ar: descRaw.ar.trim(),
    };

    const existingDoc = await col.findOne({ slug: previousSlug });
    const now = new Date();

    const setFields: Record<string, unknown> = {
      id: nextSlug,
      slug: nextSlug,
      name,
      order:
        typeof existingDoc?.order === 'number'
          ? existingDoc.order
          : (await col.countDocuments()) + 1,
      updatedAt: now,
    };
    if (hasAnyBilingualText(description)) {
      setFields.description = description;
    }

    await col.updateOne(
      { slug: previousSlug },
      {
        $set: setFields,
        $setOnInsert: { createdAt: now },
        ...(hasAnyBilingualText(description) ? {} : { $unset: { description: '' } }),
      },
      { upsert: true }
    );

    const projectLabel = {
      en: resolveBilingualText(name, 'en'),
      ar: resolveBilingualText(name, 'ar'),
    };

    const cascadeRes = await db.collection(COLLECTIONS.PROJECTS).updateMany(
      { categorySlug: previousSlug },
      {
        $set: {
          categorySlug: nextSlug,
          category: projectLabel,
          updatedAt: now,
        },
      }
    );

    revalidateClientStoriesRoutes();

    const updatedDoc = await col.findOne({ slug: nextSlug });
    return NextResponse.json({
      success: true,
      category: updatedDoc ? mapDocToProjectCategory(updatedDoc) : undefined,
      syncedStories: cascadeRes.modifiedCount,
    });
  } catch (error) {
    console.error('[API /api/projects/categories PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/categories
 * Deletes a category, safely reassigning any linked client stories first if storyCount > 0.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Only Admins and Editors can delete categories.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    const rawSlug = searchParams.get('slug') || (typeof body?.slug === 'string' ? body.slug : '');
    const rawReassign =
      searchParams.get('reassignToSlug') ||
      (typeof body?.reassignToSlug === 'string' ? body.reassignToSlug : '');

    const slug = slugifyCategorySlug(rawSlug);
    const reassignToSlug = slugifyCategorySlug(rawReassign);

    if (!slug || slug === 'all') {
      return NextResponse.json({ error: 'Valid category slug is required.' }, { status: 400 });
    }

    await ensureProjectCategoriesSeeded();
    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'MongoDB connection is not available.' },
        { status: 503 }
      );
    }

    const col = db.collection(COLLECTIONS.PROJECT_CATEGORIES);
    const totalCategories = await col.countDocuments();
    if (totalCategories <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last remaining client story category.' },
        { status: 400 }
      );
    }

    const projectsCol = db.collection(COLLECTIONS.PROJECTS);
    const linkedCount = await projectsCol.countDocuments({ categorySlug: slug });

    if (linkedCount > 0) {
      if (!reassignToSlug || reassignToSlug === slug) {
        return NextResponse.json(
          {
            error: `This category is used by ${linkedCount} client stories. Select a target category to reassign them first.`,
          },
          { status: 400 }
        );
      }

      const targetDoc = await col.findOne({ slug: reassignToSlug });
      if (!targetDoc) {
        return NextResponse.json(
          { error: `Reassignment category "${reassignToSlug}" does not exist.` },
          { status: 400 }
        );
      }

      const targetCategory = mapDocToProjectCategory(targetDoc);
      await projectsCol.updateMany(
        { categorySlug: slug },
        {
          $set: {
            categorySlug: targetCategory.slug,
            category: {
              en: resolveBilingualText(targetCategory.name, 'en'),
              ar: resolveBilingualText(targetCategory.name, 'ar'),
            },
            updatedAt: new Date(),
          },
        }
      );
    }

    await col.deleteMany({ slug });
    revalidateClientStoriesRoutes();

    return NextResponse.json({
      success: true,
      reassignedStories: linkedCount,
    });
  } catch (error) {
    console.error('[API /api/projects/categories DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
