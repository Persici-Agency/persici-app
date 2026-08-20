import { createMetadata } from '../../../_lib/metadata';
import type { Locale } from '../../../_lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/dashboard/content'>) {
  const { lang } = await params;
  return createMetadata({ title: 'Content Management', locale: lang as Locale, path: '/dashboard/content', noIndex: true });
}

export default async function ContentPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">Content Management</h2>
      <p className="mt-2 text-foreground/60">Manage website content, hero sections, and page copy.</p>
    </div>
  );
}
