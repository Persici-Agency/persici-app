import React from 'react';
import { cn } from '@shared/utils';
import { FadeUp } from '../fade-up';
import { platforms as platformsData } from '../../data';
import type {
  GrowthServiceCardProps,
  PlatformBadgeKey,
  GrowthServiceBadge,
  ServiceCardWidth,
} from '@shared/types';
import {
  SiMeta,
  SiTiktok,
  SiSnapchat,
  SiGoogleads,
  SiShopify,
} from 'react-icons/si';

// Helper to convert width property to responsive grid column span classes
export function getServiceCardWidthClass(width?: ServiceCardWidth): string {
  switch (width) {
    case 'full':
      return 'col-span-full md:col-span-2';
    case '1/2':
      return 'col-span-1 md:col-span-1';
    case '1/3':
      return 'col-span-1 md:col-span-1';
    case '2/3':
      return 'col-span-1 md:col-span-2';
    case '1/4':
      return 'col-span-1';
    case '3/4':
      return 'col-span-1 md:col-span-2';
    default:
      return width ? `col-span-${width}` : '';
  }
}

// Function to generate the platform icon element with customizable color
function getPlatformIcon(platform: string, iconColor?: string, customClassName?: string): React.ReactNode {
  const iconClasses = cn('h-5 w-5', iconColor, customClassName);

  switch (platform) {
    case 'meta':
    case 'meta-ads-manager':
      return <SiMeta className={cn(iconClasses, !iconColor && 'text-[#0866FF]')} aria-hidden="true" />;
    case 'tiktok':
      return <SiTiktok className={cn(iconClasses, !iconColor && 'text-black')} aria-hidden="true" />;
    case 'snapchat':
    case 'snapchat-ads':
      return <SiSnapchat className={cn(iconClasses, !iconColor && 'text-black')} aria-hidden="true" />;
    case 'google-ads':
    case 'googleAds':
      return <SiGoogleads className={cn(iconClasses, !iconColor && 'text-[#4285F4]')} aria-hidden="true" />;
    case 'shopify':
      return <SiShopify className={cn('h-6 w-6', iconColor, customClassName, !iconColor && 'text-[#95BF47]')} aria-hidden="true" />;
    default:
      return <span className={cn('text-xs font-bold', iconColor)}>{platform.charAt(0).toUpperCase()}</span>;
  }
}

// Default platform badge configuration
const PLATFORM_CONFIGS: Record<
  string,
  { title: string; defaultBg: string; defaultColor: string }
> = {
  meta: {
    title: 'Meta',
    defaultBg: 'bg-[#E8F0FE]',
    defaultColor: 'text-[#0866FF]',
  },
  tiktok: {
    title: 'TikTok',
    defaultBg: 'bg-[#FEECEC]',
    defaultColor: 'text-black',
  },
  snapchat: {
    title: 'Snapchat',
    defaultBg: 'bg-[#FFF9CC]',
    defaultColor: 'text-[#fcb900]',
  },
  'google-ads': {
    title: 'Google Ads',
    defaultBg: 'bg-[#E8F0FE]',
    defaultColor: 'text-[#4285F4]',
  },
  googleAds: {
    title: 'Google Ads',
    defaultBg: 'bg-[#E8F0FE]',
    defaultColor: 'text-[#4285F4]',
  },
  shopify: {
    title: 'Shopify',
    defaultBg: 'bg-[#EAF7EE]',
    defaultColor: 'text-[#95BF47]',
  },
};

