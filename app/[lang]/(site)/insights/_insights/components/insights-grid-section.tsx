import Link from 'next/link';
import { getInsightsArticles } from '../services';
import { sectionContainer, featureCard } from '@shared';

export function InsightsGridSection({ lang }: { lang: string }) {
  const articles = getInsightsArticles();

  return (
    <section className={`${sectionContainer} py-12`}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {articles.map((art) => (
          <Link
            key={art.slug}
            href={`/${lang}/insights/${art.slug}`}
            className={featureCard}
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

