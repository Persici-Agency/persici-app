import type {
  ClientLogo,
  SocialProofAvatar,
  NavLink,
  PartnerBadge,
  TestimonialItem,
  PartnerShowcaseData,
  VideoTestimonialItem,
  HeritageCollageItem,
  GrowthServiceItem,
  ServiceItem,
  GrowthTeamMember,
  ReviewItem,
  DiscoveryRevenueOption,
  AboutValueItem,
  JobOpening,
  InsightArticle,
  ProjectItem,
  ContactOffice,
} from './types';

// ============================================================================
// 1. Navigation & Certified Partners
// ============================================================================
export const siteNavLinks: NavLink[] = [
  { key: 'home', href: '/' },
  { key: 'services', href: '/services' },
  { key: 'work', href: '/work' },
  { key: 'about', href: '/about' },
  { key: 'insights', href: '/insights' },
  { key: 'contact', href: '/contact' },
];

export const footerPartnerBadges: PartnerBadge[] = [
  { name: 'Meta', tier: 'Business Partner', icon: 'meta', color: 'blue' },
  { name: 'Google', tier: 'Premier Partner', icon: 'google', color: 'amber' },
  { name: 'Shopify Plus', tier: 'Official Partner', icon: 'shopify', color: 'emerald' },
  { name: 'Klaviyo', tier: 'Elite Partner', icon: 'klaviyo', color: 'purple' },
];

// ============================================================================
// 2. Client Logos
// ============================================================================
export const clientLogos: ClientLogo[] = [
  { id: '1', name: '7awi', src: '/images/clients/7awi logo.png', order: 1, isActive: true },
  { id: '2', name: 'Accor Live Limitless', src: '/images/clients/ALL - Accor Live Limitless logo.png', order: 2, isActive: true },
  { id: '3', name: 'Alhokair Holding', src: '/images/clients/Alhokair Holding logo.png', order: 3, isActive: true },
  { id: '4', name: 'Chop On UAE', src: '/images/clients/Chop On Uae logo.png', order: 4, isActive: true },
  { id: '5', name: 'Hadiya', src: '/images/clients/Hadiya logo.png', order: 5, isActive: true },
  { id: '6', name: 'Hala Food', src: '/images/clients/Hala Food logo.png', order: 6, isActive: true },
  { id: '7', name: 'Hokair Group', src: '/images/clients/Hokair Group logo.png', order: 7, isActive: true },
  { id: '8', name: 'Khazan', src: '/images/clients/Khazan logo.png', order: 8, isActive: true },
  { id: '9', name: 'Lahfaa', src: '/images/clients/Lahfaa logo logo.png', order: 9, isActive: true },
  { id: '10', name: 'Land of Exotics', src: '/images/clients/Land of Exotics logo.png', order: 10, isActive: true },
  { id: '11', name: 'Mashreq', src: '/images/clients/Mashreq logo.png', order: 11, isActive: true },
  { id: '12', name: 'Meraas', src: '/images/clients/Meraas logo.png', order: 12, isActive: true },
  { id: '13', name: 'Metal Fuze', src: '/images/clients/Metal Fuze logo.png', order: 13, isActive: true },
  { id: '14', name: 'Protes', src: '/images/clients/Protes logo.png', order: 14, isActive: true },
  { id: '15', name: 'The Harmony', src: '/images/clients/The Harmony logo.png', order: 15, isActive: true },
];

// ============================================================================
// 3. Social Proof & Hero Avatars
// ============================================================================
export const socialProofAvatars: SocialProofAvatar[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    alt: 'Client avatar 1',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    alt: 'Client avatar 2',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    alt: 'Client avatar 3',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    alt: 'Client avatar 4',
  },
];

// ============================================================================
// 4. Testimonials & Partner Showcase
// ============================================================================
export const defaultTestimonials: TestimonialItem[] = [
  {
    id: '1',
    quote: 'Working with Persici has been our best growth decision. Their team\'s strategy and execution gave us 3.4x growth in under 6 months. A true growth partner.',
    author: 'Marcus Lindqvist',
    role: 'Founder & Managing Director',
    company: 'Nordic Retail Group',
    metric: '+340% Revenue',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isFeatured: true,
    rating: 5,
  },
  {
    id: '2',
    quote: 'Persici scaled our Shopify store from regional to multi-country leader. Their conversion engineering and paid media expertise are second to none.',
    author: 'Layla Al-Khatib',
    role: 'Head of eCommerce',
    company: 'Silk & Stone Apparel',
    metric: '4.2x ROAS',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    isFeatured: false,
    rating: 5,
  },
  {
    id: '3',
    quote: "They don't just run campaigns—they understand unit economics, margin optimization, and inventory velocity. Indispensable for scaling.",
    author: 'David Bergström',
    role: 'Chief Operating Officer',
    company: 'Klar Activewear',
    metric: '-38% CAC',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isFeatured: false,
    rating: 5,
  },
];

