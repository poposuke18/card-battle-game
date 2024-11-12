// src/components/board/EffectPatterns.tsx
import { FC } from 'react';

type PatternProps = {
  className?: string;
};

export const DiagonalPattern: FC<PatternProps> = ({ className = '' }) => (
  <svg width="100%" height="100%" className={`absolute inset-0 pointer-events-none ${className}`}>
    <pattern id="diagonalPattern" width="8" height="8" patternUnits="userSpaceOnUse">
      <path
        d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
    </pattern>
    <rect width="100%" height="100%" fill="url(#diagonalPattern)" />
  </svg>
);

export const CrossPattern: FC<PatternProps> = ({ className = '' }) => (
  <svg width="100%" height="100%" className={`absolute inset-0 pointer-events-none ${className}`}>
    <pattern id="crossPattern" width="8" height="8" patternUnits="userSpaceOnUse">
      <path
        d="M4,0 v8 M0,4 h8"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
    </pattern>
    <rect width="100%" height="100%" fill="url(#crossPattern)" />
  </svg>
);

export const VerticalPattern: FC<PatternProps> = ({ className = '' }) => (
  <svg width="100%" height="100%" className={`absolute inset-0 pointer-events-none ${className}`}>
    <pattern id="verticalPattern" width="8" height="8" patternUnits="userSpaceOnUse">
      <path
        d="M4,0 v8"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
    </pattern>
    <rect width="100%" height="100%" fill="url(#verticalPattern)" />
  </svg>
);

export const HorizontalPattern: FC<PatternProps> = ({ className = '' }) => (
  <svg width="100%" height="100%" className={`absolute inset-0 pointer-events-none ${className}`}>
    <pattern id="horizontalPattern" width="8" height="8" patternUnits="userSpaceOnUse">
      <path
        d="M0,4 h8"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
    </pattern>
    <rect width="100%" height="100%" fill="url(#horizontalPattern)" />
  </svg>
);