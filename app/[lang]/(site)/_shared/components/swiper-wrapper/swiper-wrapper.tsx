'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@shared/utils';

export type SwiperDirection = 'left' | 'right' | 'forward' | 'reverse';
export type SwiperSpeed = 'slow' | 'normal' | 'fast' | number;
export type SwiperGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface SwiperWrapperProps<T = unknown> {
  /** Optional React children to iterate over and animate */
  children?: React.ReactNode;
  /** Optional dataset to iterate over if using renderItem */
  data?: T[];
  /** Optional render function defining the component layout for each item */
  renderItem?: (item: T, index: number) => React.ReactNode;
  /** Optional custom key extractor for React list keys */
  keyExtractor?: (item: T, index: number) => string | number;
  /** Moving speed: 'slow', 'normal', 'fast', or duration in seconds (e.g. 50) */
  speed?: SwiperSpeed;
  /** Moving direction: 'left' (forward) or 'right' (reverse) */
  direction?: SwiperDirection;
  /** Whether the animation pauses when hovering over the marquee */
  stopOnHover?: boolean;
  /** Alias for stopOnHover */
  pauseOnHover?: boolean;
  /** Enable click and drag / touch drag to scrub through cards (default: true) */
  draggable?: boolean;
  /** Stop automatic moving while actively dragging (default: true) */
  stopOnDrag?: boolean;
  /** Enable throw / fling momentum physics on fast drag release (default: true) */
  enableMomentum?: boolean;
  /** Momentum friction decay factor between 0.85 and 0.98 (default: 0.94) */
  friction?: number;
  /** Gap between iterated cards */
  gap?: SwiperGap;
  /** Whether to render gradient fade masks on the left and right */
  fadeMask?: boolean;
  /** Custom gradient fade width class (default: 'w-20 sm:w-36 md:w-52') */
  fadeWidthClass?: string;
  /** Custom gradient fade background color class (default: 'from-background') */
  fadeGradientClass?: string;
  /** Outer container class */
  className?: string;
  /** Inner track row container class */
  trackClassName?: string;
  /** Individual item container class */
  itemClassName?: string;
  /** Optional section title or label placed above the swiper */
  title?: React.ReactNode;
}

const gapStyles: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> = {
  xs: 'gap-3 sm:gap-4 pe-3 sm:pe-4',
  sm: 'gap-4 sm:gap-6 pe-4 sm:pe-6',
  md: 'gap-6 sm:gap-8 pe-6 sm:pe-8',
  lg: 'gap-8 sm:gap-10 pe-8 sm:pe-10',
  xl: 'gap-10 sm:gap-12 pe-10 sm:pe-12',
};

function getSpeedPixelsPerSecond(speed: SwiperSpeed = 'normal'): number {
  if (typeof speed === 'number') {
    // If numeric duration in seconds provided, convert roughly to ~40-60 px/s
    return Math.max(10, 1800 / speed);
  }
  const map: Record<'slow' | 'normal' | 'fast', number> = {
    slow: 22,
    normal: 42,
    fast: 75,
  };
  return map[speed] || 42;
}

