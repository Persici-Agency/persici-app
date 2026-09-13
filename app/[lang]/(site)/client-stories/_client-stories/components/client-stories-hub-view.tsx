import React from 'react';
import type { ClientStoryDetail } from '../types';
import type { Dictionary } from '@dictionaries';
import { sectionContainer } from '@shared/constants';
import { ClientStoriesHeroSection } from './client-stories-hero-section';
import { ClientStoriesInfiniteGrid } from './client-stories-infinite-grid';
import { FeaturedClientStories } from '@shared/components/featured-client-stories';
import { FadeUp } from '@shared/components';
import { HomeContactSection } from '../../../_home/components/home-contact-section';

export interface ClientStoriesHubViewProps {
  stories: ClientStoryDetail[];
  lang: string;
  dict: Dictionary;
}

export function ClientStoriesHubView({ stories, lang, dict }: ClientStoriesHubViewProps) {
  const isRtl = lang === 'ar';

  // Extract featured stories for the sticky stacked cards section
  const featuredStoriesList = stories
    .filter((s) => s.featured)
    .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99))
    .map((s) => {
      const title = s.title[lang as 'en' | 'ar'] || s.title.en;
      const category = s.category[lang as 'en' | 'ar'] || s.category.en;
      const description = s.executiveSummary[lang as 'en' | 'ar'] || s.executiveSummary.en;

      return {
        id: s.id || s.slug,
        slug: s.slug,
        badge: category,
        category,
        title,
        description,
        summary: description,
        client: s.client,
        metrics: s.metrics.map((m) => ({
          value: m.value,
          label: m.label,
        })),
        image: s.heroImage,
        ctaText: isRtl ? 'استكشف قصة النجاح' : 'Explore Case Study',
        ctaHref: `/${lang}/client-stories/${s.slug}`,
      };
    });

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white">
      {/* 1. Hero Banner */}
      <ClientStoriesHeroSection lang={lang} />

      {/* 2. Featured Stories (Stacked Sticky Cards) */}
      {featuredStoriesList.length > 0 && (
        <FeaturedClientStories
          lang={lang}
          stories={featuredStoriesList}
          sectionBadge={isRtl ? 'أعمال استثنائية مختارة' : 'Featured Case Studies'}
          sectionTitle={isRtl ? 'قصص نجاح صنعت فارقاً حقيقياً' : 'Transforming Ambition into Impact'}
          sectionSubtitle={
            isRtl
              ? 'مشاريع رائدة قمنا بتنفيذها مع كبرى الشركات الإقليمية والعالمية لإعادة تعريف تجارب المستخدم وتحقيق عوائد استثنائية.'
              : 'Spotlighting milestone collaborations where bold engineering, bespoke design, and strategic vision delivered measurable business value.'
          }
          backgroundType="default"
        />
      )}

      {/* 3. Explore All Client Stories with Category Filter & Infinite Grid */}
      <section
        id="explore"
        data-header-luminance="light"
        className="w-full bg-white py-20 sm:py-28 border-t border-b border-slate-200/80 scroll-mt-20"
      >
        <div className={sectionContainer}>
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <FadeUp delay={0} duration={700} distance={16}>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-persici-crimson mb-2 block">
                {isRtl ? 'الدليل الكامل' : 'All Case Studies'}
              </span>
            </FadeUp>
            <FadeUp delay={120} duration={850} distance={24} blur={true}>
              <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                {isRtl ? 'استكشف جميع قصص النجاح' : 'Explore all client stories'}
              </h2>
            </FadeUp>
            <FadeUp delay={240} duration={750} distance={20}>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                {isRtl
                  ? 'تصفح محفظة مشاريعنا المتنوعة عبر البرمجيات المتقدمة، وهندسة العلامات التجارية، وحملات النمو الاستراتيجية.'
                  : 'Browse our complete catalog of enterprise engagements across advanced software platforms, iconic brand systems, and performance marketing.'}
              </p>
            </FadeUp>
          </div>

          {/* Filter Bar + 3-Column Infinite Grid */}
          <ClientStoriesInfiniteGrid initialStories={stories} lang={lang} />
        </div>
      </section>

      {/* 4. Global Contact Section */}
      <HomeContactSection lang={lang} dict={dict} />
    </div>
  );
}
