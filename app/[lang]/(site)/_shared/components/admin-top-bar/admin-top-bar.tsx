'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TbLayoutDashboard,
  TbEdit,
  TbUserCheck,
  TbBriefcase,
} from 'react-icons/tb';

interface AuthenticatedAdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminTopBarProps {
  lang: string;
}

interface ResolvedAdminEditTarget {
  href: string;
  labelEn: string;
  labelAr: string;
  secondaryHref?: string;
  secondaryLabelEn?: string;
  secondaryLabelAr?: string;
}

function resolveEditTarget(pathname: string, lang: string): ResolvedAdminEditTarget {
  const prefix = `/${lang}`;
  const stripped = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
  const normalized = stripped.replace(/\/+$/, '') || '/';
  const segments = normalized.split('/').filter(Boolean);

  if (segments.length === 0) {
    return {
      href: `/${lang}/dashboard/pages/home`,
      labelEn: 'Edit This Page',
      labelAr: 'تعديل هذه الصفحة',
    };
  }

  const section = segments[0];
  const subSlug = segments[1];

  switch (section) {
    case 'about':
      return {
        href: `/${lang}/dashboard/pages/about`,
        labelEn: 'Edit About Page',
        labelAr: 'تعديل صفحة من نحن',
      };
    case 'contact':
      return {
        href: `/${lang}/dashboard/pages/contact`,
        labelEn: 'Edit Contact Page',
        labelAr: 'تعديل صفحة تواصل معنا',
      };
    case 'client-stories':
    case 'work':
      if (subSlug) {
        return {
          href: `/${lang}/dashboard/content/projects?edit=${encodeURIComponent(subSlug)}`,
          labelEn: 'Edit This Story',
          labelAr: 'تعديل هذه القصة',
          secondaryHref: `/${lang}/dashboard/content/projects`,
          secondaryLabelEn: 'All Stories',
          secondaryLabelAr: 'كل القصص',
        };
      }
      return {
        href: `/${lang}/dashboard/pages/client-stories`,
        labelEn: 'Edit This Page',
        labelAr: 'تعديل هذه الصفحة',
        secondaryHref: `/${lang}/dashboard/content/projects`,
        secondaryLabelEn: 'Manage Stories',
        secondaryLabelAr: 'إدارة القصص',
      };
    case 'solutions':
      return {
        href: subSlug
          ? `/${lang}/dashboard/pages/solutions-${encodeURIComponent(subSlug)}`
          : `/${lang}/dashboard/pages/solutions`,
        labelEn: subSlug ? 'Edit Solution Page' : 'Edit Solutions Page',
        labelAr: subSlug ? 'تعديل صفحة الحل' : 'تعديل صفحة الحلول',
      };
    case 'industries':
      return {
        href: subSlug
          ? `/${lang}/dashboard/pages/industries-${encodeURIComponent(subSlug)}`
          : `/${lang}/dashboard/pages/industries`,
        labelEn: subSlug ? 'Edit Industry Page' : 'Edit Industries Page',
        labelAr: subSlug ? 'تعديل صفحة القطاع' : 'تعديل صفحة القطاعات',
      };
    case 'how-we-do-it':
      return {
        href: subSlug
          ? `/${lang}/dashboard/pages/how-we-do-it-${encodeURIComponent(subSlug)}`
          : `/${lang}/dashboard/pages/how-we-do-it`,
        labelEn: subSlug ? 'Edit Methodology Page' : 'Edit How We Do It',
        labelAr: subSlug ? 'تعديل صفحة المنهجية' : 'تعديل كيف نعمل',
      };
    case 'careers':
      return {
        href: subSlug
          ? `/${lang}/dashboard/careers/openings`
          : `/${lang}/dashboard/pages/careers`,
        labelEn: subSlug ? 'Edit Job Openings' : 'Edit Careers Page',
        labelAr: subSlug ? 'تعديل الوظائف' : 'تعديل صفحة الوظائف',
      };
    case 'insights':
      return {
        href: subSlug
          ? `/${lang}/dashboard/content/insights`
          : `/${lang}/dashboard/pages/insights`,
        labelEn: subSlug ? 'Manage Insights' : 'Edit Insights Page',
        labelAr: subSlug ? 'إدارة المقالات' : 'تعديل صفحة المقالات',
      };
    default:
      return {
        href: `/${lang}/dashboard`,
        labelEn: 'Edit in Dashboard',
        labelAr: 'التعديل من لوحة التحكم',
      };
  }
}

