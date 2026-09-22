'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  TbPhoto,
  TbVideo,
  TbFileText,
  TbArchive,
  TbFile,
  TbLayoutGrid,
  TbList,
  TbUpload,
  TbTrash,
  TbCopy,
  TbCheck,
  TbSearch,
  TbFolder,
  TbExternalLink,
  TbRefresh,
  TbPlayerPlay,
  TbCamera,
  TbDownload,
  TbX,
  TbFilter,
} from 'react-icons/tb';

export interface MediaItem {
  key: string;
  url: string;
  size: number;
  lastModified?: string;
  mediaType: 'image' | 'video' | 'document' | 'archive' | 'other';
  format: string;
  thumbnailUrl?: string | null;
  alt?: string;
  width?: number;
  height?: number;
}

const FOLDERS = [
  { id: '', labelEn: 'All Folders', labelAr: 'كل المجلدات' },
  { id: 'heroes', labelEn: 'Hero Banners', labelAr: 'بانرات الواجهة' },
  { id: 'solutions', labelEn: 'Solutions', labelAr: 'الحلول والخدمات' },
  { id: 'industries', labelEn: 'Industries', labelAr: 'القطاعات' },
  { id: 'projects', labelEn: 'Projects', labelAr: 'المشاريع' },
  { id: 'team', labelEn: 'Leadership & Team', labelAr: 'فريق العمل' },
  { id: 'logos', labelEn: 'Client Logos', labelAr: 'شعارات العملاء' },
  { id: 'videos', labelEn: 'Showreels & Videos', labelAr: 'الفيديوهات والعروض' },
  { id: 'general', labelEn: 'General Assets', labelAr: 'ملفات عامة' },
];

const TYPE_FILTERS: Array<{ id: string; labelEn: string; labelAr: string }> = [
  { id: 'all', labelEn: 'All Assets', labelAr: 'جميع الوسائط' },
  { id: 'image', labelEn: 'Images', labelAr: 'الصور' },
  { id: 'video', labelEn: 'Videos', labelAr: 'الفيديوهات' },
  { id: 'document', labelEn: 'Documents', labelAr: 'المستندات' },
  { id: 'archive', labelEn: 'Archives', labelAr: 'الأرشيف والمضغوط' },
];

