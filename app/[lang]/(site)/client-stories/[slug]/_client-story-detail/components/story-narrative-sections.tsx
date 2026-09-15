import React from 'react';
import type { ClientStoryDetail, StoryNarrativeSection } from '../../../_client-stories/types';
import { TbCheck, TbQuote } from 'react-icons/tb';

export interface StoryNarrativeSectionsProps {
  story: ClientStoryDetail;
  lang: string;
}

export function StoryNarrativeSections({ story, lang }: StoryNarrativeSectionsProps) {
  const isRtl = lang === 'ar';

  const renderSection = (section: StoryNarrativeSection, sectionId: string) => {
    if (!section) return null;
    const title = section.title[lang as 'en' | 'ar'] || section.title.en;

    return (
      <section
        key={sectionId}
        id={sectionId}
        className="scroll-mt-32 pt-8 sm:pt-10 border-b border-slate-100 pb-12 sm:pb-16 first:pt-0"
      >
        {/* Section Title */}
        <h2 className="font-primary text-2xl sm:text-3xl lg:text-4xl font-medium text-slate-900 tracking-tight mb-6">
          {title}
        </h2>

        {/* Paragraphs */}
        <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
          {section.paragraphs.map((p, idx) => {
            const pText = p[lang as 'en' | 'ar'] || p.en;
            return <p key={idx}>{pText}</p>;
          })}
        </div>

        {/* Bullets if present */}
        {section.bullets && section.bullets.length > 0 && (
          <ul className="mt-6 space-y-3">
            {section.bullets.map((bullet, idx) => {
              const bText = bullet[lang as 'en' | 'ar'] || bullet.en;
              return (
                <li key={idx} className="flex items-start gap-3 text-base text-slate-700">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-persici-crimson/10 text-persici-crimson">
                    <TbCheck className="h-3.5 w-3.5" />
                  </span>
                  <span>{bText}</span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Pull Quote if present */}
        {section.quote && (
          <blockquote className="mt-8 rounded-2xl border-s-4 border-persici-crimson bg-slate-50/80 p-6 sm:p-8 shadow-xs">
            <TbQuote className="h-8 w-8 text-persici-crimson/30 mb-2" />
            <p className="font-primary text-lg sm:text-xl font-medium italic text-slate-800 leading-relaxed">
              &ldquo;{section.quote.text[lang as 'en' | 'ar'] || section.quote.text.en}&rdquo;
            </p>
            <footer className="mt-4 flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900">{section.quote.author}</span>
              {section.quote.role && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-500">
                    {section.quote.role[lang as 'en' | 'ar'] || section.quote.role.en}
                  </span>
                </>
              )}
            </footer>
          </blockquote>
        )}
      </section>
    );
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="flex-1 min-w-0">
      {renderSection(story.intro, 'intro')}
      {renderSection(story.problem, 'the-problem')}
      {renderSection(story.solution, 'the-solution')}
      {renderSection(story.impact, 'the-impact')}
    </div>
  );
}
