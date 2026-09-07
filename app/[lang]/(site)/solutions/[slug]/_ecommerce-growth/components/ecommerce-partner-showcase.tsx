'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared';
import { TbPlayerPlay, TbPlayerPause, TbVolume, TbVolume3, TbCircleCheck } from 'react-icons/tb';

interface EcommercePartnerItem {
  name: string;
  role: { en: string; ar: string };
  logo: string;
}

interface EcommercePartnerShowcaseProps {
  badge: string;
  title: string;
  description: string;
  video: {
    src: string;
    title: { en: string; ar: string };
    caption: { en: string; ar: string };
    partnerBadge: { en: string; ar: string };
  };
  partners: EcommercePartnerItem[];
  lang: string;
}

export function EcommercePartnerShowcase({
  badge,
  title,
  description,
  video,
  partners,
  lang,
}: EcommercePartnerShowcaseProps) {
  const isRtl = lang === 'ar';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const videoTitle = video.title[lang as 'en' | 'ar'] || video.title.en;
  const videoCaption = video.caption[lang as 'en' | 'ar'] || video.caption.en;
  const partnerBadge = video.partnerBadge[lang as 'en' | 'ar'] || video.partnerBadge.en;

  return (
    <section id="partners" className="py-20 sm:py-28 lg:py-32 bg-[#F9F8F6] border-b border-black/[0.04] relative scroll-mt-24">
      <div className={sectionContainer}>
        {/* Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-persici-crimson block mb-3">
            {badge}
          </span>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {description}
          </p>
        </FadeUp>

        {/* Featured Video Card */}
        <FadeUp delay={100} duration={750} distance={24} className="max-w-5xl mx-auto mb-16 sm:mb-20">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-persici-crimson via-[#E04537] to-persici-blush border-0 shadow-[0_20px_50px_-15px_rgba(216,52,39,0.35)] group">
            {/* Top Bar with Badges */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-md border-b border-white/15">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-persici-crimson shadow-xs">
                  <TbCircleCheck className="text-sm text-persici-crimson" />
                  {partnerBadge}
                </span>
                <span className="text-xs sm:text-sm text-white font-medium hidden sm:inline-block truncate max-w-md">
                  {videoTitle}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors border border-white/20"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <TbVolume3 className="text-base" /> : <TbVolume className="text-base" />}
                </button>
              </div>
            </div>

            {/* Video Element */}
            <div className="relative w-full aspect-video bg-black/90 flex items-center justify-center">
              <video
                ref={videoRef}
                src={video.src}
                playsInline
                controls={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-contain"
              />

              {/* Play Overlay when paused */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/35 hover:bg-black/25 transition-all cursor-pointer group/btn"
                  aria-label="Play promotional video"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-persici-crimson flex items-center justify-center shadow-2xl group-hover/btn:scale-110 transition-transform duration-300">
                    <TbPlayerPlay className="text-2xl sm:text-3xl translate-x-0.5 rtl:-translate-x-0.5 text-persici-crimson" />
                  </div>
                  <span className="mt-4 text-sm sm:text-base font-semibold text-white drop-shadow-md">
                    {isRtl ? 'تشغيل قصة النجاح مع منصة سلة' : 'Watch the Salla Success Story'}
                  </span>
                </button>
              )}
            </div>

            {/* Video Caption Footer */}
            <div className="px-6 py-4 bg-white/10 backdrop-blur-md border-t border-white/15">
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal">
                {videoCaption}
              </p>
            </div>
          </div>
        </FadeUp>

        {/* 8 Official Partners Grid (Logo-only, borderless, light shadow, grayscale to color on hover) */}
        <FadeUp delay={180} duration={700} distance={20} className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              {isRtl ? 'الشركاء والمنصات التكنولوجية المعتمدة' : 'Certified Platform & Media Partners'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="group relative flex items-center justify-center p-4 sm:p-6 rounded-2xl bg-white border-0 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
              >
                {/* Partner Logo Only (Enlarged for high visual clarity) */}
                <div className="relative w-full h-20 sm:h-24 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={260}
                    height={156}
                    className="max-h-full w-auto max-w-[85%] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
