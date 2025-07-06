import { createCard, generateCardId, BASE_POINTS, EFFECT_VALUES } from './card-base';
import type { Card, LegendaryEffect } from '@/types';

function calculateLegendaryPoints(basePoint: number, type: 'ally' | 'enemy'): number {
  const legendaryMultiplier = type === 'ally' ? 2.5 : 3.0;
  const rawPoints = basePoint * legendaryMultiplier;
  return Math.round(rawPoints / 10) * 10;
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
      type: 'LEGENDARY_ARTHUR',
      range: 1,
      power: 60,
      weaponMultiplier: 2
    },
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
      type: 'LEGENDARY_EMILIA',
      range: 1,
      supportMultiplier: 3
    },
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
      range: 1,
      power: 120
    },
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
      type: 'LEGENDARY_VARGA',
      range: 1,
      power: 160
    },
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
      type: 'LEGENDARY_NECRO',
      range: 2,
      weaponMultiplier: 3,
      supportMultiplier: 3
    },
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
      type: 'LEGENDARY_ZARON',
      power: 70
    },
    turn: 7
  })
];