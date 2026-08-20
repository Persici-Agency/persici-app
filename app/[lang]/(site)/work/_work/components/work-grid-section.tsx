import Image from 'next/image';
import Link from 'next/link';
import { getProjectsList } from '../services';

export function WorkGridSection({ lang }: { lang: string }) {
  const projects = getProjectsList();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {projects.map((proj) => (
          <Link
            key={proj.slug}
            href={`/${lang}/work/${proj.slug}`}
            className="group flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:border-persici-crimson/30 hover:shadow-xl"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
              <Image
                src={proj.image}
                alt={proj.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 start-4 rounded-full bg-persici-black/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                {proj.result}
              </div>
            </div>
            <div className="p-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-persici-crimson">
                {proj.category}
              </span>
              <h3 className="mt-2 font-primary text-2xl font-bold text-foreground">
                {proj.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-foreground/70 sm:text-sm">
                {proj.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-persici-crimson">
                <span>View case study</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
