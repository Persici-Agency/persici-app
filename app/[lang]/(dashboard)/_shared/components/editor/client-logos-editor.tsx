'use client';

import React, { useState } from 'react';
import {
  TbPlus,
  TbTrash,
  TbPhoto,
  TbGripVertical,
  TbArrowLeft,
  TbArrowRight,
  TbRefresh,
  TbLink,
  TbCheck,
} from 'react-icons/tb';
import { clientLogos as defaultClientLogos } from '@shared/data';
import type { ClientLogo } from '@shared/types';

export interface ClientLogosEditorProps {
  logos: ClientLogo[];
  onChange: (logos: ClientLogo[]) => void;
  onOpenMediaPicker: (callback: (url: string) => void) => void;
  title?: string;
  subtitle?: string;
}

function inferBrandNameFromUrl(url: string): string {
  try {
    const fileName = url.split('/').pop()?.split('?')[0] || '';
    const cleaned = fileName
      .replace(/\.(webp|png|jpg|jpeg|svg|gif)$/i, '')
      .replace(/-logo(-dark|-light)?$/i, '')
      .replace(/[-_]+/g, ' ')
      .trim();
    if (!cleaned) return 'Partner Brand';
    return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
  } catch {
    return 'Partner Brand';
  }
}

export function normalizeLogosList(rawLogos?: unknown): ClientLogo[] {
  if (Array.isArray(rawLogos) && rawLogos.length > 0) {
    return rawLogos
      .filter((item) => item && typeof item === 'object' && Boolean((item as ClientLogo).src))
      .map((item, idx) => {
        const logo = item as Partial<ClientLogo>;
        return {
          id: logo.id || `logo-${idx + 1}`,
          name: logo.name || inferBrandNameFromUrl(logo.src || ''),
          src: logo.src || '',
          order: idx + 1,
          isActive: logo.isActive !== false,
        };
      });
  }
  return defaultClientLogos.map((logo, idx) => ({
    ...logo,
    id: logo.id || `logo-${idx + 1}`,
    order: idx + 1,
    isActive: true,
  }));
}

