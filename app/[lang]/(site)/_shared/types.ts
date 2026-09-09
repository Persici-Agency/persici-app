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

export type NavSubItem = {
  key: string;
  href: string;
  labelKey?: string;
  icon?: string;
  description?: string;
};

export type NavLink = {
  key: string;
  href: string;
  labelKey?: string;
  isExternal?: boolean;
  hasDropdown?: boolean;
  subItems?: NavSubItem[];
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
export type SwiperSpeed = 'slow' | 'normal' | 'fast' | number;
export type SwiperGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
export type SwiperDirection = 'left' | 'right' | 'forward' | 'reverse';

// Legacy aliases
export type MarqueeSpeed = SwiperSpeed;
export type MarqueeGap = SwiperGap;

export interface SwiperWrapperProps<T = unknown> {
  children?: React.ReactNode;
  data?: T[];
  logos?: ClientLogo[];
  renderItem?: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  speed?: SwiperSpeed;
  direction?: SwiperDirection;
  pauseOnHover?: boolean;
  draggable?: boolean;
  stopOnDrag?: boolean;
  enableMomentum?: boolean;
  friction?: number;
  gap?: SwiperGap;
  space?: SwiperGap;
  infiniteLoop?: boolean;
  fadeMask?: boolean;
  fadeWidthClass?: string;
  fadeGradientClass?: string;
  className?: string;
  trackClassName?: string;
  itemClassName?: string;
  title?: React.ReactNode;
  titleClassName?: string;
  showTitle?: boolean;
  logoSize?: LogoSize;
  logoClassName?: string;
}

export type ClientLogosMarqueeProps = SwiperWrapperProps<ClientLogo>;

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
  enSubService?: string;
  arSubService?: string;
  enTitle?: string;
  enDescription?: string;
  arTitle?: string;
  arDescription?: string;
  tagColor?: string;
  dotColor?: string;
  platforms?: (PlatformBadgeKey | GrowthServiceBadge)[];
  width?: ServiceCardWidth;
  iconColor?: string;
  iconBg?: string;
  order?: number;
}

