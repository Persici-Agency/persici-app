'use client';

import React, { useState } from 'react';
import { TbX, TbSend, TbMailCheck } from 'react-icons/tb';

export interface CandidateEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: {
    id: string;
    name: string;
    email: string;
    roleTitle: string;
  };
  onEmailSent?: () => void;
}

const TEMPLATES: Record<string, { label: string; subject: string; body: (name: string, role: string) => string }> = {
  screening: {
    label: 'Initial Alignment / Screening',
    subject: 'Persici Agency — Initial Strategy Alignment for {role}',
    body: (name, role) => `Dear ${name},

Thank you for your application for the ${role} position at Persici Agency.

We were impressed by your background and portfolio. We would love to schedule a brief 20-minute introductory conversation to discuss your work, our current roadmap, and mutual alignment.

Please let us know your availability over the next two days or share a convenient time slot.

Looking forward to speaking with you.

Best regards,
Persici Talent Acquisition Team
hr@persiciagency.com`,
  },
  interview: {
    label: 'Technical / Strategy Interview Invitation',
    subject: 'Interview Invitation: {role} at Persici Agency',
    body: (name, role) => `Dear ${name},

We are pleased to invite you to the next stage of our recruitment process for the ${role} position.

This session will be an in-depth conversation with our practice directors focusing on system architecture, practical case studies, and engineering standards.

Meeting Details:
• Platform: Google Meet (link to follow)
• Duration: 45 minutes
• Focus: Technical & Strategic Execution

Please confirm if this works for you or suggest an alternate time.

Best regards,
Persici Talent Acquisition Team
hr@persiciagency.com`,
  },
  offer: {
    label: 'Offer Letter Discussion',
    subject: 'Offer of Employment: {role} at Persici Agency',
    body: (name, role) => `Dear ${name},

Following our conversations, we are thrilled to extend an offer for you to join Persici Agency as a ${role}.

We believe your skills, vision, and craftsmanship will have a transformative impact on our client partners and engineering culture.

Please find the preliminary outline of the offer attached for your review. We would like to schedule a brief call today to walk you through the details and answer any questions.

Congratulations, and welcome to the team!

Best regards,
Leadership & Talent Collective
Persici Agency
hr@persiciagency.com`,
  },
  rejection: {
    label: 'Respectful Status Update',
    subject: 'Update on your application for {role} at Persici Agency',
    body: (name, role) => `Dear ${name},

Thank you for taking the time to apply and interview for the ${role} role at Persici Agency.

While your profile is undeniably strong, we have decided to move forward with another candidate whose current expertise aligns more closely with the immediate demands of this specific engagement.

We will keep your dossier in our talent collective and will reach out directly when a matching engagement opens.

We wish you continued success in your professional journey.

Warm regards,
Persici Talent Acquisition Team
hr@persiciagency.com`,
  },
  custom: {
    label: 'Custom Blank Message',
    subject: 'Persici Careers: Regarding your application for {role}',
    body: (name) => `Dear ${name},

`,
  },
};

export function CandidateEmailModal({
  isOpen,
  onClose,
  applicant,
  onEmailSent,
}: CandidateEmailModalProps) {
  const [templateKey, setTemplateKey] = useState('screening');
  const [subject, setSubject] = useState(
    TEMPLATES.screening.subject.replace('{role}', applicant.roleTitle)
  );
  const [message, setMessage] = useState(
    TEMPLATES.screening.body(applicant.name, applicant.roleTitle)
  );
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTemplateChange = (key: string) => {
    setTemplateKey(key);
    const tmpl = TEMPLATES[key];
    if (tmpl) {
      setSubject(tmpl.subject.replace('{role}', applicant.roleTitle));
      setMessage(tmpl.body(applicant.name, applicant.roleTitle));
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    setSending(true);
    try {
      const res = await fetch('/api/careers/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId: applicant.id,
          applicantName: applicant.name,
          applicantEmail: applicant.email,
          roleTitle: applicant.roleTitle,
          subject,
          message,
          templateType: templateKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch email.');

      setSentSuccess(true);
      if (onEmailSent) onEmailSent();
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1800);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Send Official HR Email to Candidate
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              From: <span className="font-mono font-semibold text-slate-700">hr@persiciagency.com</span> &bull; To:{' '}
              <span className="font-semibold text-slate-700">{applicant.email}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <TbX className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <TbMailCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Email Dispatched Successfully!</h4>
            <p className="text-xs text-slate-500 mt-1">Recorded in applicant communication history log.</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6 space-y-4">
            {/* Template Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Select HR Communication Template
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(TEMPLATES).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleTemplateChange(k)}
                    className={`p-2 rounded-lg text-start text-xs font-medium border transition-colors ${
                      templateKey === k
                        ? 'border-persici-crimson bg-red-50/60 text-persici-crimson font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Line */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 font-medium text-slate-900"
              />
            </div>

            {/* Email Body */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Message Content (Sent via Hostinger SMTP)
              </label>
              <textarea
                rows={9}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 font-mono text-slate-800 resize-y leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-persici-crimson hover:bg-red-600 text-white text-xs font-semibold rounded-lg shadow-sm shadow-persici-crimson/20 transition-colors"
              >
                {sending ? (
                  <span>Dispatching...</span>
                ) : (
                  <>
                    <TbSend className="w-4 h-4" />
                    <span>Send Email to Candidate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
