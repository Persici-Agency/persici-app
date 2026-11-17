'use client';

import React from 'react';
import { TbSparkles, TbLoader2 } from 'react-icons/tb';
import type { StoryAiTargetField, NarrativeSectionRole } from '@/app/api/ai/generate-story-field/route';

export interface StoryAiFieldControls {
  hasReference: boolean;
  generatingFieldKey: string | null;
  onGenerateField: (
    targetField: StoryAiTargetField,
    options?: {
      sectionContext?: NarrativeSectionRole;
      paragraphIndex?: number;
      codeBlockIndex?: number;
      codeLanguage?: string;
      keyLabel?: string;
    }
  ) => void | Promise<void>;
  onMissingReference: () => void;
}

export interface AiFieldTriggerProps {
  onGenerate: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  hasReference: boolean;
  allowWithoutReference?: boolean;
  onMissingReference: () => void;
  lang: string;
  labelEn?: string;
  labelAr?: string;
  variant?: 'inline' | 'pill';
  className?: string;
}

export function AiFieldTrigger({
  onGenerate,
  isLoading = false,
  disabled = false,
  hasReference,
  allowWithoutReference = false,
  onMissingReference,
  lang,
  labelEn = 'Generate with AI',
  labelAr = 'توليد بالذكاء الاصطناعي',
  variant = 'inline',
  className = '',
}: AiFieldTriggerProps) {
  const isRtl = lang === 'ar';
  const canGenerate = hasReference || allowWithoutReference;

  const handleClick = () => {
    if (disabled || isLoading) return;
    if (!canGenerate) {
      onMissingReference();
      return;
    }
    onGenerate();
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isLoading}
        title={
          !canGenerate
            ? isRtl
              ? 'يرجى رفع ملف مرجع أولاً'
              : 'Upload a reference file first to enable AI generation'
            : undefined
        }
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
          canGenerate
            ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 shadow-2xs'
            : 'bg-slate-100 hover:bg-amber-50 text-slate-500 hover:text-amber-700 border-slate-200 hover:border-amber-200'
        } disabled:opacity-60 ${className}`}
      >
        {isLoading ? (
          <TbLoader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
        ) : (
          <TbSparkles className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>
          {isLoading
            ? isRtl
              ? 'جاري التوليد...'
              : 'Generating...'
            : isRtl
            ? labelAr
            : labelEn}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      title={
        !canGenerate
          ? isRtl
            ? 'يرجى رفع ملف مرجع أولاً'
            : 'Upload a reference file first to generate content'
          : undefined
      }
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
        canGenerate
          ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
          : 'bg-slate-100 hover:bg-amber-50 text-slate-500 hover:text-amber-700 border-slate-200 hover:border-amber-200'
      } disabled:opacity-60 ${className}`}
    >
      {isLoading ? (
        <TbLoader2 className="w-3 h-3 animate-spin shrink-0" />
      ) : (
        <TbSparkles className="w-3 h-3 shrink-0" />
      )}
      <span>
        {isLoading
          ? isRtl
            ? 'جاري التوليد...'
            : 'Generating...'
          : isRtl
          ? labelAr
          : labelEn}
      </span>
    </button>
  );
}
