import { Card } from '@/types';

// 1ターン目：基本ユニット
export const TURN1_CARDS: Card[] = [
  { 
    id: '1',
    type: 'ally',
    category: 'unit',
    name: '民兵',
    points: 90,
    class: 'warrior',
    turn: 1
  },
  { 
    id: '2',
    type: 'ally',
    category: 'unit',
    name: '剣士',
    points: 120,
    class: 'warrior',
    turn: 1
  },
  { 
    id: '3',
    type: 'ally',
    category: 'unit',
    name: '弓兵',
    points: 80,
    class: 'archer',
    turn: 1
  },
  {
    id: '4',
    type: 'enemy',
    category: 'unit',
    name: 'ゴブリン',
    points: 110,
    class: 'warrior',
    turn: 1
  },
  {
    id: '5',
    type: 'enemy',
    category: 'unit',
    name: 'オーク',
    points: 130,
    class: 'warrior',
    turn: 1
  },
  {
    id: '6',
    type: 'enemy',
    category: 'unit',
    name: 'コボルド',
    points: 100,
    class: 'warrior',
    turn: 1
  }
];