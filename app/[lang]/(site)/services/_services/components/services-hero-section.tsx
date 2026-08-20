import type { Dictionary } from '@dictionaries';
import { heroSectionWrapper, heroContainer, badgePill, heroHeading, heroDescription } from '@shared';

export function ServicesHeroSection({ dict }: { dict: Dictionary }) {
  return (
    <section className={heroSectionWrapper}>
      <div className={heroContainer}>
        <span className={badgePill}>Full-Funnel Capabilities</span>
        <h1 className={heroHeading}>{dict.services.title}</h1>
        <p className={heroDescription}>{dict.services.description}</p>
      </div>
    </section>
  );
}

