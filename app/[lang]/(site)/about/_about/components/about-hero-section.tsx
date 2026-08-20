import type { Dictionary } from '@dictionaries';

export function AboutHeroSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative pt-12 pb-16 text-center sm:pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <span className="inline-block rounded-full bg-persici-crimson/10 px-3.5 py-1 text-xs font-semibold text-persici-crimson">
          Persici Agency
        </span>
        <h1 className="mt-4 font-primary text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {dict.about.title}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-foreground/70 sm:text-lg">
          {dict.about.description}
        </p>
      </div>
    </section>
  );
}
