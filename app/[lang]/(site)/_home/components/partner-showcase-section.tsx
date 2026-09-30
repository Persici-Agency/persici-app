import type { Dictionary } from '@dictionaries';
import { VideoPreviewModal } from './video-modal';
import { DarkTestimonialCard } from './dark-testimonial-card';
import { sectionContainer, sectionPaddingY, FadeUp, sectionHeading, sectionPaddingBottom, cn } from '@shared';

export type PartnerShowcaseSectionProps = {
  lang?: string;
  dict: Dictionary;
  content?: any;
  className?: string;
};

export function PartnerShowcaseSection({ lang, dict, content, className }: PartnerShowcaseSectionProps) {
  const isAr = lang === 'ar';
  const title =
    content?.title?.[lang || 'en'] ||
    (isAr ? content?.titleAr : content?.titleEn) ||
    content?.title ||
    dict.partnerShowcase.title;

  return (
    <section className={cn(`${sectionContainer} ${sectionPaddingBottom}`, className)}>
      <FadeUp delay={0} duration={750} distance={20}>
        <h2 className={sectionHeading + ` text-center font-medium`}>
          {title}
        </h2>
      </FadeUp>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Video Showcase Preview */}
        <FadeUp delay={100} duration={800} distance={24} className="lg:col-span-7">
          <VideoPreviewModal dict={dict} lang={lang} showcase={content} />
        </FadeUp>

        {/* Right: Dynamic Multi-Opinion Dark Testimonial Card */}
        <FadeUp delay={200} duration={800} distance={24} className="lg:col-span-5">
          <DarkTestimonialCard dict={dict} lang={lang} testimonials={content?.testimonials} />
        </FadeUp>
      </div>
    </section>
  );
}

