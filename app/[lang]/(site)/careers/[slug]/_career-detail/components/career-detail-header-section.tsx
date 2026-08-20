import { heroSectionWrapper, heroContainer, badgePill, heroHeading, sectionSubtitle } from '@shared';

export function CareerDetailHeaderSection({ slug }: { slug: string }) {
  const formattedTitle = slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return (
    <section className={heroSectionWrapper}>
      <div className={heroContainer}>
        <span className={badgePill}>Career Opportunity</span>
        <h1 className={heroHeading}>{formattedTitle}</h1>
        <p className={sectionSubtitle}>
          Full-Time • Competitive Compensation & Growth Equity
        </p>
      </div>
    </section>
  );
}

