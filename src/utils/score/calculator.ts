import type { Position, PlacedCard, Card } from '@/types';
import type { ScoreDetails } from './types';
import { calculateWeaponEffect } from './weapon-effects';
import { calculateBaseEffect } from './base-effects';
import { getClassDisplayName } from '@/utils/common';

export function getEffectDescription(card: Card): string {
  if (!card.effect) return '';

  if ('targetClass' in card.effect) {
    const className = getClassDisplayName(card.effect.targetClass);
    switch (card.effect.type) {
      case 'VERTICAL_BOOST':
        return `上下の${className}の攻撃力+${card.effect.power}`;
      case 'HORIZONTAL_BOOST':
        return `左右の${className}の攻撃力+${card.effect.power}`;
      case 'DIAGONAL_BOOST':
        return `斜めの位置にいる${className}の攻撃力+${card.effect.power}`;
      case 'CROSS_FORMATION':
        return `十字の位置にいる${className}の攻撃力+${card.effect.power}`;
      case 'SURROUND_BOOST':
        return `3体以上の${className}に囲まれていると攻撃力+${card.effect.power}`;
    }
  }

  switch (card.effect.type) {
    case 'SELF_POWER_UP_BY_ENEMY_LINE':
      return `横に敵ユニットが2体並んでいる場合、攻撃力+${card.effect.power}`;  // 説明文を修正
    case 'SELF_POWER_UP_BY_ADJACENT_ALLY':
      return `隣接する味方ユニット1体につき攻撃力+${card.effect.power}`;
    case 'ADJACENT_UNIT_BUFF':
      return `隣接する味方ユニットの攻撃力+${card.effect.power}`;
    case 'ADJACENT_UNIT_DEBUFF':
      return `隣接するユニットの攻撃力-${card.effect.power}`;
    case 'FIELD_UNIT_BUFF':
      return `周囲${card.effect.range}マス以内の味方ユニットの攻撃力+${card.effect.power}`;
    case 'FIELD_UNIT_DEBUFF':
      return `周囲${card.effect.range}マス以内のユニットの攻撃力-${card.effect.power}`;
    case 'FIELD_CLASS_POWER_UP': {
        const range = card.effect.range || 1;
        const effects = card.effect.classEffects
          ?.map(ce => `${getClassDisplayName(ce.class)}+${ce.power}`)
          .join('、');
        return `周囲${range}マス以内の${effects}`;
      }
      return '';
    case 'ROW_COLUMN_BUFF':
      return `${card.effect.targetDirection === 'vertical' ? '縦' : '横'}一列の味方ユニットの攻撃力+${card.effect.power}`;
      case 'WEAPON_ENHANCEMENT':
        return `周囲${card.effect.range}マス以内の味方武器カードの効果を2倍にする`;
        case 'LEADER_TACTICAL': {
          const effects = card.effect.classEffects
            ?.map(ce => `${getClassDisplayName(ce.class)}+${ce.power}`)
            .join('、');
          return `周囲${card.effect.range}マス以内の${effects}。サポート効果+${card.effect.supportBonus}%`;
        }
        case 'LEADER_FORMATION': {
          return `周囲のユニット+${card.effect.power}。縦列+${card.effect.formationBonus?.vertical}、横列+${card.effect.formationBonus?.horizontal}`;
        }
        case 'LEADER_ENHANCEMENT': {
          return `武器効果+${card.effect.weaponBonus}%、サポート効果+${card.effect.supportBonus}%`;
        }
        case 'LEADER_PROTECTION': {
          const range = card.effect.range || 1;
          return `周囲${range}マス以内の味方ユニットの防御+${card.effect.defenseBonus}、反撃+${card.effect.counterAttack}`;
        }
    default:
      return '';
  }
}

export function calculateCardScore(
  position: Position,
  board: (PlacedCard | null)[][],
  targetCard: PlacedCard
): ScoreDetails {
  const basePoints = targetCard.card.points;
  let effectPoints = 0;

  // 自己効果の計算（targetCardの効果）
  if (targetCard.card.effect && !('targetClass' in targetCard.card.effect)) {
    effectPoints += calculateBaseEffect(
      position,  // 自分の位置
      position,  // 対象も自分
      targetCard.card,
      targetCard,
      targetCard.card.effect,
      board
    );
  }

  // 他のカードからの効果の計算
  board.forEach((row, rowIndex) => {
    row.forEach((sourceCell, colIndex) => {
      if (!sourceCell || (rowIndex === position.row && colIndex === position.col)) return;

      const sourcePosition = { row: rowIndex, col: colIndex };
      const effect = sourceCell.card.effect;

      if (!effect) return;

      if ('targetClass' in effect) {
        effectPoints += calculateWeaponEffect(
          sourcePosition,
          position,
          sourceCell.card,
          targetCard,
          effect,
          board
        );
      } else {
        effectPoints += calculateBaseEffect(
          sourcePosition,
          position,
          sourceCell.card,
          targetCard,
          effect,
          board
        );
      }
    });
  });

  return {
    basePoints,
    effectPoints,
    totalPoints: basePoints + effectPoints
  };
}