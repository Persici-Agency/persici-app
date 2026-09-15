'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sectionContainer } from '@shared/constants';
import { FadeUp } from '@shared/components';
import { TbCheck, TbLoader2, TbArrowRight, TbArrowLeft } from 'react-icons/tb';

export interface InsightsBlogNewsletterSectionProps {
  lang: string;
}

export function InsightsBlogNewsletterSection({ lang }: InsightsBlogNewsletterSectionProps) {
  const isRtl = lang === 'ar';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage(isRtl ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Simulate API call or call newsletter subscription endpoint
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage(isRtl ? 'حدث خطأ، يرجى المحاولة لاحقاً' : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section
      data-header-luminance="light"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full bg-slate-50/70 py-20 sm:py-28 border-t border-b border-slate-200/80"
    >
      <div className={sectionContainer}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Subtitle & Subscription Form */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            <FadeUp delay={0} duration={700} distance={16}>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-2 block">
                {isRtl ? 'النشرة المعرفية' : 'Persici Dispatch'}
              </span>
            </FadeUp>

            <FadeUp delay={120} duration={850} distance={24} blur={true}>
              <h2 className="font-primary text-4xl sm:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight">
                {isRtl ? 'المدونة المعرفية' : 'Blog'}
              </h2>
            </FadeUp>

            <FadeUp delay={240} duration={800} distance={20}>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {isRtl
                  ? 'من الصحافة، أدلة تطبيقية، وما نتعلمه أثناء بناء المنصات البرمجية الرائدة ونمو العلامات التجارية.'
                  : "From the press, practical guides and what we're learning as we build."}
              </p>
            </FadeUp>

            {/* Newsletter Form */}
            <FadeUp delay={360} duration={750} distance={18} className="w-full">
              <div className="mt-8 max-w-lg w-full">
                {status === 'success' ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800">
                    <TbCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm font-semibold">
                      {isRtl
                        ? 'شكراً لاشتراكك! ستصلك أحدث الرؤى والأدلة مباشرة إلى بريدك.'
                        : 'Thank you for subscribing! You will receive our latest insights and practical guides.'}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isRtl ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                        aria-label={isRtl ? 'البريد الإلكتروني' : 'Email address'}
                        className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-persici-crimson focus:outline-none focus:ring-2 focus:ring-persici-crimson/20 transition-all shadow-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-persici-crimson px-6 py-3 text-sm font-semibold text-white shadow-md shadow-persici-crimson/20 hover:bg-persici-crimson/90 transition-all duration-200 cursor-pointer disabled:opacity-60"
                    >
                      {status === 'loading' ? (
                        <TbLoader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <span>{isRtl ? 'اشتراك' : 'Submit'}</span>
                          {isRtl ? (
                            <TbArrowLeft className="h-4 w-4" />
                          ) : (
                            <TbArrowRight className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </button>
                  </form>
                )}

                {status === 'error' && errorMessage && (
                  <p className="mt-2 text-xs text-rose-600 font-medium">{errorMessage}</p>
                )}

                {/* Privacy Disclaimer */}
                <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                  {isRtl ? (
                    <>
                      بإرسال هذا النموذج، فإنك توافق على تلقي النشرات المعرفية والاتصالات التسويقية من بيرسيكي. يمكنك إلغاء الاشتراك في أي وقت. للمزيد من التفاصيل، راجع{' '}
                      <Link href={`/${lang}/privacy`} className="text-slate-700 underline hover:text-persici-crimson">
                        سياسة الخصوصية
                      </Link>
                      .
                    </>
                  ) : (
                    <>
                      By submitting this form you are agreeing to receive marketing communications about products, services, and events from Persici. You may unsubscribe at any time. For more information, please refer to our{' '}
                      <Link href={`/${lang}/privacy`} className="text-slate-700 underline hover:text-persici-crimson">
                        Privacy Policy
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>
            </FadeUp>
          </div>

          {/* Right Column: Red Spiral Staircase Architectural Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <FadeUp delay={200} duration={850} distance={30}>
              <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[380px] lg:h-[380px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
                <Image
                  src="/images/insights/persici-dispatch-staircase.webp"
                  alt={isRtl ? 'درج حلزوني أحمر رمزي للنمو' : 'Modern architectural crimson spiral staircase looking upwards to skylight'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
