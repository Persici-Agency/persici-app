import Image from 'next/image';
import type { SocialProofProps, AvatarSize } from '@shared/types';
import { socialProofAvatars } from '@shared/data';
import { cn } from '@shared/utils';

const sizeClasses: Record<Extract<AvatarSize, string>, string> = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export function AvatarSocialProof({
  avatars = socialProofAvatars,
  ratingLabel,
  rating,
  stars,
  starsCount = 5,
  className,
  avatarContainerClassName,
  avatarClassName,
  starsClassName,
  labelClassName,
  size = 'sm',
}: SocialProofProps) {
  const sizeClass = typeof size === 'string' ? sizeClasses[size] || sizeClasses.sm : '';
  const inlineSizeStyle = typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined;

  const renderStars = () => {
    if (stars) return stars;
    if (typeof rating === 'number') {
      return '★'.repeat(Math.max(1, Math.min(5, Math.round(rating))));
    }
    if (typeof rating === 'string') {
      return rating;
    }
    return '★'.repeat(starsCount);
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Avatar Stack */}
      {avatars && avatars.length > 0 && (
        <div className={cn('flex -space-x-2 rtl:space-x-reverse', avatarContainerClassName)}>
          {avatars.map((item, index) => {
            const src = typeof item === 'string' ? item : item.src;
            const alt = typeof item === 'string' ? `Client avatar ${index + 1}` : (item.alt || `Client avatar ${index + 1}`);

            return (
              <div
                key={typeof item !== 'string' && item.id ? item.id : index}
                style={inlineSizeStyle}
                className={cn(
                  'relative overflow-hidden rounded-full border-2 border-white shrink-0',
                  sizeClass,
                  avatarClassName
                )}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Stars & Rating Label */}
      {(ratingLabel || rating || stars) && (
        <div className="text-start">
          <div className={cn('flex items-center text-amber-500 text-xs', starsClassName)}>
            {renderStars()}
          </div>
          {ratingLabel && (
            <span className={cn('text-[11px] font-medium text-foreground/70', labelClassName)}>
              {ratingLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Alias for convenience
export const SocialProof = AvatarSocialProof;
