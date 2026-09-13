'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { ClientStoryDetail, StoryVideoItem } from '../../../_client-stories/types';
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

  // State for Template C: Device Mockup Switcher
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const videos = mediaShowcase.videos || [];
  const currentVideo: StoryVideoItem | undefined = videos[selectedVideoIndex] || videos[0];

  const gallery = mediaShowcase.gallery || [];
  const mockups = mediaShowcase.mockups || [];
  const techStack = mediaShowcase.techStack || [];

  const activeMockup = mockups.find((m) => m.type === activeDevice) || mockups[0];

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
              <video
                key={currentVideo.videoUrl}
                src={currentVideo.videoUrl}
                poster={currentVideo.posterUrl || story.heroImage}
                controls
                playsInline
                className="w-full h-full object-cover"
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
            <div className="flex items-center justify-center gap-2">
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
            </div>
          )}

          {/* Active Device Preview Frame */}
          {activeMockup && (
            <div className="relative mx-auto w-full max-w-5xl rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-300/80 bg-slate-900 shadow-2xl p-2 sm:p-4">
              {/* Browser chrome header for desktop */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800 text-slate-400 text-xs">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                <span className="ms-3 font-mono text-[11px] text-slate-400 truncate">
                  https://{story.client.toLowerCase().replace(/\s+/g, '')}.com
                </span>
              </div>

              <div
                className={`relative w-full rounded-xl overflow-hidden bg-white ${
                  activeDevice === 'mobile'
                    ? 'max-w-xs mx-auto aspect-9/19'
                    : activeDevice === 'tablet'
                    ? 'max-w-2xl mx-auto aspect-4/3'
                    : 'aspect-16/10'
                }`}
              >
                <Image
                  src={activeMockup.image}
                  alt={story.title[lang as 'en' | 'ar'] || story.title.en}
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-contain"
                />
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
                <video
                  src={mediaShowcase.demoVideo}
                  poster={mediaShowcase.demoVideoPoster || story.heroImage}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
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
    </section>
  );
}