export interface platformsType extends BaseMongoDocument {
  id: string;
  title: string;
  icon: string;
  bg?: string;
  color?: string;
  iconColor?: string;
  isFeatured: boolean;
  className?: string;
  iconClassName?: string;
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

// ============================================================================
// 15. Page Content CMS Interfaces (for Dynamic MongoDB & Dashboard Editing)
// ============================================================================

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface HeroSectionContent {
  title: LocalizedString;
  subtitle: LocalizedString;
  ctaText: LocalizedString;
  ctaHref: string;
  ratingScore: string;
  ratingLabel: LocalizedString;
  trustedByTitle: LocalizedString;
}

export interface PartnerShowcaseSectionContent {
  title: LocalizedString;
  videoSpeaker: LocalizedString;
  videoRole: LocalizedString;
  speakerAvatar?: string;
  videoCoverImage: string;
  videoUrl?: string;
  quote: LocalizedString;
  author: string;
  role: LocalizedString;
  company: string;
  testimonials?: TestimonialItem[];
}

export interface HeritageSectionContent {
  badge: LocalizedString;
  title: LocalizedString;
  desc1: LocalizedString;
  desc2: LocalizedString;
  ctaPrimaryText: LocalizedString;
  ctaPrimaryHref: string;
  ctaSecondaryText: LocalizedString;
  ctaSecondaryHref: string;
  collageImages: HeritageCollageItem[];
}

export interface GrowthServicesSectionContent {
  title: LocalizedString;
  ratingText: LocalizedString;
  bannerText: LocalizedString;
  bannerCtaText: LocalizedString;
  bannerCtaHref: string;
  services: GrowthServiceItem[];
}

export interface ClientVideosSectionContent {
  title: LocalizedString;
  videos: VideoTestimonialItem[];
}

export interface ApproachSectionContent {
  badgeLabel: LocalizedString;
  badgeTitle: LocalizedString;
  title: LocalizedString;
  desc1: LocalizedString;
  desc2: LocalizedString;
  ctaPrimaryText: LocalizedString;
  ctaPrimaryHref: string;
  ctaSecondaryText: LocalizedString;
  ctaSecondaryHref: string;
  teamMembers: GrowthTeamMember[];
}

export interface ReviewsSectionContent {
  score: string;
  scoreLabel: LocalizedString;
  title: LocalizedString;
  bannerText: LocalizedString;
  bannerCtaText: LocalizedString;
  bannerCtaHref: string;
  reviews: ReviewItem[];
}

export interface HomeContactSectionContent {
  leftTitle: LocalizedString;
  points: LocalizedString[];
  trustedBy: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
}

export interface DiscoverySectionContent {
  title: LocalizedString;
  desc: LocalizedString;
  quote: LocalizedString;
  quoteAuthor: string;
  quoteRole: LocalizedString;
  revenueOptions: DiscoveryRevenueOption[];
}

export interface HomePageContent extends BaseMongoDocument {
  page: 'home';
  hero: HeroSectionContent;
  partnerShowcase: PartnerShowcaseSectionContent;
  heritage: HeritageSectionContent;
  growthServices: GrowthServicesSectionContent;
  clientVideos: ClientVideosSectionContent;
  approach: ApproachSectionContent;
  reviews: ReviewsSectionContent;
  homeContact: HomeContactSectionContent;
  discovery: DiscoverySectionContent;
}

export interface ServicesPageContent extends BaseMongoDocument {
  page: 'services';
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  bannerText: LocalizedString;
  bannerCtaText: LocalizedString;
  servicesList: ServiceItem[];
}

export interface WorkPageContent extends BaseMongoDocument {
  page: 'work';
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  projectsList: ProjectItem[];
}

export interface ContactPageContent extends BaseMongoDocument {
  page: 'contact';
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  offices: ContactOffice[];
}

export interface MediaItem extends BaseMongoDocument {
  key: string;
  url: string;
  filename: string;
  originalSize: number;
  optimizedSize: number;
  format: string;
  width?: number;
  height?: number;
  folder?: string;
  alt?: string;
}

// ==========================================
// Solutions & Detail Pages
// ==========================================
export type SolutionDiagramType =
  // Original 9 Core Shapes
  | 'grid-dots'
  | 'concentric-nodes'
  | 'circuit-flow'
  | 'matrix-intersect'
  | 'nested-squares'
  | 'orbital-radar'
  | 'triad-mesh'
  | 'lattice-loop'
  | 'flow-funnel'
  // Application & Management Specialized Shapes
  | 'app-dual-stack'
  | 'bezier-curv-engine'
  | 'api-cluster-gateway'
  | 'automated-test-grid'
  | 'store-launch-trajectory'
  // Extended Solution & Ecosystem Shapes
  | 'helix-data-strand'
  | 'quantum-core-cube'
  | 'cyber-shield-lock'
  | 'neural-synapse-web'
  | 'wave-frequency-stream'
  | 'hexagonal-honeycomb-hive'
  | 'prism-refraction-beam'
  | 'compass-spatial-reticle'
  | 'infinity-pulse-exchange'
  | 'bar-spectrum-analyzer'
  // Marketing & Communications Specialized Shapes
  | 'creative-story-lens'
  | 'omnichannel-radial-mesh'
  | 'social-resonance-echo'
  | 'media-production-timeline'
  // E-Commerce Growth Specialized Shapes
  | 'growth-trajectory-engine'
  | 'storefront-render-matrix'
  | 'ad-targeting-matrix'
  | 'cart-checkout-funnel'
  | 'omnichannel-inventory-sync'
  | 'retention-loop-orbit'
  // AI Integration Specialized Shapes
  | 'ai-conversational-agent'
  | 'autonomous-workflow-engine'
  | 'recommendation-cluster-matrix'
  | 'predictive-forecast-beam'
  | 'llm-rag-pipeline'
  | 'generative-copilot-interface'
  // UX and Product Design Specialized Shapes
  | 'ux-strategy-compass'
  | 'ux-journey-flowchart'
  | 'ux-wireframe-blueprint'
  | 'ux-design-token-matrix'
  | 'ux-prototype-interaction'
  | 'ux-handoff-spec-engine'
  // Customer Engagement Specialized Shapes
  | 'ce-loyalty-tier-prism'
  | 'ce-personalization-nexus'
  | 'ce-martech-stack-router'
  | 'ce-durable-identity-vault'
  | 'ce-omnichannel-orbit-matrix'
  | 'ce-predictive-ltv-engine'
  // Digital Engineering Specialized Shapes
  | 'de-microservices-mesh'
  | 'de-cloud-cluster-orbit'
  | 'de-cicd-pipeline-flow'
  | 'de-event-streaming-bus'
  | 'de-api-gateway-router'
  | 'de-resilience-failover'
  // Supply Chain & Logistics Specialized Shapes
  | 'sc-global-network-flow'
  | 'sc-demand-forecast-waveform'
  | 'sc-omnichannel-fulfillment-hub'
  | 'sc-warehouse-robotics-grid'
  | 'sc-fleet-transit-radar'
  | 'sc-control-tower-nexus'
  // CRM Management & Lifecycle Specialized Shapes
  | 'crm-lifecycle-funnel-loop'
  | 'crm-braze-salesforce-mesh'
  | 'crm-rfm-cohort-matrix'
  | 'crm-omnichannel-trigger-flow'
  | 'crm-ab-testing-switch'
  | 'crm-identity-hygiene-vault';



export interface SolutionOfferingItem extends BaseMongoDocument {
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  diagramType: SolutionDiagramType;
  tag: LocalizedString;
  icon?: string;
  order: number;
  features?: LocalizedString[];
  href: string;
}

export interface SolutionBenefitItem {
  title: LocalizedString;
  description: LocalizedString;
  accentColor?: string;
}

export interface SolutionExecutionPillar {
  title: LocalizedString;
  description: LocalizedString;
}

export interface SolutionFaqItem {
  question: LocalizedString;
  answer: LocalizedString;
}

export interface StoryMetricItem {
  id?: string;
  value: string;
  label?: string | LocalizedString;
}

export interface FeaturedClientStoryItem {
  id?: string;
  badge?: string | LocalizedString;
  title: string | LocalizedString;
  description?: string | LocalizedString;
  metrics?: StoryMetricItem[];
  metric1Val?: string;
  metric1Label?: string | LocalizedString;
  metric2Val?: string;
  metric2Label?: string | LocalizedString;
  metric3Val?: string;
  metric3Label?: string | LocalizedString;
  metric4Val?: string;
  metric4Label?: string | LocalizedString;
  image?: string;
  ctaText?: string | LocalizedString;
  ctaHref?: string;
  tags?: string[];
  client?: string;
  category?: string | LocalizedString;
  subtitle?: string | LocalizedString;
  summary?: string | LocalizedString;
  [key: string]: unknown;
}

export interface SolutionsPageContent extends BaseMongoDocument {
  page: 'solutions';
  heroBadge: LocalizedString;
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  heroCtaPrimary: LocalizedString;
  heroCtaSecondary: LocalizedString;
  heroImage: string;
  offeringsTitle: LocalizedString;
  offeringsSubtitle: LocalizedString;
  offeringsList: SolutionOfferingItem[];
  whyItMattersTitle: LocalizedString;
  whyItMattersText: LocalizedString;
  whyItMattersImage: string;
  benefitsTitle: LocalizedString;
  benefitsImage: string;
  benefits: SolutionBenefitItem[];
  deliveryTitle: LocalizedString;
  deliverySubtitle: LocalizedString;
  deliveryImage: string;
  deliveryPillars: SolutionExecutionPillar[];
  spotlightBadge: LocalizedString;
  spotlightTitle: LocalizedString;
  spotlightDescription: LocalizedString;
  spotlightMetric1Val: string;
  spotlightMetric1Label: LocalizedString;
  spotlightMetric2Val: string;
  spotlightMetric2Label: LocalizedString;
  spotlightMetric3Val?: string;
  spotlightMetric3Label?: LocalizedString;
  spotlightMetrics?: Array<{ value: string; label?: LocalizedString | string; id?: string }>;
  spotlightImage: string;
  spotlightCtaText: LocalizedString;
  spotlightCtaHref: string;
  spotlightStories?: FeaturedClientStoryItem[];
  quoteText: LocalizedString;
  quoteAuthor: string;
  quoteRole: LocalizedString;
  faqsTitle: LocalizedString;
  faqsSubtitle: LocalizedString;
  faqs: SolutionFaqItem[];
}

export interface SolutionDetailContent extends BaseMongoDocument {
  slug: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  badge: LocalizedString;
  heroImage: string;
  offeringsTitle: LocalizedString;
  offerings: {
    title: LocalizedString;
    description: LocalizedString;
    diagramType?: SolutionDiagramType;
  }[];
  whyItMattersTitle: LocalizedString;
  whyItMattersText: LocalizedString;
  whyItMattersImage: string;
  benefitsTitle: LocalizedString;
  benefitsImage: string;
  benefits: SolutionBenefitItem[];
  deliveryTitle: LocalizedString;
  deliverySubtitle: LocalizedString;
  deliveryImage: string;
  deliveryPillars: SolutionExecutionPillar[];
  spotlightTitle: LocalizedString;
  spotlightDescription: LocalizedString;
  spotlightMetric1Val: string;
  spotlightMetric1Label: LocalizedString;
  spotlightMetric2Val: string;
  spotlightMetric2Label: LocalizedString;
  spotlightImage: string;
  quoteText: LocalizedString;
  quoteAuthor: string;
  quoteRole: LocalizedString;
  faqs: SolutionFaqItem[];
}

export interface IndustryOfferingItem {
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  diagramType: SolutionDiagramType;
  tag: LocalizedString;
  icon?: string;
  order: number;
  href: string;
}

export interface IndustryFutureTrendItem {
  title: LocalizedString;
  description: LocalizedString;
  badge: LocalizedString;
  image: string;
  href?: string;
}

export interface IndustryAgileFoundation {
  title: LocalizedString;
  subtitle: LocalizedString;
  diagramBadge: LocalizedString;
  pillars: {
    number: string;
    title: LocalizedString;
    description: LocalizedString;
  }[];
}

export interface IndustriesPageContent extends BaseMongoDocument {
  page: 'industries';
  heroBadge: LocalizedString;
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  heroCtaPrimary: LocalizedString;
  heroCtaSecondary: LocalizedString;
  heroImage: string;
  offeringsTitle: LocalizedString;
  offeringsSubtitle: LocalizedString;
  offeringsList: IndustryOfferingItem[];
  whyItMattersTitle: LocalizedString;
  whyItMattersText: LocalizedString;
  whyItMattersImage: string;
  benefitsTitle: LocalizedString;
  benefitsImage: string;
  benefits: SolutionBenefitItem[];
  deliveryTitle: LocalizedString;
  deliverySubtitle: LocalizedString;
  deliveryImage: string;
  deliveryPillars: SolutionExecutionPillar[];
  quoteText: LocalizedString;
  quoteAuthor: string;
  quoteRole: LocalizedString;
  faqsTitle: LocalizedString;
  faqsSubtitle: LocalizedString;
  faqs: SolutionFaqItem[];
}


