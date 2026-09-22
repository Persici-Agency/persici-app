'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import type { DashboardHeaderProps } from '../../types';
import {
  TbLogout,
  TbGlobe,
  TbExternalLink,
  TbLayoutSidebar,
} from 'react-icons/tb';

export function DashboardHeader({ lang = 'en', user, dict }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push(`/${lang}/dashboard/login`);
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  const getRoleBadgeClass = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'bg-persici-crimson/15 text-persici-crimson border-persici-crimson/30';
      case 'editor':
        return 'bg-blue-500/15 text-blue-600 border-blue-500/30';
      case 'author':
        return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30';
      case 'media buying':
        return 'bg-purple-500/15 text-purple-600 border-purple-500/30';
      case 'hr':
        return 'bg-amber-500/15 text-amber-600 border-amber-500/30';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const oppositeLang = lang === 'ar' ? 'en' : 'ar';
  const oppositeLangLabel = lang === 'ar' ? 'English' : 'العربية';

  // Preserve current subpath when switching language
  const targetHref = pathname.startsWith(`/${lang}`)
    ? pathname.replace(`/${lang}`, `/${oppositeLang}`)
    : `/${oppositeLang}${pathname}`;

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Sidebar Toggle & Operational Indicator */}
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Button (Ctrl+B) */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-persici-sidebar'))}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
          title={lang === 'ar' ? 'طي / توسيع الشريط الجانبي (Ctrl+B)' : 'Toggle Sidebar (Ctrl+B)'}
        >
          <TbLayoutSidebar className="w-5 h-5" />
          <span className="hidden md:inline-block text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            Ctrl+B
          </span>
        </button>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
            {lang === 'ar' ? 'لوحة التحكم الحية' : 'Growth OS Live'}
          </span>
        </div>
      </div>

      {/* Right: Actions & User Capsule */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Visit Live Website */}
        <Link
          href={`/${lang}`}
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors"
        >
          <span>{dict.dashboard.liveSite || (lang === 'ar' ? 'الموقع المباشر' : 'Live Site')}</span>
          <TbExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Language Switcher Button (Preserves exact subpath) */}
        <Link
          href={targetHref}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-persici-crimson bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
        >
          <TbGlobe className="w-4 h-4 text-persici-crimson" />
          <span>{oppositeLangLabel}</span>
        </Link>

        {/* User Capsule with Role Badge */}
        {user && (
          <div className="flex items-center gap-2 ps-2 border-s border-slate-200">
            <div className="text-end hidden md:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
              <span
                className={`inline-block text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.2 rounded-full border mt-0.5 ${getRoleBadgeClass(
                  user.role
                )}`}
              >
                {user.role}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              title={dict.dashboard.signOut || (lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out')}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <TbLogout className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
