import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-primary text-6xl font-bold text-persici-crimson">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-foreground">
        Page Not Found
      </h2>
      <p className="mt-2 text-foreground/60">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-persici-crimson px-6 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
      >
        Back to Home
      </Link>
    </div>
  );
}
