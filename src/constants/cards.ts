// src/constants/cards.ts

import { Card } from '@/types/game';

// ターン1の基本ユニット
export const TURN1_CARDS: Card[] = [
  { 
    id: '1',
    type: 'ally',
    name: '民兵',
    points: 100,
  },
  { 
    id: '2',
    type: 'ally',
    name: '剣士',
    points: 110,
  },
  { 
    id: '3',
    type: 'ally',
    name: '弓兵',
    points: 90,
  },
  {
    id: '4',
    type: 'enemy',
    name: 'ゴブリン',
    points: 100,
  },
  {
    id: '5',
    type: 'enemy',
    name: 'オーク',
    points: 120,
  },
  {
    id: '6',
    type: 'enemy',
    name: 'コボルド',
    points: 90,
  }
];

// ターン2の効果付きユニット
export const TURN2_CARDS: Card[] = [
  {
    id: '7',
    type: 'ally',
    name: '騎士',
    points: 130,
    effect: {
      type: 'BUFF_ADJACENT',
      power: 30
    }
  },
  {
    id: '8',
    type: 'ally',
    name: '槍兵',
    points: 90,
    effect: {
      type: 'POWER_UP_BY_ENEMY_LINE',
      power: 60
    }
  },
  {
    id: '9',
    type: 'ally',
    name: '魔術師',
    points: 70,
    effect: {
      type: 'RANGE_BUFF',
      power: 20,
      range: 2
    }
  },
  {
    id: '10',
    type: 'enemy',
    name: 'トロル',
    points: 140,
    effect: {
      type: 'DAMAGE_ADJACENT',
      power: 20
    }
  },
  {
    id: '11',
    type: 'enemy',
    name: 'ダークエルフ',
    points: 120,
    effect: {
      type: 'BUFF_ADJACENT',
      power: 30
    }
  },
  {
    id: '12',
    type: 'enemy',
    name: 'ネクロマンサー',
    points: 100,
    effect: {
      type: 'RANGE_BUFF',
      power: 25,
      range: 2
    }
  }
];

// ターン3のフィールドカード
export const TURN3_CARDS: Card[] = [
  {
    id: '13',
    type: 'ally',
    name: '要塞',
    points: 150,
    effect: {
      type: 'FIELD_BUFF',
      power: 50,
      range: 1
    }
  },
  {
    id: '14',
    type: 'ally',
    name: '魔法陣',
    points: 120,
    effect: {
      type: 'FIELD_BUFF',
      power: 30,
      range: 2
    }
  },
  {
    id: '15',
    type: 'enemy',
    name: '魔界門',
    points: 150,
    effect: {
      type: 'FIELD_BUFF',
      power: 50,
      range: 1
    }
  },
  {
    id: '16',
    type: 'enemy',
    name: '死霊の祭壇',
    points: 120,
    effect: {
      type: 'FIELD_BUFF',
      power: 30,
      range: 2
    }
  }
];