import React from 'react';
import type { ClientStoryDetail } from '../../../_client-stories/types';
import { ClientStoriesCard } from '../../../_client-stories/components/client-stories-card';
import { ClientStoryMinimalCard } from '../../../_client-stories/components/client-story-minimal-card';
import { sectionContainer } from '@shared/constants';

export interface StoryRelatedStoriesProps {
  relatedStories: ClientStoryDetail[];
  lang: string;
}

export function StoryRelatedStories({ relatedStories, lang }: StoryRelatedStoriesProps) {
  const isRtl = lang === 'ar';
  if (!relatedStories || relatedStories.length === 0) return null;

  return (
    <section
      data-header-luminance="light"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full bg-slate-50/60 py-16 sm:py-24 border-b border-slate-200/80"
    >
      <div className={sectionContainer}>
        {/* Heading */}
        <div className="max-w-2xl mb-10 sm:mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-persici-crimson mb-2 block">
            {isRtl ? 'مشاريع وأعمال مماثلة' : 'More Client Stories'}
          </span>
          <h2 className="font-primary text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isRtl ? 'قصص نجاح وشراكات أخرى ملهمة' : 'Related Client Stories'}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {isRtl
              ? 'اكتشف كيف ساهمت بيرسيكي في تمكين علامات رائدة أخرى في مختلف القطاعات'
              : 'Discover how Persici has powered growth and transformation across key industries'}
          </p>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {relatedStories.map((story, idx) => (
            <ClientStoryMinimalCard
              key={story.id || story.slug}
              story={story}
              lang={lang}
              index={idx}
              columns={3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
