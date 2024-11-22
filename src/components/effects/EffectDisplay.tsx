// src/components/effects/EffectDisplay.tsx

import { motion} from 'framer-motion';
import { memo } from 'react';
import { Position, PlacedCard, Effect,isFieldEffect, Card, WeaponEffect} from '@/types';
import { 
  getEffectStyle, 
  getEffectDetails, 
  calculateDistance,
  getDirection,
  getEffectRange
} from '@/utils/effects/index';
import { getClassIcon } from '@/utils/common';  // getClassDisplayNameを追加

// エフェクト表示用のパターンコンポーネント
export function EffectPattern({ type, color }: { type: string; color: string }) {
  const patternId = `pattern-${type}`;

  if (type === 'diamond') {
    return (
      <pattern 
        id="diamondPattern" 
        width="20" 
        height="20" 
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M10,0 L20,10 L10,20 L0,10 Z"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.3"
        />
      </pattern>
    );
  }
  
  return (
    <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
      <defs>
        {/* 縦線パターン */}
        <pattern 
          id={`${patternId}-vertical`} 
          width="8" 
          height="8" 
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M4,0 v8"
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
          />
        </pattern>

        {/* 横線パターン */}
        <pattern 
          id={`${patternId}-horizontal`} 
          width="8" 
          height="8" 
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0,4 h8"
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
          />
        </pattern>

        {/* 斜め線パターン */}
        <pattern 
          id={`${patternId}-diagonal`} 
          width="8" 
          height="8" 
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4"
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
          />
        </pattern>

        {/* ドットパターン */}
        <pattern 
          id={`${patternId}-dots`} 
          width="8" 
          height="8" 
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="4"
            cy="4"
            r="1"
            fill={color}
            opacity="0.3"
          />
        </pattern>

        {/* 波線パターン */}
        <pattern 
          id={`${patternId}-waves`} 
          width="16" 
          height="8" 
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0,4 q4,-4 8,0 t8,0"
            stroke={color}
            fill="none"
            strokeWidth="1"
            opacity="0.3"
          />
        </pattern>

        {/* クロスパターン */}
        <pattern 
          id={`${patternId}-cross`} 
          width="8" 
          height="8" 
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M4,0 v8 M0,4 h8"
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
          />
        </pattern>
      </defs>

      <rect 
        width="100%" 
        height="100%" 
        fill={`url(#${patternId}-${type})`} 
      />
    </svg>
  );
}

// 効果範囲表示用のオーバーレイコンポーネント
export function EffectRangeOverlay({ 
  card, 
  position,
}: { 
  card: PlacedCard;
  position: Position;
  board: (PlacedCard | null)[][];
}) {
  if (!card.card.effect) return null;

  const style = getEffectStyle(card.card.effect);
  const range = getEffectRange(card.card.effect, position);

  return (
    <>
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          backgroundColor: style.color,
          opacity: style.intensity * 0.2
        }}
      >
        <EffectPattern type={style.pattern} color={style.color} />
      </div>

      {range.map((pos, index) => (
        <motion.div
          key={`effect-${pos.row}-${pos.col}`}
          className="absolute rounded-lg pointer-events-none"
          style={{
            width: '100%',
            height: '100%',
            top: `${(pos.row - position.row) * 100}%`,
            left: `${(pos.col - position.col) * 100}%`,
            backgroundColor: style.color,
            opacity: 0
          }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.1
          }}
        />
      ))}
    </>
  );
}

// 効果ラインの表示コンポーネント
export function EffectLine({
  from,
  to,
  color,
  intensity = 0.3
}: {
  from: Position;
  to: Position;
  color: string;
  intensity?: number;
}) {
  const direction = getDirection(from, to);
  if (!direction) return null;

  const distance = calculateDistance(from, to);
  const angle = {
    vertical: 0,
    horizontal: 90,
    diagonal: 45
  }[direction];

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: distance * 100 + '%',
        height: '2px',
        backgroundColor: color,
        opacity: intensity,
        transformOrigin: 'left',
        transform: `rotate(${angle}deg)`,
        left: from.col * 100 + '%',
        top: from.row * 100 + '%'
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    />
  );
}

// 効果アイコン表示コンポーネント
export const EffectIcon = memo(({ effect, className = '' }: { effect: Effect; className?: string }) => {
  const style = getEffectStyle(effect);
  const details = getEffectDetails({ 
    id: 'temp',
    name: 'temp',
    type: 'ally',
    category: 'unit',
    points: 0,
    turn: 1,
    effect 
  } as Card);
  if (!details) return null;

  if (isFieldEffect(effect)) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ color: style.color }}
      >
        {effect.type === 'FIELD_UNIT_BUFF' ? '⬆️' : '⬇️'}
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ color: style.color }}
    >
      {details.effectType === 'weapon' && 
        ((effect as WeaponEffect).targetClass ? 
          getClassIcon((effect as WeaponEffect).targetClass) : 
          '🗡️')
      }
      {details.effectType === 'leader' && '👑'}
      {details.effectType === 'legendary' && '👑'}
      {details.effectType === 'boss' && '🐉'}
      {details.effectType === 'base' && {
        'BUFF': '⬆️',
        'DEBUFF': '⬇️',
        'DUAL': '↕️'
      }[details.type] || '✨'}
    </div>
  );
});


export const EffectDescription = memo(({ 
  effect,
  className = ''}: { 
  effect: Effect;
  className?: string;
  board?: (PlacedCard | null)[][] | null;
  position?: Position | null;
}) => {
  // 一時的なカードオブジェクトを作成
  const tempCard: Card = {
    id: `temp-${Date.now()}`,
    name: 'temporary',
    type: 'ally',
    category: 'unit',
    points: 0,
    turn: 1,
    effect
  };
  const details = getEffectDetails(tempCard);
  
  if (!details) return <span className={className}>効果なし</span>;


  // その他の効果の説明
  return (
    <div className={`${className}`}>
      <div className="text-gray-300 text-xs mt-1">
        {details.description}
      </div>
    </div>
  );
});

EffectIcon.displayName = 'EffectIcon';
EffectDescription.displayName = 'EffectDescription';