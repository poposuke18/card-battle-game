// src/components/board/Board.tsx

import React, { memo, useMemo, useCallback, useState } from 'react';  // useState を追加
import { motion, AnimatePresence } from 'framer-motion';
import { PlacedCardContent } from './PlacedCardContent';
import { calculateCardScore } from '@/utils/score/calculator';  // この行を追加
import { PreviewContent } from './PreviewContent';
import { getEffectRange } from '@/utils/effects/index';
import type { Position, PlacedCard, Card } from '@/types';
import type { BoardProps } from './types';

type BoardCellProps = {
  position: Position;
  cell: PlacedCard | null;
  isSelected: boolean;
  isHovered: boolean;
  isInEffectRange: boolean;
  onCellClick: () => void;
  onCellHover: () => void;
  onCellLeave: () => void;
  selectedCard: Card | null;
  previewScore: number | null;
  board: (PlacedCard | null)[][];
};

// 個別のセルコンポーネント
const BoardCell = memo(({
  position,
  cell,
  isSelected,
  isHovered,
  isInEffectRange,
  onCellClick,
  onCellHover,
  onCellLeave,
  selectedCard,  // selectedCardをpropsから受け取る
  previewScore,
  board
}: BoardCellProps) => {
  const calculatedScore = useMemo(() => {
    if (!cell) return null;
    return calculateCardScore(position, board, cell);
  }, [position, board, cell]);

  // セルのクラス名を定義
  const cellClassNames = useMemo(() => {
    return [
      'aspect-square',
      'w-full',
      'h-full',
      'bg-gray-700/50',
      'backdrop-blur-sm',
      'border',
      'border-gray-600/50',
      'rounded-lg',
      'p-0.5',
      'flex',
      'items-center',
      'justify-center',
      'cursor-pointer',
      'hover:bg-gray-600/50',
      'relative',
      'transition-all',
      'duration-200',
      selectedCard && !cell ? 'hover:border-yellow-400/50 hover:bg-gray-600/70' : '',
      cell ? 'shadow-md' : 'hover:shadow-lg',
      isInEffectRange ? 'ring-2 ring-blue-400/30 bg-blue-500/10' : '',
    ].filter(Boolean).join(' ');
  }, [selectedCard, cell, isInEffectRange]);  // selectedCardを依存配列に含める

  return (
    <motion.div
      className={cellClassNames}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        delay: (position.row * 5 + position.col) * 0.05,
        duration: 0.2
      }}
      whileHover={!cell ? { scale: 1.05 } : undefined}
      onClick={onCellClick}
      onMouseEnter={onCellHover}
      onMouseLeave={onCellLeave}
    >
      <AnimatePresence mode="wait">
        {cell ? (
          <PlacedCardContent
            cell={cell}
            position={position}
            isSelected={isSelected}
            isHovered={isHovered}
            board={board}
            score={calculatedScore?.totalPoints}
          />
        ) : selectedCard && isHovered ? (
          <PreviewContent
            card={selectedCard}
            previewScore={previewScore}
          />
        ) : null}
      </AnimatePresence>

      {selectedCard && !cell && (
        <AvailableSlotIndicator />
      )}
    </motion.div>
  );
});
BoardCell.displayName = 'BoardCell';



// 配置可能スロットの表示
const AvailableSlotIndicator = memo(() => {
  return (
    <motion.div
      className="absolute inset-0 border-2 border-yellow-400/50 rounded-lg"
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
});
AvailableSlotIndicator.displayName = 'AvailableSlotIndicator';


// メインのボードコンポーネント
export const Board = memo(({
  board,
  selectedCard,
  onPlaceCard,
  onHoverCard
}: BoardProps) => {
  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);
  
  // 効果範囲の計算
  const effectRange = useMemo(() => {
    if (!hoveredPosition) return [];
    
    const cell = board[hoveredPosition.row][hoveredPosition.col];
    if (!cell?.card.effect) return [];
    
    // getEffectRange を使用して効果範囲を計算
    return getEffectRange(cell.card.effect, hoveredPosition);

  }, [hoveredPosition, board]);

  // プレビュースコアの計算
  const calculatePreviewScore = useCallback((position: Position) => {
    if (!selectedCard) return null;

    // 仮想的なボードの状態を作成
    const virtualBoard = board.map(row => [...row]);
    virtualBoard[position.row][position.col] = {
      card: selectedCard,
      position: position
    };

    // 新しい位置でのスコアを計算
    const scoreDetails = calculateCardScore(
      position,
      virtualBoard,
      { card: selectedCard, position }
    );

    // 基礎点からの変化量を返す
    return scoreDetails.totalPoints - selectedCard.points;
  }, [selectedCard, board]);

  // セルクリックのハンドラー
  const handleCellClick = useCallback((position: Position) => {
    if (selectedCard && !board[position.row][position.col]) {
      onPlaceCard(position);
    }
  }, [selectedCard, board, onPlaceCard]);

  // セルホバーのハンドラー
  const handleCellHover = useCallback((position: Position) => {
    setHoveredPosition(position);
    const cell = board[position.row][position.col];
    if (cell) {
      onHoverCard({ card: cell, position });
    }
  }, [board, onHoverCard]);

  // セルホバー解除のハンドラー
  const handleCellLeave = useCallback(() => {
    setHoveredPosition(null);
    onHoverCard(null);
  }, [onHoverCard]);

  return (
    <div className="relative">
      <div className="max-w-[500px] mx-auto grid grid-cols-5 gap-1 p-4 
        bg-gradient-to-br from-gray-800 to-gray-900 
        rounded-xl shadow-inner relative z-10"
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            const isHovered = hoveredPosition?.row === rowIndex && 
                            hoveredPosition?.col === colIndex;
            const isInEffectRange = effectRange.some(pos => 
              pos.row === rowIndex && pos.col === colIndex
            );

            return (
              <BoardCell
                key={`${rowIndex}-${colIndex}`}
                position={position}
                cell={cell}
                isSelected={false}
                isHovered={isHovered}
                isInEffectRange={isInEffectRange}
                onCellClick={() => handleCellClick(position)}
                onCellHover={() => handleCellHover(position)}
                onCellLeave={handleCellLeave}
                selectedCard={selectedCard}
                previewScore={isHovered ? calculatePreviewScore(position) : null}
                board={board}
              />
            );
          })
        )}
      </div>
    </div>
  );
});

Board.displayName = 'Board';