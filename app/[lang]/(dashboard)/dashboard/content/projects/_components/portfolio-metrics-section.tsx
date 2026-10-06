'use client';

import React from 'react';
import { TbPlus, TbTrash, TbChartBar } from 'react-icons/tb';
import type {
  ClientStoryDetail,
  StoryMetric,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';

interface PortfolioMetricsSectionProps {
  story: ClientStoryDetail;
  onChange: (updated: ClientStoryDetail) => void;
  lang: string;
}

export function PortfolioMetricsSection({
  story,
  onChange,
  lang,
}: PortfolioMetricsSectionProps) {
  const isRtl = lang === 'ar';
  const metrics = story.metrics || [];

  const handleAddMetric = () => {
    if (metrics.length >= 4) return;
    const newMetric: StoryMetric = {
      value: '+100%',
      label: { en: 'Metric Label', ar: 'عنوان المؤشر' },
    };
    onChange({ ...story, metrics: [...metrics, newMetric] });
  };

  const handleUpdateMetric = (
    index: number,
    field: 'value' | 'en' | 'ar',
    val: string
  ) => {
    const updated = [...metrics];
    if (field === 'value') {
      updated[index] = { ...updated[index], value: val };
    } else {
      updated[index] = {
        ...updated[index],
        label: { ...updated[index].label, [field]: val },
      };
    }
    onChange({ ...story, metrics: updated });
  };

  const handleRemoveMetric = (index: number) => {
    const updated = [...metrics];
    updated.splice(index, 1);
    onChange({ ...story, metrics: updated });
  };

  return (
    <div id="sec-metrics" className="space-y-6 pt-2">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-persici-crimson/10 text-persici-crimson text-xs font-mono font-bold flex items-center justify-center">
              03
            </span>
            <span>{isRtl ? 'مؤشرات الأداء والإنجاز (CountUp)' : 'Key Impact Metrics (CountUp)'}</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {isRtl
              ? 'أرقام وإحصائيات التأثير المحقق (2 - 4 مؤشرات) تظهر كعدادات متحركة أعلى صفحة المشروع.'
              : 'Add 2 to 4 tangible outcome metrics displayed as CountUp animations at the top of the story.'}
          </p>
        </div>

        {metrics.length < 4 && (
          <button
            type="button"
            onClick={handleAddMetric}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <TbPlus className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إضافة مؤشر' : 'Add Metric'}</span>
          </button>
        )}
      </div>

      {metrics.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <TbChartBar className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-xs font-medium text-slate-600">
            {isRtl ? 'لم تتم إضافة مؤشرات بعد' : 'No metrics added yet'}
          </p>
          <button
            type="button"
            onClick={handleAddMetric}
            className="mt-3 px-3 py-1.5 bg-persici-crimson text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            {isRtl ? 'إضافة أول مؤشر' : 'Add First Metric'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-slate-400">
                  {isRtl ? `مؤشر 0${idx + 1}` : `Metric #0${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveMetric(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                  title="Remove metric"
                >
                  <TbTrash className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isRtl ? 'القيمة الرقمية (Value e.g. +340%, 14.2M+, 4.8★)' : 'Stat Value (e.g. +340%, 14.2M+, 4.8★)'}
                </label>
                <input
                  type="text"
                  required
                  value={m.value}
                  onChange={(e) => handleUpdateMetric(idx, 'value', e.target.value)}
                  placeholder="+340%"
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-persici-crimson outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    {isRtl ? 'الوصف (EN)' : 'Label (EN)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={m.label.en}
                    onChange={(e) => handleUpdateMetric(idx, 'en', e.target.value)}
                    placeholder="Revenue Growth"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-persici-crimson outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    {isRtl ? 'الوصف (AR)' : 'Label (AR)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    required
                    value={m.label.ar}
                    onChange={(e) => handleUpdateMetric(idx, 'ar', e.target.value)}
                    placeholder="نمو الإيرادات"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-persici-crimson outline-none font-arabic"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
