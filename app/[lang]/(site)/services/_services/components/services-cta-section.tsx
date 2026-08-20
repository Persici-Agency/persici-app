import Link from 'next/link';
import type { Dictionary } from '@dictionaries';

export function ServicesCtaSection({ lang, dict }: { lang: string; dict: Dictionary }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-persici-black px-6 py-16 text-white sm:px-12 sm:py-20">
        <h2 className="font-primary text-3xl font-extrabold tracking-tight sm:text-4xl">
          {dict.growthServices.bannerText}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/70">
          Book a free 30-minute discovery call to map your brand&apos;s tailored growth blueprint.
        </p>
        <div className="mt-8">
          <Link
            href={`/${lang}/contact`}
            className="inline-flex items-center gap-2 rounded-full bg-persici-crimson px-8 py-3.5 text-xs font-semibold text-white shadow-lg shadow-persici-crimson/25 transition-all hover:bg-persici-crimson-80 hover:shadow-xl"
          >
            <span>{dict.growthServices.bannerCta}</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
