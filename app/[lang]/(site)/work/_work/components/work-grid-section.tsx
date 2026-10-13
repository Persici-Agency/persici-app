import Image from 'next/image';
import Link from 'next/link';
import { fetchProjectsList } from '../services';
import { sectionContainer, sectionPaddingY } from '@shared';

function resolveLoc(val: unknown, isAr: boolean): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    const obj = val as { en?: string; ar?: string };
    return isAr ? obj.ar || obj.en || '' : obj.en || obj.ar || '';
  }
  return String(val);
}

export async function WorkGridSection({ lang }: { lang: string }) {
  const projects = await fetchProjectsList();
  const isAr = lang === 'ar';

  return (
    <section className={`${sectionContainer} ${sectionPaddingY}`}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {projects.map((proj) => {
          const title = resolveLoc(proj.title, isAr);
          const category = resolveLoc(proj.category, isAr);
          const description = resolveLoc(proj.description, isAr);
          const result = resolveLoc(proj.result, isAr);
          const image = typeof proj.image === 'string' && proj.image ? proj.image : '/images/logo-icon.png';

          return (
            <Link
              key={proj.slug}
              href={`/${lang}/work/${proj.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:border-persici-crimson/30 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {result && (
                  <div className="absolute top-4 start-4 rounded-full bg-persici-black/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                    {result}
                  </div>
                )}
              </div>
              <div className="p-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-persici-crimson">
                  {category}
                </span>
                <h3 className="mt-2 font-primary text-2xl font-medium text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-foreground/70 sm:text-sm">
                  {description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-persici-crimson">
                  <span>{isAr ? 'عرض دراسة الحالة' : 'View case study'}</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