export default function MediaLibraryPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [gridCols, setGridCols] = useState<number>(4); // 2, 3, 4, 5, 6

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [capturingFrame, setCapturingFrame] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const customPosterInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/media', window.location.origin);
      if (activeFolder) url.searchParams.set('folder', activeFolder);
      if (activeType && activeType !== 'all') url.searchParams.set('type', activeType);

      const res = await fetch(url.toString(), { cache: 'no-store' });
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Failed to load media items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [activeFolder, activeType]);

  // Client-side automatic video thumbnail extraction from uploaded video file
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
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setUploadProgress(
      isRtl ? `جارٍ معالجة ورفع الملف: ${file.name}...` : `Optimizing and uploading ${file.name}...`
    );

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', activeFolder || (file.type.startsWith('video/') ? 'videos' : 'general'));

      // If video, attempt auto-generating a thumbnail poster before pushing
      if (file.type.startsWith('video/')) {
        setUploadProgress(
          isRtl ? 'إنشاء صورة مصغرة للفيديو تلقائياً...' : 'Generating video poster thumbnail...'
        );
        const thumbBlob = await extractThumbnailFromVideoFile(file);
        if (thumbBlob) {
          formData.append('thumbnail', thumbBlob, `${file.name}-poster.webp`);
        }
      }

      setUploadProgress(
        isRtl ? 'جارٍ الإرسال إلى سحابة Cloudflare R2...' : 'Uploading to Cloudflare R2...'
      );

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadProgress(
          isRtl ? 'تم رفع الملف وحفظه بنجاح!' : 'Asset successfully uploaded to Cloudflare R2!'
        );
        setTimeout(() => setUploadProgress(null), 3000);
        fetchMedia();
      } else {
        alert(data.error || 'Upload failed');
        setUploadProgress(null);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadProgress(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (key: string) => {
    const confirmMsg = isRtl
      ? `هل أنت متأكد من رغبتك في حذف "${key}" نهائياً من Cloudflare R2؟`
      : `Are you sure you want to permanently delete "${key}" from Cloudflare R2?`;
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/media?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.key !== key));
        if (selectedItem?.key === key) setSelectedItem(null);
        if (previewItem?.key === key) setPreviewItem(null);
      }
    } catch (err) {
      console.error('Failed to delete media item:', err);
    }
  };

  const copyToClipboard = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Capture current video frame while playing in preview modal
  const handleCaptureVideoFrame = async () => {
    if (!videoPlayerRef.current || !previewItem) return;
    setCapturingFrame(true);

    try {
      const video = videoPlayerRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get 2D canvas context');

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailDataUrl = canvas.toDataURL('image/webp', 0.9);

      const res = await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: previewItem.key,
          thumbnailDataUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.thumbnailUrl) {
        // Update local item
        const updated = { ...previewItem, thumbnailUrl: data.thumbnailUrl };
        setPreviewItem(updated);
        setSelectedItem(updated);
        setItems((prev) =>
          prev.map((i) => (i.key === previewItem.key ? updated : i))
        );
      } else {
        alert(data.error || 'Failed to capture thumbnail');
      }
    } catch (err) {
      console.error('Failed to capture frame:', err);
      alert('Could not capture frame from video');
    } finally {
      setCapturingFrame(false);
    }
  };

  // Upload custom poster image for a video
  const handleUploadCustomPoster = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const targetItem = previewItem || selectedItem;
    if (!files || files.length === 0 || !targetItem) return;

    try {
      const formData = new FormData();
      formData.append('key', targetItem.key);
      formData.append('thumbnailFile', files[0]);

      const res = await fetch('/api/media', {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.thumbnailUrl) {
        const updated = { ...targetItem, thumbnailUrl: data.thumbnailUrl };
        if (previewItem?.key === targetItem.key) setPreviewItem(updated);
        if (selectedItem?.key === targetItem.key) setSelectedItem(updated);
        setItems((prev) =>
          prev.map((i) => (i.key === targetItem.key ? updated : i))
        );
      } else {
        alert(data.error || 'Failed to upload custom poster');
      }
    } catch (err) {
      console.error('Failed to upload custom poster:', err);
    } finally {
      if (customPosterInputRef.current) customPosterInputRef.current.value = '';
    }
  };

  const filteredItems = items.filter((item) => {
    const searchLower = search.toLowerCase();
    return item.key.toLowerCase().includes(searchLower) || (item.alt || '').toLowerCase().includes(searchLower);
  });

  const getGridColsClass = (cols: number) => {
    switch (cols) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
      case 5:
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
      case 6:
        return 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6';
      default:
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
    }
  };

  const renderMediaThumbnail = (item: MediaItem, aspectClass = 'aspect-square') => {
    if (item.mediaType === 'image') {
      return (
        <div className={`${aspectClass} bg-slate-100 relative overflow-hidden flex items-center justify-center`}>
          <Image
            src={item.url}
            alt={item.alt || item.key}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      );
    }

    if (item.mediaType === 'video') {
      return (
        <div className={`${aspectClass} bg-slate-900 relative overflow-hidden flex items-center justify-center`}>
          {item.thumbnailUrl ? (
            <Image
              src={item.thumbnailUrl}
              alt={item.key}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center">
              <TbVideo className="w-10 h-10 text-slate-500 opacity-60" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-persici-crimson/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <TbPlayerPlay className="w-5 h-5 ml-0.5" />
            </div>
          </div>
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
            {item.format || 'VIDEO'}
          </span>
        </div>
      );
    }

    if (item.mediaType === 'document') {
      return (
        <div className={`${aspectClass} bg-amber-50 relative overflow-hidden flex flex-col items-center justify-center p-4 text-center border-b border-slate-100`}>
          <TbFileText className="w-12 h-12 text-amber-600 mb-1" />
          <span className="text-[11px] font-bold text-amber-800 uppercase">{item.format || 'DOC'}</span>
        </div>
      );
    }

    if (item.mediaType === 'archive') {
      return (
        <div className={`${aspectClass} bg-purple-50 relative overflow-hidden flex flex-col items-center justify-center p-4 text-center border-b border-slate-100`}>
          <TbArchive className="w-12 h-12 text-purple-600 mb-1" />
          <span className="text-[11px] font-bold text-purple-800 uppercase">{item.format || 'ZIP'}</span>
        </div>
      );
    }

    return (
      <div className={`${aspectClass} bg-slate-100 relative overflow-hidden flex flex-col items-center justify-center p-4 text-center`}>
        <TbFile className="w-12 h-12 text-slate-400 mb-1" />
        <span className="text-[11px] font-bold text-slate-600 uppercase">{item.format || 'FILE'}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,video/*,.pdf,.doc,.docx,.zip"
        className="hidden"
      />
      <input
        type="file"
        ref={customPosterInputRef}
        onChange={handleUploadCustomPoster}
        accept="image/*"
        className="hidden"
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-1">
            <span>{isRtl ? 'التخزين وشبكة التوصيل العالمية' : 'Storage & Global CDN'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isRtl ? 'مكتبة وسائط Cloudflare R2' : 'Cloudflare R2 Media Library'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isRtl
              ? 'إدارة الصور والفيديوهات والملفات. تشغيل واستعراض الفيديوهات مع توليد وتحديث الصور المصغرة تلقائياً.'
              : 'Browse, upload, and optimize images, videos, and files. Preview videos with interactive auto-generated thumbnails.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <TbUpload className="w-4 h-4" />
            <span>{uploading ? (isRtl ? 'جارٍ الرفع والمعالجة...' : 'Uploading...') : isRtl ? 'رفع وسائط جديدة' : 'Upload Asset'}</span>
          </button>

          <button
            type="button"
            onClick={fetchMedia}
            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title={isRtl ? 'تحديث' : 'Refresh'}
          >
            <TbRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {uploadProgress && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2 animate-in fade-in">
          <TbCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadProgress}</span>
        </div>
      )}

      {/* Controls Bar: Type Filters, Search, Views & Density */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        {/* Row 1: Type Filters + View Mode + Grid Density */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Media Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {TYPE_FILTERS.map((tf) => (
              <button
                key={tf.id}
                type="button"
                onClick={() => setActiveType(tf.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                  activeType === tf.id
                    ? 'bg-persici-crimson text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tf.id === 'image' && <TbPhoto className="w-3.5 h-3.5" />}
                {tf.id === 'video' && <TbVideo className="w-3.5 h-3.5" />}
                {tf.id === 'document' && <TbFileText className="w-3.5 h-3.5" />}
                {tf.id === 'archive' && <TbArchive className="w-3.5 h-3.5" />}
                {tf.id === 'all' && <TbFilter className="w-3.5 h-3.5" />}
                <span>{isRtl ? tf.labelAr : tf.labelEn}</span>
              </button>
            ))}
          </div>

          {/* Right Toolbar: View Toggle & Grid Columns Selector */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            {/* Grid Density Selector (Only in Grid Mode) */}
            {viewMode === 'grid' && (
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <span className="text-[10px] font-semibold text-slate-400 px-1.5 uppercase">
                  {isRtl ? 'الأعمدة' : 'Columns'}:
                </span>
                {[2, 3, 4, 5, 6].map((cols) => (
                  <button
                    key={cols}
                    type="button"
                    onClick={() => setGridCols(cols)}
                    className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-lg transition-colors ${
                      gridCols === cols
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title={`${cols} columns per row`}
                  >
                    {cols}
                  </button>
                ))}
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <TbLayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">{isRtl ? 'شبكة' : 'Grid'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="List View"
              >
                <TbList className="w-4 h-4" />
                <span className="hidden sm:inline">{isRtl ? 'قائمة' : 'List'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Folder Pills + Search */}
        <div className="flex flex-col md:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          {/* Folder Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {FOLDERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFolder(f.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeFolder === f.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <TbFolder className="w-3.5 h-3.5 opacity-70" />
                <span>{isRtl ? f.labelAr : f.labelEn}</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <TbSearch className={`w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
            <input
              type="text"
              placeholder={isRtl ? 'البحث عن ملف بالاسم أو الوصف...' : 'Search assets by file key or name...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson`}
            />
          </div>
        </div>
      </div>

      {/* Main Content: Grid / List Layout + Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedItem ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all`}>
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-persici-crimson border-t-transparent mb-3" />
              <p className="text-sm">{isRtl ? 'جارٍ الاتصال بسحابة Cloudflare R2...' : 'Connecting to Cloudflare R2 bucket...'}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <TbPhoto className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
              <p className="text-sm font-medium text-slate-700">
                {isRtl ? 'لم يتم العثور على ملفات وسائط مطابقة' : 'No media assets found'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'جرب تغيير المجلد أو النوع، أو قم برفع ملف جديد.' : 'Try selecting another folder or upload a new asset.'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW WITH DYNAMIC COLUMNS */
            <div className={`grid ${getGridColsClass(gridCols)} gap-4`}>
              {filteredItems.map((item) => {
                const isSelected = selectedItem?.key === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => setSelectedItem(item)}
                    className={`group relative bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-persici-crimson ring-2 ring-persici-crimson/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="relative">
                      {renderMediaThumbnail(item, 'aspect-square')}

                      {/* Quick Hover Action Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewItem(item);
                          }}
                          className="p-2 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-xs font-semibold shadow flex items-center gap-1"
                          title={isRtl ? 'معاينة وتشغيل' : 'Preview & Play'}
                        >
                          {item.mediaType === 'video' ? (
                            <TbPlayerPlay className="w-4 h-4 text-persici-crimson" />
                          ) : (
                            <TbExternalLink className="w-4 h-4 text-slate-700" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(item.url, item.key);
                          }}
                          className="p-2 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-xs font-semibold shadow"
                          title={isRtl ? 'نسخ الرابط المباشر' : 'Copy CDN URL'}
                        >
                          {copiedKey === item.key ? (
                            <TbCheck className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <TbCopy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white">
                      <p className="text-xs font-semibold text-slate-800 truncate" title={item.key}>
                        {item.key.split('/').pop()}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                        <span className="uppercase font-medium px-1.5 py-0.2 bg-slate-100 rounded text-slate-600">
                          {item.format || item.mediaType}
                        </span>
                        <span>{(item.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW TABLE */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="px-4 py-3">{isRtl ? 'المعاينة' : 'Preview'}</th>
                      <th className="px-4 py-3">{isRtl ? 'اسم الملف والمفتاح' : 'File Name & Key'}</th>
                      <th className="px-4 py-3">{isRtl ? 'النوع' : 'Type'}</th>
                      <th className="px-4 py-3">{isRtl ? 'الحجم' : 'Size'}</th>
                      <th className="px-4 py-3 text-right">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => {
                      const isSelected = selectedItem?.key === item.key;
                      return (
                        <tr
                          key={item.key}
                          onClick={() => setSelectedItem(item)}
                          className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                            isSelected ? 'bg-persici-crimson/5' : ''
                          }`}
                        >
                          <td className="px-4 py-3 w-16">
                            <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-slate-200 shrink-0">
                              {renderMediaThumbnail(item, 'w-full h-full')}
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            <p className="font-semibold text-slate-900 truncate" title={item.key}>
                              {item.key.split('/').pop()}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono truncate" title={item.key}>
                              {item.key}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                              {item.format || item.mediaType}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-700">
                            {(item.size / 1024).toFixed(1)} KB
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => setPreviewItem(item)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                                title={isRtl ? 'معاينة' : 'Preview'}
                              >
                                {item.mediaType === 'video' ? (
                                  <TbPlayerPlay className="w-4 h-4 text-persici-crimson" />
                                ) : (
                                  <TbExternalLink className="w-4 h-4" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => copyToClipboard(item.url, item.key)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                                title={isRtl ? 'نسخ الرابط' : 'Copy CDN URL'}
                              >
                                {copiedKey === item.key ? (
                                  <TbCheck className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <TbCopy className="w-4 h-4" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(item.key)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                                title={isRtl ? 'حذف' : 'Delete'}
                              >
                                <TbTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Selected Asset Inspector Drawer */}
        {selectedItem && (
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-6 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 truncate flex-1">
                  {isRtl ? 'تفاصيل الملف المختار' : 'Asset Inspector'}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="text-xs text-slate-400 hover:text-slate-700 px-2 py-0.5 rounded"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>

              {/* Thumbnail / Preview Canvas */}
              <div className="aspect-video relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                {selectedItem.mediaType === 'image' ? (
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.key}
                    fill
                    className="object-contain"
                  />
                ) : selectedItem.mediaType === 'video' ? (
                  <div className="w-full h-full relative bg-black flex items-center justify-center">
                    {selectedItem.thumbnailUrl ? (
                      <Image
                        src={selectedItem.thumbnailUrl}
                        alt={selectedItem.key}
                        fill
                        className="object-cover opacity-75"
                      />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setPreviewItem(selectedItem)}
                      className="relative z-10 w-12 h-12 rounded-full bg-persici-crimson text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                    >
                      <TbPlayerPlay className="w-6 h-6 ml-0.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <TbFileText className="w-12 h-12 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs uppercase font-bold text-slate-600">{selectedItem.format}</span>
                  </div>
                )}
              </div>

              {/* Action: Open Interactive Preview */}
              <button
                type="button"
                onClick={() => setPreviewItem(selectedItem)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {selectedItem.mediaType === 'video' ? (
                  <>
                    <TbPlayerPlay className="w-4 h-4" />
                    <span>{isRtl ? 'تشغيل الفيديو والمعاينة' : 'Play & Preview Video'}</span>
                  </>
                ) : (
                  <>
                    <TbExternalLink className="w-4 h-4" />
                    <span>{isRtl ? 'معاينة بحجم كامل' : 'View Full Media Preview'}</span>
                  </>
                )}
              </button>

              {/* Video Thumbnail Options (If video) */}
              {selectedItem.mediaType === 'video' && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-900">
                      {isRtl ? 'الصورة المصغرة (Poster)' : 'Video Poster Thumbnail'}
                    </span>
                    {selectedItem.thumbnailUrl && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                        {isRtl ? 'موجودة' : 'Active'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-700">
                    {isRtl
                      ? 'يمكنك تغيير الصورة المصغرة برفع صورة مخصصة أو التقاط لقطة أثناء تشغيل الفيديو.'
                      : 'Customize the poster by uploading an image or capturing a frame during playback.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => customPosterInputRef.current?.click()}
                    className="w-full py-1.5 bg-white border border-amber-300 text-amber-900 font-medium rounded-lg text-xs hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <TbCamera className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isRtl ? 'رفع صورة مصغرة مخصصة' : 'Upload Custom Poster Image'}</span>
                  </button>
                </div>
              )}

              {/* Asset Metadata */}
              <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium">{isRtl ? 'المفتاح: ' : 'Key: '}</span>
                  <span className="text-slate-800 font-mono text-[11px] break-all">{selectedItem.key}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">{isRtl ? 'الحجم: ' : 'File Size: '}</span>
                  <span className="text-slate-800 font-semibold">{(selectedItem.size / 1024).toFixed(1)} KB</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">{isRtl ? 'النوع / الصيغة: ' : 'Format / Type: '}</span>
                  <span className="text-persici-crimson font-semibold uppercase">{selectedItem.format || selectedItem.mediaType}</span>
                </div>
              </div>

              {/* Public CDN URL Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isRtl ? 'رابط CDN العام' : 'Public CDN Link'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={selectedItem.url}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-700 truncate"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedItem.url, selectedItem.key)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                    title={isRtl ? 'نسخ الرابط' : 'Copy URL'}
                  >
                    {copiedKey === selectedItem.key ? (
                      <TbCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <TbCopy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-persici-crimson hover:underline flex items-center gap-1"
                >
                  <TbDownload className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تنزيل الملف' : 'Download File'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedItem.key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
                >
                  <TbTrash className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'حذف الملف' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INTERACTIVE MEDIA & VIDEO PREVIEW MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2 truncate">
                {previewItem.mediaType === 'video' ? (
                  <TbVideo className="w-5 h-5 text-persici-crimson shrink-0" />
                ) : (
                  <TbPhoto className="w-5 h-5 text-persici-crimson shrink-0" />
                )}
                <span className="text-sm font-bold truncate">{previewItem.key.split('/').pop()}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  {previewItem.format || previewItem.mediaType}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 bg-slate-950 flex items-center justify-center min-h-[360px] max-h-[65vh] overflow-hidden relative">
              {previewItem.mediaType === 'video' ? (
                <video
                  ref={videoPlayerRef}
                  controls
                  autoPlay
                  playsInline
                  crossOrigin="anonymous"
                  poster={previewItem.thumbnailUrl || undefined}
                  src={previewItem.url}
                  className="w-full max-h-[60vh] rounded-xl object-contain shadow-xl"
                />
              ) : previewItem.mediaType === 'image' ? (
                <div className="relative w-full h-[60vh]">
                  <Image
                    src={previewItem.url}
                    alt={previewItem.key}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="text-center p-12 text-white space-y-3">
                  <TbFileText className="w-16 h-16 mx-auto text-persici-crimson" />
                  <p className="text-base font-bold">{previewItem.key.split('/').pop()}</p>
                  <p className="text-xs text-slate-400">
                    {previewItem.format.toUpperCase()} • {(previewItem.size / 1024).toFixed(1)} KB
                  </p>
                  <a
                    href={previewItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700"
                  >
                    <TbDownload className="w-4 h-4" />
                    <span>{isRtl ? 'تحميل أو فتح الملف' : 'Download or Open'}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Video Specific Tool: Capture Frame / Set Poster */}
              {previewItem.mediaType === 'video' ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={capturingFrame}
                    onClick={handleCaptureVideoFrame}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
                  >
                    <TbCamera className="w-4 h-4" />
                    <span>
                      {capturingFrame
                        ? isRtl
                          ? 'جارٍ حفظ اللقطة...'
                          : 'Capturing...'
                        : isRtl
                        ? '📸 تعيين الإطار الحالي كصورة مصغرة'
                        : '📸 Set Current Frame as Thumbnail'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => customPosterInputRef.current?.click()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                  >
                    {isRtl ? 'رفع صورة مصغرة' : 'Upload Poster'}
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">{isRtl ? 'الحجم: ' : 'Size: '}</span>
                  {(previewItem.size / 1024).toFixed(1)} KB
                </div>
              )}

              {/* Common Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(previewItem.url, previewItem.key)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  {copiedKey === previewItem.key ? (
                    <>
                      <TbCheck className="w-4 h-4 text-emerald-600" />
                      <span>{isRtl ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <TbCopy className="w-4 h-4" />
                      <span>{isRtl ? 'نسخ الرابط' : 'Copy CDN Link'}</span>
                    </>
                  )}
                </button>

                <a
                  href={previewItem.url}
                  target="_blank"
                  download
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-persici-crimson text-white hover:bg-red-700 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  <TbDownload className="w-4 h-4" />
                  <span>{isRtl ? 'تنزيل' : 'Download'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
