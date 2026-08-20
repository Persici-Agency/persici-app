import Link from 'next/link';
import { getServicesList } from '../services';
import { sectionContainer, featureCard } from '@shared';

export function ServicesGridSection({ lang }: { lang: string }) {
  const services = getServicesList();

  return (
    <section className={`${sectionContainer} py-12`}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {services.map((svc) => (
          <div
            key={svc.slug}
            className={featureCard}
          >
            <div>
              <div className="text-3xl">{svc.icon}</div>
              <h3 className="mt-4 font-primary text-2xl font-bold text-foreground">
                {svc.titleKey}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                {svc.descriptionKey}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/5">
              <Link
                href={`/${lang}/services/${svc.slug}`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-persici-crimson transition-transform group-hover:translate-x-1"
              >
                <span>Learn more about {svc.titleKey}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

