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
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-fit">
              {[
                {
                  name: 'LinkedIn',
                  href: '#',
                  path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z',
                },
                {
                  name: 'Facebook',
                  href: '#',
                  path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                },
                {
                  name: 'Instagram',
                  href: '#',
                  path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                },
                {
                  name: 'Pinterest',
                  href: '#',
                  path: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.62-5.373-11.987-12-11.987z',
                },
                {
                  name: 'Snapchat',
                  href: '#',
                  path: 'M12.035.002c-4.14 0-7.143 2.984-7.143 6.936 0 .809.176 2.068.324 2.859-.447.166-.99.39-1.428.618-.465.242-.782.518-.782.99 0 .614.542.92 1.144 1.15.228.087.494.184.77.308-.035.405-.054.818-.054 1.237 0 .285.01.564.027.84-.704.25-1.392.545-1.956.934-.693.479-1.082 1.123-1.082 1.838 0 1.049.882 1.674 2.27 1.895.344.055.727.085 1.145.092.368.61 1.01 1.034 1.894 1.238.455.105.992.158 1.625.158.468 0 .964-.03 1.488-.088.384.453.905.787 1.545.967.575.162 1.265.247 2.052.247.788 0 1.478-.085 2.053-.247.64-.18 1.161-.514 1.545-.967.524.058 1.02.088 1.488.088.633 0 1.17-.053 1.625-.158.884-.204 1.526-.628 1.894-1.238.418-.007.801-.037 1.145-.092 1.388-.221 2.27-.846 2.27-1.895 0-.715-.389-1.359-1.082-1.838-.564-.389-1.252-.684-1.956-.934.017-.276.027-.555.027-.84 0-.419-.019-.832-.054-1.237.276-.124.542-.221.77-.308.602-.23 1.144-.536 1.144-1.15 0-.472-.317-.748-.782-.99-.438-.228-.981-.452-1.428-.618.148-.791.324-2.05.324-2.859C19.178 2.986 16.175.002 12.035.002z',
                },
                {
                  name: 'TikTok',
                  href: '#',
                  path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01V14.8c0 2.87-1.19 5.34-3.32 6.78-1.78 1.2-4.04 1.57-6.14 1.05-2.58-.64-4.66-2.58-5.39-5.12-.9-3.13.43-6.52 3.23-8.08 1.05-.59 2.25-.89 3.47-.9v4.06c-.84.07-1.68.39-2.31.96-.94.85-1.28 2.21-.86 3.4.42 1.19 1.55 1.99 2.81 2.01 1.61.02 2.94-1.24 3.02-2.85.03-.68.02-14.84.02-15.82z',
                },
                {
                  name: 'X',
                  href: '#',
                  path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                },
                {
                  name: 'YouTube',
                  href: '#',
                  path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
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
