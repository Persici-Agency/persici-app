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
      @keyframes persici-scan-v {
        0%, 100% { transform: translateY(0); opacity: 0.25; }
        50% { transform: translateY(32px); opacity: 0.95; }
      }
      @keyframes persici-wave-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }
      @keyframes persici-bar-bounce-1 {
        0%, 100% { height: 16px; y: 46px; }
        50% { height: 28px; y: 34px; }
      }
      @keyframes persici-bar-bounce-2 {
        0%, 100% { height: 32px; y: 30px; }
        50% { height: 44px; y: 18px; }
      }
      @keyframes persici-bar-bounce-3 {
        0%, 100% { height: 24px; y: 38px; }
        50% { height: 38px; y: 24px; }
      }
      .anim-spin { animation: persici-spin 14s linear infinite; transform-origin: 40px 40px; }
      .anim-spin-fast { animation: persici-spin 6s linear infinite; transform-origin: 40px 40px; }
      .anim-spin-rev { animation: persici-spin-rev 10s linear infinite; transform-origin: 40px 40px; }
      .anim-pulse-1 { animation: persici-pulse 2s ease-in-out infinite; transform-origin: center; }
      .anim-pulse-2 { animation: persici-pulse 2s ease-in-out infinite 0.6s; transform-origin: center; }
      .anim-pulse-3 { animation: persici-pulse 2s ease-in-out infinite 1.2s; transform-origin: center; }
      .anim-dash-flow { stroke-dasharray: 6 3; animation: persici-dash 3s linear infinite; }
      .anim-dash-fast { stroke-dasharray: 4 2; animation: persici-dash 1.8s linear infinite; }
      .anim-radar-ping { animation: persici-ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
      .anim-scan-v { animation: persici-scan-v 2.5s ease-in-out infinite; }
      .anim-wave-1 { animation: persici-wave-float 2.4s ease-in-out infinite; }
      .anim-wave-2 { animation: persici-wave-float 2.4s ease-in-out infinite 0.8s; }
      .anim-bar-1 { animation: persici-bar-bounce-1 1.8s ease-in-out infinite; }
      .anim-bar-2 { animation: persici-bar-bounce-2 1.8s ease-in-out infinite 0.4s; }
      .anim-bar-3 { animation: persici-bar-bounce-3 1.8s ease-in-out infinite 0.8s; }
    `}</style>
  );

  switch (type) {
    // ------------------------------------------------------------------------
    // 1. Core Solutions: grid-dots
    // ------------------------------------------------------------------------
    case 'grid-dots':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
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

    // ------------------------------------------------------------------------
    // 2. Core Solutions: concentric-nodes
    // ------------------------------------------------------------------------
    case 'concentric-nodes':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          <line x1="10" y1="40" x2="70" y2="40" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="40" y1="10" x2="40" y2="70" stroke="#E2E8F0" strokeWidth="1.5" />

          <g className="anim-spin" style={playState}>
            <circle cx="40" cy="40" r="30" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="60" cy="30" r="3" className="fill-persici-crimson" />
          </g>

          <g className="anim-spin-rev" style={playState}>
            <circle cx="40" cy="40" r="18" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="27" cy="40" r="2.5" className="fill-slate-400" />
          </g>

          <circle cx="40" cy="40" r="4.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
        </svg>
      );

    // ------------------------------------------------------------------------
    // 3. Core Solutions: circuit-flow
    // ------------------------------------------------------------------------
    case 'circuit-flow':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
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

    // ------------------------------------------------------------------------
    // 4. Core Solutions: matrix-intersect
    // ------------------------------------------------------------------------
    case 'matrix-intersect':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
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

    // ------------------------------------------------------------------------
    // 5. Core Solutions: nested-squares
    // ------------------------------------------------------------------------
    case 'nested-squares':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
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

    // ------------------------------------------------------------------------
    // 6. Core Solutions: orbital-radar
    // ------------------------------------------------------------------------
    case 'orbital-radar':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          <circle cx="40" cy="40" r="32" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="40" cy="40" r="22" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="40" cy="40" r="10" stroke="#94A3B8" strokeWidth="1.5" />

          <g className="anim-spin-fast" style={playState}>
            <line x1="40" y1="40" x2="68" y2="26" stroke="#D83427" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="56" cy="32" r="3" className="fill-persici-crimson" />
          </g>

          <circle cx="40" cy="40" r="3.5" className="fill-persici-crimson" />
          <circle cx="22" cy="40" r="3" className="fill-slate-400" />
        </svg>
      );

    // ------------------------------------------------------------------------
    // 7. Core Solutions: triad-mesh
    // ------------------------------------------------------------------------
    case 'triad-mesh':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
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

    // ------------------------------------------------------------------------
    // 8. Core Solutions: lattice-loop
    // ------------------------------------------------------------------------
    case 'lattice-loop':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
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

    // ------------------------------------------------------------------------
    // 9. Core Solutions: flow-funnel
    // ------------------------------------------------------------------------
    case 'flow-funnel':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
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

    // ========================================================================
    // APPLICATION & MANAGEMENT SPECIALIZED SHAPES (5 UNIQUE CAPABILITIES)
    // ========================================================================

    // 10. App & Mgmt: iOS & Android App Development (Dual Phone Stack & Cross Bridge)
    case 'app-dual-stack':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Back Device (Tablet / Android shell) */}
          <rect x="28" y="14" width="34" height="46" rx="5" stroke="#CBD5E1" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
          <line x1="36" y1="22" x2="54" y2="22" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="36" y1="28" x2="48" y2="28" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />

          {/* Front Device (Modern Smartphone frame) */}
          <rect x="18" y="24" width="30" height="44" rx="5" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
          <rect x="28" y="27" width="10" height="2.5" rx="1.25" fill="#94A3B8" />

          {/* Dynamic Sync Link connecting devices */}
          <path
            d="M32 46 L48 36"
            stroke="#D83427"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            className="anim-dash-fast"
            style={playState}
          />

          {/* UI Screen Elements */}
          <rect x="24" y="34" width="18" height="3" rx="1.5" fill="#E2E8F0" />
          <rect x="24" y="40" width="12" height="2" rx="1" fill="#CBD5E1" />

          {/* Touch Point / Interaction Pulse */}
          <circle cx="36" cy="54" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="36" cy="54" r="6.5" stroke="#D83427" strokeWidth="1" strokeOpacity="0.4" className="anim-radar-ping" style={playState} />

          {/* Satellite Platform Badge */}
          <circle cx="56" cy="20" r="2.5" className="fill-persici-crimson anim-pulse-2" style={playState} />
        </svg>
      );

    // 11. App & Mgmt: UI/UX Design for Mobile (Cubic Bezier Vector Engine & Anchors)
    case 'bezier-curv-engine':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Bezier Tangent Handle Lines */}
          <line x1="16" y1="56" x2="28" y2="22" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="64" y1="28" x2="52" y2="62" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="2 2" />

          {/* Main Bezier Smooth Curve */}
          <path
            d="M16 56 C 28 22, 52 62, 64 28"
            stroke="#D83427"
            strokeWidth="2"
            strokeLinecap="round"
            className="anim-dash-flow"
            style={playState}
          />

          {/* Control Point Anchors (Designer Squares) */}
          <rect x="14" y="54" width="4" height="4" fill="#64748B" />
          <rect x="62" y="26" width="4" height="4" fill="#64748B" />

          {/* Tangent Interactive Handles */}
          <circle cx="28" cy="22" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="52" cy="62" r="3" className="fill-slate-400 anim-pulse-2" style={playState} />

          {/* Precision Pen Crosshair at (40, 40) */}
          <circle cx="40" cy="42" r="2" fill="#D83427" />
          <circle cx="40" cy="42" r="8" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" className="anim-spin-fast" style={playState} />
        </svg>
      );

    // 12. App & Mgmt: Backend & API Development (API Cluster Gateway & Services)
    case 'api-cluster-gateway':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Central API Gateway Hub */}
          <circle cx="40" cy="40" r="14" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="40" cy="40" r="8" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="40" cy="40" r="4" className="fill-persici-crimson anim-pulse-1" style={playState} />

          {/* High-Throughput Service Satellite Buses */}
          <line x1="40" y1="26" x2="40" y2="14" stroke="#D83427" strokeWidth="1.5" strokeLinecap="round" className="anim-dash-fast" style={playState} />
          <line x1="54" y1="40" x2="66" y2="40" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="40" y1="54" x2="40" y2="66" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="26" y1="40" x2="14" y2="40" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

          {/* Microservice Endpoints */}
          <circle cx="40" cy="14" r="4.5" className="fill-persici-crimson anim-pulse-2" style={playState} />
          <circle cx="66" cy="40" r="3.5" className="fill-slate-400" />
          <circle cx="40" cy="66" r="3.5" className="fill-persici-crimson anim-pulse-3" style={playState} />
          <circle cx="14" cy="40" r="3.5" className="fill-slate-400" />

          {/* Data packet traveling */}
          <g className="anim-spin" style={playState}>
            <circle cx="40" cy="22" r="1.5" fill="#D83427" />
          </g>
        </svg>
      );

    // 13. App & Mgmt: Quality Assurance & Testing (Automated Test Grid & Laser Scanner)
    case 'automated-test-grid':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Outer Testing Suite Matrix Frame */}
          <rect x="16" y="16" width="48" height="48" rx="4" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Internal Grid Dividers */}
          <line x1="32" y1="16" x2="32" y2="64" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="48" y1="16" x2="48" y2="64" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="16" y1="32" x2="64" y2="32" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="16" y1="48" x2="64" y2="48" stroke="#E2E8F0" strokeWidth="1" />

          {/* Verified Status Indicators (Passing Tests) */}
          <path d="M21 24 L24 27 L28 21" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M53 24 L56 27 L60 21" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 56 L24 59 L28 53" stroke="#D83427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="56" cy="56" r="3" className="fill-persici-crimson anim-pulse-2" style={playState} />

          {/* QA Active Laser Sweep Scan Line */}
          <g className="anim-scan-v" style={playState}>
            <line x1="16" y1="24" x2="64" y2="24" stroke="#D83427" strokeWidth="1.5" />
            <circle cx="40" cy="24" r="2.5" fill="#D83427" />
          </g>

          {/* Focus Check Center Tile */}
          <circle cx="40" cy="40" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
        </svg>
      );

    // 14. App & Mgmt: App Deployment & Launch Support (Trajectory Arc & Store Orbital)
    case 'store-launch-trajectory':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Ground Release Platform Base */}
          <line x1="14" y1="64" x2="34" y2="64" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="68" x2="30" y2="68" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />

          {/* Dynamic Ballistic Launch Arc */}
          <path
            d="M20 64 Q 32 58, 44 42 T 62 18"
            stroke="#D83427"
            strokeWidth="2"
            strokeLinecap="round"
            className="anim-dash-flow"
            style={playState}
          />

          {/* Pre-launch & Mid-flight Staging Telemetry Checkpoints */}
          <circle cx="20" cy="64" r="3" fill="#64748B" />
          <circle cx="40" cy="44" r="2.5" className="fill-slate-400 anim-pulse-2" style={playState} />

          {/* Store Orbit Destination Ring (App Store / Google Play Target) */}
          <circle cx="62" cy="18" r="10" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3 2" className="anim-spin-fast" style={playState} />
          <circle cx="62" cy="18" r="5" stroke="#94A3B8" strokeWidth="1" />
          <circle cx="62" cy="18" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="62" cy="18" r="7" stroke="#D83427" strokeWidth="1" strokeOpacity="0.5" className="anim-radar-ping" style={playState} />
        </svg>
      );

    // ========================================================================
    // EXTENDED SOLUTIONS & ECOSYSTEM SHAPES (10 SHAPES)
    // ========================================================================

    // 15. Helix Data Strand (Data & AI Intelligence)
    case 'helix-data-strand':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Base Pair Connecting Rungs */}
          <line x1="22" y1="30" x2="22" y2="50" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="31" y1="24" x2="31" y2="56" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="40" y1="22" x2="40" y2="58" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="49" y1="24" x2="49" y2="56" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="58" y1="30" x2="58" y2="50" stroke="#CBD5E1" strokeWidth="1.2" />

          {/* Strands 1 & 2 */}
          <path
            d="M 14 36 C 26 20, 34 60, 46 40 C 58 20, 66 60, 68 40"
            stroke="#94A3B8"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="anim-dash-flow"
            style={playState}
          />
          <path
            d="M 14 44 C 26 60, 34 20, 46 40 C 58 60, 66 20, 68 40"
            stroke="#D83427"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="anim-dash-fast"
            style={playState}
          />

          {/* Active Genetic Codon Nodes */}
          <circle cx="40" cy="22" r="3" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="40" cy="58" r="3" className="fill-slate-400 anim-pulse-2" style={playState} />
          <circle cx="31" cy="40" r="2.5" className="fill-persici-crimson anim-pulse-3" style={playState} />
          <circle cx="49" cy="40" r="2.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
        </svg>
      );

    // 16. Quantum Core Cube (Cloud Infrastructure & Computing)
    case 'quantum-core-cube':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* 3D Isometric Cube Contours */}
          <g className="anim-spin" style={playState}>
            {/* Outer Hexagonal Boundary of Isometric Cube */}
            <polygon points="40,16 62,28 62,52 40,64 18,52 18,28" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
            {/* Y-Junction from Center to Vertices */}
            <line x1="40" y1="40" x2="40" y2="16" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="40" y1="40" x2="62" y2="52" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="40" y1="40" x2="18" y2="52" stroke="#94A3B8" strokeWidth="1.5" />
          </g>

          {/* Central Pulsing Quantum Singularity Core */}
          <circle cx="40" cy="40" r="10" stroke="#D83427" strokeWidth="1.2" strokeDasharray="3 3" className="anim-spin-fast" style={playState} />
          <circle cx="40" cy="40" r="4.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="40" cy="40" r="7.5" stroke="#D83427" strokeWidth="1" strokeOpacity="0.4" className="anim-radar-ping" style={playState} />
        </svg>
      );

    // 17. Cyber Shield Lock (Security, Privacy & Governance)
    case 'cyber-shield-lock':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Outer Protective Security Shield */}
          <path
            d="M 40 14 L 62 23 V 41 C 62 55 40 66 40 66 C 40 66 18 55 18 41 V 23 Z"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Concentric Biometric Key Rings */}
          <g className="anim-spin" style={playState}>
            <circle cx="40" cy="38" r="12" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="5 3" />
          </g>
          <g className="anim-spin-rev" style={playState}>
            <circle cx="40" cy="38" r="7" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3 2" />
          </g>

          {/* Central Cryptographic Lock Core */}
          <circle cx="40" cy="37" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <path d="M 39 40 L 41 40 L 42 46 L 38 46 Z" fill="#D83427" />
        </svg>
      );

    // 18. Neural Synapse Web (AI & Machine Learning)
    case 'neural-synapse-web':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Synaptic Pathway Lines (Layer 1 -> 2 -> 3) */}
          <line x1="20" y1="28" x2="40" y2="20" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="20" y1="28" x2="40" y2="40" stroke="#94A3B8" strokeWidth="1.5" className="anim-dash-flow" style={playState} />
          <line x1="20" y1="52" x2="40" y2="40" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="20" y1="52" x2="40" y2="60" stroke="#CBD5E1" strokeWidth="1.2" />

          <line x1="40" y1="20" x2="60" y2="30" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="40" y1="40" x2="60" y2="30" stroke="#D83427" strokeWidth="1.5" className="anim-dash-fast" style={playState} />
          <line x1="40" y1="40" x2="60" y2="50" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="40" y1="60" x2="60" y2="50" stroke="#CBD5E1" strokeWidth="1.2" />

          {/* Input Layer Neurons */}
          <circle cx="20" cy="28" r="3.5" className="fill-slate-400" />
          <circle cx="20" cy="52" r="3.5" className="fill-slate-400" />

          {/* Hidden Processing Neurons */}
          <circle cx="40" cy="20" r="3.5" className="fill-slate-400" />
          <circle cx="40" cy="40" r="4.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="40" cy="60" r="3.5" className="fill-slate-400" />

          {/* Output Activation Neurons */}
          <circle cx="60" cy="30" r="4" className="fill-persici-crimson anim-pulse-2" style={playState} />
          <circle cx="60" cy="50" r="3.5" className="fill-slate-400" />
        </svg>
      );

    // 19. Wave Frequency Stream (Real-Time Telemetry & Event Streaming)
    case 'wave-frequency-stream':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Oscilloscope Grid Datum Lines */}
          <line x1="12" y1="40" x2="68" y2="40" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="40" y1="16" x2="40" y2="64" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />

          {/* Primary Signal Waveform */}
          <path
            d="M 12 40 Q 20 22, 28 40 T 44 40 T 56 18 T 68 40"
            stroke="#D83427"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="anim-dash-flow"
            style={playState}
          />

          {/* Echo Waveform */}
          <path
            d="M 12 40 Q 24 54, 36 40 T 60 40"
            stroke="#CBD5E1"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="4 2"
          />

          {/* Peak Telemetry Point */}
          <line x1="56" y1="18" x2="56" y2="40" stroke="#D83427" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="56" cy="18" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="28" cy="40" r="2.5" className="fill-slate-400 anim-pulse-2" style={playState} />
        </svg>
      );

    // 20. Hexagonal Honeycomb Hive (Architecture, Modularity & Scalability)
    case 'hexagonal-honeycomb-hive':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Top Left Cell */}
          <polygon points="28,18 36,13 44,18 44,28 36,33 28,28" stroke="#CBD5E1" strokeWidth="1.2" fill="none" />
          {/* Top Right Cell */}
          <polygon points="46,18 54,13 62,18 62,28 54,33 46,28" stroke="#CBD5E1" strokeWidth="1.2" fill="none" />
          {/* Center Master Cell */}
          <polygon points="37,34 47,28 57,34 57,46 47,52 37,46" stroke="#D83427" strokeWidth="1.8" fill="none" />
          {/* Bottom Left Cell */}
          <polygon points="19,34 29,28 39,34 39,46 29,52 19,46" stroke="#CBD5E1" strokeWidth="1.2" fill="none" />
          {/* Bottom Right Cell */}
          <polygon points="28,52 36,47 44,52 44,62 36,67 28,62" stroke="#CBD5E1" strokeWidth="1.2" fill="none" />
          <polygon points="46,52 54,47 62,52 62,62 54,67 46,62" stroke="#CBD5E1" strokeWidth="1.2" fill="none" />

          {/* Central Active Core */}
          <circle cx="47" cy="40" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="29" cy="40" r="2.5" className="fill-slate-400" />
          <circle cx="54" cy="57" r="2.5" className="fill-persici-crimson anim-pulse-2" style={playState} />
        </svg>
      );

    // 21. Prism Refraction Beam (Marketing, Strategy & Insights)
    case 'prism-refraction-beam':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Incident Input Beam */}
          <line x1="12" y1="36" x2="33" y2="44" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" className="anim-dash-fast" style={playState} />
          <circle cx="12" cy="36" r="2.5" fill="#94A3B8" />

          {/* Optical Glass Prism */}
          <polygon points="40,20 58,56 22,56" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />

          {/* Refracted Spectrum Output Beams */}
          <line x1="47" y1="46" x2="68" y2="34" stroke="#D83427" strokeWidth="1.6" strokeLinecap="round" className="anim-dash-flow" style={playState} />
          <line x1="48" y1="48" x2="68" y2="46" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="49" y1="50" x2="68" y2="58" stroke="#CBD5E1" strokeWidth="1.4" strokeLinecap="round" />

          {/* Focal Junction & Terminus Dots */}
          <circle cx="40" cy="44" r="3" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="68" cy="34" r="3" className="fill-persici-crimson anim-pulse-2" style={playState} />
          <circle cx="68" cy="46" r="2" className="fill-slate-400" />
          <circle cx="68" cy="58" r="2" className="fill-slate-400" />
        </svg>
      );

    // 22. Compass Spatial Reticle (Experience Transformation & Precision)
    case 'compass-spatial-reticle':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Outer Precision Dial with Cardinal Ticks */}
          <circle cx="40" cy="40" r="28" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="40" y1="8" x2="40" y2="14" stroke="#D83427" strokeWidth="1.8" />
          <line x1="40" y1="66" x2="40" y2="72" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="8" y1="40" x2="14" y2="40" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="66" y1="40" x2="72" y2="40" stroke="#94A3B8" strokeWidth="1.5" />

          {/* Inner Coordinate Ring */}
          <circle cx="40" cy="40" r="18" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />

          {/* Rotating Spatial Scanner Needle */}
          <g className="anim-spin-fast" style={playState}>
            <polygon points="40,24 43,40 37,40" fill="#D83427" />
            <polygon points="40,56 43,40 37,40" fill="#94A3B8" />
          </g>

          {/* Target Reticle Center Point */}
          <circle cx="40" cy="40" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
        </svg>
      );

    // 23. Infinity Pulse Exchange (Supply Chain & Ecosystem Value Loops)
    case 'infinity-pulse-exchange':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Continuous Lemniscate Circuit */}
          <path
            d="M 40 40 C 48 26, 66 26, 66 40 C 66 54, 48 54, 40 40 C 32 26, 14 26, 14 40 C 14 54, 32 54, 40 40 Z"
            stroke="#CBD5E1"
            strokeWidth="1.8"
            className="anim-dash-flow"
            style={playState}
          />

          {/* Secondary Counter-Flow Layer */}
          <path
            d="M 40 40 C 48 26, 66 26, 66 40 C 66 54, 48 54, 40 40"
            stroke="#D83427"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="6 4"
            className="anim-dash-fast"
            style={playState}
          />

          {/* Left, Right & Center Value Tokens */}
          <circle cx="18" cy="40" r="3" className="fill-slate-400 anim-pulse-2" style={playState} />
          <circle cx="40" cy="40" r="4.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="62" cy="40" r="3" className="fill-persici-crimson anim-pulse-3" style={playState} />
        </svg>
      );

    // 24. Bar Spectrum Analyzer (E-commerce Growth & Performance Analytics)
    case 'bar-spectrum-analyzer':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Baseline */}
          <line x1="14" y1="62" x2="66" y2="62" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />

          {/* Dynamic Spectrum / Growth Columns */}
          <rect x="18" y="46" width="6" height="16" rx="2" fill="#CBD5E1" className="anim-bar-1" style={playState} />
          <rect x="28" y="38" width="6" height="24" rx="2" fill="#94A3B8" className="anim-bar-2" style={playState} />
          <rect x="38" y="30" width="6" height="32" rx="2" fill="#D83427" className="anim-bar-3" style={playState} />
          <rect x="48" y="24" width="6" height="38" rx="2" fill="#94A3B8" className="anim-bar-1" style={playState} />
          <rect x="58" y="16" width="6" height="46" rx="2" fill="#D83427" className="anim-bar-2" style={playState} />

          {/* Growth Trend Trajectory Curve */}
          <path
            d="M 21 44 Q 38 32, 61 14"
            stroke="#D83427"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            fill="none"
            className="anim-dash-fast"
            style={playState}
          />
          <circle cx="61" cy="14" r="3" className="fill-persici-crimson anim-pulse-1" style={playState} />
        </svg>
      );


    // ========================================================================
    // MARKETING & COMMUNICATIONS SPECIALIZED SHAPES (4 SHAPES)
    // ========================================================================

    // 25. Creative Storytelling Lens (Aperture Blades & Narrative Framing)
    case 'creative-story-lens':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Corner Precision Framing Brackets */}
          <path d="M 16 26 V 18 H 24" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 64 26 V 18 H 56" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 16 54 V 62 H 24" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 64 54 V 62 H 56" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Outer Lens Barrel */}
          <circle cx="40" cy="40" r="24" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Rotating Aperture Shutter Blades */}
          <g className="anim-spin" style={playState}>
            <line x1="40" y1="20" x2="52" y2="44" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="56" y1="32" x2="36" y2="52" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="52" y1="52" x2="28" y2="38" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="32" y1="56" x2="34" y2="26" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="22" y1="40" x2="50" y2="28" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
          </g>

          {/* Central Creative Focus Core */}
          <circle cx="40" cy="40" r="8" stroke="#D83427" strokeWidth="1.5" />
          <circle cx="40" cy="40" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
        </svg>
      );

    // 26. Omnichannel Radial Mesh (Connected Campaign Hub & Cross-Channel Buses)
    case 'omnichannel-radial-mesh':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Synchronized Radial Spoke Buses (Center to 6 Channels) */}
          <line x1="40" y1="40" x2="40" y2="16" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="40" y1="40" x2="62" y2="26" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="40" y1="40" x2="62" y2="54" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="40" y1="40" x2="40" y2="64" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="40" y1="40" x2="18" y2="54" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="40" y1="40" x2="18" y2="26" stroke="#CBD5E1" strokeWidth="1.2" />

          {/* Hexagonal Outer Perimeter Sync Loop */}
          <polygon
            points="40,16 62,26 62,54 40,64 18,54 18,26"
            stroke="#94A3B8"
            strokeWidth="1.4"
            className="anim-dash-flow"
            style={playState}
          />

          {/* Central Campaign Master Node */}
          <circle cx="40" cy="40" r="10" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3 2" className="anim-spin-fast" style={playState} />
          <circle cx="40" cy="40" r="4.5" className="fill-persici-crimson anim-pulse-1" style={playState} />

          {/* 6 Channel Touchpoint Terminals */}
          <circle cx="40" cy="16" r="3.5" className="fill-persici-crimson anim-pulse-2" style={playState} />
          <circle cx="62" cy="26" r="3" className="fill-slate-400" />
          <circle cx="62" cy="54" r="3.5" className="fill-persici-crimson anim-pulse-3" style={playState} />
          <circle cx="40" cy="64" r="3" className="fill-slate-400" />
          <circle cx="18" cy="54" r="3.5" className="fill-persici-crimson anim-pulse-2" style={playState} />
          <circle cx="18" cy="26" r="3" className="fill-slate-400" />
        </svg>
      );

    // 27. Social Resonance Echo (Community Broadcast Ripples & Interaction Pulses)
    case 'social-resonance-echo':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Concentric Acoustic Resonance Waves */}
          <path d="M 32 26 A 18 18 0 0 1 32 54" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 26 18 A 28 28 0 0 1 26 62" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" className="anim-dash-flow" style={playState} />
          <path d="M 20 10 A 38 38 0 0 1 20 70" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="4 3" />

          {/* Interactive Community Engagement Nodes */}
          <circle cx="58" cy="24" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <line x1="42" y1="40" x2="58" y2="24" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="2 2" />

          <circle cx="64" cy="42" r="3" className="fill-slate-400 anim-pulse-2" style={playState} />
          <line x1="42" y1="40" x2="64" y2="42" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="2 2" />

          <circle cx="56" cy="58" r="3.5" className="fill-persici-crimson anim-pulse-3" style={playState} />
          <line x1="42" y1="40" x2="56" y2="58" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="2 2" />

          {/* Transmitter Origin Hub */}
          <circle cx="42" cy="40" r="5" stroke="#D83427" strokeWidth="1.5" />
          <circle cx="42" cy="40" r="3" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="42" cy="40" r="9" stroke="#D83427" strokeWidth="1" strokeOpacity="0.4" className="anim-radar-ping" style={playState} />
        </svg>
      );

    // 28. Media Production Timeline (Film Strip, Scrubber & Studio Live Beacon)
    case 'media-production-timeline':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Film Strip Frame Container */}
          <rect x="14" y="20" width="52" height="40" rx="4" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Top & Bottom Sprocket Perforations */}
          <rect x="18" y="23" width="5" height="4" rx="1" fill="#94A3B8" />
          <rect x="28" y="23" width="5" height="4" rx="1" fill="#94A3B8" />
          <rect x="38" y="23" width="5" height="4" rx="1" fill="#94A3B8" />
          <rect x="48" y="23" width="5" height="4" rx="1" fill="#94A3B8" />
          <rect x="58" y="23" width="5" height="4" rx="1" fill="#94A3B8" />

          <rect x="18" y="53" width="5" height="4" rx="1" fill="#94A3B8" />
          <rect x="28" y="53" width="5" height="4" rx="1" fill="#94A3B8" />
          <rect x="38" y="53" width="5" height="4" rx="1" fill="#94A3B8" />
          <rect x="48" y="53" width="5" height="4" rx="1" fill="#94A3B8" />
          <rect x="58" y="53" width="5" height="4" rx="1" fill="#94A3B8" />

          {/* Viewport Frame Divider Lines */}
          <line x1="14" y1="31" x2="66" y2="31" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="14" y1="49" x2="66" y2="49" stroke="#E2E8F0" strokeWidth="1" />

          {/* Audio / Keyframe Waveform Trace */}
          <path
            d="M 18 40 L 26 36 L 32 44 L 40 34 L 48 44 L 56 37 L 62 40"
            stroke="#94A3B8"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Moving Playhead Scrubber */}
          <g className="anim-scan-v" style={playState}>
            <line x1="42" y1="28" x2="42" y2="52" stroke="#D83427" strokeWidth="1.5" />
            <polygon points="40,28 44,28 42,32" fill="#D83427" />
          </g>

          {/* Studio Recording Live Indicator Beacon */}
          <circle cx="60" cy="15" r="3" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="60" cy="15" r="6" stroke="#D83427" strokeWidth="1" strokeOpacity="0.4" className="anim-radar-ping" style={playState} />
        </svg>
      );

    // 29. Growth Trajectory Engine (E-Commerce Strategy & Compounding GMV Scale)
    case 'growth-trajectory-engine':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Coordinate Grid Lines */}
          <line x1="16" y1="18" x2="16" y2="64" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="64" x2="68" y2="64" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="48" x2="68" y2="48" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="16" y1="32" x2="68" y2="32" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="2 2" />

          {/* Stepped Baseline Projection Area */}
          <path d="M 16 64 Q 36 60, 48 40 T 68 18 L 68 64 Z" fill="rgba(216,52,39,0.06)" />

          {/* Ascending Parabolic GMV Trajectory Curve */}
          <path
            d="M 16 64 Q 36 60, 48 40 T 68 18"
            stroke="#D83427"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="anim-dash-flow"
            style={playState}
          />

          {/* Milestone Growth Markers */}
          <circle cx="34" cy="58" r="2.5" className="fill-slate-400" />
          <circle cx="48" cy="40" r="3.5" className="fill-persici-crimson anim-pulse-2" style={playState} />
          <circle cx="68" cy="18" r="4.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="68" cy="18" r="8" stroke="#D83427" strokeWidth="1" strokeOpacity="0.4" className="anim-radar-ping" style={playState} />
        </svg>
      );

    // 30. Storefront Render Matrix (Headless Storefront Speed & Catalog Architecture)
    case 'storefront-render-matrix':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Browser / Viewport Frame */}
          <rect x="14" y="16" width="52" height="48" rx="4" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="14" y1="26" x2="66" y2="26" stroke="#CBD5E1" strokeWidth="1.2" />
          <circle cx="20" cy="21" r="1.5" fill="#94A3B8" />
          <circle cx="25" cy="21" r="1.5" fill="#94A3B8" />
          <circle cx="30" cy="21" r="1.5" fill="#94A3B8" />

          {/* Modular Product Catalog Cards */}
          <rect x="20" y="32" width="16" height="12" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
          <rect x="40" y="32" width="20" height="12" rx="2" fill="rgba(216,52,39,0.08)" stroke="#D83427" strokeWidth="1.2" />
          <rect x="20" y="48" width="20" height="10" rx="2" fill="rgba(216,52,39,0.08)" stroke="#D83427" strokeWidth="1.2" />
          <rect x="44" y="48" width="16" height="10" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />

          {/* Sub-Second Laser Scan Beam */}
          <g className="anim-scan-v" style={playState}>
            <line x1="16" y1="28" x2="64" y2="28" stroke="#D83427" strokeWidth="1.5" />
          </g>

          {/* Active Rendering Node */}
          <circle cx="56" cy="38" r="2.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="30" cy="53" r="2.5" className="fill-persici-crimson anim-pulse-3" style={playState} />
        </svg>
      );

    // 31. Ad Targeting Matrix (Multi-Channel Precision Audience Acquisition)
    case 'ad-targeting-matrix':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Concentric Precision Reticles */}
          <circle cx="40" cy="40" r="28" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="40" cy="40" r="18" stroke="#94A3B8" strokeWidth="1.4" />
          <circle cx="40" cy="40" r="7" stroke="#D83427" strokeWidth="1.6" />

          {/* Crosshair Cardinal Guides */}
          <line x1="8" y1="40" x2="72" y2="40" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="40" y1="8" x2="40" y2="72" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />

          {/* Rotating Audience Acquisition Sweep */}
          <g className="anim-spin" style={playState}>
            <line x1="40" y1="40" x2="65" y2="22" stroke="#D83427" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="65" cy="22" r="3" className="fill-persici-crimson" />
          </g>

          {/* High-Intent Conversion Nodes */}
          <circle cx="40" cy="40" r="3.5" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="26" cy="28" r="2.5" className="fill-slate-400 anim-pulse-2" style={playState} />
          <circle cx="54" cy="52" r="2.5" className="fill-slate-400 anim-pulse-3" style={playState} />
          <circle cx="40" cy="40" r="12" stroke="#D83427" strokeWidth="1" strokeOpacity="0.4" className="anim-radar-ping" style={playState} />
        </svg>
      );

    // 32. Cart Checkout Funnel (Conversion Rate Optimization & Instant Payment Rails)
    case 'cart-checkout-funnel':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Shopping Cart Geometry */}
          <path
            d="M 16 22 L 24 22 L 32 46 L 58 46 L 64 28 L 26 28"
            stroke="#CBD5E1"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Cart Wheels */}
          <circle cx="34" cy="54" r="3" stroke="#94A3B8" strokeWidth="1.4" />
          <circle cx="56" cy="54" r="3" stroke="#94A3B8" strokeWidth="1.4" />

          {/* Fast-Track Conversion Flow Line */}
          <path
            d="M 40 12 L 40 36"
            stroke="#D83427"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="anim-dash-fast"
            style={playState}
          />
          <polygon points="37,34 43,34 40,39" fill="#D83427" />

          {/* Sub-Second Checkout Pulse Beacon */}
          <circle cx="45" cy="37" r="4" className="fill-persici-crimson anim-pulse-1" style={playState} />
          <circle cx="45" cy="37" r="9" stroke="#D83427" strokeWidth="1" strokeOpacity="0.4" className="anim-radar-ping" style={playState} />
          {/* High-converting items in cart */}
          <rect x="32" y="32" width="7" height="7" rx="1.5" fill="#D83427" fillOpacity="0.8" />
          <rect x="42" y="30" width="8" height="9" rx="1.5" fill="#94A3B8" />
          <rect x="52" y="33" width="6" height="6" rx="1" fill="#CBD5E1" />
        </svg>
      );

    // 33. Omnichannel Inventory Sync (Central Hub Syncing Web, App, Marketplaces & Warehouses)
    case 'omnichannel-inventory-sync':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Central Commerce Hub Ring */}
          <circle cx="40" cy="40" r="10" stroke="#D83427" strokeWidth="1.8" />
          <circle cx="40" cy="40" r="4.5" className="fill-persici-crimson anim-pulse-1" style={playState} />

          {/* 4 Directional Channel Spokes */}
          <line x1="40" y1="30" x2="40" y2="16" stroke="#94A3B8" strokeWidth="1.5" className="anim-dash-fast" style={playState} />
          <line x1="50" y1="40" x2="64" y2="40" stroke="#94A3B8" strokeWidth="1.5" className="anim-dash-fast" style={playState} />
          <line x1="40" y1="50" x2="40" y2="64" stroke="#94A3B8" strokeWidth="1.5" className="anim-dash-fast" style={playState} />
          <line x1="30" y1="40" x2="16" y2="40" stroke="#94A3B8" strokeWidth="1.5" className="anim-dash-fast" style={playState} />

          {/* Peripheral Channel Terminals */}
          {/* Top: Web Storefront */}
          <rect x="34" y="10" width="12" height="9" rx="2" stroke="#CBD5E1" strokeWidth="1.4" fill="white" />
          <circle cx="40" cy="14" r="1.5" className="fill-persici-crimson anim-pulse-2" style={playState} />

          {/* Right: Regional Marketplaces */}
          <rect x="61" y="34" width="11" height="12" rx="2" stroke="#CBD5E1" strokeWidth="1.4" fill="white" />
          <circle cx="66" cy="40" r="1.5" className="fill-persici-crimson anim-pulse-3" style={playState} />

          {/* Bottom: POS & Flagship Boutiques */}
          <rect x="34" y="61" width="12" height="9" rx="2" stroke="#CBD5E1" strokeWidth="1.4" fill="white" />
          <circle cx="40" cy="65" r="1.5" className="fill-persici-crimson anim-pulse-2" style={playState} />

          {/* Left: Centralized Warehouse ERP */}
          <rect x="8" y="34" width="11" height="12" rx="2" stroke="#CBD5E1" strokeWidth="1.4" fill="white" />
          <circle cx="14" cy="40" r="1.5" className="fill-persici-crimson anim-pulse-3" style={playState} />

          {/* Rotating Orbital Sync Field */}
          <circle cx="40" cy="40" r="26" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" className="anim-spin-fast" style={playState} />
        </svg>
      );

    // 34. Retention Loop Orbit (Compounding Customer Lifetime Value & Loyalty Circuit)
    case 'retention-loop-orbit':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          {sharedStyle}
          {/* Closed Continuous Retention Oval Orbit */}
          <ellipse cx="40" cy="40" rx="26" ry="18" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="6 3" className="anim-dash-flow" style={playState} />

          {/* Counter-Tilted Secondary Loyalty Loop */}
          <g transform="rotate(-30 40 40)">
            <ellipse cx="40" cy="40" rx="24" ry="14" stroke="#D83427" strokeWidth="1.4" strokeOpacity="0.4" />
          </g>

          {/* Central Customer Value Hub */}
          <circle cx="40" cy="40" r="6" stroke="#D83427" strokeWidth="1.5" fill="rgba(216,52,39,0.06)" />
          <polygon points="40,36 44,40 40,44 36,40" className="fill-persici-crimson anim-pulse-1" style={playState} />

          {/* Revolving VIP Loyalty Diamond Nodes */}
          <g className="anim-spin" style={playState}>
            <circle cx="66" cy="40" r="3.5" className="fill-persici-crimson" />
            <circle cx="14" cy="40" r="2.5" className="fill-slate-400" />
          </g>

          {/* Pulse Waves */}
          <circle cx="40" cy="40" r="12" stroke="#D83427" strokeWidth="1" strokeOpacity="0.4" className="anim-radar-ping" style={playState} />
        </svg>
      );

    default:
      return null;
  }
}
