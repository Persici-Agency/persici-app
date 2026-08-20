import { getAboutValues } from '../services';

export function AboutValuesSection() {
  const values = getAboutValues();

  return (
    <section className="bg-persici-black/[0.02] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-primary text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Our Core Principles
          </h2>
          <p className="mt-4 text-sm text-foreground/60">
            The foundation behind every growth breakthrough we engineer.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div
              key={i}
              className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:shadow-md"
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
