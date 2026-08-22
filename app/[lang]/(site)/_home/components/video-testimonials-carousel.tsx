'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { FadeUp } from '@shared/components';
import { getHomeVideoTestimonials } from '../services';
import type { VideoTestimonialItem } from '@shared/types';
import { sectionHeading } from '../../_shared';

export interface VideoTestimonialsCarouselProps {
  dict: Dictionary;
  testimonials?: VideoTestimonialItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  cardsPerPage?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export function VideoTestimonialsCarousel({
  dict,
  testimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
  pauseOnHover = true,
  cardsPerPage = 3,
  showDots = true,
  showArrows = true,
}: VideoTestimonialsCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<VideoTestimonialItem | null>(null);

  const baseItems = testimonials || getHomeVideoTestimonials();

  // Combine database items with dictionary localization if available
  const items = baseItems.map((item, idx) => {
    const dictKey = `client${idx + 1}` as keyof typeof dict.clientVideos;
    const localized = (dict.clientVideos?.[dictKey] || {}) as Partial<VideoTestimonialItem>;
    return {
      ...item,
      name: localized.name || item.name,
      role: localized.role || item.role,
      company: localized.company || item.company,
      quote: localized.quote || item.quote,
    };
  });

  const totalPages = Math.ceil(items.length / cardsPerPage);

  const prev = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage === 0 ? totalPages - 1 : prevPage - 1));
  }, [totalPages]);

  const next = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage === totalPages - 1 ? 0 : prevPage + 1));
  }, [totalPages]);

  // Autoplay timer with pause on hover & modal pause
  useEffect(() => {
    if (!autoPlay || isPaused || activeModalItem !== null || totalPages <= 1) {
      return;
    }

    const timer = setInterval(() => {
      next();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isPaused, activeModalItem, totalPages, next]);

  // Handle escape key to close video modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalItem(null);
      }
    };

    if (activeModalItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeModalItem]);

  // Get current page slice (3 cards per page)
  const currentItems = items.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  return (
    <div
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      className="relative"
    >
      {/* Header with Navigation Controls */}
      <FadeUp delay={0} duration={750} distance={20}>
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className={sectionHeading + ' text-white'}>
              {dict.clientVideos.title}
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Page {currentPage + 1} of {totalPages} • {items.length} Client Stories
            </p>
          </div>

          {showArrows && totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all hover:scale-105 hover:border-persici-crimson hover:bg-persici-crimson hover:text-white cursor-pointer active:scale-95"
                aria-label="Previous 3 clients"
                title="Previous clients"
              >
                ←
              </button>
              <button
                type="button"
                onClick={next}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all hover:scale-105 hover:border-persici-crimson hover:bg-persici-crimson hover:text-white cursor-pointer active:scale-95"
                aria-label="Next 3 clients"
                title="Next clients"
              >
                →
              </button>
            </div>
          )}
        </div>
      </FadeUp>

      {/* 3 Video Cards Grid for Current Page */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentItems.map((item, idx) => (
          <FadeUp
            key={item.id || `${currentPage}-${idx}`}
            delay={idx * 100}
            duration={600}
            distance={20}
            className="h-full"
          >
            <div
              onClick={() => setActiveModalItem(item)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-persici-crimson/60 hover:shadow-2xl hover:shadow-persici-crimson/15"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveModalItem(item);
                }
              }}
              aria-label={`Watch testimonial video from ${item.name}`}
            >
              {/* Background Image Container with 4:5 Portrait Aspect */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Ambient Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />

                {/* Top Header: Category & Play Badge */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                  {item.category && (
                    <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md border border-white/10">
                      {item.category}
                    </span>
                  )}
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-persici-crimson text-white shadow-lg shadow-persici-crimson/40 transition-all duration-300 group-hover:scale-115 group-hover:bg-white group-hover:text-persici-crimson ms-auto">
                    <svg className="h-4 w-4 fill-current ms-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                  <blockquote className="text-xs font-medium leading-relaxed text-white/95 sm:text-sm line-clamp-3">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
                    <div>
                      <div className="text-sm font-bold text-white font-primary">{item.name}</div>
                      <div className="text-xs text-white/60">
                        {item.role}, <span className="font-medium text-persici-blush">{item.company}</span>
                      </div>
                    </div>
                    {item.duration && (
                      <span className="text-[11px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {item.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Page Dots Indicator (Moves 3 Cards per Dot) */}
      {showDots && totalPages > 1 && (
        <FadeUp delay={300} duration={600} distance={15}>
          <div className="mt-10 flex items-center justify-center gap-2.5">
            {Array.from({ length: totalPages }).map((_, pageIdx) => (
              <button
                key={pageIdx}
                type="button"
                onClick={() => setCurrentPage(pageIdx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentPage === pageIdx
                  ? 'w-8 bg-persici-crimson shadow-sm shadow-persici-crimson/50'
                  : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                aria-label={`Jump to page ${pageIdx + 1} (clients ${pageIdx * cardsPerPage + 1} to ${Math.min((pageIdx + 1) * cardsPerPage, items.length)})`}
              />
            ))}
          </div>
        </FadeUp>
      )}

      {/* Interactive Video Popup Modal */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Video player for ${activeModalItem.name}`}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-neutral-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 end-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white hover:text-black cursor-pointer"
              aria-label="Close video"
            >
              ✕
            </button>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              {activeModalItem.videoUrl ? (
                <video
                  src={activeModalItem.videoUrl}
                  controls
                  autoPlay
                  poster={activeModalItem.image}
                  className="h-full w-full object-cover"
                >
                  Your browser does not support HTML video playback.
                </video>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-white">
                  <div className="text-center p-6">
                    <p className="text-lg font-bold">Video Preview</p>
                    <p className="text-sm text-white/60 mt-1">Full video testimonial coming soon.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Details & Speaker Meta */}
            <div className="p-6 sm:p-8 bg-neutral-950 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                {activeModalItem.category && (
                  <span className="rounded-full bg-persici-crimson/15 px-3 py-1 text-xs font-semibold text-persici-blush border border-persici-crimson/30">
                    {activeModalItem.category}
                  </span>
                )}
                {activeModalItem.duration && (
                  <span className="text-xs font-mono text-white/50">
                    Duration: {activeModalItem.duration}
                  </span>
                )}
              </div>

              <blockquote className="text-sm sm:text-base font-medium leading-relaxed text-white/95">
                &ldquo;{activeModalItem.quote}&rdquo;
              </blockquote>

              <div className="mt-6 flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/20">
                  <Image
                    src={activeModalItem.image}
                    alt={activeModalItem.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-base font-bold text-white font-primary">
                    {activeModalItem.name}
                  </div>
                  <div className="text-xs sm:text-sm text-white/60">
                    {activeModalItem.role} • <span className="text-persici-blush font-semibold">{activeModalItem.company}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
