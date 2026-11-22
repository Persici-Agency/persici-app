'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import {
  TbAlignLeft,
  TbPhoto,
  TbCode,
  TbListCheck,
  TbPlus,
  TbTrash,
  TbGripVertical,
  TbArrowUp,
  TbArrowDown,
  TbUpload,
  TbSparkles,
  TbLoader2,
  TbEye,
  TbEyeOff,
} from 'react-icons/tb';
import { RichTextEditor } from '@dashboard-shared/components';
import type { ImageUploadQualityMode } from '@dashboard-shared/components/media/types';
import {
  CODE_LANGUAGES,
  CodeShowcaseBlock,
  getCodeLanguageMeta,
} from '@/app/[lang]/_shared/components/code-showcase-block';
import {
  createEmptyTeamBlock,
  type TeamBlockType,
  type TeamContentBlock,
  type TeamImageSize,
  type TeamListItem,
} from '@/lib/team-types';
import type { TeamAiTargetField } from '@/app/api/ai/generate-team-member/route';

const IMAGE_SIZE_PRESETS: Array<{
  id: TeamImageSize;
  percent: number;
  labelEn: string;
  labelAr: string;
}> = [
  { id: 'sm', percent: 50, labelEn: 'Small (50%)', labelAr: 'صغير (50%)' },
  { id: 'md', percent: 70, labelEn: 'Medium (70%)', labelAr: 'متوسط (70%)' },
  { id: 'lg', percent: 85, labelEn: 'Large (85%)', labelAr: 'كبير (85%)' },
  { id: 'full', percent: 100, labelEn: 'Full (100%)', labelAr: 'كامل (100%)' },
];

export interface TeamBlocksEditorProps {
  blocks: TeamContentBlock[];
  onChange: (nextBlocks: TeamContentBlock[]) => void;
  lang: string;
  minBlocks?: number;
  uploadQualityMode: ImageUploadQualityMode;
  onUploadQualityModeChange: (mode: ImageUploadQualityMode) => void;
  onOpenMediaPicker: (
    callback: (url: string) => void,
    type: 'image' | 'video' | 'all'
  ) => void;
  hasAiReference: boolean;
  generatingKey: string | null;
  onGenerateAiBlock?: (
    targetField: Extract<TeamAiTargetField, 'code_block' | 'list_items'>,
    blockIndex: number,
    hint?: string
  ) => void;
  contextPrefix?: string;
}

