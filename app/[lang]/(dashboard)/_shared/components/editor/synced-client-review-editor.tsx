'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  TbStarFilled,
  TbArrowsShuffle,
  TbExternalLink,
  TbEdit,
  TbCheck,
  TbRefresh,
} from 'react-icons/tb';
import { reviewsList } from '@shared/data';
import type { LocalizedString } from '@shared/types';

interface SyncedReviewEntry {
  id: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  companyEn: string;
  companyAr: string;
  reviewEn: string;
  reviewAr: string;
  rating: number;
  active: boolean;
}

function normalizeEntry(raw: Record<string, unknown>): SyncedReviewEntry {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const bi = (obj: unknown, enVal: unknown, arVal: unknown) => {
    const o = typeof obj === 'object' && obj !== null ? (obj as Record<string, unknown>) : null;
    const s = typeof obj === 'string' ? obj.trim() : '';
    const en = str(enVal) || str(o?.en) || s;
    const ar = str(arVal) || str(o?.ar) || en;
    return { en, ar };
  };
  const name = bi(raw.name, raw.nameEn, raw.nameAr);
  const role = bi(raw.role, raw.roleEn, raw.roleAr);
  const company = bi(raw.company, raw.companyEn, raw.companyAr);
  const review = bi(raw.review, raw.reviewEn, raw.reviewAr);

  return {
    id: str(raw.id) || (raw._id ? String(raw._id) : ''),
    nameEn: name.en,
    nameAr: name.ar,
    roleEn: role.en,
    roleAr: role.ar,
    companyEn: company.en,
    companyAr: company.ar,
    reviewEn: review.en,
    reviewAr: review.ar,
    rating: typeof raw.rating === 'number' ? raw.rating : 5,
    active: raw.active !== false,
  };
}

export interface SyncedClientReviewEditorProps {
  lang?: string;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  badge: LocalizedString;
  onChangeBadge: (badge: LocalizedString) => void;
  reviewId?: string;
  onChangeReviewId: (reviewId: string) => void;
}

