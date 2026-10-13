import React from 'react';
import type { ClientStoryDetail, ClientStoriesHubPageData } from '../types';
import type { Dictionary } from '@dictionaries';
import { sectionContainer } from '@shared/constants';
import { ClientStoriesHeroSection } from './client-stories-hero-section';
import { ClientStoriesInfiniteGrid } from './client-stories-infinite-grid';
import { FeaturedClientStories } from '@shared/components/featured-client-stories';
import { FadeUp } from '@shared/components';
import { HomeContactSection } from '../../../_home/components/home-contact-section';
import { clientStoriesHubPageData } from '../data/client-stories.data';

export interface ClientStoriesHubViewProps {
  stories: ClientStoryDetail[];
  pageContent?: ClientStoriesHubPageData;
  lang: string;
  dict: Dictionary;
}

export function ClientStoriesHubView({
  stories,
  pageContent,
  lang,
  dict,
}: ClientStoriesHubViewProps) {
  const isRtl = lang === 'ar';
  const hub = pageContent || clientStoriesHubPageData;

  const featuredCtaText = isRtl
    ? hub.featuredSection?.ctaLabel?.ar || 'استكشف قصة النجاح'
    : hub.featuredSection?.ctaLabel?.en || 'Explore Case Study';

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
        ctaText: featuredCtaText,
        ctaHref: `/${lang}/client-stories/${s.slug}`,
      };
    });

  const allBadge = isRtl
    ? hub.allStoriesSection?.badge?.ar || 'الدليل الكامل'
    : hub.allStoriesSection?.badge?.en || 'All Case Studies';
  const allTitle = isRtl
    ? hub.allStoriesSection?.title?.ar || 'استكشف جميع قصص النجاح'
    : hub.allStoriesSection?.title?.en || 'Explore all client stories';
  const allSubtitle = isRtl
    ? hub.allStoriesSection?.subtitle?.ar ||
      'تصفح محفظة مشاريعنا المتنوعة عبر البرمجيات المتقدمة، وهندسة العلامات التجارية، وحملات النمو الاستراتيجية.'
    : hub.allStoriesSection?.subtitle?.en ||
      'Browse our complete catalog of enterprise engagements across advanced software platforms, iconic brand systems, and performance marketing.';
  const isAllSubtitleHtml = allSubtitle.includes('<') && allSubtitle.includes('>');

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white">
      {/* 1. Hero Banner */}
      <ClientStoriesHeroSection lang={lang} hero={hub.hero} />

      {/* 2. Featured Stories (Stacked Sticky Cards) */}
      {featuredStoriesList.length > 0 && (
        <FeaturedClientStories
          lang={lang}
          stories={featuredStoriesList}
          sectionBadge={
            hub.featuredSection?.badge || {
              en: 'Featured Case Studies',
              ar: 'أعمال استثنائية مختارة',
            }
          }
          sectionTitle={
            hub.featuredSection?.title || {
              en: 'Transforming Ambition into Impact',
              ar: 'قصص نجاح صنعت فارقاً حقيقياً',
            }
          }
          sectionSubtitle={
            hub.featuredSection?.subtitle || {
              en: 'Spotlighting milestone collaborations where bold engineering, bespoke design, and strategic vision delivered measurable business value.',
              ar: 'مشاريع رائدة قمنا بتنفيذها مع كبرى الشركات الإقليمية والعالمية لإعادة تعريف تجارب المستخدم وتحقيق عوائد استثنائية.',
            }
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
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-2 block">
                {allBadge}
              </span>
            </FadeUp>
            <FadeUp delay={120} duration={850} distance={24} blur={true}>
              <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight">
                {allTitle}
              </h2>
            </FadeUp>
            <FadeUp delay={240} duration={750} distance={20}>
              {isAllSubtitleHtml ? (
                <div
                  className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: allSubtitle }}
                />
              ) : (
                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  {allSubtitle}
                </p>
              )}
            </FadeUp>
          </div>

          {/* Filter Bar + 3-Column Infinite Grid */}
          <ClientStoriesInfiniteGrid
            initialStories={stories}
            lang={lang}
            categories={hub.allStoriesSection?.categories}
            emptyTitle={hub.allStoriesSection?.emptyTitle}
            emptySubtitle={hub.allStoriesSection?.emptySubtitle}
          />
        </div>
      </section>

      {/* 4. Global Contact Section */}
      <HomeContactSection lang={lang} dict={dict} />
    </div>
  );
}

