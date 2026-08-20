'use client';

import { useState } from 'react';
import type { Dictionary } from '@dictionaries';
import { getContactOffices } from '../services';

export function ContactFormSection({ dict }: { dict: Dictionary }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const offices = getContactOffices();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 font-primary text-xl font-bold text-foreground">
                  {dict.discovery.form.successTitle}
                </h3>
                <p className="mt-2 text-sm text-foreground/70">
                  {dict.discovery.form.successMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/80">
                    {dict.contact.name}
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-xs text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground/80">
                    {dict.contact.email}
                  </label>
                  <input
                    type="email"
                    required
                    className="mt-1 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-xs text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
                    placeholder="you@brand.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground/80">
                    {dict.contact.message}
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="mt-1 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-xs text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
                    placeholder="Tell us about your brand, current monthly revenue, and growth objectives..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-persici-crimson py-3.5 text-xs font-semibold text-white shadow-lg shadow-persici-crimson/25 transition-all hover:bg-persici-crimson-80 hover:shadow-xl active:scale-[0.99]"
                >
                  <span>{loading ? 'Sending...' : dict.contact.send}</span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
                    →
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Office Locations Column */}
        <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
          <div className="space-y-4">
            <h3 className="font-primary text-xl font-bold text-foreground">
              Global Growth Hubs
            </h3>
            {offices.map((office) => (
              <div
                key={office.city}
                className="rounded-2xl border border-black/10 bg-white p-5 shadow-xs"
              >
                <div className="font-primary text-sm font-bold text-persici-crimson">
                  {office.city}
                </div>
                <div className="mt-1 text-xs text-foreground/70">{office.address}</div>
                <div className="mt-2 text-xs font-medium text-foreground/90">{office.email}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-persici-black p-6 text-white">
            <div className="text-xs text-persici-blush font-semibold">Direct Inquiries</div>
            <div className="mt-1 text-sm font-bold">growth@persici.com</div>
            <div className="mt-2 text-xs text-white/60">Response within 2 hours during business days.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
