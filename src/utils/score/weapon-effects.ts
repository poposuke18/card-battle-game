import { Position, PlacedCard, Card, WeaponEffect } from '@/types';

// 武器効果増幅係数を計算する関数を追加
export function getWeaponEffectMultiplier(
  sourcePosition: Position,
  board: (PlacedCard | null)[][]
): number {
  let multiplier = 1; // デフォルトは1倍

  // 周囲の武器職人の効果を確認
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell?.card.effect) return;
      
      if (cell.card.effect.type === 'WEAPON_ENHANCEMENT') {
        const distance = Math.abs(sourcePosition.row - rowIndex) + 
                        Math.abs(sourcePosition.col - colIndex);
        
        if (distance <= (cell.card.effect.range || 1)) {
          // 武器職人の倍率を適用
          multiplier = cell.card.effect.effectMultiplier || 2;
        }
      }
    });
  });

  // デバッグログ
  console.log('Weapon multiplier:', {
    position: sourcePosition,
    multiplier
  });

  return multiplier;
}

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
  
  // 基本効果値を計算
  let effectValue = 0;
  
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
  }

  // 効果がない場合は0を返す
  if (effectValue === 0) return 0;

  // 武器職人の効果を適用
  const multiplier = getWeaponEffectMultiplier(sourcePosition, board);

  // デバッグログ
  console.log('Weapon effect calculation:', {
    sourceCard: sourceCard.name,
    targetCard: targetCard.card.name,
    baseEffect: effectValue,
    multiplier,
    finalEffect: effectValue * multiplier
  });

  return effectValue * multiplier;  // 武器職人の効果を適用
}