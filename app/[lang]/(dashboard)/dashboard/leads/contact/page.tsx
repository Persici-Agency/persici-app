'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import {
  TbMessageDots,
  TbSearch,
  TbRefresh,
  TbMail,
  TbPhone,
  TbBuilding,
  TbWorld,
  TbBriefcase,
  TbTrash,
  TbDownload,
  TbCheck,
  TbTag,
  TbNotes,
  TbDeviceFloppy,
} from 'react-icons/tb';
import type { LeadAttributionInfo } from '@/app/[lang]/(site)/_shared/types';

interface ContactSubmissionRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  jobTitle?: string;
  reason?: string;
  subject?: string;
  service?: string;
  budget?: string;
  message: string;
  status?: 'unread' | 'contacted' | 'replied' | 'qualified' | 'closed' | string;
  notes?: string;
  attribution?: LeadAttributionInfo | null;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { id: 'unread', en: 'Unread', ar: 'غير مقروء', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'contacted', en: 'Contacted', ar: 'تم التواصل', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'replied', en: 'Replied', ar: 'تم الرد', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'qualified', en: 'Qualified', ar: 'مؤهل', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'closed', en: 'Closed', ar: 'مغلق', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
] as const;

export default function ContactInquiriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;
  const isAr = lang === 'ar';

  const [items, setItems] = useState<ContactSubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ContactSubmissionRecord | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', { cache: 'no-store' });
      const data = await res.json();
      if (data.submissions) {
        setItems(data.submissions);
      }
    } catch (err) {
      console.error('Failed to load contact inquiries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchInquiries();
    });
  }, [fetchInquiries]);

  const handleSelectRow = (item: ContactSubmissionRecord) => {
    setSelectedItem(item);
    setNoteDraft(item.notes || '');
  };

  const handleUpdateRecord = async (
    id: string,
    updates: { status?: string; notes?: string }
  ) => {
    setSavingId(id);
    try {
      const res = await fetch('/api/contact', {
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
      console.error('Failed to update contact record:', err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    const confirmMsg = isAr
      ? 'هل أنت متأكد من حذف هذا الاستفسار نهائياً؟'
      : 'Are you sure you want to permanently delete this contact inquiry?';
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        if (selectedItem?.id === id) {
          setSelectedItem(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete contact inquiry:', err);
    }
  };

  const handleExportCsv = () => {
    if (filteredItems.length === 0) return;
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Job Title',
      'Country',
      'Reason / Subject',
      'Status',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Landing Page',
      'Message',
      'Internal Notes',
      'Created At',
    ];
    const rows = filteredItems.map((item) => [
      item.id,
      item.name,
      item.email,
      item.phone || '',
      item.company || '',
      item.jobTitle || '',
      item.country || '',
      item.reason || item.subject || item.service || '',
      item.status || 'unread',
      item.attribution?.utmSource || '',
      item.attribution?.utmMedium || '',
      item.attribution?.utmCampaign || '',
      item.attribution?.landingPage || '',
      item.message.replace(/\r?\n/g, ' '),
      (item.notes || '').replace(/\r?\n/g, ' '),
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
      `persici-contact-inquiries-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = items.filter((i) => {
    const itemStatus = i.status || 'unread';
    if (statusFilter !== 'all' && itemStatus !== statusFilter) return false;
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      i.name.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      (i.company && i.company.toLowerCase().includes(q)) ||
      (i.country && i.country.toLowerCase().includes(q)) ||
      (i.reason && i.reason.toLowerCase().includes(q)) ||
      (i.subject && i.subject.toLowerCase().includes(q)) ||
      (i.attribution?.utmSource && i.attribution.utmSource.toLowerCase().includes(q))
    );
  });

  const getStatusMeta = (status?: string) => {
    const normalized = status || 'unread';
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
            <span>{isAr ? 'العملاء المحتملون والاستفسارات الواردة' : 'Leads & Inbound Inquiries'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAr ? 'رسائل واستفسارات التواصل' : 'Contact Form Submissions'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAr
              ? 'مراجعة وتأهيل استفسارات المشاريع الواردة من الصفحة الرئيسية وصفحة تواصل معنا مع بيانات مصدر الحملة.'
              : 'Review and qualify incoming enterprise project inquiries with full UTM & ad attribution.'}
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
            onClick={fetchInquiries}
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
            const count = items.filter((i) => (i.status || 'unread') === opt.id).length;
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
                ? 'ابحث بالاسم، البريد، الشركة، الدولة، أو مصدر الحملة...'
                : 'Search by name, email, company, country, or UTM source...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Submissions List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedItem ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mb-3" />
                <p className="text-sm">
                  {isAr ? 'جاري تحميل استفسارات التواصل...' : 'Loading contact inquiries...'}
                </p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <TbMessageDots className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">
                  {isAr ? 'لا توجد رسائل مطابقة' : 'No contact submissions found'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {isAr
                    ? 'ستظهر الرسائل الواردة من نماذج الموقع هنا تلقائياً.'
                    : 'Inbound messages from the contact and home forms will appear here.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-[10px] text-slate-500 tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5 text-start">{isAr ? 'العميل والشركة' : 'Prospect & Company'}</th>
                      <th className="px-4 py-3.5 text-start">{isAr ? 'الموضوع / السبب' : 'Reason / Subject'}</th>
                      <th className="px-4 py-3.5 text-start">{isAr ? 'المصدر / الدولة' : 'Source / Country'}</th>
                      <th className="px-4 py-3.5 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="px-4 py-3.5 text-start">{isAr ? 'التاريخ' : 'Received'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => {
                      const isSelected = selectedItem?.id === item.id;
                      const statusMeta = getStatusMeta(item.status);
                      const topicLabel =
                        item.reason || item.subject || item.service || (isAr ? 'استفسار عام' : 'General Inquiry');
                      return (
                        <tr
                          key={item.id}
                          onClick={() => handleSelectRow(item)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-purple-500/10 font-medium' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
                            <div className="text-slate-500 text-xs">{item.email}</div>
                            {(item.company || item.jobTitle) && (
                              <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                                {[item.jobTitle, item.company].filter(Boolean).join(' • ')}
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                              {topicLabel}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              {item.country && (
                                <span className="text-xs font-medium text-slate-700">
                                  {item.country}
                                </span>
                              )}
                              {item.attribution?.utmSource ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded w-fit">
                                  <TbTag className="w-3 h-3" />
                                  {item.attribution.utmSource}
                                  {item.attribution.utmMedium ? ` / ${item.attribution.utmMedium}` : ''}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">
                                  {isAr ? 'مباشر / عضوي' : 'Direct / Organic'}
                                </span>
                              )}
                            </div>
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

        {/* Selected Prospect Inspector */}
        {selectedItem && (
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6 space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedItem.name}</h3>
                  <p className="text-xs text-slate-500">
                    {[selectedItem.jobTitle, selectedItem.company || (isAr ? 'عميل مباشر' : 'Direct Client')]
                      .filter(Boolean)
                      .join(' • ')}
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
                  {isAr ? 'حالة المتابعة' : 'Lead Qualification Status'}
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {STATUS_OPTIONS.map((opt) => {
                    const active = (selectedItem.status || 'unread') === opt.id;
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

              {/* Contact Metadata */}
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
                {selectedItem.company && (
                  <div className="flex items-center gap-2">
                    <TbBuilding className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      {isAr ? 'الشركة:' : 'Company:'} <strong>{selectedItem.company}</strong>
                    </span>
                  </div>
                )}
                {selectedItem.jobTitle && (
                  <div className="flex items-center gap-2">
                    <TbBriefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      {isAr ? 'المسمى الوظيفي:' : 'Job Title:'} <strong>{selectedItem.jobTitle}</strong>
                    </span>
                  </div>
                )}
                {selectedItem.country && (
                  <div className="flex items-center gap-2">
                    <TbWorld className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      {isAr ? 'الدولة:' : 'Country:'} <strong>{selectedItem.country}</strong>
                    </span>
                  </div>
                )}
                {(selectedItem.reason || selectedItem.subject || selectedItem.service) && (
                  <div className="pt-1 border-t border-slate-200/70">
                    <span>
                      {isAr ? 'الموضوع:' : 'Subject / Reason:'}{' '}
                      <strong className="text-purple-700">
                        {selectedItem.reason || selectedItem.subject || selectedItem.service}
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
                    <span>{isAr ? 'بيانات الحملة الإعلانية والمصدر (Attribution)' : 'Campaign & Click Attribution'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">{isAr ? 'المصدر (Source)' : 'UTM Source'}</span>
                      <span className="font-semibold text-slate-800">
                        {selectedItem.attribution.utmSource || 'Direct'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isAr ? 'الوسيط (Medium)' : 'UTM Medium'}</span>
                      <span className="font-semibold text-slate-800">
                        {selectedItem.attribution.utmMedium || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isAr ? 'الحملة (Campaign)' : 'UTM Campaign'}</span>
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
                  {(selectedItem.attribution.gclid ||
                    selectedItem.attribution.fbclid ||
                    selectedItem.attribution.ttclid) && (
                    <div className="pt-1.5 border-t border-indigo-100 flex flex-wrap gap-1.5">
                      {selectedItem.attribution.gclid && (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono">
                          GCLID: {selectedItem.attribution.gclid.slice(0, 14)}…
                        </span>
                      )}
                      {selectedItem.attribution.fbclid && (
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-mono">
                          FBCLID: {selectedItem.attribution.fbclid.slice(0, 14)}…
                        </span>
                      )}
                      {selectedItem.attribution.ttclid && (
                        <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-800 text-[10px] font-mono">
                          TTCLID: {selectedItem.attribution.ttclid.slice(0, 14)}…
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Message Content */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {isAr ? 'رسالة العميل' : 'Project Message'}
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 text-xs leading-relaxed whitespace-pre-wrap border border-slate-200/60 max-h-60 overflow-y-auto">
                  {selectedItem.message}
                </div>
              </div>

              {/* Internal CRM Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <TbNotes className="w-4 h-4 text-purple-600" />
                    <span>{isAr ? 'ملاحظات الفريق الداخلية' : 'Internal Team Notes'}</span>
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
                      ? 'أضف ملاحظات التأهيل، الميزانية المتوقعة، أو ملخص المكالمة...'
                      : 'Add qualification notes, call summary, or follow-up steps...'
                  }
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={`mailto:${selectedItem.email}?subject=Re:%20${encodeURIComponent(
                    selectedItem.subject || selectedItem.reason || 'Inquiry with Persici Agency'
                  )}`}
                  onClick={() => {
                    if ((selectedItem.status || 'unread') === 'unread') {
                      handleUpdateRecord(selectedItem.id, { status: 'replied' });
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  <TbMail className="w-4 h-4" />
                  <span>{isAr ? 'الرد على العميل عبر البريد' : 'Reply to Prospect via Email'}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
