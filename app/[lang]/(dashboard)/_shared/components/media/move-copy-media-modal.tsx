'use client';

import React, { useMemo, useState } from 'react';
import {
  TbFolder,
  TbFolderPlus,
  TbFolderShare,
  TbCopyPlus,
  TbCheck,
  TbX,
  TbCornerDownRight,
  TbLink,
  TbRefresh,
  TbSearch,
} from 'react-icons/tb';
import {
  FolderOption,
  MAX_FOLDER_DEPTH,
  MediaItem,
  MediaUrlSyncReport,
  formatFolderDisplayPath,
  getFolderDepth,
  sanitizeFolderSegment,
} from './types';

export interface MoveCopyMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MediaItem[];
  initialMode?: 'move' | 'copy';
  folders: FolderOption[];
  isRtl?: boolean;
  onFoldersUpdated: (updatedFolders: FolderOption[]) => void;
  onCompleted: (result: {
    action: 'move' | 'copy';
    mode?: 'virtual' | 'physical-sync';
    message: string;
    targetFolder: string;
    moved?: Array<{ oldKey: string; item: MediaItem }>;
    copied?: MediaItem[];
    syncSummary?: Omit<MediaUrlSyncReport, 'oldUrl' | 'newUrl'>;
    folders?: FolderOption[];
  }) => void;
}