export function TeamBlocksEditor({
  blocks,
  onChange,
  lang,
  minBlocks = 1,
  uploadQualityMode,
  onUploadQualityModeChange,
  onOpenMediaPicker,
  hasAiReference,
  generatingKey,
  onGenerateAiBlock,
  contextPrefix = 'desc',
}: TeamBlocksEditorProps) {
  const isRtl = lang === 'ar';
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [dragArmedId, setDragArmedId] = useState<string | null>(null);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const [previewCodeIds, setPreviewCodeIds] = useState<Record<string, boolean>>({});
  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});

  const addBlock = (type: TeamBlockType) => {
    onChange([...blocks, createEmptyTeamBlock(type, blocks.length + 1)]);
  };

  const updateBlock = (idx: number, patch: Partial<TeamContentBlock>) => {
    const next = [...blocks];
    if (!next[idx]) return;
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  const removeBlock = (idx: number) => {
    if (blocks.length <= minBlocks) return;
    onChange(blocks.filter((_, i) => i !== idx));
  };

  const moveBlock = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= blocks.length || fromIdx === toIdx) return;
    const next = [...blocks];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onChange(next);
  };

  const handleDirectUpload = async (blockIdx: number, blockId: string, file: File) => {
    if (!file) return;
    setUploadingBlockId(blockId);
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
        throw new Error(payload?.error || 'Failed to upload image');
      }
      updateBlock(blockIdx, { imageUrl: payload.media.url });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingBlockId(null);
      const inputEl = fileInputsRef.current[blockId];
      if (inputEl) inputEl.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Blocks List */}
      {blocks.map((block, idx) => {
        const isDraggingThis = draggedIdx === idx;
        const isDragOver = dragOverIdx === idx && draggedIdx !== null && draggedIdx !== idx;
        const blockBadge =
          block.type === 'paragraph'
            ? { labelEn: 'Paragraph', labelAr: 'فقرة نصية', icon: <TbAlignLeft className="w-3.5 h-3.5" />, cls: 'bg-slate-100 text-slate-700' }
            : block.type === 'image'
            ? { labelEn: 'Image', labelAr: 'صورة', icon: <TbPhoto className="w-3.5 h-3.5" />, cls: 'bg-sky-50 text-sky-700 border-sky-200' }
            : block.type === 'code'
            ? { labelEn: 'Code Block', labelAr: 'نموذج برمجي', icon: <TbCode className="w-3.5 h-3.5" />, cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
            : { labelEn: 'List / Milestones', labelAr: 'قائمة / إنجازات', icon: <TbListCheck className="w-3.5 h-3.5" />, cls: 'bg-amber-50 text-amber-800 border-amber-200' };

        return (
          <div
            key={block.id}
            draggable={dragArmedId === block.id}
            onDragStart={(e) => {
              setDraggedIdx(idx);
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', block.id);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (draggedIdx !== null && draggedIdx !== idx) {
                setDragOverIdx(idx);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedIdx !== null && draggedIdx !== idx) {
                moveBlock(draggedIdx, idx);
              }
              setDraggedIdx(null);
              setDragOverIdx(null);
              setDragArmedId(null);
            }}
            onDragEnd={() => {
              setDraggedIdx(null);
              setDragOverIdx(null);
              setDragArmedId(null);
            }}
            className={`rounded-2xl border bg-white p-4 transition-all space-y-3 ${
              isDraggingThis
                ? 'opacity-50 border-persici-crimson shadow-lg scale-[0.99]'
                : isDragOver
                ? 'border-persici-crimson ring-2 ring-persici-crimson/20'
                : 'border-slate-200 shadow-2xs'
            }`}
          >
            {/* Block Header Bar with Drag Handle */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onMouseDown={() => setDragArmedId(block.id)}
                  onMouseUp={() => setDragArmedId(null)}
                  title={isRtl ? 'اسحب لإعادة ترتيب العنصر' : 'Drag to reorder block'}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 cursor-grab active:cursor-grabbing"
                >
                  <TbGripVertical className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  #{idx + 1}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${blockBadge.cls}`}
                >
                  {blockBadge.icon}
                  <span>{isRtl ? blockBadge.labelAr : blockBadge.labelEn}</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveBlock(idx, idx - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  title={isRtl ? 'تحريك لأعلى' : 'Move up'}
                >
                  <TbArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === blocks.length - 1}
                  onClick={() => moveBlock(idx, idx + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  title={isRtl ? 'تحريك لأسفل' : 'Move down'}
                >
                  <TbArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={blocks.length <= minBlocks}
                  onClick={() => removeBlock(idx)}
                  className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title={
                    blocks.length <= minBlocks
                      ? isRtl
                        ? `يجب الاحتفاظ بعنصر واحد على الأقل`
                        : `At least ${minBlocks} block is required`
                      : isRtl
                      ? 'حذف العنصر'
                      : 'Remove block'
                  }
                >
                  <TbTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* TYPE 1: PARAGRAPH */}
            {block.type === 'paragraph' && (
              <RichTextEditor
                label={isRtl ? 'محتوى الفقرة (EN / AR)' : 'Paragraph Content (Styled Rich Text)'}
                rows={4}
                valueEn={block.content?.en || ''}
                valueAr={block.content?.ar || ''}
                onChangeEn={(val) =>
                  updateBlock(idx, {
                    content: { en: val, ar: block.content?.ar || '' },
                  })
                }
                onChangeAr={(val) =>
                  updateBlock(idx, {
                    content: { en: block.content?.en || '', ar: val },
                  })
                }
              />
            )}

            {/* TYPE 2: IMAGE (Quality Toggle + R2 Picker + Resize) */}
            {block.type === 'image' && (
              <div className="space-y-3">
                <input
                  ref={(el) => {
                    fileInputsRef.current[block.id] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleDirectUpload(idx, block.id, file);
                  }}
                />

                {/* Quality Mode Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-600">
                    {isRtl ? 'ضغط الصورة قبل الرفع:' : 'WebP Compression Mode:'}
                  </span>
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-white border border-slate-200">
                    <button
                      type="button"
                      onClick={() => onUploadQualityModeChange('high-webp')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        uploadQualityMode === 'high-webp'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <TbSparkles className="w-3 h-3" />
                      <span>{isRtl ? 'جودة عالية WebP' : 'High Quality WebP'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onUploadQualityModeChange('reduced-webp')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        uploadQualityMode === 'reduced-webp'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{isRtl ? 'مضغوطة (حجم أصغر)' : 'Reduced Quality WebP'}</span>
                    </button>
                  </div>
                </div>

                {/* Upload & Picker Row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {block.imageUrl ? (
                    <Image
                      src={block.imageUrl}
                      alt={block.imageAlt?.en || 'Block preview'}
                      width={120}
                      height={80}
                      unoptimized
                      className="w-28 h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-28 h-20 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                      <TbPhoto className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      dir="ltr"
                      value={block.imageUrl || ''}
                      onChange={(e) => updateBlock(idx, { imageUrl: e.target.value })}
                      placeholder="https://... (Cloudflare R2 URL)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={uploadingBlockId === block.id}
                        onClick={() => fileInputsRef.current[block.id]?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                      >
                        {uploadingBlockId === block.id ? (
                          <TbLoader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <TbUpload className="w-3.5 h-3.5" />
                        )}
                        <span>{isRtl ? 'رفع صورة' : 'Upload File'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenMediaPicker(
                            (url) => updateBlock(idx, { imageUrl: url }),
                            'image'
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        <TbPhoto className="w-3.5 h-3.5 text-persici-crimson" />
                        <span>{isRtl ? 'اختر من مكتبة R2' : 'Browse R2 Library'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resize Presets + Alt/Caption */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">
                    {isRtl ? 'حجم العرض:' : 'Display Width:'}
                  </span>
                  {IMAGE_SIZE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => updateBlock(idx, { imageSize: preset.id })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                        (block.imageSize || 'lg') === preset.id
                          ? 'bg-persici-crimson text-white border-persici-crimson'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isRtl ? preset.labelAr : preset.labelEn}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Image Caption / Alt (EN)"
                    value={block.imageCaption?.en || ''}
                    onChange={(e) =>
                      updateBlock(idx, {
                        imageCaption: { en: e.target.value, ar: block.imageCaption?.ar || '' },
                        imageAlt: { en: e.target.value, ar: block.imageAlt?.ar || '' },
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="وصف / تعليق الصورة (AR)"
                    value={block.imageCaption?.ar || ''}
                    onChange={(e) =>
                      updateBlock(idx, {
                        imageCaption: { en: block.imageCaption?.en || '', ar: e.target.value },
                        imageAlt: { en: block.imageAlt?.en || '', ar: e.target.value },
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-arabic"
                  />
                </div>
              </div>
            )}

            {/* TYPE 3: CODE BLOCK */}
            {block.type === 'code' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={block.codeLanguage || 'typescript'}
                      onChange={(e) => {
                        const meta = getCodeLanguageMeta(e.target.value);
                        updateBlock(idx, {
                          codeLanguage: e.target.value,
                          codeTitle: {
                            en: block.codeTitle?.en || meta.defaultTitleEn,
                            ar: block.codeTitle?.ar || meta.defaultTitleAr,
                          },
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold"
                    >
                      {CODE_LANGUAGES.map((langOpt) => (
                        <option key={langOpt.id} value={langOpt.id}>
                          {langOpt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewCodeIds((prev) => ({
                          ...prev,
                          [block.id]: !prev[block.id],
                        }))
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      {previewCodeIds[block.id] ? (
                        <TbEyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <TbEye className="w-3.5 h-3.5" />
                      )}
                      <span>{previewCodeIds[block.id] ? 'Hide Preview' : 'Preview Code'}</span>
                    </button>
                  </div>

                  {onGenerateAiBlock && (
                    <button
                      type="button"
                      disabled={generatingKey === `${contextPrefix}:code:${idx}` || !hasAiReference}
                      onClick={() => onGenerateAiBlock('code_block', idx, block.codeLanguage)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                    >
                      {generatingKey === `${contextPrefix}:code:${idx}` ? (
                        <TbLoader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <TbSparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{isRtl ? 'توليد كود بالذكاء' : 'AI Generate Code'}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Code Block Title (EN)"
                    value={block.codeTitle?.en || ''}
                    onChange={(e) =>
                      updateBlock(idx, {
                        codeTitle: { en: e.target.value, ar: block.codeTitle?.ar || '' },
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="عنوان نموذج الكود (AR)"
                    value={block.codeTitle?.ar || ''}
                    onChange={(e) =>
                      updateBlock(idx, {
                        codeTitle: { en: block.codeTitle?.en || '', ar: e.target.value },
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold font-arabic"
                  />
                </div>

                <textarea
                  rows={6}
                  dir="ltr"
                  value={block.code || ''}
                  onChange={(e) => updateBlock(idx, { code: e.target.value })}
                  placeholder="// Paste or generate clean code snippet..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs leading-relaxed border border-slate-800 focus:outline-none focus:ring-2 focus:ring-persici-crimson/40"
                />

                {previewCodeIds[block.id] && block.code && (
                  <CodeShowcaseBlock
                    language={block.codeLanguage || 'typescript'}
                    title={isRtl ? block.codeTitle?.ar || block.codeTitle?.en : block.codeTitle?.en}
                    code={block.code}
                    compact={true}
                  />
                )}
              </div>
            )}

            {/* TYPE 4: LIST / MILESTONES */}
            {block.type === 'list' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => updateBlock(idx, { listStyle: 'milestones' })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                        (block.listStyle || 'milestones') === 'milestones'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      {isRtl ? 'محطات وإنجازات' : 'Milestones (with Year/Tag)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateBlock(idx, { listStyle: 'bullets' })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                        block.listStyle === 'bullets'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      {isRtl ? 'قائمة نقطية' : 'Bullets List'}
                    </button>
                  </div>

                  {onGenerateAiBlock && (
                    <button
                      type="button"
                      disabled={generatingKey === `${contextPrefix}:list:${idx}` || !hasAiReference}
                      onClick={() => onGenerateAiBlock('list_items', idx)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                    >
                      {generatingKey === `${contextPrefix}:list:${idx}` ? (
                        <TbLoader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <TbSparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{isRtl ? 'توليد القائمة بالذكاء' : 'AI Generate List'}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="List Heading (EN, optional)"
                    value={block.listTitle?.en || ''}
                    onChange={(e) =>
                      updateBlock(idx, {
                        listTitle: { en: e.target.value, ar: block.listTitle?.ar || '' },
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="عنوان القائمة (AR، اختياري)"
                    value={block.listTitle?.ar || ''}
                    onChange={(e) =>
                      updateBlock(idx, {
                        listTitle: { en: block.listTitle?.en || '', ar: e.target.value },
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold font-arabic"
                  />
                </div>

                <div className="space-y-2">
                  {(block.items || []).map((item, itemIdx) => {
                    const updateListItem = (patch: Partial<TeamListItem>) => {
                      const nextItems = [...(block.items || [])];
                      nextItems[itemIdx] = { ...nextItems[itemIdx], ...patch };
                      updateBlock(idx, { items: nextItems });
                    };
                    return (
                      <div
                        key={item.id || itemIdx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-2 items-center"
                      >
                        {(block.listStyle || 'milestones') === 'milestones' && (
                          <>
                            <input
                              type="text"
                              placeholder="Tag/Year EN"
                              value={item.label?.en || ''}
                              onChange={(e) =>
                                updateListItem({
                                  label: { en: e.target.value, ar: item.label?.ar || '' },
                                })
                              }
                              className="md:col-span-2 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono"
                            />
                            <input
                              type="text"
                              dir="rtl"
                              placeholder="الوسم/السنة AR"
                              value={item.label?.ar || ''}
                              onChange={(e) =>
                                updateListItem({
                                  label: { en: item.label?.en || '', ar: e.target.value },
                                })
                              }
                              className="md:col-span-2 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-arabic"
                            />
                          </>
                        )}
                        <input
                          type="text"
                          placeholder="Point / Milestone (EN)"
                          value={item.text?.en || ''}
                          onChange={(e) =>
                            updateListItem({
                              text: { en: e.target.value, ar: item.text?.ar || '' },
                            })
                          }
                          className={`${
                            (block.listStyle || 'milestones') === 'milestones'
                              ? 'md:col-span-4'
                              : 'md:col-span-5'
                          } px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs`}
                        />
                        <input
                          type="text"
                          dir="rtl"
                          placeholder="البند / الإنجاز (AR)"
                          value={item.text?.ar || ''}
                          onChange={(e) =>
                            updateListItem({
                              text: { en: item.text?.en || '', ar: e.target.value },
                            })
                          }
                          className={`${
                            (block.listStyle || 'milestones') === 'milestones'
                              ? 'md:col-span-3'
                              : 'md:col-span-6'
                          } px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-arabic`}
                        />
                        <div className="md:col-span-1 flex justify-end">
                          <button
                            type="button"
                            disabled={(block.items || []).length <= 1}
                            onClick={() =>
                              updateBlock(idx, {
                                items: (block.items || []).filter((_, ii) => ii !== itemIdx),
                              })
                            }
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 disabled:opacity-30 cursor-pointer"
                          >
                            <TbTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      updateBlock(idx, {
                        items: [
                          ...(block.items || []),
                          {
                            id: `item-${Date.now()}-${(block.items || []).length}`,
                            label: { en: '2026', ar: '2026' },
                            text: { en: '', ar: '' },
                          },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    <TbPlus className="w-3.5 h-3.5 text-persici-crimson" />
                    <span>{isRtl ? 'إضافة عنصر جديد' : 'Add List Item'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Toolbar: Add Block */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 me-1">
          {isRtl ? 'إضافة عنصر:' : 'Add Block:'}
        </span>
        <button
          type="button"
          onClick={() => addBlock('paragraph')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer"
        >
          <TbAlignLeft className="w-3.5 h-3.5 text-persici-crimson" />
          <span>{isRtl ? '+ فقرة نصية' : '+ Paragraph'}</span>
        </button>
        <button
          type="button"
          onClick={() => addBlock('image')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer"
        >
          <TbPhoto className="w-3.5 h-3.5 text-sky-600" />
          <span>{isRtl ? '+ صورة' : '+ Image'}</span>
        </button>
        <button
          type="button"
          onClick={() => addBlock('code')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer"
        >
          <TbCode className="w-3.5 h-3.5 text-indigo-600" />
          <span>{isRtl ? '+ كود برمجي' : '+ Code Block'}</span>
        </button>
        <button
          type="button"
          onClick={() => addBlock('list')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer"
        >
          <TbListCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>{isRtl ? '+ قائمة / إنجازات' : '+ List / Milestones'}</span>
        </button>
      </div>
    </div>
  );
}