export function SwiperWrapper<T = unknown>({
  children,
  data,
  renderItem,
  keyExtractor,
  speed = 'normal',
  direction = 'left',
  stopOnHover = true,
  pauseOnHover,
  draggable = true,
  stopOnDrag = true,
  enableMomentum = true,
  friction = 0.94,
  gap = 'md',
  fadeMask = true,
  fadeWidthClass = 'w-20 sm:w-36 md:w-52',
  fadeGradientClass,
  className,
  trackClassName,
  itemClassName,
  title,
}: SwiperWrapperProps<T>) {
  const hasContent = Boolean(children || (data && data.length > 0));

  const shouldPauseOnHover = pauseOnHover !== undefined ? pauseOnHover : stopOnHover;
  const isReverse = direction === 'right' || direction === 'reverse';

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loop1Ref = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Physics animation state refs (avoid React re-render overhead during 60/120fps RAF loop)
  const offsetRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const startPointerXRef = useRef<number>(0);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const momentumVelocityRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);

  // Keep hover ref in sync
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  const isNumericGap = typeof gap === 'number';
  const gapClass = !isNumericGap ? gapStyles[gap as keyof typeof gapStyles] || gapStyles.md : '';

  // Calculate base speed in pixels/sec with RTL awareness
  const getBaseVelocity = useCallback((): number => {
    const pxPerSec = getSpeedPixelsPerSecond(speed);
    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

    // If RTL, reversing inverts naturally
    let mult = isReverse ? 1 : -1;
    if (isRTL) {
      mult = isReverse ? -1 : 1;
    }
    return mult * pxPerSec;
  }, [speed, isReverse]);

  // Main 60-120fps physics & animation loop
  useEffect(() => {
    if (!hasContent) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaSeconds = Math.min((currentTime - lastTime) / 1000, 0.08); // cap at 80ms to avoid huge jumps on tab switch
      lastTime = currentTime;

      const track = trackRef.current;
      const loop1 = loop1Ref.current;

      if (track && loop1) {
        const loopWidth = loop1.offsetWidth || 1;

        if (isDraggingRef.current) {
          // While actively dragging, position is controlled by pointer events
          // and auto-scrolling is paused
        } else {
          // Apply momentum velocity if present from a recent fling/throw
          if (Math.abs(momentumVelocityRef.current) > 0.5) {
            offsetRef.current += momentumVelocityRef.current * deltaSeconds;

            // Exponential friction decay
            const decay = Math.pow(Math.max(0.7, Math.min(0.99, friction)), deltaSeconds * 60);
            momentumVelocityRef.current *= decay;

            if (Math.abs(momentumVelocityRef.current) <= 0.5) {
              momentumVelocityRef.current = 0;
            }
          } else {
            // Normal continuous auto-scrolling
            momentumVelocityRef.current = 0;
            const isPausedByHover = shouldPauseOnHover && isHoveredRef.current;

            if (!isPausedByHover) {
              const baseVelocity = getBaseVelocity();
              offsetRef.current += baseVelocity * deltaSeconds;
            }
          }

          // Seamless infinite modulo wrapping
          // Keep offset normalized within [-loopWidth, 0] or [0, loopWidth]
          if (loopWidth > 0) {
            offsetRef.current = ((offsetRef.current % loopWidth) - loopWidth) % loopWidth;
          }
        }

        // Apply hardware-accelerated 3D transform
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasContent, getBaseVelocity, shouldPauseOnHover, friction]);

  // Pointer Event Handlers for Drag & Throw
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;

    // Capture pointer
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
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    const now = performance.now();
    const deltaX = currentX - lastPointerXRef.current;
    const deltaTime = Math.max(now - lastPointerTimeRef.current, 1);

    if (Math.abs(currentX - startPointerXRef.current) > 4) {
      hasMovedRef.current = true;
    }

    // Move track directly under pointer
    offsetRef.current += deltaX;

    // Wrap immediately during drag so track never runs out of cards
    const loopWidth = loop1Ref.current?.offsetWidth || 1;
    if (loopWidth > 0) {
      offsetRef.current = ((offsetRef.current % loopWidth) - loopWidth) % loopWidth;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }

    // Exponential moving average for velocity calculation (px / second)
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

    // If thrown with velocity and momentum is enabled, launch fling momentum
    if (enableMomentum) {
      const now = performance.now();
      const timeSinceLastMove = now - lastPointerTimeRef.current;

      // Only apply momentum if released while moving (within 100ms)
      if (timeSinceLastMove < 100 && Math.abs(velocityRef.current) > 30) {
        // Clamp maximum throw velocity for smooth, controlled motion
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

  const renderTrackItems = (loopIndex: number, isFirstLoop: boolean) => {
    if (children) {
      return children;
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
    return null;
  };

  if (!hasContent) return null;

  return (
    <div className={cn('relative w-full overflow-hidden py-3', className)}>
      {title && <div className="mb-6">{title}</div>}

      {/* Main Interactive Swiper Track Container */}
      <div
        ref={containerRef}
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
          className={cn('flex w-max items-center will-change-transform', trackClassName)}
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          {/* Loop 1 */}
          <div
            ref={loop1Ref}
            className={cn('flex shrink-0 items-center justify-around', gapClass)}
            style={isNumericGap ? { gap: `${gap}px`, paddingInlineEnd: `${gap}px` } : undefined}
          >
            {renderTrackItems(1, true)}
          </div>

          {/* Loop 2 (Seamless loop replica for continuous infinite scrolling) */}
          <div
            className={cn('flex shrink-0 items-center justify-around', gapClass)}
            style={isNumericGap ? { gap: `${gap}px`, paddingInlineEnd: `${gap}px` } : undefined}
            aria-hidden="true"
          >
            {renderTrackItems(2, false)}
          </div>
        </div>

        {/* Left & Right Soft Gradient Overlays for High-End Fade Effect */}
        {fadeMask && (
          <>
            <div
              className={cn(
                'pointer-events-none absolute inset-y-0 start-0 z-10 bg-gradient-to-r from-background to-transparent rtl:bg-gradient-to-l',
                fadeWidthClass,
                fadeGradientClass
              )}
              aria-hidden="true"
            />
            <div
              className={cn(
                'pointer-events-none absolute inset-y-0 end-0 z-10 bg-gradient-to-l from-background to-transparent rtl:bg-gradient-to-r',
                fadeWidthClass,
                fadeGradientClass
              )}
              aria-hidden="true"
            />
          </>
        )}
      </div>
    </div>
  );
}

// Aliases for developer convenience
export const MarqueeWrapper = SwiperWrapper;