export function SyncedClientReviewEditor({
  lang: propLang,
  enabled,
  onToggleEnabled,
  badge,
  onChangeBadge,
  reviewId = 'random',
  onChangeReviewId,
}: SyncedClientReviewEditorProps) {
  const params = useParams();
  const lang = propLang || (params?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  const [reviews, setReviews] = useState<SyncedReviewEntry[]>(() =>
    reviewsList.map((r) => normalizeEntry(r as unknown as Record<string, unknown>))
  );
  const [loading, setLoading] = useState(true);

  const loadReviews = () => {
    setLoading(true);
    fetch('/api/reviews', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews.map((item: Record<string, unknown>) => normalizeEntry(item)));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    fetch('/api/reviews', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews.map((item: Record<string, unknown>) => normalizeEntry(item)));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const activeReviews = reviews.filter((r) => r.active);
  const isRandomMode = !reviewId || reviewId === 'random';
  const selectedReview = !isRandomMode
    ? activeReviews.find((r) => r.id === reviewId) || reviews.find((r) => r.id === reviewId)
    : activeReviews[0] || reviews[0];

  return (
    <div className="space-y-4">
      {/* 1. Visibility Toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <span className="text-xs font-bold text-slate-800 block">
            {isRtl ? 'عرض قسم آراء العملاء في الصفحة' : 'Display Client Review Section on Live Page'}
          </span>
          <span className="text-[11px] text-slate-500">
            {isRtl
              ? 'يتم سحب التقييمات الحقيقية تلقائياً من تبويب التقييمات (عربي للصفحة العربية وإنجليزي للإنجليزية).'
              : 'Automatically pulls real verified testimonials from the Reviews tab in the active page language.'}
          </span>
        </div>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggleEnabled(e.target.checked)}
          className="w-4 h-4 accent-persici-crimson rounded cursor-pointer"
        />
      </div>

      {/* 2. Section Eyebrow Badge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Section Eyebrow Badge (EN)
          </label>
          <input
            type="text"
            value={badge?.en || ''}
            onChange={(e) => onChangeBadge({ ...(badge || { en: '', ar: '' }), en: e.target.value })}
            placeholder="What our clients say"
            className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            شارة القسم (AR)
          </label>
          <input
            type="text"
            dir="rtl"
            value={badge?.ar || ''}
            onChange={(e) => onChangeBadge({ ...(badge || { en: '', ar: '' }), ar: e.target.value })}
            placeholder="آراء العملاء"
            className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-arabic"
          />
        </div>
      </div>

      {/* 3. Direct Single-Source-of-Truth Sync Banner -> Redirects to Reviews Tab */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            <TbArrowsShuffle className="w-3.5 h-3.5" />
            <span>{isRtl ? 'مصدر موحد للتقييمات الحقيقية' : 'Synced With Real Client Reviews'}</span>
          </div>
          <h4 className="text-sm font-bold text-white">
            {isRtl
              ? 'لتعديل نص التقييمات أو إضافة عملاء جدد، انتقل إلى تبويب التقييمات'
              : 'Managed Centrally in the Client Reviews Tab'}
          </h4>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {isRtl
              ? `يتم الآن عرض آراء العملاء الحقيقية (${activeReviews.length} تقييم نشط) تلقائياً بالعربية في الصفحات العربية وبالإنجليزية في الإنجليزية.`
              : `This section dynamically pulls from your ${activeReviews.length} active real client reviews in English (/en) and Arabic (/ar) so every testimonial stays synchronized.`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadReviews}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isRtl ? 'تحديث القائمة' : 'Refresh Reviews List'}
          >
            <TbRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href={`/${lang}/dashboard/content/reviews`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-persici-crimson hover:bg-red-600 text-white text-xs font-bold tracking-wide transition-colors"
          >
            <TbEdit className="w-4 h-4" />
            <span>{isRtl ? 'إدارة وتعديل التقييمات ←' : 'Edit in Reviews Tab →'}</span>
          </Link>
        </div>
      </div>

      {/* 4. Selection Mode: Random Auto-Synced vs Specific Real Review */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          {isRtl ? 'اختيار آلية عرض التقييم الحقيقي' : 'Testimonial Sync Selection'}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChangeReviewId('random')}
            className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer flex items-start gap-3 ${
              isRandomMode
                ? 'border-persici-crimson bg-persici-crimson/5 ring-2 ring-persici-crimson/15'
                : 'border-slate-200 bg-white hover:bg-slate-100/70'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isRandomMode
                  ? 'bg-persici-crimson text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <TbArrowsShuffle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                {isRtl ? 'تقييم عشوائي متزامن تلقائياً (موصى به)' : 'Random Real Client Review (Recommended)'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {isRtl
                  ? 'يختار تلقائياً تقييماً حقيقياً عشوائياً من القائمة مع التبديل حسب لغة الصفحة.'
                  : 'Randomly selects an active real client review on load, matched to EN or AR.'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isRandomMode && activeReviews[0]) {
                onChangeReviewId(activeReviews[0].id);
              }
            }}
            className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer flex items-start gap-3 ${
              !isRandomMode
                ? 'border-persici-crimson bg-persici-crimson/5 ring-2 ring-persici-crimson/15'
                : 'border-slate-200 bg-white hover:bg-slate-100/70'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                !isRandomMode
                  ? 'bg-persici-crimson text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <TbCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                {isRtl ? 'تثبيت تقييم عميل محدد' : 'Pin a Specific Real Client Review'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {isRtl
                  ? 'اختر تقييماً معيناً من قاعدة التقييمات ليظهر دائماً في هذا القسم.'
                  : 'Select one specific real testimonial from your Reviews database for this page.'}
              </p>
            </div>
          </button>
        </div>

        {/* Specific Review Picker */}
        {!isRandomMode && (
          <div className="pt-2 space-y-2">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">
              {isRtl ? 'اختر التقييم من قاعدة البيانات:' : 'Choose Client Review:'}
            </label>
            <select
              value={reviewId}
              onChange={(e) => onChangeReviewId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:border-persici-crimson"
            >
              {activeReviews.map((rev) => (
                <option key={rev.id} value={rev.id}>
                  {rev.nameEn} ({rev.companyEn}) — &ldquo;{rev.reviewEn.slice(0, 70)}...&rdquo;
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 5. Live Bilingual Preview + Direct Edit Link for Selected Review */}
      {selectedReview && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: selectedReview.rating || 5 }).map((_, i) => (
                  <TbStarFilled key={i} className="w-3.5 h-3.5" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-900">
                {isRandomMode
                  ? isRtl
                    ? `معاينة عينة عشوائية من (${activeReviews.length}) تقييمات نشطة`
                    : `Sample Preview (Randomly Selected Across ${activeReviews.length} Active Reviews)`
                  : isRtl
                  ? `التقييم المحدد: ${selectedReview.nameAr}`
                  : `Selected Review: ${selectedReview.nameEn}`}
              </span>
            </div>

            <Link
              href={`/${lang}/dashboard/content/reviews?edit=${encodeURIComponent(selectedReview.id)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-persici-crimson hover:text-white text-slate-700 text-[11px] font-semibold transition-colors"
            >
              <TbExternalLink className="w-3.5 h-3.5" />
              <span>{isRtl ? 'تعديل هذا التقييم في تبويب التقييمات' : 'Edit This Review in Reviews Tab'}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5" dir="ltr">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                English Page Output (/en)
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                &ldquo;{selectedReview.reviewEn}&rdquo;
              </p>
              <p className="text-[11px] font-semibold text-slate-900 pt-1">
                — {selectedReview.nameEn}{' '}
                <span className="font-normal text-slate-500">
                  ({[selectedReview.roleEn, selectedReview.companyEn].filter(Boolean).join(', ')})
                </span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 font-arabic" dir="rtl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                عرض الصفحة العربية (/ar)
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                &ldquo;{selectedReview.reviewAr}&rdquo;
              </p>
              <p className="text-[11px] font-semibold text-slate-900 pt-1">
                — {selectedReview.nameAr}{' '}
                <span className="font-normal text-slate-500">
                  ({[selectedReview.roleAr, selectedReview.companyAr].filter(Boolean).join('، ')})
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
