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
} from 'react-icons/tb';

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
          setPageData(data.content);
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
      const res = await fetch(`/api/content/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
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
          {/* Section 1: Hero */}
          <SectionAccordion
            number={1}
            title="Hero Section & Billboard"
            description="Main title, strategic pitch, primary call-to-action button, and social proof avatars"
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
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      heroTitle: e.target.value,
                      hero: { ...pageData.hero, title: { ...pageData.hero?.title, en: e.target.value } },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان الواجهة (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.heroTitleAr || pageData.hero?.title?.ar || ''}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      heroTitleAr: e.target.value,
                      hero: { ...pageData.hero, title: { ...pageData.hero?.title, ar: e.target.value } },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
            </div>

            <RichTextEditor
              label="Hero Subtitle & Strategic Overview"
              valueEn={pageData.heroDescriptionEn || pageData.heroDescription || pageData.hero?.subtitle?.en || ''}
              valueAr={pageData.heroDescriptionAr || pageData.hero?.subtitle?.ar || ''}
              onChangeEn={(val) =>
                setPageData({
                  ...pageData,
                  heroDescriptionEn: val,
                  heroDescription: val,
                  hero: { ...pageData.hero, subtitle: { ...pageData.hero?.subtitle, en: val } },
                })
              }
              onChangeAr={(val) =>
                setPageData({
                  ...pageData,
                  heroDescriptionAr: val,
                  hero: { ...pageData.hero, subtitle: { ...pageData.hero?.subtitle, ar: val } },
                })
              }
              helperText="Rich-text strategic overview rendered below the hero headline"
            />

            <CtaEditor
              title="Primary Action Button"
              cta={{
                enabled: pageData.heroCtaEnabled !== false,
                labelEn: pageData.heroCtaLabelEn || pageData.hero?.cta?.en || 'Schedule Discovery Call',
                labelAr: pageData.heroCtaLabelAr || pageData.hero?.cta?.ar || 'احجز جلسة استشارية',
                href: pageData.heroCtaHref || '/contact',
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
                avatars: pageData.heroAvatars || [
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
          </SectionAccordion>

          {/* Section 2: Marquee Logos */}
          <SectionAccordion
            number={2}
            title="Strategic Client & Partner Logos Marquee"
            description="Infinite scrolling marquee featuring client brand logos (Images Only)"
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Marquee Header (English)
                </label>
                <input
                  type="text"
                  value={pageData.partnersTitleEn || pageData.hero?.trustedBy?.en || 'Trusted by Global Industry Pioneers'}
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
                  value={pageData.partnersTitleAr || pageData.hero?.trustedBy?.ar || 'موثوق من رواد وقادة القطاعات العالمية'}
                  onChange={(e) => setPageData({ ...pageData, partnersTitleAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                />
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
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
                  <div key={idx} className="relative group border border-slate-200 rounded-lg p-2.5 bg-slate-50 flex flex-col items-center justify-center text-center">
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
          </SectionAccordion>

          {/* Section 3: Heritage & Agency Story */}
          <SectionAccordion
            number={3}
            title="Heritage & Agency Story Narrative"
            description="Editorial narrative and 3-photo collage grid (Dubai HQ, Riyadh, Amman)"
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
              label="Agency Narrative Body Copy"
              valueEn={pageData.heritageDescEn || pageData.heritage?.desc1?.en || ''}
              valueAr={pageData.heritageDescAr || pageData.heritage?.desc1?.ar || ''}
              onChangeEn={(val) => setPageData({ ...pageData, heritageDescEn: val })}
              onChangeAr={(val) => setPageData({ ...pageData, heritageDescAr: val })}
              helperText="Multi-paragraph story describing regional engineering hubs and track record"
            />

            {/* Collage Photos */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Heritage 3-Photo Collage Images
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
                      <label className="block text-[11px] font-semibold text-slate-600">Photo #{idx + 1}</label>
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

          {/* Section 4: Video Testimonials */}
          <SectionAccordion
            number={4}
            title="Meet Clients We Scale (Video Testimonials Carousel)"
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
                  value={pageData.videoSectionTitleAr || pageData.clientVideos?.title?.ar || 'تعرف على شركاء النجاح'}
                  onChange={(e) => setPageData({ ...pageData, videoSectionTitleAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Video Items */}
            <div className="space-y-3">
              {(pageData.videoTestimonials || [
                {
                  title: 'Global Retail Transformation',
                  videoUrl: 'https://pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev/general/client-showcase-sample.mp4',
                  posterUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=600&q=80',
                  clientName: 'Sarah Jenkins',
                  clientRole: 'VP of Digital Commerce',
                },
              ]).map((item: any, idx: number) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Video Title</label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => {
                          const updated = [...(pageData.videoTestimonials || [])];
                          updated[idx] = { ...item, title: e.target.value };
                          setPageData({ ...pageData, videoTestimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Client Name & Role</label>
                      <input
                        type="text"
                        value={`${item.clientName || ''} - ${item.clientRole || ''}`}
                        onChange={(e) => {
                          const [name, ...role] = e.target.value.split('-');
                          const updated = [...(pageData.videoTestimonials || [])];
                          updated[idx] = { ...item, clientName: name?.trim(), clientRole: role.join('-')?.trim() };
                          setPageData({ ...pageData, videoTestimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
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
                          value={item.posterUrl || ''}
                          onChange={(e) => {
                            const updated = [...(pageData.videoTestimonials || [])];
                            updated[idx] = { ...item, posterUrl: e.target.value };
                            setPageData({ ...pageData, videoTestimonials: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            openMediaPicker((url) => {
                              const updated = [...(pageData.videoTestimonials || [])];
                              updated[idx] = { ...item, posterUrl: url };
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

          {/* Section 5: Growth Services */}
          <SectionAccordion
            number={5}
            title="Our Growth Services Section"
            description="Paid social, Google Ads, headless architecture, Shopify, and CRO services"
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
                  Bottom Banner Text (English)
                </label>
                <input
                  type="text"
                  value={pageData.servicesBannerEn || pageData.growthServices?.bannerTitle?.en || 'Ready to build your growth engine?'}
                  onChange={(e) => setPageData({ ...pageData, servicesBannerEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  نص شريط الدعوة للعمل (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.servicesBannerAr || pageData.growthServices?.bannerTitle?.ar || 'جاهز لبناء محرك النمو المخصص لك؟'}
                  onChange={(e) => setPageData({ ...pageData, servicesBannerAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>
          </SectionAccordion>

          {/* Section 6: Home Contact Section */}
          <SectionAccordion
            number={6}
            title="Bottom Get in Touch & Discovery Engine"
            description="Contact form headers, 4 value proposition bullet points, and trust badge"
            onSave={savePage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Left Pitch Title (English)
                </label>
                <input
                  type="text"
                  value={pageData.homeContactLeftTitleEn || pageData.homeContact?.leftTitle?.en || 'Ready to accelerate your digital future?'}
                  onChange={(e) => setPageData({ ...pageData, homeContactLeftTitleEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  عنوان الدعوة للتواصل (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={pageData.homeContactLeftTitleAr || pageData.homeContact?.leftTitle?.ar || 'جاهز لتسريع مستقبلك الرقمي؟'}
                  onChange={(e) => setPageData({ ...pageData, homeContactLeftTitleAr: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>
          </SectionAccordion>
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
