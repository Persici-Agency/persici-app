import type { Metadata } from 'next';
import { lexendDeca, roboto, robotoMono, cairo, tajawal } from './_lib/fonts';
import { localeDirection } from './_lib/i18n';
import type { Locale } from './_lib/i18n';
import { hasLocale } from './dictionaries';
import { notFound } from 'next/navigation';
import './globals.css';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

export const metadata: Metadata = {
  title: {
    default: 'Persici — Digital Agency',
    template: '%s | Persici',
  },
  description:
    'Persici is a digital agency specializing in strategy, design, engineering, and digital transformation.',
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
      className={`${lexendDeca.variable} ${roboto.variable} ${robotoMono.variable} ${cairo.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
