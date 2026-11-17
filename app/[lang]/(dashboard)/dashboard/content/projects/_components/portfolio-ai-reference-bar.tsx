'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  TbUpload,
  TbFileText,
  TbTrash,
  TbSparkles,
  TbAlertTriangle,
  TbCheck,
  TbSettings,
  TbLoader2,
  TbPlus,
} from 'react-icons/tb';
import { AI_PROVIDERS_META, type AiEffectLevel, type AiProviderId } from '@/lib/ai-types';

export interface UploadedReferenceItem {
  id: string;
  filename: string;
  extension: string;
  text: string;
  wordCount: number;
  charCount: number;
  metaSummary: string;
}

export interface PortfolioAiReferenceBarProps {
  lang: string;
  passkey?: string;
  references: UploadedReferenceItem[];
  onAddReferences: (docs: UploadedReferenceItem[]) => void;
  onRemoveReference: (id: string) => void;
  onGenerateAll: () => void;
  isGeneratingAll: boolean;
  generatingFieldKey: string | null;
  referenceWarning: string | null;
  onDismissWarning: () => void;
  activeAiMeta?: {
    provider: AiProviderId;
    modelId: string;
    effectLevel: AiEffectLevel;
    hasApiKey: boolean;
    isFreeTier: boolean;
  } | null;
  lastUsageBanner?: {
    tokens: number;
    costUsd: number;
    isFreeTier: boolean;
  } | null;
}

