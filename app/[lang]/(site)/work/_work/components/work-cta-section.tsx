import Link from 'next/link';
import type { Dictionary } from '@dictionaries';
import { ctaSectionWrapper, ctaCard, ctaHeading, ctaDescription, btnCrimson, btnArrowIcon } from '@shared';

export function WorkCtaSection({ lang, dict }: { lang: string; dict: Dictionary }) {
  return (
    <section className={ctaSectionWrapper}>
      <div className={ctaCard}>
        <h2 className={ctaHeading}>
          Want results like these for your brand?
        </h2>
        <p className={ctaDescription}>
          Let&apos;s build a custom growth engine tailored to your unit economics and scale goals.
        </p>
        <div className="mt-8">
          <Link
            href={`/${lang}/contact`}
            className={btnCrimson}
          >
            <span>{dict.hero.cta}</span>
            <span className={btnArrowIcon}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

