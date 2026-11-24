'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
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
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarRightExpand,
  TbForms,
  TbAddressBook,
  TbBriefcase,
  TbStar,
  TbIdBadge2,
  TbTool,
  TbSparkles,
} from 'react-icons/tb';

export function DashboardSidebar({ lang, user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const role = user?.role || 'editor';
  const isRtl = lang === 'ar';
  const searchParams = useSearchParams();
  const passkey = searchParams?.get('passkey') || searchParams?.get('key') || '';

  const getHref = (href: string) => {
    if (!passkey) return href;
    const sep = href.includes('?') ? '&' : '?';
    return `${href}${sep}passkey=${encodeURIComponent(passkey)}`;
  };

  // Collapse state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('persici_sidebar_collapsed');
      if (saved !== null) {
        const val = saved === 'true';
        queueMicrotask(() => {
          setIsCollapsed(val);
        });
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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => ({
    pages: true,
    solutions: pathname.includes('/solutions'),
    industries: pathname.includes('/industries'),
    howWeDoIt: pathname.includes('/how-we-do-it'),
    navigation: false,
    careers: true,
    leads: true,
    content: true,
    clientStories:
      pathname.includes('/dashboard/content/projects') ||
      pathname.includes('/dashboard/pages/client-stories'),
  }));

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

  const isExactPath = (href: string) => pathname === `/${lang}${href}`;

  const isSolutionsActive = pathname.startsWith(`/${lang}/dashboard/pages/solutions`);
  const isIndustriesActive = pathname.startsWith(`/${lang}/dashboard/pages/industries`);
  const isHowWeDoItActive = pathname.startsWith(`/${lang}/dashboard/pages/how-we-do-it`);
  const isPagesActive =
    isActive('/dashboard/pages/home') ||
    isActive('/dashboard/pages/about') ||
    isActive('/dashboard/pages/contact') ||
    isActive('/dashboard/pages/insights') ||
    isSolutionsActive ||
    isIndustriesActive ||
    isHowWeDoItActive;
  const isNavActive = isActive('/dashboard/navigation');
  const isCareersActive = isActive('/dashboard/careers') || isActive('/dashboard/pages/careers');
  const isLeadsActive = isActive('/dashboard/leads');
  const isClientStoriesActive =
    isActive('/dashboard/content/projects') || isActive('/dashboard/pages/client-stories');

  const topTabLinkClass = (active: boolean) =>
    `flex items-center ${
      isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
    } rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-persici-crimson/60 ${
      active
        ? 'bg-persici-crimson text-white shadow-lg shadow-persici-crimson/25'
        : 'text-white/70 hover:bg-white/5 hover:text-white'
    }`;

  const accordionButtonClass = (active: boolean, isOpen: boolean) =>
    `w-full flex items-center ${
      isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
    } rounded-xl text-sm font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-persici-crimson/60 ${
      active
        ? 'bg-white/10 text-white font-semibold'
        : isOpen
        ? 'bg-white/5 text-white hover:bg-white/10'
        : 'text-white/70 hover:bg-white/5 hover:text-white'
    }`;

  const subLinkClass = (active: boolean) =>
    `block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-persici-crimson/60 ${
      active
        ? 'bg-persici-crimson text-white font-semibold shadow-md shadow-persici-crimson/25'
        : 'text-white/70 hover:bg-white/5 hover:text-white'
    }`;

  const subAccordionButtonClass = (active: boolean, isOpen: boolean) =>
    `w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-persici-crimson/60 ${
      active
        ? 'bg-white/10 text-white font-semibold'
        : isOpen
        ? 'bg-white/5 text-white hover:bg-white/10'
        : 'text-white/70 hover:bg-white/5 hover:text-white'
    }`;

  // Permission guards
  const canSeePages = ['admin', 'editor'].includes(role);
  const canSeeNav = ['admin', 'editor'].includes(role);
  const canSeeMedia = ['admin', 'editor', 'author', 'media buying', 'hr'].includes(role);
  const canSeeCareersAts = ['admin', 'hr', 'editor'].includes(role);
  const canSeeLeads = ['admin', 'media buying'].includes(role);
  const canSeeContent = ['admin', 'editor', 'author'].includes(role);
  const canSeeMaintenance = ['admin', 'editor'].includes(role);
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
    careersPage: isRtl ? 'بوابة الوظائف (Careers Hub)' : 'Careers Hub Page',
    insightsPage: isRtl ? 'بوابة الرؤى والأبحاث (Insights Hub)' : 'Insights Hub Page',
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
    telecomMediaTech: isRtl ? 'الاتصالات والإعلام والتقنية' : 'Telecom, Media & Tech',
    publicSector: isRtl ? 'القطاع العام والجهات الحكومية' : 'Public Sector',
    retail: isRtl ? 'قطاع التجزئة والتجارة' : 'Retail',
    health: isRtl ? 'الرعاية الصحية وعلوم الحياة' : 'Health & Life Sciences',
    energyCommodities: isRtl ? 'الطاقة والموارد والسلع' : 'Energy & Commodities',
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
    communicationSocial: isRtl ? 'التواصل والسوشيال ميديا' : 'Communication & Social',
    sharedContact: isRtl ? 'القسم العام للتواصل' : 'Shared Contact Form',
    media: isRtl ? 'مكتبة التخزين (R2)' : 'Storage Library (R2)',
    careersAts: isRtl ? 'الوظائف' : 'Careers',
    candidatePipeline: isRtl ? 'طلبات التوظيف والمتقدمين' : 'Candidate Pipeline',
    activeOpenings: isRtl ? 'الوظائف الشاغرة النشطة' : 'Active Job Postings',
    dispatchedEmails: isRtl ? 'سجل المراسلات الإلكترونية' : 'Dispatched HR Emails',
    leads: isRtl ? 'العملاء المحتملين والإعلانات' : 'Leads & Media Buying',
    contactInquiries: isRtl ? 'استفسارات التواصل' : 'Contact Inquiries',
    appointments: isRtl ? 'مواعيد الجلسات الاستراتيجية' : 'Strategy Appointments',
    discovery: isRtl ? 'جلسات الاستكشاف المؤسسي' : 'Discovery Calls',
    campaignAnalytics: isRtl ? 'تحليلات أداء الحملات' : 'Campaign Analytics',
    trackingPixels: isRtl ? 'البيكسل والأكواد و GTM/GA4' : 'Pixels, GTM & Code Snippets',
    editorial: isRtl ? 'المدونة والمقالات' : 'Blogs & Insights',
    insights: isRtl ? 'المدونة والمقالات' : 'Blogs & Insights',
    projects: isRtl ? 'قصص نجاح العملاء' : 'Client Stories',
    editClientStories: isRtl ? 'تعديل قصص العملاء' : 'Edit Client Stories',
    clientStoryCategories: isRtl ? 'التصنيفات' : 'Categories',
    reviews: isRtl ? 'التقييمات والشهادات' : 'Reviews & Testimonials',
    teamMembers: isRtl ? 'فريق العمل والموظفون' : 'Team Members',
    aiStudio: isRtl ? 'الذكاء الاصطناعي والنماذج' : 'AI Studio & Models',
    maintenance: isRtl ? 'وضع الصيانة والتوجيه' : 'Maintenance Mode',
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
            href={getHref(`/${lang}/dashboard`)}
            className={topTabLinkClass(pathname === `/${lang}/dashboard`)}
          >
            <TbLayoutDashboard className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>{t.overview}</span>}
          </Link>
          {isCollapsed && <div className={tooltipClass}>{t.overview}</div>}
        </div>

        {/* 2. Site Pages CMS Accordion */}
        {canSeePages && (
          <div>
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleSection('pages')}
                className={accordionButtonClass(isPagesActive, Boolean(openSections.pages))}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <TbFiles className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="truncate">{t.pagesSection}</span>}
                </div>
                {!isCollapsed && (
                  <div className="shrink-0">
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
                  href={getHref(`/${lang}/dashboard/pages/home`)}
                  className={subLinkClass(isActive('/dashboard/pages/home'))}
                >
                  {t.home}
                </Link>
                <Link
                  href={getHref(`/${lang}/dashboard/pages/about`)}
                  className={subLinkClass(isActive('/dashboard/pages/about'))}
                >
                  {t.about}
                </Link>
                <Link
                  href={getHref(`/${lang}/dashboard/pages/contact`)}
                  className={subLinkClass(isActive('/dashboard/pages/contact'))}
                >
                  {t.contact}
                </Link>
                <Link
                  href={getHref(`/${lang}/dashboard/pages/insights`)}
                  className={subLinkClass(isActive('/dashboard/pages/insights'))}
                >
                  {t.insightsPage}
                </Link>

                {/* Sub-Accordion: Solutions */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('solutions')}
                    className={subAccordionButtonClass(
                      isSolutionsActive,
                      Boolean(openSections.solutions)
                    )}
                  >
                    <span className="truncate">{t.solutions}</span>
                    {openSections.solutions ? (
                      <TbChevronDown className="w-3.5 h-3.5 shrink-0" />
                    ) : isRtl ? (
                      <TbChevronLeft className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <TbChevronRight className="w-3.5 h-3.5 shrink-0" />
                    )}
                  </button>

                  {openSections.solutions && (
                    <div className="mt-1 ps-3 space-y-1 border-s border-white/10 ms-3">
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/solutions`)}
                        className={subLinkClass(isExactPath('/dashboard/pages/solutions'))}
                      >
                        {t.solutionsHub}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/solutions-ai-integration`)}
                        className={subLinkClass(isActive('/dashboard/pages/solutions-ai-integration'))}
                      >
                        {t.aiIntegration}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/solutions-application-management`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/solutions-application-management')
                        )}
                      >
                        {t.appManagement}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/solutions-digital-engineering`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/solutions-digital-engineering')
                        )}
                      >
                        {t.digitalEngineering}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/solutions-ux-and-product-design`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/solutions-ux-and-product-design')
                        )}
                      >
                        {t.uxDesign}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/solutions-ecommerce-growth`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/solutions-ecommerce-growth')
                        )}
                      >
                        {t.ecommerce}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/solutions-marketing-communications`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/solutions-marketing-communications')
                        )}
                      >
                        {t.marketingComms}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/solutions-customer-engagement`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/solutions-customer-engagement')
                        )}
                      >
                        {t.customerEngagement}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/solutions-crm-management`)}
                        className={subLinkClass(isActive('/dashboard/pages/solutions-crm-management'))}
                      >
                        {t.crmManagement}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/solutions-supply-chain`)}
                        className={subLinkClass(isActive('/dashboard/pages/solutions-supply-chain'))}
                      >
                        {t.supplyChain}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Sub-Accordion: Industries */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('industries')}
                    className={subAccordionButtonClass(
                      isIndustriesActive,
                      Boolean(openSections.industries)
                    )}
                  >
                    <span className="truncate">{t.industries}</span>
                    {openSections.industries ? (
                      <TbChevronDown className="w-3.5 h-3.5 shrink-0" />
                    ) : isRtl ? (
                      <TbChevronLeft className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <TbChevronRight className="w-3.5 h-3.5 shrink-0" />
                    )}
                  </button>

                  {openSections.industries && (
                    <div className="mt-1 ps-3 space-y-1 border-s border-white/10 ms-3">
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/industries`)}
                        className={subLinkClass(isExactPath('/dashboard/pages/industries'))}
                      >
                        {t.industriesHub}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/industries-consumer-products`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/industries-consumer-products')
                        )}
                      >
                        {t.consumerProducts}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/industries-telecom-media-technology`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/industries-telecom-media-technology')
                        )}
                      >
                        {t.telecomMediaTech}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/industries-public-sector`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/industries-public-sector')
                        )}
                      >
                        {t.publicSector}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/industries-retail`)}
                        className={subLinkClass(isActive('/dashboard/pages/industries-retail'))}
                      >
                        {t.retail}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/industries-health`)}
                        className={subLinkClass(isActive('/dashboard/pages/industries-health'))}
                      >
                        {t.health}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/industries-energy-commodities`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/industries-energy-commodities')
                        )}
                      >
                        {t.energyCommodities}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Sub-Accordion: How We Do It */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('howWeDoIt')}
                    className={subAccordionButtonClass(
                      isHowWeDoItActive,
                      Boolean(openSections.howWeDoIt)
                    )}
                  >
                    <span className="truncate">{t.howWeDoIt}</span>
                    {openSections.howWeDoIt ? (
                      <TbChevronDown className="w-3.5 h-3.5 shrink-0" />
                    ) : isRtl ? (
                      <TbChevronLeft className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <TbChevronRight className="w-3.5 h-3.5 shrink-0" />
                    )}
                  </button>

                  {openSections.howWeDoIt && (
                    <div className="mt-1 ps-3 space-y-1 border-s border-white/10 ms-3">
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/how-we-do-it`)}
                        className={subLinkClass(isExactPath('/dashboard/pages/how-we-do-it'))}
                      >
                        {t.howWeDoItHub}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/how-we-do-it-strategy-consulting`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/how-we-do-it-strategy-consulting') ||
                            isActive('/dashboard/pages/how-we-do-it-strategy')
                        )}
                      >
                        {t.strategyConsulting}
                      </Link>
                      <Link
                        href={getHref(
                          `/${lang}/dashboard/pages/how-we-do-it-digital-transformation-framework`
                        )}
                        className={subLinkClass(
                          isActive('/dashboard/pages/how-we-do-it-digital-transformation-framework') ||
                            isActive('/dashboard/pages/how-we-do-it-framework')
                        )}
                      >
                        {t.framework}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/how-we-do-it-product-management`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/how-we-do-it-product-management') ||
                            isActive('/dashboard/pages/how-we-do-it-product')
                        )}
                      >
                        {t.productMgmt}
                      </Link>
                      <Link
                        href={getHref(`/${lang}/dashboard/pages/how-we-do-it-engineering-technology`)}
                        className={subLinkClass(
                          isActive('/dashboard/pages/how-we-do-it-engineering-technology') ||
                            isActive('/dashboard/pages/how-we-do-it-engineering')
                        )}
                      >
                        {t.engineering}
                      </Link>
                      <Link
                        href={getHref(
                          `/${lang}/dashboard/pages/how-we-do-it-experience-transformation`
                        )}
                        className={subLinkClass(
                          isActive('/dashboard/pages/how-we-do-it-experience-transformation') ||
                            isActive('/dashboard/pages/how-we-do-it-experience')
                        )}
                      >
                        {t.experience}
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
          <div>
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleSection('navigation')}
                className={accordionButtonClass(isNavActive, Boolean(openSections.navigation))}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <TbRoute className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="truncate">{t.navigation}</span>}
                </div>
                {!isCollapsed && (
                  <div className="shrink-0">
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
                  href={getHref(`/${lang}/dashboard/navigation/header`)}
                  className={subLinkClass(isActive('/dashboard/navigation/header'))}
                >
                  {t.headerBuilder}
                </Link>
                <Link
                  href={getHref(`/${lang}/dashboard/navigation/footer`)}
                  className={subLinkClass(isActive('/dashboard/navigation/footer'))}
                >
                  {t.footerBuilder}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 4. Standalone Communication & Social Media Tab */}
        {(canSeePages || canSeeNav) && (
          <div>
            <div className="relative group">
              <Link
                href={getHref(`/${lang}/dashboard/communication`)}
                className={topTabLinkClass(isActive('/dashboard/communication'))}
              >
                <TbAddressBook className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{t.communicationSocial}</span>}
              </Link>
              {isCollapsed && <div className={tooltipClass}>{t.communicationSocial}</div>}
            </div>
          </div>
        )}

        {/* 4b. Standalone Global Shared Contact Section Tab */}
        {canSeePages && (
          <div>
            <div className="relative group">
              <Link
                href={getHref(`/${lang}/dashboard/shared-contact`)}
                className={topTabLinkClass(isActive('/dashboard/shared-contact'))}
              >
                <TbForms className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{t.sharedContact}</span>}
              </Link>
              {isCollapsed && <div className={tooltipClass}>{t.sharedContact}</div>}
            </div>
          </div>
        )}

        {/* 5. Media Browser */}
        {canSeeMedia && (
          <div>
            <div className="relative group">
              <Link
                href={getHref(`/${lang}/dashboard/media`)}
                className={topTabLinkClass(isActive('/dashboard/media'))}
              >
                <TbPhoto className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{t.media}</span>}
              </Link>
              {isCollapsed && <div className={tooltipClass}>{t.media}</div>}
            </div>
          </div>
        )}

        {/* 6. Careers */}
        {canSeeCareersAts && (
          <div>
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleSection('careers')}
                className={accordionButtonClass(isCareersActive, Boolean(openSections.careers))}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <TbUserCheck className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="truncate">{t.careersAts}</span>}
                </div>
                {!isCollapsed && (
                  <div className="shrink-0">
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
              <div className="mt-1 ps-3 space-y-1 border-s border-white/10 ms-4">
                <Link
                  href={getHref(`/${lang}/dashboard/pages/careers`)}
                  className={subLinkClass(isActive('/dashboard/pages/careers'))}
                >
                  {t.careersPage}
                </Link>
                <Link
                  href={getHref(`/${lang}/dashboard/careers/openings`)}
                  className={subLinkClass(isActive('/dashboard/careers/openings'))}
                >
                  {t.activeOpenings}
                </Link>
                <Link
                  href={getHref(`/${lang}/dashboard/careers/applicants`)}
                  className={subLinkClass(isActive('/dashboard/careers/applicants'))}
                >
                  {t.candidatePipeline}
                </Link>
                <Link
                  href={getHref(`/${lang}/dashboard/careers/communications`)}
                  className={subLinkClass(isActive('/dashboard/careers/communications'))}
                >
                  {t.dispatchedEmails}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 7. Leads & Media Buying */}
        {canSeeLeads && (
          <div>
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleSection('leads')}
                className={accordionButtonClass(isLeadsActive, Boolean(openSections.leads))}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <TbTrendingUp className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="truncate">{t.leads}</span>}
                </div>
                {!isCollapsed && (
                  <div className="shrink-0">
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
              <div className="mt-1 ps-3 space-y-1 border-s border-white/10 ms-4">
                <Link
                  href={getHref(`/${lang}/dashboard/leads/contact`)}
                  className={subLinkClass(isActive('/dashboard/leads/contact'))}
                >
                  {t.contactInquiries}
                </Link>
                <Link
                  href={getHref(`/${lang}/dashboard/leads/appointments`)}
                  className={subLinkClass(isActive('/dashboard/leads/appointments'))}
                >
                  {t.appointments}
                </Link>
                <Link
                  href={getHref(`/${lang}/dashboard/leads/discovery`)}
                  className={subLinkClass(isActive('/dashboard/leads/discovery'))}
                >
                  {t.discovery}
                </Link>
                <Link
                  href={getHref(`/${lang}/dashboard/leads/analytics`)}
                  className={subLinkClass(isActive('/dashboard/leads/analytics'))}
                >
                  {t.campaignAnalytics}
                </Link>
                <Link
                  href={getHref(`/${lang}/dashboard/leads/tracking`)}
                  className={subLinkClass(isActive('/dashboard/leads/tracking'))}
                >
                  {t.trackingPixels}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 8. Client Stories Accordion (Client Stories Hub, Edit Client Stories & Categories) */}
        {canSeeContent && (
          <div>
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleSection('clientStories')}
                className={accordionButtonClass(
                  isClientStoriesActive,
                  Boolean(openSections.clientStories)
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <TbBriefcase className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="truncate">{t.projects}</span>}
                </div>
                {!isCollapsed && (
                  <div className="shrink-0">
                    {openSections.clientStories ? (
                      <TbChevronDown className="w-4 h-4" />
                    ) : isRtl ? (
                      <TbChevronLeft className="w-4 h-4" />
                    ) : (
                      <TbChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>
              {isCollapsed && <div className={tooltipClass}>{t.projects}</div>}
            </div>

            {!isCollapsed && openSections.clientStories && (
              <div className="mt-1 ps-3 space-y-1 border-s border-white/10 ms-4">
                {canSeePages && (
                  <Link
                    href={getHref(`/${lang}/dashboard/pages/client-stories`)}
                    className={subLinkClass(isActive('/dashboard/pages/client-stories'))}
                  >
                    {t.clientStories}
                  </Link>
                )}
                <Link
                  href={getHref(`/${lang}/dashboard/content/projects`)}
                  className={subLinkClass(isExactPath('/dashboard/content/projects'))}
                >
                  {t.editClientStories}
                </Link>
                <Link
                  href={getHref(`/${lang}/dashboard/content/projects/categories`)}
                  className={subLinkClass(isActive('/dashboard/content/projects/categories'))}
                >
                  {t.clientStoryCategories}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 9. Blogs & Insights (Standalone Single Tab) */}
        {canSeeContent && (
          <div>
            <div className="relative group">
              <Link
                href={getHref(`/${lang}/dashboard/content/insights`)}
                className={topTabLinkClass(isActive('/dashboard/content/insights'))}
              >
                <TbArticle className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{t.insights}</span>}
              </Link>
              {isCollapsed && <div className={tooltipClass}>{t.insights}</div>}
            </div>
          </div>
        )}

        {/* 10. Reviews & Testimonials (Standalone Single Tab) */}
        {canSeeContent && (
          <div>
            <div className="relative group">
              <Link
                href={getHref(`/${lang}/dashboard/content/reviews`)}
                className={topTabLinkClass(isActive('/dashboard/content/reviews'))}
              >
                <TbStar className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{t.reviews}</span>}
              </Link>
              {isCollapsed && <div className={tooltipClass}>{t.reviews}</div>}
            </div>
          </div>
        )}

        {/* 11. Team Members Directory & Carousel (Standalone Single Tab) */}
        {(canSeeContent || canSeeCareersAts) && (
          <div>
            <div className="relative group">
              <Link
                href={getHref(`/${lang}/dashboard/team`)}
                className={topTabLinkClass(isActive('/dashboard/team'))}
              >
                <TbIdBadge2 className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{t.teamMembers}</span>}
              </Link>
              {isCollapsed && <div className={tooltipClass}>{t.teamMembers}</div>}
            </div>
          </div>
        )}

        {/* 12. AI Studio & Models */}
        {canSeeContent && (
          <div>
            <div className="relative group">
              <Link
                href={getHref(`/${lang}/dashboard/ai`)}
                className={topTabLinkClass(isActive('/dashboard/ai'))}
              >
                <TbSparkles className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{t.aiStudio}</span>}
              </Link>
              {isCollapsed && <div className={tooltipClass}>{t.aiStudio}</div>}
            </div>
          </div>
        )}

        {/* 13. Maintenance Mode & Global Redirect */}
        {canSeeMaintenance && (
          <div>
            <div className="relative group">
              <Link
                href={getHref(`/${lang}/dashboard/maintenance`)}
                className={topTabLinkClass(isActive('/dashboard/maintenance'))}
              >
                <TbTool className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{t.maintenance}</span>}
              </Link>
              {isCollapsed && <div className={tooltipClass}>{t.maintenance}</div>}
            </div>
          </div>
        )}

        {/* 14. Team & RBAC Users */}
        {canSeeUsers && (
          <div>
            <div className="relative group">
              <Link
                href={getHref(`/${lang}/dashboard/users`)}
                className={topTabLinkClass(isActive('/dashboard/users'))}
              >
                <TbUsers className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{t.users}</span>}
              </Link>
              {isCollapsed && <div className={tooltipClass}>{t.users}</div>}
            </div>
          </div>
        )}

        {/* 15. System Settings */}
        {canSeeSettings && (
          <div>
            <div className="relative group">
              <Link
                href={getHref(`/${lang}/dashboard/settings`)}
                className={topTabLinkClass(isActive('/dashboard/settings'))}
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
