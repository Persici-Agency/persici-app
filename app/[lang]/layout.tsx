import type { Metadata } from 'next';
import Script from 'next/script';
import { lexendDeca, roboto, robotoMono, cairo, tajawal } from './_lib/fonts';
import { localeDirection } from './_lib/i18n';
import type { Locale } from './_lib/i18n';
import { hasLocale } from './dictionaries';
import { notFound } from 'next/navigation';
import { ExtensionCleaner } from './_lib/extension-cleaner';
import './globals.css';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

export const metadata: Metadata = {
  title: {
    default: 'Persici - Specialized in AI and Digital Transformation',
    template: '%s | Persici',
  },
  description:
    'Persici is a boutique studio specialized in AI and digital transformation.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dir = localeDirection[lang as Locale] || 'ltr';

  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
      className={`${lexendDeca.variable} ${roboto.variable} ${robotoMono.variable} ${cairo.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script src="/bis-cleanup.js" strategy="beforeInteractive" />
        <ExtensionCleaner />
        {children}
      </body>
    </html>
  );
}
