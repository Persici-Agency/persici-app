import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { jwtVerify, SignJWT } from 'jose';
import type { MaintenanceConfig } from '@/lib/maintenance-types';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

interface GlobalProxyMaintenanceState {
  __persiciMaintenanceCache?: {
    config: MaintenanceConfig;
    fetchedAt: number;
  };
}

declare const globalThis: GlobalProxyMaintenanceState & typeof global;

const PROXY_MAINT_TTL_MS = 2500;

async function getActiveMaintenanceConfig(
  request: NextRequest
): Promise<MaintenanceConfig | null> {
  const now = Date.now();
  const cached = globalThis.__persiciMaintenanceCache;
  if (cached && now - cached.fetchedAt < PROXY_MAINT_TTL_MS) {
    return cached.config;
  }

  try {
    const apiUrl = new URL('/api/maintenance', request.nextUrl.origin);
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.config) {
        globalThis.__persiciMaintenanceCache = {
          config: data.config as MaintenanceConfig,
          fetchedAt: Date.now(),
        };
        return data.config as MaintenanceConfig;
      }
    }
  } catch {
    // Ignore transient edge fetch errors and fall back to last cached state if available
  }

  return cached?.config || null;
}

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'persici_session';
const GATE_COOKIE_NAME = process.env.GATE_COOKIE_NAME || 'persici_dashboard_gate';
const DASHBOARD_PASSKEY = process.env.DASHBOARD_PASSKEY || 'persici2026';
const JWT_SECRET = process.env.JWT_SECRET || 'persici_jwt_secret_super_secure_key_2026_growth_os';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  return match(languages, locales, defaultLocale);
}

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch {
    return null;
  }
}

async function signGateToken(): Promise<string> {
  return new SignJWT({ gate: 'granted' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(SECRET_KEY);
}

async function verifyGateToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.gate === 'granted';
  } catch {
    return false;
  }
}



