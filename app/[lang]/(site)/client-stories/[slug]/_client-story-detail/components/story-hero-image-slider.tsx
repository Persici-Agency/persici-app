'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';

export interface StoryHeroSlideItem {
  src: string;
  alt: string;
}

export interface StoryHeroImageSliderProps {
  slides: StoryHeroSlideItem[];
  autoScroll: boolean;
  infinite: boolean;
  intervalMs: number;
  transitionMs: number;
  showArrows: boolean;
  isRtl?: boolean;
}

export function StoryHeroImageSlider({
  slides,
  autoScroll,
  infinite,
  intervalMs,
  transitionMs,
  showArrows,
  isRtl = false,
}: StoryHeroImageSliderProps) {
  const isLoop = infinite && slides.length >= 2;

  const trackSlides = isLoop
    ? [slides[slides.length - 1], ...slides, slides[0]]
    : slides;

  const [trackIndex, setTrackIndex] = useState<number>(() => (isLoop ? 1 : 0));
  const [enableTransition, setEnableTransition] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffsetPx, setDragOffsetPx] = useState<number>(0);

  const dragStartXRef = useRef<number | null>(null);
  const activePointerIdRef = useRef<number | null>(null);

  const realIndex =
    slides.length === 0
      ? 0
      : isLoop
      ? (((trackIndex - 1) % slides.length) + slides.length) % slides.length
      : Math.min(Math.max(trackIndex, 0), slides.length - 1);

  const isAtLoopBookend =
    isLoop && (trackIndex <= 0 || trackIndex >= slides.length + 1);

  const canGoPrev = slides.length >= 2 && (isLoop || trackIndex > 0);
  const canGoNext = slides.length >= 2 && (isLoop || trackIndex < slides.length - 1);

  // Seamless jump back from cloned bookend slides after CSS transition ends
  useEffect(() => {
    if (!isLoop) return;
    if (trackIndex !== 0 && trackIndex !== slides.length + 1) return;

    const snapTimer = window.setTimeout(() => {
      setEnableTransition(false);
      setTrackIndex(trackIndex === 0 ? slides.length : 1);
    }, transitionMs + 25);

    return () => window.clearTimeout(snapTimer);
  }, [isLoop, trackIndex, slides.length, transitionMs]);

  // Re-enable CSS transition right after an instant 0ms snap has painted
  useEffect(() => {
    if (enableTransition) return;

    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        setEnableTransition(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
    };
  }, [enableTransition]);

  // Auto-scrolling timer (paused while hovered or dragging)
  useEffect(() => {
    if (!autoScroll || slides.length < 2 || isHovered || isDragging) return;
    if (!isLoop && trackIndex >= slides.length - 1) return;

    const delay = Math.max(intervalMs, transitionMs + 350);
    const timer = window.setInterval(() => {
      setEnableTransition(true);
      setTrackIndex((prev) => {
        if (isLoop) {
          if (prev <= 0 || prev >= slides.length + 1) return prev;
          return prev + 1;
        }
        return Math.min(slides.length - 1, prev + 1);
      });
    }, delay);

    return () => window.clearInterval(timer);
  }, [
    autoScroll,
    slides.length,
    isHovered,
    isDragging,
    isLoop,
    trackIndex,
    intervalMs,
    transitionMs,
  ]);

  const goPrev = () => {
    if (!canGoPrev || isAtLoopBookend) return;
    setEnableTransition(true);
    setTrackIndex((prev) => (isLoop ? prev - 1 : Math.max(0, prev - 1)));
  };

  const goNext = () => {
    if (!canGoNext || isAtLoopBookend) return;
    setEnableTransition(true);
    setTrackIndex((prev) =>
      isLoop ? prev + 1 : Math.min(slides.length - 1, prev + 1)
    );
  };

  const goToRealSlide = (idx: number) => {
    if (slides.length === 0) return;
    const safeIdx = Math.min(Math.max(idx, 0), slides.length - 1);
    setEnableTransition(true);
    setTrackIndex(isLoop ? safeIdx + 1 : safeIdx);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (slides.length < 2 || e.button !== 0 || isAtLoopBookend) return;
    if ((e.target as HTMLElement).closest('button')) return;

    activePointerIdRef.current = e.pointerId;
    dragStartXRef.current = e.clientX;
    setIsDragging(true);
    setDragOffsetPx(0);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is unsupported
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartXRef.current === null) return;
    let dx = e.clientX - dragStartXRef.current;

    if (!isLoop) {
      if ((trackIndex === 0 && dx > 0) || (trackIndex === slides.length - 1 && dx < 0)) {
        dx *= 0.25;
      }
    }

    setDragOffsetPx(dx);
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = dragOffsetPx;
    dragStartXRef.current = null;
    if (activePointerIdRef.current !== null) {
      try {
        if (e.currentTarget.hasPointerCapture(activePointerIdRef.current)) {
          e.currentTarget.releasePointerCapture(activePointerIdRef.current);
        }
      } catch {
        // Ignore
      }
      activePointerIdRef.current = null;
    }

    setIsDragging(false);
    setDragOffsetPx(0);

    if (Math.abs(dx) > 45) {
      if (dx < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  return (
    <div
      dir="ltr"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      style={{ touchAction: 'pan-y' }}
      role="region"
      aria-roledescription="carousel"
      aria-label={isRtl ? 'معرض صور القصة الرئيسية' : 'Featured client story image slider'}
      className={`relative w-full aspect-16/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100 select-none group ${
        slides.length > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
      }`}
    >
      {/* Horizontal Slide Track */}
      <div
        className="flex w-full h-full will-change-transform"
        style={{
          transform: `translate3d(calc(-${trackIndex * 100}% + ${dragOffsetPx}px), 0, 0)`,
          transition:
            enableTransition && !isDragging
              ? `transform ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
              : 'none',
        }}
      >
        {trackSlides.map((slide, idx) => {
          const isGif = slide.src.toLowerCase().endsWith('.gif');
          return (
            <div key={`${slide.src}-${idx}`} className="relative w-full h-full shrink-0">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                loading={idx <= 2 ? 'eager' : 'lazy'}
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={isGif}
                draggable={false}
                className="object-cover pointer-events-none"
              />
            </div>
          );
        })}
      </div>

      {/* Subtle Bottom Scrim for Dot Contrast */}
      {slides.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
      )}

      {/* Slide Counter Pill */}
      {slides.length > 1 && (
        <div className="pointer-events-none absolute top-3 right-3 sm:top-4 sm:right-4 z-20 px-2.5 py-1 rounded-full bg-slate-950/60 text-white/95 backdrop-blur-xs text-[11px] font-mono tracking-wider shadow-xs">
          {String(realIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
      )}

      {/* Optional Pagination Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label={isRtl ? 'الشريحة السابقة' : 'Previous slide'}
            className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/90 hover:bg-white text-slate-900 border border-black/10 shadow-md backdrop-blur-xs flex items-center justify-center transition-all ${
              !canGoPrev
                ? 'opacity-35 cursor-not-allowed'
                : 'opacity-90 sm:opacity-80 sm:group-hover:opacity-100 hover:scale-105 cursor-pointer'
            }`}
          >
            <TbChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            aria-label={isRtl ? 'الشريحة التالية' : 'Next slide'}
            className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/90 hover:bg-white text-slate-900 border border-black/10 shadow-md backdrop-blur-xs flex items-center justify-center transition-all ${
              !canGoNext
                ? 'opacity-35 cursor-not-allowed'
                : 'opacity-90 sm:opacity-80 sm:group-hover:opacity-100 hover:scale-105 cursor-pointer'
            }`}
          >
            <TbChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </>
      )}

      {/* Pagination Indicator Dots */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-950/45 backdrop-blur-xs border border-white/15"
          aria-label={isRtl ? 'مؤشرات الشرائح' : 'Slide pagination'}
        >
          {slides.map((_, idx) => {
            const isActive = idx === realIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goToRealSlide(idx)}
                aria-label={`${isRtl ? 'انتقل إلى الشريحة' : 'Go to slide'} ${idx + 1}`}
                aria-current={isActive ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-5 bg-white shadow-xs'
                    : 'w-1.5 bg-white/55 hover:bg-white/85'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
