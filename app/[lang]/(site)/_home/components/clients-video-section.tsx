import type { Dictionary } from '@dictionaries';
import { VideoTestimonialsCarousel } from './video-testimonials-carousel';
import { sectionContainer, sectionPaddingY } from '@shared';

export type ClientsVideoSectionProps = {
  lang?: string;
  dict: Dictionary;
  content?: any;
  testimonials?: any[];
};

export function ClientsVideoSection({ lang, dict, content, testimonials }: ClientsVideoSectionProps) {
  const isAr = lang === 'ar';
  const title =
    content?.title?.[lang || 'en'] ||
    (isAr ? content?.titleAr : content?.titleEn) ||
    content?.title;

  const items = testimonials || content?.videos || (Array.isArray(content) ? content : undefined);

  return (
    <section className={`bg-persici-black ${sectionPaddingY} text-white`}>
      <div className={sectionContainer}>
        <VideoTestimonialsCarousel dict={dict} lang={lang} title={title} testimonials={items} />
      </div>
    </section>
  );
}
