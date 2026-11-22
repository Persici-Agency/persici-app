'use client';

import React, { useState } from 'react';
import {
  TbPlus,
  TbTrash,
  TbGripVertical,
  TbArrowUp,
  TbArrowDown,
  TbSparkles,
  TbLoader2,
  TbLayoutList,
} from 'react-icons/tb';
import type { ImageUploadQualityMode } from '@dashboard-shared/components/media/types';
import {
  createEmptyTeamSection,
  type TeamMemberSection,
} from '@/lib/team-types';
import { TeamBlocksEditor } from './team-blocks-editor';
import type { TeamAiTargetField } from '@/app/api/ai/generate-team-member/route';

export interface TeamSectionsEditorProps {
  sections: TeamMemberSection[];
  onChange: (nextSections: TeamMemberSection[]) => void;
  lang: string;
  uploadQualityMode: ImageUploadQualityMode;
  onUploadQualityModeChange: (mode: ImageUploadQualityMode) => void;
  onOpenMediaPicker: (
    callback: (url: string) => void,
    type: 'image' | 'video' | 'all'
  ) => void;
  hasAiReference: boolean;
  generatingKey: string | null;
  onGenerateSectionAi: (sectionIdx: number, titleHint?: string) => void;
  onGenerateSectionBlockAi: (
    sectionIdx: number,
    targetField: Extract<TeamAiTargetField, 'code_block' | 'list_items'>,
    blockIdx: number,
    hint?: string
  ) => void;
}

