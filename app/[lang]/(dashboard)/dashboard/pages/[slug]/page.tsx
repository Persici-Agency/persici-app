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
} from 'react-icons/tb';
import {
  growthServicesHome,
  defaultTestimonials,
  approachTeamAvatars,
  reviewsList as fallbackReviewsList,
} from '@shared/data';
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
        const res = await fetch(`/api/content/${slug}`);
        const data = await res.json();
        if (data.content) {
          const c = data.content;
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
              heroAvatars: c.heroAvatars || c.hero?.heroAvatars || [
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
              reviewsList:
                (c.reviewsList && c.reviewsList.length > 0)
                  ? c.reviewsList
                  : (c.reviews?.reviews && c.reviews.reviews.length > 0)
                  ? c.reviews.reviews
                  : fallbackReviewsList,

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
          } else {
            setPageData(c);
          }
        }
      } catch (err) {
        console.error('Failed to load page content:', err);
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
            reviews: pageData.reviewsList || pageData.reviews?.reviews || [],
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
        };
      }

      const res = await fetch(`/api/content/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSave),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save page.');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSavingAll(false);
    }
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
  const livePageHref = slug === 'home' ? `/${lang}` : `/${lang}/${slug}`;

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
                  <button
                    type="button"
                    onClick={() => {
                      const existing = pageData.approachTeamMembers || [];
                      const newAvatar = {
                        id: `specialist-${Date.now()}`,
                        name: 'Specialist Member',
                        role: 'Senior Digital Engineer',
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                        alt: 'Team Specialist',
                      };
                      setPageData({ ...pageData, approachTeamMembers: [...existing, newAvatar] });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <TbPlus className="w-3.5 h-3.5" />
                    <span>Add Avatar</span>
                  </button>
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
                                const updated = [...(pageData.approachTeamMembers || [])];
                                updated[mIdx] = { ...m, avatar: e.target.value, src: e.target.value };
                                setPageData({ ...pageData, approachTeamMembers: updated });
                              }}
                              className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                openMediaPicker((url) => {
                                  const updated = [...(pageData.approachTeamMembers || [])];
                                  updated[mIdx] = { ...m, avatar: url, src: url };
                                  setPageData({ ...pageData, approachTeamMembers: updated });
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
                                const updated = [...(pageData.approachTeamMembers || [])];
                                updated[mIdx] = { ...m, name: e.target.value };
                                setPageData({ ...pageData, approachTeamMembers: updated });
                              }}
                              className="px-2 py-0.5 text-xs border border-slate-200 rounded"
                            />
                            <input
                              type="text"
                              placeholder="Role / Title (e.g. Lead AI Architect)"
                              value={m.role || ''}
                              onChange={(e) => {
                                const updated = [...(pageData.approachTeamMembers || [])];
                                updated[mIdx] = { ...m, role: e.target.value };
                                setPageData({ ...pageData, approachTeamMembers: updated });
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
                            const updated = [...(pageData.approachTeamMembers || [])];
                            const temp = updated[mIdx - 1];
                            updated[mIdx - 1] = updated[mIdx];
                            updated[mIdx] = temp;
                            setPageData({ ...pageData, approachTeamMembers: updated });
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
                            const updated = [...(pageData.approachTeamMembers || [])];
                            const temp = updated[mIdx + 1];
                            updated[mIdx + 1] = updated[mIdx];
                            updated[mIdx] = temp;
                            setPageData({ ...pageData, approachTeamMembers: updated });
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Down"
                        >
                          <TbArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(pageData.approachTeamMembers || [])];
                            updated.splice(mIdx, 1);
                            setPageData({ ...pageData, approachTeamMembers: updated });
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
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Score Label (EN)</label>
                <input
                  type="text"
                  value={pageData.reviewsScoreLabelEn || pageData.reviews?.scoreLabel?.en || '5.0 Rating from 100+ Enterprise Partners'}
                  onChange={(e) => setPageData({ ...pageData, reviewsScoreLabelEn: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
            </div>

            {/* Bottom Conversion Banner Strip */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Bottom Conversion Banner Strip
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Banner Text (EN)"
                  value={pageData.reviewsBannerTextEn || pageData.reviews?.bannerText?.en || ''}
                  onChange={(e) => setPageData({ ...pageData, reviewsBannerTextEn: e.target.value })}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Banner CTA Button (e.g. Book a discovery call)"
                  value={pageData.reviewsBannerCtaEn || pageData.reviews?.bannerCtaText?.en || ''}
                  onChange={(e) => setPageData({ ...pageData, reviewsBannerCtaEn: e.target.value })}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Reviews Cards ({(pageData.reviewsList || []).length})
                </span>
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
                          role: 'Digital Strategist',
                          company: 'Global Enterprise',
                          review: 'Persici provided exemplary engineering rigour and accelerated our digital growth significantly.',
                          verified: 'Verified Client',
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
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 relative group">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(pageData.reviewsList || [])];
                      updated.splice(idx, 1);
                      setPageData({ ...pageData, reviewsList: updated });
                    }}
                    className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                  >
                    <TbTrash className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pr-6">
                    <input
                      type="text"
                      placeholder="Name"
                      value={rev.name || ''}
                      onChange={(e) => {
                        const updated = [...(pageData.reviewsList || [])];
                        updated[idx] = { ...rev, name: e.target.value };
                        setPageData({ ...pageData, reviewsList: updated });
                      }}
                      className="px-2.5 py-1 text-xs border border-slate-200 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Role & Company"
                      value={`${rev.role || ''} | ${rev.company || ''}`}
                      onChange={(e) => {
                        const [role, comp] = e.target.value.split('|');
                        const updated = [...(pageData.reviewsList || [])];
                        updated[idx] = { ...rev, role: role?.trim(), company: comp?.trim() };
                        setPageData({ ...pageData, reviewsList: updated });
                      }}
                      className="px-2.5 py-1 text-xs border border-slate-200 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Verified Badge"
                      value={rev.verified || ''}
                      onChange={(e) => {
                        const updated = [...(pageData.reviewsList || [])];
                        updated[idx] = { ...rev, verified: e.target.value };
                        setPageData({ ...pageData, reviewsList: updated });
                      }}
                      className="px-2.5 py-1 text-xs border border-slate-200 rounded"
                    />
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      <span className="text-[11px] font-semibold text-amber-500 whitespace-nowrap">★ Rate</span>
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
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Client Avatar / Logo URL (Optional)"
                      value={rev.avatar || ''}
                      onChange={(e) => {
                        const updated = [...(pageData.reviewsList || [])];
                        updated[idx] = { ...rev, avatar: e.target.value };
                        setPageData({ ...pageData, reviewsList: updated });
                      }}
                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded font-mono text-[11px]"
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
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold shrink-0 flex items-center gap-1 border border-slate-200"
                    >
                      <TbPhoto className="w-3.5 h-3.5" />
                      <span>Pick</span>
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Review Quote"
                    value={rev.review || ''}
                    onChange={(e) => {
                      const updated = [...(pageData.reviewsList || [])];
                      updated[idx] = { ...rev, review: e.target.value };
                      setPageData({ ...pageData, reviewsList: updated });
                    }}
                    className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded"
                  />
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
      {/* 2. ABOUT US PAGE SECTIONS BUILDER                                  */}
      {/* =================================================================== */}
      {slug === 'about' && (
        <div className="space-y-4">
          {/* Section 1: Hero */}
          <SectionAccordion
            number={1}
            title="About Us • Hero Billboard"
            description="Agency statement, badges, and primary / secondary CTAs"
            isOpenDefault={true}
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hero Title (EN)</label>
                <input
                  type="text"
                  value={pageData.hero?.title?.en || pageData.heroTitle || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: { ...pageData.hero, title: { ...pageData.hero?.title, en: e.target.value } },
                      heroTitle: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان الصفحة (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.title?.ar || pageData.heroTitleAr || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: { ...pageData.hero, title: { ...pageData.hero?.title, ar: e.target.value } },
                      heroTitleAr: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <RichTextEditor
              label="Hero Subtitle Narrative"
              valueEn={pageData.hero?.subtitle?.en || pageData.heroDescriptionEn || ''}
              valueAr={pageData.hero?.subtitle?.ar || pageData.heroDescriptionAr || ''}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  hero: { ...pageData.hero, subtitle: { ...pageData.hero?.subtitle, en: val } },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  hero: { ...pageData.hero, subtitle: { ...pageData.hero?.subtitle, ar: val } },
                })
              }
            />
          </SectionAccordion>

          {/* Section 2: Purpose & Stats */}
          <SectionAccordion
            number={2}
            title="About Us • Purpose & Enterprise Stats"
            description="Our mission, purpose image, and quantified metrics (+340% Revenue, 99.9% Uptime)"
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Purpose Title (EN)</label>
                <input
                  type="text"
                  value={pageData.purpose?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      purpose: { ...pageData.purpose, title: { ...pageData.purpose?.title, en: e.target.value } },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان الهدف المؤسسي (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.purpose?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      purpose: { ...pageData.purpose, title: { ...pageData.purpose?.title, ar: e.target.value } },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Purpose Feature Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pageData.purpose?.image || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      purpose: { ...pageData.purpose, image: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    openMediaPicker((url) => {
                      setPageData({
                        ...pageData,
                        purpose: { ...pageData.purpose, image: url },
                      });
                    }, 'image');
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold shrink-0"
                >
                  Pick R2
                </button>
              </div>
            </div>
          </SectionAccordion>

          {/* Section 3: Milestones Timeline */}
          <SectionAccordion
            number={3}
            title="About Us • Milestones Timeline"
            description="Chronological milestones from inception to regional scaling"
            onSave={savePage}
          >
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Timeline Milestones ({(pageData.milestones?.items || []).length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const existing = pageData.milestones?.items || [];
                    setPageData({
                      ...pageData,
                      milestones: {
                        ...pageData.milestones,
                        items: [
                          ...existing,
                          {
                            year: String(new Date().getFullYear()),
                            title: { en: 'New Milestone', ar: 'إنجاز جديد' },
                            description: { en: 'Milestone narrative...', ar: 'تفاصيل الإنجاز...' },
                            image: '',
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

              <div className="space-y-3">
                {(pageData.milestones?.items || []).map((m: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Year</label>
                        <input
                          type="text"
                          value={m.year || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.milestones?.items || [])];
                            updated[idx] = { ...m, year: e.target.value };
                            setPageData({
                              ...pageData,
                              milestones: { ...pageData.milestones, items: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Title (EN)</label>
                        <input
                          type="text"
                          value={m.title?.en || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.milestones?.items || [])];
                            updated[idx] = { ...m, title: { ...m.title, en: e.target.value } };
                            setPageData({
                              ...pageData,
                              milestones: { ...pageData.milestones, items: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionAccordion>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. SOLUTIONS / CHALLENGES PAGE SECTIONS BUILDER                   */}
      {/* =================================================================== */}
      {slug === 'solutions' && (
        <div className="space-y-4">
          <SectionAccordion
            number={1}
            title="Solutions • Hero & Overview"
            description="Main solutions headline, subtitle, and primary call to action"
            isOpenDefault={true}
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hero Title (EN)</label>
                <input
                  type="text"
                  value={pageData.heroTitle?.en || pageData.heroTitle || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      heroTitle: { ...pageData.heroTitle, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان الحلول (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.heroTitle?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      heroTitle: { ...pageData.heroTitle, ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subtitle (EN)</label>
                <input
                  type="text"
                  value={pageData.heroSubtitle?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      heroSubtitle: { ...pageData.heroSubtitle, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">الوصف الفرعي (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.heroSubtitle?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      heroSubtitle: { ...pageData.heroSubtitle, ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>
          </SectionAccordion>

          <SectionAccordion
            number={2}
            title="Solutions • Offerings Grid & Benefits"
            description="Manage titles for the 9 core technical solutions and growth architecture"
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Offerings Title (EN)</label>
                <input
                  type="text"
                  value={pageData.offeringsTitle?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      offeringsTitle: { ...pageData.offeringsTitle, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان الحلول التقنية (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.offeringsTitle?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      offeringsTitle: { ...pageData.offeringsTitle, ar: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>
          </SectionAccordion>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. CONTACT US PAGE SECTIONS BUILDER                                */}
      {/* =================================================================== */}
      {slug === 'contact' && (
        <div className="space-y-4">
          <SectionAccordion
            number={1}
            title="Contact Us • Hero Headline"
            description="Bold inquiry statement and overview"
            isOpenDefault={true}
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hero Title (EN)</label>
                <input
                  type="text"
                  value={pageData.hero?.title?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: { ...pageData.hero, title: { ...pageData.hero?.title, en: e.target.value } },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">عنوان الواجهة (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: { ...pageData.hero, title: { ...pageData.hero?.title, ar: e.target.value } },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subtitle (EN)</label>
                <input
                  type="text"
                  value={pageData.hero?.subtitle?.en || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: { ...pageData.hero, subtitle: { ...pageData.hero?.subtitle, en: e.target.value } },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">الوصف التوضيحي (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.hero?.subtitle?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      hero: { ...pageData.hero, subtitle: { ...pageData.hero?.subtitle, ar: e.target.value } },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>
          </SectionAccordion>

          <SectionAccordion
            number={2}
            title="Contact Us • Global Offices (Dubai, Riyadh, Amman)"
            description="Manage office addresses, architectural photos (Images Only), and contact channels"
            onSave={savePage}
          >
            <div className="space-y-4">
              {(pageData.offices || []).map((office: any, idx: number) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <TbMapPin className="w-4 h-4 text-persici-crimson" />
                      <span>{office.city?.en} ({office.country?.en})</span>
                    </span>
                    {office.isHQ && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-persici-crimson/10 text-persici-crimson px-2 py-0.5 rounded-full">
                        Global HQ
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Address (EN)</label>
                      <input
                        type="text"
                        value={office.address?.en || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = { ...office, address: { ...office.address, en: e.target.value } };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">العنوان (AR)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={office.address?.ar || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = { ...office, address: { ...office.address, ar: e.target.value } };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-arabic"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Email & Phone</label>
                      <input
                        type="text"
                        value={`${office.email || ''} | ${office.phone || ''}`}
                        onChange={(e) => {
                          const [email, phone] = e.target.value.split('|');
                          const updated = [...(pageData.offices || [])];
                          updated[idx] = { ...office, email: email?.trim(), phone: phone?.trim() };
                          setPageData({ ...pageData, offices: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Office Photo URL</label>
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

      {/* =================================================================== */}
      {/* 5. UNIVERSAL / CUSTOM SECTIONS FALLBACK BUILDER                     */}
      {/* =================================================================== */}
      {!['home', 'about', 'solutions', 'contact'].includes(slug) && (
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
