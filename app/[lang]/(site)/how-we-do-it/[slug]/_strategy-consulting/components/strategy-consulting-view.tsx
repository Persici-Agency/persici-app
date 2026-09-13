'use client';

import React, { useState } from 'react';
import type { Dictionary } from '@dictionaries';
import { strategyConsultingData } from '../data/strategy-consulting.data';
import { SolutionsHeroSection } from '../../../../solutions/_solutions/components/solutions-hero-section';
import { HowWeDoItSubNavbar } from '../../_components/how-we-do-it-sub-navbar';
import { SolutionsWhyItMatters } from '../../../../solutions/_solutions/components/solutions-why-it-matters';
import { SolutionsBenefitsStrip } from '../../../../solutions/_solutions/components/solutions-benefits-strip';
import {
  CapabilityCard,
  TechInfrastructureCard,
  FeaturedClientStories,
  ClientReviewSection,
  FaqSection,
} from '@shared';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { HomeContactSection } from '../../../../_home/components/home-contact-section';

interface StrategyConsultingViewProps {
  lang: string;
  dict: Dictionary;
}

export function StrategyConsultingView({
  lang,
  dict,
}: StrategyConsultingViewProps) {
  const isAr = lang === 'ar';
  const [isPaused, setIsPaused] = useState(false);
  const data = strategyConsultingData;

  const offeringsTitle = data.offeringsTitle[isAr ? 'ar' : 'en'];
  const offeringsSubtitle = data.offeringsSubtitle[isAr ? 'ar' : 'en'];

  const whyItMattersTitle = data.whyItMatters.title[isAr ? 'ar' : 'en'];
  const whyItMattersText = data.whyItMatters.text[isAr ? 'ar' : 'en'];

  const benefitsTitle = data.benefitsStrip.title[isAr ? 'ar' : 'en'];

  const engagementTitle = data.engagementModel.title[isAr ? 'ar' : 'en'];
  const engagementSubtitle = data.engagementModel.subtitle[isAr ? 'ar' : 'en'];

  const quoteText = data.quote.text[isAr ? 'ar' : 'en'];
  const quoteRole = data.quote.role[isAr ? 'ar' : 'en'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <SolutionsHeroSection
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        tag={data.hero.tag}
        secondaryTag={data.hero.secondaryTag}
        image={data.hero.image}
        ctaText={data.hero.ctaText}
        ctaHref={data.hero.ctaHref}
        lang={lang}
      />

      {/* 2. Sticky Sub-Navbar */}
      <HowWeDoItSubNavbar lang={lang} />

      {/* 3. Advisory Capabilities Grid */}
      <section id="capabilities" className={`w-full bg-[#FFFAFA] ${sectionPaddingY}`}>
        <div className={sectionContainer}>
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-persici-crimson/10 border border-persici-crimson/20 text-persici-crimson text-xs font-semibold uppercase tracking-wider mb-4">
              {isAr ? 'القدرات الاستشارية' : 'Advisory Capabilities'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-primary font-bold text-slate-900 tracking-tight leading-tight mb-5">
              {offeringsTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-secondary leading-relaxed">
              {offeringsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {data.offerings.map((item, idx) => (
              <CapabilityCard
                key={idx}
                title={item.title[isAr ? 'ar' : 'en'] || item.title.en}
                tag={item.tag[isAr ? 'ar' : 'en'] || item.tag.en}
                description={item.description[isAr ? 'ar' : 'en'] || item.description.en}
                diagramType={item.diagramType}
                icon={item.icon}
                isPaused={isPaused}
              />
            ))}
          </div>

          {/* Minimal Icon-Only Pause / Resume Button at bottom right */}
          <div className="mt-8 sm:mt-10 flex justify-end max-w-7xl mx-auto px-2">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-2xs hover:text-persici-crimson hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
              aria-label={
                isPaused
                  ? isAr
                    ? 'استئناف حركة المخططات'
                    : 'Resume animations'
                  : isAr
                    ? 'إيقاف مؤقت للحركة'
                    : 'Pause animations'
              }
              title={
                isPaused
                  ? isAr
                    ? 'استئناف حركة المخططات'
                    : 'Resume animations'
                  : isAr
                    ? 'إيقاف مؤقت للحركة'
                    : 'Pause animations'
              }
            >
              {isPaused ? (
                <svg className="h-4 w-4 fill-current ml-0.5 rtl:ml-0 rtl:mr-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              ) : (
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <rect x="5" y="4" width="4" height="16" rx="1" />
                  <rect x="15" y="4" width="4" height="16" rx="1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 4. Why It Matters Context */}
      <div id="why-it-matters">
        <SolutionsWhyItMatters
          title={whyItMattersTitle}
          text={whyItMattersText}
          image={data.whyItMatters.image}
          lang={lang}
        />
      </div>

      {/* 5. Strategic Benefits Strip */}
      <SolutionsBenefitsStrip
        title={benefitsTitle}
        image={data.benefitsStrip.image}
        benefits={data.benefitsStrip.benefits}
        lang={lang}
      />

      {/* 6. Strategic Engagement Model */}
      <section id="framework" className={`w-full bg-[#F9F8F6] ${sectionPaddingY}`}>
        <div className={sectionContainer}>
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-persici-crimson/10 border border-persici-crimson/20 text-persici-crimson text-xs font-semibold uppercase tracking-wider mb-4">
              {isAr ? 'نموذج التنفيذ' : 'Engagement Model'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-primary font-bold text-slate-900 tracking-tight leading-tight mb-5">
              {engagementTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-secondary leading-relaxed">
              {engagementSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.engagementModel.steps.map((step) => {
              const stepTitle = step.title[isAr ? 'ar' : 'en'];
              const stepDesc = step.description[isAr ? 'ar' : 'en'];

              return (
                <div
                  key={step.number}
                  className="group relative flex flex-col justify-between p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-persici-crimson/40 hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-persici-crimson opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                  <div>
                    <span className="font-mono text-3xl font-extrabold text-persici-crimson mb-4 block">
                      {step.number}
                    </span>
                    <h3 className="text-xl font-primary font-bold text-slate-900 mb-3 group-hover:text-persici-crimson transition-colors">
                      {stepTitle}
                    </h3>
                    <p className="text-sm text-slate-600 font-secondary leading-relaxed">
                      {stepDesc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Technology & Infrastructure Matrix */}
      <div id="verticals">
        <section className={`w-full bg-[#0E121B] text-white ${sectionPaddingY}`}>
          <div className={sectionContainer}>
            <div className="max-w-3xl mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-persici-crimson/20 border border-persici-crimson/30 text-persici-crimson text-xs font-semibold uppercase tracking-wider mb-4">
                {isAr ? 'الأدوات والبنية التحتية' : 'Toolchains & Platforms'}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-primary font-bold text-white tracking-tight leading-tight mb-5">
                {isAr ? 'منظومة التقنيات الاستراتيجية' : 'Strategic Technology Ecosystem'}
              </h2>
              <p className="text-base sm:text-lg text-slate-300 font-secondary leading-relaxed">
                {isAr
                  ? 'نوظف أرقى المنصات السحابية والتحليلية لتحويل الاستراتيجية إلى واقع رقمي ملموس.'
                  : 'We leverage enterprise cloud and intelligence platforms to transform strategy into operational reality.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {data.techStackPods.map((pod, idx) => {
                const podBadge = pod.badge
                  ? (pod.badge[isAr ? 'ar' : 'en'] || pod.badge.en)
                  : (isAr ? 'المنظومة' : 'Platform');
                const podTitle = pod.title[isAr ? 'ar' : 'en'] || pod.title.en;
                const podDesc = pod.description[isAr ? 'ar' : 'en'] || pod.description.en;

                return (
                  <TechInfrastructureCard
                    key={idx}
                    badge={podBadge}
                    title={podTitle}
                    description={podDesc}
                    technologies={pod.technologies}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* 8. Featured Client Stories */}
      <div id="stories">
        <FeaturedClientStories lang={lang} />
      </div>

      {/* 9. Executive Client Review */}
      <ClientReviewSection
        quoteText={quoteText}
        quoteAuthor={data.quote.author}
        quoteRole={quoteRole}
        lang={lang}
      />

      {/* 10. Enterprise FAQs Accordion */}
      <div id="faqs">
        <FaqSection
          title={{ en: 'Frequently Asked Questions', ar: 'الأسئلة الأكثر شيوعاً' }}
          subtitle={{
            en: 'Common questions on our strategic consulting and engagement frameworks.',
            ar: 'إجابات واضحة حول استشاراتنا الاستراتيجية ونماذج العمل التنفيذية.',
          }}
          faqs={data.faqs}
          lang={lang}
        />
      </div>

      {/* 11. Contact & Discovery Form */}
      <div id="contact">
        <HomeContactSection lang={lang} dict={dict} />
      </div>
    </div>
  );
}
