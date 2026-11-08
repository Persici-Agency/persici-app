'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  TbTool,
  TbExternalLink,
  TbClock,
  TbCheck,
  TbAlertCircle,
  TbRefresh,
  TbArrowRight,
  TbGlobe,
  TbEye,
  TbPower,
  TbRoute,
  TbSparkles,
  TbMail,
} from 'react-icons/tb';
import {
  MaintenanceConfig,
  DEFAULT_MAINTENANCE_CONFIG,
  normalizeMaintenanceConfig,
} from '@/lib/maintenance-types';
import { MaintenanceTemplate } from '@/app/[lang]/_components/maintenance-template';

function toLocalDatetimeInputValue(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  } catch {
    return '';
  }
}

function getFutureIsoByHours(hoursToAdd: number): string {
  const d = new Date();
  d.setTime(d.getTime() + hoursToAdd * 60 * 60 * 1000);
  return d.toISOString();
}

export default function MaintenanceDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang === 'ar' ? 'ar' : 'en';
  const isRtl = lang === 'ar';

  const [config, setConfig] = useState<MaintenanceConfig>(() =>
    normalizeMaintenanceConfig(DEFAULT_MAINTENANCE_CONFIG)
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewLang, setPreviewLang] = useState<'en' | 'ar'>(lang);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'idle' | 'success' | 'error';
    text: string;
  }>({ type: 'idle', text: '' });

  const t = {
    badge: isRtl ? 'التحكم في حالة الموقع والتحويل' : 'Site Traffic & Availability Control',
    pageTitle: isRtl
      ? 'وضع الصيانة وإعادة التوجيه الشامل'
      : 'Maintenance Mode & Global Redirect',
    pageDesc: isRtl
      ? 'تحكم في إتاحة الموقع للزوار، أو تفعيل صفحة الصيانة الافتراضية مع عداد تنازلي اختياري، أو تحويل جميع زوار النطاق الحالي إلى رابط خارجي مباشر.'
      : 'Control public site availability, display the default Persici maintenance screen on all routes (with optional countdown timer), or redirect all domain traffic to an external link.',
    statusLiveTitle: isRtl ? 'الموقع مباشر ومتاح للجمهور' : 'Public Site is Live & Accessible',
    statusLiveDesc: isRtl
      ? 'جميع صفحات الموقع تعمل بشكل طبيعي للزوار حالياً. وضع الصيانة وإعادة التوجيه متوقف.'
      : 'All public pages are currently serving visitors normally. Maintenance & Redirect mode is OFF.',
    statusMaintTitle: isRtl
      ? 'وضع الصيانة مفعل حالياً على جميع الصفحات'
      : 'Maintenance Mode is Currently ACTIVE',
    statusMaintDesc: isRtl
      ? 'أي زائر يدخل إلى أي رابط أو صفحة في الموقع سيرى صفحة الصيانة الافتراضية فوراً (لوحة التحكم تبقى متاحة لك).'
      : 'Any visitor navigating to any page on the site is currently seeing the Default Maintenance Page (Dashboard remains accessible to operators).',
    statusRedirectTitle: isRtl
      ? 'إعادة التوجيه المباشر للموقع مفعلة حالياً'
      : 'Global Direct Redirect is Currently ACTIVE',
    statusRedirectDesc: isRtl
      ? 'أي زائر يدخل إلى أي صفحة على هذا النطاق يتم تحويله تلقائياً إلى الرابط المحدد أدناه.'
      : 'Any visitor arriving at any URL on this domain is being automatically redirected to your configured destination URL.',
    enableBtn: isRtl ? 'تفعيل وضع الصيانة / التوجيه الآن' : 'Turn Maintenance Mode ON',
    disableBtn: isRtl ? 'إيقاف وضع الصيانة (إعادة الموقع للعمل)' : 'Turn Maintenance Mode OFF',
    saveBtn: isRtl ? 'حفظ وتطبيق الإعدادات' : 'Save & Apply Settings',
    savingBtn: isRtl ? 'جاري الحفظ...' : 'Saving...',
    previewPageBtn: isRtl ? 'معاينة صفحة الصيانة' : 'Open Maintenance Page',
    modeSectionTitle: isRtl
      ? '1. اختر سلوك الموقع عند تفعيل النظام'
      : '1. Select Behavior When Active',
    modeMaintTitle: isRtl
      ? 'صفحة الصيانة الافتراضية (Default Maintenance Page)'
      : 'Default Maintenance Mode Page',
    modeMaintDesc: isRtl
      ? 'إظهار صفحة صيانة احترافية بهوية Persici لأي شخص يزور أي صفحة في الموقع، مع إمكانية تفعيل أو إخفاء العداد التنازلي.'
      : 'Display the luxury bilingual Persici maintenance screen across every page on the site, with an optional live countdown timer.',
    modeRedirectTitle: isRtl
      ? 'تحويل مباشر إلى رابط آخر (Direct Link Redirect)'
      : 'Direct URL / Domain Redirect',
    modeRedirectDesc: isRtl
      ? 'عدم إظهار صفحة الصيانة، وبدلاً من ذلك تحويل أي شخص يدخل إلى أي صفحة أو رابط في هذا النطاق مباشرة إلى الرابط الذي تحدده.'
      : 'Bypass the maintenance page and immediately redirect anyone visiting any page on this domain to your specified destination link.',
    countdownCardTitle: isRtl
      ? '2. إعدادات العداد التنازلي (Countdown Timer)'
      : '2. Countdown Timer Settings',
    countdownToggleLabel: isRtl
      ? 'إظهار العداد التنازلي في صفحة الصيانة'
      : 'Display Countdown Timer on Maintenance Page',
    countdownToggleDesc: isRtl
      ? 'يمكنك تفعيل العداد التنازلي لتوضيح موعد عودة الموقع أو إيقافه ليظهر نص الصيانة فقط بدون عداد.'
      : 'Enable to show a live ticking Days / Hours / Minutes / Seconds countdown, or disable to show the maintenance page without a countdown.',
    targetDateLabel: isRtl
      ? 'تاريخ ووقت انتهاء الصيانة'
      : 'Target Completion Date & Time',
    quickPresetsLabel: isRtl ? 'مدد سريعة بنقرة واحدة:' : 'Quick Duration Presets:',
    contentCardTitle: isRtl
      ? '3. محتوى ونصوص صفحة الصيانة (عربي / إنجليزي)'
      : '3. Maintenance Page Copy & Support Action (EN / AR)',
    resetDefaultsBtn: isRtl ? 'استعادة النصوص الافتراضية' : 'Reset to Default Copy',
    redirectCardTitle: isRtl
      ? '2. إعدادات رابط التحويل المباشر (Direct Redirect Link)'
      : '2. Direct URL Redirect Configuration',
    redirectUrlLabel: isRtl
      ? 'الرابط المباشر للتحويل (Target Redirect URL)'
      : 'Destination Redirect URL',
    redirectUrlPlaceholder: 'https://new-domain.com',
    redirectUrlHelper: isRtl
      ? 'عند تفعيل هذا الوضع، أي زائر يدخل إلى أي رابط على هذا النطاق القديم سيتم تحويله فوراً إلى هذا الرابط.'
      : 'When active in Redirect Mode, anyone visiting any page or link on this domain will be redirected immediately to this URL.',
    redirectCodeLabel: isRtl ? 'نوع التحويل (HTTP Status Code)' : 'Redirect HTTP Status Code',
    redirect307: isRtl
      ? '307 تحويل مؤقت (موصى به — لا يتم تخزينه بشكل دائم في متصفح الزائر)'
      : '307 Temporary Redirect (Recommended — Safe & easily reversible)',
    redirect308: isRtl
      ? '308 تحويل دائم (لنقل النطاق نهائياً وأرشفة محركات البحث)'
      : '308 Permanent Redirect (For permanent domain migration & SEO)',
    pathHandlingLabel: isRtl
      ? 'طريقة التعامل مع المسارات الفرعية (Subpaths)'
      : 'Subpath & URL Forwarding Behavior',
    pathExact: isRtl
      ? 'تحويل جميع الصفحات إلى الرابط المحدد بالضبط (الافتراضي)'
      : 'Redirect all pages to the exact URL entered above (Default)',
    pathPreserve: isRtl
      ? 'الاحتفاظ بمسار الصفحة وإضافته للنطاق الجديد (مثال: /en/about)'
      : 'Preserve page path & query string on destination domain (e.g. /en/about)',
    livePreviewTitle: isRtl
      ? 'معاينة حية لصفحة الصيانة الافتراضية'
      : 'Live Interactive Maintenance Page Preview',
  };

  useEffect(() => {
    let active = true;
    async function loadConfig() {
      try {
        const res = await fetch('/api/maintenance?refresh=1', {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (active && data?.config) {
            setConfig(normalizeMaintenanceConfig(data.config));
          }
        }
      } catch (err) {
        console.error('Failed to load maintenance config:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadConfig();
    return () => {
      active = false;
    };
  }, []);

  const persistConfig = async (nextConfig: MaintenanceConfig) => {
    setSaving(true);
    setStatusMessage({ type: 'idle', text: '' });

    try {
      const res = await fetch('/api/maintenance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextConfig),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatusMessage({
          type: 'error',
          text:
            data?.error ||
            (isRtl
              ? 'تعذر حفظ الإعدادات. يرجى التحقق من البيانات المدخلة.'
              : 'Failed to save settings. Please verify your inputs.'),
        });
        return false;
      }

      const updated = normalizeMaintenanceConfig(data.config || nextConfig);
      setConfig(updated);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('persici:maintenance-updated', { detail: updated })
        );
      }

      setStatusMessage({
        type: 'success',
        text: isRtl
          ? 'تم حفظ وتطبيق إعدادات وضع الصيانة والتوجيه بنجاح!'
          : 'Maintenance & Redirect configuration saved and applied immediately!',
      });
      return true;
    } catch {
      setStatusMessage({
        type: 'error',
        text: isRtl
          ? 'حدث خطأ في الاتصال بالخادم.'
          : 'Network error while saving configuration.',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleToggleMasterEnabled = async () => {
    const nextEnabled = !config.enabled;

    // If enabling Redirect Mode without a URL, prompt validation message
    if (nextEnabled && config.mode === 'redirect' && !config.redirectUrl.trim()) {
      setStatusMessage({
        type: 'error',
        text: isRtl
          ? 'يرجى إدخال رابط التحويل المباشر أولاً قبل تفعيل وضع التحويل.'
          : 'Please enter a valid Destination Redirect URL below before turning on Direct Redirect Mode.',
      });
      return;
    }

    const updated = { ...config, enabled: nextEnabled };
    setConfig(updated);
    await persistConfig(updated);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistConfig(config);
  };

  const applyDurationPreset = (hoursToAdd: number) => {
    const target = getFutureIsoByHours(hoursToAdd);
    setConfig((prev) => ({
      ...prev,
      countdownEnabled: true,
      countdownTargetDate: target,
    }));
  };

  const handleResetDefaultCopy = () => {
    setConfig((prev) => ({
      ...prev,
      badge: { ...DEFAULT_MAINTENANCE_CONFIG.badge },
      title: { ...DEFAULT_MAINTENANCE_CONFIG.title },
      description: { ...DEFAULT_MAINTENANCE_CONFIG.description },
      countdownLabel: { ...DEFAULT_MAINTENANCE_CONFIG.countdownLabel },
      showContactButton: DEFAULT_MAINTENANCE_CONFIG.showContactButton,
      contactButtonLabel: { ...DEFAULT_MAINTENANCE_CONFIG.contactButtonLabel },
      contactButtonHref: DEFAULT_MAINTENANCE_CONFIG.contactButtonHref,
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl animate-pulse">
        <div className="h-32 bg-white rounded-2xl border border-slate-200" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Page Title & Quick Actions Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-1">
            <TbTool className="w-4 h-4" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{t.pageTitle}</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">{t.pageDesc}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href={`/${lang}/maintenance`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
          >
            <span>{t.previewPageBtn}</span>
            <TbExternalLink className="w-4 h-4" />
          </Link>

          <button
            type="button"
            disabled={saving}
            onClick={() => persistConfig(config)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors disabled:opacity-50"
          >
            <TbCheck className="w-4 h-4" />
            <span>{saving ? t.savingBtn : t.saveBtn}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {statusMessage.type !== 'idle' && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <TbCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <TbAlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage({ type: 'idle', text: '' })}
            className="text-[11px] underline opacity-75 hover:opacity-100"
          >
            {isRtl ? 'إغلاق' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Master Activation Status Hero Banner */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          !config.enabled
            ? 'bg-emerald-50/60 border-emerald-200/90'
            : config.mode === 'redirect'
              ? 'bg-amber-50/70 border-amber-300/90'
              : 'bg-[#FEF7F6] border-[#D83427]/30'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                !config.enabled
                  ? 'bg-emerald-500 text-white'
                  : config.mode === 'redirect'
                    ? 'bg-amber-500 text-white'
                    : 'bg-[#D83427] text-white'
              }`}
            >
              {!config.enabled ? (
                <TbGlobe className="w-6 h-6" />
              ) : config.mode === 'redirect' ? (
                <TbRoute className="w-6 h-6" />
              ) : (
                <TbTool className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                    !config.enabled
                      ? 'bg-emerald-500'
                      : config.mode === 'redirect'
                        ? 'bg-amber-500'
                        : 'bg-[#D83427]'
                  }`}
                />
                <span className="text-[11px] font-mono uppercase font-semibold tracking-wider text-slate-600">
                  {!config.enabled
                    ? 'STATUS: ONLINE'
                    : config.mode === 'redirect'
                      ? `STATUS: REDIRECT (${config.redirectStatusCode})`
                      : 'STATUS: MAINTENANCE MODE'}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                {!config.enabled
                  ? t.statusLiveTitle
                  : config.mode === 'redirect'
                    ? t.statusRedirectTitle
                    : t.statusMaintTitle}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {!config.enabled
                  ? t.statusLiveDesc
                  : config.mode === 'redirect'
                    ? t.statusRedirectDesc
                    : t.statusMaintDesc}
              </p>

              {config.enabled &&
                config.mode === 'redirect' &&
                config.redirectUrl && (
                  <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-amber-200 text-xs font-mono text-slate-800">
                    <span className="text-amber-600 font-semibold">Target:</span>
                    <span className="truncate max-w-md">{config.redirectUrl}</span>
                  </div>
                )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              disabled={saving}
              onClick={handleToggleMasterEnabled}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold shadow-md transition-all disabled:opacity-50 ${
                config.enabled
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  : 'bg-[#D83427] hover:bg-[#B42419] text-white shadow-[#D83427]/25'
              }`}
            >
              <TbPower className="w-4 h-4" />
              <span>{config.enabled ? t.disableBtn : t.enableBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSaveForm} className="space-y-6">
        {/* Section 1: Mode Selector Cards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            {t.modeSectionTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option A: Default Maintenance Page */}
            <button
              type="button"
              onClick={() =>
                setConfig((prev) => ({ ...prev, mode: 'maintenance_page' }))
              }
              className={`text-start p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                config.mode === 'maintenance_page'
                  ? 'border-[#D83427] bg-[#FEF7F6]/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 w-full">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      config.mode === 'maintenance_page'
                        ? 'bg-[#D83427] text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <TbSparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {t.modeMaintTitle}
                    </h3>
                    <span className="inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 mt-0.5">
                      {isRtl ? 'الوضع الافتراضي' : 'Default Mode'}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                    config.mode === 'maintenance_page'
                      ? 'border-[#D83427] bg-[#D83427] text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {config.mode === 'maintenance_page' && (
                    <TbCheck className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {t.modeMaintDesc}
              </p>
            </button>

            {/* Option B: Direct Redirect Link */}
            <button
              type="button"
              onClick={() =>
                setConfig((prev) => ({ ...prev, mode: 'redirect' }))
              }
              className={`text-start p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                config.mode === 'redirect'
                  ? 'border-[#D83427] bg-[#FEF7F6]/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 w-full">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      config.mode === 'redirect'
                        ? 'bg-[#D83427] text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <TbRoute className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {t.modeRedirectTitle}
                    </h3>
                    <span className="inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 mt-0.5">
                      {isRtl ? 'تحويل النطاق بالكامل' : 'Domain / Link Redirect'}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                    config.mode === 'redirect'
                      ? 'border-[#D83427] bg-[#D83427] text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {config.mode === 'redirect' && (
                    <TbCheck className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {t.modeRedirectDesc}
              </p>
            </button>
          </div>
        </div>

        {/* ===================================================================
            MODE A CONTROLS: DEFAULT MAINTENANCE PAGE & COUNTDOWN TIMER
           =================================================================== */}
        {config.mode === 'maintenance_page' && (
          <>
            {/* Section 2: Countdown Timer Controls */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <TbClock className="w-5 h-5 text-persici-crimson" />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {t.countdownCardTitle}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t.countdownToggleDesc}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <label className="inline-flex items-center gap-3 cursor-pointer shrink-0">
                  <span className="text-xs font-semibold text-slate-700">
                    {config.countdownEnabled
                      ? isRtl
                        ? 'العداد التنازلي مفعل'
                        : 'Countdown Enabled'
                      : isRtl
                        ? 'العداد التنازلي مخفي'
                        : 'No Countdown'}
                  </span>
                  <input
                    type="checkbox"
                    checked={config.countdownEnabled}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        countdownEnabled: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all relative peer-checked:bg-[#D83427]" />
                </label>
              </div>

              {config.countdownEnabled && (
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                    <div className="lg:col-span-5">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.targetDateLabel}
                      </label>
                      <input
                        type="datetime-local"
                        value={toLocalDatetimeInputValue(
                          config.countdownTargetDate
                        )}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) return;
                          const iso = new Date(val).toISOString();
                          setConfig((prev) => ({
                            ...prev,
                            countdownTargetDate: iso,
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson"
                      />
                    </div>

                    <div className="lg:col-span-7">
                      <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.quickPresetsLabel}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { label: '+1h', hours: 1 },
                          { label: '+3h', hours: 3 },
                          { label: '+6h', hours: 6 },
                          { label: '+12h', hours: 12 },
                          { label: '+24h (1 Day)', hours: 24 },
                          { label: '+3 Days', hours: 72 },
                          { label: '+7 Days', hours: 168 },
                        ].map((preset) => (
                          <button
                            key={preset.hours}
                            type="button"
                            onClick={() => applyDurationPreset(preset.hours)}
                            className="px-3 py-2 rounded-xl text-xs font-mono font-medium bg-slate-100 hover:bg-[#D83427] hover:text-white text-slate-700 transition-colors"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bilingual Countdown Heading Label */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Countdown Header Label (English)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={config.countdownLabel.en}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            countdownLabel: {
                              ...prev.countdownLabel,
                              en: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        عنوان العداد التنازلي (العربية)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={config.countdownLabel.ar}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            countdownLabel: {
                              ...prev.countdownLabel,
                              ar: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Maintenance Page Bilingual Content */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <h2 className="text-sm font-bold text-slate-900">
                  {t.contentCardTitle}
                </h2>
                <button
                  type="button"
                  onClick={handleResetDefaultCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition-colors"
                >
                  <TbRefresh className="w-3.5 h-3.5" />
                  <span>{t.resetDefaultsBtn}</span>
                </button>
              </div>

              {/* Status Pill Badge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Badge (English)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={config.badge.en}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        badge: { ...prev.badge, en: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    شارة الحالة العلوية (العربية)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={config.badge.ar}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        badge: { ...prev.badge, ar: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Headline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Main Headline (English)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={config.title.en}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        title: { ...prev.title, en: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    العنوان الرئيسي (العربية)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={config.title.ar}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        title: { ...prev.title, ar: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description Message (English)
                  </label>
                  <textarea
                    rows={3}
                    dir="ltr"
                    value={config.description.en}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        description: {
                          ...prev.description,
                          en: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    رسالة التوضيح للزوار (العربية)
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={config.description.ar}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        description: {
                          ...prev.description,
                          ar: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Contact / Support CTA Button Controls */}
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TbMail className="w-4 h-4 text-persici-crimson" />
                    <span className="text-xs font-bold text-slate-900">
                      {isRtl
                        ? 'زر التواصل مع الدعم الفني في صفحة الصيانة'
                        : 'Support / Contact Action Button'}
                    </span>
                  </div>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showContactButton}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          showContactButton: e.target.checked,
                        }))
                      }
                      className="rounded border-slate-300 text-persici-crimson focus:ring-persici-crimson"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      {isRtl ? 'إظهار الزر' : 'Show Button'}
                    </span>
                  </label>
                </div>

                {config.showContactButton && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Button Label (English)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={config.contactButtonLabel.en}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            contactButtonLabel: {
                              ...prev.contactButtonLabel,
                              en: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        نص الزر (العربية)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={config.contactButtonLabel.ar}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            contactButtonLabel: {
                              ...prev.contactButtonLabel,
                              ar: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {isRtl
                          ? 'رابط الزر أو البريد (mailto: / https://)'
                          : 'Target Email or Link (mailto: / https://)'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={config.contactButtonHref}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            contactButtonHref: e.target.value,
                          }))
                        }
                        placeholder="mailto:info@persici.com"
                        className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ===================================================================
            MODE B CONTROLS: DIRECT DOMAIN / LINK REDIRECT
           =================================================================== */}
        {config.mode === 'redirect' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <TbRoute className="w-5 h-5 text-persici-crimson" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {t.redirectCardTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.redirectUrlHelper}
                </p>
              </div>
            </div>

            {/* Destination URL Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                {t.redirectUrlLabel}
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="url"
                  dir="ltr"
                  required={config.mode === 'redirect'}
                  value={config.redirectUrl}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      redirectUrl: e.target.value,
                    }))
                  }
                  placeholder={t.redirectUrlPlaceholder}
                  className="flex-1 px-4 py-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson"
                />

                {config.redirectUrl && (
                  <a
                    href={config.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
                  >
                    <span>{isRtl ? 'اختبار الرابط' : 'Test Target Link'}</span>
                    <TbExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Status Code & Path Forwarding Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.redirectCodeLabel}
                </label>
                <select
                  value={config.redirectStatusCode}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      redirectStatusCode:
                        Number(e.target.value) === 308 ? 308 : 307,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value={307}>{t.redirect307}</option>
                  <option value={308}>{t.redirect308}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.pathHandlingLabel}
                </label>
                <select
                  value={config.preservePath ? 'preserve' : 'exact'}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      preservePath: e.target.value === 'preserve',
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="exact">{t.pathExact}</option>
                  <option value="preserve">{t.pathPreserve}</option>
                </select>
              </div>
            </div>

            {/* Visual Flow Preview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <div className="text-slate-600">
                <span className="text-[10px] uppercase block text-slate-400">
                  {isRtl ? 'أي زائر يدخل إلى:' : 'Any visitor requesting:'}
                </span>
                <strong>
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/en/any-page`
                    : 'https://current-domain.com/*'}
                </strong>
              </div>

              <TbArrowRight className="w-5 h-5 text-persici-crimson shrink-0 rtl:rotate-180" />

              <div className="text-slate-900">
                <span className="text-[10px] uppercase block text-slate-400">
                  {isRtl
                    ? `يتم تحويله فوراً (${config.redirectStatusCode}) إلى:`
                    : `Immediately redirected (${config.redirectStatusCode}) to:`}
                </span>
                <strong className="text-persici-crimson break-all">
                  {config.redirectUrl
                    ? config.preservePath
                      ? `${config.redirectUrl.replace(/\/$/, '')}/en/any-page`
                      : config.redirectUrl
                    : 'https://...'}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-[#D83427] hover:bg-[#B42419] text-white shadow-lg shadow-[#D83427]/25 transition-all disabled:opacity-50"
          >
            <TbCheck className="w-4 h-4" />
            <span>{saving ? t.savingBtn : t.saveBtn}</span>
          </button>
        </div>
      </form>

      {/* Live Embedded Preview of the Maintenance Page */}
      {config.mode === 'maintenance_page' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TbEye className="w-5 h-5 text-persici-crimson" />
              <h2 className="text-sm font-bold text-slate-900">
                {t.livePreviewTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  previewLang === 'en'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                English (LTR)
              </button>
              <button
                type="button"
                onClick={() => setPreviewLang('ar')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  previewLang === 'ar'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                العربية (RTL)
              </button>
              <button
                type="button"
                onClick={() => setShowLivePreview((prev) => !prev)}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                {showLivePreview
                  ? isRtl
                    ? 'إخفاء المعاينة'
                    : 'Hide Preview'
                  : isRtl
                    ? 'إظهار المعاينة'
                    : 'Show Preview'}
              </button>
            </div>
          </div>

          {showLivePreview && (
            <div className="w-full overflow-hidden rounded-2xl">
              <MaintenanceTemplate
                forcedLang={previewLang}
                initialConfig={config}
                embeddedPreview={true}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
