'use client';

import React from 'react';
import Image from 'next/image';
import { SolutionsVectorDiagram } from '@/app/[lang]/(site)/solutions/_solutions/components/solutions-vector-diagram';
import type { SolutionDiagramType } from '@shared/types';

export interface CapabilityCardProps {
  title: string;
  tag: string;
  description: string;
  icon?: string;
  diagramType?: SolutionDiagramType;
  highlights?: string[];
  highlightsVariant?: 'bullets' | 'pills';
  isPaused?: boolean;
  className?: string;
}

export function CapabilityCard({
  title,
  tag,
  description,
  icon,
  diagramType,
  highlights,
  highlightsVariant = 'bullets',
  isPaused = false,
  className = '',
}: CapabilityCardProps) {
  const isImageIcon =
    icon && (icon.startsWith('/') || icon.startsWith('http'));

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-[#F8F7F4] border border-black/[0.04] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-black/[0.08] w-full ${className}`}
    >
      {/* Top: Tag + Dedicated SVG/Image Icon */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-bold tracking-wider uppercase text-persici-crimson bg-persici-crimson/5 px-2.5 py-1 rounded-md">
            {tag}
          </span>
          {icon && (
            <div className="h-7 w-7 shrink-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
              {isImageIcon ? (
                <Image
                  src={icon}
                  alt={title}
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                  unoptimized={icon.endsWith('.svg')}
                />
              ) : (
                <span className="text-base" aria-hidden="true">
                  {icon}
                </span>
              )}
            </div>
          )}
        </div>

        <h3 className="font-primary text-lg sm:text-xl font-bold text-slate-900 transition-colors group-hover:text-persici-crimson leading-snug">
          {title}
        </h3>
      </div>

      {/* Center: Animated Vector Diagram (optional) */}
      {diagramType && (
        <div className="my-6 flex items-center justify-center py-3 bg-white/70 rounded-xl border border-black/[0.03] group-hover:bg-white transition-colors">
          <div className="transition-transform duration-300 group-hover:scale-110">
            <SolutionsVectorDiagram
              type={diagramType}
              isPaused={isPaused}
              className="h-16 w-16 drop-shadow-xs"
            />
          </div>
        </div>
      )}

      {/* Bottom: Description + Capability Highlights */}
      <div>
        <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 mb-5 font-normal">
          {description}
        </p>

        {highlights && highlights.length > 0 && (
          <div className="pt-4 border-t border-black/[0.05]">
            {highlightsVariant === 'pills' ? (
              <div className="flex flex-wrap gap-1.5">
                {highlights.map((h, hIdx) => (
                  <span
                    key={hIdx}
                    className="text-[11px] font-medium text-slate-600 bg-white/90 border border-black/[0.04] px-2 py-0.5 rounded-md"
                  >
                    {h}
                  </span>
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {highlights.map((bullet, bIdx) => (
                  <li
                    key={bIdx}
                    className="text-xs text-slate-600 flex items-start gap-2 leading-tight"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-persici-crimson shrink-0 mt-1" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
