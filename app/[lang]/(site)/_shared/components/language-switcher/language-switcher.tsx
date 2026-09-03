'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'عربي' },
] as const;

export type LanguageSwitcherProps = {
  currentLang: string;
  variant?: 'navbar' | 'footer' | 'mobile';
  className?: string;
};

export function LanguageSwitcher({
  currentLang,
  variant = 'navbar',
  className = '',
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  function getLocalizedPath(targetLocale: string) {
    const segments = pathname.split('/');
    segments[1] = targetLocale;
    return segments.join('/');
  }

  if (variant === 'footer') {
    return (
      <div
        className={`inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] p-1 backdrop-blur-xs text-xs transition-colors hover:border-white/25 ${className}`}
        aria-label="Language switcher"
      >
        <div className="flex items-center gap-1 px-1.5 text-white/60">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M12 21a9 9 0 100-18 9 9 0 000 18z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M3.6 9h16.8M3.6 15h16.8"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18"
            />
          </svg>
        </div>
        <div className="flex items-center gap-0.5">
          {locales.map((locale) => {
            const isActive = currentLang === locale.code;
            return (
              <Link
                key={locale.code}
                href={getLocalizedPath(locale.code)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-persici-crimson text-white shadow-xs'
                    : 'text-white/60 hover:text-white'
                }`}
                aria-label={`Switch to ${locale.code === 'en' ? 'English' : 'Arabic'}`}
              >
                {locale.label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
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
