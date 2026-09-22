import { NextRequest, NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import { revalidatePageContent } from '@/lib/revalidate';
import { siteNavLinks } from '@shared/data';

export const runtime = 'nodejs';

/**
 * GET /api/navigation
 * Returns Header and Footer configurations from MongoDB or default fallbacks.
 */
export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({
        success: true,
        header: { links: siteNavLinks, ctaButton: { text: { en: 'Book a Call', ar: 'احجز مكالمة' }, href: '/contact', enabled: true } },
        footer: { hubs: [], socialLinks: [] },
      });
    }

    const [headerDoc, footerDoc] = await Promise.all([
      db.collection(COLLECTIONS.NAVIGATION).findOne({ type: 'header' }),
      db.collection(COLLECTIONS.NAVIGATION).findOne({ type: 'footer' }),
    ]);

    return NextResponse.json({
      success: true,
      header: headerDoc || { links: siteNavLinks, ctaButton: { text: { en: 'Book a Call', ar: 'احجز مكالمة' }, href: '/contact', enabled: true } },
      footer: footerDoc || { hubs: [], socialLinks: [] },
    });
  } catch (error) {
    console.error('[API /api/navigation GET] Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve navigation configuration' }, { status: 500 });
  }
}

/**
 * PUT /api/navigation
 * Updates Header or Footer navigation menus.
 * PROTECTED: Requires 'admin' or 'editor' role.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'editor'])) {
      return NextResponse.json({ error: 'Unauthorized. Admins or Editors required.' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.type || !['header', 'footer'].includes(body.type)) {
      return NextResponse.json({ error: 'Invalid navigation payload. Type must be header or footer.' }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

    const { type, ...data } = body;
    await db.collection(COLLECTIONS.NAVIGATION).updateOne(
      { type },
      {
        $set: {
          ...data,
          type,
          updatedBy: user.email,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Revalidate all pages to refresh navigation layout
    revalidatePageContent();

    return NextResponse.json({
      success: true,
      message: `${type === 'header' ? 'Header' : 'Footer'} navigation updated successfully.`,
    });
  } catch (error) {
    console.error('[API /api/navigation PUT] Error:', error);
    return NextResponse.json({ error: 'Failed to update navigation' }, { status: 500 });
  }
}
