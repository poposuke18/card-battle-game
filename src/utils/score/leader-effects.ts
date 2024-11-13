import { Position, PlacedCard, Card, LeaderEffect } from '@/types';
import { getAdjacentCards } from '@/utils/board';

export function calculateLeaderEffect(
  sourcePosition: Position,
  targetPosition: Position,
  sourceCard: Card,
  targetCard: PlacedCard,
  effect: LeaderEffect,
  board: (PlacedCard | null)[][]
): number {
  const isSelfPosition = sourcePosition.row === targetPosition.row && 
                        sourcePosition.col === targetPosition.col;
  
  // LEADER_BASICは効果なし
  if (effect.type === 'LEADER_BASIC') return 0;

  const distance = Math.max(
    Math.abs(sourcePosition.row - targetPosition.row),
    Math.abs(sourcePosition.col - targetPosition.col)
  );

  let effectValue = 0;

  switch (effect.type) {
    case 'LEADER_TACTICAL': {
      // 範囲チェック
      if (distance > (effect.range || 2)) return 0;
      
      // 同じ陣営のユニットのみ効果適用
      if (sourceCard.type === targetCard.card.type) {
        // クラス効果
        if (targetCard.card.class) {
          const classEffect = effect.classEffects?.find(
            ce => ce.class === targetCard.card.class
          );
          if (classEffect) {
            effectValue += classEffect.power;
          }
        }
        
        // サポートカード効果の増幅
        if (targetCard.card.category === 'support' && 
            effect.supportMultiplier) {
          const baseEffect = targetCard.card.effect?.power || 0;
          effectValue += Math.floor(baseEffect * (effect.supportMultiplier - 1));
        }
      }
      break;
    }

    case 'LEADER_ENHANCEMENT': {
      if (sourceCard.type === targetCard.card.type && effect.categoryBonus) {
        const bonus = effect.categoryBonus[targetCard.card.category];
        if (bonus) {
          effectValue += bonus;
        }
      }
      break;
    }

    case 'LEADER_PROTECTION': {
      if (distance !== 1) return 0;  // 隣接のみ
      
      const adjacentCards = getAdjacentCards(targetPosition, board);
      
      if (effect.adjacentAllyBonus && sourceCard.type === targetCard.card.type) {
        const allyCount = adjacentCards.filter(
          c => c.card.type === sourceCard.type
        ).length;
        effectValue += allyCount * effect.adjacentAllyBonus;
      }
      
      if (effect.adjacentEnemyPenalty && 
          sourceCard.type !== targetCard.card.type) {
        effectValue += effect.adjacentEnemyPenalty;
      }
      
      if (effect.adjacentEnemyBonus && 
          sourceCard.type === targetCard.card.type) {
        const enemyCount = adjacentCards.filter(
          c => c.card.type !== sourceCard.type
        ).length;
        effectValue += enemyCount * effect.adjacentEnemyBonus;
      }
      break;
    }

    case 'LEADER_DEBUFF': {
      if (distance === 1 && effect.adjacentDebuff) {
        effectValue += effect.adjacentDebuff;
      }
      break;
    }
  }

  return effectValue;
}