'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import type { ClientStoryDetail, StoryVideoItem } from '../../../_client-stories/types';
import { VideoPlayer } from '@shared/components/video-player';
import {
  TbPlayerPlay,
  TbMaximize,
  TbX,
  TbChevronRight,
  TbChevronLeft,
  TbDeviceDesktop,
  TbDeviceTablet,
  TbDeviceMobile,
  TbStack2,
  TbLock,
  TbArrowsSort,
} from 'react-icons/tb';

export interface StoryMediaShowcaseProps {
  story: ClientStoryDetail;
  lang: string;
}

export function StoryMediaShowcase({ story, lang }: StoryMediaShowcaseProps) {
  const isRtl = lang === 'ar';
  const { mediaShowcase, templateType } = story;

  const showcaseTitle =
    mediaShowcase.title[lang as 'en' | 'ar'] || mediaShowcase.title.en;
  const showcaseDesc =
    mediaShowcase.description[lang as 'en' | 'ar'] || mediaShowcase.description.en;

  // State for Template A: Selected Video
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);

  // State for Template B: Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const videos = mediaShowcase.videos || [];
  const currentVideo: StoryVideoItem | undefined = videos[selectedVideoIndex] || videos[0];

  const gallery = mediaShowcase.gallery || [];
  const mockups = mediaShowcase.mockups || [];
  const techStack = mediaShowcase.techStack || [];

  const availableTypes = Array.from(new Set(mockups.map((m) => m.type)));
  const defaultDevice = mockups.some((m) => m.type === 'desktop')
    ? 'desktop'
    : (mockups[0]?.type as 'desktop' | 'tablet' | 'mobile') || 'desktop';

  // State for Template C: Device Mockup Switcher
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>(defaultDevice);
  const [selectedMockupIndex, setSelectedMockupIndex] = useState<number>(0);

  const hasMultipleDeviceTypes = availableTypes.length > 1;

  const activeMockup = hasMultipleDeviceTypes
    ? mockups.find((m) => m.type === activeDevice) || mockups[0]
    : mockups[selectedMockupIndex] || mockups[0];

  const currentDeviceType = hasMultipleDeviceTypes
    ? activeDevice
    : (activeMockup?.type || 'mobile');

  const activeMockupTitle =
    activeMockup?.title?.[lang as 'en' | 'ar'] ||
    activeMockup?.title?.en ||
    story.title[lang as 'en' | 'ar'] ||
    story.title.en;

  // State for Template D: Mobile App Showcase
  const hasTabletMockup = mockups.some((m) => m.type === 'tablet');
  const [mobileAppDevice, setMobileAppDevice] = useState<'mobile' | 'tablet'>('mobile');
  const [activeMobileAssetIndex, setActiveMobileAssetIndex] = useState<number>(0);
  const mobileTabsRef = useRef<HTMLDivElement | null>(null);

  const scrollMobileTabs = (direction: 'left' | 'right') => {
    if (!mobileTabsRef.current) return;
    const offset = direction === 'left' ? -260 : 260;
    mobileTabsRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const currentMobileAssets = hasTabletMockup
    ? mockups.filter((m) => m.type === mobileAppDevice)
    : mockups;
  const safeMobileIndex =
    activeMobileAssetIndex < currentMobileAssets.length
      ? activeMobileAssetIndex
      : 0;
  const activeMobileAsset =
    currentMobileAssets[safeMobileIndex] || currentMobileAssets[0];

  return (
    <section
      id="media-showcase"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="scroll-mt-32 pt-10 sm:pt-14 pb-16 sm:pb-24 border-b border-slate-100"
    >
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-persici-crimson mb-2 block">
          {isRtl ? 'معرض المخرجات والإنتاج' : 'Deliverables & Production'}
        </span>
        <h2 className="font-primary text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          {showcaseTitle}
        </h2>
        {showcaseDesc && (
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            {showcaseDesc}
          </p>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TEMPLATE A: MULTI-VIDEO MARKETING REEL                                     */}
      {/* ========================================================================= */}
      {templateType === 'marketing-video-showcase' && videos.length > 0 && (
        <div className="flex flex-col gap-8">
          {/* Master Video Player */}
          {currentVideo && (
            <div className="relative w-full aspect-16/9 rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800">
              <VideoPlayer
                key={currentVideo.videoUrl}
                src={currentVideo.videoUrl}
                poster={currentVideo.posterUrl || story.heroImage}
                title={currentVideo.title?.[lang as 'en' | 'ar'] || currentVideo.title?.en}
                lang={lang as 'en' | 'ar'}
                className="w-full h-full"
                objectFit="contain"
              />
            </div>
          )}

          {/* Episode / Video Selector Tabs */}
          {videos.length > 1 && (
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-4">
                {isRtl ? 'اختر الحلقة أو المشهد' : 'Select Episode / Cut'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {videos.map((vid, idx) => {
                  const isActive = selectedVideoIndex === idx;
                  const vidTitle = vid.title[lang as 'en' | 'ar'] || vid.title.en;

                  return (
                    <button
                      key={vid.id || idx}
                      type="button"
                      onClick={() => setSelectedVideoIndex(idx)}
                      className={`group relative flex flex-col p-3 rounded-xl sm:rounded-2xl border text-start transition-all cursor-pointer ${
                        isActive
                          ? 'border-persici-crimson bg-persici-crimson/5 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="relative w-full aspect-16/9 rounded-lg overflow-hidden bg-slate-200 mb-2.5">
                        <Image
                          src={vid.posterUrl || story.heroImage}
                          alt={vidTitle}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              isActive
                                ? 'bg-persici-crimson text-white'
                                : 'bg-white/90 text-slate-900 group-hover:scale-110 transition-transform'
                            }`}
                          >
                            <TbPlayerPlay className="h-4 w-4 ms-0.5" />
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mt-1">
                        <span className="truncate">{vidTitle}</span>
                        {vid.duration && (
                          <span className="text-[11px] font-mono text-slate-500 ms-2">
                            {vid.duration}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* GALLERY & LIGHTBOX ZOOM (Template B & Hybrid Video/Photo Stories)           */}
      {/* ========================================================================= */}
      {gallery.length > 0 && (
        <div className={videos.length > 0 ? 'mt-12 sm:mt-16' : ''}>
          {videos.length > 0 && (
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-6">
              {isRtl ? 'معرض الصور والإنتاج الميداني' : 'Campaign Photography & Production Stills'}
            </h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {gallery.map((img, idx) => {
              const alt = img.alt[lang as 'en' | 'ar'] || img.alt.en;
              const caption = img.caption?.[lang as 'en' | 'ar'] || img.caption?.en;

              return (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-slate-100 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 ${
                    img.featured ? 'sm:col-span-2 aspect-16/9' : 'aspect-square'
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md">
                      <TbMaximize className="h-5 w-5" />
                    </span>
                  </div>
                  {caption && (
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-linear-to-t from-black/70 to-transparent text-white text-xs font-medium truncate">
                      {caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Lightbox Modal */}
          {lightboxIndex !== null && (
            <div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 end-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer z-50"
              >
                <TbX className="h-6 w-6" />
              </button>

              {/* Prev Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : gallery.length - 1));
                }}
                className="absolute start-4 sm:start-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer z-50"
              >
                <TbChevronLeft className="h-6 w-6" />
              </button>

              {/* Main Image */}
              <div
                className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={gallery[lightboxIndex].src}
                  alt={gallery[lightboxIndex].alt[lang as 'en' | 'ar'] || gallery[lightboxIndex].alt.en}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev! < gallery.length - 1 ? prev! + 1 : 0));
                }}
                className="absolute end-4 sm:end-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer z-50"
              >
                <TbChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TEMPLATE C: SOFTWARE / WEB APP DEMO & DEVICE MOCKUPS                       */}
      {/* ========================================================================= */}
      {templateType === 'software-web-app-showcase' && (
        <div className="flex flex-col gap-10">
          {/* Device Mockup Switcher Controls */}
          {mockups.length > 1 && (
            <div className="flex flex-col items-center gap-3">
              {hasMultipleDeviceTypes ? (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {availableTypes.includes('desktop') && (
                    <button
                      type="button"
                      onClick={() => setActiveDevice('desktop')}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        activeDevice === 'desktop'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <TbDeviceDesktop className="h-4 w-4" />
                      <span>{isRtl ? 'شاشة سطح المكتب' : 'Desktop'}</span>
                    </button>
                  )}

                  {availableTypes.includes('tablet') && (
                    <button
                      type="button"
                      onClick={() => setActiveDevice('tablet')}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        activeDevice === 'tablet'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <TbDeviceTablet className="h-4 w-4" />
                      <span>{isRtl ? 'الأجهزة اللوحية' : 'Tablet'}</span>
                    </button>
                  )}

                  {availableTypes.includes('mobile') && (
                    <button
                      type="button"
                      onClick={() => setActiveDevice('mobile')}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        activeDevice === 'mobile'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <TbDeviceMobile className="h-4 w-4" />
                      <span>{isRtl ? 'الهاتف المحمول' : 'Mobile'}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {mockups.map((m, idx) => {
                    const isSelected = selectedMockupIndex === idx;
                    const tabTitle =
                      m.title?.[lang as 'en' | 'ar'] ||
                      m.title?.en ||
                      `${isRtl ? 'الشاشة' : 'Screen'} ${idx + 1}`;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedMockupIndex(idx)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <TbDeviceMobile className="h-4 w-4" />
                        <span>{tabTitle}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Active Device Preview Frame with Authentic Chassis & Scrollable Web Content */}
          {activeMockup && (
            <div className="flex flex-col items-center w-full">
              {/* 1. DESKTOP BROWSER FRAME */}
              {currentDeviceType === 'desktop' && (
                <div className="relative mx-auto w-full max-w-5xl rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl transition-all duration-300">
                  {/* Browser Chrome Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xs select-none">
                    {/* Traffic Lights */}
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block" />
                      <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block" />
                      <span className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block" />
                    </div>

                    {/* Centered URL Address Bar */}
                    <div className="flex items-center justify-center gap-2 bg-slate-800/80 border border-slate-700/60 px-4 py-1 rounded-lg text-slate-300 text-xs font-mono max-w-md w-full mx-4 shadow-inner">
                      <TbLock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">
                        https://{story.client.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                      </span>
                    </div>

                    {/* Online Status Badge */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      <span className="hidden sm:inline">LIVE</span>
                    </div>
                  </div>

                  {/* Scrollable Viewport: Full Width, Auto Height, Scroll Y */}
                  <div
                    key={activeMockup.image}
                    className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] overflow-y-auto overflow-x-hidden bg-white overscroll-contain [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-track]:bg-slate-100"
                  >
                    <div className="w-full relative">
                      <Image
                        src={activeMockup.image}
                        alt={activeMockupTitle}
                        width={1400}
                        height={3200}
                        sizes="(max-width: 1024px) 100vw, 1200px"
                        className="w-full h-auto block"
                        priority
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. TABLET CHASSIS FRAME */}
              {currentDeviceType === 'tablet' && (
                <div className="relative mx-auto w-full max-w-[560px] sm:max-w-[620px] rounded-[2.2rem] sm:rounded-[2.8rem] p-3.5 sm:p-4 border-[6px] sm:border-[8px] border-slate-800 bg-slate-950 shadow-2xl transition-all duration-300">
                  {/* Top Tablet Bezel with Front Camera Dot */}
                  <div className="flex items-center justify-center pb-2.5 pt-0.5 select-none">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-800 border border-slate-700/60 shadow-inner" />
                  </div>

                  {/* Scrollable Viewport: Full Width, Auto Height, Scroll Y */}
                  <div
                    key={activeMockup.image}
                    className="relative w-full h-[540px] sm:h-[640px] rounded-[1.4rem] sm:rounded-[1.8rem] overflow-y-auto overflow-x-hidden bg-white overscroll-contain shadow-inner [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-track]:bg-slate-100"
                  >
                    <div className="w-full relative">
                      <Image
                        src={activeMockup.image}
                        alt={activeMockupTitle}
                        width={1000}
                        height={2800}
                        sizes="(max-width: 768px) 100vw, 640px"
                        className="w-full h-auto block"
                        priority
                      />
                    </div>
                  </div>

                  {/* Bottom Tablet Bezel with Home Indicator */}
                  <div className="flex items-center justify-center pt-2.5 pb-0.5 select-none">
                    <div className="h-1 w-24 rounded-full bg-slate-700/60" />
                  </div>
                </div>
              )}

              {/* 3. MOBILE SMARTPHONE CHASSIS FRAME */}
              {currentDeviceType === 'mobile' && (
                <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[350px] rounded-[3rem] sm:rounded-[3.4rem] p-2.5 sm:p-3 border-[6px] sm:border-[8px] border-slate-800 bg-slate-950 shadow-2xl transition-all duration-300">
                  {/* Top Phone Bezel with Dynamic Island */}
                  <div className="flex items-center justify-center pb-2 pt-0.5 select-none">
                    <div className="h-4.5 sm:h-5 w-24 sm:w-28 rounded-full bg-black border border-slate-800 flex items-center justify-end pe-2.5 shadow-inner">
                      <div className="h-2 w-2 rounded-full bg-slate-900 border border-slate-800" />
                    </div>
                  </div>

                  {/* Scrollable Viewport: Full Width, Auto Height, Scroll Y */}
                  <div
                    key={activeMockup.image}
                    className="relative w-full h-[520px] sm:h-[580px] rounded-[2rem] sm:rounded-[2.4rem] overflow-y-auto overflow-x-hidden bg-white overscroll-contain shadow-inner [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-track]:bg-slate-100"
                  >
                    <div className="w-full relative">
                      <Image
                        src={activeMockup.image}
                        alt={activeMockupTitle}
                        width={600}
                        height={2600}
                        sizes="(max-width: 640px) 100vw, 360px"
                        className="w-full h-auto block"
                        priority
                      />
                    </div>
                  </div>

                  {/* Bottom Phone Bezel with Home Bar */}
                  <div className="flex items-center justify-center pt-2.5 pb-0.5 select-none">
                    <div className="h-1 w-28 rounded-full bg-slate-700/60" />
                  </div>
                </div>
              )}

              {/* Interactive Scroll Hint Badge */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200/80 px-4 py-1.5 text-xs text-slate-600 font-medium select-none shadow-2xs">
                <TbArrowsSort className="h-3.5 w-3.5 text-persici-crimson animate-bounce" />
                <span>
                  {isRtl
                    ? 'مرر داخل الشاشة لاستكشاف الموقع التفاعلي الكامل'
                    : 'Scroll inside screen to browse full page'}
                </span>
              </div>
            </div>
          )}

          {/* Single Demo Video if available */}
          {mediaShowcase.demoVideo && (
            <div className="mt-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-4">
                {isRtl ? 'عرض فيديو تطبيقي حي' : 'Interactive App Demo Video'}
              </h3>
              <div className="relative w-full aspect-16/9 rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800">
                <VideoPlayer
                  src={mediaShowcase.demoVideo}
                  poster={mediaShowcase.demoVideoPoster || story.heroImage}
                  lang={lang as 'en' | 'ar'}
                  className="w-full h-full"
                  objectFit="contain"
                />
              </div>
            </div>
          )}

          {/* Technology Architecture Badges */}
          {techStack.length > 0 && (
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                <TbStack2 className="h-5 w-5 text-persici-crimson" />
                <h3 className="text-base sm:text-lg">
                  {isRtl ? 'المنظومة التقنية والبرمجية' : 'Engineered Tech Stack & Architecture'}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200/90 px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-persici-crimson" />
                    <span>{tech.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TEMPLATE D: MOBILE APPLICATION SHOWCASE (Phone/Tablet Carousel & Demos)    */}
      {/* ========================================================================= */}
      {templateType === 'mobile-app-showcase' && (
        <div className="flex flex-col gap-10">
          {/* Top Carousel Tabs & Device Controls */}
          {currentMobileAssets.length > 0 && (
            <div className="w-full">
              {/* Header Bar: Category Label & Optional Tablet Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                    {isRtl ? 'استعراض الشاشات والوسائط' : 'App Screens & Interactive Media'}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-persici-crimson/10 text-persici-crimson px-2.5 py-0.5 text-[11px] font-bold">
                    {currentMobileAssets.length}
                  </span>
                </div>

                {/* Device Switcher ONLY IF TABLET ASSETS EXIST */}
                {hasTabletMockup && (
                  <div className="inline-flex items-center rounded-full bg-slate-100 p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileAppDevice('mobile');
                        setActiveMobileAssetIndex(0);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        mobileAppDevice === 'mobile'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <TbDeviceMobile className="h-3.5 w-3.5" />
                      <span>{isRtl ? 'الهاتف' : 'Mobile'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileAppDevice('tablet');
                        setActiveMobileAssetIndex(0);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        mobileAppDevice === 'tablet'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <TbDeviceTablet className="h-3.5 w-3.5" />
                      <span>{isRtl ? 'الأجهزة اللوحية' : 'Tablet'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Horizontal Scrollable Tabs Strip with Arrows */}
              <div className="relative group/tabs">
                {/* Left scroll button */}
                <button
                  type="button"
                  onClick={() => scrollMobileTabs('left')}
                  aria-label="Scroll tabs left"
                  className="absolute start-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white/95 border border-slate-200 text-slate-700 hover:text-black hover:scale-105 shadow-md transition-all cursor-pointer"
                >
                  <TbChevronLeft className="h-4 w-4" />
                </button>

                {/* Tabs Strip */}
                <div
                  ref={mobileTabsRef}
                  className="flex items-center gap-3 overflow-x-auto scrollbar-none sm:px-10 py-1.5 scroll-smooth snap-x select-none"
                >
                  {currentMobileAssets.map((asset, idx) => {
                    const isSelected = safeMobileIndex === idx;
                    const isVideo = asset.mediaType === 'video' || !!asset.videoUrl;
                    const isGif = asset.mediaType === 'gif' || asset.image.endsWith('.gif');
                    const tabTitle =
                      asset.title?.[lang as 'en' | 'ar'] ||
                      asset.title?.en ||
                      `${isRtl ? 'الشاشة' : 'Screen'} ${idx + 1}`;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveMobileAssetIndex(idx)}
                        className={`group/tab flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-start shrink-0 transition-all cursor-pointer snap-start ${
                          isSelected
                            ? 'border-persici-crimson bg-persici-crimson/5 text-slate-900 shadow-xs ring-1 ring-persici-crimson/30'
                            : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {/* Thumbnail Preview */}
                        <div className="relative h-9 w-7 shrink-0 rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                          <Image
                            src={asset.image}
                            alt={tabTitle}
                            fill
                            sizes="28px"
                            unoptimized={isGif}
                            className="object-cover"
                          />
                          {isVideo && (
                            <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                              <TbPlayerPlay className="h-3 w-3 text-white" />
                            </div>
                          )}
                          {isGif && (
                            <div className="absolute bottom-0 inset-x-0 bg-persici-crimson text-[7px] text-white font-mono font-bold text-center leading-tight">
                              GIF
                            </div>
                          )}
                        </div>

                        {/* Title and Media Badge */}
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold truncate max-w-[130px] sm:max-w-[160px]">
                            {tabTitle}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                            {isVideo
                              ? (isRtl ? 'فيديو تفاعلي' : 'Interactive Video')
                              : isGif
                              ? (isRtl ? 'عرض حي GIF' : 'Live Demo GIF')
                              : `${isRtl ? 'شاشة' : 'Screen'} ${idx + 1}`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right scroll button */}
                <button
                  type="button"
                  onClick={() => scrollMobileTabs('right')}
                  aria-label="Scroll tabs right"
                  className="absolute end-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white/95 border border-slate-200 text-slate-700 hover:text-black hover:scale-105 shadow-md transition-all cursor-pointer"
                >
                  <TbChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Active Asset on Stage inside Authentic Chassis */}
          {activeMobileAsset && (
            <div className="relative w-full flex flex-col items-center mt-2">
              <div className="relative flex items-center justify-center w-full">
                {/* Floating Previous Screen Button */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveMobileAssetIndex((prev) =>
                      prev > 0 ? prev - 1 : currentMobileAssets.length - 1
                    )
                  }
                  aria-label="Previous screen"
                  className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:text-black hover:scale-110 shadow-lg transition-all cursor-pointer me-4 lg:me-8 shrink-0 select-none"
                >
                  <TbChevronLeft className="h-5 w-5" />
                </button>

                {/* MOBILE SMARTPHONE CHASSIS */}
                {mobileAppDevice === 'mobile' && (
                  <div className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-[3.2rem] sm:rounded-[3.6rem] p-3 border-[8px] border-slate-800 bg-slate-950 shadow-2xl transition-all duration-300">
                    {/* Dynamic Island Pill */}
                    <div className="flex items-center justify-center pb-2.5 pt-0.5 select-none">
                      <div className="h-5 w-28 rounded-full bg-black border border-slate-800 flex items-center justify-end pe-2.5 shadow-inner">
                        <div className="h-2 w-2 rounded-full bg-slate-900 border border-slate-800" />
                      </div>
                    </div>

                    {/* Viewport: Video or Scrollable Image/GIF */}
                    <div
                      key={`${activeMobileAsset.image}-${activeMobileAsset.videoUrl || ''}`}
                      className="relative w-full h-[540px] sm:h-[660px] rounded-[2.2rem] sm:rounded-[2.6rem] overflow-hidden bg-slate-900 shadow-inner"
                    >
                      {(activeMobileAsset.mediaType === 'video' || activeMobileAsset.videoUrl) ? (
                        <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
                          <VideoPlayer
                            src={activeMobileAsset.videoUrl!}
                            poster={activeMobileAsset.image}
                            title={
                              activeMobileAsset.title?.[lang as 'en' | 'ar'] ||
                              activeMobileAsset.title?.en
                            }
                            lang={lang as 'en' | 'ar'}
                            objectFit="contain"
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full overflow-hidden bg-white">
                          <div className="w-full relative">
                            <Image
                              src={activeMobileAsset.image}
                              alt={
                                activeMobileAsset.title?.[lang as 'en' | 'ar'] ||
                                activeMobileAsset.title?.en ||
                                story.title[lang as 'en' | 'ar'] ||
                                story.title.en
                              }
                              width={500}
                              height={1100}
                              sizes="(max-width: 640px) 100vw, 360px"
                              unoptimized={activeMobileAsset.mediaType === 'gif' || activeMobileAsset.image.endsWith('.gif')}
                              className="w-full h-auto block"
                              priority
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Home Indicator */}
                    <div className="flex items-center justify-center pt-2.5 pb-0.5 select-none">
                      <div className="h-1 w-28 rounded-full bg-slate-700/60" />
                    </div>
                  </div>
                )}

                {/* TABLET CHASSIS (if tablet mode active) */}
                {mobileAppDevice === 'tablet' && (
                  <div className="relative w-full max-w-[560px] sm:max-w-[620px] rounded-[2.2rem] sm:rounded-[2.8rem] p-3.5 sm:p-4 border-[6px] sm:border-[8px] border-slate-800 bg-slate-950 shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-center pb-2.5 pt-0.5 select-none">
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-800 border border-slate-700/60 shadow-inner" />
                    </div>

                    <div
                      key={`${activeMobileAsset.image}-${activeMobileAsset.videoUrl || ''}`}
                      className="relative w-full h-[540px] sm:h-[640px] rounded-[1.4rem] sm:rounded-[1.8rem] overflow-hidden bg-slate-900 shadow-inner"
                    >
                      {(activeMobileAsset.mediaType === 'video' || activeMobileAsset.videoUrl) ? (
                        <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
                          <VideoPlayer
                            src={activeMobileAsset.videoUrl!}
                            poster={activeMobileAsset.image}
                            title={
                              activeMobileAsset.title?.[lang as 'en' | 'ar'] ||
                              activeMobileAsset.title?.en
                            }
                            lang={lang as 'en' | 'ar'}
                            objectFit="contain"
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full overflow-hidden bg-white">
                          <div className="w-full relative">
                            <Image
                              src={activeMobileAsset.image}
                              alt={
                                activeMobileAsset.title?.[lang as 'en' | 'ar'] ||
                                activeMobileAsset.title?.en ||
                                story.title[lang as 'en' | 'ar'] ||
                                story.title.en
                              }
                              width={1000}
                              height={2200}
                              sizes="(max-width: 768px) 100vw, 640px"
                              unoptimized={activeMobileAsset.mediaType === 'gif' || activeMobileAsset.image.endsWith('.gif')}
                              className="w-full h-auto block"
                              priority
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center pt-2.5 pb-0.5 select-none">
                      <div className="h-1 w-24 rounded-full bg-slate-700/60" />
                    </div>
                  </div>
                )}

                {/* Floating Next Screen Button */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveMobileAssetIndex((prev) =>
                      prev < currentMobileAssets.length - 1 ? prev + 1 : 0
                    )
                  }
                  aria-label="Next screen"
                  className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:text-black hover:scale-110 shadow-lg transition-all cursor-pointer ms-4 lg:ms-8 shrink-0 select-none"
                >
                  <TbChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Dots Indicator & Hint */}
              <div className="mt-5 flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5">
                  {currentMobileAssets.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMobileAssetIndex(idx)}
                      aria-label={`Go to screen ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        safeMobileIndex === idx
                          ? 'w-6 bg-persici-crimson'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200/80 px-4 py-1.5 text-xs text-slate-600 font-medium select-none shadow-2xs mt-1">
                  <TbChevronRight className="h-3.5 w-3.5 text-persici-crimson" />
                  <span>
                    {isRtl
                      ? 'تنقل بين التبويبات أو الأسهم لاستكشاف شاشات وعروض التطبيق'
                      : 'Navigate tabs or arrows to explore screens & demos'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Technology Architecture Badges */}
          {techStack.length > 0 && (
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                <TbStack2 className="h-5 w-5 text-persici-crimson" />
                <h3 className="text-base sm:text-lg">
                  {isRtl ? 'المنظومة التقنية والبرمجية' : 'Engineered Tech Stack & Architecture'}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200/90 px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-persici-crimson" />
                    <span>{tech.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