export const partnerShowcaseData: PartnerShowcaseData = {
  id: 'partner-showcase-main',
  videoSpeaker: 'Faris Al-Otaibi',
  videoRole: 'Founder & CEO',
  speakerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  videoCoverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  quote: 'Working with Persici has been our best growth decision. Their team\'s strategy and execution gave us 3.4x growth in under 6 months. A true growth partner.',
  author: 'Marcus Lindqvist',
  role: 'Founder & Managing Director',
  company: 'Nordic Retail Group',
  testimonials: defaultTestimonials,
};

// ============================================================================
// 5. Video Testimonials
// ============================================================================
export const videoTestimonials: VideoTestimonialItem[] = [
  {
    id: '1',
    name: 'Sarah Jensen',
    role: 'Chief Marketing Officer',
    company: 'Lumina Beauty',
    quote: 'We saw a 140% revenue surge within 90 days. Persici\'s team is truly an indispensable extension of our own.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '1:45',
    category: 'Paid Social & Scaling',
    order: 1,
  },
  {
    id: '2',
    name: 'Tariq Al-Mansoor',
    role: 'Founder & CEO',
    company: 'Urban Pulse Apparel',
    quote: 'Their creative testing pipeline cut our customer acquisition cost by 42% while simultaneously tripling our monthly ad spend.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '2:10',
    category: 'Creative Strategy & Meta Ads',
    order: 2,
  },
  {
    id: '3',
    name: 'Elena Rostova',
    role: 'Head of Digital Growth',
    company: 'Klar Activewear',
    quote: 'From custom web development to multi-channel performance media, their attention to detail and execution speed is unmatched.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '1:55',
    category: 'Shopify Plus & CRO',
    order: 3,
  },
  {
    id: '4',
    name: 'Marcus Vance',
    role: 'Managing Director',
    company: 'Apex Audio Tech',
    quote: 'Our Google Ads ROAS jumped from 1.8x to 4.2x in four months. The search and shopping restructuring they executed was flawless.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '2:05',
    category: 'Google Ads & YouTube',
    order: 4,
  },
  {
    id: '5',
    name: 'Leila Benali',
    role: 'Co-Founder & COO',
    company: 'Maison d\'Orient',
    quote: 'Scaling luxury fragrance internationally felt impossible until Persici built our localized TikTok and Meta acquisition engines.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: '1:38',
    category: 'Luxury Omnichannel Growth',
    order: 5,
  },
  {
    id: '6',
    name: 'David Chen',
    role: 'VP of E-Commerce',
    company: 'Silk & Stone Living',
    quote: 'They completely overhauled our customer retention funnel and Klaviyo flows. Repeat customer rate doubled within 60 days.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    duration: '2:20',
    category: 'Retention & Email Automation',
    order: 6,
  },
  {
    id: '7',
    name: 'Nour Al-Sabah',
    role: 'Creative Director',
    company: 'Aura Fine Jewelry',
    quote: 'The caliber of ad creative and video production Persici creates elevated our brand perception while delivering record high conversions.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: '1:50',
    category: 'High-Ticket DTC Scaling',
    order: 7,
  },
  {
    id: '8',
    name: 'Alexander Wright',
    role: 'Founder',
    company: 'Nomad Roasters',
    quote: 'Subscribers grew from 2,000 to over 18,000 active monthly recurring members. Persici\'s full-funnel approach is gold.',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: '2:30',
    category: 'Subscription Model Scaling',
    order: 8,
  },
  {
    id: '9',
    name: 'Chloe Dupont',
    role: 'Head of Brand Marketing',
    company: 'Éclat Skincare',
    quote: 'Our TikTok Shop and Spark ads outperformed all internal expectations. Persici unlocked a completely new profitable sales channel for us.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    duration: '1:42',
    category: 'TikTok Shop & Influencer Ads',
    order: 9,
  },
  {
    id: '10',
    name: 'Omar Farooq',
    role: 'Director of Acquisition',
    company: 'Horizon Footwear',
    quote: 'With real-time attribution tracking and unified dashboards, we finally have complete clarity on our true blended ROAS across all channels.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: '2:15',
    category: 'Data Tracking & Attribution',
    order: 10,
  },
  {
    id: '11',
    name: 'Mia Lindholm',
    role: 'Chief Commercial Officer',
    company: 'Nordic Glow Cosmetics',
    quote: 'Persici optimized our international checkout conversion rate across 8 European markets, unlocking immediate profitable scale.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    duration: '1:58',
    category: 'Cross-Border E-Commerce',
    order: 11,
  },
  {
    id: '12',
    name: 'Karim Al-Ghamdi',
    role: 'CEO',
    company: 'Falcon Sportswear',
    quote: 'During our Q4 holiday campaign, Persici handled over $2M in ad spend with flawless efficiency and a record 5.1x return on ad spend.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    duration: '2:40',
    category: 'Peak Season & Q4 Blitz',
    order: 12,
  },
  {
    id: '13',
    name: 'Sophia Rossi',
    role: 'Head of Growth',
    company: 'Bella Casa Botanicals',
    quote: 'The UX audit and speed enhancements they implemented on our Shopify store resulted in an instant +34% lift in checkout completions.',
    image: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '1:52',
    category: 'Storefront Optimization',
    order: 13,
  },
  {
    id: '14',
    name: 'Lucas Silva',
    role: 'Co-Founder & CTO',
    company: 'Nexus Fitness Tech',
    quote: 'The technical depth Persici brings to tracking infrastructure, GA4 server-side GTM, and custom integrations is the best in the industry.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '2:08',
    category: 'Technical Architecture',
    order: 14,
  },
  {
    id: '15',
    name: 'Hana Takahashi',
    role: 'Brand Director',
    company: 'Zen Minimalist Living',
    quote: 'Their creative strategists understood our brand ethos from day one. High-aesthetic creative combined with ruthless performance metrics.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '1:48',
    category: 'Brand & Performance Synergy',
    order: 15,
  },
];

