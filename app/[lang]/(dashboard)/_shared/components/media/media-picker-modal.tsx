'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  TbX,
  TbUpload,
  TbCheck,
  TbSearch,
  TbPhoto,
  TbVideo,
  TbPlayerPlay,
  TbFolder,
  TbFilter,
} from 'react-icons/tb';

export interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
  defaultFolder?: string;
  allowedType?: 'image' | 'video' | 'all';
}

interface MediaItem {
  key: string;
  url: string;
  size: number;
  mediaType: 'image' | 'video' | 'document' | 'archive' | 'other';
  format: string;
  thumbnailUrl?: string | null;
}

const FOLDERS = [
  { id: '', label: 'All Folders' },
  { id: 'heroes', label: 'Hero Banners' },
  { id: 'clients', label: 'Client Logos' },
  { id: 'projects', label: 'Projects' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'industries', label: 'Industries' },
  { id: 'insights', label: 'Insights & Blog' },
  { id: 'videos', label: 'Showreels & Videos' },
  { id: 'general', label: 'General' },
];

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title,
  defaultFolder = '',
  allowedType = 'all',
}: MediaPickerModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeFolder, setActiveFolder] = useState(defaultFolder);
  const [activeType, setActiveType] = useState<'image' | 'video' | 'all'>(allowedType);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync activeType when allowedType prop changes
  useEffect(() => {
    setActiveType(allowedType);
  }, [allowedType, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMedia = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeFolder) params.set('folder', activeFolder);
        if (activeType && activeType !== 'all') params.set('type', activeType);

        const res = await fetch(`/api/media?${params.toString()}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.items) {
          setItems(data.items);
        }
      } catch (err) {
        console.error('Failed to fetch media:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [isOpen, activeFolder, activeType]);

  if (!isOpen) return null;

  // Client-side automatic video thumbnail extraction
  const extractThumbnailFromVideoFile = (file: File): Promise<Blob | null> => {
    return new Promise((resolve) => {
      try {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        const objectUrl = URL.createObjectURL(file);
        video.src = objectUrl;

        video.onloadeddata = () => {
          video.currentTime = Math.min(1.0, video.duration / 2 || 0.5);
        };

        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
              (blob) => {
                URL.revokeObjectURL(objectUrl);
                resolve(blob);
              },
              'image/webp',
              0.85
            );
          } catch {
            URL.revokeObjectURL(objectUrl);
            resolve(null);
          }
        };

        video.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', activeFolder || (file.type.startsWith('video/') ? 'videos' : 'general'));

      // If video, extract thumbnail poster
      if (file.type.startsWith('video/')) {
        const thumbBlob = await extractThumbnailFromVideoFile(file);
        if (thumbBlob) {
          formData.append('thumbnail', thumbBlob, `${file.name}-poster.webp`);
        }
      }

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.media?.url) {
        onSelect(data.media.url);
        onClose();
      } else {
        alert(data.error || 'Failed to upload asset.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Please check network connection.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Strictly filter items:
  // If activeType === 'image', DO NOT show videos!
  // If activeType === 'video', DO NOT show images!
  const filteredItems = items.filter((item) => {
    if (activeType === 'image' && item.mediaType !== 'image') return false;
    if (activeType === 'video' && item.mediaType !== 'video') return false;
    const searchLower = search.toLowerCase();
    return item.key.toLowerCase().includes(searchLower);
  });

  const computedTitle =
    title ||
    (activeType === 'image'
      ? 'Select Image from Cloudflare R2'
      : activeType === 'video'
      ? 'Select Video from Cloudflare R2'
      : 'Select Media Asset from Cloudflare R2');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[88vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            {activeType === 'video' ? (
              <div className="w-8 h-8 rounded-lg bg-red-100 text-persici-crimson flex items-center justify-center">
                <TbVideo className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-persici-crimson/10 text-persici-crimson flex items-center justify-center">
                <TbPhoto className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{computedTitle}</h3>
              <p className="text-[11px] text-slate-400">
                {activeType === 'video'
                  ? 'Showing high-definition video assets and showreels'
                  : activeType === 'image'
                  ? 'Showing optimized WebP image assets'
                  : 'Showing all Cloudflare R2 assets'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <TbX className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Media Type Tabs, Search, and Upload */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Media Type Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveType('all')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TbFilter className="w-3.5 h-3.5" />
              <span>All</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveType('image')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeType === 'image'
                  ? 'bg-persici-crimson text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TbPhoto className="w-3.5 h-3.5" />
              <span>Images Only</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveType('video')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeType === 'video'
                  ? 'bg-persici-crimson text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TbVideo className="w-3.5 h-3.5" />
              <span>Videos Only</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 w-full sm:w-auto min-w-[200px]">
            <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets by file name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20"
            />
          </div>

          {/* Direct Upload Button */}
          <label className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-xs shrink-0">
            <TbUpload className="w-4 h-4" />
            <span>{uploading ? 'Processing...' : activeType === 'video' ? 'Upload Video' : 'Upload File'}</span>
            <input
              type="file"
              ref={fileInputRef}
              accept={
                activeType === 'video'
                  ? 'video/*'
                  : activeType === 'image'
                  ? 'image/*'
                  : 'image/*,video/*'
              }
              disabled={uploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Folder Pills Bar */}
        <div className="px-6 py-2 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider me-1">
            Folder:
          </span>
          {FOLDERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFolder(f.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeFolder === f.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="p-6 overflow-y-auto flex-1 min-h-[340px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-xs">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-persici-crimson rounded-full animate-spin mb-3" />
              <span>Fetching Cloudflare R2 media...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-xs space-y-2">
              {activeType === 'video' ? (
                <TbVideo className="w-12 h-12 text-slate-300" />
              ) : (
                <TbPhoto className="w-12 h-12 text-slate-300" />
              )}
              <p className="font-semibold text-slate-700">
                No {activeType === 'video' ? 'videos' : activeType === 'image' ? 'images' : 'assets'} found in this filter
              </p>
              <p className="text-[11px] text-slate-400">
                Switch filters or click &ldquo;Upload&rdquo; to add a new file.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filteredItems.map((item) => (
                <div
                  key={item.key}
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  className="group relative border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-persici-crimson hover:shadow-md transition-all bg-slate-50 flex flex-col aspect-square"
                >
                  {/* Thumbnail Container */}
                  <div className="flex-1 relative overflow-hidden bg-slate-100 flex items-center justify-center">
                    {item.mediaType === 'image' ? (
                      <Image
                        src={item.url}
                        alt={item.key}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                    ) : item.mediaType === 'video' ? (
                      <div className="w-full h-full relative bg-slate-900 flex items-center justify-center">
                        {item.thumbnailUrl ? (
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.key}
                            fill
                            className="object-cover opacity-80 group-hover:scale-105 transition-transform"
                            sizes="(max-width: 768px) 50vw, 20vw"
                          />
                        ) : (
                          <div className="text-slate-600">
                            <TbVideo className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-persici-crimson/90 text-white flex items-center justify-center shadow">
                            <TbPlayerPlay className="w-4 h-4 ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[9px] uppercase">
                          {item.format || 'VIDEO'}
                        </span>
                      </div>
                    ) : (
                      <div className="p-2 text-center text-slate-500 font-mono text-[10px] uppercase">
                        {item.format}
                      </div>
                    )}

                    {/* Hover Select Badge */}
                    <div className="absolute inset-0 bg-persici-crimson/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs gap-1">
                      <TbCheck className="w-4 h-4" />
                      <span>Select</span>
                    </div>
                  </div>

                  {/* Metadata Bar */}
                  <div className="p-2 bg-white border-t border-slate-100 text-[10px]">
                    <p className="font-semibold text-slate-800 truncate" title={item.key}>
                      {item.key.split('/').pop()}
                    </p>
                    <div className="flex items-center justify-between mt-0.5 text-slate-400">
                      <span className="uppercase font-medium">{item.format || item.mediaType}</span>
                      <span>{(item.size / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
          <span className="text-[11px]">
            Serving media from Cloudflare R2 bucket &bull; Auto-optimized
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
