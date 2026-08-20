import { createMetadata } from '../../../_lib/metadata';
import type { Locale } from '../../../_lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/dashboard/projects'>) {
  const { lang } = await params;
  return createMetadata({ title: 'Projects', locale: lang as Locale, path: '/dashboard/projects', noIndex: true });
}

export default async function ProjectsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">Projects</h2>
      <p className="mt-2 text-foreground/60">Manage portfolio projects and case studies.</p>
    </div>
  );
}
