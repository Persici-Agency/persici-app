import type { Dictionary } from '../../../dictionaries';
import { VideoTestimonialsCarousel } from './video-testimonials-carousel';

export type ClientsVideoSectionProps = {
  dict: Dictionary;
};

export function ClientsVideoSection({ dict }: ClientsVideoSectionProps) {
  return (
    <section className="bg-persici-black py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <VideoTestimonialsCarousel dict={dict} />
      </div>
    </section>
  );
}
