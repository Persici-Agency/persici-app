'use client';

import React from 'react';
import { TbSparkles, TbArrowRight, TbCalendar, TbPhone, TbRocket } from 'react-icons/tb';

export interface CtaConfig {
  enabled?: boolean;
  labelEn: string;
  labelAr: string;
  href: string;
  icon?: string;
  animation?: 'none' | 'glow' | 'pulse' | 'bounce';
}

export interface CtaEditorProps {
  title?: string;
  cta: CtaConfig;
  onChange: (updated: CtaConfig) => void;
}

const AVAILABLE_ICONS = [
  { key: 'arrow-right', label: 'Arrow Right', icon: TbArrowRight },
  { key: 'sparkles', label: 'AI Sparkles', icon: TbSparkles },
  { key: 'calendar', label: 'Calendar', icon: TbCalendar },
  { key: 'phone', label: 'Phone Call', icon: TbPhone },
  { key: 'rocket', label: 'Growth Rocket', icon: TbRocket },
];

export function CtaEditor({ title = 'Call-to-Action Button', cta, onChange }: CtaEditorProps) {
  const updateField = <K extends keyof CtaConfig>(key: K, value: CtaConfig[K]) => {
    onChange({ ...cta, [key]: value });
  };

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">{title}</h4>
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={cta.enabled !== false}
            onChange={(e) => updateField('enabled', e.target.checked)}
            className="w-4 h-4 rounded text-persici-crimson focus:ring-persici-crimson border-slate-300"
          />
          <span>Enable Button</span>
        </label>
      </div>

      {cta.enabled !== false && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Button Label (English)
            </label>
            <input
              type="text"
              value={cta.labelEn}
              onChange={(e) => updateField('labelEn', e.target.value)}
              placeholder="Book a Discovery Call"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              نص الزر (العربية)
            </label>
            <input
              type="text"
              dir="rtl"
              value={cta.labelAr}
              onChange={(e) => updateField('labelAr', e.target.value)}
              placeholder="احجز جلسة استشارية"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Target Destination URL
            </label>
            <input
              type="text"
              value={cta.href}
              onChange={(e) => updateField('href', e.target.value)}
              placeholder="/contact or https://..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Button Icon
            </label>
            <select
              value={cta.icon || 'arrow-right'}
              onChange={(e) => updateField('icon', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 bg-white"
            >
              {AVAILABLE_ICONS.map((i) => (
                <option key={i.key} value={i.key}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Hover Animation Effect
            </label>
            <div className="flex gap-2">
              {(['none', 'glow', 'pulse', 'bounce'] as const).map((anim) => (
                <button
                  key={anim}
                  type="button"
                  onClick={() => updateField('animation', anim)}
                  className={`px-3 py-1 text-xs rounded-md border capitalize font-medium transition-colors ${
                    (cta.animation || 'none') === anim
                      ? 'bg-persici-crimson text-white border-persici-crimson'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {anim}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
