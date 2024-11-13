import type { Position, PlacedCard, Card, BaseEffect } from '@/types';
import { getAdjacentCards, checkEnemyLine } from '@/utils/board';

export function getSupportEffectMultiplier(
  sourcePosition: Position,
  board: (PlacedCard | null)[][]
): number {
  let multiplier = 1;

  // 周囲のリーダー効果を確認（戦術の大師など）
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell?.card.effect || !('type' in cell.card.effect)) return;
      
      if (cell.card.effect.type === 'LEADER_TACTICAL' && cell.card.effect.supportMultiplier) {
        const distance = Math.max(
          Math.abs(sourcePosition.row - rowIndex),
          Math.abs(sourcePosition.col - colIndex)
        );
        
        if (distance <= (cell.card.effect.range || 2)) {
          multiplier *= cell.card.effect.supportMultiplier;
        }
      }
    });
  });

  return multiplier;
}

export function calculateBaseEffect(
  sourcePosition: Position,
  targetPosition: Position,
  sourceCard: Card,
  targetCard: PlacedCard,
  effect: BaseEffect,
  board: (PlacedCard | null)[][]
): number {
  // 自分自身に対する効果の場合
  const isSelfTarget = sourcePosition.row === targetPosition.row && 
                      sourcePosition.col === targetPosition.col;

  // デバッグ用のログ出力
  if (isSelfTarget && effect.type === 'SELF_POWER_UP_BY_ENEMY_LINE') {
    console.log('槍兵効果チェック:', {
      position: sourcePosition,
      hasEnemyLine: checkEnemyLine(sourcePosition, board, 'horizontal'),
      board: board.map(row => 
        row.map(cell => 
          cell ? `${cell.card.name}(${cell.card.type})` : null
        )
      )
    });
  }

  // 自己強化系の効果
  if (isSelfTarget) {
    switch (effect.type) {
      case 'SELF_POWER_UP_BY_ENEMY_LINE': {
        // 横方向のみをチェックするように修正
        const hasEnemyLine = checkEnemyLine(sourcePosition, board, 'horizontal');
        if (hasEnemyLine) {
          return effect.power || 0;
        }
        return 0;  // breakを削除し、明示的にreturnする
      }

      case 'SELF_POWER_UP_BY_ADJACENT_ALLY': {
        const adjacentAllies = getAdjacentCards(sourcePosition, board)
          .filter(adj => adj.card.type === sourceCard.type && adj.card.category === 'unit');
        return adjacentAllies.length * (effect.power || 0);
      }
    }
  }

  let effectValue = 0;


  // その他の効果
  switch (effect.type) {
    case 'ADJACENT_UNIT_BUFF':
    case 'ADJACENT_UNIT_DEBUFF': {
      const distance = Math.abs(sourcePosition.row - targetPosition.row) + 
                      Math.abs(sourcePosition.col - targetPosition.col);
                      
      if (distance === 1 && targetCard.card.category === 'unit') {
        if (effect.type === 'ADJACENT_UNIT_BUFF' && 
            sourceCard.type === targetCard.card.type) {
          return effect.power;
        } else if (effect.type === 'ADJACENT_UNIT_DEBUFF') {
          return -effect.power;
        }
      }
      break;
    }

    case 'FIELD_UNIT_BUFF':
    case 'FIELD_UNIT_DEBUFF': {
      const distance = Math.max(
        Math.abs(sourcePosition.row - targetPosition.row),
        Math.abs(sourcePosition.col - targetPosition.col)
      );

      if (distance <= (effect.range || 1) && targetCard.card.category === 'unit') {
        if (effect.type === 'FIELD_UNIT_BUFF' && 
            sourceCard.type === targetCard.card.type) {
          return effect.power;
        } else if (effect.type === 'FIELD_UNIT_DEBUFF') {
          return -effect.power;
        }
      }
      break;
    }

    // 5ターン目の新しい効果
    case 'FIELD_CLASS_POWER_UP': {
      if (!effect.classEffects || !targetCard.card.class) return 0;
      
      const distance = Math.max(
        Math.abs(sourcePosition.row - targetPosition.row),
        Math.abs(sourcePosition.col - targetPosition.col)
      );
      
      if (distance <= (effect.range || 2)) {
        const classEffect = effect.classEffects.find(ce => ce.class === targetCard.card.class);
        if (classEffect && sourceCard.type === targetCard.card.type) {
          return classEffect.power;
        }
      }
      break;
    }

    case 'ROW_COLUMN_BUFF': {
      if (targetCard.card.category !== 'unit') return 0;  // ユニットのみに効果
      
      if (effect.targetDirection === 'vertical') {
        if (sourcePosition.col === targetPosition.col && 
            sourceCard.type === targetCard.card.type) {
          effectValue = effect.power || 0;
        }
      } else {
        if (sourcePosition.row === targetPosition.row && 
            sourceCard.type === targetCard.card.type) {
          effectValue = effect.power || 0;
        }
      }
      
      // サポートカードの効果倍率を適用
      if (sourceCard.category === 'support') {
        const multiplier = getSupportEffectMultiplier(sourcePosition, board);
        effectValue *= multiplier;
      }
      break;
    }

    case 'WEAPON_ENHANCEMENT': {
      if (!effect.pointsBonus) return 0;
      
      const distance = Math.abs(sourcePosition.row - targetPosition.row) + 
                      Math.abs(sourcePosition.col - targetPosition.col);
      
      if (distance <= (effect.range || 1) && 
          targetCard.card.category === 'weapon' &&
          sourceCard.type === targetCard.card.type) {
        return effect.pointsBonus;
      }
      break;
    }
  }

  return effectValue;
}