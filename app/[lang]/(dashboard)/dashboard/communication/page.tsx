'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  TbAddressBook,
  TbWorld,
  TbMail,
  TbPhone,
  TbBrandWhatsapp,
  TbBrandX,
  TbBrandLinkedin,
  TbBrandInstagram,
  TbBrandFacebook,
  TbBrandYoutube,
  TbBrandTiktok,
  TbBrandSnapchat,
  TbBrandPinterest,
  TbBrandGithub,
  TbShare,
  TbBuildingSkyscraper,
  TbMapPin,
  TbClock,
  TbPlus,
  TbTrash,
  TbArrowUp,
  TbArrowDown,
  TbPhoto,
  TbCheck,
  TbRefresh,
  TbSparkles,
  TbEye,
  TbEyeOff,
  TbAlertCircle,
  TbExternalLink,
  TbMessageDots,
  TbStarFilled,
} from 'react-icons/tb';
import { MediaPickerModal } from '@dashboard-shared/components';
import {
  DEFAULT_COMMUNICATION_CONFIG,
  inferSocialIconKey,
  rewriteEmailDomain,
  type CommunicationSocialConfig,
  type CommunicationSocialLink,
  type SocialIconKey,
} from '@/lib/communication-types';
import type { ContactChannelItem, ContactOfficeItem } from '@/app/[lang]/(site)/contact/_contact/data/contact.data';

const SOCIAL_ICON_OPTIONS: { value: SocialIconKey; label: string }[] = [
  { value: 'x', label: 'X (Twitter)' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'snapchat', label: 'Snapchat' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'github', label: 'GitHub' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'website', label: 'Website / Other' },
];

function renderSocialPlatformIcon(iconKey: SocialIconKey, className = 'w-4 h-4') {
  switch (iconKey) {
    case 'x':
      return <TbBrandX className={className} />;
    case 'linkedin':
      return <TbBrandLinkedin className={className} />;
    case 'instagram':
      return <TbBrandInstagram className={className} />;
    case 'facebook':
      return <TbBrandFacebook className={className} />;
    case 'youtube':
      return <TbBrandYoutube className={className} />;
    case 'tiktok':
      return <TbBrandTiktok className={className} />;
    case 'snapchat':
      return <TbBrandSnapchat className={className} />;
    case 'pinterest':
      return <TbBrandPinterest className={className} />;
    case 'github':
      return <TbBrandGithub className={className} />;
    case 'whatsapp':
      return <TbBrandWhatsapp className={className} />;
    default:
      return <TbWorld className={className} />;
  }
}

