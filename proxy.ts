import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { jwtVerify } from 'jose';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'persici_session';
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass static assets and videos
  if (
    pathname.startsWith('/Videos') ||
    pathname.startsWith('/videos') ||
    pathname.startsWith('/images') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|mp4|webm|ogg|css|js)$/i)
  ) {
    return;
  }

  // Extract locale from pathname if present
  const segments = pathname.split('/').filter(Boolean);
  const pathLocale = segments[0] && locales.includes(segments[0]) ? segments[0] : null;
  const pathWithoutLocale = pathLocale ? '/' + segments.slice(1).join('/') : pathname;

  // 2. Dashboard Firewall & Protection
  const isDashboardRoute = pathWithoutLocale.startsWith('/dashboard');
  const isLoginPage = pathWithoutLocale === '/dashboard/login';

  if (isDashboardRoute) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const sessionUser = sessionToken ? await verifyToken(sessionToken) : null;
    const currentLocale = pathLocale || getLocale(request);

    if (isLoginPage) {
      // If already logged in, redirect straight to dashboard overview
      if (sessionUser) {
        const url = request.nextUrl.clone();
        url.pathname = `/${currentLocale}/dashboard`;
        return NextResponse.redirect(url);
      }
    } else {
      // Any other dashboard path requires valid authentication
      if (!sessionUser) {
        const url = request.nextUrl.clone();
        url.pathname = `/${currentLocale}/dashboard/login`;
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  // 3. Bypass API routes from locale redirection
  if (pathname.startsWith('/api')) {
    return;
  }

  // 4. Internationalization locale redirect
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
