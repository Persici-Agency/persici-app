import React from 'react';
import { NotFoundTemplate } from '../_components/not-found-template';

export const metadata = {
  title: '404 - Page Not Found | Persici Agency',
  description: 'The requested page could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CatchAllNotFound({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <NotFoundTemplate forcedLang={lang} />;
}
