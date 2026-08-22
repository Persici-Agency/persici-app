'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { getClientLogos } from '@shared/services';
import type {
  ClientLogo,
  LogoSize,
  SwiperGap,
  SwiperSpeed,
  SwiperDirection,
  SwiperWrapperProps,
} from '@shared/types';
import { cn } from '@shared/utils';

export type {
  SwiperDirection,
  SwiperSpeed,
  SwiperGap,
  LogoSize,
  SwiperWrapperProps,
  ClientLogo,
};

const sizeStyles: Record<
  'xs' | 'sm' | 'md' | 'lg' | 'xl',
  { item: string; img: string; width: number; height: number }
> = {
  xs: { item: 'h-12 w-28 sm:w-32', img: 'max-h-8 sm:max-h-9 w-auto', width: 120, height: 40 },
  sm: { item: 'h-16 w-36 sm:w-40', img: 'max-h-11 sm:max-h-12 w-auto', width: 150, height: 50 },
  md: { item: 'h-20 sm:h-24 w-44 sm:w-52 lg:w-56', img: 'max-h-14 sm:max-h-16 lg:max-h-18 w-auto', width: 190, height: 70 },
  lg: { item: 'h-24 sm:h-28 w-52 sm:w-60 lg:w-64', img: 'max-h-18 sm:max-h-20 lg:max-h-22 w-auto', width: 220, height: 85 },
  xl: { item: 'h-28 sm:h-32 w-60 sm:w-72 lg:w-80', img: 'max-h-22 sm:max-h-24 lg:max-h-28 w-auto', width: 260, height: 100 },
};

const gapStyles: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> = {
  xs: 'gap-3 sm:gap-4 lg:gap-6 pr-3 sm:pr-4 lg:pr-6',
  sm: 'gap-4 sm:gap-6 lg:gap-8 pr-4 sm:pr-6 lg:pr-8',
  md: 'gap-6 sm:gap-8 lg:gap-10 pr-6 sm:pr-8 lg:pr-10',
  lg: 'gap-8 sm:gap-10 lg:gap-14 pr-8 sm:pr-10 lg:pr-14',
  xl: 'gap-10 sm:gap-14 lg:gap-18 pr-10 sm:pr-14 lg:pr-18',
};

function getSpeedPixelsPerSecond(speed: SwiperSpeed = 'normal'): number {
  if (typeof speed === 'number') {
    return Math.max(10, speed <= 150 ? 1800 / speed : speed);
  }
  const map: Record<'slow' | 'normal' | 'fast', number> = {
    slow: 22,
    normal: 42,
    fast: 75,
  };
  return map[speed] || 42;
}

/**
 * Normalizes offset continuously into the [-loopWidth, 0] interval
 * regardless of whether offset is positive or negative.
 */
function normalizeOffset(offset: number, loopWidth: number): number {
  if (loopWidth <= 0) return 0;
  const remainder = offset % loopWidth;
  return remainder > 0 ? remainder - loopWidth : remainder;
}

