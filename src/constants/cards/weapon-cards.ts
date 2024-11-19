import { createCard, generateCardId, BASE_POINTS, EFFECT_VALUES, calculateCardPoints } from './card-base';
import type { Card } from '@/types';


export const TURN4_CARDS: Card[] = [
  // 味方武器カード
  createCard({
    id: generateCardId('weapon', 'ally', 41),
    name: '聖なる剣',
    type: 'ally',
    category: 'weapon',
    points: calculateCardPoints(BASE_POINTS.WEAPON, 'ally', 4, 1, true),
    effect: {
      type: 'VERTICAL_BOOST',
      targetClass: 'warrior',
      power: EFFECT_VALUES.VERTICAL
    },
    turn: 4
  }),
  createCard({
    id: generateCardId('weapon', 'ally', 42),
    name: '精霊の弓',
    type: 'ally',
    category: 'weapon',
    points: calculateCardPoints(BASE_POINTS.WEAPON, 'ally', 4, 1, true),
    effect: {
      type: 'DIAGONAL_BOOST',
      targetClass: 'archer',
      power: EFFECT_VALUES.DIAGONAL
    },
    turn: 4
  }),
  createCard({
    id: generateCardId('weapon', 'ally', 43),
    name: '聖騎士の大盾',
    type: 'ally',
    category: 'weapon',
    points: calculateCardPoints(BASE_POINTS.WEAPON, 'ally', 4, 1, true),
    effect: {
      type: 'CROSS_FORMATION',
      targetClass: 'guardian',
      power: EFFECT_VALUES.ADJACENT
    },
    turn: 4
  }),
  createCard({
    id: generateCardId('weapon', 'ally', 45),
    name: '精霊の槍',
    type: 'ally',
    category: 'weapon',
    points: calculateCardPoints(BASE_POINTS.WEAPON, 'ally', 4, 1, true),
    effect: {
      type: 'HORIZONTAL_BOOST',
      targetClass: 'lancer',  // 槍兵のみに効果を与えるように修正
      power: EFFECT_VALUES.HORIZONTAL
    },
    turn: 4
  }),
  createCard({
    id: generateCardId('weapon', 'ally', 44),
    name: '賢者の杖',
    type: 'ally',
    category: 'weapon',
    points: calculateCardPoints(BASE_POINTS.WEAPON, 'ally', 4, 1, true),
    effect: {
      type: 'CROSS_FORMATION',
      targetClass: 'mage',
      power: EFFECT_VALUES.ADJACENT
    },
    turn: 4
  }),

  // 敵武器カード
  createCard({
    id: generateCardId('weapon', 'enemy', 41),
    name: '混沌の剣',
    type: 'enemy',
    category: 'weapon',
    points: calculateCardPoints(BASE_POINTS.WEAPON, 'enemy', 4, 1, true),
    effect: {
      type: 'VERTICAL_BOOST',
      targetClass: 'warrior',
      power: EFFECT_VALUES.VERTICAL * 1.4
    },
    turn: 4
  }),
  createCard({
    id: generateCardId('weapon', 'enemy', 42),
    name: '死霊の弓',
    type: 'enemy',
    category: 'weapon',
    points: calculateCardPoints(BASE_POINTS.WEAPON, 'enemy', 4, 1, true),
    effect: {
      type: 'DIAGONAL_BOOST',
      targetClass: 'archer',
      power: EFFECT_VALUES.DIAGONAL * 1.4
    },
    turn: 4
  }),
  createCard({
    id: generateCardId('weapon', 'enemy', 43),
    name: '魔族の鋼鉄盾',
    type: 'enemy',
    category: 'weapon',
    points: calculateCardPoints(BASE_POINTS.WEAPON, 'enemy', 4, 1, true),
    effect: {
      type: 'CROSS_FORMATION',
      targetClass: 'guardian',
      power: EFFECT_VALUES.ADJACENT * 1.4
    },
    turn: 4
  }),
  createCard({
    id: generateCardId('weapon', 'enemy', 44),
    name: '闇魔術師の杖',
    type: 'enemy',
    category: 'weapon',
    points: calculateCardPoints(BASE_POINTS.WEAPON, 'enemy', 4, 1, true),
    effect: {
      type: 'CROSS_FORMATION',
      targetClass: 'mage',
      power: EFFECT_VALUES.ADJACENT * 1.4
    },
    turn: 4
  }),
  createCard({
    id: generateCardId('weapon', 'enemy', 45),
    name: '死霊騎士の槍',
    type: 'enemy',
    category: 'weapon',
    points: calculateCardPoints(BASE_POINTS.WEAPON, 'enemy', 4, 1, true),
    effect: {
      type: 'HORIZONTAL_BOOST',
      targetClass: 'lancer',  // 槍兵のみに効果を与えるように修正
      power: EFFECT_VALUES.HORIZONTAL * 1.4
    },
    turn: 4
  })
];