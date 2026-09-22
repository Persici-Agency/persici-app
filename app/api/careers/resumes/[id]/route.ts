import { NextRequest, NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

/**
 * GET /api/careers/resumes/[id]
 * Securely streams candidate CV/Resume to authenticated HR or Admin.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'hr'])) {
      return NextResponse.json(
        { error: 'Unauthorized. An authenticated HR session is required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    const application = await db.collection(COLLECTIONS.JOB_APPLICATIONS).findOne(filter);

    if (!application || !application.resumeUrl) {
      return NextResponse.json({ error: 'Resume document not found for this applicant.' }, { status: 404 });
    }

    const { resumeUrl, resumeFileName = 'resume.pdf' } = application;

    // If local file
    if (resumeUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', resumeUrl);
      try {
        const fileBuffer = await fs.readFile(filePath);
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${resumeFileName}"`,
          },
        });
      } catch {
        return NextResponse.json({ error: 'File not found on local storage.' }, { status: 404 });
      }
    }

    // If remote R2 URL, stream or redirect securely
    if (resumeUrl.startsWith('http')) {
      try {
        const response = await fetch(resumeUrl);
        if (!response.ok) throw new Error('Remote fetch failed');
        const buffer = await response.arrayBuffer();
        return new NextResponse(Buffer.from(buffer), {
          headers: {
            'Content-Type': response.headers.get('content-type') || 'application/pdf',
            'Content-Disposition': `inline; filename="${resumeFileName}"`,
          },
        });
      } catch {
        return NextResponse.redirect(resumeUrl);
      }
    }

    return NextResponse.json({ error: 'Invalid resume storage format' }, { status: 400 });
  } catch (error) {
    console.error('[API /api/careers/resumes/[id]] Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve resume' }, { status: 500 });
  }
}
