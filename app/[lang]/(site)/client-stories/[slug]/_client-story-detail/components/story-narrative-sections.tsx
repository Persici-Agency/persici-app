import React from 'react';
import type {
  ClientStoryDetail,
  StoryNarrativeSection,
  StorySectionImage,
} from '../../../_client-stories/types';
import { TbCheck, TbQuote } from 'react-icons/tb';
import { CodeShowcaseBlock } from '@/app/[lang]/_shared/components/code-showcase-block';

function resolveSectionImageWidthPercent(image: StorySectionImage): number {
  if (typeof image.widthPercent === 'number' && !Number.isNaN(image.widthPercent)) {
    return Math.min(100, Math.max(30, image.widthPercent));
  }
  switch (image.size) {
    case 'sm':
      return 50;
    case 'md':
      return 70;
    case 'lg':
      return 85;
    case 'full':
    default:
      return 100;
  }
}

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

        {/* Optional Section Main Image (After Title, Before Paragraphs) */}
        {section.image?.src && (
          <figure
            className="mx-auto max-w-full mb-8 space-y-2.5"
            style={{ width: `${resolveSectionImageWidthPercent(section.image)}%` }}
          >
            <div className="rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-50 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={section.image.src}
                alt={
                  section.image.alt?.[lang as 'en' | 'ar'] ||
                  section.image.alt?.en ||
                  title
                }
                loading="lazy"
                style={{
                  maxHeight:
                    section.image.maxHeight && section.image.maxHeight > 0
                      ? `${section.image.maxHeight}px`
                      : undefined,
                }}
                className={`w-full h-auto block ${
                  section.image.objectFit === 'cover'
                    ? 'object-cover'
                    : 'object-contain'
                }`}
              />
            </div>
            {(section.image.caption?.en || section.image.caption?.ar) && (
              <figcaption className="text-center text-xs sm:text-sm text-slate-500 font-medium">
                {section.image.caption[lang as 'en' | 'ar'] ||
                  section.image.caption.en}
              </figcaption>
            )}
          </figure>
        )}

        {/* Paragraphs */}
        <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
          {section.paragraphs.map((p, idx) => {
            const pText = p[lang as 'en' | 'ar'] || p.en || '';
            if (pText.includes('<') && pText.includes('>')) {
              return (
                <div
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: pText }}
                />
              );
            }
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

        {/* Code Samples if present (After Key Highlights) */}
        {section.codeBlocks && section.codeBlocks.length > 0 && (
          <div className="mt-8 space-y-6">
            {section.codeBlocks.map((block, cIdx) => {
              if (!block.code) return null;
              const codeTitle =
                block.title?.[lang as 'en' | 'ar'] || block.title?.en || '';
              return (
                <CodeShowcaseBlock
                  key={block.id || cIdx}
                  title={codeTitle}
                  language={block.language}
                  code={block.code}
                />
              );
            })}
          </div>
        )}

        {/* Pull Quote if present */}
        {section.quote && (section.quote.text?.en || section.quote.text?.ar) && (
          <blockquote className="mt-8 rounded-2xl border-s-4 border-persici-crimson bg-slate-50/80 p-6 sm:p-8 shadow-xs">
            <TbQuote className="h-8 w-8 text-persici-crimson/30 mb-2" />
            {(() => {
              const qText = section.quote.text[lang as 'en' | 'ar'] || section.quote.text.en || '';
              if (qText.includes('<') && qText.includes('>')) {
                return (
                  <div
                    className="font-primary text-lg sm:text-xl font-medium italic text-slate-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: qText }}
                  />
                );
              }
              return (
                <p className="font-primary text-lg sm:text-xl font-medium italic text-slate-800 leading-relaxed">
                  &ldquo;{qText}&rdquo;
                </p>
              );
            })()}
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
