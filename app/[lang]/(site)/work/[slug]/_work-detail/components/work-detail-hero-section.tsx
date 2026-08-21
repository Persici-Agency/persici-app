import { heroSectionWrapper, heroContainer, badgePill, heroHeading, heroDescription } from '@shared';

export function WorkDetailHeroSection({ slug }: { slug: string }) {
  const formattedTitle = slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return (
    <section className={heroSectionWrapper}>
      <div className={heroContainer}>
        <span className={badgePill}>Case Study</span>
        <h1 className={heroHeading}>{formattedTitle}</h1>
        <p className={heroDescription}>
          How we unlocked exponential revenue growth, lowered acquisition costs, and scaled brand equity.
        </p>
      </div>
    </section>
  );
}

