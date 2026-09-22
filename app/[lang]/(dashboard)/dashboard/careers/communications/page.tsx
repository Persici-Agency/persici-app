'use client';

import React, { useState, useEffect, use } from 'react';
import {
  TbMailFast,
  TbMail,
  TbClock,
  TbUser,
  TbBriefcase,
  TbRefresh,
  TbSearch,
  TbCheck,
  TbAlertCircle,
  TbFileText,
} from 'react-icons/tb';

interface CommunicationRecord {
  id: string;
  applicantId?: string;
  applicantName: string;
  applicantEmail: string;
  roleTitle?: string;
  subject: string;
  message: string;
  templateType: string;
  sentBy: string;
  sentByName?: string;
  sentAt: string;
  messageId: string;
  isSimulated?: boolean;
}

export default function CareerCommunicationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;

  const [logs, setLogs] = useState<CommunicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<CommunicationRecord | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/careers/communications', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setLogs(data.messages);
      }
    } catch (err) {
      console.error('Failed to load communication logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      !search ||
      log.applicantName.toLowerCase().includes(q) ||
      log.applicantEmail.toLowerCase().includes(q) ||
      log.subject.toLowerCase().includes(q) ||
      (log.roleTitle && log.roleTitle.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
            <span>Talent Acquisition &bull; Audit Trail</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Dispatched HR Emails</h1>
          <p className="text-sm text-slate-500 mt-1">
            Auditable history of all candidate invitations, offers, and communication sent via hr@persiciagency.com.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchLogs}
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
            placeholder="Search email logs by candidate, recipient, or subject line..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
          />
        </div>
      </div>

      {/* Main Grid: Communications Log + Message Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedMessage ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-3" />
                <p className="text-sm">Loading communication records...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <TbMailFast className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">No communication logs recorded</p>
                <p className="text-xs text-slate-400 mt-1">
                  Emails sent to applicants from the Candidate Pipeline will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-[10px] text-slate-500 tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Candidate / Recipient</th>
                      <th className="px-4 py-3.5">Subject & Template</th>
                      <th className="px-4 py-3.5">Sender</th>
                      <th className="px-4 py-3.5">Sent Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.map((log) => {
                      const isSelected = selectedMessage?.id === log.id;
                      return (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedMessage(log)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-amber-500/10 font-medium' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-900 text-sm">{log.applicantName}</div>
                            <div className="text-slate-500 text-xs">{log.applicantEmail}</div>
                            {log.roleTitle && (
                              <div className="text-[11px] text-slate-400 mt-0.5">{log.roleTitle}</div>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <div className="font-medium text-slate-800 line-clamp-1">{log.subject}</div>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-100 text-slate-600">
                              {log.templateType}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-xs">
                            <div className="font-medium text-slate-700">{log.sentByName || 'HR Manager'}</div>
                            <div className="text-[10px] text-slate-400">{log.sentBy}</div>
                          </td>

                          <td className="px-4 py-4 text-slate-400 text-[11px] whitespace-nowrap">
                            {log.sentAt ? new Date(log.sentAt).toLocaleString() : 'N/A'}
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

        {/* Selected Message Inspector */}
        {selectedMessage && (
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6 space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedMessage.subject}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sent to {selectedMessage.applicantName} ({selectedMessage.applicantEmail})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 bg-slate-100 rounded-lg"
                >
                  Close
                </button>
              </div>

              <div className="space-y-1 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <strong className="text-slate-700">Sender:</strong> {selectedMessage.sentByName} ({selectedMessage.sentBy})
                </div>
                <div>
                  <strong className="text-slate-700">Origin:</strong> hr@persiciagency.com (Hostinger SMTP)
                </div>
                <div>
                  <strong className="text-slate-700">Date:</strong> {new Date(selectedMessage.sentAt).toLocaleString()}
                </div>
                <div>
                  <strong className="text-slate-700">Message ID:</strong>{' '}
                  <span className="font-mono text-[10px]">{selectedMessage.messageId}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email Message Body
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 text-xs font-sans whitespace-pre-wrap leading-relaxed border border-slate-200/60 max-h-96 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
