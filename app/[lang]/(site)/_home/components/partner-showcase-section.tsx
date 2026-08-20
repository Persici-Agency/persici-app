import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { VideoPreviewModal } from './video-modal';
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

        {/* Right: Dark Testimonial Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-black/5 bg-persici-black p-8 text-white shadow-xl lg:col-span-5 lg:p-10">
          <div>
            {/* Card Header: Avatar & Client Logo Badge */}
            <div className="flex items-center justify-between">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/20">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt={dict.partnerShowcase.author}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-primary text-base font-bold tracking-wider text-white/90">
                {dict.partnerShowcase.company}
              </span>
            </div>

            {/* Bold Testimonial Quote */}
            <blockquote className="mt-8 text-base font-normal leading-relaxed text-white/90 sm:text-lg">
              &ldquo;{dict.partnerShowcase.quote}&rdquo;
            </blockquote>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4">
            <div className="text-xs font-semibold text-white">
              {dict.partnerShowcase.author}
            </div>
            <div className="text-[11px] text-white/60">
              {dict.partnerShowcase.role}
            </div>

            {/* Slide dots simulation */}
            <div className="mt-4 flex gap-1.5">
              <span className="h-1.5 w-6 rounded-full bg-persici-crimson" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
