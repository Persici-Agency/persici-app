import type { Dictionary } from '@dictionaries';
import { VideoTestimonialsCarousel } from './video-testimonials-carousel';
import { sectionContainer, sectionPaddingY } from '@shared';

export type ClientsVideoSectionProps = {
  dict: Dictionary;
};

export function ClientsVideoSection({ dict }: ClientsVideoSectionProps) {
  return (
    <section className={`bg-persici-black ${sectionPaddingY} text-white`}>
      <div className={sectionContainer}>
        <VideoTestimonialsCarousel dict={dict} />
      </div>
    </section>
  );
}
