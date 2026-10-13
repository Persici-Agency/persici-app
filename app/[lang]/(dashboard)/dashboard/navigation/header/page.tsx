'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  TbRoute,
  TbPlus,
  TbTrash,
  TbDeviceFloppy,
  TbCheck,
  TbAlertCircle,
  TbChevronDown,
  TbChevronRight,
  TbExternalLink,
} from 'react-icons/tb';

interface NavChild {
  label: { en: string; ar: string };
  href: string;
}

interface NavItem {
  id?: string;
  label: { en: string; ar: string };
  href: string;
  children?: NavChild[];
}

interface HeaderNavConfig {
  links: NavItem[];
  ctaButton: {
    text: { en: string; ar: string };
    href: string;
    enabled: boolean;
  };
}

export default function HeaderNavBuilderPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';

  const [config, setConfig] = useState<HeaderNavConfig>({
    links: [],
    ctaButton: {
      text: { en: 'Book a Call', ar: 'احجز مكالمة' },
      href: '/contact',
      enabled: true,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function loadNav() {
      try {
        const res = await fetch('/api/navigation');
        const data = await res.json();
        if (data.success && data.header) {
          setConfig({
            links: data.header.links || [],
            ctaButton: data.header.ctaButton || {
              text: { en: 'Book a Call', ar: 'احجز مكالمة' },
              href: '/contact',
              enabled: true,
            },
          });
        }
      } catch (err) {
        console.error('Failed to load header nav:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNav();
  }, []);

  const handleAddTopLink = () => {
    setConfig((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        {
          label: { en: 'New Link', ar: 'رابط جديد' },
          href: '/',
          children: [],
        },
      ],
    }));
  };

  const handleRemoveTopLink = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateTopLink = (index: number, field: string, value: unknown) => {
    setConfig((prev) => {
      const updated = [...prev.links];
      const item = { ...updated[index] };
      if (field === 'en') item.label = { ...item.label, en: value as string };
      else if (field === 'ar') item.label = { ...item.label, ar: value as string };
      else if (field === 'href') item.href = value as string;
      updated[index] = item;
      return { ...prev, links: updated };
    });
  };

  const handleAddChildLink = (parentIndex: number) => {
    setConfig((prev) => {
      const updated = [...prev.links];
      const parent = { ...updated[parentIndex] };
      parent.children = [
        ...(parent.children || []),
        { label: { en: 'Sub Link', ar: 'رابط فرعي' }, href: '/' },
      ];
      updated[parentIndex] = parent;
      return { ...prev, links: updated };
    });
  };

  const handleRemoveChildLink = (parentIndex: number, childIndex: number) => {
    setConfig((prev) => {
      const updated = [...prev.links];
      const parent = { ...updated[parentIndex] };
      parent.children = (parent.children || []).filter((_, ci) => ci !== childIndex);
      updated[parentIndex] = parent;
      return { ...prev, links: updated };
    });
  };

  const handleUpdateChildLink = (
    parentIndex: number,
    childIndex: number,
    field: string,
    value: string
  ) => {
    setConfig((prev) => {
      const updated = [...prev.links];
      const parent = { ...updated[parentIndex] };
      const children = [...(parent.children || [])];
      const child = { ...children[childIndex] };
      if (field === 'en') child.label = { ...child.label, en: value };
      else if (field === 'ar') child.label = { ...child.label, ar: value };
      else if (field === 'href') child.href = value;
      children[childIndex] = child;
      parent.children = children;
      updated[parentIndex] = parent;
      return { ...prev, links: updated };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'header',
          links: config.links,
          ctaButton: config.ctaButton,
        }),
      });
      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-1">
            <span>Global Navigation</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Header Menu Builder</h1>
          <p className="text-sm text-slate-500 mt-1">
            Build the primary navigation bar with English and Arabic labels, target URLs, and nested dropdowns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus === 'success' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold">
              <TbCheck className="w-4 h-4" />
              <span>Published & Revalidated!</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 font-semibold">
              <TbAlertCircle className="w-4 h-4" />
              <span>Save Failed</span>
            </div>
          )}

          <button
            type="button"
            disabled={saving || loading}
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <TbDeviceFloppy className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish Menu'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-persici-crimson border-t-transparent mb-3" />
          <p className="text-sm">Loading navigation settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Action Button Settings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Header CTA Button</h2>
                <p className="text-xs text-slate-500">The high-conversion action button in the top right</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.ctaButton.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      ctaButton: { ...prev.ctaButton, enabled: e.target.checked },
                    }))
                  }
                  className="rounded text-persici-crimson focus:ring-persici-crimson h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-700">Display CTA Button</span>
              </label>
            </div>

            {config.ctaButton.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Label (English)</label>
                  <input
                    type="text"
                    value={config.ctaButton.text.en}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        ctaButton: {
                          ...prev.ctaButton,
                          text: { ...prev.ctaButton.text, en: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Label (Arabic)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={config.ctaButton.text.ar}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        ctaButton: {
                          ...prev.ctaButton,
                          text: { ...prev.ctaButton.text, ar: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Path / URL</label>
                  <input
                    type="text"
                    value={config.ctaButton.href}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        ctaButton: { ...prev.ctaButton, href: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Navigation Items Tree</h2>
                <p className="text-xs text-slate-500">Configure top-level items and dropdown children</p>
              </div>
              <button
                type="button"
                onClick={handleAddTopLink}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-persici-crimson bg-persici-crimson/10 hover:bg-persici-crimson/20 rounded-xl transition-colors"
              >
                <TbPlus className="w-4 h-4" />
                <span>Add Main Link</span>
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {config.links.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                >
                  {/* Top Level Item Form */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                        Title (English)
                      </label>
                      <input
                        type="text"
                        value={item.label.en}
                        onChange={(e) => handleUpdateTopLink(idx, 'en', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson font-medium"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                        Title (Arabic)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={item.label.ar}
                        onChange={(e) => handleUpdateTopLink(idx, 'ar', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson font-arabic font-medium"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                        URL Path
                      </label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => handleUpdateTopLink(idx, 'href', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson font-mono"
                      />
                    </div>

                    <div className="md:col-span-1 flex justify-end pt-4 md:pt-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveTopLink(idx)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                        title="Delete Link"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown Children */}
                  <div className="pl-6 border-l-2 border-persici-crimson/30 space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Nested Dropdown Links ({item.children?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddChildLink(idx)}
                        className="text-[11px] font-semibold text-persici-crimson hover:underline flex items-center gap-1"
                      >
                        <TbPlus className="w-3 h-3" />
                        <span>Add Sub Link</span>
                      </button>
                    </div>

                    {item.children?.map((child, cIdx) => (
                      <div
                        key={cIdx}
                        className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-slate-200"
                      >
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            placeholder="Sub-item EN"
                            value={child.label.en}
                            onChange={(e) => handleUpdateChildLink(idx, cIdx, 'en', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-persici-crimson"
                          />
                        </div>
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            dir="rtl"
                            placeholder="Sub-item AR"
                            value={child.label.ar}
                            onChange={(e) => handleUpdateChildLink(idx, cIdx, 'ar', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-persici-crimson font-arabic"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <input
                            type="text"
                            placeholder="/path"
                            value={child.href}
                            onChange={(e) => handleUpdateChildLink(idx, cIdx, 'href', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded font-mono text-[11px] focus:ring-1 focus:ring-persici-crimson"
                          />
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveChildLink(idx, cIdx)}
                            className="p-1 text-slate-300 hover:text-red-600 rounded"
                          >
                            <TbTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
