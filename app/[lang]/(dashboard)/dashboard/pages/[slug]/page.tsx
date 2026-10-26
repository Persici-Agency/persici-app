'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SectionAccordion } from '@dashboard-shared/components/editor/section-accordion';
import { RichTextEditor } from '@dashboard-shared/components/editor/rich-text-editor';
import { CtaEditor, type CtaConfig } from '@dashboard-shared/components/editor/cta-editor';
import { SocialProofEditor, type SocialProofConfig } from '@dashboard-shared/components/editor/social-proof-editor';
import { MediaPickerModal } from '@dashboard-shared/components/media/media-picker-modal';
import {
  TbDeviceFloppy,
  TbSparkles,
  TbPlus,
  TbTrash,
  TbExternalLink,
  TbPhoto,
  TbVideo,
  TbCheck,
  TbAlertCircle,
  TbMapPin,
  TbClock,
  TbBuildingCommunity,
  TbArrowUp,
  TbArrowDown,
  TbForms,
  TbChevronRight,
  TbBriefcase,
} from 'react-icons/tb';
import {
  growthServicesHome,
  defaultTestimonials,
  approachTeamAvatars,
  reviewsList as fallbackReviewsList,
} from '@shared/data';
import { aboutPageData } from '@/app/[lang]/(site)/about/_about/data/about.data';
import {
  contactPageData,
  type ContactQuickLink,
  type ContactOfficeItem,
  type ContactChannelItem,
  type ContactFaqItem,
} from '@/app/[lang]/(site)/contact/_contact/data/contact.data';
import { clientStoriesHubPageData } from '@/app/[lang]/(site)/client-stories/_client-stories/data/client-stories.data';
import type { ClientStoriesHubCategoryFilter } from '@/app/[lang]/(site)/client-stories/_client-stories/types';
import {
  careersHubData,
  type CareerPerk,
  type CareerProcessStep,
  type CareerFaqItem,
  type CareerFilterOption,
} from '@/app/[lang]/(site)/careers/_careers/data/careers.data';
import { insightsHubPageData } from '@/app/[lang]/(site)/insights/_insights/data/insights.data';
import type { InsightsHubCategoryFilter } from '@/app/[lang]/(site)/insights/_insights/types';
import {
  normalizeSolutionsHubPageData,
  normalizeSolutionFeaturePageData,
  isSolutionPageSlug,
} from '@/app/[lang]/(site)/solutions/_solutions/data/solutions-cms.data';
import {
  normalizeIndustriesHubPageData,
  normalizeIndustryFeaturePageData,
  isIndustryPageSlug,
  extractIndustryFeatureSlug,
} from '@/app/[lang]/(site)/industries/_industries/data/industries-cms.data';
import {
  normalizeHowWeDoItHubPageData,
  normalizeHowWeDoItFeaturePageData,
  isHowWeDoItPageSlug,
  extractHowWeDoItFeatureSlug,
} from '@/app/[lang]/(site)/how-we-do-it/_how-we-do-it/data/how-we-do-it-cms.data';
import { SolutionsPageCmsEditor } from '@dashboard-shared/components/editor/solutions-page-cms-editor';
import { IndustriesPageCmsEditor } from '@dashboard-shared/components/editor/industries-page-cms-editor';
import { HowWeDoItPageCmsEditor } from '@dashboard-shared/components/editor/how-we-do-it-page-cms-editor';
import Link from 'next/link';

