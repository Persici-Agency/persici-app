'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sectionContainer } from '@shared/constants';

export interface HowWeDoItSubNavSection {
  id: string;
  label: {
    en: string;
    ar: string;
  };
}

export interface HowWeDoItSubNavbarProps {
  lang: string;
  sections?: HowWeDoItSubNavSection[];
  ctaText?: {
    en: string;
    ar: string;
  };
  ctaTargetId?: string;
  className?: string;
}

const DEFAULT_SECTIONS: HowWeDoItSubNavSection[] = [
  {
    id: 'capabilities',
    label: {
      en: 'Capabilities',
      ar: 'القدرات الاستراتيجية',
    },
  },
  {
    id: 'why-it-matters',
    label: {
      en: 'Why It Matters',
      ar: 'الأهمية والقيمة',
    },
  },
  {
    id: 'framework',
    label: {
      en: 'Framework',
      ar: 'إطار العمل',
    },
  },
  {
    id: 'verticals',
    label: {
      en: 'Domains',
      ar: 'مجالات التطبيق',
    },
  },
  {
    id: 'stories',
    label: {
      en: 'Client Stories',
      ar: 'قصص النجاح',
    },
  },
  {
    id: 'faqs',
    label: {
      en: 'FAQs',
      ar: 'الأسئلة الشائعة',
    },
  },
];

export function HowWeDoItSubNavbar({
  lang,
  sections = DEFAULT_SECTIONS,
  ctaText = {
    en: 'Connect with us',
    ar: 'تواصل معنا',
  },
  ctaTargetId = 'contact',
  className = '',
}: HowWeDoItSubNavbarProps) {
  const isRtl = lang === 'ar';
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || 'capabilities');
  const [isSticky, setIsSticky] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      let currentActive = sections[0]?.id || 'capabilities';

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

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const sticky = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setIsSticky(sticky);

        window.dispatchEvent(
          new CustomEvent('persici:hide-main-header', { detail: { hide: sticky } })
        );

        if (sticky) {
          document.documentElement.classList.add('how-we-do-it-subnav-sticky');
        } else {
          document.documentElement.classList.remove('how-we-do-it-subnav-sticky');
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
      window.dispatchEvent(
        new CustomEvent('persici:hide-main-header', { detail: { hide: false } })
      );
      document.documentElement.classList.remove('how-we-do-it-subnav-sticky');
    };
  }, []);

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
      <div ref={sentinelRef} className="h-0 w-full pointer-events-none" aria-hidden="true" />

      <nav
        ref={navRef}
        aria-label={isRtl ? 'أقسام صفحة المنهجية' : 'Methodology page sections'}
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b border-black/[0.08] ${
          isSticky
            ? 'bg-[#F6F5F3]/95 backdrop-blur-md shadow-xs py-2'
            : 'bg-[#F9F8F6] py-2.5'
        } ${className}`}
      >
        <div className={`${sectionContainer} flex items-center justify-between gap-4`}>
          <div
            ref={pillListRef}
            className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sections.map((sec) => {
              const isActive = activeId === sec.id;
              const label = sec.label[isRtl ? 'ar' : 'en'] || sec.label.en;

              return (
                <button
                  key={sec.id}
                  onClick={() => handleScrollTo(sec.id)}
                  className={`shrink-0 px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'bg-persici-crimson text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="shrink-0 flex items-center">
            <button
              onClick={() => handleScrollTo(ctaTargetId)}
              className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-persici-black text-white hover:bg-persici-crimson transition-all duration-200 cursor-pointer shadow-xs whitespace-nowrap"
            >
              {ctaText[isRtl ? 'ar' : 'en'] || ctaText.en}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
