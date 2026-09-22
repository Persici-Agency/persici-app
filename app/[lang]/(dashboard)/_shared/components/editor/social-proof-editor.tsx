'use client';

import React from 'react';
import { TbStar, TbTrash, TbPlus } from 'react-icons/tb';

export interface SocialProofConfig {
  stars?: number;
  scoreTextEn: string;
  scoreTextAr: string;
  avatars?: string[];
}

export interface SocialProofEditorProps {
  data: SocialProofConfig;
  onChange: (updated: SocialProofConfig) => void;
  onOpenMediaPicker?: (callback: (url: string) => void) => void;
}

export function SocialProofEditor({ data, onChange, onOpenMediaPicker }: SocialProofEditorProps) {
  const updateField = <K extends keyof SocialProofConfig>(key: K, value: SocialProofConfig[K]) => {
    onChange({ ...data, [key]: value });
  };

  const handleAddAvatar = () => {
    if (onOpenMediaPicker) {
      onOpenMediaPicker((url) => {
        const current = data.avatars || [];
        updateField('avatars', [...current, url]);
      });
    } else {
      const url = prompt('Enter image URL for client avatar:');
      if (url) {
        const current = data.avatars || [];
        updateField('avatars', [...current, url]);
      }
    }
  };

  const handleRemoveAvatar = (index: number) => {
    const current = [...(data.avatars || [])];
    current.splice(index, 1);
    updateField('avatars', current);
  };

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Ratings & Social Proof Badge
        </h4>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => updateField('stars', star === data.stars ? 0 : star)}
              className={`p-1 rounded transition-colors ${
                (data.stars || 5) >= star ? 'text-amber-400' : 'text-slate-200 hover:text-slate-300'
              }`}
            >
              <TbStar className="w-5 h-5 fill-current" />
            </button>
          ))}
          <span className="text-xs font-bold text-slate-700 ms-1">
            {data.stars ? `${data.stars}.0 Stars` : 'Hidden'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Badge Rating Copy (English)
          </label>
          <input
            type="text"
            value={data.scoreTextEn}
            onChange={(e) => updateField('scoreTextEn', e.target.value)}
            placeholder="5.0 Score out of 100+ Reviews"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            نص التقييم (العربية)
          </label>
          <input
            type="text"
            dir="rtl"
            value={data.scoreTextAr}
            onChange={(e) => updateField('scoreTextAr', e.target.value)}
            placeholder="تقييم 5.0 بناءً على أكثر من 100 عميل"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Avatar Showcase */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-semibold text-slate-600">
            Trust Avatars (Client Faces)
          </label>
          <button
            type="button"
            onClick={handleAddAvatar}
            className="inline-flex items-center gap-1 text-xs text-persici-crimson hover:underline font-semibold"
          >
            <TbPlus className="w-3.5 h-3.5" />
            <span>Add Avatar</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {(data.avatars || []).map((src, idx) => (
            <div
              key={idx}
              className="relative group w-10 h-10 rounded-full border-2 border-white shadow-xs overflow-hidden bg-slate-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Client avatar" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveAvatar(idx)}
                title="Remove avatar"
                className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <TbTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(!data.avatars || data.avatars.length === 0) && (
            <p className="text-xs text-slate-400 italic">No custom avatars added.</p>
          )}
        </div>
      </div>
    </div>
  );
}