export default function UniversalPageCmsEditor() {
  const params = useParams();
  const slug = (params?.slug as string) || 'home';
  const lang = (params?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  const [loading, setLoading] = useState(true);
  const [savingAll, setSavingAll] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pageData, setPageData] = useState<Record<string, any>>({});

  // Media picker modal state with strict image vs video filtering
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerType, setMediaPickerType] = useState<'image' | 'video' | 'all'>('image');
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);

  const openMediaPicker = (cb: (url: string) => void, type: 'image' | 'video' | 'all' = 'image') => {
    setMediaPickerType(type);
    setMediaPickerCallback(() => cb);
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (url: string) => {
    if (mediaPickerCallback) {
      mediaPickerCallback(url);
    }
    setMediaPickerOpen(false);
    setMediaPickerCallback(null);
  };

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const [res, reviewsRes] = await Promise.all([
          fetch(`/api/content/${slug}`),
          slug === 'home' ? fetch('/api/reviews').then((r) => r.json()).catch(() => null) : Promise.resolve(null),
        ]);
        const data = await res.json();
        if (data.content) {
          const c = data.content;
          const canonicalReviews = (reviewsRes?.success && Array.isArray(reviewsRes.reviews) && reviewsRes.reviews.length > 0)
            ? reviewsRes.reviews
            : null;
          if (slug === 'home') {
            setPageData({
              ...c,
              // 1. Hero
              heroTitle: c.heroTitle || c.hero?.title?.en || '',
              heroTitleAr: c.heroTitleAr || c.hero?.title?.ar || '',
              heroDescriptionEn: c.heroDescriptionEn || c.heroDescription || c.hero?.subtitle?.en || '',
              heroDescriptionAr: c.heroDescriptionAr || c.hero?.subtitle?.ar || '',
              heroCtaEnabled: c.heroCtaEnabled !== undefined ? c.heroCtaEnabled : (c.hero?.ctaEnabled !== false),
              heroCtaLabelEn: c.heroCtaLabelEn || c.hero?.ctaText?.en || c.hero?.cta?.en || 'Schedule Discovery Call',
              heroCtaLabelAr: c.heroCtaLabelAr || c.hero?.ctaText?.ar || c.hero?.cta?.ar || 'احجز جلسة استشارية',
              heroCtaHref: c.heroCtaHref || c.hero?.ctaHref || '/contact',
              heroStars: c.heroStars ?? (c.hero?.ratingScore ? Number(c.hero?.ratingScore) : 5),
              heroScoreTextEn: c.heroScoreTextEn || c.hero?.ratingLabel?.en || '5.0 Rating from 100+ Enterprise Partners',
              heroScoreTextAr: c.heroScoreTextAr || c.hero?.ratingLabel?.ar || 'تقييم 5.0 من أكثر من 100 شريك استراتيجي',
              heroAvatars:
                (Array.isArray(c.heroAvatars) && c.heroAvatars.length > 0)
                  ? c.heroAvatars
                  : (Array.isArray(c.hero?.heroAvatars) && c.hero.heroAvatars.length > 0)
                  ? c.hero.heroAvatars
                  : (Array.isArray(c.hero?.avatars) && c.hero.avatars.length > 0)
                  ? c.hero.avatars
                  : [
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                    ],
              partnersTitleEn: c.partnersTitleEn || c.hero?.trustedByTitle?.en || c.hero?.trustedBy?.en || 'Trusted by Global Industry Pioneers',
              partnersTitleAr: c.partnersTitleAr || c.hero?.trustedByTitle?.ar || c.hero?.trustedBy?.ar || 'موثوق من رواد وقادة القطاعات العالمية',
              clientLogos: c.clientLogos || c.hero?.clientLogos || [],

              // 2. Partner Showcase
              partnerShowcaseTitleEn: c.partnerShowcaseTitleEn || c.partnerShowcase?.title?.en || '',
              partnerShowcaseTitleAr: c.partnerShowcaseTitleAr || c.partnerShowcase?.title?.ar || '',
              partnerShowcaseSpeakerEn: c.partnerShowcaseSpeakerEn || c.partnerShowcase?.videoSpeaker?.en || '',
              partnerShowcaseSpeakerAr: c.partnerShowcaseSpeakerAr || c.partnerShowcase?.videoSpeaker?.ar || '',
              partnerShowcaseRoleEn: c.partnerShowcaseRoleEn || c.partnerShowcase?.videoRole?.en || '',
              partnerShowcaseRoleAr: c.partnerShowcaseRoleAr || c.partnerShowcase?.videoRole?.ar || '',
              partnerShowcaseAvatar: c.partnerShowcaseAvatar || c.partnerShowcase?.speakerAvatar || '',
              partnerShowcaseCover: c.partnerShowcaseCover || c.partnerShowcase?.videoCoverImage || '',
              partnerShowcaseVideoUrl: c.partnerShowcaseVideoUrl || c.partnerShowcase?.videoUrl || '',
              partnerShowcaseQuoteEn: c.partnerShowcaseQuoteEn || c.partnerShowcase?.quote?.en || '',
              partnerShowcaseQuoteAr: c.partnerShowcaseQuoteAr || c.partnerShowcase?.quote?.ar || '',
              partnerShowcaseAuthor: c.partnerShowcaseAuthor || c.partnerShowcase?.author || '',
              partnerShowcaseCompany: c.partnerShowcaseCompany || c.partnerShowcase?.company || '',
              partnerShowcaseAuthorRoleEn: c.partnerShowcaseAuthorRoleEn || c.partnerShowcase?.role?.en || '',
              partnerShowcaseAuthorRoleAr: c.partnerShowcaseAuthorRoleAr || c.partnerShowcase?.role?.ar || '',
              partnerShowcaseTestimonials:
                (c.partnerShowcaseTestimonials && c.partnerShowcaseTestimonials.length > 0)
                  ? c.partnerShowcaseTestimonials
                  : (c.partnerShowcase?.testimonials && c.partnerShowcase.testimonials.length > 0)
                  ? c.partnerShowcase.testimonials
                  : defaultTestimonials,

              // 3. Heritage
              heritageTitleEn: c.heritageTitleEn || c.heritage?.title?.en || '',
              heritageTitleAr: c.heritageTitleAr || c.heritage?.title?.ar || '',
              heritageDescEn: c.heritageDescEn || c.heritage?.desc1?.en || '',
              heritageDescAr: c.heritageDescAr || c.heritage?.desc1?.ar || '',
              heritageDesc2En: c.heritageDesc2En || c.heritage?.desc2?.en || '',
              heritageDesc2Ar: c.heritageDesc2Ar || c.heritage?.desc2?.ar || '',
              heritageCtaPrimaryEn: c.heritageCtaPrimaryEn || c.heritage?.ctaPrimaryText?.en || 'Work with us',
              heritageCtaPrimaryAr: c.heritageCtaPrimaryAr || c.heritage?.ctaPrimaryText?.ar || 'اعمل معنا',
              heritageCtaPrimaryHref: c.heritageCtaPrimaryHref || c.heritage?.ctaPrimaryHref || '/contact',
              heritageCtaSecondaryEn: c.heritageCtaSecondaryEn || c.heritage?.ctaSecondaryText?.en || 'Meet the team',
              heritageCtaSecondaryAr: c.heritageCtaSecondaryAr || c.heritage?.ctaSecondaryText?.ar || 'تعرف على الفريق',
              heritageCtaSecondaryHref: c.heritageCtaSecondaryHref || c.heritage?.ctaSecondaryHref || '/about',
              heritageCollage: c.heritageCollage || c.heritage?.collageImages || [],

              // 4. Growth Services
              growthServicesTitleEn: c.growthServicesTitleEn || c.growthServices?.title?.en || 'Our Growth Services',
              growthServicesTitleAr: c.growthServicesTitleAr || c.growthServices?.title?.ar || 'خدمات النمو لدينا',
              growthServicesRatingEn: c.growthServicesRatingEn || c.growthServices?.ratingText?.en || '',
              growthServicesRatingAr: c.growthServicesRatingAr || c.growthServices?.ratingText?.ar || '',
              growthServicesAvatars:
                (Array.isArray(c.growthServicesAvatars) && c.growthServicesAvatars.length > 0)
                  ? c.growthServicesAvatars
                  : (Array.isArray(c.growthServices?.avatars) && c.growthServices.avatars.length > 0)
                  ? c.growthServices.avatars
                  : [
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                    ],
              servicesBannerEn: c.servicesBannerEn || c.growthServices?.bannerText?.en || '',
              servicesBannerAr: c.servicesBannerAr || c.growthServices?.bannerText?.ar || '',
              servicesBannerCtaEn: c.servicesBannerCtaEn || c.growthServices?.bannerCtaText?.en || 'Book call',
              servicesBannerCtaAr: c.servicesBannerCtaAr || c.growthServices?.bannerCtaText?.ar || 'احجز مكالمة',
              servicesBannerCtaHref: c.servicesBannerCtaHref || c.growthServices?.bannerCtaHref || '/contact',
              growthServicesList:
                (c.growthServicesList && c.growthServicesList.length > 0)
                  ? c.growthServicesList
                  : (c.growthServices?.services && c.growthServices.services.length > 0)
                  ? c.growthServices.services
                  : growthServicesHome,

              // 5. Client Videos
              videoSectionTitleEn: c.videoSectionTitleEn || c.clientVideos?.title?.en || 'Meet clients we scale',
              videoSectionTitleAr: c.videoSectionTitleAr || c.clientVideos?.title?.ar || 'تعرف على العملاء الذين نساعدهم على التوسع',
              videoTestimonials: c.videoTestimonials || c.clientVideos?.videos || [],

              // 6. Approach
              approachTitleEn: c.approachTitleEn || c.approach?.title?.en || 'Our Approach to AI & Digital Transformation',
              approachTitleAr: c.approachTitleAr || c.approach?.title?.ar || 'نهجنا في التحول الرقمي وحلول الذكاء الاصطناعي',
              approachDesc1En: c.approachDesc1En || c.approach?.desc1?.en || '',
              approachDesc1Ar: c.approachDesc1Ar || c.approach?.desc1?.ar || '',
              approachDesc2En: c.approachDesc2En || c.approach?.desc2?.en || '',
              approachDesc2Ar: c.approachDesc2Ar || c.approach?.desc2?.ar || '',
              approachBadgeLabelEn: c.approachBadgeLabelEn || c.approach?.badgeLabel?.en || 'Team Persici',
              approachBadgeLabelAr: c.approachBadgeLabelAr || c.approach?.badgeLabel?.ar || 'فريق بيرسيشي',
              approachBadgeTitleEn: c.approachBadgeTitleEn || c.approach?.badgeTitle?.en || 'Your team of specialists',
              approachBadgeTitleAr: c.approachBadgeTitleAr || c.approach?.badgeTitle?.ar || 'فريقك من المتخصصين',
              approachTeamImage: c.approachTeamImage || c.approach?.teamImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
              approachCtaPrimaryEn: c.approachCtaPrimaryEn || c.approach?.ctaPrimaryText?.en || 'Book call',
              approachCtaPrimaryAr: c.approachCtaPrimaryAr || c.approach?.ctaPrimaryText?.ar || 'احجز مكالمة',
              approachCtaPrimaryHref: c.approachCtaPrimaryHref || c.approach?.ctaPrimaryHref || '/contact',
              approachCtaSecondaryEn: c.approachCtaSecondaryEn || c.approach?.ctaSecondaryText?.en || 'More about us',
              approachCtaSecondaryAr: c.approachCtaSecondaryAr || c.approach?.ctaSecondaryText?.ar || 'المزيد عنا',
              approachCtaSecondaryHref: c.approachCtaSecondaryHref || c.approach?.ctaSecondaryHref || '/about',
              approachTeamMembers:
                (c.approachTeamMembers && c.approachTeamMembers.length > 0)
                  ? c.approachTeamMembers
                  : (c.approach?.teamMembers && c.approach.teamMembers.length > 0)
                  ? c.approach.teamMembers
                  : approachTeamAvatars,

              // 7. Reviews
              reviewsScore: c.reviewsScore || c.reviews?.score || '5.0',
              reviewsScoreLabelEn: c.reviewsScoreLabelEn || c.reviews?.scoreLabel?.en || '5.0 Rating from 100+ Enterprise Partners',
              reviewsScoreLabelAr: c.reviewsScoreLabelAr || c.reviews?.scoreLabel?.ar || 'تقييم 5.0 من أكثر من 100 شريك استراتيجي',
              reviewsTitleEn: c.reviewsTitleEn || c.reviews?.title?.en || 'Words from those we scale',
              reviewsTitleAr: c.reviewsTitleAr || c.reviews?.title?.ar || 'كلمات من أولئك الذين نساعدهم على التوسع',
              reviewsBannerTextEn: c.reviewsBannerTextEn || c.reviews?.bannerText?.en || '',
              reviewsBannerTextAr: c.reviewsBannerTextAr || c.reviews?.bannerText?.ar || '',
              reviewsBannerCtaEn: c.reviewsBannerCtaEn || c.reviews?.bannerCtaText?.en || 'Book a discovery call',
              reviewsBannerCtaAr: c.reviewsBannerCtaAr || c.reviews?.bannerCtaText?.ar || 'احجز مكالمة استكشافية',
              reviewsBannerCtaHref: c.reviewsBannerCtaHref || c.reviews?.bannerCtaHref || '/contact',
              reviewsList: (
                canonicalReviews ||
                (c.reviewsList && c.reviewsList.length > 0
                  ? c.reviewsList
                  : c.reviews?.reviews && c.reviews.reviews.length > 0
                  ? c.reviews.reviews
                  : fallbackReviewsList)
              ).map((rev: any) => ({
                ...rev,
                nameEn: rev.nameEn || (typeof rev.name === 'object' ? rev.name?.en : rev.name) || '',
                nameAr: rev.nameAr || (typeof rev.name === 'object' ? rev.name?.ar : '') || '',
                roleEn: rev.roleEn || (typeof rev.role === 'object' ? rev.role?.en : rev.role) || '',
                roleAr: rev.roleAr || (typeof rev.role === 'object' ? rev.role?.ar : '') || '',
                companyEn: rev.companyEn || (typeof rev.company === 'object' ? rev.company?.en : rev.company) || '',
                companyAr: rev.companyAr || (typeof rev.company === 'object' ? rev.company?.ar : '') || '',
                reviewEn: rev.reviewEn || (typeof rev.review === 'object' ? rev.review?.en : rev.review) || '',
                reviewAr: rev.reviewAr || (typeof rev.review === 'object' ? rev.review?.ar : '') || '',
                verifiedEn: rev.verifiedEn || (typeof rev.verified === 'object' ? rev.verified?.en : rev.verified) || 'Verified Client',
                verifiedAr: rev.verifiedAr || (typeof rev.verified === 'object' ? rev.verified?.ar : '') || 'عميل موثق',
              })),

              // 8. Home Contact
              homeContactLeftTitleEn: c.homeContactLeftTitleEn || c.homeContact?.leftTitle?.en || 'Ready to accelerate your digital future?',
              homeContactLeftTitleAr: c.homeContactLeftTitleAr || c.homeContact?.leftTitle?.ar || 'جاهز لتسريع مستقبلك الرقمي؟',
              homeContactPoints: c.homeContactPoints || c.homeContact?.points || [
                { en: 'Modernize legacy systems and accelerate digital transformation', ar: 'تحديث الأنظمة القديمة وتسريع مسار التحول الرقمي الشامل' },
                { en: 'Deploy custom enterprise AI models, automations, and data pipelines', ar: 'نشر نماذج وأدوات الذكاء الاصطناعي المخصصة والأتمتة الذكية وهندسة البيانات' },
                { en: 'Architect scalable web/mobile applications and resilient cloud infrastructure', ar: 'هندسة تطبيقات الويب والجوال القابلة للتوسع والبنية التحتية السحابية' },
                { en: 'Accelerate growth with integrated UX design, digital strategy, and performance media', ar: 'تسريع النمو بتكامل تصميم تجربة المستخدم والاستراتيجية الرقمية وإعلانات الأداء' },
              ],
              homeContactTrustedByEn: c.homeContactTrustedByEn || c.homeContact?.trustedBy?.en || 'Trusted by visionary leaders and high-growth enterprises.',
              homeContactTrustedByAr: c.homeContactTrustedByAr || c.homeContact?.trustedBy?.ar || 'موثوق بنا من قِبل قادة التحول والمؤسسات الرائدة في المنطقة.',
              homeContactTitleEn: c.homeContactTitleEn || c.homeContact?.title?.en || 'Get in touch',
              homeContactTitleAr: c.homeContactTitleAr || c.homeContact?.title?.ar || 'تواصل معنا',
              homeContactSubtitleEn: c.homeContactSubtitleEn || c.homeContact?.subtitle?.en || 'Submit the form below and our digital transformation experts will reach out.',
              homeContactSubtitleAr: c.homeContactSubtitleAr || c.homeContact?.subtitle?.ar || 'أرسل بياناتك وسيتواصل معك أحد خبرائنا في التحول الرقمي والتكنولوجيا.',
              homeContactBgImage: c.homeContactBgImage || c.homeContact?.bgImage || '/images/footer/footer.gif',
            });
          } else if (slug === 'about') {
            setPageData({
              ...aboutPageData,
              ...c,
              hero: {
                ...aboutPageData.hero,
                ...(c.hero || {}),
                badge: { ...aboutPageData.hero.badge, ...(c.hero?.badge || {}) },
                title: { ...aboutPageData.hero.title, ...(c.hero?.title || {}) },
                subtitle: { ...aboutPageData.hero.subtitle, ...(c.hero?.subtitle || {}) },
                primaryCta: { ...aboutPageData.hero.primaryCta, ...(c.hero?.primaryCta || {}) },
                secondaryCta: { ...aboutPageData.hero.secondaryCta, ...(c.hero?.secondaryCta || {}) },
              },
              purpose: {
                ...aboutPageData.purpose,
                ...(c.purpose || {}),
                badge: { ...aboutPageData.purpose.badge, ...(c.purpose?.badge || {}) },
                title: { ...aboutPageData.purpose.title, ...(c.purpose?.title || {}) },
                description1: { ...aboutPageData.purpose.description1, ...(c.purpose?.description1 || {}) },
                description2: { ...aboutPageData.purpose.description2, ...(c.purpose?.description2 || {}) },
                image: c.purpose?.image || aboutPageData.purpose.image,
                stats: Array.isArray(c.purpose?.stats) && c.purpose.stats.length > 0
                  ? c.purpose.stats
                  : aboutPageData.purpose.stats,
              },
              heritage: {
                ...aboutPageData.heritage,
                ...(c.heritage || {}),
                badge: { ...aboutPageData.heritage.badge, ...(c.heritage?.badge || {}) },
                title: { ...aboutPageData.heritage.title, ...(c.heritage?.title || {}) },
                description: { ...aboutPageData.heritage.description, ...(c.heritage?.description || {}) },
                cta: { ...aboutPageData.heritage.cta, ...(c.heritage?.cta || {}) },
                image: c.heritage?.image || aboutPageData.heritage.image,
                bgImage: c.heritage?.bgImage || aboutPageData.heritage.bgImage || '/about/heritage-bg.jpg',
                metrics: Array.isArray(c.heritage?.metrics) && c.heritage.metrics.length > 0
                  ? c.heritage.metrics
                  : aboutPageData.heritage.metrics,
              },
              partnership: {
                ...aboutPageData.partnership,
                ...(c.partnership || {}),
                badge: { ...aboutPageData.partnership.badge, ...(c.partnership?.badge || {}) },
                title: { ...aboutPageData.partnership.title, ...(c.partnership?.title || {}) },
                quote: { ...aboutPageData.partnership.quote, ...(c.partnership?.quote || {}) },
                cta: { ...aboutPageData.partnership.cta, ...(c.partnership?.cta || {}) },
                image: c.partnership?.image || aboutPageData.partnership.image,
                floatingBadge: {
                  ...(aboutPageData.partnership.floatingBadge || {
                    en: 'Active Strategic Squads',
                    ar: 'تحالفات استراتيجية نشطة',
                  }),
                  ...(c.partnership?.floatingBadge || {}),
                },
                paragraphs: Array.isArray(c.partnership?.paragraphs) && c.partnership.paragraphs.length > 0
                  ? c.partnership.paragraphs
                  : aboutPageData.partnership.paragraphs,
              },
              milestones: {
                ...aboutPageData.milestones,
                ...(c.milestones || {}),
                badge: { ...aboutPageData.milestones.badge, ...(c.milestones?.badge || {}) },
                title: { ...aboutPageData.milestones.title, ...(c.milestones?.title || {}) },
                subtitle: { ...aboutPageData.milestones.subtitle, ...(c.milestones?.subtitle || {}) },
                items: Array.isArray(c.milestones?.items) && c.milestones.items.length > 0
                  ? c.milestones.items
                  : aboutPageData.milestones.items,
              },
              quote: {
                ...aboutPageData.quote,
                ...(c.quote || {}),
                badge: { ...aboutPageData.quote.badge, ...(c.quote?.badge || {}) },
                quote: { ...aboutPageData.quote.quote, ...(c.quote?.quote || {}) },
                author: { ...aboutPageData.quote.author, ...(c.quote?.author || {}) },
                role: { ...aboutPageData.quote.role, ...(c.quote?.role || {}) },
                avatar: c.quote?.avatar ?? aboutPageData.quote.avatar,
              },
              culture: {
                ...aboutPageData.culture,
                ...(c.culture || {}),
                badge: { ...aboutPageData.culture.badge, ...(c.culture?.badge || {}) },
                title: { ...aboutPageData.culture.title, ...(c.culture?.title || {}) },
                subtitle: { ...aboutPageData.culture.subtitle, ...(c.culture?.subtitle || {}) },
                photos: Array.isArray(c.culture?.photos) && c.culture.photos.length >= 4
                  ? c.culture.photos
                  : aboutPageData.culture.photos,
              },
              pillars: {
                ...aboutPageData.pillars,
                ...(c.pillars || {}),
                badge: { ...aboutPageData.pillars.badge, ...(c.pillars?.badge || {}) },
                title: { ...aboutPageData.pillars.title, ...(c.pillars?.title || {}) },
                subtitle: { ...aboutPageData.pillars.subtitle, ...(c.pillars?.subtitle || {}) },
                items: Array.isArray(c.pillars?.items) && c.pillars.items.length > 0
                  ? c.pillars.items
                  : aboutPageData.pillars.items,
              },
              values: {
                ...aboutPageData.values,
                ...(c.values || {}),
                badge: { ...aboutPageData.values.badge, ...(c.values?.badge || {}) },
                title: { ...aboutPageData.values.title, ...(c.values?.title || {}) },
                subtitle: { ...aboutPageData.values.subtitle, ...(c.values?.subtitle || {}) },
                card1: {
                  ...aboutPageData.values.card1,
                  ...(c.values?.card1 || {}),
                  badge: { ...aboutPageData.values.card1.badge, ...(c.values?.card1?.badge || {}) },
                  title: { ...aboutPageData.values.card1.title, ...(c.values?.card1?.title || {}) },
                  description: { ...aboutPageData.values.card1.description, ...(c.values?.card1?.description || {}) },
                  cta: { ...aboutPageData.values.card1.cta, ...(c.values?.card1?.cta || {}) },
                },
                card2: {
                  ...aboutPageData.values.card2,
                  ...(c.values?.card2 || {}),
                  badge: { ...aboutPageData.values.card2.badge, ...(c.values?.card2?.badge || {}) },
                  title: { ...aboutPageData.values.card2.title, ...(c.values?.card2?.title || {}) },
                  description: { ...aboutPageData.values.card2.description, ...(c.values?.card2?.description || {}) },
                  cta: { ...aboutPageData.values.card2.cta, ...(c.values?.card2?.cta || {}) },
                },
              },
            });
          } else if (slug === 'contact') {
            const hasValidOffices =
              Array.isArray(c.offices) &&
              c.offices.length > 0 &&
              typeof c.offices[0]?.city === 'object' &&
              Boolean(c.offices[0]?.country);
            const hasValidChannels =
              Array.isArray(c.channels) &&
              c.channels.length > 0 &&
              typeof c.channels[0]?.title === 'object';
            const hasValidFaqs =
              Array.isArray(c.faqs) &&
              c.faqs.length > 0 &&
              typeof c.faqs[0]?.question === 'object';

            setPageData({
              ...contactPageData,
              ...c,
              hero: {
                ...contactPageData.hero,
                ...(c.hero || {}),
                badge: { ...contactPageData.hero.badge, ...(c.hero?.badge || {}) },
                title: { ...contactPageData.hero.title, ...(c.hero?.title || {}) },
                subtitle: { ...contactPageData.hero.subtitle, ...(c.hero?.subtitle || {}) },
                quickLinks:
                  Array.isArray(c.hero?.quickLinks) && c.hero.quickLinks.length > 0
                    ? c.hero.quickLinks
                    : contactPageData.hero.quickLinks,
              },
              officesBadge: {
                ...(contactPageData.officesBadge || { en: 'Global Presence', ar: 'حضور استراتيجي عالمي' }),
                ...(c.officesBadge || {}),
              },
              officesTitle: {
                ...contactPageData.officesTitle,
                ...(c.officesTitle || {}),
              },
              officesSubtitle: {
                ...contactPageData.officesSubtitle,
                ...(c.officesSubtitle || {}),
              },
              offices: hasValidOffices ? c.offices : contactPageData.offices,
              channelsBadge: {
                ...(contactPageData.channelsBadge || { en: 'Direct Inquiries', ar: 'قنوات تواصل سريعة ومباشرة' }),
                ...(c.channelsBadge || {}),
              },
              channelsTitle: {
                ...contactPageData.channelsTitle,
                ...(c.channelsTitle || {}),
              },
              channelsSubtitle: {
                ...contactPageData.channelsSubtitle,
                ...(c.channelsSubtitle || {}),
              },
              channels: hasValidChannels ? c.channels : contactPageData.channels,
              faqsTitle: {
                ...contactPageData.faqsTitle,
                ...(c.faqsTitle || {}),
              },
              faqsSubtitle: {
                ...contactPageData.faqsSubtitle,
                ...(c.faqsSubtitle || {}),
              },
              faqs: hasValidFaqs ? c.faqs : contactPageData.faqs,
            });
          } else if (slug === 'client-stories') {
            const defaultCategories = clientStoriesHubPageData.allStoriesSection.categories;
            const hasValidCategories =
              Array.isArray(c.allStoriesSection?.categories) &&
              c.allStoriesSection.categories.length > 0 &&
              typeof c.allStoriesSection.categories[0]?.label === 'object';

            setPageData({
              ...clientStoriesHubPageData,
              ...c,
              hero: {
                ...clientStoriesHubPageData.hero,
                ...(c.hero || {}),
                badge: { ...clientStoriesHubPageData.hero.badge, ...(c.hero?.badge || {}) },
                title: { ...clientStoriesHubPageData.hero.title, ...(c.hero?.title || {}) },
                titleHighlight: {
                  ...clientStoriesHubPageData.hero.titleHighlight,
                  ...(c.hero?.titleHighlight || {}),
                },
                subtitle: { ...clientStoriesHubPageData.hero.subtitle, ...(c.hero?.subtitle || {}) },
                primaryCtaLabel: {
                  ...clientStoriesHubPageData.hero.primaryCtaLabel,
                  ...(c.hero?.primaryCtaLabel || {}),
                },
                primaryCtaHref:
                  c.hero?.primaryCtaHref || clientStoriesHubPageData.hero.primaryCtaHref,
                secondaryCtaLabel: {
                  ...clientStoriesHubPageData.hero.secondaryCtaLabel,
                  ...(c.hero?.secondaryCtaLabel || {}),
                },
                secondaryCtaHref:
                  c.hero?.secondaryCtaHref || clientStoriesHubPageData.hero.secondaryCtaHref,
              },
              featuredSection: {
                ...clientStoriesHubPageData.featuredSection,
                ...(c.featuredSection || {}),
                badge: {
                  ...clientStoriesHubPageData.featuredSection.badge,
                  ...(c.featuredSection?.badge || {}),
                },
                title: {
                  ...clientStoriesHubPageData.featuredSection.title,
                  ...(c.featuredSection?.title || {}),
                },
                subtitle: {
                  ...clientStoriesHubPageData.featuredSection.subtitle,
                  ...(c.featuredSection?.subtitle || {}),
                },
                ctaLabel: {
                  ...clientStoriesHubPageData.featuredSection.ctaLabel,
                  ...(c.featuredSection?.ctaLabel || {}),
                },
              },
              allStoriesSection: {
                ...clientStoriesHubPageData.allStoriesSection,
                ...(c.allStoriesSection || {}),
                badge: {
                  ...clientStoriesHubPageData.allStoriesSection.badge,
                  ...(c.allStoriesSection?.badge || {}),
                },
                title: {
                  ...clientStoriesHubPageData.allStoriesSection.title,
                  ...(c.allStoriesSection?.title || {}),
                },
                subtitle: {
                  ...clientStoriesHubPageData.allStoriesSection.subtitle,
                  ...(c.allStoriesSection?.subtitle || {}),
                },
                emptyTitle: {
                  ...clientStoriesHubPageData.allStoriesSection.emptyTitle,
                  ...(c.allStoriesSection?.emptyTitle || {}),
                },
                emptySubtitle: {
                  ...clientStoriesHubPageData.allStoriesSection.emptySubtitle,
                  ...(c.allStoriesSection?.emptySubtitle || {}),
                },
                categories: hasValidCategories ? c.allStoriesSection.categories : defaultCategories,
              },
            });
          } else if (slug === 'careers') {
            setPageData({
              ...careersHubData,
              ...c,
              hero: {
                ...careersHubData.hero,
                ...(c.hero || {}),
                enabled: c.hero?.enabled !== false,
                badge: { ...careersHubData.hero.badge, ...(c.hero?.badge || {}) },
                title: { ...careersHubData.hero.title, ...(c.hero?.title || {}) },
                description: { ...careersHubData.hero.description, ...(c.hero?.description || {}) },
                primaryCta: {
                  ...careersHubData.hero.primaryCta!,
                  ...(c.hero?.primaryCta || {}),
                  text: {
                    ...careersHubData.hero.primaryCta!.text,
                    ...(c.hero?.primaryCta?.text || {}),
                  },
                  href: c.hero?.primaryCta?.href || careersHubData.hero.primaryCta!.href,
                  enabled: c.hero?.primaryCta?.enabled !== false,
                },
                secondaryCta: {
                  ...careersHubData.hero.secondaryCta!,
                  ...(c.hero?.secondaryCta || {}),
                  text: {
                    ...careersHubData.hero.secondaryCta!.text,
                    ...(c.hero?.secondaryCta?.text || {}),
                  },
                  href: c.hero?.secondaryCta?.href || careersHubData.hero.secondaryCta!.href,
                  enabled: c.hero?.secondaryCta?.enabled !== false,
                },
                stats:
                  Array.isArray(c.hero?.stats) && c.hero.stats.length > 0
                    ? c.hero.stats
                    : careersHubData.hero.stats,
              },
              culture: {
                ...careersHubData.culture,
                ...(c.culture || {}),
                enabled: c.culture?.enabled !== false,
                badge: { ...careersHubData.culture.badge, ...(c.culture?.badge || {}) },
                title: { ...careersHubData.culture.title, ...(c.culture?.title || {}) },
                description: { ...careersHubData.culture.description, ...(c.culture?.description || {}) },
                photos:
                  Array.isArray(c.culture?.photos) && c.culture.photos.length > 0
                    ? c.culture.photos
                    : careersHubData.culture.photos,
              },
              perks: {
                ...careersHubData.perks,
                ...(c.perks || {}),
                enabled: c.perks?.enabled !== false,
                badge: { ...careersHubData.perks.badge, ...(c.perks?.badge || {}) },
                title: { ...careersHubData.perks.title, ...(c.perks?.title || {}) },
                subtitle: { ...careersHubData.perks.subtitle, ...(c.perks?.subtitle || {}) },
                items:
                  Array.isArray(c.perks?.items) && c.perks.items.length > 0
                    ? c.perks.items
                    : careersHubData.perks.items,
              },
              process: {
                ...careersHubData.process,
                ...(c.process || {}),
                enabled: c.process?.enabled !== false,
                badge: { ...careersHubData.process.badge, ...(c.process?.badge || {}) },
                title: { ...careersHubData.process.title, ...(c.process?.title || {}) },
                subtitle: { ...careersHubData.process.subtitle, ...(c.process?.subtitle || {}) },
                steps:
                  Array.isArray(c.process?.steps) && c.process.steps.length > 0
                    ? c.process.steps
                    : careersHubData.process.steps,
              },
              openPositions: {
                ...careersHubData.openPositions,
                ...(c.openPositions || {}),
                enabled: c.openPositions?.enabled !== false,
                badge: { ...careersHubData.openPositions.badge, ...(c.openPositions?.badge || {}) },
                title: { ...careersHubData.openPositions.title, ...(c.openPositions?.title || {}) },
                subtitle: { ...careersHubData.openPositions.subtitle, ...(c.openPositions?.subtitle || {}) },
                searchPlaceholder: {
                  ...careersHubData.openPositions.searchPlaceholder,
                  ...(c.openPositions?.searchPlaceholder || {}),
                },
                departmentLabel: {
                  ...careersHubData.openPositions.departmentLabel,
                  ...(c.openPositions?.departmentLabel || {}),
                },
                locationLabel: {
                  ...careersHubData.openPositions.locationLabel,
                  ...(c.openPositions?.locationLabel || {}),
                },
                stackLabel: {
                  ...careersHubData.openPositions.stackLabel,
                  ...(c.openPositions?.stackLabel || {}),
                },
                highPriorityBadge: {
                  ...careersHubData.openPositions.highPriorityBadge,
                  ...(c.openPositions?.highPriorityBadge || {}),
                },
                applyCtaText: {
                  ...careersHubData.openPositions.applyCtaText,
                  ...(c.openPositions?.applyCtaText || {}),
                },
                emptyTitle: {
                  ...careersHubData.openPositions.emptyTitle,
                  ...(c.openPositions?.emptyTitle || {}),
                },
                emptySubtitle: {
                  ...careersHubData.openPositions.emptySubtitle,
                  ...(c.openPositions?.emptySubtitle || {}),
                },
                resetButtonText: {
                  ...careersHubData.openPositions.resetButtonText,
                  ...(c.openPositions?.resetButtonText || {}),
                },
                departments:
                  Array.isArray(c.openPositions?.departments) && c.openPositions.departments.length > 0
                    ? c.openPositions.departments
                    : careersHubData.openPositions.departments,
                locations:
                  Array.isArray(c.openPositions?.locations) && c.openPositions.locations.length > 0
                    ? c.openPositions.locations
                    : careersHubData.openPositions.locations,
              },
              spontaneous: {
                ...careersHubData.spontaneous,
                ...(c.spontaneous || {}),
                enabled: c.spontaneous?.enabled !== false,
                badge: { ...careersHubData.spontaneous.badge, ...(c.spontaneous?.badge || {}) },
                title: { ...careersHubData.spontaneous.title, ...(c.spontaneous?.title || {}) },
                description: { ...careersHubData.spontaneous.description, ...(c.spontaneous?.description || {}) },
                ctaText: { ...careersHubData.spontaneous.ctaText, ...(c.spontaneous?.ctaText || {}) },
                email: c.spontaneous?.email || careersHubData.spontaneous.email || 'hr@persiciagency.com',
                emailSubject: {
                  ...(careersHubData.spontaneous.emailSubject || { en: '', ar: '' }),
                  ...(c.spontaneous?.emailSubject || {}),
                },
              },
              faqs: {
                ...careersHubData.faqs,
                ...(c.faqs || {}),
                enabled: c.faqs?.enabled !== false,
                badge: { ...careersHubData.faqs.badge, ...(c.faqs?.badge || {}) },
                title: { ...careersHubData.faqs.title, ...(c.faqs?.title || {}) },
                subtitle: { ...careersHubData.faqs.subtitle, ...(c.faqs?.subtitle || {}) },
                items:
                  Array.isArray(c.faqs?.items) && c.faqs.items.length > 0
                    ? c.faqs.items
                    : careersHubData.faqs.items,
              },
            });
          } else if (slug === 'insights') {
            const pickBi = (
              custom: { en?: string; ar?: string } | undefined | null,
              fallback: { en: string; ar: string }
            ) => ({
              en:
                custom && typeof custom.en === 'string' && custom.en.trim()
                  ? custom.en
                  : fallback.en,
              ar:
                custom && typeof custom.ar === 'string' && custom.ar.trim()
                  ? custom.ar
                  : fallback.ar,
            });
            const pickStr = (custom: string | undefined | null, fallback: string) =>
              typeof custom === 'string' && custom.trim() ? custom.trim() : fallback;

            setPageData({
              ...insightsHubPageData,
              ...c,
              hero: {
                ...insightsHubPageData.hero,
                ...(c.hero || {}),
                enabled: c.hero?.enabled !== false,
                badge: pickBi(c.hero?.badge, insightsHubPageData.hero.badge),
                title: pickBi(c.hero?.title, insightsHubPageData.hero.title),
                titleHighlight: pickBi(
                  c.hero?.titleHighlight,
                  insightsHubPageData.hero.titleHighlight
                ),
                description: pickBi(c.hero?.description, insightsHubPageData.hero.description),
                primaryCtaLabel: pickBi(
                  c.hero?.primaryCtaLabel,
                  insightsHubPageData.hero.primaryCtaLabel
                ),
                primaryCtaHref: pickStr(
                  c.hero?.primaryCtaHref,
                  insightsHubPageData.hero.primaryCtaHref
                ),
                secondaryCtaLabel: pickBi(
                  c.hero?.secondaryCtaLabel,
                  insightsHubPageData.hero.secondaryCtaLabel
                ),
                secondaryCtaHref: pickStr(
                  c.hero?.secondaryCtaHref,
                  insightsHubPageData.hero.secondaryCtaHref
                ),
                heroImage: pickStr(c.hero?.heroImage, insightsHubPageData.hero.heroImage),
                heroImageAlt: pickBi(c.hero?.heroImageAlt, insightsHubPageData.hero.heroImageAlt),
              },
              exploreSection: {
                ...insightsHubPageData.exploreSection,
                ...(c.exploreSection || {}),
                enabled: c.exploreSection?.enabled !== false,
                badge: pickBi(
                  c.exploreSection?.badge,
                  insightsHubPageData.exploreSection.badge
                ),
                title: pickBi(
                  c.exploreSection?.title,
                  insightsHubPageData.exploreSection.title
                ),
                subtitle: pickBi(
                  c.exploreSection?.subtitle,
                  insightsHubPageData.exploreSection.subtitle
                ),
                categories:
                  Array.isArray(c.exploreSection?.categories) &&
                  c.exploreSection.categories.length > 0
                    ? c.exploreSection.categories
                    : insightsHubPageData.exploreSection.categories,
                emptyTitle: pickBi(
                  c.exploreSection?.emptyTitle,
                  insightsHubPageData.exploreSection.emptyTitle
                ),
                emptySubtitle: pickBi(
                  c.exploreSection?.emptySubtitle,
                  insightsHubPageData.exploreSection.emptySubtitle
                ),
                loadMoreText: pickBi(
                  c.exploreSection?.loadMoreText,
                  insightsHubPageData.exploreSection.loadMoreText
                ),
              },
              newsletterSection: {
                ...insightsHubPageData.newsletterSection,
                ...(c.newsletterSection || {}),
                enabled: c.newsletterSection?.enabled !== false,
                badge: pickBi(
                  c.newsletterSection?.badge,
                  insightsHubPageData.newsletterSection.badge
                ),
                title: pickBi(
                  c.newsletterSection?.title,
                  insightsHubPageData.newsletterSection.title
                ),
                subtitle: pickBi(
                  c.newsletterSection?.subtitle,
                  insightsHubPageData.newsletterSection.subtitle
                ),
                emailPlaceholder: pickBi(
                  c.newsletterSection?.emailPlaceholder,
                  insightsHubPageData.newsletterSection.emailPlaceholder
                ),
                submitButtonText: pickBi(
                  c.newsletterSection?.submitButtonText,
                  insightsHubPageData.newsletterSection.submitButtonText
                ),
                successMessage: pickBi(
                  c.newsletterSection?.successMessage,
                  insightsHubPageData.newsletterSection.successMessage
                ),
                privacyDisclaimer: pickBi(
                  c.newsletterSection?.privacyDisclaimer,
                  insightsHubPageData.newsletterSection.privacyDisclaimer
                ),
                image: pickStr(
                  c.newsletterSection?.image,
                  insightsHubPageData.newsletterSection.image
                ),
                imageAlt: pickBi(
                  c.newsletterSection?.imageAlt,
                  insightsHubPageData.newsletterSection.imageAlt
                ),
              },
              contactSection: {
                ...insightsHubPageData.contactSection,
                ...(c.contactSection || {}),
                enabled: c.contactSection?.enabled !== false,
              },
            });
          } else if (slug === 'solutions') {
            setPageData(normalizeSolutionsHubPageData(c));
          } else if (isSolutionPageSlug(slug)) {
            setPageData(normalizeSolutionFeaturePageData(slug, c));
          } else if (slug === 'industries') {
            setPageData(normalizeIndustriesHubPageData(c));
          } else if (isIndustryPageSlug(slug)) {
            setPageData(normalizeIndustryFeaturePageData(slug, c));
          } else if (slug === 'how-we-do-it') {
            setPageData(normalizeHowWeDoItHubPageData(c));
          } else if (isHowWeDoItPageSlug(slug)) {
            setPageData(normalizeHowWeDoItFeaturePageData(slug, c));
          } else {
            setPageData(c);
          }
        } else if (slug === 'insights') {
          setPageData(insightsHubPageData);
        } else if (slug === 'solutions') {
          setPageData(normalizeSolutionsHubPageData({}));
        } else if (isSolutionPageSlug(slug)) {
          setPageData(normalizeSolutionFeaturePageData(slug, {}));
        } else if (slug === 'industries') {
          setPageData(normalizeIndustriesHubPageData({}));
        } else if (isIndustryPageSlug(slug)) {
          setPageData(normalizeIndustryFeaturePageData(slug, {}));
        } else if (slug === 'how-we-do-it') {
          setPageData(normalizeHowWeDoItHubPageData({}));
        } else if (isHowWeDoItPageSlug(slug)) {
          setPageData(normalizeHowWeDoItFeaturePageData(slug, {}));
        }
      } catch (err) {
        console.error('Failed to load page content:', err);
        if (slug === 'insights') {
          setPageData(insightsHubPageData);
        } else if (slug === 'solutions') {
          setPageData(normalizeSolutionsHubPageData({}));
        } else if (isSolutionPageSlug(slug)) {
          setPageData(normalizeSolutionFeaturePageData(slug, {}));
        } else if (slug === 'industries') {
          setPageData(normalizeIndustriesHubPageData({}));
        } else if (isIndustryPageSlug(slug)) {
          setPageData(normalizeIndustryFeaturePageData(slug, {}));
        } else if (slug === 'how-we-do-it') {
          setPageData(normalizeHowWeDoItHubPageData({}));
        } else if (isHowWeDoItPageSlug(slug)) {
          setPageData(normalizeHowWeDoItFeaturePageData(slug, {}));
        }
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [slug]);

  const savePage = async () => {
    setSavingAll(true);
    setErrorMessage(null);
    try {
      let payloadToSave: Record<string, any> = { ...pageData };

      if (slug === 'home') {
        payloadToSave = {
          ...pageData,
          page: 'home',
          hero: {
            ...pageData.hero,
            title: {
              en: pageData.heroTitle || pageData.hero?.title?.en || '',
              ar: pageData.heroTitleAr || pageData.hero?.title?.ar || '',
            },
            subtitle: {
              en: pageData.heroDescriptionEn || pageData.heroDescription || pageData.hero?.subtitle?.en || '',
              ar: pageData.heroDescriptionAr || pageData.hero?.subtitle?.ar || '',
            },
            ctaText: {
              en: pageData.heroCtaLabelEn || pageData.hero?.ctaText?.en || pageData.hero?.cta?.en || 'Schedule Discovery Call',
              ar: pageData.heroCtaLabelAr || pageData.hero?.ctaText?.ar || pageData.hero?.cta?.ar || 'احجز جلسة استشارية',
            },
            ctaHref: pageData.heroCtaHref || pageData.hero?.ctaHref || '/contact',
            ctaEnabled: pageData.heroCtaEnabled !== false,
            ratingScore: pageData.heroStars ? String(pageData.heroStars) : (pageData.hero?.ratingScore || '5.0'),
            ratingLabel: {
              en: pageData.heroScoreTextEn || pageData.hero?.ratingLabel?.en || '',
              ar: pageData.heroScoreTextAr || pageData.hero?.ratingLabel?.ar || '',
            },
            trustedByTitle: {
              en: pageData.partnersTitleEn || pageData.hero?.trustedByTitle?.en || pageData.hero?.trustedBy?.en || '',
              ar: pageData.partnersTitleAr || pageData.hero?.trustedByTitle?.ar || pageData.hero?.trustedBy?.ar || '',
            },
            clientLogos: pageData.clientLogos || pageData.hero?.clientLogos || [],
            heroAvatars: pageData.heroAvatars || pageData.hero?.heroAvatars || [],
            avatars: pageData.heroAvatars || pageData.hero?.heroAvatars || [],
          },
          partnerShowcase: {
            ...pageData.partnerShowcase,
            title: {
              en: pageData.partnerShowcaseTitleEn || pageData.partnerShowcase?.title?.en || '',
              ar: pageData.partnerShowcaseTitleAr || pageData.partnerShowcase?.title?.ar || '',
            },
            videoSpeaker: {
              en: pageData.partnerShowcaseSpeakerEn || pageData.partnerShowcase?.videoSpeaker?.en || '',
              ar: pageData.partnerShowcaseSpeakerAr || pageData.partnerShowcase?.videoSpeaker?.ar || '',
            },
            videoRole: {
              en: pageData.partnerShowcaseRoleEn || pageData.partnerShowcase?.videoRole?.en || '',
              ar: pageData.partnerShowcaseRoleAr || pageData.partnerShowcase?.videoRole?.ar || '',
            },
            speakerAvatar: pageData.partnerShowcaseAvatar || pageData.partnerShowcase?.speakerAvatar || '',
            videoCoverImage: pageData.partnerShowcaseCover || pageData.partnerShowcase?.videoCoverImage || '',
            videoUrl: pageData.partnerShowcaseVideoUrl || pageData.partnerShowcase?.videoUrl || '',
            quote: {
              en: pageData.partnerShowcaseQuoteEn || pageData.partnerShowcase?.quote?.en || '',
              ar: pageData.partnerShowcaseQuoteAr || pageData.partnerShowcase?.quote?.ar || '',
            },
            author: pageData.partnerShowcaseAuthor || pageData.partnerShowcase?.author || '',
            company: pageData.partnerShowcaseCompany || pageData.partnerShowcase?.company || '',
            role: {
              en: pageData.partnerShowcaseAuthorRoleEn || pageData.partnerShowcase?.role?.en || '',
              ar: pageData.partnerShowcaseAuthorRoleAr || pageData.partnerShowcase?.role?.ar || '',
            },
            testimonials: pageData.partnerShowcaseTestimonials || pageData.partnerShowcase?.testimonials || [],
          },
          heritage: {
            ...pageData.heritage,
            title: {
              en: pageData.heritageTitleEn || pageData.heritage?.title?.en || '',
              ar: pageData.heritageTitleAr || pageData.heritage?.title?.ar || '',
            },
            desc1: {
              en: pageData.heritageDescEn || pageData.heritage?.desc1?.en || '',
              ar: pageData.heritageDescAr || pageData.heritage?.desc1?.ar || '',
            },
            desc2: {
              en: pageData.heritageDesc2En || pageData.heritage?.desc2?.en || '',
              ar: pageData.heritageDesc2Ar || pageData.heritage?.desc2?.ar || '',
            },
            ctaPrimaryText: {
              en: pageData.heritageCtaPrimaryEn || pageData.heritage?.ctaPrimaryText?.en || 'Work with us',
              ar: pageData.heritageCtaPrimaryAr || pageData.heritage?.ctaPrimaryText?.ar || 'اعمل معنا',
            },
            ctaPrimaryHref: pageData.heritageCtaPrimaryHref || pageData.heritage?.ctaPrimaryHref || '/contact',
            ctaSecondaryText: {
              en: pageData.heritageCtaSecondaryEn || pageData.heritage?.ctaSecondaryText?.en || 'Meet the team',
              ar: pageData.heritageCtaSecondaryAr || pageData.heritage?.ctaSecondaryText?.ar || 'تعرف على الفريق',
            },
            ctaSecondaryHref: pageData.heritageCtaSecondaryHref || pageData.heritage?.ctaSecondaryHref || '/about',
            collageImages: pageData.heritageCollage || pageData.heritage?.collageImages || [],
          },
          growthServices: {
            ...pageData.growthServices,
            title: {
              en: pageData.growthServicesTitleEn || pageData.growthServices?.title?.en || 'Our Growth Services',
              ar: pageData.growthServicesTitleAr || pageData.growthServices?.title?.ar || 'خدمات النمو لدينا',
            },
            ratingText: {
              en: pageData.growthServicesRatingEn || pageData.growthServices?.ratingText?.en || '',
              ar: pageData.growthServicesRatingAr || pageData.growthServices?.ratingText?.ar || '',
            },
            avatars: pageData.growthServicesAvatars || pageData.growthServices?.avatars || [],
            bannerText: {
              en: pageData.servicesBannerEn || pageData.growthServices?.bannerText?.en || '',
              ar: pageData.servicesBannerAr || pageData.growthServices?.bannerText?.ar || '',
            },
            bannerCtaText: {
              en: pageData.servicesBannerCtaEn || pageData.growthServices?.bannerCtaText?.en || 'Book call',
              ar: pageData.servicesBannerCtaAr || pageData.growthServices?.bannerCtaText?.ar || 'احجز مكالمة',
            },
            bannerCtaHref: pageData.servicesBannerCtaHref || pageData.growthServices?.bannerCtaHref || '/contact',
            services: pageData.growthServicesList || pageData.growthServices?.services || [],
          },
          clientVideos: {
            ...pageData.clientVideos,
            title: {
              en: pageData.videoSectionTitleEn || pageData.clientVideos?.title?.en || 'Meet clients we scale',
              ar: pageData.videoSectionTitleAr || pageData.clientVideos?.title?.ar || 'تعرف على العملاء الذين نساعدهم على التوسع',
            },
            videos: pageData.videoTestimonials || pageData.clientVideos?.videos || [],
          },
          approach: {
            ...pageData.approach,
            title: {
              en: pageData.approachTitleEn || pageData.approach?.title?.en || 'Our Approach to AI & Digital Transformation',
              ar: pageData.approachTitleAr || pageData.approach?.title?.ar || 'نهجنا في التحول الرقمي وحلول الذكاء الاصطناعي',
            },
            desc1: {
              en: pageData.approachDesc1En || pageData.approach?.desc1?.en || '',
              ar: pageData.approachDesc1Ar || pageData.approach?.desc1?.ar || '',
            },
            desc2: {
              en: pageData.approachDesc2En || pageData.approach?.desc2?.en || '',
              ar: pageData.approachDesc2Ar || pageData.approach?.desc2?.ar || '',
            },
            badgeLabel: {
              en: pageData.approachBadgeLabelEn || pageData.approach?.badgeLabel?.en || 'Team Persici',
              ar: pageData.approachBadgeLabelAr || pageData.approach?.badgeLabel?.ar || 'فريق بيرسيشي',
            },
            badgeTitle: {
              en: pageData.approachBadgeTitleEn || pageData.approach?.badgeTitle?.en || 'Your team of specialists',
              ar: pageData.approachBadgeTitleAr || pageData.approach?.badgeTitle?.ar || 'فريقك من المتخصصين',
            },
            teamImage: pageData.approachTeamImage || pageData.approach?.teamImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
            ctaPrimaryText: {
              en: pageData.approachCtaPrimaryEn || pageData.approach?.ctaPrimaryText?.en || 'Book call',
              ar: pageData.approachCtaPrimaryAr || pageData.approach?.ctaPrimaryText?.ar || 'احجز مكالمة',
            },
            ctaPrimaryHref: pageData.approachCtaPrimaryHref || pageData.approach?.ctaPrimaryHref || '/contact',
            ctaSecondaryText: {
              en: pageData.approachCtaSecondaryEn || pageData.approach?.ctaSecondaryText?.en || 'More about us',
              ar: pageData.approachCtaSecondaryAr || pageData.approach?.ctaSecondaryText?.ar || 'المزيد عنا',
            },
            ctaSecondaryHref: pageData.approachCtaSecondaryHref || pageData.approach?.ctaSecondaryHref || '/about',
            teamMembers: pageData.approachTeamMembers || pageData.approach?.teamMembers || [],
          },
          reviews: {
            ...pageData.reviews,
            score: pageData.reviewsScore || pageData.reviews?.score || '5.0',
            scoreLabel: {
              en: pageData.reviewsScoreLabelEn || pageData.reviews?.scoreLabel?.en || '5.0 Rating from 100+ Enterprise Partners',
              ar: pageData.reviewsScoreLabelAr || pageData.reviews?.scoreLabel?.ar || 'تقييم 5.0 من أكثر من 100 شريك استراتيجي',
            },
            title: {
              en: pageData.reviewsTitleEn || pageData.reviews?.title?.en || 'Words from those we scale',
              ar: pageData.reviewsTitleAr || pageData.reviews?.title?.ar || 'كلمات من أولئك الذين نساعدهم على التوسع',
            },
            bannerText: {
              en: pageData.reviewsBannerTextEn || pageData.reviews?.bannerText?.en || '',
              ar: pageData.reviewsBannerTextAr || pageData.reviews?.bannerText?.ar || '',
            },
            bannerCtaText: {
              en: pageData.reviewsBannerCtaEn || pageData.reviews?.bannerCtaText?.en || 'Book a discovery call',
              ar: pageData.reviewsBannerCtaAr || pageData.reviews?.bannerCtaText?.ar || 'احجز مكالمة استكشافية',
            },
            bannerCtaHref: pageData.reviewsBannerCtaHref || pageData.reviews?.bannerCtaHref || '/contact',
            reviews: (pageData.reviewsList || pageData.reviews?.reviews || []).map((rev: any) => {
              const nameEn = (rev.nameEn || (typeof rev.name === 'object' ? rev.name?.en : rev.name) || '').trim();
              const nameAr = (rev.nameAr || (typeof rev.name === 'object' ? rev.name?.ar : '') || nameEn).trim();
              const roleEn = (rev.roleEn || (typeof rev.role === 'object' ? rev.role?.en : rev.role) || '').trim();
              const roleAr = (rev.roleAr || (typeof rev.role === 'object' ? rev.role?.ar : '') || roleEn).trim();
              const companyEn = (rev.companyEn || (typeof rev.company === 'object' ? rev.company?.en : rev.company) || '').trim();
              const companyAr = (rev.companyAr || (typeof rev.company === 'object' ? rev.company?.ar : '') || companyEn).trim();
              const reviewEn = (rev.reviewEn || (typeof rev.review === 'object' ? rev.review?.en : rev.review) || '').trim();
              const reviewAr = (rev.reviewAr || (typeof rev.review === 'object' ? rev.review?.ar : '') || reviewEn).trim();
              const verifiedEn = (rev.verifiedEn || (typeof rev.verified === 'object' ? rev.verified?.en : rev.verified) || 'Verified Client').trim();
              const verifiedAr = (rev.verifiedAr || (typeof rev.verified === 'object' ? rev.verified?.ar : '') || 'عميل موثق').trim();

              return {
                ...rev,
                name: nameEn || nameAr,
                nameEn,
                nameAr,
                role: roleEn || roleAr,
                roleEn,
                roleAr,
                company: companyEn || companyAr,
                companyEn,
                companyAr,
                review: reviewEn || reviewAr,
                reviewEn,
                reviewAr,
                verified: verifiedEn || verifiedAr,
                verifiedEn,
                verifiedAr,
                rating: typeof rev.rating === 'number' ? rev.rating : (parseFloat(rev.rating) || 5),
              };
            }),
          },
          homeContact: {
            ...pageData.homeContact,
            leftTitle: {
              en: pageData.homeContactLeftTitleEn || pageData.homeContact?.leftTitle?.en || 'Ready to accelerate your digital future?',
              ar: pageData.homeContactLeftTitleAr || pageData.homeContact?.leftTitle?.ar || 'جاهز لتسريع مستقبلك الرقمي؟',
            },
            points: pageData.homeContactPoints || pageData.homeContact?.points || [],
            trustedBy: {
              en: pageData.homeContactTrustedByEn || pageData.homeContact?.trustedBy?.en || 'Trusted by visionary leaders and high-growth enterprises.',
              ar: pageData.homeContactTrustedByAr || pageData.homeContact?.trustedBy?.ar || 'موثوق بنا من قِبل قادة التحول والمؤسسات الرائدة في المنطقة.',
            },
            title: {
              en: pageData.homeContactTitleEn || pageData.homeContact?.title?.en || 'Get in touch',
              ar: pageData.homeContactTitleAr || pageData.homeContact?.title?.ar || 'تواصل معنا',
            },
            subtitle: {
              en: pageData.homeContactSubtitleEn || pageData.homeContact?.subtitle?.en || 'Submit the form below and our digital transformation experts will reach out.',
              ar: pageData.homeContactSubtitleAr || pageData.homeContact?.subtitle?.ar || 'أرسل بياناتك وسيتواصل معك أحد خبرائنا في التحول الرقمي والتكنولوجيا.',
            },
            bgImage: pageData.homeContactBgImage || pageData.homeContact?.bgImage || '',
          },
          heroAvatars: pageData.heroAvatars || pageData.hero?.heroAvatars || [],
          growthServicesAvatars: pageData.growthServicesAvatars || pageData.growthServices?.avatars || [],
          approachTeamMembers: pageData.approachTeamMembers || pageData.approach?.teamMembers || [],
        };
      } else if (slug === 'about') {
        payloadToSave = {
          ...aboutPageData,
          ...pageData,
          page: 'about',
          hero: { ...aboutPageData.hero, ...(pageData.hero || {}) },
          purpose: { ...aboutPageData.purpose, ...(pageData.purpose || {}) },
          heritage: { ...aboutPageData.heritage, ...(pageData.heritage || {}) },
          partnership: { ...aboutPageData.partnership, ...(pageData.partnership || {}) },
          milestones: { ...aboutPageData.milestones, ...(pageData.milestones || {}) },
          quote: { ...aboutPageData.quote, ...(pageData.quote || {}) },
          culture: { ...aboutPageData.culture, ...(pageData.culture || {}) },
          pillars: { ...aboutPageData.pillars, ...(pageData.pillars || {}) },
          values: { ...aboutPageData.values, ...(pageData.values || {}) },
        };
      } else if (slug === 'contact') {
        payloadToSave = {
          ...contactPageData,
          ...pageData,
          page: 'contact',
          hero: {
            ...contactPageData.hero,
            ...(pageData.hero || {}),
            badge: { ...contactPageData.hero.badge, ...(pageData.hero?.badge || {}) },
            title: { ...contactPageData.hero.title, ...(pageData.hero?.title || {}) },
            subtitle: { ...contactPageData.hero.subtitle, ...(pageData.hero?.subtitle || {}) },
            quickLinks:
              Array.isArray(pageData.hero?.quickLinks) && pageData.hero.quickLinks.length > 0
                ? pageData.hero.quickLinks
                : contactPageData.hero.quickLinks,
          },
          officesBadge: {
            ...(contactPageData.officesBadge || { en: 'Global Presence', ar: 'حضور استراتيجي عالمي' }),
            ...(pageData.officesBadge || {}),
          },
          officesTitle: {
            ...contactPageData.officesTitle,
            ...(pageData.officesTitle || {}),
          },
          officesSubtitle: {
            ...contactPageData.officesSubtitle,
            ...(pageData.officesSubtitle || {}),
          },
          offices:
            Array.isArray(pageData.offices) && pageData.offices.length > 0
              ? pageData.offices
              : contactPageData.offices,
          channelsBadge: {
            ...(contactPageData.channelsBadge || { en: 'Direct Inquiries', ar: 'قنوات تواصل سريعة ومباشرة' }),
            ...(pageData.channelsBadge || {}),
          },
          channelsTitle: {
            ...contactPageData.channelsTitle,
            ...(pageData.channelsTitle || {}),
          },
          channelsSubtitle: {
            ...contactPageData.channelsSubtitle,
            ...(pageData.channelsSubtitle || {}),
          },
          channels:
            Array.isArray(pageData.channels) && pageData.channels.length > 0
              ? pageData.channels
              : contactPageData.channels,
          faqsTitle: {
            ...contactPageData.faqsTitle,
            ...(pageData.faqsTitle || {}),
          },
          faqsSubtitle: {
            ...contactPageData.faqsSubtitle,
            ...(pageData.faqsSubtitle || {}),
          },
          faqs:
            Array.isArray(pageData.faqs) && pageData.faqs.length > 0
              ? pageData.faqs
              : contactPageData.faqs,
        };
      } else if (slug === 'client-stories') {
        payloadToSave = {
          ...clientStoriesHubPageData,
          ...pageData,
          page: 'client-stories',
          hero: {
            ...clientStoriesHubPageData.hero,
            ...(pageData.hero || {}),
          },
          featuredSection: {
            ...clientStoriesHubPageData.featuredSection,
            ...(pageData.featuredSection || {}),
          },
          allStoriesSection: {
            ...clientStoriesHubPageData.allStoriesSection,
            ...(pageData.allStoriesSection || {}),
            categories:
              Array.isArray(pageData.allStoriesSection?.categories) &&
              pageData.allStoriesSection.categories.length > 0
                ? pageData.allStoriesSection.categories
                : clientStoriesHubPageData.allStoriesSection.categories,
          },
        };
      } else if (slug === 'careers') {
        payloadToSave = {
          ...careersHubData,
          ...pageData,
          page: 'careers',
          hero: {
            ...careersHubData.hero,
            ...(pageData.hero || {}),
          },
          culture: {
            ...careersHubData.culture,
            ...(pageData.culture || {}),
          },
          perks: {
            ...careersHubData.perks,
            ...(pageData.perks || {}),
          },
          process: {
            ...careersHubData.process,
            ...(pageData.process || {}),
          },
          openPositions: {
            ...careersHubData.openPositions,
            ...(pageData.openPositions || {}),
          },
          spontaneous: {
            ...careersHubData.spontaneous,
            ...(pageData.spontaneous || {}),
          },
          faqs: {
            ...careersHubData.faqs,
            ...(pageData.faqs || {}),
          },
        };
      } else if (slug === 'insights') {
        payloadToSave = {
          ...insightsHubPageData,
          ...pageData,
          page: 'insights',
          hero: {
            ...insightsHubPageData.hero,
            ...(pageData.hero || {}),
          },
          exploreSection: {
            ...insightsHubPageData.exploreSection,
            ...(pageData.exploreSection || {}),
            categories:
              Array.isArray(pageData.exploreSection?.categories) &&
              pageData.exploreSection.categories.length > 0
                ? pageData.exploreSection.categories
                : insightsHubPageData.exploreSection.categories,
          },
          newsletterSection: {
            ...insightsHubPageData.newsletterSection,
            ...(pageData.newsletterSection || {}),
          },
          contactSection: {
            ...insightsHubPageData.contactSection,
            ...(pageData.contactSection || {}),
          },
        };
      } else if (slug === 'solutions') {
        payloadToSave = {
          ...normalizeSolutionsHubPageData(pageData),
          page: 'solutions',
        };
      } else if (isSolutionPageSlug(slug)) {
        payloadToSave = {
          ...normalizeSolutionFeaturePageData(slug, pageData),
          page: slug,
        };
      } else if (slug === 'industries') {
        payloadToSave = {
          ...normalizeIndustriesHubPageData(pageData),
          page: 'industries',
        };
      } else if (isIndustryPageSlug(slug)) {
        const canonicalSlug = `industries-${extractIndustryFeatureSlug(slug) || slug.replace(/^industries-/, '')}`;
        payloadToSave = {
          ...normalizeIndustryFeaturePageData(slug, pageData),
          page: canonicalSlug,
        };
      } else if (slug === 'how-we-do-it') {
        payloadToSave = {
          ...normalizeHowWeDoItHubPageData(pageData),
          page: 'how-we-do-it',
        };
      } else if (isHowWeDoItPageSlug(slug)) {
        const canonicalFeatureSlug = extractHowWeDoItFeatureSlug(slug) || slug.replace(/^how-we-do-it-/, '');
        payloadToSave = {
          ...normalizeHowWeDoItFeaturePageData(slug, pageData),
          page: `how-we-do-it-${canonicalFeatureSlug}`,
        };
      }

      // Ensure _id and id are stripped before payload is sent
      delete payloadToSave._id;
      delete payloadToSave.id;

      const res = await fetch(`/api/content/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSave),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || data.message || 'Failed to save page.');
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed.';
      setErrorMessage(msg);
      throw err;
    } finally {
      setSavingAll(false);
    }
  };

  const moveItem = <T,>(list: T[], index: number, direction: 'up' | 'down'): T[] => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return list;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    return copy;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-persici-crimson rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium">Loading sections for &ldquo;{slug}&rdquo;...</p>
      </div>
    );
  }

  // Determine target live page link
  const livePageHref =
    slug === 'home'
      ? `/${lang}`
      : isSolutionPageSlug(slug)
      ? `/${lang}/solutions/${slug.replace(/^solutions-/, '')}`
      : isIndustryPageSlug(slug) && slug !== 'industries'
      ? `/${lang}/industries/${extractIndustryFeatureSlug(slug) || slug.replace(/^industries-/, '')}`
      : isHowWeDoItPageSlug(slug) && slug !== 'how-we-do-it'
      ? `/${lang}/how-we-do-it/${extractHowWeDoItFeatureSlug(slug) || slug.replace(/^how-we-do-it-/, '')}`
      : `/${lang}/${slug}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Header & Save All Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-persici-crimson font-mono">
              CMS Visual Section Editor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 capitalize mt-1">
            Editing: {slug.replace(/-/g, ' ')} Page
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage bilingual copy, Cloudflare R2 images & videos, metrics, and interactive sections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={livePageHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-xs"
          >
            <span>View Live Page</span>
            <TbExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={savePage}
            disabled={savingAll}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              saveSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-persici-crimson hover:bg-red-600 text-white shadow-persici-crimson/25 disabled:opacity-50'
            }`}
          >
            <TbDeviceFloppy className="w-4 h-4" />
            <span>
              {savingAll ? 'Publishing Changes...' : saveSuccess ? 'Published to Live Site!' : 'Save & Publish Page'}
            </span>
          </button>
        </div>
      </div>

      {/* Notification Banners */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <TbCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Success! All changes have been written to MongoDB Atlas and pre-rendered caches were revalidated.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <TbAlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. HOME PAGE SECTIONS BUILDER                                      */}
      {/* =================================================================== */}
      {slug === 'home' && (
        <div className="space-y-4">
          {/* ================================================================= */}
          {/* Section 1: Hero & Partner Marquee                                */}
          {/* ================================================================= */}
          <SectionAccordion
            number={1}
            title="1. Hero Section & Billboard Marquee"
            description="Main title, strategic pitch, primary call-to-action button, social proof avatars, and client logos marquee"
            isOpenDefault={true}
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Hero Title (English)
                </label>
                <input
                  type="text"
                  value={pageData.heroTitle || pageData.hero?.title?.en || ''}
                  onChange={(e) => setPageData({ ...pageData, heroTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان الواجهة الرئيسية (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.heroTitleAr || pageData.hero?.title?.ar || ''}
                  onChange={(e) => setPageData({ ...pageData, heroTitleAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
            </div>

            <RichTextEditor
              label="Hero Subtitle & Strategic Overview"
              valueEn={pageData.heroDescriptionEn || pageData.heroDescription || pageData.hero?.subtitle?.en || ''}
              valueAr={pageData.heroDescriptionAr || pageData.hero?.subtitle?.ar || ''}
              onChangeEn={(val) => setPageData({ ...pageData, heroDescriptionEn: val, heroDescription: val })}
              onChangeAr={(val) => setPageData({ ...pageData, heroDescriptionAr: val })}
              helperText="Rich-text strategic overview rendered directly below the hero headline"
            />

            <CtaEditor
              title="Primary Action Button"
              cta={{
                enabled: pageData.heroCtaEnabled !== false,
                labelEn: pageData.heroCtaLabelEn || pageData.hero?.ctaText?.en || pageData.hero?.cta?.en || 'Schedule Discovery Call',
                labelAr: pageData.heroCtaLabelAr || pageData.hero?.ctaText?.ar || pageData.hero?.cta?.ar || 'احجز جلسة استشارية',
                href: pageData.heroCtaHref || pageData.hero?.ctaHref || '/contact',
                icon: pageData.heroCtaIcon || 'arrow-right',
                animation: pageData.heroCtaAnimation || 'glow',
              }}
              onChange={(updated) =>
                setPageData({
                  ...pageData,
                  heroCtaEnabled: updated.enabled,
                  heroCtaLabelEn: updated.labelEn,
                  heroCtaLabelAr: updated.labelAr,
                  heroCtaHref: updated.href,
                  heroCtaIcon: updated.icon,
                  heroCtaAnimation: updated.animation,
                })
              }
            />

            <SocialProofEditor
              data={{
                stars: pageData.heroStars ?? 5,
                scoreTextEn: pageData.heroScoreTextEn || pageData.hero?.ratingLabel?.en || '5.0 Rating from 100+ Enterprise Partners',
                scoreTextAr: pageData.heroScoreTextAr || pageData.hero?.ratingLabel?.ar || 'تقييم 5.0 من أكثر من 100 شريك استراتيجي',
                avatars: pageData.heroAvatars || pageData.hero?.heroAvatars || [
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                ],
              }}
              onOpenMediaPicker={(cb) => openMediaPicker(cb, 'image')}
              onChange={(updated) =>
                setPageData({
                  ...pageData,
                  heroStars: updated.stars,
                  heroScoreTextEn: updated.scoreTextEn,
                  heroScoreTextAr: updated.scoreTextAr,
                  heroAvatars: updated.avatars,
                })
              }
            />

            {/* Marquee Partner Logos */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Marquee Header (English)
                  </label>
                  <input
                    type="text"
                    value={pageData.partnersTitleEn || pageData.hero?.trustedByTitle?.en || 'Trusted by Global Industry Pioneers'}
                    onChange={(e) => setPageData({ ...pageData, partnersTitleEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    عنوان شريط الشركاء (العربية)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.partnersTitleAr || pageData.hero?.trustedByTitle?.ar || 'موثوق من رواد وقادة القطاعات العالمية'}
                    onChange={(e) => setPageData({ ...pageData, partnersTitleAr: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Client Logos List ({(pageData.clientLogos || []).length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      openMediaPicker((url) => {
                        const name = prompt('Company / Brand Name:', 'New Partner') || 'Partner';
                        const existing = pageData.clientLogos || [];
                        setPageData({
                          ...pageData,
                          clientLogos: [...existing, { name, src: url }],
                        });
                      }, 'image');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    <TbPlus className="w-3.5 h-3.5" />
                    <span>Add Partner Logo</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                  {(pageData.clientLogos || [
                    { name: 'Accor', src: 'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/clients/all-accor-live-limitless-logo.webp?v=2' },
                    { name: 'Mashreq', src: 'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/clients/mashreq-logo.webp?v=3' },
                    { name: 'Land of Exotics', src: 'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/clients/land-of-exotics-logo.webp?v=2' },
                    { name: 'Meraas', src: 'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/clients/meraas-logo.webp?v=2' },
                    { name: '7awi', src: 'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/clients/7awi-logo.webp?v=2' },
                  ]).map((logo: any, idx: number) => (
                    <div key={idx} className="relative group border border-slate-200 rounded-lg p-2.5 bg-white flex flex-col items-center justify-center text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logo.src} alt={logo.name} className="h-9 object-contain mb-1.5" />
                      <span className="text-[10px] font-semibold text-slate-700 truncate w-full">{logo.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(pageData.clientLogos || [])];
                          updated.splice(idx, 1);
                          setPageData({ ...pageData, clientLogos: updated });
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TbTrash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionAccordion>

          {/* ================================================================= */}
          {/* Section 2: Partner Showcase & Video Reel                         */}
          {/* ================================================================= */}
          <SectionAccordion
            number={2}
            title="2. Featured Partner Showcase & Video Reel"
            description="Director video interview reel, video cover poster, key transformation quote, and multi-opinion testimonial card"
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Showcase Title (English)
                </label>
                <input
                  type="text"
                  value={pageData.partnerShowcaseTitleEn || pageData.partnerShowcase?.title?.en || ''}
                  onChange={(e) => setPageData({ ...pageData, partnerShowcaseTitleEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم الشركاء (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.partnerShowcaseTitleAr || pageData.partnerShowcase?.title?.ar || ''}
                  onChange={(e) => setPageData({ ...pageData, partnerShowcaseTitleAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Video Reel Left Card Settings */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Featured Video Reel & Speaker Meta
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Speaker Name (EN)</label>
                  <input
                    type="text"
                    value={pageData.partnerShowcaseSpeakerEn || pageData.partnerShowcase?.videoSpeaker?.en || ''}
                    onChange={(e) => setPageData({ ...pageData, partnerShowcaseSpeakerEn: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">اسم المتحدث (AR)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.partnerShowcaseSpeakerAr || pageData.partnerShowcase?.videoSpeaker?.ar || ''}
                    onChange={(e) => setPageData({ ...pageData, partnerShowcaseSpeakerAr: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Speaker Role (EN)</label>
                  <input
                    type="text"
                    value={pageData.partnerShowcaseRoleEn || pageData.partnerShowcase?.videoRole?.en || ''}
                    onChange={(e) => setPageData({ ...pageData, partnerShowcaseRoleEn: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">صفة المتحدث (AR)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.partnerShowcaseRoleAr || pageData.partnerShowcase?.videoRole?.ar || ''}
                    onChange={(e) => setPageData({ ...pageData, partnerShowcaseRoleAr: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Video and Cover URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Video Cover Poster (R2)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pageData.partnerShowcaseCover || pageData.partnerShowcase?.videoCoverImage || ''}
                      onChange={(e) => setPageData({ ...pageData, partnerShowcaseCover: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono text-[11px] bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => setPageData({ ...pageData, partnerShowcaseCover: url }), 'image')}
                      className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1"
                    >
                      <TbPhoto className="w-3.5 h-3.5" />
                      <span>Pick Poster</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Video Reel File (MP4/WebM)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pageData.partnerShowcaseVideoUrl || pageData.partnerShowcase?.videoUrl || ''}
                      onChange={(e) => setPageData({ ...pageData, partnerShowcaseVideoUrl: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono text-[11px] bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => setPageData({ ...pageData, partnerShowcaseVideoUrl: url }), 'video')}
                      className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 border border-amber-300"
                    >
                      <TbVideo className="w-3.5 h-3.5" />
                      <span>Pick Video</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quote in Lightbox & Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Highlight Quote (EN)</label>
                  <textarea
                    rows={2}
                    value={pageData.partnerShowcaseQuoteEn || pageData.partnerShowcase?.quote?.en || ''}
                    onChange={(e) => setPageData({ ...pageData, partnerShowcaseQuoteEn: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">الاقتباس البارز (AR)</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={pageData.partnerShowcaseQuoteAr || pageData.partnerShowcase?.quote?.ar || ''}
                    onChange={(e) => setPageData({ ...pageData, partnerShowcaseQuoteAr: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Right Card: Dark Testimonials Carousel Opinions */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Client Opinion Slides ({(pageData.partnerShowcaseTestimonials || []).length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const existing = pageData.partnerShowcaseTestimonials || [];
                    setPageData({
                      ...pageData,
                      partnerShowcaseTestimonials: [
                        ...existing,
                        {
                          author: 'Partner Executive',
                          role: 'Digital Director',
                          company: 'Enterprise Client',
                          metric: '+120% Revenue',
                          quote: 'Outstanding strategic engineering that transformed our operations.',
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                          rating: 5.0,
                        },
                      ],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Opinion Slide</span>
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {(pageData.partnerShowcaseTestimonials || [
                  {
                    author: 'Marcus Lindqvist',
                    role: 'Founder & Managing Director',
                    company: 'Nordic Retail Group',
                    metric: '3.4x Revenue',
                    quote: 'Partnering with Persici accelerated our entire digital roadmap. Their engineering rigour and scalable infrastructure drove a 3.4x growth leap.',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                    rating: 5.0,
                  },
                ]).map((t: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3 relative group">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(pageData.partnerShowcaseTestimonials || [])];
                        updated.splice(idx, 1);
                        setPageData({ ...pageData, partnerShowcaseTestimonials: updated });
                      }}
                      className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Remove opinion slide"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>

                    {/* Client Photo & Rating Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-8">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Client Photo / Avatar (R2)
                        </label>
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt={t.author || 'Avatar'}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="Avatar URL"
                            value={t.avatar || ''}
                            onChange={(e) => {
                              const updated = [...(pageData.partnerShowcaseTestimonials || [])];
                              updated[idx] = { ...t, avatar: e.target.value };
                              setPageData({ ...pageData, partnerShowcaseTestimonials: updated });
                            }}
                            className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg font-mono text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              openMediaPicker((url) => {
                                const updated = [...(pageData.partnerShowcaseTestimonials || [])];
                                updated[idx] = { ...t, avatar: url };
                                setPageData({ ...pageData, partnerShowcaseTestimonials: updated });
                              }, 'image')
                            }
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 border border-slate-200"
                          >
                            <TbPhoto className="w-3.5 h-3.5" />
                            <span>Pick</span>
                          </button>
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Rating Score (1.0 - 5.0)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1.0"
                            max="5.0"
                            step="0.1"
                            value={t.rating ?? 5.0}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              const updated = [...(pageData.partnerShowcaseTestimonials || [])];
                              updated[idx] = { ...t, rating: isNaN(val) ? 5.0 : val };
                              setPageData({ ...pageData, partnerShowcaseTestimonials: updated });
                            }}
                            className="w-24 px-2.5 py-1 text-xs border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
                          />
                          <div className="flex text-xs text-amber-500 font-bold">
                            {'★'.repeat(Math.round(t.rating ?? 5))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Author"
                        value={t.author || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.partnerShowcaseTestimonials || [])];
                          updated[idx] = { ...t, author: e.target.value };
                          setPageData({ ...pageData, partnerShowcaseTestimonials: updated });
                        }}
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        value={t.role || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.partnerShowcaseTestimonials || [])];
                          updated[idx] = { ...t, role: e.target.value };
                          setPageData({ ...pageData, partnerShowcaseTestimonials: updated });
                        }}
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Company & Metric (e.g. Nordic Retail | +340%)"
                        value={`${t.company || ''}${t.metric ? ` | ${t.metric}` : ''}`}
                        onChange={(e) => {
                          const [comp, metric] = e.target.value.split('|');
                          const updated = [...(pageData.partnerShowcaseTestimonials || [])];
                          updated[idx] = { ...t, company: comp?.trim() || '', metric: metric?.trim() || '' };
                          setPageData({ ...pageData, partnerShowcaseTestimonials: updated });
                        }}
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Quote"
                      value={t.quote || ''}
                      onChange={(e) => {
                        const updated = [...(pageData.partnerShowcaseTestimonials || [])];
                        updated[idx] = { ...t, quote: e.target.value };
                        setPageData({ ...pageData, partnerShowcaseTestimonials: updated });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </SectionAccordion>

          {/* ================================================================= */}
          {/* Section 3: Heritage & Agency Story                               */}
          {/* ================================================================= */}
          <SectionAccordion
            number={3}
            title="3. Heritage & Agency Story Narrative"
            description="Editorial narrative, primary and secondary CTAs, and 3-photo collage grid (Dubai HQ, Riyadh, Amman)"
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Heritage Headline (English)
                </label>
                <input
                  type="text"
                  value={pageData.heritageTitleEn || pageData.heritage?.title?.en || ''}
                  onChange={(e) => setPageData({ ...pageData, heritageTitleEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان القصة المؤسسية (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.heritageTitleAr || pageData.heritage?.title?.ar || ''}
                  onChange={(e) => setPageData({ ...pageData, heritageTitleAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <RichTextEditor
              label="Agency Narrative Paragraph 1"
              valueEn={pageData.heritageDescEn || pageData.heritage?.desc1?.en || ''}
              valueAr={pageData.heritageDescAr || pageData.heritage?.desc1?.ar || ''}
              onChangeEn={(val) => setPageData({ ...pageData, heritageDescEn: val })}
              onChangeAr={(val) => setPageData({ ...pageData, heritageDescAr: val })}
              helperText="First paragraph describing technological excellence and engineering capabilities"
            />

            <RichTextEditor
              label="Agency Narrative Paragraph 2"
              valueEn={pageData.heritageDesc2En || pageData.heritage?.desc2?.en || ''}
              valueAr={pageData.heritageDesc2Ar || pageData.heritage?.desc2?.ar || ''}
              onChangeEn={(val) => setPageData({ ...pageData, heritageDesc2En: val })}
              onChangeAr={(val) => setPageData({ ...pageData, heritageDesc2Ar: val })}
              helperText="Second paragraph covering full-spectrum digitalization and client success"
            />

            {/* CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary CTA Button</label>
                <input
                  type="text"
                  placeholder="Label EN"
                  value={pageData.heritageCtaPrimaryEn || pageData.heritage?.ctaPrimaryText?.en || ''}
                  onChange={(e) => setPageData({ ...pageData, heritageCtaPrimaryEn: e.target.value })}
                  className="w-full mb-2 px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Target URL (e.g. /contact)"
                  value={pageData.heritageCtaPrimaryHref || pageData.heritage?.ctaPrimaryHref || '/contact'}
                  onChange={(e) => setPageData({ ...pageData, heritageCtaPrimaryHref: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Secondary CTA Button</label>
                <input
                  type="text"
                  placeholder="Label EN"
                  value={pageData.heritageCtaSecondaryEn || pageData.heritage?.ctaSecondaryText?.en || ''}
                  onChange={(e) => setPageData({ ...pageData, heritageCtaSecondaryEn: e.target.value })}
                  className="w-full mb-2 px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Target URL (e.g. /about)"
                  value={pageData.heritageCtaSecondaryHref || pageData.heritage?.ctaSecondaryHref || '/about'}
                  onChange={(e) => setPageData({ ...pageData, heritageCtaSecondaryHref: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Collage Photos */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Heritage 3-Photo Collage Images (Dubai, Riyadh, Amman)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[0, 1, 2].map((idx) => {
                  const collage = pageData.heritageCollage || [
                    { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', alt: 'Dubai HQ' },
                    { src: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80', alt: 'Riyadh Hub' },
                    { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80', alt: 'Amman Lab' },
                  ];
                  const item = collage[idx] || { src: '', alt: `Photo ${idx + 1}` };
                  return (
                    <div key={idx} className="space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <label className="block text-[11px] font-semibold text-slate-600">Photo #{idx + 1} ({idx === 0 ? 'Top Wide' : idx === 1 ? 'Bottom Left' : 'Bottom Right'})</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.src}
                          onChange={(e) => {
                            const updated = [...collage];
                            updated[idx] = { ...item, src: e.target.value };
                            setPageData({ ...pageData, heritageCollage: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            openMediaPicker((url) => {
                              const updated = [...collage];
                              updated[idx] = { ...item, src: url };
                              setPageData({ ...pageData, heritageCollage: updated });
                            }, 'image');
                          }}
                          className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold shrink-0"
                        >
                          Pick R2
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionAccordion>

          {/* ================================================================= */}
          {/* Section 4: Our Growth Services                                   */}
          {/* ================================================================= */}
          <SectionAccordion
            number={4}
            title="4. Our Growth Services Section"
            description="Section title, rating text, bottom conversion banner, and service offerings"
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Section Title (English)
                </label>
                <input
                  type="text"
                  value={pageData.growthServicesTitleEn || pageData.growthServices?.title?.en || 'Our Growth Services'}
                  onChange={(e) => setPageData({ ...pageData, growthServicesTitleEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم الخدمات (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.growthServicesTitleAr || pageData.growthServices?.title?.ar || 'خدمات النمو لدينا'}
                  onChange={(e) => setPageData({ ...pageData, growthServicesTitleAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Rating Label (English)
                </label>
                <input
                  type="text"
                  value={pageData.growthServicesRatingEn || pageData.growthServices?.ratingText?.en || 'Rated 4.9/5 on 50+ client reviews'}
                  onChange={(e) => setPageData({ ...pageData, growthServicesRatingEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  نص التقييم (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.growthServicesRatingAr || pageData.growthServices?.ratingText?.ar || 'تقييم 4.9/5 بناءً على أكثر من 50 تقييماً'}
                  onChange={(e) => setPageData({ ...pageData, growthServicesRatingAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Growth Services Trust Avatars Stack Manager */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Header Client Trust Avatars ({(pageData.growthServicesAvatars || []).length})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Client face avatars displayed next to the rating label in the Growth Services section header.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((url) => {
                        setPageData((prev) => ({
                          ...prev,
                          growthServicesAvatars: [...(prev.growthServicesAvatars || []), url],
                        }));
                      }, 'image')
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-persici-crimson hover:bg-red-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <TbPhoto className="w-3.5 h-3.5" />
                    <span>Add from Storage Library (R2)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Enter image URL for client avatar:');
                      if (url && url.trim()) {
                        setPageData((prev) => ({
                          ...prev,
                          growthServicesAvatars: [...(prev.growthServicesAvatars || []), url.trim()],
                        }));
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    <TbPlus className="w-3.5 h-3.5" />
                    <span>Add URL</span>
                  </button>
                </div>
              </div>

              {/* Avatar Preview & Reordering Grid */}
              <div className="flex flex-wrap gap-2.5 items-center pt-2">
                {(pageData.growthServicesAvatars || []).map((src: string, aIdx: number) => (
                  <div
                    key={aIdx}
                    className="group relative flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-all"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Avatar ${aIdx + 1}`}
                      className="w-9 h-9 rounded-full object-cover border border-white shadow-xs shrink-0"
                    />
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={aIdx === 0}
                        onClick={() => {
                          if (aIdx === 0) return;
                          setPageData((prev) => {
                            const list = [...(prev.growthServicesAvatars || [])];
                            const temp = list[aIdx - 1];
                            list[aIdx - 1] = list[aIdx];
                            list[aIdx] = temp;
                            return { ...prev, growthServicesAvatars: list };
                          });
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Move Up"
                      >
                        <TbArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={aIdx === (pageData.growthServicesAvatars || []).length - 1}
                        onClick={() => {
                          if (aIdx === (pageData.growthServicesAvatars || []).length - 1) return;
                          setPageData((prev) => {
                            const list = [...(prev.growthServicesAvatars || [])];
                            const temp = list[aIdx + 1];
                            list[aIdx + 1] = list[aIdx];
                            list[aIdx] = temp;
                            return { ...prev, growthServicesAvatars: list };
                          });
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Move Down"
                      >
                        <TbArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          openMediaPicker((url) => {
                            setPageData((prev) => {
                              const list = [...(prev.growthServicesAvatars || [])];
                              list[aIdx] = url;
                              return { ...prev, growthServicesAvatars: list };
                            });
                          }, 'image');
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700"
                        title="Replace Image with R2"
                      >
                        <TbPhoto className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPageData((prev) => {
                            const list = [...(prev.growthServicesAvatars || [])];
                            list.splice(aIdx, 1);
                            return { ...prev, growthServicesAvatars: list };
                          });
                        }}
                        className="p-1 text-slate-400 hover:text-red-600"
                        title="Remove Avatar"
                      >
                        <TbTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {(!pageData.growthServicesAvatars || pageData.growthServicesAvatars.length === 0) && (
                  <p className="text-xs text-slate-400 italic py-1">No custom avatars added. Fallback avatars are shown on the live site.</p>
                )}
              </div>
            </div>

            {/* Bottom Conversion Banner */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Bottom Conversion Banner Strip
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Banner Text (EN)"
                  value={pageData.servicesBannerEn || pageData.growthServices?.bannerText?.en || ''}
                  onChange={(e) => setPageData({ ...pageData, servicesBannerEn: e.target.value })}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  dir="rtl"
                  placeholder="نص الشريط (AR)"
                  value={pageData.servicesBannerAr || pageData.growthServices?.bannerText?.ar || ''}
                  onChange={(e) => setPageData({ ...pageData, servicesBannerAr: e.target.value })}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Primary CTA Text (e.g. Book call)"
                  value={pageData.servicesBannerCtaEn || pageData.growthServices?.bannerCtaText?.en || ''}
                  onChange={(e) => setPageData({ ...pageData, servicesBannerCtaEn: e.target.value })}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Primary CTA Href (e.g. /contact)"
                  value={pageData.servicesBannerCtaHref || pageData.growthServices?.bannerCtaHref || '/contact'}
                  onChange={(e) => setPageData({ ...pageData, servicesBannerCtaHref: e.target.value })}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Growth Services Cards List Manager */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Service Cards Catalog ({(pageData.growthServicesList || []).length})
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Configure titles, subtitles, descriptions, the 4 main tools/icons, reorder cards, and choose which card takes the full-width featured spot at the top.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const existing = pageData.growthServicesList || [];
                    const newCard = {
                      id: `service-${Date.now()}`,
                      enTitle: 'New Growth Service',
                      arTitle: 'خدمة نمو جديدة',
                      enSubService: 'Consulting • Engineering • AI',
                      arSubService: 'استشارات • هندسة • ذكاء اصطناعي',
                      enDescription: 'Detailed service description explaining the value proposition and commercial impact.',
                      arDescription: 'وصف تفصيلي للخدمة يوضح القيمة المضافة والأثر التجاري للمؤسسة.',
                      isFeatured: existing.length === 0,
                      width: existing.length === 0 ? 'full' : '1/2',
                      platforms: ['python', 'nextjs', 'react', 'openai-api'],
                      order: existing.length + 1,
                    };
                    setPageData({ ...pageData, growthServicesList: [...existing, newCard] });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Service Card</span>
                </button>
              </div>

              <div className="space-y-4 pt-1">
                {(pageData.growthServicesList || []).map((svc: any, idx: number) => {
                  const isFeatured = svc.isFeatured || svc.width === 'full';
                  const currentPlatforms = Array.isArray(svc.platforms)
                    ? svc.platforms.map((p: any) => (typeof p === 'string' ? p : p.platform || p.id || ''))
                    : [];

                  const POPULAR_TOOLS = [
                    'python', 'nextjs', 'react', 'flutter', 'angular', 'nodejs', 'php-laravel', 'wordpress',
                    'aws', 'docker', 'gcp', 'mongodb', 'shopify', 'woocommerce', 'hubspot', 'salesforce',
                    'canva', 'figma', 'adobe-creative-cloud', 'meta-ads-manager', 'google-ads', 'snapchat-ads', 'openai-api'
                  ];

                  return (
                    <div
                      key={svc.id || idx}
                      className={`p-4 rounded-xl border transition-all space-y-3 relative ${
                        isFeatured
                          ? 'border-persici-crimson/40 bg-persici-crimson/[0.02] shadow-sm'
                          : 'border-slate-200 bg-slate-50/50'
                      }`}
                    >
                      {/* Card Header with Status Badge, Reorder, and Delete */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-mono text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-xs text-slate-900">
                            {svc.enTitle || svc.title?.en || `Service Card #${idx + 1}`}
                          </span>
                          {isFeatured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-persici-crimson text-white">
                              Featured (Full Width Top)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Reorder Buttons */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              if (idx === 0) return;
                              const updated = [...(pageData.growthServicesList || [])];
                              const temp = updated[idx - 1];
                              updated[idx - 1] = updated[idx];
                              updated[idx] = temp;
                              setPageData({ ...pageData, growthServicesList: updated });
                            }}
                            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none"
                            title="Move Up"
                          >
                            <TbArrowUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={idx === (pageData.growthServicesList || []).length - 1}
                            onClick={() => {
                              if (idx === (pageData.growthServicesList || []).length - 1) return;
                              const updated = [...(pageData.growthServicesList || [])];
                              const temp = updated[idx + 1];
                              updated[idx + 1] = updated[idx];
                              updated[idx] = temp;
                              setPageData({ ...pageData, growthServicesList: updated });
                            }}
                            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none"
                            title="Move Down"
                          >
                            <TbArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Card */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(pageData.growthServicesList || [])];
                              updated.splice(idx, 1);
                              setPageData({ ...pageData, growthServicesList: updated });
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Service Card"
                          >
                            <TbTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Featured Selector Toggle */}
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                        <input
                          type="checkbox"
                          id={`featured-${idx}`}
                          checked={isFeatured}
                          onChange={(e) => {
                            const updated = (pageData.growthServicesList || []).map((s: any, sIdx: number) => {
                              if (sIdx === idx) {
                                return {
                                  ...s,
                                  isFeatured: e.target.checked,
                                  width: e.target.checked ? 'full' : '1/2',
                                };
                              }
                              // If turning this one ON, un-feature other cards so only one anchors the top
                              return e.target.checked
                                ? { ...s, isFeatured: false, width: '1/2' }
                                : s;
                            });
                            setPageData({ ...pageData, growthServicesList: updated });
                          }}
                          className="h-4 w-4 rounded accent-persici-crimson cursor-pointer"
                        />
                        <label htmlFor={`featured-${idx}`} className="text-xs font-semibold text-slate-800 cursor-pointer">
                          Featured Service (anchors at the top taking full section width)
                        </label>
                      </div>

                      {/* Bilingual Title */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Card Title (English)
                          </label>
                          <input
                            type="text"
                            value={svc.enTitle || svc.title?.en || (typeof svc.title === 'string' ? svc.title : '')}
                            onChange={(e) => {
                              const updated = [...(pageData.growthServicesList || [])];
                              updated[idx] = { ...svc, enTitle: e.target.value, title: { ...svc.title, en: e.target.value } };
                              setPageData({ ...pageData, growthServicesList: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            عنوان البطاقة (العربية)
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={svc.arTitle || svc.title?.ar || ''}
                            onChange={(e) => {
                              const updated = [...(pageData.growthServicesList || [])];
                              updated[idx] = { ...svc, arTitle: e.target.value, title: { ...svc.title, ar: e.target.value } };
                              setPageData({ ...pageData, growthServicesList: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      {/* Bilingual Subtitle / Tag */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Subtitle / Tag (English)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Software Development • UX Design • AI"
                            value={svc.enSubService || svc.tag?.en || (typeof svc.tag === 'string' ? svc.tag : '')}
                            onChange={(e) => {
                              const updated = [...(pageData.growthServicesList || [])];
                              updated[idx] = { ...svc, enSubService: e.target.value, tag: { ...svc.tag, en: e.target.value } };
                              setPageData({ ...pageData, growthServicesList: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            العنوان الفرعي / الوسم (العربية)
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            placeholder="مثال: تطوير البرمجيات • تصميم تجربة المستخدم • الذكاء الاصطناعي"
                            value={svc.arSubService || svc.tag?.ar || ''}
                            onChange={(e) => {
                              const updated = [...(pageData.growthServicesList || [])];
                              updated[idx] = { ...svc, arSubService: e.target.value, tag: { ...svc.tag, ar: e.target.value } };
                              setPageData({ ...pageData, growthServicesList: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      {/* Bilingual Description */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Card Description (English)
                          </label>
                          <textarea
                            rows={3}
                            value={svc.enDescription || svc.description?.en || (typeof svc.description === 'string' ? svc.description : '')}
                            onChange={(e) => {
                              const updated = [...(pageData.growthServicesList || [])];
                              updated[idx] = { ...svc, enDescription: e.target.value, description: { ...svc.description, en: e.target.value } };
                              setPageData({ ...pageData, growthServicesList: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            وصف البطاقة (العربية)
                          </label>
                          <textarea
                            rows={3}
                            dir="rtl"
                            value={svc.arDescription || svc.description?.ar || ''}
                            onChange={(e) => {
                              const updated = [...(pageData.growthServicesList || [])];
                              updated[idx] = { ...svc, arDescription: e.target.value, description: { ...svc.description, ar: e.target.value } };
                              setPageData({ ...pageData, growthServicesList: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      {/* 4 Main Tool Icons Selector */}
                      <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                            4 Main Tool Icons ({currentPlatforms.length} configured)
                          </label>
                          <span className="text-[10px] text-slate-500">
                            Click chips below to toggle tools on this card
                          </span>
                        </div>

                        {/* Selected Tools Display */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {currentPlatforms.map((tool: string, pIdx: number) => (
                            <span
                              key={pIdx}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-md text-[11px] font-semibold text-slate-800"
                            >
                              <span>{tool}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedTools = [...currentPlatforms];
                                  updatedTools.splice(pIdx, 1);
                                  const updated = [...(pageData.growthServicesList || [])];
                                  updated[idx] = { ...svc, platforms: updatedTools };
                                  setPageData({ ...pageData, growthServicesList: updated });
                                }}
                                className="text-slate-400 hover:text-red-600 text-xs"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Quick Tool Toggle Chips */}
                        <div className="pt-1.5 border-t border-slate-100">
                          <span className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">
                            Available Platform Tools (Click to toggle):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {POPULAR_TOOLS.map((tool) => {
                              const active = currentPlatforms.includes(tool);
                              return (
                                <button
                                  key={tool}
                                  type="button"
                                  onClick={() => {
                                    let updatedTools = [...currentPlatforms];
                                    if (active) {
                                      updatedTools = updatedTools.filter((t: string) => t !== tool);
                                    } else {
                                      updatedTools.push(tool);
                                    }
                                    const updated = [...(pageData.growthServicesList || [])];
                                    updated[idx] = { ...svc, platforms: updatedTools };
                                    setPageData({ ...pageData, growthServicesList: updated });
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                                    active
                                      ? 'bg-persici-crimson text-white shadow-xs'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {active ? `✓ ${tool}` : `+ ${tool}`}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Custom Tool Input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Add custom tool or platform (e.g. redis, tailwind)"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const val = (e.currentTarget.value || '').trim().toLowerCase();
                                if (val && !currentPlatforms.includes(val)) {
                                  const updated = [...(pageData.growthServicesList || [])];
                                  updated[idx] = { ...svc, platforms: [...currentPlatforms, val] };
                                  setPageData({ ...pageData, growthServicesList: updated });
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                            className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionAccordion>

          {/* ================================================================= */}
          {/* Section 5: Meet Clients We Scale (Video Carousel)                 */}
          {/* ================================================================= */}
          <SectionAccordion
            number={5}
            title="5. Meet Clients We Scale (Video Testimonials Carousel)"
            description="Video testimonial reels with poster images, quotes, and metrics (Videos & Posters strictly filtered)"
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Section Title (English)
                </label>
                <input
                  type="text"
                  value={pageData.videoSectionTitleEn || pageData.clientVideos?.title?.en || 'Meet clients we scale'}
                  onChange={(e) => setPageData({ ...pageData, videoSectionTitleEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم الفيديو (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.videoSectionTitleAr || pageData.clientVideos?.title?.ar || 'تعرف على العملاء الذين نساعدهم على التوسع'}
                  onChange={(e) => setPageData({ ...pageData, videoSectionTitleAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Video Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Video Testimonial Cards ({(pageData.videoTestimonials || []).length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const existing = pageData.videoTestimonials || [];
                    setPageData({
                      ...pageData,
                      videoTestimonials: [
                        ...existing,
                        {
                          name: 'New Client Partner',
                          role: 'Head of Growth',
                          company: 'Enterprise Brand',
                          quote: 'Working with Persici scaled our digital revenue exponentially in record time.',
                          category: 'Performance Media',
                          duration: '0:45',
                          posterUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=600&q=80',
                          videoUrl: 'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/general/client-showcase-sample.mp4',
                        },
                      ],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Video Card</span>
                </button>
              </div>

              {(pageData.videoTestimonials || [
                {
                  name: 'Sarah Jenkins',
                  role: 'VP of Digital Commerce',
                  company: 'Nordic Retail',
                  quote: 'Persici completely transformed our digital media infrastructure and scaled ROAS past 4.2x.',
                  category: 'Scale & CRO',
                  duration: '0:45',
                  videoUrl: 'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/general/client-showcase-sample.mp4',
                  posterUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=600&q=80',
                },
              ]).map((item: any, idx: number) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative group">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(pageData.videoTestimonials || [])];
                      updated.splice(idx, 1);
                      setPageData({ ...pageData, videoTestimonials: updated });
                    }}
                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                  >
                    <TbTrash className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={item.name || item.clientName || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.videoTestimonials || [])];
                          updated[idx] = { ...item, name: e.target.value, clientName: e.target.value };
                          setPageData({ ...pageData, videoTestimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Client Role</label>
                      <input
                        type="text"
                        value={item.role || item.clientRole || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.videoTestimonials || [])];
                          updated[idx] = { ...item, role: e.target.value, clientRole: e.target.value };
                          setPageData({ ...pageData, videoTestimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company</label>
                      <input
                        type="text"
                        value={item.company || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.videoTestimonials || [])];
                          updated[idx] = { ...item, company: e.target.value };
                          setPageData({ ...pageData, videoTestimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Client Quote</label>
                    <textarea
                      rows={2}
                      value={item.quote || ''}
                      onChange={(e) => {
                        const updated = [...(pageData.videoTestimonials || [])];
                        updated[idx] = { ...item, quote: e.target.value };
                        setPageData({ ...pageData, videoTestimonials: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Video Source URL (MP4 / WebM)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.videoUrl || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.videoTestimonials || [])];
                            updated[idx] = { ...item, videoUrl: e.target.value };
                            setPageData({ ...pageData, videoTestimonials: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            openMediaPicker((url) => {
                              const updated = [...(pageData.videoTestimonials || [])];
                              updated[idx] = { ...item, videoUrl: url };
                              setPageData({ ...pageData, videoTestimonials: updated });
                            }, 'video');
                          }}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 border border-amber-200"
                        >
                          <TbVideo className="w-3.5 h-3.5" />
                          <span>Pick Video</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Poster Thumbnail Image
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.posterUrl || item.image || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.videoTestimonials || [])];
                            updated[idx] = { ...item, posterUrl: e.target.value, image: e.target.value };
                            setPageData({ ...pageData, videoTestimonials: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            openMediaPicker((url) => {
                              const updated = [...(pageData.videoTestimonials || [])];
                              updated[idx] = { ...item, posterUrl: url, image: url };
                              setPageData({ ...pageData, videoTestimonials: updated });
                            }, 'image');
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1"
                        >
                          <TbPhoto className="w-3.5 h-3.5" />
                          <span>Pick Image</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionAccordion>

          {/* ================================================================= */}
          {/* Section 6: Our Approach to eCommerce Growth                       */}
          {/* ================================================================= */}
          <SectionAccordion
            number={6}
            title="6. Our Approach to eCommerce Growth & Engineering Squad"
            description="Team squad featured image, specialist avatar stack, badge label, approach copy, and primary/secondary CTAs"
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Section Headline (English)
                </label>
                <input
                  type="text"
                  value={pageData.approachTitleEn || pageData.approach?.title?.en || ''}
                  onChange={(e) => setPageData({ ...pageData, approachTitleEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان النهج المتبع (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.approachTitleAr || pageData.approach?.title?.ar || ''}
                  onChange={(e) => setPageData({ ...pageData, approachTitleAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <RichTextEditor
              label="Approach Methodology Paragraph 1"
              valueEn={pageData.approachDesc1En || pageData.approach?.desc1?.en || ''}
              valueAr={pageData.approachDesc1Ar || pageData.approach?.desc1?.ar || ''}
              onChangeEn={(val) => setPageData({ ...pageData, approachDesc1En: val })}
              onChangeAr={(val) => setPageData({ ...pageData, approachDesc1Ar: val })}
              helperText="First paragraph explaining the engineering squad, deep domain expertise, and measurable ROI"
            />

            <RichTextEditor
              label="Approach Methodology Paragraph 2"
              valueEn={pageData.approachDesc2En || pageData.approach?.desc2?.en || ''}
              valueAr={pageData.approachDesc2Ar || pageData.approach?.desc2?.ar || ''}
              onChangeEn={(val) => setPageData({ ...pageData, approachDesc2En: val })}
              onChangeAr={(val) => setPageData({ ...pageData, approachDesc2Ar: val })}
              helperText="Second paragraph explaining agile sprint execution, transparent governance, and direct communication"
            />

            {/* Team Image & Floating Badge Config */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Squad Featured Photo & Floating Card Badge
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Squad Featured Photo</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pageData.approachTeamImage || pageData.approach?.teamImage || ''}
                      onChange={(e) => setPageData({ ...pageData, approachTeamImage: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono text-[11px] bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => setPageData({ ...pageData, approachTeamImage: url }), 'image')}
                      className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1"
                    >
                      <TbPhoto className="w-3.5 h-3.5" />
                      <span>Pick Photo</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Badge Tag (EN)</label>
                      <input
                        type="text"
                        value={pageData.approachBadgeLabelEn || pageData.approach?.badgeLabel?.en || 'Team Persici'}
                        onChange={(e) => setPageData({ ...pageData, approachBadgeLabelEn: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">وسام الشارة (AR)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={pageData.approachBadgeLabelAr || pageData.approach?.badgeLabel?.ar || 'فريق بيرسيشي'}
                        onChange={(e) => setPageData({ ...pageData, approachBadgeLabelAr: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Badge Title (EN)</label>
                      <input
                        type="text"
                        value={pageData.approachBadgeTitleEn || pageData.approach?.badgeTitle?.en || 'Your team of specialists'}
                        onChange={(e) => setPageData({ ...pageData, approachBadgeTitleEn: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">عنوان الشارة (AR)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={pageData.approachBadgeTitleAr || pageData.approach?.badgeTitle?.ar || 'فريقك من المتخصصين'}
                        onChange={(e) => setPageData({ ...pageData, approachBadgeTitleAr: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Specialist Avatars Stack Manager */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Team Specialists Avatar Stack ({(pageData.approachTeamMembers || []).length})
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Add, remove, and reorder specialist avatars. On the public site, these are centered when few, and smoothly drag-to-scroll horizontally when overflowing.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        openMediaPicker((url) => {
                          const name = prompt('Specialist Name:', 'Team Specialist') || 'Specialist Member';
                          const role = prompt('Specialist Role / Title:', 'AI & Digital Transformation Specialist') || 'Specialist';
                          const newAvatar = {
                            id: `specialist-${Date.now()}`,
                            name,
                            role,
                            avatar: url,
                            src: url,
                            alt: `${name} - ${role}`,
                          };
                          setPageData((prev) => ({
                            ...prev,
                            approachTeamMembers: [...(prev.approachTeamMembers || []), newAvatar],
                          }));
                        }, 'image');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-persici-crimson hover:bg-red-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <TbPhoto className="w-3.5 h-3.5" />
                      <span>Add from Storage Library (R2)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newAvatar = {
                          id: `specialist-${Date.now()}`,
                          name: 'Specialist Member',
                          role: 'Senior Digital Engineer',
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                          src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                          alt: 'Team Specialist',
                        };
                        setPageData((prev) => ({
                          ...prev,
                          approachTeamMembers: [...(prev.approachTeamMembers || []), newAvatar],
                        }));
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                    >
                      <TbPlus className="w-3.5 h-3.5" />
                      <span>Add Specialist</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {(pageData.approachTeamMembers || []).map((m: any, mIdx: number) => (
                    <div
                      key={m.id || mIdx}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.avatar || m.src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={m.name || 'Specialist'}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Avatar URL"
                              value={m.avatar || m.src || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPageData((prev) => {
                                  const updated = [...(prev.approachTeamMembers || [])];
                                  if (updated[mIdx]) {
                                    updated[mIdx] = { ...updated[mIdx], avatar: val, src: val };
                                  }
                                  return { ...prev, approachTeamMembers: updated };
                                });
                              }}
                              className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                openMediaPicker((url) => {
                                  setPageData((prev) => {
                                    const updated = [...(prev.approachTeamMembers || [])];
                                    if (updated[mIdx]) {
                                      updated[mIdx] = { ...updated[mIdx], avatar: url, src: url };
                                    }
                                    return { ...prev, approachTeamMembers: updated };
                                  });
                                }, 'image')
                              }
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold shrink-0 flex items-center gap-1 border border-slate-200"
                            >
                              <TbPhoto className="w-3.5 h-3.5" />
                              <span>Pick</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Specialist Name (e.g. Elena Rostova)"
                              value={m.name || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPageData((prev) => {
                                  const updated = [...(prev.approachTeamMembers || [])];
                                  if (updated[mIdx]) {
                                    updated[mIdx] = { ...updated[mIdx], name: val };
                                  }
                                  return { ...prev, approachTeamMembers: updated };
                                });
                              }}
                              className="px-2 py-0.5 text-xs border border-slate-200 rounded"
                            />
                            <input
                              type="text"
                              placeholder="Role / Title (e.g. Lead AI Architect)"
                              value={m.role || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPageData((prev) => {
                                  const updated = [...(prev.approachTeamMembers || [])];
                                  if (updated[mIdx]) {
                                    updated[mIdx] = { ...updated[mIdx], role: val };
                                  }
                                  return { ...prev, approachTeamMembers: updated };
                                });
                              }}
                              className="px-2 py-0.5 text-xs border border-slate-200 rounded"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={mIdx === 0}
                          onClick={() => {
                            if (mIdx === 0) return;
                            setPageData((prev) => {
                              const updated = [...(prev.approachTeamMembers || [])];
                              const temp = updated[mIdx - 1];
                              updated[mIdx - 1] = updated[mIdx];
                              updated[mIdx] = temp;
                              return { ...prev, approachTeamMembers: updated };
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Up"
                        >
                          <TbArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={mIdx === (pageData.approachTeamMembers || []).length - 1}
                          onClick={() => {
                            if (mIdx === (pageData.approachTeamMembers || []).length - 1) return;
                            setPageData((prev) => {
                              const updated = [...(prev.approachTeamMembers || [])];
                              const temp = updated[mIdx + 1];
                              updated[mIdx + 1] = updated[mIdx];
                              updated[mIdx] = temp;
                              return { ...prev, approachTeamMembers: updated };
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Down"
                        >
                          <TbArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPageData((prev) => {
                              const updated = [...(prev.approachTeamMembers || [])];
                              updated.splice(mIdx, 1);
                              return { ...prev, approachTeamMembers: updated };
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Remove Avatar"
                        >
                          <TbTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary CTA Button</label>
                <input
                  type="text"
                  placeholder="Label EN"
                  value={pageData.approachCtaPrimaryEn || pageData.approach?.ctaPrimaryText?.en || 'Book call'}
                  onChange={(e) => setPageData({ ...pageData, approachCtaPrimaryEn: e.target.value })}
                  className="w-full mb-2 px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Target URL (e.g. /contact)"
                  value={pageData.approachCtaPrimaryHref || pageData.approach?.ctaPrimaryHref || '/contact'}
                  onChange={(e) => setPageData({ ...pageData, approachCtaPrimaryHref: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Secondary CTA Button</label>
                <input
                  type="text"
                  placeholder="Label EN"
                  value={pageData.approachCtaSecondaryEn || pageData.approach?.ctaSecondaryText?.en || 'More about us'}
                  onChange={(e) => setPageData({ ...pageData, approachCtaSecondaryEn: e.target.value })}
                  className="w-full mb-2 px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Target URL (e.g. /about)"
                  value={pageData.approachCtaSecondaryHref || pageData.approach?.ctaSecondaryHref || '/about'}
                  onChange={(e) => setPageData({ ...pageData, approachCtaSecondaryHref: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono text-[11px]"
                />
              </div>
            </div>
          </SectionAccordion>

          {/* ================================================================= */}
          {/* Section 7: Words from Those We Scale (Reviews Wall)              */}
          {/* ================================================================= */}
          <SectionAccordion
            number={7}
            title="7. Words from Those We Scale (Reviews Wall of Love)"
            description="Overall score badge, dual marquee review cards, and bottom conversion banner strip"
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Reviews Section Headline (English)
                </label>
                <input
                  type="text"
                  value={pageData.reviewsTitleEn || pageData.reviews?.title?.en || 'Words from those we scale'}
                  onChange={(e) => setPageData({ ...pageData, reviewsTitleEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم المراجعات (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.reviewsTitleAr || pageData.reviews?.title?.ar || 'كلمات من أولئك الذين نساعدهم على التوسع'}
                  onChange={(e) => setPageData({ ...pageData, reviewsTitleAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Overall Score (e.g. 5.0)</label>
                <input
                  type="text"
                  value={pageData.reviewsScore || pageData.reviews?.score || '5.0'}
                  onChange={(e) => setPageData({ ...pageData, reviewsScore: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Score Label (EN)</label>
                <input
                  type="text"
                  value={pageData.reviewsScoreLabelEn || pageData.reviews?.scoreLabel?.en || '5.0 Rating from 100+ Enterprise Partners'}
                  onChange={(e) => setPageData({ ...pageData, reviewsScoreLabelEn: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">نص التقييم (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.reviewsScoreLabelAr || pageData.reviews?.scoreLabel?.ar || 'تقييم 5.0 من أكثر من 100 شريك استراتيجي'}
                  onChange={(e) => setPageData({ ...pageData, reviewsScoreLabelAr: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-secondary text-right"
                />
              </div>
            </div>

            {/* Bottom Conversion Banner Strip */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Bottom Conversion Banner Strip (Bilingual)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Banner Text (EN)</label>
                  <input
                    type="text"
                    placeholder="Ready to engineer your next-generation digital ecosystem?"
                    value={pageData.reviewsBannerTextEn || pageData.reviews?.bannerText?.en || ''}
                    onChange={(e) => setPageData({ ...pageData, reviewsBannerTextEn: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 text-right">نص الشريط التحويلي (AR)</label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="هل أنت مستعد لهندسة منظومتك الرقمية وتطبيقاتك الذكية؟"
                    value={pageData.reviewsBannerTextAr || pageData.reviews?.bannerText?.ar || ''}
                    onChange={(e) => setPageData({ ...pageData, reviewsBannerTextAr: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-secondary text-right"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Banner CTA (EN)</label>
                  <input
                    type="text"
                    placeholder="Book a discovery call"
                    value={pageData.reviewsBannerCtaEn || pageData.reviews?.bannerCtaText?.en || ''}
                    onChange={(e) => setPageData({ ...pageData, reviewsBannerCtaEn: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 text-right">زر الحجز (AR)</label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="احجز مكالمة استكشافية"
                    value={pageData.reviewsBannerCtaAr || pageData.reviews?.bannerCtaText?.ar || ''}
                    onChange={(e) => setPageData({ ...pageData, reviewsBannerCtaAr: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-secondary text-right"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">CTA Href URL</label>
                  <input
                    type="text"
                    placeholder="/contact"
                    value={pageData.reviewsBannerCtaHref || pageData.reviews?.bannerCtaHref || '/contact'}
                    onChange={(e) => setPageData({ ...pageData, reviewsBannerCtaHref: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Dedicated Reviews Wall Sync Notice */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-emerald-900">
                <TbSparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Authoritative review cards are managed in the <strong>Reviews Wall</strong> database and automatically synced here.
                </span>
              </div>
              <Link
                href={`/${lang}/dashboard/content/reviews`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-2xs"
              >
                <span>Open Reviews Wall</span>
                <TbExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Reviews Cards ({(pageData.reviewsList || []).length})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Dual English & Arabic text saved simultaneously for each review.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const existing = pageData.reviewsList || [];
                    setPageData({
                      ...pageData,
                      reviewsList: [
                        ...existing,
                        {
                          name: 'Client Partner',
                          nameEn: 'Client Partner',
                          nameAr: 'شريك استراتيجي',
                          role: 'Digital Strategist',
                          roleEn: 'Digital Strategist',
                          roleAr: 'خبير استراتيجي رقمي',
                          company: 'Global Enterprise',
                          companyEn: 'Global Enterprise',
                          companyAr: 'مؤسسة عالمية',
                          review: 'Persici provided exemplary engineering rigour and accelerated our digital growth significantly.',
                          reviewEn: 'Persici provided exemplary engineering rigour and accelerated our digital growth significantly.',
                          reviewAr: 'قدمت لنا بيرسيشي دقة هندسية استثنائية وسرعت من نمونا الرقمي بشكل ملحوظ.',
                          verified: 'Verified Client',
                          verifiedEn: 'Verified Client',
                          verifiedAr: 'عميل موثق',
                          rating: 5,
                        },
                      ],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>
              </div>

              {(pageData.reviewsList || []).map((rev: any, idx: number) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 relative group shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                        {idx + 1}
                      </span>
                      <span>{rev.nameEn || rev.name || `Review #${idx + 1}`}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(pageData.reviewsList || [])];
                        updated.splice(idx, 1);
                        setPageData({ ...pageData, reviewsList: updated });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Remove review"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rating & Avatar Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-slate-200">
                      <span className="text-[11px] font-semibold text-amber-500 whitespace-nowrap">★ Rate:</span>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        placeholder="5.0"
                        value={rev.rating !== undefined ? rev.rating : 5}
                        onChange={(e) => {
                          const updated = [...(pageData.reviewsList || [])];
                          const val = parseFloat(e.target.value);
                          updated[idx] = { ...rev, rating: isNaN(val) ? 5 : val };
                          setPageData({ ...pageData, reviewsList: updated });
                        }}
                        className="w-full px-1.5 py-0.5 text-xs border border-slate-200 rounded font-semibold text-slate-800 bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Avatar URL (Optional)"
                        value={rev.avatar || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.reviewsList || [])];
                          updated[idx] = { ...rev, avatar: e.target.value };
                          setPageData({ ...pageData, reviewsList: updated });
                        }}
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded font-mono text-[11px] bg-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker((url) => {
                            const updated = [...(pageData.reviewsList || [])];
                            updated[idx] = { ...rev, avatar: url };
                            setPageData({ ...pageData, reviewsList: updated });
                          }, 'image')
                        }
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs font-semibold shrink-0 flex items-center gap-1 border border-slate-200"
                      >
                        <TbPhoto className="w-3.5 h-3.5" />
                        <span>Pick</span>
                      </button>
                    </div>
                  </div>

                  {/* Dual Column: English & Arabic */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* English Inputs */}
                    <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                        English Content (EN)
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Client Name (EN)"
                          value={rev.nameEn || (typeof rev.name === 'string' ? rev.name : '') || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.reviewsList || [])];
                            updated[idx] = { ...rev, nameEn: e.target.value, name: e.target.value };
                            setPageData({ ...pageData, reviewsList: updated });
                          }}
                          className="px-2.5 py-1 text-xs border border-slate-200 rounded bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Verified Badge (EN)"
                          value={rev.verifiedEn || (typeof rev.verified === 'string' ? rev.verified : '') || 'Verified Client'}
                          onChange={(e) => {
                            const updated = [...(pageData.reviewsList || [])];
                            updated[idx] = { ...rev, verifiedEn: e.target.value, verified: e.target.value };
                            setPageData({ ...pageData, reviewsList: updated });
                          }}
                          className="px-2.5 py-1 text-xs border border-slate-200 rounded bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Role (EN)"
                          value={rev.roleEn || (typeof rev.role === 'string' ? rev.role : '') || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.reviewsList || [])];
                            updated[idx] = { ...rev, roleEn: e.target.value, role: e.target.value };
                            setPageData({ ...pageData, reviewsList: updated });
                          }}
                          className="px-2.5 py-1 text-xs border border-slate-200 rounded bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Company (EN)"
                          value={rev.companyEn || (typeof rev.company === 'string' ? rev.company : '') || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.reviewsList || [])];
                            updated[idx] = { ...rev, companyEn: e.target.value, company: e.target.value };
                            setPageData({ ...pageData, reviewsList: updated });
                          }}
                          className="px-2.5 py-1 text-xs border border-slate-200 rounded bg-white"
                        />
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Review Quote (EN)..."
                        value={rev.reviewEn || (typeof rev.review === 'string' ? rev.review : '') || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.reviewsList || [])];
                          updated[idx] = { ...rev, reviewEn: e.target.value, review: e.target.value };
                          setPageData({ ...pageData, reviewsList: updated });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white"
                      />
                    </div>

                    {/* Arabic Inputs */}
                    <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2" dir="rtl">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block text-right">
                        المحتوى بالعربية (AR)
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          dir="rtl"
                          placeholder="اسم العميل (AR)"
                          value={rev.nameAr || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.reviewsList || [])];
                            updated[idx] = { ...rev, nameAr: e.target.value };
                            setPageData({ ...pageData, reviewsList: updated });
                          }}
                          className="px-2.5 py-1 text-xs border border-slate-200 rounded bg-white font-secondary text-right"
                        />
                        <input
                          type="text"
                          dir="rtl"
                          placeholder="شارة التوثيق (AR)"
                          value={rev.verifiedAr || 'عميل موثق'}
                          onChange={(e) => {
                            const updated = [...(pageData.reviewsList || [])];
                            updated[idx] = { ...rev, verifiedAr: e.target.value };
                            setPageData({ ...pageData, reviewsList: updated });
                          }}
                          className="px-2.5 py-1 text-xs border border-slate-200 rounded bg-white font-secondary text-right"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          dir="rtl"
                          placeholder="المسمى الوظيفي (AR)"
                          value={rev.roleAr || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.reviewsList || [])];
                            updated[idx] = { ...rev, roleAr: e.target.value };
                            setPageData({ ...pageData, reviewsList: updated });
                          }}
                          className="px-2.5 py-1 text-xs border border-slate-200 rounded bg-white font-secondary text-right"
                        />
                        <input
                          type="text"
                          dir="rtl"
                          placeholder="الشركة / العلامة (AR)"
                          value={rev.companyAr || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.reviewsList || [])];
                            updated[idx] = { ...rev, companyAr: e.target.value };
                            setPageData({ ...pageData, reviewsList: updated });
                          }}
                          className="px-2.5 py-1 text-xs border border-slate-200 rounded bg-white font-secondary text-right"
                        />
                      </div>
                      <textarea
                        rows={3}
                        dir="rtl"
                        placeholder="نص التقييم والشهادة بالعربية..."
                        value={rev.reviewAr || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.reviewsList || [])];
                          updated[idx] = { ...rev, reviewAr: e.target.value };
                          setPageData({ ...pageData, reviewsList: updated });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white font-secondary text-right"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionAccordion>

          {/* ================================================================= */}
          {/* Global Shared Contact Section Notice Banner                       */}
          {/* ================================================================= */}
          <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white shadow-md border border-slate-700/60 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-persici-crimson text-white font-bold text-sm shadow-sm">
                  8
                </span>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                    <span>Global Shared Contact & Discovery Engine</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-200">
                      Shared Tab
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Section 8 is globally shared across all site pages</p>
                </div>
              </div>
              <Link
                href={`/${lang}/dashboard/shared-contact`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-persici-crimson hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-persici-crimson/30"
              >
                <TbForms className="w-4 h-4" />
                <span>Open Shared Contact Manager</span>
                <TbChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              The bottom contact section (&ldquo;Ready to accelerate your digital future?&rdquo; & Get in Touch form) is a global component shared across all pages (Home, About, Services, etc.).
              To manage pitch titles, 4 strategic value points, animated GIF background, partner logos swiper, customizable form fields, countries list, reasons of contact, and Google reCAPTCHA v2 credentials, use the dedicated <strong className="text-white">Shared Contact</strong> tab.
            </p>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. ABOUT US PAGE SECTIONS BUILDER (ALL 10 SECTIONS)                 */}
      {/* =================================================================== */}
      {slug === 'about' && (
        <div className="space-y-4">
          {/* ----------------------------------------------------------------- */}
          {/* Section 1: Hero Billboard (AboutHeroSection)                      */}
          {/* ----------------------------------------------------------------- */}
          <SectionAccordion
            number={1}
            title="About Us • Hero Billboard"
            description="Eyebrow badge, agency headline (H1), subtitle narrative, and primary / secondary CTAs"
            isOpenDefault={true}
            onSave={savePage}
          >
            {/* Eyebrow Badge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eyebrow Badge (EN)</label>
                <input
                  type="text"
                  value={pageData.hero?.badge?.en ?? aboutPageData.hero.badge.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...aboutPageData.hero,
                        ...pageData.hero,
                        badge: { ...aboutPageData.hero.badge, ...pageData.hero?.badge, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">شارة القسم العلوية (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.badge?.ar ?? aboutPageData.hero.badge.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...aboutPageData.hero,
                        ...pageData.hero,
                        badge: { ...aboutPageData.hero.badge, ...pageData.hero?.badge, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Hero Main Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hero Main Title H1 (EN)</label>
                <input
                  type="text"
                  value={pageData.hero?.title?.en ?? aboutPageData.hero.title.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...aboutPageData.hero,
                        ...pageData.hero,
                        title: { ...aboutPageData.hero.title, ...pageData.hero?.title, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">العنوان الرئيسي (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.title?.ar ?? aboutPageData.hero.title.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...aboutPageData.hero,
                        ...pageData.hero,
                        title: { ...aboutPageData.hero.title, ...pageData.hero?.title, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Hero Subtitle Narrative */}
            <RichTextEditor
              label="Hero Subtitle Narrative"
              helperText="Supports rich formatting, links, and text alignment (Left, Center, Right, Justify)."
              rows={4}
              valueEn={pageData.hero?.subtitle?.en ?? aboutPageData.hero.subtitle.en}
              valueAr={pageData.hero?.subtitle?.ar ?? aboutPageData.hero.subtitle.ar}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  hero: {
                    ...aboutPageData.hero,
                    ...pageData.hero,
                    subtitle: { ...aboutPageData.hero.subtitle, ...pageData.hero?.subtitle, en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  hero: {
                    ...aboutPageData.hero,
                    ...pageData.hero,
                    subtitle: { ...aboutPageData.hero.subtitle, ...pageData.hero?.subtitle, ar: val },
                  },
                })
              }
            />

            {/* Primary & Secondary CTAs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              <CtaEditor
                title="Primary CTA Button (Explore Our Journey)"
                cta={{
                  enabled: pageData.hero?.primaryCta?.enabled !== false,
                  labelEn: pageData.hero?.primaryCta?.en ?? aboutPageData.hero.primaryCta.en,
                  labelAr: pageData.hero?.primaryCta?.ar ?? aboutPageData.hero.primaryCta.ar,
                  href: pageData.hero?.primaryCta?.href ?? aboutPageData.hero.primaryCta.href,
                }}
                onChange={(cta: CtaConfig) =>
                  setPageData({
                    ...pageData,
                    hero: {
                      ...aboutPageData.hero,
                      ...pageData.hero,
                      primaryCta: {
                        en: cta.labelEn,
                        ar: cta.labelAr,
                        href: cta.href,
                        enabled: cta.enabled,
                      },
                    },
                  })
                }
              />

              <CtaEditor
                title="Secondary CTA Button (Book a Discovery Call)"
                cta={{
                  enabled: pageData.hero?.secondaryCta?.enabled !== false,
                  labelEn: pageData.hero?.secondaryCta?.en ?? aboutPageData.hero.secondaryCta.en,
                  labelAr: pageData.hero?.secondaryCta?.ar ?? aboutPageData.hero.secondaryCta.ar,
                  href: pageData.hero?.secondaryCta?.href ?? aboutPageData.hero.secondaryCta.href,
                }}
                onChange={(cta: CtaConfig) =>
                  setPageData({
                    ...pageData,
                    hero: {
                      ...aboutPageData.hero,
                      ...pageData.hero,
                      secondaryCta: {
                        en: cta.labelEn,
                        ar: cta.labelAr,
                        href: cta.href,
                        enabled: cta.enabled,
                      },
                    },
                  })
                }
              />
            </div>
          </SectionAccordion>

          {/* ----------------------------------------------------------------- */}
          {/* Section 2: Purpose & Vision + Stats (AboutPurposeSection)         */}
          {/* ----------------------------------------------------------------- */}
          <SectionAccordion
            number={2}
            title="About Us • Purpose, Vision & Enterprise Stats"
            description="Mission narratives, wide panoramic team image, and animated CountUp statistics"
            onSave={savePage}
          >
            {/* Eyebrow & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eyebrow Badge (EN)</label>
                <input
                  type="text"
                  value={pageData.purpose?.badge?.en ?? aboutPageData.purpose.badge.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      purpose: {
                        ...aboutPageData.purpose,
                        ...pageData.purpose,
                        badge: { ...aboutPageData.purpose.badge, ...pageData.purpose?.badge, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">شارة القسم (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.purpose?.badge?.ar ?? aboutPageData.purpose.badge.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      purpose: {
                        ...aboutPageData.purpose,
                        ...pageData.purpose,
                        badge: { ...aboutPageData.purpose.badge, ...pageData.purpose?.badge, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Purpose Title H2 (EN)</label>
                <input
                  type="text"
                  value={pageData.purpose?.title?.en ?? aboutPageData.purpose.title.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      purpose: {
                        ...aboutPageData.purpose,
                        ...pageData.purpose,
                        title: { ...aboutPageData.purpose.title, ...pageData.purpose?.title, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان الرؤية والهدف (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.purpose?.title?.ar ?? aboutPageData.purpose.title.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      purpose: {
                        ...aboutPageData.purpose,
                        ...pageData.purpose,
                        title: { ...aboutPageData.purpose.title, ...pageData.purpose?.title, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Description 1 & 2 */}
            <RichTextEditor
              label="Primary Purpose Paragraph (Description 1)"
              rows={4}
              valueEn={pageData.purpose?.description1?.en ?? aboutPageData.purpose.description1.en}
              valueAr={pageData.purpose?.description1?.ar ?? aboutPageData.purpose.description1.ar}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  purpose: {
                    ...aboutPageData.purpose,
                    ...pageData.purpose,
                    description1: { ...aboutPageData.purpose.description1, ...pageData.purpose?.description1, en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  purpose: {
                    ...aboutPageData.purpose,
                    ...pageData.purpose,
                    description1: { ...aboutPageData.purpose.description1, ...pageData.purpose?.description1, ar: val },
                  },
                })
              }
            />

            <RichTextEditor
              label="Secondary Purpose Paragraph (Description 2)"
              rows={4}
              valueEn={pageData.purpose?.description2?.en ?? aboutPageData.purpose.description2.en}
              valueAr={pageData.purpose?.description2?.ar ?? aboutPageData.purpose.description2.ar}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  purpose: {
                    ...aboutPageData.purpose,
                    ...pageData.purpose,
                    description2: { ...aboutPageData.purpose.description2, ...pageData.purpose?.description2, en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  purpose: {
                    ...aboutPageData.purpose,
                    ...pageData.purpose,
                    description2: { ...aboutPageData.purpose.description2, ...pageData.purpose?.description2, ar: val },
                  },
                })
              }
            />

            {/* Wide Feature Image */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Wide Team Collaboration Feature Image (21:9 / 16:9)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {(pageData.purpose?.image || aboutPageData.purpose.image) && (
                  <img
                    src={pageData.purpose?.image || aboutPageData.purpose.image}
                    alt="Purpose preview"
                    className="w-28 h-16 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                  />
                )}
                <div className="flex-1 flex gap-2 w-full">
                  <input
                    type="text"
                    value={pageData.purpose?.image ?? aboutPageData.purpose.image}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        purpose: { ...aboutPageData.purpose, ...pageData.purpose, image: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono text-[11px] bg-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((url) => {
                        setPageData({
                          ...pageData,
                          purpose: { ...aboutPageData.purpose, ...pageData.purpose, image: url },
                        });
                      }, 'image')
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shrink-0"
                  >
                    <TbPhoto className="w-3.5 h-3.5" />
                    <span>Pick R2</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Animated Stats Repeater */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Animated Enterprise Counters ({(pageData.purpose?.stats || aboutPageData.purpose.stats).length})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Each counter animates up to &ldquo;Target Number&rdquo; on viewport scroll with optional prefix, suffix, and separator.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentStats = pageData.purpose?.stats || aboutPageData.purpose.stats;
                    const nextCode = String(currentStats.length + 1).padStart(2, '0');
                    setPageData({
                      ...pageData,
                      purpose: {
                        ...aboutPageData.purpose,
                        ...pageData.purpose,
                        stats: [
                          ...currentStats,
                          {
                            code: nextCode,
                            value: '100+',
                            number: 100,
                            prefix: '',
                            suffix: '+',
                            thousandsSeparator: '',
                            label: { en: 'new metric label', ar: 'عنوان المؤشر الجديد' },
                          },
                        ],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Counter</span>
                </button>
              </div>

              <div className="space-y-3">
                {(pageData.purpose?.stats || aboutPageData.purpose.stats).map((stat: any, idx: number) => {
                  const statsList = pageData.purpose?.stats || aboutPageData.purpose.stats;
                  return (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="text-xs font-bold text-slate-700 font-mono">
                          Counter #{idx + 1} ({stat.number}{stat.suffix || ''})
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const updated = [...statsList];
                              [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                              setPageData({
                                ...pageData,
                                purpose: { ...aboutPageData.purpose, ...pageData.purpose, stats: updated },
                              });
                            }}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                            title="Move Up"
                          >
                            <TbArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === statsList.length - 1}
                            onClick={() => {
                              const updated = [...statsList];
                              [updated[idx + 1], updated[idx]] = [updated[idx], updated[idx + 1]];
                              setPageData({
                                ...pageData,
                                purpose: { ...aboutPageData.purpose, ...pageData.purpose, stats: updated },
                              });
                            }}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                            title="Move Down"
                          >
                            <TbArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = statsList.filter((_: any, i: number) => i !== idx);
                              setPageData({
                                ...pageData,
                                purpose: { ...aboutPageData.purpose, ...pageData.purpose, stats: updated },
                              });
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Remove Counter"
                          >
                            <TbTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Code</label>
                          <input
                            type="text"
                            value={stat.code ?? ''}
                            onChange={(e) => {
                              const updated = [...statsList];
                              updated[idx] = { ...stat, code: e.target.value };
                              setPageData({
                                ...pageData,
                                purpose: { ...aboutPageData.purpose, ...pageData.purpose, stats: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Number</label>
                          <input
                            type="number"
                            value={stat.number ?? 0}
                            onChange={(e) => {
                              const num = Number(e.target.value) || 0;
                              const updated = [...statsList];
                              updated[idx] = {
                                ...stat,
                                number: num,
                                value: `${stat.prefix || ''}${num}${stat.suffix || ''}`,
                              };
                              setPageData({
                                ...pageData,
                                purpose: { ...aboutPageData.purpose, ...pageData.purpose, stats: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Prefix</label>
                          <input
                            type="text"
                            placeholder="e.g. +, $"
                            value={stat.prefix ?? ''}
                            onChange={(e) => {
                              const updated = [...statsList];
                              updated[idx] = { ...stat, prefix: e.target.value };
                              setPageData({
                                ...pageData,
                                purpose: { ...aboutPageData.purpose, ...pageData.purpose, stats: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Suffix</label>
                          <input
                            type="text"
                            placeholder="e.g. +, %, k"
                            value={stat.suffix ?? ''}
                            onChange={(e) => {
                              const updated = [...statsList];
                              updated[idx] = { ...stat, suffix: e.target.value };
                              setPageData({
                                ...pageData,
                                purpose: { ...aboutPageData.purpose, ...pageData.purpose, stats: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thousands Sep</label>
                          <input
                            type="text"
                            placeholder="e.g. ,"
                            value={stat.thousandsSeparator ?? ''}
                            onChange={(e) => {
                              const updated = [...statsList];
                              updated[idx] = { ...stat, thousandsSeparator: e.target.value };
                              setPageData({
                                ...pageData,
                                purpose: { ...aboutPageData.purpose, ...pageData.purpose, stats: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Stat Label (EN)</label>
                          <input
                            type="text"
                            value={stat.label?.en ?? ''}
                            onChange={(e) => {
                              const updated = [...statsList];
                              updated[idx] = { ...stat, label: { ...stat.label, en: e.target.value } };
                              setPageData({
                                ...pageData,
                                purpose: { ...aboutPageData.purpose, ...pageData.purpose, stats: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">وصف المؤشر (AR)</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={stat.label?.ar ?? ''}
                            onChange={(e) => {
                              const updated = [...statsList];
                              updated[idx] = { ...stat, label: { ...stat.label, ar: e.target.value } };
                              setPageData({
                                ...pageData,
                                purpose: { ...aboutPageData.purpose, ...pageData.purpose, stats: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionAccordion>

          {/* ----------------------------------------------------------------- */}
          {/* Section 3: Global Strategic Reach / Heritage Card                 */}
          {/* ----------------------------------------------------------------- */}
          <SectionAccordion
            number={3}
            title="About Us • Global Strategic Reach & Heritage Card"
            description="Floating architectural card, background photography, 3 regional metrics, portrait image, and CTA"
            onSave={savePage}
          >
            {/* Eyebrow & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eyebrow Badge (EN)</label>
                <input
                  type="text"
                  value={pageData.heritage?.badge?.en ?? aboutPageData.heritage.badge.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      heritage: {
                        ...aboutPageData.heritage,
                        ...pageData.heritage,
                        badge: { ...aboutPageData.heritage.badge, ...pageData.heritage?.badge, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">شارة القسم (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.heritage?.badge?.ar ?? aboutPageData.heritage.badge.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      heritage: {
                        ...aboutPageData.heritage,
                        ...pageData.heritage,
                        badge: { ...aboutPageData.heritage.badge, ...pageData.heritage?.badge, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Heritage Card Title H2 (EN)</label>
                <input
                  type="text"
                  value={pageData.heritage?.title?.en ?? aboutPageData.heritage.title.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      heritage: {
                        ...aboutPageData.heritage,
                        ...pageData.heritage,
                        title: { ...aboutPageData.heritage.title, ...pageData.heritage?.title, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان بطاقة الإرث والحضور (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.heritage?.title?.ar ?? aboutPageData.heritage.title.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      heritage: {
                        ...aboutPageData.heritage,
                        ...pageData.heritage,
                        title: { ...aboutPageData.heritage.title, ...pageData.heritage?.title, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Heritage Description */}
            <RichTextEditor
              label="Heritage Narrative Description"
              rows={4}
              valueEn={pageData.heritage?.description?.en ?? aboutPageData.heritage.description.en}
              valueAr={pageData.heritage?.description?.ar ?? aboutPageData.heritage.description.ar}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  heritage: {
                    ...aboutPageData.heritage,
                    ...pageData.heritage,
                    description: { ...aboutPageData.heritage.description, ...pageData.heritage?.description, en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  heritage: {
                    ...aboutPageData.heritage,
                    ...pageData.heritage,
                    description: { ...aboutPageData.heritage.description, ...pageData.heritage?.description, ar: val },
                  },
                })
              }
            />

            {/* Portrait Image & Architectural Background Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Right Column Portrait Image (4:5)
                </label>
                <div className="flex items-center gap-3">
                  {(pageData.heritage?.image || aboutPageData.heritage.image) && (
                    <img
                      src={pageData.heritage?.image || aboutPageData.heritage.image}
                      alt="Heritage portrait"
                      className="w-16 h-20 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                    />
                  )}
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={pageData.heritage?.image ?? aboutPageData.heritage.image}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          heritage: { ...aboutPageData.heritage, ...pageData.heritage, image: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker((url) => {
                          setPageData({
                            ...pageData,
                            heritage: { ...aboutPageData.heritage, ...pageData.heritage, image: url },
                          });
                        }, 'image')
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shrink-0"
                    >
                      <TbPhoto className="w-3.5 h-3.5" />
                      <span>Pick R2</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Section Architectural Background Image
                </label>
                <div className="flex items-center gap-3">
                  {(pageData.heritage?.bgImage || aboutPageData.heritage.bgImage || '/about/heritage-bg.jpg') && (
                    <img
                      src={pageData.heritage?.bgImage || aboutPageData.heritage.bgImage || '/about/heritage-bg.jpg'}
                      alt="Heritage background"
                      className="w-24 h-16 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                    />
                  )}
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={pageData.heritage?.bgImage ?? aboutPageData.heritage.bgImage ?? '/about/heritage-bg.jpg'}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          heritage: { ...aboutPageData.heritage, ...pageData.heritage, bgImage: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker((url) => {
                          setPageData({
                            ...pageData,
                            heritage: { ...aboutPageData.heritage, ...pageData.heritage, bgImage: url },
                          });
                        }, 'image')
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shrink-0"
                    >
                      <TbPhoto className="w-3.5 h-3.5" />
                      <span>Pick R2</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Metrics Repeater */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Card Key Metrics ({(pageData.heritage?.metrics || aboutPageData.heritage.metrics).length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const currentMetrics = pageData.heritage?.metrics || aboutPageData.heritage.metrics;
                    setPageData({
                      ...pageData,
                      heritage: {
                        ...aboutPageData.heritage,
                        ...pageData.heritage,
                        metrics: [
                          ...currentMetrics,
                          {
                            value: '99%',
                            label: { en: 'New Metric', ar: 'مؤشر جديد' },
                          },
                        ],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Metric</span>
                </button>
              </div>

              <div className="space-y-3">
                {(pageData.heritage?.metrics || aboutPageData.heritage.metrics).map((metric: any, idx: number) => {
                  const metricsList = pageData.heritage?.metrics || aboutPageData.heritage.metrics;
                  return (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 font-mono">
                          Metric #{idx + 1} ({metric.value})
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const updated = [...metricsList];
                              [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                              setPageData({
                                ...pageData,
                                heritage: { ...aboutPageData.heritage, ...pageData.heritage, metrics: updated },
                              });
                            }}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                          >
                            <TbArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === metricsList.length - 1}
                            onClick={() => {
                              const updated = [...metricsList];
                              [updated[idx + 1], updated[idx]] = [updated[idx], updated[idx + 1]];
                              setPageData({
                                ...pageData,
                                heritage: { ...aboutPageData.heritage, ...pageData.heritage, metrics: updated },
                              });
                            }}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                          >
                            <TbArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = metricsList.filter((_: any, i: number) => i !== idx);
                              setPageData({
                                ...pageData,
                                heritage: { ...aboutPageData.heritage, ...pageData.heritage, metrics: updated },
                              });
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <TbTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Value (e.g. 100+, 98%, 4.8★)</label>
                          <input
                            type="text"
                            value={metric.value ?? ''}
                            onChange={(e) => {
                              const updated = [...metricsList];
                              updated[idx] = { ...metric, value: e.target.value };
                              setPageData({
                                ...pageData,
                                heritage: { ...aboutPageData.heritage, ...pageData.heritage, metrics: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Metric Label (EN)</label>
                          <input
                            type="text"
                            value={metric.label?.en ?? ''}
                            onChange={(e) => {
                              const updated = [...metricsList];
                              updated[idx] = { ...metric, label: { ...metric.label, en: e.target.value } };
                              setPageData({
                                ...pageData,
                                heritage: { ...aboutPageData.heritage, ...pageData.heritage, metrics: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">وصف المؤشر (AR)</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={metric.label?.ar ?? ''}
                            onChange={(e) => {
                              const updated = [...metricsList];
                              updated[idx] = { ...metric, label: { ...metric.label, ar: e.target.value } };
                              setPageData({
                                ...pageData,
                                heritage: { ...aboutPageData.heritage, ...pageData.heritage, metrics: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Heritage CTA */}
            <CtaEditor
              title="Heritage Card Action Button"
              cta={{
                enabled: pageData.heritage?.cta?.enabled !== false,
                labelEn: pageData.heritage?.cta?.en ?? aboutPageData.heritage.cta.en,
                labelAr: pageData.heritage?.cta?.ar ?? aboutPageData.heritage.cta.ar,
                href: pageData.heritage?.cta?.href ?? aboutPageData.heritage.cta.href,
              }}
              onChange={(cta: CtaConfig) =>
                setPageData({
                  ...pageData,
                  heritage: {
                    ...aboutPageData.heritage,
                    ...pageData.heritage,
                    cta: {
                      en: cta.labelEn,
                      ar: cta.labelAr,
                      href: cta.href,
                      enabled: cta.enabled,
                    },
                  },
                })
              }
            />
          </SectionAccordion>

          {/* ----------------------------------------------------------------- */}
          {/* Section 4: How We Partner (AboutPartnershipSection)               */}
          {/* ----------------------------------------------------------------- */}
          <SectionAccordion
            number={4}
            title="About Us • Partnership Philosophy (How We Partner)"
            description="Standout quote callout, multi-paragraph philosophy, shaped tab image, floating status chip, and CTA"
            onSave={savePage}
          >
            {/* Eyebrow & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eyebrow Badge (EN)</label>
                <input
                  type="text"
                  value={pageData.partnership?.badge?.en ?? aboutPageData.partnership.badge.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      partnership: {
                        ...aboutPageData.partnership,
                        ...pageData.partnership,
                        badge: { ...aboutPageData.partnership.badge, ...pageData.partnership?.badge, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">شارة القسم (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.partnership?.badge?.ar ?? aboutPageData.partnership.badge.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      partnership: {
                        ...aboutPageData.partnership,
                        ...pageData.partnership,
                        badge: { ...aboutPageData.partnership.badge, ...pageData.partnership?.badge, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Partnership Title H2 (EN)</label>
                <input
                  type="text"
                  value={pageData.partnership?.title?.en ?? aboutPageData.partnership.title.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      partnership: {
                        ...aboutPageData.partnership,
                        ...pageData.partnership,
                        title: { ...aboutPageData.partnership.title, ...pageData.partnership?.title, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان الشراكة (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.partnership?.title?.ar ?? aboutPageData.partnership.title.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      partnership: {
                        ...aboutPageData.partnership,
                        ...pageData.partnership,
                        title: { ...aboutPageData.partnership.title, ...pageData.partnership?.title, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Standout Quote Callout */}
            <RichTextEditor
              label="Standout Crimson-Bordered Callout Quote"
              rows={3}
              valueEn={pageData.partnership?.quote?.en ?? aboutPageData.partnership.quote.en}
              valueAr={pageData.partnership?.quote?.ar ?? aboutPageData.partnership.quote.ar}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  partnership: {
                    ...aboutPageData.partnership,
                    ...pageData.partnership,
                    quote: { ...aboutPageData.partnership.quote, ...pageData.partnership?.quote, en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  partnership: {
                    ...aboutPageData.partnership,
                    ...pageData.partnership,
                    quote: { ...aboutPageData.partnership.quote, ...pageData.partnership?.quote, ar: val },
                  },
                })
              }
            />

            {/* Paragraphs Repeater */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Narrative Paragraphs ({(pageData.partnership?.paragraphs || aboutPageData.partnership.paragraphs).length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const currentParagraphs = pageData.partnership?.paragraphs || aboutPageData.partnership.paragraphs;
                    setPageData({
                      ...pageData,
                      partnership: {
                        ...aboutPageData.partnership,
                        ...pageData.partnership,
                        paragraphs: [
                          ...currentParagraphs,
                          { en: 'New partnership narrative paragraph...', ar: 'فقرة جديدة حول فلسفة الشراكة...' },
                        ],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Paragraph</span>
                </button>
              </div>

              <div className="space-y-4">
                {(pageData.partnership?.paragraphs || aboutPageData.partnership.paragraphs).map((p: any, idx: number) => {
                  const paragraphsList = pageData.partnership?.paragraphs || aboutPageData.partnership.paragraphs;
                  return (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase">Paragraph #{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const updated = [...paragraphsList];
                              [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                              setPageData({
                                ...pageData,
                                partnership: { ...aboutPageData.partnership, ...pageData.partnership, paragraphs: updated },
                              });
                            }}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                          >
                            <TbArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === paragraphsList.length - 1}
                            onClick={() => {
                              const updated = [...paragraphsList];
                              [updated[idx + 1], updated[idx]] = [updated[idx], updated[idx + 1]];
                              setPageData({
                                ...pageData,
                                partnership: { ...aboutPageData.partnership, ...pageData.partnership, paragraphs: updated },
                              });
                            }}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                          >
                            <TbArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = paragraphsList.filter((_: any, i: number) => i !== idx);
                              setPageData({
                                ...pageData,
                                partnership: { ...aboutPageData.partnership, ...pageData.partnership, paragraphs: updated },
                              });
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <TbTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <RichTextEditor
                        label={`Paragraph ${idx + 1} Content`}
                        rows={4}
                        valueEn={p.en ?? ''}
                        valueAr={p.ar ?? ''}
                        onChangeEn={(val) => {
                          const updated = [...paragraphsList];
                          updated[idx] = { ...p, en: val };
                          setPageData({
                            ...pageData,
                            partnership: { ...aboutPageData.partnership, ...pageData.partnership, paragraphs: updated },
                          });
                        }}
                        onChangeAr={(val) => {
                          const updated = [...paragraphsList];
                          updated[idx] = { ...p, ar: val };
                          setPageData({
                            ...pageData,
                            partnership: { ...aboutPageData.partnership, ...pageData.partnership, paragraphs: updated },
                          });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shaped Tab Image & Floating Status Badge */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Shaped Tab Feature Image (4:3)
                </label>
                <div className="flex items-center gap-3">
                  {(pageData.partnership?.image || aboutPageData.partnership.image) && (
                    <img
                      src={pageData.partnership?.image || aboutPageData.partnership.image}
                      alt="Partnership preview"
                      className="w-24 h-18 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                    />
                  )}
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={pageData.partnership?.image ?? aboutPageData.partnership.image}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          partnership: { ...aboutPageData.partnership, ...pageData.partnership, image: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker((url) => {
                          setPageData({
                            ...pageData,
                            partnership: { ...aboutPageData.partnership, ...pageData.partnership, image: url },
                          });
                        }, 'image')
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shrink-0"
                    >
                      <TbPhoto className="w-3.5 h-3.5" />
                      <span>Pick R2</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Floating Image Chip Badge (Active Strategic Squads)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Chip Text (EN)</label>
                    <input
                      type="text"
                      value={
                        pageData.partnership?.floatingBadge?.en ??
                        aboutPageData.partnership.floatingBadge?.en ??
                        'Active Strategic Squads'
                      }
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          partnership: {
                            ...aboutPageData.partnership,
                            ...pageData.partnership,
                            floatingBadge: {
                              ...(aboutPageData.partnership.floatingBadge || {
                                en: 'Active Strategic Squads',
                                ar: 'تحالفات استراتيجية نشطة',
                              }),
                              ...pageData.partnership?.floatingBadge,
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">نص الشارة العائمة (AR)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={
                        pageData.partnership?.floatingBadge?.ar ??
                        aboutPageData.partnership.floatingBadge?.ar ??
                        'تحالفات استراتيجية نشطة'
                      }
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          partnership: {
                            ...aboutPageData.partnership,
                            ...pageData.partnership,
                            floatingBadge: {
                              ...(aboutPageData.partnership.floatingBadge || {
                                en: 'Active Strategic Squads',
                                ar: 'تحالفات استراتيجية نشطة',
                              }),
                              ...pageData.partnership?.floatingBadge,
                              ar: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Partnership CTA */}
            <CtaEditor
              title="Partnership Methodology CTA Button"
              cta={{
                enabled: pageData.partnership?.cta?.enabled !== false,
                labelEn: pageData.partnership?.cta?.en ?? aboutPageData.partnership.cta.en,
                labelAr: pageData.partnership?.cta?.ar ?? aboutPageData.partnership.cta.ar,
                href: pageData.partnership?.cta?.href ?? aboutPageData.partnership.cta.href,
              }}
              onChange={(cta: CtaConfig) =>
                setPageData({
                  ...pageData,
                  partnership: {
                    ...aboutPageData.partnership,
                    ...pageData.partnership,
                    cta: {
                      en: cta.labelEn,
                      ar: cta.labelAr,
                      href: cta.href,
                      enabled: cta.enabled,
                    },
                  },
                })
              }
            />
          </SectionAccordion>

          {/* ----------------------------------------------------------------- */}
          {/* Section 5: Our Journey / Milestones Timeline                      */}
          {/* ----------------------------------------------------------------- */}
          <SectionAccordion
            number={5}
            title="About Us • Milestones Timeline (Our Journey)"
            description="Section header and chronological milestones (2018–2026) with photos and bilingual narratives"
            onSave={savePage}
          >
            {/* Eyebrow & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eyebrow Badge (EN)</label>
                <input
                  type="text"
                  value={pageData.milestones?.badge?.en ?? aboutPageData.milestones.badge.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      milestones: {
                        ...aboutPageData.milestones,
                        ...pageData.milestones,
                        badge: { ...aboutPageData.milestones.badge, ...pageData.milestones?.badge, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">شارة القسم (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.milestones?.badge?.ar ?? aboutPageData.milestones.badge.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      milestones: {
                        ...aboutPageData.milestones,
                        ...pageData.milestones,
                        badge: { ...aboutPageData.milestones.badge, ...pageData.milestones?.badge, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Timeline Section Title H2 (EN)</label>
                <input
                  type="text"
                  value={pageData.milestones?.title?.en ?? aboutPageData.milestones.title.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      milestones: {
                        ...aboutPageData.milestones,
                        ...pageData.milestones,
                        title: { ...aboutPageData.milestones.title, ...pageData.milestones?.title, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان قسم المحطات الزمنية (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.milestones?.title?.ar ?? aboutPageData.milestones.title.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      milestones: {
                        ...aboutPageData.milestones,
                        ...pageData.milestones,
                        title: { ...aboutPageData.milestones.title, ...pageData.milestones?.title, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <RichTextEditor
              label="Timeline Section Subtitle"
              rows={3}
              valueEn={pageData.milestones?.subtitle?.en ?? aboutPageData.milestones.subtitle.en}
              valueAr={pageData.milestones?.subtitle?.ar ?? aboutPageData.milestones.subtitle.ar}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  milestones: {
                    ...aboutPageData.milestones,
                    ...pageData.milestones,
                    subtitle: { ...aboutPageData.milestones.subtitle, ...pageData.milestones?.subtitle, en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  milestones: {
                    ...aboutPageData.milestones,
                    ...pageData.milestones,
                    subtitle: { ...aboutPageData.milestones.subtitle, ...pageData.milestones?.subtitle, ar: val },
                  },
                })
              }
            />

            {/* Milestones Items Repeater */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Chronological Milestones ({(pageData.milestones?.items || aboutPageData.milestones.items).length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const existing = pageData.milestones?.items || aboutPageData.milestones.items;
                    setPageData({
                      ...pageData,
                      milestones: {
                        ...aboutPageData.milestones,
                        ...pageData.milestones,
                        items: [
                          ...existing,
                          {
                            year: String(new Date().getFullYear()),
                            title: { en: 'New Milestone', ar: 'إنجاز جديد' },
                            description: { en: 'Milestone narrative...', ar: 'تفاصيل المحطة الزمنية...' },
                            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80',
                          },
                        ],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-4">
                {(pageData.milestones?.items || aboutPageData.milestones.items).map((m: any, idx: number) => {
                  const itemsList = pageData.milestones?.items || aboutPageData.milestones.items;
                  return (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          #{idx + 1} • {m.year} — {m.title?.en}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const updated = [...itemsList];
                              [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                              setPageData({
                                ...pageData,
                                milestones: { ...aboutPageData.milestones, ...pageData.milestones, items: updated },
                              });
                            }}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                            title="Move Up"
                          >
                            <TbArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === itemsList.length - 1}
                            onClick={() => {
                              const updated = [...itemsList];
                              [updated[idx + 1], updated[idx]] = [updated[idx], updated[idx + 1]];
                              setPageData({
                                ...pageData,
                                milestones: { ...aboutPageData.milestones, ...pageData.milestones, items: updated },
                              });
                            }}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                            title="Move Down"
                          >
                            <TbArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = itemsList.filter((_: any, i: number) => i !== idx);
                              setPageData({
                                ...pageData,
                                milestones: { ...aboutPageData.milestones, ...pageData.milestones, items: updated },
                              });
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Delete Milestone"
                          >
                            <TbTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Year</label>
                          <input
                            type="text"
                            value={m.year || ''}
                            onChange={(e) => {
                              const updated = [...itemsList];
                              updated[idx] = { ...m, year: e.target.value };
                              setPageData({
                                ...pageData,
                                milestones: { ...aboutPageData.milestones, ...pageData.milestones, items: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Milestone Title (EN)</label>
                          <input
                            type="text"
                            value={m.title?.en || ''}
                            onChange={(e) => {
                              const updated = [...itemsList];
                              updated[idx] = { ...m, title: { ...m.title, en: e.target.value } };
                              setPageData({
                                ...pageData,
                                milestones: { ...aboutPageData.milestones, ...pageData.milestones, items: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">عنوان المحطة (AR)</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={m.title?.ar || ''}
                            onChange={(e) => {
                              const updated = [...itemsList];
                              updated[idx] = { ...m, title: { ...m.title, ar: e.target.value } };
                              setPageData({
                                ...pageData,
                                milestones: { ...aboutPageData.milestones, ...pageData.milestones, items: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Milestone Image */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Milestone Photo (4:3)</label>
                        <div className="flex items-center gap-3">
                          {m.image && (
                            <img
                              src={m.image}
                              alt={m.title?.en || m.year}
                              className="w-20 h-14 object-cover rounded-lg border border-slate-200 shrink-0 bg-white"
                            />
                          )}
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={m.image || ''}
                              onChange={(e) => {
                                const updated = [...itemsList];
                                updated[idx] = { ...m, image: e.target.value };
                                setPageData({
                                  ...pageData,
                                  milestones: { ...aboutPageData.milestones, ...pageData.milestones, items: updated },
                                });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                openMediaPicker((url) => {
                                  const updated = [...itemsList];
                                  updated[idx] = { ...m, image: url };
                                  setPageData({
                                    ...pageData,
                                    milestones: { ...aboutPageData.milestones, ...pageData.milestones, items: updated },
                                  });
                                }, 'image')
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0"
                            >
                              <TbPhoto className="w-3.5 h-3.5" />
                              <span>Pick R2</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Milestone Description */}
                      <RichTextEditor
                        label={`Milestone ${m.year} Description`}
                        rows={3}
                        valueEn={m.description?.en || ''}
                        valueAr={m.description?.ar || ''}
                        onChangeEn={(val) => {
                          const updated = [...itemsList];
                          updated[idx] = { ...m, description: { ...m.description, en: val } };
                          setPageData({
                            ...pageData,
                            milestones: { ...aboutPageData.milestones, ...pageData.milestones, items: updated },
                          });
                        }}
                        onChangeAr={(val) => {
                          const updated = [...itemsList];
                          updated[idx] = { ...m, description: { ...m.description, ar: val } };
                          setPageData({
                            ...pageData,
                            milestones: { ...aboutPageData.milestones, ...pageData.milestones, items: updated },
                          });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionAccordion>

          {/* ----------------------------------------------------------------- */}
          {/* Section 6: Leadership Vision / Executive Quote                    */}
          {/* ----------------------------------------------------------------- */}
          <SectionAccordion
            number={6}
            title="About Us • Leadership Vision & Executive Quote"
            description="Executive quote block, eyebrow badge, author name, role, and portrait avatar"
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eyebrow Badge (EN)</label>
                <input
                  type="text"
                  value={pageData.quote?.badge?.en ?? aboutPageData.quote.badge.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      quote: {
                        ...aboutPageData.quote,
                        ...pageData.quote,
                        badge: { ...aboutPageData.quote.badge, ...pageData.quote?.badge, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">شارة الاقتباس القيادي (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.quote?.badge?.ar ?? aboutPageData.quote.badge.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      quote: {
                        ...aboutPageData.quote,
                        ...pageData.quote,
                        badge: { ...aboutPageData.quote.badge, ...pageData.quote?.badge, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <RichTextEditor
              label="Executive Quote Text"
              rows={4}
              valueEn={pageData.quote?.quote?.en ?? aboutPageData.quote.quote.en}
              valueAr={pageData.quote?.quote?.ar ?? aboutPageData.quote.quote.ar}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  quote: {
                    ...aboutPageData.quote,
                    ...pageData.quote,
                    quote: { ...aboutPageData.quote.quote, ...pageData.quote?.quote, en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  quote: {
                    ...aboutPageData.quote,
                    ...pageData.quote,
                    quote: { ...aboutPageData.quote.quote, ...pageData.quote?.quote, ar: val },
                  },
                })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Author Name (EN)</label>
                <input
                  type="text"
                  value={pageData.quote?.author?.en ?? aboutPageData.quote.author.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      quote: {
                        ...aboutPageData.quote,
                        ...pageData.quote,
                        author: { ...aboutPageData.quote.author, ...pageData.quote?.author, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">اسم القائد / المتحدث (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.quote?.author?.ar ?? aboutPageData.quote.author.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      quote: {
                        ...aboutPageData.quote,
                        ...pageData.quote,
                        author: { ...aboutPageData.quote.author, ...pageData.quote?.author, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Author Role / Title (EN)</label>
                <input
                  type="text"
                  value={pageData.quote?.role?.en ?? aboutPageData.quote.role.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      quote: {
                        ...aboutPageData.quote,
                        ...pageData.quote,
                        role: { ...aboutPageData.quote.role, ...pageData.quote?.role, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">المنصب الوظيفي (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.quote?.role?.ar ?? aboutPageData.quote.role.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      quote: {
                        ...aboutPageData.quote,
                        ...pageData.quote,
                        role: { ...aboutPageData.quote.role, ...pageData.quote?.role, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Executive Avatar */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Executive Portrait Avatar
              </label>
              <div className="flex items-center gap-3">
                {(pageData.quote?.avatar ?? aboutPageData.quote.avatar) && (
                  <img
                    src={pageData.quote?.avatar ?? aboutPageData.quote.avatar}
                    alt="Executive avatar"
                    className="w-14 h-14 object-cover rounded-full border-2 border-persici-crimson/30 shrink-0 bg-slate-100"
                  />
                )}
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={pageData.quote?.avatar ?? aboutPageData.quote.avatar ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        quote: { ...aboutPageData.quote, ...pageData.quote, avatar: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((url) => {
                        setPageData({
                          ...pageData,
                          quote: { ...aboutPageData.quote, ...pageData.quote, avatar: url },
                        });
                      }, 'image')
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shrink-0"
                  >
                    <TbPhoto className="w-3.5 h-3.5" />
                    <span>Pick R2</span>
                  </button>
                </div>
              </div>
            </div>
          </SectionAccordion>

          {/* ----------------------------------------------------------------- */}
          {/* Section 7: Our Culture / 4-Photo Bento Mosaic                     */}
          {/* ----------------------------------------------------------------- */}
          <SectionAccordion
            number={7}
            title="About Us • Culture & Workspace 4-Photo Bento Mosaic"
            description="Asymmetric 4-photo Bento grid (1 tall portrait + 2 top landscapes + 1 wide bottom panoramic)"
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Culture Badge (EN)</label>
                <input
                  type="text"
                  value={pageData.culture?.badge?.en ?? aboutPageData.culture.badge.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      culture: {
                        ...aboutPageData.culture,
                        ...pageData.culture,
                        badge: { ...aboutPageData.culture.badge, ...pageData.culture?.badge, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">شارة الثقافة وبيئة العمل (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.culture?.badge?.ar ?? aboutPageData.culture.badge.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      culture: {
                        ...aboutPageData.culture,
                        ...pageData.culture,
                        badge: { ...aboutPageData.culture.badge, ...pageData.culture?.badge, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Culture Title (EN)</label>
                <input
                  type="text"
                  value={pageData.culture?.title?.en ?? aboutPageData.culture.title.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      culture: {
                        ...aboutPageData.culture,
                        ...pageData.culture,
                        title: { ...aboutPageData.culture.title, ...pageData.culture?.title, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان الثقافة (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.culture?.title?.ar ?? aboutPageData.culture.title.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      culture: {
                        ...aboutPageData.culture,
                        ...pageData.culture,
                        title: { ...aboutPageData.culture.title, ...pageData.culture?.title, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <RichTextEditor
              label="Culture Subtitle"
              rows={2}
              valueEn={pageData.culture?.subtitle?.en ?? aboutPageData.culture.subtitle.en}
              valueAr={pageData.culture?.subtitle?.ar ?? aboutPageData.culture.subtitle.ar}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  culture: {
                    ...aboutPageData.culture,
                    ...pageData.culture,
                    subtitle: { ...aboutPageData.culture.subtitle, ...pageData.culture?.subtitle, en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  culture: {
                    ...aboutPageData.culture,
                    ...pageData.culture,
                    subtitle: { ...aboutPageData.culture.subtitle, ...pageData.culture?.subtitle, ar: val },
                  },
                })
              }
            />

            {/* 4 Bento Photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(pageData.culture?.photos || aboutPageData.culture.photos).slice(0, 4).map((photo: any, idx: number) => {
                const photosList = [...(pageData.culture?.photos || aboutPageData.culture.photos)];
                const slotLabels = [
                  'Slot 1 • Left Tall Portrait (5 cols full height)',
                  'Slot 2 • Top-Left Collaboration (7 cols)',
                  'Slot 3 • Top-Right Engineering (5 cols)',
                  'Slot 4 • Bottom Wide Panoramic Hub (12 cols)',
                ];
                return (
                  <div key={photo.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                      <span className="text-xs font-bold text-slate-800">{slotLabels[idx] || `Photo #${idx + 1}`}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500">
                        {photo.aspect || 'mosaic'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {photo.image && (
                        <img
                          src={photo.image}
                          alt={photo.title?.en || `Culture ${idx + 1}`}
                          className="w-20 h-16 object-cover rounded-lg border border-slate-200 shrink-0 bg-white"
                        />
                      )}
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={photo.image || ''}
                          onChange={(e) => {
                            photosList[idx] = { ...photo, image: e.target.value };
                            setPageData({
                              ...pageData,
                              culture: { ...aboutPageData.culture, ...pageData.culture, photos: photosList },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            openMediaPicker((url) => {
                              photosList[idx] = { ...photo, image: url };
                              setPageData({
                                ...pageData,
                                culture: { ...aboutPageData.culture, ...pageData.culture, photos: photosList },
                              });
                            }, 'image')
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0"
                        >
                          <TbPhoto className="w-3.5 h-3.5" />
                          <span>R2</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Alt / Title (EN)</label>
                        <input
                          type="text"
                          value={photo.title?.en || ''}
                          onChange={(e) => {
                            photosList[idx] = { ...photo, title: { ...photo.title, en: e.target.value } };
                            setPageData({
                              ...pageData,
                              culture: { ...aboutPageData.culture, ...pageData.culture, photos: photosList },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">العنوان البديل (AR)</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={photo.title?.ar || ''}
                          onChange={(e) => {
                            photosList[idx] = { ...photo, title: { ...photo.title, ar: e.target.value } };
                            setPageData({
                              ...pageData,
                              culture: { ...aboutPageData.culture, ...pageData.culture, photos: photosList },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Caption (EN)</label>
                        <input
                          type="text"
                          value={photo.caption?.en || ''}
                          onChange={(e) => {
                            photosList[idx] = { ...photo, caption: { ...photo.caption, en: e.target.value } };
                            setPageData({
                              ...pageData,
                              culture: { ...aboutPageData.culture, ...pageData.culture, photos: photosList },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">الوصف المختصر (AR)</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={photo.caption?.ar || ''}
                          onChange={(e) => {
                            photosList[idx] = { ...photo, caption: { ...photo.caption, ar: e.target.value } };
                            setPageData({
                              ...pageData,
                              culture: { ...aboutPageData.culture, ...pageData.culture, photos: photosList },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionAccordion>

          {/* ----------------------------------------------------------------- */}
          {/* Section 8: Strategic Capabilities Carousel (AboutPillarsCarousel) */}
          {/* ----------------------------------------------------------------- */}
          <SectionAccordion
            number={8}
            title="About Us • Strategic Capability Pillars Carousel"
            description="Full-bleed panoramic capability cards with frosted glassmorphic overlays"
            onSave={savePage}
          >
            {/* Eyebrow & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eyebrow Badge (EN)</label>
                <input
                  type="text"
                  value={pageData.pillars?.badge?.en ?? aboutPageData.pillars.badge.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      pillars: {
                        ...aboutPageData.pillars,
                        ...pageData.pillars,
                        badge: { ...aboutPageData.pillars.badge, ...pageData.pillars?.badge, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">شارة القسم (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.pillars?.badge?.ar ?? aboutPageData.pillars.badge.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      pillars: {
                        ...aboutPageData.pillars,
                        ...pageData.pillars,
                        badge: { ...aboutPageData.pillars.badge, ...pageData.pillars?.badge, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pillars Section Title H2 (EN)</label>
                <input
                  type="text"
                  value={pageData.pillars?.title?.en ?? aboutPageData.pillars.title.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      pillars: {
                        ...aboutPageData.pillars,
                        ...pageData.pillars,
                        title: { ...aboutPageData.pillars.title, ...pageData.pillars?.title, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان الركائز الاستراتيجية (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.pillars?.title?.ar ?? aboutPageData.pillars.title.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      pillars: {
                        ...aboutPageData.pillars,
                        ...pageData.pillars,
                        title: { ...aboutPageData.pillars.title, ...pageData.pillars?.title, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <RichTextEditor
              label="Pillars Section Subtitle"
              rows={3}
              valueEn={pageData.pillars?.subtitle?.en ?? aboutPageData.pillars.subtitle.en}
              valueAr={pageData.pillars?.subtitle?.ar ?? aboutPageData.pillars.subtitle.ar}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  pillars: {
                    ...aboutPageData.pillars,
                    ...pageData.pillars,
                    subtitle: { ...aboutPageData.pillars.subtitle, ...pageData.pillars?.subtitle, en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  pillars: {
                    ...aboutPageData.pillars,
                    ...pageData.pillars,
                    subtitle: { ...aboutPageData.pillars.subtitle, ...pageData.pillars?.subtitle, ar: val },
                  },
                })
              }
            />

            {/* Pillars Items Repeater */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Panoramic Capability Cards ({(pageData.pillars?.items || aboutPageData.pillars.items).length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const existing = pageData.pillars?.items || aboutPageData.pillars.items;
                    setPageData({
                      ...pageData,
                      pillars: {
                        ...aboutPageData.pillars,
                        ...pageData.pillars,
                        items: [
                          ...existing,
                          {
                            id: `pillar-${existing.length + 1}`,
                            title: { en: 'New Strategic Capability', ar: 'قدرة استراتيجية جديدة' },
                            category: { en: 'Core Practice', ar: 'ممارسة أساسية' },
                            date: { en: 'Core Capability', ar: 'قدرة جوهرية' },
                            type: 'strategy',
                            href: '/solutions',
                            summary: { en: 'Capability description...', ar: 'وصف القدرة الاستراتيجية...' },
                            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
                          },
                        ],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Capability Card</span>
                </button>
              </div>

              <div className="space-y-4">
                {(pageData.pillars?.items || aboutPageData.pillars.items).map((pillar: any, idx: number) => {
                  const itemsList = pageData.pillars?.items || aboutPageData.pillars.items;
                  return (
                    <div key={pillar.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="text-xs font-bold text-slate-800">
                          Card #{idx + 1} • {pillar.title?.en}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const updated = [...itemsList];
                              [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                              setPageData({
                                ...pageData,
                                pillars: { ...aboutPageData.pillars, ...pageData.pillars, items: updated },
                              });
                            }}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                          >
                            <TbArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === itemsList.length - 1}
                            onClick={() => {
                              const updated = [...itemsList];
                              [updated[idx + 1], updated[idx]] = [updated[idx], updated[idx + 1]];
                              setPageData({
                                ...pageData,
                                pillars: { ...aboutPageData.pillars, ...pageData.pillars, items: updated },
                              });
                            }}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                          >
                            <TbArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = itemsList.filter((_: any, i: number) => i !== idx);
                              setPageData({
                                ...pageData,
                                pillars: { ...aboutPageData.pillars, ...pageData.pillars, items: updated },
                              });
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <TbTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Card Title (EN)</label>
                          <input
                            type="text"
                            value={pillar.title?.en || ''}
                            onChange={(e) => {
                              const updated = [...itemsList];
                              updated[idx] = { ...pillar, title: { ...pillar.title, en: e.target.value } };
                              setPageData({
                                ...pageData,
                                pillars: { ...aboutPageData.pillars, ...pageData.pillars, items: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">عنوان البطاقة (AR)</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={pillar.title?.ar || ''}
                            onChange={(e) => {
                              const updated = [...itemsList];
                              updated[idx] = { ...pillar, title: { ...pillar.title, ar: e.target.value } };
                              setPageData({
                                ...pageData,
                                pillars: { ...aboutPageData.pillars, ...pageData.pillars, items: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category Badge (EN)</label>
                          <input
                            type="text"
                            value={pillar.category?.en || ''}
                            onChange={(e) => {
                              const updated = [...itemsList];
                              updated[idx] = { ...pillar, category: { ...pillar.category, en: e.target.value } };
                              setPageData({
                                ...pageData,
                                pillars: { ...aboutPageData.pillars, ...pageData.pillars, items: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">شارة التصنيف (AR)</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={pillar.category?.ar || ''}
                            onChange={(e) => {
                              const updated = [...itemsList];
                              updated[idx] = { ...pillar, category: { ...pillar.category, ar: e.target.value } };
                              setPageData({
                                ...pageData,
                                pillars: { ...aboutPageData.pillars, ...pageData.pillars, items: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Link (href)</label>
                          <input
                            type="text"
                            value={pillar.href || ''}
                            onChange={(e) => {
                              const updated = [...itemsList];
                              updated[idx] = { ...pillar, href: e.target.value };
                              setPageData({
                                ...pageData,
                                pillars: { ...aboutPageData.pillars, ...pageData.pillars, items: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                          />
                        </div>
                      </div>

                      {/* Pillar Background Image */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Panoramic Background Image</label>
                        <div className="flex items-center gap-3">
                          {pillar.image && (
                            <img
                              src={pillar.image}
                              alt={pillar.title?.en || ''}
                              className="w-24 h-14 object-cover rounded-lg border border-slate-200 shrink-0 bg-white"
                            />
                          )}
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={pillar.image || ''}
                              onChange={(e) => {
                                const updated = [...itemsList];
                                updated[idx] = { ...pillar, image: e.target.value };
                                setPageData({
                                  ...pageData,
                                  pillars: { ...aboutPageData.pillars, ...pageData.pillars, items: updated },
                                });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                openMediaPicker((url) => {
                                  const updated = [...itemsList];
                                  updated[idx] = { ...pillar, image: url };
                                  setPageData({
                                    ...pageData,
                                    pillars: { ...aboutPageData.pillars, ...pageData.pillars, items: updated },
                                  });
                                }, 'image')
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0"
                            >
                              <TbPhoto className="w-3.5 h-3.5" />
                              <span>Pick R2</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Pillar Summary */}
                      <RichTextEditor
                        label={`Card #${idx + 1} Summary Description`}
                        rows={3}
                        valueEn={pillar.summary?.en || ''}
                        valueAr={pillar.summary?.ar || ''}
                        onChangeEn={(val) => {
                          const updated = [...itemsList];
                          updated[idx] = { ...pillar, summary: { ...pillar.summary, en: val } };
                          setPageData({
                            ...pageData,
                            pillars: { ...aboutPageData.pillars, ...pageData.pillars, items: updated },
                          });
                        }}
                        onChangeAr={(val) => {
                          const updated = [...itemsList];
                          updated[idx] = { ...pillar, summary: { ...pillar.summary, ar: val } };
                          setPageData({
                            ...pageData,
                            pillars: { ...aboutPageData.pillars, ...pageData.pillars, items: updated },
                          });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionAccordion>

          {/* ----------------------------------------------------------------- */}
          {/* Section 9: Core Principles / Values Dual Cards                    */}
          {/* ----------------------------------------------------------------- */}
          <SectionAccordion
            number={9}
            title="About Us • Core Principles & Values Dual Cards"
            description="Section header and 2 interactive value cards (How We Think & How We Work)"
            onSave={savePage}
          >
            {/* Eyebrow & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eyebrow Badge (EN)</label>
                <input
                  type="text"
                  value={pageData.values?.badge?.en ?? aboutPageData.values.badge.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      values: {
                        ...aboutPageData.values,
                        ...pageData.values,
                        badge: { ...aboutPageData.values.badge, ...pageData.values?.badge, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">شارة القيم والمبادئ (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.values?.badge?.ar ?? aboutPageData.values.badge.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      values: {
                        ...aboutPageData.values,
                        ...pageData.values,
                        badge: { ...aboutPageData.values.badge, ...pageData.values?.badge, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Values Section Title H2 (EN)</label>
                <input
                  type="text"
                  value={pageData.values?.title?.en ?? aboutPageData.values.title.en}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      values: {
                        ...aboutPageData.values,
                        ...pageData.values,
                        title: { ...aboutPageData.values.title, ...pageData.values?.title, en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان قسم القيم (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.values?.title?.ar ?? aboutPageData.values.title.ar}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      values: {
                        ...aboutPageData.values,
                        ...pageData.values,
                        title: { ...aboutPageData.values.title, ...pageData.values?.title, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <RichTextEditor
              label="Values Section Subtitle"
              rows={3}
              valueEn={pageData.values?.subtitle?.en ?? aboutPageData.values.subtitle.en}
              valueAr={pageData.values?.subtitle?.ar ?? aboutPageData.values.subtitle.ar}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  values: {
                    ...aboutPageData.values,
                    ...pageData.values,
                    subtitle: { ...aboutPageData.values.subtitle, ...pageData.values?.subtitle, en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  values: {
                    ...aboutPageData.values,
                    ...pageData.values,
                    subtitle: { ...aboutPageData.values.subtitle, ...pageData.values?.subtitle, ar: val },
                  },
                })
              }
            />

            {/* Dual Value Cards (card1 & card2) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(['card1', 'card2'] as const).map((cardKey, idx) => {
                const defaultCard = aboutPageData.values[cardKey];
                const currentCard = pageData.values?.[cardKey] || defaultCard;
                return (
                  <div key={cardKey} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="border-b border-slate-200/80 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Value Card #{idx + 1} ({currentCard.badge?.en || defaultCard.badge.en})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Card Badge (EN)</label>
                        <input
                          type="text"
                          value={currentCard.badge?.en ?? defaultCard.badge.en}
                          onChange={(e) =>
                            setPageData({
                              ...pageData,
                              values: {
                                ...aboutPageData.values,
                                ...pageData.values,
                                [cardKey]: {
                                  ...defaultCard,
                                  ...currentCard,
                                  badge: { ...defaultCard.badge, ...currentCard.badge, en: e.target.value },
                                },
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">شارة البطاقة (AR)</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={currentCard.badge?.ar ?? defaultCard.badge.ar}
                          onChange={(e) =>
                            setPageData({
                              ...pageData,
                              values: {
                                ...aboutPageData.values,
                                ...pageData.values,
                                [cardKey]: {
                                  ...defaultCard,
                                  ...currentCard,
                                  badge: { ...defaultCard.badge, ...currentCard.badge, ar: e.target.value },
                                },
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Card Title (EN)</label>
                        <input
                          type="text"
                          value={currentCard.title?.en ?? defaultCard.title.en}
                          onChange={(e) =>
                            setPageData({
                              ...pageData,
                              values: {
                                ...aboutPageData.values,
                                ...pageData.values,
                                [cardKey]: {
                                  ...defaultCard,
                                  ...currentCard,
                                  title: { ...defaultCard.title, ...currentCard.title, en: e.target.value },
                                },
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">عنوان البطاقة (AR)</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={currentCard.title?.ar ?? defaultCard.title.ar}
                          onChange={(e) =>
                            setPageData({
                              ...pageData,
                              values: {
                                ...aboutPageData.values,
                                ...pageData.values,
                                [cardKey]: {
                                  ...defaultCard,
                                  ...currentCard,
                                  title: { ...defaultCard.title, ...currentCard.title, ar: e.target.value },
                                },
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <RichTextEditor
                      label={`Card #${idx + 1} Description`}
                      rows={3}
                      valueEn={currentCard.description?.en ?? defaultCard.description.en}
                      valueAr={currentCard.description?.ar ?? defaultCard.description.ar}
                      onChangeEn={(val) =>
                        setPageData({
                          ...pageData,
                          values: {
                            ...aboutPageData.values,
                            ...pageData.values,
                            [cardKey]: {
                              ...defaultCard,
                              ...currentCard,
                              description: { ...defaultCard.description, ...currentCard.description, en: val },
                            },
                          },
                        })
                      }
                      onChangeAr={(val) =>
                        setPageData({
                          ...pageData,
                          values: {
                            ...aboutPageData.values,
                            ...pageData.values,
                            [cardKey]: {
                              ...defaultCard,
                              ...currentCard,
                              description: { ...defaultCard.description, ...currentCard.description, ar: val },
                            },
                          },
                        })
                      }
                    />

                    <CtaEditor
                      title={`Card #${idx + 1} Action CTA`}
                      cta={{
                        enabled: currentCard.cta?.enabled !== false,
                        labelEn: currentCard.cta?.en ?? defaultCard.cta.en,
                        labelAr: currentCard.cta?.ar ?? defaultCard.cta.ar,
                        href: currentCard.cta?.href ?? defaultCard.cta.href,
                      }}
                      onChange={(cta: CtaConfig) =>
                        setPageData({
                          ...pageData,
                          values: {
                            ...aboutPageData.values,
                            ...pageData.values,
                            [cardKey]: {
                              ...defaultCard,
                              ...currentCard,
                              cta: {
                                en: cta.labelEn,
                                ar: cta.labelAr,
                                href: cta.href,
                                enabled: cta.enabled,
                              },
                            },
                          },
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </SectionAccordion>

          {/* ----------------------------------------------------------------- */}
          {/* Section 10: Global Shared Contact Notice Banner                   */}
          {/* ----------------------------------------------------------------- */}
          <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <TbForms className="w-4 h-4" />
                <span>Section 10 • Global Shared Contact & Lead Form</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                The bottom contact section (&ldquo;Ready to accelerate your digital future?&rdquo; &amp; Get in Touch form) is a global component shared across all pages (Home, About Us, Services, etc.). To customize its titles, value points, animated background, partner logos, form fields, or reCAPTCHA settings, open the <strong className="text-white">Shared Contact</strong> editor.
              </p>
            </div>
            <Link
              href={`/${lang}/dashboard/shared-contact`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shrink-0 transition-colors"
            >
              <span>Edit Shared Contact</span>
              <TbChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. SOLUTIONS HUB & 9 FEATURED SOLUTION PAGES BUILDER               */}
      {/* =================================================================== */}
      {(slug === 'solutions' || isSolutionPageSlug(slug)) && (
        <SolutionsPageCmsEditor
          slug={slug}
          lang={lang}
          pageData={pageData}
          setPageData={setPageData}
          onSave={savePage}
          openMediaPicker={openMediaPicker}
        />
      )}

      {/* =================================================================== */}
      {/* 3B. INDUSTRIES HUB & 6 FEATURED INDUSTRY PAGES BUILDER             */}
      {/* =================================================================== */}
      {(slug === 'industries' || isIndustryPageSlug(slug)) && (
        <IndustriesPageCmsEditor
          slug={slug}
          lang={lang}
          pageData={pageData}
          setPageData={setPageData}
          onSave={savePage}
          openMediaPicker={openMediaPicker}
        />
      )}

      {/* =================================================================== */}
      {/* 3C. HOW WE DO IT HUB & 5 FEATURED METHODOLOGY PAGES BUILDER         */}
      {/* =================================================================== */}
      {(slug === 'how-we-do-it' || isHowWeDoItPageSlug(slug)) && (
        <HowWeDoItPageCmsEditor
          slug={slug}
          lang={lang}
          pageData={pageData}
          setPageData={setPageData}
          onSave={savePage}
          openMediaPicker={openMediaPicker}
        />
      )}

      {/* =================================================================== */}
      {/* 4. CONTACT US PAGE SECTIONS BUILDER                                */}
      {/* =================================================================== */}
      {slug === 'contact' && (
        <div className="space-y-4">
          {/* SECTION 1: HERO SECTION & QUICK ANCHOR LINKS */}
          <SectionAccordion
            number={1}
            title="ContactHeroSection • Hero Banner & Quick Anchor Links"
            description="Eyebrow badge, primary H1 headline, rich-text subtitle with alignment, and anchor navigation chips (#offices, #channels, #faqs, #contact-form)"
            isOpenDefault={true}
            onSave={savePage}
          >
            {/* Eyebrow Badge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eyebrow Badge (EN)</label>
                <input
                  type="text"
                  value={pageData.hero?.badge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        badge: { ...(pageData.hero?.badge || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">شارة القسم العلوية (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.badge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        badge: { ...(pageData.hero?.badge || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            {/* Hero Title H1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hero Title H1 (EN)</label>
                <input
                  type="text"
                  value={pageData.hero?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        title: { ...(pageData.hero?.title || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان الواجهة الرئيسي (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        title: { ...(pageData.hero?.title || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
                />
              </div>
            </div>

            {/* Hero Subtitle (RichTextEditor) */}
            <div className="pt-3">
              <RichTextEditor
                label="Hero Subtitle / Description"
                rows={3}
                valueEn={pageData.hero?.subtitle?.en || ''}
                valueAr={pageData.hero?.subtitle?.ar || ''}
                onChangeEn={(val) =>
                  setPageData({
                    ...pageData,
                    hero: {
                      ...pageData.hero,
                      subtitle: { ...(pageData.hero?.subtitle || {}), en: val },
                    },
                  })
                }
                onChangeAr={(val) =>
                  setPageData({
                    ...pageData,
                    hero: {
                      ...pageData.hero,
                      subtitle: { ...(pageData.hero?.subtitle || {}), ar: val },
                    },
                  })
                }
              />
            </div>

            {/* Quick Anchor Navigation Chips */}
            <div className="pt-4 border-t border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Quick Anchor Navigation Chips ({(pageData.hero?.quickLinks || []).length})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Fast-jump navigation buttons displayed beneath the hero subtitle
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentLinks = pageData.hero?.quickLinks || [];
                    const newLink = {
                      id: `ql-${Date.now()}`,
                      label: { en: 'New Quick Link', ar: 'رابط سريع جديد' },
                      href: '#contact-form',
                      enabled: true,
                    };
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        quickLinks: [...currentLinks, newLink],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson transition-colors cursor-pointer"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Anchor Chip</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(pageData.hero?.quickLinks || []).map((chip: ContactQuickLink, idx: number) => (
                  <div
                    key={chip.id || idx}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Chip #{idx + 1}: {chip.label?.en || 'Quick Link'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <label className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 mr-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={chip.enabled !== false}
                            onChange={(e) => {
                              const updated = [...(pageData.hero?.quickLinks || [])];
                              updated[idx] = { ...chip, enabled: e.target.checked };
                              setPageData({
                                ...pageData,
                                hero: { ...pageData.hero, quickLinks: updated },
                              });
                            }}
                            className="rounded border-slate-300 text-persici-crimson focus:ring-persici-crimson"
                          />
                          <span>Visible</span>
                        </label>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() =>
                            setPageData({
                              ...pageData,
                              hero: {
                                ...pageData.hero,
                                quickLinks: moveItem(pageData.hero?.quickLinks || [], idx, 'up'),
                              },
                            })
                          }
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                          title="Move Up"
                        >
                          <TbArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (pageData.hero?.quickLinks || []).length - 1}
                          onClick={() =>
                            setPageData({
                              ...pageData,
                              hero: {
                                ...pageData.hero,
                                quickLinks: moveItem(pageData.hero?.quickLinks || [], idx, 'down'),
                              },
                            })
                          }
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                          title="Move Down"
                        >
                          <TbArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (pageData.hero?.quickLinks || []).filter(
                              (_item: ContactQuickLink, i: number) => i !== idx
                            );
                            setPageData({
                              ...pageData,
                              hero: { ...pageData.hero, quickLinks: updated },
                            });
                          }}
                          className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600"
                          title="Delete Chip"
                        >
                          <TbTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Label (EN)
                        </label>
                        <input
                          type="text"
                          value={chip.label?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.hero?.quickLinks || [])];
                            updated[idx] = {
                              ...chip,
                              label: { ...(chip.label || {}), en: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              hero: { ...pageData.hero, quickLinks: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          التسمية (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={chip.label?.ar || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.hero?.quickLinks || [])];
                            updated[idx] = {
                              ...chip,
                              label: { ...(chip.label || {}), ar: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              hero: { ...pageData.hero, quickLinks: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Target Anchor / Href
                        </label>
                        <input
                          type="text"
                          value={chip.href || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.hero?.quickLinks || [])];
                            updated[idx] = { ...chip, href: e.target.value };
                            setPageData({
                              ...pageData,
                              hero: { ...pageData.hero, quickLinks: updated },
                            });
                          }}
                          placeholder="#offices"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionAccordion>

          {/* SECTION 2: GLOBAL OFFICES / STRATEGIC GROWTH HUBS */}
          <SectionAccordion
            number={2}
            title="ContactOfficesSection • Strategic Global Growth Hubs (Dubai, Riyadh, Amman)"
            description="Section headers, architectural hub photos, rich-text addresses, working hours, timezones, and Google Maps directions"
            onSave={savePage}
          >
            {/* Section Header Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Offices Eyebrow Badge (EN)
                </label>
                <input
                  type="text"
                  value={pageData.officesBadge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      officesBadge: { ...(pageData.officesBadge || {}), en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  شارة قسم المكاتب الإقليمية (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.officesBadge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      officesBadge: { ...(pageData.officesBadge || {}), ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Offices Section Title H2 (EN)
                </label>
                <input
                  type="text"
                  value={pageData.officesTitle?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      officesTitle: { ...(pageData.officesTitle || {}), en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم المكاتب الإقليمية (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.officesTitle?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      officesTitle: { ...(pageData.officesTitle || {}), ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
                />
              </div>
            </div>

            <div className="pt-3">
              <RichTextEditor
                label="Offices Section Subtitle"
                rows={2}
                valueEn={pageData.officesSubtitle?.en || ''}
                valueAr={pageData.officesSubtitle?.ar || ''}
                onChangeEn={(val) =>
                  setPageData({
                    ...pageData,
                    officesSubtitle: { ...(pageData.officesSubtitle || {}), en: val },
                  })
                }
                onChangeAr={(val) =>
                  setPageData({
                    ...pageData,
                    officesSubtitle: { ...(pageData.officesSubtitle || {}), ar: val },
                  })
                }
              />
            </div>

            {/* Offices Repeater */}
            <div className="pt-4 border-t border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Global Office Hubs ({(pageData.offices || []).length})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Manage regional headquarters, addresses, operational hours, and map coordinates
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = pageData.offices || [];
                    const newOffice = {
                      id: `office-${Date.now()}`,
                      city: { en: 'New City', ar: 'مدينة جديدة' },
                      country: { en: 'Country', ar: 'الدولة' },
                      badge: { en: 'Regional Hub', ar: 'مركز إقليمي' },
                      isHQ: false,
                      address: { en: 'Business District, Tower 1', ar: 'المنطقة التجارية، برج 1' },
                      email: 'dubai@persiciagency.com',
                      phone: '+971 4 000 0000',
                      hours: { en: 'Mon – Fri, 9:00 AM – 5:00 PM', ar: 'الإثنين – الجمعة، 9:00 ص – 5:00 م' },
                      timezone: 'UTC+3',
                      mapsUrl: 'https://maps.google.com',
                      directionsLabel: { en: 'Get Directions', ar: 'الاتجاهات عبر خرائط جوجل' },
                      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
                    };
                    setPageData({ ...pageData, offices: [...current, newOffice] });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson transition-colors cursor-pointer"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Office Hub</span>
                </button>
              </div>

              {(pageData.offices || []).map((office: ContactOfficeItem, idx: number) => (
                <div
                  key={office.id || idx}
                  className="p-4 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-persici-crimson/10 text-persici-crimson text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <TbMapPin className="w-4 h-4 text-persici-crimson" />
                      <span className="text-xs font-bold text-slate-900">
                        {office.city?.en || 'City'} — {office.country?.en || 'Country'}
                      </span>
                      {office.isHQ && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-persici-crimson text-white px-2.5 py-0.5 rounded-full">
                          HQ Badge Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 mr-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(office.isHQ)}
                          onChange={(e) => {
                            const updated = [...(pageData.offices || [])];
                            updated[idx] = { ...office, isHQ: e.target.checked };
                            setPageData({ ...pageData, offices: updated });
                          }}
                          className="rounded border-slate-300 text-persici-crimson focus:ring-persici-crimson"
                        />
                        <span>Highlight as HQ</span>
                      </label>

                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() =>
                          setPageData({
                            ...pageData,
                            offices: moveItem(pageData.offices || [], idx, 'up'),
                          })
                        }
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                        title="Move Up"
                      >
                        <TbArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (pageData.offices || []).length - 1}
                        onClick={() =>
                          setPageData({
                            ...pageData,
                            offices: moveItem(pageData.offices || [], idx, 'down'),
                          })
                        }
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                        title="Move Down"
                      >
                        <TbArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (pageData.offices || []).filter(
                            (_item: ContactOfficeItem, i: number) => i !== idx
                          );
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                        title="Delete Office"
                      >
                        <TbTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Row 1: City, Country, Role Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        City Name (EN)
                      </label>
                      <input
                        type="text"
                        value={office.city?.en || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = {
                            ...office,
                            city: { ...(office.city || {}), en: e.target.value },
                          };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        اسم المدينة (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={office.city?.ar || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = {
                            ...office,
                            city: { ...(office.city || {}), ar: e.target.value },
                          };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-semibold font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Timezone Badge (e.g. UTC+3)
                      </label>
                      <input
                        type="text"
                        value={office.timezone || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = { ...office, timezone: e.target.value };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Country (EN)
                      </label>
                      <input
                        type="text"
                        value={office.country?.en || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = {
                            ...office,
                            country: { ...(office.country || {}), en: e.target.value },
                          };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        الدولة (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={office.country?.ar || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = {
                            ...office,
                            country: { ...(office.country || {}), ar: e.target.value },
                          };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Hub Role Badge (EN)
                      </label>
                      <input
                        type="text"
                        value={office.badge?.en || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = {
                            ...office,
                            badge: { ...(office.badge || {}), en: e.target.value },
                          };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        شارة المركز الإقليمي (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={office.badge?.ar || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = {
                            ...office,
                            badge: { ...(office.badge || {}), ar: e.target.value },
                          };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                  </div>

                  {/* Row 2: RichText Address (EN / AR) */}
                  <RichTextEditor
                    label={`Office #${idx + 1} Full Address`}
                    rows={2}
                    valueEn={office.address?.en || ''}
                    valueAr={office.address?.ar || ''}
                    onChangeEn={(val) => {
                      const updated = [...(pageData.offices || [])];
                      updated[idx] = {
                        ...office,
                        address: { ...(office.address || {}), en: val },
                      };
                      setPageData({ ...pageData, offices: updated });
                    }}
                    onChangeAr={(val) => {
                      const updated = [...(pageData.offices || [])];
                      updated[idx] = {
                        ...office,
                        address: { ...(office.address || {}), ar: val },
                      };
                      setPageData({ ...pageData, offices: updated });
                    }}
                  />

                  {/* Row 3: Working Hours (EN / AR), Direct Email, Direct Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Working Hours (EN)
                      </label>
                      <input
                        type="text"
                        value={office.hours?.en || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = {
                            ...office,
                            hours: { ...(office.hours || {}), en: e.target.value },
                          };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        ساعات العمل (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={office.hours?.ar || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = {
                            ...office,
                            hours: { ...(office.hours || {}), ar: e.target.value },
                          };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Direct Hub Email
                      </label>
                      <input
                        type="text"
                        value={office.email || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = { ...office, email: e.target.value };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Direct Hub Phone
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={office.phone || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = { ...office, phone: e.target.value };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 4: Google Maps URL, Directions Button Labels, and Architectural Image */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Google Maps URL
                      </label>
                      <input
                        type="text"
                        value={office.mapsUrl || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = { ...office, mapsUrl: e.target.value };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Directions Button Text (EN)
                      </label>
                      <input
                        type="text"
                        value={office.directionsLabel?.en || 'Get Directions'}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = {
                            ...office,
                            directionsLabel: {
                              ...(office.directionsLabel || { en: 'Get Directions', ar: 'الاتجاهات عبر خرائط جوجل' }),
                              en: e.target.value,
                            },
                          };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        نص زر الاتجاهات (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={office.directionsLabel?.ar || 'الاتجاهات عبر خرائط جوجل'}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = {
                            ...office,
                            directionsLabel: {
                              ...(office.directionsLabel || { en: 'Get Directions', ar: 'الاتجاهات عبر خرائط جوجل' }),
                              ar: e.target.value,
                            },
                          };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Office Photo URL (Cloudflare R2)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={office.image || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.offices || [])];
                            updated[idx] = { ...office, image: e.target.value };
                            setPageData({ ...pageData, offices: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            openMediaPicker((url) => {
                              const updated = [...(pageData.offices || [])];
                              updated[idx] = { ...office, image: url };
                              setPageData({ ...pageData, offices: updated });
                            }, 'image');
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                        >
                          Pick R2
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionAccordion>

          {/* SECTION 3: DIRECT INQUIRY CHANNELS */}
          <SectionAccordion
            number={3}
            title="ContactDirectChannelsSection • Direct Department & SLA Channels"
            description="Dedicated executive routing cards for New Business & RFPs, Strategic Partnerships, Careers, and Media & Press"
            onSave={savePage}
          >
            {/* Section Header Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Channels Eyebrow Badge (EN)
                </label>
                <input
                  type="text"
                  value={pageData.channelsBadge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      channelsBadge: { ...(pageData.channelsBadge || {}), en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  شارة قنوات التواصل المباشر (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.channelsBadge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      channelsBadge: { ...(pageData.channelsBadge || {}), ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Channels Section Title H2 (EN)
                </label>
                <input
                  type="text"
                  value={pageData.channelsTitle?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      channelsTitle: { ...(pageData.channelsTitle || {}), en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم قنوات التواصل المباشر (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.channelsTitle?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      channelsTitle: { ...(pageData.channelsTitle || {}), ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
                />
              </div>
            </div>

            <div className="pt-3">
              <RichTextEditor
                label="Channels Section Subtitle"
                rows={2}
                valueEn={pageData.channelsSubtitle?.en || ''}
                valueAr={pageData.channelsSubtitle?.ar || ''}
                onChangeEn={(val) =>
                  setPageData({
                    ...pageData,
                    channelsSubtitle: { ...(pageData.channelsSubtitle || {}), en: val },
                  })
                }
                onChangeAr={(val) =>
                  setPageData({
                    ...pageData,
                    channelsSubtitle: { ...(pageData.channelsSubtitle || {}), ar: val },
                  })
                }
              />
            </div>

            {/* Direct Channels Repeater */}
            <div className="pt-4 border-t border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Direct Department Channels ({(pageData.channels || []).length})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Each card displays a category badge, title, rich-text description, direct email desk, and SLA response badge
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = pageData.channels || [];
                    const newChannel = {
                      id: `channel-${Date.now()}`,
                      category: { en: 'Department Desk', ar: 'مكتب مختص' },
                      title: { en: 'New Inquiry Channel', ar: 'قناة تواصل جديدة' },
                      description: {
                        en: 'Direct routing for specialized inquiries and executive requests.',
                        ar: 'توجيه مباشر للاستفسارات المتخصصة والطلبات التنفيذية.',
                      },
                      email: 'growth@persiciagency.com',
                      sla: { en: 'Response within 24 hours', ar: 'الرد خلال 24 ساعة عمل' },
                    };
                    setPageData({ ...pageData, channels: [...current, newChannel] });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson transition-colors cursor-pointer"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Direct Channel</span>
                </button>
              </div>

              {(pageData.channels || []).map((channel: ContactChannelItem, idx: number) => (
                <div
                  key={channel.id || idx}
                  className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {channel.title?.en || 'Channel'} ({channel.email || 'email'})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() =>
                          setPageData({
                            ...pageData,
                            channels: moveItem(pageData.channels || [], idx, 'up'),
                          })
                        }
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                        title="Move Up"
                      >
                        <TbArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (pageData.channels || []).length - 1}
                        onClick={() =>
                          setPageData({
                            ...pageData,
                            channels: moveItem(pageData.channels || [], idx, 'down'),
                          })
                        }
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                        title="Move Down"
                      >
                        <TbArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (pageData.channels || []).filter(
                            (_item: ContactChannelItem, i: number) => i !== idx
                          );
                          setPageData({ ...pageData, channels: updated });
                        }}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                        title="Delete Channel"
                      >
                        <TbTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Row 1: Category Badge & Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Category Badge (EN)
                      </label>
                      <input
                        type="text"
                        value={channel.category?.en || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.channels || [])];
                          updated[idx] = {
                            ...channel,
                            category: { ...(channel.category || {}), en: e.target.value },
                          };
                          setPageData({ ...pageData, channels: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        شارة الفئة (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={channel.category?.ar || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.channels || [])];
                          updated[idx] = {
                            ...channel,
                            category: { ...(channel.category || {}), ar: e.target.value },
                          };
                          setPageData({ ...pageData, channels: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Channel Title (EN)
                      </label>
                      <input
                        type="text"
                        value={channel.title?.en || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.channels || [])];
                          updated[idx] = {
                            ...channel,
                            title: { ...(channel.title || {}), en: e.target.value },
                          };
                          setPageData({ ...pageData, channels: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        عنوان القناة (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={channel.title?.ar || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.channels || [])];
                          updated[idx] = {
                            ...channel,
                            title: { ...(channel.title || {}), ar: e.target.value },
                          };
                          setPageData({ ...pageData, channels: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-semibold font-arabic"
                      />
                    </div>
                  </div>

                  {/* Row 2: RichText Description */}
                  <RichTextEditor
                    label={`Channel #${idx + 1} Description`}
                    rows={2}
                    valueEn={channel.description?.en || ''}
                    valueAr={channel.description?.ar || ''}
                    onChangeEn={(val) => {
                      const updated = [...(pageData.channels || [])];
                      updated[idx] = {
                        ...channel,
                        description: { ...(channel.description || {}), en: val },
                      };
                      setPageData({ ...pageData, channels: updated });
                    }}
                    onChangeAr={(val) => {
                      const updated = [...(pageData.channels || [])];
                      updated[idx] = {
                        ...channel,
                        description: { ...(channel.description || {}), ar: val },
                      };
                      setPageData({ ...pageData, channels: updated });
                    }}
                  />

                  {/* Row 3: Direct Email & SLA Commitment */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Direct Routing Email
                      </label>
                      <input
                        type="text"
                        value={channel.email || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.channels || [])];
                          updated[idx] = { ...channel, email: e.target.value };
                          setPageData({ ...pageData, channels: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        SLA Commitment Badge (EN)
                      </label>
                      <input
                        type="text"
                        value={channel.sla?.en || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.channels || [])];
                          updated[idx] = {
                            ...channel,
                            sla: { ...(channel.sla || {}), en: e.target.value },
                          };
                          setPageData({ ...pageData, channels: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        التزام سرعة الاستجابة SLA (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={channel.sla?.ar || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.channels || [])];
                          updated[idx] = {
                            ...channel,
                            sla: { ...(channel.sla || {}), ar: e.target.value },
                          };
                          setPageData({ ...pageData, channels: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionAccordion>

          {/* SECTION 4: PRE-ENGAGEMENT FAQ ACCORDION */}
          <SectionAccordion
            number={4}
            title="ContactFaqSection • Pre-Engagement FAQ Accordion"
            description="Section headline, subtitle, and expandable Q&A items answering executive pre-engagement questions"
            onSave={savePage}
          >
            {/* FAQ Section Headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  FAQ Section Title H2 (EN)
                </label>
                <input
                  type="text"
                  value={pageData.faqsTitle?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      faqsTitle: { ...(pageData.faqsTitle || {}), en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم الأسئلة الشائعة (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.faqsTitle?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      faqsTitle: { ...(pageData.faqsTitle || {}), ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
                />
              </div>
            </div>

            <div className="pt-3">
              <RichTextEditor
                label="FAQ Section Subtitle"
                rows={2}
                valueEn={pageData.faqsSubtitle?.en || ''}
                valueAr={pageData.faqsSubtitle?.ar || ''}
                onChangeEn={(val) =>
                  setPageData({
                    ...pageData,
                    faqsSubtitle: { ...(pageData.faqsSubtitle || {}), en: val },
                  })
                }
                onChangeAr={(val) =>
                  setPageData({
                    ...pageData,
                    faqsSubtitle: { ...(pageData.faqsSubtitle || {}), ar: val },
                  })
                }
              />
            </div>

            {/* FAQ Items Repeater */}
            <div className="pt-4 border-t border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Pre-Engagement FAQ Items ({(pageData.faqs || []).length})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Add, reorder, or edit questions and rich-text answers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentItems = pageData.faqs || [];
                    const newFaq = {
                      id: `faq-${Date.now()}`,
                      question: {
                        en: 'New Frequently Asked Question?',
                        ar: 'سؤال جديد من الأسئلة الشائعة؟',
                      },
                      answer: {
                        en: 'Provide a clear, executive-level answer here.',
                        ar: 'أضف إجابة واضحة ومفصلة هنا.',
                      },
                    };
                    setPageData({
                      ...pageData,
                      faqs: [...currentItems, newFaq],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-persici-crimson transition-colors cursor-pointer"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add FAQ Item</span>
                </button>
              </div>

              {(pageData.faqs || []).map((faq: ContactFaqItem, idx: number) => (
                <div
                  key={faq.id || idx}
                  className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-persici-crimson/10 text-persici-crimson text-xs font-bold flex items-center justify-center">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">
                        {faq.question?.en || 'Question'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() =>
                          setPageData({
                            ...pageData,
                            faqs: moveItem(pageData.faqs || [], idx, 'up'),
                          })
                        }
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                        title="Move Up"
                      >
                        <TbArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (pageData.faqs || []).length - 1}
                        onClick={() =>
                          setPageData({
                            ...pageData,
                            faqs: moveItem(pageData.faqs || [], idx, 'down'),
                          })
                        }
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                        title="Move Down"
                      >
                        <TbArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (pageData.faqs || []).filter(
                            (_item: ContactFaqItem, i: number) => i !== idx
                          );
                          setPageData({
                            ...pageData,
                            faqs: updated,
                          });
                        }}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                        title="Delete FAQ"
                      >
                        <TbTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Question (EN)
                      </label>
                      <input
                        type="text"
                        value={faq.question?.en || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.faqs || [])];
                          updated[idx] = {
                            ...faq,
                            question: { ...(faq.question || {}), en: e.target.value },
                          };
                          setPageData({
                            ...pageData,
                            faqs: updated,
                          });
                        }}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        السؤال (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={faq.question?.ar || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.faqs || [])];
                          updated[idx] = {
                            ...faq,
                            question: { ...(faq.question || {}), ar: e.target.value },
                          };
                          setPageData({
                            ...pageData,
                            faqs: updated,
                          });
                        }}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-semibold font-arabic"
                      />
                    </div>
                  </div>

                  <RichTextEditor
                    label={`FAQ #${idx + 1} Answer`}
                    rows={3}
                    valueEn={faq.answer?.en || ''}
                    valueAr={faq.answer?.ar || ''}
                    onChangeEn={(val) => {
                      const updated = [...(pageData.faqs || [])];
                      updated[idx] = {
                        ...faq,
                        answer: { ...(faq.answer || {}), en: val },
                      };
                      setPageData({
                        ...pageData,
                        faqs: updated,
                      });
                    }}
                    onChangeAr={(val) => {
                      const updated = [...(pageData.faqs || [])];
                      updated[idx] = {
                        ...faq,
                        answer: { ...(faq.answer || {}), ar: val },
                      };
                      setPageData({
                        ...pageData,
                        faqs: updated,
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </SectionAccordion>

          {/* SECTION 5: SHARED EXECUTIVE CONTACT FORM NOTICE */}
          <SectionAccordion
            number={5}
            title="HomeContactSection • Shared Executive Inquiry Form (#contact-form)"
            description="Global conversion form shared across Home, About Us, Solutions, Case Studies, and Contact Us"
            onSave={savePage}
          >
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-persici-crimson">
                  <span>Global Shared Section</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Executive Lead Capture & Contact Form (#contact-form)
                </h4>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  The interactive executive inquiry form at the bottom of the Contact Us page is synchronized globally across Home, About Us, Solutions, Case Studies, and Contact Us. Edit its headline, service scope pills, budget tiers, form labels, and contact details from the dedicated Shared Contact Form manager.
                </p>
              </div>
              <Link
                href={`/${lang}/dashboard/shared-contact`}
                className="px-4 py-2.5 rounded-xl bg-persici-crimson hover:bg-red-600 text-white text-xs font-bold tracking-wide transition-colors shrink-0"
              >
                Edit Shared Contact Form →
              </Link>
            </div>
          </SectionAccordion>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. CLIENT STORIES HUB PAGE EDITOR (/client-stories)                 */}
      {/* =================================================================== */}
      {slug === 'client-stories' && (
        <div className="space-y-4">
          {/* SECTION 1: HERO BANNER */}
          <SectionAccordion
            number={1}
            title="ClientStoriesHeroSection • Hero Banner & CTAs"
            description="Top badge, main headline + crimson highlight phrase, rich-text subtitle, and action buttons"
            isOpenDefault={true}
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Hero Badge (EN)
                </label>
                <input
                  type="text"
                  value={pageData.hero?.badge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        badge: { ...(pageData.hero?.badge || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  شارة الهيرو (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.badge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        badge: { ...(pageData.hero?.badge || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Main Headline (EN)
                </label>
                <input
                  type="text"
                  value={pageData.hero?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        title: { ...(pageData.hero?.title || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  العنوان الرئيسي (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        title: { ...(pageData.hero?.title || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-persici-crimson uppercase mb-1">
                  Highlighted Crimson Phrase (EN)
                </label>
                <input
                  type="text"
                  value={pageData.hero?.titleHighlight?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        titleHighlight: {
                          ...(pageData.hero?.titleHighlight || {}),
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-red-200 rounded-xl bg-red-50/20 font-semibold text-persici-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-persici-crimson uppercase mb-1">
                  العبارة المميزة باللون القرمزي (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.titleHighlight?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        titleHighlight: {
                          ...(pageData.hero?.titleHighlight || {}),
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-red-200 rounded-xl bg-red-50/20 font-semibold text-persici-crimson font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Hero Subtitle / Description"
              rows={3}
              valueEn={pageData.hero?.subtitle?.en || ''}
              valueAr={pageData.hero?.subtitle?.ar || ''}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  hero: {
                    ...pageData.hero,
                    subtitle: { ...(pageData.hero?.subtitle || {}), en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  hero: {
                    ...pageData.hero,
                    subtitle: { ...(pageData.hero?.subtitle || {}), ar: val },
                  },
                })
              }
            />

            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Primary Button Label (EN)
                </label>
                <input
                  type="text"
                  value={pageData.hero?.primaryCtaLabel?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        primaryCtaLabel: {
                          ...(pageData.hero?.primaryCtaLabel || {}),
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  نص الزر الأساسي (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.primaryCtaLabel?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        primaryCtaLabel: {
                          ...(pageData.hero?.primaryCtaLabel || {}),
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Primary Button Link / Anchor
                </label>
                <input
                  type="text"
                  value={pageData.hero?.primaryCtaHref || '#explore'}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        primaryCtaHref: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Secondary Button Label (EN)
                </label>
                <input
                  type="text"
                  value={pageData.hero?.secondaryCtaLabel?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        secondaryCtaLabel: {
                          ...(pageData.hero?.secondaryCtaLabel || {}),
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  نص الزر الثانوي (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.secondaryCtaLabel?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        secondaryCtaLabel: {
                          ...(pageData.hero?.secondaryCtaLabel || {}),
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Secondary Button Link / Anchor
                </label>
                <input
                  type="text"
                  value={pageData.hero?.secondaryCtaHref || '#contact'}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        secondaryCtaHref: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                />
              </div>
            </div>
          </SectionAccordion>

          {/* SECTION 2: FEATURED STORIES SECTION HEADER */}
          <SectionAccordion
            number={2}
            title="FeaturedClientStories • Featured Stories Section Header"
            description="Section badge, title, rich-text subtitle, and CTA label for the stacked featured client stories"
            onSave={savePage}
          >
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <span>Dynamic Data Source</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Featured Client Stories Cards (Synced from Client Stories Tab)
                </h4>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  The individual client story cards displayed in this stacked section are pulled dynamically from the <strong>Client Stories</strong> tab for all stories marked as <strong>Featured</strong>. Below you can edit the section badge, title, description, and card CTA text.
                </p>
              </div>
              <Link
                href={`/${lang}/dashboard/content/projects`}
                className="px-4 py-2.5 rounded-xl bg-persici-crimson hover:bg-red-600 text-white text-xs font-bold tracking-wide transition-colors shrink-0"
              >
                Manage Featured Stories →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Section Badge (EN)
                </label>
                <input
                  type="text"
                  value={pageData.featuredSection?.badge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      featuredSection: {
                        ...pageData.featuredSection,
                        badge: { ...(pageData.featuredSection?.badge || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  شارة قسم القصص المختارة (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.featuredSection?.badge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      featuredSection: {
                        ...pageData.featuredSection,
                        badge: { ...(pageData.featuredSection?.badge || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Section Title (EN)
                </label>
                <input
                  type="text"
                  value={pageData.featuredSection?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      featuredSection: {
                        ...pageData.featuredSection,
                        title: { ...(pageData.featuredSection?.title || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم القصص المختارة (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.featuredSection?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      featuredSection: {
                        ...pageData.featuredSection,
                        title: { ...(pageData.featuredSection?.title || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Featured Stories Section Subtitle / Description"
              rows={2}
              valueEn={pageData.featuredSection?.subtitle?.en || ''}
              valueAr={pageData.featuredSection?.subtitle?.ar || ''}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  featuredSection: {
                    ...pageData.featuredSection,
                    subtitle: { ...(pageData.featuredSection?.subtitle || {}), en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  featuredSection: {
                    ...pageData.featuredSection,
                    subtitle: { ...(pageData.featuredSection?.subtitle || {}), ar: val },
                  },
                })
              }
            />

            <div className="pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Featured Card CTA Button Label (EN)
                </label>
                <input
                  type="text"
                  value={pageData.featuredSection?.ctaLabel?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      featuredSection: {
                        ...pageData.featuredSection,
                        ctaLabel: {
                          ...(pageData.featuredSection?.ctaLabel || {}),
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  نص زر استكشاف القصة (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.featuredSection?.ctaLabel?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      featuredSection: {
                        ...pageData.featuredSection,
                        ctaLabel: {
                          ...(pageData.featuredSection?.ctaLabel || {}),
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
            </div>
          </SectionAccordion>

          {/* SECTION 3: ALL STORIES & CATEGORY FILTER SECTION */}
          <SectionAccordion
            number={3}
            title="ClientStoriesInfiniteGrid • All Client Stories & Category Filters (#explore)"
            description="Section badge, title, rich-text subtitle, category filter pill labels, and empty state message"
            onSave={savePage}
          >
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <span>Infinite Grid Catalog</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  All Client Stories Grid (Synced from Client Stories Tab)
                </h4>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  All active client stories in the infinite-scrolling 3-column grid are loaded dynamically from the <strong>Client Stories</strong> tab. Below you can edit this section&apos;s header, subtitle, category filter tab labels, and empty state text.
                </p>
              </div>
              <Link
                href={`/${lang}/dashboard/content/projects`}
                className="px-4 py-2.5 rounded-xl bg-persici-crimson hover:bg-red-600 text-white text-xs font-bold tracking-wide transition-colors shrink-0"
              >
                Open Client Stories Tab →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Section Badge (EN)
                </label>
                <input
                  type="text"
                  value={pageData.allStoriesSection?.badge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      allStoriesSection: {
                        ...pageData.allStoriesSection,
                        badge: { ...(pageData.allStoriesSection?.badge || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  شارة قسم جميع القصص (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.allStoriesSection?.badge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      allStoriesSection: {
                        ...pageData.allStoriesSection,
                        badge: { ...(pageData.allStoriesSection?.badge || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Section Title (EN)
                </label>
                <input
                  type="text"
                  value={pageData.allStoriesSection?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      allStoriesSection: {
                        ...pageData.allStoriesSection,
                        title: { ...(pageData.allStoriesSection?.title || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم جميع القصص (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.allStoriesSection?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      allStoriesSection: {
                        ...pageData.allStoriesSection,
                        title: { ...(pageData.allStoriesSection?.title || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="All Client Stories Section Subtitle / Description"
              rows={2}
              valueEn={pageData.allStoriesSection?.subtitle?.en || ''}
              valueAr={pageData.allStoriesSection?.subtitle?.ar || ''}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  allStoriesSection: {
                    ...pageData.allStoriesSection,
                    subtitle: { ...(pageData.allStoriesSection?.subtitle || {}), en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  allStoriesSection: {
                    ...pageData.allStoriesSection,
                    subtitle: { ...(pageData.allStoriesSection?.subtitle || {}), ar: val },
                  },
                })
              }
            />

            {/* Category Filter Pills Labels */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Category Filter Bar Pills ({(pageData.allStoriesSection?.categories || []).length})
              </span>

              <div className="grid grid-cols-1 gap-3">
                {(
                  (pageData.allStoriesSection?.categories ||
                    clientStoriesHubPageData.allStoriesSection.categories) as ClientStoriesHubCategoryFilter[]
                ).map((cat, idx) => (
                  <div
                    key={cat.slug || idx}
                    className="p-3 bg-white border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                  >
                    <div className="md:col-span-3">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">
                        slug: {cat.slug}
                      </span>
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Filter Pill Label (EN)
                      </label>
                      <input
                        type="text"
                        value={cat.label?.en || ''}
                        onChange={(e) => {
                          const updated = [
                            ...(pageData.allStoriesSection?.categories ||
                              clientStoriesHubPageData.allStoriesSection.categories),
                          ];
                          updated[idx] = {
                            ...cat,
                            label: { ...(cat.label || {}), en: e.target.value },
                          };
                          setPageData({
                            ...pageData,
                            allStoriesSection: {
                              ...pageData.allStoriesSection,
                              categories: updated,
                            },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        اسم التصنيف (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={cat.label?.ar || ''}
                        onChange={(e) => {
                          const updated = [
                            ...(pageData.allStoriesSection?.categories ||
                              clientStoriesHubPageData.allStoriesSection.categories),
                          ];
                          updated[idx] = {
                            ...cat,
                            label: { ...(cat.label || {}), ar: e.target.value },
                          };
                          setPageData({
                            ...pageData,
                            allStoriesSection: {
                              ...pageData.allStoriesSection,
                              categories: updated,
                            },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State Labels */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Empty Category State Title (EN)
                </label>
                <input
                  type="text"
                  value={pageData.allStoriesSection?.emptyTitle?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      allStoriesSection: {
                        ...pageData.allStoriesSection,
                        emptyTitle: {
                          ...(pageData.allStoriesSection?.emptyTitle || {}),
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  عنوان حالة عدم وجود قصص (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.allStoriesSection?.emptyTitle?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      allStoriesSection: {
                        ...pageData.allStoriesSection,
                        emptyTitle: {
                          ...(pageData.allStoriesSection?.emptyTitle || {}),
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Empty Category State Subtitle (EN)
                </label>
                <input
                  type="text"
                  value={pageData.allStoriesSection?.emptySubtitle?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      allStoriesSection: {
                        ...pageData.allStoriesSection,
                        emptySubtitle: {
                          ...(pageData.allStoriesSection?.emptySubtitle || {}),
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  وصف حالة عدم وجود قصص (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.allStoriesSection?.emptySubtitle?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      allStoriesSection: {
                        ...pageData.allStoriesSection,
                        emptySubtitle: {
                          ...(pageData.allStoriesSection?.emptySubtitle || {}),
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                />
              </div>
            </div>
          </SectionAccordion>

          {/* SECTION 4: SHARED EXECUTIVE CONTACT FORM NOTICE */}
          <SectionAccordion
            number={4}
            title="HomeContactSection • Shared Executive Inquiry Form (#contact)"
            description="Global conversion form rendered at the bottom of the Client Stories Hub page"
            onSave={savePage}
          >
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-persici-crimson">
                  <span>Global Shared Section</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Executive Lead Capture & Contact Form (#contact)
                </h4>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  The interactive executive inquiry form at the bottom of the Client Stories Hub page is synchronized globally across Home, About Us, Solutions, Client Stories, and Contact Us.
                </p>
              </div>
              <Link
                href={`/${lang}/dashboard/shared-contact`}
                className="px-4 py-2.5 rounded-xl bg-persici-crimson hover:bg-red-600 text-white text-xs font-bold tracking-wide transition-colors shrink-0"
              >
                Edit Shared Contact Form →
              </Link>
            </div>
          </SectionAccordion>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5B. CAREERS HUB PAGE BUILDER (7 SECTIONS)                           */}
      {/* =================================================================== */}
      {slug === 'careers' && (
        <div className="space-y-4">
          {/* SECTION 1: HERO BANNER, CTAs & IMPACT STATS */}
          <SectionAccordion
            number={1}
            title="CareersHeroSection • Hero Banner, CTAs & Impact Stats"
            description="Top badge, main headline, rich-text mission narrative, dual CTA buttons, and 4 animated stat counters"
            isOpenDefault={true}
            onSave={savePage}
          >
            {/* Section Visibility Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display Hero Banner Section on Live Page
                </span>
                <span className="text-[11px] text-slate-500">
                  Toggle visibility of the top Careers Hero & Stats section on /[lang]/careers
                </span>
              </div>
              <input
                type="checkbox"
                checked={pageData.hero?.enabled !== false}
                onChange={(e) =>
                  setPageData({
                    ...pageData,
                    hero: { ...pageData.hero, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Hero Badge Pill (English)
                </label>
                <input
                  type="text"
                  value={pageData.hero?.badge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        badge: { ...(pageData.hero?.badge || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  شارة البانر العلوي (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.badge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        badge: { ...(pageData.hero?.badge || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Hero Master Title (English)
                </label>
                <input
                  type="text"
                  value={pageData.hero?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        title: { ...(pageData.hero?.title || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  العنوان الرئيسي (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: {
                        ...pageData.hero,
                        title: { ...(pageData.hero?.title || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Hero Description Narrative"
              valueEn={pageData.hero?.description?.en || ''}
              valueAr={pageData.hero?.description?.ar || ''}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  hero: {
                    ...pageData.hero,
                    description: { ...(pageData.hero?.description || {}), en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  hero: {
                    ...pageData.hero,
                    description: { ...(pageData.hero?.description || {}), ar: val },
                  },
                })
              }
              helperText="Supports rich formatting, alignment, bolding, and links"
            />

            {/* Hero Primary & Secondary CTA Buttons */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-700">
                    Primary CTA Button (#open-positions)
                  </span>
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pageData.hero?.primaryCta?.enabled !== false}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...pageData.hero,
                            primaryCta: {
                              ...(pageData.hero?.primaryCta || {}),
                              enabled: e.target.checked,
                            },
                          },
                        })
                      }
                      className="accent-persici-crimson rounded"
                    />
                    <span>Show</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Button Text (EN)
                    </label>
                    <input
                      type="text"
                      value={pageData.hero?.primaryCta?.text?.en || ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...pageData.hero,
                            primaryCta: {
                              ...(pageData.hero?.primaryCta || {}),
                              text: {
                                ...(pageData.hero?.primaryCta?.text || {}),
                                en: e.target.value,
                              },
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      نص الزر (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={pageData.hero?.primaryCta?.text?.ar || ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...pageData.hero,
                            primaryCta: {
                              ...(pageData.hero?.primaryCta || {}),
                              text: {
                                ...(pageData.hero?.primaryCta?.text || {}),
                                ar: e.target.value,
                              },
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Target Anchor / URL
                  </label>
                  <input
                    type="text"
                    value={pageData.hero?.primaryCta?.href || '#open-positions'}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        hero: {
                          ...pageData.hero,
                          primaryCta: {
                            ...(pageData.hero?.primaryCta || {}),
                            href: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-700">
                    Secondary CTA Button (#culture)
                  </span>
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pageData.hero?.secondaryCta?.enabled !== false}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...pageData.hero,
                            secondaryCta: {
                              ...(pageData.hero?.secondaryCta || {}),
                              enabled: e.target.checked,
                            },
                          },
                        })
                      }
                      className="accent-persici-crimson rounded"
                    />
                    <span>Show</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Button Text (EN)
                    </label>
                    <input
                      type="text"
                      value={pageData.hero?.secondaryCta?.text?.en || ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...pageData.hero,
                            secondaryCta: {
                              ...(pageData.hero?.secondaryCta || {}),
                              text: {
                                ...(pageData.hero?.secondaryCta?.text || {}),
                                en: e.target.value,
                              },
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      نص الزر (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={pageData.hero?.secondaryCta?.text?.ar || ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...pageData.hero,
                            secondaryCta: {
                              ...(pageData.hero?.secondaryCta || {}),
                              text: {
                                ...(pageData.hero?.secondaryCta?.text || {}),
                                ar: e.target.value,
                              },
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Target Anchor / URL
                  </label>
                  <input
                    type="text"
                    value={pageData.hero?.secondaryCta?.href || '#culture'}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        hero: {
                          ...pageData.hero,
                          secondaryCta: {
                            ...(pageData.hero?.secondaryCta || {}),
                            href: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 4 Impact Stat Counters Repeater */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Hero Animated Impact Stats Strip ({(pageData.hero?.stats || []).length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const current = Array.isArray(pageData.hero?.stats)
                      ? [...pageData.hero.stats]
                      : [...careersHubData.hero.stats];
                    current.push({
                      value: '10+',
                      number: 10,
                      suffix: { en: '+', ar: '+' },
                      decimals: 0,
                      label: { en: 'New Metric Label', ar: 'وصف المؤشر الجديد' },
                    });
                    setPageData({
                      ...pageData,
                      hero: { ...pageData.hero, stats: current },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-persici-crimson/10 text-persici-crimson hover:bg-persici-crimson hover:text-white text-xs font-bold transition-colors"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Stat Counter</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(pageData.hero?.stats || []).map(
                  (
                    stat: {
                      number?: number;
                      decimals?: number;
                      suffix?: { en?: string; ar?: string };
                      label?: { en?: string; ar?: string };
                    },
                    idx: number
                  ) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-persici-crimson uppercase">
                          Stat #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = moveItem(pageData.hero?.stats || [], idx, 'up');
                              setPageData({
                                ...pageData,
                                hero: { ...pageData.hero, stats: updated },
                              });
                            }}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          >
                            <TbArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = moveItem(pageData.hero?.stats || [], idx, 'down');
                              setPageData({
                                ...pageData,
                                hero: { ...pageData.hero, stats: updated },
                              });
                            }}
                            disabled={idx === (pageData.hero?.stats || []).length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          >
                            <TbArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (pageData.hero?.stats || []).filter(
                                (_: unknown, i: number) => i !== idx
                              );
                              setPageData({
                                ...pageData,
                                hero: { ...pageData.hero, stats: updated },
                              });
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <TbTrash className="w-3.5 h-3.5" />
                          </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Number
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={stat.number ?? ''}
                          onChange={(e) => {
                            const updated = [...(pageData.hero?.stats || [])];
                            updated[idx] = {
                              ...updated[idx],
                              number: e.target.value === '' ? undefined : Number(e.target.value),
                            };
                            setPageData({
                              ...pageData,
                              hero: { ...pageData.hero, stats: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Decimals
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={2}
                          value={stat.decimals ?? 0}
                          onChange={(e) => {
                            const updated = [...(pageData.hero?.stats || [])];
                            updated[idx] = {
                              ...updated[idx],
                              decimals: Number(e.target.value) || 0,
                            };
                            setPageData({
                              ...pageData,
                              hero: { ...pageData.hero, stats: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Suffix (EN)
                        </label>
                        <input
                          type="text"
                          value={stat.suffix?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.hero?.stats || [])];
                            updated[idx] = {
                              ...updated[idx],
                              suffix: { ...(updated[idx].suffix || {}), en: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              hero: { ...pageData.hero, stats: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          اللاحقة (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={stat.suffix?.ar || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.hero?.stats || [])];
                            updated[idx] = {
                              ...updated[idx],
                              suffix: { ...(updated[idx].suffix || {}), ar: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              hero: { ...pageData.hero, stats: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Label (English)
                        </label>
                        <input
                          type="text"
                          value={stat.label?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.hero?.stats || [])];
                            updated[idx] = {
                              ...updated[idx],
                              label: { ...(updated[idx].label || {}), en: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              hero: { ...pageData.hero, stats: updated },
                            });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          الوصف (العربية)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={stat.label?.ar || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.hero?.stats || [])];
                            updated[idx] = {
                              ...updated[idx],
                              label: { ...(updated[idx].label || {}), ar: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              hero: { ...pageData.hero, stats: updated },
                            });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionAccordion>

          {/* SECTION 2: CULTURE & 4-PHOTO BENTO GRID */}
          <SectionAccordion
            number={2}
            title="CareersCultureSection • Life at Persici & 4-Photo Bento Grid (#culture)"
            description="Culture badge, headline, rich-text philosophy, and 4 regional hub photos with R2 Media Library picker"
            onSave={savePage}
          >
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display Culture & Photo Bento Section on Live Page
                </span>
                <span className="text-[11px] text-slate-500">
                  Toggle visibility of the Life at Persici section (#culture)
                </span>
              </div>
              <input
                type="checkbox"
                checked={pageData.culture?.enabled !== false}
                onChange={(e) =>
                  setPageData({
                    ...pageData,
                    culture: { ...pageData.culture, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Culture Badge (English)
                </label>
                <input
                  type="text"
                  value={pageData.culture?.badge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      culture: {
                        ...pageData.culture,
                        badge: { ...(pageData.culture?.badge || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  شارة القسم (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.culture?.badge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      culture: {
                        ...pageData.culture,
                        badge: { ...(pageData.culture?.badge || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Culture Title (English)
                </label>
                <input
                  type="text"
                  value={pageData.culture?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      culture: {
                        ...pageData.culture,
                        title: { ...(pageData.culture?.title || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان ثقافة العمل (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.culture?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      culture: {
                        ...pageData.culture,
                        title: { ...(pageData.culture?.title || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Culture Philosophy Description"
              valueEn={pageData.culture?.description?.en || ''}
              valueAr={pageData.culture?.description?.ar || ''}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  culture: {
                    ...pageData.culture,
                    description: { ...(pageData.culture?.description || {}), en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  culture: {
                    ...pageData.culture,
                    description: { ...(pageData.culture?.description || {}), ar: val },
                  },
                })
              }
            />

            {/* 4-Photo Bento Grid Editor */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Culture Bento Grid Photos ({(pageData.culture?.photos || []).length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const current = Array.isArray(pageData.culture?.photos)
                      ? [...pageData.culture.photos]
                      : [...careersHubData.culture.photos];
                    current.push({
                      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
                      title: { en: 'New Studio Moment', ar: 'لقطة جديدة من الاستوديو' },
                      location: { en: 'Dubai HQ', ar: 'مقر دبي' },
                    });
                    setPageData({
                      ...pageData,
                      culture: { ...pageData.culture, photos: current },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-persici-crimson/10 text-persici-crimson hover:bg-persici-crimson hover:text-white text-xs font-bold transition-colors"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Bento Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(pageData.culture?.photos || []).map(
                  (
                    photo: {
                      image?: string;
                      src?: string;
                      title?: { en?: string; ar?: string };
                      location?: { en?: string; ar?: string };
                    },
                    idx: number
                  ) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-persici-crimson uppercase">
                        Bento Slot #{idx + 1} {idx === 0 ? '(Large Featured Portrait)' : idx === 3 ? '(Wide Panoramic)' : ''}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = moveItem(pageData.culture?.photos || [], idx, 'up');
                            setPageData({
                              ...pageData,
                              culture: { ...pageData.culture, photos: updated },
                            });
                          }}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <TbArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = moveItem(pageData.culture?.photos || [], idx, 'down');
                            setPageData({
                              ...pageData,
                              culture: { ...pageData.culture, photos: updated },
                            });
                          }}
                          disabled={idx === (pageData.culture?.photos || []).length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <TbArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Image URL (R2 or External)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={photo.image || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.culture?.photos || [])];
                            updated[idx] = { ...updated[idx], image: e.target.value };
                            setPageData({
                              ...pageData,
                              culture: { ...pageData.culture, photos: updated },
                            });
                          }}
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            openMediaPicker((url) => {
                              const updated = [...(pageData.culture?.photos || [])];
                              updated[idx] = { ...updated[idx], image: url };
                              setPageData({
                                ...pageData,
                                culture: { ...pageData.culture, photos: updated },
                              });
                            }, 'image')
                          }
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-persici-crimson transition-colors shrink-0 inline-flex items-center gap-1"
                        >
                          <TbPhoto className="w-3.5 h-3.5" />
                          <span>R2</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Photo Title (EN)
                        </label>
                        <input
                          type="text"
                          value={photo.title?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.culture?.photos || [])];
                            updated[idx] = {
                              ...updated[idx],
                              title: { ...(updated[idx].title || {}), en: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              culture: { ...pageData.culture, photos: updated },
                            });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          عنوان الصورة (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={photo.title?.ar || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.culture?.photos || [])];
                            updated[idx] = {
                              ...updated[idx],
                              title: { ...(updated[idx].title || {}), ar: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              culture: { ...pageData.culture, photos: updated },
                            });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Hub Location Badge (EN)
                        </label>
                        <input
                          type="text"
                          value={photo.location?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.culture?.photos || [])];
                            updated[idx] = {
                              ...updated[idx],
                              location: { ...(updated[idx].location || {}), en: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              culture: { ...pageData.culture, photos: updated },
                            });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          الموقع / المقر (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={photo.location?.ar || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.culture?.photos || [])];
                            updated[idx] = {
                              ...updated[idx],
                              location: { ...(updated[idx].location || {}), ar: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              culture: { ...pageData.culture, photos: updated },
                            });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionAccordion>

          {/* SECTION 3: EXECUTIVE BENEFITS & TOTAL REWARDS (PERKS) */}
          <SectionAccordion
            number={3}
            title="CareersPerksSection • Executive Benefits & Total Rewards Bento"
            description="Section badge, title, rich-text subtitle, and 6+ compensation & wellbeing bento cards"
            onSave={savePage}
          >
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display Perks & Benefits Section on Live Page
                </span>
                <span className="text-[11px] text-slate-500">
                  Toggle visibility of the Executive Benefits & Total Rewards grid
                </span>
              </div>
              <input
                type="checkbox"
                checked={pageData.perks?.enabled !== false}
                onChange={(e) =>
                  setPageData({
                    ...pageData,
                    perks: { ...pageData.perks, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Perks Badge (English)
                </label>
                <input
                  type="text"
                  value={pageData.perks?.badge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      perks: {
                        ...pageData.perks,
                        badge: { ...(pageData.perks?.badge || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  شارة المزايا (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.perks?.badge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      perks: {
                        ...pageData.perks,
                        badge: { ...(pageData.perks?.badge || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Perks Section Title (English)
                </label>
                <input
                  type="text"
                  value={pageData.perks?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      perks: {
                        ...pageData.perks,
                        title: { ...(pageData.perks?.title || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم المزايا (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.perks?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      perks: {
                        ...pageData.perks,
                        title: { ...(pageData.perks?.title || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Perks Section Subtitle"
              valueEn={pageData.perks?.subtitle?.en || ''}
              valueAr={pageData.perks?.subtitle?.ar || ''}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  perks: {
                    ...pageData.perks,
                    subtitle: { ...(pageData.perks?.subtitle || {}), en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  perks: {
                    ...pageData.perks,
                    subtitle: { ...(pageData.perks?.subtitle || {}), ar: val },
                  },
                })
              }
            />

            {/* Perks Items Repeater */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Perks & Benefits Cards ({(pageData.perks?.items || []).length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const current: CareerPerk[] = Array.isArray(pageData.perks?.items)
                      ? [...pageData.perks.items]
                      : [...careersHubData.perks.items];
                    current.push({
                      id: `perk-${Date.now()}`,
                      iconName: 'Sparkles',
                      tag: { en: 'Executive Perk', ar: 'ميزة استثنائية' },
                      title: { en: 'New Benefit Title', ar: 'عنوان الميزة الجديدة' },
                      description: {
                        en: 'Describe this benefit and how it supports the team.',
                        ar: 'اشرح تفاصيل هذه الميزة وكيف تدعم أعضاء الفريق.',
                      },
                    });
                    setPageData({
                      ...pageData,
                      perks: { ...pageData.perks, items: current },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-persici-crimson/10 text-persici-crimson hover:bg-persici-crimson hover:text-white text-xs font-bold transition-colors"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Benefit Card</span>
                </button>
              </div>

              <div className="space-y-4">
                {(pageData.perks?.items || []).map((perk: CareerPerk, idx: number) => (
                  <div
                    key={perk.id || idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-persici-crimson uppercase">
                        Benefit Card #{idx + 1} — {perk.title?.en || ''}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = moveItem(pageData.perks?.items || [], idx, 'up');
                            setPageData({
                              ...pageData,
                              perks: { ...pageData.perks, items: updated },
                            });
                          }}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <TbArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = moveItem(pageData.perks?.items || [], idx, 'down');
                            setPageData({
                              ...pageData,
                              perks: { ...pageData.perks, items: updated },
                            });
                          }}
                          disabled={idx === (pageData.perks?.items || []).length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <TbArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (pageData.perks?.items || []).filter(
                              (_: unknown, i: number) => i !== idx
                            );
                            setPageData({
                              ...pageData,
                              perks: { ...pageData.perks, items: updated },
                            });
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <TbTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Icon
                        </label>
                        <select
                          value={perk.iconName || 'Globe'}
                          onChange={(e) => {
                            const updated = [...(pageData.perks?.items || [])];
                            updated[idx] = { ...updated[idx], iconName: e.target.value };
                            setPageData({
                              ...pageData,
                              perks: { ...pageData.perks, items: updated },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium"
                        >
                          <option value="Globe">Globe (Mobility & Remote)</option>
                          <option value="TrendingUp">TrendingUp (Equity & Profit)</option>
                          <option value="GraduationCap">GraduationCap (Learning Stipend)</option>
                          <option value="HeartHandshake">HeartHandshake (Health & VIP Care)</option>
                          <option value="Laptop">Laptop (M-Series Gear)</option>
                          <option value="Sun">Sun (PTO & Family Leave)</option>
                          <option value="Rocket">Rocket (Velocity & Growth)</option>
                          <option value="Sparkles">Sparkles (Excellence)</option>
                          <option value="Award">Award (Recognition)</option>
                          <option value="Shield">Shield (Security)</option>
                          <option value="Clock">Clock (Flexible Hours)</option>
                          <option value="Coin">Coin (Compensation)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Tag Pill (EN)
                        </label>
                        <input
                          type="text"
                          value={perk.tag?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.perks?.items || [])];
                            updated[idx] = {
                              ...updated[idx],
                              tag: { ...(updated[idx].tag || {}), en: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              perks: { ...pageData.perks, items: updated },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          الوسم (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={perk.tag?.ar || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.perks?.items || [])];
                            updated[idx] = {
                              ...updated[idx],
                              tag: { ...(updated[idx].tag || {}), ar: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              perks: { ...pageData.perks, items: updated },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Card Title (EN)
                        </label>
                        <input
                          type="text"
                          value={perk.title?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.perks?.items || [])];
                            updated[idx] = {
                              ...updated[idx],
                              title: { ...(updated[idx].title || {}), en: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              perks: { ...pageData.perks, items: updated },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          عنوان الميزة (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={perk.title?.ar || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.perks?.items || [])];
                            updated[idx] = {
                              ...updated[idx],
                              title: { ...(updated[idx].title || {}), ar: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              perks: { ...pageData.perks, items: updated },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium font-arabic"
                        />
                      </div>
                    </div>

                    <RichTextEditor
                      label={`Card #${idx + 1} Description`}
                      valueEn={perk.description?.en || ''}
                      valueAr={perk.description?.ar || ''}
                      onChangeEn={(val) => {
                        const updated = [...(pageData.perks?.items || [])];
                        updated[idx] = {
                          ...updated[idx],
                          description: { ...(updated[idx].description || {}), en: val },
                        };
                        setPageData({
                          ...pageData,
                          perks: { ...pageData.perks, items: updated },
                        });
                      }}
                      onChangeAr={(val) => {
                        const updated = [...(pageData.perks?.items || [])];
                        updated[idx] = {
                          ...updated[idx],
                          description: { ...(updated[idx].description || {}), ar: val },
                        };
                        setPageData({
                          ...pageData,
                          perks: { ...pageData.perks, items: updated },
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SectionAccordion>

          {/* SECTION 4: HIRING PROCESS (4-STAGE TRANSPARENT RECRUITMENT JOURNEY) */}
          <SectionAccordion
            number={4}
            title="CareersProcessSection • 4-Stage Transparent Recruitment Journey"
            description="Hiring process badge, headline, rich-text subtitle, and step-by-step interview stages"
            onSave={savePage}
          >
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display Hiring Process Section on Live Page
                </span>
                <span className="text-[11px] text-slate-500">
                  Toggle visibility of the 4-stage recruitment journey section
                </span>
              </div>
              <input
                type="checkbox"
                checked={pageData.process?.enabled !== false}
                onChange={(e) =>
                  setPageData({
                    ...pageData,
                    process: { ...pageData.process, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Process Badge (English)
                </label>
                <input
                  type="text"
                  value={pageData.process?.badge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      process: {
                        ...pageData.process,
                        badge: { ...(pageData.process?.badge || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  شارة مسار التوظيف (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.process?.badge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      process: {
                        ...pageData.process,
                        badge: { ...(pageData.process?.badge || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Process Title (English)
                </label>
                <input
                  type="text"
                  value={pageData.process?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      process: {
                        ...pageData.process,
                        title: { ...(pageData.process?.title || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان مسار التوظيف (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.process?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      process: {
                        ...pageData.process,
                        title: { ...(pageData.process?.title || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Process Section Subtitle"
              valueEn={pageData.process?.subtitle?.en || ''}
              valueAr={pageData.process?.subtitle?.ar || ''}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  process: {
                    ...pageData.process,
                    subtitle: { ...(pageData.process?.subtitle || {}), en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  process: {
                    ...pageData.process,
                    subtitle: { ...(pageData.process?.subtitle || {}), ar: val },
                  },
                })
              }
            />

            {/* Process Steps Repeater */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Recruitment Stages ({(pageData.process?.steps || []).length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const current: CareerProcessStep[] = Array.isArray(pageData.process?.steps)
                      ? [...pageData.process.steps]
                      : [...careersHubData.process.steps];
                    const nextNum = String(current.length + 1).padStart(2, '0');
                    current.push({
                      step: nextNum,
                      title: { en: 'New Stage Title', ar: 'مرحلة جديدة' },
                      duration: { en: '45 Minutes', ar: '45 دقيقة' },
                      description: { en: 'Stage overview...', ar: 'وصف المرحلة...' },
                    });
                    setPageData({
                      ...pageData,
                      process: { ...pageData.process, steps: current },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-persici-crimson/10 text-persici-crimson hover:bg-persici-crimson hover:text-white text-xs font-bold transition-colors"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Stage</span>
                </button>
              </div>

              <div className="space-y-4">
                {(pageData.process?.steps || []).map((stepItem: CareerProcessStep, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-persici-crimson uppercase">
                        Stage #{idx + 1} ({stepItem.step}) — {stepItem.title?.en || ''}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = moveItem(pageData.process?.steps || [], idx, 'up');
                            setPageData({
                              ...pageData,
                              process: { ...pageData.process, steps: updated },
                            });
                          }}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <TbArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = moveItem(pageData.process?.steps || [], idx, 'down');
                            setPageData({
                              ...pageData,
                              process: { ...pageData.process, steps: updated },
                            });
                          }}
                          disabled={idx === (pageData.process?.steps || []).length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <TbArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (pageData.process?.steps || []).filter(
                              (_: unknown, i: number) => i !== idx
                            );
                            setPageData({
                              ...pageData,
                              process: { ...pageData.process, steps: updated },
                            });
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <TbTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Step Number Badge
                        </label>
                        <input
                          type="text"
                          value={stepItem.step || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.process?.steps || [])];
                            updated[idx] = { ...updated[idx], step: e.target.value };
                            setPageData({
                              ...pageData,
                              process: { ...pageData.process, steps: updated },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Duration Pill (EN)
                        </label>
                        <input
                          type="text"
                          value={stepItem.duration?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.process?.steps || [])];
                            updated[idx] = {
                              ...updated[idx],
                              duration: { ...(updated[idx].duration || {}), en: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              process: { ...pageData.process, steps: updated },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          المدة الزمنية (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={stepItem.duration?.ar || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.process?.steps || [])];
                            updated[idx] = {
                              ...updated[idx],
                              duration: { ...(updated[idx].duration || {}), ar: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              process: { ...pageData.process, steps: updated },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Stage Title (EN)
                        </label>
                        <input
                          type="text"
                          value={stepItem.title?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.process?.steps || [])];
                            updated[idx] = {
                              ...updated[idx],
                              title: { ...(updated[idx].title || {}), en: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              process: { ...pageData.process, steps: updated },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          عنوان المرحلة (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={stepItem.title?.ar || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.process?.steps || [])];
                            updated[idx] = {
                              ...updated[idx],
                              title: { ...(updated[idx].title || {}), ar: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              process: { ...pageData.process, steps: updated },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium font-arabic"
                        />
                      </div>
                    </div>

                    <RichTextEditor
                      label={`Stage #${idx + 1} Description`}
                      valueEn={stepItem.description?.en || ''}
                      valueAr={stepItem.description?.ar || ''}
                      onChangeEn={(val) => {
                        const updated = [...(pageData.process?.steps || [])];
                        updated[idx] = {
                          ...updated[idx],
                          description: { ...(updated[idx].description || {}), en: val },
                        };
                        setPageData({
                          ...pageData,
                          process: { ...pageData.process, steps: updated },
                        });
                      }}
                      onChangeAr={(val) => {
                        const updated = [...(pageData.process?.steps || [])];
                        updated[idx] = {
                          ...updated[idx],
                          description: { ...(updated[idx].description || {}), ar: val },
                        };
                        setPageData({
                          ...pageData,
                          process: { ...pageData.process, steps: updated },
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SectionAccordion>

          {/* SECTION 5: ALL CAREERS & ACTIVE OPENINGS FILTER BOARD (#open-positions) */}
          <SectionAccordion
            number={5}
            title="CareersFilterBoard • All Careers & Active Openings Filter Section (#open-positions)"
            description="Section badge, title, subtitle, search bar, department & location filter categories, and link to Careers ATS Job Postings"
            onSave={savePage}
          >
            {/* Direct Shortcut Banner to Careers ATS Job Postings */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <TbBriefcase className="w-4 h-4" />
                  <span>Careers ATS • Active Job Postings & Detail Page Designer</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Add, Edit, Toggle Active/Archived Careers, Skills, Recommendations & Detail Section Visibility
                </h4>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  All individual job openings displayed in this filter board are pulled live from the <strong>Careers ATS (Active Job Postings)</strong> collection. From there you can create/edit roles, toggle active status, edit categories/locations, manage responsibilities, requirements, recommendations, and skills, and toggle any section ON/OFF on each job&apos;s detail page.
                </p>
              </div>
              <Link
                href={`/${lang}/dashboard/careers/openings`}
                className="px-4 py-2.5 rounded-xl bg-persici-crimson hover:bg-red-600 text-white text-xs font-bold tracking-wide transition-colors shrink-0 inline-flex items-center gap-1.5 shadow-lg shadow-persici-crimson/25"
              >
                <span>Open Careers ATS Editor →</span>
              </Link>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display Open Positions Filter Board on Live Page
                </span>
                <span className="text-[11px] text-slate-500">
                  Toggle visibility of the interactive All Careers filter board (#open-positions)
                </span>
              </div>
              <input
                type="checkbox"
                checked={pageData.openPositions?.enabled !== false}
                onChange={(e) =>
                  setPageData({
                    ...pageData,
                    openPositions: { ...pageData.openPositions, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Section Badge (English)
                </label>
                <input
                  type="text"
                  value={pageData.openPositions?.badge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        badge: { ...(pageData.openPositions?.badge || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  شارة قسم الوظائف الشاغرة (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.openPositions?.badge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        badge: { ...(pageData.openPositions?.badge || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Section Title (English)
                </label>
                <input
                  type="text"
                  value={pageData.openPositions?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        title: { ...(pageData.openPositions?.title || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان قسم جميع الوظائف (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.openPositions?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        title: { ...(pageData.openPositions?.title || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Open Positions Section Subtitle"
              valueEn={pageData.openPositions?.subtitle?.en || ''}
              valueAr={pageData.openPositions?.subtitle?.ar || ''}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  openPositions: {
                    ...pageData.openPositions,
                    subtitle: { ...(pageData.openPositions?.subtitle || {}), en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  openPositions: {
                    ...pageData.openPositions,
                    subtitle: { ...(pageData.openPositions?.subtitle || {}), ar: val },
                  },
                })
              }
            />

            {/* Search & Filter Labels */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Search Input Placeholder (EN)
                </label>
                <input
                  type="text"
                  value={pageData.openPositions?.searchPlaceholder?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        searchPlaceholder: {
                          ...(pageData.openPositions?.searchPlaceholder || {}),
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  نص حقل البحث (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.openPositions?.searchPlaceholder?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        searchPlaceholder: {
                          ...(pageData.openPositions?.searchPlaceholder || {}),
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Card CTA Button Label (EN)
                </label>
                <input
                  type="text"
                  value={pageData.openPositions?.applyCtaText?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        applyCtaText: {
                          ...(pageData.openPositions?.applyCtaText || {}),
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  نص زر تفاصيل الوظيفة والتقديم (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.openPositions?.applyCtaText?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        applyCtaText: {
                          ...(pageData.openPositions?.applyCtaText || {}),
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Featured / High Priority Badge Text (EN)
                </label>
                <input
                  type="text"
                  value={pageData.openPositions?.highPriorityBadge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        highPriorityBadge: {
                          ...(pageData.openPositions?.highPriorityBadge || {}),
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  نص شارة الوظيفة المميزة (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.openPositions?.highPriorityBadge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        highPriorityBadge: {
                          ...(pageData.openPositions?.highPriorityBadge || {}),
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                />
              </div>
            </div>

            {/* Department Filter Pills Repeater */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block">
                    Department Filter Categories ({(pageData.openPositions?.departments || []).length})
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Keep slug &ldquo;all&rdquo; as the first item for resetting department filters. Any custom department slug added in the ATS will also appear automatically.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current: CareerFilterOption[] = Array.isArray(pageData.openPositions?.departments)
                      ? [...pageData.openPositions.departments]
                      : [...careersHubData.openPositions.departments];
                    current.push({
                      slug: `dept-${current.length}`,
                      label: { en: 'New Department', ar: 'قسم جديد' },
                    });
                    setPageData({
                      ...pageData,
                      openPositions: { ...pageData.openPositions, departments: current },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-persici-crimson/10 text-persici-crimson hover:bg-persici-crimson hover:text-white text-xs font-bold transition-colors shrink-0"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Category Filter</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(pageData.openPositions?.departments || []).map(
                  (dept: CareerFilterOption, idx: number) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                          Category Key (Slug)
                        </label>
                        <input
                          type="text"
                          value={dept.slug || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.openPositions?.departments || [])];
                            updated[idx] = { ...updated[idx], slug: e.target.value };
                            setPageData({
                              ...pageData,
                              openPositions: { ...pageData.openPositions, departments: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                          Filter Pill Label (EN)
                        </label>
                        <input
                          type="text"
                          value={dept.label?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.openPositions?.departments || [])];
                            updated[idx] = {
                              ...updated[idx],
                              label: { ...(updated[idx].label || {}), en: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              openPositions: { ...pageData.openPositions, departments: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                          اسم القسم في الفلتر (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={dept.label?.ar || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.openPositions?.departments || [])];
                            updated[idx] = {
                              ...updated[idx],
                              label: { ...(updated[idx].label || {}), ar: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              openPositions: { ...pageData.openPositions, departments: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                        />
                      </div>
                      <div className="sm:col-span-1 flex items-center justify-end gap-1 pt-3">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (pageData.openPositions?.departments || []).filter(
                              (_: unknown, i: number) => i !== idx
                            );
                            setPageData({
                              ...pageData,
                              openPositions: { ...pageData.openPositions, departments: updated },
                            });
                          }}
                          disabled={dept.slug === 'all'}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded disabled:opacity-25"
                        >
                          <TbTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Location Filter Pills Repeater */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block">
                    Location / Regional Hub Filter Pills ({(pageData.openPositions?.locations || []).length})
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Keep slug &ldquo;all&rdquo; as the first item for showing all locations.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current: CareerFilterOption[] = Array.isArray(pageData.openPositions?.locations)
                      ? [...pageData.openPositions.locations]
                      : [...careersHubData.openPositions.locations];
                    current.push({
                      slug: `loc-${current.length}`,
                      label: { en: 'New Hub', ar: 'مقر جديد' },
                    });
                    setPageData({
                      ...pageData,
                      openPositions: { ...pageData.openPositions, locations: current },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-persici-crimson/10 text-persici-crimson hover:bg-persici-crimson hover:text-white text-xs font-bold transition-colors shrink-0"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add Location Filter</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(pageData.openPositions?.locations || []).map(
                  (loc: CareerFilterOption, idx: number) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                          Location Key (Slug)
                        </label>
                        <input
                          type="text"
                          value={loc.slug || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.openPositions?.locations || [])];
                            updated[idx] = { ...updated[idx], slug: e.target.value };
                            setPageData({
                              ...pageData,
                              openPositions: { ...pageData.openPositions, locations: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                          Location Pill Label (EN)
                        </label>
                        <input
                          type="text"
                          value={loc.label?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.openPositions?.locations || [])];
                            updated[idx] = {
                              ...updated[idx],
                              label: { ...(updated[idx].label || {}), en: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              openPositions: { ...pageData.openPositions, locations: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                          اسم المقر في الفلتر (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={loc.label?.ar || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.openPositions?.locations || [])];
                            updated[idx] = {
                              ...updated[idx],
                              label: { ...(updated[idx].label || {}), ar: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              openPositions: { ...pageData.openPositions, locations: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                        />
                      </div>
                      <div className="sm:col-span-1 flex items-center justify-end gap-1 pt-3">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (pageData.openPositions?.locations || []).filter(
                              (_: unknown, i: number) => i !== idx
                            );
                            setPageData({
                              ...pageData,
                              openPositions: { ...pageData.openPositions, locations: updated },
                            });
                          }}
                          disabled={loc.slug === 'all'}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded disabled:opacity-25"
                        >
                          <TbTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Empty State Text */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Empty Filter State Title (EN)
                </label>
                <input
                  type="text"
                  value={pageData.openPositions?.emptyTitle?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        emptyTitle: {
                          ...(pageData.openPositions?.emptyTitle || {}),
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  عنوان عدم وجود نتائج (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.openPositions?.emptyTitle?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        emptyTitle: {
                          ...(pageData.openPositions?.emptyTitle || {}),
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Empty Filter State Subtitle (EN)
                </label>
                <input
                  type="text"
                  value={pageData.openPositions?.emptySubtitle?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        emptySubtitle: {
                          ...(pageData.openPositions?.emptySubtitle || {}),
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  وصف عدم وجود نتائج (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.openPositions?.emptySubtitle?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      openPositions: {
                        ...pageData.openPositions,
                        emptySubtitle: {
                          ...(pageData.openPositions?.emptySubtitle || {}),
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                />
              </div>
            </div>
          </SectionAccordion>

          {/* SECTION 6: SPONTANEOUS APPLICATION CTA */}
          <SectionAccordion
            number={6}
            title="CareersSpontaneousCta • Open Talent Collective Banner"
            description="Dark obsidian callout card for visionary candidates applying outside listed roles"
            onSave={savePage}
          >
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display Spontaneous Application CTA Card on Live Page
                </span>
                <span className="text-[11px] text-slate-500">
                  Toggle visibility of the Open Talent Collective dark CTA banner
                </span>
              </div>
              <input
                type="checkbox"
                checked={pageData.spontaneous?.enabled !== false}
                onChange={(e) =>
                  setPageData({
                    ...pageData,
                    spontaneous: { ...pageData.spontaneous, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Badge Pill (English)
                </label>
                <input
                  type="text"
                  value={pageData.spontaneous?.badge?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      spontaneous: {
                        ...pageData.spontaneous,
                        badge: { ...(pageData.spontaneous?.badge || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  الشارة (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.spontaneous?.badge?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      spontaneous: {
                        ...pageData.spontaneous,
                        badge: { ...(pageData.spontaneous?.badge || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Headline (English)
                </label>
                <input
                  type="text"
                  value={pageData.spontaneous?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      spontaneous: {
                        ...pageData.spontaneous,
                        title: { ...(pageData.spontaneous?.title || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  العنوان (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.spontaneous?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      spontaneous: {
                        ...pageData.spontaneous,
                        title: { ...(pageData.spontaneous?.title || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="Spontaneous CTA Description"
              valueEn={pageData.spontaneous?.description?.en || ''}
              valueAr={pageData.spontaneous?.description?.ar || ''}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  spontaneous: {
                    ...pageData.spontaneous,
                    description: { ...(pageData.spontaneous?.description || {}), en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  spontaneous: {
                    ...pageData.spontaneous,
                    description: { ...(pageData.spontaneous?.description || {}), ar: val },
                  },
                })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  CTA Button Text (EN)
                </label>
                <input
                  type="text"
                  value={pageData.spontaneous?.ctaText?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      spontaneous: {
                        ...pageData.spontaneous,
                        ctaText: { ...(pageData.spontaneous?.ctaText || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  نص زر التقديم العام (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.spontaneous?.ctaText?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      spontaneous: {
                        ...pageData.spontaneous,
                        ctaText: { ...(pageData.spontaneous?.ctaText || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Target HR Email Address
                </label>
                <input
                  type="email"
                  value={pageData.spontaneous?.email || 'hr@persiciagency.com'}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      spontaneous: {
                        ...pageData.spontaneous,
                        email: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-mono"
                />
              </div>
            </div>
          </SectionAccordion>

          {/* SECTION 7: CANDIDATE FAQS */}
          <SectionAccordion
            number={7}
            title="CareersFaqSection • Candidate Inquiries & FAQs (#faqs)"
            description="Frequently asked questions regarding relocation, visa sponsorship, remote work, and hiring timelines"
            onSave={savePage}
          >
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display Candidate FAQs Section on Live Page
                </span>
                <span className="text-[11px] text-slate-500">
                  Toggle visibility of the bottom Candidate FAQs accordion (#faqs)
                </span>
              </div>
              <input
                type="checkbox"
                checked={pageData.faqs?.enabled !== false}
                onChange={(e) =>
                  setPageData({
                    ...pageData,
                    faqs: { ...pageData.faqs, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  FAQs Title (English)
                </label>
                <input
                  type="text"
                  value={pageData.faqs?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      faqs: {
                        ...pageData.faqs,
                        title: { ...(pageData.faqs?.title || {}), en: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان الأسئلة الشائعة (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.faqs?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      faqs: {
                        ...pageData.faqs,
                        title: { ...(pageData.faqs?.title || {}), ar: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium font-arabic"
                />
              </div>
            </div>

            <RichTextEditor
              label="FAQs Section Subtitle"
              valueEn={pageData.faqs?.subtitle?.en || ''}
              valueAr={pageData.faqs?.subtitle?.ar || ''}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  faqs: {
                    ...pageData.faqs,
                    subtitle: { ...(pageData.faqs?.subtitle || {}), en: val },
                  },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  faqs: {
                    ...pageData.faqs,
                    subtitle: { ...(pageData.faqs?.subtitle || {}), ar: val },
                  },
                })
              }
            />

            {/* FAQ Items Repeater */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Candidate FAQ Items ({(pageData.faqs?.items || []).length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const current: CareerFaqItem[] = Array.isArray(pageData.faqs?.items)
                      ? [...pageData.faqs.items]
                      : [...careersHubData.faqs.items];
                    current.push({
                      id: `faq-${Date.now()}`,
                      question: { en: 'New Candidate Question?', ar: 'سؤال جديد للمرشحين؟' },
                      answer: { en: 'Detailed answer...', ar: 'إجابة تفصيلية...' },
                    });
                    setPageData({
                      ...pageData,
                      faqs: { ...pageData.faqs, items: current },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-persici-crimson/10 text-persici-crimson hover:bg-persici-crimson hover:text-white text-xs font-bold transition-colors"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add FAQ Item</span>
                </button>
              </div>

              <div className="space-y-4">
                {(pageData.faqs?.items || []).map((faq: CareerFaqItem, idx: number) => (
                  <div
                    key={faq.id || idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-persici-crimson uppercase">
                        FAQ #{idx + 1} — {faq.question?.en || ''}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = moveItem(pageData.faqs?.items || [], idx, 'up');
                            setPageData({
                              ...pageData,
                              faqs: { ...pageData.faqs, items: updated },
                            });
                          }}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <TbArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = moveItem(pageData.faqs?.items || [], idx, 'down');
                            setPageData({
                              ...pageData,
                              faqs: { ...pageData.faqs, items: updated },
                            });
                          }}
                          disabled={idx === (pageData.faqs?.items || []).length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <TbArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (pageData.faqs?.items || []).filter(
                              (_: unknown, i: number) => i !== idx
                            );
                            setPageData({
                              ...pageData,
                              faqs: { ...pageData.faqs, items: updated },
                            });
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <TbTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Question (EN)
                        </label>
                        <input
                          type="text"
                          value={faq.question?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.faqs?.items || [])];
                            updated[idx] = {
                              ...updated[idx],
                              question: { ...(updated[idx].question || {}), en: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              faqs: { ...pageData.faqs, items: updated },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          السؤال (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={faq.question?.ar || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.faqs?.items || [])];
                            updated[idx] = {
                              ...updated[idx],
                              question: { ...(updated[idx].question || {}), ar: e.target.value },
                            };
                            setPageData({
                              ...pageData,
                              faqs: { ...pageData.faqs, items: updated },
                            });
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium font-arabic"
                        />
                      </div>
                    </div>

                    <RichTextEditor
                      label={`FAQ #${idx + 1} Answer`}
                      valueEn={faq.answer?.en || ''}
                      valueAr={faq.answer?.ar || ''}
                      onChangeEn={(val) => {
                        const updated = [...(pageData.faqs?.items || [])];
                        updated[idx] = {
                          ...updated[idx],
                          answer: { ...(updated[idx].answer || {}), en: val },
                        };
                        setPageData({
                          ...pageData,
                          faqs: { ...pageData.faqs, items: updated },
                        });
                      }}
                      onChangeAr={(val) => {
                        const updated = [...(pageData.faqs?.items || [])];
                        updated[idx] = {
                          ...updated[idx],
                          answer: { ...(updated[idx].answer || {}), ar: val },
                        };
                        setPageData({
                          ...pageData,
                          faqs: { ...pageData.faqs, items: updated },
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SectionAccordion>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5C. INSIGHTS HUB PAGE SECTIONS (HERO, EXPLORE/FILTERS, NEWSLETTER)  */}
      {/* =================================================================== */}
      {slug === 'insights' && (
        <div className="space-y-4">
          {/* 1. HERO BANNER & AWARD MEDALLION */}
          <SectionAccordion
            number={1}
            title="Insights Hub • Hero Banner & Award Medallion"
            description="Top dark split-hero section with crimson overline badge, dual-part headline, rich description, dual CTAs, and medallion visual"
            isOpenDefault={true}
            onSave={savePage}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Display Hero Banner Section on Live Insights Hub Page
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Toggle visibility of the top split-hero section
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pageData.hero?.enabled !== false}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: { ...(pageData.hero || {}), enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
                />
              </div>

              {/* Overline Badge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Overline Badge (EN)
                  </label>
                  <input
                    type="text"
                    value={pageData.hero?.badge?.en ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        hero: {
                          ...(pageData.hero || {}),
                          badge: { ...(pageData.hero?.badge || {}), en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    الشارة العلوية (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.hero?.badge?.ar ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        hero: {
                          ...(pageData.hero || {}),
                          badge: { ...(pageData.hero?.badge || {}), ar: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic font-semibold"
                  />
                </div>
              </div>

              {/* Main Title + Highlighted Line */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Hero Title Line 1 (EN)
                  </label>
                  <input
                    type="text"
                    value={pageData.hero?.title?.en ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        hero: {
                          ...(pageData.hero || {}),
                          title: { ...(pageData.hero?.title || {}), en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    السطر الأول من العنوان الرئيسي (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.hero?.title?.ar ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        hero: {
                          ...(pageData.hero || {}),
                          title: { ...(pageData.hero?.title || {}), ar: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Hero Title Line 2 / Highlight (EN)
                  </label>
                  <input
                    type="text"
                    value={pageData.hero?.titleHighlight?.en ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        hero: {
                          ...(pageData.hero || {}),
                          titleHighlight: {
                            ...(pageData.hero?.titleHighlight || {}),
                            en: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-bold text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    السطر الثاني المميز من العنوان (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.hero?.titleHighlight?.ar ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        hero: {
                          ...(pageData.hero || {}),
                          titleHighlight: {
                            ...(pageData.hero?.titleHighlight || {}),
                            ar: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic font-bold text-slate-600"
                  />
                </div>
              </div>

              {/* Hero Description RichTextEditor */}
              <RichTextEditor
                label="Hero Description / Subtitle (Supports Text Alignment & Formatting)"
                valueEn={pageData.hero?.description?.en ?? ''}
                valueAr={pageData.hero?.description?.ar ?? ''}
                onChangeEn={(val) =>
                  setPageData({
                    ...pageData,
                    hero: {
                      ...(pageData.hero || {}),
                      description: { ...(pageData.hero?.description || {}), en: val },
                    },
                  })
                }
                onChangeAr={(val) =>
                  setPageData({
                    ...pageData,
                    hero: {
                      ...(pageData.hero || {}),
                      description: { ...(pageData.hero?.description || {}), ar: val },
                    },
                  })
                }
              />

              {/* Primary & Secondary CTAs */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Hero Action Buttons (Primary & Secondary CTAs)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Primary Button Label (EN)
                    </label>
                    <input
                      type="text"
                      value={pageData.hero?.primaryCtaLabel?.en ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...(pageData.hero || {}),
                            primaryCtaLabel: {
                              ...(pageData.hero?.primaryCtaLabel || {}),
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      نص الزر الرئيسي (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={pageData.hero?.primaryCtaLabel?.ar ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...(pageData.hero || {}),
                            primaryCtaLabel: {
                              ...(pageData.hero?.primaryCtaLabel || {}),
                              ar: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Primary Button Link / Anchor
                    </label>
                    <input
                      type="text"
                      value={pageData.hero?.primaryCtaHref ?? '#insights-grid'}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...(pageData.hero || {}),
                            primaryCtaHref: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Secondary Button Label (EN)
                    </label>
                    <input
                      type="text"
                      value={pageData.hero?.secondaryCtaLabel?.en ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...(pageData.hero || {}),
                            secondaryCtaLabel: {
                              ...(pageData.hero?.secondaryCtaLabel || {}),
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      نص الزر الثانوي (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={pageData.hero?.secondaryCtaLabel?.ar ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...(pageData.hero || {}),
                            secondaryCtaLabel: {
                              ...(pageData.hero?.secondaryCtaLabel || {}),
                              ar: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Secondary Button Link / Route
                    </label>
                    <input
                      type="text"
                      value={pageData.hero?.secondaryCtaHref ?? '/contact'}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...(pageData.hero || {}),
                            secondaryCtaHref: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Image & Alt Text */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Hero Visual / Award Medallion Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {(pageData.hero?.heroImage || insightsHubPageData.hero.heroImage) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pageData.hero?.heroImage || insightsHubPageData.hero.heroImage}
                      alt={pageData.hero?.heroImageAlt?.en || 'Hero Award preview'}
                      className="w-20 h-24 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-900"
                    />
                  )}
                  <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={pageData.hero?.heroImage ?? insightsHubPageData.hero.heroImage}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: { ...(pageData.hero || {}), heroImage: e.target.value },
                        })
                      }
                      className="flex-1 px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-mono"
                      placeholder="/images/insights/insights-hero-award.webp"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker(
                          (url: string) =>
                            setPageData({
                              ...pageData,
                              hero: { ...(pageData.hero || {}), heroImage: url },
                            }),
                          'image'
                        )
                      }
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0"
                    >
                      <TbPhoto className="w-4 h-4" />
                      <span>Browse R2 Media</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Hero Image Alt Text (EN)
                    </label>
                    <input
                      type="text"
                      value={pageData.hero?.heroImageAlt?.en ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...(pageData.hero || {}),
                            heroImageAlt: {
                              ...(pageData.hero?.heroImageAlt || {}),
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      النص البديل للصورة (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={pageData.hero?.heroImageAlt?.ar ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          hero: {
                            ...(pageData.hero || {}),
                            heroImageAlt: {
                              ...(pageData.hero?.heroImageAlt || {}),
                              ar: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                </div>
              </div>
            </div>
          </SectionAccordion>

          {/* 2. EXPLORE ALL CONTENT & CATEGORY FILTER BAR */}
          <SectionAccordion
            number={2}
            title="Insights Hub • Explore All Content & Category Filter Tabs"
            description="Section badge, main heading, rich subtitle, interactive category filter tabs, empty-state labels, and link to Blogs & Insights Manager"
            isOpenDefault={false}
            onSave={savePage}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Display Explore All Content &amp; Filter Grid Section on Live Page
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Toggle visibility of the main filterable insights grid section
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pageData.exploreSection?.enabled !== false}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      exploreSection: {
                        ...(pageData.exploreSection || {}),
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
                />
              </div>
              {/* Direct Shortcut Banner to Blogs & Insights Manager */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-red-50/70 border border-red-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Published & Draft Insights / Blogs Feed
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Individual articles, research reports, categories, published/draft status, rich sections, AI Overviews, and detail page design toggles are managed in the <strong>Blogs &amp; Insights</strong> tab.
                  </p>
                </div>
                <Link
                  href={`/${lang}/dashboard/content/insights`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-persici-crimson text-white text-xs font-semibold hover:bg-red-700 transition-colors shrink-0"
                >
                  <TbExternalLink className="w-4 h-4" />
                  <span>Open Blogs &amp; Insights Manager</span>
                </Link>
              </div>

              {/* Section Badge & Heading */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Section Badge (EN)
                  </label>
                  <input
                    type="text"
                    value={pageData.exploreSection?.badge?.en ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        exploreSection: {
                          ...(pageData.exploreSection || {}),
                          badge: {
                            ...(pageData.exploreSection?.badge || {}),
                            en: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    شارة القسم (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.exploreSection?.badge?.ar ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        exploreSection: {
                          ...(pageData.exploreSection || {}),
                          badge: {
                            ...(pageData.exploreSection?.badge || {}),
                            ar: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    All Insights Section Title (EN)
                  </label>
                  <input
                    type="text"
                    value={pageData.exploreSection?.title?.en ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        exploreSection: {
                          ...(pageData.exploreSection || {}),
                          title: {
                            ...(pageData.exploreSection?.title || {}),
                            en: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    عنوان قسم جميع الرؤى (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.exploreSection?.title?.ar ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        exploreSection: {
                          ...(pageData.exploreSection || {}),
                          title: {
                            ...(pageData.exploreSection?.title || {}),
                            ar: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic font-bold"
                  />
                </div>
              </div>

              <RichTextEditor
                label="Section Subtitle / Description (Supports Text Alignment & Formatting)"
                valueEn={pageData.exploreSection?.subtitle?.en ?? ''}
                valueAr={pageData.exploreSection?.subtitle?.ar ?? ''}
                onChangeEn={(val) =>
                  setPageData({
                    ...pageData,
                    exploreSection: {
                      ...(pageData.exploreSection || {}),
                      subtitle: {
                        ...(pageData.exploreSection?.subtitle || {}),
                        en: val,
                      },
                    },
                  })
                }
                onChangeAr={(val) =>
                  setPageData({
                    ...pageData,
                    exploreSection: {
                      ...(pageData.exploreSection || {}),
                      subtitle: {
                        ...(pageData.exploreSection?.subtitle || {}),
                        ar: val,
                      },
                    },
                  })
                }
              />

              {/* Category Filter Tabs Repeater */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Category Filter Tabs (All Insights / Article / Research / Custom)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Keep slug <code className="font-mono bg-white px-1 rounded">all</code> for the default &ldquo;All&rdquo; tab. Any custom category slug you add here can also be assigned to articles in the Blogs &amp; Insights Manager.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const current: InsightsHubCategoryFilter[] = Array.isArray(
                        pageData.exploreSection?.categories
                      )
                        ? pageData.exploreSection.categories
                        : [];
                      setPageData({
                        ...pageData,
                        exploreSection: {
                          ...(pageData.exploreSection || {}),
                          categories: [
                            ...current,
                            {
                              slug: `category-${current.length + 1}`,
                              label: { en: 'New Category', ar: 'تصنيف جديد' },
                            },
                          ],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                  >
                    <TbPlus className="w-3.5 h-3.5" />
                    <span>Add Filter Tab</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(pageData.exploreSection?.categories || []).map(
                    (cat: InsightsHubCategoryFilter, idx: number) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center bg-white p-3 rounded-xl border border-slate-200"
                      >
                        <div className="md:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Filter Slug (e.g. all, article, research)
                          </label>
                          <input
                            type="text"
                            value={cat.slug ?? ''}
                            onChange={(e) => {
                              const updated = [...(pageData.exploreSection?.categories || [])];
                              updated[idx] = { ...updated[idx], slug: e.target.value };
                              setPageData({
                                ...pageData,
                                exploreSection: {
                                  ...(pageData.exploreSection || {}),
                                  categories: updated,
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-mono bg-slate-50"
                          />
                        </div>
                        <div className="md:col-span-4">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Tab Label (EN)
                          </label>
                          <input
                            type="text"
                            value={cat.label?.en ?? ''}
                            onChange={(e) => {
                              const updated = [...(pageData.exploreSection?.categories || [])];
                              updated[idx] = {
                                ...updated[idx],
                                label: { ...(updated[idx]?.label || {}), en: e.target.value },
                              };
                              setPageData({
                                ...pageData,
                                exploreSection: {
                                  ...(pageData.exploreSection || {}),
                                  categories: updated,
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div className="md:col-span-4">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            اسم التبويب (AR)
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={cat.label?.ar ?? ''}
                            onChange={(e) => {
                              const updated = [...(pageData.exploreSection?.categories || [])];
                              updated[idx] = {
                                ...updated[idx],
                                label: { ...(updated[idx]?.label || {}), ar: e.target.value },
                              };
                              setPageData({
                                ...pageData,
                                exploreSection: {
                                  ...(pageData.exploreSection || {}),
                                  categories: updated,
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                          />
                        </div>
                        <div className="md:col-span-1 flex items-center justify-end gap-1 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (pageData.exploreSection?.categories || []).filter(
                                (_: unknown, i: number) => i !== idx
                              );
                              setPageData({
                                ...pageData,
                                exploreSection: {
                                  ...(pageData.exploreSection || {}),
                                  categories: updated,
                                },
                              });
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                            title="Remove filter tab"
                          >
                            <TbTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Load More & Empty State Copy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Load More Indicator Text (EN)
                  </label>
                  <input
                    type="text"
                    value={pageData.exploreSection?.loadMoreText?.en ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        exploreSection: {
                          ...(pageData.exploreSection || {}),
                          loadMoreText: {
                            ...(pageData.exploreSection?.loadMoreText || {}),
                            en: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    نص تحميل المزيد (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.exploreSection?.loadMoreText?.ar ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        exploreSection: {
                          ...(pageData.exploreSection || {}),
                          loadMoreText: {
                            ...(pageData.exploreSection?.loadMoreText || {}),
                            ar: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Empty Filter State Title (EN)
                  </label>
                  <input
                    type="text"
                    value={pageData.exploreSection?.emptyTitle?.en ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        exploreSection: {
                          ...(pageData.exploreSection || {}),
                          emptyTitle: {
                            ...(pageData.exploreSection?.emptyTitle || {}),
                            en: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    عنوان حالة عدم وجود نتائج (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.exploreSection?.emptyTitle?.ar ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        exploreSection: {
                          ...(pageData.exploreSection || {}),
                          emptyTitle: {
                            ...(pageData.exploreSection?.emptyTitle || {}),
                            ar: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Empty Filter State Subtitle (EN)
                  </label>
                  <input
                    type="text"
                    value={pageData.exploreSection?.emptySubtitle?.en ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        exploreSection: {
                          ...(pageData.exploreSection || {}),
                          emptySubtitle: {
                            ...(pageData.exploreSection?.emptySubtitle || {}),
                            en: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    وصف حالة عدم وجود نتائج (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.exploreSection?.emptySubtitle?.ar ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        exploreSection: {
                          ...(pageData.exploreSection || {}),
                          emptySubtitle: {
                            ...(pageData.exploreSection?.emptySubtitle || {}),
                            ar: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
                  />
                </div>
              </div>
            </div>
          </SectionAccordion>

          {/* 3. BLOG / NEWSLETTER SECTION (PERSICI DISPATCH) */}
          <SectionAccordion
            number={3}
            title="Insights Hub • Blog & Practical Guides Newsletter (Persici Dispatch)"
            description="Split newsletter subscription section with badge, headline, rich description, form labels, privacy disclaimer, and editorial visual"
            isOpenDefault={false}
            onSave={savePage}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Display Blog &amp; Practical Guides Newsletter Section on Live Page
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Toggle visibility of the Persici Dispatch newsletter subscription section
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pageData.newsletterSection?.enabled !== false}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      newsletterSection: {
                        ...(pageData.newsletterSection || {}),
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Section Badge (EN)
                  </label>
                  <input
                    type="text"
                    value={pageData.newsletterSection?.badge?.en ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        newsletterSection: {
                          ...(pageData.newsletterSection || {}),
                          badge: {
                            ...(pageData.newsletterSection?.badge || {}),
                            en: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    شارة القسم (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.newsletterSection?.badge?.ar ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        newsletterSection: {
                          ...(pageData.newsletterSection || {}),
                          badge: {
                            ...(pageData.newsletterSection?.badge || {}),
                            ar: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Headline (EN)
                  </label>
                  <input
                    type="text"
                    value={pageData.newsletterSection?.title?.en ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        newsletterSection: {
                          ...(pageData.newsletterSection || {}),
                          title: {
                            ...(pageData.newsletterSection?.title || {}),
                            en: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    العنوان الرئيسي (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={pageData.newsletterSection?.title?.ar ?? ''}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        newsletterSection: {
                          ...(pageData.newsletterSection || {}),
                          title: {
                            ...(pageData.newsletterSection?.title || {}),
                            ar: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-arabic font-bold"
                  />
                </div>
              </div>

              <RichTextEditor
                label="Newsletter Subtitle / Pitch (Supports Text Alignment & Formatting)"
                valueEn={pageData.newsletterSection?.subtitle?.en ?? ''}
                valueAr={pageData.newsletterSection?.subtitle?.ar ?? ''}
                onChangeEn={(val) =>
                  setPageData({
                    ...pageData,
                    newsletterSection: {
                      ...(pageData.newsletterSection || {}),
                      subtitle: {
                        ...(pageData.newsletterSection?.subtitle || {}),
                        en: val,
                      },
                    },
                  })
                }
                onChangeAr={(val) =>
                  setPageData({
                    ...pageData,
                    newsletterSection: {
                      ...(pageData.newsletterSection || {}),
                      subtitle: {
                        ...(pageData.newsletterSection?.subtitle || {}),
                        ar: val,
                      },
                    },
                  })
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Input Placeholder (EN / AR)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={pageData.newsletterSection?.emailPlaceholder?.en ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          newsletterSection: {
                            ...(pageData.newsletterSection || {}),
                            emailPlaceholder: {
                              ...(pageData.newsletterSection?.emailPlaceholder || {}),
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                      placeholder="English placeholder"
                    />
                    <input
                      type="text"
                      dir="rtl"
                      value={pageData.newsletterSection?.emailPlaceholder?.ar ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          newsletterSection: {
                            ...(pageData.newsletterSection || {}),
                            emailPlaceholder: {
                              ...(pageData.newsletterSection?.emailPlaceholder || {}),
                              ar: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                      placeholder="النص التوضيحي للبريد"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Submit Button Text (EN / AR)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={pageData.newsletterSection?.submitButtonText?.en ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          newsletterSection: {
                            ...(pageData.newsletterSection || {}),
                            submitButtonText: {
                              ...(pageData.newsletterSection?.submitButtonText || {}),
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                      placeholder="Subscribe"
                    />
                    <input
                      type="text"
                      dir="rtl"
                      value={pageData.newsletterSection?.submitButtonText?.ar ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          newsletterSection: {
                            ...(pageData.newsletterSection || {}),
                            submitButtonText: {
                              ...(pageData.newsletterSection?.submitButtonText || {}),
                              ar: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                      placeholder="اشترك الآن"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Success Confirmation Message (EN / AR)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={pageData.newsletterSection?.successMessage?.en ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          newsletterSection: {
                            ...(pageData.newsletterSection || {}),
                            successMessage: {
                              ...(pageData.newsletterSection?.successMessage || {}),
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                      placeholder="English confirmation"
                    />
                    <input
                      type="text"
                      dir="rtl"
                      value={pageData.newsletterSection?.successMessage?.ar ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          newsletterSection: {
                            ...(pageData.newsletterSection || {}),
                            successMessage: {
                              ...(pageData.newsletterSection?.successMessage || {}),
                              ar: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                      placeholder="رسالة التأكيد بالعربية"
                    />
                  </div>
                </div>
              </div>

              <RichTextEditor
                label="Privacy Disclaimer Copy (Supports Links & Formatting)"
                valueEn={pageData.newsletterSection?.privacyDisclaimer?.en ?? ''}
                valueAr={pageData.newsletterSection?.privacyDisclaimer?.ar ?? ''}
                onChangeEn={(val) =>
                  setPageData({
                    ...pageData,
                    newsletterSection: {
                      ...(pageData.newsletterSection || {}),
                      privacyDisclaimer: {
                        ...(pageData.newsletterSection?.privacyDisclaimer || {}),
                        en: val,
                      },
                    },
                  })
                }
                onChangeAr={(val) =>
                  setPageData({
                    ...pageData,
                    newsletterSection: {
                      ...(pageData.newsletterSection || {}),
                      privacyDisclaimer: {
                        ...(pageData.newsletterSection?.privacyDisclaimer || {}),
                        ar: val,
                      },
                    },
                  })
                }
              />

              {/* Newsletter Image & Alt */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Newsletter Editorial Feature Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {(pageData.newsletterSection?.image || insightsHubPageData.newsletterSection.image) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pageData.newsletterSection?.image || insightsHubPageData.newsletterSection.image}
                      alt={pageData.newsletterSection?.imageAlt?.en || 'Newsletter feature preview'}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-900"
                    />
                  )}
                  <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={
                        pageData.newsletterSection?.image ??
                        insightsHubPageData.newsletterSection.image
                      }
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          newsletterSection: {
                            ...(pageData.newsletterSection || {}),
                            image: e.target.value,
                          },
                        })
                      }
                      className="flex-1 px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker(
                          (url: string) =>
                            setPageData({
                              ...pageData,
                              newsletterSection: {
                                ...(pageData.newsletterSection || {}),
                                image: url,
                              },
                            }),
                          'image'
                        )
                      }
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0"
                    >
                      <TbPhoto className="w-4 h-4" />
                      <span>Browse R2 Media</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Image Alt Text (EN)
                    </label>
                    <input
                      type="text"
                      value={pageData.newsletterSection?.imageAlt?.en ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          newsletterSection: {
                            ...(pageData.newsletterSection || {}),
                            imageAlt: {
                              ...(pageData.newsletterSection?.imageAlt || {}),
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      النص البديل للصورة (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={pageData.newsletterSection?.imageAlt?.ar ?? ''}
                      onChange={(e) =>
                        setPageData({
                          ...pageData,
                          newsletterSection: {
                            ...(pageData.newsletterSection || {}),
                            imageAlt: {
                              ...(pageData.newsletterSection?.imageAlt || {}),
                              ar: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-arabic"
                    />
                  </div>
                </div>
              </div>
            </div>
          </SectionAccordion>

          {/* 4. SHARED BOTTOM CONTACT SECTION */}
          <SectionAccordion
            number={4}
            title="Insights Hub • Shared Bottom Contact Section"
            description="Toggle visibility of the bottom lead-generation contact section on the Insights Hub page"
            isOpenDefault={false}
            onSave={savePage}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Display Shared Bottom Contact Section on Live Insights Hub Page
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Toggle visibility of the bottom lead-generation contact form on the Insights Hub page
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pageData.contactSection?.enabled !== false}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      contactSection: {
                        ...(pageData.contactSection || {}),
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Shared Bottom Contact Form &amp; Advisor Cards
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    To edit its form fields, labels, or advisor cards globally, open the Shared Contact Section manager.
                  </p>
                </div>
                <Link
                  href={`/${lang}/dashboard/shared-contact`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shrink-0"
                >
                  <TbExternalLink className="w-4 h-4" />
                  <span>Edit Shared Contact Section</span>
                </Link>
              </div>
            </div>
          </SectionAccordion>
        </div>
      )}

      {/* =================================================================== */}
      {/* 6. UNIVERSAL / CUSTOM SECTIONS FALLBACK BUILDER                     */}
      {/* =================================================================== */}
      {!['home', 'about', 'solutions', 'industries', 'how-we-do-it', 'contact', 'client-stories', 'careers', 'insights'].includes(slug) &&
        !isSolutionPageSlug(slug) &&
        !isIndustryPageSlug(slug) &&
        !isHowWeDoItPageSlug(slug) && (
        <div className="space-y-4">
          <SectionAccordion
            number={1}
            title={`${slug.toUpperCase()} • Primary Overview Banner`}
            description="Hero headline, subtitle, and rich-text overview narrative"
            isOpenDefault={true}
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Page Main Title (English)
                </label>
                <input
                  type="text"
                  value={pageData.heroTitle?.en || pageData.title?.en || pageData.heroTitle || pageData.title || ''}
                  onChange={(e) => setPageData({ ...pageData, heroTitle: e.target.value, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان الصفحة (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.heroTitle?.ar || pageData.title?.ar || pageData.heroTitleAr || pageData.titleAr || ''}
                  onChange={(e) => setPageData({ ...pageData, heroTitleAr: e.target.value, titleAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
            </div>

            <RichTextEditor
              label="Overview Narrative & Article Body"
              valueEn={pageData.description || pageData.overviewEn || ''}
              valueAr={pageData.descriptionAr || pageData.overviewAr || ''}
              onChangeEn={(val) => setPageData({ ...pageData, description: val, overviewEn: val })}
              onChangeAr={(val) => setPageData({ ...pageData, descriptionAr: val, overviewAr: val })}
              helperText="Formatted rich text rendered on the live feature page"
            />
          </SectionAccordion>

          {/* Custom Dynamic Sections */}
          <SectionAccordion
            number={2}
            title="Custom Page Sections (Add / Edit / Remove)"
            description="Add custom branded blocks with bilingual text and R2 media"
            onSave={savePage}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Custom Added Sections ({(pageData.customSections || []).length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const existing = pageData.customSections || [];
                    setPageData({
                      ...pageData,
                      customSections: [
                        ...existing,
                        {
                          id: `sec-${Date.now()}`,
                          title: { en: 'New Feature Section', ar: 'قسم جديد' },
                          body: { en: '<p>Section content...</p>', ar: '<p>محتوى القسم...</p>' },
                          mediaUrl: '',
                          mediaType: 'image',
                        },
                      ],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-persici-crimson text-white rounded-lg text-xs font-semibold hover:bg-red-700"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>Add New Section</span>
                </button>
              </div>

              {(pageData.customSections || []).map((sec: any, idx: number) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 relative group">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800">Section #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(pageData.customSections || [])];
                        updated.splice(idx, 1);
                        setPageData({ ...pageData, customSections: updated });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Section"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Section Title (EN)</label>
                      <input
                        type="text"
                        value={sec.title?.en || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.customSections || [])];
                          updated[idx] = { ...sec, title: { ...sec.title, en: e.target.value } };
                          setPageData({ ...pageData, customSections: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">عنوان القسم (AR)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={sec.title?.ar || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.customSections || [])];
                          updated[idx] = { ...sec, title: { ...sec.title, ar: e.target.value } };
                          setPageData({ ...pageData, customSections: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Media Asset URL (R2)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={sec.mediaUrl || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.customSections || [])];
                            updated[idx] = { ...sec, mediaUrl: e.target.value };
                            setPageData({ ...pageData, customSections: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            openMediaPicker((url) => {
                              const updated = [...(pageData.customSections || [])];
                              updated[idx] = { ...sec, mediaUrl: url };
                              setPageData({ ...pageData, customSections: updated });
                            }, 'image');
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0"
                        >
                          Pick R2
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionAccordion>
        </div>
      )}

      {/* Embedded Media Picker Modal with STRICT image vs video filtering */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        allowedType={mediaPickerType}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
