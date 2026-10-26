'use client';

import React from 'react';
import { TbStar, TbTrash, TbPlus, TbPhoto, TbArrowLeft, TbArrowRight } from 'react-icons/tb';

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

  const handleAddAvatarR2 = () => {
    if (onOpenMediaPicker) {
      onOpenMediaPicker((url) => {
        const current = data.avatars || [];
        updateField('avatars', [...current, url]);
      });
    } else {
      handleAddAvatarUrl();
    }
  };

  const handleAddAvatarUrl = () => {
    const url = prompt('Enter image URL for client avatar:');
    if (url && url.trim()) {
      const current = data.avatars || [];
      updateField('avatars', [...current, url.trim()]);
    }
  };

  const handleRemoveAvatar = (index: number) => {
    const current = [...(data.avatars || [])];
    current.splice(index, 1);
    updateField('avatars', current);
  };

  const handleMoveAvatar = (index: number, direction: 'left' | 'right') => {
    const target = direction === 'left' ? index - 1 : index + 1;
    const current = [...(data.avatars || [])];
    if (target < 0 || target >= current.length) return;
    const temp = current[target];
    current[target] = current[index];
    current[index] = temp;
    updateField('avatars', current);
  };

  const handleReplaceAvatar = (index: number) => {
    if (onOpenMediaPicker) {
      onOpenMediaPicker((url) => {
        const current = [...(data.avatars || [])];
        current[index] = url;
        updateField('avatars', current);
      });
    }
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-700">
              Trust Avatars (Client Faces - {(data.avatars || []).length})
            </label>
            <p className="text-[10px] text-slate-400">Add, remove, reorder, or replace client avatars in the social proof stack.</p>
          </div>
          <div className="flex items-center gap-1.5">
            {onOpenMediaPicker && (
              <button
                type="button"
                onClick={handleAddAvatarR2}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-persici-crimson hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-2xs"
              >
                <TbPhoto className="w-3.5 h-3.5" />
                <span>Add from Storage (R2)</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleAddAvatarUrl}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold border border-slate-200 transition-colors"
            >
              <TbPlus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          {(data.avatars || []).map((src, idx) => (
            <div
              key={idx}
              className="group relative flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-2xs"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Client avatar" className="w-8 h-8 rounded-full object-cover border border-white shadow-xs" />
              
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveAvatar(idx, 'left')}
                  title="Move Left"
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                >
                  <TbArrowLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={idx === (data.avatars || []).length - 1}
                  onClick={() => handleMoveAvatar(idx, 'right')}
                  title="Move Right"
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                >
                  <TbArrowRight className="w-3 h-3" />
                </button>
                {onOpenMediaPicker && (
                  <button
                    type="button"
                    onClick={() => handleReplaceAvatar(idx)}
                    title="Replace with Cloudflare R2"
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <TbPhoto className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveAvatar(idx)}
                  title="Remove avatar"
                  className="p-1 text-slate-400 hover:text-red-600"
                >
                  <TbTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {(!data.avatars || data.avatars.length === 0) && (
            <p className="text-xs text-slate-400 italic py-1">No custom avatars added.</p>
          )}
        </div>
      </div>
    </div>
  );
}
