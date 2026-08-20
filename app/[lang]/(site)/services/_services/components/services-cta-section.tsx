import Link from 'next/link';
import type { Dictionary } from '@dictionaries';
import { ctaSectionWrapper, ctaCard, ctaHeading, ctaDescription, btnCrimson, btnArrowIcon } from '@shared';

export function ServicesCtaSection({ lang, dict }: { lang: string; dict: Dictionary }) {
  return (
    <section className={ctaSectionWrapper}>
      <div className={ctaCard}>
        <h2 className={ctaHeading}>
          {dict.growthServices.bannerText}
        </h2>
        <p className={ctaDescription}>
          Book a free 30-minute discovery call to map your brand&apos;s tailored growth blueprint.
        </p>
        <div className="mt-8">
          <Link
            href={`/${lang}/contact`}
            className={btnCrimson}
          >
            <span>{dict.growthServices.bannerCta}</span>
            <span className={btnArrowIcon}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

