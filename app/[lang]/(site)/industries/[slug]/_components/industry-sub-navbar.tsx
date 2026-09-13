'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sectionContainer } from '@shared/constants';

export interface IndustrySubNavSection {
  id: string;
  label: {
    en: string;
    ar: string;
  };
}

export interface IndustrySubNavbarProps {
  lang: string;
  sections?: IndustrySubNavSection[];
  ctaText?: {
    en: string;
    ar: string;
  };
  ctaTargetId?: string;
  className?: string;
}

const DEFAULT_SECTIONS: IndustrySubNavSection[] = [
  {
    id: 'realities',
    label: {
      en: 'Your industry',
      ar: 'واقع القطاع',
    },
  },
  {
    id: 'platforms',
    label: {
      en: 'Our platforms',
      ar: 'منصاتنا',
    },
  },
  {
    id: 'capabilities',
    label: {
      en: 'Capabilities',
      ar: 'القدرات',
    },
  },
  {
    id: 'use-cases',
    label: {
      en: 'Use cases',
      ar: 'حالات الاستخدام',
    },
  },
  {
    id: 'customer-stories',
    label: {
      en: 'Customer stories',
      ar: 'قصص النجاح',
    },
  },
  {
    id: 'research',
    label: {
      en: 'Research',
      ar: 'الأبحاث والرؤى',
    },
  },
];

/**
 * Dedicated Sticky Sub-Navbar for Industry Feature Pages
 * Directly modeled on Publicis Sapient industry navigation (media_1788983591126.png).
 * Features:
 * - Dynamic scrollspy with solid crimson active pill
 * - Smooth scroll targeting
 * - Sits below the Hero initially; becomes sticky at top-0 on scroll
 * - Coordinates with the main site header to hide it on scroll so they never clash
 */
export function IndustrySubNavbar({
  lang,
  sections = DEFAULT_SECTIONS,
  ctaText = {
    en: 'Connect with us',
    ar: 'تواصل معنا',
  },
  ctaTargetId = 'contact',
  className = '',
}: IndustrySubNavbarProps) {
  const isRtl = lang === 'ar';
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || 'realities');
  const [isSticky, setIsSticky] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillListRef = useRef<HTMLDivElement>(null);

  // Scrollspy to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // Offset for navbar height & breathing room

      let currentActive = sections[0]?.id || 'realities';

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentActive = sec.id;
          }
        }
      }

      setActiveId(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Sticky state detection & main header coordination
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the sentinel above the navbar exits the viewport (scrolled past), the navbar is sticky
        const sticky = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setIsSticky(sticky);

        // Notify main header to hide when sticky, restore when not sticky
        window.dispatchEvent(
          new CustomEvent('persici:hide-main-header', { detail: { hide: sticky } })
        );

        if (sticky) {
          document.documentElement.classList.add('industry-subnav-sticky');
        } else {
          document.documentElement.classList.remove('industry-subnav-sticky');
        }
      },
      {
        threshold: 0,
        rootMargin: '0px',
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      // Ensure header is always restored when navigating away
      window.dispatchEvent(
        new CustomEvent('persici:hide-main-header', { detail: { hide: false } })
      );
      document.documentElement.classList.remove('industry-subnav-sticky');
    };
  }, []);

  // Smooth scroll handler
  const handleScrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = navRef.current?.offsetHeight || 60;
      const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
      const targetPosition = elementTop - navHeight - 12;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  }, []);

  return (
    <>
      {/* Sentinel element to trigger sticky detection right before the sub-nav */}
      <div ref={sentinelRef} className="h-0 w-full pointer-events-none" aria-hidden="true" />

      <nav
        ref={navRef}
        aria-label={isRtl ? 'أقسام صفحة القطاع' : 'Industry page sections'}
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b border-black/[0.08] ${
          isSticky
            ? 'bg-[#F6F5F3]/95 backdrop-blur-md shadow-xs py-2'
            : 'bg-[#F9F8F6] py-2.5'
        } ${className}`}
      >
        <div className={`${sectionContainer} flex items-center justify-between gap-4`}>
          {/* Left: Pill navigation items */}
          <div
            ref={pillListRef}
            className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sections.map((sec) => {
              const isActive = activeId === sec.id;
              const label = sec.label[lang as 'en' | 'ar'] || sec.label.en;

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleScrollTo(sec.id)}
                  className={`shrink-0 px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none outline-none focus:ring-2 focus:ring-persici-crimson/30 ${
                    isActive
                      ? 'bg-persici-crimson text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Right: Connect with us CTA link */}
          <div className="shrink-0 flex items-center">
            <button
              type="button"
              onClick={() => handleScrollTo(ctaTargetId)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 hover:text-persici-crimson transition-colors group cursor-pointer"
            >
              <span>{ctaText[lang as 'en' | 'ar'] || ctaText.en}</span>
              <span className={`transition-transform duration-300 ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                {isRtl ? '←' : '→'}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