export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass static assets and videos
  if (
    pathname.startsWith('/Videos') ||
    pathname.startsWith('/videos') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/icons') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|mp4|webm|ogg|css|js|woff|woff2|ttf)$/i)
  ) {
    return;
  }

  // 2. Protect internal dashboard API routes from unauthorized external scanners
  if (pathname.startsWith('/api/dashboard') || pathname.startsWith('/api/users')) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const sessionUser = sessionToken ? await verifyToken(sessionToken) : null;
    if (!sessionUser) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // Extract locale from pathname if present
  const segments = pathname.split('/').filter(Boolean);
  const pathLocale = segments[0] && locales.includes(segments[0]) ? segments[0] : null;
  const pathWithoutLocale = pathLocale ? '/' + segments.slice(1).join('/') : pathname;

  // 3. Dashboard Stealth Fortress & Passkey Gatekeeper
  const isDashboardRoute = pathWithoutLocale === '/dashboard' || pathWithoutLocale.startsWith('/dashboard/');
  const isLoginPage = pathWithoutLocale === '/dashboard/login';

  if (isDashboardRoute) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const sessionUser = sessionToken ? await verifyToken(sessionToken) : null;

    const gateCookie = request.cookies.get(GATE_COOKIE_NAME)?.value;
    const isGateCookieValid = gateCookie ? await verifyGateToken(gateCookie) : false;

    // Check for passkey parameter in query string (?passkey=... or ?key=...)
    const passkeyParam = (
      request.nextUrl.searchParams.get('passkey') ||
      request.nextUrl.searchParams.get('key')
    )?.trim();
    const isPasskeyParamValid = Boolean(
      passkeyParam && passkeyParam === DASHBOARD_PASSKEY.trim()
    );
    const effectivePasskey = passkeyParam || DASHBOARD_PASSKEY.trim();

    const currentLocale = pathLocale || getLocale(request);
    const isProd = process.env.NODE_ENV === 'production';

    // Helper to attach ephemeral session-only cookie (no maxAge -> destroyed on tab/browser close)
    const attachSessionGateCookie = (res: NextResponse, token: string) => {
      res.cookies.set({
        name: GATE_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
      });
    };

    // =========================================================================
    // CASE 1: Passkey provided in URL
    // =========================================================================
    if (isPasskeyParamValid) {
      const gateToken = await signGateToken();

      // SCENARIO 1A: User is ALREADY authenticated in this browser
      if (sessionUser) {
        // If navigating to login page while already logged in, redirect to dashboard overview
        if (isLoginPage) {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = `/${currentLocale}/dashboard`;
          redirectUrl.searchParams.set('passkey', effectivePasskey);
          const response = NextResponse.redirect(redirectUrl);
          attachSessionGateCookie(response, gateToken);
          return response;
        }

        // If URL doesn't have locale prefix (e.g. /dashboard?passkey=...), redirect to localized path
        if (!pathLocale) {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = `/${currentLocale}${pathWithoutLocale}`;
          redirectUrl.searchParams.set('passkey', effectivePasskey);
          const response = NextResponse.redirect(redirectUrl);
          attachSessionGateCookie(response, gateToken);
          return response;
        }

        // User is authenticated on localized dashboard path with passkey — grant access!
        const response = NextResponse.next();
        attachSessionGateCookie(response, gateToken);
        return response;
      }

      // SCENARIO 1B: User is a GUEST (not logged in yet in this browser)
      // Redirect unauthenticated visitor to the login page, retaining the passkey
      if (!isLoginPage) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = `/${currentLocale}/dashboard/login`;
        loginUrl.searchParams.set('passkey', effectivePasskey);
        if (pathWithoutLocale !== '/dashboard') {
          loginUrl.searchParams.set('from', `/${currentLocale}${pathWithoutLocale}`);
        }
        const response = NextResponse.redirect(loginUrl);
        attachSessionGateCookie(response, gateToken);
        return response;
      }

      // If already on /dashboard/login without locale, redirect to localized /dashboard/login
      if (!pathLocale) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = `/${currentLocale}/dashboard/login`;
        loginUrl.searchParams.set('passkey', effectivePasskey);
        const response = NextResponse.redirect(loginUrl);
        attachSessionGateCookie(response, gateToken);
        return response;
      }

      // Guest on localized login page with valid passkey — allow access to login form!
      const response = NextResponse.next();
      attachSessionGateCookie(response, gateToken);
      return response;
    }

    // =========================================================================
    // CASE 2: No valid passkey in the query parameter!
    // =========================================================================
    // Check if this is an internal Next.js client transition/data prefetch in an active session
    const isInternalTransition = Boolean(
      (request.headers.get('rsc') === '1' || request.headers.get('next-router-prefetch')) &&
      isGateCookieValid &&
      sessionUser
    );

    if (isInternalTransition) {
      return NextResponse.next();
    }

    // External or direct visit without ?passkey=... must be completely hidden!
    // Rewrite to /${currentLocale}/404 with status 404
    const notFoundUrl = request.nextUrl.clone();
    notFoundUrl.pathname = `/${currentLocale}/404`;
    return NextResponse.rewrite(notFoundUrl, { status: 404 });
  }

  // 4. Bypass API routes from locale redirection
  if (pathname.startsWith('/api')) {
    return;
  }

  // 4.5. Site Maintenance Mode & Global Domain Redirect Interceptor
  const maintConfig = await getActiveMaintenanceConfig(request);
  if (maintConfig && maintConfig.enabled) {
    const currentLocale = pathLocale || getLocale(request);

    // MODE B: Direct URL / Domain Redirect
    if (maintConfig.mode === 'redirect' && maintConfig.redirectUrl) {
      try {
        const targetBase = new URL(maintConfig.redirectUrl);
        let destinationUrl = targetBase;

        if (maintConfig.preservePath) {
          const basePath = targetBase.pathname.replace(/\/$/, '');
          const incomingPath = request.nextUrl.pathname.startsWith('/')
            ? request.nextUrl.pathname
            : `/${request.nextUrl.pathname}`;
          destinationUrl = new URL(
            `${basePath}${incomingPath}${request.nextUrl.search}`,
            targetBase.origin
          );
        }

        // Guard against self-redirect loop if target points to the exact same origin + path
        const isSelfRedirect =
          destinationUrl.origin === request.nextUrl.origin &&
          destinationUrl.pathname === request.nextUrl.pathname;

        if (!isSelfRedirect) {
          const statusCode = maintConfig.redirectStatusCode === 308 ? 308 : 307;
          return NextResponse.redirect(destinationUrl, { status: statusCode });
        }
      } catch {
        // If redirect URL is malformed, fall back gracefully to the Maintenance Page
      }
    }

    // MODE A: Default Maintenance Mode Page (renders on any route across the site)
    if (pathname === `/${currentLocale}/maintenance`) {
      return NextResponse.next();
    }

    const maintUrl = request.nextUrl.clone();
    maintUrl.pathname = `/${currentLocale}/maintenance`;
    return NextResponse.rewrite(maintUrl);
  }

  // 5. Internationalization locale redirect
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect to localized path
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|favicon-16x16.png|favicon-32x32.png|persici-.*|sitemap.xml|robots.txt|images/.*|Videos/.*|videos/.*|.*\\.(?:mp4|webm|ogg)).*)',
  ],
};