export function ClientLogosEditor({
  logos,
  onChange,
  onOpenMediaPicker,
  title = 'Client Logos Swiper List',
  subtitle = 'Drag and drop cards to reorder positions in the live marquee, click any image to replace it, or add new partner logos.',
}: ClientLogosEditorProps) {
  const effectiveLogos = normalizeLogosList(logos);

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoSrc, setNewLogoSrc] = useState('');

  const commitLogos = (nextList: ClientLogo[]) => {
    const normalized = nextList.map((item, index) => ({
      ...item,
      id: item.id || `logo-${index + 1}`,
      order: index + 1,
      isActive: item.isActive !== false,
    }));
    onChange(normalized);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex =
      draggedIdx !== null ? draggedIdx : Number(e.dataTransfer.getData('text/plain'));
    setDraggedIdx(null);
    setDragOverIdx(null);

    if (
      Number.isNaN(sourceIndex) ||
      sourceIndex < 0 ||
      sourceIndex >= effectiveLogos.length ||
      sourceIndex === targetIndex
    ) {
      return;
    }

    const updated = [...effectiveLogos];
    const [moved] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, moved);
    commitLogos(updated);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleMoveStep = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= effectiveLogos.length) return;
    const updated = [...effectiveLogos];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    commitLogos(updated);
  };

  const handleAddFromMediaPicker = () => {
    onOpenMediaPicker((url) => {
      const inferredName = inferBrandNameFromUrl(url);
      const nextLogo: ClientLogo = {
        id: `logo-custom-${effectiveLogos.length + 1}`,
        name: inferredName,
        src: url,
        order: effectiveLogos.length + 1,
        isActive: true,
      };
      commitLogos([...effectiveLogos, nextLogo]);
    });
  };

  const handleAddCustomSubmit = () => {
    if (!newLogoSrc.trim()) return;
    const nextLogo: ClientLogo = {
      id: `logo-custom-${effectiveLogos.length + 1}`,
      name: newLogoName.trim() || inferBrandNameFromUrl(newLogoSrc.trim()),
      src: newLogoSrc.trim(),
      order: effectiveLogos.length + 1,
      isActive: true,
    };
    commitLogos([...effectiveLogos, nextLogo]);
    setNewLogoName('');
    setNewLogoSrc('');
    setShowAddCustom(false);
  };

  const handleResetToDefaults = () => {
    commitLogos(
      defaultClientLogos.map((logo, idx) => ({
        ...logo,
        order: idx + 1,
        isActive: true,
      }))
    );
  };

  return (
    <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
      {/* Header & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {title} ({effectiveLogos.length})
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-persici-crimson/10 text-persici-crimson">
              Drag & Drop Enabled
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
            title="Restore the default 15 client logos"
          >
            <TbRefresh className="w-3.5 h-3.5" />
            <span>Reset 15 Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddCustom((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <TbLink className="w-3.5 h-3.5" />
            <span>Add by URL</span>
          </button>

          <button
            type="button"
            onClick={handleAddFromMediaPicker}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
          >
            <TbPlus className="w-3.5 h-3.5" />
            <span>Add Partner Logo</span>
          </button>
        </div>
      </div>

      {/* Optional Add-by-URL / Custom Drawer */}
      {showAddCustom && (
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Add New Partner Logo</span>
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              className="text-[11px] text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-4">
              <input
                type="text"
                placeholder="Brand Name (e.g. Accor)"
                value={newLogoName}
                onChange={(e) => setNewLogoName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
            </div>
            <div className="sm:col-span-6 flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Logo Image URL (https://...)"
                value={newLogoSrc}
                onChange={(e) => setNewLogoSrc(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() =>
                  onOpenMediaPicker((url) => {
                    setNewLogoSrc(url);
                    if (!newLogoName.trim()) {
                      setNewLogoName(inferBrandNameFromUrl(url));
                    }
                  })
                }
                className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1"
              >
                <TbPhoto className="w-3.5 h-3.5" />
                <span>Pick</span>
              </button>
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddCustomSubmit}
                disabled={!newLogoSrc.trim()}
                className="w-full h-full py-2 px-3 bg-persici-crimson hover:bg-red-600 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <TbCheck className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draggable Logos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
        {effectiveLogos.map((logo, idx) => {
          const isBeingDragged = draggedIdx === idx;
          const isDropTarget = dragOverIdx === idx && draggedIdx !== idx;

          return (
            <div
              key={logo.id || `${logo.name}-${idx}`}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={`relative group rounded-xl p-3 bg-white border transition-all flex flex-col justify-between select-none cursor-grab active:cursor-grabbing ${
                isBeingDragged
                  ? 'opacity-40 scale-95 border-slate-300'
                  : isDropTarget
                  ? 'border-persici-crimson ring-2 ring-persici-crimson/20 bg-persici-crimson/[0.03] scale-[1.02]'
                  : 'border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-sm'
              }`}
            >
              {/* Top Bar: Position Index + Drag Grip + Move Arrows + Delete */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1 text-slate-400">
                  <TbGripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono font-bold text-slate-600">
                    #{idx + 1}
                  </span>
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveStep(idx, -1)}
                    className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-25"
                    title="Move Earlier"
                  >
                    <TbArrowLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === effectiveLogos.length - 1}
                    onClick={() => handleMoveStep(idx, 1)}
                    className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-25"
                    title="Move Later"
                  >
                    <TbArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...effectiveLogos];
                      updated.splice(idx, 1);
                      commitLogos(updated);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove Logo"
                  >
                    <TbTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Logo Image Preview + Click to Change */}
              <div
                onClick={() =>
                  onOpenMediaPicker((url) => {
                    const updated = [...effectiveLogos];
                    updated[idx] = { ...logo, src: url };
                    commitLogos(updated);
                  })
                }
                title="Click to replace logo image"
                className="relative h-14 w-full rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-2 mb-2 cursor-pointer group/img overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-9 max-w-full object-contain transition-transform group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1 text-[10px] font-semibold text-white">
                  <TbPhoto className="w-3.5 h-3.5" />
                  <span>Change</span>
                </div>
              </div>

              {/* Editable Brand Name */}
              <input
                type="text"
                value={logo.name || ''}
                onChange={(e) => {
                  const updated = [...effectiveLogos];
                  updated[idx] = { ...logo, name: e.target.value };
                  commitLogos(updated);
                }}
                placeholder="Brand Name"
                className="w-full px-2 py-1 text-[11px] font-semibold text-center text-slate-700 bg-slate-50/80 border border-slate-200/80 rounded-md focus:bg-white focus:outline-none focus:border-persici-crimson"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
