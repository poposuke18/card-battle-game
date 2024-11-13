import type { Position, PlacedCard, Card } from '@/types';
import type { ScoreDetails } from './types';
import { calculateWeaponEffect, getWeaponEffectMultiplier } from './weapon-effects';
import { calculateLeaderEffect } from './leader-effects';
import { calculateBaseEffect, getSupportEffectMultiplier } from './base-effects';
import { getClassDisplayName } from '@/utils/common';

export function getEffectDescription(card: Card): string {
  if (!card.effect) return '';

  // リーダー効果の説明
  if ('type' in card.effect && card.effect.type.startsWith('LEADER_')) {
    switch (card.effect.type) {
      case 'LEADER_TACTICAL':
        const classEffects = card.effect.classEffects
          ?.map(ce => `${getClassDisplayName(ce.class)}+${ce.power}`)
          .join('、');
        return `周囲${card.effect.range}マス以内の${classEffects}${
          card.effect.supportMultiplier ? `、サポート効果${card.effect.supportMultiplier}倍` : ''
        }`;

      case 'LEADER_ENHANCEMENT':
        return card.effect.categoryBonus ? 
          Object.entries(card.effect.categoryBonus)
            .map(([category, bonus]) => `${category}+${bonus}`)
            .join('、') : '';

      case 'LEADER_PROTECTION':
        const effects = [];
        if (card.effect.adjacentAllyBonus) 
          effects.push(`隣接する味方1体につき+${card.effect.adjacentAllyBonus}`);
        if (card.effect.adjacentEnemyPenalty)
          effects.push(`隣接する敵ユニット${card.effect.adjacentEnemyPenalty}`);
        if (card.effect.adjacentEnemyBonus)
          effects.push(`隣接する敵1体につき+${card.effect.adjacentEnemyBonus}`);
        return effects.join('、');

      case 'LEADER_DEBUFF':
        return card.effect.adjacentDebuff 
          ? `隣接するユニット${card.effect.adjacentDebuff}` 
          : '';
      
      default:
        return '';
    }
  }

  // 武器効果の説明
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

  // 基本効果の説明
  switch (card.effect.type) {
    case 'SELF_POWER_UP_BY_ENEMY_LINE':
      return `横に敵ユニットが2体並んでいる場合、攻撃力+${card.effect.power}`;
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
      if (!card.effect.classEffects) return '';
      const effects = card.effect.classEffects
        .map(ce => `${getClassDisplayName(ce.class)}+${ce.power}`)
        .join('、');
      return `周囲${card.effect.range || 2}マス以内の${effects}`;
    }
    case 'ROW_COLUMN_BUFF':
      return `${card.effect.targetDirection === 'vertical' ? '縦' : '横'}一列の味方ユニットの攻撃力+${card.effect.power}`;
    case 'WEAPON_ENHANCEMENT':
      return `周囲${card.effect.range || 1}マス以内の味方武器カードの効果を${card.effect.effectMultiplier || 2}倍にする`;
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
  let leaderEffectPoints = 0;
  
  // 処理済みのリーダー効果を追跡
  const processedLeaderEffects = new Set<string>();

  // 自己効果の計算
  if (targetCard.card.effect) {
    if ('type' in targetCard.card.effect && targetCard.card.effect.type.startsWith('LEADER_')) {
      // リーダー効果の場合は自己効果なし
      if (targetCard.card.effect.type !== 'LEADER_BASIC') {
        const effectKey = `${targetCard.card.id}-${targetCard.card.effect.type}`;
        leaderEffectPoints += calculateLeaderEffect(
          position,
          position,
          targetCard.card,
          targetCard,
          targetCard.card.effect,
          board
        );
        processedLeaderEffects.add(effectKey);
      }
    } else if (!('targetClass' in targetCard.card.effect)) {
      // 通常の効果の場合
      effectPoints += calculateBaseEffect(
        position,
        position,
        targetCard.card,
        targetCard,
        targetCard.card.effect,
        board
      );
    }
  }

  // 他のカードからの効果の計算
  board.forEach((row, rowIndex) => {
    row.forEach((sourceCell, colIndex) => {
      if (!sourceCell || (rowIndex === position.row && colIndex === position.col)) return;

      const sourcePosition = { row: rowIndex, col: colIndex };
      const effect = sourceCell.card.effect;

      if (!effect) return;

      if ('type' in effect && effect.type.startsWith('LEADER_')) {
        // リーダー効果の計算（BASIC以外）
        if (effect.type !== 'LEADER_BASIC') {
          const effectKey = `${sourceCell.card.id}-${effect.type}`;
          if (!processedLeaderEffects.has(effectKey)) {
            leaderEffectPoints += calculateLeaderEffect(
              sourcePosition,
              position,
              sourceCell.card,
              targetCard,
              effect,
              board
            );
            processedLeaderEffects.add(effectKey);
          }
        }
      } else if ('targetClass' in effect) {
        // 武器効果の計算
        effectPoints += calculateWeaponEffect(
          sourcePosition,
          position,
          sourceCell.card,
          targetCard,
          effect,
          board
        );
      } else {
        // 基本効果の計算
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

  // スコアがマイナスにならないように調整
  const totalPoints = Math.max(0, basePoints + effectPoints + leaderEffectPoints);

  return {
    basePoints,
    effectPoints,
    leaderEffectPoints,
    totalPoints
  };
}