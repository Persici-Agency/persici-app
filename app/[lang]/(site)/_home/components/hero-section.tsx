import Image from 'next/image';
import Link from 'next/link';
import type { Dictionary } from '../../../dictionaries';
import { getClientLogos } from '../services';

export type HeroSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function HeroSection({ lang, dict }: HeroSectionProps) {
  const clientLogos = getClientLogos();

  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Subtle Ambient Radial Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
        <div className="h-[480px] w-[800px] rounded-full bg-gradient-to-b from-persici-blush/25 via-persici-crimson/10 to-transparent blur-3xl opacity-70" />
      </div>

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Main Headline */}
        <h1 className="font-primary text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
          {dict.hero.title}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base lg:text-lg">
          {dict.hero.subtitle}
        </p>

        {/* CTA & Rating Row */}
        <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
          <Link
            href={`/${lang}/contact`}
            className="inline-flex items-center gap-2 rounded-full bg-persici-crimson px-7 py-3.5 text-xs font-semibold text-white shadow-lg shadow-persici-crimson/25 transition-all hover:bg-persici-crimson-80 hover:shadow-xl active:scale-98 sm:text-sm"
          >
            <span>{dict.hero.cta}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
              →
            </span>
          </Link>

          {/* Rating / Avatar Social Proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Client avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Client avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                  alt="Client avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                  alt="Client avatar"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="text-start">
              <div className="flex items-center text-amber-500 text-xs">
                {'★★★★★'}
              </div>
              <span className="text-[11px] font-medium text-foreground/70">
                {dict.hero.ratingLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Logos Strip */}
      <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-foreground/40">
          {dict.hero.trustedBy}
        </p>
        <div className="mt-8 grid grid-cols-3 items-center justify-center gap-6 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
          {clientLogos.map((client) => (
            <div
              key={client.name}
              className="group flex h-12 items-center justify-center rounded-xl p-2 transition-all"
              title={client.name}
            >
              <Image
                src={client.src}
                alt={client.name}
                width={110}
                height={40}
                className="max-h-8 w-auto object-contain opacity-50 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
