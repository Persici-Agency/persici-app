'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-primary text-4xl font-bold text-persici-crimson">
        Something went wrong
      </h1>
      <p className="mt-4 text-foreground/60">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-block rounded-full bg-persici-crimson px-6 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
      >
        Try Again
      </button>
    </div>
  );
}
