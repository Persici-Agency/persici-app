'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  TbCategory,
  TbPlus,
  TbRefresh,
  TbSearch,
  TbEdit,
  TbTrash,
  TbArrowUp,
  TbArrowDown,
  TbBriefcase,
  TbX,
  TbSparkles,
  TbAlertTriangle,
  TbCheck,
  TbExternalLink,
} from 'react-icons/tb';
import {
  hasAnyBilingualText,
  normalizeBilingualInput,
  resolveBilingualText,
  slugifyCategorySlug,
  type ClientStoryCategory,
} from '@/app/[lang]/(site)/client-stories/_client-stories/types';

interface CategoryWithCount extends ClientStoryCategory {
  storyCount: number;
}

export default function ClientStoryCategoriesPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const isRtl = lang === 'ar';

  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [totalStories, setTotalStories] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [passkey, setPasskey] = useState('');
  const [bannerMessage, setBannerMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Create / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPreviousSlug, setEditingPreviousSlug] = useState<string | null>(null);
  const [formNameEn, setFormNameEn] = useState('');
  const [formNameAr, setFormNameAr] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [formDescEn, setFormDescEn] = useState('');
  const [formDescAr, setFormDescAr] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Delete / Reassign modal state
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithCount | null>(null);
  const [reassignToSlug, setReassignToSlug] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const getHref = (href: string) => {
    if (!passkey) return href;
    const sep = href.includes('?') ? '&' : '?';
    return `${href}${sep}passkey=${encodeURIComponent(passkey)}`;
  };

  const loadCategories = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await fetch('/api/projects/categories', { cache: 'no-store' });
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
      if (typeof data.totalStories === 'number') {
        setTotalStories(data.totalStories);
      }
    } catch (err) {
      console.error('Failed to load client story categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/projects/categories', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (typeof window !== 'undefined') {
          const sp = new URLSearchParams(window.location.search);
          const pk = sp.get('passkey') || sp.get('key') || '';
          if (pk) setPasskey(pk);
        }
        if (data.categories) {
          setCategories(data.categories);
        }
        if (typeof data.totalStories === 'number') {
          setTotalStories(data.totalStories);
        }
      })
      .catch((err) => {
        console.error('Failed to load client story categories:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingPreviousSlug(null);
    setFormNameEn('');
    setFormNameAr('');
    setFormSlug('');
    setSlugTouched(false);
    setFormDescEn('');
    setFormDescAr('');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryWithCount) => {
    const n = normalizeBilingualInput(cat.name);
    const d = normalizeBilingualInput(cat.description);
    setEditingPreviousSlug(cat.slug);
    setFormNameEn(n.en);
    setFormNameAr(n.ar);
    setFormSlug(cat.slug);
    setSlugTouched(true);
    setFormDescEn(d.en);
    setFormDescAr(d.ar);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = { en: formNameEn.trim(), ar: formNameAr.trim() };
    if (!hasAnyBilingualText(trimmedName)) {
      setFormError(
        isRtl
          ? 'يرجى إدخال اسم التصنيف بلغة واحدة على الأقل (العربية أو الإنجليزية).'
          : 'Please provide a category name in at least one language (EN or AR).'
      );
      return;
    }

    const cleanSlug = slugifyCategorySlug(formSlug || trimmedName.en);
    if (!cleanSlug || cleanSlug === 'all') {
      setFormError(
        isRtl
          ? 'يرجى إدخال معرف URL Slug صالح بالأحرف الإنجليزية (مثال: fintech).'
          : 'Please enter a valid ASCII URL slug (e.g. fintech). "all" is reserved.'
      );
      return;
    }

    setSaving(true);
    try {
      const isEdit = Boolean(editingPreviousSlug);
      const res = await fetch('/api/projects/categories', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEdit ? { previousSlug: editingPreviousSlug } : {}),
          slug: cleanSlug,
          name: trimmedName,
          description: { en: formDescEn.trim(), ar: formDescAr.trim() },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error || 'Failed to save category');
        return;
      }

      setModalOpen(false);
      await loadCategories(false);
      setBannerMessage({
        type: 'success',
        text: isEdit
          ? isRtl
            ? `تم تحديث التصنيف بنجاح${
                data.syncedStories
                  ? ` ومزامنة ${data.syncedStories} قصص مرتبطة.`
                  : '.'
              }`
            : `Category updated${
                data.syncedStories
                  ? ` and synced across ${data.syncedStories} client ${
                      data.syncedStories === 1 ? 'story' : 'stories'
                    }.`
                  : '.'
              }`
          : isRtl
          ? `تم إضافة التصنيف الجديد (${cleanSlug}) بنجاح.`
          : `Category "${resolveBilingualText(trimmedName, lang)}" (${cleanSlug}) created.`,
      });
    } catch {
      setFormError('Network error while saving category.');
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const updated = [...categories];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setCategories(updated);

    try {
      const res = await fetch('/api/projects/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedSlugs: updated.map((c) => c.slug) }),
      });
      if (!res.ok) {
        loadCategories(false);
      }
    } catch {
      loadCategories(false);
    }
  };

  const openDeleteModal = (cat: CategoryWithCount) => {
    setDeleteError(null);
    const fallbackTarget = categories.find((c) => c.slug !== cat.slug)?.slug || '';
    setReassignToSlug(fallbackTarget);
    setDeletingCategory(cat);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setDeleteError(null);

    if (deletingCategory.storyCount > 0 && (!reassignToSlug || reassignToSlug === deletingCategory.slug)) {
      setDeleteError(
        isRtl
          ? 'يرجى اختيار تصنيف بديل لنقل القصص المرتبطة إليه قبل الحذف.'
          : 'Please choose a replacement category to reassign linked stories before deleting.'
      );
      return;
    }

    setSaving(true);
    try {
      const qs = new URLSearchParams({ slug: deletingCategory.slug });
      if (deletingCategory.storyCount > 0 && reassignToSlug) {
        qs.set('reassignToSlug', reassignToSlug);
      }

      const res = await fetch(`/api/projects/categories?${qs.toString()}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data.error || 'Failed to delete category');
        return;
      }

      const removedName = resolveBilingualText(deletingCategory.name, lang);
      setDeletingCategory(null);
      await loadCategories(false);
      setBannerMessage({
        type: 'success',
        text: isRtl
          ? `تم حذف التصنيف "${removedName}" بنجاح${
              data.reassignedStories ? ` ونقل ${data.reassignedStories} قصص إلى التصنيف البديل.` : '.'
            }`
          : `Deleted category "${removedName}"${
              data.reassignedStories
                ? ` and reassigned ${data.reassignedStories} client ${
                    data.reassignedStories === 1 ? 'story' : 'stories'
                  }.`
                : '.'
            }`,
      });
    } catch {
      setDeleteError('Network error while deleting category.');
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameEn = cat.name?.en?.toLowerCase() || '';
    const nameAr = cat.name?.ar?.toLowerCase() || '';
    return (
      nameEn.includes(q) ||
      nameAr.includes(q) ||
      cat.slug.toLowerCase().includes(q)
    );
  });

  const activeCategoriesCount = categories.filter((c) => c.storyCount > 0).length;
  const editingCategoryStats = editingPreviousSlug
    ? categories.find((c) => c.slug === editingPreviousSlug)
    : undefined;

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-6 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. Master Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-persici-crimson mb-1.5">
            <TbCategory className="w-4 h-4" />
            <span>{isRtl ? 'إدارة تصنيفات قصص العملاء' : 'Client Stories Taxonomy & Filters'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isRtl ? 'تصنيفات قصص العملاء (Categories)' : 'Client Story Categories'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            {isRtl
              ? 'إدارة تصنيفات قصص العملاء وأسمائها بالعربية والإنجليزية وروابطها (Slugs) بشكل مستقل تماماً عن قوالب عرض الوسائط، مع عرض عدد القصص المرتبطة بكل تصنيف.'
              : 'Manage Client Story categories, bilingual EN/AR titles, URL slugs, display order, and live story counts independently from deliverable showcase layout templates.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-persici-crimson hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-persici-crimson/20 transition-all cursor-pointer"
          >
            <TbPlus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة تصنيف جديد' : 'Add Category'}</span>
          </button>

          <Link
            href={getHref(`/${lang}/dashboard/content/projects`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <TbBriefcase className="w-4 h-4 text-persici-crimson" />
            <span>{isRtl ? 'تعديل قصص العملاء' : 'Edit Client Stories'}</span>
          </Link>

          <a
            href={`/${lang}/client-stories`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <TbExternalLink className="w-4 h-4" />
            <span>{isRtl ? 'عرض صفحة القصص' : 'Live Hub'}</span>
          </a>

          <button
            type="button"
            onClick={() => loadCategories(true)}
            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title={isRtl ? 'تحديث القائمة' : 'Refresh'}
          >
            <TbRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {bannerMessage && (
        <div
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border text-xs font-semibold ${
            bannerMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <TbCheck className="w-4 h-4 shrink-0" />
            <span>{bannerMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerMessage(null)}
            className="p-1 opacity-70 hover:opacity-100 cursor-pointer"
          >
            <TbX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-persici-crimson/10 text-persici-crimson flex items-center justify-center shrink-0">
            <TbCategory className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              {isRtl ? 'إجمالي التصنيفات' : 'Total Categories'}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{categories.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <TbBriefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              {isRtl ? 'إجمالي قصص العملاء' : 'Total Client Stories'}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{totalStories}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TbCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              {isRtl ? 'تصنيفات تحتوي على قصص' : 'Categories In Use'}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {activeCategoriesCount} / {categories.length}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Search Bar & Categories Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <TbSearch className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isRtl
                  ? 'ابحث باسم التصنيف أو الـ Slug...'
                  : 'Search category name (EN / AR) or slug...'
              }
              className="w-full ps-9 pe-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none"
            />
          </div>

          <p className="text-[11px] text-slate-500">
            {isRtl
              ? 'ترتيب القائمة هنا يتحكم في ترتيب أزرار الفلترة على صفحة قصص العملاء.'
              : 'Category order here controls the filter pill sequence on the public Client Stories Hub.'}
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-persici-crimson border-t-transparent mb-3" />
            <p className="text-sm font-medium">
              {isRtl ? 'جارٍ تحميل التصنيفات...' : 'Loading client story categories...'}
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-14 text-center space-y-2 text-slate-500">
            <TbCategory className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">
              {isRtl ? 'لا توجد تصنيفات مطابقة للبحث.' : 'No matching categories found.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredCategories.map((cat) => {
              const globalIndex = categories.findIndex((c) => c.slug === cat.slug);
              const nameEn = cat.name?.en?.trim() || '';
              const nameAr = cat.name?.ar?.trim() || '';
              const displayEn = resolveBilingualText(cat.name, 'en');
              const displayAr = resolveBilingualText(cat.name, 'ar');

              return (
                <div
                  key={cat.slug}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  {/* Order + Names + Slug + Description */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700 flex items-center justify-center">
                        {globalIndex + 1}
                      </span>
                      {!searchQuery.trim() && (
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={globalIndex <= 0}
                            onClick={() => handleReorder(globalIndex, 'up')}
                            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                            title={isRtl ? 'تحريك لأعلى' : 'Move up'}
                          >
                            <TbArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={globalIndex === categories.length - 1}
                            onClick={() => handleReorder(globalIndex, 'down')}
                            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                            title={isRtl ? 'تحريك لأسفل' : 'Move down'}
                          >
                            <TbArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {displayEn}
                        </h3>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm font-semibold text-slate-700 font-arabic" dir="rtl">
                          {displayAr}
                        </span>
                        {(!nameEn || !nameAr) && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-medium text-amber-800">
                            {!nameAr
                              ? isRtl
                                ? 'يستخدم الاسم الإنجليزي تلقائياً'
                                : 'AR falls back to EN'
                              : isRtl
                              ? 'يستخدم الاسم العربي تلقائياً'
                              : 'EN falls back to AR'}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[11px] font-semibold text-slate-700">
                          slug: {cat.slug}
                        </span>

                        {cat.description && hasAnyBilingualText(cat.description) && (
                          <span className="text-[11px] text-slate-500 truncate max-w-xl">
                            {resolveBilingualText(cat.description, lang)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Story Count + Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <Link
                      href={getHref(
                        `/${lang}/dashboard/content/projects?category=${encodeURIComponent(cat.slug)}`
                      )}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                        cat.storyCount > 0
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                      title={
                        isRtl
                          ? 'عرض قصص العملاء داخل هذا التصنيف'
                          : 'View Client Stories in this category'
                      }
                    >
                      <TbBriefcase className="w-3.5 h-3.5" />
                      <span>
                        {cat.storyCount}{' '}
                        {isRtl
                          ? cat.storyCount === 1
                            ? 'قصة عميل'
                            : 'قصص عملاء'
                          : cat.storyCount === 1
                          ? 'Client Story'
                          : 'Client Stories'}
                      </span>
                    </Link>

                    <Link
                      href={getHref(
                        `/${lang}/dashboard/content/projects?newCategory=${encodeURIComponent(cat.slug)}`
                      )}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-persici-crimson/10 hover:bg-persici-crimson text-persici-crimson hover:text-white border border-persici-crimson/20 text-xs font-semibold transition-colors"
                      title={
                        isRtl
                          ? 'إضافة قصة عميل جديدة تحت هذا التصنيف'
                          : 'Create a new Client Story in this category'
                      }
                    >
                      <TbPlus className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إضافة قصة' : 'Add Story'}</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => openEditModal(cat)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <TbEdit className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={categories.length <= 1}
                      onClick={() => openDeleteModal(cat)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      title={
                        categories.length <= 1
                          ? isRtl
                            ? 'لا يمكن حذف آخر تصنيف متبقٍ'
                            : 'Cannot delete the last remaining category'
                          : isRtl
                          ? 'حذف التصنيف'
                          : 'Delete category'
                      }
                    >
                      <TbTrash className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'حذف' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCategory}
            className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingPreviousSlug
                    ? isRtl
                      ? 'تعديل التصنيف'
                      : 'Edit Client Story Category'
                    : isRtl
                    ? 'إضافة تصنيف جديد لقصص العملاء'
                    : 'Create New Client Story Category'}
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isRtl
                    ? 'يكفي إدخال الاسم بلغة واحدة على الأقل وتنطبق التسمية تلقائياً حتى إضافة اللغة الأخرى.'
                    : 'At least one language is required; an empty second language falls back automatically until entered.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white cursor-pointer"
              >
                <TbX className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                  <TbAlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {editingCategoryStats && editingCategoryStats.storyCount > 0 && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 leading-relaxed">
                  {isRtl
                    ? `يوجد حالياً ${editingCategoryStats.storyCount} قصص مرتبطة بهذا التصنيف؛ سيتم تحديث الاسم والـ Slug تلقائياً فيها جميعاً عند الحفظ.`
                    : `This category is currently used by ${editingCategoryStats.storyCount} client ${
                        editingCategoryStats.storyCount === 1 ? 'story' : 'stories'
                      }. Saving will automatically update the category name and slug across all of them.`}
                </div>
              )}

              {/* Bilingual Name (EN & AR) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isRtl ? 'اسم التصنيف (English)' : 'Category Name (EN)'}
                  </label>
                  <input
                    type="text"
                    required={!formNameAr.trim()}
                    value={formNameEn}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormNameEn(val);
                      if (!editingPreviousSlug && !slugTouched) {
                        setFormSlug(slugifyCategorySlug(val));
                      }
                    }}
                    placeholder={
                      !formNameEn.trim() && formNameAr.trim()
                        ? `Uses "${formNameAr.trim()}" until EN filled`
                        : 'e.g. FinTech & Payments'
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isRtl ? 'اسم التصنيف (العربية)' : 'Category Name (AR)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    required={!formNameEn.trim()}
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    placeholder={
                      !formNameAr.trim() && formNameEn.trim()
                        ? `تلقائياً: "${formNameEn.trim()}"`
                        : 'مثال: التقنية المالية والمدفوعات'
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none font-arabic"
                  />
                </div>
              </div>

              {/* URL Slug */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isRtl ? 'معرف التصنيف (URL Slug)' : 'Category URL Slug'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const generated = slugifyCategorySlug(formNameEn);
                      if (generated) {
                        setFormSlug(generated);
                        setSlugTouched(true);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-persici-crimson hover:underline cursor-pointer"
                  >
                    <TbSparkles className="w-3 h-3" />
                    <span>{isRtl ? 'توليد من الاسم' : 'From EN Name'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                  }}
                  placeholder="e.g. fintech-payments"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none"
                />
              </div>

              {/* Optional Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isRtl ? 'وصف مختصر (اختياري - EN)' : 'Description (Optional - EN)'}
                  </label>
                  <input
                    type="text"
                    value={formDescEn}
                    onChange={(e) => setFormDescEn(e.target.value)}
                    placeholder="Optional internal / taxonomy note"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isRtl ? 'وصف مختصر (اختياري - AR)' : 'Description (Optional - AR)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formDescAr}
                    onChange={(e) => setFormDescAr(e.target.value)}
                    placeholder="ملاحظة اختيارية عن التصنيف"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-persici-crimson outline-none font-arabic"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-persici-crimson hover:bg-red-700 text-white text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {saving
                  ? isRtl
                    ? 'جارٍ الحفظ...'
                    : 'Saving...'
                  : editingPreviousSlug
                  ? isRtl
                    ? 'حفظ التعديلات'
                    : 'Save Changes'
                  : isRtl
                  ? 'إنشاء التصنيف'
                  : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete / Reassign Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-red-50/60">
              <div className="flex items-center gap-2 text-red-700">
                <TbAlertTriangle className="w-5 h-5" />
                <h2 className="text-sm font-bold">
                  {isRtl ? 'تأكيد حذف التصنيف' : 'Confirm Category Deletion'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <TbX className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {deleteError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {deleteError}
                </div>
              )}

              <p className="text-xs text-slate-600 leading-relaxed">
                {isRtl
                  ? `هل أنت متأكد من حذف التصنيف "${resolveBilingualText(deletingCategory.name, lang)}" (${deletingCategory.slug})؟`
                  : `Are you sure you want to delete category "${resolveBilingualText(deletingCategory.name, lang)}" (${deletingCategory.slug})?`}
              </p>

              {deletingCategory.storyCount > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2.5">
                  <p className="text-xs font-bold text-amber-900">
                    {isRtl
                      ? `يحتوي هذا التصنيف على ${deletingCategory.storyCount} قصص عملاء. اختر التصنيف البديل لنقلها إليه:`
                      : `This category contains ${deletingCategory.storyCount} client ${
                          deletingCategory.storyCount === 1 ? 'story' : 'stories'
                        }. Choose which category to reassign them to:`}
                  </p>
                  <select
                    value={reassignToSlug}
                    onChange={(e) => setReassignToSlug(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-amber-300 rounded-xl outline-none focus:border-persici-crimson"
                  >
                    {categories
                      .filter((c) => c.slug !== deletingCategory.slug)
                      .map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {resolveBilingualText(c.name, lang)} ({c.slug})
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {saving
                  ? isRtl
                    ? 'جارٍ الحذف...'
                    : 'Deleting...'
                  : deletingCategory.storyCount > 0
                  ? isRtl
                    ? 'نقل القصص وحذف التصنيف'
                    : 'Reassign Stories & Delete'
                  : isRtl
                  ? 'حذف نهائي'
                  : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
