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
  TbBrandLinkedin,
  TbBrandX,
  TbBrandInstagram,
  TbBrandGithub,
  TbMapPin,
  TbBuildingSkyscraper,
} from 'react-icons/tb';

interface OfficeHub {
  city: { en: string; ar: string };
  address: { en: string; ar: string };
  phone?: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterConfig {
  tagline: { en: string; ar: string };
  copyrightText: { en: string; ar: string };
  hubs: OfficeHub[];
  socialLinks: SocialLink[];
}

export default function FooterBuilderPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';

  const [config, setConfig] = useState<FooterConfig>({
    tagline: {
      en: 'Architecting Intelligent Systems & Growth Engines for Global Enterprise',
      ar: 'هندسة الأنظمة الذكية ومحركات النمو للمؤسسات العالمية',
    },
    copyrightText: {
      en: '© 2026 Persici Agency. All rights reserved.',
      ar: '© 2026 وكالة بيرسيتشي. جميع الحقوق محفوظة.',
    },
    hubs: [
      {
        city: { en: 'Dubai HQ', ar: 'المقر الرئيسي — دبي' },
        address: { en: 'DIFC Innovation One, Level 14', ar: 'مركز دبي المالي العالمي، إنوفيشن ون، الطابق 14' },
        phone: '+971 4 123 4567',
      },
      {
        city: { en: 'Riyadh Hub', ar: 'مركز الرياض' },
        address: { en: 'KAFD Tower 4, Al Aqeeq', ar: 'مركز الملك عبد الله المالي، برج 4، العقيق' },
        phone: '+966 11 123 4567',
      },
    ],
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/persici' },
      { platform: 'Twitter / X', url: 'https://x.com/persiciagency' },
      { platform: 'Instagram', url: 'https://instagram.com/persiciagency' },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function loadFooter() {
      try {
        const res = await fetch('/api/navigation');
        const data = await res.json();
        if (data.success && data.footer) {
          if (data.footer.hubs && data.footer.hubs.length > 0) {
            setConfig((prev) => ({ ...prev, ...data.footer }));
          }
        }
      } catch (err) {
        console.error('Failed to load footer config:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFooter();
  }, []);

  const handleAddHub = () => {
    setConfig((prev) => ({
      ...prev,
      hubs: [
        ...prev.hubs,
        {
          city: { en: 'New Hub', ar: 'مركز جديد' },
          address: { en: 'City, Country', ar: 'المدينة، الدولة' },
          phone: '',
        },
      ],
    }));
  };

  const handleRemoveHub = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      hubs: prev.hubs.filter((_, i) => i !== idx),
    }));
  };

  const handleUpdateHub = (idx: number, field: string, value: string) => {
    setConfig((prev) => {
      const hubs = [...prev.hubs];
      const hub = { ...hubs[idx] };
      if (field === 'cityEn') hub.city = { ...hub.city, en: value };
      else if (field === 'cityAr') hub.city = { ...hub.city, ar: value };
      else if (field === 'addressEn') hub.address = { ...hub.address, en: value };
      else if (field === 'addressAr') hub.address = { ...hub.address, ar: value };
      else if (field === 'phone') hub.phone = value;
      hubs[idx] = hub;
      return { ...prev, hubs };
    });
  };

  const handleAddSocial = () => {
    setConfig((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'Platform', url: 'https://' }],
    }));
  };

  const handleRemoveSocial = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== idx),
    }));
  };

  const handleUpdateSocial = (idx: number, field: 'platform' | 'url', value: string) => {
    setConfig((prev) => {
      const list = [...prev.socialLinks];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, socialLinks: list };
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
          type: 'footer',
          ...config,
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
          <h1 className="text-2xl font-bold text-slate-900">Footer Columns Builder</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure global regional office hubs, corporate social links, brand manifesto, and copyright statements.
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
            <span>{saving ? 'Saving...' : 'Save & Publish Footer'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-persici-crimson border-t-transparent mb-3" />
          <p className="text-sm">Loading footer settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Brand Manifesto & Copyright */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Brand Manifesto & Copyright Statements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline (English)</label>
                <textarea
                  rows={2}
                  value={config.tagline.en}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      tagline: { ...prev.tagline, en: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline (Arabic)</label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={config.tagline.ar}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      tagline: { ...prev.tagline, ar: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson font-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Copyright Statement (EN)</label>
                <input
                  type="text"
                  value={config.copyrightText.en}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      copyrightText: { ...prev.copyrightText, en: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Copyright Statement (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={config.copyrightText.ar}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      copyrightText: { ...prev.copyrightText, ar: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson font-arabic"
                />
              </div>
            </div>
          </div>

          {/* Regional Hubs Manager */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Regional Office Hubs</h2>
                <p className="text-xs text-slate-500">Corporate offices displayed in the footer address grid</p>
              </div>
              <button
                type="button"
                onClick={handleAddHub}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-persici-crimson bg-persici-crimson/10 hover:bg-persici-crimson/20 rounded-xl transition-colors"
              >
                <TbPlus className="w-4 h-4" />
                <span>Add Office Hub</span>
              </button>
            </div>

            <div className="space-y-4">
              {config.hubs.map((hub, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                        City Name (EN)
                      </label>
                      <input
                        type="text"
                        value={hub.city.en}
                        onChange={(e) => handleUpdateHub(idx, 'cityEn', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-persici-crimson font-medium"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                        City Name (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={hub.city.ar}
                        onChange={(e) => handleUpdateHub(idx, 'cityAr', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-persici-crimson font-arabic font-medium"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                        Phone / Contact
                      </label>
                      <input
                        type="text"
                        value={hub.phone || ''}
                        onChange={(e) => handleUpdateHub(idx, 'phone', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-persici-crimson"
                      />
                    </div>

                    <div className="md:col-span-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveHub(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="md:col-span-6">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                        Address (English)
                      </label>
                      <input
                        type="text"
                        value={hub.address.en}
                        onChange={(e) => handleUpdateHub(idx, 'addressEn', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-persici-crimson"
                      />
                    </div>

                    <div className="md:col-span-6">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                        Address (Arabic)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={hub.address.ar}
                        onChange={(e) => handleUpdateHub(idx, 'addressAr', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-persici-crimson font-arabic"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Corporate Social Links</h2>
                <p className="text-xs text-slate-500">Official agency channels displayed across footer badges</p>
              </div>
              <button
                type="button"
                onClick={handleAddSocial}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-persici-crimson bg-persici-crimson/10 hover:bg-persici-crimson/20 rounded-xl transition-colors"
              >
                <TbPlus className="w-4 h-4" />
                <span>Add Social Channel</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {config.socialLinks.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <input
                    type="text"
                    placeholder="Platform (e.g. LinkedIn)"
                    value={s.platform}
                    onChange={(e) => handleUpdateSocial(idx, 'platform', e.target.value)}
                    className="w-32 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-medium"
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={s.url}
                    onChange={(e) => handleUpdateSocial(idx, 'url', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(idx)}
                    className="p-1.5 text-slate-300 hover:text-red-600 rounded"
                  >
                    <TbTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
