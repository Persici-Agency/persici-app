import Link from 'next/link';
import { Logo } from '../logo';
import { getSidebarLinks } from '../../services';
import type { Dictionary } from '@dictionaries';

export type DashboardSidebarProps = {
  lang: string;
  dict: Dictionary;
};

export function DashboardSidebar({ lang, dict }: DashboardSidebarProps) {
  const sidebarLinks = getSidebarLinks();

  return (
    <aside className="w-64 border-e border-black/10 bg-persici-black text-white">
      <div className="flex h-16 items-center px-6">
        <Logo lang={lang} variant="light" />
      </div>
      <nav className="mt-4 space-y-1 px-3">
        {sidebarLinks.map((link) => (
          <Link
            key={link.key}
            href={`/${lang}${link.href}`}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span>{link.icon}</span>
            <span>{dict.dashboard[link.key as keyof typeof dict.dashboard]}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
