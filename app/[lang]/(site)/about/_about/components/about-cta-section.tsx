import Link from 'next/link';
import type { Dictionary } from '@dictionaries';
import { ctaSectionWrapper, ctaCard, ctaHeading, ctaDescription, btnCrimson, btnArrowIcon } from '@shared';

export function AboutCtaSection({ lang, dict }: { lang: string; dict: Dictionary }) {
  return (
    <section className={ctaSectionWrapper}>
      <div className={ctaCard}>
        <h2 className={ctaHeading}>
          {dict.growthServices.bannerText}
        </h2>
        <p className={ctaDescription}>
          Partner with a dedicated growth team committed to scaling your brand profitably.
        </p>
        <div className="mt-8">
          <Link
            href={`/${lang}/contact`}
            className={btnCrimson}
          >
            <span>{dict.common.getInTouch}</span>
            <span className={btnArrowIcon}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

