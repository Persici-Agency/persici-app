'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  TbPhoto,
  TbVideo,
  TbFileText,
  TbMusic,
  TbArchive,
  TbDatabase,
  TbCloudCheck,
} from 'react-icons/tb';
import { MediaStorageBrowser } from '@/app/[lang]/(dashboard)/_shared/components/media/media-storage-browser';
import { MediaItem } from '@/app/[lang]/(dashboard)/_shared/components/media/types';

export default function MediaLibraryPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  const [stats, setStats] = useState({
    totalCount: 0,
    totalSize: 0,
    imageCount: 0,
    videoCount: 0,
    docCount: 0,
    audioCount: 0,
  });

  // Calculate live stats
  useEffect(() => {
    fetch('/api/media?limit=1000', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.items && Array.isArray(data.items)) {
          const items: MediaItem[] = data.items;
          const totalCount = items.length;
          const totalSize = items.reduce((acc, i) => acc + (i.size || 0), 0);
          const imageCount = items.filter((i) => i.mediaType === 'image').length;
          const videoCount = items.filter((i) => i.mediaType === 'video').length;
          const docCount = items.filter((i) => i.mediaType === 'document').length;
          const audioCount = items.filter((i) => i.mediaType === 'audio').length;

          setStats({
            totalCount,
            totalSize,
            imageCount,
            videoCount,
            docCount,
            audioCount,
          });
        }
      })
      .catch((err) => console.warn('Could not load storage stats:', err));
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-persici-crimson mb-1.5">
            <TbCloudCheck className="w-4 h-4" />
            <span>{isRtl ? 'سحابة التخزين الموزع Cloudflare R2' : 'Cloudflare R2 Object Storage & CDN'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isRtl ? 'مكتبة التخزين السحابية R2' : 'Storage Library (Cloudflare R2)'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {isRtl
              ? 'نظام تخزين وإدارة شامل لجميع ملفات الموقع: صور، فيديوهات، مستندات PDF، صوتيات، وأرشيف. معاينة مباشرة، وإمكانية تعديل اسم الملف ورابط الـ CDN العام فورياً.'
              : 'Enterprise asset storage for images, showreels, PDF documents, audio, and archives. Features instant preview, metadata inspection, and real-time slug & CDN URL renaming.'}
          </p>
        </div>

        {/* Live Cloudflare R2 Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold self-start sm:self-auto shrink-0 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>persici-media &bull; Storage Library R2 Active</span>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <TbDatabase className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase text-slate-400 truncate">{isRtl ? 'إجمالي الملفات' : 'Total Files'}</p>
            <p className="text-base font-bold text-slate-900">{stats.totalCount}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-persici-crimson/10 text-persici-crimson flex items-center justify-center shrink-0">
            <TbPhoto className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase text-slate-400 truncate">{isRtl ? 'الصور' : 'Images'}</p>
            <p className="text-base font-bold text-slate-900">{stats.imageCount}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-persici-crimson flex items-center justify-center shrink-0">
            <TbVideo className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase text-slate-400 truncate">{isRtl ? 'الفيديوهات' : 'Videos'}</p>
            <p className="text-base font-bold text-slate-900">{stats.videoCount}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <TbFileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase text-slate-400 truncate">{isRtl ? 'مستندات و PDF' : 'PDF & Docs'}</p>
            <p className="text-base font-bold text-slate-900">{stats.docCount}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <TbMusic className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase text-slate-400 truncate">{isRtl ? 'الصوتيات' : 'Audio'}</p>
            <p className="text-base font-bold text-slate-900">{stats.audioCount}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <TbArchive className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase text-slate-400 truncate">{isRtl ? 'المساحة المستهلكة' : 'Storage Size'}</p>
            <p className="text-base font-bold text-slate-900">{formatSize(stats.totalSize)}</p>
          </div>
        </div>
      </div>

      {/* Universal Media Storage Browser */}
      <MediaStorageBrowser mode="standalone" />
    </div>
  );
}