export function GrowthServiceCard({
  title,
  description,
  platforms,
  badges,
  icons,
  width,
  iconColor: cardIconColor,
  iconBg: cardIconBg,
  iconClassName: cardIconClassName,
  tag,
  tagColor,
  dotColor,
  className,
  cardClassName,
  delay = 100,
  duration = 750,
  distance = 24,
}: GrowthServiceCardProps) {
  // Normalize badge rendering from platforms, badges, or direct icons
  const resolvedBadges: {
    key: string;
    title: string;
    bg: string;
    icon: React.ReactNode;
    className?: string;
  }[] = [];

  // 1. Resolve from `platforms` (keys or badge objects)
  if (platforms && platforms.length > 0) {
    platforms.forEach((item, idx) => {
      if (typeof item === 'string') {
        const platformObj = platformsData.find((p) => p.id === item);
        const config = PLATFORM_CONFIGS[item] || {
          title: platformObj?.title || item,
          defaultBg: platformObj?.bg || 'bg-black/5',
          defaultColor: platformObj?.color || '',
        };
        const activeColor = cardIconColor || config.defaultColor;
        const activeBg = cardIconBg || platformObj?.bg || config.defaultBg;

        let iconNode: React.ReactNode = null;
        if (platformObj?.icon && (platformObj.icon.startsWith('http') || platformObj.icon.startsWith('/'))) {
          iconNode = (
            <img
              src={platformObj.icon}
              alt={platformObj.title}
              className={cn('h-5 w-5 object-contain', cardIconClassName, platformObj.iconClassName)}
              loading="lazy"
            />
          );
        } else {
          iconNode = getPlatformIcon(item, activeColor, cardIconClassName);
        }

        resolvedBadges.push({
          key: `${item}-${idx}`,
          title: platformObj?.title || config.title,
          bg: activeBg,
          icon: iconNode,
          className: platformObj?.className,
        });
      } else if (typeof item === 'object' && item !== null) {
        const platformKey = item.platform || '';
        const platformObj = platformKey ? platformsData.find((p) => p.id === platformKey) : null;
        const config = platformKey ? PLATFORM_CONFIGS[platformKey] : null;
        const activeColor = item.color || item.iconColor || cardIconColor || platformObj?.color || config?.defaultColor;
        const activeBg = item.bg || cardIconBg || platformObj?.bg || config?.defaultBg || 'bg-black/5';

        let iconNode: React.ReactNode = item.icon || null;
        if (!iconNode && platformObj?.icon && (platformObj.icon.startsWith('http') || platformObj.icon.startsWith('/'))) {
          iconNode = (
            <img
              src={platformObj.icon}
              alt={platformObj.title}
              className={cn('h-5 w-5 object-contain', cardIconClassName, item.iconClassName || platformObj.iconClassName)}
              loading="lazy"
            />
          );
        } else if (!iconNode && platformKey) {
          iconNode = getPlatformIcon(platformKey, activeColor, item.iconClassName || cardIconClassName);
        }

        resolvedBadges.push({
          key: item.id || `${platformKey || 'badge'}-${idx}`,
          title: item.title || platformObj?.title || config?.title || '',
          bg: activeBg,
          icon: iconNode,
          className: item.className || platformObj?.className,
        });
      }
    });
  }

  // 2. Resolve from explicit `badges`
  if (badges && badges.length > 0) {
    badges.forEach((item, idx) => {
      const platformKey = item.platform || '';
      const config = platformKey ? PLATFORM_CONFIGS[platformKey] : null;
      const activeColor = item.color || item.iconColor || cardIconColor || config?.defaultColor;
      const activeBg = item.bg || cardIconBg || config?.defaultBg || 'bg-black/5';

      resolvedBadges.push({
        key: item.id || `custom-badge-${idx}`,
        title: item.title || config?.title || '',
        bg: activeBg,
        icon: item.icon || (platformKey ? getPlatformIcon(platformKey, activeColor, item.iconClassName || cardIconClassName) : null),
        className: item.className,
      });
    });
  }

  // 3. Resolve from explicit `icons`
  if (icons && icons.length > 0) {
    icons.forEach((iconNode, idx) => {
      resolvedBadges.push({
        key: `icon-${idx}`,
        title: '',
        bg: cardIconBg || 'bg-black/5',
        icon: iconNode,
      });
    });
  }

  const widthClass = getServiceCardWidthClass(width);

  return (
    <FadeUp
      delay={delay}
      duration={duration}
      distance={distance}
      className={cn('h-full', widthClass, className)}
    >
      <div
        className={cn(
          'flex h-full flex-col justify-between rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:border-persici-crimson/30 hover:shadow-xl sm:p-10',
          cardClassName
        )}
      >
        <div>
          {/* Tag (if present) */}
          {tag && (
            <div className={cn('mb-4 flex items-center gap-2 text-xs font-semibold', tagColor || 'text-persici-crimson')}>
              <span className={cn('inline-block h-2 w-2 rounded-full', dotColor || 'bg-persici-crimson')} />
              {tag}
            </div>
          )}

          {/* Platform / App Badges with dynamic icon & bg colors */}
          {resolvedBadges.length > 0 && (
            <div className="flex items-center gap-2.5">
              {resolvedBadges.slice(0, 8).map((badge) => (
                <div
                  key={badge.key}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl shadow-xs transition-transform duration-300 hover:scale-105',
                    badge.bg,
                    badge.className
                  )}
                  title={badge.title || undefined}
                >
                  {badge.icon}
                </div>
              ))}
            </div>
          )}

          {/* Service Title */}
          <h3 className="mt-6 font-primary text-2xl font-bold text-foreground sm:text-3xl">
            {title}
          </h3>

          {/* Service Description */}
          <p className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </FadeUp>
  );
}