// ============================================================================
// 6. Heritage Section Collage
// ============================================================================
export const heritageCollageImages: HeritageCollageItem[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    alt: 'Team strategy workshop',
    aspect: '16/9',
    order: 1,
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
    alt: 'Growth discussion',
    aspect: '1/1',
    order: 2,
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80',
    alt: 'Engineering & sprint review',
    aspect: '1/1',
    order: 3,
  },
];

// ============================================================================
// 7. Growth Services (Home & Catalog)
// ============================================================================
export const growthServicesHome: GrowthServiceItem[] = [
  {
    id: 'paid-social',
    key: 'paidSocial',
    tag: 'Meta • TikTok • Snapchat',
    title: 'Paid Social',
    description: 'We grow brands through performance-driven campaigns across Meta, TikTok, and Snapchat. From creative strategy to targeting and scaling, we help you win on paid social - wherever your audience is.',
    tagColor: 'text-persici-crimson',
    dotColor: 'bg-persici-crimson',
    platforms: ['meta', 'tiktok', 'snapchat'],
    width: '1/2',
    order: 1,
  },
  {
    id: 'google-ads',
    key: 'googleAds',
    tag: 'Google Ads & YouTube',
    title: 'Google Ads',
    description: 'We drive high-intent traffic with smart bidding and sharp targeting. Our campaigns turn clicks into loyal customers.',
    tagColor: 'text-amber-600',
    dotColor: 'bg-amber-500',
    platforms: ['google-ads'],
    width: '1/2',
    order: 2,
  },
  {
    id: 'shopify-cro',
    key: 'shopify',
    tag: 'Shopify Plus & CRO',
    title: 'Shopify',
    description: 'With an in-house development team, we build and optimise Shopify stores for maximum conversions - combining sharp design with data-driven improvements that drive real growth.',
    tagColor: 'text-emerald-600',
    dotColor: 'bg-emerald-500',
    platforms: ['shopify'],
    width: 'full',
    order: 3,
  },
];

