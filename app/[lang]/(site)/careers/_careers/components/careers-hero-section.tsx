import type { Dictionary } from '@dictionaries';
import { heroSectionWrapper, heroContainer, badgePill, heroHeading, heroDescription } from '@shared';

export function CareersHeroSection({ dict }: { dict: Dictionary }) {
  return (
    <section className={heroSectionWrapper}>
      <div className={heroContainer}>
        <span className={badgePill}>Join Persici</span>
        <h1 className={heroHeading}>{dict.careers.title}</h1>
        <p className={heroDescription}>{dict.careers.description}</p>
      </div>
    </section>
  );
}

