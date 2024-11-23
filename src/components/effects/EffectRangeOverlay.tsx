// src/components/effects/EffectRangeOverlay.tsx

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { PlacedCard, Position } from '@/types';
import { getEffectStyle, } from '@/utils/effects/index';

export type EffectRangeOverlayProps = {
  card: PlacedCard;
  position: Position;
  board?: (PlacedCard | null)[][];
};

export const EffectRangeOverlay = memo(({
  card,
}: EffectRangeOverlayProps) => {
  if (!card.card.effect) return null;

  const style = getEffectStyle(card.card.effect);
  const { color, intensity, pattern } = style;

  // エフェクトの種類に応じたパターンのSVG定義
  const getPatternSvg = () => {
    switch (pattern) {
      case 'VERTICAL':
        return (
          <pattern 
            id="verticalPattern" 
            width="8" 
            height="8" 
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M4,0 v8"
              stroke={color}
              strokeWidth="1"
              opacity={intensity * 0.5}
            />
          </pattern>
        );
      case 'HORIZONTAL':
        return (
          <pattern 
            id="horizontalPattern" 
            width="8" 
            height="8" 
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,4 h8"
              stroke={color}
              strokeWidth="1"
              opacity={intensity * 0.5}
            />
          </pattern>
        );
      case 'DIAGONAL':
        return (
          <pattern 
            id="diagonalPattern" 
            width="8" 
            height="8" 
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4"
              stroke={color}
              strokeWidth="1"
              opacity={intensity * 0.5}
            />
          </pattern>
        );
      case 'CROSS':
        return (
          <pattern 
            id="crossPattern" 
            width="8" 
            height="8" 
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M4,0 v8 M0,4 h8"
              stroke={color}
              strokeWidth="1"
              opacity={intensity * 0.5}
            />
          </pattern>
        );
      default:
        return (
          <pattern 
            id="defaultPattern" 
            width="8" 
            height="8" 
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="4"
              cy="4"
              r="2"
              fill={color}
              opacity={intensity * 0.3}
            />
          </pattern>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}  // z-indexを追加
    >
      {/* ベースの効果範囲表示 */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundColor: color,
          opacity: intensity * 0.1
        }}
      />

      {/* パターン表示 */}
      <svg 
        width="100%" 
        height="100%" 
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          {getPatternSvg()}
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${pattern}Pattern)`}
          className="rounded-lg"
        />
      </svg>

    </motion.div>
  );
});

EffectRangeOverlay.displayName = 'EffectRangeOverlay';