function WhereThisAppears({
  isRtl,
  locations,
}: {
  isRtl: boolean;
  locations: { label: string; href?: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {isRtl ? 'أماكن الظهور في الموقع:' : 'Where this appears:'}
      </span>
      {locations.map((loc, idx) =>
        loc.href ? (
          <Link
            key={idx}
            href={loc.href}
            target="_blank"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-persici-crimson/10 text-slate-700 hover:text-persici-crimson text-xs font-medium transition-colors"
          >
            <span>{loc.label}</span>
            <TbExternalLink className="w-3 h-3 opacity-70" />
          </Link>
        ) : (
          <span
            key={idx}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
          >
            {loc.label}
          </span>
        )
      )}
    </div>
  );
}

export default function CommunicationSocialPage() {
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang === 'ar' ? 'ar' : 'en';
  const isRtl = lang === 'ar';

  const [config, setConfig] = useState<CommunicationSocialConfig>(DEFAULT_COMMUNICATION_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [mediaTargetOfficeIdx, setMediaTargetOfficeIdx] = useState<number | null>(null);
  const [expandedOffices, setExpandedOffices] = useState<Record<string, boolean>>({});
  const [passkeySuffix, setPasskeySuffix] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadCommunicationConfig() {
      const pk =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('passkey')
          : null;
      try {
        const res = await fetch('/api/communication', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled && pk) {
          setPasskeySuffix(`?passkey=${encodeURIComponent(pk)}`);
        }
        if (!cancelled && data?.success && data.config) {
          setConfig(data.config);
          if (Array.isArray(data.config.offices) && data.config.offices[0]?.id) {
            setExpandedOffices({ [data.config.offices[0].id]: true });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setStatusMessage({
            type: 'error',
            text:
              err instanceof Error
                ? err.message
                : isRtl
                ? 'تعذر تحميل إعدادات التواصل.'
                : 'Failed to load communication settings.',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCommunicationConfig();
    return () => {
      cancelled = true;
    };
  }, [isRtl]);

  const updateConfig = (updater: (prev: CommunicationSocialConfig) => CommunicationSocialConfig) => {
    setConfig((prev) => updater(prev));
    setDirty(true);
    setStatusMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/communication', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      if (data.config) {
        setConfig(data.config);
      }
      setDirty(false);
      setStatusMessage({
        type: 'success',
        text: isRtl
          ? 'تم حفظ ونشر بيانات التواصل والسوشيال ميديا ومزامنتها عبر صفحات الموقع والتذييل.'
          : 'Saved and published! Changes are synced across Footer, Contact, and Careers pages.',
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : isRtl
            ? 'حدث خطأ أثناء حفظ البيانات.'
            : 'Failed to save changes.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleApplyDomainToAllEmails = () => {
    const cleanDomain = config.websiteDomain
      .replace(/^https?:\/\//i, '')
      .replace(/\/.*$/, '')
      .trim();
    if (!cleanDomain) {
      setStatusMessage({
        type: 'error',
        text: isRtl
          ? 'الرجاء إدخال نطاق الموقع أولاً (مثال: persici.com).'
          : 'Enter a valid Website Domain first (e.g. persici.com).',
      });
      return;
    }

    updateConfig((prev) => ({
      ...prev,
      websiteDomain: cleanDomain,
      websiteUrl:
        prev.websiteUrl && /^https?:\/\//i.test(prev.websiteUrl)
          ? `https://${cleanDomain}`
          : `https://${cleanDomain}`,
      infoEmail: rewriteEmailDomain(prev.infoEmail, cleanDomain),
      supportEmail: rewriteEmailDomain(prev.supportEmail, cleanDomain),
      hrEmail: rewriteEmailDomain(prev.hrEmail, cleanDomain),
      growthEmail: rewriteEmailDomain(prev.growthEmail, cleanDomain),
      partnersEmail: rewriteEmailDomain(prev.partnersEmail, cleanDomain),
      pressEmail: rewriteEmailDomain(prev.pressEmail, cleanDomain),
      offices: prev.offices.map((o) => ({
        ...o,
        email: rewriteEmailDomain(o.email, cleanDomain),
      })),
      channels: prev.channels.map((ch) => ({
        ...ch,
        email: rewriteEmailDomain(ch.email, cleanDomain),
      })),
    }));

    setStatusMessage({
      type: 'success',
      text: isRtl
        ? `تم تحديث النطاق إلى @${cleanDomain} عبر جميع الإيميلات الرسمية والمكاتب والقنوات. اضغط "حفظ ونشر" لتأكيد التغييرات.`
        : `Updated all corporate, office, and channel emails to @${cleanDomain}. Click "Save & Publish" to apply live.`,
    });
  };

  // --- Social links helpers ---
  const addSocialLink = () => {
    const nextItem: CommunicationSocialLink = {
      id: `social-${Date.now()}`,
      platform: 'New Network',
      iconKey: 'website',
      url: 'https://',
      enabled: true,
    };
    updateConfig((prev) => ({ ...prev, socialLinks: [...prev.socialLinks, nextItem] }));
  };

  const updateSocialLink = (idx: number, patch: Partial<CommunicationSocialLink>) => {
    updateConfig((prev) => {
      const next = [...prev.socialLinks];
      const current = next[idx];
      if (!current) return prev;
      const merged = { ...current, ...patch };
      if (patch.platform !== undefined && patch.iconKey === undefined) {
        merged.iconKey = inferSocialIconKey(patch.platform, current.iconKey);
      }
      next[idx] = merged;
      return { ...prev, socialLinks: next };
    });
  };

  const moveSocialLink = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= config.socialLinks.length) return;
    updateConfig((prev) => {
      const next = [...prev.socialLinks];
      const [item] = next.splice(idx, 1);
      next.splice(target, 0, item);
      return { ...prev, socialLinks: next };
    });
  };

  const removeSocialLink = (idx: number) => {
    updateConfig((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== idx),
    }));
  };

  // --- Offices helpers ---
  const addOffice = () => {
    const id = `office-${Date.now()}`;
    const nextOffice: ContactOfficeItem = {
      id,
      city: { en: 'New City Hub', ar: 'مكتب جديد' },
      country: { en: 'Country', ar: 'الدولة' },
      badge: { en: 'Regional Office', ar: 'مكتب إقليمي' },
      address: { en: 'Street Address, Building, District', ar: 'العنوان الكامل للمكتب' },
      email: `info@${config.websiteDomain || 'persici.ai'}`,
      phone: config.primaryPhone || '+44 20 0000 0000',
      hours: { en: 'Mon–Fri, 9:00 AM – 6:00 PM', ar: 'الاثنين – الجمعة، 9:00 ص – 6:00 م' },
      timezone: 'UTC+0',
      image: '',
      mapsUrl: 'https://maps.google.com',
      isHQ: false,
      directionsLabel: { en: 'Get Directions', ar: 'الاتجاهات عبر خرائط جوجل' },
    };
    updateConfig((prev) => ({ ...prev, offices: [...prev.offices, nextOffice] }));
    setExpandedOffices((prev) => ({ ...prev, [id]: true }));
  };

  const updateOffice = (idx: number, updater: (cur: ContactOfficeItem) => ContactOfficeItem) => {
    updateConfig((prev) => {
      const next = [...prev.offices];
      if (!next[idx]) return prev;
      next[idx] = updater(next[idx]);
      return { ...prev, offices: next };
    });
  };

  const moveOffice = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= config.offices.length) return;
    updateConfig((prev) => {
      const next = [...prev.offices];
      const [item] = next.splice(idx, 1);
      next.splice(target, 0, item);
      return { ...prev, offices: next };
    });
  };

  const removeOffice = (idx: number) => {
    updateConfig((prev) => ({
      ...prev,
      offices: prev.offices.filter((_, i) => i !== idx),
    }));
  };

  // --- Direct channels helpers ---
  const addChannel = () => {
    const nextChannel: ContactChannelItem = {
      id: `channel-${Date.now()}`,
      category: { en: 'General Inquiry', ar: 'استفسار عام' },
      title: { en: 'New Department Desk', ar: 'قسم تواصل جديد' },
      description: {
        en: 'Describe when clients or partners should reach out via this email.',
        ar: 'اشرح متى يتواصل العملاء أو الشركاء عبر هذا البريد.',
      },
      email: `info@${config.websiteDomain || 'persici.ai'}`,
      sla: { en: 'Within 24 Business Hours', ar: 'خلال 24 ساعة عمل' },
    };
    updateConfig((prev) => ({ ...prev, channels: [...prev.channels, nextChannel] }));
  };

  const updateChannel = (idx: number, updater: (cur: ContactChannelItem) => ContactChannelItem) => {
    updateConfig((prev) => {
      const next = [...prev.channels];
      if (!next[idx]) return prev;
      next[idx] = updater(next[idx]);
      return { ...prev, channels: next };
    });
  };

  const moveChannel = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= config.channels.length) return;
    updateConfig((prev) => {
      const next = [...prev.channels];
      const [item] = next.splice(idx, 1);
      next.splice(target, 0, item);
      return { ...prev, channels: next };
    });
  };

  const removeChannel = (idx: number) => {
    updateConfig((prev) => ({
      ...prev,
      channels: prev.channels.filter((_, i) => i !== idx),
    }));
  };

  const t = {
    title: isRtl ? 'قنوات التواصل والسوشيال ميديا' : 'Communication & Social Media',
    subtitle: isRtl
      ? 'إدارة مركزية لنطاق الموقع، الإيميلات الرسمية، أرقام الهاتف، روابط السوشيال ميديا، الفروع والعناوين، وقنوات التواصل المباشر في جميع صفحات الموقع.'
      : 'Central source of truth for website domain, corporate emails, phones, social media accounts, regional branches, and direct channels across all pages.',
    saveBtn: isRtl ? 'حفظ ونشر التغييرات' : 'Save & Publish Changes',
    savingBtn: isRtl ? 'جاري الحفظ...' : 'Saving...',
    loadingText: isRtl ? 'جاري تحميل إعدادات التواصل...' : 'Loading communication & social settings...',
  };

  if (loading) {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="flex flex-col items-center justify-center min-h-[55vh] gap-4"
      >
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-persici-crimson animate-spin" />
        <p className="text-sm font-medium text-slate-500">{t.loadingText}</p>
      </div>
    );
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-persici-crimson/10 text-persici-crimson flex items-center justify-center shrink-0">
              <TbAddressBook className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">{t.subtitle}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>
                  {isRtl
                    ? 'لإدارة حقول نموذج "تواصل معنا" واستقبال الطلبات:'
                    : 'Looking for contact form fields & inbox settings?'}
                </span>
                <Link
                  href={`/${lang}/dashboard/shared-contact${passkeySuffix}`}
                  className="inline-flex items-center gap-1 font-semibold text-persici-crimson hover:underline"
                >
                  <span>{isRtl ? 'اذهب إلى القسم العام للتواصل' : 'Go to Shared Contact Form'}</span>
                  <TbExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {dirty && (
              <span className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                {isRtl ? 'تعديلات غير محفوظة' : 'Unsaved Changes'}
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-persici-crimson hover:bg-persici-crimson/90 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <TbRefresh className="w-4 h-4 animate-spin" />
              ) : (
                <TbCheck className="w-4 h-4" />
              )}
              <span>{saving ? t.savingBtn : t.saveBtn}</span>
            </button>
          </div>
        </div>

        {/* Section Jump Pills */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <a
            href="#emails"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <TbMail className="w-4 h-4 text-persici-crimson" />
            <span>{isRtl ? 'النطاق والإيميلات والهاتف' : 'Domain, Emails & Phones'}</span>
          </a>
          <a
            href="#social"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <TbShare className="w-4 h-4 text-persici-crimson" />
            <span>
              {isRtl ? 'روابط السوشيال ميديا' : 'Social Media Links'} ({config.socialLinks.length})
            </span>
          </a>
          <a
            href="#offices"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <TbBuildingSkyscraper className="w-4 h-4 text-persici-crimson" />
            <span>
              {isRtl ? 'الفروع والعناوين' : 'Branches & Addresses'} ({config.offices.length})
            </span>
          </a>
          <a
            href="#channels"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <TbMessageDots className="w-4 h-4 text-persici-crimson" />
            <span>
              {isRtl ? 'قنوات التواصل المباشر' : 'Direct Channels'} ({config.channels.length})
            </span>
          </a>
        </div>

        {statusMessage && (
          <div
            className={`mt-5 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <TbCheck className="w-5 h-5 shrink-0" />
            ) : (
              <TbAlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* SECTION 1: WEBSITE DOMAIN, CORPORATE EMAILS & PHONES */}
      <section
        id="emails"
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm scroll-mt-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <TbWorld className="w-5 h-5 text-persici-crimson" />
              <h2 className="text-lg font-bold text-slate-900">
                {isRtl
                  ? '1. نطاق الموقع والإيميلات الرسمية وأرقام الهاتف'
                  : '1. Website Domain, Corporate Emails & Primary Phones'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isRtl
                ? 'عند تغيير النطاق، يمكنك تطبيق النطاق الجديد بضغطة واحدة على جميع إيميلات الشركة والفروع والأقسام.'
                : 'Change your website domain once and cascade it across all corporate, office, and department emails in one click.'}
            </p>
            <WhereThisAppears
              isRtl={isRtl}
              locations={[
                { label: isRtl ? 'تذييل الموقع (Footer)' : 'Site Footer', href: `/${lang}` },
                { label: isRtl ? 'صفحة تواصل معنا' : 'Contact Page', href: `/${lang}/contact` },
                { label: isRtl ? 'صفحة الوظائف (بريد الموارد البشرية)' : 'Careers Page (HR Email)', href: `/${lang}/careers` },
              ]}
            />
          </div>
        </div>

        {/* Domain & Bulk Apply Banner */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isRtl ? 'نطاق الموقع الرئيسي (Domain)' : 'Primary Website Domain'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={config.websiteDomain}
                onChange={(e) =>
                  updateConfig((prev) => ({ ...prev, websiteDomain: e.target.value }))
                }
                placeholder="persici.ai"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isRtl ? 'رابط الموقع الكامل (URL)' : 'Full Website URL'}
              </label>
              <input
                type="url"
                dir="ltr"
                value={config.websiteUrl}
                onChange={(e) =>
                  updateConfig((prev) => ({ ...prev, websiteUrl: e.target.value }))
                }
                placeholder="https://persici.ai"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/70">
            <p className="text-xs text-slate-500">
              {isRtl
                ? `سيتم استبدال جزء @ في كافة الإيميلات أدناه وفي المكاتب والقنوات إلى @${
                    config.websiteDomain || 'persici.ai'
                  }`
                : `Rewrites the @domain suffix across all 6 corporate emails, ${config.offices.length} offices, and ${config.channels.length} direct channels.`}
            </p>
            <button
              type="button"
              onClick={handleApplyDomainToAllEmails}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer"
            >
              <TbSparkles className="w-4 h-4 text-amber-300" />
              <span>
                {isRtl ? 'تطبيق النطاق على جميع الإيميلات' : 'Apply Domain to All Emails'}
              </span>
            </button>
          </div>
        </div>

        {/* 6 Corporate Emails Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              key: 'infoEmail' as const,
              label: isRtl ? 'البريد العام (Info)' : 'General / Info Email',
              hint: isRtl ? 'يظهر في تذييل الموقع' : 'Shown in Site Footer',
            },
            {
              key: 'supportEmail' as const,
              label: isRtl ? 'بريد الدعم الفني (Support)' : 'Technical Support Email',
              hint: isRtl ? 'يظهر في التذييل إذا اختلف عن Info' : 'Shown in Footer if distinct',
            },
            {
              key: 'hrEmail' as const,
              label: isRtl ? 'بريد الموارد البشرية (HR / Careers)' : 'Careers / HR Email',
              hint: isRtl ? 'مرتبط مباشرة بصفحة الوظائف' : 'Synced to /careers Spontaneous CTA',
            },
            {
              key: 'growthEmail' as const,
              label: isRtl ? 'بريد المبيعات والنمو (Growth)' : 'Enterprise & Growth Email',
              hint: isRtl ? 'استفسارات المشاريع والشركات' : 'New solutions & RFPs',
            },
            {
              key: 'partnersEmail' as const,
              label: isRtl ? 'بريد الشراكات (Partners)' : 'Partnerships Email',
              hint: isRtl ? 'التحالفات والتكامل التقني' : 'Alliances & ecosystem',
            },
            {
              key: 'pressEmail' as const,
              label: isRtl ? 'بريد الإعلام والصحافة (Press)' : 'Press & Media Email',
              hint: isRtl ? 'التصريحات الإعلامية والفعاليات' : 'Media & keynote inquiries',
            },
          ].map((field) => (
            <div key={field.key} className="p-4 rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-2 mb-1">
                <label className="text-xs font-bold text-slate-800">{field.label}</label>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {field.hint}
                </span>
              </div>
              <input
                type="email"
                dir="ltr"
                value={config[field.key]}
                onChange={(e) =>
                  updateConfig((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                className="mt-1.5 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
              />
            </div>
          ))}
        </div>

        {/* Phones Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 mb-1.5">
              <TbPhone className="w-4 h-4 text-persici-crimson" />
              <label className="text-xs font-bold text-slate-800">
                {isRtl ? 'رقم الهاتف الرئيسي (يظهر في التذييل)' : 'Primary Contact Phone (Footer)'}
              </label>
            </div>
            <input
              type="text"
              dir="ltr"
              value={config.primaryPhone}
              onChange={(e) =>
                updateConfig((prev) => ({ ...prev, primaryPhone: e.target.value }))
              }
              placeholder="+44 20 8068 9670"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
            />
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 mb-1.5">
              <TbBrandWhatsapp className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-slate-800">
                {isRtl ? 'رقم واتساب للأعمال (اختياري)' : 'WhatsApp Business Number (Optional)'}
              </label>
            </div>
            <input
              type="text"
              dir="ltr"
              value={config.whatsappNumber || ''}
              onChange={(e) =>
                updateConfig((prev) => ({ ...prev, whatsappNumber: e.target.value }))
              }
              placeholder="+44 20 8068 9670"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: SOCIAL MEDIA LINKS */}
      <section
        id="social"
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm scroll-mt-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <TbShare className="w-5 h-5 text-persici-crimson" />
              <h2 className="text-lg font-bold text-slate-900">
                {isRtl ? '2. روابط منصات التواصل الاجتماعي' : '2. Corporate Social Media Links'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isRtl
                ? 'أضف أو أعد ترتيب أو أخفِ حسابات التواصل الاجتماعي؛ المنصات المفعلة فقط ستظهر في الموقع.'
                : 'Add, reorder, edit, or hide official social profiles. Only enabled items render on the public site.'}
            </p>
            <WhereThisAppears
              isRtl={isRtl}
              locations={[
                { label: isRtl ? 'تذييل الموقع (أيقونات التواصل)' : 'Site Footer Social Icons', href: `/${lang}` },
                {
                  label: isRtl ? 'مُنشئ تذييل الموقع (متزامن)' : 'Footer Columns Builder (Synced)',
                },
              ]}
            />
          </div>

          <button
            type="button"
            onClick={addSocialLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 cursor-pointer"
          >
            <TbPlus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة منصة تواصل' : 'Add Social Profile'}</span>
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {config.socialLinks.map((social, idx) => (
            <div
              key={social.id}
              className={`p-4 rounded-2xl border transition-colors ${
                social.enabled
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-50/70 border-slate-200/70 opacity-75'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                {/* Preview Icon + Enabled */}
                <div className="lg:col-span-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                    {renderSocialPlatformIcon(social.iconKey, 'w-5 h-5')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      {isRtl ? 'اسم المنصة' : 'Platform Name'}
                    </label>
                    <input
                      type="text"
                      value={social.platform}
                      onChange={(e) => updateSocialLink(idx, { platform: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:border-persici-crimson"
                    />
                  </div>
                </div>

                {/* Icon Selector */}
                <div className="lg:col-span-3">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    {isRtl ? 'الأيقونة' : 'Icon Key'}
                  </label>
                  <select
                    value={social.iconKey}
                    onChange={(e) =>
                      updateSocialLink(idx, { iconKey: e.target.value as SocialIconKey })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-persici-crimson"
                  >
                    {SOCIAL_ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* URL */}
                <div className="lg:col-span-4">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    {isRtl ? 'رابط الحساب (URL)' : 'Profile URL'}
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    value={social.url}
                    onChange={(e) => updateSocialLink(idx, { url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono focus:bg-white focus:outline-none focus:border-persici-crimson"
                  />
                </div>

                {/* Actions */}
                <div className="lg:col-span-2 flex items-center justify-end gap-1.5 pt-3 lg:pt-4">
                  <button
                    type="button"
                    onClick={() => updateSocialLink(idx, { enabled: !social.enabled })}
                    title={social.enabled ? 'Visible on site' : 'Hidden on site'}
                    className={`p-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                      social.enabled
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    {social.enabled ? (
                      <TbEye className="w-4 h-4" />
                    ) : (
                      <TbEyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSocialLink(idx, -1)}
                    disabled={idx === 0}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    title={isRtl ? 'نقل للأعلى' : 'Move up'}
                  >
                    <TbArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSocialLink(idx, 1)}
                    disabled={idx === config.socialLinks.length - 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    title={isRtl ? 'نقل للأسفل' : 'Move down'}
                  >
                    <TbArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSocialLink(idx)}
                    className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title={isRtl ? 'حذف' : 'Delete'}
                  >
                    <TbTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: BRANCHES, OFFICES & ADDRESSES */}
      <section
        id="offices"
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm scroll-mt-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <TbBuildingSkyscraper className="w-5 h-5 text-persici-crimson" />
              <h2 className="text-lg font-bold text-slate-900">
                {isRtl ? '3. الفروع والمقرات والعناوين' : '3. Global Branches, Offices & Addresses'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isRtl
                ? 'بيانات المكاتب والفروع تظهر تلقائياً في صفحة "تواصل معنا" وشريط المدن في التذييل.'
                : 'Offices sync automatically with the Contact page Regional Hubs grid and the Site Footer city presence bar.'}
            </p>
            <WhereThisAppears
              isRtl={isRtl}
              locations={[
                {
                  label: isRtl ? 'صفحة تواصل معنا — قسم المكاتب' : 'Contact Page — Regional Hubs',
                  href: `/${lang}/contact#offices`,
                },
                { label: isRtl ? 'شريط المدن في التذييل' : 'Footer Office Hubs Bar', href: `/${lang}` },
                {
                  label: isRtl ? 'محرر صفحة تواصل معنا (مرتبط)' : 'Contact Page Editor (Linked)',
                },
              ]}
            />
          </div>

          <button
            type="button"
            onClick={addOffice}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 cursor-pointer"
          >
            <TbPlus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة فرع / مكتب' : 'Add Branch / Office'}</span>
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {config.offices.map((office, idx) => {
            const isExpanded = expandedOffices[office.id] ?? idx === 0;
            return (
              <div
                key={office.id}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50"
              >
                {/* Office Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-white border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedOffices((prev) => ({
                        ...prev,
                        [office.id]: !isExpanded,
                      }))
                    }
                    className="flex items-center gap-3 text-start cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-persici-crimson/10 text-persici-crimson flex items-center justify-center shrink-0">
                      <TbMapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {isRtl ? office.city.ar || office.city.en : office.city.en}
                        </span>
                        {office.isHQ && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            <TbStarFilled className="w-3 h-3" />
                            <span>HQ</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        {office.email} · {office.phone}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOffices((prev) => ({
                          ...prev,
                          [office.id]: !isExpanded,
                        }))
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      {isExpanded ? (isRtl ? 'طي' : 'Collapse') : isRtl ? 'تعديل' : 'Edit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => moveOffice(idx, -1)}
                      disabled={idx === 0}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <TbArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveOffice(idx, 1)}
                      disabled={idx === config.offices.length - 1}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <TbArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeOffice(idx)}
                      className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Office Fields */}
                {isExpanded && (
                  <div className="p-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          City Name (EN)
                        </label>
                        <input
                          type="text"
                          value={office.city.en}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({
                              ...cur,
                              city: { ...cur.city, en: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          اسم المدينة (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={office.city.ar}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({
                              ...cur,
                              city: { ...cur.city, ar: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-arabic"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Country (EN)
                        </label>
                        <input
                          type="text"
                          value={office.country.en}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({
                              ...cur,
                              country: { ...cur.country, en: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          الدولة (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={office.country.ar}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({
                              ...cur,
                              country: { ...cur.country, ar: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-arabic"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Role Badge (EN)
                        </label>
                        <input
                          type="text"
                          value={office.badge?.en || ''}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({
                              ...cur,
                              badge: { en: e.target.value, ar: cur.badge?.ar || '' },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          شارة الدور (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={office.badge?.ar || ''}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({
                              ...cur,
                              badge: { en: cur.badge?.en || '', ar: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-arabic"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Street Address (EN)
                        </label>
                        <input
                          type="text"
                          value={office.address.en}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({
                              ...cur,
                              address: { ...cur.address, en: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          عنوان الشارع والمبنى (AR)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={office.address.ar}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({
                              ...cur,
                              address: { ...cur.address, ar: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-arabic"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isRtl ? 'بريد الفرع' : 'Branch Email'}
                        </label>
                        <input
                          type="email"
                          dir="ltr"
                          value={office.email}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({ ...cur, email: e.target.value }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isRtl ? 'هاتف الفرع' : 'Branch Phone'}
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={office.phone}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({ ...cur, phone: e.target.value }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isRtl ? 'المنطقة الزمنية' : 'Timezone'}
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={office.timezone}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({ ...cur, timezone: e.target.value }))
                          }
                          placeholder="GMT / BST"
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                          <TbClock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Working Hours (EN)</span>
                        </label>
                        <input
                          type="text"
                          value={office.hours.en}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({
                              ...cur,
                              hours: { ...cur.hours, en: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                          <TbClock className="w-3.5 h-3.5 text-slate-400" />
                          <span>ساعات العمل (AR)</span>
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={office.hours.ar}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({
                              ...cur,
                              hours: { ...cur.hours, ar: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-arabic"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isRtl ? 'رابط خرائط جوجل (Google Maps URL)' : 'Google Maps Directions URL'}
                        </label>
                        <input
                          type="url"
                          dir="ltr"
                          value={office.mapsUrl}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({ ...cur, mapsUrl: e.target.value }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-mono"
                        />
                      </div>
                      <label className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(office.isHQ)}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({ ...cur, isHQ: e.target.checked }))
                          }
                          className="rounded border-slate-300 text-persici-crimson focus:ring-persici-crimson"
                        />
                        <span className="text-xs font-bold text-slate-700">
                          {isRtl ? 'المقر الرئيسي للشركة (Global HQ)' : 'Global Headquarters (HQ)'}
                        </span>
                      </label>
                    </div>

                    {/* Office Photo + R2 Picker */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
                      {office.image ? (
                        <Image
                          src={office.image}
                          alt={office.city.en || 'Office'}
                          width={96}
                          height={64}
                          unoptimized
                          className="w-24 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-24 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <TbPhoto className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isRtl ? 'صورة الفرع' : 'Branch Image URL'}
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={office.image}
                          onChange={(e) =>
                            updateOffice(idx, (cur) => ({ ...cur, image: e.target.value }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setMediaTargetOfficeIdx(idx)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        <TbPhoto className="w-4 h-4" />
                        <span>{isRtl ? 'اختر من مكتبة R2' : 'Browse R2 Media'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: DIRECT DEPARTMENT CHANNELS */}
      <section
        id="channels"
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm scroll-mt-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <TbMessageDots className="w-5 h-5 text-persici-crimson" />
              <h2 className="text-lg font-bold text-slate-900">
                {isRtl
                  ? '4. قنوات التواصل المباشر حسب القسم'
                  : '4. Direct Department Communication Channels'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isRtl
                ? 'بطاقات التواصل السريع (استشارات الشركات، الشراكات، الصحافة، التوظيف) المرتبطة بصفحة تواصل معنا.'
                : 'Department cards (Enterprise Growth, Partnerships, Media, Careers) displayed in the Contact page Direct Channels matrix.'}
            </p>
            <WhereThisAppears
              isRtl={isRtl}
              locations={[
                {
                  label: isRtl ? 'صفحة تواصل معنا — القنوات المباشرة' : 'Contact Page — Direct Channels',
                  href: `/${lang}/contact#channels`,
                },
                {
                  label: isRtl ? 'محرر صفحة تواصل معنا (مرتبط)' : 'Contact Page Editor (Linked)',
                },
              ]}
            />
          </div>

          <button
            type="button"
            onClick={addChannel}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 cursor-pointer"
          >
            <TbPlus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة قناة تواصل' : 'Add Direct Channel'}</span>
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {config.channels.map((ch, idx) => (
            <div
              key={ch.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-slate-900">
                  #{idx + 1} · {isRtl ? ch.title.ar || ch.title.en : ch.title.en}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveChannel(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <TbArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveChannel(idx, 1)}
                    disabled={idx === config.channels.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <TbArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeChannel(idx)}
                    className="p-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <TbTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department Email
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={ch.email}
                    onChange={(e) =>
                      updateChannel(idx, (cur) => ({ ...cur, email: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category Tag (EN)
                  </label>
                  <input
                    type="text"
                    value={ch.category.en}
                    onChange={(e) =>
                      updateChannel(idx, (cur) => ({
                        ...cur,
                        category: { ...cur.category, en: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    تصنيف القناة (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={ch.category.ar}
                    onChange={(e) =>
                      updateChannel(idx, (cur) => ({
                        ...cur,
                        category: { ...cur.category, ar: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Channel Title (EN)
                  </label>
                  <input
                    type="text"
                    value={ch.title.en}
                    onChange={(e) =>
                      updateChannel(idx, (cur) => ({
                        ...cur,
                        title: { ...cur.title, en: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    عنوان القناة (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={ch.title.ar}
                    onChange={(e) =>
                      updateChannel(idx, (cur) => ({
                        ...cur,
                        title: { ...cur.title, ar: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-arabic"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description (EN)
                  </label>
                  <textarea
                    rows={2}
                    value={ch.description.en}
                    onChange={(e) =>
                      updateChannel(idx, (cur) => ({
                        ...cur,
                        description: { ...cur.description, en: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    وصف القناة (AR)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={ch.description.ar}
                    onChange={(e) =>
                      updateChannel(idx, (cur) => ({
                        ...cur,
                        description: { ...cur.description, ar: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-arabic"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Response SLA (EN)
                  </label>
                  <input
                    type="text"
                    value={ch.sla.en}
                    onChange={(e) =>
                      updateChannel(idx, (cur) => ({
                        ...cur,
                        sla: { ...cur.sla, en: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    سرعة الاستجابة (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={ch.sla.ar}
                    onChange={(e) =>
                      updateChannel(idx, (cur) => ({
                        ...cur,
                        sla: { ...cur.sla, ar: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-arabic"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MediaPickerModal
        isOpen={mediaTargetOfficeIdx !== null}
        allowedType="image"
        defaultFolder="contact/offices"
        onClose={() => setMediaTargetOfficeIdx(null)}
        onSelect={(url) => {
          if (mediaTargetOfficeIdx !== null) {
            updateOffice(mediaTargetOfficeIdx, (cur) => ({ ...cur, image: url }));
          }
          setMediaTargetOfficeIdx(null);
        }}
      />
    </div>
  );
}
