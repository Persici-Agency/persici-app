import { NextRequest, NextResponse } from 'next/server';
import {
  getPageContent,
  updatePageContent,
  normalizeAboutPageData,
  normalizeContactPageData,
  normalizeClientStoriesPageData,
  normalizeCareersPageData,
  normalizeInsightsPageData,
  getInsightsPageData,
  getSolutionsPageData,
  getSolutionFeaturePageData,
  normalizeSolutionsHubPageData,
  normalizeSolutionFeaturePageData,
  isSolutionPageSlug,
} from '@shared/services/db.service';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { revalidatePageContent } from '@/lib/revalidate';
import {
  homePageContent,
  servicesPageContent,
  workPageContent,
  solutionsPageContent,
  industriesPageContent,
  howWeDoItPageContent,
  defaultSharedContactData,
} from '@shared/data';
import { aboutPageData } from '@/app/[lang]/(site)/about/_about/data/about.data';
import { contactPageData } from '@/app/[lang]/(site)/contact/_contact/data/contact.data';
import { clientStoriesHubPageData } from '@/app/[lang]/(site)/client-stories/_client-stories/data/client-stories.data';
import { careersHubData } from '@/app/[lang]/(site)/careers/_careers/data/careers.data';
import { insightsHubPageData } from '@/app/[lang]/(site)/insights/_insights/data/insights.data';

export const runtime = 'nodejs';

const FALLBACK_PAGES: Record<string, object> = {
  home: homePageContent,
  services: servicesPageContent,
  work: workPageContent,
  'client-stories': clientStoriesHubPageData,
  contact: contactPageData,
  solutions: solutionsPageContent,
  industries: industriesPageContent,
  'how-we-do-it': howWeDoItPageContent,
  about: aboutPageData,
  careers: careersHubData,
  insights: insightsHubPageData,
  'shared-contact': defaultSharedContactData,
  'contact-section': defaultSharedContactData,
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

    if (page === 'insights') {
      const content = await getInsightsPageData();
      return NextResponse.json({
        success: true,
        page,
        content,
      });
    }

    if (page === 'solutions') {
      const content = await getSolutionsPageData();
      return NextResponse.json({
        success: true,
        page,
        content,
      });
    }

    if (isSolutionPageSlug(page)) {
      const content = await getSolutionFeaturePageData(page);
      return NextResponse.json({
        success: true,
        page,
        content,
      });
    }

    const fallback = FALLBACK_PAGES[page] || {};

    const rawContent = await getPageContent(page, fallback);
    const content =
      page === 'about'
        ? normalizeAboutPageData(rawContent)
        : page === 'contact'
          ? normalizeContactPageData(rawContent)
          : page === 'client-stories'
            ? normalizeClientStoriesPageData(rawContent)
            : page === 'careers'
              ? normalizeCareersPageData(rawContent)
              : page === 'insights'
                ? normalizeInsightsPageData(rawContent)
                : rawContent;
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
 * PROTECTED: Requires 'admin' or 'editor' role (or 'hr' for careers).
 * Triggers instant on-demand ISR cache revalidation.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;
    const user = await getSessionUser();
    const allowedRoles = page === 'careers' ? (['admin', 'editor', 'hr'] as const) : (['admin', 'editor'] as const);
    if (!user || !isRoleAllowed(user.role, [...allowedRoles])) {
      return NextResponse.json(
        { error: 'Unauthorized. Only Admins and Editors can update page content.' },
        { status: 403 }
      );
    }
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid payload. JSON body is required.' },
        { status: 400 }
      );
    }

    const rawPayload =
      body.content && typeof body.content === 'object' && !body.hero
        ? body.content
        : body;

    const payload =
      page === 'solutions'
        ? normalizeSolutionsHubPageData(rawPayload)
        : isSolutionPageSlug(page)
          ? normalizeSolutionFeaturePageData(page, rawPayload)
          : rawPayload;

    const updated = await updatePageContent(page, payload);

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
