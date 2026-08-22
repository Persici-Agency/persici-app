'use client';

import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consent, setConsent] = useState(true);

  const recaptchaRef = useRef<ReCAPTCHA>(null);

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

  const handleCaptchaChange = (token: string | null) => {
    setIsVerifiedHuman(Boolean(token));
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
    recaptchaRef.current?.reset();
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
                      pauseOnHover={false}
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

                    {/* Google reCAPTCHA v2 Widget */}
                    <div className="pt-2">
                      <div className="inline-block overflow-hidden rounded-sm border border-black/10 shadow-2xs">
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                          onChange={handleCaptchaChange}
                          onExpired={() => handleCaptchaChange(null)}
                          onErrored={() => handleCaptchaChange(null)}
                          hl={lang}
                          theme="light"
                        />
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
