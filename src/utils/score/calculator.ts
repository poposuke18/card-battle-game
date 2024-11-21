// src/utils/score/calculator.ts

import { Position, PlacedCard,Effect, ScoreDetails,  isFieldEffect} from '@/types';
import { 
  getEffectPriority,
  calculateCardEffects,  // 新しく追加する関数
} from '../effects/index';

export function calculateCardScore(
  position: Position,
  board: (PlacedCard | null)[][],
  targetCard: PlacedCard
): ScoreDetails {
  const scoreState = {
    basePoints: targetCard.card.points,
    effectPoints: 0,
    leaderEffectPoints: 0,
    weaponEffectPoints: 0,
    fieldEffectPoints: 0,
    supportEffectPoints: 0,
    effects: new Map<string, { value: number; source: string }>()
  };

  // 効果の計算を effect-system に委譲
  const effectResults = calculateCardEffects(position, board, targetCard);

  // 効果の結果をスコアに反映
  effectResults.forEach(result => {
    const { effect, value, source } = result;
    
    // 効果を記録
    const effectKey = `${source.id}-${effect.type}`;
    scoreState.effects.set(effectKey, {
      value: value,
      source: `${source.name}`
    });

    // スコアを分類して加算
    if (isFieldEffect(effect)) {
      scoreState.fieldEffectPoints += value;
    } else if ('targetClass' in effect) {
      scoreState.weaponEffectPoints += value;
    } else if (effect.type.startsWith('LEADER_')) {
      scoreState.leaderEffectPoints += value;
    } else if (source.category === 'support') {
      scoreState.supportEffectPoints += value;
    } else {
      scoreState.effectPoints += value;
    }
  });

  const totalPoints = Math.max(0,
    scoreState.basePoints +
    scoreState.effectPoints +
    scoreState.leaderEffectPoints +
    scoreState.fieldEffectPoints +
    scoreState.weaponEffectPoints +
    scoreState.supportEffectPoints
  );

  return {
    basePoints: scoreState.basePoints,
    effectPoints: scoreState.effectPoints,
    leaderEffectPoints: scoreState.leaderEffectPoints,
    weaponEffectPoints: scoreState.weaponEffectPoints,
    fieldEffectPoints: scoreState.fieldEffectPoints,
    supportEffectPoints: scoreState.supportEffectPoints,
    totalPoints,
    effectBreakdown: getEffectBreakdown(scoreState.effects)
  };
}

function getEffectBreakdown(effects: Map<string, { value: number; source: string }>): Array<{
  type: string;
  value: number;
  source: string;
}> {
  return Array.from(effects.entries())
    .map(([key, data]) => ({
      type: key.split('-')[1] as Effect['type'],
      value: data.value,
      source: data.source
    }))
    .sort((a, b) => {
      const priorityA = getEffectPriority({ type: a.type as Effect['type'] });
      const priorityB = getEffectPriority({ type: b.type as Effect['type'] });
      return priorityB - priorityA;
    });
}