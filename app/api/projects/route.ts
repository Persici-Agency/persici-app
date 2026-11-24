import { NextRequest, NextResponse } from 'next/server';
import { getAllProjectsFromDb, ensureProjectsSeeded } from '@/lib/projects-server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { revalidatePageContent } from '@/lib/revalidate';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

/**
 * GET /api/projects
 * Returns list of projects/case studies.
 * Supports optional ?seed=true to force-sync default stories.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('seed') === 'true') {
      const user = await getSessionUser();
      if (user && isRoleAllowed(user.role, ['admin', 'editor'])) {
        await ensureProjectsSeeded(true);
      }
    }

    const projects = await getAllProjectsFromDb(false);
    return NextResponse.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error('[API /api/projects GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve projects' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Creates a new case study / project in MongoDB.
 * PROTECTED: Requires 'admin', 'editor', or 'author' role.
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

    if (!body || !body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Title and slug are required fields.' },
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

    const isDraftOnly = body.status === 'draft' || body.action === 'save-draft';
    const {
      action: _action,
      lookupSlug: _lookupSlug,
      draftData: _draftData,
      draftUpdatedAt: _draftUpdatedAt,
      ...cleanBody
    } = body;
    void _action;
    void _lookupSlug;
    void _draftData;
    void _draftUpdatedAt;

    const nowIso = new Date().toISOString();
    const newProject = {
      ...cleanBody,
      id: cleanBody.id || cleanBody.slug,
      status: isDraftOnly ? 'draft' : 'published',
      isActive: !isDraftOnly,
      ...(isDraftOnly ? { draftUpdatedAt: nowIso } : {}),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db
      .collection(COLLECTIONS.PROJECTS)
      .insertOne(newProject as unknown as import('mongodb').Document);

    if (!isDraftOnly) {
      revalidatePageContent('work');
      revalidatePageContent('client-stories');
      revalidatePageContent('solutions');
      revalidatePageContent('industries');
      revalidatePageContent('how-we-do-it');
      if (body.slug) {
        try {
          revalidatePath('/[lang]/client-stories/[slug]', 'page');
          revalidatePath(`/en/client-stories/${body.slug}`);
          revalidatePath(`/ar/client-stories/${body.slug}`);
          revalidatePath('/', 'layout');
        } catch {}
      }
    }

    return NextResponse.json(
      {
        success: true,
        mode: isDraftOnly ? 'draft' : 'published',
        message: isDraftOnly ? 'Draft saved successfully.' : 'Project created successfully.',
        id: res.insertedId.toString(),
        ...(isDraftOnly ? { draftUpdatedAt: nowIso } : {}),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /api/projects POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects
 * Updates an existing project, or manages server-side drafts (save-draft / discard-draft / publish).
 * PROTECTED: Requires 'admin', 'editor', or 'author' role.
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
    const lookupSlug =
      typeof body?.lookupSlug === 'string' && body.lookupSlug.trim()
        ? body.lookupSlug.trim()
        : typeof body?.slug === 'string'
        ? body.slug.trim()
        : '';

    if (!body || (!body.id && !body._id && !lookupSlug)) {
      return NextResponse.json(
        { error: 'Project ID, _id, or slug is required for updating.' },
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

    const filter =
      typeof body._id === 'string' && ObjectId.isValid(body._id)
        ? { _id: new ObjectId(body._id) }
        : typeof body.id === 'string' && ObjectId.isValid(body.id)
        ? { _id: new ObjectId(body.id) }
        : { slug: lookupSlug };

    const col = db.collection(COLLECTIONS.PROJECTS);
    const action = typeof body.action === 'string' ? body.action : undefined;

    if (action === 'save-draft') {
      const {
        id: _idVal,
        _id: _mongoId,
        action: _action,
        lookupSlug: _lookup,
        draftData: _draftData,
        draftUpdatedAt: _draftAt,
        ...draftPayload
      } = body;
      void _idVal;
      void _mongoId;
      void _action;
      void _lookup;
      void _draftData;
      void _draftAt;

      const nowIso = new Date().toISOString();
      const existing = await col.findOne(filter);

      if (!existing || existing.status === 'draft' || existing.isActive === false) {
        await col.updateOne(
          filter,
          {
            $set: {
              ...draftPayload,
              id: (draftPayload.id as string) || (draftPayload.slug as string) || lookupSlug,
              slug: (draftPayload.slug as string) || lookupSlug,
              status: 'draft',
              isActive: false,
              draftUpdatedAt: nowIso,
              updatedAt: new Date(),
              ...(existing ? {} : { createdAt: new Date() }),
            },
            $unset: { draftData: '' },
          },
          { upsert: true }
        );
      } else {
        await col.updateOne(filter, {
          $set: {
            draftData: draftPayload,
            draftUpdatedAt: nowIso,
          },
        });
      }

      return NextResponse.json({
        success: true,
        mode: 'draft',
        message: 'Draft saved successfully.',
        draftUpdatedAt: nowIso,
      });
    }

    if (action === 'discard-draft') {
      const existing = await col.findOne(filter);
      if (existing && (existing.status === 'draft' || existing.isActive === false)) {
        await col.deleteOne(filter);
        return NextResponse.json({
          success: true,
          deletedStory: true,
          message: 'Unpublished draft deleted.',
        });
      }

      await col.updateOne(filter, {
        $unset: { draftData: '', draftUpdatedAt: '' },
      });

      return NextResponse.json({
        success: true,
        deletedStory: false,
        message: 'Draft changes discarded.',
      });
    }

    const {
      id: _idVal,
      _id: _mongoId,
      action: _action,
      lookupSlug: _lookup,
      draftData: _draftData,
      draftUpdatedAt: _draftAt,
      ...updateFields
    } = body;
    void _idVal;
    void _mongoId;
    void _action;
    void _lookup;
    void _draftData;
    void _draftAt;

    const isExplicitPublish = action === 'publish';

    await col.updateOne(
      filter,
      {
        $set: {
          ...updateFields,
          ...(isExplicitPublish ? { status: 'published', isActive: true } : {}),
          updatedAt: new Date(),
        },
        ...(isExplicitPublish ? { $unset: { draftData: '', draftUpdatedAt: '' } } : {}),
      },
      { upsert: true }
    );

    revalidatePageContent('work');
    revalidatePageContent('client-stories');
    revalidatePageContent('solutions');
    revalidatePageContent('industries');
    revalidatePageContent('how-we-do-it');
    const slugsToRevalidate = Array.from(
      new Set(
        [typeof body.slug === 'string' ? body.slug : '', lookupSlug].filter(Boolean)
      )
    );
    if (slugsToRevalidate.length > 0) {
      try {
        revalidatePath('/[lang]/client-stories/[slug]', 'page');
        for (const s of slugsToRevalidate) {
          revalidatePath(`/en/client-stories/${s}`);
          revalidatePath(`/ar/client-stories/${s}`);
        }
        revalidatePath('/', 'layout');
      } catch {}
    }

    return NextResponse.json({
      success: true,
      mode: 'published',
      message: 'Project updated successfully.',
    });
  } catch (error) {
    console.error('[API /api/projects PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects
 * Removes a project case study.
 * PROTECTED: Requires 'admin' or 'editor' role.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Only Admins and Editors can delete projects.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ error: 'Missing project id or slug' }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const filter = id && ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { slug: slug! };
    await db.collection(COLLECTIONS.PROJECTS).deleteOne(filter);

    revalidatePageContent('work');
    revalidatePageContent('client-stories');
    revalidatePageContent('solutions');
    revalidatePageContent('industries');
    revalidatePageContent('how-we-do-it');
    if (slug) {
      try {
        revalidatePath('/[lang]/client-stories/[slug]', 'page');
        revalidatePath(`/en/client-stories/${slug}`);
        revalidatePath(`/ar/client-stories/${slug}`);
        revalidatePath('/', 'layout');
      } catch {}
    }

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('[API /api/projects DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
