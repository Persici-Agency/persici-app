'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Logo } from '@shared/components/logo';
import { LanguageSwitcher } from '@shared/components/language-switcher';
import type { HeaderProps, NavLink } from '@shared/types';
import { HomeButton, sectionContainer } from '@shared';
import { siteNavLinks } from '@shared/data';
import { NavDropdownCard, solutionIconMap, iconMap } from './nav-dropdown-card';

/**
 * Checks whether a single DOM element represents a visually dark background.
 * Returns { isDark, solidFound } so callers can continue walking down if transparent.
 */
interface PersiciImageElement extends HTMLImageElement {
  _persiciLum?: number;
}

let _cachedCanvas: HTMLCanvasElement | null = null;
let _cachedCtx: CanvasRenderingContext2D | null = null;

function getColorLuminanceAndAlpha(colorStr: string): { lum: number; alpha: number } | null {
  if (!colorStr || colorStr === 'transparent' || colorStr === 'rgba(0, 0, 0, 0)') {
    return null;
  }

  // 1. Fast-path: OKLCH format (e.g. oklch(0.984 0.003 247.858 / 0.5) or oklch(0.984 0.003 247.858))
  if (colorStr.startsWith('oklch')) {
    const nums = colorStr.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
    if (nums && nums.length >= 1) {
      const L = parseFloat(nums[0]);
      let alpha = 1;
      if (colorStr.includes('/')) {
        const slashParts = colorStr.split('/');
        const aNum = slashParts[1]?.match(/[-+]?\d*\.?\d+/);
        if (aNum) {
          alpha = parseFloat(aNum[0]);
          if (slashParts[1].includes('%')) {
            alpha /= 100;
          }
        }
      }
      return { lum: L, alpha };
    }
  }

  // 2. Fast-path: Standard RGB / RGBA format
  if (colorStr.startsWith('rgb')) {
    const nums = colorStr.match(/[-+]?\d*\.?\d+/g);
    if (nums && nums.length >= 3) {
      const r = parseFloat(nums[0]);
      const g = parseFloat(nums[1]);
      const b = parseFloat(nums[2]);
      let a = nums.length >= 4 ? parseFloat(nums[3]) : 1;
      if (colorStr.includes('%') && nums.length >= 4 && colorStr.split(',')[3]?.includes('%')) {
        a /= 100;
      }
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      return { lum, alpha: a };
    }
  }

  // 3. Universal Canvas 2D fallback (handles color-mix, lab, hex, hsl, named colors, display-p3)
  if (typeof document !== 'undefined') {
    try {
      if (!_cachedCanvas) {
        _cachedCanvas = document.createElement('canvas');
        _cachedCanvas.width = 1;
        _cachedCanvas.height = 1;
        _cachedCtx = _cachedCanvas.getContext('2d', { willReadFrequently: true });
      }
      if (_cachedCtx) {
        _cachedCtx.clearRect(0, 0, 1, 1);
        _cachedCtx.fillStyle = colorStr;
        _cachedCtx.fillRect(0, 0, 1, 1);
        const data = _cachedCtx.getImageData(0, 0, 1, 1).data;
        const a = data[3] / 255;
        if (a > 0) {
          const lum = (0.2126 * data[0] + 0.7152 * data[1] + 0.0722 * data[2]) / 255;
          return { lum, alpha: a };
        }
      }
    } catch {
      // In case canvas is inaccessible
    }
  }

  return null;
}

