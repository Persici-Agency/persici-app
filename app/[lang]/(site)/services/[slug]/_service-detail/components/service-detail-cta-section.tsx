import Link from 'next/link';

export function ServiceDetailCtaSection({ lang }: { lang: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-persici-black px-6 py-16 text-white sm:px-12 sm:py-20">
        <h2 className="font-primary text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ready to implement this for your brand?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/70">
          Book a 30-minute discovery session with our growth directors.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href={`/${lang}/contact`}
            className="inline-flex items-center gap-2 rounded-full bg-persici-crimson px-8 py-3.5 text-xs font-semibold text-white shadow-lg shadow-persici-crimson/25 transition-all hover:bg-persici-crimson-80 hover:shadow-xl"
          >
            <span>Book a call</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
              →
            </span>
          </Link>
          <Link
            href={`/${lang}/services`}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
          >
            <span>All Services</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
