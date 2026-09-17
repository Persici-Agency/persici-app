import Link from 'next/link';
import { Logo } from '@shared/components/logo';
import { HomeButton } from '@shared/components/home-button';
import type { Dictionary } from '@dictionaries';
import { siteNavLinks } from '@shared/data';
import { LanguageSwitcher } from '@shared/components/language-switcher';
import type { FooterProps } from '@shared/types';

export type { FooterProps };

export function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const navLinks = siteNavLinks.filter((l) => l.key !== 'home');

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
              <HomeButton
                href={`/${lang}/contact`}
                title={dict.footer.bookCall}
                className="bg-persici-crimson text-white shadow-md shadow-persici-crimson/25"
                currentLang={lang}
                isLangEffectIcon={true}
              />
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
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
                    href={`/${lang}${link.href}`}
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
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
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
                <Link
                  href={`/${lang}/privacy`}
                  className="text-xs text-white/70 transition-colors hover:text-persici-blush"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/terms`}
                  className="text-xs text-white/70 transition-colors hover:text-persici-blush"
                >
                  {dict.footer.terms}
                </Link>
              </li>
              <li className="pt-2">
                <a
                  href="mailto:info@persiciagency.com"
                  className="text-[11px] text-white/60 transition-colors hover:text-persici-blush"
                >
                  info@persiciagency.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media (4 cols) */}
          <div className="lg:col-span-4">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
              {dict.footer.socialTitle || (lang === 'ar' ? 'وسائل التواصل الاجتماعي' : 'Social Media')}
            </h3>
            <div className="flex items-center gap-3">
              {[
                {
                  name: 'LinkedIn',
                  href: 'https://www.linkedin.com/company/persiciofficial/',
                  path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z',
                },
                {
                  name: 'Facebook',
                  href: 'https://www.facebook.com/persiciofficial',
                  path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                },
                {
                  name: 'Instagram',
                  href: 'https://www.instagram.com/persiciofficial',
                  path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                },
              ].map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform.name}
                  title={platform.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white/70 backdrop-blur-xs transition-all duration-300 hover:border-persici-crimson hover:bg-persici-crimson hover:text-white hover:scale-110 shadow-xs hover:shadow-lg hover:shadow-persici-crimson/30"
                >
                  <svg className="h-4.5 w-4.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d={platform.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {currentYear} Persici. {dict.footer.rights}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <LanguageSwitcher currentLang={lang} variant="footer" />
            <span className="text-xs text-white/40">
              {lang === 'ar' ? 'دبي • الرياض • عمّان' : 'Dubai • Riyadh • Amman'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
