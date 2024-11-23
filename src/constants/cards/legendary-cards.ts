import { createCard, generateCardId, BASE_POINTS, EFFECT_VALUES } from './card-base';
import type { Card, LegendaryEffect } from '@/types';

function calculateLegendaryPoints(basePoint: number, type: 'ally' | 'enemy'): number {
  const legendaryMultiplier = type === 'ally' ? 2.5 : 3.0;
  return Math.floor(basePoint * legendaryMultiplier);
}

export const TURN7_CARDS: Card[] = [
  // Dragon Knight
  createCard({
    id: generateCardId('unit', 'ally', 71),
    name: '聖騎士アーサ',
    type: 'ally',
    category: 'unit',
    class: 'knight',
    points: calculateLegendaryPoints(BASE_POINTS.UNIT.knight, 'ally'),
    effect: {
      type: 'LEGENDARY_DRAGON_KNIGHT',
      primaryEffect: {
        type: 'CROSS_FORMATION',
        power: EFFECT_VALUES.ADJACENT * 2
      },
      secondaryEffect: {
        type: 'WEAPON_ENHANCEMENT',
        range: 2,
        effectMultiplier: 2
      },
      fieldEffect: {
        range: 2,
        allyBonus: EFFECT_VALUES.FIELD,
        enemyPenalty: -EFFECT_VALUES.FIELD,
        supportBonus: EFFECT_VALUES.FIELD
      },
      weaponEffect: {
        range: 2,
        effectMultiplier: 2
      },
      horizontalEffect: {
        power: EFFECT_VALUES.HORIZONTAL,
        debuff: -EFFECT_VALUES.HORIZONTAL
      },
      crossEffect: {
        allyBonus: EFFECT_VALUES.ADJACENT,
        enemyPenalty: -EFFECT_VALUES.ADJACENT
      },
      selfEffect: {
        powerPerEnemy: EFFECT_VALUES.ADJACENT,
        range: 2
      },
      description: '円卓の騎士の力で隣接する味方を強化し、武器の効力を高める'
    } as LegendaryEffect,
    turn: 7
  }),

  // Sage
  createCard({
    id: generateCardId('unit', 'ally', 72),
    name: '大賢者エレミア',
    type: 'ally',
    category: 'unit',
    class: 'mage',
    points: calculateLegendaryPoints(BASE_POINTS.UNIT.mage, 'ally'),
    effect: {
      type: 'LEGENDARY_SAGE',
      primaryEffect: {
        type: 'FIELD_BUFF',
        power: EFFECT_VALUES.FIELD * 2
      },
      secondaryEffect: {
        type: 'NULLIFY_DEBUFF',
        range: 1,
        effectMultiplier: 1
      },
      fieldEffect: {
        range: 2,
        allyBonus: EFFECT_VALUES.FIELD * 2,
        enemyPenalty: -EFFECT_VALUES.FIELD,
        supportBonus: EFFECT_VALUES.FIELD
      },
      weaponEffect: {
        range: 2,
        effectMultiplier: 1
      },
      horizontalEffect: {
        power: 0,
        debuff: 0
      },
      crossEffect: {
        allyBonus: EFFECT_VALUES.ADJACENT,
        enemyPenalty: 0
      },
      selfEffect: {
        powerPerEnemy: 0,
        range: 2
      },
      description: '生命の魔法で味方を強化し、隣接する味方のマイナス効果を無効化する'
    } as LegendaryEffect,
    turn: 7
  }),

  // Dual Swordsman
  createCard({
    id: generateCardId('unit', 'ally', 73),
    name: '双剣士ウルファ',
    type: 'ally',
    category: 'unit',
    class: 'warrior',
    points: calculateLegendaryPoints(BASE_POINTS.UNIT.warrior * 1.5, 'ally'),
    effect: {
      type: 'LEGENDARY_DUAL_SWORDSMAN',
      primaryEffect: {
        type: 'VERTICAL_DEBUFF',
        power: 120 // 弱体化の値は正の数で定義し、計算時に負にする
      },
      secondaryEffect: {
        type: 'NONE',
        range: 1,
        effectMultiplier: 1
      },
      fieldEffect: {
        range: 1,
        allyBonus: 0,
        enemyPenalty: 0,
        supportBonus: 0
      },
      weaponEffect: {
        range: 1,
        effectMultiplier: 1
      },
      horizontalEffect: {
        power: 0,
        debuff: 0
      },
      crossEffect: {
        allyBonus: 0,
        enemyPenalty: 0
      },
      selfEffect: {
        powerPerEnemy: 0,
        range: 1
      },
      description: '縦方向に隣接する敵ユニットに強力な弱体化効果を与える'
    } as LegendaryEffect,
    turn: 7
  }),

  // Chaos Dragon
  createCard({
    id: generateCardId('unit', 'enemy', 71),
    name: '冥皇帝ヴァルガ',
    type: 'enemy',
    category: 'unit',
    class: 'knight',
    points: calculateLegendaryPoints(BASE_POINTS.UNIT.knight * 0.8, 'enemy'),
    effect: {
      type: 'LEGENDARY_CHAOS_DRAGON',
      primaryEffect: {
        type: 'CROSS_FORMATION',
        power: EFFECT_VALUES.ADJACENT * 2
      },
      secondaryEffect: {
        type: 'FIELD_DEBUFF',
        range: 2,
        effectMultiplier: 1
      },
      fieldEffect: {
        range: 2,
        allyBonus: EFFECT_VALUES.FIELD,
        enemyPenalty: -EFFECT_VALUES.FIELD * 2,
        supportBonus: EFFECT_VALUES.FIELD
      },
      weaponEffect: {
        range: 2,
        effectMultiplier: 2
      },
      horizontalEffect: {
        power: EFFECT_VALUES.HORIZONTAL,
        debuff: -EFFECT_VALUES.HORIZONTAL * 2
      },
      crossEffect: {
        allyBonus: EFFECT_VALUES.ADJACENT * 2,
        enemyPenalty: -EFFECT_VALUES.ADJACENT * 2
      },
      selfEffect: {
        powerPerEnemy: EFFECT_VALUES.ADJACENT * 2,
        range: 2
      },
      description: '竜の咆哮が戦場を揺るがし、敵の心を打ち砕く'
    } as LegendaryEffect,
    turn: 7
  }),

  // Archmage
  createCard({
    id: generateCardId('unit', 'enemy', 72),
    name: '深淵術師ネクロ',
    type: 'enemy',
    category: 'unit',
    class: 'mage',
    points: calculateLegendaryPoints(BASE_POINTS.UNIT.mage * 0.8, 'enemy'),
    effect: {
      type: 'LEGENDARY_ARCHMAGE',
      primaryEffect: {
        type: 'FIELD_MAGIC',
        power: EFFECT_VALUES.FIELD * 2
      },
      secondaryEffect: {
        type: 'WEAPON_AMPLIFY',
        range: 2,
        effectMultiplier: 2
      },
      fieldEffect: {
        range: 2,
        allyBonus: EFFECT_VALUES.FIELD * 2,
        enemyPenalty: -EFFECT_VALUES.FIELD * 2,
        supportBonus: EFFECT_VALUES.FIELD
      },
      weaponEffect: {
        range: 2,
        effectMultiplier: 2
      },
      horizontalEffect: {
        power: EFFECT_VALUES.HORIZONTAL,
        debuff: -EFFECT_VALUES.HORIZONTAL
      },
      crossEffect: {
        allyBonus: EFFECT_VALUES.ADJACENT * 1.5,
        enemyPenalty: -EFFECT_VALUES.ADJACENT * 1.5
      },
      selfEffect: {
        powerPerEnemy: EFFECT_VALUES.FIELD,
        range: 2
      },
      description: '深淵の力で武器を強化し、敵の魂を蝕む'
    } as LegendaryEffect,
    turn: 7
  }),

  // Demon Emperor
  createCard({
    id: generateCardId('unit', 'enemy', 73),
    name: '暗黒戦士ザロン',
    type: 'enemy',
    category: 'unit',
    class: 'warrior',
    points: calculateLegendaryPoints(BASE_POINTS.UNIT.warrior * 0.8, 'enemy'),
    effect: {
      type: 'LEGENDARY_DEMON_EMPEROR',
      primaryEffect: {
        type: 'CROSS_DOMINATION',
        power: EFFECT_VALUES.ADJACENT * 2
      },
      secondaryEffect: {
        type: 'ENEMY_ABSORPTION',
        range: 2,
        effectMultiplier: 1.5
      },
      fieldEffect: {
        range: 2,
        allyBonus: EFFECT_VALUES.FIELD,
        enemyPenalty: -EFFECT_VALUES.FIELD,
        supportBonus: EFFECT_VALUES.FIELD
      },
      weaponEffect: {
        range: 2,
        effectMultiplier: 1.5
      },
      horizontalEffect: {
        power: EFFECT_VALUES.HORIZONTAL,
        debuff: -EFFECT_VALUES.HORIZONTAL
      },
      crossEffect: {
        allyBonus: EFFECT_VALUES.ADJACENT * 1.5,
        enemyPenalty: -EFFECT_VALUES.ADJACENT
      },
      selfEffect: {
        powerPerEnemy: 10,
        range: 2
      },
      description: '暗黒の力で敵を圧倒し、その力を糧に更なる強さを得る'
    } as LegendaryEffect,
    turn: 7
  })
];