'use client';

import React, { useState } from 'react';
import type { InsightDetail } from '../../../_insights/types';
import {
  TbSparkles,
  TbCircleCheck,
  TbLoader2,
  TbRefresh,
  TbChevronUp,
  TbChevronDown,
} from 'react-icons/tb';

export interface InsightAiOverviewProps {
  insight: InsightDetail;
  lang: string;
}

export function InsightAiOverview({ insight, lang }: InsightAiOverviewProps) {
  const isRtl = lang === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([]);
  const [aiSource, setAiSource] = useState<'gemini-live' | 'synthesizer' | null>(null);

  const title = insight.title[lang as 'en' | 'ar'] || insight.title.en;

  const handleGenerate = async () => {
    setIsOpen(true);
    setIsLoading(true);

    try {
      // Extract the content directly from the designated article content container ID
      let articleText = '';
      if (typeof document !== 'undefined') {
        const container = document.getElementById('insight-main-article-content');
        if (container) {
          articleText = container.innerText;
        }
      }

      // Fallback to structured section paragraphs if container text is empty
      if (!articleText || articleText.trim().length < 50) {
        articleText = insight.sections
          .map((sec) => {
            const h = sec.heading[lang as 'en' | 'ar'] || sec.heading.en;
            const p = (sec.paragraphs[lang as 'en' | 'ar'] || sec.paragraphs.en).join('\n');
            return `${h}\n${p}`;
          })
          .join('\n\n');
      }

      const res = await fetch('/api/insights/ai-overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: articleText,
          lang,
          slug: insight.slug,
        }),
      });

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
        setKeyTakeaways(data.keyTakeaways || []);
        setAiSource(data.source || 'gemini-live');
      }
    } catch (err) {
      console.warn('[InsightAiOverview] Failed to fetch live overview, using dataset fallback:', err);
      // Fallback from dataset
      const defaultSummary =
        insight.aiOverview?.summary[lang as 'en' | 'ar'] ||
        insight.aiOverview?.summary.en ||
        (insight.excerpt[lang as 'en' | 'ar'] || insight.excerpt.en);
      const defaultTakeaways =
        insight.aiOverview?.keyTakeaways.map(
          (t) => t[lang as 'en' | 'ar'] || t.en
        ) ||
        insight.sections.slice(0, 3).map((sec) => {
          const h = sec.heading[lang as 'en' | 'ar'] || sec.heading.en;
          const p = (sec.paragraphs[lang as 'en' | 'ar'] || sec.paragraphs.en)[0] || '';
          return `${h}: ${p.slice(0, 110)}...`;
        });

      setSummary(defaultSummary);
      setKeyTakeaways(defaultTakeaways);
      setAiSource('synthesizer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="mb-10 w-full">
      {/* 1. Trigger Button replacing the 10-minute read pill */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-full border border-persici-crimson/30 bg-persici-crimson/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-persici-crimson shadow-2xs hover:bg-persici-crimson hover:text-white transition-all duration-300 cursor-pointer active:scale-98 disabled:opacity-75 select-none group"
          aria-label={
            isRtl
              ? 'توليد نظرة عامة سريعة بواسطة الذكاء الاصطناعي'
              : 'Generate Quick Overview by AI'
          }
        >
          {isLoading ? (
            <TbLoader2 className="h-4 w-4 animate-spin text-persici-crimson group-hover:text-white" />
          ) : (
            <TbSparkles className="h-4 w-4 text-persici-crimson group-hover:text-white transition-transform group-hover:rotate-12" />
          )}
          <span>
            {isLoading
              ? isRtl
                ? 'جارٍ التحليل والتوليد بواسطة Gemini...'
                : 'Generating with Gemini AI...'
              : summary
              ? isRtl
                ? 'إعادة التوليد بالذكاء الاصطناعي'
                : 'Regenerate Overview with AI'
              : isRtl
              ? 'توليد نظرة عامة بواسطة الذكاء الاصطناعي'
              : 'Generate Quick Overview by AI'}
          </span>
        </button>

        {/* If already generated, provide an expand / collapse toggle */}
        {summary && !isLoading && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1 px-2 cursor-pointer"
          >
            <span>{isOpen ? (isRtl ? 'إخفاء' : 'Collapse') : (isRtl ? 'عرض النظرة العامة' : 'Show Overview')}</span>
            {isOpen ? <TbChevronUp className="h-3.5 w-3.5" /> : <TbChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* 2. Quick Overview by AI Container */}
      {isOpen && (
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-persici-crimson/25 bg-linear-to-br from-persici-crimson/[0.04] via-slate-50/85 to-amber-500/[0.03] p-6 sm:p-7 shadow-xs backdrop-blur-xs animate-in fade-in slide-in-from-top-3 duration-300">
          {/* Subtle ambient light glow */}
          <div className="pointer-events-none absolute -top-10 -end-10 h-32 w-32 rounded-full bg-persici-crimson/10 blur-2xl" />

          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-persici-crimson/15 pb-4 mb-5 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-persici-crimson/10 text-persici-crimson">
                <TbSparkles className="h-4 w-4 animate-pulse" />
              </div>
              <h3 className="font-primary text-sm sm:text-base font-medium text-slate-900 tracking-tight">
                {isRtl
                  ? 'نظرة عامة سريعة بواسطة الذكاء الاصطناعي'
                  : 'Quick Overview by AI'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-slate-200/80 px-2.5 py-1 text-[9.5px] font-mono font-medium text-slate-600 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-persici-crimson animate-ping" />
                <span>
                  {aiSource === 'gemini-live'
                    ? 'Google Gemini 2.5 Flash'
                    : isRtl
                    ? 'ذكاء بيرسيشي التحليلي'
                    : 'Persici AI Synthesis'}
                </span>
              </span>

              {/* Refresh button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                title={isRtl ? 'إعادة التوليد' : 'Regenerate'}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <TbRefresh className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="relative z-10">
            {isLoading ? (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-3 text-xs text-persici-crimson font-medium">
                  <TbLoader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {isRtl
                      ? 'يقوم الذكاء الاصطناعي بتحليل الأقسام واستخلاص الرؤى التنفيذية...'
                      : 'Gemini AI is analyzing article sections and extracting executive takeaways...'}
                  </span>
                </div>
                <div className="space-y-2.5 animate-pulse">
                  <div className="h-3.5 bg-slate-200 rounded-full w-full" />
                  <div className="h-3.5 bg-slate-200 rounded-full w-5/6" />
                  <div className="h-3.5 bg-slate-200 rounded-full w-4/6" />
                </div>
              </div>
            ) : summary ? (
              <>
                <p className="text-sm sm:text-[13px] font-medium leading-relaxed text-slate-800">
                  {summary}
                </p>

                {/* Key Takeaways */}
                {keyTakeaways.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-200/60">
                    <h4 className="font-mono text-[9.5px] font-medium uppercase tracking-wider text-slate-500 mb-3">
                      {isRtl ? 'أبرز النقاط المستخلصة (Key Takeaways)' : 'Key Takeaways'}
                    </h4>
                    <ul className="space-y-2.5">
                      {keyTakeaways.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
                        >
                          <TbCircleCheck className="h-4 w-4 shrink-0 text-persici-crimson mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