export function MoveCopyMediaModal({
  isOpen,
  onClose,
  items,
  initialMode = 'move',
  folders,
  isRtl = false,
  onFoldersUpdated,
  onCompleted,
}: MoveCopyMediaModalProps) {
  const [actionMode, setActionMode] = useState<'move' | 'copy'>(initialMode);
  const [targetFolder, setTargetFolder] = useState<string>(() => {
    const firstItemFolder = items[0]?.folder || '';
    const candidate = folders.find((f) => f.id && f.id !== firstItemFolder);
    return candidate?.id || 'general';
  });
  // Option B (false = Physical R2 move + auto-sync URLs) is default per architectural decision
  const [keepOriginalUrl, setKeepOriginalUrl] = useState<boolean>(false);
  const [folderSearch, setFolderSearch] = useState('');

  // Quick inline folder/subfolder creation
  const [showInlineCreate, setShowInlineCreate] = useState(false);
  const [newFolderNameEn, setNewFolderNameEn] = useState('');
  const [newFolderNameAr, setNewFolderNameAr] = useState('');
  const [newFolderParent, setNewFolderParent] = useState<string>(() => {
    const firstItemFolder = items[0]?.folder || '';
    return getFolderDepth(firstItemFolder) < MAX_FOLDER_DEPTH ? firstItemFolder : '';
  });
  const [creatingFolder, setCreatingFolder] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectableFolders = useMemo(() => {
    return folders.filter((f) => {
      if (!f.id || f.id.startsWith('thumbnails')) return false;
      if (!folderSearch.trim()) return true;
      const q = folderSearch.toLowerCase();
      return (
        f.id.toLowerCase().includes(q) ||
        f.labelEn.toLowerCase().includes(q) ||
        f.labelAr.toLowerCase().includes(q)
      );
    });
  }, [folders, folderSearch]);

  const eligibleParentFolders = useMemo(
    () =>
      folders.filter(
        (f) => f.id === '' || (getFolderDepth(f.id) < MAX_FOLDER_DEPTH && !f.id.startsWith('thumbnails'))
      ),
    [folders]
  );

  if (!isOpen || items.length === 0) return null;

  const isSingle = items.length === 1;
  const singleItem = items[0];

  // Live preview of new CDN URL for Option B or Copy
  const previewNewUrl = (() => {
    if (!isSingle || !targetFolder) return '';
    try {
      const origin = new URL(singleItem.url).origin;
      const filename = singleItem.key.split('/').pop() || singleItem.filename;
      return `${origin}/${targetFolder}/${filename}`;
    } catch {
      return `.../${targetFolder}/${singleItem.filename}`;
    }
  })();

  const handleInlineCreateFolder = async () => {
    if (!newFolderNameEn.trim() || creatingFolder) return;
    setCreatingFolder(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/media/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameEn: newFolderNameEn.trim(),
          nameAr: newFolderNameAr.trim() || newFolderNameEn.trim(),
          parentFolder: newFolderParent,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.folder) {
        setErrorMsg(data.error || (isRtl ? 'تعذر إنشاء المجلد.' : 'Failed to create folder.'));
        return;
      }

      if (Array.isArray(data.folders)) {
        onFoldersUpdated(data.folders);
      }
      setTargetFolder(data.folder.id);
      setShowInlineCreate(false);
      setNewFolderNameEn('');
      setNewFolderNameAr('');
    } catch (err) {
      console.error('Inline create folder failed:', err);
      setErrorMsg(isRtl ? 'خطأ أثناء إنشاء المجلد.' : 'Network error creating folder.');
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleConfirm = async () => {
    if (!targetFolder || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionMode,
          keys: items.map((i) => i.key),
          targetFolder,
          ...(actionMode === 'move' ? { keepOriginalUrl } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || (isRtl ? 'فشلت العملية.' : 'Operation failed.'));
        return;
      }

      onCompleted({
        action: actionMode,
        mode: data.mode,
        message: data.message,
        targetFolder,
        moved: data.moved,
        copied: data.copied,
        syncSummary: data.syncSummary,
        folders: data.folders,
      });
      onClose();
    } catch (err) {
      console.error('Move/Copy failed:', err);
      setErrorMsg(isRtl ? 'خطأ في الاتصال بالخادم.' : 'Network error updating files.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-persici-crimson text-white flex items-center justify-center shrink-0">
              {actionMode === 'move' ? (
                <TbFolderShare className="w-5 h-5" />
              ) : (
                <TbCopyPlus className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate">
                {actionMode === 'move'
                  ? isRtl
                    ? `نقل ${items.length} ملف إلى مجلد`
                    : `Move ${items.length} Asset${items.length > 1 ? 's' : ''} to Folder`
                  : isRtl
                  ? `نسخ ${items.length} ملف إلى مجلد`
                  : `Copy ${items.length} Asset${items.length > 1 ? 's' : ''} to Folder`}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {isSingle
                  ? singleItem.filename
                  : isRtl
                  ? `${items.length} ملفات محددة`
                  : `${items.length} selected items`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <TbX className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActionMode('move')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              actionMode === 'move'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <TbFolderShare className="w-4 h-4" />
            <span>{isRtl ? 'نقل الملف (Move)' : 'Move File(s)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActionMode('copy')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              actionMode === 'copy'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <TbCopyPlus className="w-4 h-4" />
            <span>{isRtl ? 'نسخ الملف (Copy)' : 'Copy File(s)'}</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Destination Folder Section */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                {isRtl ? 'اختر المجلد أو المجلد الفرعي الوجهة:' : 'Select Destination Folder / Subfolder:'}
              </label>
              <button
                type="button"
                onClick={() => setShowInlineCreate((v) => !v)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-persici-crimson/10 text-persici-crimson hover:bg-persici-crimson/20 font-bold text-[11px] transition-colors cursor-pointer"
              >
                <TbFolderPlus className="w-3.5 h-3.5" />
                <span>{isRtl ? '+ مجلد جديد هنا' : '+ New Folder / Subfolder'}</span>
              </button>
            </div>

            {/* Inline Quick Create Folder Drawer */}
            {showInlineCreate && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-persici-crimson/30 space-y-3 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      {isRtl ? 'المجلد الأب' : 'Inside Parent Folder'}
                    </label>
                    <select
                      value={newFolderParent}
                      onChange={(e) => setNewFolderParent(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      {eligibleParentFolders.map((f) => (
                        <option key={f.id || 'root'} value={f.id}>
                          {f.id === ''
                            ? isRtl
                              ? 'المستوى الرئيسي (Root)'
                              : 'Top-Level Root'
                            : formatFolderDisplayPath(f.id, folders, isRtl)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      {isRtl ? 'اسم المجلد الجديد (EN) *' : 'New Folder Name (EN) *'}
                    </label>
                    <input
                      type="text"
                      value={newFolderNameEn}
                      onChange={(e) => setNewFolderNameEn(e.target.value)}
                      placeholder="e.g. Client Alpha"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                    <input
                      type="text"
                      dir="rtl"
                      value={newFolderNameAr}
                      onChange={(e) => setNewFolderNameAr(e.target.value)}
                      placeholder={isRtl ? 'الاسم بالعربية (اختياري)' : 'Arabic label (optional)'}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      {newFolderParent
                        ? `${newFolderParent}/${sanitizeFolderSegment(newFolderNameEn) || '...'}`
                        : sanitizeFolderSegment(newFolderNameEn) || '...'}
                    </span>
                    <button
                      type="button"
                      disabled={creatingFolder || !sanitizeFolderSegment(newFolderNameEn)}
                      onClick={handleInlineCreateFolder}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold disabled:opacity-50 cursor-pointer"
                    >
                      {creatingFolder ? (isRtl ? 'جارٍ الإنشاء...' : 'Adding...') : isRtl ? 'إضافة وتحديد' : 'Add & Select'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Folder Search */}
            <div className="relative">
              <TbSearch className={`w-3.5 h-3.5 text-slate-400 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
              <input
                type="text"
                value={folderSearch}
                onChange={(e) => setFolderSearch(e.target.value)}
                placeholder={isRtl ? 'تصفية المجلدات والمجلدات الفرعية...' : 'Filter folders & subfolders...'}
                className={`w-full ${isRtl ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-persici-crimson/20`}
              />
            </div>

            {/* Hierarchical Folder Picker List */}
            <div className="max-h-52 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 bg-white">
              {selectableFolders.map((f) => {
                const depth = getFolderDepth(f.id);
                const isSelected = targetFolder === f.id;
                const indentPx = Math.max(0, depth - 1) * 18;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setTargetFolder(f.id)}
                    className={`w-full px-3.5 py-2.5 flex items-center justify-between text-start transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-persici-crimson/8 text-persici-crimson font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className="flex items-center gap-2 min-w-0"
                      style={{
                        paddingInlineStart: `${indentPx}px`,
                      }}
                    >
                      {depth > 1 ? (
                        <TbCornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <TbFolder
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? 'text-persici-crimson' : 'text-slate-400'
                          }`}
                        />
                      )}
                      <span className="truncate">{isRtl ? f.labelAr : f.labelEn}</span>
                      <span className="text-[10px] font-mono text-slate-400 truncate hidden sm:inline">
                        /{f.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {typeof f.count === 'number' && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          {f.count}
                        </span>
                      )}
                      {isSelected && <TbCheck className="w-4 h-4 text-persici-crimson" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Move Strategy Selector (Option B Default vs Option A Virtual Toggle) */}
          {actionMode === 'move' ? (
            <div className="space-y-2.5">
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                {isRtl ? 'طريقة النقل والرابط:' : 'Move & URL Synchronization Mode:'}
              </label>

              {/* Option B (Recommended Default) */}
              <button
                type="button"
                onClick={() => setKeepOriginalUrl(false)}
                className={`w-full p-3.5 rounded-2xl border text-start transition-all flex items-start gap-3 cursor-pointer ${
                  !keepOriginalUrl
                    ? 'border-persici-crimson bg-persici-crimson/[0.03] ring-1 ring-persici-crimson/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    !keepOriginalUrl ? 'border-persici-crimson bg-persici-crimson' : 'border-slate-300'
                  }`}
                >
                  {!keepOriginalUrl && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {isRtl
                        ? 'نقل فعلي في Cloudflare R2 + مزامنة الروابط تلقائياً في الموقع'
                        : 'Option B: Physical R2 Move + Auto-Sync Website Links'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {isRtl ? 'موصى به' : 'Recommended'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {isRtl
                      ? 'ينقل الملف فعلياً داخل حاوية R2 إلى المسار الجديد ويحدث رابط الملف تلقائياً في جميع الصفحات وقصص العملاء وفريق العمل والإعدادات.'
                      : 'Physically moves the object in Cloudflare R2 and automatically updates every linked page, Client Story, Team Member, Review, and Setting.'}
                  </p>
                  {!keepOriginalUrl && previewNewUrl && (
                    <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-mono text-slate-700 break-all">
                      <TbRefresh className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{previewNewUrl}</span>
                    </div>
                  )}
                </div>
              </button>

              {/* Option A (Optional Keep Same URL) */}
              <button
                type="button"
                onClick={() => setKeepOriginalUrl(true)}
                className={`w-full p-3.5 rounded-2xl border text-start transition-all flex items-start gap-3 cursor-pointer ${
                  keepOriginalUrl
                    ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    keepOriginalUrl ? 'border-slate-900 bg-slate-900' : 'border-slate-300'
                  }`}
                >
                  {keepOriginalUrl && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="font-bold text-slate-900 block">
                    {isRtl
                      ? 'الإبقاء على نفس الرابط تماماً (نقل تنظيمي في المكتبة فقط)'
                      : 'Option A: Keep Exact Same CDN URL (Virtual Folder Move)'}
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {isRtl
                      ? 'ينظم الملف داخل المجلد المحدد في لوحة التحكم مع بقاء رابط CDN الأصلي بدون أي تغيير (مناسب للروابط المرسلة خارج الموقع).'
                      : 'Organizes the file inside the selected folder in Storage Library while keeping the exact original R2 URL intact (ideal for links shared externally).'}
                  </p>
                  {keepOriginalUrl && isSingle && (
                    <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-mono text-slate-700 break-all">
                      <TbLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{singleItem.url}</span>
                    </div>
                  )}
                </div>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <p className="font-bold text-slate-800">
                {isRtl
                  ? 'نسخ مستقل داخل Cloudflare R2'
                  : 'Independent Copy in Cloudflare R2'}
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isRtl
                  ? 'سيتم إنشاء نسخة جديدة في المجلد الوجهة برابط مستقل مع بقاء الملف الأصلي ورابطه كما هما تماماً.'
                  : 'Creates a duplicate object inside the destination folder with its own independent CDN URL while leaving the original asset untouched.'}
              </p>
              {previewNewUrl && (
                <p className="font-mono text-[10px] text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 break-all">
                  {previewNewUrl}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
          >
            {isRtl ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="button"
            disabled={submitting || !targetFolder}
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-persici-crimson hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            <TbCheck className="w-4 h-4" />
            <span>
              {submitting
                ? isRtl
                  ? 'جارٍ التنفيذ...'
                  : 'Processing...'
                : actionMode === 'move'
                ? isRtl
                  ? 'تأكيد النقل'
                  : 'Confirm Move'
                : isRtl
                ? 'تأكيد النسخ'
                : 'Confirm Copy'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
