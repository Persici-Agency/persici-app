'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  TbX,
  TbDeviceFloppy,
  TbSparkles,
  TbUpload,
  TbPhoto,
  TbUser,
  TbWorld,
  TbLoader2,
  TbFileText,
  TbPlus,
  TbTrash,
  TbAlertCircle,
  TbCheck,
  TbSettings,
  TbAlignLeft,
  TbLayoutList,
} from 'react-icons/tb';
import { MediaPickerModal } from '@dashboard-shared/components';
import type { ImageUploadQualityMode } from '@dashboard-shared/components/media/types';
import type { AiEffectLevel, AiProviderId } from '@/lib/ai-types';
import {
  createEmptyTeamBlock,
  normalizeTeamMember,
  validateTeamMemberPayload,
  type TeamAiReferenceDoc,
  type TeamContentBlock,
  type TeamMemberDetail,
  type TeamMemberSection,
} from '@/lib/team-types';
import { TeamBlocksEditor } from './team-blocks-editor';
import { TeamSectionsEditor } from './team-sections-editor';
import type { TeamAiTargetField } from '@/app/api/ai/generate-team-member/route';

export interface ActiveAiMetaInfo {
  provider: AiProviderId;
  modelId: string;
  effectLevel: AiEffectLevel;
  hasApiKey: boolean;
  isFreeTier: boolean;
}

export interface TeamMemberEditorModalProps {
  initialMember: TeamMemberDetail;
  isNew: boolean;
  lang: string;
  passkey?: string;
  activeAiMeta: ActiveAiMetaInfo | null;
  onClose: () => void;
  onSaved: (saved: TeamMemberDetail, isNew: boolean) => void;
}

