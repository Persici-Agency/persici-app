import type { Dictionary } from '@dictionaries';
import { heroSectionWrapper, heroContainer, badgePill, heroHeading, heroDescription } from '@shared';

export function AboutHeroSection({ dict }: { dict: Dictionary }) {
  return (
    <section className={`relative ${heroSectionWrapper}`}>
      <div className={heroContainer}>
        <span className={badgePill}>Persici Agency</span>
        <h1 className={heroHeading}>{dict.about.title}</h1>
        <p className={heroDescription}>{dict.about.description}</p>
      </div>
    </section>
  );
}

