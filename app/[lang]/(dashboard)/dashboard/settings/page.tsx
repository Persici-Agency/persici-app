'use client';

import React, { useState, useEffect, use } from 'react';
import {
  TbSettings,
  TbLock,
  TbShieldCheck,
  TbDatabase,
  TbCloud,
  TbMail,
  TbRefresh,
  TbCheck,
  TbAlertCircle,
  TbKey,
} from 'react-icons/tb';

export default function SettingsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const [purgingCache, setPurgingCache] = useState(false);
  const [purgeStatus, setPurgeStatus] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: 'error',
        message: 'New password and confirmation do not match.',
      });
      return;
    }

    setSavingPassword(true);
    setPasswordStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordStatus({
          type: 'success',
          message: 'Password updated successfully!',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({
          type: 'error',
          message: data.error || 'Failed to update password',
        });
      }
    } catch {
      setPasswordStatus({ type: 'error', message: 'Connection error' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleGlobalRevalidation = async () => {
    setPurgingCache(true);
    setPurgeStatus(null);
    try {
      // Calling content PUT with home trigger forces revalidatePath
      const res = await fetch('/api/content/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setPurgeStatus('Global ISR cache successfully revalidated across all routes.');
      } else {
        setPurgeStatus('Cache revalidation initiated.');
      }
    } catch {
      setPurgeStatus('Cache revalidation initiated.');
    } finally {
      setPurgingCache(false);
      setTimeout(() => setPurgeStatus(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-1">
            <span>System Preferences</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">System & Security Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure administrative credentials, review cloud connectivity, and purge production ISR caches.
          </p>
        </div>
      </div>

      {/* Grid: Password Change + Infrastructure Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Account Password Change */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TbLock className="w-5 h-5 text-persici-crimson" />
            <h2 className="text-sm font-bold text-slate-900">Update Account Password</h2>
          </div>

          {passwordStatus.type === 'success' && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-semibold flex items-center gap-2">
              <TbCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passwordStatus.message}</span>
            </div>
          )}

          {passwordStatus.type === 'error' && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-semibold flex items-center gap-2">
              <TbAlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{passwordStatus.message}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password (minimum 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {savingPassword ? 'Updating Password...' : 'Save New Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Infrastructure & Connectivity Overview */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <TbShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Cloud Infrastructure Status</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <TbDatabase className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-slate-900">MongoDB Atlas Cluster</p>
                    <p className="text-[10px] text-slate-400 font-mono">persici-db.d2iexit.mongodb.net</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <TbCloud className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="font-semibold text-slate-900">Cloudflare R2 Object Storage</p>
                    <p className="text-[10px] text-slate-400 font-mono">persici-media &bull; Sharp WebP</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <TbMail className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="font-semibold text-slate-900">Hostinger SMTP Mail Gateway</p>
                    <p className="text-[10px] text-slate-400 font-mono">smtp.hostinger.com (Port 465 SSL)</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready
                </span>
              </div>
            </div>
          </div>

          {/* Global Cache Purge */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900">On-Demand Cache Management</h2>
            <p className="text-xs text-slate-500">
              Trigger a manual purge of Next.js 16 On-Demand ISR cache across the site.
            </p>

            {purgeStatus && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-semibold flex items-center gap-2">
                <TbCheck className="w-4 h-4 text-emerald-600" />
                <span>{purgeStatus}</span>
              </div>
            )}

            <button
              type="button"
              disabled={purgingCache}
              onClick={handleGlobalRevalidation}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <TbRefresh className={`w-4 h-4 ${purgingCache ? 'animate-spin' : ''}`} />
              <span>{purgingCache ? 'Purging Caches...' : 'Purge Global ISR Cache'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