export function TeamMemberEditorModal({
  initialMember,
  isNew,
  lang,
  passkey,
  activeAiMeta,
  onClose,
  onSaved,
}: TeamMemberEditorModalProps) {
  const isRtl = lang === 'ar';
  const [form, setForm] = useState<TeamMemberDetail>(() =>
    normalizeTeamMember(initialMember)
  );
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiBanner, setAiBanner] = useState<string | null>(null);

  // Media picker & WebP compression toggle
  const [uploadQualityMode, setUploadQualityMode] =
    useState<ImageUploadQualityMode>('high-webp');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState<
    ((url: string) => void) | null
  >(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // AI Reference state (.pdf, .docx, .txt + raw paste)
  const refFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingRef, setUploadingRef] = useState(false);
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);

  const references = form.aiReferences || [];
  const combinedReferenceText = references
    .map((r) => `--- ${r.filename} ---\n${r.text}`)
    .join('\n\n')
    .trim();
  const hasReference = Boolean(
    combinedReferenceText || form.firstName.en || form.title.en
  );

  const aiSettingsHref = passkey
    ? `/${lang}/dashboard/ai?passkey=${encodeURIComponent(passkey)}`
    : `/${lang}/dashboard/ai`;

  const openMediaPicker = (cb: (url: string) => void) => {
    setMediaPickerCallback(() => cb);
    setMediaPickerOpen(true);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;
    setUploadingAvatar(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'team');
      formData.append('qualityMode', uploadQualityMode);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const payload = await res.json();
      if (!res.ok || !payload?.media?.url) {
        throw new Error(payload?.error || 'Failed to upload profile photo');
      }
      setForm((prev) => ({ ...prev, avatar: payload.media.url }));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleReferenceFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingRef(true);
    setErrorMsg(null);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('files', f));
      const res = await fetch('/api/ai/parse-reference', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to parse reference document');
      }
      const added = (data.documents || []) as TeamAiReferenceDoc[];
      setForm((prev) => ({
        ...prev,
        aiReferences: [...(prev.aiReferences || []), ...added],
      }));
      setAiBanner(
        isRtl
          ? `تم تحليل ${added.length} ملف مرجعي بنجاح.`
          : `Parsed ${added.length} reference file(s) ready for AI generation.`
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Reference upload failed');
    } finally {
      setUploadingRef(false);
      if (refFileInputRef.current) refFileInputRef.current.value = '';
    }
  };

  const handleAddPastedReference = () => {
    const clean = pasteText.trim();
    if (!clean) return;
    const words = clean.split(/\s+/).filter(Boolean).length;
    const doc: TeamAiReferenceDoc = {
      id: `note-${Date.now()}`,
      filename: pasteTitle.trim() || 'Pasted Bio / CV Note.txt',
      extension: 'txt',
      text: clean,
      wordCount: words,
      charCount: clean.length,
      metaSummary: `${words} words (pasted text)`,
    };
    setForm((prev) => ({
      ...prev,
      aiReferences: [...(prev.aiReferences || []), doc],
    }));
    setPasteTitle('');
    setPasteText('');
    setShowPasteBox(false);
  };

  const runAiGeneration = async (
    targetField: TeamAiTargetField,
    options?: {
      genKey?: string;
      sectionIdx?: number;
      blockIdx?: number;
      scope?: 'description' | 'section';
      titleHint?: string;
      codeLangHint?: string;
    }
  ) => {
    const key = options?.genKey || targetField;
    setGeneratingKey(key);
    setErrorMsg(null);
    setAiBanner(null);

    try {
      const res = await fetch('/api/ai/generate-team-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetField,
          referenceText: combinedReferenceText,
          sectionTitleHint: options?.titleHint,
          codeLanguageHint: options?.codeLangHint,
          currentMemberContext: {
            id: form.id,
            firstName: form.firstName,
            lastName: form.lastName,
            title: form.title,
            portfolioUrl: form.portfolioUrl,
          },
        }),
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || 'AI generation failed');
      }

      const r = payload.result as Record<string, unknown>;

      if (targetField === 'all') {
        setForm((prev) => ({
          ...prev,
          firstName: (r.firstName as TeamMemberDetail['firstName']) || prev.firstName,
          lastName: (r.lastName as TeamMemberDetail['lastName']) || prev.lastName,
          title: (r.title as TeamMemberDetail['title']) || prev.title,
          portfolioUrl:
            typeof r.portfolioUrl === 'string' && r.portfolioUrl.trim()
              ? r.portfolioUrl.trim()
              : prev.portfolioUrl,
          descriptionBlocks:
            Array.isArray(r.descriptionBlocks) && r.descriptionBlocks.length > 0
              ? (r.descriptionBlocks as TeamContentBlock[])
              : prev.descriptionBlocks,
          sections:
            Array.isArray(r.sections) && r.sections.length > 0
              ? (r.sections as TeamMemberSection[])
              : prev.sections,
        }));
      } else if (targetField === 'profile') {
        setForm((prev) => ({
          ...prev,
          firstName: (r.firstName as TeamMemberDetail['firstName']) || prev.firstName,
          lastName: (r.lastName as TeamMemberDetail['lastName']) || prev.lastName,
          title: (r.title as TeamMemberDetail['title']) || prev.title,
          portfolioUrl:
            typeof r.portfolioUrl === 'string' && r.portfolioUrl.trim()
              ? r.portfolioUrl.trim()
              : prev.portfolioUrl,
        }));
      } else if (targetField === 'description') {
        if (Array.isArray(r.descriptionBlocks) && r.descriptionBlocks.length > 0) {
          setForm((prev) => ({
            ...prev,
            descriptionBlocks: r.descriptionBlocks as TeamContentBlock[],
          }));
        }
      } else if (targetField === 'section' && options?.sectionIdx !== undefined) {
        const genSec = r.section as TeamMemberSection | undefined;
        if (genSec) {
          setForm((prev) => {
            const nextSecs = [...prev.sections];
            nextSecs[options.sectionIdx!] = {
              ...genSec,
              id: nextSecs[options.sectionIdx!]?.id || genSec.id,
            };
            return { ...prev, sections: nextSecs };
          });
        }
      } else if (targetField === 'code_block' && options?.blockIdx !== undefined) {
        const genCode = r.codeBlock as TeamContentBlock | undefined;
        if (genCode) {
          setForm((prev) => {
            if (options.scope === 'section' && options.sectionIdx !== undefined) {
              const nextSecs = [...prev.sections];
              const targetSec = nextSecs[options.sectionIdx];
              if (targetSec) {
                const nextBlks = [...targetSec.blocks];
                nextBlks[options.blockIdx!] = {
                  ...genCode,
                  id: nextBlks[options.blockIdx!]?.id || genCode.id,
                };
                nextSecs[options.sectionIdx] = { ...targetSec, blocks: nextBlks };
              }
              return { ...prev, sections: nextSecs };
            }
            const nextBlks = [...prev.descriptionBlocks];
            nextBlks[options.blockIdx!] = {
              ...genCode,
              id: nextBlks[options.blockIdx!]?.id || genCode.id,
            };
            return { ...prev, descriptionBlocks: nextBlks };
          });
        }
      } else if (targetField === 'list_items' && options?.blockIdx !== undefined) {
        const items = Array.isArray(r.items) ? r.items : null;
        if (items) {
          setForm((prev) => {
            if (options.scope === 'section' && options.sectionIdx !== undefined) {
              const nextSecs = [...prev.sections];
              const targetSec = nextSecs[options.sectionIdx];
              if (targetSec) {
                const nextBlks = [...targetSec.blocks];
                const cur = nextBlks[options.blockIdx!];
                if (cur) {
                  nextBlks[options.blockIdx!] = {
                    ...cur,
                    listTitle:
                      (r.listTitle as TeamContentBlock['listTitle']) || cur.listTitle,
                    items: items.map((it: Record<string, unknown>, ii: number) => ({
                      id: `item-${Date.now()}-${ii}`,
                      label: (it.label as { en: string; ar: string }) || { en: '', ar: '' },
                      text: (it.text as { en: string; ar: string }) || { en: '', ar: '' },
                    })),
                  };
                }
                nextSecs[options.sectionIdx] = { ...targetSec, blocks: nextBlks };
              }
              return { ...prev, sections: nextSecs };
            }
            const nextBlks = [...prev.descriptionBlocks];
            const cur = nextBlks[options.blockIdx!];
            if (cur) {
              nextBlks[options.blockIdx!] = {
                ...cur,
                listTitle: (r.listTitle as TeamContentBlock['listTitle']) || cur.listTitle,
                items: items.map((it: Record<string, unknown>, ii: number) => ({
                  id: `item-${Date.now()}-${ii}`,
                  label: (it.label as { en: string; ar: string }) || { en: '', ar: '' },
                  text: (it.text as { en: string; ar: string }) || { en: '', ar: '' },
                })),
              };
            }
            return { ...prev, descriptionBlocks: nextBlks };
          });
        }
      }

      if (payload.usage) {
        const u = payload.usage as {
          totalTokens?: number;
          estimatedCostUsd?: number;
          isFreeTier?: boolean;
        };
        setAiBanner(
          isRtl
            ? `تم التوليد بالذكاء الاصطناعي (${u.totalTokens || 0} رمز${
                u.isFreeTier ? ' · مجاني' : ` · $${(u.estimatedCostUsd || 0).toFixed(4)}`
              }).`
            : `AI generated successfully (${u.totalTokens || 0} tokens${
                u.isFreeTier
                  ? ' · Free Tier'
                  : ` · ~$${(u.estimatedCostUsd || 0).toFixed(4)}`
              }).`
        );
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setGeneratingKey(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const normalized = normalizeTeamMember({
      ...form,
      descriptionBlocks:
        form.descriptionBlocks.length > 0
          ? form.descriptionBlocks
          : [createEmptyTeamBlock('paragraph')],
    });
    const validationErr = validateTeamMemberPayload(normalized);
    if (validationErr) {
      setErrorMsg(validationErr);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/team', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized),
      });
      const data = await res.json();
      if (!res.ok || !data?.success || !data.member) {
        throw new Error(data?.error || 'Failed to save team member');
      }
      onSaved(data.member, isNew);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-y-auto"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl max-h-[94vh] bg-slate-50 rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Sticky Modal Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-persici-crimson/10 text-persici-crimson flex items-center justify-center">
              <TbUser className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isNew
                  ? isRtl
                    ? 'إضافة عضو فريق جديد'
                    : 'Add New Team Member'
                  : isRtl
                  ? `تعديل ملف: ${form.firstName.ar || form.firstName.en} ${form.lastName.ar || form.lastName.en}`
                  : `Edit Member: ${form.firstName.en} ${form.lastName.en}`}
              </h2>
              <p className="text-xs text-slate-500">
                {isRtl
                  ? 'الأقسام وعناصر الوصف قابلة للسحب وإعادة الترتيب بحرية'
                  : 'Profile fields, draggable rich description blocks, draggable custom sections & AI Studio'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-persici-crimson hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <TbLoader2 className="w-4 h-4 animate-spin" />
              ) : (
                <TbDeviceFloppy className="w-4 h-4" />
              )}
              <span>{saving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : isRtl ? 'حفظ العضو' : 'Save Member'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <TbX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
              <TbAlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {aiBanner && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
              <TbCheck className="w-4 h-4 shrink-0" />
              <span>{aiBanner}</span>
            </div>
          )}

          {/* 1. AI REFERENCE & GENERATION BAR */}
          <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50/70 via-white to-white p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900">
                    <TbSparkles className="w-4 h-4 text-purple-600" />
                    <span>
                      {isRtl
                        ? 'مساعد الذكاء الاصطناعي لملفات الفريق (CV / Bio)'
                        : 'Team Profile AI Reference & Content Generator'}
                    </span>
                  </span>
                  {activeAiMeta && (
                    <Link
                      href={aiSettingsHref}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-semibold"
                    >
                      <TbSettings className="w-3 h-3" />
                      <span>
                        {activeAiMeta.modelId}
                        {!activeAiMeta.hasApiKey &&
                          (isRtl ? ' (أضف API Key)' : ' (No API Key Set)')}
                      </span>
                    </Link>
                  )}
                </div>
                <p className="text-[11px] text-slate-600">
                  {isRtl
                    ? 'ارفع السيرة الذاتية أو النبذة التعريفية (.pdf, .docx, .txt) أو الصق النص لتوليد البيانات والوصف والأقسام باللغتين تلقائياً.'
                    : 'Upload an employee CV/bio (.pdf, .docx, .txt) or paste notes to auto-generate profile details, description blocks, and custom sections.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <input
                  ref={refFileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.txt,.md,application/pdf,text/plain,text/markdown"
                  className="hidden"
                  onChange={(e) => void handleReferenceFiles(e.target.files)}
                />
                <button
                  type="button"
                  disabled={uploadingRef}
                  onClick={() => refFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {uploadingRef ? (
                    <TbLoader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TbUpload className="w-4 h-4" />
                  )}
                  <span>{isRtl ? 'رفع ملف (PDF/DOCX/TXT)' : 'Upload CV / Bio'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasteBox((p) => !p)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  <TbPlus className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'لصق نص' : 'Paste Text'}</span>
                </button>
                <button
                  type="button"
                  disabled={generatingKey !== null || !hasReference}
                  onClick={() => void runAiGeneration('all', { genKey: 'all' })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs disabled:opacity-40 cursor-pointer"
                >
                  {generatingKey === 'all' ? (
                    <TbLoader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TbSparkles className="w-4 h-4" />
                  )}
                  <span>
                    {generatingKey === 'all'
                      ? isRtl
                        ? 'جاري التوليد...'
                        : 'Generating All...'
                      : isRtl
                      ? 'توليد الملف كاملاً بالذكاء'
                      : 'Generate All with AI'}
                  </span>
                </button>
              </div>
            </div>

            {showPasteBox && (
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                <input
                  type="text"
                  placeholder={isRtl ? 'عنوان الملاحظة (اختياري)' : 'Reference Title (optional)'}
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                />
                <textarea
                  rows={4}
                  placeholder={
                    isRtl
                      ? 'الصق السيرة الذاتية أو نبذة الموظف هنا...'
                      : 'Paste employee bio, LinkedIn summary, achievements, or CV text...'
                  }
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasteBox(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddPastedReference}
                    className="px-3.5 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold cursor-pointer"
                  >
                    {isRtl ? 'إضافة كمرجع' : 'Attach Note'}
                  </button>
                </div>
              </div>
            )}

            {references.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {references.map((doc) => (
                  <div
                    key={doc.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-xs"
                  >
                    <TbFileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="font-semibold text-slate-800 max-w-[180px] truncate">
                      {doc.filename}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({doc.wordCount}w)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          aiReferences: (prev.aiReferences || []).filter(
                            (r) => r.id !== doc.id
                          ),
                        }))
                      }
                      className="text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      <TbTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. CORE EMPLOYEE IDENTITY */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TbUser className="w-5 h-5 text-persici-crimson" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isRtl
                    ? '1. البيانات الأساسية للموظف'
                    : '1. Core Profile Details'}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={generatingKey !== null || !hasReference}
                  onClick={() => void runAiGeneration('profile', { genKey: 'profile' })}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-semibold disabled:opacity-40 cursor-pointer"
                >
                  {generatingKey === 'profile' ? (
                    <TbLoader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <TbSparkles className="w-3 h-3" />
                  )}
                  <span>{isRtl ? 'توليد بالذكاء' : 'AI Fill Profile'}</span>
                </button>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active !== false}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, active: e.target.checked }))
                    }
                    className="rounded border-slate-300 text-persici-crimson focus:ring-persici-crimson"
                  />
                  <span>
                    {isRtl ? 'ظاهر في كاروسيل الرئيسية' : 'Visible in Homepage Carousel'}
                  </span>
                </label>
              </div>
            </div>

            {/* Avatar + Names/Title */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Avatar Column */}
              <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleAvatarUpload(file);
                  }}
                />
                <div className="flex items-center gap-3">
                  {form.avatar ? (
                    <Image
                      src={form.avatar}
                      alt={form.firstName.en || 'Avatar'}
                      width={72}
                      height={72}
                      unoptimized
                      className="w-18 h-18 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-18 h-18 rounded-2xl bg-slate-200/70 flex items-center justify-center text-slate-400 shrink-0">
                      <TbUser className="w-7 h-7" />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <span className="block text-xs font-bold text-slate-800">
                      {isRtl ? 'الصورة الشخصية' : 'Profile Photo'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        disabled={uploadingAvatar}
                        onClick={() => avatarInputRef.current?.click()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                      >
                        {uploadingAvatar ? (
                          <TbLoader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <TbUpload className="w-3 h-3" />
                        )}
                        <span>{isRtl ? 'رفع' : 'Upload'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker((url) =>
                            setForm((prev) => ({ ...prev, avatar: url }))
                          )
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-[11px] font-semibold cursor-pointer"
                      >
                        <TbPhoto className="w-3 h-3 text-persici-crimson" />
                        <span>R2</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quality Toggle for Avatar */}
                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <span className="text-slate-500 font-semibold">
                    {isRtl ? 'وضع WebP:' : 'WebP Mode:'}
                  </span>
                  <div className="inline-flex p-0.5 rounded-lg bg-white border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setUploadQualityMode('high-webp')}
                      className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                        uploadQualityMode === 'high-webp'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600'
                      }`}
                    >
                      High
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadQualityMode('reduced-webp')}
                      className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                        uploadQualityMode === 'reduced-webp'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-600'
                      }`}
                    >
                      Compressed
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  dir="ltr"
                  value={form.avatar}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, avatar: e.target.value }))
                  }
                  placeholder="https://..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono"
                />
              </div>

              {/* Names, Title, Optional Portfolio Column */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    First Name (EN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName.en}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        firstName: { ...prev.firstName, en: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-persici-crimson outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الاسم الأول (AR) *
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={form.firstName.ar}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        firstName: { ...prev.firstName, ar: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-arabic font-medium focus:bg-white focus:border-persici-crimson outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Last Name (EN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName.en}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        lastName: { ...prev.lastName, en: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-persici-crimson outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الاسم الأخير / العائلة (AR) *
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={form.lastName.ar}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        lastName: { ...prev.lastName, ar: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-arabic font-medium focus:bg-white focus:border-persici-crimson outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Job Title / Role (EN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title.en}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        title: { ...prev.title, en: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-persici-crimson outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المسمى الوظيفي (AR) *
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={form.title.ar}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        title: { ...prev.title, ar: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-arabic font-medium focus:bg-white focus:border-persici-crimson outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                    <TbWorld className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {isRtl
                        ? 'رابط البورتفوليو أو الموقع الشخصي (اختياري)'
                        : 'Portfolio or Personal Website URL (Optional)'}
                    </span>
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    value={form.portfolioUrl || ''}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, portfolioUrl: e.target.value }))
                    }
                    placeholder="https://portfolio.example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono focus:bg-white focus:border-persici-crimson outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. DRAGGABLE MAIN DESCRIPTION BLOCKS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <TbAlignLeft className="w-5 h-5 text-persici-crimson" />
                  <h3 className="text-sm font-bold text-slate-900">
                    {isRtl
                      ? '2. الوصف الرئيسي وعناصر المحتوى (قابلة للسحب والترتيب)'
                      : '2. Member Description & Rich Content Blocks (Draggable)'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRtl
                    ? 'أضف فقرات منسقة، صوراً، أكواداً برمجية، أو قوائم إنجازات واسحبها لترتيبها بدقة.'
                    : 'Add styled paragraphs, images, code snippets, or milestones/lists and drag blocks into any sequence.'}
                </p>
              </div>
              <button
                type="button"
                disabled={generatingKey !== null || !hasReference}
                onClick={() =>
                  void runAiGeneration('description', { genKey: 'description' })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                {generatingKey === 'description' ? (
                  <TbLoader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <TbSparkles className="w-3.5 h-3.5" />
                )}
                <span>{isRtl ? 'توليد الوصف بالذكاء' : 'AI Generate Description'}</span>
              </button>
            </div>

            <TeamBlocksEditor
              blocks={form.descriptionBlocks}
              onChange={(nextBlocks) =>
                setForm((prev) => ({ ...prev, descriptionBlocks: nextBlocks }))
              }
              lang={lang}
              minBlocks={1}
              uploadQualityMode={uploadQualityMode}
              onUploadQualityModeChange={setUploadQualityMode}
              onOpenMediaPicker={(cb) => openMediaPicker(cb)}
              hasAiReference={hasReference}
              generatingKey={generatingKey}
              contextPrefix="desc"
              onGenerateAiBlock={(targetField, blockIdx, hint) =>
                void runAiGeneration(targetField, {
                  genKey: `desc:${targetField === 'code_block' ? 'code' : 'list'}:${blockIdx}`,
                  scope: 'description',
                  blockIdx,
                  codeLangHint: hint,
                })
              }
            />
          </div>

          {/* 4. DRAGGABLE CUSTOM SECTIONS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TbLayoutList className="w-5 h-5 text-persici-crimson" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isRtl
                    ? '3. الأقسام المخصصة الإضافية (قابلة للسحب والإضافة والحذف)'
                    : '3. Custom Profile Sections (Draggable Sections & Blocks)'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRtl
                  ? 'كل قسم يحتوي على عنوان إلزامي وعنصر محتوى واحد على الأقل. يمكنك سحب الأقسام أو العناصر لتغيير ترتيبها.'
                  : 'Every custom section keeps a mandatory title and at least one draggable content block inside it.'}
              </p>
            </div>

            <TeamSectionsEditor
              sections={form.sections}
              onChange={(nextSections) =>
                setForm((prev) => ({ ...prev, sections: nextSections }))
              }
              lang={lang}
              uploadQualityMode={uploadQualityMode}
              onUploadQualityModeChange={setUploadQualityMode}
              onOpenMediaPicker={(cb) => openMediaPicker(cb)}
              hasAiReference={hasReference}
              generatingKey={generatingKey}
              onGenerateSectionAi={(secIdx, titleHint) =>
                void runAiGeneration('section', {
                  genKey: `section:${secIdx}`,
                  sectionIdx: secIdx,
                  titleHint,
                })
              }
              onGenerateSectionBlockAi={(secIdx, targetField, blockIdx, hint) =>
                void runAiGeneration(targetField, {
                  genKey: `sec-${secIdx}:${
                    targetField === 'code_block' ? 'code' : 'list'
                  }:${blockIdx}`,
                  scope: 'section',
                  sectionIdx: secIdx,
                  blockIdx,
                  codeLangHint: hint,
                })
              }
            />
          </div>
        </div>
      </form>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        allowedType="image"
        defaultFolder="team"
        defaultQualityMode={uploadQualityMode}
        onClose={() => {
          setMediaPickerOpen(false);
          setMediaPickerCallback(null);
        }}
        onSelect={(url) => {
          if (mediaPickerCallback) mediaPickerCallback(url);
          setMediaPickerOpen(false);
          setMediaPickerCallback(null);
        }}
      />
    </div>
  );
}
