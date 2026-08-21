import { heroSectionWrapper, heroContainer, badgePill, heroHeading, heroDescription } from '@shared';

export function ServiceDetailHeroSection({ slug }: { slug: string }) {
  const formattedTitle = slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return (
    <section className={heroSectionWrapper}>
      <div className={heroContainer}>
        <span className={badgePill}>Service Deep Dive</span>
        <h1 className={heroHeading}>{formattedTitle}</h1>
        <p className={heroDescription}>
          Tailored growth systems, technical engineering, and continuous performance optimization designed for scalable eCommerce outcomes.
        </p>
      </div>
    </section>
  );
}

