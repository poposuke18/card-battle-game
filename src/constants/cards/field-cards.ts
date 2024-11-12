import { Card } from '@/types';
export const TURN3_CARDS: Card[] = [
    {
      id: '13',
      type: 'ally',
      category: 'field',
      name: '要塞',
      points: 60,
      class: null,
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
      class: null,
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
      class: null,
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
      class: null,
      effect: {
        type: 'FIELD_UNIT_BUFF',
        power: 30,
        range: 2
      },
      turn: 3
    }
  ];