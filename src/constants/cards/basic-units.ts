// src/constants/cards/basic-units.ts

import { createCard, generateCardId, BASE_POINTS, calculateCardPoints } from './card-base';
import type { Card } from '@/types';

// 1ターン目の全カード
export const TURN1_CARDS: Card[] = [
  // 味方ユニット
  createCard({
    id: generateCardId('unit', 'ally', 11),
    name: '民兵',
    type: 'ally',
    category: 'unit',
    class: 'warrior',
    points: calculateCardPoints(BASE_POINTS.UNIT.warrior, 'ally', 1),
    turn: 1
  }),
  createCard({
    id: generateCardId('unit', 'ally', 12),
    name: '盾兵',
    type: 'ally',
    category: 'unit',
    class: 'guardian',
    points: calculateCardPoints(BASE_POINTS.UNIT.guardian, 'ally', 1),
    turn: 1
  }),
  createCard({
    id: generateCardId('unit', 'ally', 13),
    name: '弓兵',
    type: 'ally',
    category: 'unit',
    class: 'archer',
    points: calculateCardPoints(BASE_POINTS.UNIT.archer, 'ally', 1),
    turn: 1
  }),
  createCard({
    id: generateCardId('unit', 'ally', 14),
    name: '見習い魔法使い',
    type: 'ally',
    category: 'unit',
    class: 'mage',
    points: calculateCardPoints(BASE_POINTS.UNIT.mage, 'ally', 1),
    turn: 1
  }),
  createCard({
    id: generateCardId('unit', 'ally', 15),
    name: '槍兵',
    type: 'ally',
    category: 'unit',
    class: 'lancer',
    points: calculateCardPoints(BASE_POINTS.UNIT.lancer, 'ally', 1),
    turn: 1
  }),

  // 敵ユニット
  createCard({
    id: generateCardId('unit', 'enemy', 11),
    name: 'ゴブリンウォーリアー',
    type: 'enemy',
    category: 'unit',
    class: 'warrior',
    points: calculateCardPoints(BASE_POINTS.UNIT.warrior, 'enemy', 1),
    turn: 1
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 12),
    name: 'オーグガードディアン',
    type: 'enemy',
    category: 'unit',
    class: 'guardian',
    points: calculateCardPoints(BASE_POINTS.UNIT.guardian, 'enemy', 1),
    turn: 1
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 13),
    name: 'コボルドアーチャー',
    type: 'enemy',
    category: 'unit',
    class: 'archer',
    points: calculateCardPoints(BASE_POINTS.UNIT.archer, 'enemy', 1),
    turn: 1
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 14),
    name: 'コボルドメイジ',
    type: 'enemy',
    category: 'unit',
    class: 'mage',
    points: calculateCardPoints(BASE_POINTS.UNIT.mage, 'enemy', 1),
    turn: 1
  }),
  createCard({
    id: generateCardId('unit', 'enemy', 15),
    name: 'ゴブリンランサー',
    type: 'enemy',
    category: 'unit',
    class: 'lancer',
    points: calculateCardPoints(BASE_POINTS.UNIT.lancer, 'enemy', 1),
    turn: 1
  })
];