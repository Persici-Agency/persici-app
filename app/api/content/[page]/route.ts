import { NextRequest, NextResponse } from 'next/server';
import { getPageContent, updatePageContent } from '@shared/services/db.service';
import {
  homePageContent,
  servicesPageContent,
  workPageContent,
  contactPageContent,
} from '@shared/data';

export const runtime = 'nodejs';

const FALLBACK_PAGES: Record<string, object> = {
  home: homePageContent,
  services: servicesPageContent,
  work: workPageContent,
  contact: contactPageContent,
};

/**
 * GET /api/content/[page]
 * Retrieves the dynamic CMS sections for the requested page.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;
    const fallback = FALLBACK_PAGES[page];

    if (!fallback) {
      return NextResponse.json(
        { error: `Page '${page}' not found in registered content pages.` },
        { status: 404 }
      );
    }

    const content = await getPageContent(page, fallback);
    return NextResponse.json({
      success: true,
      page,
      content,
    });
  } catch (error) {
    console.error('[API /api/content/[page] GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve page content', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/content/[page]
 * Updates page sections from the dashboard.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid payload. JSON body is required.' },
        { status: 400 }
      );
    }

    const updated = await updatePageContent(page, body);

    return NextResponse.json({
      success: updated,
      message: updated
        ? `Page '${page}' content updated successfully.`
        : `Database not connected; update simulated.`,
      page,
    });
  } catch (error) {
    console.error('[API /api/content/[page] PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update page content', details: String(error) },
      { status: 500 }
    );
  }
}
