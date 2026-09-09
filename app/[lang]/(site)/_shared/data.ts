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
  HomePageContent,
  ServicesPageContent,
  WorkPageContent,
  ContactPageContent,
  SolutionOfferingItem,
  SolutionsPageContent,
  IndustryOfferingItem,
  IndustriesPageContent,
  platformsType,
} from './types';


// ============================================================================
// 1. Navigation & Certified Partners
// ============================================================================
export const siteNavLinks: NavLink[] = [
  {
    key: 'solutions',
    href: '/solutions',
    hasDropdown: true,
    subItems: [
      { key: 'applicationManagement', href: '/solutions/application-management' },
      { key: 'marketingCommunications', href: '/solutions/marketing-communications' },
      { key: 'ecommerceGrowth', href: '/solutions/ecommerce-growth' },
      { key: 'aiIntegration', href: '/solutions/ai-integration' },
      { key: 'uxProductDesign', href: '/solutions/ux-and-product-design' },
      { key: 'customerEngagement', href: '/solutions/customer-engagement' },
      { key: 'digitalEngineering', href: '/solutions/digital-engineering' },
      { key: 'supplyChain', href: '/solutions/supply-chain' },
      { key: 'crmManagement', href: '/solutions/crm-management' },
    ],
  },
  {
    key: 'industries',
    href: '/industries',
    hasDropdown: true,
    subItems: [
      { key: 'consumerProducts', href: '/industries/consumer-products' },
      { key: 'telecomMediaTechnology', href: '/industries/telecom-media-technology' },
      { key: 'publicSector', href: '/industries/public-sector' },
      { key: 'retail', href: '/industries/retail' },
      { key: 'health', href: '/industries/health' },
      { key: 'energyCommodities', href: '/industries/energy-commodities' },
    ],
  },
  {
    key: 'howWeDoIt',
    href: '/how-we-do-it',
    hasDropdown: true,
    subItems: [
      { key: 'strategyConsulting', href: '/how-we-do-it/strategy-consulting' },
      { key: 'digitalTransformationFramework', href: '/how-we-do-it/digital-transformation-framework' },
      { key: 'productManagement', href: '/how-we-do-it/product-management' },
      { key: 'engineeringTechnology', href: '/how-we-do-it/engineering-technology' },
    ],
  },
  {
    key: 'clientStories',
    href: '/client-stories',
    hasDropdown: false,
  },
  {
    key: 'company',
    href: '/about',
    hasDropdown: true,
    subItems: [
      { key: 'aboutUs', href: '/about' },
      { key: 'insights', href: '/insights' },
      { key: 'careers', href: '/careers' },
      { key: 'contactUs', href: '/contact' },
    ],
  },
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
export const platforms: platformsType[] = [
  {
    id: 'shopify',
    title: 'Shopify',
    icon: 'https://cdn.simpleicons.org/shopify/95BF47',
    bg: 'bg-[#EAF7EE]',
    color: 'text-[#95BF47]',
    iconColor: 'text-[#95BF47]',
    isFeatured: false,
    className: 'border-emerald-200',
    iconClassName: 'text-[#95BF47]',
  },
  {
    id: 'woocommerce',
    title: 'WooCommerce',
    icon: 'https://cdn.simpleicons.org/woocommerce/96588A',
    bg: 'bg-[#F3EBF5]',
    color: 'text-[#96588A]',
    isFeatured: false,
    iconColor: 'text-[#96588A]',
    className: 'border-purple-200',
    iconClassName: 'text-[#96588A]',
  },
  {
    id: 'hubspot',
    title: 'HubSpot',
    icon: 'https://cdn.simpleicons.org/hubspot/FF7A59',
    bg: 'bg-[#FFF0EB]',
    color: 'text-[#FF7A59]',
    iconColor: 'text-[#FF7A59]',
    isFeatured: false,
    className: 'border-orange-200',
    iconClassName: 'text-[#FF7A59]',
  },
  {
    id: 'salesforce',
    title: 'Salesforce',
    icon: 'https://cdn.simpleicons.org/salesforce/00A1E0',
    bg: 'bg-[#E6F6FC]',
    color: 'text-[#00A1E0]',
    iconColor: 'text-[#00A1E0]',
    isFeatured: false,
    className: 'border-sky-200',
    iconClassName: 'text-[#00A1E0]',
  },
  {
    id: 'google-analytics',
    title: 'Google Analytics (GA4)',
    icon: 'https://cdn.simpleicons.org/googleanalytics/E37400',
    bg: 'bg-[#FEF4E6]',
    color: 'text-[#E37400]',
    iconColor: 'text-[#E37400]',
    isFeatured: false,
    className: 'border-amber-200',
    iconClassName: 'text-[#E37400]',
  },
  {
    id: 'notion',
    title: 'Notion',
    icon: 'https://cdn.simpleicons.org/notion/000000',
    bg: 'bg-stone-100',
    color: 'text-stone-900',
    iconColor: 'text-stone-900',
    isFeatured: false,
    className: 'border-stone-200',
    iconClassName: 'text-stone-900',
  },
  {
    id: 'clickup',
    title: 'ClickUp',
    icon: 'https://cdn.simpleicons.org/clickup/7B68EE',
    bg: 'bg-[#F3F0FE]',
    color: 'text-[#7B68EE]',
    iconColor: 'text-[#7B68EE]',
    isFeatured: false,
    className: 'border-indigo-200',
    iconClassName: 'text-[#7B68EE]',
  },
  {
    id: 'jira',
    title: 'Jira',
    icon: 'https://cdn.simpleicons.org/jira/0052CC',
    bg: 'bg-[#EBF2FC]',
    color: 'text-[#0052CC]',
    iconColor: 'text-[#0052CC]',
    isFeatured: false,
    className: 'border-blue-200',
    iconClassName: 'text-[#0052CC]',
  },
  {
    id: 'excel',
    title: 'Excel',
    icon: 'https://cdn.simpleicons.org/microsoftexcel/107C41',
    bg: 'bg-[#E7F5ED]',
    color: 'text-[#107C41]',
    iconColor: 'text-[#107C41]',
    isFeatured: false,
    className: 'border-emerald-200',
    iconClassName: 'text-[#107C41]',
  },
  {
    id: 'adobe-creative-cloud',
    title: 'Adobe Creative Cloud',
    icon: 'https://cdn.simpleicons.org/adobecreativecloud/DA1F26',
    bg: 'bg-[#FDF0F1]',
    color: 'text-[#DA1F26]',
    iconColor: 'text-[#DA1F26]',
    isFeatured: false,
    className: 'border-red-200',
    iconClassName: 'text-[#DA1F26]',
  },
  {
    id: 'figma',
    title: 'Figma',
    icon: 'https://cdn.simpleicons.org/figma/F24E1E',
    bg: 'bg-[#FEEFEA]',
    color: 'text-[#F24E1E]',
    iconColor: 'text-[#F24E1E]',
    isFeatured: false,
    className: 'border-orange-200',
    iconClassName: 'text-[#F24E1E]',
  },
  {
    id: 'canva',
    title: 'Canva',
    icon: 'https://cdn.simpleicons.org/canva/00C4CC',
    bg: 'bg-[#E6F9FA]',
    color: 'text-[#00C4CC]',
    iconColor: 'text-[#00C4CC]',
    isFeatured: false,
    className: 'border-teal-200',
    iconClassName: 'text-[#00C4CC]',
  },
  {
    id: 'meta-ads-manager',
    title: 'Meta Ads Manager',
    icon: 'https://cdn.simpleicons.org/meta/0866FF',
    bg: 'bg-[#E8F0FE]',
    color: 'text-[#0866FF]',
    iconColor: 'text-[#0866FF]',
    isFeatured: false,
    className: 'border-blue-200',
    iconClassName: 'text-[#0866FF]',
  },
  {
    id: 'google-ads',
    title: 'Google Ads',
    icon: 'https://cdn.simpleicons.org/googleads/4285F4',
    bg: 'bg-[#E8F0FE]',
    color: 'text-[#4285F4]',
    iconColor: 'text-[#4285F4]',
    isFeatured: false,
    className: 'border-blue-200',
    iconClassName: 'text-[#4285F4]',
  },
  {
    id: 'snapchat-ads',
    title: 'Snapchat Ads',
    icon: 'https://cdn.simpleicons.org/snapchat/000000',
    bg: 'bg-[#FFFDE6]',
    color: 'text-[#000000]',
    iconColor: 'text-[#fcb900]',
    isFeatured: false,
    className: 'border-yellow-200',
    iconClassName: 'text-[#fcb900]',
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    icon: 'https://cdn.simpleicons.org/nextdotjs/000000',
    bg: 'bg-stone-100',
    color: 'text-stone-900',
    iconColor: 'text-stone-900',
    isFeatured: false,
    className: 'border-stone-200',
    iconClassName: 'text-stone-900',
  },
  {
    id: 'react',
    title: 'React',
    icon: 'https://cdn.simpleicons.org/react/61DAFB',
    bg: 'bg-[#EFFBFE]',
    color: 'text-[#087ea4]',
    iconColor: 'text-[#087ea4]',
    isFeatured: false,
    className: 'border-cyan-200',
    iconClassName: 'text-[#087ea4]',
  },
  {
    id: 'angular',
    title: 'Angular',
    icon: 'https://cdn.simpleicons.org/angular/DD0031',
    bg: 'bg-[#FDF0F3]',
    color: 'text-[#DD0031]',
    iconColor: 'text-[#DD0031]',
    isFeatured: false,
    className: 'border-rose-200',
    iconClassName: 'text-[#DD0031]',
  },
  {
    id: 'flutter',
    title: 'Flutter',
    icon: 'https://cdn.simpleicons.org/flutter/02569B',
    bg: 'bg-[#E7F0F7]',
    color: 'text-[#02569B]',
    iconColor: 'text-[#02569B]',
    isFeatured: false,
    className: 'border-blue-200',
    iconClassName: 'text-[#02569B]',
  },
  {
    id: 'react-native',
    title: 'React Native',
    icon: 'https://cdn.simpleicons.org/react/61DAFB',
    bg: 'bg-[#EFFBFE]',
    color: 'text-[#087ea4]',
    iconColor: 'text-[#087ea4]',
    isFeatured: false,
    className: 'border-cyan-200',
    iconClassName: 'text-[#087ea4]',
  },
  {
    id: 'nodejs',
    title: 'Node.js',
    icon: 'https://cdn.simpleicons.org/nodedotjs/5FA04E',
    bg: 'bg-[#F0F8EE]',
    color: 'text-[#5FA04E]',
    iconColor: 'text-[#5FA04E]',
    isFeatured: false,
    className: 'border-green-200',
    iconClassName: 'text-[#5FA04E]',
  },
  {
    id: 'php-laravel',
    title: 'PHP (Laravel)',
    icon: 'https://cdn.simpleicons.org/laravel/FF2D20',
    bg: 'bg-[#FFF0EE]',
    color: 'text-[#FF2D20]',
    iconColor: 'text-[#FF2D20]',
    isFeatured: false,
    className: 'border-red-200',
    iconClassName: 'text-[#FF2D20]',
  },
  {
    id: 'wordpress',
    title: 'Wordpress',
    icon: 'https://cdn.simpleicons.org/wordpress/21759B',
    bg: 'bg-[#E9F3F7]',
    color: 'text-[#21759B]',
    iconColor: 'text-[#21759B]',
    isFeatured: false,
    className: 'border-sky-200',
    iconClassName: 'text-[#21759B]',
  },
  {
    id: 'aws',
    title: 'AWS',
    icon: 'https://cdn.simpleicons.org/amazonwebservices/FF9900',
    bg: 'bg-[#FFF7EB]',
    color: 'text-[#FF9900]',
    iconColor: 'text-[#232F3E]',
    isFeatured: false,
    className: 'border-amber-200',
    iconClassName: 'text-[#232F3E]',
  },
  {
    id: 'docker',
    title: 'Docker',
    icon: 'https://cdn.simpleicons.org/docker/2496ED',
    bg: 'bg-[#E9F5FD]',
    color: 'text-[#2496ED]',
    iconColor: 'text-[#2496ED]',
    isFeatured: false,
    className: 'border-blue-200',
    iconClassName: 'text-[#2496ED]',
  },
  {
    id: 'gcp',
    title: 'GCP',
    icon: 'https://cdn.simpleicons.org/googlecloud/4285F4',
    bg: 'bg-[#E8F0FE]',
    color: 'text-[#4285F4]',
    iconColor: 'text-[#4285F4]',
    isFeatured: false,
    className: 'border-blue-200',
    iconClassName: 'text-[#4285F4]',
  },
  {
    id: 'mongodb',
    title: 'MongoDB',
    icon: 'https://cdn.simpleicons.org/mongodb/47A248',
    bg: 'bg-[#EDF8EE]',
    color: 'text-[#47A248]',
    iconColor: 'text-[#47A248]',
    isFeatured: false,
    className: 'border-emerald-200',
    iconClassName: 'text-[#47A248]',
  },
  {
    id: 'openai-api',
    title: 'OpenAI API',
    icon: 'https://cdn.simpleicons.org/openai/412991',
    bg: 'bg-[#F1EEF9]',
    color: 'text-[#412991]',
    iconColor: 'text-[#10a37f]',
    isFeatured: false,
    className: 'border-purple-200',
    iconClassName: 'text-[#10a37f]',
  },
  {
    id: 'meta',
    title: 'Meta',
    icon: 'https://cdn.simpleicons.org/meta/0866FF',
    bg: 'bg-[#E8F0FE]',
    color: 'text-[#0866FF]',
    iconColor: 'text-[#0866FF]',
    isFeatured: false,
    className: 'border-blue-200',
    iconClassName: 'text-[#0866FF]',
  },
  {
    id: 'tiktok',
    title: 'TikTok',
    icon: 'https://cdn.simpleicons.org/tiktok/000000',
    bg: 'bg-[#FEECEC]',
    color: 'text-black',
    iconColor: 'text-black',
    isFeatured: false,
    className: 'border-red-200',
    iconClassName: 'text-black',
  },
  {
    id: 'snapchat',
    title: 'Snapchat',
    icon: 'https://cdn.simpleicons.org/snapchat/000000',
    bg: 'bg-[#FFFDE6]',
    color: 'text-[#000000]',
    iconColor: 'text-[#fcb900]',
    isFeatured: false,
    className: 'border-yellow-200',
    iconClassName: 'text-[#fcb900]',
  },
  {
    id: 'klaviyo',
    title: 'Klaviyo',
    icon: 'https://cdn.simpleicons.org/klaviyo/2563EB',
    bg: 'bg-[#EEF2FF]',
    color: 'text-[#2563EB]',
    iconColor: 'text-[#2563EB]',
    isFeatured: false,
    className: 'border-blue-200',
    iconClassName: 'text-[#2563EB]',
  },
];

export const growthServicesHome: GrowthServiceItem[] = [
  {
    id: 'business-growth-and-strategy',
    key: 'businessGrowthAndStrategy',
    enSubService: 'Strategy & Consulting • E-Commerce • CRM & Customer Data',
    arSubService: 'الاستراتيجية والاستشارات • التجارة الإلكترونية • إدارة علاقات العملاء',
    enTitle: 'Business Growth & Strategy',
    enDescription: 'Focuses on optimizing revenue streams and business expansion through strategic consulting, comprehensive market analysis, and scalable growth engineering.',
    arTitle: 'نمو الأعمال والاستراتيجية',
    arDescription: 'التركيز على تحسين مصادر الإيرادات وتوسيع نطاق الأعمال من خلال الاستشارات الاستراتيجية، والتحليل الشامل للسوق، وهندسة النمو القابلة للتوسع.',
    tagColor: 'text-emerald-600',
    dotColor: 'bg-emerald-500',
    platforms: ['shopify', 'woocommerce', 'hubspot', 'salesforce', 'google-analytics', 'notion', 'clickup', 'jira', 'excel'],
    width: '1/2',
    order: 1,
  },
  {
    id: 'branding-and-marketing-communications',
    key: 'brandingAndMarketingCommunications',
    enSubService: 'Brand & Creative • Digital Marketing • PR & Communications',
    arSubService: 'العلامة التجارية والإبداع • التسويق الرقمي • العلاقات العامة والاتصال',
    enTitle: 'Branding & Marketing Communications',
    enDescription: 'Centers on building strong brand identity, driving audience acquisition, and managing public perception. This area handles visual storytelling, high-conversion multi-channel digital advertising, and strategic public relations to ensure the brand resonates with target markets and maintains a solid market reputation.',
    arTitle: 'الهوية التجارية والاتصالات التسويقية',
    arDescription: 'التركيز على بناء هوية تجارية قوية، وجذب الجمهور المستهدف، وإدارة الصورة الذهنية للعلامة. يشمل السرد البصري، والإعلانات الرقمية متعددة القنوات عالية التحويل، والعلاقات العامة الاستراتيجية لضمان تفاعل العلامة مع الأسواق المستهدفة وترسيخ مكانتها.',
    tagColor: 'text-amber-600',
    dotColor: 'bg-amber-500',
    platforms: ['adobe-creative-cloud', 'figma', 'canva', 'meta-ads-manager', 'google-ads', 'snapchat-ads'],
    width: '1/2',
    order: 2,
  },
  {
    id: 'technology-and-digital-products',
    key: 'technologyAndDigitalProducts',
    enSubService: 'Software Development • UX & Product Design • IT & Infrastructure • AI Integration',
    arSubService: 'تطوير البرمجيات • تصميم تجربة وواجهة المستخدم • تكنولوجيا المعلومات والبنية التحتية • تكامل الذكاء الاصطناعي',
    enTitle: 'Technology & Digital Products',
    enDescription: 'Focuses on engineering scalable, secure, and user-centric digital solutions from the ground up. This pillar covers custom web/mobile software engineering, intuitive UX/UI product design, stable cloud hosting/DevOps infrastructure, and intelligent AI automation to optimize enterprise operations and product lifecycles.',
    arTitle: 'التكنولوجيا والمنتجات الرقمية',
    arDescription: 'التركيز على هندسة حلول رقمية قابلة للتوسع وآمنة ومتمحورة حول المستخدم من البداية. يشمل تطوير البرمجيات المخصصة للويب وتطبيقات الجوال، وتصميم تجربة وواجهة المستخدم، والبنية التحتية السحابية، وأتمتة الذكاء الاصطناعي لتحسين العمليات التشغيلية ودورات حياة المنتجات.',
    tagColor: 'text-persici-crimson',
    dotColor: 'bg-persici-crimson',
    platforms: ['nextjs', 'react', 'angular', 'flutter', 'react-native', 'nodejs', 'php-laravel', 'wordpress', 'aws', 'docker', 'gcp', 'mongodb', 'figma', 'openai-api'],
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

// ============================================================================
// 15. Dynamic Page Content CMS Datasets (Fallback for MongoDB & Dashboard)
// ============================================================================

export const homePageContent: HomePageContent = {
  page: 'home',
  hero: {
    title: {
      en: 'Specialists in eCommerce growth',
      ar: 'متخصصون في نمو التجارة الإلكترونية',
    },
    subtitle: {
      en: 'We help ambitious brands scale with predictable and profitable growth. Driven by full-funnel digital marketing, data intelligence, and conversion engineering.',
      ar: 'نساعد العلامات التجارية الطموحة على التوسع بنمو متوقع ومربح. مدفوعين بالتسويق الرقمي الشامل، وذكاء البيانات، وهندسة التحويل.',
    },
    ctaText: {
      en: 'Collaborate with us',
      ar: 'تعاون معنا',
    },
    ctaHref: '/contact',
    ratingScore: '5.0',
    ratingLabel: {
      en: 'Rated 4.9/5 by 50+ leading brands',
      ar: 'تقييم 4.9/5 من أكثر من 50 علامة تجارية رائدة',
    },
    trustedByTitle: {
      en: 'Trusted by industry-leading fast-growing brands',
      ar: 'موثوق به من قبل العلامات التجارية الرائدة والأسرع نمواً',
    },
  },
  partnerShowcase: {
    title: {
      en: 'Your online growth partner',
      ar: 'شريكك في النمو الرقمي',
    },
    videoSpeaker: {
      en: 'Faris Al-Otaibi',
      ar: 'فارس العتيبي',
    },
    videoRole: {
      en: 'Founder & CEO',
      ar: 'المؤسس والمدير التنفيذي',
    },
    videoCoverImage: '/images/hero/hero-video-cover.png',
    videoUrl: '/videos/persici-showcase.mp4',
    quote: {
      en: 'Working with Persici has been our best growth decision. Their team\'s strategy and execution gave us 3.4x growth in under 6 months. A true growth partner.',
      ar: 'العمل مع برسيسي كان أفضل قرار نمو اتخذناه. استراتيجية فريقهم وتنفيذهم حققا لنا نمواً بمقدار 3.4 أضعاف في أقل من 6 أشهر. شريك نمو حقيقي.',
    },
    author: 'Marcus Lindqvist',
    role: {
      en: 'Founder & Managing Director',
      ar: 'المؤسس والمدير العام',
    },
    company: 'Nordic Retail Group',
    testimonials: defaultTestimonials,
  },
  heritage: {
    badge: {
      en: 'Growth Architecture',
      ar: 'بنية النمو',
    },
    title: {
      en: 'Rooted in excellence. Built for growth.',
      ar: 'متجذرون في التميز. مصممون للنمو.',
    },
    desc1: {
      en: 'Persici is a specialized growth and digital agency founded on the principle that modern DTC & omnichannel brands need deep domain expertise, tailored high-performance teams, and absolute transparency in execution.',
      ar: 'برسيسي هي وكالة نمو ورقمية متخصصة تأسست على مبدأ أن العلامات التجارية الحديثة تحتاج إلى خبرة عميقة وفرق عمل مخصصة وعالية الأداء مع شفافية مطلقة في التنفيذ.',
    },
    desc2: {
      en: 'We act as your dedicated growth arm, taking full ownership of your customer acquisition, conversion optimization, retention loops, and data architecture to scale revenue sustainably.',
      ar: 'نعمل كذراع النمو المخصص لك، ونتحمل المسؤولية الكاملة عن اكتساب العملاء وتحسين معدل التحويل وبنية البيانات لزيادة الإيرادات بشكل مستدام.',
    },
    ctaPrimaryText: {
      en: 'Work with us',
      ar: 'اعمل معنا',
    },
    ctaPrimaryHref: '/contact',
    ctaSecondaryText: {
      en: 'Meet the team',
      ar: 'تعرف على الفريق',
    },
    ctaSecondaryHref: '/about',
    collageImages: heritageCollageImages,
  },
  growthServices: {
    title: {
      en: 'Our growth services',
      ar: 'خدمات النمو لدينا',
    },
    ratingText: {
      en: 'Rated 4.9/5 on 50+ client reviews',
      ar: 'تقييم 4.9/5 بناءً على أكثر من 50 تقييماً',
    },
    bannerText: {
      en: 'Ready to scale your eCommerce brand?',
      ar: 'جاهز لتوسيع علامتك التجارية في التجارة الإلكترونية؟',
    },
    bannerCtaText: {
      en: 'Book call',
      ar: 'احجز مكالمة',
    },
    bannerCtaHref: '/contact',
    services: growthServicesHome,
  },
  clientVideos: {
    title: {
      en: 'Meet clients we scale',
      ar: 'تعرف على العملاء الذين نساعدهم على التوسع',
    },
    videos: videoTestimonials,
  },
  approach: {
    badgeLabel: {
      en: 'Team Persici',
      ar: 'فريق برسيسي',
    },
    badgeTitle: {
      en: 'Your team of specialists',
      ar: 'فريقك من المتخصصين',
    },
    title: {
      en: 'Our approach to eCommerce growth',
      ar: 'نهجنا في نمو التجارة الإلكترونية',
    },
    desc1: {
      en: 'At Persici, we work as a dedicated growth partner, with a deep understanding of the regional market and a focus on ROI. We deliver tailored strategies - not templates. No freelancers, no shortcuts - just a small, senior team focused on long-term, scalable results.',
      ar: 'في برسيسي، نعمل كشريك نمو مخصص، مع فهم عميق للسوق الإقليمي وتركيز على العائد على الاستثمار. نقدم استراتيجيات مخصصة - وليست قوالب جاهزة. فريق صغير وذو خبرة عالية يركز على نتائج قابلة للتوسع.',
    },
    desc2: {
      en: 'We combine hands-on execution with clear communication: performance updates weekly, full WhatsApp access, and no surprises - only growth.',
      ar: 'نجمع بين التنفيذ العملي والتواصل الواضح: تحديثات أداء أسبوعية، تواصل مباشر عبر واتساب، وبدون مفاجآت - فقط نمو.',
    },
    ctaPrimaryText: {
      en: 'Book call',
      ar: 'احجز مكالمة',
    },
    ctaPrimaryHref: '/contact',
    ctaSecondaryText: {
      en: 'More about us',
      ar: 'المزيد عنا',
    },
    ctaSecondaryHref: '/about',
    teamMembers: approachTeamAvatars,
  },
  reviews: {
    score: '4.9',
    scoreLabel: {
      en: '4.9 score on 50+ client reviews',
      ar: 'تقييم 4.9 من أكثر من 50 مراجعة عميل',
    },
    title: {
      en: 'Words from those we scale',
      ar: 'كلمات من أولئك الذين نساعدهم على التوسع',
    },
    bannerText: {
      en: 'Ready to scale your eCommerce brand?',
      ar: 'جاهز لتوسيع علامتك التجارية في التجارة الإلكترونية؟',
    },
    bannerCtaText: {
      en: 'Book a discovery call',
      ar: 'احجز مكالمة استكشافية',
    },
    bannerCtaHref: '/contact',
    reviews: reviewsList,
  },
  homeContact: {
    leftTitle: {
      en: 'Ready to learn more?',
      ar: 'جاهز لمعرفة المزيد؟',
    },
    points: [
      {
        en: 'Discuss your unique business challenges',
        ar: 'ناقش تحديات عملك الفريدة',
      },
      {
        en: 'Explore custom growth solutions built for your industry',
        ar: 'استكشف حلول النمو المخصصة لصناعتك',
      },
      {
        en: 'Get proven performance media & CRO guidance',
        ar: 'احصل على إرشادات مثبتة لإعلانات الأداء وتحسين معدل التحويل',
      },
      {
        en: 'Identify the next step that fits your revenue goals',
        ar: 'حدد الخطوة التالية التي تناسب أهداف إيراداتك',
      },
    ],
    trustedBy: {
      en: 'Trusted by leading eCommerce brands in the region.',
      ar: 'موثوق به من قِبل كبرى العلامات التجارية في المنطقة.',
    },
    title: {
      en: 'Get in touch',
      ar: 'تواصل معنا',
    },
    subtitle: {
      en: 'Submit the form below and one of our experts will reach out.',
      ar: 'أرسل النموذج أدناه وسيتواصل معك أحد خبرائنا.',
    },
  },
  discovery: {
    title: {
      en: 'Schedule your free 30-minute discovery call',
      ar: 'حدد موعد مكالمتك الاستكشافية المجانية لمدة 30 دقيقة',
    },
    desc: {
      en: 'In this 30-minute growth strategy session, we\'ll analyze your current marketing bottlenecks, identify immediate conversion and revenue wins, and assess if our growth framework is a fit for your brand.',
      ar: 'في جلسة استراتيجية النمو هذه لمدة 30 دقيقة، سنحلل معوقات التسويق الحالية ونحدد فرص زيادة المبيعات ونقيم مدى توافق إطار عملنا مع علامتك التجارية.',
    },
    quote: {
      en: 'That 30-minute discovery call provided more actionable commercial clarity than months of standard agency reports.',
      ar: 'قدمت تلك المكالمة الاستكشافية لمدة 30 دقيقة وضوحاً تجارياً قابلاً للتنفيذ أكثر من أشهر من تقارير الوكالات التقليدية.',
    },
    quoteAuthor: 'Christian Vestergaard',
    quoteRole: {
      en: 'Co-Founder & COO, Vester Goods',
      ar: 'شريك مؤسس ومدير العمليات، فيستر جودز',
    },
    revenueOptions: discoveryRevenueOptions,
  },
};

export const servicesPageContent: ServicesPageContent = {
  page: 'services',
  heroTitle: {
    en: 'Our Growth Services',
    ar: 'خدمات النمو لدينا',
  },
  heroSubtitle: {
    en: 'Engineered for high-performing direct-to-consumer and omnichannel brands.',
    ar: 'مصممة للعلامات التجارية عالية الأداء في التجارة الإلكترونية.',
  },
  bannerText: {
    en: 'Ready to build your bespoke growth engine?',
    ar: 'جاهز لبناء محرك النمو المخصص لك؟',
  },
  bannerCtaText: {
    en: 'Schedule Discovery Call',
    ar: 'جدولة مكالمة استكشافية',
  },
  servicesList: servicesList,
};

export const workPageContent: WorkPageContent = {
  page: 'work',
  heroTitle: {
    en: 'Featured Case Studies',
    ar: 'دراسات الحالة المميزة',
  },
  heroSubtitle: {
    en: 'Real revenue growth, unit-economic turnarounds, and creative scaling in action.',
    ar: 'نمو حقيقي في الإيرادات، وتحولات في الجدوى الاقتصادية، وتوسع إبداعي في الميدان.',
  },
  projectsList: projectsList,
};

export const contactPageContent: ContactPageContent = {
  page: 'contact',
  heroTitle: {
    en: 'Let\'s Scale Together',
    ar: 'دعنا نتوسع معاً',
  },
  heroSubtitle: {
    en: 'Reach out to our leadership team or schedule a dedicated growth strategy session.',
    ar: 'تواصل مع فريق القيادة لدينا أو احجز جلسة استراتيجية نمو مخصصة.',
  },
  offices: contactOffices,
};

// ============================================================================
// 12. Solutions Offerings (Home Challenges & Solutions Hub)
// ============================================================================
export const solutionsOfferingsList: SolutionOfferingItem[] = [
  {
    slug: 'supply-chain',
    title: {
      en: 'Supply Chain',
      ar: 'سلسلة الإمداد',
    },
    description: {
      en: 'Data-driven inventory visibility, automated order routing, and localized fulfillment solutions reducing delivery delays and operational costs.',
      ar: 'رؤية للمخزون مدفوعة بالبيانات، وتوجيه آلي للطلبات، وحلول شحن محلي تقلل التأخير وتكاليف التشغيل.',
    },
    diagramType: 'matrix-intersect',
    tag: {
      en: 'Operations & Fulfillment',
      ar: 'العمليات واللوجستيات',
    },
    icon: '/icons/solutions/Supply%20Chain%404x.png',
    order: 1,
    href: '/solutions/supply-chain',
  },
  {
    slug: 'marketing-communications',
    title: {
      en: 'Marketing & Communications',
      ar: 'التسويق والتواصل',
    },
    description: {
      en: 'Full-funnel digital marketing, data-backed acquisition across Meta and TikTok, and compelling creative storytelling that drives sustainable ROAS.',
      ar: 'تسويق رقمي متكامل، واستحواذ مدعوم بالبيانات عبر ميتا وتيك توك، وسرد إبداعي يجذب العملاء ويحقق عائداً مستداماً.',
    },
    diagramType: 'orbital-radar',
    tag: {
      en: 'Performance Acquisition',
      ar: 'إعلانات الأداء والاستحواذ',
    },
    icon: '/icons/solutions/Marketing%20%26%20Communicating%404x.png',
    order: 2,
    href: '/solutions/marketing-communications',
  },
  {
    slug: 'ux-and-product-design',
    title: {
      en: 'UX and Product Design',
      ar: 'تصميم تجربة وواجهة المستخدم',
    },
    description: {
      en: 'Human-centered digital product architecture, intuitive user journeys, high-fidelity design systems, and rapid prototyping that drive conversion and adoption.',
      ar: 'معمارية رقمية تركز على الإنسان، ومسارات مستخدم بديهية، وأنظمة تصميم تفاعلية ونماذج أولية سريعة تعزز التحويل والتبني.',
    },
    diagramType: 'ux-strategy-compass',
    tag: {
      en: 'UI/UX & Product Design',
      ar: 'تجربة وواجهة المستخدم',
    },
    icon: '/icons/solutions/UX%20and%20Product%20Design%404x.png',
    order: 3,
    href: '/solutions/ux-and-product-design',
  },
  {
    slug: 'ecommerce-growth',
    title: {
      en: 'E-Commerce Growth',
      ar: 'نمو التجارة الإلكترونية',
    },
    description: {
      en: 'End-to-end Shopify Plus scaling, continuous conversion rate optimization (CRO), and margin-engineered unit economics for high-velocity DTC brands.',
      ar: 'توسيع متاجر شوبيفاي بلس، وتحسين مستمر لمعدل التحويل (CRO)، وهندسة الجدوى الاقتصادية للعلامات سريعة النمو.',
    },
    diagramType: 'grid-dots',
    tag: {
      en: 'Storefront & CRO',
      ar: 'المتاجر والتحويل',
    },
    icon: '/icons/solutions/E-Commerce%20Growth%404x.png',
    order: 4,
    href: '/solutions/ecommerce-growth',
  },
  {
    slug: 'digital-engineering',
    title: {
      en: 'Digital Engineering',
      ar: 'الهندسة الرقمية',
    },
    description: {
      en: 'Modern cloud infrastructure, headless architecture, resilient API microservices, and continuous release pipelines that move ideas to production in days.',
      ar: 'بنية تحتية سحابية حديثة، ومعمارية بدون واجهة تقليدية (Headless)، وخدمات دقيقة تنقل الأفكار إلى الإنتاج بسرعة فائقة.',
    },
    diagramType: 'nested-squares',
    tag: {
      en: 'Cloud & Architecture',
      ar: 'السحابة والمعمارية',
    },
    icon: '/icons/solutions/Digital%20Engineering%404x.png',
    order: 5,
    href: '/solutions/digital-engineering',
  },
  {
    slug: 'customer-engagement',
    title: {
      en: 'Customer Engagement',
      ar: 'إشراك العملاء والتفاعل',
    },
    description: {
      en: 'Data-driven engagement that fosters genuine connection, delivering personalized omnichannel journeys across web, app, email, and mobile messaging.',
      ar: 'تفاعل قائم على البيانات يعزز الروابط الوثيقة، ويقدم رحلات مخصصة عبر الموقع والتطبيقات والرسائل البريدية والهاتفية.',
    },
    diagramType: 'lattice-loop',
    tag: {
      en: 'Retention & Lifecycle',
      ar: 'الاحتفاظ ودورة العميل',
    },
    icon: '/icons/solutions/Customer%20Engagement%404x.png',
    order: 6,
    href: '/solutions/customer-engagement',
  },
  {
    slug: 'crm-management',
    title: {
      en: 'CRM Management (Braze)',
      ar: 'إدارة علاقات العملاء (Braze)',
    },
    description: {
      en: 'Advanced customer lifecycle orchestration powered by Braze and Klaviyo. Centralized data and targeted campaign automation delivering up to 480% ROI.',
      ar: 'إدارة متقدمة لدورة حياة العميل عبر Braze وKlaviyo، مع مركزية البيانات وأتمتة الحملات الموجهة لتحقيق عائد يصل إلى 480%.',
    },
    diagramType: 'circuit-flow',
    tag: {
      en: 'Lifecycle Automation',
      ar: 'الأتمتة والتخصيص',
    },
    icon: '/icons/solutions/CRM%20Management%404x.png',
    order: 7,
    href: '/solutions/crm-management',
  },
  {
    slug: 'application-management',
    title: {
      en: 'Application & Management',
      ar: 'إدارة وتحديث التطبيقات',
    },
    description: {
      en: 'Mission-critical application maintenance, 24/7 uptime monitoring, SLA support, and legacy modernization keeping your enterprise reliable.',
      ar: 'صيانة البرمجيات الحيوية، والمراقبة المستمرة على مدار الساعة، ودعم مستوى الخدمة وتحديث الأنظمة القديمة لضمان الموثوقية.',
    },
    diagramType: 'triad-mesh',
    tag: {
      en: 'DevOps & SLA Support',
      ar: 'الدعم والموثوقية',
    },
    icon: '/icons/solutions/Application%20%26%20Management%404x.png',
    order: 8,
    href: '/solutions/application-management',
  },
  {
    slug: 'ai-integration',
    title: {
      en: 'AI Integration',
      ar: 'دمج الذكاء الاصطناعي',
    },
    description: {
      en: 'Cutting development timelines from months to days with intelligent automated agents, generative workflows, and proprietary predictive growth models.',
      ar: 'اختصار وقت التطوير من أشهر إلى أيام عبر وكلاء آليين أذكياء، وسير عمل توليدي ونماذج نمو تنبؤية مخصصة.',
    },
    diagramType: 'flow-funnel',
    tag: {
      en: 'GenAI & Automation',
      ar: 'الذكاء الاصطناعي والأتمتة',
    },
    icon: '/icons/solutions/AI%404x.png',
    order: 9,
    href: '/solutions/ai-integration',
  },
];

export const solutionsPageContent: SolutionsPageContent = {
  page: 'solutions',
  heroBadge: {
    en: 'Persici Growth Architecture',
    ar: 'بنية النمو المؤسسي في بيرسيسي',
  },
  heroTitle: {
    en: 'Navigating the Hurdles of Modern Business Growth',
    ar: 'تجاوز عقبات وتحديات نمو الأعمال الحديثة',
  },
  heroSubtitle: {
    en: 'Every industry faces unique friction points on its way to scaling. We help ambitious direct-to-consumer and enterprise brands conquer the core digital and operational complexities holding them back.',
    ar: 'تواجه كل صناعة نقاط احتكاك فريدة في طريقها نحو التوسع. نحن نساعد العلامات التجارية الطموحة على التغلب على التعقيدات الرقمية والتشغيلية التي تعيق تقدمها.',
  },
  heroCtaPrimary: {
    en: 'Explore Offerings',
    ar: 'استكشف حلولنا',
  },
  heroCtaSecondary: {
    en: 'Book a Growth Call',
    ar: 'احجز مكالمة نمو',
  },
  heroImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
  offeringsTitle: {
    en: 'Our Offerings',
    ar: 'حلولنا المتكاملة',
  },
  offeringsSubtitle: {
    en: 'With our specialized solutions, you can boost retention, enhance every customer touchpoint, and eliminate operational friction. Select a category below to explore our capabilities.',
    ar: 'مع حلولنا المتخصصة، يمكنك زيادة ولاء العملاء وتحسين كل مرحلة من رحلة الشراء والتخلص من العوائق التشغيلية. اختر فئة لاستكشاف القدرات بالتفصيل.',
  },
  offeringsList: solutionsOfferingsList,
  whyItMattersTitle: {
    en: 'Why It Matters',
    ar: 'لماذا يُعد هذا محورياً للنمو؟',
  },
  whyItMattersText: {
    en: 'Modern eCommerce brands and digital enterprises cannot scale with disconnected vendor tools and generic marketing retainers. Achieving sustainable, profitable scale requires full-stack alignment—where unit economics, storefront conversion engineering, predictive inventory, and real-time customer data operate as one synchronized engine.',
    ar: 'لم تعد العلامات التجارية الحديثة قادرة على التوسع المستدام عبر أدوات متناثرة وحلول تسويقية عامة. يتطلب تحقيق نمو مربح مواءمة شاملة — حيث تعمل اقتصاديات الوحدة، وهندسة تحويل المتاجر، والتنبؤ بالمخزون، وبيانات العملاء الفورية كمحرك موحد متكامل.',
  },
  whyItMattersImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
  benefitsTitle: {
    en: 'Benefits of Enterprise Growth Architecture',
    ar: 'مزايا بنية النمو المؤسسي',
  },
  benefitsImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  benefits: [
    {
      title: {
        en: 'Data-Driven Agility',
        ar: 'مرونة مبنية على البيانات الفورية',
      },
      description: {
        en: 'Replace guesswork with unified telemetry. Accelerate sprint delivery and deployment release cycles from months to days.',
        ar: 'استبدل التخمين بالرؤية الموحدة والبيانات الدقيقة، واختصر دورات إطلاق الميزات والبرمجيات من أشهر إلى أيام.',
      },
      accentColor: '#D83427',
    },
    {
      title: {
        en: 'Frictionless Customer Journey',
        ar: 'رحلة شراء سلسة وممتعة',
      },
      description: {
        en: 'Deliver hyper-personalized storefront experiences and instant checkouts that maximize session conversion rates across all screens.',
        ar: 'قدم تجارب تسوق فائقة التخصيص وإنهاء سريع للشراء يرفع معدلات التحويل عبر جميع الأجهزة.',
      },
      accentColor: '#EF8C7D',
    },
    {
      title: {
        en: 'Scalable Margin Growth',
        ar: 'توسع مستدام في هوامش الربح',
      },
      description: {
        en: 'Lower customer acquisition costs (CAC) while compounding lifetime value (LTV) through automated lifecycle retention loops.',
        ar: 'خفض تكلفة اكتساب العملاء الجدد (CAC) مع مضاعفة القيمة الدائمة للعميل (LTV) عبر مسارات إعادة التفاعل الآلية.',
      },
      accentColor: '#121212',
    },
  ],
  deliveryTitle: {
    en: 'How We Deliver Differently',
    ar: 'كيف نحقق نتائج ملموسة ومختلفة',
  },
  deliverySubtitle: {
    en: 'Cut dev time from months to days with Persici AI development platform and modern digital engineering.',
    ar: 'اختصر وقت التطوير والتنفيذ من أشهر إلى أيام عبر منصة بيرسيسي للذكاء الاصطناعي والهندسة الرقمية المتقدمة.',
  },
  deliveryImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
  deliveryPillars: [
    {
      title: {
        en: 'Modern Architecture & Rapid Prototyping',
        ar: 'معمارية حديثة ونماذج أولية سريعة',
      },
      description: {
        en: 'We build modular, headless systems and reusable component architectures that launch high-performance digital products in record time.',
        ar: 'نبني أنظمة قابلة للتوسع بدون قيود تقليدية ومكونات قابلة لإعادة الاستخدام لإطلاق منتجات رقمية فائقة السرعة.',
      },
    },
    {
      title: {
        en: 'Cross-Functional Execution Pods',
        ar: 'فرق عمل متكاملة ومتخصصة',
      },
      description: {
        en: 'No handoff lag between strategy, engineering, UI/UX, and performance media. You work directly with senior growth practitioners.',
        ar: 'لا انقطاع بين الاستراتيجية والهندسة والتصميم وإعلانات الأداء. أنت تعمل مباشرة مع خبراء نمو متمرسين.',
      },
    },
    {
      title: {
        en: 'Continuous CRO & Algorithmic Optimization',
        ar: 'تحسين مستمر لمعدلات التحويل والأداء',
      },
      description: {
        en: 'Every sprint tests hypotheses, optimizes checkout bottlenecks, and tunes acquisition algorithms against your bottom-line margin.',
        ar: 'كل مرحلة تختبر فرضيات جديدة، وتعالج معوقات الشراء وتضبط خوارزميات الاستحواذ لتعظيم صافي الأرباح.',
      },
    },
  ],
  spotlightBadge: {
    en: 'Featured Client Story',
    ar: 'قصة نجاح مميزة',
  },
  spotlightTitle: {
    en: 'Lahfaa Perfumes: Luxury E-Commerce Redesign & GCC Expansion',
    ar: 'عطور لهفة: إعادة تصميم المتجر الفاخر والتوسع في أسواق الخليج',
  },
  spotlightDescription: {
    en: 'Transformed an established luxury fragrance brand with headless Shopify Plus architecture, conversion engineering, and full-funnel performance marketing across UAE and Saudi Arabia.',
    ar: 'إعادة تصميم متكاملة لدار عطور فاخرة عبر شوبيفاي بلس معمارية متطورة، وهندسة معدلات التحويل، وحملات أداء رقمية في الإمارات والسعودية.',
  },
  spotlightMetric1Val: '+340%',
  spotlightMetric1Label: {
    en: 'Revenue Growth',
    ar: 'نمو الإيرادات',
  },
  spotlightMetric2Val: '4.2x',
  spotlightMetric2Label: {
    en: 'Blended ROAS',
    ar: 'العائد الإعلاني الإجمالي',
  },
  spotlightMetric3Val: '99.8%',
  spotlightMetric3Label: {
    en: 'Fulfillment Accuracy',
    ar: 'دقة تجهيز الطلبات',
  },
  spotlightImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  spotlightCtaText: {
    en: 'Learn more',
    ar: 'اعرف المزيد',
  },
  spotlightCtaHref: '/client-stories',
  spotlightStories: [
    {
      id: 'nissan-mobility',
      badge: {
        en: 'Transportation & Mobility',
        ar: 'قطاع السيارات والنقل الذكي',
      },
      title: {
        en: 'Nissan Cuts IT Operational Costs 40% with AI-Powered Monitoring and Automation',
        ar: 'نيسان تخفض تكاليف تشغيل تقنية المعلومات بنسبة 40% عبر الأتمتة والمراقبة الذكية',
      },
      description: {
        en: 'Modernized enterprise observability across regional manufacturing clusters with automated incident remediation, zero-downtime microservices, and unified telemetry pipelines.',
        ar: 'تحديث شامل لمنظومة المراقبة والتشغيل عبر المصانع الإقليمية مع حلول الاستجابة التنبؤية للأعطال والخدمات المصغرة دون أي انقطاع.',
      },
      metrics: [
        {
          value: '40%',
          label: {
            en: 'IT OpEx Reduction',
            ar: 'خفض تكاليف التشغيل',
          },
        },
        {
          value: '62%',
          label: {
            en: 'Faster MTTR',
            ar: 'تسريع حل الحوادث',
          },
        },
        {
          value: '99.9%',
          label: {
            en: 'System Uptime',
            ar: 'جاهزية الأنظمة التشغيلية',
          },
        },
      ],
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      ctaText: {
        en: 'Learn more',
        ar: 'اعرف المزيد',
      },
      ctaHref: '/client-stories',
    },
    {
      id: 'lahfaa-perfumes',
      badge: {
        en: 'Luxury Goods & E-Commerce',
        ar: 'السلع الفاخرة والتجارة الإلكترونية',
      },
      title: {
        en: 'Lahfaa Perfumes: Luxury E-Commerce Redesign & GCC Expansion',
        ar: 'عطور لهفة: إعادة تصميم المتجر الفاخر والتوسع في أسواق الخليج',
      },
      description: {
        en: 'Transformed an established luxury fragrance brand with headless Shopify Plus architecture, conversion engineering, and full-funnel performance marketing across UAE and Saudi Arabia.',
        ar: 'إعادة تصميم متكاملة لدار عطور فاخرة عبر شوبيفاي بلس معمارية متطورة، وهندسة معدلات التحويل، وحملات أداء رقمية في الإمارات والسعودية.',
      },
      metrics: [
        {
          value: '+340%',
          label: {
            en: 'Revenue Growth',
            ar: 'نمو الإيرادات',
          },
        },
        {
          value: '4.2x',
          label: {
            en: 'Blended ROAS',
            ar: 'العائد الإعلاني الإجمالي',
          },
        },
        {
          value: '99.8%',
          label: {
            en: 'Fulfillment Accuracy',
            ar: 'دقة تجهيز الطلبات',
          },
        },
      ],
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      ctaText: {
        en: 'Learn more',
        ar: 'اعرف المزيد',
      },
      ctaHref: '/client-stories',
    },
    {
      id: 'veloce-fintech',
      badge: {
        en: 'Financial Services & FinTech',
        ar: 'الخدمات المالية والتقنية المالية',
      },
      title: {
        en: 'Veloce Global: Modernizing Cross-Border Enterprise Payment Rails',
        ar: 'فيلوتشي العالمية: تحديث مسارات الدفع المالي العابر للحدود للمؤسسات',
      },
      description: {
        en: 'Engineered next-generation settlement pipelines and automated fraud defense engines, processing millions in daily transactions with sub-second latency and bank-grade security.',
        ar: 'بناء مسارات تسوية مالية فائقة السرعة وأنظمة حماية ذكية من الاحتيال لمعالجة ملايين المعاملات اليومية بأمان مصرفي متكامل.',
      },
      metrics: [
        {
          value: '<2.1s',
          label: {
            en: 'Settlement Time',
            ar: 'وقت تسوية المعاملات',
          },
        },
        {
          value: '10M+',
          label: {
            en: 'Daily Volume',
            ar: 'حجم المعاملات اليومية',
          },
        },
        {
          value: '99.99%',
          label: {
            en: 'Platform Availability',
            ar: 'توافر المنصة المستمر',
          },
        },
      ],
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      ctaText: {
        en: 'Learn more',
        ar: 'اعرف المزيد',
      },
      ctaHref: '/client-stories',
    },
  ],
  quoteText: {
    en: '"Working with Persici has been our best growth decision. Their team\'s strategy, conversion engineering, and execution gave us 3.4x growth in under 6 months. A true growth partner."',
    ar: '"العمل مع بيرسيسي كان أفضل قرار لنمو أعمالنا. استراتيجيتهم وهندسة التحويل والتنفيذ المتقن حققت لنا نمواً بنسبة 3.4 أضعاف في أقل من 6 أشهر."',
  },
  quoteAuthor: 'Marcus Lindqvist',
  quoteRole: {
    en: 'Managing Director, Nordic Retail Group',
    ar: 'المدير التنفيذي، مجموعة نورديك ريتيل',
  },
  faqsTitle: {
    en: 'FAQ',
    ar: 'الأسئلة الشائعة',
  },
  faqsSubtitle: {
    en: 'Clear answers on our delivery framework, integration timelines, and partnership model.',
    ar: 'إجابات واضحة حول منهجية العمل، والجداول الزمنية للتنفيذ، ونموذج الشراكة.',
  },
  faqs: [
    {
      question: {
        en: 'How do you determine the right solution for our business?',
        ar: 'كيف تحددون الحل الأنسب لاحتياجات أعمالنا؟',
      },
      answer: {
        en: 'We begin with a thorough audit of your current digital stack, analytics telemetry, conversion funnel, and unit economics during our initial discovery phase to identify the highest-ROI growth levers before writing a single line of code.',
        ar: 'نبدأ بفحص شامل لبنيتكم الرقمية الحالية ومسار التحويل والجدوى الاقتصادية خلال مرحلة الاستكشاف الأولى لتحديد أكثر فرص النمو عائداً قبل البدء بأي تطوير برمجي.',
      },
    },
    {
      question: {
        en: 'Can we engage Persici for a specific solution, or must it be full-funnel?',
        ar: 'هل يمكننا التعاقد مع بيرسيسي لحل محدد أم يلزم التعاقد على كافة الخدمات؟',
      },
      answer: {
        en: 'Our engagement model is modular. You can start with a targeted solution such as Shopify Plus CRO engineering, CRM lifecycle setup, or AI integration, and expand into full-funnel growth as you see validated ROI.',
        ar: 'نموذج عملنا مرن وموديولي. يمكنك البدء بحل محدد مثل هندسة تحويل المتاجر، أو تهيئة CRM وأتمتة دورة حياة العميل، أو دمج الذكاء الاصطناعي، ثم التوسع تدريجياً.',
      },
    },
    {
      question: {
        en: 'How quickly can we see measurable business results?',
        ar: 'ما هي المدة المتوقعة لملاحظة نتائج ملموسة؟',
      },
      answer: {
        en: 'Performance acquisition and conversion optimizations typically yield noticeable revenue improvements within the first 30 to 45 days, while structural digital engineering and platform transformations deliver compounding margin gains across 90-day sprints.',
        ar: 'حملات الأداء وتحسينات التحويل تُظهر عادةً نتائج واضحة خلال 30 إلى 45 يوماً الأولى، بينما تمنح التحولات الهندسية والمؤسسية مكاسب تراكمية مستدامة عبر دورات 90 يوماً.',
      },
    },
    {
      question: {
        en: 'Do your solutions integrate with our existing enterprise tools?',
        ar: 'هل تتكامل حلولكم مع أدواتنا وبرمجياتنا الحالية؟',
      },
      answer: {
        en: 'Yes. We build on open API standards and certified integrations with major enterprise platforms including Braze, Shopify Plus, Klaviyo, Adobe, AWS, Google Cloud, and Salesforce.',
        ar: 'نعم بكل تأكيد. نبني على معايير API المفتوحة وتكاملات معتمدة مع كبرى المنصات المؤسسية بما في ذلك Braze وShopify Plus وKlaviyo وAdobe وAWS وGoogle Cloud وSalesforce.',
      },
    },
  ],
};

// ============================================================================
// 14. Industries Offerings List & Hub Page Content
// ============================================================================
export const industriesOfferingsList: IndustryOfferingItem[] = [
  {
    slug: 'consumer-products',
    title: {
      en: 'Consumer Products',
      ar: 'المنتجات الاستهلاكية',
    },
    description: {
      en: 'Exceed evolving consumer expectations with direct-to-consumer agility, unified inventory intelligence, and ethical consumption at scale.',
      ar: 'تجاوز توقعات المستهلكين المتطورة عبر سرعة الوصول المباشر للمستهلك (D2C)، وذكاء المخزون الموحد، وتوسيع الاستهلاك الأخلاقي.',
    },
    diagramType: 'lattice-loop',
    tag: {
      en: 'CPG & Fast-Moving Goods',
      ar: 'السلع الاستهلاكية سريعة التداول',
    },
    icon: '/icons/solutions/mkt-brand-strategy.svg',
    order: 1,
    href: '/industries/consumer-products',
  },
  {
    slug: 'telecom-media-technology',
    title: {
      en: 'Telecommunications, Media & Technology',
      ar: 'الاتصالات والإعلام والتكنولوجيا',
    },
    description: {
      en: 'Build trust and break barriers with seamless digital experiences. Modernize 5G networks, streaming content engines, and enterprise AI workflows.',
      ar: 'بناء الثقة وكسر الحواجز بتجارب رقمية استثنائية. تحديث شبكات الجيل الخامس، ومحركات بث المحتوى، ومسارات الذكاء الاصطناعي المؤسسية.',
    },
    diagramType: 'wave-frequency-stream',
    tag: {
      en: '5G, Streaming & Tech',
      ar: 'الجيل الخامس والبث الرقمي',
    },
    icon: '/icons/solutions/de-cloud-architecture.svg',
    order: 2,
    href: '/industries/telecom-media-technology',
  },
  {
    slug: 'public-sector',
    title: {
      en: 'Public Sector',
      ar: 'القطاع العام',
    },
    description: {
      en: 'Transform the way communities experience public services with citizen-centric digital portals, sovereign data security, and automated workflows.',
      ar: 'إحداث نقلة نوعية في تجربة المجتمعات مع الخدمات الحكومية عبر بوابات رقمية موجهة للمواطن، وأمان البيانات السيادية، وأتمتة الإجراءات.',
    },
    diagramType: 'cyber-shield-lock',
    tag: {
      en: 'GovTech & Citizen Services',
      ar: 'الحكومة الرقمية وخدمات المواطنين',
    },
    icon: '/icons/solutions/ux-user-research.svg',
    order: 3,
    href: '/industries/public-sector',
  },
  {
    slug: 'retail',
    title: {
      en: 'Retail',
      ar: 'تجارة التجزئة',
    },
    description: {
      en: 'Remain indispensable by adapting continuously to customer needs through IT modernization, headless commerce architecture, and omnichannel fulfillment.',
      ar: 'حافظ على صدارتك وتكيف باستمرار مع تطلعات المستهلكين من خلال تحديث البنية التقنية، ومعمارية التجارة المستقلة، والتنفيذ الشامل متعدد القنوات.',
    },
    diagramType: 'cart-checkout-funnel',
    tag: {
      en: 'Unified Omnichannel Commerce',
      ar: 'التجارة الموحدة متعددة القنوات',
    },
    icon: '/icons/solutions/ecom-cro-optimization.svg',
    order: 4,
    href: '/industries/retail',
  },
  {
    slug: 'health',
    title: {
      en: 'Health',
      ar: 'الرعاية الصحية',
    },
    description: {
      en: 'Drive smarter clinical decisions, broader access, and stronger patient outcomes with secure telemedicine platforms and compliant healthcare technologies.',
      ar: 'دعم القرارات الطبية الذكية وتوسيع نطاق الرعاية وتحقيق نتائج علاجية أفضل عبر منصات التطبيب عن بعد والتقنيات الصحية المتوافقة تنظيمياً.',
    },
    diagramType: 'helix-data-strand',
    tag: {
      en: 'Connected Care & HealthTech',
      ar: 'الرعاية المتصلة والتقنية الصحية',
    },
    icon: '/icons/solutions/ai-rag-retrieval.svg',
    order: 5,
    href: '/industries/health',
  },
  {
    slug: 'energy-commodities',
    title: {
      en: 'Energy & Commodities',
      ar: 'الطاقة والسلع',
    },
    description: {
      en: 'Push the boundaries of digital transformation to create sustainable value from market volatility, smart grid IoT, and automated trade risk dispatch.',
      ar: 'توسيع آفاق التحول الرقمي لتوليد قيمة مستدامة من تقلبات الأسواق، وشبكات الطاقة الذكية، وأتمتة إدارة مخاطر تداول السلع.',
    },
    diagramType: 'matrix-intersect',
    tag: {
      en: 'CleanTech & Trading Operations',
      ar: 'الطاقة النظيفة وعمليات التداول',
    },
    icon: '/icons/solutions/sc-control-tower.svg',
    order: 6,
    href: '/industries/energy-commodities',
  },
];

export const industriesPageContent: IndustriesPageContent = {
  page: 'industries',
  heroBadge: {
    en: 'Industry-Specific Architectures',
    ar: 'هندسة رقمية متخصصة لكل صناعة',
  },
  heroTitle: {
    en: 'Specialized Industry Expertise for Complex Enterprise Sectors',
    ar: 'خبرة قطاعية متخصصة لتحقيق التحول في كبرى الصناعات',
  },
  heroSubtitle: {
    en: 'Whoever your audience may be, digital transformation is no longer optional. We engineer purpose-built digital platforms tailored to the regulatory, operational, and customer demands of your sector.',
    ar: 'أياً كانت شريحة عملائك، لم يعد التحول الرقمي خياراً بل ضرورة ملحة. نصمم حلولاً رقمية مخصصة تواكب المتطلبات التنظيمية والتشغيلية والتجارية لقطاعك بدقة وكفاءة.',
  },
  heroCtaPrimary: {
    en: 'Explore Industries',
    ar: 'استكشف القطاعات',
  },
  heroCtaSecondary: {
    en: 'Book Strategy Call',
    ar: 'احجز استشارة استراتيجية',
  },
  heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85',
  offeringsTitle: {
    en: 'Industries We Transform',
    ar: 'القطاعات التي نقود تحولها الرقمي',
  },
  offeringsSubtitle: {
    en: 'Deep domain knowledge combined with enterprise software engineering velocity across six core industries.',
    ar: 'فهم عميق لخصوصية كل صناعة مدمج بسرعة هندسية لتسريع وتيرة النمو ومضاعفة الأثر المؤسسي.',
  },
  offeringsList: industriesOfferingsList,
  whyItMattersTitle: {
    en: 'Why Industry-Specific Engineering Matters',
    ar: 'لماذا يُعد التخصص القطاعي محورياً للنجاح؟',
  },
  whyItMattersText: {
    en: 'Generic software and standard agencies fail when faced with domain-specific regulations, complex legacy infrastructures, and distinct customer journeys. From patient privacy in health to trading latency in commodities, our domain-focused engineering pods deliver compliant, high-performance systems from day one.',
    ar: 'تفشل الحلول البرمجية الجاهزة والوكالات العامة أمام اللوائح المعقدة والبنى القديمة الخاصة بكل قطاع. من معايير حماية بيانات المرضى في الصحة إلى خفض زمن استجابة التداول في السلع، تقدم فرقنا المتخصصة أنظمة متوافقة وفائقة الأداء من اليوم الأول.',
  },
  whyItMattersImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
  benefitsTitle: {
    en: 'The Strategic Advantage of Domain Alignment',
    ar: 'المزايا الاستراتيجية للتوافق القطاعي المتخصص',
  },
  benefitsImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
  benefits: [
    {
      title: {
        en: 'Regulatory Compliance by Design',
        ar: 'جاهزية الامتثال واللوائح التنظيمية',
      },
      description: {
        en: 'Built-in adherence to industry governance, privacy mandates, and sovereign cloud frameworks across GCC and global jurisdictions.',
        ar: 'امتثال مدمج منذ التأسيس لمعايير الحوكمة وخصوصية البيانات والأطر السحابية السيادية في منطقة الخليج والأسواق العالمية.',
      },
      accentColor: '#D83427',
    },
    {
      title: {
        en: 'Rapid Domain Time-to-Value',
        ar: 'سرعة استثنائية في الوصول للقيمة',
      },
      description: {
        en: 'Pre-validated sector components and battle-tested architectures accelerate deployment and shorten release cycles from months to days.',
        ar: 'مكونات معمارية قطاعية مجربة ومختبرة مسبقاً تختصر فترات الإطلاق والتطوير من أشهر طويلة إلى بضعة أيام.',
      },
      accentColor: '#EF8C7D',
    },
    {
      title: {
        en: 'Defensible Competitive Moats',
        ar: 'بناء مزايا تنافسية مستدامة ومحمية',
      },
      description: {
        en: 'Custom customer touchpoints and proprietary workflow automation that generic vendor tools cannot duplicate.',
        ar: 'تجارب تفاعلية فريدة وأتمتة تشغيلية مصممة خصيصاً لمؤسستك يستحيل على الأدوات الجاهزة محاكاتها.',
      },
      accentColor: '#121212',
    },
  ],
  deliveryTitle: {
    en: 'Cut Development Time from Months to Days',
    ar: 'اختصر زمن التطوير والابتكار من أشهر إلى أيام',
  },
  deliverySubtitle: {
    en: 'Our reusable platform components and cloud-native architectures eliminate repetitive scaffolding, letting you focus on high-impact domain differentiation.',
    ar: 'مكوناتنا المعمارية القابلة لإعادة الاستخدام والبنى السحابية الأصلية تلغي العمل المكرر، لتركز مؤسستك على الميزات الأكثر تأثيراً في قطاعها.',
  },
  deliveryImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85',
  deliveryPillars: [
    {
      title: {
        en: 'Domain Discovery & Blueprinting',
        ar: 'الاستكشاف وتخطيط المعمارية القطاعية',
      },
      description: {
        en: 'We dissect your industry constraints, legacy infrastructure, and market opportunities to architect high-yield roadmaps.',
        ar: 'نحلل التحديات الخاصة بقطاعك والبنية التحتية القائمة والفرص المتاحة لبناء خارطة طريق استراتيجية عالية العائد.',
      },
    },
    {
      title: {
        en: 'Modular Platform Assembly',
        ar: 'البناء الهندسي الموديولي السريع',
      },
      description: {
        en: 'Deploy cloud-native microservices, secure APIs, and data pipelines on modern composable foundations.',
        ar: 'إطلاق خدمات مصغرة سحابية أصلية، وواجهات برمجة آمنة، ومسارات تدفق بيانات على أسس قابلة للتوسع.',
      },
    },
    {
      title: {
        en: 'Autonomous Process Automation',
        ar: 'أتمتة العمليات بالذكاء الاصطناعي',
      },
      description: {
        en: 'Integrate intelligent workflows that reduce operational friction and automate cross-departmental operations.',
        ar: 'دمج وكلاء الذكاء الاصطناعي ومسارات الأتمتة التي تلغي الاحتكاك التشغيلي وترفع الكفاءة بين مختلف الإدارات.',
      },
    },
    {
      title: {
        en: 'Continuous Enterprise Scaling',
        ar: 'التوسع والتحسين المستمر',
      },
      description: {
        en: 'Real-time telemetry, automated CI/CD pipelines, and SLA-backed monitoring ensure 99.99% operational uptime.',
        ar: 'قياس الأداء اللحظي ومسارات النشر الآلي مع مراقبة مدعومة باتفاقية مستوى الخدمة لضمان استمرارية بنسبة 99.99%.',
      },
    },
  ],
  quoteText: {
    en: "Persici's deep domain expertise allowed us to deploy sovereign, high-throughput digital platforms in a fraction of the time required by traditional consultancies.",
    ar: 'مكنتنا خبرة بيرسيكي القطاعية العميقة من إطلاق منصات رقمية سيادية فائقة السرعة في وقت قياسي مقارنة بالاستشارات التقليدية.',
  },
  quoteAuthor: 'Faris Al-Otaibi',
  quoteRole: {
    en: 'Chief Information & Technology Officer',
    ar: 'الرئيس التنفيذي للمعلومات والتقنية',
  },
  faqsTitle: {
    en: 'Frequently Asked Questions',
    ar: 'الأسئلة الأكثر شيوعاً',
  },
  faqsSubtitle: {
    en: 'Answers to common questions regarding our industry engagement models, architecture, and regulatory compliance.',
    ar: 'إجابات وافية حول نماذج عملنا، والامتثال التنظيمي، والبنى التحتية لكل قطاع.',
  },
  faqs: [
    {
      question: {
        en: 'How does Persici approach regulatory compliance in heavily regulated sectors?',
        ar: 'كيف تتعامل بيرسيكي مع متطلبات الامتثال في القطاعات شديدة التنظيم؟',
      },
      answer: {
        en: 'Our engineering blueprints embed compliance by design. We build with air-gapped data pipelines, local sovereign cloud infrastructure (AWS/Azure/GCP UAE and KSA data centers), and strict ISO/IEC and local regulatory adherence from sprint zero.',
        ar: 'تتضمن مخططاتنا الهندسية معايير الامتثال منذ مرحلة التصميم، حيث نعتمد مسارات بيانات معزولة، ومراكز بيانات سحابية سيادية محلية في السعودية والإمارات، مع الالتزام التام بمعايير ISO واللوائح الوطنية.',
      },
    },
    {
      question: {
        en: 'Can we modernize our legacy sector systems without operational disruption?',
        ar: 'هل يمكننا تحديث أنظمتنا القديمة دون التسبب في انقطاع للعمليات اليومية؟',
      },
      answer: {
        en: 'Yes. We employ Strangler Fig patterns and decoupled microservice architectures that incrementally carve out functionality from monolithic legacy stacks with zero system downtime.',
        ar: 'نعم بكل تأكيد. نطبق أنماط التفكيك التدريجي (Strangler Fig) وبنى الخدمات المصغرة المنفصلة لتحديث المنظومات القديمة خطوة بخطوة دون أي توقف في الخدمات التشغيلية.',
      },
    },
    {
      question: {
        en: 'How do you incorporate AI into enterprise industry workflows?',
        ar: 'كيف تقومون بدمج الذكاء الاصطناعي في العمليات المؤسسية؟',
      },
      answer: {
        en: 'We implement sovereign enterprise RAG pipelines, autonomous agentic workflow dispatchers, and domain-tuned predictive models that connect securely to your existing enterprise data lakes.',
        ar: 'نقوم بتطوير محركات استرجاع معرفي سيادية (Enterprise RAG)، ووكلاء أذكياء لأتمتة المهام، ونماذج تنبؤية مدربة على بيانات قطاعك تتصل بأمان مع مستودعات البيانات الحالية.',
      },
    },
    {
      question: {
        en: 'What is the typical timeline for an enterprise industry deployment?',
        ar: 'ما هو الجدول الزمني المعتاد لتنفيذ المشاريع المؤسسية؟',
      },
      answer: {
        en: 'Initial proof-of-value deliverables and architectural blueprints are completed within 3 to 4 weeks, with production pilot rollouts launching in 60 to 90 days.',
        ar: 'يتم تسليم النماذج الأولية والمخططات المعمارية خلال 3 إلى 4 أسابيع، مع إطلاق النسخ التشغيلية الأولى في غضون 60 إلى 90 يوماً.',
      },
    },
  ],
};

export * from './data/featured-client-stories.data';




