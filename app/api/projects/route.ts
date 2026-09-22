import { NextRequest, NextResponse } from 'next/server';
import { getDbProjects } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { revalidatePageContent } from '@/lib/revalidate';
import { revalidatePath } from 'next/cache';
import type { ProjectItem } from '@shared/types';

export const runtime = 'nodejs';

/**
 * GET /api/projects
 * Returns list of projects/case studies.
 */
export async function GET() {
  try {
    const projects = await getDbProjects();
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

    const body = (await request.json().catch(() => null)) as Partial<ProjectItem> | null;

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

    const newProject = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection(COLLECTIONS.PROJECTS).insertOne(newProject as unknown as import('mongodb').Document);

    revalidatePageContent('work');
    revalidatePageContent('client-stories');
    if (body.slug) {
      try {
        revalidatePath('/[lang]/client-stories/[slug]', 'page');
        revalidatePath(`/en/client-stories/${body.slug}`);
        revalidatePath(`/ar/client-stories/${body.slug}`);
      } catch {}
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Project created successfully.',
        id: res.insertedId.toString(),
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
 * Updates an existing project.
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

    const body = await request.json().catch(() => null);
    if (!body || (!body.id && !body._id && !body.slug)) {
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

    const filter = body._id
      ? { _id: new ObjectId(body._id) }
      : body.id && ObjectId.isValid(body.id)
      ? { _id: new ObjectId(body.id) }
      : { slug: body.slug };

    const { id, _id, ...updateFields } = body;
    void id;
    void _id;

    await db.collection(COLLECTIONS.PROJECTS).updateOne(filter, {
      $set: {
        ...updateFields,
        updatedAt: new Date(),
      },
    });

    revalidatePageContent('work');
    revalidatePageContent('client-stories');
    if (body.slug) {
      try {
        revalidatePath('/[lang]/client-stories/[slug]', 'page');
        revalidatePath(`/en/client-stories/${body.slug}`);
        revalidatePath(`/ar/client-stories/${body.slug}`);
      } catch {}
    }

    return NextResponse.json({
      success: true,
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
    if (slug) {
      try {
        revalidatePath('/[lang]/client-stories/[slug]', 'page');
        revalidatePath(`/en/client-stories/${slug}`);
        revalidatePath(`/ar/client-stories/${slug}`);
      } catch {}
    }

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('[API /api/projects DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
