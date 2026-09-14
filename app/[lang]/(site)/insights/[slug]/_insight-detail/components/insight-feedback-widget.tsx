'use client';

import React, { useState } from 'react';
import { TbThumbUp, TbThumbDown, TbCheck } from 'react-icons/tb';

export interface InsightFeedbackWidgetProps {
  lang: string;
}

export function InsightFeedbackWidget({ lang }: InsightFeedbackWidgetProps) {
  const isRtl = lang === 'ar';
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);

  const handleVote = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="mt-16 pt-8 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-4"
    >
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700">
          {isRtl ? 'هل كانت هذه المقالة مفيدة لك؟' : 'Was this article helpful?'}
        </span>

        {feedback === null ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleVote('helpful')}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-700 transition-all cursor-pointer shadow-2xs"
              aria-label={isRtl ? 'نعم، مفيد' : 'Yes, helpful'}
            >
              <TbThumbUp className="h-4 w-4" />
              <span>{isRtl ? 'نعم' : 'Yes'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleVote('not-helpful')}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-rose-700 transition-all cursor-pointer shadow-2xs"
              aria-label={isRtl ? 'لا، غير مفيد' : 'No, not helpful'}
            >
              <TbThumbDown className="h-4 w-4" />
              <span>{isRtl ? 'لا' : 'No'}</span>
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <TbCheck className="h-4 w-4 text-emerald-600" />
            <span>
              {isRtl
                ? 'شكراً لمشاركتك تقييمك!'
                : 'Thank you for your feedback!'}
            </span>
          </div>
        )}
      </div>

      <div className="font-mono text-[11px] text-slate-400">
        {isRtl ? 'بيرسيكي للبحوث والتحليلات' : 'Persici Research & Intelligence'}
      </div>
    </div>
  );
}
