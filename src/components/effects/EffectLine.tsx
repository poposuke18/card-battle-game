// src/components/effects/EffectLine.tsx

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Position } from '@/types';

export type EffectLineProps = {
  from: Position;
  to: Position;
  color: string;
  intensity?: number;
  thickness?: number;
  animated?: boolean;
};

export const EffectLine = memo(({
  from,
  to,
  color,
  intensity = 0.3,
  thickness = 2,
  animated = true
}: EffectLineProps) => {
  // 2点間の角度を計算
  const angle = Math.atan2(
    to.row - from.row,
    to.col - from.col
  ) * 180 / Math.PI;

  // 距離を計算
  const distance = Math.sqrt(
    Math.pow(to.row - from.row, 2) + 
    Math.pow(to.col - from.col, 2)
  ) * 100; // 100%単位に変換

  const lineElement = (
    <div
      className="absolute pointer-events-none"
      style={{
        width: `${distance}%`,
        height: `${thickness}px`,
        backgroundColor: color,
        opacity: intensity,
        transformOrigin: 'left',
        transform: `rotate(${angle}deg)`,
        left: `${from.col * 100}%`,
        top: `${from.row * 100}%`
      }}
    />
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        {lineElement}
      </motion.div>
    );
  }

  return lineElement;
});

EffectLine.displayName = 'EffectLine';