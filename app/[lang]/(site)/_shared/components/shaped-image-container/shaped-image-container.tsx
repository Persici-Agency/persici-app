'use client';

import React, { useId } from 'react';
import Image from 'next/image';

export type ShapeVariant =
  | 'sapient-tab-tl'
  | 'sapient-tab-tr'
  | 'sapient-stepped-diagonal'
  | 'sapient-wide-strip'
  | 'sapient-notched-bl';

export interface ShapedImageContainerProps {
  shape?: ShapeVariant;
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string; // e.g. 'aspect-4/3', 'aspect-16/10', 'aspect-4/5', 'aspect-21/9'
  className?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}

/**
 * Normalized vector paths for objectBoundingBox clipPaths (0 0 to 1 1).
 * Smooth rounded fillets, stepped tabs, and concave/convex transitions.
 */
const SHAPE_PATHS: Record<ShapeVariant, string> = {
  // 1. Exact match to Publicis Sapient reference screenshot (media_1788692540391.png)
  // Top-left tab, stepped down shoulder on right, inward step cutout on bottom-left.
  'sapient-tab-tl':
    'M 0.08,0 L 0.36,0 C 0.40,0 0.42,0.02 0.43,0.06 L 0.44,0.09 C 0.45,0.13 0.47,0.15 0.51,0.15 L 0.92,0.15 C 0.96,0.15 1.0,0.19 1.0,0.23 L 1.0,0.92 C 1.0,0.96 0.96,1.0 0.92,1.0 L 0.24,1.0 C 0.20,1.0 0.16,0.96 0.16,0.92 L 0.16,0.67 C 0.16,0.63 0.14,0.60 0.10,0.60 L 0.04,0.60 C 0.015,0.60 0,0.58 0,0.55 L 0,0.08 C 0,0.036 0.036,0 0.08,0 Z',

  // 2. Mirrored variation: Top-right tab, bottom-right step cutout
  'sapient-tab-tr':
    'M 0.08,0.15 L 0.49,0.15 C 0.53,0.15 0.55,0.13 0.56,0.09 L 0.57,0.06 C 0.58,0.02 0.60,0 0.64,0 L 0.92,0 C 0.96,0 1.0,0.036 1.0,0.08 L 1.0,0.55 C 1.0,0.58 0.985,0.60 0.96,0.60 L 0.90,0.60 C 0.86,0.60 0.84,0.63 0.84,0.67 L 0.84,0.92 C 0.84,0.96 0.80,1.0 0.76,1.0 L 0.08,1.0 C 0.036,1.0 0,0.96 0,0.92 L 0,0.23 C 0,0.19 0.036,0.15 0.08,0.15 Z',

  // 3. Diagonal stepped silhouette (top-right step down, bottom-left step up)
  'sapient-stepped-diagonal':
    'M 0.08,0 L 0.55,0 C 0.60,0 0.62,0.03 0.63,0.08 L 0.64,0.12 C 0.65,0.17 0.68,0.20 0.73,0.20 L 0.92,0.20 C 0.96,0.20 1.0,0.24 1.0,0.28 L 1.0,0.92 C 1.0,0.96 0.96,1.0 0.92,1.0 L 0.45,1.0 C 0.40,1.0 0.38,0.97 0.37,0.92 L 0.36,0.88 C 0.35,0.83 0.32,0.80 0.27,0.80 L 0.08,0.80 C 0.036,0.80 0,0.76 0,0.72 L 0,0.08 C 0,0.036 0.036,0 0.08,0 Z',

  // 4. Wide banner format with smooth notched corners for full-width strips
  'sapient-wide-strip':
    'M 0.05,0 L 0.72,0 C 0.76,0 0.78,0.04 0.79,0.08 L 0.80,0.12 C 0.81,0.16 0.84,0.18 0.88,0.18 L 0.96,0.18 C 0.985,0.18 1.0,0.21 1.0,0.25 L 1.0,0.92 C 1.0,0.96 0.97,1.0 0.95,1.0 L 0.05,1.0 C 0.02,1.0 0,0.96 0,0.92 L 0,0.08 C 0,0.04 0.02,0 0.05,0 Z',

  // 5. Classic notch: Rounded rectangle with organic bottom-left cutout
  'sapient-notched-bl':
    'M 0.08,0 L 0.92,0 C 0.96,0 1.0,0.04 1.0,0.08 L 1.0,0.92 C 1.0,0.96 0.96,1.0 0.92,1.0 L 0.24,1.0 C 0.20,1.0 0.16,0.96 0.16,0.92 L 0.16,0.70 C 0.16,0.66 0.13,0.62 0.09,0.62 L 0.04,0.62 C 0.015,0.62 0,0.60 0,0.56 L 0,0.08 C 0,0.04 0.04,0 0.08,0 Z',
};

export function ShapedImageContainer({
  shape = 'sapient-tab-tl',
  src,
  alt,
  fill = true,
  priority = false,
  sizes = '(max-width: 1024px) 100vw, 50vw',
  aspectRatio = 'aspect-4/3',
  className = '',
  imageClassName = '',
  children,
}: ShapedImageContainerProps) {
  const rawId = useId();
  // Sanitize id for SVG element
  const clipId = `persici-shape-${shape}-${rawId.replace(/:/g, '')}`;
  const pathData = SHAPE_PATHS[shape] || SHAPE_PATHS['sapient-tab-tl'];

  return (
    <div className={`relative group/shaped ${className}`}>
      {/* Hidden SVG def containing normalized clipPath */}
      <svg
        width="0"
        height="0"
        className="absolute -top-9999px -left-9999px pointer-events-none opacity-0"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={pathData} />
          </clipPath>
        </defs>
      </svg>

      {/* Clipped Visual Container */}
      <div
        className={`relative w-full ${aspectRatio} overflow-hidden bg-slate-100 transition-transform duration-500 will-change-transform`}
        style={{
          clipPath: `url(#${clipId})`,
          WebkitClipPath: `url(#${clipId})`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes={sizes}
          className={`object-cover transition-transform duration-700 group-hover/shaped:scale-103 ${imageClassName}`}
        />
        {children}
      </div>
    </div>
  );
}
