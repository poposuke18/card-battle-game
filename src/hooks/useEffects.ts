// src/hooks/useEffects.ts

import { useState, useCallback, useMemo } from 'react';
import type { 
  Position, 
  PlacedCard, 
  Effect, 
  EffectResult 
} from '@/types';
import { 
  calculateEffectValue,
  getEffectRange,
  getEffectStyle
} from '@/utils/effects/index';

export function useEffects(board: (PlacedCard | null)[][]) {
  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);

  // 効果範囲の計算
  const effectRange = useMemo(() => {
    if (!hoveredPosition) return [];
    const card = board[hoveredPosition.row][hoveredPosition.col];
    if (!card?.card.effect) return [];
    
    return getEffectRange(hoveredPosition, card.card.effect);
  }, [hoveredPosition, board]);

  // 効果の計算
  const calculateEffect = useCallback((
    sourcePosition: Position,
    targetPosition: Position,
    effect: Effect
  ): EffectResult => {
    const sourceCard = board[sourcePosition.row][sourcePosition.col];
    const targetCard = board[targetPosition.row][targetPosition.col];
    
    if (!sourceCard || !targetCard) {
      return { value: 0, type: 'buff', description: '', affected: [] };
    }

    return calculateEffectValue({
      sourcePosition,
      targetPosition,
      sourceCard: sourceCard.card,
      targetCard,
      board
    }, effect);
  }, [board]);

  // 効果の視覚的スタイルの取得
  const getEffectVisualStyle = useCallback((effect: Effect) => {
    return getEffectStyle(effect);
  }, []);

  // 効果の適用範囲内かどうかの判定
  const isInEffectRange = useCallback((
    position: Position
  ): boolean => {
    return effectRange.some(pos => 
      pos.row === position.row && pos.col === position.col
    );
  }, [effectRange]);

  return {
    hoveredPosition,
    setHoveredPosition,
    effectRange,
    calculateEffect,
    getEffectVisualStyle,
    isInEffectRange
  };
}