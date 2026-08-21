import { heroSectionWrapper, heroContainer, badgePill, heroHeading, sectionSubtitle } from '@shared';

export function InsightDetailHeaderSection({ slug }: { slug: string }) {
  const formattedTitle = slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return (
    <section className={heroSectionWrapper}>
      <div className={heroContainer}>
        <span className={badgePill}>Growth Insight</span>
        <h1 className={heroHeading}>{formattedTitle}</h1>
        <p className={sectionSubtitle}>
          Published by Persici Growth Team • 5 min read
        </p>
      </div>
    </section>
  );
}