export function AdminTopBar({ lang }: AdminTopBarProps) {
  const pathname = usePathname() || `/${lang}`;
  const isRtl = lang === 'ar';
  const [adminUser, setAdminUser] = useState<AuthenticatedAdminUser | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me?check=1', {
      cache: 'no-store',
      credentials: 'same-origin',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.authenticated && data?.user?.role === 'admin') {
          setAdminUser(data.user as AuthenticatedAdminUser);
        } else {
          setAdminUser(null);
        }
      })
      .catch(() => {
        if (active) setAdminUser(null);
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (adminUser) {
      root.style.setProperty('--persici-admin-bar-offset', '36px');
    } else {
      root.style.removeProperty('--persici-admin-bar-offset');
    }
    return () => {
      root.style.removeProperty('--persici-admin-bar-offset');
    };
  }, [adminUser]);

  if (!adminUser) {
    return null;
  }

  const editTarget = resolveEditTarget(pathname, lang);

  return (
    <>
      {/* Reserve top strip flow space so sticky navbar & content remain aligned */}
      <div className="h-9 w-full shrink-0 bg-slate-950" aria-hidden="true" />

      <div
        data-admin-top-bar="true"
        dir={isRtl ? 'rtl' : 'ltr'}
        className="fixed top-0 inset-x-0 z-[60] h-9 bg-slate-950/95 backdrop-blur-md border-b border-white/10 text-white px-3 sm:px-6 flex items-center justify-between gap-2 text-[11px] sm:text-xs shadow-sm"
      >
        {/* Start side: Brand Admin indicator + Dashboard + Contextual Edit */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <Link
            href={`/${lang}/dashboard`}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-white/90 hover:text-white hover:bg-white/10 font-semibold transition-colors shrink-0"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            <TbLayoutDashboard className="w-3.5 h-3.5 text-persici-crimson shrink-0" />
            <span className="hidden xs:inline sm:inline">
              {isRtl ? 'لوحة التحكم' : 'Go to Dashboard'}
            </span>
          </Link>

          <span className="h-3.5 w-px bg-white/15 shrink-0" aria-hidden="true" />

          <Link
            href={editTarget.href}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-persici-crimson hover:bg-red-700 text-white font-semibold transition-colors shadow-2xs shrink-0"
          >
            <TbEdit className="w-3.5 h-3.5 shrink-0" />
            <span>{isRtl ? editTarget.labelAr : editTarget.labelEn}</span>
          </Link>

          {editTarget.secondaryHref && (
            <Link
              href={editTarget.secondaryHref}
              className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 font-medium transition-colors shrink-0"
            >
              <TbBriefcase className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isRtl ? editTarget.secondaryLabelAr : editTarget.secondaryLabelEn}
              </span>
            </Link>
          )}
        </div>

        {/* End side: Welcome + Admin Name */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/${lang}/dashboard/settings`}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-slate-200 hover:text-white hover:bg-white/10 transition-colors max-w-[200px] sm:max-w-xs"
            title={adminUser.email}
          >
            <TbUserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate font-medium">
              {isRtl
                ? `مرحباً، ${adminUser.name || 'المشرف'}`
                : `Welcome, ${adminUser.name || 'Admin'}`}
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-white/10 text-[9px] font-mono uppercase tracking-wider text-slate-300">
              Admin
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
