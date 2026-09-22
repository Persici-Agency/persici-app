'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { TbLock, TbMail, TbArrowRight, TbEye, TbEyeOff, TbShieldCheck } from 'react-icons/tb';
import { Logo } from '@dashboard-shared/components';

export default function DashboardLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const from = searchParams.get('from') || `/${lang}/dashboard`;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      // Successful login
      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0c0e] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-persici-crimson/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#131418] border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Brand Header with Persici Logo beside Shield icon before Persici Growth OS text */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3.5 mb-4">
            <Logo lang={lang} variant="light" className="h-8 w-auto sm:h-9" />
            <div className="h-6 w-px bg-white/20" />
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-persici-crimson/15 border border-persici-crimson/30 text-persici-crimson shadow-lg shadow-persici-crimson/20 shrink-0">
              <TbShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Persici Growth OS
          </h1>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-widest font-mono">
            Administrative & Team Gateway
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
              Work Email Address
            </label>
            <div className="relative">
              <TbMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-persici-crimson w-5 h-5 pointer-events-none z-10" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@persiciagency.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-persici-crimson/30 focus:border-persici-crimson shadow-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <TbLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-persici-crimson w-5 h-5 pointer-events-none z-10" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-24 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-persici-crimson/30 focus:border-persici-crimson shadow-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5 text-xs font-semibold transition-all select-none shadow-xs z-10"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <>
                    <TbEyeOff className="w-4 h-4 text-persici-crimson" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <TbEye className="w-4 h-4 text-persici-crimson" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-persici-crimson hover:bg-red-600 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-persici-crimson/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <TbArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            Encrypted session &bull; Role-based access control &bull; Persici Agency
          </p>
        </div>
      </div>
    </div>
  );
}
