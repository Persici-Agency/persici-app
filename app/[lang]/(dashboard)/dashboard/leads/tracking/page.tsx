'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import {
  TbCode,
  TbBrandGoogle,
  TbBrandMeta,
  TbBrandTiktok,
  TbBrandSnapchat,
  TbBrandLinkedin,
  TbBrandX,
  TbChartHistogram,
  TbPlus,
  TbTrash,
  TbEdit,
  TbCheck,
  TbRefresh,
  TbDeviceFloppy,
  TbSparkles,
  TbEye,
  TbAlertTriangle,
  TbWorld,
  TbHome,
  TbRoute,
  TbTerminal2,
  TbLock,
  TbPlayerPlay,
} from 'react-icons/tb';
import {
  DEFAULT_TRACKING_CONFIG,
  type TrackingConfig,
  type CustomCodeSnippet,
  type SnippetPlacement,
  type SnippetCodeType,
  type SnippetPlatform,
  type SnippetPageScope,
  type TrackingStatusSummary,
} from '@/lib/tracking-types';

type ActiveTab = 'gtm' | 'ga4' | 'pixels' | 'snippets';

const PLACEMENT_OPTIONS: Array<{
  id: SnippetPlacement;
  en: string;
  ar: string;
  descEn: string;
  descAr: string;
  badge: string;
}> = [
  {
    id: 'head_top',
    en: 'Top of <head>',
    ar: 'أعلى وسم <head>',
    descEn: 'Injected at the very top of <head> for highest priority tags',
    descAr: 'يتم إضافته في بداية وسم <head> للأكواد ذات الأولوية القصوى',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'head_bottom',
    en: 'Bottom of <head> (Before </head>)',
    ar: 'أسفل وسم <head> (قبل إغلاق </head>)',
    descEn: 'Best practice for pixels, meta verification, and head scripts',
    descAr: 'المكان الموصى به لأكواد البيكسل وإثبات الملكية وأكواد الهيدر',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'body_top',
    en: 'After <body> Tag',
    ar: 'مباشرة بعد فتح وسم <body>',
    descEn: 'Ideal for GTM <noscript> iframes and top-of-body trackers',
    descAr: 'مثالي لأكواد GTM noscript والأكواد التي تتطلب العمل فور بداية الصفحة',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'body_bottom',
    en: 'Footer (Before </body>)',
    ar: 'في الفوتر (قبل إغلاق </body>)',
    descEn: 'Best for chat widgets, deferred scripts, and footer pixels',
    descAr: 'الأفضل لأدوات المحادثة والأكواد المؤجلة في نهاية الصفحة',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
];

const PLATFORM_OPTIONS: Array<{
  id: SnippetPlatform;
  en: string;
  ar: string;
}> = [
  { id: 'custom', en: 'Custom Code / General', ar: 'كود مخصص / عام' },
  { id: 'google_tag', en: 'Google Tag Manager / gtag', ar: 'Google Tag Manager / gtag' },
  { id: 'google_analytics', en: 'Google Analytics (GA4)', ar: 'Google Analytics (GA4)' },
  { id: 'meta_pixel', en: 'Meta (Facebook) Pixel', ar: 'بيكسل ميتا (فيسبوك / إنستغرام)' },
  { id: 'tiktok_pixel', en: 'TikTok Pixel', ar: 'بيكسل تيك توك (TikTok)' },
  { id: 'snap_pixel', en: 'Snapchat Pixel', ar: 'بيكسل سناب شات (Snapchat)' },
  { id: 'linkedin_insight', en: 'LinkedIn Insight Tag', ar: 'بيكسل لينكدإن (LinkedIn)' },
  { id: 'x_pixel', en: 'X (Twitter) Pixel', ar: 'بيكسل منصة X (تويتر)' },
  { id: 'clarity_hotjar', en: 'Clarity / Hotjar Heatmap', ar: 'خرائط التفاعل Clarity / Hotjar' },
];

const SCOPE_OPTIONS: Array<{
  id: SnippetPageScope;
  en: string;
  ar: string;
}> = [
  { id: 'all_public', en: 'Entire Public Website', ar: 'جميع صفحات الموقع العام' },
  { id: 'homepage_only', en: 'Homepage Only (/en & /ar)', ar: 'الصفحة الرئيسية فقط (/en و /ar)' },
  { id: 'custom_paths', en: 'Specific URL Paths', ar: 'مسارات صفحات محددة' },
];

const SNIPPET_TEMPLATES: Array<{
  labelEn: string;
  labelAr: string;
  name: string;
  platform: SnippetPlatform;
  codeType: SnippetCodeType;
  placement: SnippetPlacement;
  scope: SnippetPageScope;
  code: string;
}> = [
  {
    labelEn: 'Meta Pixel Custom Event',
    labelAr: 'حدث مخصص لبيكسل ميتا',
    name: 'Meta ViewContent Homepage Event',
    platform: 'meta_pixel',
    codeType: 'javascript',
    placement: 'body_bottom',
    scope: 'homepage_only',
    code: `if (typeof window.fbq === 'function') {\n  window.fbq('track', 'ViewContent', { content_name: 'Persici Homepage' });\n}`,
  },
  {
    labelEn: 'Google Search Console Meta Tag',
    labelAr: 'وسم توثيق Google Search Console',
    name: 'Google Site Verification Meta',
    platform: 'google_tag',
    codeType: 'html',
    placement: 'head_top',
    scope: 'homepage_only',
    code: `<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />`,
  },
  {
    labelEn: 'Custom HTML Script (Header)',
    labelAr: 'كود HTML مخصص في الهيدر',
    name: 'Custom Header Pixel / Script',
    platform: 'custom',
    codeType: 'html',
    placement: 'head_bottom',
    scope: 'all_public',
    code: `<!-- Custom Tracking Script -->\n<script>\n  console.log('Persici custom header snippet loaded');\n</script>`,
  },
  {
    labelEn: 'Custom Footer Widget (Before </body>)',
    labelAr: 'أداة أو كود في الفوتر قبل </body>',
    name: 'Footer Analytics / Chat Snippet',
    platform: 'custom',
    codeType: 'javascript',
    placement: 'body_bottom',
    scope: 'all_public',
    code: `// Runs at the bottom of <body>\nwindow.dataLayer = window.dataLayer || [];\nwindow.dataLayer.push({ event: 'persici_footer_ready' });`,
  },
];

export default function TrackingAndSnippetsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<ActiveTab>('gtm');
  const [config, setConfig] = useState<TrackingConfig>(DEFAULT_TRACKING_CONFIG);
  const [summary, setSummary] = useState<TrackingStatusSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [testPingSent, setTestPingSent] = useState(false);

  // Snippet Editor Modal / Drawer State
  const [editingSnippet, setEditingSnippet] = useState<CustomCodeSnippet | null>(null);
  const [snippetForm, setSnippetForm] = useState<{
    id?: string;
    name: string;
    description: string;
    platform: SnippetPlatform;
    codeType: SnippetCodeType;
    placement: SnippetPlacement;
    scope: SnippetPageScope;
    customPathsText: string;
    code: string;
    enabled: boolean;
    priority: number;
  }>({
    name: '',
    description: '',
    platform: 'custom',
    codeType: 'html',
    placement: 'head_bottom',
    scope: 'all_public',
    customPathsText: '',
    code: '',
    enabled: true,
    priority: 10,
  });
  const [showSnippetForm, setShowSnippetForm] = useState(false);

  const fetchTrackingConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tracking', { cache: 'no-store' });
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
      }
      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to load tracking configuration:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchTrackingConfig();
    });
  }, [fetchTrackingConfig]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handleSaveAllConfig = async (nextConfig?: TrackingConfig) => {
    const payload = nextConfig || config;
    setSaving(true);
    try {
      const res = await fetch('/api/tracking', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.config) {
        setConfig(data.config);
        if (data.summary) setSummary(data.summary);
        showToast(
          'success',
          isAr
            ? 'تم حفظ إعدادات التتبع والبيكسل وتحديث الموقع بنجاح!'
            : 'Tracking & pixel settings saved and published to storefront!'
        );
      } else {
        showToast(
          'error',
          data.error || (isAr ? 'تعذر حفظ الإعدادات' : 'Failed to save configuration')
        );
      }
    } catch (err) {
      console.error('Error saving tracking config:', err);
      showToast('error', isAr ? 'حدث خطأ في الاتصال بالخادم' : 'Network error while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenNewSnippet = () => {
    setEditingSnippet(null);
    setSnippetForm({
      name: '',
      description: '',
      platform: 'custom',
      codeType: 'html',
      placement: 'head_bottom',
      scope: 'all_public',
      customPathsText: '',
      code: '',
      enabled: true,
      priority: 10,
    });
    setShowSnippetForm(true);
  };

  const handleOpenEditSnippet = (snippet: CustomCodeSnippet) => {
    setEditingSnippet(snippet);
    setSnippetForm({
      id: snippet.id,
      name: snippet.name,
      description: snippet.description || '',
      platform: snippet.platform,
      codeType: snippet.codeType,
      placement: snippet.placement,
      scope: snippet.scope,
      customPathsText: (snippet.targetPaths || []).join(', '),
      code: snippet.code,
      enabled: snippet.enabled,
      priority: snippet.priority || 10,
    });
    setShowSnippetForm(true);
  };

  const handleApplyTemplate = (tpl: (typeof SNIPPET_TEMPLATES)[number]) => {
    setSnippetForm((prev) => ({
      ...prev,
      name: tpl.name,
      platform: tpl.platform,
      codeType: tpl.codeType,
      placement: tpl.placement,
      scope: tpl.scope,
      code: tpl.code,
    }));
    setShowSnippetForm(true);
  };

  const handleSaveSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snippetForm.name.trim() || !snippetForm.code.trim()) {
      showToast(
        'error',
        isAr ? 'يرجى إدخال اسم الكود ومحتوى الكود البرمجي' : 'Snippet name and code are required'
      );
      return;
    }

    setSaving(true);
    try {
      const customPaths = snippetForm.customPathsText
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);

      const res = await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: snippetForm.id,
          name: snippetForm.name.trim(),
          description: snippetForm.description.trim(),
          platform: snippetForm.platform,
          codeType: snippetForm.codeType,
          placement: snippetForm.placement,
          scope: snippetForm.scope,
          targetPaths: customPaths,
          code: snippetForm.code,
          enabled: snippetForm.enabled,
          priority: Number(snippetForm.priority) || 10,
        }),
      });
      const data = await res.json();
      if (res.ok && data.config) {
        setConfig(data.config);
        if (data.summary) setSummary(data.summary);
        setShowSnippetForm(false);
        setEditingSnippet(null);
        showToast(
          'success',
          isAr ? 'تم حفظ الكود المخصص وتفعيله بنجاح!' : 'Custom code snippet saved!'
        );
      } else {
        showToast('error', data.error || 'Failed to save snippet');
      }
    } catch (err) {
      console.error('Failed to save snippet:', err);
      showToast('error', 'Network error while saving snippet');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSnippetEnabled = async (snippet: CustomCodeSnippet) => {
    const updatedSnippets = config.customSnippets.map((s) =>
      s.id === snippet.id ? { ...s, enabled: !s.enabled } : s
    );
    const nextConfig = { ...config, customSnippets: updatedSnippets };
    setConfig(nextConfig);
    await handleSaveAllConfig(nextConfig);
  };

  const handleDeleteSnippet = async (id: string) => {
    const confirmMsg = isAr
      ? 'هل أنت متأكد من حذف هذا الكود المخصص نهائياً؟'
      : 'Are you sure you want to permanently delete this code snippet?';
    if (!window.confirm(confirmMsg)) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/tracking?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.config) {
        setConfig(data.config);
        if (data.summary) setSummary(data.summary);
        showToast('success', isAr ? 'تم حذف الكود بنجاح' : 'Snippet deleted');
      }
    } catch (err) {
      console.error('Failed to delete snippet:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEvent = () => {
    if (typeof window !== 'undefined') {
      const w = window as unknown as {
        dataLayer?: Array<Record<string, unknown>>;
        gtag?: (...args: unknown[]) => void;
      };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: 'persici_diagnostic_test',
        timestamp: new Date().toISOString(),
        gtm_container: config.gtm.containerId || 'not_set',
        ga4_measurement_id: config.ga4.measurementId || 'not_set',
      });
      if (typeof w.gtag === 'function') {
        w.gtag('event', 'persici_diagnostic_test', { debug_mode: true });
      }
      setTestPingSent(true);
      setTimeout(() => setTestPingSent(false), 3000);
    }
  };

  const gtmIdValid = /^GTM-[A-Z0-9]+$/i.test(config.gtm.containerId.trim());
  const ga4IdValid = /^G-[A-Z0-9]+$/i.test(config.ga4.measurementId.trim());

  return (
    <div className="space-y-6 max-w-7xl" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            <TbCode className="w-4 h-4" />
            <span>
              {isAr
                ? 'نظام الميديا باينج، التتبع، والأكواد المخصصة'
                : 'Media Buying, Pixels & Tag Architecture'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAr
              ? 'إدارة Google Tag Manager، البيكسل، تحليلات جوجل، والأكواد المخصصة'
              : 'Google Tag Manager, Ad Pixels, GA4 & Custom Code Snippets'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAr
              ? 'اربط أي بيكسل إعلاني أو Google Tag Manager أو أضف أكواد HTML/JS مخصصة في الهيدر أو بعد <body> أو في الفوتر مثل إضافات ووردبريس الاحترافية.'
              : 'Connect GTM, GA4, Meta/TikTok/Snap/LinkedIn pixels, or inject custom HTML & JS snippets into <head>, after <body>, or before </body>.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {saveMessage && (
            <div
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border ${
                saveMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {saveMessage.type === 'success' ? (
                <TbCheck className="w-4 h-4 shrink-0" />
              ) : (
                <TbAlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{saveMessage.text}</span>
            </div>
          )}

          <button
            type="button"
            onClick={fetchTrackingConfig}
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <TbRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSaveAllConfig()}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <TbDeviceFloppy className="w-4 h-4" />
            <span>
              {saving
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : isAr
                ? 'حفظ ونشر الإعدادات'
                : 'Save & Publish Changes'}
            </span>
          </button>
        </div>
      </div>

      {/* Live Status Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">
              Google Tag Manager
            </span>
            <span className="text-sm font-bold text-slate-900">
              {config.gtm.enabled && config.gtm.containerId
                ? config.gtm.containerId
                : isAr
                ? 'غير مفعل'
                : 'Inactive'}
            </span>
          </div>
          <span
            className={`w-3 h-3 rounded-full ${
              config.gtm.enabled && config.gtm.containerId ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">
              Google Analytics 4
            </span>
            <span className="text-sm font-bold text-slate-900">
              {config.ga4.enabled && config.ga4.measurementId
                ? config.ga4.measurementId
                : isAr
                ? 'غير مفعل'
                : 'Inactive'}
            </span>
          </div>
          <span
            className={`w-3 h-3 rounded-full ${
              config.ga4.enabled && config.ga4.measurementId ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">
              {isAr ? 'البيكسلات المفعلة' : 'Active Ad Pixels'}
            </span>
            <span className="text-sm font-bold text-slate-900">
              {summary?.activePixels.length || 0}{' '}
              {isAr ? 'منصات متصلة' : 'Connected Platforms'}
            </span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              (summary?.activePixels.length || 0) > 0
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {summary?.activePixels.join(', ') || (isAr ? 'لا يوجد' : 'None')}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">
              {isAr ? 'الأكواد المخصصة (Snippets)' : 'Custom Code Snippets'}
            </span>
            <span className="text-sm font-bold text-slate-900">
              {config.customSnippets.filter((s) => s.enabled).length} /{' '}
              {config.customSnippets.length} {isAr ? 'نشط' : 'Active'}
            </span>
          </div>
          <TbTerminal2 className="w-5 h-5 text-purple-600" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('gtm')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'gtm'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TbBrandGoogle className="w-4 h-4 text-blue-400" />
          <span>1. Google Tag Manager (GTM)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ga4')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ga4'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TbChartHistogram className="w-4 h-4 text-amber-400" />
          <span>
            {isAr
              ? '2. تحليلات جوجل (GA4) والربط المستقبلي'
              : '2. Google Analytics 4 (GA4) & Future Link'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pixels')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pixels'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TbBrandMeta className="w-4 h-4 text-indigo-400" />
          <span>
            {isAr
              ? '3. بيكسلات المنصات الإعلانية (Meta / TikTok / Snap)'
              : '3. Native Ad Pixels (Meta, TikTok, Snap, Ads)'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('snippets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'snippets'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TbCode className="w-4 h-4 text-emerald-400" />
          <span>
            {isAr
              ? '4. أكواد مخصصة بنظام ووردبريس (Head / Body / Footer)'
              : '4. Custom Code Snippets (WPCode Style)'}
          </span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-purple-600 text-white">
            {config.customSnippets.length}
          </span>
        </button>
      </div>

      {/* TAB 1: GOOGLE TAG MANAGER */}
      {activeTab === 'gtm' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isAr ? 'ربط Google Tag Manager (GTM)' : 'Google Tag Manager (GTM) Integration'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'يقوم النظام تلقائياً بحقن كود GTM الأساسي في <head> وكود <noscript> بعد وسم <body> مباشرة.'
                    : 'Automatically injects the primary GTM script in <head> and the <noscript> fallback immediately after <body>.'}
                </p>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.gtm.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      gtm: { ...prev.gtm, enabled: e.target.checked },
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all relative peer-checked:bg-emerald-600" />
                <span className="text-xs font-bold text-slate-700">
                  {config.gtm.enabled ? (isAr ? 'مفعل' : 'Enabled') : isAr ? 'معطل' : 'Disabled'}
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isAr ? 'معرف حاوية GTM (Container ID)' : 'GTM Container ID'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="GTM-XXXXXXX"
                    value={config.gtm.containerId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        gtm: { ...prev.gtm, containerId: e.target.value.toUpperCase() },
                      }))
                    }
                    className="flex-1 px-3.5 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                  {config.gtm.containerId && (
                    <span
                      className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                        gtmIdValid
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {gtmIdValid
                        ? isAr
                          ? 'صيغة صحيحة'
                          : 'Valid Format'
                        : isAr
                        ? 'يجب أن يبدأ بـ GTM-'
                        : 'Use GTM-XXXXXXX'}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isAr ? 'اسم طبقة البيانات (dataLayer Name)' : 'DataLayer Variable Name'}
                  </label>
                  <input
                    type="text"
                    placeholder="dataLayer"
                    value={config.gtm.dataLayerName || 'dataLayer'}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        gtm: { ...prev.gtm, dataLayerName: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isAr
                      ? 'نطاق التتبع الخادمي الاختياري (Server-Side GTM URL)'
                      : 'Server-Side Tagging Domain (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.googletagmanager.com"
                    value={config.gtm.customScriptDomain || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        gtm: { ...prev.gtm, customScriptDomain: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSendTestEvent}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <TbPlayerPlay className="w-4 h-4 text-purple-600" />
                <span>
                  {testPingSent
                    ? isAr
                      ? 'تم إرسال الحدث إلى dataLayer!'
                      : 'Test Event Pushed to dataLayer!'
                    : isAr
                    ? 'إرسال حدث تجريبي إلى dataLayer'
                    : 'Push Test Event to dataLayer'}
                </span>
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveAllConfig()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                <TbDeviceFloppy className="w-4 h-4" />
                <span>{isAr ? 'حفظ إعدادات GTM' : 'Save GTM Settings'}</span>
              </button>
            </div>
          </div>

          {/* Live Generated Code Preview */}
          <div className="lg:col-span-5 bg-slate-900 text-slate-100 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <TbEye className="w-4 h-4" />
                {isAr ? 'معاينة الكود المحقون تلقائياً' : 'Auto-Injected Best-Practice Code'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                Next.js SSR + Hydration
              </span>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-emerald-300">
                1. {isAr ? 'يُحقن في <head>:' : 'Injected in <head>:'}
              </p>
              <pre className="p-3 rounded-xl bg-black/50 border border-white/10 text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {`<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'${config.gtm.customScriptDomain || 'https://www.googletagmanager.com'}/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);
})(window,document,'script','${config.gtm.dataLayerName || 'dataLayer'}','${
                  config.gtm.containerId || 'GTM-XXXXXXX'
                }');</script>`}
              </pre>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-blue-300">
                2. {isAr ? 'يُحقن مباشرة بعد فتح <body>:' : 'Injected immediately after <body>:'}
              </p>
              <pre className="p-3 rounded-xl bg-black/50 border border-white/10 text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {`<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="${
                  config.gtm.customScriptDomain || 'https://www.googletagmanager.com'
                }/ns.html?id=${config.gtm.containerId || 'GTM-XXXXXXX'}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`}
              </pre>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 leading-relaxed">
              {isAr
                ? 'ملاحظة: عند إرسال أي نموذج (تواصل، موعد، أو مكالمة استكشاف) يقوم النظام تلقائياً بدفع الحدث persici_lead_submitted و generate_lead إلى dataLayer.'
                : 'Note: Whenever any form (Contact, Strategy Appointment, or Discovery Call) is submitted, the site automatically pushes persici_lead_submitted & generate_lead to dataLayer.'}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE ANALYTICS 4 (GA4) & FUTURE REPORTING SETUP */}
      {activeTab === 'ga4' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Direct GA4 Tagging */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isAr ? 'ربط Google Analytics 4 (GA4) المباشر' : 'Google Analytics 4 (GA4) Tagging'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'فعّل تتبع الزيارات والأحداث تلقائياً عبر معرف القياس (G-XXXXXXXXXX).'
                    : 'Enable direct gtag.js measurement and automatic lead conversion events.'}
                </p>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.ga4.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      ga4: { ...prev.ga4, enabled: e.target.checked },
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all relative peer-checked:bg-emerald-600" />
                <span className="text-xs font-bold text-slate-700">
                  {config.ga4.enabled ? (isAr ? 'مفعل' : 'Enabled') : isAr ? 'معطل' : 'Disabled'}
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isAr ? 'معرف القياس (GA4 Measurement ID)' : 'GA4 Measurement ID'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={config.ga4.measurementId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      ga4: { ...prev.ga4, measurementId: e.target.value.toUpperCase() },
                    }))
                  }
                  className="flex-1 px-3.5 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl"
                />
                {config.ga4.measurementId && (
                  <span
                    className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                      ga4IdValid
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {ga4IdValid ? (isAr ? 'صحيح' : 'Valid') : 'G-XXXXXXXXXX'}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {isAr
                      ? 'تتبع مشاهدات الصفحات تلقائياً (Auto Page Views)'
                      : 'Automatic PageView Tracking (SPA Route Changes)'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {isAr
                      ? 'إرسال حدث page_view عند التنقل بين صفحات الموقع'
                      : 'Sends page_view on every Next.js App Router navigation'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.ga4.sendPageViews}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      ga4: { ...prev.ga4, sendPageViews: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {isAr
                      ? 'تتبع تحويلات النماذج والعملاء المحتملين (Lead Conversions)'
                      : 'Automatic Lead Form Conversion Events'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {isAr
                      ? 'إرسال generate_lead و schedule_appointment تلقائياً عند إرسال النماذج'
                      : 'Fires generate_lead & schedule_appointment when forms succeed'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.ga4.trackLeadEvents}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      ga4: { ...prev.ga4, trackLeadEvents: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-700">
                    {isAr ? 'إخفاء هوية IP' : 'Anonymize IP'}
                  </span>
                  <input
                    type="checkbox"
                    checked={config.ga4.anonymizeIp}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        ga4: { ...prev.ga4, anonymizeIp: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-700">
                    {isAr ? 'وضع التصحيح (DebugView)' : 'GA4 DebugView Mode'}
                  </span>
                  <input
                    type="checkbox"
                    checked={config.ga4.debugMode}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        ga4: { ...prev.ga4, debugMode: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveAllConfig()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                <TbDeviceFloppy className="w-4 h-4" />
                <span>{isAr ? 'حفظ إعدادات GA4' : 'Save GA4 Settings'}</span>
              </button>
            </div>
          </div>

          {/* Future Google Analytics Data API & Server-Side Credentials */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    {isAr
                      ? 'إعدادات الربط المتقدم المستقبلي مع Google Analytics API'
                      : 'Future-Ready GA4 Data API & Server Integration'}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      summary?.ga4FutureReady
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    {summary?.ga4FutureReady
                      ? isAr
                        ? 'جاهز للربط'
                        : 'API Credentials Stored'
                      : isAr
                      ? 'جاهز للتعبئة مستقبلاً'
                      : 'Plug & Play Ready'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isAr
                    ? 'عندما ترغب في سحب تقارير Google Analytics مباشرة إلى لوحة التحكم مستقبلاً، ما عليك سوى ملء هذه الحقول وتفعيل المفتاح.'
                    : 'Fill these settings anytime in the future to unlock server-to-server Measurement Protocol and live GA4 Reporting API widgets.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'معرف خاصية GA4 (Property ID)' : 'GA4 Property ID'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789"
                  value={config.ga4.propertyId || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      ga4: { ...prev.ga4, propertyId: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'معرف تدفق البيانات (Data Stream ID)' : 'Web Data Stream ID'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={config.ga4.dataStreamId || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      ga4: { ...prev.ga4, dataStreamId: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr
                  ? 'المفتاح السري لبروتوكول القياس (Measurement Protocol API Secret)'
                  : 'Measurement Protocol API Secret (Server-Side Events)'}
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••••••"
                value={config.ga4.apiSecret || ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    ga4: { ...prev.ga4, apiSecret: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr
                  ? 'البريد الإلكتروني لحساب الخدمة (GCP Service Account Email)'
                  : 'Google Cloud Service Account Email (Reporting API)'}
              </label>
              <input
                type="email"
                placeholder="analytics-reader@project-id.iam.gserviceaccount.com"
                value={config.ga4.serviceAccountEmail || ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    ga4: { ...prev.ga4, serviceAccountEmail: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <TbLock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {isAr
                    ? 'المفتاح الخاص لحساب الخدمة (Service Account Private Key PEM)'
                    : 'Service Account Private Key (Encrypted / Server-Only)'}
                </span>
              </label>
              <textarea
                rows={3}
                placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                value={config.ga4.serviceAccountPrivateKey || ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    ga4: { ...prev.ga4, serviceAccountPrivateKey: e.target.value },
                  }))
                }
                className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                {isAr
                  ? 'محمي بالكامل: لا يتم إرسال المفاتيح السرية أبداً إلى المتصفح العام للزوار.'
                  : 'Security: Server-side credentials are stripped by toPublicTrackingConfig() and never exposed to public visitors.'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveAllConfig()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              >
                <TbDeviceFloppy className="w-4 h-4" />
                <span>{isAr ? 'حفظ بيانات الربط المستقبلي' : 'Save Future GA4 API Credentials'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NATIVE AD PIXELS */}
      {activeTab === 'pixels' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meta Pixel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <TbBrandMeta className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Meta (Facebook & Instagram) Pixel</h3>
                    <p className="text-[11px] text-slate-400">
                      {isAr ? 'تتبع PageView و Lead و Schedule تلقائياً' : 'Auto-tracks PageView, Lead & Schedule events'}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.pixels.meta.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      pixels: {
                        ...prev.pixels,
                        meta: { ...prev.pixels.meta, enabled: e.target.checked },
                      },
                    }))
                  }
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Meta Pixel ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 123456789012345"
                    value={config.pixels.meta.pixelId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        pixels: {
                          ...prev.pixels,
                          meta: { ...prev.pixels.meta, pixelId: e.target.value.trim() },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Test Event Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="TEST12345"
                    value={config.pixels.meta.testEventCode || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        pixels: {
                          ...prev.pixels,
                          meta: { ...prev.pixels.meta, testEventCode: e.target.value.trim() },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Conversions API (CAPI) Access Token (Optional - Server Only)
                </label>
                <input
                  type="password"
                  placeholder="EAA..."
                  value={config.pixels.meta.capiAccessToken || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      pixels: {
                        ...prev.pixels,
                        meta: { ...prev.pixels.meta, capiAccessToken: e.target.value.trim() },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* TikTok Pixel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 text-white">
                    <TbBrandTiktok className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">TikTok Pixel</h3>
                    <p className="text-[11px] text-slate-400">
                      {isAr ? 'تتبع ttq.page() و SubmitForm تلقائياً' : 'Auto-tracks ttq.page() & SubmitForm'}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.pixels.tiktok.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      pixels: {
                        ...prev.pixels,
                        tiktok: { ...prev.pixels.tiktok, enabled: e.target.checked },
                      },
                    }))
                  }
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  TikTok Pixel ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. C1234567890ABCDEF"
                  value={config.pixels.tiktok.pixelId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      pixels: {
                        ...prev.pixels,
                        tiktok: { ...prev.pixels.tiktok, pixelId: e.target.value.trim() },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Google Ads Conversion Tracking */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                    <TbBrandGoogle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Google Ads Conversion Tracking</h3>
                    <p className="text-[11px] text-slate-400">
                      {isAr ? 'ربط AW-CONVERSION_ID وتسميات التحويل' : 'Fires gtag conversion events per lead funnel'}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.pixels.googleAds.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      pixels: {
                        ...prev.pixels,
                        googleAds: { ...prev.pixels.googleAds, enabled: e.target.checked },
                      },
                    }))
                  }
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Conversion ID (AW-XXXXXXXXX)
                  </label>
                  <input
                    type="text"
                    placeholder="AW-123456789"
                    value={config.pixels.googleAds.conversionId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        pixels: {
                          ...prev.pixels,
                          googleAds: {
                            ...prev.pixels.googleAds,
                            conversionId: e.target.value.trim(),
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Conversion Label (Lead / Booking)
                  </label>
                  <input
                    type="text"
                    placeholder="AbCdEfGhIjKlMnOp"
                    value={config.pixels.googleAds.conversionLabel || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        pixels: {
                          ...prev.pixels,
                          googleAds: {
                            ...prev.pixels.googleAds,
                            conversionLabel: e.target.value.trim(),
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Snapchat, LinkedIn & X Pixels */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                {isAr
                  ? 'بيكسل سناب شات، لينكدإن، ومنصة X'
                  : 'Snapchat, LinkedIn Insight & X (Twitter) Pixels'}
              </h3>

              {/* Snapchat */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.pixels.snapchat.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      pixels: {
                        ...prev.pixels,
                        snapchat: { ...prev.pixels.snapchat, enabled: e.target.checked },
                      },
                    }))
                  }
                  className="w-4 h-4 accent-purple-600 rounded"
                />
                <TbBrandSnapchat className="w-5 h-5 text-amber-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Snapchat Pixel ID (UUID)"
                  value={config.pixels.snapchat.pixelId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      pixels: {
                        ...prev.pixels,
                        snapchat: { ...prev.pixels.snapchat, pixelId: e.target.value.trim() },
                      },
                    }))
                  }
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.pixels.linkedin.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      pixels: {
                        ...prev.pixels,
                        linkedin: { ...prev.pixels.linkedin, enabled: e.target.checked },
                      },
                    }))
                  }
                  className="w-4 h-4 accent-purple-600 rounded"
                />
                <TbBrandLinkedin className="w-5 h-5 text-blue-700 shrink-0" />
                <input
                  type="text"
                  placeholder="LinkedIn Partner ID (e.g. 1234567)"
                  value={config.pixels.linkedin.partnerId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      pixels: {
                        ...prev.pixels,
                        linkedin: { ...prev.pixels.linkedin, partnerId: e.target.value.trim() },
                      },
                    }))
                  }
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* X / Twitter */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.pixels.x.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      pixels: {
                        ...prev.pixels,
                        x: { ...prev.pixels.x, enabled: e.target.checked },
                      },
                    }))
                  }
                  className="w-4 h-4 accent-purple-600 rounded"
                />
                <TbBrandX className="w-5 h-5 text-slate-900 shrink-0" />
                <input
                  type="text"
                  placeholder="X (Twitter) Pixel ID (e.g. o1234)"
                  value={config.pixels.x.pixelId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      pixels: {
                        ...prev.pixels,
                        x: { ...prev.pixels.x, pixelId: e.target.value.trim() },
                      },
                    }))
                  }
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Clarity & Hotjar */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.pixels.behavior.clarityEnabled}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        pixels: {
                          ...prev.pixels,
                          behavior: {
                            ...prev.pixels.behavior,
                            clarityEnabled: e.target.checked,
                          },
                        },
                      }))
                    }
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Clarity Project ID"
                    value={config.pixels.behavior.clarityProjectId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        pixels: {
                          ...prev.pixels,
                          behavior: {
                            ...prev.pixels.behavior,
                            clarityProjectId: e.target.value.trim(),
                          },
                        },
                      }))
                    }
                    className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.pixels.behavior.hotjarEnabled}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        pixels: {
                          ...prev.pixels,
                          behavior: {
                            ...prev.pixels.behavior,
                            hotjarEnabled: e.target.checked,
                          },
                        },
                      }))
                    }
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Hotjar Site ID"
                    value={config.pixels.behavior.hotjarSiteId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        pixels: {
                          ...prev.pixels,
                          behavior: {
                            ...prev.pixels.behavior,
                            hotjarSiteId: e.target.value.trim(),
                          },
                        },
                      }))
                    }
                    className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveAllConfig()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors"
            >
              <TbDeviceFloppy className="w-4 h-4" />
              <span>{isAr ? 'حفظ جميع إعدادات البيكسل' : 'Save All Pixel Configurations'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: WPCODE-STYLE CUSTOM CODE SNIPPETS MANAGER */}
      {activeTab === 'snippets' && (
        <div className="space-y-6">
          {/* Top Action & Starter Templates Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isAr
                    ? 'مكتبة الأكواد المخصصة (على غرار إضافات WPCode في ووردبريس)'
                    : 'Custom Code Snippets Manager (WPCode Style)'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'اختر مكان حقن الكود بدقة (أعلى <head>، أسفل <head> قبل إغلاقه، بعد <body>، أو في الفوتر قبل </body>)، ونوع الكود (HTML أو JavaScript)، والصفحات المستهدفة.'
                    : 'Choose exact placement (Top of <head>, Bottom of <head> before </head>, After <body>, or Footer before </body>), code format (HTML or JS), and page scope.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewSnippet}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors shrink-0"
              >
                <TbPlus className="w-4 h-4" />
                <span>{isAr ? 'إضافة كود مخصص جديد' : 'Add Custom Snippet'}</span>
              </button>
            </div>

            {/* 1-Click Starter Templates */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {isAr ? 'قوالب سريعة جاهزة بنقرة واحدة:' : '1-Click Quick-Start Templates:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {SNIPPET_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.name}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-200 transition-colors"
                  >
                    <TbSparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>{isAr ? tpl.labelAr : tpl.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Snippet Creation / Editing Form */}
          {showSnippetForm && (
            <form
              onSubmit={handleSaveSnippet}
              className="bg-white p-6 rounded-2xl border-2 border-purple-500/30 shadow-md space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editingSnippet
                    ? isAr
                      ? `تعديل الكود: ${editingSnippet.name}`
                      : `Edit Snippet: ${editingSnippet.name}`
                    : isAr
                    ? 'إضافة كود أو بيكسل مخصص جديد'
                    : 'Create New Custom Code Snippet'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSnippetForm(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1 rounded-lg bg-slate-100"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'اسم الكود / البيكسل' : 'Snippet Title'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      isAr
                        ? 'مثال: كود تتبع الصفحة الرئيسية أو بيكسل مخصص'
                        : 'e.g. Homepage Conversion Script or Verification Meta'
                    }
                    value={snippetForm.name}
                    onChange={(e) => setSnippetForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'المنصة أو نوع البيكسل' : 'Platform / Pixel Type'}
                  </label>
                  <select
                    value={snippetForm.platform}
                    onChange={(e) =>
                      setSnippetForm((prev) => ({
                        ...prev,
                        platform: e.target.value as SnippetPlatform,
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {isAr ? p.ar : p.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Placement Selector Cards (4 Positions) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isAr
                    ? 'اختر مكان إضافة الكود في الصفحة (Placement Location)'
                    : 'Where should this code be injected? (Placement)'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {PLACEMENT_OPTIONS.map((place) => {
                    const selected = snippetForm.placement === place.id;
                    return (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() =>
                          setSnippetForm((prev) => ({ ...prev, placement: place.id }))
                        }
                        className={`p-3.5 rounded-xl border text-start transition-all ${
                          selected
                            ? 'bg-purple-50/70 border-purple-600 ring-2 ring-purple-500/20'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">
                          {isAr ? place.ar : place.en}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                          {isAr ? place.descAr : place.descEn}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Code Type + Target Page Scope + Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'نوع الكود (HTML أو JavaScript)' : 'Code Language / Format'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSnippetForm((prev) => ({ ...prev, codeType: 'html' }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        snippetForm.codeType === 'html'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      HTML (&lt;script&gt; / &lt;meta&gt;)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSnippetForm((prev) => ({ ...prev, codeType: 'javascript' }))
                      }
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        snippetForm.codeType === 'javascript'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      Pure JavaScript (JS)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'نطاق الصفحات المستهدفة' : 'Target Page Scope'}
                  </label>
                  <select
                    value={snippetForm.scope}
                    onChange={(e) =>
                      setSnippetForm((prev) => ({
                        ...prev,
                        scope: e.target.value as SnippetPageScope,
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {SCOPE_OPTIONS.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {isAr ? sc.ar : sc.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'الأولوية (1 = الأعلى)' : 'Execution Priority (1 = First)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={snippetForm.priority}
                    onChange={(e) =>
                      setSnippetForm((prev) => ({
                        ...prev,
                        priority: Number(e.target.value) || 10,
                      }))
                    }
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {snippetForm.scope === 'custom_paths' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr
                      ? 'المسارات المحددة (افصل بينها بفاصلة، مثال: /contact, /solutions)'
                      : 'Target URL Paths (comma-separated, e.g. /contact, /solutions)'}
                  </label>
                  <input
                    type="text"
                    placeholder="/contact, /solutions"
                    value={snippetForm.customPathsText}
                    onChange={(e) =>
                      setSnippetForm((prev) => ({ ...prev, customPathsText: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              )}

              {/* Code Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    {snippetForm.codeType === 'html'
                      ? isAr
                        ? 'محتوى كود HTML (يدعم <script> و <noscript> و <meta>)'
                        : 'HTML Snippet Code (Supports <script>, <noscript>, <meta>, etc.)'
                      : isAr
                      ? 'كود JavaScript (بدون وسم <script>)'
                      : 'JavaScript Code (No <script> wrapper needed)'}
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {snippetForm.placement} • {snippetForm.codeType.toUpperCase()}
                  </span>
                </div>
                <textarea
                  rows={7}
                  required
                  value={snippetForm.code}
                  onChange={(e) => setSnippetForm((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder={
                    snippetForm.codeType === 'html'
                      ? '<!-- Paste your pixel or HTML code here -->\n<script>\n  ...\n</script>'
                      : '// Paste your JavaScript code here\nconsole.log("Loaded");'
                  }
                  className="w-full p-4 text-xs font-mono bg-slate-900 text-emerald-300 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={snippetForm.enabled}
                    onChange={(e) =>
                      setSnippetForm((prev) => ({ ...prev, enabled: e.target.checked }))
                    }
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {isAr ? 'تفعيل هذا الكود فوراً عند الحفظ' : 'Activate snippet immediately'}
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors"
                >
                  <TbDeviceFloppy className="w-4 h-4" />
                  <span>{isAr ? 'حفظ الكود المخصص' : 'Save Snippet'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Snippets Table / Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {config.customSnippets.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <TbCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-bold text-slate-700">
                  {isAr ? 'لا توجد أكواد مخصصة مضافة بعد' : 'No custom code snippets added yet'}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  {isAr
                    ? 'انقر على "إضافة كود مخصص جديد" أو اختر أحد القوالب السريعة أعلاه لإضافة أكواد في الهيدر أو البودي أو الفوتر.'
                    : 'Click "Add Custom Snippet" or pick a quick-start template above to inject HTML or JS into <head>, <body>, or footer.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {config.customSnippets.map((snippet) => {
                  const placementMeta =
                    PLACEMENT_OPTIONS.find((p) => p.id === snippet.placement) ||
                    PLACEMENT_OPTIONS[1];
                  const platformMeta =
                    PLATFORM_OPTIONS.find((p) => p.id === snippet.platform) ||
                    PLATFORM_OPTIONS[0];
                  return (
                    <div
                      key={snippet.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{snippet.name}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${placementMeta.badge}`}
                          >
                            {isAr ? placementMeta.ar : placementMeta.en}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 uppercase">
                            {snippet.codeType}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {isAr ? platformMeta.ar : platformMeta.en}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            {snippet.scope === 'homepage_only' ? (
                              <>
                                <TbHome className="w-3 h-3" />
                                {isAr ? 'الصفحة الرئيسية فقط' : 'Homepage Only'}
                              </>
                            ) : snippet.scope === 'custom_paths' ? (
                              <>
                                <TbRoute className="w-3 h-3" />
                                {(snippet.targetPaths || []).join(', ')}
                              </>
                            ) : (
                              <>
                                <TbWorld className="w-3 h-3" />
                                {isAr ? 'جميع صفحات الموقع' : 'All Public Pages'}
                              </>
                            )}
                          </span>
                        </div>
                        <pre className="text-[11px] font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 max-w-3xl truncate">
                          {snippet.code}
                        </pre>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleSnippetEnabled(snippet)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                            snippet.enabled
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {snippet.enabled
                            ? isAr
                              ? 'نشط (Active)'
                              : 'Active'
                            : isAr
                            ? 'معطل (Paused)'
                            : 'Paused'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditSnippet(snippet)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title={isAr ? 'تعديل' : 'Edit'}
                        >
                          <TbEdit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSnippet(snippet.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title={isAr ? 'حذف' : 'Delete'}
                        >
                          <TbTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
