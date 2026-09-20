'use client';

import React, { useState } from 'react';
import type { Dictionary } from '@dictionaries';
import { experienceTransformationData } from '../data/experience-transformation.data';
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

interface ExperienceTransformationViewProps {
  lang: string;
  dict: Dictionary;
}

export function ExperienceTransformationView({
  lang,
  dict,
}: ExperienceTransformationViewProps) {
  const isAr = lang === 'ar';
  const [isPaused, setIsPaused] = useState(false);
  const data = experienceTransformationData;

  const offeringsTitle = data.offeringsTitle[isAr ? 'ar' : 'en'];
  const offeringsSubtitle = data.offeringsSubtitle[isAr ? 'ar' : 'en'];

  const whyItMattersTitle = data.whyItMatters.title[isAr ? 'ar' : 'en'];
  const whyItMattersText = data.whyItMatters.text[isAr ? 'ar' : 'en'];

  const benefitsTitle = data.benefitsStrip.title[isAr ? 'ar' : 'en'];

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

      {/* 3. The 5 Core Experience Domains */}
      <section id="capabilities" className={`w-full bg-[#FFFAFA] ${sectionPaddingY}`}>
        <div className={sectionContainer}>
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-persici-crimson/10 border border-persici-crimson/20 text-persici-crimson text-xs font-semibold uppercase tracking-wider mb-4">
              {isAr ? 'مجالات تجربة المستخدم' : 'Experience Domains'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-primary font-medium text-slate-900 tracking-tight leading-tight mb-5">
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
      <div id="framework">
        <SolutionsBenefitsStrip
          title={benefitsTitle}
          image={data.benefitsStrip.image}
          benefits={data.benefitsStrip.benefits}
          lang={lang}
        />
      </div>

      {/* 6. Technology & Infrastructure Matrix */}
      <div id="verticals">
        <section className={`w-full bg-[#0E121B] text-white ${sectionPaddingY}`}>
          <div className={sectionContainer}>
            <div className="max-w-3xl mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-persici-crimson/20 border border-persici-crimson/30 text-persici-crimson text-xs font-semibold uppercase tracking-wider mb-4">
                {isAr ? 'منظومة أدوات التجربة' : 'Experience Architecture'}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-primary font-medium text-white tracking-tight leading-tight mb-5">
                {isAr ? 'منظومة التصميم وأنظمة رموز الواجهات' : 'Design Systems & Experience Toolchains'}
              </h2>
              <p className="text-base sm:text-lg text-slate-300 font-secondary leading-relaxed">
                {isAr
                  ? 'نوظف أرقى مكتبات المكونات ورموز التصميم لتوحيد الهوية وتسريع إطلاق الواجهات.'
                  : 'Tokenized component libraries and research platforms driving cohesive, frictionless customer interactions.'}
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

      {/* 7. Featured Client Stories */}
      <div id="stories">
        <FeaturedClientStories lang={lang} />
      </div>

      {/* 8. Executive Client Review */}
      <ClientReviewSection
        quoteText={quoteText}
        quoteAuthor={data.quote.author}
        quoteRole={quoteRole}
        lang={lang}
      />

      {/* 9. Enterprise FAQs Accordion */}
      <div id="faqs">
        <FaqSection
          title={{ en: 'Frequently Asked Questions', ar: 'الأسئلة الأكثر شيوعاً' }}
          subtitle={{
            en: 'Answers on human-centered design, design systems, and omnichannel experience transformation.',
            ar: 'إجابات واضحة حول التصميم المتمحور حول الإنسان، وأنظمة التصميم المؤسسية، وتحول تجارب العملاء.',
          }}
          faqs={data.faqs}
          lang={lang}
        />
      </div>

      {/* 10. Contact & Discovery Form */}
      <div id="contact">
        <HomeContactSection lang={lang} dict={dict} />
      </div>
    </div>
  );
}
