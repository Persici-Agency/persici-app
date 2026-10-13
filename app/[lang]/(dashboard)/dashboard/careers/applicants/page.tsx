'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  TbSearch,
  TbFilter,
  TbFileText,
  TbMail,
  TbPhone,
  TbMapPin,
  TbBrandLinkedin,
  TbBrandGithub,
  TbExternalLink,
  TbClock,
  TbNotes,
  TbCheck,
  TbX,
  TbRefresh,
  TbChevronDown,
} from 'react-icons/tb';
import { CandidateEmailModal } from '@dashboard-shared/components';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  roleSlug: string;
  roleTitle: string;
  department?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  expectedSalary?: string;
  coverNote?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  status: 'new' | 'reviewing' | 'interviewing' | 'offered' | 'rejected';
  internalNotes?: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; borderClass: string }
> = {
  new: {
    label: 'New Applicant',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    borderClass: 'border-l-blue-500',
  },
  reviewing: {
    label: 'Under Review',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    borderClass: 'border-l-amber-500',
  },
  interviewing: {
    label: 'Interviewing',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    borderClass: 'border-l-purple-500',
  },
  offered: {
    label: 'Offer Extended',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderClass: 'border-l-emerald-500',
  },
  rejected: {
    label: 'Declined',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    borderClass: 'border-l-slate-400',
  },
};

