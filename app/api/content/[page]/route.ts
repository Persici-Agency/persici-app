import { NextRequest, NextResponse } from 'next/server';
import { getPageContent, updatePageContent } from '@shared/services/db.service';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { revalidatePageContent } from '@/lib/revalidate';
import {
  homePageContent,
  servicesPageContent,
  workPageContent,
  contactPageContent,
  solutionsPageContent,
  industriesPageContent,
  howWeDoItPageContent,
} from '@shared/data';
import { aboutPageData } from '@/app/[lang]/(site)/about/_about/data/about.data';
import { contactPageData } from '@/app/[lang]/(site)/contact/_contact/data/contact.data';

export const runtime = 'nodejs';

const FALLBACK_PAGES: Record<string, object> = {
  home: homePageContent,
  services: servicesPageContent,
  work: workPageContent,
  contact: contactPageData,
  solutions: solutionsPageContent,
  industries: industriesPageContent,
  'how-we-do-it': howWeDoItPageContent,
  about: aboutPageData,
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
    const fallback = FALLBACK_PAGES[page] || {};

    const content = await getPageContent(page, fallback);
    return NextResponse.json({
      success: true,
      page,
      content,
    });
  } catch (error) {
    console.error('[API /api/content/[page] GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve page content' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/content/[page]
 * Updates page sections from the dashboard.
 * PROTECTED: Requires 'admin' or 'editor' role.
 * Triggers instant on-demand ISR cache revalidation.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Only Admins and Editors can update page content.' },
        { status: 403 }
      );
    }

    const { page } = await params;
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid payload. JSON body is required.' },
        { status: 400 }
      );
    }

    const updated = await updatePageContent(page, body);

    // Trigger instant cache revalidation across EN and AR routes
    if (updated) {
      revalidatePageContent(page);
    }

    return NextResponse.json({
      success: updated,
      message: updated
        ? `Page '${page}' updated and published successfully.`
        : `Database update failed.`,
      page,
      revalidated: updated,
    });
  } catch (error) {
    console.error('[API /api/content/[page] PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update page content' },
      { status: 500 }
    );
  }
}
