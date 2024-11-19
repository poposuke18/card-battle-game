import { createCard, generateCardId, BASE_POINTS, EFFECT_VALUES, calculateCardPoints } from './card-base';
import type { Card } from '@/types';

export const TURN5_CARDS: Card[] = [
  // 味方補強カード
  createCard({
    id: generateCardId('support', 'ally', 51),
    name: '竜騎士',
    type: 'ally',
    category: 'unit',
    class: 'knight',
    points: calculateCardPoints(BASE_POINTS.UNIT.knight, 'ally', 5, 1, true),
    effect: {
      type: 'ADJACENT_UNIT_BUFF',
      power: EFFECT_VALUES.ADJACENT * 1.5,
      range: 1
    },
    turn: 5
  }),
  createCard({
    id: generateCardId('support', 'ally', 52),
    name: '魔導師',
    type: 'ally',
    category: 'unit',
    class: 'mage',
    points: calculateCardPoints(BASE_POINTS.UNIT.mage, 'ally', 5, 1, true),
    effect: {
      type: 'FIELD_DUAL_EFFECT',
      range: 2,
      allyBonus: Math.floor(EFFECT_VALUES.FIELD * 0.8),
      enemyPenalty: -Math.floor(EFFECT_VALUES.FIELD * 0.6)
    },
    turn: 5
  }),
  createCard({
    id: generateCardId('support', 'ally', 53),
    name: '武器職人',
    type: 'ally',
    category: 'support',
    points: calculateCardPoints(BASE_POINTS.SUPPORT, 'ally', 5, 1, true),
    effect: {
      type: 'WEAPON_ENHANCEMENT',
      range: 1,
      effectMultiplier: 2,
      power: 30
    },
    turn: 5
  }),
  createCard({
    id: generateCardId('support', 'ally', 54),
    name: '勝利の旗印',
    type: 'ally',
    category: 'support',
    points: calculateCardPoints(BASE_POINTS.SUPPORT, 'ally', 5, 1, true),
    effect: {
      type: 'ROW_COLUMN_BUFF',
      power: EFFECT_VALUES.VERTICAL * 0.5,
      targetDirection: 'vertical'
    },
    turn: 5
  }),
  createCard({
    id: generateCardId('support', 'ally', 55),
    name: '戦術の書',
    type: 'ally',
    category: 'support',
    points: calculateCardPoints(BASE_POINTS.SUPPORT, 'ally', 5, 1, true),
    effect: {
      type: 'ROW_COLUMN_BUFF',
      power: EFFECT_VALUES.HORIZONTAL * 0.5,
      targetDirection: 'horizontal'
    },
    turn: 5
  }),

  // 敵補強カード
  createCard({
    id: generateCardId('support', 'enemy', 51),
    name: '暗黒騎士',
    type: 'enemy',
    category: 'unit',
    class: 'knight',
    points: calculateCardPoints(BASE_POINTS.UNIT.knight, 'enemy', 5, 1, true),
    effect: {
      type: 'ADJACENT_UNIT_BUFF',
      power: EFFECT_VALUES.ADJACENT * 1.8,
      range: 1
    },
    turn: 5
  }),
  createCard({
    id: generateCardId('support', 'enemy', 52),
    name: '破壊の魔術師',
    type: 'enemy',
    category: 'unit',
    class: 'mage',
    points: calculateCardPoints(BASE_POINTS.UNIT.mage, 'enemy', 5, 1, true),
    effect: {
      type: 'FIELD_DUAL_EFFECT',
      range: 2,
      allyBonus: EFFECT_VALUES.FIELD,
      enemyPenalty: -Math.floor(EFFECT_VALUES.FIELD * 0.8)
    },
    turn: 5
  }),
  createCard({
    id: generateCardId('support', 'enemy', 53),
    name: '闇の武器匠',
    type: 'enemy',
    category: 'support',
    points: calculateCardPoints(BASE_POINTS.SUPPORT, 'enemy', 5, 1, true),
    effect: {
      type: 'WEAPON_ENHANCEMENT',
      range: 1,
      effectMultiplier: 2.5,
      power: 40
    },
    turn: 5
  }),
  createCard({
    id: generateCardId('support', 'enemy', 54),
    name: '破滅の戦旗',
    type: 'enemy',
    category: 'support',
    points: calculateCardPoints(BASE_POINTS.SUPPORT, 'enemy', 5, 1, true),
    effect: {
      type: 'ROW_COLUMN_BUFF',
      power: EFFECT_VALUES.VERTICAL * 0.8,
      targetDirection: 'vertical'
    },
    turn: 5
  }),
  createCard({
    id: generateCardId('support', 'enemy', 55),
    name: '闇の戦術書',
    type: 'enemy',
    category: 'support',
    points: calculateCardPoints(BASE_POINTS.SUPPORT, 'enemy', 5, 1, true),
    effect: {
      type: 'ROW_COLUMN_BUFF',
      power: EFFECT_VALUES.HORIZONTAL * 0.8,
      targetDirection: 'horizontal'
    },
    turn: 5
  })
];