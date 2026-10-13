'use client';

import React, { useState, useEffect, use } from 'react';
import {
  TbMessageDots,
  TbSearch,
  TbRefresh,
  TbMail,
  TbPhone,
  TbBuilding,
  TbCalendar,
  TbFileText,
  TbCheck,
} from 'react-icons/tb';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  createdAt: string;
}

export default function ContactInquiriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;

  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<ContactSubmission | null>(null);

  const fetchInquiries = async () => {
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
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filteredItems = items.filter((i) => {
    const q = search.toLowerCase();
    return (
      !search ||
      i.name.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      (i.company && i.company.toLowerCase().includes(q)) ||
      (i.service && i.service.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            <span>Leads & Inbound Inquiries</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Form Submissions</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and qualify incoming enterprise project inquiries from the main contact page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchInquiries}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <TbRefresh className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <TbSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries by client name, email, company, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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
                <p className="text-sm">Loading contact inquiries...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <TbMessageDots className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">No contact submissions found</p>
                <p className="text-xs text-slate-400 mt-1">Inbound messages from the contact page will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-[10px] text-slate-500 tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Prospect</th>
                      <th className="px-4 py-3.5">Service Requested</th>
                      <th className="px-4 py-3.5">Budget</th>
                      <th className="px-4 py-3.5">Received Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => {
                      const isSelected = selectedItem?.id === item.id;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-purple-500/10 font-medium' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
                            <div className="text-slate-500 text-xs">{item.email}</div>
                            {item.company && (
                              <div className="text-[11px] text-slate-400 font-medium">{item.company}</div>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                              {item.service || 'General Inquiry'}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-slate-700 font-medium">
                            {item.budget || 'Undisclosed'}
                          </td>

                          <td className="px-4 py-4 text-slate-400 text-[11px] whitespace-nowrap">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
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
                  <p className="text-xs text-slate-500">{selectedItem.company || 'Direct Client'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 bg-slate-100 rounded-lg"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <TbMail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${selectedItem.email}`} className="text-purple-700 font-medium hover:underline">
                    {selectedItem.email}
                  </a>
                </div>
                {selectedItem.phone && (
                  <div className="flex items-center gap-2">
                    <TbPhone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{selectedItem.phone}</span>
                  </div>
                )}
                {selectedItem.service && (
                  <div className="flex items-center gap-2">
                    <TbBuilding className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Requested: <strong>{selectedItem.service}</strong></span>
                  </div>
                )}
                {selectedItem.budget && (
                  <div>
                    <span>Budget Range: <strong>{selectedItem.budget}</strong></span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Project Message
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 text-xs leading-relaxed whitespace-pre-wrap border border-slate-200/60 max-h-80 overflow-y-auto">
                  {selectedItem.message}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={`mailto:${selectedItem.email}?subject=Re:%20Inquiry%20with%20Persici%20Agency`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  <TbMail className="w-4 h-4" />
                  <span>Reply to Prospect</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
