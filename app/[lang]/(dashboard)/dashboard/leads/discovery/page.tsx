'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import {
  TbCompass,
  TbSearch,
  TbRefresh,
  TbMail,
  TbPhone,
  TbWorld,
  TbCash,
  TbTrash,
  TbDownload,
  TbCheck,
  TbTag,
  TbNotes,
  TbDeviceFloppy,
} from 'react-icons/tb';
import type { LeadAttributionInfo } from '@/app/[lang]/(site)/_shared/types';

interface DiscoveryLeadRecord {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  website?: string;
  company?: string;
  companySize?: string;
  revenue?: string;
  budgetTier?: string;
  timeline?: string;
  goals?: string[];
  description?: string;
  status?: 'pending' | 'contacted' | 'qualified' | 'closed' | string;
  notes?: string;
  attribution?: LeadAttributionInfo | null;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { id: 'pending', en: 'Pending', ar: 'قيد المراجعة', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'contacted', en: 'Contacted', ar: 'تم التواصل', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'qualified', en: 'Qualified', ar: 'فرصة مؤهلة', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'closed', en: 'Closed', ar: 'مغلق', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
] as const;

export default function DiscoveryLeadsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;
  const isAr = lang === 'ar';

  const [items, setItems] = useState<DiscoveryLeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<DiscoveryLeadRecord | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  const getDisplayName = (item: DiscoveryLeadRecord) => {
    if (item.name && item.name.trim()) return item.name.trim();
    const combined = `${item.firstName || ''} ${item.lastName || ''}`.trim();
    return combined || (isAr ? 'عميل مؤسسي' : 'Enterprise Lead');
  };

