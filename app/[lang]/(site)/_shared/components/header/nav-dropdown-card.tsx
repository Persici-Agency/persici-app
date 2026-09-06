'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { NavLink } from '@shared/types';
import type { Dictionary } from '@dictionaries';
import { HiArrowNarrowRight, HiArrowNarrowLeft } from 'react-icons/hi';
import {
  TbDeviceLaptop,
  TbCirclesRelation,
  TbUsers,
  TbShoppingBag,
  TbAdjustmentsHorizontal,
  TbBrandAdobe,
  TbBasket,
  TbAntenna,
  TbBuildingSkyscraper,
  TbHeartRateMonitor,
  TbBolt,
  TbTrendingUp,
  TbLayoutDashboard,
  TbCode,
  TbSparkles,
  TbSpeakerphone,
  TbCpu,
  TbDatabase,
  TbTruck,
  TbColorSwatch,
} from 'react-icons/tb';
import {
  FaAws,
  FaGoogle,
  FaMicrosoft,
  FaSalesforce,
} from 'react-icons/fa6';

export type NavDropdownCardProps = {
  activeLink: NavLink | null;
  lang: string;
  dict: Dictionary;
  onClose: () => void;
};

/**
 * Utility function to truncate string with three dots (...) if exceeding maxLength
 */
export function truncate(text: string, maxLength: number = 32): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

// Semantic icons map
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // Solutions
  applicationManagement: TbDeviceLaptop,
  legacyModernization: TbDeviceLaptop,
  contentSupplyChain: TbCirclesRelation,
  marketingCommunications: TbSpeakerphone,
  ecommerceGrowth: TbShoppingBag,
  digitalCommerce: TbShoppingBag,
  aiIntegration: TbCpu,
  uxProductDesign: TbColorSwatch,
  customerEngagement: TbUsers,
  digitalEngineering: TbCode,
  supplyChain: TbTruck,
  crmManagement: TbDatabase,
  experienceTransformation: TbAdjustmentsHorizontal,

  // Industries
  consumerProducts: TbBasket,
  telecomMediaTechnology: TbAntenna,
  publicSector: TbBuildingSkyscraper,
  retail: TbShoppingBag,
  health: TbHeartRateMonitor,
  energyCommodities: TbBolt,

  // How We Do It
  strategyConsulting: TbTrendingUp,
  digitalTransformationFramework: TbCirclesRelation,
  productManagement: TbLayoutDashboard,
  engineeringTechnology: TbCode,

  // Company
  aboutUs: TbUsers,
  insights: TbSparkles,
  careers: TbDeviceLaptop,
  contactUs: TbSpeakerphone,
};

// Certified partner list matching reference image
const partnersList = [
  { name: 'Adobe', href: '/about#partners', icon: TbBrandAdobe },
  { name: 'AWS', href: '/about#partners', icon: FaAws },
  { name: 'Google Cloud', href: '/about#partners', icon: FaGoogle },
  { name: 'Microsoft', href: '/about#partners', icon: FaMicrosoft },
  { name: 'Salesforce', href: '/about#partners', icon: FaSalesforce },
];

