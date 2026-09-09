'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';

export interface CountUpProps {
  /**
   * Primary target value. Can be a number or a formatted string (e.g. 340, "+340%", "4.2x", "4,500").
   */
  end?: number | string;
  /**
   * Alias for `end` when passing a full string value directly.
   */
  value?: number | string;
  /**
   * Lowest / starting number for the count. Defaults to 0.
   */
  start?: number;
  /**
   * Text prepended before the first number (e.g. "+", "$").
   */
  prefix?: string;
  /**
   * Text appended after the first number (e.g. "%", "x", "k", "+").
   * Aliases: `successor`, `afterFix`.
   */
  suffix?: string;
  successor?: string;
  afterFix?: string;
  /**
   * Target value for an optional second number (for ranges like "10 - 50" or ratios).
   * Aliases: `secondNumber`, `end2`.
   */
  secondEnd?: number | string;
  secondNumber?: number | string;
  end2?: number | string;
  /**
   * Lowest / starting number for the second number. Defaults to 0.
   */
  secondStart?: number;
  start2?: number;
  /**
   * Prefix for the second number.
   */
  secondPrefix?: string;
  /**
   * Successor / suffix for the second number.
   * Aliases: `secondSuccessor`, `secondAfterFix`.
   */
  secondSuffix?: string;
  secondSuccessor?: string;
  secondAfterFix?: string;
  /**
   * Separation character between the two numbers (e.g. " - ", " / ", "to", "–").
   * Alias: `separationCharacter`. Defaults to " - ".
   */
  separator?: string;
  separationCharacter?: string;
  /**
   * Number of decimal places to preserve (e.g. 1 for "4.2"). Auto-detected if omitted.
   */
  decimals?: number;
  /**
   * Decimal places for the second number. Auto-detected if omitted.
   */
  secondDecimals?: number;
  /**
   * Decimal separator character. Defaults to ".".
   */
  decimalSeparator?: string;
  /**
   * Thousands separator character (e.g. ","). Defaults to empty or auto-detected if present in value.
   */
  thousandsSeparator?: string;
  /**
   * Duration of the count-up animation in milliseconds. Defaults to 2000ms.
   */
  duration?: number;
  /**
   * Delay in milliseconds before counting starts. Defaults to 0ms.
   */
  delay?: number;
  /**
   * Whether the animation should trigger when entering the viewport. Defaults to true.
   */
  viewportTrigger?: boolean;
  /**
   * Whether to animate only once when entering the viewport. Defaults to true.
   */
  once?: boolean;
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * HTML element tag to render as. Defaults to "span".
   */
  as?: React.ElementType;
  /**
   * Optional render prop function for custom markup.
   */
  children?: ((value: string) => React.ReactNode) | React.ReactNode;
}

/**
 * Parses raw numeric or formatted string values (e.g. "+340%", "4.2x", "4,500", "10 - 50%").
 */
function parseRawNumber(input: number | string | undefined): {
  numberVal: number;
  prefix: string;
  suffix: string;
  decimals: number;
  hasThousands: boolean;
} {
  if (input === undefined || input === null || input === '') {
    return { numberVal: 0, prefix: '', suffix: '', decimals: 0, hasThousands: false };
  }

  if (typeof input === 'number') {
    const dec = input % 1 !== 0 ? input.toString().split('.')[1]?.length || 0 : 0;
    return { numberVal: input, prefix: '', suffix: '', decimals: dec, hasThousands: false };
  }

  const str = String(input).trim();
  const match = str.match(/^([^\d.-]*)([-+]?[0-9,]+(?:\.[0-9]+)?)(.*)$/);

  if (!match) {
    const fallbackNum = parseFloat(str) || 0;
    return { numberVal: fallbackNum, prefix: '', suffix: '', decimals: 0, hasThousands: false };
  }

  const [, rawPrefix, numPart, rawSuffix] = match;
  const hasThousands = numPart.includes(',');
  const cleanNumStr = numPart.replace(/,/g, '');
  const numberVal = parseFloat(cleanNumStr) || 0;
  const dec = cleanNumStr.includes('.') ? cleanNumStr.split('.')[1]?.length || 0 : 0;

  return {
    numberVal,
    prefix: rawPrefix,
    suffix: rawSuffix,
    decimals: dec,
    hasThousands,
  };
}

