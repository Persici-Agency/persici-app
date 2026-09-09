'use client';

import React from 'react';

export interface TechStackItem {
  name: string;
  badge?: string;
  category?: string;
}

export interface SolutionsTechStackCardProps {
  badge: string;
  title: string;
  description: string;
  technologies: TechStackItem[];
  icon?: React.ElementType;
  variant?: 'pills' | 'grid';
  headerLayout?: 'stacked' | 'split';
  className?: string;
}

export function SolutionsTechStackCard({
  badge,
  title,
  description,
  technologies,
  icon: Icon,
  variant = 'pills',
  headerLayout = 'stacked',
  className = '',
}: SolutionsTechStackCardProps) {
  return (
    <div
      className={`group relative w-full h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/25 hover:bg-white/[0.05] p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 ${className}`}
    >
      <div>
        {/* Header */}
        {headerLayout === 'split' ? (
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="font-primary text-xl sm:text-2xl font-bold text-white">
              {title}
            </h3>
            <span className="text-[11px] font-mono font-medium text-persici-crimson bg-persici-crimson/10 border border-persici-crimson/20 px-2.5 py-0.5 rounded-full shrink-0">
              {badge}
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 mb-4">
              {Icon ? (
                <div className="h-11 w-11 rounded-xl bg-persici-crimson/15 text-persici-crimson flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
              ) : (
                <span className="text-[11px] font-mono font-medium text-persici-crimson bg-persici-crimson/10 border border-persici-crimson/20 px-2.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
              {Icon && (
                <span className="text-[11px] font-mono font-medium text-persici-crimson bg-persici-crimson/10 border border-persici-crimson/20 px-2.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>

            <h3 className="font-primary text-xl sm:text-2xl font-bold text-white mb-3">
              {title}
            </h3>
          </>
        )}

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-6">
          {description}
        </p>
      </div>

      {/* Technologies Section */}
      {variant === 'grid' ? (
        <div className="pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-3 mt-auto">
          {technologies.map((tech, tIdx) => (
            <div
              key={tIdx}
              className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-white">
                  {tech.name}
                </span>
                {tech.badge && (
                  <span className="text-[10px] font-mono text-slate-400 bg-white/[0.06] px-1.5 py-0.5 rounded">
                    {tech.badge}
                  </span>
                )}
              </div>
              {tech.category && (
                <span className="text-[11px] text-slate-500 mt-1">
                  {tech.category}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="pt-5 border-t border-white/10 mt-auto">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, tIdx) => (
              <span
                key={tIdx}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-persici-crimson shrink-0" />
                <span>{tech.name}</span>
                {tech.badge && (
                  <span className="text-[10px] font-mono text-persici-crimson/90 bg-persici-crimson/15 px-1.5 py-0.5 rounded">
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
