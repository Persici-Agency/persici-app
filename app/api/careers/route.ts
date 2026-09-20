import { NextRequest, NextResponse } from 'next/server';
import { getAllCareers } from '@/app/[lang]/(site)/careers/_careers/data/careers.data';

export const runtime = 'nodejs';

/**
 * GET /api/careers
 * Returns active career openings with optional department and location filters.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department')?.toLowerCase();
    const location = searchParams.get('location')?.toLowerCase();

    let openings = getAllCareers();

    if (department && department !== 'all') {
      openings = openings.filter(
        (job) => job.departmentSlug.toLowerCase() === department || job.department.en.toLowerCase().includes(department)
      );
    }

    if (location && location !== 'all') {
      openings = openings.filter(
        (job) => job.locationSlug.toLowerCase() === location || job.location.en.toLowerCase().includes(location)
      );
    }

    return NextResponse.json({
      success: true,
      count: openings.length,
      openings,
    });
  } catch (error) {
    console.error('[API /api/careers] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve career openings', details: String(error) },
      { status: 500 }
    );
  }
}
