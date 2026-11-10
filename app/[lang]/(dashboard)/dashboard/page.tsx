'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  TbTrendingUp,
  TbFiles,
  TbUserCheck,
  TbPhoto,
  TbUsers,
  TbArrowUpRight,
  TbCalendarCheck,
  TbRefresh,
  TbBuildingSkyscraper,
  TbArticle,
  TbBriefcase,
  TbCode,
  TbChartBar,
  TbStar,
  TbTool,
  TbCompass,
  TbMessageDots,
  TbPlugConnected,
} from 'react-icons/tb';

interface MetricItem {
  key: string;
  title: string;
  value: number | string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
  href?: string;
}

interface TrackingSummary {
  gtmActive: boolean;
  gtmContainerId: string;
  ga4Active: boolean;
  ga4MeasurementId: string;
  ga4ApiConfigured: boolean;
  activePixels: string[];
  activePixelsCount: number;
  activeSnippetsCount: number;
  totalSnippetsCount: number;
}

interface OverviewData {
  success: boolean;
  connected: boolean;
  userRole: string;
  metrics: MetricItem[];
  counts: {
    projects: number;
    insights: number;
    reviews: number;
    services: number;
    inquiries: number;
    unreadInquiries?: number;
    appointments: number;
    pendingAppointments?: number;
    discoveryLeads: number;
    pendingDiscovery?: number;
    totalLeads: number;
    media: number;
    applicants: number;
    newApplicants?: number;
    openings: number;
  };
  leadFunnel?: {
    contactInquiries: number;
    strategyAppointments: number;
    discoveryCalls: number;
    totalInboundLeads: number;
    unreadOrPending: number;
    contactedOrConfirmed: number;
    qualifiedOrReplied: number;
  };
  trackingSummary?: TrackingSummary;
  recentInquiries?: Array<{
    id: string;
    name: string;
    email: string;
    company?: string;
    country?: string;
    reason?: string;
    status?: string;
    createdAt: string;
  }>;
  recentAppointments?: Array<{
    id: string;
    name: string;
    email: string;
    website?: string;
    revenue?: string;
    selectedDate?: string;
    selectedTime?: string;
    status?: string;
    createdAt: string;
  }>;
  recentLeads?: Array<{
    id: string;
    name: string;
    email: string;
    website?: string;
    revenue?: string;
    status?: string;
    createdAt: string;
  }>;
  recentApplicants?: Array<{
    id: string;
    name: string;
    email: string;
    roleTitle: string;
    status: string;
    createdAt: string;
  }>;
}

