'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Dictionary } from '@dictionaries';
import { cn } from '@shared/utils';
import type { TestimonialItem, DarkTestimonialCardProps } from '@shared/types';
import { getHomeDefaultTestimonials } from '../services';

export type { TestimonialItem, DarkTestimonialCardProps };

export function DarkTestimonialCard({
  dict,
  lang,
  autoPlayInterval = 5000,
  className,
  testimonials: customTestimonials,
}: DarkTestimonialCardProps) {
  const showcase = dict.partnerShowcase;
  const defaultList = getHomeDefaultTestimonials();

  const rawTestimonials =
    customTestimonials ||
    (showcase as unknown as { testimonials?: TestimonialItem[] })?.testimonials ||
    defaultList;

  const isAr = lang === 'ar';
  const testimonials = rawTestimonials.map((t: any) => ({
    ...t,
    author: t.author?.[isAr ? 'ar' : 'en'] || (isAr ? t.authorAr : t.authorEn) || t.author,
    role: t.role?.[isAr ? 'ar' : 'en'] || (isAr ? t.roleAr : t.roleEn) || t.role,
    company: t.company?.[isAr ? 'ar' : 'en'] || (isAr ? t.companyAr : t.companyEn) || t.company,
    quote: t.quote?.[isAr ? 'ar' : 'en'] || (isAr ? t.quoteAr : t.quoteEn) || t.quote,
    metric: t.metric?.[isAr ? 'ar' : 'en'] || (isAr ? t.metricAr : t.metricEn) || t.metric,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToNext = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 400);
  }, [testimonials.length]);

  const goToPrev = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 400);
  }, [testimonials.length]);

  const goToIndex = (index: number) => {
    if (index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 400);
  };

  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      goToNext();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, goToNext, testimonials.length]);

  const current = testimonials[currentIndex] || testimonials[0];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        'group relative flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-persici-black p-8 text-white shadow-2xl transition-all duration-300 lg:p-10',
        className
      )}
    >
      {/* Decorative ambient background radial glow */}
      <div className="pointer-events-none absolute -top-12 -end-12 h-48 w-48 rounded-full bg-persici-crimson/15 blur-3xl" />

      <div>
        {/* Card Header: Avatar, Company Name & Metric Tag */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white/20 shadow-md">
              <Image
                src={
                  current.avatar ||
                  current.photo ||
                  current.image ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt={current.author}
                fill
                className="object-cover transition-opacity duration-300"
              />
            </div>
            <div>
              <span className="block font-primary text-base font-semibold tracking-wider text-white">
                {current.company}
              </span>
              {(() => {
                const ratingVal =
                  typeof current.rating === 'number'
                    ? current.rating
                    : parseFloat(String(current.rating || '5.0')) || 5.0;
                return (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex text-xs text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            ratingVal >= i + 0.8
                              ? 'text-amber-400'
                              : ratingVal >= i + 0.3
                              ? 'text-amber-400/80'
                              : 'text-white/20'
                          }
                        >
                          {ratingVal >= i + 0.3 ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-[11px] font-bold text-white/90">
                      {ratingVal.toFixed(1)}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {current.metric && (
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[9.5px] font-semibold text-emerald-400">
              {current.metric}
            </div>
          )}
        </div>

        {/* Dynamic Bold Testimonial Quote with smooth fade */}
        <div className="min-h-[110px] sm:min-h-[120px]">
          <blockquote
            className={cn(
              'mt-6 text-sm font-normal leading-relaxed text-white/90 transition-all duration-300 sm:text-base lg:text-lg',
              isAnimating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
            )}
          >
            &ldquo;{current.quote}&rdquo;
          </blockquote>
        </div>
      </div>

      {/* Card Footer: Author Info + Navigation & Interactive Progress Dots */}
      <div className="mt-8 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'transition-all duration-300',
              isAnimating ? 'opacity-0' : 'opacity-100'
            )}
          >
            <div className="text-xs font-semibold text-white">{current.author}</div>
            <div className="text-[9.5px] text-white/60">{current.role}</div>
          </div>

          {/* Controls: Prev / Next Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={goToPrev}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:bg-white/20 hover:text-white"
              aria-label="Previous opinion"
            >
              <span className="text-xs">‹</span>
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:bg-white/20 hover:text-white"
              aria-label="Next opinion"
            >
              <span className="text-xs">›</span>
            </button>
          </div>
        </div>

        {/* Interactive Slide Dots / Progress Indicator */}
        <div className="mt-4 flex items-center gap-1.5" role="tablist" aria-label="Client opinions">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToIndex(idx)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                currentIndex === idx
                  ? 'w-6 bg-persici-crimson'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              )}
              aria-label={`Show opinion ${idx + 1} of ${testimonials.length}`}
              aria-selected={currentIndex === idx}
              role="tab"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
