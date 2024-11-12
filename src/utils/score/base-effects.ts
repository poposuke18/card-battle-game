import type { Position, PlacedCard, Card, BaseEffect } from '@/types';
import { getAdjacentCards, checkEnemyLine } from '@/utils/board';

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

  // 自己強化系の効果
  if (isSelfTarget) {
    switch (effect.type) {
      case 'SELF_POWER_UP_BY_ENEMY_LINE': {
        // 横方向のみをチェックするように修正
        const hasEnemyLine = checkEnemyLine(sourcePosition, board, 'horizontal');
        if (hasEnemyLine) {
          return effect.power;
        }
      }
      break;

      case 'SELF_POWER_UP_BY_ADJACENT_ALLY': {
        const adjacentAllies = getAdjacentCards(sourcePosition, board)
          .filter(adj => adj.card.type === sourceCard.type && adj.card.category === 'unit');
        return adjacentAllies.length * effect.power;
      }
    }
  }

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
      if (!effect.power) return 0;
      
      if (effect.targetDirection === 'vertical') {
        if (sourcePosition.col === targetPosition.col && 
            sourceCard.type === targetCard.card.type) {
          return effect.power;
        }
      } else if (effect.targetDirection === 'horizontal') {
        if (sourcePosition.row === targetPosition.row && 
            sourceCard.type === targetCard.card.type) {
          return effect.power;
        }
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

  return 0;
}