function DashboardOverviewInner() {
  const routeParams = useParams();
  const searchParams = useSearchParams();
  const lang = (routeParams?.lang as string) || 'en';
  const isRtl = lang === 'ar';
  const passkey = searchParams?.get('passkey') || searchParams?.get('key') || '';

  const getHref = (href: string) => {
    const fullPath = href.startsWith(`/${lang}`)
      ? href
      : `/${lang}${href.startsWith('/') ? href : `/${href}`}`;
    if (!passkey) return fullPath;
    const sep = fullPath.includes('?') ? '&' : '?';
    return `${fullPath}${sep}passkey=${encodeURIComponent(passkey)}`;
  };

  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [leadTab, setLeadTab] = useState<'inquiries' | 'appointments' | 'discovery'>('inquiries');

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/overview', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load dashboard overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      fetchOverview();
    });
  }, []);

  const role = data?.userRole || 'admin';
  const canSeeLeads = ['admin', 'media buying'].includes(role);
  const canSeeHr = ['admin', 'hr'].includes(role);

  const t = {
    badge: isRtl ? 'مركز قيادة بيرسيشي الاستراتيجي' : 'Persici Strategic Command',
    title: isRtl ? 'مركز التحكم والتحليلات المؤسسي' : 'Enterprise Control & Analytics Center',
    desc: isRtl
      ? 'أهلاً بك في المنظومة الإدارية المتكاملة لوكالة بيرسيشي. يمكنك تعديل محتوى الموقع بالكامل لحظياً، وإدارة العملاء المحتملين والحملات الإعلانية، وربط Google Tag Manager و Google Analytics وأكواد التتبع، ومتابعة مسار التوظيف ومكتبة التخزين R2.'
      : 'Welcome to the Persici Agency administrative ecosystem. Edit 100% of website content in real time, manage inbound leads & media buying funnels, connect Google Tag Manager, Google Analytics 4 & custom tracking pixels, and oversee ATS applications.',
    editHome: isRtl ? 'تعديل الصفحة الرئيسية' : 'Edit Home Page',
    newPost: isRtl ? '+ كتابة مقال جديد' : '+ Write New Post',
    newProject: isRtl ? '+ إضافة دراسة حالة' : '+ Add Client Story',
    newCareer: isRtl ? '+ نشر وظيفة جديدة' : '+ Publish Career',
    viewLeads: isRtl ? 'إدارة العملاء المحتملين' : 'Manage Leads',
    trackingBtn: isRtl ? 'البيكسل و GTM / GA4' : 'Pixels, GTM & GA4',
    syncNotice: isRtl ? 'متزامن لحظياً مع سحابة Atlas' : 'Live Synced with Atlas Cloud',
    launchpad: isRtl ? 'منصة الإطلاق الإدارية السريعة' : 'Administrative Quick Launchpad',
    cmsCard: isRtl ? 'الصفحة الرئيسية' : 'Home Page CMS',
    cmsSub: isRtl ? 'تعديل الهيرو والأقسام' : 'Edit hero & sections',
    postsCard: isRtl ? 'المقالات والمدونة' : 'Blogs & Insights',
    postsSub: isRtl ? 'كتابة ونشر المقالات' : 'Articles & AI overviews',
    casesCard: isRtl ? 'قصص نجاح العملاء' : 'Client Stories',
    casesSub: isRtl ? 'دراسات الحالة والمشاريع' : 'Portfolio & case studies',
    reviewsCard: isRtl ? 'تقييمات العملاء' : 'Client Reviews',
    reviewsSub: isRtl ? 'الشهادات والتوصيات' : 'Testimonials wall',
    careersCard: isRtl ? 'الوظائف الشاغرة' : 'Job Openings',
    careersSub: isRtl ? 'إدارة وإضافة شواغر' : 'Active roles & ATS',
    mediaCard: isRtl ? 'مكتبة التخزين R2' : 'Storage Library R2',
    mediaSub: isRtl ? 'سحابة Cloudflare R2' : 'Cloudflare R2 & WebP',
    atsCard: isRtl ? 'المتقدمين للوظائف' : 'Candidate Pipeline',
    atsSub: isRtl ? 'السير الذاتية والمراسلات' : 'CVs & HR outreach',
    leadsCard: isRtl ? 'العملاء والاستفسارات' : 'Inbound Leads CRM',
    leadsSub: isRtl ? 'تأهيل العملاء والمواعيد' : 'Inquiries & bookings',
    analyticsCard: isRtl ? 'تحليلات الحملات' : 'Campaign Analytics',
    analyticsSub: isRtl ? 'أداء القنوات والميزانيات' : 'Funnel & attribution',
    pixelsCard: isRtl ? 'البيكسل والأكواد' : 'Pixels, GTM & GA4',
    pixelsSub: isRtl ? 'ربط البيكسل والأكواد المخصصة' : 'Tag Manager & snippets',
    maintCard: isRtl ? 'وضع الصيانة والتوجيه' : 'Maintenance Mode',
    maintSub: isRtl ? 'العد التنازلي والتحويل' : 'Countdown & redirect',
    teamCard: isRtl ? 'صلاحيات الفريق' : 'Team & RBAC',
    teamSub: isRtl ? 'إدارة الأدوار والمستخدمين' : 'Roles & permissions',
    funnelTitle: isRtl ? 'تحليلات قمع العملاء والحملات الإعلانية' : 'Inbound Lead Funnel & Campaign Analytics',
    funnelSub: isRtl
      ? 'توزيع العملاء المحتملين حسب قناة الاستقطاب وحالة المتابعة'
      : 'Real-time breakdown of prospect submissions across acquisition touchpoints',
    trackingTitle: isRtl ? 'حالة التتبع والبيكسل و Google Analytics' : 'Tracking, Pixels & Google Analytics Status',
    trackingSub: isRtl
      ? 'حالة الربط الحي مع Google Tag Manager و GA4 وأكواد البيكسل المخصصة'
      : 'Live status of Google Tag Manager, GA4, native ad pixels, and custom code snippets',
    configureTracking: isRtl ? 'إدارة البيكسل والأكواد ←' : 'Configure Pixels & Code →',
    openAnalytics: isRtl ? 'فتح تحليلات الحملات ←' : 'Open Campaign Analytics →',
    recentCandidates: isRtl ? 'أحدث طلبات التوظيف' : 'Recent Candidate Applications',
    candidatesSub: isRtl ? 'السير الذاتية الواردة للوظائف الشاغرة' : 'Incoming CV submissions for open requisitions',
    viewPipeline: isRtl ? 'عرض المسار الكامل ←' : 'View Pipeline →',
    noCandidates: isRtl ? 'لا توجد طلبات توظيف مسجلة حتى الآن.' : 'No recent applicants recorded.',
    recentInquiries: isRtl ? 'أحدث العملاء المحتملين والمواعيد' : 'Recent Inbound Leads & Bookings',
    inquiriesSub: isRtl ? 'استفسارات التواصل ومواعيد الجلسات وطلبات الاستكشاف' : 'Incoming inquiries, strategy appointments, and discovery requests',
    viewInquiries: isRtl ? 'عرض كافة العملاء ←' : 'View All Leads →',
    noInquiries: isRtl ? 'لا توجد طلبات جديدة مسجلة في هذا القسم.' : 'No submissions recorded in this channel yet.',
  };

  const metricTitles: Record<string, string> = {
    'total-leads': isRtl ? 'إجمالي العملاء المحتملين' : 'Total Inbound Leads',
    'active-projects': isRtl ? 'قصص العملاء والمشاريع' : 'Client Stories & Projects',
    'published-insights': isRtl ? 'المقالات والأبحاث' : 'Blogs & Insights',
    'client-reviews': isRtl ? 'تقييمات العملاء الموثقة' : 'Verified Reviews',
    'job-applicants': isRtl ? 'المتقدمين للوظائف' : 'Job Applicants',
  };

  const totalLeads = data?.counts?.totalLeads || 0;
  const contactCount = data?.counts?.inquiries || 0;
  const appointmentCount = data?.counts?.appointments || 0;
  const discoveryCount = data?.counts?.discoveryLeads || 0;

  const contactPct = totalLeads > 0 ? Math.round((contactCount / totalLeads) * 100) : 0;
  const appointmentPct = totalLeads > 0 ? Math.round((appointmentCount / totalLeads) * 100) : 0;
  const discoveryPct = totalLeads > 0 ? Math.round((discoveryCount / totalLeads) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#131722] to-[#0e0f12] p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-persici-crimson/20 border border-persici-crimson/30 text-persici-crimson text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-persici-crimson animate-pulse" />
              <span>{t.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {t.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.desc}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Link
                href={getHref(`/${lang}/dashboard/pages/home`)}
                className="px-4 py-2 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-persici-crimson/25"
              >
                {t.editHome}
              </Link>
              <Link
                href={getHref(`/${lang}/dashboard/content/insights`)}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors border border-white/10 flex items-center gap-1.5"
              >
                <TbArticle className="w-4 h-4 text-amber-400" />
                <span>{t.newPost}</span>
              </Link>
              <Link
                href={getHref(`/${lang}/dashboard/content/projects`)}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors border border-white/10 flex items-center gap-1.5"
              >
                <TbBuildingSkyscraper className="w-4 h-4 text-emerald-400" />
                <span>{t.newProject}</span>
              </Link>
              {canSeeHr && (
                <Link
                  href={getHref(`/${lang}/dashboard/careers/openings`)}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors border border-white/10 flex items-center gap-1.5"
                >
                  <TbBriefcase className="w-4 h-4 text-amber-300" />
                  <span>{t.newCareer}</span>
                </Link>
              )}
              {canSeeLeads && (
                <>
                  <Link
                    href={getHref(`/${lang}/dashboard/leads/contact`)}
                    className="px-3.5 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-xl text-xs font-semibold transition-colors border border-purple-400/30 flex items-center gap-1.5"
                  >
                    <TbTrendingUp className="w-4 h-4 text-purple-300" />
                    <span>
                      {t.viewLeads} ({totalLeads})
                    </span>
                  </Link>
                  <Link
                    href={getHref(`/${lang}/dashboard/leads/tracking`)}
                    className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-xl text-xs font-semibold transition-colors border border-emerald-400/30 flex items-center gap-1.5"
                  >
                    <TbCode className="w-4 h-4 text-emerald-300" />
                    <span>{t.trackingBtn}</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              onClick={fetchOverview}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 transition-colors cursor-pointer"
            >
              <TbRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{isRtl ? 'تحديث البيانات' : 'Refresh Stats'}</span>
            </button>
          </div>
        </div>

        {/* Decorative Radial Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-persici-crimson/10 to-transparent pointer-events-none opacity-40" />
      </div>

      {/* Primary KPI Metrics Row (All Clickable Links) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-5"
            />
          ))
        ) : (
          data?.metrics?.map((m) => (
            <Link
              key={m.key}
              href={getHref(m.href || '/dashboard')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-persici-crimson/50 transition-all space-y-2 group block"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-persici-crimson transition-colors">
                  {metricTitles[m.key] || m.title}
                </span>
                {m.change && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TbArrowUpRight className="w-3 h-3" />
                    <span>{m.change}</span>
                  </span>
                )}
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {m.value}
              </div>
              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-slate-400">{t.syncNotice}</p>
                <TbArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-persici-crimson transition-colors" />
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Live Analytics & Tracking Overview Row */}
      {canSeeLeads && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inbound Lead Funnel Card */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TbChartBar className="w-5 h-5 text-purple-600" />
                  <span>{t.funnelTitle}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{t.funnelSub}</p>
              </div>
              <Link
                href={getHref(`/${lang}/dashboard/leads/analytics`)}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline shrink-0"
              >
                {t.openAnalytics}
              </Link>
            </div>

            {/* 3 Channel Mini-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href={getHref(`/${lang}/dashboard/leads/contact`)}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-purple-50/60 border border-slate-200/80 hover:border-purple-300 transition-all group"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-700 group-hover:text-purple-700">
                    {isRtl ? 'استفسارات التواصل' : 'Contact Inquiries'}
                  </span>
                  <TbMessageDots className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">
                    {contactCount}
                  </span>
                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                    {contactPct}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all"
                    style={{ width: `${Math.max(contactPct, contactCount > 0 ? 12 : 0)}%` }}
                  />
                </div>
              </Link>

              <Link
                href={getHref(`/${lang}/dashboard/leads/appointments`)}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-700 group-hover:text-blue-700">
                    {isRtl ? 'مواعيد الاستراتيجية' : 'Strategy Bookings'}
                  </span>
                  <TbCalendarCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">
                    {appointmentCount}
                  </span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                    {appointmentPct}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${Math.max(appointmentPct, appointmentCount > 0 ? 12 : 0)}%` }}
                  />
                </div>
              </Link>

              <Link
                href={getHref(`/${lang}/dashboard/leads/discovery`)}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 transition-all group"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-700 group-hover:text-emerald-700">
                    {isRtl ? 'جلسات الاستكشاف' : 'Discovery Calls'}
                  </span>
                  <TbCompass className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">
                    {discoveryCount}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {discoveryPct}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{ width: `${Math.max(discoveryPct, discoveryCount > 0 ? 12 : 0)}%` }}
                  />
                </div>
              </Link>
            </div>

            {/* Lead Action Summary Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-600 bg-slate-50/80 px-4 py-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-4">
                <span>
                  {isRtl ? 'بانتظار المتابعة:' : 'Awaiting Action:'}{' '}
                  <strong className="text-amber-600 font-mono">
                    {data?.leadFunnel?.unreadOrPending || 0}
                  </strong>
                </span>
                <span>
                  {isRtl ? 'تمت المتابعة / مؤهل:' : 'Processed / Qualified:'}{' '}
                  <strong className="text-emerald-600 font-mono">
                    {data?.leadFunnel?.contactedOrConfirmed || 0}
                  </strong>
                </span>
              </div>
              <Link
                href={getHref(`/${lang}/dashboard/leads/contact`)}
                className="font-semibold text-slate-900 hover:text-persici-crimson transition-colors"
              >
                {isRtl ? 'فتح نظام إدارة العملاء ←' : 'Open Leads CRM →'}
              </Link>
            </div>
          </div>

          {/* Tracking, Pixels, GTM & GA4 Status Card */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <TbPlugConnected className="w-5 h-5 text-persici-crimson" />
                    <span>{t.trackingTitle}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{t.trackingSub}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* GTM Row */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">Google Tag Manager (GTM)</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {data?.trackingSummary?.gtmContainerId ||
                        (isRtl ? 'غير مربوط بعد' : 'Not linked yet')}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      data?.trackingSummary?.gtmActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {data?.trackingSummary?.gtmActive
                      ? isRtl
                        ? 'مفعل'
                        : 'Active'
                      : isRtl
                        ? 'متوقف'
                        : 'Inactive'}
                  </span>
                </div>

                {/* GA4 Row */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">Google Analytics 4 (GA4)</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {data?.trackingSummary?.ga4MeasurementId ||
                        (isRtl ? 'جاهز للربط السريع' : 'Ready for 1-click toggle')}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      data?.trackingSummary?.ga4Active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {data?.trackingSummary?.ga4Active
                      ? isRtl
                        ? 'مفعل'
                        : 'Active'
                      : isRtl
                        ? 'متوقف'
                        : 'Inactive'}
                  </span>
                </div>

                {/* Ad Pixels & Custom Snippets Row */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                      {isRtl ? 'البيكسل النشطة' : 'Active Ad Pixels'}
                    </span>
                    <span className="text-lg font-extrabold text-slate-900 font-mono">
                      {data?.trackingSummary?.activePixelsCount || 0}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {data?.trackingSummary?.activePixels?.join(', ') ||
                        (isRtl ? 'Meta, TikTok, Snap...' : 'Meta, TikTok, Snap...')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                      {isRtl ? 'أكواد مخصصة (Snippets)' : 'Custom Snippets'}
                    </span>
                    <span className="text-lg font-extrabold text-slate-900 font-mono">
                      {data?.trackingSummary?.activeSnippetsCount || 0}
                      <span className="text-xs font-normal text-slate-400">
                        /{data?.trackingSummary?.totalSnippetsCount || 0}
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {isRtl ? 'Head / Body / Footer' : 'Head / Body / Footer'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={getHref(`/${lang}/dashboard/leads/tracking`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-persici-crimson text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <TbCode className="w-4 h-4" />
                <span>{t.configureTracking}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Administrative Quick Launchpad Grid (All Links Preserving Passkey) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">{t.launchpad}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <Link
            href={getHref(`/${lang}/dashboard/pages/home`)}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-persici-crimson hover:shadow-md transition-all text-center space-y-1.5 group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-red-50 text-persici-crimson flex items-center justify-center group-hover:scale-110 transition-transform">
              <TbFiles className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 truncate">{t.cmsCard}</p>
            <p className="text-[10px] text-slate-400 truncate">{t.cmsSub}</p>
          </Link>

          <Link
            href={getHref(`/${lang}/dashboard/content/insights`)}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all text-center space-y-1.5 group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TbArticle className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 truncate">{t.postsCard}</p>
            <p className="text-[10px] text-slate-400 truncate">{t.postsSub}</p>
          </Link>

          <Link
            href={getHref(`/${lang}/dashboard/content/projects`)}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-center space-y-1.5 group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TbBuildingSkyscraper className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 truncate">{t.casesCard}</p>
            <p className="text-[10px] text-slate-400 truncate">{t.casesSub}</p>
          </Link>

          <Link
            href={getHref(`/${lang}/dashboard/content/reviews`)}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all text-center space-y-1.5 group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TbStar className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 truncate">{t.reviewsCard}</p>
            <p className="text-[10px] text-slate-400 truncate">{t.reviewsSub}</p>
          </Link>

          <Link
            href={getHref(`/${lang}/dashboard/media`)}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center space-y-1.5 group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TbPhoto className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 truncate">{t.mediaCard}</p>
            <p className="text-[10px] text-slate-400 truncate">{t.mediaSub}</p>
          </Link>

          {canSeeLeads && (
            <>
              <Link
                href={getHref(`/${lang}/dashboard/leads/contact`)}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all text-center space-y-1.5 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TbTrendingUp className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">{t.leadsCard}</p>
                <p className="text-[10px] text-slate-400 truncate">{t.leadsSub}</p>
              </Link>

              <Link
                href={getHref(`/${lang}/dashboard/leads/analytics`)}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-center space-y-1.5 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TbChartBar className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">{t.analyticsCard}</p>
                <p className="text-[10px] text-slate-400 truncate">{t.analyticsSub}</p>
              </Link>

              <Link
                href={getHref(`/${lang}/dashboard/leads/tracking`)}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all text-center space-y-1.5 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TbCode className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">{t.pixelsCard}</p>
                <p className="text-[10px] text-slate-400 truncate">{t.pixelsSub}</p>
              </Link>
            </>
          )}

          {canSeeHr && (
            <>
              <Link
                href={getHref(`/${lang}/dashboard/careers/openings`)}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-600 hover:shadow-md transition-all text-center space-y-1.5 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TbBriefcase className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">{t.careersCard}</p>
                <p className="text-[10px] text-slate-400 truncate">{t.careersSub}</p>
              </Link>

              <Link
                href={getHref(`/${lang}/dashboard/careers/applicants`)}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all text-center space-y-1.5 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TbUserCheck className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">{t.atsCard}</p>
                <p className="text-[10px] text-slate-400 truncate">{t.atsSub}</p>
              </Link>
            </>
          )}

          {['admin', 'editor'].includes(role) && (
            <Link
              href={getHref(`/${lang}/dashboard/maintenance`)}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-persici-crimson hover:shadow-md transition-all text-center space-y-1.5 group"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-red-50 text-persici-crimson flex items-center justify-center group-hover:scale-110 transition-transform">
                <TbTool className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">{t.maintCard}</p>
              <p className="text-[10px] text-slate-400 truncate">{t.maintSub}</p>
            </Link>
          )}

          {role === 'admin' && (
            <Link
              href={getHref(`/${lang}/dashboard/users`)}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-800 hover:shadow-md transition-all text-center space-y-1.5 group"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TbUsers className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">{t.teamCard}</p>
              <p className="text-[10px] text-slate-400 truncate">{t.teamSub}</p>
            </Link>
          )}
        </div>
      </div>

      {/* Role-Specific Activity Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Inbound Leads & Bookings (Tabbed: Contact / Appointments / Discovery) */}
        {canSeeLeads && (
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t.recentInquiries}</h3>
                <p className="text-xs text-slate-500">{t.inquiriesSub}</p>
              </div>
              <Link
                href={getHref(
                  leadTab === 'appointments'
                    ? `/${lang}/dashboard/leads/appointments`
                    : leadTab === 'discovery'
                      ? `/${lang}/dashboard/leads/discovery`
                      : `/${lang}/dashboard/leads/contact`
                )}
                className="text-xs font-semibold text-purple-600 hover:underline shrink-0"
              >
                {t.viewInquiries}
              </Link>
            </div>

            {/* Channel Switcher Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setLeadTab('inquiries')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  leadTab === 'inquiries'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isRtl ? 'التواصل' : 'Inquiries'} ({contactCount})
              </button>
              <button
                type="button"
                onClick={() => setLeadTab('appointments')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  leadTab === 'appointments'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isRtl ? 'المواعيد' : 'Appointments'} ({appointmentCount})
              </button>
              <button
                type="button"
                onClick={() => setLeadTab('discovery')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  leadTab === 'discovery'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isRtl ? 'الاستكشاف' : 'Discovery'} ({discoveryCount})
              </button>
            </div>

            {leadTab === 'inquiries' && (
              <>
                {data?.recentInquiries && data.recentInquiries.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {data.recentInquiries.map((inq) => (
                      <Link
                        key={inq.id}
                        href={getHref(`/${lang}/dashboard/leads/contact`)}
                        className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {inq.name}{' '}
                            {inq.company && (
                              <span className="font-normal text-slate-400">
                                • {inq.company}
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {inq.email} {inq.country ? `(${inq.country})` : ''}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 shrink-0 ms-2">
                          {inq.reason || 'Inquiry'}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">{t.noInquiries}</p>
                )}
              </>
            )}

            {leadTab === 'appointments' && (
              <>
                {data?.recentAppointments && data.recentAppointments.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {data.recentAppointments.map((apt) => (
                      <Link
                        key={apt.id}
                        href={getHref(`/${lang}/dashboard/leads/appointments`)}
                        className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {apt.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {apt.email} {apt.website ? `• ${apt.website}` : ''}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0 ms-2">
                          {apt.selectedDate} {apt.selectedTime ? `• ${apt.selectedTime}` : ''}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">{t.noInquiries}</p>
                )}
              </>
            )}

            {leadTab === 'discovery' && (
              <>
                {data?.recentLeads && data.recentLeads.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {data.recentLeads.map((lead) => (
                      <Link
                        key={lead.id}
                        href={getHref(`/${lang}/dashboard/leads/discovery`)}
                        className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {lead.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {lead.email} {lead.website ? `• ${lead.website}` : ''}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 ms-2">
                          {lead.revenue || 'Discovery'}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">{t.noInquiries}</p>
                )}
              </>
            )}
          </div>
        )}

        {/* Recent Candidate Applications */}
        {canSeeHr && (
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t.recentCandidates}</h3>
                <p className="text-xs text-slate-500">{t.candidatesSub}</p>
              </div>
              <Link
                href={getHref(`/${lang}/dashboard/careers/applicants`)}
                className="text-xs font-semibold text-persici-crimson hover:underline"
              >
                {t.viewPipeline}
              </Link>
            </div>

            {data?.recentApplicants && data.recentApplicants.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {data.recentApplicants.map((app) => (
                  <Link
                    key={app.id}
                    href={getHref(`/${lang}/dashboard/careers/applicants`)}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{app.name}</p>
                      <p className="text-[11px] text-slate-400">{app.roleTitle}</p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      {app.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">{t.noCandidates}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardOverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 max-w-7xl mx-auto">
          <div className="h-48 rounded-3xl bg-slate-900 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-5"
              />
            ))}
          </div>
        </div>
      }
    >
      <DashboardOverviewInner />
    </Suspense>
  );
}
