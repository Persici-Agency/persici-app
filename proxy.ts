import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass API routes (MongoDB/backend integration) and static assets
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/Videos') ||
    pathname.startsWith('/videos') ||
    pathname.startsWith('/images') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|mp4|webm|ogg|css|js)$/i)
  ) {
    return;
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect to the default locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|favicon-16x16.png|favicon-32x32.png|persici-.*|sitemap.xml|robots.txt|images/.*|Videos/.*|videos/.*|.*\\.(?:mp4|webm|ogg)).*)',
  ],
};

