'use client';

import { useState } from 'react';
import { TbChevronDown } from 'react-icons/tb';
import type { Dictionary } from '@dictionaries';
import { HomeButton } from '@shared/components/home-button';
import { getHomeDiscoveryRevenueOptions } from '../services';
import type { DiscoveryFormData } from '@shared/types';
import { getStoredAttribution, trackLeadConversion } from '@/lib/tracking-events';

export function DiscoveryCallForm({ dict }: { dict: Dictionary }) {
  const revenueOptions = getHomeDiscoveryRevenueOptions();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<DiscoveryFormData>({
    firstName: '',
    lastName: '',
    email: '',
    website: '',
    revenue: revenueOptions[1]?.value || '25k-100k',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        attribution: getStoredAttribution(),
      };

      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit discovery request.');
      }

      trackLeadConversion('discovery', {
        revenue: formData.revenue,
        website: formData.website,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('[DiscoveryCallForm] Submit error:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to submit discovery request.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="mt-4 font-primary text-xl font-medium text-foreground">
          {dict.discovery.form.successTitle}
        </h4>
        <p className="mt-2 text-sm text-foreground/70">
          {dict.discovery.form.successMsg}
        </p>
        <HomeButton
          type="button"
          onClick={() => setSubmitted(false)}
          title={dict.common.backToHome}
          className="mt-6"
          isLangEffectIcon={true}
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
        <div>
          <span className="inline-block rounded-full bg-persici-crimson/10 px-3 py-1 text-[9.5px] font-semibold text-persici-crimson">
            {dict.discovery.form.badge}
          </span>
          <h3 className="mt-2 font-primary text-lg font-medium text-foreground">
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
          <div className="relative mt-1">
            <select
              value={formData.revenue}
              onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
              className="w-full appearance-none rounded-xl border border-black/10 bg-black/[0.02] ps-3.5 pe-11 py-2.5 text-xs text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20 cursor-pointer"
            >
              {revenueOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {dict.discovery.form[opt.labelKey as keyof typeof dict.discovery.form] || opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-4 text-foreground/50">
              <TbChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
            {errorMessage}
          </div>
        )}

        <HomeButton
          type="submit"
          disabled={loading}
          loading={loading}
          title={loading ? dict.discovery.form.submitting : dict.discovery.form.submit}
          className="mt-4 w-full justify-center bg-persici-crimson text-white shadow-lg shadow-persici-crimson/25"
          isLangEffectIcon={true}
        />
      </form>
    </div>
  );
}
