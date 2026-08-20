import { getDictionary, hasLocale } from '../dictionaries';
import { notFound } from 'next/navigation';
import { DashboardSidebar, DashboardHeader } from './_shared/components';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DashboardSidebar lang={lang} dict={dict} />

      {/* Main Content */}
      <div className="flex-1">
        <DashboardHeader dict={dict} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
