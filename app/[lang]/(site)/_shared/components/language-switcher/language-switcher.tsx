'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'عربي' },
] as const;

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();

  function getLocalizedPath(targetLocale: string) {
    const segments = pathname.split('/');
    segments[1] = targetLocale;
    return segments.join('/');
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((locale) => (
        <Link
          key={locale.code}
          href={getLocalizedPath(locale.code)}
          className={`rounded-md px-2 py-1 text-sm font-medium transition-colors ${
            currentLang === locale.code
              ? 'bg-persici-crimson text-white'
              : 'text-foreground hover:bg-persici-crimson/10'
          }`}
          aria-label={`Switch to ${locale.code === 'en' ? 'English' : 'Arabic'}`}
        >
          {locale.label}
        </Link>
      ))}
    </div>
  );
}
