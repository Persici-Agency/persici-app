import type { Dictionary } from '@dictionaries';
import { VideoPreviewModal } from './video-modal';
import { DarkTestimonialCard } from './dark-testimonial-card';
import { sectionContainer, sectionPaddingY, FadeUp, sectionHeading, sectionPaddingBottom } from '@shared';

export type PartnerShowcaseSectionProps = {
  dict: Dictionary;
};

export function PartnerShowcaseSection({ dict }: PartnerShowcaseSectionProps) {
  return (
    <section className={`${sectionContainer} ${sectionPaddingBottom}`}>
      <FadeUp delay={0} duration={750} distance={20}>
        <h2 className={sectionHeading + ` text-center font-bold`}>
          {dict.partnerShowcase.title}
        </h2>
      </FadeUp>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Video Showcase Preview */}
        <FadeUp delay={100} duration={800} distance={24} className="lg:col-span-7">
          <VideoPreviewModal dict={dict} />
        </FadeUp>

        {/* Right: Dynamic Multi-Opinion Dark Testimonial Card */}
        <FadeUp delay={200} duration={800} distance={24} className="lg:col-span-5">
          <DarkTestimonialCard dict={dict} />
        </FadeUp>
      </div>
    </section>
  );
}

