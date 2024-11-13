// src/constants/cards/reinforcement-cards.ts

import { Card } from '@/types';

export const TURN5_CARDS: Card[] = [
  // 味方カード
  {
    id: '25',
    type: 'ally',
    category: 'unit',
    name: '指揮官',
    points: 50,
    class: 'knight',
    effect: {
      type: 'FIELD_CLASS_POWER_UP',
      classEffects: [
        { class: 'warrior', power: 10 },
        { class: 'archer', power: 20 },
        { class: 'knight', power: 40 }
      ],
      range: 2
    },
    turn: 5
  },
  {
    id: '26',
    type: 'ally',
    category: 'unit',
    name: '魔導師',
    points: 80,
    class: 'mage',
    effect: {
      type: 'FIELD_CLASS_POWER_UP',
      classEffects: [
        { class: 'mage', power: 50 },
        { class: 'archer', power: 30 },
        { class: 'lancer', power: 20 }
      ],
      range: 2
    },
    turn: 5
  },
  {
    id: '27',
    type: 'ally',
    category: 'support',
    name: '勝利の旗印',
    points: 20,
    effect: {
      type: 'ROW_COLUMN_BUFF',
      power: 20,
      targetDirection: 'vertical'
    },
    turn: 5
  },
  {
    id: '28',
    type: 'ally',
    category: 'support',
    name: '英雄の詩',
    points: 30,
    effect: {
      type: 'ROW_COLUMN_BUFF',
      power: 30,
      targetDirection: 'horizontal'
    },
    turn: 5
  },
  {
    id: '29',
    type: 'ally',
    category: 'support',
    name: '武器職人',
    points: 40,
    effect: {
      type: 'WEAPON_ENHANCEMENT',
      range: 1,
      // pointsBonusとpowerBonusを削除し、新しい効果を追加
      effectMultiplier: 2  // 武器カードの効果を2倍にする
    },
    turn: 5
  },
  
  // 敵カード
  {
    id: '30',
    type: 'enemy',
    category: 'unit',
    name: '闇の指揮官',
    points: 100,
    class: 'knight',
    effect: {
      type: 'FIELD_CLASS_POWER_UP',
      classEffects: [
        { class: 'warrior', power: 30 },
        { class: 'archer', power: 40 },
        { class: 'knight', power: 50 }
      ],
      range: 2
    },
    turn: 5
  },
  {
    id: '31',
    type: 'enemy',
    category: 'support',
    name: '破滅の戦旗',
    points: 80,
    effect: {
      type: 'ROW_COLUMN_BUFF',
      power: 40,
      targetDirection: 'vertical'
    },
    turn: 5
  },
  {
    id: '32',
    type: 'enemy',
    category: 'unit',
    name: '死霊魔導師',
    points: 130,
    class: 'mage',
    effect: {
      type: 'FIELD_CLASS_POWER_UP',
      classEffects: [
        { class: 'mage', power: 90 },
        { class: 'lancer', power: 30 },
        { class: 'archer', power: 20 }
      ],
      range: 2
    },
    turn: 5
  },
  {
    id: '33',
    type: 'enemy',
    category: 'support',
    name: '闇の武器匠',
    points: 110,
    effect: {
      type: 'WEAPON_ENHANCEMENT',
      range: 1,
      effectMultiplier: 2  // 武器カードの効果を2倍にする
    },
    turn: 5
  }
];