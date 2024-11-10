// src/utils/score-calculator.ts

import { Position, PlacedCard, Card } from '@/types/game';
import { getAdjacentCards, checkEnemyLine } from '@/utils/board';

export type ScoreDetails = {
  basePoints: number;
  effectPoints: number;
  totalPoints: number;
};

// カードスコアを計算する関数
export function calculateCardScore(
  position: Position,
  board: (PlacedCard | null)[][],
  card: PlacedCard
): ScoreDetails {
  let basePoints = card.card.points;
  let effectPoints = 0;
  const adjacentCards = getAdjacentCards(position, board);

  // 他のカードからの効果を計算
  board.forEach((row, i) => {
    row.forEach((otherCell, j) => {
      if (!otherCell || 
          otherCell === card || 
          (otherCell.position.row === position.row && 
           otherCell.position.col === position.col)) return;

      if (otherCell.card.effect) {
        const distance = Math.abs(position.row - i) + Math.abs(position.col - j);
        
        switch (otherCell.card.effect.type) {
          case 'BUFF_ADJACENT': {
            if (distance === 1 && otherCell.card.type === card.card.type) {
              effectPoints += otherCell.card.effect.power;
            }
            break;
          }
          case 'DAMAGE_ADJACENT': {
            if (distance === 1) {
              effectPoints -= otherCell.card.effect.power;
            }
            break;
          }
          case 'RANGE_BUFF':
          case 'FIELD_BUFF': {
            if (distance <= (otherCell.card.effect.range || 1) && 
                otherCell.card.type === card.card.type) {
              effectPoints += otherCell.card.effect.power;
            }
            break;
          }
        }
      }
    });
  });

  // カード自身の効果を計算
  if (card.card.effect) {
    switch (card.card.effect.type) {
      case 'POWER_UP_BY_ENEMY_LINE': {
        if (checkEnemyLine(position, board)) {
          effectPoints += card.card.effect.power;
        }
        break;
      }
      case 'POWER_UP_BY_ALLY': {
        const adjacentAllies = adjacentCards.filter(
          adj => adj.card.type === card.card.type
        ).length;
        effectPoints += adjacentAllies * card.card.effect.power;
        break;
      }
      case 'BUFF_ADJACENT': {
        const targets = adjacentCards.filter(
          adj => adj.card.type === card.card.type
        ).length;
        effectPoints += targets * card.card.effect.power;
        break;
      }
      case 'DAMAGE_ADJACENT': {
        effectPoints += adjacentCards.length * -card.card.effect.power;
        break;
      }
    }
  }

  const totalPoints = basePoints + effectPoints;
  
  return {
    basePoints,
    effectPoints,
    totalPoints
  };
}

// 効果の説明を取得する関数
export function getEffectDescription(card: Card): string {
  if (!card.effect) return '';

  switch (card.effect.type) {
    case 'POWER_UP_BY_ENEMY_LINE':
      return `縦か横に敵ユニットが2体並んでいる隣に配置すると攻撃力+${card.effect.power}`;
    case 'POWER_UP_BY_ALLY':
      return `隣接する味方ユニット1体につき攻撃力+${card.effect.power}`;
    case 'BUFF_ADJACENT':
      return `隣接する${card.type === 'ally' ? '味方' : '敵'}ユニットの攻撃力+${card.effect.power}`;
    case 'DAMAGE_ADJACENT':
      return `隣接するユニットの攻撃力-${card.effect.power}`;
    case 'RANGE_BUFF':
      return `周囲${card.effect.range}マス以内の${card.type === 'ally' ? '味方' : '敵'}ユニットの攻撃力+${card.effect.power}`;
    case 'FIELD_BUFF':
      return `周囲${card.effect.range}マス以内の${card.type === 'ally' ? '味方' : '敵'}ユニットの攻撃力+${card.effect.power}`;
    default:
      return '';
  }
}