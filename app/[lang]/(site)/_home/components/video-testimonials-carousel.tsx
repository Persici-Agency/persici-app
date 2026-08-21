'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { FadeUp } from '@shared/components';

export function VideoTestimonialsCarousel({ dict }: { dict: Dictionary }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = [
    {
      ...dict.clientVideos.client1,
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    },
    {
      ...dict.clientVideos.client2,
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      ...dict.clientVideos.client3,
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const prev = () => {
    setCurrentIndex((prevIdx) => (prevIdx === 0 ? items.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setCurrentIndex((prevIdx) => (prevIdx === items.length - 1 ? 0 : prevIdx + 1));
  };

  return (
    <div>
      {/* Header with Navigation Controls */}
      <FadeUp delay={0} duration={750} distance={20}>
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-primary text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {dict.clientVideos.title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15 cursor-pointer"
              aria-label="Previous client"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15 cursor-pointer"
              aria-label="Next client"
            >
              →
            </button>
          </div>
        </div>
      </FadeUp>

      {/* 3 Video Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item, idx) => (
          <FadeUp key={idx} delay={100 + idx * 120} duration={750} distance={24} className="h-full">
            <div
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 transition-all duration-300 hover:border-persici-crimson/50 hover:shadow-2xl hover:shadow-persici-crimson/10 ${
                currentIndex === idx ? 'ring-2 ring-persici-crimson/40' : ''
              }`}
            >
              {/* Background Image Container with 16:10 Aspect */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Play Button Badge */}
                <div className="absolute top-4 end-4 flex h-10 w-10 items-center justify-center rounded-full bg-persici-crimson text-white shadow-lg transition-transform group-hover:scale-110">
                  <svg className="h-4 w-4 fill-current ms-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <blockquote className="text-xs font-medium leading-relaxed text-white/95 sm:text-sm">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <div className="mt-4 border-t border-white/15 pt-3">
                    <div className="text-xs font-semibold text-white">{item.name}</div>
                    <div className="text-[11px] text-white/60">
                      {item.role}, <span className="text-persici-blush">{item.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Dots Indicator */}
      <FadeUp delay={450} duration={750} distance={15}>
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIndex === i ? 'w-6 bg-persici-crimson' : 'w-1.5 bg-white/20'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </FadeUp>
    </div>
  );
}

