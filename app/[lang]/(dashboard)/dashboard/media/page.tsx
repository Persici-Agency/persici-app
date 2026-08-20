import { createMetadata } from '../../../_lib/metadata';
import type { Locale } from '../../../_lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/dashboard/media'>) {
  const { lang } = await params;
  return createMetadata({ title: 'Media Library', locale: lang as Locale, path: '/dashboard/media', noIndex: true });
}

export default async function MediaPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">Media Library</h2>
      <p className="mt-2 text-foreground/60">Upload and manage images, videos, and documents. Images are automatically optimized.</p>
    </div>
  );
}
