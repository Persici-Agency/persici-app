import React from 'react';
import type { SolutionDiagramType } from '@shared/types';

interface SolutionsVectorDiagramProps {
  type: SolutionDiagramType;
  className?: string;
  isPaused?: boolean;
}

export function SolutionsVectorDiagram({
  type,
  className = 'w-16 h-16',
  isPaused = false,
}: SolutionsVectorDiagramProps) {
  const playState: React.CSSProperties = {
    animationPlayState: isPaused ? 'paused' : 'running',
  };

  const sharedStyle = (
    <style>{`
      @keyframes persici-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes persici-spin-rev {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      @keyframes persici-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.35; transform: scale(0.85); }
      }
      @keyframes persici-dash {
        to { stroke-dashoffset: -32; }
      }
      @keyframes persici-ping {
        0% { r: 3; opacity: 0.8; }
        80%, 100% { r: 12; opacity: 0; }
      }
      .anim-spin { animation: persici-spin 14s linear infinite; transform-origin: 40px 40px; }
      .anim-spin-fast { animation: persici-spin 6s linear infinite; transform-origin: 40px 40px; }
      .anim-spin-rev { animation: persici-spin-rev 10s linear infinite; transform-origin: 40px 40px; }
      .anim-pulse-1 { animation: persici-pulse 2s ease-in-out infinite; transform-origin: center; }
      .anim-pulse-2 { animation: persici-pulse 2s ease-in-out infinite 0.6s; transform-origin: center; }
      .anim-pulse-3 { animation: persici-pulse 2s ease-in-out infinite 1.2s; transform-origin: center; }
      .anim-dash-flow { stroke-dasharray: 6 3; animation: persici-dash 3s linear infinite; }
      .anim-radar-ping { animation: persici-ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
    `}</style>
  );

  switch (type) {
    case 'grid-dots':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {sharedStyle}
          {/* 4x4 Matrix with pulsing active nodes */}
          <circle cx="16" cy="16" r="3.5" className="fill-slate-300" />
          <circle cx="32" cy="16" r="3.5" className="fill-slate-300" />
          <circle cx="48" cy="16" r="3.5" className="fill-slate-300" />
          <circle cx="64" cy="16" r="3.5" className="fill-slate-300" />

          <circle cx="16" cy="32" r="3.5" className="fill-slate-300" />
          <circle cx="32" cy="32" r="3.5" className="fill-slate-300" />
          <circle cx="48" cy="32" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="64" cy="32" r="3.5" className="fill-slate-300" />

          <circle cx="16" cy="48" r="3.5" className="fill-slate-300" />
          <circle cx="32" cy="48" r="3.5" className="fill-persici-crimson anim-pulse-2" style={playState} />
          <circle cx="48" cy="48" r="3.5" className="fill-persici-crimson anim-pulse-3" style={playState} />
          <circle cx="64" cy="48" r="3.5" className="fill-slate-300" />

          <circle cx="16" cy="64" r="3.5" className="fill-slate-300" />
          <circle cx="32" cy="64" r="3.5" className="fill-slate-300" />
          <circle cx="48" cy="64" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="64" cy="64" r="3.5" className="fill-slate-300" />
        </svg>
      );

    case 'concentric-nodes':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {sharedStyle}
          {/* Static crosshairs */}
          <line x1="10" y1="40" x2="70" y2="40" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="40" y1="10" x2="40" y2="70" stroke="#E2E8F0" strokeWidth="1.5" />

          {/* Rotating outer ring and node */}
          <g className="anim-spin" style={playState}>
            <circle cx="40" cy="40" r="30" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="60" cy="30" r="3" className="fill-persici-crimson" />
          </g>

          {/* Counter-rotating inner ring and node */}
          <g className="anim-spin-rev" style={playState}>
            <circle cx="40" cy="40" r="18" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="27" cy="40" r="2.5" className="fill-slate-400" />
          </g>

          <circle cx="40" cy="40" r="4.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
        </svg>
      );

    case 'circuit-flow':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {sharedStyle}
          <path
            d="M14 62 L36 62 L36 28 L66 28"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="anim-dash-flow"
            style={playState}
          />
          <path
            d="M26 18 L26 44 L54 44"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="14" cy="62" r="3.5" className="fill-slate-400" />
          <circle cx="66" cy="28" r="4" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="26" cy="18" r="3.5" className="fill-slate-400" />
          <circle cx="54" cy="44" r="3.5" className="fill-persici-crimson anim-pulse-2" style={playState} />
        </svg>
      );

    case 'matrix-intersect':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {sharedStyle}
          <g className="anim-spin" style={playState}>
            <circle cx="22" cy="24" r="6" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="60" cy="28" r="6" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="40" cy="60" r="6" stroke="#94A3B8" strokeWidth="1.5" />
            <path d="M28 25 C38 27 48 27 54 28" stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M26 29 C30 42 35 50 38 54" stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M56 32 C50 42 45 49 42 55" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="22" cy="24" r="3" className="fill-persici-crimson" />
            <circle cx="40" cy="60" r="3" className="fill-persici-crimson" />
            <circle cx="60" cy="28" r="3" className="fill-slate-400" />
          </g>
        </svg>
      );

    case 'nested-squares':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {sharedStyle}
          <rect x="15" y="15" width="50" height="50" rx="3" stroke="#CBD5E1" strokeWidth="1.5" />
          <g className="anim-spin-rev" style={playState}>
            <rect x="28" y="28" width="24" height="24" rx="2" stroke="#94A3B8" strokeWidth="1.5" />
          </g>
          <line x1="15" y1="15" x2="28" y2="28" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="65" y1="15" x2="52" y2="28" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="65" y1="65" x2="52" y2="52" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="15" y1="65" x2="28" y2="52" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="40" cy="40" r="4.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="65" cy="15" r="3" className="fill-persici-crimson anim-pulse-2" style={playState} />
        </svg>
      );

    case 'orbital-radar':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {sharedStyle}
          <circle cx="40" cy="40" r="32" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="40" cy="40" r="22" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="40" cy="40" r="10" stroke="#94A3B8" strokeWidth="1.5" />

          {/* Rotating radar sweep arm */}
          <g className="anim-spin-fast" style={playState}>
            <line x1="40" y1="40" x2="68" y2="26" stroke="#D83427" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="56" cy="32" r="3" className="fill-persici-crimson" />
          </g>

          <circle cx="40" cy="40" r="3.5" className="fill-persici-crimson" />
          <circle cx="22" cy="40" r="3" className="fill-slate-400" />
        </svg>
      );

    case 'triad-mesh':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {sharedStyle}
          <polygon points="40,14 68,64 12,64" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
          <line x1="40" y1="14" x2="40" y2="64" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="12" y1="64" x2="54" y2="39" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="68" y1="64" x2="26" y2="39" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="40" cy="47" r="4.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="40" cy="14" r="3.5" className="fill-persici-crimson anim-pulse-2" style={playState} />
          <circle cx="68" cy="64" r="3" className="fill-slate-400" />
          <circle cx="12" cy="64" r="3" className="fill-slate-400" />
        </svg>
      );

    case 'lattice-loop':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {sharedStyle}
          <path
            d="M16 40 C 16 20, 64 20, 64 40 C 64 60, 16 60, 16 40 Z"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            className="anim-dash-flow"
            style={playState}
          />
          <circle cx="16" cy="40" r="3.5" className="fill-slate-400" />
          <circle cx="64" cy="40" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="40" cy="40" r="4" className="fill-persici-crimson anim-pulse-2" style={playState} />
        </svg>
      );

    case 'flow-funnel':
    default:
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {sharedStyle}
          <line x1="14" y1="20" x2="66" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          <line
            x1="22"
            y1="36"
            x2="58"
            y2="36"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeLinecap="round"
            className="anim-dash-flow"
            style={playState}
          />
          <line x1="30" y1="52" x2="50" y2="52" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="66" r="4.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="58" cy="36" r="3" className="fill-persici-crimson anim-pulse-2" style={playState} />
        </svg>
      );
  }
}

