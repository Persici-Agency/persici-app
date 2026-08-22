import Image from 'next/image';
import { getClientLogos } from '@shared/services';
import type { ClientLogosMarqueeProps, MarqueeGap, MarqueeSpeed } from '@shared/types';
import { cn } from '@shared/utils';

const sizeStyles: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', { item: string; img: string; width: number; height: number }> = {
  xs: { item: 'h-12 w-28 sm:w-32', img: 'max-h-8 sm:max-h-9 w-auto', width: 120, height: 40 },
  sm: { item: 'h-16 w-36 sm:w-40', img: 'max-h-11 sm:max-h-12 w-auto', width: 150, height: 50 },
  md: { item: 'h-20 sm:h-24 w-44 sm:w-52 lg:w-56', img: 'max-h-14 sm:max-h-16 lg:max-h-18 w-auto', width: 190, height: 70 },
  lg: { item: 'h-24 sm:h-28 w-52 sm:w-60 lg:w-64', img: 'max-h-18 sm:max-h-20 lg:max-h-22 w-auto', width: 220, height: 85 },
  xl: { item: 'h-28 sm:h-32 w-60 sm:w-72 lg:w-80', img: 'max-h-22 sm:max-h-24 lg:max-h-28 w-auto', width: 260, height: 100 },
};

const gapStyles: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> = {
  xs: 'gap-3 sm:gap-4 lg:gap-6 pe-3 sm:pe-4 lg:pe-6',
  sm: 'gap-5 sm:gap-7 lg:gap-9 pe-5 sm:pe-7 lg:pe-9',
  md: 'gap-8 sm:gap-10 lg:gap-12 pe-8 sm:pe-10 lg:pe-12',
  lg: 'gap-10 sm:gap-14 lg:gap-16 pe-10 sm:pe-14 lg:pe-16',
  xl: 'gap-14 sm:gap-18 lg:gap-22 pe-14 sm:pe-18 lg:pe-22',
};

function getSpeedDuration(speed: MarqueeSpeed = 'normal'): string {
  if (typeof speed === 'number') return `${speed}s`;
  const map: Record<'slow' | 'normal' | 'fast', string> = {
    slow: '110s',
    normal: '70s',
    fast: '45s',
  };
  return map[speed] || '70s';
}

export function ClientLogosMarquee({
  title,
  titleClassName,
  className,
  logoClassName,
  showTitle = true,
  logoSize = 'md',
  speed = 'normal',
  gap = 'sm',
  space,
  infiniteLoop = true,
  pauseOnHover,
  stopOnHover = false,
  fadeMask = true,
  direction = 'left',
}: ClientLogosMarqueeProps) {
  const logos = getClientLogos();
  const animationDuration = getSpeedDuration(speed);

  const shouldPauseOnHover = stopOnHover || (pauseOnHover ?? false);

  const effectiveGap: MarqueeGap = space ?? gap;
  const isNumericGap = typeof effectiveGap === 'number';
  const gapClass = !isNumericGap ? gapStyles[effectiveGap as keyof typeof gapStyles] || gapStyles.sm : '';

  const isNumericSize = typeof logoSize === 'number';
  const currentSizeConfig = isNumericSize ? null : sizeStyles[logoSize as keyof typeof sizeStyles] || sizeStyles.md;

  const animationClass = direction === 'right' ? 'animate-marquee-reverse' : 'animate-marquee';

  const trackInlineStyle = {
    animationDuration,
    ...(isNumericGap ? { gap: `${effectiveGap}px`, paddingInlineEnd: `${effectiveGap}px` } : {}),
  };

  return (
    <div className={cn('w-full overflow-hidden py-6', className)}>
      {showTitle && title && (
        <p className={cn("mb-8 text-center text-xs font-semibold uppercase tracking-wider text-foreground/40", titleClassName)}>
          {title}
        </p>
      )}

      {/* If infiniteLoop is enabled, render continuous smooth GPU dual-track marquee */}
      {infiniteLoop ? (
        <div
          className={cn(
            'relative w-full overflow-hidden',
            fadeMask && '[mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]',
            shouldPauseOnHover && 'pause-on-hover'
          )}
        >
          <div className="flex w-max items-center select-none">
            {/* Loop 1 */}
            <div
              className={cn(
                'flex shrink-0 items-center justify-around',
                gapClass,
                animationClass
              )}
              style={trackInlineStyle}
            >
              {logos.map((client, idx) => (
                <div
                  key={`logo-track1-${client.name}-${idx}`}
                  className={cn(
                    'group flex items-center justify-center transition-all duration-300 hover:scale-105',
                    !isNumericSize && currentSizeConfig?.item,
                    logoClassName
                  )}
                  style={isNumericSize ? { height: `${logoSize}px`, width: `${(logoSize as number) * 3}px` } : undefined}
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

            {/* Loop 2 (exact duplicate with identical spacing for 100% seamless, glitch-free continuous animation) */}
            <div
              className={cn(
                'flex shrink-0 items-center justify-around',
                gapClass,
                animationClass
              )}
              style={trackInlineStyle}
              aria-hidden="true"
            >
              {logos.map((client, idx) => (
                <div
                  key={`logo-track2-${client.name}-${idx}`}
                  className={cn(
                    'group flex items-center justify-center transition-all duration-300 hover:scale-105',
                    !isNumericSize && currentSizeConfig?.item,
                    logoClassName
                  )}
                  style={isNumericSize ? { height: `${logoSize}px`, width: `${(logoSize as number) * 3}px` } : undefined}
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
          </div>
        </div>
      ) : (
        /* Static responsive grid fallback when infiniteLoop is false */
        <div className="grid grid-cols-2 items-center justify-center gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8">
          {logos.map((client, idx) => (
            <div
              key={`logo-static-${client.name}-${idx}`}
              className={cn(
                'group flex items-center justify-center p-2 transition-all duration-300 hover:scale-105',
                !isNumericSize && currentSizeConfig?.item,
                logoClassName
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
  );
}
