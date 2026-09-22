import { getDictionary, hasLocale } from '@dictionaries';
import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/jwt';
import { DashboardSidebar, DashboardHeader } from '@dashboard-shared/components';

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
  const user = await getSessionUser();

  const isRtl = lang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';

  // If unauthenticated (e.g. login route), render clean full-screen canvas
  if (!user) {
    return (
      <div dir={dir} lang={lang} className={`min-h-screen bg-[#0b0c0e] ${isRtl ? 'font-arabic' : 'font-sans'}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      dir={dir}
      lang={lang}
      className={`flex min-h-screen bg-[#f8fafc] text-slate-900 ${isRtl ? 'font-arabic' : 'font-sans'}`}
    >
      {/* Sidebar with Nested Accordions, Role Awareness, Smooth Collapse & RTL */}
      <DashboardSidebar lang={lang} dict={dict} user={user} />

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <DashboardHeader dict={dict} user={user} lang={lang} />
        <main className="p-4 sm:p-6 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
