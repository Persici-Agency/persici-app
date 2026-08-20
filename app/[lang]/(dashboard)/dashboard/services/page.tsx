import { createMetadata } from '../../../_lib/metadata';
import type { Locale } from '../../../_lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/dashboard/services'>) {
  const { lang } = await params;
  return createMetadata({ title: 'Services Management', locale: lang as Locale, path: '/dashboard/services', noIndex: true });
}

export default async function ServicesManagementPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">Services Management</h2>
      <p className="mt-2 text-foreground/60">Add, edit, and manage agency services.</p>
    </div>
  );
}
