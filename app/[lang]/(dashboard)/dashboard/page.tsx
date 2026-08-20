import { getDictionary, hasLocale } from '../../dictionaries';
import { notFound } from 'next/navigation';
import { createMetadata } from '../../_lib/metadata';
import type { Locale } from '../../_lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/dashboard'>) {
  const { lang } = await params;
  return createMetadata({
    title: 'Dashboard',
    locale: lang as Locale,
    path: '/dashboard',
    noIndex: true,
  });
}

export default async function DashboardPage({ params }: PageProps<'/[lang]/dashboard'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">{dict.dashboard.overview}</h2>
      <p className="mt-2 text-foreground/60">Dashboard overview — statistics and quick actions will appear here.</p>
      {/* Dashboard widgets will be added when API integration is ready */}
    </div>
  );
}
