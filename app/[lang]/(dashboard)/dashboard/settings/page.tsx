import { createMetadata } from '../../../_lib/metadata';
import type { Locale } from '../../../_lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/dashboard/settings'>) {
  const { lang } = await params;
  return createMetadata({ title: 'Settings', locale: lang as Locale, path: '/dashboard/settings', noIndex: true });
}

export default async function SettingsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">Settings</h2>
      <p className="mt-2 text-foreground/60">Configure site settings, SEO defaults, and admin preferences.</p>
    </div>
  );
}