export default function CareerApplicantsPage() {
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || 'en';

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeApplicant, setActiveApplicant] = useState<Applicant | null>(null);

  // Email modal state
  const [emailModalApplicant, setEmailModalApplicant] = useState<Applicant | null>(null);

  // Notes editing state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('/api/careers/applicants', window.location.origin);
      if (selectedStatus !== 'all') url.searchParams.set('status', selectedStatus);
      if (searchQuery.trim()) url.searchParams.set('q', searchQuery.trim());

      const res = await fetch(url.toString(), { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.applicants)) {
        setApplicants(data.applicants);
      }
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, searchQuery]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/careers/applicants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setApplicants((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus as Applicant['status'] } : app))
        );
        if (activeApplicant?.id === id) {
          setActiveApplicant((prev) => (prev ? { ...prev, status: newStatus as Applicant['status'] } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update applicant status:', err);
    }
  };

  const saveNotes = async (id: string) => {
    setSavingNote(true);
    try {
      const res = await fetch('/api/careers/applicants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, notes: noteText }),
      });
      if (res.ok) {
        setApplicants((prev) =>
          prev.map((app) => (app.id === id ? { ...app, internalNotes: noteText } : app))
        );
        if (activeApplicant?.id === id) {
          setActiveApplicant((prev) => (prev ? { ...prev, internalNotes: noteText } : null));
        }
        setEditingNotesId(null);
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-1">
            <span>Talent Acquisition & ATS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Candidate Pipeline</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review incoming CVs, candidate portfolios, update evaluation stages, and email candidates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchApplicants()}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <TbRefresh className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {['all', 'new', 'reviewing', 'interviewing', 'offered', 'rejected'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'All Applicants' : STATUS_CONFIG[st]?.label || st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <TbSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates by name, email, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
          />
        </div>
      </div>

      {/* Main Grid: Pipeline Table + Candidate Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Applicant List Column */}
        <div className={`${activeApplicant ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-persici-crimson border-t-transparent mb-3" />
                <p>Loading candidate pipeline...</p>
              </div>
            ) : applicants.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <TbFileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">No applicants found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-[10px] text-slate-500 tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Candidate</th>
                      <th className="px-4 py-3.5">Position Applied</th>
                      <th className="px-4 py-3.5">Stage</th>
                      <th className="px-4 py-3.5">Applied Date</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applicants.map((app) => {
                      const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.new;
                      const isSelected = activeApplicant?.id === app.id;

                      return (
                        <tr
                          key={app.id}
                          onClick={() => setActiveApplicant(app)}
                          className={`cursor-pointer transition-colors border-l-4 ${cfg.borderClass} ${
                            isSelected ? 'bg-persici-crimson/5 font-medium' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-900 text-sm">{app.name}</div>
                            <div className="text-slate-500 text-xs flex items-center gap-2 mt-0.5">
                              <span>{app.email}</span>
                              {app.phone && <span className="text-slate-300">&bull;</span>}
                              {app.phone && <span>{app.phone}</span>}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="font-medium text-slate-800">{app.roleTitle}</div>
                            {app.department && <div className="text-[11px] text-slate-400">{app.department}</div>}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.badgeClass}`}
                            >
                              {cfg.label}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-slate-400 text-[11px]">
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                          </td>

                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              {app.resumeUrl && (
                                <a
                                  href={`/api/careers/resumes/${app.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="View Resume Document"
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-persici-crimson hover:bg-slate-100 transition-colors"
                                >
                                  <TbFileText className="w-4 h-4" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => setEmailModalApplicant(app)}
                                title="Send Candidate Email"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-persici-crimson hover:bg-slate-100 transition-colors"
                              >
                                <TbMail className="w-4 h-4" />
                              </button>
                            </div>
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

        {/* Candidate Detail Drawer Column */}
        {activeApplicant && (
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6 space-y-6">
              {/* Header with Close */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{activeApplicant.name}</h2>
                  <p className="text-xs text-slate-500">{activeApplicant.roleTitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveApplicant(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
                >
                  <TbX className="w-5 h-5" />
                </button>
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Pipeline Stage
                </label>
                <select
                  value={activeApplicant.status}
                  onChange={(e) => updateStatus(activeApplicant.id, e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
                >
                  <option value="new">New Applicant</option>
                  <option value="reviewing">Under Review</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offer Extended</option>
                  <option value="rejected">Declined</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {activeApplicant.resumeUrl ? (
                  <a
                    href={`/api/careers/resumes/${activeApplicant.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <TbFileText className="w-4 h-4" />
                    <span>View CV / Resume</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-medium">
                    <span>No Resume File</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setEmailModalApplicant(activeApplicant)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm"
                >
                  <TbMail className="w-4 h-4" />
                  <span>Send HR Email</span>
                </button>
              </div>

              {/* Contact Information */}
              <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
                <h3 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                  Contact Details
                </h3>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <TbMail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${activeApplicant.email}`} className="hover:text-persici-crimson underline">
                    {activeApplicant.email}
                  </a>
                </div>

                {activeApplicant.phone && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <TbPhone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{activeApplicant.phone}</span>
                  </div>
                )}

                {activeApplicant.location && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <TbMapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{activeApplicant.location}</span>
                  </div>
                )}
              </div>

              {/* Online Links */}
              {(activeApplicant.linkedinUrl || activeApplicant.portfolioUrl || activeApplicant.githubUrl) && (
                <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
                  <h3 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                    Online Presence & Portfolio
                  </h3>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeApplicant.linkedinUrl && (
                      <a
                        href={activeApplicant.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                      >
                        <TbBrandLinkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                        <TbExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                      </a>
                    )}

                    {activeApplicant.githubUrl && (
                      <a
                        href={activeApplicant.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
                      >
                        <TbBrandGithub className="w-4 h-4" />
                        <span>GitHub</span>
                        <TbExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                      </a>
                    )}

                    {activeApplicant.portfolioUrl && (
                      <a
                        href={activeApplicant.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors"
                      >
                        <TbExternalLink className="w-4 h-4" />
                        <span>Portfolio</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Cover Note */}
              {activeApplicant.coverNote && (
                <div className="space-y-1.5 border-t border-slate-100 pt-4 text-xs">
                  <h3 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                    Candidate Cover Statement
                  </h3>
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-600 text-xs italic leading-relaxed whitespace-pre-wrap border border-slate-100">
                    &ldquo;{activeApplicant.coverNote}&rdquo;
                  </div>
                </div>
              )}

              {/* Internal HR Notes */}
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <TbNotes className="w-3.5 h-3.5 text-persici-crimson" />
                    <span>Internal HR Assessment Notes</span>
                  </h3>
                  {editingNotesId !== activeApplicant.id && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNotesId(activeApplicant.id);
                        setNoteText(activeApplicant.internalNotes || '');
                      }}
                      className="text-persici-crimson text-[11px] font-semibold hover:underline"
                    >
                      Edit Note
                    </button>
                  )}
                </div>

                {editingNotesId === activeApplicant.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add private feedback, interviewer assessment, salary target, or next steps..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson/20 focus:border-persici-crimson"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingNotesId(null)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={savingNote}
                        onClick={() => saveNotes(activeApplicant.id)}
                        className="px-3 py-1 bg-persici-crimson text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
                      >
                        {savingNote ? 'Saving...' : 'Save Note'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {activeApplicant.internalNotes || 'No internal notes added yet.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Email Dispatcher Modal */}
      {emailModalApplicant && (
        <CandidateEmailModal
          isOpen={!!emailModalApplicant}
          onClose={() => setEmailModalApplicant(null)}
          applicant={{
            id: emailModalApplicant.id,
            name: emailModalApplicant.name,
            email: emailModalApplicant.email,
            roleTitle: emailModalApplicant.roleTitle,
          }}
          onEmailSent={() => {
            fetchApplicants();
          }}
        />
      )}
    </div>
  );
}
