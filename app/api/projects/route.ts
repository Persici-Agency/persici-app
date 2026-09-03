import { NextRequest, NextResponse } from 'next/server';
import { getDbProjects } from '@shared/services/db.service';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
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
      { error: 'Failed to retrieve projects', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Creates a new case study / project in MongoDB.
 */
export async function POST(request: NextRequest) {
  try {
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

    const res = await db.collection(COLLECTIONS.PROJECTS).insertOne(newProject);

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
      { error: 'Failed to create project', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects
 * Updates an existing project.
 */
export async function PUT(request: NextRequest) {
  try {
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

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully.',
    });
  } catch (error) {
    console.error('[API /api/projects PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update project', details: String(error) },
      { status: 500 }
    );
  }
}
