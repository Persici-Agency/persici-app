import Link from 'next/link';
import type { Dictionary } from '@dictionaries';

export type GrowthServicesSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function GrowthServicesSection({ lang, dict }: GrowthServicesSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-primary text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {dict.growthServices.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex text-amber-500 text-sm">{'★★★★★'}</div>
          <span className="text-xs font-semibold text-foreground/70">
            {dict.growthServices.rating}
          </span>
        </div>
      </div>

      {/* 3 Service Cards */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Paid Social */}
        <div className="group rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition-all duration-300 hover:border-persici-crimson/30 hover:shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-persici-crimson">
            <span className="inline-block h-2 w-2 rounded-full bg-persici-crimson" />
            {dict.growthServices.paidSocial.tag}
          </div>
          <h3 className="mt-4 font-primary text-xl font-bold text-foreground">
            {dict.growthServices.paidSocial.title}
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-foreground/70 sm:text-sm">
            {dict.growthServices.paidSocial.description}
          </p>
        </div>

        {/* Card 2: Google Ads */}
        <div className="group rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition-all duration-300 hover:border-persici-crimson/30 hover:shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            {dict.growthServices.googleAds.tag}
          </div>
          <h3 className="mt-4 font-primary text-xl font-bold text-foreground">
            {dict.growthServices.googleAds.title}
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-foreground/70 sm:text-sm">
            {dict.growthServices.googleAds.description}
          </p>
        </div>

        {/* Card 3: Shopify & CRO */}
        <div className="group rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition-all duration-300 hover:border-persici-crimson/30 hover:shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            {dict.growthServices.shopify.tag}
          </div>
          <h3 className="mt-4 font-primary text-xl font-bold text-foreground">
            {dict.growthServices.shopify.title}
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-foreground/70 sm:text-sm">
            {dict.growthServices.shopify.description}
          </p>
        </div>
      </div>

      {/* Bottom Banner Strip */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white px-6 py-4 shadow-sm sm:flex-row">
        <p className="font-primary text-sm font-semibold text-foreground">
          {dict.growthServices.bannerText}
        </p>
        <Link
          href={`/${lang}/contact`}
          className="inline-flex items-center gap-2 rounded-full bg-persici-black px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-persici-crimson hover:shadow-md"
        >
          <span>{dict.growthServices.bannerCta}</span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
