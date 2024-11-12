import { Card } from '@/types';

export const TURN2_CARDS: Card[] = [
    {
      id: '7',
      type: 'ally',
      category: 'unit',
      name: '騎士',
      points: 130,
      class: 'knight',
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
      class: 'lancer',
      effect: {
        type: 'SELF_POWER_UP_BY_ENEMY_LINE',
        power: 60,
        targetDirection: 'horizontal' // 横方向のみチェックするように修正
      },
      turn: 2
    },
    {
      id: '9',
      type: 'ally',
      category: 'unit',
      name: '盾兵',
      class: 'warrior',
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
      class: 'warrior',
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
      class: 'archer',
      effect: {
        type: 'ADJACENT_UNIT_BUFF',
        power: 30
      },
      turn: 2
    }
  ];