export const servicesList: ServiceItem[] = [
  {
    id: 'paid-social',
    slug: 'paid-social',
    titleKey: 'Paid Social & Performance Marketing',
    descriptionKey: 'Data-backed acquisition campaigns across Meta, TikTok, and emerging channels.',
    icon: '📱',
    tag: 'Paid Acquisition',
    order: 1,
    isActive: true,
  },
  {
    id: 'google-ads',
    slug: 'google-ads',
    titleKey: 'Google Ads & Search',
    descriptionKey: 'High-intent Search, Shopping, Performance Max, and YouTube campaigns.',
    icon: '🔍',
    tag: 'High-Intent Search',
    order: 2,
    isActive: true,
  },
  {
    id: 'shopify-cro',
    slug: 'shopify-cro',
    titleKey: 'Shopify Plus & CRO',
    descriptionKey: 'High-converting headless storefronts and continuous A/B conversion rate optimization.',
    icon: '🛍️',
    tag: 'Engineering & Conversion',
    order: 3,
    isActive: true,
  },
  {
    id: 'strategy',
    slug: 'strategy',
    titleKey: 'Growth Strategy & Data Intelligence',
    descriptionKey: 'Unit economics modeling, retention loops, and server-side tracking infrastructure.',
    icon: '📊',
    tag: 'Strategy & Intelligence',
    order: 4,
    isActive: true,
  },
];

// ============================================================================
// 8. Approach & Team (MongoDB Collection Seed: 'team_members')
// NOTE: Structured according to BaseMongoDocument for future MongoDB persistence
// ============================================================================
export const approachTeamAvatars: GrowthTeamMember[] = [
  {
    id: '1',
    name: 'Sarah Al-Mansoor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    alt: 'Sarah Al-Mansoor - Growth Director',
    role: 'Growth Director',
  },
  {
    id: '2',
    name: 'Karim Zaid',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    alt: 'Karim Zaid - Performance Media Lead',
    role: 'Performance Media Lead',
  },
  {
    id: '3',
    name: 'Rami Haddad',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    alt: 'Rami Haddad - Senior Media Buyer',
    role: 'Senior Media Buyer',
  },
  {
    id: '4',
    name: 'Alex Vance',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    alt: 'Alex Vance - Creative Director',
    role: 'Creative Director',
  },
  {
    id: '5',
    name: 'David Keller',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    alt: 'David Keller - Full-Stack Engineer',
    role: 'Full-Stack Engineer',
  },
  {
    id: '6',
    name: 'Leila Benali',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    alt: 'Leila Benali - CRO & UX Specialist',
    role: 'CRO & UX Specialist',
  },
  {
    id: '7',
    name: 'Marcus Thorne',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    alt: 'Marcus Thorne - Data & Tracking Lead',
    role: 'Data & Tracking Lead',
  },
  {
    id: '8',
    name: 'Christian Holm',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    alt: 'Christian Holm - Retention Strategist',
    role: 'Retention Strategist',
  },
  {
    id: '9',
    name: 'Tariq Nabil',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    alt: 'Tariq Nabil - Paid Search Specialist',
    role: 'Paid Search Specialist',
  },
  {
    id: '10',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    alt: 'Elena Rostova - Brand Strategist',
    role: 'Brand Strategist',
  },
  {
    id: '11',
    name: 'Omar Farooq',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=150&q=80',
    alt: 'Omar Farooq - Senior Copywriter',
    role: 'Senior Copywriter',
  },
  {
    id: '12',
    name: 'Nour Kassam',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80',
    alt: 'Nour Kassam - Motion Graphics Lead',
    role: 'Motion Graphics Lead',
  },
];