export function PortfolioAiReferenceBar({
  lang,
  passkey,
  references,
  onAddReferences,
  onRemoveReference,
  onGenerateAll,
  isGeneratingAll,
  generatingFieldKey,
  referenceWarning,
  onDismissWarning,
  activeAiMeta,
  lastUsageBanner,
}: PortfolioAiReferenceBarProps) {
  const isRtl = lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteText, setPasteText] = useState('');

  const totalWords = references.reduce((acc, r) => acc + r.wordCount, 0);
  const hasReference = references.length > 0;

  const aiSettingsHref = passkey
    ? `/${lang}/dashboard/ai?passkey=${encodeURIComponent(passkey)}`
    : `/${lang}/dashboard/ai`;

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadError(null);
    onDismissWarning();

    try {
      const formData = new FormData();
      Array.from(fileList).forEach((f) => formData.append('files', f));

      const res = await fetch('/api/ai/parse-reference', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.documents)) {
        throw new Error(data.error || 'Failed to parse uploaded document.');
      }

      const mapped: UploadedReferenceItem[] = data.documents.map(
        (doc: Omit<UploadedReferenceItem, 'id'>, idx: number) => ({
          ...doc,
          id: `ref-${doc.filename}-${doc.charCount}-${idx}`,
        })
      );
      onAddReferences(mapped);
    } catch (err) {
      console.error('Reference upload parse error:', err);
      setUploadError(
        err instanceof Error
          ? err.message
          : isRtl
          ? 'تعذر قراءة الملف المرفوع'
          : 'Failed to parse reference file.'
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddPastedReference = () => {
    const clean = pasteText.trim();
    if (!clean) return;
    const words = clean.match(/\S+/g)?.length || 0;
    onAddReferences([
      {
        id: `ref-notes-${clean.length}-${words}`,
        filename: pasteTitle.trim() || 'Project Brief Notes.txt',
        extension: 'txt',
        text: clean,
        wordCount: words,
        charCount: clean.length,
        metaSummary: isRtl ? 'ملاحظات مرجعية مضافة يدوياً' : 'Manual Text Reference',
      },
    ]);
    setPasteTitle('');
    setPasteText('');
    setShowPasteBox(false);
    onDismissWarning();
  };

  return (
    <div
      id="ai-reference-bar"
      className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 transition-all ${
        referenceWarning
          ? 'border-amber-400 bg-amber-50/70 ring-2 ring-amber-400/30'
          : hasReference
          ? 'border-purple-200 bg-gradient-to-br from-purple-50/60 via-white to-indigo-50/40'
          : 'border-slate-200 bg-slate-50/90'
      }`}
    >
      {/* Top Row: Title + Active AI Engine Pill + Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700">
              <TbSparkles className="w-4 h-4" />
              <span>
                {isRtl
                  ? 'الذكاء الاصطناعي المرجعي لقصة العميل'
                  : 'AI Reference Source for Case Study'}
              </span>
            </span>

            {activeAiMeta && (
              <Link
                href={aiSettingsHref}
                target="_blank"
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                  activeAiMeta.hasApiKey
                    ? 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                <TbSettings className="w-3 h-3" />
                <span>
                  {AI_PROVIDERS_META[activeAiMeta.provider]?.shortName || activeAiMeta.provider} •{' '}
                  {activeAiMeta.modelId} • {activeAiMeta.effectLevel.toUpperCase()}
                  {!activeAiMeta.hasApiKey &&
                    (isRtl ? ' (أضف مفتاح API)' : ' (No API Key Set)')}
                </span>
              </Link>
            )}
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            {isRtl
              ? 'ارفع ملف المرجع الخاص بالمشروع (Word أو PDF أو Excel أو Markdown أو TXT) ثم اضغط على زر "توليد بالذكاء الاصطناعي" بجانب أي حقل أو لجميع الحقول دفعة واحدة.'
              : 'Upload a project reference file (PDF, Word, Excel, Markdown, or TXT), then click "Generate with AI" next to any field or auto-fill the entire story.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.md,.txt,application/pdf,text/plain,text/markdown"
            onChange={(e) => handleFilesSelected(e.target.files)}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <TbLoader2 className="w-4 h-4 animate-spin" />
            ) : (
              <TbUpload className="w-4 h-4" />
            )}
            <span>
              {uploading
                ? isRtl
                  ? 'جاري قراءة الملف...'
                  : 'Parsing File...'
                : isRtl
                ? 'رفع ملف مرجع (PDF/Word/Excel/MD/TXT)'
                : 'Upload Reference File'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowPasteBox((prev) => !prev)}
            className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <TbPlus className="w-3.5 h-3.5" />
            <span>{isRtl ? 'لصق نص' : 'Paste Text'}</span>
          </button>

          <button
            type="button"
            onClick={onGenerateAll}
            disabled={isGeneratingAll || Boolean(generatingFieldKey)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              hasReference
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                : 'bg-purple-100 text-purple-700 hover:bg-amber-100 hover:text-amber-800'
            } disabled:opacity-60`}
          >
            {isGeneratingAll ? (
              <TbLoader2 className="w-4 h-4 animate-spin" />
            ) : (
              <TbSparkles className="w-4 h-4" />
            )}
            <span>
              {isGeneratingAll
                ? isRtl
                  ? 'جاري إنشاء القصة كاملة...'
                  : 'Generating Full Story...'
                : isRtl
                ? 'توليد القصة كاملة بالذكاء الاصطناعي'
                : 'Generate All Fields'}
            </span>
          </button>
        </div>
      </div>

      {/* Strict Guard Warning Alert if user clicked AI without uploading a reference */}
      {referenceWarning && (
        <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <TbAlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{referenceWarning}</span>
          </div>
          <button
            type="button"
            onClick={onDismissWarning}
            className="text-[11px] underline text-amber-800 shrink-0 cursor-pointer"
          >
            {isRtl ? 'إغلاق' : 'Dismiss'}
          </button>
        </div>
      )}

      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {uploadError}
        </div>
      )}

      {/* Optional Paste Text Drawer */}
      {showPasteBox && (
        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 animate-in fade-in">
          <input
            type="text"
            value={pasteTitle}
            onChange={(e) => setPasteTitle(e.target.value)}
            placeholder={isRtl ? 'عنوان الملاحظات (مثال: ملخص المشروع.txt)' : 'Reference Label (e.g. Client Brief.txt)'}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
          />
          <textarea
            rows={4}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={
              isRtl
                ? 'الصق نص ملخص المشروع أو تفاصيل العميل هنا...'
                : 'Paste project brief, case notes, metrics, or draft text here...'
            }
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPasteBox(false)}
              className="px-3 py-1 text-xs text-slate-500 cursor-pointer"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleAddPastedReference}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              {isRtl ? 'إضافة كمرجع' : 'Attach as Reference'}
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Reference Files Chips */}
      {hasReference && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {references.map((refDoc) => (
              <div
                key={refDoc.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs shadow-2xs"
              >
                <TbFileText className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800">{refDoc.filename}</span>
                  <span className="text-[10px] text-slate-400 ms-1.5 font-mono uppercase">
                    .{refDoc.extension} • {refDoc.wordCount.toLocaleString()} {isRtl ? 'كلمة' : 'words'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveReference(refDoc.id)}
                  className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                  title={isRtl ? 'إزالة الملف' : 'Remove reference'}
                >
                  <TbTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold">
            <TbCheck className="w-3.5 h-3.5" />
            <span>
              {totalWords.toLocaleString()} {isRtl ? 'كلمة مرجعية جاهزة' : 'reference words indexed'}
            </span>
            {lastUsageBanner && (
              <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 font-mono text-[10px]">
                Last AI: {lastUsageBanner.tokens.toLocaleString()} tok (
                {lastUsageBanner.isFreeTier ? 'Free' : `$${lastUsageBanner.costUsd.toFixed(5)}`})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
