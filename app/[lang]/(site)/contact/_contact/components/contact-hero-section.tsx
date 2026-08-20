import type { Dictionary } from '@dictionaries';
import { heroSectionWrapper, heroContainer, badgePill, heroHeading, heroDescription } from '@shared';

export function ContactHeroSection({ dict }: { dict: Dictionary }) {
  return (
    <section className={heroSectionWrapper}>
      <div className={heroContainer}>
        <span className={badgePill}>Start a Conversation</span>
        <h1 className={heroHeading}>{dict.contact.title}</h1>
        <p className={heroDescription}>{dict.contact.description}</p>
      </div>
    </section>
  );
}