/**
 * Formats a number with decimals, decimal separator, and optional thousands separator.
 */
function formatNumber(
  val: number,
  decimals: number,
  decimalSep: string = '.',
  thousandsSep: string = ''
): string {
  let fixed =
    Math.abs(val) < 0.000001 ? (0).toFixed(decimals) : val.toFixed(decimals);
  if (fixed === '-0' || (fixed.startsWith('-0.') && parseFloat(fixed) === 0)) {
    fixed = fixed.replace('-', '');
  }
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = thousandsSep
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep)
    : intPart;
  return decPart !== undefined ? `${formattedInt}${decimalSep}${decPart}` : formattedInt;
}

/**
 * Smooth cubic ease-out function: accelerates fast and gently decelerates to target.
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * React Hook for programmatic count-up operations.
 */
export function useCountUp(props: CountUpProps) {
  const targetRaw = props.value !== undefined ? props.value : props.end;
  const parsed1 = useMemo(() => parseRawNumber(targetRaw), [targetRaw]);

  const target2Raw =
    props.secondEnd !== undefined
      ? props.secondEnd
      : props.secondNumber !== undefined
        ? props.secondNumber
        : props.end2;

  const parsed2 = useMemo(
    () => (target2Raw !== undefined ? parseRawNumber(target2Raw) : null),
    [target2Raw]
  );

  const start1 = props.start ?? 0;
  const end1 = parsed1.numberVal;
  const prefix1 = props.prefix ?? parsed1.prefix;
  const suffix1 = props.suffix ?? props.successor ?? props.afterFix ?? parsed1.suffix;
  const decimals1 = props.decimals ?? parsed1.decimals;

  const hasSecond = parsed2 !== null;
  const start2 = props.secondStart ?? props.start2 ?? 0;
  const end2 = parsed2 ? parsed2.numberVal : 0;
  const prefix2 = props.secondPrefix ?? (parsed2 ? parsed2.prefix : '');
  const suffix2 =
    props.secondSuffix ??
    props.secondSuccessor ??
    props.secondAfterFix ??
    (parsed2 ? parsed2.suffix : '');
  const decimals2 = props.secondDecimals ?? (parsed2 ? parsed2.decimals : 0);

  const separator = props.separator ?? props.separationCharacter ?? ' - ';
  const decimalSeparator = props.decimalSeparator ?? '.';
  const thousandsSeparator =
    props.thousandsSeparator ?? (parsed1.hasThousands ? ',' : '');

  const duration = props.duration ?? 2000;
  const delay = props.delay ?? 0;
  const viewportTrigger = props.viewportTrigger ?? true;
  const once = props.once ?? true;

  // Compute full formatted target representation
  const finalString = useMemo(() => {
    const formatted1 = `${prefix1}${formatNumber(end1, decimals1, decimalSeparator, thousandsSeparator)}${suffix1}`;
    if (!hasSecond) return formatted1;
    const formatted2 = `${prefix2}${formatNumber(end2, decimals2, decimalSeparator, thousandsSeparator)}${suffix2}`;
    return `${formatted1}${separator}${formatted2}`;
  }, [
    prefix1,
    end1,
    decimals1,
    decimalSeparator,
    thousandsSeparator,
    suffix1,
    hasSecond,
    prefix2,
    end2,
    decimals2,
    suffix2,
    separator,
  ]);

  // Initial lowest/starting formatted string
  const initialString = useMemo(() => {
    const formatted1 = `${prefix1}${formatNumber(start1, decimals1, decimalSeparator, thousandsSeparator)}${suffix1}`;
    if (!hasSecond) return formatted1;
    const formatted2 = `${prefix2}${formatNumber(start2, decimals2, decimalSeparator, thousandsSeparator)}${suffix2}`;
    return `${formatted1}${separator}${formatted2}`;
  }, [
    prefix1,
    start1,
    decimals1,
    decimalSeparator,
    thousandsSeparator,
    suffix1,
    hasSecond,
    prefix2,
    start2,
    decimals2,
    suffix2,
    separator,
  ]);

  const [displayValue, setDisplayValue] = useState<string>(initialString);
  const containerRef = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    // Respect user reduced-motion setting
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const raf = requestAnimationFrame(() => {
        setDisplayValue(finalString);
      });
      return () => cancelAnimationFrame(raf);
    }

    let isCancelled = false;
    let animId: number | null = null;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const runCountAnimation = () => {
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (isCancelled) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = duration > 0 ? Math.min(1, elapsed / duration) : 1;
        const easedProgress = easeOutCubic(progress);

        const currentVal1 = start1 + (end1 - start1) * easedProgress;
        const formatted1 = `${prefix1}${formatNumber(currentVal1, decimals1, decimalSeparator, thousandsSeparator)}${suffix1}`;

        let currentDisplay = formatted1;
        if (hasSecond) {
          const currentVal2 = start2 + (end2 - start2) * easedProgress;
          const formatted2 = `${prefix2}${formatNumber(currentVal2, decimals2, decimalSeparator, thousandsSeparator)}${suffix2}`;
          currentDisplay = `${formatted1}${separator}${formatted2}`;
        }

        setDisplayValue(currentDisplay);

        if (progress < 1) {
          animId = requestAnimationFrame(animate);
        } else {
          setDisplayValue(finalString);
          hasAnimatedRef.current = true;
        }
      };

      if (delay > 0) {
        timerId = setTimeout(() => {
          if (!isCancelled) animId = requestAnimationFrame(animate);
        }, delay);
      } else {
        animId = requestAnimationFrame(animate);
      }
    };

    if (!viewportTrigger) {
      runCountAnimation();
      return () => {
        isCancelled = true;
        if (timerId) clearTimeout(timerId);
        if (animId) cancelAnimationFrame(animId);
      };
    }

    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      runCountAnimation();
      return () => {
        isCancelled = true;
        if (timerId) clearTimeout(timerId);
        if (animId) cancelAnimationFrame(animId);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasAnimatedRef.current || !once) {
            runCountAnimation();
          }
          if (once) {
            observer.unobserve(node);
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => {
      isCancelled = true;
      observer.disconnect();
      if (timerId) clearTimeout(timerId);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [
    start1,
    end1,
    prefix1,
    suffix1,
    decimals1,
    start2,
    end2,
    prefix2,
    suffix2,
    decimals2,
    hasSecond,
    separator,
    decimalSeparator,
    thousandsSeparator,
    duration,
    delay,
    viewportTrigger,
    once,
    finalString,
  ]);

  return {
    value: displayValue,
    containerRef,
  };
}

/**
 * CountUp Component: Animate numeric statistics, metrics, ranges, and ratios smoothly on viewport entry.
 *
 * Examples:
 * - Single stat: `<CountUp value="+340%" />`
 * - Decimal stat: `<CountUp end={4.2} decimals={1} suffix="x" />`
 * - Dual numbers/range: `<CountUp start={0} end={10} secondEnd={50} separator=" - " suffix="%" />`
 * - Thousands separator: `<CountUp end={4500} thousandsSeparator="," />`
 */
export function CountUp({
  as: Component = 'span',
  className,
  children,
  ...props
}: CountUpProps) {
  const { value, containerRef } = useCountUp(props);

  return (
    <Component
      ref={containerRef}
      className={className}
    >
      {typeof children === 'function' ? children(value) : value}
    </Component>
  );
}
