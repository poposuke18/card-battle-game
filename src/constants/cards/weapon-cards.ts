import { Card } from '@/types';

export const TURN4_CARDS: Card[] = [
    // 味方武器カード
    {
        id: '17',
        type: 'ally',
        category: 'weapon',
        name: '聖なる剣',
        points: 40,
        effect: {
          type: 'VERTICAL_BOOST',    // 上下の戦士のみに効果
          targetClass: 'warrior',
          power: 60
        },
        turn: 4
      },
    {
      id: '18',
      type: 'ally',
      category: 'weapon',
      name: '精霊の弓',
      points: 30,
      effect: {
        type: 'DIAGONAL_BOOST',
        targetClass: 'archer',
        power: 50
      },
      turn: 4
    },
    {
      id: '25',
      type: 'ally',
      category: 'weapon',
      name: '聖騎士の大盾',
      points: 35,
      effect: {
        type: 'CROSS_FORMATION',
        targetClass: 'guardian',
        power: 45
      },
      turn: 4
    },
    {
      id: '19',
      type: 'ally',
      category: 'weapon',
      name: '賢者の杖',
      points: 35,
      effect: {
        type: 'CROSS_FORMATION',
        targetClass: 'mage',
        power: 55
      },
      turn: 4
    },
    {
        id: '18',
        type: 'ally',
        category: 'weapon',
        name: '精霊の槍',
        points: 30,
        effect: {
          type: 'HORIZONTAL_BOOST',  // 左右の槍兵のみに効果
          targetClass: 'lancer',
          power: 50
        },
        turn: 4
      },
    // 敵武器カード
    {
      id: '21',
      type: 'enemy',
      category: 'weapon',
      name: '混沌の剣',
      points: 50,
      effect: {
        type: 'VERTICAL_BOOST',
        targetClass: 'warrior',
        power: 65
      },
      turn: 4
    },
    {
      id: '26',
      type: 'enemy',
      category: 'weapon',
      name: '魔族の鋼鉄盾',
      points: 40,
      effect: {
        type: 'CROSS_FORMATION',
        targetClass: 'guardian',
        power: 50
      },
      turn: 4
    },
    {
      id: '22',
      type: 'enemy',
      category: 'weapon',
      name: '死霊の弓',
      points: 40,
      effect: {
        type: 'DIAGONAL_BOOST',
        targetClass: 'archer',
        power: 55
      },
      turn: 4
    },
    {
      id: '23',
      type: 'enemy',
      category: 'weapon',
      name: '闇魔術師の杖',
      points: 45,
      effect: {
        type: 'CROSS_FORMATION',
        targetClass: 'mage',
        power: 60
      },
      turn: 4
    },
    {
      id: '24',
      type: 'enemy',
      category: 'weapon',
      name: '死霊騎士の槍',
      points: 55,
      effect: {
        type: 'HORIZONTAL_BOOST',
        targetClass: 'knight',
        power: 75
      },
      turn: 4
    }
  ];