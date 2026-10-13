import React from 'react';
import type { InsightDetail } from '../../../_insights/types';
import { DEFAULT_INSIGHT_SECTION_VISIBILITY } from '../../../_insights/data/insights.data';
import type { Dictionary } from '@dictionaries';
import type { SharedContactContent } from '@shared/types';
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
  sharedContact?: SharedContactContent;
}

export function InsightDetailView({
  insight,
  lang,
  dict,
  sharedContact,
}: InsightDetailViewProps) {
  const isRtl = lang === 'ar';
  const vis = {
    ...DEFAULT_INSIGHT_SECTION_VISIBILITY,
    ...(insight.sectionVisibility || {}),
  };

  const showSidebar = vis.showAuthorCard !== false || vis.showTableOfContents !== false;

  return (
    <article dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white text-slate-900">
      {/* 1. Header Section */}
      <InsightDetailHeaderSection insight={insight} lang={lang} visibility={vis} />

      {/* 2. Main 2-Column Split Body */}
      <div className={`relative z-10 w-full py-12 sm:py-16 lg:py-24 ${sectionContainer}`}>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left Column: Author Profile Card + Table of Contents with Active Scroll Spy */}
          {showSidebar && (
            <InsightStickyRailNav
              author={insight.author}
              tableOfContents={insight.tableOfContents}
              lang={lang}
              visibility={vis}
            />
          )}

          {/* Right Column: Main Content Area */}
          <div className="flex-1 min-w-0 w-full max-w-3xl">
            {/* Dynamic AI Overview with Generate Button */}
            {vis.showAiOverview !== false && (
              <InsightAiOverview insight={insight} lang={lang} />
            )}

            {/* Narrative Prose Sections wrapped with ID for AI Extraction */}
            <div id="insight-main-article-content" className="space-y-12 sm:space-y-16">
              {insight.sections.map((section) => {
                const heading = section.heading[lang as 'en' | 'ar'] || section.heading.en;
                const paragraphs = section.paragraphs[lang as 'en' | 'ar'] || section.paragraphs.en || [];
                const callout =
                  vis.showCallouts !== false && section.callout
                    ? section.callout[lang as 'en' | 'ar'] || section.callout.en
                    : null;
                const listItems =
                  vis.showBulletLists !== false && section.list
                    ? section.list[lang as 'en' | 'ar'] || section.list.en
                    : null;

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28 border-b border-slate-100 pb-10 last:border-b-0"
                  >
                    {/* Section Heading */}
                    {heading && (
                      <h2 className="font-primary text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight leading-snug mb-6">
                        {heading}
                      </h2>
                    )}

                    {/* Section Paragraphs */}
                    <div className="space-y-5 text-slate-700 leading-relaxed text-base sm:text-lg font-normal">
                      {paragraphs.map((para, pIdx) => {
                        const isHtml = /<[a-z][\s\S]*>/i.test(para);
                        return isHtml ? (
                          <div
                            key={pIdx}
                            className="[&_p]:mb-4 [&_p:last-child]:mb-0 [&_a]:text-persici-crimson [&_a]:underline [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6"
                            dangerouslySetInnerHTML={{ __html: para }}
                          />
                        ) : (
                          <p key={pIdx}>{para}</p>
                        );
                      })}
                    </div>

                    {/* Optional Highlighted Callout */}
                    {callout && (
                      <div className="my-8 border-s-4 border-persici-crimson bg-persici-crimson/5 p-6 rounded-e-2xl">
                        {/<[a-z][\s\S]*>/i.test(callout) ? (
                          <div
                            className="font-serif italic text-base sm:text-lg text-slate-900 leading-relaxed [&_p]:mb-0"
                            dangerouslySetInnerHTML={{ __html: callout }}
                          />
                        ) : (
                          <p className="font-serif italic text-base sm:text-lg text-slate-900 leading-relaxed">
                            “{callout}”
                          </p>
                        )}
                      </div>
                    )}

                    {/* Optional Structured Bullet List */}
                    {listItems && listItems.length > 0 && (
                      <ul className="mt-6 space-y-3.5">
                        {listItems.map((item, lIdx) => (
                          <li key={lIdx} className="flex items-start gap-3 text-slate-700 text-base sm:text-lg">
                            <span className="h-2 w-2 rounded-full bg-persici-crimson shrink-0 mt-2.5" />
                            {/<[a-z][\s\S]*>/i.test(item) ? (
                              <span
                                className="leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: item }}
                              />
                            ) : (
                              <span className="leading-relaxed">{item}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>

            {/* Helpfulness Rating Widget (Helpful? 👍 👎) */}
            {vis.showFeedbackWidget !== false && (
              <InsightFeedbackWidget lang={lang} />
            )}
          </div>
        </div>
      </div>

      {/* 3. Global Reusable Contact Section ("Ready to learn more? / Get in touch") */}
      {vis.showContactSection !== false && (
        <HomeContactSection lang={lang} dict={dict} content={sharedContact} />
      )}
    </article>
  );
}

