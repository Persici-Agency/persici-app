'use client';

import React from 'react';
import { TbCircleCheck } from 'react-icons/tb';

export interface SolutionsVerticalCardProps {
  number: string;
  tag: string;
  title: string;
  description: string;
  capabilities: string[];
  icon?: React.ElementType;
  iconStyle?: 'badge' | 'box';
  className?: string;
}

export function SolutionsVerticalCard({
  number,
  tag,
  title,
  description,
  capabilities,
  icon: Icon,
  iconStyle = 'badge',
  className = '',
}: SolutionsVerticalCardProps) {
  return (
    <div
      className={`group relative w-full h-full flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
    >
      <div>
        {/* Monospace Number & Tag Badge */}
        <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-black/[0.04]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs sm:text-sm font-bold text-slate-400 group-hover:text-persici-crimson transition-colors tracking-widest">
              {number}
            </span>
            {iconStyle === 'box' && (
              <span className="text-[11px] font-semibold text-persici-crimson uppercase tracking-wider">
                {tag}
              </span>
            )}
          </div>

          {iconStyle === 'box' && Icon ? (
            <div className="h-9 w-9 rounded-xl bg-persici-crimson/5 flex items-center justify-center text-persici-crimson transition-transform duration-300 group-hover:scale-110">
              <Icon className="h-5 w-5" />
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-persici-crimson bg-persici-crimson/5 px-2.5 py-0.5 rounded-full">
              {Icon && <Icon className="text-xs" />}
              {tag}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-primary text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-persici-crimson transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
          {description}
        </p>
      </div>

      {/* Capabilities Checklist */}
      {capabilities && capabilities.length > 0 && (
        <div className="border-t border-slate-100 pt-5 mt-auto">
          <ul className="space-y-2.5">
            {capabilities.map((cap, cIdx) => (
              <li
                key={cIdx}
                className="text-xs text-slate-600 flex items-start gap-2 leading-snug"
              >
                <TbCircleCheck className="text-persici-crimson shrink-0 text-sm mt-0.5" />
                <span>{cap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
