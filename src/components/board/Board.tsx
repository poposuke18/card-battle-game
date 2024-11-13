import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlacedCard, Card, Position } from '@/types';
import { calculateCardScore } from '@/utils/score/calculator';
import { CardDetails } from './CardDetails';
import { getWeaponEffectPositions, getBaseEffectPositions } from '@/utils/effect-utils';
import { AnimatedScore } from '../score/AnimatedScore';
import { getClassIcon } from '@/utils/common';  // この行を追加


type BoardProps = {
  board: (PlacedCard | null)[][];
  selectedCard: Card | null;
  onPlaceCard: (position: Position) => void;
};

export default function Board({ board, selectedCard, onPlaceCard, onHoverCard }: BoardProps) {
  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);
  const [affectedPositions, setAffectedPositions] = useState<Position[]>([]);
  const [previousScores, setPreviousScores] = useState<Map<string, number>>(new Map());
  const [hoveredCard, setHoveredCard] = useState<{
    card: PlacedCard;
    position: Position;
  } | null>(null);

  // キャッシュされたスコアマップを計算
  const currentScores = useMemo(() => {
    const scoreMap = new Map<string, number>();
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          const position = `${rowIndex}-${colIndex}`;
          const scoreDetails = calculateCardScore(
            { row: rowIndex, col: colIndex },
            board,
            cell
          );
          scoreMap.set(position, scoreDetails.totalPoints);
        }
      });
    });
    return scoreMap;
  }, [board]);

  const effectRangeHighlight = useMemo(() => {
    if (!hoveredPosition) return null;
    
    const hoveredCard = board[hoveredPosition.row][hoveredPosition.col];
    if (!hoveredCard?.card.effect) return null;

    if ('targetClass' in hoveredCard.card.effect) {
      return getWeaponEffectPositions(hoveredPosition, hoveredCard, board);
    } else {
      return getBaseEffectPositions(hoveredPosition, hoveredCard, board);
    }
  }, [hoveredPosition, board]);

  // ボードの更新を処理
  useEffect(() => {
    const newScores = new Map(currentScores);
    const changed: Position[] = [];

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          const position = `${rowIndex}-${colIndex}`;
          const prevScore = previousScores.get(position);
          const currentScore = newScores.get(position);
          
          if (prevScore !== undefined && 
              currentScore !== undefined && 
              prevScore !== currentScore) {
            changed.push({ row: rowIndex, col: colIndex });
          }
        }
      });
    });

    if (changed.length > 0) {
      setAffectedPositions(changed);
      setPreviousScores(newScores);

      const timer = setTimeout(() => {
        setAffectedPositions([]);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setPreviousScores(newScores);
    }
  }, [board, currentScores]);

  return (
    <div className="relative">
      {/* カード詳細の表示位置を変更 */}
    <div className="max-w-[400px] mx-auto grid grid-cols-5 gap-1 p-3 
                    bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-inner">
        {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
          const positionKey = `${rowIndex}-${colIndex}`;
          const currentScore = currentScores.get(positionKey) ?? 0;
          const previousScore = previousScores.get(positionKey) ?? currentScore;
          const isAffected = affectedPositions.some(
            pos => pos.row === rowIndex && pos.col === colIndex
          );

          const isHovered = hoveredPosition?.row === rowIndex && 
                           hoveredPosition?.col === colIndex;
                           
          // エフェクト範囲のハイライト判定をここに追加
          const isInEffectRange = effectRangeHighlight?.some(
            pos => pos.row === rowIndex && pos.col === colIndex
          );

          // カードの効果タイプに基づいてハイライトの色を決定
          const hoveredCard = hoveredPosition 
            ? board[hoveredPosition.row][hoveredPosition.col] 
            : null;
            
          const effectHighlightClass = isInEffectRange
            ? hoveredCard?.card.type === 'ally'
              ? 'ring-2 ring-blue-400/30'
              : 'ring-2 ring-red-400/30'
            : '';

          return (
            <motion.div
                key={`${rowIndex}-${colIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (rowIndex * 5 + colIndex) * 0.05 }}
              className={`aspect-square bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 
                         rounded-lg p-1 flex items-center justify-center cursor-pointer 
                         hover:bg-gray-600/50 relative transition-all duration-200
                         ${selectedCard && !cell ? 'hover:border-yellow-400/50 hover:bg-gray-600/70' : ''}
                         ${cell ? 'shadow-md' : 'hover:shadow-lg'}
                         ${effectHighlightClass}`}
              whileHover={!cell ? { scale: 1.05 } : {}}
              onClick={() => onPlaceCard(position)}
              onMouseEnter={() => {
                setHoveredPosition(position);
                if (cell) {
                  onHoverCard({ card: cell, position });
                }
              }}
              onMouseLeave={() => {
                setHoveredPosition(null);
                onHoverCard(null);
              }}
            >
                              <AnimatePresence>
                                {cell && (
                                  // src/components/Board.tsx の該当部分を修正

<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  exit={{ scale: 0 }}
  className={`w-full h-full rounded flex items-center justify-center flex-col relative
    ${cell.card.type === 'ally' 
      ? 'bg-blue-500/90 text-white ring-1 ring-blue-400/50' 
      : 'bg-red-500/90 text-white ring-1 ring-red-400/50'}`}
>
  {/* カテゴリーアイコンを追加 */}
  <div className="absolute top-1 left-1 text-xs opacity-70">
    {cell.card.category === 'unit' && cell.card.class && getClassIcon(cell.card.class)}
    {cell.card.category === 'weapon' && '⚔️'}
    {cell.card.category === 'field' && '🏰'}
    {cell.card.category === 'support' && '📜'}
  </div>
  
  <span className="font-medium text-[10px] mb-0.5 opacity-90">
    {cell.card.name}
  </span>
  <AnimatedScore
    score={currentScore}
    isAffected={isAffected}
    previousScore={previousScore}
  />
  
</motion.div>
                                )}
                              </AnimatePresence>
                  
                              {selectedCard && !cell && (
                                <motion.div
                                  className="absolute inset-0 border-2 border-yellow-400/50 rounded-lg"
                                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                />
                              )}
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                    </div>

                  );
}