import { getAboutValues } from '../services';
import { sectionContainer, sectionPaddingY, sectionHeading, sectionSubtitle, baseCard } from '@shared';

export function AboutValuesSection() {
  const values = getAboutValues();

  return (
    <section className={`bg-persici-black/[0.02] ${sectionPaddingY}`}>
      <div className={sectionContainer}>
        <div className="text-center">
          <h2 className={sectionHeading}>
            Our Core Principles
          </h2>
          <p className={sectionSubtitle}>
            The foundation behind every growth breakthrough we engineer.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div
              key={i}
              className={baseCard}
            >
              <div className="text-3xl">{v.icon}</div>
              <h3 className="mt-4 font-primary text-lg font-bold text-foreground">
                {v.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-foreground/70">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