export function NavDropdownCard({
  activeLink,
  lang,
  dict,
  onClose,
}: NavDropdownCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? HiArrowNarrowLeft : HiArrowNarrowRight;

  // Handle escape key and click outside
  useEffect(() => {
    if (!activeLink) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-nav-item]')) {
          onClose();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeLink, onClose]);

  if (!activeLink || !activeLink.subItems || activeLink.subItems.length === 0) {
    return null;
  }

  const parentKey = activeLink.key;
  const parentTitle = dict.nav[parentKey as keyof typeof dict.nav] || activeLink.key;
  const parentHref = activeLink.href.startsWith(`/${lang}`)
    ? activeLink.href
    : `/${lang}${activeLink.href.startsWith('/') ? activeLink.href : `/${activeLink.href}`}`;
  const subItems = activeLink.subItems;

  const isSolutions = parentKey === 'solutions';
  const partnersTitle = isRtl ? 'الشركاء' : 'Partners';
  const andMoreText = isRtl ? '...والمزيد' : '...and more.';

  // Top 5 solutions on left column when solutions category is active
  const solutionsCol1 = isSolutions ? subItems.slice(0, 5) : [];

  // For other categories, split items into two balanced columns
  const midPoint = Math.ceil(subItems.length / 2);
  const generalCol1 = subItems.slice(0, midPoint);
  const generalCol2 = subItems.slice(midPoint);

  return (
    <>
      {/* 1. Backdrop Overlay Wash (Publicis Sapient Style) */}
      <div
        className="fixed inset-0 top-25 z-40 bg-white/80 backdrop-blur-[2px] transition-opacity duration-300 ease-out"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Floating Secondary Nav Card (Exact Match to Publicis Sapient Screenshot) */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={parentTitle}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 w-[94vw] max-w-[660px] rounded-2xl border border-slate-100 bg-white p-7 sm:p-9 shadow-[0px_10px_35px_rgba(0,0,0,0.12),0px_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out animate-in fade-in zoom-in-98"
      >
        <div className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
          {/* ================= COLUMN 1 ================= */}
          <div>
            {/* Clickable Section Heading with Underline & Arrow Nudge */}
            <Link
              href={parentHref}
              onClick={onClose}
              className="group/head inline-flex items-center gap-2 text-base font-bold text-slate-900 transition-colors hover:text-black mb-5 cursor-pointer"
            >
              <span
                className={`relative py-0.5 after:absolute after:bottom-0 after:h-[1.5px] after:w-full after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out group-hover/head:after:scale-x-100 ${
                  isRtl ? 'after:right-0 after:origin-bottom-right' : 'after:left-0 after:origin-bottom-left'
                }`}
              >
                {parentTitle}
              </span>
              <ArrowIcon
                className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out ${
                  isRtl ? 'group-hover/head:-translate-x-1.5' : 'group-hover/head:translate-x-1.5'
                }`}
              />
            </Link>

            {/* Sub-Items: Arrow is right beside text, with truncate fallback */}
            <div className="space-y-3.5">
              {(isSolutions ? solutionsCol1 : generalCol1).map((item) => {
                const rawLabel = dict.nav[item.key as keyof typeof dict.nav] || item.key;
                const label = truncate(rawLabel, 30);
                const href = item.href.startsWith(`/${lang}`)
                  ? item.href
                  : `/${lang}${item.href.startsWith('/') ? item.href : `/${item.href}`}`;
                const ItemIcon = iconMap[item.key] || TbCirclesRelation;

                return (
                  <Link
                    key={item.key}
                    href={href}
                    onClick={onClose}
                    className="group flex items-center gap-2 text-[14px] font-medium text-slate-800 transition-colors hover:text-black w-fit max-w-full"
                    title={rawLabel}
                  >
                    <ItemIcon className="h-4 w-4 text-slate-700 transition-colors group-hover:text-black shrink-0" />
                    <span
                      className={`relative py-0.5 truncate max-w-[210px] sm:max-w-[230px] after:absolute after:bottom-0 after:h-[1.5px] after:w-full after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out group-hover:after:scale-x-100 ${
                        isRtl ? 'after:right-0 after:origin-bottom-right' : 'after:left-0 after:origin-bottom-left'
                      }`}
                    >
                      {label}
                    </span>
                    <ArrowIcon
                      className={`h-3.5 w-3.5 text-slate-700 transition-transform duration-300 ease-in-out group-hover:text-black shrink-0 ${
                        isRtl ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ================= COLUMN 2 ================= */}
          <div>
            {isSolutions ? (
              /* Solutions -> Column 2: Partners (Matching Publicis Sapient Image) */
              <div>
                <Link
                  href={`/${lang}/about#partners`}
                  onClick={onClose}
                  className="group/head inline-flex items-center gap-2 text-base font-bold text-slate-900 transition-colors hover:text-black mb-5 cursor-pointer"
                >
                  <span
                    className={`relative py-0.5 after:absolute after:bottom-0 after:h-[1.5px] after:w-full after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out group-hover/head:after:scale-x-100 ${
                      isRtl ? 'after:right-0 after:origin-bottom-right' : 'after:left-0 after:origin-bottom-left'
                    }`}
                  >
                    {partnersTitle}
                  </span>
                  <ArrowIcon
                    className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out ${
                      isRtl ? 'group-hover/head:-translate-x-1.5' : 'group-hover/head:translate-x-1.5'
                    }`}
                  />
                </Link>

                <div className="space-y-3.5">
                  {partnersList.map((partner) => {
                    const PartnerIcon = partner.icon;
                    return (
                      <Link
                        key={partner.name}
                        href={`/${lang}${partner.href}`}
                        onClick={onClose}
                        className="group flex items-center gap-2 text-[14px] font-medium text-slate-800 transition-colors hover:text-black w-fit max-w-full"
                        title={partner.name}
                      >
                        <PartnerIcon className="h-4 w-4 text-slate-800 transition-colors group-hover:text-black shrink-0" />
                        <span
                          className={`relative py-0.5 truncate max-w-[210px] sm:max-w-[230px] after:absolute after:bottom-0 after:h-[1.5px] after:w-full after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out group-hover:after:scale-x-100 ${
                            isRtl ? 'after:right-0 after:origin-bottom-right' : 'after:left-0 after:origin-bottom-left'
                          }`}
                        >
                          {partner.name}
                        </span>
                        <ArrowIcon
                          className={`h-3.5 w-3.5 text-slate-700 transition-transform duration-300 ease-in-out group-hover:text-black shrink-0 ${
                            isRtl ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'
                          }`}
                        />
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-4 text-end">
                  <span className="text-xs text-slate-400 font-normal italic">
                    {andMoreText}
                  </span>
                </div>
              </div>
            ) : (
              /* Other Categories -> Column 2 Sub-Items */
              <div>
                <div className="h-7 mb-5" aria-hidden="true" />

                <div className="space-y-3.5">
                  {generalCol2.map((item) => {
                    const rawLabel = dict.nav[item.key as keyof typeof dict.nav] || item.key;
                    const label = truncate(rawLabel, 30);
                    const href = item.href.startsWith(`/${lang}`)
                      ? item.href
                      : `/${lang}${item.href.startsWith('/') ? item.href : `/${item.href}`}`;
                    const ItemIcon = iconMap[item.key] || TbCirclesRelation;

                    return (
                      <Link
                        key={item.key}
                        href={href}
                        onClick={onClose}
                        className="group flex items-center gap-2 text-[14px] font-medium text-slate-800 transition-colors hover:text-black w-fit max-w-full"
                        title={rawLabel}
                      >
                        <ItemIcon className="h-4 w-4 text-slate-700 transition-colors group-hover:text-black shrink-0" />
                        <span
                          className={`relative py-0.5 truncate max-w-[210px] sm:max-w-[230px] after:absolute after:bottom-0 after:h-[1.5px] after:w-full after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out group-hover:after:scale-x-100 ${
                            isRtl ? 'after:right-0 after:origin-bottom-right' : 'after:left-0 after:origin-bottom-left'
                          }`}
                        >
                          {label}
                        </span>
                        <ArrowIcon
                          className={`h-3.5 w-3.5 text-slate-700 transition-transform duration-300 ease-in-out group-hover:text-black shrink-0 ${
                            isRtl ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'
                          }`}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
