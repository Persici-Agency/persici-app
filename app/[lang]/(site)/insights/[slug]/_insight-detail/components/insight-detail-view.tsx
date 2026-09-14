import React from 'react';
import type { InsightDetail } from '../../../_insights/types';
import type { Dictionary } from '@dictionaries';
import { sectionContainer } from '@shared/constants';
import { InsightDetailHeaderSection } from './insight-detail-header-section';
import { InsightStickyRailNav } from './insight-sticky-rail-nav';
import { InsightAiOverview } from './insight-ai-overview';
import { InsightFeedbackWidget } from './insight-feedback-widget';
import { HomeContactSection } from '../../../../_home/components/home-contact-section';

export interface InsightDetailViewProps {
  insight: InsightDetail;
  lang: string;
  dict: Dictionary;
}

export function InsightDetailView({ insight, lang, dict }: InsightDetailViewProps) {
  const isRtl = lang === 'ar';

  return (
    <article dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white text-slate-900">
      {/* 1. Header Section */}
      <InsightDetailHeaderSection insight={insight} lang={lang} />

      {/* 2. Main 2-Column Split Body */}
      <div className={`relative z-10 w-full py-12 sm:py-16 lg:py-24 ${sectionContainer}`}>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left Column: Author Profile Card + Table of Contents with Active Scroll Spy */}
          <InsightStickyRailNav
            author={insight.author}
            tableOfContents={insight.tableOfContents}
            lang={lang}
          />

          {/* Right Column: Main Content Area */}
          <div className="flex-1 min-w-0 w-full max-w-3xl">
            {/* Dynamic AI Overview with Generate Button */}
            <InsightAiOverview insight={insight} lang={lang} />

            {/* Narrative Prose Sections wrapped with ID for AI Extraction */}
            <div id="insight-main-article-content" className="space-y-12 sm:space-y-16">
              {insight.sections.map((section) => {
                const heading = section.heading[lang as 'en' | 'ar'] || section.heading.en;
                const paragraphs = section.paragraphs[lang as 'en' | 'ar'] || section.paragraphs.en;
                const callout = section.callout
                  ? section.callout[lang as 'en' | 'ar'] || section.callout.en
                  : null;
                const listItems = section.list
                  ? section.list[lang as 'en' | 'ar'] || section.list.en
                  : null;

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28 border-b border-slate-100 pb-10 last:border-b-0"
                  >
                    {/* Section Heading */}
                    <h2 className="font-primary text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-6">
                      {heading}
                    </h2>

                    {/* Section Paragraphs */}
                    <div className="space-y-5 text-slate-700 leading-relaxed text-base sm:text-lg font-normal">
                      {paragraphs.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>

                    {/* Optional Highlighted Callout */}
                    {callout && (
                      <div className="my-8 border-s-4 border-persici-crimson bg-persici-crimson/5 p-6 rounded-e-2xl">
                        <p className="font-serif italic text-base sm:text-lg text-slate-900 leading-relaxed">
                          “{callout}”
                        </p>
                      </div>
                    )}

                    {/* Optional Structured Bullet List */}
                    {listItems && listItems.length > 0 && (
                      <ul className="mt-6 space-y-3.5">
                        {listItems.map((item, lIdx) => (
                          <li key={lIdx} className="flex items-start gap-3 text-slate-700 text-base sm:text-lg">
                            <span className="h-2 w-2 rounded-full bg-persici-crimson shrink-0 mt-2.5" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>

            {/* Helpfulness Rating Widget (Helpful? 👍 👎) */}
            <InsightFeedbackWidget lang={lang} />
          </div>
        </div>
      </div>

      {/* 3. Global Reusable Contact Section ("Ready to learn more? / Get in touch") */}
      <HomeContactSection lang={lang} dict={dict} />
    </article>
  );
}