export function SwiperWrapper<T = unknown>({
  children,
  data,
  logos,
  renderItem,
  keyExtractor,
  speed = 'normal',
  direction = 'left',
  pauseOnHover = true,
  draggable = true,
  stopOnDrag = true,
  enableMomentum = true,
  friction = 0.94,
  gap = 'md',
  space,
  infiniteLoop = true,
  fadeMask = true,
  fadeWidthClass = 'w-20 sm:w-36 md:w-52',
  fadeGradientClass,
  className,
  trackClassName,
  itemClassName,
  title,
  titleClassName,
  showTitle = true,
  logoSize = 'md',
  logoClassName,
}: SwiperWrapperProps<T>) {
  const isLogoMode = !children && !(data && data.length > 0 && renderItem);
  const effectiveLogos = isLogoMode ? (logos || getClientLogos()) : [];
  const hasContent = Boolean(children || (data && data.length > 0) || effectiveLogos.length > 0);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loop1Ref = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Keep latest configuration in ref for 60/120fps RAF loop
  const configRef = useRef({
    friction,
    stopOnDrag,
    pauseOnHover,
    speed,
    direction,
  });

  useEffect(() => {
    configRef.current = {
      friction,
      stopOnDrag,
      pauseOnHover,
      speed,
      direction,
    };
  }, [friction, stopOnDrag, pauseOnHover, speed, direction]);

  // Physics animation state refs (avoids React re-render overhead during 60/120fps RAF loop)
  const offsetRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const startPointerXRef = useRef<number>(0);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const momentumVelocityRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  const effectiveGap: SwiperGap = space ?? gap;
  const isNumericGap = typeof effectiveGap === 'number';
  const gapClass = !isNumericGap
    ? gapStyles[effectiveGap as keyof typeof gapStyles] || gapStyles.md
    : '';

  const isNumericSize = typeof logoSize === 'number';
  const currentSizeConfig = isNumericSize
    ? null
    : sizeStyles[logoSize as keyof typeof sizeStyles] || sizeStyles.md;

  // Calculate base speed in pixels/sec with RTL awareness
  const getBaseVelocity = useCallback((): number => {
    const pxPerSec = getSpeedPixelsPerSecond(configRef.current.speed);
    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
    const dir = configRef.current.direction;

    let moveDirection: 'left' | 'right';
    if (dir === 'left') {
      moveDirection = 'left';
    } else if (dir === 'right') {
      moveDirection = 'right';
    } else if (dir === 'reverse') {
      moveDirection = isRTL ? 'left' : 'right';
    } else {
      // default / 'forward'
      moveDirection = isRTL ? 'right' : 'left';
    }

    // In uniform LTR coordinates:
    // 'left' decreases offset (negative velocity)
    // 'right' increases offset (positive velocity)
    return moveDirection === 'left' ? -pxPerSec : pxPerSec;
  }, []);

  // Main 60-120fps physics & animation loop (active only when infiniteLoop is true)
  useEffect(() => {
    if (!hasContent || !infiniteLoop) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaSeconds = Math.min((currentTime - lastTime) / 1000, 0.08);
      lastTime = currentTime;

      const track = trackRef.current;
      const loop1 = loop1Ref.current;

      if (track && loop1) {
        const loopWidth = loop1.offsetWidth || 0;
        const {
          friction: curFriction,
          stopOnDrag: curStopOnDrag,
          pauseOnHover: curPauseOnHover,
        } = configRef.current;

        if (isDraggingRef.current && curStopOnDrag) {
          // Controlled by pointer events during active drag
        } else {
          // Apply fling momentum physics decay
          if (Math.abs(momentumVelocityRef.current) > 0.5) {
            offsetRef.current += momentumVelocityRef.current * deltaSeconds;

            const decay = Math.pow(Math.max(0.7, Math.min(0.99, curFriction)), deltaSeconds * 60);
            momentumVelocityRef.current *= decay;

            if (Math.abs(momentumVelocityRef.current) <= 0.5) {
              momentumVelocityRef.current = 0;
            }
          } else {
            momentumVelocityRef.current = 0;
            const isPausedByHover = curPauseOnHover && isHoveredRef.current;

            if (!isPausedByHover) {
              const baseVelocity = getBaseVelocity();
              offsetRef.current += baseVelocity * deltaSeconds;
            }
          }

          // Continuous glitch-free modulo wrapping in both left and right directions
          if (loopWidth > 0) {
            offsetRef.current = normalizeOffset(offsetRef.current, loopWidth);
          }
        }

        // Hardware-accelerated GPU 3D transform
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasContent, infiniteLoop, getBaseVelocity]);

  // Pointer Event Handlers for Drag & Throw Momentum
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || !infiniteLoop) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    isDraggingRef.current = true;
    setIsDraggingState(true);
    hasMovedRef.current = false;

    startPointerXRef.current = e.clientX;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;
    momentumVelocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !infiniteLoop) return;

    const currentX = e.clientX;
    const now = performance.now();
    const deltaX = currentX - lastPointerXRef.current;
    const deltaTime = Math.max(now - lastPointerTimeRef.current, 1);

    if (Math.abs(currentX - startPointerXRef.current) > 4) {
      hasMovedRef.current = true;
    }

    offsetRef.current += deltaX;

    const loopWidth = loop1Ref.current?.offsetWidth || 0;
    if (loopWidth > 0) {
      offsetRef.current = normalizeOffset(offsetRef.current, loopWidth);
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }

    const instantVelocity = (deltaX / deltaTime) * 1000;
    velocityRef.current = 0.7 * instantVelocity + 0.3 * velocityRef.current;

    lastPointerXRef.current = currentX;
    lastPointerTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    isDraggingRef.current = false;
    setIsDraggingState(false);

    if (enableMomentum && infiniteLoop) {
      const now = performance.now();
      const timeSinceLastMove = now - lastPointerTimeRef.current;

      if (timeSinceLastMove < 100 && Math.abs(velocityRef.current) > 30) {
        const maxVelocity = 2800;
        const clampedVelocity = Math.max(-maxVelocity, Math.min(maxVelocity, velocityRef.current));
        momentumVelocityRef.current = clampedVelocity;
      }
    }

    velocityRef.current = 0;
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
  };

  const getItemKey = (item: T, idx: number, loopIndex: number): string => {
    if (keyExtractor) return `loop-${loopIndex}-${keyExtractor(item, idx)}`;
    if (typeof item === 'object' && item !== null && 'id' in item) {
      return `loop-${loopIndex}-${(item as Record<string, unknown>).id}-${idx}`;
    }
    return `loop-${loopIndex}-item-${idx}`;
  };

  const renderTrackItems = (loopIndex: number) => {
    if (children) {
      return (
        <React.Fragment key={`loop-frag-${loopIndex}`}>
          {children}
        </React.Fragment>
      );
    }
    if (data && renderItem) {
      return data.map((item, index) => (
        <div
          key={getItemKey(item, index, loopIndex)}
          className={cn('shrink-0', itemClassName)}
        >
          {renderItem(item, index)}
        </div>
      ));
    }
    if (effectiveLogos.length > 0) {
      return effectiveLogos.map((client, idx) => (
        <div
          key={`logo-${loopIndex}-${client.name}-${idx}`}
          className={cn(
            'group flex items-center justify-center transition-all duration-300 hover:scale-105',
            !isNumericSize && currentSizeConfig?.item,
            logoClassName,
            itemClassName
          )}
          style={
            isNumericSize
              ? { height: `${logoSize}px`, width: `${(logoSize as number) * 3}px` }
              : undefined
          }
          title={client.name}
        >
          <Image
            src={client.src}
            alt={client.name}
            width={currentSizeConfig?.width || 190}
            height={currentSizeConfig?.height || 70}
            className={cn(
              'object-contain opacity-65 grayscale contrast-125 transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0',
              !isNumericSize && currentSizeConfig?.img
            )}
            style={isNumericSize ? { maxHeight: `${logoSize}px`, width: 'auto' } : undefined}
          />
        </div>
      ));
    }
    return null;
  };

  if (!hasContent) return null;

  return (
    <div className={cn('relative w-full overflow-hidden py-3', className)}>
      {showTitle && title && (
        typeof title === 'string' ? (
          <p
            className={cn(
              'mb-6 text-center text-xs font-semibold uppercase tracking-wider text-foreground/40',
              titleClassName
            )}
          >
            {title}
          </p>
        ) : (
          <div className={cn('mb-6', titleClassName)}>{title}</div>
        )
      )}

      {infiniteLoop ? (
        /* Continuous Smooth GPU Swiper Track with uniform LTR coordinate system */
        <div
          ref={containerRef}
          dir="ltr"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className={cn(
            'relative w-full overflow-hidden touch-pan-y select-none',
            draggable ? (isDraggingState ? 'cursor-grabbing' : 'cursor-grab') : '',
            fadeMask && '[mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]'
          )}
        >
          <div
            ref={trackRef}
            dir="ltr"
            className={cn('flex w-max items-center will-change-transform', trackClassName)}
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            {/* Loop 1 (Primary measurement track) */}
            <div
              ref={loop1Ref}
              className={cn('flex shrink-0 items-center justify-around', gapClass)}
              style={isNumericGap ? { gap: `${effectiveGap}px`, paddingRight: `${effectiveGap}px` } : undefined}
            >
              {renderTrackItems(1)}
            </div>

            {/* Loop 2 (Seamless loop replica) */}
            <div
              className={cn('flex shrink-0 items-center justify-around', gapClass)}
              style={isNumericGap ? { gap: `${effectiveGap}px`, paddingRight: `${effectiveGap}px` } : undefined}
              aria-hidden="true"
            >
              {renderTrackItems(2)}
            </div>

            {/* Loop 3 (Extended buffer for wide monitors & RTL right-scroll) */}
            <div
              className={cn('flex shrink-0 items-center justify-around', gapClass)}
              style={isNumericGap ? { gap: `${effectiveGap}px`, paddingRight: `${effectiveGap}px` } : undefined}
              aria-hidden="true"
            >
              {renderTrackItems(3)}
            </div>

            {/* Loop 4 (Extended buffer for ultra-wide monitors) */}
            <div
              className={cn('flex shrink-0 items-center justify-around', gapClass)}
              style={isNumericGap ? { gap: `${effectiveGap}px`, paddingRight: `${effectiveGap}px` } : undefined}
              aria-hidden="true"
            >
              {renderTrackItems(4)}
            </div>
          </div>

          {/* Left & Right Soft Gradient Overlays for High-End Fade Effect */}
          {fadeMask && (
            <>
              <div
                className={cn(
                  'pointer-events-none absolute inset-y-0 left-0 z-10 bg-gradient-to-r from-background to-transparent',
                  fadeWidthClass,
                  fadeGradientClass
                )}
                aria-hidden="true"
              />
              <div
                className={cn(
                  'pointer-events-none absolute inset-y-0 right-0 z-10 bg-gradient-to-l from-background to-transparent',
                  fadeWidthClass,
                  fadeGradientClass
                )}
                aria-hidden="true"
              />
            </>
          )}
        </div>
      ) : (
        /* Static responsive fallback when infiniteLoop is false */
        <div className="w-full">
          {children ? (
            <div className={cn('flex flex-wrap items-center justify-center', gapClass)}>
              {children}
            </div>
          ) : data && renderItem ? (
            <div className={cn('flex flex-wrap items-center justify-center', gapClass)}>
              {data.map((item, idx) => (
                <div key={keyExtractor ? keyExtractor(item, idx) : idx} className={itemClassName}>
                  {renderItem(item, idx)}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 items-center justify-center gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8">
              {effectiveLogos.map((client, idx) => (
                <div
                  key={`logo-static-${client.name}-${idx}`}
                  className={cn(
                    'group flex items-center justify-center p-2 transition-all duration-300 hover:scale-105',
                    !isNumericSize && currentSizeConfig?.item,
                    logoClassName,
                    itemClassName
                  )}
                  style={isNumericSize ? { height: `${logoSize}px` } : undefined}
                  title={client.name}
                >
                  <Image
                    src={client.src}
                    alt={client.name}
                    width={currentSizeConfig?.width || 190}
                    height={currentSizeConfig?.height || 70}
                    className={cn(
                      'object-contain opacity-65 grayscale contrast-125 transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0',
                      !isNumericSize && currentSizeConfig?.img
                    )}
                    style={isNumericSize ? { maxHeight: `${logoSize}px`, width: 'auto' } : undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Aliases for backwards compatibility and developer convenience
export const MarqueeWrapper = SwiperWrapper;
export const ClientLogosMarquee = SwiperWrapper;
