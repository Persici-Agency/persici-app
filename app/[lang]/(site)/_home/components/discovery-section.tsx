import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { DiscoveryCallForm } from './discovery-form';
import { sectionContainer, sectionPaddingY, FadeUp } from '@shared';

export type DiscoverySectionProps = {
  dict: Dictionary;
};

export function DiscoverySection({ dict }: DiscoverySectionProps) {
  return (
    <section className={`${sectionContainer} ${sectionPaddingY}`}>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left Column: Heading & Pull Quote */}
        <FadeUp delay={0} duration={800} distance={24} className="lg:col-span-5">
          <h2 className="font-primary text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {dict.discovery.title}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-foreground/75 sm:text-base">
            {dict.discovery.desc}
          </p>

          {/* Testimonial Quote Box */}
          <div className="mt-8 rounded-2xl border border-black/10 bg-persici-black/[0.02] p-5">
            <p className="text-xs italic text-foreground/80 sm:text-sm">
              &ldquo;{dict.discovery.quote}&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt={dict.discovery.quoteAuthor}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">
                  {dict.discovery.quoteAuthor}
                </div>
                <div className="text-[11px] text-foreground/60">
                  {dict.discovery.quoteRole}
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Right Column: Interactive Booking Form */}
        <FadeUp delay={200} duration={800} distance={28} className="lg:col-span-7">
          <DiscoveryCallForm dict={dict} />
        </FadeUp>
      </div>
    </section>
  );
}

