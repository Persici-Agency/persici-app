import Link from 'next/link';
import { ctaSectionWrapper, ctaCard, ctaHeading, ctaDescription, btnCrimson, btnDarkOutline, btnArrowIcon } from '@shared';

export function WorkDetailCtaSection({ lang }: { lang: string }) {
  return (
    <section className={ctaSectionWrapper}>
      <div className={ctaCard}>
        <h2 className={ctaHeading}>
          Ready to achieve similar breakthroughs?
        </h2>
        <p className={ctaDescription}>
          Book a 30-minute discovery call to explore our tailored scaling strategy for your brand.
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
            href={`/${lang}/work`}
            className={btnDarkOutline}
          >
            <span>All Case Studies</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

