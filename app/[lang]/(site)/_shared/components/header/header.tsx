'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@shared/components/logo';
import type { HeaderProps, NavLink } from '@shared/types';
import { HomeButton, sectionContainer } from '@shared';
import { siteNavLinks } from '@shared/data';
import { NavDropdownCard } from './nav-dropdown-card';

/**
 * Checks whether a single DOM element represents a visually dark background.
 * Returns { isDark, solidFound } so callers can continue walking down if transparent.
 */
interface PersiciImageElement extends HTMLImageElement {
  _persiciLum?: number;
}

function getElementLuminance(el: HTMLElement): { isDark: boolean; solidFound: boolean } {
  // 1. If it's an <img> tag, sample its pixel brightness via canvas
  if (el.tagName === 'IMG') {
    const img = el as PersiciImageElement;
    if (img._persiciLum !== undefined) {
      return { isDark: img._persiciLum < 0.45, solidFound: true };
    }
    if (img.complete && img.naturalWidth > 0) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1, 1);
          const data = ctx.getImageData(0, 0, 1, 1).data;
          if (data[3] > 30) {
            const lum = (0.2126 * data[0] + 0.7152 * data[1] + 0.0722 * data[2]) / 255;
            img._persiciLum = lum;
            return { isDark: lum < 0.45, solidFound: true };
          }
        }
      } catch {
        // In case canvas is inaccessible, photographic content is treated as dark
        return { isDark: true, solidFound: true };
      }
    }
  }


  // 2. Videos are visually dark
  if (el.tagName === 'VIDEO') {
    return { isDark: true, solidFound: true };
  }

  // 3. Inspect computed backgroundColor
  const computed = window.getComputedStyle(el);
  const bg = computed.backgroundColor;

  if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
    const rgb = bg.match(/\d+(\.\d+)?/g);
    if (rgb && rgb.length >= 3) {
      const r = parseFloat(rgb[0]);
      const g = parseFloat(rgb[1]);
      const b = parseFloat(rgb[2]);
      const alpha = rgb.length >= 4 ? parseFloat(rgb[3]) : 1;

      // Only evaluate if background opacity is at least 25% (prevents bg-black/[0.02] from matching)
      if (alpha >= 0.25) {
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return { isDark: lum < 0.45, solidFound: true };
      }
    }
  }

  // 4. Explicit solid background classes
  const classes = (el.className || '').toString().split(/\s+/);
  if (
    classes.includes('bg-persici-black') ||
    classes.includes('bg-black') ||
    classes.includes('bg-persici-crimson') ||
    classes.includes('bg-slate-900') ||
    classes.includes('bg-zinc-900') ||
    classes.includes('bg-neutral-900')
  ) {
    return { isDark: true, solidFound: true };
  }

  if (
    classes.includes('bg-white') ||
    classes.includes('bg-persici-white') ||
    classes.includes('bg-slate-50') ||
    classes.includes('bg-gray-50')
  ) {
    return { isDark: false, solidFound: true };
  }

  return { isDark: false, solidFound: false };
}

/**
 * Accurately determines if the point (x, y) in the viewport is over a visually dark element
 */
function isPointDark(x: number, y: number, headerEl: HTMLElement | null): boolean {
  if (typeof document === 'undefined') return false;

  const elements = typeof document.elementsFromPoint === 'function'
    ? document.elementsFromPoint(x, y)
    : [];

  const candidateElements = elements.filter((el) => {
    if (!el || el === document.documentElement) return false;
    if (headerEl && (headerEl === el || headerEl.contains(el))) return false;
    return true;
  }) as HTMLElement[];

  for (const el of candidateElements) {
    const result = getElementLuminance(el);
    if (result.solidFound) {
      return result.isDark;
    }
  }

  return false;
}

