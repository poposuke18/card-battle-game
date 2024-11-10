// src/utils/score-calculator.ts

import { Position, PlacedCard, Card } from '@/types/game';
import { getAdjacentCards, checkEnemyLine } from '@/utils/board';

export type ScoreDetails = {
  basePoints: number;
  effectPoints: number;
  totalPoints: number;
};

// カードのカテゴリーによって適用できる効果を判定する
function canAffectTarget(sourceCard: Card, targetCard: Card): boolean {
  // フィールドカードはユニットにのみ効果を与える
  if (sourceCard.category === 'field') {
    return targetCard.category === 'unit';
  }
  // ユニットカードは全てに効果を与えられる
  return true;
}

// カードスコアを計算する関数
export function calculateCardScore(
  position: Position,
  board: (PlacedCard | null)[][],
  card: PlacedCard
): ScoreDetails {
  let basePoints = card.card.points;
  let effectPoints = 0;
  const adjacentCards = getAdjacentCards(position, board);

  // 自身の効果を計算（Self Effects）
  if (card.card.effect) {
    switch (card.card.effect.type) {
      case 'SELF_POWER_UP_BY_ENEMY_LINE': {
        if (checkEnemyLine(position, board)) {
          effectPoints += card.card.effect.power;
        }
        break;
      }
      case 'SELF_POWER_UP_BY_ADJACENT_ALLY': {
        const adjacentAllies = adjacentCards.filter(
          adj => adj.card.type === card.card.type && adj.card.category === 'unit'
        ).length;
        effectPoints += adjacentAllies * card.card.effect.power;
        break;
      }
    }
  }

  // 他のカードからの効果を計算（Received Effects）
  board.forEach((row, i) => {
    row.forEach((otherCell, j) => {
      if (!otherCell || 
          otherCell === card || 
          !canAffectTarget(otherCell.card, card.card)) return;

      if (otherCell.card.effect) {
        const distance = Math.abs(position.row - i) + Math.abs(position.col - j);
        
        switch (otherCell.card.effect.type) {
          case 'ADJACENT_UNIT_BUFF': {
            if (distance === 1 && 
                otherCell.card.type === card.card.type &&
                card.card.category === 'unit') {
              effectPoints += otherCell.card.effect.power;
            }
            break;
          }
          case 'ADJACENT_UNIT_DEBUFF': {
            if (distance === 1 && card.card.category === 'unit') {
              effectPoints -= otherCell.card.effect.power;
            }
            break;
          }
          case 'FIELD_UNIT_BUFF': {
            if (distance <= (otherCell.card.effect.range || 1) && 
                otherCell.card.type === card.card.type &&
                card.card.category === 'unit') {
              effectPoints += otherCell.card.effect.power;
            }
            break;
          }
          case 'FIELD_UNIT_DEBUFF': {
            if (distance <= (otherCell.card.effect.range || 1) &&
                card.card.category === 'unit') {
              effectPoints -= otherCell.card.effect.power;
            }
            break;
          }
        }
      }
    });
  });

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
    case 'SELF_POWER_UP_BY_ENEMY_LINE':
      return `縦か横に敵ユニットが2体並んでいる場合、攻撃力+${card.effect.power}`;
    case 'SELF_POWER_UP_BY_ADJACENT_ALLY':
      return `隣接する味方ユニット1体につき攻撃力+${card.effect.power}`;
    case 'ADJACENT_UNIT_BUFF':
      return `隣接する味方ユニットの攻撃力+${card.effect.power}`;
    case 'ADJACENT_UNIT_DEBUFF':
      return `隣接するユニットの攻撃力-${card.effect.power}`;
    case 'FIELD_UNIT_BUFF':
      return `周囲${card.effect.range}マス以内の味方ユニットの攻撃力+${card.effect.power}`;
    case 'FIELD_UNIT_DEBUFF':
      return `周囲${card.effect.range}マス以内の敵ユニットの攻撃力-${card.effect.power}`;
    default:
      return '';
  }
}