// ============================================================================
// 9. Reviews (MongoDB Collection Seed: 'client_reviews')
// NOTE: Structured according to BaseMongoDocument for future MongoDB persistence
// ============================================================================
export const reviewsList: ReviewItem[] = [
  {
    id: '1',
    name: 'Shab Stafford',
    role: 'CEO & Founder',
    company: 'Silk & Thread Studio',
    review: 'The best decision I made for my business! Handing over performance acquisition to someone else is not easy, but Persici delivered beyond expectations. Our monthly revenue grew 3.4x in five months.',
    verified: 'Verified Client',
    rating: 5,
    isVerified: true,
    order: 1,
  },
  {
    id: '2',
    name: 'Varsha Mohandas',
    role: 'Founder & Director',
    company: 'Lumière Living',
    review: 'Highly recommend Persici! They helped us with our paid social and search ad campaigns. Planning to our tailored unit economics, weekly sprint reporting, and proactive follow-ups were top notch.',
    verified: 'Verified Client',
    rating: 5,
    isVerified: true,
    order: 2,
  },
  {
    id: '3',
    name: 'Maryam Sahem',
    role: 'Co-Founder',
    company: 'Khayal Fine Jewelry',
    review: 'Thanks to Persici, our luxury DTC brand has experienced a remarkable surge in sales and glowing feedback. Their expertise in crafting compelling ads has elevated our brand to new heights.',
    verified: 'Verified Client',
    rating: 5,
    isVerified: true,
    order: 3,
  },
  {
    id: '4',
    name: 'Tanya Shumeiko',
    role: 'Marketing Manager',
    company: 'Nordic Cleanse',
    review: 'We have been working with Persici for over eight months and our blended ROAS reached 6.2x. Revenue tripled compared to our historical average. Seamless execution and deep integrity.',
    verified: 'Verified Client',
    rating: 5,
    isVerified: true,
    order: 4,
  },
  {
    id: '5',
    name: 'Jm Fernández',
    role: 'Co-Owner',
    company: 'Moda Artisans',
    review: 'The Persici team has been an outstanding growth partner for all digital acquisition. Their understanding of GCC markets and CRO combined with our creative vision yielded record profits.',
    verified: 'Verified Client',
    rating: 5,
    isVerified: true,
    order: 5,
  },
  {
    id: '6',
    name: 'Farah Y.',
    role: 'Partner',
    company: 'Aura Perfumes',
    review: 'I have been working with Persici for a year now. We scaled immensely and achieved 7.5x ROAS on Meta and TikTok. Strongly recommend to any ambitious DTC brand looking to scale.',
    verified: 'Verified Client',
    rating: 5,
    isVerified: true,
    order: 6,
  },
  {
    id: '7',
    name: 'Alexander Holm',
    role: 'Founder & CEO',
    company: 'Nordic Living',
    review: 'The strategic clarity and direct weekly communication from the Persici team is unmatched. In 4 months, our international revenue grew over 210% with profitable ROAS.',
    verified: 'Verified Client',
    rating: 5,
    isVerified: true,
    order: 7,
  },
  {
    id: '8',
    name: 'Nadia Bensalem',
    role: 'Head of Growth',
    company: 'Atelier Chic',
    review: 'Persici transformed our Shopify store speed, UI, and checkout conversion rate. Combined with their Meta ad scaling, our monthly GMV doubled within one quarter.',
    verified: 'Verified Client',
    rating: 5,
    isVerified: true,
    order: 8,
  },
];

// ============================================================================
// 10. Discovery Call Form Options
// ============================================================================
export const discoveryRevenueOptions: DiscoveryRevenueOption[] = [
  { value: 'under-25k', labelKey: 'revenueOption1', label: 'Under $25,000 / month' },
  { value: '25k-100k', labelKey: 'revenueOption2', label: '$25,000 - $100,000 / month' },
  { value: '100k-500k', labelKey: 'revenueOption3', label: '$100,000 - $500,000 / month' },
  { value: '500k-plus', labelKey: 'revenueOption4', label: '$500,000+ / month' },
];

// ============================================================================
// 11. Core Principles / Values (About)
// ============================================================================
export const aboutValues: AboutValueItem[] = [
  {
    id: '1',
    title: 'Strategic Rigor',
    description: 'We base decisions on empirical performance data and high-conviction market research.',
    icon: '🎯',
    order: 1,
  },
  {
    id: '2',
    title: 'Velocity & Agility',
    description: 'Rapid creative iteration and continuous optimization sprints to outperform the market.',
    icon: '⚡',
    order: 2,
  },
  {
    id: '3',
    title: 'Radical Transparency',
    description: 'Direct Slack communication, live metrics dashboards, and no hidden agency markups.',
    icon: '🔍',
    order: 3,
  },
  {
    id: '4',
    title: 'Net-Profitable Scale',
    description: 'Every dirham, dollar, or euro spent is measured against true bottom-line contribution.',
    icon: '📈',
    order: 4,
  },
];

