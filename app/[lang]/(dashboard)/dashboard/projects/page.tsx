import { redirect } from 'next/navigation';

export default async function LegacyProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/dashboard/content/projects`);
}
