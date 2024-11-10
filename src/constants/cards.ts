// src/constants/cards.ts

import { Card } from '@/types/game';

// 1ターン目：基本ユニット
export const TURN1_CARDS: Card[] = [
  { 
    id: '1',
    type: 'ally',
    category: 'unit',
    name: '民兵',
    points: 90,
    turn: 1
  },
  { 
    id: '2',
    type: 'ally',
    category: 'unit',
    name: '剣士',
    points: 120,
    turn: 1
  },
  { 
    id: '3',
    type: 'ally',
    category: 'unit',
    name: '弓兵',
    points: 80,
    turn: 1
  },
  {
    id: '4',
    type: 'enemy',
    category: 'unit',
    name: 'ゴブリン',
    points: 110,
    turn: 1
  },
  {
    id: '5',
    type: 'enemy',
    category: 'unit',
    name: 'オーク',
    points: 130,
    turn: 1
  },
  {
    id: '6',
    type: 'enemy',
    category: 'unit',
    name: 'コボルド',
    points: 100,
    turn: 1
  }
];

// 2ターン目：効果ユニット
export const TURN2_CARDS: Card[] = [
  {
    id: '7',
    type: 'ally',
    category: 'unit',
    name: '騎士',
    points: 130,
    effect: {
      type: 'ADJACENT_UNIT_BUFF',
      power: 30
    },
    turn: 2
  },
  {
    id: '8',
    type: 'ally',
    category: 'unit',
    name: '槍兵',
    points: 100,
    effect: {
      type: 'SELF_POWER_UP_BY_ENEMY_LINE',
      power: 60
    },
    turn: 2
  },
  {
    id: '9',
    type: 'ally',
    category: 'unit',
    name: '盾兵',
    points: 90,
    effect: {
      type: 'SELF_POWER_UP_BY_ADJACENT_ALLY',
      power: 20
    },
    turn: 2
  },
  {
    id: '10',
    type: 'enemy',
    category: 'unit',
    name: 'トロル',
    points: 160,
    effect: {
      type: 'ADJACENT_UNIT_DEBUFF',
      power: 20
    },
    turn: 2
  },
  {
    id: '11',
    type: 'enemy',
    category: 'unit',
    name: 'ダークエルフ',
    points: 120,
    effect: {
      type: 'ADJACENT_UNIT_BUFF',
      power: 30
    },
    turn: 2
  }
];

// 3ターン目：フィールドカード
export const TURN3_CARDS: Card[] = [
  {
    id: '13',
    type: 'ally',
    category: 'field',
    name: '要塞',
    points: 60,
    effect: {
      type: 'FIELD_UNIT_BUFF',
      power: 50,
      range: 1
    },
    turn: 3
  },
  {
    id: '14',
    type: 'ally',
    category: 'field',
    name: '魔法陣',
    points: 80,
    effect: {
      type: 'FIELD_UNIT_BUFF',
      power: 30,
      range: 2
    },
    turn: 3
  },
  {
    id: '15',
    type: 'enemy',
    category: 'field',
    name: '魔界門',
    points: 160,
    effect: {
      type: 'FIELD_UNIT_BUFF',
      power: 50,
      range: 1
    },
    turn: 3
  },
  {
    id: '16',
    type: 'enemy',
    category: 'field',
    name: '死霊の祭壇',
    points: 110,
    effect: {
      type: 'FIELD_UNIT_BUFF',
      power: 30,
      range: 2
    },
    turn: 3
  }
];