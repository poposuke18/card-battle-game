// src/components/board/PlacedCardContent.tsx

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { PlacedCard, Position } from '@/types';
import { EffectIcon } from '../effects/EffectDisplay';
import { EffectRangeOverlay } from '../effects/EffectRangeOverlay';
import { getClassIcon } from '@/utils/common';
import { calculateCardScore } from '@/utils/score/calculator';

type PlacedCardContentProps = {
  cell: PlacedCard;
  position: Position;
  isSelected: boolean;
  isHovered: boolean;
  board: (PlacedCard | null)[][];
  score?: number;
};


export const PlacedCardContent = memo(({
  cell,
  position,
  isSelected,
  isHovered,
  board,
  score
}: PlacedCardContentProps) => {
  const cardTypeStyle = cell.card.type === 'ally'
    ? 'bg-blue-500/90 text-white ring-1 ring-blue-400/50'
    : 'bg-red-500/90 text-white ring-1 ring-red-400/50';

  // カードのスコアを計算
  const scoreDetails = useMemo(() => {
    return calculateCardScore(position, board, cell);
  }, [position, board, cell]);

  const scoreDiff = scoreDetails ? scoreDetails.totalPoints - cell.card.points : 0;
  const hasEffects = scoreDiff !== 0;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={`
        w-full h-full rounded flex flex-col relative ${cardTypeStyle}
        p-1 text-xs
      `}
    >
      {/* 伝説/ボスカードの特別な輝きエフェクト */}
      {cell.card.effect?.type.startsWith('LEGENDARY_') && (
        <motion.div
          className="absolute inset-0 rounded pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 10px rgba(255, 215, 0, 0.3)',
              '0 0 20px rgba(255, 215, 0, 0.5)',
              '0 0 10px rgba(255, 215, 0, 0.3)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* ボスカードの赤い輝きエフェクト */}
      {cell.card.effect?.type.startsWith('BOSS_') && (
        <motion.div
          className="absolute inset-0 rounded pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 10px rgba(255, 0, 0, 0.3)',
              '0 0 20px rgba(255, 0, 0, 0.5)',
              '0 0 10px rgba(255, 0, 0, 0.3)'
            ]
          }}
          transition={{
            duration: 1.5, // ボスはより速いアニメーション
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* アイコンヘッダー部分 */}
      <div className="flex justify-between items-start w-full mb-0.5">
        <div className="text-[11px] opacity-70">
          {cell.card.category === 'unit' && cell.card.class && getClassIcon(cell.card.class)}
          {cell.card.category === 'weapon' && '🗡️'}
          {cell.card.category === 'field' && '🏰'}
          {cell.card.category === 'support' && '📜'}
          {/* 伝説/ボスカードの特別なアイコン */}
          {cell.card.effect?.type.startsWith('LEGENDARY_') && (
            <span className="ml-1 text-yellow-300">👑</span>
          )}
          
        </div>
        {cell.card.effect && (
          <div className="text-[9px]">
            <EffectIcon effect={cell.card.effect} />
          </div>
        )}
      </div>

      {/* カード名 */}
      <div className={`
        font-medium text-[9px] text-center mb-1 line-clamp-1 flex-grow
        ${cell.card.effect?.type.startsWith('LEGENDARY_') ? 'text-yellow-200' : ''}
        ${cell.card.effect?.type.startsWith('BOSS_') ? 'text-red-200' : ''}
      `}>
        {cell.card.name}
      </div>

      {/* スコア表示 */}
      <div className="text-center">
        <span className={`
          font-bold text-[12px] 
          ${hasEffects ? scoreDiff > 0 ? 'text-yellow-300' : 'text-red-300' : ''}
          ${cell.card.effect?.type.startsWith('LEGENDARY_') ? 'text-yellow-200' : ''}
          ${cell.card.effect?.type.startsWith('BOSS_') ? 'text-red-200' : ''}
        `}>
          {scoreDetails ? scoreDetails.totalPoints : cell.card.points}
        </span>
        {hasEffects && (
          <span className={`text-[10px] ml-0.5 ${scoreDiff > 0 ? 'text-green-300' : 'text-red-300'}`}>
            {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}
          </span>
        )}
      </div>

      {/* エフェクト範囲の表示 */}
      {isHovered && cell.card.effect && (
        <EffectRangeOverlay
          card={cell}
          position={position}
          board={board}
        />
      )}
    </motion.div>
  );
});

PlacedCardContent.displayName = 'PlacedCardContent';