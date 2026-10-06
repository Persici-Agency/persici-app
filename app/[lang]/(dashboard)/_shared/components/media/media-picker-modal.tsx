'use client';

import React from 'react';
import { TbX, TbPhoto, TbVideo, TbFile } from 'react-icons/tb';
import { MediaStorageBrowser } from './media-storage-browser';
import { MediaType } from './types';

export interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
  defaultFolder?: string;
  allowedType?: MediaType | 'all';
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title,
  defaultFolder = '',
  allowedType = 'all',
}: MediaPickerModalProps) {
  if (!isOpen) return null;

  const computedTitle =
    title ||
    (allowedType === 'image'
      ? 'Select Image from Storage Library R2'
      : allowedType === 'video'
      ? 'Select Video from Storage Library R2'
      : allowedType === 'document'
      ? 'Select Document / PDF from Storage Library R2'
      : 'Select File from Storage Library (Cloudflare R2)');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-persici-crimson text-white flex items-center justify-center shadow-xs">
              {allowedType === 'video' ? (
                <TbVideo className="w-4 h-4" />
              ) : allowedType === 'image' ? (
                <TbPhoto className="w-4 h-4" />
              ) : (
                <TbFile className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">{computedTitle}</h3>
              <p className="text-[11px] text-slate-400">
                Browse, search, rename, preview, or upload assets in Storage Library R2
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            title="Close"
          >
            <TbX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Browser Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60">
          <MediaStorageBrowser
            mode="picker"
            allowedType={allowedType}
            defaultFolder={defaultFolder}
            onSelect={(url) => {
              onSelect(url);
              onClose();
            }}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
