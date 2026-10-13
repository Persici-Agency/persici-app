'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import {
  TbX,
  TbPhoto,
  TbVideo,
  TbFileText,
  TbMusic,
  TbArchive,
  TbFile,
  TbDownload,
  TbCopy,
  TbCheck,
  TbCamera,
  TbUpload,
  TbExternalLink,
} from 'react-icons/tb';
import { MediaItem } from './types';

export interface MediaPreviewModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onSelect?: (url: string, item: MediaItem) => void;
  onItemUpdated?: (updated: MediaItem) => void;
  isRtl?: boolean;
}

export function MediaPreviewModal({
  item,
  onClose,
  onSelect,
  onItemUpdated,
  isRtl = false,
}: MediaPreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [capturingFrame, setCapturingFrame] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  if (!item) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCaptureVideoFrame = async () => {
    if (!videoRef.current || !item) return;
    setCapturingFrame(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get 2D canvas context');

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailDataUrl = canvas.toDataURL('image/webp', 0.85);

      const res = await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: item.key,
          thumbnailDataUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.thumbnailUrl) {
        const updated = { ...item, thumbnailUrl: data.thumbnailUrl };
        onItemUpdated?.(updated);
      } else {
        alert(data.error || 'Failed to capture frame');
      }
    } catch (err) {
      console.error('Frame capture error:', err);
      alert('Could not capture frame from video.');
    } finally {
      setCapturingFrame(false);
    }
  };

  const handleUploadCustomPoster = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !item) return;

    setUploadingPoster(true);
    try {
      const formData = new FormData();
      formData.append('key', item.key);
      formData.append('thumbnailFile', file);

      const res = await fetch('/api/media', {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.thumbnailUrl) {
        const updated = { ...item, thumbnailUrl: data.thumbnailUrl };
        onItemUpdated?.(updated);
      } else {
        alert(data.error || 'Failed to upload poster image');
      }
    } catch (err) {
      console.error('Custom poster upload error:', err);
      alert('Could not upload custom poster image.');
    } finally {
      setUploadingPoster(false);
      if (posterInputRef.current) posterInputRef.current.value = '';
    }
  };

  const isPdf = item.format.toLowerCase() === 'pdf' || item.key.toLowerCase().endsWith('.pdf');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <input
        type="file"
        ref={posterInputRef}
        onChange={handleUploadCustomPoster}
        accept="image/*"
        className="hidden"
      />

      <div
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              {item.mediaType === 'image' && <TbPhoto className="w-5 h-5 text-persici-crimson" />}
              {item.mediaType === 'video' && <TbVideo className="w-5 h-5 text-persici-crimson" />}
              {item.mediaType === 'document' && <TbFileText className="w-5 h-5 text-amber-400" />}
              {item.mediaType === 'audio' && <TbMusic className="w-5 h-5 text-purple-400" />}
              {item.mediaType === 'archive' && <TbArchive className="w-5 h-5 text-emerald-400" />}
              {item.mediaType === 'other' && <TbFile className="w-5 h-5 text-slate-300" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold truncate text-white">
                {item.title || item.filename || item.key.split('/').pop()}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-mono">
                <span className="uppercase text-[11px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white">
                  {item.format}
                </span>
                <span>&bull;</span>
                <span>{(item.size / 1024).toFixed(1)} KB</span>
                {item.width && item.height && (
                  <>
                    <span>&bull;</span>
                    <span>{item.width} &times; {item.height} px</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            title={isRtl ? 'إغلاق' : 'Close'}
          >
            <TbX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Canvas Body */}
        <div className="p-4 sm:p-6 bg-slate-950 flex-1 flex items-center justify-center min-h-[360px] max-h-[64vh] overflow-hidden relative">
          {item.mediaType === 'image' ? (
            <div className="relative w-full h-[58vh]">
              <Image
                src={item.url}
                alt={item.alt || item.filename}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          ) : item.mediaType === 'video' ? (
            <video
              ref={videoRef}
              src={item.url}
              controls
              autoPlay
              playsInline
              crossOrigin="anonymous"
              poster={item.thumbnailUrl || undefined}
              className="w-full max-h-[58vh] rounded-2xl object-contain shadow-2xl bg-black"
            />
          ) : isPdf ? (
            <div className="w-full h-[58vh] bg-slate-900 rounded-2xl overflow-hidden flex flex-col border border-slate-800">
              <iframe
                src={`${item.url}#toolbar=1`}
                className="w-full flex-1 border-0 rounded-2xl"
                title={item.filename}
              />
            </div>
          ) : item.mediaType === 'audio' ? (
            <div className="w-full max-w-lg p-8 bg-slate-900/90 rounded-3xl border border-slate-800 text-center space-y-5">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shadow-lg">
                <TbMusic className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white truncate">{item.filename}</h4>
                <p className="text-xs text-slate-400 font-mono mt-1 uppercase">{item.format} Audio Stream</p>
              </div>
              <audio controls src={item.url} className="w-full rounded-xl" autoPlay />
            </div>
          ) : (
            <div className="w-full max-w-md p-8 bg-slate-900/90 rounded-3xl border border-slate-800 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg">
                <TbFileText className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white truncate">{item.filename}</h4>
                <p className="text-xs text-slate-400 font-mono mt-1 uppercase">
                  {item.format} Document &bull; {(item.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors shadow-md"
              >
                <TbExternalLink className="w-4 h-4" />
                <span>{isRtl ? 'فتح في علامة تبويب جديدة' : 'Open Document in New Tab'}</span>
              </a>
            </div>
          )}
        </div>

        {/* Modal Controls Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Left tools: Video poster capture or details */}
          <div className="flex items-center gap-2">
            {item.mediaType === 'video' && (
              <>
                <button
                  type="button"
                  disabled={capturingFrame}
                  onClick={handleCaptureVideoFrame}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
                  title="Capture current video frame as poster"
                >
                  <TbCamera className="w-4 h-4" />
                  <span>
                    {capturingFrame
                      ? isRtl
                        ? 'جارٍ التقاط اللقطة...'
                        : 'Capturing...'
                      : isRtl
                      ? 'التقاط الإطار كصورة مصغرة'
                      : 'Capture Frame Poster'}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={uploadingPoster}
                  onClick={() => posterInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <TbUpload className="w-4 h-4" />
                  <span>
                    {uploadingPoster
                      ? isRtl
                        ? 'جارٍ الرفع...'
                        : 'Uploading...'
                      : isRtl
                      ? 'رفع صورة مصغرة'
                      : 'Upload Poster'}
                  </span>
                </button>
              </>
            )}

            <div className="text-xs text-slate-500 font-mono hidden md:block">
              <span className="text-slate-400">{isRtl ? 'المفتاح: ' : 'Key: '}</span>
              <span className="text-slate-700 font-medium truncate max-w-xs inline-block align-bottom">{item.key}</span>
            </div>
          </div>

          {/* Right actions: Copy URL, Download, Select */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <TbCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isRtl ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <TbCopy className="w-4 h-4" />
                  <span>{isRtl ? 'نسخ الرابط' : 'Copy CDN URL'}</span>
                </>
              )}
            </button>

            <a
              href={item.url}
              target="_blank"
              download={item.filename}
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <TbDownload className="w-4 h-4" />
              <span>{isRtl ? 'تنزيل' : 'Download'}</span>
            </a>

            {onSelect && (
              <button
                type="button"
                onClick={() => {
                  onSelect(item.url, item);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-5 py-2 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
              >
                <TbCheck className="w-4 h-4" />
                <span>{isRtl ? 'اختيار هذا الملف' : 'Select / Insert Asset'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
