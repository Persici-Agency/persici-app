'use client';

import React, { useState } from 'react';
import type { Dictionary } from '@dictionaries';
import {
  sectionContainer,
  sectionPaddingY,
  FadeUp,
  SwiperWrapper,
  HomeButton,
} from '@shared';

export type HomeContactSectionProps = {
  lang: string;
  dict: Dictionary;
};

export function HomeContactSection({ lang, dict }: HomeContactSectionProps) {
  const [isVerifiedHuman, setIsVerifiedHuman] = useState(false);
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consent, setConsent] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    country: '',
    jobTitle: '',
    reason: '',
    message: '',
  });

  const points = [
    dict.homeContact?.point1 || 'Discuss your unique business challenges',
    dict.homeContact?.point2 || 'Explore custom growth solutions built for your industry',
    dict.homeContact?.point3 || 'Get proven performance media & CRO guidance',
    dict.homeContact?.point4 || 'Identify the next step that fits your revenue goals',
  ];

  const countries = [
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'Egypt',
    'United Kingdom',
    'United States',
    'Germany',
    'France',
    'Other',
  ];

  const handleCaptchaClick = () => {
    if (isVerifiedHuman || isVerifyingCaptcha) return;
    setIsVerifyingCaptcha(true);
    setTimeout(() => {
      setIsVerifyingCaptcha(false);
      setIsVerifiedHuman(true);
    }, 650);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerifiedHuman) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 850);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      country: '',
      jobTitle: '',
      reason: '',
      message: '',
    });
    setIsVerifiedHuman(false);
    setIsSubmitted(false);
  };

  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay policy handled
      });
    }
  }, []);

  return (
    <section className={`relative overflow-hidden bg-persici-black ${sectionPaddingY}`}>
      {/* Background Video from Videos Folder */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/Videos/AI%20Solutions%20for%20the%20Enterprise.mp4"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/Videos/AI%20Solutions%20for%20the%20Enterprise.mp4" type="video/mp4" />
          <source src="/Videos/AI Solutions for the Enterprise.mp4" type="video/mp4" />
        </video>
        {/* Subtle Ambient Overlay for Depth & Contrast */}
        <div className="absolute inset-0 backdrop-blur-[0.5px]" />
      </div>

      {/* Main Centered Contact Card (Structured with sectionContainer) */}
      <div className={sectionContainer}>
        <FadeUp delay={0} duration={800} distance={28}>
          <div className="relative mx-auto w-full rounded-3xl sm:rounded-[2.5rem] bg-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-black/10 text-foreground">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 items-start">

              {/* Left Column: Ready to learn more? & Checklist */}
              <div className="flex flex-col justify-between h-full lg:col-span-6 lg:pe-6">
                <div>
                  <h3 className="font-primary text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                    {dict.homeContact?.leftTitle || 'Ready to learn more?'}
                  </h3>

                  <ul className="mt-8 space-y-4 sm:space-y-5">
                    {points.map((pointText, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 text-sm sm:text-base text-foreground/80 font-medium leading-relaxed">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dark text-dark mt-0.5 shadow-2xs font-bold text-xs">
                          ✓
                        </span>
                        <span>{pointText}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Trust Row with SwiperWrapper */}
                <div className="mt-10 sm:mt-14 border-t border-black/10 pt-6">
                  <div className="w-full overflow-hidden">
                    <SwiperWrapper
                      title={dict.homeContact?.trustedBy || 'Trusted by leading eCommerce brands in the region.'}
                      showTitle={true}
                      titleClassName="text-center"
                      logoSize="xs"
                      speed="normal"
                      gap="sm"
                      fadeMask={true}
                      stopOnHover={false}
                      className="py-1"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Get in touch Form */}
              <div className="lg:col-span-6">
                <div>
                  <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                    {dict.homeContact?.title || 'Get in touch'}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-foreground/75">
                    {dict.homeContact?.subtitle || 'Submit the form below and one of our experts will reach out.'}
                  </p>
                  <span className="mt-3 block text-xs text-foreground/50">
                    {dict.homeContact?.requiredNote || '* Required field'}
                  </span>
                </div>

                {isSubmitted ? (
                  <div className="mt-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-8 text-center animate-wave-1">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg text-2xl font-bold">
                      ✓
                    </div>
                    <h4 className="font-primary text-xl font-bold text-foreground mt-4">
                      {dict.homeContact?.successTitle || 'Thank you for reaching out!'}
                    </h4>
                    <p className="mt-2 text-sm text-foreground/75 max-w-md mx-auto leading-relaxed">
                      {dict.homeContact?.successMsg ||
                        'We have received your message. One of our senior growth strategists will review your inquiry and connect with you within 24 hours.'}
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-2.5 text-xs font-semibold text-foreground hover:bg-black/5 transition-all shadow-xs cursor-pointer"
                    >
                      {dict.homeContact?.reset || 'Send another inquiry'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Row 1: First Name, Last Name, Company */}
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">
                          {dict.homeContact?.firstName || 'First name'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-all focus:border-persici-crimson focus:ring-2 focus:ring-persici-crimson/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">
                          {dict.homeContact?.lastName || 'Last name'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-all focus:border-persici-crimson focus:ring-2 focus:ring-persici-crimson/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">
                          {dict.homeContact?.company || 'Company'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-all focus:border-persici-crimson focus:ring-2 focus:ring-persici-crimson/20"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Country */}
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">
                          {dict.homeContact?.email || 'Email'} *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-all focus:border-persici-crimson focus:ring-2 focus:ring-persici-crimson/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">
                          {dict.homeContact?.country || 'Country'} *
                        </label>
                        <select
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-all focus:border-persici-crimson focus:ring-2 focus:ring-persici-crimson/20"
                        >
                          <option value="">{dict.homeContact?.countryPlaceholder || 'Select a country'}</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Job Title & Reason for Contacting */}
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">
                          {dict.homeContact?.jobTitle || 'Job Title'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.jobTitle}
                          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                          className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-all focus:border-persici-crimson focus:ring-2 focus:ring-persici-crimson/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">
                          {dict.homeContact?.reason || 'Reason for contacting'}
                        </label>
                        <select
                          value={formData.reason}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                          className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-all focus:border-persici-crimson focus:ring-2 focus:ring-persici-crimson/20"
                        >
                          <option value="">{dict.homeContact?.reasonPlaceholder || 'Select reasons'}</option>
                          <option value="paidSocial">{dict.homeContact?.reasons?.paidSocial || 'Paid Social Scaling'}</option>
                          <option value="googleAds">{dict.homeContact?.reasons?.googleAds || 'Google Ads & Search'}</option>
                          <option value="shopifyCro">{dict.homeContact?.reasons?.shopifyCro || 'Shopify Plus & CRO'}</option>
                          <option value="fullFunnel">{dict.homeContact?.reasons?.fullFunnel || 'Full-Funnel Partnership'}</option>
                          <option value="consultation">{dict.homeContact?.reasons?.consultation || 'Strategic Consultation'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Message */}
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">
                        {dict.homeContact?.message || 'Message'}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={dict.homeContact?.messagePlaceholder || 'How can we help you?'}
                        className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-all focus:border-persici-crimson focus:ring-2 focus:ring-persici-crimson/20"
                      />
                    </div>

                    {/* Authentic Google reCAPTCHA v2 Widget */}
                    <div className="pt-1">
                      <div
                        onClick={handleCaptchaClick}
                        className="flex w-[302px] items-center justify-between rounded-sm border border-[#d3d3d3] bg-[#f9f9f9] px-3 py-2.5 shadow-2xs cursor-pointer select-none transition-colors hover:border-[#b2b2b2]"
                        role="button"
                        tabIndex={0}
                        aria-label="Google reCAPTCHA verification"
                      >
                        {/* Left: Checkbox & Text */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-[2px] border-2 bg-white transition-all ${isVerifiedHuman
                              ? 'border-transparent text-emerald-600'
                              : 'border-[#c1c1c1]'
                              }`}
                          >
                            {isVerifyingCaptcha ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1a73e8] border-t-transparent" />
                            ) : isVerifiedHuman ? (
                              <span className="text-xl font-bold text-emerald-600">✓</span>
                            ) : null}
                          </div>
                          <span className="font-sans text-[13px] font-normal text-[#222]">
                            {dict.homeContact?.notRobot || "I'm not a robot"}
                          </span>
                        </div>

                        {/* Right: Google reCAPTCHA Branding */}
                        <div className="flex flex-col items-center justify-center text-center">
                          {/* Official Google reCAPTCHA 3-arrow logo */}
                          <svg className="h-8 w-8" viewBox="0 0 64 64" fill="none">
                            <path
                              d="M32 6C17.64 6 6 17.64 6 32c0 5.6 1.76 10.8 4.76 15.08l4.4-4.4C13.04 39.56 12 35.92 12 32c0-11.04 8.96-20 20-20v6l10-8-10-8V6z"
                              fill="#1A73E8"
                            />
                            <path
                              d="M58 32c0-5.6-1.76-10.8-4.76-15.08l-4.4 4.4C50.96 24.44 52 28.08 52 32c0 11.04-8.96 20-20 20v-6l-10 8 10 8v-6c14.36 0 26-11.64 26-26z"
                              fill="#4285F4"
                            />
                            <path
                              d="M20.88 47.12C23.96 49.6 27.8 51.2 32 51.2c7.08 0 13.2-3.68 16.72-9.28l5.2 3.08C49.6 52.48 41.36 57.2 32 57.2c-5.72 0-10.96-2.12-15.04-5.64l3.92-4.44z"
                              fill="#9AA0A6"
                            />
                          </svg>
                          <span className="text-[10px] font-medium text-[#555] -mt-0.5">reCAPTCHA</span>
                          <div className="flex items-center gap-1 text-[8px] text-[#555] mt-0.5">
                            <a
                              href="https://www.google.com/intl/en/policies/privacy/"
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:underline"
                            >
                              {dict.homeContact?.recaptchaPrivacy || 'Privacy'}
                            </a>
                            <span>-</span>
                            <a
                              href="https://www.google.com/intl/en/policies/terms/"
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:underline"
                            >
                              {dict.homeContact?.recaptchaTerms || 'Terms'}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Marketing Consent & HomeButton Submit Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none max-w-sm">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="h-4 w-4 mt-0.5 rounded accent-persici-crimson cursor-pointer shrink-0"
                        />
                        <span className="text-xs leading-tight text-foreground/70">
                          {dict.homeContact?.consent ||
                            'Sign me up to receive future marketing communications regarding our products, services and events.'}
                        </span>
                      </label>

                      <HomeButton
                        type="submit"
                        title={isSubmitting ? (dict.homeContact?.submitting || 'Sending...') : (dict.homeContact?.submit || 'Submit')}
                        disabled={!isVerifiedHuman}
                        loading={isSubmitting}
                        currentLang={lang}
                        isLangEffectIcon={true}
                        className="bg-persici-crimson text-white text-sm font-semibold shrink-0"
                        iconClassName="bg-white text-persici-crimson"
                      />
                    </div>

                    {/* Legal Disclaimer */}
                    <p className="pt-2 text-[11px] leading-relaxed text-foreground/50">
                      {dict.homeContact?.disclaimer ||
                        'By submitting this form, you authorize Persici to contact you regarding your inquiry. Read our Privacy Policy for more detail or opt out at any time.'}
                    </p>
                  </form>
                )}
              </div>

            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