  const fetchDiscovery = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/discovery', { cache: 'no-store' });
      const data = await res.json();
      const list = data.submissions || data.leads;
      if (Array.isArray(list)) {
        setItems(list);
      }
    } catch (err) {
      console.error('Failed to load discovery leads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchDiscovery();
    });
  }, [fetchDiscovery]);

  const handleSelectRow = (item: DiscoveryLeadRecord) => {
    setSelectedItem(item);
    setNoteDraft(item.notes || '');
  };

  const handleUpdateRecord = async (
    id: string,
    updates: { status?: string; notes?: string }
  ) => {
    setSavingId(id);
    try {
      const res = await fetch('/api/discovery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
        if (selectedItem?.id === id) {
          setSelectedItem((prev) => (prev ? { ...prev, ...updates } : null));
        }
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 2000);
      }
    } catch (err) {
      console.error('Failed to update discovery lead:', err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    const confirmMsg = isAr
      ? 'هل أنت متأكد من حذف طلب مكالمة الاستكشاف هذا نهائياً؟'
      : 'Are you sure you want to permanently delete this discovery lead?';
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/discovery?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        if (selectedItem?.id === id) {
          setSelectedItem(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete discovery lead:', err);
    }
  };

  const handleExportCsv = () => {
    if (filteredItems.length === 0) return;
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Website / Company',
      'Revenue / Budget Tier',
      'Status',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Landing Page',
      'Notes',
      'Created At',
    ];
    const rows = filteredItems.map((item) => [
      item.id,
      getDisplayName(item),
      item.email,
      item.phone || '',
      item.website || item.company || '',
      item.revenue || item.budgetTier || '',
      item.status || 'pending',
      item.attribution?.utmSource || '',
      item.attribution?.utmMedium || '',
      item.attribution?.utmCampaign || '',
      item.attribution?.landingPage || '',
      (item.notes || item.description || '').replace(/\r?\n/g, ' '),
      item.createdAt,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers, ...rows]
        .map((row) =>
          row.map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `persici-discovery-leads-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = items.filter((i) => {
    const itemStatus = i.status || 'pending';
    if (statusFilter !== 'all' && itemStatus !== statusFilter) return false;
    const q = search.toLowerCase();
    if (!q) return true;
    const displayName = getDisplayName(i).toLowerCase();
    return (
      displayName.includes(q) ||
      i.email.toLowerCase().includes(q) ||
      (i.website && i.website.toLowerCase().includes(q)) ||
      (i.company && i.company.toLowerCase().includes(q)) ||
      (i.revenue && i.revenue.toLowerCase().includes(q)) ||
      (i.budgetTier && i.budgetTier.toLowerCase().includes(q)) ||
      (i.attribution?.utmSource && i.attribution.utmSource.toLowerCase().includes(q))
    );
  });

  const getStatusMeta = (status?: string) => {
    const normalized = status || 'pending';
    return (
      STATUS_OPTIONS.find((s) => s.id === normalized) || STATUS_OPTIONS[0]
    );
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            <span>{isAr ? 'خط المبيعات المؤسسي عالي القيمة' : 'High-Value Enterprise Pipeline'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAr ? 'طلبات مكالمات الاستكشاف (Discovery Calls)' : 'Discovery Call Inquiries'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAr
              ? 'مراجعة وتأهيل طلبات مكالمات الاستكشاف الواردة من الشركات مع شريحة الإيرادات الشهرية ومصدر الحملة.'
              : 'Review enterprise project briefs, revenue tiers, and marketing attribution submitted via Discovery forms.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {savedToast && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <TbCheck className="w-4 h-4" />
              {isAr ? 'تم الحفظ' : 'Saved'}
            </span>
          )}
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredItems.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            <TbDownload className="w-4 h-4" />
            <span>{isAr ? 'تصدير CSV' : 'Export CSV'}</span>
          </button>
          <button
            type="button"
            onClick={fetchDiscovery}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <TbRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar + Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({items.length})
          </button>
          {STATUS_OPTIONS.map((opt) => {
            const count = items.filter((i) => (i.status || 'pending') === opt.id).length;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setStatusFilter(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  statusFilter === opt.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isAr ? opt.ar : opt.en} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[260px] flex-1 max-w-md">
          <TbSearch className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isAr
                ? 'ابحث بالاسم، البريد، الموقع الإلكتروني، أو شريحة الإيرادات...'
                : 'Search by stakeholder name, email, website, or revenue tier...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Table + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedItem ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mb-3" />
                <p className="text-sm">
                  {isAr ? 'جاري تحميل طلبات الاستكشاف...' : 'Loading discovery leads...'}
                </p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <TbCompass className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">
                  {isAr ? 'لا توجد طلبات مكالمات استكشاف' : 'No discovery inquiries found'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {isAr
                    ? 'ستظهر الطلبات الواردة من نموذج مكالمة الاستكشاف هنا.'
                    : 'Enterprise requests from the Discovery Call section will appear here.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-[10px] text-slate-500 tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5 text-start">{isAr ? 'العميل والموقع' : 'Account / Contact'}</th>
                      <th className="px-4 py-3.5 text-start">{isAr ? 'الإيرادات الشهرية' : 'Revenue / Budget Tier'}</th>
                      <th className="px-4 py-3.5 text-start">{isAr ? 'المصدر الإعلاني' : 'Ad Source'}</th>
                      <th className="px-4 py-3.5 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="px-4 py-3.5 text-start">{isAr ? 'التاريخ' : 'Submitted'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => {
                      const isSelected = selectedItem?.id === item.id;
                      const statusMeta = getStatusMeta(item.status);
                      const fullName = getDisplayName(item);
                      const revenueLabel =
                        item.revenue || item.budgetTier || (isAr ? 'غير محدد' : 'Custom Tier');
                      return (
                        <tr
                          key={item.id}
                          onClick={() => handleSelectRow(item)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-purple-500/10 font-medium' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-900 text-sm">{fullName}</div>
                            <div className="text-slate-500 text-xs">{item.email}</div>
                            {(item.website || item.company) && (
                              <div className="text-[11px] text-purple-600 font-medium mt-0.5 truncate max-w-[200px]">
                                {item.website || item.company}
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {revenueLabel}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            {item.attribution?.utmSource ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                                <TbTag className="w-3 h-3" />
                                {item.attribution.utmSource}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">
                                {isAr ? 'مباشر / عضوي' : 'Direct / Organic'}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.badge}`}
                            >
                              {isAr ? statusMeta.ar : statusMeta.en}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-slate-400 text-[11px] whitespace-nowrap">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : isAr
                              ? 'حديثاً'
                              : 'Recent'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Selected Discovery Lead Inspector */}
        {selectedItem && (
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6 space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {getDisplayName(selectedItem)}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedItem.website || selectedItem.company || (isAr ? 'حساب مؤسسي' : 'Enterprise Account')}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDeleteRecord(selectedItem.id)}
                    className="text-rose-500 hover:text-rose-700 text-xs p-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                    title={isAr ? 'حذف' : 'Delete'}
                  >
                    <TbTrash className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="text-slate-400 hover:text-slate-700 text-xs px-2.5 py-1 bg-slate-100 rounded-lg"
                  >
                    {isAr ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </div>

              {/* Status Pipeline Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {isAr ? 'حالة الفرصة البيعية' : 'Pipeline Qualification Status'}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {STATUS_OPTIONS.map((opt) => {
                    const active = (selectedItem.status || 'pending') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={savingId === selectedItem.id}
                        onClick={() => handleUpdateRecord(selectedItem.id, { status: opt.id })}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isAr ? opt.ar : opt.en}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact & Revenue Metadata */}
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <TbMail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a
                    href={`mailto:${selectedItem.email}`}
                    className="text-purple-700 font-medium hover:underline break-all"
                  >
                    {selectedItem.email}
                  </a>
                </div>
                {selectedItem.phone && (
                  <div className="flex items-center gap-2">
                    <TbPhone className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={`tel:${selectedItem.phone}`} className="hover:underline">
                      {selectedItem.phone}
                    </a>
                  </div>
                )}
                {(selectedItem.website || selectedItem.company) && (
                  <div className="flex items-center gap-2">
                    <TbWorld className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={
                        (selectedItem.website || '').startsWith('http')
                          ? selectedItem.website
                          : `https://${selectedItem.website || selectedItem.company}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-700 font-medium hover:underline break-all"
                    >
                      {selectedItem.website || selectedItem.company}
                    </a>
                  </div>
                )}
                {(selectedItem.revenue || selectedItem.budgetTier) && (
                  <div className="flex items-center gap-2">
                    <TbCash className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      {isAr ? 'الإيرادات الشهرية:' : 'Monthly Revenue / Budget:'}{' '}
                      <strong className="text-emerald-700">
                        {selectedItem.revenue || selectedItem.budgetTier}
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Campaign / UTM Attribution Box */}
              {selectedItem.attribution && (
                <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900">
                    <TbTag className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isAr ? 'بيانات الحملة الإعلانية والمصدر' : 'Campaign & Click Attribution'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">{isAr ? 'المصدر' : 'UTM Source'}</span>
                      <span className="font-semibold text-slate-800">
                        {selectedItem.attribution.utmSource || 'Direct'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isAr ? 'الوسيط' : 'UTM Medium'}</span>
                      <span className="font-semibold text-slate-800">
                        {selectedItem.attribution.utmMedium || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isAr ? 'الحملة' : 'UTM Campaign'}</span>
                      <span className="font-semibold text-slate-800">
                        {selectedItem.attribution.utmCampaign || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isAr ? 'صفحة الهبوط' : 'Landing Page'}</span>
                      <span className="font-mono text-[10px] text-slate-700 break-all">
                        {selectedItem.attribution.landingPage || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.description && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {isAr ? 'تفاصيل المشروع' : 'Project Vision & Requirements'}
                  </h4>
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs leading-relaxed whitespace-pre-wrap border border-slate-100 max-h-48 overflow-y-auto">
                    {selectedItem.description}
                  </div>
                </div>
              )}

              {/* Internal CRM Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <TbNotes className="w-4 h-4 text-purple-600" />
                    <span>{isAr ? 'ملاحظات الفريق والتأهيل' : 'Discovery Notes & Next Steps'}</span>
                  </label>
                  <button
                    type="button"
                    disabled={savingId === selectedItem.id}
                    onClick={() => handleUpdateRecord(selectedItem.id, { notes: noteDraft })}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold transition-colors"
                  >
                    <TbDeviceFloppy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حفظ الملاحظة' : 'Save Note'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder={
                    isAr
                      ? 'سجل ملخص مكالمة الاستكشاف، متطلبات العميل، أو العرض المالي...'
                      : 'Add discovery call summary, qualification notes, or proposal value...'
                  }
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={`mailto:${selectedItem.email}?subject=Persici%20Agency%20—%20Discovery%20Call%20Invitation`}
                  onClick={() => {
                    if ((selectedItem.status || 'pending') === 'pending') {
                      handleUpdateRecord(selectedItem.id, { status: 'contacted' });
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  <TbMail className="w-4 h-4" />
                  <span>{isAr ? 'التواصل لجدولة مكالمة الاستكشاف' : 'Initiate Discovery Outreach'}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
