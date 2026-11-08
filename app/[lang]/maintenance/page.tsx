import React from 'react';
import { MaintenanceTemplate } from '../_components/maintenance-template';
import { getMaintenanceConfig } from '@/lib/maintenance-server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'System Maintenance | Persici - Specialized in AI and Digital Transformation',
  description:
    'We are currently performing scheduled infrastructure maintenance. We will be back online shortly.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MaintenancePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const config = await getMaintenanceConfig();

  return <MaintenanceTemplate forcedLang={lang} initialConfig={config} />;
}
