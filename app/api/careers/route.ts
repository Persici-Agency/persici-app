import { NextRequest, NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { getAllCareersFromDb } from '@/lib/careers-server';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * GET /api/careers
 * Returns active career openings with optional department and location filters.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department')?.toLowerCase();
    const location = searchParams.get('location')?.toLowerCase();
    const includeInactive = searchParams.get('includeInactive') === 'true';

    let openings = await getAllCareersFromDb(!includeInactive);

    if (department && department !== 'all') {
      openings = openings.filter(
        (job) =>
          job.departmentSlug.toLowerCase() === department ||
          job.department.en.toLowerCase().includes(department)
      );
    }

    if (location && location !== 'all') {
      openings = openings.filter(
        (job) =>
          job.locationSlug.toLowerCase() === location ||
          job.location.en.toLowerCase().includes(location)
      );
    }

    return NextResponse.json({
      success: true,
      count: openings.length,
      openings,
    });
  } catch (error) {
    console.error('[API /api/careers GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve career openings', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/careers
 * Publishes a new career opening to MongoDB Atlas.
 * PROTECTED: Requires 'admin' or 'hr' role.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'hr'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Only Admins and HR can publish career openings.' },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body.title?.en || !body.title?.ar) {
      return NextResponse.json(
        { error: 'Both English and Arabic job titles are required.' },
        { status: 400 }
      );
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.title.en);
    if (!slug) {
      return NextResponse.json({ error: 'Invalid or missing career slug.' }, { status: 400 });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 });
    }

    // Check if slug already exists
    const existing = await db.collection(COLLECTIONS.CAREERS).findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: `A job opening with slug "${slug}" already exists. Please choose a unique slug or edit the existing opening.` },
        { status: 409 }
      );
    }

    const newOpening = {
      id: `job-${Date.now()}`,
      slug,
      title: {
        en: body.title.en.trim(),
        ar: body.title.ar.trim(),
      },
      department: {
        en: body.department?.en?.trim() || 'Engineering & AI',
        ar: body.department?.ar?.trim() || 'الهندسة والذكاء الاصطناعي',
      },
      departmentSlug: body.departmentSlug || 'engineering',
      location: {
        en: body.location?.en?.trim() || 'Dubai HQ / Hybrid',
        ar: body.location?.ar?.trim() || 'مقر دبي / هجين',
      },
      locationSlug: body.locationSlug || 'dubai',
      type: {
        en: body.type?.en?.trim() || 'Full-time Permanent',
        ar: body.type?.ar?.trim() || 'دوام كامل دائم',
      },
      experience: {
        en: body.experience?.en?.trim() || 'Senior / Lead',
        ar: body.experience?.ar?.trim() || 'مستوى أول / قيادي',
      },
      workPolicy: {
        en: body.workPolicy?.en?.trim() || 'Hybrid — Dubai HQ',
        ar: body.workPolicy?.ar?.trim() || 'هجين — مقر دبي',
      },
      salaryRange: {
        en: body.salaryRange?.en?.trim() || 'Competitive + Equity',
        ar: body.salaryRange?.ar?.trim() || 'حزمة تنافسية + أسهم',
      },
      summary: {
        en: body.summary?.en?.trim() || '',
        ar: body.summary?.ar?.trim() || '',
      },
      mission: {
        en: body.mission?.en?.trim() || '',
        ar: body.mission?.ar?.trim() || '',
      },
      responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities : [],
      requirements: Array.isArray(body.requirements) ? body.requirements : [],
      preferredQualifications: Array.isArray(body.preferredQualifications)
        ? body.preferredQualifications
        : [],
      techStack: Array.isArray(body.techStack) ? body.techStack : [],
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      featured: Boolean(body.featured),
      isActive: body.isActive !== false,
      postedDate:
        body.postedDate?.trim() ||
        new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedBy: user.email,
    };

    await db.collection(COLLECTIONS.CAREERS).insertOne(newOpening);

    // Revalidate public routes for immediate ISR update
    try {
      revalidatePath('/en/careers');
      revalidatePath('/ar/careers');
      revalidatePath(`/en/careers/${slug}`);
      revalidatePath(`/ar/careers/${slug}`);
    } catch (e) {
      console.warn('[API /api/careers POST] Revalidation warning:', e);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Job opening successfully published to Persici recruitment portal.',
        opening: newOpening,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /api/careers POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to publish job opening', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/careers
 * Updates an existing career opening in MongoDB Atlas.
 * PROTECTED: Requires 'admin' or 'hr' role.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'hr'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Only Admins and HR can edit career openings.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const slug = body.slug;

    if (!slug) {
      return NextResponse.json({ error: 'Missing job slug to update.' }, { status: 400 });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 });
    }

    const updateDoc: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: user.email,
    };

    if (body.title) updateDoc.title = body.title;
    if (body.department) updateDoc.department = body.department;
    if (body.departmentSlug) updateDoc.departmentSlug = body.departmentSlug;
    if (body.location) updateDoc.location = body.location;
    if (body.locationSlug) updateDoc.locationSlug = body.locationSlug;
    if (body.type) updateDoc.type = body.type;
    if (body.experience) updateDoc.experience = body.experience;
    if (body.workPolicy) updateDoc.workPolicy = body.workPolicy;
    if (body.salaryRange) updateDoc.salaryRange = body.salaryRange;
    if (body.summary) updateDoc.summary = body.summary;
    if (body.mission) updateDoc.mission = body.mission;
    if (Array.isArray(body.responsibilities)) updateDoc.responsibilities = body.responsibilities;
    if (Array.isArray(body.requirements)) updateDoc.requirements = body.requirements;
    if (Array.isArray(body.preferredQualifications))
      updateDoc.preferredQualifications = body.preferredQualifications;
    if (Array.isArray(body.techStack)) updateDoc.techStack = body.techStack;
    if (Array.isArray(body.benefits)) updateDoc.benefits = body.benefits;
    if (body.featured !== undefined) updateDoc.featured = Boolean(body.featured);
    if (body.isActive !== undefined) updateDoc.isActive = Boolean(body.isActive);
    if (body.postedDate) updateDoc.postedDate = body.postedDate;

    await db.collection(COLLECTIONS.CAREERS).updateOne({ slug }, { $set: updateDoc });

    // Revalidate public routes
    try {
      revalidatePath('/en/careers');
      revalidatePath('/ar/careers');
      revalidatePath(`/en/careers/${slug}`);
      revalidatePath(`/ar/careers/${slug}`);
    } catch (e) {
      console.warn('[API /api/careers PUT] Revalidation warning:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Job opening updated successfully.',
      slug,
    });
  } catch (error) {
    console.error('[API /api/careers PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update job opening', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/careers
 * Deletes or archives a career opening in MongoDB Atlas.
 * PROTECTED: Requires 'admin' or 'hr' role.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'hr'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Only Admins and HR can delete career openings.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    let slug = searchParams.get('slug');

    if (!slug) {
      const body = await request.json().catch(() => ({}));
      slug = body.slug;
    }

    if (!slug) {
      return NextResponse.json({ error: 'Missing job slug to delete.' }, { status: 400 });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 });
    }

    await db.collection(COLLECTIONS.CAREERS).deleteOne({ slug });

    // Revalidate public routes
    try {
      revalidatePath('/en/careers');
      revalidatePath('/ar/careers');
      revalidatePath(`/en/careers/${slug}`);
      revalidatePath(`/ar/careers/${slug}`);
    } catch (e) {
      console.warn('[API /api/careers DELETE] Revalidation warning:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Job opening deleted successfully from database.',
      slug,
    });
  } catch (error) {
    console.error('[API /api/careers DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete job opening', details: String(error) },
      { status: 500 }
    );
  }
}
