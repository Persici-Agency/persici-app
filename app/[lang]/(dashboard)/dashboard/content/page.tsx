'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  TbArticle,
  TbBriefcase,
  TbStar,
  TbPhoto,
  TbBuildingCommunity,
  TbArrowUpRight,
  TbPlus,
  TbSparkles,
} from 'react-icons/tb';

export default function ContentHubPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  const sections = [
    {
      title: isRtl ? 'المقالات والمدونة (Blog Posts & Insights)' : 'Blog Posts & Insights Articles',
      desc: isRtl
        ? 'إنشاء ونشر المقالات الفكرية والتقنية وتوليد الملخصات بالذكاء الاصطناعي على موقع بيرسيشي.'
        : 'Publish thought leadership publications, technical whitepapers, and manage AI overviews on the live site.',
      icon: TbArticle,
      color: 'bg-persici-crimson text-white',
      accentBorder: 'border-persici-crimson/20 hover:border-persici-crimson',
      badge: isRtl ? 'محتوى المدونة' : 'Blog System',
      href: `/${lang}/dashboard/content/insights`,
      liveHref: `/${lang}/insights`,
      ctaLabel: isRtl ? 'إدارة ونشر المقالات' : 'Manage Articles & Posts',
      newLabel: isRtl ? 'نشر مقال جديد' : 'New Article',
    },
    {
      title: isRtl ? 'معرض الأعمال والمشاريع (Portfolio & Projects)' : 'Portfolio & Client Stories',
      desc: isRtl
        ? 'توثيق ونشر دراسات الحالة، والفيديوهات الترويجية، ومقاييس الأداء لشركاء النجاح والعملاء.'
        : 'Publish enterprise case studies, marketing video showcases, metrics, and client deliverables.',
      icon: TbBriefcase,
      color: 'bg-amber-600 text-white',
      accentBorder: 'border-amber-500/20 hover:border-amber-500',
      badge: isRtl ? 'معرض الأعمال' : 'Portfolio Hub',
      href: `/${lang}/dashboard/content/projects`,
      liveHref: `/${lang}/client-stories`,
      ctaLabel: isRtl ? 'إدارة معرض الأعمال' : 'Manage Portfolio Projects',
      newLabel: isRtl ? 'إضافة مشروع جديد' : 'New Project',
    },
    {
      title: isRtl ? 'شهادات وتقييمات العملاء (Reviews & Social Proof)' : 'Client Reviews & Social Proof',
      desc: isRtl
        ? 'إدارة تقييمات العملاء، وآراء الشركاء، وتقييم 4.9/5 الذي يظهر في مختلف صفحات الموقع.'
        : 'Curate verified customer testimonials, executive quotes, and verified enterprise trust ratings.',
      icon: TbStar,
      color: 'bg-emerald-600 text-white',
      accentBorder: 'border-emerald-500/20 hover:border-emerald-500',
      badge: isRtl ? 'جدار التقييمات' : 'Social Proof',
      href: `/${lang}/dashboard/content/reviews`,
      liveHref: `/${lang}#reviews`,
      ctaLabel: isRtl ? 'إدارة التقييمات' : 'Manage Reviews Wall',
    },
    {
      title: isRtl ? 'مكتبة الوسائط السحابية (Media Library & R2)' : 'Cloudflare R2 Media Library',
      desc: isRtl
        ? 'رفع وإدارة الصور، وفيديوهات العملاء بجودة عالية، وتوليد الصور المصغرة للمقالات والمشاريع.'
        : 'High-speed object storage for video reels, high-resolution photography, client logos, and posters.',
      icon: TbPhoto,
      color: 'bg-blue-600 text-white',
      accentBorder: 'border-blue-500/20 hover:border-blue-500',
      badge: isRtl ? 'التخزين السحابي' : 'Storage Engine',
      href: `/${lang}/dashboard/media`,
      liveHref: null,
      ctaLabel: isRtl ? 'فتح مكتبة الوسائط' : 'Open Media Library',
    },
    {
      title: isRtl ? 'الوظائف ونظام التوظيف (Career Postings & ATS)' : 'Careers & Talent Acquisition',
      desc: isRtl
        ? 'نشر فرص العمل وتعيين المتطلبات بدقة متوافقة مع صفحة تفاصيل الوظيفة ومتابعة المتقدمين.'
        : 'Publish career openings with full specification, manage applicants, and communicate with talent.',
      icon: TbBuildingCommunity,
      color: 'bg-purple-600 text-white',
      accentBorder: 'border-purple-500/20 hover:border-purple-500',
      badge: isRtl ? 'التوظيف' : 'Careers Portal',
      href: `/${lang}/dashboard/careers/openings`,
      liveHref: `/${lang}/careers`,
      ctaLabel: isRtl ? 'إدارة ونشر الوظائف' : 'Manage Career Postings',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-persici-crimson mb-1">
            <TbSparkles className="w-4 h-4" />
            <span>{isRtl ? 'مركز إدارة المحتوى والنشر' : 'Editorial & Content Hub'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {isRtl ? 'المقالات، المشاريع، والوسائط' : 'Content, Portfolio & Media Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {isRtl
              ? 'الوصول المباشر لإضافة وتعديل مقالات المدونة (Articles)، معرض الأعمال والمشاريع (Projects & Portfolio)، التقييمات، ومكتبة الوسائط.'
              : 'Direct navigation to create, publish, and edit Blog Posts & Insights, Case Studies & Portfolio, Testimonials, and R2 Media.'}
          </p>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-3xl border ${sec.accentBorder} p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${sec.color} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {sec.badge}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-persici-crimson transition-colors">
                    {sec.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {sec.desc}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                <Link
                  href={sec.href}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>{sec.ctaLabel}</span>
                  <TbArrowUpRight className="w-4 h-4" />
                </Link>

                {sec.liveHref && (
                  <a
                    href={sec.liveHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-persici-crimson transition-colors"
                  >
                    <span>{isRtl ? 'معاينة الموقع' : 'View Live'}</span>
                    <TbArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
