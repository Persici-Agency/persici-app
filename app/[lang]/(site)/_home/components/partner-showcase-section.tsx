import type { Dictionary } from '@dictionaries';
import { VideoPreviewModal } from './video-modal';
import { DarkTestimonialCard } from './dark-testimonial-card';
import { sectionContainer } from '@shared';

export type PartnerShowcaseSectionProps = {
  dict: Dictionary;
};

export function PartnerShowcaseSection({ dict }: PartnerShowcaseSectionProps) {
  return (
    <section className={`${sectionContainer} py-12`}>
      <h2 className="text-center font-primary text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        {dict.partnerShowcase.title}
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Video Showcase Preview */}
        <div className="lg:col-span-7">
          <VideoPreviewModal dict={dict} />
        </div>

        {/* Right: Dynamic Multi-Opinion Dark Testimonial Card */}
        <DarkTestimonialCard dict={dict} className="lg:col-span-5" />
      </div>
    </section>
  );
}
