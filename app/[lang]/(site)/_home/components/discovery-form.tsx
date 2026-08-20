'use client';

import { useState } from 'react';
import type { Dictionary } from '@dictionaries';

export function DiscoveryCallForm({ dict }: { dict: Dictionary }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    website: '',
    revenue: '$25,000 - $100,000 / month',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="mt-4 font-primary text-xl font-bold text-foreground">
          {dict.discovery.form.successTitle}
        </h4>
        <p className="mt-2 text-sm text-foreground/70">
          {dict.discovery.form.successMsg}
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-flex items-center rounded-full bg-persici-black px-6 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          {dict.common.backToHome}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
        <div>
          <span className="inline-block rounded-full bg-persici-crimson/10 px-3 py-1 text-[11px] font-semibold text-persici-crimson">
            {dict.discovery.form.badge}
          </span>
          <h3 className="mt-2 font-primary text-lg font-bold text-foreground">
            {dict.discovery.form.title}
          </h3>
          <p className="text-xs text-foreground/60">
            {dict.discovery.form.duration}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-foreground/80">
              {dict.discovery.form.firstName}
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-xs text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
              placeholder="Faris"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground/80">
              {dict.discovery.form.lastName}
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-xs text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
              placeholder="Al-Otaibi"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground/80">
            {dict.discovery.form.email}
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 w-full rounded-xl border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-xs text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
            placeholder="faris@brand.com"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground/80">
            {dict.discovery.form.website}
          </label>
          <input
            type="text"
            required
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="mt-1 w-full rounded-xl border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-xs text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
            placeholder="https://brand.com"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground/80">
            {dict.discovery.form.revenue}
          </label>
          <select
            value={formData.revenue}
            onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
            className="mt-1 w-full rounded-xl border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-xs text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
          >
            <option value="under-25k">{dict.discovery.form.revenueOption1}</option>
            <option value="25k-100k">{dict.discovery.form.revenueOption2}</option>
            <option value="100k-500k">{dict.discovery.form.revenueOption3}</option>
            <option value="500k-plus">{dict.discovery.form.revenueOption4}</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-persici-crimson py-3 text-xs font-semibold text-white shadow-lg shadow-persici-crimson/25 transition-all hover:bg-persici-crimson-80 hover:shadow-xl active:scale-[0.99] disabled:opacity-75"
        >
          {loading ? (
            <span>{dict.discovery.form.submitting}</span>
          ) : (
            <>
              <span>{dict.discovery.form.submit}</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
                →
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
