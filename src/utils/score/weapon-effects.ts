import { Position, PlacedCard, Card, WeaponEffect } from '@/types';
import { getAdjacentCards } from '@/utils/board';

export function calculateWeaponEffect(
  sourcePosition: Position,
  targetPosition: Position,
  sourceCard: Card,
  targetCard: PlacedCard,
  effect: WeaponEffect,
  board: (PlacedCard | null)[][]
): number {
  // 基本的な条件チェック
  if (
    sourceCard.type !== targetCard.card.type || 
    targetCard.card.class !== effect.targetClass || 
    targetCard.card.category !== 'unit'
  ) {
    return 0;
  }

  const rowDiff = Math.abs(sourcePosition.row - targetPosition.row);
  const colDiff = Math.abs(sourcePosition.col - targetPosition.col);
  let effectValue = 0;

  // 基本の効果値を計算
  switch (effect.type) {
    case 'VERTICAL_BOOST':
      effectValue = (rowDiff === 1 && colDiff === 0) ? effect.power : 0;
      break;
    case 'HORIZONTAL_BOOST':
      effectValue = (rowDiff === 0 && colDiff === 1) ? effect.power : 0;
      break;
    case 'DIAGONAL_BOOST':
      effectValue = (rowDiff === 1 && colDiff === 1) ? effect.power : 0;
      break;
    case 'CROSS_FORMATION':
      effectValue = ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) ? effect.power : 0;
      break;
    case 'SURROUND_BOOST':
      // ... existing surround boost logic ...
      break;
  }

  if (effectValue === 0) return 0;

  // 武器強化効果の適用
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell || !cell.card.effect) return;
      
      // 武器職人/武器匠の効果をチェック
      if (cell.card.effect.type === 'WEAPON_ENHANCEMENT') {
        const enhancerPosition = { row: rowIndex, col: colIndex };
        const distanceToEnhancer = Math.abs(sourcePosition.row - rowIndex) + 
                                 Math.abs(sourcePosition.col - colIndex);
        
        // 範囲内にいて、同じ陣営の武器職人/武器匠なら効果を適用
        if (distanceToEnhancer <= (cell.card.effect.range || 1) && 
            cell.card.type === sourceCard.type) {
          effectValue *= cell.card.effect.effectMultiplier || 1;
        }
      }
    });
  });

  return effectValue;
}