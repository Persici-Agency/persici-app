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
  TbFolderPlus,
  TbFolderShare,
  TbFolderOpen,
  TbCopyPlus,
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
  TbSparkles,
  TbHome,
  TbTrash,
} from 'react-icons/tb';
import {
  MediaItem,
  FolderOption,
  SortOption,
  DEFAULT_FOLDERS,
  TYPE_FILTERS,
  MediaStorageBrowserProps,
  MAX_FOLDER_DEPTH,
  getFolderDepth,
  getParentFolderPath,
  getFolderBreadcrumbTrail,
  formatFolderDisplayPath,
  type ImageUploadQualityMode,
} from './types';
import { MediaDetailsInspector } from './media-details-inspector';
import { MediaPreviewModal } from './media-preview-modal';
import { CreateFolderModal } from './create-folder-modal';
import { MoveCopyMediaModal } from './move-copy-media-modal';

export function MediaStorageBrowser({
  mode = 'standalone',
  multiple = false,
  allowedType = 'all',
  defaultFolder = '',
  defaultQualityMode = 'high-webp',
  onSelect,
  onSelectMultiple,
  onClose,
  onMediaMutated,
  className = '',
}: MediaStorageBrowserProps) {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  // Data & State
  const [items, setItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<FolderOption[]>(DEFAULT_FOLDERS);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState(defaultFolder);
  const [includeSubfolders, setIncludeSubfolders] = useState(true);
  const [activeType, setActiveType] = useState<string>(allowedType);
  const [prevAllowedType, setPrevAllowedType] = useState(allowedType);
  if (allowedType !== prevAllowedType) {
    setPrevAllowedType(allowedType);
    if (allowedType && allowedType !== 'all') {
      setActiveType(allowedType);
    }
  }
  const [qualityMode, setQualityMode] = useState<ImageUploadQualityMode>(defaultQualityMode);
  const [prevDefaultQualityMode, setPrevDefaultQualityMode] = useState(defaultQualityMode);
  if (defaultQualityMode !== prevDefaultQualityMode) {
    setPrevDefaultQualityMode(defaultQualityMode);
    setQualityMode(defaultQualityMode);
  }

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [gridCols, setGridCols] = useState<number>(mode === 'picker' ? 4 : 4);

  // Selection, Bulk Multi-Select, Modals & Inspector
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedItemsMap, setSelectedItemsMap] = useState<Record<string, MediaItem>>({});
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [createFolderModalState, setCreateFolderModalState] = useState<{
    isOpen: boolean;
    parentFolder: string;
  } | null>(null);
  const [moveCopyModalState, setMoveCopyModalState] = useState<{
    items: MediaItem[];
    mode: 'move' | 'copy';
  } | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);

  // Uploading
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotice = useCallback((msg: string) => {
    setActionNotice(msg);
    setTimeout(() => {
      setActionNotice((prev) => (prev === msg ? null : prev));
    }, 6000);
  }, []);

  // Fetch Media Items callback
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFolder) {
        params.set('folder', activeFolder);
        params.set('includeSubfolders', includeSubfolders ? 'true' : 'false');
      }
      if (activeType && activeType !== 'all') params.set('type', activeType);
      if (sort) params.set('sort', sort);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/media?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
      if (Array.isArray(data.folders) && data.folders.length > 0) {
        setFolders(data.folders);
      }
    } catch (err) {
      console.error('Failed to load media items:', err);
    } finally {
      setLoading(false);
    }
  }, [activeFolder, includeSubfolders, activeType, sort, search]);

  useEffect(() => {
    let ignore = false;
    const runFetch = async () => {
      try {
        const params = new URLSearchParams();
        if (activeFolder) {
          params.set('folder', activeFolder);
          params.set('includeSubfolders', includeSubfolders ? 'true' : 'false');
        }
        if (activeType && activeType !== 'all') params.set('type', activeType);
        if (sort) params.set('sort', sort);
        if (search.trim()) params.set('search', search.trim());

        const res = await fetch(`/api/media?${params.toString()}`, { cache: 'no-store' });
        const data = await res.json();
        if (!ignore && data.items) {
          setItems(data.items);
        }
        if (!ignore && Array.isArray(data.folders) && data.folders.length > 0) {
          setFolders(data.folders);
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
  }, [activeFolder, includeSubfolders, activeType, sort, search]);

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
    const uploadedBatch: MediaItem[] = [];

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
        formData.append('qualityMode', qualityMode);

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
          const uploadedMedia = data.media as MediaItem;
          uploadedBatch.push(uploadedMedia);

          if (mode === 'picker' && !multiple && files.length === 1 && onSelect) {
            // In single-select picker mode with 1 upload, select & close immediately
            onSelect(uploadedMedia.url, uploadedMedia);
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

    if (uploadedBatch.length > 0) {
      setSelectedItemsMap((prev) => {
        const next = { ...prev };
        for (const item of uploadedBatch) {
          next[item.key] = item;
        }
        return next;
      });
      setSelectedKeys((prev) => {
        const merged = new Set(prev);
        for (const item of uploadedBatch) merged.add(item.key);
        return Array.from(merged);
      });
      setSelectedItem(uploadedBatch[0]);
    }

    setUploadProgress(
      mode === 'picker' && multiple && uploadedBatch.length > 0
        ? isRtl
          ? `تم رفع وتحديد ${uploadedBatch.length} ملف داخل "${targetFolder}" — اضغط إدراج لإضافتها للمعرض!`
          : `Uploaded & selected ${uploadedBatch.length} asset(s) in "${targetFolder}" — click Insert Selected below!`
        : isRtl
        ? 'تم رفع جميع الملفات بنجاح!'
        : 'All files uploaded successfully!'
    );
    setTimeout(() => setUploadProgress(null), 4500);
    setUploading(false);
    await fetchMedia();
    onMediaMutated?.();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyUrl = (url: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeySelection = (itemOrKey: MediaItem | string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const key = typeof itemOrKey === 'string' ? itemOrKey : itemOrKey.key;
    const itemObj =
      typeof itemOrKey === 'string'
        ? items.find((i) => i.key === itemOrKey) || selectedItemsMap[itemOrKey]
        : itemOrKey;

    if (itemObj) {
      setSelectedItemsMap((prev) => ({ ...prev, [key]: itemObj }));
    }

    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleDeleteCustomFolder = async (folderItem: FolderOption, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!folderItem.isCustom || deletingFolderId) return;

    const hasItems = (folderItem.count || 0) > 0;
    const confirmMsg = hasItems
      ? isRtl
        ? `المجلد "${folderItem.labelAr}" يحتوي على ${folderItem.count} ملف. هل تريد حذف المجلد ونقل ملفاته إلى المجلد الأب؟`
        : `Folder "${folderItem.labelEn}" contains ${folderItem.count} file(s). Delete folder and move files up to its parent folder?`
      : isRtl
      ? `هل تريد حذف المجلد الفارغ "${folderItem.labelAr}"؟`
      : `Delete empty custom folder "${folderItem.labelEn}"?`;

    if (!confirm(confirmMsg)) return;

    setDeletingFolderId(folderItem.id);
    try {
      const res = await fetch(
        `/api/media/folders?id=${encodeURIComponent(folderItem.id)}${
          hasItems ? '&moveItemsToParent=true' : ''
        }`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to delete folder.');
        return;
      }
      if (activeFolder === folderItem.id || activeFolder.startsWith(`${folderItem.id}/`)) {
        setActiveFolder(getParentFolderPath(folderItem.id));
      }
      if (Array.isArray(data.folders)) {
        setFolders(data.folders);
      }
      showNotice(
        isRtl
          ? `تم حذف المجلد "${folderItem.labelAr}" بنجاح.`
          : `Deleted custom folder "${folderItem.labelEn}".`
      );
      await fetchMedia();
      onMediaMutated?.();
    } catch (err) {
      console.error('Failed to delete custom folder:', err);
      alert('Failed to delete folder.');
    } finally {
      setDeletingFolderId(null);
    }
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
        (i.title || '').toLowerCase().includes(lower) ||
        (i.folder || '').toLowerCase().includes(lower)
    );
  }, [items, search]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const [paginationMode, setPaginationMode] = useState<'paged' | 'infinite'>('paged');

  // Reset to page 1 & clear multi-select during render whenever filters change (preserve cross-folder selection in multiple picker mode)
  const [prevFilterKey, setPrevFilterKey] = useState<string>('');
  const currentFilterKey = `${search}|${activeFolder}|${includeSubfolders}|${activeType}|${sort}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setCurrentPage(1);
    if (!(mode === 'picker' && multiple) && selectedKeys.length > 0) {
      setSelectedKeys([]);
    }
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

  // Hierarchical folder tree helpers
  const rootFolders = useMemo(
    () => folders.filter((f) => f.id === '' || !f.parentId),
    [folders]
  );

  const childSubfolders = useMemo(
    () => (activeFolder ? folders.filter((f) => f.parentId === activeFolder) : []),
    [folders, activeFolder]
  );

  const activeTopLevelRoot = activeFolder
    ? activeFolder.includes('/')
      ? activeFolder.split('/')[0]
      : activeFolder
    : '';

  const breadcrumbTrail = useMemo(
    () => getFolderBreadcrumbTrail(activeFolder, folders),
    [activeFolder, folders]
  );

  const hasSubfoldersMap = useMemo(() => {
    const map = new Set<string>();
    for (const f of folders) {
      if (f.parentId) map.add(f.parentId);
    }
    return map;
  }, [folders]);

  const selectedKeySet = useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const selectedMediaItems = useMemo(
    () =>
      selectedKeys
        .map((k) => selectedItemsMap[k] || items.find((i) => i.key === k))
        .filter((i): i is MediaItem => Boolean(i)),
    [selectedKeys, selectedItemsMap, items]
  );
  const allDisplayedSelected =
    displayedItems.length > 0 && displayedItems.every((i) => selectedKeySet.has(i.key));

  const handleConfirmMultiplePick = () => {
    if (selectedMediaItems.length === 0) return;
    if (onSelectMultiple) {
      onSelectMultiple(
        selectedMediaItems.map((i) => i.url),
        selectedMediaItems
      );
    } else if (onSelect) {
      for (const item of selectedMediaItems) {
        onSelect(item.url, item);
      }
    }
    onClose?.();
  };

  const handleToggleSelectAllDisplayed = () => {
    if (allDisplayedSelected) {
      const dispSet = new Set(displayedItems.map((i) => i.key));
      setSelectedKeys((prev) => prev.filter((k) => !dispSet.has(k)));
    } else {
      setSelectedItemsMap((prev) => {
        const next = { ...prev };
        for (const i of displayedItems) next[i.key] = i;
        return next;
      });
      setSelectedKeys((prev) => {
        const merged = new Set(prev);
        for (const i of displayedItems) merged.add(i.key);
        return Array.from(merged);
      });
    }
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

      {/* Action / Auto-Sync Feedback Banner */}
      {actionNotice && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <TbCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="p-1 text-emerald-600 hover:text-emerald-900 rounded-lg"
          >
            <TbX className="w-3.5 h-3.5" />
          </button>
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

          {/* Search + Quality Toggle + Upload Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* WebP Upload Quality Toggle (High Quality Full-Screen vs Reduced Quality) */}
            <div
              className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0"
              title={
                isRtl
                  ? 'اختر وضع ضغط الصور قبل الرفع إلى Cloudflare R2'
                  : 'Choose WebP compression mode before uploading images to Cloudflare R2'
              }
            >
              <button
                type="button"
                onClick={() => setQualityMode('high-webp')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  qualityMode === 'high-webp'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TbSparkles className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isRtl ? 'جودة عالية WebP (للشاشات الكاملة)' : 'High Quality WebP (Full-Screen)'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setQualityMode('reduced-webp')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  qualityMode === 'reduced-webp'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{isRtl ? 'ضغط وتقليل الجودة WebP' : 'Reduced Size WebP'}</span>
              </button>
            </div>

            <div className="relative flex-1 sm:w-56 min-w-[160px]">
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
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs shrink-0 disabled:opacity-50 cursor-pointer"
            >
              <TbUpload className="w-4 h-4" />
              <span>{uploading ? (isRtl ? 'جارٍ الرفع...' : 'Uploading...') : isRtl ? 'رفع ملفات' : 'Upload Files'}</span>
            </button>

            <button
              type="button"
              onClick={fetchMedia}
              className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0 cursor-pointer"
              title={isRtl ? 'تحديث' : 'Refresh'}
            >
              <TbRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Row 2: Top-Level Folder Tabs + Sorting + View Mode */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Root Folders Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin w-full md:w-auto pb-2 md:pb-0">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider me-1 shrink-0">
              {isRtl ? 'المجلد:' : 'Folder:'}
            </span>
            {rootFolders.map((f) => {
              const isTabActive = activeTopLevelRoot === f.id;
              const hasKids = f.id !== '' && hasSubfoldersMap.has(f.id);
              return (
                <div
                  key={f.id || 'all-root'}
                  className={`group/ftab inline-flex items-center rounded-lg whitespace-nowrap transition-colors ${
                    isTabActive
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFolder(f.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 cursor-pointer"
                  >
                    {isTabActive && f.id !== '' ? (
                      <TbFolderOpen className="w-3.5 h-3.5 text-persici-crimson" />
                    ) : (
                      <TbFolder className="w-3.5 h-3.5 opacity-70" />
                    )}
                    <span>{isRtl ? f.labelAr : f.labelEn}</span>
                    {typeof f.count === 'number' && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isTabActive ? 'bg-white/15 text-white' : 'bg-slate-200/70 text-slate-500'
                        }`}
                      >
                        {f.count}
                      </span>
                    )}
                    {hasKids && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isTabActive ? 'bg-persici-crimson' : 'bg-persici-crimson/70'
                        }`}
                        title={isRtl ? 'يحتوي على مجلدات فرعية' : 'Contains subfolders'}
                      />
                    )}
                  </button>
                  {f.isCustom && (
                    <button
                      type="button"
                      disabled={deletingFolderId === f.id}
                      onClick={(e) => handleDeleteCustomFolder(f, e)}
                      className={`pe-1.5 py-1 transition-opacity ${
                        isTabActive
                          ? 'text-slate-300 hover:text-white'
                          : 'text-slate-400 hover:text-red-600 opacity-0 group-hover/ftab:opacity-100'
                      }`}
                      title={isRtl ? 'حذف المجلد المخصص' : 'Delete custom folder'}
                    >
                      <TbX className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => setCreateFolderModalState({ isOpen: true, parentFolder: '' })}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-persici-crimson/10 text-persici-crimson hover:bg-persici-crimson/20 font-bold whitespace-nowrap transition-colors shrink-0 cursor-pointer"
              title={isRtl ? 'إنشاء مجلد رئيسي جديد' : 'Create new top-level folder'}
            >
              <TbFolderPlus className="w-3.5 h-3.5" />
              <span>{isRtl ? '+ مجلد جديد' : '+ New Folder'}</span>
            </button>
          </div>

          {/* Right Controls: Select Page, Sort & Grid/List View */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            {displayedItems.length > 0 && (
              <button
                type="button"
                onClick={handleToggleSelectAllDisplayed}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  allDisplayedSelected
                    ? 'bg-persici-crimson text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {allDisplayedSelected
                  ? isRtl
                    ? 'إلغاء تحديد الكل'
                    : 'Unselect Page'
                  : isRtl
                  ? 'تحديد الصفحة'
                  : 'Select Page'}
              </button>
            )}

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

        {/* Row 3: Hierarchical Breadcrumb & Nested Subfolders Explorer Strip */}
        {activeFolder !== '' && (
          <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-2.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Clickable Breadcrumb Trail */}
              <div className="flex flex-wrap items-center gap-1 text-[11px]">
                {breadcrumbTrail.map((crumb, idx) => {
                  const isLast = idx === breadcrumbTrail.length - 1;
                  return (
                    <React.Fragment key={crumb.id || 'root-crumb'}>
                      {idx > 0 && (
                        <TbChevronRight
                          className={`w-3.5 h-3.5 text-slate-400 ${isRtl ? 'rotate-180' : ''}`}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setActiveFolder(crumb.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                          isLast
                            ? 'bg-slate-900 text-white font-bold'
                            : 'text-slate-600 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        {idx === 0 && <TbHome className="w-3 h-3" />}
                        <span>{isRtl ? crumb.labelAr : crumb.labelEn}</span>
                      </button>
                    </React.Fragment>
                  );
                })}
                <span className="text-[10px] font-mono text-slate-400 ms-1">
                  /{activeFolder}/
                </span>
              </div>

              {/* Subfolder Include Toggle & Create Subfolder Action */}
              <div className="flex flex-wrap items-center gap-2">
                {childSubfolders.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIncludeSubfolders((prev) => !prev)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                      includeSubfolders
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    {includeSubfolders
                      ? isRtl
                        ? 'العرض: شامل المجلدات الفرعية'
                        : 'Showing: Includes Subfolders'
                      : isRtl
                      ? 'العرض: هذا المجلد فقط'
                      : 'Showing: Direct Files Only'}
                  </button>
                )}

                {getFolderDepth(activeFolder) < MAX_FOLDER_DEPTH && (
                  <button
                    type="button"
                    onClick={() =>
                      setCreateFolderModalState({ isOpen: true, parentFolder: activeFolder })
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    <TbFolderPlus className="w-3.5 h-3.5 text-persici-crimson" />
                    <span>{isRtl ? '+ مجلد فرعي جديد' : '+ New Subfolder'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Child Subfolder Chips */}
            {childSubfolders.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider me-1 px-1">
                  {isRtl ? 'المجلدات الفرعية:' : 'Subfolders:'}
                </span>
                {childSubfolders.map((sub) => (
                  <div
                    key={sub.id}
                    className="group/sub inline-flex items-center bg-white border border-slate-200 hover:border-persici-crimson/50 rounded-xl shadow-2xs transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFolder(sub.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-persici-crimson cursor-pointer"
                    >
                      <TbFolder className="w-3.5 h-3.5 text-persici-crimson" />
                      <span>{isRtl ? sub.labelAr : sub.labelEn}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500 text-[10px]">
                        {sub.count || 0}
                      </span>
                    </button>
                    {sub.isCustom && (
                      <button
                        type="button"
                        disabled={deletingFolderId === sub.id}
                        onClick={(e) => handleDeleteCustomFolder(sub, e)}
                        className="pe-2 py-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title={isRtl ? 'حذف المجلد الفرعي' : 'Delete subfolder'}
                      >
                        <TbTrash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Picker Multi-Select Guidance Strip (when active & no items checked yet) */}
      {mode === 'picker' && multiple && selectedKeys.length === 0 && (
        <div className="mb-4 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
          <span>
            {isRtl
              ? 'وضع التحديد المتعدد مفعل: انقر على عدة صور لتحديدها (حتى عبر مجلدات مختلفة)، أو اختر مجلداً وارفع صوراً متعددة دفعة واحدة.'
              : 'Bulk Select Mode active: click images across any folder/subfolder or click "Upload Files" to upload a batch and insert them all at once.'}
          </span>
        </div>
      )}

      {/* Multi-Select Bulk Organization & Picker Confirmation Bar */}
      {selectedKeys.length > 0 && (
        <div className="mb-4 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-persici-crimson text-white font-bold">
              {isRtl ? `تم تحديد ${selectedKeys.length} ملف` : `${selectedKeys.length} Selected`}
            </span>
            <span className="text-slate-300 hidden sm:inline">
              {mode === 'picker' && multiple
                ? isRtl
                  ? 'جاهز للإدراج في معرض دراسة الحالة:'
                  : 'Ready to insert into your gallery:'
                : isRtl
                ? 'يمكنك نقل أو نسخ جميع الملفات المحددة دفعة واحدة:'
                : 'Organize all selected assets across folders in batch:'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {mode === 'picker' && multiple && (
              <button
                type="button"
                onClick={handleConfirmMultiplePick}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors shadow-sm cursor-pointer"
              >
                <TbCheck className="w-4 h-4 stroke-[3]" />
                <span>
                  {isRtl
                    ? `إدراج ${selectedMediaItems.length} صور في المعرض`
                    : `Insert ${selectedMediaItems.length} Selected Image${selectedMediaItems.length > 1 ? 's' : ''}`}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                setMoveCopyModalState({ items: selectedMediaItems, mode: 'move' })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              <TbFolderShare className="w-4 h-4 text-persici-crimson" />
              <span>{isRtl ? 'نقل إلى مجلد' : 'Move to Folder'}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setMoveCopyModalState({ items: selectedMediaItems, mode: 'copy' })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors cursor-pointer"
            >
              <TbCopyPlus className="w-4 h-4" />
              <span>{isRtl ? 'نسخ إلى مجلد' : 'Copy to Folder'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedKeys([])}
              className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 font-medium transition-colors cursor-pointer"
            >
              {isRtl ? 'إلغاء التحديد' : 'Clear'}
            </button>
          </div>
        </div>
      )}

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
                    const isChecked = selectedKeySet.has(item.key);
                    return (
                      <div
                        key={item.key}
                        onClick={() => {
                          setSelectedItem(item);
                          if (mode === 'picker' && multiple) {
                            toggleKeySelection(item);
                          }
                        }}
                        onDoubleClick={() => {
                          if (mode === 'picker' && !multiple && onSelect) {
                            onSelect(item.url, item);
                            onClose?.();
                          } else {
                            setPreviewItem(item);
                          }
                        }}
                        className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer ${
                          isChecked
                            ? 'border-persici-crimson ring-2 ring-persici-crimson/40 shadow-md bg-persici-crimson/[0.02]'
                            : isSelected
                            ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                        {/* Top Preview Area */}
                        <div className="relative w-full overflow-hidden bg-slate-50">
                          {renderThumbnail(item, 'aspect-square w-full')}

                          {/* Multi-Select Checkbox Badge (Top Corner, z-30 above hover overlay) */}
                          <button
                            type="button"
                            className={`absolute top-2.5 ${isRtl ? 'right-2.5' : 'left-2.5'} z-30 transition-all ${
                              isChecked || selectedKeys.length > 0 || (mode === 'picker' && multiple)
                                ? 'scale-100 opacity-100'
                                : 'scale-95 opacity-0 group-hover:opacity-100'
                            }`}
                            onClick={(e) => toggleKeySelection(item, e)}
                            title={isRtl ? 'تحديد / إلغاء تحديد الملف' : 'Select / Unselect asset'}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                                isChecked
                                  ? 'bg-persici-crimson text-white ring-2 ring-white'
                                  : 'bg-white/95 text-slate-400 hover:text-slate-900 hover:bg-white border border-slate-200'
                              }`}
                            >
                              <TbCheck className={`w-3.5 h-3.5 stroke-[3] ${isChecked ? 'opacity-100' : 'opacity-40'}`} />
                            </div>
                          </button>

                          {/* Format Badge (Opposite Top Corner) */}
                          <span
                            className={`absolute top-2.5 ${isRtl ? 'left-2.5' : 'right-2.5'} z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white font-mono text-[9px] font-bold uppercase tracking-wider`}
                          >
                            {item.format || item.mediaType}
                          </span>

                          {/* Hover Action Overlay */}
                          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-2xs z-20 px-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewItem(item);
                              }}
                              className="p-2 bg-white/95 hover:bg-white text-slate-900 rounded-xl text-xs font-semibold shadow transition-transform hover:scale-105 cursor-pointer"
                              title={isRtl ? 'معاينة' : 'Preview'}
                            >
                              <TbEye className="w-4 h-4 text-slate-800" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleCopyUrl(item.url, item.key, e)}
                              className="p-2 bg-white/95 hover:bg-white text-slate-900 rounded-xl text-xs font-semibold shadow transition-transform hover:scale-105 cursor-pointer"
                              title={isRtl ? 'نسخ الرابط المباشر' : 'Copy CDN URL'}
                            >
                              {copiedKey === item.key ? (
                                <TbCheck className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <TbCopy className="w-4 h-4 text-slate-800" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMoveCopyModalState({ items: [item], mode: 'move' });
                              }}
                              className="p-2 bg-white/95 hover:bg-white text-slate-900 rounded-xl text-xs font-semibold shadow transition-transform hover:scale-105 cursor-pointer"
                              title={isRtl ? 'نقل إلى مجلد' : 'Move to Folder'}
                            >
                              <TbFolderShare className="w-4 h-4 text-persici-crimson" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMoveCopyModalState({ items: [item], mode: 'copy' });
                              }}
                              className="p-2 bg-white/95 hover:bg-white text-slate-900 rounded-xl text-xs font-semibold shadow transition-transform hover:scale-105 cursor-pointer"
                              title={isRtl ? 'نسخ إلى مجلد' : 'Copy to Folder'}
                            >
                              <TbCopyPlus className="w-4 h-4 text-slate-800" />
                            </button>

                            {mode === 'picker' && (multiple || onSelect) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  if (multiple) {
                                    toggleKeySelection(item, e);
                                  } else {
                                    e.stopPropagation();
                                    onSelect?.(item.url, item);
                                    onClose?.();
                                  }
                                }}
                                className="p-2 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow transition-transform hover:scale-105 cursor-pointer"
                                title={
                                  multiple
                                    ? isChecked
                                      ? isRtl
                                        ? 'إلغاء التحديد'
                                        : 'Unselect'
                                      : isRtl
                                      ? 'إضافة للتحديد'
                                      : 'Add to selection'
                                    : isRtl
                                    ? 'اختيار هذا الملف'
                                    : 'Select asset'
                                }
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
                            <span
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium truncate max-w-[125px]"
                              title={item.folder || 'general'}
                            >
                              {formatFolderDisplayPath(item.folder || 'general', folders, isRtl)}
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
                    <table className="w-full min-w-[780px] text-start text-xs text-slate-600 border-collapse table-auto">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                        <tr>
                          <th scope="col" className="ps-4 pe-2 py-3.5 w-10 text-center">
                            <button
                              type="button"
                              onClick={handleToggleSelectAllDisplayed}
                              className={`w-5 h-5 rounded-md border flex items-center justify-center mx-auto transition-colors cursor-pointer ${
                                allDisplayedSelected
                                  ? 'bg-persici-crimson border-persici-crimson text-white'
                                  : 'bg-white border-slate-300 text-transparent hover:border-slate-500'
                              }`}
                              title={isRtl ? 'تحديد كل ملفات الصفحة' : 'Select all on page'}
                            >
                              <TbCheck className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </th>
                          <th scope="col" className="px-4 py-3.5 text-start w-20 whitespace-nowrap">{isRtl ? 'المعاينة' : 'Preview'}</th>
                          <th scope="col" className="px-4 py-3.5 text-start min-w-[240px]">{isRtl ? 'اسم الملف والمفتاح' : 'File Name & Key'}</th>
                          <th scope="col" className="px-4 py-3.5 text-start w-28 whitespace-nowrap">{isRtl ? 'النوع' : 'Type'}</th>
                          <th scope="col" className="px-4 py-3.5 text-start w-24 whitespace-nowrap">{isRtl ? 'الحجم' : 'Size'}</th>
                          <th scope="col" className="px-5 py-3.5 text-end w-44 whitespace-nowrap">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayedItems.map((item) => {
                          const isSelected = selectedItem?.key === item.key;
                          const isChecked = selectedKeySet.has(item.key);
                          return (
                            <tr
                              key={item.key}
                              onClick={() => {
                                setSelectedItem(item);
                                if (mode === 'picker' && multiple) {
                                  toggleKeySelection(item);
                                }
                              }}
                              className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-persici-crimson/5 font-medium'
                                  : isSelected
                                  ? 'bg-slate-100/70 font-medium'
                                  : ''
                              }`}
                            >
                              <td className="ps-4 pe-2 py-3 w-10 text-center" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={(e) => toggleKeySelection(item, e)}
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center mx-auto transition-colors cursor-pointer ${
                                    isChecked
                                      ? 'bg-persici-crimson border-persici-crimson text-white'
                                      : 'bg-white border-slate-300 text-transparent hover:border-slate-500'
                                  }`}
                                >
                                  <TbCheck className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                              </td>
                              <td className="px-4 py-3 w-20">
                                <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-slate-200 shrink-0 bg-slate-100">
                                  {renderThumbnail(item, 'w-full h-full')}
                                </div>
                              </td>
                              <td className="px-4 py-3 min-w-[240px]">
                                <p className="font-semibold text-slate-900 truncate" title={item.filename}>
                                  {item.title || item.filename || item.key.split('/').pop()}
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono truncate" title={item.key}>
                                  {item.key}
                                </p>
                              </td>
                              <td className="px-4 py-3 w-28">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                                  {item.format || item.mediaType}
                                </span>
                              </td>
                              <td className="px-4 py-3 w-24 whitespace-nowrap font-medium text-slate-700">
                                {formatFileSize(item.size)}
                              </td>
                              <td className="px-5 py-3 w-44 text-end whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => setPreviewItem(item)}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                    title={isRtl ? 'معاينة' : 'Preview'}
                                  >
                                    <TbEye className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => handleCopyUrl(item.url, item.key, e)}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
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
                                    onClick={() => setMoveCopyModalState({ items: [item], mode: 'move' })}
                                    className="p-1.5 bg-slate-100 hover:bg-persici-crimson/10 text-persici-crimson rounded-lg transition-colors cursor-pointer"
                                    title={isRtl ? 'نقل إلى مجلد' : 'Move to Folder'}
                                  >
                                    <TbFolderShare className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setMoveCopyModalState({ items: [item], mode: 'copy' })}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                    title={isRtl ? 'نسخ إلى مجلد' : 'Copy to Folder'}
                                  >
                                    <TbCopyPlus className="w-4 h-4" />
                                  </button>

                                  {mode === 'picker' && (multiple || onSelect) && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (multiple) {
                                          toggleKeySelection(item);
                                        } else {
                                          onSelect?.(item.url, item);
                                          onClose?.();
                                        }
                                      }}
                                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1 cursor-pointer ${
                                        multiple && isChecked
                                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                          : 'bg-persici-crimson hover:bg-red-700 text-white'
                                      }`}
                                      title={isRtl ? 'اختيار' : 'Select'}
                                    >
                                      <TbCheck className="w-3.5 h-3.5" />
                                      <span>
                                        {multiple
                                          ? isChecked
                                            ? isRtl
                                              ? 'محدد'
                                              : 'Added'
                                            : isRtl
                                            ? 'تحديد'
                                            : 'Add'
                                          : isRtl
                                          ? 'اختيار'
                                          : 'Select'}
                                      </span>
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
              folders={folders}
              onClose={() => setSelectedItem(null)}
              onSelect={onSelect}
              mode={mode}
              isRtl={isRtl}
              onOpenPreview={(i) => setPreviewItem(i)}
              onOpenMoveCopy={(i, actionMode) =>
                setMoveCopyModalState({ items: [i], mode: actionMode })
              }
              onOpenCreateFolder={(parent) =>
                setCreateFolderModalState({ isOpen: true, parentFolder: parent || '' })
              }
              onItemUpdated={(updated) => {
                setSelectedItem(updated);
                setItems((prev) => prev.map((x) => (x.key === selectedItem.key ? updated : x)));
                void fetchMedia();
                onMediaMutated?.();
              }}
              onItemDeleted={(key) => {
                setItems((prev) => prev.filter((x) => x.key !== key));
                setSelectedKeys((prev) => prev.filter((k) => k !== key));
                setSelectedItem(null);
                if (previewItem?.key === key) setPreviewItem(null);
                void fetchMedia();
                onMediaMutated?.();
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

      {/* Create Custom Folder / Nested Subfolder Modal */}
      {createFolderModalState?.isOpen && (
        <CreateFolderModal
          isOpen
          onClose={() => setCreateFolderModalState(null)}
          folders={folders}
          initialParentFolder={createFolderModalState.parentFolder}
          isRtl={isRtl}
          onCreated={(createdFolder, updatedFolders) => {
            setFolders(updatedFolders);
            setActiveFolder(createdFolder.id);
            showNotice(
              isRtl
                ? `تم إنشاء المجلد "${createdFolder.labelAr}" (${createdFolder.id}) بنجاح.`
                : `Created folder "${createdFolder.labelEn}" (${createdFolder.id}).`
            );
          }}
        />
      )}

      {/* Move / Copy Media Modal (Single or Batch + Inline Subfolder Creation + Option B Sync) */}
      {moveCopyModalState && moveCopyModalState.items.length > 0 && (
        <MoveCopyMediaModal
          key={`${moveCopyModalState.mode}-${moveCopyModalState.items.map((i) => i.key).join('|')}`}
          isOpen
          onClose={() => setMoveCopyModalState(null)}
          items={moveCopyModalState.items}
          initialMode={moveCopyModalState.mode}
          folders={folders}
          isRtl={isRtl}
          onFoldersUpdated={(updatedFolders) => setFolders(updatedFolders)}
          onCompleted={(result) => {
            if (Array.isArray(result.folders) && result.folders.length > 0) {
              setFolders(result.folders);
            }
            if (result.action === 'move' && result.moved && selectedItem) {
              const movedMatch = result.moved.find((m) => m.oldKey === selectedItem.key);
              if (movedMatch) {
                setSelectedItem(movedMatch.item);
              }
            }
            setSelectedKeys([]);
            showNotice(result.message);
            void fetchMedia();
            onMediaMutated?.();
          }}
        />
      )}
    </div>
  );
}
