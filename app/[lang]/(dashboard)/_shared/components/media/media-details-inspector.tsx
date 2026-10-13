'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  TbFileText,
  TbMusic,
  TbArchive,
  TbFile,
  TbPlayerPlay,
  TbCopy,
  TbCheck,
  TbDownload,
  TbTrash,
  TbExternalLink,
  TbDeviceFloppy,
} from 'react-icons/tb';
import { MediaItem, FOLDERS } from './types';

export interface MediaDetailsInspectorProps {
  item: MediaItem | null;
  onClose: () => void;
  onSelect?: (url: string, item: MediaItem) => void;
  onItemUpdated: (updated: MediaItem) => void;
  onItemDeleted: (key: string) => void;
  onOpenPreview: (item: MediaItem) => void;
  isRtl?: boolean;
  mode?: 'standalone' | 'picker';
}

export function MediaDetailsInspector({
  item,
  onClose,
  onSelect,
  onItemUpdated,
  onItemDeleted,
  onOpenPreview,
  isRtl = false,
  mode = 'standalone',
}: MediaDetailsInspectorProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const getInitialSlug = () => {
    if (!item) return '';
    const ext = item.key.includes('.') ? item.key.substring(item.key.lastIndexOf('.')) : '';
    return item.filename
      ? item.filename.replace(new RegExp(`\\${ext}$`), '')
      : item.key.split('/').pop()?.replace(new RegExp(`\\${ext}$`), '') || '';
  };

  // Editable fields
  const [slugName, setSlugName] = useState(getInitialSlug);
  const [altText, setAltText] = useState(item?.alt || '');
  const [titleText, setTitleText] = useState(item?.title || '');
  const [captionText, setCaptionText] = useState(item?.caption || '');
  const [folderValue, setFolderValue] = useState(
    item?.folder || (item?.key.includes('/') ? item.key.split('/')[0] : '')
  );

  // Status flags
  const [renaming, setRenaming] = useState(false);
  const [renameSuccess, setRenameSuccess] = useState(false);
  const [savingMeta, setSavingMeta] = useState(false);
  const [metaSuccess, setMetaSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!item) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(item.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Live calculation of preview URL when renaming slug
  const currentExt = item.key.includes('.') ? item.key.substring(item.key.lastIndexOf('.')) : '';
  const sanitizedPreviewSlug = slugName
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const previewTargetKey = folderValue
    ? `${folderValue}/${sanitizedPreviewSlug || 'asset'}${currentExt}`
    : `${sanitizedPreviewSlug || 'asset'}${currentExt}`;
  const cdnBase = item.url.substring(0, item.url.lastIndexOf('/') - (item.folder ? item.folder.length : 0));
  const previewTargetUrl = `${cdnBase.replace(/\/$/, '')}/${previewTargetKey}`;

  // Execute Rename via PUT /api/media
  const handleRename = async () => {
    if (!slugName.trim() || renaming) return;
    setRenaming(true);
    setRenameSuccess(false);

    try {
      const res = await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rename',
          key: item.key,
          newSlug: slugName.trim(),
          targetFolder: folderValue,
          alt: altText,
          title: titleText,
          caption: captionText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.media) {
        const updatedItem: MediaItem = {
          ...item,
          key: data.media.key,
          url: data.media.url,
          filename: data.media.filename,
          folder: data.media.folder,
          alt: altText,
          title: titleText,
          caption: captionText,
        };
        onItemUpdated(updatedItem);
        setRenameSuccess(true);
        setTimeout(() => setRenameSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to rename file.');
      }
    } catch (err) {
      console.error('Rename failed:', err);
      alert('Error renaming asset. Please verify network connection.');
    } finally {
      setRenaming(false);
    }
  };

  // Save metadata (alt, title, caption)
  const handleSaveMetadata = async () => {
    if (savingMeta) return;
    setSavingMeta(true);
    setMetaSuccess(false);

    try {
      const res = await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: item.key,
          alt: altText,
          title: titleText,
          caption: captionText,
          folder: folderValue,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const updatedItem: MediaItem = {
          ...item,
          alt: altText,
          title: titleText,
          caption: captionText,
          folder: folderValue,
        };
        onItemUpdated(updatedItem);
        setMetaSuccess(true);
        setTimeout(() => setMetaSuccess(false), 2500);
      } else {
        alert(data.error || 'Failed to update metadata.');
      }
    } catch (err) {
      console.error('Metadata update failed:', err);
      alert('Failed to update metadata.');
    } finally {
      setSavingMeta(false);
    }
  };

  // Delete permanently
  const handleDelete = async () => {
    const confirmMsg = isRtl
      ? `هل أنت متأكد تماماً من حذف "${item.key}" نهائياً من Cloudflare R2 وقاعدة البيانات؟`
      : `Are you sure you want to permanently delete "${item.key}" from Cloudflare R2 and database?`;
    if (!confirm(confirmMsg) || deleting) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/media?key=${encodeURIComponent(item.key)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onItemDeleted(item.key);
        onClose();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete file.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Could not delete file.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Inspector Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-persici-crimson" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 truncate">
            {isRtl ? 'تفاصيل ومعاينة الملف' : 'Attachment Details'}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-200 transition-colors"
        >
          {isRtl ? 'إغلاق' : 'Close'}
        </button>
      </div>

      {/* Inspector Body Scrollable */}
      <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
        {/* Interactive Thumbnail Preview Canvas */}
        <div
          onClick={() => onOpenPreview(item)}
          className="aspect-video relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group flex items-center justify-center hover:shadow-md transition-all"
        >
          {item.mediaType === 'image' ? (
            <Image
              src={item.url}
              alt={item.alt || item.filename}
              fill
              className="object-contain group-hover:scale-102 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : item.mediaType === 'video' ? (
            <div className="w-full h-full relative bg-slate-950 flex items-center justify-center">
              {item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.key}
                  fill
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform"
                />
              ) : null}
              <div className="relative z-10 w-12 h-12 rounded-full bg-persici-crimson text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <TbPlayerPlay className="w-6 h-6 ml-0.5" />
              </div>
            </div>
          ) : item.mediaType === 'document' ? (
            <div className="text-center p-4">
              <TbFileText className="w-12 h-12 text-amber-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-mono uppercase font-bold text-slate-700">{item.format}</span>
            </div>
          ) : item.mediaType === 'audio' ? (
            <div className="text-center p-4">
              <TbMusic className="w-12 h-12 text-purple-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-mono uppercase font-bold text-slate-700">{item.format} Audio</span>
            </div>
          ) : item.mediaType === 'archive' ? (
            <div className="text-center p-4">
              <TbArchive className="w-12 h-12 text-emerald-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-mono uppercase font-bold text-slate-700">{item.format} Archive</span>
            </div>
          ) : (
            <div className="text-center p-4">
              <TbFile className="w-12 h-12 text-slate-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-mono uppercase font-bold text-slate-700">{item.format}</span>
            </div>
          )}

          {/* Quick Click to Zoom Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-xs gap-1.5 backdrop-blur-2xs">
            <TbExternalLink className="w-4 h-4" />
            <span>{isRtl ? 'عرض المعاينة الكاملة' : 'Click to Full Preview'}</span>
          </div>
        </div>

        {/* Picker Mode Primary Action */}
        {mode === 'picker' && onSelect && (
          <button
            type="button"
            onClick={() => onSelect(item.url, item)}
            className="w-full py-2.5 px-4 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <TbCheck className="w-4 h-4" />
            <span>{isRtl ? 'اختيار هذا الملف وإدراجه' : 'Select / Insert Asset'}</span>
          </button>
        )}

        {/* WordPress-Style File Renaming & Slug Engine */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              {isRtl ? 'تعديل اسم الملف والرابط (Slug)' : 'File Name & URL Slug'}
            </label>
            {renameSuccess && (
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
                <TbCheck className="w-3 h-3" />
                <span>{isRtl ? 'تم تغيير الاسم والرابط!' : 'Renamed Successfully!'}</span>
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {isRtl
              ? 'تغيير الاسم هنا يحدث مفتاح Cloudflare R2 ورابط CDN العام فوراً لتتمكن من نسخه ومشاركته.'
              : 'Renaming updates the Cloudflare R2 storage key and its public CDN URL immediately.'}
          </p>

          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={slugName}
              onChange={(e) => setSlugName(e.target.value)}
              placeholder="e.g. enterprise-growth-showcase"
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson font-mono"
            />
            <span className="text-slate-400 font-mono text-[11px] font-semibold">{currentExt}</span>
          </div>

          {/* Live Preview of New Target URL */}
          <div className="text-[10px] text-slate-500 space-y-1">
            <span className="font-semibold text-slate-400 uppercase tracking-wider">
              {isRtl ? 'معاينة الرابط بعد التعديل:' : 'New URL Preview:'}
            </span>
            <p className="font-mono text-slate-700 bg-white/80 p-2 rounded-lg border border-slate-200/60 break-all select-all">
              {previewTargetUrl}
            </p>
          </div>

          <button
            type="button"
            disabled={renaming || !slugName.trim()}
            onClick={handleRename}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
          >
            <TbDeviceFloppy className="w-4 h-4" />
            <span>{renaming ? (isRtl ? 'جارٍ إعادة التسمية في R2...' : 'Renaming in R2...') : isRtl ? 'حفظ وتحديث الرابط' : 'Apply & Rename in R2'}</span>
          </button>
        </div>

        {/* Public CDN URL 1-Click Copy Box */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            {isRtl ? 'رابط CDN العام (Cloudflare)' : 'Public CDN Link'}
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              readOnly
              value={item.url}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 truncate"
            />
            <button
              type="button"
              onClick={handleCopyUrl}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shrink-0"
              title={isRtl ? 'نسخ الرابط' : 'Copy CDN URL'}
            >
              {copiedUrl ? (
                <TbCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <TbCopy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Editable Metadata: Title, Alt Text, Caption, Folder */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              {isRtl ? 'بيانات الوصف والـ SEO' : 'SEO & Metadata'}
            </span>
            {metaSuccess && (
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TbCheck className="w-3 h-3" />
                <span>{isRtl ? 'تم الحفظ!' : 'Saved!'}</span>
              </span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {isRtl ? 'العنوان البديل (Alt Text)' : 'Alternative Text (Alt)'}
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descriptive alt text for screen readers & SEO"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {isRtl ? 'عنوان العنصر (Title)' : 'Asset Title'}
            </label>
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              placeholder="Asset title"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {isRtl ? 'الوصف التوضيحي (Caption)' : 'Caption / Description'}
            </label>
            <textarea
              rows={2}
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              placeholder="Short description or caption..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {isRtl ? 'المجلد (Folder)' : 'Folder'}
            </label>
            <select
              value={folderValue}
              onChange={(e) => setFolderValue(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20"
            >
              {FOLDERS.map((f) => (
                <option key={f.id} value={f.id}>
                  {isRtl ? f.labelAr : f.labelEn}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            disabled={savingMeta}
            onClick={handleSaveMetadata}
            className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <TbDeviceFloppy className="w-3.5 h-3.5 text-slate-600" />
            <span>{savingMeta ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') : isRtl ? 'حفظ البيانات الوصفية' : 'Save Metadata'}</span>
          </button>
        </div>

        {/* Technical Metadata Box */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-[11px]">
          <div className="flex justify-between items-center text-slate-500">
            <span>{isRtl ? 'الحجم:' : 'File Size:'}</span>
            <span className="font-semibold text-slate-800 font-mono">{(item.size / 1024).toFixed(1)} KB</span>
          </div>

          {item.width && item.height && (
            <div className="flex justify-between items-center text-slate-500">
              <span>{isRtl ? 'الأبعاد:' : 'Dimensions:'}</span>
              <span className="font-semibold text-slate-800 font-mono">{item.width} &times; {item.height} px</span>
            </div>
          )}

          <div className="flex justify-between items-center text-slate-500">
            <span>{isRtl ? 'الصيغة / النوع:' : 'Format / Type:'}</span>
            <span className="font-bold uppercase text-persici-crimson font-mono">{item.format || item.mediaType}</span>
          </div>

          {item.lastModified && (
            <div className="flex justify-between items-center text-slate-500">
              <span>{isRtl ? 'تاريخ الرفع:' : 'Uploaded:'}</span>
              <span className="text-slate-700">
                {new Date(item.lastModified).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {item.uploadedBy && (
            <div className="flex justify-between items-center text-slate-500">
              <span>{isRtl ? 'بواسطة:' : 'By:'}</span>
              <span className="text-slate-700 font-mono truncate max-w-[150px]">{item.uploadedBy}</span>
            </div>
          )}
        </div>
      </div>

      {/* Inspector Footer Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <a
          href={item.url}
          target="_blank"
          download={item.filename}
          rel="noopener noreferrer"
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
        >
          <TbDownload className="w-4 h-4 text-slate-500" />
          <span>{isRtl ? 'تنزيل الملف' : 'Download'}</span>
        </a>

        <button
          type="button"
          disabled={deleting}
          onClick={handleDelete}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <TbTrash className="w-3.5 h-3.5" />
          <span>{deleting ? (isRtl ? 'جارٍ الحذف...' : 'Deleting...') : isRtl ? 'حذف نهائياً' : 'Delete Permanently'}</span>
        </button>
      </div>
    </div>
  );
}
