'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../logo';
import type { DashboardSidebarProps } from '../../types';
import {
  TbLayoutDashboard,
  TbFiles,
  TbChevronDown,
  TbChevronRight,
  TbChevronLeft,
  TbPhoto,
  TbUsers,
  TbSettings,
  TbTrendingUp,
  TbRoute,
  TbArticle,
  TbUserCheck,
  TbBulb,
  TbBuildingFactory2,
  TbTransform,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarRightExpand,
} from 'react-icons/tb';

export function DashboardSidebar({ lang, user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const role = user?.role || 'editor';
  const isRtl = lang === 'ar';

  // Collapse state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('persici_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch {
      // Ignore in restricted environments
    }

    // Keyboard shortcut: Ctrl + B / Cmd + B
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsCollapsed((prev) => {
          const next = !prev;
          try {
            localStorage.setItem('persici_sidebar_collapsed', String(next));
          } catch {}
          return next;
        });
      }
    };

    // Custom event from header toggle button
    const handleCustomToggle = () => {
      setIsCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('persici_sidebar_collapsed', String(next));
        } catch {}
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-persici-sidebar', handleCustomToggle);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-persici-sidebar', handleCustomToggle);
    };
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('persici_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Accordion open/close state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    pages: true,
    solutions: false,
    industries: false,
    howWeDoIt: false,
    navigation: false,
    careers: true,
    leads: true,
    content: true,
  });

  const toggleSection = (key: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      try {
        localStorage.setItem('persici_sidebar_collapsed', 'false');
      } catch {}
    }
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (href: string) =>
    pathname === `/${lang}${href}` || pathname.startsWith(`/${lang}${href}/`);

  // Permission guards
  const canSeePages = ['admin', 'editor'].includes(role);
  const canSeeNav = ['admin', 'editor'].includes(role);
  const canSeeMedia = ['admin', 'editor', 'author', 'media buying', 'hr'].includes(role);
  const canSeeCareersAts = ['admin', 'hr'].includes(role);
  const canSeeLeads = ['admin', 'media buying'].includes(role);
  const canSeeContent = ['admin', 'editor', 'author'].includes(role);
  const canSeeUsers = role === 'admin';
  const canSeeSettings = role === 'admin';

  // Comprehensive Bilingual Dictionary for Sidebar
  const t = {
    overview: isRtl ? 'نظرة عامة' : 'Overview',
    pagesSection: isRtl ? 'إدارة صفحات الموقع' : 'Site Pages CMS',
    home: isRtl ? 'الصفحة الرئيسية' : 'Home Page',
    about: isRtl ? 'من نحن' : 'About Us',
    contact: isRtl ? 'اتصل بنا' : 'Contact Us',
    clientStories: isRtl ? 'قصص النجاح' : 'Client Stories Hub',
    careersPage: isRtl ? 'صفحة الوظائف' : 'Careers Page',
    solutions: isRtl ? 'الحلول (10)' : 'Solutions (10)',
    solutionsHub: isRtl ? 'الرئيسية للحلول' : 'Overview Hub',
    aiIntegration: isRtl ? 'تكامل الذكاء الاصطناعي' : 'AI Integration',
    appManagement: isRtl ? 'إدارة التطبيقات' : 'Application Mgmt',
    digitalEngineering: isRtl ? 'الهندسة الرقمية' : 'Digital Engineering',
    uxDesign: isRtl ? 'تصميم تجربة المستخدم' : 'UX & Product Design',
    ecommerce: isRtl ? 'نمو التجارة الإلكترونية' : 'eCommerce Growth',
    marketingComms: isRtl ? 'الاتصالات التسويقية' : 'Marketing Comms',
    customerEngagement: isRtl ? 'تفاعل العملاء' : 'Customer Engagement',
    crmManagement: isRtl ? 'إدارة علاقات العملاء' : 'CRM Management',
    supplyChain: isRtl ? 'سلاسل الإمداد' : 'Supply Chain',
    industries: isRtl ? 'القطاعات والصناعات (7)' : 'Industries (7)',
    industriesHub: isRtl ? 'الرئيسية للقطاعات' : 'Overview Hub',
    consumerProducts: isRtl ? 'المنتجات الاستهلاكية' : 'Consumer Products',
    energyCommodities: isRtl ? 'الطاقة والسلع' : 'Energy & Commodities',
    health: isRtl ? 'الرعاية الصحية' : 'Healthcare',
    publicSector: isRtl ? 'القطاع العام والدفاع' : 'Public Sector & Defense',
    financialServices: isRtl ? 'الخدمات المالية' : 'Financial Services',
    techMedia: isRtl ? 'التكنولوجيا والإعلام' : 'Technology & Media',
    howWeDoIt: isRtl ? 'كيف نعمل (6)' : 'How We Do It (6)',
    howWeDoItHub: isRtl ? 'الرئيسية لمنهجيتنا' : 'Overview Hub',
    framework: isRtl ? 'إطار التحول الرقمي' : 'Transformation Framework',
    engineering: isRtl ? 'الهندسة والتقنية' : 'Engineering & Tech',
    experience: isRtl ? 'تحول التجربة الرقمية' : 'Experience Transformation',
    productMgmt: isRtl ? 'إدارة المنتجات' : 'Product Management',
    strategyConsulting: isRtl ? 'الاستراتيجية والاستشارات' : 'Strategy & Consulting',
    navigation: isRtl ? 'القوائم والتذييل' : 'Nav & Footer',
    headerBuilder: isRtl ? 'مُنشئ القائمة العلوية' : 'Header Menu Builder',
    footerBuilder: isRtl ? 'مُنشئ تذييل الموقع' : 'Footer Columns Builder',
    media: isRtl ? 'مكتبة الوسائط (R2)' : 'Media Library (R2)',
    careersAts: isRtl ? 'نظام التوظيف ATS' : 'Careers ATS (HR)',
    candidatePipeline: isRtl ? 'طلبات التوظيف والمتقدمين' : 'Candidate Pipeline',
    activeOpenings: isRtl ? 'الوظائف الشاغرة النشطة' : 'Active Job Postings',
    dispatchedEmails: isRtl ? 'سجل المراسلات الإلكترونية' : 'Dispatched HR Emails',
    leads: isRtl ? 'العملاء المحتملين والإعلانات' : 'Leads & Media Buying',
    contactInquiries: isRtl ? 'استفسارات التواصل' : 'Contact Inquiries',
    appointments: isRtl ? 'مواعيد الجلسات الاستراتيجية' : 'Strategy Appointments',
    discovery: isRtl ? 'جلسات الاستكشاف المؤسسي' : 'Discovery Calls',
    campaignAnalytics: isRtl ? 'تحليلات أداء الحملات' : 'Campaign Analytics',
    editorial: isRtl ? 'المقالات ومعرض الأعمال' : 'Blog & Portfolio',
    insights: isRtl ? 'المقالات والمدونة (Blog Posts)' : 'Blog Posts & Insights',
    projects: isRtl ? 'معرض الأعمال والمشاريع (Portfolio)' : 'Portfolio Case Studies',
    reviews: isRtl ? 'جدار التقييمات والشهادات' : 'Reviews & Testimonials',
    users: isRtl ? 'فريق العمل وصلاحيات RBAC' : 'Team & RBAC Users',
    settings: isRtl ? 'إعدادات النظام والأمان' : 'System Settings',
    collapseBtn: isRtl ? 'طي الشريط الجانبي (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)',
    expandBtn: isRtl ? 'توسيع الشريط الجانبي (Ctrl+B)' : 'Expand Sidebar (Ctrl+B)',
  };

  const roleBadgeText: Record<string, string> = {
    admin: isRtl ? 'مدير' : 'admin',
    editor: isRtl ? 'محرر' : 'editor',
    author: isRtl ? 'كاتب' : 'author',
    'media buying': isRtl ? 'إعلانات' : 'media buying',
    hr: isRtl ? 'توظيف' : 'hr',
  };

  // Tooltip positioning helper for collapsed mode
  const tooltipClass = isRtl
    ? 'absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1a1b20] text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-white/10'
    : 'absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1a1b20] text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-white/10';

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } border-e border-white/10 bg-[#0e0f12] text-white flex flex-col h-screen sticky top-0 shrink-0 select-none transition-all duration-300 ease-in-out z-40`}
    >
      {/* Brand & Collapse Header */}
      <div className="h-20 flex items-center justify-between px-4 sm:px-5 border-b border-white/10 shrink-0">
        {!isCollapsed ? (
          <>
            <Logo lang={lang} variant="light" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                {roleBadgeText[role] || role}
              </span>
              <button
                type="button"
                onClick={toggleCollapse}
                className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={t.collapseBtn}
              >
                {isRtl ? (
                  <TbLayoutSidebarRightCollapse className="w-5 h-5" />
                ) : (
                  <TbLayoutSidebarLeftCollapse className="w-5 h-5" />
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={toggleCollapse}
              className="p-2 text-persici-crimson hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title={t.expandBtn}
            >
              {isRtl ? (
                <TbLayoutSidebarRightExpand className="w-6 h-6" />
              ) : (
                <TbLayoutSidebarLeftExpand className="w-6 h-6" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        {/* 1. Overview */}
        <div className="relative group">
          <Link
            href={`/${lang}/dashboard`}
            className={`flex items-center ${
              isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
            } rounded-xl text-sm font-medium transition-all ${
              pathname === `/${lang}/dashboard`
                ? 'bg-persici-crimson text-white shadow-lg shadow-persici-crimson/25'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <TbLayoutDashboard className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>{t.overview}</span>}
          </Link>
          {isCollapsed && <div className={tooltipClass}>{t.overview}</div>}
        </div>

        {/* 2. Pages CMS Accordion */}
        {canSeePages && (
          <div className="pt-2">
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleSection('pages')}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2'
                } text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/70 transition-colors rounded-xl hover:bg-white/5`}
              >
                <div className="flex items-center gap-2">
                  <TbFiles className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span>{t.pagesSection}</span>}
                </div>
                {!isCollapsed && (
                  <div>
                    {openSections.pages ? (
                      <TbChevronDown className="w-4 h-4" />
                    ) : isRtl ? (
                      <TbChevronLeft className="w-4 h-4" />
                    ) : (
                      <TbChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>
              {isCollapsed && <div className={tooltipClass}>{t.pagesSection}</div>}
            </div>

            {!isCollapsed && openSections.pages && (
              <div className="mt-1 ps-3 space-y-1 border-s border-white/10 ms-4">
                <Link
                  href={`/${lang}/dashboard/pages/home`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/pages/home')
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.home}
                </Link>
                <Link
                  href={`/${lang}/dashboard/pages/about`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/pages/about')
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.about}
                </Link>
                <Link
                  href={`/${lang}/dashboard/pages/contact`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/pages/contact')
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.contact}
                </Link>
                <Link
                  href={`/${lang}/dashboard/pages/client-stories`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/pages/client-stories')
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.clientStories}
                </Link>
                <Link
                  href={`/${lang}/dashboard/pages/careers`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/pages/careers')
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.careersPage}
                </Link>

                {/* Sub-Accordion: Solutions */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => toggleSection('solutions')}
                    className="w-full flex items-center justify-between px-3 py-1 text-xs text-white/50 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <TbBulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.solutions}</span>
                    </div>
                    {openSections.solutions ? (
                      <TbChevronDown className="w-3 h-3" />
                    ) : isRtl ? (
                      <TbChevronLeft className="w-3 h-3" />
                    ) : (
                      <TbChevronRight className="w-3 h-3" />
                    )}
                  </button>

                  {openSections.solutions && (
                    <div className="mt-1 ps-2.5 space-y-1 border-s border-white/10 ms-2 text-[11px]">
                      <Link href={`/${lang}/dashboard/pages/solutions`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.solutionsHub}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/solutions-ai-integration`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.aiIntegration}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/solutions-application-management`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.appManagement}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/solutions-digital-engineering`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.digitalEngineering}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/solutions-ux-and-product-design`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.uxDesign}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/solutions-ecommerce-growth`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.ecommerce}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/solutions-marketing-communications`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.marketingComms}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/solutions-customer-engagement`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.customerEngagement}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/solutions-crm-management`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.crmManagement}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/solutions-supply-chain`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.supplyChain}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Sub-Accordion: Industries */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => toggleSection('industries')}
                    className="w-full flex items-center justify-between px-3 py-1 text-xs text-white/50 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <TbBuildingFactory2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>{t.industries}</span>
                    </div>
                    {openSections.industries ? (
                      <TbChevronDown className="w-3 h-3" />
                    ) : isRtl ? (
                      <TbChevronLeft className="w-3 h-3" />
                    ) : (
                      <TbChevronRight className="w-3 h-3" />
                    )}
                  </button>

                  {openSections.industries && (
                    <div className="mt-1 ps-2.5 space-y-1 border-s border-white/10 ms-2 text-[11px]">
                      <Link href={`/${lang}/dashboard/pages/industries`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.industriesHub}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/industries-consumer-products`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.consumerProducts}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/industries-energy-commodities`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.energyCommodities}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/industries-health`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.health}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/industries-public-sector`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.publicSector}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/industries-financial-services`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.financialServices}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/industries-technology-media`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.techMedia}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Sub-Accordion: How We Do It */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => toggleSection('howWeDoIt')}
                    className="w-full flex items-center justify-between px-3 py-1 text-xs text-white/50 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <TbTransform className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.howWeDoIt}</span>
                    </div>
                    {openSections.howWeDoIt ? (
                      <TbChevronDown className="w-3 h-3" />
                    ) : isRtl ? (
                      <TbChevronLeft className="w-3 h-3" />
                    ) : (
                      <TbChevronRight className="w-3 h-3" />
                    )}
                  </button>

                  {openSections.howWeDoIt && (
                    <div className="mt-1 ps-2.5 space-y-1 border-s border-white/10 ms-2 text-[11px]">
                      <Link href={`/${lang}/dashboard/pages/how-we-do-it`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.howWeDoItHub}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/how-we-do-it-framework`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.framework}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/how-we-do-it-engineering`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.engineering}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/how-we-do-it-experience`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.experience}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/how-we-do-it-product`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.productMgmt}
                      </Link>
                      <Link href={`/${lang}/dashboard/pages/how-we-do-it-strategy`} className="block px-2.5 py-1 text-white/50 hover:text-white">
                        &bull; {t.strategyConsulting}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Global Navigation Builders */}
        {canSeeNav && (
          <div className="pt-2">
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleSection('navigation')}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2'
                } text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/70 transition-colors rounded-xl hover:bg-white/5`}
              >
                <div className="flex items-center gap-2">
                  <TbRoute className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span>{t.navigation}</span>}
                </div>
                {!isCollapsed && (
                  <div>
                    {openSections.navigation ? (
                      <TbChevronDown className="w-4 h-4" />
                    ) : isRtl ? (
                      <TbChevronLeft className="w-4 h-4" />
                    ) : (
                      <TbChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>
              {isCollapsed && <div className={tooltipClass}>{t.navigation}</div>}
            </div>

            {!isCollapsed && openSections.navigation && (
              <div className="mt-1 ps-3 space-y-1 border-s border-white/10 ms-4">
                <Link
                  href={`/${lang}/dashboard/navigation/header`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/navigation/header')
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.headerBuilder}
                </Link>
                <Link
                  href={`/${lang}/dashboard/navigation/footer`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/navigation/footer')
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.footerBuilder}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 4. Media Browser */}
        {canSeeMedia && (
          <div className="pt-2">
            <div className="relative group">
              <Link
                href={`/${lang}/dashboard/media`}
                className={`flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
                } rounded-xl text-sm font-medium transition-all ${
                  isActive('/dashboard/media')
                    ? 'bg-persici-crimson text-white shadow-lg shadow-persici-crimson/25'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <TbPhoto className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{t.media}</span>}
              </Link>
              {isCollapsed && <div className={tooltipClass}>{t.media}</div>}
            </div>
          </div>
        )}

        {/* 5. Careers ATS (HR) */}
        {canSeeCareersAts && (
          <div className="pt-2">
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleSection('careers')}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2'
                } text-xs font-semibold text-amber-400/80 uppercase tracking-wider hover:text-amber-300 transition-colors rounded-xl hover:bg-white/5`}
              >
                <div className="flex items-center gap-2">
                  <TbUserCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  {!isCollapsed && <span>{t.careersAts}</span>}
                </div>
                {!isCollapsed && (
                  <div>
                    {openSections.careers ? (
                      <TbChevronDown className="w-4 h-4" />
                    ) : isRtl ? (
                      <TbChevronLeft className="w-4 h-4" />
                    ) : (
                      <TbChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>
              {isCollapsed && <div className={tooltipClass}>{t.careersAts}</div>}
            </div>

            {!isCollapsed && openSections.careers && (
              <div className="mt-1 ps-3 space-y-1 border-s border-amber-500/20 ms-4">
                <Link
                  href={`/${lang}/dashboard/careers/applicants`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/careers/applicants')
                      ? 'bg-amber-500/20 text-amber-200 font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.candidatePipeline}
                </Link>
                <Link
                  href={`/${lang}/dashboard/careers/openings`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/careers/openings')
                      ? 'bg-amber-500/20 text-amber-200 font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.activeOpenings}
                </Link>
                <Link
                  href={`/${lang}/dashboard/careers/communications`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/careers/communications')
                      ? 'bg-amber-500/20 text-amber-200 font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.dispatchedEmails}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 6. Leads & Media Buying */}
        {canSeeLeads && (
          <div className="pt-2">
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleSection('leads')}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2'
                } text-xs font-semibold text-purple-400/80 uppercase tracking-wider hover:text-purple-300 transition-colors rounded-xl hover:bg-white/5`}
              >
                <div className="flex items-center gap-2">
                  <TbTrendingUp className="w-5 h-5 text-purple-400 shrink-0" />
                  {!isCollapsed && <span>{t.leads}</span>}
                </div>
                {!isCollapsed && (
                  <div>
                    {openSections.leads ? (
                      <TbChevronDown className="w-4 h-4" />
                    ) : isRtl ? (
                      <TbChevronLeft className="w-4 h-4" />
                    ) : (
                      <TbChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>
              {isCollapsed && <div className={tooltipClass}>{t.leads}</div>}
            </div>

            {!isCollapsed && openSections.leads && (
              <div className="mt-1 ps-3 space-y-1 border-s border-purple-500/20 ms-4">
                <Link
                  href={`/${lang}/dashboard/leads/contact`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/leads/contact')
                      ? 'bg-purple-500/20 text-purple-200 font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.contactInquiries}
                </Link>
                <Link
                  href={`/${lang}/dashboard/leads/appointments`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/leads/appointments')
                      ? 'bg-purple-500/20 text-purple-200 font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.appointments}
                </Link>
                <Link
                  href={`/${lang}/dashboard/leads/discovery`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/leads/discovery')
                      ? 'bg-purple-500/20 text-purple-200 font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.discovery}
                </Link>
                <Link
                  href={`/${lang}/dashboard/leads/analytics`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/leads/analytics')
                      ? 'bg-purple-500/20 text-purple-200 font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.campaignAnalytics}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 7. Editorial & Proof */}
        {canSeeContent && (
          <div className="pt-2">
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleSection('content')}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2'
                } text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/70 transition-colors rounded-xl hover:bg-white/5`}
              >
                <div className="flex items-center gap-2">
                  <TbArticle className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span>{t.editorial}</span>}
                </div>
                {!isCollapsed && (
                  <div>
                    {openSections.content ? (
                      <TbChevronDown className="w-4 h-4" />
                    ) : isRtl ? (
                      <TbChevronLeft className="w-4 h-4" />
                    ) : (
                      <TbChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>
              {isCollapsed && <div className={tooltipClass}>{t.editorial}</div>}
            </div>

            {!isCollapsed && openSections.content && (
              <div className="mt-1 ps-3 space-y-1 border-s border-white/10 ms-4">
                <Link
                  href={`/${lang}/dashboard/content/insights`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/content/insights')
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.insights}
                </Link>
                <Link
                  href={`/${lang}/dashboard/content/projects`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/content/projects')
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.projects}
                </Link>
                <Link
                  href={`/${lang}/dashboard/content/reviews`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/dashboard/content/reviews')
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t.reviews}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 8. Team & RBAC Users */}
        {canSeeUsers && (
          <div className="pt-2">
            <div className="relative group">
              <Link
                href={`/${lang}/dashboard/users`}
                className={`flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
                } rounded-xl text-sm font-medium transition-all ${
                  isActive('/dashboard/users')
                    ? 'bg-persici-crimson text-white shadow-lg shadow-persici-crimson/25'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <TbUsers className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{t.users}</span>}
              </Link>
              {isCollapsed && <div className={tooltipClass}>{t.users}</div>}
            </div>
          </div>
        )}

        {/* 9. System Settings */}
        {canSeeSettings && (
          <div className="pt-2">
            <div className="relative group">
              <Link
                href={`/${lang}/dashboard/settings`}
                className={`flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
                } rounded-xl text-sm font-medium transition-all ${
                  isActive('/dashboard/settings')
                    ? 'bg-persici-crimson text-white shadow-lg shadow-persici-crimson/25'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <TbSettings className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{t.settings}</span>}
              </Link>
              {isCollapsed && <div className={tooltipClass}>{t.settings}</div>}
            </div>
          </div>
        )}
      </nav>

      {/* User Footer Indicator */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-black/20 shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-persici-crimson text-white font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {user?.name || (isRtl ? 'مدير النظام' : 'Administrator')}
              </p>
              <p className="text-[10px] text-white/40 truncate">{user?.email || 'admin@persiciagency.com'}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="w-8 h-8 rounded-full bg-persici-crimson text-white font-bold flex items-center justify-center text-xs shadow"
              title={user?.name || 'Administrator'}
            >
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
