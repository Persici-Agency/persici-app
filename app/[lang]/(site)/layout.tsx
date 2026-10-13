import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { Header, Footer, FloatingAppointmentWidget } from '@shared/components';
import { getHeaderNavigationFromDb, getFooterNavigationFromDb } from '@/lib/navigation-server';

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const [dict, headerNav, footerNav] = await Promise.all([
    getDictionary(lang),
    getHeaderNavigationFromDb(),
    getFooterNavigationFromDb(),
  ]);

  return (
    <>
      <Header lang={lang} dict={dict} navData={headerNav} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} dict={dict} footerData={footerNav} />
      <FloatingAppointmentWidget lang={lang} dict={dict} />
    </>
  );
}

