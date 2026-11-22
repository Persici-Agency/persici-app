'use client';

import React from 'react';

import type { TechStackItem } from '@shared/types';

export interface TechInfrastructureCardProps {
  badge: string;
  title: string;
  description: string;
  technologies: TechStackItem[];
  icon?: React.ElementType;
  variant?: 'pills' | 'grid';
  headerLayout?: 'stacked' | 'split';
  className?: string;
}

export function TechInfrastructureCard({
  badge,
  title,
  description,
  technologies,
  icon: Icon,
  variant = 'pills',
  headerLayout = 'stacked',
  className = '',
}: TechInfrastructureCardProps) {
  return (
    <div
      className={`group relative w-full h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 hover:border-persici-crimson/35 p-6 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 ${className}`}
    >
      <div>
        {/* Header */}
        {headerLayout === 'split' ? (
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="font-primary text-xl sm:text-2xl font-medium text-slate-900">
              {title}
            </h3>
            <span className="text-[9.5px] font-mono font-medium text-persici-crimson bg-persici-crimson/10 border border-persici-crimson/20 px-2.5 py-0.5 rounded-full shrink-0">
              {badge}
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 mb-4">
              {Icon ? (
                <div className="h-11 w-11 rounded-xl bg-persici-crimson/10 text-persici-crimson border border-persici-crimson/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
              ) : (
                <span className="text-[9.5px] font-mono font-medium text-persici-crimson bg-persici-crimson/10 border border-persici-crimson/20 px-2.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
              {Icon && (
                <span className="text-[9.5px] font-mono font-medium text-persici-crimson bg-persici-crimson/10 border border-persici-crimson/20 px-2.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>

            <h3 className="font-primary text-xl sm:text-2xl font-medium text-slate-900 mb-3">
              {title}
            </h3>
          </>
        )}

        {/* Description */}
        {/<[a-z][\s\S]*>/i.test(description || '') ? (
          <div
            className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6 [&_p]:mb-1.5 [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
            {description}
          </p>
        )}
      </div>

      {/* Technologies Section */}
      {variant === 'grid' ? (
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 mt-auto">
          {technologies.map((tech, tIdx) => (
            <div
              key={tIdx}
              className="flex flex-col p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-white hover:border-persici-crimson/30 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {tech.name}
                </span>
                {tech.badge && (
                  <span className="text-[9.5px] font-mono text-persici-crimson bg-persici-crimson/10 px-1.5 py-0.5 rounded">
                    {tech.badge}
                  </span>
                )}
              </div>
              {tech.category && (
                <span className="text-[9.5px] text-slate-500 mt-1">
                  {tech.category}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="pt-5 border-t border-slate-100 mt-auto">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, tIdx) => (
              <span
                key={tIdx}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200/80 hover:bg-persici-crimson/5 hover:border-persici-crimson/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-persici-crimson shrink-0" />
                <span>{tech.name}</span>
                {tech.badge && (
                  <span className="text-[9.5px] font-mono text-persici-crimson bg-persici-crimson/10 px-1.5 py-0.5 rounded">
                    {tech.badge}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Aliases for alternate naming conventions
export const TechStackCard = TechInfrastructureCard;
export type TechStackCardProps = TechInfrastructureCardProps;
