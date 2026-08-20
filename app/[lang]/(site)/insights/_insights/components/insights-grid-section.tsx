import Link from 'next/link';
import { getInsightsArticles } from '../services';

export function InsightsGridSection({ lang }: { lang: string }) {
  const articles = getInsightsArticles();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {articles.map((art) => (
          <Link
            key={art.slug}
            href={`/${lang}/insights/${art.slug}`}
            className="group flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition-all duration-300 hover:border-persici-crimson/30 hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-foreground/60">
                <span className="font-semibold text-persici-crimson">{art.category}</span>
                <span>{art.readTime}</span>
              </div>
              <h3 className="mt-4 font-primary text-xl font-bold text-foreground transition-colors group-hover:text-persici-crimson">
                {art.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-foreground/70 sm:text-sm">
                {art.excerpt}
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-4 text-xs font-semibold text-foreground/80">
              <span>{art.date}</span>
              <span className="text-persici-crimson">Read article →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
