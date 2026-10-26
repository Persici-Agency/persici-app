'use client';

import React, { useState, useEffect, use } from 'react';
import {
  TbStar,
  TbStarFilled,
  TbPlus,
  TbTrash,
  TbEdit,
  TbRefresh,
  TbDeviceFloppy,
  TbX,
  TbLanguage,
  TbWorld,
} from 'react-icons/tb';

type LocalizedField = string | { en?: string; ar?: string } | undefined;

function extractEn(field?: LocalizedField, explicit?: string): string {
  return explicit || (typeof field === 'object' ? field?.en : field) || '';
}

function extractAr(field?: LocalizedField, explicit?: string, fallback = ''): string {
  return explicit || (typeof field === 'object' ? field?.ar : '') || fallback;
}

interface ReviewItem {
  id?: string;
  _id?: string;
  name: string;
  nameEn?: string;
  nameAr?: string;
  role: string;
  roleEn?: string;
  roleAr?: string;
  company: string;
  companyEn?: string;
  companyAr?: string;
  review: string;
  reviewEn?: string;
  reviewAr?: string;
  verified?: string;
  verifiedEn?: string;
  verifiedAr?: string;
  rating?: number;
  active?: boolean;
}

export default function ReviewsManagerPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;
  const isRtl = lang === 'ar';

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'both' | 'en' | 'ar'>('both');
  const [previewLang, setPreviewLang] = useState<'en' | 'ar' | 'both'>('both');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', { cache: 'no-store' });
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    queueMicrotask(() => {
      if (mounted) {
        fetchReviews();
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    setSaving(true);
    try {
      const isNew = isCreating || !editingReview.id;
      const url = '/api/reviews';
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        ...editingReview,
        nameEn: editingReview.nameEn || editingReview.name,
        nameAr: editingReview.nameAr || editingReview.nameEn || editingReview.name,
        roleEn: editingReview.roleEn || editingReview.role,
        roleAr: editingReview.roleAr || editingReview.roleEn || editingReview.role,
        companyEn: editingReview.companyEn || editingReview.company,
        companyAr: editingReview.companyAr || editingReview.companyEn || editingReview.company,
        reviewEn: editingReview.reviewEn || editingReview.review,
        reviewAr: editingReview.reviewAr || editingReview.reviewEn || editingReview.review,
        verifiedEn: editingReview.verifiedEn || editingReview.verified || 'Verified Client',
        verifiedAr: editingReview.verifiedAr || 'عميل موثق',
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setEditingReview(null);
        setIsCreating(false);
        fetchReviews();
      }
    } catch (err) {
      console.error('Failed to save review:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذا التقييم؟' : 'Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id && r._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const openNewReview = () => {
    setIsCreating(true);
    setActiveFormTab('both');
    setEditingReview({
      name: '',
      nameEn: '',
      nameAr: '',
      role: '',
      roleEn: '',
      roleAr: '',
      company: '',
      companyEn: '',
      companyAr: '',
      review: '',
      reviewEn: '',
      reviewAr: '',
      verified: 'Verified Client',
      verifiedEn: 'Verified Client',
      verifiedAr: 'عميل موثق',
      rating: 5,
      active: true,
    });
  };

  const openEditReview = (r: ReviewItem) => {
    setIsCreating(false);
    setActiveFormTab('both');
    const nameEn = extractEn(r.name, r.nameEn);
    const nameAr = extractAr(r.name, r.nameAr, nameEn);
    const roleEn = extractEn(r.role, r.roleEn);
    const roleAr = extractAr(r.role, r.roleAr);
    const companyEn = extractEn(r.company, r.companyEn);
    const companyAr = extractAr(r.company, r.companyAr);
    const reviewEn = extractEn(r.review, r.reviewEn);
    const reviewAr = extractAr(r.review, r.reviewAr);
    const verifiedEn = extractEn(r.verified, r.verifiedEn) || 'Verified Client';
    const verifiedAr = extractAr(r.verified, r.verifiedAr) || 'عميل موثق';

    setEditingReview({
      ...r,
      name: nameEn || nameAr,
      nameEn,
      nameAr,
      role: roleEn || roleAr,
      roleEn,
      roleAr,
      company: companyEn || companyAr,
      companyEn,
      companyAr,
      review: reviewEn || reviewAr,
      reviewEn,
      reviewAr,
      verified: verifiedEn,
      verifiedEn,
      verifiedAr,
      rating: r.rating || 5,
      active: r.active !== false,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-1">
            <TbWorld className="w-4 h-4" />
            <span>{isRtl ? 'إدارة التقييمات ثنائية اللغة (عربي / إنجليزي)' : 'Bilingual Social Proof & Credibility (EN / AR)'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isRtl ? 'حائط التقييمات والشهادات' : 'Reviews & Testimonials Wall'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isRtl
              ? 'إدارة تقييمات العملاء وشهاداتهم باللغتين الإنجليزية والعربية ليتم حفظها في قاعدة البيانات وعرضها فورياً على الموقع.'
              : 'Manage executive client testimonials, star ratings, and verified badges in English and Arabic saved directly to MongoDB.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Preview Language Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setPreviewLang('both')}
              className={`px-2.5 py-1 rounded-lg transition-all ${previewLang === 'both' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'hover:text-slate-900'}`}
            >
              {isRtl ? 'كلاهما' : 'Both'}
            </button>
            <button
              type="button"
              onClick={() => setPreviewLang('en')}
              className={`px-2.5 py-1 rounded-lg transition-all ${previewLang === 'en' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'hover:text-slate-900'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setPreviewLang('ar')}
              className={`px-2.5 py-1 rounded-lg transition-all ${previewLang === 'ar' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'hover:text-slate-900'}`}
            >
              AR
            </button>
          </div>

          <button
            type="button"
            onClick={openNewReview}
            className="flex items-center gap-2 px-4 py-2.5 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm"
          >
            <TbPlus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة تقييم ثنائي اللغة' : 'Add Bilingual Review'}</span>
          </button>
          <button
            type="button"
            onClick={fetchReviews}
            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Refresh"
          >
            <TbRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Modal / Drawer */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TbLanguage className="w-5 h-5 text-persici-crimson" />
                  <span>
                    {isCreating
                      ? (isRtl ? 'إضافة تقييم عميل جديد (باللغتين)' : 'Add New Client Testimonial (Bilingual)')
                      : (isRtl ? 'تعديل التقييم (باللغتين)' : 'Edit Testimonial (Bilingual)')}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRtl
                    ? 'أدخل البيانات بالإنجليزية والعربية ليتم حفظهما معاً في قاعدة البيانات وتحديث الموقع.'
                    : 'Provide both English and Arabic content so both language versions are saved to the database.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>

            {/* Language Switch Tabs for Form */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <button
                type="button"
                onClick={() => setActiveFormTab('both')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeFormTab === 'both' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isRtl ? 'عرض كلا اللغتين جنبًا إلى جنب' : 'Side-by-Side (EN & AR)'}
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeFormTab === 'en' ? 'bg-persici-crimson text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                English (EN)
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('ar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeFormTab === 'ar' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                العربية (AR)
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Rating & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isRtl ? 'التقييم بالنجوم' : 'Star Rating'}
                  </label>
                  <select
                    value={editingReview.rating || 5}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-persici-crimson font-medium"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars (Strong)</option>
                    <option value={3}>⭐⭐⭐ 3 Stars (Good)</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingReview.active !== false}
                      onChange={(e) => setEditingReview({ ...editingReview, active: e.target.checked })}
                      className="rounded border-slate-300 text-persici-crimson focus:ring-persici-crimson h-4 w-4"
                    />
                    <span>{isRtl ? 'عرض التقييم في الموقع (Active)' : 'Published & Visible on Home Page'}</span>
                  </label>
                </div>
              </div>

              {/* Bilingual Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* English Column */}
                {(activeFormTab === 'both' || activeFormTab === 'en') && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                        English Content (EN)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">LTR</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Client Name (EN) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingReview.nameEn || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, nameEn: e.target.value })}
                        placeholder="e.g. Shab Stafford"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-persici-crimson"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Brand (EN)</label>
                      <input
                        type="text"
                        value={editingReview.companyEn || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, companyEn: e.target.value })}
                        placeholder="e.g. Silk & Thread Studio"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-persici-crimson"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Designation / Role (EN)</label>
                      <input
                        type="text"
                        value={editingReview.roleEn || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, roleEn: e.target.value })}
                        placeholder="e.g. CEO & Founder"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-persici-crimson"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Verified Badge Label (EN)</label>
                      <input
                        type="text"
                        value={editingReview.verifiedEn || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, verifiedEn: e.target.value })}
                        placeholder="e.g. Verified Client"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-persici-crimson"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Review Quote (EN) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={editingReview.reviewEn || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, reviewEn: e.target.value })}
                        placeholder="The best decision I made for my business! Persici delivered beyond expectations..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-persici-crimson"
                      />
                    </div>
                  </div>
                )}

                {/* Arabic Column */}
                {(activeFormTab === 'both' || activeFormTab === 'ar') && (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3" dir="rtl">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                        المحتوى بالعربية (AR)
                      </span>
                      <span className="text-[10px] text-emerald-700 font-mono">RTL</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        اسم العميل (بالعربية) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingReview.nameAr || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, nameAr: e.target.value })}
                        placeholder="مثال: شاب ستافورد"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 font-secondary text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">الشركة / العلامة التجارية (بالعربية)</label>
                      <input
                        type="text"
                        value={editingReview.companyAr || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, companyAr: e.target.value })}
                        placeholder="مثال: سيلك آند ثريد ستوديو"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 font-secondary text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">المسمى الوظيفي (بالعربية)</label>
                      <input
                        type="text"
                        value={editingReview.roleAr || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, roleAr: e.target.value })}
                        placeholder="مثال: المؤسس والرئيس التنفيذي"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 font-secondary text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">شارة التوثيق (بالعربية)</label>
                      <input
                        type="text"
                        value={editingReview.verifiedAr || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, verifiedAr: e.target.value })}
                        placeholder="مثال: عميل موثق"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 font-secondary text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        نص التقييم والشهادة (بالعربية) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={editingReview.reviewAr || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, reviewAr: e.target.value })}
                        placeholder="أفضل قرار اتخذته لمتجري! تسليم إدارة الإعلانات لجهة خارجية ليس بالأمر السهل..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 font-secondary text-right"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <TbDeviceFloppy className="w-4 h-4" />
                  <span>{saving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ ونشر التقييم' : 'Save & Publish')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-persici-crimson border-t-transparent mb-3" />
          <p className="text-sm">{isRtl ? 'جاري تحميل جدار التقييمات...' : 'Loading reviews wall...'}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <TbStar className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">{isRtl ? 'لا توجد تقييمات مضافة حتى الآن' : 'No client reviews added yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => {
            const id = r.id || r._id || '';
            const rating = r.rating || 5;

            const nameEn = extractEn(r.name, r.nameEn);
            const nameAr = extractAr(r.name, r.nameAr, nameEn);
            const roleEn = extractEn(r.role, r.roleEn);
            const roleAr = extractAr(r.role, r.roleAr);
            const companyEn = extractEn(r.company, r.companyEn);
            const companyAr = extractAr(r.company, r.companyAr);
            const reviewEn = extractEn(r.review, r.reviewEn);
            const reviewAr = extractAr(r.review, r.reviewAr);
            const verifiedEn = extractEn(r.verified, r.verifiedEn) || 'Verified Client';
            const verifiedAr = extractAr(r.verified, r.verifiedAr) || 'عميل موثق';

            return (
              <div
                key={id || nameEn || nameAr}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Rating Stars & Language Badges */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < rating ? (
                            <TbStarFilled className="w-4 h-4 text-amber-400" />
                          ) : (
                            <TbStar className="w-4 h-4 text-slate-200" />
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {previewLang === 'ar' ? verifiedAr : verifiedEn}
                      </span>
                    </div>
                  </div>

                  {/* Review text in English & Arabic */}
                  {previewLang === 'both' ? (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">English</span>
                        <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-3">
                          &ldquo;{reviewEn}&rdquo;
                        </p>
                      </div>
                      <div className="p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100" dir="rtl">
                        <span className="text-[9px] uppercase font-bold text-emerald-600 tracking-wider block mb-1">العربية</span>
                        <p className="text-xs text-slate-800 leading-relaxed italic font-secondary line-clamp-3">
                          &ldquo;{reviewAr}&rdquo;
                        </p>
                      </div>
                    </div>
                  ) : previewLang === 'ar' ? (
                    <div className="p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100" dir="rtl">
                      <p className="text-xs text-slate-800 leading-relaxed italic font-secondary line-clamp-4">
                        &ldquo;{reviewAr}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-4">
                        &ldquo;{reviewEn}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Reviewer Details & Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {previewLang === 'ar' ? nameAr : nameEn}
                      {previewLang === 'both' && nameAr && nameAr !== nameEn && (
                        <span className="text-slate-400 font-normal font-secondary text-[11px] ms-1">
                          ({nameAr})
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {previewLang === 'ar'
                        ? `${roleAr ? `${roleAr} • ` : ''}${companyAr}`
                        : `${roleEn ? `${roleEn} • ` : ''}${companyEn}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditReview(r)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                      title={isRtl ? 'تعديل' : 'Edit'}
                    >
                      <TbEdit className="w-4 h-4" />
                    </button>
                    {id && (
                      <button
                        type="button"
                        onClick={() => handleDelete(id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                        title={isRtl ? 'حذف' : 'Delete'}
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
