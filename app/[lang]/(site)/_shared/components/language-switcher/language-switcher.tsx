'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TbGlobe } from 'react-icons/tb';

export type LanguageSwitcherProps = {
  currentLang: string;
  variant?: 'navbar' | 'footer' | 'mobile';
  className?: string;
  isDark?: boolean;
};

export function LanguageSwitcher({
  currentLang,
  className = '',
  isDark = false,
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  function getLocalizedPath(targetLocale: string) {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split('/');
    segments[1] = targetLocale;
    return segments.join('/') || `/${targetLocale}`;
  }

  const isCurrentArabic = currentLang === 'ar';
  // When in English, switch target is 'ar' and button displays 'AR'.
  // When in Arabic, switch target is 'en' and button displays 'EN'.
  const targetLang = isCurrentArabic ? 'en' : 'ar';
  const targetLabel = isCurrentArabic ? 'EN' : 'AR';
  const targetPath = getLocalizedPath(targetLang);

  return (
    <Link
      href={targetPath}
      prefetch={true}
      className={`group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium tracking-wider border-0 border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-all duration-200 select-none cursor-pointer ${
        isDark
          ? 'text-white/85 hover:text-white hover:bg-white/10 active:bg-white/15'
          : 'text-slate-800 hover:text-persici-crimson hover:bg-black/5 active:bg-black/10'
      } ${className}`}
      aria-label={isCurrentArabic ? 'Switch to English' : 'التحويل إلى العربية (Switch to Arabic)'}
      title={isCurrentArabic ? 'Switch to English' : 'التحويل إلى العربية'}
    >
      <TbGlobe className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
      <span className="uppercase text-[11px] sm:text-xs font-semibold leading-none">{targetLabel}</span>
    </Link>
  );
}
