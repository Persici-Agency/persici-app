import { notFound } from 'next/navigation';

export const metadata = {
  title: '404 - Page Not Found | Persici Agency',
  description: 'The requested page could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CatchAllNotFound() {
  notFound();
}
