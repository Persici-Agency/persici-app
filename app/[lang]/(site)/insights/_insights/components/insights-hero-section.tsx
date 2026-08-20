import type { Dictionary } from '@dictionaries';
import { heroSectionWrapper, heroContainer, badgePill, heroHeading, heroDescription } from '@shared';

export function InsightsHeroSection({ dict }: { dict: Dictionary }) {
  return (
    <section className={heroSectionWrapper}>
      <div className={heroContainer}>
        <span className={badgePill}>Persici Intelligence</span>
        <h1 className={heroHeading}>{dict.insights.title}</h1>
        <p className={heroDescription}>{dict.insights.description}</p>
      </div>
    </section>
  );
}

