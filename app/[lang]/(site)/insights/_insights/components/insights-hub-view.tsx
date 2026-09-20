import React from 'react';
import type { InsightDetail } from '../types';
import type { Dictionary } from '@dictionaries';
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
}

export function InsightsHubView({ insights, lang, dict }: InsightsHubViewProps) {
  const isRtl = lang === 'ar';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white">
      {/* 1. Hero Banner with Award-winning Thought Leadership & TLFT Medallion */}
      <InsightsHeroSection lang={lang} />

      {/* 2. Explore All Content with Category Filter (All, Article, Research) & Minimal Card Grid */}
      <section
        id="explore"
        data-header-luminance="light"
        className="w-full bg-white py-20 sm:py-28 border-b border-slate-200/80 scroll-mt-20"
      >
        <div className={sectionContainer}>
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <FadeUp delay={0} duration={700} distance={16}>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-2 block">
                {isRtl ? 'المعرفة والتحليلات' : 'Knowledge & Analysis'}
              </span>
            </FadeUp>
            <FadeUp delay={120} duration={850} distance={24} blur={true}>
              <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight">
                {isRtl ? 'استكشف كافة المحتويات والرؤى' : 'Explore all content'}
              </h2>
            </FadeUp>
            <FadeUp delay={240} duration={750} distance={20}>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                {isRtl
                  ? 'تصفح أحدث الأبحاث والدراسات الميدانية، والمقالات المعرفية الموجهة لقادة التحول الرقمي ورواد الأعمال.'
                  : 'Browse our complete catalog of empirical research, architectural playbooks, and strategic perspectives designed for forward-thinking leaders.'}
              </p>
            </FadeUp>
          </div>

          {/* Filter Bar + 3-Column Minimal Card Grid */}
          <InsightsInfiniteGrid initialInsights={insights} lang={lang} />
        </div>
      </section>

      {/* 3. Blog & Practical Guides Newsletter Section with Spiral Staircase */}
      <InsightsBlogNewsletterSection lang={lang} />

      {/* 4. Global Contact Section */}
      <HomeContactSection lang={lang} dict={dict} />
    </div>
  );
}
