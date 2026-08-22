'use client';

import React, { ElementType, useEffect, useRef, useState, ComponentPropsWithoutRef } from 'react';

export type FadeUpProps<T extends ElementType = 'div'> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in ms (e.g. 100, 200)
  duration?: number; // Duration in ms (default: 700)
  distance?: number; // TranslateY distance in px (default: 20)
  blur?: boolean; // Subtle blur reveal (default: false)
  threshold?: number; // Intersection threshold (default: 0.05)
  rootMargin?: string; // Intersection root margin (default: '0px 0px -20px 0px')
  style?: React.CSSProperties;
} & ComponentPropsWithoutRef<T>;

export function FadeUp<T extends ElementType = 'div'>({
  as,
  children,
  className = '',
  delay = 0,
  duration = 700,
  distance = 20,
  blur = false,
  threshold = 0.05,
  rootMargin = '0px 0px -20px 0px',
  style,
  ...rest
}: FadeUpProps<T>) {
  const Component = (as || 'div') as ElementType;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const animationStyle: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : `translateY(${distance}px)`,
    filter: blur ? (isVisible ? 'blur(0px)' : 'blur(4px)') : undefined,
    transitionProperty: blur ? 'opacity, transform, filter' : 'opacity, transform',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: `${delay}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
    ...style,
  };

  return (
    <Component
      ref={ref}
      className={className}
      style={animationStyle}
      {...rest}
    >
      {children}
    </Component>
  );
}
