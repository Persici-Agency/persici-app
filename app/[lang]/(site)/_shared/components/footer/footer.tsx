import Link from 'next/link';
import { Logo } from '@shared/components/logo';
import type { Dictionary } from '@dictionaries';

export type FooterProps = {
  lang: string;
  dict: Dictionary;
};

export function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { key: 'services', href: `/${lang}/services` },
    { key: 'work', href: `/${lang}/work` },
    { key: 'about', href: `/${lang}/about` },
    { key: 'insights', href: `/${lang}/insights` },
    { key: 'careers', href: `/${lang}/careers` },
    { key: 'contact', href: `/${lang}/contact` },
  ] as const;

  return (
    <footer className="relative border-t border-white/10 bg-persici-black text-white">
      {/* Decorative top ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-persici-crimson/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Col (4 cols) */}
          <div className="lg:col-span-4">
            <Logo lang={lang} variant="light" className="mb-4" />
            <p className="max-w-sm text-xs leading-relaxed text-white/60">
              {dict.footer.brandDesc}
            </p>
            <div className="mt-6">
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center gap-2 rounded-full bg-persici-crimson px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-persici-crimson/25 transition-all hover:bg-persici-crimson-80 hover:shadow-lg"
              >
                <span>{dict.footer.bookCall}</span>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
              {dict.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={`/${lang}`}
                  className="text-xs text-white/70 transition-colors hover:text-persici-blush"
                >
                  {dict.nav.home}
                </Link>
              </li>
              {navLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/70 transition-colors hover:text-persici-blush"
                  >
                    {dict.nav[link.key as keyof typeof dict.nav]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Info (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
              {dict.footer.legal}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={`/${lang}/contact`}
                  className="text-xs text-white/70 transition-colors hover:text-persici-blush"
                >
                  {dict.nav.contact}
                </Link>
              </li>
              <li>
                <span className="text-xs text-white/70 hover:text-persici-blush cursor-pointer">
                  {dict.footer.privacy}
                </span>
              </li>
              <li>
                <span className="text-xs text-white/70 hover:text-persici-blush cursor-pointer">
                  {dict.footer.terms}
                </span>
              </li>
              <li className="pt-2 text-[11px] text-white/40">
                hello@persici.com
              </li>
            </ul>
          </div>

          {/* Partner Badges (4 cols) */}
          <div className="lg:col-span-4">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
              {dict.footer.partnersTitle}
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xs transition-colors hover:border-white/20 hover:bg-white/[0.07]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white/90">Meta</div>
                  <div className="text-[9px] text-white/50">Business Partner</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xs transition-colors hover:border-white/20 hover:bg-white/[0.07]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white/90">Google</div>
                  <div className="text-[9px] text-white/50">Premier Partner</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xs transition-colors hover:border-white/20 hover:bg-white/[0.07]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l-8-4v10l8 4 8-4V7l-8 4z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white/90">Shopify Plus</div>
                  <div className="text-[9px] text-white/50">Official Partner</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xs transition-colors hover:border-white/20 hover:bg-white/[0.07]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white/90">Klaviyo</div>
                  <div className="text-[9px] text-white/50">Elite Partner</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {currentYear} Persici. {dict.footer.rights}
          </p>
          <div className="mt-4 flex items-center gap-6 sm:mt-0">
            <span className="text-xs text-white/40">Dubai • Riyadh • Stockholm</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
