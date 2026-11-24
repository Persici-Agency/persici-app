import React from 'react';
import {
  DEFAULT_CLIENT_STORY_DETAIL_SPACING,
  type ClientStoryDetail,
  type ClientStoryDetailSpacingConfig,
} from '../../../_client-stories/types';
import type { Dictionary } from '@dictionaries';
import { sectionContainer } from '@shared/constants';
import { StoryDetailHeroSection } from './story-detail-hero-section';
import { StorySummaryStatsSection } from './story-summary-stats-section';
import { StoryMetadataStrip } from './story-metadata-strip';
import { StoryStickyRailNav } from './story-sticky-rail-nav';
import { StoryNarrativeSections } from './story-narrative-sections';
import { StoryMediaShowcase } from './story-media-showcase';
import { StoryRelatedStories } from './story-related-stories';
import { HomeContactSection } from '../../../../_home/components/home-contact-section';

export interface ClientStoryDetailViewProps {
  story: ClientStoryDetail;
  relatedStories: ClientStoryDetail[];
  lang: string;
  dict: Dictionary;
  spacingConfig?: ClientStoryDetailSpacingConfig;
}

export function ClientStoryDetailView({
  story,
  relatedStories,
  lang,
  dict,
  spacingConfig = DEFAULT_CLIENT_STORY_DETAIL_SPACING,
}: ClientStoryDetailViewProps) {
  const isRtl = lang === 'ar';

  return (
    <article dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white text-slate-900">
      {/* 1. Hero Header */}
      <StoryDetailHeroSection story={story} lang={lang} />

      {/* 2. Executive Summary & Split CountUp Stats */}
      <StorySummaryStatsSection
        story={story}
        lang={lang}
        spacingConfig={spacingConfig}
      />

      {/* 3. Metadata Strip (Partner [optional], Client, Topic, Services, Region) */}
      <StoryMetadataStrip story={story} lang={lang} />

      {/* 4. Main Body with Sticky Left Rail */}
      <div
        style={{
          paddingTop: `clamp(2rem, 5vw, ${spacingConfig.bodyContainerPaddingY}px)`,
          paddingBottom: `clamp(2rem, 5vw, ${spacingConfig.bodyContainerPaddingY}px)`,
        }}
        className={`w-full ${sectionContainer}`}
      >
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Sticky Left Rail Navigation */}
          <StoryStickyRailNav lang={lang} />

          {/* Core Content: Narratives + Adaptive Media Showcase */}
          <div className="flex-1 min-w-0 w-full">
            <StoryNarrativeSections
              story={story}
              lang={lang}
              spacingConfig={spacingConfig}
            />
            <StoryMediaShowcase
              story={story}
              lang={lang}
              spacingConfig={spacingConfig}
            />
          </div>
        </div>
      </div>

      {/* 5. Related Client Stories */}
      {relatedStories && relatedStories.length > 0 && (
        <StoryRelatedStories relatedStories={relatedStories} lang={lang} />
      )}

      {/* 6. Global Contact Section */}
      <HomeContactSection lang={lang} dict={dict} />
    </article>
  );
}
