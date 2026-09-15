'use client';

import React, { useState, useRef } from 'react';
import {
  TbCloudUpload,
  TbFileText,
  TbCircleCheck,
  TbAlertCircle,
  TbLoader2,
  TbX,
  TbSend,
  TbShieldCheck,
} from 'react-icons/tb';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { HomeButton } from '@shared';
import type { CareerJobOpening } from '../../../_careers/data/careers.data';

export interface CareerDetailApplicationFormProps {
  job: CareerJobOpening;
  lang: string;
}

export function CareerDetailApplicationForm({ job, lang }: CareerDetailApplicationFormProps) {
  const isAr = lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    portfolioUrl: '',
    startDate: 'Within 2–4 Weeks',
    expectedSalary: '',
    coverNote: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const validateAndSetFile = (file?: File) => {
    setFileError(null);
    if (!file) return;

    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowed.includes(ext)) {
      setFileError(
        isAr
          ? 'صيغة الملف غير مدعومة. يرجى رفع ملف بصيغة PDF أو DOC أو DOCX.'
          : 'Invalid file format. Please upload a PDF, DOC, or DOCX document.'
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError(
        isAr
          ? 'حجم الملف يتجاوز الحد الأقصى المسموح به (10 ميغابايت).'
          : 'File size exceeds the 10MB maximum limit.'
      );
      return;
    }

    setResumeFile(file);
  };

  const removeFile = () => {
    setResumeFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      setSubmitError(
        isAr
          ? 'يرجى إكمال الحقول الإلزامية: الاسم والبريد الإلكتروني.'
          : 'Please complete all required fields: Name and Email are mandatory.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('email', formData.email.trim());
      data.append('phone', formData.phone.trim());
      data.append('location', formData.location.trim());
      data.append('roleSlug', job.slug);
      data.append('roleTitle', job.title.en);
      data.append('department', job.department.en);
      data.append('linkedinUrl', formData.linkedinUrl.trim());
      data.append('portfolioUrl', formData.portfolioUrl.trim());
      data.append('startDate', formData.startDate);
      data.append('expectedSalary', formData.expectedSalary.trim());
      data.append('coverNote', formData.coverNote.trim());
      data.append('locale', lang);

      if (resumeFile) {
        data.append('resume', resumeFile);
      }

      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application.');
      }

      setSubmittedId(result.applicationId || 'PER-' + Date.now().toString().slice(-6));
    } catch (err) {
      console.error('[Application Form] Submission error:', err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : isAr
          ? 'حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى أو مراسلتنا على hr@persiciagency.com.'
          : 'An error occurred while submitting your application. Please try again or email hr@persiciagency.com.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="apply-now" className={`bg-[#F9F8F6] ${sectionPaddingY} relative scroll-mt-12 border-t border-black/5`}>
      <div className={sectionContainer}>
        <div className="max-w-4xl mx-auto">
          {submittedId ? (
            /* Success State */
            <div className="p-8 sm:p-14 rounded-3xl bg-white border border-black/8 shadow-xl text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                <TbCircleCheck className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>

              <span className="font-mono text-xs uppercase font-semibold text-persici-crimson bg-persici-crimson/10 px-3.5 py-1 rounded-full">
                {isAr ? 'تم استلام طلبك بنجاح' : 'Application Received'}
              </span>

              <h2 className="font-primary text-2xl sm:text-4xl font-extrabold text-foreground mt-4 mb-3">
                {isAr ? 'شكراً لاهتمامك بالانضمام إلى برسيسي' : 'Thank You for Applying to Persici'}
              </h2>

              <p className="font-secondary text-sm sm:text-base text-foreground/70 max-w-xl mx-auto leading-relaxed mb-6">
                {isAr
                  ? `تم تسجيل طلبك بنجاح لوظيفة "${job.title.ar}". سيقوم قادة القسم بمراجعة سيرتك وملفك والتواصل معك خلال 48 إلى 72 ساعة عمل.`
                  : `Your application for "${job.title.en}" has been successfully logged. Our department leads review every dossier and will respond within 48 to 72 business hours.`}
              </p>

              <div className="inline-flex items-center gap-2 font-mono text-xs text-foreground/60 bg-black/5 px-4 py-2 rounded-xl mb-8">
                <span>{isAr ? 'رقم المرجع:' : 'Application Ref:'}</span>
                <span className="font-bold text-foreground">{submittedId}</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <HomeButton
                  href={`/${lang}/careers`}
                  title={isAr ? 'استكشاف وظائف أخرى' : 'Explore Other Openings'}
                  isLangEffectIcon
                  currentLang={lang}
                  className="bg-persici-crimson hover:bg-persici-crimson-80 text-white shadow-lg shadow-persici-crimson/25 px-7 py-3 text-xs sm:text-sm font-semibold"
                />
                <HomeButton
                  href={`/${lang}/client-stories`}
                  title={isAr ? 'مشاهدة قصص نجاح عملائنا' : 'View Client Stories'}
                  icon={null}
                  className="border border-black/15 bg-white text-foreground hover:bg-black/5 px-7 py-3 text-xs sm:text-sm font-semibold"
                />
              </div>
            </div>
          ) : (
            /* Application Form */
            <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-white border border-black/8 shadow-xl">
              {/* Header */}
              <div className="mb-8 sm:mb-10 pb-6 border-b border-black/5">
                <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-persici-crimson/10 text-[11px] font-mono font-semibold uppercase tracking-wider text-persici-crimson mb-3">
                  <span>{isAr ? 'نموذج التقديم المباشر' : 'Official Application'}</span>
                </div>
                <h2 className="font-primary text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
                  {isAr ? `التقديم على: ${job.title.ar}` : `Apply for: ${job.title.en}`}
                </h2>
                <p className="font-secondary text-xs sm:text-sm text-foreground/60">
                  {isAr
                    ? 'يستغرق هذا النموذج دقيقتين فقط. نلتزم بمراجعة كل طلب بشرياً خلال 48 إلى 72 ساعة عمل.'
                    : 'This application takes approximately 2 minutes. We review every dossier humanly within 48 to 72 business hours.'}
                </p>
              </div>

              {submitError && (
                <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                  <TbAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 font-secondary">
                      {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isAr ? 'محمد أحمد' : 'Alex Mercer'}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-black/10 bg-black/[0.02] text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 font-secondary">
                      {isAr ? 'البريد الإلكتروني *' : 'Work or Personal Email *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-black/10 bg-black/[0.02] text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
                    />
                  </div>
                </div>

                {/* Row 2: Phone & Current Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 font-secondary">
                      {isAr ? 'رقم الهاتف (مع رمز الدولة) *' : 'Phone Number (with Country Code) *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+971 50 000 0000"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-black/10 bg-black/[0.02] text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 font-secondary">
                      {isAr ? 'مكان الإقامة الحالي (المدينة، الدولة)' : 'Current Location (City, Country)'}
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder={isAr ? 'دبي، الإمارات العربية المتحدة' : 'Dubai, United Arab Emirates'}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-black/10 bg-black/[0.02] text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
                    />
                  </div>
                </div>

                {/* Row 3: LinkedIn & Portfolio/GitHub */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 font-secondary">
                      {isAr ? 'رابط ملف لينكد إن' : 'LinkedIn Profile URL'}
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-black/10 bg-black/[0.02] text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 font-secondary">
                      {isAr ? 'رابط معرض الأعمال أو جيت هب' : 'Portfolio / GitHub / Website URL'}
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="https://github.com/username or portfolio.com"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-black/10 bg-black/[0.02] text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
                    />
                  </div>
                </div>

                {/* Row 4: Availability & Expected Compensation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 font-secondary">
                      {isAr ? 'أقرب موعد للبدء' : 'Earliest Available Start Date'}
                    </label>
                    <select
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-black/10 bg-black/[0.02] text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
                    >
                      <option value="Immediately">{isAr ? 'فوري' : 'Immediately'}</option>
                      <option value="Within 2–4 Weeks">{isAr ? 'خلال 2 – 4 أسابيع' : 'Within 2–4 Weeks'}</option>
                      <option value="1 Month Notice">{isAr ? 'فترة إشعار شهر' : '1 Month Notice Period'}</option>
                      <option value="Flexible / Negotiable">{isAr ? 'مرن / قابل للتفاوض' : 'Flexible / Negotiable'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 font-secondary">
                      {isAr ? 'الراتب المتوقع (شهرياً أو سنوياً)' : 'Expected Compensation (Monthly / Annual)'}
                    </label>
                    <input
                      type="text"
                      value={formData.expectedSalary}
                      onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                      placeholder={isAr ? 'مثال: 45,000 درهم شهرياً' : 'e.g. $100k/yr or AED 45,000/mo'}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-black/10 bg-black/[0.02] text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
                    />
                  </div>
                </div>

                {/* CV / Resume File Upload Zone */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 font-secondary">
                    {isAr ? 'السيرة الذاتية (CV / Resume) *' : 'Resume / Curriculum Vitae (CV) *'}
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {resumeFile ? (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-foreground">
                      <div className="flex items-center gap-3">
                        <TbFileText className="w-6 h-6 text-emerald-600" />
                        <div>
                          <div className="font-primary text-xs sm:text-sm font-bold truncate max-w-[200px] sm:max-w-md">
                            {resumeFile.name}
                          </div>
                          <div className="font-mono text-[10px] text-foreground/50">
                            {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1.5 rounded-lg text-foreground/50 hover:text-red-600 hover:bg-white transition-colors"
                        title={isAr ? 'إزالة الملف' : 'Remove file'}
                      >
                        <TbX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-black/15 hover:border-persici-crimson bg-black/[0.01] hover:bg-persici-crimson/[0.02] cursor-pointer transition-all text-center group"
                    >
                      <TbCloudUpload className="w-8 h-8 text-foreground/40 group-hover:text-persici-crimson transition-colors mb-2" />
                      <div className="font-primary text-xs sm:text-sm font-bold text-foreground mb-1">
                        {isAr ? 'انقر لرفع ملف السيرة الذاتية أو اسحبه هنا' : 'Click to upload your resume or drag and drop'}
                      </div>
                      <p className="font-secondary text-[11px] text-foreground/50">
                        PDF, DOC, DOCX ({isAr ? 'حتى 10 ميغابايت' : 'up to 10MB'})
                      </p>
                    </div>
                  )}

                  {fileError && (
                    <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                      <TbAlertCircle className="w-3.5 h-3.5" />
                      <span>{fileError}</span>
                    </p>
                  )}
                </div>

                {/* Cover Note */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 font-secondary">
                    {isAr ? 'رسالة موجزة / لماذا ترغب بالانضمام لبرسيسي؟' : 'Brief Statement / Why Persici?'}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.coverNote}
                    onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                    placeholder={
                      isAr
                        ? 'أخبرنا باختصار عن أبرز إنجازاتك وما الذي تتطلع إلى بنائه وتطويره معنا...'
                        : 'Tell us briefly about your greatest technical or growth achievement, and what you hope to build here...'
                    }
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-black/10 bg-black/[0.02] text-foreground outline-none transition-all focus:border-persici-crimson focus:bg-white focus:ring-2 focus:ring-persici-crimson/20"
                  />
                </div>

                {/* Security Note & Submit Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[11px] text-foreground/50">
                    <TbShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      {isAr
                        ? 'بياناتك وسيرتك الذاتية مشفرة وتُعامل بسرية تامة.'
                        : 'Your dossier is encrypted and treated with absolute confidentiality.'}
                    </span>
                  </div>

                  <HomeButton
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    title={
                      isSubmitting
                        ? (isAr ? 'جاري إرسال طلبك...' : 'Submitting Dossier...')
                        : (isAr ? 'إرسال طلب التقديم' : 'Submit Application')
                    }
                    icon={
                      isSubmitting ? (
                        <TbLoader2 className="w-4 h-4 animate-spin text-persici-crimson" />
                      ) : (
                        <TbSend className="w-4 h-4 rtl:rotate-180" />
                      )
                    }
                    className="w-full sm:w-auto bg-persici-crimson hover:bg-persici-crimson-80 text-white shadow-lg shadow-persici-crimson/25 px-8 py-3 text-xs sm:text-sm font-semibold"
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
