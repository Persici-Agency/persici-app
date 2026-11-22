import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import {
  buildMergedFoldersList,
  createCustomFolderInDb,
  deleteCustomFolderFromDb,
} from '@/lib/media-folders';

export const dynamic = 'force-dynamic';

/**
 * GET /api/media/folders
 * Returns merged default, custom, and auto-discovered hierarchical folders with item counts.
 */
export async function GET() {
  try {
    const user = await getSessionUser();
    const canSeeResumes = Boolean(user && isRoleAllowed(user.role, ['admin', 'hr']));

    const folders = await buildMergedFoldersList();
    const filtered = canSeeResumes
      ? folders
      : folders.filter((f) => f.id !== 'resumes' && !f.id.startsWith('resumes/'));

    return NextResponse.json({
      success: true,
      folders: filtered,
    });
  } catch (error) {
    console.error('[API /api/media/folders GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to load media folders', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/media/folders
 * Creates a custom root folder or nested subfolder (e.g., projects/fintech-app).
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor', 'author'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Only Admins, Editors, or Authors can create folders.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const nameEn = typeof body.nameEn === 'string' ? body.nameEn : '';
    const nameAr = typeof body.nameAr === 'string' ? body.nameAr : undefined;
    const parentFolder = typeof body.parentFolder === 'string' ? body.parentFolder : '';
    const slug = typeof body.slug === 'string' ? body.slug : undefined;

    const createdFolder = await createCustomFolderInDb({
      nameEn,
      nameAr,
      parentFolder,
      slug,
      userEmail: user.email,
    });

    const folders = await buildMergedFoldersList();

    return NextResponse.json(
      {
        success: true,
        message: 'Folder created successfully.',
        folder: createdFolder,
        folders,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create folder';
    const isClientError =
      message.includes('required') ||
      message.includes('already exists') ||
      message.includes('Maximum') ||
      message.includes('reserved') ||
      message.includes('slug');

    console.error('[API /api/media/folders POST] Error:', error);
    return NextResponse.json(
      { error: message },
      { status: isClientError ? 400 : 500 }
    );
  }
}

/**
 * DELETE /api/media/folders?id=<folderId>&moveItemsToParent=true
 * Deletes a custom folder or subfolder from MongoDB custom folder registry.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Only Admins and Editors can delete folders.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const moveParam = searchParams.get('moveItemsToParent') === 'true';

    let folderId = idParam || '';
    let moveItemsToParent = moveParam;

    if (!folderId) {
      const body = await request.json().catch(() => ({}));
      folderId = typeof body.id === 'string' ? body.id : '';
      moveItemsToParent = Boolean(body.moveItemsToParent ?? moveParam);
    }

    if (!folderId) {
      return NextResponse.json({ error: 'Missing folder ID to delete.' }, { status: 400 });
    }

    const result = await deleteCustomFolderFromDb(folderId, {
      moveItemsToParent,
      userEmail: user.email,
    });

    const folders = await buildMergedFoldersList();

    return NextResponse.json({
      success: true,
      message: 'Custom folder deleted.',
      ...result,
      folders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete folder';
    const status = message.includes('contains ')
      ? 409
      : message.includes('cannot be deleted') || message.includes('required')
      ? 400
      : 500;

    console.error('[API /api/media/folders DELETE] Error:', error);
    return NextResponse.json({ error: message }, { status });
  }
}