function getElementLuminance(el: HTMLElement): { isDark: boolean; solidFound: boolean } {
  // 1. Explicit section-level data attribute
  const directLum = el.getAttribute?.('data-header-luminance');
  if (directLum === 'light') return { isDark: false, solidFound: true };
  if (directLum === 'dark') return { isDark: true, solidFound: true };

  // 2. If it's an <img> tag, sample its pixel brightness via canvas
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

  // 3. Videos are visually dark
  if (el.tagName === 'VIDEO') {
    return { isDark: true, solidFound: true };
  }

  // 4. Explicit solid / Tailwind background classes
  const classes = (el.className || '').toString().split(/\s+/);
  for (const cls of classes) {
    if (!cls.startsWith('bg-')) continue;

    // Known dark background classes
    if (
      cls === 'bg-persici-black' ||
      cls === 'bg-black' ||
      cls === 'bg-slate-900' ||
      cls === 'bg-zinc-900' ||
      cls === 'bg-neutral-900' ||
      cls === 'bg-gray-900' ||
      cls === 'bg-persici-crimson'
    ) {
      return { isDark: true, solidFound: true };
    }

    // Known light background classes (including opacity variants like bg-slate-50/50, bg-white/80)
    if (
      cls === 'bg-white' ||
      cls === 'bg-persici-white' ||
      cls.startsWith('bg-white/') ||
      cls.startsWith('bg-persici-white/') ||
      cls === 'bg-slate-50' ||
      cls.startsWith('bg-slate-50/') ||
      cls === 'bg-gray-50' ||
      cls.startsWith('bg-gray-50/') ||
      cls === 'bg-neutral-50' ||
      cls.startsWith('bg-neutral-50/') ||
      cls === 'bg-slate-100' ||
      cls.startsWith('bg-slate-100/') ||
      cls === 'bg-[#FFFAFA]' ||
      cls === 'bg-[#F9F8F6]'
    ) {
      return { isDark: false, solidFound: true };
    }
  }

  // 5. Inspect computed backgroundColor
  const computed = window.getComputedStyle(el);
  const parsed = getColorLuminanceAndAlpha(computed.backgroundColor);
  if (parsed && parsed.alpha >= 0.25) {
    return { isDark: parsed.lum < 0.45, solidFound: true };
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

  // 1. Explicit section-level luminance declaration takes precedence
  for (const el of candidateElements) {
    const section = el.closest?.('[data-header-luminance]') as HTMLElement | null;
    if (section) {
      const lum = section.getAttribute('data-header-luminance');
      if (lum === 'light') return false;
      if (lum === 'dark') return true;
    }
  }

  // 2. Fallback to computed element styles and background inspections
  for (const el of candidateElements) {
    const result = getElementLuminance(el);
    if (result.solidFound) {
      return result.isDark;
    }
  }

  // 3. Fallback: inspect document.body background
  if (document.body) {
    const bodyResult = getElementLuminance(document.body);
    if (bodyResult.solidFound) {
      return bodyResult.isDark;
    }
  }

  // Default to false (light background, base page in Persici is --persici-white)
  return false;
}

export function Header({ lang, dict }: HeaderProps) {
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedKeys, setMobileExpandedKeys] = useState<Record<string, boolean>>({});
  const [isScrolled, setIsScrolled] = useState(false);

  // Independent per-zone theme detection
  const [isLogoDark, setIsLogoDark] = useState(false);
  const [isNavDark, setIsNavDark] = useState(false);
  const [isCtaDark, setIsCtaDark] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenDropdownKey(null);
    setMobileMenuOpen(false);
    setIsHeaderHidden(false);
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menu on screen resize to desktop (>= 1024px) or on Escape key
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Track scroll position to transition mobile header background from transparent to white
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 15);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Listen for custom hide event from page-specific sub-navbars
  useEffect(() => {
    function handleToggleMainHeader(e: Event) {
      const customEvent = e as CustomEvent<{ hide: boolean }>;
      if (customEvent.detail !== undefined) {
        setIsHeaderHidden(Boolean(customEvent.detail.hide));
      }
    }

    window.addEventListener('persici:hide-main-header', handleToggleMainHeader);
    return () => {
      window.removeEventListener('persici:hide-main-header', handleToggleMainHeader);
    };
  }, []);

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

  // Real-time per-element dark detection
  const evaluateHeaderTheme = useCallback(() => {
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
  }, []);

  // Listen for scroll, resize, load
  useEffect(() => {
    let animationFrameId: number;

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
  }, [evaluateHeaderTheme]);

  // Re-evaluate whenever route changes (immediate + post-hydration passes)
  useEffect(() => {
    evaluateHeaderTheme();
    const t1 = setTimeout(evaluateHeaderTheme, 50);
    const t2 = setTimeout(evaluateHeaderTheme, 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, evaluateHeaderTheme]);

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

  const isMobileHeaderWhite = mobileMenuOpen || isScrolled;

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        isHeaderHidden && !mobileMenuOpen ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      } ${
        isMobileHeaderWhite
          ? 'bg-white shadow-xs border-b border-gray-100 lg:bg-transparent lg:shadow-none lg:border-transparent'
          : 'bg-transparent'
      }`}
      suppressHydrationWarning
    >
      <div
        className={`${sectionContainer} max-w-8xl flex h-20 lg:h-25 items-center justify-between relative lg:px-6 xl:px-8`}
        suppressHydrationWarning
      >
        {/* Left: Mobile/Tablet Hamburger (or Close X) + Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 transition-all duration-300" suppressHydrationWarning>
          {/* Mobile/Tablet Menu Button (Visible on < lg, hidden on lg+) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-colors duration-200 lg:hidden cursor-pointer select-none outline-none focus:outline-none -ms-1 sm:-ms-2 ${
              isMobileHeaderWhite
                ? 'text-slate-900 hover:bg-black/5'
                : isLogoDark
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-900 hover:bg-black/5'
            }`}
            aria-label={mobileMenuOpen ? 'Close Menu' : (dict.nav.menu || 'Toggle Menu')}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.5h16M4 12h16M4 17.5h16" />
              </svg>
            )}
          </button>

          <div ref={logoRef} className="flex items-center">
            {/* Mobile / Tablet Logo (< lg) */}
            <div className="lg:hidden flex items-center">
              <Logo lang={lang} variant={isMobileHeaderWhite ? 'dark' : (isLogoDark ? 'light' : 'dark')} />
            </div>
            {/* Desktop Logo (lg+) */}
            <div className="hidden lg:flex items-center">
              <Logo lang={lang} variant={isLogoDark ? 'light' : 'dark'} />
            </div>
          </div>
        </div>

        {/* Center: Floating Pill Navigation (Laptop & Desktop only: lg+) */}
        <nav
          ref={navRef}
          suppressHydrationWarning
          className={`hidden lg:flex items-center gap-1 xl:gap-2 rounded-full px-2.5 xl:px-4 py-1.5 xl:py-2 backdrop-blur-md transition-all duration-300 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-20 ${isNavDark
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
                  className={`group relative inline-flex flex-col items-center px-2 xl:px-3.5 py-1 xl:py-1.5 text-xs xl:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer select-none outline-none shrink-0 ${isNavDark
                      ? 'text-white/85 hover:text-white'
                      : 'text-slate-800 hover:text-black'
                    }`}
                >
                  <span className="relative whitespace-nowrap">
                    {label}
                    {/* Publicis Sapient signature expanding red underline */}
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] overflow-hidden">
                      <span
                        className={`absolute inset-0 bg-persici-crimson transition-transform duration-300 ease-in-out ${isOpen || active
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
                data-nav-item="true"
                className={`group relative inline-flex flex-col items-center px-2 xl:px-3.5 py-1 xl:py-1.5 text-xs xl:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer select-none outline-none shrink-0 ${isNavDark
                    ? 'text-white/85 hover:text-white'
                    : 'text-slate-800 hover:text-black'
                  }`}
              >
                <span className="relative whitespace-nowrap">
                  {label}
                  {/* Publicis Sapient signature expanding red underline */}
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] overflow-hidden">
                    <span
                      className={`absolute inset-0 bg-persici-crimson transition-transform duration-300 ease-in-out ${active
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

        {/* Right: Language Switcher & Book a Call CTA */}
        <div ref={ctaRef} className="flex items-center gap-1.5 xl:gap-2.5" suppressHydrationWarning>
          {/* Mobile / Tablet Language Switcher (< lg) */}
          <div className="lg:hidden flex items-center">
            <LanguageSwitcher
              currentLang={lang}
              isDark={isMobileHeaderWhite ? false : (isCtaDark || isNavDark)}
            />
          </div>
          {/* Desktop Language Switcher (lg+) */}
          <div className="hidden lg:flex items-center">
            <LanguageSwitcher
              currentLang={lang}
              isDark={isCtaDark || isNavDark}
            />
          </div>

          {/* Mobile / Tablet CTA button (< lg) */}
          <div className="lg:hidden flex items-center">
            <HomeButton
              href={`/${lang}/contact`}
              title={dict.nav.bookCall}
              onClick={() => setMobileMenuOpen(false)}
              className={`inline-flex transition-all duration-300 !px-3 sm:!px-4 !py-1.5 sm:!py-2 !text-xs sm:!text-sm ${
                isMobileHeaderWhite
                  ? '!bg-persici-crimson !text-white hover:!bg-persici-crimson/90 shadow-xs'
                  : isCtaDark
                    ? '!bg-white !text-persici-black hover:!bg-white/90 shadow-md'
                    : ''
              }`}
              iconClassName={`!h-5 !w-5 sm:!h-6 sm:!w-6 text-[10px] sm:text-xs ${
                isMobileHeaderWhite
                  ? '!bg-white !text-persici-crimson'
                  : isCtaDark
                    ? '!bg-persici-black !text-white'
                    : ''
              }`}
              currentLang={lang}
              isLangEffectIcon={true}
            />
          </div>

          {/* Desktop CTA button (lg+) */}
          <div className="hidden lg:flex items-center">
            <HomeButton
              href={`/${lang}/contact`}
              title={dict.nav.bookCall}
              className={`inline-flex transition-all duration-300 !px-3.5 xl:!px-6 !py-1.5 xl:!py-2 !text-xs xl:!text-sm ${
                isCtaDark
                  ? '!bg-white !text-persici-black hover:!bg-white/90 shadow-md'
                  : ''
              }`}
              iconClassName={`!h-6 !w-6 xl:!h-8 xl:!w-8 text-[11px] xl:text-xs ${
                isCtaDark
                  ? '!bg-persici-black !text-white'
                  : ''
              }`}
              currentLang={lang}
              isLangEffectIcon={true}
            />
          </div>
        </div>

        {/* Floating Dropdown Mega-Menu Card (Desktop) */}
        <NavDropdownCard
          activeLink={activeDropdownLink}
          lang={lang}
          dict={dict}
          onClose={() => setOpenDropdownKey(null)}
        />
      </div>

      {/* Mobile/Tablet Menu Drawer (Publicis Sapient Style with Persici Identity) */}
      {mobileMenuOpen && (
        <div className="w-full bg-white h-[calc(100vh-5rem)] h-[calc(100dvh-5rem)] overflow-y-auto border-t border-gray-100 lg:hidden">
          <div className={`${sectionContainer} max-w-8xl py-3 sm:py-5 flex flex-col min-h-full justify-between`}>
            <nav className="flex flex-col" aria-label="Mobile and tablet navigation">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const isExpanded = !!mobileExpandedKeys[link.key];
                const label = dict.nav[link.key as keyof typeof dict.nav] || link.key;

                if (link.hasDropdown && link.subItems) {
                  return (
                    <div key={link.key} className="border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() => toggleMobileAccordion(link.key)}
                        className="flex w-full items-center justify-between py-4 sm:py-5 text-start text-base sm:text-lg font-semibold text-slate-900 hover:text-persici-crimson transition-colors select-none cursor-pointer"
                        aria-expanded={isExpanded}
                      >
                        <span className={active ? 'text-persici-crimson' : ''}>{label}</span>
                        <svg
                          className={`h-4 w-4 sm:h-5 sm:w-5 text-slate-800 transition-transform duration-200 shrink-0 ${
                            isExpanded ? 'rotate-180 text-persici-crimson' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isExpanded && (
                        <div className="pb-4 pt-1 space-y-1 ps-2 sm:ps-4">
                          {/* Overview Link */}
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-persici-crimson hover:bg-persici-crimson/5 transition-colors group w-full"
                          >
                            <span>
                              {lang === 'ar' ? `نظرة عامة على ${label}` : `Overview of ${label}`}
                            </span>
                            <span className="text-xs transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden="true">
                              {isRtl ? '←' : '→'}
                            </span>
                          </Link>

                          {/* Sub-items */}
                          {link.subItems.map((sub) => {
                            const subLabel = dict.nav[sub.key as keyof typeof dict.nav] || sub.key;
                            const subHref = `/${lang}${sub.href}`;
                            const solutionIcon = solutionIconMap[sub.key];
                            const SubItemIcon = iconMap[sub.key];
                            return (
                              <Link
                                key={sub.key}
                                href={subHref}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-black/[0.03] transition-colors group w-full"
                              >
                                {solutionIcon ? (
                                  <Image
                                    src={solutionIcon}
                                    alt=""
                                    width={16}
                                    height={16}
                                    className="h-4 w-4 shrink-0 object-contain brightness-0 opacity-75"
                                    style={{ filter: 'brightness(0)' }}
                                    aria-hidden="true"
                                  />
                                ) : SubItemIcon ? (
                                  <SubItemIcon className="h-4 w-4 shrink-0 text-slate-600" />
                                ) : null}
                                <span className="flex items-center gap-1.5">
                                  <span>{subLabel}</span>
                                  <span className="text-slate-400 text-xs transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 group-hover:text-slate-700" aria-hidden="true">
                                    {isRtl ? '←' : '→'}
                                  </span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={link.key} className="border-b border-gray-100">
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-4 sm:py-5 text-base sm:text-lg font-semibold transition-colors ${
                        active ? 'text-persici-crimson' : 'text-slate-900 hover:text-persici-crimson'
                      }`}
                    >
                      <span>{label}</span>
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Subtle Drawer Footer: Regional Hubs & Contact */}
            <div className="pt-8 pb-4 mt-auto border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-foreground/50">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground/75">
                  {lang === 'ar' ? 'المكاتب:' : 'Offices:'}
                </span>
                <span>
                  {lang === 'ar' ? 'دبي • الرياض • عمّان' : 'Dubai • Riyadh • Amman'}
                </span>
              </div>
              <a
                href="mailto:info@persiciagency.com"
                className="text-foreground/60 hover:text-persici-crimson transition-colors"
              >
                info@persiciagency.com
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
