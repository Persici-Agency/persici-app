'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@shared/components/logo';
import { LanguageSwitcher } from '@shared/components/language-switcher';
import type { HeaderProps } from '@shared/types';
import { HomeButton, sectionContainer } from "@shared";
import { siteNavLinks } from '@shared/data';

export function Header({ lang, dict }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = siteNavLinks.map((link) => ({
    ...link,
    href: link.href === '/' ? `/${lang}` : `/${lang}${link.href}`,
  }));

  const isActive = (href: string) => {
    if (href === `/${lang}` && pathname === `/${lang}`) return true;
    if (href !== `/${lang}` && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 z-50 w-full transition-all duration-200">
      <div className={`${sectionContainer} max-w-9xl flex h-25 items-center justify-between`}>
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Logo lang={lang} variant="dark" />
        </div>

        {/* Center: Floating Pill Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 rounded-full bg-black/5 px-3 py-1.5 shadow-xs backdrop-blur-md"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.key}
                href={link.href}
                className={`rounded-full px-3.5 py-2 text-sm font-[500] transition-all ${
                  active
                    ? 'bg-persici-white text-black'
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

          <HomeButton
            href={`/${lang}/contact`}
            title={dict.nav.bookCall}
            className="hidden sm:inline-flex"
            currentLang={lang}
            isLangEffectIcon={true}
          />

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
              <HomeButton
                href={`/${lang}/contact`}
                onClick={() => setMobileMenuOpen(false)}
                title={dict.nav.bookCall}
                className="w-full justify-center"
                currentLang={lang}
                isLangEffectIcon={true}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
