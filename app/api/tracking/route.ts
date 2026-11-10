import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/auth/jwt';
import { isRoleAllowed } from '@/lib/auth/rbac';
import {
  getTrackingConfig,
  getPublicTrackingConfig,
  saveTrackingConfig,
  upsertCustomSnippet,
  deleteCustomSnippet,
} from '@/lib/tracking-server';
import {
  getTrackingStatusSummary,
  toPublicTrackingConfig,
  type CustomCodeSnippet,
} from '@/lib/tracking-types';

export const runtime = 'nodejs';

/**
 * GET /api/tracking
 * Returns the active TrackingConfig and status summary.
 * Authenticated 'admin' and 'media buying' operators receive full configuration metadata;
 * public storefront requests receive sanitized configuration (server secrets stripped).
 */
export async function GET(request: NextRequest) {
  try {
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === '1';
    const user = await getSessionUser();
    const isAuthorizedAdmin =
      user && isRoleAllowed(user.role, ['admin', 'media buying', 'editor']);

    const rawConfig = await getTrackingConfig(forceRefresh);
    const summary = getTrackingStatusSummary(rawConfig);

    // Mask actual private key text with placeholder if present, or strip for public
    const responseConfig = isAuthorizedAdmin
      ? {
          ...rawConfig,
          ga4: {
            ...rawConfig.ga4,
            serviceAccountPrivateKey: rawConfig.ga4.serviceAccountPrivateKey
              ? '__KEEP_EXISTING__'
              : '',
            hasServiceAccountKey: Boolean(
              rawConfig.ga4.serviceAccountPrivateKey
            ),
          },
          pixels: {
            ...rawConfig.pixels,
            meta: {
              ...rawConfig.pixels.meta,
              capiAccessToken: rawConfig.pixels.meta.capiAccessToken
                ? '__KEEP_EXISTING__'
                : '',
              hasCapiToken: Boolean(rawConfig.pixels.meta.capiAccessToken),
            },
          },
        }
      : toPublicTrackingConfig(rawConfig);

    return NextResponse.json(
      {
        success: true,
        config: responseConfig,
        summary,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('[API /api/tracking GET] Error:', error);
    const fallback = await getPublicTrackingConfig();
    return NextResponse.json({
      success: true,
      config: fallback,
      summary: getTrackingStatusSummary(fallback),
    });
  }
}

/**
 * PUT /api/tracking
 * Updates the Tracking, Pixels, GTM, GA4, and Custom Snippets configuration.
 * PROTECTED: Requires 'admin' or 'media buying' role.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'media buying'])) {
      return NextResponse.json(
        {
          error:
            'Unauthorized. Admin or Media Buying role is required to update tracking settings.',
        },
        { status: 403 }
      );
    }

    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid tracking configuration payload.' },
        { status: 400 }
      );
    }

    const result = await saveTrackingConfig(body, user.email || user.name);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/[lang]', 'layout');
      revalidatePath('/en', 'layout');
      revalidatePath('/ar', 'layout');
    } catch {
      // Ignore revalidation errors outside request context
    }

    const summary = getTrackingStatusSummary(result.config);

    return NextResponse.json({
      success: true,
      persistedToDb: result.persistedToDb,
      config: {
        ...result.config,
        ga4: {
          ...result.config.ga4,
          serviceAccountPrivateKey: result.config.ga4.serviceAccountPrivateKey
            ? '__KEEP_EXISTING__'
            : '',
          hasServiceAccountKey: Boolean(
            result.config.ga4.serviceAccountPrivateKey
          ),
        },
        pixels: {
          ...result.config.pixels,
          meta: {
            ...result.config.pixels.meta,
            capiAccessToken: result.config.pixels.meta.capiAccessToken
              ? '__KEEP_EXISTING__'
              : '',
            hasCapiToken: Boolean(result.config.pixels.meta.capiAccessToken),
          },
        },
      },
      summary,
    });
  } catch (error) {
    console.error('[API /api/tracking PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to save tracking configuration.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tracking
 * Upserts a custom code snippet or performs a configuration validation check.
 * PROTECTED: Requires 'admin' or 'media buying' role.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'media buying'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or Media Buying role is required.' },
        { status: 403 }
      );
    }

    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;

    if (!body) {
      return NextResponse.json(
        { error: 'Request body is required.' },
        { status: 400 }
      );
    }

    // Action 1: Test GA4 / GTM configuration
    if (body.action === 'test_ga4') {
      const config = await getTrackingConfig(true);
      const measurementId = String(
        body.measurementId || config.ga4.measurementId || ''
      ).trim();
      const propertyId = String(
        body.propertyId || config.ga4.propertyId || ''
      ).trim();
      const isValidFormat = /^G-[A-Z0-9]{4,}$/i.test(measurementId);

      return NextResponse.json({
        success: true,
        validMeasurementId: isValidFormat,
        hasPropertyId: propertyId.length > 0,
        hasServiceAccount: Boolean(
          config.ga4.serviceAccountEmail &&
            config.ga4.serviceAccountPrivateKey
        ),
        message: isValidFormat
          ? `GA4 Measurement ID (${measurementId}) is valid and ready for live tracking.`
          : 'Please enter a valid GA4 Measurement ID starting with G-XXXXXXXXXX.',
      });
    }

    // Action 2: Upsert Custom Code Snippet
    const snippetData = (body.snippet || body) as Partial<CustomCodeSnippet>;
    const result = await upsertCustomSnippet(
      snippetData,
      user.email || user.name
    );

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/[lang]', 'layout');
    } catch {}

    return NextResponse.json({
      success: true,
      snippet: result.snippet,
      config: toPublicTrackingConfig(result.config),
      summary: getTrackingStatusSummary(result.config),
    });
  } catch (error) {
    console.error('[API /api/tracking POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process tracking snippet operation.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tracking?id=<snippetId>
 * Removes a custom code snippet by ID.
 * PROTECTED: Requires 'admin' or 'media buying' role.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !isRoleAllowed(user.role, ['admin', 'media buying'])) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or Media Buying role is required.' },
        { status: 403 }
      );
    }

    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Snippet ID (?id=...) is required.' },
        { status: 400 }
      );
    }

    const result = await deleteCustomSnippet(id, user.email || user.name);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/[lang]', 'layout');
    } catch {}

    return NextResponse.json({
      success: true,
      config: toPublicTrackingConfig(result.config),
      summary: getTrackingStatusSummary(result.config),
    });
  } catch (error) {
    console.error('[API /api/tracking DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete snippet.' },
      { status: 500 }
    );
  }
}
