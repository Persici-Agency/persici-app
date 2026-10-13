import React from 'react';
import type { InsightDetail, InsightsHubPageData } from '../types';
import { insightsHubPageData } from '../data/insights.data';
import type { Dictionary } from '@dictionaries';
import type { SharedContactContent } from '@shared/types';
import { sectionContainer } from '@shared/constants';
import { InsightsHeroSection } from './insights-hero-section';
import { InsightsInfiniteGrid } from './insights-infinite-grid';
import { InsightsBlogNewsletterSection } from './insights-blog-newsletter-section';
import { FadeUp } from '@shared/components';
import { HomeContactSection } from '../../../_home/components/home-contact-section';

export interface InsightsHubViewProps {
  insights: InsightDetail[];
  lang: string;
  dict: Dictionary;
  pageContent?: InsightsHubPageData;
  sharedContact?: SharedContactContent;
}

export function InsightsHubView({
  insights,
  lang,
  dict,
  pageContent,
  sharedContact,
}: InsightsHubViewProps) {
  const isRtl = lang === 'ar';
  const locale = (lang === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
  const content = pageContent || insightsHubPageData;
  const explore = content.exploreSection || insightsHubPageData.exploreSection;

  const exploreBadge = explore.badge?.[locale] || explore.badge?.en || '';
  const exploreTitle = explore.title?.[locale] || explore.title?.en || '';
  const exploreSubtitle = explore.subtitle?.[locale] || explore.subtitle?.en || '';
  const isSubtitleHtml = /<[a-z][\s\S]*>/i.test(exploreSubtitle);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white">
      {/* 1. Hero Banner with Award-winning Thought Leadership & TLFT Medallion */}
      {content.hero?.enabled !== false && (
        <InsightsHeroSection lang={lang} hero={content.hero} />
      )}

      {/* 2. Explore All Content with Category Filter (All, Article, Research) & Minimal Card Grid */}
      {explore.enabled !== false && (
        <section
          id="explore"
          data-header-luminance="light"
          className="w-full bg-white py-20 sm:py-28 border-b border-slate-200/80 scroll-mt-20"
        >
          <div className={sectionContainer}>
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              {exploreBadge && (
                <FadeUp delay={0} duration={700} distance={16}>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-2 block">
                    {exploreBadge}
                  </span>
                </FadeUp>
              )}
              {exploreTitle && (
                <FadeUp delay={120} duration={850} distance={24} blur={true}>
                  <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight">
                    {exploreTitle}
                  </h2>
                </FadeUp>
              )}
              {exploreSubtitle && (
                <FadeUp delay={240} duration={750} distance={20}>
                  {isSubtitleHtml ? (
                    <div
                      className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto [&_p]:mb-2 [&_p:last-child]:mb-0"
                      dangerouslySetInnerHTML={{ __html: exploreSubtitle }}
                    />
                  ) : (
                    <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                      {exploreSubtitle}
                    </p>
                  )}
                </FadeUp>
              )}
            </div>

            {/* Filter Bar + 3-Column Minimal Card Grid */}
            <InsightsInfiniteGrid
              initialInsights={insights}
              lang={lang}
              exploreSection={explore}
            />
          </div>
        </section>
      )}

      {/* 3. Blog & Practical Guides Newsletter Section with Spiral Staircase */}
      {content.newsletterSection?.enabled !== false && (
        <InsightsBlogNewsletterSection
          lang={lang}
          newsletter={content.newsletterSection}
        />
      )}

      {/* 4. Global Contact Section */}
      {content.contactSection?.enabled !== false && (
        <HomeContactSection lang={lang} dict={dict} content={sharedContact} />
      )}
    </div>
  );
}

