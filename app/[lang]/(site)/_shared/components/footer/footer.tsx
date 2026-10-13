import Link from 'next/link';
import { Logo } from '@shared/components/logo';
import { HomeButton } from '@shared/components/home-button';
import type { Dictionary } from '@dictionaries';
import { siteNavLinks } from '@shared/data';
import type { FooterProps } from '@shared/types';

export type { FooterProps };

export function Footer({ lang, dict, footerData }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const navLinks = siteNavLinks.filter((l) => l.key !== 'home');
  const brandDesc = footerData?.tagline?.[lang as 'en' | 'ar'] || (lang === 'ar' ? footerData?.tagline?.ar : footerData?.tagline?.en) || dict.footer.brandDesc;

  return (
    <footer className="relative border-t border-white/10 bg-persici-black text-white">
      {/* Decorative top ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-persici-crimson/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-12 lg:grid-cols-12">
          {/* Brand Col (4 cols on lg, 5 cols on md) */}
          <div className="md:col-span-5 lg:col-span-4">
            <Logo lang={lang} variant="light" className="mb-4" />
            <p className="max-w-sm text-xs leading-relaxed text-white/60">
              {brandDesc}
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

          {/* Navigation Links & Legal Links (Beside each other across all breakpoints: mobile, tablet, desktop) */}
          <div className="grid grid-cols-2 gap-6 sm:gap-10 md:col-span-7 lg:col-span-4">
            {/* Quick Links */}
            <div>
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

            {/* Legal & Info */}
            <div>
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
                    className="text-[11px] text-white/60 transition-colors hover:text-persici-blush break-all sm:break-normal"
                  >
                    info@persiciagency.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media (4 cols on lg, full width on md) */}
          <div className="md:col-span-12 lg:col-span-4">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
              {dict.footer.socialTitle || (lang === 'ar' ? 'وسائل التواصل الاجتماعي' : 'Social Media')}
            </h3>
            <div className="flex items-center gap-3">
              {[
                {
                  name: 'X',
                  href: 'https://x.com/persiciofficial',
                  path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                  hidden: false,
                },
                {
                  name: 'LinkedIn',
                  href: 'https://www.linkedin.com/company/persiciofficial/',
                  path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z',
                  hidden: false,
                },
                {
                  name: 'Instagram',
                  href: 'https://www.instagram.com/persiciofficial',
                  path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                  hidden: false,
                },
                {
                  name: 'Facebook',
                  href: 'https://www.facebook.com/persiciofficial',
                  path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                  hidden: true,
                },
                {
                  name: 'YouTube',
                  href: 'https://www.youtube.com/channel/UCI_O_2_bnWAePTGMl-rjKug',
                  path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
                  hidden: true,
                },
                {
                  name: 'Snapchat',
                  href: 'https://www.snapchat.com/@persiciofficial',
                  path: 'M12.007 2c-3.14 0-5.59 2.228-5.59 5.342 0 .597.106 1.309.288 1.954-.627.18-1.394.61-1.394 1.378 0 .428.307.868.804.868.175 0 .34-.055.513-.134.135 1.134.82 2.183 1.996 2.585-.297.433-.79.743-1.42.888-.344.079-.76.126-.76.538 0 .415.426.657.854.825.963.376 2.05.503 3.085.603.204.498.81.82 1.624.82.815 0 1.42-.322 1.624-.82 1.035-.1 2.122-.227 3.085-.603.428-.168.854-.41.854-.825 0-.412-.416-.459-.76-.538-.63-.145-1.123-.455-1.42-.888 1.176-.402 1.86-1.451 1.996-2.585.173.08.338.134.513.134.497 0 .804-.44.804-.868 0-.768-.767-1.198-1.394-1.378.182-.645.288-1.357.288-1.954C17.597 4.228 15.147 2 12.007 2z',
                  hidden: true,
                },
                {
                  name: 'Pinterest',
                  href: 'https://www.pinterest.com/persiciofficial/',
                  path: 'M12 0a12 12 0 0 0-4.37 23.18c-.03-.98-.06-2.48.05-3.55.1-.96.65-5.54.65-5.54s-.17-.33-.17-.82c0-.77.45-1.34 1.01-1.34.47 0 .7.36.7.78 0 .48-.3 1.19-.46 1.85-.13.56.28 1.01.83 1.01 1 0 1.77-1.05 1.77-2.57 0-1.35-.97-2.29-2.35-2.29-1.6 0-2.54 1.2-2.54 2.44 0 .48.19 1 .42 1.28.05.06.05.11.04.17-.04.18-.14.56-.16.64-.03.11-.09.13-.21.08-.8-.37-1.3-1.54-1.3-2.48 0-2.02 1.47-3.87 4.23-3.87 2.22 0 3.95 1.58 3.95 3.7 0 2.21-1.39 3.98-3.32 3.98-.65 0-1.26-.34-1.47-.73l-.4 1.53c-.15.56-.54 1.26-.81 1.69A12 12 0 1 0 12 0z',
                  hidden: true,
                },
                {
                  name: 'TikTok',
                  href: 'https://www.tiktok.com/@persiciofficial',
                  path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
                  hidden: true,
                },
              ]
                .filter((platform) => !platform.hidden)
                .map((platform) => (
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
            <span className="text-xs text-white/40">
              {lang === 'ar' ? 'دبي • الرياض • عمّان' : 'Dubai • Riyadh • Amman'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
