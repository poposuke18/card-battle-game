// src/components/board/effect-patterns.tsx
import { FC } from 'react';

type PatternProps = {
  className?: string;
  color?: string;
};

export const VerticalPattern: FC<PatternProps> = ({ className = '', color = 'currentColor' }) => (
  <svg width="100%" height="100%" className={`absolute inset-0 pointer-events-none ${className}`}>
    <pattern id="verticalPattern" width="8" height="8" patternUnits="userSpaceOnUse">
      <path
        d="M4,0 v8"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
      />
    </pattern>
    <rect width="100%" height="100%" fill="url(#verticalPattern)" />
  </svg>
);

export const DiagonalPattern: FC<PatternProps> = ({ className = '', color = 'currentColor' }) => (
  <svg width="100%" height="100%" className={`absolute inset-0 pointer-events-none ${className}`}>
    <pattern id="diagonalPattern" width="8" height="8" patternUnits="userSpaceOnUse">
      <path
        d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
      />
    </pattern>
    <rect width="100%" height="100%" fill="url(#diagonalPattern)" />
  </svg>
);

export const AdjacentPattern: FC<PatternProps> = ({ className = '', color = 'currentColor' }) => (
  <svg width="100%" height="100%" className={`absolute inset-0 pointer-events-none ${className}`}>
    <pattern id="adjacentPattern" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle
        cx="5"
        cy="5"
        r="2"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
      />
    </pattern>
    <rect width="100%" height="100%" fill="url(#adjacentPattern)" />
  </svg>
);

export const AreaPattern: FC<PatternProps> = ({ className = '', color = 'currentColor' }) => (
  <svg width="100%" height="100%" className={`absolute inset-0 pointer-events-none ${className}`}>
    <pattern id="areaPattern" width="16" height="16" patternUnits="userSpaceOnUse">
      <path
        d="M0,0 h16 v16 h-16 z M4,4 h8 v8 h-8 z"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
      />
    </pattern>
    <rect width="100%" height="100%" fill="url(#areaPattern)" />
  </svg>
);

export const LeaderPattern: FC<PatternProps> = ({ className = '', color = 'currentColor' }) => (
  <svg width="100%" height="100%" className={`absolute inset-0 pointer-events-none ${className}`}>
    <pattern id="leaderPattern" width="20" height="20" patternUnits="userSpaceOnUse">
      <path
        d="M10,0 L20,10 L10,20 L0,10 Z"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.4"
      />
      <circle
        cx="10"
        cy="10"
        r="4"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.4"
      />
    </pattern>
    <rect width="100%" height="100%" fill="url(#leaderPattern)" />
  </svg>
);

// 効果タイプに応じたパターンを返す関数
export function getEffectPattern(effectType: string, className?: string, color?: string) {
  switch (effectType) {
    case 'ADJACENT_VERTICAL_BOOST':
      return <VerticalPattern className={className} color={color} />;
    case 'DIAGONAL_DEBUFF':
      return <DiagonalPattern className={className} color={color} />;
    case 'ADJACENT_UNIT_BUFF':
    case 'SELF_POWER_UP_BY_ADJACENT_ALLY':
      return <AdjacentPattern className={className} color={color} />;
    case 'FIELD_DUAL_EFFECT':
      return <AreaPattern className={className} color={color} />;
    case 'LEADER_DIAGONAL_EFFECT':
      return (
        <>
          <DiagonalPattern className={className} color={color} />
          <LeaderPattern className={className} color={color} />
        </>
      );
    case 'LEADER_GUARDIAN_BOOST':
      return (
        <>
          <AdjacentPattern className={className} color={color} />
          <LeaderPattern className={className} color={color} />
        </>
      );
    case 'LEADER_LANCER_BOOST':
      return (
        <>
          <VerticalPattern className={`rotate-90 ${className}`} color={color} />
          <LeaderPattern className={className} color={color} />
        </>
      );
    case 'LEADER_MAGE_EFFECT':
      return (
        <>
          <AreaPattern className={className} color={color} />
          <LeaderPattern className={className} color={color} />
        </>
      );
    default:
      return null;
  }
}

// コンポーネントとしてのEffectPattern
type EffectPatternProps = {
  type: string;
  className?: string;
  color?: string;
};

export const EffectPattern: FC<EffectPatternProps> = ({ type, className, color }) => {
  return getEffectPattern(type, className, color);
};