'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  TbDeviceFloppy,
  TbCheck,
  TbAlertCircle,
  TbBuildingSkyscraper,
  TbAddressBook,
  TbExternalLink,
  TbShare,
  TbMail,
} from 'react-icons/tb';
import {
  DEFAULT_COMMUNICATION_CONFIG,
  type CommunicationSocialConfig,
} from '@/lib/communication-types';

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

  const [commConfig, setCommConfig] = useState<CommunicationSocialConfig>(DEFAULT_COMMUNICATION_CONFIG);
  const [passkeySuffix, setPasskeySuffix] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function loadFooter() {
      const pk =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('passkey')
          : null;
      try {
        const [navRes, commRes] = await Promise.all([
          fetch('/api/navigation'),
          fetch('/api/communication', { cache: 'no-store' }),
        ]);
        if (pk) setPasskeySuffix(`?passkey=${encodeURIComponent(pk)}`);
        const data = await navRes.json();
        if (data.success && data.footer) {
          setConfig((prev) => ({ ...prev, ...data.footer }));
        }
        if (commRes.ok) {
          const commData = await commRes.json();
          if (commData?.success && commData.config) {
            setCommConfig(commData.config);
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

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    try {
      const syncedHubs: OfficeHub[] = commConfig.offices.map((o) => ({
        city: o.city,
        address: o.address,
        phone: o.phone,
      }));
      const syncedSocials: SocialLink[] = commConfig.socialLinks
        .filter((s) => s.enabled && s.url)
        .map((s) => ({ platform: s.platform, url: s.url }));

      const res = await fetch('/api/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'footer',
          tagline: config.tagline,
          copyrightText: config.copyrightText,
          hubs: syncedHubs.length > 0 ? syncedHubs : config.hubs,
          socialLinks: syncedSocials.length > 0 ? syncedSocials : config.socialLinks,
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
    <div className="w-full max-w-[1440px] mx-auto space-y-6 pb-16">
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

          {/* Regional Hubs Manager — Synced from Communication & Social Media */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-persici-crimson/10 text-persici-crimson flex items-center justify-center shrink-0">
                  <TbBuildingSkyscraper className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Regional Office Hubs & Footer Contact Info (Synced)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    To edit office cities, addresses, corporate emails, or phones, go to{' '}
                    <span className="font-semibold text-slate-700">Communication & Social Media</span>{' '}
                    so Footer, Contact, and Careers stay unified.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Link
                  href={`/${lang}/dashboard/communication${passkeySuffix}#emails`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <TbMail className="w-4 h-4 text-persici-crimson" />
                  <span>Edit Emails & Phone</span>
                </Link>
                <Link
                  href={`/${lang}/dashboard/communication${passkeySuffix}#offices`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-persici-crimson hover:bg-red-700 rounded-xl transition-colors shadow-sm"
                >
                  <TbAddressBook className="w-4 h-4" />
                  <span>Manage in Communication & Social</span>
                  <TbExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {commConfig.offices.map((office) => (
                <div
                  key={office.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                >
                  <div className="font-bold text-slate-900 flex items-center justify-between gap-2">
                    <span>{lang === 'ar' ? office.city.ar || office.city.en : office.city.en}</span>
                    {office.isHQ && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        HQ
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 line-clamp-1">
                    {lang === 'ar' ? office.address.ar || office.address.en : office.address.en}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">
                    {office.phone} · {office.email}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Links — Synced from Communication & Social Media */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-persici-crimson/10 text-persici-crimson flex items-center justify-center shrink-0">
                  <TbShare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Corporate Social Links (Synced)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Managed centrally in <span className="font-semibold text-slate-700">Communication & Social Media</span>. Enabled links render in the live footer bar.
                  </p>
                </div>
              </div>

              <Link
                href={`/${lang}/dashboard/communication${passkeySuffix}#social`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-persici-crimson hover:bg-red-700 rounded-xl transition-colors shadow-sm shrink-0"
              >
                <TbAddressBook className="w-4 h-4" />
                <span>Edit Social Links in Communication & Social</span>
                <TbExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {commConfig.socialLinks.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-xs ${
                    s.enabled
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-slate-100/70 border-slate-200/70 text-slate-400 opacity-75'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-bold">{s.platform}</div>
                    <div className="font-mono text-[11px] truncate">{s.url}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      s.enabled
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {s.enabled ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
