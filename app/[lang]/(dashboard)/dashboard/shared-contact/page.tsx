'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SectionAccordion } from '@dashboard-shared/components/editor/section-accordion';
import { MediaPickerModal } from '@dashboard-shared/components/media/media-picker-modal';
import {
  TbDeviceFloppy,
  TbExternalLink,
  TbPhoto,
  TbCheck,
  TbAlertCircle,
  TbPlus,
  TbTrash,
  TbArrowUp,
  TbArrowDown,
  TbForms,
  TbShieldCheck,
  TbWorld,
  TbHelpCircle,
  TbSparkles,
  TbRefresh,
} from 'react-icons/tb';
import { defaultSharedContactData } from '@shared/data';

interface ReasonItem {
  id: string;
  labelEn: string;
  labelAr: string;
}

interface FormFieldItem {
  id: string;
  name: string;
  labelEn: string;
  labelAr: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'tel';
  required: boolean;
}

interface StrategicPoint {
  en: string;
  ar: string;
}

export default function SharedContactManagerPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  const [loading, setLoading] = useState(true);
  const [savingAll, setSavingAll] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({
    leftTitleEn: '',
    leftTitleAr: '',
    titleEn: '',
    titleAr: '',
    subtitleEn: '',
    subtitleAr: '',
    trustedByEn: '',
    trustedByAr: '',
    successTitleEn: '',
    successTitleAr: '',
    successMessageEn: '',
    successMessageAr: '',
    bgImage: '/images/footer/footer.gif',
    showLogosSwiper: true,
    captchaEnabled: true,
    captchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    points: [] as StrategicPoint[],
    countries: [] as string[],
    reasons: [] as ReasonItem[],
    fields: [] as FormFieldItem[],
  });

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Load existing content from API
  useEffect(() => {
    let mounted = true;
    async function loadContent() {
      try {
        setLoading(true);
        const res = await fetch('/api/content/shared-contact');
        const data = res.ok ? await res.json() : null;

        if (mounted) {
          const base = data && typeof data === 'object' && Object.keys(data).length > 0
            ? data
            : defaultSharedContactData;

          setFormData({
            leftTitleEn: base.leftTitle?.en || defaultSharedContactData.leftTitle.en,
            leftTitleAr: base.leftTitle?.ar || defaultSharedContactData.leftTitle.ar,
            titleEn: base.title?.en || defaultSharedContactData.title.en,
            titleAr: base.title?.ar || defaultSharedContactData.title.ar,
            subtitleEn: base.subtitle?.en || defaultSharedContactData.subtitle.en,
            subtitleAr: base.subtitle?.ar || defaultSharedContactData.subtitle.ar,
            trustedByEn: base.trustedBy?.en || defaultSharedContactData.trustedBy.en,
            trustedByAr: base.trustedBy?.ar || defaultSharedContactData.trustedBy.ar,
            successTitleEn: base.successTitle?.en || defaultSharedContactData.successTitle.en,
            successTitleAr: base.successTitle?.ar || defaultSharedContactData.successTitle.ar,
            successMessageEn: base.successMessage?.en || defaultSharedContactData.successMessage.en,
            successMessageAr: base.successMessage?.ar || defaultSharedContactData.successMessage.ar,
            bgImage: base.bgImage || defaultSharedContactData.bgImage,
            showLogosSwiper: base.showLogosSwiper !== false,
            captchaEnabled: base.captchaEnabled !== false,
            captchaSiteKey: base.captchaSiteKey || defaultSharedContactData.captchaSiteKey,
            points: Array.isArray(base.points) && base.points.length > 0 ? base.points : defaultSharedContactData.points,
            countries: Array.isArray(base.countries) && base.countries.length > 0 ? base.countries : defaultSharedContactData.countries,
            reasons: Array.isArray(base.reasons) && base.reasons.length > 0 ? base.reasons : defaultSharedContactData.reasons,
            fields: Array.isArray(base.fields) && base.fields.length > 0 ? base.fields : defaultSharedContactData.fields,
          });
        }
      } catch (err) {
        console.error('[SharedContactManager] Load error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadContent();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveAll = async () => {
    try {
      setSavingAll(true);
      setErrorMessage(null);

      const payload = {
        page: 'shared-contact',
        leftTitle: {
          en: formData.leftTitleEn,
          ar: formData.leftTitleAr,
        },
        title: {
          en: formData.titleEn,
          ar: formData.titleAr,
        },
        subtitle: {
          en: formData.subtitleEn,
          ar: formData.subtitleAr,
        },
        trustedBy: {
          en: formData.trustedByEn,
          ar: formData.trustedByAr,
        },
        successTitle: {
          en: formData.successTitleEn,
          ar: formData.successTitleAr,
        },
        successMessage: {
          en: formData.successMessageEn,
          ar: formData.successMessageAr,
        },
        bgImage: formData.bgImage,
        showLogosSwiper: formData.showLogosSwiper,
        captchaEnabled: formData.captchaEnabled,
        captchaSiteKey: formData.captchaSiteKey,
        points: formData.points,
        countries: formData.countries,
        reasons: formData.reasons,
        fields: formData.fields,
      };

      const res = await fetch('/api/content/shared-contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save shared contact configuration.');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSavingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-persici-crimson rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium">Loading Shared Contact Configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Header & Save All Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-persici-crimson font-mono flex items-center gap-1.5">
              <TbForms className="w-4 h-4" />
              <span>Global Shared Section</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Shared Contact & Discovery Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            This section appears at the bottom of all site pages (Home, About, Services, etc.).
            Edits saved here immediately reflect site-wide.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/${lang}#contact`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-xs"
          >
            <span>View Live Section</span>
            <TbExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={savingAll}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              saveSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-persici-crimson hover:bg-red-600 text-white shadow-persici-crimson/25 disabled:opacity-50'
            }`}
          >
            <TbDeviceFloppy className="w-4 h-4" />
            <span>
              {savingAll ? 'Publishing Changes...' : saveSuccess ? 'Published Site-Wide!' : 'Save & Publish Globally'}
            </span>
          </button>
        </div>
      </div>

      {/* Notification Banners */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <TbCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Success! Global Shared Contact section saved to MongoDB Atlas and all site pages revalidated.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <TbAlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Section 1: Bilingual Headlines & Strategic Pitch */}
      <SectionAccordion
        number={1}
        title="1. Headlines, Strategic Pitch & Success Message"
        description="Left-column pitch title, right-column form titles, trust row tagline, and submission success modal copy"
        isOpenDefault={true}
        onSave={handleSaveAll}
        saving={savingAll}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Left Pitch Title (English)
              </label>
              <input
                type="text"
                value={formData.leftTitleEn}
                onChange={(e) => setFormData({ ...formData, leftTitleEn: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان الدعوة للتواصل (العربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={formData.leftTitleAr}
                onChange={(e) => setFormData({ ...formData, leftTitleAr: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Form Main Title (English)
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                عنوان نموذج التواصل (العربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={formData.titleAr}
                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Form Subtitle / Guidance (English)
              </label>
              <textarea
                rows={2}
                value={formData.subtitleEn}
                onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                الوصف التوجيهي للنموذج (العربية)
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={formData.subtitleAr}
                onChange={(e) => setFormData({ ...formData, subtitleAr: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Trusted By Row Tagline (English)
              </label>
              <input
                type="text"
                value={formData.trustedByEn}
                onChange={(e) => setFormData({ ...formData, trustedByEn: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                نص شريط ثقة الشركاء (العربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={formData.trustedByAr}
                onChange={(e) => setFormData({ ...formData, trustedByAr: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Form Submission Success State Modal
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Success Title EN (e.g. Thank you for reaching out!)"
                value={formData.successTitleEn}
                onChange={(e) => setFormData({ ...formData, successTitleEn: e.target.value })}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
              />
              <input
                type="text"
                dir="rtl"
                placeholder="عنوان النجاح AR (مثال: شكراً لتواصلك معنا!)"
                value={formData.successTitleAr}
                onChange={(e) => setFormData({ ...formData, successTitleAr: e.target.value })}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
              />
              <textarea
                rows={2}
                placeholder="Success Message EN"
                value={formData.successMessageEn}
                onChange={(e) => setFormData({ ...formData, successMessageEn: e.target.value })}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
              />
              <textarea
                rows={2}
                dir="rtl"
                placeholder="رسالة النجاح AR"
                value={formData.successMessageAr}
                onChange={(e) => setFormData({ ...formData, successMessageAr: e.target.value })}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
              />
            </div>
          </div>
        </div>
      </SectionAccordion>

      {/* Section 2: 4 Strategic Checklist Value Propositions */}
      <SectionAccordion
        number={2}
        title="2. Strategic Checklist Value Propositions"
        description="The bullet points displayed with checkmarks on the left side of the contact card"
        onSave={handleSaveAll}
        saving={savingAll}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Checklist Points ({(formData.points || []).length})
            </span>
            <button
              type="button"
              onClick={() => {
                const existing = formData.points || [];
                setFormData({
                  ...formData,
                  points: [
                    ...existing,
                    {
                      en: 'Accelerate digital growth with enterprise AI and modern platform engineering',
                      ar: 'تسريع النمو الرقمي بحلول الذكاء الاصطناعي وهندسة المنصات الحديثة',
                    },
                  ],
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <TbPlus className="w-3.5 h-3.5" />
              <span>Add Checklist Point</span>
            </button>
          </div>

          {(formData.points || []).map((pt: any, idx: number) => {
            const pointEn = typeof pt === 'string' ? pt : pt.en || '';
            const pointAr = typeof pt === 'string' ? '' : pt.ar || '';

            return (
              <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-persici-crimson/10 text-persici-crimson text-[11px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">Checklist Item #{idx + 1}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const updated = [...formData.points];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setFormData({ ...formData, points: updated });
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move Up"
                    >
                      <TbArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === formData.points.length - 1}
                      onClick={() => {
                        if (idx === formData.points.length - 1) return;
                        const updated = [...formData.points];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setFormData({ ...formData, points: updated });
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move Down"
                    >
                      <TbArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formData.points];
                        updated.splice(idx, 1);
                        setFormData({ ...formData, points: updated });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Point"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Checklist point in English"
                    value={pointEn}
                    onChange={(e) => {
                      const updated = [...formData.points];
                      updated[idx] = { en: e.target.value, ar: pointAr };
                      setFormData({ ...formData, points: updated });
                    }}
                    className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="نص النقطة بالعربية"
                    value={pointAr}
                    onChange={(e) => {
                      const updated = [...formData.points];
                      updated[idx] = { en: pointEn, ar: e.target.value };
                      setFormData({ ...formData, points: updated });
                    }}
                    className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SectionAccordion>

      {/* Section 3: Visual Presentation & Media Assets */}
      <SectionAccordion
        number={3}
        title="3. Animated Background GIF & Logos Marquee"
        description="Cloudflare R2 animated background visual and client logos swiper controls"
        onSave={handleSaveAll}
        saving={savingAll}
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Animated Section Background Media (GIF / WebP)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.bgImage || '/images/footer/footer.gif'}
                alt="Backdrop Preview"
                className="w-24 h-16 object-cover rounded-lg border border-slate-300 bg-black shrink-0"
              />
              <div className="flex-1 w-full flex items-center gap-2">
                <input
                  type="text"
                  value={formData.bgImage}
                  onChange={(e) => setFormData({ ...formData, bgImage: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono text-[11px] bg-white"
                />
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors"
                >
                  <TbPhoto className="w-3.5 h-3.5" />
                  <span>Pick Media</span>
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Standard fallback path is <code className="text-slate-700">/images/footer/footer.gif</code>. You can choose any high-resolution animated loop or image from Cloudflare R2.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Client Logos Swiper Marquee
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Displays the horizontal scrolling logo marquee in the trust section at the bottom of the card.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.showLogosSwiper}
                onChange={(e) => setFormData({ ...formData, showLogosSwiper: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-persici-crimson" />
            </label>
          </div>
        </div>
      </SectionAccordion>

      {/* Section 4: Dynamic Form Fields Manager */}
      <SectionAccordion
        number={4}
        title="4. Form Fields Schema & Order Manager"
        description="Add, remove, reorder, and configure individual contact form fields and validation rules"
        onSave={handleSaveAll}
        saving={savingAll}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Form Fields ({(formData.fields || []).length})
              </span>
              <p className="text-[11px] text-slate-500">
                Manage the labels, field types, and whether each field is mandatory.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const existing = formData.fields || [];
                const newField: FormFieldItem = {
                  id: `field_${Date.now()}`,
                  name: `customField_${existing.length + 1}`,
                  labelEn: 'New Field',
                  labelAr: 'حقل جديد',
                  type: 'text',
                  required: false,
                };
                setFormData({ ...formData, fields: [...existing, newField] });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <TbPlus className="w-3.5 h-3.5" />
              <span>Add Form Field</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {(formData.fields || []).map((f: FormFieldItem, fIdx: number) => (
              <div
                key={f.id || fIdx}
                className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono font-bold">
                      {fIdx + 1}
                    </span>
                    <span className="font-semibold text-xs text-slate-800">
                      {f.labelEn} <span className="text-slate-400 font-mono text-[11px]">({f.name})</span>
                    </span>
                    {f.required && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                        Required *
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={fIdx === 0}
                      onClick={() => {
                        if (fIdx === 0) return;
                        const updated = [...formData.fields];
                        const temp = updated[fIdx - 1];
                        updated[fIdx - 1] = updated[fIdx];
                        updated[fIdx] = temp;
                        setFormData({ ...formData, fields: updated });
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move Up"
                    >
                      <TbArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={fIdx === formData.fields.length - 1}
                      onClick={() => {
                        if (fIdx === formData.fields.length - 1) return;
                        const updated = [...formData.fields];
                        const temp = updated[fIdx + 1];
                        updated[fIdx + 1] = updated[fIdx];
                        updated[fIdx] = temp;
                        setFormData({ ...formData, fields: updated });
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move Down"
                    >
                      <TbArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formData.fields];
                        updated.splice(fIdx, 1);
                        setFormData({ ...formData, fields: updated });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Field"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Label (EN)</label>
                    <input
                      type="text"
                      value={f.labelEn}
                      onChange={(e) => {
                        const updated = [...formData.fields];
                        updated[fIdx] = { ...f, labelEn: e.target.value };
                        setFormData({ ...formData, fields: updated });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">التسمية (AR)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={f.labelAr}
                      onChange={(e) => {
                        const updated = [...formData.fields];
                        updated[fIdx] = { ...f, labelAr: e.target.value };
                        setFormData({ ...formData, fields: updated });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Field Type</label>
                    <select
                      value={f.type}
                      onChange={(e) => {
                        const updated = [...formData.fields];
                        updated[fIdx] = { ...f, type: e.target.value as any };
                        setFormData({ ...formData, fields: updated });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                    >
                      <option value="text">Text Input</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone / Tel</option>
                      <option value="select">Dropdown Select</option>
                      <option value="textarea">Textarea (Multiline)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={f.required}
                        onChange={(e) => {
                          const updated = [...formData.fields];
                          updated[fIdx] = { ...f, required: e.target.checked };
                          setFormData({ ...formData, fields: updated });
                        }}
                        className="h-3.5 w-3.5 accent-persici-crimson rounded cursor-pointer"
                      />
                      <span>Mandatory Field</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* Section 5: Countries & Territories Dropdown Options */}
      <SectionAccordion
        number={5}
        title="5. Countries & Territories Select Dropdown"
        description="Manage the selectable list of countries available in the Country dropdown field"
        onSave={handleSaveAll}
        saving={savingAll}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Active Countries ({(formData.countries || []).length})
              </span>
              <p className="text-[11px] text-slate-500">
                Add, reorder, or edit countries presented in the inquiry form dropdown.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    countries: defaultSharedContactData.countries,
                  });
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Reset to default GCC & international preset"
              >
                <TbRefresh className="w-3.5 h-3.5" />
                <span>Restore Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const existing = formData.countries || [];
                  setFormData({ ...formData, countries: [...existing, 'New Country'] });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                <TbPlus className="w-3.5 h-3.5" />
                <span>Add Country</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {(formData.countries || []).map((country: string, cIdx: number) => (
              <div
                key={cIdx}
                className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg shadow-2xs"
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 w-5 text-center">
                  {cIdx + 1}
                </span>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => {
                    const updated = [...formData.countries];
                    updated[cIdx] = e.target.value;
                    setFormData({ ...formData, countries: updated });
                  }}
                  className="flex-1 px-2 py-0.5 text-xs border border-slate-200 rounded bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...formData.countries];
                    updated.splice(cIdx, 1);
                    setFormData({ ...formData, countries: updated });
                  }}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  title="Remove Country"
                >
                  <TbTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* Section 6: Reasons for Contacting Dropdown Options */}
      <SectionAccordion
        number={6}
        title="6. Reasons for Contacting (Inquiry Types)"
        description="Bilingual options for the 'Reason for contacting' select menu"
        onSave={handleSaveAll}
        saving={savingAll}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Reason Options ({(formData.reasons || []).length})
              </span>
              <p className="text-[11px] text-slate-500">
                Define the service or strategic reasons a prospective client can pick.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const existing = formData.reasons || [];
                const newReason: ReasonItem = {
                  id: `reason_${Date.now()}`,
                  labelEn: 'New Strategic Service',
                  labelAr: 'خدمة استراتيجية جديدة',
                };
                setFormData({ ...formData, reasons: [...existing, newReason] });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <TbPlus className="w-3.5 h-3.5" />
              <span>Add Reason</span>
            </button>
          </div>

          <div className="space-y-2">
            {(formData.reasons || []).map((reason: ReasonItem, rIdx: number) => (
              <div
                key={reason.id || rIdx}
                className="p-3 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-[200px] grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Key / ID (e.g. ai-automation)"
                    value={reason.id}
                    onChange={(e) => {
                      const updated = [...formData.reasons];
                      updated[rIdx] = { ...reason, id: e.target.value };
                      setFormData({ ...formData, reasons: updated });
                    }}
                    className="px-2 py-1 text-xs border border-slate-200 rounded font-mono text-[11px]"
                  />
                  <input
                    type="text"
                    placeholder="Reason in English"
                    value={reason.labelEn}
                    onChange={(e) => {
                      const updated = [...formData.reasons];
                      updated[rIdx] = { ...reason, labelEn: e.target.value };
                      setFormData({ ...formData, reasons: updated });
                    }}
                    className="px-2 py-1 text-xs border border-slate-200 rounded"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="السبب بالعربية"
                    value={reason.labelAr}
                    onChange={(e) => {
                      const updated = [...formData.reasons];
                      updated[rIdx] = { ...reason, labelAr: e.target.value };
                      setFormData({ ...formData, reasons: updated });
                    }}
                    className="px-2 py-1 text-xs border border-slate-200 rounded"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updated = [...formData.reasons];
                    updated.splice(rIdx, 1);
                    setFormData({ ...formData, reasons: updated });
                  }}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  title="Remove Reason"
                >
                  <TbTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* Section 7: Google reCAPTCHA v2 Security & API Credentials */}
      <SectionAccordion
        number={7}
        title="7. Google reCAPTCHA v2 Security & API Keys"
        description="Toggle live reCAPTCHA bot verification and configure your Google Cloud API Site Key"
        onSave={handleSaveAll}
        saving={savingAll}
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-persici-crimson/10 text-persici-crimson">
                  <TbShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    Enable Google reCAPTCHA v2 Verification
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    When active, clients must check the &ldquo;I&rsquo;m not a robot&rdquo; verification box before sending the form.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.captchaEnabled}
                  onChange={(e) => setFormData({ ...formData, captchaEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-persici-crimson" />
              </label>
            </div>

            {!formData.captchaEnabled && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
                ⚠️ <strong>Notice:</strong> reCAPTCHA verification is currently disabled. Submissions will be sent without bot protection, which speeds up testing and enterprise conversion.
              </div>
            )}
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Google reCAPTCHA v2 Site Key
            </label>
            <input
              type="text"
              placeholder="e.g. 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              value={formData.captchaSiteKey}
              onChange={(e) => setFormData({ ...formData, captchaSiteKey: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono text-[11px] bg-white"
            />
            <p className="text-[11px] text-slate-500">
              Obtain your public v2 Checkbox Site Key from the Google Cloud reCAPTCHA admin console. Default fallback is configured in <code className="text-slate-700">NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code>.
            </p>
          </div>
        </div>
      </SectionAccordion>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          setFormData({ ...formData, bgImage: url });
          setMediaPickerOpen(false);
        }}
        allowedType="image"
        title="Select Animated Backdrop Media (GIF / WebP)"
      />
    </div>
  );
}
