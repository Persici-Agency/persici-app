'use client';

import React from 'react';
import { TbSparkles, TbLoader2, TbLanguage } from 'react-icons/tb';
import type { StoryAiTargetField, NarrativeSectionRole } from '@/app/api/ai/generate-story-field/route';
import type { ClientStoryDetail } from '@/app/[lang]/(site)/client-stories/_client-stories/types';

export interface StoryAiTranslateParams {
  key: string;
  text: string;
  sourceLang: 'en' | 'ar';
  targetLang: 'en' | 'ar';
  isHtml?: boolean;
  fieldHint?: string;
  onSuccess?: (translated: string) => void;
  updateStory?: (prev: ClientStoryDetail, translated: string) => ClientStoryDetail;
}

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
  translatingKeys?: Record<string, boolean>;
  onTranslate?: (params: StoryAiTranslateParams) => void | Promise<void>;
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

export function hasTranslatableContent(raw?: string, isHtml = false): boolean {
  if (!raw) return false;
  if (!isHtml) return raw.trim().length > 0;
  return (
    raw
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .trim().length > 0
  );
}

export interface AiTranslateTriggerProps {
  onTranslate: () => void | Promise<void>;
  sourceText?: string;
  targetLang: 'en' | 'ar';
  isHtml?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  lang: string;
  size?: 'xs' | 'sm';
  labelEn?: string;
  labelAr?: string;
  className?: string;
}

export function AiTranslateTrigger({
  onTranslate,
  sourceText,
  targetLang,
  isHtml = false,
  isLoading = false,
  disabled = false,
  lang,
  size = 'sm',
  labelEn = 'Translate',
  labelAr = 'ترجمة',
  className = '',
}: AiTranslateTriggerProps) {
  const isRtl = lang === 'ar';
  const hasSource = hasTranslatableContent(sourceText, isHtml);
  const canTranslate = !disabled && hasSource;

  const sizeClass =
    size === 'xs'
      ? 'px-2 py-0.5 rounded-md text-[10px]'
      : 'px-2.5 py-0.5 rounded-lg text-[11px]';

  const tooltipText = !hasSource
    ? targetLang === 'ar'
      ? isRtl
        ? 'أدخل المحتوى بالإنجليزية أولاً للترجمة إلى العربية'
        : 'Enter English content first to translate into Arabic'
      : isRtl
      ? 'أدخل المحتوى بالعربية أولاً للترجمة إلى الإنجليزية'
      : 'Enter Arabic content first to translate into English'
    : targetLang === 'ar'
    ? isRtl
      ? 'ترجمة من الإنجليزية إلى العربية بالذكاء الاصطناعي'
      : 'Translate English → Arabic with AI'
    : isRtl
    ? 'ترجمة من العربية إلى الإنجليزية بالذكاء الاصطناعي'
    : 'Translate Arabic → English with AI';

  return (
    <button
      type="button"
      onClick={() => {
        if (!canTranslate || isLoading) return;
        void onTranslate();
      }}
      disabled={!canTranslate || isLoading}
      title={tooltipText}
      className={`inline-flex items-center gap-1 font-bold transition-all border ${sizeClass} ${
        canTranslate
          ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 cursor-pointer'
          : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-65'
      } ${className}`}
    >
      {isLoading ? (
        <TbLoader2 className="w-3 h-3 animate-spin shrink-0" />
      ) : (
        <TbLanguage className="w-3 h-3 shrink-0" />
      )}
      <span>
        {isLoading
          ? isRtl
            ? 'جاري الترجمة...'
            : 'Translating...'
          : isRtl
          ? labelAr
          : labelEn}
      </span>
    </button>
  );
}
