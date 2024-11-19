// src/constants/cards/legendary-cards.ts

import { createCard, generateCardId, BASE_POINTS, EFFECT_VALUES, calculateCardPoints } from './card-base';
import type { Card } from '@/types';

// 伝説ユニット用の特別な計算
function calculateLegendaryPoints(basePoint: number, type: 'ally' | 'enemy'): number {
  const legendaryMultiplier = type === 'ally' ? 2.5 : 3.0;
  return Math.floor(basePoint * legendaryMultiplier);
}

export const TURN7_CARDS: Card[] = [
  // 味方伝説ユニット
  createCard({
    id: generateCardId('unit', 'ally', 71),
    name: '聖騎士ランスロット',
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
        effectMultiplier: 1.5
      },
      description: '円卓の騎士の力で隣接する味方を強化し、武器の効力を高める'
    },
    turn: 7
  }),
  createCard({
    id: generateCardId('unit', 'ally', 72),
    name: '大賢者エレミア',
    type: 'ally',
    category: 'unit',
    class: 'mage',
    points: calculateLegendaryPoints(BASE_POINTS.UNIT.mage, 'ally'),
    effect: {
      type: 'LEGENDARY_SAGE',
      fieldEffect: {
        range: 2,
        allyBonus: EFFECT_VALUES.FIELD,
        supportBonus: EFFECT_VALUES.FIELD
      },
      healingEffect: {
        power: 30,
        range: 1
      },
      description: '生命の魔法で味方を癒し、古代の知恵で支援を強化する'
    },
    turn: 7
  }),
  createCard({
    id: generateCardId('unit', 'ally', 73),
    name: '双剣士ラウルファ',
    type: 'ally',
    category: 'unit',
    class: 'warrior',
    points: calculateLegendaryPoints(BASE_POINTS.UNIT.warrior, 'ally'),
    effect: {
      type: 'LEGENDARY_DUAL_SWORDSMAN',
      verticalEffect: {
        power: EFFECT_VALUES.VERTICAL * 1.5,
        debuff: -EFFECT_VALUES.VERTICAL
      },
      horizontalEffect: {
        power: EFFECT_VALUES.HORIZONTAL * 2,
        debuff: -EFFECT_VALUES.HORIZONTAL
      },
      description: '伝説の二刀流で縦横無尽に戦場を駆ける'
    },
    turn: 7
  }),

  // 敵伝説ユニット
  createCard({
    id: generateCardId('unit', 'enemy', 71),
    name: '冥竜皇帝ヴァルガス',
    type: 'enemy',
    category: 'unit',
    class: 'knight',
    points: calculateLegendaryPoints(BASE_POINTS.UNIT.knight, 'enemy'),
    effect: {
      type: 'LEGENDARY_CHAOS_DRAGON',
      primaryEffect: {
        type: 'CROSS_FORMATION',
        power: EFFECT_VALUES.ADJACENT * 2.5
      },
      fieldEffect: {
        range: 2,
        enemyPenalty: -EFFECT_VALUES.FIELD
      },
      description: '竜の咆哮が戦場を揺るがし、敵の心を打ち砕く'
    },
    turn: 7
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 72),
    name: '深淵術師ネクロス',
    type: 'enemy',
    category: 'unit',
    class: 'mage',
    points: calculateLegendaryPoints(BASE_POINTS.UNIT.mage, 'enemy'),
    effect: {
      type: 'LEGENDARY_ARCHMAGE',
      fieldEffect: {
        range: 2,
        allyBonus: EFFECT_VALUES.FIELD * 1.5,
        enemyPenalty: -EFFECT_VALUES.FIELD
      },
      weaponEffect: {
        effectMultiplier: 2,
        range: 2
      },
      description: '深淵の力で武器を強化し、敵の魂を蝕む'
    },
    turn: 7
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 73),
    name: '暗黒戦士ヴァロン',
    type: 'enemy',
    category: 'unit',
    class: 'warrior',
    points: calculateLegendaryPoints(BASE_POINTS.UNIT.warrior, 'enemy'),
    effect: {
      type: 'LEGENDARY_DEMON_EMPEROR',
      crossEffect: {
        allyBonus: EFFECT_VALUES.ADJACENT * 2,
        enemyPenalty: -EFFECT_VALUES.ADJACENT
      },
      selfEffect: {
        powerPerEnemy: 30,
        range: 2
      },
      description: '暗黒の力で敵を圧倒し、その力を糧に更なる強さを得る'
    },
    turn: 7
  })
];