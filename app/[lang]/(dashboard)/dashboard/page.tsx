'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  TbLayoutDashboard,
  TbTrendingUp,
  TbFiles,
  TbUserCheck,
  TbPhoto,
  TbUsers,
  TbArrowUpRight,
  TbClock,
  TbMail,
  TbFileText,
  TbCalendar,
  TbSparkles,
  TbRefresh,
  TbBuildingSkyscraper,
  TbCheck,
  TbArticle,
  TbBriefcase,
  TbPlus,
} from 'react-icons/tb';

interface MetricItem {
  key: string;
  title: string;
  value: number | string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
}

interface OverviewData {
  success: boolean;
  connected: boolean;
  userRole: string;
  metrics: MetricItem[];
  counts: {
    projects: number;
    services: number;
    inquiries: number;
    discoveryLeads: number;
    media: number;
    applicants: number;
  };
  recentInquiries?: Array<{ id: string; name: string; email: string; service?: string; createdAt: string }>;
  recentLeads?: Array<{ id: string; name: string; email: string; budgetTier?: string; createdAt: string }>;
  recentApplicants?: Array<{ id: string; name: string; email: string; roleTitle: string; status: string; createdAt: string }>;
}

export default function DashboardOverviewPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

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
    fetchOverview();
  }, []);

  const role = data?.userRole || 'editor';

  // Localization Dictionary for Overview Page
  const t = {
    badge: isRtl ? 'مركز قيادة بيرسيشي الاستراتيجي' : 'Persici Strategic Command',
    title: isRtl ? 'مركز التحكم المؤسسي' : 'Enterprise Control Center',
    desc: isRtl
      ? 'أهلاً بك في المنظومة الإدارية المتكاملة لوكالة بيرسيشي. يمكنك تعديل محتوى الموقع بالكامل لحظياً، وإدارة مسار التوظيف واستقبال السير الذاتية، وإدارة مكتبة الوسائط عبر Cloudflare R2، ومتابعة استفسارات العملاء المؤسسيين.'
      : 'Welcome to the Persici Agency administrative ecosystem. Edit 100% of website content in real time, review candidate ATS applications, manage media on Cloudflare R2, and analyze qualified enterprise leads.',
    editHome: isRtl ? 'تعديل الصفحة الرئيسية' : 'Edit Home Page',
    reviewApplicants: isRtl ? 'مراجعة المتقدمين' : 'Review Applicants',
    viewLeads: isRtl ? 'عرض العملاء المحتملين' : 'View Leads',
    syncNotice: isRtl ? 'متزامن مع سحابة Atlas' : 'Synchronized with Atlas Cloud',
    launchpad: isRtl ? 'منصة الإطلاق الإدارية' : 'Administrative Launchpad',
    cmsCard: isRtl ? 'إدارة صفحات الموقع' : 'Home Page CMS',
    cmsSub: isRtl ? 'تعديل الهيرو والأقسام' : 'Edit hero & sections',
    mediaCard: isRtl ? 'وسائط R2' : 'R2 Media',
    mediaSub: isRtl ? 'ضغط وتحسين WebP' : 'WebP compression',
    atsCard: isRtl ? 'نظام التوظيف' : 'Careers ATS',
    atsSub: isRtl ? 'السير الذاتية والمراسلات' : 'CVs & candidate mail',
    leadsCard: isRtl ? 'العملاء الواردون' : 'Inbound Leads',
    leadsSub: isRtl ? 'تأهيل الاستفسارات' : 'Prospect qualification',
    casesCard: isRtl ? 'معرض الأعمال والمشاريع' : 'Portfolio & Work',
    casesSub: isRtl ? 'إدارة دراسات الحالة' : 'Portfolio & case studies',
    postsCard: isRtl ? 'المقالات والمدونة' : 'Blog Posts & Insights',
    postsSub: isRtl ? 'كتابة ونشر المقالات' : 'Draft & publish articles',
    careersCard: isRtl ? 'نشر الوظائف الشاغرة' : 'Publish Careers',
    careersSub: isRtl ? 'إدارة وإضافة شواغر' : 'Active roles & requisitions',
    teamCard: isRtl ? 'صلاحيات الفريق' : 'Team RBAC',
    teamSub: isRtl ? 'إدارة الأدوار والمستخدمين' : 'Roles & permissions',
    newPost: isRtl ? '+ كتابة مقال جديد' : '+ Write New Post',
    newProject: isRtl ? '+ إضافة دراسة حالة' : '+ Add Portfolio Project',
    newCareer: isRtl ? '+ نشر وظيفة جديدة' : '+ Publish Career',
    recentCandidates: isRtl ? 'أحدث طلبات التوظيف' : 'Recent Candidate Applications',
    candidatesSub: isRtl ? 'السير الذاتية الواردة للوظائف الشاغرة' : 'Incoming CV submissions for open requisitions',
    viewPipeline: isRtl ? 'عرض المسار الكامل ←' : 'View Pipeline →',
    noCandidates: isRtl ? 'لا توجد طلبات توظيف جديدة مسجلة.' : 'No recent applicants recorded.',
    recentInquiries: isRtl ? 'أحدث الاستفسارات الواردة' : 'Recent Inbound Inquiries',
    inquiriesSub: isRtl ? 'استفسارات ومشاريع من عملاء مؤسسيين محتملين' : 'Inbound requests from prospective enterprise clients',
    viewInquiries: isRtl ? 'عرض الاستفسارات ←' : 'View Inquiries →',
    noInquiries: isRtl ? 'لا توجد استفسارات جديدة مسجلة.' : 'No recent inquiries recorded.',
  };

  const metricTitles: Record<string, string> = {
    'active-projects': isRtl ? 'المشاريع النشطة' : 'Active Projects',
    'growth-services': isRtl ? 'الخدمات النشطة' : 'Active Services',
    'discovery-leads': isRtl ? 'جلسات الاستكشاف' : 'Discovery Leads',
    inquiries: isRtl ? 'إجمالي الاستفسارات' : 'Total Inquiries',
    'job-applicants': isRtl ? 'طلبات التوظيف' : 'Job Applicants',
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#131722] to-[#0e0f12] p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="relative z-10 max-w-2xl space-y-3">
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
              href={`/${lang}/dashboard/pages/home`}
              className="px-4 py-2 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-persici-crimson/25"
            >
              {t.editHome}
            </Link>
            <Link
              href={`/${lang}/dashboard/content/insights`}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors border border-white/10 flex items-center gap-1.5"
            >
              <TbArticle className="w-4 h-4 text-amber-400" />
              <span>{t.newPost}</span>
            </Link>
            <Link
              href={`/${lang}/dashboard/content/projects`}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors border border-white/10 flex items-center gap-1.5"
            >
              <TbBuildingSkyscraper className="w-4 h-4 text-emerald-400" />
              <span>{t.newProject}</span>
            </Link>
            {['admin', 'hr'].includes(role) && (
              <Link
                href={`/${lang}/dashboard/careers/openings`}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors border border-white/10 flex items-center gap-1.5"
              >
                <TbBriefcase className="w-4 h-4 text-amber-300" />
                <span>{t.newCareer}</span>
              </Link>
            )}
            {['admin', 'media buying'].includes(role) && (
              <Link
                href={`/${lang}/dashboard/leads/contact`}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors border border-white/10"
              >
                {t.viewLeads} ({data?.counts?.inquiries || 0})
              </Link>
            )}
          </div>
        </div>

        {/* Decorative Radial Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-persici-crimson/10 to-transparent pointer-events-none opacity-40" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse p-5" />
          ))
        ) : (
          data?.metrics?.map((m) => (
            <div
              key={m.key}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {metricTitles[m.key] || m.title}
                </span>
                {m.change && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                    <TbArrowUpRight className="w-3.5 h-3.5" />
                    <span>{m.change}</span>
                  </span>
                )}
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{m.value}</div>
              <p className="text-[11px] text-slate-400">{t.syncNotice}</p>
            </div>
          ))
        )}
      </div>

      {/* Quick Launchpad Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">{t.launchpad}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <Link
            href={`/${lang}/dashboard/pages/home`}
            className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-persici-crimson hover:shadow-md transition-all text-center space-y-1.5 group"
          >
            <div className="w-9 h-9 mx-auto rounded-xl bg-red-50 text-persici-crimson flex items-center justify-center group-hover:scale-110 transition-transform">
              <TbFiles className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 truncate">{t.cmsCard}</p>
            <p className="text-[10px] text-slate-400 truncate">{t.cmsSub}</p>
          </Link>

          <Link
            href={`/${lang}/dashboard/content/insights`}
            className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all text-center space-y-1.5 group"
          >
            <div className="w-9 h-9 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TbArticle className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 truncate">{t.postsCard}</p>
            <p className="text-[10px] text-slate-400 truncate">{t.postsSub}</p>
          </Link>

          <Link
            href={`/${lang}/dashboard/content/projects`}
            className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-center space-y-1.5 group"
          >
            <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TbBuildingSkyscraper className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 truncate">{t.casesCard}</p>
            <p className="text-[10px] text-slate-400 truncate">{t.casesSub}</p>
          </Link>

          <Link
            href={`/${lang}/dashboard/careers/openings`}
            className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-amber-600 hover:shadow-md transition-all text-center space-y-1.5 group"
          >
            <div className="w-9 h-9 mx-auto rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TbBriefcase className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 truncate">{t.careersCard}</p>
            <p className="text-[10px] text-slate-400 truncate">{t.careersSub}</p>
          </Link>

          <Link
            href={`/${lang}/dashboard/media`}
            className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-persici-crimson hover:shadow-md transition-all text-center space-y-1.5 group"
          >
            <div className="w-9 h-9 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TbPhoto className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900 truncate">{t.mediaCard}</p>
            <p className="text-[10px] text-slate-400 truncate">{t.mediaSub}</p>
          </Link>

          {['admin', 'hr'].includes(role) && (
            <Link
              href={`/${lang}/dashboard/careers/applicants`}
              className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all text-center space-y-1.5 group"
            >
              <div className="w-9 h-9 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TbUserCheck className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">{t.atsCard}</p>
              <p className="text-[10px] text-slate-400 truncate">{t.atsSub}</p>
            </Link>
          )}

          {['admin', 'media buying'].includes(role) && (
            <Link
              href={`/${lang}/dashboard/leads/contact`}
              className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all text-center space-y-1.5 group"
            >
              <div className="w-9 h-9 mx-auto rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TbTrendingUp className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">{t.leadsCard}</p>
              <p className="text-[10px] text-slate-400 truncate">{t.leadsSub}</p>
            </Link>
          )}

          {role === 'admin' && (
            <Link
              href={`/${lang}/dashboard/users`}
              className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-slate-800 hover:shadow-md transition-all text-center space-y-1.5 group"
            >
              <div className="w-9 h-9 mx-auto rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
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
        {/* Recent Applicants */}
        {['admin', 'hr'].includes(role) && (
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t.recentCandidates}</h3>
                <p className="text-xs text-slate-500">{t.candidatesSub}</p>
              </div>
              <Link
                href={`/${lang}/dashboard/careers/applicants`}
                className="text-xs font-semibold text-persici-crimson hover:underline"
              >
                {t.viewPipeline}
              </Link>
            </div>

            {data?.recentApplicants && data.recentApplicants.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {data.recentApplicants.map((app) => (
                  <div key={app.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{app.name}</p>
                      <p className="text-[11px] text-slate-400">{app.roleTitle}</p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">{t.noCandidates}</p>
            )}
          </div>
        )}

        {/* Recent Inquiries */}
        {['admin', 'media buying'].includes(role) && (
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t.recentInquiries}</h3>
                <p className="text-xs text-slate-500">{t.inquiriesSub}</p>
              </div>
              <Link
                href={`/${lang}/dashboard/leads/contact`}
                className="text-xs font-semibold text-purple-600 hover:underline"
              >
                {t.viewInquiries}
              </Link>
            </div>

            {data?.recentInquiries && data.recentInquiries.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {data.recentInquiries.map((inq) => (
                  <div key={inq.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{inq.name}</p>
                      <p className="text-[11px] text-slate-400">{inq.email}</p>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                      {inq.service || 'Inquiry'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">{t.noInquiries}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
