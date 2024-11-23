// src/constants/cards/effect-units.ts

import { createCard, generateCardId, BASE_POINTS, EFFECT_VALUES, calculateCardPoints } from './card-base';
import type { Card } from '@/types';

// 2ターン目の全カード
export const TURN2_CARDS: Card[] = [
  // 味方ユニット
  createCard({
    id: generateCardId('unit', 'ally', 25),
    name: '熟練戦士',
    type: 'ally',
    category: 'unit',
    class: 'warrior',
    points: calculateCardPoints(BASE_POINTS.UNIT.warrior, 'ally', 2, 1, true),
    effect: {
      type: 'UNIT_VERTICAL_ENEMY_DEBUFF',
      power: EFFECT_VALUES.VERTICAL
    },
    turn: 2
  }),
  createCard({
    id: generateCardId('unit', 'ally', 26),
    name: '重装防衛兵',
    type: 'ally',
    category: 'unit',
    class: 'guardian',
    points: calculateCardPoints(BASE_POINTS.UNIT.guardian, 'ally', 2, 1, true),
    effect: {
      type: 'SELF_POWER_UP_BY_ADJACENT_ALLY',
      power: EFFECT_VALUES.ADJACENT
    },
    turn: 2
  }),
  createCard({
    id: generateCardId('unit', 'ally', 27),
    name: '精鋭射手',
    type: 'ally',
    category: 'unit',
    class: 'archer',
    points: calculateCardPoints(BASE_POINTS.UNIT.archer, 'ally', 2, 1, true),
    effect: {
      type: 'DIAGONAL_DEBUFF',
      power: EFFECT_VALUES.DIAGONAL
    },
    turn: 2
  }),
  createCard({
    id: generateCardId('unit', 'ally', 28),
    name: '遊撃騎士',
    type: 'ally',
    category: 'unit',
    class: 'knight',
    points: calculateCardPoints(BASE_POINTS.UNIT.knight, 'ally', 2, 1, true),
    effect: {
      type: 'ADJACENT_UNIT_BUFF',
      power: EFFECT_VALUES.ADJACENT
    },
    turn: 2
  }),

  // 敵ユニット
  createCard({
    id: generateCardId('unit', 'enemy', 25),
    name: 'バーサーカー',
    type: 'enemy',
    category: 'unit',
    class: 'warrior',
    points: calculateCardPoints(BASE_POINTS.UNIT.warrior, 'enemy', 2, 1, true),
    effect: {
      type: 'UNIT_VERTICAL_ENEMY_DEBUFF',
      power: EFFECT_VALUES.VERTICAL * 1.5 
    },
    turn: 2
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 26),
    name: '鋼鉄の守護者',
    type: 'enemy',
    category: 'unit',
    class: 'guardian',
    points: calculateCardPoints(BASE_POINTS.UNIT.guardian, 'enemy', 2, 1, true),
    effect: {
      type: 'SELF_POWER_UP_BY_ADJACENT_ALLY',
      power: EFFECT_VALUES.ADJACENT * 1.5
    },
    turn: 2
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 27),
    name: '暗殺者',
    type: 'enemy',
    category: 'unit',
    class: 'archer',
    points: calculateCardPoints(BASE_POINTS.UNIT.archer, 'enemy', 2, 1, true),
    effect: {
      type: 'DIAGONAL_DEBUFF',
      power: EFFECT_VALUES.DIAGONAL * 1.5
    },
    turn: 2
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 28),
    name: '死の騎士',
    type: 'enemy',
    category: 'unit',
    class: 'knight',
    points: calculateCardPoints(BASE_POINTS.UNIT.knight, 'enemy', 2, 1, true),
    effect: {
      type: 'ADJACENT_UNIT_BUFF',
      power: EFFECT_VALUES.ADJACENT * 1.5
    },
    turn: 2
  })
];