// ============================================================================
// 12. Job Openings (Careers)
// ============================================================================
export const jobOpenings: JobOpening[] = [
  {
    id: '1',
    slug: 'senior-performance-media-buyer',
    title: 'Senior Performance Media Buyer',
    department: 'Growth Marketing',
    location: 'Dubai / Remote',
    type: 'Full-Time',
    isActive: true,
  },
  {
    id: '2',
    slug: 'lead-growth-strategist',
    title: 'Lead Growth Strategist',
    department: 'Strategy',
    location: 'Riyadh / Hybrid',
    type: 'Full-Time',
    isActive: true,
  },
  {
    id: '3',
    slug: 'senior-shopify-engineer',
    title: 'Senior Shopify Plus Engineer',
    department: 'Engineering',
    location: 'Stockholm / Remote',
    type: 'Full-Time',
    isActive: true,
  },
  {
    id: '4',
    slug: 'creative-strategist-motion-designer',
    title: 'Creative Strategist & Motion Designer',
    department: 'Creative',
    location: 'Dubai / Hybrid',
    type: 'Full-Time',
    isActive: true,
  },
];

// ============================================================================
// 13. Insights Articles
// ============================================================================
export const insightsArticles: InsightArticle[] = [
  {
    id: '1',
    slug: 'scaling-meta-ads-2026',
    title: 'The 2026 DTC Playbook: Scaling Meta Ads with Creative Velocity',
    category: 'Paid Media',
    readTime: '6 min read',
    date: 'August 2026',
    excerpt: 'How leading brands maintain 3x+ ROAS by running systematic weekly creative testing frameworks.',
    isActive: true,
  },
  {
    id: '2',
    slug: 'shopify-headless-cro',
    title: 'Maximizing Conversion Rate: From Monolith to Headless Shopify',
    category: 'Engineering & CRO',
    readTime: '8 min read',
    date: 'July 2026',
    excerpt: 'Architectural lessons and sub-second page speed optimizations that doubled checkout conversions.',
    isActive: true,
  },
  {
    id: '3',
    slug: 'first-party-data-retention',
    title: 'Unlocking LTV: First-Party Data & Retention Funnels',
    category: 'Retention',
    readTime: '5 min read',
    date: 'June 2026',
    excerpt: 'Transforming one-time shoppers into repeat brand advocates with automated lifecycle flows.',
    isActive: true,
  },
];

// ============================================================================
// 14. Projects / Case Studies
// ============================================================================
export const projectsList: ProjectItem[] = [
  {
    id: '1',
    slug: 'nordic-living',
    title: 'Nordic Living',
    category: 'Home & Living • Scale',
    result: '+210% International Revenue',
    description: 'Full-funnel Meta & Google Ads restructuring combined with custom headless checkout.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    order: 1,
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'lumina-beauty',
    title: 'Lumina Beauty',
    category: 'Cosmetics • D2C',
    result: '+140% 90-Day Surge',
    description: 'High-velocity TikTok creative pipeline and custom Shopify Plus performance optimization.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    order: 2,
    isFeatured: true,
  },
  {
    id: '3',
    slug: 'urban-pulse',
    title: 'Urban Pulse',
    category: 'Apparel & Streetwear',
    result: '-42% CAC at 3x Spend',
    description: 'Granular audience segmentation and dynamic product catalog advertising.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    order: 3,
    isFeatured: true,
  },
  {
    id: '4',
    slug: 'atelier-chic',
    title: 'Atelier Chic',
    category: 'Luxury Fashion',
    result: '2.8x ROAS Sustained',
    description: 'High-intent search capture and premium creative storytelling campaigns.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    order: 4,
    isFeatured: true,
  },
];

// ============================================================================
// 15. Contact Offices
// ============================================================================
export const contactOffices: ContactOffice[] = [
  {
    id: '1',
    city: 'Dubai',
    address: 'Dubai Internet City, Building 3',
    email: 'dubai@persici.com',
    phone: '+971 4 000 0000',
    isHQ: true,
    order: 1,
  },
  {
    id: '2',
    city: 'Riyadh',
    address: 'King Fahd Road, Al Olaya',
    email: 'riyadh@persici.com',
    phone: '+966 11 000 0000',
    isHQ: false,
    order: 2,
  },
  {
    id: '3',
    city: 'Stockholm',
    address: 'Birger Jarlsgatan 18, Östermalm',
    email: 'stockholm@persici.com',
    phone: '+46 8 000 0000',
    isHQ: false,
    order: 3,
  },
];
