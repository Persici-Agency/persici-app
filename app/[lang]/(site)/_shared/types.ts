import type { Dictionary } from "@dictionaries";

// ============================================================================
// MongoDB Base Document & API Contracts
// ============================================================================
export interface BaseMongoDocument {
  _id?: string;
  id?: string | number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ============================================================================
// Layout & Global Components Types
// ============================================================================
export type HeaderProps = {
  lang: string;
  dict: Dictionary;
};

export type FooterProps = {
  lang: string;
  dict: Dictionary;
};

export type NavLink = {
  key: string;
  href: string;
  labelKey?: string;
  isExternal?: boolean;
};

export type PartnerBadge = {
  name: string;
  tier: string;
  icon: string;
  color: string;
};

export type HomeButtonProps = {
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: (e?: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  iconClassName?: string;
  isLangEffectIcon?: boolean;
  currentLang?: string;
  iconDirection?: string;
};

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
export type MarqueeSpeed = 'slow' | 'normal' | 'fast' | number;
export type MarqueeGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export type ClientLogosMarqueeProps = {
  title?: string;
  titleClassName?: string;
  className?: string;
  logoClassName?: string;
  showTitle?: boolean;
  logoSize?: LogoSize;
  speed?: MarqueeSpeed;
  gap?: MarqueeGap;
  space?: MarqueeGap;
  infiniteLoop?: boolean;
  pauseOnHover?: boolean;
  stopOnHover?: boolean;
  fadeMask?: boolean;
  direction?: 'left' | 'right';
  logos?: ClientLogo[];
};

// ============================================================================
// Domain Entities & MongoDB Schemas
// ============================================================================

// 1. Client Logos
export interface ClientLogo extends BaseMongoDocument {
  name: string;
  src: string;
  website?: string;
  order?: number;
  isActive?: boolean;
}

// 2. Social Proof & Ratings
export interface SocialProofAvatar extends BaseMongoDocument {
  src: string;
  alt?: string;
  name?: string;
}

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | number;

export type SocialProofProps = {
  avatars?: (string | SocialProofAvatar)[];
  ratingLabel?: React.ReactNode;
  rating?: number | string;
  stars?: React.ReactNode;
  starsCount?: number;
  className?: string;
  avatarContainerClassName?: string;
  avatarClassName?: string;
  starsClassName?: string;
  labelClassName?: string;
  size?: AvatarSize;
};

export type AvatarSocialProofProps = SocialProofProps;

// 3. Testimonials & Partner Showcase
export interface TestimonialItem extends BaseMongoDocument {
  quote: string;
  author: string;
  role: string;
  company: string;
  metric?: string;
  avatar?: string;
  videoUrl?: string;
  rating?: number;
  isFeatured?: boolean;
  order?: number;
}

export type Testimonial = TestimonialItem;

export interface PartnerShowcaseData extends BaseMongoDocument {
  title?: string;
  videoSpeaker: string;
  videoRole: string;
  speakerAvatar?: string;
  videoCoverImage: string;
  quote: string;
  author: string;
  role?: string;
  company: string;
  videoUrl?: string;
  testimonials?: TestimonialItem[];
}

export type DarkTestimonialCardProps = {
  dict: Dictionary;
  autoPlayInterval?: number;
  className?: string;
  testimonials?: TestimonialItem[];
};

// 4. Video Testimonials Carousel
export interface VideoTestimonialItem extends BaseMongoDocument {
  name: string;
  role: string;
  company: string;
  quote: string;
  image: string;
  videoUrl?: string;
  duration?: string;
  category?: string;
  order?: number;
}

export type VideoTestimonial = VideoTestimonialItem;

// 5. Heritage Section
export interface HeritageCollageItem extends BaseMongoDocument {
  src: string;
  alt: string;
  aspect: string;
  order?: number;
}

// 6. Growth Services (Home & Catalog)
export type PlatformBadgeKey = 'meta' | 'tiktok' | 'snapchat' | 'google-ads' | 'googleAds' | 'shopify' | string;
export type ServiceCardWidth = 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | string;

export interface GrowthServiceBadge {
  id?: string;
  title?: string;
  icon?: React.ReactNode;
  platform?: PlatformBadgeKey;
  bg?: string;
  color?: string;
  iconColor?: string;
  className?: string;
  iconClassName?: string;
}

export interface GrowthServiceCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  platforms?: (PlatformBadgeKey | GrowthServiceBadge)[];
  badges?: GrowthServiceBadge[];
  icons?: React.ReactNode[];
  width?: ServiceCardWidth;
  iconColor?: string;
  iconBg?: string;
  iconClassName?: string;
  tag?: string;
  tagColor?: string;
  dotColor?: string;
  className?: string;
  cardClassName?: string;
  delay?: number;
  duration?: number;
  distance?: number;
}

export interface GrowthServiceItem extends BaseMongoDocument {
  key?: string;
  tag: string;
  title: string;
  description: string;
  tagColor?: string;
  dotColor?: string;
  platforms?: (PlatformBadgeKey | GrowthServiceBadge)[];
  width?: ServiceCardWidth;
  iconColor?: string;
  iconBg?: string;
  order?: number;
}

export interface ServiceItem extends BaseMongoDocument {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  tag?: string;
  features?: string[];
  order?: number;
  isActive?: boolean;
}

// 7. Approach & Team
export interface GrowthTeamMember extends BaseMongoDocument {
  name?: string;
  role?: string;
  avatar: string;
  alt?: string;
}

// 8. Reviews
export interface ReviewItem extends BaseMongoDocument {
  name: string;
  role?: string;
  company: string;
  review: string;
  verified?: string;
  rating?: number;
  date?: string;
  isVerified?: boolean;
  order?: number;
}

// 9. Discovery Form & Lead Generation
export interface DiscoveryRevenueOption {
  value: string;
  labelKey: string;
  label?: string;
}

export interface DiscoveryFormData {
  firstName: string;
  lastName: string;
  email: string;
  website: string;
  revenue: string;
}

export interface DiscoverySubmission extends BaseMongoDocument, DiscoveryFormData {
  status?: 'pending' | 'contacted' | 'qualified' | 'closed';
  notes?: string;
}

// 10. Core Principles / About Values
export interface AboutValueItem extends BaseMongoDocument {
  title: string;
  description: string;
  icon: string;
  order?: number;
}

export type ValueItem = AboutValueItem;

// 11. Careers & Job Openings
export interface JobOpening extends BaseMongoDocument {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryRange?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  isActive?: boolean;
}

// 12. Insights / Articles
export interface InsightArticle extends BaseMongoDocument {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
  tags?: string[];
  publishedAt?: string;
  isActive?: boolean;
}

// 13. Projects / Portfolio Case Studies
export interface ProjectItem extends BaseMongoDocument {
  slug: string;
  title: string;
  client?: string;
  category: string;
  result: string;
  description: string;
  image: string;
  gallery?: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
  challenge?: string;
  solution?: string;
  impact?: string;
  tags?: string[];
  order?: number;
  isFeatured?: boolean;
}

// 14. Contact & Global Offices
export interface ContactOffice extends BaseMongoDocument {
  city: string;
  address: string;
  email: string;
  phone: string;
  isHQ?: boolean;
  order?: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
}

export interface ContactSubmission extends BaseMongoDocument, ContactFormData {
  status?: 'unread' | 'read' | 'replied';
}