import type { Dictionary } from '@dictionaries';
import { heroSectionWrapper, heroContainer, badgePill, heroHeading, heroDescription } from '@shared';

export function WorkHeroSection({ dict }: { dict: Dictionary }) {
  return (
    <section className={heroSectionWrapper}>
      <div className={heroContainer}>
        <span className={badgePill}>Proven Outcomes</span>
        <h1 className={heroHeading}>{dict.work.title}</h1>
        <p className={heroDescription}>{dict.work.description}</p>
      </div>
    </section>
  );
}