export function TeamSectionsEditor({
  sections,
  onChange,
  lang,
  uploadQualityMode,
  onUploadQualityModeChange,
  onOpenMediaPicker,
  hasAiReference,
  generatingKey,
  onGenerateSectionAi,
  onGenerateSectionBlockAi,
}: TeamSectionsEditorProps) {
  const isRtl = lang === 'ar';
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [dragArmedId, setDragArmedId] = useState<string | null>(null);

  const addSection = () => {
    onChange([...sections, createEmptyTeamSection(sections.length + 1)]);
  };

  const updateSection = (idx: number, patch: Partial<TeamMemberSection>) => {
    const next = [...sections];
    if (!next[idx]) return;
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  const removeSection = (idx: number) => {
    onChange(sections.filter((_, i) => i !== idx));
  };

  const moveSection = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= sections.length || fromIdx === toIdx) return;
    const next = [...sections];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {sections.length === 0 ? (
        <div className="p-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 text-center space-y-3">
          <TbLayoutList className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {isRtl
              ? 'أضف أقساماً مخصصة لعرض خبرات الموظف أو إنجازاته أو نماذج أعماله البرمجية. كل قسم يحتوي على عنوان إلزامي وعنصر واحد على الأقل.'
              : 'Add custom sections to showcase career milestones, project ownership, or technical samples. Each section enforces a mandatory title and at least one content block.'}
          </p>
        </div>
      ) : (
        sections.map((section, secIdx) => {
          const isDragging = draggedIdx === secIdx;
          const isDragOver =
            dragOverIdx === secIdx && draggedIdx !== null && draggedIdx !== secIdx;

          return (
            <div
              key={section.id}
              draggable={dragArmedId === section.id}
              onDragStart={(e) => {
                setDraggedIdx(secIdx);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', section.id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (draggedIdx !== null && draggedIdx !== secIdx) {
                  setDragOverIdx(secIdx);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedIdx !== null && draggedIdx !== secIdx) {
                  moveSection(draggedIdx, secIdx);
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
              className={`rounded-2xl border bg-slate-50/80 p-5 space-y-4 transition-all ${
                isDragging
                  ? 'opacity-50 border-persici-crimson shadow-lg'
                  : isDragOver
                  ? 'border-persici-crimson ring-2 ring-persici-crimson/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Section Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onMouseDown={() => setDragArmedId(section.id)}
                    onMouseUp={() => setDragArmedId(null)}
                    title={isRtl ? 'اسحب لإعادة ترتيب القسم' : 'Drag to reorder section'}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 cursor-grab active:cursor-grabbing"
                  >
                    <TbGripVertical className="w-4 h-4" />
                  </button>
                  <span className="w-6 h-6 rounded-lg bg-persici-crimson text-white text-xs font-bold flex items-center justify-center">
                    {secIdx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {isRtl
                      ? section.title?.ar || section.title?.en || `قسم #${secIdx + 1}`
                      : section.title?.en || `Section #${secIdx + 1}`}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    disabled={generatingKey === `section:${secIdx}` || !hasAiReference}
                    onClick={() =>
                      onGenerateSectionAi(secIdx, section.title?.en || section.title?.ar)
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                  >
                    {generatingKey === `section:${secIdx}` ? (
                      <TbLoader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <TbSparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{isRtl ? 'توليد القسم بالذكاء' : 'AI Fill Section'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={secIdx === 0}
                    onClick={() => moveSection(secIdx, secIdx - 1)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <TbArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={secIdx === sections.length - 1}
                    onClick={() => moveSection(secIdx, secIdx + 1)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <TbArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(secIdx)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold cursor-pointer"
                  >
                    <TbTrash className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'حذف القسم' : 'Remove Section'}</span>
                  </button>
                </div>
              </div>

              {/* Mandatory Non-Removable Section Title */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {isRtl
                      ? 'عنوان القسم (إلزامي — غير قابل للحذف)'
                      : 'Section Title (Mandatory — Cannot Be Removed)'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-persici-crimson/10 text-persici-crimson text-[10px] font-bold">
                    {isRtl ? 'مطلوب' : 'Required'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Section Title (EN)"
                    value={section.title?.en || ''}
                    onChange={(e) =>
                      updateSection(secIdx, {
                        title: { en: e.target.value, ar: section.title?.ar || '' },
                      })
                    }
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-persici-crimson outline-none"
                  />
                  <input
                    type="text"
                    required
                    dir="rtl"
                    placeholder="عنوان القسم (AR)"
                    value={section.title?.ar || ''}
                    onChange={(e) =>
                      updateSection(secIdx, {
                        title: { en: section.title?.en || '', ar: e.target.value },
                      })
                    }
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold font-arabic focus:bg-white focus:border-persici-crimson outline-none"
                  />
                </div>
              </div>

              {/* Nested Draggable Content Blocks (minBlocks = 1) */}
              <div className="space-y-1.5">
                <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  {isRtl
                    ? `عناصر القسم (${section.blocks.length}) — اسحب لإعادة الترتيب:`
                    : `Section Blocks (${section.blocks.length}) — Drag to Reorder:`}
                </span>
                <TeamBlocksEditor
                  blocks={section.blocks}
                  onChange={(nextBlocks) => updateSection(secIdx, { blocks: nextBlocks })}
                  lang={lang}
                  minBlocks={1}
                  uploadQualityMode={uploadQualityMode}
                  onUploadQualityModeChange={onUploadQualityModeChange}
                  onOpenMediaPicker={onOpenMediaPicker}
                  hasAiReference={hasAiReference}
                  generatingKey={generatingKey}
                  contextPrefix={`sec-${secIdx}`}
                  onGenerateAiBlock={(targetField, blockIdx, hint) =>
                    onGenerateSectionBlockAi(secIdx, targetField, blockIdx, hint)
                  }
                />
              </div>
            </div>
          );
        })
      )}

      <button
        type="button"
        onClick={addSection}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-persici-crimson bg-white hover:bg-persici-crimson/[0.02] text-slate-700 hover:text-persici-crimson text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <TbPlus className="w-4 h-4" />
        <span>{isRtl ? 'إضافة قسم جديد لملف الموظف' : 'Add New Custom Section'}</span>
      </button>
    </div>
  );
}
