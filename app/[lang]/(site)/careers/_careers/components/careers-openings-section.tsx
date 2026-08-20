import Link from 'next/link';
import { getJobOpenings } from '../services';

export function CareersOpeningsSection({ lang }: { lang: string }) {
  const openings = getJobOpenings();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="font-primary text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Open Positions
        </h2>
        <p className="mt-4 text-sm text-foreground/60">
          Work with high-caliber brands across the Middle East, Scandinavia, and Europe.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {openings.map((job) => (
          <Link
            key={job.slug}
            href={`/${lang}/careers/${job.slug}`}
            className="group flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition-all duration-300 hover:border-persici-crimson/30 hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-foreground/60">
                <span className="font-semibold text-persici-crimson">{job.department}</span>
                <span className="rounded-full bg-black/5 px-2.5 py-1">{job.type}</span>
              </div>
              <h3 className="mt-4 font-primary text-xl font-bold text-foreground transition-colors group-hover:text-persici-crimson">
                {job.title}
              </h3>
              <p className="mt-2 text-xs text-foreground/60">
                📍 {job.location}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 border-t border-black/5 pt-4 text-xs font-semibold text-persici-crimson">
              <span>View details & apply</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
