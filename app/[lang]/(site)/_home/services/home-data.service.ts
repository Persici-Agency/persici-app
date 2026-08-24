import {
  socialProofAvatars,
  defaultTestimonials,
  partnerShowcaseData,
  videoTestimonials,
  heritageCollageImages,
  growthServicesHome,
  platforms,
  approachTeamAvatars,
  reviewsList,
  discoveryRevenueOptions,
} from '@shared/data';
import type {
  SocialProofAvatar,
  TestimonialItem,
  PartnerShowcaseData,
  VideoTestimonialItem,
  HeritageCollageItem,
  GrowthServiceItem,
  platformsType,
  GrowthTeamMember,
  ReviewItem,
  DiscoveryRevenueOption,
} from '@shared/types';

export function getHomeSocialProofAvatars(): SocialProofAvatar[] {
  return socialProofAvatars;
}

export function getHomeDefaultTestimonials(): TestimonialItem[] {
  return defaultTestimonials;
}

export function getHomePartnerShowcase(): PartnerShowcaseData {
  return partnerShowcaseData;
}

export function getHomeVideoTestimonials(): VideoTestimonialItem[] {
  return videoTestimonials;
}

export function getHomeHeritageCollage(): HeritageCollageItem[] {
  return heritageCollageImages;
}

export function getHomeGrowthServices(): GrowthServiceItem[] {
  return growthServicesHome;
}

export function getHomePlatforms(): platformsType[] {
  return platforms;
}

export function getHomeApproachTeam(): GrowthTeamMember[] {
  return approachTeamAvatars;
}

export function getHomeReviews(): ReviewItem[] {
  return reviewsList;
}

export function getHomeDiscoveryRevenueOptions(): DiscoveryRevenueOption[] {
  return discoveryRevenueOptions;
}
