'use client';

import React, { useState, useEffect, use } from 'react';
import {
  TbCalendarCheck,
  TbSearch,
  TbRefresh,
  TbMail,
  TbPhone,
  TbClock,
  TbBuilding,
  TbUser,
  TbCheck,
} from 'react-icons/tb';

interface AppointmentRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  date?: string;
  timeSlot?: string;
  timezone?: string;
  topic?: string;
  notes?: string;
  createdAt: string;
}

export default function AppointmentsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;

  const [items, setItems] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<AppointmentRecord | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointment', { cache: 'no-store' });
      const data = await res.json();
      if (data.appointments) {
        setItems(data.appointments);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredItems = items.filter((i) => {
    const q = search.toLowerCase();
    return (
      !search ||
      i.name.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      (i.company && i.company.toLowerCase().includes(q)) ||
      (i.topic && i.topic.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            <span>Leads & Appointments</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Strategy Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">
            Scheduled strategic consultations and digital architecture sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAppointments}
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
            placeholder="Search appointments by name, email, company, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Table + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedItem ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mb-3" />
                <p className="text-sm">Loading strategy bookings...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <TbCalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">No appointments scheduled</p>
                <p className="text-xs text-slate-400 mt-1">Booked strategy sessions will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-[10px] text-slate-500 tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Client</th>
                      <th className="px-4 py-3.5">Topic / Focus</th>
                      <th className="px-4 py-3.5">Booking Slot</th>
                      <th className="px-4 py-3.5">Requested On</th>
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
                              <div className="text-[11px] text-slate-400">{item.company}</div>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                              {item.topic || 'Strategy Alignment'}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-slate-700 font-medium">
                            {item.date || 'TBD'} {item.timeSlot ? `• ${item.timeSlot}` : ''}
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

        {/* Selected Appointment Inspector */}
        {selectedItem && (
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6 space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedItem.name}</h3>
                  <p className="text-xs text-slate-500">{selectedItem.company || 'Direct Consultation'}</p>
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
                {selectedItem.date && (
                  <div className="flex items-center gap-2">
                    <TbClock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{selectedItem.date} {selectedItem.timeSlot && `at ${selectedItem.timeSlot}`} ({selectedItem.timezone || 'UTC'})</span>
                  </div>
                )}
              </div>

              {selectedItem.notes && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Meeting Objective & Notes
                  </h4>
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs leading-relaxed whitespace-pre-wrap border border-slate-100">
                    {selectedItem.notes}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={`mailto:${selectedItem.email}?subject=Confirmed:%20Strategy%20Session%20with%20Persici%20Agency`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  <TbMail className="w-4 h-4" />
                  <span>Send Calendar Invite / Confirmation</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
