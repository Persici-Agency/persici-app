'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../logo';
import { LanguageSwitcher } from '../language-switcher';
import type { Dictionary } from '../../../../dictionaries';

export type HeaderProps = {
  lang: string;
  dict: Dictionary;
};

export function Header({ lang, dict }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { key: 'home', href: `/${lang}` },
    { key: 'services', href: `/${lang}/services` },
    { key: 'work', href: `/${lang}/work` },
    { key: 'about', href: `/${lang}/about` },
    { key: 'insights', href: `/${lang}/insights` },
    { key: 'contact', href: `/${lang}/contact` },
  ] as const;

  const isActive = (href: string) => {
    if (href === `/${lang}` && pathname === `/${lang}`) return true;
    if (href !== `/${lang}` && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Logo lang={lang} variant="dark" />
        </div>

        {/* Center: Floating Pill Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 rounded-full border border-black/5 bg-white/80 px-4 py-1.5 shadow-xs backdrop-blur-md"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.key}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? 'bg-persici-black text-white'
                    : 'text-persici-black/75 hover:text-persici-black hover:bg-black/5'
                }`}
              >
                {dict.nav[link.key as keyof typeof dict.nav]}
              </Link>
            );
          })}
        </nav>

        {/* Right: Language Switcher & Book a Call CTA */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher currentLang={lang} />

          <Link
            href={`/${lang}/contact`}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-persici-black px-4 py-2 text-xs font-medium text-white shadow-xs transition-all hover:bg-persici-black-80 hover:shadow-md active:scale-98"
          >
            <span>{dict.nav.bookCall}</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
              →
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/80 text-foreground md:hidden"
            aria-label={dict.nav.menu || 'Toggle Menu'}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-black/5 bg-white/95 px-4 py-5 backdrop-blur-lg md:hidden">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-persici-crimson text-white'
                    : 'text-foreground hover:bg-black/5'
                }`}
              >
                {dict.nav[link.key as keyof typeof dict.nav]}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href={`/${lang}/contact`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-persici-black py-2.5 text-sm font-medium text-white shadow-xs"
              >
                <span>{dict.nav.bookCall}</span>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
                  →
                </span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
