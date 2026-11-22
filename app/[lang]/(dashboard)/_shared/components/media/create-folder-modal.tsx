'use client';

import React, { useState } from 'react';
import {
  TbFolderPlus,
  TbX,
  TbCheck,
  TbCornerDownRight,
} from 'react-icons/tb';
import {
  FolderOption,
  MAX_FOLDER_DEPTH,
  formatFolderDisplayPath,
  getFolderDepth,
  sanitizeFolderSegment,
} from './types';

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderOption[];
  initialParentFolder?: string;
  isRtl?: boolean;
  onCreated: (folder: FolderOption, updatedFolders: FolderOption[]) => void;
}

export function CreateFolderModal({
  isOpen,
  onClose,
  folders,
  initialParentFolder = '',
  isRtl = false,
  onCreated,
}: CreateFolderModalProps) {
  const safeInitialParent =
    initialParentFolder && getFolderDepth(initialParentFolder) < MAX_FOLDER_DEPTH
      ? initialParentFolder
      : '';

  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [parentFolder, setParentFolder] = useState(safeInitialParent);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const eligibleParents = folders.filter(
    (f) => f.id === '' || (getFolderDepth(f.id) < MAX_FOLDER_DEPTH && !f.id.startsWith('thumbnails'))
  );

  const leafSlug = sanitizeFolderSegment(customSlug || nameEn);
  const fullPathPreview = parentFolder
    ? leafSlug
      ? `${parentFolder}/${leafSlug}`
      : `${parentFolder}/...`
    : leafSlug || '...';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim() || submitting) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/media/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameEn: nameEn.trim(),
          nameAr: nameAr.trim() || nameEn.trim(),
          parentFolder,
          slug: customSlug.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.folder) {
        setErrorMsg(data.error || (isRtl ? 'تعذر إنشاء المجلد.' : 'Failed to create folder.'));
        return;
      }

      onCreated(data.folder, data.folders || folders);
      onClose();
    } catch (err) {
      console.error('Create folder failed:', err);
      setErrorMsg(isRtl ? 'خطأ في الاتصال بالخادم.' : 'Network error creating folder.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-persici-crimson text-white flex items-center justify-center">
              <TbFolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {parentFolder
                  ? isRtl
                    ? 'إنشاء مجلد فرعي جديد'
                    : 'Create Nested Subfolder'
                  : isRtl
                  ? 'إنشاء مجلد جديد'
                  : 'Create New Folder'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isRtl
                  ? 'تنظيم ملفات Cloudflare R2 في مجلدات ومجلدات فرعية'
                  : 'Organize Cloudflare R2 assets into folders & subfolders'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <TbX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {isRtl ? 'المجلد الأب (Parent Folder)' : 'Parent Folder'}
            </label>
            <select
              value={parentFolder}
              onChange={(e) => setParentFolder(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson font-medium text-slate-800"
            >
              {eligibleParents.map((f) => {
                const depth = getFolderDepth(f.id);
                const prefix = depth > 1 ? `${'— '.repeat(depth - 1)}` : '';
                return (
                  <option key={f.id || 'root'} value={f.id}>
                    {f.id === ''
                      ? isRtl
                        ? 'المستوى الرئيسي (Top-Level Root)'
                        : 'Top-Level Root Folder'
                      : `${prefix}${formatFolderDisplayPath(f.id, folders, isRtl)} (${f.id})`}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {isRtl ? 'اسم المجلد (بالإنجليزية) *' : 'Folder Name (English) *'}
            </label>
            <input
              type="text"
              required
              autoFocus
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Fintech Redesign"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {isRtl ? 'الاسم بالعربية (اختياري)' : 'Arabic Display Label (Optional)'}
            </label>
            <input
              type="text"
              dir="rtl"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: إعادة تصميم منصة مالية"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {isRtl ? 'معرف المسار في R2 (اختياري)' : 'R2 Folder Slug (Optional Override)'}
            </label>
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder={sanitizeFolderSegment(nameEn) || 'fintech-redesign'}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
            />
          </div>

          {/* Live R2 Prefix Preview */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isRtl ? 'المسار الكامل داخل Cloudflare R2:' : 'Cloudflare R2 Folder Path Preview:'}
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800">
              {parentFolder && <TbCornerDownRight className="w-3.5 h-3.5 text-persici-crimson shrink-0" />}
              <span className="break-all">{fullPathPreview}/</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={submitting || !nameEn.trim() || !leafSlug}
              className="px-5 py-2 rounded-xl bg-persici-crimson hover:bg-red-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              <TbCheck className="w-4 h-4" />
              <span>
                {submitting
                  ? isRtl
                    ? 'جارٍ الإنشاء...'
                    : 'Creating...'
                  : isRtl
                  ? 'إنشاء المجلد'
                  : 'Create Folder'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
