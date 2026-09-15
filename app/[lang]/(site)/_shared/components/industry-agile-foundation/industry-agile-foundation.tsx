'use client';

import React, { useState } from 'react';
import { sectionContainer, sectionPaddingY } from '@shared/constants';
import { FadeUp } from '@shared';
import { cn } from '@shared/utils';
import type { IndustryAgileFoundation } from '@shared/types';

export interface IndustryAgileFoundationProps {
  foundation: IndustryAgileFoundation;
  lang: string;
  className?: string;
}

/**
 * Architectural Blueprint Section with Dynamic SVG Sketch & Brand Top Hover Lines
 * Modeled on Publicis Sapient's signature enterprise architecture showcase (media_1789282674510.png).
 * 
 * Interactivity:
 * - Idle / Inactive: All 3 feature labels in the sketch are muted (low opacity, low saturation / grayscale).
 * - Hover on Feature (or Sketch layer):
 *   - Sleek top line appears across the feature column with brand primary color (persici-crimson).
 *   - Corresponding layer in the sketch returns to 100% opacity, full brightness, and bold brand color.
 *   - Non-hovered layers remain dimmed.
 */
export function IndustryAgileFoundationSection({
  foundation,
  lang,
  className = '',
}: IndustryAgileFoundationProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const isRtl = lang === 'ar';

  const title = foundation.title[lang as 'en' | 'ar'] || foundation.title.en;
  const subtitle = foundation.subtitle[lang as 'en' | 'ar'] || foundation.subtitle.en;
  const diagramBadge = foundation.diagramBadge[lang as 'en' | 'ar'] || foundation.diagramBadge.en;

  const p0 = foundation.pillars[0];
  const p1 = foundation.pillars[1];
  const p2 = foundation.pillars[2];

  const getDiagramLabel = (pillar: typeof p0, defaultText: string) => {
    if (!pillar) return defaultText;
    if (pillar.diagramTitle) {
      return pillar.diagramTitle[lang as 'en' | 'ar'] || pillar.diagramTitle.en;
    }
    return pillar.title[lang as 'en' | 'ar'] || pillar.title.en;
  };

  const label0 = getDiagramLabel(p0, isRtl ? 'المنصة السيادية' : 'Sovereign Core');
  const label1 = getDiagramLabel(p1, isRtl ? 'البيانات والأتمتة' : 'Data & Automation');
  const label2 = getDiagramLabel(p2, isRtl ? 'الابتكار والتوسع' : 'Scale & Innovation');

  // Smart splitting helper to wrap diagram labels into 1-2 balanced lines to completely prevent arc overflow
  const splitDiagramLabel = (text: string): string[] => {
    if (!text) return [];
    const cleanText = isRtl ? text.trim() : text.trim().toUpperCase();
    const words = cleanText.split(/\s+/);

    if (cleanText.length <= 15 || words.length <= 1) {
      return [cleanText];
    }

    if (words.length === 2) {
      return [words[0], words[1]];
    }

    let bestSplit = 1;
    let minDiff = Infinity;
    for (let i = 1; i < words.length; i++) {
      const line1 = words.slice(0, i).join(' ');
      const line2 = words.slice(i).join(' ');
      const diff = Math.abs(line1.length - line2.length);
      if (diff < minDiff) {
        minDiff = diff;
        bestSplit = i;
      }
    }

    return [words.slice(0, bestSplit).join(' '), words.slice(bestSplit).join(' ')];
  };

  const lines0 = splitDiagramLabel(label0);
  const lines1 = splitDiagramLabel(label1);
  const lines2 = splitDiagramLabel(label2);

  const renderSvgText = (lines: string[], centerY: number, layerIdx: number) => {
    const isCurrentActive = activeIdx === layerIdx;
    const isAnyActive = activeIdx !== null;

    const fill = isCurrentActive
      ? '#D83427'
      : isAnyActive
      ? '#94A3B8'
      : '#64748B';

    const opacity = isCurrentActive
      ? 1
      : isAnyActive
      ? 0.22
      : 0.45;

    return (
      <text
        x="360"
        y={centerY}
        textAnchor="middle"
        fill={fill}
        fontSize={isRtl ? '12' : '11'}
        fontFamily="var(--font-cairo), monospace, sans-serif"
        fontWeight={isCurrentActive ? 'bold' : '600'}
        letterSpacing={isRtl ? 'normal' : '0.08em'}
        opacity={opacity}
        className="transition-all duration-300 pointer-events-none select-none"
        style={{
          paintOrder: 'stroke fill',
          stroke: '#FFFFFF',
          strokeWidth: '4px',
          strokeLinejoin: 'round',
        }}
      >
        {lines.length === 1 ? (
          <tspan x="360" dy="0.35em">
            {lines[0]}
          </tspan>
        ) : (
          <>
            <tspan x="360" dy="-0.6em">
              {lines[0]}
            </tspan>
            <tspan x="360" dy="1.35em">
              {lines[1]}
            </tspan>
          </>
        )}
      </text>
    );
  };

  return (
    <section className={`${sectionPaddingY} bg-[#F9F8F6] relative border-b border-black/[0.04] ${className}`}>
      <div className={sectionContainer}>
        {/* Section Header */}
        <FadeUp delay={0} duration={700} distance={20} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-persici-crimson/10 text-persici-crimson text-xs font-semibold uppercase tracking-wider mb-4">
            {isRtl ? 'الأساس المعماري الرشيق' : 'Architectural Blueprint'}
          </div>
          <h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-slate-900 leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {subtitle}
          </p>
        </FadeUp>

        {/* Architectural Blueprint Diagram Card */}
        <FadeUp delay={100} duration={750} distance={24} className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-white border border-black/5 p-8 sm:p-12 lg:p-14 shadow-xs">
            {/* SVG Transformation Arc / Architectural Matrix */}
            <div className="relative flex flex-col items-center justify-center py-4 sm:py-6 overflow-hidden">
              <span className="text-[9.5px] font-mono font-semibold uppercase tracking-widest text-slate-400 bg-slate-100 px-3.5 py-1 rounded-full mb-6 select-none">
                {diagramBadge}
              </span>

              {/* Vector Concentric Arcs Blueprint (Enlarged with generous clearances & zero text interception) */}
              <div className="w-full max-w-2xl sm:max-w-3xl h-64 sm:h-76 md:h-84 relative flex items-center justify-center">
                <svg
                  viewBox="0 0 720 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full select-none"
                >
                  {/* Layer 2: Outer Arc & Label (Corresponds to Feature 03, Radius 265) */}
                  <g
                    className="cursor-pointer group/layer2 transition-all duration-300"
                    onMouseEnter={() => setActiveIdx(2)}
                    onMouseLeave={() => setActiveIdx(null)}
                    onClick={() => setActiveIdx(activeIdx === 2 ? null : 2)}
                  >
                    {/* Generous transparent hit area */}
                    <path
                      d="M 95 300 A 265 265 0 0 1 625 300"
                      stroke="transparent"
                      strokeWidth="28"
                      fill="none"
                    />

                    {/* Outer Arc */}
                    <path
                      d="M 95 300 A 265 265 0 0 1 625 300"
                      stroke={activeIdx === 2 ? '#D83427' : activeIdx === null ? '#E2E8F0' : '#E2E8F0'}
                      strokeWidth={activeIdx === 2 ? '2' : '1.5'}
                      strokeDasharray={activeIdx === 2 ? 'none' : '4 4'}
                      opacity={activeIdx === 2 ? 1 : activeIdx === null ? 0.6 : 0.25}
                      className="transition-all duration-300"
                    />

                    {/* Outer Nodes */}
                    <circle
                      cx="95"
                      cy="300"
                      r={activeIdx === 2 ? '7' : '5.5'}
                      fill={activeIdx === 2 ? '#D83427' : activeIdx === null ? '#121212' : '#94A3B8'}
                      opacity={activeIdx === 2 ? 1 : activeIdx === null ? 0.7 : 0.25}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx="625"
                      cy="300"
                      r={activeIdx === 2 ? '7' : '5.5'}
                      fill={activeIdx === 2 ? '#D83427' : activeIdx === null ? '#121212' : '#94A3B8'}
                      opacity={activeIdx === 2 ? 1 : activeIdx === null ? 0.7 : 0.25}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx="360"
                      cy="35"
                      r={activeIdx === 2 ? '7' : '5.5'}
                      fill={activeIdx === 2 ? '#D83427' : activeIdx === null ? '#121212' : '#94A3B8'}
                      opacity={activeIdx === 2 ? 1 : activeIdx === null ? 0.7 : 0.25}
                      className="transition-all duration-300"
                    />

                    {/* Outer Feature Label (Centered at y=70, cleanly between r=265 and r=195) */}
                    {renderSvgText(lines2, 70, 2)}
                  </g>

                  {/* Layer 1: Middle Arc & Label (Corresponds to Feature 02, Radius 195) */}
                  <g
                    className="cursor-pointer group/layer1 transition-all duration-300"
                    onMouseEnter={() => setActiveIdx(1)}
                    onMouseLeave={() => setActiveIdx(null)}
                    onClick={() => setActiveIdx(activeIdx === 1 ? null : 1)}
                  >
                    {/* Generous transparent hit area */}
                    <path
                      d="M 165 300 A 195 195 0 0 1 555 300"
                      stroke="transparent"
                      strokeWidth="28"
                      fill="none"
                    />

                    {/* Middle Arc */}
                    <path
                      d="M 165 300 A 195 195 0 0 1 555 300"
                      stroke={activeIdx === 1 ? '#D83427' : activeIdx === null ? '#CBD5E1' : '#CBD5E1'}
                      strokeWidth={activeIdx === 1 ? '2.5' : '2'}
                      opacity={activeIdx === 1 ? 1 : activeIdx === null ? 0.65 : 0.25}
                      className="transition-all duration-300"
                    />

                    {/* Middle Nodes */}
                    <circle
                      cx="165"
                      cy="300"
                      r={activeIdx === 1 ? '7' : '5.5'}
                      fill={activeIdx === 1 ? '#D83427' : activeIdx === null ? '#121212' : '#94A3B8'}
                      opacity={activeIdx === 1 ? 1 : activeIdx === null ? 0.7 : 0.25}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx="555"
                      cy="300"
                      r={activeIdx === 1 ? '7' : '5.5'}
                      fill={activeIdx === 1 ? '#D83427' : activeIdx === null ? '#121212' : '#94A3B8'}
                      opacity={activeIdx === 1 ? 1 : activeIdx === null ? 0.7 : 0.25}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx="360"
                      cy="105"
                      r={activeIdx === 1 ? '8' : '6.5'}
                      fill={activeIdx === 1 ? '#D83427' : activeIdx === null ? '#121212' : '#94A3B8'}
                      opacity={activeIdx === 1 ? 1 : activeIdx === null ? 0.75 : 0.25}
                      className="transition-all duration-300"
                    />

                    {/* Middle Feature Label (Centered at y=140, cleanly between r=195 and r=125) */}
                    {renderSvgText(lines1, 140, 1)}
                  </g>

                  {/* Layer 0: Inner Arc & Label (Corresponds to Feature 01, Radius 125) */}
                  <g
                    className="cursor-pointer group/layer0 transition-all duration-300"
                    onMouseEnter={() => setActiveIdx(0)}
                    onMouseLeave={() => setActiveIdx(null)}
                    onClick={() => setActiveIdx(activeIdx === 0 ? null : 0)}
                  >
                    {/* Generous transparent hit area */}
                    <path
                      d="M 235 300 A 125 125 0 0 1 485 300"
                      stroke="transparent"
                      strokeWidth="28"
                      fill="none"
                    />

                    {/* Inner Arc */}
                    <path
                      d="M 235 300 A 125 125 0 0 1 485 300"
                      stroke={activeIdx === 0 ? '#D83427' : activeIdx === null ? '#CBD5E1' : '#CBD5E1'}
                      strokeWidth={activeIdx === 0 ? '2.5' : '2'}
                      opacity={activeIdx === 0 ? 1 : activeIdx === null ? 0.65 : 0.25}
                      className="transition-all duration-300"
                    />

                    {/* Inner Nodes */}
                    <circle
                      cx="235"
                      cy="300"
                      r={activeIdx === 0 ? '7.5' : '6'}
                      fill={activeIdx === 0 ? '#D83427' : activeIdx === null ? '#D83427' : '#94A3B8'}
                      opacity={activeIdx === 0 ? 1 : activeIdx === null ? 0.75 : 0.25}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx="485"
                      cy="300"
                      r={activeIdx === 0 ? '7.5' : '6'}
                      fill={activeIdx === 0 ? '#D83427' : activeIdx === null ? '#D83427' : '#94A3B8'}
                      opacity={activeIdx === 0 ? 1 : activeIdx === null ? 0.75 : 0.25}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx="360"
                      cy="175"
                      r={activeIdx === 0 ? '8.5' : '7'}
                      fill={activeIdx === 0 ? '#D83427' : activeIdx === null ? '#D83427' : '#94A3B8'}
                      opacity={activeIdx === 0 ? 1 : activeIdx === null ? 0.75 : 0.25}
                      className="transition-all duration-300"
                    />

                    {/* Inner Feature Label (Centered at y=220, with 38px clearance above and below) */}
                    {renderSvgText(lines0, 220, 0)}
                  </g>

                  {/* Core Hub at Baseline (cx=360, cy=300) */}
                  <g
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setActiveIdx(0)}
                    onMouseLeave={() => setActiveIdx(null)}
                  >
                    <circle
                      cx="360"
                      cy="300"
                      r="34"
                      fill={activeIdx === 0 ? '#FEF2F2' : '#F8FAFC'}
                      stroke={activeIdx === 0 ? '#D83427' : '#E2E8F0'}
                      strokeWidth="1.5"
                      opacity={activeIdx === 0 ? 1 : activeIdx === null ? 0.7 : 0.3}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx="360"
                      cy="300"
                      r="13"
                      fill={activeIdx === 0 ? '#D83427' : activeIdx === null ? '#D83427' : '#94A3B8'}
                      opacity={activeIdx === 0 ? 1 : activeIdx === null ? 0.8 : 0.3}
                      className="transition-all duration-300"
                    />
                  </g>
                </svg>
              </div>
            </div>

            {/* 3 Core Pillars Underneath the Blueprint */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-8 sm:pt-10 border-t border-black/[0.06] mt-6">
              {foundation.pillars.map((pillar, pIdx) => {
                const pTitle = pillar.title[lang as 'en' | 'ar'] || pillar.title.en;
                const pDesc = pillar.description[lang as 'en' | 'ar'] || pillar.description.en;
                const isCurrentActive = activeIdx === pIdx;

                return (
                  <div
                    key={pIdx}
                    className={cn(
                      'relative flex flex-col pt-4 sm:pt-4 cursor-pointer group transition-all duration-300 select-none',
                      pIdx > 0 ? 'border-t border-black/[0.04] md:border-t-0 pt-6 md:pt-4' : ''
                    )}
                    onMouseEnter={() => setActiveIdx(pIdx)}
                    onMouseLeave={() => setActiveIdx(null)}
                    onClick={() => setActiveIdx(activeIdx === pIdx ? null : pIdx)}
                  >
                    {/* Top brand primary color hover indicator line */}
                    <div
                      className={cn(
                        'absolute left-0 right-0 h-[3px] bg-persici-crimson rounded-full transition-all duration-300 ease-out',
                        'top-0 md:-top-8 lg:-top-10',
                        isRtl ? 'origin-right' : 'origin-left',
                        isCurrentActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                      )}
                    />

                    <span
                      className={cn(
                        'font-mono text-sm font-semibold mb-3 tracking-wider transition-colors duration-300',
                        isCurrentActive ? 'text-persici-crimson' : 'text-persici-crimson/80'
                      )}
                    >
                      {pillar.number}
                    </span>

                    <h3
                      className={cn(
                        'font-primary text-lg sm:text-xl font-medium mb-2 leading-snug transition-colors duration-300',
                        isCurrentActive ? 'text-slate-950' : 'text-slate-900'
                      )}
                    >
                      {pTitle}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {pDesc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

