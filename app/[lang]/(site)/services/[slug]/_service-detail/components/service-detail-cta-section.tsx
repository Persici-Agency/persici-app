import Link from 'next/link';
import { ctaSectionWrapper, ctaCard, ctaHeading, ctaDescription, btnCrimson, btnDarkOutline, btnArrowIcon } from '@shared';

export function ServiceDetailCtaSection({ lang }: { lang: string }) {
  return (
    <section className={ctaSectionWrapper}>
      <div className={ctaCard}>
        <h2 className={ctaHeading}>
          Ready to implement this for your brand?
        </h2>
        <p className={ctaDescription}>
          Book a 30-minute discovery session with our growth directors.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href={`/${lang}/contact`}
            className={btnCrimson}
          >
            <span>Book a call</span>
            <span className={btnArrowIcon}>→</span>
          </Link>
          <Link
            href={`/${lang}/services`}
            className={btnDarkOutline}
          >
            <span>All Services</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

