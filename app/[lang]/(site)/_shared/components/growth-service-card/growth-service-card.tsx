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
  SiPython,
} from 'react-icons/si';
import { FaSalesforce } from 'react-icons/fa6';
import { TbBrandAdobe } from 'react-icons/tb';

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
    case 'python':
      return <SiPython className={cn(iconClasses, !iconColor && 'text-[#3776AB]')} aria-hidden="true" />;
    case 'salesforce':
      return <FaSalesforce className={cn(iconClasses, !iconColor && 'text-[#00A1E0]')} aria-hidden="true" />;
    case 'adobe':
    case 'adobe-creative-cloud':
      return <TbBrandAdobe className={cn(iconClasses, !iconColor && 'text-[#DA1F26]')} aria-hidden="true" />;
    case 'canva':
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn(iconClasses, !iconColor && 'text-[#00C4CC]')}
          aria-hidden="true"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM6.962 7.68c.754 0 1.337.549 1.405 1.2.069.583-.171 1.097-.822 1.406-.343.171-.48.172-.549.069-.034-.069 0-.137.069-.206.617-.514.617-.926.548-1.508-.034-.378-.308-.618-.583-.618-1.2 0-2.914 2.674-2.674 4.629.103.754.549 1.646 1.509 1.646.308 0 .65-.103.96-.24.5-.264.799-.47 1.097-.8-.073-.885.704-2.046 1.851-2.046.515 0 .926.205.96.583.068.514-.377.582-.514.582s-.378-.034-.378-.17c-.034-.138.309-.07.275-.378-.035-.206-.24-.274-.446-.274-.72 0-1.131.994-1.029 1.611.035.275.172.549.447.549.205 0 .514-.31.617-.755.068-.308.343-.514.583-.514.102 0 .17.034.205.171v.138c-.034.137-.137.548-.102.651 0 .069.034.171.17.171.092 0 .436-.18.777-.459.117-.59.253-1.298.253-1.357.034-.24.137-.48.617-.48.103 0 .171.034.205.171v.138l-.136.617c.445-.583 1.097-.994 1.508-.994.172 0 .309.102.309.274 0 .103 0 .274-.069.446-.137.377-.309.96-.412 1.474 0 .137.035.274.207.274.171 0 .685-.206 1.096-.754l.007-.004c-.002-.068-.007-.134-.007-.202 0-.411.035-.754.104-.994.068-.274.411-.514.617-.514.103 0 .205.069.205.171 0 .035 0 .103-.034.137-.137.446-.24.857-.24 1.269 0 .24.034.582.102.788 0 .034.035.069.07.069.068 0 .548-.445.89-1.028-.308-.206-.48-.549-.48-.96 0-.72.446-1.097.858-1.097.343 0 .617.24.617.72 0 .308-.103.65-.274.96h.102a.77.77 0 0 0 .584-.24.293.293 0 0 1 .134-.117c.335-.425.83-.74 1.41-.74.48 0 .924.205.959.582.068.515-.378.618-.515.618l-.002-.002c-.138 0-.377-.035-.377-.172 0-.137.309-.068.274-.376-.034-.206-.24-.275-.446-.275-.686 0-1.13.891-1.028 1.611.034.275.171.583.445.583.206 0 .515-.308.652-.754.068-.274.343-.514.583-.514.103 0 .17.034.205.171 0 .069 0 .206-.137.652-.17.308-.171.48-.137.617.034.274.171.48.309.583.034.034.068.102.068.102 0 .069-.034.138-.137.138-.034 0-.068 0-.103-.035-.514-.205-.72-.548-.789-.891-.205.24-.445.377-.72.377-.445 0-.89-.411-.96-.926a1.609 1.609 0 0 1 .075-.649c-.203.13-.422.203-.623.203h-.17c-.447.652-.927 1.098-1.27 1.303a.896.896 0 0 1-.377.104c-.068 0-.171-.035-.205-.104-.095-.152-.156-.392-.193-.667-.481.527-1.145.805-1.453.805-.343 0-.548-.206-.582-.55v-.376c.102-.754.377-1.2.377-1.337a.074.074 0 0 0-.069-.07c-.24 0-1.028.824-1.166 1.373l-.103.445c-.068.309-.377.515-.582.515-.103 0-.172-.035-.206-.172v-.137l.046-.233c-.435.31-.87.508-1.075.508-.308 0-.48-.172-.514-.412-.206.274-.445.412-.754.412-.352 0-.696-.24-.862-.593-.244.275-.523.553-.852.764-.48.309-1.028.549-1.68.549-.582 0-1.097-.309-1.371-.583-.412-.377-.651-.96-.686-1.509-.205-1.68.823-3.84 2.4-4.8.378-.205.755-.343 1.132-.343zm9.77 3.291c-.104 0-.172.172-.172.343 0 .274.137.583.309.755a1.74 1.74 0 0 0 .102-.583c0-.343-.137-.515-.24-.515z" />
        </svg>
      );
    default:
      return <span className={cn('text-xs font-semibold', iconColor)}>{platform.charAt(0).toUpperCase()}</span>;
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
  python: {
    title: 'Python',
    defaultBg: 'bg-[#EAF2F8]',
    defaultColor: 'text-[#3776AB]',
  },
  salesforce: {
    title: 'Salesforce',
    defaultBg: 'bg-[#E6F6FC]',
    defaultColor: 'text-[#00A1E0]',
  },
  'adobe-creative-cloud': {
    title: 'Adobe Creative Cloud',
    defaultBg: 'bg-[#FDF0F1]',
    defaultColor: 'text-[#DA1F26]',
  },
  adobe: {
    title: 'Adobe',
    defaultBg: 'bg-[#FDF0F1]',
    defaultColor: 'text-[#DA1F26]',
  },
  canva: {
    title: 'Canva',
    defaultBg: 'bg-[#E6F9FA]',
    defaultColor: 'text-[#00C4CC]',
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
          <h3 className="mt-6 font-primary text-2xl font-medium text-foreground sm:text-3xl">
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
