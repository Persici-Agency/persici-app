'use client';

import React, { useState, useEffect, use, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  TbUsers,
  TbTarget,
  TbChartBar,
  TbChartPie,
  TbRefresh,
  TbCalendarCheck,
  TbCode,
  TbWorld,
  TbCircleCheck,
  TbArrowUpRight,
  TbFilter,
  TbMessageDots,
  TbCompass,
} from 'react-icons/tb';
import type { LeadAttributionInfo } from '@/app/[lang]/(site)/_shared/types';
import type { TrackingStatusSummary } from '@/lib/tracking-types';

interface RawLeadItem {
  id: string;
  revenue?: string;
  budgetTier?: string;
  country?: string;
  reason?: string;
  subject?: string;
  status?: string;
  attribution?: LeadAttributionInfo | null;
  createdAt?: string;
}

function MediaBuyingAnalyticsContent({ lang }: { lang: string }) {
  const isAr = lang === 'ar';
  const searchParams = useSearchParams();
  const passkey = searchParams.get('passkey');

  const getHref = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const localized = cleanPath.startsWith(`/${lang}`) ? cleanPath : `/${lang}${cleanPath}`;
    return passkey ? `${localized}?passkey=${encodeURIComponent(passkey)}` : localized;
  };

  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<RawLeadItem[]>([]);
  const [appointments, setAppointments] = useState<RawLeadItem[]>([]);
  const [discoveries, setDiscoveries] = useState<RawLeadItem[]>([]);
  const [trackingSummary, setTrackingSummary] = useState<TrackingStatusSummary | null>(null);
  const [useDemoFallback, setUseDemoFallback] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, aRes, dRes, tRes] = await Promise.all([
        fetch('/api/contact', { cache: 'no-store' }),
        fetch('/api/appointment', { cache: 'no-store' }),
        fetch('/api/discovery', { cache: 'no-store' }),
        fetch('/api/tracking', { cache: 'no-store' }),
      ]);

      const [cData, aData, dData, tData] = await Promise.all([
        cRes.ok ? cRes.json() : { submissions: [] },
        aRes.ok ? aRes.json() : { appointments: [] },
        dRes.ok ? dRes.json() : { submissions: [] },
        tRes.ok ? tRes.json() : { summary: null },
      ]);

      setContacts(Array.isArray(cData.submissions) ? cData.submissions : []);
      setAppointments(Array.isArray(aData.appointments) ? aData.appointments : []);
      setDiscoveries(
        Array.isArray(dData.submissions)
          ? dData.submissions
          : Array.isArray(dData.leads)
          ? dData.leads
          : []
      );
      if (tData.summary) {
        setTrackingSummary(tData.summary);
      }
    } catch (err) {
      console.error('Failed to load media buying analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchAnalytics();
    });
  }, [fetchAnalytics]);

  const allLeads = [...contacts, ...appointments, ...discoveries];
  const totalLeadsCount = allLeads.length;

  // Revenue Tier distribution from appointments + discovery leads
  const revenueTiersMap: Record<string, number> = {};
  [...appointments, ...discoveries].forEach((item) => {
    const rev = (item.revenue || item.budgetTier || '').trim();
    if (rev) {
      revenueTiersMap[rev] = (revenueTiersMap[rev] || 0) + 1;
    }
  });

  const realRevenueBreakdown = Object.entries(revenueTiersMap)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      label,
      count,
      percent: Math.round((count / Math.max(1, appointments.length + discoveries.length)) * 100),
    }));

  const displayRevenueBreakdown =
    realRevenueBreakdown.length > 0 && !useDemoFallback
      ? realRevenueBreakdown
      : [
          { label: '$200,000+ / mo Enterprise Tier', count: 5, percent: 42 },
          { label: '$50,000 - $200,000 / mo Growth Tier', count: 4, percent: 35 },
          { label: '$10,000 - $50,000 / mo Scaling Tier', count: 3, percent: 23 },
        ];

  // UTM / Channel Source distribution
  const sourceMap: Record<string, number> = {};
  allLeads.forEach((item) => {
    const src = item.attribution?.utmSource
      ? `${item.attribution.utmSource}${
          item.attribution.utmMedium ? ` (${item.attribution.utmMedium})` : ''
        }`
      : item.attribution?.gclid
      ? 'Google Ads (GCLID)'
      : item.attribution?.fbclid
      ? 'Meta Ads (FBCLID)'
      : item.attribution?.ttclid
      ? 'TikTok Ads (TTCLID)'
      : isAr
      ? 'زيارات مباشرة وبحث عضوي (Direct / Organic)'
      : 'Direct & Organic Search';
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  });

  const realChannelBreakdown = Object.entries(sourceMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({
      label,
      count,
      percent: Math.round((count / Math.max(1, totalLeadsCount)) * 100),
    }));

  const displayChannelBreakdown =
    realChannelBreakdown.length > 0 && !useDemoFallback
      ? realChannelBreakdown
      : [
          {
            label: isAr ? 'بحث جوجل والزيارات المباشرة' : 'Organic Search & Direct Executive Traffic',
            count: 8,
            percent: 45,
          },
          {
            label: isAr ? 'حملات Meta و Instagram الإعلانية' : 'Meta & Instagram Lead Campaigns',
            count: 6,
            percent: 33,
          },
          {
            label: isAr ? 'حملات LinkedIn و Google Ads' : 'LinkedIn & Google Search Ads',
            count: 4,
            percent: 22,
          },
        ];

  // Top Countries & Inquiry Reasons from Contact Submissions
  const countryMap: Record<string, number> = {};
  const reasonMap: Record<string, number> = {};
  contacts.forEach((c) => {
    if (c.country) countryMap[c.country] = (countryMap[c.country] || 0) + 1;
    const r = c.reason || c.subject;
    if (r) reasonMap[r] = (reasonMap[r] || 0) + 1;
  });

  const topCountries = Object.entries(countryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const topReasons = Object.entries(reasonMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Qualification status funnel
  const qualifiedOrConfirmedCount = allLeads.filter((l) =>
    ['qualified', 'confirmed', 'completed', 'replied'].includes(l.status || '')
  ).length;
  const pendingCount = allLeads.filter(
    (l) => !l.status || ['unread', 'pending'].includes(l.status)
  ).length;

  return (
    <div className="space-y-6 max-w-7xl" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            <span>{isAr ? 'مركز الأداء والاستحواذ الإعلاني' : 'Performance & Acquisition Hub'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAr ? 'تحليلات الحملات والعملاء المحتملين' : 'Campaign & Lead Analytics'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAr
              ? 'تحليل حي لمعدلات التحويل، مصادر UTM، شرائح الإيرادات، وحالة بيكسلات التتبع و Google Tag Manager.'
              : 'Real-time conversion funnel, UTM source attribution, revenue tier breakdown, and active pixel telemetry.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setUseDemoFallback((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              useDemoFallback
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <TbFilter className="w-4 h-4" />
            <span>
              {useDemoFallback
                ? isAr
                  ? 'وضع البيانات التجريبية مفعل'
                  : 'Benchmark Preview Mode'
                : isAr
                ? 'عرض بيانات قاعدة البيانات الحية'
                : 'Live Database Metrics'}
            </span>
          </button>

          <Link
            href={getHref('/dashboard/leads/tracking')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-xs"
          >
            <TbCode className="w-4 h-4" />
            <span>{isAr ? 'إدارة البيكسل و GTM/GA4' : 'Manage Pixels & GTM'}</span>
          </Link>

          <button
            type="button"
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <TbRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Active Tracking & Pixels Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 rounded-2xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <TbCircleCheck className="w-3.5 h-3.5" />
              {isAr ? 'حالة التتبع والبيكسل' : 'Tracking & Tag Telemetry'}
            </span>
            {trackingSummary?.ga4FutureReady && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {isAr ? 'بيانات GA4 API جاهزة' : 'GA4 Data API Ready'}
              </span>
            )}
          </div>
          <h2 className="text-base font-bold">
            {isAr
              ? 'ربط Google Tag Manager، Google Analytics 4، وبيكسلات منصات الإعلانات'
              : 'Google Tag Manager, GA4 & Multi-Channel Ad Pixel Infrastructure'}
          </h2>
          <p className="text-xs text-slate-300">
            {isAr
              ? 'يتم حقن الأكواد تلقائياً في الموقع العام وإرسال أحداث التحويل عند تعبئة أي نموذج.'
              : 'Scripts inject automatically into the storefront and fire conversion events across all active pixels.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              trackingSummary?.gtmActive
                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            GTM: {trackingSummary?.gtmActive ? (isAr ? 'مفعل' : 'Active') : isAr ? 'غير مفعل' : 'Off'}
          </span>
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              trackingSummary?.ga4Active
                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            GA4: {trackingSummary?.ga4Active ? (isAr ? 'مفعل' : 'Active') : isAr ? 'غير مفعل' : 'Off'}
          </span>
          <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 text-white border border-white/15">
            {isAr ? 'البيكسلات المفعلة:' : 'Active Pixels:'}{' '}
            <strong>{trackingSummary?.activePixels.length || 0}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 text-white border border-white/15">
            {isAr ? 'أكواد مخصصة (Snippets):' : 'Active Snippets:'}{' '}
            <strong>{trackingSummary?.activeSnippetsCount || 0}</strong>
          </span>
          <Link
            href={getHref('/dashboard/leads/tracking')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1"
          >
            <span>{isAr ? 'إعدادات التتبع' : 'Configure'}</span>
            <TbArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href={getHref('/dashboard/leads/contact')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isAr ? 'إجمالي العملاء المحتملين' : 'Total Inbound Leads'}
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <TbUsers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalLeadsCount}</span>
            <span className="text-xs font-semibold text-emerald-600">
              {pendingCount} {isAr ? 'بانتظار المتابعة' : 'awaiting action'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isAr
              ? `${contacts.length} رسالة تواصل • ${appointments.length} موعد • ${discoveries.length} استكشاف`
              : `${contacts.length} contact • ${appointments.length} appointments • ${discoveries.length} discovery`}
          </p>
        </Link>

        <Link
          href={getHref('/dashboard/leads/appointments')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isAr ? 'المواعيد الاستراتيجية' : 'Strategy Appointments'}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <TbCalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{appointments.length}</span>
            <span className="text-xs font-semibold text-emerald-600">
              {appointments.filter((a) => a.status === 'confirmed').length}{' '}
              {isAr ? 'مؤكد' : 'confirmed'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isAr ? 'حجوزات أداة الجدولة العائمة' : 'Booked via Floating Appointment Widget'}
          </p>
        </Link>

        <Link
          href={getHref('/dashboard/leads/discovery')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isAr ? 'مكالمات الاستكشاف' : 'Discovery Sessions'}
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <TbCompass className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{discoveries.length}</span>
            <span className="text-xs font-semibold text-blue-600">
              {discoveries.filter((d) => d.status === 'qualified').length}{' '}
              {isAr ? 'مؤهل' : 'qualified'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isAr ? 'طلبات الشركات من الصفحة الرئيسية' : 'High-intent enterprise discovery briefs'}
          </p>
        </Link>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isAr ? 'معدل التأهيل والمتابعة' : 'Qualification Rate'}
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <TbTarget className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {totalLeadsCount > 0
                ? `${Math.round((qualifiedOrConfirmedCount / totalLeadsCount) * 100)}%`
                : '0%'}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              ({qualifiedOrConfirmedCount} / {totalLeadsCount})
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isAr ? 'نسبة العملاء المؤهلين أو المؤكدين' : 'Replied, confirmed, or qualified leads'}
          </p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue / Budget Tier Breakdown */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TbChartPie className="w-4 h-4 text-purple-600" />
              <span>
                {isAr
                  ? 'توزيع شرائح الإيرادات الشهرية للعملاء'
                  : 'Lead Revenue & Budget Tier Distribution'}
              </span>
            </h3>
            {realRevenueBreakdown.length === 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                {isAr ? 'معاينة قياسية' : 'Benchmark Sample'}
              </span>
            )}
          </div>

          <div className="space-y-3.5 pt-2">
            {displayRevenueBreakdown.map((tier, idx) => (
              <div key={tier.label}>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>{tier.label}</span>
                  <span className="font-semibold text-purple-700">
                    {tier.count} ({tier.percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      idx === 0
                        ? 'bg-purple-600'
                        : idx === 1
                        ? 'bg-indigo-500'
                        : 'bg-blue-400'
                    }`}
                    style={{ width: `${Math.max(6, tier.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel & UTM Contribution */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TbChartBar className="w-4 h-4 text-purple-600" />
              <span>
                {isAr
                  ? 'أهم قنوات الاستحواذ ومصادر UTM'
                  : 'Top Acquisition Channels & UTM Sources'}
              </span>
            </h3>
            {realChannelBreakdown.length === 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                {isAr ? 'معاينة قياسية' : 'Benchmark Sample'}
              </span>
            )}
          </div>

          <div className="space-y-3 pt-1">
            {displayChannelBreakdown.map((ch) => (
              <div
                key={ch.label}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900">{ch.label}</p>
                  <p className="text-[10px] text-slate-400">
                    {ch.count} {isAr ? 'عميل محتمل مسجل' : 'attributed leads'}
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                  {ch.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic & Topic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TbWorld className="w-4 h-4 text-indigo-600" />
            <span>{isAr ? 'توزيع الدول والأسواق' : 'Top Geographic Markets'}</span>
          </h3>
          {topCountries.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-400">
              {isAr
                ? 'ستظهر إحصائيات الدول فور استلام رسائل من صفحة تواصل معنا.'
                : 'Country distribution will populate as contact submissions arrive.'}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {topCountries.map(([country, count]) => (
                <div
                  key={country}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-slate-800">{country}</span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TbMessageDots className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'أكثر أسباب التواصل طلباً' : 'Top Inquiry Objectives & Reasons'}</span>
          </h3>
          {topReasons.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-400">
              {isAr
                ? 'ستظهر أسباب التواصل الأكثر طلباً فور وصول استفسارات جديدة.'
                : 'Inquiry reason breakdown will populate as prospects submit forms.'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {topReasons.map(([reason, count]) => (
                <div
                  key={reason}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-slate-800">{reason}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MediaBuyingAnalyticsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading analytics...</div>}>
      <MediaBuyingAnalyticsContent lang={resolvedParams.lang} />
    </Suspense>
  );
}
