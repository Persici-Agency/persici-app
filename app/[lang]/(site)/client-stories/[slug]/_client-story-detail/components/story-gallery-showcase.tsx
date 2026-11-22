'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  TbMaximize,
  TbX,
  TbChevronRight,
  TbChevronLeft,
} from 'react-icons/tb';
import type {
  StoryGalleryDesign,
  StoryGalleryImage,
  StoryGalleryOrder,
  StoryTemplateType,
} from '../../../_client-stories/types';

export interface StoryGalleryShowcaseProps {
  gallery: StoryGalleryImage[];
  galleryDesign?: StoryGalleryDesign;
  galleryOrder?: StoryGalleryOrder;
  templateType: StoryTemplateType;
  lang: string;
  hasPrimaryContent?: boolean;
}

export function StoryGalleryShowcase({
  gallery,
  galleryDesign = 'editorial-bento',
  galleryOrder = 'normal',
  templateType,
  lang,
  hasPrimaryContent = false,
}: StoryGalleryShowcaseProps) {
  const isRtl = lang === 'ar';
  const activeDesign: StoryGalleryDesign = galleryDesign || 'editorial-bento';
  const isReverseOrder = galleryOrder === 'reverse';

  const validGallery = useMemo(() => {
    const filtered = gallery.filter((img) => Boolean(img.src && img.src.trim()));
    return isReverseOrder ? [...filtered].reverse() : filtered;
  }, [gallery, isReverseOrder]);

  // Lightbox state (shared across all 6 designs)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Spotlight & Filmstrip state
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);

  // Interactive Carousel state + pointer drag panning
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const dragStateRef = useRef<{
    isDragging: boolean;
    startX: number;
    scrollLeft: number;
    movedPx: number;
  }>({ isDragging: false, startX: 0, scrollLeft: 0, movedPx: 0 });

  // Keyboard navigation when Lightbox is open
  useEffect(() => {
    if (lightboxIndex === null || validGallery.length === 0) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : prev < validGallery.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : prev > 0 ? prev - 1 : validGallery.length - 1
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, validGallery.length]);

  if (validGallery.length === 0) {
    return null;
  }

  const getAlt = (img: StoryGalleryImage, idx: number) =>
    img.alt?.[lang as 'en' | 'ar'] ||
    img.alt?.en ||
    `${isRtl ? 'صورة المشروع' : 'Project Deliverable'} #${idx + 1}`;

  const getCaption = (img: StoryGalleryImage) =>
    img.caption?.[lang as 'en' | 'ar'] || img.caption?.en || '';

  const safeSpotlightIdx =
    spotlightIndex < validGallery.length ? spotlightIndex : 0;
  const activeSpotlight = validGallery[safeSpotlightIdx] || validGallery[0];

  const scrollCarouselToIndex = (targetIdx: number) => {
    const clamped =
      targetIdx < 0
        ? validGallery.length - 1
        : targetIdx >= validGallery.length
        ? 0
        : targetIdx;
    setCarouselIndex(clamped);
    const el = carouselRef.current;
    if (!el) return;
    const child = el.children[clamped] as HTMLElement | undefined;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  // Chunk gallery into magazine spreads (1 panoramic + up to 2 companion asymmetric cards)
  const magazineGroups: Array<{
    lead: { img: StoryGalleryImage; idx: number };
    pair: Array<{ img: StoryGalleryImage; idx: number }>;
    flipRatio: boolean;
  }> = [];
  for (let i = 0; i < validGallery.length; i += 3) {
    const pair: Array<{ img: StoryGalleryImage; idx: number }> = [];
    if (validGallery[i + 1]) pair.push({ img: validGallery[i + 1], idx: i + 1 });
    if (validGallery[i + 2]) pair.push({ img: validGallery[i + 2], idx: i + 2 });
    magazineGroups.push({
      lead: { img: validGallery[i], idx: i },
      pair,
      flipRatio: Math.floor(i / 3) % 2 === 1,
    });
  }

  const sectionEyebrow =
    templateType === 'marketing-branding-showcase'
      ? isRtl
        ? 'المخرجات البصرية للعلامة التجارية'
        : 'Key Brand Visuals & Campaign Assets'
      : templateType === 'software-web-app-showcase' ||
        templateType === 'ai-platform-showcase' ||
        templateType === 'mobile-app-showcase'
      ? isRtl
        ? 'معرض اللقطات والشاشات الإضافية'
        : 'Visual Gallery & Additional Screens'
      : isRtl
      ? 'معرض الصور والإنتاج الميداني'
      : 'Campaign Photography & Production Stills';

  return (
    <div className={hasPrimaryContent ? 'mt-12 sm:mt-16' : ''}>
      {(hasPrimaryContent || activeDesign === 'interactive-carousel') && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-500">
            {sectionEyebrow}
          </h3>

          {activeDesign === 'interactive-carousel' && validGallery.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-500 me-1">
                {String(carouselIndex + 1).padStart(2, '0')} /{' '}
                {String(validGallery.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => scrollCarouselToIndex(carouselIndex - 1)}
                aria-label="Previous slide"
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
              >
                <TbChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => scrollCarouselToIndex(carouselIndex + 1)}
                aria-label="Next slide"
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
              >
                <TbChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* DESIGN 1 (DEFAULT): EDITORIAL BENTO GRID                            */}
      {/* =================================================================== */}
      {activeDesign === 'editorial-bento' && (
        <div
          className={
            templateType === 'marketing-branding-showcase' && validGallery.length === 1
              ? 'grid grid-cols-1 gap-6'
              : templateType === 'marketing-branding-showcase' && validGallery.length === 2
              ? 'grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
          }
        >
          {validGallery.map((img, idx) => {
            const alt = getAlt(img, idx);
            const caption = getCaption(img);
            const isCompactShowcase = templateType === 'marketing-branding-showcase';
            const aspectClass =
              isCompactShowcase && validGallery.length === 1
                ? 'aspect-16/9'
                : isCompactShowcase && validGallery.length === 2
                ? 'aspect-4/3'
                : img.featured
                ? 'sm:col-span-2 aspect-16/9'
                : 'aspect-square';

            return (
              <div
                key={`${img.src}-${idx}`}
                onClick={() => setLightboxIndex(idx)}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-slate-100 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 ${aspectClass}`}
              >
                <Image
                  src={img.src}
                  alt={alt}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md">
                    <TbMaximize className="h-5 w-5" />
                  </span>
                </div>
                {caption && (
                  <div className="absolute bottom-0 inset-x-0 p-3.5 bg-linear-to-t from-black/75 to-transparent text-white text-xs font-medium truncate">
                    {caption}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* DESIGN 2: ARCHITECTURAL UNIFORM GRID                                */}
      {/* =================================================================== */}
      {activeDesign === 'uniform-grid' && (
        <div
          className={
            validGallery.length === 1
              ? 'grid grid-cols-1 gap-6'
              : validGallery.length === 2
              ? 'grid grid-cols-1 sm:grid-cols-2 gap-6'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'
          }
        >
          {validGallery.map((img, idx) => {
            const alt = getAlt(img, idx);
            const caption = getCaption(img);
            return (
              <div
                key={`${img.src}-${idx}`}
                onClick={() => setLightboxIndex(idx)}
                className="group rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative w-full aspect-4/3 bg-slate-100 overflow-hidden">
                  <Image
                    src={img.src}
                    alt={alt}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg">
                      <TbMaximize className="h-5 w-5" />
                    </span>
                  </div>
                </div>
                {(caption || alt) && (
                  <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2 bg-white">
                    <span className="text-xs font-medium text-slate-700 truncate">
                      {caption || alt}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-400 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* DESIGN 3: INTERACTIVE CAROUSEL / SWIPER                             */}
      {/* =================================================================== */}
      {activeDesign === 'interactive-carousel' && (
        <div className="space-y-4">
          <div
            ref={carouselRef}
            onMouseDown={(e) => {
              const el = carouselRef.current;
              if (!el) return;
              dragStateRef.current = {
                isDragging: true,
                startX: e.pageX - el.offsetLeft,
                scrollLeft: el.scrollLeft,
                movedPx: 0,
              };
            }}
            onMouseMove={(e) => {
              const state = dragStateRef.current;
              const el = carouselRef.current;
              if (!state.isDragging || !el) return;
              e.preventDefault();
              const x = e.pageX - el.offsetLeft;
              const walk = x - state.startX;
              state.movedPx = Math.max(state.movedPx, Math.abs(walk));
              el.scrollLeft = state.scrollLeft - walk;
            }}
            onMouseUp={() => {
              dragStateRef.current.isDragging = false;
            }}
            onMouseLeave={() => {
              dragStateRef.current.isDragging = false;
            }}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 scrollbar-none select-none cursor-grab active:cursor-grabbing"
          >
            {validGallery.map((img, idx) => {
              const alt = getAlt(img, idx);
              const caption = getCaption(img);
              return (
                <div
                  key={`${img.src}-${idx}`}
                  onClick={() => {
                    if (dragStateRef.current.movedPx > 8) {
                      dragStateRef.current.movedPx = 0;
                      return;
                    }
                    setCarouselIndex(idx);
                    setLightboxIndex(idx);
                  }}
                  className={`group relative shrink-0 snap-center overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-slate-900 shadow-md hover:shadow-xl transition-all ${
                    validGallery.length === 1
                      ? 'w-full aspect-16/9'
                      : 'w-[86%] sm:w-[70%] lg:w-[58%] aspect-16/10'
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={alt}
                    fill
                    unoptimized
                    draggable={false}
                    sizes="(max-width: 768px) 90vw, 60vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3.5 end-3.5 w-9 h-9 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <TbMaximize className="w-4 h-4" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-linear-to-t from-black/80 via-black/35 to-transparent text-white flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-persici-crimson font-bold block mb-0.5">
                        {String(idx + 1).padStart(2, '0')} / {String(validGallery.length).padStart(2, '0')}
                      </span>
                      <p className="text-xs sm:text-sm font-medium truncate">
                        {caption || alt}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {validGallery.length > 1 && (
            <div className="flex items-center justify-center gap-1.5">
              {validGallery.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollCarouselToIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    carouselIndex === idx
                      ? 'w-7 bg-persici-crimson'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* DESIGN 4: MASONRY LOOKBOOK COLLAGE                                  */}
      {/* =================================================================== */}
      {activeDesign === 'masonry-lookbook' && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 sm:gap-6 space-y-5 sm:space-y-6">
          {validGallery.map((img, idx) => {
            const alt = getAlt(img, idx);
            const caption = getCaption(img);
            return (
              <div
                key={`${img.src}-${idx}`}
                onClick={() => setLightboxIndex(idx)}
                className="group break-inside-avoid relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative overflow-hidden bg-slate-100">
                  <Image
                    src={img.src}
                    alt={alt}
                    width={img.width || 1200}
                    height={img.height || 900}
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-auto block group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-md">
                      <TbMaximize className="h-5 w-5" />
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between gap-2 bg-white border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-700 truncate">
                    {caption || alt}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-slate-400 shrink-0">
                    FIG.{String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* DESIGN 5: SPOTLIGHT STAGE + INTERACTIVE THUMBNAIL FILMSTRIP         */}
      {/* =================================================================== */}
      {activeDesign === 'spotlight-filmstrip' && activeSpotlight && (
        <div className="space-y-4 sm:space-y-5">
          {/* Master Stage */}
          <div
            onClick={() => setLightboxIndex(safeSpotlightIdx)}
            className="group relative w-full aspect-16/9 rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl cursor-pointer"
          >
            <Image
              key={activeSpotlight.src}
              src={activeSpotlight.src}
              alt={getAlt(activeSpotlight, safeSpotlightIdx)}
              fill
              unoptimized
              sizes="100vw"
              className="object-contain transition-transform duration-500 group-hover:scale-102"
            />

            {/* Expand Badge */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(safeSpotlightIdx);
              }}
              aria-label="Open Fullscreen"
              className="absolute top-4 end-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-persici-crimson text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
            >
              <TbMaximize className="w-4 h-4" />
            </button>

            {validGallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSpotlightIndex((prev) =>
                      prev > 0 ? prev - 1 : validGallery.length - 1
                    );
                  }}
                  aria-label="Previous image"
                  className="absolute start-3 sm:start-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <TbChevronLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSpotlightIndex((prev) =>
                      prev < validGallery.length - 1 ? prev + 1 : 0
                    );
                  }}
                  aria-label="Next image"
                  className="absolute end-3 sm:end-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <TbChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </>
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-linear-to-t from-black/80 via-black/30 to-transparent text-white flex items-end justify-between gap-4 pointer-events-none">
              <p className="text-xs sm:text-sm font-medium truncate">
                {getCaption(activeSpotlight) || getAlt(activeSpotlight, safeSpotlightIdx)}
              </p>
              <span className="font-mono text-xs font-bold text-white/80 shrink-0">
                {String(safeSpotlightIdx + 1).padStart(2, '0')} /{' '}
                {String(validGallery.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Clickable Thumbnail Filmstrip */}
          {validGallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {validGallery.map((img, idx) => {
                const isActive = safeSpotlightIdx === idx;
                return (
                  <button
                    key={`${img.src}-thumb-${idx}`}
                    type="button"
                    onClick={() => setSpotlightIndex(idx)}
                    className={`relative shrink-0 w-24 sm:w-32 aspect-16/10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-persici-crimson ring-2 ring-persici-crimson/30 scale-[1.02]'
                        : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={getAlt(img, idx)}
                      fill
                      unoptimized
                      sizes="140px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* DESIGN 6: EDITORIAL MAGAZINE SPREAD                                 */}
      {/* =================================================================== */}
      {activeDesign === 'magazine-spread' && (
        <div className="space-y-6 sm:space-y-8">
          {magazineGroups.map((group, gIdx) => {
            const leadCaption = getCaption(group.lead.img);
            const leadAlt = getAlt(group.lead.img, group.lead.idx);
            return (
              <div key={`spread-${gIdx}`} className="space-y-6 sm:space-y-8">
                {/* Full-Width Panoramic Lead Frame */}
                <div
                  onClick={() => setLightboxIndex(group.lead.idx)}
                  className="group relative w-full aspect-16/9 sm:aspect-21/9 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <Image
                    src={group.lead.img.src}
                    alt={leadAlt}
                    fill
                    unoptimized
                    sizes="100vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg">
                      <TbMaximize className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-linear-to-t from-black/75 via-black/25 to-transparent text-white flex items-end justify-between gap-4">
                    <p className="text-xs sm:text-sm font-medium truncate">
                      {leadCaption || leadAlt}
                    </p>
                    <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-white/80 shrink-0">
                      PLATE {String(group.lead.idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Companion 60/40 Asymmetric Spread */}
                {group.pair.length > 0 && (
                  <div
                    className={
                      group.pair.length === 1
                        ? 'grid grid-cols-1 gap-6'
                        : 'grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6'
                    }
                  >
                    {group.pair.map((entry, pIdx) => {
                      const colSpanClass =
                        group.pair.length === 1
                          ? ''
                          : group.flipRatio
                          ? pIdx === 0
                            ? 'lg:col-span-5'
                            : 'lg:col-span-7'
                          : pIdx === 0
                          ? 'lg:col-span-7'
                          : 'lg:col-span-5';
                      const caption = getCaption(entry.img);
                      const alt = getAlt(entry.img, entry.idx);

                      return (
                        <div
                          key={`${entry.img.src}-${entry.idx}`}
                          onClick={() => setLightboxIndex(entry.idx)}
                          className={`${colSpanClass} group relative aspect-4/3 lg:aspect-auto lg:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer`}
                        >
                          <Image
                            src={entry.img.src}
                            alt={alt}
                            fill
                            unoptimized
                            sizes="(max-width: 1024px) 100vw, 55vw"
                            className="object-cover group-hover:scale-104 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-md">
                              <TbMaximize className="h-5 w-5" />
                            </span>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/75 via-black/25 to-transparent text-white flex items-end justify-between gap-2">
                            <p className="text-xs font-medium truncate">
                              {caption || alt}
                            </p>
                            <span className="font-mono text-[10px] font-bold text-white/80 shrink-0">
                              PLATE {String(entry.idx + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* FULL-SCREEN LIGHTBOX MODAL (SHARED BY ALL 6 GALLERY DESIGNS)        */}
      {/* =================================================================== */}
      {lightboxIndex !== null && validGallery[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close lightbox"
            className="absolute top-6 end-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer z-50"
          >
            <TbX className="h-6 w-6" />
          </button>

          {validGallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : validGallery.length - 1
                );
              }}
              aria-label="Previous image"
              className="absolute start-4 sm:start-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer z-50"
            >
              <TbChevronLeft className={`h-6 w-6 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          )}

          <div
            className="relative max-w-5xl max-h-[82vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={validGallery[lightboxIndex].src}
              alt={getAlt(validGallery[lightboxIndex], lightboxIndex)}
              fill
              unoptimized
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <div
            className="mt-4 text-center text-white/90 text-xs sm:text-sm max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <span>
              {getCaption(validGallery[lightboxIndex]) ||
                getAlt(validGallery[lightboxIndex], lightboxIndex)}
            </span>
            <span className="ms-3 font-mono text-xs text-white/50">
              {lightboxIndex + 1} / {validGallery.length}
            </span>
          </div>

          {validGallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev !== null && prev < validGallery.length - 1 ? prev + 1 : 0
                );
              }}
              aria-label="Next image"
              className="absolute end-4 sm:end-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer z-50"
            >
              <TbChevronRight className={`h-6 w-6 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
