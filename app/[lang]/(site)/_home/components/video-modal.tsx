'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Dictionary } from '../../../dictionaries';

export function VideoPreviewModal({ dict }: { dict: Dictionary }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="group relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-3xl border border-black/5 bg-persici-black shadow-xl"
      >
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
          alt="Persici Growth Strategy Session"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Floating Speaker Tag in bottom-left */}
        <div className="absolute bottom-6 start-6 flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/30">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
              alt={dict.partnerShowcase.videoSpeaker}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">
              {dict.partnerShowcase.videoSpeaker}
            </div>
            <div className="text-[10px] text-white/70">
              {dict.partnerShowcase.videoRole}
            </div>
          </div>
        </div>

        {/* Center / Bottom-Right Play Button */}
        <div className="absolute bottom-6 end-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-persici-crimson shadow-2xl transition-transform duration-300 group-hover:scale-110">
          <svg className="h-5 w-5 fill-current ms-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-persici-black p-4 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3">
              <h4 className="font-primary text-sm font-semibold">
                {dict.partnerShowcase.title}
              </h4>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt="Growth Preview"
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-persici-crimson text-white shadow-xl animate-pulse">
                  <svg className="h-8 w-8 fill-current ms-1" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="mt-4 text-sm font-medium text-white/90">
                  {dict.partnerShowcase.quote}
                </p>
                <span className="mt-2 text-xs text-persici-blush">
                  {dict.partnerShowcase.author} — {dict.partnerShowcase.company}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
