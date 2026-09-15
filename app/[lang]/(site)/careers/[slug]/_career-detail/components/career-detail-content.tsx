'use client';

import React, { useState } from 'react';
import {
  TbCircleCheck,
  TbShare,
  TbCopy,
  TbCheck,
  TbBuildingSkyscraper,
  TbMapPin,
  TbClock,
  TbDeviceLaptop,
  TbPlane,
  TbHeartHandshake,
  TbCurrencyDollar,
  TbMail,
  TbBrandLinkedin,
} from 'react-icons/tb';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { HomeButton } from '@shared';
import type { CareerJobOpening, LocalizedString } from '../../../_careers/data/careers.data';

export interface CareerDetailContentProps {
  job: CareerJobOpening;
  lang: string;
}

export function CareerDetailContent({ job, lang }: CareerDetailContentProps) {
  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const shareOnLinkedIn = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }
  };

  const shareOnX = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(
        isAr
          ? `استكشف فرصة عمل: ${job.title.ar} لدى وكالة برسيسي`
          : `Explore opening: ${job.title.en} at Persici Agency`
      );
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    }
  };

  return (
    <section className={`bg-white ${sectionPaddingY} relative`}>
      <div className={sectionContainer}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ========================================================= */}
          {/* LEFT / MAIN CONTENT COLUMN (68% - 8 cols)                 */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-12 sm:space-y-14">
            {/* 1. The Mission & Strategic Context */}
            <div>
              <h2 className="font-primary text-2xl sm:text-3xl font-extrabold text-foreground mb-4 sm:mb-5">
                {isAr ? 'الهدف والرؤية العامة للدور' : 'The Mission & Context'}
              </h2>
              <p className="font-secondary text-base sm:text-lg text-foreground/80 leading-relaxed">
                {job.mission[isAr ? 'ar' : 'en']}
              </p>
            </div>

            {/* 2. Key Responsibilities */}
            <div>
              <h2 className="font-primary text-2xl sm:text-3xl font-extrabold text-foreground mb-5 sm:mb-6">
                {isAr ? 'المسؤوليات والمهام الأساسية' : 'What You Will Own & Deliver'}
              </h2>
              <ul className="space-y-4">
                {job.responsibilities.map((resp: LocalizedString, idx: number) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-persici-crimson/10 text-persici-crimson flex items-center justify-center shrink-0 mt-1">
                      <TbCircleCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-secondary text-sm sm:text-base text-foreground/80 leading-relaxed">
                      {resp[isAr ? 'ar' : 'en']}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Requirements & Qualifications */}
            <div>
              <h2 className="font-primary text-2xl sm:text-3xl font-extrabold text-foreground mb-5 sm:mb-6">
                {isAr ? 'المؤهلات والمهارات المطلوبة' : 'What You Bring to the Collective'}
              </h2>
              <ul className="space-y-4">
                {job.requirements.map((req: LocalizedString, idx: number) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-black/5 text-foreground/80 flex items-center justify-center shrink-0 mt-1">
                      <TbCircleCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-secondary text-sm sm:text-base text-foreground/80 leading-relaxed">
                      {req[isAr ? 'ar' : 'en']}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Preferred Qualifications (if available) */}
            {job.preferredQualifications && job.preferredQualifications.length > 0 && (
              <div>
                <h2 className="font-primary text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-5">
                  {isAr ? 'نقاط إضافية مميزة' : 'Bonus Points & Preferred Experience'}
                </h2>
                <ul className="space-y-3.5">
                  {job.preferredQualifications.map((pref: LocalizedString, idx: number) => (
                    <li key={idx} className="flex items-start gap-3.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2.5" />
                      <span className="font-secondary text-sm sm:text-base text-foreground/75 leading-relaxed">
                        {pref[isAr ? 'ar' : 'en']}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 5. Tech Stack & Tooling Cloud */}
            <div>
              <h2 className="font-primary text-xl sm:text-2xl font-bold text-foreground mb-4">
                {isAr ? 'الأدوات والمنظومة التقنية' : 'Tech Stack & Core Tooling'}
              </h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {job.techStack.map((tech: string) => (
                  <span
                    key={tech}
                    className="font-mono text-xs sm:text-sm px-3.5 py-1.5 rounded-xl bg-black/[0.03] border border-black/8 text-foreground font-semibold hover:border-persici-crimson/40 hover:bg-persici-crimson/5 transition-all"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. Role-Specific Total Rewards */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFAFA] border border-black/8">
                <h2 className="font-primary text-xl sm:text-2xl font-bold text-foreground mb-4">
                  {isAr ? 'المزايا الخاصة بهذه الوظيفة' : 'Role Perks & Total Rewards'}
                </h2>
                <ul className="space-y-3">
                  {job.benefits.map((benefit: LocalizedString, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <TbHeartHandshake className="w-4 h-4 text-persici-crimson shrink-0 mt-1" />
                      <span className="font-secondary text-sm sm:text-base text-foreground/80">
                        {benefit[isAr ? 'ar' : 'en']}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT / STICKY OVERVIEW SIDEBAR (32% - 4 cols)             */}
          {/* ========================================================= */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            {/* Quick Spec Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFAFA] border border-black/8 shadow-xs">
              <h3 className="font-primary text-lg font-bold text-foreground mb-5 pb-4 border-b border-black/5">
                {isAr ? 'ملخص الوظيفة السريع' : 'Role Specifications'}
              </h3>

              <div className="space-y-4 text-xs sm:text-sm font-secondary">
                {/* Department */}
                <div className="flex items-start gap-3">
                  <TbBuildingSkyscraper className="w-4 h-4 text-persici-crimson shrink-0 mt-0.5" />
                  <div>
                    <div className="text-foreground/50 text-[11px] uppercase font-mono font-medium">
                      {isAr ? 'القسم' : 'Department'}
                    </div>
                    <div className="font-semibold text-foreground">
                      {job.department[isAr ? 'ar' : 'en']}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <TbMapPin className="w-4 h-4 text-persici-crimson shrink-0 mt-0.5" />
                  <div>
                    <div className="text-foreground/50 text-[11px] uppercase font-mono font-medium">
                      {isAr ? 'المقر وساعات العمل' : 'Location & Rhythm'}
                    </div>
                    <div className="font-semibold text-foreground">
                      {job.location[isAr ? 'ar' : 'en']}
                    </div>
                  </div>
                </div>

                {/* Seniority */}
                <div className="flex items-start gap-3">
                  <TbClock className="w-4 h-4 text-persici-crimson shrink-0 mt-0.5" />
                  <div>
                    <div className="text-foreground/50 text-[11px] uppercase font-mono font-medium">
                      {isAr ? 'المستوى والخبرة' : 'Seniority Level'}
                    </div>
                    <div className="font-semibold text-foreground">
                      {job.experience[isAr ? 'ar' : 'en']}
                    </div>
                  </div>
                </div>

                {/* Compensation */}
                <div className="flex items-start gap-3">
                  <TbCurrencyDollar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-foreground/50 text-[11px] uppercase font-mono font-medium">
                      {isAr ? 'حزمة المكافأة' : 'Compensation Package'}
                    </div>
                    <div className="font-semibold text-foreground font-mono">
                      {job.salaryRange[isAr ? 'ar' : 'en']}
                    </div>
                  </div>
                </div>

                {/* Visa Support */}
                <div className="flex items-start gap-3">
                  <TbPlane className="w-4 h-4 text-persici-crimson shrink-0 mt-0.5" />
                  <div>
                    <div className="text-foreground/50 text-[11px] uppercase font-mono font-medium">
                      {isAr ? 'رعاية التأشيرة' : 'Visa Sponsorship'}
                    </div>
                    <div className="font-semibold text-foreground">
                      {isAr ? 'متاحة للمرشحين المعتمدين' : 'Available for verified candidates'}
                    </div>
                  </div>
                </div>

                {/* Equipment */}
                <div className="flex items-start gap-3">
                  <TbDeviceLaptop className="w-4 h-4 text-persici-crimson shrink-0 mt-0.5" />
                  <div>
                    <div className="text-foreground/50 text-[11px] uppercase font-mono font-medium">
                      {isAr ? 'العتاد والأجهزة' : 'Workstation Provided'}
                    </div>
                    <div className="font-semibold text-foreground">
                      {isAr ? 'MacBook Pro M-Series + ميزانية مكتبية' : 'MacBook Pro M-Series + Ergonomic Budget'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Apply CTA in Card */}
              <div className="mt-6 pt-5 border-t border-black/5">
                <HomeButton
                  href="#apply-now"
                  title={isAr ? 'التقديم على هذه الوظيفة' : 'Apply for this Role'}
                  iconDirection="down"
                  isLangEffectIcon
                  currentLang={lang}
                  className="w-full bg-persici-crimson hover:bg-persici-crimson-80 text-white shadow-lg shadow-persici-crimson/25 py-3.5 px-6 text-sm font-semibold"
                />
              </div>
            </div>

            {/* Share Position Card */}
            <div className="p-6 rounded-3xl bg-white border border-black/8 shadow-xs">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-4">
                <TbShare className="w-3.5 h-3.5 text-persici-crimson" />
                <span>{isAr ? 'مشاركة الوظيفة' : 'Share this Position'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-semibold text-foreground transition-colors"
                >
                  {copied ? (
                    <>
                      <TbCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <TbCopy className="w-3.5 h-3.5" />
                      <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={shareOnLinkedIn}
                  title="Share on LinkedIn"
                  className="w-10 h-10 rounded-xl bg-black/5 hover:bg-black/10 flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors"
                >
                  <TbBrandLinkedin className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={shareOnX}
                  title="Share on X"
                  className="w-10 h-10 rounded-xl bg-black/5 hover:bg-black/10 flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors font-mono font-bold text-xs"
                >
                  𝕏
                </button>
              </div>
            </div>

            {/* Talent Concierge Direct Inquiries */}
            <div className="p-6 rounded-3xl bg-black/[0.02] border border-black/5 text-center">
              <TbMail className="w-5 h-5 text-persici-crimson mx-auto mb-2" />
              <div className="font-primary text-xs sm:text-sm font-bold text-foreground mb-1">
                {isAr ? 'لديك استفسار حول الدور؟' : 'Questions About This Role?'}
              </div>
              <p className="font-secondary text-xs text-foreground/60 mb-3">
                {isAr ? 'تواصل مباشرة مع فريق التوظيف لدينا.' : 'Reach out directly to our talent acquisition team.'}
              </p>
              <a
                href={`mailto:hr@persiciagency.com?subject=Inquiry:%20${encodeURIComponent(job.title.en)}`}
                className="text-xs font-semibold text-persici-crimson hover:underline"
              >
                hr@persiciagency.com
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
