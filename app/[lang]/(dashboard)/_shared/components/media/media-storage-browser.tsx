'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  TbPhoto,
  TbVideo,
  TbFileText,
  TbMusic,
  TbArchive,
  TbFile,
  TbUpload,
  TbSearch,
  TbFilter,
  TbFolder,
  TbLayoutGrid,
  TbList,
  TbRefresh,
  TbPlayerPlay,
  TbCopy,
  TbCheck,
  TbX,
  TbSortAscending,
  TbEye,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbInfinity,
} from 'react-icons/tb';
import {
  MediaItem,
  SortOption,
  FOLDERS,
  TYPE_FILTERS,
  MediaStorageBrowserProps,
} from './types';
import { MediaDetailsInspector } from './media-details-inspector';
import { MediaPreviewModal } from './media-preview-modal';

export function MediaStorageBrowser({
  mode = 'standalone',
  allowedType = 'all',
  defaultFolder = '',
  onSelect,
  onClose,
  className = '',
}: MediaStorageBrowserProps) {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  // Data & State
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState(defaultFolder);
  const [activeType, setActiveType] = useState<string>(allowedType);
  const [prevAllowedType, setPrevAllowedType] = useState(allowedType);
  if (allowedType !== prevAllowedType) {
    setPrevAllowedType(allowedType);
    if (allowedType && allowedType !== 'all') {
      setActiveType(allowedType);
    }
  }

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [gridCols, setGridCols] = useState<number>(mode === 'picker' ? 4 : 4);

  // Selection & Inspector
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Uploading
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Media Items callback
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFolder) params.set('folder', activeFolder);
      if (activeType && activeType !== 'all') params.set('type', activeType);
      if (sort) params.set('sort', sort);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/media?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Failed to load media items:', err);
    } finally {
      setLoading(false);
    }
  }, [activeFolder, activeType, sort, search]);

  useEffect(() => {
    let ignore = false;
    const runFetch = async () => {
      try {
        const params = new URLSearchParams();
        if (activeFolder) params.set('folder', activeFolder);
        if (activeType && activeType !== 'all') params.set('type', activeType);
        if (sort) params.set('sort', sort);
        if (search.trim()) params.set('search', search.trim());

        const res = await fetch(`/api/media?${params.toString()}`, { cache: 'no-store' });
        const data = await res.json();
        if (!ignore && data.items) {
          setItems(data.items);
        }
      } catch (err) {
        if (!ignore) console.error('Failed to load media items:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void runFetch();
    return () => {
      ignore = true;
    };
  }, [activeFolder, activeType, sort, search]);

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

  // Upload handler for single or batch files
  const processFilesUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const targetFolder = activeFolder || 'general';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(
        isRtl
          ? `جارٍ معالجة ورفع (${i + 1}/${files.length}): ${file.name}...`
          : `Processing & uploading (${i + 1}/${files.length}): ${file.name}...`
      );

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', targetFolder);

        // Auto-extract thumbnail if video
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
        if (res.ok && data.media) {
          if (mode === 'picker' && files.length === 1 && onSelect) {
            // In single file picker upload, auto-select right away
            onSelect(data.media.url, data.media);
            onClose?.();
            return;
          }
        } else {
          alert(data.error || `Failed to upload ${file.name}`);
        }
      } catch (err) {
        console.error('File upload error:', err);
        alert(`Failed to upload ${file.name}`);
      }
    }

    setUploadProgress(isRtl ? 'تم رفع جميع الملفات بنجاح!' : 'All files uploaded successfully!');
    setTimeout(() => setUploadProgress(null), 3000);
    setUploading(false);
    fetchMedia();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyUrl = (url: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered Items (client-side instant search)
  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const lower = search.toLowerCase();
    return items.filter(
      (i) =>
        i.key.toLowerCase().includes(lower) ||
        i.filename.toLowerCase().includes(lower) ||
        (i.alt || '').toLowerCase().includes(lower) ||
        (i.title || '').toLowerCase().includes(lower)
    );
  }, [items, search]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const [paginationMode, setPaginationMode] = useState<'paged' | 'infinite'>('paged');

  // Reset to page 1 during render whenever search, folder, type, or sort changes
  const [prevFilterKey, setPrevFilterKey] = useState<string>('');
  const currentFilterKey = `${search}|${activeFolder}|${activeType}|${sort}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setCurrentPage(1);
  }

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / (pageSize || 24)));

  const displayedItems = useMemo(() => {
    if (paginationMode === 'infinite') {
      return filteredItems;
    }
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, paginationMode, pageSize, currentPage]);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const getPageNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const getGridColsClass = (cols: number, hasInspector: boolean) => {
    if (hasInspector) {
      switch (cols) {
        case 2:
          return 'grid-cols-1 sm:grid-cols-2';
        case 3:
          return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
        case 4:
          return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4';
        case 5:
          return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4';
        case 6:
          return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5';
        default:
          return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4';
      }
    }
    switch (cols) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4';
      case 5:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
      case 6:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
      default:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4';
    }
  };

  // Thumbnail render helper
  const renderThumbnail = (item: MediaItem, aspectClass = 'aspect-square') => {
    if (item.mediaType === 'image') {
      return (
        <div className={`${aspectClass} bg-slate-100 relative overflow-hidden flex items-center justify-center`}>
          <Image
            src={item.url}
            alt={item.alt || item.filename}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      );
    }

    if (item.mediaType === 'video') {
      return (
        <div className={`${aspectClass} bg-slate-950 relative overflow-hidden flex items-center justify-center`}>
          {item.thumbnailUrl ? (
            <Image
              src={item.thumbnailUrl}
              alt={item.key}
              fill
              unoptimized
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <TbVideo className="w-10 h-10 text-slate-600" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-persici-crimson text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <TbPlayerPlay className="w-4 h-4 ml-0.5" />
            </div>
          </div>
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[9px] uppercase tracking-wider backdrop-blur-2xs">
            {item.format}
          </span>
        </div>
      );
    }

    if (item.mediaType === 'document') {
      return (
        <div className={`${aspectClass} bg-amber-50/70 relative overflow-hidden flex flex-col items-center justify-center p-3 text-center border-b border-slate-100`}>
          <TbFileText className="w-10 h-10 text-amber-600 mb-1" />
          <span className="font-mono text-[10px] font-bold text-amber-900 uppercase">{item.format || 'DOC'}</span>
        </div>
      );
    }

    if (item.mediaType === 'audio') {
      return (
        <div className={`${aspectClass} bg-purple-50/70 relative overflow-hidden flex flex-col items-center justify-center p-3 text-center border-b border-slate-100`}>
          <TbMusic className="w-10 h-10 text-purple-600 mb-1" />
          <span className="font-mono text-[10px] font-bold text-purple-900 uppercase">{item.format || 'AUDIO'}</span>
        </div>
      );
    }

    if (item.mediaType === 'archive') {
      return (
        <div className={`${aspectClass} bg-emerald-50/70 relative overflow-hidden flex flex-col items-center justify-center p-3 text-center border-b border-slate-100`}>
          <TbArchive className="w-10 h-10 text-emerald-600 mb-1" />
          <span className="font-mono text-[10px] font-bold text-emerald-900 uppercase">{item.format || 'ZIP'}</span>
        </div>
      );
    }

    return (
      <div className={`${aspectClass} bg-slate-100 relative overflow-hidden flex flex-col items-center justify-center p-3 text-center`}>
        <TbFile className="w-10 h-10 text-slate-400 mb-1" />
        <span className="font-mono text-[10px] font-bold text-slate-600 uppercase">{item.format || 'FILE'}</span>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col h-full ${className}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files) {
          processFilesUpload(e.dataTransfer.files);
        }
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        multiple
        onChange={(e) => e.target.files && processFilesUpload(e.target.files)}
        className="hidden"
      />

      {/* Upload Progress Banner */}
      {uploadProgress && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <TbCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadProgress}</span>
          </div>
          {uploading && (
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
        </div>
      )}

      {/* Drag & Drop Overlay Indicator */}
      {isDragOver && (
        <div className="absolute inset-0 z-40 bg-persici-crimson/10 border-2 border-dashed border-persici-crimson rounded-3xl flex items-center justify-center pointer-events-none backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center space-y-2">
            <TbUpload className="w-10 h-10 text-persici-crimson mx-auto animate-bounce" />
            <p className="text-sm font-bold text-slate-900">
              {isRtl ? 'أفلت الملفات هنا لرفعها فوراً إلى Cloudflare R2' : 'Drop files here to upload directly to Cloudflare R2'}
            </p>
          </div>
        </div>
      )}

      {/* Toolbar Container */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3 mb-5">
        {/* Row 1: Type Filters + Search + Upload */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Type Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-2 lg:pb-0">
            {TYPE_FILTERS.map((tf) => (
              <button
                key={tf.id}
                type="button"
                onClick={() => setActiveType(tf.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                  activeType === tf.id
                    ? 'bg-persici-crimson text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tf.id === 'all' && <TbFilter className="w-3.5 h-3.5" />}
                {tf.id === 'image' && <TbPhoto className="w-3.5 h-3.5" />}
                {tf.id === 'video' && <TbVideo className="w-3.5 h-3.5" />}
                {tf.id === 'document' && <TbFileText className="w-3.5 h-3.5" />}
                {tf.id === 'audio' && <TbMusic className="w-3.5 h-3.5" />}
                {tf.id === 'archive' && <TbArchive className="w-3.5 h-3.5" />}
                <span>{isRtl ? tf.labelAr : tf.labelEn}</span>
              </button>
            ))}
          </div>

          {/* Search + Upload Buttons */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <TbSearch className={`w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
              <input
                type="text"
                placeholder={isRtl ? 'البحث عن ملف...' : 'Search assets...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className={`absolute ${isRtl ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600`}
                >
                  <TbX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs shrink-0 disabled:opacity-50"
            >
              <TbUpload className="w-4 h-4" />
              <span>{uploading ? (isRtl ? 'جارٍ الرفع...' : 'Uploading...') : isRtl ? 'رفع ملفات' : 'Upload Files'}</span>
            </button>

            <button
              type="button"
              onClick={fetchMedia}
              className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
              title={isRtl ? 'تحديث' : 'Refresh'}
            >
              <TbRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Row 2: Folder Tabs + Sorting + View Mode */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Folders Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin w-full md:w-auto pb-2 md:pb-0">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider me-1 shrink-0">
              {isRtl ? 'المجلد:' : 'Folder:'}
            </span>
            {FOLDERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFolder(f.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                  activeFolder === f.id
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 font-medium'
                }`}
              >
                <TbFolder className="w-3.5 h-3.5 opacity-70" />
                <span>{isRtl ? f.labelAr : f.labelEn}</span>
              </button>
            ))}
          </div>

          {/* Right Controls: Sort & Grid/List View */}
          <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
            {/* Sort Selector */}
            <div className="flex items-center gap-1">
              <TbSortAscending className="w-4 h-4 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="px-2 py-1 bg-slate-100 border-0 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="newest">{isRtl ? 'الأحدث أولاً' : 'Newest'}</option>
                <option value="oldest">{isRtl ? 'الأقدم أولاً' : 'Oldest'}</option>
                <option value="size-desc">{isRtl ? 'الأكبر حجماً' : 'Size (Largest)'}</option>
                <option value="size-asc">{isRtl ? 'الأصغر حجماً' : 'Size (Smallest)'}</option>
                <option value="name-asc">{isRtl ? 'الاسم (أ - ي)' : 'Name (A-Z)'}</option>
                <option value="name-desc">{isRtl ? 'الاسم (ي - أ)' : 'Name (Z-A)'}</option>
              </select>
            </div>

            {/* Grid Density Selector (when in grid mode) */}
            {viewMode === 'grid' && (
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                {[2, 3, 4, 5, 6].map((cols) => (
                  <button
                    key={cols}
                    type="button"
                    onClick={() => setGridCols(cols)}
                    className={`w-6 h-6 flex items-center justify-center text-[11px] font-bold rounded transition-colors ${
                      gridCols === cols
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title={`${cols} columns`}
                  >
                    {cols}
                  </button>
                ))}
              </div>
            )}

            {/* View Mode Switcher */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grid"
              >
                <TbLayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="List"
              >
                <TbList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid/List + Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[420px]">
        {/* Left Column: Media Browser Items */}
        <div className={`${selectedItem ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col transition-all min-w-0`}>
          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 flex-1 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-3 border-slate-200 border-t-persici-crimson rounded-full animate-spin mb-3" />
              <p className="text-sm font-medium">{isRtl ? 'جارٍ الاتصال بسحابة Cloudflare R2...' : 'Connecting to Cloudflare R2 bucket...'}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 flex-1 flex flex-col items-center justify-center">
              <TbPhoto className="w-14 h-14 mx-auto mb-3 opacity-30 text-slate-400" />
              <p className="text-base font-semibold text-slate-700">
                {isRtl ? 'لم يتم العثور على أي ملفات مطابقة' : 'No assets found'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                {isRtl
                  ? 'جرب تغيير المجلد أو النوع، أو قم بسحب وإفلات ملفات لرفعها مباشرة.'
                  : 'Try selecting another folder or filter, or drag and drop files here to upload.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {viewMode === 'grid' ? (
                /* GRID VIEW */
                <div className={`grid ${getGridColsClass(gridCols, Boolean(selectedItem))} gap-3.5 sm:gap-4`}>
                  {displayedItems.map((item) => {
                    const isSelected = selectedItem?.key === item.key;
                    return (
                      <div
                        key={item.key}
                        onClick={() => setSelectedItem(item)}
                        onDoubleClick={() => {
                          if (mode === 'picker' && onSelect) {
                            onSelect(item.url, item);
                            onClose?.();
                          } else {
                            setPreviewItem(item);
                          }
                        }}
                        className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'border-persici-crimson ring-2 ring-persici-crimson/30 shadow-md bg-persici-crimson/[0.01]'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                        {/* Top Preview Area */}
                        <div className="relative w-full overflow-hidden bg-slate-50">
                          {renderThumbnail(item, 'aspect-square w-full')}

                          {/* Selected Checkmark Badge (Top Corner) */}
                          <div
                            className={`absolute top-2.5 ${isRtl ? 'right-2.5' : 'left-2.5'} z-10 transition-transform ${
                              isSelected ? 'scale-100 opacity-100' : 'scale-90 opacity-0 group-hover:opacity-100'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(isSelected ? null : item);
                            }}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                                isSelected
                                  ? 'bg-persici-crimson text-white ring-2 ring-white'
                                  : 'bg-white/90 text-slate-400 hover:text-slate-800 hover:bg-white'
                              }`}
                            >
                              <TbCheck className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-60'}`} />
                            </div>
                          </div>

                          {/* Format Badge (Opposite Top Corner) */}
                          <span
                            className={`absolute top-2.5 ${isRtl ? 'left-2.5' : 'right-2.5'} z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white font-mono text-[9px] font-bold uppercase tracking-wider`}
                          >
                            {item.format || item.mediaType}
                          </span>

                          {/* Hover Action Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-2xs z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewItem(item);
                              }}
                              className="p-2 bg-white/95 hover:bg-white text-slate-900 rounded-xl text-xs font-semibold shadow transition-transform hover:scale-105"
                              title={isRtl ? 'معاينة' : 'Preview'}
                            >
                              <TbEye className="w-4 h-4 text-slate-800" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleCopyUrl(item.url, item.key, e)}
                              className="p-2 bg-white/95 hover:bg-white text-slate-900 rounded-xl text-xs font-semibold shadow transition-transform hover:scale-105"
                              title={isRtl ? 'نسخ الرابط المباشر' : 'Copy CDN URL'}
                            >
                              {copiedKey === item.key ? (
                                <TbCheck className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <TbCopy className="w-4 h-4 text-slate-800" />
                              )}
                            </button>

                            {mode === 'picker' && onSelect && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelect(item.url, item);
                                  onClose?.();
                                }}
                                className="p-2 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow transition-transform hover:scale-105"
                                title={isRtl ? 'اختيار هذا الملف' : 'Select asset'}
                              >
                                <TbCheck className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Card Meta Footer */}
                        <div className="p-3 bg-white border-t border-slate-100 text-xs">
                          <p className="font-semibold text-slate-900 truncate" title={item.filename || item.key}>
                            {item.title || item.filename || item.key.split('/').pop()}
                          </p>
                          <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium truncate max-w-[100px]">
                              {item.folder || 'general'}
                            </span>
                            <span className="font-medium text-slate-500 whitespace-nowrap">
                              {formatFileSize(item.size)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* LIST VIEW TABLE - FULL WIDTH CONTAINER WITH CRISP BORDER RADIUS */
                <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="w-full overflow-x-auto scrollbar-thin">
                    <table className="w-full min-w-[720px] text-start text-xs text-slate-600 border-collapse table-auto">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                        <tr>
                          <th scope="col" className="px-5 py-3.5 text-start w-20 whitespace-nowrap">{isRtl ? 'المعاينة' : 'Preview'}</th>
                          <th scope="col" className="px-5 py-3.5 text-start min-w-[240px]">{isRtl ? 'اسم الملف والمفتاح' : 'File Name & Key'}</th>
                          <th scope="col" className="px-5 py-3.5 text-start w-28 whitespace-nowrap">{isRtl ? 'النوع' : 'Type'}</th>
                          <th scope="col" className="px-5 py-3.5 text-start w-28 whitespace-nowrap">{isRtl ? 'الحجم' : 'Size'}</th>
                          <th scope="col" className="px-5 py-3.5 text-end w-36 whitespace-nowrap">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayedItems.map((item) => {
                          const isSelected = selectedItem?.key === item.key;
                          return (
                            <tr
                              key={item.key}
                              onClick={() => setSelectedItem(item)}
                              className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                                isSelected ? 'bg-persici-crimson/5 font-medium' : ''
                              }`}
                            >
                              <td className="px-5 py-3 w-20">
                                <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-slate-200 shrink-0 bg-slate-100">
                                  {renderThumbnail(item, 'w-full h-full')}
                                </div>
                              </td>
                              <td className="px-5 py-3 min-w-[240px]">
                                <p className="font-semibold text-slate-900 truncate" title={item.filename}>
                                  {item.title || item.filename || item.key.split('/').pop()}
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono truncate" title={item.key}>
                                  {item.key}
                                </p>
                              </td>
                              <td className="px-5 py-3 w-28">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                                  {item.format || item.mediaType}
                                </span>
                              </td>
                              <td className="px-5 py-3 w-28 whitespace-nowrap font-medium text-slate-700">
                                {formatFileSize(item.size)}
                              </td>
                              <td className="px-5 py-3 w-36 text-end whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => setPreviewItem(item)}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                    title={isRtl ? 'معاينة' : 'Preview'}
                                  >
                                    <TbEye className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => handleCopyUrl(item.url, item.key, e)}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                    title={isRtl ? 'نسخ الرابط' : 'Copy CDN URL'}
                                  >
                                    {copiedKey === item.key ? (
                                      <TbCheck className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                      <TbCopy className="w-4 h-4" />
                                    )}
                                  </button>

                                  {mode === 'picker' && onSelect && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onSelect(item.url, item);
                                        onClose?.();
                                      }}
                                      className="px-2.5 py-1.5 bg-persici-crimson hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                                      title={isRtl ? 'اختيار' : 'Select'}
                                    >
                                      <TbCheck className="w-3.5 h-3.5" />
                                      <span>{isRtl ? 'اختيار' : 'Select'}</span>
                                    </button>
                                  )}
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

              {/* PAGINATION CONTROLS BAR */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none">
                {/* Left: Items counter */}
                <div className="text-slate-500 font-medium text-center sm:text-start">
                  {paginationMode === 'paged' ? (
                    <span>
                      {isRtl
                        ? `عرض ${Math.min((currentPage - 1) * pageSize + 1, totalItems)}–${Math.min(currentPage * pageSize, totalItems)} من أصل ${totalItems} ملف`
                        : `Showing ${Math.min((currentPage - 1) * pageSize + 1, totalItems)}–${Math.min(currentPage * pageSize, totalItems)} of ${totalItems} assets`}
                    </span>
                  ) : (
                    <span>
                      {isRtl
                        ? `عرض جميع الملفات (${totalItems} ملف)`
                        : `Showing all ${totalItems} assets (Continuous)`}
                    </span>
                  )}
                </div>

                {/* Center: Page Navigation (Only in paged mode) */}
                {paginationMode === 'paged' && totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    {/* First page button */}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title={isRtl ? 'الصفحة الأولى' : 'First page'}
                    >
                      <TbChevronsLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Prev page button */}
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title={isRtl ? 'الصفحة السابقة' : 'Previous page'}
                    >
                      <TbChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Page numbers */}
                    {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                      typeof p === 'number' ? (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`min-w-[32px] h-8 px-2 rounded-lg font-bold transition-all ${
                            currentPage === p
                              ? 'bg-persici-crimson text-white shadow-xs'
                              : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {p}
                        </button>
                      ) : (
                        <span key={`ellipsis-${idx}`} className="px-1 text-slate-400">
                          &hellip;
                        </span>
                      )
                    )}

                    {/* Next page button */}
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title={isRtl ? 'الصفحة التالية' : 'Next page'}
                    >
                      <TbChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Last page button */}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title={isRtl ? 'الصفحة الأخيرة' : 'Last page'}
                    >
                      <TbChevronsRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                )}

                {/* Right: Page Size & Mode Toggle */}
                <div className="flex items-center gap-2">
                  {/* Items Per Page Selector */}
                  {paginationMode === 'paged' && (
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
                      <span className="px-1.5 text-slate-400">{isRtl ? 'لكل صفحة:' : 'Per page:'}</span>
                      {[12, 24, 48, 96].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setPageSize(size);
                            setCurrentPage(1);
                          }}
                          className={`px-2 py-1 rounded transition-colors ${
                            pageSize === size
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'hover:text-slate-900'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Paged vs All toggle button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaginationMode((m) => (m === 'paged' ? 'infinite' : 'paged'));
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                      paginationMode === 'infinite'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-transparent'
                    }`}
                    title={isRtl ? 'تبديل بين الصفحات وعرض كل الملفات' : 'Toggle between pages and all assets'}
                  >
                    {paginationMode === 'infinite' ? (
                      <>
                        <TbInfinity className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'عرض مستمر (الكل)' : 'All Files'}</span>
                      </>
                    ) : (
                      <>
                        <TbFileText className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'ترقيم الصفحات' : 'Paginated'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Attachment Details Inspector Drawer */}
        {selectedItem && (
          <div className="lg:col-span-4 h-full">
            <MediaDetailsInspector
              key={selectedItem.key}
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onSelect={onSelect}
              mode={mode}
              isRtl={isRtl}
              onOpenPreview={(i) => setPreviewItem(i)}
              onItemUpdated={(updated) => {
                setSelectedItem(updated);
                setItems((prev) => prev.map((x) => (x.key === selectedItem.key ? updated : x)));
              }}
              onItemDeleted={(key) => {
                setItems((prev) => prev.filter((x) => x.key !== key));
                setSelectedItem(null);
                if (previewItem?.key === key) setPreviewItem(null);
              }}
            />
          </div>
        )}
      </div>

      {/* Lightbox / Full Media Preview Modal */}
      {previewItem && (
        <MediaPreviewModal
          item={previewItem}
          isRtl={isRtl}
          onClose={() => setPreviewItem(null)}
          onSelect={onSelect}
          onItemUpdated={(updated) => {
            setPreviewItem(updated);
            if (selectedItem?.key === updated.key) setSelectedItem(updated);
            setItems((prev) => prev.map((x) => (x.key === updated.key ? updated : x)));
          }}
        />
      )}
    </div>
  );
}