export function Header({ lang, dict }: HeaderProps) {
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedKeys, setMobileExpandedKeys] = useState<Record<string, boolean>>({});
  
  // Independent per-zone theme detection
  const [isLogoDark, setIsLogoDark] = useState(false);
  const [isNavDark, setIsNavDark] = useState(false);
  const [isCtaDark, setIsCtaDark] = useState(false);

  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenDropdownKey(null);
    setMobileMenuOpen(false);
  }

  const isRtl = lang === 'ar';
  
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);


  // Handle click outside navbar
  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdownKey(null);
      }
    }

    if (openDropdownKey) {
      document.addEventListener('click', handleDocumentClick);
      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }
  }, [openDropdownKey]);

  // Real-time per-element dark detection on scroll
  useEffect(() => {
    let animationFrameId: number;

    function evaluateHeaderTheme() {
      const headerEl = headerRef.current;
      if (!headerEl) return;

      // 1. Evaluate Logo element
      if (logoRef.current) {
        const r = logoRef.current.getBoundingClientRect();
        const dark = isPointDark(r.left + r.width / 2, r.top + r.height / 2, headerEl);
        setIsLogoDark(dark);
      }

      // 2. Evaluate Nav Pill element across its full width (5 sample points)
      if (navRef.current) {
        const r = navRef.current.getBoundingClientRect();
        const p1 = isPointDark(r.left + r.width * 0.15, r.top + r.height / 2, headerEl);
        const p2 = isPointDark(r.left + r.width * 0.35, r.top + r.height / 2, headerEl);
        const p3 = isPointDark(r.left + r.width * 0.50, r.top + r.height / 2, headerEl);
        const p4 = isPointDark(r.left + r.width * 0.70, r.top + r.height / 2, headerEl);
        const p5 = isPointDark(r.left + r.width * 0.85, r.top + r.height / 2, headerEl);
        
        // If any section of the pill is over a dark element, adapt pill to dark mode
        setIsNavDark(p1 || p2 || p3 || p4 || p5);
      }

      // 3. Evaluate CTA Button element
      if (ctaRef.current) {
        const r = ctaRef.current.getBoundingClientRect();
        const dark = isPointDark(r.left + r.width / 2, r.top + r.height / 2, headerEl);
        setIsCtaDark(dark);
      }
    }

    function onScroll() {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(evaluateHeaderTheme);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', evaluateHeaderTheme);
    evaluateHeaderTheme();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('load', evaluateHeaderTheme);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const navLinks = siteNavLinks.map((link) => ({
    ...link,
    href: link.href === '/' ? `/${lang}` : `/${lang}${link.href}`,
  }));

  const isActive = (href: string) => {
    if (href === `/${lang}` && pathname === `/${lang}`) return true;
    if (href !== `/${lang}` && pathname.startsWith(href)) return true;
    return false;
  };

  const activeDropdownLink: NavLink | null =
    navLinks.find((link) => link.key === openDropdownKey && link.hasDropdown) || null;

  const toggleDropdown = (key: string) => {
    setOpenDropdownKey((prev) => (prev === key ? null : key));
  };

  const toggleMobileAccordion = (key: string) => {
    setMobileExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <header ref={headerRef} className="fixed top-0 z-50 w-full transition-all duration-300" suppressHydrationWarning>
      <div
        className={`${sectionContainer} max-w-9xl flex h-25 items-center justify-between relative`}
        suppressHydrationWarning
      >
        {/* Left: Brand Logo (Independently adapts to background under Logo) */}
        <div ref={logoRef} className="flex items-center transition-all duration-300" suppressHydrationWarning>
          <Logo lang={lang} variant={isLogoDark ? 'light' : 'dark'} />
        </div>

        {/* Center: Floating Pill Navigation (Independently adapts to background under Pill) */}
        <nav
          ref={navRef}
          className={`hidden md:flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-md transition-all duration-300 ${
            isNavDark
              ? 'bg-black/75 text-white border border-white/20 shadow-xl'
              : 'bg-black/5 text-slate-800 shadow-xs'
          }`}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const isOpen = openDropdownKey === link.key;
            const label = dict.nav[link.key as keyof typeof dict.nav] || link.key;

            if (link.hasDropdown) {
              return (
                <button
                  key={link.key}
                  type="button"
                  data-nav-item="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(link.key);
                  }}
                  aria-expanded={isOpen}
                  className={`group relative inline-flex flex-col items-center px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer select-none outline-none ${
                    isNavDark
                      ? 'text-white/85 hover:text-white'
                      : 'text-slate-800 hover:text-black'
                  }`}
                >
                  <span className="relative">
                    {label}
                    {/* Publicis Sapient signature expanding red underline */}
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] overflow-hidden">
                      <span
                        className={`absolute inset-0 bg-persici-crimson transition-transform duration-300 ease-in-out ${
                          isOpen || active
                            ? 'scale-x-100'
                            : isRtl
                              ? 'origin-right scale-x-0 group-hover:scale-x-100'
                              : 'origin-left scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </span>
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={link.key}
                href={link.href}
                className={`group relative inline-flex flex-col items-center px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer select-none outline-none ${
                  isNavDark
                    ? 'text-white/85 hover:text-white'
                    : 'text-slate-800 hover:text-black'
                }`}
              >
                <span className="relative">
                  {label}
                  {/* Publicis Sapient signature expanding red underline */}
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] overflow-hidden">
                    <span
                      className={`absolute inset-0 bg-persici-crimson transition-transform duration-300 ease-in-out ${
                        active
                          ? 'scale-x-100'
                          : isRtl
                            ? 'origin-right scale-x-0 group-hover:scale-x-100'
                            : 'origin-left scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Book a Call CTA & Mobile Toggle (Independently adapts to background under Button) */}
        <div ref={ctaRef} className="flex items-center gap-3">
          <HomeButton
            href={`/${lang}/contact`}
            title={dict.nav.bookCall}
            className={`hidden sm:inline-flex transition-all duration-300 ${
              isCtaDark
                ? '!bg-white !text-persici-black hover:!bg-white/90 shadow-md'
                : ''
            }`}
            iconClassName={isCtaDark ? '!bg-persici-black !text-white' : ''}
            currentLang={lang}
            isLangEffectIcon={true}
          />

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 md:hidden cursor-pointer ${
              isCtaDark || isNavDark
                ? 'border border-white/20 bg-white/15 text-white hover:bg-white/25'
                : 'border border-black/5 bg-white/80 text-foreground hover:bg-white'
            }`}
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

        {/* Floating Dropdown Mega-Menu Card (Desktop) */}
        <NavDropdownCard
          activeLink={activeDropdownLink}
          lang={lang}
          dict={dict}
          onClose={() => setOpenDropdownKey(null)}
        />
      </div>

      {/* Mobile Drawer (Accordion style) */}
      {mobileMenuOpen && (
        <div className="border-b border-black/5 bg-white/95 px-4 py-5 backdrop-blur-lg md:hidden max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const isExpanded = !!mobileExpandedKeys[link.key];

              if (link.hasDropdown && link.subItems) {
                return (
                  <div key={link.key} className="rounded-lg border border-black/5 bg-black/[0.01]">
                    <button
                      type="button"
                      onClick={() => toggleMobileAccordion(link.key)}
                      className="flex w-full items-center justify-between px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-black/5 rounded-lg"
                    >
                      <span>{dict.nav[link.key as keyof typeof dict.nav] || link.key}</span>
                      <svg
                        className={`h-4 w-4 text-foreground/50 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="space-y-1 px-3.5 pb-3 pt-1 border-t border-black/5">
                        {link.subItems.map((sub) => {
                          const subLabel = dict.nav[sub.key as keyof typeof dict.nav] || sub.key;
                          const subHref = `/${lang}${sub.href}`;
                          return (
                            <Link
                              key={sub.key}
                              href={subHref}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium text-foreground/75 hover:bg-black/5 hover:text-black"
                            >
                              <span>{subLabel}</span>
                              <span className="text-foreground/40">{isRtl ? '←' : '→'}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3.5 py-2.5 text-sm font-medium ${
                    active
                      ? 'bg-persici-crimson text-white'
                      : 'text-foreground hover:bg-black/5'
                  }`}
                >
                  {dict.nav[link.key as keyof typeof dict.nav] || link.key}
                </Link>
              );
            })}

            <div className="pt-3">
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
