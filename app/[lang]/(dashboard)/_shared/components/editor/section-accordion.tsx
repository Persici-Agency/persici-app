'use client';

import React, { useState } from 'react';
import { TbChevronDown, TbChevronUp, TbCheck, TbDeviceFloppy } from 'react-icons/tb';

export interface SectionAccordionProps {
  number: string | number;
  title: string;
  description?: string;
  isOpenDefault?: boolean;
  onSave?: () => Promise<void> | void;
  saving?: boolean;
  children: React.ReactNode;
}

export function SectionAccordion({
  number,
  title,
  description,
  isOpenDefault = false,
  onSave,
  saving = false,
  children,
}: SectionAccordionProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSave) return;
    await onSave();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <div className="border border-slate-200/90 rounded-2xl bg-white shadow-xs overflow-hidden transition-all duration-200 mb-5">
      {/* Accordion Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 sm:px-6 cursor-pointer hover:bg-slate-50/70 transition-colors select-none"
      >
        <div className="flex items-center gap-4">
          <span className="w-8 h-8 rounded-lg bg-persici-crimson/10 text-persici-crimson border border-persici-crimson/20 flex items-center justify-center text-xs font-bold font-mono">
            {typeof number === 'number' && number < 10 ? `0${number}` : number}
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
            {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onSave && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                justSaved
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-persici-crimson hover:bg-red-600 text-white shadow-sm shadow-persici-crimson/20'
              }`}
            >
              {justSaved ? (
                <>
                  <TbCheck className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : saving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <TbDeviceFloppy className="w-3.5 h-3.5" />
                  <span>Save Section</span>
                </>
              )}
            </button>
          )}

          <div className="p-1 text-slate-400 hover:text-slate-600 rounded-md">
            {isOpen ? <TbChevronUp className="w-5 h-5" /> : <TbChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/30 space-y-6">
          {children}
        </div>
      )}
    </div>
  );
}
